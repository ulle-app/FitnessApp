import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login({ onLogin }: { onLogin: (user: any) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('http://localhost:4000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success) {
        onLogin(data.user);
        navigate('/onboarding', { state: { id: data.user.id, email: data.user.email } });
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4 max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8 mt-12">
      <h2 className="text-2xl font-bold text-center mb-4">Sign In</h2>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Email"
        required
        className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-400 outline-none transition-all"
      />
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Password"
        required
        className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-400 outline-none transition-all"
      />
      {error && <div className="text-red-500 text-center font-semibold">{error}</div>}
      <button
        type="submit"
        className="w-full bg-green-600 text-white font-bold py-3 px-6 rounded-xl mt-2 hover:bg-green-700 transition-colors text-lg disabled:opacity-50"
        disabled={loading}
      >
        {loading ? 'Signing In...' : 'Sign In'}
      </button>
    </form>
  );
}

export default Login;