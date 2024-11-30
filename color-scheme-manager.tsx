import React, { memo, createContext, useContext, useState, useCallback } from 'react';
import { colors } from './brand-utils';
import { logger } from '../utils/logger';

// Color scheme context
const ColorSchemeContext = createContext(null);

// Base color schemes
const colorSchemes = {
  default: {
    primary: colors.primary,
    secondary: colors.secondary,
    accent: colors.accent,
    background: colors.background
  },
  dark: {
    primary: {
      blue: '#2B4C7E',
      darkBlue: '#1B2838',
      gold: '#B8860B'
    },
    secondary: {
      lightBlue: '#567EBB',
      turquoise: '#2F6B6B',
      navy: '#0A1929'
    },
    accent: {
      yellow: '#DAA520',
      orange: '#CD853F',
      purple: '#683A8E'
    },
    background: {
      dark: '#0D1117',
      darker: '#090C10',
      gradient: 'linear-gradient(to bottom, #1B2838, #0D1117)'
    }
  },
  light: {
    primary: {
      blue: '#60A5FA',
      darkBlue: '#2563EB',
      gold: '#F59E0B'
    },
    secondary: {
      lightBlue: '#93C5FD',
      turquoise: '#5EEAD4',
      navy: '#1E40AF'
    },
    accent: {
      yellow: '#FCD34D',
      orange: '#FB923C',
      purple: '#C084FC'
    },
    background: {
      dark: '#F3F4F6',
      darker: '#E5E7EB',
      gradient: 'linear-gradient(to bottom, #F9FAFB, #F3F4F6)'
    }
  }
};

// Color scheme provider
export const ColorSchemeProvider = memo(({ children }) => {
  const [currentScheme, setCurrentScheme] = useState('default');
  const [customScheme, setCustomScheme] = useState(null);

  // Get active color scheme
  const getActiveScheme = useCallback(() => {
    try {
      return customScheme || colorSchemes[currentScheme] || colorSchemes.default;
    } catch (error) {
      logger.error('Error getting active color scheme:', error);
      return colorSchemes.default;
    }
  }, [currentScheme, customScheme]);

  // Change color scheme
  const changeScheme = useCallback((scheme) => {
    try {
      if (colorSchemes[scheme]) {
        setCurrentScheme(scheme);
        setCustomScheme(null);
        logger.info('Color scheme changed:', scheme);
      } else {
        throw new Error(`Invalid color scheme: ${scheme}`);
      }
    } catch (error) {
      logger.error('Error changing color scheme:', error);
    }
  }, []);

  // Apply custom scheme
  const applyCustomScheme = useCallback((scheme) => {
    try {
      // Validate custom scheme structure
      const requiredKeys = ['primary', 'secondary', 'accent', 'background'];
      const isValid = requiredKeys.every(key => 
        scheme[key] && typeof scheme[key] === 'object'
      );

      if (!isValid) {
        throw new Error('Invalid custom scheme structure');
      }

      setCustomScheme(scheme);
      logger.info('Custom color scheme applied');
    } catch (error) {
      logger.error('Error applying custom color scheme:', error);
    }
  }, []);

  // Reset to default scheme
  const resetScheme = useCallback(() => {
    try {
      setCurrentScheme('default');
      setCustomScheme(null);
      logger.info('Color scheme reset to default');
    } catch (error) {
      logger.error('Error resetting color scheme:', error);
    }
  }, []);

  // Generate CSS variables
  const generateCSSVariables = useCallback(() => {
    const scheme = getActiveScheme();
    const variables = {};

    try {
      Object.entries(scheme).forEach(([category, colors]) => {
        Object.entries(colors).forEach(([name, value]) => {
          variables[`--color-${category}-${name}`] = value;
        });
      });

      return variables;
    } catch (error) {
      logger.error('Error generating CSS variables:', error);
      return {};
    }
  }, [getActiveScheme]);

  const value = {
    currentScheme,
    colors: getActiveScheme(),
    cssVariables: generateCSSVariables(),
    changeScheme,
    applyCustomScheme,
    resetScheme
  };

  return (
    <ColorSchemeContext.Provider value={value}>
      {children}
    </ColorSchemeContext.Provider>
  );
});

ColorSchemeProvider.displayName = 'ColorSchemeProvider';

// Custom hook for using color scheme
export const useColorScheme = () => {
  const context = useContext(ColorSchemeContext);
  if (!context) {
    throw new Error('useColorScheme must be used within a ColorSchemeProvider');
  }
  return context;
};

// Color scheme applier component
export const ColorSchemeApplier = memo(({ children }) => {
  const { cssVariables } = useColorScheme();

  return (
    <div style={cssVariables}>
      {children}
    </div>
  );
});

ColorSchemeApplier.displayName = 'ColorSchemeApplier';

// Theme toggle component
export const ThemeToggle = memo(({ className = '' }) => {
  const { currentScheme, changeScheme } = useColorScheme();

  const handleToggle = () => {
    changeScheme(currentScheme === 'light' ? 'dark' : 'light');
  };

  return (
    <button
      onClick={handleToggle}
      className={`p-2 rounded-lg bg-gray-800 hover:bg-gray-700 
                 transition-colors duration-200 ${className}`}
      aria-label={`Switch to ${currentScheme === 'light' ? 'dark' : 'light'} mode`}
    >
      {currentScheme === 'light' ? '🌙' : '☀️'}
    </button>
  );
});

ThemeToggle.displayName = 'ThemeToggle';

export default {
  ColorSchemeProvider,
  ColorSchemeApplier,
  ThemeToggle,
  useColorScheme
};