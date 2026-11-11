export type TemplateCategory = 'MARKETING' | 'UTILITY';
export type HeaderType = 'NONE' | 'TEXT' | 'IMAGE' | 'VIDEO' | 'DOCUMENT';
export type ButtonType = 'QUICK_REPLY' | 'URL' | 'CALL' | 'COPY_CODE';

export interface TemplateButton {
  id: string;
  type: ButtonType;
  text: string;
  url?: string;
  phoneNumber?: string;
  couponCode?: string;
}

export interface WhatsAppTemplate {
  id: string;
  name: string;
  category: TemplateCategory;
  language: string;
  header: {
    type: HeaderType;
    text?: string;
    variables?: string[];
    mediaUrl?: string;
    mediaHandle?: string;
    fileName?: string;
    mediaPath?: string;
    mediaType?: string;
  };
  body: {
    text: string;
    variables: string[];
  };
  footer?: {
    text: string;
  };
  buttons: TemplateButton[];
  status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED';
  updatedAt: string;
}

export interface TemplateAnalytics {
  id: string;
  delivered: number;
  opened: number;
  clicked: number;
  replied: number;
  trends: { date: string; sent: number }[];
}

export type WhatsAppBillingStatus =
  | 'Not Configured'
  | 'Configuration Required'
  | 'Pending Verification'
  | 'Operational'
  | 'Payment Attention Required'
  | 'Restricted'
  | 'Unknown';

export interface WhatsAppBillingProfile {
  id: number;
  tenant_id: number;
  waba_id: string | null;
  business_id: string | null;
  business_name: string | null;
  phone_number: string | null;
  phone_number_id: string | null;
  is_connected: boolean;
  billing_status: WhatsAppBillingStatus;
  currency: string | null;
  country: string | null;
  payment_method_status: string;
  payment_verification_note: string;
  last_error_code: string | null;
  last_error_message: string | null;
  last_error_details: any;
  last_checked_at: string | null;
  last_successful_message_at: string | null;
  meta_links: {
    payment_methods: string;
    currency_config: string;
    billing_hub: string;
  } | null;
  meta_raw?: {
    currency?: string | null;
    timezone_id?: string | null;
    account_review_status?: string | null;
    primary_funding_id?: boolean;
  } | null;
}

