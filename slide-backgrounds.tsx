import { logger } from '../utils/logger';

// Background image paths
export const backgroundImages = [
  '/images/background-1.jpg', // Analytics with golden arrows
  '/images/background-2.jpg', // Swirling circuit patterns
  '/images/background-3.jpg', // Ethereum analytics dashboard
  '/images/background-4.jpg', // Hexagonal tech pattern
  '/images/background-5.jpg', // Mountain analytics landscape
];

// Map slides to specific backgrounds
export const slideBackgroundMap = {
  'intro': 0,          // What is $SNIPE?
  'token': 1,          // $SNIPE Token description
  'utility': 2,        // Utility explanation
  'tokenomics': 3,     // SNIPENOMICS details
  'supply': 4,         // Total Supply
  'lock': 0,           // Supply Lock
  'launch': 1,         // Fair Launch
  'ethereum': 2,       // Ethereum LP
  'tax': 3,           // Launch Tax
  'social': 4,         // Social Media
  'listings': 0,       // Token Listings
  'partners': 1,       // Partners
  'contact': 2,        // Contact Information
  'thanks': 3,         // Thank You
};

// Background transition configurations
export const backgroundTransitions = {
  duration: 0.75,
  ease: [0.43, 0.13, 0.23, 0.96],
  variants: {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  }
};

// Get background for specific slide
export const getSlideBackground = (slideId) => {
  try {
    const backgroundIndex = slideBackgroundMap[slideId];
    return backgroundImages[backgroundIndex !== undefined ? backgroundIndex : 0];
  } catch (error) {
    logger.error('Error getting slide background:', error);
    return backgroundImages[0];
  }
};

// Custom hook for background preloading
export const useBackgroundPreloader = () => {
  const preloadBackgrounds = () => {
    try {
      backgroundImages.forEach(src => {
        const img = new Image();
        img.src = src;
      });
    } catch (error) {
      logger.error('Error preloading backgrounds:', error);
    }
  };

  return preloadBackgrounds;
};

// Background overlay configurations
export const overlayConfigs = {
  default: {
    background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7))',
    opacity: 0.5
  },
  light: {
    background: 'linear-gradient(to bottom, rgba(255,255,255,0.1), rgba(0,0,0,0.5))',
    opacity: 0.3
  },
  dark: {
    background: 'linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.9))',
    opacity: 0.7
  }
};

// Background animation effects
export const backgroundEffects = {
  particles: {
    count: 50,
    size: { min: 2, max: 6 },
    speed: { min: 0.5, max: 2 },
    opacity: { min: 0.3, max: 0.7 }
  },
  glow: {
    intensity: 0.4,
    radius: 100,
    color: '#FFD700'
  },
  grid: {
    size: 50,
    opacity: 0.1,
    color: '#4A90E2'
  }
};