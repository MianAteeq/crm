import React from 'react';
import { Campaign } from '../../../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell 
} from 'recharts';
import { TrendingUp, CheckCircle2, Mail, AlertCircle, Eye } from 'lucide-react';

interface CampaignAnalyticsProps {
  campaign: Campaign;
}

export default function CampaignAnalytics({ campaign }: CampaignAnalyticsProps) {
  const deliveryData = [
    { name: 'Sent', value: campaign.sent, color: '#12263A' },
    { name: 'Delivered', value: campaign.delivered, color: '#22c55e' },
    { name: 'Read', value: campaign.read, color: '#166534' },
    { name: 'Failed', value: campaign.failed, color: '#ef4444' },
  ];

  const pieData = [
    { name: 'Read', value: campaign.read },
    { name: 'Delivered', value: campaign.delivered - campaign.read },
    { name: 'Failed', value: campaign.failed },
    { name: 'Pending', value: campaign.sent - campaign.delivered - campaign.failed },
  ];

  const COLORS = ['#166534', '#22c55e', '#ef4444', '#12263A'];

  const stats = [
    { label: 'Total Sent', value: campaign.sent, icon: Mail, color: 'text-[#12263A]', bg: 'bg-slate-100' },
    { label: 'Delivered', value: campaign.delivered, icon: CheckCircle2, color: 'text-[#22c55e]', bg: 'bg-emerald-50' },
    { label: 'Read Count', value: campaign.read, icon: Eye, color: 'text-[#166534]', bg: 'bg-[#F0FDF4]' },
    { label: 'Failed', value: campaign.failed, icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="p-8 bg-white border border-slate-200 rounded-3xl shadow-sm relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bg} rounded-bl-[4rem] -translate-y-6 translate-x-6 opacity-0 group-hover:opacity-100 transition-all duration-500`} />
            <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-6 relative z-10 border border-current opacity-20`} style={{ borderColor: 'currentColor', opacity: 1 }}>
               <stat.icon size={28} />
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest relative z-10">{stat.label}</p>
            <h3 className="text-3xl font-bold text-slate-900 tracking-tight mt-1 relative z-10">{stat.value.toLocaleString()}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 p-10 bg-white border border-slate-200 rounded-3xl shadow-sm">
          <div className="flex items-center justify-between mb-10">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-900 flex items-center justify-center text-white">
                   <TrendingUp size={24} />
                </div>
                <div>
                   <h3 className="text-xl font-bold text-slate-900 tracking-tight">Delivery Funnel</h3>
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Performance tracking across stages</p>
                </div>
             </div>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deliveryData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    borderRadius: '16px', 
                    border: '1px solid #e2e8f0',
                    fontSize: '10px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar 
                  dataKey="value" 
                  radius={[8, 8, 0, 0]} 
                  barSize={60}
                >
                  {deliveryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-10 bg-white border border-slate-200 rounded-3xl shadow-sm">
          <div className="flex items-center gap-4 mb-10">
             <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-900">
                <CheckCircle2 size={24} />
             </div>
             <div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Engagement</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Read vs Delivered ratio</p>
             </div>
          </div>

          <div className="h-[300px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    borderRadius: '16px', 
                    border: '1px solid #e2e8f0',
                    fontSize: '10px',
                    fontWeight: 700,
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
               <p className="text-3xl font-bold text-slate-900 tracking-tight">
                  {campaign.delivered > 0 ? Math.round((campaign.read / campaign.delivered) * 100) : 0}%
               </p>
               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Read Rate</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
