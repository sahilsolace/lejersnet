import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, AlertCircle, Check } from 'lucide-react';
import { authService } from '@/services/authService';
import { passwordStrength } from '@/lib/utils';

export function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const pwStrength = passwordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
    setLoading(true);
    await authService.resetPassword(password);
    setLoading(false);
    navigate('/password-reset-success');
  };

  return (
    <div className="min-h-screen bg-brand-light flex flex-col">
      <div className="px-6 pt-12 pb-4">
        <h1 className="text-2xl font-bold text-navy-800 mb-2">Reset password</h1>
        <p className="text-sm text-gray-600">Choose a new password for your account.</p>
      </div>

      <div className="flex-1 px-6 pt-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-navy-800 mb-1.5">New password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-3 rounded-xl bg-white border border-gray-200 text-sm text-navy-800 placeholder-gray-400 focus:border-navy-500 focus:outline-none transition-colors"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {password && (
              <div className="mt-2">
                <div className="flex gap-1">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex-1 h-1.5 rounded-full transition-colors"
                      style={{ backgroundColor: i < pwStrength.score ? pwStrength.color : '#e5e7eb' }}
                    />
                  ))}
                </div>
                <p className="text-xs mt-1" style={{ color: pwStrength.color }}>{pwStrength.label}</p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-navy-800 mb-1.5">Confirm new password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-3 rounded-xl bg-white border border-gray-200 text-sm text-navy-800 placeholder-gray-400 focus:border-navy-500 focus:outline-none transition-colors"
              />
              {confirmPassword && confirmPassword === password && (
                <Check size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600" />
              )}
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
            {loading ? 'Resetting…' : 'Reset password'}
          </button>
        </form>
      </div>
    </div>
  );
}
