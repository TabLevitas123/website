import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { logger } from '@/utils/logger';

interface PlatformFeatureProps {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  features: string[];
  background: string;
  isSelected: boolean;
  onSelect: () => void;
  index: number;
}

const FeatureList: React.FC<{
  features: string[];
  background: string;
  index: number;
}> = ({ features, background, index }) => (
  <ul className="space-y-2">
    {features.map((feature, idx) => (
      <motion.li
        key={idx}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ 
          delay: (index * 0.1) + (idx * 0.05),
          duration: 0.3
        }}
        className="flex items-center space-x-2"
      >
        <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-br ${background}`} />
        <span className="text-gray-300">{feature}</span>
      </motion.li>
    ))}
  </ul>
);

const PlatformFeature: React.FC<PlatformFeatureProps> = ({
  id,
  title,
  description,
  icon: Icon,
  features,
  background,
  isSelected,
  onSelect,
  index
}) => {
  try {
    return (
      <motion.div
        initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: index * 0.2 }}
        whileHover={{ scale: 1.02 }}
        className={`relative rounded-xl overflow-hidden cursor-pointer
                  ${isSelected ? 'ring-2 ring-blue-500' : ''}
                  transition-all duration-300`}
      >
        <div className={`bg-gradient-to-br ${background} p-1`}>
          <div className="bg-gray-900 bg-opacity-90 rounded-lg p-6">
            {/* Header */}
            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-lg bg-gradient-to-br ${background}`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
                <p className="text-gray-400">{description}</p>
              </div>
            </div>

            {/* Features List */}
            <div className="mt-6">
              <FeatureList 
                features={features}
                background={background}
                index={index}
              />
            </div>

            {/* Action Button */}
            <motion.div
              className="mt-6 flex items-center justify-end"
              animate={{ x: isSelected ? 10 : 0 }}
            >
              <motion.div
                whileHover={{ x: 5 }}
                className="flex items-center space-x-2 text-blue-400 
                         hover:text-blue-300 transition-colors"
              >
                <span>Learn more</span>
                <ChevronRight
                  className={`w-5 h-5 transform transition-transform duration-300
                           ${isSelected ? 'rotate-90' : ''}`}
                />
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Background Animation */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            background: [
              `linear-gradient(45deg, ${background.split(' ')[3]} 0%, transparent 100%)`,
              `linear-gradient(45deg, transparent 0%, ${background.split(' ')[4]} 100%)`
            ]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: 'reverse'
          }}
          style={{ opacity: 0.1 }}
        />
      </motion.div>
    );
  } catch (error) {
    logger.error('Error rendering platform feature:', error);
    return null;
  }
};

export default PlatformFeature;