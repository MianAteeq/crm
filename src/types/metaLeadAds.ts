export interface FormQuestion {
  id?: string;
  key: string;
  label: string;
  type: string;
  options?: Array<{ key: string; value: string }>;
}

export interface MetaLeadAccount {
  id: number;
  platform: 'facebook' | 'instagram';
  account_id: string;
  name: string;
  username?: string;
  profile_picture_url?: string;
  category?: string;
  forms_count: number;
  permissions: {
    leads_retrieval: boolean;
    pages_manage_ads: boolean;
    granted_list: string[];
  };
  is_ready_for_lead_ads: boolean;
  connected_at?: string;
}

export interface MetaLeadForm {
  id: number;
  tenant_id: number;
  social_account_id: number;
  form_id: string;
  page_id: string;
  ad_account_id?: string;
  name: string;
  status: 'ACTIVE' | 'ARCHIVED' | 'PAUSED' | 'DELETED';
  locale?: string;
  questions?: FormQuestion[];
  crm_mapping?: Record<string, string>;
  rules?: {
    duplicate_strategy?: 'update' | 'create_always' | 'skip';
    auto_tags?: string[];
    assigned_user_id?: number | null;
    pipeline_id?: number | null;
    stage_id?: number | null;
  };
  is_active: boolean;
  auto_sync: boolean;
  submissions_count: number;
  last_synced_at?: string;
  created_at: string;
  updated_at: string;
  social_account?: {
    id: number;
    name: string;
    platform: string;
    profile_picture_url?: string;
    account_id: string;
  };
}

export interface MetaLeadSubmission {
  id: number;
  tenant_id: number;
  meta_lead_form_id?: number;
  leadgen_id: string;
  form_id: string;
  page_id: string;
  ad_id?: string;
  ad_name?: string;
  adset_id?: string;
  adset_name?: string;
  campaign_id?: string;
  campaign_name?: string;
  platform: 'facebook' | 'instagram';
  raw_payload: any;
  mapped_data?: Record<string, any>;
  crm_contact_id?: number;
  sync_status: 'synced' | 'duplicate' | 'failed' | 'pending';
  error_message?: string;
  synced_at?: string;
  created_at: string;
  updated_at: string;
  form?: {
    id: number;
    name: string;
  };
  contact?: {
    id: number;
    name: string;
    email?: string;
    phone?: string;
  };
}

export interface LeadAdsMetrics {
  total_forms: number;
  active_forms: number;
  total_leads: number;
  synced_leads: number;
  failed_leads: number;
  today_leads: number;
  sync_success_rate: number;
}

