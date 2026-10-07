import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { wixService } from '@/services/wixService';
import { notificationService } from '@/services/notificationService';
import { useStore } from '@/store/useStore';
import { RefreshCw, Check } from 'lucide-react';

export function ProfileSync() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<'syncing' | 'done'>('syncing');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const sync = async () => {
      const interval = setInterval(() => {
        setProgress((p) => Math.min(p + 8, 90));
      }, 120);

      const profile = await wixService.getMemberProfile();

      if (cancelled) return;

      clearInterval(interval);
      setProgress(100);

      const { user, setUser, updateSettings, settings } = useStore.getState();
      if (user) {
        setUser({ ...user, ...profile });
      }

      updateSettings({ lastSyncedAt: new Date().toISOString() });

      // Subscribe to broadcast topic (FCM stub)
      if (settings.notificationsEnabled) {
        await notificationService.subscribeToTopic('lejersnet-all');
      }

      setTimeout(() => {
        if (cancelled) return;
        setPhase('done');
        setTimeout(() => {
          navigate('/notification-permission');
        }, 800);
      }, 400);
    };

    sync();

    return () => { cancelled = true; };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-navy-800 flex flex-col items-center justify-center px-8">
      <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center mb-6 backdrop-blur">
        {phase === 'syncing' ? (
          <RefreshCw size={36} className="text-white animate-spin" />
        ) : (
          <Check size={36} className="text-green-400" />
        )}
      </div>
      <h1 className="text-lg font-bold text-white mb-2 text-center">
        {phase === 'syncing' ? 'Syncing your profile' : 'Profile synced!'}
      </h1>
      <p className="text-sm text-white/60 text-center mb-8">
        {phase === 'syncing'
          ? 'Pulling your details from LejersNet.com…'
          : 'You\'re all set. Welcome to LejersNet.'}
      </p>

      {phase === 'syncing' && (
        <div className="w-full max-w-xs">
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-accent-500 rounded-full transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-white/40 text-center mt-2">{progress}%</p>
        </div>
      )}

      <div className="mt-8 space-y-2 w-full max-w-xs">
        {[
          { label: 'Profile data', done: progress > 30 },
          { label: 'Subscription status', done: progress > 55 },
          { label: 'Notification settings', done: progress > 80 },
        ].map((step, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            {step.done ? (
              <Check size={16} className="text-green-400" />
            ) : (
              <div className="w-4 h-4 border-1.5 border-white/20 border-t-white/60 rounded-full animate-spin" />
            )}
            <span className={step.done ? 'text-white/80' : 'text-white/40'}>{step.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
