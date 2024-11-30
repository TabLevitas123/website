import React, { memo, useMemo } from 'react';
import { 
  Clock, 
  Activity, 
  Download, 
  Upload, 
  Database,
  Server 
} from 'lucide-react';

const TimelinePhase = memo(({ 
  label, 
  duration, 
  startPosition, 
  width, 
  type,
  isSelected,
  onSelect 
}) => {
  const getPhaseColor = () => {
    switch (type) {
      case 'dns':
        return 'bg-purple-500 group-hover:bg-purple-400';
      case 'connecting':
        return 'bg-blue-500 group-hover:bg-blue-400';
      case 'ssl':
        return 'bg-green-500 group-hover:bg-green-400';
      case 'sending':
        return 'bg-yellow-500 group-hover:bg-yellow-400';
      case 'waiting':
        return 'bg-orange-500 group-hover:bg-orange-400';
      case 'receiving':
        return 'bg-red-500 group-hover:bg-red-400';
      default:
        return 'bg-gray-500 group-hover:bg-gray-400';
    }
  };

  return (
    <div
      className={`absolute h-6 ${getPhaseColor()} rounded cursor-pointer
                  transition-all duration-150 group
                  ${isSelected ? 'ring-2 ring-blue-400 z-10' : ''}`}
      style={{
        left: `${startPosition}%`,
        width: `${width}%`
      }}
      onClick={onSelect}
    >
      <div className="absolute -bottom-8 left-0 whitespace-nowrap text-xs opacity-0 
                    group-hover:opacity-100 transition-opacity bg-gray-800 
                    rounded px-2 py-1">
        {label}: {duration.toFixed(2)}ms
      </div>
    </div>
  );
});

TimelinePhase.displayName = 'TimelinePhase';

const TimelineScale = memo(({ duration }) => {
  const scalePoints = useMemo(() => {
    const points = [];
    const step = Math.ceil(duration / 10);
    for (let i = 0; i <= duration; i += step) {
      points.push(i);
    }
    return points;
  }, [duration]);

  return (
    <div className="h-8 relative border-l border-r border-gray-700">
      {scalePoints.map((point) => (
        <div
          key={point}
          className="absolute h-full border-l border-gray-700 flex items-center"
          style={{ left: `${(point / duration) * 100}%` }}
        >
          <span className="text-xs text-gray-500 ml-1">{point}ms</span>
        </div>
      ))}
    </div>
  );
});

TimelineScale.displayName = 'TimelineScale';

const MetricCard = memo(({ icon: Icon, label, value, trend }) => (
  <div className="bg-gray-800 rounded-lg p-4">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center space-x-2">
        <Icon className="w-4 h-4 text-gray-400" />
        <span className="text-sm text-gray-400">{label}</span>
      </div>
      {trend && (
        <span className={trend > 0 ? 'text-green-400' : 'text-red-400'}>
          {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </span>
      )}
    </div>
    <div className="text-2xl font-semibold text-white">{value}</div>
  </div>
));

MetricCard.displayName = 'MetricCard';

const NetworkDetailsTimeline = ({ request }) => {
  const [selectedPhase, setSelectedPhase] = React.useState(null);

  const phases = useMemo(() => {
    const { timing } = request;
    if (!timing) return [];

    let startTime = 0;
    const phases = [];
    const totalDuration = request.duration;

    // DNS Lookup
    if (timing.dns > 0) {
      phases.push({
        type: 'dns',
        label: 'DNS Lookup',
        duration: timing.dns,
        startPosition: (startTime / totalDuration) * 100,
        width: (timing.dns / totalDuration) * 100
      });
      startTime += timing.dns;
    }

    // Initial Connection
    if (timing.connecting > 0) {
      phases.push({
        type: 'connecting',
        label: 'Initial Connection',
        duration: timing.connecting,
        startPosition: (startTime / totalDuration) * 100,
        width: (timing.connecting / totalDuration) * 100
      });
      startTime += timing.connecting;
    }

    // SSL Handshake
    if (timing.ssl > 0) {
      phases.push({
        type: 'ssl',
        label: 'SSL Handshake',
        duration: timing.ssl,
        startPosition: (startTime / totalDuration) * 100,
        width: (timing.ssl / totalDuration) * 100
      });
      startTime += timing.ssl;
    }

    // Sending Request
    if (timing.sending > 0) {
      phases.push({
        type: 'sending',
        label: 'Sending Request',
        duration: timing.sending,
        startPosition: (startTime / totalDuration) * 100,
        width: (timing.sending / totalDuration) * 100
      });
      startTime += timing.sending;
    }

    // Waiting (TTFB)
    if (timing.waiting > 0) {
      phases.push({
        type: 'waiting',
        label: 'Waiting (TTFB)',
        duration: timing.waiting,
        startPosition: (startTime / totalDuration) * 100,
        width: (timing.waiting / totalDuration) * 100
      });
      startTime += timing.waiting;
    }

    // Receiving Response
    if (timing.receiving > 0) {
      phases.push({
        type: 'receiving',
        label: 'Receiving Response',
        duration: timing.receiving,
        startPosition: (startTime / totalDuration) * 100,
        width: (timing.receiving / totalDuration) * 100
      });
    }

    return phases;
  }, [request]);

  return (
    <div className="space-y-6">
      {/* Performance Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <MetricCard
          icon={Clock}
          label="Total Duration"
          value={`${request.duration}ms`}
        />
        <MetricCard
          icon={Activity}
          label="TTFB"
          value={`${request.timing?.waiting || 0}ms`}
        />
        <MetricCard
          icon={Download}
          label="Download Size"
          value={`${(request.size / 1024).toFixed(1)}KB`}
        />
        <MetricCard
          icon={Upload}
          label="Upload Size"
          value={`${(request.requestSize / 1024).toFixed(1)}KB`}
        />
      </div>

      {/* Timeline Visualization */}
      <div className="bg-gray-900 rounded-lg p-6">
        <h3 className="text-sm font-medium text-gray-400 mb-4">
          Request Timeline
        </h3>

        {/* Scale */}
        <TimelineScale duration={request.duration} />

        {/* Phases */}
        <div className="relative h-6 mt-4">
          {phases.map((phase, index) => (
            <TimelinePhase
              key={index}
              {...phase}
              isSelected={selectedPhase === index}
              onSelect={() => setSelectedPhase(index)}
            />
          ))}
        </div>

        {/* Phase Details */}
        {selectedPhase !== null && (
          <div className="mt-8 p-4 bg-gray-800 rounded-lg">
            <h4 className="text-sm font-medium text-white mb-2">
              {phases[selectedPhase].label}
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-sm">
                <span className="text-gray-400">Duration: </span>
                <span className="text-white">
                  {phases[selectedPhase].duration.toFixed(2)}ms
                </span>
              </div>
              <div className="text-sm">
                <span className="text-gray-400">Start Time: </span>
                <span className="text-white">
                  {(phases[selectedPhase].startPosition * 
                    request.duration / 100).toFixed(2)}ms
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(NetworkDetailsTimeline);