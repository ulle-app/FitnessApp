@@ .. @@
 import React, { useState, useEffect } from 'react';
 import { Bell, LogOut, User, CheckCircle, Flame, Dumbbell, Footprints, Apple, Soup, Utensils, HeartPulse, ClipboardList, ChevronDown, ChevronUp, ShoppingCart, AlertTriangle, MessageCircle, X, TrendingUp } from 'lucide-react';
 import { useUser } from '../context/UserContext';
+import { useNavigate } from 'react-router-dom';
+import Header from './Header';
 import WorkoutCard from './WorkoutCard';
 import SwipeableWorkoutCards from './SwipeableWorkoutCards';
 import PersonalizedInsights from './PersonalizedInsights';
@@ .. @@
   const [plan, setPlan] = useState<any[]>([]);
   const [loading, setLoading] = useState(false);
   const [lastModified, setLastModified] = useState<string | null>(null);
-  const { user, logout } = useUser(); // user is the expert
+  const { user, logout } = useUser(); // user is the trainer
+  const navigate = useNavigate();
   const [workoutFilter, setWorkoutFilter] = useState({ muscle: '', goal: '', level: '' });
   const [workoutOptions, setWorkoutOptions] = useState<any[]>([]);
   const [allUsers, setAllUsers] = useState<any[]>([]);
@@ .. @@
   const [showPersonalizedInsights, setShowPersonalizedInsights] = useState(false);
   const [selectedUserForInsights, setSelectedUserForInsights] = useState<any>(null);
 
-  console.log('User context in TriExpertDashboard:', user);
+  console.log('User context in TrainerDashboard:', user?.role, user?.phone);
+  
+  // Redirect if not logged in or not a trainer
+  React.useEffect(() => {
+    if (!user) {
+      navigate('/login');
+      return;
+    }
+    
+    if (user.role !=  }
  )
= 'trainer') {
+      console.log('User is not a trainer, redirecting');
+      navigate('/');
+    }
+  }, [user, navigate]);
 
   useEffect(() => {
@@ .. @@
 
   return (
     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-950 text-white font-[Inter,sans-serif] relative">
-      {/* Fixed Glassmorphic Header */}
-      <header className="fixed top-0 left-0 w-full z-30 flex items-center justify-between px-8 py-4 bg-white/60 backdrop-blur-xl border-b-2 border-white/30 shadow-[0_4px_32px_0_rgba(0,0,0,0.18)] rounded-b-2xl" style={{boxShadow: '0 4px 32px 0 rgba(0,0,0,0.18)'}}>
-        <div className="flex items-center gap-4">
-          <img 
-            src={user?.photo || '/src/assets/avatars/avatar1.svg'} 
-            alt="Profile" 
-            className="w-12 h-12 rounded-full border-2 border-white object-cover shadow-md" 
-          />
-          <div>
-            <span className="font-bold text-lg text-white drop-shadow">Welcome, {user?.fullName || user?.username || 'Trainer'}</span>
-            <div className="text-sm text-white/70">Fitness Trainer Dashboard</div>
-          </div>
-        </div>
-        <div className="flex items-center gap-4">
-          <button className="relative p-2 hover:bg-white/20 rounded-lg transition-colors">
-            <Bell className="w-6 h-6" />
-          </button>
-          <button 
-            className="p-2 bg-white/20 hover:bg-white/40 rounded-lg transition-colors shadow border border-white/30"
-            onClick={() => { 
-              logout(); 
-              navigate('/', { replace: true }); 
-            }}
-            title="Logout"
-          >
-            <LogOut className="w-6 h-6 text-white" />
-          </button>
-        </div>
-      </header>
+      {/* Use the common Header component */}
+      <Header />
 
       {/* Main Content Container with extra top padding for header */}
       <main className="pt-44 pb-16 px-4 flex flex-col items-center min-h-screen">