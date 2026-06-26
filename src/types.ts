export interface Stat {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
}

export interface Campaign {
  id: string;
  name: string;
  type: 'Broadcast' | 'Automation';
  description?: string;
  audienceSize: number;
  sent: number;
  delivered: number;
  read: number;
  failed: number;
  status: 'Draft' | 'Scheduled' | 'Running' | 'Completed' | 'Failed';
  scheduledAt: string;
  messageContent: string;
  createdAt: string;
}

export interface CampaignLog {
  id: string;
  campaignId: string;
  timestamp: string;
  level: 'info' | 'error' | 'warning';
  message: string;
}

export interface CampaignRecipient {
  id: string;
  campaignId: string;
  contactId: string;
  contactName: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  error?: string;
  timestamp: string;
}

export interface Tag {
  id: string;
  name: string;
  color?: string;
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  company?: string;
  job_title?: string;
  address?: string;
  birthday?: string;
  website?: string;
  notes?: string;
  avatar?: string;
  status: 'active' | 'unsubscribed' | 'archived' | 'lead' | 'customer';
  tags: string[]; // These will be tag IDs
  lastSeen?: string;
  lastContacted?: string; // UI specific
  totalCampaigns?: number; // UI specific
  campaigns?: any[]; // UI specific
  createdAt?: string;
  created_at?: string;
  last_message?: string;
  addedDate?: string; // UI specific
  updatedAt?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  businessName?: string;
  avatar?: string;
  onboardingStep: number;
  tenantId?: string;
  role?: string;
}

export interface WhatsAppSettings {
  access_token: string;
  phone_number_id: string;
  business_account_id: string;
  status: 'connected' | 'disconnected' | 'pending' | 'error';
  business_name?: string;
  phone_number?: string;
  webhook_status?: 'active' | 'inactive';
  is_registered?: boolean;
  last_synced?: string;
  messaging_limit_tier?: string;
  openai_key?: string;
  company_prompt?: string;
}

export interface WhatsAppConfig {
  status: 'connected' | 'disconnected' | 'pending' | 'error';
  phoneNumberId: string;
  businessAccountId: string;
  accessToken: string;
  webhookUrl: string;
  verifyToken: string;
  lastSync: string;
  businessName?: string;
  phoneNumber?: string;
  webhookStatus?: 'active' | 'inactive';
}

export interface ApiLog {
  id: string;
  timestamp: string;
  method: 'GET' | 'POST';
  endpoint: string;
  status: number;
  request: any;
  response: any;
}

export interface Message {
  id: string;
  sender: 'user' | 'contact';
  type: 'text' | 'image' | 'video' | 'audio' | 'file';
  content: string;
  timestamp: string;
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
  mediaUrl?: string;
  fileName?: string;
}

export interface Conversation {
  id: string;
  contact: Contact;
  messages?: Message[];
  unreadCount: number;
  lastMessage: Message;
  isOnline: boolean;
  assignedAgent?: string;
  isPinned?: boolean;
  is_auto_reply_active?: boolean;
}

// Enhanced WhatsApp Cloud API types for Embedded Signup
export interface WhatsAppEmbeddedSignupResponse {
  code: string;
  waba_id: string;
  phone_number_id: string;
}

export interface WhatsAppConnectionData {
  id?: string;
  wabaId: string;
  phoneNumberId: string;
  businessName: string;
  phoneNumber: string;
  status: 'connected' | 'disconnected' | 'error' | 'pending' | 'expired';
  lastSynced?: string;
  createdAt?: string;
  webhookConfigured?: boolean;
  numberVerified?: boolean;
  errorMessage?: string;
}

export interface WhatsAppDashboardStats {
  totalConversations: number;
  messagesSentToday: number;
  messagesReceivedToday: number;
  activeChats: number;
  conversationsTrend?: 'up' | 'down' | 'neutral';
  messagesTrend?: 'up' | 'down' | 'neutral';
  messagingLimitTier?: string;
}
