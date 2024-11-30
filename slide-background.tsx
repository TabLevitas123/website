import React, { memo, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  backgroundTransitions, 
  overlayConfigs, 
  backgroundEffects 
} from './slide-backgrounds';
import { logger } from '../utils/logger';

const ParticleEffect = memo(({ count, size, speed, opacity }) => {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    size: size.min + Math.random() * (size.max - size.min),
    speed: speed.min + Math.random() * (speed.max - speed.min),
    opacity: opacity.min + Math.random() * (opacity.max - opacity.min),
    x: Math.random() * 100,
    y: Math.random() * 100
  }));

  return (
    <div className="absolute inset-0 pointer-events-none">
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-white"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            opacity: particle.opacity
          }}
          animate={{
            y: [0, -50, 0],
            opacity: [particle.opacity, particle.opacity * 0.5, particle.opacity]
          }}
          transition={{
            duration: particle.speed * 5,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
});

ParticleEffect.displayName = 'ParticleEffect';

const GlowEffect = memo(({ intensity, radius, color }) => (
  <div 
    className="absolute inset-0 pointer-events-none"
    style={{
      background: `radial-gradient(circle at center, ${color}00 0%, 
                  ${color}${Math.round(intensity * 255).toString(16)} ${radius}px, 
                  ${color}00 100%)`
    }}
  />
));

GlowEffect.displayName = 'GlowEffect';

const GridEffect = memo(({ size, opacity, color }) => (
  <div 
    className="absolute inset-0 pointer-events-none"
    style={{
      backgroundImage: `linear-gradient(to right, ${color} 1px, transparent 1px),
                       linear-gradient(to bottom, ${color} 1px, transparent 1px)`,
      backgroundSize: `${size}px ${size}px`,
      opacity
    }}
  />
));

GridEffect.displayName = 'GridEffect';

const SlideBackground = ({
  src,
  slideId,
  direction = 1,
  overlayConfig = 'default',
  className = ''
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    
    img.onload = () => {
      setIsLoaded(true);
      setError(null);
    };

    img.onerror = (error) => {
      logger.error('Error loading background image:', error);
      setError('Failed to load background image');
      setIsLoaded(false);
    };
  }, [src]);

  if (error) {
    return (
      <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <AnimatePresence initial={false} custom={direction}>
      <motion.div
        key={src}
        custom={direction}
        variants={backgroundTransitions.variants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{
          x: backgroundTransitions.duration,
          opacity: { duration: backgroundTransitions.duration * 0.75 },
          ease: backgroundTransitions.ease
        }}
        className={`absolute inset-0 ${className}`}
      >
        {/* Background Image */}
        <motion.div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url(${src})`,
            opacity: isLoaded ? 1 : 0
          }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        />

        {/* Overlay */}
        <div 
          className="absolute inset-0"
          style={overlayConfigs[overlayConfig]}
        />

        {/* Effects */}
        <ParticleEffect {...backgroundEffects.particles} />
        <GlowEffect {...backgroundEffects.glow} />
        <GridEffect {...backgroundEffects.grid} />

        {/* Loading State */}
        <AnimatePresence>
          {!isLoaded && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gray-900 flex items-center justify-center"
            >
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};

export default memo(SlideBackground);