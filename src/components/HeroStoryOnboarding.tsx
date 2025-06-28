import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Camera, User, Activity, HeartPulse, MapPin, Calendar, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import avatar1 from '../assets/avatars/avatar1.svg';
import avatar2 from '../assets/avatars/avatar2.svg';
import avatar3 from '../assets/avatars/avatar3.svg';

const AVATAR_OPTIONS = [
  { id: 1, src: avatar1, label: 'Fitness Enthusiast', description: 'Ready to conquer any challenge' },
  { id: 2, src: avatar2, label: 'Wellness Warrior', description: 'Balance mind, body, and spirit' },
  { id: 3, src: avatar3, label: 'Health Hero', description: 'Inspiring others to greatness' },
];

interface HeroStoryData {
  username: string;
  fullName: string;
  photo: string | null;
  avatar: string | null;
  gender: string;
  dob: string;
  height: string;
  weight: string;
  activityLevel: string;
  fitnessGoal: string;
  dietaryPreference: string;
  sleepHours: string;
  stressLevel: string;
  medicalConditions: string;
  city: string;
  country: string;
}

const initialData: HeroStoryData = {
  username: '',
  fullName: '',
  photo: null,
  avatar: null,
  gender: '',
  dob: '',
  height: '',
  weight: '',
  activityLevel: '',
  fitnessGoal: '',
  dietaryPreference: '',
  sleepHours: '',
  stressLevel: '5',
  medicalConditions: '',
  city: '',
  country: '',
};

const HeroStoryOnboarding: React.FC = () => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<HeroStoryData>(initialData);
  const [currentPanel, setCurrentPanel] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showAvatarDropdown, setShowAvatarDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const handleDataChange = (field: keyof HeroStoryData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleDataChange('photo', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarSelect = (avatar: typeof AVATAR_OPTIONS[0]) => {
    handleDataChange('avatar', avatar.src);
    setShowAvatarDropdown(false);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: user?.phone,
          ...data,
          photo: data.photo || data.avatar || '',
        })
      });
      const responseData = await res.json();
      if (responseData.success) {
        setUser({ ...user, ...data, photo: data.photo || data.avatar || '' });
        navigate('/dashboard');
      } else {
        setError(responseData.error || 'Failed to save profile. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save profile.');
    }
    setLoading(false);
  };

  const panels = [
    // Panel 1: Cover - "Meet Your Hero"
    {
      id: 'cover',
      title: 'Meet Your Hero',
      component: (
        <div className="flex flex-col items-center justify-center h-full text-center space-y-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative"
          >
            {/* Hero Silhouette */}
            <div className="w-48 h-64 bg-gradient-to-b from-gray-300 to-gray-400 rounded-full relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-green-400 to-blue-500 opacity-20"></div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-gray-200 rounded-full -mb-16"></div>
            </div>
            
            {/* Speech Bubble */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="absolute -top-20 left-1/2 transform -translate-x-1/2 bg-white rounded-2xl p-4 shadow-lg border-2 border-green-400"
            >
              <div className="relative">
                <input
                  type="text"
                  value={data.username}
                  onChange={(e) => handleDataChange('username', e.target.value)}
                  placeholder="Call me..."
                  className="text-2xl font-bold text-gray-900 bg-transparent border-none outline-none text-center w-48"
                  maxLength={20}
                />
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.3 }}
                  className="absolute -top-1 -right-1"
                >
                  <Sparkles className="w-4 h-4 text-green-500" />
                </motion.div>
              </div>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-r-2 border-b-2 border-green-400 rotate-45"></div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="space-y-4"
          >
            <h1 className="text-4xl font-bold text-gray-900">Your Hero's Journey Begins</h1>
            <p className="text-xl text-gray-600 max-w-md">
              Every legend starts with a name. What will yours be?
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="flex items-center space-x-4"
          >
            <input
              type="text"
              value={data.fullName}
              onChange={(e) => handleDataChange('fullName', e.target.value)}
              placeholder="Your full name..."
              className="text-xl text-gray-900 bg-white/80 backdrop-blur-sm rounded-xl px-6 py-3 border-2 border-green-400 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
            />
          </motion.div>
        </div>
      )
    },

    // Panel 2: Look - "Choose Your Look"
    {
      id: 'look',
      title: 'Choose Your Look',
      component: (
        <div className="flex flex-col items-center justify-center h-full space-y-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-4"
          >
            <h2 className="text-4xl font-bold text-gray-900">Choose Your Look</h2>
            <p className="text-xl text-gray-600">Select your avatar or upload your photo</p>
          </motion.div>

          <div className="flex items-center space-x-12">
            {/* Camera Section */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-center space-y-4"
            >
              <div className="relative">
                <div 
                  className="w-32 h-32 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center cursor-pointer hover:scale-105 transition-all shadow-lg"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {data.photo ? (
                    <img src={data.photo} alt="Profile" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <Camera className="w-12 h-12 text-white" />
                  )}
                </div>
                <input 
                  type="file" 
                  accept="image/*" 
                  ref={fileInputRef} 
                  onChange={handlePhotoChange} 
                  className="hidden" 
                />
              </div>
              <p className="text-sm text-gray-600">Upload Photo</p>
            </motion.div>

            {/* Avatar Section */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-center space-y-4"
            >
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowAvatarDropdown(!showAvatarDropdown)}
                  className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center hover:scale-105 transition-all shadow-lg"
                  type="button"
                >
                  {data.avatar ? (
                    <img src={data.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <User className="w-12 h-12 text-white" />
                  )}
                </button>
                {showAvatarDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 p-2 z-50 pointer-events-auto"
                  >
                    {AVATAR_OPTIONS.length > 0 ? (
                      AVATAR_OPTIONS.map((avatar) => (
                        <button
                          key={avatar.id}
                          onClick={() => handleAvatarSelect(avatar)}
                          className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors w-full text-left"
                          type="button"
                        >
                          <img src={avatar.src} alt={avatar.label} className="w-8 h-8 rounded-full" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{avatar.label}</p>
                            <p className="text-xs text-gray-500">{avatar.description}</p>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="text-gray-500 text-sm p-2">No avatars available. You can add one later in your profile.</div>
                    )}
                  </motion.div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-2">Optional: You can update your avatar later in your dashboard.</p>
            </motion.div>
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-center"
          >
            <p className="text-gray-500">Your choice will appear throughout your journey</p>
          </motion.div>
        </div>
      )
    },

    // Panel 3: Stats - "Origin Stats"
    {
      id: 'stats',
      title: 'Origin Stats',
      component: (
        <div className="flex flex-col items-center justify-center h-full space-y-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-4"
          >
            <h2 className="text-4xl font-bold text-gray-900">Origin Stats</h2>
            <p className="text-xl text-gray-600">Let's scan your hero's foundation</p>
          </motion.div>

          <div className="grid grid-cols-2 gap-8 max-w-2xl w-full">
            {/* Gender */}
            <motion.div
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="space-y-2"
            >
              <label className="text-sm font-medium text-gray-700">Gender</label>
              <select
                value={data.gender}
                onChange={(e) => handleDataChange('gender', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
            </motion.div>

            {/* Date of Birth */}
            <motion.div
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="space-y-2"
            >
              <label className="text-sm font-medium text-gray-700">Date of Birth</label>
              <input
                type="date"
                value={data.dob}
                onChange={(e) => handleDataChange('dob', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
              />
            </motion.div>

            {/* Height */}
            <motion.div
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="space-y-2"
            >
              <label className="text-sm font-medium text-gray-700">Height (cm)</label>
              <input
                type="number"
                value={data.height}
                onChange={(e) => handleDataChange('height', e.target.value)}
                placeholder="175"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
              />
            </motion.div>

            {/* Weight */}
            <motion.div
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="space-y-2"
            >
              <label className="text-sm font-medium text-gray-700">Weight (kg)</label>
              <input
                type="number"
                value={data.weight}
                onChange={(e) => handleDataChange('weight', e.target.value)}
                placeholder="70"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
              />
            </motion.div>
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-center"
          >
            <p className="text-gray-500">These stats help us personalize your journey</p>
          </motion.div>
        </div>
      )
    },

    // Panel 4: Hero's Quest - "Map with glowing quest markers"
    {
      id: 'quest',
      title: "Hero's Quest",
      component: (
        <div className="flex flex-col items-center justify-center h-full space-y-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-4"
          >
            <h2 className="text-4xl font-bold text-gray-900">Hero's Quest</h2>
            <p className="text-xl text-gray-600">Choose your fitness mission</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
            {/* Activity Level */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold text-gray-900">Current Activity Level</h3>
              <div className="space-y-3">
                {[
                  { value: 'sedentary', label: 'Sedentary', desc: 'Little or no exercise' },
                  { value: 'light', label: 'Lightly Active', desc: '1-3 days/week' },
                  { value: 'moderate', label: 'Moderately Active', desc: '3-5 days/week' },
                  { value: 'very', label: 'Very Active', desc: '6-7 days/week' },
                  { value: 'super', label: 'Super Active', desc: 'Very hard exercise & physical job' }
                ].map((option) => (
                  <motion.button
                    key={option.value}
                    onClick={() => handleDataChange('activityLevel', option.value)}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      data.activityLevel === option.value
                        ? 'border-green-500 bg-green-50 shadow-lg'
                        : 'border-gray-200 bg-white hover:border-green-300'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="font-medium text-gray-900">{option.label}</div>
                    <div className="text-sm text-gray-600">{option.desc}</div>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Fitness Goal */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold text-gray-900">Your Fitness Goal</h3>
              <div className="space-y-3">
                {[
                  { value: 'lose_weight', label: 'Lose Weight', desc: 'Shed pounds and get leaner' },
                  { value: 'build_muscle', label: 'Build Muscle', desc: 'Gain strength and size' },
                  { value: 'get_fitter', label: 'Get Fitter', desc: 'Improve overall fitness' },
                  { value: 'maintain', label: 'Maintain', desc: 'Stay healthy and active' },
                  { value: 'custom', label: 'Custom Goal', desc: 'Tell us your specific aim' }
                ].map((option) => (
                  <motion.button
                    key={option.value}
                    onClick={() => handleDataChange('fitnessGoal', option.value)}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      data.fitnessGoal === option.value
                        ? 'border-blue-500 bg-blue-50 shadow-lg'
                        : 'border-gray-200 bg-white hover:border-blue-300'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="font-medium text-gray-900">{option.label}</div>
                    <div className="text-sm text-gray-600">{option.desc}</div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Custom Goal Input */}
          {data.fitnessGoal === 'custom' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-md"
            >
              <input
                type="text"
                placeholder="Describe your fitness goal..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
              />
            </motion.div>
          )}
        </div>
      )
    },

    // Panel 5: Daily Lore - "Clock and diary icons"
    {
      id: 'daily',
      title: 'Daily Lore',
      component: (
        <div className="flex flex-col items-center justify-center h-full space-y-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-4"
          >
            <h2 className="text-4xl font-bold text-gray-900">Daily Lore</h2>
            <p className="text-xl text-gray-600">Your daily habits and preferences</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
            {/* Sleep Hours */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="space-y-4"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Sleep Hours</h3>
              </div>
              <div className="relative">
                <input
                  type="number"
                  value={data.sleepHours}
                  onChange={(e) => handleDataChange('sleepHours', e.target.value)}
                  placeholder="7"
                  min="4"
                  max="12"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-center text-2xl font-bold"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">hours</div>
              </div>
              <p className="text-sm text-gray-600 text-center">Average hours of sleep per night</p>
            </motion.div>

            {/* Stress Level */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="space-y-4"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <HeartPulse className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Stress Level</h3>
              </div>
              <div className="space-y-3">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={data.stressLevel}
                  onChange={(e) => handleDataChange('stressLevel', e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>😌 Low</span>
                  <span className="font-medium text-lg">{data.stressLevel}</span>
                  <span>😰 High</span>
                </div>
              </div>
            </motion.div>

            {/* Dietary Preference */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="space-y-4"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Activity className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Dietary Preference</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'veg', label: 'Vegetarian', emoji: '🥬' },
                  { value: 'nonveg', label: 'Non-Veg', emoji: '🍖' },
                  { value: 'vegan', label: 'Vegan', emoji: '🌱' },
                  { value: 'other', label: 'Other', emoji: '🍽️' }
                ].map((option) => (
                  <motion.button
                    key={option.value}
                    onClick={() => handleDataChange('dietaryPreference', option.value)}
                    className={`p-3 rounded-xl border-2 transition-all text-center ${
                      data.dietaryPreference === option.value
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 bg-white hover:border-green-300'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="text-2xl mb-1">{option.emoji}</div>
                    <div className="text-sm font-medium text-gray-900">{option.label}</div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      )
    },

    // Panel 6: Health Scroll - "Ancient parchment"
    {
      id: 'health',
      title: 'Health Scroll',
      component: (
        <div className="flex flex-col items-center justify-center h-full space-y-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-4"
          >
            <h2 className="text-4xl font-bold text-gray-900">Health Scroll</h2>
            <p className="text-xl text-gray-600">Any medical conditions we should know about?</p>
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="w-full max-w-2xl"
          >
            <div className="bg-gradient-to-b from-amber-50 to-yellow-100 border-2 border-amber-200 rounded-2xl p-8 shadow-lg">
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-amber-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Activity className="w-8 h-8 text-amber-700" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Medical Information</h3>
                  <p className="text-gray-600">This helps us create a safe and personalized plan</p>
                </div>

                <div className="space-y-4">
                  <textarea
                    value={data.medicalConditions}
                    onChange={(e) => handleDataChange('medicalConditions', e.target.value)}
                    placeholder="Optional: Any medical conditions, injuries, medications, or health concerns..."
                    className="w-full px-4 py-3 border border-amber-300 rounded-xl bg-white/80 text-gray-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all resize-none"
                    rows={4}
                  />
                </div>

                <div className="text-center">
                  <div className="inline-flex items-center space-x-2 text-sm text-amber-700 bg-amber-100 px-4 py-2 rounded-full">
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                    <span>Stored securely on encrypted servers</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-center"
          >
            <p className="text-gray-500">You can skip this if you prefer</p>
          </motion.div>
        </div>
      )
    },

    // Panel 7: Realm & Units - "World-map flyover"
    {
      id: 'realm',
      title: 'Realm & Units',
      component: (
        <div className="flex flex-col items-center justify-center h-full space-y-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-4"
          >
            <h2 className="text-4xl font-bold text-gray-900">Realm & Units</h2>
            <p className="text-xl text-gray-600">Where in the world are you?</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
            {/* City */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="space-y-4"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Your City</h3>
              </div>
              <input
                type="text"
                value={data.city}
                onChange={(e) => handleDataChange('city', e.target.value)}
                placeholder="Enter your city..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              />
            </motion.div>

            {/* Country */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="space-y-4"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Your Country</h3>
              </div>
              <input
                type="text"
                value={data.country}
                onChange={(e) => handleDataChange('country', e.target.value)}
                placeholder="Enter your country..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
              />
            </motion.div>
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-center"
          >
            <p className="text-gray-500">This helps us provide location-based recommendations</p>
          </motion.div>
        </div>
      )
    },

    // Panel 8: Gear & Allies - "Gadget shelf"
    {
      id: 'gear',
      title: 'Gear & Allies',
      component: (
        <div className="flex flex-col items-center justify-center h-full space-y-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-4"
          >
            <h2 className="text-4xl font-bold text-gray-900">Gear & Allies</h2>
            <p className="text-xl text-gray-600">Connect your fitness devices (optional)</p>
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="w-full max-w-3xl"
          >
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-2xl p-8 shadow-lg">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { name: 'Apple Watch', icon: '⌚', color: 'from-blue-400 to-blue-600' },
                  { name: 'Fitbit', icon: '📱', color: 'from-pink-400 to-pink-600' },
                  { name: 'Garmin', icon: '🏃', color: 'from-green-400 to-green-600' },
                  { name: 'Samsung', icon: '📊', color: 'from-purple-400 to-purple-600' },
                  { name: 'Strava', icon: '🏃‍♂️', color: 'from-orange-400 to-orange-600' },
                  { name: 'MyFitnessPal', icon: '🍎', color: 'from-red-400 to-red-600' },
                  { name: 'Google Fit', icon: '📈', color: 'from-indigo-400 to-indigo-600' },
                  { name: 'Skip for now', icon: '⏭️', color: 'from-gray-400 to-gray-600' }
                ].map((device, index) => (
                  <motion.button
                    key={device.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.5 }}
                    className={`p-6 rounded-xl border-2 border-gray-200 bg-white hover:border-gray-300 transition-all text-center group`}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className={`w-12 h-12 bg-gradient-to-r ${device.color} rounded-full flex items-center justify-center mx-auto mb-3 text-white text-xl`}>
                      {device.icon}
                    </div>
                    <div className="text-sm font-medium text-gray-900">{device.name}</div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-center"
          >
            <p className="text-gray-500">You can always connect devices later in settings</p>
          </motion.div>
        </div>
      )
    }
  ];

  // Update user context when photo/avatar changes
  useEffect(() => {
    if ((data.photo || data.avatar) && user) {
      setUser({ ...user, photo: data.photo || data.avatar || '' });
    }
  }, [data.photo, data.avatar, user, setUser]);

  // Pre-fill username from signup
  useEffect(() => {
    if (user?.username) {
      setData(prev => ({ ...prev, username: user.username || '' }));
    }
  }, [user?.username]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowAvatarDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowDown' || event.key === 'PageDown') {
        event.preventDefault();
        const nextPanel = Math.min(currentPanel + 1, panels.length);
        setCurrentPanel(nextPanel);
        // Scroll to next panel
        const panelElement = document.querySelector(`[data-panel="${nextPanel}"]`);
        if (panelElement) {
          panelElement.scrollIntoView({ behavior: 'smooth' });
        }
      } else if (event.key === 'ArrowUp' || event.key === 'PageUp') {
        event.preventDefault();
        const prevPanel = Math.max(currentPanel - 1, 0);
        setCurrentPanel(prevPanel);
        // Scroll to previous panel
        const panelElement = document.querySelector(`[data-panel="${prevPanel}"]`);
        if (panelElement) {
          panelElement.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentPanel, panels.length]);

  // Update current panel based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const scrollTop = window.scrollY;
        const windowHeight = window.innerHeight;
        const panelIndex = Math.round(scrollTop / windowHeight);
        setCurrentPanel(Math.max(0, Math.min(panelIndex, panels.length)));
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [panels.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-hidden">
      {/* Progress Orb */}
      <motion.div
        className="fixed bottom-8 right-8 z-50"
        style={{
          x: useTransform(scrollYProgress, [0, 1], [0, 200]),
          y: useTransform(scrollYProgress, [0, 1], [0, -200])
        }}
      >
        <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-blue-500 rounded-full shadow-lg animate-pulse"></div>
      </motion.div>

      {/* Main Container */}
      <div ref={containerRef} className="relative snap-y snap-mandatory h-screen overflow-y-auto">
        {panels.map((panel, index) => (
          <motion.div
            key={panel.id}
            data-panel={index}
            className="h-screen flex items-center justify-center px-4 snap-start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="max-w-4xl w-full">
              {panel.component}
            </div>
          </motion.div>
        ))}

        {/* Final CTA Panel */}
        <motion.div
          data-panel={panels.length}
          className="h-screen flex items-center justify-center px-4 snap-start"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center space-y-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              {/* Hero Silhouette with Photo/Avatar */}
              <div className="relative mx-auto w-32 h-32">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.6, type: "spring" }}
                  className="w-full h-full rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center overflow-hidden shadow-2xl"
                >
                  {data.photo || data.avatar ? (
                    <img 
                      src={data.photo || data.avatar || ''} 
                      alt="Profile" 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <User className="w-16 h-16 text-white" />
                  )}
                </motion.div>
                
                {/* Glowing effect */}
                <motion.div
                  animate={{ 
                    boxShadow: [
                      "0 0 20px rgba(16, 185, 129, 0.3)",
                      "0 0 40px rgba(16, 185, 129, 0.6)",
                      "0 0 20px rgba(16, 185, 129, 0.3)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 rounded-full"
                />
              </div>

              <div className="space-y-4">
                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="text-4xl font-bold text-gray-900"
                >
                  Ready to Begin Your Journey, {data.username || 'Hero'}?
                </motion.h2>
                
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                  className="text-xl text-gray-600 max-w-2xl mx-auto"
                >
                  Your hero story is about to unfold. Every legend starts with a single step.
                </motion.p>
              </div>

              {/* Progress Summary */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.6 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200 max-w-md mx-auto"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Hero Profile</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-left">
                    <span className="text-gray-600">Name:</span>
                    <div className="font-medium text-gray-900">{data.fullName || 'Not set'}</div>
                  </div>
                  <div className="text-left">
                    <span className="text-gray-600">Goal:</span>
                    <div className="font-medium text-gray-900">{data.fitnessGoal || 'Not set'}</div>
                  </div>
                  <div className="text-left">
                    <span className="text-gray-600">Activity:</span>
                    <div className="font-medium text-gray-900">{data.activityLevel || 'Not set'}</div>
                  </div>
                  <div className="text-left">
                    <span className="text-gray-600">Location:</span>
                    <div className="font-medium text-gray-900">{data.city || 'Not set'}</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.6 }}
              className="space-y-4"
            >
              <motion.button
                onClick={handleSubmit}
                disabled={loading}
                className="px-12 py-4 bg-gradient-to-r from-green-500 to-blue-500 text-white text-xl font-bold rounded-xl hover:from-green-600 hover:to-blue-600 shadow-lg transition-all disabled:opacity-50 relative overflow-hidden group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
                <span className="relative z-10 flex items-center gap-3">
                  {loading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      Starting Your Journey...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-6 h-6" />
                      Begin Chapter 1
                    </>
                  )}
                </span>
              </motion.button>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3, duration: 0.6 }}
                className="text-sm text-gray-500"
              >
                Your fitness adventure awaits! 🚀
              </motion.p>
            </motion.div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-xl p-4 max-w-md mx-auto"
              >
                <p className="text-red-700 text-sm">{error}</p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroStoryOnboarding; 