export type EmailCampaignStatus = 
  | 'draft' 
  | 'scheduled' 
  | 'sending' 
  | 'completed' 
  | 'paused' 
  | 'cancelled' 
  | 'failed';

export type RecipientStatus = 
  | 'pending' 
  | 'queued' 
  | 'sending' 
  | 'sent' 
  | 'delivered' 
  | 'deferred'
  | 'bounced' 
  | 'failed' 
  | 'complained'
  | 'skipped' 
  | 'unsubscribed';

export interface EmailCampaign {
  id: number;
  name: string;
  subject: string;
  from_name: string;
  from_email: string;
  reply_to?: string;
  sending_domain_id?: number;
  sending_domain?: string;
  template_id?: number;
  html_body?: string;
  text_body?: string;
  audience_filter?: AudienceFilter;
  status: EmailCampaignStatus;
  total_recipients: number;
  eligible_count: number;
  excluded_count: number;
  sent_count: number;
  delivered_count: number;
  bounced_count: number;
  failed_count: number;
  unsubscribed_count: number;
  progress_percent: number;
  scheduled_at?: string;
  started_at?: string;
  completed_at?: string;
  created_at: string;
}

export interface DnsRecordItem {
  record_type: string;
  name: string;
  value: string;
  purpose?: string;
  status?: string;
}

export interface EmailSendingDomain {
  id: number;
  tenant_id: number;
  domain: string;
  status: 'pending' | 'verified' | 'rejected' | 'failed';
  mailtrap_domain_id?: string;
  mailtrap_domain_name?: string;
  spf_status: string;
  dkim_status: string;
  dmarc_status: string;
  dns_records?: DnsRecordItem[];
  verified_at?: string;
  last_checked_at?: string;
  verification_error?: string;
  created_at: string;
  updated_at?: string;
}

export interface EmailSendingDomainSummary {
  total: number;
  verified_count: number;
  pending_count: number;
  can_send: boolean;
}

export interface AudienceFilter {
  audience_type?: 'all' | 'selected' | 'filtered';
  contact_ids?: number[];
  tag_ids?: number[];
  source?: string;
  lead_quality_grades?: string[];
  min_lead_score?: number;
  location?: string;
  industry?: string;
  status?: string;
  website_available?: boolean;
}

export interface AudienceEstimate {
  total_evaluated: number;
  eligible_count: number;
  excluded_count: number;
  reasons: {
    missing_email: number;
    invalid_syntax: number;
    unsubscribed: number;
    suppressed: number;
    duplicate_in_audience: number;
  };
  sample_eligible?: Array<{
    id: number;
    name: string;
    company?: string;
    email: string;
    lead_quality_grade?: string;
  }>;
}

export interface EmailTemplate {
  id: number;
  name: string;
  subject: string;
  category: string;
  html_body: string;
  text_body?: string;
  created_at?: string;
  updated_at?: string;
}

export interface EmailSetting {
  id?: number;
  provider: 'mailtrap' | 'smtp' | 'sendgrid' | 'log';
  from_name: string;
  from_email: string;
  reply_to?: string;
  // Mailtrap configuration
  mailtrap_api_token?: string;
  has_mailtrap_api_token?: boolean;
  mailtrap_webhook_secret?: string;
  has_mailtrap_webhook_secret?: boolean;
  mailtrap_domain?: string;
  mailtrap_inbox_id?: string;
  // SMTP configuration
  smtp_host?: string;
  smtp_port?: number;
  smtp_encryption?: 'tls' | 'ssl' | 'none';
  smtp_username?: string;
  smtp_password?: string;
  has_smtp_password?: boolean;
  api_key?: string;
  has_api_key?: boolean;
  deepseek_api_key?: string;
  has_deepseek_api_key?: boolean;
  rate_limit_per_minute?: number;
  daily_limit?: number;
  is_active?: boolean;
}

export interface CampaignReport {
  campaign: EmailCampaign;
  metrics: {
    total_recipients: number;
    eligible_count: number;
    excluded_count: number;
    sent: number;
    delivered: number;
    bounced: number;
    failed: number;
    unsubscribed: number;
    delivery_rate: number;
    bounce_rate: number;
    failure_rate: number;
    unsubscribe_rate: number;
    progress_percent: number;
    started_at?: string;
    completed_at?: string;
  };
  recipients: Array<{
    id: number;
    email: string;
    status: RecipientStatus;
    provider?: string;
    provider_message_id?: string;
    bounce_type?: string;
    bounce_reason?: string;
    personalized_subject?: string;
    attempts: number;
    error_message?: string;
    sent_at?: string;
    delivered_at?: string;
    contact?: {
      id: number;
      name: string;
      company?: string;
      phone?: string;
    };
  }>;
  recipients_meta?: {
    current_page: number;
    last_page: number;
    total: number;
  };
}

export interface ContactEmailActivity {
  id: number;
  campaign_id: number;
  campaign_name: string;
  subject: string;
  status: RecipientStatus;
  sent_at?: string;
  delivered_at?: string;
  error_message?: string;
  date: string;
}
