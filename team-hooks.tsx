import { useState, useEffect, useCallback, useRef } from 'react';
import { logger } from '../utils/logger';

// Hook for managing intersection observer
export const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const targetRef = useRef(null);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    try {
      const observer = new IntersectionObserver(([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      }, {
        threshold: options.threshold || 0.1,
        root: options.root || null,
        rootMargin: options.rootMargin || '0px'
      });

      observer.observe(target);

      return () => {
        observer.unobserve(target);
        observer.disconnect();
      };
    } catch (error) {
      logger.error('Error creating intersection observer:', error);
    }
  }, [options.threshold, options.root, options.rootMargin]);

  return [targetRef, isIntersecting];
};

// Hook for optimized image loading
export const useImageLoader = (src, placeholder = '') => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageSrc, setImageSrc] = useState(placeholder);

  useEffect(() => {
    const img = new Image();
    
    img.onload = () => {
      setImageSrc(src);
      setLoading(false);
    };

    img.onerror = (error) => {
      logger.error('Error loading image:', error);
      setError('Failed to load image');
      setLoading(false);
    };

    img.src = src;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  return { loading, error, imageSrc };
};

// Hook for animation performance monitoring
export const useAnimationMonitor = (threshold = 16.67) => {
  const frameTimeRef = useRef();
  const [performance, setPerformance] = useState({ fps: 60, dropCount: 0 });

  useEffect(() => {
    let animationFrameId;
    let previousTime = performance.now();
    let dropCount = 0;

    const measure = () => {
      const currentTime = performance.now();
      const frameTime = currentTime - previousTime;
      
      if (frameTime > threshold) {
        dropCount++;
        logger.warn('Frame drop detected:', { frameTime, threshold });
      }

      const fps = Math.round(1000 / frameTime);
      setPerformance({ fps, dropCount });

      previousTime = currentTime;
      animationFrameId = requestAnimationFrame(measure);
    };

    animationFrameId = requestAnimationFrame(measure);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [threshold]);

  return performance;
};

// Hook for managing scroll-based animations
export const useScrollAnimation = (options = {}) => {
  const [animationState, setAnimationState] = useState('hidden');
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    try {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setAnimationState('visible');
            if (options.once) observer.disconnect();
          } else if (!options.once) {
            setAnimationState('hidden');
          }
        },
        {
          threshold: options.threshold || 0.1,
          rootMargin: options.rootMargin || '0px'
        }
      );

      observer.observe(element);

      return () => observer.disconnect();
    } catch (error) {
      logger.error('Error in scroll animation:', error);
    }
  }, [options.threshold, options.rootMargin, options.once]);

  return [elementRef, animationState];
};

// Hook for managing team member transitions
export const useTeamMemberTransition = (duration = 300) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timeoutRef = useRef();

  const transition = useCallback((callback) => {
    setIsTransitioning(true);

    timeoutRef.current = setTimeout(() => {
      try {
        callback();
        setIsTransitioning(false);
      } catch (error) {
        logger.error('Error in team member transition:', error);
        setIsTransitioning(false);
      }
    }, duration);
  }, [duration]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return [isTransitioning, transition];
};

// Hook for managing biopic hover effects
export const useBiopicHover = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [rotation, setRotation] = useState(0);

  const handleMouseMove = useCallback((event) => {
    try {
      const { clientX, clientY, target } = event;
      const { left, top, width, height } = target.getBoundingClientRect();
      
      const x = (clientX - left) / width - 0.5;
      const y = (clientY - top) / height - 0.5;
      
      const rotation = Math.atan2(y, x) * (180 / Math.PI);
      setRotation(rotation);
    } catch (error) {
      logger.error('Error in biopic hover effect:', error);
    }
  }, []);

  return {
    isHovered,
    rotation,
    handlers: {
      onMouseEnter: () => setIsHovered(true),
      onMouseLeave: () => setIsHovered(false),
      onMouseMove: handleMouseMove
    }
  };
};

// Hook for managing team section animations
export const useTeamSectionAnimations = () => {
  const [animationConfig, setAnimationConfig] = useState({
    headerVisible: false,
    membersVisible: false
  });

  const [headerRef, headerVisible] = useIntersectionObserver();
  const [membersRef, membersVisible] = useIntersectionObserver({
    threshold: 0.2
  });

  useEffect(() => {
    setAnimationConfig({
      headerVisible,
      membersVisible
    });
  }, [headerVisible, membersVisible]);

  return {
    refs: {
      headerRef,
      membersRef
    },
    animationConfig
  };
};