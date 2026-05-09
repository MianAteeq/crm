import { Contact, Tag, WhatsAppSettings, Conversation, Message } from '../types';
import { AuthService } from './authService';

const BASE_URL = '/api/proxy';

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
    // For now, always return mock data if available, or try real request but fallback
    const url = `${BASE_URL}${endpoint}`;
    const token = AuthService.getToken();

    const isFormData = options.body instanceof FormData;

    const headers: HeadersInit = {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      'Accept': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers,
    };

    const config = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || `API error: ${response.status}`);
      }

      return data as T;
    } catch (error) {
      console.warn(`[CRM API] Request to ${endpoint} failed, returns mock instead`, error);
      throw error; // Let the specific method handle the fallback
    }
  }

  // Tags API
  async getTags(): Promise<Tag[]> {
    try {
      const data = await this.request<any>('/tags');
      const tags = Array.isArray(data) ? data : (data?.data || data?.tags || []);
      return (Array.isArray(tags) && tags.length > 0) ? tags : MOCK_TAGS;
    } catch (error) {
      return MOCK_TAGS;
    }
  }

  // Contacts API
  async getContacts(params?: { search?: string; status?: string; tag?: string; engagement?: string; lastTouchpoint?: string }): Promise<Contact[]> {
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
        query = `?${searchParams.toString()}`;
      }

      const response = await this.request<any>(`${endpoint}${query}`);
      
      let contactsArray: any[] = [];
      if (Array.isArray(response)) {
        contactsArray = response;
      } else if (response?.data) {
        contactsArray = Array.isArray(response.data) ? response.data : (response.data?.data || []);
      } else if (Array.isArray(response?.contacts)) {
        contactsArray = response.contacts;
      }

      if (contactsArray.length === 0 && !params?.search && !params?.tag && !params?.status && !params?.lastTouchpoint) return MOCK_CONTACTS;

      return contactsArray.map(c => ({ 
        ...c,
        createdAt: c.createdAt || c.created_at,
        last_message: c.last_message || (c.last_interaction?.body) || (c.last_interaction?.message),
        tags: Array.isArray(c.tags) ? c.tags.map((t: any) => typeof t === 'object' ? t.id : t) : [] 
      }));
    } catch (error) {
      return MOCK_CONTACTS;
    }
  }

  async getContact(id: string): Promise<Contact> {
    try {
      const data = await this.request<Contact>(`/contacts/${id}`);
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

  async importContacts(file: File): Promise<{ message: string; success_count: number }> {
    try {
      const formData = new FormData();
      formData.append('file', file);
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
  async getWhatsAppSettings(): Promise<WhatsAppSettings> {
    try {
      const response = await this.request<any>('/whatsapp/settings');
      return response.data || response;
    } catch (error) {
      return {
        access_token: 'mock_token',
        phone_number_id: '123456789',
        business_account_id: '987654321',
        status: 'connected',
        business_name: 'Mock Business',
        phone_number: '+923000000000'
      };
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
  async getConversations(): Promise<Conversation[]> {
    try {
      const response = await this.request<any>('/conversations');
      let conversationsArray: any[] = [];
      
      const data = response?.response || response?.data || response;

      if (Array.isArray(data)) {
        conversationsArray = data;
      } else if (Array.isArray(data?.conversations)) {
        conversationsArray = data.conversations;
      } else if (Array.isArray(data?.data)) {
        conversationsArray = data.data;
      }
      
      if (conversationsArray.length === 0) return MOCK_CONVERSATIONS;

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
      return MOCK_CONVERSATIONS;
    }
  }

  async getConversationMessages(id: string): Promise<Message[]> {
    try {
      const response = await this.request<any>(`/conversations/${id}/messages`);
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

  async markAsRead(conversationId: string): Promise<{ message: string; success?: boolean }> {
    try {
      return await this.request(`/conversations/${conversationId}/mark-read`, {
        method: 'POST'
      });
    } catch (error) {
      console.warn(`[CRM API] markAsRead failed for ${conversationId}`, error);
      return { message: 'Marked as read (Mock)', success: true };
    }
  }
}

export const crmApi = new CrmApiService();
