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
      
      // Log filters for debugging
      console.log('[getSecurityLogs] Filters:', JSON.stringify(queryFilters));
      
      // For filtered queries, disable cache completely to ensure fresh data
      const hasFilters = !!(queryFilters.eventType || queryFilters.level || queryFilters.userEmail || queryFilters.success !== undefined);
      
      // Direct query execution for filtered queries (no cache)
      if (hasFilters) {
        let query: admin.firestore.Query<admin.firestore.DocumentData> = db.collection('security_logs');
        
        // Apply where filters FIRST (before orderBy)
        // This is important for Firestore query optimization
        if (queryFilters.eventType) {
          console.log('[getSecurityLogs] Filtering by eventType:', queryFilters.eventType);
          query = query.where('eventType', '==', queryFilters.eventType);
        }
        if (queryFilters.level) {
          console.log('[getSecurityLogs] Filtering by level:', queryFilters.level);
          query = query.where('level', '==', queryFilters.level);
        }
        if (queryFilters.userEmail) {
          query = query.where('userEmail', '==', queryFilters.userEmail);
        }
        if (queryFilters.success !== undefined) {
          query = query.where('success', '==', queryFilters.success);
        }
        
        // Try with orderBy first
        let snapshot;
        let allLogs: any[] = [];
        let querySucceeded = false;
        
        try {
          query = query.orderBy('timestamp', 'desc');
          snapshot = await query.limit(1000).get();
          allLogs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          querySucceeded = true;
          console.log(`[getSecurityLogs] Query succeeded, found ${allLogs.length} logs`);
        } catch (queryError: any) {
          console.error('[getSecurityLogs] Query with orderBy failed:', queryError.message);
          // If query fails (e.g., missing composite index), try without orderBy
          if (queryError.code === 'failed-precondition' || queryError.message?.includes('index')) {
            console.warn('[getSecurityLogs] Trying fallback query without orderBy');
            // Fallback: fetch with filters but no orderBy, then sort in memory
            let fallbackQuery: admin.firestore.Query<admin.firestore.DocumentData> = db.collection('security_logs');
            if (queryFilters.eventType) {
              fallbackQuery = fallbackQuery.where('eventType', '==', queryFilters.eventType);
            }
            if (queryFilters.level) {
              fallbackQuery = fallbackQuery.where('level', '==', queryFilters.level);
            }
            if (queryFilters.userEmail) {
              fallbackQuery = fallbackQuery.where('userEmail', '==', queryFilters.userEmail);
            }
            if (queryFilters.success !== undefined) {
              fallbackQuery = fallbackQuery.where('success', '==', queryFilters.success);
            }
            snapshot = await fallbackQuery.limit(1000).get();
            allLogs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            
            // Sort by timestamp in memory
            allLogs.sort((a: any, b: any) => {
              const timeA = new Date(a.timestamp || 0).getTime();
              const timeB = new Date(b.timestamp || 0).getTime();
              return timeB - timeA; // Descending
            });
            console.log(`[getSecurityLogs] Fallback query succeeded, found ${allLogs.length} logs`);
          } else {
            throw queryError;
          }
        }
        
        // Get total count
        let total = allLogs.length;
        if (allLogs.length < 1000) {
          total = allLogs.length;
        } else {
          // If we got 1000, the actual total might be more
          // For filtered queries, we'll use the fetched count
          total = allLogs.length;
        }
        
        // Calculate pagination
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const logs = allLogs.slice(startIndex, endIndex);
        
        console.log(`[getSecurityLogs] Returning ${logs.length} logs for page ${page}, total: ${total}`);
        
        return {
          logs,
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        };
      }
      
      // For non-filtered queries, use cache
      const cacheKey = `security_logs:${JSON.stringify(filters)}`;
      return await serverFirebaseCache.get(
        'security_logs',
        async () => {
          let query = db.collection('security_logs').orderBy('timestamp', 'desc');
          const snapshot = await query.limit(1000).get();
          const allLogs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          
          const startIndex = (page - 1) * limit;
          const endIndex = startIndex + limit;
          const logs = allLogs.slice(startIndex, endIndex);
          
          return {
            logs,
            total: allLogs.length,
            page,
            limit,
            totalPages: Math.ceil(allLogs.length / limit)
          };
        },
        {
          ttl: CACHE_TTL.SECURITY_LOGS,
          key: cacheKey
        }
      );
    } catch (error) {
      console.error('[getSecurityLogs] Failed to get security logs:', error);
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
