import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
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
import AdminDashboard from './components/AdminDashboard';
import EntryPage from './components/EntryPage';
import MyTimeLogs from './components/MyTimeLogs';
import AdminTimeLogs from './components/AdminTimeLogs';
import WorkoutManagement from './components/WorkoutManagement';
import TriExpertDashboard from './components/TriExpertDashboard';

type LandingPageProps = {
  user: any;
  onLogout: () => void;
};
<<<<<<< HEAD
const LandingPage: React.FC<LandingPageProps> = ({ user, onLogout }) => {
=======

const LandingPage: React.FC<LandingPageProps> = ({ user }) => {
>>>>>>> 131197f10628ddc4a74b2b9a6875df5ced2a62cf
  const [showSignup, setShowSignup] = React.useState(false);
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  React.useEffect(() => {
    if (user) {
      onLogout();
    }
  }, [user, onLogout]);
  return (
<<<<<<< HEAD
  <>
      {!isLoginPage && <Header onSignupClick={() => setShowSignup(true)} />}
    <main>
      <Hero />
      <Services />
      <Testimonials />
      <Community />
    </main>
    <Footer />
=======
    <>
      <Header onSignupClick={() => setShowSignup(true)} />
      <main>
        <Hero />
        <Services />
        <Testimonials />
        <Community />
      </main>
      <Footer />
>>>>>>> 131197f10628ddc4a74b2b9a6875df5ced2a62cf
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
<<<<<<< HEAD
const AppRoutes: React.FC<AppRoutesProps> = ({ user, setUser, onLogout }) => {
=======

const AppRoutes: React.FC<AppRoutesProps> = ({ user, setUser }) => {
>>>>>>> 131197f10628ddc4a74b2b9a6875df5ced2a62cf
  const { theme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'expert') {
        navigate('/expert');
      } else if (user.role === 'user') {
        // Check if user has completed onboarding
        if (user.onboarding_completed !== 'true') {
          navigate('/timeline');
        } else {
          navigate('/dashboard');
        }
      }
    }
  }, [user, navigate]);

  const isLoginPage = location.pathname === '/login';

  return (
    <Routes>
      <Route path="/" element={<LandingPage user={user} onLogout={onLogout} />} />
      <Route path="/tools" element={
        <>
          {!isLoginPage && <Header onLoginClick={() => {}} />}
          <ToolsPage />
          <Footer />
        </>
      } />
      <Route path="/calculators" element={
        <>
          {!isLoginPage && <Header onLoginClick={() => {}} />}
          <Calculators />
          <Footer />
        </>
      } />
      <Route path="/bmr-calculator" element={
        <>
          {!isLoginPage && <Header onLoginClick={() => {}} />}
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
          {!isLoginPage && <Header onLoginClick={() => {}} />}
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
          {!isLoginPage && <Header onLoginClick={() => {}} />}
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
          ? (isProfileComplete(user) && user.onboarding_completed === 'true')
            ? <Dashboard />
            : <Navigate to="/onboarding" />
          : <Navigate to="/" />
      } />
<<<<<<< HEAD
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/entry" element={<EntryPage />} />
      <Route path="/my-logs" element={<MyTimeLogs />} />
      <Route path="/my-attendance" element={<Navigate to="/my-logs" />} />
      <Route path="/admin/time-logs" element={<AdminTimeLogs />} />
      <Route path="/admin/workouts" element={<WorkoutManagement />} />
      <Route path="/trainer" element={<TrainerDashboard />} />
      <Route path="*" element={
        user && user.role === 'user' && user.onboarding_completed !== 'true'
          ? <Navigate to="/timeline" />
=======
      
      <Route path="*" element={
        user && !isProfileComplete(user)
          ? <Navigate to="/onboarding" />
>>>>>>> 131197f10628ddc4a74b2b9a6875df5ced2a62cf
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

const TrainerDashboard = TriExpertDashboard;

const App = () => {
  const { user, setUser, logout } = useUser();
  return (
    <BrowserRouter>
      <AppRoutes user={user} onLogout={logout} setUser={setUser} />
    </BrowserRouter>
  );
}

export default App;