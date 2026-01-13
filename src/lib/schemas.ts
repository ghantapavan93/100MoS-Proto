import { z } from 'zod';

export const ProfileSchema = z.object({
    why_statement: z.string().max(500).optional(),
    care_tags: z.array(z.string()).optional(),
    crew_response: z.string().max(140).optional(),
});

export const SyncStreamRequestSchema = z.object({
    provider: z.enum(['strava', 'garmin', 'apple_health']),
});

export const SimulationFlagsSchema = z.object({
    rate_limit: z.boolean(),
    delay: z.boolean(),
    duplicates: z.boolean(),
    outage: z.boolean(),
});

export const OpsMetricsSchema = z.object({
    activeUsers: z.number(),
    totalMiles: z.number(),
    providerHealth: z.record(z.string(), z.object({
        successRate: z.number(),
        errorRate: z.number(),
        avgLatency: z.number(),
    })),
    recentIncidents: z.array(z.object({
        id: z.number(),
        msg: z.string(),
        type: z.enum(['warning', 'error', 'info']),
        ts: z.string(),
    })),
});
