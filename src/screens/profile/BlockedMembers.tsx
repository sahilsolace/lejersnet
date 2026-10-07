import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { useToast } from '@/store/useToast';
import { ScreenHeader } from '@/components/ScreenHeader';
import { UserX, UserPlus, Trash2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export function BlockedMembers() {
  const { blockedMembers, blockMember, unblockMember } = useStore();
  const { addToast } = useToast();

  const [nameToBlock, setNameToBlock] = useState('');

  const handleBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameToBlock.trim()) return;
    blockMember(nameToBlock.trim());
    addToast(`${nameToBlock.trim()} has been blocked.`, 'info');
    setNameToBlock('');
  };

  const handleUnblock = (id: string, name: string) => {
    unblockMember(id);
    addToast(`${name} has been unblocked.`, 'success');
  };

  return (
    <div className="min-h-full bg-brand-light pb-8">
      <ScreenHeader title="Blocked Members" />

      <div className="px-4 py-4 space-y-4">
        {/* Block user form */}
        <form onSubmit={handleBlock} className="bg-white rounded-2xl p-4 shadow-soft space-y-3">
          <label className="block text-xs font-semibold text-navy-800">Block a Member</label>
          <p className="text-[11px] text-gray-500">
            Blocked members cannot view your public profile or send you messages.
          </p>

          <div className="flex gap-2">
            <input
              type="text"
              value={nameToBlock}
              onChange={(e) => setNameToBlock(e.target.value)}
              placeholder="Enter member name..."
              className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-xs focus:border-navy-800 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!nameToBlock.trim()}
              className="px-3.5 py-2 rounded-xl bg-navy-800 hover:bg-navy-900 disabled:opacity-50 text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <UserPlus size={14} />
              Block
            </button>
          </div>
        </form>

        {/* List of blocked members */}
        <div className="bg-white rounded-2xl p-4 shadow-soft space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-navy-800">
              Blocked List ({blockedMembers.length})
            </span>
          </div>

          {blockedMembers.length === 0 ? (
            <div className="py-6 text-center">
              <UserX size={24} className="mx-auto text-gray-300 mb-2" />
              <p className="text-xs text-gray-400">No blocked members</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {blockedMembers.map((member) => (
                <div key={member.id} className="py-2.5 flex items-center justify-between gap-2">
                  <div>
                    <p className="text-xs font-bold text-navy-800">{member.name}</p>
                    <p className="text-[10px] text-gray-400">
                      Blocked on {formatDate(member.blockedDate)}
                    </p>
                  </div>

                  <button
                    onClick={() => handleUnblock(member.id, member.name)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-navy-800 hover:bg-gray-100 transition-colors text-xs font-medium flex items-center gap-1"
                  >
                    <Trash2 size={14} />
                    <span>Unblock</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
