// Advanced Workout Recommendation Engine
// Tracks user progress and adapts recommendations over time

import personalizationEngine from './personalizationEngine';

interface UserProgress {
  userId: string;
  workoutId: number;
  completedAt: string;
  performance: {
    sets: number;
    reps: number;
    weight?: number;
    duration?: number;
    difficulty: number; // 1-10 scale
    form: number; // 1-10 scale
  };
  notes?: string;
}

interface WorkoutHistory {
  userId: string;
  workouts: UserProgress[];
  lastWorkoutDate?: string;
  totalWorkouts: number;
  averageDifficulty: number;
  preferredMuscleGroups: string[];
  strengthProgress: { [muscleGroup: string]: number };
  enduranceProgress: { [muscleGroup: string]: number };
  consistencyScore: number; // 0-100
}

interface RecommendationContext {
  user: any;
  workoutHistory: WorkoutHistory;
  currentGoals: string[];
  timeAvailable: number; // minutes
  energyLevel: number; // 1-10 scale
  recoveryStatus: 'fresh' | 'moderate' | 'tired';
  equipmentAvailable: string[];
  previousWorkout?: UserProgress;
}

interface AdaptiveRecommendation {
  workout: any;
  score: number;
  reasoning: string[];
  adaptations: string[];
  progression: 'maintain' | 'increase' | 'decrease';
  confidence: number; // 0-100
  timeEstimate: number; // minutes
  energyRequirement: number; // 1-10 scale
}

class RecommendationEngine {
  private workoutHistory: Map<string, WorkoutHistory> = new Map();
  private progressCache: Map<string, any> = new Map();

  // Initialize or load user workout history
  private getUserHistory(userId: string): WorkoutHistory {
    if (!this.workoutHistory.has(userId)) {
      this.workoutHistory.set(userId, {
        userId,
        workouts: [],
        totalWorkouts: 0,
        averageDifficulty: 0,
        preferredMuscleGroups: [],
        strengthProgress: {},
        enduranceProgress: {},
        consistencyScore: 0
      });
    }
    return this.workoutHistory.get(userId)!;
  }

  // Add workout completion to history
  public recordWorkoutCompletion(progress: UserProgress): void {
    const history = this.getUserHistory(progress.userId);
    history.workouts.push(progress);
    history.totalWorkouts++;
    history.lastWorkoutDate = progress.completedAt;
    
    // Update progress metrics
    this.updateProgressMetrics(history);
    
    // Clear cache for this user
    this.progressCache.delete(progress.userId);
  }

  // Update progress metrics based on workout history
  private updateProgressMetrics(history: WorkoutHistory): void {
    if (history.workouts.length === 0) return;

    // Calculate average difficulty
    const totalDifficulty = history.workouts.reduce((sum, w) => sum + w.performance.difficulty, 0);
    history.averageDifficulty = totalDifficulty / history.workouts.length;

    // Analyze preferred muscle groups
    const muscleGroupCounts: { [key: string]: number } = {};
    history.workouts.forEach(workout => {
      // This would need to be enhanced with actual workout data
      // For now, we'll use a simplified approach
    });

    // Calculate consistency score (workouts per week over last 4 weeks)
    const fourWeeksAgo = new Date();
    fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);
    
    const recentWorkouts = history.workouts.filter(w => 
      new Date(w.completedAt) > fourWeeksAgo
    );
    
    const weeksSinceStart = Math.max(1, (Date.now() - fourWeeksAgo.getTime()) / (7 * 24 * 60 * 60 * 1000));
    history.consistencyScore = Math.min(100, (recentWorkouts.length / weeksSinceStart) * 7 * 10); // Target: 7 workouts per week
  }

  // Analyze user's strength progress
  private analyzeStrengthProgress(history: WorkoutHistory): { [muscleGroup: string]: number } {
    const progress: { [muscleGroup: string]: number } = {};
    
    // Group workouts by muscle group and analyze weight progression
    const muscleGroupWorkouts: { [key: string]: UserProgress[] } = {};
    
    history.workouts.forEach(workout => {
      // This would need actual workout data with muscle groups
      // For now, we'll return a simplified analysis
    });

    return progress;
  }

  // Determine if user should progress, maintain, or decrease intensity
  private determineProgression(history: WorkoutHistory, user: any): 'maintain' | 'increase' | 'decrease' {
    if (history.workouts.length < 3) return 'maintain';

    const recentWorkouts = history.workouts.slice(-3);
    const averageDifficulty = recentWorkouts.reduce((sum, w) => sum + w.performance.difficulty, 0) / 3;
    const averageForm = recentWorkouts.reduce((sum, w) => sum + w.performance.form, 0) / 3;

    // If form is poor, decrease intensity
    if (averageForm < 6) return 'decrease';
    
    // If difficulty is consistently low and form is good, increase
    if (averageDifficulty < 6 && averageForm > 7) return 'increase';
    
    // If difficulty is high and form is good, maintain
    if (averageDifficulty > 7 && averageForm > 7) return 'maintain';
    
    // Default to maintain
    return 'maintain';
  }

  // Calculate energy requirement for a workout
  private calculateEnergyRequirement(workout: any, user: any): number {
    let energy = 5; // Base energy requirement

    // Adjust based on workout level
    switch (workout.level?.toLowerCase()) {
      case 'beginner': energy -= 1; break;
      case 'intermediate': energy += 0; break;
      case 'advanced': energy += 2; break;
    }

    // Adjust based on workout type
    if (workout.goal?.toLowerCase().includes('cardio')) energy += 1;
    if (workout.goal?.toLowerCase().includes('strength')) energy += 0.5;

    // Adjust based on sets and reps
    if (workout.sets > 4) energy += 1;
    if (workout.reps > 15) energy += 0.5;

    return Math.min(10, Math.max(1, energy));
  }

  // Calculate time estimate for a workout
  private calculateTimeEstimate(workout: any, user: any): number {
    let time = 20; // Base time in minutes

    // Adjust based on sets and reps
    time += (workout.sets || 3) * 2; // 2 minutes per set
    time += (workout.reps || 10) * 0.1; // 0.1 minutes per rep

    // Adjust based on workout level
    switch (workout.level?.toLowerCase()) {
      case 'beginner': time *= 0.8; break;
      case 'intermediate': time *= 1.0; break;
      case 'advanced': time *= 1.2; break;
    }

    // Adjust based on user experience
    if (user.experience === 'beginner') time *= 1.3;
    if (user.experience === 'advanced') time *= 0.8;

    return Math.round(time);
  }

  // Generate adaptive recommendations
  public generateAdaptiveRecommendations(
    workouts: any[], 
    context: RecommendationContext
  ): AdaptiveRecommendation[] {
    const history = this.getUserHistory(context.user.id || context.user.phone);
    const progression = this.determineProgression(history, context.user);
    
    const recommendations: AdaptiveRecommendation[] = [];

    for (const workout of workouts) {
      const baseScore = personalizationEngine.generateRecommendations([workout], context.user)[0]?.score || 50;
      let adaptiveScore = baseScore;

      // Adjust score based on progression needs
      if (progression === 'increase' && workout.level === 'beginner') {
        adaptiveScore -= 20; // Discourage beginner workouts if user needs progression
      } else if (progression === 'decrease' && workout.level === 'advanced') {
        adaptiveScore -= 30; // Discourage advanced workouts if user needs to decrease
      } else if (progression === 'increase' && workout.level === 'advanced') {
        adaptiveScore += 15; // Encourage advanced workouts if user is ready
      }

      // Adjust based on recovery status
      if (context.recoveryStatus === 'tired' && workout.level === 'advanced') {
        adaptiveScore -= 25;
      } else if (context.recoveryStatus === 'fresh' && workout.level === 'beginner') {
        adaptiveScore -= 10;
      }

      // Adjust based on time available
      const timeEstimate = this.calculateTimeEstimate(workout, context.user);
      if (timeEstimate > context.timeAvailable) {
        adaptiveScore -= 30;
      } else if (timeEstimate < context.timeAvailable * 0.5) {
        adaptiveScore -= 10; // Slightly penalize very short workouts
      }

      // Adjust based on energy level
      const energyRequirement = this.calculateEnergyRequirement(workout, context.user);
      if (energyRequirement > context.energyLevel) {
        adaptiveScore -= 20;
      } else if (energyRequirement < context.energyLevel * 0.5) {
        adaptiveScore -= 5; // Slightly penalize low-energy workouts
      }

      // Check equipment availability
      if (workout.equipment && !context.equipmentAvailable.includes(workout.equipment)) {
        adaptiveScore -= 40;
      }

      // Generate reasoning
      const reasoning: string[] = [];
      const adaptations: string[] = [];

      if (baseScore > 80) reasoning.push('Excellent match with your fitness profile');
      if (progression === 'increase' && workout.level === 'intermediate') reasoning.push('Ready for progression');
      if (progression === 'decrease' && workout.level === 'beginner') reasoning.push('Appropriate for current recovery needs');
      if (timeEstimate <= context.timeAvailable) reasoning.push('Fits your available time');
      if (energyRequirement <= context.energyLevel) reasoning.push('Matches your current energy level');

      // Generate adaptations
      if (progression === 'increase') {
        adaptations.push('Consider increasing weight or reps');
        adaptations.push('Add an extra set if form allows');
      } else if (progression === 'decrease') {
        adaptations.push('Reduce weight or reps if needed');
        adaptations.push('Focus on perfect form');
      }

      if (context.recoveryStatus === 'tired') {
        adaptations.push('Take longer rest periods between sets');
        adaptations.push('Consider reducing intensity');
      }

      // Calculate confidence based on data quality
      let confidence = 70; // Base confidence
      if (history.totalWorkouts > 10) confidence += 20;
      if (history.consistencyScore > 70) confidence += 10;
      confidence = Math.min(100, confidence);

      recommendations.push({
        workout,
        score: Math.max(0, Math.min(100, adaptiveScore)),
        reasoning,
        adaptations,
        progression,
        confidence,
        timeEstimate,
        energyRequirement
      });
    }

    return recommendations.sort((a, b) => b.score - a.score);
  }

  // Generate workout plan based on user's schedule and goals
  public generateWorkoutPlan(
    workouts: any[],
    context: RecommendationContext,
    planDuration: number = 7 // days
  ): any[] {
    const recommendations = this.generateAdaptiveRecommendations(workouts, context);
    const plan: any[] = [];
    
    // Group workouts by type for balanced planning
    const strengthWorkouts = recommendations.filter(r => 
      r.workout.goal?.toLowerCase().includes('strength')
    );
    const cardioWorkouts = recommendations.filter(r => 
      r.workout.goal?.toLowerCase().includes('cardio')
    );
    const flexibilityWorkouts = recommendations.filter(r => 
      r.workout.goal?.toLowerCase().includes('flexibility')
    );

    // Create balanced plan based on user goals
    const hasStrengthGoal = context.currentGoals.some(g => 
      g.toLowerCase().includes('strength') || g.toLowerCase().includes('muscle')
    );
    const hasCardioGoal = context.currentGoals.some(g => 
      g.toLowerCase().includes('cardio') || g.toLowerCase().includes('endurance')
    );
    const hasFlexibilityGoal = context.currentGoals.some(g => 
      g.toLowerCase().includes('flexibility') || g.toLowerCase().includes('mobility')
    );

    // Select workouts for the plan
    if (hasStrengthGoal && strengthWorkouts.length > 0) {
      plan.push(strengthWorkouts[0].workout);
    }
    if (hasCardioGoal && cardioWorkouts.length > 0) {
      plan.push(cardioWorkouts[0].workout);
    }
    if (hasFlexibilityGoal && flexibilityWorkouts.length > 0) {
      plan.push(flexibilityWorkouts[0].workout);
    }

    // Fill remaining slots with best overall recommendations
    const remainingSlots = Math.max(0, planDuration - plan.length);
    const remainingWorkouts = recommendations
      .filter(r => !plan.includes(r.workout))
      .slice(0, remainingSlots)
      .map(r => r.workout);

    return [...plan, ...remainingWorkouts];
  }

  // Get user progress insights
  public getUserProgressInsights(userId: string): any {
    const history = this.getUserHistory(userId);
    
    if (history.workouts.length === 0) {
      return {
        hasProgress: false,
        message: 'No workout history available. Start your fitness journey!'
      };
    }

    const recentWorkouts = history.workouts.slice(-5);
    const averageForm = recentWorkouts.reduce((sum, w) => sum + w.performance.form, 0) / recentWorkouts.length;
    const averageDifficulty = recentWorkouts.reduce((sum, w) => sum + w.performance.difficulty, 0) / recentWorkouts.length;

    return {
      hasProgress: true,
      totalWorkouts: history.totalWorkouts,
      consistencyScore: history.consistencyScore,
      averageForm: averageForm,
      averageDifficulty: averageDifficulty,
      lastWorkoutDate: history.lastWorkoutDate,
      progression: this.determineProgression(history, { id: userId }),
      insights: this.generateProgressInsights(history, averageForm, averageDifficulty)
    };
  }

  // Generate progress insights
  private generateProgressInsights(history: WorkoutHistory, averageForm: number, averageDifficulty: number): string[] {
    const insights: string[] = [];

    if (history.consistencyScore > 80) {
      insights.push('Excellent consistency! You\'re working out regularly.');
    } else if (history.consistencyScore > 60) {
      insights.push('Good consistency. Consider adding 1-2 more workouts per week.');
    } else {
      insights.push('Focus on building a consistent workout routine.');
    }

    if (averageForm > 8) {
      insights.push('Great form! You\'re ready to increase intensity.');
    } else if (averageForm < 6) {
      insights.push('Focus on form before increasing difficulty.');
    }

    if (averageDifficulty > 7) {
      insights.push('You\'re challenging yourself appropriately.');
    } else if (averageDifficulty < 5) {
      insights.push('Consider increasing workout difficulty for better results.');
    }

    return insights;
  }

  // Clear user data (for privacy/cleanup)
  public clearUserData(userId: string): void {
    this.workoutHistory.delete(userId);
    this.progressCache.delete(userId);
  }
}

// Export singleton instance
export const recommendationEngine = new RecommendationEngine();
export default recommendationEngine; 