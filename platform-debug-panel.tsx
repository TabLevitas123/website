import React, { useState, useEffect } from 'react';
import { 
  Layout, 
  Code, 
  Activity,
  Network,
  TreeStructure,
  Database,
  Settings,
  X
} from 'lucide-react';

const Tab = ({ icon: Icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all
                ${isActive 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
  >
    <Icon className="w-4 h-4" />
    <span>{label}</span>
  </button>
);

const DebugPanel = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('components');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [metrics, setMetrics] = useState({
    componentCount: 0,
    renderCount: 0,
    networkRequests: 0,
    stateUpdates: 0
  });

  // Update metrics periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        renderCount: prev.renderCount + 1
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const tabs = [
    { id: 'components', label: 'Components', icon: TreeStructure },
    { id: 'state', label: 'State', icon: Database },
    { id: 'network', label: 'Network', icon: Network },
    { id: 'console', label: 'Console', icon: Code },
    { id: 'performance', label: 'Performance', icon: Activity }
  ];

  return (
    <div className={`fixed ${isCollapsed ? 'right-0 w-12' : 'right-0 w-96'} 
                    h-screen bg-gray-900 border-l border-gray-800 
                    transition-all duration-300 z-50`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <Layout className="w-5 h-5 text-blue-400" />
          <h2 className={`font-semibold text-white ${isCollapsed ? 'hidden' : ''}`}>
            Debug Tools
          </h2>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 text-gray-400 hover:text-white transition-colors"
          >
            {isCollapsed ? '→' : '←'}
          </button>
          {!isCollapsed && (
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {!isCollapsed && (
        <>
          {/* Tabs */}
          <div className="flex space-x-2 p-4 border-b border-gray-800 overflow-x-auto">
            {tabs.map(tab => (
              <Tab
                key={tab.id}
                icon={tab.icon}
                label={tab.label}
                isActive={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
              />
            ))}
          </div>

          {/* Metrics Bar */}
          <div className="grid grid-cols-2 gap-4 p-4 border-b border-gray-800">
            <div className="text-center">
              <div className="text-sm text-gray-400">Components</div>
              <div className="text-xl font-semibold text-blue-400">
                {metrics.componentCount}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-400">Renders</div>
              <div className="text-xl font-semibold text-green-400">
                {metrics.renderCount}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-400">Network</div>
              <div className="text-xl font-semibold text-purple-400">
                {metrics.networkRequests}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-400">State Updates</div>
              <div className="text-xl font-semibold text-yellow-400">
                {metrics.stateUpdates}
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-4 overflow-y-auto" style={{ height: 'calc(100vh - 200px)' }}>
            {activeTab === 'components' && <ComponentTree />}
            {activeTab === 'state' && <StateInspector />}
            {activeTab === 'network' && <NetworkMonitor />}
            {activeTab === 'console' && <ConsoleViewer />}
            {activeTab === 'performance' && <PerformanceProfiler />}
          </div>

          {/* Settings Bar */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
            <button className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
              <Settings className="w-4 h-4" />
              <span>Debug Settings</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default DebugPanel;