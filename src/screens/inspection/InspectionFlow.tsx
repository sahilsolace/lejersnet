import { useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { useToast } from '@/store/useToast';
import { ScreenHeader } from '@/components/ScreenHeader';
import { StatusChip } from '@/components/StatusChip';
import {
  PHOTO_CATEGORIES,
  DOCUMENT_CATEGORIES,
} from '@/data/seed';
import {
  CheckCircle2,
  ChevronRight,
  Camera,
  FileCheck2,
  Sparkles,
} from 'lucide-react';
import type { InspectionType, MediaCategory } from '@/types';

const ALL_INSPECTION_CATEGORIES: MediaCategory[] = [
  ...PHOTO_CATEGORIES,
  ...DOCUMENT_CATEGORIES,
];

export function InspectionFlow() {
  const { addressId, type } = useParams<{ addressId: string; type: InspectionType }>();
  const navigate = useNavigate();
  const { addresses, inspections, media, addInspection, updateInspection } = useStore();
  const { addToast } = useToast();

  const inspectionType = type === 'move_out' ? 'move_out' : 'move_in';
  const address = addresses.find((a) => a.id === addressId);

  // Find existing inspection or auto-create one
  const inspection = useMemo(() => {
    return inspections.find((i) => i.addressId === addressId && i.type === inspectionType);
  }, [inspections, addressId, inspectionType]);

  useEffect(() => {
    if (addressId && !inspection) {
      addInspection({
        addressId,
        type: inspectionType,
        date: new Date().toISOString().split('T')[0],
        status: 'in_progress',
      });
    }
  }, [addressId, inspection, inspectionType, addInspection]);

  const inspId = inspection?.id ?? '';
  const inspectionMedia = useMemo(() => {
    return media.filter((m) => m.inspectionId === inspId);
  }, [media, inspId]);

  // Group media by category
  const categoryCounts = useMemo(() => {
    const map = new Map<MediaCategory, number>();
    inspectionMedia.forEach((m) => {
      map.set(m.category, (map.get(m.category) ?? 0) + 1);
    });
    return map;
  }, [inspectionMedia]);

  if (!address) {
    return (
      <div className="min-h-full bg-brand-light p-6 text-center">
        <ScreenHeader title="Inspection" />
        <p className="text-sm text-gray-500 mt-8">Address not found.</p>
        <button
          onClick={() => navigate('/addresses')}
          className="mt-4 px-4 py-2 rounded-xl bg-navy-800 text-white text-xs"
        >
          Back to Directory
        </button>
      </div>
    );
  }

  const documentedCategoriesCount = ALL_INSPECTION_CATEGORIES.filter(
    (c) => (categoryCounts.get(c) ?? 0) > 0,
  ).length;

  const progressPercent = Math.round(
    (documentedCategoriesCount / ALL_INSPECTION_CATEGORIES.length) * 100,
  );

  const isCompleted = inspection?.status === 'completed';

  const handleToggleComplete = () => {
    if (!inspId) return;
    const nextStatus = isCompleted ? 'in_progress' : 'completed';
    updateInspection(inspId, { status: nextStatus });
    addToast(
      nextStatus === 'completed'
        ? 'Inspection report marked as completed!'
        : 'Inspection reopened.',
      'success',
    );
  };

  return (
    <div className="min-h-full bg-brand-light pb-10">
      <ScreenHeader
        title={inspectionType === 'move_in' ? 'Move-In Inspection' : 'Move-Out Inspection'}
      />

      <div className="px-4 py-4 space-y-4">
        {/* Header overview card */}
        <div className="bg-white rounded-2xl p-4 shadow-soft">
          <div className="flex items-start justify-between gap-2 mb-3">
            <div>
              <span className="text-[11px] font-semibold uppercase text-accent-600 tracking-wider">
                {inspectionType === 'move_in' ? 'Move-In Report' : 'Move-Out Report'}
              </span>
              <h2 className="text-base font-bold text-navy-800">{address.label}</h2>
              <p className="text-xs text-gray-500">
                {address.street} {address.number}, {address.city}
              </p>
            </div>
            <StatusChip
              status={isCompleted ? 'Completed' : 'In Progress'}
              variant={isCompleted ? 'active' : 'upcoming'}
            />
          </div>

          {/* Progress bar */}
          <div className="space-y-1.5 pt-2 border-t border-gray-100">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Documented sections</span>
              <span className="font-semibold text-navy-800">
                {documentedCategoriesCount} of {ALL_INSPECTION_CATEGORIES.length} (
                {progressPercent}%)
              </span>
            </div>
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-accent-500 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Categories Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold text-navy-800 uppercase tracking-wider">
              Rooms & Checkpoints
            </h3>
            <span className="text-[11px] text-gray-400">
              {inspectionMedia.length} total photos & docs
            </span>
          </div>

          <div className="space-y-2">
            {ALL_INSPECTION_CATEGORIES.map((category) => {
              const count = categoryCounts.get(category) ?? 0;
              const hasPhotos = count > 0;
              const catMedia = inspectionMedia.filter((m) => m.category === category);
              const previewPhoto = catMedia.find((m) => m.type === 'photo' && m.dataUrl);

              return (
                <button
                  key={category}
                  onClick={() =>
                    navigate(
                      `/inspection/category/${encodeURIComponent(inspId)}/${encodeURIComponent(
                        category,
                      )}`,
                    )
                  }
                  className="w-full bg-white rounded-2xl p-3 shadow-soft hover:shadow-card transition-all flex items-center justify-between text-left group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {previewPhoto ? (
                      <img
                        src={previewPhoto.dataUrl}
                        alt={category}
                        className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                      />
                    ) : (
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                          hasPhotos ? 'bg-green-50 text-green-600' : 'bg-navy-50 text-navy-600'
                        }`}
                      >
                        {hasPhotos ? <CheckCircle2 size={22} /> : <Camera size={20} />}
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-navy-800 truncate">{category}</p>
                      <p className="text-xs text-gray-500">
                        {count === 0 ? 'Not documented yet' : `${count} item${count > 1 ? 's' : ''}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {hasPhotos ? (
                      <span className="px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-[10px] font-bold">
                        {count} saved
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-accent-50 text-accent-700 text-[10px] font-semibold">
                        Add photo
                      </span>
                    )}
                    <ChevronRight size={18} className="text-gray-300 group-hover:text-navy-800" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Complete button */}
        <div className="pt-2">
          <button
            onClick={handleToggleComplete}
            className={`w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-soft ${
              isCompleted
                ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {isCompleted ? (
              <>
                <FileCheck2 size={18} />
                Reopen Inspection
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Mark Inspection as Completed
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
