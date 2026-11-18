import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Mail, Lock, User, ArrowRight, Sprout, Droplets, Loader2 } from 'lucide-react';
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
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const response = await fetch(`${API_URL}/api/token/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
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
      } else {
        const fullName = (document.getElementById('fullname-input') as HTMLInputElement)?.value || '';
        const registerResponse = await fetch(`${API_URL}/api/register/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password, full_name: fullName }),
        });

        if (registerResponse.ok) {
          const loginResponse = await fetch(`${API_URL}/api/token/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
          });
          const data = await loginResponse.json();

          if (loginResponse.ok) {
            sessionStorage.setItem('access_token', data.access);
            sessionStorage.setItem('refresh_token', data.refresh);
            toast.success('Account created successfully!');
            setIsAuthenticated(true);
            navigate('/');
          }
        } else {
          const errorData = await registerResponse.json();
          setError((Object.values(errorData)[0] as string[])?.[0] || 'Registration failed. Try a different username.');
        }
      }
    } catch {
      setError('Cannot connect to server. Please try again in a moment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 relative z-1">
      <div className="w-full max-w-md">

        {/* Water droplet icon */}
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
                <p className="text-stone-500 dark:text-stone-400 text-sm mt-1">
                  {isLogin ? t('login_subtitle') : t('signup_subtitle')}
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input
                      id="fullname-input"
                      type="text"
                      placeholder={t('full_name') || 'Full Name'}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900/50 text-stone-800 dark:text-stone-200 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                    />
                  </div>
                )}

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    placeholder={t('username') || 'Username'}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900/50 text-stone-800 dark:text-stone-200 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                    required
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type="password"
                    placeholder={t('password') || 'Password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900/50 text-stone-800 dark:text-stone-200 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {isLogin ? 'Signing in...' : 'Creating account...'}
                    </>
                  ) : (
                    <>
                      {isLogin ? t('login') : t('sign_up')}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={() => { setIsLogin(!isLogin); setError(''); }}
                  className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  {isLogin ? t('no_account') : t('have_account')}
                </button>
              </div>

              {/* Demo credentials hint */}
              <div className="mt-4 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-center">
                <p className="text-xs text-emerald-700 dark:text-emerald-400">
                  <strong>Demo:</strong> username <code className="bg-emerald-100 dark:bg-emerald-800/50 px-1 rounded">user</code> / password <code className="bg-emerald-100 dark:bg-emerald-800/50 px-1 rounded">user</code>
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
