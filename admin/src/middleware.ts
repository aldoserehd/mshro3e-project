import { NextResponse, type NextRequest } from 'next/server';

const SESSION_COOKIE = '__mshro3e_session';

const PROTECTED_PREFIXES = [
  '/overview',
  '/vendors',
  '/bookings',
  '/orders',
  '/users',
  '/categories',
  '/reviews',
  '/payouts',
  '/settings',
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = req.cookies.get(SESSION_COOKIE)?.value;

  const protectedHit = PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );

  if (protectedHit && !session) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  if (pathname === '/login' && session) {
    const url = req.nextUrl.clone();
    url.pathname = '/overview';
    url.search = '';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/login',
    '/overview/:path*',
    '/vendors/:path*',
    '/bookings/:path*',
    '/orders/:path*',
    '/users/:path*',
    '/categories/:path*',
    '/reviews/:path*',
    '/payouts/:path*',
    '/settings/:path*',
  ],
};
