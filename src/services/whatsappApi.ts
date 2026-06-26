import { WhatsAppTemplate } from '../types/whatsapp';
import { AuthService } from './authService';

// Dev  → /api  (proxied by Vite → http://127.0.0.1:8000)
// Prod → VITE_CRM_API_URL/api
const BASE_URL = import.meta.env.DEV
  ? '/api'
  : `${import.meta.env.VITE_CRM_API_URL ?? 'https://crm.throbtech.com'}/api`;


/**
 * Gets the standard headers for WhatsApp API requests.
 */
const getHeaders = () => {
  const token = AuthService.getToken();
  const tenantId = AuthService.getTenantId();
  const headers: Record<string, string> = {
    'Accept': 'application/json',
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
    const isFormData = options.body instanceof FormData;

    const response = await fetch(url, {
      ...options,
      headers: {
        ...getHeaders(),
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
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

    const text = await response.text();
    try {
      return text ? JSON.parse(text) : {} as T;
    } catch (e) {
      return {} as T;
    }
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
        // Transform and normalize structure
        const components = item.components || [];
        const header = components.find((c: any) => c.type?.toUpperCase() === 'HEADER') || item.header;
        const body = components.find((c: any) => c.type?.toUpperCase() === 'BODY') || item.body;
        const footer = components.find((c: any) => c.type?.toUpperCase() === 'FOOTER') || item.footer;
        const buttonsComp = components.find((c: any) => c.type?.toUpperCase() === 'BUTTONS') || { buttons: item.buttons };

        // Use internal ID if available, as requested ("delete pass not template_id pass id")
        const id = (item.id || item.template_id || Math.random()).toString();

        return {
          id,
          name: item.name || '',
          category: item.category || 'MARKETING',
          language: item.language || 'en',
          status: item.status || 'PENDING',
          updatedAt: item.updated_at || item.created_at || new Date().toISOString(),
          header: {
            type: (header?.format || header?.type || 'NONE').toUpperCase() as any,
            text: header?.text,
            variables: header?.example?.header_text || header?.variables || [],
            mediaHandle: header?.example?.header_handle?.[0] || item.media_handle || item.header_handle,
            mediaUrl: item.media_url || item.header_url || (header?.example?.header_handle?.[0]?.startsWith('http') ? header.example.header_handle[0] : undefined),
            fileName: header?.example?.header_handle?.[0]?.split('/').pop() || 'document.pdf',
            mediaPath: item.media_path || item.header_path,
            mediaType: item.media_type || (header?.format || header?.type || 'NONE').toUpperCase()
          },
          body: {
            text: body?.text || '',
            variables: body?.variables || (body?.example?.body_text?.[0]) || [], 
          },
          footer: footer ? { text: footer.text } : undefined,
          buttons: (buttonsComp?.buttons || []).map((b: any, idx: number) => ({
            id: b.id || `b-${idx}`,
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
    console.log(`[WhatsApp API] Deleting template with ID: ${id}`);
    return this.request(`/whatsapp/templates/${id}`, { method: 'DELETE' });
  }

  /**
   * Creates a new template in the CRM.
   */
  async createTemplate(templateData: any): Promise<WhatsAppTemplate> {
    return this.request('/whatsapp/templates/create', {
      method: 'POST',
      body: JSON.stringify(templateData),
    });
  }

  /**
   * Updates an existing template in the CRM.
   */
  async updateTemplate(id: string, templateData: any): Promise<WhatsAppTemplate> {
    return this.request(`/whatsapp/templates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(templateData),
    });
  }

  /**
   * Uploads media to the CRM for use in templates.
   */
  async uploadMedia(file: File): Promise<{ 
    media_handle?: string; 
    header_handle?: string; 
    id?: string; 
    success?: boolean;
    media_path?: string;
    media_type?: string;
    media_url?: string;
  }> {
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

  /**
   * Fetches performance insights for WhatsApp templates.
   */
  async fetchPerformanceInsights(days: number = 7, templateId?: string): Promise<any> {
    let url = `/whatsapp/performance-insights?days=${days}`;
    if (templateId) {
      url += `&template_id=${templateId}`;
    }
    return this.request(url);
  }

  /**
   * Sends a WhatsApp template to a specific phone number.
   */
  async sendTemplate(templateId: string, phone: string, components: any[] = [], parameters: string[] = []): Promise<any> {
    return this.request('/whatsapp/templates/send', {
      method: 'POST',
      body: JSON.stringify({
        template_id: templateId,
        phone,
        components,
        parameters
      }),
    });
  }
}

export const whatsappApi = new WhatsAppApiService();
