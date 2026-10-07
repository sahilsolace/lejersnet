import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/store/useToast';
import { ScreenHeader } from '@/components/ScreenHeader';
import { passwordStrength } from '@/lib/utils';
import { Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

export function ChangePassword() {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [error, setError] = useState('');

  const strength = passwordStrength(newPassword);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      setError('Please enter your current password.');
      return;
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    addToast('Password changed successfully.', 'success');
    navigate(-1);
  };

  return (
    <div className="min-h-full bg-brand-light pb-8">
      <ScreenHeader title="Change Password" />

      <form onSubmit={handleSave} className="px-4 py-4 space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle size={16} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="bg-white rounded-2xl p-4 shadow-soft space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Current Password *
            </label>
            <div className="relative">
              <input
                type={showCurrent ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => {
                  setCurrentPassword(e.target.value);
                  setError('');
                }}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-navy-800 focus:outline-none pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">New Password *</label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setError('');
                }}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-navy-800 focus:outline-none pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {newPassword.length > 0 && (
              <div className="mt-2 space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-gray-500">Strength</span>
                  <span style={{ color: strength.color }} className="font-semibold">
                    {strength.label}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${(strength.score / 4) * 100}%`,
                      backgroundColor: strength.color,
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Confirm New Password *
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setError('');
              }}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-navy-800 focus:outline-none"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 rounded-xl bg-navy-800 hover:bg-navy-900 text-white font-semibold text-sm transition-colors shadow-soft flex items-center justify-center gap-2"
        >
          <Lock size={16} />
          Update Password
        </button>
      </form>
    </div>
  );
}
