import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Mail, Lock, User, Eye, EyeOff, AlertCircle, Check } from 'lucide-react';
import { authService } from '@/services/authService';
import { useStore } from '@/store/useStore';
import { useToast } from '@/store/useToast';
import { passwordStrength } from '@/lib/utils';

export function SignUp() {
  const navigate = useNavigate();
  const { setUser, setAuthenticated } = useStore();
  const { addToast } = useToast();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);

  const pwStrength = passwordStrength(password);

  const validate = () => {
    if (!fullName.trim()) { setError('Please enter your full name.'); return false; }
    if (!email || !email.includes('@')) { setError('Please enter a valid email address.'); return false; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return false; }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return false; }
    if (!agreeTerms) { setError('Please accept the terms and conditions.'); return false; }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;
    setLoading(true);
    const result = await authService.wixSignup(fullName, email, password);
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      setUser(result.user);
      setAuthenticated(true);
      addToast('Account created successfully!', 'success');
      navigate('/profile-sync');
    }
  };

  const handleSocial = async (provider: 'google' | 'facebook') => {
    setSocialLoading(provider);
    const result = await authService.socialLogin(provider);
    setSocialLoading(null);
    setUser(result.user);
    setAuthenticated(true);
    addToast(`Signed up with ${provider === 'google' ? 'Google' : 'Facebook'}`, 'success');
    navigate('/profile-sync');
  };

  return (
    <div className="min-h-screen bg-navy-800 flex flex-col">
      <div className="px-6 pt-10 pb-6">
        <Link to="/welcome" className="flex items-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
            <Shield size={24} className="text-navy-800" />
          </div>
          <span className="text-lg font-bold text-white">LejersNet</span>
        </Link>
        <h1 className="text-2xl font-bold text-white mb-1">Create account</h1>
        <p className="text-sm text-white/60">Join LejersNet – DKK 49/month</p>
      </div>

      <div className="flex-1 bg-brand-light rounded-t-3xl px-6 pt-6 pb-6 overflow-y-auto no-scrollbar">
        <form onSubmit={handleSubmit} className="space-y-4 mb-5">
          <div>
            <label className="block text-sm font-medium text-navy-800 mb-1.5">Full name</label>
            <div className="relative">
              <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => { setFullName(e.target.value); setError(''); }}
                placeholder="Sofie Hansen"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-gray-200 text-sm text-navy-800 placeholder-gray-400 focus:border-navy-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

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

          <div>
            <label className="block text-sm font-medium text-navy-800 mb-1.5">Password</label>
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
            <label className="block text-sm font-medium text-navy-800 mb-1.5">Confirm password</label>
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

          <label className="flex items-start gap-2.5 cursor-pointer">
            <button
              type="button"
              onClick={() => { setAgreeTerms(!agreeTerms); setError(''); }}
              className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${agreeTerms ? 'bg-navy-800 border-navy-800' : 'border-gray-300 bg-white'}`}
            >
              {agreeTerms && <Check size={14} className="text-white" />}
            </button>
            <span className="text-xs text-gray-600">
              I agree to the{' '}
              <Link to="/profile/terms" className="text-navy-600 font-medium">Terms & Conditions</Link> and{' '}
              <Link to="/profile/privacy" className="text-navy-600 font-medium">Privacy Policy</Link>
            </span>
          </label>

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
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400 font-medium">or sign up with</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={() => handleSocial('google')}
            disabled={socialLoading === 'google'}
            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white border border-gray-200 text-sm font-medium text-navy-800 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {socialLoading === 'google' ? (
              <div className="w-4 h-4 border-2 border-navy-200 border-t-navy-800 rounded-full animate-spin" />
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            )}
            Google
          </button>
          <button
            onClick={() => handleSocial('facebook')}
            disabled={socialLoading === 'facebook'}
            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white border border-gray-200 text-sm font-medium text-navy-800 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {socialLoading === 'facebook' ? (
              <div className="w-4 h-4 border-2 border-navy-200 border-t-navy-800 rounded-full animate-spin" />
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#1877F2" d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z"/></svg>
            )}
            Facebook
          </button>
        </div>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/signin" className="text-navy-600 font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
