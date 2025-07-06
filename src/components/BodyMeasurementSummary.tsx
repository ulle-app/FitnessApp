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

interface BodyMeasurementSummaryProps {
  userId: string;
}

const BodyMeasurementSummary: React.FC<BodyMeasurementSummaryProps> = ({ userId }) => {
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMetric, setSelectedMetric] = useState<string>('weight');

  useEffect(() => {
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

    if (userId) {
      fetchMeasurements();
    }
  }, [userId]);

  const getLatestMeasurement = () => {
    return measurements.length > 0 ? measurements[0] : null;
  };

  const getPreviousMeasurement = () => {
    return measurements.length > 1 ? measurements[1] : null;
  };

  const getChangeIndicator = (current: number | undefined, previous: number | undefined) => {
    if (current === undefined || previous === undefined) return null;
    
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
    { value: 'weight', label: 'Weight', icon: Scale, color: 'text-blue-400', unit: 'kg' },
    { value: 'body_fat', label: 'Body Fat', icon: Percent, color: 'text-red-400', unit: '%' },
    { value: 'skeletal_muscle', label: 'Muscle', icon: Activity, color: 'text-green-400', unit: '%' },
    { value: 'bmi', label: 'BMI', icon: BarChart, color: 'text-purple-400', unit: '' },
  ];

  const chartData = getMetricData();
  const maxValue = Math.max(...chartData.map(d => d.value || 0)) * 1.1;
  const minValue = Math.min(...chartData.map(d => d.value || 0)) * 0.9;

  const latest = getLatestMeasurement();
  const previous = getPreviousMeasurement();

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <div className="text-red-500 dark:text-red-400">
          {error}
        </div>
      </div>
    );
  }

  if (measurements.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Scale className="w-5 h-5 text-blue-600" />
          Body Composition
        </h3>
        <div className="text-center py-6 text-gray-500 dark:text-gray-400">
          <Scale className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No measurement data available yet</p>
          <p className="text-sm mt-2">Your trainer will add measurements soon</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Scale className="w-5 h-5 text-blue-600" />
        Body Composition
      </h3>

      {/* Progress Chart */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex gap-2">
            {metricOptions.map(option => (
              <button
                key={option.value}
                onClick={() => setSelectedMetric(option.value)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  selectedMetric === option.value
                    ? `bg-${option.color.split('-')[1]}-100 ${option.color} dark:bg-${option.color.split('-')[1]}-900/30`
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                }`}
              >
                <option.icon className="w-3 h-3 inline-block mr-1" />
                {option.label}
              </button>
            ))}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Last 15 days
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
          <div className="h-40 flex items-end">
            {chartData.slice(-15).map((item, index) => {
              const height = item.value ? `${((item.value - (minValue || 0)) / ((maxValue - (minValue || 0)) || 1)) * 100}%` : '0%';
              const currentOption = metricOptions.find(m => m.value === selectedMetric);
              const bgColorClass = currentOption?.color.replace('text-', 'bg-').replace('400', '500');
              
              return (
                <div key={index} className="flex-1 flex flex-col items-center justify-end h-full">
                  <div 
                    className={`w-full max-w-[20px] mx-auto rounded-t-sm ${bgColorClass} opacity-80`} 
                    style={{ height }}
                    title={`${item.value} ${currentOption?.unit} on ${item.date}`}
                  ></div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-2 w-full text-center truncate">
                    {item.date}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4">
        {/* Weight */}
        <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-4 border border-blue-100 dark:border-blue-800">
          <div className="flex items-center gap-2 mb-1">
            <Scale className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-800 dark:text-blue-300">Weight</span>
          </div>
          <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
            {latest?.weight || '--'} <span className="text-sm">kg</span>
          </div>
          {getChangeIndicator(latest?.weight, previous?.weight)}
        </div>
        
        {/* Body Fat */}
        <div className="bg-red-50 dark:bg-red-900/30 rounded-xl p-4 border border-red-100 dark:border-red-800">
          <div className="flex items-center gap-2 mb-1">
            <Percent className="w-4 h-4 text-red-600 dark:text-red-400" />
            <span className="text-sm font-medium text-red-800 dark:text-red-300">Body Fat</span>
          </div>
          <div className="text-2xl font-bold text-red-900 dark:text-red-100">
            {latest?.body_fat || '--'} <span className="text-sm">%</span>
          </div>
          {getChangeIndicator(latest?.body_fat, previous?.body_fat)}
        </div>
        
        {/* Skeletal Muscle */}
        <div className="bg-green-50 dark:bg-green-900/30 rounded-xl p-4 border border-green-100 dark:border-green-800">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className="text-sm font-medium text-green-800 dark:text-green-300">Muscle</span>
          </div>
          <div className="text-2xl font-bold text-green-900 dark:text-green-100">
            {latest?.skeletal_muscle || '--'} <span className="text-sm">%</span>
          </div>
          {getChangeIndicator(latest?.skeletal_muscle, previous?.skeletal_muscle)}
        </div>
        
        {/* BMI */}
        <div className="bg-purple-50 dark:bg-purple-900/30 rounded-xl p-4 border border-purple-100 dark:border-purple-800">
          <div className="flex items-center gap-2 mb-1">
            <BarChart className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-medium text-purple-800 dark:text-purple-300">BMI</span>
          </div>
          <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
            {latest?.bmi || '--'}
          </div>
          {getChangeIndicator(latest?.bmi, previous?.bmi)}
        </div>
      </div>

      {/* Last Measurement Info */}
      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
        Last measured: {latest ? new Date(latest.measurement_date).toLocaleDateString() : 'N/A'}
      </div>
    </div>
  );
};

export default BodyMeasurementSummary;