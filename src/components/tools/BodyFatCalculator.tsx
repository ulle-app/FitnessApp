import React, { useState, useMemo } from 'react';
import { Info, ChevronDown, ArrowRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useBodyFat } from '../../context/BodyFatContext';
import { useSearchParams, useNavigate } from 'react-router-dom';

const units = [
  { label: 'cm', value: 'cm' },
  { label: 'in', value: 'in' },
];

const genders = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
];

function round(num: number, decimals = 1) {
  return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

function calculateBodyFat({ gender, waist, neck, height, hip, unit }: { gender: string; waist: number; neck: number; height: number; hip: number; unit: string; }) {
  let w = waist, n = neck, h = height, p = hip;
  if (unit === 'in') {
    w *= 2.54;
    n *= 2.54;
    h *= 2.54;
    p *= 2.54;
  }
  if (gender === 'male') {
    return round(495 / (1.0324 - 0.19077 * Math.log10(w - n) + 0.15456 * Math.log10(h)) - 450);
  } else {
    return round(495 / (1.29579 - 0.35004 * Math.log10(w + p - n) + 0.22100 * Math.log10(h)) - 450);
  }
}

const BodyFatCalculator: React.FC = () => {
  const { theme } = useTheme();
  const [gender, setGender] = useState('male');
  const [waist, setWaist] = useState('');
  const [neck, setNeck] = useState('');
  const [height, setHeight] = useState('');
  const [hip, setHip] = useState('');
  const [unit, setUnit] = useState('in');
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setBodyFat } = useBodyFat();

  const isFormValid = useMemo(() => {
    if (!waist || !neck || !height) return false;
    if (gender === 'female' && !hip) return false;
    return true;
  }, [waist, neck, height, hip, gender]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      setError('Please fill in all required fields.');
      return;
    }
    setError(null);
    const bf = calculateBodyFat({
      gender,
      waist: parseFloat(waist),
      neck: parseFloat(neck),
      height: parseFloat(height),
      hip: parseFloat(hip || '0'),
      unit,
    });
    setResult(bf);
  };

  const handleUseForBMR = () => {
    if (result !== null) {
      setBodyFat(result.toString());
      navigate('/bmr-calculator');
    }
  };

  const renderInputField = (label: string, value: string, onChange: (v: string) => void, placeholder: string) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
        placeholder={placeholder}
      />
    </div>
  );

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-8">
          <div className={`p-8 rounded-2xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Body Fat Calculator</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <label
                  className={`cursor-pointer p-4 rounded-lg text-center font-semibold transition-colors ${gender === 'male' ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
                  <input type="radio" name="gender" value="male" checked={gender === 'male'} onChange={() => setGender('male')} className="hidden" />
                  Male
                </label>
                <label
                  className={`cursor-pointer p-4 rounded-lg text-center font-semibold transition-colors ${gender === 'female' ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
                  <input type="radio" name="gender" value="female" checked={gender === 'female'} onChange={() => setGender('female')} className="hidden" />
                  Female
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {renderInputField('Height', height, setHeight, `e.g., 175`)}
                {renderInputField('Waist', waist, setWaist, `e.g., 80`)}
                {renderInputField('Neck', neck, setNeck, `e.g., 40`)}
                {gender === 'female' && renderInputField('Hip', hip, setHip, `e.g., 95`)}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Unit</label>
                <div className="flex rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
                  {units.map((u) => (
                    <button
                      key={u.value}
                      type="button"
                      onClick={() => setUnit(u.value)}
                      className={`flex-1 py-2 px-4 text-sm font-semibold transition-colors ${unit === u.value ? 'bg-green-500 text-white' : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white'}`}>
                      {u.label}
                    </button>
                  ))}
                </div>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={!isFormValid}
                className="w-full bg-green-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                Calculate <ArrowRight size={20} />
              </button>
            </form>
          </div>

          <div className={`p-8 rounded-2xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg text-center`}>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Your Result</h3>
            {result !== null ? (
              <>
                <p className="text-5xl font-extrabold text-green-500">{result}%</p>
                <p className="text-gray-600 dark:text-gray-300 mt-2">Body Fat Percentage</p>
                <div className="mt-6 text-left text-sm text-gray-600 dark:text-gray-400 space-y-2">
                  <p>Body fat percentage is a key indicator of good health. A high body fat percentage may put you at a higher risk of lifestyle diseases.</p>
                  <p>Males are advised to maintain their body fat level at 15% or lower, while females are advised to maintain their body fat level at 25% or lower.</p>
                </div>
                {searchParams.get('returnTo') === 'bmr' && (
                  <button
                    onClick={handleUseForBMR}
                    className="mt-6 w-full bg-blue-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Use for BMR Calculator
                  </button>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <p className="text-gray-500 dark:text-gray-400">Your body fat percentage will be displayed here.</p>
              </div>
            )}
          </div>
        </div>
    </div>
  );
};

export default BodyFatCalculator;