export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const resolvedParams = await params;
    const actionId = resolvedParams.id;
    const userId = 'demo-user';

    try {
        // 1. Fetch action with server-side truth
        const action = db.prepare(`
            SELECT * FROM user_actions 
            WHERE id = ? AND user_id = ?
        `).get(actionId, userId) as any;

        if (!action) {
            return NextResponse.json({ error: 'Action not found' }, { status: 404 });
        }

        // 2. Idempotency Check
        if (action.undone_at) {
            return NextResponse.json({ success: true, message: 'Already undone' });
        }

        // 3. Time-box Validation
        const expiresAt = new Date(action.expires_at).getTime();
        if (Date.now() > expiresAt) {
            return NextResponse.json({ error: 'Undo expired (1 minute limit)' }, { status: 400 });
        }

        // 4. Reversal Logic based on type
        const payload = JSON.parse(action.payload_json);

        const transaction = db.transaction(() => {
            if (action.action_type === 'correct_miles') {
                // Delete the correction row
                db.prepare('DELETE FROM activity_corrections WHERE id = ?').run(payload.correction_id);
            } else if (action.action_type === 'add_note') {
                // Notes are also additive, but we could soften them or delete latest
                // For simplicity, we delete the note we just added
                db.prepare('DELETE FROM activity_notes WHERE activity_id = ? AND note_text LIKE ? ORDER BY created_at DESC LIMIT 1')
                    .run(payload.activity_id, payload.note_preview.replace('...', '%'));
            }

            // Mark as undone
            db.prepare('UPDATE user_actions SET undone_at = datetime(\'now\') WHERE id = ?')
                .run(actionId);
        });

        transaction();

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
