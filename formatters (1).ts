import { logger } from '@/utils/logger';

/**
 * Formats a number with commas as thousand separators
 * @param value - Number to format
 * @returns Formatted string
 */
export const formatNumber = (value: number): string => {
  try {
    return new Intl.NumberFormat('en-US').format(value);
  } catch (error) {
    logger.error('Error formatting number:', error);
    return String(value);
  }
};

/**
 * Formats a currency value with ETH symbol and precision
 * @param value - Currency amount to format
 * @param precision - Number of decimal places (default: 2)
 * @returns Formatted currency string
 */
export const formatCurrency = (value: number, precision: number = 2): string => {
  try {
    const formattedValue = value.toFixed(precision);
    return `${formattedValue}`;
  } catch (error) {
    logger.error('Error formatting currency:', error);
    return String(value);
  }
};

/**
 * Formats a percentage value
 * @param value - Percentage to format
 * @param precision - Number of decimal places (default: 1)
 * @returns Formatted percentage string
 */
export const formatPercentage = (value: number, precision: number = 1): string => {
  try {
    return `${value.toFixed(precision)}%`;
  } catch (error) {
    logger.error('Error formatting percentage:', error);
    return `${value}%`;
  }
};

/**
 * Formats a date to local string
 * @param date - Date to format
 * @returns Formatted date string
 */
export const formatDate = (date: Date | string): string => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    logger.error('Error formatting date:', error);
    return String(date);
  }
};

/**
 * Formats a time duration in milliseconds to human readable string
 * @param ms - Duration in milliseconds
 * @returns Formatted duration string
 */
export const formatDuration = (ms: number): string => {
  try {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}m ${seconds}s`;
  } catch (error) {
    logger.error('Error formatting duration:', error);
    return `${ms}ms`;
  }
};

/**
 * Formats a file size in bytes to human readable string
 * @param bytes - Size in bytes
 * @returns Formatted size string
 */
export const formatFileSize = (bytes: number): string => {
  try {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  } catch (error) {
    logger.error('Error formatting file size:', error);
    return `${bytes} B`;
  }
};

/**
 * Truncates text with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text
 */
export const truncateText = (text: string, maxLength: number): string => {
  try {
    if (text.length <= maxLength) return text;
    return `${text.slice(0, maxLength)}...`;
  } catch (error) {
    logger.error('Error truncating text:', error);
    return text;
  }
};