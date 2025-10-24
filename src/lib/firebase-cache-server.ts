// Server-only Firebase cache wrapper
// This file should only be imported in server-side code (API routes, server components, etc.)

import { firebaseCache } from "./firebase-cache";

// Re-export the cache with server-only guarantee
export { firebaseCache };

// Server-only cache operations
export class ServerFirebaseCache {
  private static instance: ServerFirebaseCache;
  
  private constructor() {
    // Ensure this only runs on server
    if (typeof window !== 'undefined') {
      throw new Error('ServerFirebaseCache should only be used on the server side');
    }
  }
  
  public static getInstance(): ServerFirebaseCache {
    if (!ServerFirebaseCache.instance) {
      ServerFirebaseCache.instance = new ServerFirebaseCache();
    }
    return ServerFirebaseCache.instance;
  }

  // Wrapper methods that ensure server-side usage
  async get<T>(
    collection: string,
    queryFn: () => Promise<T>,
    options: any = {}
  ): Promise<T> {
    return firebaseCache.get(collection, queryFn, options);
  }

  async getCollection<T>(
    collection: string,
    options: any = {}
  ): Promise<T[]> {
    return firebaseCache.getCollection(collection, options);
  }

  async getCollectionQuery<T>(
    collection: string,
    queryBuilder: (query: any) => any,
    options: any = {}
  ): Promise<T[]> {
    return firebaseCache.getCollectionQuery(collection, queryBuilder, options);
  }

  invalidate(pattern?: string): void {
    firebaseCache.invalidate(pattern);
  }

  getStats(): { size: number; keys: string[] } {
    return firebaseCache.getStats();
  }

  cleanup(): void {
    firebaseCache.cleanup();
  }
}

// Export singleton instance
export const serverFirebaseCache = ServerFirebaseCache.getInstance();

// Re-export TTL constants for server-side use
export { CACHE_TTL } from "./client-cache";
