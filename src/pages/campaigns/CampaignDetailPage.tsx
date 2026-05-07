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
             className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all hover:border-slate-900 shadow-sm"
           >
              <ArrowLeft size={20} />
           </button>
           <div>
              <div className="flex items-center gap-4 mb-2">
                 <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{campaign.name}</h1>
                 <StatusBadge status={campaign.status} />
              </div>
              <div className="flex items-center gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                 <span className="flex items-center gap-2"><Send size={14} className="text-slate-900" /> {campaign.type}</span>
                 <span className="flex items-center gap-2"><Calendar size={14} className="text-slate-900" /> Created {new Date(campaign.createdAt).toLocaleDateString()}</span>
                 <span className="flex items-center gap-2"><Target size={14} className="text-slate-900" /> {campaign.audienceSize.toLocaleString()} Audience</span>
              </div>
           </div>
        </div>

        <div className="flex items-center gap-3">
           <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:text-slate-900 hover:border-slate-900 transition-all shadow-sm">
              <Copy size={16} /> Duplicate
           </button>
           <button className="flex items-center gap-2 px-6 py-3 bg-rose-50 border border-rose-100 rounded-xl text-[10px] font-bold uppercase tracking-widest text-rose-600 hover:bg-rose-100 transition-all">
              <Trash2 size={16} /> Archive
           </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-10 px-2 overflow-x-auto no-scrollbar shadow-sm">
         {tabs.map((tab) => (
           <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`flex items-center gap-3 px-8 py-5 text-[10px] font-bold uppercase tracking-widest border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab.id ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'
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
                <div className="p-10 bg-white border border-slate-200 rounded-3xl space-y-8 shadow-sm">
                   <h3 className="text-xl font-bold text-slate-900 tracking-tight">Description</h3>
                   <p className="text-sm text-slate-600 font-medium leading-relaxed italic">
                      "This campaign was designed to target our high-value segments for the upcoming Eid holidays. The primary goal is conversion through special discount incentives."
                   </p>
                </div>

                <div className="p-10 bg-white border border-slate-200 rounded-3xl space-y-8 shadow-sm">
                   <h3 className="text-xl font-bold text-slate-900 tracking-tight">Timeline</h3>
                   <div className="space-y-6">
                      {[
                        { time: '2 days ago', event: 'Drafted by Admin', status: 'completed' },
                        { time: 'Next Day', event: 'Audience segment sync completed', status: 'completed' },
                        { time: 'Scheduled for Today', event: 'Meta API verification start', status: 'completed' },
                        { time: '09:00 AM', event: 'Dispatching started (Round 1)', status: 'active' },
                      ].map((item, i) => (
                        <div key={i} className="flex gap-6">
                           <div className="flex flex-col items-center">
                              <div className={`w-3 h-3 rounded-full ${item.status === 'completed' ? 'bg-emerald-500' : 'bg-blue-600 animate-pulse outline outline-4 outline-blue-100'}`} />
                              {i < 3 && <div className="w-px h-10 bg-slate-100 my-2" />}
                           </div>
                           <div className="flex-1 pb-4">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.time}</p>
                              <p className="text-sm font-bold text-slate-900 mt-1">{item.event}</p>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
             </div>

             <div className="space-y-8">
                <div className="p-10 bg-white border border-slate-200 rounded-3xl shadow-sm">
                   <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8">Technical Stats</h4>
                   <div className="space-y-6">
                      <div className="flex items-center justify-between">
                         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rate Limit</span>
                         <span className="text-xs font-bold text-slate-900">60 msg/min</span>
                      </div>
                      <div className="flex items-center justify-between">
                         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Retry Policy</span>
                         <span className="text-xs font-bold text-slate-900">3 Attempts</span>
                      </div>
                      <div className="flex items-center justify-between">
                         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Auth Protocol</span>
                         <span className="text-xs font-bold text-blue-600 uppercase">Meta Graph v18</span>
                      </div>
                   </div>
                </div>

                <div className="p-10 bg-slate-900 rounded-3xl text-center shadow-xl shadow-slate-900/20">
                   <Clock size={40} className="text-white opacity-20 mx-auto mb-6" />
                   <h4 className="text-xs font-bold text-slate-400 uppercase tracking-tight">Total Duration</h4>
                   <p className="text-3xl font-bold text-white tracking-tight mt-1">42m 15s</p>
                </div>
             </div>
          </motion.div>
        )}

        {activeTab === 'analytics' && <CampaignAnalytics campaign={campaign} />}

        {activeTab === 'recipients' && <RecipientTable recipients={campaignRecipients} />}

        {activeTab === 'logs' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
               <h3 className="text-xl font-bold text-slate-900 tracking-tight">Service Logs</h3>
               <div className="flex gap-4">
                  <span className="flex items-center gap-2 text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                     <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> System Online
                  </span>
               </div>
            </div>
            <div className="p-8 space-y-4 max-h-[600px] overflow-y-auto font-mono custom-scrollbar">
               {campaignLogs.map((log) => (
                 <div key={log.id} className="flex gap-6 py-3 border-b border-slate-100 last:border-0 hover:bg-slate-50 px-4 transition-colors rounded-lg">
                    <span className="text-[10px] text-slate-400 shrink-0 w-32 font-medium">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                    <span className={`text-[10px] font-bold uppercase tracking-widest shrink-0 w-20 
                      ${log.level === 'info' ? 'text-blue-600' : log.level === 'warning' ? 'text-amber-600' : 'text-rose-600'}`}>
                       {log.level}
                    </span>
                    <span className="text-xs text-slate-700 font-medium">{log.message}</span>
                 </div>
               ))}
               {campaignLogs.length === 0 && (
                 <div className="py-20 flex flex-col items-center text-center opacity-40">
                    <AlertCircle size={40} className="text-slate-400 mb-4" />
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500">No logs available for this campaign</p>
                 </div>
               )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
