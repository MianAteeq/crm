import React, { useRef, useState } from 'react';
import {
  UploadCloud,
  X,
  Loader2,
  Image as ImageIcon,
  Film,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  FileCheck,
  FolderOpen,
} from 'lucide-react';
import { SocialPostMedia } from '../../types/socialPlanner';
import { socialPlannerApi } from '../../services/socialPlannerApi';
import { MediaPickerModal } from '../media/MediaPickerModal';
import { MediaAsset } from '../../types/mediaLibrary';

interface MediaUploaderProps {
  media: SocialPostMedia[];
  onChange: (media: SocialPostMedia[]) => void;
  maxFiles?: number;
  disabled?: boolean;
}

const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const SUPPORTED_VIDEO_TYPES = ['video/mp4', 'video/quicktime'];
const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_SIZE_BYTES = 100 * 1024 * 1024; // 100MB

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  media,
  onChange,
  maxFiles = 10,
  disabled = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number; filename: string } | null>(
    null
  );
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const handleSelectFromLibrary = (asset: MediaAsset) => {
    if (media.length >= maxFiles) {
      setUploadError(`Maximum ${maxFiles} media files allowed.`);
      return;
    }
    const newMediaItem: SocialPostMedia = {
      id: asset.id,
      media_type: asset.file_type === 'video' ? 'video' : 'image',
      url: asset.url,
      file_path: asset.file_path,
      filename: asset.filename,
      file_size: asset.file_size,
      mime_type: asset.mime_type,
      width: asset.width || undefined,
      height: asset.height || undefined,
      order: media.length,
    };
    onChange([...media, newMediaItem]);
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0 || disabled) return;

    if (media.length + files.length > maxFiles) {
      setUploadError(`Maximum ${maxFiles} media files allowed for carousel posts.`);
      return;
    }

    setUploadError(null);

    // 1. Client-side validation of all files before initiating upload
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const isImage = SUPPORTED_IMAGE_TYPES.includes(file.type);
      const isVideo = SUPPORTED_VIDEO_TYPES.includes(file.type);

      if (!isImage && !isVideo) {
        setUploadError(
          `"${file.name}" is not a supported format. Please upload JPG, PNG, WEBP, GIF, MP4, or MOV files.`
        );
        return;
      }

      if (isImage && file.size > MAX_IMAGE_SIZE_BYTES) {
        setUploadError(`Photo "${file.name}" exceeds the 10MB size limit (${formatFileSize(file.size)}).`);
        return;
      }

      if (isVideo && file.size > MAX_VIDEO_SIZE_BYTES) {
        setUploadError(`Video "${file.name}" exceeds the 100MB size limit (${formatFileSize(file.size)}).`);
        return;
      }
    }

    setIsUploading(true);

    try {
      const newItems: SocialPostMedia[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const localBlobUrl = URL.createObjectURL(file);
        setUploadProgress({ current: i + 1, total: files.length, filename: file.name });

        const res = await socialPlannerApi.uploadMedia(file);
        if (res.success && res.data) {
          newItems.push({
            media_type: res.data.media_type,
            url: res.data.url,
            blob_url: localBlobUrl,
            stream_url: (res.data as any).stream_url,
            file_path: res.data.file_path,
            filename: res.data.filename,
            file_size: res.data.file_size,
            mime_type: res.data.mime_type,
            width: res.data.width,
            height: res.data.height,
            aspect_ratio: res.data.aspect_ratio,
            order: media.length + newItems.length,
          });
        }
      }

      onChange([...media, ...newItems]);
    } catch (err: any) {
      console.error('Failed to upload media:', err);
      setUploadError(err.response?.data?.message || err.message || 'Failed to upload media.');
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = (index: number) => {
    if (disabled) return;
    const updated = media.filter((_, i) => i !== index).map((item, idx) => ({ ...item, order: idx }));
    onChange(updated);
  };

  const handleMoveLeft = (index: number) => {
    if (disabled || index === 0) return;
    const updated = [...media];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    onChange(updated.map((item, idx) => ({ ...item, order: idx })));
  };

  const handleMoveRight = (index: number) => {
    if (disabled || index === media.length - 1) return;
    const updated = [...media];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    onChange(updated.map((item, idx) => ({ ...item, order: idx })));
  };

  return (
    <div className="space-y-3">
      {/* Top Header with Choose from Media Library */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-semibold text-slate-700">Attach Photos / Videos</span>
        <button
          type="button"
          onClick={() => setIsPickerOpen(true)}
          disabled={disabled || media.length >= maxFiles}
          className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
        >
          <FolderOpen size={14} className="text-emerald-600" />
          Choose from Media Library
        </button>
      </div>

      {/* Upload Dropzone */}
      <div
        onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
        className={`border-2 border-dashed rounded-2xl p-5 text-center transition-all cursor-pointer select-none ${
          disabled
            ? 'opacity-60 cursor-not-allowed bg-slate-50 border-slate-200'
            : isUploading
            ? 'bg-emerald-50/50 border-emerald-400 ring-2 ring-emerald-500/10'
            : 'border-slate-300 hover:border-[#166534] hover:bg-[#F0FDF4]/30 bg-slate-50/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/png,image/jpeg,image/jpg,image/webp,image/gif,video/mp4,video/quicktime"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
          disabled={disabled || isUploading}
        />

        {isUploading && uploadProgress ? (
          <div className="flex flex-col items-center justify-center py-2 space-y-2.5">
            <Loader2 size={24} className="animate-spin text-[#166534]" />
            <div>
              <p className="text-xs font-bold text-slate-800">
                Uploading {uploadProgress.current} of {uploadProgress.total}:{' '}
                <span className="text-[#166534]">{uploadProgress.filename}</span>
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Processing media dimensions & metadata for Meta Graph API...
              </p>
            </div>
            {/* Progress indicator bar */}
            <div className="w-48 h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#166534] transition-all duration-300"
                style={{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-1.5">
            <div className="w-10 h-10 rounded-xl bg-white shadow-xs border border-slate-200 text-[#166534] flex items-center justify-center">
              <UploadCloud size={20} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-800">
                <span className="text-[#166534] font-bold">Click to upload</span> or drag and drop
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Photos (JPG, PNG, WEBP, GIF up to 10MB) or Videos (MP4, MOV up to 100MB) • Max {maxFiles} files
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Error alert */}
      {uploadError && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
          <AlertTriangle size={15} className="shrink-0 text-rose-500" />
          <span className="font-medium">{uploadError}</span>
        </div>
      )}

      {/* Uploaded media previews with reordering & thumbnail info */}
      {media.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
            <span className="font-semibold text-slate-700">
              {media.length} {media.length === 1 ? 'file' : 'files'} attached
            </span>
            <span>Use arrows to reorder carousel slides</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {media.map((item, index) => (
              <div
                key={index}
                className="group relative rounded-xl overflow-hidden border border-slate-200 bg-slate-900 aspect-square shadow-2xs transition-all hover:border-slate-400 flex flex-col justify-between"
              >
                {item.media_type === 'video' ? (
                  <div className="relative w-full h-full flex items-center justify-center bg-slate-950">
                    <video src={item.url} className="w-full h-full object-cover opacity-80" />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-8 h-8 rounded-full bg-white/90 text-slate-800 flex items-center justify-center shadow-md">
                        <Film size={15} />
                      </div>
                    </div>
                  </div>
                ) : (
                  <img
                    src={item.url}
                    alt={item.filename}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                )}

                {/* Top Badge: Slide index and Media type */}
                <div className="absolute top-1.5 left-1.5 flex items-center gap-1 z-10">
                  <span className="px-1.5 py-0.5 rounded-md bg-black/70 backdrop-blur-xs text-[10px] font-mono font-bold text-white shadow-xs">
                    #{index + 1}
                  </span>
                  <span className="px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[9px] font-bold uppercase tracking-wider text-slate-200">
                    {item.media_type === 'video' ? 'Video' : 'Photo'}
                  </span>
                </div>

                {/* Delete button (top-right) */}
                {!disabled && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(index);
                    }}
                    title="Remove media"
                    className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-slate-900/80 hover:bg-rose-600 text-white flex items-center justify-center transition-all shadow-md z-10 cursor-pointer"
                  >
                    <X size={12} />
                  </button>
                )}

                {/* Bottom Overlay: Reorder controls + File info */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-2 text-white flex items-center justify-between z-10">
                  {/* File name & size */}
                  <div className="min-w-0 pr-1">
                    <p className="text-[10px] font-semibold truncate leading-tight" title={item.filename}>
                      {item.filename}
                    </p>
                    <p className="text-[9px] text-slate-300">
                      {formatFileSize(item.file_size)} {item.aspect_ratio ? `• ${item.aspect_ratio}` : ''}
                    </p>
                  </div>

                  {/* Reorder Arrows */}
                  {!disabled && media.length > 1 && (
                    <div className="flex items-center gap-0.5 shrink-0 bg-black/40 rounded-lg p-0.5 backdrop-blur-xs">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveLeft(index);
                        }}
                        disabled={index === 0}
                        title="Move slide left"
                        className="w-5 h-5 rounded flex items-center justify-center text-white hover:bg-white/20 disabled:opacity-20 transition-all cursor-pointer disabled:cursor-not-allowed"
                      >
                        <ChevronLeft size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveRight(index);
                        }}
                        disabled={index === media.length - 1}
                        title="Move slide right"
                        className="w-5 h-5 rounded flex items-center justify-center text-white hover:bg-white/20 disabled:opacity-20 transition-all cursor-pointer disabled:cursor-not-allowed"
                      >
                        <ChevronRight size={13} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reusable Media Library Picker Modal */}
      <MediaPickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onSelect={handleSelectFromLibrary}
        allowedTypes="all"
        title="Select Media for Post"
      />
    </div>
  );
};
