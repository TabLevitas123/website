import React, { Component } from 'react';
import { AlertTriangle, RefreshCw, Terminal } from 'lucide-react';
import { logger } from './platform-utils';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
      errorHistory: [],
      lastError: null,
      crashTime: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    const timestamp = new Date().toISOString();
    const newError = {
      timestamp,
      error: error.toString(),
      stack: error.stack,
      componentStack: errorInfo.componentStack
    };

    this.setState(prevState => ({
      error,
      errorInfo,
      errorCount: prevState.errorCount + 1,
      errorHistory: [...prevState.errorHistory, newError].slice(-5), // Keep last 5 errors
      lastError: timestamp,
      crashTime: timestamp
    }));

    // Log error to our logging system
    logger.error('Platform Error Boundary Caught Error:', {
      error: newError,
      component: this.props.componentName || 'Unknown Component'
    });

    // Send error to monitoring service if configured
    if (window.errorMonitor) {
      window.errorMonitor.captureError(error, {
        extra: {
          componentStack: errorInfo.componentStack,
          componentName: this.props.componentName
        }
      });
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  renderErrorDetails() {
    const { error, errorInfo, errorCount, lastError } = this.state;
    
    return (
      <div className="bg-gray-900 rounded-lg p-6 mt-4 text-left">
        <div className="flex items-center space-x-2 text-red-400 mb-4">
          <Terminal className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Error Details</h3>
        </div>
        
        <div className="space-y-2 text-sm text-gray-400">
          <p><strong>Error Count:</strong> {errorCount}</p>
          <p><strong>Last Error:</strong> {lastError}</p>
          <p><strong>Message:</strong> {error?.message}</p>
          {error?.stack && (
            <pre className="bg-gray-800 p-3 rounded overflow-x-auto">
              {error.stack}
            </pre>
          )}
          {errorInfo?.componentStack && (
            <div>
              <strong>Component Stack:</strong>
              <pre className="bg-gray-800 p-3 rounded overflow-x-auto">
                {errorInfo.componentStack}
              </pre>
            </div>
          )}
        </div>
      </div>
    );
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-gray-800 rounded-xl p-8 text-center">
            <div className="flex justify-center mb-6">
              <AlertTriangle className="w-16 h-16 text-red-500 animate-pulse" />
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-4">
              Oops! Something went wrong
            </h2>
            
            <p className="text-gray-400 mb-8">
              We apologize for the inconvenience. Our team has been notified and is working to fix the issue.
            </p>

            <div className="flex justify-center space-x-4 mb-8">
              <button
                onClick={this.handleRetry}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg 
                         transition-colors duration-200 flex items-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Retry</span>
              </button>
              
              <button
                onClick={this.handleReload}
                className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg 
                         transition-colors duration-200"
              >
                Reload Page
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && this.renderErrorDetails()}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;