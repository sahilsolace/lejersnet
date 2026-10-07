import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { ScreenHeader } from '@/components/ScreenHeader';
import { StatusChip } from '@/components/StatusChip';
import { ShoppingBag, ChevronRight, Receipt } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export function MyOrders() {
  const navigate = useNavigate();
  const { orders } = useStore();

  return (
    <div className="min-h-full bg-brand-light pb-8">
      <ScreenHeader title="My Orders & Receipts" />

      <div className="px-4 py-4 space-y-4">
        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-soft">
            <ShoppingBag size={28} className="mx-auto text-gray-300 mb-2" />
            <h3 className="text-sm font-bold text-navy-800">No orders yet</h3>
            <p className="text-xs text-gray-400 mt-1">
              Your membership payments and receipts will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {orders.map((order) => (
              <div
                key={order.id}
                onClick={() => navigate(`/profile/orders/${order.id}`)}
                className="bg-white rounded-2xl p-4 shadow-soft hover:shadow-card transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-navy-50 text-navy-700 flex items-center justify-center flex-shrink-0">
                    <Receipt size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-navy-800">{order.orderNumber}</p>
                      <StatusChip status={order.status} variant="paid" />
                    </div>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {formatDate(order.date)} · {order.paymentMethod}
                    </p>
                    <p className="text-xs font-semibold text-navy-800 mt-0.5">
                      DKK {order.total.toFixed(2)}
                    </p>
                  </div>
                </div>

                <ChevronRight size={18} className="text-gray-300" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
