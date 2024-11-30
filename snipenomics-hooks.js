import { useState, useEffect, useCallback } from 'react';
import { SLIDE_DURATION } from './snipenomics-data';

export const useSlideshow = (totalSlides, initialAutoPlay = true) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(initialAutoPlay);
  const [direction, setDirection] = useState('forward');

  const goToNextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
    setDirection('forward');
  }, [totalSlides]);

  const goToPrevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    setDirection('backward');
  }, [totalSlides]);

  const goToSlide = useCallback((index) => {
    setDirection(index > currentSlide ? 'forward' : 'backward');
    setCurrentSlide(index);
  }, [currentSlide]);

  const togglePlayPause = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(goToNextSlide, SLIDE_DURATION);
    }
    return () => clearInterval(interval);
  }, [isPlaying, goToNextSlide]);

  return {
    currentSlide,
    isPlaying,
    direction,
    goToNextSlide,
    goToPrevSlide,
    goToSlide,
    togglePlayPause
  };
};

export const useSlideAnimation = (direction) => {
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    const animationClasses = {
      forward: 'slide-forward',
      backward: 'slide-backward'
    };
    setAnimationClass(animationClasses[direction] || '');
  }, [direction]);

  return animationClass;
};

export const useKeyboardNavigation = (handlers) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key) {
        case 'ArrowLeft':
          handlers.goToPrevSlide();
          break;
        case 'ArrowRight':
          handlers.goToNextSlide();
          break;
        case ' ':
          event.preventDefault();
          handlers.togglePlayPause();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlers]);
};