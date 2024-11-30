import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Search, Filter, RefreshCw } from 'lucide-react';
import TreeNode from './component-tree-node';
import ComponentTreeInfo from './component-tree-info';
import { useDebugger } from '../hooks/useDebugger';
import { logger } from '../utils/logger';

const SearchBar = ({ value, onChange, onFilterChange, filterOptions }) => (
  <div className="flex items-center space-x-2 p-4 border-b border-gray-800">
    <div className="flex-1 relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search components..."
        className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
    <div className="relative">
      <select
        onChange={(e) => onFilterChange(e.target.value)}
        className="appearance-none bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Components</option>
        {filterOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
    </div>
  </div>
);

const ComponentTree = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('');
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  const [selectedNode, setSelectedNode] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const { componentTree, refreshTree, componentDetails } = useDebugger();

  // Memoized filter options based on component statistics
  const filterOptions = useMemo(() => [
    { value: 'high-renders', label: 'High Render Count' },
    { value: 'slow-renders', label: 'Slow Renders' },
    { value: 'memory-issues', label: 'Memory Issues' },
    { value: 'error-boundary', label: 'Error Boundaries' }
  ], []);

  // Handle auto-refresh
  useEffect(() => {
    let intervalId;
    if (autoRefresh) {
      intervalId = setInterval(refreshTree, 1000);
    }
    return () => clearInterval(intervalId);
  }, [autoRefresh, refreshTree]);

  // Toggle node expansion
  const handleToggle = useCallback((nodeId) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  }, []);

  // Select node for inspection
  const handleSelect = useCallback((nodeId) => {
    setSelectedNode(nodeId);
    logger.debug('Selected component for inspection:', nodeId);
  }, []);

  // Filter and search logic
  const filteredTree = useMemo(() => {
    if (!componentTree) return null;

    const filterNode = (node) => {
      // Apply search term filter
      const matchesSearch = !searchTerm || 
        node.name.toLowerCase().includes(searchTerm.toLowerCase());

      // Apply category filter
      const matchesFilter = !filter || (
        (filter === 'high-renders' && node.renderCount > 5) ||
        (filter === 'slow-renders' && node.renderTime > 16) ||
        (filter === 'memory-issues' && node.memoryUsage > 1000000) ||
        (filter === 'error-boundary' && node.isErrorBoundary)
      );

      // Recursively filter children
      const filteredChildren = node.children
        ?.map(filterNode)
        .filter(Boolean) || [];

      // Include node if it matches or has matching children
      if (matchesSearch || matchesFilter || filteredChildren.length > 0) {
        return {
          ...node,
          children: filteredChildren
        };
      }

      return null;
    };

    return filterNode(componentTree);
  }, [componentTree, searchTerm, filter]);

  if (!componentTree) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        Loading component tree...
      </div>
    );
  }

  return (
    <div className="h-full flex">
      {/* Tree View */}
      <div className="w-1/2 border-r border-gray-800 flex flex-col">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          onFilterChange={setFilter}
          filterOptions={filterOptions}
        />
        
        <div className="flex-1 overflow-y-auto p-4">
          {filteredTree && (
            <TreeNode
              node={filteredTree}
              isExpanded={expandedNodes.has(filteredTree.id)}
              onToggle={handleToggle}
              onSelect={handleSelect}
              isSelected={selectedNode === filteredTree.id}
              searchTerm={searchTerm}
            />
          )}
        </div>

        {/* Refresh Controls */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 text-sm text-gray-400">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="form-checkbox rounded bg-gray-800 border-gray-700"
              />
              <span>Auto-refresh</span>
            </label>
            <button
              onClick={refreshTree}
              className="flex items-center space-x-1 text-sm text-blue-400 hover:text-blue-300"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh Tree</span>
            </button>
          </div>
        </div>
      </div>

      {/* Component Details */}
      <div className="w-1/2 overflow-y-auto">
        <ComponentTreeInfo
          component={selectedNode ? componentDetails[selectedNode] : null}
        />
      </div>
    </div>
  );
};

export default ComponentTree;