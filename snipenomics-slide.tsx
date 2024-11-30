import React from 'react';

const SnipenomicsSlide = ({ title, content, background, isActive }) => {
  return (
    <div
      className={`absolute inset-0 transition-opacity duration-500 ${
        isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'
      } ${background}`}
    >
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <h2 className="text-4xl md:text-6xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          {title}
        </h2>
        {content && (
          <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto whitespace-pre-line">
            {content}
          </p>
        )}
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-full h-full">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full opacity-10 animate-float"
              style={{
                width: `${Math.random() * 20 + 10}px`,
                height: `${Math.random() * 20 + 10}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 10 + 5}s`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SnipenomicsSlide;