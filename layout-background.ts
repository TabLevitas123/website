import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';
import { logger } from '@/utils/logger';

const LayoutBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { trackRender } = usePerformanceMonitor('layout-background');

  // Initialize canvas animations
  useEffect(() => {
    trackRender('background-init');
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      logger.error('Failed to get canvas context');
      return;
    }

    // Set canvas size
    const setSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setSize();

    // Handle resize
    window.addEventListener('resize', setSize);

    // Particle system
    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
    }> = [];

    // Create particles
    const createParticles = () => {
      const particleCount = Math.min(50, window.innerWidth / 20);
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 1,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5
        });
      }
    };
    createParticles();

    // Animation loop
    let animationFrameId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particles.forEach(particle => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(66, 232, 224, 0.1)'; // Electric blue from brand colors
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', setSize);
      cancelAnimationFrame(animationFrameId);
      logger.info('Background animation cleaned up');
    };
  }, [trackRender]);

  return (
    <div className="fixed inset-0 pointer-events-none">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-900/90 to-gray-900/80" />
      
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />

      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
      />

      {/* Glow effects */}
      <motion.div
        className="absolute inset-0"
        animate={{
          opacity: [0.1, 0.2, 0.1],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10" />
      </motion.div>
    </div>
  );
};

export default LayoutBackground;