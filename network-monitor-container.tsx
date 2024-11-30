import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Maximize2, Minimize2, DownloadCloud, Upload, RefreshCw } from 'lucide-react';
import NetworkRequestList from './network-request-list';
import NetworkDetailsHeader from './network-details-header';
import NetworkDetailsBody from './network-details-body';
import NetworkDetailsTimeline from './network-details-timeline';
import NetworkRequestManager from './network-request-manager';
import { logger } from '../utils/logger';

const NetworkMonitorContainer = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({
    key: 'timestamp',
    direction: 'desc'
  });
  const [networkManager] = useState(() => new NetworkRequestManager());

  // Performance metrics
  const [metrics, setMetrics] = useState({
    totalRequests: 0,
    failedRequests: 0,
    averageResponseTime: 0,
    totalDataTransferred: 0
  });

  // Update metrics
  useEffect(() => {
    const interval = setInterval(() => {
      const requests = networkManager.getRequests();
      
      const failedRequests = requests.filter(r => r.status === 'error').length;
      const totalTime = requests.reduce((acc, r) => acc + r.duration, 0);
      const totalData = requests.reduce((acc, r) => acc + (r.size || 0), 0);
      
      setMetrics({
        totalRequests: requests.length,
        failedRequests,
        averageResponseTime: requests.length ? totalTime / requests.length : 0,
        totalDataTransferred: totalData
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [networkManager]);

  // Handle request selection
  const handleRequestSelect = useCallback((request) => {
    setSelectedRequest(request);
    logger.info('Selected network request:', { 
      url: request.url, 
      method: request.method 
    });
  }, []);

  // Handle request replay
  const handleRequestReplay = useCallback(async (request) => {
    try {
      const response = await networkManager.replayRequest(request);
      logger.info('Request replayed successfully:', {
        url: request.url,
        status: response.status
      });
    } catch (error) {
      logger.error('Failed to replay request:', error);
    }
  }, [networkManager]);

  // Handle export
  const handleExport = useCallback(async () => {
    try {
      const data = await networkManager.exportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `network-monitor-${new Date().toISOString()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      logger.info('Network data exported successfully');
    } catch (error) {
      logger.error('Failed to export network data:', error);
    }
  }, [networkManager]);

  // Filter and sort requests
  const filteredRequests = useMemo(() => {
    return networkManager.getRequests().filter(request => {
      const matchesText = request.url.toLowerCase().includes(filter.toLowerCase());
      const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
      const matchesType = typeFilter === 'all' || request.type === typeFilter;
      return matchesText && matchesStatus && matchesType;
    }).sort((a, b) => {
      const direction = sortConfig.direction === 'asc' ? 1 : -1;
      return a[sortConfig.key] > b[sortConfig.key] ? direction : -direction;
    });
  }, [networkManager, filter, statusFilter, typeFilter, sortConfig]);

  return (
    <div className={`fixed inset-0 bg-gray-900 flex flex-col z-50 
                    ${isExpanded ? '' : 'h-96 bottom-0 top-auto'}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-white">Network Monitor</h2>
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-gray-400">
              {metrics.totalRequests} requests
            </span>
            <span className="text-red-400">
              {metrics.failedRequests} failed
            </span>
            <span className="text-blue-400">
              {Math.round(metrics.averageResponseTime)}ms avg
            </span>
            <span className="text-green-400">
              {(metrics.totalDataTransferred / 1024 / 1024).toFixed(2)}MB
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExport}
            className="p-2 text-gray-400 hover:text-white"
            title="Export data"
          >
            <DownloadCloud className="w-5 h-5" />
          </button>
          <button
            onClick={() => networkManager.clear()}
            className="p-2 text-gray-400 hover:text-white"
            title="Clear all"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 text-gray-400 hover:text-white"
            title={isExpanded ? 'Minimize' : 'Maximize'}
          >
            {isExpanded ? (
              <Minimize2 className="w-5 h-5" />
            ) : (
              <Maximize2 className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Request List */}
        <div className="w-1/2 border-r border-gray-800 flex flex-col">
          <NetworkRequestList
            requests={filteredRequests}
            selectedRequest={selectedRequest}
            onRequestSelect={handleRequestSelect}
            onRequestReplay={handleRequestReplay}
            sortConfig={sortConfig}
            onSortChange={setSortConfig}
            filter={filter}
            onFilterChange={setFilter}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            typeFilter={typeFilter}
            onTypeFilterChange={setTypeFilter}
          />
        </div>

        {/* Request Details */}
        <div className="w-1/2 flex flex-col overflow-hidden">
          {selectedRequest ? (
            <>
              <NetworkDetailsHeader
                request={selectedRequest}
                onReplay={handleRequestReplay}
              />
              <NetworkDetailsBody request={selectedRequest} />
              <NetworkDetailsTimeline request={selectedRequest} />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              Select a request to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NetworkMonitorContainer;