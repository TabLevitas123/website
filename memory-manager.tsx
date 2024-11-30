import React, { memo, useEffect, useRef, useState, useCallback } from 'react';
import { logger } from '../utils/logger';

// Memory thresholds and configurations
const MEMORY_CONFIG = {
  thresholds: {
    critical: 0.9,    // 90% of available memory
    warning: 0.7,     // 70% of available memory
    target: 0.5      // 50% target usage
  },
  cleanup: {
    interval: 30000,  // Run cleanup every 30 seconds
    threshold: 0.8    // Start cleanup at 80% usage
  },
  pool: {
    maxSize: 100,    // Maximum pool size
    minSize: 10      // Minimum pool size
  }
};

// Memory monitoring utilities
class MemoryMonitor {
  constructor() {
    this.measurements = [];
    this.maxMeasurements = 100;
  }

  measure() {
    try {
      if (performance.memory) {
        const usage = {
          timestamp: Date.now(),
          used: performance.memory.usedJSHeapSize,
          total: performance.memory.jsHeapSizeLimit,
          percentage: performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit
        };

        this.measurements.push(usage);
        if (this.measurements.length > this.maxMeasurements) {
          this.measurements.shift();
        }

        return usage;
      }
      return null;
    } catch (error) {
      logger.error('Error measuring memory:', error);
      return null;
    }
  }

  getAverageUsage(duration = 60000) {
    try {
      const now = Date.now();
      const relevantMeasurements = this.measurements.filter(
        m => now - m.timestamp <= duration
      );

      if (relevantMeasurements.length === 0) return null;

      const avgUsage = relevantMeasurements.reduce(
        (acc, m) => acc + m.percentage, 
        0
      ) / relevantMeasurements.length;

      return avgUsage;
    } catch (error) {
      logger.error('Error calculating average usage:', error);
      return null;
    }
  }

  getTrend(duration = 300000) {
    try {
      const measurements = this.measurements.filter(
        m => Date.now() - m.timestamp <= duration
      );

      if (measurements.length < 2) return 0;

      const first = measurements[0].percentage;
      const last = measurements[measurements.length - 1].percentage;

      return (last - first) / first;
    } catch (error) {
      logger.error('Error calculating memory trend:', error);
      return 0;
    }
  }
}

// Resource pool for reusable objects
class ResourcePool {
  constructor(createFn, maxSize = MEMORY_CONFIG.pool.maxSize) {
    this.pool = [];
    this.createFn = createFn;
    this.maxSize = maxSize;
  }

  acquire() {
    try {
      if (this.pool.length > 0) {
        return this.pool.pop();
      }
      return this.createFn();
    } catch (error) {
      logger.error('Error acquiring resource:', error);
      return null;
    }
  }

  release(resource) {
    try {
      if (this.pool.length < this.maxSize) {
        this.pool.push(resource);
      }
    } catch (error) {
      logger.error('Error releasing resource:', error);
    }
  }

  clear() {
    try {
      this.pool = [];
    } catch (error) {
      logger.error('Error clearing resource pool:', error);
    }
  }
}

const MemoryManager = memo(({
  children,
  onMemoryWarning,
  onMemoryCritical,
  className = ''
}) => {
  const [memoryState, setMemoryState] = useState({
    usage: 0,
    isWarning: false,
    isCritical: false
  });

  const monitorRef = useRef(new MemoryMonitor());
  const lastCleanupRef = useRef(Date.now());
  const resourcePoolsRef = useRef(new Map());

  // Memory cleanup function
  const performCleanup = useCallback(() => {
    try {
      logger.info('Starting memory cleanup');

      // Clear expired resource pools
      resourcePoolsRef.current.forEach((pool, key) => {
        pool.clear();
        if (pool.pool.length === 0) {
          resourcePoolsRef.current.delete(key);
        }
      });

      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }

      lastCleanupRef.current = Date.now();
      logger.info('Memory cleanup complete');
    } catch (error) {
      logger.error('Error during memory cleanup:', error);
    }
  }, []);

  // Monitor memory usage
  useEffect(() => {
    const checkMemory = () => {
      try {
        const usage = monitorRef.current.measure();
        if (!usage) return;

        const isWarning = usage.percentage >= MEMORY_CONFIG.thresholds.warning;
        const isCritical = usage.percentage >= MEMORY_CONFIG.thresholds.critical;

        setMemoryState({
          usage: usage.percentage,
          isWarning,
          isCritical
        });

        // Handle warning and critical states
        if (isCritical) {
          onMemoryCritical?.();
          performCleanup();
        } else if (isWarning) {
          onMemoryWarning?.();
        }

        // Regular cleanup check
        const timeSinceCleanup = Date.now() - lastCleanupRef.current;
        if (timeSinceCleanup >= MEMORY_CONFIG.cleanup.interval &&
            usage.percentage >= MEMORY_CONFIG.cleanup.threshold) {
          performCleanup();
        }
      } catch (error) {
        logger.error('Error checking memory:', error);
      }
    };

    const intervalId = setInterval(checkMemory, 1000);
    return () => clearInterval(intervalId);
  }, [onMemoryWarning, onMemoryCritical, performCleanup]);

  // Create a resource pool
  const createPool = useCallback((key, createFn) => {
    try {
      if (!resourcePoolsRef.current.has(key)) {
        resourcePoolsRef.current.set(key, new ResourcePool(createFn));
      }
      return resourcePoolsRef.current.get(key);
    } catch (error) {
      logger.error('Error creating resource pool:', error);
      return null;
    }
  }, []);

  return (
    <div className={className}>
      {children}

      {/* Memory Usage Indicator (Development Only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-4 right-4 text-xs text-gray-400">
          Memory: {(memoryState.usage * 100).toFixed(1)}%
          {memoryState.isWarning && ' ⚠️'}
          {memoryState.isCritical && ' 🔴'}
        </div>
      )}
    </div>
  );
});

MemoryManager.displayName = 'MemoryManager';

export default MemoryManager;