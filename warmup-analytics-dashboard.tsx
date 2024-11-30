import React, { memo, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { 
  Activity, TrendingUp, BarChart2, Clock, 
  Database, Server, AlertCircle, RefreshCw 
} from 'lucide-react';
import { logger } from '../utils/logger';

// Dashboard card animation variants
const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    transition: { duration: 0.3 }
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3 }
  },
  hover: {
    scale: 1.02,
    transition: { duration: 0.2 }
  }
};

const MetricCard = memo(({ 
  icon: Icon, 
  title, 
  value, 
  trend, 
  description,
  color = 'blue'
}) => (
  <motion.div
    variants={cardVariants}
    initial="hidden"
    animate="visible"
    whileHover="hover"
    className={`bg-gray-800 rounded-lg p-6 border-l-4 border-${color}-500
                hover:shadow-lg transition-shadow duration-300`}
  >
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-full bg-${color}-500/10`}>
        <Icon className={`w-6 h-6 text-${color}-500`} />
      </div>
      {trend && (
        <div className={`flex items-center space-x-1 text-sm
                        ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
          <TrendingUp className={`w-4 h-4 ${trend < 0 && 'transform rotate-180'}`} />
          <span>{Math.abs(trend)}%</span>
        </div>
      )}
    </div>
    <h3 className="text-lg font-semibold text-gray-300 mb-2">{title}</h3>
    <div className="text-3xl font-bold text-white mb-2">{value}</div>
    {description && (
      <p className="text-sm text-gray-400">{description}</p>
    )}
  </motion.div>
));

MetricCard.displayName = 'MetricCard';

const ChartCard = memo(({ 
  title, 
  chart: Chart,
  data,
  loading,
  error,
  className = ''
}) => (
  <motion.div
    variants={cardVariants}
    initial="hidden"
    animate="visible"
    whileHover="hover"
    className={`bg-gray-800 rounded-lg p-6 ${className}`}
  >
    <h3 className="text-lg font-semibold text-gray-300 mb-4">{title}</h3>
    <div className="h-64">
      {loading ? (
        <div className="h-full flex items-center justify-center">
          <RefreshCw className="w-8 h-8 text-gray-500 animate-spin" />
        </div>
      ) : error ? (
        <div className="h-full flex items-center justify-center text-red-500">
          <AlertCircle className="w-6 h-6 mr-2" />
          {error}
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <Chart data={data} />
        </ResponsiveContainer>
      )}
    </div>
  </motion.div>
));

ChartCard.displayName = 'ChartCard';

const WarmupAnalyticsDashboard = memo(({
  data,
  onTimeRangeChange,
  onRefresh,
  className = ''
}) => {
  const [timeRange, setTimeRange] = useState('1h');
  const [refreshInterval, setRefreshInterval] = useState(30000);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Auto-refresh
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (onRefresh) {
        onRefresh();
      }
    }, refreshInterval);

    return () => clearInterval(intervalId);
  }, [refreshInterval, onRefresh]);

  // Handle time range change
  const handleTimeRangeChange = useCallback((range) => {
    try {
      setTimeRange(range);
      if (onTimeRangeChange) {
        onTimeRangeChange(range);
      }
    } catch (error) {
      logger.error('Error changing time range:', error);
      setError('Failed to update time range');
    }
  }, [onTimeRangeChange]);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Cache Warmup Analytics</h2>
        <div className="flex items-center space-x-4">
          {/* Time Range Selector */}
          <div className="flex items-center space-x-2 bg-gray-800 rounded-lg p-2">
            {['1h', '6h', '24h', '7d'].map((range) => (
              <button
                key={range}
                onClick={() => handleTimeRangeChange(range)}
                className={`px-3 py-1 rounded-md text-sm transition-colors
                          ${timeRange === range 
                            ? 'bg-blue-600 text-white' 
                            : 'text-gray-400 hover:text-white'}`}
              >
                {range}
              </button>
            ))}
          </div>

          {/* Refresh Controls */}
          <div className="flex items-center space-x-2">
            <select
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(Number(e.target.value))}
              className="bg-gray-800 border border-gray-700 rounded px-3 py-1 text-sm
                       text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={5000}>5s</option>
              <option value={15000}>15s</option>
              <option value={30000}>30s</option>
              <option value={60000}>1m</option>
            </select>
            <button
              onClick={onRefresh}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          icon={Activity}
          title="Hit Rate"
          value={`${data.hitRate.toFixed(1)}%`}
          trend={data.hitRateTrend}
          description="Cache hit rate in the selected period"
          color="blue"
        />
        <MetricCard
          icon={Clock}
          title="Avg Load Time"
          value={`${data.avgLoadTime}ms`}
          trend={data.loadTimeTrend}
          description="Average resource load time"
          color="green"
        />
        <MetricCard
          icon={Database}
          title="Cache Size"
          value={`${(data.cacheSize / 1024 / 1024).toFixed(1)}MB`}
          description="Current cache size"
          color="purple"
        />
        <MetricCard
          icon={Server}
          title="Resources"
          value={data.resourceCount}
          trend={data.resourceTrend}
          description="Total cached resources"
          color="orange"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Hit Rate Over Time"
          chart={AreaChart}
          data={data.hitRateHistory}
          loading={isLoading}
          error={error}
        >
          <defs>
            <linearGradient id="hitRateGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#3B82F6"
            fillOpacity={1}
            fill="url(#hitRateGradient)"
          />
        </ChartCard>

        <ChartCard
          title="Load Time Distribution"
          chart={LineChart}
          data={data.loadTimeDistribution}
          loading={isLoading}
          error={error}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="range" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#10B981"
            strokeWidth={2}
          />
        </ChartCard>
      </div>

      {/* Error Display */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed bottom-4 right-4 bg-red-900/90 text-white px-4 py-2 rounded-lg
                     flex items-center space-x-2"
          >
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

WarmupAnalyticsDashboard.displayName = 'WarmupAnalyticsDashboard';

export default WarmupAnalyticsDashboard;