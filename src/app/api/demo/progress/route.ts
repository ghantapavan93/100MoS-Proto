export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { CoachingService } from '@/lib/services/coachingService';

export async function GET(request: NextRequest) {
    const userId = request.cookies.get('demo_user_id')?.value;
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId) as any;
    const userState = db.prepare('SELECT * FROM user_state WHERE user_id = ?').get(userId) as any;

    // Performance Fix: Read O(1) aggregate instead of O(N) scan
    const aggregate = db.prepare('SELECT total_miles FROM user_aggregates WHERE user_id = ?').get(userId) as { total_miles: number };
    const totalMiles = aggregate?.total_miles || 0;

    return NextResponse.json({
        miles: totalMiles,
        daysLeft: 52, // Hardcoded for now
        profile: {
            why_statement: user?.why_statement || '',
            care_tags: JSON.parse(user?.care_tags_json || '[]'),
            crew_response: user?.crew_response || '',
        },
        userState: {
            mode: userState?.mode || 'normal',
            modeUntil: userState?.mode_until,
            note: userState?.note
        },
        motivation: CoachingService.getLatestMotivation(userId)
    });
}
