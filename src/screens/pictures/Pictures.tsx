import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { useToast } from '@/store/useToast';
import { ScreenHeader } from '@/components/ScreenHeader';
import { PHOTO_CATEGORIES } from '@/data/seed';
import {
  Image as ImageIcon,
  Plus,
  Heart,
  Trash2,
  Maximize2,
} from 'lucide-react';

export function Pictures() {
  const navigate = useNavigate();
  const { media, addresses, toggleFavourite, deleteMedia } = useStore();
  const { addToast } = useToast();

  const [selectedFilter, setSelectedFilter] = useState<'all' | 'favourites' | string>('all');
  const [selectedAddress, setSelectedAddress] = useState<string>('all');

  const photos = useMemo(() => {
    return media.filter((m) => m.type === 'photo');
  }, [media]);

  const filteredPhotos = useMemo(() => {
    return photos.filter((photo) => {
      if (selectedFilter === 'favourites' && !photo.favourite) return false;
      if (
        selectedFilter !== 'all' &&
        selectedFilter !== 'favourites' &&
        photo.category !== selectedFilter
      ) {
        return false;
      }
      if (selectedAddress !== 'all' && photo.addressId !== selectedAddress) return false;
      return true;
    });
  }, [photos, selectedFilter, selectedAddress]);

  const favouritesCount = photos.filter((p) => p.favourite).length;

  return (
    <div className="min-h-full bg-brand-light pb-8">
      <ScreenHeader
        title="Pictures"
        showBack={false}
        rightAction={
          <button
            onClick={() => navigate('/pictures/add')}
            className="p-1.5 rounded-full bg-navy-800 text-white hover:bg-navy-900 transition-colors"
            title="Add Pictures"
          >
            <Plus size={18} />
          </button>
        }
      />

      <div className="px-4 py-4 space-y-4">
        {/* Category & Filter Tabs */}
        <div className="space-y-2">
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedFilter === 'all'
                  ? 'bg-navy-800 text-white shadow-soft'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              All Photos ({photos.length})
            </button>
            <button
              onClick={() => setSelectedFilter('favourites')}
              className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 ${
                selectedFilter === 'favourites'
                  ? 'bg-red-500 text-white shadow-soft'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Heart size={12} className={selectedFilter === 'favourites' ? 'fill-white' : ''} />
              Favourites ({favouritesCount})
            </button>
            {PHOTO_CATEGORIES.map((cat) => {
              const count = photos.filter((p) => p.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedFilter(cat)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedFilter === cat
                      ? 'bg-navy-800 text-white shadow-soft'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {cat} {count > 0 && `(${count})`}
                </button>
              );
            })}
          </div>

          {/* Address Filter */}
          {addresses.length > 1 && (
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-gray-500 font-medium">Property:</span>
              <select
                value={selectedAddress}
                onChange={(e) => setSelectedAddress(e.target.value)}
                className="bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs text-navy-800 focus:outline-none"
              >
                <option value="all">All Properties</option>
                {addresses.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Photos Grid */}
        {filteredPhotos.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-soft">
            <div className="w-12 h-12 rounded-full bg-accent-50 flex items-center justify-center mx-auto mb-3">
              <ImageIcon size={24} className="text-accent-600" />
            </div>
            <h3 className="text-sm font-bold text-navy-800 mb-1">No pictures found</h3>
            <p className="text-xs text-gray-400 mb-4">
              {selectedFilter === 'favourites'
                ? 'You have not marked any photos as favourite yet.'
                : 'Start documenting rooms to protect your deposit at move-out.'}
            </p>
            <button
              onClick={() => navigate('/pictures/add')}
              className="px-4 py-2 rounded-xl bg-navy-800 text-white text-xs font-medium hover:bg-navy-900 transition-colors"
            >
              Add Pictures Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredPhotos.map((photo) => {
              const addr = addresses.find((a) => a.id === photo.addressId);

              return (
                <div
                  key={photo.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-card transition-all flex flex-col group relative"
                >
                  <div
                    onClick={() => navigate(`/viewer/${photo.id}`)}
                    className="relative aspect-square bg-gray-100 cursor-pointer overflow-hidden"
                  >
                    {photo.dataUrl ? (
                      <img
                        src={photo.dataUrl}
                        alt={photo.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-navy-50 text-navy-600">
                        <ImageIcon size={32} />
                      </div>
                    )}

                    {/* Top pill for Category */}
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-[10px] text-white font-medium">
                      {photo.category}
                    </span>

                    {/* Fullscreen icon */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/viewer/${photo.id}`);
                      }}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
                      title="View Fullscreen"
                    >
                      <Maximize2 size={13} />
                    </button>
                  </div>

                  <div className="p-2.5 flex items-center justify-between gap-1 mt-auto">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-navy-800 truncate">{photo.name}</p>
                      <p className="text-[10px] text-gray-400 truncate">
                        {addr?.label ?? 'Photo'} {photo.caption ? `· ${photo.caption}` : ''}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => toggleFavourite(photo.id)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                        title="Favourite"
                      >
                        <Heart
                          size={15}
                          className={photo.favourite ? 'fill-red-500 text-red-500' : ''}
                        />
                      </button>
                      <button
                        onClick={() => {
                          deleteMedia(photo.id);
                          addToast('Picture deleted.', 'info');
                        }}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
