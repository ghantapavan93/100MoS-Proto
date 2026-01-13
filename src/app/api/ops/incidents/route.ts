export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { OpsService } from '@/lib/services/opsService';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get('cursor') || undefined;
    const limit = parseInt(searchParams.get('limit') || '50');

    const result = OpsService.getIncidents(cursor, limit);
    return NextResponse.json(result);
}
