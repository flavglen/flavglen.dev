import { firebaseCache } from "./firebase-cache";
import { db } from "./firebase";

/**
 * Simple test to verify Firebase cache is working
 * This file can be removed after testing
 */
export async function testFirebaseCache() {
  console.log("Testing Firebase cache...");
  
  try {
    // Test 1: Basic collection caching
    console.log("Test 1: Basic collection caching");
    const start1 = Date.now();
    const skills1 = await firebaseCache.getCollection("skills", {
      ttl: 5 * 60 * 1000,
      key: "test:skills:all"
    });
    const time1 = Date.now() - start1;
    console.log(`First call took ${time1}ms, got ${skills1.length} skills`);
    
    // Test 2: Cache hit
    console.log("Test 2: Cache hit test");
    const start2 = Date.now();
    const skills2 = await firebaseCache.getCollection("skills", {
      ttl: 5 * 60 * 1000,
      key: "test:skills:all"
    });
    const time2 = Date.now() - start2;
    console.log(`Second call took ${time2}ms, got ${skills2.length} skills`);
    
    // Test 3: Cache statistics
    console.log("Test 3: Cache statistics");
    const stats = firebaseCache.getStats();
    console.log(`Cache size: ${stats.size}, Keys: ${stats.keys.join(', ')}`);
    
    // Test 4: Cache invalidation
    console.log("Test 4: Cache invalidation");
    firebaseCache.invalidate("test");
    const statsAfterInvalidation = firebaseCache.getStats();
    console.log(`Cache size after invalidation: ${statsAfterInvalidation.size}`);
    
    console.log("Firebase cache test completed successfully!");
    return true;
  } catch (error) {
    console.error("Firebase cache test failed:", error);
    return false;
  }
}

/**
 * Test cache with query operations
 */
export async function testCacheWithQueries() {
  console.log("Testing Firebase cache with queries...");
  
  try {
    // Test query caching
    const start = Date.now();
    const expenses = await firebaseCache.getCollectionQuery(
      "ai_expenses",
      (query) => query.limit(5),
      {
        ttl: 2 * 60 * 1000,
        key: "test:expenses:limit5"
      }
    );
    const time = Date.now() - start;
    console.log(`Query call took ${time}ms, got ${expenses.length} expenses`);
    
    // Test cache hit
    const start2 = Date.now();
    const expenses2 = await firebaseCache.getCollectionQuery(
      "ai_expenses",
      (query) => query.limit(5),
      {
        ttl: 2 * 60 * 1000,
        key: "test:expenses:limit5"
      }
    );
    const time2 = Date.now() - start2;
    console.log(`Cached query call took ${time2}ms, got ${expenses2.length} expenses`);
    
    console.log("Query cache test completed successfully!");
    return true;
  } catch (error) {
    console.error("Query cache test failed:", error);
    return false;
  }
}
