import { useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';

export function PasswordResetSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-brand-light flex flex-col items-center justify-center px-6">
      <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mb-6 animate-scale-in">
        <CheckCircle2 size={40} className="text-green-600" />
      </div>
      <h1 className="text-xl font-bold text-navy-800 mb-2 text-center">Password reset!</h1>
      <p className="text-sm text-gray-600 text-center max-w-xs mb-8">
        Your password has been changed successfully. You can now sign in with your new password.
      </p>
      <button
        onClick={() => navigate('/signin')}
        className="w-full max-w-xs py-3.5 rounded-xl bg-navy-800 text-white font-semibold text-sm hover:bg-navy-900 transition-colors"
      >
        Back to sign in
      </button>
    </div>
  );
}
