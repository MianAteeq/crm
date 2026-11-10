export type ReportingPeriod = 'today' | 'yesterday' | '7d' | '30d' | 'this_month' | 'last_month' | 'custom';

export interface ReportingFilters {
  period: ReportingPeriod;
  start_date?: string;
  end_date?: string;
  platform?: string;
  source?: string;
}

export interface MarketingKPIs {
  total_leads: number;
  meta_leads: number;
  builder_leads: number;
  crm_contacts: number;
  conversion_rate: number;
  published_posts: number;
  total_impressions: number;
  total_reach: number;
  total_engagement: number;
}

export interface DailyTrendItem {
  date: string;
  label: string;
  leads: number;
  contacts: number;
  meta_leads: number;
}

export interface LeadSourceItem {
  source: string;
  count: number;
}

export interface MarketingOverviewData {
  period: {
    start: string;
    end: string;
    days: number;
  };
  kpis: MarketingKPIs;
  daily_trends: DailyTrendItem[];
  lead_sources: LeadSourceItem[];
  lead_quality: {
    A: number;
    B: number;
    C: number;
    D: number;
  };
}

export interface AdvertisingCampaignItem {
  campaign_id: string;
  campaign_name: string;
  platform: string;
  total_leads: number;
  synced_leads: number;
  sync_rate: number;
  last_lead_at: string;
}

export interface AdvertisingPerformanceData {
  connected_accounts: number;
  active_forms_count: number;
  total_forms_count: number;
  platform_distribution: {
    facebook: number;
    instagram: number;
    total: number;
  };
  campaigns: AdvertisingCampaignItem[];
  top_ads: Array<{
    ad_id: string;
    ad_name: string;
    adset_name: string;
    campaign_name: string;
    platform: string;
    lead_count: number;
  }>;
  forms_summary: Array<{
    id: number;
    form_id: string;
    name: string;
    status: string;
    page_name: string;
    submissions_count: number;
    is_active: boolean;
  }>;
}

export interface SocialAnalyticsData {
  accounts_summary: {
    total: number;
    facebook_pages: number;
    instagram_profiles: number;
    total_followers: number;
  };
  kpis: {
    published_posts: number;
    total_reach: number;
    total_impressions: number;
    total_likes: number;
    total_comments: number;
    engagement_rate: number;
  };
  daily_performance: Array<{
    date: string;
    label: string;
    posts_count: number;
    impressions: number;
    reach: number;
  }>;
  top_posts: Array<{
    id: number;
    platform: string;
    account_name: string;
    content_preview: string;
    published_at: string;
    reach: number;
    impressions: number;
    likes: number;
    comments: number;
    url?: string;
  }>;
  connected_accounts: Array<{
    id: number;
    platform: string;
    name: string;
    username: string;
    avatar?: string;
    followers_count: number;
    is_active: boolean;
  }>;
}

export interface LeadGenerationData {
  total_leads: number;
  source_breakdown: Array<{
    source: string;
    total_leads: number;
    converted: number;
    conversion_rate: number;
  }>;
  status_breakdown: Array<{
    status: string;
    count: number;
  }>;
  forms_performance: Array<{
    id: number;
    form_id: string;
    name: string;
    status: string;
    submissions_period: number;
    total_submissions: number;
  }>;
}

export interface TeamMemberMetric {
  user_id: number;
  name: string;
  email: string;
  avatar?: string;
  conversations_handled: number;
  open_conversations: number;
  contacts_handled: number;
  avg_response_time: string;
  status: string;
}

export interface TeamPerformanceData {
  total_members: number;
  team_metrics: TeamMemberMetric[];
}

export interface SavedReport {
  id: number;
  tenant_id: number;
  user_id: number;
  title: string;
  description?: string;
  report_type: 'overview' | 'ads' | 'social' | 'leads' | 'team';
  filters?: Record<string, any>;
  metrics?: string[];
  schedule?: Record<string, any>;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  created_at: string;
}

