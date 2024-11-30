import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { colors, gradients, animations, effects } from './brand-utils';

const LogoVariants = {
  circle: {
    initial: { scale: 0.8, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.3
      }
    }
  },
  text: {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        delay: 0.2,
        duration: 0.5
      }
    }
  },
  tagline: {
    initial: { opacity: 0, y: 10 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        delay: 0.4,
        duration: 0.5
      }
    }
  },
  ethIcon: {
    initial: { opacity: 0, rotate: -30 },
    animate: { 
      opacity: 1, 
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20
      }
    },
    hover: {
      rotate: [0, -10, 10, -5, 5, 0],
      transition: {
        duration: 1,
        repeat: Infinity,
        repeatType: "reverse"
      }
    }
  }
};

const GlowEffect = memo(({ color = colors.primary.blue, intensity = 0.5 }) => (
  <div
    className="absolute inset-0 pointer-events-none"
    style={{
      background: `radial-gradient(circle at center, 
                    ${color}${Math.round(intensity * 100)} 0%, 
                    ${color}00 70%)`
    }}
  />
));

GlowEffect.displayName = 'GlowEffect';

const CircleLogo = memo(({ size = 'medium', className = '', animated = true }) => {
  const dimensions = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16',
    hero: 'w-32 h-32'
  };

  const Component = animated ? motion.div : 'div';
  const animationProps = animated ? LogoVariants.circle : {};

  return (
    <Component
      className={`relative rounded-full ${dimensions[size]} ${className}`}
      variants={animationProps}
      initial="initial"
      animate="animate"
      whileHover="hover"
    >
      {/* Circle Background */}
      <div className="absolute inset-0 rounded-full bg-gray-900" />
      
      {/* Gradient Border */}
      <div 
        className="absolute inset-0 rounded-full"
        style={{
          padding: '1px',
          background: gradients.primary,
          ...effects.glassmorphism
        }}
      >
        <div className="absolute inset-0 rounded-full bg-gray-900" />
      </div>

      {/* Logo Icon */}
      <div className="absolute inset-0 flex items-center justify-center">
        <img 
          src="/images/snipeai-icon.png" 
          alt="SnipeAI"
          className="w-2/3 h-2/3 object-contain"
        />
      </div>

      {/* Glow Effect */}
      <GlowEffect />
    </Component>
  );
});

CircleLogo.displayName = 'CircleLogo';

const TextLogo = memo(({ size = 'medium', className = '', animated = true }) => {
  const textSizes = {
    small: 'text-lg',
    medium: 'text-xl',
    large: 'text-2xl',
    hero: 'text-4xl'
  };

  const Component = animated ? motion.div : 'div';
  const animationProps = animated ? LogoVariants.text : {};

  return (
    <Component
      className={`font-bold ${textSizes[size]} ${className}`}
      variants={animationProps}
      initial="initial"
      animate="animate"
    >
      <span className="bg-gradient-to-r from-blue-400 to-purple-400 
                     bg-clip-text text-transparent">
        SnipeAI
      </span>
    </Component>
  );
});

TextLogo.displayName = 'TextLogo';

const Logo = ({ 
  variant = 'full',  // 'full', 'circle', 'text'
  size = 'medium',   // 'small', 'medium', 'large', 'hero'
  showTagline = true,
  animated = true,
  className = ''
}) => {
  const Container = animated ? motion.div : 'div';

  return (
    <Container className={`inline-flex items-center space-x-3 ${className}`}>
      <CircleLogo size={size} animated={animated} />
      
      {(variant === 'full' || variant === 'text') && (
        <div className="flex flex-col">
          <TextLogo size={size} animated={animated} />
          
          {showTagline && (
            <motion.div
              className="text-sm text-gray-400"
              variants={LogoVariants.tagline}
              initial="initial"
              animate="animate"
            >
              Precision That Pays
            </motion.div>
          )}
        </div>
      )}
    </Container>
  );
};

export default memo(Logo);