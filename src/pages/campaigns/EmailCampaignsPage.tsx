import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Search, Mail, Play, Pause, XCircle, Copy, BarChart3, 
  Trash2, RefreshCw, CheckCircle2, Clock, AlertTriangle, Send, Settings, FileText, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { emailCampaignApi } from '../../services/emailCampaignApi';
import { EmailCampaign, EmailCampaignStatus } from '../../types/emailCampaign';
import { toast } from '../../components/ui/Toast';

export default function EmailCampaignsPage() {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  const fetchCampaigns = async (silent = false) => {
    if (!silent) {
      setIsLoading(true);
    } else {
      setIsRefreshing(true);
    }
    try {
      const res = await emailCampaignApi.getCampaigns({
        status: statusFilter !== 'all' ? statusFilter : undefined,
        search: search || undefined,
      });
      setCampaigns(res.data || []);
    } catch (err: any) {
      if (!silent) {
        toast.error('Failed to load email campaigns');
      }
    } finally {
      if (!silent) setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, [statusFilter]);

  // Real-time automatic polling when any campaign is active
  useEffect(() => {
    const hasActiveCampaign = campaigns.some(c => 
      c.status === 'sending' || c.status === 'queued' || c.status === 'scheduled'
    );

    // If a campaign is actively sending/queued, poll every 2.5s; otherwise every 12s
    const pollIntervalMs = hasActiveCampaign ? 2500 : 12000;

    const interval = setInterval(() => {
      fetchCampaigns(true);
    }, pollIntervalMs);

    // Refresh immediately when window regains focus
    const onFocus = () => fetchCampaigns(true);
    window.addEventListener('focus', onFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', onFocus);
    };
  }, [campaigns, statusFilter, search]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCampaigns();
  };

  const handleDuplicate = async (id: number) => {
    setActionLoadingId(id);
    try {
      await emailCampaignApi.duplicateCampaign(id);
      toast.success('Campaign duplicated as draft');
      fetchCampaigns();
    } catch (err) {
      toast.error('Failed to duplicate campaign');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handlePause = async (id: number) => {
    setActionLoadingId(id);
    try {
      await emailCampaignApi.pauseCampaign(id);
      toast.success('Campaign paused');
      fetchCampaigns();
    } catch (err) {
      toast.error('Failed to pause campaign');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleResume = async (id: number) => {
    setActionLoadingId(id);
    try {
      await emailCampaignApi.resumeCampaign(id);
      toast.success('Campaign resumed');
      fetchCampaigns();
    } catch (err) {
      toast.error('Failed to resume campaign');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this campaign?')) return;
    setActionLoadingId(id);
    try {
      await emailCampaignApi.deleteCampaign(id);
      toast.success('Campaign deleted');
      setCampaigns(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      toast.error('Failed to delete campaign');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Aggregated totals
  const totalSent = campaigns.reduce((acc, c) => acc + (c.sent_count || 0), 0);
  const totalDelivered = campaigns.reduce((acc, c) => acc + (c.delivered_count || 0), 0);
  const totalRecipients = campaigns.reduce((acc, c) => acc + (c.eligible_count || c.total_recipients || 0), 0);
  const avgDeliveryRate = totalSent > 0 ? Math.round((totalDelivered / totalSent) * 100) : 0;

  const getStatusBadge = (status: EmailCampaignStatus) => {
    switch (status) {
      case 'sending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#F0FDF4] text-[#166534] border border-[#22C55E]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-ping" />
            Sending
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#F0FDF4] text-[#166534] border border-[#22C55E]/30">
            <CheckCircle2 size={12} />
            Completed
          </span>
        );
      case 'scheduled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock size={12} />
            Scheduled
          </span>
        );
      case 'paused':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-50 text-yellow-700 border border-yellow-200">
            <Pause size={12} />
            Paused
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-stone-100 text-stone-600 border border-stone-200">
            <XCircle size={12} />
            Cancelled
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertTriangle size={12} />
            Failed
          </span>
        );
      case 'draft':
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-stone-100 text-[#57534E] border border-stone-200">
            Draft
          </span>
        );
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#F0FDF4] text-[#166534] border border-[#22C55E]/30 flex items-center justify-center shadow-xs shrink-0">
              <Mail size={22} strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#12263A] tracking-tight">Email Campaigns</h1>
              <div className="flex flex-wrap items-center gap-3 mt-0.5">
                <p className="text-xs sm:text-sm font-medium text-[#57534E]">Create, personalize, schedule, and track marketing email campaigns</p>
                {campaigns.some(c => c.status === 'sending' || c.status === 'queued') && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#F0FDF4] text-[#166534] border border-[#22C55E]/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-ping" />
                    Live Updating
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => fetchCampaigns(true)}
            disabled={isRefreshing}
            title="Refresh Real-time Stats"
            className="h-10 px-3.5 rounded-xl border border-stone-200/80 bg-white text-[#57534E] text-xs font-bold hover:bg-[#F0FDF4] hover:text-[#166534] hover:border-[#22C55E]/40 transition-all shadow-xs active:scale-95 flex items-center gap-2 cursor-pointer disabled:opacity-50 whitespace-nowrap shrink-0"
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin text-[#166534]' : 'text-stone-400'} />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => navigate('/email-templates')}
            className="h-10 px-4 rounded-xl border border-stone-200/80 bg-white text-[#57534E] text-xs font-bold hover:bg-[#F0FDF4] hover:text-[#166534] hover:border-[#22C55E]/40 transition-all shadow-xs active:scale-95 flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
          >
            <FileText size={16} />
            <span>Templates</span>
          </button>
          <button
            onClick={() => navigate('/settings/email')}
            className="h-10 px-4 rounded-xl border border-stone-200/80 bg-white text-[#57534E] text-xs font-bold hover:bg-[#F0FDF4] hover:text-[#166534] hover:border-[#22C55E]/40 transition-all shadow-xs active:scale-95 flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
          >
            <Settings size={16} />
            <span>Settings</span>
          </button>
          <button
            onClick={() => navigate('/email-campaigns/ai-agent')}
            className="h-10 px-4 rounded-xl border border-[#22C55E]/40 bg-[#F0FDF4] hover:bg-[#dcfce7] text-[#166534] text-xs font-bold shadow-xs transition-all active:scale-95 flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
          >
            <Sparkles size={16} className="text-[#22C55E]" />
            <span>AI Marketing Agent</span>
          </button>
          <button
            onClick={() => navigate('/email-campaigns/create')}
            className="h-10 px-5 rounded-xl bg-[#166534] hover:bg-[#14532d] text-white text-xs font-bold shadow-xs hover:shadow-[#166534]/15 transition-all active:scale-95 flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
          >
            <Plus size={16} />
            <span>Create Campaign</span>
          </button>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Total Campaigns</p>
            <p className="text-2xl font-bold text-[#12263A] mt-1">{campaigns.length}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#FAFAF9] border border-stone-200 flex items-center justify-center text-[#12263A]">
            <Mail size={18} />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Total Recipients</p>
            <p className="text-2xl font-bold text-[#12263A] mt-1">{totalRecipients.toLocaleString()}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#F0FDF4] border border-[#22C55E]/20 flex items-center justify-center text-[#166534]">
            <Send size={18} />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Emails Sent</p>
            <p className="text-2xl font-bold text-[#12263A] mt-1">{totalSent.toLocaleString()}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#F0FDF4] border border-[#22C55E]/20 flex items-center justify-center text-[#22C55E]">
            <Play size={18} />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Delivery Success</p>
            <p className="text-2xl font-bold text-[#166534] mt-1">{avgDeliveryRate}%</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#F0FDF4] border border-[#22C55E]/30 flex items-center justify-center text-[#166534]">
            <CheckCircle2 size={18} />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-stone-200/80 shadow-sm">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: 'All' },
            { id: 'sending', label: 'Sending' },
            { id: 'scheduled', label: 'Scheduled' },
            { id: 'completed', label: 'Completed' },
            { id: 'draft', label: 'Draft' },
            { id: 'paused', label: 'Paused' },
            { id: 'cancelled', label: 'Cancelled' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                statusFilter === tab.id
                  ? 'bg-[#166534] text-white shadow-xs'
                  : 'text-[#57534E] hover:text-[#12263A] hover:bg-[#F0FDF4]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-72">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search campaigns..."
            className="w-full pl-10 pr-4 py-2 text-xs font-medium rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#22C55E]/20 focus:border-[#166534] transition-all placeholder:text-stone-400"
          />
        </form>
      </div>

      {/* Campaign List Table */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-16 flex flex-col items-center justify-center gap-3 text-stone-400">
            <RefreshCw size={24} className="animate-spin text-[#166534]" />
            <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">Loading campaigns...</p>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="p-16 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-[#F0FDF4] text-[#166534] border border-[#22C55E]/30 flex items-center justify-center mx-auto">
              <Mail size={28} />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#12263A]">No email campaigns found</h3>
              <p className="text-xs text-[#57534E] mt-1 max-w-sm mx-auto">
                {search || statusFilter !== 'all' 
                  ? 'Try adjusting your search filters or status selection.' 
                  : 'Start by creating your first personalized outreach campaign from your CRM contacts.'}
              </p>
            </div>
            <button
              onClick={() => navigate('/email-campaigns/create')}
              className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-[#166534] hover:bg-[#14532d] text-white text-xs sm:text-sm font-semibold transition-all shadow-sm hover:shadow-[#166534]/15 active:scale-95 cursor-pointer"
            >
              <Plus size={14} />
              Create First Campaign
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAFAF9] border-b border-stone-200 text-[#57534E] font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-6">Campaign</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Recipients</th>
                  <th className="py-3.5 px-4 text-right">Sent / Deliv</th>
                  <th className="py-3.5 px-4 text-right">Bounce / Fail</th>
                  <th className="py-3.5 px-4">Progress</th>
                  <th className="py-3.5 px-4">Created Date</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {campaigns.map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-[#F0FDF4]/40 transition-colors">
                    {/* Name & Subject */}
                    <td className="py-4 px-6">
                      <div className="font-bold text-[#12263A] text-sm hover:text-[#166534] cursor-pointer" onClick={() => navigate(`/email-campaigns/${campaign.id}/report`)}>
                        {campaign.name}
                      </div>
                      <div className="text-[#57534E]/70 text-xs mt-0.5 truncate max-w-xs font-medium">
                        {campaign.subject}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      {getStatusBadge(campaign.status)}
                    </td>

                    {/* Recipients */}
                    <td className="py-4 px-4 text-right font-bold text-[#12263A]">
                      {(campaign.eligible_count || campaign.total_recipients || 0).toLocaleString()}
                    </td>

                    {/* Sent / Delivered */}
                    <td className="py-4 px-4 text-right">
                      <span className="font-bold text-[#12263A]">{campaign.sent_count?.toLocaleString()}</span>
                      <span className="text-stone-400"> / </span>
                      <span className="font-bold text-[#166534]">{campaign.delivered_count?.toLocaleString()}</span>
                    </td>

                    {/* Bounced / Failed */}
                    <td className="py-4 px-4 text-right">
                      <span className="text-amber-600 font-medium">{campaign.bounced_count || 0}</span>
                      <span className="text-stone-400"> / </span>
                      <span className="text-rose-600 font-medium">{campaign.failed_count || 0}</span>
                    </td>

                    {/* Progress */}
                    <td className="py-4 px-4 min-w-[130px]">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 rounded-full bg-stone-100 overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              campaign.status === 'completed' ? 'bg-[#22C55E]' : 'bg-[#166534]'
                            }`}
                            style={{ width: `${campaign.progress_percent || 0}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-bold text-[#57534E] w-8 text-right">
                          {campaign.progress_percent || 0}%
                        </span>
                      </div>
                    </td>

                    {/* Created Date */}
                    <td className="py-4 px-4 text-[#57534E] whitespace-nowrap font-medium">
                      {new Date(campaign.created_at).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => navigate(`/email-campaigns/${campaign.id}/report`)}
                          title="View Report"
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-[#166534] bg-white hover:bg-[#F0FDF4] border border-slate-200 hover:border-[#bbf7d0] transition-all cursor-pointer active:scale-90 shadow-xs"
                        >
                          <BarChart3 size={16} />
                        </button>

                        {campaign.status === 'sending' && (
                          <button
                            onClick={() => handlePause(campaign.id)}
                            title="Pause Campaign"
                            className="p-1.5 rounded-lg text-yellow-600 hover:bg-yellow-50 transition-all"
                          >
                            <Pause size={16} />
                          </button>
                        )}

                        {campaign.status === 'paused' && (
                          <button
                            onClick={() => handleResume(campaign.id)}
                            title="Resume Campaign"
                            className="p-1.5 rounded-lg text-[#166534] hover:bg-[#F0FDF4] transition-all"
                          >
                            <Play size={16} />
                          </button>
                        )}

                        <button
                          onClick={() => handleDuplicate(campaign.id)}
                          title="Duplicate Campaign"
                          disabled={actionLoadingId === campaign.id}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-[#12263A] bg-white hover:bg-[#F0FDF4] border border-slate-200 hover:border-[#bbf7d0] transition-all cursor-pointer active:scale-90 shadow-xs"
                        >
                          <Copy size={16} />
                        </button>

                        <button
                          onClick={() => handleDelete(campaign.id)}
                          title="Delete Campaign"
                          disabled={actionLoadingId === campaign.id}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-rose-500 hover:text-white bg-rose-50/60 hover:bg-rose-600 border border-rose-100 hover:border-rose-600 transition-all cursor-pointer active:scale-90 shadow-xs"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
