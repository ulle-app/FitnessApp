import React, { useState, useEffect } from 'react';
import { 
  Scale, 
  Ruler, 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Info
} from 'lucide-react'; 
import BodyMeasurementChart from './BodyMeasurementChart';

interface Measurement {
  id: string;
  type: 'weight' | 'body_fat' | 'muscle_mass' | 'waist' | 'chest' | 'arms' | 'thighs';
  value: number;
  unit: string;
  date: string;
  notes?: string;
}

const metricOptions = [
  { value: 'weight', label: 'Weight', unit: 'kg', icon: Scale, color: 'text-blue-400' },
  { value: 'body_fat', label: 'Body Fat', unit: '%', icon: Activity, color: 'text-red-400' },
  { value: 'muscle_mass', label: 'Muscle Mass', unit: 'kg', icon: Activity, color: 'text-green-400' },
  { value: 'waist', label: 'Waist', unit: 'cm', icon: Ruler, color: 'text-purple-400' },
  { value: 'chest', label: 'Chest', unit: 'cm', icon: Ruler, color: 'text-orange-400' },
  { value: 'arms', label: 'Arms', unit: 'cm', icon: Ruler, color: 'text-pink-400' },
  { value: 'thighs', label: 'Thighs', unit: 'cm', icon: Ruler, color: 'text-indigo-400' },
];

export default function BodyMeasurements() {
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<string>('weight');
  const [newMeasurement, setNewMeasurement] = useState({
    value: '',
    notes: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadMeasurements();
  }, []);

  const loadMeasurements = () => {
    const saved = localStorage.getItem('bodyMeasurements');
    if (saved) {
      setMeasurements(JSON.parse(saved));
    }
  };

  const saveMeasurements = (newMeasurements: Measurement[]) => {
    localStorage.setItem('bodyMeasurements', JSON.stringify(newMeasurements));
    setMeasurements(newMeasurements);
  };

  const addMeasurement = () => {
    if (!newMeasurement.value) return;

    const measurement: Measurement = {
      id: Date.now().toString(),
      type: selectedMetric as Measurement['type'],
      value: parseFloat(newMeasurement.value),
      unit: metricOptions.find(m => m.value === selectedMetric)?.unit || '',
      date: newMeasurement.date,
      notes: newMeasurement.notes || undefined
    };

    const updated = [...measurements, measurement].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    saveMeasurements(updated);
    setNewMeasurement({ value: '', notes: '', date: new Date().toISOString().split('T')[0] });
    setShowForm(false);
  };

  const deleteMeasurement = (id: string) => {
    const updated = measurements.filter(m => m.id !== id);
    saveMeasurements(updated);
  };

  const filteredMeasurements = measurements.filter(m => m.type === selectedMetric);
  const currentOption = metricOptions.find(m => m.value === selectedMetric);
  const Icon = currentOption?.icon || Scale;

  // Calculate trend
  const getTrend = () => {
    if (filteredMeasurements.length < 2) return null;
    const recent = filteredMeasurements.slice(-2);
    const change = recent[1].value - recent[0].value;
    const percentage = Math.abs((change / recent[0].value) * 100);
    
    return {
      direction: change > 0 ? 'up' : change < 0 ? 'down' : 'stable',
      change: Math.abs(change),
      percentage: percentage.toFixed(1)
    };
  };

  const trend = getTrend();

  // Prepare chart data
  const chartData = filteredMeasurements.map(m => ({
    date: new Date(m.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    value: m.value
  }));

  const values = chartData.map(d => d.value).filter(v => v > 0);
  const minValue = values.length > 0 ? Math.min(...values) : 0;
  const maxValue = values.length > 0 ? Math.max(...values) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <Scale className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Body Measurements
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Track your physical progress over time
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Add Measurement
        </button>
      </div>

      {/* Metric Selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {metricOptions.map((option) => {
          const OptionIcon = option.icon;
          const isSelected = selectedMetric === option.value;
          
          return (
            <button
              key={option.value}
              onClick={() => setSelectedMetric(option.value)}
              className={`p-3 rounded-xl border transition-all ${
                isSelected
                  ? 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <OptionIcon className={`w-5 h-5 mx-auto mb-2 ${option.color}`} />
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {option.label}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {option.unit}
              </div>
            </button>
          );
        })}
      </div>

      {/* Add Measurement Form */}
      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Add {currentOption?.label} Measurement
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Value ({currentOption?.unit})
              </label>
              <input
                type="number"
                step="0.1"
                value={newMeasurement.value}
                onChange={(e) => setNewMeasurement(prev => ({ ...prev, value: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Enter value"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date
              </label>
              <input
                type="date"
                value={newMeasurement.date}
                onChange={(e) => setNewMeasurement(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Notes (optional)
              </label>
              <input
                type="text"
                value={newMeasurement.notes}
                onChange={(e) => setNewMeasurement(prev => ({ ...prev, notes: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Optional notes"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={addMeasurement}
              disabled={!newMeasurement.value}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
            >
              Add Measurement
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Current Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <Icon className={`w-6 h-6 ${currentOption?.color}`} />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Current {currentOption?.label}
            </h3>
          </div>
          {filteredMeasurements.length > 0 ? (
            <div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {filteredMeasurements[filteredMeasurements.length - 1].value}
                <span className="text-lg text-gray-500 dark:text-gray-400 ml-1">
                  {currentOption?.unit}
                </span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {new Date(filteredMeasurements[filteredMeasurements.length - 1].date).toLocaleDateString()}
              </div>
            </div>
          ) : (
            <div className="text-gray-500 dark:text-gray-400">
              No measurements yet
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            {trend?.direction === 'up' && <TrendingUp className="w-6 h-6 text-red-500" />}
            {trend?.direction === 'down' && <TrendingDown className="w-6 h-6 text-green-500" />}
            {trend?.direction === 'stable' && <Minus className="w-6 h-6 text-gray-500" />}
            {!trend && <Info className="w-6 h-6 text-gray-400" />}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Trend
            </h3>
          </div>
          {trend ? (
            <div>
              <div className={`text-2xl font-bold ${
                trend.direction === 'up' ? 'text-red-500' : 
                trend.direction === 'down' ? 'text-green-500' : 'text-gray-500'
              }`}>
                {trend.direction === 'up' ? '+' : trend.direction === 'down' ? '-' : ''}
                {trend.change.toFixed(1)} {currentOption?.unit}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {trend.percentage}% change
              </div>
            </div>
          ) : (
            <div className="text-gray-500 dark:text-gray-400">
              Need more data
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="w-6 h-6 text-purple-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Total Records
            </h3>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {filteredMeasurements.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            measurements recorded
          </div>
        </div>
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {currentOption?.label} Progress
          </h3>
          <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
            <div className="h-40 flex items-end">
              {chartData.slice(-15).map((item, index) => {
                if (measurements.length >= 3) {
                  const currentOption = metricOptions.find(m => m.value === selectedMetric);
                  return (
                    <BodyMeasurementChart 
                      measurements={measurements}
                      metric={selectedMetric}
                      metricLabel={currentOption?.label || ''}
                      metricUnit={currentOption?.unit || ''}
                      color={currentOption?.color.replace('text-', '#').replace('400', '500') || '#3b82f6'}
                    />
                  );
                } else {
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
                }
              })}
            </div>
          </div>
        </div>
      )}

      {/* Recent Measurements */}
      {filteredMeasurements.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent {currentOption?.label} Measurements
          </h3>
          <div className="space-y-3">
            {filteredMeasurements.slice(-10).reverse().map((measurement) => (
              <div
                key={measurement.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${currentOption?.color}`} />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {measurement.value} {measurement.unit}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(measurement.date).toLocaleDateString()}
                      {measurement.notes && ` • ${measurement.notes}`}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => deleteMeasurement(measurement.id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}