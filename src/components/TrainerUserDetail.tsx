import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import WorkoutCard from './WorkoutCard';

const TrainerUserDetail: React.FC = () => {
  const { phone } = useParams<{ phone: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!phone) return;
    fetch(`/api/experts/user/${encodeURIComponent(phone)}`)
      .then(res => res.json())
      .then(setUser);
    fetch('/api/workouts')
      .then(res => res.json())
      .then(data => setWorkouts(data.workouts || []));
  }, [phone]);

  const handleToggle = (id: number) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSubmit = async () => {
    if (!user?.phone || selected.size === 0) return;
    setLoading(true);
    setSuccess(false);
    const res = await fetch('/api/trainer/assign-workout-bulk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_ids: [user.phone],
        workout_id: Array.from(selected),
        assigned_by: '' // TODO: set trainer phone from context
      })
    });
    if (res.ok) {
      setSuccess(true);
      setSelected(new Set());
    }
    setLoading(false);
  };

  if (!user) return <div className="min-h-screen flex items-center justify-center text-white">Loading user...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-950 text-white flex flex-col items-center py-12">
      <button onClick={() => navigate(-1)} className="mb-6 text-blue-400 hover:underline">&larr; Back</button>
      <div className="bg-white/10 rounded-2xl shadow-xl p-8 mb-8 w-full max-w-lg flex flex-col items-center">
        <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-3xl font-bold text-blue-700 mb-3 border-4 border-blue-400">
          {user.photo ? <img src={user.photo} alt={user.fullName || user.username || 'User'} className="w-full h-full object-cover rounded-full" /> : (user.fullName || user.username || 'U').slice(0,2).toUpperCase()}
        </div>
        <div className="text-2xl font-bold mb-1">{user.fullName || user.username || 'User'}</div>
        <div className="text-lg text-blue-200 mb-1">{user.phone}</div>
        <div className="text-md text-blue-300 mb-1">{user.email || 'No email'}</div>
      </div>
      <div className="w-full max-w-3xl">
        <h2 className="text-xl font-bold mb-4">Assign Workouts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
          {workouts.map((w: any) => (
            <div
              key={w.id}
              className={`transition-transform ${selected.has(w.id) ? 'scale-105 ring-4 ring-blue-400' : ''}`}
              onClick={() => handleToggle(w.id)}
            >
              <WorkoutCard {...w} selected={selected.has(w.id)} />
            </div>
          ))}
        </div>
        <button
          onClick={handleSubmit}
          disabled={selected.size === 0 || loading}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-colors ${selected.size === 0 || loading ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'}`}
        >
          {loading ? 'Assigning...' : `Assign ${selected.size} Workout${selected.size !== 1 ? 's' : ''}`}
        </button>
        {success && <div className="mt-4 text-green-400 font-bold text-center">Workouts assigned successfully!</div>}
      </div>
    </div>
  );
};

export default TrainerUserDetail; 