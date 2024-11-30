import React, { memo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RefreshCw, Settings, Download, Filter, Search, 
  Calendar, Clock, ChevronDown, X, HelpCircle
} from 'lucide-react';
import { logger } from '../utils/logger';

// Animation variants
const headerVariants = {
  hidden: { 
    opacity: 0, 
    y: -20 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.3,
      type: 'spring',
      stiffness: 300,
      damping: 30
    }
  }
};

const dropdownVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.95,
    y: -10 
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.2
    }
  }
};

// Time range options
const timeRanges = [
  { label: 'Last 15 minutes', value: '15m' },
  { label: 'Last hour', value: '1h' },
  { label: 'Last 6 hours', value: '6h' },
  { label: 'Last 24 hours', value: '24h' },
  { label: 'Last 7 days', value: '7d' },
  { label: 'Custom range', value: 'custom' }
];

const HeaderButton = memo(({ 
  icon: Icon, 
  label, 
  onClick, 
  active = false,
  className = '' 
}) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`flex items-center space-x-2 px-4 py-2 rounded-lg
               transition-colors ${active 
                 ? 'bg-blue-600 text-white' 
                 : 'text-gray-400 hover:text-white hover:bg-gray-800'} 
               ${className}`}
  >
    <Icon className="w-5 h-5" />
    <span>{label}</span>
  </motion.button>
));

HeaderButton.displayName = 'HeaderButton';

const MetricsHeader = memo(({
  onTimeRangeChange,
  onRefresh,
  onExport,
  onSettingsChange,
  className = ''
}) => {
  const [selectedRange, setSelectedRange] = useState('1h');
  const [isCustomRange, setIsCustomRange] = useState(false);
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [customRange, setCustomRange] = useState({
    start: null,
    end: null
  });
  const [refreshInterval, setRefreshInterval] = useState(30000); // 30 seconds
  const [showHelp, setShowHelp] = useState(false);

  // Handle time range selection
  const handleRangeSelect = useCallback((range) => {
    try {
      setSelectedRange(range);
      setShowTimeDropdown(false);

      if (range === 'custom') {
        setIsCustomRange(true);
      } else {
        if (onTimeRangeChange) {
          onTimeRangeChange(range);
        }
      }
    } catch (error) {
      logger.error('Error selecting time range:', error);
    }
  }, [onTimeRangeChange]);

  // Handle custom range selection
  const handleCustomRange = useCallback((start, end) => {
    try {
      setCustomRange({ start, end });
      if (onTimeRangeChange) {
        onTimeRangeChange({ start, end });
      }
    } catch (error) {
      logger.error('Error setting custom range:', error);
    }
  }, [onTimeRangeChange]);

  // Handle refresh interval change
  const handleRefreshIntervalChange = useCallback((interval) => {
    try {
      setRefreshInterval(interval);
      if (onSettingsChange) {
        onSettingsChange({ refreshInterval: interval });
      }
    } catch (error) {
      logger.error('Error changing refresh interval:', error);
    }
  }, [onSettingsChange]);

  return (
    <motion.div
      variants={headerVariants}
      initial="hidden"
      animate="visible"
      className={`bg-gray-900 border-b border-gray-800 p-4 ${className}`}
    >
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {/* Time Range Selector */}
          <div className="relative">
            <HeaderButton
              icon={Calendar}
              label={timeRanges.find(r => r.value === selectedRange)?.label}
              onClick={() => setShowTimeDropdown(!showTimeDropdown)}
              active={showTimeDropdown}
            />

            <AnimatePresence>
              {showTimeDropdown && (
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="absolute z-10 mt-2 w-64 bg-gray-800 rounded-lg shadow-lg 
                           border border-gray-700"
                >
                  {timeRanges.map((range) => (
                    <button
                      key={range.value}
                      onClick={() => handleRangeSelect(range.value)}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-700 
                                transition-colors ${selectedRange === range.value 
                                  ? 'text-blue-400' 
                                  : 'text-gray-300'}`}
                    >
                      {range.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Refresh Interval */}
          <div className="flex items-center space-x-2">
            <select
              value={refreshInterval}
              onChange={(e) => handleRefreshIntervalChange(Number(e.target.value))}
              className="bg-gray-800 border border-gray-700 rounded px-3 py-2 
                       text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={5000}>5s</option>
              <option value={15000}>15s</option>
              <option value={30000}>30s</option>
              <option value={60000}>1m</option>
            </select>

            <HeaderButton
              icon={RefreshCw}
              label="Refresh"
              onClick={onRefresh}
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          <HeaderButton
            icon={Download}
            label="Export"
            onClick={onExport}
          />

          <HeaderButton
            icon={Settings}
            label="Settings"
            onClick={() => setShowSettings(true)}
          />

          <HeaderButton
            icon={HelpCircle}
            label="Help"
            onClick={() => setShowHelp(true)}
          />
        </div>
      </div>

      {/* Custom Range Dialog */}
      <AnimatePresence>
        {isCustomRange && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center 
                     justify-center z-50"
          >
            {/* Custom range dialog content */}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Help Dialog */}
      <AnimatePresence>
        {showHelp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center 
                     justify-center z-50"
          >
            {/* Help dialog content */}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

MetricsHeader.displayName = 'MetricsHeader';

export default MetricsHeader;