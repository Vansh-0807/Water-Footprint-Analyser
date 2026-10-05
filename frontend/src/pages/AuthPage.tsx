import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Sprout, CheckCircle2, Droplets } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

interface AuthPageProps {
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

function AuthPage({ setIsAuthenticated }: AuthPageProps) {
  const { t } = useTranslation();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      try {
        const response = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:8000') + '/api/token/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
          sessionStorage.setItem('access_token', data.access);
          sessionStorage.setItem('refresh_token', data.refresh);
          toast.success('Login successful! Welcome back.');
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
        const registerResponse = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:8000') + '/api/register/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            username: username, 
            password: password, 
            full_name: (document.getElementById('fullname-input') as HTMLInputElement)?.value || '' 
          })
        });

        if (registerResponse.ok) {
          // If registration succeeded, we automatically log them in!
          const loginResponse = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:8000') + '/api/token/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
          });
          const data = await loginResponse.json();
          
          if (loginResponse.ok) {
            sessionStorage.setItem('access_token', data.access);
            sessionStorage.setItem('refresh_token', data.refresh);
            toast.success('Account created successfully! Welcome to Water Footprint Analyser.');
            setIsAuthenticated(true);
            navigate('/');
          }
        } else {
          const errorData = await registerResponse.json();
          // Show the exact error Django gives us (e.g., "Username already exists")
          setError((Object.values(errorData)[0] as string[])?.[0] || 'Registration failed. Try a different username.');
        }
      } catch (err) {
        setError('Cannot connect to server. Is Django running?');
      }
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 relative z-1">
      <div className="w-full max-w-md ">

        {/* 3D animated water droplet above the card */}
        <div className="flex justify-center mb-6">
          <Droplets className="w-10 h-10 text-emerald-600 dark:text-emerald-500" />
        </div>
        
        <div>
          <div className="bg-white/90 dark:bg-stone-950/80 backdrop-blur-xl rounded-2xl shadow-sm border border-stone-200 dark:border-stone-800 p-8 relative overflow-hidden transition-colors duration-500">
            
            <div className="relative">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 transition-colors duration-500">
                  {isLogin ? t('app_title') : t('sign_up')}
                </h2>
                <p className="text-stone-500 dark:text-stone-400 mt-2 text-sm transition-colors duration-500">
                  {isLogin 
                    ? t('sign_in_msg') 
                    : t('sign_up_msg')}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {!isLogin && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-stone-700 dark:text-stone-300 transition-colors duration-500">{t('full_name')}</label>
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
                  <label className="text-sm font-medium text-stone-700 dark:text-stone-300 transition-colors duration-500">{t('username')}</label>
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

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-stone-700 dark:text-stone-300 transition-colors duration-500">{t('password')}</label>
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

                <button 
                  type="submit"
                  className="w-full mt-6 text-white font-medium py-3 px-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 group bg-emerald-600 hover:bg-emerald-500 dark:hover:bg-emerald-500 hover:shadow-lg"
                >
                  {isLogin ? t('sign_in') : t('create_account')}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>

              <div className="mt-8 text-center">
                  <p className="text-sm text-stone-500 dark:text-stone-400 transition-colors duration-500">
                    {isLogin ? `${t('dont_have_account')} ` : `${t('already_have_account')} `}
                    <button 
                      type="button"
                      onClick={() => setIsLogin(!isLogin)}
                      className="font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
                    >
                      {isLogin ? t('sign_up') : t('sign_in')}
                    </button>
                  </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default AuthPage;




