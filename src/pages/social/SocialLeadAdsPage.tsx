import React, { useState, useEffect, useCallback } from 'react';
import {
  Share2,
  Facebook,
  Instagram,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  ArrowRight,
  Download,
  Filter,
  Search,
  ExternalLink,
  Sliders,
  Settings,
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  TrendingUp,
  FileText,
  RotateCcw,
  Check,
  X,
  Play,
  Pause,
} from 'lucide-react';
import {
  MetaLeadAccount,
  MetaLeadForm,
  MetaLeadSubmission,
  LeadAdsMetrics,
} from '../../types/metaLeadAds';
import { metaLeadAdsApi } from '../../services/metaLeadAdsApi';
import { FieldMappingModal } from '../../components/social/FieldMappingModal';
import { LeadDetailsModal } from '../../components/social/LeadDetailsModal';
import { toast } from '../../components/ui/Toast';

export default function SocialLeadAdsPage() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [syncingPageId, setSyncingPageId] = useState<number | null>(null);
  const [importingFormId, setImportingFormId] = useState<number | null>(null);

  // Data states
  const [accounts, setAccounts] = useState<MetaLeadAccount[]>([]);
  const [forms, setForms] = useState<MetaLeadForm[]>([]);
  const [metrics, setMetrics] = useState<LeadAdsMetrics | null>(null);
  const [submissions, setSubmissions] = useState<MetaLeadSubmission[]>([]);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });

  // Filters
  const [activeTab, setActiveTab] = useState<'forms' | 'submissions'>('forms');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPageFilter, setSelectedPageFilter] = useState<string>('all');

  // Modals
  const [mappingForm, setMappingForm] = useState<MetaLeadForm | null>(null);
  const [detailsSubmission, setDetailsSubmission] = useState<MetaLeadSubmission | null>(null);

  // Load all initial data
  const loadData = useCallback(async () => {
    try {
      const [accRes, formsRes, metricsRes, subRes] = await Promise.allSettled([
        metaLeadAdsApi.getAccounts(),
        metaLeadAdsApi.getForms(),
        metaLeadAdsApi.getMetrics(),
        metaLeadAdsApi.getSubmissions({ per_page: 15 }),
      ]);

      if (accRes.status === 'fulfilled' && accRes.value.data) {
        setAccounts(accRes.value.data);
      }
      if (formsRes.status === 'fulfilled' && formsRes.value.data) {
        setForms(formsRes.value.data);
      }
      if (metricsRes.status === 'fulfilled' && metricsRes.value.data) {
        setMetrics(metricsRes.value.data);
      }
      if (subRes.status === 'fulfilled' && subRes.value.data) {
        setSubmissions(subRes.value.data.data);
        setPagination({
          current_page: subRes.value.data.current_page,
          last_page: subRes.value.data.last_page,
          total: subRes.value.data.total,
        });
      }
    } catch (e: any) {
      toast.error('Failed to load Lead Ads data.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();

    // Check for success or error query param from OAuth redirect
    const params = new URLSearchParams(window.location.search);
    if (params.get('oauth') === 'success' || params.has('connected')) {
      toast.success('Meta Lead Retrieval permissions updated successfully!');
      window.history.replaceState({}, document.title, window.location.pathname);
      loadData();
    } else if (params.get('oauth') === 'error' || params.has('error')) {
      toast.error(params.get('message') || 'Meta authorization was cancelled or failed.');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [loadData]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  // Re-authorize with Meta Lead Ads Scopes
  const handleReauthorize = async () => {
    try {
      const res = await metaLeadAdsApi.getOAuthUrl();
      if (res.success && res.data?.authorization_url) {
        window.location.href = res.data.authorization_url;
      }
    } catch (e: any) {
      toast.error('Failed to generate Meta re-authorization link.');
    }
  };

  // Sync forms for all connected Facebook Pages or a specific one
  const handleSyncForms = async (socialAccountId?: number) => {
    const fbAccounts = accounts.filter((a) => a.platform === 'facebook');
    const targetAccounts = socialAccountId
      ? fbAccounts.filter((a) => a.id === socialAccountId)
      : fbAccounts;

    if (targetAccounts.length === 0) {
      toast.error('No connected Facebook Pages found to sync.');
      return;
    }

    setSyncingPageId(socialAccountId || -1);
    let totalSynced = 0;
    try {
      for (const acc of targetAccounts) {
        try {
          const res = await metaLeadAdsApi.syncRemoteForms(acc.id);
          if (res.success && res.data) {
            totalSynced += res.data.length;
          }
        } catch (err: any) {
          console.warn(`Sync warning for ${acc.name}:`, err);
        }
      }

      toast.success(`Synchronized ${totalSynced} lead form(s) from Meta!`);
      const formsRes = await metaLeadAdsApi.getForms();
      if (formsRes.data) setForms(formsRes.data);
      const metricsRes = await metaLeadAdsApi.getMetrics();
      if (metricsRes.data) setMetrics(metricsRes.data);
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Failed to sync forms from Meta.');
    } finally {
      setSyncingPageId(null);
    }
  };

  // Toggle form active/paused
  const handleToggleForm = async (form: MetaLeadForm) => {
    const newActive = !form.is_active;
    try {
      const res = await metaLeadAdsApi.updateForm(form.id, { is_active: newActive });
      if (res.success) {
        setForms((prev) =>
          prev.map((f) => (f.id === form.id ? { ...f, is_active: newActive } : f))
        );
        toast.success(`Form "${form.name}" ${newActive ? 'activated' : 'paused'}.`);
      }
    } catch (e: any) {
      toast.error('Failed to toggle form status.');
    }
  };

  // Import historical leads
  const handleImportHistorical = async (form: MetaLeadForm) => {
    setImportingFormId(form.id);
    try {
      const res = await metaLeadAdsApi.importHistoricalLeads(form.id, 50);
      if (res.success) {
        toast.success(res.message);
        loadData();
      }
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Failed to import historical leads.');
    } finally {
      setImportingFormId(null);
    }
  };

  // Facebook accounts & capability status
  const fbAccounts = accounts.filter((a) => a.platform === 'facebook');
  const readyFbAccounts = fbAccounts.filter(
    (a) => a.permissions?.leads_retrieval || a.is_ready_for_lead_ads
  );
  // Only needs upgrade if there are connected Facebook accounts, but none of them have lead retrieval permissions
  const needsPermissionUpgrade = fbAccounts.length > 0 && readyFbAccounts.length === 0;

  // Filtered forms
  const filteredForms = forms.filter((f) => {
    if (selectedPageFilter !== 'all' && String(f.social_account_id) !== selectedPageFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const s = searchQuery.toLowerCase();
      return f.name.toLowerCase().includes(s) || f.form_id.includes(s);
    }
    return true;
  });

  // Filtered submissions
  const filteredSubmissions = submissions.filter((sub) => {
    if (selectedStatus !== 'all' && sub.sync_status !== selectedStatus) {
      return false;
    }
    if (searchQuery.trim()) {
      const s = searchQuery.toLowerCase();
      return (
        sub.leadgen_id.includes(s) ||
        (sub.contact?.name || '').toLowerCase().includes(s) ||
        (sub.contact?.email || '').toLowerCase().includes(s) ||
        (sub.form?.name || '').toLowerCase().includes(s)
      );
    }
    return true;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-3 border-[#166534]/30 border-t-[#166534] rounded-full animate-spin mb-3" />
        <p className="text-xs text-slate-500 font-medium">Connecting to Meta Lead Ads engine...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-gradient-to-tr from-[#1877F2]/20 to-[#E4405F]/20 text-[#1877F2] rounded-xl border border-blue-200/50 shadow-2xs">
              <Share2 size={20} className="text-[#12263A]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Facebook & Instagram Lead Ads
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Automatically capture leads submitted via Meta Instant Forms directly into CRM Contacts.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all shadow-2xs cursor-pointer"
            title="Refresh"
          >
            <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
          </button>

          {needsPermissionUpgrade && (
            <button
              type="button"
              onClick={handleReauthorize}
              className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <ShieldAlert size={14} />
              Upgrade Meta Permissions
            </button>
          )}

          {accounts.length > 0 && (
            <button
              type="button"
              onClick={() => handleSyncForms()}
              disabled={syncingPageId !== null}
              className="px-4 py-2 bg-[#166534] hover:bg-[#14532d] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw size={14} className={syncingPageId !== null ? 'animate-spin' : ''} />
              {syncingPageId !== null ? 'Syncing Forms...' : 'Sync Meta Forms'}
            </button>
          )}
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Forms</p>
          <p className="text-xl font-extrabold text-slate-900 mt-1">{metrics?.total_forms || forms.length}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Discovered forms</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Sync</p>
          <p className="text-xl font-extrabold text-emerald-700 mt-1">{metrics?.active_forms || 0}</p>
          <p className="text-[11px] text-emerald-600 mt-0.5">Live webhooks enabled</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Leads</p>
          <p className="text-xl font-extrabold text-slate-900 mt-1">{metrics?.total_leads || 0}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">From Meta Ads</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Synced to CRM</p>
          <p className="text-xl font-extrabold text-[#166534] mt-1">{metrics?.synced_leads || 0}</p>
          <p className="text-[11px] text-emerald-600 mt-0.5">Contacts created/updated</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Failed / Attention</p>
          <p className={`text-xl font-extrabold mt-1 ${metrics?.failed_leads ? 'text-rose-600' : 'text-slate-400'}`}>
            {metrics?.failed_leads || 0}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Requires retry</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Success Rate</p>
          <p className="text-xl font-extrabold text-slate-900 mt-1">{metrics?.sync_success_rate ?? 100}%</p>
          <p className="text-[11px] text-emerald-600 mt-0.5">Webhook health</p>
        </div>
      </div>

      {/* Permissions & Connected Pages Alert */}
      {fbAccounts.length === 0 ? (
        <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle size={20} className="text-amber-600 shrink-0" />
            <div>
              <p className="text-xs font-bold text-amber-900">No Facebook Pages Connected</p>
              <p className="text-[11px] text-amber-700">
                Connect your Facebook Page in the Social Accounts section to capture and sync Meta Lead Ads forms.
              </p>
            </div>
          </div>
          <a
            href="/social-planner/accounts"
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold shrink-0 transition-colors"
          >
            Connect Page
          </a>
        </div>
      ) : needsPermissionUpgrade ? (
        <div className="bg-blue-50/80 border border-blue-200 rounded-2xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldAlert size={20} className="text-blue-600 shrink-0" />
            <div>
              <p className="text-xs font-bold text-blue-900">Additional Meta Permissions Needed: `leads_retrieval`</p>
              <p className="text-[11px] text-blue-700">
                To automatically download submitted form answers from Meta Ads, please reauthorize your Meta connection with Lead Retrieval privileges.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleReauthorize}
            className="px-3.5 py-1.5 bg-[#1877F2] hover:bg-[#166fe5] text-white rounded-lg text-xs font-bold shrink-0 transition-colors shadow-2xs cursor-pointer flex items-center gap-1.5"
          >
            <Facebook size={14} />
            Authorize Lead Retrieval
          </button>
        </div>
      ) : (
        <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-3 px-4 flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2.5">
            <ShieldCheck size={18} className="text-[#166534]" />
            <span className="font-semibold text-emerald-950">
              Meta Lead Ads Webhook Engine Ready
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-600">
              {readyFbAccounts.length} Facebook Page(s) ready for real-time lead capture.
            </span>
          </div>
          <span className="text-[11px] font-bold text-[#166534] bg-emerald-100/70 px-2 py-0.5 rounded-full border border-emerald-200">
            Webhook Active
          </span>
        </div>
      )}

      {/* Main Tabs Navigation */}
      <div className="flex items-center justify-between border-b border-slate-200">
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={() => setActiveTab('forms')}
            className={`pb-3 text-xs font-bold transition-all relative cursor-pointer ${
              activeTab === 'forms' ? 'text-[#166534]' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Lead Forms ({forms.length})
            {activeTab === 'forms' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#166534] rounded-full" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('submissions')}
            className={`pb-3 text-xs font-bold transition-all relative cursor-pointer ${
              activeTab === 'submissions' ? 'text-[#166534]' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Submissions Audit Log ({metrics?.total_leads || submissions.length})
            {activeTab === 'submissions' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#166534] rounded-full" />
            )}
          </button>
        </div>

        {/* Filters & Search */}
        <div className="flex items-center gap-2 pb-2">
          {accounts.filter((a) => a.platform === 'facebook').length > 1 && (
            <select
              value={selectedPageFilter}
              onChange={(e) => setSelectedPageFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 font-medium text-slate-700 focus:bg-white focus:outline-none focus:border-[#166534]"
            >
              <option value="all">All Pages ({accounts.filter((a) => a.platform === 'facebook').length})</option>
              {accounts.filter((a) => a.platform === 'facebook').map((acc) => (
                <option key={acc.id} value={String(acc.id)}>
                  {acc.name}
                </option>
              ))}
            </select>
          )}

          <div className="relative">
            <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search forms or leads..."
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#166534] w-52 transition-all"
            />
          </div>
        </div>
      </div>

      {/* TAB 1: Lead Forms View */}
      {activeTab === 'forms' && (
        <div className="space-y-4">
          {filteredForms.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
              <Layers size={36} className="mx-auto text-slate-300 mb-3" />
              <h3 className="text-sm font-bold text-slate-800">No Lead Ads Forms Found</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
                Click "Sync Meta Forms" to fetch active lead generation forms from your connected Facebook Pages and Instagram accounts.
              </p>
              {accounts.length > 0 && (
                <button
                  type="button"
                  onClick={() => handleSyncForms()}
                  disabled={syncingPageId !== null}
                  className="px-4 py-2 bg-[#166534] text-white rounded-xl text-xs font-bold shadow-xs hover:bg-[#14532d] transition-all inline-flex items-center gap-2 cursor-pointer"
                >
                  <RefreshCw size={13} className={syncingPageId !== null ? 'animate-spin' : ''} />
                  Fetch Forms Now
                </button>
              )}
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                      <th className="py-3 px-4">Form Name & ID</th>
                      <th className="py-3 px-4">Connected Page</th>
                      <th className="py-3 px-4 text-center">Questions</th>
                      <th className="py-3 px-4 text-center">Submissions</th>
                      <th className="py-3 px-4 text-center">Real-Time Sync</th>
                      <th className="py-3 px-4 text-center">Field Mapping</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredForms.map((form) => {
                      const questionsCount = form.questions?.length || 0;
                      const mappedCount = Object.keys(form.crm_mapping || {}).length;

                      return (
                        <tr key={form.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3.5 px-4 min-w-[220px]">
                            <p className="font-bold text-slate-900 truncate max-w-[240px]" title={form.name}>
                              {form.name}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="font-mono text-[10px] text-slate-400">ID: {form.form_id}</span>
                              <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded uppercase ${
                                form.status === 'ACTIVE'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-slate-100 text-slate-600'
                              }`}>
                                {form.status}
                              </span>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2">
                              <div className="p-1 rounded bg-blue-50 text-blue-600">
                                <Facebook size={14} />
                              </div>
                              <span className="font-semibold text-slate-700 truncate max-w-[150px]">
                                {form.social_account?.name || 'Facebook Page'}
                              </span>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 text-center">
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-bold text-[11px] rounded-md">
                              {questionsCount} fields
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-center font-extrabold text-slate-800">
                            {form.submissions_count}
                          </td>

                          <td className="py-3.5 px-4 text-center">
                            <button
                              type="button"
                              onClick={() => handleToggleForm(form)}
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors cursor-pointer ${
                                form.is_active
                                  ? 'bg-emerald-50 text-[#166534] border-emerald-200 hover:bg-emerald-100'
                                  : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                              }`}
                            >
                              {form.is_active ? <Play size={10} className="fill-current" /> : <Pause size={10} />}
                              {form.is_active ? 'Active' : 'Paused'}
                            </button>
                          </td>

                          <td className="py-3.5 px-4 text-center">
                            <button
                              type="button"
                              onClick={() => setMappingForm(form)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-slate-700 hover:text-[#166534] bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 rounded-lg font-semibold text-[11px] transition-colors cursor-pointer"
                            >
                              <Sliders size={12} />
                              {mappedCount > 0 ? `${mappedCount} Mapped` : 'Set Mapping'}
                            </button>
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                disabled={importingFormId === form.id}
                                onClick={() => handleImportHistorical(form)}
                                className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                                title="Import Past Eligible Leads"
                              >
                                <Download size={14} className={importingFormId === form.id ? 'animate-bounce' : ''} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Submissions Audit Log */}
      {activeTab === 'submissions' && (
        <div className="space-y-4">
          {/* Status Filter Pills */}
          <div className="flex items-center gap-2">
            {['all', 'synced', 'duplicate', 'failed', 'pending'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-colors cursor-pointer ${
                  selectedStatus === st
                    ? 'bg-[#166534] text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {filteredSubmissions.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
              <CheckCircle2 size={36} className="mx-auto text-slate-300 mb-3" />
              <h3 className="text-sm font-bold text-slate-800">No Lead Submissions Found</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                Leads submitted through Meta Instant Forms on Facebook or Instagram will appear here in real-time.
              </p>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                      <th className="py-3 px-4">Lead ID & Platform</th>
                      <th className="py-3 px-4">Form</th>
                      <th className="py-3 px-4">Contact Extracted</th>
                      <th className="py-3 px-4">Ad / Campaign</th>
                      <th className="py-3 px-4 text-center">Sync Status</th>
                      <th className="py-3 px-4 text-right">Received</th>
                      <th className="py-3 px-4 text-right">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredSubmissions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <div className={`p-1 rounded ${
                              sub.platform === 'instagram' ? 'bg-pink-50 text-pink-600' : 'bg-blue-50 text-blue-600'
                            }`}>
                              {sub.platform === 'instagram' ? <Instagram size={13} /> : <Facebook size={13} />}
                            </div>
                            <div>
                              <p className="font-mono text-xs font-bold text-slate-900">{sub.leadgen_id}</p>
                              <p className="text-[10px] text-slate-400 capitalize">{sub.platform}</p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-semibold text-slate-800">
                          {sub.form?.name || sub.form_id}
                        </td>

                        <td className="py-3.5 px-4">
                          {sub.contact ? (
                            <div>
                              <p className="font-bold text-slate-900">{sub.contact.name}</p>
                              <p className="text-[10px] text-slate-400">{sub.contact.email || sub.contact.phone}</p>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">No contact linked</span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-slate-600">
                          <p className="font-medium truncate max-w-[140px]" title={sub.ad_name || 'N/A'}>
                            {sub.ad_name || 'N/A'}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate max-w-[140px]" title={sub.campaign_name || ''}>
                            {sub.campaign_name || ''}
                          </p>
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                              sub.sync_status === 'synced'
                                ? 'bg-emerald-50 text-[#166534] border-emerald-200'
                                : sub.sync_status === 'duplicate'
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : sub.sync_status === 'failed'
                                ? 'bg-rose-50 text-rose-700 border-rose-200'
                                : 'bg-slate-50 text-slate-700 border-slate-200'
                            }`}
                          >
                            {sub.sync_status}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right text-slate-500 font-mono text-[11px]">
                          {new Date(sub.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => setDetailsSubmission(sub)}
                            className="px-2.5 py-1 text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Field Mapping Modal */}
      {mappingForm && (
        <FieldMappingModal
          form={mappingForm}
          onClose={() => setMappingForm(null)}
          onSaved={(updated) => {
            setForms((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
          }}
        />
      )}

      {/* Lead Details Modal */}
      {detailsSubmission && (
        <LeadDetailsModal
          submission={detailsSubmission}
          onClose={() => setDetailsSubmission(null)}
          onRetried={(updated) => {
            setSubmissions((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
            setDetailsSubmission(updated);
          }}
        />
      )}
    </div>
  );
}

