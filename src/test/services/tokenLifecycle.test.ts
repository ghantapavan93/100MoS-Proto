import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import db from '../../lib/db';
import { ProviderSyncService } from '../../lib/services/providerSyncService';

describe('Token Lifecycle', () => {
    beforeAll(() => {
        // Ensure clean slate
        db.prepare('DELETE FROM provider_connections').run();
        db.prepare('DELETE FROM users').run();
        db.prepare('DELETE FROM simulator_flags').run();
        db.prepare('INSERT INTO simulator_flags (id) VALUES (1)').run();
    });

    beforeEach(() => {
        db.prepare('DELETE FROM provider_connections').run();
        db.prepare('DELETE FROM incidents').run();
        db.prepare('DELETE FROM sync_runs').run();
        db.prepare('DELETE FROM activities').run();
        db.prepare('DELETE FROM activity_corrections').run();
        db.prepare('DELETE FROM user_aggregates').run();

        // Clear users and seed them to satisfy Foreign Key constraints
        db.prepare('DELETE FROM users').run();
        const insertUser = db.prepare('INSERT INTO users (id) VALUES (?)');
        ['u1', 'u2', 'u3', 'u4'].forEach(id => insertUser.run(id));

        db.prepare('UPDATE simulator_flags SET outage = 0, delay = 0, rate_limit = 0 WHERE id = 1').run();
    });

    it('should auto-create active connection on first sync', async () => {
        const res = await ProviderSyncService.syncUser('u1', 'strava');
        expect(res.status).toBe('success');

        const conn = db.prepare('SELECT * FROM provider_connections WHERE user_id = ?').get('u1') as any;
        expect(conn.status).toBe('active');
        expect(new Date(conn.expires_at).getTime()).toBeGreaterThan(Date.now());
    });

    it('should block sync if token is revoked', async () => {
        // Setup revoked connection
        db.prepare(`
            INSERT INTO provider_connections (user_id, provider, status, expires_at)
            VALUES (?, ?, ?, ?)
        `).run('u2', 'strava', 'revoked', new Date().toISOString());

        const res = await ProviderSyncService.syncUser('u2', 'strava');
        expect(res.status).toBe('error');
        expect(res.message).toContain('revoked');
    });

    it('should attempt refresh if token is expired', async () => {
        // Setup expired connection
        const yesterday = new Date(Date.now() - 86400000).toISOString();
        db.prepare(`
            INSERT INTO provider_connections (user_id, provider, status, expires_at)
            VALUES (?, ?, ?, ?)
        `).run('u3', 'strava', 'active', yesterday);

        // Sync should trigger refresh
        const res = await ProviderSyncService.syncUser('u3', 'strava');
        expect(res.status).toBe('success'); // Should succeed after refresh

        const conn = db.prepare('SELECT * FROM provider_connections WHERE user_id = ?').get('u3') as any;
        expect(new Date(conn.expires_at).getTime()).toBeGreaterThan(Date.now());
        expect(conn.last_refresh_at).not.toBeNull();
    });

    it('should fail refresh if simulator outage is active', async () => {
        // Setup expired connection
        const yesterday = new Date(Date.now() - 86400000).toISOString();
        db.prepare(`
             INSERT INTO provider_connections (user_id, provider, status, expires_at)
             VALUES (?, ?, ?, ?)
         `).run('u4', 'strava', 'active', yesterday);

        // Turn on outage
        db.prepare('UPDATE simulator_flags SET outage = 1 WHERE id = 1').run();

        const res = await ProviderSyncService.syncUser('u4', 'strava');
        expect(res.status).toBe('error');
        expect(res.message).toContain('refresh failed');

        // Verify incident logged
        const incident = db.prepare('SELECT * FROM incidents WHERE type = ?').get('error') as any;
        expect(incident).toBeDefined();
        expect(incident.msg).toContain('OAuth refresh failed');
    });
});
