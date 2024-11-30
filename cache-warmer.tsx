import React, { memo, useEffect, useRef, useState, useCallback } from 'react';
import { logger } from '../utils/logger';

// Cache warming configuration
const WARMER_CONFIG = {
  concurrentLoads: 3,
  maxPrefetchSize: 50 * 1024 * 1024, // 50MB
  warmupInterval: 5000, // 5 seconds
  prefetchThreshold: 0.7, // 70% probability threshold
  maxRetries: 3,
  retryDelay: 1000, // 1 second
  analytics: {
    sampleSize: 100,
    minConfidence: 0.8
  }
};

// Resource prediction engine
class PredictionEngine {
  constructor() {
    this.patterns = new Map();
    this.sequence = [];
    this.maxSequenceLength = 5;
  }

  addPattern(from, to) {
    try {
      if (!this.patterns.has(from)) {
        this.patterns.set(from, new Map());
      }
      const transitions = this.patterns.get(from);
      transitions.set(to, (transitions.get(to) || 0) + 1);
    } catch (error) {
      logger.error('Error adding pattern:', error);
    }
  }

  recordAccess(resourceId) {
    try {
      if (this.sequence.length > 0) {
        const lastAccessed = this.sequence[this.sequence.length - 1];
        this.addPattern(lastAccessed, resourceId);
      }
      
      this.sequence.push(resourceId);
      if (this.sequence.length > this.maxSequenceLength) {
        this.sequence.shift();
      }
    } catch (error) {
      logger.error('Error recording access:', error);
    }
  }

  predictNext(currentId) {
    try {
      const transitions = this.patterns.get(currentId);
      if (!transitions) return [];

      // Calculate probabilities
      const total = Array.from(transitions.values())
        .reduce((sum, count) => sum + count, 0);

      return Array.from(transitions.entries())
        .map(([id, count]) => ({
          id,
          probability: count / total
        }))
        .filter(prediction => 
          prediction.probability >= WARMER_CONFIG.prefetchThreshold
        )
        .sort((a, b) => b.probability - a.probability);
    } catch (error) {
      logger.error('Error predicting next resources:', error);
      return [];
    }
  }
}

// Prefetch queue manager
class PrefetchQueue {
  constructor(maxConcurrent = WARMER_CONFIG.concurrentLoads) {
    this.queue = [];
    this.active = new Set();
    this.maxConcurrent = maxConcurrent;
  }

  add(resource) {
    if (!this.active.has(resource.id) && 
        !this.queue.some(r => r.id === resource.id)) {
      this.queue.push(resource);
    }
  }

  async process(fetchFn) {
    try {
      while (this.queue.length > 0 && 
             this.active.size < this.maxConcurrent) {
        const resource = this.queue.shift();
        this.active.add(resource.id);

        fetchFn(resource)
          .then(() => {
            this.active.delete(resource.id);
            this.process(fetchFn);
          })
          .catch(error => {
            logger.error('Error prefetching resource:', error);
            this.active.delete(resource.id);
            this.process(fetchFn);
          });
      }
    } catch (error) {
      logger.error('Error processing prefetch queue:', error);
    }
  }

  clear() {
    this.queue = [];
    this.active.clear();
  }
}

const CacheWarmer = memo(({
  children,
  onWarmupComplete,
  onPrefetchStart,
  className = ''
}) => {
  const [warmupStats, setWarmupStats] = useState({
    totalPredicted: 0,
    successful: 0,
    failed: 0,
    inProgress: 0
  });

  const predictionEngineRef = useRef(new PredictionEngine());
  const prefetchQueueRef = useRef(new PrefetchQueue());
  const resourceMapRef = useRef(new Map());

  // Resource fetching with retry logic
  const fetchResource = useCallback(async (resource, attempt = 0) => {
    try {
      setWarmupStats(prev => ({
        ...prev,
        inProgress: prev.inProgress + 1
      }));

      if (onPrefetchStart) {
        onPrefetchStart(resource);
      }

      const response = await fetch(resource.url, {
        method: 'GET',
        cache: 'force-cache'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.blob();
      resourceMapRef.current.set(resource.id, data);

      setWarmupStats(prev => ({
        ...prev,
        successful: prev.successful + 1,
        inProgress: prev.inProgress - 1
      }));

      return data;
    } catch (error) {
      if (attempt < WARMER_CONFIG.maxRetries) {
        await new Promise(resolve => 
          setTimeout(resolve, WARMER_CONFIG.retryDelay * Math.pow(2, attempt))
        );
        return fetchResource(resource, attempt + 1);
      }

      setWarmupStats(prev => ({
        ...prev,
        failed: prev.failed + 1,
        inProgress: prev.inProgress - 1
      }));

      throw error;
    }
  }, [onPrefetchStart]);

  // Initialize warmup process
  useEffect(() => {
    const warmup = async () => {
      try {
        const currentResource = resourceMapRef.current.get('current');
        if (!currentResource) return;

        const predictions = predictionEngineRef.current
          .predictNext(currentResource.id);

        setWarmupStats(prev => ({
          ...prev,
          totalPredicted: prev.totalPredicted + predictions.length
        }));

        // Queue predicted resources
        predictions.forEach(prediction => {
          const resource = resourceMapRef.current.get(prediction.id);
          if (resource) {
            prefetchQueueRef.current.add({
              ...resource,
              priority: prediction.probability
            });
          }
        });

        // Process queue
        await prefetchQueueRef.current.process(fetchResource);

        if (onWarmupComplete) {
          onWarmupComplete(warmupStats);
        }
      } catch (error) {
        logger.error('Error during cache warmup:', error);
      }
    };

    const intervalId = setInterval(warmup, WARMER_CONFIG.warmupInterval);
    return () => clearInterval(intervalId);
  }, [fetchResource, onWarmupComplete, warmupStats]);

  return (
    <div className={className}>
      {children}

      {/* Warmup Stats (Development Only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 text-xs text-gray-400">
          Warmup: {warmupStats.successful}/{warmupStats.totalPredicted} 
          ({warmupStats.inProgress} in progress, {warmupStats.failed} failed)
        </div>
      )}
    </div>
  );
});

CacheWarmer.displayName = 'CacheWarmer';

export default CacheWarmer;