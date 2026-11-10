import React, { useState, useEffect, useCallback } from 'react';
import {
  X,
  Download,
  Copy,
  Check,
  Folder as FolderIcon,
  Tag as TagIcon,
  Eye,
  Trash2,
  Edit2,
  Save,
  Link2,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  FileText,
  Video,
  Music,
  Calendar,
  Layers,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { MediaAsset, MediaFolder } from '../../types/mediaLibrary';
import { mediaLibraryApi } from '../../services/mediaLibraryApi';
import { toast } from '../ui/Toast';

interface MediaPreviewModalProps {
  asset: MediaAsset | null;
  folders: MediaFolder[];
  isOpen: boolean;
  onClose: () => void;
  onUpdated: () => void;
  onDeleted: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
  currentIndex?: number;
  totalCount?: number;
}

export const MediaPreviewModal: React.FC<MediaPreviewModalProps> = ({
  asset,
  folders,
  isOpen,
  onClose,
  onUpdated,
  onDeleted,
  onPrev,
  onNext,
  hasPrev = false,
  hasNext = false,
  currentIndex,
  totalCount,
}) => {
  if (!isOpen || !asset) return null;

  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(asset.original_name);
  const [folderId, setFolderId] = useState<number | null>(asset.media_folder_id);
  const [tags, setTags] = useState<string[]>(asset.tags || []);
  const [newTag, setNewTag] = useState('');
  const [saving, setSaving] = useState(false);

  // Sync state whenever the active asset changes (e.g. via Next/Prev)
  useEffect(() => {
    if (asset) {
      setName(asset.original_name);
      setFolderId(asset.media_folder_id);
      setTags(asset.tags || []);
      setIsEditing(false);
      setCopied(false);
    }
  }, [asset]);

  // Keyboard navigation: Escape to close, Left/Right for prev/next
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isEditing) {
        onClose();
      } else if (e.key === 'ArrowLeft' && hasPrev && onPrev && !isEditing) {
        onPrev();
      } else if (e.key === 'ArrowRight' && hasNext && onNext && !isEditing) {
        onNext();
      }
    },
    [onClose, onPrev, onNext, hasPrev, hasNext, isEditing]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    const kb = bytes / 1024;
    if (kb < 1024) return kb.toFixed(1) + ' KB';
    const mb = kb / 1024;
    return mb.toFixed(1) + ' MB';
  };

  const getFileExtension = (name: string, mime: string) => {
    const ext = name.split('.').pop()?.toUpperCase();
    if (ext && ext.length <= 4) return ext;
    return mime.split('/').pop()?.toUpperCase() || 'FILE';
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(asset.url);
    setCopied(true);
    toast.success('Copied to Clipboard', 'Public media URL ready to use.');
    setTimeout(() => setCopied(false), 2200);
  };

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      await mediaLibraryApi.updateAsset(asset.id, {
        original_name: name.trim(),
        media_folder_id: folderId,
        tags,
      });
      setIsEditing(false);
      onUpdated();
      toast.success('Updated', 'Media properties updated successfully.');
    } catch (err: any) {
      toast.error('Error', err.response?.data?.message || 'Failed to update asset');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        'Are you sure you want to delete this media file? It will be safely archived without breaking live posts.'
      )
    ) {
      return;
    }
    try {
      await mediaLibraryApi.deleteAsset(asset.id);
      onDeleted();
      onClose();
    } catch (err: any) {
      toast.error('Error', err.response?.data?.message || 'Failed to delete asset');
    }
  };

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = newTag.trim().replace(/^#/, '');
      if (val && !tags.includes(val)) {
        setTags([...tags, val]);
        setNewTag('');
      }
    }
  };

  const removeTag = (t: string) => {
    setTags(tags.filter((item) => item !== t));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[92vh] max-h-[920px] flex flex-col md:flex-row overflow-hidden border border-slate-800/30">
        {/* ========================================================= */}
        {/* LEFT VIEWPORT: Visual Stage with Dark Neutral Checkerboard */}
        {/* ========================================================= */}
        <div className="flex-1 bg-slate-950 flex flex-col items-center justify-between relative overflow-hidden select-none">
          {/* Top Stage Bar: Badges, Counter, and Quick Actions */}
          <div className="w-full flex items-center justify-between px-5 py-3.5 z-20 bg-gradient-to-b from-slate-950/90 via-slate-950/60 to-transparent">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-slate-800/90 backdrop-blur-md text-emerald-400 text-[11px] font-bold rounded-lg border border-slate-700/60 uppercase tracking-wider">
                {getFileExtension(asset.original_name, asset.mime_type)}
              </span>

              {asset.width && asset.height && (
                <span className="px-2.5 py-1 bg-slate-800/90 backdrop-blur-md text-slate-300 text-[11px] font-medium rounded-lg border border-slate-700/60">
                  {asset.width} × {asset.height} px
                </span>
              )}

              {typeof currentIndex === 'number' && typeof totalCount === 'number' && (
                <span className="text-xs text-slate-400 font-medium ml-1">
                  {currentIndex + 1} of {totalCount}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <a
                href={asset.url}
                target="_blank"
                rel="noreferrer"
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-xl transition-colors"
                title="Open original in new tab"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Centered Media Canvas with Checkerboard Background for Transparencies */}
          <div className="w-full flex-1 flex items-center justify-center relative p-6 overflow-hidden">
            {/* Ambient subtle glow based on file type */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

            {/* Prev Navigation Button */}
            {hasPrev && onPrev && (
              <button
                type="button"
                onClick={onPrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 shadow-xl backdrop-blur-sm transition-all hover:scale-105 active:scale-95"
                title="Previous (Left Arrow)"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}

            {/* Next Navigation Button */}
            {hasNext && onNext && (
              <button
                type="button"
                onClick={onNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 shadow-xl backdrop-blur-sm transition-all hover:scale-105 active:scale-95"
                title="Next (Right Arrow)"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}

            {/* Media Rendering */}
            <div className="relative z-10 max-h-full max-w-full flex items-center justify-center">
              {asset.file_type === 'image' && (
                <div className="relative rounded-xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-900/50">
                  <img
                    src={asset.url}
                    alt={asset.original_name}
                    className="max-h-[66vh] max-w-full object-contain select-none transition-transform duration-200"
                  />
                </div>
              )}

              {asset.file_type === 'video' && (
                <div className="rounded-xl overflow-hidden shadow-2xl border border-slate-800 bg-black max-w-full max-h-[66vh]">
                  <video
                    src={asset.url}
                    controls
                    className="max-h-[66vh] max-w-full object-contain"
                    autoPlay={false}
                    playsInline
                  />
                </div>
              )}

              {asset.file_type === 'audio' && (
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-8 max-w-md w-full text-center space-y-5 shadow-2xl">
                  <div className="w-16 h-16 bg-purple-500/10 text-purple-400 rounded-2xl mx-auto flex items-center justify-center border border-purple-500/20">
                    <Music className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-base truncate">{asset.original_name}</h4>
                    <p className="text-slate-400 text-xs mt-1 font-mono">{formatFileSize(asset.file_size)}</p>
                  </div>
                  <audio src={asset.url} controls className="w-full mt-2" />
                </div>
              )}

              {asset.file_type === 'document' && (
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-8 max-w-sm w-full text-center space-y-4 shadow-2xl">
                  <div className="w-16 h-16 bg-blue-500/10 text-blue-400 rounded-2xl mx-auto flex items-center justify-center border border-blue-500/20">
                    <FileText className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm truncate">{asset.original_name}</h4>
                    <span className="inline-block px-2 py-0.5 mt-1 rounded bg-slate-800 text-slate-300 text-[11px] font-mono">
                      {asset.mime_type}
                    </span>
                  </div>
                  <a
                    href={asset.url}
                    target="_blank"
                    rel="noreferrer"
                    download={asset.original_name}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-md transition-all active:scale-98"
                  >
                    <Download className="w-4 h-4" />
                    Download Document
                  </a>
                </div>
              )}

              {asset.file_type === 'other' && (
                <div className="text-center text-slate-400 space-y-3 p-8">
                  <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
                    <FileText className="w-7 h-7" />
                  </div>
                  <p className="text-xs text-slate-300">File preview not available for this format</p>
                  <a
                    href={asset.url}
                    download={asset.original_name}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs rounded-xl"
                  >
                    <Download className="w-4 h-4" />
                    Download ({formatFileSize(asset.file_size)})
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Stage Footnote: Keyboard Shortcuts helper */}
          <div className="w-full px-5 py-2.5 z-20 bg-gradient-to-t from-slate-950/90 via-slate-950/60 to-transparent flex items-center justify-between text-[11px] text-slate-500">
            <div className="flex items-center gap-3">
              <span>
                Use <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">←</kbd>{' '}
                <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">→</kbd> to
                browse
              </span>
              <span>
                <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">Esc</kbd> to
                close
              </span>
            </div>
            <span className="font-mono text-slate-400">{formatFileSize(asset.file_size)}</span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT SIDEBAR: Asset Inspector & Metadata Management      */}
        {/* ========================================================= */}
        <div className="w-full md:w-96 bg-white flex flex-col border-l border-slate-100 h-full overflow-hidden shrink-0">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/50">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Asset Inspector</h3>
              <p className="text-[11px] text-slate-400">Metadata and CRM integrations</p>
            </div>
            <div className="flex items-center gap-1">
              {!isEditing && (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-colors"
                  title="Edit asset properties"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Inspector Body */}
          <div className="flex-1 p-5 space-y-5 overflow-y-auto">
            {/* File Name */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                File Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs font-semibold rounded-xl border border-slate-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 py-2 px-3 text-slate-900 bg-white"
                />
              ) : (
                <p className="text-xs font-bold text-slate-900 break-all leading-relaxed">{asset.original_name}</p>
              )}
            </div>

            {/* Folder Assignment */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Folder
              </label>
              {isEditing ? (
                <select
                  value={folderId ?? ''}
                  onChange={(e) => setFolderId(e.target.value ? Number(e.target.value) : null)}
                  className="w-full text-xs font-medium rounded-xl border border-slate-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 py-2 px-3 bg-white"
                >
                  <option value="">📁 Root / Unorganized</option>
                  {folders.map((f) => (
                    <option key={f.id} value={f.id}>
                      📂 {f.name}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="flex items-center gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <FolderIcon className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold truncate">{asset.folder?.name || 'Root / Unorganized'}</span>
                </div>
              )}
            </div>

            {/* Tags */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Tags & Labels
              </label>
              {isEditing ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Type tag and press Enter..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={addTag}
                    className="w-full text-xs rounded-xl border border-slate-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 py-2 px-3 bg-white"
                  />
                  <div className="flex flex-wrap gap-1.5">
                    {tags.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md font-medium"
                      >
                        #{t}
                        <button type="button" onClick={() => removeTag(t)} className="hover:text-emerald-950">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {asset.tags && asset.tags.length > 0 ? (
                    asset.tags.map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-1 text-xs font-semibold text-emerald-800 bg-emerald-50/80 rounded-lg border border-emerald-200/60"
                      >
                        #{t}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400 italic">No tags assigned</span>
                  )}
                </div>
              )}
            </div>

            {/* Inline Save / Cancel buttons when editing */}
            {isEditing && (
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving || !name.trim()}
                  className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
                >
                  <Save className="w-3.5 h-3.5" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}

            {/* Spec Attributes Card */}
            <div className="border border-slate-100 rounded-2xl p-3.5 bg-slate-50/60 space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span className="text-slate-400 font-medium">File Size</span>
                <span className="font-semibold text-slate-900">{formatFileSize(asset.file_size)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span className="text-slate-400 font-medium">MIME Type</span>
                <span className="font-mono text-[11px] text-slate-700">{asset.mime_type}</span>
              </div>
              {asset.width && asset.height && (
                <div className="flex items-center justify-between text-slate-600">
                  <span className="text-slate-400 font-medium">Dimensions</span>
                  <span className="font-mono text-slate-900">
                    {asset.width} × {asset.height} px
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between text-slate-600">
                <span className="text-slate-400 font-medium">Uploaded</span>
                <span className="text-slate-700 font-medium">
                  {new Date(asset.created_at).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span className="text-slate-400 font-medium">Total Usage</span>
                <span className="text-slate-700 font-semibold">{asset.access_count} times</span>
              </div>
            </div>

            {/* Cross-Module Usage References */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <Link2 className="w-3.5 h-3.5 text-emerald-600" />
                  Active CRM References
                </span>
                {asset.references && (
                  <span className="text-slate-400 font-mono">({asset.references.length})</span>
                )}
              </div>
              {asset.references && asset.references.length > 0 ? (
                <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                  {asset.references.map((ref) => (
                    <div
                      key={ref.id}
                      className="p-2 bg-emerald-50/50 border border-emerald-100 rounded-xl text-xs text-emerald-950 flex items-center justify-between"
                    >
                      <span className="font-semibold capitalize text-emerald-800">
                        {ref.reference_type.replace('_', ' ')}
                      </span>
                      <span className="text-emerald-600 font-mono text-[11px]">#{ref.reference_id}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center">
                  Safe to delete — no published posts or landing pages reference this file.
                </p>
              )}
            </div>

            {/* Public URL Box */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Public Shareable URL
              </label>
              <div className="flex items-center gap-1.5 p-1.5 bg-slate-50 border border-slate-200 rounded-xl">
                <input
                  type="text"
                  readOnly
                  value={asset.url}
                  className="w-full bg-transparent text-xs text-slate-600 font-mono outline-none px-2 truncate select-all"
                />
                <button
                  type="button"
                  onClick={copyUrl}
                  className={`p-1.5 rounded-lg transition-all shrink-0 flex items-center gap-1 text-xs font-semibold ${
                    copied
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                  }`}
                  title="Copy URL"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Actions Toolbar */}
          <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleDelete}
              className="px-3.5 py-2 text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>

            <a
              href={asset.url}
              download={asset.original_name}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5 active:scale-98 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Download
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
export default MediaPreviewModal;
