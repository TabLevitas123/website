import React from 'react';
import SnipenomicsSlide from './SnipenomicsSlide';
import SnipenomicsControls from './SnipenomicsControls';
import LoadingManager from './SnipenomicsLoading';
import { getSlideTransition, getBackgroundStyles } from './snipenomics-utils';

const SnipenomicsPresentation = ({
  slides,
  currentSlide,
  isPlaying,
  direction,
  isLoading,
  error,
  onNextSlide,
  onPrevSlide,
  onSlideSelect,
  onPlayPauseToggle
}) => {
  const currentSlideData = slides[currentSlide];
  const transition = getSlideTransition(currentSlideData?.animation);
  const backgroundStyles = getBackgroundStyles(currentSlideData?.background);

  return (
    <LoadingManager isLoading={isLoading} error={error}>
      <div className="relative h-screen overflow-hidden bg-black">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />

        {/* Slides Container */}
        <div className="relative h-full">
          {slides.map((slide, index) => (
            <SnipenomicsSlide
              key={slide.id}
              {...slide}
              isActive={currentSlide === index}
              transition={transition}
              direction={direction}
            />
          ))}
        </div>

        {/* Controls */}
        <SnipenomicsControls
          currentSlide={currentSlide}
          totalSlides={slides.length}
          isPlaying={isPlaying}
          onPrevious={onPrevSlide}
          onNext={onNextSlide}
          onSlideSelect={onSlideSelect}
          onPlayPauseToggle={onPlayPauseToggle}
        />

        {/* Dynamic Background */}
        <div 
          className="absolute inset-0 -z-10 transition-colors duration-1000"
          style={backgroundStyles}
        />

        {/* Floating Particles Effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-blue-500 rounded-full opacity-20 blur-sm"
              style={{
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float-${i} ${10 + Math.random() * 5}s linear infinite`
              }}
            />
          ))}
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-800">
          <div
            className="h-full bg-blue-500 transition-all duration-500"
            style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
          />
        </div>
      </div>
    </LoadingManager>
  );
};

export default SnipenomicsPresentation;