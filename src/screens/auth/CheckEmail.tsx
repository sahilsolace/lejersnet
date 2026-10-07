import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Mail, ChevronLeft } from 'lucide-react';

export function CheckEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as { email?: string })?.email ?? 'your email';

  return (
    <div className="min-h-screen bg-brand-light flex flex-col items-center justify-center px-6">
      <Link to="/forgot-password" className="absolute top-10 left-4 flex items-center gap-1 text-sm text-navy-600 font-medium">
        <ChevronLeft size={20} /> Back
      </Link>
      <div className="w-20 h-20 rounded-full bg-navy-50 flex items-center justify-center mb-6">
        <Mail size={36} className="text-navy-600" />
      </div>
      <h1 className="text-xl font-bold text-navy-800 mb-2 text-center">Check your email</h1>
      <p className="text-sm text-gray-600 text-center max-w-xs mb-2">
        We've sent a password reset link to
      </p>
      <p className="text-sm font-semibold text-navy-800 mb-8">{email}</p>
      <button
        onClick={() => navigate('/reset-password')}
        className="w-full max-w-xs py-3.5 rounded-xl bg-navy-800 text-white font-semibold text-sm hover:bg-navy-900 transition-colors mb-3"
      >
        I have the link – continue
      </button>
      <button
        onClick={() => navigate('/signin')}
        className="text-sm text-navy-600 font-medium hover:underline"
      >
        Back to sign in
      </button>
    </div>
  );
}
