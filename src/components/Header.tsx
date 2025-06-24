import React, { useState } from 'react';
import { Menu, X, Heart } from 'lucide-react';
import { NAV_ITEMS } from '../utils/constants';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleAppDownload = () => {
    // Scroll to app download section
    const appSection = document.getElementById('app-download');
    if (appSection) {
      appSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 md:w-8 md:h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Heart className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
            <span className="text-lg md:text-xl font-bold text-gray-900">HealFitness Zone</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-gray-700 hover:text-green-600 font-medium transition-colors duration-200 text-sm lg:text-base"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
            <button className="text-gray-700 hover:text-green-600 font-medium text-sm lg:text-base">
              Login
            </button>
            <button 
              onClick={handleAppDownload}
              className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 lg:px-6 lg:py-2 rounded-full font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 text-sm lg:text-base"
            >
              Download App
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 touch-manipulation"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="block px-3 py-3 text-gray-700 hover:text-green-600 font-medium touch-manipulation"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <div className="pt-4 space-y-3 border-t border-gray-100 mt-3">
                <button className="block w-full text-left px-3 py-3 text-gray-700 font-medium touch-manipulation">
                  Login
                </button>
                <button 
                  onClick={() => {
                    handleAppDownload();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-3 py-3 rounded-lg font-semibold touch-manipulation"
                >
                  Download App
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;