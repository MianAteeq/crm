import React from 'react';
import { ThumbsUp, MessageSquare, Share2, Globe, MoreHorizontal } from 'lucide-react';
import { SocialAccount, SocialPostMedia } from '../../types/socialPlanner';

interface FacebookPostPreviewProps {
  account?: SocialAccount;
  content: string;
  media: SocialPostMedia[];
  coverUrl?: string;
}

export function FacebookPostPreview({ account, content, media, coverUrl }: FacebookPostPreviewProps) {
  const pageName = account?.name || 'Your Facebook Page';
  const avatarUrl = account?.profile_picture_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150';

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden max-w-md w-full mx-auto font-sans text-slate-900 select-none">
      {/* Facebook Post Header */}
      <div className="p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <img
            src={avatarUrl}
            alt={pageName}
            className="w-10 h-10 rounded-full object-cover border border-slate-200"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-slate-900 leading-tight">{pageName}</span>
              <span className="w-3.5 h-3.5 rounded-full bg-[#1877F2] text-white flex items-center justify-center text-[9px] font-black">
                ✓
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
              <span>Just now</span>
              <span>•</span>
              <Globe size={11} className="text-slate-400" />
            </div>
          </div>
        </div>
        <button className="text-slate-400 hover:text-slate-600 p-1 rounded-full cursor-pointer">
          <MoreHorizontal size={18} />
        </button>
      </div>

      {/* Post Text / Caption */}
      {content && (
        <div className="px-3.5 pb-3 text-[13px] text-slate-800 whitespace-pre-wrap leading-relaxed break-words">
          {content}
        </div>
      )}

      {/* Media Gallery / Video */}
      {media.length > 0 && (
        <div className="bg-slate-950 relative overflow-hidden">
          {media.length === 1 ? (
            media[0].media_type === 'video' ? (
              <div className="relative w-full">
                <video
                  src={media[0].blob_url || media[0].stream_url || media[0].url}
                  poster={coverUrl}
                  controls
                  className="w-full max-h-[380px] object-contain bg-black"
                />
                {coverUrl && (
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[9px] font-bold text-white uppercase tracking-wider flex items-center gap-1 z-10 pointer-events-none">
                    <span>Custom Thumbnail Active</span>
                  </div>
                )}
              </div>
            ) : (
              <img
                src={media[0].url}
                alt="Post Media"
                className="w-full max-h-[380px] object-cover"
              />
            )
          ) : (
            <div className="grid grid-cols-2 gap-0.5 max-h-[380px] overflow-hidden">
              {media.slice(0, 4).map((item, idx) => (
                <div key={idx} className="relative aspect-square overflow-hidden bg-slate-900">
                  <img
                    src={item.url}
                    alt={`Preview ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {idx === 3 && media.length > 4 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xl font-black">
                      +{media.length - 4}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Interaction Reaction Counters */}
      <div className="px-3.5 py-2 flex items-center justify-between text-[11px] text-slate-500 border-b border-slate-100">
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded-full bg-[#1877F2] text-white flex items-center justify-center text-[10px]">
            👍
          </span>
          <span>Be the first to like this</span>
        </div>
        <div className="flex items-center gap-3">
          <span>0 comments</span>
          <span>0 shares</span>
        </div>
      </div>

      {/* Action Bar (Like, Comment, Share) */}
      <div className="px-2 py-1 flex items-center justify-around text-xs font-semibold text-slate-600">
        <button className="flex items-center justify-center gap-1.5 py-2 px-3 hover:bg-slate-100 rounded-lg flex-1 transition-colors cursor-pointer">
          <ThumbsUp size={15} />
          <span>Like</span>
        </button>
        <button className="flex items-center justify-center gap-1.5 py-2 px-3 hover:bg-slate-100 rounded-lg flex-1 transition-colors cursor-pointer">
          <MessageSquare size={15} />
          <span>Comment</span>
        </button>
        <button className="flex items-center justify-center gap-1.5 py-2 px-3 hover:bg-slate-100 rounded-lg flex-1 transition-colors cursor-pointer">
          <Share2 size={15} />
          <span>Share</span>
        </button>
      </div>
    </div>
  );
}

