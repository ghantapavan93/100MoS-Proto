import db from '../db';

export class PrivacyService {
    /**
     * Aggregates all data for a user into a single JSON object.
     */
    static exportUserData(userId: string) {
        const profile = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
        const activities = db.prepare('SELECT * FROM activities WHERE user_id = ?').all(userId);
        const aggregates = db.prepare('SELECT * FROM user_aggregates WHERE user_id = ?').get(userId);
        const syncRuns = db.prepare('SELECT * FROM sync_runs WHERE user_id = ?').all(userId);
        const crewMembership = db.prepare('SELECT * FROM crew_membership WHERE user_id = ?').all(userId);
        const userState = db.prepare('SELECT * FROM user_state WHERE user_id = ?').get(userId);

        return {
            metadata: {
                exported_at: new Date().toISOString(),
                version: "1.0"
            },
            profile,
            activities,
            aggregates,
            syncRuns,
            crewMembership,
            userState
        };
    }

    /**
     * Perfroms a hard deletion of all user data.
     */
    static deleteUserData(userId: string) {
        const transaction = db.transaction(() => {
            // Delete in order of dependencies (though SQLite FKs would handle if configured)
            db.prepare('DELETE FROM activity_notes WHERE activity_id IN (SELECT id FROM activities WHERE user_id = ?)').run(userId);
            db.prepare('DELETE FROM activity_corrections WHERE user_id = ?').run(userId);
            db.prepare('DELETE FROM activities WHERE user_id = ?').run(userId);
            db.prepare('DELETE FROM user_aggregates WHERE user_id = ?').run(userId);
            db.prepare('DELETE FROM sync_runs WHERE user_id = ?').run(userId);
            db.prepare('DELETE FROM crew_membership WHERE user_id = ?').run(userId);
            db.prepare('DELETE FROM user_state WHERE user_id = ?').run(userId);
            db.prepare('DELETE FROM user_actions WHERE user_id = ?').run(userId);
            db.prepare('DELETE FROM motivation_events WHERE user_id = ?').run(userId);
            db.prepare('DELETE FROM users WHERE id = ?').run(userId);
        });

        transaction();
    }
}
