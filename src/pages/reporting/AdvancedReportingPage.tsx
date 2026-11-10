import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  Filter,
  Users,
  Target,
  Share2,
  Sparkles,
  RefreshCw,
  Facebook,
  Instagram,
  CheckCircle2,
  Layers,
  Award,
  ChevronRight,
  ArrowUpRight,
  FileSpreadsheet,
  Clock,
  Briefcase,
  Bookmark,
  Trash2,
  Plus,
  Activity,
  Zap,
  HelpCircle,
  ExternalLink,
  Search,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { advancedReportingApi } from '../../services/advancedReportingApi';
import {
  ReportingPeriod,
  ReportingFilters,
  MarketingOverviewData,
  AdvertisingPerformanceData,
  SocialAnalyticsData,
  LeadGenerationData,
  TeamPerformanceData,
  SavedReport,
} from '../../types/advancedReporting';
import { toast } from '../../components/ui/Toast';

// Grade configuration with static Tailwind classes to prevent JIT purge bugs
const GRADE_CONFIG: Record<
  string,
  { badgeBg: string; text: string; bar: string; label: string }
> = {
  A: {
    badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    text: 'text-emerald-700',
    bar: 'bg-emerald-500',
    label: 'Sales Qualified (Hot)',
  },
  B: {
    badgeBg: 'bg-blue-50 text-blue-800 border-blue-200',
    text: 'text-blue-700',
    bar: 'bg-blue-500',
    label: 'Marketing Qualified (Warm)',
  },
  C: {
    badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
    text: 'text-amber-700',
    bar: 'bg-amber-500',
    label: 'Engaged / In Progress',
  },
  D: {
    badgeBg: 'bg-slate-100 text-slate-700 border-slate-200',
    text: 'text-slate-600',
    bar: 'bg-slate-400',
    label: 'Unqualified / Cold',
  },
};

// Agency-grade dark tooltip for charts
const CustomAnalyticsTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 backdrop-blur-md text-white p-3 px-3.5 rounded-xl shadow-xl border border-slate-800/80 text-xs min-w-[140px] space-y-1.5 animate-in fade-in zoom-in-95 duration-100">
        <p className="font-semibold text-slate-400 text-[11px] uppercase tracking-wider">{label}</p>
        <div className="flex items-center justify-between gap-4">
          <span className="text-slate-300 text-xs font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
            {payload[0].name || 'Leads'}
          </span>
          <span className="font-bold text-white text-sm font-mono">
            {Number(payload[0].value).toLocaleString()}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

export const AdvancedReportingPage: React.FC = () => {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'overview' | 'ads' | 'social' | 'leads' | 'team' | 'saved'>('overview');

  // Filters
  const [period, setPeriod] = useState<ReportingPeriod>('30d');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Data states
  const [overviewData, setOverviewData] = useState<MarketingOverviewData | null>(null);
  const [advertisingData, setAdvertisingData] = useState<AdvertisingPerformanceData | null>(null);
  const [socialData, setSocialData] = useState<SocialAnalyticsData | null>(null);
  const [leadsData, setLeadsData] = useState<LeadGenerationData | null>(null);
  const [teamData, setTeamData] = useState<TeamPerformanceData | null>(null);
  const [savedReports, setSavedReports] = useState<SavedReport[]>([]);

  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  // Save report modal
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [reportTitle, setReportTitle] = useState('');
  const [reportDesc, setReportDesc] = useState('');

  const currentFilters: ReportingFilters = {
    period,
    start_date: period === 'custom' ? startDate : undefined,
    end_date: period === 'custom' ? endDate : undefined,
  };

  useEffect(() => {
    loadActiveTabData();
  }, [activeTab, period, startDate, endDate]);

  const loadActiveTabData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'overview') {
        const res = await advancedReportingApi.getOverview(currentFilters);
        if (res.success) setOverviewData(res.data);
      } else if (activeTab === 'ads') {
        const res = await advancedReportingApi.getAdvertising(currentFilters);
        if (res.success) setAdvertisingData(res.data);
      } else if (activeTab === 'social') {
        const res = await advancedReportingApi.getSocial(currentFilters);
        if (res.success) setSocialData(res.data);
      } else if (activeTab === 'leads') {
        const res = await advancedReportingApi.getLeads(currentFilters);
        if (res.success) setLeadsData(res.data);
      } else if (activeTab === 'team') {
        const res = await advancedReportingApi.getTeam(currentFilters);
        if (res.success) setTeamData(res.data);
      } else if (activeTab === 'saved') {
        const res = await advancedReportingApi.getSavedReports();
        if (res.success) setSavedReports(res.data);
      }
    } catch (err: any) {
      console.error('Failed to load reporting tab:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCsv = async () => {
    setExporting(true);
    try {
      const exportType = activeTab === 'saved' ? 'overview' : activeTab;
      await advancedReportingApi.exportCsv(exportType, currentFilters);
      toast.success('Report CSV exported successfully.');
    } catch (err: any) {
      toast.error('Failed to export CSV report.');
    } finally {
      setExporting(false);
    }
  };

  const handleSaveReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportTitle.trim()) return;

    try {
      const type = activeTab === 'saved' ? 'overview' : activeTab;
      await advancedReportingApi.saveReport({
        title: reportTitle.trim(),
        description: reportDesc.trim(),
        report_type: type,
        filters: currentFilters,
      });
      setIsSaveModalOpen(false);
      setReportTitle('');
      setReportDesc('');
      toast.success('Report configuration saved.');
      if (activeTab === 'saved') {
        loadActiveTabData();
      }
    } catch (err: any) {
      toast.error('Failed to save report configuration.');
    }
  };

  const handleDeleteSavedReport = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this saved report configuration?')) return;
    try {
      await advancedReportingApi.deleteSavedReport(id);
      setSavedReports((prev) => prev.filter((r) => r.id !== id));
      toast.success('Report configuration deleted.');
    } catch (err) {
      toast.error('Failed to delete report.');
    }
  };

  // Calculate peak day and total for daily trends
  const trendMax = overviewData?.daily_trends?.reduce((max, item) => Math.max(max, item.leads), 0) || 0;
  const trendTotal = overviewData?.daily_trends?.reduce((sum, item) => sum + item.leads, 0) || 0;

  return (
    <div className="min-h-screen bg-slate-50/70 p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
      {/* 1. Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#166534]/10 border border-[#166534]/20 flex items-center justify-center shrink-0">
              <BarChart3 className="w-5 h-5 text-[#166534]" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Marketing & Team Analytics
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Multi-channel acquisition, Meta Ads performance, social reach, and agent response velocity.
              </p>
            </div>
          </div>
        </div>

        {/* Global Filter & Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Period Selector Dropdown */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200/90 rounded-xl px-2.5 py-1.5 shadow-2xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value as ReportingPeriod)}
              className="text-xs font-semibold text-slate-700 bg-transparent border-none focus:ring-0 p-0 pr-6 cursor-pointer"
            >
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="this_month">This Month</option>
              <option value="last_month">Last Month</option>
              <option value="custom">Custom Date Range</option>
            </select>
          </div>

          {/* Custom Date Inputs */}
          {period === 'custom' && (
            <div className="flex items-center gap-1.5 text-xs bg-white border border-slate-200/90 rounded-xl px-2.5 py-1.5 shadow-2xs animate-in fade-in">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="text-xs bg-transparent border-none text-slate-700 font-medium focus:ring-0 p-0 cursor-pointer"
              />
              <span className="text-slate-400 text-xs font-medium">to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="text-xs bg-transparent border-none text-slate-700 font-medium focus:ring-0 p-0 cursor-pointer"
              />
            </div>
          )}

          {/* Save Configuration Button */}
          <button
            type="button"
            onClick={() => setIsSaveModalOpen(true)}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-700 text-xs font-semibold rounded-xl shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
            title="Save this view configuration"
          >
            <Bookmark className="w-3.5 h-3.5 text-slate-500" />
            <span>Save View</span>
          </button>

          {/* Export CSV Button */}
          <button
            type="button"
            onClick={handleExportCsv}
            disabled={exporting}
            className="px-3.5 py-1.5 bg-[#166534] hover:bg-[#14532d] text-white text-xs font-semibold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>{exporting ? 'Exporting...' : 'Export CSV'}</span>
          </button>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="flex items-center gap-1.5 bg-slate-200/60 p-1 rounded-2xl overflow-x-auto border border-slate-200/80">
        {[
          { id: 'overview', label: 'Overview', icon: TrendingUp },
          { id: 'ads', label: 'Meta Lead Ads', icon: Target },
          { id: 'social', label: 'Social Reach', icon: Share2 },
          { id: 'leads', label: 'Lead Attribution', icon: Layers },
          { id: 'team', label: 'Team Velocity', icon: Users },
          { id: 'saved', label: 'Saved Reports', icon: Bookmark, badge: savedReports.length },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#166534]' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              {typeof tab.badge === 'number' && tab.badge > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 3. Tab Content Area */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-16 text-center text-slate-400 shadow-xs">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-3 text-[#166534]" />
          <p className="text-xs font-semibold text-slate-700">Aggregating live analytics from CRM & Meta APIs...</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Fetching verified conversion metrics and social insights</p>
        </div>
      ) : (
        <>
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && overviewData && (
            <div className="space-y-6">
              {/* KPI Cards Strip */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Leads */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <span>Total Leads Captured</span>
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                      <Layers className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl font-bold text-slate-900 tracking-tight font-mono">
                      {overviewData.kpis.total_leads.toLocaleString()}
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                      Active
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1.5 font-medium">
                    Omnichannel: Meta, Page Forms & Direct CRM
                  </p>
                </div>

                {/* Meta Instant Leads */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <span>Meta Instant Leads</span>
                    <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Facebook className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl font-bold text-slate-900 tracking-tight font-mono">
                      {overviewData.kpis.meta_leads.toLocaleString()}
                    </span>
                    <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded-md">
                      {overviewData.kpis.total_leads > 0
                        ? `${Math.round((overviewData.kpis.meta_leads / overviewData.kpis.total_leads) * 100)}%`
                        : '0%'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1.5 font-medium">
                    Direct from Facebook & Instagram Ads
                  </p>
                </div>

                {/* Lead Conversion Rate */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <span>Lead Conversion Rate</span>
                    <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
                      <Award className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl font-bold text-slate-900 tracking-tight font-mono">
                      {overviewData.kpis.conversion_rate}%
                    </span>
                    <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded-md">
                      Won Deals
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1.5 font-medium">
                    Converted from Inbound to Paying Customer
                  </p>
                </div>

                {/* Published Posts & Reach */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <span>Published Posts</span>
                    <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                      <Share2 className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl font-bold text-slate-900 tracking-tight font-mono">
                      {overviewData.kpis.published_posts}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded-md font-mono">
                      {overviewData.kpis.total_reach.toLocaleString()} reach
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1.5 font-medium">
                    Organic campaigns across verified social profiles
                  </p>
                </div>
              </div>

              {/* Trend Chart: Daily Lead Volume */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base">Daily Lead Acquisition Velocity</h3>
                    <p className="text-xs text-slate-500">Chronological volume of newly captured prospects</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                      Window: <strong className="text-slate-800">{overviewData.period.days} Days</strong>
                    </span>
                    {trendMax > 0 && (
                      <span className="text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-lg">
                        Peak: <strong>{trendMax} leads / day</strong>
                      </span>
                    )}
                  </div>
                </div>

                <div className="h-72 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={overviewData.daily_trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="leadVolumeGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#166534" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#166534" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#64748B' }} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#64748B' }} tickLine={false} allowDecimals={false} />
                      <Tooltip content={<CustomAnalyticsTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="leads"
                        name="Total Leads"
                        stroke="#166534"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#leadVolumeGrad)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Distribution Grid: Sources & Lead Quality */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Lead Sources Breakdown */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base">Acquisition Channel Split</h3>
                    <span className="text-xs font-semibold text-slate-500">
                      {overviewData.lead_sources.length} Channels
                    </span>
                  </div>

                  {overviewData.lead_sources.length === 0 ? (
                    <div className="text-center py-10 text-slate-400 text-xs italic">
                      No inbound leads recorded for this time range.
                    </div>
                  ) : (
                    <div className="space-y-3.5">
                      {overviewData.lead_sources.map((item, idx) => {
                        const pct = Math.min(
                          100,
                          Math.round((item.count / Math.max(1, overviewData.kpis.total_leads)) * 100)
                        );
                        return (
                          <div key={idx} className="space-y-1.5">
                            <div className="flex justify-between items-center text-xs">
                              <span className="font-semibold text-slate-800">{item.source}</span>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-slate-500 text-[11px]">{pct}%</span>
                                <span className="font-bold text-slate-900 font-mono">{item.count} leads</span>
                              </div>
                            </div>
                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#166534] rounded-full transition-all duration-500"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Lead Quality Grades */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base">Lead Qualification Tiers</h3>
                    <span className="text-xs font-semibold text-slate-500">AI & CRM Scored</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {(['A', 'B', 'C', 'D'] as const).map((grade) => {
                      const count = overviewData.lead_quality[grade] || 0;
                      const config = GRADE_CONFIG[grade];
                      const pct = Math.round(
                        (count / Math.max(1, overviewData.kpis.total_leads)) * 100
                      );
                      return (
                        <div
                          key={grade}
                          className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/70 text-center flex flex-col justify-between"
                        >
                          <div>
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border ${config.badgeBg}`}
                            >
                              Grade {grade}
                            </span>
                            <p className="text-2xl font-bold text-slate-900 mt-2 font-mono">{count}</p>
                            <p className="text-[10px] text-slate-500 font-medium mt-0.5 line-clamp-1">
                              {config.label}
                            </p>
                          </div>
                          <div className="mt-2.5 pt-2 border-t border-slate-200/60">
                            <span className="text-[11px] font-semibold text-slate-600 font-mono">{pct}% total</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ADVERTISING (META ADS) */}
          {activeTab === 'ads' && advertisingData && (
            <div className="space-y-6">
              {/* Meta Lead Ads Status Banner */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 bg-blue-50 text-blue-600 rounded-xl border border-blue-100 flex items-center justify-center shrink-0">
                    <Facebook className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base">Meta Lead Ads Synchronization</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {advertisingData.connected_accounts} Connected Facebook & Instagram Accounts ·{' '}
                      {advertisingData.active_forms_count} Active Lead Forms Synced
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-emerald-50 text-[#166534] text-xs font-semibold rounded-full border border-emerald-200 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Webhooks & Form Discovery Active
                  </span>
                </div>
              </div>

              {/* Platform Distribution Split */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <Facebook className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Facebook Lead Ads</p>
                      <p className="text-2xl font-bold text-slate-900 font-mono mt-0.5">
                        {advertisingData.platform_distribution.facebook} <span className="text-xs font-normal text-slate-400">leads</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center shrink-0">
                      <Instagram className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Instagram Lead Ads</p>
                      <p className="text-2xl font-bold text-slate-900 font-mono mt-0.5">
                        {advertisingData.platform_distribution.instagram} <span className="text-xs font-normal text-slate-400">leads</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Discovered Lead Forms Table */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base">Discovered Meta Lead Generation Forms</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Active instant forms linked to your connected Facebook pages</p>
                  </div>
                  <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                    {advertisingData.forms_summary.length} Forms Total
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="py-3 px-4">Form Name</th>
                        <th className="py-3 px-4">Connected Page</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Submissions</th>
                        <th className="py-3 px-4">Sync Pipeline</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {advertisingData.forms_summary.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-slate-400 italic">
                            No Meta Lead Forms discovered yet. Use "Sync Meta Forms" on the Lead Ads page.
                          </td>
                        </tr>
                      ) : (
                        advertisingData.forms_summary.map((form) => (
                          <tr key={form.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-3.5 px-4 font-semibold text-slate-900">
                              {form.name}
                              <span className="block text-[11px] font-mono text-slate-400 mt-0.5 font-normal">
                                ID: {form.form_id}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-slate-600 font-medium">{form.page_name}</td>
                            <td className="py-3.5 px-4">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  form.is_active
                                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                                }`}
                              >
                                {form.status || (form.is_active ? 'ACTIVE' : 'INACTIVE')}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 font-mono font-bold text-slate-900 text-right">
                              {form.submissions_count}
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="text-[#166534] font-semibold flex items-center gap-1.5 text-xs">
                                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                                Real-time Webhook
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Campaign Attribution Table */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="p-5 border-b border-slate-100">
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">Meta Ad Campaign Attribution</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Leads grouped by Meta campaign and synchronization status</p>
                </div>
                <div className="overflow-x-auto">
                  {advertisingData.campaigns.length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-400 italic">
                      No ad campaign submissions captured yet in this timeframe.
                    </div>
                  ) : (
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                        <tr>
                          <th className="py-3 px-4">Campaign Name</th>
                          <th className="py-3 px-4">Platform</th>
                          <th className="py-3 px-4 text-right">Total Leads</th>
                          <th className="py-3 px-4 text-right">Synced to CRM</th>
                          <th className="py-3 px-4">Sync Reliability</th>
                          <th className="py-3 px-4">Latest Inbound</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {advertisingData.campaigns.map((c, i) => (
                          <tr key={i} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-3.5 px-4 font-semibold text-slate-900">{c.campaign_name}</td>
                            <td className="py-3.5 px-4 capitalize text-slate-600 font-medium">{c.platform}</td>
                            <td className="py-3.5 px-4 font-bold text-slate-900 font-mono text-right">{c.total_leads}</td>
                            <td className="py-3.5 px-4 text-[#166534] font-semibold font-mono text-right">{c.synced_leads}</td>
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-2">
                                <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-[#166534] rounded-full"
                                    style={{ width: `${c.sync_rate}%` }}
                                  />
                                </div>
                                <span className="font-mono text-xs font-bold text-slate-700">{c.sync_rate}%</span>
                              </div>
                            </td>
                            <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                              {c.last_lead_at ? new Date(c.last_lead_at).toLocaleString() : 'N/A'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SOCIAL MEDIA REACH */}
          {activeTab === 'social' && socialData && (
            <div className="space-y-6">
              {/* Accounts Summary Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Followers</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2 font-mono">
                    {socialData.accounts_summary.total_followers.toLocaleString()}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1 font-medium">
                    Across {socialData.accounts_summary.total} Connected Accounts
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Published Posts</p>
                  <p className="text-3xl font-bold text-[#166534] mt-2 font-mono">
                    {socialData.kpis.published_posts}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1 font-medium">Organic feed publications</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Impressions</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2 font-mono">
                    {socialData.kpis.total_impressions.toLocaleString()}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1 font-medium">
                    Reach: <strong className="text-slate-800 font-mono">{socialData.kpis.total_reach.toLocaleString()}</strong>
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Engagement Rate</p>
                  <p className="text-3xl font-bold text-pink-600 mt-2 font-mono">
                    {socialData.kpis.engagement_rate}%
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1 font-medium">
                    {socialData.kpis.total_likes} Likes · {socialData.kpis.total_comments} Comments
                  </p>
                </div>
              </div>

              {/* Connected Accounts Cards */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">Connected Meta Channels</h3>
                  <span className="text-xs font-semibold text-slate-500">
                    {socialData.connected_accounts.length} Profiles
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {socialData.connected_accounts.map((acc) => (
                    <div
                      key={acc.id}
                      className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/70 flex items-center gap-3"
                    >
                      <div className="w-10 h-10 rounded-xl bg-white shadow-2xs border border-slate-200/70 overflow-hidden flex items-center justify-center shrink-0">
                        {acc.avatar ? (
                          <img src={acc.avatar} alt="" className="w-full h-full object-cover" />
                        ) : acc.platform === 'facebook' ? (
                          <Facebook className="w-5 h-5 text-blue-600" />
                        ) : (
                          <Instagram className="w-5 h-5 text-pink-600" />
                        )}
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-bold text-slate-900 truncate">{acc.name}</p>
                        <p className="text-[11px] text-slate-400 capitalize">{acc.platform}</p>
                        <span className="text-[10px] text-[#166534] font-semibold font-mono">
                          {acc.followers_count.toLocaleString()} followers
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Performing Posts Table */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="p-5 border-b border-slate-100">
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">Top Performing Publications</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Ranked by overall organic reach and user engagement</p>
                </div>
                <div className="overflow-x-auto">
                  {socialData.top_posts.length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-400 italic">
                      No posts recorded in this timeframe
                    </div>
                  ) : (
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                        <tr>
                          <th className="py-3 px-4">Post Content Preview</th>
                          <th className="py-3 px-4">Platform</th>
                          <th className="py-3 px-4 text-right">Reach</th>
                          <th className="py-3 px-4 text-right">Impressions</th>
                          <th className="py-3 px-4 text-right">Likes</th>
                          <th className="py-3 px-4 text-right">Comments</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {socialData.top_posts.map((post) => (
                          <tr key={post.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-3.5 px-4 font-medium text-slate-900 max-w-sm truncate">
                              {post.content_preview || 'Media Post'}
                            </td>
                            <td className="py-3.5 px-4 capitalize text-slate-600 font-medium">{post.platform}</td>
                            <td className="py-3.5 px-4 font-mono font-bold text-slate-900 text-right">{post.reach}</td>
                            <td className="py-3.5 px-4 font-mono text-slate-700 text-right">{post.impressions}</td>
                            <td className="py-3.5 px-4 font-mono text-pink-600 font-bold text-right">{post.likes}</td>
                            <td className="py-3.5 px-4 font-mono text-blue-600 font-bold text-right">{post.comments}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: LEAD GENERATION */}
          {activeTab === 'leads' && leadsData && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
                <div className="border-b border-slate-100 pb-3 mb-4">
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">Lead Channel Conversion Attribution</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Conversion velocity per origin source</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="py-3 px-4">Acquisition Source</th>
                        <th className="py-3 px-4 text-right">Total Inbound Leads</th>
                        <th className="py-3 px-4 text-right">Converted Customers</th>
                        <th className="py-3 px-4">Conversion Rate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {leadsData.source_breakdown.map((src, i) => (
                        <tr key={i} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-slate-900">{src.source}</td>
                          <td className="py-3.5 px-4 font-semibold font-mono text-slate-800 text-right">{src.total_leads}</td>
                          <td className="py-3.5 px-4 text-[#166534] font-bold font-mono text-right">{src.converted}</td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-[#166534] rounded-full"
                                  style={{ width: `${Math.min(100, src.conversion_rate)}%` }}
                                />
                              </div>
                              <span className="font-mono text-xs font-bold text-slate-700">{src.conversion_rate}%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: TEAM PERFORMANCE */}
          {activeTab === 'team' && teamData && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="p-5 border-b border-slate-100">
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">Team Response Velocity & Throughput</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Assigned CRM contacts and omnichannel inbox conversation volume</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="py-3 px-4">Team Member</th>
                        <th className="py-3 px-4 text-right">Handled Chats</th>
                        <th className="py-3 px-4 text-right">Active Queue</th>
                        <th className="py-3 px-4 text-right">Assigned Contacts</th>
                        <th className="py-3 px-4">Avg First Response</th>
                        <th className="py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {teamData.team_metrics.map((member) => (
                        <tr key={member.user_id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-[#166534]/10 text-[#166534] font-bold flex items-center justify-center shrink-0 border border-[#166534]/20 text-xs">
                                {member.name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-bold text-slate-900">{member.name}</p>
                                <p className="text-[11px] text-slate-400 font-normal">{member.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-mono font-bold text-slate-800 text-right">{member.conversations_handled}</td>
                          <td className="py-3.5 px-4 text-amber-600 font-mono font-bold text-right">{member.open_conversations}</td>
                          <td className="py-3.5 px-4 font-mono text-slate-700 text-right">{member.contacts_handled}</td>
                          <td className="py-3.5 px-4 font-mono text-[#166534] font-semibold">{member.avg_response_time}</td>
                          <td className="py-3.5 px-4">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                              {member.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: SAVED REPORTS */}
          {activeTab === 'saved' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">Custom Saved Reporting Views</h3>
                  <p className="text-xs text-slate-500">Stored configurations for automated audits and quick executive review</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSaveModalOpen(true)}
                  className="px-3.5 py-1.5 bg-[#166534] hover:bg-[#14532d] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Save Current View
                </button>
              </div>

              {savedReports.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center text-xs text-slate-400 italic shadow-xs">
                  No custom saved reports yet. Click "Save Current View" to store this report configuration.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedReports.map((report) => (
                    <div key={report.id} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 hover:border-slate-300 transition-all">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">{report.title}</h4>
                          {report.description && <p className="text-xs text-slate-500 mt-0.5">{report.description}</p>}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteSavedReport(report.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                          title="Delete report"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                        <span className="px-2 py-0.5 bg-slate-100 rounded-md uppercase font-bold text-slate-700 text-[10px] tracking-wider">
                          {report.report_type}
                        </span>
                        <span>Saved on {new Date(report.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Save Report Modal */}
      {isSaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150 border border-slate-200/90">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Save Report Configuration</h3>
              <button
                type="button"
                onClick={() => setIsSaveModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveReport} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Report Title</label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="e.g. Monthly Lead Attribution Overview"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-200 focus:border-[#166534] focus:ring-1 focus:ring-[#166534] py-2 px-3 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Description (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Notes about this report..."
                  value={reportDesc}
                  onChange={(e) => setReportDesc(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-200 focus:border-[#166534] focus:ring-1 focus:ring-[#166534] py-2 px-3 outline-none resize-none"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 border border-slate-100">
                Current filters (Period: <strong className="capitalize text-slate-800">{period}</strong>) will be saved.
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsSaveModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!reportTitle.trim()}
                  className="px-4 py-1.5 bg-[#166534] hover:bg-[#14532d] text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  Save Configuration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedReportingPage;
