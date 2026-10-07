import { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { useToast } from '@/store/useToast';
import { ScreenHeader } from '@/components/ScreenHeader';
import { uploadService } from '@/services/uploadService';
import {
  Camera,
  Upload,
  Heart,
  Trash2,
  Maximize2,
  FileText,
  Info,
} from 'lucide-react';
import type { MediaCategory, MediaType } from '@/types';

export function CategoryDetail() {
  const { inspectionId, category: rawCategory } = useParams<{
    inspectionId: string;
    category: string;
  }>();
  const category = (decodeURIComponent(rawCategory ?? '') as MediaCategory) || 'Other';
  const navigate = useNavigate();

  const { inspections, addresses, media, addMedia, deleteMedia, toggleFavourite } = useStore();
  const { addToast } = useToast();

  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const inspection = inspections.find((i) => i.id === inspectionId);
  const address = addresses.find((a) => a.id === inspection?.addressId);

  const categoryMedia = media.filter(
    (m) => m.inspectionId === inspectionId && m.category === category,
  );

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !inspection) return;

    setUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const isImage = file.type.startsWith('image/');
        const mediaType: MediaType = isImage ? 'photo' : 'document';
        const { dataUrl, compressedSize } = await uploadService.fileToDataUrl(file);

        addMedia({
          type: mediaType,
          category,
          addressId: inspection.addressId,
          inspectionId: inspection.id,
          name: file.name,
          dataUrl,
          size: compressedSize,
          caption: '',
        });
      }
      addToast(
        `${files.length} item${files.length > 1 ? 's' : ''} uploaded to ${category}.`,
        'success',
      );
    } catch {
      addToast('Failed to upload file.', 'error');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-full bg-brand-light pb-10">
      <ScreenHeader
        title={category}
        rightAction={
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="p-1.5 rounded-full bg-navy-800 text-white hover:bg-navy-900 transition-colors"
            title="Upload photo"
          >
            <Camera size={18} />
          </button>
        }
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf,.doc,.docx"
        multiple
        onChange={handleFileUpload}
        className="hidden"
      />

      <div className="px-4 py-4 space-y-4">
        {/* Category overview banner */}
        <div className="bg-white rounded-2xl p-4 shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">{address?.label ?? 'Inspection'}</p>
              <h2 className="text-base font-bold text-navy-800">{category}</h2>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-navy-50 text-navy-700 font-semibold text-xs">
              {categoryMedia.length} item{categoryMedia.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="mt-3 p-2.5 rounded-xl bg-accent-50/70 border border-accent-100 flex items-start gap-2 text-xs text-navy-900">
            <Info size={15} className="text-accent-600 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Capture angles covering doors, windows, flooring condition, and any pre-existing
              scratches or dents.
            </p>
          </div>
        </div>

        {/* Upload Trigger Area */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-full border-2 border-dashed border-gray-300 hover:border-navy-600 bg-white/60 hover:bg-white rounded-2xl p-6 text-center transition-all flex flex-col items-center justify-center gap-2 group cursor-pointer"
        >
          <div className="w-12 h-12 rounded-full bg-navy-50 group-hover:bg-navy-100 flex items-center justify-center text-navy-800 transition-colors">
            {uploading ? (
              <div className="w-5 h-5 border-2 border-navy-800 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Upload size={22} />
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-navy-800">
              {uploading ? 'Processing file...' : 'Take or Upload Photos'}
            </p>
            <p className="text-xs text-gray-400">JPG, PNG, PDF up to 25MB</p>
          </div>
        </button>

        {/* Media Grid */}
        {categoryMedia.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-soft">
            <p className="text-sm font-medium text-navy-800">No media in this category yet</p>
            <p className="text-xs text-gray-400 mt-1">
              Tap the camera button above to take a photo or upload from library.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {categoryMedia.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl overflow-hidden shadow-soft group relative flex flex-col"
              >
                <div
                  onClick={() => navigate(`/viewer/${item.id}`)}
                  className="relative aspect-square bg-gray-100 cursor-pointer overflow-hidden"
                >
                  {item.type === 'photo' && item.dataUrl ? (
                    <img
                      src={item.dataUrl}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-navy-50 text-navy-600">
                      <FileText size={32} />
                      <span className="text-[11px] font-medium mt-1 truncate max-w-full">
                        {item.name}
                      </span>
                    </div>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/viewer/${item.id}`);
                    }}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
                  >
                    <Maximize2 size={13} />
                  </button>
                </div>

                <div className="p-2.5 flex items-center justify-between gap-1 mt-auto">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-navy-800 truncate">{item.name}</p>
                    <p className="text-[10px] text-gray-400">
                      {item.caption || (item.size ? `${Math.round(item.size / 1024)} KB` : 'Uploaded')}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => toggleFavourite(item.id)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      title="Favourite"
                    >
                      <Heart
                        size={15}
                        className={item.favourite ? 'fill-red-500 text-red-500' : ''}
                      />
                    </button>
                    <button
                      onClick={() => {
                        deleteMedia(item.id);
                        addToast('Photo removed.', 'info');
                      }}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
