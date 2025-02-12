import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  // TODO: add bearer token support
  // const token = req.headers.get('Authorization')?.split("Bearer ")?.[1];
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return NextResponse.json({ error: "Unauthorized, not a valid token" }, { status: 401 });
  }

  // technically, we should check the token against the database to see if it's valid. TODO: fetch from DB
  if (token.email !== process.env.ROLE_ADMIN_EMAIL) {
    return NextResponse.json({ error: "Unauthorized, no permission to access the data" }, { status: 401 });
  }

  return NextResponse.next();
}

// Apply middleware only to specific API routes
export const config = {
  matcher: ["/api/protected/:path*"],
};