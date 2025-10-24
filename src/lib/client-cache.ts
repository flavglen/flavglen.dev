// Client-side cache utility for API responses
// This provides persistent caching using localStorage for client-side components

// Cache TTL Configuration (in milliseconds)
export const CACHE_TTL = {
  PERIOD_ANALYTICS: 12 * 60 * 60 * 1000,    // 12 hours for period analytics
  EXPENSES: 2 * 60 * 1000,            // 2 minutes for expenses
  SKILLS: 24 * 60 * 60 * 1000,            // 24 hours for skills (rarely changes)
  SECURITY_LOGS: 1 * 60 * 1000,      // 1 minute for security logs
  DEBUG_DATA: 2 * 60 * 1000,         // 2 minutes for debug data
  DEFAULT: 5 * 60 * 1000,            // 5 minutes default
} as const;

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

interface CacheOptions {
  ttl?: number; // Time to live in milliseconds (default: 5 minutes)
  key?: string; // Custom cache key
}

class ClientCache {
  private cache = new Map<string, CacheEntry<any>>();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes in milliseconds
  private storageKey = 'expense-cache'; // localStorage key
  private pendingRequests = new Map<string, Promise<any>>(); // Track in-flight requests

  constructor() {
    console.log('[Cache] ClientCache constructor called');
    this.loadFromStorage();
  }

  /**
   * Load cache from localStorage
   */
  private loadFromStorage(): void {
    if (typeof window === 'undefined') return;
    
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const data = JSON.parse(stored);
        this.cache = new Map(data);
        console.log(`[Cache] Loaded ${this.cache.size} entries from localStorage`);
        this.cleanup(); // Remove expired entries on load
      }
    } catch (error) {
      console.warn('Failed to load cache from localStorage:', error);
    }
  }

  /**
   * Save cache to localStorage
   */
  private saveToStorage(): void {
    if (typeof window === 'undefined') return;
    
    try {
      const data = Array.from(this.cache.entries());
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save cache to localStorage:', error);
    }
  }

  /**
   * Check if cache entry is still valid
   */
  private isValid(entry: CacheEntry<any>): boolean {
    return Date.now() - entry.timestamp < entry.ttl;
  }

  /**
   * Get data from cache or execute fetch
   */
  async get<T>(
    url: string,
    options: RequestInit = {},
    cacheOptions: CacheOptions = {}
  ): Promise<T> {
    const key = cacheOptions.key || this.generateKey(url, options);
    const ttl = cacheOptions.ttl || this.defaultTTL;

    // Check if we have valid cached data
    const cached = this.cache.get(key);
    
    if (cached && this.isValid(cached)) {
      console.log(`✅ Client cache HIT for key: ${key}`);
      return cached.data;
    }
    
    console.log(`❌ Client cache MISS for key: ${key}`);
    console.log(`   Cache size: ${this.cache.size} entries`);
    if (this.cache.size > 0) {
      console.log(`   Available keys:`, Array.from(this.cache.keys()));
      console.log(`   Looking for:`, key);
    }

    // Check if there's already a pending request for this key
    const pending = this.pendingRequests.get(key);
    if (pending) {
      console.log(`Request already in progress for key: ${key}, waiting...`);
      return pending;
    }

    console.log(`Client cache miss for key: ${key}, fetching from API`);
    
    // Create the fetch promise
    const fetchPromise = (async () => {
      try {
        // Execute the fetch
        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Store in cache
        this.cache.set(key, {
          data,
          timestamp: Date.now(),
          ttl
        });

        // Save to localStorage
        this.saveToStorage();

        return data;
      } catch (error) {
        console.error(`Error fetching data for key: ${key}`, error);
        throw error;
      } finally {
        // Remove from pending requests
        this.pendingRequests.delete(key);
      }
    })();

    // Track this pending request
    this.pendingRequests.set(key, fetchPromise);

    return fetchPromise;
  }

  /**
   * Generate a cache key from URL and options
   */
  private generateKey(url: string, options: RequestInit = {}): string {
    const method = options.method || 'GET';
    const body = options.body ? JSON.stringify(options.body) : '';
    const headers = options.headers ? JSON.stringify(options.headers) : '';
    return `${method}:${url}:${body}:${headers}`;
  }

  /**
   * Invalidate cache entries by pattern
   */
  invalidate(pattern?: string): void {
    if (!pattern) {
      this.cache.clear();
      console.log('Client cache cleared');
    } else {
      const keysToDelete = Array.from(this.cache.keys()).filter(key => 
        key.includes(pattern)
      );
      
      keysToDelete.forEach(key => {
        this.cache.delete(key);
      });
      
      console.log(`Invalidated ${keysToDelete.length} client cache entries matching pattern: ${pattern}`);
    }

    // Save to localStorage after invalidation
    this.saveToStorage();
  }

  /**
   * Get cache statistics
   */
  getStats(): { size: number; keys: string[] } {
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
      console.log(`Cleaned up ${cleaned} expired client cache entries`);
      // Save to localStorage after cleanup
      this.saveToStorage();
    }
  }

  /**
   * Set default TTL for new cache entries
   */
  setDefaultTTL(ttl: number): void {
    this.defaultTTL = ttl;
  }

  /**
   * Clear all cache and localStorage
   */
  clearAll(): void {
    this.cache.clear();
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.storageKey);
    }
    console.log('Client cache and localStorage cleared');
  }

  /**
   * Clear old cache entries with timestamp-based keys (but keep normalized ones)
   */
  clearOldEntries(): void {
    const keysToDelete = Array.from(this.cache.keys()).filter(key => 
      key.includes('period-analytics:') && 
      key.includes('T') && 
      key.includes(':') &&
      // Only delete entries that have full timestamps (not normalized to start of day)
      !key.includes('T04:00:00.000Z')
    );
    
    keysToDelete.forEach(key => {
      this.cache.delete(key);
    });
    
    if (keysToDelete.length > 0) {
      console.log(`Cleared ${keysToDelete.length} old cache entries`);
      this.saveToStorage();
    }
  }
}

// Export singleton instance
export const clientCache = new ClientCache();

// Auto-cleanup every 10 minutes
if (typeof window !== 'undefined') {
  setInterval(() => {
    clientCache.cleanup();
  }, 10 * 60 * 1000);
}

// Export types for use in other files
export type { CacheOptions };
