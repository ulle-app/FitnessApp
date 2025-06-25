import React from 'react';
import { Heart, Facebook, Twitter, Instagram, Linkedin, Mail, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">Join us on our mission to make 50 million people fit!</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand & Social */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Heal Fitness Zone</span>
            </div>
            <div className="flex items-center space-x-3 mb-6">
              <Mail className="w-5 h-5 text-green-500" />
              <span className="text-gray-400">support@healfitnesszone.com</span>
            </div>
            <div className="flex items-center space-x-3 mb-6">
              <Phone className="w-5 h-5 text-green-500" />
              <span className="text-gray-400">(08888003430)</span>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"><Linkedin className="w-5 h-5" /></a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"><Twitter className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Company</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Become a Coach</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help & Support</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Learn</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Services</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Online Coaching</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Corporate Wellness</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Fitness & Nutrition Courses</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Weight Loss Diet Plan</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Diabetes Lifestyle Management</a></li>
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Tools</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">BMR Calculator</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Macro Calculator</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Body Fat Calculator</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">1RM Calculator</a></li>
            </ul>
          </div>
        </div>
        
        <div className="text-center mt-12">
            <h3 className="text-lg font-semibold mb-4">DOWNLOAD Heal Fitness Zone</h3>
            <div className="flex justify-center space-x-4">
              <button className="bg-gray-800 border border-gray-700 px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-gray-700 transition-colors">
                {/* Placeholder for Play Store Icon */}
                <span className="text-2xl">▶</span>
                <span>Android</span>
              </button>
              <button className="bg-gray-800 border border-gray-700 px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-gray-700 transition-colors">
                {/* Placeholder for Apple Icon */}
                <span className="text-2xl"></span>
                <span>iOS</span>
              </button>
            </div>
          </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 Heal Fitness Zone. All rights reserved
            </div>
            <div className="flex space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Terms & Conditions</a>
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Warranty Policy</a>
              <a href="#" className="hover:text-white transition-colors">Return & Refund Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;