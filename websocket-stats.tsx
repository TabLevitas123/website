import React, { memo, useState, useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Activity, ArrowUp, ArrowDown, Clock, Database } from 'lucide-react';
import { logger } from '../utils/logger';

const StatMetric = memo(({ 
  icon: Icon, 
  label, 
  value, 
  unit, 
  trend = null,
  className = ''
}) => (
  <div className={`bg-gray-800 rounded-lg p-4 ${className}`}>
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Icon className="w-4 h-4 text-gray-400" />
        <span className="text-sm text-gray-400">{label}</span>
      </div>
      {trend !== null && (
        <div className={`text-sm ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {trend > 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
          {Math.abs(trend)}%
        </div>
      )}
    </div>
    <div className="mt-2 text-2xl font-bold text-white">
      {value} <span className="text-sm text-gray-400">{unit}</span>
    </div>
  </div>
));

StatMetric.displayName = 'StatMetric';

const TimeSeriesChart = memo(({ 
  data, 
  metrics, 
  height = 200,
  className = ''
}) => (
  <div className={`bg-gray-800 rounded-lg p-4 ${className}`}>
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis 
          dataKey="timestamp" 
          stroke="#9CA3AF"
          tickFormatter={(ts) => new Date(ts).toLocaleTimeString()}
        />
        <YAxis stroke="#9CA3AF" />
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
        {metrics.map(({ key, name, color }) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            name={name}
            stroke={color}
            strokeWidth={2}
            dot={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  </div>
));

TimeSeriesChart.displayName = 'TimeSeriesChart';

const WebSocketStats = ({
  connection,
  messageHistory = [],
  timeWindow = 300000, // 5 minutes
  updateInterval = 1000,
  className = ''
}) => {
  const [stats, setStats] = useState({
    messagesPerSecond: 0,
    averageLatency: 0,
    dataRate: 0,
    uptime: 0
  });

  const [timeSeriesData, setTimeSeriesData] = useState([]);

  // Calculate current stats
  useEffect(() => {
    const interval = setInterval(() => {
      try {
        const now = Date.now();
        const windowStart = now - timeWindow;
        
        // Filter messages within time window
        const recentMessages = messageHistory.filter(
          msg => msg.timestamp > windowStart
        );

        // Calculate metrics
        const messagesPerSecond = recentMessages.length / (timeWindow / 1000);
        
        const averageLatency = recentMessages.reduce(
          (acc, msg) => acc + msg.latency, 0
        ) / (recentMessages.length || 1);

        const dataRate = recentMessages.reduce(
          (acc, msg) => acc + msg.size, 0
        ) / (timeWindow / 1000); // bytes per second

        // Update stats
        setStats(prev => ({
          messagesPerSecond: messagesPerSecond.toFixed(2),
          averageLatency: Math.round(averageLatency),
          dataRate: (dataRate / 1024).toFixed(2), // KB/s
          uptime: Math.floor((now - connection.startTime) / 1000)
        }));

        // Update time series data
        setTimeSeriesData(prevData => {
          const newPoint = {
            timestamp: now,
            messagesPerSecond,
            latency: averageLatency,
            dataRate: dataRate / 1024
          };

          // Keep only points within time window
          const updatedData = [...prevData, newPoint].filter(
            point => point.timestamp > windowStart
          );

          return updatedData;
        });

        logger.debug('WebSocket stats updated:', stats);