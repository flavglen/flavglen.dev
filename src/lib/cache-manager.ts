import { serverFirebaseCache } from "./firebase-cache-server";

/**
 * Cache management utility for Firebase operations
 * Provides high-level cache operations and invalidation strategies
 */
export class CacheManager {
  /**
   * Clear all cache entries
   */
  static clearAll(): void {
    serverFirebaseCache.invalidate();
    console.log("All cache entries cleared");
  }

  /**
   * Clear cache for specific collections
   */
  static clearCollection(collection: string): void {
    serverFirebaseCache.invalidate(collection);
    console.log(`Cache cleared for collection: ${collection}`);
  }

  /**
   * Clear cache for expense-related data
   */
  static clearExpenseCache(): void {
    serverFirebaseCache.invalidate("expenses");
    serverFirebaseCache.invalidate("period_data");
    console.log("Expense-related cache cleared");
  }

  /**
   * Clear cache for period data
   */
  static clearPeriodCache(): void {
    serverFirebaseCache.invalidate("period_data");
    console.log("Period data cache cleared");
  }

  /**
   * Clear cache for security logs
   */
  static clearSecurityCache(): void {
    serverFirebaseCache.invalidate("security_logs");
    console.log("Security logs cache cleared");
  }

  /**
   * Clear cache for skills data
   */
  static clearSkillsCache(): void {
    serverFirebaseCache.invalidate("skills");
    console.log("Skills cache cleared");
  }

  /**
   * Clear cache for debug/API data
   */
  static clearDebugCache(): void {
    serverFirebaseCache.invalidate("debug");
    serverFirebaseCache.invalidate("categories");
    console.log("Debug cache cleared");
  }

  /**
   * Get cache statistics
   */
  static getCacheStats(): { size: number; keys: string[] } {
    return serverFirebaseCache.getStats();
  }

  /**
   * Clean up expired cache entries
   */
  static cleanup(): void {
    serverFirebaseCache.cleanup();
  }

  /**
   * Set cache TTL for different data types
   */
  static setCacheTTL(dataType: 'expenses' | 'periods' | 'security' | 'skills' | 'debug'): number {
    const ttlMap = {
      expenses: 2 * 60 * 1000,    // 2 minutes
      periods: 5 * 60 * 1000,     // 5 minutes
      security: 1 * 60 * 1000,    // 1 minute
      skills: 10 * 60 * 1000,     // 10 minutes
      debug: 2 * 60 * 1000        // 2 minutes
    };
    
    return ttlMap[dataType];
  }

  /**
   * Invalidate cache after data modification operations
   */
  static invalidateAfterModification(operation: 'create' | 'update' | 'delete', dataType: string): void {
    console.log(`Invalidating cache after ${operation} operation on ${dataType}`);
    
    switch (dataType) {
      case 'expense':
        this.clearExpenseCache();
        break;
      case 'period':
        this.clearPeriodCache();
        break;
      case 'security':
        this.clearSecurityCache();
        break;
      case 'skill':
        this.clearSkillsCache();
        break;
      default:
        serverFirebaseCache.invalidate(dataType);
    }
  }
}

// Export singleton instance
export const cacheManager = CacheManager;
