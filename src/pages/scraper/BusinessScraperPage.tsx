import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Search,
  MapPin,
  Globe,
  Mail,
  Phone,
  Building2,
  ExternalLink,
  Download,
  Trash2,
  UserPlus,
  Play,
  RotateCw,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Layers,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckSquare,
  Square,
  Sparkles,
  Info,
  Clock,
  ShieldCheck,
  Briefcase,
  ChevronDown,
  ChevronUp,
  Star,
  Eye,
  X,
  Copy,
  Check,
  Award,
  History,
  UserCheck,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  scraperApi,
  ScraperSearchItem,
  ScrapedBusinessItem,
  ContactEnrichmentLogItem,
  ScraperStatus,
  ScraperStats,
  PaginatedResponse,
} from '../../services/scraperApi';
import { crmApi } from '../../services/crmApi';
import { Category } from '../../types';
import { toast } from '../../components/ui/Toast';

export default function BusinessScraperPage() {
  // Navigation / Tabs
  const [activeTab, setActiveTab] = useState<'search' | 'results' | 'history'>('search');

  // Status & Stats
  const [status, setStatus] = useState<ScraperStatus | null>(null);
  const [stats, setStats] = useState<ScraperStats | null>(null);

  // Form State
  const [keyword, setKeyword] = useState('');
  const [industry, setIndustry] = useState('');
  const [location, setLocation] = useState('');
  const [coverageRadius, setCoverageRadius] = useState<number>(25000); // 25 km Metro default
  const [leadVolume, setLeadVolume] = useState<number>(5000); // Up to 5,000 default
  const [searchMode, setSearchMode] = useState<'standard' | 'deep'>('deep'); // Deep Search by default
  const [emailDiscoveryMode, setEmailDiscoveryMode] = useState<'basic' | 'website_contact' | 'deep'>('website_contact');
  
  // Data to Collect Checkboxes
  const [dataToCollect, setDataToCollect] = useState({
    business_name: true,
    website: true,
    email: true,
    phone: true,
    address: true,
    google_maps_url: true,
    rating: false,
    reviews: false,
    category: true,
    social_profiles: false,
  });

  // Lead Requirements Checkboxes
  const [leadRequirements, setLeadRequirements] = useState({
    must_have_email: true,
    must_have_website: false,
    must_have_phone: false,
  });

  // Duplicate Handling
  const [autoDeduplicate, setAutoDeduplicate] = useState(true);

  // Advanced Options Accordion
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [advancedOptions, setAdvancedOptions] = useState({
    min_rating: 0,
    min_reviews: 0,
    business_status: 'all',
    check_homepage: true,
    check_contact: true,
    check_about: true,
    max_pages: 3,
    timeout: 10,
    retry_attempts: 3,
    concurrency: 5,
    dedup_place_id: true,
    dedup_domain: true,
    dedup_name_address: true,
    dedup_email: true,
  });

  const [isStartingSearch, setIsStartingSearch] = useState(false);

  // Active / Live Search Monitoring
  const [activeSearch, setActiveSearch] = useState<ScraperSearchItem | null>(null);
  const pollingRef = useRef<any>(null);

  // Results State
  const [results, setResults] = useState<ScrapedBusinessItem[]>([]);
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  const [pagination, setPagination] = useState<PaginatedResponse<ScrapedBusinessItem> | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(15);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Result Filter Tab
  const [resultFilterTab, setResultFilterTab] = useState<
    'all' | 'not_in_crm' | 'in_crm' | 'email_found' | 'no_email' | 'website_found' | 'no_website' | 'duplicates_removed' | 'failed'
  >('all');
  const [filterSearch, setFilterSearch] = useState('');
  const [filterSearchId, setFilterSearchId] = useState<string>('');

  // Business Detail Drawer / Modal
  const [selectedBusiness, setSelectedBusiness] = useState<ScrapedBusinessItem | null>(null);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [auditLogs, setAuditLogs] = useState<ContactEnrichmentLogItem[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);
  const [showAuditLogs, setShowAuditLogs] = useState(false);

  // Enrichment Action States
  const [enrichingId, setEnrichingId] = useState<number | null>(null);
  const [isBulkEnriching, setIsBulkEnriching] = useState(false);

  // History State
  const [historySearches, setHistorySearches] = useState<ScraperSearchItem[]>([]);
  const [historyPagination, setHistoryPagination] = useState<PaginatedResponse<ScraperSearchItem> | null>(null);
  const [historyPage, setHistoryPage] = useState(1);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // CRM Import State & Category Management (Requirement 2, 6, 18, 19)
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [categoryStats, setCategoryStats] = useState<any | null>(null);
  const [isLoadingCategoryStats, setIsLoadingCategoryStats] = useState(false);

  const [isImporting, setIsImporting] = useState(false);
  const [importSummaryModal, setImportSummaryModal] = useState<{
    isOpen: boolean;
    discovered: number;
    already_existing: number;
    new_businesses: number;
    existing_businesses_enriched: number;
    new_contacts: number;
    existing_contacts_enriched: number;
    duplicates_prevented: number;
    failed: number;
    final_unique: number;
    created: number;
    enriched: number;
    already_up_to_date: number;
    total: number;
    errors: string[];
  }>({
    isOpen: false,
    discovered: 0,
    already_existing: 0,
    new_businesses: 0,
    existing_businesses_enriched: 0,
    new_contacts: 0,
    existing_contacts_enriched: 0,
    duplicates_prevented: 0,
    failed: 0,
    final_unique: 0,
    created: 0,
    enriched: 0,
    already_up_to_date: 0,
    total: 0,
    errors: [],
  });

  // Popular Search Chips
  const popularChips = [
    'Dental Clinic',
    'Real Estate Agency',
    'Digital Marketing',
    'Law Firm',
    'Fitness Gym',
    'Software Company',
    'Restaurant & Cafe',
  ];

  // Industry Dropdown Options
  const industryOptions = [
    'Healthcare',
    'Dental',
    'Aesthetic',
    'Real Estate',
    'Technology',
    'Digital Marketing',
    'Legal',
    'Accounting & Tax',
    'Education',
    'Construction',
    'Architecture',
    'Manufacturing',
    'Packaging',
    'Logistics',
    'Travel',
    'Automotive',
    'Hospitality',
    'Retail',
    'Professional Services',
    'Other',
  ];

  // Load Status and Stats
  const loadStatus = async () => {
    try {
      const res = await scraperApi.getStatus();
      setStatus(res.status);
      setStats(res.stats);
    } catch (e) {
      console.warn('Failed to load scraper status', e);
    }
  };

  // Load Results
  const loadResults = async (page = 1, searchIdOverride?: string | number) => {
    setIsLoadingResults(true);
    try {
      const searchIdVal = searchIdOverride !== undefined ? searchIdOverride : filterSearchId;
      const data = await scraperApi.getResults({
        page,
        per_page: perPage,
        search_id: searchIdVal ? Number(searchIdVal) : undefined,
        tab: resultFilterTab,
        search: filterSearch.trim() || undefined,
      });
      setResults(data.data || []);
      setPagination(data);
      setCurrentPage(data.current_page || 1);
    } catch (e) {
      console.error('Failed to load scraper results', e);
    } finally {
      setIsLoadingResults(false);
    }
  };

  // Load Searches History
  const loadHistory = async (page = 1) => {
    setIsLoadingHistory(true);
    try {
      const data = await scraperApi.getSearches(page, 10);
      const list = data.data || [];
      setHistorySearches(list);
      setHistoryPagination(data);
      setHistoryPage(data.current_page || 1);

      // Auto-attach running or latest search if activeSearch is not set or needs live sync
      const running = list.find((s: ScraperSearchItem) => s.status === 'processing');
      if (running) {
        setActiveSearch((prev) => (!prev || prev.id === running.id ? running : prev));
      } else if (list.length > 0) {
        setActiveSearch((prev) => prev ?? list[0]);
      }
    } catch (e) {
      console.error('Failed to load scraper history', e);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Initial Load
  useEffect(() => {
    loadStatus();
    loadResults(1);
    loadHistory(1);
  }, []);

  // Filter effect for results
  useEffect(() => {
    const timer = setTimeout(() => {
      loadResults(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [filterSearch, resultFilterTab, filterSearchId, perPage]);

  // Polling for Active Search Progress
  useEffect(() => {
    if (!activeSearch || activeSearch.status === 'completed' || activeSearch.status === 'failed') {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
      return;
    }

    pollingRef.current = setInterval(async () => {
      try {
        const updated = await scraperApi.getSearchProgress(activeSearch.id);
        setActiveSearch(updated);
        setHistorySearches((prev) =>
          prev.map((item) => (item.id === updated.id ? updated : item))
        );
        if (updated.status === 'completed' || updated.status === 'failed') {
          clearInterval(pollingRef.current);
          pollingRef.current = null;
          loadStatus();
          loadResults(1, updated.id);
          loadHistory(1);
          if (updated.status === 'completed') {
            toast.success(
              'Discovery Completed',
              `Discovered ${updated.total_found} businesses and ${updated.total_emails_found} public emails.`
            );
          }
        }
      } catch (err) {
        console.warn('Error polling search progress', err);
      }
    }, 2500);

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [activeSearch?.id, activeSearch?.status]);

  // Auto-refresh history periodically if any search is processing
  useEffect(() => {
    const hasProcessing = historySearches.some((s) => s.status === 'processing');
    if (!hasProcessing) return;

    const interval = setInterval(() => {
      loadHistory(historyPage);
    }, 3000);

    return () => clearInterval(interval);
  }, [historySearches, historyPage]);

  // Fetch Categories on mount (Requirement 2 & 6)
  useEffect(() => {
    crmApi.getCategories().then(setCategories).catch(() => {});
  }, []);

  // Fetch Category Scraper Stats when category is selected (Requirement 19)
  useEffect(() => {
    if (selectedCategoryId) {
      setIsLoadingCategoryStats(true);
      scraperApi.getCategoryStats(selectedCategoryId)
        .then((res) => setCategoryStats(res?.stats || res))
        .catch(() => setCategoryStats(null))
        .finally(() => setIsLoadingCategoryStats(false));
    } else {
      setCategoryStats(null);
    }
  }, [selectedCategoryId]);

  // Handle Start Search
  const handleStartSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim() || !location.trim()) {
      toast.error('Validation Error', 'Please enter both a Business Type/Keyword and a Location.');
      return;
    }

    setIsStartingSearch(true);
    try {
      const newSearch = await scraperApi.startSearch({
        keyword: keyword.trim(),
        category_id: selectedCategoryId ? Number(selectedCategoryId) : undefined,
        category: industry || keyword.trim(),
        industry: industry || undefined,
        location: location.trim(),
        radius: coverageRadius,
        lead_volume: leadVolume,
        max_results: leadVolume,
        search_mode: searchMode,
        options: {
          data_to_collect: dataToCollect,
          email_discovery_mode: emailDiscoveryMode,
          lead_requirements: leadRequirements,
          advanced: advancedOptions,
        },
        immediate: false, // Run in background queue
      });

      setActiveSearch(newSearch);
      loadStatus();
      loadHistory(1);
      toast.success(
        'Discovery Initiated',
        `Background discovery started for "${newSearch.keyword}" in "${newSearch.location}". Track live progress below.`
      );
    } catch (err: any) {
      console.error(err);
      toast.error('Search Failed', err?.response?.data?.message || err.message || 'Unable to execute search.');
    } finally {
      setIsStartingSearch(false);
    }
  };

  // Selection Handlers
  const handleSelectOne = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === results.length && results.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(results.map((r) => r.id));
    }
  };

  // Delete Handlers
  const handleDeleteOne = async (id: number) => {
    if (!confirm('Are you sure you want to delete this business record?')) return;
    try {
      await scraperApi.deleteResult(id);
      setResults((prev) => prev.filter((r) => r.id !== id));
      setSelectedIds((prev) => prev.filter((item) => item !== id));
      if (selectedBusiness?.id === id) {
        setSelectedBusiness(null);
      }
      loadStatus();
      toast.success('Deleted', 'Business record removed.');
    } catch (err: any) {
      toast.error('Delete Failed', err.message);
    }
  };

  const handleBatchDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} selected records?`)) return;
    try {
      await scraperApi.batchDelete(selectedIds);
      setResults((prev) => prev.filter((r) => !selectedIds.includes(r.id)));
      setSelectedIds([]);
      loadStatus();
      toast.success('Batch Delete', 'Successfully removed selected businesses.');
    } catch (err: any) {
      toast.error('Delete Failed', err.message);
    }
  };

  // Import Selected or All to CRM Contacts via Smart Upsert (Requirement 18)
  const handleImportToCrm = async (options?: { ids?: number[]; importAll?: boolean }) => {
    const isImportAll = options?.importAll ?? false;
    const idsToImport = options?.ids ?? selectedIds;

    if (!isImportAll && idsToImport.length === 0) {
      toast.error('No Selection', 'Please select at least one business to import into CRM.');
      return;
    }

    setIsImporting(true);
    try {
      const summary = isImportAll
        ? await scraperApi.importToCrm({
            import_all: true,
            search_id: filterSearchId ? Number(filterSearchId) : (activeSearch?.id ? Number(activeSearch.id) : undefined),
            tab: resultFilterTab !== 'all' ? resultFilterTab : undefined,
            search: filterSearch.trim() || undefined,
          })
        : await scraperApi.importToCrm(idsToImport);

      const created = summary.created ?? summary.new_contacts ?? 0;
      const enriched = summary.enriched ?? summary.existing_contacts_enriched ?? 0;
      const alreadyUpToDate = summary.already_up_to_date ?? summary.already_existing ?? 0;
      const total = summary.total ?? summary.discovered ?? (created + enriched + alreadyUpToDate);

      setImportSummaryModal({
        isOpen: true,
        discovered: summary.discovered ?? total,
        already_existing: summary.already_existing ?? alreadyUpToDate,
        new_businesses: summary.new_businesses ?? 0,
        existing_businesses_enriched: summary.existing_businesses_enriched ?? 0,
        new_contacts: summary.new_contacts ?? created,
        existing_contacts_enriched: summary.existing_contacts_enriched ?? enriched,
        duplicates_prevented: summary.duplicates_prevented ?? 0,
        failed: summary.failed ?? 0,
        final_unique: summary.final_unique ?? (created + enriched),
        created,
        enriched,
        already_up_to_date: alreadyUpToDate,
        total,
        errors: summary.errors || [],
      });

      if (created > 0 || enriched > 0) {
        toast.success(
          'CRM Import Succeeded',
          `${created} new contacts created, ${enriched} existing contacts enriched.`
        );
      } else if (alreadyUpToDate > 0) {
        toast.info(
          'Already in CRM',
          `All ${alreadyUpToDate} leads already exist in your CRM and are up-to-date.`
        );
      }

      // Refresh list to show updated imported status
      loadResults(currentPage);
      loadStatus();
      setSelectedIds([]);
    } catch (err: any) {
      toast.error('CRM Import Failed', err?.response?.data?.message || err.message);
    } finally {
      setIsImporting(false);
    }
  };

  // Targeted Enrichment for Single Lead (Missing Email/Website/Data)
  const handleEnrichLead = async (id: number) => {
    setEnrichingId(id);
    try {
      const res = await scraperApi.enrichLead(id);
      if (res.enriched_fields && res.enriched_fields.length > 0) {
        toast.success('Lead Enriched', `Discovered missing fields: ${res.enriched_fields.join(', ')}`);
      } else {
        toast.info('Enrichment Check', res.message || 'No additional missing data could be located.');
      }

      // Update lead in results table state in-place
      setResults((prev) => prev.map((item) => (item.id === id ? { ...item, ...res.data } : item)));

      // If active in drawer, update drawer state and refresh logs
      if (selectedBusiness?.id === id) {
        setSelectedBusiness(res.data);
        loadAuditLogs(id);
      }
    } catch (err: any) {
      toast.error('Enrichment Failed', err?.response?.data?.message || err.message);
    } finally {
      setEnrichingId(null);
    }
  };

  // Bulk Enrichment for Selected Leads
  const handleBulkEnrich = async () => {
    if (selectedIds.length === 0) {
      toast.error('No Selection', 'Please select businesses to enrich.');
      return;
    }

    setIsBulkEnriching(true);
    try {
      const res = await scraperApi.bulkEnrichLeads(selectedIds);
      toast.success(
        'Bulk Enrichment Complete',
        `${res.enriched_count} enriched, ${res.still_missing_count} still missing data, ${res.failed_count} failed.`
      );
      loadResults(currentPage);
    } catch (err: any) {
      toast.error('Bulk Enrichment Failed', err?.response?.data?.message || err.message);
    } finally {
      setIsBulkEnriching(false);
    }
  };

  // Fetch Audit Trail History for Selected Lead
  const loadAuditLogs = async (id: number) => {
    setIsLoadingLogs(true);
    try {
      const logs = await scraperApi.getEnrichmentLogs(id);
      setAuditLogs(logs || []);
    } catch (err: any) {
      console.error('Failed to load audit logs:', err);
    } finally {
      setIsLoadingLogs(false);
    }
  };

  // Export CSV
  const handleExportCsv = async () => {
    try {
      await scraperApi.downloadCsv({
        search_id: filterSearchId ? Number(filterSearchId) : undefined,
        tab: resultFilterTab,
        search: filterSearch.trim() || undefined,
      });
      toast.success('Export Started', 'CSV file generated successfully with public contact details.');
    } catch (err: any) {
      toast.error('Export Failed', err.message);
    }
  };

  // Copy Email Helper
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEmail(text);
    toast.success('Copied', 'Email address copied to clipboard');
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  // Lead Quality Badge Helper (Grades A-D & 100-pt Score)
  const getQualityBadge = (score?: number, grade?: string) => {
    const s = score ?? 0;
    const g = grade || (s >= 80 ? 'A' : s >= 60 ? 'B' : s >= 40 ? 'C' : 'D');
    switch (g) {
      case 'A':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          dot: 'bg-emerald-500',
          label: 'Grade A — Excellent',
        };
      case 'B':
        return {
          bg: 'bg-indigo-50 text-indigo-800 border-indigo-200',
          dot: 'bg-indigo-500',
          label: 'Grade B — Good',
        };
      case 'C':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          dot: 'bg-amber-500',
          label: 'Grade C — Partial',
        };
      default:
        return {
          bg: 'bg-rose-50 text-rose-800 border-rose-200',
          dot: 'bg-rose-500',
          label: 'Grade D — Low Data',
        };
    }
  };

  // Calculate dynamic metrics for Summary Cards from current activeSearch or latest search
  const displayMetrics = {
    found: Number(activeSearch?.total_found ?? stats?.total_leads_scraped ?? 0).toLocaleString(),
    websites: Number(activeSearch?.websites_found ?? 0).toLocaleString(),
    emails: Number(activeSearch?.total_emails_found ?? stats?.total_emails_discovered ?? 0).toLocaleString(),
    duplicates: Number((activeSearch?.duplicates_removed ?? activeSearch?.total_duplicates) ?? 0).toLocaleString(),
    noEmail: Number(activeSearch?.no_email ?? 0).toLocaleString(),
    failed: Number(activeSearch?.total_failed ?? 0).toLocaleString(),
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in font-sans">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#6D4AFF] via-[#7B57FF] to-[#8B5CF6] text-white p-8 shadow-xl shadow-[#6D4AFF]/15">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-semibold tracking-wide">
              <Compass size={14} className="animate-spin-slow" />
              <span>Official Google Places & Public Website Scraper</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">DISCOVER BUSINESSES</h1>
            <p className="text-white/85 text-sm max-w-2xl leading-relaxed">
              Find businesses, websites & public contact emails. Inspect business homepages, contact & about pages, normalize verified addresses, and selectively import qualified leads to your CRM.
            </p>
          </div>

          {/* Quick Stats Pill Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3 text-center">
              <p className="text-xs text-white/70 font-medium">Searches</p>
              <p className="text-xl font-black mt-0.5">{stats?.total_searches ?? 0}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3 text-center">
              <p className="text-xs text-white/70 font-medium">Businesses</p>
              <p className="text-xl font-black mt-0.5">{stats?.total_leads_scraped ?? 0}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3 text-center">
              <p className="text-xs text-white/70 font-medium">Emails Found</p>
              <p className="text-xl font-black text-emerald-300 mt-0.5">{stats?.total_emails_discovered ?? 0}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3 text-center">
              <p className="text-xs text-white/70 font-medium">In CRM</p>
              <p className="text-xl font-black text-indigo-200 mt-0.5">{stats?.total_imported_crm ?? 0}</p>
            </div>
          </div>
        </div>

        {/* Decorative circle */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-white/5 pointer-events-none blur-2xl" />
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('search')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'search'
              ? 'border-[#6D4AFF] text-[#6D4AFF]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Search size={16} />
          <span>Discover Businesses</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('results');
            loadResults(1);
          }}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-all cursor-pointer relative ${
            activeTab === 'results'
              ? 'border-[#6D4AFF] text-[#6D4AFF]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Building2 size={16} />
          <span>Discovered Leads</span>
          {pagination?.total ? (
            <span className="px-2 py-0.5 text-[11px] rounded-full bg-purple-100 text-[#6D4AFF] font-bold">
              {pagination.total}
            </span>
          ) : null}
        </button>

        <button
          onClick={() => {
            setActiveTab('history');
            loadHistory(1);
          }}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'history'
              ? 'border-[#6D4AFF] text-[#6D4AFF]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Clock size={16} />
          <span>Search History</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: NEW BUSINESS DISCOVERY SEARCH */}
      {/* ============================================================== */}
      {activeTab === 'search' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Discovery Form */}
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-7">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">DISCOVER BUSINESSES</h2>
                <p className="text-xs text-slate-500 mt-1">Find businesses, websites & public contact emails</p>
              </div>
              <span className="w-10 h-10 rounded-2xl bg-purple-50 text-[#6D4AFF] flex items-center justify-center">
                <Sparkles size={20} />
              </span>
            </div>

            <form onSubmit={handleStartSearch} className="space-y-6">
              {/* SECTION 1 — BUSINESS SEARCH */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
                    Business Type / Search Query <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[11px] text-slate-400">Free-text or category keyword</span>
                </div>
                <div className="relative">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="e.g. Dental Clinic, Real Estate Agency, Software Company"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#6D4AFF] transition-all"
                  />
                </div>

                {/* Popular Search Chips */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Popular Searches:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {popularChips.map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => setKeyword(chip)}
                        className={`px-3 py-1 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                          keyword === chip
                            ? 'bg-[#6D4AFF] text-white border-[#6D4AFF]'
                            : 'bg-slate-50 hover:bg-purple-50 text-slate-700 hover:text-[#6D4AFF] border-slate-200'
                        }`}
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* INDUSTRY & LOCATION ROW */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Category & Industry Dropdown (Requirement 1, 2, 6) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
                      Category <span className="text-[#6D4AFF] font-extrabold">*</span>
                    </label>
                    <span className="text-[10px] text-slate-400 font-medium">Auto-links to CRM</span>
                  </div>
                  <select
                    value={selectedCategoryId}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSelectedCategoryId(val);
                      const cat = categories.find((c) => String(c.id) === String(val));
                      if (cat) {
                        setIndustry(cat.name);
                        if (!keyword) setKeyword(cat.name);
                      }
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-sm font-semibold text-slate-900 focus:outline-none focus:bg-white focus:border-[#6D4AFF] transition-all cursor-pointer"
                  >
                    <option value="">Select CRM Category...</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                    {industryOptions
                      .filter((ind) => !categories.some((c) => c.name.toLowerCase() === ind.toLowerCase()))
                      .map((ind) => (
                        <option key={ind} value="">
                          {ind} (Auto-create category)
                        </option>
                      ))}
                  </select>
                  <p className="text-[11px] text-slate-400">All discovered businesses will be associated with this category.</p>
                </div>

                {/* Location / City Input */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
                    Location / City <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Lahore, Pakistan or London, UK"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#6D4AFF] transition-all"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400">Enter city, region, or country</p>
                </div>
              </div>

              {/* SEARCH COVERAGE & LEAD VOLUME ROW */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Search Coverage Dropdown */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
                    Search Coverage
                  </label>
                  <select
                    value={coverageRadius}
                    onChange={(e) => setCoverageRadius(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-sm font-semibold text-slate-900 focus:outline-none focus:bg-white focus:border-[#6D4AFF] transition-all cursor-pointer"
                  >
                    <option value={5000}>5 km — Local</option>
                    <option value={10000}>10 km — Nearby</option>
                    <option value={25000}>25 km — Metro Area</option>
                    <option value={50000}>50 km — Regional</option>
                    <option value={100000}>100 km — Extended</option>
                  </select>
                  <p className="text-[11px] text-slate-400">Broad geographic searches are subdivided into sub-zones</p>
                </div>

                {/* Lead Volume Dropdown */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
                    Lead Volume
                  </label>
                  <select
                    value={leadVolume}
                    onChange={(e) => setLeadVolume(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-sm font-semibold text-slate-900 focus:outline-none focus:bg-white focus:border-[#6D4AFF] transition-all cursor-pointer"
                  >
                    <option value={20}>20 — Quick Test</option>
                    <option value={50}>50 — Small Search</option>
                    <option value={100}>100 — Standard Search</option>
                    <option value={250}>250 — Large Search</option>
                    <option value={500}>500 — Bulk Search</option>
                    <option value={1000}>1,000 — Large Batch</option>
                    <option value={5000}>5,000 — Enterprise Batch</option>
                  </select>
                  <p className="text-[11px] text-slate-400">
                    Target unique businesses across the search area
                  </p>
                </div>
              </div>

              {/* SEARCH ENGINE MODE SELECTOR */}
              <div className="space-y-2 pt-1">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Search Engine Mode
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setSearchMode('deep')}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer relative ${
                      searchMode === 'deep'
                        ? 'border-[#6D4AFF] bg-purple-50/50 shadow-sm'
                        : 'border-slate-200 bg-slate-50 hover:bg-white'
                    }`}
                  >
                    <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-[#6D4AFF] text-[9px] font-extrabold text-white uppercase tracking-wider">
                      5,000 Volume Ready
                    </span>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          searchMode === 'deep' ? 'border-[#6D4AFF] bg-[#6D4AFF]' : 'border-slate-300'
                        }`}
                      >
                        {searchMode === 'deep' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <span className="font-bold text-xs text-slate-900">Deep Geographic Discovery</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                      Subdivides coverage area into multiple geographic cells and expands query variations to discover up to 5,000 unique businesses.
                    </p>
                  </div>

                  <div
                    onClick={() => setSearchMode('standard')}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      searchMode === 'standard'
                        ? 'border-[#6D4AFF] bg-purple-50/50 shadow-sm'
                        : 'border-slate-200 bg-slate-50 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          searchMode === 'standard' ? 'border-[#6D4AFF] bg-[#6D4AFF]' : 'border-slate-300'
                        }`}
                      >
                        {searchMode === 'standard' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <span className="font-bold text-xs text-slate-900">Standard Search</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                      Single-hub discovery suitable for quick tests and smaller searches (up to 50 businesses).
                    </p>
                  </div>
                </div>
              </div>

              {/* DATA TO COLLECT */}
              <div className="space-y-3 pt-2">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Data to Collect
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-xs">
                  <label className="flex items-center gap-2 text-slate-800 font-semibold cursor-default">
                    <input type="checkbox" checked disabled className="rounded text-[#6D4AFF]" />
                    <span>Business Name</span>
                  </label>
                  <label className="flex items-center gap-2 text-slate-800 font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={dataToCollect.website}
                      onChange={(e) => setDataToCollect((p) => ({ ...p, website: e.target.checked }))}
                      className="rounded text-[#6D4AFF]"
                    />
                    <span>Website</span>
                  </label>
                  <label className="flex items-center gap-2 text-slate-800 font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={dataToCollect.email}
                      onChange={(e) => setDataToCollect((p) => ({ ...p, email: e.target.checked }))}
                      className="rounded text-[#6D4AFF]"
                    />
                    <span>Email</span>
                  </label>
                  <label className="flex items-center gap-2 text-slate-800 font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={dataToCollect.phone}
                      onChange={(e) => setDataToCollect((p) => ({ ...p, phone: e.target.checked }))}
                      className="rounded text-[#6D4AFF]"
                    />
                    <span>Phone</span>
                  </label>
                  <label className="flex items-center gap-2 text-slate-800 font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={dataToCollect.address}
                      onChange={(e) => setDataToCollect((p) => ({ ...p, address: e.target.checked }))}
                      className="rounded text-[#6D4AFF]"
                    />
                    <span>Address</span>
                  </label>
                  <label className="flex items-center gap-2 text-slate-800 font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={dataToCollect.google_maps_url}
                      onChange={(e) => setDataToCollect((p) => ({ ...p, google_maps_url: e.target.checked }))}
                      className="rounded text-[#6D4AFF]"
                    />
                    <span>Google Maps URL</span>
                  </label>
                  <label className="flex items-center gap-2 text-slate-600 font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={dataToCollect.rating}
                      onChange={(e) => setDataToCollect((p) => ({ ...p, rating: e.target.checked }))}
                      className="rounded text-[#6D4AFF]"
                    />
                    <span>Rating</span>
                  </label>
                  <label className="flex items-center gap-2 text-slate-600 font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={dataToCollect.reviews}
                      onChange={(e) => setDataToCollect((p) => ({ ...p, reviews: e.target.checked }))}
                      className="rounded text-[#6D4AFF]"
                    />
                    <span>Review Count</span>
                  </label>
                  <label className="flex items-center gap-2 text-slate-600 font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={dataToCollect.category}
                      onChange={(e) => setDataToCollect((p) => ({ ...p, category: e.target.checked }))}
                      className="rounded text-[#6D4AFF]"
                    />
                    <span>Category</span>
                  </label>
                </div>
              </div>

              {/* EMAIL DISCOVERY */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
                    Email Discovery
                  </label>
                  <span className="text-[11px] text-[#6D4AFF] font-bold">Public website contact email</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div
                    onClick={() => setEmailDiscoveryMode('basic')}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      emailDiscoveryMode === 'basic'
                        ? 'border-[#6D4AFF] bg-purple-50/50 shadow-sm'
                        : 'border-slate-200 bg-slate-50 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          emailDiscoveryMode === 'basic' ? 'border-[#6D4AFF] bg-[#6D4AFF]' : 'border-slate-300'
                        }`}
                      >
                        {emailDiscoveryMode === 'basic' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <span className="font-bold text-xs text-slate-900">Basic</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                      Checks only the main landing page of each company website.
                    </p>
                  </div>

                  <div
                    onClick={() => setEmailDiscoveryMode('website_contact')}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer relative ${
                      emailDiscoveryMode === 'website_contact'
                        ? 'border-[#6D4AFF] bg-purple-50/50 shadow-sm'
                        : 'border-slate-200 bg-slate-50 hover:bg-white'
                    }`}
                  >
                    <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md bg-[#6D4AFF] text-[9px] font-extrabold text-white uppercase tracking-wider">
                      Recommended
                    </span>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          emailDiscoveryMode === 'website_contact'
                            ? 'border-[#6D4AFF] bg-[#6D4AFF]'
                            : 'border-slate-300'
                        }`}
                      >
                        {emailDiscoveryMode === 'website_contact' && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </div>
                      <span className="font-bold text-xs text-slate-900">Website + Contact Pages</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                      Finds publicly listed emails from homepage, /contact, /contact-us, /about, & mailto links.
                    </p>
                  </div>

                  <div
                    onClick={() => setEmailDiscoveryMode('deep')}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      emailDiscoveryMode === 'deep'
                        ? 'border-[#6D4AFF] bg-purple-50/50 shadow-sm'
                        : 'border-slate-200 bg-slate-50 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          emailDiscoveryMode === 'deep' ? 'border-[#6D4AFF] bg-[#6D4AFF]' : 'border-slate-300'
                        }`}
                      >
                        {emailDiscoveryMode === 'deep' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <span className="font-bold text-xs text-slate-900">Deep Discovery</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                      Extended shallow crawl across contact, team, and footer subpages.
                    </p>
                  </div>
                </div>
              </div>

              {/* LEAD REQUIREMENTS & DUPLICATE HANDLING ROW */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                {/* Lead Requirements */}
                <div className="space-y-2.5">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
                    Lead Requirements
                  </label>
                  <div className="space-y-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 text-xs">
                    <label className="flex items-center gap-2 text-slate-900 font-bold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={leadRequirements.must_have_email}
                        onChange={(e) => setLeadRequirements((p) => ({ ...p, must_have_email: e.target.checked }))}
                        className="rounded text-[#6D4AFF]"
                      />
                      <span>Must have email (Recommended)</span>
                    </label>
                    <label className="flex items-center gap-2 text-slate-700 font-medium cursor-pointer">
                      <input
                        type="checkbox"
                        checked={leadRequirements.must_have_website}
                        onChange={(e) => setLeadRequirements((p) => ({ ...p, must_have_website: e.target.checked }))}
                        className="rounded text-[#6D4AFF]"
                      />
                      <span>Must have website</span>
                    </label>
                    <label className="flex items-center gap-2 text-slate-700 font-medium cursor-pointer">
                      <input
                        type="checkbox"
                        checked={leadRequirements.must_have_phone}
                        onChange={(e) => setLeadRequirements((p) => ({ ...p, must_have_phone: e.target.checked }))}
                        className="rounded text-[#6D4AFF]"
                      />
                      <span>Must have phone</span>
                    </label>
                  </div>
                </div>

                {/* Duplicate Handling */}
                <div className="space-y-2.5">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
                    Duplicate Handling
                  </label>
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 text-xs space-y-2">
                    <label className="flex items-center gap-2 text-slate-900 font-bold cursor-pointer">
                      <input
                        type="radio"
                        name="dup_handling"
                        checked={autoDeduplicate}
                        onChange={() => setAutoDeduplicate(true)}
                        className="text-[#6D4AFF]"
                      />
                      <span>Automatically remove duplicates</span>
                    </label>
                    <p className="text-[11px] text-slate-500 leading-relaxed pl-5">
                      Deduplicates by Google Place ID, normalized domain, business name + address, and case-insensitive email.
                    </p>
                  </div>
                </div>
              </div>

              {/* COLLAPSIBLE ADVANCED SEARCH OPTIONS */}
              <div className="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="w-full py-2.5 flex items-center justify-between text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span>{showAdvanced ? '▾' : '▸'}</span>
                    <span>Advanced Search Options</span>
                  </span>
                  <span className="text-[11px] font-normal text-slate-400">
                    {showAdvanced ? 'Hide advanced settings' : 'Filters, timeouts & crawler options'}
                  </span>
                </button>

                <AnimatePresence>
                  {showAdvanced && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pt-4 space-y-4 text-xs overflow-hidden"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50/70 p-4 rounded-2xl border border-slate-200/70">
                        <div className="space-y-1.5">
                          <label className="font-bold text-slate-700">Minimum Rating (Google)</label>
                          <select
                            value={advancedOptions.min_rating}
                            onChange={(e) =>
                              setAdvancedOptions((p) => ({ ...p, min_rating: Number(e.target.value) }))
                            }
                            className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs"
                          >
                            <option value={0}>Any Rating</option>
                            <option value={3.5}>3.5+ Stars</option>
                            <option value={4.0}>4.0+ Stars</option>
                            <option value={4.5}>4.5+ Stars</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="font-bold text-slate-700">Request Timeout</label>
                          <select
                            value={advancedOptions.timeout}
                            onChange={(e) =>
                              setAdvancedOptions((p) => ({ ...p, timeout: Number(e.target.value) }))
                            }
                            className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs"
                          >
                            <option value={8}>8 seconds (Fast)</option>
                            <option value={10}>10 seconds (Standard)</option>
                            <option value={15}>15 seconds (Extended)</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="font-bold text-slate-700">Crawler Page Depth</label>
                          <select
                            value={advancedOptions.max_pages}
                            onChange={(e) =>
                              setAdvancedOptions((p) => ({ ...p, max_pages: Number(e.target.value) }))
                            }
                            className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs"
                          >
                            <option value={1}>1 Page (Homepage only)</option>
                            <option value={3}>3 Pages (Homepage + /contact + /about)</option>
                            <option value={5}>5 Pages (Deeper crawl)</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="font-bold text-slate-700">Concurrent Requests</label>
                          <select
                            value={advancedOptions.concurrency}
                            onChange={(e) =>
                              setAdvancedOptions((p) => ({ ...p, concurrency: Number(e.target.value) }))
                            }
                            className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs"
                          >
                            <option value={3}>3 simultaneous websites</option>
                            <option value={5}>5 simultaneous websites</option>
                            <option value={10}>10 simultaneous websites</option>
                          </select>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* SEARCH BUTTON */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isStartingSearch}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#6D4AFF] to-[#8B5CF6] hover:from-[#603de6] hover:to-[#7c4ef0] text-white font-bold text-sm shadow-lg shadow-[#6D4AFF]/25 transition-all flex items-center justify-center gap-2.5 cursor-pointer active:scale-[0.99] disabled:opacity-70"
                >
                  {isStartingSearch ? (
                    <>
                      <RotateCw size={18} className="animate-spin" />
                      <span>Initiating Discovery Job...</span>
                    </>
                  ) : (
                    <>
                      <Play size={18} fill="currentColor" />
                      <span>Start Business Discovery</span>
                    </>
                  )}
                </button>
                <p className="text-[11px] text-slate-400 text-center mt-2.5">
                  Discovery runs asynchronously in the background. You can navigate away anytime without interrupting processing.
                </p>
              </div>
            </form>
          </div>

          {/* Right Column: Live Background Progress / Info */}
          <div className="lg:col-span-4 space-y-6">
            {activeSearch ? (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5 animate-fade-in">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <h3 className="text-sm font-bold text-slate-900">Live Discovery Progress</h3>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      activeSearch.status === 'completed'
                        ? 'bg-emerald-50 text-emerald-700'
                        : activeSearch.status === 'failed'
                        ? 'bg-red-50 text-red-700'
                        : 'bg-indigo-50 text-indigo-700'
                    }`}
                  >
                    {activeSearch.status}
                  </span>
                </div>

                <div>
                  <p className="text-xs text-slate-400 font-medium">Search Target</p>
                  <p className="text-sm font-bold text-slate-800 mt-0.5">
                    {activeSearch.keyword} — {activeSearch.location}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                    <span className="px-2 py-0.5 rounded-md bg-purple-50 text-[#6D4AFF] text-[10px] font-bold">
                      Target: {Number(activeSearch.lead_volume ?? activeSearch.max_results ?? 5000).toLocaleString()}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold uppercase">
                      {activeSearch.search_mode === 'deep' ? 'Deep Grid Discovery' : 'Standard'}
                    </span>
                    {activeSearch.phase && (
                      <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-bold capitalize">
                        Phase: {activeSearch.phase === 'discovery' ? 'Geographic Grid Discovery' : activeSearch.phase === 'enrichment' ? 'Website Email Enrichment' : activeSearch.phase}
                      </span>
                    )}
                  </div>
                </div>

                {/* Coverage Exhaustion / Saturation Alert */}
                {activeSearch.coverage_exhausted && (
                  <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-2xl text-xs text-amber-900 flex items-start gap-2.5">
                    <Info size={16} className="text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">
                        {activeSearch.exhaustion_note?.includes('Discovery saturated')
                          ? 'Discovery Saturated'
                          : activeSearch.exhaustion_note?.includes('Target achieved')
                          ? 'Target Achieved'
                          : 'Coverage Exhausted'}
                      </p>
                      <p className="text-amber-800 text-[11px] mt-0.5 leading-relaxed">
                        {activeSearch.exhaustion_note || `Discovered all ${(activeSearch.total_found ?? 0).toLocaleString()} unique registered businesses across the search grid in this area.`}
                      </p>
                    </div>
                  </div>
                )}

                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-slate-600">
                    <span>
                      {activeSearch.status === 'completed'
                        ? 'Discovery & Extraction Completed'
                        : activeSearch.phase === 'discovery'
                        ? 'Discovery in progress'
                        : activeSearch.phase === 'enrichment'
                        ? `Website email extraction (${(activeSearch.total_processed ?? 0).toLocaleString()} / ${(activeSearch.websites_found ?? 0).toLocaleString()} websites)`
                        : 'Discovery completed'}
                    </span>
                    <span>
                      {(() => {
                        if (activeSearch.status === 'completed') return 100;
                        if (activeSearch.phase === 'enrichment') {
                          const totalWebsites = activeSearch.websites_found ?? 0;
                          if (totalWebsites <= 0) return 95;
                          const processed = activeSearch.total_processed ?? 0;
                          return Math.min(99, Math.max(5, Math.round((processed / totalWebsites) * 100)));
                        }
                        const target = activeSearch.lead_volume ?? activeSearch.max_results ?? 100;
                        const found = activeSearch.total_found ?? 0;
                        const zonesTotal = activeSearch.zones_total ?? 1;
                        const zonesDone = activeSearch.zones_completed ?? 0;
                        const zonePct = Math.round((zonesDone / Math.max(1, zonesTotal)) * 100);
                        const foundPct = Math.round((found / Math.max(1, target)) * 100);
                        return Math.min(99, Math.max(8, Math.max(zonePct, foundPct)));
                      })()}
                      %
                    </span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#6D4AFF] to-[#8B5CF6] transition-all duration-500 rounded-full"
                      style={{
                        width: `${(() => {
                          if (activeSearch.status === 'completed') return 100;
                          if (activeSearch.phase === 'enrichment') {
                            const totalWebsites = activeSearch.websites_found ?? 0;
                            if (totalWebsites <= 0) return 95;
                            const processed = activeSearch.total_processed ?? 0;
                            return Math.min(99, Math.max(5, Math.round((processed / totalWebsites) * 100)));
                          }
                          const target = activeSearch.lead_volume ?? activeSearch.max_results ?? 100;
                          const found = activeSearch.total_found ?? 0;
                          const zonesTotal = activeSearch.zones_total ?? 1;
                          const zonesDone = activeSearch.zones_completed ?? 0;
                          const zonePct = Math.round((zonesDone / Math.max(1, zonesTotal)) * 100);
                          const foundPct = Math.round((found / Math.max(1, target)) * 100);
                          return Math.min(99, Math.max(8, Math.max(zonePct, foundPct)));
                        })()}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Real Progress Metrics Grid */}
                <div className="grid grid-cols-2 gap-2.5 pt-1 text-xs">
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Unique Businesses</span>
                    <p className="text-lg font-black text-slate-900 mt-0.5">{(activeSearch.total_found ?? 0).toLocaleString()}</p>
                  </div>

                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Search Zones</span>
                    <p className="text-lg font-black text-indigo-600 mt-0.5">
                      {activeSearch.zones_completed ?? 0} / {activeSearch.zones_total ?? 1}
                    </p>
                  </div>

                  <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-3">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Emails Found</span>
                    <p className="text-lg font-black text-emerald-700 mt-0.5">{(activeSearch.total_emails_found ?? 0).toLocaleString()}</p>
                  </div>

                  <div className="bg-amber-50/70 border border-amber-100 rounded-xl p-3">
                    <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Duplicates Removed</span>
                    <p className="text-lg font-black text-amber-700 mt-0.5">
                      {((activeSearch.duplicates_removed ?? activeSearch.total_duplicates) ?? 0).toLocaleString()}
                    </p>
                  </div>

                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Websites Found</span>
                    <p className="text-lg font-black text-slate-600 mt-0.5">
                      {(activeSearch.websites_found ?? 0).toLocaleString()}
                    </p>
                  </div>

                  <div className="bg-red-50/70 border border-red-100 rounded-xl p-3">
                    <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">Failed Websites</span>
                    <p className="text-lg font-black text-red-700 mt-0.5">{(activeSearch.total_failed ?? 0).toLocaleString()}</p>
                  </div>
                </div>

                {/* DISCOVERY SATURATION STATISTICS CARD */}
                {activeSearch?.options?.discovery_stats && (
                  <div className="p-4 bg-slate-50 border border-slate-200/90 rounded-2xl text-xs space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-200/70 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#6D4AFF]" />
                        <h4 className="font-extrabold text-slate-800 text-[11px] uppercase tracking-wider">
                          Discovery Saturation Statistics
                        </h4>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          activeSearch.options.discovery_stats.saturation === 'SATURATED'
                            ? 'bg-amber-100 text-amber-800'
                            : activeSearch.options.discovery_stats.saturation === 'TARGET REACHED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-indigo-100 text-indigo-800'
                        }`}
                      >
                        Saturation: {activeSearch.options.discovery_stats.saturation}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                      <div className="bg-white border border-slate-200/80 rounded-xl p-2">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Target</span>
                        <p className="font-extrabold text-slate-800 text-xs mt-0.5">
                          {Number(activeSearch.options.discovery_stats.target ?? 5000).toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-white border border-slate-200/80 rounded-xl p-2">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Unique</span>
                        <p className="font-extrabold text-[#6D4AFF] text-xs mt-0.5">
                          {Number(activeSearch.options.discovery_stats.unique_businesses ?? activeSearch.total_found ?? 0).toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-white border border-slate-200/80 rounded-xl p-2">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Duplicates</span>
                        <p className="font-extrabold text-amber-700 text-xs mt-0.5">
                          {Number(activeSearch.options.discovery_stats.total_duplicates ?? activeSearch.total_duplicates ?? 0).toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-white border border-slate-200/80 rounded-xl p-2">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Cells Searched</span>
                        <p className="font-extrabold text-indigo-700 text-xs mt-0.5">
                          {activeSearch.options.discovery_stats.cells_searched ?? activeSearch.zones_completed ?? 0}
                        </p>
                      </div>
                    </div>

                    {/* Round-by-round breakdown */}
                    {activeSearch.options.discovery_stats.rounds && activeSearch.options.discovery_stats.rounds.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                          Discovery Yield by Round:
                        </span>
                        <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
                          {activeSearch.options.discovery_stats.rounds.map((r: any, idx: number) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between bg-white border border-slate-200/70 rounded-lg px-2.5 py-1.5 text-[11px]"
                            >
                              <div className="flex items-center gap-1.5 truncate max-w-[65%]">
                                <span className="font-bold text-[#6D4AFF]">Round {r.round}:</span>
                                <span className="text-slate-600 truncate">{r.name}</span>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <span className="font-bold text-emerald-600">
                                  +{Number(r.new_unique ?? 0).toLocaleString()} unique
                                </span>
                                <span className="text-[10px] text-slate-400">
                                  ({Number(r.duplicates ?? 0).toLocaleString()} dups)
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200/60">
                      <span>Query Variations: {activeSearch.options.discovery_stats.query_variations_count ?? 1}</span>
                      <span>Last Round: +{Number(activeSearch.options.discovery_stats.last_round_new_businesses ?? 0).toLocaleString()} unique</span>
                    </div>
                  </div>
                )}

                <div className="pt-2 flex gap-3">
                  <button
                    onClick={() => {
                      setFilterSearchId(String(activeSearch.id));
                      setResultFilterTab('all');
                      setActiveTab('results');
                      loadResults(1, activeSearch.id);
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>View Qualified Results ({(activeSearch.total_found ?? 0).toLocaleString()})</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-[#6D4AFF] flex items-center justify-center">
                  <ShieldCheck size={20} />
                </div>
                <h3 className="text-base font-bold text-slate-900">Discovery Engine Architecture</h3>
                <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
                  <div className="flex gap-2.5">
                    <span className="font-bold text-[#6D4AFF]">1.</span>
                    <p>
                      <strong>Google Places Platform:</strong> Discovers registered businesses with place IDs, phone numbers, and official websites.
                    </p>
                  </div>
                  <div className="flex gap-2.5">
                    <span className="font-bold text-[#6D4AFF]">2.</span>
                    <p>
                      <strong>Ethical Website Crawling:</strong> Inspects company websites, contact pages (/contact, /about), footers, and mailto links.
                    </p>
                  </div>
                  <div className="flex gap-2.5">
                    <span className="font-bold text-[#6D4AFF]">3.</span>
                    <p>
                      <strong>Strict 4-Level Deduplication:</strong> Eliminates duplicate Place IDs, domains, address pairs, and case-normalized emails.
                    </p>
                  </div>
                  <div className="flex gap-2.5">
                    <span className="font-bold text-[#6D4AFF]">4.</span>
                    <p>
                      <strong>Isolated CRM Import:</strong> Data stays cleanly segregated until you explicitly choose to import into CRM Contacts.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* CATEGORY SCRAPER STATISTICS (Requirement 6 & 19) */}
            {categoryStats && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-xl bg-purple-50 text-[#6D4AFF] flex items-center justify-center">
                      <Layers size={16} />
                    </span>
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Category Statistics</h3>
                      <p className="text-[11px] text-slate-500 font-semibold">
                        {categories.find((c) => String(c.id) === String(selectedCategoryId))?.name || 'Category Overview'}
                      </p>
                    </div>
                  </div>
                  {isLoadingCategoryStats && <RotateCw size={14} className="animate-spin text-[#6D4AFF]" />}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Businesses</span>
                    <p className="text-base font-black text-slate-900 mt-0.5">
                      {(categoryStats.businesses ?? 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Contacts</span>
                    <p className="text-base font-black text-slate-900 mt-0.5">
                      {(categoryStats.contacts ?? 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-100">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase">Emails</span>
                    <p className="text-base font-black text-emerald-700 mt-0.5">
                      {(categoryStats.emails ?? 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-100">
                    <span className="text-[10px] font-bold text-indigo-600 uppercase">Phones</span>
                    <p className="text-base font-black text-indigo-700 mt-0.5">
                      {(categoryStats.phones ?? 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 col-span-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Websites</span>
                    <p className="text-base font-black text-slate-700 mt-0.5">
                      {(categoryStats.websites ?? 0).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-2 text-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Email Campaign Activity
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="flex justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-slate-500">Never Emailed:</span>
                      <span className="font-bold text-slate-800">
                        {(categoryStats.never_emailed ?? 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between p-2 rounded-lg bg-blue-50/70 border border-blue-100">
                      <span className="text-blue-700">Previously Emailed:</span>
                      <span className="font-bold text-blue-800">
                        {(categoryStats.previously_emailed ?? 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between p-2 rounded-lg bg-emerald-50/70 border border-emerald-100">
                      <span className="text-emerald-700">Delivered:</span>
                      <span className="font-bold text-emerald-800">
                        {(categoryStats.delivered ?? 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between p-2 rounded-lg bg-amber-50/70 border border-amber-100">
                      <span className="text-amber-700">Bounced:</span>
                      <span className="font-bold text-amber-800">
                        {(categoryStats.bounced ?? 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: RESULTS PAGE & DYNAMIC SUMMARY CARDS */}
      {/* ============================================================== */}
      {activeTab === 'results' && (
        <div className="space-y-5">
          {/* Coverage Exhaustion / Saturation Banner */}
          {activeSearch?.coverage_exhausted && (
            <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 flex items-start gap-3 shadow-sm">
              <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center shrink-0 text-amber-700">
                <CheckCircle2 size={18} />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-amber-900">
                  {activeSearch.exhaustion_note?.includes('Discovery saturated')
                    ? `Discovery Saturated — ${displayMetrics.found} unique businesses found`
                    : activeSearch.exhaustion_note?.includes('Target achieved')
                    ? `Target Achieved — ${displayMetrics.found} unique businesses discovered`
                    : `Geographic Saturation — ${displayMetrics.found} unique businesses discovered`}
                </h4>
                <p className="text-xs text-amber-700/90 mt-0.5 leading-relaxed">
                  {activeSearch.exhaustion_note || 'All geographic search cells and category permutations within the target radius were thoroughly scanned.'}
                </p>
              </div>
            </div>
          )}

          {/* RESULT SUMMARY CARDS (6 Dynamic Metric Cards) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Businesses Found</span>
              <p className="text-2xl font-black text-slate-900 mt-1">{displayMetrics.found}</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Websites Found</span>
              <p className="text-2xl font-black text-indigo-600 mt-1">{displayMetrics.websites}</p>
            </div>
            <div className="bg-emerald-50/80 border border-emerald-200/70 rounded-2xl p-4 shadow-sm">
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">Emails Found</span>
              <p className="text-2xl font-black text-emerald-800 mt-1">{displayMetrics.emails}</p>
            </div>
            <div className="bg-amber-50/80 border border-amber-200/70 rounded-2xl p-4 shadow-sm">
              <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block">Duplicates Removed</span>
              <p className="text-2xl font-black text-amber-800 mt-1">{displayMetrics.duplicates}</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">No Email</span>
              <p className="text-2xl font-black text-slate-600 mt-1">{displayMetrics.noEmail}</p>
            </div>
            <div className="bg-red-50/80 border border-red-200/70 rounded-2xl p-4 shadow-sm">
              <span className="text-[11px] font-bold text-red-700 uppercase tracking-wider block">Failed</span>
              <p className="text-2xl font-black text-red-800 mt-1">{displayMetrics.failed}</p>
            </div>
          </div>

          {/* Active Search Context Filter Banner */}
          {filterSearchId ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-purple-50/80 border border-[#6D4AFF]/20 rounded-2xl px-5 py-3 shadow-xs">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-[#6D4AFF]/10 text-[#6D4AFF] flex items-center justify-center font-bold shrink-0">
                  <Compass size={16} />
                </span>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-slate-800">
                      {activeSearch?.keyword ? `${activeSearch.keyword} — ${activeSearch.location}` : `Search Job #${filterSearchId}`}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        activeSearch?.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : activeSearch?.status === 'failed'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-indigo-100 text-indigo-800 animate-pulse'
                      }`}
                    >
                      {activeSearch?.status || 'Active'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Showing discovered leads for Search #{filterSearchId} ({(pagination?.total ?? results.length).toLocaleString()} leads)
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setFilterSearchId('');
                  loadResults(1, '');
                }}
                className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 text-xs font-bold transition-all cursor-pointer shadow-xs shrink-0"
              >
                Clear Filter (View All Leads)
              </button>
            </div>
          ) : null}

          {/* Controls & Filter Tabs Bar */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Search input in results */}
              <div className="relative flex-1 max-w-md">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={filterSearch}
                  onChange={(e) => setFilterSearch(e.target.value)}
                  placeholder="Filter by name, email, phone, location, category..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold text-slate-900 focus:outline-none focus:bg-white focus:border-[#6D4AFF] transition-all"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                {selectedIds.length > 0 && (
                  <button
                    onClick={handleBulkEnrich}
                    disabled={isBulkEnriching}
                    className="px-3.5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm shadow-purple-600/25 transition-all cursor-pointer disabled:opacity-50"
                    title="Enrich missing information for selected leads"
                  >
                    <Sparkles size={14} className={isBulkEnriching ? 'animate-spin' : ''} />
                    <span>Enrich Missing Data ({selectedIds.length})</span>
                  </button>
                )}

                {/* Import Selected Button with dynamic in-CRM detection */}
                {(() => {
                  const selectedImportedCount = results.filter((r) => selectedIds.includes(r.id) && r.is_imported_to_crm).length;
                  const selectedNewCount = selectedIds.length - selectedImportedCount;
                  const isAllSelectedInCrm = selectedIds.length > 0 && selectedNewCount === 0;

                  return (
                    <button
                      onClick={() => handleImportToCrm()}
                      disabled={selectedIds.length === 0 || isImporting}
                      className={`px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer disabled:opacity-50 ${
                        isAllSelectedInCrm
                          ? 'bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white shadow-teal-600/20'
                          : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-emerald-600/20'
                      }`}
                      title={
                        isAllSelectedInCrm
                          ? 'All selected leads already exist in CRM. Click to sync and enrich any missing data without duplicates.'
                          : 'Import selected leads into CRM Contacts with phone-uniqueness deduplication'
                      }
                    >
                      <UserPlus size={14} className={isImporting ? 'animate-spin' : ''} />
                      <span>
                        {isAllSelectedInCrm
                          ? `Sync Selected (${selectedIds.length} in CRM)`
                          : selectedImportedCount > 0
                          ? `Import Selected (${selectedIds.length} • ${selectedNewCount} new)`
                          : `Import Selected (${selectedIds.length})`}
                      </span>
                    </button>
                  );
                })()}

                {/* Import All button with view-aware status */}
                {(() => {
                  const totalInView = pagination?.total ?? results.length;
                  const allInCrm = results.length > 0 && results.every((r) => r.is_imported_to_crm) && (stats?.total_unimported_crm === 0);

                  return (
                    <button
                      onClick={() => handleImportToCrm({ importAll: true })}
                      disabled={isImporting || results.length === 0}
                      className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-[#6D4AFF] to-indigo-700 hover:from-[#5b3ce0] hover:to-indigo-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm shadow-[#6D4AFF]/20 transition-all cursor-pointer disabled:opacity-50"
                      title={
                        allInCrm
                          ? 'All discovered leads in this view are in CRM. Click to sync and enrich missing data.'
                          : 'Import and enrich discovered leads into CRM using phone-uniqueness deduplication'
                      }
                    >
                      <UserCheck size={14} className={isImporting ? 'animate-spin' : ''} />
                      <span>
                        {allInCrm
                          ? `Sync All in CRM (${totalInView.toLocaleString()})`
                          : `Import All to CRM (${totalInView.toLocaleString()})`}
                      </span>
                    </button>
                  );
                })()}

                <button
                  onClick={handleExportCsv}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Download size={14} />
                  <span>Export CSV</span>
                </button>

                {selectedIds.length > 0 && (
                  <button
                    onClick={handleBatchDelete}
                    className="px-3 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Trash2 size={14} />
                    <span>Delete ({selectedIds.length})</span>
                  </button>
                )}

                <button
                  onClick={() => loadResults(currentPage)}
                  className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all cursor-pointer"
                  title="Refresh"
                >
                  <RotateCw size={15} />
                </button>
              </div>
            </div>

            {/* Filter Tabs: All, Not in CRM, In CRM, Email Found, No Email, Website Found, No Website, Duplicates Removed, Failed */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100 flex-wrap text-xs">
              <span className="font-bold text-slate-400 mr-1">Filter View:</span>
              {[
                { id: 'all', label: 'All' },
                { id: 'not_in_crm', label: 'Not in CRM' },
                { id: 'in_crm', label: 'In CRM' },
                { id: 'email_found', label: 'Email Found' },
                { id: 'no_email', label: 'No Email' },
                { id: 'website_found', label: 'Website Found' },
                { id: 'no_website', label: 'No Website' },
                { id: 'duplicates_removed', label: 'Duplicates Removed' },
                { id: 'failed', label: 'Failed' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setResultFilterTab(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                    resultFilterTab === tab.id
                      ? 'bg-[#6D4AFF] text-white shadow-sm shadow-[#6D4AFF]/25'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results Table */}
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-4 w-12 text-center">
                      <button onClick={handleSelectAll} className="cursor-pointer text-slate-400 hover:text-slate-700">
                        {results.length > 0 && selectedIds.length === results.length ? (
                          <CheckSquare size={16} className="text-[#6D4AFF]" />
                        ) : (
                          <Square size={16} />
                        )}
                      </button>
                    </th>
                    <th className="p-4">Business Name</th>
                    <th className="p-4">Lead Quality</th>
                    <th className="p-4">Phone (Unique Key)</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Website</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Location</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {isLoadingResults ? (
                    <tr>
                      <td colSpan={10} className="p-12 text-center text-slate-400">
                        <RotateCw size={24} className="animate-spin mx-auto mb-2 text-[#6D4AFF]" />
                        Loading qualified leads...
                      </td>
                    </tr>
                  ) : results.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="p-12 text-center text-slate-400 space-y-2">
                        <Compass size={32} className="mx-auto text-slate-300" />
                        <p className="font-bold text-slate-600 text-sm">No businesses discovered matching this filter</p>
                        <p className="text-xs text-slate-400">
                          Try switching filter tabs or starting a new business discovery search.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    results.map((biz) => {
                      const isSelected = selectedIds.includes(biz.id);
                      const qScore = biz.lead_quality_score ?? 0;
                      const qGrade = biz.lead_quality_grade || (qScore >= 80 ? 'A' : qScore >= 60 ? 'B' : qScore >= 40 ? 'C' : 'D');
                      const qualityBadge = getQualityBadge(qScore, qGrade);

                      return (
                        <tr
                          key={biz.id}
                          className={`hover:bg-purple-50/20 transition-colors cursor-pointer ${
                            isSelected ? 'bg-purple-50/40' : ''
                          }`}
                          onClick={(e) => {
                            // Don't open modal if clicked on checkbox, links or action buttons
                            if ((e.target as HTMLElement).closest('button, a, input')) return;
                            setSelectedBusiness(biz);
                            loadAuditLogs(biz.id);
                          }}
                        >
                          <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => handleSelectOne(biz.id)}
                              className="cursor-pointer text-slate-400 hover:text-slate-700"
                            >
                              {isSelected ? (
                                <CheckSquare size={16} className="text-[#6D4AFF]" />
                              ) : (
                                <Square size={16} />
                              )}
                            </button>
                          </td>

                          {/* Business Name */}
                          <td className="p-4">
                            <div className="font-bold text-slate-900 flex items-center gap-1.5">
                              <span>{biz.business_name}</span>
                              {biz.rating && (
                                <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded-md">
                                  <Star size={10} fill="currentColor" />
                                  <span>{biz.rating}</span>
                                </span>
                              )}
                            </div>
                            {biz.is_imported_to_crm && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 mt-0.5">
                                <CheckCircle2 size={11} /> In CRM
                              </span>
                            )}
                          </td>

                          {/* Lead Quality Score & Grade + Missing Info */}
                          <td className="p-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5">
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold border ${qualityBadge.bg}`}>
                                  <Award size={11} />
                                  <span>Grade {qGrade}</span>
                                </span>
                                <span className="text-[11px] font-extrabold text-slate-700">
                                  {qScore}/100
                                </span>
                              </div>

                              {biz.missing_fields && biz.missing_fields.length > 0 ? (
                                <div className="text-[10px] text-amber-700 font-semibold truncate max-w-[140px]" title={`Missing: ${biz.missing_fields.join(', ')}`}>
                                  Missing: {biz.missing_fields.map((f) => f.replace('_', ' ')).join(', ')}
                                </div>
                              ) : (
                                <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
                                  <Check size={10} /> Complete
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Phone Number (Primary Unique Key) */}
                          <td className="p-4">
                            {biz.phone_normalized || biz.phone ? (
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-1 font-mono font-bold text-slate-900 text-[11px]">
                                  <ShieldCheck size={12} className="text-emerald-600 shrink-0" title="Normalized E.164 Unique Key" />
                                  <span>{biz.phone_normalized || biz.phone}</span>
                                </div>
                                {biz.phone_original && biz.phone_original !== biz.phone_normalized && (
                                  <div className="text-[10px] text-slate-400 font-mono">
                                    Raw: {biz.phone_original}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="text-slate-300 italic text-[11px]">No phone</span>
                            )}
                          </td>

                          {/* Email */}
                          <td className="p-4">
                            {biz.email ? (
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono text-slate-900 font-semibold">{biz.email}</span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    copyToClipboard(biz.email!);
                                  }}
                                  className="text-slate-400 hover:text-[#6D4AFF] cursor-pointer p-0.5"
                                  title="Copy Email"
                                >
                                  {copiedEmail === biz.email ? (
                                    <Check size={12} className="text-emerald-600" />
                                  ) : (
                                    <Copy size={12} />
                                  )}
                                </button>
                                {biz.email_source && (
                                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-50 text-[#6D4AFF] font-bold">
                                    {biz.email_source}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-slate-300 font-normal italic">None found</span>
                            )}
                          </td>

                          {/* Website */}
                          <td className="p-4" onClick={(e) => e.stopPropagation()}>
                            {biz.website ? (
                              <a
                                href={biz.website}
                                target="_blank"
                                rel="noreferrer"
                                className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-semibold max-w-[130px] truncate"
                              >
                                <span className="truncate">{biz.website_domain || biz.website.replace(/^https?:\/\/(www\.)?/, '')}</span>
                                <ExternalLink size={11} className="shrink-0" />
                              </a>
                            ) : (
                              <span className="text-slate-300 font-normal italic">No website</span>
                            )}
                          </td>

                          {/* Category */}
                          <td className="p-4">
                            <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-semibold">
                              {biz.category || 'General'}
                            </span>
                          </td>

                          {/* Location */}
                          <td className="p-4 max-w-[160px] truncate text-slate-600" title={biz.address || ''}>
                            {biz.address || '—'}
                          </td>

                          {/* Enrichment Status */}
                          <td className="p-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                biz.enrichment_status === 'ENRICHED' || biz.status === 'email_found'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : biz.enrichment_status === 'PARTIAL'
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                  : biz.status === 'imported'
                                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                  : biz.status === 'failed'
                                  ? 'bg-red-50 text-red-700 border border-red-200'
                                  : 'bg-slate-100 text-slate-600 border border-slate-200'
                              }`}
                            >
                              {biz.enrichment_status || (biz.status === 'email_found' ? 'ENRICHED' : biz.status.replace(/_/g, ' '))}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-1">
                              {/* Enrich Missing Data Button */}
                              <button
                                onClick={() => handleEnrichLead(biz.id)}
                                disabled={enrichingId === biz.id}
                                className="p-1.5 rounded-lg text-purple-600 hover:text-purple-700 hover:bg-purple-50 transition-colors cursor-pointer disabled:opacity-50"
                                title="Enrich Missing Data (Targeted Scrape)"
                              >
                                <Sparkles size={14} className={enrichingId === biz.id ? 'animate-spin text-[#6D4AFF]' : ''} />
                              </button>

                              <button
                                onClick={() => {
                                  setSelectedBusiness(biz);
                                  loadAuditLogs(biz.id);
                                }}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-[#6D4AFF] hover:bg-purple-50 transition-colors cursor-pointer"
                                title="View Details & Enrichment Logs"
                              >
                                <Eye size={14} />
                              </button>

                              <button
                                onClick={() => handleDeleteOne(biz.id)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                title="Delete Lead"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {pagination && pagination.last_page > 1 && (
              <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <p>
                  Showing <span className="font-bold text-slate-900">{pagination.from || 0}</span> to{' '}
                  <span className="font-bold text-slate-900">{pagination.to || 0}</span> of{' '}
                  <span className="font-bold text-slate-900">{pagination.total}</span> leads
                </p>

                <div className="flex items-center gap-2">
                  <button
                    disabled={currentPage <= 1}
                    onClick={() => loadResults(currentPage - 1)}
                    className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <span className="font-bold text-slate-700">
                    Page {currentPage} of {pagination.last_page}
                  </span>
                  <button
                    disabled={currentPage >= pagination.last_page}
                    onClick={() => loadResults(currentPage + 1)}
                    className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: SEARCH HISTORY */}
      {/* ============================================================== */}
      {activeTab === 'history' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Scraper Search Jobs</h3>
              <p className="text-xs text-slate-500">Chronological history of all initiated business discoveries</p>
            </div>
            <button
              onClick={() => loadHistory(historyPage)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer"
            >
              <RotateCw size={14} />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {historySearches.length === 0 ? (
              <p className="p-8 text-center text-xs text-slate-400">No search jobs recorded yet.</p>
            ) : (
              historySearches.map((s) => (
                <div key={s.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{s.keyword}</span>
                      {s.industry && (
                        <span className="px-2 py-0.5 rounded bg-purple-50 text-[#6D4AFF] text-[10px] font-bold">
                          {s.industry}
                        </span>
                      )}
                      <span className="text-slate-400">•</span>
                      <span className="text-xs text-slate-600 font-semibold">{s.location}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          s.status === 'completed'
                            ? 'bg-emerald-50 text-emerald-700'
                            : s.status === 'failed'
                            ? 'bg-red-50 text-red-700'
                            : 'bg-indigo-50 text-indigo-700'
                        }`}
                      >
                        {s.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Discovered {s.total_found} businesses • {s.total_emails_found} emails • {s.total_duplicates} duplicates • Created {new Date(s.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setActiveSearch(s);
                        setFilterSearchId(String(s.id));
                        setResultFilterTab('all');
                        setActiveTab('results');
                        loadResults(1, s.id);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
                    >
                      View Results
                    </button>
                    <button
                      onClick={async () => {
                        if (!confirm('Delete this search and its scraped records?')) return;
                        await scraperApi.deleteSearch(s.id);
                        loadHistory(historyPage);
                        loadStatus();
                        toast.success('Deleted', 'Search record removed.');
                      }}
                      className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Delete Search"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* BUSINESS DETAILS DRAWER / MODAL */}
      {/* ============================================================== */}
      <AnimatePresence>
        {selectedBusiness && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
              onClick={() => setSelectedBusiness(null)}
            />
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="relative w-full max-w-xl bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 sm:p-7 z-10 space-y-6 max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-[#6D4AFF]">
                    {selectedBusiness.category || 'Business Lead'}
                  </span>
                  <h2 className="text-xl font-extrabold text-slate-900 mt-1.5">
                    {selectedBusiness.business_name}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Discovered via {selectedBusiness.source} on{' '}
                    {new Date(selectedBusiness.created_at).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedBusiness(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Lead Quality & Completeness Card */}
              {(() => {
                const qScore = selectedBusiness.lead_quality_score ?? 0;
                const qGrade = selectedBusiness.lead_quality_grade || (qScore >= 80 ? 'A' : qScore >= 60 ? 'B' : qScore >= 40 ? 'C' : 'D');
                const badge = getQualityBadge(qScore, qGrade);

                return (
                  <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black border ${badge.bg}`}>
                          <Award size={13} />
                          <span>{badge.label}</span>
                        </span>
                        <span className="text-xs font-black text-slate-800">
                          Score: {qScore} / 100
                        </span>
                      </div>

                      <button
                        onClick={() => handleEnrichLead(selectedBusiness.id)}
                        disabled={enrichingId === selectedBusiness.id}
                        className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                        title="Search and populate missing fields"
                      >
                        <Sparkles size={13} className={enrichingId === selectedBusiness.id ? 'animate-spin' : ''} />
                        <span>Enrich Missing Data</span>
                      </button>
                    </div>

                    {/* Quality Progress Bar */}
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          qScore >= 80 ? 'bg-emerald-500' : qScore >= 60 ? 'bg-indigo-500' : qScore >= 40 ? 'bg-amber-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${qScore}%` }}
                      />
                    </div>

                    {/* Missing Fields Indicator */}
                    {selectedBusiness.missing_fields && selectedBusiness.missing_fields.length > 0 ? (
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Missing Information ({selectedBusiness.missing_fields.length}):
                        </span>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {selectedBusiness.missing_fields.map((field) => (
                            <span
                              key={field}
                              className="px-2 py-0.5 rounded-md bg-amber-100/80 text-amber-800 text-[10px] font-bold uppercase tracking-wider border border-amber-200"
                            >
                              - {field.replace('_', ' ')}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-bold">
                        <CheckCircle2 size={13} />
                        <span>All core fields discovered (Business Profile Complete)</span>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Phone Number Uniqueness Card */}
              <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Phone Number (Primary Deduplication Key)
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                    <ShieldCheck size={11} />
                    <span>E.164 Unique Strategy</span>
                  </span>
                </div>

                {selectedBusiness.phone_normalized || selectedBusiness.phone ? (
                  <div className="space-y-1">
                    <p className="text-base font-mono font-bold text-slate-900">
                      {selectedBusiness.phone_normalized || selectedBusiness.phone}
                    </p>
                    {selectedBusiness.phone_original && selectedBusiness.phone_original !== selectedBusiness.phone_normalized && (
                      <p className="text-xs text-slate-500 font-mono">
                        Original Scraped: <span className="font-semibold">{selectedBusiness.phone_original}</span>
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">No phone number discovered</p>
                )}
              </div>

              {/* Email Section */}
              <div className="bg-purple-50/40 border border-purple-100 rounded-2xl p-4 space-y-2">
                <span className="text-[10px] font-bold text-[#6D4AFF] uppercase tracking-wider">
                  Contact Email
                </span>
                {selectedBusiness.email ? (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-base font-mono font-bold text-slate-900">{selectedBusiness.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                          <CheckCircle2 size={12} />
                          <span>Email Found</span>
                        </span>
                        {selectedBusiness.email_source && (
                          <span className="text-[11px] text-slate-500 font-medium">
                            Source: <strong>{selectedBusiness.email_source}</strong>
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(selectedBusiness.email!)}
                      className="px-3 py-1.5 rounded-xl bg-white border border-purple-200 text-[#6D4AFF] hover:bg-purple-50 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Copy size={13} />
                      <span>Copy</span>
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">No public email found on company website.</p>
                )}
              </div>

              {/* All Business Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Website</span>
                  {selectedBusiness.website ? (
                    <a
                      href={selectedBusiness.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#6D4AFF] hover:underline font-semibold flex items-center gap-1 truncate"
                    >
                      <span className="truncate">{selectedBusiness.website}</span>
                      <ExternalLink size={12} className="shrink-0" />
                    </a>
                  ) : (
                    <p className="text-slate-500 italic">No website</p>
                  )}
                </div>

                <div className="space-y-1">
                  <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Enrichment Status</span>
                  <p className="font-bold text-slate-800 uppercase tracking-wider">
                    {selectedBusiness.enrichment_status || selectedBusiness.status}
                  </p>
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Address</span>
                  <p className="font-semibold text-slate-800">{selectedBusiness.address || 'N/A'}</p>
                </div>

                <div className="space-y-1">
                  <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Rating & Reviews</span>
                  <div className="flex items-center gap-1 font-semibold text-slate-800">
                    {selectedBusiness.rating ? (
                      <>
                        <Star size={13} className="text-amber-500 fill-amber-500" />
                        <span>{selectedBusiness.rating}</span>
                        {selectedBusiness.review_count && (
                          <span className="text-slate-400">({selectedBusiness.review_count} reviews)</span>
                        )}
                      </>
                    ) : (
                      <span className="text-slate-400 font-normal">Not rated</span>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Google Place ID</span>
                  <p className="font-mono text-[11px] text-slate-500 truncate" title={selectedBusiness.google_place_id || ''}>
                    {selectedBusiness.google_place_id || 'N/A'}
                  </p>
                </div>
              </div>

              {/* Enrichment History & Audit Trail Accordion */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowAuditLogs(!showAuditLogs)}
                  className="w-full flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100 transition-colors text-xs font-bold text-slate-700 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <History size={15} className="text-[#6D4AFF]" />
                    <span>Enrichment Audit History ({auditLogs.length})</span>
                  </div>
                  {showAuditLogs ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                </button>

                {showAuditLogs && (
                  <div className="p-3.5 divide-y divide-slate-100 bg-white max-h-48 overflow-y-auto space-y-2">
                    {isLoadingLogs ? (
                      <div className="p-4 text-center text-xs text-slate-400">
                        <RotateCw size={16} className="animate-spin mx-auto mb-1 text-[#6D4AFF]" />
                        Loading enrichment logs...
                      </div>
                    ) : auditLogs.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-2">
                        No enrichment updates logged yet for this lead.
                      </p>
                    ) : (
                      auditLogs.map((log) => (
                        <div key={log.id} className="pt-2 first:pt-0 text-[11px] space-y-0.5">
                          <div className="flex items-center justify-between font-bold">
                            <span className="text-purple-700 uppercase tracking-wider">{log.field_name}</span>
                            <span className="text-[10px] text-slate-400 font-normal">
                              {new Date(log.created_at).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-slate-700">
                            {log.old_value ? (
                              <>
                                <span className="line-through text-slate-400 mr-1">{log.old_value}</span>
                                <span>&rarr; {log.new_value}</span>
                              </>
                            ) : (
                              <span>Set to: <strong>{log.new_value}</strong></span>
                            )}
                          </p>
                          <p className="text-[10px] text-slate-400">Source: {log.source}</p>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                <button
                  onClick={() => handleImportToCrm({ ids: [selectedBusiness.id] })}
                  disabled={isImporting || selectedBusiness.is_imported_to_crm}
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 cursor-pointer disabled:opacity-50"
                >
                  <UserPlus size={15} />
                  <span>{selectedBusiness.is_imported_to_crm ? 'Already in CRM' : 'Import to CRM'}</span>
                </button>

                {selectedBusiness.google_maps_url && (
                  <a
                    href={selectedBusiness.google_maps_url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all"
                  >
                    <MapPin size={15} />
                    <span>Maps</span>
                  </a>
                )}

                <button
                  onClick={() => setSelectedBusiness(null)}
                  className="px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================================== */}
      {/* CRM IMPORT SUMMARY MODAL (Smart Upsert & Deduplication) */}
      {/* ============================================================== */}
      <AnimatePresence>
        {importSummaryModal.isOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
              onClick={() => setImportSummaryModal((prev) => ({ ...prev, isOpen: false }))}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 z-10 space-y-4"
            >
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={22} />
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900">CRM Import & Deduplication Summary</h3>
                  <p className="text-xs text-slate-400">Phone-uniqueness & non-destructive upsert</p>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-2 text-xs">
                <div className="flex justify-between items-center font-semibold">
                  <span className="text-slate-600">Discovered Leads:</span>
                  <span className="text-slate-900 font-bold">{importSummaryModal.discovered}</span>
                </div>
                <div className="flex justify-between items-center font-semibold">
                  <span className="text-slate-600">Already Existing in CRM:</span>
                  <span className="text-slate-700 font-bold">{importSummaryModal.already_existing}</span>
                </div>
                <div className="flex justify-between items-center font-semibold">
                  <span className="text-slate-600">New Businesses Created:</span>
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                    +{importSummaryModal.new_businesses}
                  </span>
                </div>
                <div className="flex justify-between items-center font-semibold">
                  <span className="text-slate-600">Existing Businesses Enriched:</span>
                  <span className="text-indigo-700 font-bold bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-200">
                    +{importSummaryModal.existing_businesses_enriched}
                  </span>
                </div>
                <div className="flex justify-between items-center font-semibold">
                  <span className="text-slate-600">New Contacts Created:</span>
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                    +{importSummaryModal.new_contacts}
                  </span>
                </div>
                <div className="flex justify-between items-center font-semibold">
                  <span className="text-slate-600">Existing Contacts Enriched:</span>
                  <span className="text-indigo-700 font-bold bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-200">
                    +{importSummaryModal.existing_contacts_enriched}
                  </span>
                </div>
                <div className="flex justify-between items-center font-semibold">
                  <span className="text-slate-600">Duplicates Prevented:</span>
                  <span className="text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                    {importSummaryModal.duplicates_prevented}
                  </span>
                </div>
                {importSummaryModal.failed > 0 && (
                  <div className="flex justify-between items-center font-semibold">
                    <span className="text-rose-600">Failed / Errors:</span>
                    <span className="text-rose-700 font-bold">{importSummaryModal.failed}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold border-t border-slate-200/60 pt-2 text-sm">
                  <span className="text-slate-800 font-bold">Final Unique in CRM:</span>
                  <span className="text-slate-900 font-black">{importSummaryModal.final_unique}</span>
                </div>
              </div>

              {importSummaryModal.already_up_to_date > 0 && importSummaryModal.created === 0 && (
                <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-3 text-[11px] text-emerald-800 space-y-1">
                  <span className="font-bold flex items-center gap-1 text-emerald-900">
                    <ShieldCheck size={14} className="text-emerald-600" /> Phone Deduplication Active
                  </span>
                  <p>
                    All {importSummaryModal.already_up_to_date} evaluated leads already exist in your CRM Contacts with identical phone numbers. No duplicate contacts were created.
                  </p>
                </div>
              )}

              {importSummaryModal.errors && importSummaryModal.errors.length > 0 && (
                <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-3 text-[11px] text-amber-800 space-y-1">
                  <span className="font-bold block text-amber-900">Notice:</span>
                  {importSummaryModal.errors.map((err, idx) => (
                    <p key={idx}>{err}</p>
                  ))}
                </div>
              )}

              <p className="text-[11px] text-slate-500 leading-relaxed">
                Normalized E.164 phone numbers act as the primary contact key. Matching existing contacts received missing emails, websites, or secondary phones without overwriting existing CRM data.
              </p>

              <div className="flex items-center gap-2 pt-1">
                <Link
                  to="/contacts"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#6D4AFF] to-indigo-700 hover:from-[#5b3ce0] hover:to-indigo-800 text-white font-bold text-xs text-center transition-all shadow-sm shadow-[#6D4AFF]/25"
                >
                  View in CRM Contacts &rarr;
                </Link>
                <button
                  onClick={() => setImportSummaryModal((prev) => ({ ...prev, isOpen: false }))}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
