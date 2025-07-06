import React, { useState, useRef } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

interface LoginProps {
  onClose?: () => void;
  prefillPhone?: string;
}

const Login: React.FC<LoginProps> = ({ onClose, prefillPhone }) => {
  const [identifier, setIdentifier] = useState(prefillPhone || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isPhone, setIsPhone] = useState(true);
  const { theme } = useTheme();
  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    console.log('Login attempt:', { isPhone, identifier, password });

    try {
      const loginData = isPhone 
        ? { phone: identifier, password }
        : { email: identifier, password };
      
      console.log('Sending login request with data:', loginData);

      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });

      console.log('Login response status:', res.status);
      const data = await res.json();
      console.log('Login response data:', data);
      
      if (data.success) {
        setUser(data.user);
        onClose?.();
        
        // Check if profile is complete
        const isTrainer = data.user.role === 'trainer' || data.user.role === 'expert';
        const required = ['fullName', 'gender', 'dob', 'height', 'weight'];
        const isComplete = isTrainer || required.every(field => data.user[field]);
        
        if (isComplete) {
          if (data.user.role === 'trainer') {
            navigate('/trainer');
          } else if (data.user.role === 'expert') {
            navigate('/expert');
          } else {
            navigate('/dashboard');
          }
        } else {
          navigate('/timeline');
        }
      } else {
        setError(data.error || 'Login failed. Please try again.');
        setLoading(false);
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError('Network error. Please try again.');
    }
  };

  return (
    <div className="relative bg-black rounded-3xl shadow-2xl w-full max-w-md mx-auto p-8 flex flex-col items-center animate-fade-in">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl focus:outline-none"
        aria-label="Close"
        style={{ display: onClose ? 'block' : 'none' }}
      >
        <X size={28} />
      </button>

      {/* Logo and App Name */}
      <img
        src={theme === 'dark' ? '/logo_dark.png' : '/logo_white.png'}
        alt="Heal Fitness Zone Logo"
        className="w-14 h-14 md:w-16 md:h-16 object-contain rounded-full border-2 border-green-400 bg-white dark:bg-gray-900 mx-auto mb-4"
      />
      <div className="text-3xl font-extrabold text-white mb-8 tracking-tight text-center">Welcome Back</div>

      <form onSubmit={handleLogin} className="w-full flex flex-col gap-6">
        {/* Login Type Toggle */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <button
            type="button"
            onClick={() => setIsPhone(true)}
            className={`px-4 py-2 rounded-xl font-semibold transition-colors ${
              isPhone 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Phone
          </button>
          <button
            type="button"
            onClick={() => setIsPhone(false)}
            className={`px-4 py-2 rounded-xl font-semibold transition-colors ${
              !isPhone 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Email
          </button>
        </div>

        {/* Identifier Input */}
        <div className="w-full">
          <div className="flex items-center border-b border-gray-600">
            {isPhone && <span className="text-white text-lg font-semibold mr-2">+91</span>}
            <input
              type={isPhone ? "tel" : "email"}
              maxLength={isPhone ? 10 : undefined}
              value={identifier}
              onChange={e => setIdentifier(isPhone ? e.target.value.replace(/\D/g, '') : e.target.value)}
              placeholder={isPhone ? "Enter your phone number" : "Enter your email"}
              className="flex-1 bg-transparent text-white placeholder-gray-400 py-3 px-2 text-lg outline-none focus:outline-none"
              disabled={loading}
              required
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="w-full relative">
          <div className="flex items-center border-b border-gray-600">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="flex-1 bg-transparent text-white placeholder-gray-400 py-3 px-2 text-lg outline-none focus:outline-none"
              disabled={loading}
              required
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              onClick={() => setShowPassword(v => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-red-400 text-center font-semibold animate-shake">
            {error}
          </div>
        )}

        {/* Login Button */}
        <button
          type="submit"
          className="w-full py-3 rounded-xl font-bold text-lg transition-colors bg-white text-black hover:bg-gray-200 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Signing In...' : 'SIGN IN'}
        </button>

        {/* Forgot Password */}
        <div className="text-center">
          <button
            type="button"
            className="text-gray-400 hover:text-white text-sm underline"
          >
            Forgot Password?
          </button>
        </div>

        {/* Social Login */}
        <div className="w-full flex flex-col items-center">
          <div className="text-gray-400 text-sm mb-3">Or connect with</div>
          <div className="flex gap-4">
            <button type="button" className="bg-gray-800 hover:bg-gray-700 p-3 rounded-full text-white shadow-md transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24"><path fill="#4285F4" d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,5 12,5C14.5,5 16.22,6.17 17.07,6.98L19.07,5.06C17.02,3.27 14.66,2 12,2C6.48,2 2,6.48 2,12C2,17.52 6.48,22 12,22C17.52,22 22,17.52 22,12C22,11.63 21.95,11.35 21.89,11.1H21.35Z"/></svg>
            </button>
            <button type="button" className="bg-gray-800 hover:bg-gray-700 p-3 rounded-full text-white shadow-md transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24"><path fill="#1877F2" d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.69 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.32 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z"/></svg>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;