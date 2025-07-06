// Fitness API Service for fetching workout details from external sources

interface WorkoutDetails {
  name: string;
  instructions: string[];
  equipment: string;
  safetyTips: string[];
  muscleGroups: string[];
  variations: string[];
  videoUrl?: string;
  imageUrl?: string;
}

interface EquipmentGuide {
  name: string;
  setup: string;
  safety: string;
  maintenance: string;
}

interface SafetyTips {
  tips: string[];
}

interface WorkoutVariations {
  variations: string[];
}

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// Mock fitness database - in production, this would be replaced with real API calls
const workoutDatabase: { [key: string]: WorkoutDetails } = {
  'push-ups': {
    name: 'Push-ups',
    instructions: [
      'Start in a plank position with hands slightly wider than shoulders',
      'Lower your body until chest nearly touches the floor',
      'Keep your core tight and body in a straight line',
      'Push back up to starting position',
      'Repeat for desired number of reps'
    ],
    equipment: 'None (Bodyweight)',
    safetyTips: [
      'Keep your neck neutral - don\'t let your head drop',
      'Engage your core throughout the movement',
      'Don\'t let your hips sag or rise',
      'Breathe steadily throughout the exercise'
    ],
    muscleGroups: ['Chest', 'Triceps', 'Shoulders', 'Core'],
    variations: ['Knee Push-ups', 'Diamond Push-ups', 'Wide Push-ups', 'Decline Push-ups'],
    videoUrl: 'https://www.youtube.com/watch?v=IODxDxX7oi4'
  },
  'squats': {
    name: 'Squats',
    instructions: [
      'Stand with feet shoulder-width apart',
      'Keep your chest up and core engaged',
      'Lower your body as if sitting back into a chair',
      'Keep knees behind toes and weight in heels',
      'Lower until thighs are parallel to ground',
      'Push through heels to return to starting position'
    ],
    equipment: 'None (Bodyweight)',
    safetyTips: [
      'Keep your knees aligned with your toes',
      'Don\'t let your knees cave inward',
      'Keep your chest up throughout the movement',
      'Breathe steadily - inhale down, exhale up'
    ],
    muscleGroups: ['Quadriceps', 'Glutes', 'Hamstrings', 'Core'],
    variations: ['Goblet Squats', 'Jump Squats', 'Pistol Squats', 'Wall Squats'],
    videoUrl: 'https://www.youtube.com/watch?v=aclHkVaku9U'
  },
  'deadlifts': {
    name: 'Deadlifts',
    instructions: [
      'Stand with feet hip-width apart, bar over mid-foot',
      'Bend at hips and knees to grasp bar',
      'Keep chest up and back straight',
      'Lift bar by extending hips and knees',
      'Stand tall with shoulders back',
      'Lower bar with controlled movement'
    ],
    equipment: 'Barbell and Weight Plates',
    safetyTips: [
      'Never round your back during the lift',
      'Keep the bar close to your body',
      'Engage your core throughout the movement',
      'Start with lighter weights to perfect form',
      'Consider using a belt for heavy lifts'
    ],
    muscleGroups: ['Lower Back', 'Glutes', 'Hamstrings', 'Core'],
    variations: ['Romanian Deadlifts', 'Sumo Deadlifts', 'Single-Leg Deadlifts', 'Dumbbell Deadlifts'],
    videoUrl: 'https://www.youtube.com/watch?v=1ZXobu7JvvE'
  },
  'bench press': {
    name: 'Bench Press',
    instructions: [
      'Lie on bench with feet flat on ground',
      'Grip bar slightly wider than shoulder width',
      'Unrack bar and lower to chest',
      'Keep elbows at 45-degree angle',
      'Press bar back up to starting position',
      'Lock out elbows at the top'
    ],
    equipment: 'Barbell, Bench, Weight Plates',
    safetyTips: [
      'Always use a spotter for heavy lifts',
      'Keep your feet flat on the ground',
      'Don\'t bounce the bar off your chest',
      'Keep your core engaged throughout',
      'Lower the bar with control'
    ],
    muscleGroups: ['Chest', 'Triceps', 'Shoulders'],
    variations: ['Dumbbell Bench Press', 'Incline Bench Press', 'Decline Bench Press', 'Close-Grip Bench Press'],
    videoUrl: 'https://www.youtube.com/watch?v=rT7DgCr-3pg'
  },
  'pull-ups': {
    name: 'Pull-ups',
    instructions: [
      'Grab pull-up bar with hands wider than shoulders',
      'Hang with arms fully extended',
      'Pull your body up until chin clears the bar',
      'Keep your core engaged throughout',
      'Lower your body with control',
      'Repeat for desired number of reps'
    ],
    equipment: 'Pull-up Bar',
    safetyTips: [
      'Don\'t swing your body to gain momentum',
      'Keep your shoulders engaged throughout',
      'Breathe steadily throughout the movement',
      'Start with assisted pull-ups if needed'
    ],
    muscleGroups: ['Back', 'Biceps', 'Shoulders'],
    variations: ['Assisted Pull-ups', 'Wide-Grip Pull-ups', 'Close-Grip Pull-ups', 'Neutral-Grip Pull-ups'],
    videoUrl: 'https://www.youtube.com/watch?v=eGo4IYlbE5g'
  }
};

// Function to search for workout details
export const searchWorkoutDetails = async (workoutName: string): Promise<ApiResponse<WorkoutDetails>> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Search in our database (case-insensitive)
    const searchTerm = workoutName.toLowerCase();
    const workout = Object.keys(workoutDatabase).find(key => 
      key.includes(searchTerm) || searchTerm.includes(key)
    );
    
    if (workout) {
      return {
        success: true,
        data: workoutDatabase[workout]
      };
    }
    
    // If not found, return a generic response
    return {
      success: true,
      data: {
        name: workoutName,
        instructions: [
          'Perform the exercise with proper form',
          'Focus on controlled movements',
          'Breathe steadily throughout',
          'Listen to your body and stop if you feel pain'
        ],
        equipment: 'Standard gym equipment',
        safetyTips: [
          'Always warm up before exercising',
          'Use proper form to prevent injury',
          'Start with lighter weights and progress gradually',
          'Consult a trainer if unsure about technique'
        ],
        muscleGroups: ['Multiple muscle groups'],
        variations: ['Modify as needed for your fitness level'],
        videoUrl: undefined
      }
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to fetch workout details'
    };
  }
};

// Function to get equipment usage guide
export const getEquipmentGuide = async (equipment: string): Promise<ApiResponse<EquipmentGuide>> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const equipmentGuides: { [key: string]: any } = {
      'barbell': {
        name: 'Barbell',
        setup: 'Load weight plates on both sides and secure with collars',
        safety: 'Always use collars to prevent plates from sliding',
        maintenance: 'Clean regularly and check for damage'
      },
      'dumbbell': {
        name: 'Dumbbell',
        setup: 'Select appropriate weight for your fitness level',
        safety: 'Keep dumbbells close to your body during lifts',
        maintenance: 'Store properly and check for loose handles'
      },
      'pull-up bar': {
        name: 'Pull-up Bar',
        setup: 'Ensure bar is securely mounted and can support your weight',
        safety: 'Check stability before use and maintain proper grip',
        maintenance: 'Regularly inspect mounting hardware'
      }
    };
    
    const guide = equipmentGuides[equipment.toLowerCase()];
    if (guide) {
      return { success: true, data: guide };
    }
    
    return {
      success: true,
      data: {
        name: equipment,
        setup: 'Follow manufacturer instructions',
        safety: 'Use proper form and start with lighter weights',
        maintenance: 'Regular cleaning and inspection recommended'
      }
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to fetch equipment guide'
    };
  }
};

// Function to get safety tips for specific muscle groups
export const getSafetyTips = async (muscleGroup: string): Promise<ApiResponse<SafetyTips>> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const safetyTips: { [key: string]: string[] } = {
      'back': [
        'Always maintain a neutral spine',
        'Engage your core throughout movements',
        'Avoid rounding your back during lifts',
        'Start with lighter weights to perfect form',
        'Consider using a weight belt for heavy lifts'
      ],
      'knees': [
        'Keep knees aligned with toes',
        'Don\'t let knees cave inward',
        'Avoid locking knees at the top of movements',
        'Warm up properly before leg exercises',
        'Listen to your body and stop if you feel pain'
      ],
      'shoulders': [
        'Keep shoulders down and back',
        'Avoid shrugging during exercises',
        'Maintain proper shoulder blade position',
        'Don\'t lift weights above shoulder level if you have shoulder issues',
        'Include rotator cuff exercises in your routine'
      ]
    };
    
    const tips = safetyTips[muscleGroup.toLowerCase()];
    if (tips) {
      return { success: true, data: { tips } };
    }
    
    return {
      success: true,
      data: {
        tips: [
          'Always warm up before exercising',
          'Use proper form and technique',
          'Start with lighter weights',
          'Listen to your body',
          'Consult a professional if unsure'
        ]
      }
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to fetch safety tips'
    };
  }
};

// Function to get workout variations
export const getWorkoutVariations = async (workoutName: string, difficulty: string): Promise<ApiResponse<WorkoutVariations>> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const variations: { [key: string]: { [key: string]: string[] } } = {
      'push-ups': {
        'beginner': ['Knee Push-ups', 'Wall Push-ups', 'Incline Push-ups'],
        'intermediate': ['Regular Push-ups', 'Diamond Push-ups', 'Wide Push-ups'],
        'advanced': ['Decline Push-ups', 'One-Arm Push-ups', 'Plyometric Push-ups']
      },
      'squats': {
        'beginner': ['Wall Squats', 'Chair Squats', 'Bodyweight Squats'],
        'intermediate': ['Goblet Squats', 'Jump Squats', 'Split Squats'],
        'advanced': ['Pistol Squats', 'Weighted Squats', 'Box Jumps']
      }
    };
    
    const workoutVariations = variations[workoutName.toLowerCase()];
    if (workoutVariations && workoutVariations[difficulty.toLowerCase()]) {
      return {
        success: true,
        data: { variations: workoutVariations[difficulty.toLowerCase()] }
      };
    }
    
    return {
      success: true,
      data: {
        variations: ['Modify exercise based on your fitness level', 'Consult a trainer for proper modifications']
      }
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to fetch workout variations'
    };
  }
}; 