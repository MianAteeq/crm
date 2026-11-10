import { apiClient } from './apiClient';
import { MediaAsset, MediaFolder, MediaStats, MediaFilters } from '../types/mediaLibrary';

export const mediaLibraryApi = {
  // Storage Stats
  async getStats() {
    const res = await apiClient.get<{ success: boolean; data: MediaStats }>('/v1/media/stats');
    return res.data;
  },

  // Folders
  async getFolders() {
    const res = await apiClient.get<{ success: boolean; data: MediaFolder[] }>('/v1/media/folders');
    return res.data;
  },

  async createFolder(data: { name: string; parent_id?: number | null; color?: string }) {
    const res = await apiClient.post<{ success: boolean; message: string; data: MediaFolder }>(
      '/v1/media/folders',
      data
    );
    return res.data;
  },

  async updateFolder(id: number, data: { name?: string; parent_id?: number | null; color?: string }) {
    const res = await apiClient.put<{ success: boolean; message: string; data: MediaFolder }>(
      `/v1/media/folders/${id}`,
      data
    );
    return res.data;
  },

  async deleteFolder(id: number) {
    const res = await apiClient.delete<{ success: boolean; message: string }>(`/v1/media/folders/${id}`);
    return res.data;
  },

  // Assets
  async getAssets(filters?: MediaFilters) {
    const res = await apiClient.get<{
      success: boolean;
      data: MediaAsset[];
      pagination: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
      };
    }>('/v1/media/assets', { params: filters });
    return res.data;
  },

  async uploadFiles(
    files: File[],
    folderId?: number | null,
    tags?: string[],
    onProgress?: (percent: number) => void
  ) {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files[]', file);
    });
    if (folderId) {
      formData.append('folder_id', folderId.toString());
    }
    if (tags && tags.length > 0) {
      tags.forEach((tag, idx) => {
        formData.append(`tags[${idx}]`, tag);
      });
    }

    const res = await apiClient.post<{ success: boolean; message: string; data: MediaAsset[] }>(
      '/v1/media/assets/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total && onProgress) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(percent);
          }
        },
      }
    );
    return res.data;
  },

  async updateAsset(id: number, data: { original_name?: string; media_folder_id?: number | null; tags?: string[] }) {
    const res = await apiClient.put<{ success: boolean; message: string; data: MediaAsset }>(
      `/v1/media/assets/${id}`,
      data
    );
    return res.data;
  },

  async deleteAsset(id: number) {
    const res = await apiClient.delete<{ success: boolean; message: string }>(`/v1/media/assets/${id}`);
    return res.data;
  },

  async bulkMove(assetIds: number[], folderId: number | null) {
    const res = await apiClient.post<{ success: boolean; message: string }>('/v1/media/assets/bulk-move', {
      asset_ids: assetIds,
      folder_id: folderId,
    });
    return res.data;
  },

  async bulkDelete(assetIds: number[]) {
    const res = await apiClient.post<{ success: boolean; message: string }>('/v1/media/assets/bulk-delete', {
      asset_ids: assetIds,
    });
    return res.data;
  },

  async recordAccess(id: number) {
    try {
      await apiClient.post(`/v1/media/assets/${id}/access`, {}, {
        headers: { 'X-Skip-Loader': 'true', 'X-Skip-Toast': 'true' },
      });
    } catch (e) {
      // ignore
    }
  },
};

