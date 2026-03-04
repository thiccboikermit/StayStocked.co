import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if the user is trying to access admin pages (but not the login page itself)
  if (request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.startsWith('/admin/login')) {
    // Check for authentication token (you can adjust this based on your auth implementation)
    const authToken = request.cookies.get('auth-token') || request.headers.get('authorization');
    
    // For now, we'll check for a simple session cookie or header
    // In a real implementation, you'd validate the JWT token here
    if (!authToken) {
      // Redirect to admin login page with return URL
      const adminLoginUrl = new URL('/admin/login', request.url);
      adminLoginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
      return NextResponse.redirect(adminLoginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all admin routes
    '/admin/:path*',
  ],
};