import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { OpsService } from '@/lib/services/opsService';

export async function GET() {
    const logs = OpsService.getRecentAuditLogs();
    return NextResponse.json(logs);
}
