import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GitHub, Twitter, Telegram, YouTube, Globe } from 'lucide-react'; 

const links = [
  {
    id: 'website',
    icon: Globe,
    title: 'Website',
    url: 'https://www.snipeai.io',
    description: 'Explore our official website for the latest updates and information.'
  },
  {
    id: 'twitter', 
    icon: Twitter,
    title: 'Twitter',
    url: 'https://twitter.com/SnipeAI_ETH',
    description: 'Follow us on Twitter for real-time updates and community engagement.'
  },
  {
    id: 'telegram',
    icon: Telegram, 
    title: 'Telegram',
    url: 'https://t.me/SnipeAI_ETH',
    description: 'Join our Telegram channel to connect with the team and other members.'
  },
  {
    id: 'youtube',
    icon: YouTube,
    title: 'YouTube', 
    url: 'https://www.youtube.com/@SnipeAI_ETH',
    description: 'Subscribe to our YouTube channel for tutorials, AMAs, and more.'
  },
  {
    id: 'github',
    icon: GitHub,
    title: 'GitHub',
    url: 'https://github.com/SnipeAI',
    description: 'Explore our open-source repositories and contribute to the project.' 
  }
];

const LinkCard = ({ link, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = link.icon;

  return (
    <motion.a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-gray-800 rounded-lg p-4 transition-all duration-300 
                 hover:bg-gray-700 hover:shadow-lg hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="flex items-center space-x-4">
        <div className={`p-2 rounded-lg transition-colors ${
          isHovered ? 'bg-blue-600' : 'bg-gray-700'  
        }`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white mb-1">{link.title}</h3>
          <p className="text-gray-400 text-sm">{link.description}</p>  
        </div>
      </div>
    </motion.a>
  );
};

const LinksSection = () => {
  return (
    <section className="bg-gray-900 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4
                        bg-clip-text text-transparent bg-gradient-to-r
                        from-blue-400 to-purple-500">
            Connect with Us
          </h2>
          <p className="text-xl text-gray-400 mb-12">
            Stay updated on our latest developments, join the community discussions, 
            and explore our resources.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {links.map((link, index) => (
            <LinkCard key={link.id} link={link} index={index} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default LinksSection;
