import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import db from '@/lib/db';

export async function POST(req: NextRequest) {
    const { mode, note } = await req.json();
    const userId = 'demo-user';

    try {
        db.prepare(`
            INSERT INTO user_state (user_id, mode, mode_until, note)
            VALUES (?, ?, ?, ?)
            ON CONFLICT(user_id) DO UPDATE SET
                mode = excluded.mode,
                mode_until = excluded.mode_until,
                note = excluded.note
        `).run(
            userId,
            mode,
            mode === 'pit_stop' ? datetime('now', '+3 days') : null,
            note
        );

        return NextResponse.json({ success: true, mode });
    } catch (error: any) {
        // Handle common sqlite error if function doesn't exist
        if (error.message.includes('datetime')) {
            // Fallback if raw SQL execution has issues with nested functions in certain drivers
            db.prepare(`
                INSERT INTO user_state (user_id, mode, note)
                VALUES (?, ?, ?)
                ON CONFLICT(user_id) DO UPDATE SET mode = excluded.mode, note = excluded.note
            `).run(userId, mode, note);
            return NextResponse.json({ success: true, mode });
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// Helper to avoid issues with better-sqlite3 and datetime inside run in some environments
function datetime(val: string, mod: string) {
    const d = new Date();
    if (mod === '+3 days') d.setDate(d.getDate() + 3);
    return d.toISOString();
}
