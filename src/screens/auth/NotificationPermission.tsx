import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Check } from 'lucide-react';
import { notificationService } from '@/services/notificationService';
import { useStore } from '@/store/useStore';

export function NotificationPermission() {
  const navigate = useNavigate();
  const { updateSettings } = useStore();
  const [loading, setLoading] = useState(false);
  const [granted, setGranted] = useState(false);

  const handleEnable = async () => {
    setLoading(true);
    const result = await notificationService.requestPermission();
    if (result.granted) {
      await notificationService.subscribeToTopic('lejersnet-all');
      updateSettings({ notificationsEnabled: true });
      setGranted(true);
      setTimeout(() => navigate('/home', { replace: true }), 600);
    } else {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    updateSettings({ notificationsEnabled: false });
    navigate('/home', { replace: true });
  };

  return (
    <div className="min-h-screen bg-navy-800 flex flex-col items-center justify-center px-8">
      <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center mb-6 backdrop-blur">
        {granted ? (
          <Check size={36} className="text-green-400" />
        ) : (
          <Bell size={36} className="text-accent-400" />
        )}
      </div>
      <h1 className="text-lg font-bold text-white mb-2 text-center">
        {granted ? 'Notifications enabled!' : 'Stay updated'}
      </h1>
      <p className="text-sm text-white/60 text-center mb-8 max-w-xs">
        {granted
          ? 'You\'ll receive important updates about your tenancy and subscription.'
          : 'Enable notifications to get tips, reminders about your subscription, and important updates about your tenancy.'}
      </p>

      {!granted && (
        <div className="w-full max-w-xs space-y-3">
          <button
            onClick={handleEnable}
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-accent-500 text-navy-900 font-semibold text-sm hover:bg-accent-400 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <div className="w-4 h-4 border-2 border-navy-900/30 border-t-navy-900 rounded-full animate-spin" />}
            {loading ? 'Enabling…' : 'Enable notifications'}
          </button>
          <button
            onClick={handleSkip}
            className="w-full py-3.5 rounded-xl border border-white/20 text-white font-medium text-sm hover:bg-white/5 transition-colors"
          >
            Maybe later
          </button>
        </div>
      )}
    </div>
  );
}
