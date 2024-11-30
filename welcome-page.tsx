import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';
import { 
  welcomeAnimations, 
  generateWaveform,
  generateParticles,
  generateGridPattern,
  soundWaveConfig,
  ethLogoStates,
  glowEffects
} from './welcome-animations';
import { colors, effects } from './brand-utils';
import { logger } from '../utils/logger';

// Sound Wave Visualization
const SoundWave = ({ isAnimating }) => {
  const [waveform, setWaveform] = useState([]);

  useEffect(() => {
    const updateWaveform = () => {
      const amplitude = isAnimating ? 1 : 0.5;
      const frequency = isAnimating ? 2 : 1;
      setWaveform(generateWaveform(amplitude, frequency));
    };

    const interval = setInterval(updateWaveform, 50);
    return () => clearInterval(interval);
  }, [isAnimating]);

  return (
    <div className="flex items-center justify-center space-x-1 h-32">
      {waveform.map((bar, index) => (
        <motion.div
          key={index}
          className="bg-gradient-to-t from-blue-400 to-purple-400"
          style={{
            width: soundWaveConfig.barWidth,
            height: bar.height,
            marginRight: soundWaveConfig.barGap
          }}
          variants={welcomeAnimations.soundWave}
          animate="animate"
          transition={{
            delay: bar.delay,
            duration: 0.5 + Math.random() * 0.5
          }}
        />
      ))}
    </div>
  );
};

// ETH Logo Grid
const EthLogoGrid = () => {
  const positions = [
    { top: '10%', left: '10%' },
    { top: '10%', right: '10%' },
    { bottom: '10%', left: '10%' },
    { bottom: '10%', right: '10%' }
  ];

  return (
    <>
      {positions.map((position, index) => (
        <motion.img
          key={index}
          src="/images/eth-logo.png"
          alt="Ethereum"
          className="absolute w-16 h-16"
          style={position}
          custom={index}
          variants={welcomeAnimations.ethLogo}
          initial="initial"
          animate="animate"
          whileHover="hover"
        />
      ))}
    </>
  );
};

// Particle Background
const ParticleBackground = () => {
  const particles = generateParticles();

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full"
          style={{
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            opacity: particle.opacity
          }}
          animate={{
            y: [0, -50, 0],
            opacity: [particle.opacity, particle.opacity * 0.5, particle.opacity],
            transition: {
              duration: particle.speed * 5,
              repeat: Infinity,
              ease: "linear"
            }
          }}
        />
      ))}
    </div>
  );
};

const WelcomePage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  // Initialize animations and assets
  useEffect(() => {
    const initializeWelcome = async () => {
      try {
        // Simulate asset loading
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoaded(true);
      } catch (error) {
        logger.error('Error initializing welcome page:', error);
        setError('Failed to load welcome page assets');
      }
    };

    initializeWelcome();
  }, []);

  // Handle scroll animations
  const handleScroll = useCallback(() => {
    // Add scroll-based animation logic here
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <motion.div
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      variants={welcomeAnimations.container}
      initial="initial"
      animate={isLoaded ? "animate" : "initial"}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gray-900">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: generateGridPattern(),
            opacity: 0.1
          }}
        />
        <ParticleBackground />
      </div>

      {/* ETH Logos */}
      <EthLogoGrid />

      {/* Main Content */}
      <div className="relative z-10 text-center">
        <motion.div
          variants={welcomeAnimations.logo}
          className="mb-8"
        >
          <Logo 
            variant="full"
            size="hero"
            animated={true}
            className="filter drop-shadow-2xl"
          />
        </motion.div>

        {/* Sound Wave Visualization */}
        <SoundWave isAnimating={isLoaded} />

        {/* Call to Action */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <button
            className="px-8 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500
                     text-white font-semibold hover:from-blue-600 hover:to-purple-600
                     transform hover:scale-105 transition-all duration-300"
            style={effects.glassmorphism}
          >
            Explore Platform
          </button>
        </motion.div>
      </div>

      {/* Loading Overlay */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            className="absolute inset-0 bg-gray-900 flex items-center justify-center"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent 
                          rounded-full animate-spin"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default WelcomePage;