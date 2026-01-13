import db from '../db';

export interface TimelineEvent {
    id: number;
    title: string;
    subtitle: string;
    type: 'sync' | 'audit' | 'incident';
    status: 'success' | 'warning' | 'error' | 'info';
    timestamp: string;
}

export class TimelineService {
    static getTimeline(userId: string, cursor?: string, limit = 20): { items: TimelineEvent[], nextCursor: string | null } {
        // Fetch Sync Runs
        let syncSql = `
            SELECT id, provider, status, added, dupes, rate_limited, created_at 
            FROM sync_runs 
            WHERE user_id = ? 
        `;
        if (cursor) syncSql += ` AND created_at < ? `;
        syncSql += ` ORDER BY created_at DESC LIMIT ?`;

        const syncArgs = cursor ? [userId, cursor, limit] : [userId, limit];
        const syncs = db.prepare(syncSql).all(...syncArgs) as any[];

        // Fetch Ops Audit Logs targeting this user
        let auditSql = `
            SELECT id, action, admin_id, created_at 
            FROM ops_audit_log 
            WHERE target_id = ? 
        `;
        if (cursor) auditSql += ` AND created_at < ? `;
        auditSql += ` ORDER BY created_at DESC LIMIT ?`;

        const auditArgs = cursor ? [userId, cursor, limit] : [userId, limit];
        const audits = db.prepare(auditSql).all(...auditArgs) as any[];

        // Combine and format
        const events: TimelineEvent[] = [];

        syncs.forEach(sync => {
            let title = `Synced ${sync.provider}`;
            let subtitle = `${sync.added} activities added`;
            let status: TimelineEvent['status'] = 'success';

            if (sync.dupes > 0) subtitle += `, ${sync.dupes} duplicates detected`;

            if (sync.status === 'rate_limited') {
                title = `Rate Limit Reached (${sync.provider})`;
                subtitle = "Retry scheduled automatically";
                status = 'warning';
            } else if (sync.status === 'error' || sync.status === 'outage') {
                title = `Sync Failed (${sync.provider})`;
                subtitle = "Provider outage detected";
                status = 'error';
            }

            events.push({
                id: sync.id,
                title,
                subtitle,
                type: 'sync',
                status,
                timestamp: sync.created_at
            });
        });

        audits.forEach(audit => {
            events.push({
                id: audit.id,
                title: `Ops Action: ${audit.action}`,
                subtitle: `Performed by ${audit.admin_id}`,
                type: 'audit',
                status: 'info',
                timestamp: audit.created_at
            });
        });

        const sorted = events
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, limit);

        const nextCursor = sorted.length === limit ? sorted[sorted.length - 1].timestamp : null;

        return {
            items: sorted,
            nextCursor
        };
    }
}
