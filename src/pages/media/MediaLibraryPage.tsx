import React, { useState, useEffect } from 'react';
import {
  Folder,
  FolderPlus,
  UploadCloud,
  Search,
  Grid,
  List,
  Image as ImageIcon,
  Video,
  FileText,
  Music,
  Trash2,
  Move,
  Download,
  Copy,
  Eye,
  CheckSquare,
  Square,
  HardDrive,
  RefreshCw,
  Plus,
  FolderOpen,
  Edit2,
  Link as LinkIcon,
  Check,
  ChevronRight,
} from 'lucide-react';
import { mediaLibraryApi } from '../../services/mediaLibraryApi';
import { MediaAsset, MediaFolder, MediaStats, MediaFilters } from '../../types/mediaLibrary';
import { MediaUploadModal } from '../../components/media/MediaUploadModal';
import { MediaPreviewModal } from '../../components/media/MediaPreviewModal';
import { MediaFolderModal } from '../../components/media/MediaFolderModal';
import { toast } from '../../components/ui/Toast';

export const MediaLibraryPage: React.FC = () => {
  // Stats & Folders state
  const [stats, setStats] = useState<MediaStats | null>(null);
  const [folders, setFolders] = useState<MediaFolder[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<string | number>('all');

  // Assets list & pagination state
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  // Filters state
  const [activeType, setActiveType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'created_at' | 'original_name' | 'file_size' | 'access_count'>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Bulk selection state
  const [selectedAssetIds, setSelectedAssetIds] = useState<number[]>([]);

  // Modals state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [previewAsset, setPreviewAsset] = useState<MediaAsset | null>(null);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [folderToEdit, setFolderToEdit] = useState<MediaFolder | null>(null);
  const [showBulkMoveDropdown, setShowBulkMoveDropdown] = useState(false);

  // Initial load
  useEffect(() => {
    loadStats();
    loadFolders();
  }, []);

  // Reload assets whenever filters change
  useEffect(() => {
    loadAssets(1);
    setSelectedAssetIds([]);
  }, [selectedFolderId, activeType, searchQuery, sortBy, sortOrder]);

  const loadStats = async () => {
    try {
      const res = await mediaLibraryApi.getStats();
      if (res.success) setStats(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const loadFolders = async () => {
    try {
      const res = await mediaLibraryApi.getFolders();
      if (res.success) setFolders(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const loadAssets = async (page: number = 1) => {
    setLoading(true);
    try {
      const filters: MediaFilters = {
        page,
        per_page: 30,
        sort_by: sortBy,
        sort_order: sortOrder,
      };

      if (selectedFolderId !== 'all') {
        filters.folder_id = selectedFolderId;
      }
      if (activeType !== 'all') {
        filters.file_type = activeType;
      }
      if (searchQuery.trim()) {
        filters.search = searchQuery.trim();
      }

      const res = await mediaLibraryApi.getAssets(filters);
      if (res.success) {
        setAssets(res.data);
        setPagination(res.pagination);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Preview Navigation Handlers (Prev / Next inside Preview Modal)
  const previewIndex = previewAsset ? assets.findIndex((a) => a.id === previewAsset.id) : -1;
  const hasPrevAsset = previewIndex > 0;
  const hasNextAsset = previewIndex >= 0 && previewIndex < assets.length - 1;

  const handlePrevAsset = () => {
    if (hasPrevAsset) {
      setPreviewAsset(assets[previewIndex - 1]);
    }
  };

  const handleNextAsset = () => {
    if (hasNextAsset) {
      setPreviewAsset(assets[previewIndex + 1]);
    }
  };

  const handleSelectAll = () => {
    if (selectedAssetIds.length === assets.length) {
      setSelectedAssetIds([]);
    } else {
      setSelectedAssetIds(assets.map((a) => a.id));
    }
  };

  const toggleSelectAsset = (id: number) => {
    setSelectedAssetIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedAssetIds.length} files?`)) {
      return;
    }
    try {
      await mediaLibraryApi.bulkDelete(selectedAssetIds);
      setSelectedAssetIds([]);
      loadAssets(pagination.current_page);
      loadStats();
    } catch (e) {
      // toast handled
    }
  };

  const handleBulkMove = async (targetFolderId: number | null) => {
    try {
      await mediaLibraryApi.bulkMove(selectedAssetIds, targetFolderId);
      setShowBulkMoveDropdown(false);
      setSelectedAssetIds([]);
      loadAssets(pagination.current_page);
      loadFolders();
    } catch (e) {
      // toast handled
    }
  };

  const handleDeleteFolder = async (folder: MediaFolder) => {
    if (
      !window.confirm(
        `Are you sure you want to delete folder "${folder.name}"? Files will be moved to root.`
      )
    ) {
      return;
    }
    try {
      await mediaLibraryApi.deleteFolder(folder.id);
      if (selectedFolderId === folder.id) {
        setSelectedFolderId('all');
      }
      loadFolders();
      loadStats();
    } catch (e) {
      // toast handled
    }
  };

  const handleCopyUrl = (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    toast.success('Copied', 'Public URL copied to clipboard.');
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileExtension = (name: string, mime: string) => {
    const ext = name.split('.').pop()?.toUpperCase();
    if (ext && ext.length <= 4) return ext;
    return mime.split('/').pop()?.toUpperCase() || 'FILE';
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="w-5 h-5 text-emerald-600" />;
      case 'video':
        return <Video className="w-5 h-5 text-pink-600" />;
      case 'audio':
        return <Music className="w-5 h-5 text-purple-600" />;
      default:
        return <FileText className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto font-sans">
      {/* ========================================================= */}
      {/* 1. Header Bar: Title, Context, and Primary Actions        */}
      {/* ========================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Media Storage</h1>
            <span className="px-2 py-0.5 text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60 rounded-md">
              Centralized Library
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Store, organize, and reuse assets across social campaigns, reels, forms, and landing pages.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              setFolderToEdit(null);
              setIsFolderModalOpen(true);
            }}
            className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 text-xs font-semibold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <FolderPlus className="w-4 h-4 text-slate-500" />
            <span>New Folder</span>
          </button>

          <button
            type="button"
            onClick={() => setIsUploadOpen(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer active:scale-98"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Media</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. Storage Overview Card: Compact, Restrained, Informative */}
      {/* ========================================================= */}
      {stats && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs grid grid-cols-1 md:grid-cols-4 gap-5 items-center">
          {/* Storage Quota Gauge */}
          <div className="space-y-2 md:border-r border-slate-100 md:pr-5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700">Storage Usage</span>
              <span className="font-bold text-emerald-700 font-mono text-[11px]">
                {stats.usage_percentage}%
              </span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  stats.usage_percentage > 90
                    ? 'bg-rose-500'
                    : stats.usage_percentage > 70
                    ? 'bg-amber-500'
                    : 'bg-emerald-600'
                }`}
                style={{ width: `${Math.max(1, stats.usage_percentage)}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>{formatBytes(stats.total_storage_used)} used</span>
              <span>{formatBytes(stats.total_storage_quota)} quota</span>
            </div>
          </div>

          {/* KPI Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:col-span-3">
            <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
              <span className="text-[11px] font-semibold text-slate-500 block">Total Files</span>
              <p className="text-xl font-bold text-slate-900 mt-0.5">{stats.total_files}</p>
            </div>

            <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
              <span className="text-[11px] font-semibold text-slate-500 block">Images</span>
              <p className="text-xl font-bold text-slate-900 mt-0.5">{stats.images_count}</p>
            </div>

            <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
              <span className="text-[11px] font-semibold text-slate-500 block">Videos & Reels</span>
              <p className="text-xl font-bold text-slate-900 mt-0.5">{stats.videos_count}</p>
            </div>

            <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
              <span className="text-[11px] font-semibold text-slate-500 block">Documents</span>
              <p className="text-xl font-bold text-slate-900 mt-0.5">{stats.documents_count}</p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. Main Workspace: Folders Sidebar + Media Grid Explorer  */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Sidebar: Folder Navigation */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 space-y-3 shrink-0">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <FolderOpen className="w-3.5 h-3.5 text-slate-500" />
              Folders
            </span>
            <button
              type="button"
              onClick={() => {
                setFolderToEdit(null);
                setIsFolderModalOpen(true);
              }}
              className="p-1 hover:bg-slate-100 text-slate-500 rounded-lg transition-colors cursor-pointer"
              title="Create new folder"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <nav className="space-y-1">
            {/* All Media */}
            <button
              type="button"
              onClick={() => setSelectedFolderId('all')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedFolderId === 'all'
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-200/60 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Folder className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>All Media</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">{stats?.total_files ?? 0}</span>
            </button>

            {/* Root / Unorganized */}
            <button
              type="button"
              onClick={() => setSelectedFolderId('root')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedFolderId === 'root'
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-200/60 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Folder className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Unorganized</span>
              </div>
            </button>

            {/* Custom / Seed Folders */}
            <div className="pt-2 space-y-1">
              {folders.map((folder) => {
                const isSelected = selectedFolderId === folder.id;
                return (
                  <div
                    key={folder.id}
                    className={`group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50 text-emerald-900 border border-emerald-200/60 shadow-xs'
                        : 'text-slate-700 hover:bg-slate-50 border border-transparent'
                    }`}
                    onClick={() => setSelectedFolderId(folder.id)}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: folder.color || '#3B82F6' }}
                      />
                      <span className="truncate">{folder.name}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[10px] text-slate-400 px-1.5 py-0.5 rounded bg-slate-100 font-mono">
                        {folder.assets_count ?? 0}
                      </span>
                      <div className="opacity-0 group-hover:opacity-100 flex items-center transition-opacity">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFolderToEdit(folder);
                            setIsFolderModalOpen(true);
                          }}
                          className="p-1 hover:text-emerald-700 text-slate-400"
                          title="Rename Folder"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteFolder(folder);
                          }}
                          className="p-1 hover:text-rose-600 text-slate-400"
                          title="Delete Folder"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </nav>
        </div>

        {/* Right Main Area: Explorer & Grid */}
        <div className="lg:col-span-9 space-y-4">
          {/* Controls Bar: Filters, Search & View Modes */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 space-y-3.5">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Search Box */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search assets by file name or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs font-medium rounded-xl border border-slate-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 bg-slate-50/50"
                />
              </div>

              {/* Sorting & Views */}
              <div className="flex items-center gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="text-xs font-semibold rounded-xl border border-slate-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 py-1.5 px-3 bg-white text-slate-700 cursor-pointer"
                >
                  <option value="created_at">Date Uploaded</option>
                  <option value="original_name">Name (A-Z)</option>
                  <option value="file_size">File Size</option>
                  <option value="access_count">Popularity</option>
                </select>

                <button
                  type="button"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 text-xs font-bold cursor-pointer transition-colors"
                  title="Toggle Ascending/Descending"
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </button>

                <div className="flex items-center border border-slate-200 rounded-xl p-0.5 bg-slate-50">
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      viewMode === 'grid' ? 'bg-white shadow-xs text-emerald-700' : 'text-slate-400 hover:text-slate-600'
                    }`}
                    title="Grid View"
                  >
                    <Grid className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      viewMode === 'list' ? 'bg-white shadow-xs text-emerald-700' : 'text-slate-400 hover:text-slate-600'
                    }`}
                    title="List View"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Type Filter Tabs & Bulk Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-slate-100">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {[
                  { id: 'all', label: 'All Files', icon: HardDrive },
                  { id: 'image', label: 'Images', icon: ImageIcon },
                  { id: 'video', label: 'Videos', icon: Video },
                  { id: 'document', label: 'Documents', icon: FileText },
                  { id: 'audio', label: 'Audio', icon: Music },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeType === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveType(tab.id)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
                        isActive
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200/80 text-slate-600'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Bulk Action Controls */}
              {selectedAssetIds.length > 0 && (
                <div className="flex items-center gap-2 animate-in fade-in duration-150">
                  <span className="text-[11px] font-bold text-emerald-900 bg-emerald-100 px-2.5 py-1 rounded-lg">
                    {selectedAssetIds.length} Selected
                  </span>

                  {/* Move To Dropdown */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowBulkMoveDropdown(!showBulkMoveDropdown)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer"
                    >
                      <Move className="w-3.5 h-3.5" />
                      <span>Move To</span>
                    </button>

                    {showBulkMoveDropdown && (
                      <div className="absolute right-0 mt-1 w-52 bg-white border border-slate-200 rounded-xl shadow-lg z-30 py-1">
                        <button
                          type="button"
                          onClick={() => handleBulkMove(null)}
                          className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-emerald-50 cursor-pointer"
                        >
                          📁 Root / Unorganized
                        </button>
                        {folders.map((f) => (
                          <button
                            key={f.id}
                            type="button"
                            onClick={() => handleBulkMove(f.id)}
                            className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-emerald-50 flex items-center gap-2 cursor-pointer"
                          >
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: f.color || '#3B82F6' }} />
                            <span>{f.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleBulkDelete}
                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ========================================================= */}
          {/* Media Items Area: Professional Responsive Grid Card UI    */}
          {/* ========================================================= */}
          {loading ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-16 text-center text-slate-400">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-600" />
              <p className="text-xs font-semibold text-slate-600">Loading media library assets...</p>
            </div>
          ) : assets.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-4">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl mx-auto flex items-center justify-center">
                <UploadCloud className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">No media assets in this view</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  Upload images, videos, audio, or documents to use across your CRM campaigns and landing pages.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsUploadOpen(true)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
              >
                Upload First File
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            /* ========================================================= */
            /* REFINED GRID VIEW: Authentic Human-Designed Aesthetic     */
            /* ========================================================= */
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3.5">
              {assets.map((asset) => {
                const isSelected = selectedAssetIds.includes(asset.id);
                const fileExt = getFileExtension(asset.original_name, asset.mime_type);

                return (
                  <div
                    key={asset.id}
                    className={`group bg-white rounded-2xl border transition-all overflow-hidden flex flex-col relative select-none ${
                      isSelected
                        ? 'border-emerald-600 ring-2 ring-emerald-500/20 shadow-sm'
                        : 'border-slate-200/90 hover:border-slate-400/80 hover:shadow-md'
                    }`}
                  >
                    {/* Visual Thumbnail Stage */}
                    <div
                      onClick={() => setPreviewAsset(asset)}
                      className="aspect-square bg-slate-100 relative overflow-hidden cursor-pointer flex items-center justify-center"
                    >
                      {/* Subtle checkerboard pattern for transparent PNG / SVG assets */}
                      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:10px_10px] opacity-60" />

                      {asset.file_type === 'image' ? (
                        <img
                          src={asset.url}
                          alt={asset.original_name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 relative z-1"
                          loading="lazy"
                        />
                      ) : asset.file_type === 'video' ? (
                        <div className="flex flex-col items-center justify-center text-pink-600 relative z-1">
                          <div className="w-10 h-10 rounded-full bg-pink-50 border border-pink-200 flex items-center justify-center shadow-xs">
                            <Video className="w-5 h-5 text-pink-600" />
                          </div>
                        </div>
                      ) : asset.file_type === 'audio' ? (
                        <div className="flex flex-col items-center justify-center text-purple-600 relative z-1">
                          <div className="w-10 h-10 rounded-full bg-purple-50 border border-purple-200 flex items-center justify-center shadow-xs">
                            <Music className="w-5 h-5 text-purple-600" />
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-blue-600 relative z-1">
                          <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center shadow-xs">
                            <FileText className="w-5 h-5 text-blue-600" />
                          </div>
                        </div>
                      )}

                      {/* Top Action Row: Checkbox & Quick Copy URL */}
                      <div className="absolute top-2 inset-x-2 flex items-center justify-between z-10">
                        {/* Checkbox */}
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSelectAsset(asset.id);
                          }}
                          className={`w-6 h-6 rounded-lg flex items-center justify-center cursor-pointer transition-opacity ${
                            isSelected
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'opacity-0 group-hover:opacity-100 bg-white/90 text-slate-400 hover:text-slate-800 shadow-xs'
                          }`}
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 stroke-[2.5]" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </div>

                        {/* Quick View & Copy Pill on Hover */}
                        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                          <button
                            type="button"
                            onClick={(e) => handleCopyUrl(e, asset.url)}
                            className="p-1.5 rounded-lg bg-white/90 hover:bg-white text-slate-600 hover:text-slate-900 shadow-xs backdrop-blur-xs transition-colors"
                            title="Copy Public URL"
                          >
                            <LinkIcon className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Bottom Meta Overlay: Format Badge & Dimensions */}
                      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between z-10 pointer-events-none">
                        <span className="px-1.5 py-0.5 bg-slate-950/70 backdrop-blur-xs text-white text-[10px] font-bold rounded uppercase tracking-wider font-mono">
                          {fileExt}
                        </span>

                        {asset.width && asset.height && (
                          <span className="px-1.5 py-0.5 bg-slate-950/70 backdrop-blur-xs text-slate-200 text-[10px] rounded font-mono">
                            {asset.width}×{asset.height}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Metadata Card Footer */}
                    <div className="p-3 space-y-1 bg-white">
                      <p
                        className="text-xs font-semibold text-slate-900 truncate hover:text-emerald-700 cursor-pointer"
                        title={asset.original_name}
                        onClick={() => setPreviewAsset(asset)}
                      >
                        {asset.original_name}
                      </p>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                        <span>{formatBytes(asset.file_size)}</span>
                        <span>{new Date(asset.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* ========================================================= */
            /* REFINED LIST VIEW: Structured, Dense, Product-Ready       */
            /* ========================================================= */
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3 w-10">
                      <button type="button" onClick={handleSelectAll} className="cursor-pointer">
                        {selectedAssetIds.length === assets.length && assets.length > 0 ? (
                          <CheckSquare className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-400" />
                        )}
                      </button>
                    </th>
                    <th className="p-3">File</th>
                    <th className="p-3">Folder</th>
                    <th className="p-3">Format</th>
                    <th className="p-3">Size</th>
                    <th className="p-3">Uploaded</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {assets.map((asset) => {
                    const isSelected = selectedAssetIds.includes(asset.id);
                    return (
                      <tr
                        key={asset.id}
                        className={`hover:bg-slate-50/80 transition-colors ${
                          isSelected ? 'bg-emerald-50/40' : ''
                        }`}
                      >
                        <td className="p-3">
                          <button
                            type="button"
                            onClick={() => toggleSelectAsset(asset.id)}
                            className="cursor-pointer"
                          >
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-400" />
                            )}
                          </button>
                        </td>
                        <td className="p-3">
                          <div
                            onClick={() => setPreviewAsset(asset)}
                            className="flex items-center gap-3 cursor-pointer group"
                          >
                            <div className="w-9 h-9 rounded-lg bg-slate-100 overflow-hidden shrink-0 flex items-center justify-center border border-slate-200/60">
                              {asset.file_type === 'image' ? (
                                <img src={asset.url} alt="" className="w-full h-full object-cover" />
                              ) : (
                                getFileIcon(asset.file_type)
                              )}
                            </div>
                            <span className="font-semibold text-slate-900 group-hover:text-emerald-700 truncate max-w-xs">
                              {asset.original_name}
                            </span>
                          </div>
                        </td>
                        <td className="p-3 text-slate-500">{asset.folder?.name || 'Root'}</td>
                        <td className="p-3 font-mono text-[11px] uppercase text-slate-400">
                          {getFileExtension(asset.original_name, asset.mime_type)}
                        </td>
                        <td className="p-3 text-slate-600 font-mono text-[11px]">{formatBytes(asset.file_size)}</td>
                        <td className="p-3 text-slate-400">{new Date(asset.created_at).toLocaleDateString()}</td>
                        <td className="p-3 text-right">
                          <button
                            type="button"
                            onClick={() => setPreviewAsset(asset)}
                            className="p-1.5 text-slate-400 hover:text-emerald-700 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
                            title="Preview asset"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* ========================================================= */}
          {/* Pagination Controls                                       */}
          {/* ========================================================= */}
          {pagination.last_page > 1 && (
            <div className="flex items-center justify-between bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-xs text-xs text-slate-500">
              <span>
                Page {pagination.current_page} of {pagination.last_page} ({pagination.total} total files)
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={pagination.current_page <= 1}
                  onClick={() => loadAssets(pagination.current_page - 1)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 rounded-lg font-semibold cursor-pointer"
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={pagination.current_page >= pagination.last_page}
                  onClick={() => loadAssets(pagination.current_page + 1)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 rounded-lg font-semibold cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      <MediaUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        folders={folders}
        selectedFolderId={typeof selectedFolderId === 'number' ? selectedFolderId : null}
        onSuccess={() => {
          loadAssets(1);
          loadFolders();
          loadStats();
        }}
      />

      {/* Preview Modal with Keyboard and Prev/Next Navigation */}
      <MediaPreviewModal
        isOpen={!!previewAsset}
        asset={previewAsset}
        folders={folders}
        onClose={() => setPreviewAsset(null)}
        onUpdated={() => {
          loadAssets(pagination.current_page);
          loadFolders();
        }}
        onDeleted={() => {
          loadAssets(pagination.current_page);
          loadFolders();
          loadStats();
        }}
        onPrev={handlePrevAsset}
        onNext={handleNextAsset}
        hasPrev={hasPrevAsset}
        hasNext={hasNextAsset}
        currentIndex={previewIndex >= 0 ? previewIndex : undefined}
        totalCount={assets.length}
      />

      {/* Folder Create/Edit Modal */}
      <MediaFolderModal
        isOpen={isFolderModalOpen}
        folderToEdit={folderToEdit}
        folders={folders}
        onClose={() => setIsFolderModalOpen(false)}
        onSuccess={() => {
          loadFolders();
          loadStats();
        }}
      />
    </div>
  );
};
export default MediaLibraryPage;
