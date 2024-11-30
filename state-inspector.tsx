import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Split, Maximize2, Minimize2, RefreshCw, Download, Settings } from 'lucide-react';
import StateHistory from './state-inspector-history';
import StateDiffViewer from './state-diff-viewer';
import StateMutationLogger from './state-mutation-logger';
import { useDebugger } from '../hooks/useDebugger';
import { logger } from '../utils/logger';

const TabButton = ({ isActive, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors
                ${isActive 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
  >
    {children}
  </button>
);

const Settings = ({ isOpen, onClose, settings, onSettingsChange }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg p-6 w-96">
        <h3 className="text-lg font-semibold text-white mb-4">Inspector Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="flex items-center justify-between text-sm text-gray-400">
              <span>Max History Size</span>
              <input
                type="number"
                value={settings.maxHistorySize}
                onChange={(e) => onSettingsChange({ 
                  ...settings, 
                  maxHistorySize: parseInt(e.target.value) 
                })}
                className="bg-gray-800 border border-gray-700 rounded px-2 py-1 w-24"
              />
            </label>
          </div>
          <div>
            <label className="flex items-center space-x-2 text-sm text-gray-400">
              <input
                type="checkbox"
                checked={settings.persistHistory}
                onChange={(e) => onSettingsChange({
                  ...settings,
                  persistHistory: e.target.checked
                })}
                className="form-checkbox rounded bg-gray-800 border-gray-700"
              />
              <span>Persist History</span>
            </label>
          </div>
          <div>
            <label className="flex items-center space-x-2 text-sm text-gray-400">
              <input
                type="checkbox"
                checked={settings.diffView}
                onChange={(e) => onSettingsChange({
                  ...settings,
                  diffView: e.target.checked
                })}
                className="form-checkbox rounded bg-gray-800 border-gray-700"
              />
              <span>Show Diff View</span>
            </label>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const StateInspector = () => {
  const [activeTab, setActiveTab] = useState('history');
  const [selectedHistoryIndex, setSelectedHistoryIndex] = useState(-1);
  const [isExpanded, setIsExpanded] = useState(false);
  const [filter, setFilter] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    maxHistorySize: 50,
    persistHistory: true,
    diffView: true
  });

  const { 
    stateHistory, 
    mutations, 
    refreshState, 
    clearHistory,
    exportData 
  } = useDebugger();

  // Handle auto-refresh
  useEffect(() => {
    let intervalId;
    if (autoRefresh) {
      intervalId = setInterval(refreshState, 1000);
    }
    return () => clearInterval(intervalId);
  }, [autoRefresh, refreshState]);

  // Memoized filtered history
  const filteredHistory = useMemo(() => {
    if (!filter) return stateHistory;
    
    return stateHistory.filter(entry => 
      entry.componentName.toLowerCase().includes(filter.toLowerCase()) ||
      JSON.stringify(entry.state).toLowerCase().includes(filter.toLowerCase())
    ).slice(-settings.maxHistorySize);
  }, [stateHistory, filter, settings.maxHistorySize]);

  // Time travel handlers
  const handleTimeTravel = useCallback((entry, index) => {
    setSelectedHistoryIndex(index);
    logger.info('Time traveled to state:', { timestamp: entry.timestamp });
  }, []);

  const handleHistorySelect = useCallback((index) => {
    setSelectedHistoryIndex(index);
  }, []);

  // Export handlers
  const handleExport = useCallback(async () => {
    try {
      const data = await exportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `state-inspector-export-${new Date().toISOString()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      logger.error('Failed to export data:', error);
    }
  }, [exportData]);

  const selectedState = selectedHistoryIndex >= 0 
    ? filteredHistory[selectedHistoryIndex] 
    : null;
  const previousState = selectedHistoryIndex > 0 
    ? filteredHistory[selectedHistoryIndex - 1] 
    : null;

  return (
    <div className={`h-full flex flex-col ${isExpanded ? 'fixed inset-0 z-50 bg-gray-900' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <TabButton
            isActive={activeTab === 'history'}
            onClick={() => setActiveTab('history')}
          >
            History
          </TabButton>
          <TabButton
            isActive={activeTab === 'mutations'}
            onClick={() => setActiveTab('mutations')}
          >
            Mutations
          </TabButton>
        </div>
        
        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter state..."
            className="bg-gray-800 border border-gray-700 rounded px-3 py-1 text-sm text-white placeholder-gray-500"
          />
          
          <button
            onClick={() => setShowSettings(true)}
            className="p-1 text-gray-400 hover:text-white"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-gray-400 hover:text-white"
            title={isExpanded ? 'Minimize' : 'Maximize'}
          >
            {isExpanded ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel */}
        <div className="w-1/2 border-r border-gray-800">
          {activeTab === 'history' ? (
            <StateHistory
              history={filteredHistory}
              selectedIndex={selectedHistoryIndex}
              onSelectEntry={handleHistorySelect}
              onTimeTravel={handleTimeTravel}
            />
          ) : (
            <StateMutationLogger
              mutations={mutations}
              onMutationSelect={(mutation) => {
                const index = filteredHistory.findIndex(
                  entry => entry.timestamp === mutation.timestamp
                );
                if (index >= 0) {
                  handleHistorySelect(index);
                }
              }}
              onClearMutations={clearHistory}
              onExportMutations={handleExport}
            />
          )}
        </div>

        {/* Right Panel */}
        <div className="w-1/2">
          {settings.diffView ? (
            <StateDiffViewer
              previousState={previousState?.state}
              currentState={selectedState?.state}
              filter={filter}
            />
          ) : (
            <div className="p-4">
              <pre className="text-sm text-gray-300 bg-gray-800 rounded-lg p-4 overflow-auto">
                {JSON.stringify(selectedState?.state, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800 flex justify-between items-center">
        <label className="flex items-center space-x-2 text-sm text-gray-400">
          <input
            type="checkbox"
            checked={autoRefresh}
            onChange={(e) => setAutoRefresh(e.target.checked)}
            className="form-checkbox rounded bg-gray-800 border-gray-700"
          />
          <span>Auto-refresh</span>
        </label>

        <div className="flex items-center space-x-4">
          <button
            onClick={refreshState}
            className="flex items-center space-x-1 text-sm text-gray-400 hover:text-white"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleExport}
            className="flex items-center space-x-1 text-sm text-gray-400 hover:text-white"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Settings Modal */}
      <Settings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onSettingsChange={setSettings}
      />
    </div>
  );
};

export default StateInspector;