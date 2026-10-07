import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { Shield } from 'lucide-react';

export function Splash() {
  const navigate = useNavigate();
  const isAuthenticated = useStore((s) => s.isAuthenticated);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        navigate('/home');
      } else {
        navigate('/welcome');
      }
    }, 2200);
    return () => clearTimeout(timer);
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-navy-800 px-8">
      <div className="animate-scale-in flex flex-col items-center">
        <div className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center mb-4 shadow-xl">
          <Shield size={40} className="text-navy-800" />
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">LejersNet</h1>
        <p className="text-sm text-white/60 mt-1">Your tenancy, protected.</p>
      </div>
      <div className="mt-12 w-8 h-8 border-3 border-white/20 border-t-white rounded-full animate-spin" />
    </div>
  );
}
