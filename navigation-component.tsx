import React, { useState } from 'react';
import { Menu } from 'lucide-react';

const Navigation = ({ activeSection }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-black bg-opacity-90 backdrop-blur-sm">
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
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    activeSection === item.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-blue-700 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`block w-full px-3 py-2 rounded-md text-base font-medium ${
                activeSection === item.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-blue-700 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;