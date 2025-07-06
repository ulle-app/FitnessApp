import React, { useState, useRef, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { 
  Edit2, CheckCircle, Camera, 
  Activity, Award, Dumbbell, 
  Heart, Zap, Users, Info,
  Clock, ArrowRight, Calendar,
  TrendingUp, TrendingDown
} from 'lucide-react';
import { motion } from 'framer-motion';

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

  // Stats data
  const stats = [
    { label: 'Workouts This Week', value: '4', icon: Dumbbell, color: 'bg-blue-500' },
    { label: 'Calories Burned', value: '1,240', icon: Zap, color: 'bg-orange-500' },
    { label: 'Current Streak', value: '12 days', icon: Award, color: 'bg-green-500' },
    { label: 'Weight Progress', value: '-2.5 kg', icon: TrendingUp, color: 'bg-purple-500' },
  ];

  const quickActions = [
    { label: 'Start Workout', icon: Dumbbell, color: 'bg-blue-500', onClick: () => {} },
    { label: 'Log Meal', icon: Heart, color: 'bg-red-500', onClick: () => {} },
    { label: 'Track Weight', icon: TrendingUp, color: 'bg-green-500', onClick: () => {} },
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
                      {activity.type === 'meal' && <Heart className="w-5 h-5" />}
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