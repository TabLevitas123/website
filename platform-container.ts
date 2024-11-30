import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Zap, RefreshCw, Shield, ChevronRight } from 'lucide-react';
import PlatformFeature from './PlatformFeature';
import PlatformStats from './PlatformStats';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';
import { logger } from '@/utils/logger';

interface Stats {
  totalTrades: number;
  successRate: number;
  avgProfit: number;
  activeUsers: number;
}

const initialStats: Stats = {
  totalTrades: 50000,
  successRate: 89.5,
  avgProfit: 250.75,
  activeUsers: 5000
};

const featureData = [
  {
    id: 'sniper-bot',
    title: 'Sniper Bot',
    description: 'Advanced AI-powered token detection and trading bot with anti-rug protection.',
    icon: Bot,
    features: [
      'Real-time contract analysis',
      'Machine learning-based risk assessment',
      'Anti-bot detection evasion',
      'Multi-chain monitoring',
      'Automated trading execution'
    ],
    background: 'from-blue-600 to-purple-600'
  },
  {
    id: 'flash-loan',
    title: 'Flash Loan Arbitrage Bot',
    description: 'Multi-chain, multi-exchange arbitrage bot leveraging flash loans for maximum profits.',
    icon: Zap,
    features: [
      'Cross-chain monitoring',
      'Price disparity detection',
      'Automated execution',
      'Risk management',
      'Profit optimization'
    ],
    background: 'from-purple-600 to-pink-600'
  }
];

const PlatformContainer: React.FC = () => {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats>(initialStats);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { trackRender, trackAction } = usePerformanceMonitor('platform');

  // Initialize platform data
  useEffect(() => {
    const fetchPlatformData = async () => {
      try {
        setIsLoading(true);
        trackAction('fetch-platform-data-start');

        // Simulated API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock stats update
        setStats(prev => ({
          ...prev,
          totalTrades: Math.floor(Math.random() * 10000) + 50000,
          successRate: +(89 + Math.random() * 10).toFixed(1),
          avgProfit: +(200 + Math.random() * 100).toFixed(2),
          activeUsers: Math.floor(Math.random() * 1000) + 5000
        }));

        trackAction('fetch-platform-data-success');
      } catch (err) {
        const error = err instanceof Error ? err.message : 'Failed to fetch platform data';
        logger.error('Platform data fetch error:', error);
        setError(error);
        trackAction('fetch-platform-data-error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlatformData();
    trackRender('platform-mount');

    return () => {
      logger.info('Platform component unmounted');
    };
  }, [trackAction, trackRender]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-900">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-blue-900/20 to-purple-900/20 opacity-50" />
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            AI-Powered Trading Platform
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Advanced trading bots powered by artificial intelligence, designed to give you the edge in cryptocurrency trading.
          </p>
        </motion.div>

        {/* Loading/Error States */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center items-center py-20"
            >
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </motion.div>
          ) : error ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-red-900/20 text-red-400 p-6 rounded-lg text-center"
            >
              {error}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-12"
            >
              {/* Platform Stats */}
              <PlatformStats stats={stats} />

              {/* Features Grid */}
              <div className="grid md:grid-cols-2 gap-8 mt-16">
                {featureData.map((feature, index) => (
                  <PlatformFeature
                    key={feature.id}
                    {...feature}
                    isSelected={selectedFeature === feature.id}
                    onSelect={() => setSelectedFeature(
                      feature.id === selectedFeature ? null : feature.id
                    )}
                    index={index}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PlatformContainer;