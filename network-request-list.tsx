import React, { memo, useMemo } from 'react';
import { 
  ArrowDown, ArrowUp, Clock, Database, AlertCircle, 
  CheckCircle, Timer, FileText, Trash2, Download 
} from 'lucide-react';

const RequestStatus = {
  SUCCESS: 'success',
  ERROR: 'error',
  PENDING: 'pending',
  TIMEOUT: 'timeout'
};

const StatusIndicator = memo(({ status }) => {
  const statusConfig = {
    [RequestStatus.SUCCESS]: { color: 'text-green-500', Icon: CheckCircle },
    [RequestStatus.ERROR]: { color: 'text-red-500', Icon: AlertCircle },
    [RequestStatus.TIMEOUT]: { color: 'text-yellow-500', Icon: Timer },
    [RequestStatus.PENDING]: { color: 'text-gray-500', Icon: Clock }
  };

  const config = statusConfig[status] || statusConfig[RequestStatus.PENDING];
  const { color, Icon } = config;

  return (
    <div className={`flex items-center ${color}`}>
      <Icon className="w-4 h-4" />
      <span className="ml-2 text-xs capitalize">{status}</span>
    </div>
  );
});

StatusIndicator.displayName = 'StatusIndicator';

const RequestRow = memo(({ 
  request, 
  isSelected, 
  onClick,
  onReplay 
}) => {
  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const formatDuration = (ms) => {
    if (ms < 1000) return `${ms.toFixed(0)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const methodColors = {
    GET: 'text-blue-500',
    POST: 'text-green-500',
    PUT: 'text-yellow-500',
    DELETE: 'text-red-500'
  };

  return (
    <div
      onClick={onClick}
      className={`group flex items-center p-3 border-b border-gray-800 cursor-pointer
                  hover:bg-gray-800 transition-colors duration-150 ${
                    isSelected ? 'bg-blue-900/30' : ''
                  }`}
    >
      <div className="flex-1 min-w-0 flex items-center space-x-4">
        <StatusIndicator status={request.status} />
        
        <span className={`text-sm font-medium ${
          methodColors[request.method] || 'text-gray-500'
        }`}>
          {request.method}
        </span>
        
        <div className="flex-1 min-w-0">
          <div className="text-sm text-gray-300 truncate">
            {request.url}
          </div>
          <div className="text-xs text-gray-500">
            {new Date(request.timestamp).toLocaleTimeString()}
          </div>
        </div>

        <div className="flex items-center space-x-4 text-xs text-gray-400">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {formatDuration(request.duration)}
          </div>
          
          <div className="flex items-center">
            <Database className="w-4 h-4 mr-1" />
            {formatSize(request.size)}
          </div>

          <div className="flex items-center">
            <FileText className="w-4 h-4 mr-1" />
            {request.type}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="ml-4 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onReplay(request);
          }}
          className="p-1 text-gray-400 hover:text-white transition-colors"
          title="Replay request"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
        {request.status === RequestStatus.ERROR && (
          <div className="text-red-500 text-xs">
            {request.error || 'Request failed'}
          </div>
        )}
      </div>
    </div>
  );
});

RequestRow.displayName = 'RequestRow';

const SortableHeader = memo(({ 
  field, 
  currentSort, 
  currentOrder, 
  onSort, 
  children 
}) => {
  const isActive = currentSort === field;
  
  return (
    <div
      onClick={() => onSort(field)}
      className={`flex items-center space-x-1 cursor-pointer transition-colors
                 ${isActive ? 'text-white' : 'text-gray-400 hover:text-white'}`}
    >
      <span>{children}</span>
      {isActive && (
        currentOrder === 'asc' 
          ? <ArrowUp className="w-4 h-4" />
          : <ArrowDown className="w-4 h-4" />
      )}
    </div>
  );
});

SortableHeader.displayName = 'SortableHeader';

const NetworkRequestList = ({
  requests,
  selectedRequest,
  onRequestSelect,
  onRequestReplay,
  onClearRequests,
  onExportRequests,
  sortBy,
  sortOrder,
  onSort
}) => {
  const sortedRequests = useMemo(() => {
    return [...requests].sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      const order = sortOrder === 'asc' ? 1 : -1;
      return (aValue < bValue ? -1 : 1) * order;
    });
  }, [requests, sortBy, sortOrder]);

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      {/* Headers */}
      <div className="flex items-center p-3 border-b border-gray-800 bg-gray-900">
        <div className="flex-1 flex items-center space-x-8">
          <SortableHeader
            field="status"
            currentSort={sortBy}
            currentOrder={sortOrder}
            onSort={onSort}
          >
            Status
          </SortableHeader>
          
          <SortableHeader
            field="method"
            currentSort={sortBy}
            currentOrder={sortOrder}
            onSort={onSort}
          >
            Method
          </SortableHeader>
          
          <SortableHeader
            field="url"
            currentSort={sortBy}
            currentOrder={sortOrder}
            onSort={onSort}
          >
            URL
          </SortableHeader>
          
          <SortableHeader
            field="duration"
            currentSort={sortBy}
            currentOrder={sortOrder}
            onSort={onSort}
          >
            Duration
          </SortableHeader>
          
          <SortableHeader
            field="size"
            currentSort={sortBy}
            currentOrder={sortOrder}
            onSort={onSort}
          >
            Size
          </SortableHeader>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onClearRequests}
            className="p-1 text-gray-400 hover:text-white transition-colors"
            title="Clear requests"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          
          <button
            onClick={onExportRequests}
            className="p-1 text-gray-400 hover:text-white transition-colors"
            title="Export requests"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Request List */}
      <div className="flex-1 overflow-y-auto">
        {sortedRequests.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            No requests captured
          </div>
        ) : (
          sortedRequests.map((request) => (
            <RequestRow
              key={request.id}
              request={request}
              isSelected={selectedRequest?.id === request.id}
              onClick={() => onRequestSelect(request)}
              onReplay={onRequestReplay}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default memo(NetworkRequestList);