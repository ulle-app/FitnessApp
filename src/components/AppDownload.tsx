import React from 'react';
import { Smartphone, Download, Star, Users, Activity } from 'lucide-react';

const AppDownload: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-green-900 to-blue-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%224%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-white">
            <div className="mb-6">
              <span className="inline-block bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
                Download Our App
              </span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Carry Your
              <br />
              <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                Healing Journey
              </span>
              <br />
              Everywhere
            </h2>
            
            <p className="text-xl text-white/80 mb-8 leading-relaxed">
              Get unlimited access to live workouts, personalized meal plans, 
              mindfulness sessions, and track your progress - all in one app.
            </p>

            {/* App Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-semibold">Live Workouts</div>
                  <div className="text-sm text-white/70">Real-time classes</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-semibold">Community</div>
                  <div className="text-sm text-white/70">Connect & motivate</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-semibold">Progress Tracking</div>
                  <div className="text-sm text-white/70">Detailed analytics</div>
                </div>
              </div>
            </div>

            {/* Download Buttons */}
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button className="group bg-white text-gray-900 px-6 py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200">
                <Download className="w-5 h-5" />
                <span>Download for iOS</span>
              </button>
              
              <button className="group bg-white/20 backdrop-blur-sm text-white border border-white/30 px-6 py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:bg-white/30 transition-all duration-200">
                <Download className="w-5 h-5" />
                <span>Download for Android</span>
              </button>
            </div>

            {/* App Stats */}
            <div className="mt-8 pt-8 border-t border-white/20">
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">4.8★</div>
                  <div className="text-sm text-white/70">App Store Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">100K+</div>
                  <div className="text-sm text-white/70">Downloads</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">50K+</div>
                  <div className="text-sm text-white/70">Active Users</div>
                </div>
              </div>
            </div>
          </div>

          {/* Phone Mockup */}
          <div className="relative">
            <div className="relative z-10">
              {/* Phone Frame */}
              <div className="w-80 h-[600px] mx-auto bg-gray-900 rounded-[3rem] p-3 shadow-2xl">
                <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
                  {/* Screen Content */}
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-blue-500 p-6 flex flex-col">
                    {/* Status Bar */}
                    <div className="flex justify-between items-center text-white text-sm mb-8">
                      <span>9:41</span>
                      <div className="flex space-x-1">
                        <div className="w-4 h-2 bg-white rounded-sm"></div>
                        <div className="w-4 h-2 bg-white rounded-sm"></div>
                        <div className="w-4 h-2 bg-white rounded-sm"></div>
                      </div>
                    </div>

                    {/* App Interface */}
                    <div className="flex-1 flex flex-col justify-center items-center text-white text-center">
                      <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-6">
                        <Smartphone className="w-10 h-10" />
                      </div>
                      <h3 className="text-2xl font-bold mb-2">Welcome to</h3>
                      <h3 className="text-2xl font-bold mb-4">HealFitness Zone</h3>
                      <p className="text-white/80 mb-6">Your personal wellness companion</p>
                      
                      {/* Mock Interface Elements */}
                      <div className="w-full space-y-3">
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 flex items-center justify-between">
                          <span className="text-sm">Today's Workout</span>
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 flex items-center justify-between">
                          <span className="text-sm">Nutrition Plan</span>
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 flex items-center justify-between">
                          <span className="text-sm">Mindfulness Session</span>
                          <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -left-4 w-20 h-20 bg-green-500/20 backdrop-blur-sm rounded-full animate-float"></div>
            <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-blue-500/20 backdrop-blur-sm rounded-full animate-float-delayed"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppDownload;