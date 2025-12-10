// Server-only Firebase operations
// This file should only be imported in server-side code (API routes, middleware, etc.)

import admin from "firebase-admin";
import { configureFirebaseLogging } from "./common-server";
import { serverFirebaseCache, CACHE_TTL } from "./firebase-cache-server";

// Configure Firebase logging based on environment variable
configureFirebaseLogging();

// Initialize Firebase Admin SDK (only once)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_NAME,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    }),
  });
}

export const db = admin.firestore();
export const auth = admin.auth();

// Server-only Firebase operations
export class FirebaseServer {
  private static instance: FirebaseServer;
  
  private constructor() {}
  
  public static getInstance(): FirebaseServer {
    if (!FirebaseServer.instance) {
      FirebaseServer.instance = new FirebaseServer();
    }
    return FirebaseServer.instance;
  }

  // Security logging operations
  async logSecurityEvent(eventData: any) {
    try {
      // Filter out undefined values to prevent Firestore errors
      const cleanEventData = Object.fromEntries(
        Object.entries(eventData).filter(([_, value]) => value !== undefined)
      );

      await db.collection('security_logs').add({
        ...cleanEventData,
        timestamp: new Date().toISOString(),
        serverTimestamp: admin.firestore.FieldValue.serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error('Failed to log security event:', error);
      return false;
    }
  }

  // Get security logs with pagination
  async getSecurityLogs(filters: any = {}) {
    try {
      const { page = 1, limit = 50, getTotal = false, ...queryFilters } = filters;
      const cacheKey = `security_logs:${JSON.stringify(filters)}`;
      
      return await serverFirebaseCache.get(
        'security_logs',
        async () => {
          let query = db.collection('security_logs').orderBy('timestamp', 'desc');
          
          // Apply filters
          if (queryFilters.eventType) {
            query = query.where('eventType', '==', queryFilters.eventType);
          }
          if (queryFilters.level) {
            query = query.where('level', '==', queryFilters.level);
          }
          if (queryFilters.userEmail) {
            query = query.where('userEmail', '==', queryFilters.userEmail);
          }
          if (queryFilters.success !== undefined) {
            query = query.where('success', '==', queryFilters.success);
          }
          
          // Get total count if requested (for first page or when getTotal is true)
          let total = 0;
          if (getTotal || page === 1) {
            const countSnapshot = await query.get();
            total = countSnapshot.docs.length;
          }
          
          // For pagination, we need to skip documents
          // Since Firestore doesn't support offset, we'll fetch and slice
          // For better performance, we can use cursor-based pagination in the future
          const snapshot = await query.limit(1000).get(); // Get up to 1000 for pagination
          const allLogs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          
          // Calculate pagination
          const startIndex = (page - 1) * limit;
          const endIndex = startIndex + limit;
          const logs = allLogs.slice(startIndex, endIndex);
          
          // Update total if we got all logs
          if (total === 0 && allLogs.length < 1000) {
            total = allLogs.length;
          }
          
          return {
            logs,
            total: total || allLogs.length,
            page,
            limit,
            totalPages: Math.ceil((total || allLogs.length) / limit)
          };
        },
        {
          ttl: CACHE_TTL.SECURITY_LOGS,
          key: cacheKey
        }
      );
    } catch (error) {
      console.error('Failed to get security logs:', error);
      return { logs: [], total: 0, page: 1, limit: 50, totalPages: 0 };
    }
  }

  // Cleanup old logs
  async cleanupOldLogs(daysToKeep: number = 30) {
    try {
      const cutoffDate = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000);
      const oldLogs = await db.collection('security_logs')
        .where('timestamp', '<', cutoffDate.toISOString())
        .get();

      const batch = db.batch();
      oldLogs.docs.forEach(doc => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      return oldLogs.docs.length;
    } catch (error) {
      console.error('Failed to cleanup old logs:', error);
      return 0;
    }
  }
}

// Export singleton instance
export const firebaseServer = FirebaseServer.getInstance();
