import React from 'react';
import { 
  AlertTriangle, 
  Shield, 
  Activity, 
  Heart, 
  Zap, 
  Clock, 
  Info,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import safetyAssessmentService from '../services/safetyAssessment';

interface SafetyIndicatorsProps {
  workout: any;
  user: any;
  showDetails?: boolean;
  className?: string;
}

const SafetyIndicators: React.FC<SafetyIndicatorsProps> = ({
  workout,
  user,
  showDetails = false,
  className = ''
}) => {
  // Create user health profile from user data
  const userHealthProfile = {
    medicalConditions: user.medicalConditions || [],
    injuries: user.injuries || [],
    medications: user.medications || [],
    fitnessLevel: user.fitnessLevel || 'beginner',
    age: user.age || 25,
    pregnancyStatus: user.pregnancyStatus || 'none',
    recentSurgeries: user.recentSurgeries || [],
    chronicPain: user.chronicPain || []
  };

  // Get safety assessment
  const safetyAssessment = safetyAssessmentService.assessWorkoutSafety(workout, userHealthProfile);

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'medium': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'high': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  const getDifficultyIcon = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'beginner': return <TrendingDown className="w-4 h-4 text-green-500" />;
      case 'intermediate': return <Activity className="w-4 h-4 text-yellow-500" />;
      case 'advanced': return <TrendingUp className="w-4 h-4 text-red-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Safety Status Badge */}
      <div className="flex items-center gap-2">
        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${safetyAssessmentService.getSafetyColor(safetyAssessment.riskLevel)}`}>
          {getRiskIcon(safetyAssessment.riskLevel)}
          <span className="capitalize">{safetyAssessment.riskLevel} Risk</span>
        </div>
        
        {safetyAssessment.requiresMedicalClearance && (
          <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold text-red-600 bg-red-50 border border-red-200">
            <Heart className="w-3 h-3" />
            <span>Medical Clearance Required</span>
          </div>
        )}
      </div>

      {/* Difficulty Indicator */}
      <div className="flex items-center gap-2">
        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${safetyAssessmentService.getDifficultyColor(workout.level)}`}>
          {getDifficultyIcon(workout.level)}
          <span className="capitalize">{workout.level || 'Intermediate'}</span>
        </div>
        
        {safetyAssessment.difficultyAdjustment !== 0 && (
          <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200">
            {safetyAssessment.difficultyAdjustment > 0 ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            <span>
              {safetyAssessment.difficultyAdjustment > 0 ? 'Increase' : 'Decrease'} Difficulty
            </span>
          </div>
        )}
      </div>

      {/* Warnings */}
      {safetyAssessment.warnings.length > 0 && (
        <div className="space-y-1">
          {safetyAssessment.warnings.slice(0, 2).map((warning, index) => (
            <div key={index} className="flex items-start gap-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-yellow-800">{warning}</span>
            </div>
          ))}
        </div>
      )}

      {/* Detailed Safety Information */}
      {showDetails && (
        <div className="space-y-3">
          {/* Modifications */}
          {safetyAssessment.modifications.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                <Shield className="w-4 h-4 text-blue-500" />
                Recommended Modifications
              </h4>
              <ul className="space-y-1">
                {safetyAssessment.modifications.slice(0, 3).map((modification, index) => (
                  <li key={index} className="text-xs text-gray-600 flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>{modification}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Alternative Workouts */}
          {safetyAssessment.alternativeWorkouts.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                <Activity className="w-4 h-4 text-green-500" />
                Alternative Workouts
              </h4>
              <div className="flex flex-wrap gap-1">
                {safetyAssessment.alternativeWorkouts.slice(0, 4).map((alternative, index) => (
                  <span key={index} className="inline-block px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full border border-green-200">
                    {alternative}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Medical Clearance Notice */}
          {safetyAssessment.requiresMedicalClearance && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-2">
                <Heart className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-semibold text-red-800">Medical Clearance Required</h4>
                  <p className="text-xs text-red-700 mt-1">
                    This workout requires medical clearance due to your health conditions. 
                    Please consult with your healthcare provider before attempting this exercise.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quick Safety Summary */}
      {!showDetails && safetyAssessment.warnings.length > 0 && (
        <div className="flex items-center gap-1 text-xs text-yellow-700">
          <AlertTriangle className="w-3 h-3" />
          <span>{safetyAssessment.warnings.length} safety warning{safetyAssessment.warnings.length !== 1 ? 's' : ''}</span>
        </div>
      )}
    </div>
  );
};

export default SafetyIndicators; 