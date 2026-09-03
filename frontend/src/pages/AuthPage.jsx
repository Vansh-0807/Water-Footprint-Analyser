import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Sprout, CheckCircle2, Droplets } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function AuthPage({ setIsAuthenticated }) {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (isForgotPassword) {
      setCodeSent(true);
      setTimeout(() => {
        setIsForgotPassword(false);
        setCodeSent(false);
      }, 3000);
      return;
    }

    if (isLogin) {
      try {
        const response = await fetch('http://localhost:8000/api/token/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem('access_token', data.access);
          localStorage.setItem('refresh_token', data.refresh);
          setIsAuthenticated(true);
          navigate('/');
        } else {
          setError('Invalid username or password.');
        }
      } catch (err) {
        setError('Cannot connect to server. Is Django running?');
      }
    } else {
      // SIGN UP LOGIC
      try {
        // First we register the user
        const registerResponse = await fetch('http://localhost:8000/api/register/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            username: username, 
            password: password, 
            full_name: document.getElementById('fullname-input')?.value || '' 
          })
        });

        if (registerResponse.ok) {
          // If registration succeeded, we automatically log them in!
          const loginResponse = await fetch('http://localhost:8000/api/token/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
          });
          const data = await loginResponse.json();
          
          if (loginResponse.ok) {
            localStorage.setItem('access_token', data.access);
            localStorage.setItem('refresh_token', data.refresh);
            setIsAuthenticated(true);
            navigate('/');
          }
        } else {
          const errorData = await registerResponse.json();
          // Show the exact error Django gives us (e.g., "Username already exists")
          setError(Object.values(errorData)[0]?.[0] || 'Registration failed. Try a different username.');
        }
      } catch (err) {
        setError('Cannot connect to server. Is Django running?');
      }
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 relative z-1">
      <div className="w-full max-w-md">

        {/* 3D animated water droplet above the card */}
        <div className="flex justify-center mb-6">
          <div className="animate-droplet-3d">
            <Droplets className="w-10 h-10 text-emerald-600/60 dark:text-emerald-400/40" />
          </div>
        </div>
        
        <div className="card-3d">
          <div className="card-3d-inner bg-white/70 dark:bg-stone-900/70 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.1)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.25)] border border-emerald-200 dark:border-emerald-900/30 p-8 relative overflow-hidden animate-enter-3d transition-colors duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/50 dark:from-emerald-900/10 to-transparent pointer-events-none transition-colors duration-500"></div>
            
            <div className="relative">
              <div className="text-center mb-8">
                <div className="bg-emerald-100 dark:bg-emerald-900/50 p-3 rounded-2xl shadow-sm dark:shadow-inner inline-block mb-4 transition-colors duration-500">
                  <Sprout className="w-8 h-8 text-emerald-600 dark:text-emerald-400 transition-colors duration-500" />
                </div>
                <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 transition-colors duration-500">
                  {isForgotPassword 
                    ? 'Reset Password' 
                    : isLogin ? 'Welcome Back, Farmer' : 'Join Our Community'}
                </h2>
                <p className="text-stone-500 dark:text-stone-400 mt-2 text-sm transition-colors duration-500">
                  {isForgotPassword
                    ? (codeSent ? 'Verification code sent! Please check your email.' : 'Enter your registered email address to receive a verification code.')
                    : isLogin 
                      ? 'Sign in to access your farm data and water analysis.' 
                      : 'Create an account to start tracking your water footprint.'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {!isLogin && !isForgotPassword && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-stone-700 dark:text-stone-300 transition-colors duration-500">Full Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-stone-400 dark:text-stone-500 transition-colors duration-500" />
                      </div>
                      <input 
                        id="fullname-input"
                        type="text" 
                        required
                        className="w-full pl-10 pr-4 py-2.5 bg-white/60 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all placeholder:text-stone-400 dark:placeholder:text-stone-500 text-stone-800 dark:text-stone-100 backdrop-blur-sm"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700 dark:text-stone-300 transition-colors duration-500">Username</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-stone-400 dark:text-stone-500 transition-colors duration-500" />
                    </div>
                    <input 
                      type="text" 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-white/60 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all placeholder:text-stone-400 dark:placeholder:text-stone-500 text-stone-800 dark:text-stone-100 backdrop-blur-sm"
                      placeholder="farmer123"
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-100/80 dark:bg-red-900/40 border border-red-200 dark:border-red-800/50 rounded-xl text-red-600 dark:text-red-400 text-sm text-center font-medium animate-pulse">
                    {error}
                  </div>
                )}

                {!isForgotPassword && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-stone-700 dark:text-stone-300 transition-colors duration-500">Password</label>
                      {isLogin && (
                        <button 
                          type="button"
                          onClick={() => setIsForgotPassword(true)}
                          className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
                        >
                          Forgot password?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-stone-400 dark:text-stone-500 transition-colors duration-500" />
                      </div>
                      <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full pl-10 pr-4 py-2.5 bg-white/60 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all placeholder:text-stone-400 dark:placeholder:text-stone-500 text-stone-800 dark:text-stone-100 backdrop-blur-sm"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={codeSent}
                  className={`w-full mt-6 text-white font-medium py-3 px-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 group ${
                    codeSent 
                      ? 'bg-emerald-500 dark:bg-emerald-600 cursor-not-allowed' 
                      : 'bg-emerald-600 hover:bg-emerald-500 dark:hover:bg-emerald-500 hover:shadow-lg'
                  }`}
                >
                  {isForgotPassword 
                    ? (codeSent ? <><CheckCircle2 className="w-5 h-5" /> Code Sent!</> : 'Send Verification Code')
                    : isLogin ? 'Sign In' : 'Create Account'}
                  
                  {!codeSent && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                </button>
              </form>

              <div className="mt-8 text-center">
                {isForgotPassword ? (
                  <p className="text-sm text-stone-500 dark:text-stone-400 transition-colors duration-500">
                    Remember your password?{' '}
                    <button 
                      type="button"
                      onClick={() => {
                        setIsForgotPassword(false);
                        setCodeSent(false);
                      }}
                      className="font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
                    >
                      Back to sign in
                    </button>
                  </p>
                ) : (
                  <p className="text-sm text-stone-500 dark:text-stone-400 transition-colors duration-500">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button 
                      type="button"
                      onClick={() => setIsLogin(!isLogin)}
                      className="font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
                    >
                      {isLogin ? 'Sign up' : 'Sign in'}
                    </button>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default AuthPage;
