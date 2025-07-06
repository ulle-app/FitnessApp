import React, { useState } from 'react';
import logoDark from '../assets/videos/logo_dark.png';
import { Eye, EyeOff, X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

function Login({ onLogin, onClose, prefillPhone }: { onLogin?: (user: any) => void, onClose?: () => void, prefillPhone?: string }) {
  const [phone, setPhone] = useState(prefillPhone || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
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
      const fullPhone = '+91' + phone;
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: fullPhone, password })
      });
      const data = await res.json();
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
      } else {
        setError(data.error || 'Login failed. Please try again.');
        setLoading(false);
      }
    } catch (err: any) {
      setError('Network error. Please try again.');
      setLoading(false);
    }
  };

  const handleShowForgot = () => {
    setShowForgot(true);
    setResetPhone(phone);
  };

  return (
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
    </div>
  );
}

export default Login;