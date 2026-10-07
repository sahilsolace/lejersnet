import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { useToast } from '@/store/useToast';
import { ScreenHeader } from '@/components/ScreenHeader';
import { PHOTO_CATEGORIES } from '@/data/seed';
import { uploadService } from '@/services/uploadService';
import { Camera, Image as ImageIcon, X, AlertCircle } from 'lucide-react';
import type { MediaCategory } from '@/types';

interface QueuedPhoto {
  file: File;
  previewUrl: string;
}

export function AddPictures() {
  const navigate = useNavigate();
  const { addresses, addMedia } = useStore();
  const { addToast } = useToast();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [files, setFiles] = useState<QueuedPhoto[]>([]);
  const [addressId, setAddressId] = useState(addresses[0]?.id ?? '');
  const [category, setCategory] = useState<MediaCategory>('Living Room');
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files);
      const newQueued: QueuedPhoto[] = selected.map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
      }));
      setFiles((prev) => [...prev, ...newQueued]);
      setError('');
    }
  };

  const removePhoto = (index: number) => {
    setFiles((prev) => {
      const target = prev[index];
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleUploadAll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) {
      setError('Please select at least one photo.');
      return;
    }
    if (!addressId) {
      setError('Please select an address for these photos.');
      return;
    }

    setUploading(true);
    try {
      for (const item of files) {
        const { dataUrl, compressedSize } = await uploadService.compressImage(item.file);
        addMedia({
          type: 'photo',
          category,
          addressId,
          inspectionId: '',
          name: item.file.name,
          dataUrl,
          size: compressedSize,
          caption: caption.trim(),
        });
      }

      addToast(
        `Successfully uploaded ${files.length} photo${files.length > 1 ? 's' : ''}!`,
        'success',
      );
      // Clean up preview object URLs
      files.forEach((f) => URL.revokeObjectURL(f.previewUrl));
      navigate('/pictures');
    } catch {
      setError('An error occurred during photo processing.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-full bg-brand-light pb-8">
      <ScreenHeader title="Add Pictures" />

      <form onSubmit={handleUploadAll} className="px-4 py-4 space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle size={16} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Multi-photo picker */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="bg-white border-2 border-dashed border-gray-300 hover:border-navy-800 rounded-2xl p-6 text-center cursor-pointer transition-colors shadow-soft"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFilesSelected}
            className="hidden"
          />

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-xl bg-accent-50 text-accent-700 flex items-center justify-center mb-2">
              <Camera size={24} />
            </div>
            <p className="text-xs font-bold text-navy-800">Tap to take or choose photos</p>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Select multiple photos at once (JPG, PNG)
            </p>
          </div>
        </div>

        {/* Selected Photos Preview Grid */}
        {files.length > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-soft space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
              <span className="font-semibold text-navy-800">{files.length} Photos Selected</span>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-navy-800 font-medium hover:underline"
              >
                + Add more
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {files.map((item, idx) => (
                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group">
                  <img
                    src={item.previewUrl}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(idx)}
                    className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white hover:bg-red-600 transition-colors"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Metadata form */}
        <div className="bg-white rounded-2xl p-4 shadow-soft space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Room / Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as MediaCategory)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-navy-800 focus:outline-none bg-white"
            >
              {PHOTO_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Associated Property *
            </label>
            <select
              value={addressId}
              onChange={(e) => setAddressId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-navy-800 focus:outline-none bg-white"
            >
              {addresses.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.label} ({a.city})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Caption / Notes</label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="e.g. Scratches on kitchen floor near fridge"
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-navy-800 focus:outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={uploading || files.length === 0}
          className="w-full py-3.5 rounded-xl bg-navy-800 hover:bg-navy-900 disabled:opacity-50 text-white font-semibold text-sm transition-colors shadow-soft flex items-center justify-center gap-2"
        >
          <ImageIcon size={16} />
          {uploading ? 'Compressing & Uploading...' : `Upload ${files.length} Photo${files.length !== 1 ? 's' : ''}`}
        </button>
      </form>
    </div>
  );
}
