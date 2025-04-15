import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Include '/' in public paths
    const isPublicPath = path === '/login' || path === '/signup' || path === '/';

    const token = request.cookies.get('token')?.value || '';

    // Redirect to login if trying to access private route without token
    if (!token && !isPublicPath) {
        return NextResponse.redirect(new URL('/login', request.nextUrl));
    }

    // Redirect to dashboard if token exists and user is trying to access a public path
    if (token && (path === '/login' || path === '/signup')) {
        return NextResponse.next();
    }

    // Let the request through
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/',
        '/profile',
        '/login',
        '/signup',
        '/dashboard',
        '/api/socket/io'
    ],
};
