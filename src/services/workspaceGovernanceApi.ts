import { apiClient } from './apiClient';
export const workspaceGovernanceApi = {
  overview: () => apiClient.get('/workspace/governance').then(r => r.data),
  audit: (params: Record<string, unknown> = {}) => apiClient.get('/workspace/audit', { params }).then(r => r.data),
  savePolicy: (data: any) => apiClient.put('/workspace/communication-policy', data).then(r => r.data),
  saveRole: (data: any) => apiClient.post('/workspace/roles', data).then(r => r.data),
  saveUser: (data: any) => apiClient.post('/workspace/users', data).then(r => r.data),
  deleteRole: (id: number) => apiClient.delete(`/workspace/roles/${id}`).then(r => r.data),
  deleteUser: (id: number) => apiClient.delete(`/workspace/users/${id}`).then(r => r.data),
  duplicateReviews: (status = 'pending') => apiClient.get('/workspace/duplicate-reviews', { params: { status } }).then(r => r.data),
  resolveDuplicate: (id: number, data: { action: string; contact_id?: number }) => apiClient.post(`/workspace/duplicate-reviews/${id}/resolve`, data).then(r => r.data),
  contactPreferences: (id: string | number) => apiClient.get(`/contacts/${id}/communication-preferences`).then(r => r.data),
  saveContactPreferences: (id: string | number, data: any) => apiClient.put(`/contacts/${id}/communication-preferences`, data).then(r => r.data),
  exportAudit: () => apiClient.get('/workspace/audit/export', { responseType: 'blob' }).then(r => r.data),
};
