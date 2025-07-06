<<<<<<< HEAD
import React from 'react';
import { Flame, Dumbbell, Footprints, User, Activity, Camera, Croissant, Soup, Utensils, Apple, ShoppingCart, HeartPulse, CheckCircle, X, Info, AlertTriangle, ThumbsUp, ThumbsDown, Target } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useRef, useState, useEffect } from 'react';
import Header from './Header';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { useNavigate } from 'react-router-dom';
import WorkoutCard from './WorkoutCard';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip, Legend);

const stats = {
  steps: 7560,
  calories: 569,
  workouts: 4,
  distance: 3.8,
  stepsGoal: 10000,
  caloriesGoal: 800,
  workoutsGoal: 5,
};

const hexColors = {
  steps: '#22c55e', // green
  calories: '#f97316', // orange
  workouts: '#2563eb', // blue
};

const progressColors = {
  steps: '#38bdf8', // blue
  calories: '#f59e42', // orange
  distance: '#22c55e', // green
  workouts: '#38bdf8', // blue
};

const glassCard =
  'backdrop-blur-lg bg-white/10 border border-white/20 shadow-xl rounded-3xl';

const mockDietPlan = [
  {
    day: 'Mon',
    meals: [
      { name: 'Oatmeal & Berries', type: 'Breakfast', img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80', calories: 320, protein: 10, carbs: 55, fat: 6 },
      { name: 'Grilled Chicken Salad', type: 'Lunch', img: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80', calories: 420, protein: 35, carbs: 30, fat: 12 },
      { name: 'Greek Yogurt & Nuts', type: 'Snack', img: 'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=400&q=80', calories: 180, protein: 12, carbs: 15, fat: 7 },
      { name: 'Salmon & Quinoa', type: 'Dinner', img: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80', calories: 500, protein: 38, carbs: 40, fat: 18 },
    ],
  },
  // ...repeat for Tue–Sun with different meals...
];

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const defaultMealImg = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80';

// Helper to get dates for the current week (Mon–Sun)
function getCurrentWeekDates() {
  const today = new Date();
  const day = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((day + 6) % 7));
  return Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}
const weekDates = getCurrentWeekDates();
const todayIdx = weekDates.findIndex(d => d.toDateString() === new Date().toDateString());

const mealIcons: Record<string, JSX.Element> = {
  Breakfast: <Croissant className="w-7 h-7 text-white/80" />,
  Lunch: <Soup className="w-7 h-7 text-white/80" />,
  Dinner: <Utensils className="w-7 h-7 text-white/80" />,
  Snack: <Apple className="w-7 h-7 text-white/80" />,
  Snacks: <Apple className="w-7 h-7 text-white/80" />,
};

// Add mock data for previous and current week wellness
const wellnessData = {
  activity: {
    label: 'Physical Activity',
    prev: [7000, 8000, 7500, 9000, 8500, 10000, 9500],
    curr: [8000, 8500, 9000, 9500, 10000, 11000, 10500],
    unit: 'steps',
    icon: <Footprints className="w-7 h-7 text-white/80" />, 
    color: 'from-green-400 to-blue-500',
    insight: '↑ 12% more active this week!'
  },
  nutrition: {
    label: 'Nutrition',
    prev: [1600, 1700, 1800, 1750, 1650, 1800, 1700],
    curr: [1800, 1850, 1900, 2000, 1950, 2100, 2000],
    unit: 'kcal',
    icon: <Flame className="w-7 h-7 text-white/80" />, 
    color: 'from-orange-400 to-pink-500',
    insight: '↑ 9% better calorie intake!'
  },
  sleep: {
    label: 'Sleep',
    prev: [6.5, 7, 6, 7.5, 7, 6.8, 7.2],
    curr: [7, 7.2, 7.5, 8, 7.8, 8, 7.9],
    unit: 'hrs',
    icon: <Activity className="w-7 h-7 text-white/80" />, 
    color: 'from-blue-400 to-purple-500',
    insight: '↑ 10% more restful sleep!'
  },
  stress: {
    label: 'Stress',
    prev: [6, 5, 7, 6, 5, 6, 5],
    curr: [5, 4, 5, 4, 5, 4, 4],
    unit: '/10',
    icon: <HeartPulse className="w-7 h-7 text-white/80" />, 
    color: 'from-pink-400 to-orange-400',
    insight: '↓ 18% less stress!'
  },
  wellness: {
    label: 'Wellness Score',
    prev: [68, 70, 72, 71, 73, 75, 74],
    curr: [75, 77, 80, 82, 81, 83, 85],
    unit: '/100',
    icon: <User className="w-7 h-7 text-white/80" />, 
    color: 'from-cyan-400 to-green-400',
    insight: '↑ 15% overall wellness!'
  }
};

// Motivational quotes
const motivationalQuotes = [
  "Every step is progress, no matter how small.",
  "You are stronger than you think.",
  "Consistency beats intensity.",
  "Small changes make a big difference.",
  "Push yourself, because no one else is going to do it for you.",
  "The only bad workout is the one you didn't do.",
  "Believe in yourself and all that you are.",
  "Your only limit is you.",
  "Don't stop until you're proud.",
  "Success starts with self-discipline."
];

function getRandomQuote() {
  return motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
}

// Add state for goals and modal
const defaultGoals = {
  steps: 10000,
  calories: 800,
  workouts: 5,
};

function getStoredGoals(): { steps: number; calories: number; workouts: number } {
  try {
    const stored = localStorage.getItem('userGoals');
    return stored ? JSON.parse(stored) : defaultGoals;
  } catch {
    return defaultGoals;
  }
}

function setStoredGoals(goals: { steps: number; calories: number; workouts: number }) {
  localStorage.setItem('userGoals', JSON.stringify(goals));
}

// Health metrics types and helpers
interface HealthMetric {
  date: string; // ISO string
  weight: number;
  bodyFat: number;
}

function getStoredMetrics(): HealthMetric[] {
  try {
    const stored = localStorage.getItem('healthMetrics');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function setStoredMetrics(metrics: HealthMetric[]) {
  localStorage.setItem('healthMetrics', JSON.stringify(metrics));
}

const Dashboard: React.FC = () => {
  const { user, setUser } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [showDietModal, setShowDietModal] = useState(false);
  const [dietPlan, setDietPlan] = useState<any[]>(mockDietPlan);
  const [loadingDiet, setLoadingDiet] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<any | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [goals, setGoals] = useState(getStoredGoals());
  const [showGoalsModal, setShowGoalsModal] = useState(false);
  const [editGoals, setEditGoals] = useState(goals);
  const [metrics, setMetrics] = useState<HealthMetric[]>(getStoredMetrics());
  const [newMetric, setNewMetric] = useState<HealthMetric>({ date: new Date().toISOString().slice(0,10), weight: 0, bodyFat: 0 });
  const [assignedWorkouts, setAssignedWorkouts] = useState<any[]>([]);

  useEffect(() => {
    if (selectedWorkout && modalRef.current) {
      // Scroll the modal into view, centered
      modalRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [selectedWorkout]);

  // Fetch diet plan on mount
  useEffect(() => {
    let interval: NodeJS.Timeout;
    let lastModified: string | null = null;
    const fetchDietPlan = async () => {
      if (!user?.phone) return;
      setLoadingDiet(true);
      try {
        const res = await fetch(`/api/plan?phone=${user.phone}`);
        const data = await res.json();
        if (data.plan) {
          setDietPlan(data.plan);
          lastModified = data.last_modified_at;
        } else setDietPlan(mockDietPlan);
      } catch (e) {
        setDietPlan(mockDietPlan);
      } finally {
        setLoadingDiet(false);
      }
    };
    fetchDietPlan();
    interval = setInterval(async () => {
      if (!user?.phone) return;
      try {
        const res = await fetch(`/api/plan?phone=${user.phone}`);
        const data = await res.json();
        if (data.last_modified_at !== lastModified) {
          setDietPlan(data.plan);
          lastModified = data.last_modified_at;
        }
      } catch {}
    }, 10000);
    return () => clearInterval(interval);
  }, [user?.phone]);

  // Update diet plan (for checklists, etc)
  const updateDietPlan = async (newPlan: any[]) => {
    if (!user?.phone) return;
    setDietPlan(newPlan);
    await fetch('/api/plan', {
=======
import React, { useState, useRef } from 'react';
import Header from './Header';
import { useUser } from '../context/UserContext';
import { 
  Edit2, CheckCircle, ChevronRight, X, Camera, 
  Activity, Target, TrendingUp, Calendar, Award,
  Dumbbell, Heart, Zap, Users, BookOpen, Settings
} from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard: React.FC = () => {
  const { user, setUser } = useUser();
  const [editing, setEditing] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock data for dashboard widgets
  const stats = [
    { label: 'Workouts This Week', value: '4', icon: Dumbbell, color: 'bg-blue-500' },
    { label: 'Calories Burned', value: '1,240', icon: Zap, color: 'bg-orange-500' },
    { label: 'Current Streak', value: '12 days', icon: Award, color: 'bg-green-500' },
    { label: 'Weight Progress', value: '-2.5 kg', icon: TrendingUp, color: 'bg-purple-500' },
  ];

  const quickActions = [
    { label: 'Start Workout', icon: Dumbbell, color: 'bg-blue-500' },
    { label: 'Log Meal', icon: Heart, color: 'bg-red-500' },
    { label: 'Track Weight', icon: TrendingUp, color: 'bg-green-500' },
    { label: 'Join Community', icon: Users, color: 'bg-purple-500' },
  ];

  const recentActivities = [
    { type: 'workout', title: 'Upper Body Strength', duration: '45 min', time: '2 hours ago' },
    { type: 'meal', title: 'Healthy Breakfast Logged', calories: '320 cal', time: '5 hours ago' },
    { type: 'achievement', title: 'Weekly Goal Completed!', badge: '🏆', time: '1 day ago' },
  ];

  const upcomingWorkouts = [
    { name: 'HIIT Cardio', time: 'Today, 6:00 PM', difficulty: 'High' },
    { name: 'Yoga Flow', time: 'Tomorrow, 7:00 AM', difficulty: 'Medium' },
    { name: 'Strength Training', time: 'Wed, 5:30 PM', difficulty: 'High' },
  ];

  // Profile completion calculation
  const profileFields = ['fullName', 'gender', 'dob', 'height', 'weight', 'activityLevel', 'fitnessGoal'];
  const filledFields = profileFields.filter(field => user?.[field]);
  const completion = Math.round((filledFields.length / profileFields.length) * 100);

  const handleEdit = (field: string) => {
    setEditing(field);
    setEditValue(user?.[field] || '');
  };

  const handleSave = async (field: string) => {
    setSaving(true);
    const updated = { ...user, [field]: editValue };
    setUser(updated);
    
    await fetch('/api/profile', {
>>>>>>> 131197f10628ddc4a74b2b9a6875df5ced2a62cf
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: user.phone, plan: newPlan }),
    });
<<<<<<< HEAD
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      setPreviewPhoto(base64);
      // Placeholder: Upload to backend
      await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...user, photo: base64 }),
      });
      setUser({ ...user, photo: base64 });
    };
    reader.readAsDataURL(file);
  };

  const handleDayClick = (idx: number) => {
    setSelectedDay(idx);
    setShowDietModal(true);
  };

  const closeDietModal = () => setShowDietModal(false);

  // Helper: get Do/Don't/aim for each exercise (could be expanded with more data)
  const getExerciseDetails = (w: any) => {
    // Example data, ideally this would come from DB or a richer object
    const aim = w.goal || 'Improve strength and fitness';
    const dos = w.instructions || 'Follow the instructions carefully.';
    // Example don'ts (could be improved with real data)
    let donts = '';
    if (w.name?.toLowerCase().includes('squat')) donts = "Don't let your knees cave in or your heels lift off the ground.";
    else if (w.name?.toLowerCase().includes('push')) donts = "Don't let your hips sag or flare elbows out too wide.";
    else if (w.name?.toLowerCase().includes('plank')) donts = "Don't let your hips drop or arch your back.";
    else if (w.name?.toLowerCase().includes('deadlift')) donts = "Don't round your back or jerk the bar off the ground.";
    else donts = "Don't rush, use improper form, or ignore pain.";
    return { aim, dos, donts };
  };

  useEffect(() => {
    if (!user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const handleOpenGoalsModal = () => {
    setEditGoals(goals);
    setShowGoalsModal(true);
  };
  const handleCloseGoalsModal = () => setShowGoalsModal(false);
  const handleGoalsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditGoals({ ...editGoals, [e.target.name]: e.target.value.replace(/\D/g, '') });
  };
  const handleSaveGoals = () => {
    const newGoals = {
      steps: Number(editGoals.steps) || defaultGoals.steps,
      calories: Number(editGoals.calories) || defaultGoals.calories,
      workouts: Number(editGoals.workouts) || defaultGoals.workouts,
    };
    setGoals(newGoals);
    setStoredGoals(newGoals);
    setShowGoalsModal(false);
  };

  const handleMetricChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMetric({ ...newMetric, [e.target.name]: e.target.value });
  };
  const handleAddMetric = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMetric.weight || !newMetric.bodyFat) return;
    const updated = [...metrics, { ...newMetric, weight: Number(newMetric.weight), bodyFat: Number(newMetric.bodyFat) }];
    setMetrics(updated);
    setStoredMetrics(updated);
    setNewMetric({ date: new Date().toISOString().slice(0,10), weight: 0, bodyFat: 0 });
  };

  // Fetch assigned workouts for the logged-in user
  useEffect(() => {
    if (!user?.phone) return;
    fetch(`/api/trainer/user-workouts?user_id=${encodeURIComponent(user.phone)}`)
      .then(res => res.json())
      .then(data => setAssignedWorkouts(data.workouts || []));
  }, [user?.phone]);

  return (
    <div className="min-h-screen bg-black text-white font-[Inter,sans-serif]">
      <Header />
      {/* Personalized Greeting and Motivational Quote */}
      <div className="flex flex-col items-center pt-10 pb-2">
        <div className="text-3xl font-extrabold mb-2">Hello, {user?.fullName || user?.username || 'Friend'}! 👋</div>
        <div className="text-lg italic text-cyan-200 text-center max-w-xl">
          {getRandomQuote()}
        </div>
      </div>
      <div className="flex justify-center mt-2 mb-4">
        <button
          className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-6 rounded-xl shadow transition"
          onClick={handleOpenGoalsModal}
        >
          Set Your Goals
        </button>
      </div>
      {/* Goals Modal */}
      {showGoalsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-6 text-cyan-700">Set Your Daily Goals</h2>
            <div className="w-full flex flex-col gap-4">
              <label className="flex flex-col text-lg font-semibold text-gray-700">
                Steps
                <input
                  type="number"
                  name="steps"
                  value={editGoals.steps}
                  onChange={handleGoalsChange}
                  className="mt-1 p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  min={1000}
                  max={50000}
                />
              </label>
              <label className="flex flex-col text-lg font-semibold text-gray-700">
                Calories
                <input
                  type="number"
                  name="calories"
                  value={editGoals.calories}
                  onChange={handleGoalsChange}
                  className="mt-1 p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  min={100}
                  max={10000}
                />
              </label>
              <label className="flex flex-col text-lg font-semibold text-gray-700">
                Workouts
                <input
                  type="number"
                  name="workouts"
                  value={editGoals.workouts}
                  onChange={handleGoalsChange}
                  className="mt-1 p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  min={1}
                  max={21}
                />
              </label>
            </div>
            <div className="flex gap-4 mt-8">
              <button
                className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-6 rounded-xl shadow"
                onClick={handleSaveGoals}
              >
                Save
              </button>
              <button
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-xl shadow"
                onClick={handleCloseGoalsModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="flex justify-center items-start pt-24">
        <div className="backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl rounded-3xl max-w-2xl w-full p-8">
          {/* User Profile Photo */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative group">
              <img
                src={previewPhoto || user?.photo || '/src/assets/avatars/avatar1.svg'}
                alt="Profile"
                className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-2xl mb-2"
              />
              <button
                type="button"
                className="absolute bottom-2 right-2 bg-black/70 rounded-full p-2 border border-white/30 hover:bg-black/90 transition group-hover:scale-110"
                onClick={handlePhotoClick}
                aria-label="Change profile photo"
              >
                <Camera className="w-5 h-5 text-white" />
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handlePhotoChange}
              />
            </div>
            <div className="text-2xl font-bold mt-2">{user?.fullName || user?.username || 'Naomi Reed'}</div>
            <div className="flex gap-8 mt-2 text-white/80 text-base">
              <div>
                <span className="font-bold text-white">{stats.workouts}</span>
                <span className="ml-1 text-white/60">Workouts</span>
              </div>
              <div>
                <span className="font-bold text-white">{stats.calories.toLocaleString()}</span>
                <span className="ml-1 text-white/60">Calories</span>
              </div>
              <div>
                <span className="font-bold text-white">{stats.distance} mi</span>
                <span className="ml-1 text-white/60">Distance</span>
              </div>
            </div>
          </div>

          {/* Hex Cards */}
          <div className="flex gap-6 mb-8 justify-center">
            {/* Steps */}
            <div className="flex flex-col items-center">
              <div
                className="w-24 h-24 flex flex-col items-center justify-center"
                style={{
                  clipPath:
                    'polygon(25% 6%, 75% 6%, 100% 50%, 75% 94%, 25% 94%, 0% 50%)',
                  background: hexColors.steps,
                }}
              >
                <Footprints className="w-8 h-8 mb-1 text-white" />
                <div className="text-2xl font-bold text-white">{stats.steps}</div>
              </div>
              <div className="mt-2 text-xs tracking-widest text-white/80">STEPS</div>
            </div>
            {/* Calories */}
            <div className="flex flex-col items-center">
              <div
                className="w-24 h-24 flex flex-col items-center justify-center"
                style={{
                  clipPath:
                    'polygon(25% 6%, 75% 6%, 100% 50%, 75% 94%, 25% 94%, 0% 50%)',
                  background: hexColors.calories,
                }}
              >
                <Flame className="w-8 h-8 mb-1 text-white" />
                <div className="text-2xl font-bold text-white">{stats.calories}</div>
              </div>
              <div className="mt-2 text-xs tracking-widest text-white/80">CALORIES</div>
            </div>
            {/* Workouts */}
            <div className="flex flex-col items-center">
              <div
                className="w-24 h-24 flex flex-col items-center justify-center"
                style={{
                  clipPath:
                    'polygon(25% 6%, 75% 6%, 100% 50%, 75% 94%, 25% 94%, 0% 50%)',
                  background: hexColors.workouts,
                }}
              >
                <Dumbbell className="w-8 h-8 mb-1 text-white" />
                <div className="text-2xl font-bold text-white">{stats.workouts}</div>
              </div>
              <div className="mt-2 text-xs tracking-widest text-white/80">WORKOUTS</div>
            </div>
          </div>

          {/* Running Icon and Daily Goals */}
          <div className="flex flex-col items-center mb-4">
            <Activity className="w-16 h-16 text-white mb-2" />
            <div className="text-lg font-bold tracking-widest mb-2">DAILY GOALS</div>
          </div>

          {/* Add this section above daily goals cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">
            {Object.entries(wellnessData).map(([key, d]) => (
              <div key={key} className="backdrop-blur-lg bg-white/10 border border-white/20 shadow-xl rounded-3xl p-6 flex flex-col gap-3 relative overflow-hidden">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${d.color}`}>{d.icon}</div>
                  <div>
                    <div className="text-lg font-bold text-white/90">{d.label}</div>
                    <div className="text-xs text-white/60">This week vs last</div>
                  </div>
                </div>
                {/* Mini chart */}
                <div className="h-20 w-full">
                  <Line
                    data={{
                      labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
                      datasets: [
                        { label: 'Prev', data: d.prev, borderColor: 'rgba(255,255,255,0.3)', backgroundColor: 'rgba(255,255,255,0.1)', fill: false, borderWidth: 2, pointRadius: 0 },
                        { label: 'Curr', data: d.curr, borderColor: '#22d3ee', backgroundColor: 'rgba(34,211,238,0.2)', fill: true, borderWidth: 3, pointRadius: 0 }
                      ]
                    }}
                    options={{
                      plugins: { legend: { display: false } },
                      scales: { x: { display: false }, y: { display: false } },
                      elements: { line: { tension: 0.4 } },
                      responsive: true,
                      maintainAspectRatio: false
                    }}
                  />
                </div>
                {/* Delta and insight */}
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-2xl font-extrabold text-white">{((d.curr.reduce((a,b)=>a+b,0)-d.prev.reduce((a,b)=>a+b,0))/d.prev.reduce((a,b)=>a+b,0)*100>0?'+':'')}{Math.round((d.curr.reduce((a,b)=>a+b,0)-d.prev.reduce((a,b)=>a+b,0))/d.prev.reduce((a,b)=>a+b,0)*100)}%</span>
                  <span className="text-white/70 text-sm">{d.insight}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Daily Goals Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {/* Steps */}
            <div className={`${glassCard} p-6 flex flex-col gap-2`}> 
              <div className="text-lg font-semibold">Steps</div>
              <div className="text-2xl font-bold">{(stats.steps / 1000).toFixed(3)}</div>
              <div className="w-full h-2 bg-white/20 rounded-full mt-2">
                <div
                  className="h-2 rounded-full"
                  style={{
                    width: `${(stats.steps / goals.steps) * 100}%`,
                    background: progressColors.steps,
                  }}
                />
              </div>
            </div>
            {/* Calories */}
            <div className={`${glassCard} p-6 flex flex-col gap-2`}>
              <div className="text-lg font-semibold">Calories</div>
              <div className="text-2xl font-bold">{stats.calories} / {goals.calories}</div>
              <div className="w-full h-2 bg-white/20 rounded-full mt-2">
                <div
                  className="h-2 rounded-full"
                  style={{
                    width: `${(stats.calories / goals.calories) * 100}%`,
                    background: progressColors.calories,
                  }}
                />
              </div>
            </div>
            {/* Distance */}
            <div className={`${glassCard} p-6 flex flex-col gap-2`}>
              <div className="text-lg font-semibold">Distance</div>
              <div className="text-2xl font-bold">{stats.distance} mi</div>
              <div className="w-full h-2 bg-white/20 rounded-full mt-2">
                <div
                  className="h-2 rounded-full"
                  style={{
                    width: `${(stats.distance / 5) * 100}%`, // Assume 5mi goal
                    background: progressColors.distance,
                  }}
                />
              </div>
            </div>
            {/* Workouts */}
            <div className={`${glassCard} p-6 flex flex-col gap-2`}>
              <div className="text-lg font-semibold">Workouts</div>
              <div className="text-2xl font-bold">{stats.workouts} / {goals.workouts}</div>
              <div className="w-full h-2 bg-white/20 rounded-full mt-2">
                <div
                  className="h-2 rounded-full"
                  style={{
                    width: `${(stats.workouts / goals.workouts) * 100}%`,
                    background: progressColors.workouts,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Health Metrics */}
          <div className="mt-12 max-w-xl mx-auto w-full">
            <h2 className="text-2xl font-bold mb-4 text-cyan-400">Health Metrics</h2>
            <form className="flex flex-col md:flex-row gap-4 mb-6 items-end" onSubmit={handleAddMetric}>
              <div className="flex flex-col flex-1">
                <label className="text-white/80 font-semibold mb-1">Date</label>
                <input type="date" name="date" value={newMetric.date} onChange={handleMetricChange} className="rounded-lg p-2 bg-white/10 border border-white/20 text-white" required />
              </div>
              <div className="flex flex-col flex-1">
                <label className="text-white/80 font-semibold mb-1">Weight (kg)</label>
                <input type="number" name="weight" value={newMetric.weight || ''} onChange={handleMetricChange} className="rounded-lg p-2 bg-white/10 border border-white/20 text-white" min={1} step={0.1} required />
              </div>
              <div className="flex flex-col flex-1">
                <label className="text-white/80 font-semibold mb-1">Body Fat (%)</label>
                <input type="number" name="bodyFat" value={newMetric.bodyFat || ''} onChange={handleMetricChange} className="rounded-lg p-2 bg-white/10 border border-white/20 text-white" min={1} max={100} step={0.1} required />
              </div>
              <button type="submit" className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-6 rounded-xl shadow">Add</button>
            </form>
            {/* Chart */}
            {metrics.length > 0 ? (
              <div className="bg-white/10 rounded-2xl p-6 shadow-xl mb-6">
                <Line
                  data={{
                    labels: metrics.map(m => m.date),
                    datasets: [
                      {
                        label: 'Weight (kg)',
                        data: metrics.map(m => m.weight),
                        borderColor: '#22d3ee',
                        backgroundColor: 'rgba(34,211,238,0.2)',
                        fill: true,
                        borderWidth: 3,
                        pointRadius: 4,
                      },
                    ],
                  }}
                  options={{
                    plugins: { legend: { display: true } },
                    scales: { x: { display: true }, y: { display: true } },
                    elements: { line: { tension: 0.4 } },
                    responsive: true,
                    maintainAspectRatio: false,
                  }}
                  height={120}
                />
              </div>
            ) : (
              <div className="text-white/60 text-center mb-6">No health metrics yet. Add your first entry above!</div>
            )}
            {/* Table of recent entries */}
            {metrics.length > 0 && (
              <div className="overflow-x-auto">
                <table className="min-w-max w-full text-left text-white/90">
                  <thead>
                    <tr className="bg-cyan-900/40">
                      <th className="py-2 px-3 font-semibold">Date</th>
                      <th className="py-2 px-3 font-semibold">Weight (kg)</th>
                      <th className="py-2 px-3 font-semibold">Body Fat (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.slice(-7).reverse().map((m, i) => (
                      <tr key={i} className="border-b border-white/10">
                        <td className="py-2 px-3 whitespace-nowrap">{m.date}</td>
                        <td className="py-2 px-3 whitespace-nowrap">{m.weight}</td>
                        <td className="py-2 px-3 whitespace-nowrap">{m.bodyFat}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Diet Plan Section */}
          <div className="mt-12 max-w-md mx-auto">
            <h2 className="text-3xl font-extrabold tracking-wide text-center mb-6">DIET PLANNER</h2>
            {loadingDiet ? (
              <div className="text-white/70 text-center py-8">Loading diet plan...</div>
            ) : (
              <>
                {/* Minimal calendar */}
                <div className="flex justify-between items-center mb-6 px-2">
                  {['S','M','T','W','T','F','S'].map((letter, idx) => (
                    <div key={letter} className="flex flex-col items-center">
                      <span className="text-white/60 text-lg font-bold">{letter}</span>
                      {weekDates[idx].toDateString() === new Date().toDateString() ? (
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center mt-1 text-lg font-bold text-white shadow-lg">
                          {weekDates[idx].getDate()}
                        </div>
                      ) : (
                        <button
                          className={`w-8 h-8 rounded-full flex items-center justify-center mt-1 text-lg font-bold ${selectedDay === idx ? 'bg-white/20 text-white' : 'text-white/40 hover:bg-white/10'}`}
                          onClick={() => handleDayClick(idx)}
                        >
                          {weekDates[idx].getDate()}
                        </button>
=======
    
    setSaving(false);
    setEditing(null);
    setEditValue('');
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        setUser({ ...user, photo: base64 });
        
        await fetch('/api/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...user, photo: base64 }),
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="pt-24 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl p-8 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    Welcome back, {user?.fullName || user?.username}! 👋
                  </h1>
                  <p className="text-green-100 text-lg">
                    Ready to crush your fitness goals today?
                  </p>
                </div>
                <div className="relative">
                  <div 
                    className="w-20 h-20 rounded-full border-4 border-white bg-white/20 flex items-center justify-center overflow-hidden cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {user?.photo ? (
                      <img src={user.photo} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <Camera className="w-8 h-8 text-white" />
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Quick Actions */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Quick Actions
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {quickActions.map((action, index) => (
                    <motion.button
                      key={action.label}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex flex-col items-center p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-green-500 transition-colors"
                    >
                      <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-3`}>
                        <action.icon className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white text-center">
                        {action.label}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Recent Activities */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Recent Activities
                </h2>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-4">
                        {activity.type === 'workout' && <Dumbbell className="w-5 h-5 text-white" />}
                        {activity.type === 'meal' && <Heart className="w-5 h-5 text-white" />}
                        {activity.type === 'achievement' && <Award className="w-5 h-5 text-white" />}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {activity.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {activity.duration || activity.calories || activity.badge} • {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Profile Completion */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Profile Completion
                </h2>
                <div className="relative">
                  <div className="w-24 h-24 mx-auto mb-4">
                    <svg className="w-24 h-24 transform -rotate-90">
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="#e5e7eb"
                        strokeWidth="8"
                        fill="transparent"
                      />
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="#10b981"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={`${2 * Math.PI * 40}`}
                        strokeDashoffset={`${2 * Math.PI * 40 * (1 - completion / 100)}`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">
                        {completion}%
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
                  Complete your profile to get personalized recommendations
                </p>
              </div>

              {/* Upcoming Workouts */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Upcoming Workouts
                </h2>
                <div className="space-y-4">
                  {upcomingWorkouts.map((workout, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                          {workout.name}
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {workout.time}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        workout.difficulty === 'High' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {workout.difficulty}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Profile Edit */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Quick Profile Edit
                </h2>
                <div className="space-y-4">
                  {['height', 'weight', 'fitnessGoal'].map((field) => (
                    <div key={field} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                        {field.replace(/([A-Z])/g, ' $1')}
                      </span>
                      {editing === field ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-24 px-2 py-1 text-sm border rounded"
                            onBlur={() => handleSave(field)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSave(field)}
                            autoFocus
                          />
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-900 dark:text-white">
                            {user?.[field] || 'Not set'}
                          </span>
                          <button
                            onClick={() => handleEdit(field)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </div>
>>>>>>> 131197f10628ddc4a74b2b9a6875df5ced2a62cf
                      )}
                    </div>
                  ))}
                </div>
<<<<<<< HEAD
                {/* Meal List */}
                <div className="bg-white/10 rounded-2xl p-6 shadow-xl backdrop-blur-md">
                  {dietPlan[selectedDay ?? todayIdx]?.meals.map((meal: any, i: number) => (
                    <div key={i} className="flex items-center gap-4 py-3 border-b border-white/10 last:border-b-0">
                      <div>{mealIcons[meal.type] || <Apple className="w-7 h-7 text-white/80" />}</div>
                      <div className="flex-1">
                        <div className="font-bold text-lg text-white">{meal.type}</div>
                        <div className="text-white/60 text-sm">{meal.name}</div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <div className="font-bold text-white text-base">{meal.calories}</div>
                        <div className="text-xs text-white/50 flex gap-2">
                          <span>{meal.protein}g</span>
                          <span>{meal.carbs}g</span>
                          <span>{meal.fat}g</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {/* Calories Progress Bar */}
                  <div className="mt-6">
                    <div className="flex justify-between items-center text-white/80 text-lg font-bold mb-1">
                      <span>{dietPlan[selectedDay ?? todayIdx]?.meals.reduce((a: number, m: any) => a + (m.calories || 0), 0).toLocaleString()} / {goals.calories} CALORIES</span>
                    </div>
                    <div className="w-full h-2 bg-white/20 rounded-full">
                      <div
                        className="h-2 rounded-full bg-cyan-400"
                        style={{ width: `${Math.min(100, (dietPlan[selectedDay ?? todayIdx]?.meals.reduce((a: number, m: any) => a + (m.calories || 0), 0) / goals.calories) * 100)}%` }}
                      />
                    </div>
                  </div>
                  {/* Grocery List Button */}
                  <button className="mt-6 w-full flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 text-white font-bold text-lg rounded-xl py-4 shadow-lg border border-white/20 transition-all">
                    <ShoppingCart className="w-6 h-6" />
                    GROCERY LIST
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Workout Plan Section */}
          <div className="mt-12 max-w-md mx-auto">
            <h2 className="text-3xl font-extrabold tracking-wide text-center mb-2">WORKOUT PLAN</h2>
            <div className="text-center text-lg font-semibold text-blue-700 mb-4">Your Assigned Workouts</div>
            <div className="text-center text-base text-neutral-700 mb-6 italic">These are the workouts assigned to you by your trainer.</div>
            {assignedWorkouts.length === 0 ? (
              <div className="text-neutral-500 text-center py-8 text-lg">No workouts assigned yet.<br /><span className="text-blue-700 font-semibold">Please check with your trainer.</span></div>
            ) : (
              <div className="grid gap-6">
                {assignedWorkouts.map((w: any) => (
                  <WorkoutCard
                    key={w.id}
                    name={w.name}
                    img={w.img}
                    sets={w.sets}
                    reps={w.reps}
                    muscle_group={w.muscle_group}
                    goal={w.goal}
                    level={w.level}
                    equipment={w.equipment}
                    instructions={w.instructions}
                  />
                ))}
              </div>
            )}
=======
              </div>
            </div>
>>>>>>> 131197f10628ddc4a74b2b9a6875df5ced2a62cf
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;