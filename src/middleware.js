import { NextResponse } from 'next/server';

export function middleware(request) {
     const loginCookie = request.cookies.get('login');
     const { pathname, searchParams } = request.nextUrl;
     const redirectTo = searchParams.get('redirect') || '/dashboard';

     if (pathname === '/') {
          return NextResponse.redirect(new URL('/dashboard', request.url));
     }

     if (loginCookie && loginCookie.value === 'true') {
          if (pathname === '/auth/login') {
               return NextResponse.redirect(new URL(redirectTo, request.url));
          }
     } else {
          if (pathname !== '/auth/login') {
               return NextResponse.redirect(new URL('/auth/login', request.url));
          }
     }

     return NextResponse.next();
}

export const config = {
     matcher: [
          '/((?!api|mock|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp)$).*)',
     ],
};
