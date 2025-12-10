import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { firebaseServer } from "@/lib/firebase-server";

export async function GET(req: NextRequest) {
  try {
    // Verify admin access
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token || !token.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminEmails = process.env.ROLE_ADMIN_EMAIL?.split(',').map(email => 
      email.trim().toLowerCase()
    ) || [];

    if (!adminEmails.includes(token.email.toLowerCase())) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Parse query parameters for filtering and pagination
    const { searchParams } = new URL(req.url);
    const filters: any = {};

    if (searchParams.get('eventType')) {
      filters.eventType = searchParams.get('eventType');
    }
    if (searchParams.get('level')) {
      filters.level = searchParams.get('level');
    }
    if (searchParams.get('userEmail')) {
      filters.userEmail = searchParams.get('userEmail');
    }
    if (searchParams.get('path')) {
      filters.path = searchParams.get('path');
    }
    if (searchParams.get('success') !== null) {
      filters.success = searchParams.get('success') === 'true';
    }
    if (searchParams.get('startDate')) {
      filters.startDate = searchParams.get('startDate');
    }
    if (searchParams.get('endDate')) {
      filters.endDate = searchParams.get('endDate');
    }

    // Pagination parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    filters.page = page;
    filters.limit = limit;

    // Get security logs with pagination
    const result = await firebaseServer.getSecurityLogs({ ...filters, getTotal: true });
    const { logs, total, totalPages } = result;
    
    // Get all logs for stats calculation (without pagination, limited to 1000 for performance)
    const statsFilters: any = {};
    if (filters.eventType) statsFilters.eventType = filters.eventType;
    if (filters.level) statsFilters.level = filters.level;
    if (filters.userEmail) statsFilters.userEmail = filters.userEmail;
    if (filters.success !== undefined) statsFilters.success = filters.success;
    
    const statsResult = await firebaseServer.getSecurityLogs({ ...statsFilters, page: 1, limit: 1000, getTotal: false });
    const allLogsData = Array.isArray(statsResult) ? statsResult : (statsResult.logs || []);
    
    const stats = {
      totalEvents: total,
      failedAttempts: allLogsData.filter((log: any) => !log.success).length,
      successfulAttempts: allLogsData.filter((log: any) => log.success).length,
      criticalEvents: allLogsData.filter((log: any) => log.level === 'CRITICAL').length,
      recentSuspiciousActivity: allLogsData.filter((log: any) => 
        log.eventType === 'SUSPICIOUS_ACTIVITY' && 
        new Date(log.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000)
      ).length
    };

    return NextResponse.json({
      logs,
      stats,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    });

  } catch (error) {
    console.error('Error fetching security logs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // Verify admin access
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token || !token.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminEmails = process.env.ROLE_ADMIN_EMAIL?.split(',').map(email => 
      email.trim().toLowerCase()
    ) || [];

    if (!adminEmails.includes(token.email.toLowerCase())) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Parse query parameters
    const { searchParams } = new URL(req.url);
    const daysToKeep = parseInt(searchParams.get('daysToKeep') || '30');

    // Clean up old logs
    const deletedCount = await firebaseServer.cleanupOldLogs(daysToKeep);

    return NextResponse.json({
      message: `Cleaned up ${deletedCount} old security logs`,
      deletedCount
    });

  } catch (error) {
    console.error('Error cleaning up security logs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
