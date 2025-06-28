import React, { useState } from 'react';
import { Eye, EyeOff, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#4285F4" d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,5 12,5C14.5,5 16.22,6.17 17.07,6.98L19.07,5.06C17.02,3.27 14.66,2 12,2C6.48,2 2,6.48 2,12C2,17.52 6.48,22 12,22C17.52,22 22,17.52 22,12C22,11.63 21.95,11.35 21.89,11.1H21.35Z"/></svg>
);

const FacebookIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#1877F2" d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.69 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.32 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z"/></svg>
);

// Simple random ID generator for demo purposes
function randomId() {
  return 'user_' + Math.random().toString(36).substr(2, 9);
}

function SignUp({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const navigate = useNavigate();

  const checkUsernameUnique = async (username: string) => {
    setCheckingUsername(true);
    setUsernameError(null);
    if (!username) {
      setUsernameError('Username is required');
      setCheckingUsername(false);
      return false;
    }
    try {
      const res = await fetch(`/api/profile/username/${encodeURIComponent(username)}`);
      const data = await res.json();
      if (data.exists) {
        setUsernameError('Username already exists. Please choose another.');
        setCheckingUsername(false);
        return false;
      }
    } catch {
      setUsernameError('Could not check username. Try again.');
      setCheckingUsername(false);
      return false;
    }
    setCheckingUsername(false);
    return true;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (!(await checkUsernameUnique(username))) {
      setLoading(false);
      return;
    }
    const id = randomId();
    console.log('Signup payload:', { id, email, password, fullName, username });
    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, email, password, fullName, username })
      });
      const data = await res.json();
      if (data.success) {
        navigate('/onboarding', { state: { id, email } });
        if (typeof onClose === 'function') onClose();
      } else {
        setError(data.error || 'Signup failed.');
      }
    } catch (err: any) {
      setError(err.message || 'Signup failed.');
    }
    setLoading(false);
  };

  return (
    <div className="relative max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 border border-gray-200">
      {/* Header Row: Heading and Close Button */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 flex justify-center">
          <div className="flex flex-col items-center w-full">
            <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-1 whitespace-nowrap">Let's start your journey</h2>
            <p className="text-center text-gray-500 text-base mt-0">Create your account to get started.</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="ml-4 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full p-2 transition-colors"
          aria-label="Close sign up"
        >
          <X size={20} />
        </button>
      </div>
      
      <form onSubmit={handleSignUp} className="space-y-4">
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
          onChange={async e => {
            setUsername(e.target.value);
            if (e.target.value.length > 2) await checkUsernameUnique(e.target.value);
          }}
          required
          className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-400 outline-none transition-all"
        />
        {usernameError && <p className="text-red-500 text-sm text-center">{usernameError}</p>}
        <input 
          type="email" 
          placeholder="Email address" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-400 outline-none transition-all" />
        
        <div className="relative">
          <input 
            type={showPassword ? 'text' : 'password'} 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-400 outline-none transition-all pr-12" />
          <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" onClick={() => setShowPassword(s => !s)}>
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        
        <button 
          type="submit" 
          className="w-full bg-gray-900 text-white font-bold py-3 px-6 rounded-xl mt-2 hover:bg-gray-800 transition-colors text-lg disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Continue'}
        </button>
      </form>

      <div className="flex items-center my-6">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="mx-4 text-gray-400 text-sm font-semibold">OR</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <div className="flex justify-center gap-4">
        <button className="bg-white border border-gray-300 rounded-full p-3 shadow-md hover:shadow-lg hover:bg-gray-50 transition-all">
          <GoogleIcon />
        </button>
        <button className="bg-white border border-gray-300 rounded-full p-3 shadow-md hover:shadow-lg hover:bg-gray-50 transition-all">
          <FacebookIcon />
        </button>
      </div>
    </div>
  );
}

export default SignUp; 