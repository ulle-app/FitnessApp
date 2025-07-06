import React, { useState, useEffect } from 'react';
import {
  Calendar,
  TrendingUp,
  TrendingDown,
  Activity,
  Download,
  RefreshCw
} from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { useUser } from '../context/UserContext';
import BodyMeasurementForm from './BodyMeasurementForm';
import BodyMeasurementChart from './BodyMeasurementChart';

interface Measurement {
  id: string;
  date: string;
  weight?: number;
  body_fat?: number;
  muscle_mass?: number;
  visceral_fat?: number;
  body_age?: number;
  bmr?: number;
  bone_mass?: number;
  body_water?: number;
}

const metricOptions = [
  { value: 'weight', label: 'Weight', unit: 'kg' },
  { value: 'body_fat', label: 'Body Fat', unit: '%' },
  { value: 'muscle_mass', label: 'Muscle Mass', unit: '%' },
  { value: 'visceral_fat', label: 'Visceral Fat', unit: '%' },
  { value: 'body_age', label: 'Body Age', unit: 'years' },
  { value: 'bmr', label: 'BMR', unit: 'kcal' },
  { value: 'bone_mass', label: 'Bone Mass', unit: '%' },
  { value: 'body_water', label: 'Body Water', unit: '%' }
];

const getMetricColor = (metric: string) => {
  const colors: { [key: string]: string } = {
    weight: 'text-blue-400',
    body_fat: 'text-red-400',
    muscle_mass: 'text-green-400',
    visceral_fat: 'text-orange-400',
    body_age: 'text-purple-400',
    bmr: 'text-yellow-400',
    bone_mass: 'text-pink-400',
    body_water: 'text-cyan-400'
  };
  return colors[metric] || 'text-gray-400';
};

export default function BodyMeasurements() {
  const { user } = useUser();
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState('weight');

  useEffect(() => {
    fetchMeasurements();
  }, [user]);

  const fetchMeasurements = async () => {
    if (!user) return;
    
    try {
      const response = await fetch(`/api/body-measurements?userId=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setMeasurements(data.sort((a: Measurement, b: Measurement) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        ));
      }
    } catch (error) {
      console.error('Error fetching measurements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMeasurementAdded = () => {
    setShowForm(false);
    fetchMeasurements();
  };

  const getLatestValue = (metric: string) => {
    const latest = measurements[0];
    return latest ? latest[metric as keyof Measurement] : null;
  };

  const getTrend = (metric: string) => {
    if (measurements.length < 2) return null;
    
    const latest = measurements[0][metric as keyof Measurement] as number;
    const previous = measurements[1][metric as keyof Measurement] as number;
    
    if (!latest || !previous) return null;
    
    const change = latest - previous;
    const percentage = (change / previous) * 100;
    
    return {
      change,
      percentage,
      isPositive: change > 0
    };
  };

  const chartData = measurements
    .slice(0, 10)
    .reverse()
    .map(m => ({
      date: new Date(m.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: m[selectedMetric as keyof Measurement] as number
    }))
    .filter(item => item.value !== undefined && item.value !== null);

  const maxValue = Math.max(...chartData.map(item => item.value));
  const minValue = Math.min(...chartData.map(item => item.value));

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Please log in to view your body measurements</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Body Measurements</h1>
          <div className="flex gap-4">
            <button
              onClick={() => fetchMeasurements()}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Activity className="w-4 h-4" />
              Add Measurement
            </button>
          </div>
        </div>

        {showForm && (
          <div className="mb-8">
            <BodyMeasurementForm
              onMeasurementAdded={handleMeasurementAdded}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metricOptions.map((metric) => {
            const latestValue = getLatestValue(metric.value);
            const trend = getTrend(metric.value);
            
            return (
              <div key={metric.value} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">{metric.label}</h3>
                  <Activity className={`w-5 h-5 ${getMetricColor(metric.value)}`} />
                </div>
                
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-white">
                    {latestValue ? `${latestValue}${metric.unit}` : 'No data'}
                  </div>
                  
                  {trend && (
                    <div className={`flex items-center gap-1 text-sm ${
                      trend.isPositive ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {trend.isPositive ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      <span>
                        {trend.isPositive ? '+' : ''}{trend.change.toFixed(1)}{metric.unit}
                        ({trend.percentage.toFixed(1)}%)
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Chart Section */}
        {measurements.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">Progress Chart</h2>
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {metricOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <div className="h-64 flex items-end">
                {chartData.map((item, index) => {
                  const height = item.value ? `${((item.value - (minValue || 0)) / ((maxValue - (minValue || 0)) || 1)) * 100}%` : '0%';
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center justify-end h-full">
                      <div 
                        className={`w-8 bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-400`}
                        style={{ height }}
                      />
                      <div className="text-xs text-gray-400 mt-2 transform -rotate-45 origin-left">
                        {item.date}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        
        {/* Advanced Chart */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">Detailed Analysis</h3>
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <BodyMeasurementChart 
              measurements={measurements}
              metric={selectedMetric}
              metricLabel={metricOptions.find(m => m.value === selectedMetric)?.label || ''}
              metricUnit={selectedMetric === 'weight' ? 'kg' : selectedMetric === 'body_age' ? 'years' : '%'}
              color={getMetricColor(selectedMetric).replace('text-', '#').replace('400', '500')}
            />
          </div>
        </div>

        {/* Recent Measurements */}
        {measurements.length > 0 && (
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-6">Recent Measurements</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-white">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4">Date</th>
                    <th className="text-left py-3 px-4">Weight (kg)</th>
                    <th className="text-left py-3 px-4">Body Fat (%)</th>
                    <th className="text-left py-3 px-4">Muscle Mass (%)</th>
                    <th className="text-left py-3 px-4">Visceral Fat (%)</th>
                    <th className="text-left py-3 px-4">Body Age</th>
                  </tr>
                </thead>
                <tbody>
                  {measurements.slice(0, 10).map((measurement) => (
                    <tr key={measurement.id} className="border-b border-gray-700 hover:bg-gray-700">
                      <td className="py-3 px-4">
                        {new Date(measurement.date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">{measurement.weight || '-'}</td>
                      <td className="py-3 px-4">{measurement.body_fat || '-'}</td>
                      <td className="py-3 px-4">{measurement.muscle_mass || '-'}</td>
                      <td className="py-3 px-4">{measurement.visceral_fat || '-'}</td>
                      <td className="py-3 px-4">{measurement.body_age || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : measurements.length === 0 ? (
          <div className="text-center py-12">
            <Activity className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No measurements yet</h3>
            <p className="text-gray-400 mb-6">Start tracking your body composition by adding your first measurement.</p>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Your First Measurement
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}