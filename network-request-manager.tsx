import React, { useState, useEffect, useCallback } from 'react';
import { Activity, AlertCircle, Check, Clock, RefreshCw } from 'lucide-react';
import { logger } from '../utils/logger';

const RequestStatus = {
  PENDING: 'pending',
  SUCCESS: 'success',
  ERROR: 'error',
  TIMEOUT: 'timeout'
};

const RequestType = {
  XHR: 'xhr',
  FETCH: 'fetch',
  WEBSOCKET: 'websocket',
  GRAPHQL: 'graphql'
};

const NetworkRequestManager = ({
  onRequestSelect,
  onClearRequests,
  onExportRequests
}) => {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('timestamp');
  const [sortOrder, setSortOrder] = useState('desc');

  // Initialize request interception
  useEffect(() => {
    const interceptXHR = () => {
      const XHR = window.XMLHttpRequest;
      const open = XHR.prototype.open;
      const send = XHR.prototype.send;

      XHR.prototype.open = function(method, url) {
        this._networkRequest = {
          id: Date.now().toString(),
          timestamp: new Date(),
          method,
          url,
          type: RequestType.XHR,
          status: RequestStatus.PENDING,
          duration: 0,
          size: 0,
          headers: {},
          requestData: null,
          responseData: null
        };
        open.apply(this, arguments);
      };

      XHR.prototype.send = function(data) {
        if (this._networkRequest) {
          this._networkRequest.requestData = data;
          this._networkRequest.startTime = performance.now();
          
          this.addEventListener('load', () => {
            const request = this._networkRequest;
            request.status = this.status >= 200 && this.status < 300 
              ? RequestStatus.SUCCESS 
              : RequestStatus.ERROR;
            request.duration = performance.now() - request.startTime;
            request.size = this.getResponseHeader('content-length') || 0;
            request.responseData = this.response;
            
            try {
              request.headers = {
                request: {},
                response: {}
              };
              this.getAllResponseHeaders().split('\r\n').forEach(line => {
                if (line) {
                  const [key, value] = line.split(': ');
                  request.headers.response[key] = value;
                }
              });
            } catch (error) {
              logger.error('Failed to parse response headers:', error);
            }

            setRequests(prev => [...prev, request]);
          });

          this.addEventListener('error', () => {
            const request = this._networkRequest;
            request.status = RequestStatus.ERROR;
            request.duration = performance.now() - request.startTime;
            setRequests(prev => [...prev, request]);
          });

          this.addEventListener('timeout', () => {
            const request = this._networkRequest;
            request.status = RequestStatus.TIMEOUT;
            request.duration = performance.now() - request.startTime;
            setRequests(prev => [...prev, request]);
          });
        }
        send.apply(this, arguments);
      };
    };

    const interceptFetch = () => {
      const originalFetch = window.fetch;
      window.fetch = async function(...args) {
        const request = {
          id: Date.now().toString(),
          timestamp: new Date(),
          type: RequestType.FETCH,
          status: RequestStatus.PENDING,
          method: args[1]?.method || 'GET',
          url: typeof args[0] === 'string' ? args[0] : args[0].url,
          startTime: performance.now(),
          duration: 0,
          size: 0,
          headers: {
            request: args[1]?.headers || {},
            response: {}
          },
          requestData: args[1]?.body,
          responseData: null
        };

        try {
          const response = await originalFetch.apply(this, args);
          request.status = response.ok ? RequestStatus.SUCCESS : RequestStatus.ERROR;
          request.duration = performance.now() - request.startTime;
          
          response.headers.forEach((value, key) => {
            request.headers.response[key] = value;
          });
          
          request.size = response.headers.get('content-length') || 0;
          
          try {
            const clonedResponse = response.clone();
            request.responseData = await clonedResponse.text();
          } catch (error) {
            logger.error('Failed to clone response:', error);
          }

          setRequests(prev => [...prev, request]);
          return response;
        } catch (error) {
          request.status = RequestStatus.ERROR;
          request.duration = performance.now() - request.startTime;
          setRequests(prev => [...prev, request]);
          throw error;
        }
      };
    };

    try {
      interceptXHR();
      interceptFetch();
    } catch (error) {
      logger.error('Failed to initialize request interception:', error);
    }
  }, []);

  // Filter and sort requests
  const filteredRequests = useMemo(() => {
    return requests
      .filter(request => {
        const matchesSearch = request.url.toLowerCase().includes(filter.toLowerCase());
        const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
        const matchesType = typeFilter === 'all' || request.type === typeFilter;
        return matchesSearch && matchesStatus && matchesType;
      })
      .sort((a, b) => {
        const aValue = a[sortBy];
        const bValue = b[sortBy];
        const order = sortOrder === 'asc' ? 1 : -1;
        return (aValue < bValue ? -1 : 1) * order;
      });
  }, [requests, filter, statusFilter, typeFilter, sortBy, sortOrder]);

  // Export requests
  const handleExport = useCallback(() => {
    const data = {
      requests: filteredRequests,
      timestamp: new Date().toISOString(),
      filters: { statusFilter, typeFilter, searchFilter: filter }
    };
    
    try {
      const blob = new Blob([JSON.stringify(data, null, 2)], { 
        type: 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `network-requests-${new Date().toISOString()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      logger.error('Failed to export requests:', error);
    }
  }, [filteredRequests, statusFilter, typeFilter, filter]);

  return {
    requests: filteredRequests,
    filter,
    setFilter,
    statusFilter,
    setStatusFilter,
    typeFilter,
    setTypeFilter,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    clearRequests: () => setRequests([]),
    exportRequests: handleExport
  };
};

export default NetworkRequestManager;