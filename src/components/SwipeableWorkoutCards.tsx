import React, { useRef, useState } from 'react';
import { Dumbbell, HeartPulse, Target, Zap, CheckCircle, Info, X, Users, Check, Footprints } from 'lucide-react';

interface Workout {
  name: string;
  sets: number;
  reps: number | string;
  muscle_group: string;
  goal?: string;
  level?: string;
  equipment?: string;
  img?: string;
  videoUrl?: string;
  id?: number;
  instructions?: string;
}

interface User {
  phone: string;
  username: string;
  fullName?: string;
  photo?: string;
}

interface SwipeableWorkoutCardsProps {
  workouts: Workout[];
  assignedUsers?: User[];
  onAssignWorkout?: (workoutId: number, userIds: string[]) => Promise<void>;
}

function getWorkoutIcon(workout: Workout) {
  const name = workout.name.toLowerCase();
  const muscle = workout.muscle_group.toLowerCase();
  if (name.includes('push') || name.includes('squat') || name.includes('deadlift') || muscle.includes('chest') || muscle.includes('quads') || muscle.includes('glutes')) {
    return <Dumbbell className="w-10 h-10 text-white" />;
  }
  if (name.includes('plank') || muscle.includes('core')) {
    return <Target className="w-10 h-10 text-white" />;
  }
  if (name.includes('cardio') || muscle.includes('cardio')) {
    return <HeartPulse className="w-10 h-10 text-white" />;
  }
  if (name.includes('jump') || name.includes('burpee')) {
    return <Zap className="w-10 h-10 text-white" />;
  }
  return <Dumbbell className="w-10 h-10 text-white" />;
}

const SwipeableWorkoutCards: React.FC<SwipeableWorkoutCardsProps> = ({ 
  workouts, 
  assignedUsers = [], 
  onAssignWorkout 
}) => {
  const [current, setCurrent] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isAssigning, setIsAssigning] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [assignedUserNames, setAssignedUserNames] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const workoutsWithVideo = workouts.map(w =>
    w.name.toLowerCase().includes('push')
      ? { ...w, videoUrl: 'https://www.youtube.com/watch?v=IODxDxX7oi4' }
      : w
  );

  const scrollToCard = (idx: number) => {
    setCurrent(idx);
    if (containerRef.current) {
      const card = containerRef.current.children[idx] as HTMLElement;
      card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'left' && current < workouts.length - 1) {
      setCurrent(current + 1);
    } else if (direction === 'right' && current > 0) {
      setCurrent(current - 1);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const startX = touch.clientX;
    
    const handleTouchEnd = (e: TouchEvent) => {
      const touch = e.changedTouches[0];
      const endX = touch.clientX;
      const diff = startX - endX;
      
      if (Math.abs(diff) > 50) {
        handleSwipe(diff > 0 ? 'left' : 'right');
      }
      
      document.removeEventListener('touchend', handleTouchEnd);
    };
    
    document.addEventListener('touchend', handleTouchEnd);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const startX = e.clientX;
    
    const handleMouseUp = (e: MouseEvent) => {
      const endX = e.clientX;
      const diff = startX - endX;
      
      if (Math.abs(diff) > 50) {
        handleSwipe(diff > 0 ? 'left' : 'right');
      }
      
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      handleSwipe('right');
    } else if (e.key === 'ArrowRight') {
      handleSwipe('left');
    }
  };

  const handleAssign = (workout: Workout) => {
    setSelectedWorkout(workout);
    setSelectedUsers([]);
    setShowAssignModal(true);
  };

  const handleUserToggle = (userPhone: string) => {
    setSelectedUsers(prev => 
      prev.includes(userPhone) 
        ? prev.filter(phone => phone !== userPhone)
        : [...prev, userPhone]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === assignedUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(assignedUsers.map(user => user.phone));
    }
  };

  const handleConfirmAssign = async () => {
    if (!selectedWorkout?.id || selectedUsers.length === 0 || !onAssignWorkout) return;
    
    setIsAssigning(true);
    try {
      await onAssignWorkout(selectedWorkout.id, selectedUsers);
      
      // Get names of assigned users for success message
      const names = assignedUsers
        .filter(user => selectedUsers.includes(user.phone))
        .map(user => user.fullName || user.username);
      setAssignedUserNames(names);
      
      setShowAssignModal(false);
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Assignment failed:', error);
    } finally {
      setIsAssigning(false);
    }
  };

  const getWorkoutIcon = (workout: Workout) => {
    const name = workout.name.toLowerCase();
    if (name.includes('push') || name.includes('chest')) return <Dumbbell className="w-6 h-6 text-white" />;
    if (name.includes('squat') || name.includes('leg')) return <Footprints className="w-6 h-6 text-white" />;
    if (name.includes('pull') || name.includes('back')) return <Target className="w-6 h-6 text-white" />;
    if (name.includes('cardio') || name.includes('run')) return <HeartPulse className="w-6 h-6 text-white" />;
    return <Dumbbell className="w-6 h-6 text-white" />;
  };

  const currentWorkout = workouts[current];

  if (!currentWorkout) return null;

  return (
    <div className="relative" ref={containerRef}>
      {/* Card Container */}
      <div 
        className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 shadow-2xl border border-white/10 overflow-hidden"
        onTouchStart={handleTouchStart}
        onMouseDown={handleMouseDown}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label={`Workout card ${current + 1} of ${workouts.length}`}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-4 right-4 w-32 h-32 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-4 left-4 w-24 h-24 bg-purple-500 rounded-full blur-2xl"></div>
        </div>

        {/* Header */}
        <div className="relative z-10 flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              {getWorkoutIcon(currentWorkout)}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">{currentWorkout.name}</h3>
              <div className="flex items-center gap-2 text-white/70">
                <Target className="w-4 h-4" />
                <span className="text-sm">{currentWorkout.muscle_group}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white mb-1">{current + 1}/{workouts.length}</div>
            <div className="text-sm text-white/50">Swipe to browse</div>
          </div>
        </div>

        {/* Workout Details */}
        <div className="relative z-10 grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm border border-white/20">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              <span className="text-white/80 text-sm font-medium">Sets</span>
            </div>
            <div className="text-2xl font-bold text-white">{currentWorkout.sets}</div>
          </div>
          <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm border border-white/20">
            <div className="flex items-center gap-2 mb-2">
              <HeartPulse className="w-5 h-5 text-red-400" />
              <span className="text-white/80 text-sm font-medium">Reps</span>
            </div>
            <div className="text-2xl font-bold text-white">{currentWorkout.reps}</div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="relative z-10 space-y-3 mb-8">
          {currentWorkout.level && (
            <div className="flex items-center gap-3 text-white/80">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm capitalize">{currentWorkout.level} Level</span>
            </div>
          )}
          {currentWorkout.equipment && (
            <div className="flex items-center gap-3 text-white/80">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-sm">{currentWorkout.equipment}</span>
            </div>
          )}
          {currentWorkout.goal && (
            <div className="flex items-center gap-3 text-white/80">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span className="text-sm">{currentWorkout.goal}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="relative z-10 flex gap-3">
          <button
            onClick={() => handleAssign(currentWorkout)}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
          >
            <Users className="w-5 h-5" />
            Assign to Users
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="bg-white/10 hover:bg-white/20 text-white font-bold py-4 px-6 rounded-2xl border border-white/20 transition-all flex items-center justify-center gap-2"
          >
            <Info className="w-5 h-5" />
            Details
          </button>
        </div>

                 {/* Navigation Dots */}
         <div className="relative z-10 flex justify-center gap-2 mt-6">
           {workouts.map((_, index) => (
             <button
               key={index}
               onClick={() => setCurrent(index)}
               className={`w-3 h-3 rounded-full transition-all ${
                 index === current ? 'bg-white scale-125' : 'bg-white/30 hover:bg-white/50'
               }`}
               aria-label={`Go to workout ${index + 1}`}
             />
           ))}
         </div>
      </div>

      {/* Details Modal */}
      {showModal && currentWorkout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-gray-900 rounded-2xl shadow-2xl p-8 max-w-md w-full relative">
            <button className="absolute top-4 right-4 text-white hover:bg-white/10 rounded-full p-2" onClick={() => setShowModal(false)}>
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold text-white mb-4">{currentWorkout.name}</h2>
            <div className="space-y-4 text-white/80">
              <div>
                <strong className="text-white">Instructions:</strong>
                <p className="mt-1">{currentWorkout.instructions || 'No instructions available.'}</p>
              </div>
              {currentWorkout.videoUrl && (
                <a
                  href={currentWorkout.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2 font-semibold shadow transition-all"
                >
                  <Info className="w-5 h-5" />
                  Watch Video
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* User Selection Modal */}
      {showAssignModal && selectedWorkout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-gray-900 rounded-2xl shadow-2xl p-8 max-w-lg w-full relative max-h-[80vh] overflow-y-auto">
            <button className="absolute top-4 right-4 text-white hover:bg-white/10 rounded-full p-2" onClick={() => setShowAssignModal(false)}>
              <X className="w-6 h-6" />
            </button>
            
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                Assign <span className="text-blue-400">{selectedWorkout.name}</span>
              </h2>
              <p className="text-white/70">Select users to assign this workout to:</p>
            </div>

            {assignedUsers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-16 h-16 text-white/30 mx-auto mb-4" />
                <p className="text-white/70 text-lg">No users assigned to you yet.</p>
                <p className="text-white/50 text-sm mt-2">Contact admin to get users assigned.</p>
              </div>
            ) : (
              <>
                {/* Select All Button */}
                <div className="mb-4">
                  <button
                    onClick={handleSelectAll}
                    className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold transition-all ${
                      selectedUsers.length === assignedUsers.length
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    <Check className="w-5 h-5" />
                    {selectedUsers.length === assignedUsers.length ? 'Deselect All' : 'Select All'}
                  </button>
                </div>

                {/* User List */}
                <div className="space-y-3 mb-6">
                  {assignedUsers.map((user) => (
                    <label
                      key={user.phone}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                        selectedUsers.includes(user.phone)
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-white/20 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.phone)}
                        onChange={() => handleUserToggle(user.phone)}
                        className="w-5 h-5 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <img
                        src={user.photo || '/src/assets/avatars/avatar1.svg'}
                        alt={user.fullName || user.username}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-white">
                          {user.fullName || user.username}
                        </div>
                        <div className="text-sm text-white/70">
                          {user.username}
                        </div>
                      </div>
                      {selectedUsers.includes(user.phone) && (
                        <CheckCircle className="w-6 h-6 text-blue-400" />
                      )}
                    </label>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowAssignModal(false)}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-6 rounded-xl border border-white/20 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmAssign}
                    disabled={selectedUsers.length === 0 || isAssigning}
                    className={`flex-1 font-bold py-3 px-6 rounded-xl transition-all ${
                      selectedUsers.length === 0 || isAssigning
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                    }`}
                  >
                    {isAssigning ? 'Assigning...' : `Assign to ${selectedUsers.length} User${selectedUsers.length !== 1 ? 's' : ''}`}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && selectedWorkout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-gray-900 rounded-2xl shadow-2xl p-8 max-w-md w-full relative flex flex-col items-center">
            <button className="absolute top-4 right-4 text-white hover:bg-white/10 rounded-full p-2" onClick={() => setShowSuccessModal(false)}>
              <X className="w-6 h-6" />
            </button>
            
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-2 text-center">
              Successfully Assigned!
            </h2>
            
            <div className="text-center mb-4">
              <p className="text-white/80 mb-2">
                <span className="text-blue-400 font-semibold">{selectedWorkout.name}</span> has been assigned to:
              </p>
              <div className="space-y-1">
                {assignedUserNames.map((name, index) => (
                  <div key={index} className="text-green-400 font-medium">• {name}</div>
                ))}
              </div>
            </div>
            
            {selectedWorkout.videoUrl && (
              <a
                href={selectedWorkout.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2 font-semibold shadow transition-all"
              >
                <Info className="w-5 h-5" />
                Watch Video
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SwipeableWorkoutCards; 