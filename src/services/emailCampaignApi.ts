import { apiClient } from './apiClient';
import { 
  EmailCampaign, 
  EmailTemplate, 
  EmailSetting, 
  AudienceEstimate, 
  CampaignReport, 
  ContactEmailActivity,
  AudienceFilter,
  EmailSendingDomain,
  EmailSendingDomainSummary
} from '../types/emailCampaign';

export const emailCampaignApi = {
  // Campaigns
  async getCampaigns(params?: { status?: string; search?: string; page?: number; per_page?: number }) {
    const res = await apiClient.get<{ success: boolean; data: EmailCampaign[]; meta: any }>('/email/campaigns', { params });
    return res.data;
  },

  async getCampaign(id: number) {
    const res = await apiClient.get<{ success: boolean; data: EmailCampaign }>(`/email/campaigns/${id}`);
    return res.data;
  },

  async createCampaign(data: Partial<EmailCampaign> & { launch_now?: boolean }) {
    const res = await apiClient.post<{ success: boolean; message: string; data: EmailCampaign }>('/email/campaigns', data);
    return res.data;
  },

  async updateCampaign(id: number, data: Partial<EmailCampaign>) {
    const res = await apiClient.put<{ success: boolean; message: string; data: EmailCampaign }>(`/email/campaigns/${id}`, data);
    return res.data;
  },

  async deleteCampaign(id: number) {
    const res = await apiClient.delete<{ success: boolean; message: string }>(`/email/campaigns/${id}`);
    return res.data;
  },

  async duplicateCampaign(id: number) {
    const res = await apiClient.post<{ success: boolean; message: string; data: EmailCampaign }>(`/email/campaigns/${id}/duplicate`);
    return res.data;
  },

  async estimateAudience(filters: AudienceFilter) {
    const res = await apiClient.post<{ success: boolean; data: AudienceEstimate }>('/email/campaigns/estimate-audience', filters, {
      headers: { 'X-Skip-Toast': 'true' }
    });
    return res.data;
  },

  async sendTestEmail(data: {
    test_email: string;
    from_name?: string;
    from_email?: string;
    reply_to?: string;
    subject: string;
    html_body: string;
    text_body?: string;
  }) {
    const res = await apiClient.post<{ success: boolean; message: string }>('/email/campaigns/send-test', data);
    return res.data;
  },

  async launchCampaign(id: number, options?: { send_now?: boolean; scheduled_at?: string }) {
    const res = await apiClient.post<{ success: boolean; message: string; data: EmailCampaign }>(`/email/campaigns/${id}/launch`, options);
    return res.data;
  },

  async pauseCampaign(id: number) {
    const res = await apiClient.post<{ success: boolean; message: string; data: EmailCampaign }>(`/email/campaigns/${id}/pause`);
    return res.data;
  },

  async resumeCampaign(id: number) {
    const res = await apiClient.post<{ success: boolean; message: string; data: EmailCampaign }>(`/email/campaigns/${id}/resume`);
    return res.data;
  },

  async cancelCampaign(id: number) {
    const res = await apiClient.post<{ success: boolean; message: string; data: EmailCampaign }>(`/email/campaigns/${id}/cancel`);
    return res.data;
  },

  async retryFailed(id: number) {
    const res = await apiClient.post<{ success: boolean; message: string; data: EmailCampaign }>(`/email/campaigns/${id}/retry-failed`);
    return res.data;
  },

  async getCampaignReport(id: number, params?: { recipient_status?: string; page?: number; per_page?: number }) {
    const res = await apiClient.get<{ success: boolean; data: CampaignReport }>(`/email/campaigns/${id}/report`, { params });
    return res.data;
  },

  // Templates
  async getTemplates(params?: { category?: string; search?: string; page?: number }) {
    const res = await apiClient.get<{ success: boolean; data: EmailTemplate[]; meta: any }>('/email/templates', { params });
    return res.data;
  },

  async getTemplate(id: number) {
    const res = await apiClient.get<{ success: boolean; data: EmailTemplate }>(`/email/templates/${id}`);
    return res.data;
  },

  async createTemplate(data: Partial<EmailTemplate>) {
    const res = await apiClient.post<{ success: boolean; message: string; data: EmailTemplate }>('/email/templates', data);
    return res.data;
  },

  async updateTemplate(id: number, data: Partial<EmailTemplate>) {
    const res = await apiClient.put<{ success: boolean; message: string; data: EmailTemplate }>(`/email/templates/${id}`, data);
    return res.data;
  },

  async deleteTemplate(id: number) {
    const res = await apiClient.delete<{ success: boolean; message: string }>(`/email/templates/${id}`);
    return res.data;
  },

  async duplicateTemplate(id: number) {
    const res = await apiClient.post<{ success: boolean; message: string; data: EmailTemplate }>(`/email/templates/${id}/duplicate`);
    return res.data;
  },

  // Settings
  async getSettings() {
    const res = await apiClient.get<{ success: boolean; data: EmailSetting }>('/email/settings', {
      headers: { 'X-Skip-Toast': 'true' }
    });
    return res.data;
  },

  async saveSettings(data: EmailSetting) {
    const res = await apiClient.post<{ success: boolean; message: string; data: EmailSetting }>('/email/settings', data);
    return res.data;
  },

  async testConnection(data: Partial<EmailSetting> & { test_email?: string }) {
    const res = await apiClient.post<{ success: boolean; message: string }>('/email/settings/test', data);
    return res.data;
  },

  // AI Email Generator (DeepSeek)
  async generateAiEmail(data: {
    topic: string;
    purpose?: string;
    tone?: string;
    target_audience?: string;
    call_to_action?: string;
    api_key?: string;
  }) {
    const res = await apiClient.post<{
      success: boolean;
      message: string;
      data: { subject: string; html_body: string; text_body?: string };
      needs_key?: boolean;
    }>('/email/ai/generate', data);
    return res.data;
  },

  // Contact Email Activities
  async getContactEmailActivities(contactId: string | number) {
    const res = await apiClient.get<{ success: boolean; data: ContactEmailActivity[] }>(`/contacts/${contactId}/email-activities`, {
      headers: { 'X-Skip-Toast': 'true' }
    });
    return res.data;
  },

  // Sending Domains (Mailtrap Multi-tenant Verification)
  async getSendingDomains() {
    const res = await apiClient.get<{
      success: boolean;
      data: EmailSendingDomain[];
      summary: EmailSendingDomainSummary;
    }>('/email/sending-domains', {
      headers: { 'X-Skip-Toast': 'true' }
    });
    return res.data;
  },

  async addSendingDomain(domain: string) {
    const res = await apiClient.post<{
      success: boolean;
      message: string;
      data: EmailSendingDomain;
    }>('/email/sending-domains', { domain });
    return res.data;
  },

  async getSendingDomain(id: number) {
    const res = await apiClient.get<{
      success: boolean;
      data: EmailSendingDomain;
    }>(`/email/sending-domains/${id}`);
    return res.data;
  },

  async verifySendingDomain(id: number) {
    const res = await apiClient.post<{
      success: boolean;
      message: string;
      data: EmailSendingDomain;
      dns_verified: boolean;
    }>(`/email/sending-domains/${id}/verify`);
    return res.data;
  },

  async deleteSendingDomain(id: number) {
    const res = await apiClient.delete<{
      success: boolean;
      message: string;
    }>(`/email/sending-domains/${id}`);
    return res.data;
  },

  async getDomainLogs(id: number) {
    const res = await apiClient.get<{
      success: boolean;
      data: any[];
      meta: any;
    }>(`/email/sending-domains/${id}/logs`);
    return res.data;
  },

  async getAdminSendingDomains(params?: { status?: string; search?: string; page?: number; per_page?: number }) {
    const res = await apiClient.get<{
      success: boolean;
      data: any[];
      meta: any;
    }>('/admin/email/sending-domains', { params });
    return res.data;
  },
};
