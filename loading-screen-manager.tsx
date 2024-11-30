import React, { memo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from './Logo';
import { colors, effects } from './brand-utils';
import { logger } from '../utils/logger';

const LoadingProgress = memo(({ progress }) => (
  <div className="relative w-48 h-1 bg-gray-800 rounded-full overflow-hidden">
    <motion.div
      className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-purple-500"
      initial={{ width: 0 }}
      animate={{ width: `${progress}%` }}
      transition={{ duration: 0.3 }}
    />
  </div>
));

LoadingProgress.displayName = 'LoadingProgress';

const LoadingMessage = memo(({ message, type = 'info' }) => {
  const getMessageStyle = () => {
    switch (type) {
      case 'error':
        return 'text-red-400';
      case 'warning':
        return 'text-yellow-400';
      case 'success':
        return 'text-green-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <motion.div
      className={`text-sm ${getMessageStyle()}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      {message}
    </motion.div>
  );
});

LoadingMessage.displayName = 'LoadingMessage';

const LoadingScreenManager = ({
  isLoading,
  progress = 0,
  message = '',
  messageType = 'info',
  onComplete,
  minDisplayTime = 1000,
  className = ''
}) => {
  const [shouldDisplay, setShouldDisplay] = useState(isLoading);
  const [displayMessage, setDisplayMessage] = useState(message);

  useEffect(() => {
    let timeout;
    
    if (!isLoading && shouldDisplay) {
      // Ensure minimum display time
      timeout = setTimeout(() => {
        setShouldDisplay(false);
        if (onComplete) onComplete();
      }, minDisplayTime);
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [isLoading, shouldDisplay, minDisplayTime, onComplete]);

  // Handle message updates
  useEffect(() => {
    if (message !== displayMessage) {
      setDisplayMessage(message);
      logger.info('Loading message updated:', message);
    }
  }, [message, displayMessage]);

  // Track loading performance
  useEffect(() => {
    if (isLoading) {
      const startTime = performance.now();
      return () => {
        const duration = performance.now() - startTime;
        logger.debug('Loading duration:', duration);
      };
    }
  }, [isLoading]);

  return (
    <AnimatePresence>
      {shouldDisplay && (
        <motion.div
          className={`fixed inset-0 z-50 flex items-center justify-center 
                     bg-gray-900 ${className}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative flex flex-col items-center space-y-8">
            {/* Logo Animation */}
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Logo variant="circle" size="large" />
            </motion.div>

            {/* Progress Indicator */}
            <LoadingProgress progress={progress} />

            {/* Loading Message */}
            <LoadingMessage 
              message={displayMessage}
              type={messageType}
            />

            {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Glow Effect */}
              <div
                className="absolute inset-0"
                style={{
                  background: `radial-gradient(circle at center, 
                              ${colors.primary.blue}20 0%, 
                              transparent 70%)`
                }}
              />

              {/* Particle Effects */}
              <div className="absolute inset-0">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute bg-blue-400 rounded-full"
                    style={{
                      width: Math.random() * 4 + 2,
                      height: Math.random() * 4 + 2,
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      opacity: Math.random() * 0.5 + 0.3
                    }}
                    animate={{
                      y: [0, -30, 0],
                      opacity: [0.3, 0.7, 0.3]
                    }}
                    transition={{
                      duration: Math.random() * 2 + 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default memo(LoadingScreenManager);