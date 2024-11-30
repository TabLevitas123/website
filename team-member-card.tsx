import React, { memo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BiopicImage = memo(({ src, alt, className = '' }) => (
  <div className="relative w-48 h-48 overflow-hidden rounded-full">
    <motion.img
      src={src}
      alt={alt}
      className={`w-full h-full object-cover transform hover:scale-110 
                  transition-transform duration-300 ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.1 }}
      transition={{
        duration: 0.3,
        ease: "easeOut"
      }}
    />
    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
  </div>
));

BiopicImage.displayName = 'BiopicImage';

const TeamMemberQuote = memo(({ quote }) => (
  <div className="relative mt-4">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="italic text-gray-400 text-sm"
    >
      "{quote}"
    </motion.div>
  </div>
));

TeamMemberQuote.displayName = 'TeamMemberQuote';

const TeamMemberCard = ({
  codename,
  location,
  biopic,
  quote,
  description,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById(`team-member-${codename}`);
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [codename]);

  return (
    <motion.div
      id={`team-member-${codename}`}
      className={`bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 
                  hover:bg-gray-800/50 transition-colors duration-300 ${className}`}
      initial={{ opacity: 0, y: 50 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6">
        {/* Biopic Image */}
        <BiopicImage
          src={biopic}
          alt={`${codename}'s biopic`}
        />

        {/* Content */}
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-2xl font-bold text-white mb-2 
                         bg-gradient-to-r from-blue-400 to-purple-400 
                         bg-clip-text text-transparent">
              {codename}
            </h3>
            <p className="text-gray-400 text-sm mb-4">{location}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-gray-300 leading-relaxed mb-4">
              {description}
            </p>
          </motion.div>

          <TeamMemberQuote quote={quote} />
        </div>
      </div>

      {/* Interactive Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r 
                      from-blue-500/10 to-purple-500/10 opacity-0 
                      group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      </div>
    </motion.div>
  );
};

export default memo(TeamMemberCard);