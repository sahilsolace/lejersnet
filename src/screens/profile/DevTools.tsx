import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { useToast } from '@/store/useToast';
import { ScreenHeader } from '@/components/ScreenHeader';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { notificationService } from '@/services/notificationService';
import {
  RotateCcw,
  Bell,
  Shield,
  Trash2,
  Database,
  CheckCircle2,
} from 'lucide-react';

export function DevTools() {
  const {
    resetDB,
    addNotification,
    addresses,
    media,
    orders,
    notifications,
    addSubscription,
    cancelSubscription,
    getActiveSubscription,
  } = useStore();
  const { addToast } = useToast();

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const activeSub = getActiveSubscription();

  const handleResetData = () => {
    resetDB();
    addToast('Database reset to initial demo seed data.', 'success');
    setShowResetConfirm(false);
  };

  const handleSimulateNotification = async () => {
    const notif = await notificationService.simulateBroadcast(
      'Move-Out Reminder',
      'Remember to book your final joint move-out inspection at least 1 week before handover.',
    );
    addNotification({
      title: notif.title,
      body: notif.body,
      topic: notif.topic,
    });
    addToast('Test broadcast notification dispatched!', 'success');
  };

  const handleToggleSubscription = () => {
    if (activeSub) {
      cancelSubscription(activeSub.id);
      addToast('Membership toggled to cancelled.', 'info');
    } else {
      addSubscription({
        plan: 'LejersNet Membership',
        price: 49,
        status: 'active',
        startDate: new Date().toISOString(),
        renewalDate: new Date(Date.now() + 30 * 86400000).toISOString(),
        endDate: null,
      });
      addToast('Active membership plan generated.', 'success');
    }
  };

  const handleClearCache = () => {
    sessionStorage.clear();
    addToast('Session storage cache cleared.', 'info');
  };

  return (
    <div className="min-h-full bg-brand-light pb-8">
      <ScreenHeader title="Developer & QA Tools" />

      <div className="px-4 py-4 space-y-4">
        {/* State Metrics */}
        <div className="bg-white rounded-2xl p-4 shadow-soft space-y-3">
          <div className="flex items-center gap-2">
            <Database size={16} className="text-navy-700" />
            <h3 className="text-xs font-bold text-navy-800 uppercase tracking-wide">
              Store Metrics
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-brand-light p-2.5 rounded-xl">
              <span className="text-gray-400 block text-[10px]">Addresses</span>
              <span className="font-bold text-navy-800">{addresses.length}</span>
            </div>
            <div className="bg-brand-light p-2.5 rounded-xl">
              <span className="text-gray-400 block text-[10px]">Media Items</span>
              <span className="font-bold text-navy-800">{media.length}</span>
            </div>
            <div className="bg-brand-light p-2.5 rounded-xl">
              <span className="text-gray-400 block text-[10px]">Orders</span>
              <span className="font-bold text-navy-800">{orders.length}</span>
            </div>
            <div className="bg-brand-light p-2.5 rounded-xl">
              <span className="text-gray-400 block text-[10px]">Notifications</span>
              <span className="font-bold text-navy-800">{notifications.length}</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="bg-white rounded-2xl p-4 shadow-soft space-y-2.5">
          <h3 className="text-xs font-bold text-navy-800 uppercase tracking-wide mb-1">
            Simulation Actions
          </h3>

          <button
            onClick={handleSimulateNotification}
            className="w-full py-2.5 px-3 rounded-xl bg-accent-50 hover:bg-accent-100 text-accent-700 text-xs font-semibold flex items-center justify-between transition-colors"
          >
            <div className="flex items-center gap-2">
              <Bell size={15} />
              <span>Trigger Test Push Notification</span>
            </div>
            <CheckCircle2 size={15} />
          </button>

          <button
            onClick={handleToggleSubscription}
            className="w-full py-2.5 px-3 rounded-xl bg-navy-50 hover:bg-navy-100 text-navy-800 text-xs font-semibold flex items-center justify-between transition-colors"
          >
            <div className="flex items-center gap-2">
              <Shield size={15} />
              <span>Toggle Membership Status</span>
            </div>
            <span className="text-[10px] text-gray-400">
              {activeSub ? 'Active -> Cancel' : 'None -> Active'}
            </span>
          </button>

          <button
            onClick={handleClearCache}
            className="w-full py-2.5 px-3 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-medium flex items-center gap-2 transition-colors"
          >
            <Trash2 size={15} />
            <span>Clear Session Storage</span>
          </button>
        </div>

        {/* Hard Reset */}
        <div className="bg-white rounded-2xl p-4 shadow-soft space-y-3">
          <h3 className="text-xs font-bold text-red-600 uppercase tracking-wide">
            Factory Reset
          </h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Resets all addresses, media, orders, and user settings back to the initial demo seed
            state.
          </p>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-soft"
          >
            <RotateCcw size={15} />
            Reset Database to Seed State
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={showResetConfirm}
        title="Reset All Data"
        message="Are you sure you want to reset the mock database? All added addresses, documents, and pictures will be replaced with initial seed data."
        confirmLabel="Reset Data"
        variant="danger"
        onConfirm={handleResetData}
        onCancel={() => setShowResetConfirm(false)}
      />
    </div>
  );
}
