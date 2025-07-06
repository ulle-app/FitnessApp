import React, { useState, useRef, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';


interface ModernSignUpProps {
  onClose: () => void;
}

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function randomId() {
  return 'user_' + Math.random().toString(36).substr(2, 9);
}

const Confetti: React.FC = () => {
  // Simple confetti animation using emoji
  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      <div className="text-6xl animate-bounce">🎉🎊✨</div>
    </div>
  );
};

const ModernSignUp: React.FC<ModernSignUpProps> = ({ onClose }) => {
  const { setUser } = useUser();
  const navigate = useNavigate();
  const [step, setStep] = useState<'signup' | 'otp' | 'success'>('signup');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [timer, setTimer] = useState(30); // 30 seconds for OTP
  const timerRef = useRef<number | null>(null);
  const [userId] = useState(randomId());
  const [otpAttempts, setOtpAttempts] = useState(0);
  const [lockout, setLockout] = useState(false);
  const [lockoutTimer, setLockoutTimer] = useState(60);
  const lockoutRef = useRef<number | null>(null);
  const [fullName, setFullName] = useState('');

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

  useEffect(() => {
    if (step === 'success') {
      setShowConfetti(true);
      const timer = setTimeout(() => {
        setShowConfetti(false);
        onClose();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [step, onClose]);

  useEffect(() => {
    if (step === 'otp') {
      setTimer(30);
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }
  }, [step, generatedOtp]);

  // Lockout timer effect
  useEffect(() => {
    if (lockout) {
      setLockoutTimer(60);
      if (lockoutRef.current) clearInterval(lockoutRef.current);
      lockoutRef.current = setInterval(() => {
        setLockoutTimer(prev => {
          if (prev <= 1) {
            setLockout(false);
            if (lockoutRef.current) clearInterval(lockoutRef.current);
            return 60;
          }
          return prev - 1;
        });
      }, 1000);
      return () => { if (lockoutRef.current) clearInterval(lockoutRef.current); };
    }
  }, [lockout]);

  // Add effect to auto-switch to login on specific errors
  useEffect(() => {
    if (error && (error.includes('already registered') || error.includes('already exists'))) {
      const timer = setTimeout(() => {
        if (typeof onClose === 'function') onClose();
        // Dispatch event to open login with prefill
        window.dispatchEvent(new CustomEvent('open-login-with-prefill', { detail: { prefill: mobile } }));
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [error, onClose, mobile]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!fullName || !username || !password || !mobile) {
      setError('Please fill all fields.');
      return;
    }
    if (!/^[0-9]{10}$/.test(mobile)) {
      setError('Enter a valid 10-digit mobile number.');
      return;
    }
    setLoading(true);
    if (!(await checkPhoneUnique(mobile))) {
      setLoading(false);
      return;
    }
    // Simulate backend call and OTP send
    setTimeout(() => {
      setGeneratedOtp(generateOTP());
      setStep('otp');
      setLoading(false);
      setOtp('');
    }, 800);
  };

  const handleOtpChange = (val: string, idx: number) => {
    if (!/^[0-9]?$/.test(val)) return;
    let newOtp = otp.split('');
    newOtp[idx] = val;
    setOtp(newOtp.join('').slice(0, 6));
    if (val && idx < 5) {
      otpRefs.current[idx + 1]?.focus();
    }
    if (!val && idx > 0) {
      otpRefs.current[idx - 1]?.focus();
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (lockout) return;
    if (otp.length !== 6) {
      setError('Please enter the 6-digit OTP.');
      return;
    }
    if (otp === generatedOtp) {
      setLoading(true);
      try {
        // Store user in DB
        const res = await fetch('/api/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: userId, username, password, phone: mobile, fullName })
        });
        const data = await res.json();
        if (!data.success) {
          setError(data.error || 'Failed to save user.');
          setLoading(false);
          return;
        }
        // Auto-login after signup
        const loginRes = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: mobile, password })
        });
        const loginData = await loginRes.json();
        if (loginData.success) {
          setUser(loginData.user);
          setStep('success');
          setOtpAttempts(0);
          setTimeout(() => {
            navigate('/hero-story');
            onClose();
          }, 2000);
        } else {
          setError('Signup succeeded but login failed. Please try logging in.');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to save user.');
      }
      setLoading(false);
    } else {
      // Wrong OTP: send new OTP, reset timer, clear input, increment attempts
      const newAttempts = otpAttempts + 1;
      setOtpAttempts(newAttempts);
      console.warn(`Failed OTP attempt #${newAttempts} for user ${username || userId}`);
      if (newAttempts >= 3) {
        setLockout(true);
        setError('Too many wrong attempts. Please wait 60 seconds before trying again.');
        setOtp('');
        return;
      }
      const newOtp = generateOTP();
      setGeneratedOtp(newOtp);
      setOtp('');
      setError('Invalid OTP. A new OTP has been sent.');
      setTimer(30);
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      otpRefs.current[0]?.focus();
    }
  };

  // Reset attempts on resend
  const handleResendOtp = () => {
    const newOtp = generateOTP();
    setGeneratedOtp(newOtp);
    setOtp('');
    setError('');
    otpRefs.current[0]?.focus();
    setTimer(30);
    setOtpAttempts(0);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="relative max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 border border-gray-200 animate-fade-in">
      {showConfetti && <Confetti />}
      {step === 'signup' && (
        <form onSubmit={handleSignUp} className="w-full flex flex-col gap-6 animate-fade-in">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-extrabold text-gray-900 text-center flex-1">
              <img src="/logo_dark.png" alt="Heal Fitness Zone Logo" className="w-10 h-10 mx-auto mb-2 rounded-full border-2 border-green-400 bg-white" />
              Sign Up
            </h2>
            <button onClick={onClose} type="button" className="ml-4 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full p-2 transition-colors" aria-label="Close sign up">✕</button>
          </div>
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-400 outline-none transition-all"
          />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-400 outline-none transition-all"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-400 outline-none transition-all"
          />
          <input
            type="tel"
            placeholder="Mobile Number"
            value={mobile}
            onChange={e => setMobile(e.target.value.replace(/\D/g, ''))}
            maxLength={10}
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-400 outline-none transition-all"
          />
          {error && <div className="text-red-500 text-center font-semibold animate-shake">{error}</div>}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold py-3 px-6 rounded-xl mt-2 hover:from-green-600 hover:to-blue-600 shadow-lg transition-all text-lg disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Sending OTP...' : 'Continue'}
          </button>
        </form>
      )}
      {step === 'otp' && (
        <form onSubmit={handleOtpSubmit} className="space-y-6 animate-fade-in">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-blue-400 flex items-center justify-center mb-4 shadow-lg animate-pulse-glow">
              <span className="text-white text-2xl font-bold">🔒</span>
            </div>
            <h2 className="text-2xl font-extrabold text-center mb-2 text-gray-900 drop-shadow-sm">Verify OTP</h2>
            <div className="text-center text-gray-500 mb-2">Enter the 6-digit code sent to your mobile number.</div>
            <div className="text-center text-xs text-gray-400 mb-2">(Demo: <span className="font-mono text-green-600">{generatedOtp}</span>)</div>
          </div>
          {/* Segmented OTP input */}
          <div className="flex justify-center gap-2 mb-2">
            {[0,1,2,3,4,5].map(i => (
              <input
                key={i}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={otp[i] || ''}
                ref={el => otpRefs.current[i] = el}
                onChange={e => handleOtpChange(e.target.value, i)}
                onFocus={e => e.target.select()}
                className="w-12 h-14 text-2xl text-center rounded-xl border border-gray-300 bg-white/80 focus:bg-white focus:ring-2 focus:ring-green-400 outline-none transition-all shadow-sm font-mono"
                autoFocus={i === 0}
                required={i === 0}
                disabled={lockout}
              />
            ))}
          </div>
          {/* Timer Progress bar */}
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-2 relative">
            <div
              className="h-full bg-gradient-to-r from-green-400 to-blue-400 transition-all"
              style={{ width: `${100 - (timer / 30) * 100}%`, transition: 'width 1s linear' }}
            ></div>
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500 font-bold">
              {lockout ? `Locked: ${lockoutTimer}s` : timer > 0 ? `${timer}s` : ''}
            </span>
          </div>
          {error && <div className="text-red-500 text-center font-semibold animate-shake">{error}</div>}
          <div className="flex justify-between items-center mt-2">
            {timer === 0 && !lockout ? (
              <button
                type="button"
                className="text-sm text-blue-600 hover:underline font-semibold disabled:opacity-50"
                disabled={loading}
                onClick={handleResendOtp}
              >
                Resend OTP
              </button>
            ) : (
              <span className="text-xs text-gray-400 ml-2">{lockout ? 'Locked out' : 'Waiting for OTP...'}</span>
            )}
            {loading && <span className="text-xs text-gray-400 ml-2 animate-pulse">Verifying...</span>}
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold py-3 px-6 rounded-xl mt-2 hover:from-green-600 hover:to-blue-600 shadow-lg transition-all text-lg disabled:opacity-50"
            disabled={loading || otp.length !== 6 || lockout}
          >
            Verify OTP
          </button>
        </form>
      )}
      {step === 'success' && (
        <div className="flex flex-col items-center justify-center min-h-[300px] animate-fade-in">
          <h2 className="text-3xl font-extrabold text-green-600 mb-4">Welcome onboard!</h2>
          <div className="text-6xl mb-4">🎉</div>
          <p className="text-lg text-gray-700 mb-2">Your account has been created successfully.</p>
        </div>
      )}
    </div>
  );
};

export default ModernSignUp; 