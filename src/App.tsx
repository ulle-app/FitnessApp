import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import AppDownload from './components/AppDownload';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import FittrHart from './components/FittrHart';
import Community from './components/Community';

function App() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      <main>
        <Hero />
        <Services />
        <FittrHart />
        <div id="app-download">
          <AppDownload />
        </div>
        <Testimonials />
        <Community />
      </main>
      <Footer />
    </div>
  );
}

export default App;