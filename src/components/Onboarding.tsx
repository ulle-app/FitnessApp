import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

function Onboarding() {
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // const checkUser = async () => {
    //   const { data: { user } } = await supabase.auth.getUser();
    //   if (!user) {
    //     navigate('/'); // Redirect to home if no user is logged in
    //   }
    //   setLoading(false);
    // };
    // checkUser();
    setLoading(false);
  }, [navigate]);

  const handleOnboardingComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    // Here you would typically save the user's details to your 'clients' or 'profiles' table
    // For now, we'll just log it and redirect
    console.log('Onboarding complete for:', user?.email, 'with name:', fullName);

    alert('Onboarding complete! You will now be redirected to the homepage.');
    navigate('/');
    setLoading(false);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center mb-2">Welcome!</h2>
        <p className="text-center text-gray-600 mb-6">Let's set up your profile.</p>
        <form onSubmit={handleOnboardingComplete} className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              id="fullName"
              type="text"
              placeholder="Your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-400 outline-none transition-all"
              required
            />
          </div>
          {/* Add more fields here for goals, etc. */}
          <button
            type="submit"
            className="w-full bg-green-600 text-white font-bold py-3 px-6 rounded-xl mt-2 hover:bg-green-700 transition-colors text-lg"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Complete Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Onboarding;