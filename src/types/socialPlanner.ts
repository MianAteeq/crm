export type SocialPlatform = 'facebook' | 'instagram';

export type SocialPostStatus = 'draft' | 'scheduled' | 'publishing' | 'published' | 'failed';

export interface SocialAccount {
  id: number;
  tenant_id: number;
  platform: SocialPlatform;
  account_id: string;
  name: string;
  username?: string | null;
  profile_picture_url?: string | null;
  token_expires_at?: string | null;
  is_active: boolean;
  category?: string | null;
  followers_count: number;
  connected_at?: string | null;
  metadata?: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

export interface SocialPostMedia {
  id?: number;
  media_type: 'image' | 'video';
  url: string;
  blob_url?: string;
  stream_url?: string;
  file_path?: string;
  filename: string;
  file_size?: number;
  mime_type: string;
  width?: number | null;
  height?: number | null;
  aspect_ratio?: string | null;
  order?: number;
}

export interface SocialPostTarget {
  id: number;
  post_id: number;
  social_account_id: number;
  platform: SocialPlatform;
  status: 'pending' | 'publishing' | 'published' | 'failed';
  platform_post_id?: string | null;
  platform_post_url?: string | null;
  published_at?: string | null;
  error_message?: string | null;
  retry_count: number;
  metrics?: {
    likes?: number;
    comments?: number;
    shares?: number;
    reach?: number;
    impressions?: number;
  } | null;
  account?: SocialAccount;
  created_at: string;
  updated_at: string;
}

export interface SocialPublishLog {
  id: number;
  post_id?: number | null;
  post_target_id?: number | null;
  status: 'info' | 'success' | 'warning' | 'error';
  action: 'schedule' | 'publish_attempt' | 'published' | 'failed' | 'retry';
  message: string;
  details?: Record<string, any> | null;
  created_at: string;
}

export interface SocialPost {
  id: number;
  tenant_id: number;
  user_id?: number | null;
  content: string | null;
  status: SocialPostStatus;
  scheduled_at?: string | null;
  published_at?: string | null;
  options?: Record<string, any> | null;
  error_message?: string | null;
  media: SocialPostMedia[];
  targets: SocialPostTarget[];
  logs?: SocialPublishLog[];
  created_at: string;
  updated_at: string;
}

export interface SocialComment {
  id: number;
  tenant_id: number;
  social_account_id: number;
  social_post_target_id?: number | null;
  platform: SocialPlatform;
  comment_id: string;
  post_id: string;
  parent_comment_id?: string | null;
  commenter_id?: string | null;
  commenter_name?: string | null;
  commenter_avatar_url?: string | null;
  message: string;
  created_time?: string | null;
  is_answered: boolean;
  is_handled: boolean;
  reply_message?: string | null;
  replied_at?: string | null;
  metadata?: Record<string, any> | null;
  account?: SocialAccount;
  replies?: SocialComment[];
  created_at: string;
  updated_at: string;
}

export interface SocialAnalyticsSummary {
  period: {
    type: string;
    start_date: string;
    end_date: string;
  };
  kpis: {
    total_posts: number;
    active_accounts: number;
    total_followers: number;
    total_reach: number | null;
    total_impressions: number | null;
    total_likes: number;
    total_comments: number;
    total_shares: number;
    total_engagement: number;
  };
  platforms: {
    facebook: {
      posts_count: number;
      accounts_count: number;
      likes: number;
      comments: number;
      shares: number;
    };
    instagram: {
      posts_count: number;
      accounts_count: number;
      likes: number;
      comments: number;
      shares: number;
    };
  };
  top_posts: Array<{
    target_id: number;
    post_id: number;
    platform: SocialPlatform;
    account_name: string;
    account_avatar?: string | null;
    caption: string;
    media_url?: string | null;
    media_type: string;
    published_at?: string | null;
    platform_post_url?: string | null;
    likes: number;
    comments: number;
    shares?: number;
    reach: number | null;
    impressions?: number | null;
    engagement: number;
  }>;
}

export type SocialConversationStatus = 'open' | 'pending' | 'resolved';
export type SocialConversationPriority = 'urgent' | 'high' | 'normal' | 'low';
export type SocialConversationType = 'direct_message' | 'comment';

export interface SocialMessageAttachment {
  id: number;
  social_message_id: number;
  attachment_type: 'image' | 'video' | 'audio' | 'file' | 'share' | 'sticker';
  url: string;
  file_name?: string | null;
  file_size?: number | null;
  mime_type?: string | null;
  width?: number | null;
  height?: number | null;
}

export interface SocialMessage {
  id: number;
  social_conversation_id: number;
  social_account_id: number;
  sender_type: 'customer' | 'agent' | 'system';
  sender_user_id?: number | null;
  sender_id: string;
  sender_name?: string | null;
  sender_avatar_url?: string | null;
  message_text?: string | null;
  platform_message_id?: string | null;
  status: 'pending' | 'sent' | 'delivered' | 'read' | 'failed';
  sent_at: string;
  delivered_at?: string | null;
  read_at?: string | null;
  error_message?: string | null;
  attachments?: SocialMessageAttachment[];
  agentUser?: {
    id: number;
    name: string;
    avatar?: string | null;
  } | null;
}

export interface SocialConversationNote {
  id: number;
  social_conversation_id: number;
  user_id: number;
  content: string;
  created_at: string;
  user?: {
    id: number;
    name: string;
    avatar?: string | null;
  };
}

export interface SocialConversationTag {
  id: number;
  social_conversation_id: number;
  tag: string;
  color: string;
}

export interface SocialConversationAssignment {
  id: number;
  social_conversation_id: number;
  assigned_by_user_id?: number | null;
  assigned_to_user_id?: number | null;
  reason?: string | null;
  created_at: string;
  assignedBy?: { id: number; name: string };
  assignedTo?: { id: number; name: string };
}

export interface SocialConversation {
  id: number;
  tenant_id: number;
  social_account_id: number;
  contact_id?: number | null;
  assigned_to_user_id?: number | null;
  platform: SocialPlatform;
  conversation_type: SocialConversationType;
  platform_conversation_id?: string | null;
  participant_id: string;
  participant_name: string;
  participant_username?: string | null;
  participant_avatar_url?: string | null;
  status: SocialConversationStatus;
  priority: SocialConversationPriority;
  is_unread: boolean;
  unread_count: number;
  last_message_at?: string | null;
  last_message_preview?: string | null;
  last_message_sender?: 'customer' | 'agent' | 'system' | null;
  post_reference_id?: string | null;
  post_reference_url?: string | null;
  metadata?: Record<string, any> | null;
  account?: SocialAccount;
  assignee?: {
    id: number;
    name: string;
    email: string;
    avatar?: string | null;
  } | null;
  contact?: {
    id: number;
    name: string;
    phone?: string | null;
    email?: string | null;
    company?: string | null;
    job_title?: string | null;
    website?: string | null;
    notes?: string | null;
  } | null;
  tags?: SocialConversationTag[];
  notes?: SocialConversationNote[];
  assignments?: SocialConversationAssignment[];
  messages?: SocialMessage[];
  created_at: string;
  updated_at: string;
}

export interface AssignableUser {
  id: number;
  name: string;
  email: string;
  avatar?: string | null;
  role?: string | null;
}

export interface QuickReply {
  title: string;
  text: string;
}

