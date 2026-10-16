import { useState, useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { crmApi } from '../services/crmApi';
import { Conversation } from '../types';
import {
  Users,
  MessageSquare,
  Send,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  Megaphone,
  UserCheck,
  CalendarCheck,
  Repeat,
  Award,
  Sparkles,
  ArrowUpRight,
  ArrowRight,
  Globe,
  Plus,
  Upload,
  UserPlus,
  LayoutTemplate,
  Bot,
  Radio,
  Clock,
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { mockCampaigns } from '../data/mockCampaigns';
import { KpiSkeleton, ChartSkeleton } from '../components/ui/Skeleton';
import { contacts } from '../data/contactsMock';
import { mockConversations } from '../data/mockMessages';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';

const performanceData = [
  { name: '01 May', reach: 4000, engagement: 2400 },
  { name: '05 May', reach: 3000, engagement: 1398 },
  { name: '10 May', reach: 2000, engagement: 9800 },
  { name: '15 May', reach: 2780, engagement: 3908 },
  { name: '20 May', reach: 1890, engagement: 4800 },
  { name: '25 May', reach: 2390, engagement: 3800 },
  { name: '30 May', reach: 3490, engagement: 4300 },
];

const distributionData = [
  { name: 'Marketing', value: 400, color: '#166534' },
  { name: 'Utility', value: 300, color: '#22C55E' },
  { name: 'Authentication', value: 300, color: '#12263A' },
  { name: 'Service', value: 200, color: '#57534E' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl shadow-lg">
        <p className="text-[11px] font-semibold text-slate-400 mb-2">{label}</p>
        <div className="space-y-1.5">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || entry.stroke }} />
              <p className="text-xs font-medium text-slate-600 flex justify-between gap-4 w-full">
                <span className="capitalize">{entry.name}</span>
                <span className="font-bold text-slate-900">{Number(entry.value).toLocaleString()}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

/* ---------------------------------- Reusable KPI Card ---------------------------------- */
function KpiCard({
  label,
  value,
  change,
  positive = true,
  icon: Icon,
  accent,
  spark,
  index = 0,
}: {
  label: string;
  value: string;
  change: string;
  positive: boolean;
  icon: any;
  accent: string;
  spark: number[];
  index?: number;
  key?: string;
}) {
  const sparkData = spark.map((v, i) => ({ i, v }));
  const gradId = `spark-${label.replace(/\s+/g, '')}`;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: 'easeOut' }}
      className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 p-5 flex flex-col h-full"
    >
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${accent}14`, color: accent }}
        >
          <Icon size={18} strokeWidth={2.2} />
        </div>
        {change && (
          <div
            className={cn(
              'flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0',
              positive ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'
            )}
          >
            {positive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {change}
          </div>
        )}
      </div>
      <p className="text-[13px] font-medium text-slate-500 flex-1">{label}</p>
      <div className="flex items-end justify-between gap-2 mt-1 shrink-0">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{value}</h2>
        <div className="w-20 h-9 -mb-1 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparkData} margin={{ top: 4, bottom: 0, left: 0, right: 0 }}>
              <defs>
                <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={accent} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={accent} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="v" stroke={accent} strokeWidth={2} fill={`url(#${gradId})`} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}

/* ---------------------------------- Section header ---------------------------------- */
function SectionHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 mb-6">
      <div>
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
        {subtitle && <p className="text-[13px] text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [apiData, setApiData] = useState<any>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<number>(30);
  const [dashboardMode, setDashboardMode] = useState<'live' | 'demo'>('live');

  const handleTimeRangeChange = (days: number) => {
    if (days === timeRange) return;
    setTimeRange(days);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 350);
  };

  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch insights and conversations in parallel
        const [insightsData, conversationsData] = await Promise.all([
          crmApi.getDashboardInsights({
            headers: { 'X-Skip-Loader': 'true' }
          }),
          crmApi.getConversations({
            headers: { 'X-Skip-Loader': 'true' }
          }).catch(err => {
            console.warn('[Dashboard] Failed to fetch conversations:', err);
            return [];
          })
        ]);

        if (active) {
          setApiData(insightsData);
          setConversations(conversationsData);
          setApiError(null);
        }
      } catch (err: any) {
        console.warn('[Dashboard] API insights load error:', err);
        if (active) {
          setApiError(err.message || 'Failed to fetch insights');
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };
    fetchData();
    return () => {
      active = false;
    };
  }, []);

  const statsFromApi = apiData?.stats || {};
  const heroCards = apiData?.hero_cards || {};
  const isLive = dashboardMode === 'live';
  const totalCampaigns = isLive ? (heroCards.campaigns_count ?? 0) : mockCampaigns.length;
  const directMessagesCount = (mockConversations || []).reduce((acc, conv) => acc + (conv.messages || []).length, 0);
  const campaignMessagesCount = mockCampaigns.reduce((acc, camp) => acc + camp.sent, 0);
  const totalMessagesLocal = directMessagesCount + campaignMessagesCount;

  // Use real count from API if available
  const totalSentMessages = statsFromApi.total_sent !== undefined ? statsFromApi.total_sent : (isLive ? 0 : totalMessagesLocal);
  const totalDelivered = statsFromApi.total_delivered !== undefined ? statsFromApi.total_delivered : (isLive ? 0 : mockCampaigns.reduce((a, c) => a + c.delivered, 0));
  const totalContacts = isLive ? (heroCards.total_contacts ?? 0) : contacts.length;
  const conversationsCount = isLive ? (heroCards.total_conversations ?? 0) : (mockConversations || []).length;
  const responseRate =
    heroCards.engagement_rate !== undefined
      ? `${heroCards.engagement_rate}%`
      : statsFromApi.read_rate !== undefined
        ? `${statsFromApi.read_rate}%`
        : isLive ? '0%' : '74.2%';
  const revenueGenerated = statsFromApi.revenue ?? heroCards.revenue ?? (isLive ? 0 : 184500);

  // 6 premium KPI cards (preserves live-data fallbacks)
  const kpis: {
    label: string;
    value: string;
    change: string;
    positive: boolean;
    icon: any;
    accent: string;
    spark: number[];
  }[] = [
    {
      label: 'Total Conversations',
      value: conversationsCount.toLocaleString(),
      change: isLive ? '0%' : '+12.4%',
      positive: true,
      icon: MessageSquare,
      accent: '#12263A',
      spark: isLive ? [0, 0, 0, 0, 0, 0, 0, conversationsCount] : [12, 18, 14, 22, 19, 28, 26, 34],
    },
    {
      label: 'Active Contacts',
      value: totalContacts.toLocaleString(),
      change: isLive ? '0%' : '+8.1%',
      positive: true,
      icon: Users,
      accent: '#166534',
      spark: isLive ? [0, 0, 0, 0, 0, 0, 0, totalContacts] : [20, 22, 21, 26, 30, 28, 33, 38],
    },
    {
      label: 'Campaigns Sent',
      value: totalCampaigns.toLocaleString(),
      change: isLive ? '0' : '+3',
      positive: true,
      icon: Send,
      accent: '#22C55E',
      spark: isLive ? [0, 0, 0, 0, 0, 0, 0, totalCampaigns] : [4, 6, 5, 8, 7, 9, 11, 12],
    },
    {
      label: 'Delivered Messages',
      value: Number(totalDelivered).toLocaleString(),
      change: isLive ? '0%' : '+15.2%',
      positive: true,
      icon: CheckCircle2,
      accent: '#166534',
      spark: isLive ? [0, 0, 0, 0, 0, 0, 0, totalDelivered] : [30, 34, 32, 40, 44, 42, 50, 56],
    },
    {
      label: 'Response Rate',
      value: responseRate,
      change: isLive ? '0%' : '+3.1%',
      positive: true,
      icon: Activity,
      accent: '#57534E',
      spark: isLive ? [0, 0, 0, 0, 0, 0, 0, parseFloat(responseRate) || 0] : [60, 62, 58, 66, 70, 68, 72, 74],
    },
    {
      label: 'Revenue Generated',
      value: isLive ? `$${revenueGenerated.toLocaleString()}` : `${(Number(revenueGenerated) / 1000).toFixed(1)}K`,
      change: isLive ? '0%' : '+22.2%',
      positive: true,
      icon: DollarSign,
      accent: '#12263A',
      spark: isLive ? [0, 0, 0, 0, 0, 0, 0, revenueGenerated] : [40, 48, 52, 60, 58, 70, 82, 96],
    },
  ];

  // Dynamic performance data mapping (unchanged logic)
  const activePerformanceData = (() => {
    if (dashboardMode === 'live') {
      const rawWeekly = apiData?.charts?.transmission_performance || apiData?.charts?.weekly_performance;
      if (Array.isArray(rawWeekly) && rawWeekly.length > 0) {
        return rawWeekly.map((item: any) => {
          let formattedName = item.day || item.date || '';
          if (typeof formattedName === 'string' && formattedName.includes('-')) {
            const parts = formattedName.split('-');
            if (parts.length === 3) {
              const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
              const day = parseInt(parts[2], 10);
              const monthIdx = parseInt(parts[1], 10) - 1;
              if (monthIdx >= 0 && monthIdx < 12) {
                formattedName = `${day} ${months[monthIdx]}`;
              }
            }
          }
          return {
            name: formattedName,
            reach: item.sent ?? item.reach ?? 0,
            engagement: item.reads ?? item.delivered ?? item.engagement ?? 0,
          };
        });
      }
      return [
        { name: 'Today', reach: heroCards.transmission_volume ?? totalSentMessages, engagement: heroCards.transmission_volume ? (statsFromApi.total_read ?? 0) : 0 },
      ];
    }

    return timeRange === 90
      ? [
          { name: '15 Mar', reach: 6000, engagement: 4200 },
          { name: '30 Mar', reach: 8500, engagement: 6100 },
          { name: '15 Apr', reach: 11000, engagement: 7900 },
          { name: '30 Apr', reach: 13500, engagement: 9500 },
          { name: '15 May', reach: 15400, engagement: 12200 },
          { name: '20 May', reach: 18900, engagement: 14800 },
        ]
      : performanceData;
  })();

  const categoryColorMap: Record<string, string> = {
    MARKETING: '#166534',
    UTILITY: '#22C55E',
    AUTHENTICATION: '#F59E0B',
    SERVICE: '#EC4899',
    OTHER: '#64748b',
  };

  const activeDistributionData = (() => {
    if (dashboardMode === 'live') {
      const rawCategories = apiData?.category_health?.items || apiData?.category_health?.categories;
      if (Array.isArray(rawCategories) && rawCategories.length > 0) {
        return rawCategories.map((c: any) => {
          const normCategory = String(c.category || '').toUpperCase();
          return {
            name: c.category || 'Other',
            value: c.count ?? c.total ?? 0,
            color: categoryColorMap[normCategory] || '#EC4899',
            percentage: c.percentage,
          };
        });
      }
      return [];
    }
    return distributionData;
  })();

  const totalDistributionNodes =
    dashboardMode === 'live'
      ? apiData?.category_health?.total ?? activeDistributionData.reduce((acc: number, item: any) => acc + item.value, 0)
      : 1200;

  const activeRecentActivity = (() => {
    if (dashboardMode === 'live') {
      const campaignsList = apiData?.campaigns;
      if (Array.isArray(campaignsList) && campaignsList.length > 0) {
        return campaignsList.map((item: any) => {
          const type = String(item.type || 'broadcast');
          const status = String(item.status || 'completed').toUpperCase();
          const engagement = item.efficiency ?? 100;

          let color = 'indigo';
          if (status === 'COMPLETED') color = 'emerald';
          else if (status === 'RUNNING' || status === 'ACTIVE') color = 'indigo';
          else color = 'amber';

          return {
            name: item.name || 'Untitled Campaign',
            subtitle: `${type.charAt(0).toUpperCase() + type.slice(1)} Campaign`,
            reach: (item.total_recipients ?? item.sent_count ?? 0).toLocaleString(),
            subReach: 'Total Recipients',
            engagement,
            status,
            color,
          };
        });
      }
      return [];
    }

    return [
      { name: 'Product Launch Announcement', subtitle: 'WhatsApp Broadcast', reach: '14,020', subReach: 'Total Recipients', engagement: 74, status: 'ACTIVE', color: 'indigo' },
      { name: 'Abandoned Cart Follow-Up', subtitle: 'Automated Flow', reach: '3,211', subReach: 'Total Recipients', engagement: 52, status: 'ACTIVE', color: 'emerald' },
      { name: 'VIP Customer Exclusive Offer', subtitle: 'Email Campaign', reach: '2,842', subReach: 'Total Recipients', engagement: 81, status: 'COMPLETED', color: 'indigo' },
      { name: 'Inactive Lead Re-engagement', subtitle: 'Drip Flow', reach: '1,105', subReach: 'Total Recipients', engagement: 44, status: 'SCHEDULED', color: 'amber' },
    ];
  })();

  const activePipelineStatus =
    dashboardMode === 'live'
      ? apiData?.campaigns?.length > 0
        ? `${apiData.campaigns.length} Active Campaigns`
        : apiData?.recent_activity?.length > 0
          ? `${apiData.recent_activity.length} Recent Activities`
          : 'Live Pipeline'
      : 'Active Pipeline';

  // Customer journey funnel (derived; uses live numbers where present)
  const baseLeads = totalContacts;
  const funnel = [
    { label: 'Lead Generated', icon: Megaphone, count: baseLeads, pct: 100 },
    { label: 'WhatsApp Contacted', icon: MessageSquare, count: conversationsCount, pct: baseLeads > 0 ? Math.round((conversationsCount / baseLeads) * 100) : 0 },
    { label: 'Conversation Started', icon: Radio, count: conversationsCount, pct: 100 },
    { label: 'Qualified Lead', icon: UserCheck, count: isLive ? (heroCards.leads_count ?? 0) : Math.round(baseLeads * 0.214), pct: isLive ? (baseLeads > 0 ? Math.round(((heroCards.leads_count ?? 0) / baseLeads) * 100) : 0) : 74.9 },
    { label: 'Appointment Booked', icon: CalendarCheck, count: isLive ? 0 : Math.round(baseLeads * 0.194), pct: isLive ? 0 : 90.7 },
    { label: 'Follow-Up', icon: Repeat, count: isLive ? 0 : Math.round(baseLeads * 0.158), pct: isLive ? 0 : 81.5 },
    { label: 'Customer Converted', icon: Award, count: isLive ? (heroCards.converted_count ?? 0) : Math.round(baseLeads * 0.066), pct: isLive ? (baseLeads > 0 ? Math.round(((heroCards.converted_count ?? 0) / baseLeads) * 100) : 0) : 85.4 },
  ];

  // Live conversations (uses real data when in live mode)
  const rawConversations = isLive ? conversations : mockConversations;
  const liveConversations = (rawConversations || []).slice(0, 6).map((c, i) => {
    // Generate readable time from timestamp
    let timeStr = '';
    if (c.lastMessage?.timestamp) {
      try {
        const diffMs = Date.now() - new Date(c.lastMessage.timestamp).getTime();
        const diffMins = Math.round(diffMs / 60000);
        if (diffMins < 1) {
          timeStr = 'Now';
        } else if (diffMins < 60) {
          timeStr = `${diffMins} min`;
        } else if (diffMins < 1440) {
          const hrs = Math.round(diffMins / 60);
          timeStr = `${hrs} ${hrs === 1 ? 'hr' : 'hrs'}`;
        } else {
          const days = Math.round(diffMins / 1440);
          timeStr = `${days} ${days === 1 ? 'd' : 'ds'}`;
        }
      } catch (e) {
        timeStr = 'Earlier';
      }
    } else {
      timeStr = ['Now', '1 min', '3 min', '5 min', '7 min', '12 min'][i] || 'Earlier';
    }

    const last = (() => {
      if (c.lastMessage?.type && c.lastMessage.type !== 'text') {
        const typeStr = c.lastMessage.type.charAt(0).toUpperCase() + c.lastMessage.type.slice(1);
        const icon = c.lastMessage.type === 'image' ? '📷 ' : c.lastMessage.type === 'video' ? '🎥 ' : c.lastMessage.type === 'audio' ? '🎵 ' : '📁 ';
        return `${icon}${typeStr}`;
      }
      return c.lastMessage?.content || 'No messages yet';
    })();

    return {
      id: c.id ?? String(i),
      name: c.contact?.name || 'Unknown Contact',
      last: last,
      time: timeStr,
      unread: c.unreadCount || 0,
      status: c.isOnline ? 'online' : (i % 3 === 0 ? 'online' : i % 3 === 1 ? 'pending' : 'offline'),
    };
  });

  const quickActions = [
    { label: 'Create Campaign', icon: Megaphone, accent: '#12263A', to: '/campaigns/create' },
    { label: 'Send Broadcast', icon: Send, accent: '#166534', to: '/campaigns/create' },
    { label: 'Import Contacts', icon: Upload, accent: '#57534E', to: '/contacts' },
    { label: 'Add Contact', icon: UserPlus, accent: '#22C55E', to: '/contacts/add' },
    { label: 'Create Template', icon: LayoutTemplate, accent: '#166534', to: '/templates/builder' },
    { label: 'AI Reply Assistant', icon: Bot, accent: '#12263A', to: '/inbox' },
  ];

  const statusDot = (s: string) =>
    s === 'online' ? 'bg-emerald-500' : s === 'pending' ? 'bg-amber-500' : 'bg-slate-300';

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-[13px] text-slate-500 mt-1">Track conversations, campaigns and conversions in real time.</p>
        </div>
        <div className="flex items-center gap-3">
          {isLoading && (
            <div className="flex items-center gap-2 text-[#166534] text-xs font-medium">
              <div className="w-3.5 h-3.5 border-2 border-[#166534] border-t-transparent rounded-full animate-spin" />
              Syncing
            </div>
          )}
          <div className="flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-xl shadow-xs">
            {[30, 90].map((d) => (
              <button
                key={d}
                onClick={() => handleTimeRangeChange(d)}
                className={cn(
                  'h-8 px-3.5 rounded-lg text-xs font-semibold transition-all cursor-pointer select-none',
                  timeRange === d
                    ? 'bg-[#166534] text-white shadow-xs'
                    : 'text-[#57534E] hover:text-[#12263A] hover:bg-[#F0FDF4]'
                )}
              >
                {d} Days
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => <KpiSkeleton key={i} />)
        ) : (
          kpis.map((k, i) => (
            <KpiCard
              key={k.label}
              label={k.label}
              value={k.value}
              change={k.change}
              positive={k.positive}
              icon={k.icon}
              accent={k.accent}
              spark={k.spark}
              index={i}
            />
          ))
        )}
      </div>

      {/* Customer Journey Funnel */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <SectionHeader
          title="Customer Journey"
          subtitle="From first contact to converted customer"
          action={
            <span className="px-3 py-1 rounded-full bg-[#F0FDF4] text-[#166534] border border-[#22C55E]/30 text-xs font-semibold">
              {activePipelineStatus}
            </span>
          }
        />
        <div className="flex items-stretch gap-2 overflow-x-auto pb-2 no-scrollbar">
          {funnel.map((step, i) => (
            <div key={step.label} className="flex items-center gap-2 shrink-0">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="w-36 bg-white hover:bg-[#FAFAF9] border border-[#e7e5e4] hover:border-[#166534]/30 hover:shadow-md rounded-2xl p-4 transition-all duration-300"
              >
                <div className="w-9 h-9 rounded-xl bg-[#F0FDF4] text-[#166534] flex items-center justify-center mb-3">
                  <step.icon size={17} />
                </div>
                <p className="text-[11px] font-medium text-slate-500 leading-tight h-7">{step.label}</p>
                <p className="text-xl font-bold text-slate-900 mt-1">{step.count.toLocaleString()}</p>
                {i > 0 && <p className="text-[11px] font-semibold text-emerald-600 mt-0.5">{step.pct}%</p>}
              </motion.div>
              {i < funnel.length - 1 && <ArrowRight size={16} className="text-slate-300 shrink-0" />}
            </div>
          ))}
        </div>
      </div>

      {/* Main grid: charts + live conversations */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Conversations Trend */}
        {isLoading ? (
          <div className="xl:col-span-2">
            <ChartSkeleton />
          </div>
        ) : (
          <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col min-h-[420px]">
            <SectionHeader
              title="Conversations Trend"
            subtitle="Reach vs engagement over time"
            action={
              <div className="flex items-center gap-4 text-xs font-medium">
                <span className="flex items-center gap-1.5 text-[#57534E]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#12263A]" /> Reach
                </span>
                <span className="flex items-center gap-1.5 text-[#57534E]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#166534]" /> Engagement
                </span>
              </div>
            }
          />
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activePerformanceData}>
                <defs>
                  <linearGradient id="colorReach" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#12263A" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#12263A" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorEngage" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#166534" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#166534" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e7e5e4" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#57534E' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#57534E' }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="reach" stroke="#12263A" strokeWidth={3} fillOpacity={1} fill="url(#colorReach)" name="Reach" />
                <Area type="monotone" dataKey="engagement" stroke="#166534" strokeWidth={3} fillOpacity={1} fill="url(#colorEngage)" name="Engagement" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        )}

        {/* Live Conversations Panel */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col min-h-[420px]">
          <div className="p-6 pb-4 flex items-center justify-between border-b border-slate-100">
            <div>
              <h3 className="text-base font-semibold text-slate-900">Live Conversations</h3>
              <p className="text-[13px] text-slate-500 mt-0.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Online
              </p>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-3">
            {liveConversations.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-6">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-300 mb-3">
                  <MessageSquare size={20} />
                </div>
                <p className="text-sm font-semibold text-slate-700">No live conversations</p>
                <p className="text-xs text-slate-400 mt-1">Active chats will appear here.</p>
              </div>
            ) : (
              liveConversations.map((c) => (
                <div
                  key={c.id}
                  onClick={() => navigate(`/inbox?select=${c.id}`)}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition-all group"
                >
                  <div className="relative shrink-0">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#12263A] to-[#166534] text-white flex items-center justify-center text-xs font-bold">
                      {c.name.substring(0, 1).toUpperCase()}
                    </div>
                    <span className={cn('absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white', statusDot(c.status))} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[13px] font-semibold text-[#12263A] truncate">{c.name}</p>
                      <span className="text-[11px] text-[#57534E] shrink-0">{c.time}</span>
                    </div>
                    <p className="text-xs text-[#57534E] truncate">{c.last}</p>
                  </div>
                  {c.unread > 0 && (
                    <span className="shrink-0 min-w-[18px] h-[18px] px-1 rounded-full bg-[#166534] text-white text-[10px] font-bold flex items-center justify-center">
                      {c.unread}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
          <div className="p-4 border-t border-slate-100">
            <button 
              onClick={() => navigate('/inbox')}
              className="w-full h-10 rounded-xl bg-white hover:bg-[#F0FDF4] border border-slate-200 hover:border-[#bbf7d0] text-xs font-bold text-[#12263A] hover:text-[#166534] transition-all flex items-center justify-center gap-1.5 shadow-xs active:scale-[0.98] cursor-pointer"
            >
              View all conversations <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <SectionHeader title="Quick Actions" subtitle="Jump into your most common workflows" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickActions.map((a) => (
            <button
              key={a.label}
              onClick={() => navigate(a.to)}
              className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-white hover:bg-[#F0FDF4]/50 border border-slate-200/90 hover:border-[#bbf7d0] shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 group cursor-pointer active:scale-95"
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-xs"
                style={{ backgroundColor: `${a.accent}14`, color: a.accent }}
              >
                <a.icon size={20} />
              </div>
              <span className="text-xs font-bold text-[#12263A] group-hover:text-[#166534] text-center leading-tight transition-colors">{a.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Campaign Performance + Contact Sources */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Campaign Performance Table */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 pb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-slate-900">Campaign Performance</h3>
              <p className="text-[13px] text-slate-500 mt-0.5">Real-time status of active campaigns</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[11px] font-semibold uppercase text-slate-400 tracking-wide border-y border-slate-100 bg-slate-50/50">
                  <th className="px-6 py-3">Campaign</th>
                  <th className="px-6 py-3">Reach</th>
                  <th className="px-6 py-3">Conversion</th>
                  <th className="px-6 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {activeRecentActivity.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center gap-3 max-w-sm mx-auto">
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-300">
                          <Activity size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-700">No active campaigns</p>
                          <p className="text-xs text-slate-400 mt-1">Deploy a campaign to start streaming performance data.</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  activeRecentActivity.map((row: any, idx: number) => (
                    <tr key={idx} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-all">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center', accentBg(row.color))}>
                            <Globe size={16} />
                          </div>
                          <div>
                            <p className="text-[13px] font-semibold text-slate-900">{row.name}</p>
                            <p className="text-[11px] text-slate-400">{row.subtitle}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-[13px] font-bold text-slate-900">{row.reach}</p>
                        <p className="text-[11px] text-slate-400">{row.subReach}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1.5 w-36">
                          <div className="flex items-center justify-between text-[11px] font-medium">
                            <span className="text-slate-400">Efficiency</span>
                            <span className="text-slate-900 font-semibold">{row.engagement}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${row.engagement}%` }}
                              transition={{ duration: 1.2, delay: idx * 0.1 }}
                              className={cn('h-full rounded-full', accentBar(row.color))}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg">
                          <span className={cn('w-1.5 h-1.5 rounded-full', accentBar(row.color))} />
                          <span className="text-[11px] font-semibold text-slate-600">{row.status}</span>
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-slate-100 flex justify-center">
            <button 
              onClick={() => navigate('/campaigns')}
              className="w-full sm:w-auto h-10 px-5 rounded-xl bg-white hover:bg-[#F0FDF4] border border-slate-200 hover:border-[#bbf7d0] text-xs font-bold text-[#12263A] hover:text-[#166534] transition-all flex items-center justify-center gap-1.5 shadow-xs active:scale-[0.98] cursor-pointer"
            >
              View all campaigns <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Contact Sources (Pie) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
          <SectionHeader title="Contact Sources" subtitle="Allocation by category" />
          <div className="relative flex-1 min-h-[220px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={activeDistributionData} cx="50%" cy="50%" innerRadius={62} outerRadius={84} paddingAngle={4} dataKey="value">
                  {activeDistributionData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-900">
                  {totalDistributionNodes >= 1000 ? `${(totalDistributionNodes / 1000).toFixed(1)}K` : totalDistributionNodes}
                </p>
                <p className="text-[11px] font-medium text-slate-400">Total</p>
              </div>
            </div>
          </div>
          <div className="space-y-3 pt-5 mt-2 border-t border-slate-100">
            {activeDistributionData.map((item: any, i: number) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[13px] font-medium text-slate-600">{item.name}</span>
                </div>
                <span className="text-[13px] font-semibold text-slate-900">
                  {item.percentage !== undefined
                    ? `${item.percentage}%`
                    : totalDistributionNodes > 0
                      ? `${((item.value / totalDistributionNodes) * 100).toFixed(0)}%`
                      : '0%'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue Trend */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col min-h-[300px]">
        <SectionHeader title="Revenue Trend" subtitle="Generated revenue across the period" />
        <div className="flex-1 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={activePerformanceData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="reach" stroke="#166534" strokeWidth={3} dot={false} name="Revenue" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

/* color helpers (static class strings for tailwind JIT safety) */
function accentBg(c: string) {
  if (c === 'emerald') return 'bg-[#F0FDF4] text-[#166534]';
  if (c === 'indigo') return 'bg-[#F0FDF4] text-[#166534]';
  if (c === 'amber') return 'bg-amber-50 text-amber-600';
  return 'bg-rose-50 text-rose-600';
}

function accentBar(c: string) {
  if (c === 'emerald') return 'bg-[#22C55E]';
  if (c === 'indigo') return 'bg-[#166534]';
  if (c === 'amber') return 'bg-amber-500';
  return 'bg-rose-500';
}
