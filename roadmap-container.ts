import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Circle, ChevronRight, Calendar, Target } from 'lucide-react';
import RoadmapPhase from './RoadmapPhase';
import RoadmapTimeline from './RoadmapTimeline';
import RoadmapStats from './RoadmapStats';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';
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

const roadmapData: Phase[] = [
  {
    id: 1,
    phase: 'Phase 1',
    title: 'Platform Launch',
    status: 'completed',
    date: 'Q4 2024',
    items: [
      'Token Launch on Ethereum',
      'Community Building',
      'Website Launch',
      'Initial Marketing Campaign',
      'Smart Contract Audit'
    ],
    progress: 100
  },
  {
    id: 2,
    phase: 'Phase 2',
    title: 'AI Bot Development',
    status: 'in-progress',
    date: 'Q1 2025',
    items: [
      'Sniper Bot Beta Release',
      'Flash Loan Bot Development',
      'Security Implementations',
      'Performance Testing',
      'Community Testing Program'
    ],
    progress: 65
  },
  {
    id: 3,
    phase: 'Phase 3',
    title: 'Platform Expansion',
    status: 'upcoming',
    date: 'Q2 2025',
    items: [
      'Multi-chain Integration',
      'Advanced Trading Features',
      'Mobile App Development',
      'Partnership Expansions',
      'Enhanced AI Capabilities'
    ],
    progress: 0
  },
  {
    id: 4,
    phase: 'Phase 4',
    title: 'Ecosystem Growth',
    status: 'upcoming',
    date: 'Q3 2025',
    items: [
      'DAO Implementation',
      'Staking Platform',
      'Cross-chain Bridge',
      'Additional Bot Services',
      'Global Marketing Campaign'
    ],
    progress: 0
  }
];

const RoadmapContainer: React.FC = () => {
  const [activePhase, setActivePhase] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { trackRender, trackAction } = usePerformanceMonitor('roadmap');

  useEffect(() => {
    const initRoadmap = async () => {
      try {
        setIsLoading(true);
        trackAction('init-roadmap-start');

        // Simulate data loading
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setIsLoading(false);
        trackAction('init-roadmap-complete');
      } catch (err) {
        const error = err instanceof Error ? err.message : 'Failed to initialize roadmap';
        logger.error('Roadmap initialization error:', error);
        setError(error);
        trackAction('init-roadmap-error');
      }
    };

    initRoadmap();
    trackRender('roadmap-mount');

    return () => {
      logger.info('Roadmap component unmounted');
    };
  }, [trackAction, trackRender]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-900">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-blue-900/20 to-purple-900/20 opacity-50" />
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Platform Roadmap
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Our vision for the future of AI-powered cryptocurrency trading
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center items-center py-20"
            >
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </motion.div>
          ) : error ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-red-900/20 text-red-400 p-6 rounded-lg text-center"
            >
              {error}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-12"
            >
              {/* Timeline View */}
              <RoadmapTimeline phases={roadmapData} activePhase={activePhase} />

              {/* Phase Cards */}
              <div className="grid md:grid-cols-2 gap-6">
                {roadmapData.map((phase) => (
                  <RoadmapPhase
                    key={phase.id}
                    phase={phase}
                    isActive={activePhase === phase.id}
                    onClick={() => setActivePhase(phase.id)}
                  />
                ))}
              </div>

              {/* Progress Stats */}
              <RoadmapStats phases={roadmapData} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RoadmapContainer;