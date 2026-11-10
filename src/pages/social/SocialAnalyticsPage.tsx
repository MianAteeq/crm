import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Facebook,
  Instagram,
  Heart,
  MessageCircle,
  Share2,
  Eye,
  Calendar,
  Filter,
  Loader2,
  ExternalLink,
  Info,
  ArrowUpRight,
  RefreshCw,
} from 'lucide-react';
import { socialPlannerApi } from '../../services/socialPlannerApi';
import { SocialAnalyticsSummary, SocialPlatform } from '../../types/socialPlanner';
import { toast } from '../../components/ui/Toast';

export default function SocialAnalyticsPage() {
  const [period, setPeriod] = useState<'7d' | '30d' | '90d' | 'custom'>('30d');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [platform, setPlatform] = useState<SocialPlatform | undefined>(undefined);
  const [analytics, setAnalytics] = useState<SocialAnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const fetchAnalytics = async (triggerSync = false) => {
    setLoading(true);
    try {
      const res = await socialPlannerApi.getAnalytics({
        period,
        platform,
        start_date: period === 'custom' ? startDate : undefined,
        end_date: period === 'custom' ? endDate : undefined,
        sync: triggerSync,
      });

      if (res.success && res.data) {
        setAnalytics(res.data);
      }
    } catch (err) {
      console.error('Failed to load analytics:', err);
      toast.error('Failed to load social analytics');
    } finally {
      setLoading(false);
    }
  };

  const handleManualSync = async () => {
    setSyncing(true);
    try {
      const syncRes = await socialPlannerApi.syncAnalytics();
      if (syncRes.success) {
        toast.success(syncRes.message || 'Live metrics synced from Meta!');
      }
      await fetchAnalytics(false);
    } catch (err) {
      console.error('Failed to sync analytics:', err);
      toast.error('Failed to sync live metrics from Meta.');
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    if (period !== 'custom' || (startDate && endDate)) {
      fetchAnalytics(true);
    }
  }, [period, platform, startDate, endDate]);

  const kpis = analytics?.kpis;

  const renderMetricValue = (val: number | null | undefined, suffix = '') => {
    if (val === null || val === undefined) {
      return (
        <span className="text-slate-400 text-sm font-normal" title="Metric unavailable from Meta API">
          N/A*
        </span>
      );
    }
    return <span>{val.toLocaleString()}{suffix}</span>;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Social Media Analytics</h1>
          <p className="text-xs text-slate-500">
            Track performance, engagement, reach, and audience growth across your Facebook Pages and Instagram accounts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Manual Sync Button */}
          <button
            type="button"
            onClick={handleManualSync}
            disabled={syncing || loading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-white text-slate-700 hover:text-[#166534] border border-slate-200/90 rounded-xl shadow-2xs hover:border-[#166534]/40 transition-all disabled:opacity-50"
            title="Sync live likes and comments count from Meta Graph API"
          >
            <RefreshCw size={13} className={syncing ? 'animate-spin text-[#166534]' : 'text-slate-500'} />
            <span>{syncing ? 'Syncing...' : 'Sync Live Metrics'}</span>
          </button>

          {/* Date Filter Bar */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200/90 shadow-2xs self-start sm:self-auto">
            {(['7d', '30d', '90d', 'custom'] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  period === p
                    ? 'bg-[#166534] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {p === '7d' ? '7 Days' : p === '30d' ? '30 Days' : p === '90d' ? '90 Days' : 'Custom'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Custom Date Pickers */}
      {period === 'custom' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-[#166534] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-[#166534] focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* KPI Cards */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-slate-200">
          <Loader2 size={32} className="animate-spin text-[#166534] mb-2" />
          <p className="text-xs font-semibold text-slate-500">Calculating analytics...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Posts */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Posts</p>
                <h3 className="text-2xl font-black text-slate-800 mt-1">
                  {kpis?.total_posts || 0}
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Published in period</p>
              </div>
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <BarChart3 size={20} />
              </div>
            </div>

            {/* Total Reach */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Reach</p>
                <h3 className="text-2xl font-black text-slate-800 mt-1">
                  {renderMetricValue(kpis?.total_reach)}
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Unique accounts reached</p>
              </div>
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-[#166534] flex items-center justify-center">
                <TrendingUp size={20} />
              </div>
            </div>

            {/* Total Impressions */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Impressions</p>
                <h3 className="text-2xl font-black text-slate-800 mt-1">
                  {renderMetricValue(kpis?.total_impressions)}
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Total content views</p>
              </div>
              <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Eye size={20} />
              </div>
            </div>

            {/* Total Engagement */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Engagement</p>
                <h3 className="text-2xl font-black text-slate-800 mt-1">
                  {kpis?.total_engagement?.toLocaleString() || 0}
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Likes + Comments + Shares</p>
              </div>
              <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Heart size={20} />
              </div>
            </div>
          </div>

          {/* Platform Performance Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Facebook Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#1877F2] flex items-center justify-center">
                    <Facebook size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Facebook Pages Performance</h3>
                    <p className="text-[11px] text-slate-400">
                      {analytics?.platforms?.facebook?.accounts_count || 0} Connected Page(s)
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
                <div className="p-3 rounded-xl bg-slate-50">
                  <p className="text-[11px] text-slate-400 font-semibold">Published</p>
                  <p className="text-lg font-bold text-slate-800 mt-0.5">
                    {analytics?.platforms?.facebook?.posts_count || 0}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50">
                  <p className="text-[11px] text-slate-400 font-semibold">Likes</p>
                  <p className="text-lg font-bold text-slate-800 mt-0.5">
                    {analytics?.platforms?.facebook?.likes ?? 0}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50">
                  <p className="text-[11px] text-slate-400 font-semibold">Comments</p>
                  <p className="text-lg font-bold text-slate-800 mt-0.5">
                    {analytics?.platforms?.facebook?.comments ?? 0}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50">
                  <p className="text-[11px] text-slate-400 font-semibold">Shares</p>
                  <p className="text-lg font-bold text-slate-800 mt-0.5">
                    {analytics?.platforms?.facebook?.shares ?? 0}
                  </p>
                </div>
              </div>
            </div>

            {/* Instagram Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-rose-50 text-[#E4405F] flex items-center justify-center">
                    <Instagram size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Instagram Performance</h3>
                    <p className="text-[11px] text-slate-400">
                      {analytics?.platforms?.instagram?.accounts_count || 0} Professional Account(s)
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
                <div className="p-3 rounded-xl bg-slate-50">
                  <p className="text-[11px] text-slate-400 font-semibold">Published</p>
                  <p className="text-lg font-bold text-slate-800 mt-0.5">
                    {analytics?.platforms?.instagram?.posts_count || 0}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50">
                  <p className="text-[11px] text-slate-400 font-semibold">Likes</p>
                  <p className="text-lg font-bold text-slate-800 mt-0.5">
                    {analytics?.platforms?.instagram?.likes ?? 0}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50">
                  <p className="text-[11px] text-slate-400 font-semibold">Comments</p>
                  <p className="text-lg font-bold text-slate-800 mt-0.5">
                    {analytics?.platforms?.instagram?.comments ?? 0}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50">
                  <p className="text-[11px] text-slate-400 font-semibold">Shares</p>
                  <p className="text-lg font-bold text-slate-800 mt-0.5">
                    {analytics?.platforms?.instagram?.shares ?? 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Top Performing Posts Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Top Performing Posts</h3>
                <p className="text-[11px] text-slate-400">
                  Ranked by cumulative social engagement (likes, comments, shares)
                </p>
              </div>
            </div>

            {(!analytics?.top_posts || analytics.top_posts.length === 0) ? (
              <div className="text-center py-12 text-slate-400">
                <p className="text-xs font-semibold text-slate-600">No published posts yet in this period</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Publish posts to start aggregating live Meta analytics metrics.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-[11px] font-bold uppercase text-slate-400">
                      <th className="pb-3 pl-2">Post</th>
                      <th className="pb-3">Platform</th>
                      <th className="pb-3">Published Date</th>
                      <th className="pb-3 text-right">Likes</th>
                      <th className="pb-3 text-right">Comments</th>
                      <th className="pb-3 text-right">Reach</th>
                      <th className="pb-3 text-right">Impressions</th>
                      <th className="pb-3 text-right pr-2">Engagement</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {analytics.top_posts.map((post) => (
                      <tr key={post.target_id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 pl-2 max-w-xs">
                          <div className="flex items-center gap-2.5">
                            {post.media_url ? (
                              <img
                                src={post.media_url}
                                alt=""
                                className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center text-[10px] font-bold shrink-0">
                                TEXT
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="font-semibold text-slate-800 line-clamp-2">
                                {post.caption || 'Media Post'}
                              </p>
                              {post.platform_post_url && (
                                <a
                                  href={post.platform_post_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-[10px] text-[#166534] font-medium hover:underline mt-0.5"
                                >
                                  View on {post.platform === 'facebook' ? 'Facebook' : 'Instagram'}
                                  <ExternalLink size={10} />
                                </a>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="py-3">
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md ${
                              post.platform === 'facebook'
                                ? 'bg-blue-50 text-blue-700'
                                : 'bg-rose-50 text-rose-700'
                            }`}
                          >
                            {post.platform === 'facebook' ? (
                              <Facebook size={10} />
                            ) : (
                              <Instagram size={10} />
                            )}
                            {post.account_name}
                          </span>
                        </td>

                        <td className="py-3 text-slate-500">
                          {post.published_at
                            ? new Date(post.published_at).toLocaleDateString()
                            : 'N/A'}
                        </td>

                        <td className="py-3 text-right font-medium text-slate-700">
                          {post.likes.toLocaleString()}
                        </td>

                        <td className="py-3 text-right font-medium text-slate-700">
                          {post.comments.toLocaleString()}
                        </td>

                        <td className="py-3 text-right text-slate-600">
                          {renderMetricValue(post.reach)}
                        </td>

                        <td className="py-3 text-right text-slate-600">
                          {renderMetricValue(post.impressions)}
                        </td>

                        <td className="py-3 text-right pr-2 font-bold text-[#166534]">
                          {post.engagement.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Metric availability note */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-500 flex items-center gap-2">
            <Info size={14} className="shrink-0 text-slate-400" />
            <span>
              *Note: Reach and Impressions for Meta posts require the Instagram Insights API or Page Read Engagement permissions. When not granted by Meta, values display as N/A.
            </span>
          </div>
        </>
      )}
    </div>
  );
}

