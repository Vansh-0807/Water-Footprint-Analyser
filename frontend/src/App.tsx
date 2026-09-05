import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Sprout, LogOut } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Dashboard from './pages/Dashboard';
import AuthPage from './pages/AuthPage';
import ThemeToggle from './components/ThemeToggle';
import Chatbot from './components/Chatbot';
import AnimatedCrops from './components/AnimatedCrops';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('access_token'));
  const [isDarkMode, setIsDarkMode] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsAuthenticated(false);
    toast.success('You have successfully logged out.', { icon: '👋' });
  };

  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen flex flex-col bg-stone-100 dark:bg-[#0a0a0a] transition-colors duration-300 relative overflow-hidden ${isDarkMode ? 'dark' : ''}`}>
        
        {/* Modern SaaS Background Orbs */}
        <div className="celestial-body sun"></div>
        <div className="celestial-body moon"></div>
        <AnimatedCrops />
        
        {/* Modern SaaS Background Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-emerald-500/20 dark:bg-emerald-500/10 blur-[100px]" />
          <div className="absolute top-[60%] -right-[10%] w-[50%] h-[60%] rounded-full bg-teal-500/20 dark:bg-teal-500/10 blur-[120px]" />
        </div>

        <div className="relative z-10 flex-1 flex flex-col">
          {/* Top Right Theme Toggle for Auth Page */}
          <div className="absolute top-6 right-6 z-[100] cursor-pointer">
            <ThemeToggle isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
          </div>

          <Toaster position="top-right" toastOptions={{ style: { background: isDarkMode ? '#1c1917' : '#fff', color: isDarkMode ? '#fff' : '#1c1917', border: isDarkMode ? '1px solid #44403c' : '1px solid #e7e5e4' } }} />
          <Routes>
            <Route path="/auth" element={<AuthPage setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="*" element={<Navigate to="/auth" />} />
          </Routes>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-screen overflow-hidden bg-stone-100 dark:bg-[#0a0a0a] transition-colors duration-300 relative ${isDarkMode ? 'dark' : ''}`}>
      
      {/* Modern SaaS Background Orbs */}
      <div className="celestial-body sun"></div>
        <div className="celestial-body moon"></div>
        <AnimatedCrops />
        
        {/* Modern SaaS Background Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-emerald-500/20 dark:bg-emerald-500/10 blur-[100px]" />
        <div className="absolute top-[60%] -right-[10%] w-[50%] h-[60%] rounded-full bg-teal-500/20 dark:bg-teal-500/10 blur-[120px]" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col h-full">
      <Toaster position="top-right" toastOptions={{ style: { background: isDarkMode ? '#1c1917' : '#fff', color: isDarkMode ? '#fff' : '#1c1917', border: isDarkMode ? '1px solid #44403c' : '1px solid #e7e5e4' } }} />
      
      {/* Top Header */}
      <header className="h-20 bg-white/70 dark:bg-[#0a0a0a]/70 backdrop-blur-xl border-b border-stone-200 dark:border-stone-800 flex items-center justify-between px-6 sm:px-10 transition-colors duration-300 flex-shrink-0 sticky top-0 z-50">
        
        {/* Left: Project Name */}
        <div className="flex items-center cursor-pointer">
          <h1 className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300 hover:scale-[1.02] transition-transform">
            Water Footprint Analyser
          </h1>
        </div>
        
        {/* Right: Actions */}
        <div className="flex items-center gap-3 sm:gap-5">
          <ThemeToggle isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
          
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-stone-600 dark:text-stone-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
          
          <div className="h-9 w-9 rounded-full bg-emerald-100 dark:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-bold shadow-sm">
            U
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      
      {/* Global Chatbot */}
      <Chatbot />
      </div>
    </div>
  );
}

export default App;



