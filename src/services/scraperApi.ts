import { apiClient } from './apiClient';

export interface ScraperStatus {
  enabled: boolean;
  google_api_configured: boolean;
}

export interface ScraperStats {
  total_searches: number;
  total_leads_scraped: number;
  total_emails_discovered: number;
  total_imported_crm: number;
  total_unimported_crm?: number;
}

export interface ScraperSearchItem {
  id: number;
  tenant_id: number;
  user_id: number;
  keyword: string;
  industry?: string | null;
  location: string;
  radius: number | null;
  lead_volume?: number | null;
  max_results: number;
  search_mode?: 'standard' | 'deep';
  status: 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled';
  phase?: 'discovery' | 'enrichment' | 'completed' | 'failed' | 'queued';
  zones_total?: number;
  zones_completed?: number;
  coverage_exhausted?: boolean;
  exhaustion_note?: string | null;
  total_found: number;
  total_processed: number;
  websites_found?: number;
  total_emails_found: number;
  total_duplicates: number;
  duplicates_removed?: number;
  no_email?: number;
  total_failed: number;
  options?: any;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

export interface ScraperBusinessEmail {
  id: number;
  scraped_business_id: number;
  email: string;
  email_normalized: string;
  is_primary: boolean;
  source?: string | null;
  source_page: string | null;
}

export interface ContactEnrichmentLogItem {
  id: number;
  tenant_id: number;
  contact_id: number;
  scraped_business_id: number | null;
  search_id: number | null;
  field_name: string;
  old_value: string | null;
  new_value: string | null;
  source: string;
  created_at: string;
}

export interface ScrapedBusinessItem {
  id: number;
  tenant_id: number;
  user_id: number;
  search_id: number;
  google_place_id: string | null;
  business_name: string;
  normalized_business_name?: string | null;
  category: string | null;
  website: string | null;
  website_domain: string | null;
  normalized_domain?: string | null;
  phone: string | null;
  phone_original?: string | null;
  phone_normalized?: string | null;
  address: string | null;
  google_maps_url: string | null;
  rating?: number | null;
  review_count?: number | null;
  email: string | null;
  email_normalized: string | null;
  email_source?: string | null;
  source: string;
  source_details?: Record<string, string> | null;
  lead_quality_score?: number;
  lead_quality_grade?: 'A' | 'B' | 'C' | 'D' | string;
  enrichment_status?: 'NEW' | 'PARTIAL' | 'ENRICHED' | 'FAILED' | 'NO_EMAIL' | 'NO_WEBSITE' | 'NO_PHONE' | string;
  missing_fields?: string[] | null;
  status: 'pending' | 'discovered' | 'email_found' | 'no_website' | 'no_email_found' | 'failed' | 'imported';
  is_imported_to_crm: boolean;
  crm_contact_id: number | null;
  failure_reason: string | null;
  last_enriched_at?: string | null;
  enrichment_attempts?: number;
  created_at: string;
  updated_at: string;
  emails?: ScraperBusinessEmail[];
  enrichment_logs?: ContactEnrichmentLogItem[];
}

export interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number | null;
  last_page: number;
  last_page_url: string;
  links: any[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
}

export interface CreateSearchParams {
  keyword: string;
  industry?: string;
  category?: string;
  category_id?: number;
  location: string;
  radius?: number;
  lead_volume?: number;
  max_results?: number;
  search_mode?: 'standard' | 'deep';
  immediate?: boolean;
  options?: {
    search_mode?: 'standard' | 'deep';
    data_to_collect?: Record<string, boolean>;
    email_discovery_mode?: 'basic' | 'website_contact' | 'deep';
    lead_requirements?: {
      must_have_email?: boolean;
      must_have_website?: boolean;
      must_have_phone?: boolean;
    };
    advanced?: {
      search_coverage?: string;
      min_rating?: number;
      min_reviews?: number;
      business_status?: string;
      check_homepage?: boolean;
      check_contact?: boolean;
      check_about?: boolean;
      max_pages?: number;
      timeout?: number;
      retry_attempts?: number;
      concurrency?: number;
      dedup_place_id?: boolean;
      dedup_domain?: boolean;
      dedup_name_address?: boolean;
      dedup_email?: boolean;
    };
  };
}

export const scraperApi = {
  /**
   * Get feature status and statistics
   */
  async getStatus(): Promise<{ status: ScraperStatus; stats: ScraperStats }> {
    const res = await apiClient.get('/scraper/status', {
      headers: { 'X-Skip-Loader': 'true' },
    });
    return res.data;
  },

  /**
   * Get list of past searches
   */
  async getSearches(page = 1, perPage = 10): Promise<PaginatedResponse<ScraperSearchItem>> {
    const res = await apiClient.get('/scraper/searches', {
      params: { page, per_page: perPage },
      headers: { 'X-Skip-Loader': 'true' },
    });
    return res.data.data;
  },

  /**
   * Start a new scraper search
   */
  async startSearch(params: CreateSearchParams): Promise<ScraperSearchItem> {
    const res = await apiClient.post('/scraper/searches', params);
    return res.data.data;
  },

  /**
   * Fetch single search details / progress
   */
  async getSearchProgress(id: number): Promise<ScraperSearchItem> {
    const res = await apiClient.get(`/scraper/searches/${id}`, {
      headers: { 'X-Skip-Loader': 'true' },
    });
    return res.data.data;
  },

  /**
   * Process search synchronously
   */
  async processNow(id: number): Promise<ScraperSearchItem> {
    const res = await apiClient.post(`/scraper/searches/${id}/process-now`);
    return res.data.data;
  },

  /**
   * Delete a search
   */
  async deleteSearch(id: number): Promise<void> {
    await apiClient.delete(`/scraper/searches/${id}`);
  },

  /**
   * Get paginated scraped businesses with filters
   */
  async getResults(params: {
    page?: number;
    per_page?: number;
    search_id?: number | string;
    category_id?: number | string;
    category?: string;
    tab?: string;
    status?: string;
    search?: string;
    has_email?: boolean;
  } = {}): Promise<PaginatedResponse<ScrapedBusinessItem>> {
    const res = await apiClient.get('/scraper/results', {
      params,
      headers: { 'X-Skip-Loader': 'true' },
    });
    return res.data;
  },

  /**
   * Get category-level scraper & email metrics (Requirement 19)
   */
  async getCategoryStats(categoryId?: number | string): Promise<any> {
    const res = await apiClient.get('/scraper/category-stats', {
      params: categoryId ? { category_id: categoryId } : {},
      headers: { 'X-Skip-Loader': 'true' },
    });
    return res.data?.data || res.data;
  },

  /**
   * Get a single business result's details
   */
  async getResultDetails(id: number): Promise<ScrapedBusinessItem> {
    const res = await apiClient.get(`/scraper/results/${id}`, {
      headers: { 'X-Skip-Loader': 'true' },
    });
    return res.data.data;
  },

  /**
   * Delete a single business record
   */
  async deleteResult(id: number): Promise<void> {
    await apiClient.delete(`/scraper/results/${id}`);
  },

  /**
   * Batch delete multiple businesses
   */
  async batchDelete(ids: number[]): Promise<{ deleted_count: number }> {
    const res = await apiClient.post('/scraper/results/batch-delete', { ids });
    return res.data;
  },

  /**
   * Import selected or all businesses into CRM Contacts with smart upsert
   */
  async importToCrm(payload: {
    ids?: number[];
    import_all?: boolean;
    search_id?: number;
    tab?: string;
    search?: string;
    unimported_only?: boolean;
  } | number[]): Promise<{
    created: number;
    enriched: number;
    already_up_to_date?: number;
    total: number;
    limit_skipped?: number;
    errors: string[];
    message?: string;
  }> {
    const body = Array.isArray(payload) ? { ids: payload } : payload;
    const res = await apiClient.post('/scraper/results/import-crm', body);
    return res.data.data;
  },

  /**
   * Enrich missing data for a single lead
   */
  async enrichLead(id: number): Promise<{
    success: boolean;
    data: ScrapedBusinessItem;
    enriched_fields: string[];
    message: string;
  }> {
    const res = await apiClient.post(`/scraper/results/${id}/enrich`);
    return res.data;
  },

  /**
   * Bulk enrich missing data for multiple leads
   */
  async bulkEnrichLeads(ids: number[]): Promise<{
    total_selected: number;
    enriched_count: number;
    still_missing_count: number;
    failed_count: number;
  }> {
    const res = await apiClient.post('/scraper/results/bulk-enrich', { ids });
    return res.data.data;
  },

  /**
   * Fetch enrichment audit trail logs for a lead
   */
  async getEnrichmentLogs(id: number): Promise<ContactEnrichmentLogItem[]> {
    const res = await apiClient.get(`/scraper/results/${id}/enrichment-logs`, {
      headers: { 'X-Skip-Loader': 'true' },
    });
    return res.data.data;
  },

  /**
   * Export CSV download URL
   */
  getExportCsvUrl(params: {
    search_id?: number | string;
    tab?: string;
    status?: string;
    search?: string;
    has_email?: boolean;
  } = {}): string {
    const query = new URLSearchParams();
    if (params.search_id) query.append('search_id', String(params.search_id));
    if (params.tab && params.tab !== 'all') query.append('tab', params.tab);
    if (params.status && params.status !== 'all') query.append('status', params.status);
    if (params.search) query.append('search', params.search);
    if (params.has_email) query.append('has_email', 'true');

    return `/api/scraper/export-csv?${query.toString()}`;
  },

  /**
   * Download CSV directly via authenticated blob
   */
  async downloadCsv(params: {
    search_id?: number | string;
    tab?: string;
    status?: string;
    search?: string;
    has_email?: boolean;
  } = {}): Promise<void> {
    const res = await apiClient.get('/scraper/export-csv', {
      params,
      responseType: 'blob',
    });

    const blob = new Blob([res.data], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `scraped_leads_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },
};
