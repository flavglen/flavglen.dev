// Server-only common utilities
// This file should only be imported in server-side code (API routes, server components, etc.)

import { db } from "@/lib/firebase";
import { v4 as uuidv4 } from 'uuid';

type Log = {
    message: string;
    error?: unknown
    date?: string;
    data?: unknown
}

export async function saveLog(log: Log, success: boolean = true) {
  try{
    const logToStore = {
        ...log,
        success,
        date: new Date().toISOString(),
    }
    // generate random firebase doc id
    await db.collection("ai_expenses_logs").doc(uuidv4()).set({ ...logToStore });
    console.log("Log has been saved:");
    return true;
  }catch(e){
    console.log("failed to save log", e);
    return false;
  }
}

/**
 * Configure Firebase logging based on environment variable
 * Call this function before initializing Firebase Admin SDK
 * Server-only function
 */
export function configureFirebaseLogging() {
  // Only run on server side
  if (typeof window !== 'undefined') {
    return;
  }

  if (process.env.FIREBASE_DISABLE_LOGS === 'true') {
    try {
      // Disable Firebase logs
      const admin = require('firebase-admin');
      if (admin && typeof admin.setLogLevel === 'function') {
        admin.setLogLevel('silent');
      }
    } catch (error) {
      // Silently fail if firebase-admin is not available
      console.warn('Could not configure Firebase logging:', error);
    }
  }
}

/**
 * Check if middleware security logging is enabled
 * @returns boolean - true if logging is enabled, false if disabled
 */
export function isMiddlewareLoggingEnabled(): boolean {
  return Boolean(process.env.MIDDLEWARE_DISABLE_LOGS);
}
