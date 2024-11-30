import React, { memo, useState, useCallback, useRef, useEffect } from 'react';
import { Search, Filter, X, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
import { logger } from '../utils/logger';

const FilterButton = memo(({ 
  label, 
  count, 
  isActive, 
  onClick,
  className = ''
}) => (
  <button
    onClick={onClick}
    className={`px-3 py-1 rounded-full text-sm transition-colors
                ${isActive 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'}
                ${className}`}
  >
    {label}
    {count > 0 && (
      <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-gray-800">
        {count}
      </span>
    )}
  </button>
));

FilterButton.displayName = 'FilterButton';

const FilterDropdown = memo(({ 
  label, 
  options, 
  value, 
  onChange,
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleClickOutside = useCallback((event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 px-3 py-1 rounded-lg
                   text-gray-400 hover:text-white hover:bg-gray-800
                   transition-colors"
      >
        <span>{label}</span>
        {isOpen ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-48 bg-gray-800 rounded-lg shadow-lg 
                      border border-gray-700 py-1">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm
                         ${option.value === value
                           ? 'bg-blue-600 text-white'
                           : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                         }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
});

FilterDropdown.displayName = 'FilterDropdown';

const NetworkMonitorFilters = ({
  textFilter,
  onTextFilterChange,
  statusFilter,
  onStatusFilterChange,
  typeFilter,
  onTypeFilterChange,
  methodFilter,
  onMethodFilterChange,
  requestCounts,
  onRefresh,
  onClearFilters,
  className = ''
}) => {
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'success', label: 'Success' },
    { value: 'error', label: 'Error' },
    { value: 'pending', label: 'Pending' }
  ];

  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'xhr', label: 'XHR' },
    { value: 'fetch', label: 'Fetch' },
    { value: 'websocket', label: 'WebSocket' },
    { value: 'other', label: 'Other' }
  ];

  const methodOptions = [
    { value: 'all', label: 'All Methods' },
    { value: 'GET', label: 'GET' },
    { value: 'POST', label: 'POST' },
    { value: 'PUT', label: 'PUT' },
    { value: 'DELETE', label: 'DELETE' },
    { value: 'PATCH', label: 'PATCH' }
  ];

  const handleTextFilterChange = useCallback((e) => {
    const value = e.target.value;
    onTextFilterChange(value);
    logger.debug('Text filter changed:', value);
  }, [onTextFilterChange]);

  const handleStatusFilterChange = useCallback((value) => {
    onStatusFilterChange(value);
    logger.debug('Status filter changed:', value);
  }, [onStatusFilterChange]);

  const handleTypeFilterChange = useCallback((value) => {
    onTypeFilterChange(value);
    logger.debug('Type filter changed:', value);
  }, [onTypeFilterChange]);

  const handleMethodFilterChange = useCallback((value) => {
    onMethodFilterChange(value);
    logger.debug('Method filter changed:', value);
  }, [onMethodFilterChange]);

  const handleClearFilters = useCallback(() => {
    onTextFilterChange('');
    onStatusFilterChange('all');
    onTypeFilterChange('all');
    onMethodFilterChange('all');
    logger.debug('Filters cleared');
  }, [onTextFilterChange, onStatusFilterChange, onTypeFilterChange, onMethodFilterChange]);

  const hasActiveFilters = textFilter || 
    statusFilter !== 'all' || 
    typeFilter !== 'all' ||
    methodFilter !== 'all';

  return (
    <div className={`bg-gray-900 border-b border-gray-800 p-4 ${className}`}>
      <div className="flex items-center space-x-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 
                           w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={textFilter}
            onChange={handleTextFilterChange}
            placeholder="Filter requests..."
            className="w-full bg-gray-800 border border-gray-700 rounded-lg 
                     pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {textFilter && (
            <button
              onClick={() => onTextFilterChange('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2
                       text-gray-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Status Filter */}
        <FilterDropdown
          label={statusOptions.find(o => o.value === statusFilter)?.label}
          options={statusOptions.map(o => ({
            ...o,
            label: `${o.label} (${requestCounts[o.value] || 0})`
          }))}
          value={statusFilter}
          onChange={handleStatusFilterChange}
        />

        {/* Type Filter */}
        <FilterDropdown
          label={typeOptions.find(o => o.value === typeFilter)?.label}
          options={typeOptions.map(o => ({
            ...o,
            label: `${o.label} (${requestCounts[`type_${o.value}`] || 0})`
          }))}
          value={typeFilter}
          onChange={handleTypeFilterChange}
        />

        {/* Method Filter */}
        <FilterDropdown
          label={methodOptions.find(o => o.value === methodFilter)?.label}
          options={methodOptions.map(o => ({
            ...o,
            label: `${o.label} (${requestCounts[`method_${o.value}`] || 0})`
          }))}
          value={methodFilter}
          onChange={handleMethodFilterChange}
        />

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="text-gray-400 hover:text-white px-3 py-1 rounded-lg
                       hover:bg-gray-800 transition-colors text-sm"
            >
              Clear Filters
            </button>
          )}
          
          <button
            onClick={onRefresh}
            className="p-2 text-gray-400 hover:text-white rounded-lg
                     hover:bg-gray-800 transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(NetworkMonitorFilters);