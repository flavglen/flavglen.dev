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

    // Parse query parameters for filtering
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

    // Get security logs
    const logs = await firebaseServer.getSecurityLogs(filters);
    const stats = { totalEvents: logs.length, failedAttempts: 0, successfulAttempts: 0, criticalEvents: 0, recentSuspiciousActivity: 0 };

    return NextResponse.json({
      logs,
      stats,
      filters,
      total: logs.length
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
