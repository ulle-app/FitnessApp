import React from 'react';

const FittrHart: React.FC = () => {
  return (
    <section className="py-20 bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-sm">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
          Introducing Heal Fitness Zone HART
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          The HRV And Recovery Tracker
        </p>
        <p className="max-w-2xl mx-auto text-gray-700 dark:text-gray-300 mb-10">
          Discover the groundbreaking technology that helps you optimise your sleep, improve your recovery, and unlock the secrets to longevity.
        </p>
        <div className="flex justify-center">
          <div className="w-full max-w-md bg-white/30 dark:bg-gray-700/30 backdrop-blur-md rounded-lg shadow-lg p-8 border border-white/20 dark:border-gray-500/20">
            {/* Placeholder for the heal fitness zone hart image */}
            <div className="bg-gray-200 dark:bg-gray-600 h-64 rounded-lg flex items-center justify-center">
              <span className="text-gray-500 dark:text-gray-400">Heal Fitness Zone HART Image</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FittrHart; 