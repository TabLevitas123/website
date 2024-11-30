import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock } from 'lucide-react';

const TeamSectionHeader = ({ className = '' }) => {
  return (
    <div className={`text-center mb-16 ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r 
                     from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Meet the Team Behind $SNIPE
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="max-w-3xl mx-auto"
      >
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Shield className="w-6 h-6 text-blue-400" />
            <h3 className="text-xl font-semibold text-white">
              Anonymous by Design
            </h3>
          </div>
          <p className="text-gray-300 leading-relaxed">
            The team behind SnipeAI remains steadfastly committed to anonymity, 
            recognizing the ongoing debate surrounding the classification of 
            blockchain assets and tokens as securities or commodities. This policy 
            ensures the personal security of the team members and safeguards the 
            platform's integrity and long-term stability.
          </p>
        </div>

        <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
          <Lock className="w-4 h-4" />
          <span>Each team member is identified by their unique codename</span>
        </div>
      </motion.div>

      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/0 to-gray-900/50" />
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      </div>
    </div>
  );
};

export default memo(TeamSectionHeader);