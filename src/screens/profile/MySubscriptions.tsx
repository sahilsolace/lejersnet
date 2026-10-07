import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { useToast } from '@/store/useToast';
import { ScreenHeader } from '@/components/ScreenHeader';
import { StatusChip } from '@/components/StatusChip';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { Shield, Check, ArrowRight } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export function MySubscriptions() {
  const navigate = useNavigate();
  const { subscriptions, cancelSubscription, getActiveSubscription } = useStore();
  const { addToast } = useToast();

  const [cancelId, setCancelId] = useState<string | null>(null);

  const activeSub = getActiveSubscription();
  const pastSubs = subscriptions.filter((s) => s.id !== activeSub?.id);

  const handleCancel = () => {
    if (!cancelId) return;
    cancelSubscription(cancelId);
    addToast('Subscription cancelled. You retain access until period end.', 'info');
    setCancelId(null);
  };

  return (
    <div className="min-h-full bg-brand-light pb-8">
      <ScreenHeader title="My Subscriptions" />

      <div className="px-4 py-4 space-y-4">
        {/* Active plan card */}
        {activeSub ? (
          <div className="bg-white rounded-2xl p-5 shadow-soft border-2 border-green-500/30 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-green-600 uppercase tracking-wider">
                  Current Plan
                </span>
                <h2 className="text-base font-bold text-navy-800">{activeSub.plan}</h2>
                <p className="text-sm font-semibold text-accent-600 mt-0.5">
                  DKK {activeSub.price}/month
                </p>
              </div>
              <StatusChip status={activeSub.status} variant="active" />
            </div>

            <div className="bg-brand-light rounded-xl p-3 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-gray-400 block text-[10px]">Started</span>
                <span className="text-navy-800 font-medium">{formatDate(activeSub.startDate)}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px]">Next Renewal</span>
                <span className="text-navy-800 font-medium">
                  {formatDate(activeSub.renewalDate)}
                </span>
              </div>
            </div>

            <div className="space-y-1.5 pt-1 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <Check size={14} className="text-green-600 flex-shrink-0" />
                <span>Unlimited document & move-in photo storage</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={14} className="text-green-600 flex-shrink-0" />
                <span>Move-in and move-out discrepancy comparison</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={14} className="text-green-600 flex-shrink-0" />
                <span>Tenant legal assistance helpline support</span>
              </div>
            </div>

            <button
              onClick={() => setCancelId(activeSub.id)}
              className="w-full py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold transition-colors"
            >
              Cancel Subscription
            </button>
          </div>
        ) : (
          <div className="bg-navy-800 text-white rounded-2xl p-5 shadow-card space-y-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <Shield size={20} className="text-accent-400" />
            </div>
            <div>
              <h3 className="text-base font-bold">No active membership</h3>
              <p className="text-xs text-white/70 mt-1">
                Protect your tenancy deposit with unlimited photo documentation and legal defense.
              </p>
            </div>
            <button
              onClick={() => navigate('/subscription')}
              className="w-full py-3 rounded-xl bg-accent-500 hover:bg-accent-400 text-navy-900 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              Get Membership (DKK 49/mo)
              <ArrowRight size={14} />
            </button>
          </div>
        )}

        {/* Past Subscriptions */}
        {pastSubs.length > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-soft space-y-3">
            <h3 className="text-xs font-bold text-navy-800 uppercase tracking-wide">
              Subscription History
            </h3>

            <div className="divide-y divide-gray-100">
              {pastSubs.map((sub) => (
                <div key={sub.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-navy-800">{sub.plan}</p>
                    <p className="text-[10px] text-gray-400">
                      {formatDate(sub.startDate)} –{' '}
                      {sub.endDate ? formatDate(sub.endDate) : 'Ended'}
                    </p>
                  </div>
                  <StatusChip status={sub.status} variant="cancelled" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!cancelId}
        title="Cancel Membership"
        message="Are you sure you want to cancel your LejersNet membership? You will retain access until the end of the current billing cycle."
        confirmLabel="Cancel Subscription"
        variant="danger"
        onConfirm={handleCancel}
        onCancel={() => setCancelId(null)}
      />
    </div>
  );
}
