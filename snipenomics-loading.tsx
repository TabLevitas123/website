import React from 'react';

const LoadingSpinner = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75">
    <div className="relative">
      {/* Outer ring */}
      <div className="w-16 h-16 border-4 border-blue-500 rounded-full animate-spin">
        <div className="absolute inset-0 border-t-4 border-purple-500 rounded-full animate-pulse"></div>
      </div>
      
      {/* Inner content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-ping"></div>
      </div>
    </div>
    <p className="absolute mt-24 text-white text-lg font-semibold">Loading presentation...</p>
  </div>
);

const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = React.useState(false);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const handleError = (error) => {
      console.error('Snipenomics Error:', error);
      setError(error);
      setHasError(true);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75">
        <div className="bg-red-900 bg-opacity-90 p-8 rounded-lg max-w-md text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Oops! Something went wrong.</h2>
          <p className="text-red-200 mb-4">
            {error?.message || 'An unexpected error occurred while loading the presentation.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-700 hover:bg-red-600 text-white rounded-lg transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return children;
};

const LoadingManager = ({ children, isLoading, error }) => {
  return (
    <ErrorBoundary>
      {isLoading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75">
          <div className="bg-red-900 bg-opacity-90 p-8 rounded-lg max-w-md text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Error Loading Presentation</h2>
            <p className="text-red-200 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-red-700 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      ) : (
        children
      )}
    </ErrorBoundary>
  );
};

export default LoadingManager;