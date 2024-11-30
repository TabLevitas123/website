import React, { memo, useMemo } from 'react';
import { Clock, ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';

const StateHistoryEntry = memo(({ 
  entry, 
  isSelected, 
  onClick,
  showDiff = false 
}) => {
  const getChangeTypeColor = (type) => {
    switch (type) {
      case 'update': return 'text-yellow-500';
      case 'delete': return 'text-red-500';
      case 'create': return 'text-green-500';
      default: return 'text-gray-400';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString() + '.' + date.getMilliseconds();
  };

  const getDiffPreview = (diff) => {
    if (!diff) return null;
    const changes = Object.keys(diff).length;
    return changes > 0 ? `${changes} change${changes > 1 ? 's' : ''}` : 'No changes';
  };

  return (
    <div
      className={`p-3 border-b border-gray-800 cursor-pointer transition-colors
                  ${isSelected ? 'bg-blue-900/30' : 'hover:bg-gray-800'}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-300">
            {formatTimestamp(entry.timestamp)}
          </span>
        </div>
        <span className={`text-xs ${getChangeTypeColor(entry.type)}`}>
          {entry.type.toUpperCase()}
        </span>
      </div>
      
      <div className="text-sm text-gray-400">
        {entry.componentName} • {getDiffPreview(entry.diff)}
      </div>

      {showDiff && entry.diff && (
        <div className="mt-2 text-xs font-mono bg-gray-900 rounded p-2 overflow-x-auto">
          <pre className="text-gray-300">
            {JSON.stringify(entry.diff, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
});

StateHistoryEntry.displayName = 'StateHistoryEntry';

const StateHistory = ({
  history,
  selectedIndex,
  onSelectEntry,
  onTimeTravel,
  maxEntries = 50
}) => {
  const truncatedHistory = useMemo(() => {
    return history.slice(-maxEntries);
  }, [history, maxEntries]);

  const handleTimeTravel = (direction) => {
    const newIndex = direction === 'back' 
      ? selectedIndex - 1 
      : selectedIndex + 1;
    
    if (newIndex >= 0 && newIndex < truncatedHistory.length) {
      onTimeTravel(truncatedHistory[newIndex], newIndex);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Time Travel Controls */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleTimeTravel('back')}
            disabled={selectedIndex <= 0}
            className="p-1 text-gray-400 hover:text-white disabled:opacity-50 
                     disabled:cursor-not-allowed transition-colors"
            title="Go back in time"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleTimeTravel('forward')}
            disabled={selectedIndex >= truncatedHistory.length - 1}
            className="p-1 text-gray-400 hover:text-white disabled:opacity-50 
                     disabled:cursor-not-allowed transition-colors"
            title="Go forward in time"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onTimeTravel(truncatedHistory[truncatedHistory.length - 1], truncatedHistory.length - 1)}
            className="p-1 text-gray-400 hover:text-white transition-colors"
            title="Reset to current state"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
        <span className="text-sm text-gray-400">
          {selectedIndex + 1} of {truncatedHistory.length} states
        </span>
      </div>

      {/* History List */}
      <div className="flex-1 overflow-y-auto">
        {truncatedHistory.length === 0 ? (
          <div className="p-4 text-center text-gray-400">
            No state changes recorded yet
          </div>
        ) : (
          truncatedHistory.map((entry, index) => (
            <StateHistoryEntry
              key={entry.timestamp}
              entry={entry}
              isSelected={index === selectedIndex}
              onClick={() => onSelectEntry(index)}
              showDiff={index === selectedIndex}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default memo(StateHistory);