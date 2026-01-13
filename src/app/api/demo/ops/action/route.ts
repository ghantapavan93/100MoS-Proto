import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import db from '@/lib/db';
import { z } from 'zod';

const ActionSchema = z.object({
    userId: z.string(),
    action: z.enum(['nudge', 'done']),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId, action } = ActionSchema.parse(body);

        if (action === 'nudge') {
            // Simulate sending a nudge
            db.prepare('UPDATE users SET contacted = 1 WHERE id = ?').run(userId);

            // OPS HARDENING: Structured Audit Log (Who did what, when)
            db.prepare('INSERT INTO ops_audit_log (action, target_id, meta_json) VALUES (?, ?, ?)').run('nudge', userId, JSON.stringify({ reason: 'quiet_list_14_days' }));

            // Still log to incident feed for live visibility
            db.prepare('INSERT INTO incidents (msg, type) VALUES (?, ?)').run(`Gentle nudge sent to participant ${userId.slice(0, 8)}.`, 'info');
        } else if (action === 'done') {
            // Simulate marking as resolved/done
            db.prepare('UPDATE users SET contacted = 1 WHERE id = ?').run(userId);

            // OPS HARDENING: Audit Log
            db.prepare('INSERT INTO ops_audit_log (action, target_id, meta_json) VALUES (?, ?, ?)').run('resolve', userId, JSON.stringify({ reason: 'manual_override' }));

            db.prepare('INSERT INTO incidents (msg, type) VALUES (?, ?)').run(`Quiet List item ${userId.slice(0, 8)} marked as resolved.`, 'success');
        }

        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
}
