import React, { memo, useCallback } from 'react';
import { Download, FileText, Image, File } from 'lucide-react';
import { logger } from '../utils/logger';

// Utility functions
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

// Content type formatters
const formatters = {
  'application/json': (content) => {
    try {
      const parsed = typeof content === 'string' 
        ? JSON.parse(content) 
        : content;
      return JSON.stringify(parsed, null, 2);
    } catch (error) {
      logger.error('Failed to format JSON:', error);
      return content;
    }
  },

  'text/html': (content) => {
    try {
      const formatted = require('prettier').format(content, {
        parser: 'html',
        printWidth: 80,
        tabWidth: 2
      });
      return formatted;
    } catch (error) {
      logger.error('Failed to format HTML:', error);
      return content;
    }
  },

  'application/xml': (content) => {
    try {
      const formatted = require('prettier').format(content, {
        parser: 'xml',
        printWidth: 80,
        tabWidth: 2
      });
      return formatted;
    } catch (error) {
      logger.error('Failed to format XML:', error);
      return content;
    }
  },

  'text/css': (content) => {
    try {
      const formatted = require('prettier').format(content, {
        parser: 'css',
        printWidth: 80,
        tabWidth: 2
      });
      return formatted;
    } catch (error) {
      logger.error('Failed to format CSS:', error);
      return content;
    }
  },

  'application/javascript': (content) => {
    try {
      const formatted = require('prettier').format(content, {
        parser: 'babel',
        printWidth: 80,
        tabWidth: 2
      });
      return formatted;
    } catch (error) {
      logger.error('Failed to format JavaScript:', error);
      return content;
    }
  }
};

// Format detection
const detectFormat = (contentType) => {
  const baseType = contentType?.split(';')[0]?.trim().toLowerCase();
  
  const typeMap = {
    'application/json': 'application/json',
    'text/html': 'text/html',
    'application/xml': 'application/xml',
    'text/xml': 'application/xml',
    'text/css': 'text/css',
    'application/javascript': 'application/javascript',
    'text/javascript': 'application/javascript',
    'application/x-javascript': 'application/javascript'
  };

  return typeMap[baseType] || null;
};

// Content preview component
const ContentPreview = memo(({ 
  content, 
  contentType,
  maxHeight = '400px',
  onCopy
}) => {
  const format = detectFormat(contentType);
  
  const formattedContent = useCallback(() => {
    if (!content) return '';
    
    const formatter = formatters[format];
    if (formatter) {
      try {
        return formatter(content);
      } catch (error) {
        logger.error('Formatting failed:', error);
        return content;
      }
    }
    return content;
  }, [content, format]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(content);
      if (onCopy) onCopy();
    } catch (error) {
      logger.error('Failed to copy content:', error);
    }
  }, [content, onCopy]);

  return (
    <div className="relative">
      <div className="absolute right-2 top-2 z-10">
        <button
          onClick={handleCopy}
          className="px-3 py-1 text-sm text-gray-400 hover:text-white 
                     bg-gray-800 rounded-lg transition-colors"
        >
          Copy
        </button>
      </div>
      <pre
        className="bg-gray-900 rounded-lg p-4 overflow-auto text-sm font-mono"
        style={{ maxHeight }}
      >
        <code className={`language-${format || 'plaintext'}`}>
          {formattedContent()}
        </code>
      </pre>
    </div>
  );
});

ContentPreview.displayName = 'ContentPreview';

// Binary content preview
const BinaryPreview = memo(({ 
  content, 
  contentType,
  filename 
}) => {
  const fileSize = new Blob([content]).size;
  
  const handleDownload = useCallback(() => {
    try {
      const blob = new Blob([content], { type: contentType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename || 'download';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      logger.error('Failed to download content:', error);
    }
  }, [content, contentType, filename]);

  const getIcon = () => {
    if (contentType?.startsWith('image/')) return Image;
    if (contentType?.includes('pdf')) return FileText;
    return File;
  };

  const Icon = getIcon();

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <div className="flex flex-col items-center">
        <Icon className="w-16 h-16 text-gray-400 mb-4" />
        <div className="text-gray-400 mb-4">
          Binary content ({formatFileSize(fileSize)})
        </div>
        {filename && (
          <div className="text-sm text-gray-500 mb-4">
            {filename}
          </div>
        )}
        <button
          onClick={handleDownload}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 
                     hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Download</span>
        </button>
      </div>
    </div>
  );
});

BinaryPreview.displayName = 'BinaryPreview';

// Image preview
const ImagePreview = memo(({ 
  content, 
  contentType,
  maxWidth = '100%',
  maxHeight = '400px'
}) => {
  const [error, setError] = useState(false);

  const imageUrl = useMemo(() => {
    try {
      const blob = new Blob([content], { type: contentType });
      return URL.createObjectURL(blob);
    } catch (error) {
      logger.error('Failed to create image URL:', error);
      setError(true);
      return null;
    }
  }, [content, contentType]);

  useEffect(() => {
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  if (error) {
    return (
      <div className="bg-red-900/20 text-red-400 p-4 rounded-lg">
        Failed to load image
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-lg p-4 flex justify-center">
      <img
        src={imageUrl}
        alt="Response content"
        style={{ maxWidth, maxHeight }}
        className="object-contain"
        onError={() => setError(true)}
      />
    </div>
  );
});

ImagePreview.displayName = 'ImagePreview';

// Main formatter component
const NetworkDetailsFormatter = ({ 
  content, 
  contentType, 
  filename,
  maxHeight
}) => {
  const isImage = contentType?.startsWith('image/');
  const isBinary = !detectFormat(contentType) && !isImage;

  if (!content) {
    return (
      <div className="text-gray-400 text-center py-4">
        No content available
      </div>
    );
  }

  if (isImage) {
    return (
      <ImagePreview
        content={content}
        contentType={contentType}
        maxHeight={maxHeight}
      />
    );
  }

  if (isBinary) {
    return (
      <BinaryPreview
        content={content}
        contentType={contentType}
        filename={filename}
      />
    );
  }

  return (
    <ContentPreview
      content={content}
      contentType={contentType}
      maxHeight={maxHeight}
    />
  );
};

export default memo(NetworkDetailsFormatter);