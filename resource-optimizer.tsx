import React, { memo, useEffect, useRef, useState, useCallback } from 'react';
import { logger } from '../utils/logger';

// Resource optimization configurations
const RESOURCE_CONFIG = {
  cache: {
    maxSize: 100 * 1024 * 1024, // 100MB max cache size
    maxAge: 3600000, // 1 hour cache lifetime
    minFree: 0.2 // Minimum free memory percentage
  },
  loading: {
    timeout: 10000, // 10s loading timeout
    retries: 3, // Number of retry attempts
    concurrent: 5 // Max concurrent loads
  },
  optimization: {
    imageQuality: 0.8,
    compressThreshold: 50 * 1024, // 50KB
    preloadDistance: 1000 // Preload within 1000px
  }
};

// Resource type definitions
const ResourceType = {
  IMAGE: 'image',
  SCRIPT: 'script',
  STYLE: 'style',
  FONT: 'font',
  DATA: 'data'
};

// Resource state management
class ResourceState {
  constructor() {
    this.resources = new Map();
    this.loadingQueue = [];
    this.activeLoads = 0;
  }

  add(resource) {
    this.resources.set(resource.id, {
      ...resource,
      status: 'pending',
      loadAttempts: 0,
      timestamp: Date.now()
    });
  }

  update(id, updates) {
    const resource = this.resources.get(id);
    if (resource) {
      this.resources.set(id, { ...resource, ...updates });
    }
  }

  remove(id) {
    this.resources.delete(id);
  }

  get(id) {
    return this.resources.get(id);
  }

  getAll() {
    return Array.from(this.resources.values());
  }
}

// Resource optimization strategies
const OptimizationStrategies = {
  // Image optimization
  optimizeImage: async (resource) => {
    try {
      if (resource.size > RESOURCE_CONFIG.optimization.compressThreshold) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = resource.url;
        });

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        return canvas.toDataURL('image/jpeg', RESOURCE_CONFIG.optimization.imageQuality);
      }
      return resource.url;
    } catch (error) {
      logger.error('Error optimizing image:', error);
      return resource.url;
    }
  },

  // Script optimization
  optimizeScript: (resource) => {
    try {
      // Add script optimization logic here
      return resource;
    } catch (error) {
      logger.error('Error optimizing script:', error);
      return resource;
    }
  },

  // Style optimization
  optimizeStyle: (resource) => {
    try {
      // Add style optimization logic here
      return resource;
    } catch (error) {
      logger.error('Error optimizing style:', error);
      return resource;
    }
  }
};

const ResourceOptimizer = memo(({
  children,
  onResourceLoad,
  onResourceError,
  className = ''
}) => {
  const [resourceStats, setResourceStats] = useState({
    total: 0,
    loaded: 0,
    failed: 0,
    optimized: 0
  });

  const resourceStateRef = useRef(new ResourceState());
  const observerRef = useRef(null);

  // Initialize intersection observer
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const resource = entry.target.dataset.resource;
            if (resource) {
              loadResource(JSON.parse(resource));
            }
          }
        });
      },
      { rootMargin: `${RESOURCE_CONFIG.optimization.preloadDistance}px` }
    );

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Load resource with retries and optimization
  const loadResource = useCallback(async (resource) => {
    try {
      const state = resourceStateRef.current.get(resource.id);
      if (!state || state.status === 'loaded') return;

      resourceStateRef.current.update(resource.id, { status: 'loading' });

      let optimizedResource = resource;
      switch (resource.type) {
        case ResourceType.IMAGE:
          optimizedResource.url = await OptimizationStrategies.optimizeImage(resource);
          break;
        case ResourceType.SCRIPT:
          optimizedResource = OptimizationStrategies.optimizeScript(resource);
          break;
        case ResourceType.STYLE:
          optimizedResource = OptimizationStrategies.optimizeStyle(resource);
          break;
      }

      const result = await loadResourceWithRetries(optimizedResource);
      
      resourceStateRef.current.update(resource.id, {
        status: 'loaded',
        optimized: true
      });

      setResourceStats(prev => ({
        ...prev,
        loaded: prev.loaded + 1,
        optimized: prev.optimized + 1
      }));

      if (onResourceLoad) {
        onResourceLoad(resource);
      }

      return result;
    } catch (error) {
      logger.error('Error loading resource:', error);
      
      resourceStateRef.current.update(resource.id, {
        status: 'failed',
        error: error.message
      });

      setResourceStats(prev => ({
        ...prev,
        failed: prev.failed + 1
      }));

      if (onResourceError) {
        onResourceError(resource, error);
      }
    }
  }, [onResourceLoad, onResourceError]);

  // Load resource with retry logic
  const loadResourceWithRetries = async (resource, attempt = 0) => {
    try {
      const response = await fetch(resource.url, {
        timeout: RESOURCE_CONFIG.loading.timeout
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.blob();
    } catch (error) {
      if (attempt < RESOURCE_CONFIG.loading.retries) {
        await new Promise(resolve => 
          setTimeout(resolve, Math.pow(2, attempt) * 1000)
        );
        return loadResourceWithRetries(resource, attempt + 1);
      }
      throw error;
    }
  };

  return (
    <div className={className}>
      {children}

      {/* Resource Loading Stats (Development Only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 text-xs text-gray-400">
          Resources: {resourceStats.loaded}/{resourceStats.total} 
          (Optimized: {resourceStats.optimized}, Failed: {resourceStats.failed})
        </div>
      )}
    </div>
  );
});

ResourceOptimizer.displayName = 'ResourceOptimizer';

export default ResourceOptimizer;