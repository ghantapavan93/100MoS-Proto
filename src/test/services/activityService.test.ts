import { describe, it, expect, beforeEach } from 'vitest';
import db from '../../lib/db';
import { ActivityService } from '../../lib/services/activityService';
import { Activity } from '../../lib/demoStore';

describe('ActivityService', () => {
    beforeEach(() => {
        db.prepare('DELETE FROM activity_corrections').run();
        db.prepare('DELETE FROM user_aggregates').run();
        db.prepare('DELETE FROM activities').run();
        db.prepare('DELETE FROM users').run();
        db.prepare('INSERT INTO users (id) VALUES (?)').run('test_user_1');
        db.prepare('INSERT INTO users (id) VALUES (?)').run('test-user');
    });

    it('should insert activities and update aggregates correctly', () => {
        const userId = 'test_user_1';
        const activities: Activity[] = [
            {
                provider: 'strava',
                external_activity_id: '101',
                timestamp: '2023-01-01T10:00:00Z',
                distance_miles: 5.0,
                duration_min: 30
            },
            {
                provider: 'strava',
                external_activity_id: '102',
                timestamp: '2023-01-02T10:00:00Z',
                distance_miles: 3.0,
                duration_min: 20
            }
        ];

        const result = ActivityService.insertActivities(userId, activities);
        expect(result.added).toBe(2);
        expect(result.dupes).toBe(0);

        const agg = ActivityService.getAggregates(userId)!;
        expect(agg).toBeDefined();
        // 5 + 3 = 8
        expect(agg.total_miles).toBe(8);
        expect(agg.last_activity_ts).toBe('2023-01-02T10:00:00Z');
    });

    it('should ignore duplicates but allow updates if logic permitted (currently ignore/update)', () => {
        const userId = 'test_user_1';
        const activity: Activity = {
            provider: 'strava',
            external_activity_id: '101',
            timestamp: '2023-01-01T10:00:00Z',
            distance_miles: 5.0,
            duration_min: 30
        };

        ActivityService.insertActivities(userId, [activity]);
        ActivityService.insertActivities(userId, [activity]); // Duplicate

        // But dupes count relies on 'changes == 0' OR 'Constraint'.
        // Let's verify data instead.

        const agg = ActivityService.getAggregates(userId)!;
        expect(agg.total_miles).toBe(5.0);
    });

    it('should correct an activity and update aggregates', () => {
        const userId = 'test_user_1';
        const activityId = 'strava:corr_1';

        // Setup initial
        db.prepare('INSERT OR IGNORE INTO activities (id, user_id, provider, miles, ts) VALUES (?, ?, ?, ?, ?)').run(
            activityId, userId, 'strava', 5, '2023-01-01T12:00:00Z'
        );
        ActivityService.recalculateAggregates(userId);

        ActivityService.correctActivity(userId, activityId, 10, 'gps_error');

        const agg = ActivityService.getAggregates(userId)!;
        expect(agg.total_miles).toBe(10);
    });

    it('should correct an activity and update aggregates (audit trail)', () => {
        // 1. Insert some initial activities
        const userId = 'test-user';
        const activities: Activity[] = [
            {
                provider: 'strava',
                external_activity_id: 'run-100',
                timestamp: '2023-03-01T08:00:00Z',
                distance_miles: 10.0,
                duration_min: 60
            },
            {
                provider: 'strava',
                external_activity_id: 'run-101',
                timestamp: '2023-03-02T09:00:00Z',
                distance_miles: 5.0,
                duration_min: 30
            }
        ];
        ActivityService.insertActivities(userId, activities);

        // 2. Verify initial state
        let totals = ActivityService.getAggregates(userId)!;
        expect(totals.total_miles).toBe(15); // 10 + 5

        // 3. Apply correction (Actually ran 12 miles for run-100)
        // We need the ID constructed in service: provider:external_id
        const activityId = 'strava:run-100';
        ActivityService.correctActivity(userId, activityId, 12, 'GPS error');

        // 4. Verify new totals
        totals = ActivityService.getAggregates(userId)!;
        expect(totals.total_miles).toBe(17); // Should be 12 (corrected) + 5 (original) = 17
    });
});
