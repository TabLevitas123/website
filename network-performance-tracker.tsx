import React, { memo, useEffect, useState, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Activity, Zap, Clock, Database, AlertCircle } from 'lucide-react';
import { logger } from '../utils/logger';

const MetricCard = memo(({ 
  title, 
  value, 
  unit, 
  icon: Icon, 
  trend,
  thresholds = { warning: null, critical: null }
}) => {
  const getStatusColor = () => {
    if (!thresholds.warning || !thresholds.critical) return 'text-blue-400';
    if (value >= thresholds.critical) return 'text-red-400';
    if (value >= thresholds.warning) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Icon className="w-5 h-5 text-gray-400" />
          <span className="text-sm text-gray-400">{title}</span>
        </div>
        {trend && (
          <div className={`text-sm ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div className={`text-2xl font-bold ${getStatusColor()}`}>
        {value} {unit}
      </div>
    </div>
  );
});

MetricCard.displayName = 'MetricCard';

const PerformanceChart = memo(({ 
  data, 
  dataKey, 
  color,
  name,
  domain = [0, 'auto']
}) => (
  <ResponsiveContainer width="100%" height={200}>
    <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
      <XAxis 
        dataKey="timestamp" 
        stroke="#9CA3AF"
        tickFormatter={(ts) => new Date(ts).toLocaleTimeString()}
      />
      <YAxis stroke="#9CA3AF" domain={domain} />
      <Tooltip
        contentStyle={{
          backgroundColor: '#1F2937',
          border: 'none',
          borderRadius: '0.5rem',
          color: '#F3F4F6'
        }}
        labelFormatter={(ts) => new Date(ts).toLocaleString()}
      />
      <Legend />
      <Line 
        type="monotone" 
        dataKey={dataKey} 
        stroke={color} 
        name={name}
        dot={false}
        strokeWidth={2}
      />
    </LineChart>
  </ResponsiveContainer>
));

PerformanceChart.displayName = 'PerformanceChart';

const NetworkPerformanceTracker = ({ 
  requests = [], 
  timeWindow = 300000 // 5 minutes
}) => {
  const [metrics, setMetrics] = useState({
    avgResponseTime: 0,
    throughput: 0,
    errorRate: 0,
    dataTransfer: 0
  });

  const [historicalData, setHistoricalData] = useState([]);

  // Calculate metrics
  useEffect(() => {
    const interval = setInterval(() => {
      try {
        const now = Date.now();
        const windowStart = now - timeWindow;
        
        // Filter requests within time window
        const recentRequests = requests.filter(
          req => new Date(req.timestamp).getTime() > windowStart
        );

        // Calculate metrics
        const avgResponseTime = recentRequests.reduce(
          (acc, req) => acc + req.duration, 0
        ) / (recentRequests.length || 1);

        const throughput = recentRequests.length / (timeWindow / 1000);

        const errorCount = recentRequests.filter(
          req => req.status === 'error'
        ).length;
        const errorRate = (errorCount / (recentRequests.length || 1)) * 100;

        const dataTransfer = recentRequests.reduce(
          (acc, req) => acc + (req.size || 0), 0
        ) / 1024 / 1024; // Convert to MB

        // Update metrics
        setMetrics({
          avgResponseTime: Math.round(avgResponseTime),
          throughput: throughput.toFixed(2),
          errorRate: errorRate.toFixed(1),
          dataTransfer: dataTransfer.toFixed(2)
        });

        // Update historical data
        setHistoricalData(prev => {
          const newPoint = {
            timestamp: now,
            responseTime: avgResponseTime,
            throughput,
            errorRate,
            dataTransfer
          };

          // Keep only points within time window
          const updatedData = [...prev, newPoint].filter(
            point => point.timestamp > windowStart
          );

          return updatedData;
        });

        // Log performance metrics
        logger.debug('Network performance metrics updated:', metrics);
      } catch (error) {
        logger.error('Error calculating performance metrics:', error);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [requests, timeWindow]);

  return (
    <div className="space-y-6 p-4">
      {/* Metrics Cards */}
      <div className="grid grid-cols-4 gap-4">
        <MetricCard
          title="Avg Response Time"
          value={metrics.avgResponseTime}
          unit="ms"
          icon={Clock}
          thresholds={{ warning: 1000, critical: 3000 }}
        />
        <MetricCard
          title="Throughput"
          value={metrics.throughput}
          unit="req/s"
          icon={Activity}
        />
        <MetricCard
          title="Error Rate"
          value={metrics.errorRate}
          unit="%"
          icon={AlertCircle}
          thresholds={{ warning: 5, critical: 10 }}
        />
        <MetricCard
          title="Data Transfer"
          value={metrics.dataTransfer}
          unit="MB"
          icon={Database}
        />
      </div>

      {/* Performance Charts */}
      <div className="space-y-6">
        <div className="bg-gray-900 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-400 mb-4">
            Response Time Trend
          </h3>
          <PerformanceChart
            data={historicalData}
            dataKey="responseTime"
            color="#3B82F6"
            name="Response Time (ms)"
          />
        </div>

        <div className="bg-gray-900 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-400 mb-4">
            Throughput & Error Rate
          </h3>
          <PerformanceChart
            data={historicalData}
            dataKey="throughput"
            color="#10B981"
            name="Throughput (req/s)"
            domain={[0, 'auto']}
          />
        </div>

        <div className="bg-gray-900 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-400 mb-4">
            Data Transfer Rate
          </h3>
          <PerformanceChart
            data={historicalData}
            dataKey="dataTransfer"
            color="#6366F1"
            name="Data Transfer (MB)"
            domain={[0, 'auto']}
          />
        </div>
      </div>
    </div>
  );
};

export default memo(NetworkPerformanceTracker);