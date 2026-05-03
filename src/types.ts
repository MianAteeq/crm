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
  templateId: string;
  variableMapping: Record<string, string>;
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

export interface Contact {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
  status: 'Active' | 'Unsubscribed' | 'Archived';
  tags: string[];
  lastSeen: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  businessName?: string;
  avatar?: string;
  onboardingStep: number;
}

export interface WhatsAppConfig {
  status: 'connected' | 'disconnected';
  phoneNumberId: string;
  businessAccountId: string;
  accessToken: string;
  webhookUrl: string;
  verifyToken: string;
  lastSync: string;
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
  type: 'text' | 'template' | 'image' | 'file';
  content: string;
  timestamp: string;
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
  templateId?: string;
}

export interface Conversation {
  id: string;
  contact: Contact;
  messages: Message[];
  unreadCount: number;
  lastMessage: Message;
  isOnline: boolean;
}
