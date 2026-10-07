import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { useToast } from '@/store/useToast';
import { Avatar } from '@/components/Avatar';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { uploadService } from '@/services/uploadService';
import {
  User,
  Shield,
  ShoppingBag,
  Home,
  Bell,
  Lock,
  Mail,
  FileText,
  HelpCircle,
  LogOut,
  ChevronRight,
  Copy,
  ExternalLink,
  Code2,
  FileCheck,
  UserX,
  Camera,
} from 'lucide-react';

export function Profile() {
  const navigate = useNavigate();
  const { user, setUser, setAuthenticated, notifications, getActiveSubscription } = useStore();
  const { addToast } = useToast();

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  if (!user) return null;

  const activeSub = getActiveSubscription();
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleCopyProfileUrl = () => {
    navigator.clipboard.writeText(`https://${user.profileUrl}`);
    addToast('Profile link copied to clipboard!', 'success');
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const { dataUrl } = await uploadService.compressImage(file, 400, 0.8);
      setUser({ ...user, photoUrl: dataUrl });
      addToast('Profile photo updated.', 'success');
    } catch {
      addToast('Failed to update photo.', 'error');
    }
  };

  const handleLogout = () => {
    setAuthenticated(false);
    addToast('You have been signed out.', 'info');
    navigate('/welcome');
  };

  return (
    <div className="min-h-full bg-brand-light pb-10">
      {/* Header Profile Card */}
      <div className="bg-navy-800 text-white px-5 pt-12 pb-6 rounded-b-[2rem] shadow-soft">
        <div className="flex items-center gap-4">
          <div className="relative group cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
            <Avatar name={user.fullName} photoUrl={user.photoUrl} size="lg" />
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera size={18} className="text-white" />
            </div>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold truncate">{user.fullName}</h1>
              {activeSub && (
                <span className="px-2 py-0.5 rounded-full bg-accent-500 text-navy-900 text-[10px] font-bold">
                  PRO
                </span>
              )}
            </div>
            <p className="text-xs text-white/60 truncate">{user.email}</p>

            <button
              onClick={handleCopyProfileUrl}
              className="mt-1.5 inline-flex items-center gap-1 text-[11px] text-accent-400 hover:text-accent-300 font-medium"
            >
              <Copy size={11} />
              <span>Copy profile link</span>
            </button>
          </div>
        </div>

        {user.bio && (
          <p className="mt-4 text-xs text-white/70 italic bg-white/5 p-2.5 rounded-xl border border-white/10">
            "{user.bio}"
          </p>
        )}
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Account Details Group */}
        <div className="bg-white rounded-2xl p-1 shadow-soft divide-y divide-gray-50">
          <div className="p-3">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Account Information
            </span>
          </div>

          <button
            onClick={() => navigate('/profile/personal-info')}
            className="w-full p-3 flex items-center justify-between hover:bg-gray-50/80 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-navy-50 text-navy-700 flex items-center justify-center">
                <User size={16} />
              </div>
              <div>
                <p className="text-xs font-semibold text-navy-800">Personal Information</p>
                <p className="text-[10px] text-gray-400">Name, phone, birthdate, location</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-gray-300" />
          </button>

          <button
            onClick={() => navigate('/profile/public-info')}
            className="w-full p-3 flex items-center justify-between hover:bg-gray-50/80 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-navy-50 text-navy-700 flex items-center justify-center">
                <ExternalLink size={16} />
              </div>
              <div>
                <p className="text-xs font-semibold text-navy-800">Public Profile</p>
                <p className="text-[10px] text-gray-400">
                  {user.isPublic ? 'Publicly visible' : 'Private'}
                </p>
              </div>
            </div>
            <ChevronRight size={16} className="text-gray-300" />
          </button>

          <button
            onClick={() => navigate('/profile/bio')}
            className="w-full p-3 flex items-center justify-between hover:bg-gray-50/80 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-navy-50 text-navy-700 flex items-center justify-center">
                <FileText size={16} />
              </div>
              <div>
                <p className="text-xs font-semibold text-navy-800">Bio & Presentation</p>
                <p className="text-[10px] text-gray-400">Personal tenant bio</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-gray-300" />
          </button>

          <button
            onClick={() => navigate('/profile/change-email')}
            className="w-full p-3 flex items-center justify-between hover:bg-gray-50/80 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-navy-50 text-navy-700 flex items-center justify-center">
                <Mail size={16} />
              </div>
              <div>
                <p className="text-xs font-semibold text-navy-800">Change Email</p>
                <p className="text-[10px] text-gray-400">{user.email}</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-gray-300" />
          </button>

          <button
            onClick={() => navigate('/profile/change-password')}
            className="w-full p-3 flex items-center justify-between hover:bg-gray-50/80 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-navy-50 text-navy-700 flex items-center justify-center">
                <Lock size={16} />
              </div>
              <div>
                <p className="text-xs font-semibold text-navy-800">Change Password</p>
                <p className="text-[10px] text-gray-400">Update your login security</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-gray-300" />
          </button>

          <button
            onClick={() => navigate('/profile/blocked-members')}
            className="w-full p-3 flex items-center justify-between hover:bg-gray-50/80 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-navy-50 text-navy-700 flex items-center justify-center">
                <UserX size={16} />
              </div>
              <div>
                <p className="text-xs font-semibold text-navy-800">Blocked Members</p>
                <p className="text-[10px] text-gray-400">Manage blocked users</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-gray-300" />
          </button>
        </div>

        {/* Subscription & Orders Group */}
        <div className="bg-white rounded-2xl p-1 shadow-soft divide-y divide-gray-50">
          <div className="p-3">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Subscription & Orders
            </span>
          </div>

          <button
            onClick={() => navigate('/profile/subscriptions')}
            className="w-full p-3 flex items-center justify-between hover:bg-gray-50/80 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-green-50 text-green-700 flex items-center justify-center">
                <Shield size={16} />
              </div>
              <div>
                <p className="text-xs font-semibold text-navy-800">My Subscriptions</p>
                <p className="text-[10px] text-gray-400">
                  {activeSub ? 'Active membership' : 'No active plan'}
                </p>
              </div>
            </div>
            <ChevronRight size={16} className="text-gray-300" />
          </button>

          <button
            onClick={() => navigate('/profile/orders')}
            className="w-full p-3 flex items-center justify-between hover:bg-gray-50/80 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-navy-50 text-navy-700 flex items-center justify-center">
                <ShoppingBag size={16} />
              </div>
              <div>
                <p className="text-xs font-semibold text-navy-800">My Orders & Receipts</p>
                <p className="text-[10px] text-gray-400">Payment history & invoices</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-gray-300" />
          </button>

          <button
            onClick={() => navigate('/profile/addresses')}
            className="w-full p-3 flex items-center justify-between hover:bg-gray-50/80 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-navy-50 text-navy-700 flex items-center justify-center">
                <Home size={16} />
              </div>
              <div>
                <p className="text-xs font-semibold text-navy-800">My Addresses</p>
                <p className="text-[10px] text-gray-400">Manage housing directory</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-gray-300" />
          </button>

          <button
            onClick={() => navigate('/profile/files')}
            className="w-full p-3 flex items-center justify-between hover:bg-gray-50/80 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-navy-50 text-navy-700 flex items-center justify-center">
                <FileCheck size={16} />
              </div>
              <div>
                <p className="text-xs font-semibold text-navy-800">All Files & Storage</p>
                <p className="text-[10px] text-gray-400">Storage usage & data export</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-gray-300" />
          </button>
        </div>

        {/* Notifications & Help Group */}
        <div className="bg-white rounded-2xl p-1 shadow-soft divide-y divide-gray-50">
          <div className="p-3">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              General & Support
            </span>
          </div>

          <button
            onClick={() => navigate('/profile/notifications')}
            className="w-full p-3 flex items-center justify-between hover:bg-gray-50/80 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent-50 text-accent-700 flex items-center justify-center">
                <Bell size={16} />
              </div>
              <div>
                <p className="text-xs font-semibold text-navy-800">Notifications</p>
                <p className="text-[10px] text-gray-400">
                  {unreadCount > 0 ? `${unreadCount} unread message(s)` : 'All up to date'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-accent-500 text-white text-[10px] font-bold">
                  {unreadCount}
                </span>
              )}
              <ChevronRight size={16} className="text-gray-300" />
            </div>
          </button>

          <button
            onClick={() => navigate('/profile/support')}
            className="w-full p-3 flex items-center justify-between hover:bg-gray-50/80 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-navy-50 text-navy-700 flex items-center justify-center">
                <HelpCircle size={16} />
              </div>
              <div>
                <p className="text-xs font-semibold text-navy-800">Support & FAQ</p>
                <p className="text-[10px] text-gray-400">Contact team & help center</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-gray-300" />
          </button>

          <button
            onClick={() => navigate('/profile/terms')}
            className="w-full p-3 flex items-center justify-between hover:bg-gray-50/80 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-navy-50 text-navy-700 flex items-center justify-center">
                <FileText size={16} />
              </div>
              <p className="text-xs font-semibold text-navy-800">Terms & Conditions</p>
            </div>
            <ChevronRight size={16} className="text-gray-300" />
          </button>

          <button
            onClick={() => navigate('/profile/privacy')}
            className="w-full p-3 flex items-center justify-between hover:bg-gray-50/80 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-navy-50 text-navy-700 flex items-center justify-center">
                <Shield size={16} />
              </div>
              <p className="text-xs font-semibold text-navy-800">Privacy Policy</p>
            </div>
            <ChevronRight size={16} className="text-gray-300" />
          </button>

          <button
            onClick={() => navigate('/profile/devtools')}
            className="w-full p-3 flex items-center justify-between hover:bg-gray-50/80 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-navy-50 text-navy-700 flex items-center justify-center">
                <Code2 size={16} />
              </div>
              <div>
                <p className="text-xs font-semibold text-navy-800">Developer & Reset Tools</p>
                <p className="text-[10px] text-gray-400">Test tools & DB reset</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-gray-300" />
          </button>
        </div>

        {/* Sign Out Button */}
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full py-3.5 rounded-2xl bg-white hover:bg-red-50 text-red-600 font-semibold text-xs flex items-center justify-center gap-2 border border-red-100 shadow-soft transition-colors"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>

      <ConfirmDialog
        open={showLogoutConfirm}
        title="Sign Out"
        message="Are you sure you want to sign out from your LejersNet account?"
        confirmLabel="Sign Out"
        variant="danger"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </div>
  );
}
