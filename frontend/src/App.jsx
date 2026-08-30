import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { Sprout } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import AuthPage from './pages/AuthPage';
import AnimatedCrops from './components/AnimatedCrops';
import ThemeToggle from './components/ThemeToggle';
import Chatbot from './components/Chatbot';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Apply dark mode to body for background transition
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className={`min-h-screen bg-farm flex flex-col relative overflow-hidden grain-overlay ${isDarkMode ? 'dark' : ''}`} style={{ perspective: '1200px' }}>
      
      {/* ── Sun & Moon ── */}
      <div className="celestial-body sun"></div>
      <div className="celestial-body moon"></div>

      {/* ── Animated growing crops ── */}
      <AnimatedCrops />

      {/* ── Grey wind streaks ── */}
      <div className="wind-streak" style={{ top: '15%', width: '180px', animationDuration: '4s', animationDelay: '0s' }}></div>
      <div className="wind-streak" style={{ top: '28%', width: '250px', animationDuration: '3.5s', animationDelay: '1.5s' }}></div>
      <div className="wind-streak" style={{ top: '42%', width: '150px', animationDuration: '5s', animationDelay: '0.8s' }}></div>
      <div className="wind-streak" style={{ top: '55%', width: '220px', animationDuration: '3.8s', animationDelay: '2.5s' }}></div>
      <div className="wind-streak" style={{ top: '68%', width: '280px', animationDuration: '4.5s', animationDelay: '0.3s' }}></div>
      <div className="wind-streak" style={{ top: '78%', width: '160px', animationDuration: '3.2s', animationDelay: '3s' }}></div>
      <div className="wind-streak" style={{ top: '85%', width: '200px', animationDuration: '4.2s', animationDelay: '1s' }}></div>
      <div className="wind-streak" style={{ top: '22%', width: '130px', animationDuration: '5.5s', animationDelay: '4s' }}></div>
      <div className="wind-streak" style={{ top: '48%', width: '300px', animationDuration: '3s', animationDelay: '2s' }}></div>
      <div className="wind-streak" style={{ top: '92%', width: '170px', animationDuration: '4.8s', animationDelay: '1.2s' }}></div>
      <div className="wind-streak" style={{ top: '35%', width: '240px', animationDuration: '3.6s', animationDelay: '3.5s' }}></div>
      <div className="wind-streak" style={{ top: '62%', width: '190px', animationDuration: '4s', animationDelay: '0.5s' }}></div>

      {/* ── Morphing organic blobs ── */}
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <div className="blob blob-3"></div>
      <div className="blob blob-4"></div>

      {/* ── Rising particles ── */}
      <div className="particle particle-1"></div>
      <div className="particle particle-2"></div>
      <div className="particle particle-3"></div>
      <div className="particle particle-4"></div>
      <div className="particle particle-5"></div>
      <div className="particle particle-6"></div>
      <div className="particle particle-7"></div>
      <div className="particle particle-8"></div>

      {/* ── Water ripple rings ── */}
      <div className="ripple-ring ripple-1" style={{ top: '30%', left: '15%' }}></div>
      <div className="ripple-ring ripple-2" style={{ top: '60%', right: '20%' }}></div>
      <div className="ripple-ring ripple-3" style={{ top: '45%', left: '55%' }}></div>

      {/* ── Animated wave layers (SVG) ── */}
      <svg className="wave-layer wave-1" viewBox="0 0 1440 120" preserveAspectRatio="none" style={{ height: '120px' }}>
        <path d="M0,40 C360,100 720,0 1080,60 C1260,90 1440,40 1440,40 L1440,120 L0,120 Z" fill="#16a34a" />
        <path d="M1440,40 C1800,100 2160,0 2520,60 C2700,90 2880,40 2880,40 L2880,120 L1440,120 Z" fill="#16a34a" />
      </svg>
      <svg className="wave-layer wave-2" viewBox="0 0 1440 120" preserveAspectRatio="none" style={{ height: '100px' }}>
        <path d="M0,80 C240,20 480,100 720,50 C960,0 1200,70 1440,80 L1440,120 L0,120 Z" fill="#15803d" />
        <path d="M1440,80 C1680,20 1920,100 2160,50 C2400,0 2640,70 2880,80 L2880,120 L1440,120 Z" fill="#15803d" />
      </svg>
      <svg className="wave-layer wave-3" viewBox="0 0 1440 120" preserveAspectRatio="none" style={{ height: '80px' }}>
        <path d="M0,60 C180,100 360,20 540,70 C720,120 900,30 1080,60 C1260,90 1440,60 1440,60 L1440,120 L0,120 Z" fill="#166534" />
        <path d="M1440,60 C1620,100 1800,20 1980,70 C2160,120 2340,30 2520,60 C2700,90 2880,60 2880,60 L2880,120 L1440,120 Z" fill="#166534" />
      </svg>

      {/* Header / Nav */}
      <header className="relative z-[10] p-6 flex justify-between items-center w-full max-w-7xl mx-auto mb-4 animate-enter-3d">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="p-3 bg-emerald-500/20 rounded-2xl group-hover:bg-emerald-500/30 transition-colors">
            <Sprout className="w-8 h-8 text-emerald-400 transform group-hover:scale-110 transition-transform duration-500" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-lime-600 dark:from-emerald-400 dark:to-lime-300 transition-colors duration-500">
            Water Footprint Analyser
          </h1>
        </div>
        <div className="flex items-center gap-6">
          <ThemeToggle isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
          {isAuthenticated && (
            <button 
              onClick={() => setIsAuthenticated(false)}
              className="px-6 py-2.5 rounded-xl font-medium text-emerald-800 bg-emerald-100 hover:bg-emerald-200 dark:text-emerald-400 dark:bg-stone-800/80 dark:hover:bg-stone-700 border border-transparent dark:border-stone-700 transition-all shadow-sm"
            >
              Logout
            </button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-[2] flex-1 flex flex-col">
        <Routes>
          <Route path="/auth" element={!isAuthenticated ? <AuthPage setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/" />} />
          <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/auth" />} />
        </Routes>
      </main>

      {isAuthenticated && <Chatbot />}
    </div>
  );
}

export default App;
