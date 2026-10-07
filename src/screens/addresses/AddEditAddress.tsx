import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { useToast } from '@/store/useToast';
import { ScreenHeader } from '@/components/ScreenHeader';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { addressService } from '@/services/addressService';
import { MapPin, Trash2, CheckCircle2 } from 'lucide-react';

export function AddEditAddress() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addresses, addAddress, updateAddress, deleteAddress } = useStore();
  const { addToast } = useToast();

  const isEdit = Boolean(id);
  const existing = addresses.find((a) => a.id === id);

  const [label, setLabel] = useState(existing?.label ?? '');
  const [street, setStreet] = useState(existing?.street ?? '');
  const [number, setNumber] = useState(existing?.number ?? '');
  const [floorDoor, setFloorDoor] = useState(existing?.floorDoor ?? '');
  const [postcode, setPostcode] = useState(existing?.postcode ?? '');
  const [city, setCity] = useState(existing?.city ?? '');
  const [landlordName, setLandlordName] = useState(existing?.landlordName ?? '');
  const [landlordContact, setLandlordContact] = useState(existing?.landlordContact ?? '');
  const [moveInDate, setMoveInDate] = useState(
    existing?.moveInDate ?? new Date().toISOString().split('T')[0],
  );
  const [moveOutDate, setMoveOutDate] = useState(existing?.moveOutDate ?? '');
  const [notes, setNotes] = useState(existing?.notes ?? '');

  const [geocoding, setGeocoding] = useState(false);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (existing) {
      setLabel(existing.label);
      setStreet(existing.street);
      setNumber(existing.number);
      setFloorDoor(existing.floorDoor);
      setPostcode(existing.postcode);
      setCity(existing.city);
      setLandlordName(existing.landlordName);
      setLandlordContact(existing.landlordContact);
      setMoveInDate(existing.moveInDate);
      setMoveOutDate(existing.moveOutDate ?? '');
      setNotes(existing.notes);
    }
  }, [existing]);

  const handleVerifyLocation = async () => {
    if (!street || !city) {
      setError('Please fill in street and city first.');
      return;
    }
    setGeocoding(true);
    setError('');
    try {
      const coords = await addressService.geocodeAddress(street, postcode, city);
      setCoordinates(coords);
      addToast('Address verified and coordinates resolved.', 'success');
    } catch {
      setError('Could not verify address location.');
    } finally {
      setGeocoding(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim()) {
      setError('Please enter an address label (e.g. Nørrebro Flat).');
      return;
    }
    if (!street.trim() || !number.trim()) {
      setError('Please enter street and house number.');
      return;
    }
    if (!city.trim() || !postcode.trim()) {
      setError('Please enter postcode and city.');
      return;
    }

    if (isEdit && id) {
      updateAddress(id, {
        label: label.trim(),
        street: street.trim(),
        number: number.trim(),
        floorDoor: floorDoor.trim(),
        postcode: postcode.trim(),
        city: city.trim(),
        landlordName: landlordName.trim(),
        landlordContact: landlordContact.trim(),
        moveInDate,
        moveOutDate: moveOutDate ? moveOutDate : null,
        notes: notes.trim(),
      });
      addToast('Address updated successfully.', 'success');
    } else {
      addAddress({
        label: label.trim(),
        street: street.trim(),
        number: number.trim(),
        floorDoor: floorDoor.trim(),
        postcode: postcode.trim(),
        city: city.trim(),
        landlordName: landlordName.trim(),
        landlordContact: landlordContact.trim(),
        moveInDate,
        moveOutDate: moveOutDate ? moveOutDate : null,
        notes: notes.trim(),
      });
      addToast('New tenancy address added.', 'success');
    }

    navigate('/addresses');
  };

  const handleDelete = () => {
    if (id) {
      deleteAddress(id);
      addToast('Address deleted.', 'success');
      navigate('/addresses');
    }
  };

  return (
    <div className="min-h-full bg-brand-light pb-8">
      <ScreenHeader
        title={isEdit ? 'Edit Address' : 'Add New Address'}
        rightAction={
          isEdit ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-1.5 rounded-full text-red-600 hover:bg-red-50 transition-colors"
              title="Delete"
            >
              <Trash2 size={18} />
            </button>
          ) : undefined
        }
      />

      <form onSubmit={handleSave} className="px-4 py-4 space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
            {error}
          </div>
        )}

        <div className="bg-white rounded-2xl p-4 shadow-soft space-y-3">
          <h2 className="text-xs font-bold text-navy-800 uppercase tracking-wide">
            Property Details
          </h2>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Label / Friendly Name *
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Nørrebro Apartment"
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-navy-800 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">Street *</label>
              <input
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="Street name"
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-navy-800 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Number *</label>
              <input
                type="text"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                placeholder="42A"
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-navy-800 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Floor / Door</label>
              <input
                type="text"
                value={floorDoor}
                onChange={(e) => setFloorDoor(e.target.value)}
                placeholder="2. th."
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-navy-800 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Postcode *</label>
              <input
                type="text"
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
                placeholder="2200"
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-navy-800 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">City *</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Copenhagen"
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-navy-800 focus:outline-none"
                required
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleVerifyLocation}
            disabled={geocoding}
            className="w-full py-2 px-3 rounded-xl border border-navy-100 bg-navy-50/50 hover:bg-navy-50 text-navy-800 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
          >
            <MapPin size={14} className="text-navy-600" />
            {geocoding ? 'Verifying coordinates…' : 'Verify Location'}
          </button>

          {coordinates && (
            <div className="p-2.5 rounded-xl bg-green-50 border border-green-200 flex items-center gap-2 text-xs text-green-800">
              <CheckCircle2 size={16} className="text-green-600 flex-shrink-0" />
              <span>
                Location confirmed ({coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)})
              </span>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-soft space-y-3">
          <h2 className="text-xs font-bold text-navy-800 uppercase tracking-wide">
            Landlord & Dates
          </h2>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Landlord Name</label>
              <input
                type="text"
                value={landlordName}
                onChange={(e) => setLandlordName(e.target.value)}
                placeholder="Landlord / Agency"
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-navy-800 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Landlord Contact</label>
              <input
                type="text"
                value={landlordContact}
                onChange={(e) => setLandlordContact(e.target.value)}
                placeholder="Phone or email"
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-navy-800 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Move-In Date *</label>
              <input
                type="date"
                value={moveInDate}
                onChange={(e) => setMoveInDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-navy-800 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Move-Out Date</label>
              <input
                type="date"
                value={moveOutDate}
                onChange={(e) => setMoveOutDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-navy-800 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Notes / Deposit info</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Deposit amount, condition notes, meter numbers..."
              rows={3}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-navy-800 focus:outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 rounded-xl bg-navy-800 hover:bg-navy-900 text-white font-semibold text-sm transition-colors shadow-soft"
        >
          {isEdit ? 'Save Changes' : 'Create Address'}
        </button>
      </form>

      <ConfirmDialog
        open={showDeleteConfirm}
        title="Delete Address"
        message="Are you sure you want to delete this address? All associated photos and inspections will be permanently removed."
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
}
