import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Layout,
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
  Filter,
  RefreshCw,
  Globe,
  Sliders,
} from 'lucide-react';
import { pageBuilderApi } from '../../services/pageBuilderApi';
import { BuilderPage } from '../../types/pageBuilder';
import { toast } from '../../components/ui/Toast';
import { EmbedModal } from '../../components/pageBuilder/EmbedModal';
import { TemplateModal } from '../../components/pageBuilder/TemplateModal';
import { Sparkles } from 'lucide-react';

export default function LandingPagesListPage() {
  const navigate = useNavigate();
  const [pages, setPages] = useState<BuilderPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);

  // Embed Modal
  const [selectedEmbedPage, setSelectedEmbedPage] = useState<{ title: string; slug: string } | null>(null);

  const fetchPages = async () => {
    try {
      setLoading(true);
      const res = await pageBuilderApi.getPages({
        search: search.trim() || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
      });
      if (res.success && res.data) {
        setPages(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch pages:', err);
      toast.error('Failed to load landing pages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPages();
  };

  const handleTogglePublish = async (id: number) => {
    try {
      setActionLoadingId(id);
      const res = await pageBuilderApi.togglePublishPage(id);
      if (res.success && res.data) {
        toast.success(`Page ${res.data.status === 'published' ? 'published' : 'unpublished'} successfully!`);
        setPages((prev) => prev.map((p) => (p.id === id ? res.data : p)));
      }
    } catch (err) {
      toast.error('Failed to update page status');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDuplicate = async (id: number) => {
    try {
      setActionLoadingId(id);
      const res = await pageBuilderApi.duplicatePage(id);
      if (res.success && res.data) {
        toast.success('Landing page duplicated successfully!');
        setPages((prev) => [res.data, ...prev]);
      }
    } catch (err) {
      toast.error('Failed to duplicate page');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) return;

    try {
      setActionLoadingId(id);
      const res = await pageBuilderApi.deletePage(id);
      if (res.success) {
        toast.success('Page deleted successfully');
        setPages((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      toast.error('Failed to delete page');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleApplyTemplateFromList = async (template: { sections: any[]; theme: any; title: string }) => {
    try {
      const cleanSlug =
        template.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 10000);
      const res = await pageBuilderApi.createPage({
        title: template.title,
        slug: cleanSlug,
        category: 'landing_page',
        status: 'draft',
        sections: template.sections,
        theme: template.theme,
      });
      if (res.success && res.data) {
        toast.success(`Page created from "${template.title}"!`);
        navigate(`/page-builder/pages/edit/${res.data.id}`);
      }
    } catch (e: any) {
      toast.error('Failed to create page from template');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2.5">
            <Layout size={24} className="text-[#166534]" />
            <span>Landing Pages</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Create, publish, and manage conversion-focused landing pages and micro-sites.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setIsTemplateModalOpen(true)}
            className="px-3.5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-2 cursor-pointer"
          >
            <Sparkles size={16} className="text-amber-500" />
            <span>Turnkey Templates</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/page-builder/pages/create')}
            className="px-4 py-2.5 bg-[#166534] hover:bg-[#14532d] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <Plus size={16} />
            <span>Create Blank Page</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search pages by title or slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#166534] focus:bg-white"
          />
        </form>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          {/* Status Tabs */}
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
            onClick={fetchPages}
            disabled={loading}
            className="p-2 text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all cursor-pointer"
            title="Refresh"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Pages Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <RefreshCw size={24} className="animate-spin text-[#166534] mx-auto" />
            <p className="text-xs font-semibold">Loading landing pages...</p>
          </div>
        ) : pages.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Page Title & Slug</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Sections</th>
                  <th className="py-3 px-4 text-center">Views</th>
                  <th className="py-3 px-4 text-center">Leads</th>
                  <th className="py-3 px-4">Last Updated</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {pages.map((p) => {
                  const isActionLoading = actionLoadingId === p.id;
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800">{p.title}</div>
                        <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 mt-0.5">
                          <span>/p/{p.slug}</span>
                          <a
                            href={`/p/${p.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[#166534] hover:underline"
                            title="Open public page"
                          >
                            <ExternalLink size={11} />
                          </a>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 capitalize">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-semibold">
                          {p.category || 'General'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                            p.status === 'published'
                              ? 'bg-emerald-50 text-[#166534] border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center text-slate-600 font-semibold">
                        {p.sections?.length || 0}
                      </td>
                      <td className="py-3.5 px-4 text-center text-slate-600">
                        {p.view_count || 0}
                      </td>
                      <td className="py-3.5 px-4 text-center text-emerald-800 font-bold">
                        {p.submission_count || 0}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                        {new Date(p.updated_at).toLocaleDateString([], {
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
                            onClick={() => navigate(`/page-builder/pages/edit/${p.id}`)}
                            className="p-1.5 text-[#166534] hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit Page"
                          >
                            <Edit3 size={15} />
                          </button>

                          {/* Toggle Publish */}
                          <button
                            type="button"
                            disabled={isActionLoading}
                            onClick={() => handleTogglePublish(p.id)}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                              p.status === 'published'
                                ? 'text-amber-600 hover:bg-amber-50'
                                : 'text-emerald-700 hover:bg-emerald-50'
                            }`}
                            title={p.status === 'published' ? 'Unpublish Page' : 'Publish Page'}
                          >
                            {p.status === 'published' ? <XCircle size={15} /> : <CheckCircle2 size={15} />}
                          </button>

                          {/* Embed / Share Modal */}
                          <button
                            type="button"
                            onClick={() => setSelectedEmbedPage({ title: p.title, slug: p.slug })}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="Get Embed Code"
                          >
                            <Code2 size={15} />
                          </button>

                          {/* Duplicate */}
                          <button
                            type="button"
                            disabled={isActionLoading}
                            onClick={() => handleDuplicate(p.id)}
                            className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title="Duplicate Page"
                          >
                            <Copy size={15} />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            disabled={isActionLoading}
                            onClick={() => handleDelete(p.id, p.title)}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Page"
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
            <Layout size={32} className="text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700">No landing pages found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Get started by creating your first page with our section builder and responsive templates.
            </p>
            <button
              type="button"
              onClick={() => navigate('/page-builder/pages/create')}
              className="px-4 py-2 bg-[#166534] hover:bg-[#14532d] text-white rounded-xl text-xs font-bold transition-all shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Plus size={14} />
              <span>Create Landing Page</span>
            </button>
          </div>
        )}
      </div>

      {/* Embed Modal */}
      {selectedEmbedPage && (
        <EmbedModal
          isOpen={!!selectedEmbedPage}
          onClose={() => setSelectedEmbedPage(null)}
          title={selectedEmbedPage.title}
          slug={selectedEmbedPage.slug}
          type="page"
        />
      )}

      {/* Turnkey Templates Modal */}
      <TemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onApplyTemplate={handleApplyTemplateFromList}
      />
    </div>
  );
}

