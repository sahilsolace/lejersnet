import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { useToast } from '@/store/useToast';
import { ScreenHeader } from '@/components/ScreenHeader';
import { DOCUMENT_CATEGORIES } from '@/data/seed';
import {
  FileText,
  Plus,
  Search,
  Heart,
  Trash2,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { formatDateShort, formatBytes } from '@/lib/utils';

export function Documents() {
  const navigate = useNavigate();
  const { media, addresses, toggleFavourite, deleteMedia } = useStore();
  const { addToast } = useToast();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAddress, setSelectedAddress] = useState<string>('all');

  const documents = useMemo(() => {
    return media.filter((m) => m.type === 'document');
  }, [media]);

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      if (selectedCategory !== 'all' && doc.category !== selectedCategory) return false;
      if (selectedAddress !== 'all' && doc.addressId !== selectedAddress) return false;
      if (search.trim() && !doc.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [documents, selectedCategory, selectedAddress, search]);

  return (
    <div className="min-h-full bg-brand-light pb-8">
      <ScreenHeader
        title="Documents"
        showBack={false}
        rightAction={
          <button
            onClick={() => navigate('/documents/upload')}
            className="p-1.5 rounded-full bg-navy-800 text-white hover:bg-navy-900 transition-colors"
            title="Upload Document"
          >
            <Plus size={18} />
          </button>
        }
      />

      <div className="px-4 py-4 space-y-4">
        {/* Search bar */}
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search documents by name..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-gray-200 text-xs focus:outline-none focus:border-navy-800"
          />
        </div>

        {/* Address & Category Filters */}
        <div className="space-y-2">
          {/* Category Filter Pills */}
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === 'all'
                  ? 'bg-navy-800 text-white shadow-soft'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              All Docs ({documents.length})
            </button>
            {DOCUMENT_CATEGORIES.map((cat) => {
              const count = documents.filter((d) => d.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-navy-800 text-white shadow-soft'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {cat} {count > 0 && `(${count})`}
                </button>
              );
            })}
          </div>

          {/* Address select if more than 1 address */}
          {addresses.length > 1 && (
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-gray-500 font-medium">Filter by property:</span>
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

        {/* Documents List */}
        {filteredDocuments.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-soft">
            <div className="w-12 h-12 rounded-full bg-navy-50 flex items-center justify-center mx-auto mb-3">
              <FileText size={24} className="text-navy-600" />
            </div>
            <h3 className="text-sm font-bold text-navy-800 mb-1">No documents found</h3>
            <p className="text-xs text-gray-400 mb-4">
              Upload your rental agreement, deposit receipt, or insurance policies to keep them safe.
            </p>
            <button
              onClick={() => navigate('/documents/upload')}
              className="px-4 py-2 rounded-xl bg-navy-800 text-white text-xs font-medium hover:bg-navy-900 transition-colors"
            >
              Upload Document
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredDocuments.map((doc) => {
              const addr = addresses.find((a) => a.id === doc.addressId);

              return (
                <div
                  key={doc.id}
                  className="bg-white rounded-2xl p-3.5 shadow-soft hover:shadow-card transition-all flex items-center gap-3"
                >
                  <div
                    onClick={() => navigate(`/viewer/${doc.id}`)}
                    className="w-11 h-11 rounded-xl bg-navy-50 hover:bg-navy-100 flex items-center justify-center text-navy-700 flex-shrink-0 cursor-pointer transition-colors"
                  >
                    <FileText size={22} />
                  </div>

                  <div
                    onClick={() => navigate(`/viewer/${doc.id}`)}
                    className="flex-1 min-w-0 cursor-pointer"
                  >
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-bold text-navy-800 truncate">{doc.name}</p>
                      {doc.favourite && (
                        <Heart size={12} className="fill-red-500 text-red-500 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-gray-500 truncate mt-0.5">
                      {doc.category} · {addr?.label ?? 'General'}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {formatDateShort(doc.createdAt)} · {formatBytes(doc.size)}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => toggleFavourite(doc.id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 transition-colors"
                      title="Favourite"
                    >
                      <Heart
                        size={15}
                        className={doc.favourite ? 'fill-red-500 text-red-500' : ''}
                      />
                    </button>
                    <button
                      onClick={() => navigate(`/viewer/${doc.id}`)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-navy-800 transition-colors"
                      title="View details"
                    >
                      <ExternalLink size={15} />
                    </button>
                    <button
                      onClick={() => {
                        deleteMedia(doc.id);
                        addToast('Document removed.', 'info');
                      }}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete document"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Security badge footer */}
        <div className="p-3 rounded-2xl bg-white border border-gray-100 flex items-center gap-3 text-xs text-gray-500">
          <ShieldCheck size={20} className="text-green-600 flex-shrink-0" />
          <span>Documents stored are securely encrypted and always accessible when needed.</span>
        </div>
      </div>
    </div>
  );
}
