import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  X, 
  Clock, 
  Flame, 
  Target, 
  Dumbbell, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  BookOpen,
  Video,
  Image,
  Timer,
  Heart,
  TrendingUp
} from 'lucide-react';
import workoutPreviewService from '../services/workoutPreviewService';
import SafetyIndicators from './SafetyIndicators';

interface WorkoutPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  workoutName: string;
  userData?: any;
  onStartWorkout?: () => void;
}

const WorkoutPreviewModal: React.FC<WorkoutPreviewModalProps> = ({
  isOpen,
  onClose,
  workoutName,
  userData,
  onStartWorkout
}) => {
  const [workoutPreview, setWorkoutPreview] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [showFormGuide, setShowFormGuide] = useState(false);

  useEffect(() => {
    if (isOpen && workoutName) {
      loadWorkoutPreview();
    }
  }, [isOpen, workoutName]);

  useEffect(() => {
    let interval: number;
    if (isPlaying && workoutPreview?.steps[currentStep]?.duration) {
      interval = setInterval(() => {
        setTimer(prev => {
          if (prev >= (workoutPreview.steps[currentStep].duration || 0)) {
            if (currentStep < workoutPreview.steps.length - 1) {
              setCurrentStep(prev => prev + 1);
              return 0;
            } else {
              setIsPlaying(false);
              return 0;
            }
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep, workoutPreview]);

  const loadWorkoutPreview = () => {
    setLoading(true);
    const preview = workoutPreviewService.getWorkoutPreview(workoutName);
    setWorkoutPreview(preview);
    setCurrentStep(0);
    setTimer(0);
    setIsPlaying(false);
    setLoading(false);
  };

  const nextStep = () => {
    if (currentStep < (workoutPreview?.steps.length || 0) - 1) {
      setCurrentStep(prev => prev + 1);
      setTimer(0);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setTimer(0);
    }
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const resetWorkout = () => {
    setCurrentStep(0);
    setTimer(0);
    setIsPlaying(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'steps', label: 'Step-by-Step', icon: <Target className="w-4 h-4" /> },
    { id: 'videos', label: 'Videos', icon: <Video className="w-4 h-4" /> },
    { id: 'form', label: 'Form Guide', icon: <Image className="w-4 h-4" /> },
    { id: 'safety', label: 'Safety', icon: <AlertTriangle className="w-4 h-4" /> }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                {workoutPreview && workoutPreviewService.getCategoryIcon(workoutPreview.category)}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{workoutName}</h2>
                {workoutPreview && (
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-blue-100">{workoutPreview.category}</span>
                    <span className="text-blue-100">•</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${workoutPreviewService.getDifficultyColor(workoutPreview.difficulty)}`}>
                      {workoutPreview.difficulty}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors p-2 rounded-full hover:bg-white/10"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading workout preview...</p>
          </div>
        )}

        {/* Content */}
        {!loading && workoutPreview && (
          <>
            {/* Tabs */}
            <div className="border-b border-gray-200 bg-gray-50">
              <div className="flex overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                      activeTab === tab.id
                        ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Workout Stats */}
                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-5 h-5 text-blue-600" />
                        <span className="font-semibold text-blue-800">Duration</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-600">{workoutPreview.estimatedDuration} min</p>
                    </div>
                    
                    <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Flame className="w-5 h-5 text-red-600" />
                        <span className="font-semibold text-red-800">Calories</span>
                      </div>
                      <p className="text-2xl font-bold text-red-600">~{workoutPreview.caloriesBurned}</p>
                    </div>
                    
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="w-5 h-5 text-green-600" />
                        <span className="font-semibold text-green-800">Muscle Groups</span>
                      </div>
                      <p className="text-sm text-green-700">{workoutPreview.muscleGroups.join(', ')}</p>
                    </div>
                    
                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Dumbbell className="w-5 h-5 text-purple-600" />
                        <span className="font-semibold text-purple-800">Equipment</span>
                      </div>
                      <p className="text-sm text-purple-700">{workoutPreview.equipment.join(', ')}</p>
                    </div>
                  </div>

                  {/* Workout Description */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">About This Exercise</h3>
                    <p className="text-gray-700 leading-relaxed">
                      {workoutPreview.name} is a {workoutPreview.difficulty} level {workoutPreview.category} exercise 
                      that targets your {workoutPreview.muscleGroups.join(', ')}. This exercise typically takes 
                      about {workoutPreview.estimatedDuration} minutes to complete and can burn approximately 
                      {workoutPreview.caloriesBurned} calories.
                    </p>
                  </div>

                  {/* Safety Assessment */}
                  {userData && (
                    <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                      <h3 className="text-lg font-semibold text-yellow-800 mb-3 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" />
                        Safety Assessment
                      </h3>
                      <SafetyIndicators
                        workout={workoutPreview}
                        user={userData}
                        showDetails={false}
                      />
                    </div>
                  )}

                  {/* Progression Tips */}
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Progression Tips
                    </h3>
                    <ul className="space-y-2">
                      {workoutPreview.progressionTips.map((tip: string, index: number) => (
                        <li key={index} className="flex items-start gap-2 text-blue-700">
                          <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Step-by-Step Tab */}
              {activeTab === 'steps' && (
                <div className="space-y-6">
                  {/* Step Navigation */}
                  <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={prevStep}
                        disabled={currentStep === 0}
                        className="p-2 rounded-full bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">
                          Step {currentStep + 1} of {workoutPreview.steps.length}
                        </div>
                        <div className="text-sm text-gray-600">
                          {workoutPreview.steps[currentStep]?.title}
                        </div>
                      </div>
                      
                      <button
                        onClick={nextStep}
                        disabled={currentStep === workoutPreview.steps.length - 1}
                        className="p-2 rounded-full bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={resetWorkout}
                        className="p-2 rounded-full bg-white border border-gray-300 hover:bg-gray-50"
                        title="Reset"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                      
                      {workoutPreview.steps[currentStep]?.duration && (
                        <div className="flex items-center gap-2 bg-white rounded-full px-3 py-1 border border-gray-300">
                          <Timer className="w-4 h-4 text-gray-600" />
                          <span className="text-sm font-medium">
                            {formatTime(timer)} / {formatTime(workoutPreview.steps[currentStep].duration || 0)}
                          </span>
                        </div>
                      )}
                      
                      <button
                        onClick={togglePlay}
                        className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700"
                      >
                        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Current Step */}
                  {workoutPreview.steps[currentStep] && (
                    <div className="space-y-4">
                      <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-start gap-4">
                          {workoutPreview.steps[currentStep].imageUrl && (
                            <img
                              src={workoutPreview.steps[currentStep].imageUrl}
                              alt={`Step ${currentStep + 1}`}
                              className="w-32 h-32 object-cover rounded-lg"
                            />
                          )}
                          
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                              {workoutPreview.steps[currentStep].title}
                            </h3>
                            <p className="text-gray-700 mb-4">
                              {workoutPreview.steps[currentStep].description}
                            </p>
                            
                            {/* Tips */}
                            <div className="mb-4">
                              <h4 className="font-semibold text-green-700 mb-2 flex items-center gap-1">
                                <CheckCircle className="w-4 h-4" />
                                Tips
                              </h4>
                              <ul className="space-y-1">
                                {workoutPreview.steps[currentStep].tips.map((tip: string, index: number) => (
                                  <li key={index} className="text-sm text-green-600">• {tip}</li>
                                ))}
                              </ul>
                            </div>
                            
                            {/* Common Mistakes */}
                            <div className="mb-4">
                              <h4 className="font-semibold text-red-700 mb-2 flex items-center gap-1">
                                <AlertTriangle className="w-4 h-4" />
                                Common Mistakes
                              </h4>
                              <ul className="space-y-1">
                                {workoutPreview.steps[currentStep].commonMistakes.map((mistake: string, index: number) => (
                                  <li key={index} className="text-sm text-red-600">• {mistake}</li>
                                ))}
                              </ul>
                            </div>
                            
                            {/* Modifications */}
                            {workoutPreview.steps[currentStep].modifications && (
                              <div>
                                <h4 className="font-semibold text-blue-700 mb-2 flex items-center gap-1">
                                  <Info className="w-4 h-4" />
                                  Modifications
                                </h4>
                                <ul className="space-y-1">
                                  {workoutPreview.steps[currentStep].modifications.map((mod: string, index: number) => (
                                    <li key={index} className="text-sm text-blue-600">• {mod}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Videos Tab */}
              {activeTab === 'videos' && (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Full Workout Tutorial</h3>
                      <div className="bg-gray-100 rounded-lg p-4 aspect-video flex items-center justify-center">
                        <div className="text-center">
                          <Video className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-600">Video tutorial coming soon</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Beginner Modification</h3>
                      <div className="bg-gray-100 rounded-lg p-4 aspect-video flex items-center justify-center">
                        <div className="text-center">
                          <Video className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-600">Beginner video coming soon</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Advanced Variation</h3>
                      <div className="bg-gray-100 rounded-lg p-4 aspect-video flex items-center justify-center">
                        <div className="text-center">
                          <Video className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-600">Advanced video coming soon</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Form Guide Tab */}
              {activeTab === 'form' && (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Form Guide Images</h3>
                      <div className="space-y-4">
                        {workoutPreview.images.formGuide.map((image: string, index: number) => (
                          <div key={index} className="bg-gray-100 rounded-lg p-4">
                            <img
                              src={image}
                              alt={`Form guide ${index + 1}`}
                              className="w-full h-48 object-cover rounded-lg"
                            />
                            <p className="text-sm text-gray-600 mt-2 text-center">
                              Proper form demonstration {index + 1}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Form Points</h3>
                      <div className="space-y-3">
                        {workoutPreview.steps.map((step: any, index: number) => (
                          <div key={index} className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                            <h4 className="font-semibold text-blue-800 mb-2">
                              Step {step.stepNumber}: {step.title}
                            </h4>
                            <ul className="space-y-1">
                              {step.tips.map((tip: string, tipIndex: number) => (
                                <li key={tipIndex} className="text-sm text-blue-700 flex items-start gap-2">
                                  <CheckCircle className="w-3 h-3 text-blue-600 mt-0.5 flex-shrink-0" />
                                  <span>{tip}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Safety Tab */}
              {activeTab === 'safety' && (
                <div className="space-y-6">
                  {/* Personalized Safety Assessment */}
                  {userData && (
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Personalized Safety Assessment</h3>
                      <SafetyIndicators
                        workout={workoutPreview}
                        user={userData}
                        showDetails={true}
                      />
                    </div>
                  )}

                  {/* General Safety Notes */}
                  <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                    <h3 className="text-lg font-semibold text-red-800 mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      Safety Notes
                    </h3>
                    <ul className="space-y-2">
                      {workoutPreview.safetyNotes.map((note: string, index: number) => (
                        <li key={index} className="flex items-start gap-2 text-red-700">
                          <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                          <span>{note}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={onClose}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Close
              </button>
              {onStartWorkout && (
                <button
                  onClick={onStartWorkout}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium"
                >
                  Start Workout
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WorkoutPreviewModal; 