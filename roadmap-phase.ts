import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, Clock, ChevronRight, Calendar } from 'lucide-react';
import { logger } from '@/utils/logger';

interface Phase {
  id: number;
  phase: string;
  title: string;
  status: 'completed' | 'in-progress' | 'upcoming';
  date: string;
  items: string[];
  progress: number;
}

interface RoadmapPhaseProps {
  phase: Phase;
  isActive: boolean;
  onClick: () => void;
}

const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => (
  <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
    <motion.div
      className="absolute h-full bg-blue-500"
      initial={{ width: 0 }}
      animate={{ width: `${progress}%` }}
      transition={{ duration: 1, delay: 0.5 }}
    />
  </div>
);

const PhaseItems: React.FC<{ items: string[]; status: Phase['status'] }> = ({ items, status }) => (
  <div className="space-y-2">
    {items.map((item, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1 }}
        className="flex items-center space-x-2"
      >
        {status === 'completed' ? (
          <CheckCircle className="w-4 h-4 text-green-500" />
        ) : status === 'in-progress' ? (
          <Clock className="w-4 h-4 text-blue-500" />
        ) : (
          <Circle className="w-4 h-4 text-gray-500" />
        )}
        <span className="text-gray-300">{item}</span>
      </motion.div>
    ))}
  </div>
);

const RoadmapPhase: React.FC<RoadmapPhaseProps> = ({ phase, isActive, onClick }) => {
  const getStatusColor = (status: Phase['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-500';
      case 'in-progress':
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: Phase['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className={`w-6 h-6 ${getStatusColor(status)}`} />;
      case 'in-progress':
        return (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Clock className="w-6 h-6 text-blue-500" />
          </motion.div>
        );
      default:
        return <Circle className="w-6 h-6 text-gray-500" />;
    }
  };

  try {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        onClick={onClick}
        className={`relative rounded-xl overflow-hidden cursor-pointer
                  ${isActive ? 'bg-blue-900/20' : 'bg-gray-800/50'}
                  backdrop-blur-sm p-6 border border-gray-700 hover:border-blue-500/50
                  transition-colors duration-300`}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              {getStatusIcon(phase.status)}
              <span className="text-sm font-medium text-gray-400">{phase.phase}</span>
            </div>
            <h3 className="text-xl font-bold text-white">{phase.title}</h3>
          </div>
          <div className="flex items-center space-x-2 text-gray-400">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">{phase.date}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Progress</span>
            <span className="text-sm text-gray-400">{phase.progress}%</span>
          </div>
          <ProgressBar progress={phase.progress} />
        </div>

        {/* Phase Items */}
        <PhaseItems items={phase.items} status={phase.status} />

        {/* Expand Indicator */}
        <motion.div
          className="absolute top-4 right-4"
          animate={{ rotate: isActive ? 90 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </motion.div>
      </motion.div>
    );
  } catch (error) {
    logger.error('Error rendering roadmap phase:', error);
    return null;
  }
};

export default RoadmapPhase;