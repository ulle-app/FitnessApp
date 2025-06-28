import React from 'react';
import { Link } from 'react-router-dom';
import MacroCalculator from './tools/MacroCalculator';

const tools = [
  {
    title: 'BMR Calculator',
    description: 'Calculate your Basal Metabolic Rate and Total Daily Energy Expenditure',
    link: '/bmr-calculator',
    illustration: (
      // Cartoonish running figure with energy bar
      <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
        <ellipse cx="50" cy="90" rx="30" ry="8" fill="#bae6fd"/>
        <circle cx="50" cy="45" r="18" fill="#fbbf24" stroke="#f59e42" strokeWidth="2"/>
        <ellipse cx="50" cy="45" rx="10" ry="14" fill="#fffde7"/>
        <rect x="35" y="70" width="30" height="10" rx="5" fill="#34d399"/>
        <rect x="40" y="72" width="10" height="6" rx="3" fill="#38bdf8"/>
        <rect x="55" y="72" width="7" height="6" rx="3" fill="#facc15"/>
        <path d="M60 60 Q70 65 65 75" stroke="#f59e42" strokeWidth="3" fill="none"/>
        <circle cx="60" cy="60" r="3" fill="#f59e42"/>
        <path d="M40 60 Q30 65 35 75" stroke="#f59e42" strokeWidth="3" fill="none"/>
        <circle cx="40" cy="60" r="3" fill="#f59e42"/>
        <ellipse cx="50" cy="45" rx="3" ry="5" fill="#fbbf24"/>
        <circle cx="50" cy="45" r="2" fill="#fff"/>
      </svg>
    ),
  },
  {
    title: 'Body Fat Calculator',
    description: 'Calculate your fat percentage based on body measurements',
    link: '/body-fat-calculator',
    illustration: (
      // Cartoonish tape measure hugging a smiling body outline
      <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
        <ellipse cx="50" cy="80" rx="28" ry="10" fill="#fde68a"/>
        <ellipse cx="50" cy="50" rx="20" ry="28" fill="#fca5a5"/>
        <ellipse cx="50" cy="50" rx="14" ry="20" fill="#fff"/>
        <rect x="30" y="70" width="40" height="10" rx="5" fill="#fbbf24" stroke="#f59e42" strokeWidth="2"/>
        <rect x="35" y="73" width="6" height="4" rx="2" fill="#f59e42"/>
        <rect x="59" y="73" width="6" height="4" rx="2" fill="#f59e42"/>
        <path d="M40 60 Q50 70 60 60" stroke="#f59e42" strokeWidth="2" fill="none"/>
        <circle cx="50" cy="45" r="2" fill="#f59e42"/>
        <ellipse cx="44" cy="47" rx="1.5" ry="2" fill="#f59e42"/>
        <ellipse cx="56" cy="47" rx="1.5" ry="2" fill="#f59e42"/>
        <path d="M46 54 Q50 58 54 54" stroke="#f59e42" strokeWidth="1.5" fill="none"/>
      </svg>
    ),
  },
  {
    title: 'Macro Calculator',
    description: 'Calculate your daily protein, carbs and fat intake based on your goals',
    link: '/macro-calculator',
    illustration: (
      // Cartoonish happy food plate with macro icons
      <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
        <ellipse cx="50" cy="80" rx="28" ry="8" fill="#ddd6fe"/>
        <circle cx="50" cy="50" r="28" fill="#f3e8ff"/>
        <circle cx="50" cy="50" r="20" fill="#fff"/>
        <circle cx="40" cy="50" r="6" fill="#fbbf24"/>
        <circle cx="60" cy="50" r="6" fill="#34d399"/>
        <circle cx="50" cy="60" r="6" fill="#38bdf8"/>
        <path d="M44 44 Q50 48 56 44" stroke="#a78bfa" strokeWidth="2" fill="none"/>
        <ellipse cx="50" cy="65" rx="8" ry="3" fill="#a78bfa" fillOpacity="0.2"/>
        <ellipse cx="50" cy="50" rx="18" ry="18" fill="none" stroke="#a78bfa" strokeWidth="1.5"/>
        <circle cx="50" cy="50" r="2" fill="#a78bfa"/>
      </svg>
    ),
  },
];

const ToolsPage: React.FC = () => {
  return (
    <section className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 py-16 px-4">
      <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-12 text-gray-900 dark:text-white tracking-tight drop-shadow-lg">Other Calculators</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full">
        {tools.map((tool, idx) => (
          <div key={tool.title} className="liquid-glass dark:liquid-glass-dark rounded-3xl shadow-xl p-8 flex flex-col items-center border">
            <div className="mb-6">{tool.illustration}</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">{tool.title}</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">{tool.description}</p>
            <Link to={tool.link} className="w-full">
              <button className="w-full liquid-glass-btn bg-white/30 dark:bg-gray-900/30 rounded-full py-3 font-bold text-lg text-gray-900 dark:text-white hover:bg-white/50 dark:hover:bg-gray-800/50 shadow-xl transition-all">
                Calculate Now
              </button>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ToolsPage; 