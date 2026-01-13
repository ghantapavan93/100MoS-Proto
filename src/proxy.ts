import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
    const response = NextResponse.next();

    // Check if user already has a session cookie
    let userId = request.cookies.get('demo_user_id')?.value;

    if (!userId) {
        userId = crypto.randomUUID();
        // Set cookie that expires in 30 days
        response.cookies.set('demo_user_id', userId, {
            maxAge: 60 * 60 * 24 * 30,
            path: '/',
            sameSite: 'lax',
        });
    }

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
