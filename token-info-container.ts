import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TokenFeatures from './TokenFeatures';
import TokenStats from './TokenStats';
import TokenUtility from './TokenUtility';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';
import { logger } from '@/utils/logger';

interface TokenData {
  totalSupply: string;
  circulatingSupply: string;
  burnedTokens: string;
  holders: number;
  marketCap: string;
}

const initialTokenData: TokenData = {
  totalSupply: '1,000,000,000',
  circulatingSupply: '960,000,000',
  burnedTokens: '40,000,000',
  holders: 0,
  marketCap: '0'
};

const TokenInfoContainer: React.FC = () => {
  const [tokenData, setTokenData] = useState<TokenData>(initialTokenData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { trackRender, trackAction } = usePerformanceMonitor('token-info');

  useEffect(() => {
    const fetchTokenData = async () => {
      try {
        setIsLoading(true);
        trackAction('fetch-token-data-start');

        // Simulated API call - replace with actual data fetching
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data update
        setTokenData(prev => ({
          ...prev,
          holders: Math.floor(Math.random() * 1000) + 5000
        }));

        trackAction('fetch-token-data-success');
      } catch (err) {
        const error = err instanceof Error ? err.message : 'Failed to fetch token data';
        logger.error('Token data fetch error:', error);
        setError(error);
        trackAction('fetch-token-data-error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTokenData();
    trackRender('token-info-mount');

    return () => {
      logger.info('Token info component unmounted');
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
            $SNIPE Token
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            The native token powering the SnipeAI ecosystem, providing access to advanced trading tools and services
          </p>
        </motion.div>

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
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <TokenStats data={tokenData} />
              <TokenFeatures />
              <TokenUtility />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TokenInfoContainer;