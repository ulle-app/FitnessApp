import React, { useState, useRef } from 'react';
import logoWhite from '../assets/videos/logo_white.png';
import logoDark from '../assets/videos/logo_dark.png';
import { X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

const OTP_LENGTH = 6;

function generateId() {
  if (window.crypto && window.crypto.randomUUID) {
    return window.crypto.randomUUID();
  }
  return 'user_' + Math.random().toString(36).substr(2, 9);
}

const AuthModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<'phone' | 'otp' | 'success'>('phone');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const isValidPhone = /^\d{10}$/.test(phone);
  const isValidPassword = password.length >= 6;

  const checkPhoneUnique = async (phone: string) => {
    if (!phone) return false;
    try {
      const res = await fetch(`/api/profile/phone/${encodeURIComponent(phone)}`);
      if (!res.ok) {
        setError('Could not check phone number. Try again.');
        return false;
      }
      const text = await res.text();
      if (!text) {
        // Empty response means no user found - phone is unique
        return true;
      }
      const data = JSON.parse(text);
      console.log('Phone check response:', data);
      if (data && data.id) {
        setError('Phone number already registered. Please log in.');
        return false;
      }
      return true;
    } catch (err) {
      console.log('Phone check error:', err);
      setError('Could not check phone number. Try again.');
      return false;
    }
  };

  const handleContinue = async () => {
    setError('');
    setLoading(true);
    if (!(await checkPhoneUnique(phone))) {
      setLoading(false);
      return;
    }
    // Simulate sending OTP
    const otpVal = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otpVal);
    setTimeout(() => {
      setStep('otp');
      setLoading(false);
      setOtp('');
    }, 800);
  };

  const handleOtpChange = (val: string, idx: number) => {
    if (!/^[0-9]?$/.test(val)) return;
    let newOtp = otp.split('');
    newOtp[idx] = val;
    setOtp(newOtp.join('').slice(0, OTP_LENGTH));
    if (val && idx < OTP_LENGTH - 1) {
      otpRefs.current[idx + 1]?.focus();
    }
    if (!val && idx > 0) {
      otpRefs.current[idx - 1]?.focus();
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (otp.length !== OTP_LENGTH) {
      setError('Please enter the 6-digit OTP.');
      return;
    }
    if (otp === generatedOtp) {
      setLoading(true);
      try {
        const id = generateId();
        const res = await fetch('/api/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, phone, password, username })
        });
        const data = await res.json();
        if (data.success) {
          setStep('success');
          setTimeout(() => {
            navigate('/hero-story');
            onClose();
          }, 2000);
        } else {
          setError(data.error || 'Failed to register phone number.');
        }
      } catch (err: any) {
        setError('Network error. Please try again.');
      }
      setLoading(false);
    } else {
      setError('Invalid OTP. Please try again.');
    }
  };

  // Add effect to auto-switch to login on specific errors
  React.useEffect(() => {
    if (error && (error.includes('already registered') || error.includes('already exists'))) {
      const timer = setTimeout(() => {
        if (typeof onClose === 'function') onClose();
        // Dispatch event to open login with prefill
        window.dispatchEvent(new CustomEvent('open-login-with-prefill', { detail: { prefill: phone } }));
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [error, onClose, phone]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
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
          className={`w-14 h-14 md:w-16 md:h-16 object-contain rounded-full border-2 border-green-400 bg-white dark:bg-gray-900 mx-auto mb-4`}
        />
        <div className="text-3xl font-extrabold text-white mb-8 tracking-tight text-center">Heal Fitness Zone</div>
        {step === 'phone' && (
          <>
            {/* Phone Input */}
            <div className="w-full mb-4">
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
                />
              </div>
            </div>
            {/* Username Input */}
            <div className="w-full mb-4">
              <div className="flex items-center border-b border-gray-600">
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Choose a username"
                  className="flex-1 bg-transparent text-white placeholder-gray-400 py-3 px-2 text-lg outline-none focus:outline-none"
                  disabled={loading}
                  required
                />
              </div>
            </div>
            {/* Password Input */}
            <div className="w-full mb-6 relative">
              <div className="flex items-center border-b border-gray-600">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Create a password (min 6 chars)"
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
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            {/* Continue Button */}
            <button
              className={`w-full py-3 rounded-xl font-bold text-lg mb-6 transition-colors ${isValidPhone && isValidPassword ? 'bg-white text-black hover:bg-gray-200' : 'bg-gray-700 text-gray-400 cursor-not-allowed'}`}
              disabled={!isValidPhone || !isValidPassword || loading}
              onClick={handleContinue}
            >
              {loading ? 'Sending OTP...' : 'CONTINUE'}
            </button>
            {/* Or connect with */}
            <div className="w-full flex flex-col items-center mb-4">
              <div className="text-gray-400 text-sm mb-3">Or connect with</div>
              <div className="flex gap-4">
                <button className="bg-gray-800 hover:bg-gray-700 p-3 rounded-full text-white shadow-md transition-colors">
                  <svg width="24" height="24" viewBox="0 0 24 24"><path fill="#4285F4" d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,5 12,5C14.5,5 16.22,6.17 17.07,6.98L19.07,5.06C17.02,3.27 14.66,2 12,2C6.48,2 2,6.48 2,12C2,17.52 6.48,22 12,22C17.52,22 22,17.52 22,12C22,11.63 21.95,11.35 21.89,11.1H21.35Z"/></svg>
                </button>
                <button className="bg-gray-800 hover:bg-gray-700 p-3 rounded-full text-white shadow-md transition-colors">
                  <svg width="24" height="24" viewBox="0 0 24 24"><path fill="#1877F2" d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.69 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.32 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z"/></svg>
                </button>
                <button className="bg-gray-800 hover:bg-gray-700 p-3 rounded-full text-white shadow-md transition-colors">
                  <svg width="24" height="24" viewBox="0 0 24 24"><path fill="#fff" d="M12 12.713l11.985-8.713v17.25c0 .825-.675 1.5-1.5 1.5h-20.97c-.825 0-1.5-.675-1.5-1.5v-17.25z"/><path fill="#d54c3f" d="M12 12.713l-11.985-8.713h23.97z"/></svg>
                </button>
              </div>
            </div>
            {/* Terms and Privacy */}
            <div className="text-xs text-gray-400 text-center mt-4">
              * By Continuing you agree to the{' '}
              <a href="#" className="underline hover:text-white">Terms of Services</a> and{' '}
              <a href="#" className="underline hover:text-white">Privacy policy</a>.
            </div>
            {/* Error Message */}
            {error && (
              <div className="text-red-400 text-center font-semibold animate-shake mb-2">
                {error}
                {(error.includes('already registered') || error.includes('already exists')) && (
                  <div className="text-xs text-blue-300 mt-1">Redirecting to login...</div>
                )}
              </div>
            )}
          </>
        )}
        {step === 'otp' && (
          <form onSubmit={handleOtpSubmit} className="w-full flex flex-col items-center animate-fade-in">
            <div className="mb-6 w-full">
              <div className="text-white text-lg font-semibold mb-2 text-center">Enter the 6-digit OTP sent to your phone</div>
              <div className="text-xs text-gray-400 text-center mb-2">(Demo: <span className="font-mono text-green-400">{generatedOtp}</span>)</div>
              <div className="flex justify-center gap-2 mt-4">
                {[...Array(OTP_LENGTH)].map((_, i) => (
                  <input
                    key={i}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={otp[i] || ''}
                    ref={el => otpRefs.current[i] = el}
                    onChange={e => handleOtpChange(e.target.value, i)}
                    onFocus={e => e.target.select()}
                    className="w-12 h-14 text-2xl text-center rounded-xl border border-gray-300 bg-white/80 text-white focus:bg-white focus:ring-2 focus:ring-green-400 outline-none transition-all shadow-sm font-mono"
                    autoFocus={i === 0}
                    required={i === 0}
                  />
                ))}
              </div>
              {error && <div className="text-red-500 text-center font-semibold mt-4 animate-shake">{error}</div>}
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold py-3 px-6 rounded-xl mt-2 hover:from-green-600 hover:to-blue-600 shadow-lg transition-all text-lg disabled:opacity-50"
              disabled={otp.length !== OTP_LENGTH || loading}
            >
              {loading ? 'Registering...' : 'Verify OTP'}
            </button>
          </form>
        )}
        {step === 'success' && (
          <div className="flex flex-col items-center justify-center min-h-[200px] animate-fade-in">
            <h2 className="text-3xl font-extrabold text-green-500 mb-4">Welcome!</h2>
            <div className="text-6xl mb-4">🎉</div>
            <p className="text-lg text-white mb-2">Your phone number <span className="font-mono text-green-400">+91 {phone}</span> has been registered as your primary account.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal; 