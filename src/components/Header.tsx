import React, { useState, useRef } from 'react';
import { Menu, X, Sun, Moon, User as UserIcon, UserPlus, Camera, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { NAV_ITEMS } from '../utils/constants';
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import Login from './Login';

export interface HeaderProps {
  onLoginClick?: () => void;
  onSignupClick?: () => void;
  onChangePassword?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLoginClick, onSignupClick, onChangePassword }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, setUser, logout } = useUser();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleAvatarClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        setUser({ ...user, photo: base64, defaultAvatar: undefined });
        await fetch('/api/profile/photo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ photo: base64 })
        });
      };
      reader.readAsDataURL(file);
    } finally {
      setUploading(false);
    }
  };

  const handleViewCoaches = () => {
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Add a global event listener for auto-switch from signup to login
  React.useEffect(() => {
    const handler = (e: any) => {
      if (e.detail && e.detail.prefill) {
        navigate('/login');
      }
    };
    window.addEventListener('open-login-with-prefill', handler);
    return () => window.removeEventListener('open-login-with-prefill', handler);
  }, [navigate]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/30 dark:bg-gray-900/30 backdrop-blur-lg border-b border-white/20 dark:border-gray-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 md:h-24">
          {/* Logo and Slogan */}
          <Link to="/" className="flex items-center space-x-4 group">
            <img
              src={theme === 'dark' ? '/logo_dark.png' : '/logo_white.png'}
              alt="Heal Fitness Zone Logo"
              className="w-14 h-14 md:w-16 md:h-16 object-contain rounded-full border-2 border-green-400 bg-white dark:bg-gray-900 group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col">
              <span className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white leading-tight group-hover:text-green-500 transition-colors">Heal Fitness Zone</span>
              <span className="text-xs md:text-sm text-green-600 dark:text-green-400 font-medium tracking-wide mt-1">Empowering Wellness, Inspiring Lives</span>
            </div>
          </Link>

          {/* Desktop: Only show avatar/photo and logout if logged in */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <div className="relative group">
                  <div
                    className={`w-12 h-12 rounded-full border-2 border-green-400 bg-white dark:bg-gray-900 flex items-center justify-center overflow-hidden shadow cursor-pointer hover:scale-105 transition-all ${uploading ? 'opacity-60' : ''}`}
                    onClick={handleAvatarClick}
                    title="Update profile photo"
                  >
                    {user.photo ? (
                      <img src={user.photo} alt="Profile" className="object-cover w-full h-full" />
                    ) : user.defaultAvatar ? (
                      <span className="text-2xl select-none">{user.defaultAvatar}</span>
                    ) : (
                      <span className="text-gray-400 text-2xl flex items-center justify-center w-full h-full">
                        <UserIcon className="w-8 h-8" />
                      </span>
                    )}
                  </div>
                  {uploading && <span className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-white/60 dark:bg-gray-900/60 rounded-full"><svg className="animate-spin h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg></span>}
                </div>
                {user.role === 'admin' && (
                  <button
                    onClick={onChangePassword}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium text-sm lg:text-base px-3 py-2 rounded transition border border-blue-100 bg-blue-50 hover:bg-blue-100"
                    title="Change Password"
                  >
                    <Lock className="w-5 h-5" />
                    <span className="hidden md:inline">Change Password</span>
                  </button>
                )}
                <button
                  onClick={() => { logout(); navigate('/', { replace: true }); }}
                  className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 font-medium text-sm lg:text-base ml-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-green-500 text-white px-4 py-2 lg:px-6 lg:py-2 rounded-full font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 text-sm lg:text-base"
                >
                  <UserIcon className="w-5 h-5" />
                  Login
                </button>
                {/* Signup button only visible when not logged in */}
                <button
                  onClick={typeof onSignupClick === 'function' ? onSignupClick : () => setIsMenuOpen(true)}
                  className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 lg:px-6 lg:py-2 rounded-full font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 text-sm lg:text-base"
                >
                  <UserPlus className="w-5 h-5" />
                  Sign up to be healthy
                </button>
              </>
            )}
          </div>

          {/* Mobile: Only show avatar/photo and logout if logged in */}
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
              {user ? (
                <div className="flex items-center space-x-4 py-4">
                  <div
                    className={`w-12 h-12 rounded-full border-2 border-green-400 bg-white dark:bg-gray-900 flex items-center justify-center overflow-hidden shadow`}
                  >
                    {user.photo ? (
                      <img src={user.photo} alt="Profile" className="object-cover w-full h-full" />
                    ) : user.defaultAvatar ? (
                      <span className="text-2xl select-none">{user.defaultAvatar}</span>
                    ) : (
                      <span className="text-gray-400 text-2xl flex items-center justify-center w-full h-full">
                        <UserIcon className="w-8 h-8" />
                      </span>
                    )}
                  </div>
                  <button className="text-gray-700 dark:text-gray-200 font-medium" onClick={logout}>
                    Logout
                  </button>
                </div>
              ) : (
                <>
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
                    <button className="block w-full text-left px-3 py-3 text-gray-700 dark:text-gray-200 font-medium touch-manipulation" onClick={() => navigate('/login')}>
                      Login
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;