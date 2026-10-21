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
import { useI18n } from '../../i18n';
import { cn } from '../../lib/utils';

export default function BusinessScraperPage() {
  const { t, isRtl } = useI18n();

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
  const popularChips = isRtl
    ? [
        t('app.scraper.dental_clinic_2be0ba', 'عيادة أسنان'),
        t('app.scraper.real_estate_agency_4eb8cf', 'مكتب عقاري'),
        t('app.scraper.digital_marketing_29ff60', 'التسويق الرقمي'),
        t('app.scraper.law_firm_da06bf', 'مكتب محاماة'),
        t('app.scraper.fitness_gym_fc186f', 'نادٍ رياضي'),
        t('app.scraper.software_company_fa1664', 'شركة برمجيات'),
        t('app.scraper.restaurant_cafe_6bc5e0', 'مطعم ومقهى'),
      ]
    : [
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
    { key: 'Healthcare', label: isRtl ? 'الرعاية الصحية (إنشاء التصنيف تلقائيًا)' : 'Healthcare (Auto-create category)' },
    { key: 'Dental', label: isRtl ? 'طب الأسنان (إنشاء التصنيف تلقائيًا)' : 'Dental (Auto-create category)' },
    { key: 'Aesthetic', label: isRtl ? 'التجميل (إنشاء التصنيف تلقائيًا)' : 'Aesthetic (Auto-create category)' },
    { key: 'Real Estate', label: isRtl ? 'العقارات (إنشاء التصنيف تلقائيًا)' : 'Real Estate (Auto-create category)' },
    { key: 'Technology', label: isRtl ? 'التقنية (إنشاء التصنيف تلقائيًا)' : 'Technology (Auto-create category)' },
    { key: 'Digital Marketing', label: isRtl ? 'التسويق الرقمي (إنشاء التصنيف تلقائيًا)' : 'Digital Marketing (Auto-create category)' },
    { key: 'Legal', label: isRtl ? 'الخدمات القانونية (إنشاء التصنيف تلقائيًا)' : 'Legal (Auto-create category)' },
    { key: 'Accounting & Tax', label: isRtl ? 'المحاسبة والضرائب (إنشاء التصنيف تلقائيًا)' : 'Accounting & Tax (Auto-create category)' },
    { key: 'Education', label: isRtl ? 'التعليم (إنشاء التصنيف تلقائيًا)' : 'Education (Auto-create category)' },
    { key: 'Construction', label: isRtl ? 'الإنشاءات (إنشاء التصنيف تلقائيًا)' : 'Construction (Auto-create category)' },
    { key: 'Architecture', label: isRtl ? 'الهندسة المعمارية (إنشاء التصنيف تلقائيًا)' : 'Architecture (Auto-create category)' },
    { key: 'Manufacturing', label: isRtl ? 'التصنيع (إنشاء التصنيف تلقائيًا)' : 'Manufacturing (Auto-create category)' },
    { key: 'Packaging', label: isRtl ? 'التعبئة والتغليف (إنشاء التصنيف تلقائيًا)' : 'Packaging (Auto-create category)' },
    { key: 'Logistics', label: isRtl ? 'الخدمات اللوجستية (إنشاء التصنيف تلقائيًا)' : 'Logistics (Auto-create category)' },
    { key: 'Travel', label: isRtl ? 'السفر (إنشاء التصنيف تلقائيًا)' : 'Travel (Auto-create category)' },
    { key: 'Automotive', label: isRtl ? 'السيارات (إنشاء التصنيف تلقائيًا)' : 'Automotive (Auto-create category)' },
    { key: 'Hospitality', label: isRtl ? 'الضيافة (إنشاء التصنيف تلقائيًا)' : 'Hospitality (Auto-create category)' },
    { key: 'Retail', label: isRtl ? 'التجزئة (إنشاء التصنيف تلقائيًا)' : 'Retail (Auto-create category)' },
    { key: 'Professional Services', label: isRtl ? 'الخدمات المهنية (إنشاء التصنيف تلقائيًا)' : 'Professional Services (Auto-create category)' },
    { key: 'Other', label: isRtl ? 'أخرى (إنشاء التصنيف تلقائيًا)' : 'Other (Auto-create category)' },
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
      const summary: any = isImportAll
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
          isRtl ? 'تم الاستيراد إلى CRM بنجاح' : 'CRM Import Succeeded',
          isRtl
            ? `تم إنشاء ${created.toLocaleString('ar-SA')} جهة اتصال جديدة، وإثراء ${enriched.toLocaleString('ar-SA')} جهة اتصال حالية.`
            : `${created} new contacts created, ${enriched} existing contacts enriched.`
        );
      } else if (alreadyUpToDate > 0) {
        toast.info(
          isRtl ? 'موجود بالفعل في CRM' : 'Already in CRM',
          isRtl
            ? `كافة العملاء (${alreadyUpToDate.toLocaleString('ar-SA')}) موجودون بالفعل في إدارة العملاء وبياناتهم محدثة.`
            : `All ${alreadyUpToDate} leads already exist in your CRM and are up-to-date.`
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
          label: isRtl ? 'الفئة A — ممتاز' : 'Grade A — Excellent',
        };
      case 'B':
        return {
          bg: 'bg-indigo-50 text-indigo-800 border-indigo-200',
          dot: 'bg-indigo-500',
          label: isRtl ? 'الفئة B — جيد' : 'Grade B — Good',
        };
      case 'C':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          dot: 'bg-amber-500',
          label: isRtl ? 'الفئة C — جزئي' : 'Grade C — Partial',
        };
      default:
        return {
          bg: 'bg-rose-50 text-rose-800 border-rose-200',
          dot: 'bg-rose-500',
          label: isRtl ? 'الفئة D — بيانات محدودة' : 'Grade D — Low Data',
        };
    }
  };

  // Calculate dynamic metrics for Summary Cards from current activeSearch or latest search
  const displayMetrics = {
    found: Number(activeSearch?.total_found ?? stats?.total_leads_scraped ?? 0).toLocaleString(isRtl ? 'ar-SA' : 'en-US'),
    websites: Number(activeSearch?.websites_found ?? 0).toLocaleString(isRtl ? 'ar-SA' : 'en-US'),
    emails: Number(activeSearch?.total_emails_found ?? stats?.total_emails_discovered ?? 0).toLocaleString(isRtl ? 'ar-SA' : 'en-US'),
    duplicates: Number((activeSearch?.duplicates_removed ?? activeSearch?.total_duplicates) ?? 0).toLocaleString(isRtl ? 'ar-SA' : 'en-US'),
    noEmail: Number(activeSearch?.no_email ?? 0).toLocaleString(isRtl ? 'ar-SA' : 'en-US'),
    failed: Number(activeSearch?.total_failed ?? 0).toLocaleString(isRtl ? 'ar-SA' : 'en-US'),
  };

  return (
    <div 
      className={cn("p-6 max-w-7xl mx-auto space-y-6 animate-fade-in", isRtl ? "font-arabic text-right" : "font-sans text-left")}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-2">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-12 h-12 bg-[#F0FDF4] text-[#166534] border border-[#22C55E]/30 rounded-2xl flex items-center justify-center shadow-xs shrink-0">
            <Compass size={24} strokeWidth={2} className="text-[#166534]" />
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#12263A] tracking-tight">
                {t('app.scraper.discover_businesses_1e4bed', 'Discover Businesses')}
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#F0FDF4] text-[#166534] border border-[#22C55E]/30">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                {t('app.scraper.official_google_places_public_website_scraper_e6bbfc', 'Google Places & Website Scraper')}
              </span>
            </div>
            <p className="text-xs sm:text-sm font-medium text-[#57534E] max-w-2xl leading-relaxed">
              {t('app.scraper.find_businesses_websites_public_contact_emails_inspe_abe75a', 'Find businesses, websites & public contact emails. Inspect business homepages, contact & about pages, normalize verified addresses, and selectively import qualified leads to your CRM.')}
            </p>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white border border-stone-200/80 rounded-2xl px-4 py-3 text-center shadow-xs min-w-[100px]">
            <p className="text-[11px] uppercase tracking-wider text-[#57534E] font-bold">
              {t('app.scraper.searches_1cb99c', 'Searches')}
            </p>
            <p className="text-xl font-black text-[#12263A] mt-0.5">{stats?.total_searches ?? 0}</p>
          </div>
          <div className="bg-white border border-stone-200/80 rounded-2xl px-4 py-3 text-center shadow-xs min-w-[100px]">
            <p className="text-[11px] uppercase tracking-wider text-[#57534E] font-bold">
              {t('app.scraper.businesses_b11179', 'Businesses')}
            </p>
            <p className="text-xl font-black text-[#12263A] mt-0.5">{stats?.total_leads_scraped ?? 0}</p>
          </div>
          <div className="bg-white border border-stone-200/80 rounded-2xl px-4 py-3 text-center shadow-xs min-w-[100px]">
            <p className="text-[11px] uppercase tracking-wider text-[#57534E] font-bold">
              {t('app.scraper.emails_found_8c5b14', 'Emails Found')}
            </p>
            <p className="text-xl font-black text-[#166534] mt-0.5">{stats?.total_emails_discovered ?? 0}</p>
          </div>
          <div className="bg-white border border-stone-200/80 rounded-2xl px-4 py-3 text-center shadow-xs min-w-[100px]">
            <p className="text-[11px] uppercase tracking-wider text-[#57534E] font-bold">
              {t('app.scraper.in_crm_74b5b6', 'In CRM')}
            </p>
            <p className="text-xl font-black text-[#166534] mt-0.5">{stats?.total_imported_crm ?? 0}</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-stone-200">
        <button
          onClick={() => setActiveTab('search')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'search'
              ? 'border-[#166534] text-[#166534]'
              : 'border-transparent text-stone-500 hover:text-[#12263A]'
          }`}
        >
          <Search size={16} />
          <span>{t('app.scraper.discover_businesses_bac589', 'Discover Businesses')}</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('results');
            loadResults(1);
          }}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-all cursor-pointer relative ${
            activeTab === 'results'
              ? 'border-[#166534] text-[#166534]'
              : 'border-transparent text-stone-500 hover:text-[#12263A]'
          }`}
        >
          <Building2 size={16} />
          <span>{t('app.scraper.discovered_leads_dbba9b', 'Discovered Leads')}</span>
          {pagination?.total ? (
            <span className="px-2 py-0.5 text-[11px] rounded-full bg-[#F0FDF4] text-[#166534] border border-[#22C55E]/30 font-bold">
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
              ? 'border-[#166534] text-[#166534]'
              : 'border-transparent text-stone-500 hover:text-[#12263A]'
          }`}
        >
          <Clock size={16} />
          <span>{t('app.scraper.search_history_66d7e4', 'Search History')}</span>
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
                <h2 className="text-lg font-bold text-[#12263A]">
                  {t('app.scraper.discover_businesses_bac589', 'Discover Businesses')}
                </h2>
                <p className="text-xs text-[#57534E] mt-0.5">
                  {t('app.scraper.find_businesses_websites_public_contact_emails_8b2911', 'Find businesses, websites & public contact emails')}
                </p>
              </div>
              <span className="w-10 h-10 rounded-2xl bg-[#F0FDF4] text-[#166534] flex items-center justify-center">
                <Sparkles size={20} />
              </span>
            </div>

            <form onSubmit={handleStartSearch} className="space-y-6">
              {/* SECTION 1 — BUSINESS SEARCH */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
                    {t('app.scraper.business_type_search_query_5d4eea', 'Business Type / Search Query')} <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[11px] text-slate-400">
                    {t('app.scraper.free_text_or_category_keyword_653374', 'Free-text or category keyword')}
                  </span>
                </div>
                <div className="relative">
                  <Search size={18} className={cn("absolute top-1/2 -translate-y-1/2 text-slate-400", isRtl ? "right-4" : "left-4")} />
                  <input
                    type="text"
                    required
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder={isRtl ? 'مثال: عيادة أسنان، مكتب عقارات، شركة برمجيات' : 'e.g. Dental Clinic, Real Estate Agency, Software Company'}
                    className={cn(
                      "w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#166534] transition-all",
                      isRtl ? "pr-12 pl-4 text-right" : "pl-12 pr-4 text-left"
                    )}
                  />
                </div>

                {/* Popular Search Chips */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {t('app.scraper.popular_searches_970175', 'POPULAR SEARCHES:')}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {popularChips.map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => setKeyword(chip)}
                        className={`px-3 py-1 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                          keyword === chip
                            ? 'bg-[#166534] text-white border-[#166534]'
                            : 'bg-slate-50 hover:bg-[#F0FDF4] text-slate-700 hover:text-[#166534] border-slate-200'
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
                {/* Category & Industry Dropdown */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
                      {t('app.scraper.category_b7387b', 'CATEGORY')} <span className="text-[#166534] font-extrabold">*</span>
                    </label>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {t('app.scraper.auto_links_to_crm_644553', 'Auto-links to CRM')}
                    </span>
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
                    className={cn(
                      "w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-sm font-semibold text-slate-900 focus:outline-none focus:bg-white focus:border-[#166534] transition-all cursor-pointer",
                      isRtl && "text-right"
                    )}
                  >
                    <option value="">{t('app.scraper.select_crm_category_d1015c', 'Select CRM Category...')}</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                    {industryOptions
                      .filter((ind) => !categories.some((c) => c.name.toLowerCase() === ind.key.toLowerCase()))
                      .map((ind) => (
                        <option key={ind.key} value="">
                          {ind.label}
                        </option>
                      ))}
                  </select>
                  <p className="text-[11px] text-slate-400">
                    {t('app.scraper.all_discovered_businesses_will_be_associated_with_th_fb4949', 'All discovered businesses will be associated with this category.')}
                  </p>
                </div>

                {/* Location / City Input */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
                    {t('app.scraper.location_city_e0c3a0', 'LOCATION / CITY')} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin size={18} className={cn("absolute top-1/2 -translate-y-1/2 text-slate-400", isRtl ? "right-4" : "left-4")} />
                    <input
                      type="text"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder={isRtl ? 'مثال: الرياض، السعودية أو لندن، بريطانيا' : 'e.g. Riyadh, Saudi Arabia or London, UK'}
                      className={cn(
                        "w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#166534] transition-all",
                        isRtl ? "pr-12 pl-4 text-right" : "pl-12 pr-4 text-left"
                      )}
                    />
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {t('app.scraper.enter_city_region_or_country_a6fdc3', 'Enter city, region, or country')}
                  </p>
                </div>
              </div>

              {/* SEARCH COVERAGE & LEAD VOLUME ROW */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Search Coverage Dropdown */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
                    {t('app.scraper.search_coverage_9b1938', 'SEARCH COVERAGE')}
                  </label>
                  <select
                    value={coverageRadius}
                    onChange={(e) => setCoverageRadius(Number(e.target.value))}
                    className={cn(
                      "w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-sm font-semibold text-slate-900 focus:outline-none focus:bg-white focus:border-[#166534] transition-all cursor-pointer",
                      isRtl && "text-right"
                    )}
                  >
                    <option value={5000}>{t('app.scraper.5_km_local_aba5dc', '5 km — Local')}</option>
                    <option value={10000}>{t('app.scraper.10_km_nearby_bd2552', '10 km — Nearby')}</option>
                    <option value={25000}>{t('app.scraper.25_km_metro_area_fd0886', '25 km — Metro Area')}</option>
                    <option value={50000}>{t('app.scraper.50_km_regional_d31204', '50 km — Regional')}</option>
                    <option value={100000}>{t('app.scraper.100_km_extended_b54b9f', '100 km — Extended')}</option>
                  </select>
                  <p className="text-[11px] text-slate-400">
                    {t('app.scraper.broad_geographic_searches_are_subdivided_into_sub_zo_98cc8e', 'Broad geographic searches are subdivided into sub-zones')}
                  </p>
                </div>

                {/* Lead Volume Dropdown */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
                    {t('app.scraper.lead_volume_3b7a1b', 'LEAD VOLUME')}
                  </label>
                  <select
                    value={leadVolume}
                    onChange={(e) => setLeadVolume(Number(e.target.value))}
                    className={cn(
                      "w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-sm font-semibold text-slate-900 focus:outline-none focus:bg-white focus:border-[#166534] transition-all cursor-pointer",
                      isRtl && "text-right"
                    )}
                  >
                    <option value={20}>{t('app.scraper.20_quick_test_c2a03a', '20 — Quick Test')}</option>
                    <option value={50}>{t('app.scraper.50_small_search_f16bc3', '50 — Small Search')}</option>
                    <option value={100}>{t('app.scraper.100_standard_search_d8c23f', '100 — Standard Search')}</option>
                    <option value={250}>{t('app.scraper.250_large_search_080b3a', '250 — Large Search')}</option>
                    <option value={500}>{t('app.scraper.500_bulk_search_b92b64', '500 — Bulk Search')}</option>
                    <option value={1000}>{t('app.scraper.1_000_large_batch_e4fb74', '1,000 — Large Batch')}</option>
                    <option value={5000}>{t('app.scraper.5_000_enterprise_batch_03b90e', '5,000 — Enterprise Batch')}</option>
                  </select>
                  <p className="text-[11px] text-slate-400">
                    {t('app.scraper.target_unique_businesses_across_the_search_area_90a168', 'Target unique businesses across the search area')}
                  </p>
                </div>
              </div>

              {/* SEARCH ENGINE MODE SELECTOR */}
              <div className="space-y-2 pt-1">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
                  {t('app.scraper.search_engine_mode_791fab', 'SEARCH ENGINE MODE')}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setSearchMode('deep')}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer relative ${
                      searchMode === 'deep'
                        ? 'border-[#166534] bg-[#F0FDF4]/50 shadow-sm'
                        : 'border-slate-200 bg-slate-50 hover:bg-white'
                    }`}
                  >
                    <span className={cn(
                      "absolute top-2.5 px-2 py-0.5 rounded-md bg-[#166534] text-[9px] font-extrabold text-white uppercase tracking-wider",
                      isRtl ? "left-2.5" : "right-2.5"
                    )}>
                      {t('app.scraper.5_000_volume_ready_2bcadd', '5,000 VOLUME READY')}
                    </span>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          searchMode === 'deep' ? 'border-[#166534] bg-[#166534]' : 'border-slate-300'
                        }`}
                      >
                        {searchMode === 'deep' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <span className="font-bold text-xs text-slate-900">
                        {t('app.scraper.deep_geographic_discovery_f23507', 'Deep Geographic Discovery')}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                      {t('app.scraper.subdivides_coverage_area_into_multiple_geographic_ce_89ae46', 'Subdivides coverage area into multiple geographic cells and expands query variations to discover up to 5,000 unique businesses.')}
                    </p>
                  </div>

                  <div
                    onClick={() => setSearchMode('standard')}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      searchMode === 'standard'
                        ? 'border-[#166534] bg-[#F0FDF4]/50 shadow-sm'
                        : 'border-slate-200 bg-slate-50 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          searchMode === 'standard' ? 'border-[#166534] bg-[#166534]' : 'border-slate-300'
                        }`}
                      >
                        {searchMode === 'standard' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <span className="font-bold text-xs text-slate-900">
                        {t('app.scraper.standard_search_08bf91', 'Standard Search')}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                      {t('app.scraper.single_hub_discovery_suitable_for_quick_tests_and_sm_0521c8', 'Single-hub discovery suitable for quick tests and smaller searches (up to 50 businesses).')}
                    </p>
                  </div>
                </div>
              </div>

              {/* DATA TO COLLECT */}
              <div className="space-y-3 pt-2">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
                  {t('app.scraper.data_to_collect_118c9b', 'DATA TO COLLECT')}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-xs">
                  <label className="flex items-center gap-2 text-slate-800 font-semibold cursor-default">
                    <input type="checkbox" checked disabled className="rounded text-[#166534]" />
                    <span>{t('app.scraper.business_name_e922f3', 'Business Name')}</span>
                  </label>
                  <label className="flex items-center gap-2 text-slate-800 font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={dataToCollect.website}
                      onChange={(e) => setDataToCollect((p) => ({ ...p, website: e.target.checked }))}
                      className="rounded text-[#166534]"
                    />
                    <span>{t('app.scraper.website_b5a229', 'Website')}</span>
                  </label>
                  <label className="flex items-center gap-2 text-slate-800 font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={dataToCollect.email}
                      onChange={(e) => setDataToCollect((p) => ({ ...p, email: e.target.checked }))}
                      className="rounded text-[#166534]"
                    />
                    <span>{t('app.scraper.email_969ccb', 'Email')}</span>
                  </label>
                  <label className="flex items-center gap-2 text-slate-800 font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={dataToCollect.phone}
                      onChange={(e) => setDataToCollect((p) => ({ ...p, phone: e.target.checked }))}
                      className="rounded text-[#166534]"
                    />
                    <span>{t('app.scraper.phone_63dceb', 'Phone')}</span>
                  </label>
                  <label className="flex items-center gap-2 text-slate-800 font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={dataToCollect.address}
                      onChange={(e) => setDataToCollect((p) => ({ ...p, address: e.target.checked }))}
                      className="rounded text-[#166534]"
                    />
                    <span>{t('app.scraper.address_56ef8f', 'Address')}</span>
                  </label>
                  <label className="flex items-center gap-2 text-slate-800 font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={dataToCollect.google_maps_url}
                      onChange={(e) => setDataToCollect((p) => ({ ...p, google_maps_url: e.target.checked }))}
                      className="rounded text-[#166534]"
                    />
                    <span>{t('app.scraper.google_maps_url_acf9de', 'Google Maps URL')}</span>
                  </label>
                  <label className="flex items-center gap-2 text-slate-600 font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={dataToCollect.rating}
                      onChange={(e) => setDataToCollect((p) => ({ ...p, rating: e.target.checked }))}
                      className="rounded text-[#166534]"
                    />
                    <span>{t('app.scraper.rating_9f2953', 'Rating')}</span>
                  </label>
                  <label className="flex items-center gap-2 text-slate-600 font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={dataToCollect.reviews}
                      onChange={(e) => setDataToCollect((p) => ({ ...p, reviews: e.target.checked }))}
                      className="rounded text-[#166534]"
                    />
                    <span>{t('app.scraper.review_count_35f417', 'Review Count')}</span>
                  </label>
                  <label className="flex items-center gap-2 text-slate-600 font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={dataToCollect.category}
                      onChange={(e) => setDataToCollect((p) => ({ ...p, category: e.target.checked }))}
                      className="rounded text-[#166534]"
                    />
                    <span>{t('app.scraper.category_292c06', 'Category')}</span>
                  </label>
                </div>
              </div>

              {/* EMAIL DISCOVERY */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
                    {t('app.scraper.email_discovery_803d70', 'EMAIL DISCOVERY')}
                  </label>
                  <span className="text-[11px] text-[#166534] font-bold">
                    {t('app.scraper.public_website_contact_email_873a31', 'Public website contact email')}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div
                    onClick={() => setEmailDiscoveryMode('basic')}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      emailDiscoveryMode === 'basic'
                        ? 'border-[#166534] bg-[#F0FDF4]/50 shadow-sm'
                        : 'border-slate-200 bg-slate-50 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          emailDiscoveryMode === 'basic' ? 'border-[#166534] bg-[#166534]' : 'border-slate-300'
                        }`}
                      >
                        {emailDiscoveryMode === 'basic' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <span className="font-bold text-xs text-slate-900">
                        {t('app.scraper.basic_0e35f6', 'Basic')}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                      {t('app.scraper.checks_only_the_main_landing_page_of_each_company_we_dd205a', 'Checks only the main landing page of each company website.')}
                    </p>
                  </div>

                  <div
                    onClick={() => setEmailDiscoveryMode('website_contact')}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer relative ${
                      emailDiscoveryMode === 'website_contact'
                        ? 'border-[#166534] bg-[#F0FDF4]/50 shadow-sm'
                        : 'border-slate-200 bg-slate-50 hover:bg-white'
                    }`}
                  >
                    <span className={cn(
                      "absolute top-2 px-1.5 py-0.5 rounded-md bg-[#166534] text-[9px] font-extrabold text-white uppercase tracking-wider",
                      isRtl ? "left-2" : "right-2"
                    )}>
                      {t('app.scraper.recommended_baa505', 'RECOMMENDED')}
                    </span>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          emailDiscoveryMode === 'website_contact'
                            ? 'border-[#166534] bg-[#166534]'
                            : 'border-slate-300'
                        }`}
                      >
                        {emailDiscoveryMode === 'website_contact' && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </div>
                      <span className="font-bold text-xs text-slate-900">
                        {isRtl ? 'الموقع + صفحات التواصل' : 'Website + Contact Pages'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                      {isRtl 
                        ? 'استخراج عناوين البريد المعلنة من الصفحة الرئيسية وصفحات /contact و/about وروابط mailto.' 
                        : 'Finds publicly listed emails from homepage, /contact, /contact-us, /about, & mailto links.'}
                    </p>
                  </div>

                  <div
                    onClick={() => setEmailDiscoveryMode('deep')}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      emailDiscoveryMode === 'deep'
                        ? 'border-[#166534] bg-[#F0FDF4]/50 shadow-sm'
                        : 'border-slate-200 bg-slate-50 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          emailDiscoveryMode === 'deep' ? 'border-[#166534] bg-[#166534]' : 'border-slate-300'
                        }`}
                      >
                        {emailDiscoveryMode === 'deep' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <span className="font-bold text-xs text-slate-900">
                        {isRtl ? 'استكشاف عميق' : 'Deep Discovery'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                      {isRtl 
                        ? 'فحص صفحات فرعية إضافية للتواصل وفريق العمل والتذييل.' 
                        : 'Extended shallow crawl across contact, team, and footer subpages.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* LEAD REQUIREMENTS & DUPLICATE HANDLING ROW */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                {/* Lead Requirements */}
                <div className="space-y-2.5">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
                    {isRtl ? 'متطلبات العملاء المحتملين' : 'Lead Requirements'}
                  </label>
                  <div className="space-y-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 text-xs">
                    <label className="flex items-center gap-2 text-slate-900 font-bold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={leadRequirements.must_have_email}
                        onChange={(e) => setLeadRequirements((p) => ({ ...p, must_have_email: e.target.checked }))}
                        className="rounded text-[#166534]"
                      />
                      <span>{isRtl ? 'يجب توفر البريد الإلكتروني (موصى به)' : 'Must have email (Recommended)'}</span>
                    </label>
                    <label className="flex items-center gap-2 text-slate-700 font-medium cursor-pointer">
                      <input
                        type="checkbox"
                        checked={leadRequirements.must_have_website}
                        onChange={(e) => setLeadRequirements((p) => ({ ...p, must_have_website: e.target.checked }))}
                        className="rounded text-[#166534]"
                      />
                      <span>{isRtl ? 'يجب توفر الموقع الإلكتروني' : 'Must have website'}</span>
                    </label>
                    <label className="flex items-center gap-2 text-slate-700 font-medium cursor-pointer">
                      <input
                        type="checkbox"
                        checked={leadRequirements.must_have_phone}
                        onChange={(e) => setLeadRequirements((p) => ({ ...p, must_have_phone: e.target.checked }))}
                        className="rounded text-[#166534]"
                      />
                      <span>{isRtl ? 'يجب توفر رقم الهاتف' : 'Must have phone'}</span>
                    </label>
                  </div>
                </div>

                {/* Duplicate Handling */}
                <div className="space-y-2.5">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
                    {isRtl ? 'معالجة المكررات' : 'Duplicate Handling'}
                  </label>
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 text-xs space-y-2">
                    <label className="flex items-center gap-2 text-slate-900 font-bold cursor-pointer">
                      <input
                        type="radio"
                        name="dup_handling"
                        checked={autoDeduplicate}
                        onChange={() => setAutoDeduplicate(true)}
                        className="text-[#166534]"
                      />
                      <span>{isRtl ? 'استبعاد المكررات تلقائيًا' : 'Automatically remove duplicates'}</span>
                    </label>
                    <p className={cn("text-[11px] text-slate-500 leading-relaxed", isRtl ? "pr-5" : "pl-5")}>
                      {isRtl 
                        ? 'استبعاد المكررات استنادًا إلى معرّف Google Place ونطاق الموقع واسم المنشأة مع العنوان، والبريد الإلكتروني.'
                        : 'Deduplicates by Google Place ID, normalized domain, business name + address, and case-insensitive email.'}
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
                    <span>{showAdvanced ? '▾' : (isRtl ? '◂' : '▸')}</span>
                    <span>{isRtl ? 'خيارات البحث المتقدمة' : 'Advanced Search Options'}</span>
                  </span>
                  <span className="text-[11px] font-normal text-slate-400">
                    {showAdvanced 
                      ? (isRtl ? 'إخفاء الإعدادات المتقدمة' : 'Hide advanced settings') 
                      : (isRtl ? 'عوامل التصفية، مهل الطلبات وخيارات الزاحف' : 'Filters, timeouts & crawler options')}
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
                          <label className="font-bold text-slate-700">
                            {isRtl ? 'الحد الأدنى لتقييم Google' : 'Minimum Rating (Google)'}
                          </label>
                          <select
                            value={advancedOptions.min_rating}
                            onChange={(e) =>
                              setAdvancedOptions((p) => ({ ...p, min_rating: Number(e.target.value) }))
                            }
                            className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs"
                          >
                            <option value={0}>{isRtl ? 'أي تقييم' : 'Any Rating'}</option>
                            <option value={3.5}>{isRtl ? '3.5+ نجوم' : '3.5+ Stars'}</option>
                            <option value={4.0}>{isRtl ? '4.0+ نجوم' : '4.0+ Stars'}</option>
                            <option value={4.5}>{isRtl ? '4.5+ نجوم' : '4.5+ Stars'}</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="font-bold text-slate-700">
                            {isRtl ? 'مهلة الطلب' : 'Request Timeout'}
                          </label>
                          <select
                            value={advancedOptions.timeout}
                            onChange={(e) =>
                              setAdvancedOptions((p) => ({ ...p, timeout: Number(e.target.value) }))
                            }
                            className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs"
                          >
                            <option value={8}>{isRtl ? '8 ثوانٍ (سريع)' : '8 seconds (Fast)'}</option>
                            <option value={10}>{isRtl ? '10 ثوانٍ (عادي)' : '10 seconds (Standard)'}</option>
                            <option value={15}>{isRtl ? '15 ثانية (موسّع)' : '15 seconds (Extended)'}</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="font-bold text-slate-700">
                            {isRtl ? 'عمق صفحات الزاحف' : 'Crawler Page Depth'}
                          </label>
                          <select
                            value={advancedOptions.max_pages}
                            onChange={(e) =>
                              setAdvancedOptions((p) => ({ ...p, max_pages: Number(e.target.value) }))
                            }
                            className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs"
                          >
                            <option value={1}>{isRtl ? 'صفحة واحدة (الرئيسية فقط)' : '1 Page (Homepage only)'}</option>
                            <option value={3}>{isRtl ? '3 صفحات (الرئيسية + التواصل + من نحن)' : '3 Pages (Homepage + /contact + /about)'}</option>
                            <option value={5}>{isRtl ? '5 صفحات (فحص أعمق)' : '5 Pages (Deeper crawl)'}</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="font-bold text-slate-700">
                            {isRtl ? 'الطلبات المتزامنة' : 'Concurrent Requests'}
                          </label>
                          <select
                            value={advancedOptions.concurrency}
                            onChange={(e) =>
                              setAdvancedOptions((p) => ({ ...p, concurrency: Number(e.target.value) }))
                            }
                            className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs"
                          >
                            <option value={3}>{isRtl ? '3 مواقع في نفس الوقت' : '3 simultaneous websites'}</option>
                            <option value={5}>{isRtl ? '5 مواقع في نفس الوقت' : '5 simultaneous websites'}</option>
                            <option value={10}>{isRtl ? '10 مواقع في نفس الوقت' : '10 simultaneous websites'}</option>
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
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#166534] to-[#22C55E] hover:from-[#12263A] hover:to-[#14532d] text-white font-bold text-sm shadow-lg shadow-[#166534]/25 transition-all flex items-center justify-center gap-2.5 cursor-pointer active:scale-[0.99] disabled:opacity-70"
                >
                  {isStartingSearch ? (
                    <>
                      <RotateCw size={18} className="animate-spin" />
                      <span>{isRtl ? 'جارٍ بدء مهمة الاستخراج...' : 'Initiating Discovery Job...'}</span>
                    </>
                  ) : (
                    <>
                      <Play size={18} fill="currentColor" />
                      <span>{isRtl ? 'بدء استخراج بيانات المنشآت' : 'Start Business Discovery'}</span>
                    </>
                  )}
                </button>
                <p className="text-[11px] text-slate-400 text-center mt-2.5">
                  {isRtl 
                    ? 'يعمل الاستخراج في الخلفية بشكل غير متزامن. يمكنك مغادرة الصفحة في أي وقت دون مقاطعة المعالجة.' 
                    : 'Discovery runs asynchronously in the background. You can navigate away anytime without interrupting processing.'}
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
                    <h3 className="text-sm font-bold text-slate-900">
                      {isRtl ? 'تقدم عملية الاستكشاف المباشر' : 'Live Discovery Progress'}
                    </h3>
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
                  <p className="text-xs text-slate-400 font-medium">
                    {isRtl ? 'الهدف المستهدف' : 'Search Target'}
                  </p>
                  <p className="text-sm font-bold text-slate-800 mt-0.5">
                    {activeSearch.keyword} — {activeSearch.location}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                    <span className="px-2 py-0.5 rounded-md bg-[#F0FDF4] text-[#166534] text-[10px] font-bold">
                      {isRtl ? 'الهدف:' : 'Target:'} {Number(activeSearch.lead_volume ?? activeSearch.max_results ?? 5000).toLocaleString(isRtl ? 'ar-SA' : 'en-US')}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold uppercase">
                      {activeSearch.search_mode === 'deep' 
                        ? (isRtl ? 'استكشاف جغرافي موسّع' : 'Deep Grid Discovery') 
                        : (isRtl ? 'عادي' : 'Standard')}
                    </span>
                    {activeSearch.phase && (
                      <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-bold capitalize">
                        {isRtl 
                          ? (activeSearch.phase === 'discovery' ? 'المرحلة: الاستكشاف الجغرافي' : activeSearch.phase === 'enrichment' ? 'المرحلة: استخراج بريد المواقع' : `المرحلة: ${activeSearch.phase}`)
                          : `Phase: ${activeSearch.phase === 'discovery' ? 'Geographic Grid Discovery' : activeSearch.phase === 'enrichment' ? 'Website Email Enrichment' : activeSearch.phase}`}
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
                          ? (isRtl ? 'اكتمل نطاق الاستكشاف' : 'Discovery Saturated')
                          : activeSearch.exhaustion_note?.includes('Target achieved')
                          ? (isRtl ? 'تم تحقيق العدد المستهدف' : 'Target Achieved')
                          : (isRtl ? 'استنفاد التغطية الجغرافية' : 'Coverage Exhausted')}
                      </p>
                      <p className="text-amber-800 text-[11px] mt-0.5 leading-relaxed">
                        {activeSearch.exhaustion_note || (isRtl 
                          ? `تم استكشاف كافة المنشآت المسجلة والبالغ عددها ${(activeSearch.total_found ?? 0).toLocaleString('ar-SA')} ضمن نطاق البحث في هذه المنطقة.`
                          : `Discovered all ${(activeSearch.total_found ?? 0).toLocaleString()} unique registered businesses across the search grid in this area.`)}
                      </p>
                    </div>
                  </div>
                )}

                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-slate-600">
                    <span>
                      {activeSearch.status === 'completed'
                        ? (isRtl ? 'اكتمل الاستكشاف والاستخراج' : 'Discovery & Extraction Completed')
                        : activeSearch.phase === 'discovery'
                        ? (isRtl ? 'جاري الاستكشاف الجغرافي...' : 'Discovery in progress')
                        : activeSearch.phase === 'enrichment'
                        ? (isRtl 
                            ? `استخراج بريد المواقع (${(activeSearch.total_processed ?? 0).toLocaleString('ar-SA')} / ${(activeSearch.websites_found ?? 0).toLocaleString('ar-SA')} موقع)` 
                            : `Website email extraction (${(activeSearch.total_processed ?? 0).toLocaleString()} / ${(activeSearch.websites_found ?? 0).toLocaleString()} websites)`)
                        : (isRtl ? 'اكتمل الاستكشاف' : 'Discovery completed')}
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
                      className="h-full bg-gradient-to-r from-[#166534] to-[#22C55E] transition-all duration-500 rounded-full"
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
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {isRtl ? 'منشآت غير مكررة' : 'Unique Businesses'}
                    </span>
                    <p className="text-lg font-black text-slate-900 mt-0.5">
                      {(activeSearch.total_found ?? 0).toLocaleString(isRtl ? 'ar-SA' : 'en-US')}
                    </p>
                  </div>

                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {isRtl ? 'نطاقات البحث' : 'Search Zones'}
                    </span>
                    <p className="text-lg font-black text-indigo-600 mt-0.5">
                      {activeSearch.zones_completed ?? 0} / {activeSearch.zones_total ?? 1}
                    </p>
                  </div>

                  <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-3">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                      {isRtl ? 'عناوين البريد' : 'Emails Found'}
                    </span>
                    <p className="text-lg font-black text-emerald-700 mt-0.5">
                      {(activeSearch.total_emails_found ?? 0).toLocaleString(isRtl ? 'ar-SA' : 'en-US')}
                    </p>
                  </div>

                  <div className="bg-amber-50/70 border border-amber-100 rounded-xl p-3">
                    <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">
                      {isRtl ? 'المكررات المستبعدة' : 'Duplicates Removed'}
                    </span>
                    <p className="text-lg font-black text-amber-700 mt-0.5">
                      {((activeSearch.duplicates_removed ?? activeSearch.total_duplicates) ?? 0).toLocaleString(isRtl ? 'ar-SA' : 'en-US')}
                    </p>
                  </div>

                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {isRtl ? 'المواقع المكتشفة' : 'Websites Found'}
                    </span>
                    <p className="text-lg font-black text-slate-600 mt-0.5">
                      {(activeSearch.websites_found ?? 0).toLocaleString(isRtl ? 'ar-SA' : 'en-US')}
                    </p>
                  </div>

                  <div className="bg-red-50/70 border border-red-100 rounded-xl p-3">
                    <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">
                      {isRtl ? 'مواقع غير ناجحة' : 'Failed Websites'}
                    </span>
                    <p className="text-lg font-black text-red-700 mt-0.5">
                      {(activeSearch.total_failed ?? 0).toLocaleString(isRtl ? 'ar-SA' : 'en-US')}
                    </p>
                  </div>
                </div>

                {/* DISCOVERY SATURATION STATISTICS CARD */}
                {activeSearch?.options?.discovery_stats && (
                  <div className="p-4 bg-slate-50 border border-slate-200/90 rounded-2xl text-xs space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-200/70 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#166534]" />
                        <h4 className="font-extrabold text-slate-800 text-[11px] uppercase tracking-wider">
                          {isRtl ? 'إحصائيات تشبع الاكتشاف' : 'Discovery Saturation Statistics'}
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
                        {isRtl ? 'مستوى التشبع: ' : 'Saturation: '}
                        {activeSearch.options.discovery_stats.saturation === 'SATURATED'
                          ? (isRtl ? 'مكتمل التشبع' : 'SATURATED')
                          : activeSearch.options.discovery_stats.saturation === 'TARGET REACHED'
                          ? (isRtl ? 'تم تحقيق الهدف' : 'TARGET REACHED')
                          : activeSearch.options.discovery_stats.saturation}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                      <div className="bg-white border border-slate-200/80 rounded-xl p-2">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">
                          {isRtl ? 'الهدف' : 'Target'}
                        </span>
                        <p className="font-extrabold text-slate-800 text-xs mt-0.5">
                          {Number(activeSearch.options.discovery_stats.target ?? 5000).toLocaleString(isRtl ? 'ar-SA' : 'en-US')}
                        </p>
                      </div>
                      <div className="bg-white border border-slate-200/80 rounded-xl p-2">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">
                          {isRtl ? 'فريد' : 'Unique'}
                        </span>
                        <p className="font-extrabold text-[#166534] text-xs mt-0.5">
                          {Number(activeSearch.options.discovery_stats.unique_businesses ?? activeSearch.total_found ?? 0).toLocaleString(isRtl ? 'ar-SA' : 'en-US')}
                        </p>
                      </div>
                      <div className="bg-white border border-slate-200/80 rounded-xl p-2">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">
                          {isRtl ? 'المكررات' : 'Duplicates'}
                        </span>
                        <p className="font-extrabold text-amber-700 text-xs mt-0.5">
                          {Number(activeSearch.options.discovery_stats.total_duplicates ?? activeSearch.total_duplicates ?? 0).toLocaleString(isRtl ? 'ar-SA' : 'en-US')}
                        </p>
                      </div>
                      <div className="bg-white border border-slate-200/80 rounded-xl p-2">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">
                          {isRtl ? 'الخلايا المفحوصة' : 'Cells Searched'}
                        </span>
                        <p className="font-extrabold text-indigo-700 text-xs mt-0.5">
                          {activeSearch.options.discovery_stats.cells_searched ?? activeSearch.zones_completed ?? 0}
                        </p>
                      </div>
                    </div>

                    {/* Round-by-round breakdown */}
                    {activeSearch.options.discovery_stats.rounds && activeSearch.options.discovery_stats.rounds.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                          {isRtl ? 'إنتاجية الاكتشاف حسب الجولة:' : 'Discovery Yield by Round:'}
                        </span>
                        <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
                          {activeSearch.options.discovery_stats.rounds.map((r: any, idx: number) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between bg-white border border-slate-200/70 rounded-lg px-2.5 py-1.5 text-[11px]"
                            >
                              <div className="flex items-center gap-1.5 truncate max-w-[65%]">
                                <span className="font-bold text-[#166534]">
                                  {isRtl ? `الجولة ${r.round}:` : `Round ${r.round}:`}
                                </span>
                                <span className="text-slate-600 truncate">{r.name}</span>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <span className="font-bold text-emerald-600">
                                  +{Number(r.new_unique ?? 0).toLocaleString(isRtl ? 'ar-SA' : 'en-US')} {isRtl ? 'فريد' : 'unique'}
                                </span>
                                <span className="text-[10px] text-slate-400">
                                  ({Number(r.duplicates ?? 0).toLocaleString(isRtl ? 'ar-SA' : 'en-US')} {isRtl ? 'مكرر' : 'dups'})
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200/60">
                      <span>{isRtl ? 'تنويعات الاستعلام:' : 'Query Variations:'} {activeSearch.options.discovery_stats.query_variations_count ?? 1}</span>
                      <span>{isRtl ? 'الجولة السابقة:' : 'Last Round:'} +{Number(activeSearch.options.discovery_stats.last_round_new_businesses ?? 0).toLocaleString(isRtl ? 'ar-SA' : 'en-US')} {isRtl ? 'فريد' : 'unique'}</span>
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
                    className="flex-1 h-10 px-5 rounded-xl bg-[#166534] hover:bg-[#14532d] text-white font-semibold text-xs sm:text-sm transition-all shadow-sm hover:shadow-[#166534]/15 active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>
                      {isRtl
                        ? `عرض النتائج المؤهلة (${(activeSearch.total_found ?? 0).toLocaleString('ar-SA')})`
                        : `View Qualified Results (${(activeSearch.total_found ?? 0).toLocaleString()})`}
                    </span>
                    {isRtl ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-[#166534] flex items-center justify-center">
                  <ShieldCheck size={20} />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {isRtl ? 'بنية محرك الاكتشاف الذكي' : 'Discovery Engine Architecture'}
                </h3>
                <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
                  <div className="flex gap-2.5">
                    <span className="font-bold text-[#166534]">1.</span>
                    <p>
                      <strong>{isRtl ? 'منصة Google Places:' : 'Google Places Platform:'}</strong>{' '}
                      {isRtl
                        ? 'يكتشف المنشآت المسجلة رسمياً مع معرفات الأماكن وأرقام الهواتف والمواقع الرسمية.'
                        : 'Discovers registered businesses with place IDs, phone numbers, and official websites.'}
                    </p>
                  </div>
                  <div className="flex gap-2.5">
                    <span className="font-bold text-[#166534]">2.</span>
                    <p>
                      <strong>{isRtl ? 'الزحف الأخلاقي للمواقع:' : 'Ethical Website Crawling:'}</strong>{' '}
                      {isRtl
                        ? 'يفحص مواقع الشركات وصفحات التواصل (/contact, /about) والتذييلات وروابط البريد.'
                        : 'Inspects company websites, contact pages (/contact, /about), footers, and mailto links.'}
                    </p>
                  </div>
                  <div className="flex gap-2.5">
                    <span className="font-bold text-[#166534]">3.</span>
                    <p>
                      <strong>{isRtl ? 'مطابقة صارمة لمنع التكرار (4 مستويات):' : 'Strict 4-Level Deduplication:'}</strong>{' '}
                      {isRtl
                        ? 'يستبعد معرفات الأماكن المكررة، النطاقات المتشابهة، وتطابقات الهواتف والبريد الإلكتروني المعياري.'
                        : 'Eliminates duplicate Place IDs, domains, address pairs, and case-normalized emails.'}
                    </p>
                  </div>
                  <div className="flex gap-2.5">
                    <span className="font-bold text-[#166534]">4.</span>
                    <p>
                      <strong>{isRtl ? 'استيراد مستقل إلى إدارة العملاء:' : 'Isolated CRM Import:'}</strong>{' '}
                      {isRtl
                        ? 'تبقى البيانات مفصولة بأمان حتى تختار بوضوح استيرادها المباشر إلى جهات اتصال CRM.'
                        : 'Data stays cleanly segregated until you explicitly choose to import into CRM Contacts.'}
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
                    <span className="w-8 h-8 rounded-xl bg-[#F0FDF4] text-[#166534] flex items-center justify-center">
                      <Layers size={16} />
                    </span>
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                        {isRtl ? 'إحصائيات التصنيف' : 'Category Statistics'}
                      </h3>
                      <p className="text-[11px] text-slate-500 font-semibold">
                        {categories.find((c) => String(c.id) === String(selectedCategoryId))?.name || (isRtl ? 'نظرة عامة على التصنيف' : 'Category Overview')}
                      </p>
                    </div>
                  </div>
                  {isLoadingCategoryStats && <RotateCw size={14} className="animate-spin text-[#166534]" />}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      {isRtl ? 'المنشآت' : 'Businesses'}
                    </span>
                    <p className="text-base font-black text-slate-900 mt-0.5">
                      {(categoryStats.businesses ?? 0).toLocaleString(isRtl ? 'ar-SA' : 'en-US')}
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      {isRtl ? 'جهات الاتصال' : 'Contacts'}
                    </span>
                    <p className="text-base font-black text-slate-900 mt-0.5">
                      {(categoryStats.contacts ?? 0).toLocaleString(isRtl ? 'ar-SA' : 'en-US')}
                    </p>
                  </div>
                  <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-100">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase">
                      {isRtl ? 'البريد الإلكتروني' : 'Emails'}
                    </span>
                    <p className="text-base font-black text-emerald-700 mt-0.5">
                      {(categoryStats.emails ?? 0).toLocaleString(isRtl ? 'ar-SA' : 'en-US')}
                    </p>
                  </div>
                  <div className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-100">
                    <span className="text-[10px] font-bold text-indigo-600 uppercase">
                      {isRtl ? 'الهواتف' : 'Phones'}
                    </span>
                    <p className="text-base font-black text-indigo-700 mt-0.5">
                      {(categoryStats.phones ?? 0).toLocaleString(isRtl ? 'ar-SA' : 'en-US')}
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 col-span-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      {isRtl ? 'المواقع' : 'Websites'}
                    </span>
                    <p className="text-base font-black text-slate-700 mt-0.5">
                      {(categoryStats.websites ?? 0).toLocaleString(isRtl ? 'ar-SA' : 'en-US')}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-2 text-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    {isRtl ? 'نشاط حملات البريد الإلكتروني' : 'Email Campaign Activity'}
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="flex justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-slate-500">{isRtl ? 'لم يُراسل سابقاً:' : 'Never Emailed:'}</span>
                      <span className="font-bold text-slate-800">
                        {(categoryStats.never_emailed ?? 0).toLocaleString(isRtl ? 'ar-SA' : 'en-US')}
                      </span>
                    </div>
                    <div className="flex justify-between p-2 rounded-lg bg-blue-50/70 border border-blue-100">
                      <span className="text-blue-700">{isRtl ? 'تمت مراسلته مسبقاً:' : 'Previously Emailed:'}</span>
                      <span className="font-bold text-blue-800">
                        {(categoryStats.previously_emailed ?? 0).toLocaleString(isRtl ? 'ar-SA' : 'en-US')}
                      </span>
                    </div>
                    <div className="flex justify-between p-2 rounded-lg bg-emerald-50/70 border border-emerald-100">
                      <span className="text-emerald-700">{isRtl ? 'تم التسليم:' : 'Delivered:'}</span>
                      <span className="font-bold text-emerald-800">
                        {(categoryStats.delivered ?? 0).toLocaleString(isRtl ? 'ar-SA' : 'en-US')}
                      </span>
                    </div>
                    <div className="flex justify-between p-2 rounded-lg bg-amber-50/70 border border-amber-100">
                      <span className="text-amber-700">{isRtl ? 'مرتد:' : 'Bounced:'}</span>
                      <span className="font-bold text-amber-800">
                        {(categoryStats.bounced ?? 0).toLocaleString(isRtl ? 'ar-SA' : 'en-US')}
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
                    ? (isRtl ? `تشبع الاكتشاف — تم العثور على ${displayMetrics.found} منشأة فريدة` : `Discovery Saturated — ${displayMetrics.found} unique businesses found`)
                    : activeSearch.exhaustion_note?.includes('Target achieved')
                    ? (isRtl ? `تم تحقيق الهدف — تم اكتشاف ${displayMetrics.found} منشأة فريدة` : `Target Achieved — ${displayMetrics.found} unique businesses discovered`)
                    : (isRtl ? `التشبع الجغرافي — تم اكتشاف ${displayMetrics.found} منشأة فريدة` : `Geographic Saturation — ${displayMetrics.found} unique businesses discovered`)}
                </h4>
                <p className="text-xs text-amber-700/90 mt-0.5 leading-relaxed">
                  {activeSearch.exhaustion_note || (isRtl ? 'تم فحص جميع خلايا البحث الجغرافي وتنويعات التصنيف ضمن النطاق المستهدف بدقة.' : 'All geographic search cells and category permutations within the target radius were thoroughly scanned.')}
                </p>
              </div>
            </div>
          )}

          {/* RESULT SUMMARY CARDS (6 Dynamic Metric Cards) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                {isRtl ? 'المنشآت المكتشفة' : 'Businesses Found'}
              </span>
              <p className="text-2xl font-black text-slate-900 mt-1">{displayMetrics.found}</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                {isRtl ? 'المواقع المكتشفة' : 'Websites Found'}
              </span>
              <p className="text-2xl font-black text-indigo-600 mt-1">{displayMetrics.websites}</p>
            </div>
            <div className="bg-emerald-50/80 border border-emerald-200/70 rounded-2xl p-4 shadow-sm">
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
                {isRtl ? 'عناوين البريد' : 'Emails Found'}
              </span>
              <p className="text-2xl font-black text-emerald-800 mt-1">{displayMetrics.emails}</p>
            </div>
            <div className="bg-amber-50/80 border border-amber-200/70 rounded-2xl p-4 shadow-sm">
              <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block">
                {isRtl ? 'المكررات المستبعدة' : 'Duplicates Removed'}
              </span>
              <p className="text-2xl font-black text-amber-800 mt-1">{displayMetrics.duplicates}</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                {isRtl ? 'بدون بريد' : 'No Email'}
              </span>
              <p className="text-2xl font-black text-slate-600 mt-1">{displayMetrics.noEmail}</p>
            </div>
            <div className="bg-red-50/80 border border-red-200/70 rounded-2xl p-4 shadow-sm">
              <span className="text-[11px] font-bold text-red-700 uppercase tracking-wider block">
                {isRtl ? 'غير ناجحة' : 'Failed'}
              </span>
              <p className="text-2xl font-black text-red-800 mt-1">{displayMetrics.failed}</p>
            </div>
          </div>

          {/* Active Search Context Filter Banner */}
          {filterSearchId ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#F0FDF4]/80 border border-[#166534]/20 rounded-2xl px-5 py-3 shadow-xs">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-[#166534]/10 text-[#166534] flex items-center justify-center font-bold shrink-0">
                  <Compass size={16} />
                </span>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-slate-800">
                      {activeSearch?.keyword ? `${activeSearch.keyword} — ${activeSearch.location}` : `${isRtl ? 'مهمة البحث #' : 'Search Job #'}${filterSearchId}`}
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
                      {activeSearch?.status === 'completed'
                        ? (isRtl ? 'مكتمل' : 'completed')
                        : activeSearch?.status === 'failed'
                        ? (isRtl ? 'فشل' : 'failed')
                        : activeSearch?.status || (isRtl ? 'نشط' : 'Active')}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {isRtl
                      ? `عرض العملاء المكتشفين للبحث #${filterSearchId} (${(pagination?.total ?? results.length).toLocaleString('ar-SA')} عميل)`
                      : `Showing discovered leads for Search #${filterSearchId} (${(pagination?.total ?? results.length).toLocaleString()} leads)`}
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
                {isRtl ? 'إلغاء التصفية (عرض كافة العملاء المحتملين)' : 'Clear Filter (View All Leads)'}
              </button>
            </div>
          ) : null}

          {/* Controls & Filter Tabs Bar */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Search input in results */}
              <div className="relative flex-1 max-w-md">
                <Search size={16} className={cn("absolute top-1/2 -translate-y-1/2 text-slate-400", isRtl ? "right-3.5" : "left-3.5")} />
                <input
                  type="text"
                  value={filterSearch}
                  onChange={(e) => setFilterSearch(e.target.value)}
                  placeholder={isRtl ? 'تصفية حسب الاسم، البريد، الهاتف، الموقع، التصنيف...' : 'Filter by name, email, phone, location, category...'}
                  className={cn(
                    "w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:bg-white focus:border-[#166534] transition-all",
                    isRtl ? "pr-10 pl-4 text-right" : "pl-10 pr-4"
                  )}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                {selectedIds.length > 0 && (
                  <button
                    onClick={handleBulkEnrich}
                    disabled={isBulkEnriching}
                    className="px-3.5 py-2.5 rounded-xl bg-[#166534] hover:bg-[#14532d] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm shadow-[#166534]/25 transition-all cursor-pointer disabled:opacity-50"
                    title={isRtl ? 'إثراء المعلومات المفقودة للعملاء المحددين' : 'Enrich missing information for selected leads'}
                  >
                    <Sparkles size={14} className={isBulkEnriching ? 'animate-spin' : ''} />
                    <span>
                      {isRtl
                        ? `إثراء البيانات المفقودة (${selectedIds.length.toLocaleString('ar-SA')})`
                        : `Enrich Missing Data (${selectedIds.length})`}
                    </span>
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
                          ? (isRtl ? 'كافة العملاء المحددين موجودون في CRM. انقر للمزامنة وإثراء البيانات دون تكرار.' : 'All selected leads already exist in CRM. Click to sync and enrich any missing data without duplicates.')
                          : (isRtl ? 'استيراد العملاء المحددين إلى CRM مع التحقق الصارم من عدم تكرار أرقام الهواتف' : 'Import selected leads into CRM Contacts with phone-uniqueness deduplication')
                      }
                    >
                      <UserPlus size={14} className={isImporting ? 'animate-spin' : ''} />
                      <span>
                        {isAllSelectedInCrm
                          ? (isRtl ? `مزامنة المحدد (${selectedIds.length} في CRM)` : `Sync Selected (${selectedIds.length} in CRM)`)
                          : selectedImportedCount > 0
                          ? (isRtl ? `استيراد المحدد (${selectedIds.length} • ${selectedNewCount} جديد)` : `Import Selected (${selectedIds.length} • ${selectedNewCount} new)`)
                          : (isRtl ? `استيراد المحدد (${selectedIds.length})` : `Import Selected (${selectedIds.length})`)}
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
                      className="px-3.5 py-2.5 rounded-xl bg-[#12263A] hover:bg-[#166534] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm shadow-[#166534]/20 transition-all cursor-pointer disabled:opacity-50"
                      title={
                        allInCrm
                          ? (isRtl ? 'جميع العملاء المكتشفين في هذا العرض موجودون في CRM. انقر للمزامنة وإثراء البيانات.' : 'All discovered leads in this view are in CRM. Click to sync and enrich missing data.')
                          : (isRtl ? 'استيراد وإثراء العملاء المكتشفين في CRM مع منع التكرار بناءً على الهواتف' : 'Import and enrich discovered leads into CRM using phone-uniqueness deduplication')
                      }
                    >
                      <UserCheck size={14} className={isImporting ? 'animate-spin' : ''} />
                      <span>
                        {allInCrm
                          ? (isRtl ? `مزامنة الكل في CRM (${totalInView.toLocaleString('ar-SA')})` : `Sync All in CRM (${totalInView.toLocaleString()})`)
                          : (isRtl ? `استيراد الكل إلى CRM (${totalInView.toLocaleString('ar-SA')})` : `Import All to CRM (${totalInView.toLocaleString()})`)}
                      </span>
                    </button>
                  );
                })()}

                <button
                  onClick={handleExportCsv}
                  className="h-10 px-4 bg-white border border-slate-200 hover:bg-[#F0FDF4] hover:border-[#bbf7d0] text-[#12263A] hover:text-[#166534] rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                >
                  <Download size={14} />
                  <span>{isRtl ? 'تصدير CSV' : 'Export CSV'}</span>
                </button>

                {selectedIds.length > 0 && (
                  <button
                    onClick={handleBatchDelete}
                    className="h-10 px-4 rounded-xl bg-rose-50 border border-rose-100 hover:bg-rose-600 hover:border-rose-600 hover:text-white text-rose-600 transition-all font-semibold text-xs shadow-xs active:scale-95 cursor-pointer flex items-center gap-1.5"
                  >
                    <Trash2 size={14} />
                    <span>{isRtl ? `حذف (${selectedIds.length})` : `Delete (${selectedIds.length})`}</span>
                  </button>
                )}

                <button
                  onClick={() => loadResults(currentPage)}
                  className="w-10 h-10 rounded-xl bg-white border border-slate-200 hover:bg-[#F0FDF4] hover:border-[#bbf7d0] text-slate-600 hover:text-[#166534] flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-90"
                  title={isRtl ? 'تحديث' : 'Refresh'}
                >
                  <RotateCw size={15} />
                </button>
              </div>
            </div>

            {/* Filter Tabs: All, Not in CRM, In CRM, Email Found, No Email, Website Found, No Website, Duplicates Removed, Failed */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100 flex-wrap text-xs">
              <span className="font-bold text-slate-400 mr-1">{isRtl ? 'تصفية العرض:' : 'Filter View:'}</span>
              {[
                { id: 'all', label: isRtl ? 'الكل' : 'All' },
                { id: 'not_in_crm', label: isRtl ? 'ليس في CRM' : 'Not in CRM' },
                { id: 'in_crm', label: isRtl ? 'في CRM' : 'In CRM' },
                { id: 'email_found', label: isRtl ? 'تم العثور على بريد' : 'Email Found' },
                { id: 'no_email', label: isRtl ? 'بدون بريد' : 'No Email' },
                { id: 'website_found', label: isRtl ? 'تم العثور على موقع' : 'Website Found' },
                { id: 'no_website', label: isRtl ? 'بدون موقع' : 'No Website' },
                { id: 'duplicates_removed', label: isRtl ? 'المكررات المستبعدة' : 'Duplicates Removed' },
                { id: 'failed', label: isRtl ? 'غير ناجحة' : 'Failed' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setResultFilterTab(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                    resultFilterTab === tab.id
                      ? 'bg-[#166534] text-white shadow-sm shadow-[#166534]/25'
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
              <table className={cn("w-full text-xs text-slate-700", isRtl ? "text-right" : "text-left")}>
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-4 w-12 text-center">
                      <button onClick={handleSelectAll} className="cursor-pointer text-slate-400 hover:text-slate-700">
                        {results.length > 0 && selectedIds.length === results.length ? (
                          <CheckSquare size={16} className="text-[#166534]" />
                        ) : (
                          <Square size={16} />
                        )}
                      </button>
                    </th>
                    <th className="p-4">{isRtl ? 'اسم المنشأة' : 'Business Name'}</th>
                    <th className="p-4">{isRtl ? 'جودة العميل' : 'Lead Quality'}</th>
                    <th className="p-4">{isRtl ? 'الهاتف (المعرف الفريد)' : 'Phone (Unique Key)'}</th>
                    <th className="p-4">{isRtl ? 'البريد الإلكتروني' : 'Email'}</th>
                    <th className="p-4">{isRtl ? 'الموقع الإلكتروني' : 'Website'}</th>
                    <th className="p-4">{isRtl ? 'التصنيف' : 'Category'}</th>
                    <th className="p-4">{isRtl ? 'الموقع' : 'Location'}</th>
                    <th className="p-4">{isRtl ? 'الحالة' : 'Status'}</th>
                    <th className={cn("p-4", isRtl ? "text-left" : "text-right")}>{isRtl ? 'الإجراءات' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {isLoadingResults ? (
                    <tr>
                      <td colSpan={10} className="p-12 text-center text-slate-400">
                        <RotateCw size={24} className="animate-spin mx-auto mb-2 text-[#166534]" />
                        {isRtl ? 'جارٍ تحميل العملاء المؤهلين...' : 'Loading qualified leads...'}
                      </td>
                    </tr>
                  ) : results.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="p-12 text-center text-slate-400 space-y-2">
                        <Compass size={32} className="mx-auto text-slate-300" />
                        <p className="font-bold text-slate-600 text-sm">
                          {isRtl ? 'لم يتم العثور على منشآت تطابق هذا الفلتر' : 'No businesses discovered matching this filter'}
                        </p>
                        <p className="text-xs text-slate-400">
                          {isRtl
                            ? 'جرّب التبديل بين خيارات التصفية أو بدء عملية بحث واكتشاف جديدة.'
                            : 'Try switching filter tabs or starting a new business discovery search.'}
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
                          className={`hover:bg-[#F0FDF4]/20 transition-colors cursor-pointer ${
                            isSelected ? 'bg-[#F0FDF4]/40' : ''
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
                                <CheckSquare size={16} className="text-[#166534]" />
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
                                <CheckCircle2 size={11} /> {isRtl ? 'في CRM' : 'In CRM'}
                              </span>
                            )}
                          </td>

                          {/* Lead Quality Score & Grade + Missing Info */}
                          <td className="p-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5">
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold border ${qualityBadge.bg}`}>
                                  <Award size={11} />
                                  <span>{isRtl ? `الفئة ${qGrade}` : `Grade ${qGrade}`}</span>
                                </span>
                                <span className="text-[11px] font-extrabold text-slate-700">
                                  {qScore}/100
                                </span>
                              </div>

                              {biz.missing_fields && biz.missing_fields.length > 0 ? (
                                <div className="text-[10px] text-amber-700 font-semibold truncate max-w-[140px]" title={`${isRtl ? 'المفقود:' : 'Missing:'} ${biz.missing_fields.join(', ')}`}>
                                  {isRtl ? 'المفقود: ' : 'Missing: '}{biz.missing_fields.map((f) => f.replace('_', ' ')).join(', ')}
                                </div>
                              ) : (
                                <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
                                  <Check size={10} /> {isRtl ? 'مكتمل' : 'Complete'}
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Phone Number (Primary Unique Key) */}
                          <td className="p-4">
                            {biz.phone_normalized || biz.phone ? (
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-1 font-mono font-bold text-slate-900 text-[11px]">
                                  <ShieldCheck size={12} className="text-emerald-600 shrink-0" title={isRtl ? 'المعرف الفريد المعياري E.164' : 'Normalized E.164 Unique Key'} />
                                  <span dir="ltr">{biz.phone_normalized || biz.phone}</span>
                                </div>
                                {biz.phone_original && biz.phone_original !== biz.phone_normalized && (
                                  <div className="text-[10px] text-slate-400 font-mono" dir="ltr">
                                    {isRtl ? 'الأصلي: ' : 'Raw: '}{biz.phone_original}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="text-slate-300 italic text-[11px]">{isRtl ? 'لا يوجد هاتف' : 'No phone'}</span>
                            )}
                          </td>

                          {/* Email */}
                          <td className="p-4">
                            {biz.email ? (
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono text-slate-900 font-semibold" dir="ltr">{biz.email}</span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    copyToClipboard(biz.email!);
                                  }}
                                  className="text-slate-400 hover:text-[#166534] cursor-pointer p-0.5"
                                  title={isRtl ? 'نسخ البريد الإلكتروني' : 'Copy Email'}
                                >
                                  {copiedEmail === biz.email ? (
                                    <Check size={12} className="text-emerald-600" />
                                  ) : (
                                    <Copy size={12} />
                                  )}
                                </button>
                                {biz.email_source && (
                                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#F0FDF4] text-[#166534] font-bold">
                                    {biz.email_source}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-slate-300 font-normal italic">{isRtl ? 'لم يُعثر عليه' : 'None found'}</span>
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
                                <span className="truncate" dir="ltr">{biz.website_domain || biz.website.replace(/^https?:\/\/(www\.)?/, '')}</span>
                                <ExternalLink size={11} className="shrink-0" />
                              </a>
                            ) : (
                              <span className="text-slate-300 font-normal italic">{isRtl ? 'لا يوجد موقع' : 'No website'}</span>
                            )}
                          </td>

                          {/* Category */}
                          <td className="p-4">
                            <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-semibold">
                              {biz.category || (isRtl ? 'عام' : 'General')}
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
                              {biz.enrichment_status === 'ENRICHED' || biz.status === 'email_found'
                                ? (isRtl ? 'مُثرى' : 'ENRICHED')
                                : biz.enrichment_status === 'PARTIAL'
                                ? (isRtl ? 'جزئي' : 'PARTIAL')
                                : biz.status === 'imported'
                                ? (isRtl ? 'مستورد' : 'IMPORTED')
                                : biz.status === 'failed'
                                ? (isRtl ? 'فشل' : 'FAILED')
                                : (biz.enrichment_status || biz.status.replace(/_/g, ' '))}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className={cn("p-4", isRtl ? "text-left" : "text-right")} onClick={(e) => e.stopPropagation()}>
                            <div className={cn("flex items-center gap-1", isRtl ? "justify-start" : "justify-end")}>
                              {/* Enrich Missing Data Button */}
                              <button
                                onClick={() => handleEnrichLead(biz.id)}
                                disabled={enrichingId === biz.id}
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#166534] bg-white hover:bg-[#F0FDF4] border border-slate-200 hover:border-[#bbf7d0] transition-all cursor-pointer active:scale-90 shadow-xs disabled:opacity-50"
                                title={isRtl ? 'إثراء البيانات المفقودة (زحف مستهدف)' : 'Enrich Missing Data (Targeted Scrape)'}
                              >
                                <Sparkles size={14} className={enrichingId === biz.id ? 'animate-spin text-[#166534]' : ''} />
                              </button>

                              <button
                                onClick={() => {
                                  setSelectedBusiness(biz);
                                  loadAuditLogs(biz.id);
                                }}
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-[#166534] bg-white hover:bg-[#F0FDF4] border border-slate-200 hover:border-[#bbf7d0] transition-all cursor-pointer active:scale-90 shadow-xs"
                                title={isRtl ? 'عرض التفاصيل وسجلات الإثراء' : 'View Details & Enrichment Logs'}
                              >
                                <Eye size={14} />
                              </button>

                              <button
                                onClick={() => handleDeleteOne(biz.id)}
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-rose-500 hover:text-white bg-rose-50/60 hover:bg-rose-600 border border-rose-100 hover:border-rose-600 transition-all cursor-pointer active:scale-90 shadow-xs"
                                title={isRtl ? 'حذف العميل' : 'Delete Lead'}
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
                  {isRtl ? (
                    <>
                      عرض <span className="font-bold text-slate-900">{(pagination.from || 0).toLocaleString('ar-SA')}</span> إلى{' '}
                      <span className="font-bold text-slate-900">{(pagination.to || 0).toLocaleString('ar-SA')}</span> من إجمالي{' '}
                      <span className="font-bold text-slate-900">{(pagination.total).toLocaleString('ar-SA')}</span> عميل
                    </>
                  ) : (
                    <>
                      Showing <span className="font-bold text-slate-900">{pagination.from || 0}</span> to{' '}
                      <span className="font-bold text-slate-900">{pagination.to || 0}</span> of{' '}
                      <span className="font-bold text-slate-900">{pagination.total}</span> leads
                    </>
                  )}
                </p>

                <div className="flex items-center gap-2">
                  <button
                    disabled={currentPage <= 1}
                    onClick={() => loadResults(currentPage - 1)}
                    className="w-8.5 h-8.5 rounded-xl border border-slate-200 bg-white hover:bg-[#F0FDF4] hover:text-[#166534] hover:border-[#bbf7d0] disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center cursor-pointer transition-all active:scale-95 shadow-xs"
                  >
                    {isRtl ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
                  </button>
                  <span className="font-bold text-slate-700 px-1">
                    {isRtl
                      ? `الصفحة ${currentPage} من ${pagination.last_page}`
                      : `Page ${currentPage} of ${pagination.last_page}`}
                  </span>
                  <button
                    disabled={currentPage >= pagination.last_page}
                    onClick={() => loadResults(currentPage + 1)}
                    className="w-8.5 h-8.5 rounded-xl border border-slate-200 bg-white hover:bg-[#F0FDF4] hover:text-[#166534] hover:border-[#bbf7d0] disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center cursor-pointer transition-all active:scale-95 shadow-xs"
                  >
                    {isRtl ? <ChevronLeft size={15} /> : <ChevronRight size={15} />}
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
              <h3 className="text-base font-bold text-slate-900">
                {isRtl ? 'سجل عمليات الاستخراج والبحث' : 'Scraper Search Jobs'}
              </h3>
              <p className="text-xs text-slate-500">
                {isRtl ? 'السجل الزمني لكافة عمليات اكتشاف واستخراج المنشآت المنفذة' : 'Chronological history of all initiated business discoveries'}
              </p>
            </div>
            <button
              onClick={() => loadHistory(historyPage)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer"
              title={isRtl ? 'تحديث السجل' : 'Refresh History'}
            >
              <RotateCw size={14} />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {historySearches.length === 0 ? (
              <p className="p-8 text-center text-xs text-slate-400">
                {isRtl ? 'لم يتم تسجيل أي عمليات بحث حتى الآن.' : 'No search jobs recorded yet.'}
              </p>
            ) : (
              historySearches.map((s) => (
                <div key={s.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-900 text-sm">{s.keyword}</span>
                      {s.industry && (
                        <span className="px-2 py-0.5 rounded bg-[#F0FDF4] text-[#166534] text-[10px] font-bold">
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
                        {s.status === 'completed'
                          ? (isRtl ? 'مكتمل' : 'completed')
                          : s.status === 'failed'
                          ? (isRtl ? 'فشل' : 'failed')
                          : s.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      {isRtl
                        ? `تم اكتشاف ${(s.total_found ?? 0).toLocaleString('ar-SA')} منشأة • ${(s.total_emails_found ?? 0).toLocaleString('ar-SA')} بريد • ${(s.total_duplicates ?? 0).toLocaleString('ar-SA')} مكرر • تاريخ الإنشاء ${new Date(s.created_at).toLocaleDateString('ar-SA')}`
                        : `Discovered ${s.total_found} businesses • ${s.total_emails_found} emails • ${s.total_duplicates} duplicates • Created ${new Date(s.created_at).toLocaleDateString()}`}
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
                      className="h-8.5 px-3.5 rounded-xl bg-[#166534] hover:bg-[#14532d] text-white text-xs font-semibold transition-all shadow-xs active:scale-95 cursor-pointer flex items-center justify-center"
                    >
                      {isRtl ? 'عرض النتائج' : 'View Results'}
                    </button>
                    <button
                      onClick={async () => {
                        if (!confirm(isRtl ? 'هل تريد حذف هذا البحث وكافة السجلات المستخرجة التابعة له؟' : 'Delete this search and its scraped records?')) return;
                        await scraperApi.deleteSearch(s.id);
                        loadHistory(historyPage);
                        loadStatus();
                        toast.success(isRtl ? 'تم الحذف' : 'Deleted', isRtl ? 'تم حذف سجل البحث بنجاح.' : 'Search record removed.');
                      }}
                      className="w-8.5 h-8.5 rounded-xl bg-rose-50/60 border border-rose-100 hover:bg-rose-600 hover:border-rose-600 text-rose-500 hover:text-white flex items-center justify-center transition-all cursor-pointer active:scale-90 shadow-xs"
                      title={isRtl ? 'حذف البحث' : 'Delete Search'}
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
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#F0FDF4] text-[#166534]">
                    {selectedBusiness.category || (isRtl ? 'عميل محتمل' : 'Business Lead')}
                  </span>
                  <h2 className="text-xl font-extrabold text-slate-900 mt-1.5">
                    {selectedBusiness.business_name}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {isRtl
                      ? `تم الاكتشاف عبر ${selectedBusiness.source} في ${new Date(selectedBusiness.created_at).toLocaleDateString('ar-SA')}`
                      : `Discovered via ${selectedBusiness.source} on ${new Date(selectedBusiness.created_at).toLocaleDateString()}`}
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
                          {isRtl ? `النتيجة: ${qScore} / 100` : `Score: ${qScore} / 100`}
                        </span>
                      </div>

                      <button
                        onClick={() => handleEnrichLead(selectedBusiness.id)}
                        disabled={enrichingId === selectedBusiness.id}
                        className="px-3 py-1.5 rounded-xl bg-[#166534] hover:bg-[#14532d] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                        title={isRtl ? 'البحث عن الحقول المفقودة وتعبئتها' : 'Search and populate missing fields'}
                      >
                        <Sparkles size={13} className={enrichingId === selectedBusiness.id ? 'animate-spin' : ''} />
                        <span>{isRtl ? 'إثراء البيانات المفقودة' : 'Enrich Missing Data'}</span>
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
                          {isRtl ? `البيانات المفقودة (${selectedBusiness.missing_fields.length}):` : `Missing Information (${selectedBusiness.missing_fields.length}):`}
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
                        <span>{isRtl ? 'تم اكتشاف كافة الحقول الأساسية (الملف التجاري مكتمل)' : 'All core fields discovered (Business Profile Complete)'}</span>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Phone Number Uniqueness Card */}
              <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {isRtl ? 'رقم الهاتف (المعرف الأساسي لمنع التكرار)' : 'Phone Number (Primary Deduplication Key)'}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                    <ShieldCheck size={11} />
                    <span>{isRtl ? 'معيار E.164 الفريد' : 'E.164 Unique Strategy'}</span>
                  </span>
                </div>

                {selectedBusiness.phone_normalized || selectedBusiness.phone ? (
                  <div className="space-y-1">
                    <p className="text-base font-mono font-bold text-slate-900" dir="ltr">
                      {selectedBusiness.phone_normalized || selectedBusiness.phone}
                    </p>
                    {selectedBusiness.phone_original && selectedBusiness.phone_original !== selectedBusiness.phone_normalized && (
                      <p className="text-xs text-slate-500 font-mono" dir="ltr">
                        {isRtl ? 'المستخرج الأصلي: ' : 'Original Scraped: '}<span className="font-semibold">{selectedBusiness.phone_original}</span>
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">
                    {isRtl ? 'لم يتم اكتشاف رقم هاتف' : 'No phone number discovered'}
                  </p>
                )}
              </div>

              {/* Email Section */}
              <div className="bg-[#F0FDF4]/40 border border-[#bbf7d0] rounded-2xl p-4 space-y-2">
                <span className="text-[10px] font-bold text-[#166534] uppercase tracking-wider">
                  {isRtl ? 'البريد الإلكتروني للتواصل' : 'Contact Email'}
                </span>
                {selectedBusiness.email ? (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-base font-mono font-bold text-slate-900" dir="ltr">{selectedBusiness.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                          <CheckCircle2 size={12} />
                          <span>{isRtl ? 'تم العثور على البريد' : 'Email Found'}</span>
                        </span>
                        {selectedBusiness.email_source && (
                          <span className="text-[11px] text-slate-500 font-medium">
                            {isRtl ? 'المصدر: ' : 'Source: '}<strong>{selectedBusiness.email_source}</strong>
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(selectedBusiness.email!)}
                      className="px-3 py-1.5 rounded-xl bg-white border border-[#bbf7d0] text-[#166534] hover:bg-[#F0FDF4] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Copy size={13} />
                      <span>{isRtl ? 'نسخ' : 'Copy'}</span>
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">
                    {isRtl ? 'لم يتم العثور على بريد عام في موقع الشركة.' : 'No public email found on company website.'}
                  </p>
                )}
              </div>

              {/* All Business Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                    {isRtl ? 'الموقع الإلكتروني' : 'Website'}
                  </span>
                  {selectedBusiness.website ? (
                    <a
                      href={selectedBusiness.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#166534] hover:underline font-semibold flex items-center gap-1 truncate"
                    >
                      <span className="truncate" dir="ltr">{selectedBusiness.website}</span>
                      <ExternalLink size={12} className="shrink-0" />
                    </a>
                  ) : (
                    <p className="text-slate-500 italic">{isRtl ? 'لا يوجد موقع' : 'No website'}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                    {isRtl ? 'حالة الإثراء' : 'Enrichment Status'}
                  </span>
                  <p className="font-bold text-slate-800 uppercase tracking-wider">
                    {selectedBusiness.enrichment_status || selectedBusiness.status}
                  </p>
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                    {isRtl ? 'العنوان' : 'Address'}
                  </span>
                  <p className="font-semibold text-slate-800">{selectedBusiness.address || (isRtl ? 'غير متوفر' : 'N/A')}</p>
                </div>

                <div className="space-y-1">
                  <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                    {isRtl ? 'التقييم والمراجعات' : 'Rating & Reviews'}
                  </span>
                  <div className="flex items-center gap-1 font-semibold text-slate-800">
                    {selectedBusiness.rating ? (
                      <>
                        <Star size={13} className="text-amber-500 fill-amber-500" />
                        <span>{selectedBusiness.rating}</span>
                        {selectedBusiness.review_count && (
                          <span className="text-slate-400">
                            ({selectedBusiness.review_count} {isRtl ? 'مراجعة' : 'reviews'})
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-slate-400 font-normal">{isRtl ? 'غير مقيم' : 'Not rated'}</span>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                    {isRtl ? 'معرف Google Place' : 'Google Place ID'}
                  </span>
                  <p className="font-mono text-[11px] text-slate-500 truncate" title={selectedBusiness.google_place_id || ''} dir="ltr">
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
                    <History size={15} className="text-[#166534]" />
                    <span>
                      {isRtl
                        ? `سجل تدقيق الإثراء والتحديثات (${auditLogs.length})`
                        : `Enrichment Audit History (${auditLogs.length})`}
                    </span>
                  </div>
                  {showAuditLogs ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                </button>

                {showAuditLogs && (
                  <div className="p-3.5 divide-y divide-slate-100 bg-white max-h-48 overflow-y-auto space-y-2">
                    {isLoadingLogs ? (
                      <div className="p-4 text-center text-xs text-slate-400">
                        <RotateCw size={16} className="animate-spin mx-auto mb-1 text-[#166534]" />
                        {isRtl ? 'جارٍ تحميل سجلات الإثراء...' : 'Loading enrichment logs...'}
                      </div>
                    ) : auditLogs.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-2">
                        {isRtl ? 'لا توجد تحديثات إثراء مسجلة لهذا العميل حتى الآن.' : 'No enrichment updates logged yet for this lead.'}
                      </p>
                    ) : (
                      auditLogs.map((log) => (
                        <div key={log.id} className="pt-2 first:pt-0 text-[11px] space-y-0.5">
                          <div className="flex items-center justify-between font-bold">
                            <span className="text-[#14532d] uppercase tracking-wider">{log.field_name}</span>
                            <span className="text-[10px] text-slate-400 font-normal">
                              {new Date(log.created_at).toLocaleString(isRtl ? 'ar-SA' : 'en-US')}
                            </span>
                          </div>
                          <p className="text-slate-700">
                            {log.old_value ? (
                              <>
                                <span className="line-through text-slate-400 mr-1">{log.old_value}</span>
                                <span>&rarr; {log.new_value}</span>
                              </>
                            ) : (
                              <span>{isRtl ? 'تم التعيين إلى: ' : 'Set to: '}<strong>{log.new_value}</strong></span>
                            )}
                          </p>
                          <p className="text-[10px] text-slate-400">{isRtl ? 'المصدر: ' : 'Source: '}{log.source}</p>
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
                  className="flex-1 h-10 px-5 rounded-xl bg-[#166534] hover:bg-[#14532d] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm hover:shadow-[#166534]/15 active:scale-95 cursor-pointer disabled:opacity-50 transition-all"
                >
                  <UserPlus size={15} />
                  <span>
                    {selectedBusiness.is_imported_to_crm
                      ? (isRtl ? 'موجود بالفعل في CRM' : 'Already in CRM')
                      : (isRtl ? 'استيراد إلى CRM' : 'Import to CRM')}
                  </span>
                </button>

                {selectedBusiness.google_maps_url && (
                  <a
                    href={selectedBusiness.google_maps_url}
                    target="_blank"
                    rel="noreferrer"
                    className="h-10 px-4 rounded-xl border border-slate-200 bg-white hover:bg-[#F0FDF4] hover:border-[#bbf7d0] text-slate-700 hover:text-[#166534] font-semibold text-xs flex items-center gap-1.5 transition-all shadow-xs active:scale-95"
                  >
                    <MapPin size={15} />
                    <span>{isRtl ? 'الخرائط' : 'Maps'}</span>
                  </a>
                )}

                <button
                  onClick={() => setSelectedBusiness(null)}
                  className="h-10 px-4.5 rounded-xl border border-slate-200 bg-white hover:bg-[#F0FDF4] hover:border-[#bbf7d0] text-slate-700 hover:text-[#166534] font-semibold text-xs transition-all shadow-xs active:scale-95 cursor-pointer"
                >
                  {isRtl ? 'إغلاق' : 'Close'}
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
                  <h3 className="text-base font-bold text-slate-900">
                    {isRtl ? 'ملخص الاستيراد ومنع التكرار في CRM' : 'CRM Import & Deduplication Summary'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {isRtl ? 'تحديث ذكي ومطابقة معيارية تمنع تكرار جهات الاتصال' : 'Phone-uniqueness & non-destructive upsert'}
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-2 text-xs">
                <div className="flex justify-between items-center font-semibold">
                  <span className="text-slate-600">{isRtl ? 'العملاء المكتشفون:' : 'Discovered Leads:'}</span>
                  <span className="text-slate-900 font-bold">{(importSummaryModal.discovered).toLocaleString(isRtl ? 'ar-SA' : 'en-US')}</span>
                </div>
                <div className="flex justify-between items-center font-semibold">
                  <span className="text-slate-600">{isRtl ? 'موجودون مسبقاً في CRM:' : 'Already Existing in CRM:'}</span>
                  <span className="text-slate-700 font-bold">{(importSummaryModal.already_existing).toLocaleString(isRtl ? 'ar-SA' : 'en-US')}</span>
                </div>
                <div className="flex justify-between items-center font-semibold">
                  <span className="text-slate-600">{isRtl ? 'منشآت جديدة أُنشئت:' : 'New Businesses Created:'}</span>
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                    +{(importSummaryModal.new_businesses).toLocaleString(isRtl ? 'ar-SA' : 'en-US')}
                  </span>
                </div>
                <div className="flex justify-between items-center font-semibold">
                  <span className="text-slate-600">{isRtl ? 'منشآت سابقة تم إثراؤها:' : 'Existing Businesses Enriched:'}</span>
                  <span className="text-indigo-700 font-bold bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-200">
                    +{(importSummaryModal.existing_businesses_enriched).toLocaleString(isRtl ? 'ar-SA' : 'en-US')}
                  </span>
                </div>
                <div className="flex justify-between items-center font-semibold">
                  <span className="text-slate-600">{isRtl ? 'جهات اتصال جديدة أُنشئت:' : 'New Contacts Created:'}</span>
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                    +{(importSummaryModal.new_contacts).toLocaleString(isRtl ? 'ar-SA' : 'en-US')}
                  </span>
                </div>
                <div className="flex justify-between items-center font-semibold">
                  <span className="text-slate-600">{isRtl ? 'جهات اتصال سابقة تم إثراؤها:' : 'Existing Contacts Enriched:'}</span>
                  <span className="text-indigo-700 font-bold bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-200">
                    +{(importSummaryModal.existing_contacts_enriched).toLocaleString(isRtl ? 'ar-SA' : 'en-US')}
                  </span>
                </div>
                <div className="flex justify-between items-center font-semibold">
                  <span className="text-slate-600">{isRtl ? 'تكرارات تم منعها:' : 'Duplicates Prevented:'}</span>
                  <span className="text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                    {(importSummaryModal.duplicates_prevented).toLocaleString(isRtl ? 'ar-SA' : 'en-US')}
                  </span>
                </div>
                {importSummaryModal.failed > 0 && (
                  <div className="flex justify-between items-center font-semibold">
                    <span className="text-rose-600">{isRtl ? 'أخطاء / فشل:' : 'Failed / Errors:'}</span>
                    <span className="text-rose-700 font-bold">{importSummaryModal.failed}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold border-t border-slate-200/60 pt-2 text-sm">
                  <span className="text-slate-800 font-bold">{isRtl ? 'الإجمالي الفريد النهائي في CRM:' : 'Final Unique in CRM:'}</span>
                  <span className="text-slate-900 font-black">{(importSummaryModal.final_unique).toLocaleString(isRtl ? 'ar-SA' : 'en-US')}</span>
                </div>
              </div>

              {importSummaryModal.already_up_to_date > 0 && importSummaryModal.created === 0 && (
                <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-3 text-[11px] text-emerald-800 space-y-1">
                  <span className="font-bold flex items-center gap-1 text-emerald-900">
                    <ShieldCheck size={14} className="text-emerald-600" /> {isRtl ? 'نظام منع تكرار الهواتف نشط' : 'Phone Deduplication Active'}
                  </span>
                  <p>
                    {isRtl
                      ? `كافة العملاء (${importSummaryModal.already_up_to_date}) الذين تم تقييمهم موجودون بالفعل في جهات اتصال CRM بنفس أرقام الهواتف. لم يتم إنشاء أي جهات اتصال مكررة.`
                      : `All ${importSummaryModal.already_up_to_date} evaluated leads already exist in your CRM Contacts with identical phone numbers. No duplicate contacts were created.`}
                  </p>
                </div>
              )}

              {importSummaryModal.errors && importSummaryModal.errors.length > 0 && (
                <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-3 text-[11px] text-amber-800 space-y-1">
                  <span className="font-bold block text-amber-900">{isRtl ? 'تنبيه:' : 'Notice:'}</span>
                  {importSummaryModal.errors.map((err, idx) => (
                    <p key={idx}>{err}</p>
                  ))}
                </div>
              )}

              <p className="text-[11px] text-slate-500 leading-relaxed">
                {isRtl
                  ? 'تُستخدم أرقام الهواتف المعيارية بصيغة E.164 كمعرف أساسي للعملاء. تم تحديث جهات الاتصال المطابقة بالبريد الإلكتروني والمواقع الإلكترونية المفقودة دون استبدال أو حذف بيانات CRM السابقة.'
                  : 'Normalized E.164 phone numbers act as the primary contact key. Matching existing contacts received missing emails, websites, or secondary phones without overwriting existing CRM data.'}
              </p>

              <div className="flex items-center gap-2 pt-1">
                <Link
                  to="/contacts"
                  className="flex-1 py-2.5 rounded-xl bg-[#12263A] hover:bg-[#166534] text-white font-bold text-xs text-center transition-all shadow-sm shadow-[#166534]/25"
                >
                  {isRtl ? '← عرض في جهات اتصال CRM' : 'View in CRM Contacts \u2192'}
                </Link>
                <button
                  onClick={() => setImportSummaryModal((prev) => ({ ...prev, isOpen: false }))}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer"
                >
                  {isRtl ? 'إغلاق' : 'Close'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
