import React from 'react';
import { Play, ArrowRight, Users, MapPin, Star } from 'lucide-react';

const Hero: React.FC = () => {
  const handleExploreHealPass = () => {
    const healPassSection = document.getElementById('healpass');
    if (healPassSection) {
      healPassSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-14 md:pt-16">
      {/* Dynamic Background with Video Effect */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-gradient-to-br from-green-600 via-blue-600 to-purple-600 opacity-90"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.3%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%224%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] animate-pulse"></div>
        </div>
      </div>

      {/* Floating Elements - Hidden on mobile for better performance */}
      <div className="hidden md:block absolute top-20 left-10 animate-float">
        <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
          <Users className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className="hidden md:block absolute top-40 right-20 animate-float-delayed">
        <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
          <Star className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className="hidden md:block absolute bottom-32 left-16 animate-float">
        <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
          <MapPin className="w-5 h-5 text-white" />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-8">
        <div className="mb-4 md:mb-6">
          <span className="inline-block bg-white/20 backdrop-blur-sm text-white px-4 py-2 md:px-6 md:py-3 rounded-full text-xs md:text-sm font-medium border border-white/30">
            India's #1 Healing Fitness Platform
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 md:mb-6 leading-tight">
          Transform Your Body,
          <br />
          <span className="bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Heal Your Mind
          </span>
        </h1>

        <p className="text-lg md:text-xl lg:text-2xl text-white/90 mb-6 md:mb-8 leading-relaxed max-w-3xl mx-auto px-4">
          Join the HealFitness movement - where fitness meets healing,
          <br className="hidden md:block" />
          and transformation becomes a way of life
        </p>

        {/* CTA Buttons - Mobile Optimized */}
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-8 md:mb-12">
          <button 
            onClick={handleExploreHealPass}
            className="group bg-white text-gray-900 px-6 py-3 md:px-8 md:py-4 rounded-full font-bold text-base md:text-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center space-x-2 min-h-[48px] touch-manipulation w-full sm:w-auto justify-center"
          >
            <span>EXPLORE HEALPASS</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button className="group flex items-center space-x-3 text-white hover:text-green-300 transition-colors min-h-[48px] touch-manipulation">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors border border-white/30">
              <Play className="w-5 h-5 md:w-6 md:h-6 ml-1" />
            </div>
            <span className="font-semibold text-sm md:text-base">Watch Our Story</span>
          </button>
        </div>

        {/* Stats - Mobile Optimized */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1 md:mb-2">50K+</div>
            <div className="text-white/80 text-xs md:text-sm">Happy Members</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1 md:mb-2">100+</div>
            <div className="text-white/80 text-xs md:text-sm">Expert Trainers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1 md:mb-2">25+</div>
            <div className="text-white/80 text-xs md:text-sm">Cities</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1 md:mb-2">4.8★</div>
            <div className="text-white/80 text-xs md:text-sm">App Rating</div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator - Hidden on mobile */}
      <div className="hidden md:block absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;