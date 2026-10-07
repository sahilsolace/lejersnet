import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { useToast } from '@/store/useToast';
import { ScreenHeader } from '@/components/ScreenHeader';
import { StatusChip } from '@/components/StatusChip';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import {
  MapPin,
  Plus,
  Calendar,
  User,
  Phone,
  FileCheck2,
  Trash2,
  Edit2,
  ArrowRight,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { AddressStatus } from '@/types';

export function Addresses() {
  const navigate = useNavigate();
  const { addresses, inspections, media, deleteAddress } = useStore();
  const { addToast } = useToast();

  const [filter, setFilter] = useState<'all' | AddressStatus>('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filteredAddresses = addresses.filter((a) => {
    if (filter === 'all') return true;
    return a.status === filter;
  });

  const handleDelete = () => {
    if (!deleteId) return;
    deleteAddress(deleteId);
    addToast('Address and associated records removed.', 'success');
    setDeleteId(null);
  };

  return (
    <div className="min-h-full bg-brand-light pb-8">
      <ScreenHeader
        title="Housing Directory"
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
        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {(['all', 'current', 'upcoming', 'past'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-all ${
                filter === tab
                  ? 'bg-navy-800 text-white shadow-soft'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab === 'all' ? `All (${addresses.length})` : tab}
            </button>
          ))}
        </div>

        {/* Address Cards */}
        {filteredAddresses.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-soft">
            <div className="w-12 h-12 rounded-full bg-navy-50 flex items-center justify-center mx-auto mb-3">
              <MapPin size={24} className="text-navy-600" />
            </div>
            <h3 className="text-sm font-bold text-navy-800 mb-1">No addresses found</h3>
            <p className="text-xs text-gray-500 mb-4">
              {filter === 'all'
                ? 'Add your current or upcoming lease to start documenting.'
                : `No addresses with status "${filter}".`}
            </p>
            <button
              onClick={() => navigate('/address/add')}
              className="px-4 py-2 rounded-xl bg-navy-800 text-white text-xs font-medium hover:bg-navy-900 transition-colors"
            >
              Add New Address
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredAddresses.map((addr) => {
              const addrInspections = inspections.filter((i) => i.addressId === addr.id);
              const addrMedia = media.filter((m) => m.addressId === addr.id);
              const moveInInsp = addrInspections.find((i) => i.type === 'move_in');
              const moveOutInsp = addrInspections.find((i) => i.type === 'move_out');

              return (
                <div
                  key={addr.id}
                  className="bg-white rounded-2xl p-4 shadow-soft hover:shadow-card transition-all"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-sm font-bold text-navy-800">{addr.label}</h2>
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
                      <p className="text-xs text-gray-500 mt-0.5">
                        {addr.street} {addr.number}, {addr.floorDoor ? `${addr.floorDoor}, ` : ''}
                        {addr.postcode} {addr.city}
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => navigate(`/address/edit/${addr.id}`)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-navy-800 hover:bg-gray-100 transition-colors"
                        title="Edit address"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteId(addr.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete address"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Landlord & dates info */}
                  <div className="bg-brand-light rounded-xl p-2.5 my-3 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-semibold">
                        Landlord
                      </span>
                      <span className="text-navy-800 font-medium truncate flex items-center gap-1 mt-0.5">
                        <User size={12} className="text-gray-400 flex-shrink-0" />
                        {addr.landlordName || 'Not specified'}
                      </span>
                      {addr.landlordContact && (
                        <span className="text-gray-500 text-[11px] flex items-center gap-1 mt-0.5">
                          <Phone size={11} className="text-gray-400 flex-shrink-0" />
                          {addr.landlordContact}
                        </span>
                      )}
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-semibold">
                        Move-in Date
                      </span>
                      <span className="text-navy-800 font-medium flex items-center gap-1 mt-0.5">
                        <Calendar size={12} className="text-gray-400 flex-shrink-0" />
                        {formatDate(addr.moveInDate)}
                      </span>
                      {addr.moveOutDate && (
                        <span className="text-gray-500 text-[11px] block mt-0.5">
                          Out: {formatDate(addr.moveOutDate)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Inspections Buttons */}
                  <div className="space-y-2 pt-1 border-t border-gray-100">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Inspection & Reports</span>
                      <span className="font-medium text-navy-800">
                        {addrMedia.length} media items
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => navigate(`/inspection/${addr.id}/move_in`)}
                        className="flex items-center justify-between p-2 rounded-xl bg-navy-50 hover:bg-navy-100/80 transition-colors text-left"
                      >
                        <div>
                          <p className="text-xs font-semibold text-navy-800">Move-In</p>
                          <p className="text-[10px] text-gray-500">
                            {moveInInsp ? moveInInsp.status : 'Start inspection'}
                          </p>
                        </div>
                        <FileCheck2 size={16} className="text-navy-600" />
                      </button>

                      <button
                        onClick={() => navigate(`/inspection/${addr.id}/move_out`)}
                        className="flex items-center justify-between p-2 rounded-xl bg-accent-50 hover:bg-accent-100/80 transition-colors text-left"
                      >
                        <div>
                          <p className="text-xs font-semibold text-accent-700">Move-Out</p>
                          <p className="text-[10px] text-gray-500">
                            {moveOutInsp ? moveOutInsp.status : 'Start inspection'}
                          </p>
                        </div>
                        <ArrowRight size={16} className="text-accent-600" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Address"
        message="Are you sure you want to delete this address? All photos, inspections and documents associated with this tenancy will also be removed."
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
