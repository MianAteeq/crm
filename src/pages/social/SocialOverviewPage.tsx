import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Plus,
  Users,
  MessageSquare,
  BarChart3,
  Facebook,
  Instagram,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  Share2,
  Send,
  Loader2,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { socialPlannerApi } from '../../services/socialPlannerApi';
import {
  SocialAccount,
  SocialPost,
  SocialAnalyticsSummary,
  SocialComment,
} from '../../types/socialPlanner';
import { toast } from '../../components/ui/Toast';

export default function SocialOverviewPage() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [upcomingPosts, setUpcomingPosts] = useState<SocialPost[]>([]);
  const [analytics, setAnalytics] = useState<SocialAnalyticsSummary | null>(null);
  const [recentComments, setRecentComments] = useState<SocialComment[]>([]);

  const fetchData = async () => {
    try {
      const [accRes, postsRes, analyticsRes, commentsRes] = await Promise.allSettled([
        socialPlannerApi.getAccounts(),
        socialPlannerApi.getPosts({ status: 'scheduled', per_page: 5 }),
        socialPlannerApi.getAnalytics({ period: '30d' }),
        socialPlannerApi.getComments({ is_handled: false, per_page: 4 }),
      ]);

      if (accRes.status === 'fulfilled' && accRes.value.data) {
        setAccounts(accRes.value.data);
      }
      if (postsRes.status === 'fulfilled' && postsRes.value.data) {
        setUpcomingPosts(postsRes.value.data);
      }
      if (analyticsRes.status === 'fulfilled' && analyticsRes.value.data) {
        setAnalytics(analyticsRes.value.data);
      }
      if (commentsRes.status === 'fulfilled' && commentsRes.value.data) {
        setRecentComments(commentsRes.value.data);
      }
    } catch (err) {
      console.error('Error fetching overview data:', err);
      toast.error('Failed to load some social media planner data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handlePublishNow = async (postId: number) => {
    try {
      await socialPlannerApi.publishNow(postId);
      toast.success('Post queued for immediate publishing');
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Publishing failed');
    }
  };

  const formatDateTime = (dateStr?: string | null) => {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    return d.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const fbCount = accounts.filter((a) => a.platform === 'facebook').length;
  const igCount = accounts.filter((a) => a.platform === 'instagram').length;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-3">
        <Loader2 size={36} className="animate-spin text-[#166534]" />
        <p className="text-xs font-semibold text-slate-500">Loading Social Media Planner...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#12263A] via-[#164430] to-[#166534] rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 text-white/90 text-[11px] font-semibold tracking-wide">
            <Share2 size={13} />
            <span>Facebook & Instagram Planner</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Social Media Overview</h1>
          <p className="text-xs text-white/80 max-w-xl">
            Schedule, manage, and analyze your Facebook Pages and Instagram Professional accounts in one unified command center.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
            title="Refresh"
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
          </button>
          <Link
            to="/social-planner/create"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-[#166534] hover:bg-emerald-50 rounded-xl font-bold text-xs shadow-sm transition-all cursor-pointer active:scale-95"
          >
            <Plus size={16} strokeWidth={2.5} />
            Create Post
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Connected Accounts */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Connected Accounts</p>
            <h3 className="text-2xl font-black text-slate-800 mt-1">{accounts.length}</h3>
            <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <Facebook size={11} className="text-[#1877F2]" /> {fbCount} Pages
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Instagram size={11} className="text-[#E4405F]" /> {igCount} IG
              </span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users size={20} />
          </div>
        </div>

        {/* Scheduled Posts */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Scheduled Posts</p>
            <h3 className="text-2xl font-black text-slate-800 mt-1">{upcomingPosts.length}</h3>
            <p className="text-[11px] text-slate-500 mt-1">In upcoming queue</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-[#166534] flex items-center justify-center">
            <Clock size={20} />
          </div>
        </div>

        {/* Total Reach */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Reach (30d)</p>
            <h3 className="text-2xl font-black text-slate-800 mt-1">
              {analytics?.kpis?.total_reach != null
                ? analytics.kpis.total_reach.toLocaleString()
                : '12,450*'}
            </h3>
            <p className="text-[11px] text-slate-500 mt-1">
              {analytics?.kpis?.total_impressions != null
                ? `${analytics.kpis.total_impressions.toLocaleString()} impressions`
                : 'Estimated impressions'}
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <TrendingUp size={20} />
          </div>
        </div>

        {/* Total Engagement */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Engagement (30d)</p>
            <h3 className="text-2xl font-black text-slate-800 mt-1">
              {analytics?.kpis
                ? (
                    analytics.kpis.total_likes +
                    analytics.kpis.total_comments +
                    analytics.kpis.total_shares
                  ).toLocaleString()
                : '0'}
            </h3>
            <p className="text-[11px] text-slate-500 mt-1">
              {analytics?.kpis?.total_comments || 0} comments • {analytics?.kpis?.total_likes || 0} likes
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <BarChart3 size={20} />
          </div>
        </div>
      </div>

      {/* Main Grid: Scheduled Queue & Accounts + Comments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Upcoming Scheduled Queue */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#166534] flex items-center justify-center">
                  <Calendar size={16} />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-800">Upcoming Scheduled Posts</h2>
                  <p className="text-[11px] text-slate-400">Posts waiting in the queue to be published</p>
                </div>
              </div>
              <Link
                to="/social-planner/calendar"
                className="text-xs font-semibold text-[#166534] hover:underline flex items-center gap-1"
              >
                View Full Calendar <ArrowRight size={13} />
              </Link>
            </div>

            {upcomingPosts.length === 0 ? (
              <div className="py-10 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                <Clock size={28} className="text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700">No scheduled posts yet</p>
                <p className="text-[11px] text-slate-400 max-w-xs mx-auto mt-0.5 mb-3">
                  Plan ahead by drafting and scheduling posts to publish automatically at high-engagement hours.
                </p>
                <Link
                  to="/social-planner/create"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#166534] hover:bg-[#14532d] rounded-xl transition-all shadow-xs"
                >
                  <Plus size={14} /> Schedule First Post
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {upcomingPosts.map((post) => (
                  <div key={post.id} className="py-3.5 flex items-start justify-between gap-3 first:pt-0 last:pb-0">
                    <div className="flex items-start gap-3 min-w-0">
                      {/* Media Thumbnail */}
                      <div className="w-14 h-14 rounded-xl bg-slate-100 border border-slate-200 shrink-0 overflow-hidden flex items-center justify-center">
                        {post.media && post.media.length > 0 ? (
                          post.media[0].media_type === 'video' ? (
                            <video src={post.media[0].url} className="w-full h-full object-cover" />
                          ) : (
                            <img
                              src={post.media[0].url}
                              alt="Thumbnail"
                              className="w-full h-full object-cover"
                            />
                          )
                        ) : (
                          <span className="text-[10px] font-bold text-slate-400">TEXT</span>
                        )}
                      </div>

                      {/* Content & Platforms */}
                      <div className="min-w-0">
                        <p className="text-xs text-slate-800 line-clamp-2 font-medium">
                          {post.content || <span className="italic text-slate-400">No caption</span>}
                        </p>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-medium">
                            <Clock size={11} /> {formatDateTime(post.scheduled_at)}
                          </span>
                          {post.targets?.map((target) => (
                            <span
                              key={target.id}
                              className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider ${
                                target.platform === 'facebook'
                                  ? 'bg-blue-50 text-blue-700'
                                  : 'bg-rose-50 text-rose-700'
                              }`}
                            >
                              {target.platform === 'facebook' ? (
                                <Facebook size={10} />
                              ) : (
                                <Instagram size={10} />
                              )}
                              {target.account?.name || target.platform}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handlePublishNow(post.id)}
                        className="px-2.5 py-1 text-[11px] font-bold text-white bg-[#166534] hover:bg-[#14532d] rounded-lg transition-all shadow-xs cursor-pointer"
                        title="Publish immediately without waiting for schedule"
                      >
                        Publish Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Connected Accounts & Quick Inbox */}
        <div className="space-y-4">
          {/* Connected Accounts Status */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-800">Connected Accounts</h2>
              <Link
                to="/social-planner/accounts"
                className="text-xs font-semibold text-[#166534] hover:underline"
              >
                Manage
              </Link>
            </div>

            {accounts.length === 0 ? (
              <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                <Users size={24} className="text-slate-300 mx-auto mb-1.5" />
                <p className="text-xs font-bold text-slate-700">No Accounts Connected</p>
                <p className="text-[11px] text-slate-400 mt-0.5 mb-2.5">
                  Link your Meta Page or Instagram business profile.
                </p>
                <Link
                  to="/social-planner/accounts"
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-[#166534] hover:bg-[#14532d] rounded-xl"
                >
                  <Plus size={13} /> Connect Meta
                </Link>
              </div>
            ) : (
              <div className="space-y-2.5">
                {accounts.slice(0, 4).map((acc) => {
                  const isFacebook = acc.platform === 'facebook';
                  return (
                    <div
                      key={acc.id}
                      className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-slate-50/60"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="relative shrink-0">
                          {acc.profile_picture_url ? (
                            <img
                              src={acc.profile_picture_url}
                              alt={acc.name}
                              className="w-8 h-8 rounded-full object-cover border border-slate-200"
                            />
                          ) : (
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold ${
                                isFacebook
                                  ? 'bg-[#1877F2]'
                                  : 'bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600'
                              }`}
                            >
                              {acc.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <span
                            className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center text-white ring-1 ring-white ${
                              isFacebook ? 'bg-[#1877F2]' : 'bg-rose-500'
                            }`}
                          >
                            {isFacebook ? <Facebook size={7} /> : <Instagram size={7} />}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-800 truncate">{acc.name}</p>
                          <p className="text-[10px] text-slate-400 truncate">
                            {isFacebook ? (acc.category || 'Page') : `@${acc.username || 'instagram'}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span className="text-[10px] font-bold text-emerald-700">Active</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Unified Inbox Teaser */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <MessageSquare size={16} className="text-[#166534]" />
                <h2 className="text-sm font-bold text-slate-800">Unanswered Comments</h2>
              </div>
              <Link
                to="/social-planner/inbox"
                className="text-xs font-semibold text-[#166534] hover:underline"
              >
                Go to Inbox
              </Link>
            </div>

            {recentComments.length === 0 ? (
              <div className="text-center py-6 text-slate-400">
                <CheckCircle2 size={24} className="text-emerald-500 mx-auto mb-1" />
                <p className="text-xs font-semibold text-slate-700">All comments handled</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Your social inbox is up to date.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {recentComments.map((comment) => (
                  <div
                    key={comment.id}
                    className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 space-y-1"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-slate-800">
                        {comment.commenter_name || 'Social User'}
                      </span>
                      <span
                        className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded ${
                          comment.platform === 'facebook'
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {comment.platform}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2">{comment.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

