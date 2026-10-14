import React, { useState, useEffect } from 'react';
import { Mail, Lock, User, ArrowRight, Sprout, CheckCircle2, Droplets, Loader2, Zap } from 'lucide-react';
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
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [serverStatus, setServerStatus] = useState<'checking' | 'ready' | 'waking'>('checking');
  const navigate = useNavigate();

  // Pre-warm the backend immediately upon page mount
  useEffect(() => {
    let isMounted = true;
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

    fetch(`${apiUrl}/health/`, { method: 'GET' })
      .then((res) => {
        if (isMounted && res.ok) {
          setServerStatus('ready');
        } else if (isMounted) {
          setServerStatus('waking');
        }
      })
      .catch(() => {
        if (isMounted) setServerStatus('waking');
      });

    const timer = setTimeout(() => {
      if (isMounted) {
        setServerStatus((prev) => (prev === 'ready' ? 'ready' : 'waking'));
      }
    }, 2000);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError('');
    setLoading(true);
    setLoadingMessage(isLogin ? 'Authenticating...' : 'Creating account...');

    // If server takes longer than 2.5s (free-tier cold start), show reassuring live progress
    const wakingTimer = setTimeout(() => {
      setLoadingMessage('Waking cloud server (Render free tier)... please hold on (~25s)');
      setServerStatus('waking');
    }, 2500);

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

    try {
      if (isLogin) {
        const response = await fetch(`${apiUrl}/api/token/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
          setServerStatus('ready');
          sessionStorage.setItem('access_token', data.access);
          sessionStorage.setItem('refresh_token', data.refresh);
          toast.success('Login successful! Welcome back.');
          setIsAuthenticated(true);
          navigate('/');
        } else {
          setError('Invalid username or password.');
        }
      } else {
        // SIGN UP LOGIC
        const registerResponse = await fetch(`${apiUrl}/api/register/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            username: username, 
            password: password, 
            full_name: (document.getElementById('fullname-input') as HTMLInputElement)?.value || '' 
          })
        });

        if (registerResponse.ok) {
          const loginResponse = await fetch(`${apiUrl}/api/token/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
          });
          const data = await loginResponse.json();
          
          if (loginResponse.ok) {
            setServerStatus('ready');
            sessionStorage.setItem('access_token', data.access);
            sessionStorage.setItem('refresh_token', data.refresh);
            toast.success('Account created successfully! Welcome to Water Footprint Analyser.');
            setIsAuthenticated(true);
            navigate('/');
          }
        } else {
          const errorData = await registerResponse.json();
          setError((Object.values(errorData)[0] as string[])?.[0] || 'Registration failed. Try a different username.');
        }
      }
    } catch (err) {
      setError('Cannot connect to server. Render backend may still be starting up, please retry in 15 seconds.');
    } finally {
      clearTimeout(wakingTimer);
      setLoading(false);
      setLoadingMessage('');
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
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 transition-colors duration-500">
                  {isLogin ? t('app_title') : t('sign_up')}
                </h2>
                <p className="text-stone-500 dark:text-stone-400 mt-2 text-sm transition-colors duration-500">
                  {isLogin 
                    ? t('sign_in_msg') 
                    : t('sign_up_msg')}
                </p>

                {/* Cloud Server Status Indicator */}
                <div className="flex justify-center mt-3">
                  {serverStatus === 'ready' && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      Cloud API Online (Instant)
                    </div>
                  )}
                  {serverStatus === 'waking' && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-500" />
                      Waking up cloud backend (~30s on first load)...
                    </div>
                  )}
                  {serverStatus === 'checking' && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-stone-500/10 text-stone-500 dark:text-stone-400 border border-stone-500/20">
                      <span className="w-2 h-2 rounded-full bg-stone-400"></span>
                      Connecting to Cloud Backend...
                    </div>
                  )}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
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
                        disabled={loading}
                        className="w-full pl-10 pr-4 py-2.5 bg-white/60 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all placeholder:text-stone-400 dark:placeholder:text-stone-500 text-stone-800 dark:text-stone-100 backdrop-blur-sm disabled:opacity-60"
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
                      disabled={loading}
                      className="w-full pl-10 pr-4 py-2.5 bg-white/60 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all placeholder:text-stone-400 dark:placeholder:text-stone-500 text-stone-800 dark:text-stone-100 backdrop-blur-sm disabled:opacity-60"
                      placeholder="farmer123"
                    />
                  </div>
                </div>

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
                      disabled={loading}
                      className="w-full pl-10 pr-4 py-2.5 bg-white/60 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all placeholder:text-stone-400 dark:placeholder:text-stone-500 text-stone-800 dark:text-stone-100 backdrop-blur-sm disabled:opacity-60"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                {/* Recruiter Quick Fill Demo Button */}
                {isLogin && (
                  <button
                    type="button"
                    onClick={() => {
                      setUsername('user');
                      setPassword('user');
                      toast.success('Loaded demo credentials: user / user', { icon: '⚡' });
                    }}
                    disabled={loading}
                    className="w-full py-2 px-3 text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-800/60 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Zap className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Recruiter Demo Login: click to autofill (<strong>user</strong>)</span>
                  </button>
                )}

                {error && (
                  <div className="p-3 bg-red-100/80 dark:bg-red-900/40 border border-red-200 dark:border-red-800/50 rounded-xl text-red-600 dark:text-red-400 text-sm text-center font-medium">
                    {error}
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={loading}
                  className={`w-full mt-4 text-white font-medium py-3 px-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 group ${
                    loading 
                      ? 'bg-emerald-700/70 cursor-wait opacity-90' 
                      : 'bg-emerald-600 hover:bg-emerald-500 dark:hover:bg-emerald-500 hover:shadow-lg cursor-pointer'
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">{loadingMessage || (isLogin ? t('sign_in') : t('create_account'))}</span>
                    </>
                  ) : (
                    <>
                      {isLogin ? t('sign_in') : t('create_account')}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                  <p className="text-sm text-stone-500 dark:text-stone-400 transition-colors duration-500">
                    {isLogin ? `${t('dont_have_account')} ` : `${t('already_have_account')} `}
                    <button 
                      type="button"
                      disabled={loading}
                      onClick={() => setIsLogin(!isLogin)}
                      className="font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors cursor-pointer"
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




