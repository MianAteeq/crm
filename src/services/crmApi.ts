import { Contact, Tag, WhatsAppSettings, Conversation, Message } from '../types';
import { AuthService } from './authService';
import { apiClient } from './apiClient';

// Mock Data
const MOCK_TAGS: Tag[] = [
  { id: '1', name: 'VIP', color: '#8b5cf6' },
  { id: '2', name: 'Eid Promo', color: '#f59e0b' },
  { id: '3', name: 'New Customer', color: '#10b981' },
  { id: '4', name: 'Wholesale', color: '#3b82f6' },
  { id: '5', name: 'Complaint', color: '#ef4444' },
  { id: '6', name: 'Inactive', color: '#64748b' }
];

const MOCK_CONTACTS: Contact[] = [
  {
    id: '1',
    name: 'Muhammad Ahmad',
    phone: '+92 300 1234567',
    email: 'ahmad@example.com',
    status: 'active',
    tags: ['1', '3'],
    lastSeen: new Date().toISOString(),
    created_at: '2024-01-15T10:00:00Z',
    company: 'Tech Solutions',
    job_title: 'Manager'
  },
  {
    id: '2',
    name: 'Fatima Zahra',
    phone: '+92 321 7654321',
    email: 'fatima@example.com',
    status: 'active',
    tags: ['2'],
    lastSeen: new Date(Date.now() - 3600000).toISOString(),
    created_at: '2024-02-20T14:30:00Z',
    company: 'Creative Studio',
    job_title: 'Designer'
  }
];

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: '1',
    contact: MOCK_CONTACTS[0],
    unreadCount: 2,
    isOnline: true,
    messages: [],
    lastMessage: {
      id: 'm1',
      sender: 'contact',
      type: 'text',
      content: 'Hello, I have a question about my order.',
      timestamp: new Date().toISOString(),
      status: 'read'
    }
  },
  {
    id: '2',
    contact: MOCK_CONTACTS[1],
    unreadCount: 0,
    isOnline: false,
    messages: [],
    lastMessage: {
      id: 'm2',
      sender: 'user',
      type: 'text',
      content: 'Your order has been shipped!',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      status: 'delivered'
    }
  }
];

class CrmApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    try {
      const isFormData = options.body instanceof FormData;
      const headers = {
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...options.headers,
      } as any;

      let data = options.body;
      if (typeof data === 'string') {
        try {
          data = JSON.parse(data);
        } catch (e) {
          // Keep as string
        }
      }

      const response = await apiClient.request<T>({
        url: endpoint,
        method: (options.method || 'GET') as any,
        headers,
        data,
      });

      return response.data;
    } catch (error) {
      console.warn(`[CRM API] Request to ${endpoint} failed, returns mock instead`, error);
      throw error; // Let the specific method handle the fallback
    }
  }

  // Tags API
  async getTags(options?: RequestInit): Promise<Tag[]> {
    try {
      const data = await this.request<any>('/tags', options);
      const tags = Array.isArray(data) ? data : (data?.data || data?.tags || []);
      return (Array.isArray(tags) && tags.length > 0) ? tags : MOCK_TAGS;
    } catch (error) {
      return MOCK_TAGS;
    }
  }

  // Contacts API
  async getContacts(params?: { 
    search?: string; 
    status?: string; 
    tag?: string; 
    engagement?: string; 
    lastTouchpoint?: string;
    page?: number;
    perPage?: number;
  }, options?: RequestInit): Promise<Contact[] & { pagination?: { currentPage: number; lastPage: number; perPage: number; total: number } }> {
    try {
      let query = '';
      let endpoint = '/contacts';

      if (params) {
        const hasAdvancedFilters = params.status || params.tag || params.lastTouchpoint;
        if (hasAdvancedFilters) endpoint = '/contacts/advance-search';

        const searchParams = new URLSearchParams();
        if (params.search) searchParams.append('search', params.search);
        if (params.status) searchParams.append('status', params.status);
        if (params.tag) searchParams.append('tags[]', params.tag);
        if (params.lastTouchpoint) searchParams.append('last_touchpoint', params.lastTouchpoint);
        if (params.page) searchParams.append('page', String(params.page));
        if (params.perPage) searchParams.append('per_page', String(params.perPage));
        query = `?${searchParams.toString()}`;
      }

      const response = await this.request<any>(`${endpoint}${query}`, options);
      
      let contactsArray: any[] = [];
      let paginationData: any = null;

      if (response && response.current_page !== undefined && Array.isArray(response.data)) {
        contactsArray = response.data;
        paginationData = {
          currentPage: response.current_page,
          lastPage: response.last_page,
          perPage: response.per_page,
          total: response.total
        };
      } else if (response?.data && response.data.current_page !== undefined && Array.isArray(response.data.data)) {
        const paginator = response.data;
        contactsArray = paginator.data;
        paginationData = {
          currentPage: paginator.current_page,
          lastPage: paginator.last_page,
          perPage: paginator.per_page,
          total: paginator.total
        };
      } else if (response?.data && Array.isArray(response.data)) {
        contactsArray = response.data;
      } else if (Array.isArray(response)) {
        contactsArray = response;
      } else if (Array.isArray(response?.contacts)) {
        contactsArray = response.contacts;
      }

      if (contactsArray.length === 0 && !params?.search && !params?.tag && !params?.status && !params?.lastTouchpoint) {
        const result: any = [...MOCK_CONTACTS];
        return result;
      }

      const mappedContacts: any = contactsArray.map(c => ({ 
        ...c,
        createdAt: c.createdAt || c.created_at,
        last_message: c.last_message || (c.last_interaction?.body) || (c.last_interaction?.message),
        tags: Array.isArray(c.tags) ? c.tags.map((t: any) => typeof t === 'object' ? t.id : t) : [] 
      }));

      if (paginationData) {
        mappedContacts.pagination = paginationData;
      }

      return mappedContacts;
    } catch (error) {
      const result: any = [...MOCK_CONTACTS];
      return result;
    }
  }

  async getContact(id: string, options?: RequestInit): Promise<Contact> {
    try {
      const data = await this.request<Contact>(`/contacts/${id}`, options);
      const tags = Array.isArray(data.tags) ? data.tags.map((t: any) => typeof t === 'object' ? t.id : t) : [];
      return { ...data, createdAt: data.createdAt || data.created_at, tags };
    } catch (error) {
      return MOCK_CONTACTS.find(c => c.id === id) || MOCK_CONTACTS[0];
    }
  }

  async createContact(contactData: Partial<Contact>): Promise<Contact> {
    try {
      const data = await this.request<Contact>('/contacts', {
        method: 'POST',
        body: JSON.stringify(contactData),
      });
      return { ...data, createdAt: data.createdAt || data.created_at };
    } catch (error) {
      return { ...MOCK_CONTACTS[0], ...contactData, id: Math.random().toString(), created_at: new Date().toISOString() } as Contact;
    }
  }

  async updateContact(id: string, contactData: Partial<Contact>): Promise<Contact> {
    try {
      const data = await this.request<Contact>(`/contacts/${id}`, {
        method: 'PUT',
        body: JSON.stringify(contactData),
      });
      return { ...data, createdAt: data.createdAt || data.created_at };
    } catch (error) {
      return { ...MOCK_CONTACTS[0], ...contactData, id } as Contact;
    }
  }

  async importContacts(file: File, mappings?: Record<string, string>): Promise<{ message: string; success_count: number }> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (mappings) {
        formData.append('mappings', JSON.stringify(mappings));
      }
      return await this.request('/contacts/import', { method: 'POST', body: formData });
    } catch (error) {
      return { message: 'Imported successfully (Mock)', success_count: 50 };
    }
  }

  async deleteContact(id: string): Promise<{ message: string }> {
    try {
      return await this.request(`/contacts/${id}`, { method: 'DELETE' });
    } catch (error) {
      return { message: 'Deleted successfully (Mock)' };
    }
  }

  // WhatsApp API  
  async getWhatsAppSettings(sync = false): Promise<WhatsAppSettings> {
    try {
      const response = await this.request<any>(`/whatsapp/settings${sync ? '?sync=true' : ''}`);
      // Backend returns { success, data: {...} } — data can be null if not configured yet
      const setting = response?.data;
      if (!setting) {
        return { access_token: '', phone_number_id: '', business_account_id: '', status: 'disconnected' };
      }
      return setting;
    } catch (error) {
      return { access_token: '', phone_number_id: '', business_account_id: '', status: 'disconnected' };
    }
  }

  async saveWhatsAppSettings(settings: WhatsAppSettings): Promise<{ message: string; data?: WhatsAppSettings }> {
    try {
      return await this.request('/whatsapp/settings', {
        method: 'POST',
        body: JSON.stringify(settings)
      });
    } catch (error) {
      return { message: 'Settings saved (Mock)', data: settings };
    }
  }

  async saveAiSettings(openaiKey: string, companyPrompt: string): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      return await this.request('/whatsapp/settings/ai', {
        method: 'POST',
        body: JSON.stringify({
          openai_key: openaiKey,
          company_prompt: companyPrompt
        })
      });
    } catch (error: any) {
      return { success: false, message: error?.message || 'Failed to save AI settings' };
    }
  }

  async disconnectWhatsApp(): Promise<{ message: string }> {
    try {
      return await this.request('/whatsapp/settings', { method: 'DELETE' });
    } catch (error) {
      return { message: 'Disconnected (Mock)' };
    }
  }

  async testWhatsAppConnection(phone: string): Promise<{ message: string; success?: boolean }> {
    try {
      return await this.request('/whatsapp/test', {
        method: 'POST',
        body: JSON.stringify({ phone })
      });
    } catch (error) {
      return { message: 'Test message sent (Mock)', success: true };
    }
  }

  async sendWhatsAppTextMessage(phone: string, message: string): Promise<{ message: string; data?: any }> {
    try {
      return await this.request('/whatsapp/send-text', {
        method: 'POST',
        body: JSON.stringify({ phone, message })
      });
    } catch (error) {
      return { message: 'Message sent (Mock)', data: { id: 'msg_' + Math.random() } };
    }
  }

  // Conversations API
  async getConversations(options?: RequestInit): Promise<Conversation[]> {
    try {
      const response = await this.request<any>('/conversations', options);
      let conversationsArray: any[] = [];
      
      const data = response?.response || response?.data || response;

      if (Array.isArray(data)) {
        conversationsArray = data;
      } else if (Array.isArray(data?.conversations)) {
        conversationsArray = data.conversations;
      } else if (Array.isArray(data?.data)) {
        conversationsArray = data.data;
      }
      
      if (conversationsArray.length === 0) return [];

      return conversationsArray.map(c => {
        const rawConv = c as any;
        
        // Map contact from the direct object in response
        const contactData = rawConv.contact || {};
        const contact: Contact = {
          id: String(contactData.id || rawConv.contact_id || '0'),
          name: contactData.name || 'Unknown Contact',
          phone: contactData.phone || rawConv.wa_id || '',
          email: contactData.email || '',
          status: contactData.status || 'active',
          tags: Array.isArray(contactData.tags) ? contactData.tags.map((t: any) => typeof t === 'object' ? t.id : t) : [],
          created_at: contactData.created_at || contactData.createdAt,
          createdAt: contactData.createdAt || contactData.created_at
        };

        // Construct last message object from flat fields in response
        let lastMsgContentRaw = rawConv.last_message || '';
        const lastMsgContent = typeof lastMsgContentRaw === 'object' 
          ? (lastMsgContentRaw.body || JSON.stringify(lastMsgContentRaw)) 
          : String(lastMsgContentRaw || '');
          
        const lastMsgTimestamp = rawConv.last_message_at || rawConv.updated_at || rawConv.created_at || new Date().toISOString();

        // Determine last message sender
        let lastSender: 'user' | 'contact' = 'contact';
        if (rawConv.last_message_from_me === true || rawConv.last_message_from_me === 1 || 
            rawConv.last_message_direction === 'outbound' || rawConv.last_message_direction === 'outgoing') {
          lastSender = 'user';
        }

        return {
          id: String(rawConv.id),
          contact,
          unreadCount: typeof rawConv.unread_count === 'number' ? rawConv.unread_count : 0,
          isOnline: false,
          is_auto_reply_active: rawConv.is_auto_reply_active !== undefined ? !!rawConv.is_auto_reply_active : true,
          lastMessage: {
            id: `msg-${rawConv.id}`,
            sender: lastSender,
            type: 'text',
            content: lastMsgContent,
            timestamp: lastMsgTimestamp,
            status: 'read'
          }
        };
      });
    } catch (error) {
      return [];
    }
  }

  async getConversationMessages(id: string, options?: RequestInit): Promise<Message[]> {
    try {
      const response = await this.request<any>(`/conversations/${id}/messages`, options);
      let messagesArray: any[] = [];
      
      const data = response?.response || response?.data || response;

      if (Array.isArray(data)) {
        messagesArray = data;
      } else if (Array.isArray(data?.messages)) {
        messagesArray = data.messages;
      } else if (Array.isArray(data?.data)) {
        messagesArray = data.data;
      }
      
      if (messagesArray.length === 0) {
        return [];
      }

      return messagesArray.map(m => {
        const raw = m as any;
        const msgContent = m.content || raw.body || raw.message || raw.text || raw.msg || raw.caption || raw.payload || '';
        
        // Determine sender - common fields in CRM/Messaging APIs: from_me, direction, type
        let sender: 'user' | 'contact' = m.sender || (raw.from_me ? 'user' : 'contact');
        
        if (!m.sender) {
          const direction = String(raw.direction || '').toLowerCase();
          const typeAttr = String(raw.type || '').toLowerCase();
          
          if (raw.from_me === true || raw.from_me === 1 || raw.from_me === '1' || 
              direction === 'outbound' || direction === 'outgoing' || direction === 'sent' ||
              typeAttr === 'outgoing' || typeAttr === 'sent') {
            sender = 'user';
          } else {
            sender = 'contact';
          }
        }

        // Handle content that might be an object (like a WhatsApp API response)
        let finalContent = '';
        let mediaUrl = m.mediaUrl || raw.media_url || raw.url || raw.link || raw.file_url;
        let type = m.type || raw.type || 'text';
        let fileName = m.fileName || raw.file_name || raw.filename || raw.caption;

        if (typeof msgContent === 'object' && msgContent !== null) {
          // Try to extract body from various known WhatsApp/Meta formats
          finalContent = msgContent.body || 
                         msgContent.text?.body || 
                         (Array.isArray(msgContent.messages) ? 'Media/Message Sent' : JSON.stringify(msgContent));
          
          // Check for media in nested objects
          if (msgContent.image) {
            type = 'image';
            mediaUrl = msgContent.image.link || msgContent.image.url;
            fileName = msgContent.image.caption || fileName;
          } else if (msgContent.video) {
            type = 'video';
            mediaUrl = msgContent.video.link || msgContent.video.url;
            fileName = msgContent.video.caption || fileName;
          } else if (msgContent.audio) {
            type = 'audio';
            mediaUrl = msgContent.audio.link || msgContent.audio.url;
          } else if (msgContent.document) {
            type = 'file';
            mediaUrl = msgContent.document.link || msgContent.document.url;
            fileName = msgContent.document.filename || msgContent.document.caption || fileName;
          }
        } else {
          finalContent = String(msgContent || '');
        }

        // Final type normalization
        const typeStr = String(type).toLowerCase();
        let finalType: any = 'text';
        if (typeStr.includes('image')) finalType = 'image';
        else if (typeStr.includes('video')) finalType = 'video';
        else if (typeStr.includes('audio')) finalType = 'audio';
        else if (typeStr.includes('file') || typeStr.includes('document')) finalType = 'file';
        else if (mediaUrl) finalType = (finalContent === '' || finalContent === fileName) ? 'file' : 'text';

        return {
          ...m,
          sender,
          type: finalType,
          mediaUrl,
          fileName,
          timestamp: m.timestamp || raw.created_at || raw.updated_at || new Date().toISOString(),
          content: finalContent
        };
      });
    } catch (error) {
      console.error(`[CRM API] getConversationMessages failed for ${id}`, error);
      return [];
    }
  }

  async sendMessage(conversationId: string, content: string): Promise<Message> {
    const response = await this.request<any>('/messages/send', {
      method: 'POST',
      body: JSON.stringify({ 
        conversation_id: parseInt(conversationId),
        message: content 
      })
    });
    
    const data = response?.response || response?.data || response;
    const sentMsgId = data?.messages?.[0]?.id || Math.random().toString();
    
    return {
      id: sentMsgId,
      sender: 'user',
      type: 'text',
      content,
      timestamp: new Date().toISOString(),
      status: 'sent'
    };
  }

  async simulateIncomingMessage(conversationId: string, userMessage: string): Promise<any> {
    return await this.request<any>('/messages/simulate-incoming', {
      method: 'POST',
      body: JSON.stringify({ 
        conversation_id: parseInt(conversationId),
        user_message: userMessage
      })
    });
  }

  async sendMedia(conversationId: string, file: File): Promise<Message> {
    const formData = new FormData();
    formData.append('conversation_id', conversationId);
    formData.append('file', file);

    const response = await this.request<any>('/messages/send-media', {
      method: 'POST',
      body: formData
    });

    const data = response?.response || response?.data || response;
    const sentMsgId = data?.messages?.[0]?.id || Math.random().toString();
    
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    const isAudio = file.type.startsWith('audio/');
    
    let type: any = 'file';
    if (isImage) type = 'image';
    else if (isVideo) type = 'video';
    else if (isAudio) type = 'audio';

    return {
      id: sentMsgId,
      sender: 'user',
      type,
      content: file.name,
      timestamp: new Date().toISOString(),
      status: 'sent',
      mediaUrl: URL.createObjectURL(file),
      fileName: file.name
    };
  }

  async markAsRead(conversationId: string, options?: RequestInit): Promise<{ message: string; success?: boolean }> {
    try {
      return await this.request(`/conversations/${conversationId}/mark-read`, {
        method: 'POST',
        ...options
      });
    } catch (error) {
      console.warn(`[CRM API] markAsRead failed for ${conversationId}`, error);
      return { message: 'Marked as read (Mock)', success: true };
    }
  }

  async toggleConversationAutoReply(conversationId: string, isActive: boolean, options?: RequestInit): Promise<{ success: boolean; is_auto_reply_active: boolean }> {
    try {
      return await this.request(`/conversations/${conversationId}/toggle-auto-reply`, {
        method: 'POST',
        body: JSON.stringify({ is_active: isActive }),
        ...options
      });
    } catch (error: any) {
      console.warn(`[CRM API] toggleConversationAutoReply failed for ${conversationId}`, error);
      return { success: false, is_auto_reply_active: !isActive };
    }
  }

  // Campaigns API
  async createCampaign(payload: any): Promise<any> {
    return this.request<any>('/campaigns', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async getCampaignStats(): Promise<any> {
    return this.request<any>('/campaigns/dashboard', {
      method: 'GET',
    });
  }

  async getDashboardInsights(options?: RequestInit): Promise<any> {
    return this.request<any>('/dashboard/insights', {
      method: 'GET',
      ...options,
    });
  }

  async getCampaignsList(params?: { search?: string; type?: string; status?: string }): Promise<any> {
    let query = '';
    if (params) {
      const searchParams = new URLSearchParams();
      if (params.search) searchParams.append('search', params.search);
      if (params.type) searchParams.append('type', params.type);
      if (params.status) searchParams.append('status', params.status);
      const queryStr = searchParams.toString();
      if (queryStr) {
        query = `?${queryStr}`;
      }
    }
    return this.request<any>(`/campaign/list${query}`, {
      method: 'GET',
    });
  }

  async getCampaign(id: string | number): Promise<any> {
    return this.request<any>(`/campaigns/${id}`, {
      method: 'GET',
    });
  }

  async deleteCampaign(id: string | number): Promise<any> {
    return this.request<any>(`/campaigns/${id}`, {
      method: 'DELETE',
    });
  }

  // WhatsApp Cloud API Connection Methods
  async connectWhatsAppCloudAPI(data: {
    code: string;
    waba_id: string;
    phone_number_id: string;
  }): Promise<{ message: string; data?: any }> {
    try {
      return await this.request('/whatsapp/connect', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    } catch (error) {
      console.error('[CRM API] WhatsApp connection failed:', error);
      throw error;
    }
  }

  async registerWhatsAppNumber(pin: string): Promise<{ success: boolean; message: string }> {
    try {
      return await this.request('/whatsapp/register', {
        method: 'POST',
        body: JSON.stringify({ pin }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('[CRM API] WhatsApp number registration failed:', error);
      throw error;
    }
  }

  async getWhatsAppProfile(): Promise<{ success: boolean; data?: { description?: string; about?: string; profile_picture_url?: string } }> {
    try {
      return await this.request('/whatsapp/profile');
    } catch (error) {
      console.error('[CRM API] Failed to get WhatsApp profile:', error);
      throw error;
    }
  }

  async updateWhatsAppProfile(description: string, about?: string): Promise<{ success: boolean; message: string }> {
    try {
      return await this.request('/whatsapp/profile', {
        method: 'POST',
        body: JSON.stringify({ description, about })
      });
    } catch (error) {
      console.error('[CRM API] Failed to update WhatsApp profile:', error);
      throw error;
    }
  }

  async uploadWhatsAppLogo(file: File): Promise<{ success: boolean; message: string; profile_picture_url?: string }> {
    try {
      const formData = new FormData();
      formData.append('logo', file);
      return await this.request('/whatsapp/profile/logo', {
        method: 'POST',
        body: formData
      });
    } catch (error) {
      console.error('[CRM API] Failed to upload WhatsApp logo:', error);
      throw error;
    }
  }

  async getWhatsAppConnectionStatus(): Promise<{
    connected: boolean;
    data?: {
      waba_id: string;
      phone_number_id: string;
      business_name: string;
      phone_number: string;
      webhook_configured: boolean;
      number_verified: boolean;
      last_synced?: string;
    };
  }> {
    try {
      const settings = await this.getWhatsAppSettings();

      if (settings.status === 'connected') {
        return {
          connected: true,
          data: {
            waba_id: settings.business_account_id,
            phone_number_id: settings.phone_number_id,
            business_name: settings.business_name || 'Business Account',
            phone_number: settings.phone_number || 'Not Set',
            webhook_configured: settings.webhook_status === 'active',
            number_verified: true,
            last_synced: settings.last_synced
          }
        };
      }

      return { connected: false };
    } catch (error) {
      console.error('[CRM API] Failed to get WhatsApp connection status:', error);
      return { connected: false };
    }
  }

  async getWhatsAppDashboardStats(): Promise<{
    total_conversations: number;
    messages_sent_today: number;
    messages_received_today: number;
    active_chats: number;
  }> {
    try {
      return await this.request('/whatsapp/dashboard-stats');
    } catch (error) {
      // Return mock data on error
      return {
        total_conversations: 0,
        messages_sent_today: 0,
        messages_received_today: 0,
        active_chats: 0
      };
    }
  }

  // User Profile & Account Settings
  async updateProfile(payload: { name: string; business_name: string; avatar?: string }): Promise<any> {
    return this.request<any>('/user/profile', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  async changePassword(payload: any): Promise<any> {
    return this.request<any>('/user/password', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  async uploadAvatar(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('avatar', file);
    return this.request<any>('/user/avatar', {
      method: 'POST',
      body: formData
    });
  }

  async getNotifications(): Promise<any[]> {
    try {
      const response = await this.request<any>('/user/notifications');
      return response?.data || [];
    } catch (error) {
      console.warn('[CRM API] Failed to fetch notifications:', error);
      return [];
    }
  }

  // SaaS Super Admin Methods
  async getAdminStats(): Promise<any> {
    return this.request<any>('/admin/stats');
  }

  async getAdminTenants(params?: { search?: string; page?: number }): Promise<any> {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append('search', params.search);
    if (params?.page) searchParams.append('page', String(params.page));
    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return this.request<any>(`/admin/tenants${query}`);
  }

  async updateAdminTenant(id: string | number, payload: { name: string; plan: string }): Promise<any> {
    return this.request<any>(`/admin/tenants/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
  }

  async deleteAdminTenant(id: string | number): Promise<any> {
    return this.request<any>(`/admin/tenants/${id}`, {
      method: 'DELETE'
    });
  }

  async getAdminUsers(params?: { search?: string; page?: number }): Promise<any> {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append('search', params.search);
    if (params?.page) searchParams.append('page', String(params.page));
    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return this.request<any>(`/admin/users${query}`);
  }

  async updateAdminUser(id: string | number, payload: { name: string; role: string; status: string; password?: string }): Promise<any> {
    return this.request<any>(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
  }

  async deleteAdminUser(id: string | number): Promise<any> {
    return this.request<any>(`/admin/users/${id}`, {
      method: 'DELETE'
    });
  }

  async getAdminPlans(): Promise<any> {
    return this.request<any>('/admin/plans');
  }

  async getPublicPlans(): Promise<any> {
    return this.request<any>('/plans');
  }

  async createAdminPlan(payload: any): Promise<any> {
    return this.request<any>('/admin/plans', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  async updateAdminPlan(id: number, payload: any): Promise<any> {
    return this.request<any>(`/admin/plans/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
  }

  async deleteAdminPlan(id: number): Promise<any> {
    return this.request<any>(`/admin/plans/${id}`, {
      method: 'DELETE'
    });
  }

  async getAdminSettings(): Promise<any> {
    return this.request<any>('/admin/settings');
  }

  async updateAdminSettings(payload: any): Promise<any> {
    return this.request<any>('/admin/settings', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  async getSystemSettings(): Promise<any> {
    return this.request<any>('/admin/settings/system');
  }

  async getBranding(): Promise<any> {
    return this.request<any>('/branding');
  }

  async updateSystemSettings(formData: FormData): Promise<any> {
    return this.request<any>('/admin/settings/system', {
      method: 'POST',
      body: formData
    });
  }

  async testSmtpConnection(payload: any): Promise<any> {
    return this.request<any>('/admin/settings/system/test-email', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  async clearSystemCache(): Promise<any> {
    return this.request<any>('/admin/settings/system/clear-cache', {
      method: 'POST'
    });
  }

  async optimizeSystem(): Promise<any> {
    return this.request<any>('/admin/settings/system/optimize', {
      method: 'POST'
    });
  }

  async getSettingsAuditLogs(page: number = 1): Promise<any> {
    return this.request<any>(`/admin/settings/system/audit-logs?page=${page}`);
  }

  // ---- Automation API methods ----
  async getWorkflows(): Promise<any> {
    return this.request<any>('/automation/workflows');
  }

  async getWorkflow(id: number | string): Promise<any> {
    return this.request<any>(`/automation/workflows/${id}`);
  }

  async createWorkflow(payload: any): Promise<any> {
    return this.request<any>('/automation/workflows', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  async updateWorkflow(id: number | string, payload: any): Promise<any> {
    return this.request<any>(`/automation/workflows/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
  }

  async deleteWorkflow(id: number | string): Promise<any> {
    return this.request<any>(`/automation/workflows/${id}`, {
      method: 'DELETE'
    });
  }

  async saveWorkflowCanvas(id: number | string, nodes: any[], connections: any[]): Promise<any> {
    return this.request<any>(`/automation/workflows/${id}/canvas`, {
      method: 'POST',
      body: JSON.stringify({ nodes, connections })
    });
  }

  async getAutomationLogs(): Promise<any> {
    return this.request<any>('/automation/executions');
  }

  async getAutomationDashboardStats(): Promise<any> {
    return this.request<any>('/automation/dashboard-stats');
  }
}

export const crmApi = new CrmApiService();
