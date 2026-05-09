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
    mediaUrl?: string;
    fileName?: string;
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
