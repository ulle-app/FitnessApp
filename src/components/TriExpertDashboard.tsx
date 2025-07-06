import React, { useState, useEffect } from 'react';
import { Bell, LogOut, User, CheckCircle, Flame, Dumbbell, Footprints, Apple, Soup, Utensils, HeartPulse, ClipboardList, ChevronDown, ChevronUp, ShoppingCart, AlertTriangle, MessageCircle, X, TrendingUp } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import WorkoutCard from './WorkoutCard';
import SwipeableWorkoutCards from './SwipeableWorkoutCards';
import PersonalizedInsights from './PersonalizedInsights';
import AdaptiveRecommendations from './AdaptiveRecommendations';

const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const todayIdx = new Date().getDay();
const todayDate = new Date().getDate();

// Mock data for all expert domains
const mockData = Array.from({ length: 7 }).map((_, i) => ({
  date: todayDate + i - todayIdx,
  meals: [
    { type: 'Breakfast', name: 'Oatmeal & Berries', calories: 320, protein: 10, carbs: 55, fat: 6, done: false, expertNote: 'Add chia seeds for omega-3.' },
    { type: 'Lunch', name: 'Grilled Chicken Salad', calories: 420, protein: 35, carbs: 30, fat: 12, done: false, expertNote: '' },
    { type: 'Dinner', name: 'Salmon & Quinoa', calories: 500, protein: 38, carbs: 40, fat: 18, done: false, expertNote: 'Great for recovery.' },
    { type: 'Snacks', name: 'Greek Yogurt & Nuts', calories: 180, protein: 12, carbs: 15, fat: 7, done: false, expertNote: '' },
  ],
  workouts: [
    { name: 'Push-ups', sets: 3, reps: 15, muscle_group: 'Chest,Triceps,Shoulders', done: false, expertNote: 'Keep elbows close.' },
    { name: 'Squats', sets: 3, reps: 20, muscle_group: 'Quads,Glutes,Hamstrings', done: false, expertNote: '' },
    { name: 'Plank', sets: 3, reps: '1 min', muscle_group: 'Core', done: false, expertNote: 'Engage your core.' },
  ],
  physio: [
    { name: 'Shoulder Mobility', reps: 10, done: false, expertNote: 'Move slowly.' },
    { name: 'Hamstring Stretch', reps: 10, done: false, expertNote: '' },
  ],
  comments: [
    { expert: 'Nutritionist', text: 'Increase protein at breakfast.', priority: false },
    { expert: 'Physio', text: 'Focus on hamstring flexibility.', priority: true },
  ],
}));

const mealIcons: Record<string, JSX.Element> = {
  Breakfast: <Apple className="w-6 h-6" />,
  Lunch: <Soup className="w-6 h-6" />,
  Dinner: <Utensils className="w-6 h-6" />,
  Snacks: <Apple className="w-6 h-6" />,
};

// Utility to normalize phone numbers (strip +91 and non-digits)
function normalizePhone(phone: string) {
  return phone.replace(/^\+91/, '').replace(/\D/g, '');
}

// Utility to get a display name for a user
function getDisplayName(user: any) {
  if (user.fullName && typeof user.fullName === 'string' && !user.fullName.startsWith('yGtK')) { // crude check for encrypted
    return user.fullName;
  }
  if (user.username) return user.username;
  if (user.phone) return user.phone;
  return 'User';
}

const TriExpertDashboard: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState(todayIdx);
  const [showComments, setShowComments] = useState(false);
  const dayData = mockData[selectedDay];
  const totalCalories = dayData.meals.reduce((a, m) => a + m.calories, 0);
  const calorieGoal = 1800;
  const [plan, setPlan] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastModified, setLastModified] = useState<string | null>(null);
  const { user, logout } = useUser(); // user is the expert
  const navigate = useNavigate();
  const [workoutFilter, setWorkoutFilter] = useState({ muscle: '', goal: '', level: '' });
  const [workoutOptions, setWorkoutOptions] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [assignedUsers, setAssignedUsers] = useState<any[]>([]);
  const [userWorkouts, setUserWorkouts] = useState<{[userId: string]: any[]}>({});
  const [showPersonalizedInsights, setShowPersonalizedInsights] = useState(false);
  const [selectedUserForInsights, setSelectedUserForInsights] = useState<any>(null);

  console.log('User context in TriExpertDashboard:', user);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    const fetchPlan = async () => {
      if (!user?.phone) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/plan?phone=${user.phone}`);
        const data = await res.json();
        if (data.plan) {
          setPlan(data.plan);
          setLastModified(data.last_modified_at);
        }
      } catch {}
      setLoading(false);
    };
    fetchPlan();
    interval = setInterval(async () => {
      if (!user?.phone) return;
      try {
        const res = await fetch(`/api/plan?phone=${user.phone}`);
        const data = await res.json();
        if (data.last_modified_at !== lastModified) {
          setPlan(data.plan);
          setLastModified(data.last_modified_at);
        }
      } catch {}
    }, 10000);
    return () => clearInterval(interval);
  }, [user?.phone, lastModified]);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch('/api/admin/users');
      const all = await res.json();
      setAllUsers(all.filter((u: any) => u.role === 'user'));
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (!user?.phone) {
      console.log('No user.phone found in context');
      return;
    }
    console.log('Raw user.phone from context:', user.phone);
    const normalizedPhone = normalizePhone(user.phone);
    console.log('Fetching assigned users for trainerPhone:', normalizedPhone);
    fetch(`/api/trainer/assigned-users?trainerPhone=${encodeURIComponent(normalizedPhone)}`)
      .then(res => res.json())
      .then(data => setAssignedUsers(data.users || []));
  }, [user?.phone]);

  useEffect(() => {
    fetch('/api/workouts')
      .then(res => res.json())
      .then(data => setWorkoutOptions(data.workouts || []));
  }, []);

  useEffect(() => {
    assignedUsers.forEach(u => {
      fetchUserWorkouts(u.phone);
    });
  }, [assignedUsers]);

  const fetchUserWorkouts = async (userId: string) => {
    const res = await fetch(`/api/trainer/user-workouts?user_id=${encodeURIComponent(userId)}`);
    const data = await res.json();
    setUserWorkouts(prev => ({ ...prev, [userId]: data.workouts || [] }));
  };

  const handleAssignWorkout = async (workoutId: number, userIds: string[]) => {
    if (!user?.phone) return;
    const normalizedPhone = normalizePhone(user.phone);
    try {
      const response = await fetch('/api/trainer/assign-workout-bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          user_ids: userIds, 
          workout_id: workoutId, 
          assigned_by: normalizedPhone 
        })
      });
      if (!response.ok) {
        throw new Error('Assignment failed');
      }
      userIds.forEach(userId => {
        fetchUserWorkouts(userId);
      });
    } catch (error) {
      console.error('Assignment error:', error);
      throw error;
    }
  };

  const updatePlan = async (newPlan: any[], section: string, note: string) => {
    if (!user?.phone) return;
    setPlan(newPlan);
    await fetch('/api/plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: user.phone, plan: newPlan, expert: user.role, section, note }),
    });
  };

  // Filtered workout options
  const filteredWorkoutOptions: any[] = workoutOptions.filter((opt: any) =>
    (!workoutFilter.muscle || (opt.muscle_group && opt.muscle_group.includes(workoutFilter.muscle))) &&
    (!workoutFilter.goal || (opt.goal && opt.goal.includes(workoutFilter.goal))) &&
    (!workoutFilter.level || (opt.level && opt.level === workoutFilter.level))
  );

  // Unique filter values
  const muscleGroups = Array.from(new Set(workoutOptions.flatMap((opt: any) => (opt.muscle_group ? opt.muscle_group.split(',') : []))));
  const goals = Array.from(new Set(workoutOptions.flatMap((opt: any) => (opt.goal ? opt.goal.split(',') : []))));
  const levels = Array.from(new Set(workoutOptions.map((opt: any) => opt.level)));

  const handleAssign = (section: string, index: number, value: string) => {
    // Implementation of handleAssign function
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-950 text-white font-[Inter,sans-serif] relative">
      {/* Fixed Glassmorphic Header */}
      <header className="fixed top-0 left-0 w-full z-30 flex items-center justify-between px-8 py-4 bg-white/60 backdrop-blur-xl border-b-2 border-white/30 shadow-[0_4px_32px_0_rgba(0,0,0,0.18)] rounded-b-2xl" style={{boxShadow: '0 4px 32px 0 rgba(0,0,0,0.18)'}}>
        <div className="flex items-center gap-4">
          <img 
            src={user?.photo || '/src/assets/avatars/avatar1.svg'} 
            alt="Profile" 
            className="w-12 h-12 rounded-full border-2 border-white object-cover shadow-md" 
          />
          <div>
            <span className="font-bold text-lg text-white drop-shadow">Welcome, {user?.fullName || user?.username || 'Trainer'}</span>
            <div className="text-sm text-white/70">Fitness Trainer Dashboard</div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="relative p-2 hover:bg-white/20 rounded-lg transition-colors">
            <Bell className="w-6 h-6" />
          </button>
          <button 
            className="p-2 bg-white/20 hover:bg-white/40 rounded-lg transition-colors shadow border border-white/30"
            onClick={() => { 
              logout(); 
              navigate('/', { replace: true }); 
            }}
            title="Logout"
          >
            <LogOut className="w-6 h-6 text-white" />
          </button>
        </div>
      </header>

      {/* Main Content Container with extra top padding for header */}
      <main className="pt-44 pb-16 px-4 flex flex-col items-center min-h-screen">
        <div className="w-full max-w-lg mx-auto space-y-12">
          {/* Weekly Calendar */}
          <div className="flex justify-center gap-2 mb-2">
            {weekDays.map((d, i) => (
              <button
                key={d}
                className={`flex flex-col items-center w-10 h-14 rounded-2xl font-bold transition-all shadow-md ${i === selectedDay ? 'bg-blue-500 text-white scale-110' : 'bg-white/10 text-white/60 hover:bg-white/20'}`}
                onClick={() => setSelectedDay(i)}
              >
                <span className="mt-2 text-lg">{d}</span>
                <span className="mt-1 text-base font-bold">{mockData[i].date}</span>
              </button>
            ))}
          </div>

          {/* Assigned Users */}
          <div className="w-full max-w-4xl mx-auto mt-16">
            <h2 className="text-2xl font-bold mb-4 text-white">Assigned Users</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {assignedUsers.length === 0 ? (
                <div className="col-span-full text-center text-white/70">No users assigned to you yet.</div>
              ) : (
                assignedUsers.map((user: any) => {
                  const displayName = getDisplayName(user);
                  const initials = displayName.split(' ').map((n: string) => n[0]).join('').slice(0,2).toUpperCase();
                  return (
                    <button
                      key={user.phone}
                      className="bg-gradient-to-br from-blue-800 to-blue-600 rounded-2xl shadow-lg p-6 flex flex-col items-center hover:scale-105 transition-transform border border-white/10 group"
                      onClick={() => navigate(`/trainer/user/${encodeURIComponent(user.phone)}`)}
                    >
                      <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-2xl font-bold text-blue-700 mb-3 border-4 border-blue-400">
                        {user.photo ? (
                          <img src={user.photo} alt={displayName} className="w-full h-full object-cover rounded-full" />
                        ) : (
                          initials
                        )}
                      </div>
                      <div className="text-lg font-semibold text-white mb-1 truncate w-full text-center">{displayName}</div>
                      <div className="text-sm text-white/70 mb-1">{user.phone}</div>
                      <div className="text-xs text-white/50">{user.email || 'No email'}</div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Meal Plan Card */}
          <div className="bg-gray-900/80 backdrop-blur-lg rounded-4xl shadow-3xl border border-white/20 p-10 mb-12">
            <section>
              <h3 className="text-xl font-bold mb-4">Meal Plan</h3>
              {dayData.meals.map((meal, i) => (
                <div key={i} className="flex items-center gap-4 py-3 border-b border-white/10 last:border-b-0">
                  <div>{mealIcons[meal.type] || <Apple className="w-6 h-6" />}</div>
                  <div className="flex-1">
                    <div className="font-bold text-lg text-white flex items-center gap-2">
                      {meal.type}
                      {meal.expertNote && (
                        <span title={meal.expertNote}><MessageCircle className="w-4 h-4 text-blue-400" /></span>
                      )}
                    </div>
                    <div className="text-white/60 text-sm">{meal.name}</div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="font-bold text-white text-base">{meal.calories}</div>
                    <div className="text-xs text-white/50 flex gap-2">
                      <span>{meal.protein}g</span>
                      <span>{meal.carbs}g</span>
                      <span>{meal.fat}g</span>
                    </div>
                    <button className={`mt-1 ${meal.done ? 'text-green-400' : 'text-white/40'}`}><CheckCircle className="w-5 h-5" /></button>
                  </div>
                </div>
              ))}
              {/* Calories Progress Bar */}
              <div className="mt-6">
                <div className="flex justify-between items-center text-white/80 text-lg font-bold mb-1">
                  <span>{totalCalories.toLocaleString()} / {calorieGoal} CALORIES</span>
                </div>
                <div className="w-full h-2 bg-white/20 rounded-full">
                  <div
                    className="h-2 rounded-full bg-cyan-400"
                    style={{ width: `${Math.min(100, (totalCalories / calorieGoal) * 100)}%` }}
                  />
                </div>
              </div>
              <button className="mt-10 w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-2xl rounded-2xl py-5 shadow-xl border border-white/30 transition-all">
                <ShoppingCart className="w-7 h-7" />
                GROCERY LIST
              </button>
            </section>
          </div>

          {/* Workout Plan Card */}
          <div className="bg-gray-900/80 backdrop-blur-lg rounded-4xl shadow-3xl border border-white/20 p-10 mb-12">
            <section>
              <h3 className="text-xl font-bold mb-4">Workout Plan</h3>
              <SwipeableWorkoutCards 
                workouts={dayData.workouts} 
                assignedUsers={assignedUsers}
                onAssignWorkout={handleAssignWorkout}
              />
            </section>
          </div>

          {/* Physio Plan Card */}
          <div className="bg-gray-900/80 backdrop-blur-lg rounded-4xl shadow-3xl border border-white/20 p-10 mb-12">
            <section>
              <h3 className="text-xl font-bold mb-4">Physio Plan</h3>
              {dayData.physio.map((p, i) => (
                <div key={i} className="flex items-center gap-4 py-3 border-b border-white/10 last:border-b-0 bg-white/10 rounded-xl px-4 mb-3 shadow">
                  <HeartPulse className="w-6 h-6 text-pink-400" />
                  <div className="flex-1">
                    <div className="font-bold text-lg text-white flex items-center gap-2">
                      {p.name}
                      {p.expertNote && (
                        <span title={p.expertNote}><MessageCircle className="w-4 h-4 text-blue-400" /></span>
                      )}
                    </div>
                    <div className="text-white/60 text-sm">{p.reps} reps</div>
                  </div>
                  <button className={`ml-2 ${p.done ? 'text-green-400' : 'text-white/40'}`}><CheckCircle className="w-5 h-5" /></button>
                </div>
              ))}
            </section>
          </div>

          {/* Expert Comments Card */}
          <div className="bg-white/20 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
            <button
              className="w-full flex items-center justify-between bg-white/10 rounded-xl px-6 py-4 text-white font-bold text-lg shadow-lg border border-white/20 mb-2"
              onClick={() => setShowComments((v) => !v)}
            >
              <span>Expert Comments</span>
              {showComments ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
            </button>
            {showComments && (
              <div className="bg-white/10 rounded-xl px-6 py-4">
                {dayData.comments.map((c, i) => (
                  <div key={i} className="flex items-center gap-3 py-2 border-b border-white/10 last:border-b-0">
                    <span className="font-bold text-white/80">{c.expert}</span>
                    <span className="text-white/70 flex-1">{c.text}</span>
                    {c.priority && (
                      <span title="Priority"><AlertTriangle className="w-5 h-5 text-yellow-400" /></span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TriExpertDashboard; 