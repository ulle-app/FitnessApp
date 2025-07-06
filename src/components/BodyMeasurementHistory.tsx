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
  Plus,
  TrendingUp,
  TrendingDown,
  Minus,
  Info
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import BodyMeasurementForm from './BodyMeasurementForm';
import BodyMeasurementChart from './BodyMeasurementChart';

interface BodyMeasurementHistoryProps {
  userId: string;
  userName: string;
}

interface Measurement {
  id: number;
  user_id: string;
  measured_by: string;
  measurement_date: string;
  weight?: number;
  body_fat?: number;
  visceral_fat?: number;
  skeletal_muscle?: number;
  resting_metabolism?: number;
  body_age?: number;
  bmi?: number;
  subcutaneous_fat?: number;
  waist_circumference?: number;
  hip_circumference?: number;
  waist_to_hip_ratio?: number;
  notes?: string;
}

const BodyMeasurementHistory: React.FC<BodyMeasurementHistoryProps> = ({ userId, userName }) => {
  const { user } = useUser();
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState('weight');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMeasurements();
  }, [userId]);

  const fetchMeasurements = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/measurements/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setMeasurements(data.measurements || []);
      } else {
        setError('Failed to fetch measurements');
      }
    } catch (err) {
      setError('Network error while fetching measurements');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    setShowForm(false);
    fetchMeasurements();
  };

  // Get the latest measurement
  const getLatestMeasurement = () => {
    if (measurements.length === 0) return null;
    return measurements[0]; // Assuming measurements are sorted by date desc
  };

  // Get trend for a specific metric
  const getTrend = (metric: string) => {
    if (measurements.length < 2) return null;
    
    // Get the two most recent measurements
    const latest = measurements[0];
    const previous = measurements[1];
    
    if (!latest[metric as keyof Measurement] || !previous[metric as keyof Measurement]) return null;
    
    const latestValue = latest[metric as keyof Measurement] as number;
    const previousValue = previous[metric as keyof Measurement] as number;
    
    const change = latestValue - previousValue;
    const percentChange = (change / previousValue) * 100;
    
    return {
      change,
      percentChange,
      isPositive: change > 0
    };
  };

  const latest = getLatestMeasurement();
  const trend = getTrend(selectedMetric);

  // Determine if a trend is good or bad based on the metric
  const isTrendPositive = (metric: string, isIncreasing: boolean) => {
    // For these metrics, decreasing is generally considered positive
    const decreaseIsGood = ['weight', 'body_fat', 'visceral_fat', 'body_age', 'subcutaneous_fat', 'waist_circumference', 'hip_circumference', 'waist_to_hip_ratio', 'bmi'];
    
    // For these metrics, increasing is generally considered positive
    const increaseIsGood = ['skeletal_muscle'];
    
    // For resting_metabolism, it depends on the goal, but generally higher is better
    
    if (decreaseIsGood.includes(metric)) {
      return !isIncreasing;
    }
    
    if (increaseIsGood.includes(metric)) {
      return isIncreasing;
    }
    
    return isIncreasing; // Default
  };

  return (
    <div className="bg-gray-900 rounded-2xl shadow-xl p-6 border border-gray-800 w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Scale className="w-6 h-6 text-blue-400" />
          Body Measurements for {userName}
        </h2>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Measurement
        </button>
      </div>

      {showForm ? (
        <BodyMeasurementForm 
          userId={userId} 
          onSuccess={handleSuccess} 
          onCancel={() => setShowForm(false)} 
        />
      ) : (
        <>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-900/30 border border-red-800 rounded-xl p-4 text-red-200">
              <p>{error}</p>
              <button 
                onClick={fetchMeasurements}
                className="mt-2 px-4 py-2 bg-red-800 hover:bg-red-700 rounded-lg text-white"
              >
                Retry
              </button>
            </div>
          ) : measurements.length === 0 ? (
            <div className="text-center py-12">
              <Activity className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No measurements yet</h3>
              <p className="text-gray-400 mb-6">Start tracking body composition by adding the first measurement.</p>
              <button
                onClick={() => setShowForm(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add First Measurement
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Metric Selector */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button
                  onClick={() => setSelectedMetric('weight')}
                  className={`p-3 rounded-xl border transition-all ${
                    selectedMetric === 'weight'
                      ? 'border-blue-500 bg-blue-900/20'
                      : 'border-gray-700 hover:border-blue-500/50'
                  }`}
                >
                  <Scale className="w-5 h-5 mx-auto mb-2 text-blue-400" />
                  <div className="text-sm font-medium text-white">Weight</div>
                  <div className="text-xs text-gray-400">kg</div>
                </button>
                
                <button
                  onClick={() => setSelectedMetric('body_fat')}
                  className={`p-3 rounded-xl border transition-all ${
                    selectedMetric === 'body_fat'
                      ? 'border-red-500 bg-red-900/20'
                      : 'border-gray-700 hover:border-red-500/50'
                  }`}
                >
                  <Percent className="w-5 h-5 mx-auto mb-2 text-red-400" />
                  <div className="text-sm font-medium text-white">Body Fat</div>
                  <div className="text-xs text-gray-400">%</div>
                </button>
                
                <button
                  onClick={() => setSelectedMetric('skeletal_muscle')}
                  className={`p-3 rounded-xl border transition-all ${
                    selectedMetric === 'skeletal_muscle'
                      ? 'border-green-500 bg-green-900/20'
                      : 'border-gray-700 hover:border-green-500/50'
                  }`}
                >
                  <Activity className="w-5 h-5 mx-auto mb-2 text-green-400" />
                  <div className="text-sm font-medium text-white">Skeletal Muscle</div>
                  <div className="text-xs text-gray-400">%</div>
                </button>
                
                <button
                  onClick={() => setSelectedMetric('visceral_fat')}
                  className={`p-3 rounded-xl border transition-all ${
                    selectedMetric === 'visceral_fat'
                      ? 'border-orange-500 bg-orange-900/20'
                      : 'border-gray-700 hover:border-orange-500/50'
                  }`}
                >
                  <Heart className="w-5 h-5 mx-auto mb-2 text-orange-400" />
                  <div className="text-sm font-medium text-white">Visceral Fat</div>
                  <div className="text-xs text-gray-400">level</div>
                </button>
              </div>

              {/* Current Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Current Value */}
                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-2">Current Value</h3>
                  {latest && latest[selectedMetric as keyof Measurement] !== undefined ? (
                    <div className="text-3xl font-bold text-white">
                      {latest[selectedMetric as keyof Measurement]}
                      <span className="text-sm text-gray-400 ml-1">
                        {selectedMetric === 'weight' ? 'kg' : 
                         selectedMetric === 'body_age' ? 'years' : 
                         selectedMetric === 'resting_metabolism' ? 'kcal' : 
                         selectedMetric.includes('circumference') ? 'cm' : '%'}
                      </span>
                    </div>
                  ) : (
                    <div className="text-gray-400">No data available</div>
                  )}
                  <div className="text-xs text-gray-500 mt-1">
                    {latest ? `Last measured: ${new Date(latest.measurement_date).toLocaleDateString()}` : ''}
                  </div>
                </div>

                {/* Trend */}
                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-2">Trend</h3>
                  {trend ? (
                    <div className="flex items-center gap-2">
                      {trend.isPositive ? (
                        <TrendingUp className={`w-5 h-5 ${isTrendPositive(selectedMetric, true) ? 'text-green-400' : 'text-red-400'}`} />
                      ) : (
                        <TrendingDown className={`w-5 h-5 ${isTrendPositive(selectedMetric, false) ? 'text-green-400' : 'text-red-400'}`} />
                      )}
                      <div className="text-2xl font-bold text-white">
                        {trend.isPositive ? '+' : ''}{trend.change.toFixed(1)}
                        <span className="text-sm text-gray-400 ml-1">
                          {selectedMetric === 'weight' ? 'kg' : 
                           selectedMetric === 'body_age' ? 'years' : 
                           selectedMetric === 'resting_metabolism' ? 'kcal' : 
                           selectedMetric.includes('circumference') ? 'cm' : '%'}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-400">Need more data</div>
                  )}
                  {trend && (
                    <div className="text-sm text-gray-400 mt-1">
                      {trend.percentChange.toFixed(1)}% change
                    </div>
                  )}
                </div>

                {/* Interpretation */}
                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-2">Interpretation</h3>
                  {latest && latest[selectedMetric as keyof Measurement] !== undefined ? (
                    <div>
                      {selectedMetric === 'weight' && (
                        <div className="text-gray-300">
                          {latest.bmi && (
                            <div>
                              BMI: <span className="font-semibold">{latest.bmi}</span>
                              <div className="text-sm mt-1">
                                {latest.bmi < 18.5 ? 'Underweight' :
                                 latest.bmi < 25 ? 'Normal weight' :
                                 latest.bmi < 30 ? 'Overweight' : 'Obese'}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      {selectedMetric === 'body_fat' && (
                        <div className="text-gray-300">
                          {user?.gender === 'male' ? (
                            <div>
                              {latest.body_fat < 10 ? 'Athletic' :
                               latest.body_fat < 15 ? 'Fitness' :
                               latest.body_fat < 20 ? 'Average' :
                               latest.body_fat < 25 ? 'Above Average' : 'High'}
                            </div>
                          ) : (
                            <div>
                              {latest.body_fat < 18 ? 'Athletic' :
                               latest.body_fat < 23 ? 'Fitness' :
                               latest.body_fat < 30 ? 'Average' :
                               latest.body_fat < 35 ? 'Above Average' : 'High'}
                            </div>
                          )}
                        </div>
                      )}
                      {selectedMetric === 'visceral_fat' && (
                        <div className="text-gray-300">
                          {latest.visceral_fat < 10 ? 'Healthy range' :
                           latest.visceral_fat < 15 ? 'Moderate risk' : 'High risk'}
                        </div>
                      )}
                      {selectedMetric === 'skeletal_muscle' && (
                        <div className="text-gray-300">
                          {user?.gender === 'male' ? (
                            <div>
                              {latest.skeletal_muscle < 33 ? 'Low' :
                               latest.skeletal_muscle < 40 ? 'Average' : 'High'}
                            </div>
                          ) : (
                            <div>
                              {latest.skeletal_muscle < 24 ? 'Low' :
                               latest.skeletal_muscle < 30 ? 'Average' : 'High'}
                            </div>
                          )}
                        </div>
                      )}
                      {selectedMetric === 'body_age' && (
                        <div className="text-gray-300">
                          {latest.body_age > (user?.dob ? new Date().getFullYear() - new Date(user.dob).getFullYear() : 0) ? 
                            'Higher than actual age' : 
                            'Lower than actual age'}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-gray-400">No data available</div>
                  )}
                </div>
              </div>

              {/* Chart */}
              {measurements.length >= 2 && (
                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-4">Progress Chart</h3>
                  <div className="h-64">
                    <BodyMeasurementChart 
                      measurements={measurements}
                      metric={selectedMetric}
                      metricLabel={selectedMetric.replace('_', ' ')}
                      metricUnit={selectedMetric === 'weight' ? 'kg' : 
                                 selectedMetric === 'body_age' ? 'years' : 
                                 selectedMetric === 'resting_metabolism' ? 'kcal' : 
                                 selectedMetric.includes('circumference') ? 'cm' : '%'}
                      color={
                        selectedMetric === 'weight' ? '#3b82f6' :
                        selectedMetric === 'body_fat' ? '#ef4444' :
                        selectedMetric === 'skeletal_muscle' ? '#10b981' :
                        selectedMetric === 'visceral_fat' ? '#f97316' :
                        selectedMetric === 'body_age' ? '#8b5cf6' :
                        selectedMetric === 'resting_metabolism' ? '#eab308' :
                        '#3b82f6'
                      }
                    />
                  </div>
                </div>
              )}

              {/* Measurement History */}
              <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Measurement History</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="py-3 px-4 text-gray-400 font-medium">Date</th>
                        <th className="py-3 px-4 text-gray-400 font-medium">Weight (kg)</th>
                        <th className="py-3 px-4 text-gray-400 font-medium">Body Fat (%)</th>
                        <th className="py-3 px-4 text-gray-400 font-medium">Visceral Fat</th>
                        <th className="py-3 px-4 text-gray-400 font-medium">Skeletal Muscle (%)</th>
                        <th className="py-3 px-4 text-gray-400 font-medium">Body Age</th>
                        <th className="py-3 px-4 text-gray-400 font-medium">BMI</th>
                      </tr>
                    </thead>
                    <tbody>
                      {measurements.map((measurement) => (
                        <tr key={measurement.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                          <td className="py-3 px-4 text-white">
                            {new Date(measurement.measurement_date).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4 text-white">{measurement.weight || '-'}</td>
                          <td className="py-3 px-4 text-white">{measurement.body_fat || '-'}</td>
                          <td className="py-3 px-4 text-white">{measurement.visceral_fat || '-'}</td>
                          <td className="py-3 px-4 text-white">{measurement.skeletal_muscle || '-'}</td>
                          <td className="py-3 px-4 text-white">{measurement.body_age || '-'}</td>
                          <td className="py-3 px-4 text-white">{measurement.bmi || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BodyMeasurementHistory;