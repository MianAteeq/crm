import { WhatsAppTemplate } from '../types/whatsapp';
import { AuthService } from './authService';

const BASE_URL = 'https://crm.throbtech.com/api';

/**
 * Gets the standard headers for WhatsApp API requests.
 */
const getHeaders = () => {
  const token = AuthService.getToken();
  const tenantId = AuthService.getTenantId();
  const headers: Record<string, string> = {
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (tenantId) {
    headers['X-Tenant-Id'] = tenantId;
  }
  
  return headers;
};

class WhatsAppApiService {
  /**
   * Internal request helper to handle common logic and auth errors.
   */
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        ...getHeaders(),
        ...options.headers,
      },
    });

    if (response.status === 401) {
      const token = AuthService.getToken();
      console.error(`[WhatsApp API] Unauthorized request (401) to ${endpoint}. Token exists: ${!!token}`);
      if (token) {
        AuthService.removeToken();
        if (window.location.pathname !== '/' && !window.location.pathname.startsWith('/auth')) {
          console.warn('[WhatsApp API] Redirecting to login due to 401');
          window.location.href = '/';
        }
      }
      throw new Error('Unauthenticated');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API error: ${response.status}`);
    }

    return await response.json();
  }

  /**
   * Fetches all WhatsApp templates from the CRM.
   */
  async fetchTemplates(): Promise<WhatsAppTemplate[]> {
    try {
      const data = await this.request<any>('/whatsapp/templates');
      console.log('WhatsApp Templates API raw response:', data);
      
      // Handle various response formats from the CRM
      let rawTemplates: any[] = [];
      if (Array.isArray(data)) {
        rawTemplates = data;
      } else if (data && typeof data === 'object') {
        if (Array.isArray(data.templates)) rawTemplates = data.templates;
        else if (Array.isArray(data.data)) rawTemplates = data.data;
        else if (data.data && typeof data.data === 'object' && Array.isArray(data.data.data)) {
          rawTemplates = data.data.data;
        }
      }
      
      // Map CRM components-based structure to our internal WhatsAppTemplate type
      return rawTemplates.map((item: any) => {
        // If it already matches our format, return it
        if (item.body && item.header) return item;
        
        // Otherwise, transform from CRM components format
        const components = item.components || [];
        const header = components.find((c: any) => c.type === 'HEADER');
        const body = components.find((c: any) => c.type === 'BODY');
        const footer = components.find((c: any) => c.type === 'FOOTER');
        const buttonsComp = components.find((c: any) => c.type === 'BUTTONS');

        return {
          id: item.id?.toString() || item.template_id || Math.random().toString(),
          name: item.name || '',
          category: item.category || 'MARKETING',
          language: item.language || 'en',
          status: item.status || 'PENDING',
          updatedAt: item.updated_at || item.created_at || new Date().toISOString(),
          header: {
            type: (header?.format || 'NONE') as any,
            text: header?.text,
          },
          body: {
            text: body?.text || '',
            variables: [], 
          },
          footer: footer ? { text: footer.text } : undefined,
          buttons: (buttonsComp?.buttons || []).map((b: any, idx: number) => ({
            id: `b-${idx}`,
            type: b.type === 'PHONE_NUMBER' ? 'CALL' : (b.type === 'URL' ? 'URL' : 'QUICK_REPLY'),
            text: b.text,
            url: b.url,
            phoneNumber: b.phone_number
          }))
        } as WhatsAppTemplate;
      });
    } catch (error) {
      console.error('Error fetching WhatsApp templates:', error);
      throw error;
    }
  }

  /**
   * Triggers a sync of templates from Meta.
   */
  async syncTemplatesFromMeta(): Promise<{ message: string; count?: number }> {
    return this.request('/whatsapp/templates/sync');
  }

  /**
   * Deletes a template from the CRM.
   */
  async deleteTemplate(id: string): Promise<{ success: boolean; message?: string }> {
    return this.request(`/whatsapp/templates/${id}`, { method: 'DELETE' });
  }

  /**
   * Creates a new template in the CRM.
   */
  async createTemplate(templateData: any): Promise<WhatsAppTemplate> {
    return this.request('/whatsapp/templates/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(templateData),
    });
  }

  /**
   * Uploads media to the CRM for use in templates.
   */
  async uploadMedia(file: File): Promise<{ media_handle?: string; header_handle?: string; id?: string; success?: boolean }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('file_name', file.name);
    formData.append('file_type', file.type);
    formData.append('file_length', file.size.toString());

    return this.request('/whatsapp/templates/upload-media', {
      method: 'POST',
      body: formData,
    });
  }
}

export const whatsappApi = new WhatsAppApiService();
