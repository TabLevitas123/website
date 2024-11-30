import React, { useState, useEffect } from 'react';
import SnipenomicsPresentation from './SnipenomicsPresentation';
import { slides } from './snipenomics-data';
import { useSlideshow, useSlideAnimation, useKeyboardNavigation } from './snipenomics-hooks';

const SnipenomicsContainer = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize slide management hooks
  const {
    currentSlide,
    isPlaying,
    direction,
    goToNextSlide,
    goToPrevSlide,
    goToSlide,
    togglePlayPause
  } = useSlideshow(slides.length);

  // Initialize animation hook
  const animationClass = useSlideAnimation(direction);

  // Initialize keyboard navigation
  useKeyboardNavigation({
    goToNextSlide,
    goToPrevSlide,
    togglePlayPause
  });

  // Simulate loading state and preload assets
  useEffect(() => {
    const preloadAssets = async () => {
      try {
        // Simulate asset loading time
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to load Snipenomics presentation:', err);
        setError('Failed to load presentation assets. Please try again.');
      }
    };

    preloadAssets();
  }, []);

  // Error boundary
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
          <p className="text-white mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <SnipenomicsPresentation
      slides={slides}
      currentSlide={currentSlide}
      isPlaying={isPlaying}
      direction={direction}
      isLoading={isLoading}
      error={error}
      onNextSlide={goToNextSlide}
      onPrevSlide={goToPrevSlide}
      onSlideSelect={goToSlide}
      onPlayPauseToggle={togglePlayPause}
      animationClass={animationClass}
    />
  );
};

export default SnipenomicsContainer;