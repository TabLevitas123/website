import { useEffect } from 'react';
import { logger } from '../utils/logger';

interface PerformanceData {
  ttfb: number;
  fcp: number; 
  domLoad: number;
  windowLoad: number;
}

const usePerformanceMonitor = () => {
  useEffect(() => {
    let perfData: PerformanceData;
    
    const gatherPerformanceData = () => {
      try {
        const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

        if (!navEntry) {
          logger.debug('Navigation entry not found');
          return;
        }

        const ttfb = navEntry.responseStart - navEntry.requestStart;
        const fcp = (navEntry as any).domContentLoadedEventEnd;
        const domLoad = navEntry.domComplete;
        const windowLoad = navEntry.loadEventEnd;

        perfData = {
          ttfb,
          fcp, 
          domLoad,
          windowLoad
        };

        reportPerformance(perfData);
      } catch (error) {
        logger.error('Error gathering performance data:', error);
      }
    };

    const reportPerformance = (data: PerformanceData) => {
      // Log performance data for now, could send to analytics service
      logger.info('Performance metrics:', data);
    };

    const sendToAnalytics = () => {
      // Logic to send perfData to analytics service
      logger.debug('Sending performance data to analytics');
    };

    if (document.readyState === 'complete') {
      gatherPerformanceData();
    } else {
      window.addEventListener('load', gatherPerformanceData);
    }

    window.addEventListener('beforeunload', sendToAnalytics);

    return () => {
      window.removeEventListener('load', gatherPerformanceData);
      window.removeEventListener('beforeunload', sendToAnalytics);
    };
  }, []);
};

export default usePerformanceMonitor;