import React from 'react';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

const NavigationButton = ({ onClick, direction, children }) => (
  <button
    onClick={onClick}
    className="p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 transition-all duration-300 
               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
    aria-label={`Go to ${direction} slide`}
  >
    {children}
  </button>
);

const SlideIndicator = ({ index, currentSlide, onClick }) => (
  <button
    onClick={() => onClick(index)}
    className={`w-2 h-2 rounded-full transition-all duration-300 
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
                ${currentSlide === index
                  ? 'bg-blue-500 w-4'
                  : 'bg-gray-400 hover:bg-gray-300'
                }`}
    aria-label={`Go to slide ${index + 1}`}
    aria-current={currentSlide === index ? 'true' : 'false'}
  />
);

const PlayPauseButton = ({ isPlaying, onToggle }) => (
  <button
    onClick={onToggle}
    className="px-4 py-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 
               transition-all duration-300 flex items-center space-x-2
               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
    aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
  >
    {isPlaying ? (
      <>
        <Pause className="w-4 h-4" />
        <span>Pause</span>
      </>
    ) : (
      <>
        <Play className="w-4 h-4" />
        <span>Play</span>
      </>
    )}
  </button>
);

const SnipenomicsControls = ({
  currentSlide,
  totalSlides,
  onPrevious,
  onNext,
  onSlideSelect,
  isPlaying,
  onPlayPauseToggle
}) => {
  // Error handling for props
  if (typeof currentSlide !== 'number' || currentSlide < 0 || currentSlide >= totalSlides) {
    console.error('Invalid currentSlide value:', currentSlide);
    return null;
  }

  return (
    <div className="absolute bottom-0 left-0 right-0">
      {/* Progress Bar */}
      <div className="h-1 bg-gray-800">
        <div
          className="h-full bg-blue-500 transition-all duration-500"
          style={{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }}
          role="progressbar"
          aria-valuenow={(currentSlide + 1)}
          aria-valuemin="1"
          aria-valuemax={totalSlides}
        />
      </div>

      {/* Controls Container */}
      <div className="flex justify-between items-center p-4 bg-gradient-to-t from-black/50 to-transparent">
        {/* Previous Button */}
        <NavigationButton onClick={onPrevious} direction="previous">
          <ChevronLeft className="w-6 h-6" />
        </NavigationButton>

        {/* Slide Indicators */}
        <div className="flex space-x-2 overflow-x-auto max-w-md px-4">
          {Array.from({ length: totalSlides }, (_, i) => (
            <SlideIndicator
              key={i}
              index={i}
              currentSlide={currentSlide}
              onClick={onSlideSelect}
            />
          ))}
        </div>

        {/* Next Button */}
        <NavigationButton onClick={onNext} direction="next">
          <ChevronRight className="w-6 h-6" />
        </NavigationButton>
      </div>

      {/* Play/Pause Button */}
      <div className="absolute top-4 right-4">
        <PlayPauseButton
          isPlaying={isPlaying}
          onToggle={onPlayPauseToggle}
        />
      </div>
    </div>
  );
};

export default SnipenomicsControls;