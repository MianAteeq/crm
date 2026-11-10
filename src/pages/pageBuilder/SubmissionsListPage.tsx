import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  FileText,
  Search,
  Download,
  Trash2,
  RefreshCw,
  ExternalLink,
  Users,
  Eye,
  Star,
  Globe,
  Tag,
  X,
  Calendar,
} from 'lucide-react';
import { pageBuilderApi } from '../../services/pageBuilderApi';
import { BuilderSubmission, BuilderForm } from '../../types/pageBuilder';
import { toast } from '../../components/ui/Toast';

export default function SubmissionsListPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const formIdParam = searchParams.get('form_id');

  const [submissions, setSubmissions] = useState<BuilderSubmission[]>([]);
  const [forms, setForms] = useState<BuilderForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedFormId, setSelectedFormId] = useState<string>(formIdParam || 'all');
  const [selectedSubmission, setSelectedSubmission] = useState<BuilderSubmission | null>(null);
  const [exporting, setExporting] = useState(false);

  // Fetch available forms for dropdown
  useEffect(() => {
    pageBuilderApi.getForms().then((res) => {
      if (res.success && res.data) setForms(res.data);
    });
  }, []);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const res = await pageBuilderApi.getSubmissions({
        form_id: selectedFormId !== 'all' ? Number(selectedFormId) : undefined,
        search: search.trim() || undefined,
      });
      if (res.success && res.data) {
        setSubmissions(res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch submissions:', err);
      toast.error('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [selectedFormId]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchSubmissions();
  };

  const handleExportCsv = async () => {
    try {
      setExporting(true);
      const blobData = await pageBuilderApi.exportSubmissionsCsv({
        form_id: selectedFormId !== 'all' ? Number(selectedFormId) : undefined,
      });
      const url = window.URL.createObjectURL(new Blob([blobData]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `builder_submissions_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Submissions CSV exported successfully!');
    } catch (err) {
      toast.error('Failed to export CSV');
    } finally {
      setExporting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this submission record?')) return;
    try {
      const res = await pageBuilderApi.deleteSubmission(id);
      if (res.success) {
        toast.success('Submission record deleted');
        setSubmissions((prev) => prev.filter((s) => s.id !== id));
        if (selectedSubmission?.id === id) setSelectedSubmission(null);
      }
    } catch (err) {
      toast.error('Failed to delete submission');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2.5">
            <FileText size={24} className="text-[#166534]" />
            <span>Form & Survey Submissions</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            View captured inquiries, survey ratings, and automatically synchronized CRM leads.
          </p>
        </div>

        <button
          type="button"
          disabled={exporting || submissions.length === 0}
          onClick={handleExportCsv}
          className="px-4 py-2.5 bg-white hover:bg-slate-50 text-[#166534] border border-[#166534]/40 rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-2 cursor-pointer disabled:opacity-50 self-start sm:self-auto"
        >
          <Download size={15} />
          <span>{exporting ? 'Exporting...' : 'Export to CSV'}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, or data..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#166534] focus:bg-white"
          />
        </form>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <select
            value={selectedFormId}
            onChange={(e) => setSelectedFormId(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="all">All Forms & Surveys</option>
            {forms.map((f) => (
              <option key={f.id} value={f.id}>
                {f.title}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={fetchSubmissions}
            disabled={loading}
            className="p-2 text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all cursor-pointer"
            title="Refresh"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <RefreshCw size={24} className="animate-spin text-[#166534] mx-auto" />
            <p className="text-xs font-semibold">Loading submissions...</p>
          </div>
        ) : submissions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Submitter / Lead</th>
                  <th className="py-3 px-4">Form Origin</th>
                  <th className="py-3 px-4">CRM Contact Status</th>
                  <th className="py-3 px-4 text-center">Score / Rating</th>
                  <th className="py-3 px-4">Submitted At</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {submissions.map((sub) => {
                  const submitterName =
                    sub.data?.name || sub.data?.full_name || sub.contact?.name || 'Anonymous Submitter';
                  const submitterEmail = sub.data?.email || sub.contact?.email;
                  const submitterPhone = sub.data?.phone || sub.contact?.phone;

                  return (
                    <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800">{submitterName}</div>
                        <div className="text-[11px] text-slate-400">
                          {submitterEmail || submitterPhone || 'No contact info provided'}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-700">{sub.form?.title || 'Form'}</span>
                        {sub.page && (
                          <span className="block text-[10px] text-slate-400">via Page: {sub.page.title}</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        {sub.contact_id ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-50 text-[#166534] border border-emerald-200">
                            <Users size={11} />
                            <span>Contact #{sub.contact_id}</span>
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-500">
                            Unsynced
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {sub.survey_results?.average_rating ? (
                          <span className="inline-flex items-center gap-1 font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                            <Star size={11} className="fill-purple-600 text-purple-600" />
                            <span>{sub.survey_results.average_rating} / 5</span>
                          </span>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                        {new Date(sub.created_at).toLocaleString([], {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View details */}
                          <button
                            type="button"
                            onClick={() => setSelectedSubmission(sub)}
                            className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title="View Submission Details"
                          >
                            <Eye size={15} />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => handleDelete(sub.id)}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Record"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center space-y-3">
            <FileText size={32} className="text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700">No submissions found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Responses submitted from published landing pages and forms will automatically populate here.
            </p>
          </div>
        )}
      </div>

      {/* Submission Detail Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-[#166534]" />
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Submission Details #{selectedSubmission.id}</h3>
                  <p className="text-xs text-slate-400">{selectedSubmission.form?.title}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSubmission(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar text-xs">
              {/* Synced Contact Callout */}
              {selectedSubmission.contact_id && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-[#166534] flex items-center justify-between">
                  <div>
                    <span className="font-bold block">Synchronized to CRM Contacts</span>
                    <span className="text-[11px] text-emerald-800">
                      Record linked to Contact #{selectedSubmission.contact_id}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate(`/contacts`)}
                    className="px-2.5 py-1 bg-[#166534] hover:bg-[#14532d] text-white rounded-lg text-[11px] font-bold"
                  >
                    View in Contacts
                  </button>
                </div>
              )}

              {/* Submitted Fields */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">Submitted Fields</h4>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  {Object.entries(selectedSubmission.data || {}).map(([key, val]) => (
                    <div key={key} className="flex justify-between border-b border-slate-200/60 pb-1.5 last:border-0 last:pb-0">
                      <span className="font-semibold text-slate-600 capitalize">{key.replace(/_/g, ' ')}:</span>
                      <span className="font-mono text-slate-800 text-right max-w-xs break-words">
                        {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Metadata: IP, UTM, User Agent */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">Tracking & Source</h4>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-[11px] text-slate-500 font-mono">
                  {selectedSubmission.ip_address && (
                    <div className="flex justify-between">
                      <span>IP Address:</span>
                      <span>{selectedSubmission.ip_address}</span>
                    </div>
                  )}
                  {selectedSubmission.referer && (
                    <div className="flex justify-between">
                      <span>Referrer:</span>
                      <span className="truncate max-w-[200px]">{selectedSubmission.referer}</span>
                    </div>
                  )}
                  {selectedSubmission.utm_params && Object.keys(selectedSubmission.utm_params).length > 0 && (
                    <div className="flex justify-between">
                      <span>UTM Parameters:</span>
                      <span>{JSON.stringify(selectedSubmission.utm_params)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedSubmission(null)}
                className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100"
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

