import { apiClient } from './apiClient';
import {
  MetaLeadAccount,
  MetaLeadForm,
  MetaLeadSubmission,
  LeadAdsMetrics,
} from '../types/metaLeadAds';

export const metaLeadAdsApi = {
  // Accounts & Permissions
  async getAccounts() {
    const res = await apiClient.get<{ success: boolean; data: MetaLeadAccount[] }>('/v1/social/leads/accounts');
    return res.data;
  },

  async getOAuthUrl() {
    const res = await apiClient.get<{ success: boolean; data: { authorization_url: string } }>('/v1/social/leads/oauth-url');
    return res.data;
  },

  // Metrics
  async getMetrics() {
    const res = await apiClient.get<{ success: boolean; data: LeadAdsMetrics }>('/v1/social/leads/metrics');
    return res.data;
  },

  // Forms
  async getForms(params?: { social_account_id?: number; is_active?: boolean; search?: string }) {
    const res = await apiClient.get<{ success: boolean; data: MetaLeadForm[] }>('/v1/social/leads/forms', { params });
    return res.data;
  },

  async syncRemoteForms(socialAccountId: number) {
    const res = await apiClient.post<{ success: boolean; message: string; data: MetaLeadForm[] }>(
      '/v1/social/leads/forms/sync',
      { social_account_id: socialAccountId }
    );
    return res.data;
  },

  async getForm(id: number) {
    const res = await apiClient.get<{ success: boolean; data: MetaLeadForm }>(`/v1/social/leads/forms/${id}`);
    return res.data;
  },

  async updateForm(id: number, data: Partial<MetaLeadForm>) {
    const res = await apiClient.put<{ success: boolean; message: string; data: MetaLeadForm }>(
      `/v1/social/leads/forms/${id}`,
      data
    );
    return res.data;
  },

  async importHistoricalLeads(id: number, limit: number = 50) {
    const res = await apiClient.post<{
      success: boolean;
      message: string;
      data: { total_fetched: number; imported: number; duplicates: number; failed: number };
    }>(`/v1/social/leads/forms/${id}/import`, { limit });
    return res.data;
  },

  // Submissions Audit Log
  async getSubmissions(params?: {
    meta_lead_form_id?: number;
    sync_status?: string;
    platform?: string;
    search?: string;
    page?: number;
    per_page?: number;
  }) {
    const res = await apiClient.get<{
      success: boolean;
      data: {
        data: MetaLeadSubmission[];
        current_page: number;
        last_page: number;
        total: number;
        per_page: number;
      };
    }>('/v1/social/leads/submissions', { params });
    return res.data;
  },

  async retrySubmission(id: number) {
    const res = await apiClient.post<{ success: boolean; message: string; data: MetaLeadSubmission }>(
      `/v1/social/leads/submissions/${id}/retry`
    );
    return res.data;
  },
};

