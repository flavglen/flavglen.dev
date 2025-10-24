import { db } from "@/lib/firebase";

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

interface CacheOptions {
  ttl?: number; // Time to live in milliseconds (default: 5 minutes)
  key?: string; // Custom cache key
}

class FirebaseCache {
  private cache = new Map<string, CacheEntry<any>>();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes in milliseconds

  /**
   * Generate a cache key from query parameters
   */
  private generateKey(collection: string, queryParams: any = {}): string {
    const sortedParams = Object.keys(queryParams)
      .sort()
      .reduce((result, key) => {
        result[key] = queryParams[key];
        return result;
      }, {} as any);
    
    return `${collection}:${JSON.stringify(sortedParams)}`;
  }

  /**
   * Check if cache entry is still valid
   */
  private isValid(entry: CacheEntry<any>): boolean {
    return Date.now() - entry.timestamp < entry.ttl;
  }

  /**
   * Get data from cache or execute query
   */
  async get<T>(
    collection: string,
    queryFn: () => Promise<T>,
    options: CacheOptions = {}
  ): Promise<T> {
    const key = options.key || this.generateKey(collection, options);
    const ttl = options.ttl || this.defaultTTL;

    // Check if we have valid cached data
    const cached = this.cache.get(key);
    if (cached && this.isValid(cached)) {
      console.log(`Cache hit for key: ${key}`);
      return cached.data;
    }

    console.log(`Cache miss for key: ${key}, fetching from Firebase`);
    
    try {
      // Execute the query
      const data = await queryFn();
      
      // Store in cache
      this.cache.set(key, {
        data,
        timestamp: Date.now(),
        ttl
      });

      return data;
    } catch (error) {
      console.error(`Error executing query for key: ${key}`, error);
      throw error;
    }
  }

  /**
   * Get collection data with caching
   */
  async getCollection<T>(
    collection: string,
    options: CacheOptions = {}
  ): Promise<T[]> {
    return this.get<T[]>(
      collection,
      async () => {
        const snapshot = await db.collection(collection).get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
      },
      options
    );
  }

  /**
   * Get collection data with where clause caching
   */
  async getCollectionWhere<T>(
    collection: string,
    field: string,
    operator: FirebaseFirestore.WhereFilterOp,
    value: any,
    options: CacheOptions = {}
  ): Promise<T[]> {
    return this.get<T[]>(
      collection,
      async () => {
        const snapshot = await db.collection(collection)
          .where(field, operator, value)
          .get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
      },
      { ...options, key: `${collection}:${field}:${operator}:${value}` }
    );
  }

  /**
   * Get collection data with multiple where clauses and ordering
   */
  async getCollectionQuery<T>(
    collection: string,
    queryBuilder: (query: FirebaseFirestore.CollectionReference) => FirebaseFirestore.Query,
    options: CacheOptions = {}
  ): Promise<T[]> {
    return this.get<T[]>(
      collection,
      async () => {
        const query = queryBuilder(db.collection(collection));
        const snapshot = await query.get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
      },
      options
    );
  }

  /**
   * Get document by ID with caching
   */
  async getDocument<T>(
    collection: string,
    docId: string,
    options: CacheOptions = {}
  ): Promise<T | null> {
    return this.get<T | null>(
      collection,
      async () => {
        const doc = await db.collection(collection).doc(docId).get();
        return doc.exists ? ({ id: doc.id, ...doc.data() } as T) : null;
      },
      { ...options, key: `${collection}:doc:${docId}` }
    );
  }

  /**
   * Invalidate cache entries by pattern
   */
  invalidate(pattern?: string): void {
    if (!pattern) {
      this.cache.clear();
      console.log('Cache cleared');
      return;
    }

    const keysToDelete = Array.from(this.cache.keys()).filter(key => 
      key.includes(pattern)
    );
    
    keysToDelete.forEach(key => {
      this.cache.delete(key);
    });
    
    console.log(`Invalidated ${keysToDelete.length} cache entries matching pattern: ${pattern}`);
  }

  /**
   * Invalidate cache for a specific collection
   */
  invalidateCollection(collection: string): void {
    this.invalidate(collection);
  }

  /**
   * Get cache statistics
   */
  getStats(): { size: number; keys: string[]; hitRate?: number } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }

  /**
   * Clean up expired entries
   */
  cleanup(): void {
    const now = Date.now();
    let cleaned = 0;
    
    const entries = Array.from(this.cache.entries());
    for (const [key, entry] of entries) {
      if (!this.isValid(entry)) {
        this.cache.delete(key);
        cleaned++;
      }
    }
    
    if (cleaned > 0) {
      console.log(`Cleaned up ${cleaned} expired cache entries`);
    }
  }

  /**
   * Set default TTL for new cache entries
   */
  setDefaultTTL(ttl: number): void {
    this.defaultTTL = ttl;
  }
}

// Export singleton instance
export const firebaseCache = new FirebaseCache();

// Auto-cleanup every 10 minutes
setInterval(() => {
  firebaseCache.cleanup();
}, 10 * 60 * 1000);

// Export types for use in other files
export type { CacheOptions };
