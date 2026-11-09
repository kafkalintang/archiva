import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('archiva_token');
  const { pathname } = request.nextUrl;

  // Jika mengakses /app tapi tidak punya token, tendang ke /login
  if (pathname.startsWith('/app') && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Jika sudah login tapi mencoba buka /login atau /register, arahkan ke /app
  if ((pathname === '/login' || pathname === '/register') && token) {
    return NextResponse.redirect(new URL('/app/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/app/:path*', '/login', '/register'],
};