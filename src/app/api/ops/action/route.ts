import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { OpsService } from '@/lib/services/opsService';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { userId, action, incidentId } = body;

        if (action === 'send_ritual' || action === 'dismiss') {
            OpsService.handleQuietUser(userId, action);
        } else if (action === 'resolve') {
            OpsService.resolveIncident(incidentId, 'admin_demo');
        }

        return NextResponse.json({ success: true });
    } catch (e) {
        console.error("Ops action failed:", e);
        return NextResponse.json({ error: 'Action failed' }, { status: 500 });
    }
}
