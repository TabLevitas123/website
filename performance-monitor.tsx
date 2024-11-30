import React, { memo, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Cpu, Memory, Clock, AlertCircle } from 'lucide-react';
import { logger } from '../utils/logger';

const MetricCard = memo(({ 
  icon: Icon, 
  label, 
  value, 
  unit,
  threshold,
  trend,
  className = ''
}) => {
  const isAlert = threshold && value > threshold;

  return (
    <div className={`bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Icon className={`w-4 h-4 ${isAlert ? 'text-red-400' : 'text-gray-400'}`} />
          <span className="text-sm text-gray-400">{label}</span>
        </div>
        {trend && (
          <span className={`text-sm ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="flex items-baseline space-x-1">
        <span className={`text-2xl font-bold ${isAlert ? 'text-red-400' : 'text-white'}`}>
          {value}
        </span>
        <span className="text-sm text-gray-400">{unit}</span>
      </div>
      {isAlert && (
        <div className="mt-2 flex items-center space-x-1 text-xs text-red-400">
          <AlertCircle className="w-3 h-3" />
          <span>Exceeds threshold ({threshold}{unit})</span>
        </div>
      )}
    </div>
  );
});

MetricCard.displayName = 'MetricCard';

const PerformanceChart = memo(({ data, height = 100 }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  const points = data.map((d, i) => ({
    x: (i / (data.length - 1)) * 100,
    y: (d.value / maxValue) * 100
  }));

  const pathData = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${100 - p.y}`)
    .join(' ');

  return (
    <svg
      viewBox="0 0 100 100"
      className="w-full"
      style={{ height }}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={`${pathData} L 100 100 L 0 100 Z`}
        fill="url(#lineGradient)"
      />
      <path
        d={pathData}
        fill="none"
        stroke="#3B82F6"
        strokeWidth="2"
      />
    </svg>
  );
});

PerformanceChart.displayName = 'PerformanceChart';

const PerformanceMonitor = ({
  enabled = true,
  showChart = true,
  position = 'bottom-right',
  className = ''
}) => {
  const [metrics, setMetrics] = useState({
    fps: 60,
    memory: 0,
    loadTime: 0,
    errorCount: 0
  });

  const [history, setHistory] = useState([]);
  const [isMinimized, setIsMinimized] = useState(false);

  // Update metrics periodically
  useEffect(() => {
    if (!enabled) return;

    const updateMetrics = () => {
      try {
        // Calculate FPS
        const fps = Math.round(performance.now() / 1000);

        // Get memory usage
        const memory = performance.memory 
          ? Math.round(performance.memory.usedJSHeapSize / 1024 / 1024)
          : 0;

        // Calculate page load time
        const loadTime = performance.timing
          ? performance.timing.loadEventEnd - performance.timing.navigationStart
          : 0;

        const newMetrics = {
          fps,
          memory,
          loadTime,
          errorCount: window.onerror ? window._errorCount || 0 : 0
        };

        setMetrics(newMetrics);
        setHistory(prev => [...prev.slice(-30), newMetrics]);

        logger.debug('Performance metrics updated:', newMetrics);
      } catch (error) {
        logger.error('Error updating performance metrics:', error);
      }
    };

    const interval = setInterval(updateMetrics, 1000);
    return () => clearInterval(interval);
  }, [enabled]);

  // Position styles
  const positionStyles = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4'
  };

  if (!enabled) return null;

  return (
    <motion.div
      className={`fixed ${positionStyles[position]} z-50 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-blue-400" />
            <span className="text-sm font-medium text-white">
              Performance Monitor
            </span>
          </div>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 text-gray-400 hover:text-white transition-colors"
          >
            {isMinimized ? '+' : '-'}
          </button>
        </div>

        {/* Content */}
        <AnimatePresence>
          {!isMinimized && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-4 p-4">
                <MetricCard
                  icon={Clock}
                  label="FPS"
                  value={metrics.fps}
                  unit=""
                  threshold={30}
                  trend={history.length > 1 ? 
                    ((metrics.fps - history[history.length - 2].fps) / 
                     history[history.length - 2].fps) * 100 : null}
                />
                <MetricCard
                  icon={Memory}
                  label="Memory"
                  value={metrics.memory}
                  unit="MB"
                  threshold={500}
                />
                <MetricCard
                  icon={Cpu}
                  label="Load Time"
                  value={metrics.loadTime}
                  unit="ms"
                  threshold={3000}
                />
                <MetricCard
                  icon={AlertCircle}
                  label="Errors"
                  value={metrics.errorCount}
                  unit=""
                  threshold={0}
                />
              </div>

              {/* Performance Chart */}
              {showChart && history.length > 1 && (
                <div className="p-4 border-t border-gray-800">
                  <PerformanceChart
                    data={history.map(m => ({ value: m.fps }))}
                    height={60}
                  />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default memo(PerformanceMonitor);