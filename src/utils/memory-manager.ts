/**
 * Memory Manager - Optimized for Mobile Device Memory Constraints
 * Aggressive garbage collection, object pooling, and leak prevention
 */

interface MemoryStats {
  used: number;
  limit: number;
  percentage: number;
  gc: number;
  timestamp: number;
}

interface PooledObject {
  _pooled: boolean;
  _id: string;
  reset(): void;
}

export class MemoryManager {
  private static instance: MemoryManager;
  private pools: Map<string, any[]> = new Map();
  private poolSizes: Map<string, number> = new Map();
  private stats: MemoryStats | null = null;
  private gcInterval: NodeJS.Timeout | null = null;
  private warningThreshold: number = 80;
  private criticalThreshold: number = 95;

  private constructor() {
    this.startGCMonitoring();
  }

  static getInstance(): MemoryManager {
    if (!MemoryManager.instance) {
      MemoryManager.instance = new MemoryManager();
    }
    return MemoryManager.instance;
  }

  /**
   * Create object pool for reusable objects
   */
  createPool<T extends PooledObject>(
    name: string,
    factory: () => T,
    initialSize: number = 10,
  ): void {
    if (this.pools.has(name)) {
      console.warn(`Pool "${name}" already exists`);
      return;
    }

    const pool: T[] = [];
    for (let i = 0; i < initialSize; i++) {
      const obj = factory();
      obj._pooled = true;
      obj._id = `${name}_${i}`;
      pool.push(obj);
    }

    this.pools.set(name, pool);
    this.poolSizes.set(name, initialSize);
  }

  /**
   * Get object from pool
   */
  acquire<T extends PooledObject>(name: string, factory?: () => T): T | null {
    const pool = this.pools.get(name);
    if (!pool) {
      console.warn(`Pool "${name}" not found`);
      return null;
    }

    if (pool.length > 0) {
      const obj = pool.pop();
      obj._pooled = false;
      return obj as T;
    }

    // Create new object if pool is empty
    if (factory) {
      const obj = factory();
      obj._pooled = false;
      return obj;
    }

    return null;
  }

  /**
   * Return object to pool
   */
  release<T extends PooledObject>(name: string, obj: T): boolean {
    const pool = this.pools.get(name);
    if (!pool) {
      console.warn(`Pool "${name}" not found`);
      return false;
    }

    // Reset object state
    if (obj.reset && typeof obj.reset === 'function') {
      obj.reset();
    }

    obj._pooled = true;

    // Check pool size limit
    const maxSize = this.poolSizes.get(name) || 10;
    if (pool.length < maxSize) {
      pool.push(obj);
      return true;
    }

    return false;
  }

  /**
   * Get current memory statistics
   */
  getStats(): MemoryStats {
    if ((performance as any).memory) {
      const memory = (performance as any).memory;
      return {
        used: memory.usedJSHeapSize,
        limit: memory.jsHeapSizeLimit,
        percentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100,
        gc: (performance as any).memory.totalJSHeapSize,
        timestamp: performance.now(),
      };
    }

    return {
      used: 0,
      limit: 0,
      percentage: 0,
      gc: 0,
      timestamp: performance.now(),
    };
  }

  /**
   * Force garbage collection (if available)
   */
  forceGC(): void {
    if ((global as any).gc) {
      (global as any).gc();
    }

    // Clear unused pools
    this.pools.forEach((pool) => {
      pool.length = Math.min(pool.length, 10);
    });
  }

  /**
   * Clear all pools
   */
  clearPools(): void {
    this.pools.forEach((pool) => {
      pool.length = 0;
    });
  }

  /**
   * Monitor memory and trigger warnings
   */
  private startGCMonitoring(): void {
    this.gcInterval = setInterval(() => {
      const stats = this.getStats();

      if (stats.percentage > this.criticalThreshold) {
        console.error(`🔴 CRITICAL MEMORY: ${stats.percentage.toFixed(2)}%`);
        this.forceGC();
      } else if (stats.percentage > this.warningThreshold) {
        console.warn(`🟡 HIGH MEMORY: ${stats.percentage.toFixed(2)}%`);
      }

      this.stats = stats;
    }, 5000); // Check every 5 seconds
  }

  /**
   * Stop monitoring
   */
  stopMonitoring(): void {
    if (this.gcInterval) {
      clearInterval(this.gcInterval);
      this.gcInterval = null;
    }
  }

  /**
   * Set memory thresholds for warnings
   */
  setThresholds(warning: number, critical: number): void {
    this.warningThreshold = warning;
    this.criticalThreshold = critical;
  }

  /**
   * Destroy manager
   */
  destroy(): void {
    this.stopMonitoring();
    this.clearPools();
    this.pools.clear();
    this.poolSizes.clear();
  }
}
