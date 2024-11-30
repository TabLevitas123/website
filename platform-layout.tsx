import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LoadingScreen = () => (
  <div className="fixed inset-0 bg-gray-900 flex items-center justify-center z-50">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-blue-500 rounded-full animate-spin">
        <div className="absolute inset-0 border-t-4 border-purple-500 rounded-full animate-pulse"></div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-ping"></div>
      </div>
    </div>
  </div>
);

const SectionWrapper = ({ children, visible, id }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ 
      opacity: visible ? 1 : 0.5,
      y: visible ? 0 : 20
    }}
    transition={{ duration: 0.5 }}
    className="relative"
    id={id}
  >
    {children}
  </motion.div>
);

const NavigationDots = ({ activeSection, sections }) => (
  <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-40">
    <div className="flex flex-col space-y-4">
      {sections.map(({ id }) => (
        <button
          key={id}
          onClick={() => {
            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
          }}
          className={`w-3 h-3 rounded-full transition-all duration-300 ${
            activeSection === id
              ? 'bg-blue-500 scale-125'
              : 'bg-gray-500 hover:bg-gray-400'
          }`}
          aria-label={`Navigate to ${id} section`}
        />
      ))}
    </div>
  </div>
);

const BackgroundEffects = () => (
  <div className="fixed inset-0 pointer-events-none">
    <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black opacity-50" />
    <div className="absolute inset-0">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute bg-blue-500 rounded-full opacity-10 blur-xl"
          style={{
            width: `${Math.random() * 300 + 100}px`,
            height: `${Math.random() * 300 + 100}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float-${i} ${20 + Math.random() * 10}s linear infinite`
          }}
        />
      ))}
    </div>
  </div>
);

const PlatformLayout = ({ sections, activeSection, isLoading }) => {
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="relative min-h-screen bg-gray-900">
      <BackgroundEffects />
      
      <NavigationDots activeSection={activeSection} sections={sections} />

      <main className="relative z-10">
        <AnimatePresence>
          {sections.map(({ id, component: Component, ref, visible }) => (
            <SectionWrapper key={id} visible={visible} id={id}>
              <div ref={ref}>
                <Component />
              </div>
            </SectionWrapper>
          ))}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default PlatformLayout;