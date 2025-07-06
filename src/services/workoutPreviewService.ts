// Workout Preview Service
// Provides detailed step-by-step instructions, video demonstrations, and interactive guides

interface WorkoutStep {
  stepNumber: number;
  title: string;
  description: string;
  duration?: number; // seconds
  imageUrl?: string;
  videoUrl?: string;
  tips: string[];
  commonMistakes: string[];
  modifications?: string[];
}

interface WorkoutPreview {
  id: string;
  name: string;
  category: string;
  difficulty: string;
  estimatedDuration: number; // minutes
  caloriesBurned: number;
  muscleGroups: string[];
  equipment: string[];
  steps: WorkoutStep[];
  videoTutorials: {
    fullWorkout: string;
    beginnerModification: string;
    advancedVariation: string;
  };
  images: {
    thumbnail: string;
    stepImages: string[];
    formGuide: string[];
  };
  safetyNotes: string[];
  progressionTips: string[];
}

class WorkoutPreviewService {
  private workoutPreviews: Map<string, WorkoutPreview> = new Map();

  constructor() {
    this.initializeWorkoutPreviews();
  }

  private initializeWorkoutPreviews() {
    const previews: WorkoutPreview[] = [
      {
        id: 'push-ups',
        name: 'Push-ups',
        category: 'strength',
        difficulty: 'intermediate',
        estimatedDuration: 10,
        caloriesBurned: 80,
        muscleGroups: ['chest', 'shoulders', 'triceps'],
        equipment: ['bodyweight'],
        steps: [
          {
            stepNumber: 1,
            title: 'Starting Position',
            description: 'Begin in a plank position with your hands slightly wider than shoulder-width apart, fingers pointing forward.',
            duration: 5,
            imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80',
            tips: ['Keep your body in a straight line from head to heels', 'Engage your core muscles'],
            commonMistakes: ['Sagging hips', 'Hands too close together'],
            modifications: ['Knee push-ups for beginners', 'Wall push-ups for easier variation']
          },
          {
            stepNumber: 2,
            title: 'Lowering Phase',
            description: 'Lower your body by bending your elbows, keeping them close to your sides.',
            duration: 3,
            imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80',
            tips: ['Control the movement', 'Keep your neck neutral'],
            commonMistakes: ['Elbows flaring out', 'Dropping too quickly'],
            modifications: ['Slower tempo for better control']
          },
          {
            stepNumber: 3,
            title: 'Bottom Position',
            description: 'Lower until your chest nearly touches the ground, maintaining proper form.',
            duration: 2,
            imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80',
            tips: ['Keep your core engaged', 'Don\'t let your hips sag'],
            commonMistakes: ['Touching the ground with chest', 'Lifting hips too high'],
            modifications: ['Stop higher if needed for proper form']
          },
          {
            stepNumber: 4,
            title: 'Pushing Phase',
            description: 'Push through your hands to return to the starting position.',
            duration: 3,
            imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80',
            tips: ['Exhale as you push up', 'Keep your body straight'],
            commonMistakes: ['Arching back', 'Incomplete range of motion'],
            modifications: ['Use momentum if needed for beginners']
          }
        ],
        videoTutorials: {
          fullWorkout: 'https://www.youtube.com/embed/example1',
          beginnerModification: 'https://www.youtube.com/embed/example2',
          advancedVariation: 'https://www.youtube.com/embed/example3'
        },
        images: {
          thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80',
          stepImages: [
            'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80',
            'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80'
          ],
          formGuide: [
            'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80'
          ]
        },
        safetyNotes: [
          'Stop if you experience shoulder or wrist pain',
          'Maintain proper form over quantity',
          'Warm up your shoulders before starting'
        ],
        progressionTips: [
          'Start with 5-10 reps and gradually increase',
          'Focus on form before adding speed',
          'Try different hand positions for variety'
        ]
      },
      {
        id: 'squats',
        name: 'Squats',
        category: 'strength',
        difficulty: 'beginner',
        estimatedDuration: 8,
        caloriesBurned: 60,
        muscleGroups: ['quadriceps', 'glutes', 'hamstrings'],
        equipment: ['bodyweight'],
        steps: [
          {
            stepNumber: 1,
            title: 'Standing Position',
            description: 'Stand with your feet shoulder-width apart, toes pointing slightly outward.',
            duration: 3,
            imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80',
            tips: ['Keep your chest up', 'Engage your core'],
            commonMistakes: ['Feet too close together', 'Slouching forward'],
            modifications: ['Use a chair for support if needed']
          },
          {
            stepNumber: 2,
            title: 'Lowering Phase',
            description: 'Bend your knees and push your hips back as if sitting in a chair.',
            duration: 4,
            imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80',
            tips: ['Keep your knees in line with your toes', 'Go as low as comfortable'],
            commonMistakes: ['Knees caving inward', 'Not going low enough'],
            modifications: ['Wall squats for beginners']
          },
          {
            stepNumber: 3,
            title: 'Bottom Position',
            description: 'Hold the position briefly, keeping your weight in your heels.',
            duration: 2,
            imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80',
            tips: ['Keep your back straight', 'Don\'t let your knees go past your toes'],
            commonMistakes: ['Rounding the back', 'Lifting heels off ground'],
            modifications: ['Hold onto a support if needed']
          },
          {
            stepNumber: 4,
            title: 'Rising Phase',
            description: 'Push through your heels to return to the starting position.',
            duration: 3,
            imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80',
            tips: ['Exhale as you stand up', 'Keep your core engaged'],
            commonMistakes: ['Using momentum to stand', 'Not fully extending'],
            modifications: ['Slower tempo for better control']
          }
        ],
        videoTutorials: {
          fullWorkout: 'https://www.youtube.com/embed/example4',
          beginnerModification: 'https://www.youtube.com/embed/example5',
          advancedVariation: 'https://www.youtube.com/embed/example6'
        },
        images: {
          thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80',
          stepImages: [
            'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80',
            'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80'
          ],
          formGuide: [
            'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80'
          ]
        },
        safetyNotes: [
          'Stop if you experience knee pain',
          'Keep your back straight throughout the movement',
          'Don\'t go lower than your comfort level'
        ],
        progressionTips: [
          'Start with 10-15 reps and build up',
          'Add weight gradually once form is perfect',
          'Try single-leg variations for advanced progression'
        ]
      },
      {
        id: 'plank',
        name: 'Plank',
        category: 'core',
        difficulty: 'beginner',
        estimatedDuration: 5,
        caloriesBurned: 30,
        muscleGroups: ['core', 'shoulders'],
        equipment: ['bodyweight'],
        steps: [
          {
            stepNumber: 1,
            title: 'Starting Position',
            description: 'Begin in a forearm plank position with elbows under your shoulders.',
            duration: 10,
            imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80',
            tips: ['Keep your body in a straight line', 'Engage your core muscles'],
            commonMistakes: ['Sagging hips', 'Raising hips too high'],
            modifications: ['Knee plank for beginners']
          },
          {
            stepNumber: 2,
            title: 'Hold Position',
            description: 'Maintain the position, breathing steadily and keeping your core engaged.',
            duration: 30,
            imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80',
            tips: ['Breathe normally', 'Focus on keeping your body straight'],
            commonMistakes: ['Holding breath', 'Letting hips drop'],
            modifications: ['Shorter holds for beginners']
          }
        ],
        videoTutorials: {
          fullWorkout: 'https://www.youtube.com/embed/example7',
          beginnerModification: 'https://www.youtube.com/embed/example8',
          advancedVariation: 'https://www.youtube.com/embed/example9'
        },
        images: {
          thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80',
          stepImages: [
            'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80'
          ],
          formGuide: [
            'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80'
          ]
        },
        safetyNotes: [
          'Stop if you experience back pain',
          'Don\'t hold your breath',
          'Keep your neck neutral'
        ],
        progressionTips: [
          'Start with 10-20 seconds and increase gradually',
          'Try side planks for variety',
          'Add movement like plank jacks for advanced users'
        ]
      }
    ];

    previews.forEach(preview => {
      this.workoutPreviews.set(preview.id, preview);
    });
  }

  // Get workout preview by name
  public getWorkoutPreview(workoutName: string): WorkoutPreview | null {
    const normalizedName = workoutName.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    for (const [id, preview] of this.workoutPreviews) {
      if (id.includes(normalizedName) || normalizedName.includes(id)) {
        return preview;
      }
    }
    
    // Return a default preview if not found
    return this.createDefaultPreview(workoutName);
  }

  // Create a default preview for workouts not in the database
  private createDefaultPreview(workoutName: string): WorkoutPreview {
    return {
      id: workoutName.toLowerCase().replace(/[^a-z0-9]/g, ''),
      name: workoutName,
      category: 'strength',
      difficulty: 'intermediate',
      estimatedDuration: 10,
      caloriesBurned: 70,
      muscleGroups: ['general'],
      equipment: ['bodyweight'],
      steps: [
        {
          stepNumber: 1,
          title: 'Preparation',
          description: 'Warm up properly before starting this exercise.',
          duration: 5,
          tips: ['Start with a light warm-up', 'Focus on proper form'],
          commonMistakes: ['Skipping warm-up', 'Poor form'],
          modifications: ['Start with easier variations']
        },
        {
          stepNumber: 2,
          title: 'Execution',
          description: 'Perform the exercise with proper form and controlled movement.',
          duration: 10,
          tips: ['Maintain good posture', 'Breathe steadily'],
          commonMistakes: ['Rushing the movement', 'Poor breathing'],
          modifications: ['Adjust intensity as needed']
        },
        {
          stepNumber: 3,
          title: 'Completion',
          description: 'Finish the exercise safely and cool down properly.',
          duration: 5,
          tips: ['Cool down gradually', 'Stretch if needed'],
          commonMistakes: ['Stopping abruptly', 'Skipping cool-down'],
          modifications: ['Gentle stretching']
        }
      ],
      videoTutorials: {
        fullWorkout: 'https://www.youtube.com/embed/example',
        beginnerModification: 'https://www.youtube.com/embed/example',
        advancedVariation: 'https://www.youtube.com/embed/example'
      },
      images: {
        thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80',
        stepImages: [
          'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80'
        ],
        formGuide: [
          'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80'
        ]
      },
      safetyNotes: [
        'Always warm up before exercise',
        'Stop if you experience pain',
        'Maintain proper form throughout'
      ],
      progressionTips: [
        'Start with easier variations',
        'Gradually increase difficulty',
        'Focus on form over quantity'
      ]
    };
  }

  // Get all available workout previews
  public getAllWorkoutPreviews(): WorkoutPreview[] {
    return Array.from(this.workoutPreviews.values());
  }

  // Get workout previews by category
  public getWorkoutPreviewsByCategory(category: string): WorkoutPreview[] {
    return Array.from(this.workoutPreviews.values())
      .filter(preview => preview.category === category);
  }

  // Get workout previews by difficulty
  public getWorkoutPreviewsByDifficulty(difficulty: string): WorkoutPreview[] {
    return Array.from(this.workoutPreviews.values())
      .filter(preview => preview.difficulty === difficulty);
  }

  // Get workout previews by muscle group
  public getWorkoutPreviewsByMuscleGroup(muscleGroup: string): WorkoutPreview[] {
    return Array.from(this.workoutPreviews.values())
      .filter(preview => preview.muscleGroups.includes(muscleGroup));
  }

  // Get estimated calories burned for a workout
  public getCaloriesBurned(workoutName: string, duration: number, userWeight: number = 70): number {
    const preview = this.getWorkoutPreview(workoutName);
    if (!preview) return 0;
    
    // Basic calorie calculation (can be enhanced with more sophisticated algorithms)
    const baseCalories = preview.caloriesBurned;
    const durationMultiplier = duration / preview.estimatedDuration;
    const weightMultiplier = userWeight / 70;
    
    return Math.round(baseCalories * durationMultiplier * weightMultiplier);
  }

  // Get workout difficulty color
  public getDifficultyColor(difficulty: string): string {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'text-green-600 bg-green-50 border-green-200';
      case 'intermediate': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'advanced': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  }

  // Get category icon
  public getCategoryIcon(category: string): string {
    switch (category.toLowerCase()) {
      case 'strength': return '💪';
      case 'cardio': return '❤️';
      case 'flexibility': return '🧘';
      case 'core': return '🔥';
      case 'balance': return '⚖️';
      default: return '🏋️';
    }
  }
}

// Export singleton instance
export const workoutPreviewService = new WorkoutPreviewService();
export default workoutPreviewService; 