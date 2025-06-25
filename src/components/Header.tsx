import React, { useState } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { NAV_ITEMS } from '../utils/constants';
import { useTheme } from '../context/ThemeContext';
import logoLight from '../assets/videos/logo_white.png';
import logoDark from '../assets/videos/logo_dark.png';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const handleViewCoaches = () => {
    // Scroll to services section
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/30 dark:bg-gray-900/30 backdrop-blur-lg border-b border-white/20 dark:border-gray-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 md:h-24">
          {/* Logo and Slogan */}
          <div className="flex items-center space-x-4">
            <img
              src={theme === 'dark' ? logoDark : logoLight}
              alt="Heal Fitness Zone Logo"
              className="w-14 h-14 md:w-16 md:h-16 object-contain rounded-full border-2 border-green-400 bg-white dark:bg-gray-900"
            />
            <div className="flex flex-col">
              <span className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white leading-tight">Heal Fitness Zone</span>
              <span className="text-xs md:text-sm text-green-600 dark:text-green-400 font-medium tracking-wide mt-1">Empowering Wellness, Inspiring Lives</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 font-medium transition-colors duration-200 text-sm lg:text-base"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            <button className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 font-medium text-sm lg:text-base">
              Login
            </button>
            <button 
              onClick={handleViewCoaches}
              className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 lg:px-6 lg:py-2 rounded-full font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 text-sm lg:text-base"
            >
              View Coaches
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
          <div className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="block px-3 py-3 text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 font-medium touch-manipulation"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <div className="pt-4 space-y-3 border-t border-gray-100 dark:border-gray-700 mt-3">
                <button 
                  onClick={toggleTheme}
                  className="w-full flex justify-between items-center px-3 py-3 text-gray-700 dark:text-gray-200 font-medium touch-manipulation"
                >
                  <span>Switch Theme</span>
                  {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                </button>
                <button className="block w-full text-left px-3 py-3 text-gray-700 dark:text-gray-200 font-medium touch-manipulation">
                  Login
                </button>
                <button 
                  onClick={() => {
                    handleViewCoaches();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-3 py-3 rounded-lg font-semibold touch-manipulation"
                >
                  View Coaches
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