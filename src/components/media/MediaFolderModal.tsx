import React, { useState, useEffect } from 'react';
import { X, FolderPlus, Edit3, Palette } from 'lucide-react';
import { MediaFolder } from '../../types/mediaLibrary';
import { mediaLibraryApi } from '../../services/mediaLibraryApi';
import { toast } from '../ui/Toast';

interface MediaFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  folderToEdit?: MediaFolder | null;
  folders: MediaFolder[];
  onSuccess: () => void;
}

const COLOR_OPTIONS = [
  '#3B82F6', // Blue
  '#10B981', // Emerald
  '#EC4899', // Pink
  '#8B5CF6', // Purple
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#6366F1', // Indigo
  '#6B7280', // Gray
];

export const MediaFolderModal: React.FC<MediaFolderModalProps> = ({
  isOpen,
  onClose,
  folderToEdit = null,
  folders,
  onSuccess,
}) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#3B82F6');
  const [parentId, setParentId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (folderToEdit) {
      setName(folderToEdit.name);
      setColor(folderToEdit.color || '#3B82F6');
      setParentId(folderToEdit.parent_id);
    } else {
      setName('');
      setColor('#3B82F6');
      setParentId(null);
    }
  }, [folderToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    try {
      if (folderToEdit) {
        await mediaLibraryApi.updateFolder(folderToEdit.id, {
          name: name.trim(),
          color,
          parent_id: parentId,
        });
      } else {
        await mediaLibraryApi.createFolder({
          name: name.trim(),
          color,
          parent_id: parentId,
        });
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error('Error', err.response?.data?.message || 'Failed to save folder');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              {folderToEdit ? <Edit3 className="w-5 h-5" /> : <FolderPlus className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base">
                {folderToEdit ? 'Edit Folder' : 'Create New Folder'}
              </h3>
              <p className="text-xs text-gray-400">Organize your campaigns, posts, and assets</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Folder Name</label>
            <input
              type="text"
              required
              autoFocus
              placeholder="e.g. Q4 Marketing Campaigns"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-sm rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 py-2.5 px-3"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Parent Folder (Optional)</label>
            <select
              value={parentId ?? ''}
              onChange={(e) => setParentId(e.target.value ? Number(e.target.value) : null)}
              className="w-full text-sm rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 py-2.5 px-3 bg-gray-50/50"
            >
              <option value="">None (Top-Level Root Folder)</option>
              {folders
                .filter((f) => !folderToEdit || f.id !== folderToEdit.id)
                .map((f) => (
                  <option key={f.id} value={f.id}>
                    📁 {f.name}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Folder Accent Color</label>
            <div className="flex items-center gap-2.5 pt-1">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full transition-transform flex items-center justify-center ${
                    color === c ? 'ring-2 ring-offset-2 ring-emerald-500 scale-110' : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !name.trim()}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white rounded-xl text-sm font-semibold shadow-md transition-all shadow-emerald-500/20"
            >
              {saving ? 'Saving...' : folderToEdit ? 'Save Changes' : 'Create Folder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

