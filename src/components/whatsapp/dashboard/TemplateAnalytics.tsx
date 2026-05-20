import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  AreaChart, 
  Area 
} from 'recharts';
import { Send, CheckCircle, MousePointer2, MessageSquare, TrendingUp, TrendingDown, Activity, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../../lib/utils';
import { whatsappApi } from '../../../services/whatsappApi';

export default function TemplateAnalytics() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [performanceData, setPerformanceData] = useState<any>(null);
  const [timeFilter, setTimeFilter] = useState<'D' | 'W' | 'M' | 'Y'>('W');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const daysMap: Record<string, number> = { 'D': 1, 'W': 7, 'M': 30, 'Y': 365 };
        const days = daysMap[timeFilter] || 7;
        const data = await whatsappApi.fetchPerformanceInsights(days);
        setPerformanceData(data);
      } catch (err: any) {
        console.error('Error fetching performance insights:', err);
        setError(err.message || 'Failed to load performance insights');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [timeFilter]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-10 h-10 text-slate-900 animate-spin" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Analyzing Performance...</p>
      </div>
    );
  }

  // Fallback to mock data if API fails or is empty, to keep the UI beautiful
  const rawWeeklyPerf = performanceData?.charts?.weekly_performance;
  const chartData = Array.isArray(rawWeeklyPerf) && rawWeeklyPerf.length > 0
    ? rawWeeklyPerf.map((item: any) => ({
        name: item.day || item.name || item.date || '',
        sent: item.sent ?? 0,
        delivered: item.delivered ?? 0,
        opened: item.opened ?? item.reads ?? item.delivered ?? 0,
        replied: item.replied ?? 0,
      }))
    : [
        { name: 'Mon', sent: 0, delivered: 0, opened: 0, replied: 0 },
        { name: 'Tue', sent: 0, delivered: 0, opened: 0, replied: 0 },
        { name: 'Wed', sent: 0, delivered: 0, opened: 0, replied: 0 },
        { name: 'Thu', sent: 0, delivered: 0, opened: 0, replied: 0 },
        { name: 'Fri', sent: 0, delivered: 0, opened: 0, replied: 0 },
        { name: 'Sat', sent: 0, delivered: 0, opened: 0, replied: 0 },
        { name: 'Sun', sent: 0, delivered: 0, opened: 0, replied: 0 },
      ];

  const summaryStats = [
    { 
      label: 'Delivered', 
      value: performanceData?.stats?.total_delivered?.toLocaleString() || '0', 
      change: '+0%', 
      trend: 'up' as const, 
      icon: Send, 
      color: 'emerald' 
    },
    { 
      label: 'Open Rate', 
      value: `${performanceData?.stats?.read_rate || 0}%`, 
      change: '+0%', 
      trend: 'up' as const, 
      icon: CheckCircle, 
      color: 'blue' 
    },
    { 
      label: 'Read Count', 
      value: performanceData?.stats?.read_rate ? Math.round((performanceData.stats.read_rate / 100) * (performanceData.stats.total_sent || 0)).toLocaleString() : '0', 
      change: '0%', 
      trend: 'up' as const, 
      icon: MousePointer2, 
      color: 'purple' 
    },
    { 
      label: 'Replies', 
      value: performanceData?.stats?.replies?.toLocaleString() || '0', 
      change: '+0%', 
      trend: 'up' as const, 
      icon: MessageSquare, 
      color: 'amber' 
    },
  ];

  const topTemplatesData = (performanceData?.top_templates || []).map((t: any, idx: number) => {
    const name = t.template_name || t.name || 'Untitled Template';
    const category = t.category || 'UTILITY';
    const sent = t.sent ?? 0;
    
    // Support read_rate percentages and numerical openRates
    const openRate = t.read_rate !== undefined ? `${t.read_rate}%` : (t.openRate !== undefined ? t.openRate : '0%');
    
    // Support ctaRate percentages or fallback to replies rate
    const ctaRate = t.ctaRate !== undefined ? t.ctaRate : (t.replies !== undefined ? `${t.replies}%` : '0%');
    
    // Map status nicely to appropriate colors
    const rawStatus = String(t.status || 'STABLE').toUpperCase();
    let statusCategory: 'HIGH' | 'STABLE' | 'LOW' = 'STABLE';
    if (rawStatus === 'EXCELLENT' || rawStatus === 'HIGH' || rawStatus === 'APPROVED' || rawStatus === 'ACTIVE') {
      statusCategory = 'HIGH';
    } else if (rawStatus === 'GOOD' || rawStatus === 'STABLE') {
      statusCategory = 'STABLE';
    } else {
      statusCategory = 'LOW';
    }

    return {
      key: `${name}-${idx}`,
      name,
      category,
      sent,
      openRate,
      ctaRate,
      statusLabel: t.status ? String(t.status).toUpperCase() : 'STABLE',
      statusCategory
    };
  });

  return (
    <div className="space-y-10">
      {/* AI Insights & Summary Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden flex flex-col justify-center"
        >
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                <Activity size={20} className="text-blue-400" />
              </div>
              <h2 className="text-xl font-black uppercase tracking-widest text-slate-400">Campaign Health</h2>
            </div>
            <h1 className="text-3xl font-black leading-[1.1] mb-6 max-w-xl">
              Overall Quality Score is <span className={cn(
                performanceData?.hero_insight?.quality_score === 'Needs Improvement' ? 'text-amber-400' : 'text-emerald-400'
              )}>"{performanceData?.hero_insight?.quality_score || 'Calculating...'}"</span>
            </h1>
            <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-lg mb-8">
              {performanceData?.category_health?.alert || "Keep track of your message performance across different categories to optimize user engagement."}
            </p>
            <div className="flex gap-4">
              <button className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-100 transition-all">Export Report</button>
              <button className="px-8 py-4 bg-white/10 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-white/20 transition-all border border-white/10">Manage Limits</button>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-emerald-500 rounded-[3rem] p-10 text-white flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-10">
              <TrendingUp size={24} />
            </div>
            <h3 className="text-lg font-black text-emerald-100 uppercase tracking-widest mb-1">Delivery Rate</h3>
            <p className="text-5xl font-black">{performanceData?.stats?.delivery_rate || 0}%</p>
          </div>
          <div className="pt-8 border-t border-white/20">
            <p className="text-xs font-bold text-emerald-100 uppercase tracking-[0.2em]">Status: {performanceData?.hero_insight?.quality_score || 'Standard'}</p>
          </div>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all group"
          >
            <div className="flex justify-between items-start mb-10">
              <div className={cn(
                "p-4 rounded-2xl transition-transform group-hover:scale-110",
                stat.color === 'emerald' ? "bg-emerald-50 text-emerald-600" :
                stat.color === 'blue' ? "bg-blue-50 text-blue-600" :
                stat.color === 'purple' ? "bg-purple-50 text-purple-600" : "bg-amber-50 text-amber-600"
              )}>
                <stat.icon size={22} />
              </div>
              <div className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider",
                stat.trend === 'up' ? 'text-emerald-600 bg-emerald-50 border border-emerald-100' : 'text-rose-600 bg-rose-50 border border-rose-100'
              )}>
                {stat.trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {stat.change}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black text-slate-900 leading-none">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2 bg-white rounded-[3rem] p-10 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-12">
             <div>
               <h3 className="text-lg font-black text-slate-900 tracking-tight leading-none mb-2">Message Volume</h3>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Last 7 Days Performance</p>
             </div>
             <div className="flex gap-2">
                {['D', 'W', 'M', 'Y'].map((t: any) => (
                  <button 
                    key={t}
                    onClick={() => setTimeFilter(t)}
                    className={cn(
                      "w-10 h-10 rounded-xl text-[10px] font-black flex items-center justify-center transition-all cursor-pointer",
                      timeFilter === t ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20' : 'text-slate-400 hover:bg-slate-50'
                    )}
                  >
                    {t}
                  </button>
                ))}
             </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorOpened" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 900 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 900 }} dx={-10} />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '24px', 
                    border: 'none', 
                    boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)',
                    fontSize: '12px',
                    fontWeight: 'black',
                    padding: '16px'
                  }} 
                />
                <Area type="monotone" dataKey="sent" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorSent)" />
                <Area type="monotone" dataKey="opened" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorOpened)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="bg-white rounded-[3rem] p-10 border border-slate-200 shadow-sm flex flex-col">
           <div className="mb-10">
              <h3 className="text-lg font-black text-slate-900 tracking-tight leading-none mb-2">Category Health</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Distribution Score</p>
           </div>
           
           <div className="space-y-8 flex-1 flex flex-col justify-center">
              {(performanceData?.category_health?.categories || [
                { category: 'MARKETING', score: 0 },
                { category: 'UTILITY', score: 0 },
                { category: 'AUTHENTICATION', score: 0 },
              ]).map((cat: any) => (
                <div key={cat.category} className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{cat.category}</span>
                    <span className="text-xs font-black text-slate-900">{cat.score}%</span>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${cat.score}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className={cn(
                        "h-full rounded-full transition-all", 
                        cat.score >= 80 ? "bg-emerald-500" : 
                        cat.score >= 50 ? "bg-amber-500" : "bg-rose-500"
                      )} 
                    />
                  </div>
                </div>
              ))}
           </div>

           <div className="mt-10 pt-10 border-t border-slate-100">
              <div className={cn(
                "flex items-center gap-3 p-4 border rounded-2xl",
                performanceData?.category_health?.alert?.toLowerCase().includes('drop') || performanceData?.category_health?.alert?.toLowerCase().includes('improvement')
                  ? "bg-amber-50 border-amber-100 text-amber-900"
                  : "bg-blue-50 border-blue-100 text-blue-900"
              )}>
                 <AlertCircle className={cn(
                   performanceData?.category_health?.alert?.toLowerCase().includes('drop') || performanceData?.category_health?.alert?.toLowerCase().includes('improvement')
                     ? "text-amber-500"
                     : "text-blue-500"
                 )} size={18} />
                 <p className="text-[11px] font-bold leading-tight">
                   {performanceData?.category_health?.alert || "System operating within optimal parameters. All templates status: HIGH."}
                 </p>
              </div>
           </div>
        </section>
      </div>

      {/* Top Templates Performance */}
      <section className="bg-white rounded-[3rem] border border-slate-200 overflow-hidden shadow-xl shadow-slate-200/20">
         <div className="px-10 py-10 border-b border-slate-100 bg-white">
            <div className="flex items-center justify-between">
               <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight mb-1">Top Performing Templates</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ranked by overall engagement index</p>
               </div>
               <button className="px-6 py-3 bg-slate-50 text-slate-900 rounded-xl font-black uppercase tracking-widest text-[9px] hover:bg-slate-100 transition-all">Export Report</button>
            </div>
         </div>
         <table className="w-full text-left">
            <thead>
               <tr className="bg-slate-50/50">
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Template Name</th>
                  <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Sends</th>
                  <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Open Rate</th>
                  <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">CTA Click</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Quality</th>
               </tr>
            </thead>
            <tbody>
               {topTemplatesData.map((template, i) => (
                  <tr key={template.key || template.name || i} className="border-t border-slate-100 hover:bg-slate-50/50 transition-colors">
                     <td className="px-10 py-6">
                        <div className="flex items-center gap-3">
                           <div className={cn(
                             "w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs",
                             template.statusCategory === 'HIGH' ? "bg-emerald-50 text-emerald-600" : 
                             template.statusCategory === 'STABLE' ? "bg-blue-50 text-blue-600" : "bg-rose-50 text-rose-600"
                           )}>
                              {i + 1}
                           </div>
                           <div>
                              <p className="text-sm font-black text-slate-900 font-mono tracking-tight">{template.name}</p>
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{template.category}</p>
                           </div>
                        </div>
                     </td>
                     <td className="px-6 py-6 font-black text-slate-900 text-sm">{template.sent}</td>
                     <td className="px-6 py-6 font-black text-slate-900 text-sm">{template.openRate}</td>
                     <td className="px-6 py-6 font-black text-slate-900 text-sm">{template.ctaRate}</td>
                     <td className="px-10 py-6">
                        <div className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border",
                          template.statusCategory === 'HIGH' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                          template.statusCategory === 'STABLE' ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-rose-50 text-rose-600 border-rose-100"
                        )}>
                           <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", 
                             template.statusCategory === 'HIGH' ? "bg-emerald-500" : 
                             template.statusCategory === 'STABLE' ? "bg-blue-500" : "bg-rose-500"
                           )} />
                           {template.statusLabel}
                        </div>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </section>
    </div>
  );
}
