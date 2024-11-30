import React from 'react';

const Welcome = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-black to-purple-900">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center p-8">
        <h1 className="text-6xl md:text-8xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          WELCOME
        </h1>
        
        {/* Logo */}
        <div className="mb-12">
          <img
            src="/api/placeholder/200/200"
            alt="SnipeAI Logo"
            className="mx-auto w-48 h-48 md:w-64 md:h-64 rounded-full shadow-2xl hover:shadow-blue-500/50 transition-all duration-300"
          />
        </div>

        {/* Animated scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white p-1">
            <div className="w-1 h-3 bg-white rounded-full mx-auto animate-scroll"></div>
          </div>
        </div>
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-500 rounded-full opacity-50"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 10}s linear infinite`
            }}
          />
        ))}
      </div>

      {/* Add custom styles for animations */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translate(0, 0);
            opacity: 0;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            transform: translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px);
            opacity: 0;
          }
        }

        .bg-grid-pattern {
          background-image: linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
                          linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px);
          background-size: 50px 50px;
        }

        @keyframes scroll {
          0% { transform: translateY(0); }
          50% { transform: translateY(10px); }
          100% { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Welcome;