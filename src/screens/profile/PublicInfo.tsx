import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { useToast } from '@/store/useToast';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Copy, Globe, Shield } from 'lucide-react';

export function PublicInfo() {
  const navigate = useNavigate();
  const { user, setUser } = useStore();
  const { addToast } = useToast();

  const [isPublic, setIsPublic] = useState(user?.isPublic ?? false);
  const [profileHandle, setProfileHandle] = useState(
    user?.profileUrl.replace('lejersnet.com/member/', '') ?? '',
  );

  const handleCopyLink = () => {
    if (!user) return;
    navigator.clipboard.writeText(`https://${user.profileUrl}`);
    addToast('Public profile link copied!', 'success');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const cleanHandle = profileHandle.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
    setUser({
      ...user,
      isPublic,
      profileUrl: `lejersnet.com/member/${cleanHandle || 'member'}`,
    });
    addToast('Public profile preferences saved.', 'success');
    navigate(-1);
  };

  return (
    <div className="min-h-full bg-brand-light pb-8">
      <ScreenHeader title="Public Profile" />

      <form onSubmit={handleSave} className="px-4 py-4 space-y-4">
        {/* Visibility Card */}
        <div className="bg-white rounded-2xl p-4 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  isPublic ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                }`}
              >
                {isPublic ? <Globe size={20} /> : <Shield size={20} />}
              </div>
              <div>
                <p className="text-sm font-semibold text-navy-800">Profile Visibility</p>
                <p className="text-xs text-gray-500">
                  {isPublic ? 'Publicly shareable' : 'Hidden from public'}
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-navy-800"></div>
            </label>
          </div>

          <p className="text-xs text-gray-500 leading-relaxed border-t border-gray-100 pt-3">
            When enabled, prospective landlords can verify your verified tenancy records and
            profile introduction via your unique link.
          </p>
        </div>

        {/* Public URL Handle */}
        <div className="bg-white rounded-2xl p-4 shadow-soft space-y-3">
          <label className="block text-xs font-semibold text-navy-800">Custom Profile URL</label>

          <div className="flex rounded-xl border border-gray-200 overflow-hidden text-xs">
            <span className="bg-gray-50 px-3 py-2.5 text-gray-500 border-r border-gray-200 select-none flex items-center">
              lejersnet.com/member/
            </span>
            <input
              type="text"
              value={profileHandle}
              onChange={(e) => setProfileHandle(e.target.value)}
              placeholder="your-name"
              className="flex-1 px-3 py-2.5 text-navy-800 focus:outline-none"
            />
          </div>

          <button
            type="button"
            onClick={handleCopyLink}
            className="w-full py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-navy-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Copy size={14} />
            Copy Current Link
          </button>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 rounded-xl bg-navy-800 hover:bg-navy-900 text-white font-semibold text-sm transition-colors shadow-soft"
        >
          Save Settings
        </button>
      </form>
    </div>
  );
}
