import React, { memo, useEffect, useRef, useState, useCallback } from 'react';
import { logger } from '../utils/logger';

// Cache configuration
const CACHE_CONFIG = {
  maxSize: 100 * 1024 * 1024, // 100MB
  maxEntries: 1000,
  defaultTTL: 3600000, // 1 hour
  cleanupInterval: 300000, // 5 minutes
  priorities: {
    HIGH: 3,
    MEDIUM: 2,
    LOW: 1
  }
};

// Cache entry structure
class CacheEntry {
  constructor(key, value, options = {}) {
    this.key = key;
    this.value = value;
    this.size = options.size || 0;
    this.priority = options.priority || CACHE_CONFIG.priorities.MEDIUM;
    this.timestamp = Date.now();
    this.expires = options.ttl ? 
      this.timestamp + options.ttl : 
      this.timestamp + CACHE_CONFIG.defaultTTL;
    this.hits = 0;
    this.lastAccessed = this.timestamp;
  }

  isExpired() {
    return Date.now() >= this.expires;
  }

  touch() {
    this.hits++;
    this.lastAccessed = Date.now();
  }
}

// LRU Cache implementation
class LRUCache {
  constructor(maxSize = CACHE_CONFIG.maxSize) {
    this.maxSize = maxSize;
    this.size = 0;
    this.cache = new Map();
    this.head = { next: null, prev: null };
    this.tail = { next: null, prev: null };
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  get(key) {
    const node = this.cache.get(key);
    if (!node) return null;

    // Move to front (most recently used)
    this.moveToFront(node);
    return node.value;
  }

  set(key, value, size = 0) {
    // Remove if exists
    if (this.cache.has(key)) {
      this.remove(key);
    }

    // Ensure space
    while (this.size + size > this.maxSize && this.cache.size > 0) {
      this.removeLRU();
    }

    // Add new entry
    const node = { key, value, size, next: null, prev: null };
    this.cache.set(key, node);
    this.size += size;
    this.moveToFront(node);

    return true;
  }

  remove(key) {
    const node = this.cache.get(key);
    if (!node) return false;

    this.removeNode(node);
    this.cache.delete(key);
    this.size -= node.size;
    return true;
  }

  moveToFront(node) {
    this.removeNode(node);
    node.next = this.head.next;
    node.prev = this.head;
    this.head.next.prev = node;
    this.head.next = node;
  }

  removeLRU() {
    if (this.cache.size === 0) return false;
    const node = this.tail.prev;
    this.removeNode(node);
    this.cache.delete(node.key);
    this.size -= node.size;
    return true;
  }

  removeNode(node) {
    if (node.prev) node.prev.next = node.next;
    if (node.next) node.next.prev = node.prev;
  }

  clear() {
    this.cache.clear();
    this.size = 0;
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }
}

const CacheManager = memo(({
  children,
  onCacheUpdate,
  onCacheError,
  className = ''
}) => {
  const [cacheStats, setCacheStats] = useState({
    size: 0,
    entries: 0,
    hits: 0,
    misses: 0
  });

  const cacheRef = useRef(new LRUCache());
  const statsIntervalRef = useRef(null);

  // Initialize cache monitoring
  useEffect(() => {
    const updateStats = () => {
      try {
        const stats = {
          size: cacheRef.current.size,
          entries: cacheRef.current.cache.size,
          hits: Array.from(cacheRef.current.cache.values())
            .reduce((acc, node) => acc + (node.value.hits || 0), 0),
          misses: cacheStats.misses
        };

        setCacheStats(stats);
        if (onCacheUpdate) {
          onCacheUpdate(stats);
        }
      } catch (error) {
        logger.error('Error updating cache stats:', error);
        if (onCacheError) {
          onCacheError(error);
        }
      }
    };

    statsIntervalRef.current = setInterval(updateStats, 1000);
    return () => clearInterval(statsIntervalRef.current);
  }, [onCacheUpdate, onCacheError, cacheStats.misses]);

  // Cache cleanup
  useEffect(() => {
    const cleanup = () => {
      try {
        const now = Date.now();
        let removedCount = 0;
        
        cacheRef.current.cache.forEach((node, key) => {
          if (node.value.expires <= now) {
            cacheRef.current.remove(key);
            removedCount++;
          }
        });

        if (removedCount > 0) {
          logger.info(`Cleaned up ${removedCount} expired cache entries`);
        }
      } catch (error) {
        logger.error('Error during cache cleanup:', error);
      }
    };

    const intervalId = setInterval(cleanup, CACHE_CONFIG.cleanupInterval);
    return () => clearInterval(intervalId);
  }, []);

  // Cache management methods
  const cacheSet = useCallback((key, value, options = {}) => {
    try {
      const entry = new CacheEntry(key, value, options);
      return cacheRef.current.set(key, entry, entry.size);
    } catch (error) {
      logger.error('Error setting cache entry:', error);
      return false;
    }
  }, []);

  const cacheGet = useCallback((key) => {
    try {
      const entry = cacheRef.current.get(key);
      if (!entry) {
        setCacheStats(prev => ({ ...prev, misses: prev.misses + 1 }));
        return null;
      }

      if (entry.isExpired()) {
        cacheRef.current.remove(key);
        setCacheStats(prev => ({ ...prev, misses: prev.misses + 1 }));
        return null;
      }

      entry.touch();
      return entry.value;
    } catch (error) {
      logger.error('Error getting cache entry:', error);
      return null;
    }
  }, []);

  const cacheClear = useCallback(() => {
    try {
      cacheRef.current.clear();
      setCacheStats({
        size: 0,
        entries: 0,
        hits: 0,
        misses: 0
      });
    } catch (error) {
      logger.error('Error clearing cache:', error);
    }
  }, []);

  return (
    <div className={className}>
      {children}

      {/* Cache Stats (Development Only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-4 left-4 text-xs text-gray-400">
          Cache: {(cacheStats.size / 1024 / 1024).toFixed(2)}MB | 
          Entries: {cacheStats.entries} | 
          Hit Rate: {((cacheStats.hits / (cacheStats.hits + cacheStats.misses)) * 100 || 0).toFixed(1)}%
        </div>
      )}
    </div>
  );
});

CacheManager.displayName = 'CacheManager';

export default CacheManager;