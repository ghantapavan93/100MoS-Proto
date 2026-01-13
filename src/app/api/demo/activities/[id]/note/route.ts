import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import db from '@/lib/db';

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const { note } = await req.json();
    const userId = 'demo-user';

    if (!note) {
        return NextResponse.json({ error: 'Note content is required' }, { status: 400 });
    }

    try {
        // Verify ownership
        const activity = db.prepare('SELECT id FROM activities WHERE id = ? AND user_id = ?').get(id, userId);
        if (!activity) {
            return NextResponse.json({ error: 'Activity not found' }, { status: 404 });
        }

        // Add note
        db.prepare('INSERT INTO activity_notes (activity_id, note_text) VALUES (?, ?)').run(id, note);

        // Log action for audit (Anonymized)
        const actionId = `act_note_${Date.now()}`;
        db.prepare(`
            INSERT INTO user_actions (id, user_id, action_type, payload_json, expires_at)
            VALUES (?, ?, ?, ?, datetime('now', '+1 minute'))
        `).run(
            actionId,
            userId,
            'add_note',
            JSON.stringify({ activity_id: id, note_preview: note.substring(0, 10) + '...' })
        );

        return NextResponse.json({ success: true, actionId });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
