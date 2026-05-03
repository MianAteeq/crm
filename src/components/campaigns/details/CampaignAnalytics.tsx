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
    { name: 'Sent', value: campaign.sent, color: '#3b82f6' },
    { name: 'Delivered', value: campaign.delivered, color: '#10b981' },
    { name: 'Read', value: campaign.read, color: '#8b5cf6' },
    { name: 'Failed', value: campaign.failed, color: '#ef4444' },
  ];

  const pieData = [
    { name: 'Read', value: campaign.read },
    { name: 'Delivered', value: campaign.delivered - campaign.read },
    { name: 'Failed', value: campaign.failed },
    { name: 'Pending', value: campaign.sent - campaign.delivered - campaign.failed },
  ];

  const COLORS = ['#8b5cf6', '#10b981', '#ef4444', '#3b82f6'];

  const stats = [
    { label: 'Total Sent', value: campaign.sent, icon: Mail, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Delivered', value: campaign.delivered, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Read Count', value: campaign.read, icon: Eye, color: 'text-violet-500', bg: 'bg-violet-500/10' },
    { label: 'Failed', value: campaign.failed, icon: AlertCircle, color: 'text-rose-500', bg: 'bg-rose-500/10' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="p-8 bg-bg-surface border border-border rounded-[2.5rem] shadow-xl relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bg} rounded-bl-[4rem] -translate-y-6 translate-x-6 opacity-0 group-hover:opacity-100 transition-all duration-500`} />
            <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-6 relative z-10`}>
              <stat.icon size={28} />
            </div>
            <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] relative z-10">{stat.label}</p>
            <h3 className="text-3xl font-black text-white tracking-tighter mt-1 relative z-10">{stat.value.toLocaleString()}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 p-10 bg-bg-surface border border-border rounded-[3rem] shadow-2xl">
          <div className="flex items-center justify-between mb-10">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand">
                   <TrendingUp size={24} />
                </div>
                <div>
                   <h3 className="text-xl font-black text-white uppercase tracking-tight">Delivery Funnel</h3>
                   <p className="text-[10px] text-text-muted font-black uppercase tracking-widest mt-0.5">Performance tracking across stages</p>
                </div>
             </div>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deliveryData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }}
                />
                <Tooltip 
                  cursor={{ fill: '#ffffff05' }}
                  contentStyle={{ 
                    backgroundColor: '#111111', 
                    borderRadius: '16px', 
                    border: '1px solid #ffffff10',
                    fontSize: '10px',
                    fontWeight: 900,
                    textTransform: 'uppercase'
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

        <div className="p-10 bg-bg-surface border border-border rounded-[3rem] shadow-2xl">
          <div className="flex items-center gap-4 mb-10">
             <div className="w-12 h-12 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand">
                <CheckCircle2 size={24} />
             </div>
             <div>
                <h3 className="text-xl font-black text-white uppercase tracking-tight">Engagement</h3>
                <p className="text-[10px] text-text-muted font-black uppercase tracking-widest mt-0.5">Read vs Delivered ratio</p>
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
                    backgroundColor: '#111111', 
                    borderRadius: '16px', 
                    border: '1px solid #ffffff10',
                    fontSize: '10px',
                    fontWeight: 900
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
               <p className="text-3xl font-black text-white tracking-tighter">
                  {campaign.delivered > 0 ? Math.round((campaign.read / campaign.delivered) * 100) : 0}%
               </p>
               <p className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em] mt-1">Read Rate</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
