export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { PrivacyService } from '@/lib/services/privacyService';

export async function POST(request: NextRequest) {
    const userId = request.cookies.get('demo_user_id')?.value || 'demo-user';

    try {
        PrivacyService.deleteUserData(userId);

        const response = NextResponse.json({ success: true, message: "User data purged" });
        // Clear demo cookie
        response.cookies.delete('demo_user_id');
        return response;
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
