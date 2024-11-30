import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Zap, ChartBar, Shield, ArrowRight } from 'lucide-react';

interface UtilitySection {
  title: string;
  description: string;
  icon: React.ElementType;
  features: string[];
  gradient: string;
}

const utilities: UtilitySection[] = [
  {
    title: 'Sniper Bot Access',
    description: 'Unlock advanced token sniping capabilities',
    icon: Bot,
    gradient: 'from-blue-500 to-indigo-500',
    features: [
      'Real-time contract analysis',
      'Anti-rug protection',
      'Multi-chain monitoring',
      'Automatic trade execution'
    ]
  },
  {
    title: 'Flash Loan Bot',
    description: 'Access to multi-chain arbitrage opportunities',
    icon: Zap,
    gradient: 'from-purple-500 to-pink-500',
    features: [
      'Cross-chain monitoring',
      'Price disparity detection',
      'Risk management',
      'Automated execution'
    ]
  }
];

const UtilityCard: React.FC<{ utility: UtilitySection; index: number }> = ({ utility, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="relative bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-xl p-8 
               border border-gray-700 overflow-hidden group"
  >
    {/* Header */}
    <div className="flex items-start space-x-4 mb-6">
      <div className={`p-3 rounded-lg bg-gradient-to-br ${utility.gradient}`}>
        <utility.icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <h3 className="text-2xl font-bold text-white mb-2">
          {utility.title}
        </h3>
        <p className="text-gray-400">
          {utility.description}
        </p>
      </div>
    </div>

    {/* Features */}
    <div className="space-y-4">
      {utility.features.map((feature, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: (index * 0.1) + (idx * 0.05) }}
          className="flex items-center space-x-3"
        >
          <ArrowRight className={`w-4 h-4 text-gradient-${utility.gradient.split('-')[1]}-500`} />
          <span className="text-gray-300">{feature}</span>
        </motion.div>
      ))}
    </div>

    {/* Hover Effects */}
    <div className="absolute inset-0 pointer-events-none">
      <div className={`absolute inset-0 bg-gradient-to-br ${utility.gradient} 
                    opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
    </div>

    {/* Action Button */}
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`mt-8 px-6 py-2 rounded-lg bg-gradient-to-r ${utility.gradient}
                text-white font-semibold transition-all duration-300
                hover:shadow-lg hover:shadow-${utility.gradient.split('-')[1]}-500/20`}
    >
      Learn More
    </motion.button>
  </motion.div>
);

const TokenUtility: React.FC = () => {
  return (
    <div className="space-y-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h3 className="text-2xl font-bold text-white">
          Token Utility
        </h3>
        <p className="text-gray-400 max-w-2xl mx-auto">
          $SNIPE token is your key to accessing our advanced trading platform and services
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {utilities.map((utility, index) => (
          <UtilityCard 
            key={utility.title} 
            utility={utility} 
            index={index} 
          />
        ))}
      </div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center mt-12"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 
                   rounded-lg text-white font-semibold hover:shadow-lg 
                   hover:shadow-blue-500/20 transition-all duration-300"
        >
          Get $SNIPE Token
        </motion.button>
        <p className="mt-4 text-sm text-gray-400">
          Start trading with advanced AI-powered tools today
        </p>
      </motion.div>
    </div>
  );
};

export default TokenUtility;