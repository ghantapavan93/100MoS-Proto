import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import db from '@/lib/db';

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const { deltamiles, reason } = await req.json();
    const userId = 'demo-user';

    if (typeof deltamiles !== 'number') {
        return NextResponse.json({ error: 'delta_miles must be a number' }, { status: 400 });
    }

    try {
        // Verify ownership
        const activity = db.prepare('SELECT id FROM activities WHERE id = ? AND user_id = ?').get(id, userId);
        if (!activity) {
            return NextResponse.json({ error: 'Activity not found' }, { status: 404 });
        }

        // Add correction (Additive only)
        const result = db.prepare(`
            INSERT INTO activity_corrections (activity_id, user_id, delta_miles, reason, source)
            VALUES (?, ?, ?, ?, ?)
        `).run(id, userId, deltamiles, reason || 'Manual correction', 'manual');

        // Log action for Undo (with TTL)
        const actionId = `corr_${result.lastInsertRowid}`;
        db.prepare(`
            INSERT INTO user_actions (id, user_id, action_type, payload_json, expires_at)
            VALUES (?, ?, ?, ?, datetime('now', '+1 minute'))
        `).run(
            actionId,
            userId,
            'correct_miles',
            JSON.stringify({ activity_id: id, correction_id: result.lastInsertRowid, delta: deltamiles }),
            // expires_at is handled by SQLite datetime
        );

        return NextResponse.json({
            success: true,
            actionId,
            effective_miles_preview: 'View updated on next refresh'
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
