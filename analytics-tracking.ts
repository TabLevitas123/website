import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AnalyticsBrowser } from '@segment/analytics-next';
import { logger } from '../utils/logger';

const analytics = AnalyticsBrowser.load({ writeKey: process.env.REACT_APP_SEGMENT_WRITE_KEY });

interface PageData {
  name: string;
  path: string;
}

const useAnalyticsTracking = () => {
  const location = useLocation();

  useEffect(() => {
    const pagePath = location.pathname + location.search;

    const pageData: PageData = {
      name: document.title,
      path: pagePath
    };

    analytics.page(pageData);

    const pushStateHandler = () => {
      analytics.page(pageData);
    };

    window.addEventListener('pushstate', pushStateHandler);
    window.addEventListener('popstate', pushStateHandler);

    const handleClick = (event: MouseEvent) => {
      try {
        const target = event.target as HTMLElement;
        const closestLink = target.closest('a');
        if (closestLink && closestLink.href.startsWith(window.location.origin)) {
          analytics.track('Link Clicked', {
            url: closestLink.href
          });
        }
      } catch (error) {
        logger.error('Error tracking link click:', error);  
      }
    };

    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('pushstate', pushStateHandler);
      window.removeEventListener('popstate', pushStateHandler);
      window.removeEventListener('click', handleClick);
    };
  }, [location]);

  useEffect(() => {
    const trackErrors = (error: ErrorEvent) => {
      analytics.track('Error Occurred', {
        errorMessage: error.message,
        errorStack: error.error?.stack
      });
    };

    window.addEventListener('error', trackErrors);

    return () => {
      window.removeEventListener('error', trackErrors);  
    };
  }, []);
};

export default useAnalyticsTracking;