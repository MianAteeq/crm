export type PageStatus = 'draft' | 'published' | 'archived';
export type FormType = 'lead_form' | 'survey' | 'contact_form' | 'registration';
export type FormStatus = 'draft' | 'published' | 'archived';

export interface PageTheme {
  primary_color: string;
  secondary_color: string;
  background_color: string;
  text_color: string;
  font_family: string;
  container_width: string;
  border_radius: string;
  palette_id?: string;
}

export interface PageSeoSettings {
  meta_title?: string;
  meta_description?: string;
  keywords?: string;
  og_image?: string;
  favicon?: string;
  custom_head_code?: string;
  custom_body_code?: string;
}

export interface SectionSetting {
  bg_type: 'solid' | 'gradient' | 'image';
  bg_color: string;
  bg_gradient?: string;
  bg_image?: string;
  overlay_opacity?: number;
  text_align?: 'left' | 'center' | 'right';
  padding_top?: string;
  padding_bottom?: string;
  container_width?: 'normal' | 'narrow' | 'wide' | 'full';
  columns?: number;
}

export type SectionType =
  | 'hero'
  | 'about'
  | 'services'
  | 'features'
  | 'testimonials'
  | 'pricing'
  | 'faq'
  | 'contact_form'
  | 'footer'
  | 'stats'
  | 'logo_cloud'
  | 'cta_banner'
  | 'video_showcase'
  | 'countdown';

export interface PageSection {
  id: string;
  type: SectionType;
  name: string;
  visible: boolean;
  content: Record<string, any>;
  settings: SectionSetting;
}

export interface BuilderPage {
  id: number;
  tenant_id: number;
  user_id?: number;
  title: string;
  slug: string;
  description?: string;
  category: string;
  status: PageStatus;
  theme: PageTheme;
  sections: PageSection[];
  seo_settings?: PageSeoSettings;
  published_at?: string;
  view_count: number;
  submission_count: number;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  forms?: BuilderForm[];
}

export type FieldType =
  | 'text'
  | 'email'
  | 'phone'
  | 'number'
  | 'dropdown'
  | 'radio'
  | 'checkbox'
  | 'textarea'
  | 'date'
  | 'file'
  | 'rating'
  | 'yes_no';

export interface ConditionalRule {
  field_id: string;
  operator: 'equals' | 'not_equals' | 'contains';
  value: string;
}

export interface FormField {
  id: string;
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  help_text?: string;
  required: boolean;
  width?: 'full' | 'half' | 'third';
  options?: string[]; // for dropdown, radio, checkbox
  max_stars?: number; // for rating (e.g. 5 or 10)
  min?: number;
  max?: number;
  conditional_rule?: ConditionalRule;
}

export interface FormStep {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
}

export interface FormSchema {
  is_multi_step: boolean;
  steps: FormStep[];
}

export interface FormSettings {
  submit_button_text: string;
  thank_you_message: string;
  redirect_url?: string;
  theme?: {
    primary_color: string;
    background_color: string;
    border_radius: string;
  };
  notification_emails?: string[];
}

export interface CrmMapping {
  field_mappings: Record<string, string>; // form_field_name -> crm_contact_column
  auto_tags: string[];
  assigned_user_id?: number | null;
  duplicate_strategy: 'update' | 'create_always' | 'skip';
}

export interface BuilderForm {
  id: number;
  tenant_id: number;
  user_id?: number;
  page_id?: number | null;
  title: string;
  slug: string;
  form_type: FormType;
  status: FormStatus;
  schema: FormSchema;
  settings: FormSettings;
  crm_mapping: CrmMapping;
  published_at?: string;
  view_count: number;
  submission_count: number;
  created_at: string;
  updated_at: string;
  page?: {
    id: number;
    title: string;
    slug: string;
  };
}

export interface BuilderSubmission {
  id: number;
  tenant_id: number;
  form_id: number;
  page_id?: number | null;
  contact_id?: number | null;
  data: Record<string, any>;
  survey_results?: {
    ratings?: Record<string, number>;
    average_rating?: number | null;
    fields_answered?: number;
    completed_at?: string;
  } | null;
  ip_address?: string;
  user_agent?: string;
  referer?: string;
  utm_params?: Record<string, string> | null;
  status: string;
  created_at: string;
  updated_at: string;
  form?: {
    id: number;
    title: string;
    slug: string;
    form_type: FormType;
  };
  page?: {
    id: number;
    title: string;
    slug: string;
  };
  contact?: {
    id: number;
    name: string;
    email?: string;
    phone?: string;
  };
}

export interface BuilderTemplate {
  id: number;
  name: string;
  category: string;
  template_type: 'page' | 'form' | 'survey';
  thumbnail_url?: string;
  description?: string;
  content?: any;
  is_system: boolean;
}

export interface DashboardMetrics {
  total_pages: number;
  published_pages: number;
  total_forms: number;
  published_forms: number;
  total_submissions: number;
  leads_generated: number;
  total_views: number;
  conversion_rate: number;
  recent_submissions: BuilderSubmission[];
  recent_pages: BuilderPage[];
}

