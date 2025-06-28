import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useBodyFat } from '../../context/BodyFatContext';

const activityLevels = [
  { label: 'Sedentary (little or no exercise)', value: 1.2 },
  { label: 'Lightly active (light exercise/sports 1-3 days/week)', value: 1.375 },
  { label: 'Moderately active (moderate exercise/sports 3-5 days/week)', value: 1.55 },
  { label: 'Very active (hard exercise/sports 6-7 days a week)', value: 1.725 },
  { label: 'Super active (very hard exercise & physical job)', value: 1.9 },
];

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

function calculateBodyFat({ gender, waist, neck, height, hip, unit }: { gender: string; waist: number; neck: number; height: number; hip?: number; unit: string; }) {
  // Convert to cm if needed
  let w = waist, n = neck, h = height, hp = hip;
  if (unit === 'in') {
    w = w * 2.54;
    n = n * 2.54;
    h = h * 2.54;
    if (hp) hp = hp * 2.54;
  }
  if (gender === 'male') {
    // US Navy formula for men
    return round(495 / (1.0324 - 0.19077 * Math.log10(w - n) + 0.15456 * Math.log10(h)) - 450);
  } else if (gender === 'female' && hp) {
    // US Navy formula for women
    return round(495 / (1.29579 - 0.35004 * Math.log10(w + hp - n) + 0.22100 * Math.log10(h)) - 450);
  }
  return null;
}

const BodyFatCalculator: React.FC = () => {
  const { theme } = useTheme();
  const [gender, setGender] = useState('male');
  const [waist, setWaist] = useState('');
  const [waistUnit, setWaistUnit] = useState('in');
  const [height, setHeight] = useState('');
  const [heightUnit, setHeightUnit] = useState('cm');
  const [neck, setNeck] = useState('');
  const [neckUnit, setNeckUnit] = useState('in');
  const [hip, setHip] = useState('');
  const [hipUnit, setHipUnit] = useState('in');
  const [result, setResult] = useState<number|null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (!waist || !height || !neck || (gender === 'female' && !hip)) return;
    const bf = calculateBodyFat({
      gender,
      waist: parseFloat(waist),
      neck: parseFloat(neck),
      height: parseFloat(height),
      hip: gender === 'female' ? parseFloat(hip) : undefined,
      unit: waistUnit, // assume all units are the same for now
    });
    setResult(bf);
  };

  return (
    <div className={`liquid-glass dark:liquid-glass-dark rounded-3xl shadow-2xl p-8 border w-full max-w-xl mx-auto mb-8`}> 
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">Body Fat % Calculator</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 md:items-end">
          <div className="flex-1">
            <label className="block text-lg font-semibold text-gray-700 dark:text-white mb-1">Gender<span className="text-red-500">*</span></label>
            <select value={gender} onChange={e=>setGender(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-500 bg-white/90 dark:bg-gray-800/90 text-lg font-medium text-gray-900 dark:text-white">
              {genders.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-lg font-semibold text-gray-700 dark:text-white mb-1">Waist<span className="text-red-500">*</span></label>
            <div className="flex gap-2">
              <input type="number" min="10" value={waist} onChange={e=>setWaist(e.target.value)} className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-500 bg-white/90 dark:bg-gray-800/90 text-lg font-medium text-gray-900 dark:text-white" placeholder="Waist" />
              <select value={waistUnit} onChange={e=>setWaistUnit(e.target.value)} className="px-2 py-2 rounded-lg border border-gray-300 dark:border-gray-500 bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-white">
                {units.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
              </select>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4 md:items-end">
          <div className="flex-1">
            <label className="block text-lg font-semibold text-gray-700 dark:text-white mb-1">Height<span className="text-red-500">*</span></label>
            <div className="flex gap-2">
              <input type="number" min="50" value={height} onChange={e=>setHeight(e.target.value)} className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-500 bg-white/90 dark:bg-gray-800/90 text-lg font-medium text-gray-900 dark:text-white" placeholder="Height" />
              <select value={heightUnit} onChange={e=>setHeightUnit(e.target.value)} className="px-2 py-2 rounded-lg border border-gray-300 dark:border-gray-500 bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-white">
                {units.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
              </select>
            </div>
          </div>
          <div className="flex-1">
            <label className="block text-lg font-semibold text-gray-700 dark:text-white mb-1">Neck Circumference<span className="text-red-500">*</span></label>
            <div className="flex gap-2">
              <input type="number" min="10" value={neck} onChange={e=>setNeck(e.target.value)} className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-500 bg-white/90 dark:bg-gray-800/90 text-lg font-medium text-gray-900 dark:text-white" placeholder="Neck" />
              <select value={neckUnit} onChange={e=>setNeckUnit(e.target.value)} className="px-2 py-2 rounded-lg border border-gray-300 dark:border-gray-500 bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-white">
                {units.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
              </select>
            </div>
          </div>
        </div>
        {gender === 'female' && (
          <div className="flex flex-col md:flex-row gap-4 md:items-end">
            <div className="flex-1">
              <label className="block text-lg font-semibold text-gray-700 dark:text-white mb-1">Hip Circumference<span className="text-red-500">*</span></label>
              <div className="flex gap-2">
                <input type="number" min="10" value={hip} onChange={e=>setHip(e.target.value)} className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-500 bg-white/90 dark:bg-gray-800/90 text-lg font-medium text-gray-900 dark:text-white" placeholder="Hip" />
                <select value={hipUnit} onChange={e=>setHipUnit(e.target.value)} className="px-2 py-2 rounded-lg border border-gray-300 dark:border-gray-500 bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-white">
                  {units.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
                </select>
              </div>
            </div>
          </div>
        )}
        <div className="flex justify-end mt-4">
          <button type="submit" className="w-full liquid-glass-btn bg-white/30 dark:bg-gray-900/30 rounded-full py-4 font-bold text-lg text-gray-900 dark:text-white transition-all duration-200 hover:bg-white/50 dark:hover:bg-gray-800/50 shadow-xl">
            Calculate
          </button>
        </div>
      </form>
      <div className="mt-8 liquid-glass dark:liquid-glass-dark rounded-2xl p-6 text-center shadow-lg border">
        <h3 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">Your Body Fat %</h3>
        <div className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">{submitted && result !== null ? result : '--'} <span className="text-lg font-medium">%</span></div>
        <p className="text-gray-700 dark:text-gray-300 mt-4 text-base">Body fat percentage is a key indicator of good health. A high body fat percentage may put you at a higher risk of lifestyle diseases. Males are advised to maintain their body fat level at 15% or lower, while females are advised to maintain their body fat level at 25% or lower.</p>
      </div>
    </div>
  );
};

const BMRCalculator: React.FC = () => {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bodyFat, setBodyFat] = useState('');
  const [activity, setActivity] = useState(activityLevels[0].value);
  const [bmr, setBmr] = useState<number | null>(null);
  const [tdee, setTdee] = useState<number | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { theme } = useTheme();
  const bodyFatInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { bodyFat: contextBodyFat, clearBodyFat } = useBodyFat();
  const [formulaUsed, setFormulaUsed] = useState<string>('');

  useEffect(() => {
    if (contextBodyFat) {
      setBodyFat(contextBodyFat);
      clearBodyFat();
      setTimeout(() => {
        bodyFatInputRef.current?.focus();
      }, 100);
    }
  }, [contextBodyFat, clearBodyFat]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    const a = Number(age);
    const h = Number(height);
    const w = Number(weight);
    const bf = Number(bodyFat);
    if (!age) newErrors.age = 'Age is required.';
    else if (isNaN(a) || a < 10 || a > 100) newErrors.age = 'Enter a valid age (10-100).';
    if (!height) newErrors.height = 'Height is required.';
    else if (isNaN(h) || h < 100 || h > 250) newErrors.height = 'Enter a valid height (100-250 cm).';
    if (!weight) newErrors.weight = 'Weight is required.';
    else if (isNaN(w) || w < 30 || w > 250) newErrors.weight = 'Enter a valid weight (30-250 kg).';
    if (!bodyFat) newErrors.bodyFat = 'Body Fat % is required.';
    else if (isNaN(bf) || bf < 5 || bf > 60) newErrors.bodyFat = 'Enter a valid Body Fat % (5-60).';
    return newErrors;
  };

  const calculateBMR = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseFloat(age);
    const bf = parseFloat(bodyFat);
    let bmrValue = 0;
    let formula = '';
    if (!isNaN(bf) && bf > 0) {
      const leanMass = w * (1 - bf / 100);
      bmrValue = 370 + 21.6 * leanMass;
      formula = 'Katch-McArdle';
    } else {
      if (gender === 'male') {
        bmrValue = 10 * w + 6.25 * h - 5 * a + 5;
      } else {
        bmrValue = 10 * w + 6.25 * h - 5 * a - 161;
      }
      formula = 'Mifflin-St Jeor';
    }
    setBmr(Math.round(bmrValue));
    setTdee(Math.round(bmrValue * activity));
    setFormulaUsed(formula);
  };

  return (
    <div className={`glass dark:glass-dark rounded-3xl shadow-2xl p-8 border border-white/30 dark:border-gray-700/60 w-full`}> 
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">BMR & TDEE Calculator</h2>
        <form onSubmit={calculateBMR} className="space-y-7">
          <div className="flex items-center justify-center gap-8">
            <label className={`cursor-pointer px-6 py-3 rounded-xl font-bold text-lg transition-colors duration-200 ${gender==='male' ? 'bg-green-500 text-white shadow-lg' : 'bg-white/40 dark:bg-gray-800/40 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-700'}`}> 
              <input type="radio" name="gender" value="male" checked={gender==='male'} onChange={()=>setGender('male')} className="hidden" />
              Male
            </label>
            <label className={`cursor-pointer px-6 py-3 rounded-xl font-bold text-lg transition-colors duration-200 ${gender==='female' ? 'bg-green-500 text-white shadow-lg' : 'bg-white/40 dark:bg-gray-800/40 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-700'}`}> 
              <input type="radio" name="gender" value="female" checked={gender==='female'} onChange={()=>setGender('female')} className="hidden" />
              Female
            </label>
          </div>
          <div className="flex gap-6">
            <div className="flex-1">
              <label className="block text-gray-700 dark:text-white mb-2 text-lg font-semibold">Age</label>
              <input
                type="number"
                min="10"
                max="100"
                value={age}
                onChange={e=>setAge(e.target.value)}
                className={`w-full px-5 py-3 rounded-xl border ${errors.age ? 'border-red-500' : 'border-gray-300 dark:border-gray-500'} bg-white/80 dark:bg-gray-800/80 focus:outline-none focus:ring-2 ${errors.age ? 'focus:ring-red-400' : 'focus:ring-green-400'} text-lg font-medium placeholder-gray-400 dark:placeholder-gray-400 text-gray-900 dark:text-white`}
                placeholder="Enter age"
                aria-invalid={!!errors.age}
                aria-describedby={errors.age ? 'age-error' : undefined}
              />
              {errors.age && <div id="age-error" className="text-red-500 text-sm mt-1">{errors.age}</div>}
            </div>
            <div className="flex-1">
              <label className="block text-gray-700 dark:text-white mb-2 text-lg font-semibold">Height (cm)</label>
              <input
                type="number"
                min="100"
                max="250"
                value={height}
                onChange={e=>setHeight(e.target.value)}
                className={`w-full px-5 py-3 rounded-xl border ${errors.height ? 'border-red-500' : 'border-gray-300 dark:border-gray-500'} bg-white/80 dark:bg-gray-800/80 focus:outline-none focus:ring-2 ${errors.height ? 'focus:ring-red-400' : 'focus:ring-green-400'} text-lg font-medium placeholder-gray-400 dark:placeholder-gray-400 text-gray-900 dark:text-white`}
                placeholder="Enter height"
                aria-invalid={!!errors.height}
                aria-describedby={errors.height ? 'height-error' : undefined}
              />
              {errors.height && <div id="height-error" className="text-red-500 text-sm mt-1">{errors.height}</div>}
            </div>
          </div>
          <div className="flex gap-6">
            <div className="flex-1">
              <label className="block text-gray-700 dark:text-white mb-2 text-lg font-semibold">Weight (kg)</label>
              <input
                type="number"
                min="30"
                max="250"
                value={weight}
                onChange={e=>setWeight(e.target.value)}
                className={`w-full px-5 py-3 rounded-xl border ${errors.weight ? 'border-red-500' : 'border-gray-300 dark:border-gray-500'} bg-white/80 dark:bg-gray-800/80 focus:outline-none focus:ring-2 ${errors.weight ? 'focus:ring-red-400' : 'focus:ring-green-400'} text-lg font-medium placeholder-gray-400 dark:placeholder-gray-400 text-gray-900 dark:text-white`}
                placeholder="Enter weight"
                aria-invalid={!!errors.weight}
                aria-describedby={errors.weight ? 'weight-error' : undefined}
              />
              {errors.weight && <div id="weight-error" className="text-red-500 text-sm mt-1">{errors.weight}</div>}
            </div>
            <div className="flex-1 flex flex-col justify-end">
              <div className="flex items-end gap-2">
                <input
                  ref={bodyFatInputRef}
                  type="number"
                  min="5"
                  max="60"
                  placeholder="Body Fat %"
                  value={bodyFat}
                  onChange={e=>setBodyFat(e.target.value)}
                  className={`w-full px-5 py-3 rounded-xl border ${errors.bodyFat ? 'border-red-500' : 'border-gray-300 dark:border-gray-500'} bg-white/80 dark:bg-gray-800/80 focus:outline-none focus:ring-2 ${errors.bodyFat ? 'focus:ring-red-400' : 'focus:ring-green-400'} text-lg font-medium placeholder-gray-400 dark:placeholder-gray-400 text-gray-900 dark:text-white`}
                  aria-invalid={!!errors.bodyFat}
                  aria-describedby={errors.bodyFat ? 'bodyfat-error' : undefined}
                />
                <button
                  type="button"
                  className="ml-2 text-xs font-semibold text-green-600 dark:text-green-400 underline hover:text-green-700 dark:hover:text-green-300 transition-colors"
                  onClick={() => navigate('/body-fat-calculator?returnTo=bmr')}
                >
                  I don't know
                </button>
              </div>
              {errors.bodyFat && <div id="bodyfat-error" className="text-red-500 text-sm mt-1">{errors.bodyFat}</div>}
              <span className="text-xs mt-1 text-gray-500 dark:text-gray-400">Body Fat % is required for accurate BMR calculation.</span>
            </div>
          </div>
          <div className="flex gap-6">
            <div className="flex-1">
              <label className="block text-gray-700 dark:text-white mb-2 text-lg font-semibold">Activity Level</label>
              <div className="relative">
                <select
                  value={activity}
                  onChange={e => setActivity(Number(e.target.value))}
                  className="w-full appearance-none px-6 py-4 rounded-full border border-white/30 dark:border-gray-700/60 bg-white/40 dark:bg-gray-900/40 liquid-glass dark:liquid-glass-dark shadow-md focus:outline-none focus:ring-2 focus:ring-green-400 text-lg font-bold text-gray-900 dark:text-white transition-all duration-200 pr-12 hover:bg-white/60 dark:hover:bg-gray-800/60"
                  style={{ WebkitAppearance: 'none', MozAppearance: 'none' }}
                >
                  {activityLevels.map((level) => (
                    <option key={level.value} value={level.value} className="text-lg text-gray-900 dark:text-white bg-white dark:bg-gray-800">
                      {level.label}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 flex items-center">
                  <ChevronDown className="w-6 h-6 text-gray-400 dark:text-gray-300" />
                </span>
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="w-full liquid-glass-btn bg-white/30 dark:bg-gray-900/30 rounded-full py-5 font-bold text-xl text-gray-900 dark:text-white transition-all duration-200 hover:bg-white/50 dark:hover:bg-gray-800/50 shadow-2xl mt-8 tracking-wide"
            style={{ letterSpacing: '0.04em' }}
          >
            Calculate
          </button>
        </form>
        {bmr !== null && tdee !== null && (
          <div className="mt-10 liquid-glass dark:liquid-glass-dark rounded-2xl p-8 text-center shadow-xl border">
            <h3 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">Your BMR & TDEE</h3>
            <div className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">BMR: {bmr} kcal</div>
            <div className="text-2xl font-bold text-gray-700 dark:text-gray-200 mb-2">TDEE: {tdee} kcal</div>
            <p className="text-gray-700 dark:text-gray-300 mt-4 text-base">BMR is your Basal Metabolic Rate. TDEE is your Total Daily Energy Expenditure based on your activity level.</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">Formula used: <span className="font-semibold">{formulaUsed}</span></p>
            {formulaUsed === 'Katch-McArdle' && (
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">(Uses your body fat % for more accuracy)</p>
            )}
            {formulaUsed === 'Mifflin-St Jeor' && (
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">(Standard formula for most people)</p>
            )}
          </div>
        )}
    </div>
  );
};

export default BMRCalculator;