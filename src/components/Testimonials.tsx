import React from 'react';
import { Quote } from 'lucide-react';
import { TESTIMONIALS } from '../utils/constants';

const Testimonials: React.FC = () => {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Client Testimonials
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Here's what some of our happy clients have to say
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TESTIMONIALS.slice(0, 5).map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white/30 dark:bg-gray-700/30 backdrop-blur-md rounded-lg shadow-lg p-8 flex flex-col items-center text-center border border-white/20 dark:border-gray-500/20"
            >
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-green-200 dark:border-green-400/50"
              />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{testimonial.name}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{testimonial.location}</p>
              <Quote className="w-8 h-8 text-green-500 dark:text-green-400 mb-4" />
              <p className="text-gray-800 dark:text-gray-300 italic">
                "{testimonial.text}"
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <button className="bg-green-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 transition-all duration-200 text-lg">
            Get free consultation
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;