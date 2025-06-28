import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Camera, Activity, HeartPulse, MapPin, Calendar, 
  ChevronDown, ChevronUp, Sparkles, Star, Trophy, Target,
  ArrowRight, CheckCircle, Circle, Play
} from 'lucide-react';
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

interface TimelineData {
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

const initialData: TimelineData = {
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

const TimelineOnboarding: React.FC = () => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const [data, setData] = useState<TimelineData>(initialData);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | HTMLButtonElement | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 120); // 120ms delay to allow animation and DOM update
    return () => clearTimeout(timeout);
  }, [currentStep]);

  const handleDataChange = (field: keyof TimelineData, value: string) => {
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
    setShowDropdown(null);
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

  const steps = [
    {
      id: 'name',
      title: 'Hero Name',
      icon: User,
      type: 'text',
      field: 'username',
      placeholder: 'e.g. IronRunner, FitGuru, WellnessWarrior',
      description: 'Pick a fun nickname for your fitness journey! This will be visible to others.',
      required: true,
      position: { x: 0, y: 0 }
    },
    {
      id: 'fullName',
      title: 'Full Name',
      icon: User,
      type: 'text',
      field: 'fullName',
      placeholder: 'e.g. John Doe',
      description: 'Your real name (kept private)',
      required: true,
      position: { x: 200, y: 0 }
    },
    {
      id: 'avatar',
      title: 'Choose Avatar',
      icon: Camera,
      type: 'dropdown',
      field: 'avatar',
      options: AVATAR_OPTIONS,
      required: false,
      position: { x: 400, y: 0 }
    },
    {
      id: 'gender',
      title: 'Gender',
      icon: User,
      type: 'dropdown',
      field: 'gender',
      options: [
        { id: 'male', label: 'Male', description: 'Male' },
        { id: 'female', label: 'Female', description: 'Female' },
        { id: 'other', label: 'Other', description: 'Other' }
      ],
      required: true,
      position: { x: 600, y: 0 }
    },
    {
      id: 'dob',
      title: 'Birth Date',
      icon: Calendar,
      type: 'date',
      field: 'dob',
      required: true,
      position: { x: 800, y: 0 }
    },
    {
      id: 'height',
      title: 'Height',
      icon: Activity,
      type: 'text',
      field: 'height',
      placeholder: 'Height in cm...',
      required: true,
      position: { x: 1000, y: 0 }
    },
    {
      id: 'weight',
      title: 'Weight',
      icon: Activity,
      type: 'text',
      field: 'weight',
      placeholder: 'Weight in kg...',
      required: true,
      position: { x: 1200, y: 0 }
    },
    {
      id: 'activity',
      title: 'Activity Level',
      icon: Activity,
      type: 'dropdown',
      field: 'activityLevel',
      options: [
        { id: 'sedentary', label: 'Sedentary', description: 'Little to no exercise' },
        { id: 'light', label: 'Light', description: 'Light exercise 1-3 days/week' },
        { id: 'moderate', label: 'Moderate', description: 'Moderate exercise 3-5 days/week' },
        { id: 'active', label: 'Active', description: 'Hard exercise 6-7 days/week' },
        { id: 'very_active', label: 'Very Active', description: 'Very hard exercise, physical job' }
      ],
      required: true,
      position: { x: 1400, y: 0 }
    },
    {
      id: 'goal',
      title: 'Fitness Goal',
      icon: Target,
      type: 'dropdown',
      field: 'fitnessGoal',
      options: [
        { id: 'lose_weight', label: 'Lose Weight', description: 'Shed those extra pounds' },
        { id: 'gain_muscle', label: 'Gain Muscle', description: 'Build strength and size' },
        { id: 'maintain', label: 'Maintain', description: 'Stay fit and healthy' },
        { id: 'improve_fitness', label: 'Improve Fitness', description: 'Boost overall fitness' }
      ],
      required: true,
      position: { x: 1600, y: 0 }
    },
    {
      id: 'diet',
      title: 'Dietary Preference',
      icon: HeartPulse,
      type: 'dropdown',
      field: 'dietaryPreference',
      options: [
        { id: 'omnivore', label: 'Omnivore', description: 'Eat everything' },
        { id: 'vegetarian', label: 'Vegetarian', description: 'No meat' },
        { id: 'vegan', label: 'Vegan', description: 'Plant-based only' },
        { id: 'keto', label: 'Keto', description: 'Low-carb, high-fat' },
        { id: 'paleo', label: 'Paleo', description: 'Ancient human diet' }
      ],
      required: true,
      position: { x: 1800, y: 0 }
    },
    {
      id: 'sleep',
      title: 'Sleep Hours',
      icon: Calendar,
      type: 'dropdown',
      field: 'sleepHours',
      options: [
        { id: 'less_6', label: '< 6 hours', description: 'Less than 6 hours' },
        { id: '6_7', label: '6-7 hours', description: '6 to 7 hours' },
        { id: '7_8', label: '7-8 hours', description: '7 to 8 hours' },
        { id: '8_9', label: '8-9 hours', description: '8 to 9 hours' },
        { id: 'more_9', label: '> 9 hours', description: 'More than 9 hours' }
      ],
      required: true,
      position: { x: 2000, y: 0 }
    },
    {
      id: 'stress',
      title: 'Stress Level',
      icon: HeartPulse,
      type: 'slider',
      field: 'stressLevel',
      min: 1,
      max: 10,
      required: true,
      position: { x: 2200, y: 0 }
    },
    {
      id: 'medical',
      title: 'Medical Conditions',
      icon: HeartPulse,
      type: 'textarea',
      field: 'medicalConditions',
      placeholder: 'Any medical conditions or allergies...',
      required: false,
      position: { x: 2400, y: 0 }
    },
    {
      id: 'location',
      title: 'Location',
      icon: MapPin,
      type: 'text',
      field: 'city',
      placeholder: 'Your city...',
      required: true,
      position: { x: 2600, y: 0 }
    }
  ];

  const isStepCompleted = (stepIndex: number) => {
    const step = steps[stepIndex];
    if (!step) return false;
    
    const value = data[step.field as keyof TimelineData];
    if (step.required && !value) return false;
    return true;
  };

  const canProceedToNext = () => {
    const currentStepData = steps[currentStep];
    if (!currentStepData) return false;
    
    if (currentStepData.required) {
      const value = data[currentStepData.field as keyof TimelineData];
      return value && value.trim() !== '';
    }
    return true;
  };

  const handleNext = () => {
    if (canProceedToNext() && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Handler for Enter key to go to next step
  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && canProceedToNext()) {
      e.preventDefault();
      handleNext();
    }
  };

  const renderInput = (step: typeof steps[0]) => {
    const value = data[step.field as keyof TimelineData];
    
    let inputElement = null;
    switch (step.type) {
      case 'text':
        inputElement = (
          <input
            key={step.id}
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={value || ''}
            onChange={(e) => handleDataChange(step.field as keyof TimelineData, e.target.value)}
            placeholder={step.placeholder}
            className="w-full px-4 py-3 text-lg bg-white/90 backdrop-blur-sm rounded-xl border-2 border-gray-300 focus:border-blue-400 focus:outline-none transition-all"
            onKeyDown={handleInputKeyDown}
          />
        );
        break;
      
      case 'date':
        inputElement = (
          <input
            key={step.id}
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="date"
            value={value || ''}
            onChange={(e) => handleDataChange(step.field as keyof TimelineData, e.target.value)}
            className="w-full px-4 py-3 text-lg bg-white/90 backdrop-blur-sm rounded-xl border-2 border-gray-300 focus:border-blue-400 focus:outline-none transition-all"
            onKeyDown={handleInputKeyDown}
          />
        );
        break;
      
      case 'dropdown':
        if (step.field === 'avatar' && step.options) {
          const selectedAvatar = step.options.find(opt => String(opt.id) === value);
          inputElement = (
            <div className="relative w-full">
              <button
                key={step.id}
                ref={inputRef as React.RefObject<HTMLButtonElement>}
                onClick={() => setShowDropdown(showDropdown === step.id ? null : step.id)}
                className="w-full px-4 py-3 text-lg bg-white/90 backdrop-blur-sm rounded-xl border-2 border-gray-300 focus:border-blue-400 focus:outline-none transition-all flex items-center justify-between"
                onKeyDown={handleInputKeyDown}
              >
                <span className="flex items-center gap-2">
                  {selectedAvatar && 'src' in selectedAvatar && (
                    <img src={selectedAvatar.src} alt={selectedAvatar.label} className="w-8 h-8 rounded-full border border-green-400" />
                  )}
                  <span className={value ? 'text-gray-900' : 'text-gray-500'}>
                    {selectedAvatar ? selectedAvatar.label : step.placeholder || 'Select...'}
                  </span>
                </span>
                <ChevronDown className={`w-5 h-5 transition-transform ${showDropdown === step.id ? 'rotate-180' : ''}`} />
              </button>
              {showDropdown === step.id && (
                <div
                  className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border-2 border-green-400 shadow-lg z-50 max-h-60 overflow-y-auto"
                >
                  {step.options.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => {
                        handleDataChange(step.field as keyof TimelineData, String(option.id));
                        setShowDropdown(null);
                      }}
                      className="w-full px-4 py-3 text-left transition-colors border-b border-gray-100 last:border-b-0 flex items-center gap-3 hover:bg-green-100 hover:border-l-4 hover:border-green-500"
                      type="button"
                    >
                      {'src' in option && (
                        <img src={option.src} alt={option.label} className="w-8 h-8 rounded-full border border-green-400" />
                      )}
                      <div>
                        <div className="font-medium text-gray-900">{option.label}</div>
                        {option.description && (
                          <div className="text-sm text-gray-600">{option.description}</div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        } else {
          const selectedOption = step.options?.find(opt => String(opt.id) === String(value));
          inputElement = (
            <div className="relative w-full">
              <button
                key={step.id}
                ref={inputRef as React.RefObject<HTMLButtonElement>}
                onClick={() => setShowDropdown(showDropdown === step.id ? null : step.id)}
                className="w-full px-4 py-3 text-lg bg-white/90 backdrop-blur-sm rounded-xl border-2 border-gray-300 focus:border-blue-400 focus:outline-none transition-all flex items-center justify-between"
                onKeyDown={handleInputKeyDown}
                type="button"
              >
                <span className={value ? 'text-gray-900' : 'text-gray-500'}>
                  {selectedOption ? selectedOption.label : step.placeholder || 'Select...'}
                </span>
                <ChevronDown className={`w-5 h-5 transition-transform ${showDropdown === step.id ? 'rotate-180' : ''}`} />
              </button>
              {showDropdown === step.id && step.options && (
                <div
                  className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border-2 border-green-400 shadow-lg z-50 max-h-60 overflow-y-auto"
                >
                  {step.options.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => {
                        handleDataChange(step.field as keyof TimelineData, String(option.id));
                        setShowDropdown(null);
                      }}
                      className="w-full px-4 py-3 text-left transition-colors border-b border-gray-100 last:border-b-0 hover:bg-green-100 hover:border-l-4 hover:border-green-500"
                      type="button"
                    >
                      <div className="font-medium text-gray-900">{option.label}</div>
                      {option.description && (
                        <div className="text-sm text-gray-600">{option.description}</div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        }
        break;
      
      case 'slider':
        inputElement = (
          <div className="w-full space-y-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Low Stress</span>
              <span>High Stress</span>
            </div>
            <input
              key={step.id}
              ref={inputRef as React.RefObject<HTMLInputElement>}
              type="range"
              min={step.min || 1}
              max={step.max || 10}
              value={value || '5'}
              onChange={(e) => handleDataChange(step.field as keyof TimelineData, e.target.value)}
              className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              onKeyDown={handleInputKeyDown}
            />
            <div className="text-center text-2xl font-bold text-green-600">{value || '5'}</div>
          </div>
        );
        break;
      
      case 'textarea':
        inputElement = (
          <textarea
            key={step.id}
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={value || ''}
            onChange={(e) => handleDataChange(step.field as keyof TimelineData, e.target.value)}
            placeholder={step.placeholder}
            rows={4}
            className="w-full px-4 py-3 text-lg bg-white/90 backdrop-blur-sm rounded-xl border-2 border-gray-300 focus:border-blue-400 focus:outline-none transition-all resize-none"
          />
        );
        break;
      
      default:
        break;
    }

    return (
      <>
        {inputElement}
        {step.description && (
          <div className="text-sm text-gray-500 mt-2">{step.description}</div>
        )}
      </>
    );
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 relative overflow-hidden">
      {/* Timeline Path */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 2800 800" preserveAspectRatio="none">
          <defs>
            <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="50%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
          </defs>
          {/* Winding Path */}
          <path
            d="M 50 400 Q 200 200 400 400 T 800 400 T 1200 400 T 1600 400 T 2000 400 T 2400 400 T 2800 400"
            stroke="url(#pathGradient)"
            strokeWidth="8"
            fill="none"
            strokeDasharray="20 10"
            className="animate-pulse"
          />
        </svg>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          {/* Progress Header */}
          <div className="text-center mb-8">
            <motion.h1
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-3xl font-bold text-white mb-4"
            >
              Step {currentStep + 1} of {steps.length}
            </motion.h1>
            
            <div className="w-full bg-white/20 rounded-full h-3 mb-4">
              <motion.div
                className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            
            <p className="text-white/80 text-lg">
              {currentStepData?.title} - {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
            </p>
          </div>

          {/* Current Step Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white/95 backdrop-blur-lg rounded-2xl p-8 shadow-2xl"
            >
              {currentStepData && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mb-4">
                      <currentStepData.icon className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentStepData.title}</h2>
                    <p className="text-gray-600">Complete this step to continue your journey</p>
                  </div>

                  <div className="space-y-4">
                    {renderInput(currentStepData)}
                  </div>

                  {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                      {error}
                    </div>
                  )}

                  {/* Navigation - inside card, at bottom */}
                  <div className="flex justify-between items-center mt-8">
                    <motion.button
                      onClick={handlePrevious}
                      disabled={currentStep === 0}
                      className={`flex items-center justify-center px-6 py-3 rounded-xl font-medium transition-all text-2xl ${
                        currentStep === 0
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-white/20 text-gray-700 hover:bg-white/30 backdrop-blur-sm'
                      }`}
                      whileHover={currentStep > 0 ? { scale: 1.15 } : {}}
                      whileTap={currentStep > 0 ? { scale: 0.95 } : {}}
                      aria-label="Previous"
                    >
                      <ArrowRight className="w-8 h-8 rotate-180" />
                    </motion.button>

                    {currentStep === steps.length - 1 ? (
                      <motion.button
                        onClick={handleSubmit}
                        disabled={loading || !canProceedToNext()}
                        className={`flex items-center justify-center px-8 py-3 rounded-xl font-medium transition-all text-2xl ${
                          loading || !canProceedToNext()
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-green-500 to-blue-500 text-white hover:shadow-lg'
                        }`}
                        whileHover={!loading && canProceedToNext() ? { scale: 1.15 } : {}}
                        whileTap={!loading && canProceedToNext() ? { scale: 0.95 } : {}}
                        aria-label="Complete"
                      >
                        {loading ? (
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                        ) : (
                          <Sparkles className="w-8 h-8" />
                        )}
                      </motion.button>
                    ) : (
                      <motion.button
                        onClick={handleNext}
                        disabled={!canProceedToNext()}
                        className={`flex items-center justify-center px-6 py-3 rounded-xl font-medium transition-all text-2xl ${
                          !canProceedToNext()
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-blue-500 to-green-500 text-white hover:shadow-lg'
                        }`}
                        whileHover={canProceedToNext() ? { scale: 1.15 } : {}}
                        whileTap={canProceedToNext() ? { scale: 0.95 } : {}}
                        aria-label="Next"
                      >
                        <ArrowRight className="w-8 h-8" />
                      </motion.button>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(null)}
        />
      )}
    </div>
  );
};

export default TimelineOnboarding; 