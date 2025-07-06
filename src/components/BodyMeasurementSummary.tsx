import React, { useState, useEffect } from 'react';
import { 
  Scale, 
  Percent, 
  Heart, 
  Activity, 
  Zap, 
  Calendar, 
  BarChart, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Info
} from 'lucide-react';

interface BodyMeasurementSummaryProps {
  userId: string;
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

const BodyMeasurementSummary: React.FC<BodyMeasurementSummaryProps> = ({ userId }) => {
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [loading, setLoading] = useState(true);
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

  const latest = getLatestMeasurement();
  const weightTrend = getTrend('weight');
  const bodyFatTrend = getTrend('body_fat');
  const muscleTrend = getTrend('skeletal_muscle');

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="text-center text-red-500 dark:text-red-400">
          <p>{error}</p>
          <button 
            onClick={fetchMeasurements}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (measurements.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Scale className="w-5 h-5 text-blue-600" />
          Body Measurements
        </h2>
        <div className="text-center py-6">
          <Activity className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-600 dark:text-gray-400">No measurements recorded yet</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Your trainer will add measurements soon</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        <Scale className="w-5 h-5 text-blue-600" />
        Body Measurements
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Weight */}
        <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-4 border border-blue-100 dark:border-blue-800">
          <div className="flex items-center gap-2 mb-2">
            <Scale className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="font-semibold text-blue-800 dark:text-blue-300">Weight</span>
          </div>
          <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
            {latest?.weight || 'N/A'} <span className="text-sm">kg</span>
          </div>
          {weightTrend && (
            <div className={`flex items-center gap-1 text-sm ${
              isTrendPositive('weight', weightTrend.isPositive) 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-red-600 dark:text-red-400'
            }`}>
              {weightTrend.isPositive ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>
                {weightTrend.isPositive ? '+' : ''}{weightTrend.change.toFixed(1)} kg
                ({weightTrend.percentChange.toFixed(1)}%)
              </span>
            </div>
          )}
        </div>
        
        {/* Body Fat */}
        <div className="bg-red-50 dark:bg-red-900/30 rounded-xl p-4 border border-red-100 dark:border-red-800">
          <div className="flex items-center gap-2 mb-2">
            <Percent className="w-5 h-5 text-red-600 dark:text-red-400" />
            <span className="font-semibold text-red-800 dark:text-red-300">Body Fat</span>
          </div>
          <div className="text-2xl font-bold text-red-900 dark:text-red-100">
            {latest?.body_fat || 'N/A'} <span className="text-sm">%</span>
          </div>
          {bodyFatTrend && (
            <div className={`flex items-center gap-1 text-sm ${
              isTrendPositive('body_fat', bodyFatTrend.isPositive) 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-red-600 dark:text-red-400'
            }`}>
              {bodyFatTrend.isPositive ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>
                {bodyFatTrend.isPositive ? '+' : ''}{bodyFatTrend.change.toFixed(1)}%
                ({bodyFatTrend.percentChange.toFixed(1)}%)
              </span>
            </div>
          )}
        </div>
        
        {/* Muscle Mass */}
        <div className="bg-green-50 dark:bg-green-900/30 rounded-xl p-4 border border-green-100 dark:border-green-800">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-green-600 dark:text-green-400" />
            <span className="font-semibold text-green-800 dark:text-green-300">Skeletal Muscle</span>
          </div>
          <div className="text-2xl font-bold text-green-900 dark:text-green-100">
            {latest?.skeletal_muscle || 'N/A'} <span className="text-sm">%</span>
          </div>
          {muscleTrend && (
            <div className={`flex items-center gap-1 text-sm ${
              isTrendPositive('skeletal_muscle', muscleTrend.isPositive) 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-red-600 dark:text-red-400'
            }`}>
              {muscleTrend.isPositive ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>
                {muscleTrend.isPositive ? '+' : ''}{muscleTrend.change.toFixed(1)}%
                ({muscleTrend.percentChange.toFixed(1)}%)
              </span>
            </div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* BMI */}
        <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <BarChart className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <span className="font-semibold text-gray-800 dark:text-gray-200">BMI</span>
          </div>
          <div className="text-xl font-bold text-gray-900 dark:text-white">
            {latest?.bmi || 'N/A'}
          </div>
          {latest?.bmi && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {latest.bmi < 18.5 ? 'Underweight' :
               latest.bmi < 25 ? 'Normal weight' :
               latest.bmi < 30 ? 'Overweight' : 'Obese'}
            </div>
          )}
        </div>
        
        {/* Body Age */}
        <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            <span className="font-semibold text-gray-800 dark:text-gray-200">Body Age</span>
          </div>
          <div className="text-xl font-bold text-gray-900 dark:text-white">
            {latest?.body_age || 'N/A'} <span className="text-sm">years</span>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Last measured: {latest ? new Date(latest.measurement_date).toLocaleDateString() : 'N/A'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BodyMeasurementSummary;