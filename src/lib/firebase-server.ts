// Server-only Firebase operations
// This file should only be imported in server-side code (API routes, middleware, etc.)

import admin from "firebase-admin";

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

  // Get security logs
  async getSecurityLogs(filters: any = {}) {
    try {
      let query = db.collection('security_logs').orderBy('timestamp', 'desc');
      
      // Apply filters
      if (filters.eventType) {
        query = query.where('eventType', '==', filters.eventType);
      }
      if (filters.level) {
        query = query.where('level', '==', filters.level);
      }
      if (filters.userEmail) {
        query = query.where('userEmail', '==', filters.userEmail);
      }
      if (filters.success !== undefined) {
        query = query.where('success', '==', filters.success);
      }
      
      const snapshot = await query.limit(1000).get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Failed to get security logs:', error);
      return [];
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
