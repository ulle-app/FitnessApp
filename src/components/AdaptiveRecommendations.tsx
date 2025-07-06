import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Target, 
  Clock, 
  Zap, 
  Activity, 
  CheckCircle, 
  Info,
  BarChart3,
  Lightbulb,
  ArrowUp,
  ArrowDown,
  Minus,
  Settings,
  X
} from 'lucide-react';
import recommendationEngine from '../services/recommendationEngine';

interface AdaptiveRecommendationsProps {
  user: any;
  workouts: any[];
  onWorkoutSelect?: (workout: any) => void;
  onRecordProgress?: (progress: any) => void;
}

const AdaptiveRecommendations: React.FC<AdaptiveRecommendationsProps> = ({
  user,
  workouts,
  onWorkoutSelect,
  onRecordProgress
}) => {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [progressInsights, setProgressInsights] = useState<any>(null);
  const [context, setContext] = useState({
    timeAvailable: 60,
    energyLevel: 7,
    recoveryStatus: 'moderate' as 'fresh' | 'moderate' | 'tired',
    equipmentAvailable: ['bodyweight', 'dumbbell', 'barbell'],
    currentGoals: [user?.fitnessGoal || 'general_fitness']
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && workouts.length > 0) {
      generateRecommendations();
      loadProgressInsights();
    }
  }, [user, workouts, context]);

  const generateRecommendations = () => {
    setLoading(true);
    
    const recommendationContext = {
      user,
      workoutHistory: { 
        userId: user.id || user.phone, 
        workouts: [],
        totalWorkouts: 0,
        averageDifficulty: 0,
        preferredMuscleGroups: [],
        strengthProgress: {},
        enduranceProgress: {},
        consistencyScore: 0
      },
      ...context
    };
    
    const adaptiveRecs = recommendationEngine.generateAdaptiveRecommendations(workouts, recommendationContext);
    setRecommendations(adaptiveRecs);
    setLoading(false);
  };

  const loadProgressInsights = () => {
    const insights = recommendationEngine.getUserProgressInsights(user.id || user.phone);
    setProgressInsights(insights);
  };

  const getProgressionIcon = (progression: string) => {
    switch (progression) {
      case 'increase': return <ArrowUp className="w-4 h-4 text-green-500" />;
      case 'decrease': return <ArrowDown className="w-4 h-4 text-red-500" />;
      default: return <Minus className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getProgressionColor = (progression: string) => {
    switch (progression) {
      case 'increase': return 'text-green-600 bg-green-50 border-green-200';
      case 'decrease': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-yellow-600 bg-yellow-50 border-yellow-200';
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

  return (
    <div className="space-y-6">
      {/* Progress Insights */}
      {progressInsights && (
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            Your Progress Insights
          </h3>
          
          {progressInsights.hasProgress ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-5 h-5 text-blue-500" />
                  <span className="font-semibold text-blue-600">Total Workouts</span>
                </div>
                <p className="text-2xl font-bold text-blue-600">{progressInsights.totalWorkouts}</p>
              </div>

              <div className="p-4 rounded-xl border border-green-200 bg-green-50">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  <span className="font-semibold text-green-600">Consistency</span>
                </div>
                <p className="text-2xl font-bold text-green-600">{Math.round(progressInsights.consistencyScore)}%</p>
              </div>

              <div className="p-4 rounded-xl border border-purple-200 bg-purple-50">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-purple-500" />
                  <span className="font-semibold text-purple-600">Form Score</span>
                </div>
                <p className="text-2xl font-bold text-purple-600">{progressInsights.averageForm.toFixed(1)}/10</p>
              </div>

              <div className={`p-4 rounded-xl border ${getProgressionColor(progressInsights.progression)}`}>
                <div className="flex items-center gap-2 mb-2">
                  {getProgressionIcon(progressInsights.progression)}
                  <span className="font-semibold">Progression</span>
                </div>
                <p className="text-2xl font-bold capitalize">{progressInsights.progression}</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>{progressInsights.message}</p>
            </div>
          )}
        </div>
      )}

      {/* Context Settings */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Settings className="w-6 h-6 text-blue-600" />
          Workout Context
        </h3>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time Available</label>
            <select 
              value={context.timeAvailable}
              onChange={(e) => setContext(prev => ({ ...prev, timeAvailable: Number(e.target.value) }))}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value={30}>30 minutes</option>
              <option value={45}>45 minutes</option>
              <option value={60}>1 hour</option>
              <option value={90}>1.5 hours</option>
              <option value={120}>2 hours</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Energy Level</label>
            <select 
              value={context.energyLevel}
              onChange={(e) => setContext(prev => ({ ...prev, energyLevel: Number(e.target.value) }))}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {[1,2,3,4,5,6,7,8,9,10].map(level => (
                <option key={level} value={level}>{level}/10</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Recovery Status</label>
            <select 
              value={context.recoveryStatus}
              onChange={(e) => setContext(prev => ({ ...prev, recoveryStatus: e.target.value as any }))}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="fresh">Fresh</option>
              <option value="moderate">Moderate</option>
              <option value="tired">Tired</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Goals</label>
            <select 
              value={context.currentGoals[0]}
              onChange={(e) => setContext(prev => ({ ...prev, currentGoals: [e.target.value] }))}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="general_fitness">General Fitness</option>
              <option value="weight_loss">Weight Loss</option>
              <option value="muscle_gain">Muscle Gain</option>
              <option value="strength">Strength</option>
              <option value="endurance">Endurance</option>
              <option value="flexibility">Flexibility</option>
            </select>
          </div>
        </div>
      </div>

      {/* Adaptive Recommendations */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Target className="w-6 h-6 text-blue-600" />
          Adaptive Recommendations
        </h3>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations.slice(0, 6).map((rec, index) => (
            <div key={index} className="border rounded-xl p-4 hover:shadow-md transition-shadow">
              {/* Workout Header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900">{rec.workout.name}</h4>
                  <p className="text-sm text-gray-600">{rec.workout.muscle_group}</p>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-semibold ${getProgressionColor(rec.progression)}`}>
                  {rec.progression}
                </div>
              </div>

              {/* Score and Confidence */}
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
                <div className="text-xs text-gray-500 mt-1">
                  Confidence: {rec.confidence}%
                </div>
              </div>

              {/* Time and Energy */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <Clock className="w-3 h-3" />
                  <span>{rec.timeEstimate}m</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <Zap className="w-3 h-3" />
                  <span>{rec.energyRequirement}/10</span>
                </div>
              </div>

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

        {recommendations.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No recommendations available for your current context</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdaptiveRecommendations; 