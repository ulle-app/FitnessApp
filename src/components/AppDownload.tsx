import React from 'react';
import { Smartphone, Download, Star, Users, Activity } from 'lucide-react';

const AppDownload: React.FC = () => {
  const handleiOSDownload = () => {
    // Replace with your actual App Store URL
    window.open('https://apps.apple.com/app/healfitness-zone/id123456789', '_blank');
  };

  const handleAndroidDownload = () => {
    // Replace with your actual Google Play Store URL
    window.open('https://play.google.com/store/apps/details?id=com.healfitnesszone.app', '_blank');
  };

  return (
    <section className="py-12 md:py-20 bg-gradient-to-br from-gray-900 via-green-900 to-blue-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%224%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content */}
          <div className="text-white text-center lg:text-left order-2 lg:order-1">
            <div className="mb-4 md:mb-6">
              <span className="inline-block bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium">
                Download Our App
              </span>
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 leading-tight">
              Carry Your
              <br />
              <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                Healing Journey
              </span>
              <br />
              Everywhere
            </h2>
            
            <p className="text-lg md:text-xl text-white/80 mb-6 md:mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0">
              Get unlimited access to live workouts, personalized meal plans, 
              mindfulness sessions, and track your progress - all in one app.
            </p>

            {/* App Features - Mobile Optimized */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
              <div className="flex items-center space-x-3 justify-center lg:justify-start">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0">
                  <Activity className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-sm md:text-base">Live Workouts</div>
                  <div className="text-xs md:text-sm text-white/70">Real-time classes</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 justify-center lg:justify-start">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-sm md:text-base">Community</div>
                  <div className="text-xs md:text-sm text-white/70">Connect & motivate</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 justify-center lg:justify-start">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0">
                  <Star className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-sm md:text-base">Progress Tracking</div>
                  <div className="text-xs md:text-sm text-white/70">Detailed analytics</div>
                </div>
              </div>
            </div>

            {/* Download Buttons - Mobile Optimized */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 justify-center lg:justify-start">
              <button 
                onClick={handleiOSDownload}
                className="group bg-white text-gray-900 px-6 py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 min-h-[48px] touch-manipulation"
              >
                <Download className="w-5 h-5" />
                <span>Download for iOS</span>
              </button>
              
              <button 
                onClick={handleAndroidDownload}
                className="group bg-white/20 backdrop-blur-sm text-white border border-white/30 px-6 py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:bg-white/30 transition-all duration-200 min-h-[48px] touch-manipulation"
              >
                <Download className="w-5 h-5" />
                <span>Download for Android</span>
              </button>
            </div>

            {/* App Stats - Mobile Optimized */}
            <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-white/20">
              <div className="grid grid-cols-3 gap-4 md:gap-6 text-center">
                <div>
                  <div className="text-xl md:text-2xl font-bold">4.8★</div>
                  <div className="text-xs md:text-sm text-white/70">App Store Rating</div>
                </div>
                <div>
                  <div className="text-xl md:text-2xl font-bold">100K+</div>
                  <div className="text-xs md:text-sm text-white/70">Downloads</div>
                </div>
                <div>
                  <div className="text-xl md:text-2xl font-bold">50K+</div>
                  <div className="text-xs md:text-sm text-white/70">Active Users</div>
                </div>
              </div>
            </div>
          </div>

          {/* Phone Mockup - Mobile Optimized */}
          <div className="relative order-1 lg:order-2 flex justify-center">
            <div className="relative z-10">
              {/* Phone Frame */}
              <div className="w-64 h-[480px] md:w-80 md:h-[600px] mx-auto bg-gray-900 rounded-[2.5rem] md:rounded-[3rem] p-2 md:p-3 shadow-2xl">
                <div className="w-full h-full bg-white rounded-[2rem] md:rounded-[2.5rem] overflow-hidden relative">
                  {/* Screen Content */}
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-blue-500 p-4 md:p-6 flex flex-col">
                    {/* Status Bar */}
                    <div className="flex justify-between items-center text-white text-xs md:text-sm mb-6 md:mb-8">
                      <span>9:41</span>
                      <div className="flex space-x-1">
                        <div className="w-3 h-1.5 md:w-4 md:h-2 bg-white rounded-sm"></div>
                        <div className="w-3 h-1.5 md:w-4 md:h-2 bg-white rounded-sm"></div>
                        <div className="w-3 h-1.5 md:w-4 md:h-2 bg-white rounded-sm"></div>
                      </div>
                    </div>

                    {/* App Interface */}
                    <div className="flex-1 flex flex-col justify-center items-center text-white text-center">
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 md:mb-6">
                        <Smartphone className="w-8 h-8 md:w-10 md:h-10" />
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold mb-1 md:mb-2">Welcome to</h3>
                      <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">HealFitness Zone</h3>
                      <p className="text-white/80 mb-4 md:mb-6 text-sm md:text-base">Your personal wellness companion</p>
                      
                      {/* Mock Interface Elements */}
                      <div className="w-full space-y-2 md:space-y-3">
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 md:p-3 flex items-center justify-between">
                          <span className="text-xs md:text-sm">Today's Workout</span>
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 md:p-3 flex items-center justify-between">
                          <span className="text-xs md:text-sm">Nutrition Plan</span>
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 md:p-3 flex items-center justify-between">
                          <span className="text-xs md:text-sm">Mindfulness Session</span>
                          <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements - Hidden on mobile for better performance */}
            <div className="hidden md:block absolute -top-4 -left-4 w-20 h-20 bg-green-500/20 backdrop-blur-sm rounded-full animate-float"></div>
            <div className="hidden md:block absolute -bottom-4 -right-4 w-16 h-16 bg-blue-500/20 backdrop-blur-sm rounded-full animate-float-delayed"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppDownload;