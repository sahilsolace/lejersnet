import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { useToast } from '@/store/useToast';
import { ScreenHeader } from '@/components/ScreenHeader';

export function PersonalInfo() {
  const navigate = useNavigate();
  const { user, setUser } = useStore();
  const { addToast } = useToast();

  const [fullName, setFullName] = useState(user?.fullName ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [dateOfBirth, setDateOfBirth] = useState(user?.dateOfBirth ?? '');
  const [location, setLocation] = useState(user?.location ?? '');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!fullName.trim()) {
      addToast('Please enter your full name.', 'error');
      return;
    }

    setUser({
      ...user,
      fullName: fullName.trim(),
      phone: phone.trim(),
      dateOfBirth,
      location: location.trim(),
    });

    addToast('Personal information updated.', 'success');
    navigate(-1);
  };

  return (
    <div className="min-h-full bg-brand-light pb-8">
      <ScreenHeader title="Personal Information" />

      <form onSubmit={handleSave} className="px-4 py-4 space-y-4">
        <div className="bg-white rounded-2xl p-4 shadow-soft space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Full Name *</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-navy-800 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+45 20 12 34 56"
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-navy-800 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Date of Birth</label>
            <input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-navy-800 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Location / City</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Copenhagen, Denmark"
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-navy-800 focus:outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 rounded-xl bg-navy-800 hover:bg-navy-900 text-white font-semibold text-sm transition-colors shadow-soft"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
