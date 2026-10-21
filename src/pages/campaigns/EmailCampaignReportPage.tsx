import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Mail, Send, CheckCircle2, AlertTriangle, XCircle, 
  Clock, RefreshCw, Filter, Users, ShieldAlert, BarChart3, ChevronLeft, ChevronRight
} from 'lucide-react';
import { emailCampaignApi } from '../../services/emailCampaignApi';
import { CampaignReport, RecipientStatus } from '../../types/emailCampaign';
import { toast } from '../../components/ui/Toast';

export default function EmailCampaignReportPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [report, setReport] = useState<CampaignReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [recipientFilter, setRecipientFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetryFailed = async () => {
    if (!id) return;
    setIsRetrying(true);
    try {
      const res = await emailCampaignApi.retryFailed(Number(id));
      toast.success(res.message || 'Queued failed recipients for retry');
      await fetchReport(true);
    } catch (err: any) {
      toast.error(err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to retry recipients');
    } finally {
      setIsRetrying(false);
    }
  };

  const fetchReport = async (silent = false) => {
    if (!id) return;
    if (!silent) {
      setIsLoading(true);
    } else {
      setIsRefreshing(true);
    }
    try {
      const res = await emailCampaignApi.getCampaignReport(Number(id), {
        recipient_status: recipientFilter !== 'all' ? recipientFilter : undefined,
        page: currentPage,
        per_page: 20,
      });
      setReport(res.data);
    } catch (err) {
      if (!silent) {
        toast.error('Failed to load campaign report');
      }
    } finally {
      if (!silent) setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [id, recipientFilter, currentPage]);

  // Real-time polling when campaign is sending
  useEffect(() => {
    if (report?.campaign?.status !== 'sending') return;

    const interval = setInterval(() => {
      fetchReport(true);
    }, 2500);

    const onFocus = () => fetchReport(true);
    window.addEventListener('focus', onFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', onFocus);
    };
  }, [id, report?.campaign?.status, recipientFilter, currentPage]);

  if (isLoading && !report) {
    return (
      <div className="p-16 flex flex-col items-center justify-center gap-3 text-slate-400">
        <RefreshCw size={24} className="animate-spin text-[#166534]" />
        <p className="text-xs font-semibold uppercase tracking-wider">Loading campaign analytics...</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="p-12 text-center">
        <p className="text-sm text-slate-500">Campaign not found.</p>
        <button
          onClick={() => navigate('/email-campaigns')}
          className="mt-4 px-4 py-2 bg-[#166534] text-white rounded-xl text-xs font-bold"
        >
          Back to Campaigns
        </button>
      </div>
    );
  }

  const { campaign, metrics, recipients, recipients_meta } = report;

  const getRecipientBadge = (status: RecipientStatus) => {
    switch (status) {
      case 'delivered':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">Delivered</span>;
      case 'sent':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">Sent</span>;
      case 'deferred':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">Deferred</span>;
      case 'bounced':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">Bounced</span>;
      case 'failed':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">Failed</span>;
      case 'complained':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">Spam Complaint</span>;
      case 'unsubscribed':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-300">Unsubscribed</span>;
      case 'skipped':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">Suppressed</span>;
      case 'sending':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F0FDF4] text-[#14532d] border border-[#bbf7d0] animate-pulse">Sending</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-50 text-slate-500 border border-slate-200">Pending</span>;
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 pb-24">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigate('/email-campaigns')}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors mb-2"
          >
            <ArrowLeft size={16} />
            Back to Campaigns
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{campaign.name}</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold capitalize bg-slate-100 text-slate-700 border border-slate-200">
              {campaign.status}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Subject: <span className="font-semibold text-slate-800">{campaign.subject}</span> &bull; From: {campaign.from_name} &lt;{campaign.from_email}&gt;
          </p>
        </div>

        <div className="flex items-center gap-2">
          {metrics.failed_count > 0 && (
            <button
              onClick={handleRetryFailed}
              disabled={isRetrying}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-700 shadow-sm disabled:opacity-50 transition-colors"
            >
              <RefreshCw size={14} className={isRetrying ? 'animate-spin' : ''} />
              Retry Failed ({metrics.failed_count})
            </button>
          )}
          <button
            onClick={() => fetchReport(true)}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-sm disabled:opacity-50"
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin text-[#166534]' : ''} />
            Refresh Stats
          </button>
        </div>
      </div>

      {/* Progress & Timeline Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between text-xs font-bold">
          <div className="flex items-center gap-2">
            <BarChart3 size={16} className="text-[#166534]" />
            <span className="text-slate-900 uppercase tracking-wider">Sending Progress</span>
          </div>
          <span className="text-[#166534] text-sm font-extrabold">{metrics.progress_percent}%</span>
        </div>

        <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
          <div 
            className="h-full rounded-full bg-[#166534] transition-all duration-500"
            style={{ width: `${metrics.progress_percent}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium pt-1">
          <div>
            Started: <span className="font-bold text-slate-700">{metrics.started_at || 'Not started'}</span>
          </div>
          <div>
            Completed: <span className="font-bold text-slate-700">{metrics.completed_at || 'In progress'}</span>
          </div>
        </div>
      </div>

      {/* Metric Cards (Section 24) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Recipients */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Recipients</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{metrics.total_recipients.toLocaleString()}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Eligible: {metrics.eligible_count}</p>
        </div>

        {/* Sent */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Sent</p>
          <p className="text-2xl font-bold text-[#166534] mt-1">{metrics.sent.toLocaleString()}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Dispatched to MTA</p>
        </div>

        {/* Delivered */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Delivered</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{metrics.delivered.toLocaleString()}</p>
          <p className="text-[10px] text-emerald-600 font-bold mt-0.5">{metrics.delivery_rate}% rate</p>
        </div>

        {/* Bounced */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <p className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">Bounced</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">{metrics.bounced.toLocaleString()}</p>
          <p className="text-[10px] text-amber-600 font-bold mt-0.5">{metrics.bounce_rate}% rate</p>
        </div>

        {/* Failed */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <p className="text-[11px] font-bold text-rose-600 uppercase tracking-wider">Failed</p>
          <p className="text-2xl font-bold text-rose-600 mt-1">{metrics.failed.toLocaleString()}</p>
          <p className="text-[10px] text-rose-600 font-bold mt-0.5">{metrics.failure_rate}% rate</p>
        </div>

        {/* Unsubscribed */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <p className="text-[11px] font-bold text-purple-600 uppercase tracking-wider">Unsubscribes</p>
          <p className="text-2xl font-bold text-purple-600 mt-1">{metrics.unsubscribed.toLocaleString()}</p>
          <p className="text-[10px] text-purple-600 font-bold mt-0.5">{metrics.unsubscribe_rate}% rate</p>
        </div>
      </div>

      {/* Recipient Logs Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden space-y-4">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">Recipient Activity Log</h3>

          {/* Status Filter */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {['all', 'sent', 'delivered', 'bounced', 'failed', 'unsubscribed', 'skipped'].map((status) => (
              <button
                key={status}
                onClick={() => {
                  setRecipientFilter(status);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all ${
                  recipientFilter === status
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {recipients.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            No recipients found matching the status filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-6">Recipient</th>
                  <th className="py-3 px-4">Contact / Business</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Provider / Message ID</th>
                  <th className="py-3 px-4">Sent At</th>
                  <th className="py-3 px-4">Delivered At</th>
                  <th className="py-3 px-6">Bounce / Event Info</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recipients.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/50">
                    <td className="py-3.5 px-6 font-semibold text-slate-900">
                      <div>{rec.email}</div>
                      {rec.personalized_subject && (
                        <div className="text-[11px] text-slate-400 font-normal truncate max-w-xs">{rec.personalized_subject}</div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      {rec.contact ? (
                        <div>
                          <span className="font-bold text-slate-800">{rec.contact.name}</span>
                          {rec.contact.company && (
                            <span className="text-slate-400 text-[11px] block">{rec.contact.company}</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">No contact link</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getRecipientBadge(rec.status)}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                      <div className="font-bold uppercase text-[10px] text-slate-800">
                        {rec.provider && rec.provider.toLowerCase() !== 'mailtrap' ? rec.provider : 'Direct Delivery'}
                      </div>
                      <div className="text-slate-400 truncate max-w-[140px]" title={rec.provider_message_id || '-'}>
                        {rec.provider_message_id ? `${rec.provider_message_id.substring(0, 16)}...` : '-'}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      {rec.sent_at 
                        ? new Date(rec.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                        : '-'}
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      {rec.delivered_at 
                        ? new Date(rec.delivered_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                        : '-'}
                    </td>

                    <td className="py-3.5 px-6 text-slate-500 max-w-xs">
                      {rec.bounce_type || rec.bounce_reason ? (
                        <div>
                          {rec.bounce_type && (
                            <span className="inline-block text-[10px] font-bold uppercase text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 mr-1">
                              {rec.bounce_type}
                            </span>
                          )}
                          <span className="text-[11px] text-slate-600">{rec.bounce_reason}</span>
                        </div>
                      ) : rec.error_message ? (
                        <span className="text-rose-600 font-medium text-[11px]">{rec.error_message}</span>
                      ) : (
                        rec.attempts > 1 ? `Attempts: ${rec.attempts}` : '-'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {recipients_meta && recipients_meta.last_page > 1 && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              Page {recipients_meta.current_page} of {recipients_meta.last_page} ({recipients_meta.total} total)
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                disabled={currentPage >= recipients_meta.last_page}
                onClick={() => setCurrentPage(prev => Math.min(recipients_meta.last_page, prev + 1))}
                className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
