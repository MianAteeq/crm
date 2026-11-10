import { apiClient } from './apiClient';
import {
  BuilderPage,
  BuilderForm,
  BuilderSubmission,
  BuilderTemplate,
  DashboardMetrics,
} from '../types/pageBuilder';

export const pageBuilderApi = {
  // Metrics / Dashboard
  async getMetrics() {
    const res = await apiClient.get<{ success: boolean; data: DashboardMetrics }>('/v1/builder/metrics');
    return res.data;
  },

  // Pages CRUD
  async getPages(params?: { category?: string; status?: string; search?: string }) {
    const res = await apiClient.get<{ success: boolean; data: BuilderPage[] }>('/v1/builder/pages', { params });
    return res.data;
  },

  async getPage(id: number) {
    const res = await apiClient.get<{ success: boolean; data: BuilderPage }>(`/v1/builder/pages/${id}`);
    return res.data;
  },

  async createPage(payload: Partial<BuilderPage>) {
    const res = await apiClient.post<{ success: boolean; data: BuilderPage }>('/v1/builder/pages', payload);
    return res.data;
  },

  async updatePage(id: number, payload: Partial<BuilderPage>) {
    const res = await apiClient.put<{ success: boolean; data: BuilderPage }>(`/v1/builder/pages/${id}`, payload);
    return res.data;
  },

  async deletePage(id: number) {
    const res = await apiClient.delete<{ success: boolean; message: string }>(`/v1/builder/pages/${id}`);
    return res.data;
  },

  async duplicatePage(id: number) {
    const res = await apiClient.post<{ success: boolean; data: BuilderPage }>(`/v1/builder/pages/${id}/duplicate`);
    return res.data;
  },

  async togglePublishPage(id: number) {
    const res = await apiClient.post<{ success: boolean; data: BuilderPage }>(`/v1/builder/pages/${id}/toggle-publish`);
    return res.data;
  },

  // Forms CRUD
  async getForms(params?: { form_type?: string; status?: string; page_id?: number; search?: string }) {
    const res = await apiClient.get<{ success: boolean; data: BuilderForm[] }>('/v1/builder/forms', { params });
    return res.data;
  },

  async getForm(id: number) {
    const res = await apiClient.get<{ success: boolean; data: BuilderForm }>(`/v1/builder/forms/${id}`);
    return res.data;
  },

  async createForm(payload: Partial<BuilderForm>) {
    const res = await apiClient.post<{ success: boolean; data: BuilderForm }>('/v1/builder/forms', payload);
    return res.data;
  },

  async updateForm(id: number, payload: Partial<BuilderForm>) {
    const res = await apiClient.put<{ success: boolean; data: BuilderForm }>(`/v1/builder/forms/${id}`, payload);
    return res.data;
  },

  async deleteForm(id: number) {
    const res = await apiClient.delete<{ success: boolean; message: string }>(`/v1/builder/forms/${id}`);
    return res.data;
  },

  async duplicateForm(id: number) {
    const res = await apiClient.post<{ success: boolean; data: BuilderForm }>(`/v1/builder/forms/${id}/duplicate`);
    return res.data;
  },

  async togglePublishForm(id: number) {
    const res = await apiClient.post<{ success: boolean; data: BuilderForm }>(`/v1/builder/forms/${id}/toggle-publish`);
    return res.data;
  },

  // Submissions
  async getSubmissions(params?: { form_id?: number; page_id?: number; status?: string; search?: string }) {
    const res = await apiClient.get<{
      success: boolean;
      data: {
        data: BuilderSubmission[];
        current_page: number;
        last_page: number;
        total: number;
      };
    }>('/v1/builder/submissions', { params });
    return res.data;
  },

  async getSubmission(id: number) {
    const res = await apiClient.get<{ success: boolean; data: BuilderSubmission }>(`/v1/builder/submissions/${id}`);
    return res.data;
  },

  async deleteSubmission(id: number) {
    const res = await apiClient.delete<{ success: boolean; message: string }>(`/v1/builder/submissions/${id}`);
    return res.data;
  },

  async exportSubmissionsCsv(params?: { form_id?: number; page_id?: number }) {
    const res = await apiClient.get('/v1/builder/submissions/export/csv', {
      params,
      responseType: 'blob',
    });
    return res.data;
  },

  // Templates
  async getTemplates(params?: { template_type?: string; category?: string }) {
    const res = await apiClient.get<{ success: boolean; data: BuilderTemplate[] }>('/v1/builder/templates', { params });
    return res.data;
  },

  async applyTemplate(templateId: number, targetType: 'page' | 'form') {
    const res = await apiClient.post<{ success: boolean; data: BuilderPage | BuilderForm }>(
      `/v1/builder/templates/${templateId}/apply`,
      { target_type: targetType }
    );
    return res.data;
  },

  // Public Endpoints
  async getPublicPage(slug: string, preview = false) {
    const query = preview ? '?preview=true' : '';
    const res = await apiClient.get<{ success: boolean; data: BuilderPage }>(`/v1/public/builder/page/${slug}${query}`);
    return res.data;
  },

  async getPublicForm(slug: string, preview = false) {
    const query = preview ? '?preview=true' : '';
    const res = await apiClient.get<{ success: boolean; data: BuilderForm }>(`/v1/public/builder/form/${slug}${query}`);
    return res.data;
  },

  async submitPublicForm(slug: string, payload: Record<string, any>) {
    const res = await apiClient.post<{
      success: boolean;
      message: string;
      data: {
        submission_id: number;
        contact_id?: number;
        redirect_url?: string;
        thank_you_message?: string;
      };
    }>(`/v1/public/builder/submit/${slug}`, payload);
    return res.data;
  },
};
