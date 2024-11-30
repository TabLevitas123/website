import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';
import { logger } from '@/utils/logger';

// Components
import LinkCard from './LinkCard';
import LinkStats from './LinkStats';
import LoadingState from '@/components/shared/LoadingState';
import ErrorBoundary from '@/components/shared/ErrorBoundary';

// Types
interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
  description: string;
  followers?: number;
  engagement?: number;
}

interface LinkStats {
  totalFollowers: number;
  totalEngagement: number;
  growthRate: number;
  activeUsers: number;
}

const LinksContainer: React.FC = () => {
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [stats, setStats] = useState<LinkStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { trackRender, trackAction } = usePerformanceMonitor('links-section');

  useEffect(() => {
    const initializeLinks = async () => {
      try {
        setIsLoading(true);
        trackAction('init-links-start');

        // Initialize default links
        const defaultLinks: SocialLink[] = [
          {
            id: 'twitter',
            platform: 'Twitter',
            url: 'https://twitter.com/SnipeAI_ETH',
            icon: 'twitter',
            description: 'Follow us for the latest updates and announcements',
            followers: 5000,
            engagement: 85
          },
          {
            id: 'telegram',
            platform: 'Telegram',
            url: 'https://t.me/SnipeAI_ETH',
            icon: 'telegram',
            description: 'Join our community for real-time discussions',
            followers: 10000,
            engagement: 92
          },
          {
            id: 'discord',
            platform: 'Discord',
            url: 'https://discord.gg/snipeai',
            icon: 'discord',
            description: 'Connect with developers and get technical support',
            followers: 7500,
            engagement: 78
          },
          {
            id: 'medium',
            platform: 'Medium',
            url: 'https://medium.com/@SnipeAI',
            icon: 'medium',
            description: 'Read our detailed technical articles and updates',
            followers: 3000,
            engagement: 65
          }
        ];

        // Calculate stats
        const totalFollowers = defaultLinks.reduce((acc, link) => acc + (link.followers || 0), 0);
        const avgEngagement = defaultLinks.reduce((acc, link) => acc + (link.engagement || 0), 0) / defaultLinks.length;

        setLinks(defaultLinks);
        setStats({
          totalFollowers,
          totalEngagement: avgEngagement,
          growthRate: 15.7,
          activeUsers: 25000
        });

        setIsLoading(false);
        trackAction('init-links-complete');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to initialize links';
        logger.error('Links initialization error:', err);
        setError(errorMessage);
        trackAction('init-links-error');
        setIsLoading(false);
      }
    };

    initializeLinks();
    trackRender('links-mount');

    return () => {
      logger.info('Links component unmounted');
    };
  }, [trackAction, trackRender]);

  return (
    <ErrorBoundary>
      <section className="min-h-screen relative overflow-hidden bg-gray-900">
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
              Connect With Us
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Join our growing community and stay updated with the latest developments
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {isLoading ? (
              <LoadingState />
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
                {/* Stats Section */}
                {stats && <LinkStats stats={stats} />}

                {/* Links Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {links.map((link, index) => (
                    <LinkCard
                      key={link.id}
                      link={link}
                      index={index}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </ErrorBoundary>
  );
};

export default LinksContainer;