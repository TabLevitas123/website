import { logger } from '../utils/logger';

// Base cache strategy interface
class BaseCacheStrategy {
  constructor(maxSize, maxEntries) {
    this.maxSize = maxSize;
    this.maxEntries = maxEntries;
    this.currentSize = 0;
    this.entries = new Map();
    this.metadata = new Map();
  }

  set(key, value, options = {}) {
    try {
      const size = options.size || this.calculateSize(value);
      if (size > this.maxSize) {
        throw new Error('Entry too large for cache');
      }

      // Ensure space
      while (this.currentSize + size > this.maxSize) {
        this.evict();
      }

      // Add entry
      this.entries.set(key, value);
      this.metadata.set(key, {
        size,
        priority: options.priority || 0,
        timestamp: Date.now(),
        accessCount: 0,
        lastAccess: Date.now()
      });
      this.currentSize += size;

      return true;
    } catch (error) {
      logger.error('Error setting cache entry:', error);
      return false;
    }
  }

  get(key) {
    try {
      const value = this.entries.get(key);
      if (value !== undefined) {
        const meta = this.metadata.get(key);
        meta.accessCount++;
        meta.lastAccess = Date.now();
        this.metadata.set(key, meta);
      }
      return value;
    } catch (error) {
      logger.error('Error getting cache entry:', error);
      return undefined;
    }
  }

  has(key) {
    return this.entries.has(key);
  }

  delete(key) {
    try {
      const meta = this.metadata.get(key);
      if (meta) {
        this.currentSize -= meta.size;
        this.metadata.delete(key);
        this.entries.delete(key);
        return true;
      }
      return false;
    } catch (error) {
      logger.error('Error deleting cache entry:', error);
      return false;
    }
  }

  clear() {
    this.entries.clear();
    this.metadata.clear();
    this.currentSize = 0;
  }

  calculateSize(value) {
    try {
      if (typeof value === 'string') return value.length * 2;
      if (value instanceof Blob) return value.size;
      if (ArrayBuffer.isView(value)) return value.byteLength;
      return JSON.stringify(value).length * 2;
    } catch (error) {
      logger.error('Error calculating entry size:', error);
      return 0;
    }
  }

  // Abstract method to be implemented by specific strategies
  evict() {
    throw new Error('Evict method must be implemented');
  }
}

// LRU (Least Recently Used) Strategy
export class LRUStrategy extends BaseCacheStrategy {
  evict() {
    try {
      let oldest = Infinity;
      let oldestKey = null;

      for (const [key, meta] of this.metadata.entries()) {
        if (meta.lastAccess < oldest) {
          oldest = meta.lastAccess;
          oldestKey = key;
        }
      }

      if (oldestKey) {
        this.delete(oldestKey);
        return true;
      }
      return false;
    } catch (error) {
      logger.error('Error in LRU eviction:', error);
      return false;
    }
  }
}

// LFU (Least Frequently Used) Strategy
export class LFUStrategy extends BaseCacheStrategy {
  evict() {
    try {
      let minCount = Infinity;
      let leastUsedKey = null;

      for (const [key, meta] of this.metadata.entries()) {
        if (meta.accessCount < minCount) {
          minCount = meta.accessCount;
          leastUsedKey = key;
        }
      }

      if (leastUsedKey) {
        this.delete(leastUsedKey);
        return true;
      }
      return false;
    } catch (error) {
      logger.error('Error in LFU eviction:', error);
      return false;
    }
  }
}

// FIFO (First In First Out) Strategy
export class FIFOStrategy extends BaseCacheStrategy {
  evict() {
    try {
      let oldest = Infinity;
      let firstKey = null;

      for (const [key, meta] of this.metadata.entries()) {
        if (meta.timestamp < oldest) {
          oldest = meta.timestamp;
          firstKey = key;
        }
      }

      if (firstKey) {
        this.delete(firstKey);
        return true;
      }
      return false;
    } catch (error) {
      logger.error('Error in FIFO eviction:', error);
      return false;
    }
  }
}

// Priority-based Strategy
export class PriorityStrategy extends BaseCacheStrategy {
  evict() {
    try {
      let lowestPriority = Infinity;
      let lowestKey = null;

      for (const [key, meta] of this.metadata.entries()) {
        if (meta.priority < lowestPriority) {
          lowestPriority = meta.priority;
          lowestKey = key;
        }
      }

      if (lowestKey) {
        this.delete(lowestKey);
        return true;
      }
      return false;
    } catch (error) {
      logger.error('Error in priority eviction:', error);
      return false;
    }
  }
}

// Time-based Strategy (TTL)
export class TTLStrategy extends BaseCacheStrategy {
  constructor(maxSize, maxEntries, defaultTTL = 3600000) {
    super(maxSize, maxEntries);
    this.defaultTTL = defaultTTL;
  }

  set(key, value, options = {}) {
    const ttl = options.ttl || this.defaultTTL;
    const result = super.set(key, value, options);
    if (result) {
      const meta = this.metadata.get(key);
      meta.expires = Date.now() + ttl;
      this.metadata.set(key, meta);
    }
    return result;
  }

  get(key) {
    try {
      const meta = this.metadata.get(key);
      if (meta && meta.expires < Date.now()) {
        this.delete(key);
        return undefined;
      }
      return super.get(key);
    } catch (error) {
      logger.error('Error getting TTL cache entry:', error);
      return undefined;
    }
  }

  evict() {
    try {
      const now = Date.now();
      for (const [key, meta] of this.metadata.entries()) {
        if (meta.expires <= now) {
          this.delete(key);
          return true;
        }
      }
      return false;
    } catch (error) {
      logger.error('Error in TTL eviction:', error);
      return false;
    }
  }
}

// Strategy factory
export const createCacheStrategy = (type, options = {}) => {
  const { maxSize = 1024 * 1024 * 100, maxEntries = 1000, ttl } = options;

  try {
    switch (type.toLowerCase()) {
      case 'lru':
        return new LRUStrategy(maxSize, maxEntries);
      case 'lfu':
        return new LFUStrategy(maxSize, maxEntries);
      case 'fifo':
        return new FIFOStrategy(maxSize, maxEntries);
      case 'priority':
        return new PriorityStrategy(maxSize, maxEntries);
      case 'ttl':
        return new TTLStrategy(maxSize, maxEntries, ttl);
      default:
        logger.warn(`Unknown cache strategy type: ${type}, falling back to LRU`);
        return new LRUStrategy(maxSize, maxEntries);
    }
  } catch (error) {
    logger.error('Error creating cache strategy:', error);
    return new LRUStrategy(maxSize, maxEntries);
  }
};