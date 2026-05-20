import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Info, BarChart3, Users, FileText, 
  Settings, Copy, Trash2, Calendar, Clock, 
  Send, Target, AlertCircle, Loader2, RefreshCw, CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatSafeDate, formatSafeTime } from '../../lib/utils';
import { mockCampaigns, mockRecipients, mockLogs } from '../../data/mockCampaigns';
import { crmApi } from '../../services/crmApi';
import { Campaign, CampaignRecipient } from '../../types';
import CampaignAnalytics from '../../components/campaigns/details/CampaignAnalytics';
import RecipientTable from '../../components/campaigns/details/RecipientTable';
import StatusBadge from '../../components/campaigns/StatusBadge';

type Tab = 'overview' | 'analytics' | 'recipients' | 'logs';

export default function CampaignDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('analytics');
  
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [recipients, setRecipients] = useState<CampaignRecipient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  const campaignLogs = mockLogs.filter(l => l.campaignId === id);

  // Helper mapper to support both API shapes and formats safely
  const mapApiCampaign = (c: any): Campaign => {
    // Dynamically retrieve body message text from template if available
    const templateBodyText = c.template?.components?.find(
      (comp: any) => String(comp.type).toUpperCase() === 'BODY'
    )?.text;

    return {
      id: String(c.id),
      name: c.name || 'Untitled Campaign',
      type: (c.type === 'automation' || c.type === 'Automation' || c.type_label === 'Automation') ? 'Automation' : 'Broadcast',
      audienceSize: Number(c.total_contacts || c.audience_size || c.audienceSize || c.contacts_count || c.recipient_count || c.contacts?.length || 0),
      sent: Number(c.sent_count || c.sent || 0),
      delivered: Number(c.delivered_count || c.delivered || 0),
      read: Number(c.read_count || c.read || 0),
      failed: Number(c.failed_count || c.failed || 0),
      status: ((): Campaign['status'] => {
        const s = String(c.status || 'Draft').toLowerCase();
        if (s === 'completed' || s === 'finished' || s === 'sent') return 'Completed';
        if (s === 'running' || s === 'active' || s === 'sending') return 'Running';
        if (s === 'scheduled') return 'Scheduled';
        if (s === 'failed' || s === 'error') return 'Failed';
        return 'Draft';
      })(),
      scheduledAt: c.scheduled_at || c.scheduledAt || '',
      messageContent: c.message_content || c.messageContent || c.description || templateBodyText || '',
      createdAt: c.created_at || c.createdAt || new Date().toISOString()
    };
  };

  const mapApiRecipients = (contacts: any[]): CampaignRecipient[] => {
    return (contacts || []).map((item: any) => ({
      id: String(item.id),
      campaignId: String(item.campaign_id || id),
      contactId: String(item.contact_id || item.contact?.id || ''),
      contactName: item.contact?.name || `Contact #${item.contact_id || ''}`,
      status: ((): CampaignRecipient['status'] => {
        const s = String(item.status || 'sent').toLowerCase();
        if (s === 'read') return 'read';
        if (s === 'delivered') return 'delivered';
        if (s === 'failed' || s === 'error') return 'failed';
        return 'sent';
      })(),
      error: item.error_message || item.error || undefined,
      timestamp: item.read_at || item.delivered_at || item.sent_at || item.updated_at || item.created_at || new Date().toISOString()
    }));
  };

  const loadCampaignDetail = async () => {
    if (!id) return;
    setIsLoading(true);
    setDetailError(null);
    try {
      console.log(`[CampaignDetailPage] Loading ID: ${id}`);
      const rawRes = await crmApi.getCampaign(id);
      
      const realCampaignObj = rawRes?.data || rawRes?.campaign || rawRes;
      if (realCampaignObj && realCampaignObj.id) {
        setCampaign(mapApiCampaign(realCampaignObj));
        
        // Load recipients dynamically if campaign_contacts is returned
        if (Array.isArray(realCampaignObj.campaign_contacts)) {
          setRecipients(mapApiRecipients(realCampaignObj.campaign_contacts));
        } else {
          setRecipients(mockRecipients.filter(r => r.campaignId === id));
        }
      } else {
        // Fallback to local mocks
        const mock = mockCampaigns.find(c => c.id === id);
        if (mock) {
          setCampaign(mock);
          setRecipients(mockRecipients.filter(r => r.campaignId === id));
        } else {
          throw new Error('Campaign entity not found in record streams.');
        }
      }
    } catch (err: any) {
      console.warn('[CampaignDetailPage] API campaign fetch failed, using local fallback:', err);
      const mock = mockCampaigns.find(c => c.id === id);
      if (mock) {
        setCampaign(mock);
        setRecipients(mockRecipients.filter(r => r.campaignId === id));
      } else {
        setDetailError(err?.message || 'Failed to retrieve selected campaign from database servers.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCampaignDetail();
  }, [id]);

  const handleDeleteCampaign = async () => {
    if (!campaign?.id) return;
    if (!window.confirm('Are you absolutely sure you want to delete this campaign? This cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      console.log(`[CampaignDetailPage] Dispatched DELETE request for campaign ID: ${campaign.id}`);
      await crmApi.deleteCampaign(campaign.id);
      navigate('/campaigns');
    } catch (err: any) {
      console.error('[CampaignDetailPage] Delete operation failed:', err);
      navigate('/campaigns');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center gap-4">
        <Loader2 size={36} className="animate-spin text-indigo-600 stroke-[2.5px]" />
        <p className="text-xs font-black uppercase tracking-widest text-slate-400">Loading campaign nodes...</p>
      </div>
    );
  }

  if (detailError || !campaign) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-6">
        <AlertCircle size={48} className="text-red-500 mx-auto stroke-[2px]" />
        <h2 className="text-xl font-black text-slate-900 leading-none">Campaign Retrieve Error</h2>
        <p className="text-xs font-semibold text-slate-500 leading-relaxed">{detailError || 'The requested campaign could not be fetched.'}</p>
        <button 
          onClick={() => navigate('/campaigns')}
          className="btn-premium-primary px-6"
        >
          Back to Campaigns
        </button>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Info },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'recipients', label: 'Recipients', icon: Users },
    { id: 'logs', label: 'Execution Logs', icon: FileText },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-7xl mx-auto space-y-10 pb-20"
    >
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
                 <span className="flex items-center gap-2"><Calendar size={14} className="text-slate-900" /> Created {formatSafeDate(campaign.createdAt)}</span>
                 <span className="flex items-center gap-2"><Target size={14} className="text-slate-900" /> {campaign.audienceSize.toLocaleString()} Audience</span>
              </div>
           </div>
        </div>

        <div className="flex items-center gap-3">
           <button 
             onClick={loadCampaignDetail}
             disabled={isLoading}
             className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:text-slate-900 hover:border-slate-900 transition-all shadow-sm"
           >
              <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} /> Refresh
           </button>
           <button 
             onClick={handleDeleteCampaign}
             disabled={isDeleting}
             className="flex items-center gap-2 px-6 py-3 bg-rose-50 border border-rose-100 rounded-xl text-[10px] font-bold uppercase tracking-widest text-rose-600 hover:bg-rose-100 transition-all disabled:opacity-55"
           >
              {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />} Delete Campaign
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 max-w-4xl mx-auto">
             <div className="p-10 bg-white border border-slate-200 rounded-3xl space-y-8 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Message Content</h3>
                <p className="text-sm text-slate-600 font-medium leading-relaxed italic">
                   "{campaign.messageContent || campaign.description}"
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
          </motion.div>
        )}

        {activeTab === 'analytics' && <CampaignAnalytics campaign={campaign} />}

        {activeTab === 'recipients' && <RecipientTable recipients={recipients} />}

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
                    <span className="text-[10px] text-slate-400 shrink-0 w-32 font-medium">[{formatSafeTime(log.timestamp)}]</span>
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
    </motion.div>
  );
}
