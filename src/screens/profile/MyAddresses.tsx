import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { ScreenHeader } from '@/components/ScreenHeader';
import { StatusChip } from '@/components/StatusChip';
import { MapPin, Plus, Edit2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export function MyAddresses() {
  const navigate = useNavigate();
  const { addresses } = useStore();

  return (
    <div className="min-h-full bg-brand-light pb-8">
      <ScreenHeader
        title="My Addresses"
        rightAction={
          <button
            onClick={() => navigate('/address/add')}
            className="p-1.5 rounded-full bg-navy-800 text-white hover:bg-navy-900 transition-colors"
            title="Add Address"
          >
            <Plus size={18} />
          </button>
        }
      />

      <div className="px-4 py-4 space-y-4">
        {addresses.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-soft">
            <MapPin size={28} className="mx-auto text-gray-300 mb-2" />
            <h3 className="text-sm font-bold text-navy-800">No properties registered</h3>
            <p className="text-xs text-gray-400 mt-1 mb-4">
              Add your current or upcoming lease to manage inspections and documents.
            </p>
            <button
              onClick={() => navigate('/address/add')}
              className="px-4 py-2 rounded-xl bg-navy-800 text-white text-xs font-semibold"
            >
              Add New Address
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className="bg-white rounded-2xl p-4 shadow-soft hover:shadow-card transition-all flex items-start justify-between gap-3"
              >
                <div
                  onClick={() => navigate(`/address/edit/${addr.id}`)}
                  className="flex-1 min-w-0 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-bold text-navy-800 truncate">{addr.label}</h2>
                    <StatusChip
                      status={addr.status}
                      variant={
                        addr.status === 'current'
                          ? 'active'
                          : addr.status === 'upcoming'
                          ? 'upcoming'
                          : 'past'
                      }
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">
                    {addr.street} {addr.number}, {addr.city}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Moved in: {formatDate(addr.moveInDate)}
                  </p>
                </div>

                <button
                  onClick={() => navigate(`/address/edit/${addr.id}`)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-navy-800 hover:bg-gray-100 transition-colors flex-shrink-0"
                  title="Edit address"
                >
                  <Edit2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
