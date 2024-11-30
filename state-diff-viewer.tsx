import React, { memo } from 'react';
import { Plus, Minus, ArrowRight } from 'lucide-react';

const DiffLine = memo(({ type, value, depth = 0 }) => {
  const getLineStyle = () => {
    switch (type) {
      case 'added':
        return 'bg-green-900/30 text-green-400';
      case 'removed':
        return 'bg-red-900/30 text-red-400';
      case 'modified':
        return 'bg-yellow-900/30 text-yellow-400';
      default:
        return 'text-gray-400';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'added':
        return <Plus className="w-4 h-4 text-green-500" />;
      case 'removed':
        return <Minus className="w-4 h-4 text-red-500" />;
      case 'modified':
        return <ArrowRight className="w-4 h-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  return (
    <div className={`flex items-center py-1 px-2 ${getLineStyle()}`}>
      <div className="w-6 flex justify-center">
        {getIcon()}
      </div>
      <pre
        className="flex-1 font-mono text-sm overflow-x-auto"
        style={{ paddingLeft: `${depth * 16}px` }}
      >
        {value}
      </pre>
    </div>
  );
});

DiffLine.displayName = 'DiffLine';

const ObjectDiff = memo(({ 
  previous, 
  current, 
  path = [], 
  depth = 0 
}) => {
  const getDiffLines = () => {
    const lines = [];
    const allKeys = new Set([
      ...Object.keys(previous || {}),
      ...Object.keys(current || {})
    ]);

    for (const key of allKeys) {
      const prevValue = previous?.[key];
      const currValue = current?.[key];
      const currentPath = [...path, key];

      if (!(key in previous)) {
        // Added key
        lines.push({
          type: 'added',
          path: currentPath,
          value: `${key}: ${JSON.stringify(currValue)}`,
          depth
        });
      } else if (!(key in current)) {
        // Removed key
        lines.push({
          type: 'removed',
          path: currentPath,
          value: `${key}: ${JSON.stringify(prevValue)}`,
          depth
        });
      } else if (typeof prevValue === 'object' && typeof currValue === 'object') {
        // Nested object comparison
        lines.push({
          type: 'unchanged',
          path: currentPath,
          value: `${key}: {`,
          depth
        });
        lines.push(
          ...getDiffLines(prevValue, currValue, currentPath, depth + 1)
        );
        lines.push({
          type: 'unchanged',
          path: currentPath,
          value: '}',
          depth
        });
      } else if (prevValue !== currValue) {
        // Modified value
        lines.push({
          type: 'modified',
          path: currentPath,
          value: `${key}: ${JSON.stringify(prevValue)} → ${JSON.stringify(currValue)}`,
          depth
        });
      }
    }

    return lines;
  };

  const diffLines = getDiffLines();

  return (
    <div className="font-mono text-sm">
      {diffLines.map((line, index) => (
        <DiffLine
          key={`${line.path.join('.')}-${index}`}
          type={line.type}
          value={line.value}
          depth={line.depth}
        />
      ))}
    </div>
  );
});

ObjectDiff.displayName = 'ObjectDiff';

const StateDiffViewer = ({ 
  previousState, 
  currentState,
  filter = '',
  expandedPaths = new Set()
}) => {
  const filterState = (state) => {
    if (!filter) return state;
    
    const filterObject = (obj) => {
      if (typeof obj !== 'object' || obj === null) return obj;
      
      const result = {};
      for (const [key, value] of Object.entries(obj)) {
        if (key.toLowerCase().includes(filter.toLowerCase())) {
          result[key] = value;
        } else if (typeof value === 'object') {
          const filteredValue = filterObject(value);
          if (Object.keys(filteredValue).length > 0) {
            result[key] = filteredValue;
          }
        }
      }
      return result;
    };

    return filterObject(state);
  };

  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden">
      <div className="border-b border-gray-800 p-4">
        <h3 className="text-sm font-semibold text-gray-300">State Changes</h3>
      </div>
      <div className="p-4 overflow-x-auto">
        {previousState && currentState ? (
          <ObjectDiff
            previous={filterState(previousState)}
            current={filterState(currentState)}
          />
        ) : (
          <div className="text-center text-gray-400">
            Select a state change to view differences
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(StateDiffViewer);