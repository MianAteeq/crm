import React from 'react';
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
import { Send, CheckCircle, MousePointer2, MessageSquare, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'motion/react';

const data = [
  { name: 'Mon', sent: 4000, delivered: 3800, opened: 2400 },
  { name: 'Tue', sent: 3000, delivered: 2900, opened: 1398 },
  { name: 'Wed', sent: 2000, delivered: 1950, opened: 9800 },
  { name: 'Thu', sent: 2780, delivered: 2700, opened: 3908 },
  { name: 'Fri', sent: 1890, delivered: 1800, opened: 4800 },
  { name: 'Sat', sent: 2390, delivered: 2300, opened: 3800 },
  { name: 'Sun', sent: 3490, delivered: 3400, opened: 4300 },
];

const stats = [
  { label: 'Delivered', value: '124,302', change: '+12.5%', trend: 'up', icon: Send, color: 'emerald' },
  { label: 'Read Rate', value: '84.2%', change: '+5.2%', trend: 'up', icon: CheckCircle, color: 'blue' },
  { label: 'Click Rate', value: '24.1%', change: '-2.1%', trend: 'down', icon: MousePointer2, color: 'purple' },
  { label: 'Replies', value: '1,204', change: '+3.1%', trend: 'up', icon: MessageSquare, color: 'amber' },
];

export default function TemplateAnalytics() {
  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group"
          >
            <div className="flex justify-between items-start mb-6">
              <div className={`p-3 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600 group-hover:scale-110 transition-transform`}>
                <stat.icon size={20} />
              </div>
              <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${stat.trend === 'up' ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'}`}>
                {stat.trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {stat.change}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-2xl font-black text-slate-900 leading-none">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
             <h3 className="text-lg font-black text-slate-900 tracking-tight uppercase tracking-widest text-xs">Message Performance</h3>
             <div className="flex gap-2">
                {['D', 'W', 'M', 'Y'].map(t => (
                  <button key={t} className={`p-2 w-8 h-8 rounded-lg text-[10px] font-black flex items-center justify-center transition-all ${t === 'W' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>{t}</button>
                ))}
             </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 900 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 900 }} />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }} 
                />
                <Area type="monotone" dataKey="sent" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorSent)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
           <div className="flex justify-between items-center mb-8">
              <h3 className="text-lg font-black text-slate-900 tracking-tight uppercase tracking-widest text-xs">Engagement Trends</h3>
              <div className="flex items-center gap-4">
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="text-[10px] font-black text-slate-400 uppercase">Opened</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-slate-200" />
                    <span className="text-[10px] font-black text-slate-400 uppercase">Sent</span>
                 </div>
              </div>
           </div>
           <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 900 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 900 }} />
                <Tooltip 
                   cursor={{ fill: '#f8fafc' }}
                   contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }} 
                />
                <Bar dataKey="sent" fill="#e2e8f0" radius={[4, 4, 0, 0]} barSize={12} />
                <Bar dataKey="opened" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </div>
  );
}
