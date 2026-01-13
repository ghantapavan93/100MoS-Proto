export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
// import { ActivityService } from '@/lib/services/activityService';

export async function GET(req: Request) {
    // MOCK FOR VERCEL
    const result = {
        items: [
            { id: 'mock_1', provider: 'strava', distance_miles: 5.2, duration_min: 45, timestamp: new Date().toISOString() },
            { id: 'mock_2', provider: 'garmin', distance_miles: 3.1, duration_min: 28, timestamp: new Date(Date.now() - 86400000).toISOString() }
        ],
        nextCursor: null
    };

    return NextResponse.json(result);
}
