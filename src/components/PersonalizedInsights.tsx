import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Target, 
  Heart, 
  Shield, 
  Clock, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  Dumbbell,
  Activity,
  Zap
} from 'lucide-react';
import personalizationEngine from '../services/personalizationEngine';

interface PersonalizedInsightsProps {
  user: any;
  workouts: any[];
  onWorkoutSelect?: (workout: any) => void;
}

const PersonalizedInsights: React.FC<PersonalizedInsightsProps> = ({
  user,
  workouts,
  onWorkoutSelect
}) => {
  const [insights, setInsights] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [selectedPlanType, setSelectedPlanType] = useState<'mixed' | 'strength' | 'cardio' | 'flexibility'>('mixed');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && workouts.length > 0) {
      generateInsights();
    }
  }, [user, workouts]);

  const generateInsights = () => {
    setLoading(true);
    
    // Generate user insights
    const userInsights = personalizationEngine.getUserInsights(user);
    setInsights(userInsights);
    
    // Generate recommendations
    const workoutRecommendations = personalizationEngine.generateRecommendations(workouts, user);
    setRecommendations(workoutRecommendations);
    
    setLoading(false);
  };

  const getPlanTypeWorkouts = () => {
    if (selectedPlanType === 'mixed') {
      return recommendations.slice(0, 6);
    }
    return recommendations.filter(rec => 
      rec.workout.goal?.toLowerCase().includes(selectedPlanType)
    ).slice(0, 6);
  };

  const getInsightIcon = (category: string) => {
    switch (category) {
      case 'advanced': return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'intermediate': return <Target className="w-5 h-5 text-blue-500" />;
      case 'beginner': return <Users className="w-5 h-5 text-yellow-500" />;
      case 'novice': return <Heart className="w-5 h-5 text-red-500" />;
      default: return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  const getInsightColor = (category: string) => {
    switch (category) {
      case 'advanced': return 'text-green-600 bg-green-50 border-green-200';
      case 'intermediate': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'beginner': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'novice': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user || !insights) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="text-center text-gray-500">
          <Info className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Complete your profile to get personalized insights</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* User Insights Card */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-blue-600" />
          Your Fitness Profile
        </h3>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Fitness Level */}
          <div className={`p-4 rounded-xl border ${getInsightColor(insights.fitnessLevelCategory)}`}>
            <div className="flex items-center gap-2 mb-2">
              {getInsightIcon(insights.fitnessLevelCategory)}
              <span className="font-semibold">Fitness Level</span>
            </div>
            <p className="text-2xl font-bold">{insights.fitnessLevelCategory}</p>
            <p className="text-sm opacity-75">Score: {insights.fitnessLevel}/100</p>
          </div>

          {/* Age Group */}
          {insights.age && (
            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-blue-500" />
                <span className="font-semibold text-blue-600">Age Group</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">{insights.ageGroup?.replace('_', ' ')}</p>
              <p className="text-sm text-blue-600 opacity-75">{insights.age} years old</p>
            </div>
          )}

          {/* BMI */}
          {insights.bmi && (
            <div className="p-4 rounded-xl border border-purple-200 bg-purple-50">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-purple-500" />
                <span className="font-semibold text-purple-600">BMI</span>
              </div>
              <p className="text-2xl font-bold text-purple-600">{insights.bmiCategory}</p>
              <p className="text-sm text-purple-600 opacity-75">{insights.bmi.toFixed(1)}</p>
            </div>
          )}

          {/* Body Fat */}
          {insights.bodyFatCategory && (
            <div className="p-4 rounded-xl border border-green-200 bg-green-50">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-5 h-5 text-green-500" />
                <span className="font-semibold text-green-600">Body Fat</span>
              </div>
              <p className="text-2xl font-bold text-green-600">{insights.bodyFatCategory}</p>
              <p className="text-sm text-green-600 opacity-75">{user.bodyFat}%</p>
            </div>
          )}
        </div>
      </div>

      {/* Personalized Recommendations */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Target className="w-6 h-6 text-blue-600" />
            Personalized Workout Recommendations
          </h3>
          
          {/* Plan Type Selector */}
          <div className="flex gap-2">
            {(['mixed', 'strength', 'cardio', 'flexibility'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setSelectedPlanType(type)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedPlanType === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Recommendations Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {getPlanTypeWorkouts().map((rec, index) => (
            <div key={index} className="border rounded-xl p-4 hover:shadow-md transition-shadow">
              {/* Workout Header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900">{rec.workout.name}</h4>
                  <p className="text-sm text-gray-600">{rec.workout.muscle_group}</p>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  rec.priority === 'high' ? 'bg-green-100 text-green-700' :
                  rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {rec.priority}
                </div>
              </div>

              {/* Score */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">Match Score</span>
                  <span className="text-sm font-semibold">{rec.score}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      rec.score >= 80 ? 'bg-green-500' :
                      rec.score >= 60 ? 'bg-blue-500' :
                      rec.score >= 40 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${rec.score}%` }}
                  />
                </div>
              </div>

              {/* Reasons */}
              {rec.reasons.length > 0 && (
                <div className="mb-3">
                  <div className="flex items-center gap-1 mb-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium text-green-700">Why Recommended</span>
                  </div>
                  <ul className="space-y-1">
                    {rec.reasons.slice(0, 2).map((reason: string, idx: number) => (
                      <li key={idx} className="text-xs text-green-600">• {reason}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Warnings */}
              {rec.warnings.length > 0 && (
                <div className="mb-3">
                  <div className="flex items-center gap-1 mb-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium text-yellow-700">Warnings</span>
                  </div>
                  <ul className="space-y-1">
                    {rec.warnings.slice(0, 1).map((warning: string, idx: number) => (
                      <li key={idx} className="text-xs text-yellow-600">• {warning}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Button */}
              {onWorkoutSelect && (
                <button
                  onClick={() => onWorkoutSelect(rec.workout)}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Select Workout
                </button>
              )}
            </div>
          ))}
        </div>

        {getPlanTypeWorkouts().length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Dumbbell className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No workouts match your current {selectedPlanType} preferences</p>
          </div>
        )}
      </div>

      {/* Fitness Insights */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Zap className="w-6 h-6 text-blue-600" />
          Personalized Insights
        </h3>
        
        <div className="space-y-4">
          {/* Fitness Level Insights */}
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">Fitness Level Analysis</h4>
                <p className="text-blue-800 text-sm">
                  Based on your activity level ({user.activityLevel}), experience ({user.experience}), 
                  and physical metrics, you're classified as {insights.fitnessLevelCategory}. 
                  This means you can handle {insights.fitnessLevelCategory === 'advanced' ? 'challenging' : 
                  insights.fitnessLevelCategory === 'intermediate' ? 'moderate' : 'beginner-friendly'} workouts.
                </p>
              </div>
            </div>
          </div>

          {/* Goal Alignment */}
          {user.fitnessGoal && (
            <div className="p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="flex items-start gap-3">
                <Target className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-green-900 mb-1">Goal Alignment</h4>
                  <p className="text-green-800 text-sm">
                    Your primary goal is {user.fitnessGoal}. We've prioritized workouts that specifically 
                    target this objective, ensuring maximum effectiveness for your fitness journey.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Safety Considerations */}
          {user.medicalConditions && (
            <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-yellow-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-yellow-900 mb-1">Safety Considerations</h4>
                  <p className="text-yellow-800 text-sm">
                    We've noted your medical conditions: {user.medicalConditions}. 
                    All recommendations include safety modifications and avoid exercises that could 
                    aggravate these conditions.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Age-Specific Insights */}
          {insights.age && (
            <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-purple-900 mb-1">Age-Appropriate Training</h4>
                  <p className="text-purple-800 text-sm">
                    As a {insights.ageGroup?.replace('_', ' ')}, your workout recommendations 
                    are tailored to your age group's specific needs and capabilities, 
                    ensuring safe and effective training.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalizedInsights; 