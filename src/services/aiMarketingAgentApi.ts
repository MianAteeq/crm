import { apiClient } from './apiClient';

export interface AiAgentActionLog {
  step: string;
  label: string;
  status: 'running' | 'success' | 'failed' | 'skipped';
  timestamp: string;
  details?: any;
}

export interface CampaignPlan {
  campaign_id: number;
  campaign_name: string;
  objective: string;
  category: string;
  service: string;
  location: string;
  subject: string;
  preheader: string;
  from_name: string;
  from_email: string;
  cta_text: string;
  sending_domain: string;
  total_contacts: number;
  contacts_with_email: number;
  eligible_count: number;
  excluded_count: number;
  exclusion_reasons: {
    missing_email?: number;
    invalid_syntax?: number;
    unsubscribed?: number;
    suppressed?: number;
    recently_contacted_cooldown?: number;
    duplicate_in_audience?: number;
  };
  sample_eligible?: Array<{
    id: number;
    name: string;
    email: string;
    company: string;
  }>;
  html_preview: string;
  text_preview: string;
  is_autonomous: boolean;
  approval_mode: 'manual' | 'approval' | 'autonomous';
}

export interface AiAgentRun {
  id: number;
  tenant_id: number;
  user_id: number;
  campaign_id?: number;
  user_request: string;
  interpreted_intent?: {
    category: string;
    service: string;
    objective: string;
    location?: string;
    email_history?: string;
    is_follow_up?: boolean;
    channel: string;
    action: string;
  };
  approval_mode: 'manual' | 'approval' | 'autonomous';
  status: 'planning' | 'awaiting_approval' | 'approved' | 'running' | 'completed' | 'failed' | 'cancelled';
  actions_taken: AiAgentActionLog[];
  recipients_selected: number;
  recipients_excluded: number;
  audience_summary?: any;
  campaign_plan?: CampaignPlan;
  performance_analysis?: {
    metrics: {
      sent: number;
      delivered: number;
      bounced: number;
      opens: number;
      clicks: number;
      delivery_rate: number;
      bounce_rate: number;
      open_rate: number;
      click_rate: number;
      unsubscribe_rate: number;
    };
    ai_insights: {
      summary: string;
      delivery_analysis: string;
      engagement_analysis: string;
      key_learnings: string[];
      recommended_changes: string[];
      follow_up_recommendation: {
        recommended: boolean;
        target_segment: string;
        suggested_angle: string;
      };
    };
    analyzed_at: string;
  };
  errors?: string;
  started_at?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
  campaign?: {
    id: number;
    name: string;
    status: string;
    sent_count: number;
    delivered_count: number;
    bounced_count: number;
  };
}

export interface MarketingKnowledge {
  id?: number;
  tenant_id?: number;
  company_name: string;
  company_description: string;
  brand_voice: string;
  website: string;
  demo_link: string;
  booking_link: string;
  contact_email: string;
  contact_phone: string;
  pricing_overview: string;
  case_studies: string[];
  target_industries: string[];
  approval_mode: 'manual' | 'approval' | 'autonomous';
  max_emails_per_campaign: number;
  max_emails_per_day: number;
  min_hours_between_campaigns: number;
  cooldown_days_per_contact: number;
  require_approval_above_recipients: number;
}

export interface MarketingService {
  id?: number;
  name: string;
  slug?: string;
  description: string;
  target_industries: string[];
  features: string[];
  benefits: string[];
  pricing?: string;
  cta_text: string;
  cta_url?: string;
  is_active: boolean;
}

export const aiMarketingAgentApi = {
  // Plan Campaign from Natural Language prompt
  async planCampaign(prompt: string) {
    const res = await apiClient.post<{ success: boolean; message: string; data: AiAgentRun }>(
      '/email/ai-agent/plan',
      { prompt }
    );
    return res.data;
  },

  // Approve and Send / Schedule
  async approveCampaign(runId: number, options?: { send_now?: boolean; scheduled_at?: string }) {
    const res = await apiClient.post<{ success: boolean; message: string; data: AiAgentRun }>(
      `/email/ai-agent/runs/${runId}/approve`,
      options
    );
    return res.data;
  },

  // Cancel Run
  async cancelRun(runId: number) {
    const res = await apiClient.post<{ success: boolean; message: string; data: AiAgentRun }>(
      `/email/ai-agent/runs/${runId}/cancel`
    );
    return res.data;
  },

  // List Run History
  async getRuns(params?: { page?: number; per_page?: number }) {
    const res = await apiClient.get<{ success: boolean; data: AiAgentRun[]; meta: any }>(
      '/email/ai-agent/runs',
      { params }
    );
    return res.data;
  },

  // Get Single Run Details
  async getRun(runId: number) {
    const res = await apiClient.get<{ success: boolean; data: AiAgentRun }>(
      `/email/ai-agent/runs/${runId}`
    );
    return res.data;
  },

  // Run Post-Campaign DeepSeek Analysis
  async analyzeCampaign(runId: number) {
    const res = await apiClient.post<{ success: boolean; message: string; data: any }>(
      `/email/ai-agent/runs/${runId}/analyze`
    );
    return res.data;
  },

  // Update Run Campaign & Template (User edit email)
  async updateRunCampaign(runId: number, data: {
    subject: string;
    preheader?: string;
    from_name: string;
    from_email: string;
    cta_text?: string;
    html_preview: string;
    text_preview?: string;
    template_theme?: string;
  }) {
    const res = await apiClient.put<{ success: boolean; message: string; data: AiAgentRun }>(
      `/email/ai-agent/runs/${runId}/campaign`,
      data
    );
    return res.data;
  },

  // Marketing Knowledge & Safety Limits
  async getKnowledge() {
    const res = await apiClient.get<{ success: boolean; data: MarketingKnowledge }>(
      '/email/ai-agent/knowledge'
    );
    return res.data;
  },

  async updateKnowledge(data: Partial<MarketingKnowledge>) {
    const res = await apiClient.post<{ success: boolean; message: string; data: MarketingKnowledge }>(
      '/email/ai-agent/knowledge',
      data
    );
    return res.data;
  },

  // Services Catalog
  async getServices() {
    const res = await apiClient.get<{ success: boolean; data: MarketingService[] }>(
      '/email/ai-agent/services'
    );
    return res.data;
  },

  async saveService(data: Partial<MarketingService>) {
    const res = await apiClient.post<{ success: boolean; message: string; data: MarketingService }>(
      '/email/ai-agent/services',
      data
    );
    return res.data;
  },

  async deleteService(id: number) {
    const res = await apiClient.delete<{ success: boolean; message: string }>(
      `/email/ai-agent/services/${id}`
    );
    return res.data;
  },
};
