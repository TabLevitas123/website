import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, Clock } from 'lucide-react';
import { logger } from '@/utils/logger';

interface Phase {
  id: number;
  phase: string;
  title: string;
  status: 'completed' | 'in-progress' | 'upcoming';
  date: string;
  progress: number;
}

interface RoadmapTimelineProps {
  phases: Phase[];
  activePhase: number;
}

const TimelineNode: React.FC<{
  phase: Phase;
  isActive: boolean;
  index: number;
  isLast: boolean;
}> = ({ phase, isActive, index, isLast }) => {
  const getStatusColor = () => {
    switch (phase.status) {
      case 'completed':
        return 'bg-green-500';
      case 'in-progress':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusIcon = () => {
    switch (phase.status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in-progress':
        return (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Clock className="w-5 h-5 text-blue-500" />
          </motion.div>
        );
      default:
        return <Circle className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="flex items-center">
      {/* Node */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: index * 0.1 }}
        className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full
                   ${isActive ? 'ring-2 ring-blue-500' : ''} 
                   bg-gray-800 transition-all duration-300`}
      >
        {getStatusIcon()}
      </motion.div>

      {/* Connecting Line */}
      {!isLast && (
        <div className="flex-1 h-0.5 mx-4">
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: index * 0.1 + 0.1 }}
            className={`h-full origin-left ${getStatusColor()}`}
          />
        </div>
      )}
    </div>
  );
};

const TimelineLabel: React.FC<{
  phase: Phase;
  isActive: boolean;
  index: number;
}> = ({ phase, isActive, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 + 0.2 }}
    className={`text-center ${isActive ? 'text-white' : 'text-gray-400'}`}
  >
    <div className="text-sm font-medium">{phase.phase}</div>
    <div className="text-xs mt-1">{phase.date}</div>
    {phase.progress > 0 && (
      <div className="text-xs mt-1 text-blue-400">{phase.progress}% Complete</div>
    )}
  </motion.div>
);

const RoadmapTimeline: React.FC<RoadmapTimelineProps> = ({ phases, activePhase }) => {
  try {
    return (
      <div className="mb-16">
        <div className="flex justify-between max-w-4xl mx-auto">
          {phases.map((phase, index) => (
            <TimelineNode
              key={phase.id}
              phase={phase}
              isActive={phase.id === activePhase}
              index={index}
              isLast={index === phases.length - 1}
            />
          ))}
        </div>
        
        <div className="flex justify-between max-w-4xl mx-auto mt-4">
          {phases.map((phase, index) => (
            <div key={phase.id} className="w-24">
              <TimelineLabel
                phase={phase}
                isActive={phase.id === activePhase}
                index={index}
              />
            </div>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    logger.error('Error rendering roadmap timeline:', error);
    return null;
  }
};

export default RoadmapTimeline;