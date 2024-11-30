import React, { memo, useState, useEffect, useCallback, useRef } from 'react';
import { 
  Activity, 
  Power, 
  AlertCircle, 
  Clock, 
  RefreshCw,
  Maximize2,
  ZapOff
} from 'lucide-react';
import { logger } from '../utils/logger';

const ConnectionState = {
  CONNECTING: 'connecting',
  OPEN: 'open',
  CLOSING: 'closing',
  CLOSED: 'closed',
  ERROR: 'error'
};

const ConnectionIndicator = memo(({ state }) => {
  const getStateColor = () => {
    switch (state) {
      case ConnectionState.OPEN:
        return 'bg-green-500';
      case ConnectionState.CONNECTING:
        return 'bg-yellow-500';
      case ConnectionState.CLOSING:
      case ConnectionState.CLOSED:
        return 'bg-gray-500';
      case ConnectionState.ERROR:
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <div className={`w-3 h-3 rounded-full ${getStateColor()}`} />
      <span className="text-sm text-gray-300 capitalize">{state}</span>
    </div>
  );
});

ConnectionIndicator.displayName = 'ConnectionIndicator';

const ConnectionStats = memo(({ 
  messagesSent,
  messagesReceived,
  bytesTransferred,
  uptime,
  latency
}) => (
  <div className="grid grid-cols-5 gap-4">
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="text-sm text-gray-400 mb-1">Messages Sent</div>
      <div className="text-2xl font-bold text-blue-400">{messagesSent}</div>
    </div>
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="text-sm text-gray-400 mb-1">Messages Received</div>
      <div className="text-2xl font-bold text-green-400">{messagesReceived}</div>
    </div>
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="text-sm text-gray-400 mb-1">Data Transferred</div>
      <div className="text-2xl font-bold text-purple-400">
        {(bytesTransferred / 1024).toFixed(2)} KB
      </div>
    </div>
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="text-sm text-gray-400 mb-1">Uptime</div>
      <div className="text-2xl font-bold text-yellow-400">
        {Math.floor(uptime / 60)}m {uptime % 60}s
      </div>
    </div>
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="text-sm text-gray-400 mb-1">Latency</div>
      <div className="text-2xl font-bold text-orange-400">{latency}ms</div>
    </div>
  </div>
));

ConnectionStats.displayName = 'ConnectionStats';

const WebSocketCore = ({ 
  url, 
  protocols = [], 
  autoReconnect = true,
  maxReconnectAttempts = 5,
  reconnectInterval = 5000,
  onMessage,
  onStateChange
}) => {
  const [connectionState, setConnectionState] = useState(ConnectionState.CLOSED);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    messagesSent: 0,
    messagesReceived: 0,
    bytesTransferred: 0,
    uptime: 0,
    latency: 0
  });

  const wsRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const uptimeIntervalRef = useRef(null);
  const startTimeRef = useRef(null);

  // Initialize WebSocket connection
  const initWebSocket = useCallback(() => {
    try {
      wsRef.current = new WebSocket(url, protocols);
      setConnectionState(ConnectionState.CONNECTING);
      startTimeRef.current = Date.now();

      wsRef.current.onopen = () => {
        logger.info('WebSocket connection established');
        setConnectionState(ConnectionState.OPEN);
        setError(null);
        reconnectAttemptsRef.current = 0;

        // Start uptime tracking
        uptimeIntervalRef.current = setInterval(() => {
          setStats(prev => ({
            ...prev,
            uptime: Math.floor((Date.now() - startTimeRef.current) / 1000)
          }));
        }, 1000);
      };

      wsRef.current.onclose = () => {
        logger.info('WebSocket connection closed');
        setConnectionState(ConnectionState.CLOSED);
        clearInterval(uptimeIntervalRef.current);

        if (autoReconnect && reconnectAttemptsRef.current < maxReconnectAttempts) {
          setTimeout(initWebSocket, reconnectInterval);
          reconnectAttemptsRef.current++;
        }
      };

      wsRef.current.onerror = (event) => {
        const errorMessage = 'WebSocket error occurred';
        logger.error(errorMessage, event);
        setConnectionState(ConnectionState.ERROR);
        setError(errorMessage);
      };

      wsRef.current.onmessage = (event) => {
        const startTime = performance.now();
        
        try {
          // Process message
          if (onMessage) {
            onMessage(event.data);
          }

          // Update stats
          setStats(prev => ({
            ...prev,
            messagesReceived: prev.messagesReceived + 1,
            bytesTransferred: prev.bytesTransferred + event.data.length,
            latency: Math.round(performance.now() - startTime)
          }));

          logger.debug('WebSocket message received', {
            size: event.data.length,
            latency: Math.round(performance.now() - startTime)
          });
        } catch (error) {
          logger.error('Error processing WebSocket message:', error);
        }
      };
    } catch (error) {
      logger.error('Error initializing WebSocket:', error);
      setConnectionState(ConnectionState.ERROR);
      setError(error.message);
    }
  }, [url, protocols, autoReconnect, maxReconnectAttempts, reconnectInterval, onMessage]);

  // Initialize connection
  useEffect(() => {
    initWebSocket();
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      clearInterval(uptimeIntervalRef.current);
    };
  }, [initWebSocket]);

  // Notify state changes
  useEffect(() => {
    if (onStateChange) {
      onStateChange(connectionState);
    }
  }, [connectionState, onStateChange]);

  // Send message helper
  const sendMessage = useCallback((data) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      try {
        wsRef.current.send(data);
        setStats(prev => ({
          ...prev,
          messagesSent: prev.messagesSent + 1,
          bytesTransferred: prev.bytesTransferred + data.length
        }));
        logger.debug('WebSocket message sent', { size: data.length });
      } catch (error) {
        logger.error('Error sending WebSocket message:', error);
        throw error;
      }
    } else {
      const error = new Error('WebSocket is not connected');
      logger.error(error);
      throw error;
    }
  }, []);

  return (
    <div className="bg-gray-900 rounded-lg p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Power className="w-5 h-5 text-gray-400" />
          <ConnectionIndicator state={connectionState} />
        </div>
        <button
          onClick={initWebSocket}
          disabled={connectionState === ConnectionState.CONNECTING}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                   disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Reconnect</span>
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-900/20 text-red-400 p-4 rounded-lg flex items-start space-x-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium">Connection Error</h4>
            <p className="text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Connection Stats */}
      <ConnectionStats {...stats} />
    </div>
  );
};

export default memo(WebSocketCore);