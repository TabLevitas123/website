import { useEffect, useRef, useCallback } from 'react';

// Performance monitoring
export const usePerformanceMonitor = (callback, interval = 1000) => {
  useEffect(() => {
    if (!window.performance) return;

    const timer = setInterval(() => {
      const metrics = {
        memory: window.performance.memory?.usedJSHeapSize,
        timing: window.performance.timing,
        navigation: window.performance.navigation,
      };
      callback(metrics);
    }, interval);

    return () => clearInterval(timer);
  }, [callback, interval]);
};

// Intersection observer with options
export const useIntersectionObserverWithOptions = (
  callback,
  options = { threshold: 0.1, rootMargin: '0px' }
) => {
  const targetRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      callback(entry.isIntersecting, entry);
    }, options);

    if (targetRef.current) {
      observer.observe(targetRef.current);
    }

    return () => {
      if (targetRef.current) {
        observer.unobserve(targetRef.current);
      }
    };
  }, [callback, options]);

  return targetRef;
};

// Animation frame scheduler
export const useAnimationFrame = (callback, active = true) => {
  const requestRef = useRef();
  const previousTimeRef = useRef();

  const animate = useCallback((time) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current;
      callback(deltaTime);
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  }, [callback]);

  useEffect(() => {
    if (active) {
      requestRef.current = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(requestRef.current);
    }
  }, [active, animate]);
};

// Debounced scroll handler
export const useScrollHandler = (callback, delay = 100) => {
  const timeoutRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callback();
      }, delay);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [callback, delay]);
};

// Error boundary hook
export const useErrorBoundary = (fallback) => {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleError = (error) => {
      console.error('Platform Error:', error);
      setError(error);
      setHasError(true);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return fallback(error);
  }

  return null;
};

// Animation utilities
export const animations = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 },
  },
  slideUp: {
    initial: { y: 50, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -50, opacity: 0 },
    transition: { duration: 0.5 },
  },
  scale: {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.8, opacity: 0 },
    transition: { duration: 0.4 },
  },
  slideInRight: {
    initial: { x: 100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -100, opacity: 0 },
    transition: { duration: 0.5 },
  },
};

// Performance optimizations
export const withMemo = (Component, propsAreEqual) => {
  return React.memo(Component, propsAreEqual);
};

// Logging utility
export const logger = {
  info: (message, data) => {
    console.log(`[Platform Info]: ${message}`, data);
  },
  error: (message, error) => {
    console.error(`[Platform Error]: ${message}`, error);
  },
  warn: (message, data) => {
    console.warn(`[Platform Warning]: ${message}`, data);
  },
  debug: (message, data) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[Platform Debug]: ${message}`, data);
    }
  },
};