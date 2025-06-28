import React from 'react';
import { SERVICES } from '../utils/constants';

const cardConfig = [
  // 1. Fitness & Nutrition
  { colSpan: 'lg:col-span-2', size: 'large' },
  // 2. Yoga & Meditation
  { colSpan: 'lg:col-span-1', size: 'small' },
  // 3. Mental Wellness
  { colSpan: 'lg:col-span-1', size: 'small' },
  // 4. Sleep Coaching
  { colSpan: 'lg:col-span-1', size: 'small' },
  // 5. Habit & Lifestyle
  { colSpan: 'lg:col-span-1', size: 'small' },
  // 6. Supportive Community
  { colSpan: 'lg:col-span-3', size: 'large' },
  // 7. Preventive Health
  { colSpan: 'lg:col-span-1', size: 'small' },
  // 8. Family Wellness
  { colSpan: 'lg:col-span-2', size: 'large' },
  // 9. Spiritual Wellness
  { colSpan: 'lg:col-span-3', size: 'large' },
  // 10. Kids Wellness & Arts
  { colSpan: 'lg:col-span-3', size: 'large' },
];

const Services: React.FC = () => {
  return (
    <section id="services" className="py-20 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            How Heal Fitness Zone helps you
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            A 360° approach to wellness. Discover our range of services designed for your body, mind, and soul.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service, index) => {
            const config = cardConfig[index] || { colSpan: 'lg:col-span-1', size: 'small' };
            const isLarge = config.size === 'large';
            
            return (
              <div
                key={service.id}
                className={`group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 ease-in-out min-h-[480px] ${config.colSpan}`}
              >
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                
                <div className="relative p-8 h-full flex flex-col justify-end text-white">
                  <h3 className={`${isLarge ? 'text-4xl' : 'text-3xl'} font-bold mb-3`}>
                    {service.title}
                  </h3>
                  <p className={`${isLarge ? 'text-base' : 'text-sm'} opacity-90`}>
                    {service.description}
                  </p>
                  <div className="mt-4 opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-96 transition-all duration-300 ease-in-out">
                    <ul className="space-y-2">
                      {service.features.slice(0, 3).map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm">
                           <svg className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="text-center mt-16">
          <button className="bg-green-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 transition-all duration-200 text-lg">
            Explore All Services
          </button>
        </div>
      </div>
    </section>
  );
};

export default Services;