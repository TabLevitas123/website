import React, { memo } from 'react';
import { 
  Clock, 
  Database, 
  Copy, 
  PlayCircle, 
  Download, 
  Share2,
  ExternalLink 
} from 'lucide-react';
import { logger } from '../utils/logger';

const HeaderAction = memo(({ icon: Icon, label, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-sm
                ${disabled 
                  ? 'text-gray-600 cursor-not-allowed' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
  >
    <Icon className="w-4 h-4" />
    <span>{label}</span>
  </button>
));

HeaderAction.displayName = 'HeaderAction';

const StatusBadge = memo(({ status, duration }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'success': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      case 'timeout': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
      <span className="text-sm text-gray-300">
        {status.toUpperCase()} ({duration}ms)
      </span>
    </div>
  );
});

StatusBadge.displayName = 'StatusBadge';

const NetworkDetailsHeader = ({
  request,
  onCopy,
  onReplay,
  onDownload,
  onShare
}) => {
  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(request.url);
      logger.info('URL copied to clipboard');
    } catch (error) {
      logger.error('Failed to copy URL:', error);
    }
  };

  const handleOpenInNewTab = () => {
    window.open(request.url, '_blank');
  };

  const getMethodColor = (method) => {
    const colors = {
      GET: 'text-blue-500',
      POST: 'text-green-500',
      PUT: 'text-yellow-500',
      DELETE: 'text-red-500'
    };
    return colors[method.toUpperCase()] || 'text-gray-500';
  };

  return (
    <div className="border-b border-gray-800">
      {/* Main Header */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <span className={`text-lg font-semibold ${getMethodColor(request.method)}`}>
              {request.method}
            </span>
            <StatusBadge 
              status={request.status} 
              duration={request.duration} 
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <HeaderAction
              icon={Copy}
              label="Copy URL"
              onClick={handleCopyUrl}
            />
            <HeaderAction
              icon={PlayCircle}
              label="Replay"
              onClick={() => onReplay(request)}
            />
            <HeaderAction
              icon={Download}
              label="Download"
              onClick={() => onDownload(request)}
            />
            <HeaderAction
              icon={Share2}
              label="Share"
              onClick={() => onShare(request)}
            />
            <HeaderAction
              icon={ExternalLink}
              label="Open"
              onClick={handleOpenInNewTab}
            />
          </div>
        </div>

        <div className="flex items-center space-x-1 text-gray-400">
          <span className="text-sm truncate">{request.url}</span>
        </div>
      </div>

      {/* Request Stats */}
      <div className="flex items-center px-4 py-2 bg-gray-900/50 text-sm">
        <div className="flex items-center space-x-4 text-gray-400">
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>Started: {new Date(request.timestamp).toLocaleTimeString()}</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <Database className="w-4 h-4" />
            <span>
              Size: {request.size} bytes
              {request.compressedSize && ` (${request.compressedSize} compressed)`}
            </span>
          </div>

          {request.cache && (
            <div className="text-blue-400">
              Served from cache
            </div>
          )}

          {request.error && (
            <div className="text-red-400">
              {request.error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(NetworkDetailsHeader);