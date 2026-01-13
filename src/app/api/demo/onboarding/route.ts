import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import db from '@/lib/db';
import { ProfileSchema } from '@/lib/schemas';

export async function POST(request: NextRequest) {
    const userId = request.cookies.get('demo_user_id')?.value;
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const body = await request.json();
        const profile = ProfileSchema.parse(body);

        db.prepare(`
      INSERT INTO users (id, why_statement, care_tags_json, crew_response)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        why_statement = COALESCE(excluded.why_statement, why_statement),
        care_tags_json = COALESCE(excluded.care_tags_json, care_tags_json),
        crew_response = COALESCE(excluded.crew_response, crew_response)
    `).run(userId, profile.why_statement, JSON.stringify(profile.care_tags), profile.crew_response);

        // Initialize aggregates for new users (prevents null on first Progress API call)
        db.prepare(`
            INSERT INTO user_aggregates (user_id, total_miles)
            VALUES (?, 0)
            ON CONFLICT(user_id) DO NOTHING
        `).run(userId);

        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }
}
