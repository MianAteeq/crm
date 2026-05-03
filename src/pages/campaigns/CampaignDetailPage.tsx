import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Info, BarChart3, Users, FileText, 
  Settings, Copy, Trash2, Calendar, Clock, 
  Send, Target, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { mockCampaigns, mockRecipients, mockLogs } from '../../data/mockCampaigns';
import CampaignAnalytics from '../../components/campaigns/details/CampaignAnalytics';
import RecipientTable from '../../components/campaigns/details/RecipientTable';
import StatusBadge from '../../components/campaigns/StatusBadge';

type Tab = 'overview' | 'analytics' | 'recipients' | 'logs';

export default function CampaignDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('analytics');
  
  const campaign = mockCampaigns.find(c => c.id === id);
  const campaignRecipients = mockRecipients.filter(r => r.campaignId === id);
  const campaignLogs = mockLogs.filter(l => l.campaignId === id);

  if (!campaign) return null;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Info },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'recipients', label: 'Recipients', icon: Users },
    { id: 'logs', label: 'Execution Logs', icon: FileText },
  ];

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
        <div className="flex items-start gap-6">
           <button 
             onClick={() => navigate('/campaigns')}
             className="w-12 h-12 rounded-2xl bg-bg-surface border border-border flex items-center justify-center text-text-muted hover:text-white transition-all hover:border-brand/40"
           >
              <ArrowLeft size={20} />
           </button>
           <div>
              <div className="flex items-center gap-4 mb-2">
                 <h1 className="text-4xl font-black text-white uppercase tracking-tighter">{campaign.name}</h1>
                 <StatusBadge status={campaign.status} />
              </div>
              <div className="flex items-center gap-6 text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">
                 <span className="flex items-center gap-2"><Send size={14} className="text-brand" /> {campaign.type}</span>
                 <span className="flex items-center gap-2"><Calendar size={14} className="text-brand" /> Created {new Date(campaign.createdAt).toLocaleDateString()}</span>
                 <span className="flex items-center gap-2"><Target size={14} className="text-brand" /> {campaign.audienceSize.toLocaleString()} Total Audience</span>
              </div>
           </div>
        </div>

        <div className="flex items-center gap-3">
           <button className="flex items-center gap-2 px-6 py-4 bg-bg-surface border border-border rounded-xl text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-white transition-all">
              <Copy size={16} /> Duplicate
           </button>
           <button className="flex items-center gap-2 px-6 py-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-500/20 transition-all">
              <Trash2 size={16} /> Archive
           </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border bg-bg-surface/50 backdrop-blur-md sticky top-0 z-10 px-2 overflow-x-auto no-scrollbar">
         {tabs.map((tab) => (
           <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`flex items-center gap-3 px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab.id ? 'border-brand text-brand' : 'border-transparent text-text-muted hover:text-white'
              }`}
           >
              <tab.icon size={16} />
              {tab.label}
           </button>
         ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[600px]">
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             <div className="lg:col-span-2 space-y-8">
                <div className="p-10 bg-bg-surface border border-border rounded-[3rem] space-y-8">
                   <h3 className="text-xl font-black text-white uppercase tracking-tight">Campaign Description</h3>
                   <p className="text-sm text-text-muted font-medium leading-relaxed italic">
                      "This campaign was designed to target our high-value segments for the upcoming Eid holidays. The primary goal is conversion through special discount incentives."
                   </p>
                </div>

                <div className="p-10 bg-bg-surface border border-border rounded-[3rem] space-y-8">
                   <h3 className="text-xl font-black text-white uppercase tracking-tight">Execution Timeline</h3>
                   <div className="space-y-6">
                      {[
                        { time: '2 days ago', event: 'Campaign drafted by Admin', status: 'completed' },
                        { time: 'Next Day', event: 'Audience segment sync completed', status: 'completed' },
                        { time: 'Scheduled for Today', event: 'Meta API verification start', status: 'completed' },
                        { time: '09:00 AM', event: 'Dispatching started (Round 1)', status: 'active' },
                      ].map((item, i) => (
                        <div key={i} className="flex gap-6">
                           <div className="flex flex-col items-center">
                              <div className={`w-3 h-3 rounded-full ${item.status === 'completed' ? 'bg-emerald-500' : 'bg-brand animate-pulse'}`} />
                              {i < 3 && <div className="w-px h-10 bg-border my-2" />}
                           </div>
                           <div className="flex-1 pb-4">
                              <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">{item.time}</p>
                              <p className="text-sm font-bold text-white mt-1 uppercase tracking-tight">{item.event}</p>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
             </div>

             <div className="space-y-8">
                <div className="p-10 bg-bg-surface border border-border rounded-[3rem]">
                   <h4 className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-8">Technical Stats</h4>
                   <div className="space-y-6">
                      <div className="flex items-center justify-between">
                         <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Rate Limit</span>
                         <span className="text-xs font-bold text-white">60 msg/min</span>
                      </div>
                      <div className="flex items-center justify-between">
                         <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Retry Policy</span>
                         <span className="text-xs font-bold text-white">3 Attempts</span>
                      </div>
                      <div className="flex items-center justify-between">
                         <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Auth Protocol</span>
                         <span className="text-xs font-bold text-brand uppercase">Meta Graph v20</span>
                      </div>
                   </div>
                </div>

                <div className="p-10 bg-brand/5 border border-brand/20 rounded-[3rem] text-center">
                   <Clock size={40} className="text-brand mx-auto mb-6" />
                   <h4 className="text-xs font-black text-white uppercase tracking-tight">Total Duration</h4>
                   <p className="text-3xl font-black text-brand tracking-tighter mt-1">42m 15s</p>
                </div>
             </div>
          </motion.div>
        )}

        {activeTab === 'analytics' && <CampaignAnalytics campaign={campaign} />}

        {activeTab === 'recipients' && <RecipientTable recipients={campaignRecipients} />}

        {activeTab === 'logs' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-bg-surface border border-border rounded-[2.5rem] overflow-hidden">
            <div className="p-8 border-b border-border bg-bg-surface2/30 flex items-center justify-between">
               <h3 className="text-xl font-black text-white uppercase tracking-tight">Execution Context</h3>
               <div className="flex gap-4">
                  <span className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                     <div className="w-2 h-2 rounded-full bg-emerald-500" /> System Online
                  </span>
               </div>
            </div>
            <div className="p-8 space-y-4 max-h-[600px] overflow-y-auto font-mono">
               {campaignLogs.map((log) => (
                 <div key={log.id} className="flex gap-6 py-3 border-b border-border/50 last:border-0 hover:bg-bg-surface2/30 px-4 transition-colors">
                    <span className="text-[10px] text-text-muted shrink-0 w-32">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                    <span className={`text-[10px] font-black uppercase tracking-widest shrink-0 w-20 
                      ${log.level === 'info' ? 'text-blue-400' : log.level === 'warning' ? 'text-amber-400' : 'text-rose-400'}`}>
                       {log.level}
                    </span>
                    <span className="text-xs text-white font-medium">{log.message}</span>
                 </div>
               ))}
               {campaignLogs.length === 0 && (
                 <div className="py-20 flex flex-col items-center text-center opacity-40">
                    <AlertCircle size={40} className="text-text-muted mb-4" />
                    <p className="text-xs font-bold uppercase tracking-widest">No logs available for this campaign</p>
                 </div>
               )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
