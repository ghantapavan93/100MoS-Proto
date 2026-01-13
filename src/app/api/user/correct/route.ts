import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
// import { ActivityService } from '@/lib/services/activityService';
// import { OpsService } from '@/lib/services/opsService';
// import db from '@/lib/db';

export async function POST(req: Request) {
    // MOCK FOR VERCEL
    return NextResponse.json({ success: true, mocked: true });
}
