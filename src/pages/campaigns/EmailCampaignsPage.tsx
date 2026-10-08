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
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-ping" />
            Sending
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
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
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
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
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-50 text-slate-600 border border-slate-200">
            Draft
          </span>
        );
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/20">
              <Mail size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Email Campaigns</h1>
              <div className="flex items-center gap-3 mt-0.5">
                <p className="text-sm text-slate-500">Create, personalize, schedule, and track marketing email campaigns</p>
                {campaigns.some(c => c.status === 'sending' || c.status === 'queued') && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    Live Updating
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => fetchCampaigns(true)}
            disabled={isRefreshing}
            title="Refresh Real-time Stats"
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 hover:text-indigo-600 transition-all shadow-sm disabled:opacity-50"
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin text-indigo-600' : 'text-slate-500'} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            onClick={() => navigate('/email-templates')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-all shadow-sm"
          >
            <FileText size={16} />
            Templates
          </button>
          <button
            onClick={() => navigate('/settings/email')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-all shadow-sm"
          >
            <Settings size={16} />
            Settings
          </button>
          <button
            onClick={() => navigate('/email-campaigns/ai-agent')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg shadow-purple-600/20"
          >
            <Sparkles size={16} />
            AI Marketing Agent
          </button>
          <button
            onClick={() => navigate('/email-campaigns/create')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20"
          >
            <Plus size={16} />
            Create Campaign
          </button>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Campaigns</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{campaigns.length}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600">
            <Mail size={18} />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Recipients</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{totalRecipients.toLocaleString()}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <Send size={18} />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Emails Sent</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{totalSent.toLocaleString()}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Play size={18} />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Delivery Success</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">{avgDeliveryRate}%</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <CheckCircle2 size={18} />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
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
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-72">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search campaigns..."
            className="w-full pl-10 pr-4 py-2 text-xs font-medium rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </form>
      </div>

      {/* Campaign List Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-16 flex flex-col items-center justify-center gap-3 text-slate-400">
            <RefreshCw size={24} className="animate-spin text-indigo-600" />
            <p className="text-xs font-semibold uppercase tracking-wider">Loading campaigns...</p>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="p-16 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
              <Mail size={28} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">No email campaigns found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                {search || statusFilter !== 'all' 
                  ? 'Try adjusting your search filters or status selection.' 
                  : 'Start by creating your first personalized outreach campaign from your CRM contacts.'}
              </p>
            </div>
            <button
              onClick={() => navigate('/email-campaigns/create')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/20"
            >
              <Plus size={14} />
              Create First Campaign
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
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
              <tbody className="divide-y divide-slate-100">
                {campaigns.map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Name & Subject */}
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900 text-sm hover:text-indigo-600 cursor-pointer" onClick={() => navigate(`/email-campaigns/${campaign.id}/report`)}>
                        {campaign.name}
                      </div>
                      <div className="text-slate-400 text-xs mt-0.5 truncate max-w-xs font-medium">
                        {campaign.subject}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      {getStatusBadge(campaign.status)}
                    </td>

                    {/* Recipients */}
                    <td className="py-4 px-4 text-right font-bold text-slate-800">
                      {(campaign.eligible_count || campaign.total_recipients || 0).toLocaleString()}
                    </td>

                    {/* Sent / Delivered */}
                    <td className="py-4 px-4 text-right">
                      <span className="font-bold text-slate-800">{campaign.sent_count?.toLocaleString()}</span>
                      <span className="text-slate-400"> / </span>
                      <span className="font-bold text-emerald-600">{campaign.delivered_count?.toLocaleString()}</span>
                    </td>

                    {/* Bounced / Failed */}
                    <td className="py-4 px-4 text-right">
                      <span className="text-amber-600 font-medium">{campaign.bounced_count || 0}</span>
                      <span className="text-slate-400"> / </span>
                      <span className="text-rose-600 font-medium">{campaign.failed_count || 0}</span>
                    </td>

                    {/* Progress */}
                    <td className="py-4 px-4 min-w-[130px]">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              campaign.status === 'completed' ? 'bg-emerald-500' : 'bg-indigo-600'
                            }`}
                            style={{ width: `${campaign.progress_percent || 0}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-bold text-slate-600 w-8 text-right">
                          {campaign.progress_percent || 0}%
                        </span>
                      </div>
                    </td>

                    {/* Created Date */}
                    <td className="py-4 px-4 text-slate-500 whitespace-nowrap font-medium">
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
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
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
                            className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-all"
                          >
                            <Play size={16} />
                          </button>
                        )}

                        <button
                          onClick={() => handleDuplicate(campaign.id)}
                          title="Duplicate Campaign"
                          disabled={actionLoadingId === campaign.id}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all"
                        >
                          <Copy size={16} />
                        </button>

                        <button
                          onClick={() => handleDelete(campaign.id)}
                          title="Delete Campaign"
                          disabled={actionLoadingId === campaign.id}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
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
