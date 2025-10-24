import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { 
  logSuspiciousActivity, 
  logInvalidToken, 
  logTokenExpired, 
  logAdminAccessDenied, 
  logAdminAccessGranted, 
  logApiAccessDenied, 
  logApiAccessGranted 
} from "@/lib/middleware-logger";
import { isMiddlewareLoggingEnabled } from "@/lib/common";

// Security utility functions
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function sanitizePathname(pathname: string): string {
  // Remove any potential path traversal attempts
  return pathname.replace(/\.\./g, '').replace(/\/+/g, '/');
}

function isAdminEmail(email: string, adminEmails: string[]): boolean {
  if (!email || !isValidEmail(email)) return false;
  return adminEmails.includes(email.toLowerCase().trim());
}

function createSecureRedirect(path: string, req: NextRequest): NextResponse {
  // SECURITY FIX: Use origin instead of req.url to prevent open redirects
  const origin = req.nextUrl.origin;
  return NextResponse.redirect(new URL(path, origin));
}

export async function middleware(req: NextRequest) {
  const pathname = sanitizePathname(req.nextUrl.pathname);
  const method = req.method;
  
  // Debug: Show middleware logging status (only in development)
  if (process.env.NODE_ENV === 'development' && pathname === '/admin/expenses') {
    console.log('Middleware logging enabled:', isMiddlewareLoggingEnabled());
  }
  // Get client IP address with better fallback handling
  const getClientIP = (req: NextRequest): string => {
    // Check various headers for real client IP
    const forwardedFor = req.headers.get('x-forwarded-for');
    const realIP = req.headers.get('x-real-ip');
    const cfConnectingIP = req.headers.get('cf-connecting-ip'); // Cloudflare
    const xClientIP = req.headers.get('x-client-ip');
    
    // Use the first non-localhost IP found
    const ipSources = [forwardedFor, realIP, cfConnectingIP, xClientIP, req.ip];
    
    for (const ip of ipSources) {
      if (ip && !isLocalhostIP(ip)) {
        // If multiple IPs in x-forwarded-for, take the first one (original client)
        return ip.split(',')[0].trim();
      }
    }
    
    // Fallback to localhost indicators
    return req.ip || 'localhost';
  };
  
  const isLocalhostIP = (ip: string): boolean => {
    return ip === '::1' || ip === '127.0.0.1' || ip === 'localhost' || ip.startsWith('192.168.') || ip.startsWith('10.');
  };
  
  const ipAddress = getClientIP(req);
  const userAgent = req.headers.get('user-agent') || 'unknown';
  
  // Debug logging for IP detection (remove in production)
  if (process.env.NODE_ENV === 'development') {
    console.log('IP Detection Debug:', {
      reqIP: req.ip,
      forwardedFor: req.headers.get('x-forwarded-for'),
      realIP: req.headers.get('x-real-ip'),
      cfConnectingIP: req.headers.get('cf-connecting-ip'),
      xClientIP: req.headers.get('x-client-ip'),
      finalIP: ipAddress
    });
  }
  
  // SECURITY FIX: Validate environment variables
  const adminEmails = process.env.ROLE_ADMIN_EMAIL?.split(',').map(email => 
    email.trim().toLowerCase()
  ).filter(email => isValidEmail(email)) || [];
  
  if (adminEmails.length === 0) {
    console.error('No valid admin emails configured');
    // Log configuration error to Firebase
    await logSuspiciousActivity(
      pathname,
      method,
      'No valid admin emails configured',
      ipAddress,
      userAgent,
      { adminEmails: [] }
    );
    
    return new NextResponse(JSON.stringify({ error: 'Server configuration error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // SECURITY FIX: Enhanced token validation
  const token = await getToken({ 
    req, 
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === 'production'
  });

  // SECURITY FIX: Check token validity and expiration
  if (!token || !token.email || !isValidEmail(token.email)) {
    // Log invalid token attempt to Firebase
    await logInvalidToken(
      pathname,
      method,
      token?.email || undefined,
      ipAddress,
      userAgent
    );

    if (pathname.startsWith('/api/')) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized, invalid token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return createSecureRedirect('/unauthorized', req);
  }

  // SECURITY FIX: Check token expiration
  const currentTime = Math.floor(Date.now() / 1000);
  if (token.exp && typeof token.exp === 'number' && token.exp < currentTime) {
    // Log expired token attempt to Firebase
    await logTokenExpired(
      pathname,
      method,
      token.sub,
      token.email,
      ipAddress,
      userAgent
    );

    if (pathname.startsWith('/api/')) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized, token expired' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return createSecureRedirect('/unauthorized', req);
  }

  // SECURITY FIX: Enhanced admin route protection
  if (pathname.startsWith('/admin/')) {
    const isAdmin = isAdminEmail(token.email, adminEmails);
    
    if (!isAdmin) {
      // Log unauthorized admin access attempt to Firebase
      await logAdminAccessDenied(
        pathname,
        method,
        token.sub,
        token.email,
        ipAddress,
        userAgent
      );
      
      return createSecureRedirect('/unauthorized', req);
    } else {
      // Log successful admin access to Firebase
      await logAdminAccessGranted(
        pathname,
        method,
        token.sub,
        token.email,
        ipAddress,
        userAgent
      );
    }
  }

  // SECURITY FIX: Enhanced API route protection
  if (pathname.startsWith('/api/protected/')) {
    const isAdmin = isAdminEmail(token.email, adminEmails);
    
    if (!isAdmin) {
      // Log unauthorized API access attempt to Firebase
      await logApiAccessDenied(
        pathname,
        method,
        token.sub,
        token.email,
        ipAddress,
        userAgent
      );
      
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      // Log successful API access to Firebase
      await logApiAccessGranted(
        pathname,
        method,
        token.sub,
        token.email,
        ipAddress,
        userAgent
      );
    }
  }

  return NextResponse.next();
}

// Apply middleware only to specific API routes
export const config = {
  matcher: ["/api/protected/:path*", "/admin/:path*"],
};