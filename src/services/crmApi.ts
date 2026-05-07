import { Contact, Tag, WhatsAppSettings } from '../types';
import { AuthService } from './authService';

const BASE_URL = 'https://crm.throbtech.com/api';

class CrmApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
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

    // Logging for debugging
    console.log(`[CRM API] ${config.method || 'GET'} ${url}`, {
      headers: { ...headers, Authorization: token ? 'Bearer [HIDDEN]' : undefined },
      body: isFormData ? '[FORM DATA]' : (config.body ? (typeof config.body === 'string' ? JSON.parse(config.body) : config.body) : undefined)
    });

    try {
      const response = await fetch(url, config);
      
      // Parse response
      const data = await response.json().catch(() => null);

      console.log(`[CRM API] Response ${response.status}`, data);

      if (!response.ok) {
        const errorMessage = data?.message || `API error: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
      }

      return data as T;
    } catch (error) {
      console.error(`[CRM API] Request failed`, error);
      if (error instanceof Error) throw error;
      throw new Error('An unexpected network error occurred');
    }
  }

  // Tags API
  async getTags(): Promise<Tag[]> {
    try {
      const data = await this.request<any>('/tags');
      // Handle array or wrapped response { data: [...] } or { tags: [...] }
      const tags = Array.isArray(data) ? data : (data?.data || data?.tags || []);
      return Array.isArray(tags) ? tags : [];
    } catch (error) {
      console.warn('[CRM API] getTags failed, falling back to mock data', error);
      // Fallback tags to keep UI functional despite backend error
      return [
        { id: '1', name: 'VIP', color: '#8b5cf6' },
        { id: '2', name: 'Eid Promo', color: '#f59e0b' },
        { id: '3', name: 'New Customer', color: '#10b981' },
        { id: '4', name: 'Wholesale', color: '#3b82f6' },
        { id: '5', name: 'Complaint', color: '#ef4444' },
        { id: '6', name: 'Inactive', color: '#64748b' }
      ];
    }
  }

  // Contacts API
  async getContacts(params?: { search?: string; status?: string; tag?: string; engagement?: string; lastTouchpoint?: string }): Promise<Contact[]> {
    let query = '';
    let endpoint = '/contacts';

    if (params) {
      const hasAdvancedFilters = params.status || params.tag || params.lastTouchpoint;
      
      if (hasAdvancedFilters) {
        endpoint = '/contacts/advance-search';
      }

      const searchParams = new URLSearchParams();
      if (params.search) searchParams.append('search', params.search);
      if (params.status) searchParams.append('status', params.status);
      
      // Handle tags[] array format as requested
      if (params.tag) {
        searchParams.append('tags[]', params.tag);
      }
      
      // Use last_touchpoint key as requested
      if (params.lastTouchpoint) {
        searchParams.append('last_touchpoint', params.lastTouchpoint);
      }
      
      query = `?${searchParams.toString()}`;
    }

    try {
      const response = await this.request<any>(`${endpoint}${query}`);
      
      let contactsArray: any[] = [];
      
      // Handle the various ways the API might return the data
      if (Array.isArray(response)) {
        contactsArray = response;
      } else if (response?.data) {
        if (Array.isArray(response.data)) {
          // Structure: { data: [...] }
          contactsArray = response.data;
        } else if (response.data?.data && Array.isArray(response.data.data)) {
          // Structure: { data: { data: [...] } } - This matches your screenshot
          contactsArray = response.data.data;
        }
      } else if (Array.isArray(response?.contacts)) {
        contactsArray = response.contacts;
      }

      return contactsArray.map(c => ({ 
        ...c, 
        tags: Array.isArray(c.tags) ? c.tags.map((t: any) => typeof t === 'object' ? t.id : t) : [] 
      }));
    } catch (error) {
      console.warn('[CRM API] getContacts failed', error);
      return [];
    }
  }

  async getContact(id: string): Promise<Contact> {
    const data = await this.request<Contact>(`/contacts/${id}`);
    const tags = Array.isArray(data.tags) ? data.tags.map((t: any) => typeof t === 'object' ? t.id : t) : [];
    return { ...data, tags };
  }

  async createContact(contactData: Partial<Contact>): Promise<Contact> {
    // Basic validation
    if (!contactData.name) throw new Error('Contact name is required');
    if (!contactData.phone) throw new Error('Contact phone is required');

    const data = await this.request<Contact>('/contacts', {
      method: 'POST',
      body: JSON.stringify(contactData),
    });
    const tags = Array.isArray(data.tags) ? data.tags.map((t: any) => typeof t === 'object' ? t.id : t) : [];
    return { ...data, tags };
  }

  async updateContact(id: string, contactData: Partial<Contact>): Promise<Contact> {
    const data = await this.request<Contact>(`/contacts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(contactData),
    });
    const tags = Array.isArray(data.tags) ? data.tags.map((t: any) => typeof t === 'object' ? t.id : t) : [];
    return { ...data, tags };
  }

  async importContacts(file: File): Promise<{ message: string; success_count: number }> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.request<{ message: string; success_count: number }>('/contacts/import', {
      method: 'POST',
      body: formData,
    });
  }

  async deleteContact(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/contacts/${id}`, {
      method: 'DELETE',
    });
  }
}

export const crmApi = new CrmApiService();
