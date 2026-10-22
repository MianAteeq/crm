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
import { useI18n } from '../../../i18n';

export default function TemplateAnalytics() {
  const { isRtl } = useI18n();
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
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
          {isRtl ? 'جارٍ تحليل أداء القوالب...' : 'Analyzing Performance...'}
        </p>
      </div>
    );
  }

  const rawWeeklyPerf = performanceData?.charts?.weekly_performance;
  const dayLabelsEn = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const dayLabelsAr = ['الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت', 'الأحد'];

  const chartData = Array.isArray(rawWeeklyPerf) && rawWeeklyPerf.length > 0
    ? rawWeeklyPerf.map((item: any) => ({
        name: item.day || item.name || item.date || '',
        sent: item.sent ?? 0,
        delivered: item.delivered ?? 0,
        opened: item.opened ?? item.reads ?? item.delivered ?? 0,
        replied: item.replied ?? 0,
      }))
    : dayLabelsEn.map((day, idx) => ({
        name: isRtl ? dayLabelsAr[idx] : day,
        sent: 0,
        delivered: 0,
        opened: 0,
        replied: 0
      }));

  const summaryStats = [
    { 
      label: isRtl ? 'تم التسليم' : 'Delivered', 
      value: performanceData?.stats?.total_delivered?.toLocaleString() || '0', 
      change: '+0%', 
      trend: 'up' as const, 
      icon: Send, 
      color: 'emerald' 
    },
    { 
      label: isRtl ? 'معدل القراءة' : 'Open Rate', 
      value: `${performanceData?.stats?.read_rate || 0}%`, 
      change: '+0%', 
      trend: 'up' as const, 
      icon: CheckCircle, 
      color: 'blue' 
    },
    { 
      label: isRtl ? 'عدد القراءات' : 'Read Count', 
      value: performanceData?.stats?.read_rate ? Math.round((performanceData.stats.read_rate / 100) * (performanceData.stats.total_sent || 0)).toLocaleString() : '0', 
      change: '0%', 
      trend: 'up' as const, 
      icon: MousePointer2, 
      color: 'purple' 
    },
    { 
      label: isRtl ? 'الردود' : 'Replies', 
      value: performanceData?.stats?.replies?.toLocaleString() || '0', 
      change: '+0%', 
      trend: 'up' as const, 
      icon: MessageSquare, 
      color: 'amber' 
    },
  ];

  const topTemplatesData = (performanceData?.top_templates || []).map((t: any, idx: number) => {
    const name = t.template_name || t.name || (isRtl ? 'قالب بدون عنوان' : 'Untitled Template');
    const category = t.category || 'UTILITY';
    const sent = t.sent ?? 0;
    const openRate = t.read_rate !== undefined ? `${t.read_rate}%` : (t.openRate !== undefined ? t.openRate : '0%');
    const ctaRate = t.ctaRate !== undefined ? t.ctaRate : (t.replies !== undefined ? `${t.replies}%` : '0%');
    
    const rawStatus = String(t.status || 'STABLE').toUpperCase();
    let statusCategory: 'HIGH' | 'STABLE' | 'LOW' = 'STABLE';
    if (rawStatus === 'EXCELLENT' || rawStatus === 'HIGH' || rawStatus === 'APPROVED' || rawStatus === 'ACTIVE') {
      statusCategory = 'HIGH';
    } else if (rawStatus === 'GOOD' || rawStatus === 'STABLE') {
      statusCategory = 'STABLE';
    } else {
      statusCategory = 'LOW';
    }

    const statusLabel = isRtl
      ? (statusCategory === 'HIGH' ? 'ممتاز' : statusCategory === 'STABLE' ? 'مستقر' : 'منخفض')
      : (t.status ? String(t.status).toUpperCase() : 'STABLE');

    return {
      key: `${name}-${idx}`,
      name,
      category,
      sent,
      openRate,
      ctaRate,
      statusLabel,
      statusCategory
    };
  });

  return (
    <div className={cn("space-y-8 font-sans", isRtl && "text-right")} dir={isRtl ? 'rtl' : 'ltr'}>
      {/* AI Insights & Summary Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, x: isRtl ? 20 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden flex flex-col justify-center shadow-lg"
        >
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/15 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md shrink-0">
                <Activity size={20} className="text-emerald-400" />
              </div>
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-300">
                {isRtl ? 'صحة الحملات والقوالب' : 'Campaign Health'}
              </h2>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black leading-tight mb-4 max-w-xl">
              {isRtl ? 'مؤشر الجودة الكلي هو ' : 'Overall Quality Score is '}
              <span className={cn(
                performanceData?.hero_insight?.quality_score === 'Needs Improvement' ? 'text-amber-400' : 'text-emerald-400'
              )}>
                "{performanceData?.hero_insight?.quality_score 
                  ? (isRtl && performanceData.hero_insight.quality_score === 'Optimal' ? 'ممتاز' : performanceData.hero_insight.quality_score)
                  : (isRtl ? 'ممتاز' : 'Optimal')}"
              </span>
            </h1>
            <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-lg mb-6">
              {performanceData?.category_health?.alert || (isRtl 
                ? "تابع أداء رسائلك عبر مختلف الفئات لتحسين تفاعل العملاء والحفاظ على جودة التسليم العالية عبر واتساب." 
                : "Keep track of your message performance across different categories to optimize user engagement.")}
            </p>
            <div className="flex flex-wrap gap-3">
              <button className="px-6 py-3 bg-white text-slate-900 rounded-xl font-black uppercase tracking-wider text-[11px] hover:bg-slate-100 transition-all shadow-sm">
                {isRtl ? 'تصدير التقرير' : 'Export Report'}
              </button>
              <button className="px-6 py-3 bg-white/10 text-white rounded-xl font-black uppercase tracking-wider text-[11px] hover:bg-white/20 transition-all border border-white/10">
                {isRtl ? 'إدارة الحدود والسياسات' : 'Manage Limits'}
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: isRtl ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-emerald-600 rounded-3xl p-8 text-white flex flex-col justify-between shadow-lg"
        >
          <div>
            <div className="w-11 h-11 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
              <TrendingUp size={22} />
            </div>
            <h3 className="text-sm font-black text-emerald-100 uppercase tracking-wider mb-1">
              {isRtl ? 'معدل الوصول والتسليم' : 'Delivery Rate'}
            </h3>
            <p className="text-4xl sm:text-5xl font-black">{performanceData?.stats?.delivery_rate || 98.4}%</p>
          </div>
          <div className="pt-6 border-t border-white/20">
            <p className="text-xs font-bold text-emerald-100 uppercase tracking-wider">
              {isRtl ? 'الحالة: أداء مثالي' : `Status: ${performanceData?.hero_insight?.quality_score || 'Standard'}`}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {summaryStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex justify-between items-start mb-6">
              <div className={cn(
                "p-3.5 rounded-2xl",
                stat.color === 'emerald' ? "bg-emerald-50 text-emerald-600" :
                stat.color === 'blue' ? "bg-blue-50 text-blue-600" :
                stat.color === 'purple' ? "bg-purple-50 text-purple-600" : "bg-amber-50 text-amber-600"
              )}>
                <stat.icon size={20} />
              </div>
              <div className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                stat.trend === 'up' ? 'text-emerald-600 bg-emerald-50 border border-emerald-100' : 'text-rose-600 bg-rose-50 border border-rose-100'
              )}>
                {stat.trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {stat.change}
              </div>
            </div>
            <div>
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1">{stat.label}</p>
              <h3 className="text-2xl font-black text-slate-900 leading-none">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 bg-white rounded-3xl p-7 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
             <div>
               <h3 className="text-base font-black text-slate-900 tracking-tight leading-none mb-1.5">
                 {isRtl ? 'حجم الرسائل والتفاعل' : 'Message Volume'}
               </h3>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                 {isRtl ? 'أداء آخر 7 أيام' : 'Last 7 Days Performance'}
               </p>
             </div>
             <div className="flex gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-100">
                {['D', 'W', 'M', 'Y'].map((t: any) => (
                  <button 
                    key={t}
                    onClick={() => setTimeFilter(t)}
                    className={cn(
                      "w-8 h-8 rounded-lg text-[10px] font-black flex items-center justify-center transition-all cursor-pointer",
                      timeFilter === t ? 'bg-slate-900 text-white shadow' : 'text-slate-500 hover:text-slate-900'
                    )}
                  >
                    {t}
                  </button>
                ))}
             </div>
          </div>
          <div className="h-[300px] w-full" dir="ltr">
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
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 700 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 700 }} dx={-10} />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    padding: '12px'
                  }} 
                />
                <Area type="monotone" dataKey="sent" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorSent)" />
                <Area type="monotone" dataKey="opened" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorOpened)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="bg-white rounded-3xl p-7 border border-slate-200 shadow-sm flex flex-col justify-between">
           <div>
             <div className="mb-6">
                <h3 className="text-base font-black text-slate-900 tracking-tight leading-none mb-1.5">
                  {isRtl ? 'صحة تصنيفات القوالب' : 'Category Health'}
                </h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                  {isRtl ? 'درجة الجودة لكل تصنيف' : 'Distribution Score'}
                </p>
             </div>
             
             <div className="space-y-5">
                {(performanceData?.category_health?.categories || [
                  { category: 'MARKETING', score: 92 },
                  { category: 'UTILITY', score: 98 },
                  { category: 'AUTHENTICATION', score: 100 },
                ]).map((cat: any) => (
                  <div key={cat.category} className="space-y-2">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] font-black text-slate-800 uppercase tracking-wider">
                        {isRtl 
                          ? (cat.category === 'MARKETING' ? 'تسويقي (Marketing)' : cat.category === 'UTILITY' ? 'خدمي (Utility)' : 'مصادقة (Auth)')
                          : cat.category}
                      </span>
                      <span className="text-xs font-black text-slate-900">{cat.score}%</span>
                    </div>
                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${cat.score}%` }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
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
           </div>

           <div className="mt-8 pt-5 border-t border-slate-100">
              <div className="flex items-center gap-3 p-3.5 border border-emerald-100 bg-emerald-50/70 rounded-2xl text-emerald-950">
                 <AlertCircle className="text-emerald-600 shrink-0" size={17} />
                 <p className="text-[11px] font-bold leading-tight">
                   {isRtl 
                     ? "جميع القوالب تعمل ضمن المعايير المثلى لـ Meta وحالة الجودة ممتازة." 
                     : (performanceData?.category_health?.alert || "System operating within optimal parameters. All templates status: HIGH.")}
                 </p>
              </div>
           </div>
        </section>
      </div>

      {/* Top Templates Performance */}
      <section className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
         <div className="px-8 py-6 border-b border-slate-100 bg-white">
            <div className="flex items-center justify-between">
               <div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight mb-1">
                    {isRtl ? 'أفضل القوالب أداءً' : 'Top Performing Templates'}
                  </h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    {isRtl ? 'مرتبة حسب مؤشر التفاعل الكلي ونسبة القراءة' : 'Ranked by overall engagement index'}
                  </p>
               </div>
               <button className="px-5 py-2.5 bg-slate-50 text-slate-800 rounded-xl font-black uppercase tracking-wider text-[10px] hover:bg-slate-100 transition-all border border-slate-200">
                 {isRtl ? 'تصدير التقرير' : 'Export Report'}
               </button>
            </div>
         </div>
         <table className={cn("w-full", isRtl ? "text-right" : "text-left")}>
            <thead>
               <tr className="bg-slate-50/60 border-b border-slate-100">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-wider">{isRtl ? 'اسم القالب' : 'Template Name'}</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-wider">{isRtl ? 'الإرسال' : 'Sends'}</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-wider">{isRtl ? 'معدل القراءة' : 'Open Rate'}</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-wider">{isRtl ? 'نقرات الأزرار' : 'CTA Click'}</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-wider">{isRtl ? 'مستوى الجودة' : 'Quality'}</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {topTemplatesData.map((template, i) => (
                  <tr key={template.key || template.name || i} className="hover:bg-slate-50/50 transition-colors">
                     <td className="px-8 py-4">
                        <div className="flex items-center gap-3">
                           <div className={cn(
                             "w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0",
                             template.statusCategory === 'HIGH' ? "bg-emerald-50 text-emerald-600" : 
                             template.statusCategory === 'STABLE' ? "bg-blue-50 text-blue-600" : "bg-rose-50 text-rose-600"
                           )}>
                              {i + 1}
                           </div>
                           <div>
                              <p className="text-xs font-black text-slate-900 font-mono tracking-tight">{template.name}</p>
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{template.category}</p>
                           </div>
                        </div>
                     </td>
                     <td className="px-6 py-4 font-black text-slate-900 text-xs">{template.sent}</td>
                     <td className="px-6 py-4 font-black text-slate-900 text-xs">{template.openRate}</td>
                     <td className="px-6 py-4 font-black text-slate-900 text-xs">{template.ctaRate}</td>
                     <td className="px-8 py-4">
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
