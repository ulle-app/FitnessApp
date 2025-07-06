// Personalization Engine for Fitness App
// Analyzes user data to provide intelligent workout recommendations

interface UserProfile {
  id?: number;
  fullName?: string;
  username?: string;
  email?: string;
  phone?: string;
  dob?: string;
  gender?: string;
  height?: number;
  weight?: number;
  bodyFat?: number;
  activityLevel?: string;
  fitnessGoal?: string;
  medicalConditions?: string;
  experience?: string;
  availability?: string;
  preferences?: string;
  assignedTrainer?: string;
  bmr?: number;
  tdee?: number;
  bmi?: number;
}

interface WorkoutRecommendation {
  workout: any;
  score: number;
  reasons: string[];
  warnings: string[];
  modifications: string[];
  priority: 'high' | 'medium' | 'low';
}

interface PersonalizationFactors {
  fitnessLevel: number;
  goalAlignment: number;
  safetyScore: number;
  ageAppropriateness: number;
  equipmentAvailability: number;
  timeEfficiency: number;
  progressionPotential: number;
}

class PersonalizationEngine {
  // Calculate user's age from date of birth
  private calculateAge(dob: string): number {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  // Calculate BMI from height and weight
  private calculateBMI(height: number, weight: number): number {
    const heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
  }

  // Calculate body fat percentage category
  private getBodyFatCategory(bodyFat: number, gender: string): string {
    if (gender?.toLowerCase() === 'male') {
      if (bodyFat < 6) return 'essential';
      if (bodyFat < 14) return 'athlete';
      if (bodyFat < 18) return 'fitness';
      if (bodyFat < 25) return 'average';
      return 'obese';
    } else {
      if (bodyFat < 14) return 'essential';
      if (bodyFat < 21) return 'athlete';
      if (bodyFat < 25) return 'fitness';
      if (bodyFat < 32) return 'average';
      return 'obese';
    }
  }

  // Analyze fitness level based on multiple factors
  private analyzeFitnessLevel(user: UserProfile): number {
    let score = 50; // Base score

    // Activity level analysis
    switch (user.activityLevel?.toLowerCase()) {
      case 'sedentary':
        score -= 20;
        break;
      case 'lightly_active':
        score -= 10;
        break;
      case 'moderately_active':
        score += 0;
        break;
      case 'very_active':
        score += 15;
        break;
      case 'extremely_active':
        score += 25;
        break;
    }

    // Experience level
    switch (user.experience?.toLowerCase()) {
      case 'beginner':
        score -= 15;
        break;
      case 'intermediate':
        score += 0;
        break;
      case 'advanced':
        score += 20;
        break;
    }

    // Age considerations
    if (user.dob) {
      const age = this.calculateAge(user.dob);
      if (age < 18) score -= 10; // Teenagers need supervision
      else if (age > 50) score -= 5; // Older adults need modifications
      else if (age > 65) score -= 15; // Seniors need special considerations
    }

    // BMI considerations
    if (user.height && user.weight) {
      const bmi = this.calculateBMI(user.height, user.weight);
      if (bmi < 18.5) score -= 5; // Underweight
      else if (bmi > 30) score -= 10; // Obese
    }

    return Math.max(0, Math.min(100, score));
  }

  // Analyze goal alignment
  private analyzeGoalAlignment(workout: any, user: UserProfile): number {
    let score = 50;

    if (!user.fitnessGoal || !workout.goal) return score;

    const userGoal = user.fitnessGoal.toLowerCase();
    const workoutGoal = workout.goal.toLowerCase();

    // Direct goal matches
    if (workoutGoal.includes(userGoal) || userGoal.includes(workoutGoal)) {
      score += 30;
    }

    // Specific goal alignments
    if (userGoal.includes('weight_loss') && workoutGoal.includes('cardio')) {
      score += 25;
    }
    if (userGoal.includes('muscle_gain') && workoutGoal.includes('strength')) {
      score += 25;
    }
    if (userGoal.includes('endurance') && workoutGoal.includes('cardio')) {
      score += 20;
    }
    if (userGoal.includes('flexibility') && workoutGoal.includes('stretching')) {
      score += 20;
    }

    // Body composition goals
    if (userGoal.includes('tone') && (workoutGoal.includes('strength') || workoutGoal.includes('cardio'))) {
      score += 15;
    }

    return Math.max(0, Math.min(100, score));
  }

  // Analyze safety considerations
  private analyzeSafetyScore(workout: any, user: UserProfile): number {
    let score = 100; // Start with perfect safety score

    // Medical conditions
    if (user.medicalConditions) {
      const conditions = user.medicalConditions.toLowerCase();
      
      // Back issues
      if (conditions.includes('back') && workout.muscle_group?.toLowerCase().includes('back')) {
        score -= 30;
      }
      
      // Heart conditions
      if (conditions.includes('heart') && workout.level === 'advanced') {
        score -= 40;
      }
      
      // Knee issues
      if (conditions.includes('knee') && workout.muscle_group?.toLowerCase().includes('leg')) {
        score -= 25;
      }
      
      // Shoulder issues
      if (conditions.includes('shoulder') && workout.muscle_group?.toLowerCase().includes('shoulder')) {
        score -= 25;
      }
    }

    // Age-related safety
    if (user.dob) {
      const age = this.calculateAge(user.dob);
      
      if (age > 65 && workout.level === 'advanced') {
        score -= 20;
      }
      
      if (age > 50 && workout.equipment?.toLowerCase().includes('heavy')) {
        score -= 15;
      }
    }

    // BMI safety considerations
    if (user.height && user.weight) {
      const bmi = this.calculateBMI(user.height, user.weight);
      
      if (bmi > 35 && workout.level === 'advanced') {
        score -= 20;
      }
      
      if (bmi < 16 && workout.level === 'advanced') {
        score -= 15;
      }
    }

    return Math.max(0, Math.min(100, score));
  }

  // Analyze age appropriateness
  private analyzeAgeAppropriateness(workout: any, user: UserProfile): number {
    let score = 100;

    if (!user.dob) return score;

    const age = this.calculateAge(user.dob);

    // Teenagers (13-17)
    if (age >= 13 && age <= 17) {
      if (workout.level === 'advanced') score -= 20;
      if (workout.equipment?.toLowerCase().includes('heavy')) score -= 15;
    }

    // Young adults (18-25)
    if (age >= 18 && age <= 25) {
      // Generally good for most workouts
      score += 0;
    }

    // Adults (26-50)
    if (age >= 26 && age <= 50) {
      // Optimal age range for most exercises
      score += 5;
    }

    // Middle-aged (51-65)
    if (age >= 51 && age <= 65) {
      if (workout.level === 'advanced') score -= 15;
      if (workout.equipment?.toLowerCase().includes('heavy')) score -= 10;
    }

    // Seniors (65+)
    if (age > 65) {
      if (workout.level === 'advanced') score -= 30;
      if (workout.level === 'intermediate') score -= 15;
      if (workout.equipment?.toLowerCase().includes('heavy')) score -= 25;
    }

    return Math.max(0, Math.min(100, score));
  }

  // Analyze equipment availability
  private analyzeEquipmentAvailability(workout: any, user: UserProfile): number {
    let score = 100;

    // Check if workout requires specific equipment
    if (workout.equipment?.toLowerCase().includes('barbell') || 
        workout.equipment?.toLowerCase().includes('dumbbell') ||
        workout.equipment?.toLowerCase().includes('machine')) {
      // Assume gym equipment is available for most users
      score -= 10;
    }

    // Bodyweight exercises get higher scores
    if (workout.equipment?.toLowerCase().includes('bodyweight') || 
        workout.equipment?.toLowerCase().includes('none')) {
      score += 10;
    }

    return Math.max(0, Math.min(100, score));
  }

  // Analyze time efficiency
  private analyzeTimeEfficiency(workout: any, user: UserProfile): number {
    let score = 100;

    // Check user availability
    if (user.availability?.toLowerCase().includes('busy') || 
        user.availability?.toLowerCase().includes('limited')) {
      // Prefer shorter, more efficient workouts
      if (workout.sets > 4 || workout.reps > 15) {
        score -= 15;
      }
    }

    // Compound exercises are more time-efficient
    if (workout.muscle_group?.toLowerCase().includes('multiple') ||
        workout.muscle_group?.toLowerCase().includes('full body')) {
      score += 10;
    }

    return Math.max(0, Math.min(100, score));
  }

  // Analyze progression potential
  private analyzeProgressionPotential(workout: any, user: UserProfile): number {
    let score = 100;

    // Check if user is ready for progression
    const fitnessLevel = this.analyzeFitnessLevel(user);
    
    if (fitnessLevel > 70 && workout.level === 'beginner') {
      score -= 20; // Too easy for advanced user
    }
    
    if (fitnessLevel < 30 && workout.level === 'advanced') {
      score -= 30; // Too hard for beginner
    }

    // Check if workout allows for progression
    if (workout.equipment?.toLowerCase().includes('adjustable') ||
        workout.equipment?.toLowerCase().includes('progressive')) {
      score += 15;
    }

    return Math.max(0, Math.min(100, score));
  }

  // Generate personalized recommendations
  public generateRecommendations(workouts: any[], user: UserProfile): WorkoutRecommendation[] {
    const recommendations: WorkoutRecommendation[] = [];

    for (const workout of workouts) {
      const factors: PersonalizationFactors = {
        fitnessLevel: this.analyzeFitnessLevel(user),
        goalAlignment: this.analyzeGoalAlignment(workout, user),
        safetyScore: this.analyzeSafetyScore(workout, user),
        ageAppropriateness: this.analyzeAgeAppropriateness(workout, user),
        equipmentAvailability: this.analyzeEquipmentAvailability(workout, user),
        timeEfficiency: this.analyzeTimeEfficiency(workout, user),
        progressionPotential: this.analyzeProgressionPotential(workout, user)
      };

      // Calculate overall score (weighted average)
      const overallScore = (
        factors.fitnessLevel * 0.2 +
        factors.goalAlignment * 0.25 +
        factors.safetyScore * 0.25 +
        factors.ageAppropriateness * 0.1 +
        factors.equipmentAvailability * 0.05 +
        factors.timeEfficiency * 0.1 +
        factors.progressionPotential * 0.05
      );

      // Generate reasons for recommendation
      const reasons: string[] = [];
      const warnings: string[] = [];
      const modifications: string[] = [];

      // Add reasons based on high scores
      if (factors.goalAlignment > 80) {
        reasons.push(`Perfect alignment with your ${user.fitnessGoal} goal`);
      }
      if (factors.safetyScore > 90) {
        reasons.push('Excellent safety profile for your condition');
      }
      if (factors.ageAppropriateness > 90) {
        reasons.push('Age-appropriate exercise selection');
      }

      // Add warnings based on low scores
      if (factors.safetyScore < 70) {
        warnings.push('Consider consulting a healthcare provider before attempting');
      }
      if (factors.ageAppropriateness < 70) {
        warnings.push('May need modifications for your age group');
      }

      // Add modifications based on factors
      if (user.dob && this.calculateAge(user.dob) > 50) {
        modifications.push('Consider reducing intensity and increasing rest periods');
      }
      if (user.medicalConditions?.toLowerCase().includes('back')) {
        modifications.push('Focus on proper form and avoid excessive spinal loading');
      }
      if (factors.fitnessLevel < 30) {
        modifications.push('Start with lighter weights and focus on form');
      }

      // Determine priority
      let priority: 'high' | 'medium' | 'low' = 'medium';
      if (overallScore >= 80) priority = 'high';
      else if (overallScore < 50) priority = 'low';

      recommendations.push({
        workout,
        score: Math.round(overallScore),
        reasons,
        warnings,
        modifications,
        priority
      });
    }

    // Sort by score (highest first)
    return recommendations.sort((a, b) => b.score - a.score);
  }

  // Get personalized workout plan
  public generateWorkoutPlan(workouts: any[], user: UserProfile, planType: 'strength' | 'cardio' | 'flexibility' | 'mixed' = 'mixed'): any[] {
    const recommendations = this.generateRecommendations(workouts, user);
    
    // Filter by plan type if specified
    let filteredRecommendations = recommendations;
    if (planType !== 'mixed') {
      filteredRecommendations = recommendations.filter(rec => 
        rec.workout.goal?.toLowerCase().includes(planType)
      );
    }

    // Return top 5-8 workouts for a plan
    return filteredRecommendations.slice(0, 6).map(rec => rec.workout);
  }

  // Get user fitness insights
  public getUserInsights(user: UserProfile): any {
    const insights: any = {};

    if (user.dob) {
      insights.age = this.calculateAge(user.dob);
      insights.ageGroup = this.getAgeGroup(insights.age);
    }

    if (user.height && user.weight) {
      insights.bmi = this.calculateBMI(user.height, user.weight);
      insights.bmiCategory = this.getBMICategory(insights.bmi);
    }

    if (user.bodyFat && user.gender) {
      insights.bodyFatCategory = this.getBodyFatCategory(user.bodyFat, user.gender);
    }

    insights.fitnessLevel = this.analyzeFitnessLevel(user);
    insights.fitnessLevelCategory = this.getFitnessLevelCategory(insights.fitnessLevel);

    return insights;
  }

  // Helper methods
  private getAgeGroup(age: number): string {
    if (age < 18) return 'teenager';
    if (age < 25) return 'young_adult';
    if (age < 50) return 'adult';
    if (age < 65) return 'middle_aged';
    return 'senior';
  }

  private getBMICategory(bmi: number): string {
    if (bmi < 18.5) return 'underweight';
    if (bmi < 25) return 'normal';
    if (bmi < 30) return 'overweight';
    return 'obese';
  }

  private getFitnessLevelCategory(score: number): string {
    if (score >= 80) return 'advanced';
    if (score >= 60) return 'intermediate';
    if (score >= 40) return 'beginner';
    return 'novice';
  }
}

// Export singleton instance
export const personalizationEngine = new PersonalizationEngine();
export default personalizationEngine; 