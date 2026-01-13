import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic';
import { ProviderSyncService } from "@/lib/services/providerSyncService";

export async function POST() {
    // In a real app, userId would come from session/auth
    const userId = "user_demo";

    // MOCK FOR VERCEL DEPLOYMENT
    // const result = await ProviderSyncService.syncUser(userId, "strava");
    const result = { status: 'success', added: 2, dupes: 0, message: "Synced successfully" };

    if (result.status === 'success') {
        return NextResponse.json({
            ...result,
            last_sync_time: "Just now",
        });
    } else if (result.status === 'rate_limited') {
        return NextResponse.json({ rate_limited: true });
    } else {
        return NextResponse.json({ error: "Sync Failed" }, { status: 500 });
    }
}
