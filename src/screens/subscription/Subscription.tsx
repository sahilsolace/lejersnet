import { useNavigate } from 'react-router-dom';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Check, Shield, RotateCcw, XCircle } from 'lucide-react';

export function Subscription() {
  const navigate = useNavigate();

  const benefits = [
    'Store your rental contract securely',
    'Upload photos at move-in and move-out',
    'Keep all documents in one private place',
    'Get help when in doubt',
    'Private member area',
    'Side-by-side photo comparison at move-out',
  ];

  return (
    <div className="min-h-full bg-brand-light">
      <ScreenHeader title="Membership" />

      <div className="px-4 py-4 space-y-4">
        {/* Plan card */}
        <div className="bg-navy-800 rounded-2xl p-5 shadow-card">
          <div className="flex items-center gap-2 mb-3">
            <Shield size={20} className="text-accent-400" />
            <h2 className="text-base font-bold text-white">LejersNet Membership</h2>
          </div>
          <div className="flex items-baseline gap-1 mb-1">
            <span className="text-3xl font-bold text-white">DKK 49</span>
            <span className="text-sm text-white/60">/ month</span>
          </div>
          <p className="text-xs text-white/50">Billed monthly · Cancel anytime</p>
        </div>

        {/* Benefits */}
        <div className="bg-white rounded-2xl p-5 shadow-soft">
          <h3 className="text-sm font-semibold text-navy-800 mb-3">What's included</h3>
          <div className="space-y-2.5">
            {benefits.map((b, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check size={12} className="text-green-600" />
                </div>
                <p className="text-sm text-gray-700">{b}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Guarantees */}
        <div className="bg-white rounded-2xl p-4 shadow-soft space-y-3">
          <div className="flex items-center gap-2.5">
            <RotateCcw size={18} className="text-navy-600" />
            <div>
              <p className="text-sm font-medium text-navy-800">No commitment</p>
              <p className="text-xs text-gray-500">Cancel anytime, no questions asked</p>
            </div>
          </div>
          <div className="h-px bg-gray-100" />
          <div className="flex items-center gap-2.5">
            <Shield size={18} className="text-navy-600" />
            <div>
              <p className="text-sm font-medium text-navy-800">14-day satisfaction guarantee</p>
              <p className="text-xs text-gray-500">Full refund if you're not satisfied</p>
            </div>
          </div>
          <div className="h-px bg-gray-100" />
          <div className="flex items-center gap-2.5">
            <XCircle size={18} className="text-navy-600" />
            <div>
              <p className="text-sm font-medium text-navy-800">Cancel anytime</p>
              <p className="text-xs text-gray-500">No hidden fees or penalties</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate('/checkout')}
          className="w-full py-3.5 rounded-xl bg-navy-800 text-white font-semibold text-sm hover:bg-navy-900 transition-colors"
        >
          Continue to checkout
        </button>
      </div>
    </div>
  );
}
