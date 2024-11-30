import React, { createContext, useContext, useReducer, useCallback } from 'react';

// Define action types
const PLATFORM_ACTIONS = {
  SET_ACTIVE_SECTION: 'SET_ACTIVE_SECTION',
  SET_LOADING_STATE: 'SET_LOADING_STATE',
  SET_ERROR: 'SET_ERROR',
  UPDATE_VISIBILITY: 'UPDATE_VISIBILITY',
  SET_ANIMATION_STATE: 'SET_ANIMATION_STATE',
};

// Initial state
const initialState = {
  activeSection: 'header',
  isLoading: true,
  error: null,
  visibleSections: {},
  animationStates: {},
  performanceMetrics: {
    lastRender: Date.now(),
    frameRate: 60,
    memoryUsage: null,
  },
};

// Reducer
const platformReducer = (state, action) => {
  switch (action.type) {
    case PLATFORM_ACTIONS.SET_ACTIVE_SECTION:
      return {
        ...state,
        activeSection: action.payload,
        performanceMetrics: {
          ...state.performanceMetrics,
          lastRender: Date.now(),
        },
      };

    case PLATFORM_ACTIONS.SET_LOADING_STATE:
      return {
        ...state,
        isLoading: action.payload,
      };

    case PLATFORM_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
      };

    case PLATFORM_ACTIONS.UPDATE_VISIBILITY:
      return {
        ...state,
        visibleSections: {
          ...state.visibleSections,
          [action.payload.section]: action.payload.isVisible,
        },
      };

    case PLATFORM_ACTIONS.SET_ANIMATION_STATE:
      return {
        ...state,
        animationStates: {
          ...state.animationStates,
          [action.payload.section]: action.payload.state,
        },
      };

    default:
      return state;
  }
};

// Create context
const PlatformContext = createContext(null);

// Provider component
export const PlatformProvider = ({ children }) => {
  const [state, dispatch] = useReducer(platformReducer, initialState);

  // Memoized action creators
  const setActiveSection = useCallback((section) => {
    dispatch({ type: PLATFORM_ACTIONS.SET_ACTIVE_SECTION, payload: section });
  }, []);

  const setLoadingState = useCallback((isLoading) => {
    dispatch({ type: PLATFORM_ACTIONS.SET_LOADING_STATE, payload: isLoading });
  }, []);

  const setError = useCallback((error) => {
    dispatch({ type: PLATFORM_ACTIONS.SET_ERROR, payload: error });
  }, []);

  const updateVisibility = useCallback((section, isVisible) => {
    dispatch({
      type: PLATFORM_ACTIONS.UPDATE_VISIBILITY,
      payload: { section, isVisible },
    });
  }, []);

  const setAnimationState = useCallback((section, state) => {
    dispatch({
      type: PLATFORM_ACTIONS.SET_ANIMATION_STATE,
      payload: { section, state },
    });
  }, []);

  // Performance monitoring
  const updatePerformanceMetrics = useCallback(() => {
    if (window.performance && window.performance.memory) {
      dispatch({
        type: 'UPDATE_PERFORMANCE_METRICS',
        payload: {
          memoryUsage: window.performance.memory.usedJSHeapSize,
          frameRate: calculateFrameRate(),
        },
      });
    }
  }, []);

  // Value object
  const value = {
    state,
    setActiveSection,
    setLoadingState,
    setError,
    updateVisibility,
    setAnimationState,
    updatePerformanceMetrics,
  };

  return (
    <PlatformContext.Provider value={value}>
      {children}
    </PlatformContext.Provider>
  );
};

// Custom hook for using the context
export const usePlatform = () => {
  const context = useContext(PlatformContext);
  if (!context) {
    throw new Error('usePlatform must be used within a PlatformProvider');
  }
  return context;
};

// Utility function for frame rate calculation
const calculateFrameRate = (() => {
  let lastTimestamp = performance.now();
  let frameCount = 0;
  let frameRate = 60;

  return () => {
    const now = performance.now();
    frameCount++;

    if (now - lastTimestamp >= 1000) {
      frameRate = frameCount;
      frameCount = 0;
      lastTimestamp = now;
    }

    return frameRate;
  };
})();