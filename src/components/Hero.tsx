import React, { useRef, useState } from 'react';
import video1 from '../assets/videos/video1.mp4';
import video2 from '../assets/videos/video2.mp4';
import video3 from '../assets/videos/video3.mp4';
import { Apple } from 'lucide-react';
import SignUp from './SignUp';
import ModernSignUp from './ModernSignUp';

const videos = [video1, video2, video3];

// Google Play SVG (inline for color)
const GooglePlaySVG = () => (
  <svg width="28" height="28" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
    <g>
      <polygon fill="#FFD400" points="186.5,255.8 48.6,393.7 277.1,322.1"/>
      <polygon fill="#FF3333" points="48.6,118.3 186.5,255.8 277.1,189.5"/>
      <polygon fill="#48FF48" points="48.6,393.7 186.5,255.8 48.6,118.3"/>
      <polygon fill="#00C3FF" points="277.1,189.5 277.1,322.1 463.4,256.1"/>
    </g>
  </svg>
);

const Hero: React.FC = () => {
  const [currentVideo, setCurrentVideo] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showModernSignUp, setShowModernSignUp] = useState(false);

  const handleVideoEnd = () => {
    setCurrentVideo((prev) => (prev + 1) % videos.length);
  };

  const handleAppDownload = () => {
    const appSection = document.getElementById('app-download');
    if (appSection) {
      appSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <div className="absolute inset-0 z-0">
        <video
          key={currentVideo}
          ref={videoRef}
          autoPlay
          loop={false}
          muted
          className="w-full h-full object-cover"
          onEnded={handleVideoEnd}
        >
          <source src={videos[currentVideo]} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center w-full">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white text-center drop-shadow-lg mb-6">Start Your Fitness Journey</h1>
        <p className="text-lg md:text-2xl text-white/90 text-center mb-8 max-w-2xl">Join Heal Fitness Zone and transform your health with expert guidance, personalized plans, and a supportive community.</p>
        <div className="mt-12">
          <button onClick={handleAppDownload} className="text-gray-200 font-semibold hover:text-white transition uppercase tracking-wider mb-4">
            Download the Heal Fitness Zone App
          </button>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-4">
            <a href="https://play.google.com/store" target="_blank" rel="noopener noreferrer" className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl shadow-xl flex items-center px-6 py-3 w-48 justify-center hover:scale-105 transition-all duration-200">
              <GooglePlaySVG />
              <span className="text-black font-bold text-lg">Android</span>
            </a>
            <a href="https://www.apple.com/app-store/" target="_blank" rel="noopener noreferrer" className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl shadow-xl flex items-center px-6 py-3 w-48 justify-center hover:scale-105 transition-all duration-200">
              <Apple className="w-7 h-7 text-black mr-2" />
              <span className="text-black font-bold text-lg">IOS</span>
            </a>
          </div>
        </div>
      </div>
      {/* Modern SignUp Modal */}
      {showModernSignUp && (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setShowModernSignUp(false)}
        >
          <div onClick={e => e.stopPropagation()}>
            <ModernSignUp onClose={() => setShowModernSignUp(false)} />
          </div>
        </div>
      )}
    </section>
  );
};

export default Hero;