import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import db from '../../lib/db';
import { ProviderSyncService } from '../../lib/services/providerSyncService';

describe('ProviderSyncService', () => {
    beforeAll(() => {
        db.prepare('DELETE FROM sync_runs').run();
        db.prepare('DELETE FROM activities').run();
        db.prepare('DELETE FROM users').run();
        db.prepare("INSERT INTO users (id) VALUES ('sync_user_1')").run();
        db.prepare("INSERT INTO users (id) VALUES ('sync_user_2')").run();
    });

    it('should log a sync run on success', async () => {
        const userId = 'sync_user_1';

        const result = await ProviderSyncService.syncUser(userId, 'strava');

        expect(result.status).toBe('success');

        const history = ProviderSyncService.getSyncHistory(userId);
        expect(history.length).toBeGreaterThan(0);
        expect((history[0] as any).status).toBe('success');
        expect((history[0] as any).provider).toBe('strava');
    });

    it('should respect simulator rate limit flag', async () => {
        // Set flag
        db.prepare('UPDATE simulator_flags SET rate_limit = 1 WHERE id = 1').run();

        const userId = 'sync_user_2';
        const result = await ProviderSyncService.syncUser(userId, 'strava');

        expect(result.status).toBe('rate_limited');

        const history = ProviderSyncService.getSyncHistory(userId);
        expect((history[0] as any).status).toBe('rate_limited');

        // Reset flag
        db.prepare('UPDATE simulator_flags SET rate_limit = 0 WHERE id = 1').run();
    });
});
