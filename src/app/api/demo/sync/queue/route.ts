export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { OpsService } from '@/lib/services/opsService';

export async function GET(request: NextRequest) {
    try {
        const metrics = OpsService.getDashboardMetrics();
        return NextResponse.json({
            queue: metrics.scheduledSyncs,
            health: metrics.dataHealth,
            providerStatus: metrics.providerHealth
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
