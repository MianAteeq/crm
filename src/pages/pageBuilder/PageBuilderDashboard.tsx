import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Layers,
  FileText,
  CheckCircle2,
  Users,
  Eye,
  TrendingUp,
  Plus,
  ArrowRight,
  ExternalLink,
  Sparkles,
  ClipboardList,
  Layout,
  RefreshCw,
  Globe,
  Sliders,
} from 'lucide-react';
import { pageBuilderApi } from '../../services/pageBuilderApi';
import { DashboardMetrics, BuilderPage, BuilderForm } from '../../types/pageBuilder';
import { toast } from '../../components/ui/Toast';

export default function PageBuilderDashboard() {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const res = await pageBuilderApi.getMetrics();
      if (res.success && res.data) {
        setMetrics(res.data);
      }
    } catch (err: any) {
      console.error('Failed to load builder metrics:', err);
      toast.error('Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const kpis = [
    {
      label: 'Landing Pages',
      value: metrics?.total_pages ?? 0,
      sub: `${metrics?.published_pages ?? 0} published`,
      icon: Layout,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50 border-indigo-100',
    },
    {
      label: 'Forms & Surveys',
      value: metrics?.total_forms ?? 0,
      sub: `${metrics?.published_forms ?? 0} published`,
      icon: ClipboardList,
      color: 'text-emerald-700',
      bgColor: 'bg-emerald-50 border-emerald-100',
    },
    {
      label: 'Total Submissions',
      value: metrics?.total_submissions ?? 0,
      sub: 'All-time responses',
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 border-blue-100',
    },
    {
      label: 'Leads Generated',
      value: metrics?.leads_generated ?? 0,
      sub: 'Synced to CRM Contacts',
      icon: Users,
      color: 'text-[#166534]',
      bgColor: 'bg-emerald-50 border-emerald-200',
    },
    {
      label: 'Avg Conversion',
      value: `${metrics?.conversion_rate ?? 0}%`,
      sub: `${metrics?.total_views ?? 0} page views`,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 border-purple-100',
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#166534] flex items-center justify-center shadow-2xs">
              <Layers size={22} />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
                Page & Form Builder
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Build high-converting landing pages, lead capture forms, and surveys with automatic CRM lead sync.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={fetchMetrics}
            disabled={loading}
            className="p-2.5 text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all cursor-pointer"
            title="Refresh Metrics"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>

          <button
            type="button"
            onClick={() => navigate('/page-builder/forms/create')}
            className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-2 cursor-pointer"
          >
            <Plus size={15} className="text-[#166534]" />
            <span>New Form / Survey</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/page-builder/pages/create')}
            className="px-4 py-2.5 bg-[#166534] hover:bg-[#14532d] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <Plus size={15} />
            <span>Create Landing Page</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className={`p-4 rounded-2xl border ${kpi.bgColor} bg-white shadow-xs flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500">{kpi.label}</span>
                <div className={`p-1.5 rounded-lg ${kpi.color} bg-white/80 shadow-2xs`}>
                  <Icon size={16} />
                </div>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight">
                  {kpi.value}
                </p>
                <p className="text-[11px] font-semibold text-slate-400 mt-0.5">{kpi.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Recent Pages & Recent Submissions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Recent Pages (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layout size={18} className="text-[#166534]" />
              <h2 className="text-sm font-bold text-slate-800">Recent Landing Pages</h2>
            </div>
            <button
              type="button"
              onClick={() => navigate('/page-builder/pages')}
              className="text-xs font-bold text-[#166534] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All Pages</span>
              <ArrowRight size={13} />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {metrics?.recent_pages && metrics.recent_pages.length > 0 ? (
              metrics.recent_pages.map((p) => (
                <div key={p.id} className="p-4 hover:bg-slate-50/70 transition-colors flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800 truncate">{p.title}</span>
                      <span
                        className={`px-2 py-0.5 text-[10px] font-extrabold uppercase rounded-full ${
                          p.status === 'published'
                            ? 'bg-emerald-50 text-[#166534] border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {p.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                      <span>/{p.slug}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Eye size={11} /> {p.view_count || 0} views
                      </span>
                      <span>•</span>
                      <span>{p.submission_count || 0} leads</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={`/p/${p.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 text-slate-400 hover:text-slate-700 bg-white border border-slate-200 rounded-lg shadow-2xs hover:bg-slate-50 transition-colors"
                      title="Preview Public Page"
                    >
                      <ExternalLink size={13} />
                    </a>
                    <button
                      type="button"
                      onClick={() => navigate(`/page-builder/pages/edit/${p.id}`)}
                      className="px-3 py-1.5 text-xs font-bold text-[#166534] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
                    >
                      Edit Page
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <Layout size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-700">No landing pages created yet</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Build your first high-converting page using drag-and-drop sections.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/page-builder/pages/create')}
                  className="px-4 py-2 bg-[#166534] hover:bg-[#14532d] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Plus size={14} />
                  <span>Create Landing Page</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Recent Submissions & Leads Feed (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users size={18} className="text-[#166534]" />
              <h2 className="text-sm font-bold text-slate-800">Recent Leads & Submissions</h2>
            </div>
            <button
              type="button"
              onClick={() => navigate('/page-builder/submissions')}
              className="text-xs font-bold text-[#166534] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight size={13} />
            </button>
          </div>

          <div className="divide-y divide-slate-100 max-h-[380px] overflow-y-auto custom-scrollbar">
            {metrics?.recent_submissions && metrics.recent_submissions.length > 0 ? (
              metrics.recent_submissions.map((sub) => {
                const submitterName =
                  sub.data?.name || sub.data?.full_name || sub.contact?.name || 'Anonymous Submitter';
                const submitterEmail = sub.data?.email || sub.contact?.email;
                const formTitle = sub.form?.title || 'Lead Form';

                return (
                  <div key={sub.id} className="p-3.5 hover:bg-slate-50 transition-colors space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800 truncate">{submitterName}</span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(sub.created_at).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span className="truncate max-w-[180px]">{submitterEmail || formTitle}</span>
                      {sub.contact_id ? (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-emerald-50 text-[#166534] border border-emerald-200">
                          Synced Contact #{sub.contact_id}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-slate-100 text-slate-500">
                          Response
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center space-y-2">
                <ClipboardList size={24} className="text-slate-400 mx-auto" />
                <p className="text-xs font-bold text-slate-700">No submissions yet</p>
                <p className="text-[11px] text-slate-400">
                  Submissions from your published forms will stream directly into CRM Contacts.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

