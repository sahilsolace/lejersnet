import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { useToast } from '@/store/useToast';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Mail, AlertCircle } from 'lucide-react';

export function ChangeEmail() {
  const navigate = useNavigate();
  const { user, setUser } = useStore();
  const { addToast } = useToast();

  const [newEmail, setNewEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [error, setError] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!newEmail.includes('@') || !newEmail.includes('.')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (newEmail !== confirmEmail) {
      setError('Emails do not match.');
      return;
    }
    if (newEmail.toLowerCase() === user.email.toLowerCase()) {
      setError('New email must be different from current email.');
      return;
    }

    setUser({ ...user, email: newEmail.trim() });
    addToast('Email updated successfully.', 'success');
    navigate(-1);
  };

  return (
    <div className="min-h-full bg-brand-light pb-8">
      <ScreenHeader title="Change Email" />

      <form onSubmit={handleSave} className="px-4 py-4 space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle size={16} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="bg-white rounded-2xl p-4 shadow-soft space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Current Email</label>
            <p className="text-sm font-semibold text-navy-800">{user?.email}</p>
          </div>

          <div className="border-t border-gray-100 pt-3">
            <label className="block text-xs font-medium text-gray-700 mb-1">New Email *</label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => {
                setNewEmail(e.target.value);
                setError('');
              }}
              placeholder="new.email@example.com"
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-navy-800 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Confirm New Email *
            </label>
            <input
              type="email"
              value={confirmEmail}
              onChange={(e) => {
                setConfirmEmail(e.target.value);
                setError('');
              }}
              placeholder="Confirm new email"
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-navy-800 focus:outline-none"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 rounded-xl bg-navy-800 hover:bg-navy-900 text-white font-semibold text-sm transition-colors shadow-soft flex items-center justify-center gap-2"
        >
          <Mail size={16} />
          Update Email
        </button>
      </form>
    </div>
  );
}
