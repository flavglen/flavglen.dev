// Client-safe common utilities
// This file can be imported in both client and server code

type Log = {
    message: string;
    error?: unknown
    date?: string;
    data?: unknown
}

// Client-safe version of saveLog (doesn't actually save to Firebase)
export async function saveLog(log: Log, success: boolean = true) {
  try{
    const logToStore = {
        ...log,
        success,
        date: new Date().toISOString(),
    }
    // Just log to console on client side
    console.log("Log (client-side):", logToStore);
    return true;
  }catch(e){
    console.log("failed to save log", e);
    return false;
  }
}

/**
 * Configure Firebase logging based on environment variable
 * Client-safe version (no-op)
 */
export function configureFirebaseLogging() {
  // Client-safe version - no Firebase operations
  console.log("Firebase logging configuration (client-side)");
}

/**
 * Check if middleware security logging is enabled
 * @returns boolean - true if logging is enabled, false if disabled
 */
export function isMiddlewareLoggingEnabled(): boolean {
  return process.env.MIDDLEWARE_DISABLE_LOGS !== 'true';
}