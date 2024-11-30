import React from 'react';
import { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Welcome from './components/Welcome';
import TokenInfo from './components/TokenInfo';
import Snipenomics from './components/Snipenomics';
import Platform from './components/Platform';
import Roadmap from './components/Roadmap';
import Team from './components/Team';
import Mission from './components/Mission';
import Partnerships from './components/Partnerships';
import Links from './components/Links';
import Contact from './components/Contact';

const App = () => {
  const [activeSection, setActiveSection] = useState('welcome');

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]');
      
      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const offset = window.innerHeight * 0.3;
        
        if (rect.top <= offset && rect.bottom >= offset) {
          setActiveSection(section.id);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Navigation activeSection={activeSection} />
      
      <main className="relative">
        <section id="welcome" className="min-h-screen">
          <Welcome />
        </section>
        
        <section id="token" className="min-h-screen py-20">
          <TokenInfo />
        </section>
        
        <section id="snipenomics" className="min-h-screen py-20">
          <Snipenomics />
        </section>
        
        <section id="platform" className="min-h-screen py-20">
          <Platform />
        </section>
        
        <section id="roadmap" className="min-h-screen py-20">
          <Roadmap />
        </section>
        
        <section id="team" className="min-h-screen py-20">
          <Team />
        </section>
        
        <section id="mission" className="min-h-screen py-20">
          <Mission />
        </section>
        
        <section id="partnerships" className="py-20">
          <Partnerships />
        </section>
        
        <section id="links" className="py-20">
          <Links />
        </section>
        
        <section id="contact" className="py-20">
          <Contact />
        </section>
      </main>
    </div>
  );
};

export default App;