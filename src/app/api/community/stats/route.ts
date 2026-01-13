export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { CommunityService } from '@/lib/services/communityService';

export async function GET() {
    const pulse = CommunityService.getLivePulse();
    return NextResponse.json({ pulse });
}
