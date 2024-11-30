import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Users, TrendingUp } from 'lucide-react';
import { logger } from '@/utils/logger';

interface Link {
  id: string;
  platform: string;
  url: string;
  icon: string;
  description: string;
  followers?: number;
  engagement?: number;
}

interface LinkCardProps {
  link: Link;
  index: number;
}

const LinkCard: React.FC<LinkCardProps> = ({ link, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    try {
      window.open(link.url, '_blank', 'noopener,noreferrer');
    } catch (error) {
      logger.error('Error opening link:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleClick}
      className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-xl p-6 
                 border border-gray-700 hover:border-blue-500/50 cursor-pointer
                 transition-all duration-300"
    >
      {/* Platform Icon and Name */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-lg bg-gradient-to-br 
                        ${isHovered ? 'from-blue-600 to-purple-600' : 'from-gray-700 to-gray-600'}
                        transition-all duration-300`}>
            <i className={`fab fa-${link.icon} text-xl text-white`} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{link.platform}</h3>
            {link.followers && (
              <div className="flex items-center space-x-1 text-sm text-gray-400">
                <Users className="w-4 h-4" />
                <span>{link.followers.toLocaleString()} followers</span>
              </div>
            )}
          </div>
        </div>
        <ExternalLink className={`w-5 h-5 ${isHovered ? 'text-blue-400' : 'text-gray-400'}
                                transform transition-all duration-300
                                ${isHovered ? 'translate-x-1 -translate-y-1' : ''}`} />
      </div>

      {/* Description */}
      <p className="text-gray-400 text-sm mb-4">{link.description}</p>

      {/* Stats */}
      {link.engagement && (
        <div className="flex items-center space-x-2 text-sm">
          <div className={`flex items-center space-x-1 ${
            link.engagement > 75 ? 'text-green-400' : 'text-yellow-400'
          }`}>
            <TrendingUp className="w-4 h-4" />
            <span>{link.engagement}% engagement</span>
          </div>
        </div>
      )}

      {/* Hover Effects */}
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none"
        animate={{
          background: isHovered 
            ? 'radial-gradient(circle at center, rgba(59, 130, 246, 0.1), transparent)' 
            : 'none'
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};

export default LinkCard;