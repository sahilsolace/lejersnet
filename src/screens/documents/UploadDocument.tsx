import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { useToast } from '@/store/useToast';
import { ScreenHeader } from '@/components/ScreenHeader';
import { DOCUMENT_CATEGORIES } from '@/data/seed';
import { uploadService } from '@/services/uploadService';
import { Upload, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { formatBytes } from '@/lib/utils';
import type { MediaCategory } from '@/types';

export function UploadDocument() {
  const navigate = useNavigate();
  const { addresses, addMedia } = useStore();
  const { addToast } = useToast();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [addressId, setAddressId] = useState(addresses[0]?.id ?? '');
  const [category, setCategory] = useState<MediaCategory>('Rental Contract');
  const [customName, setCustomName] = useState('');
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (!customName) {
        setCustomName(file.name);
      }
      setError('');
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please choose a file to upload.');
      return;
    }
    if (!addressId) {
      setError('Please select an associated address.');
      return;
    }

    setUploading(true);
    setProgress(20);

    try {
      const interval = setInterval(() => {
        setProgress((p) => Math.min(p + 25, 90));
      }, 150);

      const { dataUrl, compressedSize } = await uploadService.fileToDataUrl(selectedFile);
      await uploadService.uploadProgress();

      clearInterval(interval);
      setProgress(100);

      addMedia({
        type: 'document',
        category,
        addressId,
        inspectionId: '',
        name: customName.trim() || selectedFile.name,
        dataUrl,
        size: compressedSize || selectedFile.size,
        caption: caption.trim(),
      });

      addToast('Document saved successfully.', 'success');
      setTimeout(() => {
        navigate('/documents');
      }, 300);
    } catch {
      setError('Upload failed. Please try again.');
      setUploading(false);
    }
  };

  return (
    <div className="min-h-full bg-brand-light pb-8">
      <ScreenHeader title="Upload Document" />

      <form onSubmit={handleUpload} className="px-4 py-4 space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle size={16} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* File picker drop area */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="bg-white border-2 border-dashed border-gray-300 hover:border-navy-800 rounded-2xl p-6 text-center cursor-pointer transition-colors shadow-soft"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
            onChange={handleFileChange}
            className="hidden"
          />

          {selectedFile ? (
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center mb-2">
                <CheckCircle2 size={28} />
              </div>
              <p className="text-xs font-bold text-navy-800 truncate max-w-xs">
                {selectedFile.name}
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">
                {formatBytes(selectedFile.size)} · Tap to change
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-navy-50 text-navy-700 flex items-center justify-center mb-2">
                <Upload size={24} />
              </div>
              <p className="text-xs font-bold text-navy-800">Tap to select document</p>
              <p className="text-[11px] text-gray-400 mt-0.5">PDF, DOC, DOCX or images (max 25MB)</p>
            </div>
          )}
        </div>

        {uploading && (
          <div className="bg-white rounded-xl p-3 shadow-soft space-y-1">
            <div className="flex justify-between text-xs text-navy-800 font-medium">
              <span>Encrypting & uploading...</span>
              <span>{progress}%</span>
            </div>
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-accent-500 rounded-full transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Metadata form */}
        <div className="bg-white rounded-2xl p-4 shadow-soft space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Document Name</label>
            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="e.g. Standard Rental Contract 2024"
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-navy-800 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as MediaCategory)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-navy-800 focus:outline-none bg-white"
            >
              {DOCUMENT_CATEGORIES.map((c) => (
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
            <label className="block text-xs font-medium text-gray-700 mb-1">Notes / Description</label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Optional notes about this document..."
              rows={3}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-navy-800 focus:outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={uploading || !selectedFile}
          className="w-full py-3.5 rounded-xl bg-navy-800 hover:bg-navy-900 disabled:opacity-50 text-white font-semibold text-sm transition-colors shadow-soft flex items-center justify-center gap-2"
        >
          <FileText size={16} />
          {uploading ? 'Saving Document...' : 'Save Document'}
        </button>
      </form>
    </div>
  );
}
