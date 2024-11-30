import React, { memo, useEffect, useRef, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { colors } from './brand-utils';
import { logger } from '../utils/logger';

// Particle System Configuration
const particleConfig = {
  count: 50,
  size: {
    min: 2,
    max: 8
  },
  speed: {
    min: 1,
    max: 3
  },
  colors: [
    colors.primary.blue,
    colors.secondary.turquoise,
    colors.accent.yellow,
    colors.accent.purple
  ],
  opacity: {
    min: 0.3,
    max: 0.7
  },
  glow: {
    enabled: true,
    intensity: 0.5,
    color: colors.primary.blue
  }
};

// Geometric Pattern Configuration
const geometricConfig = {
  grid: {
    size: 40,
    lineWidth: 1,
    color: colors.primary.blue,
    opacity: 0.1
  },
  hexagons: {
    size: 60,
    spacing: 10,
    color: colors.primary.blue,
    opacity: 0.1
  }
};

const ParticleSystem = memo(({ config = particleConfig }) => {
  const [particles, setParticles] = useState([]);
  const requestRef = useRef();
  const canvasRef = useRef();

  useEffect(() => {
    try {
      // Initialize particles
      const initialParticles = Array.from({ length: config.count }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: config.size.min + Math.random() * (config.size.max - config.size.min),
        speed: config.speed.min + Math.random() * (config.speed.max - config.speed.min),
        color: config.colors[Math.floor(Math.random() * config.colors.length)],
        opacity: config.opacity.min + Math.random() * (config.opacity.max - config.opacity.min),
        direction: Math.random() * Math.PI * 2
      }));

      setParticles(initialParticles);

      // Animation loop
      const animate = () => {
        setParticles(prevParticles =>
          prevParticles.map(particle => {
            let x = particle.x + Math.cos(particle.direction) * particle.speed;
            let y = particle.y + Math.sin(particle.direction) * particle.speed;

            // Boundary checking
            if (x < 0) x = window.innerWidth;
            if (x > window.innerWidth) x = 0;
            if (y < 0) y = window.innerHeight;
            if (y > window.innerHeight) y = 0;

            return { ...particle, x, y };
          })
        );

        requestRef.current = requestAnimationFrame(animate);
      };

      requestRef.current = requestAnimationFrame(animate);

      return () => {
        if (requestRef.current) {
          cancelAnimationFrame(requestRef.current);
        }
      };
    } catch (error) {
      logger.error('Error in ParticleSystem:', error);
    }
  }, [config]);

  // Render particles
  const renderParticles = () => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    particles.forEach(particle => {
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = particle.color;
      ctx.globalAlpha = particle.opacity;
      ctx.fill();

      if (config.glow.enabled) {
        ctx.shadowBlur = particle.size * 2;
        ctx.shadowColor = config.glow.color;
      }
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeObserver = new ResizeObserver(entries => {
      entries.forEach(entry => {
        canvas.width = entry.contentRect.width;
        canvas.height = entry.contentRect.height;
      });
    });

    resizeObserver.observe(canvas);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(renderParticles);
    return () => cancelAnimationFrame(requestRef.current);
  }, [particles]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ width: '100%', height: '100%' }}
    />
  );
});

ParticleSystem.displayName = 'ParticleSystem';

const GeometricPatterns = memo(({ config = geometricConfig }) => {
  const canvasRef = useRef();

  useEffect(() => {
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const drawGrid = () => {
        ctx.beginPath();
        ctx.strokeStyle = config.grid.color;
        ctx.globalAlpha = config.grid.opacity;
        ctx.lineWidth = config.grid.lineWidth;

        // Vertical lines
        for (let x = 0; x < canvas.width; x += config.grid.size) {
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
        }

        // Horizontal lines
        for (let y = 0; y < canvas.height; y += config.grid.size) {
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
        }

        ctx.stroke();
      };

      const drawHexagons = () => {
        const size = config.hexagons.size;
        const a = size / 2;
        const b = size * Math.sin(Math.PI / 3);

        ctx.beginPath();
        ctx.strokeStyle = config.hexagons.color;
        ctx.globalAlpha = config.hexagons.opacity;

        for (let y = 0; y < canvas.height + b; y += b + config.hexagons.spacing) {
          for (let x = 0; x < canvas.width + a; x += (a * 3) + config.hexagons.spacing) {
            ctx.moveTo(x, y);

            for (let i = 0; i < 6; i++) {
              ctx.lineTo(
                x + size * Math.cos(Math.PI / 3 * i),
                y + size * Math.sin(Math.PI / 3 * i)
              );
            }

            ctx.closePath();
          }
        }

        ctx.stroke();
      };

      const render = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawGrid();
        drawHexagons();
      };

      render();

      const resizeObserver = new ResizeObserver(entries => {
        entries.forEach(entry => {
          canvas.width = entry.contentRect.width;
          canvas.height = entry.contentRect.height;
          render();
        });
      });

      resizeObserver.observe(canvas);
      return () => resizeObserver.disconnect();
    } catch (error) {
      logger.error('Error in GeometricPatterns:', error);
    }
  }, [config]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ width: '100%', height: '100%' }}
    />
  );
});

GeometricPatterns.displayName = 'GeometricPatterns';

const BackgroundEffectsEngine = ({
  particleConfig: customParticleConfig,
  geometricConfig: customGeometricConfig,
  className = ''
}) => {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <ParticleSystem config={{ ...particleConfig, ...customParticleConfig }} />
      <GeometricPatterns config={{ ...geometricConfig, ...customGeometricConfig }} />
    </div>
  );
};

export default memo(BackgroundEffectsEngine);