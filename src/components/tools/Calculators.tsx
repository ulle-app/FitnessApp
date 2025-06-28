import React from 'react';
import BMRCalculator from './BMRCalculator';
import BodyFatCalculator from './BodyFatCalculator';

const Calculators: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">Fitness Calculators</h1>
        <div className="flex flex-col lg:flex-row gap-12 justify-center items-start">
          <div className="w-full lg:w-1/2">
            <BodyFatCalculator />
          </div>
          <div className="w-full lg:w-1/2">
            <BMRCalculator />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculators;