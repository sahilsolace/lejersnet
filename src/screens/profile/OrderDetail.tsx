import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { useToast } from '@/store/useToast';
import { ScreenHeader } from '@/components/ScreenHeader';
import { StatusChip } from '@/components/StatusChip';
import { formatDate } from '@/lib/utils';
import { Download, CreditCard } from 'lucide-react';

export function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { orders } = useStore();
  const { addToast } = useToast();

  const order = orders.find((o) => o.id === id);

  if (!order) {
    return (
      <div className="min-h-full bg-brand-light p-6 text-center">
        <ScreenHeader title="Order Detail" />
        <p className="text-sm text-gray-500 mt-8">Order not found.</p>
        <button
          onClick={() => navigate('/profile/orders')}
          className="mt-4 px-4 py-2 rounded-xl bg-navy-800 text-white text-xs"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  const handleDownloadInvoice = () => {
    addToast(`Invoice ${order.orderNumber}.pdf downloaded.`, 'success');
  };

  return (
    <div className="min-h-full bg-brand-light pb-8">
      <ScreenHeader title={`Order ${order.orderNumber}`} />

      <div className="px-4 py-4 space-y-4">
        {/* Receipt card */}
        <div className="bg-white rounded-2xl p-5 shadow-soft space-y-4">
          <div className="flex items-start justify-between border-b border-gray-100 pb-3">
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Receipt
              </span>
              <h2 className="text-base font-bold text-navy-800">{order.orderNumber}</h2>
              <p className="text-xs text-gray-500 mt-0.5">{formatDate(order.date)}</p>
            </div>
            <StatusChip status={order.status} variant="paid" />
          </div>

          {/* Line items */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-navy-800 uppercase tracking-wider block">
              Items
            </span>
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-xs py-1">
                <span className="text-navy-800 font-medium">{item.name}</span>
                <span className="text-navy-800 font-semibold">DKK {item.price.toFixed(2)}</span>
              </div>
            ))}
          </div>

          {/* Subtotals & Total */}
          <div className="border-t border-gray-100 pt-3 space-y-1.5 text-xs">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal</span>
              <span>DKK {order.amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Moms / VAT (25%)</span>
              <span>DKK {order.vat.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-navy-800 pt-2 border-t border-gray-100">
              <span>Total Paid</span>
              <span>DKK {order.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment & Billing */}
          <div className="bg-brand-light rounded-xl p-3 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-navy-800 font-medium">
              <CreditCard size={14} className="text-navy-600" />
              <span>Paid via {order.paymentMethod}</span>
            </div>
            {order.billing && (
              <div className="text-[11px] text-gray-500 pt-1 border-t border-gray-200/60">
                <p className="font-semibold text-navy-800">{order.billing.name}</p>
                <p>{order.billing.address}</p>
                <p>
                  {order.billing.postcode} {order.billing.city}
                </p>
                <p>{order.billing.email}</p>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={handleDownloadInvoice}
          className="w-full py-3.5 rounded-xl bg-navy-800 hover:bg-navy-900 text-white font-semibold text-xs transition-colors shadow-soft flex items-center justify-center gap-2"
        >
          <Download size={15} />
          Download PDF Invoice
        </button>
      </div>
    </div>
  );
}
