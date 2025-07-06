import React, { useState, useEffect } from 'react';
import { 
  searchWorkoutDetails, 
  getEquipmentGuide, 
  getSafetyTips, 
  getWorkoutVariations 
} from '../services/fitnessApi';
import SafetyIndicators from './SafetyIndicators';

interface WorkoutDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  workoutName: string;
  userData?: any;
}

const WorkoutDetailModal: React.FC<WorkoutDetailModalProps> = ({
  isOpen,
  onClose,
  workoutName,
  userData
}) => {
  const [workoutDetails, setWorkoutDetails] = useState<any>(null);
  const [equipmentGuide, setEquipmentGuide] = useState<any>(null);
  const [safetyTips, setSafetyTips] = useState<any>(null);
  const [variations, setVariations] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('instructions');

  useEffect(() => {
    if (isOpen && workoutName) {
      loadWorkoutData();
    }
  }, [isOpen, workoutName]);

  const loadWorkoutData = async () => {
    setLoading(true);
    try {
      // Load all data in parallel
      const [detailsRes, equipmentRes, safetyRes, variationsRes] = await Promise.all([
        searchWorkoutDetails(workoutName),
        searchWorkoutDetails(workoutName).then(res => 
          res.success && res.data ? getEquipmentGuide(res.data.equipment) : Promise.resolve({ success: false, data: undefined })
        ),
        searchWorkoutDetails(workoutName).then(res => 
          res.success && res.data ? getSafetyTips(res.data.muscleGroups[0] || 'general') : Promise.resolve({ success: false, data: undefined })
        ),
        getWorkoutVariations(workoutName, userData?.fitnessLevel || 'intermediate')
      ]);

      if (detailsRes.success) setWorkoutDetails(detailsRes.data);
      if (equipmentRes.success) setEquipmentGuide(equipmentRes.data);
      if (safetyRes.success) setSafetyTips(safetyRes.data);
      if (variationsRes.success) setVariations(variationsRes.data);
    } catch (error) {
      console.error('Error loading workout data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const tabs = [
    { id: 'instructions', label: 'Instructions', icon: '📋' },
    { id: 'equipment', label: 'Equipment', icon: '🏋️' },
    { id: 'safety', label: 'Safety Tips', icon: '⚠️' },
    { id: 'variations', label: 'Variations', icon: '🔄' },
    { id: 'muscles', label: 'Muscle Groups', icon: '💪' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">{workoutName}</h2>
              {workoutDetails && (
                <p className="text-blue-100 mt-1">
                  {workoutDetails.muscleGroups?.join(' • ')}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading workout details...</p>
          </div>
        )}

        {/* Content */}
        {!loading && workoutDetails && (
          <>
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <div className="flex overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                      activeTab === tab.id
                        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {/* Instructions Tab */}
              {activeTab === 'instructions' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Step-by-Step Instructions</h3>
                    <div className="space-y-3">
                      {workoutDetails.instructions?.map((instruction: string, index: number) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </div>
                          <p className="text-gray-700">{instruction}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {workoutDetails.videoUrl && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Video Tutorial</h3>
                      <div className="bg-gray-100 rounded-lg p-4">
                        <a
                          href={workoutDetails.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                          </svg>
                          <span>Watch Video Tutorial</span>
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Equipment Tab */}
              {activeTab === 'equipment' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Required Equipment</h3>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-blue-900 font-medium">{workoutDetails.equipment}</p>
                    </div>
                  </div>

                  {equipmentGuide && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Equipment Guide</h3>
                      
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900 mb-2">Setup</h4>
                          <p className="text-gray-700 text-sm">{equipmentGuide.setup}</p>
                        </div>
                        
                        <div className="bg-red-50 rounded-lg p-4">
                          <h4 className="font-semibold text-red-900 mb-2">Safety</h4>
                          <p className="text-red-700 text-sm">{equipmentGuide.safety}</p>
                        </div>
                        
                        <div className="bg-green-50 rounded-lg p-4">
                          <h4 className="font-semibold text-green-900 mb-2">Maintenance</h4>
                          <p className="text-green-700 text-sm">{equipmentGuide.maintenance}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Safety Tips Tab */}
              {activeTab === 'safety' && (
                <div className="space-y-6">
                  {/* Personalized Safety Assessment */}
                  {userData && (
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Personalized Safety Assessment</h3>
                      <SafetyIndicators
                        workout={{ name: workoutName, level: workoutDetails?.level || 'intermediate' }}
                        user={userData}
                        showDetails={true}
                      />
                    </div>
                  )}

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">General Safety Guidelines</h3>
                    <div className="space-y-3">
                      {workoutDetails.safetyTips?.map((tip: string, index: number) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <div className="flex-shrink-0 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <p className="text-red-800">{tip}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {safetyTips && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Safety Tips</h3>
                      <div className="space-y-2">
                        {safetyTips.tips?.map((tip: string, index: number) => (
                          <div key={index} className="flex items-start space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <div className="flex-shrink-0 w-5 h-5 bg-yellow-500 text-white rounded-full flex items-center justify-center">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <p className="text-yellow-800">{tip}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Variations Tab */}
              {activeTab === 'variations' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Exercise Variations</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {workoutDetails.variations?.map((variation: string, index: number) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-medium text-sm">{index + 1}</span>
                            </div>
                            <span className="font-medium text-gray-900">{variation}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {variations && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Recommended for {userData?.fitnessLevel || 'intermediate'} level
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {variations.variations?.map((variation: string, index: number) => (
                          <div key={index} className="bg-green-50 rounded-lg p-4 border border-green-200">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <span className="font-medium text-green-900">{variation}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Muscle Groups Tab */}
              {activeTab === 'muscles' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Target Muscle Groups</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {workoutDetails.muscleGroups?.map((muscle: string, index: number) => (
                        <div key={index} className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                              <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <span className="font-medium text-purple-900">{muscle}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">Muscle Group Benefits</h3>
                    <p className="text-blue-800 text-sm">
                      This exercise targets multiple muscle groups, providing a comprehensive workout that improves strength, 
                      endurance, and overall fitness. Focus on proper form to maximize benefits and prevent injury.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {workoutDetails && (
                <span>Equipment: {workoutDetails.equipment}</span>
              )}
            </div>
            <button
              onClick={onClose}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutDetailModal; 