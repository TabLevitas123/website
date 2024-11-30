import React, { memo, useEffect, useState } from 'react';
import TeamSectionHeader from './TeamSectionHeader';
import TeamGrid from './TeamGrid';
import { logger } from '../utils/logger';

const teamMembers = [
  {
    codename: "Cipher",
    location: "Midwest, USA",
    description: `Cipher is the master builder of SnipeAI's neural foundations. 
                 From his roots in the Midwest, Cipher has grown into a leading 
                 force in AI/ML and Full-Stack Development. His brilliance lies 
                 in merging logic with creativity, crafting solutions that are 
                 as intuitive as they are powerful.`,
    quote: "In every algorithm, there's a spark of the divine.",
    biopic: "/images/cipher-biopic.png"  // Image 1
  },
  {
    codename: "Specter",
    location: "United Kingdom",
    description: `Specter, the phantom guardian of SnipeAI, embodies precision 
                 and vigilance. As a smart contract expert and financial backer, 
                 his skill set ensures the platform's robust security and 
                 innovative scalability.`,
    quote: "The blockchain whispers truths only the vigilant can hear.",
    biopic: "/images/specter-biopic.png"  // Image 2
  },
  {
    codename: "Aegis",
    location: "Nigeria",
    description: `Aegis is the resilient strategist driving SnipeAI's growth. 
                 From Nigeria, he brings a unique perspective, blending sharp 
                 business acumen with unwavering resolve. Aegis sees every 
                 obstacle as an opportunity, every setback as a chance to 
                 refine the platform's vision.`,
    quote: "Strength isn't in what you block, but what you build.",
    biopic: "/images/aegis-biopic.png"  // Image 3
  },
  {
    codename: "Echo",
    location: "West Coast, USA",
    description: `Echo is the pulse of SnipeAI's social presence. Hailing from 
                 the vibrant West Coast, Echo bridges the digital divide with 
                 unmatched charisma and authenticity. A maestro of communication, 
                 he transforms ideas into messages that resonate far and wide.`,
    quote: "True connection resonates beyond the screen.",
    biopic: "/images/echo-biopic.png"  // Image 4
  },
  {
    codename: "Epoch",
    location: "Parts Unknown",
    description: `Epoch is SnipeAI's eternal thinker, blending technological 
                 mastery with philosophical depth. To Epoch, time is both a 
                 resource and a narrative, shaping every strategy he crafts. 
                 His marketing genius transforms ideas into movements.`,
    quote: "Time is the canvas on which futures are painted.",
    biopic: "/images/epoch-biopic.png"  // Image 5
  }
];

const TeamSection = ({ className = '' }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTeamData = async () => {
      try {
        // Simulate loading team data and assets
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);
      } catch (error) {
        logger.error('Error loading team data:', error);
        setError('Failed to load team data. Please try again later.');
        setIsLoading(false);
      }
    };

    loadTeamData();
  }, []);

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-900/20 text-red-400 p-4 rounded-lg inline-block">
          {error}
        </div>
      </div>
    );
  }

  return (
    <section 
      className={`relative min-h-screen py-20 ${className}`}
      id="team"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/0 to-gray-900/50" />
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        
        {/* Animated particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-blue-400 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 5}s`
              }}
            />
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Header */}
        <TeamSectionHeader />

        {/* Team Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 
                          border-b-2 border-blue-500" />
          </div>
        ) : (
          <TeamGrid members={teamMembers} />
        )}

        {/* Anonymity Notice */}
        <div className="mt-16 text-center">
          <p className="text-gray-400 max-w-3xl mx-auto">
            The team's anonymity reflects their unwavering commitment to the 
            long-term vision of $SNIPE and SnipeAI. By prioritizing security 
            and objectivity, the team ensures the platform's focus remains on 
            innovation, community empowerment, and the democratization of 
            decentralized trading.
          </p>
        </div>
      </div>

      {/* Add custom styles for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-float {
          animation: float 5s ease-in-out infinite;
        }

        .bg-grid-pattern {
          background-image: linear-gradient(to right, rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                          linear-gradient(to bottom, rgba(59, 130, 246, 0.1) 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>
    </section>
  );
};

export default memo(TeamSection);