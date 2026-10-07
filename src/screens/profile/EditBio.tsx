import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { useToast } from '@/store/useToast';
import { ScreenHeader } from '@/components/ScreenHeader';

export function EditBio() {
  const navigate = useNavigate();
  const { user, setUser } = useStore();
  const { addToast } = useToast();

  const [bio, setBio] = useState(user?.bio ?? '');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setUser({ ...user, bio: bio.trim() });
    addToast('Bio updated successfully.', 'success');
    navigate(-1);
  };

  return (
    <div className="min-h-full bg-brand-light pb-8">
      <ScreenHeader title="Edit Bio" />

      <form onSubmit={handleSave} className="px-4 py-4 space-y-4">
        <div className="bg-white rounded-2xl p-4 shadow-soft space-y-2">
          <label className="block text-xs font-semibold text-navy-800">
            About You / Tenant Bio
          </label>
          <p className="text-[11px] text-gray-500">
            Share a few words about yourself, your habits, or interests. This is visible if your
            profile is set to public.
          </p>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={5}
            maxLength={300}
            placeholder="e.g. Non-smoker, quiet tenant who takes pride in keeping the home clean and tidy."
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-navy-800 focus:outline-none"
          />
          <div className="flex justify-end text-[11px] text-gray-400">
            <span>{bio.length} / 300</span>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 rounded-xl bg-navy-800 hover:bg-navy-900 text-white font-semibold text-sm transition-colors shadow-soft"
        >
          Save Bio
        </button>
      </form>
    </div>
  );
}
