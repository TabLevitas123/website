import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, ChartBar, Lock, TrendingUp } from 'lucide-react';

interface Feature {
  title: string;
  description: string;
  icon: React.ElementType;
  gradient: string;
  benefits: string[];
}

const features: Feature[] = [
  {
    title: 'Platform Access Token',
    description: 'Exclusive access to SnipeAI\'s advanced trading bots and analytics tools',
    icon: Zap,
    gradient: 'from-blue-500 to-indigo-500',
    benefits: [
      'Access to Sniper Bot',
      'Access to Flash Loan Bot',
      'Advanced Analytics Dashboard',
      'Priority Support'
    ]
  },
  {
    title: 'Deflationary Mechanism',
    description: 'Built-in tokenomics to ensure long-term value appreciation',
    icon: TrendingUp,
    gradient: 'from-purple-500 to-pink-500',
    benefits: [
      'Automatic Token Burning',
      'Reduced Supply Over Time',
      'Holder Incentives',
      'Value Appreciation'
    ]
  },
  {
    title: 'Security Features',
    description: 'Advanced security measures to protect token holders',
    icon: Shield,
    gradient: 'from-green-500 to-teal-500',
    benefits: [
      'Anti-Bot Protection',
      'Liquidity Locked',
      'Contract Audited',
      'Anti-Whale Mechanisms'
    ]
  },
  {
    title: 'Token Governance',
    description: 'Community-driven decision making for platform development',
    icon: Lock,
    gradient: 'from-yellow-500 to-orange-500',
    benefits: [
      'Voting Rights',
      'Proposal Submission',
      'Treasury Management',
      'Community Governance'
    ]
  }
];

const FeatureCard: React.FC<{ feature: Feature; index: number }> = ({ feature, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
  >
    <div className="flex items-start space-x-4">
      <div className={`p-3 rounded-lg bg-gradient-to-br ${feature.gradient}`}>
        <feature.icon className="w-6 h-6 text-white" />
      </div>
      <div className="flex-1">
        <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
        <p className="text-gray-400 mb-4">{feature.description}</p>
        
        <ul className="space-y-2">
          {feature.benefits.map((benefit, idx) => (
            <motion.li
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: (index * 0.1) + (idx * 0.05) }}
              className="flex items-center space-x-2"
            >
              <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-br ${feature.gradient}`} />
              <span className="text-gray-300">{benefit}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>

    {/* Hover Effect */}
    <div className="absolute inset-0 pointer-events-none">
      <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 
                    group-hover:opacity-10 transition-opacity duration-300`} />
    </div>
  </motion.div>
);

const TokenFeatures: React.FC = () => {
  return (
    <div className="space-y-8">
      <motion.h3
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-center text-white mb-12"
      >
        Platform Features
      </motion.h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <FeatureCard key={feature.title} feature={feature} index={index} />
        ))}
      </div>
    </div>
  );
};

export default TokenFeatures;