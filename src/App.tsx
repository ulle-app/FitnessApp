import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import BMRCalculator from './components/tools/BMRCalculator';
import BodyFatCalculator from './components/tools/BodyFatCalculator';
import Calculators from './components/tools/Calculators';
import MacroCalculator from './components/tools/MacroCalculator';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import Community from './components/Community';
import { useTheme } from './context/ThemeContext';
import ToolsPage from './components/ToolsPage';
import ModernOnboarding from './components/ModernOnboarding';
import HeroStoryOnboarding from './components/HeroStoryOnboarding';
import TimelineOnboarding from './components/TimelineOnboarding';
import { useUser } from './context/UserContext';
import Dashboard from './components/Dashboard';
import AuthModal from './components/AuthModal';

type LandingPageProps = {
  user: any;
  onLogout: () => void;
};

const LandingPage: React.FC<LandingPageProps> = ({ user }) => {
  const [showSignup, setShowSignup] = React.useState(false);
  return (
    <>
      <Header onSignupClick={() => setShowSignup(true)} />
      <main>
        <Hero />
        <Services />
        <Testimonials />
        <Community />
      </main>
      <Footer />
      {showSignup && (
        <AuthModal onClose={() => setShowSignup(false)} />
      )}
    </>
  );
};

type AppRoutesProps = {
  user: any;
  onLogout: () => void;
  setUser: (user: any) => void;
};

const AppRoutes: React.FC<AppRoutesProps> = ({ user, setUser }) => {
  const { theme } = useTheme();

  return (
    <Routes>
      <Route path="/" element={<LandingPage user={user} onLogout={() => {}} />} />
      <Route path="/tools" element={
        <>
          <Header onLoginClick={() => {}} />
          <ToolsPage />
          <Footer />
        </>
      } />
      <Route path="/calculators" element={
        <>
          <Header onLoginClick={() => {}} />
          <Calculators />
          <Footer />
        </>
      } />
      <Route path="/bmr-calculator" element={
        <>
          <Header onLoginClick={() => {}} />
          <section className={`min-h-screen w-full flex flex-col items-center justify-center ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-white via-gray-100 to-white'}`}> 
            <div className="w-full max-w-2xl px-4 pb-16 flex justify-center">
              <BMRCalculator />
            </div>
          </section>
          <Footer />
        </>
      } />
      <Route path="/body-fat-calculator" element={
        <>
          <Header onLoginClick={() => {}} />
          <section className={`min-h-screen w-full flex flex-col items-center justify-center ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-white via-gray-100 to-white'}`}> 
            <div className="w-full max-w-2xl px-4 pb-16 flex justify-center">
              <BodyFatCalculator />
            </div>
          </section>
          <Footer />
        </>
      } />
      <Route path="/macro-calculator" element={
        <>
          <Header onLoginClick={() => {}} />
          <section className={`min-h-screen w-full flex flex-col items-center justify-center ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-white via-gray-100 to-white'}`}> 
            <div className="w-full max-w-5xl px-4 pb-16 flex justify-center">
              <MacroCalculator />
            </div>
          </section>
          <Footer />
        </>
      } />
      
      {/* Updated onboarding routes */}
      <Route path="/onboarding" element={user ? <ModernOnboarding /> : <Navigate to="/" />} />
      <Route path="/hero-story" element={user ? <HeroStoryOnboarding /> : <Navigate to="/" />} />
      <Route path="/timeline" element={user ? <TimelineOnboarding /> : <Navigate to="/" />} />
      
      <Route path="/dashboard" element={
        user
          ? isProfileComplete(user)
            ? <Dashboard />
            : <Navigate to="/onboarding" />
          : <Navigate to="/" />
      } />
      
      <Route path="*" element={
        user && !isProfileComplete(user)
          ? <Navigate to="/onboarding" />
          : <Navigate to="/" />
      } />
    </Routes>
  )
}

// Helper to check if user profile is complete
function isProfileComplete(user: any) {
  if (!user) return false;
  const required = ['fullName', 'gender', 'dob', 'height', 'weight'];
  return required.every(f => user[f]);
}

function App() {
  const { user, setUser, logout } = useUser();
  return (
    <BrowserRouter>
      <AppRoutes user={user} onLogout={logout} setUser={setUser} />
    </BrowserRouter>
  );
}

export default App;