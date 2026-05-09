import { 
  Users, 
  MessageSquare, 
  Layout, 
  CheckCircle2,
  TrendingUp,
  BarChart3,
  Calendar,
  Clock,
  Shield
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { mockCampaigns } from '../data/mockCampaigns';
import { contacts } from '../data/contactsMock';
import { mockConversations } from '../data/mockMessages';

export default function Dashboard() {
  // Real-time data calculations
  const totalCampaigns = mockCampaigns.length;
  
  // Calculate total messages (Direct messages + Campaign messages)
  const directMessagesCount = (mockConversations || []).reduce((acc, conv) => acc + (conv.messages || []).length, 0);
  const campaignMessagesCount = mockCampaigns.reduce((acc, camp) => acc + camp.sent, 0);
  const totalMessages = directMessagesCount + campaignMessagesCount;
  
  const totalContacts = contacts.length;

  // Monthly stats (simulated based on historical data)
  const monthlyStats = [
    { period: 'This Month (May)', count: 2450, growth: '+15%', color: 'text-brand' },
    { period: 'Last Month (April)', count: 1820, growth: '+12%', color: 'text-blue-400' },
    { period: 'Previous Month (March)', count: 1450, growth: '+8%', color: 'text-slate-400' },
  ];

  const stats = [
    { label: 'Total Campaigns', value: totalCampaigns.toString(), change: '+2 new', trend: 'up', icon: Layout },
    { label: 'Total Messages', value: totalMessages.toLocaleString(), change: '+12.5%', trend: 'up', icon: MessageSquare },
    { label: 'Global Contacts', value: totalContacts.toLocaleString(), change: '+24', trend: 'up', icon: Users },
  ];

  return (
    <div className="space-y-6">
      {/* Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition-all hover:shadow-md"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all">
                <stat.icon size={20} />
              </div>
              <span className={cn(
                "text-[10px] font-bold px-2.5 py-0.5 rounded-full",
                stat.trend === 'up' ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-700 border border-red-100"
              )}>
                {stat.change}
              </span>
            </div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h2>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        {/* Main Chart Column */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Active Campaigns</h3>
              <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest mt-0.5">Summary of current delivery performance</p>
            </div>
            <button className="text-[11px] font-bold text-slate-900 hover:bg-white border border-slate-200 px-3 py-1.5 rounded-lg transition-all shadow-sm uppercase tracking-tight">Analytics</button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] uppercase text-slate-400 border-b border-slate-100">
                  <th className="px-6 py-4 font-bold tracking-wider">Campaign Name</th>
                  <th className="px-6 py-4 font-bold tracking-wider text-center">Reach</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Engagement</th>
                  <th className="px-6 py-4 font-bold tracking-wider text-right">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {[
                  { name: 'Summer Solstice VIP Sale', type: 'Manual', reach: '14,020', engagement: '74%', status: 'SENDING', statusColor: 'text-green-700 bg-green-50 border-green-100' },
                  { name: 'Abandoned Cart Recovery', type: 'Automation', reach: '3,211', engagement: '52%', status: 'ACTIVE', statusColor: 'text-blue-700 bg-blue-50 border-blue-100' },
                  { name: 'New Product Launch Teaser', type: 'Scheduled', reach: '--', engagement: '--', status: 'QUEUED', statusColor: 'text-slate-500 bg-slate-50 border-slate-100' },
                ].map((row, idx) => (
                  <tr key={idx} className="border-b border-slate-50 last:border-b-0 hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-900">{row.name}</p>
                      <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest mt-0.5">{row.type}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-bold text-center">{row.reach}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {row.engagement !== '--' ? (
                          <>
                            <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-slate-900 rounded-full" style={{ width: row.engagement }} />
                            </div>
                            <span className="text-xs font-bold text-slate-900">{row.engagement}</span>
                          </>
                        ) : (
                          <span className="text-slate-400 font-medium">---</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold border", row.statusColor)}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Side Column: Insights */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Reach Distribution</h3>
              <div className="p-1.5 bg-green-50 text-green-600 rounded-lg">
                <TrendingUp size={16} />
              </div>
            </div>
            
            <div className="space-y-5">
              {monthlyStats.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-slate-50 bg-slate-50/30">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.period}</p>
                    <p className="text-xl font-bold text-slate-900 tracking-tight">{item.count.toLocaleString()}</p>
                  </div>
                  <div className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold border", 
                    idx === 0 ? "bg-green-50 text-green-700 border-green-100" : "bg-white text-slate-500 border-slate-100"
                  )}>
                    {item.growth}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 mt-2">
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">
                <span>Monthly Target</span>
                <span className="text-slate-900">84.2%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '84.2%' }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  className="h-full bg-slate-900 rounded-full" 
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-xl text-white shadow-xl flex flex-col overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <BarChart3 size={80} />
            </div>
            <h3 className="text-[11px] font-bold uppercase tracking-widest mb-6 text-slate-400">Security & Infrastructure</h3>
            <div className="space-y-5 flex-1 relative z-10">
              {[
                { icon: CheckCircle2, text: <><span className="font-bold text-slate-100">+42 conversions</span> detected in <span className="text-slate-200 border-b border-slate-700">VIP Sale</span></>, color: 'text-green-500' },
                { icon: Shield, text: <><span className="font-bold text-slate-100">API Webhook</span> healthy for Shopify v3.4</>, color: 'text-blue-500' },
                { icon: Clock, text: <><span className="font-bold text-slate-100">Task Scheduler</span> optimized for EU-West</>, color: 'text-slate-500' },
              ].map((activity, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className={cn("mt-1 shrink-0", activity.color)}>
                    <activity.icon size={14} />
                  </div>
                  <div className="text-[11px] text-slate-400 leading-relaxed font-medium">{activity.text}</div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-white/10 flex justify-between items-center relative z-10">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Live Node Gateway</span>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-bold text-green-500 uppercase">Stable</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
