import React, { useState, useEffect } from 'react';
import { 
  Scale, 
  Percent, 
  Heart, 
  Activity, 
  Zap, 
  Calendar, 
  BarChart, 
  Ruler, 
  Edit, 
  Trash2, 
  Plus,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronDown,
  ChevronUp,
  Download,
  RefreshCw
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import BodyMeasurementForm from './BodyMeasurementForm';

interface Measurement {
  id: number;
  user_id: string;
  measured_by: string;
  measurement_date: string;
  weight: number;
  body_fat: number;
  visceral_fat: number;
  skeletal_muscle: number;
  resting_metabolism: number;
  body_age: number;
  bmi: number;
  subcutaneous_fat: number;
  waist_circumference: number;
  hip_circumference: number;
  waist_to_hip_ratio: number;
  notes: string;
}

interface BodyMeasurementHistoryProps {
  userId: string;
  userName: string;
}

const BodyMeasurementHistory: React.FC<BodyMeasurementHistoryProps> = ({ 
  userId,
  userName
}) => {
  const { user } = useUser();
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [expandedMeasurement, setExpandedMeasurement] = useState<number | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<string>('weight');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);

  const fetchMeasurements = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/measurements/${userId}`);
      const data = await response.json();
      
      if (data.measurements) {
        setMeasurements(data.measurements);
      }
    } catch (err) {
      setError('Failed to load measurements');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeasurements();
  }, [userId]);

  const handleAddSuccess = () => {
    setShowAddForm(false);
    fetchMeasurements();
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/measurements/${id}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (data.success) {
        fetchMeasurements();
        setShowDeleteConfirm(null);
      } else {
        setError(data.error || 'Failed to delete measurement');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getChangeIndicator = (current: number, previous: number | undefined) => {
    if (previous === undefined) return null;
    
    const diff = current - previous;
    const percentChange = ((diff / previous) * 100).toFixed(1);
    
    if (diff > 0) {
      return (
        <div className="flex items-center text-red-400 text-xs">
          <TrendingUp className="w-3 h-3 mr-1" />
          +{diff.toFixed(1)} ({percentChange}%)
        </div>
      );
    } else if (diff < 0) {
      return (
        <div className="flex items-center text-green-400 text-xs">
          <TrendingDown className="w-3 h-3 mr-1" />
          {diff.toFixed(1)} ({percentChange}%)
        </div>
      );
    } else {
      return (
        <div className="flex items-center text-gray-400 text-xs">
          <Minus className="w-3 h-3 mr-1" />
          No change
        </div>
      );
    }
  };

  // Get metrics for chart
  const getMetricData = () => {
    return measurements.slice().reverse().map(m => ({
      date: new Date(m.measurement_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: m[selectedMetric as keyof Measurement] as number
    }));
  };

  const metricOptions = [
    { value: 'weight', label: 'Weight (kg)', icon: Scale },
    { value: 'body_fat', label: 'Body Fat %', icon: Percent },
    { value: 'visceral_fat', label: 'Visceral Fat', icon: Heart },
    { value: 'skeletal_muscle', label: 'Skeletal Muscle %', icon: Activity },
    { value: 'bmi', label: 'BMI', icon: BarChart },
    { value: 'body_age', label: 'Body Age', icon: Calendar },
  ];

  const getMetricColor = (metric: string) => {
    switch(metric) {
      case 'weight': return 'text-blue-400';
      case 'body_fat': return 'text-red-400';
      case 'visceral_fat': return 'text-orange-400';
      case 'skeletal_muscle': return 'text-green-400';
      case 'bmi': return 'text-purple-400';
      case 'body_age': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const chartData = getMetricData();
  const maxValue = Math.max(...chartData.map(d => d.value)) * 1.1;
  const minValue = Math.min(...chartData.map(d => d.value)) * 0.9;

  return (
    <div className="bg-gray-900 rounded-2xl shadow-xl p-6 border border-gray-800 max-w-4xl w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Scale className="w-6 h-6 text-blue-400" />
          Body Measurements: {userName}
        </h2>
        <button 
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Measurement
        </button>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-900/50 border border-red-800 rounded-lg text-red-200 text-sm">
          {error}
          <button 
            onClick={() => { setError(''); fetchMeasurements(); }}
            className="ml-2 underline hover:text-white"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Progress Chart */}
      {measurements.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Progress Chart</h3>
            <div className="flex items-center">
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm"
              >
                {metricOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <button 
                onClick={fetchMeasurements}
                className="ml-2 p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800"
                title="Refresh data"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <div className="h-64 flex items-end">
              {chartData.map((item, index) => {
                const height = `${((item.value - (minValue || 0)) / ((maxValue - (minValue || 0)) || 1)) * 100}%`;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center justify-end h-full">
                    <div 
                      className={`w-full max-w-[30px] mx-auto rounded-t-sm ${getMetricColor(selectedMetric).replace('text-', 'bg-').replace('400', '600')}`} 
                      style={{ height }}
                      title={`${item.value} on ${item.date}`}
                    ></div>
                    <div className="text-xs text-gray-400 mt-2 w-full text-center truncate">
                      {item.date}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-2 text-center text-sm text-gray-300">
              {metricOptions.find(m => m.value === selectedMetric)?.label} over time
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : measurements.length === 0 ? (
        <div className="text-center py-12 bg-gray-800/50 rounded-xl border border-gray-700">
          <Scale className="w-16 h-16 mx-auto mb-4 text-gray-600" />
          <p className="text-gray-300 mb-2">No measurements recorded yet</p>
          <p className="text-gray-500 text-sm">
            Click "Add Measurement" to record the first OMRON body composition reading
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {measurements.map((measurement, index) => {
            const prevMeasurement = measurements[index + 1];
            const isExpanded = expandedMeasurement === measurement.id;
            
            return (
              <div 
                key={measurement.id} 
                className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden"
              >
                {/* Measurement Header */}
                <div 
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-750"
                  onClick={() => setExpandedMeasurement(isExpanded ? null : measurement.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-900/50 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-white">
                        {formatDate(measurement.measurement_date)}
                      </div>
                      <div className="text-sm text-gray-400">
                        {measurement.weight} kg • {measurement.body_fat}% body fat • BMI {measurement.bmi}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDeleteConfirm(measurement.id);
                      }}
                      className="p-2 text-gray-400 hover:text-red-400 rounded-lg hover:bg-gray-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-400">
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-2 border-t border-gray-700">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {/* Weight */}
                      <div className="bg-gray-750 p-3 rounded-lg">
                        <div className="flex items-center gap-1 mb-1">
                          <Scale className="w-4 h-4 text-blue-400" />
                          <span className="text-sm text-gray-300">Weight</span>
                        </div>
                        <div className="text-lg font-semibold text-white">
                          {measurement.weight} kg
                        </div>
                        {getChangeIndicator(measurement.weight, prevMeasurement?.weight)}
                      </div>

                      {/* Body Fat */}
                      <div className="bg-gray-750 p-3 rounded-lg">
                        <div className="flex items-center gap-1 mb-1">
                          <Percent className="w-4 h-4 text-red-400" />
                          <span className="text-sm text-gray-300">Body Fat</span>
                        </div>
                        <div className="text-lg font-semibold text-white">
                          {measurement.body_fat}%
                        </div>
                        {getChangeIndicator(measurement.body_fat, prevMeasurement?.body_fat)}
                      </div>

                      {/* Visceral Fat */}
                      <div className="bg-gray-750 p-3 rounded-lg">
                        <div className="flex items-center gap-1 mb-1">
                          <Heart className="w-4 h-4 text-orange-400" />
                          <span className="text-sm text-gray-300">Visceral Fat</span>
                        </div>
                        <div className="text-lg font-semibold text-white">
                          Level {measurement.visceral_fat}
                        </div>
                        {getChangeIndicator(measurement.visceral_fat, prevMeasurement?.visceral_fat)}
                      </div>

                      {/* Skeletal Muscle */}
                      <div className="bg-gray-750 p-3 rounded-lg">
                        <div className="flex items-center gap-1 mb-1">
                          <Activity className="w-4 h-4 text-green-400" />
                          <span className="text-sm text-gray-300">Skeletal Muscle</span>
                        </div>
                        <div className="text-lg font-semibold text-white">
                          {measurement.skeletal_muscle}%
                        </div>
                        {getChangeIndicator(measurement.skeletal_muscle, prevMeasurement?.skeletal_muscle)}
                      </div>

                      {/* Resting Metabolism */}
                      <div className="bg-gray-750 p-3 rounded-lg">
                        <div className="flex items-center gap-1 mb-1">
                          <Zap className="w-4 h-4 text-yellow-400" />
                          <span className="text-sm text-gray-300">Resting Metabolism</span>
                        </div>
                        <div className="text-lg font-semibold text-white">
                          {measurement.resting_metabolism} kcal
                        </div>
                        {getChangeIndicator(measurement.resting_metabolism, prevMeasurement?.resting_metabolism)}
                      </div>

                      {/* Body Age */}
                      <div className="bg-gray-750 p-3 rounded-lg">
                        <div className="flex items-center gap-1 mb-1">
                          <Calendar className="w-4 h-4 text-purple-400" />
                          <span className="text-sm text-gray-300">Body Age</span>
                        </div>
                        <div className="text-lg font-semibold text-white">
                          {measurement.body_age} years
                        </div>
                        {getChangeIndicator(measurement.body_age, prevMeasurement?.body_age)}
                      </div>

                      {/* BMI */}
                      <div className="bg-gray-750 p-3 rounded-lg">
                        <div className="flex items-center gap-1 mb-1">
                          <BarChart className="w-4 h-4 text-blue-400" />
                          <span className="text-sm text-gray-300">BMI</span>
                        </div>
                        <div className="text-lg font-semibold text-white">
                          {measurement.bmi}
                        </div>
                        {getChangeIndicator(measurement.bmi, prevMeasurement?.bmi)}
                      </div>

                      {/* Subcutaneous Fat */}
                      <div className="bg-gray-750 p-3 rounded-lg">
                        <div className="flex items-center gap-1 mb-1">
                          <Percent className="w-4 h-4 text-pink-400" />
                          <span className="text-sm text-gray-300">Subcutaneous Fat</span>
                        </div>
                        <div className="text-lg font-semibold text-white">
                          {measurement.subcutaneous_fat}%
                        </div>
                        {getChangeIndicator(measurement.subcutaneous_fat, prevMeasurement?.subcutaneous_fat)}
                      </div>

                      {/* Waist Circumference */}
                      <div className="bg-gray-750 p-3 rounded-lg">
                        <div className="flex items-center gap-1 mb-1">
                          <Ruler className="w-4 h-4 text-indigo-400" />
                          <span className="text-sm text-gray-300">Waist</span>
                        </div>
                        <div className="text-lg font-semibold text-white">
                          {measurement.waist_circumference} cm
                        </div>
                        {getChangeIndicator(measurement.waist_circumference, prevMeasurement?.waist_circumference)}
                      </div>

                      {/* Waist-to-Hip Ratio */}
                      <div className="bg-gray-750 p-3 rounded-lg">
                        <div className="flex items-center gap-1 mb-1">
                          <BarChart className="w-4 h-4 text-teal-400" />
                          <span className="text-sm text-gray-300">Waist-to-Hip Ratio</span>
                        </div>
                        <div className="text-lg font-semibold text-white">
                          {measurement.waist_to_hip_ratio}
                        </div>
                        {getChangeIndicator(measurement.waist_to_hip_ratio, prevMeasurement?.waist_to_hip_ratio)}
                      </div>
                    </div>

                    {/* Notes */}
                    {measurement.notes && (
                      <div className="mt-4 p-3 bg-blue-900/30 rounded-lg border border-blue-800/50">
                        <div className="text-sm font-medium text-blue-300 mb-1">Notes:</div>
                        <div className="text-sm text-gray-300">{measurement.notes}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add Measurement Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <BodyMeasurementForm 
            userId={userId}
            onSuccess={handleAddSuccess}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-900 rounded-xl p-6 max-w-md w-full border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">Confirm Deletion</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this measurement record? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BodyMeasurementHistory;