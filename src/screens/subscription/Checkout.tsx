import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScreenHeader } from '@/components/ScreenHeader';
import { useStore } from '@/store/useStore';
import { useToast } from '@/store/useToast';
import { Tag, Check, AlertCircle } from 'lucide-react';

export function Checkout() {
  const navigate = useNavigate();
  const { user } = useStore();
  const { addToast } = useToast();

  const [name, setName] = useState(user?.fullName ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postcode, setPostcode] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');
  const [error, setError] = useState('');

  const price = 49;
  const vat = price * 0.2;
  const discount = promoApplied ? 10 : 0;
  const total = price + vat - discount;

  const validate = () => {
    if (!name.trim()) { setError('Please enter your name.'); return false; }
    if (!email || !email.includes('@')) { setError('Please enter a valid email.'); return false; }
    if (!address.trim()) { setError('Please enter your address.'); return false; }
    if (!city.trim()) { setError('Please enter your city.'); return false; }
    if (!postcode.trim()) { setError('Please enter your postcode.'); return false; }
    return true;
  };

  const handleApplyPromo = () => {
    setPromoError('');
    if (promoCode.toUpperCase() === 'LEJER10') {
      setPromoApplied(true);
      addToast('Promo code applied: DKK 10 off!', 'success');
    } else {
      setPromoError('Invalid promo code. Try LEJER10.');
    }
  };

  const handleContinue = () => {
    setError('');
    if (!validate()) return;
    // Stash billing details in sessionStorage for the payment step
    sessionStorage.setItem('checkout-billing', JSON.stringify({ name, email, address, city, postcode, total, discount }));
    navigate('/payment');
  };

  return (
    <div className="min-h-full bg-brand-light">
      <ScreenHeader title="Checkout" />

      <div className="px-4 py-4 space-y-4">
        {/* Order summary */}
        <div className="bg-white rounded-2xl p-5 shadow-soft">
          <h3 className="text-sm font-semibold text-navy-800 mb-3">Order summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">LejersNet Membership – Monthly</span>
              <span className="font-medium text-navy-800">DKK {price}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">VAT (20%)</span>
              <span className="font-medium text-navy-800">DKK {vat.toFixed(2)}</span>
            </div>
            {promoApplied && (
              <div className="flex justify-between text-green-700">
                <span>Discount (LEJER10)</span>
                <span className="font-medium">-DKK {discount}</span>
              </div>
            )}
            <div className="h-px bg-gray-100 my-2" />
            <div className="flex justify-between">
              <span className="font-semibold text-navy-800">Total</span>
              <span className="font-bold text-navy-800">DKK {total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Promo code */}
        <div className="bg-white rounded-2xl p-4 shadow-soft">
          <label className="block text-sm font-medium text-navy-800 mb-1.5">Promo code</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Tag size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={promoCode}
                onChange={(e) => { setPromoCode(e.target.value); setPromoError(''); }}
                placeholder="Enter code"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-brand-light border border-gray-200 text-sm text-navy-800 placeholder-gray-400 focus:border-navy-500 focus:outline-none transition-colors uppercase"
              />
            </div>
            <button
              onClick={handleApplyPromo}
              disabled={!promoCode || promoApplied}
              className="px-4 py-2.5 rounded-xl bg-navy-100 text-navy-700 font-medium text-sm hover:bg-navy-200 transition-colors disabled:opacity-50"
            >
              {promoApplied ? <Check size={16} className="text-green-600" /> : 'Apply'}
            </button>
          </div>
          {promoError && <p className="text-xs text-red-600 mt-1.5">{promoError}</p>}
          {promoApplied && <p className="text-xs text-green-600 mt-1.5">Code applied successfully!</p>}
        </div>

        {/* Billing details */}
        <div className="bg-white rounded-2xl p-5 shadow-soft space-y-3">
          <h3 className="text-sm font-semibold text-navy-800">Billing details</h3>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Full name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(''); }}
              className="w-full px-3 py-2.5 rounded-xl bg-brand-light border border-gray-200 text-sm text-navy-800 focus:border-navy-500 focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
              className="w-full px-3 py-2.5 rounded-xl bg-brand-light border border-gray-200 text-sm text-navy-800 focus:border-navy-500 focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => { setAddress(e.target.value); setError(''); }}
              placeholder="Street and number"
              className="w-full px-3 py-2.5 rounded-xl bg-brand-light border border-gray-200 text-sm text-navy-800 focus:border-navy-500 focus:outline-none transition-colors"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Postcode</label>
              <input
                type="text"
                value={postcode}
                onChange={(e) => { setPostcode(e.target.value); setError(''); }}
                placeholder="2200"
                className="w-full px-3 py-2.5 rounded-xl bg-brand-light border border-gray-200 text-sm text-navy-800 focus:border-navy-500 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => { setCity(e.target.value); setError(''); }}
                placeholder="Copenhagen"
                className="w-full px-3 py-2.5 rounded-xl bg-brand-light border border-gray-200 text-sm text-navy-800 focus:border-navy-500 focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5 text-sm text-red-700">
            <AlertCircle size={16} className="flex-shrink-0" />
            {error}
          </div>
        )}

        <button
          onClick={handleContinue}
          className="w-full py-3.5 rounded-xl bg-navy-800 text-white font-semibold text-sm hover:bg-navy-900 transition-colors"
        >
          Continue to payment
        </button>
      </div>
    </div>
  );
}
