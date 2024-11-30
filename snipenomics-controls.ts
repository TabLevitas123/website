import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';
import { logger } from '@/utils/logger';

interface SnipenomicsControlsProps {
  currentSlide: number;
  totalSlides: number;
  isPlaying: boolean;
  onNext: () => void;
  onPrevious: () => void;
  onSlideSelect: (index: number) => void;
  onPlayPauseToggle: () => void;
}

const NavigationButton: React.FC<{
  onClick: () => void;
  direction: 'previous' | 'next';
  children: React.ReactNode;
}> = ({ onClick, direction, children }) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    className="p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 
               transition-all duration-300 focus:outline-none focus:ring-2 
               focus:ring-blue-500 focus:ring-opacity-50"
    aria-label={`Go to ${direction} slide`}
  >
    {children}
  </motion.button>
);

const SlideIndicator: React.FC<{
  index: number;
  isActive: boolean;
  onClick: () => void;
}> = ({ index, isActive, onClick }) => (
  <motion.button
    onClick={onClick}
    className={`w-2 h-2 rounded-full transition-all duration-300 
                focus:outline-none focus:ring-2 focus:ring-blue-500 
                focus:ring-opacity-50 ${
                  isActive 
                    ? 'bg-blue-500 w-4' 
                    : 'bg-gray-400 hover:bg-gray-300'
                }`}
    whileHover={{ scale: 1.2 }}
    whileTap={{ scale: 0.8 }}
    aria-label={`Go to slide ${index + 1}`}
    aria-current={isActive ? 'true' : 'false'}
  />
);

const PlayPauseButton: React.FC<{
  isPlaying: boolean;
  onToggle: () => void;
}> = ({ isPlaying, onToggle }) => (
  <motion.button
    onClick={onToggle}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    className="px-4 py-2 rounded-full bg-black bg-opacity-50 
               hover:bg-opacity-75 transition-all duration-300 
               flex items-center space-x-2"
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
  </motion.button>
);

const SnipenomicsControls: React.FC<SnipenomicsControlsProps> = ({
  currentSlide,
  totalSlides,
  isPlaying,
  onNext,
  onPrevious,
  onSlideSelect,
  onPlayPauseToggle
}) => {
  const { trackAction } = usePerformanceMonitor('snipenomics-controls');

  // Error handling wrapper for actions
  const handleAction = (action: () => void, actionName: string) => {
    try {
      trackAction(actionName);
      action();
    } catch (error) {
      logger.error(`Error in ${actionName}:`, error);
    }
  };

  return (
    <div className="absolute bottom-0 left-0 right-0">
      {/* Controls Container */}
      <div className="flex justify-between items-center p-4 bg-gradient-to-t from-black/50 to-transparent">
        {/* Previous Button */}
        <NavigationButton
          onClick={() => handleAction(onPrevious, 'previous-slide')}
          direction="previous"
        >
          <ChevronLeft className="w-6 h-6" />
        </NavigationButton>

        {/* Slide Indicators */}
        <div className="flex space-x-2 overflow-x-auto max-w-md px-4">
          {Array.from({ length: totalSlides }, (_, i) => (
            <SlideIndicator
              key={i}
              index={i}
              isActive={currentSlide === i}
              onClick={() => handleAction(() => onSlideSelect(i), 'select-slide')}
            />
          ))}
        </div>

        {/* Next Button */}
        <NavigationButton
          onClick={() => handleAction(onNext, 'next-slide')}
          direction="next"
        >
          <ChevronRight className="w-6 h-6" />
        </NavigationButton>
      </div>

      {/* Play/Pause Button */}
      <div className="absolute top-4 right-4">
        <PlayPauseButton
          isPlaying={isPlaying}
          onToggle={() => handleAction(onPlayPauseToggle, 'toggle-play')}
        />
      </div>
    </div>
  );
};

export default SnipenomicsControls;