export interface MediaFolder {
  id: number;
  tenant_id: number;
  parent_id: number | null;
  name: string;
  slug: string;
  color?: string | null;
  assets_count?: number;
  children?: MediaFolder[];
  created_at: string;
  updated_at: string;
}

export interface MediaAssetReference {
  id: number;
  media_asset_id: number;
  reference_type: string;
  reference_id: string;
  created_at: string;
}

export interface MediaAsset {
  id: number;
  tenant_id: number;
  user_id: number | null;
  media_folder_id: number | null;
  filename: string;
  original_name: string;
  disk: string;
  file_path: string;
  url: string;
  mime_type: string;
  file_type: 'image' | 'video' | 'document' | 'audio' | 'other';
  file_size: number;
  file_hash?: string;
  width?: number | null;
  height?: number | null;
  duration?: number | null;
  metadata?: Record<string, any> | null;
  tags?: string[] | null;
  access_count: number;
  last_accessed_at?: string | null;
  folder?: MediaFolder | null;
  references?: MediaAssetReference[];
  created_at: string;
  updated_at: string;
}

export interface MediaStats {
  total_files: number;
  total_storage_used: number; // in bytes
  total_storage_quota: number; // in bytes
  available_storage: number;
  usage_percentage: number;
  images_count: number;
  videos_count: number;
  documents_count: number;
  audio_count: number;
  recent_uploads: MediaAsset[];
  recent_accessed: MediaAsset[];
}

export interface MediaFilters {
  folder_id?: number | string;
  file_type?: string;
  search?: string;
  tag?: string;
  sort_by?: 'created_at' | 'original_name' | 'file_size' | 'access_count';
  sort_order?: 'asc' | 'desc';
  page?: number;
  per_page?: number;
}

