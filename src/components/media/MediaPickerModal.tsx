import React, { useState, useEffect } from 'react';
import {
  X,
  Search,
  UploadCloud,
  Check,
  Image as ImageIcon,
  Video,
  FileText,
  Folder as FolderIcon,
  CheckCircle2,
} from 'lucide-react';
import { mediaLibraryApi } from '../../services/mediaLibraryApi';
import { MediaAsset, MediaFolder } from '../../types/mediaLibrary';
import { MediaUploadModal } from './MediaUploadModal';

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (asset: MediaAsset) => void;
  allowedTypes?: 'image' | 'video' | 'all';
  title?: string;
}

export const MediaPickerModal: React.FC<MediaPickerModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  allowedTypes = 'all',
  title = 'Select Media Asset',
}) => {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [folders, setFolders] = useState<MediaFolder[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);
  const [loading, setLoading] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadFolders();
      loadAssets();
      setSelectedAsset(null);
    }
  }, [isOpen, selectedFolder, search]);

  const loadFolders = async () => {
    try {
      const res = await mediaLibraryApi.getFolders();
      if (res.success) setFolders(res.data);
    } catch (e) {
      // ignore
    }
  };

  const loadAssets = async () => {
    setLoading(true);
    try {
      const filters: any = {
        per_page: 50,
      };
      if (allowedTypes !== 'all') {
        filters.file_type = allowedTypes;
      }
      if (selectedFolder !== 'all') {
        filters.folder_id = selectedFolder;
      }
      if (search.trim()) {
        filters.search = search.trim();
      }

      const res = await mediaLibraryApi.getAssets(filters);
      if (res.success) {
        setAssets(res.data);
      }
    } catch (e) {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleConfirmSelect = () => {
    if (selectedAsset) {
      mediaLibraryApi.recordAccess(selectedAsset.id);
      onSelect(selectedAsset);
      onClose();
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    const kb = bytes / 1024;
    if (kb < 1024) return kb.toFixed(1) + ' KB';
    const mb = kb / 1024;
    return mb.toFixed(1) + ' MB';
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div>
              <h2 className="text-lg font-bold text-gray-900">{title}</h2>
              <p className="text-xs text-gray-500">Pick from existing CRM media assets or upload new</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsUploadOpen(true)}
                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <UploadCloud className="w-4 h-4" />
                Upload New
              </button>
              <button
                onClick={onClose}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="p-4 border-b border-gray-100 flex flex-wrap items-center gap-3 bg-gray-50/50">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search files..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 bg-white"
              />
            </div>

            <div className="flex items-center gap-2">
              <FolderIcon className="w-4 h-4 text-gray-400" />
              <select
                value={selectedFolder}
                onChange={(e) => setSelectedFolder(e.target.value)}
                className="text-xs rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 bg-white py-1.5 px-3"
              >
                <option value="all">All Folders</option>
                <option value="root">📁 Root / Unorganized</option>
                {folders.map((f) => (
                  <option key={f.id} value={f.id}>
                    📂 {f.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Grid Area */}
          <div className="flex-1 p-5 overflow-y-auto">
            {loading ? (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                Loading media assets...
              </div>
            ) : assets.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">No media assets found</p>
                  <p className="text-xs text-gray-400 mt-0.5">Upload a file to start using it in your content</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(true)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow transition-all"
                >
                  Upload First File
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
                {assets.map((asset) => {
                  const isSelected = selectedAsset?.id === asset.id;
                  return (
                    <div
                      key={asset.id}
                      onClick={() => setSelectedAsset(asset)}
                      onDoubleClick={() => {
                        setSelectedAsset(asset);
                        onSelect(asset);
                        onClose();
                      }}
                      className={`group relative rounded-xl border-2 cursor-pointer overflow-hidden transition-all flex flex-col bg-white ${
                        isSelected
                          ? 'border-emerald-600 ring-2 ring-emerald-500/30 shadow-md'
                          : 'border-gray-100 hover:border-emerald-300 hover:shadow-sm'
                      }`}
                    >
                      {/* Thumbnail Container */}
                      <div className="aspect-square bg-gray-100 relative overflow-hidden flex items-center justify-center">
                        {asset.file_type === 'image' ? (
                          <img
                            src={asset.url}
                            alt={asset.original_name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            loading="lazy"
                          />
                        ) : asset.file_type === 'video' ? (
                          <div className="flex flex-col items-center justify-center text-pink-500">
                            <Video className="w-8 h-8" />
                            <span className="text-[10px] uppercase font-bold mt-1">Video</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center text-blue-500">
                            <FileText className="w-8 h-8" />
                            <span className="text-[10px] uppercase font-bold mt-1">Doc</span>
                          </div>
                        )}

                        {/* Selected Checkmark Badge */}
                        {isSelected && (
                          <div className="absolute top-2 right-2 bg-emerald-600 text-white rounded-full p-1 shadow-md">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}
                      </div>

                      {/* Info footer */}
                      <div className="p-2.5">
                        <p className="text-xs font-semibold text-gray-800 truncate" title={asset.original_name}>
                          {asset.original_name}
                        </p>
                        <div className="flex items-center justify-between text-[11px] text-gray-400 mt-1">
                          <span>{formatFileSize(asset.file_size)}</span>
                          {asset.width && asset.height && (
                            <span>
                              {asset.width}x{asset.height}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-100">
            <div className="text-xs text-gray-500">
              {selectedAsset ? (
                <span className="font-medium text-gray-800">Selected: {selectedAsset.original_name}</span>
              ) : (
                <span>Click a file to select</span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!selectedAsset}
                onClick={handleConfirmSelect}
                className={`px-5 py-2 text-xs font-semibold text-white rounded-xl shadow-md transition-all flex items-center gap-1.5 ${
                  selectedAsset
                    ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20 active:scale-98'
                    : 'bg-emerald-300 cursor-not-allowed shadow-none'
                }`}
              >
                <Check className="w-4 h-4" />
                Select Asset
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Upload Modal if user triggers from inside picker */}
      <MediaUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        folders={folders}
        onSuccess={() => {
          loadAssets();
        }}
      />
    </>
  );
};

