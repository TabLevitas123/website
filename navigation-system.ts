import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';
import { logger } from '@/utils/logger';

// Navigation items configuration
const navigationItems = [
  { id: 'welcome', label: 'Welcome' },
  { id: 'token', label: '$SNIPE' },
  { id: 'snipenomics', label: 'Snipenomics' },
  { id: 'platform', label: 'Platform' },
  { id: 'roadmap', label: 'Roadmap' },
  { id: 'team', label: 'Team' },
  { id: 'mission', label: 'Mission' },
  { id: 'partnerships', label: 'Partners' },
  { id: 'links', label: 'Links' },
  { id: 'contact', label: 'Contact' }
];

// NavigationLink Component
const NavigationLink = ({ 
  id, 
  label, 
  isActive, 
  onClick 
}: {
  id: string;
  label: string;
  isActive: boolean;
  onClick: (id: string) => void;
}) => (
  <motion.button
    onClick={() => onClick(id)}
    className={`px-4 py-2 rounded-lg transition-all duration-300
              ${isActive 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    aria-current={isActive ? 'page' : undefined}
  >
    {label}
  </motion.button>
);

// MobileMenu Component
const MobileMenu = ({
  isOpen,
  activeSection,
  onNavigate,
  onClose
}: {
  isOpen: boolean;
  activeSection: string;
  onNavigate: (id: string) => void;
  onClose: () => void;
}) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="absolute top-full left-0 right-0 bg-gray-900 shadow-lg"
      >
        <div className="p-4 space-y-2">
          {navigationItems.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => {
                onNavigate(id);
                onClose();
              }}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors
                        ${activeSection === id
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

// Main Navigation Component
const Navigation = () => {
  const [activeSection, setActiveSection] = useState('welcome');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Performance monitoring
  const { trackAction } = usePerformanceMonitor('navigation');

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle navigation
  const handleNavigate = useCallback((id: string) => {
    try {
      trackAction('navigation-click');
      
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
        setActiveSection(id);
      }
    } catch (error) {
      logger.error('Navigation error:', error);
    }
  }, [trackAction]);

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-300
                ${isScrolled 
                  ? 'bg-gray-900/95 backdrop-blur-sm shadow-lg' 
                  : 'bg-transparent'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <img
              src="/api/placeholder/40/40"
              alt="SnipeAI Logo"
              className="h-10 w-10"
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navigationItems.map(({ id, label }) => (
              <NavigationLink
                key={id}
                id={id}
                label={label}
                isActive={activeSection === id}
                onClick={handleNavigate}
              />
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden relative">
          <MobileMenu
            isOpen={isMenuOpen}
            activeSection={activeSection}
            onNavigate={handleNavigate}
            onClose={() => setIsMenuOpen(false)}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navigation;