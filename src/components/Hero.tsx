import React, { useRef, useState } from 'react';
import video1 from '../assets/videos/watermarked_preview.mp4';
import video2 from '../assets/videos/watermarked_preview (1).mp4';
import video3 from '../assets/videos/video_preview_h264.mp4';

const videos = [video1, video2, video3];

const Hero: React.FC = () => {
  const [currentVideo, setCurrentVideo] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

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
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-8">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
          Helping people live
          <br />
          <span className="text-green-400">their BEST LIVES</span>
        </h1>

        <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto">
          Health on your mind? We have you covered. With more than 300,000+ successful transformations, FITTR is leading the health and fitness revolution in the world!
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
          <button 
            className="bg-green-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-green-700 transform hover:-translate-y-1 transition-all duration-300 shadow-lg"
          >
            I want to get Healthy!
          </button>
        </div>

        <div className="mt-12">
          <button onClick={handleAppDownload} className="text-gray-200 font-semibold hover:text-white transition">
            DOWNLOAD THE Heal Fitness Zone APP
          </button>
          <div className="flex justify-center space-x-4 mt-4">
            <div className="w-32 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/30">
              <span className="text-gray-200">App Store</span>
            </div>
            <div className="w-32 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/30">
              <span className="text-gray-200">Google Play</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;