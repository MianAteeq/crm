import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, ArrowRight, Mail, Send, CheckCircle2, AlertTriangle, XCircle, 
  Clock, RefreshCw, Filter, Users, ShieldAlert, BarChart3, ChevronLeft, ChevronRight
} from 'lucide-react';
import { emailCampaignApi } from '../../services/emailCampaignApi';
import { CampaignReport, RecipientStatus } from '../../types/emailCampaign';
import { toast } from '../../components/ui/Toast';
import { useI18n } from '../../i18n';
import { cn } from '../../lib/utils';

export default function EmailCampaignReportPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, isRtl, locale } = useI18n();
  const [report, setReport] = useState<CampaignReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [recipientFilter, setRecipientFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

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
        toast.error(isRtl ? 'تعذر تحميل تقرير الحملة' : 'Failed to load campaign report');
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
      <div className={cn("p-16 flex flex-col items-center justify-center gap-3 text-slate-400", isRtl && "font-arabic")}>
        <RefreshCw size={24} className="animate-spin text-[#166534]" />
        <p className="text-xs font-semibold uppercase tracking-wider">
          {isRtl ? 'جارٍ تحميل تحليلات الحملة...' : 'Loading campaign analytics...'}
        </p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className={cn("p-12 text-center", isRtl && "font-arabic")}>
        <p className="text-sm text-slate-500">
          {isRtl ? 'لم يتم العثور على الحملة.' : 'Campaign not found.'}
        </p>
        <button
          onClick={() => navigate('/email-campaigns')}
          className="mt-4 px-4 py-2 bg-[#166534] text-white rounded-xl text-xs font-bold"
        >
          {isRtl ? 'العودة إلى الحملات' : 'Back to Campaigns'}
        </button>
      </div>
    );
  }

  const { campaign, metrics, recipients, recipients_meta } = report;

  const getRecipientBadge = (status: RecipientStatus) => {
    switch (status) {
      case 'delivered':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">{isRtl ? 'تم التسليم' : 'Delivered'}</span>;
      case 'sent':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">{isRtl ? 'تم الإرسال' : 'Sent'}</span>;
      case 'deferred':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">{isRtl ? 'مؤجل' : 'Deferred'}</span>;
      case 'bounced':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">{isRtl ? 'مرتد' : 'Bounced'}</span>;
      case 'failed':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">{isRtl ? 'فشل' : 'Failed'}</span>;
      case 'complained':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">{isRtl ? 'شكوى إزعاج' : 'Spam Complaint'}</span>;
      case 'unsubscribed':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-300">{isRtl ? 'إلغاء اشتراك' : 'Unsubscribed'}</span>;
      case 'skipped':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">{isRtl ? 'مستبعد' : 'Suppressed'}</span>;
      case 'sending':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F0FDF4] text-[#14532d] border border-[#bbf7d0] animate-pulse">{isRtl ? 'جارٍ الإرسال' : 'Sending'}</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-50 text-slate-500 border border-slate-200">{isRtl ? 'قيد الانتظار' : 'Pending'}</span>;
    }
  };

  const getCampaignStatusLabel = (status: string) => {
    switch (status) {
      case 'sending': return isRtl ? 'قيد الإرسال' : 'Sending';
      case 'completed': return isRtl ? 'مكتملة' : 'Completed';
      case 'scheduled': return isRtl ? 'مجدولة' : 'Scheduled';
      case 'draft': return isRtl ? 'مسودة' : 'Draft';
      case 'paused': return isRtl ? 'متوقفة مؤقتاً' : 'Paused';
      case 'cancelled': return isRtl ? 'ملغاة' : 'Cancelled';
      default: return status;
    }
  };

  return (
    <div className={cn("p-8 max-w-7xl mx-auto space-y-8 pb-24", isRtl && "font-arabic")}>
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigate('/email-campaigns')}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors mb-2"
          >
            {isRtl ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
            {isRtl ? 'العودة إلى الحملات' : 'Back to Campaigns'}
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{campaign.name}</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold capitalize bg-slate-100 text-slate-700 border border-slate-200">
              {getCampaignStatusLabel(campaign.status)}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {isRtl ? 'الموضوع: ' : 'Subject: '}
            <span className="font-semibold text-slate-800">{campaign.subject}</span> &bull; {isRtl ? 'من: ' : 'From: '}
            {campaign.from_name} &lt;{campaign.from_email}&gt;
          </p>
        </div>

        <button
          onClick={() => fetchReport(true)}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-sm disabled:opacity-50"
        >
          <RefreshCw size={14} className={isRefreshing ? 'animate-spin text-[#166534]' : ''} />
          {isRtl ? 'تحديث الإحصائيات' : 'Refresh Stats'}
        </button>
      </div>

      {/* Progress & Timeline Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between text-xs font-bold">
          <div className="flex items-center gap-2">
            <BarChart3 size={16} className="text-[#166534]" />
            <span className="text-slate-900 uppercase tracking-wider">
              {isRtl ? 'مستوى تقدم الإرسال' : 'Sending Progress'}
            </span>
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
            {isRtl ? 'تاريخ البدء: ' : 'Started: '}
            <span className="font-bold text-slate-700">
              {metrics.started_at 
                ? new Date(metrics.started_at).toLocaleString(isRtl ? 'ar-SA' : 'en-US') 
                : (isRtl ? 'لم يبدأ بعد' : 'Not started')}
            </span>
          </div>
          <div>
            {isRtl ? 'تاريخ الاكتمال: ' : 'Completed: '}
            <span className="font-bold text-slate-700">
              {metrics.completed_at 
                ? new Date(metrics.completed_at).toLocaleString(isRtl ? 'ar-SA' : 'en-US') 
                : (isRtl ? 'قيد التنفيذ' : 'In progress')}
            </span>
          </div>
        </div>
      </div>

      {/* Metric Cards (Section 24) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Recipients */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {isRtl ? 'إجمالي المستلمين' : 'Recipients'}
          </p>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {metrics.total_recipients.toLocaleString(isRtl ? 'ar-SA' : 'en-US')}
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">
            {isRtl ? 'المؤهلون: ' : 'Eligible: '}{metrics.eligible_count.toLocaleString(isRtl ? 'ar-SA' : 'en-US')}
          </p>
        </div>

        {/* Sent */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {isRtl ? 'تم الإرسال' : 'Sent'}
          </p>
          <p className="text-2xl font-bold text-[#166534] mt-1">
            {metrics.sent.toLocaleString(isRtl ? 'ar-SA' : 'en-US')}
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">
            {isRtl ? 'تم التوجيه للخادم' : 'Dispatched to MTA'}
          </p>
        </div>

        {/* Delivered */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
            {isRtl ? 'تم التسليم' : 'Delivered'}
          </p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">
            {metrics.delivered.toLocaleString(isRtl ? 'ar-SA' : 'en-US')}
          </p>
          <p className="text-[10px] text-emerald-600 font-bold mt-0.5">
            {isRtl ? `نسبة ${metrics.delivery_rate}٪` : `${metrics.delivery_rate}% rate`}
          </p>
        </div>

        {/* Bounced */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <p className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">
            {isRtl ? 'المرتدة' : 'Bounced'}
          </p>
          <p className="text-2xl font-bold text-amber-600 mt-1">
            {metrics.bounced.toLocaleString(isRtl ? 'ar-SA' : 'en-US')}
          </p>
          <p className="text-[10px] text-amber-600 font-bold mt-0.5">
            {isRtl ? `نسبة ${metrics.bounce_rate}٪` : `${metrics.bounce_rate}% rate`}
          </p>
        </div>

        {/* Failed */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <p className="text-[11px] font-bold text-rose-600 uppercase tracking-wider">
            {isRtl ? 'الفاشلة' : 'Failed'}
          </p>
          <p className="text-2xl font-bold text-rose-600 mt-1">
            {metrics.failed.toLocaleString(isRtl ? 'ar-SA' : 'en-US')}
          </p>
          <p className="text-[10px] text-rose-600 font-bold mt-0.5">
            {isRtl ? `نسبة ${metrics.failure_rate}٪` : `${metrics.failure_rate}% rate`}
          </p>
        </div>

        {/* Unsubscribed */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <p className="text-[11px] font-bold text-purple-600 uppercase tracking-wider">
            {isRtl ? 'إلغاء الاشتراك' : 'Unsubscribes'}
          </p>
          <p className="text-2xl font-bold text-purple-600 mt-1">
            {metrics.unsubscribed.toLocaleString(isRtl ? 'ar-SA' : 'en-US')}
          </p>
          <p className="text-[10px] text-purple-600 font-bold mt-0.5">
            {isRtl ? `نسبة ${metrics.unsubscribe_rate}٪` : `${metrics.unsubscribe_rate}% rate`}
          </p>
        </div>
      </div>

      {/* Recipient Logs Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden space-y-4">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            {isRtl ? 'سجل نشاط المستلمين' : 'Recipient Activity Log'}
          </h3>

          {/* Status Filter */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {[
              { id: 'all', label: isRtl ? 'الكل' : 'all' },
              { id: 'sent', label: isRtl ? 'المرسلة' : 'sent' },
              { id: 'delivered', label: isRtl ? 'المستلمة' : 'delivered' },
              { id: 'bounced', label: isRtl ? 'المرتدة' : 'bounced' },
              { id: 'failed', label: isRtl ? 'الفاشلة' : 'failed' },
              { id: 'unsubscribed', label: isRtl ? 'ملغي الاشتراك' : 'unsubscribed' },
              { id: 'skipped', label: isRtl ? 'المستبعدة' : 'skipped' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setRecipientFilter(item.id);
                  setCurrentPage(1);
                }}
                className={cn(
                  "px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all",
                  recipientFilter === item.id
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-500 hover:bg-slate-50'
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {recipients.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            {isRtl ? 'لم يتم العثور على مستلمين يطابقون خيار التصفية.' : 'No recipients found matching the status filter.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className={cn("w-full text-xs", isRtl ? "text-right" : "text-left")}>
              <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-6">{isRtl ? 'المستلم' : 'Recipient'}</th>
                  <th className="py-3 px-4">{isRtl ? 'جهة الاتصال / المنشأة' : 'Contact / Business'}</th>
                  <th className="py-3 px-4">{isRtl ? 'الحالة' : 'Status'}</th>
                  <th className="py-3 px-4">{isRtl ? 'المزود / معرف الرسالة' : 'Provider / Message ID'}</th>
                  <th className="py-3 px-4">{isRtl ? 'وقت الإرسال' : 'Sent At'}</th>
                  <th className="py-3 px-4">{isRtl ? 'وقت التسليم' : 'Delivered At'}</th>
                  <th className="py-3 px-6">{isRtl ? 'معلومات الارتداد / الحدث' : 'Bounce / Event Info'}</th>
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
                        <span className="text-slate-400 italic">
                          {isRtl ? 'لا يوجد ارتباط بجهة اتصال' : 'No contact link'}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getRecipientBadge(rec.status)}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                      <div className="font-bold uppercase text-[10px] text-slate-800">
                        {rec.provider && rec.provider.toLowerCase() !== 'mailtrap' 
                          ? rec.provider 
                          : (isRtl ? 'إرسال مباشر' : 'Direct Delivery')}
                      </div>
                      <div className="text-slate-400 truncate max-w-[140px]" title={rec.provider_message_id || '-'}>
                        {rec.provider_message_id ? `${rec.provider_message_id.substring(0, 16)}...` : '-'}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      {rec.sent_at 
                        ? new Date(rec.sent_at).toLocaleTimeString(isRtl ? 'ar-SA' : 'en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                        : '-'}
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      {rec.delivered_at 
                        ? new Date(rec.delivered_at).toLocaleTimeString(isRtl ? 'ar-SA' : 'en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                        : '-'}
                    </td>

                    <td className="py-3.5 px-6 text-slate-500 max-w-xs">
                      {rec.bounce_type || rec.bounce_reason ? (
                        <div>
                          {rec.bounce_type && (
                            <span className={cn(
                              "inline-block text-[10px] font-bold uppercase text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200",
                              isRtl ? "ml-1" : "mr-1"
                            )}>
                              {rec.bounce_type}
                            </span>
                          )}
                          <span className="text-[11px] text-slate-600">{rec.bounce_reason}</span>
                        </div>
                      ) : rec.error_message ? (
                        <span className="text-rose-600 font-medium text-[11px]">{rec.error_message}</span>
                      ) : (
                        rec.attempts > 1 ? `${isRtl ? 'المحاولات: ' : 'Attempts: '}${rec.attempts}` : '-'
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
              {isRtl 
                ? `صفحة ${recipients_meta.current_page} من ${recipients_meta.last_page} (إجمالي ${recipients_meta.total})`
                : `Page ${recipients_meta.current_page} of ${recipients_meta.last_page} (${recipients_meta.total} total)`}
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50"
                title={isRtl ? 'السابق' : 'Previous'}
              >
                {isRtl ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
              </button>
              <button
                disabled={currentPage >= recipients_meta.last_page}
                onClick={() => setCurrentPage(prev => Math.min(recipients_meta.last_page, prev + 1))}
                className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50"
                title={isRtl ? 'التالي' : 'Next'}
              >
                {isRtl ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
