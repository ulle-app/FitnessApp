import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Calendar, Activity, Target, Heart, MapPin, 
  ChevronRight, ChevronLeft, Sparkles, CheckCircle,
  Camera, Upload
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

interface OnboardingData {
  fullName: string;
  gender: string;
  dob: string;
  height: string;
  weight: string;
  activityLevel: string;
  fitnessGoal: string;
  dietaryPreference: string;
  city: string;
  country: string;
  photo?: string;
}

const initialData: OnboardingData = {
  fullName: '',
  gender: '',
  dob: '',
  height: '',
  weight: '',
  activityLevel: '',
  fitnessGoal: '',
  dietaryPreference: '',
  city: '',
  country: '',
};

const Confetti: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: -10,
            rotate: 0,
          }}
          animate={{
            y: window.innerHeight + 10,
            rotate: 360,
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            ease: "easeOut",
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
};

const ModernOnboarding: React.FC = () => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<OnboardingData>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);

  const steps = [
    {
      id: 'personal',
      title: 'Personal Information',
      icon: User,
      fields: [
        {
          name: 'fullName',
          label: 'Full Name',
          type: 'text',
          placeholder: 'Enter your full name',
          required: true
        },
        {
          name: 'gender',
          label: 'Gender',
          type: 'select',
          options: [
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' },
            { value: 'other', label: 'Other' },
            { value: 'prefer_not_to_say', label: 'Prefer not to say' }
          ],
          required: true
        },
        {
          name: 'dob',
          label: 'Date of Birth',
          type: 'date',
          required: true
        }
      ]
    },
    {
      id: 'physical',
      title: 'Physical Stats',
      icon: Activity,
      fields: [
        {
          name: 'height',
          label: 'Height (cm)',
          type: 'number',
          placeholder: '175',
          required: true
        },
        {
          name: 'weight',
          label: 'Weight (kg)',
          type: 'number',
          placeholder: '70',
          required: true
        },
        {
          name: 'activityLevel',
          label: 'Activity Level',
          type: 'select',
          options: [
            { value: 'sedentary', label: 'Sedentary (little or no exercise)' },
            { value: 'light', label: 'Lightly active (1-3 days/week)' },
            { value: 'moderate', label: 'Moderately active (3-5 days/week)' },
            { value: 'very', label: 'Very active (6-7 days/week)' },
            { value: 'super', label: 'Super active (very hard exercise)' }
          ],
          required: true
        }
      ]
    },
    {
      id: 'goals',
      title: 'Fitness Goals',
      icon: Target,
      fields: [
        {
          name: 'fitnessGoal',
          label: 'Primary Fitness Goal',
          type: 'select',
          options: [
            { value: 'lose_weight', label: 'Lose Weight' },
            { value: 'gain_muscle', label: 'Gain Muscle' },
            { value: 'maintain', label: 'Maintain Current Weight' },
            { value: 'improve_fitness', label: 'Improve Overall Fitness' },
            { value: 'increase_strength', label: 'Increase Strength' },
            { value: 'improve_endurance', label: 'Improve Endurance' }
          ],
          required: true
        },
        {
          name: 'dietaryPreference',
          label: 'Dietary Preference',
          type: 'select',
          options: [
            { value: 'omnivore', label: 'Omnivore (Everything)' },
            { value: 'vegetarian', label: 'Vegetarian' },
            { value: 'vegan', label: 'Vegan' },
            { value: 'pescatarian', label: 'Pescatarian' },
            { value: 'keto', label: 'Ketogenic' },
            { value: 'paleo', label: 'Paleo' }
          ],
          required: true
        }
      ]
    },
    {
      id: 'location',
      title: 'Location',
      icon: MapPin,
      fields: [
        {
          name: 'city',
          label: 'City',
          type: 'text',
          placeholder: 'Enter your city',
          required: true
        },
        {
          name: 'country',
          label: 'Country',
          type: 'text',
          placeholder: 'Enter your country',
          required: true
        }
      ]
    }
  ];

  const handleDataChange = (field: string, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const isStepValid = () => {
    const currentStepData = steps[currentStep];
    return currentStepData.fields.every(field => {
      if (field.required) {
        return data[field.name as keyof OnboardingData];
      }
      return true;
    });
  };

  const handleNext = () => {
    if (isStepValid() && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!isStepValid()) return;
    
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: user?.phone,
          email: user?.email,
          ...data
        })
      });

      const responseData = await res.json();
      
      if (responseData.success) {
        setUser({ ...user, ...data });
        setShowConfetti(true);
        
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      } else {
        setError(responseData.error || 'Failed to save profile');
      }
    } catch (err: any) {
      setError('Network error. Please try again.');
    }
    setLoading(false);
  };

  const renderField = (field: any) => {
    const value = data[field.name as keyof OnboardingData] || '';

    switch (field.type) {
      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleDataChange(field.name, e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 bg-white focus:border-green-500 focus:outline-none transition-all text-gray-900"
            required={field.required}
          >
            <option value="">Select {field.label}</option>
            {field.options?.map((option: any) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      
      case 'date':
        return (
          <input
            type="date"
            value={value}
            onChange={(e) => handleDataChange(field.name, e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 bg-white focus:border-green-500 focus:outline-none transition-all text-gray-900"
            required={field.required}
          />
        );
      
      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleDataChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 bg-white focus:border-green-500 focus:outline-none transition-all text-gray-900"
            required={field.required}
          />
        );
      
      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleDataChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 bg-white focus:border-green-500 focus:outline-none transition-all text-gray-900"
            required={field.required}
          />
        );
    }
  };

  const currentStepData = steps[currentStep];

  if (showConfetti) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 flex items-center justify-center">
        <Confetti />
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center text-white"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
            className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8"
          >
            <CheckCircle className="w-16 h-16 text-white" />
          </motion.div>
          <h1 className="text-4xl font-bold mb-4">Welcome to Your Fitness Journey!</h1>
          <p className="text-xl mb-8">Your profile has been created successfully</p>
          <div className="animate-pulse">
            <p className="text-lg">Redirecting to your dashboard...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Complete Your Profile</h1>
          <div className="flex items-center justify-center space-x-2 mb-4">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index <= currentStep ? 'bg-white' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
          <p className="text-white/80">Step {currentStep + 1} of {steps.length}</p>
        </div>

        {/* Current Step */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white/95 backdrop-blur-lg rounded-2xl p-8 shadow-2xl"
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mb-4">
                <currentStepData.icon className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{currentStepData.title}</h2>
            </div>

            <div className="space-y-6">
              {currentStepData.fields.map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {renderField(field)}
                </div>
              ))}
            </div>

            {error && (
              <div className="mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between items-center mt-8">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all ${
                  currentStep === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                Previous
              </button>

              {currentStep === steps.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  disabled={loading || !isStepValid()}
                  className={`flex items-center px-8 py-3 rounded-xl font-medium transition-all ${
                    loading || !isStepValid()
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-500 to-blue-500 text-white hover:shadow-lg'
                  }`}
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Sparkles className="w-5 h-5 mr-2" />
                  )}
                  {loading ? 'Saving...' : 'Complete Profile'}
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  disabled={!isStepValid()}
                  className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all ${
                    !isStepValid()
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-500 to-green-500 text-white hover:shadow-lg'
                  }`}
                >
                  Next
                  <ChevronRight className="w-5 h-5 ml-2" />
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ModernOnboarding;