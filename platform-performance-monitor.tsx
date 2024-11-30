import React, { useState, useEffect, useCallback } from 'react';
import { Activity, Cpu, Memory, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import { usePerformanceMonitor } from './platform-utils';

const MetricCard = ({ icon: Icon, label, value, trend, alert }) => (
  <div className={`bg-gray-800 rounded-lg p-4 ${alert ? 'border-red-500 border' : ''}`}>
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center space-x-2">
        <Icon className="w-5 h-5 text-blue-400" />
        <span className="text-sm text-gray-400">{label}</span>
      </div>
      {alert && <AlertCircle className="w-5 h-5 text-red-500" />}
    </div>
    <div className="flex items-end justify-between">
      <span className="text-xl font-semibold text-white">{value}</span>
      {trend && (
        <span className={`text-sm ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
          {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </span>
      )}
    </div>
  </div>
);

const PerformanceMonitor = ({ 
  refreshRate = 1000,
  thresholds = {
    fps: 30,
    memory: 90,
    loadTime: 3000,
    errorRate: 5
  }
}) => {
  const [metrics, setMetrics] = useState({
    fps: 60,
    memory: 0,
    loadTime: 0,
    errorCount: 0,
    lastUpdate: Date.now()
  });

  const [historicalData, setHistoricalData] = useState({
    fps: [],
    memory: [],
    loadTime: [],
    errorCount: []
  });

  const [showDetails, setShowDetails] = useState(false);

  const updateMetrics = useCallback((performanceData) => {
    const currentTime = Date.now();
    const timeDiff = currentTime - metrics.lastUpdate;
    
    // Calculate FPS
    const fps = Math.round(1000 / timeDiff);
    
    // Calculate memory usage
    const memoryUsage = performanceData.memory 
      ? Math.round((performanceData.memory / 1024 / 1024) * 100) / 100
      : 0;

    // Calculate page load time
    const loadTime = performanceData.timing?.loadEventEnd - performanceData.timing?.navigationStart || 0;

    const newMetrics = {
      fps,
      memory: memoryUsage,
      loadTime,
      errorCount: metrics.errorCount,
      lastUpdate: currentTime
    };

    setMetrics(newMetrics);

    // Update historical data
    setHistoricalData(prev => ({
      fps: [...prev.fps.slice(-30), fps],
      memory: [...prev.memory.slice(-30), memoryUsage],
      loadTime: [...prev.loadTime.slice(-30), loadTime],
      errorCount: [...prev.errorCount.slice(-30), metrics.errorCount]
    }));
  }, [metrics]);

  // Use our custom performance monitor hook
  usePerformanceMonitor(updateMetrics, refreshRate);

  // Calculate trends
  const calculateTrend = (data) => {
    if (data.length < 2) return 0;
    const last = data[data.length - 1];
    const prev = data[data.length - 2];
    return prev !== 0 ? Math.round(((last - prev) / prev) * 100) : 0;
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-gray-900 rounded-xl shadow-lg p-4 max-w-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-blue-400" />
            <h3 className="text-white font-semibold">Performance Monitor</h3>
          </div>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            {showDetails ? 'Hide' : 'Show'} Details
          </button>
        </div>

        <div className="space-y-4">
          <MetricCard
            icon={Clock}
            label="FPS"
            value={`${metrics.fps} fps`}
            trend={calculateTrend(historicalData.fps)}
            alert={metrics.fps < thresholds.fps}
          />

          {showDetails && (
            <>
              <MetricCard
                icon={Memory}
                label="Memory Usage"
                value={`${metrics.memory} MB`}
                trend={calculateTrend(historicalData.memory)}
                alert={metrics.memory > thresholds.memory}
              />

              <MetricCard
                icon={Cpu}
                label="Load Time"
                value={`${metrics.loadTime}ms`}
                trend={calculateTrend(historicalData.loadTime)}
                alert={metrics.loadTime > thresholds.loadTime}
              />

              <MetricCard
                icon={TrendingUp}
                label="Error Rate"
                value={`${metrics.errorCount} errors`}
                trend={calculateTrend(historicalData.errorCount)}
                alert={metrics.errorCount > thresholds.errorRate}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PerformanceMonitor;