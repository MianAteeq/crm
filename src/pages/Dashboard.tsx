import { useState, useEffect } from 'react';
import { crmApi } from '../services/crmApi';
import { 
  Users, 
  MessageSquare, 
  Layout, 
  CheckCircle2,
  TrendingUp,
  BarChart3,
  Calendar,
  Clock,
  Shield,
  Zap,
  ArrowUpRight,
  MousePointer2,
  Globe,
  Mail,
  Smartphone,
  Sparkles,
  Search,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { mockCampaigns } from '../data/mockCampaigns';
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
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
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
  { name: 'Marketing', value: 400, color: '#6366f1' },
  { name: 'Utility', value: 300, color: '#10b981' },
  { name: 'Authentication', value: 300, color: '#f59e0b' },
  { name: 'Service', value: 200, color: '#ec4899' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-white/10 p-4 rounded-2xl shadow-xl backdrop-blur-xl">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">{label}</p>
        <div className="space-y-1">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <p className="text-xs font-black text-white uppercase flex justify-between gap-4">
                <span>{entry.name}:</span>
                <span className="text-indigo-400">{entry.value.toLocaleString()}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const [apiData, setApiData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<number>(30);
  const [dashboardMode, setDashboardMode] = useState<'live' | 'demo'>('live');

  const handleTimeRangeChange = (days: number) => {
    if (days === timeRange) return;
    setTimeRange(days);
    setIsLoading(true);
    const t = setTimeout(() => {
      setIsLoading(false);
    }, 350);
  };

  useEffect(() => {
    let active = true;
    const fetchInsights = async () => {
      try {
        setIsLoading(true);
        const data = await crmApi.getDashboardInsights();
        if (active) {
          setApiData(data);
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
    fetchInsights();
    return () => { active = false; };
  }, []);

  const statsFromApi = apiData?.stats || {};
  const heroCards = apiData?.hero_cards || {};
  const totalCampaigns = mockCampaigns.length;
  const directMessagesCount = (mockConversations || []).reduce((acc, conv) => acc + (conv.messages || []).length, 0);
  const campaignMessagesCount = mockCampaigns.reduce((acc, camp) => acc + camp.sent, 0);
  const totalMessagesLocal = directMessagesCount + campaignMessagesCount;
  
  // Use real count from API if available
  const totalSentMessages = statsFromApi.total_sent ?? totalMessagesLocal;
  const totalContacts = contacts.length;

  const stats = [
    { 
      label: 'Network Reach', 
      value: (dashboardMode === 'live' 
        ? (heroCards.network_reach !== undefined ? heroCards.network_reach : totalContacts)
        : 1248).toLocaleString(), 
      change: '', 
      icon: Users, 
      color: 'text-indigo-500', 
      bg: 'bg-indigo-500/5' 
    },
    { 
      label: 'Strategic Ops', 
      value: (dashboardMode === 'live' 
        ? (heroCards.strategic_ops !== undefined ? heroCards.strategic_ops : totalCampaigns)
        : 12).toString(), 
      change: dashboardMode === 'live' ? 'Active Campaigns' : '+2', 
      icon: Zap, 
      color: 'text-amber-500', 
      bg: 'bg-amber-500/5' 
    },
    { 
      label: 'Engagement Rate', 
      value: dashboardMode === 'live' 
        ? (heroCards.engagement_rate !== undefined ? `${heroCards.engagement_rate}%` : (statsFromApi.read_rate !== undefined ? `${statsFromApi.read_rate}%` : '0%'))
        : '74.2%', 
      change: dashboardMode === 'live' ? 'Live Engagement' : '+3.1%', 
      icon: MousePointer2, 
      color: 'text-rose-500', 
      bg: 'bg-rose-500/5' 
    },
  ];

  // Dynamic performance data mapping
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
            engagement: item.reads ?? item.delivered ?? item.engagement ?? 0
          };
        });
      }
      // Live mode empty fallback point
      return [{ name: 'Today', reach: heroCards.transmission_volume ?? totalSentMessages, engagement: heroCards.transmission_volume ? (statsFromApi.total_read ?? 0) : 0 }];
    }

    // Demo / fallback mode timeline
    return timeRange === 90 ? [
      { name: '15 Mar', reach: 6000, engagement: 4200 },
      { name: '30 Mar', reach: 8500, engagement: 6100 },
      { name: '15 Apr', reach: 11000, engagement: 7900 },
      { name: '30 Apr', reach: 13500, engagement: 9500 },
      { name: '15 May', reach: 15400, engagement: 12200 },
      { name: '20 May', reach: 18900, engagement: 14800 },
    ] : [
      { name: '01 May', reach: 4000, engagement: 2400 },
      { name: '05 May', reach: 3000, engagement: 1398 },
      { name: '10 May', reach: 2000, engagement: 9800 },
      { name: '15 May', reach: 2780, engagement: 3908 },
      { name: '20 May', reach: 1890, engagement: 4800 },
      { name: '25 May', reach: 2390, engagement: 3800 },
      { name: '30 May', reach: 3490, engagement: 4300 },
    ];
  })();

  const categoryColorMap: Record<string, string> = {
    'MARKETING': '#6366f1',
    'UTILITY': '#10b981',
    'AUTHENTICATION': '#f59e0b',
    'SERVICE': '#ec4899',
    'OTHER': '#64748b'
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
            color: categoryColorMap[normCategory] || '#ec4899',
            percentage: c.percentage
          };
        });
      }
      return [];
    }

    return distributionData; // local fallback mock
  })();

  const totalDistributionNodes = dashboardMode === 'live'
    ? (apiData?.category_health?.total ?? activeDistributionData.reduce((acc: number, item: any) => acc + item.value, 0))
    : 1200;

  const activeRecentActivity = (() => {
    if (dashboardMode === 'live') {
      const campaignsList = apiData?.campaigns;
      if (Array.isArray(campaignsList) && campaignsList.length > 0) {
        return campaignsList.map((item: any) => {
          const type = String(item.type || 'broadcast').toUpperCase();
          const status = String(item.status || 'completed').toUpperCase();
          const engagement = item.efficiency ?? 100;
          
          let color = 'indigo';
          if (status === 'COMPLETED') color = 'emerald';
          else if (status === 'RUNNING' || status === 'ACTIVE') color = 'indigo';
          else color = 'amber';

          return {
            name: item.name || 'Untitled Campaign',
            subtitle: `${type} Deployment`,
            reach: (item.total_recipients ?? item.sent_count ?? 0).toLocaleString(),
            subReach: 'Total Recipients',
            engagement,
            status,
            color
          };
        });
      }

      const rawRecent = apiData?.recent_activity;
      if (Array.isArray(rawRecent) && rawRecent.length > 0) {
        return rawRecent.map((item: any) => {
          const status = String(item.status || 'read').toUpperCase();
          const engagement = status === 'READ' ? 100 : (status === 'DELIVERED' ? 75 : 50);
          let color = 'indigo';
          if (status === 'READ') color = 'emerald';
          else if (status === 'DELIVERED') color = 'indigo';
          else color = 'amber';

          return {
            name: item.template_name || 'Verification Ping',
            subtitle: `To +${item.recipient || 'Recipient'}`,
            reach: '1 Message',
            subReach: item.sent_at || 'Recently',
            engagement,
            status,
            color
          };
        });
      }

      return [];
    }

    // Default beautiful mock campaigns/strategic deployments
    return [
      { name: 'Summer Solstice VIP Sale', subtitle: 'Manual Deployment', reach: '14,020', subReach: 'Total Recipients', engagement: 74, status: 'TRANSMITTING', color: 'indigo' },
      { name: 'Abandoned Cart Recovery', subtitle: 'Manual Deployment', reach: '3,211', subReach: 'Total Recipients', engagement: 52, status: 'STANDBY', color: 'emerald' },
      { name: 'New Product Launch Teaser', subtitle: 'Manual Deployment', reach: '2,842', subReach: 'Total Recipients', engagement: 81, status: 'QUEUED', color: 'amber' },
      { name: 'Customer Reactivation Protocol', subtitle: 'Manual Deployment', reach: '1,105', subReach: 'Total Recipients', engagement: 44, status: 'OPTIMIZING', color: 'rose' },
    ];
  })();

  const activeConnectedClusters = dashboardMode === 'live'
    ? (apiData?.campaigns?.length > 0
       ? `${apiData.campaigns.length} Active Deployments`
       : (apiData?.recent_activity?.length > 0 
          ? `${apiData.recent_activity.length} Signals Active` 
          : '0 Node Clusters Active'))
    : '4 Node Clusters Active';

  const activeAlert = apiData?.alerts?.[0] || {
    title: 'Strategic Automation Upgrade Available',
    description: 'Deploy neural-optimization models to increase category conversion by up to 24%.',
    action: 'Activate Intelligence',
    type: 'upgrade'
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      {/* Header Insights */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-indigo-500/10 text-indigo-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-indigo-500/20">Operational Intelligence</span>
          </div>
          <h1 className="text-5xl font-black text-slate-950 tracking-tighter leading-none">Global Insights</h1>
        </div>
        <div className="flex flex-wrap items-center gap-4">
           {isLoading && (
              <div className="flex items-center gap-2 text-indigo-500 text-xs font-bold uppercase tracking-wider">
                 <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                 <span>Syncing...</span>
              </div>
           )}


           
           <div className="premium-card bg-white px-6 py-3 flex items-center gap-4 border-slate-100/50">
              <div className="text-right">
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">System Time</p>
                 <p className="text-xs font-black text-slate-900 uppercase">Q2 SERVER TIME</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                 <Clock size={18} />
              </div>
           </div>
        </div>
      </div>

      {/* Main Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1, duration: 0.5, ease: "circOut" }}
            className="group relative bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-premium hover:shadow-floating transition-all duration-500 overflow-hidden"
          >
            <div className={cn("absolute top-0 right-0 w-32 h-32 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-20 transition-opacity", stat.bg.replace('/5', '/20'))} />
            
            <div className="flex items-start justify-between mb-8 relative z-10">
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6", stat.bg, stat.color)}>
                <stat.icon size={24} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col items-end">
                {stat.change && (
                  <div className="flex items-center gap-1 text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                    <ArrowUpRight size={10} />
                    {stat.change}
                  </div>
                )}
              </div>
            </div>
            
            <div className="relative z-10">
              <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
              <h2 className="text-4xl font-black text-slate-950 tracking-tighter">{stat.value}</h2>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Primary Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Performance Chart */}
        <div className="lg:col-span-8 premium-card p-10 flex flex-col min-h-[600px] border-slate-100/80 bg-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <h3 className="text-2xl font-black text-slate-950 tracking-tight">Transmission Performance</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.15em] mt-2">Real-time engagement vs reach metrics</p>
            </div>
            <div className="flex items-center gap-2 p-1 bg-slate-50 border border-slate-100 rounded-2xl">
               <button 
                  onClick={() => handleTimeRangeChange(30)}
                  className={cn(
                    "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                    timeRange === 30 
                      ? "bg-white shadow-sm border border-slate-200 text-slate-900" 
                      : "text-slate-400 hover:text-slate-950"
                  )}
               >
                 30 Days
               </button>
               <button 
                  onClick={() => handleTimeRangeChange(90)}
                  className={cn(
                    "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                    timeRange === 90 
                      ? "bg-white shadow-sm border border-slate-200 text-slate-900" 
                      : "text-slate-400 hover:text-slate-950"
                  )}
               >
                 90 Days
               </button>
            </div>
          </div>
          
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activePerformanceData}>
                <defs>
                   <linearGradient id="colorReach" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                     <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                   </linearGradient>
                   <linearGradient id="colorEngage" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                     <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                   </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="reach" 
                  stroke="#6366f1" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorReach)" 
                  name="Total Reach"
                />
                <Area 
                  type="monotone" 
                  dataKey="engagement" 
                  stroke="#10b981" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorEngage)" 
                  name="Engagement"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Reach Distribution */}
        <div className="lg:col-span-4 flex flex-col gap-8">
           <div className="premium-card p-10 flex flex-col bg-slate-900 border-white/5 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2" />
              
              <div className="relative z-10 mb-8">
                <h3 className="text-xl font-black tracking-tight">Category Health</h3>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">Resource allocation by type</p>
              </div>

              <div className="flex-1 min-h-[250px] relative z-10 flex items-center justify-center">
                 {activeDistributionData.length > 0 ? (
                   <>
                     <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                           <Pie
                              data={activeDistributionData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={8}
                              dataKey="value"
                           >
                              {activeDistributionData.map((entry: any, index: number) => (
                                 <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                           </Pie>
                           <Tooltip />
                        </PieChart>
                     </ResponsiveContainer>
                     <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="text-center">
                           <p className="text-2xl font-black tracking-tight font-sans text-white">
                             {totalDistributionNodes >= 1000 
                               ? `${(totalDistributionNodes / 1000).toFixed(1)}K` 
                               : totalDistributionNodes}
                           </p>
                           <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Total Nodes</p>
                        </div>
                     </div>
                   </>
                 ) : (
                    <div className="text-center p-6 border border-white/5 bg-white/5 rounded-3xl max-w-[200px] mx-auto">
                       <p className="text-xs font-black tracking-wide text-white uppercase">Waiting on Telemetry</p>
                       <p className="text-[10px] text-slate-400 font-medium mt-1">Deploy campaign templates to resolve system health.</p>
                    </div>
                 )}
              </div>

              <div className="space-y-4 pt-8 border-t border-white/10 relative z-10">
                 {activeDistributionData.length > 0 ? (
                    activeDistributionData.map((item: any, i: number) => (
                       <div key={i} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                             <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.name}</span>
                          </div>
                          <span className="text-xs font-black">
                            {item.percentage !== undefined 
                              ? `${item.percentage}%` 
                              : (totalDistributionNodes > 0 
                                 ? `${((item.value / totalDistributionNodes) * 100).toFixed(0)}%` 
                                 : '0%')}
                          </span>
                       </div>
                    ))
                 ) : (
                    <p className="text-[10px] text-slate-500 font-black tracking-widest uppercase text-center py-2">No Category allocations</p>
                 )}
              </div>
           </div>

           <div className="premium-card p-8 bg-indigo-600 border-indigo-500 text-white shadow-xl shadow-indigo-600/20 group cursor-pointer relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
              <div className="flex items-center justify-between mb-6 relative z-10">
                 <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white">
                    <Sparkles size={24} />
                 </div>
                 <ArrowUpRight size={20} className="text-white/40 group-hover:text-white transition-all transform group-hover:-translate-y-1 group-hover:translate-x-1" />
              </div>
              <h4 className="text-lg font-black tracking-tight relative z-10 leading-tight">{activeAlert.title}</h4>
              <p className="text-xs font-medium text-indigo-100 mt-2 relative z-10">{activeAlert.description}</p>
              
              <div className="mt-8 flex items-center gap-3 relative z-10">
                 <button className="flex-1 py-3 bg-white text-indigo-600 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg">{activeAlert.action}</button>
              </div>
           </div>
        </div>
      </div>

      {/* Recent High-Traffic Campaigns */}
      <div className="premium-card bg-white border-slate-100 min-h-[400px] overflow-hidden flex flex-col">
         <div className="p-10 border-b border-slate-50 flex items-center justify-between">
            <div>
               <h3 className="text-2xl font-black text-slate-950 tracking-tight">Active Strategic Deployments</h3>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.15em] mt-2">Real-time status of high-impact traffic vectors</p>
            </div>
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-full">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                  <span className="text-[9px] font-black text-slate-950 uppercase tracking-widest">
                    {activeConnectedClusters}
                  </span>
               </div>
            </div>
         </div>
         
         <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] border-b border-slate-50">
                  <th className="px-10 py-6">Strategy Module</th>
                  <th className="px-10 py-6">Reach Magnitude</th>
                  <th className="px-10 py-6">Engagement Sync</th>
                  <th className="px-10 py-6 text-right">Integrity Status</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {activeRecentActivity.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-10 py-24 text-center">
                      <div className="flex flex-col items-center justify-center gap-4 max-w-sm mx-auto">
                        <div className="w-14 h-14 rounded-2.5xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                          <Activity size={24} className="stroke-[1.5]" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-950 tracking-tight">No Active Deployments Found</p>
                          <p className="text-xs font-medium text-slate-400 mt-1">There are no recent transmissions or campaigns stored in the live database. Deploy a campaign template to stream telemetry.</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  activeRecentActivity.map((row, idx) => (
                  <tr key={idx} className="group border-b border-slate-50 last:border-b-0 hover:bg-slate-50/50 transition-all">
                    <td className="px-10 py-8">
                       <div className="flex items-center gap-4">
                          <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-all", 
                             statusColors(row.color)
                          )}>
                             <Globe size={20} />
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-950 tracking-tight">{row.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{row.subtitle}</p>
                          </div>
                       </div>
                    </td>
                    <td className="px-10 py-8">
                       <p className="text-lg font-black text-slate-950 tracking-tighter">{row.reach}</p>
                       <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">{row.subReach}</p>
                    </td>
                    <td className="px-10 py-8">
                       <div className="space-y-3">
                          <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                             <span className="text-slate-400">Efficiency</span>
                             <span className="text-slate-950">{row.engagement}%</span>
                          </div>
                          <div className="w-48 h-2 bg-slate-100 rounded-full overflow-hidden">
                             <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: `${row.engagement}%` }}
                               transition={{ duration: 1.5, delay: idx * 0.1 }}
                               className={cn("h-full rounded-full shadow-inner", 
                                 row.color === 'emerald' ? 'bg-emerald-500' : 
                                 row.color === 'indigo' ? 'bg-indigo-500' : 'bg-amber-500'
                               )} 
                             />
                          </div>
                       </div>
                    </td>
                    <td className="px-10 py-8 text-right">
                       <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-2xl shadow-sm">
                          <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", 
                            row.color === 'emerald' ? 'bg-emerald-500' : 
                            row.color === 'indigo' ? 'bg-indigo-500' : 'bg-amber-500'
                          )} />
                          <span className="text-[10px] font-black text-slate-950 uppercase tracking-widest">{row.status}</span>
                       </div>
                    </td>
                  </tr>
                  ))
                )}
              </tbody>
            </table>
         </div>
         <div className="p-8 bg-slate-50/50 border-t border-slate-50 flex justify-center">
            <button className="text-[10px] font-black text-slate-400 hover:text-indigo-600 uppercase tracking-[0.3em] transition-all flex items-center gap-2">
               View Full Strategy Deployment Logs
               <ArrowUpRight size={14} />
            </button>
         </div>
      </div>
    </div>
  );
}

// Helper to determine tailwind background/text colors dynamically safely
function statusColors(c: string) {
  if (c === 'emerald') return 'bg-emerald-50 text-emerald-500 group-hover:scale-110 group-hover:rotate-3';
  if (c === 'indigo') return 'bg-indigo-50 text-indigo-500 group-hover:scale-110 group-hover:rotate-3';
  if (c === 'amber') return 'bg-amber-50 text-amber-500 group-hover:scale-110 group-hover:rotate-3';
  return 'bg-rose-50 text-rose-500 group-hover:scale-110 group-hover:rotate-3';
}
