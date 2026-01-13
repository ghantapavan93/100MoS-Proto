import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
// import { ProviderSyncService } from '@/lib/services/providerSyncService';

export async function GET() {
    // MOCK FOR VERCEL
    const connections = [
        { provider: 'strava', status: 'active', expiresAt: new Date(Date.now() + 86400000).toISOString() }
    ];

    return NextResponse.json({ connections });
}
