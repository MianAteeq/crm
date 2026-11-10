import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ClipboardList,
  Plus,
  Search,
  ExternalLink,
  Edit3,
  Copy,
  Trash2,
  CheckCircle2,
  XCircle,
  Code2,
  Eye,
  RefreshCw,
  Users,
  Star,
  FileText,
  Tag,
} from 'lucide-react';
import { pageBuilderApi } from '../../services/pageBuilderApi';
import { BuilderForm, FormType } from '../../types/pageBuilder';
import { toast } from '../../components/ui/Toast';
import { EmbedModal } from '../../components/pageBuilder/EmbedModal';

export default function FormsListPage() {
  const navigate = useNavigate();
  const [forms, setForms] = useState<BuilderForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  // Embed Modal
  const [selectedEmbedForm, setSelectedEmbedForm] = useState<{ title: string; slug: string } | null>(null);

  const fetchForms = async () => {
    try {
      setLoading(true);
      const res = await pageBuilderApi.getForms({
        search: search.trim() || undefined,
        form_type: typeFilter !== 'all' ? typeFilter : undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
      });
      if (res.success && res.data) {
        setForms(res.data);
      }
    } catch (err) {
      console.error('Failed to load forms:', err);
      toast.error('Failed to load forms');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForms();
  }, [typeFilter, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchForms();
  };

  const handleTogglePublish = async (id: number) => {
    try {
      setActionLoadingId(id);
      const res = await pageBuilderApi.togglePublishForm(id);
      if (res.success && res.data) {
        toast.success(`Form ${res.data.status === 'published' ? 'published' : 'unpublished'} successfully!`);
        setForms((prev) => prev.map((f) => (f.id === id ? res.data : f)));
      }
    } catch (err) {
      toast.error('Failed to update form status');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDuplicate = async (id: number) => {
    try {
      setActionLoadingId(id);
      const res = await pageBuilderApi.duplicateForm(id);
      if (res.success && res.data) {
        toast.success('Form duplicated successfully!');
        setForms((prev) => [res.data, ...prev]);
      }
    } catch (err) {
      toast.error('Failed to duplicate form');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This will not delete previously synced CRM contacts.`))
      return;

    try {
      setActionLoadingId(id);
      const res = await pageBuilderApi.deleteForm(id);
      if (res.success) {
        toast.success('Form deleted successfully');
        setForms((prev) => prev.filter((f) => f.id !== id));
      }
    } catch (err) {
      toast.error('Failed to delete form');
    } finally {
      setActionLoadingId(null);
    }
  };

  const getFormTypeBadge = (type: FormType) => {
    switch (type) {
      case 'survey':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1">
            <Star size={10} />
            <span>Survey</span>
          </span>
        );
      case 'lead_form':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-blue-50 text-blue-700 border border-blue-200">
            Lead Capture
          </span>
        );
      case 'registration':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-amber-50 text-amber-700 border border-amber-200">
            Registration
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-slate-100 text-slate-700">
            Contact
          </span>
        );
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2.5">
            <ClipboardList size={24} className="text-[#166534]" />
            <span>Forms & Surveys</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Create high-converting lead forms, multi-step inquiries, and customer feedback surveys.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/page-builder/forms/create')}
          className="px-4 py-2.5 bg-[#166534] hover:bg-[#14532d] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>New Form / Survey</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-72">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search forms by title or slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#166534] focus:bg-white"
          />
        </form>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          {/* Type Filter */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold">
            {[
              { id: 'all', label: 'All' },
              { id: 'lead_form', label: 'Lead Forms' },
              { id: 'survey', label: 'Surveys' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTypeFilter(t.id)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  typeFilter === t.id
                    ? 'bg-white text-[#166534] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold">
            {['all', 'published', 'draft'].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg transition-all capitalize cursor-pointer ${
                  statusFilter === s
                    ? 'bg-white text-[#166534] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={fetchForms}
            disabled={loading}
            className="p-2 text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all cursor-pointer"
            title="Refresh"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Forms Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <RefreshCw size={24} className="animate-spin text-[#166534] mx-auto" />
            <p className="text-xs font-semibold">Loading forms and surveys...</p>
          </div>
        ) : forms.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Form Title & Slug</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Structure</th>
                  <th className="py-3 px-4 text-center">Submissions</th>
                  <th className="py-3 px-4">CRM Auto-Tags</th>
                  <th className="py-3 px-4">Last Updated</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {forms.map((f) => {
                  const isActionLoading = actionLoadingId === f.id;
                  const totalFields = f.schema?.steps?.reduce((acc, step) => acc + (step.fields?.length || 0), 0) || 0;
                  const stepsCount = f.schema?.steps?.length || 1;

                  return (
                    <tr key={f.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800">{f.title}</div>
                        <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 mt-0.5">
                          <span>/f/{f.slug}</span>
                          <a
                            href={`/f/${f.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[#166534] hover:underline"
                            title="Preview standalone form"
                          >
                            <ExternalLink size={11} />
                          </a>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">{getFormTypeBadge(f.form_type)}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                            f.status === 'published'
                              ? 'bg-emerald-50 text-[#166534] border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          {f.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center text-slate-600">
                        <span className="font-semibold">{totalFields} fields</span>
                        {f.schema?.is_multi_step && (
                          <span className="block text-[10px] text-slate-400">({stepsCount} steps)</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => navigate(`/page-builder/submissions?form_id=${f.id}`)}
                          className="font-bold text-emerald-800 hover:underline"
                        >
                          {f.submission_count || 0}
                        </button>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1 max-w-[180px]">
                          {f.crm_mapping?.auto_tags && f.crm_mapping.auto_tags.length > 0 ? (
                            f.crm_mapping.auto_tags.map((tag, idx) => (
                              <span
                                key={idx}
                                className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-mono flex items-center gap-0.5"
                              >
                                <Tag size={9} />
                                {tag}
                              </span>
                            ))
                          ) : (
                            <span className="text-[11px] text-slate-400 italic">None</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                        {new Date(f.updated_at).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Edit in Builder */}
                          <button
                            type="button"
                            onClick={() => navigate(`/page-builder/forms/edit/${f.id}`)}
                            className="p-1.5 text-[#166534] hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit Form"
                          >
                            <Edit3 size={15} />
                          </button>

                          {/* Toggle Publish */}
                          <button
                            type="button"
                            disabled={isActionLoading}
                            onClick={() => handleTogglePublish(f.id)}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                              f.status === 'published'
                                ? 'text-amber-600 hover:bg-amber-50'
                                : 'text-emerald-700 hover:bg-emerald-50'
                            }`}
                            title={f.status === 'published' ? 'Unpublish Form' : 'Publish Form'}
                          >
                            {f.status === 'published' ? <XCircle size={15} /> : <CheckCircle2 size={15} />}
                          </button>

                          {/* Embed / Share Modal */}
                          <button
                            type="button"
                            onClick={() => setSelectedEmbedForm({ title: f.title, slug: f.slug })}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="Get Embed Code"
                          >
                            <Code2 size={15} />
                          </button>

                          {/* View Submissions */}
                          <button
                            type="button"
                            onClick={() => navigate(`/page-builder/submissions?form_id=${f.id}`)}
                            className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title="View Submissions"
                          >
                            <Users size={15} />
                          </button>

                          {/* Duplicate */}
                          <button
                            type="button"
                            disabled={isActionLoading}
                            onClick={() => handleDuplicate(f.id)}
                            className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title="Duplicate Form"
                          >
                            <Copy size={15} />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            disabled={isActionLoading}
                            onClick={() => handleDelete(f.id, f.title)}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Form"
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
            <ClipboardList size={32} className="text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700">No forms or surveys found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Build your first lead generation form or customer satisfaction survey with automatic CRM sync.
            </p>
            <button
              type="button"
              onClick={() => navigate('/page-builder/forms/create')}
              className="px-4 py-2 bg-[#166534] hover:bg-[#14532d] text-white rounded-xl text-xs font-bold transition-all shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Plus size={14} />
              <span>Create Form / Survey</span>
            </button>
          </div>
        )}
      </div>

      {/* Embed Modal */}
      {selectedEmbedForm && (
        <EmbedModal
          isOpen={!!selectedEmbedForm}
          onClose={() => setSelectedEmbedForm(null)}
          title={selectedEmbedForm.title}
          slug={selectedEmbedForm.slug}
          type="form"
        />
      )}
    </div>
  );
}

