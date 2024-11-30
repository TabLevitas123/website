import React, { memo } from 'react';
import { ChevronRight, ChevronDown, Circle, AlertCircle, Clock, Zap } from 'lucide-react';

const MetricBadge = ({ icon: Icon, value, label, className }) => (
  <div className={`flex items-center space-x-1 text-xs ${className}`}>
    <Icon className="w-3 h-3" />
    <span title={label}>{value}</span>
  </div>
);

const TreeNode = memo(({ 
  node, 
  depth = 0, 
  isExpanded, 
  onToggle,
  onSelect,
  isSelected,
  searchTerm = ''
}) => {
  const {
    id,
    name,
    renderCount = 0,
    renderTime = 0,
    memoryUsage = 0,
    children = []
  } = node;

  const hasChildren = children && children.length > 0;
  const isHighlighted = searchTerm && 
    name.toLowerCase().includes(searchTerm.toLowerCase());
  const hasPerformanceIssue = renderCount > 5 || renderTime > 16;

  const getNodeStyles = () => {
    let styles = 'flex items-center hover:bg-gray-800 rounded px-2 py-1 cursor-pointer ';
    if (isSelected) styles += 'bg-blue-900/30 ';
    if (isHighlighted) styles += 'ring-1 ring-yellow-500 ';
    return styles;
  };

  const handleClick = (e) => {
    e.stopPropagation();
    if (hasChildren) {
      onToggle(id);
    }
    onSelect(id);
  };

  return (
    <div className="font-mono">
      <div
        className={getNodeStyles()}
        style={{ paddingLeft: `${depth * 20}px` }}
        onClick={handleClick}
      >
        {/* Expand/Collapse Icon */}
        <div className="w-4 h-4 flex items-center justify-center">
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-400" />
            )
          ) : (
            <Circle className="w-2 h-2 text-gray-500" />
          )}
        </div>

        {/* Component Name */}
        <span className={`ml-2 text-sm ${
          isHighlighted ? 'text-yellow-400' : 'text-gray-300'
        }`}>
          {name}
        </span>

        {/* Performance Metrics */}
        <div className="ml-auto flex items-center space-x-3">
          {renderCount > 0 && (
            <MetricBadge
              icon={Clock}
              value={renderCount}
              label="Render count"
              className={renderCount > 5 ? 'text-yellow-500' : 'text-gray-500'}
            />
          )}
          
          {renderTime > 0 && (
            <MetricBadge
              icon={Zap}
              value={`${renderTime.toFixed(1)}ms`}
              label="Render time"
              className={renderTime > 16 ? 'text-red-500' : 'text-gray-500'}
            />
          )}

          {hasPerformanceIssue && (
            <AlertCircle 
              className="w-4 h-4 text-yellow-500" 
              title="Performance issue detected"
            />
          )}
        </div>
      </div>

      {/* Child Nodes */}
      {isExpanded && hasChildren && (
        <div className="pl-4">
          {children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              isExpanded={child.isExpanded}
              onToggle={onToggle}
              onSelect={onSelect}
              isSelected={child.id === isSelected}
              searchTerm={searchTerm}
            />
          ))}
        </div>
      )}
    </div>
  );
});

TreeNode.displayName = 'TreeNode';

export default TreeNode;