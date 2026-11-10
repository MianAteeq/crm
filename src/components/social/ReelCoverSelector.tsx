import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import {
  Image as ImageIcon,
  Film,
  UploadCloud,
  Check,
  X,
  RefreshCw,
  AlertTriangle,
  Play,
  Pause,
  Sliders,
  CheckCircle2,
  Info,
  Maximize2,
  Grid,
  Smartphone,
  Facebook,
  Instagram,
  Eye,
  RotateCcw,
} from 'lucide-react';
import { socialPlannerApi } from '../../services/socialPlannerApi';
import { toast } from '../ui/Toast';

export interface ReelCoverData {
  type: 'default' | 'custom' | 'frame';
  custom_cover_url?: string;
  custom_cover_path?: string;
  custom_cover_filename?: string;
  custom_cover_file_size?: number;
  thumb_offset_ms?: number;
  preview_url?: string;
}

interface ReelCoverSelectorProps {
  videoUrl: string;
  videoPath?: string;
  videoFilename?: string;
  value: ReelCoverData;
  onChange: (data: ReelCoverData) => void;
  hasInstagram: boolean;
  hasFacebook: boolean;
  disabled?: boolean;
}

export const ReelCoverSelector: React.FC<ReelCoverSelectorProps> = ({
  videoUrl,
  videoPath,
  videoFilename,
  value,
  onChange,
  hasInstagram,
  hasFacebook,
  disabled = false,
}) => {
  const [activeMode, setActiveMode] = useState<'upload' | 'frame'>('frame');
  const [previewAspect, setPreviewAspect] = useState<'vertical' | 'grid'>('vertical');
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Video Seeker State
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isCapturingFrame, setIsCapturingFrame] = useState(false);
  const [isLoadingVideo, setIsLoadingVideo] = useState(true);
  const [videoLoadError, setVideoLoadError] = useState<string | null>(null);
  const lastLoadedSrcRef = useRef<string>('');

  // Resolve best streamable URL for seeking and frame capture
  const resolvedVideoSrc = useMemo(() => {
    // 1. Blob or Data URLs are local to browser memory: instant seeking, zero CORS
    if (videoUrl && (videoUrl.startsWith('blob:') || videoUrl.startsWith('data:'))) {
      return videoUrl;
    }

    // 2. Direct videoPath (e.g. "social/100000/2026/11/...mp4"): route through stream endpoint with 206 Range support
    if (videoPath) {
      const cleanPath = videoPath.replace(/^(\/)?storage\//, '').replace(/^\/+/, '');
      return `/api/v1/social/media/stream?path=${encodeURIComponent(cleanPath)}`;
    }

    // 3. Backend stream API with Range header support for any /storage/ url
    if (videoUrl && videoUrl.includes('/storage/')) {
      const storageIdx = videoUrl.indexOf('/storage/');
      const relPath = videoUrl.substring(storageIdx + 9).replace(/^\/+/, '');
      return `/api/v1/social/media/stream?path=${encodeURIComponent(relPath)}`;
    }

    // 4. Any other non-empty videoUrl fallback
    if (videoUrl) {
      return `/api/v1/social/media/stream?url=${encodeURIComponent(videoUrl)}`;
    }

    return '';
  }, [videoUrl, videoPath]);

  // Determine whether crossOrigin attribute should be present
  // CRITICAL: blob: URLs MUST NOT have crossOrigin="anonymous", otherwise Chrome aborts with CORS error.
  const isBlobUrl = useMemo(() => {
    return resolvedVideoSrc.startsWith('blob:') || resolvedVideoSrc.startsWith('data:');
  }, [resolvedVideoSrc]);

  // Format seconds into MM:SS.mmm
  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0 || !isFinite(seconds)) return '00:00.000';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const millis = Math.floor((seconds % 1) * 1000);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(millis).padStart(3, '0')}`;
  };

  // Capture frame snapshot from video element onto canvas
  const captureSnapshot = useCallback(
    async (targetTime?: number, isDefaultInitial = false) => {
      const video = videoRef.current;
      if (!video) return;

      setIsCapturingFrame(true);

      try {
        if (targetTime !== undefined && Math.abs(video.currentTime - targetTime) > 0.02) {
          video.currentTime = targetTime;
          await new Promise<void>((resolve) => {
            const onSeeked = () => {
              video.removeEventListener('seeked', onSeeked);
              resolve();
            };
            video.addEventListener('seeked', onSeeked, { once: true });
            setTimeout(resolve, 350);
          });
        }

        // Delay to ensure video frame buffer is painted by the compositor
        await new Promise((resolve) => setTimeout(resolve, 100));

        const width = video.videoWidth || 720;
        const height = video.videoHeight || 1280;
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) throw new Error('Canvas 2D context unavailable');

        ctx.drawImage(video, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
        const offsetMs = Math.round((video.currentTime || 0) * 1000);

        // 1. Immediately update UI state with high-resolution preview & offset
        onChange({
          type: isDefaultInitial ? 'default' : 'frame',
          thumb_offset_ms: offsetMs,
          preview_url: dataUrl,
          custom_cover_url: isDefaultInitial ? value.custom_cover_url : undefined,
          custom_cover_path: isDefaultInitial ? value.custom_cover_path : undefined,
        });

        if (!isDefaultInitial) {
          toast.success(`Video frame selected at ${formatTime(video.currentTime)}!`);

          // 2. Upload captured frame image in background so Meta Graph API has a public cover image URL
          canvas.toBlob(
            async (blob) => {
              if (!blob) return;
              try {
                const file = new File([blob], `reel_frame_${offsetMs}ms.jpg`, { type: 'image/jpeg' });
                const res = await socialPlannerApi.uploadMedia(file);
                if (res.success && res.data) {
                  onChange({
                    type: 'frame',
                    thumb_offset_ms: offsetMs,
                    preview_url: dataUrl,
                    custom_cover_url: res.data.url,
                    custom_cover_path: res.data.file_path,
                  });
                }
              } catch (e) {
                console.warn('Background frame upload fallback: thumb_offset will be used by Meta:', e);
              }
            },
            'image/jpeg',
            0.92
          );
        }
      } catch (err: any) {
        console.error('Failed to capture video frame:', err);
        if (!isDefaultInitial) {
          toast.error('Unable to capture video frame. You can upload a custom cover image instead.');
        }
      } finally {
        setIsCapturingFrame(false);
      }
    },
    [onChange, value.custom_cover_url, value.custom_cover_path]
  );

  // Sync video state when metadata or duration changes
  const syncVideoMeta = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    const dur = video.duration;
    if (!isNaN(dur) && dur > 0 && isFinite(dur)) {
      setDuration(dur);
    }
    setIsLoadingVideo(false);
    setVideoLoadError(null);

    // Chromium renders a solid black surface if paused at currentTime = 0.
    // Seeking slightly forward (e.g. 0.05s) forces Chromium's decoder to visually paint the first frame.
    if (video.currentTime === 0 && dur > 0) {
      const initialSeek = Math.min(0.05, dur > 0.2 ? 0.05 : dur / 2);
      try {
        video.currentTime = initialSeek;
        setCurrentTime(initialSeek);
      } catch (_) {}
    }
  }, []);

  // Reload video element whenever resolvedVideoSrc changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !resolvedVideoSrc) return;

    if (lastLoadedSrcRef.current === resolvedVideoSrc) return;
    lastLoadedSrcRef.current = resolvedVideoSrc;

    setIsLoadingVideo(true);
    setVideoLoadError(null);
    setIsPlaying(false);

    video.src = resolvedVideoSrc;
    try {
      video.load();
    } catch (e) {
      console.warn('Video load invocation failed:', e);
    }

    // Check if video is already ready in memory
    if (video.readyState >= 1) {
      syncVideoMeta();
    }
  }, [resolvedVideoSrc, syncVideoMeta]);

  // Sync video time when thumb_offset_ms is already present in value
  useEffect(() => {
    if (value.thumb_offset_ms !== undefined && videoRef.current && duration > 0) {
      const targetSec = value.thumb_offset_ms / 1000;
      if (Math.abs(currentTime - targetSec) > 0.05) {
        videoRef.current.currentTime = targetSec;
        setCurrentTime(targetSec);
      }
    }
  }, [value.thumb_offset_ms, duration]);

  const handleLoadedMetadata = () => {
    syncVideoMeta();
  };

  const handleLoadedData = () => {
    syncVideoMeta();
    // Auto-capture default preview frame if not already present
    const video = videoRef.current;
    if (video && !value.preview_url) {
      setTimeout(() => {
        if (videoRef.current && !value.preview_url) {
          captureSnapshot(videoRef.current.currentTime || 0.05, true);
        }
      }, 150);
    }
  };

  const handleDurationChange = () => {
    const video = videoRef.current;
    if (video && !isNaN(video.duration) && video.duration > 0 && isFinite(video.duration)) {
      setDuration(video.duration);
    }
  };

  const handleVideoError = () => {
    setIsLoadingVideo(false);
    setVideoLoadError('Could not load video player. You can upload a custom cover image directly.');
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const stepTime = (deltaSec: number) => {
    if (!videoRef.current || duration === 0) return;
    const newTime = Math.max(0, Math.min(duration, currentTime + deltaSec));
    setCurrentTime(newTime);
    videoRef.current.currentTime = newTime;
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && isPlaying) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  // Handle custom cover image upload
  const handleCoverUpload = async (files: FileList | null) => {
    if (!files || files.length === 0 || disabled) return;
    const file = files[0];

    if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
      setUploadError('Only JPG, JPEG, and PNG images are supported for Reel covers.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Cover image cannot exceed 10MB.');
      return;
    }

    setUploadError(null);
    setIsUploadingCover(true);

    // Immediate local preview
    const localPreviewUrl = URL.createObjectURL(file);
    onChange({
      type: 'custom',
      preview_url: localPreviewUrl,
      thumb_offset_ms: undefined,
    });

    try {
      const res = await socialPlannerApi.uploadMedia(file);
      if (res.success && res.data) {
        onChange({
          type: 'custom',
          custom_cover_url: res.data.url,
          custom_cover_path: res.data.file_path,
          custom_cover_filename: res.data.filename,
          custom_cover_file_size: res.data.file_size,
          preview_url: res.data.url,
          thumb_offset_ms: undefined,
        });
        toast.success('Custom Reel cover uploaded successfully!');
      }
    } catch (err: any) {
      setUploadError(err.response?.data?.message || err.message || 'Failed to upload cover image.');
    } finally {
      setIsUploadingCover(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleResetToDefault = () => {
    if (disabled) return;
    if (videoRef.current) {
      const initialSeek = Math.min(0.08, duration > 0.2 ? 0.08 : dur / 2);
      videoRef.current.currentTime = initialSeek;
      setCurrentTime(initialSeek);
      captureSnapshot(initialSeek, true);
    } else {
      onChange({
        type: 'default',
        custom_cover_url: undefined,
        custom_cover_path: undefined,
        thumb_offset_ms: 0,
        preview_url: undefined,
      });
    }
    toast.success('Reset to default video frame.');
  };

  const hasSelectedCover = value.type === 'custom' || value.type === 'frame';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <Film size={15} className="text-[#166534]" />
            <span>Reel Cover / Thumbnail</span>
            {hasSelectedCover && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-50 text-[#166534] border border-emerald-200">
                {value.type === 'custom' ? 'Custom Cover' : `Frame @ ${formatTime((value.thumb_offset_ms || 0) / 1000)}`}
              </span>
            )}
          </h2>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Choose the display frame or upload a custom image for Instagram and Facebook Reels.
          </p>
        </div>

        {/* Tab mode toggle */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl self-start sm:self-auto border border-slate-200/60">
          <button
            type="button"
            disabled={disabled}
            onClick={() => setActiveMode('frame')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeMode === 'frame'
                ? 'bg-white text-[#166534] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sliders size={13} />
            <span>Select Video Frame</span>
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={() => setActiveMode('upload')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeMode === 'upload'
                ? 'bg-white text-[#166534] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UploadCloud size={13} />
            <span>Upload Custom Cover</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
        {/* Left Control Panel (7 Cols) */}
        <div className="md:col-span-7 space-y-4">
          {/* OPTION A: Video Frame Seeker */}
          {activeMode === 'frame' && (
            <div className="space-y-3.5 bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Film size={14} className="text-[#166534]" />
                  <span>Seek Video Frame</span>
                </span>
                <span className="font-mono text-[11px] font-semibold text-slate-600 bg-white px-2 py-0.5 rounded-md border border-slate-200 shadow-2xs">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              {/* Video Player Box with Seeking */}
              <div className="relative rounded-xl overflow-hidden bg-slate-950 min-h-[220px] max-h-[300px] flex items-center justify-center shadow-xs border border-slate-900">
                <video
                  ref={videoRef}
                  src={resolvedVideoSrc || undefined}
                  crossOrigin={isBlobUrl ? undefined : 'anonymous'}
                  playsInline
                  muted
                  preload="auto"
                  onLoadedMetadata={handleLoadedMetadata}
                  onLoadedData={handleLoadedData}
                  onDurationChange={handleDurationChange}
                  onCanPlay={syncVideoMeta}
                  onTimeUpdate={handleTimeUpdate}
                  onSeeked={() => setCurrentTime(videoRef.current?.currentTime || 0)}
                  onEnded={() => setIsPlaying(false)}
                  onError={handleVideoError}
                  className="w-full max-h-[290px] object-contain"
                />

                {/* Loading Spinner */}
                {isLoadingVideo && !videoLoadError && (
                  <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center gap-2 text-white z-10">
                    <RefreshCw size={24} className="animate-spin text-emerald-400" />
                    <span className="text-xs font-medium text-slate-300">Loading video frame buffer...</span>
                  </div>
                )}

                {/* Error Banner */}
                {videoLoadError && (
                  <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-4 text-center text-white z-10 gap-2">
                    <AlertTriangle size={24} className="text-amber-400" />
                    <p className="text-xs text-slate-200 max-w-xs">{videoLoadError}</p>
                    <button
                      type="button"
                      onClick={() => setActiveMode('upload')}
                      className="mt-1 px-3 py-1.5 rounded-lg bg-[#166534] hover:bg-[#14532d] text-white text-xs font-bold cursor-pointer"
                    >
                      Switch to Upload Custom Cover
                    </button>
                  </div>
                )}

                {/* Play/Pause Overlay */}
                {!isLoadingVideo && !videoLoadError && (
                  <button
                    type="button"
                    onClick={togglePlay}
                    className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-all backdrop-blur-xs shadow-md cursor-pointer border border-white/20 hover:scale-105 active:scale-95"
                    title={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
                  </button>
                )}

                {/* Floating timestamp pill inside video */}
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/75 backdrop-blur-xs font-mono text-[10px] text-white font-medium">
                  {formatTime(currentTime)}
                </div>
              </div>

              {/* Slider Seeker Bar */}
              <div className="space-y-2.5 pt-1">
                <input
                  type="range"
                  min={0}
                  max={duration || 1}
                  step={0.01}
                  value={currentTime}
                  onChange={handleSeek}
                  disabled={disabled || duration === 0}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#166534]"
                />

                {/* 3-Column Timestamps Row with clean spacing */}
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-500 text-[11px] shadow-2xs">
                    00:00.000
                  </span>
                  <span className="text-[#166534] font-bold bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200 text-xs shadow-2xs">
                    Frame: {formatTime(currentTime)}
                  </span>
                  <span className="bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-500 text-[11px] shadow-2xs">
                    {formatTime(duration)}
                  </span>
                </div>

                {/* Frame Step Fine-Tuning Controls */}
                <div className="flex items-center justify-center gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => stepTime(-1)}
                    disabled={disabled || duration === 0}
                    className="px-2.5 py-1 text-[11px] font-semibold bg-white border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-700 transition-colors disabled:opacity-40 cursor-pointer"
                    title="Jump 1 second back"
                  >
                    -1.0s
                  </button>
                  <button
                    type="button"
                    onClick={() => stepTime(-0.1)}
                    disabled={disabled || duration === 0}
                    className="px-2.5 py-1 text-[11px] font-semibold bg-white border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-700 transition-colors disabled:opacity-40 cursor-pointer"
                    title="Nudge 100ms back"
                  >
                    -0.1s
                  </button>
                  <button
                    type="button"
                    onClick={togglePlay}
                    disabled={disabled || duration === 0}
                    className="px-3.5 py-1 text-[11px] font-bold bg-[#166534] text-white rounded-lg hover:bg-[#14532d] flex items-center gap-1.5 shadow-2xs transition-colors disabled:opacity-40 cursor-pointer"
                  >
                    {isPlaying ? <Pause size={13} /> : <Play size={13} />}
                    <span>{isPlaying ? 'Pause' : 'Play'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => stepTime(0.1)}
                    disabled={disabled || duration === 0}
                    className="px-2.5 py-1 text-[11px] font-semibold bg-white border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-700 transition-colors disabled:opacity-40 cursor-pointer"
                    title="Nudge 100ms forward"
                  >
                    +0.1s
                  </button>
                  <button
                    type="button"
                    onClick={() => stepTime(1)}
                    disabled={disabled || duration === 0}
                    className="px-2.5 py-1 text-[11px] font-semibold bg-white border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-700 transition-colors disabled:opacity-40 cursor-pointer"
                    title="Jump 1 second forward"
                  >
                    +1.0s
                  </button>
                </div>

                <p className="text-[11px] text-center text-slate-400">
                  Drag scrubber or use fine-tune buttons to pinpoint the exact frame
                </p>
              </div>

              {/* Select Frame Button */}
              <button
                type="button"
                disabled={disabled || isCapturingFrame || duration === 0}
                onClick={() => captureSnapshot()}
                className="w-full py-2.5 px-4 rounded-xl bg-[#166534] hover:bg-[#14532d] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.99] cursor-pointer"
              >
                {isCapturingFrame ? (
                  <>
                    <RefreshCw size={14} className="animate-spin text-white" />
                    <span>Capturing Frame Snapshot...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={15} />
                    <span>Select This Frame as Reel Cover</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* OPTION B: Custom Cover Upload */}
          {activeMode === 'upload' && (
            <div className="space-y-3 bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <ImageIcon size={14} className="text-[#166534]" />
                  <span>Upload High-Res Cover</span>
                </span>
                <span className="text-[11px] text-slate-400">JPG, JPEG, PNG • Up to 10MB</span>
              </div>

              <div
                onClick={() => !disabled && !isUploadingCover && fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-5 text-center transition-all cursor-pointer ${
                  disabled
                    ? 'opacity-60 bg-slate-100 cursor-not-allowed'
                    : isUploadingCover
                    ? 'bg-emerald-50/50 border-emerald-400'
                    : 'border-slate-300 hover:border-[#166534] hover:bg-emerald-50/20 bg-white'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  className="hidden"
                  onChange={(e) => handleCoverUpload(e.target.files)}
                  disabled={disabled || isUploadingCover}
                />

                {isUploadingCover ? (
                  <div className="flex flex-col items-center justify-center py-2 space-y-1.5">
                    <RefreshCw size={20} className="animate-spin text-[#166534]" />
                    <p className="text-xs font-bold text-slate-700">Uploading custom cover image...</p>
                    <p className="text-[10px] text-slate-400">Optimizing public URL for Meta Graph API</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center space-y-1.5">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 text-[#166534] flex items-center justify-center">
                      <UploadCloud size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-800">
                        <span className="text-[#166534] font-bold">Click to upload</span> custom cover
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Recommended aspect ratio: 9:16 (1080x1920)
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {uploadError && (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                  <AlertTriangle size={14} className="shrink-0 text-rose-500" />
                  <span>{uploadError}</span>
                </div>
              )}
            </div>
          )}

          {/* Platform Capabilities Callout */}
          <div className="space-y-2 pt-1">
            {hasInstagram && (
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50/80 border border-emerald-200 text-[#166534] text-xs">
                <Instagram size={16} className="shrink-0 mt-0.5 text-[#E4405F]" />
                <div>
                  <p className="font-bold">Instagram Reels Cover Supported</p>
                  <p className="text-[11px] text-emerald-800 mt-0.5">
                    {value.type === 'custom'
                      ? 'Custom cover image will be published directly via Meta Graph API (cover_url).'
                      : value.type === 'frame'
                      ? `Selected video frame timestamp (${value.thumb_offset_ms || 0}ms) will be passed to Meta (thumb_offset).`
                      : 'Default initial video frame will be used as the Reel cover.'}
                  </p>
                </div>
              </div>
            )}

            {hasFacebook && (
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-blue-50/70 border border-blue-200 text-blue-900 text-xs">
                <Facebook size={16} className="shrink-0 mt-0.5 text-[#1877F2]" />
                <div>
                  <p className="font-bold">Facebook Video Thumbnail Supported</p>
                  <p className="text-[11px] text-blue-700 mt-0.5">
                    {hasSelectedCover
                      ? 'Custom thumbnail will be attached as the preferred video cover (thumb) for your Facebook Page video.'
                      : 'Default video frame will be used as the thumbnail on Facebook.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Preview Panel (5 Cols) */}
        <div className="md:col-span-5 space-y-3 bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Eye size={13} className="text-[#166534]" />
              <span>Cover Preview</span>
            </span>

            {/* Crop Aspect Preview Switcher */}
            <div className="flex items-center bg-white p-0.5 rounded-lg border border-slate-200 shadow-2xs">
              <button
                type="button"
                onClick={() => setPreviewAspect('vertical')}
                title="Vertical Reel Feed Preview (9:16)"
                className={`p-1 rounded text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                  previewAspect === 'vertical'
                    ? 'bg-[#166534] text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Smartphone size={12} />
                <span className="text-[10px]">9:16</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewAspect('grid')}
                title="Instagram Profile Grid Preview (1:1 Center Crop)"
                className={`p-1 rounded text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                  previewAspect === 'grid'
                    ? 'bg-[#166534] text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Grid size={12} />
                <span className="text-[10px]">Grid 1:1</span>
              </button>
            </div>
          </div>

          {/* Thumbnail Preview Display */}
          <div className="flex flex-col items-center justify-center">
            <div
              className={`relative overflow-hidden rounded-xl border border-slate-300 bg-black shadow-md transition-all ${
                previewAspect === 'vertical'
                  ? 'w-[145px] aspect-[9/16]'
                  : 'w-[145px] aspect-square ring-2 ring-[#166534]/40'
              }`}
            >
              {value.preview_url ? (
                <img
                  src={value.preview_url}
                  alt="Reel Cover Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center text-slate-400 bg-slate-900">
                  <Film size={22} className="mb-1.5 text-slate-500" />
                  <span className="text-[10px] font-semibold text-slate-300">Default Frame</span>
                  <span className="text-[9px] text-slate-500 mt-1">Select a frame or upload image</span>
                </div>
              )}

              {/* Preview badge */}
              <div className="absolute bottom-1.5 inset-x-1.5 px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-xs text-[9px] text-white text-center font-semibold truncate">
                {previewAspect === 'vertical' ? 'Reels Feed (9:16)' : 'Profile Grid (1:1)'}
              </div>
            </div>

            <p className="text-[10px] text-slate-500 mt-2 text-center font-medium">
              {previewAspect === 'vertical'
                ? 'Full vertical view in Instagram Reels feed'
                : 'Center crop as displayed on Instagram Profile grid'}
            </p>
          </div>

          {/* Action Buttons: Change, Remove, Reset */}
          {hasSelectedCover && (
            <div className="pt-2 border-t border-slate-200/80 flex flex-wrap items-center justify-center gap-1.5">
              <button
                type="button"
                disabled={disabled}
                onClick={() => {
                  if (activeMode === 'upload') {
                    fileInputRef.current?.click();
                  } else {
                    toast.info('Move the video slider on the left and click "Select This Frame".');
                  }
                }}
                className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-2xs transition-colors cursor-pointer"
              >
                Change Cover
              </button>

              <button
                type="button"
                disabled={disabled}
                onClick={handleResetToDefault}
                className="px-2.5 py-1 text-[11px] font-semibold text-rose-600 bg-white hover:bg-rose-50 border border-rose-200 rounded-lg shadow-2xs transition-colors cursor-pointer"
              >
                Remove Cover
              </button>

              <button
                type="button"
                disabled={disabled}
                onClick={handleResetToDefault}
                className="px-2.5 py-1 text-[11px] font-medium text-slate-400 hover:text-slate-600 hover:underline transition-colors cursor-pointer flex items-center gap-1"
              >
                <RotateCcw size={10} />
                <span>Reset to Default</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
