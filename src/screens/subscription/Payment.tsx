import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScreenHeader } from '@/components/ScreenHeader';
import { paymentService, subscriptionService, createOrderFromSubscription } from '@/services/subscriptionService';
import { useStore } from '@/store/useStore';
import { CreditCard, Lock, AlertCircle, Apple, Smartphone } from 'lucide-react';

export function Payment() {
  const navigate = useNavigate();
  const { addSubscription, addOrder } = useStore();

  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardName, setCardName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [walletLoading, setWalletLoading] = useState<string | null>(null);

  const billing = JSON.parse(sessionStorage.getItem('checkout-billing') ?? '{}');
  const total = billing.total ?? 58.8;

  const formatCardNumber = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 2) return digits.slice(0, 2) + '/' + digits.slice(2);
    return digits;
  };

  const completePayment = async (method: string) => {
    setLoading(true);
    setError('');

    const sub = await subscriptionService.createSubscription('LejersNet Membership', 49);
    const order = createOrderFromSubscription(sub);
    order.paymentMethod = method;
    order.amount = billing.total ? billing.total - (billing.total * 0.2 / 1.2) : 49;
    order.billing = {
      name: billing.name ?? '',
      email: billing.email ?? '',
      address: billing.address ?? '',
      city: billing.city ?? '',
      postcode: billing.postcode ?? '',
    };

    addSubscription(sub);
    addOrder(order);

    sessionStorage.removeItem('checkout-billing');
    setLoading(false);
    navigate('/payment-success');
  };

  const handleCardPayment = async () => {
    setError('');
    if (cardNumber.replace(/\s/g, '').length < 12) { setError('Please enter a valid card number.'); return; }
    if (expiry.length < 4) { setError('Please enter a valid expiry date.'); return; }
    if (cvc.length < 3) { setError('Please enter a valid CVC.'); return; }
    if (!cardName.trim()) { setError('Please enter the cardholder name.'); return; }

    setLoading(true);
    const result = await paymentService.processPayment(cardNumber, expiry, cvc, total);
    setLoading(false);

    if (!result.success) {
      setError(result.error ?? 'Payment failed. Please try again.');
      return;
    }

    completePayment(`Visa •••• ${cardNumber.slice(-4)}`);
  };

  const handleWallet = async (type: 'apple' | 'google') => {
    setWalletLoading(type);
    const result = type === 'apple'
      ? await paymentService.processApplePay(total)
      : await paymentService.processGooglePay(total);
    setWalletLoading(null);

    if (result.success) {
      completePayment(type === 'apple' ? 'Apple Pay' : 'Google Pay');
    } else {
      setError('Payment failed. Please try again.');
    }
  };

  return (
    <div className="min-h-full bg-brand-light">
      <ScreenHeader title="Payment" />

      <div className="px-4 py-4 space-y-4">
        {/* Prototype notice */}
        <div className="bg-accent-50 border border-accent-200 rounded-xl p-3 flex items-center gap-2">
          <Lock size={16} className="text-accent-600 flex-shrink-0" />
          <p className="text-xs text-accent-700 font-medium">Prototype – no real payment will be processed.</p>
        </div>

        {/* Amount */}
        <div className="bg-navy-800 rounded-2xl p-5 text-center">
          <p className="text-xs text-white/50 mb-1">Amount to pay</p>
          <p className="text-3xl font-bold text-white">DKK {total.toFixed(2)}</p>
          <p className="text-xs text-white/50 mt-1">LejersNet Membership – Monthly</p>
        </div>

        {/* Wallet payments */}
        <div className="space-y-2">
          <button
            onClick={() => handleWallet('apple')}
            disabled={!!walletLoading}
            className="w-full py-3.5 rounded-xl bg-black text-white font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {walletLoading === 'apple' ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Apple size={20} />
            )}
            Apple Pay
          </button>
          <button
            onClick={() => handleWallet('google')}
            disabled={!!walletLoading}
            className="w-full py-3.5 rounded-xl bg-white border border-gray-200 text-navy-800 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {walletLoading === 'google' ? (
              <div className="w-4 h-4 border-2 border-navy-200 border-t-navy-800 rounded-full animate-spin" />
            ) : (
              <Smartphone size={20} />
            )}
            Google Pay
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400 font-medium">or pay by card</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Card form */}
        <div className="bg-white rounded-2xl p-5 shadow-soft space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Card number</label>
            <div className="relative">
              <CreditCard size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => { setCardNumber(formatCardNumber(e.target.value)); setError(''); }}
                placeholder="4242 4242 4242 4242"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-brand-light border border-gray-200 text-sm text-navy-800 placeholder-gray-400 focus:border-navy-500 focus:outline-none transition-colors font-mono"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Expiry</label>
              <input
                type="text"
                value={expiry}
                onChange={(e) => { setExpiry(formatExpiry(e.target.value)); setError(''); }}
                placeholder="MM/YY"
                className="w-full px-3 py-2.5 rounded-xl bg-brand-light border border-gray-200 text-sm text-navy-800 placeholder-gray-400 focus:border-navy-500 focus:outline-none transition-colors font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">CVC</label>
              <input
                type="text"
                value={cvc}
                onChange={(e) => { setCvc(e.target.value.replace(/\D/g, '').slice(0, 4)); setError(''); }}
                placeholder="123"
                className="w-full px-3 py-2.5 rounded-xl bg-brand-light border border-gray-200 text-sm text-navy-800 placeholder-gray-400 focus:border-navy-500 focus:outline-none transition-colors font-mono"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Cardholder name</label>
            <input
              type="text"
              value={cardName}
              onChange={(e) => { setCardName(e.target.value); setError(''); }}
              placeholder="Sofie Hansen"
              className="w-full px-3 py-2.5 rounded-xl bg-brand-light border border-gray-200 text-sm text-navy-800 placeholder-gray-400 focus:border-navy-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5 text-sm text-red-700">
            <AlertCircle size={16} className="flex-shrink-0" />
            {error}
          </div>
        )}

        <button
          onClick={handleCardPayment}
          disabled={loading}
          className="w-full py-3.5 rounded-xl bg-navy-800 text-white font-semibold text-sm hover:bg-navy-900 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
          {loading ? 'Processing…' : `Pay DKK ${total.toFixed(2)}`}
        </button>
      </div>
    </div>
  );
}
