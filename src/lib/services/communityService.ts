import db from '../db';

export class CommunityService {
    /**
     * Incremental Aggregator: Updates the daily_stats cache.
     * Called after sync or correction to keep O(1) dashboard performance.
     */
    static refreshDailyStats(day: string, crewId: string = 'global') {
        const stats = db.prepare('SELECT SUM(effective_miles) as total, COUNT(*) as count FROM activity_effective_miles WHERE date(ts) = ?').get(day) as { total: number, count: number };

        db.prepare('INSERT INTO daily_stats (day, crew_id, miles, activity_count) ' +
            'VALUES (?, ?, ?, ?) ' +
            'ON CONFLICT(day, crew_id) DO UPDATE SET ' +
            'miles = excluded.miles, ' +
            'activity_count = excluded.activity_count').run(day, crewId, stats.total || 0, stats.count || 0);
    }

    /**
     * "The Cheer": Real-time engagement for mobile.
     */
    static cheer(fromUserId: string, toUserId: string, activityId: string) {
        // Local Audit
        db.prepare('INSERT INTO incidents (msg, type, user_id) VALUES (?, ?, ?)')
            .run(`User ${fromUserId.slice(0, 4)} cheered for ${toUserId.slice(0, 4)}`, 'info', toUserId);
    }

    /**
     * "Live Pulse": Get miles in the last 24h across the community/crew.
     */
    static getLivePulse(crewId: string = 'global') {
        const today = new Date().toISOString().split('T')[0];
        const res = db.prepare('SELECT miles FROM daily_stats WHERE day = ? AND crew_id = ?').get(today, crewId) as { miles: number };
        return res ? res.miles : 0;
    }

    /**
     * Paginated Leaderboard (Scale ready)
     */
    static getLeaderboard(limit = 10, offset = 0) {
        return db.prepare('SELECT u.id, u.why_statement, ua.total_miles, ua.last_activity_ts ' +
            'FROM users u ' +
            'JOIN user_aggregates ua ON u.id = ua.user_id ' +
            'ORDER BY ua.total_miles DESC ' +
            'LIMIT ? OFFSET ?').all(limit, offset);
    }

    /**
     * Paginated Story Feed (Cursor-based for infinite scroll)
     */
    static getStoryFeed(cursor?: string, limit = 10) {
        // In this demo, 'stories' are prompted entries or high-mileage activities
        const sql = cursor
            ? 'SELECT * FROM activities WHERE is_excluded = 0 AND ts < ? ORDER BY ts DESC LIMIT ?'
            : 'SELECT * FROM activities WHERE is_excluded = 0 ORDER BY ts DESC LIMIT ?';

        const args = cursor ? [cursor, limit] : [limit];
        const items = db.prepare(sql).all(...args) as any[];

        const nextCursor = items.length === limit ? items[items.length - 1].ts : null;

        return { items, nextCursor };
    }
}
