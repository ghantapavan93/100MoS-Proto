export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { CommunityService } from '@/lib/services/communityService';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get('cursor') || undefined;
    const limit = parseInt(searchParams.get('limit') || '10');

    const feed = CommunityService.getStoryFeed(cursor, limit);
    return NextResponse.json(feed);
}
