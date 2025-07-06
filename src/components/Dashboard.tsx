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
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: user.phone, plan: newPlan }),
    });
    
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
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;