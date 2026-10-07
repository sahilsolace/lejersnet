import { useMemo } from 'react';
import { useStore } from '@/store/useStore';
import { useToast } from '@/store/useToast';
import { ScreenHeader } from '@/components/ScreenHeader';
import { FileText, Image as ImageIcon, Download, HardDrive, Shield } from 'lucide-react';
import { formatBytes } from '@/lib/utils';

export function Files() {
  const { media, addresses, inspections, user } = useStore();
  const { addToast } = useToast();

  const totalBytes = useMemo(() => {
    return media.reduce((acc, m) => acc + (m.size || 0), 0);
  }, [media]);

  const photoBytes = useMemo(() => {
    return media.filter((m) => m.type === 'photo').reduce((acc, m) => acc + (m.size || 0), 0);
  }, [media]);

  const documentBytes = useMemo(() => {
    return media.filter((m) => m.type === 'document').reduce((acc, m) => acc + (m.size || 0), 0);
  }, [media]);

  const photosCount = media.filter((m) => m.type === 'photo').length;
  const docsCount = media.filter((m) => m.type === 'document').length;

  const handleExportData = () => {
    const data = {
      exportDate: new Date().toISOString(),
      user,
      addresses,
      inspections,
      mediaCount: media.length,
      media: media.map((m) => ({
        id: m.id,
        name: m.name,
        type: m.type,
        category: m.category,
        size: m.size,
        caption: m.caption,
        createdAt: m.createdAt,
      })),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lejersnet_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    addToast('Tenant data export archive downloaded.', 'success');
  };

  return (
    <div className="min-h-full bg-brand-light pb-8">
      <ScreenHeader title="All Files & Storage" />

      <div className="px-4 py-4 space-y-4">
        {/* Total Storage Summary */}
        <div className="bg-white rounded-2xl p-5 shadow-soft space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-navy-50 text-navy-700 flex items-center justify-center">
              <HardDrive size={22} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Cloud Storage Used</p>
              <h2 className="text-xl font-bold text-navy-800">{formatBytes(totalBytes)}</h2>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
            <div className="bg-brand-light rounded-xl p-3 flex items-center gap-2.5">
              <ImageIcon size={18} className="text-accent-600 flex-shrink-0" />
              <div>
                <p className="text-xs font-bold text-navy-800">{photosCount} Photos</p>
                <p className="text-[10px] text-gray-400">{formatBytes(photoBytes)}</p>
              </div>
            </div>

            <div className="bg-brand-light rounded-xl p-3 flex items-center gap-2.5">
              <FileText size={18} className="text-navy-600 flex-shrink-0" />
              <div>
                <p className="text-xs font-bold text-navy-800">{docsCount} Documents</p>
                <p className="text-[10px] text-gray-400">{formatBytes(documentBytes)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Export Data Card */}
        <div className="bg-white rounded-2xl p-4 shadow-soft space-y-3">
          <h3 className="text-xs font-bold text-navy-800 uppercase tracking-wide">
            Data Portability & Backup
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Download a verified JSON backup containing all registered tenancies, inspection records,
            and file metadata.
          </p>

          <button
            onClick={handleExportData}
            className="w-full py-3 rounded-xl bg-navy-800 hover:bg-navy-900 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-soft"
          >
            <Download size={15} />
            Export All Data (JSON)
          </button>
        </div>

        {/* Security badge */}
        <div className="p-3.5 rounded-2xl bg-white border border-gray-100 flex items-start gap-3 text-xs text-gray-500">
          <Shield size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
          <p>
            All media stored on LejersNet is encrypted at rest and in transit. Files are only
            accessible to you and authorized tenancy legal advisors.
          </p>
        </div>
      </div>
    </div>
  );
}
