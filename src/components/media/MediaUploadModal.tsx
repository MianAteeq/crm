import React, { useState, useRef } from 'react';
import {
  X,
  UploadCloud,
  FileText,
  Image as ImageIcon,
  Video,
  Music,
  AlertCircle,
  CheckCircle,
  Plus,
  Trash2,
} from 'lucide-react';
import { mediaLibraryApi } from '../../services/mediaLibraryApi';
import { MediaFolder } from '../../types/mediaLibrary';

interface MediaUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  folders: MediaFolder[];
  selectedFolderId?: number | null;
  onSuccess: () => void;
}

export const MediaUploadModal: React.FC<MediaUploadModalProps> = ({
  isOpen,
  onClose,
  folders,
  selectedFolderId = null,
  onSuccess,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [folderId, setFolderId] = useState<number | null>(selectedFolderId);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(Array.from(e.target.files));
    }
  };

  const addFiles = (newFiles: File[]) => {
    setErrorMessage(null);
    const validFiles: File[] = [];

    newFiles.forEach((file) => {
      // 100MB limit check
      if (file.size > 100 * 1024 * 1024) {
        setErrorMessage(`File ${file.name} exceeds the 100MB size limit.`);
      } else {
        validFiles.push(file);
      }
    });

    setFiles((prev) => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = tagInput.trim();
      if (val && !tags.includes(val)) {
        setTags([...tags, val]);
        setTagInput('');
      }
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    setUploadProgress(0);
    setErrorMessage(null);

    try {
      await mediaLibraryApi.uploadFiles(files, folderId, tags, (percent) => {
        setUploadProgress(percent);
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    const kb = bytes / 1024;
    if (kb < 1024) return kb.toFixed(1) + ' KB';
    const mb = kb / 1024;
    return mb.toFixed(1) + ' MB';
  };

  const getFileIcon = (mime: string) => {
    if (mime.startsWith('image/')) return <ImageIcon className="w-5 h-5 text-emerald-500" />;
    if (mime.startsWith('video/')) return <Video className="w-5 h-5 text-pink-500" />;
    if (mime.startsWith('audio/')) return <Music className="w-5 h-5 text-purple-500" />;
    return <FileText className="w-5 h-5 text-blue-500" />;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Upload Media Assets</h2>
            <p className="text-xs text-gray-500">Supports Images, Videos, PDFs and Documents up to 100MB</p>
          </div>
          <button
            onClick={onClose}
            disabled={uploading}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {errorMessage && (
            <div className="flex items-center gap-2 p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Drag & Drop Zone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
              dragActive
                ? 'border-emerald-500 bg-emerald-50/50 scale-[1.01]'
                : 'border-gray-200 hover:border-emerald-400 hover:bg-gray-50/50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileChange}
              accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.csv,.txt"
            />
            <div className="w-14 h-14 mx-auto mb-3 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center shadow-inner">
              <UploadCloud className="w-7 h-7" />
            </div>
            <p className="text-sm font-semibold text-gray-800">
              Drag and drop files here, or <span className="text-emerald-600 underline">browse</span>
            </p>
            <p className="text-xs text-gray-400 mt-1">
              JPG, PNG, WEBP, GIF, MP4, MOV, PDF, DOCX (Max 100MB each)
            </p>
          </div>

          {/* Options: Folder & Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Destination Folder</label>
              <select
                value={folderId ?? ''}
                onChange={(e) => setFolderId(e.target.value ? Number(e.target.value) : null)}
                className="w-full text-sm rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 bg-gray-50/50 py-2.5 px-3"
              >
                <option value="">📁 Root / Unorganized</option>
                {folders.map((f) => (
                  <option key={f.id} value={f.id}>
                    📂 {f.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Tags (Press Enter)</label>
              <input
                type="text"
                placeholder="e.g. holiday, promo, logo"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={addTag}
                className="w-full text-sm rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 bg-gray-50/50 py-2.5 px-3"
              />
            </div>
          </div>

          {/* Render Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-emerald-800 bg-emerald-100 rounded-lg"
                >
                  #{tag}
                  <button type="button" onClick={() => removeTag(tag)} className="hover:text-emerald-950">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Selected Files List */}
          {files.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-gray-700">
                <span>Selected Files ({files.length})</span>
                <button
                  type="button"
                  onClick={() => setFiles([])}
                  disabled={uploading}
                  className="text-red-500 hover:text-red-700"
                >
                  Clear All
                </button>
              </div>

              <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                {files.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-xl"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      {getFileIcon(file.type)}
                      <div className="truncate">
                        <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
                        <p className="text-xs text-gray-400">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    {!uploading && (
                      <button
                        type="button"
                        onClick={() => removeFile(idx)}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Progress Bar */}
          {uploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-gray-600">
                <span>Uploading files...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-600 transition-all duration-300 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            disabled={uploading}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleUpload}
            disabled={files.length === 0 || uploading}
            className={`px-5 py-2.5 text-sm font-semibold text-white rounded-xl shadow-md transition-all flex items-center gap-2 ${
              files.length === 0 || uploading
                ? 'bg-emerald-300 cursor-not-allowed shadow-none'
                : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20 active:scale-98'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            {uploading ? `Uploading (${uploadProgress}%)` : `Upload ${files.length > 0 ? `(${files.length})` : ''}`}
          </button>
        </div>
      </div>
    </div>
  );
};

