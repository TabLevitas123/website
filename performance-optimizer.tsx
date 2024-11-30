import React, { memo, useEffect, useRef, useState, useCallback } from 'react';
import { logger } from '../utils/logger';

// Performance thresholds
const PERFORMANCE_THRESHOLDS = {
  fps: {
    critical: 30,
    warning: 45,
    target: 60
  },
  memory: {
    critical: 90, // 90% of available memory
    warning: 70,
    target: 50
  },
  loadTime: {
    critical: 3000, // 3 seconds
    warning: 2000,
    target: 1000
  },
  idleTime: {
    min: 50, // Minimum idle time in ms
    max: 100
  }
};

// Resource management utilities
const ResourceManager = {
  // Memory management
  getMemoryUsage: () => {
    try {
      if (performance.memory) {
        return {
          used: performance.memory.usedJSHeapSize,
          total: performance.memory.jsHeapSizeLimit,
          percentage: (performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit) * 100
        };
      }
      return null;
    } catch (error) {
      logger.error('Error getting memory usage:', error);
      return null;
    }
  },

  // CPU usage estimation
  getCPUUsage: (samples = 10) => {
    return new Promise(resolve => {
      const times = [];
      let count = 0;

      const measure = () => {
        const startTime = performance.now();
        const multiplier = Math.pow(Math.sin(startTime), 2) + 1;
        const endTime = performance.now();
        
        times.push(endTime - startTime);
        count++;

        if (count < samples) {
          requestAnimationFrame(measure);
        } else {
          const avgTime = times.reduce((a, b) => a + b) / times.length;
          resolve(avgTime);
        }
      };

      requestAnimationFrame(measure);
    });
  },

  // Frame rate monitoring
  getFPS: (() => {
    let lastTime = performance.now();
    let frames = 0;
    let fps = 60;

    return () => {
      frames++;
      const currentTime = performance.now();
      
      if (currentTime >= lastTime + 1000) {
        fps = Math.round((frames * 1000) / (currentTime - lastTime));
        frames = 0;
        lastTime = currentTime;
      }
      
      return fps;
    };
  })()
};

// Optimization strategies
const OptimizationStrategies = {
  // Frame rate optimization
  optimizeFrameRate: (currentFPS) => {
    if (currentFPS < PERFORMANCE_THRESHOLDS.fps.critical) {
      return {
        reducedAnimations: true,
        disableParticles: true,
        reduceEffects: true
      };
    } else if (currentFPS < PERFORMANCE_THRESHOLDS.fps.warning) {
      return {
        reducedAnimations: true,
        disableParticles: false,
        reduceEffects: true
      };
    }
    return {
      reducedAnimations: false,
      disableParticles: false,
      reduceEffects: false
    };
  },

  // Memory optimization
  optimizeMemory: (memoryUsage) => {
    if (memoryUsage > PERFORMANCE_THRESHOLDS.memory.critical) {
      return {
        clearCache: true,
        reduceHistory: true,
        disableLogging: true
      };
    } else if (memoryUsage > PERFORMANCE_THRESHOLDS.memory.warning) {
      return {
        clearCache: true,
        reduceHistory: false,
        disableLogging: false
      };
    }
    return {
      clearCache: false,
      reduceHistory: false,
      disableLogging: false
    };
  },

  // Load time optimization
  optimizeLoadTime: (loadTime) => {
    if (loadTime > PERFORMANCE_THRESHOLDS.loadTime.critical) {
      return {
        lazyLoad: true,
        preloadNext: false,
        cacheResults: true
      };
    } else if (loadTime > PERFORMANCE_THRESHOLDS.loadTime.warning) {
      return {
        lazyLoad: true,
        preloadNext: true,
        cacheResults: true
      };
    }
    return {
      lazyLoad: false,
      preloadNext: true,
      cacheResults: true
    };
  }
};

const PerformanceOptimizer = memo(({
  children,
  onOptimize,
  monitoringInterval = 1000,
  className = ''
}) => {
  const [metrics, setMetrics] = useState({
    fps: 60,
    memoryUsage: 0,
    cpuUsage: 0,
    loadTime: 0
  });

  const [optimizations, setOptimizations] = useState({
    reducedAnimations: false,
    disableParticles: false,
    reduceEffects: false,
    clearCache: false,
    reduceHistory: false,
    disableLogging: false,
    lazyLoad: false,
    preloadNext: true,
    cacheResults: true
  });

  const metricsHistoryRef = useRef([]);
  const frameCountRef = useRef(0);
  const lastFrameTimeRef = useRef(performance.now());

  // Update metrics
  const updateMetrics = useCallback(async () => {
    try {
      // Get current FPS
      const currentTime = performance.now();
      const deltaTime = currentTime - lastFrameTimeRef.current;
      frameCountRef.current++;
      
      if (deltaTime >= 1000) {
        const fps = Math.round((frameCountRef.current * 1000) / deltaTime);
        frameCountRef.current = 0;
        lastFrameTimeRef.current = currentTime;

        // Get other metrics
        const memoryUsage = ResourceManager.getMemoryUsage();
        const cpuUsage = await ResourceManager.getCPUUsage();

        const newMetrics = {
          fps,
          memoryUsage: memoryUsage?.percentage || 0,
          cpuUsage,
          loadTime: performance.timing?.loadEventEnd - performance.timing?.navigationStart || 0
        };

        setMetrics(newMetrics);
        metricsHistoryRef.current.push({
          ...newMetrics,
          timestamp: currentTime
        });

        // Keep only last hour of metrics
        if (metricsHistoryRef.current.length > 3600) {
          metricsHistoryRef.current.shift();
        }

        // Apply optimizations
        const newOptimizations = {
          ...OptimizationStrategies.optimizeFrameRate(fps),
          ...OptimizationStrategies.optimizeMemory(memoryUsage?.percentage || 0),
          ...OptimizationStrategies.optimizeLoadTime(newMetrics.loadTime)
        };

        setOptimizations(newOptimizations);
        if (onOptimize) onOptimize(newOptimizations);

        logger.debug('Performance metrics updated:', {
          metrics: newMetrics,
          optimizations: newOptimizations
        });
      }
    } catch (error) {
      logger.error('Error updating performance metrics:', error);
    }

    requestAnimationFrame(updateMetrics);
  }, [onOptimize]);

  // Start monitoring
  useEffect(() => {
    const rafId = requestAnimationFrame(updateMetrics);
    return () => cancelAnimationFrame(rafId);
  }, [updateMetrics]);

  return (
    <div className={className}>
      {/* Optimization Context Provider */}
      <div style={{ 
        filter: optimizations.reduceEffects ? 'none' : undefined,
        transition: optimizations.reducedAnimations ? 'none' : undefined
      }}>
        {children}
      </div>

      {/* Debug Overlay (Development Only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 text-xs text-gray-400 space-y-1">
          <div>FPS: {metrics.fps}</div>
          <div>Memory: {Math.round(metrics.memoryUsage)}%</div>
          <div>CPU: {Math.round(metrics.cpuUsage)}ms</div>
          <div>Load: {metrics.loadTime}ms</div>
        </div>
      )}
    </div>
  );
});

PerformanceOptimizer.displayName = 'PerformanceOptimizer';

export default PerformanceOptimizer;