import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Filter,
  Facebook,
  Instagram,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileEdit,
  Trash2,
  Send,
  Loader2,
  List as ListIcon,
  Grid,
  MoreVertical,
  X,
} from 'lucide-react';
import { socialPlannerApi } from '../../services/socialPlannerApi';
import { SocialPost, SocialPlatform, SocialPostStatus } from '../../types/socialPlanner';
import { toast } from '../../components/ui/Toast';

type ViewMode = 'month' | 'week' | 'day' | 'list';

export default function SocialCalendarPage() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [filterPlatform, setFilterPlatform] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Selected post for view / reschedule
  const [activePost, setActivePost] = useState<SocialPost | null>(null);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const fetchCalendarPosts = async () => {
    setLoading(true);
    try {
      // Calculate start and end date range based on viewMode or full month
      const y = currentDate.getFullYear();
      const m = currentDate.getMonth();

      // Wide window covering current month + buffer for calendar view
      const start = new Date(y, m - 1, 1).toISOString();
      const end = new Date(y, m + 2, 0).toISOString();

      const res = await socialPlannerApi.getCalendarPosts({
        start_date: start,
        end_date: end,
        platform: filterPlatform !== 'all' ? filterPlatform : undefined,
        status: filterStatus !== 'all' ? filterStatus : undefined,
      });

      if (res.success && res.data) {
        setPosts(res.data);
      }
    } catch (err) {
      console.error('Error fetching calendar posts:', err);
      toast.error('Failed to load calendar posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendarPosts();
  }, [currentDate, filterPlatform, filterStatus]);

  // Date navigation handlers
  const handlePrev = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    } else if (viewMode === 'week') {
      const d = new Date(currentDate);
      d.setDate(d.getDate() - 7);
      setCurrentDate(d);
    } else {
      const d = new Date(currentDate);
      d.setDate(d.getDate() - 1);
      setCurrentDate(d);
    }
  };

  const handleNext = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    } else if (viewMode === 'week') {
      const d = new Date(currentDate);
      d.setDate(d.getDate() + 7);
      setCurrentDate(d);
    } else {
      const d = new Date(currentDate);
      d.setDate(d.getDate() + 1);
      setCurrentDate(d);
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Actions
  const handlePublishNow = async (postId: number) => {
    try {
      await socialPlannerApi.publishNow(postId);
      toast.success('Post queued for immediate publishing');
      setActivePost(null);
      fetchCalendarPosts();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Publishing failed');
    }
  };

  const handleDeletePost = async (postId: number) => {
    try {
      await socialPlannerApi.deletePost(postId);
      toast.success('Post removed');
      setDeleteConfirmId(null);
      setActivePost(null);
      fetchCalendarPosts();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  const handleRescheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePost || !rescheduleDate) return;
    setIsRescheduling(true);
    try {
      await socialPlannerApi.reschedulePost(activePost.id, rescheduleDate);
      toast.success('Post rescheduled successfully');
      setIsRescheduleOpen(false);
      setActivePost(null);
      fetchCalendarPosts();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Reschedule failed');
    } finally {
      setIsRescheduling(false);
    }
  };

  // Helper formatting
  const getStatusBadge = (status: SocialPostStatus) => {
    switch (status) {
      case 'published':
        return <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold text-[10px]">Published</span>;
      case 'scheduled':
        return <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold text-[10px]">Scheduled</span>;
      case 'publishing':
        return <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 font-bold text-[10px]">Publishing...</span>;
      case 'failed':
        return <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 font-bold text-[10px]">Failed</span>;
      default:
        return <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold text-[10px]">Draft</span>;
    }
  };

  // Month generation
  const renderMonthDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    // Padding before month starts
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(<div key={`pad-${i}`} className="min-h-[110px] bg-slate-50/40 p-2 border-b border-r border-slate-100" />);
    }

    // Days in current month
    for (let day = 1; day <= daysInMonth; day++) {
      const thisDateStr = new Date(year, month, day).toDateString();
      const isToday = thisDateStr === new Date().toDateString();

      // Find posts for this day
      const dayPosts = posts.filter((p) => {
        const targetDate = p.scheduled_at || p.published_at || p.created_at;
        if (!targetDate) return false;
        return new Date(targetDate).toDateString() === thisDateStr;
      });

      days.push(
        <div
          key={day}
          className={`min-h-[110px] p-2 border-b border-r border-slate-100 flex flex-col justify-between transition-colors ${
            isToday ? 'bg-emerald-50/20' : 'bg-white hover:bg-slate-50/50'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span
              className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                isToday ? 'bg-[#166534] text-white' : 'text-slate-700'
              }`}
            >
              {day}
            </span>
            {dayPosts.length > 0 && (
              <span className="text-[10px] font-semibold text-slate-400">
                {dayPosts.length} post{dayPosts.length > 1 ? 's' : ''}
              </span>
            )}
          </div>

          <div className="space-y-1.5 overflow-y-auto max-h-[85px] custom-scrollbar">
            {dayPosts.map((post) => {
              const firstTarget = post.targets?.[0];
              const isFacebook = firstTarget?.platform === 'facebook';
              return (
                <div
                  key={post.id}
                  onClick={() => setActivePost(post)}
                  className="p-1.5 rounded-lg border border-slate-200/90 bg-white hover:border-[#166534] shadow-2xs cursor-pointer text-left transition-all"
                >
                  <div className="flex items-center gap-1 mb-1">
                    <span
                      className={`w-3.5 h-3.5 rounded flex items-center justify-center text-white text-[9px] ${
                        isFacebook ? 'bg-[#1877F2]' : 'bg-rose-500'
                      }`}
                    >
                      {isFacebook ? <Facebook size={9} /> : <Instagram size={9} />}
                    </span>
                    <span className="text-[10px] font-bold text-slate-600 truncate">
                      {post.scheduled_at
                        ? new Date(post.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : 'Draft'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-700 line-clamp-1">
                    {post.content || 'Media post'}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    return days;
  };

  // Week View
  const renderWeekDays = () => {
    const current = new Date(currentDate);
    const first = current.getDate() - current.getDay();
    const weekDays = [];

    for (let i = 0; i < 7; i++) {
      const nextDay = new Date(current.setDate(first + i));
      const thisDateStr = nextDay.toDateString();
      const isToday = thisDateStr === new Date().toDateString();

      const dayPosts = posts.filter((p) => {
        const targetDate = p.scheduled_at || p.published_at || p.created_at;
        if (!targetDate) return false;
        return new Date(targetDate).toDateString() === thisDateStr;
      });

      weekDays.push(
        <div key={i} className="flex-1 min-w-[130px] border-r border-slate-100 flex flex-col bg-white">
          <div className={`p-3 text-center border-b border-slate-100 ${isToday ? 'bg-emerald-50/50' : ''}`}>
            <p className="text-[11px] font-bold uppercase text-slate-400">
              {nextDay.toLocaleDateString(undefined, { weekday: 'short' })}
            </p>
            <p className={`text-base font-black ${isToday ? 'text-[#166534]' : 'text-slate-800'}`}>
              {nextDay.getDate()}
            </p>
          </div>
          <div className="p-2 space-y-2 flex-1 overflow-y-auto">
            {dayPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => setActivePost(post)}
                className="p-2 rounded-xl border border-slate-200 bg-white hover:border-[#166534] shadow-xs cursor-pointer space-y-1"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {post.targets?.map((t) => (
                      <span
                        key={t.id}
                        className={`w-3.5 h-3.5 rounded flex items-center justify-center text-white ${
                          t.platform === 'facebook' ? 'bg-[#1877F2]' : 'bg-rose-500'
                        }`}
                      >
                        {t.platform === 'facebook' ? <Facebook size={9} /> : <Instagram size={9} />}
                      </span>
                    ))}
                  </div>
                  {getStatusBadge(post.status)}
                </div>
                <p className="text-xs text-slate-700 line-clamp-2">{post.content || 'Media Post'}</p>
                <div className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Clock size={10} />
                  {post.scheduled_at ? new Date(post.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Draft'}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="flex overflow-x-auto min-h-[480px] border border-slate-200 rounded-2xl">
        {weekDays}
      </div>
    );
  };

  // Day View
  const renderDayView = () => {
    const thisDateStr = currentDate.toDateString();
    const dayPosts = posts.filter((p) => {
      const targetDate = p.scheduled_at || p.published_at || p.created_at;
      if (!targetDate) return false;
      return new Date(targetDate).toDateString() === thisDateStr;
    });

    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-800">
            {currentDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </h3>
          <span className="text-xs text-slate-400">{dayPosts.length} posts scheduled</span>
        </div>

        {dayPosts.length === 0 ? (
          <div className="text-center py-16">
            <Clock size={36} className="text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">No posts for this date</p>
            <p className="text-xs text-slate-400 mt-1 mb-4">You can plan a new post for this day.</p>
            <Link
              to="/social-planner/create"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-[#166534] hover:bg-[#14532d] rounded-xl shadow-xs"
            >
              <Plus size={14} /> Create Post
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {dayPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => setActivePost(post)}
                className="p-4 rounded-xl border border-slate-200 hover:border-[#166534] cursor-pointer flex items-start justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  {post.media && post.media.length > 0 && (
                    <img
                      src={post.media[0].url}
                      alt="Media"
                      className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                  )}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {getStatusBadge(post.status)}
                      <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
                        <Clock size={12} />
                        {post.scheduled_at ? new Date(post.scheduled_at).toLocaleTimeString() : 'Draft'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-800 line-clamp-2">{post.content}</p>
                    <div className="flex items-center gap-2 mt-2">
                      {post.targets?.map((t) => (
                        <span
                          key={t.id}
                          className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600"
                        >
                          {t.platform === 'facebook' ? <Facebook size={10} /> : <Instagram size={10} />}
                          {t.account?.name || t.platform}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // List View
  const renderListView = () => {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {posts.length === 0 ? (
          <div className="text-center py-16">
            <Clock size={36} className="text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">No posts found</p>
            <p className="text-xs text-slate-400 mt-1 mb-4">Adjust your filters or create a new post.</p>
            <Link
              to="/social-planner/create"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-[#166534] hover:bg-[#14532d] rounded-xl"
            >
              <Plus size={14} /> Create Post
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {posts.map((post) => (
              <div
                key={post.id}
                className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 shrink-0 overflow-hidden flex items-center justify-center">
                    {post.media && post.media.length > 0 ? (
                      <img src={post.media[0].url} alt="Thumbnail" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[10px] font-bold text-slate-400">TEXT</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {getStatusBadge(post.status)}
                      <span className="text-xs text-slate-500 font-medium">
                        {post.scheduled_at
                          ? new Date(post.scheduled_at).toLocaleString()
                          : new Date(post.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-800 line-clamp-1">{post.content || 'Media post'}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      {post.targets?.map((t) => (
                        <span
                          key={t.id}
                          className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase bg-slate-100 text-slate-600"
                        >
                          {t.platform === 'facebook' ? <Facebook size={10} /> : <Instagram size={10} />}
                          {t.account?.name || t.platform}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setActivePost(post)}
                    className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                    title="View details"
                  >
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Content Calendar</h1>
          <p className="text-xs text-slate-500">
            View, reschedule, and manage scheduled posts across Facebook Pages and Instagram accounts.
          </p>
        </div>
        <Link
          to="/social-planner/create"
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#166534] hover:bg-[#14532d] text-white rounded-xl text-xs font-bold transition-all shadow-xs self-start sm:self-auto"
        >
          <Plus size={15} strokeWidth={2.5} />
          Create Post
        </Link>
      </div>

      {/* Calendar Controls & Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Date Navigator */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleToday}
              className="px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Today
            </button>
            <div className="flex items-center">
              <button
                type="button"
                onClick={handlePrev}
                className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
            <h2 className="text-sm font-black text-slate-800 ml-1">
              {currentDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
            </h2>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0 self-start md:self-auto">
            {(['month', 'week', 'day', 'list'] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1 text-xs font-bold capitalize rounded-lg transition-all ${
                  viewMode === mode
                    ? 'bg-white text-slate-800 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Row */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1 text-xs text-slate-400 font-semibold mr-1">
            <Filter size={13} /> Filters:
          </div>

          {/* Platform Filter */}
          <select
            value={filterPlatform}
            onChange={(e) => setFilterPlatform(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#166534]"
          >
            <option value="all">All Platforms</option>
            <option value="facebook">Facebook Pages</option>
            <option value="instagram">Instagram Accounts</option>
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#166534]"
          >
            <option value="all">All Statuses</option>
            <option value="scheduled">Scheduled</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Main Calendar Render */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200">
          <Loader2 size={32} className="animate-spin text-[#166534] mb-2" />
          <p className="text-xs font-semibold text-slate-500">Loading scheduled content...</p>
        </div>
      ) : (
        <>
          {viewMode === 'month' && (
            <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs">
              {/* Day header */}
              <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 text-center py-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <div>Sun</div>
                <div>Mon</div>
                <div>Tue</div>
                <div>Wed</div>
                <div>Thu</div>
                <div>Fri</div>
                <div>Sat</div>
              </div>
              <div className="grid grid-cols-7">{renderMonthDays()}</div>
            </div>
          )}

          {viewMode === 'week' && renderWeekDays()}
          {viewMode === 'day' && renderDayView()}
          {viewMode === 'list' && renderListView()}
        </>
      )}

      {/* Post Detail & Reschedule Modal */}
      {activePost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 border border-slate-200 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CalendarIcon size={16} className="text-[#166534]" />
                <h3 className="text-sm font-bold text-slate-800">Post Details</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActivePost(null);
                  setIsRescheduleOpen(false);
                }}
                className="text-slate-400 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            {/* Status & Platforms */}
            <div className="flex items-center justify-between">
              {getStatusBadge(activePost.status)}
              <div className="flex items-center gap-1">
                {activePost.targets?.map((t) => (
                  <span
                    key={t.id}
                    className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700"
                  >
                    {t.platform === 'facebook' ? <Facebook size={10} /> : <Instagram size={10} />}
                    {t.account?.name || t.platform}
                  </span>
                ))}
              </div>
            </div>

            {/* Error Message if Failed */}
            {activePost.status === 'failed' && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200/80 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700">
                  <AlertTriangle size={14} className="shrink-0" />
                  <span>Publication Failed</span>
                </div>
                {activePost.error_message && (
                  <p className="text-[11px] text-rose-600 font-medium">{activePost.error_message}</p>
                )}
                {activePost.targets?.filter((t) => t.error_message).map((t) => (
                  <div key={t.id} className="text-[11px] text-rose-700 bg-rose-100/70 p-2 rounded-lg font-mono break-words">
                    <span className="font-bold capitalize">{t.platform}: </span>{t.error_message}
                  </div>
                ))}
              </div>
            )}

            {/* Media thumbnail */}
            {activePost.media && activePost.media.length > 0 && (
              <div className="rounded-xl overflow-hidden aspect-video bg-slate-900 flex items-center justify-center">
                {activePost.media[0].media_type === 'video' ? (
                  <video src={activePost.media[0].url} controls className="w-full h-full object-contain" />
                ) : (
                  <img src={activePost.media[0].url} alt="Media" className="w-full h-full object-cover" />
                )}
              </div>
            )}

            {/* Caption */}
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Caption</p>
              <p className="text-xs text-slate-800 whitespace-pre-wrap bg-slate-50 p-3 rounded-xl border border-slate-100">
                {activePost.content || <span className="italic text-slate-400">No caption</span>}
              </p>
            </div>

            {/* Schedule time */}
            <div className="text-xs text-slate-600 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100 flex items-center gap-2">
              <Clock size={14} className="text-[#166534]" />
              <span>
                {activePost.scheduled_at
                  ? `Scheduled for: ${new Date(activePost.scheduled_at).toLocaleString()}`
                  : 'Draft (Not scheduled)'}
              </span>
            </div>

            {/* Reschedule Form Toggle */}
            {isRescheduleOpen ? (
              <form onSubmit={handleRescheduleSubmit} className="space-y-3 pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700">
                  Select New Date & Time
                </label>
                <input
                  type="datetime-local"
                  required
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#166534] focus:outline-none"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsRescheduleOpen(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isRescheduling}
                    className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#166534] hover:bg-[#14532d] rounded-lg transition-all"
                  >
                    {isRescheduling ? 'Saving...' : 'Save New Schedule'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  {(activePost.status === 'scheduled' || activePost.status === 'failed' || activePost.status === 'draft') && (
                    <button
                      type="button"
                      onClick={() => handlePublishNow(activePost.id)}
                      className="px-3 py-1.5 text-xs font-bold text-white bg-[#166534] hover:bg-[#14532d] rounded-lg shadow-xs"
                    >
                      {activePost.status === 'failed' ? 'Retry Publishing' : 'Publish Now'}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setIsRescheduleOpen(true);
                      if (activePost.scheduled_at) {
                        const localIso = new Date(activePost.scheduled_at).toISOString().slice(0, 16);
                        setRescheduleDate(localIso);
                      }
                    }}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
                  >
                    Reschedule
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(`/social-planner/create?edit=${activePost.id}`)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    <FileEdit size={13} />
                    Edit in Composer
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setDeleteConfirmId(activePost.id)}
                  className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"
                  title="Delete post"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 border border-slate-200 shadow-xl space-y-3">
            <h3 className="text-sm font-bold text-slate-800">Delete Post?</h3>
            <p className="text-xs text-slate-500">
              Are you sure you want to delete this post? This cannot be undone.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeletePost(deleteConfirmId)}
                className="px-3.5 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

