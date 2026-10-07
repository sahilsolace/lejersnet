import type { Subscription, Order } from '@/types';

// Mock subscription service — simulates Stripe subscription management.
// In production, replace with Stripe Billing API:
// https://stripe.com/docs/billing/subscriptions/overview

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const subscriptionService = {
  async createSubscription(plan: string, price: number): Promise<Subscription> {
    await delay(500);
    return {
      id: Math.random().toString(36).substring(2, 11),
      plan,
      price,
      status: 'active',
      startDate: new Date().toISOString(),
      renewalDate: new Date(Date.now() + 30 * 86400000).toISOString(),
      endDate: null,
    };
  },

  async cancelSubscription(_id: string): Promise<{ success: boolean }> {
    await delay(500);
    return { success: true };
  },
};

// Mock payment service — simulates Stripe Payment Intent.
// Prototype – no real payment.
export const paymentService = {
  async processPayment(
    cardNumber: string,
    expiry: string,
    cvc: string,
    _amount: number,
  ): Promise<{ success: boolean; error?: string }> {
    await delay(2000);
    if (cardNumber.replace(/\s/g, '').length < 12) {
      return { success: false, error: 'Invalid card number.' };
    }
    if (!expiry || expiry.length < 4) {
      return { success: false, error: 'Invalid expiry date.' };
    }
    if (cvc.length < 3) {
      return { success: false, error: 'Invalid CVC.' };
    }
    return { success: true };
  },

  async processApplePay(_amount: number): Promise<{ success: boolean }> {
    await delay(1500);
    return { success: true };
  },

  async processGooglePay(_amount: number): Promise<{ success: boolean }> {
    await delay(1500);
    return { success: true };
  },
};

export function createOrderFromSubscription(sub: Subscription): Omit<Order, 'id'> {
  const vat = sub.price * 0.2;
  return {
    orderNumber: `LN-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    date: new Date().toISOString(),
    amount: sub.price,
    vat,
    total: sub.price + vat,
    status: 'paid',
    paymentMethod: 'Visa •••• 4242',
    items: [{ name: `${sub.plan} – Monthly`, price: sub.price }],
    billing: {
      name: 'Sofie Hansen',
      email: 'sofie.hansen@email.com',
      address: 'Nørrebrogade 42, 2. th.',
      city: 'Copenhagen',
      postcode: '2200',
    },
  };
}
