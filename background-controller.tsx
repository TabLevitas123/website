import React, { memo, useEffect, useCallback, useRef } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import BackgroundEffectsEngine from './background-effects-engine';
import { colors, effects } from './brand-utils';
import { logger } from '../utils/logger';

const TransitionOverlay = memo(({ isTransitioning, direction = 1 }) => (
  <AnimatePresence>
    {isTransitioning && (
      <motion.div
        className="absolute inset-0 bg-gray-900 pointer-events-none z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      />
    )}
  </AnimatePresence>
));

TransitionOverlay.displayName = 'TransitionOverlay';

const BackgroundScene = memo(({
  config,
  isActive,
  onTransitionComplete,
  className = ''
}) => {
  const controls = useAnimation();
  const sceneRef = useRef(null);

  useEffect(() => {
    if (isActive) {
      controls.start({
        opacity: 1,
        scale: 1,
        transition: { duration: 0.5 }
      });
    } else {
      controls.start({
        opacity: 0,
        scale: 0.95,
        transition: { duration: 0.5 }
      });
    }
  }, [isActive, controls]);

  return (
    <motion.div
      ref={sceneRef}
      className={`absolute inset-0 ${className}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={controls}
      onAnimationComplete={() => {
        if (!isActive && onTransitionComplete) {
          onTransitionComplete();
        }
      }}
    >
      <BackgroundEffectsEngine {...config} />
    </motion.div>
  );
});

BackgroundScene.displayName = 'BackgroundScene';

const BackgroundController = ({
  scenes,
  activeSceneId,
  transitionDuration = 500,
  className = ''
}) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentScene, setCurrentScene] = useState(null);
  const [nextScene, setNextScene] = useState(null);
  const transitionTimeoutRef = useRef(null);

  // Performance monitoring
  const performanceRef = useRef({
    transitions: 0,
    averageTransitionTime: 0,
    lastTransitionStart: null
  });

  const handleTransition = useCallback((from, to) => {
    try {
      setIsTransitioning(true);
      performanceRef.current.lastTransitionStart = performance.now();
      performanceRef.current.transitions++;

      // Start transition
      setNextScene(to);

      // Schedule scene switch
      transitionTimeoutRef.current = setTimeout(() => {
        setCurrentScene(to);
        setNextScene(null);
        setIsTransitioning(false);

        // Update performance metrics
        const transitionTime = performance.now() - performanceRef.current.lastTransitionStart;
        performanceRef.current.averageTransitionTime = 
          (performanceRef.current.averageTransitionTime * (performanceRef.current.transitions - 1) + 
           transitionTime) / performanceRef.current.transitions;

        logger.debug('Background transition complete:', {
          from,
          to,
          duration: transitionTime,
          averageTime: performanceRef.current.averageTransitionTime
        });
      }, transitionDuration);
    } catch (error) {
      logger.error('Error during background transition:', error);
      setIsTransitioning(false);
    }
  }, [transitionDuration]);

  // Handle scene changes
  useEffect(() => {
    if (activeSceneId !== currentScene?.id) {
      handleTransition(currentScene?.id, activeSceneId);
    }
  }, [activeSceneId, currentScene, handleTransition]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Current Scene */}
      {currentScene && (
        <BackgroundScene
          key={currentScene.id}
          config={scenes[currentScene.id]}
          isActive={!isTransitioning}
        />
      )}

      {/* Next Scene */}
      {nextScene && (
        <BackgroundScene
          key={nextScene}
          config={scenes[nextScene]}
          isActive={isTransitioning}
          onTransitionComplete={() => setIsTransitioning(false)}
        />
      )}

      {/* Transition Overlay */}
      <TransitionOverlay 
        isTransitioning={isTransitioning}
        direction={currentScene && nextScene ? 
          scenes[nextScene].index > scenes[currentScene.id].index ? 1 : -1 
          : 1}
      />

      {/* Performance Monitor (Dev Only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute bottom-4 right-4 text-xs text-gray-400">
          Transitions: {performanceRef.current.transitions} | 
          Avg Time: {Math.round(performanceRef.current.averageTransitionTime)}ms
        </div>
      )}
    </div>
  );
};

export default memo(BackgroundController);