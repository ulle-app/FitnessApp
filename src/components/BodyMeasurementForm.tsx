import React, { useState } from 'react';
import { 
  Scale, 
  Percent, 
  Heart, 
  Activity, 
  Zap, 
  Calendar, 
  BarChart, 
  Ruler, 
  Save, 
  X,
  Info
} from 'lucide-react';
import { useUser } from '../context/UserContext';

interface BodyMeasurementFormProps {
  userId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const BodyMeasurementForm: React.FC<BodyMeasurementFormProps> = ({ 
  userId, 
  onSuccess, 
  onCancel 
}) => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    weight: '',
    body_fat: '',
    visceral_fat: '',
    skeletal_muscle: '',
    resting_metabolism: '',
    body_age: '',
    bmi: '',
    subcutaneous_fat: '',
    waist_circumference: '',
    hip_circumference: '',
    waist_to_hip_ratio: '',
    notes: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculateBMI = () => {
    if (formData.weight && user?.height) {
      const weight = parseFloat(formData.weight);
      const height = parseFloat(user.height) / 100; // convert cm to m
      const bmi = (weight / (height * height)).toFixed(1);
      setFormData(prev => ({ ...prev, bmi }));
    }
  };

  const calculateWHR = () => {
    if (formData.waist_circumference && formData.hip_circumference) {
      const waist = parseFloat(formData.waist_circumference);
      const hip = parseFloat(formData.hip_circumference);
      const ratio = (waist / hip).toFixed(2);
      setFormData(prev => ({ ...prev, waist_to_hip_ratio: ratio }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/measurements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: userId,
          measured_by: user?.phone,
          measurement_date: new Date().toISOString(),
          ...formData
        })
      });

      const data = await response.json();
      
      if (data.success) {
        onSuccess();
      } else {
        setError(data.error || 'Failed to save measurements');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 rounded-2xl shadow-xl p-6 border border-gray-800 max-w-4xl w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Scale className="w-6 h-6 text-blue-400" />
          OMRON Body Measurements
        </h2>
        <button 
          onClick={onCancel}
          className="p-2 rounded-full hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="mb-6 p-4 bg-blue-900/30 rounded-xl border border-blue-800/50">
        <div className="flex items-start gap-2">
          <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-200">
            <p className="font-medium mb-1">OMRON Body Composition Monitor</p>
            <p>Enter measurements taken from the OMRON HBF-511B or similar device. These measurements help track the client's progress over time and provide valuable insights for personalized fitness plans.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Weight */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-300 flex items-center gap-1">
              <Scale className="w-4 h-4 text-blue-400" />
              Weight (kg)
            </label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              onBlur={calculateBMI}
              step="0.1"
              min="30"
              max="200"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 70.5"
            />
          </div>

          {/* Body Fat % */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-300 flex items-center gap-1">
              <Percent className="w-4 h-4 text-blue-400" />
              Body Fat %
            </label>
            <input
              type="number"
              name="body_fat"
              value={formData.body_fat}
              onChange={handleChange}
              step="0.1"
              min="5"
              max="60"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 22.5"
            />
          </div>

          {/* Visceral Fat */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-300 flex items-center gap-1">
              <Heart className="w-4 h-4 text-blue-400" />
              Visceral Fat Level
            </label>
            <input
              type="number"
              name="visceral_fat"
              value={formData.visceral_fat}
              onChange={handleChange}
              min="1"
              max="30"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 10"
            />
          </div>

          {/* Skeletal Muscle % */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-300 flex items-center gap-1">
              <Activity className="w-4 h-4 text-blue-400" />
              Skeletal Muscle %
            </label>
            <input
              type="number"
              name="skeletal_muscle"
              value={formData.skeletal_muscle}
              onChange={handleChange}
              step="0.1"
              min="10"
              max="50"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 32.5"
            />
          </div>

          {/* Resting Metabolism */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-300 flex items-center gap-1">
              <Zap className="w-4 h-4 text-blue-400" />
              Resting Metabolism (kcal)
            </label>
            <input
              type="number"
              name="resting_metabolism"
              value={formData.resting_metabolism}
              onChange={handleChange}
              min="500"
              max="3000"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 1500"
            />
          </div>

          {/* Body Age */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-300 flex items-center gap-1">
              <Calendar className="w-4 h-4 text-blue-400" />
              Body Age (years)
            </label>
            <input
              type="number"
              name="body_age"
              value={formData.body_age}
              onChange={handleChange}
              min="10"
              max="100"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 35"
            />
          </div>

          {/* BMI */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-300 flex items-center gap-1">
              <BarChart className="w-4 h-4 text-blue-400" />
              BMI
            </label>
            <input
              type="number"
              name="bmi"
              value={formData.bmi}
              onChange={handleChange}
              step="0.1"
              min="10"
              max="50"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 24.5"
            />
          </div>

          {/* Subcutaneous Fat % */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-300 flex items-center gap-1">
              <Percent className="w-4 h-4 text-blue-400" />
              Subcutaneous Fat %
            </label>
            <input
              type="number"
              name="subcutaneous_fat"
              value={formData.subcutaneous_fat}
              onChange={handleChange}
              step="0.1"
              min="5"
              max="60"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 18.5"
            />
          </div>

          {/* Waist Circumference */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-300 flex items-center gap-1">
              <Ruler className="w-4 h-4 text-blue-400" />
              Waist Circumference (cm)
            </label>
            <input
              type="number"
              name="waist_circumference"
              value={formData.waist_circumference}
              onChange={handleChange}
              onBlur={calculateWHR}
              step="0.1"
              min="50"
              max="200"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 85.5"
            />
          </div>

          {/* Hip Circumference */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-300 flex items-center gap-1">
              <Ruler className="w-4 h-4 text-blue-400" />
              Hip Circumference (cm)
            </label>
            <input
              type="number"
              name="hip_circumference"
              value={formData.hip_circumference}
              onChange={handleChange}
              onBlur={calculateWHR}
              step="0.1"
              min="50"
              max="200"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 95.5"
            />
          </div>

          {/* Waist-to-Hip Ratio */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-300 flex items-center gap-1">
              <BarChart className="w-4 h-4 text-blue-400" />
              Waist-to-Hip Ratio
            </label>
            <input
              type="number"
              name="waist_to_hip_ratio"
              value={formData.waist_to_hip_ratio}
              onChange={handleChange}
              step="0.01"
              min="0.5"
              max="2"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 0.85"
            />
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-300">Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Additional observations or recommendations..."
          />
        </div>

        {error && (
          <div className="p-3 bg-red-900/50 border border-red-800 rounded-lg text-red-200 text-sm">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:bg-blue-800 disabled:opacity-70"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Measurements
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BodyMeasurementForm;