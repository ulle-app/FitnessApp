import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import MembershipTiers from './components/MembershipTiers';
import Services from './components/Services';
import AppDownload from './components/AppDownload';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <MembershipTiers />
        <Services />
        <div id="app-download">
          <AppDownload />
        </div>
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}

export default App;