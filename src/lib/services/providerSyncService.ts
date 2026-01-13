import db from '../db';
import { Activity } from '../demoStore';
import { ActivityService } from './activityService';

export interface SyncResult {
    added: number;
    dupes: number;
    status: 'success' | 'rate_limited' | 'error';
    message?: string;
}

export class ProviderSyncService {

    /**
     * Simulator flags to intercept real logic.
     */
    static getSimulatorFlags() {
        return db.prepare('SELECT * FROM simulator_flags WHERE id = 1').get() as any;
    }

    /**
     * Main entry point to sync a user's activities from a provider.
     */
    static async syncUser(userId: string, provider: 'strava' | 'garmin' | 'apple'): Promise<SyncResult> {
        // 1. Token Lifecycle Check
        const tokenInfo = this.getConnectionDetails(userId, provider);

        if (tokenInfo.status === 'revoked') {
            this.logSyncRun(userId, provider, 'error', 0, 0, 0, 0);
            return { status: 'error', added: 0, dupes: 0, message: 'Connection revoked. Please reconnect.' };
        }

        if (tokenInfo.status === 'expired') {
            const refreshed = this.refreshSimulatedToken(userId, provider);
            if (!refreshed) {
                db.prepare('INSERT INTO incidents (msg, type) VALUES (?, ?)').run(`OAuth refresh failed for user ${userId.slice(0, 4)}`, 'error');
                this.logSyncRun(userId, provider, 'error', 0, 0, 0, 0);
                return { status: 'error', added: 0, dupes: 0, message: 'Token expired and refresh failed.' };
            }
        }

        const flags = this.getSimulatorFlags();

        if (flags.outage) {
            this.logSyncRun(userId, provider, 'outage');
            return { status: 'error', added: 0, dupes: 0, message: "Provider API is currently experiencing an outage." };
        }

        if (flags.rate_limit) {
            this.logSyncRun(userId, provider, 'rate_limited', 0, 0, 0, 1);
            return { added: 0, dupes: 0, status: 'rate_limited', message: "API Rate Limit Exceeded" };
        }

        if (flags.delay) {
            await new Promise(r => setTimeout(r, 2000));
        }

        try {
            const fetchedActivities = await this.fetchMockActivitiesFromProvider(provider);
            const { added, dupes } = ActivityService.insertActivities(userId, fetchedActivities);
            this.logSyncRun(userId, provider, 'success', added, dupes);
            return { added, dupes, status: 'success' };
        } catch (error) {
            console.error("Sync Error:", error);
            this.logSyncRun(userId, provider, 'error');
            return { added: 0, dupes: 0, status: 'error', message: "Internal Sync Error" };
        }
    }

    /**
     * Exposes token details for UI/API consumption.
     */
    static getConnectionDetails(userId: string, provider: string): { status: 'active' | 'expired' | 'revoked', expires_at: string } {
        const conn = db.prepare('SELECT status, expires_at FROM provider_connections WHERE user_id = ? AND provider = ?').get(userId, provider) as any;

        if (!conn) {
            const defaultExpiry = new Date(Date.now() + 86400000).toISOString();
            db.prepare(`
                INSERT INTO provider_connections (user_id, provider, status, expires_at) 
                VALUES (?, ?, ?, ?)
            `).run(userId, provider, 'active', defaultExpiry);
            return { status: 'active', expires_at: defaultExpiry };
        }

        let status: 'active' | 'expired' | 'revoked' = conn.status;
        if (status !== 'revoked' && new Date(conn.expires_at).getTime() < Date.now()) {
            status = 'expired';
        }

        return { status, expires_at: conn.expires_at };
    }

    /**
     * Simulates a token refresh flow.
     */
    static refreshSimulatedToken(userId: string, provider: string): boolean {
        if (this.getSimulatorFlags().outage) return false;

        try {
            db.prepare(`
                UPDATE provider_connections 
                SET status = 'active', expires_at = ?, last_refresh_at = ? 
                WHERE user_id = ? AND provider = ?
            `).run(
                new Date(Date.now() + 86400000 * 2).toISOString(),
                new Date().toISOString(),
                userId,
                provider
            );
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * Forces a break in the connection for demo purposes.
     */
    static simulateBreak(userId: string, provider: string, type: 'expired' | 'revoked') {
        const expiry = type === 'expired' ? new Date(Date.now() - 1000).toISOString() : new Date(Date.now() + 86400000).toISOString();
        const status = type === 'revoked' ? 'revoked' : 'active';

        db.prepare(`
            UPDATE provider_connections SET status = ?, expires_at = ? 
            WHERE user_id = ? AND provider = ?
        `).run(status, expiry, userId, provider);
    }

    private static async fetchMockActivitiesFromProvider(provider: string): Promise<Activity[]> {
        const now = new Date();
        return [
            {
                provider: provider as any,
                external_activity_id: `evt_${Date.now()}_1`,
                timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 24).toISOString(),
                distance_miles: parseFloat((Math.random() * 5 + 1).toFixed(2)),
                duration_min: 30 + Math.floor(Math.random() * 60)
            },
            {
                provider: provider as any,
                external_activity_id: `evt_${Date.now()}_2`,
                timestamp: now.toISOString(),
                distance_miles: parseFloat((Math.random() * 3 + 1).toFixed(2)),
                duration_min: 20 + Math.floor(Math.random() * 30)
            }
        ];
    }

    private static logSyncRun(userId: string, provider: string, status: string, added = 0, dupes = 0, delayed = 0, rate_limited = 0) {
        db.prepare(`
            INSERT INTO sync_runs (user_id, provider, status, added, dupes, delayed, rate_limited)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(userId, provider, status, added, dupes, delayed, rate_limited);
    }

    static getSyncHistory(userId: string) {
        return db.prepare(`
            SELECT * FROM sync_runs WHERE user_id = ? ORDER BY created_at DESC LIMIT 50
        `).all(userId);
    }
}
