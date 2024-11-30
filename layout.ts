import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from '@/components/navigation/Navigation';
import LayoutErrorBoundary from '@/components/layout/LayoutErrorBoundary';
import LayoutBackground from '@/components/layout/LayoutBackground';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';
import { logger } from '@/utils/logger';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { trackRender } = usePerformanceMonitor('layout');

  // Track initial render
  React.useEffect(() => {
    trackRender('layout-mount');
    logger.info('Layout mounted');

    return () => {
      logger.info('Layout unmounted');
    };
  }, [trackRender]);

  return (
    <LayoutErrorBoundary>
      <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
        {/* Background Effects */}
        <LayoutBackground />

        {/* Navigation */}
        <Navigation />

        {/* Main Content */}
        <AnimatePresence mode="wait">
          <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="relative z-10"
          >
            {children}
          </motion.main>
        </AnimatePresence>
      </div>
    </LayoutErrorBoundary>
  );
};

export default Layout;