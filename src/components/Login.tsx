<<<<<<< HEAD
import React, { useState } from 'react';
import logoDark from '../assets/videos/logo_dark.png';
import { Eye, EyeOff, X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

function Login({ onLogin, onClose, prefillPhone }: { onLogin?: (user: any) => void, onClose?: () => void, prefillPhone?: string }) {
  const [phone, setPhone] = useState(prefillPhone || '');
=======
import React, { useState, useRef } from 'react';
import logoWhite from '../assets/videos/logo_white.png';
import logoDark from '../assets/videos/logo_dark.png';
import { X, Eye, EyeOff } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

interface LoginProps {
  onClose: () => void;
  prefillPhone?: string;
}

const Login: React.FC<LoginProps> = ({ onClose, prefillPhone }) => {
  const [identifier, setIdentifier] = useState(prefillPhone || '');
>>>>>>> 131197f10628ddc4a74b2b9a6875df5ced2a62cf
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
<<<<<<< HEAD
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
=======
  const [isPhone, setIsPhone] = useState(true);
  const { theme } = useTheme();
  const { setUser } = useUser();
>>>>>>> 131197f10628ddc4a74b2b9a6875df5ced2a62cf
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [showForgot, setShowForgot] = useState(false);
  const [resetStep, setResetStep] = useState<'phone' | 'otp' | 'password'>('phone');
  const [resetPhone, setResetPhone] = useState('');
  const [resetOtp, setResetOtp] = useState('');
  const [resetSentOtp, setResetSentOtp] = useState('');
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
<<<<<<< HEAD
      const fullPhone = '+91' + phone;
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: fullPhone, password })
=======
      const loginData = isPhone 
        ? { phone: identifier, password }
        : { email: identifier, password };

      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
>>>>>>> 131197f10628ddc4a74b2b9a6875df5ced2a62cf
      });

      const data = await res.json();
<<<<<<< HEAD
      if (data.success && data.user) {
        setUser(data.user);
        setLoading(false);
        if (onLogin) onLogin(data.user);
        if (data.user.role === 'admin') navigate('/admin');
        else if (data.user.role === 'expert') navigate('/expert');
        else if (data.user.role === 'trainer') navigate('/trainer');
        else if (data.user.role === 'user') {
          navigate('/dashboard');
        }
        else setError('Unknown role. Please contact admin.');
=======
      
      if (data.success) {
        setUser(data.user);
        onClose();
        
        // Check if profile is complete
        const required = ['fullName', 'gender', 'dob', 'height', 'weight'];
        const isComplete = required.every(field => data.user[field]);
        
        if (isComplete) {
          navigate('/dashboard');
        } else {
          navigate('/timeline');
        }
>>>>>>> 131197f10628ddc4a74b2b9a6875df5ced2a62cf
      } else {
        setError(data.error || 'Login failed. Please try again.');
        setLoading(false);
      }
    } catch (err: any) {
      setError('Network error. Please try again.');
<<<<<<< HEAD
      setLoading(false);
=======
>>>>>>> 131197f10628ddc4a74b2b9a6875df5ced2a62cf
    }
  };

  const handleShowForgot = () => {
    setShowForgot(true);
    setResetPhone(phone);
  };

  return (
<<<<<<< HEAD
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="relative w-full max-w-xs sm:max-w-sm bg-[#18181b] rounded-2xl shadow-2xl p-6 sm:p-8 flex flex-col items-center">
        {!isLoginPage && onClose && (
          <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-white p-1 rounded-full focus:outline-none">
            <X className="w-5 h-5" />
          </button>
        )}
        <img src={logoDark} alt="Heal Fitness Zone" className="w-14 h-14 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white text-center mb-6">Heal Fitness Zone</h2>
        {!showForgot && (
          <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
            <div className="flex items-center border-b border-gray-600">
              <span className="text-white text-lg font-semibold mr-2">+91</span>
              <input
                type="tel"
                maxLength={10}
                value={phone}
                onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter your phone number"
                className="flex-1 bg-transparent text-white placeholder-gray-400 py-3 px-2 text-lg outline-none focus:outline-none focus:border-white"
                disabled={loading}
                required
              />
            </div>
            <div className="relative flex items-center border-b border-gray-600">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="flex-1 bg-transparent text-white placeholder-gray-400 py-3 px-2 text-lg outline-none focus:outline-none"
                disabled={loading}
                minLength={6}
                required
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                tabIndex={-1}
                onClick={() => setShowPassword(v => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <button type="button" className="text-xs text-blue-400 hover:underline text-right w-full mb-2" onClick={handleShowForgot}>
              Forgot Password?
            </button>
            {error && <div className="text-red-400 text-center font-semibold animate-shake mb-2">{error}</div>}
            <button
              type="submit"
              className={`w-full py-3 rounded-xl font-bold text-lg mb-2 transition-colors ${phone.length === 10 && password.length >= 6 ? 'bg-white text-black hover:bg-gray-200' : 'bg-gray-700 text-gray-400 cursor-not-allowed'}`}
              disabled={loading || phone.length !== 10 || password.length < 6}
            >
              {loading ? 'Signing In...' : 'CONTINUE'}
            </button>
          </form>
        )}
        {showForgot && (
          <div className="w-full flex flex-col gap-4 mt-2 animate-fade-in">
            {resetStep === 'phone' && (
              <>
                <div className="flex items-center border-b border-gray-600">
                  <span className="text-white text-lg font-semibold mr-2">+91</span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={resetPhone}
                    onChange={e => setResetPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter your phone number"
                    className="flex-1 bg-transparent text-white placeholder-gray-400 py-3 px-2 text-lg outline-none focus:outline-none focus:border-white"
                    disabled={resetLoading}
                    required
                  />
                </div>
                <button
                  type="button"
                  className="w-full py-2 rounded-xl font-bold text-base bg-white text-black hover:bg-gray-200 mt-2"
                  disabled={resetLoading || resetPhone.length !== 10}
                  onClick={async () => {
                    setResetLoading(true); setResetError('');
                    try {
                      const res = await fetch('/api/send-otp', {
                        method: 'POST', headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ phone: resetPhone })
                      });
                      const data = await res.json();
                      if (data.success && data.otp) {
                        setResetSentOtp(data.otp);
                        setResetStep('otp');
                      } else {
                        setResetError(data.error || 'Failed to send OTP.');
                      }
                    } catch {
                      setResetError('Network error.');
                    }
                    setResetLoading(false);
                  }}
                >Send OTP</button>
                {resetError && <div className="text-red-400 text-center font-semibold animate-shake mb-2">{resetError}</div>}
              </>
            )}
            {resetStep === 'otp' && (
              <>
                <div className="flex items-center border-b border-gray-600">
                  <input
                    type="text"
                    maxLength={6}
                    value={resetOtp}
                    onChange={e => setResetOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter OTP"
                    className="flex-1 bg-transparent text-white placeholder-gray-400 py-3 px-2 text-lg outline-none focus:outline-none focus:border-white"
                    disabled={resetLoading}
                    required
                  />
                </div>
                <button
                  type="button"
                  className="w-full py-2 rounded-xl font-bold text-base bg-white text-black hover:bg-gray-200 mt-2"
                  disabled={resetLoading || resetOtp.length !== 6}
                  onClick={async () => {
                    setResetLoading(true); setResetError('');
                    try {
                      const res = await fetch('/api/verify-otp', {
                        method: 'POST', headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ phone: resetPhone, otp: resetOtp })
                      });
                      const data = await res.json();
                      if (data.success) {
                        setResetStep('password');
                      } else {
                        setResetError(data.error || 'Invalid OTP.');
                      }
                    } catch {
                      setResetError('Network error.');
                    }
                    setResetLoading(false);
                  }}
                >Verify OTP</button>
                {resetError && <div className="text-red-400 text-center font-semibold animate-shake mb-2">{resetError}</div>}
                <div className="text-xs text-gray-400 text-center mt-2">(Demo OTP: <span className="font-mono text-green-400">{resetSentOtp}</span>)</div>
              </>
            )}
            {resetStep === 'password' && (
              <>
                <div className="relative flex items-center border-b border-gray-600">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={resetNewPassword}
                    onChange={e => setResetNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="flex-1 bg-transparent text-white placeholder-gray-400 py-3 px-2 text-lg outline-none focus:outline-none"
                    disabled={resetLoading}
                    minLength={6}
                    required
                  />
                </div>
                <button
                  type="button"
                  className="w-full py-2 rounded-xl font-bold text-base bg-white text-black hover:bg-gray-200 mt-2"
                  disabled={resetLoading || resetNewPassword.length < 6}
                  onClick={async () => {
                    setResetLoading(true); setResetError('');
                    try {
                      const res = await fetch('/api/update-password', {
                        method: 'POST', headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ phone: resetPhone, password: resetNewPassword })
                      });
                      const data = await res.json();
                      if (data.success) {
                        setShowForgot(false); setResetStep('phone'); setResetPhone(''); setResetOtp(''); setResetSentOtp(''); setResetNewPassword('');
                        setError('Password updated! Please login.');
                      } else {
                        setResetError(data.error || 'Failed to update password.');
                      }
                    } catch {
                      setResetError('Network error.');
                    }
                    setResetLoading(false);
                  }}
                >Update Password</button>
                {resetError && <div className="text-red-400 text-center font-semibold animate-shake mb-2">{resetError}</div>}
              </>
            )}
            <button type="button" className="text-xs text-gray-400 hover:underline mt-2" onClick={() => setShowForgot(false)}>Back to Login</button>
          </div>
        )}
        <div className="text-gray-400 text-center my-4 text-sm">Or connect with</div>
        <div className="flex justify-center gap-4 mb-4">
          <button className="bg-[#23272f] border border-gray-700 rounded-full p-3 shadow-md hover:shadow-lg hover:bg-gray-800 transition-all">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M21.805 10.023h-9.765v3.977h5.617c-.242 1.242-1.484 3.648-5.617 3.648-3.375 0-6.125-2.789-6.125-6.148 0-3.359 2.75-6.148 6.125-6.148 1.922 0 3.211.82 3.953 1.523l2.703-2.625c-1.703-1.57-3.891-2.523-6.656-2.523-5.523 0-10 4.477-10 10s4.477 10 10 10c5.781 0 9.609-4.055 9.609-9.773 0-.656-.07-1.156-.156-1.652z"/><path d="M3.545 7.119l3.285 2.409c.891-1.273 2.273-2.09 3.92-2.09 1.188 0 2.273.406 3.125 1.211l2.672-2.602c-1.484-1.367-3.375-2.047-5.797-2.047-3.672 0-6.797 2.477-7.938 5.919z"/></svg>
          </button>
          <button className="bg-[#23272f] border border-gray-700 rounded-full p-3 shadow-md hover:shadow-lg hover:bg-gray-800 transition-all">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.733 0-1.325.592-1.325 1.326v21.348c0 .733.592 1.326 1.325 1.326h11.495v-9.294h-3.128v-3.622h3.128v-2.672c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.311h3.587l-.467 3.622h-3.12v9.294h6.116c.733 0 1.325-.593 1.325-1.326v-21.35c0-.733-.592-1.326-1.325-1.326z"/></svg>
          </button>
          <button className="bg-[#23272f] border border-gray-700 rounded-full p-3 shadow-md hover:shadow-lg hover:bg-gray-800 transition-all">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
          </button>
        </div>
        <div className="text-xs text-gray-400 text-center mt-2">
          * By Continuing you agree to the{' '}
          <a href="#" className="underline hover:text-white">Terms of Services</a> and{' '}
          <a href="#" className="underline hover:text-white">Privacy policy</a>.
        </div>
      </div>
=======
    <div className="relative bg-black rounded-3xl shadow-2xl w-full max-w-md mx-auto p-8 flex flex-col items-center animate-fade-in">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl focus:outline-none"
        aria-label="Close"
      >
        <X size={28} />
      </button>

      {/* Logo and App Name */}
      <img
        src={theme === 'dark' ? logoDark : logoWhite}
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
>>>>>>> 131197f10628ddc4a74b2b9a6875df5ced2a62cf
    </div>
  );
};

export default Login;