import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check for the auth token in cookies
  const token = request.cookies.get('skyluxe_auth_token')?.value;

  // Define protected routes
  const protectedRoutes = ['/dashboard', '/checkout', '/concierge'];
  
  // Define auth routes (should not be accessed if already logged in)
  const authRoutes = ['/auth/login', '/auth/register'];

  const isProtectedRoute = protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => request.nextUrl.pathname.startsWith(route));

  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/auth/login', request.url);
    // Optionally preserve the intended destination
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/checkout/:path*', '/auth/:path*', '/concierge/:path*'],
};
