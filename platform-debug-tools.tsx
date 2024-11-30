import React from 'react';
import { ComponentTree } from './debug/ComponentTree';
import { StateInspector } from './debug/StateInspector';
import { NetworkMonitor } from './debug/NetworkMonitor';
import { ConsoleViewer } from './debug/ConsoleViewer';
import { PerformanceProfiler } from './debug/PerformanceProfiler';

const DebugTools = ({ activeTab }) => {
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'components':
        return <ComponentTree />;
      case 'state':
        return <StateInspector />;
      case 'network':
        return <NetworkMonitor />;
      case 'console':
        return <ConsoleViewer />;
      case 'performance':
        return <PerformanceProfiler />;
      default:
        return null;
    }
  };

  return (
    <div className="h-full overflow-hidden">
      {renderActiveTab()}
    </div>
  );
};

export default DebugTools;