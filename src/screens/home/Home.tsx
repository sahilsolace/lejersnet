import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { Avatar } from '@/components/Avatar';
import {
  Bell,
  FileText,
  Image as ImageIcon,
  Home as HomeIcon,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Shield,
} from 'lucide-react';
import { formatRelativeTime, formatDate } from '@/lib/utils';
import { ALL_CATEGORIES } from '@/data/seed';
import type { MediaCategory } from '@/types';

export function Home() {
  const navigate = useNavigate();
  const { user, media, addresses, inspections, notifications, getActiveSubscription } = useStore();
  const activeSub = getActiveSubscription();
  const unreadCount = notifications.filter((n) => !n.read).length;

  if (!user) return null;

  const firstName = user.fullName.split(' ')[0];
  const documents = media.filter((m) => m.type === 'document');
  const photos = media.filter((m) => m.type === 'photo');
  const recentUploads = [...media].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 3);

  // Compute missing sections for each address with inspections
  const missingSections: { addressId: string; addressLabel: string; missing: MediaCategory[]; inspectionType: string }[] = [];
  inspections.forEach((insp) => {
    const addr = addresses.find((a) => a.id === insp.addressId);
    if (!addr) return;
    const inspMedia = media.filter((m) => m.inspectionId === insp.id);
    const coveredCategories = new Set<string>(inspMedia.map((m) => m.category));
    const missing = (ALL_CATEGORIES as readonly MediaCategory[]).filter((c) => !coveredCategories.has(c));
    if (missing.length > 0) {
      missingSections.push({
        addressId: addr.id,
        addressLabel: addr.label,
        missing,
        inspectionType: insp.type === 'move_in' ? 'Move In' : 'Move Out',
      });
    }
  });

  return (
    <div className="min-h-full bg-brand-light pb-4">
      {/* Header */}
      <header className="bg-navy-800 px-5 pt-12 pb-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar name={user.fullName} photoUrl={user.photoUrl} size="md" />
            <div>
              <p className="text-xs text-white/50">Welcome back</p>
              <h1 className="text-lg font-bold text-white">Hi, {firstName}</h1>
            </div>
          </div>
          <button
            onClick={() => navigate('/profile/notifications')}
            className="relative p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <Bell size={22} className="text-white" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-accent-500 text-white text-[10px] font-bold flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
        </div>
      </header>

      <div className="px-4 -mt-2 space-y-4">
        {/* Membership block */}
        {activeSub ? (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 shadow-soft">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <Shield size={20} className="text-green-700" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-green-800">Member – Active</p>
                <p className="text-xs text-green-600">
                  Renews on {formatDate(activeSub.renewalDate)}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-navy-800 rounded-2xl p-5 shadow-card">
            <h2 className="text-lg font-bold text-white leading-snug mb-2">
              Get control of your tenancy
            </h2>
            <p className="text-sm text-white/70 mb-4 leading-relaxed">
              Store your rental contract, photos and documents securely. Get peace of mind for only DKK 49/month.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => navigate('/subscription')}
                className="flex-1 py-2.5 rounded-xl bg-accent-500 text-navy-900 font-semibold text-sm hover:bg-accent-400 transition-colors"
              >
                Become a Member Now
              </button>
              <button
                onClick={() => navigate('/profile/support')}
                className="py-2.5 px-4 rounded-xl border border-white/20 text-white font-medium text-sm hover:bg-white/10 transition-colors"
              >
                Contact
              </button>
            </div>
          </div>
        )}

        {/* Housing directory button */}
        <button
          onClick={() => navigate('/addresses')}
          className="w-full bg-white rounded-2xl p-4 shadow-soft flex items-center gap-3 hover:shadow-card transition-shadow text-left"
        >
          <div className="w-10 h-10 rounded-xl bg-navy-50 flex items-center justify-center">
            <HomeIcon size={20} className="text-navy-700" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-navy-800">View your housing directory</p>
            <p className="text-xs text-gray-500">{addresses.length} addresses saved</p>
          </div>
          <ArrowRight size={18} className="text-gray-400" />
        </button>

        {/* Stats block */}
        <div>
          <h3 className="text-sm font-semibold text-navy-800 mb-2 px-1">Your Documents</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate('/documents')}
              className="bg-white rounded-2xl p-4 shadow-soft hover:shadow-card transition-shadow text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-navy-50 flex items-center justify-center mb-2">
                <FileText size={20} className="text-navy-700" />
              </div>
              <p className="text-2xl font-bold text-navy-800">{documents.length}</p>
              <p className="text-xs text-gray-500">Documents Saved</p>
            </button>
            <button
              onClick={() => navigate('/pictures')}
              className="bg-white rounded-2xl p-4 shadow-soft hover:shadow-card transition-shadow text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-accent-50 flex items-center justify-center mb-2">
                <ImageIcon size={20} className="text-accent-600" />
              </div>
              <p className="text-2xl font-bold text-navy-800">{photos.length}</p>
              <p className="text-xs text-gray-500">Pictures Saved</p>
            </button>
          </div>
        </div>

        {/* Recent activity */}
        <div>
          <h3 className="text-sm font-semibold text-navy-800 mb-2 px-1">Recent Activity</h3>
          {recentUploads.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 shadow-soft text-center">
              <p className="text-sm text-gray-400">No uploads yet. Start documenting your home!</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-soft divide-y divide-gray-50">
              {recentUploads.map((item) => {
                const addr = addresses.find((a) => a.id === item.addressId);
                return (
                  <div key={item.id} className="flex items-center gap-3 p-3">
                    {item.type === 'photo' && item.dataUrl ? (
                      <img src={item.dataUrl} alt={item.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-navy-50 flex items-center justify-center flex-shrink-0">
                        {item.type === 'photo' ? <ImageIcon size={20} className="text-navy-400" /> : <FileText size={20} className="text-navy-400" />}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-navy-800 truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        {item.category} · {addr?.label ?? 'Unknown'} · {formatRelativeTime(item.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Missing sections alert */}
        <div>
          <h3 className="text-sm font-semibold text-navy-800 mb-2 px-1">Missing sections</h3>
          {missingSections.length === 0 ? (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3">
              <CheckCircle2 size={20} className="text-green-600 flex-shrink-0" />
              <p className="text-sm font-medium text-green-800">All sections covered</p>
            </div>
          ) : (
            <div className="space-y-2">
              {missingSections.map((section) => (
                <div key={section.addressId} className="bg-white rounded-2xl p-4 shadow-soft">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle size={16} className="text-accent-500" />
                    <p className="text-sm font-semibold text-navy-800">{section.addressLabel}</p>
                    <span className="text-xs text-gray-400">· {section.inspectionType}</span>
                  </div>
                  <div className="space-y-2">
                    {section.missing.slice(0, 4).map((cat) => (
                      <div key={cat} className="flex items-center justify-between">
                        <p className="text-sm text-gray-600">{cat} – no photos</p>
                        <button
                          onClick={() => navigate(`/inspection/${section.addressId}/${section.inspectionType === 'Move In' ? 'move_in' : 'move_out'}?category=${encodeURIComponent(cat)}`)}
                          className="text-xs font-semibold text-navy-700 bg-navy-50 px-3 py-1.5 rounded-lg hover:bg-navy-100 transition-colors"
                        >
                          Add now
                        </button>
                      </div>
                    ))}
                    {section.missing.length > 4 && (
                      <p className="text-xs text-gray-400">+ {section.missing.length - 4} more sections</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
