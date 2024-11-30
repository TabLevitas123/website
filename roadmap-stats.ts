import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, AlertCircle, Target } from 'lucide-react';
import { logger } from '@/utils/logger';

interface Phase {
  id: number;
  status: 'completed' | 'in-progress' | 'upcoming';
  progress: number;
}

interface StatCardProps {
  icon: React.ElementType;
  title: string;
  value: string | number;
  description: string;
  color: string;
  index: number;
}

const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  title,
  value,
  description,
  color,
  index
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className={`bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border-l-4 ${color}`}
  >
    <div className="flex items-center space-x-4">
      <div className={`p-3 rounded-lg bg-opacity-20 ${color.replace('border-', 'bg-')}`}>
        <Icon className={`w-6 h-6 ${color.replace('border-', 'text-')}`} />
      </div>
      <div>
        <h4 className="text-sm text-gray-400">{title}</h4>
        <div className="text-2xl font-bold text-white mt-1">{value}</div>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      </div>
    </div>
  </motion.div>
);

interface RoadmapStatsProps {
  phases: Phase[];
}

const RoadmapStats: React.FC<RoadmapStatsProps> = ({ phases }) => {
  try {
    // Calculate statistics
    const completedPhases = phases.filter(p => p.status === 'completed').length;
    const inProgressPhases = phases.filter(p => p.status === 'in-progress').length;
    const totalProgress = phases.reduce((acc, curr) => acc + curr.progress, 0) / phases.length;
    const remainingPhases = phases.filter(p => p.status === 'upcoming').length;

    const stats = [
      {
        icon: CheckCircle,
        title: 'Completed Phases',
        value: completedPhases,
        description: `${completedPhases} out of ${phases.length} phases completed`,
        color: 'border-green-500'
      },
      {
        icon: Clock,
        title: 'In Progress',
        value: inProgressPhases,
        description: 'Phases currently being developed',
        color: 'border-blue-500'
      },
      {
        icon: Target,
        title: 'Overall Progress',
        value: `${Math.round(totalProgress)}%`,
        description: 'Total roadmap completion',
        color: 'border-purple-500'
      },
      {
        icon: AlertCircle,
        title: 'Remaining Phases',
        value: remainingPhases,
        description: 'Upcoming development phases',
        color: 'border-yellow-500'
      }
    ];

    return (
      <div className="mt-12">
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-2xl font-bold text-center text-white mb-8"
        >
          Development Progress
        </motion.h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard key={stat.title} {...stat} index={index} />
          ))}
        </div>

        {/* Progress Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-gray-800/50 backdrop-blur-sm rounded-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-gray-400">Overall Timeline</h4>
            <span className="text-sm text-gray-400">
              {Math.round(totalProgress)}% Complete
            </span>
          </div>

          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-blue-500 origin-left"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: totalProgress / 100 }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>

          <div className="grid grid-cols-4 mt-2">
            {phases.map((phase, index) => (
              <div
                key={phase.id}
                className="text-xs text-gray-500 text-center"
              >
                Phase {index + 1}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  } catch (error) {
    logger.error('Error rendering roadmap stats:', error);
    return null;
  }
};

export default RoadmapStats;