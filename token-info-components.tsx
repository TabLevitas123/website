import React from 'react';

// Feature Card Component
const FeatureCard = ({ title, children }) => (
  <div className="bg-gray-800 bg-opacity-50 rounded-lg p-6 backdrop-blur-sm hover:bg-opacity-70 transition-all duration-300">
    <h3 className="text-xl font-bold mb-4 text-blue-400">{title}</h3>
    <div className="text-gray-300">{children}</div>
  </div>
);

// Core Purpose Component
const CorePurpose = () => (
  <div className="mb-12 bg-gradient-to-r from-blue-900 to-purple-900 p-8 rounded-xl">
    <h2 className="text-2xl font-bold mb-4 text-blue-300">Core Purpose</h2>
    <p className="text-gray-200 leading-relaxed">
      $SNIPE fuels the SnipeAI ecosystem, enabling access to state-of-the-art AI-driven bots 
      and services tailored for cryptocurrency trading. From detecting the next 100x token to 
      executing complex flash-loan arbitrage strategies, $SNIPE is integral to unlocking the 
      platform's full potential.
    </p>
  </div>
);

// Key Features Section
const KeyFeatures = () => (
  <div className="mb-12">
    <h2 className="text-2xl font-bold mb-8 text-center text-blue-300">Key Features</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
      <FeatureCard title="Utility-Driven">
        $SNIPE is the sole currency for purchasing SnipeAI platform services, ensuring a 
        closed-loop ecosystem that promotes adoption and utility.
      </FeatureCard>
      
      <FeatureCard title="AI-Powered Ecosystem">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-blue-300">Sniper Bot</h4>
            <p>Identifies promising tokens, avoids honeypots and rugpulls, and adapts to 
            anti-bot mechanisms using machine learning.</p>
          </div>
          <div>
            <h4 className="font-semibold text-blue-300">Flash Loan Arbitrage Bot</h4>
            <p>Executes multi-chain, multi-exchange arbitrage strategies with high-speed 
            precision.</p>
          </div>
        </div>
      </FeatureCard>

      <FeatureCard title="Decentralized and Community-Centric">
        <p>The SnipeAI platform includes a DAO for decentralized governance, empowering 
        $SNIPE holders to shape the project's future. Community support and development 
        thrive through a collaborative and transparent approach.</p>
      </FeatureCard>

      <FeatureCard title="Deflationary Tokenomics">
        <p>$SNIPE ensures scarcity by locking a significant portion of its supply and 
        burning transaction fees, fostering long-term value appreciation.</p>
      </FeatureCard>
    </div>
  </div>
);

// Main TokenInfo Component
const TokenInfo = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Introduction */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          $SNIPE Token
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          A cutting-edge ERC-20 token native to the Ethereum blockchain, powering the SnipeAI 
          platform. Designed for cryptocurrency enthusiasts, traders, and innovators, $SNIPE 
          bridges advanced AI capabilities with the decentralized finance (DeFi) ecosystem.
        </p>
      </div>

      {/* Core Purpose Section */}
      <CorePurpose />

      {/* Key Features Section */}
      <KeyFeatures />

      {/* Background Animation */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute w-full h-full bg-grid-pattern opacity-5"></div>
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-blue-500 rounded-full opacity-20 blur-sm"
            style={{
              width: Math.random() * 300 + 100 + 'px',
              height: Math.random() * 300 + 100 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              transform: `translate(-50%, -50%) scale(${Math.random() * 0.5 + 0.5})`,
              animation: `float-${i} ${20 + Math.random() * 10}s linear infinite`
            }}
          />
        ))}
      </div>

      <style jsx>{`
        .bg-grid-pattern {
          background-image: linear-gradient(to right, rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                          linear-gradient(to bottom, rgba(59, 130, 246, 0.1) 1px, transparent 1px);
          background-size: 40px 40px;
        }

        @keyframes float {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.2;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.1);
            opacity: 0.3;
          }
        }
      `}</style>
    </div>
  );
};

export default TokenInfo;