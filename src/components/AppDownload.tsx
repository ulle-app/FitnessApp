import React from 'react';

const AppDownload: React.FC = () => {
  return (
    <section className="py-20 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
          Introducing the Heal Fitness Zone app
        </h2>
        <p className="max-w-3xl mx-auto text-gray-700 dark:text-gray-300 mb-10 text-lg">
          Coaches, Community, Customised Plans. Plus loads of free tools like Calorie Counter, Diet Tool, Step Counter, Water Reminder, Exercise Library, Articles, and much more!
        </p>
        <div className="flex justify-center">
          {/* Placeholder for an image of the app */}
          <div className="w-full max-w-4xl bg-gray-200/50 dark:bg-gray-700/50 backdrop-blur-md border border-white/20 dark:border-gray-500/20 h-80 rounded-lg flex items-center justify-center mb-10">
            <span className="text-gray-500 dark:text-gray-400">App Screenshot/Mockup</span>
          </div>
        </div>
        <button className="bg-green-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 transition-all duration-200 text-lg">
          Get the app
        </button>
      </div>
    </section>
  );
};

export default AppDownload;