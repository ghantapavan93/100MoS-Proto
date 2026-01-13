export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { PrivacyService } from '@/lib/services/privacyService';

export async function GET(request: NextRequest) {
    const userId = request.cookies.get('demo_user_id')?.value || 'demo-user';
    const data = PrivacyService.exportUserData(userId);

    return new NextResponse(JSON.stringify(data, null, 2), {
        headers: {
            'Content-Type': 'application/json',
            'Content-Disposition': `attachment; filename="data-export-${userId}.json"`
        }
    });
}
