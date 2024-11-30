import React, { useState, memo } from 'react';
import { 
  FileText, 
  Code, 
  Clock, 
  Shield, 
  Server,
  AlertTriangle 
} from 'lucide-react';

const Tab = memo(({ 
  icon: Icon, 
  label, 
  isActive, 
  onClick,
  hasWarning = false 
}) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium 
                border-b-2 transition-colors relative
                ${isActive 
                  ? 'text-blue-400 border-blue-400' 
                  : 'text-gray-400 border-transparent hover:text-white hover:border-gray-700'
                }`}
  >
    <Icon className="w-4 h-4" />
    <span>{label}</span>
    {hasWarning && (
      <AlertTriangle className="w-4 h-4 text-yellow-500 ml-1" />
    )}
  </button>
));

Tab.displayName = 'Tab';

const HeadersSection = memo(({ headers, title }) => (
  <div className="mb-6">
    <h3 className="text-sm font-medium text-gray-400 mb-2">{title}</h3>
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      {Object.entries(headers).map(([key, value]) => (
        <div 
          key={key}
          className="flex border-b border-gray-700 last:border-0"
        >
          <div className="w-1/3 px-4 py-2 text-sm font-medium text-gray-400 border-r border-gray-700">
            {key}
          </div>
          <div className="w-2/3 px-4 py-2 text-sm text-gray-300 break-all">
            {value}
          </div>
        </div>
      ))}
    </div>
  </div>
));

HeadersSection.displayName = 'HeadersSection';

const CodePreview = memo(({ 
  content, 
  language, 
  error = null 
}) => {
  if (error) {
    return (
      <div className="p-4 bg-red-900/20 text-red-400 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <pre className="bg-gray-800 rounded-lg p-4 overflow-auto">
      <code className={`language-${language}`}>
        {typeof content === 'string' 
          ? content 
          : JSON.stringify(content, null, 2)
        }
      </code>
    </pre>
  );
});

CodePreview.displayName = 'CodePreview';

const TimingBar = memo(({ 
  stage, 
  duration, 
  totalDuration 
}) => {
  const percentage = (duration / totalDuration) * 100;
  const getStageColor = () => {
    switch (stage) {
      case 'dns': return 'bg-purple-500';
      case 'connect': return 'bg-blue-500';
      case 'ssl': return 'bg-green-500';
      case 'wait': return 'bg-yellow-500';
      case 'download': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="relative h-2 bg-gray-800 rounded overflow-hidden">
      <div
        className={`absolute h-full ${getStageColor()}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
});

TimingBar.displayName = 'TimingBar';

const NetworkDetailsBody = ({ request }) => {
  const [activeTab, setActiveTab] = useState('headers');

  const hasSecurityWarnings = request.security?.warnings?.length > 0;
  
  const tabs = [
    { id: 'headers', label: 'Headers', icon: FileText },
    { id: 'payload', label: 'Payload', icon: Code },
    { id: 'response', label: 'Response', icon: Server },
    { id: 'timing', label: 'Timing', icon: Clock },
    { id: 'security', label: 'Security', icon: Shield, warning: hasSecurityWarnings }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'headers':
        return (
          <div className="space-y-6">
            <HeadersSection 
              title="General" 
              headers={{
                'Request URL': request.url,
                'Request Method': request.method,
                'Status Code': request.status,
                'Remote Address': request.remoteAddress
              }}
            />
            <HeadersSection 
              title="Response Headers" 
              headers={request.headers.response} 
            />
            <HeadersSection 
              title="Request Headers" 
              headers={request.headers.request} 
            />
          </div>
        );

      case 'payload':
        return request.requestData ? (
          <CodePreview 
            content={request.requestData}
            language={request.headers.request['content-type'] || 'json'}
          />
        ) : (
          <div className="text-gray-400 text-center py-4">
            No payload data
          </div>
        );

      case 'response':
        return request.responseData ? (
          <CodePreview 
            content={request.responseData}
            language={request.headers.response['content-type'] || 'json'}
            error={request.error}
          />
        ) : (
          <div className="text-gray-400 text-center py-4">
            No response data
          </div>
        );

      case 'timing':
        return (
          <div className="space-y-6">
            {request.timing && Object.entries(request.timing).map(([stage, duration]) => (
              <div key={stage}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400 capitalize">{stage}</span>
                  <span className="text-gray-300">{duration}ms</span>
                </div>
                <TimingBar
                  stage={stage}
                  duration={duration}
                  totalDuration={request.duration}
                />
              </div>
            ))}
          </div>
        );

      case 'security':
        return (
          <div className="space-y-4">
            {request.security?.warnings?.map((warning, index) => (
              <div 
                key={index}
                className="bg-yellow-900/20 text-yellow-400 p-4 rounded-lg flex items-start space-x-2"
              >
                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium mb-1">{warning.title}</h4>
                  <p className="text-sm">{warning.description}</p>
                </div>
              </div>
            ))}
            
            <div className="bg-gray-800 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-400 mb-2">
                Security Details
              </h4>
              <dl className="space-y-2">
                {Object.entries(request.security || {}).map(([key, value]) => (
                  key !== 'warnings' && (
                    <div key={key} className="grid grid-cols-2">
                      <dt className="text-sm text-gray-400 capitalize">
                        {key.replace('_', ' ')}
                      </dt>
                      <dd className="text-sm text-gray-300">
                        {typeof value === 'boolean' 
                          ? value ? 'Yes' : 'No'
                          : value
                        }
                      </dd>
                    </div>
                  )
                ))}
              </dl>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      {/* Tabs */}
      <div className="flex border-b border-gray-800">
        {tabs.map(({ id, label, icon, warning }) => (
          <Tab
            key={id}
            icon={icon}
            label={label}
            isActive={activeTab === id}
            onClick={() => setActiveTab(id)}
            hasWarning={warning}
          />
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default memo(NetworkDetailsBody);