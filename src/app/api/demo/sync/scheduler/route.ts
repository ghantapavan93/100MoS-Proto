import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
// import { SyncScheduler } from '@/lib/services/syncScheduler';

export async function GET() {
    // Start heartbeat for demo user if not already running
    // SyncScheduler.start('demo-user');

    return NextResponse.json({
        nextSyncTime: Date.now() + 3600000 // SyncScheduler.getNextRunTime()
    });
}
