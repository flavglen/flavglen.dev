import { db } from "@/lib/firebase-server";
import { v4 as uuidv4 } from 'uuid';

// Security log types
export type SecurityEventType = 
  | 'AUTH_SUCCESS'
  | 'AUTH_FAILED'
  | 'TOKEN_EXPIRED'
  | 'INVALID_TOKEN'
  | 'UNAUTHORIZED_ACCESS'
  | 'ADMIN_ACCESS_GRANTED'
  | 'ADMIN_ACCESS_DENIED'
  | 'API_ACCESS_GRANTED'
  | 'API_ACCESS_DENIED'
  | 'SUSPICIOUS_ACTIVITY';

export type SecurityLogLevel = 'INFO' | 'WARN' | 'ERROR' | 'CRITICAL';

export interface SecurityLog {
  id: string;
  timestamp: string;
  eventType: SecurityEventType;
  level: SecurityLogLevel;
  userId?: string;
  userEmail?: string;
  ipAddress?: string;
  userAgent?: string;
  path: string;
  method: string;
  success: boolean;
  reason?: string;
  metadata?: {
    tokenExp?: number;
    adminEmails?: string[];
    requestId?: string;
    sessionId?: string;
  };
}

export interface SecurityLogFilters {
  eventType?: SecurityEventType;
  level?: SecurityLogLevel;
  userId?: string;
  userEmail?: string;
  startDate?: string;
  endDate?: string;
  path?: string;
  success?: boolean;
}

// Security logger class
export class SecurityLogger {
  private static instance: SecurityLogger;
  
  private constructor() {}
  
  public static getInstance(): SecurityLogger {
    if (!SecurityLogger.instance) {
      SecurityLogger.instance = new SecurityLogger();
    }
    return SecurityLogger.instance;
  }

  /**
   * Log a security event to Firebase
   */
  public async logSecurityEvent(
    eventType: SecurityEventType,
    level: SecurityLogLevel,
    path: string,
    method: string,
    success: boolean,
    options: {
      userId?: string;
      userEmail?: string;
      ipAddress?: string;
      userAgent?: string;
      reason?: string;
      metadata?: SecurityLog['metadata'];
    } = {}
  ): Promise<boolean> {
    try {
      const securityLog: SecurityLog = {
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        eventType,
        level,
        userId: options.userId,
        userEmail: options.userEmail,
        ipAddress: options.ipAddress,
        userAgent: options.userAgent,
        path,
        method,
        success,
        reason: options.reason,
        metadata: options.metadata,
      };

      await db.collection('security_logs').doc(securityLog.id).set(securityLog);
      
      // Log to console for development
      console.log(`[SECURITY] ${level}: ${eventType} - ${path} - ${success ? 'SUCCESS' : 'FAILED'}`);
      
      return true;
    } catch (error) {
      console.error('Failed to save security log:', error);
      return false;
    }
  }

  /**
   * Get security logs with optional filters
   */
  public async getSecurityLogs(filters: SecurityLogFilters = {}): Promise<SecurityLog[]> {
    try {
      let query = db.collection('security_logs').orderBy('timestamp', 'desc');

      // Apply filters
      if (filters.eventType) {
        query = query.where('eventType', '==', filters.eventType);
      }
      if (filters.level) {
        query = query.where('level', '==', filters.level);
      }
      if (filters.userId) {
        query = query.where('userId', '==', filters.userId);
      }
      if (filters.userEmail) {
        query = query.where('userEmail', '==', filters.userEmail);
      }
      if (filters.path) {
        query = query.where('path', '==', filters.path);
      }
      if (filters.success !== undefined) {
        query = query.where('success', '==', filters.success);
      }
      if (filters.startDate) {
        query = query.where('timestamp', '>=', filters.startDate);
      }
      if (filters.endDate) {
        query = query.where('timestamp', '<=', filters.endDate);
      }

      const snapshot = await query.limit(1000).get();
      return snapshot.docs.map(doc => doc.data() as SecurityLog);
    } catch (error) {
      console.error('Failed to get security logs:', error);
      return [];
    }
  }

  /**
   * Get security statistics
   */
  public async getSecurityStats(): Promise<{
    totalEvents: number;
    failedAttempts: number;
    successfulAttempts: number;
    criticalEvents: number;
    recentSuspiciousActivity: number;
  }> {
    try {
      const logs = await this.getSecurityLogs();
      
      return {
        totalEvents: logs.length,
        failedAttempts: logs.filter(log => !log.success).length,
        successfulAttempts: logs.filter(log => log.success).length,
        criticalEvents: logs.filter(log => log.level === 'CRITICAL').length,
        recentSuspiciousActivity: logs.filter(log => 
          log.eventType === 'SUSPICIOUS_ACTIVITY' && 
          new Date(log.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
        ).length,
      };
    } catch (error) {
      console.error('Failed to get security stats:', error);
      return {
        totalEvents: 0,
        failedAttempts: 0,
        successfulAttempts: 0,
        criticalEvents: 0,
        recentSuspiciousActivity: 0,
      };
    }
  }

  /**
   * Clean up old logs (older than specified days)
   */
  public async cleanupOldLogs(daysToKeep: number = 30): Promise<number> {
    try {
      const cutoffDate = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000);
      const cutoffISOString = cutoffDate.toISOString();

      const oldLogs = await db.collection('security_logs')
        .where('timestamp', '<', cutoffISOString)
        .get();

      const batch = db.batch();
      oldLogs.docs.forEach(doc => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      
      console.log(`Cleaned up ${oldLogs.docs.length} old security logs`);
      return oldLogs.docs.length;
    } catch (error) {
      console.error('Failed to cleanup old logs:', error);
      return 0;
    }
  }
}

// Export singleton instance
export const securityLogger = SecurityLogger.getInstance();
