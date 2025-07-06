import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Camera, Activity, HeartPulse, MapPin, Calendar, 
  ChevronDown, ChevronUp, Sparkles, Star, Trophy, Target,
  ArrowRight, CheckCircle, Circle, Play, X
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

// Add a simple confetti component
const Confetti = () => (
  <div style={{ pointerEvents: 'none', position: 'fixed', inset: 0, zIndex: 1000 }}>
    {[...Array(60)].map((_, i) => (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: `${Math.random() * 100}%`,
          top: `-${Math.random() * 20 + 5}%`,
          width: 10 + Math.random() * 8,
          height: 18 + Math.random() * 10,
          background: `hsl(${Math.random() * 360}, 80%, 60%)`,
          borderRadius: '3px',
          opacity: 0.85,
          transform: `rotate(${Math.random() * 360}deg)`,
          animation: `confetti-fall 1.8s cubic-bezier(.62,.01,.27,1) ${Math.random() * 0.8}s both`,
        }}
      />
    ))}
    <style>{`
      @keyframes confetti-fall {
        0% { opacity: 0.7; transform: translateY(0) scale(1) rotate(0deg); }
        80% { opacity: 1; }
        100% { opacity: 0; transform: translateY(110vh) scale(0.7) rotate(360deg); }
      }
    `}</style>
  </div>
);

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
  const [showCelebration, setShowCelebration] = useState(false);
  const [inputErrors, setInputErrors] = useState<{ [key: string]: string }>({});
  const [showOnboarding, setShowOnboarding] = useState(true);

  const isStorybook = Boolean((window as any).__STORYBOOK_ADDONS || (window as any).STORYBOOK_ENV);

  console.log('RENDER data state', data); // DEBUG

  // Ensure data state always has all required fields - run only once on mount
  useEffect(() => {
    // Force ensure all fields are present
    setData(prev => {
      const updated = { ...initialData, ...prev };
      console.log('Ensuring all fields present:', updated);
      return updated;
    });
  }, []); // Empty dependency array - run only once

  // Debug: Log when data state changes
  useEffect(() => {
    console.log('Data state changed:', data);
    console.log('sleepHours in data:', data.sleepHours);
    console.log('All fields present:', Object.keys(initialData).every(key => key in data));
    console.log('sleepHours value:', data.sleepHours, 'type:', typeof data.sleepHours); // DEBUG
  }, [data]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 120); // 120ms delay to allow animation and DOM update
    return () => clearTimeout(timeout);
  }, [currentStep]);

  const handleDataChange = (field: keyof TimelineData, value: string) => {
    console.log('handleDataChange', field, value); // DEBUG
    let valid = true;
    let error = '';
    if (field === 'height') {
      const num = Number(value);
      if (isNaN(num) || num < 100 || num > 250) {
        valid = false;
        error = 'Height must be between 100 and 250 cm.';
      }
    } else if (field === 'weight') {
      const num = Number(value);
      if (isNaN(num) || num < 30 || num > 250) {
        valid = false;
        error = 'Weight must be between 30 and 250 kg.';
      }
    } else if (field === 'stressLevel') {
      const num = Number(value);
      if (isNaN(num)) {
        valid = false;
        error = 'Please enter a valid number.';
      }
    } else if (typeof value === 'string' && (field === 'username' || field === 'fullName' || field === 'city' || field === 'country')) {
      if (/[^a-zA-Z0-9 _-]/.test(value)) {
        valid = false;
        error = 'Only letters, numbers, spaces, - and _ are allowed.';
      }
    }
    if (!valid) {
      setInputErrors(prev => ({ ...prev, [field]: error }));
      return;
    } else {
      setInputErrors(prev => ({ ...prev, [field]: '' }));
    }
    setData(prev => {
      const updated = { ...prev, [field]: value };
      console.log('data state after update', updated); // DEBUG
      // Ensure all fields from initialData are present
      const finalState = { ...initialData, ...updated };
      console.log('final state with all fields', finalState); // DEBUG
      return finalState;
    });
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
        // Mark onboarding as completed
        const onboardingRes = await fetch('/api/complete-onboarding', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: user?.phone })
        });
        
        if (onboardingRes.ok) {
          setUser({ ...user, ...data, photo: data.photo || data.avatar || '', onboarding_completed: 'true' });
          setShowCelebration(true); // Show celebration overlay
          // navigate('/dashboard'); // Removed redirect - will decide later
        } else {
          setError('Failed to complete onboarding. Please try again.');
        }
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
      id: 'profile_nickname',
      title: 'Profile/Nick Name',
      icon: User,
      type: 'text',
      field: 'username',
      placeholder: 'e.g. IronRunner, FitGuru, WellnessWarrior',
      description: 'Pick a fun profile or nickname! This will be visible to others.',
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
        if (step.field === 'height') {
          inputElement = (
            <div className="w-full flex flex-col items-center">
              <div className="mb-2 text-lg font-semibold text-white">{value || 170} cm</div>
              <input
                type="range"
                min={100}
                max={250}
                step={1}
                value={value || 170}
                onChange={e => handleDataChange('height', e.target.value)}
                className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer text-white"
              />
              {inputErrors.height && <div className="text-red-500 text-sm mt-1">{inputErrors.height}</div>}
            </div>
          );
        } else if (step.field === 'weight') {
          inputElement = (
            <div className="w-full flex flex-col items-center">
              <div className="mb-2 text-lg font-semibold text-white">{value || 70} kg</div>
              <input
                type="range"
                min={30}
                max={250}
                step={1}
                value={value || 70}
                onChange={e => handleDataChange('weight', e.target.value)}
                className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer text-white"
              />
              {inputErrors.weight && <div className="text-red-500 text-sm mt-1">{inputErrors.weight}</div>}
            </div>
          );
        } else {
          inputElement = (
            <input
              key={step.id}
              ref={inputRef as React.RefObject<HTMLInputElement>}
              type="text"
              value={value || ''}
              onChange={(e) => handleDataChange(step.field as keyof TimelineData, e.target.value)}
              placeholder={step.placeholder}
              className="w-full px-4 py-3 text-lg bg-[#23232b] text-white border-2 border-gray-700 focus:border-blue-400 focus:outline-none transition-all placeholder-gray-400"
              onKeyDown={handleInputKeyDown}
            />
          );
          if (inputErrors[step.field]) {
            inputElement = <div className="flex flex-col">{inputElement}<div className="text-red-500 text-sm mt-1">{inputErrors[step.field]}</div></div>;
          }
        }
        break;
      
      case 'date':
        inputElement = (
          <input
            key={step.id}
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="date"
            value={value || ''}
            onChange={(e) => handleDataChange(step.field as keyof TimelineData, e.target.value)}
            className="w-full px-4 py-3 text-lg bg-[#23232b] text-white border-2 border-gray-700 focus:border-blue-400 focus:outline-none transition-all placeholder-gray-400"
            onKeyDown={handleInputKeyDown}
          />
        );
        break;
      
      case 'dropdown':
        if (step.field === 'avatar' && step.options) {
          const selectedAvatar = step.options.find(opt => opt.id === Number(value));
          inputElement = (
            <div className="flex flex-col md:flex-row items-center gap-8 w-full justify-center">
              {/* Photo Upload */}
              <div className="flex flex-col items-center">
                <div className="relative w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-4 border-blue-300 shadow-md mb-2">
                  {data.photo ? (
                    <img src={data.photo} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full h-full flex items-center justify-center text-gray-400 hover:text-blue-500"
                    >
                      <Camera className="w-10 h-10" />
                    </button>
                  )}
                  {data.photo && (
                    <button
                      type="button"
                      onClick={() => handleDataChange('photo', '')}
                      className="absolute top-1 right-1 bg-white/80 rounded-full p-1 shadow hover:bg-red-100"
                      title="Remove photo"
                    >
                      <X className="w-4 h-4 text-red-500" />
                    </button>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </div>
                <div className="text-xs text-gray-500">Upload Photo</div>
              </div>
              {/* Avatar Selection */}
              <div className="flex flex-col items-center">
                <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center overflow-hidden border-4 border-pink-300 shadow-md mb-2">
                  {data.avatar ? (
                    <img src={data.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-10 h-10 text-white" />
                  )}
                  <button
                    type="button"
                    onClick={() => setShowDropdown(showDropdown === step.id ? null : step.id)}
                    className="absolute bottom-1 right-1 bg-white/80 rounded-full p-1 shadow hover:bg-green-100"
                    title="Change avatar"
                  >
                    <ChevronDown className={`w-4 h-4 text-green-500 transition-transform ${showDropdown === step.id ? 'rotate-180' : ''}`} />
                  </button>
                  {showDropdown === step.id && (
                    <div
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-[#23232b] rounded-xl border-2 border-green-400 shadow-lg z-50 p-2 flex flex-col gap-2"
                    >
                      {step.options.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => {
                            handleDataChange('avatar', String(option.id));
                            setShowDropdown(null);
                          }}
                          className="flex items-center gap-2 p-2 hover:bg-green-50 rounded-lg transition-colors"
                          type="button"
                        >
                          {'src' in option && (
                            <img src={option.src} alt={option.label} className="w-8 h-8 rounded-full border border-green-400" />
                          )}
                          <div>
                            <div className="font-medium text-white">{option.label}</div>
                            <div className="text-sm text-gray-200">{option.description}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="text-xs text-gray-500">Choose Avatar</div>
              </div>
            </div>
          );
        } else if (step.options) {
          const selectedOption = step.options.find(opt => String(opt.id) === String(value));
          console.log('renderInput', step.field, value, selectedOption ? selectedOption.label : 'none'); // DEBUG
          console.log('DEBUG: step.options:', step.options); // DEBUG
          console.log('DEBUG: value type:', typeof value, 'value:', value); // DEBUG
          console.log('DEBUG: comparing with option ids:', step.options.map(opt => ({ id: opt.id, idType: typeof opt.id, stringId: String(opt.id) }))); // DEBUG
          inputElement = (
            <div className="relative w-full">
              <button
                key={step.id}
                ref={inputRef as React.RefObject<HTMLButtonElement>}
                onClick={() => setShowDropdown(showDropdown === step.id ? null : step.id)}
                className="w-full px-4 py-3 text-lg bg-[#23232b] text-white border-2 border-gray-700 focus:border-blue-400 focus:outline-none transition-all flex items-center justify-between"
                onKeyDown={handleInputKeyDown}
                type="button"
              >
                <span className={selectedOption ? 'text-white' : 'text-gray-400'}>
                  {selectedOption ? selectedOption.label : step.placeholder || 'Select...'}
                </span>
                <ChevronDown className={`w-5 h-5 transition-transform ${showDropdown === step.id ? 'rotate-180' : ''}`} />
              </button>
              {showDropdown === step.id && step.options && (
                <div
                  className="absolute top-full left-0 right-0 mt-2 bg-[#23232b] rounded-xl border-2 border-green-400 shadow-lg z-50 max-h-60 overflow-y-auto"
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
                      <div className="font-medium text-white">{option.label}</div>
                      {option.description && (
                        <div className="text-sm text-gray-200">{option.description}</div>
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
        // Heatmap-style selector for stress level
        inputElement = (
          <div className="w-full space-y-4">
            <div className="flex justify-between text-sm font-semibold text-gray-800">
              <span>Low Stress</span>
              <span>High Stress</span>
            </div>
            <div className="flex justify-center gap-2 my-2">
              {[...Array(10)].map((_, i) => {
                // Gradient from green (low) to red (high)
                const percent = i / 9;
                const color = `hsl(${120 - percent * 120}, 80%, 45%)`;
                const selected = String(i + 1) === String(value || '5');
                return (
                  <button
                    key={i}
                    type="button"
                    aria-label={`Stress level ${i + 1}`}
                    onClick={() => handleDataChange(step.field as keyof TimelineData, String(i + 1))}
                    className={`w-7 h-7 rounded-full transition-all border-2 flex items-center justify-center focus:outline-none ${selected ? 'scale-125 border-black shadow-lg' : 'border-gray-200'}`}
                    style={{ background: color }}
                  >
                    {selected && <span className="text-xs font-bold text-white drop-shadow">{i + 1}</span>}
                  </button>
                );
              })}
            </div>
            <div className="text-center text-2xl font-bold text-red-600">{value || '5'}</div>
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
            className="w-full px-4 py-3 text-lg bg-[#23232b] text-white border-2 border-gray-700 focus:border-blue-400 focus:outline-none transition-all resize-none placeholder-gray-400"
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

  if (!showOnboarding) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative max-w-md w-full bg-[#18181b] rounded-2xl shadow-2xl p-8 flex flex-col items-center animate-fade-in border border-gray-800">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl focus:outline-none"
          aria-label="Close onboarding"
          onClick={() => setShowOnboarding(false)}
        >
          <X className="w-6 h-6" />
        </button>
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
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {currentStepData && (
              <div className="space-y-6">
                <div className="text-center">
                  <motion.div
                    key={currentStepData.id}
                    initial={{ scale: 0.7, opacity: 0, y: -20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, type: 'spring' }}
                    className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mb-4 shadow-lg"
                  >
                    <currentStepData.icon className="w-8 h-8 text-white" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-white mb-2">{currentStepData.title}</h2>
                  <p className="text-gray-300">{currentStep === steps.length - 1 ? 'This is the final step! 🎉' : 'Complete this step to continue your journey'}</p>
                </div>
                <div className="space-y-4">
                  {renderInput(currentStepData)}
                </div>
                {error && (
                  <div className="bg-red-900/80 border border-red-400 text-red-300 px-4 py-3 rounded-lg">
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
                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                        : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm'
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
                      className={`flex items-center justify-center px-10 py-4 rounded-2xl font-bold transition-all text-2xl shadow-xl ${
                        loading || !canProceedToNext()
                          ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-black hover:bg-gray-200'
                      }`}
                      whileHover={!loading && canProceedToNext() ? { scale: 1.12 } : {}}
                      whileTap={!loading && canProceedToNext() ? { scale: 0.98 } : {}}
                      aria-label="Complete"
                    >
                      {loading ? (
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                      ) : (
                        <span className="flex items-center gap-2"><Sparkles className="w-8 h-8" /> Complete</span>
                      )}
                    </motion.button>
                  ) : (
                    <motion.button
                      onClick={handleNext}
                      disabled={!canProceedToNext()}
                      className={`flex items-center justify-center px-6 py-3 rounded-xl font-medium transition-all text-2xl ${
                        !canProceedToNext()
                          ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-black hover:bg-gray-200'
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
      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-lg animate-fade-in">
          <Confetti />
          <div className="bg-white/95 rounded-3xl shadow-2xl px-10 py-12 max-w-lg w-full flex flex-col items-center text-center border-4 border-green-400">
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, type: 'spring' }}
              className="mb-6"
            >
              <Star className="w-16 h-16 text-yellow-400 drop-shadow-lg animate-bounce" />
            </motion.div>
            <h1 className="text-4xl font-extrabold text-green-600 mb-2">Welcome, {data.username || 'Hero'}!</h1>
            <p className="text-xl text-gray-700 mb-4 font-semibold">Your fitness journey starts now 🚀</p>
            <div className="text-lg font-bold text-blue-700 mb-6">Onboarding Complete</div>
            <button
              className="mt-2 px-8 py-3 rounded-full bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold text-lg shadow-lg hover:from-green-600 hover:to-blue-600 transition-all"
              onClick={() => setShowCelebration(false)}
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimelineOnboarding;