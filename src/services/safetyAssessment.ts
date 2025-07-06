// Safety Assessment Service
// Evaluates workout safety based on user medical conditions and fitness level

interface MedicalCondition {
  id: string;
  name: string;
  severity: 'low' | 'medium' | 'high';
  affectedMuscleGroups: string[];
  contraindicatedMovements: string[];
  recommendedModifications: string[];
  requiresMedicalClearance: boolean;
}

interface SafetyAssessment {
  isSafe: boolean;
  riskLevel: 'low' | 'medium' | 'high';
  warnings: string[];
  modifications: string[];
  contraindications: string[];
  requiresMedicalClearance: boolean;
  difficultyAdjustment: number; // -2 to +2 scale
  alternativeWorkouts: string[];
}

interface UserHealthProfile {
  medicalConditions: MedicalCondition[];
  injuries: string[];
  medications: string[];
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  age: number;
  pregnancyStatus?: 'none' | 'first_trimester' | 'second_trimester' | 'third_trimester';
  recentSurgeries?: string[];
  chronicPain?: string[];
}

class SafetyAssessmentService {
  private medicalConditions: Map<string, MedicalCondition> = new Map();
  private workoutRiskFactors: Map<string, any> = new Map();

  constructor() {
    this.initializeMedicalConditions();
    this.initializeWorkoutRiskFactors();
  }

  private initializeMedicalConditions() {
    const conditions: MedicalCondition[] = [
      {
        id: 'hypertension',
        name: 'Hypertension (High Blood Pressure)',
        severity: 'medium',
        affectedMuscleGroups: ['cardiovascular'],
        contraindicatedMovements: ['heavy_lifting', 'isometric_holds', 'explosive_movements'],
        recommendedModifications: [
          'Avoid holding breath during exercises',
          'Use lighter weights with higher reps',
          'Include more rest periods',
          'Monitor heart rate during cardio'
        ],
        requiresMedicalClearance: true
      },
      {
        id: 'diabetes',
        name: 'Diabetes',
        severity: 'medium',
        affectedMuscleGroups: ['cardiovascular', 'nervous'],
        contraindicatedMovements: ['high_intensity_cardio', 'fasted_exercise'],
        recommendedModifications: [
          'Check blood sugar before and after exercise',
          'Have glucose tablets or juice available',
          'Start with low to moderate intensity',
          'Include regular meal timing'
        ],
        requiresMedicalClearance: true
      },
      {
        id: 'heart_disease',
        name: 'Heart Disease',
        severity: 'high',
        affectedMuscleGroups: ['cardiovascular'],
        contraindicatedMovements: ['heavy_lifting', 'high_intensity_cardio', 'isometric_holds'],
        recommendedModifications: [
          'Requires medical clearance before exercise',
          'Start with walking and light stretching',
          'Monitor heart rate closely',
          'Stop immediately if chest pain occurs'
        ],
        requiresMedicalClearance: true
      },
      {
        id: 'back_pain',
        name: 'Chronic Back Pain',
        severity: 'medium',
        affectedMuscleGroups: ['lower_back', 'core'],
        contraindicatedMovements: ['deadlifts', 'squats', 'overhead_press', 'bending_forward'],
        recommendedModifications: [
          'Focus on core strengthening',
          'Use proper form and avoid rounding back',
          'Start with gentle stretching',
          'Consider physical therapy exercises'
        ],
        requiresMedicalClearance: false
      },
      {
        id: 'knee_pain',
        name: 'Knee Pain/Injury',
        severity: 'medium',
        affectedMuscleGroups: ['quadriceps', 'hamstrings', 'calves'],
        contraindicatedMovements: ['squats', 'lunges', 'jumping', 'running'],
        recommendedModifications: [
          'Focus on low-impact exercises',
          'Strengthen surrounding muscles',
          'Use proper knee alignment',
          'Consider swimming or cycling'
        ],
        requiresMedicalClearance: false
      },
      {
        id: 'shoulder_injury',
        name: 'Shoulder Injury',
        severity: 'medium',
        affectedMuscleGroups: ['shoulders', 'chest', 'upper_back'],
        contraindicatedMovements: ['overhead_press', 'bench_press', 'pull_ups', 'push_ups'],
        recommendedModifications: [
          'Focus on range of motion exercises',
          'Strengthen rotator cuff muscles',
          'Avoid overhead movements',
          'Use resistance bands for gentle strengthening'
        ],
        requiresMedicalClearance: false
      },
      {
        id: 'pregnancy',
        name: 'Pregnancy',
        severity: 'medium',
        affectedMuscleGroups: ['core', 'pelvic_floor'],
        contraindicatedMovements: ['lying_on_back', 'heavy_lifting', 'contact_sports', 'high_impact'],
        recommendedModifications: [
          'Focus on pelvic floor exercises',
          'Avoid exercises lying on back after first trimester',
          'Stay hydrated and avoid overheating',
          'Listen to your body and stop if uncomfortable'
        ],
        requiresMedicalClearance: true
      },
      {
        id: 'osteoporosis',
        name: 'Osteoporosis',
        severity: 'high',
        affectedMuscleGroups: ['all'],
        contraindicatedMovements: ['high_impact', 'bending_forward', 'twisting_movements'],
        recommendedModifications: [
          'Focus on weight-bearing exercises',
          'Use proper form to prevent fractures',
          'Include balance exercises',
          'Consider low-impact activities like walking'
        ],
        requiresMedicalClearance: true
      },
      {
        id: 'asthma',
        name: 'Asthma',
        severity: 'medium',
        affectedMuscleGroups: ['cardiovascular'],
        contraindicatedMovements: ['high_intensity_cardio', 'cold_weather_exercise'],
        recommendedModifications: [
          'Have inhaler available during exercise',
          'Warm up gradually',
          'Avoid exercise in cold, dry air',
          'Include rest periods as needed'
        ],
        requiresMedicalClearance: false
      }
    ];

    conditions.forEach(condition => {
      this.medicalConditions.set(condition.id, condition);
    });
  }

  private initializeWorkoutRiskFactors() {
    const riskFactors = {
      'Push-ups': {
        impact: 'medium',
        muscleGroups: ['chest', 'shoulders', 'triceps'],
        contraindications: ['shoulder_injury', 'wrist_pain'],
        modifications: {
          'beginner': 'Knee push-ups',
          'shoulder_injury': 'Wall push-ups',
          'wrist_pain': 'Fist push-ups or use push-up bars'
        }
      },
      'Squats': {
        impact: 'medium',
        muscleGroups: ['quadriceps', 'glutes', 'hamstrings'],
        contraindications: ['knee_pain', 'back_pain'],
        modifications: {
          'beginner': 'Chair squats',
          'knee_pain': 'Wall squats or leg press',
          'back_pain': 'Bodyweight squats with proper form'
        }
      },
      'Deadlifts': {
        impact: 'high',
        muscleGroups: ['lower_back', 'hamstrings', 'glutes'],
        contraindications: ['back_pain', 'herniated_disc'],
        modifications: {
          'beginner': 'Romanian deadlifts with light weight',
          'back_pain': 'Avoid completely, focus on core strengthening',
          'herniated_disc': 'Avoid completely'
        }
      },
      'Running': {
        impact: 'high',
        muscleGroups: ['cardiovascular', 'legs'],
        contraindications: ['knee_pain', 'heart_disease', 'pregnancy'],
        modifications: {
          'beginner': 'Walking or jogging intervals',
          'knee_pain': 'Swimming or cycling instead',
          'pregnancy': 'Walking or prenatal yoga'
        }
      },
      'Planks': {
        impact: 'low',
        muscleGroups: ['core', 'shoulders'],
        contraindications: ['shoulder_injury', 'pregnancy'],
        modifications: {
          'beginner': 'Knee planks',
          'shoulder_injury': 'Forearm planks',
          'pregnancy': 'Modified planks or avoid after first trimester'
        }
      }
    };

    Object.entries(riskFactors).forEach(([workout, factors]) => {
      this.workoutRiskFactors.set(workout, factors);
    });
  }

  // Assess safety for a specific workout and user
  public assessWorkoutSafety(workout: any, userProfile: UserHealthProfile): SafetyAssessment {
    const assessment: SafetyAssessment = {
      isSafe: true,
      riskLevel: 'low',
      warnings: [],
      modifications: [],
      contraindications: [],
      requiresMedicalClearance: false,
      difficultyAdjustment: 0,
      alternativeWorkouts: []
    };

    // Check medical conditions
    userProfile.medicalConditions.forEach(condition => {
      const medicalCondition = this.medicalConditions.get(condition.id);
      if (!medicalCondition) return;

      // Check if workout affects affected muscle groups
      const workoutRisk = this.workoutRiskFactors.get(workout.name);
      if (workoutRisk && this.hasOverlap(workoutRisk.muscleGroups, medicalCondition.affectedMuscleGroups)) {
        assessment.warnings.push(`Caution: ${medicalCondition.name} may affect this exercise`);
        
        if (medicalCondition.requiresMedicalClearance) {
          assessment.requiresMedicalClearance = true;
          assessment.warnings.push(`Medical clearance required for ${medicalCondition.name}`);
        }

        // Add modifications
        assessment.modifications.push(...medicalCondition.recommendedModifications);

        // Adjust risk level
        if (medicalCondition.severity === 'high') {
          assessment.riskLevel = 'high';
          assessment.isSafe = false;
        } else if (medicalCondition.severity === 'medium' && assessment.riskLevel === 'low') {
          assessment.riskLevel = 'medium';
        }
      }
    });

    // Check fitness level adjustments
    if (userProfile.fitnessLevel === 'beginner') {
      assessment.difficultyAdjustment = -1;
      assessment.modifications.push('Start with modified versions of exercises');
      assessment.modifications.push('Focus on proper form over intensity');
    } else if (userProfile.fitnessLevel === 'advanced') {
      assessment.difficultyAdjustment = 1;
    }

    // Check age-related considerations
    if (userProfile.age > 65) {
      assessment.warnings.push('Consider age-appropriate modifications');
      assessment.modifications.push('Include balance and flexibility exercises');
      assessment.modifications.push('Allow longer recovery periods');
    }

    // Check pregnancy considerations
    if (userProfile.pregnancyStatus && userProfile.pregnancyStatus !== 'none') {
      const pregnancyCondition = this.medicalConditions.get('pregnancy');
      if (pregnancyCondition) {
        assessment.warnings.push('Pregnancy requires special exercise considerations');
        assessment.modifications.push(...pregnancyCondition.recommendedModifications);
        assessment.requiresMedicalClearance = true;
      }
    }

    // Add workout-specific modifications
    const workoutRisk = this.workoutRiskFactors.get(workout.name);
    if (workoutRisk) {
      if (workoutRisk.modifications[userProfile.fitnessLevel]) {
        assessment.modifications.push(workoutRisk.modifications[userProfile.fitnessLevel]);
      }
    }

    // Generate alternative workouts
    assessment.alternativeWorkouts = this.generateAlternatives(workout, userProfile);

    return assessment;
  }

  // Check if two arrays have overlapping elements
  private hasOverlap(arr1: string[], arr2: string[]): boolean {
    return arr1.some(item => arr2.includes(item));
  }

  // Generate alternative workouts based on user profile
  private generateAlternatives(workout: any, userProfile: UserHealthProfile): string[] {
    const alternatives: string[] = [];
    const workoutRisk = this.workoutRiskFactors.get(workout.name);

    if (!workoutRisk) return alternatives;

    // Add fitness level alternatives
    if (userProfile.fitnessLevel === 'beginner') {
      alternatives.push('Walking', 'Gentle stretching', 'Bodyweight exercises');
    }

    // Add medical condition alternatives
    userProfile.medicalConditions.forEach(condition => {
      const medicalCondition = this.medicalConditions.get(condition.id);
      if (medicalCondition && this.hasOverlap(workoutRisk.muscleGroups, medicalCondition.affectedMuscleGroups)) {
        alternatives.push('Swimming', 'Cycling', 'Yoga', 'Pilates');
      }
    });

    // Add age-appropriate alternatives
    if (userProfile.age > 65) {
      alternatives.push('Tai Chi', 'Water aerobics', 'Chair exercises');
    }

    return [...new Set(alternatives)]; // Remove duplicates
  }

  // Get safety color for UI display
  public getSafetyColor(riskLevel: string): string {
    switch (riskLevel) {
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  }

  // Get difficulty color for UI display
  public getDifficultyColor(difficulty: string): string {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'text-green-600 bg-green-50 border-green-200';
      case 'intermediate': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'advanced': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  }

  // Get all medical conditions for form selection
  public getAllMedicalConditions(): MedicalCondition[] {
    return Array.from(this.medicalConditions.values());
  }

  // Get workout risk factors for analysis
  public getWorkoutRiskFactors(workoutName: string): any {
    return this.workoutRiskFactors.get(workoutName);
  }
}

// Export singleton instance
export const safetyAssessmentService = new SafetyAssessmentService();
export default safetyAssessmentService; 