import { TRANSITION_DURATION } from './snipenomics-data';

export const animationStyles = {
  'fade-in': {
    enter: 'transition-opacity duration-500 ease-in-out',
    enterFrom: 'opacity-0',
    enterTo: 'opacity-100',
    leave: 'transition-opacity duration-500 ease-in-out',
    leaveFrom: 'opacity-100',
    leaveTo: 'opacity-0',
  },
  'slide-right': {
    enter: 'transition-transform duration-500 ease-in-out',
    enterFrom: 'translate-x-full',
    enterTo: 'translate-x-0',
    leave: 'transition-transform duration-500 ease-in-out',
    leaveFrom: 'translate-x-0',
    leaveTo: '-translate-x-full',
  },
  'slide-left': {
    enter: 'transition-transform duration-500 ease-in-out',
    enterFrom: '-translate-x-full',
    enterTo: 'translate-x-0',
    leave: 'transition-transform duration-500 ease-in-out',
    leaveFrom: 'translate-x-0',
    leaveTo: 'translate-x-full',
  },
  'slide-up': {
    enter: 'transition-transform duration-500 ease-in-out',
    enterFrom: 'translate-y-full',
    enterTo: 'translate-y-0',
    leave: 'transition-transform duration-500 ease-in-out',
    leaveFrom: 'translate-y-0',
    leaveTo: '-translate-y-full',
  },
  'zoom-in': {
    enter: 'transition-transform duration-500 ease-in-out',
    enterFrom: 'scale-75 opacity-0',
    enterTo: 'scale-100 opacity-100',
    leave: 'transition-transform duration-500 ease-in-out',
    leaveFrom: 'scale-100 opacity-100',
    leaveTo: 'scale-110 opacity-0',
  },
  'number-count': {
    enter: 'transition-all duration-1000 ease-out',
    enterFrom: 'opacity-0 scale-95',
    enterTo: 'opacity-100 scale-100',
    leave: 'transition-all duration-300 ease-in',
    leaveFrom: 'opacity-100 scale-100',
    leaveTo: 'opacity-0 scale-95',
  },
};

export const getSlideTransition = (animation = 'fade-in') => {
  return animationStyles[animation] || animationStyles['fade-in'];
};

export const calculateSlideTimeout = (currentAnimation) => {
  const baseTimeout = TRANSITION_DURATION;
  const animationModifiers = {
    'number-count': 1000,
    'zoom-in': 700,
    default: 500,
  };
  
  return baseTimeout + (animationModifiers[currentAnimation] || animationModifiers.default);
};

export const getBackgroundStyles = (background) => {
  return {
    backgroundImage: background.includes('gradient') ? background : undefined,
    backgroundColor: !background.includes('gradient') ? background : undefined,
  };
};