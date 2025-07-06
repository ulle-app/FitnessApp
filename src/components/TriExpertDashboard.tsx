import React, { useState, useEffect } from 'react';
import { User, CheckCircle, Dumbbell, Footprints, Activity, Target, Info, Users, TrendingUp, Scale, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import WorkoutCard from './WorkoutCard';
import Header from './Header';
import SwipeableWorkoutCards from './SwipeableWorkoutCards';
import BodyMeasurementHistory from './BodyMeasurementHistory';

// Utility to normalize phone numbers (strip +91 and non-digits)
function normalizePhone(phone: string) {
  return phone.replace(/^\+91/, '').replace(/\D/g, '');
}

// Utility to get a display name for a user
function getDisplayName(user: any) {
  if (user.fullName && typeof user.fullName === 'string' && !user.fullName.startsWith('yGtK')) { // crude check for encrypted
    return user.fullName;
  }
  if (user.username) return user.username;
  if (user.phone) return user.phone;
  return 'User';
}

const TriExpertDashboard: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { user, logout } = useUser(); // user is the expert
  const navigate = useNavigate();
  const [workoutFilter, setWorkoutFilter] = useState({ muscle: '', goal: '', level: '' });
  const [workoutOptions, setWorkoutOptions] = useState<any[]>([]);
  const [assignedUsers, setAssignedUsers] = useState<any[]>([]);
  const [userWorkouts, setUserWorkouts] = useState<{[userId: string]: any[]}>({});
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedWorkouts, setSelectedWorkouts] = useState<Set<number>>(new Set());
  const [showBodyMeasurements, setShowBodyMeasurements] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  console.log('User context in TriExpertDashboard:', user?.role, user?.phone);
  
  // Redirect if not logged in or not a trainer/expert
  React.useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (user.role !== 'trainer' && user.role !== 'expert') {
      console.log('User is not a trainer or expert, redirecting');
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!user?.phone) {
      console.log('No user.phone found in context');
      return;
    }
    console.log('Raw user.phone from context:', user.phone);
    const normalizedPhone = normalizePhone(user.phone);
    console.log('Fetching assigned users for trainerPhone:', normalizedPhone);
    fetch(`/api/trainer/assigned-users?trainerPhone=${encodeURIComponent(normalizedPhone)}`)
      .then(res => res.json())
      .then(data => setAssignedUsers(data.users || []));
  }, [user?.phone]);

  useEffect(() => {
    fetch('/api/workouts')
      .then(res => res.json())
      .then(data => setWorkoutOptions(data.workouts || []));
  }, []);

  useEffect(() => {
    assignedUsers.forEach(u => {
      fetchUserWorkouts(u.phone);
    });
  }, [assignedUsers]);

  const handleUserSelect = (user: any) => {
    setSelectedUser(user);
    setSelectedWorkouts(new Set());
    fetchUserWorkouts(user.phone);
  };

  const fetchUserWorkouts = async (userId: string) => {
    const res = await fetch(`/api/trainer/user-workouts?user_id=${encodeURIComponent(userId)}`);
    const data = await res.json();
    setUserWorkouts(prev => ({ ...prev, [userId]: data.workouts || [] }));
  };

  const handleWorkoutToggle = (workoutId: number) => {
    setSelectedWorkouts(prev => {
      const next = new Set(prev);
      if (next.has(workoutId)) {
        next.delete(workoutId);
      } else {
        next.add(workoutId);
      }
      return next;
    });
  };

  const handleAssignWorkoutsToUser = async () => {
    if (!selectedUser || selectedWorkouts.size === 0 || !user?.phone) return;
    
    setLoading(true);
    try {
      const normalizedPhone = normalizePhone(user.phone);
      const response = await fetch('/api/trainer/assign-workout-bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          user_ids: [selectedUser.phone], 
          workout_id: Array.from(selectedWorkouts), 
          assigned_by: normalizedPhone 
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to assign workouts');
      }
      
      setSuccessMessage(`Successfully assigned ${selectedWorkouts.size} workout(s) to ${selectedUser.username || selectedUser.fullName || 'user'}`);
      fetchUserWorkouts(selectedUser.phone);
      setSelectedWorkouts(new Set());
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error) {
      console.error('Error assigning workouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignWorkout = async (workoutId: number, userIds: string[]) => {
    if (!user?.phone) return;
    const normalizedPhone = normalizePhone(user.phone);
    try {
      const response = await fetch('/api/trainer/assign-workout-bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          user_ids: userIds, 
          workout_id: workoutId, 
          assigned_by: normalizedPhone 
        })
      });
      if (!response.ok) {
        throw new Error('Assignment failed');
      }
      userIds.forEach(userId => {
        fetchUserWorkouts(userId);
      });
    } catch (error) {
      console.error('Assignment error:', error);
      throw error;
    }
  };

  // Filtered workout options
  const filteredWorkoutOptions: any[] = workoutOptions.filter((opt: any) =>
    (!workoutFilter.muscle || (opt.muscle_group && opt.muscle_group.includes(workoutFilter.muscle))) &&
    (!workoutFilter.goal || (opt.goal && opt.goal.includes(workoutFilter.goal))) &&
    (!workoutFilter.level || (opt.level && opt.level === workoutFilter.level))
  );

  // Unique filter values
  const muscleGroups = Array.from(new Set(workoutOptions.flatMap((opt: any) => (opt.muscle_group ? opt.muscle_group.split(',') : []))));
  const goals = Array.from(new Set(workoutOptions.flatMap((opt: any) => (opt.goal ? opt.goal.split(',') : []))));
  const levels = Array.from(new Set(workoutOptions.map((opt: any) => opt.level)));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-950 text-white font-[Inter,sans-serif] relative">
      <Header />
      <main className="pt-24 pb-16 px-4 flex flex-col items-center min-h-screen">
        <div className="w-full max-w-7xl mx-auto space-y-8">
          <h1 className="text-3xl font-bold text-white text-center mb-8">Trainer Dashboard</h1>
          {successMessage && (
            <div className="fixed top-24 right-4 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg animate-fade-in z-50">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>{successMessage}</span>
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Assigned Users */}
            <div className="bg-gray-900/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 p-6">
              <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
                <Users className="w-6 h-6 text-blue-400" />
                Assigned Users
              </h2>
              <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
                {assignedUsers.length === 0 ? (
                  <div className="text-center py-8 text-white/70">
                    <Users className="w-16 h-16 mx-auto mb-4 text-white/30" />
                    <p>No users assigned to you yet.</p>
                    <p className="text-sm text-white/50 mt-2">Contact admin to get users assigned.</p>
                  </div>
                ) : (
                  assignedUsers.map((assignedUser: any) => {
                    const displayName = getDisplayName(assignedUser);
                    const initials = displayName.split(' ').map((n: string) => n[0]).join('').slice(0,2).toUpperCase();
                    const isSelected = selectedUser?.phone === assignedUser.phone;
                    
                    return (
                      <button
                        key={assignedUser.phone}
                        className={`w-full text-left p-4 rounded-xl border transition-all ${
                          isSelected 
                            ? 'bg-blue-600/30 border-blue-500 shadow-lg' 
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                        }`}
                        onClick={() => handleUserSelect(assignedUser)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-xl font-bold text-blue-700 border-2 border-blue-400">
                            {assignedUser.photo ? (
                              <img src={assignedUser.photo} alt={displayName} className="w-full h-full object-cover rounded-full" />
                            ) : (
                              initials
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-white truncate">{displayName}</div>
                            <div className="text-sm text-white/70 truncate">{assignedUser.phone}</div>
                          </div>
                          {isSelected && (
                            <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0" />
                          )}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
            {/* Middle Column: User Details */}
            <div className="bg-gray-900/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 p-6">
              <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
                <User className="w-6 h-6 text-green-400" />
                User Details
                {selectedUser && (
                  <button
                    onClick={() => setShowBodyMeasurements(true)}
                    className="ml-auto text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Scale className="w-4 h-4" />
                    Body Measurements
                  </button>
                )}
              </h2>
              {selectedUser ? (
                <div className="space-y-6">
                  {/* User Profile */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-2xl font-bold text-blue-700 border-4 border-blue-400">
                      {selectedUser.photo ? (
                        <img src={selectedUser.photo} alt={getDisplayName(selectedUser)} className="w-full h-full object-cover rounded-full" />
                      ) : (
                        getDisplayName(selectedUser).split(' ').map((n: string) => n[0]).join('').slice(0,2).toUpperCase()
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{getDisplayName(selectedUser)}</h3>
                      <p className="text-white/70">{selectedUser.phone}</p>
                      <p className="text-white/50 text-sm">{selectedUser.email || 'No email'}</p>
                    </div>
                  </div>
                  
                  {/* User Measurements */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 rounded-xl p-4 border border-white/10">
                      <div className="flex items-center gap-2 mb-1">
                        <Activity className="w-4 h-4 text-blue-400" />
                        <span className="text-white/70 text-sm">Height</span>
                      </div>
                      <div className="text-xl font-bold text-white">{selectedUser.height || 'N/A'} cm</div>
                    </div>
                    
                    <div className="bg-white/10 rounded-xl p-4 border border-white/10">
                      <div className="flex items-center gap-2 mb-1">
                        <Activity className="w-4 h-4 text-green-400" />
                        <span className="text-white/70 text-sm">Weight</span>
                      </div>
                      <div className="text-xl font-bold text-white">{selectedUser.weight || 'N/A'} kg</div>
                    </div>
                    
                    <div className="bg-white/10 rounded-xl p-4 border border-white/10">
                      <div className="flex items-center gap-2 mb-1">
                        <Target className="w-4 h-4 text-purple-400" />
                        <span className="text-white/70 text-sm">Fitness Goal</span>
                      </div>
                      <div className="text-lg font-bold text-white capitalize">{selectedUser.fitnessGoal?.replace('_', ' ') || 'N/A'}</div>
                    </div>
                    
                    <div className="bg-white/10 rounded-xl p-4 border border-white/10">
                      <div className="flex items-center gap-2 mb-1">
                        <Activity className="w-4 h-4 text-yellow-400" />
                        <span className="text-white/70 text-sm">Activity Level</span>
                      </div>
                      <div className="text-lg font-bold text-white capitalize">{selectedUser.activityLevel?.replace('_', ' ') || 'N/A'}</div>
                    </div>
                  </div>
                  
                  {/* Additional Details */}
                  <div className="space-y-3">
                    <div className="bg-white/10 rounded-xl p-4 border border-white/10">
                      <div className="flex items-center gap-2 mb-1">
                        <Info className="w-4 h-4 text-blue-400" />
                        <span className="text-white/70 text-sm">Medical Conditions</span>
                      </div>
                      <div className="text-white">{selectedUser.medicalConditions || 'None reported'}</div>
                    </div>
                    
                    <div className="bg-white/10 rounded-xl p-4 border border-white/10">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="w-4 h-4 text-green-400" />
                        <span className="text-white/70 text-sm">Assigned Workouts</span>
                      </div>
                      <div className="text-white">
                        {userWorkouts[selectedUser.phone]?.length > 0 ? (
                          <div className="text-lg font-bold">{userWorkouts[selectedUser.phone].length} workouts assigned</div>
                        ) : (
                          <div className="text-white/50">No workouts assigned yet</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-white/50">
                  <User className="w-16 h-16 mb-4" />
                  <p>Select a user to view details</p>
                </div>
              )}
            </div>
            {/* Right Column: Workout Assignment */}
            <div className="bg-gray-900/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 p-6">
              <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
                <Dumbbell className="w-6 h-6 text-purple-400" />
                Assign Workouts
              </h2>
              {selectedUser ? (
                <div className="space-y-6">
                  {/* Workout Filter */}
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm text-white/70 mb-1">Muscle Group</label>
                      <select 
                        value={workoutFilter.muscle}
                        onChange={e => setWorkoutFilter({...workoutFilter, muscle: e.target.value})}
                        className="w-full bg-white/10 border border-white/20 rounded-lg p-2 text-white"
                      >
                        <option value="">All</option>
                        {muscleGroups.map(m => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-white/70 mb-1">Goal</label>
                      <select 
                        value={workoutFilter.goal}
                        onChange={e => setWorkoutFilter({...workoutFilter, goal: e.target.value})}
                        className="w-full bg-white/10 border border-white/20 rounded-lg p-2 text-white"
                      >
                        <option value="">All</option>
                        {goals.map(g => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-white/70 mb-1">Level</label>
                      <select 
                        value={workoutFilter.level}
                        onChange={e => setWorkoutFilter({...workoutFilter, level: e.target.value})}
                        className="w-full bg-white/10 border border-white/20 rounded-lg p-2 text-white"
                      >
                        <option value="">All</option>
                        {levels.map(l => (
                          <option key={l} value={l}>{l}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {/* Workout Selection */}
                  <div className="max-h-[calc(100vh-400px)] overflow-y-auto pr-2 space-y-3">
                    {filteredWorkoutOptions.length > 0 ? (
                      filteredWorkoutOptions.map(workout => (
                        <div 
                          key={workout.id}
                          className={`border rounded-xl transition-all cursor-pointer ${
                            selectedWorkouts.has(workout.id) 
                              ? 'border-blue-500 bg-blue-500/20 shadow-lg' 
                              : 'border-white/10 bg-white/5 hover:bg-white/10'
                          }`}
                          onClick={() => handleWorkoutToggle(workout.id)}
                        >
                          <div className="p-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                              {workout.name.toLowerCase().includes('push') ? (
                                <Dumbbell className="w-5 h-5 text-white" />
                              ) : workout.name.toLowerCase().includes('squat') ? (
                                <Footprints className="w-5 h-5 text-white" />
                              ) : (
                                <Activity className="w-5 h-5 text-white" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-white">{workout.name}</div>
                              <div className="text-sm text-white/70 truncate">{workout.muscle_group}</div>
                            </div>
                            <div className="text-sm text-white/70">
                              {workout.sets} sets × {workout.reps} reps
                            </div>
                            {selectedWorkouts.has(workout.id) && (
                              <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0" />
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-white/50">
                        <Dumbbell className="w-16 h-16 mx-auto mb-4 opacity-30" />
                        <p>No workouts match your filter criteria</p>
                      </div>
                    )}
                  </div>
                  {/* Assign Button */}
                  <button
                    onClick={handleAssignWorkoutsToUser}
                    disabled={selectedWorkouts.size === 0 || loading}
                    className={`w-full py-4 rounded-xl font-bold text-lg transition-colors ${
                      selectedWorkouts.size === 0 || loading
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                    }`}
                  >
                    {loading 
                      ? 'Assigning...' 
                      : `Assign ${selectedWorkouts.size} Workout${selectedWorkouts.size !== 1 ? 's' : ''}`}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-white/50">
                  <Dumbbell className="w-16 h-16 mb-4" />
                  <p>Select a user to assign workouts</p>
                </div>
              )}
            </div>
          </div>
          {/* Current Assigned Workouts */}
          {selectedUser && userWorkouts[selectedUser.phone]?.length > 0 && (
            <div className="bg-gray-900/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 p-6">
              <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-400" />
                Currently Assigned Workouts
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {userWorkouts[selectedUser.phone].map((workout: any) => (
                  <div key={workout.id} className="bg-white/10 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center">
                        {workout.name.toLowerCase().includes('push') ? (
                          <Dumbbell className="w-5 h-5 text-white" />
                        ) : workout.name.toLowerCase().includes('squat') ? (
                          <Footprints className="w-5 h-5 text-white" />
                        ) : (
                          <Activity className="w-5 h-5 text-white" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-white">{workout.name}</div>
                        <div className="text-sm text-white/70">{workout.muscle_group}</div>
                      </div>
                    </div>
                    <div className="text-sm text-white/70 mt-2">
                      <div>Sets: {workout.sets} • Reps: {workout.reps}</div>
                      <div>Level: {workout.level || 'Intermediate'}</div>
                      <div className="text-xs text-white/50 mt-1">
                        Assigned: {new Date(workout.assigned_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Workout Swiper for Quick Assignment */}
          <div className="bg-gray-900/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 p-6">
            <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
              <Dumbbell className="w-6 h-6 text-blue-400" />
              Quick Workout Assignment
            </h2>
            
            <SwipeableWorkoutCards 
              workouts={workoutOptions.slice(0, 5)} 
              onCancel={() => setShowBodyMeasurements(false)}
              assignedUsers={assignedUsers}
              onAssignWorkout={handleAssignWorkout}
            />
          </div>
        </div>
      </main>
      
      {/* Body Measurements Modal */}
      {showBodyMeasurements && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative max-w-4xl w-full">
            <button
              onClick={() => setShowBodyMeasurements(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
            <BodyMeasurementHistory 
              userId={selectedUser.phone}
              userName={getDisplayName(selectedUser)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TriExpertDashboard;