import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Facebook,
  Instagram,
  Send,
  Calendar,
  Save,
  AlertTriangle,
  Clock,
  Sparkles,
  Loader2,
  CheckCircle2,
  Eye,
  Info,
  Globe,
  Flame,
  ArrowRight,
  Briefcase,
  Smile,
  Target,
  RefreshCw,
  XCircle,
  Film,
} from 'lucide-react';
import { socialPlannerApi } from '../../services/socialPlannerApi';
import { SocialAccount, SocialPostMedia } from '../../types/socialPlanner';
import { AccountSelector } from '../../components/social/AccountSelector';
import { MediaUploader } from '../../components/social/MediaUploader';
import { ReelCoverSelector, ReelCoverData } from '../../components/social/ReelCoverSelector';
import { FacebookPostPreview } from '../../components/social/FacebookPostPreview';
import { InstagramPostPreview } from '../../components/social/InstagramPostPreview';
import { AiSocialCopilotModal } from '../../components/social/AiSocialCopilotModal';
import { toast } from '../../components/ui/Toast';

export default function SocialCreatePostPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editPostId = searchParams.get('edit') || searchParams.get('draft_id');
  const [loadingDraft, setLoadingDraft] = useState(false);

  // Accounts
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [selectedAccountIds, setSelectedAccountIds] = useState<number[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);

  // Form State
  const [caption, setCaption] = useState('');
  const [firstComment, setFirstComment] = useState('');
  const [isFirstCommentOpen, setIsFirstCommentOpen] = useState(false);
  const [media, setMedia] = useState<SocialPostMedia[]>([]);
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledAt, setScheduledAt] = useState('');

  // Reel Cover State
  const [reelCover, setReelCover] = useState<ReelCoverData>({
    type: 'default',
    thumb_offset_ms: 0,
  });

  // AI Copilot state
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isQuickRewriting, setIsQuickRewriting] = useState(false);
  const [quickRewritingAction, setQuickRewritingAction] = useState<string>('');

  // UI state
  const [previewPlatform, setPreviewPlatform] = useState<'facebook' | 'instagram'>('facebook');
  const [submitting, setSubmitting] = useState(false);
  const [publishStatusMessage, setPublishStatusMessage] = useState<string | null>(null);

  // User Timezone detection
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  const getTimezoneOffsetString = () => {
    const offsetMin = -new Date().getTimezoneOffset();
    const hours = Math.floor(Math.abs(offsetMin) / 60);
    const mins = Math.abs(offsetMin) % 60;
    const sign = offsetMin >= 0 ? '+' : '-';
    return `UTC${sign}${hours}${mins ? `:${mins}` : ''}`;
  };

  const getMinDateTime = () => {
    const d = new Date(Date.now() + 2 * 60 * 1000); // at least 2 mins in future
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  };

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await socialPlannerApi.getAccounts({ is_active: true });
        if (res.success && res.data) {
          setAccounts(res.data);
          // Preselect first account if available
          if (res.data.length > 0) {
            setSelectedAccountIds([res.data[0].id]);
            setPreviewPlatform(res.data[0].platform);
          }
        }
      } catch (err) {
        console.error('Error fetching accounts:', err);
        toast.error('Failed to load accounts');
      } finally {
        setLoadingAccounts(false);
      }
    };

    fetchAccounts();
  }, []);

  // Restore draft or edit post if editPostId query parameter is present
  useEffect(() => {
    if (!editPostId) return;

    const fetchDraft = async () => {
      setLoadingDraft(true);
      try {
        const res = await socialPlannerApi.getPost(Number(editPostId));
        if (res.success && res.data) {
          const post = res.data;
          setCaption(post.content || '');

          if (post.options?.first_comment) {
            setFirstComment(post.options.first_comment);
            setIsFirstCommentOpen(true);
          }

          if (post.media && post.media.length > 0) {
            setMedia(post.media);
          }

          if (post.targets && post.targets.length > 0) {
            setSelectedAccountIds(post.targets.map((t) => t.social_account_id));
          }

          if (post.options?.reel_cover) {
            setReelCover(post.options.reel_cover);
          }

          if (post.scheduled_at && post.status === 'scheduled') {
            setIsScheduled(true);
            const localIso = new Date(post.scheduled_at).toISOString().slice(0, 16);
            setScheduledAt(localIso);
          }

          toast.info(`Draft #${post.id} loaded into composer.`);
        }
      } catch (err) {
        console.error('Failed to load draft:', err);
      } finally {
        setLoadingDraft(false);
      }
    };

    fetchDraft();
  }, [editPostId]);

  // Video / Reel detection
  const videoMedia = media.find((m) => m.media_type === 'video');
  const hasVideo = !!videoMedia;

  // Selected accounts data
  const selectedAccounts = accounts.filter((a) => selectedAccountIds.includes(a.id));
  const hasFacebook = selectedAccounts.some((a) => a.platform === 'facebook');
  const hasInstagram = selectedAccounts.some((a) => a.platform === 'instagram');
  const fbCount = selectedAccounts.filter((a) => a.platform === 'facebook').length;
  const igCount = selectedAccounts.filter((a) => a.platform === 'instagram').length;

  // Reset reel cover if video is removed
  useEffect(() => {
    if (!hasVideo && reelCover.type !== 'default') {
      setReelCover({ type: 'default', thumb_offset_ms: 0 });
    }
  }, [hasVideo, reelCover.type]);

  // Sync preview platform with active selections
  useEffect(() => {
    if (hasInstagram && !hasFacebook) {
      setPreviewPlatform('instagram');
    } else if (hasFacebook && !hasInstagram) {
      setPreviewPlatform('facebook');
    }
  }, [hasFacebook, hasInstagram]);

  // Preview target account
  const previewAccount = selectedAccounts.find((a) => a.platform === previewPlatform) || selectedAccounts[0];

  // Character limit calculations
  const maxChars = hasInstagram ? 2200 : hasFacebook ? 63206 : 5000;
  const isOverCharLimit = caption.length > maxChars;

  // Platform Validation Rules
  const validateForm = (isDraft: boolean = false): boolean => {
    if (selectedAccountIds.length === 0) {
      toast.error('Please select at least one Facebook Page or Instagram Account.');
      return false;
    }

    if (isDraft) return true; // Drafts can be partial

    if (!caption.trim() && media.length === 0) {
      toast.error('Please provide a caption or upload media to publish.');
      return false;
    }

    if (isOverCharLimit) {
      toast.error(
        `Caption exceeds the ${hasInstagram ? 'Instagram (2,200)' : 'Facebook (63,206)'} character limit.`
      );
      return false;
    }

    // Instagram check: Meta Graph API strictly requires media for Instagram
    if (hasInstagram && media.length === 0) {
      toast.error('Instagram requires at least one image or video. Meta does not support text-only Instagram updates.');
      return false;
    }

    if (isScheduled) {
      if (!scheduledAt) {
        toast.error('Please select a valid scheduled date and time.');
        return false;
      }
      const schedDate = new Date(scheduledAt);
      if (schedDate.getTime() <= Date.now() + 60000) {
        toast.error('Scheduled time must be at least 2 minutes in the future.');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (action: 'publish_now' | 'schedule' | 'draft') => {
    if (action === 'draft') {
      if (!validateForm(true)) return;
    } else {
      if (!validateForm(false)) return;
    }

    setSubmitting(true);
    setPublishStatusMessage(
      action === 'publish_now'
        ? 'Publishing post across selected accounts...'
        : action === 'schedule'
        ? 'Scheduling post for automated publication...'
        : 'Saving draft...'
    );

    try {
      const payload = {
        account_ids: selectedAccountIds,
        content: caption,
        media: media.map((m, idx) => ({
          ...m,
          order: idx,
        })),
        publish_now: action === 'publish_now',
        scheduled_at: action === 'schedule' ? new Date(scheduledAt).toISOString() : null,
        options: {
          first_comment: firstComment.trim() || undefined,
          reel_cover: hasVideo ? reelCover : undefined,
        },
      };

      const res = await socialPlannerApi.createPost(payload);

      if (res.success) {
        // Detailed platform feedback
        if (action === 'publish_now') {
          const platforms = [];
          if (hasFacebook) platforms.push(`${fbCount} Facebook Page(s)`);
          if (hasInstagram) platforms.push(`${igCount} Instagram Account(s)`);
          toast.success(`Post successfully published to ${platforms.join(' and ')}!`);
        } else if (action === 'schedule') {
          toast.success(`Post scheduled successfully for ${new Date(scheduledAt).toLocaleString()}!`);
        } else {
          toast.success('Draft saved successfully!');
        }

        navigate('/social-planner/calendar');
      } else {
        toast.error(res.message || 'Failed to submit post.');
      }
    } catch (err: any) {
      console.error('Error submitting post:', err);
      // Preserve form state so the user does NOT lose anything
      const errorMsg =
        err.response?.data?.message || err.message || 'Failed to publish post. Your draft has been preserved.';
      toast.error(errorMsg);
      setPublishStatusMessage(null);
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickRewrite = async (
    action: 'shorter' | 'longer' | 'professional' | 'engaging' | 'cta' | 'fix_grammar' | 'rewrite'
  ) => {
    if (!caption.trim()) {
      toast.error('Please write some caption text first or open the AI Copilot to generate one.');
      return;
    }
    setIsQuickRewriting(true);
    setQuickRewritingAction(action);
    try {
      const res = await socialPlannerApi.rewriteWithAi({
        text: caption.trim(),
        action,
      });
      if (res.success && res.data) {
        setCaption(res.data.improved_text);
        toast.success(res.data.explanation || 'Caption refined with AI!');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to refine caption.');
    } finally {
      setIsQuickRewriting(false);
      setQuickRewritingAction('');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Create & Compose Post</h1>
          <p className="text-xs text-slate-500">
            Craft engaging posts, upload media, and publish or schedule across Facebook Pages and Instagram.
          </p>
        </div>

        {/* Selected Accounts Summary Pill */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {hasFacebook && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-[#1877F2] border border-blue-200 text-xs font-semibold">
              <Facebook size={12} />
              <span>{fbCount} Facebook</span>
            </span>
          )}
          {hasInstagram && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-50 text-[#E4405F] border border-rose-200 text-xs font-semibold">
              <Instagram size={12} />
              <span>{igCount} Instagram</span>
            </span>
          )}
          {selectedAccountIds.length === 0 && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold">
              <AlertTriangle size={12} />
              <span>No accounts selected</span>
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Post Form (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* 1. Account Picker */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                1. Target Accounts
              </h2>
              <span className="text-[11px] text-slate-400">Select where to publish this post</span>
            </div>

            {loadingAccounts ? (
              <div className="flex items-center gap-2 text-xs text-slate-500 py-4">
                <Loader2 size={16} className="animate-spin text-[#166534]" /> Loading accounts...
              </div>
            ) : (
              <AccountSelector
                accounts={accounts}
                selectedIds={selectedAccountIds}
                onChange={setSelectedAccountIds}
                multiple={true}
                disabled={submitting}
              />
            )}
          </div>

          {/* 2. Content & Caption */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  2. Caption & Content
                </h2>
                <button
                  type="button"
                  onClick={() => setIsCopilotOpen(true)}
                  disabled={submitting}
                  className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold bg-[#166534] hover:bg-[#14532d] text-white rounded-lg shadow-2xs transition-all hover:scale-[1.02] disabled:opacity-50"
                >
                  <Sparkles size={12} className="text-amber-300" />
                  <span>AI Copilot</span>
                </button>
              </div>

              {/* Character Counter */}
              <div className="text-[11px] font-mono">
                <span className={isOverCharLimit ? 'text-rose-600 font-bold' : 'text-slate-400'}>
                  {caption.length.toLocaleString()} / {maxChars.toLocaleString()}
                </span>
                {hasInstagram && (
                  <span className="text-[10px] text-slate-400 ml-1 font-sans">(IG limit: 2,200)</span>
                )}
              </div>
            </div>

            <div className="relative">
              <textarea
                rows={5}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                disabled={submitting}
                placeholder="What's happening? Add your caption, hashtags (#marketing #growth), or open the AI Copilot to generate high-converting copy..."
                className={`w-full text-xs sm:text-sm p-3.5 border rounded-xl focus:ring-1 focus:outline-none resize-y text-slate-800 placeholder-slate-400 transition-colors ${
                  isOverCharLimit
                    ? 'border-rose-400 focus:ring-rose-400 bg-rose-50/20'
                    : 'border-slate-200 focus:ring-[#166534] focus:border-[#166534]'
                }`}
              />

              {isQuickRewriting && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-2xs rounded-xl flex items-center justify-center gap-2 text-xs font-semibold text-[#166534]">
                  <Loader2 size={16} className="animate-spin text-[#166534]" />
                  <span>Refining caption ({quickRewritingAction})...</span>
                </div>
              )}
            </div>

            {/* Quick AI Refine Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Quick AI Polish:
                </span>
                <button
                  type="button"
                  disabled={isQuickRewriting || !caption.trim() || submitting}
                  onClick={() => handleQuickRewrite('shorter')}
                  className="px-2.5 py-1 text-[11px] font-medium bg-slate-50 hover:bg-emerald-50 hover:text-[#166534] text-slate-600 rounded-lg border border-slate-200 transition-colors disabled:opacity-40"
                >
                  ⚡ Make Shorter
                </button>
                <button
                  type="button"
                  disabled={isQuickRewriting || !caption.trim() || submitting}
                  onClick={() => handleQuickRewrite('longer')}
                  className="px-2.5 py-1 text-[11px] font-medium bg-slate-50 hover:bg-emerald-50 hover:text-[#166534] text-slate-600 rounded-lg border border-slate-200 transition-colors disabled:opacity-40"
                >
                  ➕ Make Longer
                </button>
                <button
                  type="button"
                  disabled={isQuickRewriting || !caption.trim() || submitting}
                  onClick={() => handleQuickRewrite('professional')}
                  className="px-2.5 py-1 text-[11px] font-medium bg-slate-50 hover:bg-emerald-50 hover:text-[#166534] text-slate-600 rounded-lg border border-slate-200 transition-colors disabled:opacity-40"
                >
                  👔 Professional
                </button>
                <button
                  type="button"
                  disabled={isQuickRewriting || !caption.trim() || submitting}
                  onClick={() => handleQuickRewrite('engaging')}
                  className="px-2.5 py-1 text-[11px] font-medium bg-slate-50 hover:bg-emerald-50 hover:text-[#166534] text-slate-600 rounded-lg border border-slate-200 transition-colors disabled:opacity-40"
                >
                  ✨ More Engaging
                </button>
                <button
                  type="button"
                  disabled={isQuickRewriting || !caption.trim() || submitting}
                  onClick={() => handleQuickRewrite('cta')}
                  className="px-2.5 py-1 text-[11px] font-medium bg-slate-50 hover:bg-emerald-50 hover:text-[#166534] text-slate-600 rounded-lg border border-slate-200 transition-colors disabled:opacity-40"
                >
                  🎯 Stronger CTA
                </button>
                <button
                  type="button"
                  disabled={isQuickRewriting || !caption.trim() || submitting}
                  onClick={() => handleQuickRewrite('fix_grammar')}
                  className="px-2.5 py-1 text-[11px] font-medium bg-slate-50 hover:bg-emerald-50 hover:text-[#166534] text-slate-600 rounded-lg border border-slate-200 transition-colors disabled:opacity-40"
                >
                  ✓ Fix Grammar
                </button>
                <button
                  type="button"
                  disabled={isQuickRewriting || !caption.trim() || submitting}
                  onClick={() => handleQuickRewrite('rewrite')}
                  className="px-2.5 py-1 text-[11px] font-medium bg-slate-50 hover:bg-emerald-50 hover:text-[#166534] text-slate-600 rounded-lg border border-slate-200 transition-colors disabled:opacity-40"
                >
                  🔄 Rewrite
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsFirstCommentOpen(!isFirstCommentOpen)}
                className="text-[11px] font-semibold text-[#166534] hover:underline"
              >
                {isFirstCommentOpen ? 'Hide First Comment' : '+ Automated First Comment'}
              </button>
            </div>

            {/* Automated First Comment Field */}
            {isFirstCommentOpen && (
              <div className="p-3 bg-slate-50 rounded-xl border border-dashed border-slate-200 space-y-1.5 animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                    <span>💬 Automated First Comment</span>
                    <span className="text-[10px] font-normal text-slate-400">(Hashtags or follow-up note)</span>
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">{firstComment.length} / 500</span>
                </div>
                <textarea
                  rows={2}
                  value={firstComment}
                  onChange={(e) => setFirstComment(e.target.value)}
                  disabled={submitting}
                  placeholder="e.g. #Marketing #BrandGrowth #Trending - posted automatically right after publishing"
                  className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-1 focus:ring-[#166534] focus:outline-none resize-none"
                />
                <p className="text-[10px] text-slate-400">
                  Meta will automatically publish this comment to Facebook or Instagram immediately after the post goes live.
                </p>
              </div>
            )}
          </div>

          {/* 3. Media Upload */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                3. Photos & Videos
              </h2>
              <span className="text-[11px] text-slate-400">JPG, PNG, WEBP, GIF, MP4, MOV</span>
            </div>

            <MediaUploader media={media} onChange={setMedia} maxFiles={10} disabled={submitting} />

            {/* Instagram Specific Warning */}
            {hasInstagram && media.length === 0 && (
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
                <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Instagram Media Requirement</p>
                  <p className="text-[11px] text-amber-700 mt-0.5">
                    Meta Instagram Graph API does not support text-only updates. Please upload at least one image or video to publish to your connected Instagram account.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Reel Cover / Thumbnail (Displayed when video is uploaded) */}
          {hasVideo && videoMedia && (
            <ReelCoverSelector
              videoUrl={videoMedia.blob_url || videoMedia.stream_url || videoMedia.url}
              videoPath={videoMedia.file_path}
              videoFilename={videoMedia.filename}
              value={reelCover}
              onChange={setReelCover}
              hasInstagram={hasInstagram}
              hasFacebook={hasFacebook}
              disabled={submitting}
            />
          )}

          {/* 4. Scheduling Options */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                4. Publishing Schedule
              </h2>
              {/* Timezone Badge */}
              <div className="flex items-center gap-1 text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                <Globe size={11} className="text-slate-400" />
                <span>
                  {userTimezone} ({getTimezoneOffsetString()})
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={submitting}
                onClick={() => setIsScheduled(false)}
                className={`flex-1 p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  !isScheduled
                    ? 'bg-emerald-50/60 border-emerald-500/80 text-[#166534]'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Send size={14} /> Publish Immediately
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={() => setIsScheduled(true)}
                className={`flex-1 p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  isScheduled
                    ? 'bg-emerald-50/60 border-emerald-500/80 text-[#166534]'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Clock size={14} /> Schedule for Later
              </button>
            </div>

            {isScheduled && (
              <div className="pt-2 space-y-1.5 animate-fadeIn">
                <label className="block text-xs font-bold text-slate-700">
                  Select Publication Date & Time
                </label>
                <input
                  type="datetime-local"
                  min={getMinDateTime()}
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  disabled={submitting}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#166534] focus:outline-none bg-white"
                />
                <p className="text-[11px] text-slate-400">
                  The automated queue worker will dispatch your post precisely at this scheduled time in your local timezone ({userTimezone}).
                </p>
              </div>
            )}
          </div>

          {/* Action Bar & Publishing Status */}
          <div className="space-y-3 pt-2">
            {publishStatusMessage && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-[#166534] text-xs font-semibold">
                <Loader2 size={15} className="animate-spin text-[#166534]" />
                <span>{publishStatusMessage}</span>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                disabled={submitting}
                onClick={() => handleSubmit('draft')}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-all disabled:opacity-50"
              >
                <Save size={15} /> Save Draft
              </button>

              <div className="flex items-center gap-2">
                {isScheduled ? (
                  <button
                    type="button"
                    disabled={submitting || (hasInstagram && media.length === 0) || isOverCharLimit}
                    onClick={() => handleSubmit('schedule')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#166534] hover:bg-[#14532d] text-white text-xs font-bold shadow-sm transition-all disabled:opacity-50 active:scale-95 cursor-pointer disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Calendar size={16} />
                    )}
                    Schedule Post
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={submitting || (hasInstagram && media.length === 0) || isOverCharLimit}
                    onClick={() => handleSubmit('publish_now')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#166534] hover:bg-[#14532d] text-white text-xs font-bold shadow-sm transition-all disabled:opacity-50 active:scale-95 cursor-pointer disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Send size={16} />
                    )}
                    Publish Now
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Mockup Preview (5 Cols) */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs">
            {/* Preview header & switcher */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-1.5">
                <Eye size={15} className="text-[#166534]" />
                <span className="text-xs font-bold text-slate-800">Live Post Preview</span>
              </div>

              {/* Platform Switcher */}
              <div className="flex items-center bg-slate-100 p-0.5 rounded-xl">
                <button
                  type="button"
                  onClick={() => setPreviewPlatform('facebook')}
                  className={`flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                    previewPlatform === 'facebook'
                      ? 'bg-white text-[#1877F2] shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Facebook size={12} /> Facebook
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewPlatform('instagram')}
                  className={`flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                    previewPlatform === 'instagram'
                      ? 'bg-white text-[#E4405F] shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Instagram size={12} /> Instagram
                </button>
              </div>
            </div>

            {/* Preview Rendering */}
            <div className="py-2">
              {previewPlatform === 'facebook' ? (
                <FacebookPostPreview
                  accountName={previewAccount?.name || 'Your Facebook Page'}
                  accountAvatar={previewAccount?.profile_picture_url}
                  content={caption}
                  media={media}
                  coverUrl={reelCover?.preview_url}
                />
              ) : (
                <InstagramPostPreview
                  accountName={previewAccount?.name || 'Your Instagram Account'}
                  accountUsername={previewAccount?.username || undefined}
                  accountAvatar={previewAccount?.profile_picture_url}
                  content={caption}
                  media={media}
                  coverUrl={reelCover?.preview_url}
                />
              )}
            </div>

            {/* Preview Notes */}
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center gap-1.5">
              <Info size={13} className="shrink-0 text-slate-400" />
              <span>Previews accurately simulate official Meta feed rendering and typography.</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Social Copilot Modal */}
      <AiSocialCopilotModal
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        currentCaption={caption}
        onApplyCaption={(newCaption, newFirstComment) => {
          setCaption(newCaption);
          if (newFirstComment) {
            setFirstComment(newFirstComment);
            setIsFirstCommentOpen(true);
          }
        }}
        platform={hasInstagram && !hasFacebook ? 'instagram' : hasFacebook && !hasInstagram ? 'facebook' : 'all'}
      />
    </div>
  );
}
