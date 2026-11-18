import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

interface AuthPageProps {
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AuthPage({ setIsAuthenticated }: AuthPageProps) {
  const navigate = useNavigate();

  // Auto‑login with the demo credentials as soon as the page loads
  useEffect(() => {
    fetch('/api/token/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'user', password: 'user' }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Login failed');
        return res.json();
      })
      .then((data) => {
        sessionStorage.setItem('access_token', data.access);
        sessionStorage.setItem('refresh_token', data.refresh);
        setIsAuthenticated(true);
        toast.success('Demo login successful');
        navigate('/');
      })
      .catch((err) => {
        toast.error('Unable to auto‑login demo user. Please try again later.');
        console.error(err);
      });
  }, [navigate, setIsAuthenticated]);

  // Simple loading indicator while the auto‑login request is in flight
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="animate-spin text-emerald-600" size={48} />
    </div>
  );
}
