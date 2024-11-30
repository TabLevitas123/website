import React, { memo } from 'react';
import { motion } from 'framer-motion';
import TeamMemberCard from './TeamMemberCard';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const TeamGrid = ({ members, className = '' }) => {
  // Grid layout animation variants
  const gridVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  return (
    <motion.div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 
                  gap-8 ${className}`}
      variants={container}
      initial="hidden"
      animate="show"
    >
      {members.map((member, index) => (
        <motion.div
          key={member.codename}
          variants={item}
          className="group"
        >
          <TeamMemberCard
            {...member}
            className={`transform transition-all duration-300 
                       hover:scale-[1.02] hover:shadow-xl 
                       hover:shadow-blue-500/10`}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default memo(TeamGrid);