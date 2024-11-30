import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    id: 1,
    title: "What is $SNIPE?",
    content: "",
    background: "bg-gradient-to-br from-blue-900 to-purple-900"
  },
  {
    id: 2,
    title: "$SNIPE Token",
    content: "$Snipe is a publicly traded Deflationary ERC-20 Token on the Ethereum blockchain.",
    background: "bg-gradient-to-br from-purple-900 to-indigo-900"
  },
  {
    id: 3,
    title: "Did somebody say 'Utility'?",
    content: "",
    background: "bg-gradient-to-br from-indigo-900 to-blue-900"
  },
  {
    id: 4,
    title: "Unique Utility",
    content: "What sets $SNIPE apart from other tokens is its unique utility. It serves as the sole means of purchasing services from the SniperAI platform",
    background: "bg-gradient-to-br from-blue-900 to-purple-900"
  },
  {
    id: 5,
    title: "SNIPENOMICS",
    content: "",
    background: "bg-gradient-to-br from-purple-900 to-indigo-900"
  },
  {
    id: 6,
    title: "Total Supply",
    content: "1,000,000,000",
    background: "bg-gradient-to-br from-indigo-900 to-blue-900"
  },
  {
    id: 7,
    title: "Supply Lock",
    content: "96% Supply Locked for 1 Year",
    background: "bg-gradient-to-br from-blue-900 to-purple-900"
  },
  {
    id: 8,
    title: "Fair Launch",
    content: "Fair Launch, No Presale, 100% SAFU",
    background: "bg-gradient-to-br from-purple-900 to-indigo-900"
  },
  {
    id: 9,
    title: "Ethereum LP",
    content: "Ethereum Starting LP: 5 ETH",
    background: "bg-gradient-to-br from-indigo-900 to-blue-900"
  },
  {
    id: 10,
    title: "Launch Tax",
    content: "Launch Tax: 5,10% Launch Tax (Sent to Marketing & Treasury)",
    background: "bg-gradient-to-br from-blue-900 to-purple-900"
  },
  {
    id: 11,
    title: "Social Media",
    content: "Twitter: @SnipeAI_ETH\nTelegram: @SnipeAI_ETH\nYoutube: Snipe AI_ETH",
    background: "bg-gradient-to-br from-purple-900 to-indigo-900"
  },
  {
    id: 12,
    title: "Token Listings",
    content: "Etherscan: [Placeholder]\nDextools: [Placeholder]\nDexscreener [Placeholder]",
    background: "bg-gradient-to-br from-indigo-900 to-blue-900"
  },
  {
    id: 13,
    title: "Partners",
    content: "Huge thanks go out to our partners! Dextools, Dexscreener, DWG Labs, and ByBit.",
    background: "bg-gradient-to-br from-blue-900 to-purple-900"
  },
  {
    id: 14,
    title: "Contact",
    content: "Questions? Comments? General Navl Gazings? Email us at: Admin@SnipeAI.io",
    background: "bg-gradient-to-br from-purple-900 to-indigo-900"
  },
  {
    id: 15,
    title: "THANKS FOR WATCHING!",
    content: "",
    background: "bg-gradient-to-br from-indigo-900 to-blue-900"
  }
];

const Slide = ({ title, content, background, isActive }) => (
  <div
    className={`absolute inset-0 transition-opacity duration-500 ${
      isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'
    } ${background}`}
  >
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <h2 className="text-4xl md:text-6xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
        {title}
      </h2>
      {content && (
        <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto whitespace-pre-line">
          {content}
        </p>
      )}
    </div>
  </div>
);

const Snipenomics = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    let interval;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
  };

  return (
    <div className="relative h-screen">
      {/* Slides */}
      {slides.map((slide, index) => (
        <Slide key={slide.id} {...slide} isActive={currentSlide === index} />
      ))}

      {/* Navigation Controls */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center space-x-4">
        <button
          onClick={goToPrevSlide}
          className="p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                currentSlide === index
                  ? 'bg-blue-500 w-4'
                  : 'bg-gray-400 hover:bg-gray-300'
              }`}
            />
          ))}
        </div>

        <button
          onClick={goToNextSlide}
          className="p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 transition-all"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Play/Pause Button */}
      <button
        onClick={() => setIsAutoPlaying(!isAutoPlaying)}
        className="absolute top-8 right-8 px-4 py-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 transition-all"
      >
        {isAutoPlaying ? 'Pause' : 'Play'}
      </button>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800">
        <div
          className="h-full bg-blue-500 transition-all duration-500"
          style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default Snipen