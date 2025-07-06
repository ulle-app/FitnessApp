import React, { useState, useRef, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { 
  Edit2, CheckCircle, Camera, Scale,
  Activity, Award, Dumbbell, 
  Heart, Zap, Users, Info,
  Clock, ArrowRight, Calendar,
  TrendingUp, TrendingDown, Target,
  BarChart3, Flame, Utensils, 
  Droplet, Moon, Ruler
} from 'lucide-react';
import { motion } from 'framer-motion';

import BodyMeasurementSummary from './BodyMeasurementSummary';

const Dashboard: React.FC = () => {
  const { user, setUser, logout } = useUser();
  const [editing, setEditing] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // State for assigned workouts
  const [assignedWorkouts, setAssignedWorkouts] = useState<any[]>([]);
  const [loadingWorkouts, setLoadingWorkouts] = useState(true);
  
  // State for progress data
  const [progressData, setProgressData] = useState({
    weightHistory: [78, 77.5, 76.8, 76.2, 75.5, 75.1, 74.8],
    caloriesBurned: [320, 450, 280, 520, 380, 420, 350],
    waterIntake: [1.8, 2.2, 1.9, 2.5, 2.1, 2.3, 2.0],
    sleepHours: [6.5, 7.2, 6.8, 7.5, 7.0, 6.9, 7.3]
  });

  // Calculate BMI
  const calculateBMI = () => {
    if (!user?.height || !user?.weight) return null;
    const heightInMeters = Number(user.height) / 100;
    const bmi = Number(user.weight) / (heightInMeters * heightInMeters);
    return bmi.toFixed(1);
  };

  // Get BMI category
  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: 'Underweight', color: 'text-blue-500' };
    if (bmi < 25) return { category: 'Normal', color: 'text-green-500' };
    if (bmi < 30) return { category: 'Overweight', color: 'text-yellow-500' };
    return { category: 'Obese', color: 'text-red-500' };
  };

  // Calculate calories based on user data
  const calculateCalories = () => {
    if (!user?.gender || !user?.weight || !user?.height || !user?.dob) return null;
    
    // Calculate age
    const birthDate = new Date(user.dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    // Mifflin-St Jeor Equation
    let bmr = 0;
    if (user.gender === 'male') {
      bmr = 10 * Number(user.weight) + 6.25 * Number(user.height) - 5 * age + 5;
    } else {
      bmr = 10 * Number(user.weight) + 6.25 * Number(user.height) - 5 * age - 161;
    }
    
    // Activity multiplier
    let activityMultiplier = 1.2; // Sedentary
    if (user.activityLevel === 'light') activityMultiplier = 1.375;
    if (user.activityLevel === 'moderate') activityMultiplier = 1.55;
    if (user.activityLevel === 'active') activityMultiplier = 1.725;
    if (user.activityLevel === 'very_active') activityMultiplier = 1.9;
    
    const tdee = Math.round(bmr * activityMultiplier);
    
    return {
      bmr: Math.round(bmr),
      tdee: tdee,
      // Macros based on fitness goal
      protein: Math.round((user.fitnessGoal === 'gain_muscle' ? 0.3 : 0.25) * tdee / 4), // 4 calories per gram
      carbs: Math.round((user.fitnessGoal === 'lose_weight' ? 0.4 : 0.5) * tdee / 4), // 4 calories per gram
      fats: Math.round((user.fitnessGoal === 'lose_weight' ? 0.35 : 0.25) * tdee / 9) // 9 calories per gram
    };
  };

  // Stats data
  const stats = [
    { label: 'Workouts This Week', value: '4', icon: Dumbbell, color: 'bg-blue-500' },
    { label: 'Calories Burned', value: '1,240', icon: Flame, color: 'bg-orange-500' },
    { label: 'Current Streak', value: '12 days', icon: Award, color: 'bg-green-500' },
    { label: 'Weight Progress', value: '-2.5 kg', icon: TrendingUp, color: 'bg-purple-500' },
  ];

  const quickActions = [
    { label: 'Start Workout', icon: Dumbbell, color: 'bg-blue-500', onClick: () => {} },
    { label: 'Log Meal', icon: Utensils, color: 'bg-red-500', onClick: () => {} },
    { label: 'Track Weight', icon: Scale, color: 'bg-green-500', onClick: () => {} },
    { label: 'Join Community', icon: Users, color: 'bg-purple-500', onClick: () => {} },
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

  // Fetch assigned workouts
  useEffect(() => {
    if (user?.phone) {
      setLoadingWorkouts(true);
      fetch(`/api/trainer/user-workouts?user_id=${encodeURIComponent(user.phone)}`)
        .then(res => res.json())
        .then(data => {
          setAssignedWorkouts(data.workouts || []);
          setLoadingWorkouts(false);
        })
        .catch(err => {
          console.error('Error fetching assigned workouts:', err);
          setLoadingWorkouts(false);
        });
    }
  }, [user?.phone]);

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
    
    try {
      await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: user?.phone, [field]: editValue }),
      });
    } catch (error) {
      console.error('Error saving profile:', error);
    }
    
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
        
        try {
          await fetch('/api/profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...user, photo: base64 }),
          });
        } catch (error) {
          console.error('Error uploading photo:', error);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  const bmi = calculateBMI();
  const bmiInfo = bmi ? getBMICategory(Number(bmi)) : null;
  const calorieInfo = calculateCalories();

  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-[#1d1d1f]">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-black/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <img 
                src="/logo_dark.png" 
                alt="Heal Fitness Zone" 
                className="h-10 w-10 rounded-full border-2 border-green-400"
              />
              <h1 className="ml-3 text-xl font-semibold text-gray-900 dark:text-white">
                Heal Fitness Zone
              </h1>
              <p className="ml-2 text-sm text-green-600 dark:text-green-400">
                Empowering Wellness, Inspiring Lives
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div 
                className="relative cursor-pointer group"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-10 h-10 rounded-full border-2 border-green-400 overflow-hidden">
                  {user?.photo ? (
                    <img src={user.photo} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <span className="text-gray-500 dark:text-gray-400 text-xl">
                        {user.fullName?.charAt(0) || user.username?.charAt(0) || 'U'}
                      </span>
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 bg-black/30 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Camera className="w-5 h-5 text-white" />
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handlePhotoUpload} 
                  className="hidden" 
                  accept="image/*"
                />
              </div>
              <button
                onClick={() => { logout(); navigate('/', { replace: true }); }}
                className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="mb-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {user?.fullName || user?.username}! 👋
              </h1>
              <p className="text-green-100 text-lg">
                Ready to crush your fitness goals today?
              </p>
            </div>
            <div className="hidden md:block">
              {user?.photo ? (
                <img 
                  src={user.photo} 
                  alt="Profile" 
                  className="w-20 h-20 rounded-full border-4 border-white/30 object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-3xl font-bold">
                  {user.fullName?.charAt(0) || user.username?.charAt(0) || 'U'}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                        {stat.label}
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                        {stat.value}
                      </p>
                    </div>
                    <div className={`w-10 h-10 ${stat.color} rounded-full flex items-center justify-center`}>
                      <stat.icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Onboarding Data Summary */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-600" />
                Your Fitness Profile
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {/* Height */}
                <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-4 border border-blue-100 dark:border-blue-800">
                  <div className="flex items-center gap-2 mb-1">
                    <Ruler className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-medium text-blue-800 dark:text-blue-300">Height</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    {user.height || '--'} <span className="text-sm">cm</span>
                  </div>
                </div>
                
                {/* Weight */}
                <div className="bg-green-50 dark:bg-green-900/30 rounded-xl p-4 border border-green-100 dark:border-green-800">
                  <div className="flex items-center gap-2 mb-1">
                    <Scale className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="text-sm font-medium text-green-800 dark:text-green-300">Weight</span>
                  </div>
                  <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                    {user.weight || '--'} <span className="text-sm">kg</span>
                  </div>
                </div>
                
                {/* BMI */}
                <div className="bg-purple-50 dark:bg-purple-900/30 rounded-xl p-4 border border-purple-100 dark:border-purple-800">
                  <div className="flex items-center gap-2 mb-1">
                    <Activity className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span className="text-sm font-medium text-purple-800 dark:text-purple-300">BMI</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                    {bmi || '--'}
                  </div>
                  {bmiInfo && (
                    <div className={`text-xs ${bmiInfo.color}`}>
                      {bmiInfo.category}
                    </div>
                  )}
                </div>
                
                {/* Age */}
                <div className="bg-orange-50 dark:bg-orange-900/30 rounded-xl p-4 border border-orange-100 dark:border-orange-800">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    <span className="text-sm font-medium text-orange-800 dark:text-orange-300">Age</span>
                  </div>
                  <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                    {user.dob ? new Date().getFullYear() - new Date(user.dob).getFullYear() : '--'}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Fitness Goal */}
                <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                    <span className="font-medium text-gray-800 dark:text-gray-200">Fitness Goal</span>
                  </div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                    {user.fitnessGoal?.replace(/_/g, ' ') || 'Not set'}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {user.fitnessGoal === 'lose_weight' && 'Focus on calorie deficit and cardio'}
                    {user.fitnessGoal === 'gain_muscle' && 'Focus on protein intake and strength training'}
                    {user.fitnessGoal === 'maintain' && 'Focus on balanced nutrition and consistent exercise'}
                    {user.fitnessGoal === 'improve_fitness' && 'Focus on varied workouts and progressive overload'}
                  </p>
                </div>
                
                {/* Activity Level */}
                <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                    <span className="font-medium text-gray-800 dark:text-gray-200">Activity Level</span>
                  </div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                    {user.activityLevel?.replace(/_/g, ' ') || 'Not set'}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {user.activityLevel === 'sedentary' && 'Little to no regular exercise'}
                    {user.activityLevel === 'light' && 'Light exercise 1-3 days/week'}
                    {user.activityLevel === 'moderate' && 'Moderate exercise 3-5 days/week'}
                    {user.activityLevel === 'active' && 'Hard exercise 6-7 days/week'}
                    {user.activityLevel === 'very_active' && 'Very hard exercise & physical job'}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Nutrition & Calories */}
            {calorieInfo && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-600" />
                  Nutrition & Calories
                </h2>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {/* BMR */}
                  <div className="bg-orange-50 dark:bg-orange-900/30 rounded-xl p-4 border border-orange-100 dark:border-orange-800">
                    <div className="flex items-center gap-2 mb-1">
                      <Flame className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                      <span className="text-sm font-medium text-orange-800 dark:text-orange-300">BMR</span>
                    </div>
                    <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                      {calorieInfo.bmr} <span className="text-sm">kcal</span>
                    </div>
                    <div className="text-xs text-orange-700 dark:text-orange-300">
                      Basal Metabolic Rate
                    </div>
                  </div>
                  
                  {/* TDEE */}
                  <div className="bg-red-50 dark:bg-red-900/30 rounded-xl p-4 border border-red-100 dark:border-red-800">
                    <div className="flex items-center gap-2 mb-1">
                      <Activity className="w-4 h-4 text-red-600 dark:text-red-400" />
                      <span className="text-sm font-medium text-red-800 dark:text-red-300">TDEE</span>
                    </div>
                    <div className="text-2xl font-bold text-red-900 dark:text-red-100">
                      {calorieInfo.tdee} <span className="text-sm">kcal</span>
                    </div>
                    <div className="text-xs text-red-700 dark:text-red-300">
                      Total Daily Energy
                    </div>
                  </div>
                  
                  {/* Target Calories */}
                  <div className="bg-green-50 dark:bg-green-900/30 rounded-xl p-4 border border-green-100 dark:border-green-800">
                    <div className="flex items-center gap-2 mb-1">
                      <Target className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <span className="text-sm font-medium text-green-800 dark:text-green-300">Target</span>
                    </div>
                    <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                      {user.fitnessGoal === 'lose_weight' 
                        ? calorieInfo.tdee - 500 
                        : user.fitnessGoal === 'gain_muscle' 
                          ? calorieInfo.tdee + 300 
                          : calorieInfo.tdee} <span className="text-sm">kcal</span>
                    </div>
                    <div className="text-xs text-green-700 dark:text-green-300">
                      {user.fitnessGoal === 'lose_weight' && 'Calorie Deficit'}
                      {user.fitnessGoal === 'gain_muscle' && 'Calorie Surplus'}
                      {user.fitnessGoal !== 'lose_weight' && user.fitnessGoal !== 'gain_muscle' && 'Maintenance'}
                    </div>
                  </div>
                  
                  {/* Water Intake */}
                  <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-4 border border-blue-100 dark:border-blue-800">
                    <div className="flex items-center gap-2 mb-1">
                      <Droplet className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm font-medium text-blue-800 dark:text-blue-300">Water</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                      {Math.round(Number(user.weight) * 0.033)} <span className="text-sm">L</span>
                    </div>
                    <div className="text-xs text-blue-700 dark:text-blue-300">
                      Daily Target
                    </div>
                  </div>
                </div>
                
                {/* Macros */}
                <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Recommended Macros</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Protein</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{calorieInfo.protein}g</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500 rounded-full" style={{ width: '30%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Carbs</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{calorieInfo.carbs}g</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: '50%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Fats</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{calorieInfo.fats}g</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-500 rounded-full" style={{ width: '20%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Progress Charts */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                Your Progress
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Weight Progress */}
                <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-1">
                      <Scale className="w-4 h-4 text-green-600" />
                      Weight Trend
                    </h3>
                    <span className="text-sm text-green-600 dark:text-green-400 font-medium">-3.2 kg</span>
                  </div>
                  <div className="h-32 flex items-end justify-between gap-1">
                    {progressData.weightHistory.map((weight, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center">
                        <div 
                          className="w-full bg-green-500/80 dark:bg-green-600/80 rounded-t-sm" 
                          style={{ 
                            height: `${(weight - 70) / (80 - 70) * 100}%`,
                            minHeight: '10%'
                          }}
                        ></div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {['M','T','W','T','F','S','S'][i]}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Sleep Tracking */}
                <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-1">
                      <Moon className="w-4 h-4 text-blue-600" />
                      Sleep Quality
                    </h3>
                    <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">7.0 hrs avg</span>
                  </div>
                  <div className="h-32 flex items-end justify-between gap-1">
                    {progressData.sleepHours.map((hours, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center">
                        <div 
                          className="w-full bg-blue-500/80 dark:bg-blue-600/80 rounded-t-sm" 
                          style={{ 
                            height: `${(hours - 5) / (9 - 5) * 100}%`,
                            minHeight: '10%'
                          }}
                        ></div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {['M','T','W','T','F','S','S'][i]}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Quick Actions
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {quickActions.map((action, index) => (
                  <motion.button
                    key={action.label}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex flex-col items-center p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-500 transition-colors"
                    onClick={action.onClick}
                  >
                    <div className={`w-12 h-12 ${action.color} rounded-full flex items-center justify-center mb-3`}>
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white text-center">
                      {action.label}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Assigned Workouts */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-blue-600" />
                Assigned Workouts
              </h2>
              
              {loadingWorkouts ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : assignedWorkouts.length > 0 ? (
                <div className="space-y-4">
                  {assignedWorkouts.map((workout, index) => (
                    <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                          <Dumbbell className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                            {workout.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {workout.muscle_group}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                              <Activity className="w-4 h-4" />
                              <span>{workout.sets} sets × {workout.reps} reps</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Target className="w-4 h-4" />
                              <span>{workout.level || 'Intermediate'}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 mt-2 text-xs text-gray-400 dark:text-gray-500">
                            <Clock className="w-3 h-3" />
                            <span>Assigned {new Date(workout.assigned_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <button className="bg-gray-100 dark:bg-gray-700 p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                          <Info className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  <button className="w-full py-3 mt-2 flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400 font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors">
                    <span>View all workouts</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 dark:bg-gray-700/20 rounded-xl">
                  <Dumbbell className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                  <p className="text-gray-500 dark:text-gray-400">No workouts assigned yet</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Your trainer will assign workouts soon</p>
                </div>
              )}
            </div>

            {/* Recent Activities */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-600" />
                Recent Activities
              </h2>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-100 dark:border-gray-700">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/50 rounded-xl flex items-center justify-center mr-4 text-green-600 dark:text-green-400">
                      {activity.type === 'workout' && <Dumbbell className="w-5 h-5" />}
                      {activity.type === 'meal' && <Utensils className="w-5 h-5" />}
                      {activity.type === 'achievement' && <Award className="w-5 h-5" />}
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
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Profile Completion
              </h2>
              <div className="relative">
                <div className="w-32 h-32 mx-auto mb-4">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="#e5e7eb"
                      strokeWidth="8"
                      fill="transparent"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="#10b981"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 56}`}
                      strokeDashoffset={`${2 * Math.PI * 56 * (1 - completion / 100)}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
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
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-600" />
                Upcoming Workouts
              </h2>
              <div className="space-y-4">
                {upcomingWorkouts.map((workout, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-100 dark:border-gray-700">
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
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' 
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                      {workout.difficulty}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Dietary Preferences */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Utensils className="w-5 h-5 text-red-600" />
                Dietary Preferences
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Diet Type
                  </span>
                  <span className="text-sm text-gray-900 dark:text-white capitalize">
                    {user.dietaryPreference?.replace(/_/g, ' ') || 'Not set'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Allergies
                  </span>
                  <span className="text-sm text-gray-900 dark:text-white">
                    {user.allergies || 'None reported'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Meal Frequency
                  </span>
                  <span className="text-sm text-gray-900 dark:text-white">
                    4-5 meals/day
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Water Intake
                  </span>
                  <span className="text-sm text-gray-900 dark:text-white">
                    {Math.round(Number(user.weight) * 0.033)}L daily
                  </span>
                </div>
              </div>
            </div>

            {/* Body Measurements Summary */}
            {user?.phone && (
              <BodyMeasurementSummary userId={user.phone} />
            )}

            {/* Quick Profile Edit */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-blue-600" />
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
                          className="w-24 px-2 py-1 text-sm border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;