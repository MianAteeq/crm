import { useEffect, useState, useCallback } from 'react';
import {
  Globe,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Eye,
  ShieldCheck,
  Building2,
  ChevronLeft,
  ChevronRight,
  Info
} from 'lucide-react';
import { emailCampaignApi } from '../../services/emailCampaignApi';
import type { EmailSendingDomain, DnsRecordItem } from '../../types/emailCampaign';

export default function AdminSendingDomains() {
  const [domains, setDomains] = useState<EmailSendingDomain[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Inspection modal for DNS records
  const [inspectDomain, setInspectDomain] = useState<EmailSendingDomain | null>(null);

  const fetchDomains = useCallback(async (targetPage = page) => {
    setLoading(true);
    setError(null);
    try {
      const res = await emailCampaignApi.getAdminSendingDomains({
        page: targetPage,
        search: search.trim() || undefined,
        status: statusFilter || undefined,
      });
      setDomains(res.data || []);
      setPage(res.current_page || 1);
      setTotalPages(res.last_page || 1);
      setTotalCount(res.total || 0);
    } catch (err: any) {
      console.error('Failed to load admin sending domains:', err);
      setError(err?.response?.data?.message || 'Failed to load tenant sending domains.');
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => {
    fetchDomains(1);
  }, [search, statusFilter]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      fetchDomains(newPage);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 size={13} className="text-emerald-600" />
            Verified
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
            <XCircle size={13} className="text-rose-600" />
            Rejected
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <AlertTriangle size={13} className="text-amber-600" />
            Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
            <Clock size={13} className="text-blue-600" />
            Pending
          </span>
        );
    }
  };

  const getAuthBadge = (val?: string) => {
    if (!val) return <span className="text-xs text-slate-400">N/A</span>;
    if (val === 'verified') {
      return (
        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
          OK
        </span>
      );
    }
    if (val === 'failed' || val === 'rejected') {
      return (
        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-rose-50 text-rose-700 border border-rose-200">
          Failed
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
        Pending
      </span>
    );
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#166534] text-white flex items-center justify-center shadow-md shadow-[#166534]/15">
              <Globe size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Email Sending Domains</h1>
              <p className="text-sm text-slate-500">
                Cross-tenant domain inspection and deliverability status.
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchDomains(page)}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4.5 py-2.5 text-xs font-bold text-[#57534E] bg-white border border-slate-200 hover:bg-[#F0FDF4] hover:text-[#166534] hover:border-[#bbf7d0] rounded-xl transition-all shadow-xs cursor-pointer active:scale-95 disabled:opacity-50"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Security notice / Read-only enforcement indicator */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 text-amber-800 text-sm">
        <Info size={18} className="text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold">Security Enforcement Active:</span> Sending domain ownership and DKIM/SPF verification are strictly validated through the email deliverability system. As per system security policy, administrators cannot bypass or force-verify domains manually.
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search domain or verification ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#166534] focus:border-[#166534]"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter size={15} className="text-slate-400 shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#166534] w-full md:w-auto"
            >
              <option value="">All Statuses</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
              <option value="failed">Failed</option>
            </select>
          </div>
          <span className="text-xs text-slate-400 whitespace-nowrap">
            {totalCount} total domain{totalCount === 1 ? '' : 's'}
          </span>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm flex items-center gap-2">
          <AlertTriangle size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Domains Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 text-xs uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Tenant</th>
                <th className="px-5 py-3.5">Domain</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-center">SPF</th>
                <th className="px-4 py-3.5 text-center">DKIM</th>
                <th className="px-4 py-3.5 text-center">DMARC</th>
                <th className="px-5 py-3.5">Verification ID</th>
                <th className="px-5 py-3.5">Verified At</th>
                <th className="px-5 py-3.5">Last Checked</th>
                <th className="px-5 py-3.5">Created At</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-400">
                    <RefreshCw size={24} className="animate-spin mx-auto mb-2 text-[#166534]" />
                    Loading domain records...
                  </td>
                </tr>
              ) : domains.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-400">
                    <Globe size={32} className="mx-auto mb-2 text-slate-300" />
                    No sending domains found matching your criteria.
                  </td>
                </tr>
              ) : (
                domains.map((dom) => (
                  <tr key={dom.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Tenant */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Building2 size={15} className="text-slate-400 shrink-0" />
                        <div>
                          <div className="font-medium text-slate-900">
                            {dom.tenant?.name || `Tenant #${dom.tenant_id}`}
                          </div>
                          <div className="text-xs text-slate-400">ID: {dom.tenant_id}</div>
                        </div>
                      </div>
                    </td>

                    {/* Domain */}
                    <td className="px-5 py-4 font-mono font-medium text-slate-900">
                      {dom.domain}
                      {dom.verification_error && (
                        <div className="text-[11px] text-rose-600 font-sans mt-0.5 line-clamp-1" title={dom.verification_error}>
                          {dom.verification_error}
                        </div>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">{getStatusBadge(dom.status)}</td>

                    {/* SPF */}
                    <td className="px-4 py-4 text-center">{getAuthBadge(dom.spf_status)}</td>

                    {/* DKIM */}
                    <td className="px-4 py-4 text-center">{getAuthBadge(dom.dkim_status)}</td>

                    {/* DMARC */}
                    <td className="px-4 py-4 text-center">{getAuthBadge(dom.dmarc_status)}</td>

                    {/* Mailtrap Domain ID */}
                    <td className="px-5 py-4 font-mono text-xs text-slate-500">
                      {dom.mailtrap_domain_id || '—'}
                    </td>

                    {/* Verified At */}
                    <td className="px-5 py-4 text-xs text-slate-500 whitespace-nowrap">
                      {formatDate(dom.verified_at)}
                    </td>

                    {/* Last Checked */}
                    <td className="px-5 py-4 text-xs text-slate-500 whitespace-nowrap">
                      {formatDate(dom.last_checked_at)}
                    </td>

                    {/* Created At */}
                    <td className="px-5 py-4 text-xs text-slate-500 whitespace-nowrap">
                      {formatDate(dom.created_at)}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4 text-right">
                      <button
                        onClick={() => setInspectDomain(dom)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200 hover:bg-[#F0FDF4] hover:text-[#166534] hover:border-[#bbf7d0] rounded-lg transition-all shadow-xs cursor-pointer active:scale-95"
                        title="Inspect DNS Records"
                      >
                        <Eye size={13} />
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Page {page} of {totalPages} ({totalCount} total)
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1}
                className="w-8.5 h-8.5 rounded-xl border border-slate-200 bg-white hover:bg-[#F0FDF4] hover:text-[#166534] hover:border-[#bbf7d0] text-slate-600 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center cursor-pointer transition-all active:scale-95 shadow-xs"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= totalPages}
                className="w-8.5 h-8.5 rounded-xl border border-slate-200 bg-white hover:bg-[#F0FDF4] hover:text-[#166534] hover:border-[#bbf7d0] text-slate-600 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center cursor-pointer transition-all active:scale-95 shadow-xs"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Inspect DNS Records Modal */}
      {inspectDomain && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-[#166534]" />
                <h3 className="font-bold text-slate-900">
                  DNS Configuration for {inspectDomain.domain}
                </h3>
              </div>
              <button
                onClick={() => setInspectDomain(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                &times;
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400">Tenant:</span>{' '}
                  <span className="font-semibold text-slate-800">
                    {inspectDomain.tenant?.name || `#${inspectDomain.tenant_id}`}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Status:</span>{' '}
                  <span className="font-semibold uppercase text-slate-800">
                    {inspectDomain.status}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Verification ID:</span>{' '}
                  <span className="font-mono text-slate-800">
                    {inspectDomain.mailtrap_domain_id || 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Last Verified:</span>{' '}
                  <span className="text-slate-800">
                    {formatDate(inspectDomain.verified_at)}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Domain DNS Records
                </h4>
                {inspectDomain.dns_records && inspectDomain.dns_records.length > 0 ? (
                  <div className="space-y-2">
                    {inspectDomain.dns_records.map((rec: DnsRecordItem, idx: number) => (
                      <div
                        key={idx}
                        className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold uppercase px-2 py-0.5 rounded bg-[#F0FDF4] text-[#166534] border border-[#bbf7d0] text-[10px]">
                            {rec.record_type || rec.type}
                          </span>
                          <span className="text-slate-500 font-medium">{rec.purpose || 'Deliverability'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Host / Name: </span>
                          <span className="font-mono text-slate-800 select-all font-semibold">
                            {rec.name || rec.host}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400">Target / Value: </span>
                          <div className="font-mono text-slate-700 bg-white p-1.5 rounded border border-slate-200 break-all select-all text-[11px] mt-0.5">
                            {rec.value || rec.content}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-slate-400 text-xs bg-slate-50 rounded-lg">
                    No DNS records stored for this domain.
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setInspectDomain(null)}
                className="px-4.5 py-2.5 text-xs font-bold text-[#57534E] bg-white border border-slate-200 hover:bg-[#F0FDF4] hover:text-[#166534] hover:border-[#bbf7d0] rounded-xl transition-all cursor-pointer shadow-xs active:scale-95"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
