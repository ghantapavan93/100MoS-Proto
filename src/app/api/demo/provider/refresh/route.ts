import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(req: NextRequest) {
    const { provider, action } = await req.json();
    const userId = 'demo-user';

    try {
        if (action === 'simulate_expiry') {
            db.prepare(`
                UPDATE provider_tokens 
                SET status = 'expired', expires_at = datetime('now', '-1 minute')
                WHERE user_id = ? AND provider = ?
            `).run(userId, provider);
            return NextResponse.json({ success: true, msg: `${provider} token expired.` });
        }

        if (action === 'refresh') {
            db.prepare(`
                UPDATE provider_tokens 
                SET status = 'active', expires_at = datetime('now', '+1 hour'), last_refresh_at = datetime('now')
                WHERE user_id = ? AND provider = ?
            `).run(userId, provider);
            return NextResponse.json({ success: true, msg: `${provider} token refreshed.` });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
