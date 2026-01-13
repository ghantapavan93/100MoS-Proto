import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { TimelineService } from '@/lib/services/timelineService';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'user_demo';
    const cursor = searchParams.get('cursor') || undefined;
    const limit = parseInt(searchParams.get('limit') || '20');

    const result = TimelineService.getTimeline(userId, cursor, limit);

    return NextResponse.json(result);
}
