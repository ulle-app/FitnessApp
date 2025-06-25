import React from 'react';
import { Dumbbell, Apple, Heart, Shield } from 'lucide-react';
import { SERVICES } from '../utils/constants';

const iconMap = {
  Dumbbell,
  Apple,
  Heart,
  Shield,
};

const Services: React.FC = () => {
  return (
    <section id="services" className="py-20 bg-gray-50 dark:bg-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            How Heal Fitness Zone helps you
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            The right plan for your health. Choose the perfect plan for your fitness needs. Flexible and easy to follow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {SERVICES.map((service) => {
            const Icon = iconMap[service.icon as keyof typeof iconMap];
            
            return (
              <div
                key={service.id}
                className="bg-white/30 dark:bg-gray-700/30 backdrop-blur-md rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-8 flex border border-white/20 dark:border-gray-500/20"
              >
                <div className="mr-6">
                  <div className="w-16 h-16 bg-green-100/50 dark:bg-green-900/50 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Icon className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{service.title}</h3>
                  <p className="text-gray-800 dark:text-gray-300 mb-4">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <svg className="w-5 h-5 text-green-500 dark:text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
        <div className="text-center mt-16">
          <button className="bg-green-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 transition-all duration-200 text-lg">
            View Coaches
          </button>
        </div>
      </div>
    </section>
  );
};

export default Services;