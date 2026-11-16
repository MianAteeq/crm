import { apiClient } from './apiClient';

export interface BusinessProfile {
  name: string;
  legal_name: string;
  logo_url: string | null;
  address_line_1: string;
  address_line_2: string | null;
  city: string;
  region: string | null;
  postal_code: string | null;
  country_code: string;
  currency_code: string;
  timezone: string;
  customer_timezone_policy: 'business_only' | 'customer_when_available';
  timezone_precedence: string;
  currency_policy: string;
}

export const businessProfileApi = {
  async get(): Promise<BusinessProfile> {
    const response = await apiClient.get<{ success: boolean; data: BusinessProfile }>('/settings/business-profile');
    return response.data.data;
  },

  async update(formData: FormData): Promise<{ data: BusinessProfile; currency_change_notice: string | null }> {
    const response = await apiClient.post<{
      success: boolean;
      data: BusinessProfile;
      currency_change_notice: string | null;
    }>('/settings/business-profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};
