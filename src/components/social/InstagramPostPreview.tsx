import React from 'react';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from 'lucide-react';
import { SocialPostMedia } from '../../types/socialPlanner';

interface InstagramPostPreviewProps {
  accountName?: string;
  accountUsername?: string;
  accountAvatar?: string | null;
  content: string;
  media?: SocialPostMedia[];
  coverUrl?: string;
}

export const InstagramPostPreview: React.FC<InstagramPostPreviewProps> = ({
  accountName = 'Your Instagram Account',
  accountUsername = 'your_handle',
  accountAvatar,
  content,
  media = [],
  coverUrl,
}) => {
  const [activeMediaIndex, setActiveMediaIndex] = React.useState(0);
  const [showFullCaption, setShowFullCaption] = React.useState(false);

  const displayHandle = accountUsername
    ? accountUsername.replace(/^@/, '')
    : accountName.toLowerCase().replace(/\s+/g, '_');

  const currentMedia = media.length > 0 ? media[activeMediaIndex] : null;

  return (
    <div className="w-full max-w-sm mx-auto bg-white rounded-2xl border border-slate-200/80 shadow-md overflow-hidden text-slate-900 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-slate-100">
        <div className="flex items-center space-x-2.5">
          <div className="p-0.5 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600">
            <div className="w-8 h-8 rounded-full bg-white p-0.5">
              {accountAvatar ? (
                <img
                  src={accountAvatar}
                  alt={accountName}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gradient-to-tr from-rose-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                  {accountName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </div>
          <div>
            <div className="font-semibold text-xs text-slate-900 leading-tight">
              {displayHandle}
            </div>
            <div className="text-[10px] text-slate-400">Sponsored • Instagram</div>
          </div>
        </div>
        <button className="text-slate-500 hover:text-slate-800 p-1">
          <MoreHorizontal size={16} />
        </button>
      </div>

      {/* Media Box */}
      <div className="relative aspect-square bg-slate-950 flex items-center justify-center overflow-hidden">
        {currentMedia ? (
          currentMedia.media_type === 'video' ? (
            <div className="relative w-full h-full">
              <video
                src={currentMedia.blob_url || currentMedia.stream_url || currentMedia.url}
                poster={coverUrl}
                controls
                className="w-full h-full object-cover"
              />
              {coverUrl && (
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[9px] font-bold text-white uppercase tracking-wider flex items-center gap-1 z-10 pointer-events-none">
                  <span>Reel Cover Active</span>
                </div>
              )}
            </div>
          ) : (
            <img
              src={currentMedia.url}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          )
        ) : (
          <div className="text-center p-6 text-slate-400">
            <div className="w-14 h-14 mx-auto mb-2 rounded-2xl bg-gradient-to-tr from-rose-500/20 to-purple-600/20 border border-white/10 flex items-center justify-center text-rose-400">
              <span className="text-2xl">📸</span>
            </div>
            <p className="text-xs font-medium text-slate-300">Instagram Requires Media</p>
            <p className="text-[11px] text-slate-500 mt-1">Upload at least 1 photo or video</p>
          </div>
        )}

        {/* Carousel indicators */}
        {media.length > 1 && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-1 z-10">
            {media.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveMediaIndex(idx)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  idx === activeMediaIndex ? 'bg-white scale-125' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3 text-slate-700">
            <button className="hover:text-rose-600 transition-colors">
              <Heart size={20} />
            </button>
            <button className="hover:text-slate-900 transition-colors">
              <MessageCircle size={20} />
            </button>
            <button className="hover:text-slate-900 transition-colors">
              <Send size={18} />
            </button>
          </div>
          <button className="text-slate-700 hover:text-slate-900">
            <Bookmark size={20} />
          </button>
        </div>

        {/* Likes */}
        <div className="font-semibold text-xs text-slate-900 mb-1">
          2,491 likes
        </div>

        {/* Caption */}
        <div className="text-xs text-slate-800 leading-snug">
          <span className="font-semibold mr-1.5">{displayHandle}</span>
          {content ? (
            showFullCaption || content.length < 110 ? (
              <span className="whitespace-pre-line">{content}</span>
            ) : (
              <span>
                {content.slice(0, 100)}...{' '}
                <button
                  type="button"
                  onClick={() => setShowFullCaption(true)}
                  className="text-slate-400 font-normal hover:text-slate-600"
                >
                  more
                </button>
              </span>
            )
          ) : (
            <span className="text-slate-400 italic">No caption added yet...</span>
          )}
        </div>

        {/* Timestamp */}
        <div className="mt-2 text-[10px] uppercase tracking-wider text-slate-400">
          Just Now
        </div>
      </div>
    </div>
  );
};

