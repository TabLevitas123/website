import React, { useState, useEffect, useRef } from 'react';
import { AlertCircle, CheckCircle, Info, Terminal, Trash2, Download } from 'lucide-react';

const LogLevel = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug'
};

const LogEntry = ({ log }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const getLevelIcon = () => {
    switch (log.level) {
      case LogLevel.ERROR:
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case LogLevel.WARN:
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case LogLevel.INFO:
        return <Info className="w-4 h-4 text-blue-500" />;
      default:
        return <CheckCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getBackgroundColor = () => {
    switch (log.level) {
      case LogLevel.ERROR:
        return 'bg-red-900/20';
      case LogLevel.WARN:
        return 'bg-yellow-900/20';
      case LogLevel.INFO:
        return 'bg-blue-900/20';
      default:
        return '';
    }
  };

  return (
    <div className={`p-2 border-b border-gray-800 ${getBackgroundColor()}`}>
      <div 
        className="flex items-start space-x-2 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {getLevelIcon()}
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="text-sm font-mono">{log.message}</span>
            <span className="text-xs text-gray-500">
              {new Date(log.timestamp).toLocaleTimeString()}
            </span>
          </div>
          {isExpanded && (
            <>
              {log.details && (
                <pre className="mt-2 text-xs text-gray-400 bg-gray-800 p-2 rounded overflow-x-auto">
                  {JSON.stringify(log.details, null, 2)}
                </pre>
              )}
              {log.stack && (
                <pre className="mt-2 text-xs text-gray-400 bg-gray-800 p-2 rounded overflow-x-auto">
                  {log.stack}
                </pre>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const ConsoleViewer = () => {
  const [logs, setLogs] = useState([]);
  const [logLevel, setLogLevel] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [autoScroll, setAutoScroll] = useState(true);
  const logsEndRef = useRef(null);

  useEffect(() => {
    // Intercept console methods
    const originalConsole = {
      log: console.log,
      error: console.error,
      warn: console.warn,
      info: console.info,
    };

    const intercept = (level) => (...args) => {
      originalConsole[level](...args);
      addLog(level, args);
    };

    console.log = intercept('log');
    console.error = intercept('error');
    console.warn = intercept('warn');
    console.info = intercept('info');

    return () => {
      // Restore original console methods
      Object.assign(console, originalConsole);
    };
  }, []);

  useEffect(() => {
    if (autoScroll && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, autoScroll]);

  const addLog = (level, args) => {
    const log = {
      id: Date.now(),
      level,
      message: args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' '),
      timestamp: new Date(),
      details: args.find(arg => typeof arg === 'object'),
      stack: new Error().stack
    };

    setLogs(prev => [...prev, log]);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const downloadLogs = () => {
    const logData = JSON.stringify(logs, null, 2);
    const blob = new Blob([logData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `console-logs-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredLogs = logs.filter(log => {
    const levelMatch = logLevel === 'all' || log.level === logLevel;
    const searchMatch = searchTerm === '' || 
      log.message.toLowerCase().includes(searchTerm.toLowerCase());
    return levelMatch && searchMatch;
  });

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center space-x-4">
          <Terminal className="w-5 h-5 text-blue-400" />
          <select
            value={logLevel}
            onChange={(e) => setLogLevel(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm"
          >
            <option value="all">All Logs</option>
            <option value="error">Errors</option>
            <option value="warn">Warnings</option>
            <option value="info">Info</option>
            <option value="debug">Debug</option>
          </select>
          <input
            type="text"
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm"
          />
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={clearLogs}
            className="p-1 text-gray-400 hover:text-white"
            title="Clear console"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={downloadLogs}
            className="p-1 text-gray-400 hover:text-white"
            title="Download logs"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredLogs.map((log) => (
          <LogEntry key={log.id} log={log} />
        ))}
        <div ref={logsEndRef} />
      </div>

      <div className="p-2 border-t border-gray-800">
        <label className="flex items-center space-x-2 text-sm text-gray-400">
          <input
            type="checkbox"
            checked={autoScroll}
            onChange={(e) => setAutoScroll(e.target.checked)}
            className="form-checkbox rounded bg-gray-800 border-gray-700"
          />
          <span>Auto-scroll</span>
        </label>
      </div>
    </div>
  );
};

export default ConsoleViewer;