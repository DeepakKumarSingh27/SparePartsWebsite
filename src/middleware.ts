import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const secretKey = process.env.JWT_SECRET || 'fallback_secret_for_development';
const key = new TextEncoder().encode(secretKey);

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;

  // Protect /dashboard routes
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const { payload } = await jwtVerify(token, key, {
        algorithms: ['HS256'],
      });

      const role = payload.role as string;

      // Role-based routing
      if (request.nextUrl.pathname.startsWith('/dashboard/admin') && role !== 'SUPER_ADMIN') {
        return NextResponse.redirect(new URL('/login', request.url));
      }

      if (request.nextUrl.pathname.startsWith('/dashboard/vendor') && role !== 'VENDOR') {
        return NextResponse.redirect(new URL('/login', request.url));
      }

      return NextResponse.next();
    } catch (error) {
      // Invalid token
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('auth_token');
      return response;
    }
  }

  // If user is already logged in and tries to go to login/register, redirect to dashboard
  if ((request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register') && token) {
    try {
      const { payload } = await jwtVerify(token, key, { algorithms: ['HS256'] });
      const role = payload.role as string;
      
      if (role === 'SUPER_ADMIN') {
        return NextResponse.redirect(new URL('/dashboard/admin', request.url));
      } else if (role === 'VENDOR') {
        return NextResponse.redirect(new URL('/dashboard/vendor', request.url));
      } else {
        return NextResponse.redirect(new URL('/products', request.url));
      }
    } catch (error) {
      // Token is invalid, let them access login/register
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
};
