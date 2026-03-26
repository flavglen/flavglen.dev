// Utility for logging security events from middleware to Firebase
// This works around Edge Runtime limitations by calling an API endpoint

import { isMiddlewareLoggingEnabled } from './common';

interface SecurityLogData {
  eventType: string;
  level: string;
  path: string;
  method: string;
  success: boolean;
  userId?: string;
  userEmail?: string;
  ipAddress?: string;
  userAgent?: string;
  reason?: string;
  metadata?: any;
}

export async function logSecurityEvent(data: SecurityLogData): Promise<void> {
  // Check if middleware logging is disabled
  if (!isMiddlewareLoggingEnabled()) {
    return;
  }

  try {
    // Filter out undefined values before sending to Firebase
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== undefined)
    );

    // Call the API endpoint to log to Firebase
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/log-security`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cleanData),
    });

    if (!response.ok) {
      console.error('Failed to log security event to Firebase:', response.status);
    }
  } catch (error) {
    // Silently fail - we don't want logging failures to break the middleware
    console.error('Error sending security log to Firebase:', error);
  }
}

// Convenience functions for common security events
export async function logInvalidToken(path: string, method: string, userEmail?: string, ipAddress?: string, userAgent?: string) {
  await logSecurityEvent({
    eventType: 'INVALID_TOKEN',
    level: 'CRITICAL',
    path,
    method,
    success: false,
    userEmail,
    ipAddress,
    userAgent,
    reason: 'Invalid or missing token'
  });
}

export async function logTokenExpired(path: string, method: string, userId?: string, userEmail?: string, ipAddress?: string, userAgent?: string) {
  await logSecurityEvent({
    eventType: 'TOKEN_EXPIRED',
    level: 'WARN',
    path,
    method,
    success: false,
    userId,
    userEmail,
    ipAddress,
    userAgent,
    reason: 'Token has expired'
  });
}

export async function logAdminAccessDenied(path: string, method: string, userId?: string, userEmail?: string, ipAddress?: string, userAgent?: string) {
  await logSecurityEvent({
    eventType: 'ADMIN_ACCESS_DENIED',
    level: 'ERROR',
    path,
    method,
    success: false,
    userId,
    userEmail,
    ipAddress,
    userAgent,
    reason: 'User is not authorized for admin access'
  });
}

export async function logAdminAccessGranted(path: string, method: string, userId?: string, userEmail?: string, ipAddress?: string, userAgent?: string) {
  await logSecurityEvent({
    eventType: 'ADMIN_ACCESS_GRANTED',
    level: 'INFO',
    path,
    method,
    success: true,
    userId,
    userEmail,
    ipAddress,
    userAgent
  });
}

export async function logApiAccessDenied(path: string, method: string, userId?: string, userEmail?: string, ipAddress?: string, userAgent?: string) {
  await logSecurityEvent({
    eventType: 'API_ACCESS_DENIED',
    level: 'ERROR',
    path,
    method,
    success: false,
    userId,
    userEmail,
    ipAddress,
    userAgent,
    reason: 'User is not authorized for protected API access'
  });
}

export async function logApiAccessGranted(path: string, method: string, userId?: string, userEmail?: string, ipAddress?: string, userAgent?: string) {
  await logSecurityEvent({
    eventType: 'API_ACCESS_GRANTED',
    level: 'INFO',
    path,
    method,
    success: true,
    userId,
    userEmail,
    ipAddress,
    userAgent
  });
}

export async function logSuspiciousActivity(path: string, method: string, reason: string, ipAddress?: string, userAgent?: string, metadata?: any) {
  await logSecurityEvent({
    eventType: 'SUSPICIOUS_ACTIVITY',
    level: 'CRITICAL',
    path,
    method,
    success: false,
    ipAddress,
    userAgent,
    reason,
    metadata
  });
}
