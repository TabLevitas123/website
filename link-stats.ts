import React from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, Activity, Share2 } from 'lucide-react';

interface LinkStats {
  totalFollowers: number;
  totalEngagement: number;
  growthRate: number;
  activeUsers: number;
}

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  subtext?: string;
  trend?: number;
  index: number;
}

const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  label,
  value,
  subtext,
  trend,
  index
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    whileHover={{ y: -5 }}
    className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-lg p-6"
  >
    <div className="flex items-center space-x-4">
      <div className="p-3 bg-blue-500 bg-opacity-20 rounded-lg">
        <Icon className="w-6 h-6 text-blue-400" />
      </div>
      <div>
        <h4 className="text-sm text-gray-400">{label}</h4>
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl font-bold text-white">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </span>
          {subtext && (
            <span className="text-sm text-gray-400">{subtext}</span>
          )}
        </div>
        {trend !== undefined && (
          <div className={`text-sm ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </div>
        )}
      </div>
    </div>
  </motion.div>
);

interface LinkStatsProps {
  stats: LinkStats;
}

const LinkStats: React.FC<LinkStatsProps> = ({ stats }) => {
  const statsConfig = [
    {
      icon: Users,
      label: 'Total Followers',
      value: stats.totalFollowers,
      trend: stats.growthRate
    },
    {
      icon: Activity,
      label: 'Engagement Rate',
      value: stats.totalEngagement,
      subtext: '%'
    },
    {
      icon: TrendingUp,
      label: 'Growth Rate',
      value: stats.growthRate,
      subtext: '%/month'
    },
    {
      icon: Share2,
      label: 'Active Users',
      value: stats.activeUsers
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsConfig.map((stat, index) => (
        <StatCard
          key={stat.label}
          {...stat}
          index={index}
        />
      ))}
    </div>
  );