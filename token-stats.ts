import React from 'react';
import { motion } from 'framer-motion';
import { Coins, Users, Fire, ChartBar } from 'lucide-react';

interface TokenData {
  totalSupply: string;
  circulatingSupply: string;
  burnedTokens: string;
  holders: number;
  marketCap: string;
}

interface TokenStatsProps {
  data: TokenData;
}

const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ElementType;
  index: number;
}> = ({ title, value, icon: Icon, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-lg p-6"
  >
    <div className="flex items-center space-x-4">
      <div className="p-3 bg-blue-500 bg-opacity-20 rounded-lg">
        <Icon className="w-6 h-6 text-blue-400" />
      </div>
      <div>
        <h3 className="text-sm text-gray-400">{title}</h3>
        <div className="text-2xl font-bold text-white mt-1">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
      </div>
    </div>
  </motion.div>
);

const TokenStats: React.FC<TokenStatsProps> = ({ data }) => {
  const stats = [
    { title: 'Total Supply', value: data.totalSupply, icon: Coins },
    { title: 'Circulating Supply', value: data.circulatingSupply, icon: ChartBar },
    { title: 'Burned Tokens', value: data.burnedTokens, icon: Fire },
    { title: 'Total Holders', value: data.holders, icon: Users }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          index={index}
        />
      ))}
    </div>
  );
};

export default TokenStats;