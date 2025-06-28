import React, { useState } from 'react';

const dietTypes = [
  { label: 'Balanced', value: 'balanced' },
  { label: 'Low Carb', value: 'lowcarb' },
  { label: 'High Protein', value: 'highprotein' },
  { label: 'Custom', value: 'custom' },
];

function MacroCalculator() {
  const [tdee, setTdee] = useState('0');
  const [dietType, setDietType] = useState('');
  const [protein, setProtein] = useState(0);
  const [carbs, setCarbs] = useState(0);
  const [fats, setFats] = useState(0);

  return (
    <div className="bg-gray-50 dark:bg-gray-100 rounded-3xl shadow-2xl p-8 flex flex-col md:flex-row gap-8 max-w-5xl mx-auto mt-10 border border-gray-200">
      {/* Left: Form */}
      <div className="flex-1 min-w-[320px]">
        <h1 className="text-5xl font-extrabold mb-8 text-gray-900">Macro Calculator</h1>
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <label className="block text-gray-700 font-semibold mb-1">Enter your TDEE*</label>
            <div className="flex items-center gap-2">
              <input type="number" className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-lg font-medium" value={tdee} onChange={e => setTdee(e.target.value)} min={0} />
              <span className="text-gray-500 font-bold">kcal</span>
            </div>
          </div>
          <div className="flex-1">
            <label className="block text-gray-700 font-semibold mb-1">Choose your diet type*</label>
            <select className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-lg font-medium" value={dietType} onChange={e => setDietType(e.target.value)}>
              <option value="">--</option>
              {dietTypes.map(dt => <option key={dt.value} value={dt.value}>{dt.label}</option>)}
            </select>
          </div>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-gray-500"><b>i</b></span>
          <span className="text-gray-700 font-medium">What is TDEE?</span>
        </div>
        <a href="#" className="text-blue-600 font-semibold mb-6 block">I don't know my total calories per day</a>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-1">Protein</label>
          <div className="flex items-center gap-2">
            <input type="number" className="w-20 px-2 py-1 rounded border border-gray-300" value={protein} onChange={e => setProtein(Number(e.target.value))} min={0} max={100} />
            <span className="text-gray-500">%</span>
            <input type="range" min={0} max={100} value={protein} onChange={e => setProtein(Number(e.target.value))} className="flex-1 accent-red-300" />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-1">Carbohydrates</label>
          <div className="flex items-center gap-2">
            <input type="number" className="w-20 px-2 py-1 rounded border border-gray-300" value={carbs} onChange={e => setCarbs(Number(e.target.value))} min={0} max={100} />
            <span className="text-gray-500">%</span>
            <input type="range" min={0} max={100} value={carbs} onChange={e => setCarbs(Number(e.target.value))} className="flex-1 accent-green-400" />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-1">Fats</label>
          <div className="flex items-center gap-2">
            <input type="number" className="w-20 px-2 py-1 rounded border border-gray-300" value={fats} onChange={e => setFats(Number(e.target.value))} min={0} max={100} />
            <span className="text-gray-500">%</span>
            <input type="range" min={0} max={100} value={fats} onChange={e => setFats(Number(e.target.value))} className="flex-1 accent-yellow-200" />
          </div>
        </div>
      </div>
      {/* Right: Summary */}
      <div className="flex-1 bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center justify-center min-w-[320px]">
        <div className="text-center mb-8">
          <div className="text-gray-500 font-semibold mb-2">Calories</div>
          <div className="text-5xl font-extrabold text-gray-900">0</div>
        </div>
        <div className="text-gray-700 text-base text-center">
          <p className="mb-4">Macronutrients (or macros for short) are the nutrients that the human body needs in large quantities. Macros include fats, proteins, carbs, water, and fibre.</p>
          <p>A well-balanced intake of macronutrients is essential for your fitness goals. Fat contains 9 calories per gram, while protein and carbs each contain 4 calories per gram. Water and fibre do not provide energy.</p>
        </div>
      </div>
    </div>
  );
}

export default MacroCalculator; 