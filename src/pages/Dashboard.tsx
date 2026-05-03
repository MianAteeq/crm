import { 
  Users, 
  MessageSquare, 
  Layout, 
  CheckCircle2,
  TrendingUp,
  BarChart3,
  Calendar,
  Clock
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { mockCampaigns } from '../data/mockCampaigns';
import { contacts } from '../data/contactsMock';
import { templates } from '../data/templates';
import { mockConversations } from '../data/mockMessages';

export default function Dashboard() {
  // Real-time data calculations
  const totalCampaigns = mockCampaigns.length;
  
  // Calculate total messages (Direct messages + Campaign messages)
  const directMessagesCount = mockConversations.reduce((acc, conv) => acc + conv.messages.length, 0);
  const campaignMessagesCount = mockCampaigns.reduce((acc, camp) => acc + camp.sent, 0);
  const totalMessages = directMessagesCount + campaignMessagesCount;
  
  const totalTemplates = templates.length;
  const totalContacts = contacts.length;

  // Monthly stats (simulated based on historical data but presented as requested)
  // In a real app, these would come from filtered queries
  const monthlyStats = [
    { period: 'This Month (May)', count: 2450, growth: '+15%', color: 'text-brand' },
    { period: 'Last Month (April)', count: 1820, growth: '+12%', color: 'text-blue-400' },
    { period: 'Previous Month (March)', count: 1450, growth: '+8%', color: 'text-slate-400' },
  ];

  // Adjust icons if needed
  const FileStack = Layout; // Placeholder using Layout for FileStack if not imported

  const stats = [
    { label: 'Total Campaigns', value: totalCampaigns.toString(), change: '+2 new', trend: 'up', icon: Layout },
    { label: 'Total Messages', value: totalMessages.toLocaleString(), change: '+12.5%', trend: 'up', icon: MessageSquare },
    { label: 'Cloud Templates', value: totalTemplates.toString(), change: 'Ready', trend: 'up', icon: FileStack },
    { label: 'Global Contacts', value: totalContacts.toLocaleString(), change: '+24', trend: 'up', icon: Users },
  ];
  return (
    <div className="space-y-8">
      {/* Metric Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-[#0F0F0F] p-6 rounded-2xl border border-white/5"
          >
            <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">{stat.label}</p>
            <div className="flex items-baseline gap-2">
              <h2 className="text-3xl font-light text-white">{stat.value}</h2>
              <span className={`text-[10px] ${stat.trend === 'up' ? 'text-brand' : 'text-red-400'}`}>
                {stat.change}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-8 min-h-0">
        {/* Main Chart Column */}
        <div className="col-span-12 lg:col-span-8 bg-[#0F0F0F] rounded-2xl border border-white/5 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Active Campaigns</h3>
            <span className="text-[10px] text-slate-500 underline uppercase tracking-tighter cursor-pointer">View all logs</span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] uppercase text-slate-500 border-b border-white/5 bg-white/[0.01]">
                  <th className="px-6 py-4 font-medium">Campaign Name</th>
                  <th className="px-6 py-4 font-medium">Reach</th>
                  <th className="px-6 py-4 font-medium">Engagement</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="text-xs text-slate-300">
                {[
                  { name: 'Summer Solstice VIP Sale', type: 'Manual', reach: '14,020', engagement: '74%', status: 'SENDING', statusColor: 'text-brand bg-brand/10' },
                  { name: 'Abandoned Cart Recovery', type: 'Automation', reach: '3,211', engagement: '52%', status: 'ACTIVE', statusColor: 'text-blue-400 bg-blue-500/10' },
                  { name: 'New Product Launch Teaser', type: 'Scheduled', reach: '--', engagement: '--', status: 'QUEUED', statusColor: 'text-slate-500 bg-slate-500/10' },
                ].map((row, idx) => (
                  <tr key={idx} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-5">
                      <p className="font-medium text-white">{row.name}</p>
                      <p className="text-[10px] text-slate-500">{row.type}</p>
                    </td>
                    <td className="px-6 py-5 font-mono">{row.reach}</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        {row.engagement !== '--' && (
                          <div className="w-20 h-1 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-brand rounded-full" style={{ width: row.engagement }} />
                          </div>
                        )}
                        <span className="font-mono">{row.engagement}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={cn("px-2 py-1 rounded text-[10px] font-bold", row.statusColor)}>
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
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          {/* User History Section */}
          <div className="bg-[#0F0F0F] p-8 rounded-[2rem] border border-white/5 flex flex-col gap-8 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-black text-brand uppercase tracking-[0.3em]">User Growth</h3>
              <TrendingUp size={16} className="text-brand" />
            </div>
            
            <div className="space-y-6">
              {monthlyStats.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between group">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-text-muted uppercase tracking-widest">{item.period}</p>
                    <p className="text-2xl font-black text-white tracking-tighter">{item.count.toLocaleString()}</p>
                  </div>
                  <div className={cn("px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest transition-all group-hover:border-brand/40", item.color)}>
                    {item.growth}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-white/5">
              <div className="flex items-center justify-between text-[10px] font-black text-text-muted uppercase tracking-widest mb-4">
                <span>Overall Reach</span>
                <span className="text-white">84.2%</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '84.2%' }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                  className="h-full bg-brand shadow-[0_0_15px_rgba(40,255,191,0.3)]" 
                />
              </div>
            </div>
          </div>

          <div className="bg-[#111] p-6 rounded-2xl border border-white/5 flex-1">
            <h3 className="text-xs font-black text-white uppercase tracking-widest mb-6">Live Events</h3>
            <div className="space-y-4">
              {[
                { text: <><span className="text-white font-medium">+42 sales</span> generated in the last hour via <span className="italic">Flash Sale</span> campaign.</>, glow: 'bg-brand shadow-[0_0_8px_rgba(37,211,102,0.6)]' },
                { text: <><span className="text-white font-medium">API Webhook</span> connected successfully for <span className="italic">Shopify Integration</span>.</>, glow: 'bg-brand shadow-[0_0_8px_rgba(37,211,102,0.6)]' },
                { text: <><span className="text-white font-medium">New Team Member</span> joined the <span className="italic">throbtech</span> workspace.</>, glow: 'bg-blue-500' },
              ].map((activity, i) => (
                <div key={i} className="flex gap-3">
                  <div className={cn("w-2 h-2 mt-1 rounded-full shrink-0", activity.glow)} />
                  <div className="text-xs text-slate-400 leading-relaxed font-light">{activity.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
