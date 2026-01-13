import db from '../db';
import { prisma } from '../prisma';
import { Activity } from '../demoStore';
import { CommunityService } from './communityService';

export class ActivityService {
    /**
     * Corrects an activity by appending a correction event (Immutable Audit Trail).
     */
    static correctActivity(
        userId: string,
        activityId: string,
        deltaMiles: number,
        reason: string,
        source: string = 'manual'
    ) {
        // 1. Verify ownership (simple check)
        const row = db.prepare('SELECT id FROM activities WHERE id = ? AND user_id = ?').get(activityId, userId);
        if (!row) throw new Error('Activity not found or unauthorized');

        // 2. Insert correction (Additive Delta)
        const result = db.prepare(`
            INSERT INTO activity_corrections (activity_id, user_id, delta_miles, reason, source)
            VALUES (?, ?, ?, ?, ?)
        `).run(activityId, userId, deltaMiles, reason, source);

        // 3. Recalculate totals
        this.recalculateAggregates(userId);

        // 4. Cloud Sync (Async, Non-Blocking)
        if (process.env.ENABLE_CLOUD_SYNC === 'true') {
            this.syncCorrectionToCloud(userId, activityId, deltaMiles, reason, source);
        }

        return result.lastInsertRowid;
    }

    private static async syncCorrectionToCloud(userId: string, activityId: string, deltaMiles: number, reason: string, source: string) {
        try {
            await prisma.activityCorrection.create({
                data: {
                    userId,
                    activityId,
                    deltaMiles,
                    reason,
                    source,
                    createdAt: new Date()
                }
            });
            console.log(`[CloudSync] Correction synced for user ${userId}`);
        } catch (e) {
            console.error(`[CloudSync] Failed to sync correction:`, e);
        }
    }

    static addNote(userId: string, activityId: string, noteText: string) {
        const row = db.prepare('SELECT id FROM activities WHERE id = ? AND user_id = ?').get(activityId, userId);
        if (!row) throw new Error('Activity not found');

        db.prepare('INSERT INTO activity_notes (activity_id, note_text) VALUES (?, ?)').run(activityId, noteText);
    }

    /**
     * Recalculates user aggregates from the source of truth (Activities + Corrections).
     */
    static recalculateAggregates(userId: string) {
        // Use the scale-proof view for performance and consistency
        const agg = db.prepare(`
            SELECT 
                SUM(effective_miles) as total,
                MAX(ts) as last_ts
            FROM activity_effective_miles
            WHERE user_id = ?
        `).get(userId) as { total: number, last_ts: string };

        if (agg) {
            db.prepare(`
                INSERT INTO user_aggregates (user_id, total_miles, last_activity_ts)
                VALUES (?, ?, ?)
                ON CONFLICT(user_id) DO UPDATE SET
                    total_miles = excluded.total_miles,
                    last_activity_ts = excluded.last_activity_ts
            `).run(userId, agg.total || 0, agg.last_ts);
        }
    }

    /**
     * Inserts activities appropriately and updates user aggregates.
     */
    static insertActivities(userId: string, activities: Activity[]) {
        const insertActivity = db.prepare(`
      INSERT INTO activities (id, user_id, provider, external_activity_id, ts, miles, duration, is_excluded, exclusion_reason)
      VALUES (@id, @user_id, @provider, @external_activity_id, @ts, @miles, @duration, @is_excluded, @exclusion_reason)
      ON CONFLICT(provider, external_activity_id) DO UPDATE SET
        miles = excluded.miles,
        duration = excluded.duration,
        ts = excluded.ts,
        is_excluded = excluded.is_excluded,
        exclusion_reason = excluded.exclusion_reason
    `);

        const transaction = db.transaction((activities: Activity[]) => {
            let added = 0;
            let dupes = 0;

            for (const activity of activities) {
                let isExcluded = 0;
                let exclusionReason = null;

                // Elite Integrity Rule #1: Distance Cap
                if (activity.distance_miles > 100) {
                    isExcluded = 1;
                    exclusionReason = "Distance exceeds daily threshold (Suspicious activity)";
                }

                // Elite Integrity Rule #2: Zero/Invalid data
                if (activity.distance_miles <= 0) {
                    isExcluded = 1;
                    exclusionReason = "Zero distance activity filtered";
                }

                const id = activity.provider + ':' + activity.external_activity_id;
                try {
                    const result = insertActivity.run({
                        id,
                        user_id: userId,
                        provider: activity.provider,
                        external_activity_id: activity.external_activity_id,
                        ts: activity.timestamp,
                        miles: activity.distance_miles,
                        duration: activity.duration_min,
                        is_excluded: isExcluded,
                        exclusion_reason: exclusionReason
                    });

                    if (result.changes > 0) {
                        added++;
                    } else {
                        dupes++;
                    }
                } catch (err: any) {
                    if (err.code === 'SQLITE_CONSTRAINT') {
                        dupes++;
                    } else {
                        throw err;
                    }
                }
            }

            // Calls the new smart aggregator
            this.recalculateAggregates(userId);

            // Refreshes the Community Pulse cache for affected days
            const uniqueDays = [...new Set(activities.map(a => a.timestamp.split('T')[0]))];
            uniqueDays.forEach(day => CommunityService.refreshDailyStats(day));

            // Cloud Sync (Native for Mobile Engagement)
            if (process.env.ENABLE_CLOUD_SYNC === 'true') {
                this.syncActivitiesToCloud(userId, activities);
            }

            return { added, dupes };
        });

        return transaction(activities);
    }

    private static async syncActivitiesToCloud(userId: string, activities: Activity[]) {
        try {
            for (const activity of activities) {
                const id = activity.provider + ':' + activity.external_activity_id;
                await prisma.activity.upsert({
                    where: { id },
                    update: {
                        miles: activity.distance_miles,
                        duration: activity.duration_min,
                        ts: new Date(activity.timestamp)
                    },
                    create: {
                        id,
                        userId,
                        provider: activity.provider,
                        externalActivityId: activity.external_activity_id,
                        ts: new Date(activity.timestamp),
                        miles: activity.distance_miles,
                        duration: activity.duration_min,
                        createdAt: new Date()
                    }
                });
            }
            console.log(`[CloudSync] ${activities.length} activities synced to cloud.`);
        } catch (e) {
            console.error(`[CloudSync] Failed to sync activities:`, e);
        }
    }

    static getActivities(userId: string, cursor?: string, limit = 20) {
        // Fetch using effective miles view + latest note join
        let sql = `
            SELECT a.*, v.effective_miles, v.total_correction, v.corrections_count,
            (SELECT note_text FROM activity_notes WHERE activity_id = a.id ORDER BY created_at DESC LIMIT 1) as latest_note
            FROM activities a
            JOIN activity_effective_miles v ON a.id = v.activity_id
            WHERE a.user_id = ?
        `;

        if (cursor) {
            sql += ' AND a.ts < ? ';
        }

        sql += ' ORDER BY a.ts DESC LIMIT ?';

        const args = cursor ? [userId, cursor, limit] : [userId, limit];
        const items = db.prepare(sql).all(...args) as any[];

        const nextCursor = items.length === limit ? items[items.length - 1].ts : null;

        return {
            items,
            nextCursor
        };
    }

    static getAggregates(userId: string): { total_miles: number, last_activity_ts: string } | undefined {
        return db.prepare('SELECT * FROM user_aggregates WHERE user_id = ?').get(userId) as any;
    }
}
