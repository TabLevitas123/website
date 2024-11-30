import React, { memo } from 'react';
import { Clock, Cpu, Memory, RotateCw, GitCommit, Code } from 'lucide-react';

const MetricCard = ({ icon: Icon, label, value, trend, alert }) => (
  <div className={`bg-gray-800 rounded p-3 ${
    alert ? 'border-l-2 border-yellow-500' : ''
  }`}>
    <div className="flex items-center justify-between mb-1">
      <div className="flex items-center space-x-2">
        <Icon className="w-4 h-4 text-gray-400" />
        <span className="text-xs text-gray-400">{label}</span>
      </div>
      {trend && (
        <span className={`text-xs ${
          trend > 0 ? 'text-green-400' : 'text-red-400'
        }`}>
          {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </span>
      )}
    </div>
    <div className="text-lg font-semibold text-white">{value}</div>
  </div>
);

const PropsTable = memo(({ props }) => (
  <div className="mt-4">
    <h4 className="text-sm font-semibold text-gray-400 mb-2">Props</h4>
    <div className="bg-gray-800 rounded overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-900">
            <th className="px-4 py-2 text-left text-gray-400">Name</th>
            <th className="px-4 py-2 text-left text-gray-400">Type</th>
            <th className="px-4 py-2 text-left text-gray-400">Value</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(props).map(([key, value]) => (
            <tr key={key} className="border-t border-gray-700">
              <td className="px-4 py-2 text-blue-400">{key}</td>
              <td className="px-4 py-2 text-purple-400">
                {typeof value}
              </td>
              <td className="px-4 py-2 text-gray-300">
                {typeof value === 'object' 
                  ? JSON.stringify(value)
                  : String(value)
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
));

PropsTable.displayName = 'PropsTable';

const StateTable = memo(({ state }) => (
  <div className="mt-4">
    <h4 className="text-sm font-semibold text-gray-400 mb-2">State</h4>
    <div className="bg-gray-800 rounded p-4">
      <pre className="text-sm text-gray-300 overflow-x-auto">
        {JSON.stringify(state, null, 2)}
      </pre>
    </div>
  </div>
));

StateTable.displayName = 'StateTable';

const ComponentTreeInfo = ({ 
  component,
  renderHistory = [],
  onInspectSource
}) => {
  if (!component) {
    return (
      <div className="p-4 text-center text-gray-400">
        Select a component to view details
      </div>
    );
  }

  const {
    name,
    renderCount,
    renderTime,
    memoryUsage,
    props,
    state,
    source,
    lastUpdate
  } = component;

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-2">{name}</h3>
        <div className="text-sm text-gray-400">
          Last updated: {new Date(lastUpdate).toLocaleTimeString()}
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <MetricCard
          icon={Clock}
          label="Render Count"
          value={renderCount}
          alert={renderCount > 5}
        />
        <MetricCard
          icon={RotateCw}
          label="Render Time"
          value={`${renderTime.toFixed(1)}ms`}
          alert={renderTime > 16}
        />
        <MetricCard
          icon={Memory}
          label="Memory Usage"
          value={`${(memoryUsage / 1024).toFixed(1)}KB`}
        />
        <MetricCard
          icon={Cpu}
          label="Updates/sec"
          value={(renderCount / (Date.now() - lastUpdate) * 1000).toFixed(1)}
        />
      </div>

      {/* Render History Chart */}
      {renderHistory.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-semibold text-gray-400 mb-2">
            Render History
          </h4>
          <div className="h-32 bg-gray-800 rounded p-4">
            {/* Implement chart visualization here */}
          </div>
        </div>
      )}

      {/* Props & State */}
      {props && <PropsTable props={props} />}
      {state && <StateTable state={state} />}

      {/* Source Code */}
      {source && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-gray-400">
              Source Code
            </h4>
            <button
              onClick={onInspectSource}
              className="flex items-center space-x-1 text-sm text-blue-400 
                       hover:text-blue-300 transition-colors"
            >
              <Code className="w-4 h-4" />
              <span>View Source</span>
            </button>
          </div>
          <div className="bg-gray-800 rounded p-4">
            <pre className="text-sm text-gray-300 overflow-x-auto">
              {source}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(ComponentTreeInfo);