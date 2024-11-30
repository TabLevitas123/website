import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SnipenomicsPresentation from './SnipenomicsPresentation';
import SnipenomicsControls from './SnipenomicsControls';
import LoadingManager from './LoadingManager';
import { slides, SLIDE_DURATION } from '@/data/snipenomics-data';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';
import { logger } from '@/utils/logger';

const SnipenomicsContainer: React.FC = () => {
  // State management
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Performance monitoring
  const { trackRender, trackAction } = usePerformanceMonitor('snipenomics');

  // Initialize presentation
  useEffect(() => {
    const initPresentation = async () => {
      try {
        setIsLoading(true);
        trackAction('init-start');

        // Simulate asset loading
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setIsLoading(false);
        trackAction('init-complete');
      } catch (err) {
        const error = err instanceof Error ? err.message : 'Failed to initialize presentation';
        logger.error('Snipenomics initialization error:', error);
        setError(error);
        trackAction('init-error');
      }
    };

    initPresentation();
    trackRender('snipenomics-mount');

    return () => {
      logger.info('Snipenomics component unmounted');
    };
  }, [trackAction, trackRender]);

  // Auto-advance slides when playing
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % slides.length);
        setDirection('forward');
      }, SLIDE_DURATION);
    }

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Navigation handlers
  const goToNextSlide = useCallback(() => {
    trackAction('next-slide');
    setCurrentSlide(prev => (prev + 1) % slides.length);
    setDirection('forward');
  }, [trackAction]);

  const goToPrevSlide = useCallback(() => {
    trackAction('prev-slide');
    setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);
    setDirection('backward');
  }, [trackAction]);

  const goToSlide = useCallback((index: number) => {
    trackAction('goto-slide');
    setDirection(index > currentSlide ? 'forward' : 'backward');
    setCurrentSlide(index);
  }, [currentSlide, trackAction]);

  const togglePlayPause = useCallback(() => {
    trackAction(isPlaying ? 'pause' : 'play');
    setIsPlaying(prev => !prev);
  }, [isPlaying, trackAction]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowRight':
          goToNextSlide();
          break;
        case 'ArrowLeft':
          goToPrevSlide();
          break;
        case ' ':
          event.preventDefault();
          togglePlayPause();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNextSlide, goToPrevSlide, togglePlayPause]);

  return (
    <LoadingManager isLoading={isLoading} error={error}>
      <div className="relative min-h-screen bg-gray-900 overflow-hidden">
        <SnipenomicsPresentation
          slides={slides}
          currentSlide={currentSlide}
          direction={direction}
        />
        
        <SnipenomicsControls
          currentSlide={currentSlide}
          totalSlides={slides.length}
          isPlaying={isPlaying}
          onNext={goToNextSlide}
          onPrevious={goToPrevSlide}
          onSlideSelect={goToSlide}
          onPlayPauseToggle={togglePlayPause}
        />

        {/* Progress Bar */}
        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-blue-500"
          initial={{ width: 0 }}
          animate={{ 
            width: `${((currentSlide + 1) / slides.length) * 100}%` 
          }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </LoadingManager>
  );
};

export default SnipenomicsContainer;