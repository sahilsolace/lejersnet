import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Mail, AlertCircle } from 'lucide-react';
import { authService } from '@/services/authService';

export function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    setLoading(true);
    await authService.sendPasswordReset(email);
    setLoading(false);
    navigate('/check-email', { state: { email } });
  };

  return (
    <div className="min-h-screen bg-brand-light flex flex-col">
      <div className="px-4 pt-10 pb-4">
        <Link to="/signin" className="flex items-center gap-1 text-sm text-navy-600 font-medium">
          <ChevronLeft size={20} /> Back to sign in
        </Link>
      </div>
      <div className="flex-1 px-6 pt-4">
        <h1 className="text-2xl font-bold text-navy-800 mb-2">Forgot password</h1>
        <p className="text-sm text-gray-600 mb-6">
          Enter your email and we'll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-navy-800 mb-1.5">Email</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                placeholder="you@email.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-gray-200 text-sm text-navy-800 placeholder-gray-400 focus:border-navy-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5 text-sm text-red-700">
              <AlertCircle size={16} className="flex-shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-navy-800 text-white font-semibold text-sm hover:bg-navy-900 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            {loading ? 'Sending…' : 'Send reset link'}
          </button>
        </form>
      </div>
    </div>
  );
}
