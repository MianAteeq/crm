import { apiClient } from './apiClient';
import {
  ReportingFilters,
  MarketingOverviewData,
  AdvertisingPerformanceData,
  SocialAnalyticsData,
  LeadGenerationData,
  TeamPerformanceData,
  SavedReport,
} from '../types/advancedReporting';

export const advancedReportingApi = {
  // 1. Marketing Overview
  async getOverview(filters?: ReportingFilters) {
    const res = await apiClient.get<{ success: boolean; data: MarketingOverviewData }>('/v1/reporting/overview', {
      params: filters,
    });
    return res.data;
  },

  // 2. Advertising Performance
  async getAdvertising(filters?: ReportingFilters) {
    const res = await apiClient.get<{ success: boolean; data: AdvertisingPerformanceData }>('/v1/reporting/advertising', {
      params: filters,
    });
    return res.data;
  },

  // 3. Social Media Analytics
  async getSocial(filters?: ReportingFilters) {
    const res = await apiClient.get<{ success: boolean; data: SocialAnalyticsData }>('/v1/reporting/social', {
      params: filters,
    });
    return res.data;
  },

  // 4. Lead Generation Reports
  async getLeads(filters?: ReportingFilters) {
    const res = await apiClient.get<{ success: boolean; data: LeadGenerationData }>('/v1/reporting/leads', {
      params: filters,
    });
    return res.data;
  },

  // 5. Team Performance
  async getTeam(filters?: ReportingFilters) {
    const res = await apiClient.get<{ success: boolean; data: TeamPerformanceData }>('/v1/reporting/team', {
      params: filters,
    });
    return res.data;
  },

  // 6. Saved Reports
  async getSavedReports() {
    const res = await apiClient.get<{ success: boolean; data: SavedReport[] }>('/v1/reporting/saved');
    return res.data;
  },

  async saveReport(data: {
    title: string;
    description?: string;
    report_type: 'overview' | 'ads' | 'social' | 'leads' | 'team';
    filters?: Record<string, any>;
    metrics?: string[];
  }) {
    const res = await apiClient.post<{ success: boolean; message: string; data: SavedReport }>('/v1/reporting/saved', data);
    return res.data;
  },

  async deleteSavedReport(id: number) {
    const res = await apiClient.delete<{ success: boolean; message: string }>(`/v1/reporting/saved/${id}`);
    return res.data;
  },

  // 7. CSV Export
  async exportCsv(type: 'overview' | 'ads' | 'social' | 'leads' | 'team', filters?: ReportingFilters) {
    const res = await apiClient.get('/v1/reporting/export', {
      params: { type, ...filters },
      responseType: 'blob',
      headers: {
        'X-Skip-Toast': 'true',
      },
    });

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `analytics_${type}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },
};

