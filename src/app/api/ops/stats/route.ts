export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { OpsService } from '@/lib/services/opsService';

export async function GET() {
    const stats = OpsService.getDashboardMetrics();
    return NextResponse.json({
        ...stats,
        cloudSyncEnabled: process.env.ENABLE_CLOUD_SYNC === 'true'
    });
}
