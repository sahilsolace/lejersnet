import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { useToast } from '@/store/useToast';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import {
  X,
  Heart,
  Trash2,
  Calendar,
  MapPin,
  Folder,
  FileText,
  Save,
} from 'lucide-react';
import { formatDate, formatBytes } from '@/lib/utils';

export function FullScreenViewer() {
  const { mediaId } = useParams<{ mediaId: string }>();
  const navigate = useNavigate();
  const { media, addresses, toggleFavourite, deleteMedia, updateMedia } = useStore();
  const { addToast } = useToast();

  const item = media.find((m) => m.id === mediaId);
  const address = addresses.find((a) => a.id === item?.addressId);

  const [caption, setCaption] = useState(item?.caption ?? '');
  const [showConfirm, setShowConfirm] = useState(false);

  if (!item) {
    return (
      <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-6 text-white text-center">
        <p className="text-sm mb-4">Media item not found.</p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-xs"
        >
          Go Back
        </button>
      </div>
    );
  }

  const handleSaveCaption = () => {
    updateMedia(item.id, { caption });
    addToast('Caption updated.', 'success');
  };

  const handleDelete = () => {
    deleteMedia(item.id);
    addToast('Media removed.', 'info');
    navigate(-1);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col justify-between overflow-hidden">
      {/* Top action bar */}
      <div className="px-4 py-3 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between z-10">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur transition-colors"
          title="Close viewer"
        >
          <X size={20} />
        </button>

        <div className="text-center text-white min-w-0 max-w-[200px]">
          <p className="text-xs font-semibold truncate">{item.name}</p>
          <p className="text-[10px] text-white/60">{item.category}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleFavourite(item.id)}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur transition-colors"
            title="Toggle Favourite"
          >
            <Heart
              size={18}
              className={item.favourite ? 'fill-red-500 text-red-500' : ''}
            />
          </button>
          <button
            onClick={() => setShowConfirm(true)}
            className="p-2 rounded-full bg-white/10 hover:bg-red-500/80 text-white backdrop-blur transition-colors"
            title="Delete media"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Media content */}
      <div className="flex-1 flex items-center justify-center p-4 min-h-0 overflow-auto">
        {item.type === 'photo' && item.dataUrl ? (
          <img
            src={item.dataUrl}
            alt={item.name}
            className="max-h-full max-w-full object-contain rounded-lg shadow-2xl"
          />
        ) : (
          <div className="p-8 rounded-2xl bg-white/10 text-white backdrop-blur text-center max-w-xs">
            <FileText size={64} className="mx-auto text-white/70 mb-3" />
            <p className="text-sm font-semibold">{item.name}</p>
            <p className="text-xs text-white/60 mt-1">{item.category}</p>
            <p className="text-[11px] text-white/40 mt-1">{formatBytes(item.size)}</p>
          </div>
        )}
      </div>

      {/* Bottom details drawer */}
      <div className="bg-navy-900/95 backdrop-blur border-t border-white/10 p-4 text-white space-y-3 z-10">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Add note or description..."
            className="flex-1 bg-white/10 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-accent-500"
          />
          <button
            onClick={handleSaveCaption}
            className="p-2 bg-accent-500 hover:bg-accent-400 text-navy-900 rounded-xl transition-colors"
            title="Save note"
          >
            <Save size={16} />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 text-[10px] text-white/60 pt-1">
          <div className="flex items-center gap-1.5 truncate">
            <Folder size={12} className="text-accent-400 flex-shrink-0" />
            <span className="truncate">{item.category}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <MapPin size={12} className="text-accent-400 flex-shrink-0" />
            <span className="truncate">{address?.label ?? 'Address'}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <Calendar size={12} className="text-accent-400 flex-shrink-0" />
            <span className="truncate">{formatDate(item.createdAt)}</span>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={showConfirm}
        title="Delete Item"
        message="Are you sure you want to delete this media item permanently?"
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
}
