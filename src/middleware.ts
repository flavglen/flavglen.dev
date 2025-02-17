import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  // TODO: add role based access control
  const admins = process.env.ROLE_ADMIN_EMAIL?.split(',') || [];
  // TODO: add bearer token support
  // const token = req.headers.get('Authorization')?.split("Bearer ")?.[1];
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const pathname = req.nextUrl.pathname;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized, not a valid token" }, { status: 401 });
  }

  // Protect all routes under /admin/*
  if (pathname.startsWith('/admin/')) {
    if (!admins.includes(token.email as string)) {
      return NextResponse.redirect(new URL('/error', req.url));
    }
  }

  // Protect all routes under /api/protected/*
  if (pathname.startsWith('/api/protected/')) {
    if (!admins.includes(token.email as string)) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  return NextResponse.next();
}

// Apply middleware only to specific API routes
export const config = {
  matcher: ["/api/protected/:path*", "/admin/:path*"],
};