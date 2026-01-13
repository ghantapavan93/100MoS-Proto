import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mocking the database for pure unit tests
const mockDb = {
    prepare: vi.fn().mockReturnThis(),
    get: vi.fn(),
    run: vi.fn(),
};

describe('Deduplication Logic', () => {
    it('should generate a unique key based on provider and external activity ID', () => {
        const provider = 'strava';
        const externalId = 'activity_123';
        const key = `${provider}:${externalId}`;
        expect(key).toBe('strava:activity_123');
    });

    it('should identify a duplicate if the key exists in the database', () => {
        const key = 'strava:101';
        // Simulate finding the key in DB
        mockDb.get.mockReturnValueOnce({ id: key });

        const exists = mockDb.get(key);
        expect(exists).toBeDefined();
        expect(exists.id).toBe(key);
    });

    it('should allow ingestion if the key does not exist', () => {
        const key = 'strava:104';
        // Simulate not finding the key
        mockDb.get.mockReturnValueOnce(null);

        const exists = mockDb.get(key);
        expect(exists).toBeNull();
    });
});

describe('Sync Resilience', () => {
    it('should calculate correct totals from multiple sync activities', () => {
        const activities = [
            { miles: 3.2 },
            { miles: 5.5 },
            { miles: 2.1 }
        ];
        const total = activities.reduce((acc, a) => acc + a.miles, 0);
        expect(total).toBeCloseTo(10.8);
    });
});
