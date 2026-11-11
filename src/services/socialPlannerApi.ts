import { apiClient } from './apiClient';
import {
  SocialAccount,
  SocialPost,
  SocialComment,
  SocialAnalyticsSummary,
  SocialPlatform,
  SocialPostStatus,
  SocialConversation,
  SocialMessage,
  SocialConversationNote,
  SocialConversationTag,
  AssignableUser,
  QuickReply,
} from '../types/socialPlanner';

export const socialPlannerApi = {
  // Accounts
  async getAccounts(params?: { platform?: SocialPlatform; is_active?: boolean }) {
    const res = await apiClient.get<{ success: boolean; data: SocialAccount[] }>('/v1/social/accounts', { params });
    return res.data;
  },

  async getConnectUrl(redirectUri?: string, frontendUrl?: string) {
    const res = await apiClient.get<{ success: boolean; data: { auth_url: string } }>('/v1/social/accounts/connect-url', {
      params: { redirect_uri: redirectUri, frontend_url: frontendUrl },
    });
    return res.data;
  },

  async checkAccountHealth(id: number) {
    const res = await apiClient.post<{ success: boolean; data: any }>(`/v1/social/accounts/${id}/check-health`);
    return res.data;
  },

  async retryWebhook(id: number) {
    const res = await apiClient.post<{ success: boolean; message: string; status?: string; account?: SocialAccount }>(
      `/v1/social/accounts/${id}/retry-webhook`
    );
    return res.data;
  },

  async disconnectAccount(id: number) {
    const res = await apiClient.delete<{ success: boolean; message: string }>(`/v1/social/accounts/${id}`);
    return res.data;
  },

  async getPendingPages(token: string) {
    const res = await apiClient.get<{
      success: boolean;
      data: {
        pages: Array<{
          id: string;
          name: string;
          category: string;
          picture: string | null;
          already_connected: boolean;
          instagram: {
            id: string;
            name: string;
            username: string;
            picture: string | null;
            followers: number;
            already_connected: boolean;
          } | null;
        }>;
        total_count: number;
      };
    }>('/v1/social/accounts/pending-pages', { params: { token } });
    return res.data;
  },

  async confirmPageSelection(token: string, selectedPageIds: string[]) {
    const res = await apiClient.post<{
      success: boolean;
      message: string;
      data: SocialAccount[];
    }>('/v1/social/accounts/confirm-selection', {
      token,
      selected_page_ids: selectedPageIds,
    });
    return res.data;
  },

  // Media Upload
  async uploadMedia(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const res = await apiClient.post<{
      success: boolean;
      data: {
        url: string;
        file_path: string;
        filename: string;
        media_type: 'image' | 'video';
        mime_type: string;
        file_size: number;
        width?: number | null;
        height?: number | null;
        aspect_ratio?: string | null;
      };
    }>('/v1/social/media/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  // Posts & Calendar
  async getPosts(params?: {
    status?: string;
    platform?: SocialPlatform;
    search?: string;
    start_date?: string;
    end_date?: string;
    page?: number;
    per_page?: number;
  }) {
    const res = await apiClient.get<{
      success: boolean;
      data: SocialPost[];
      meta: { current_page: number; last_page: number; per_page: number; total: number };
    }>('/v1/social/posts', { params });
    return res.data;
  },

  async getCalendarPosts(params: { start_date: string; end_date: string; platform?: string; status?: string }) {
    const res = await apiClient.get<{ success: boolean; data: SocialPost[] }>('/v1/social/posts/calendar', { params });
    return res.data;
  },

  async getPost(id: number) {
    const res = await apiClient.get<{ success: boolean; data: SocialPost }>(`/v1/social/posts/${id}`);
    return res.data;
  },

  async createPost(data: {
    content?: string;
    account_ids: number[];
    media?: Array<{
      url: string;
      file_path?: string;
      filename: string;
      media_type: 'image' | 'video';
      mime_type: string;
      file_size?: number;
      width?: number | null;
      height?: number | null;
      aspect_ratio?: string | null;
    }>;
    scheduled_at?: string | null;
    publish_now?: boolean;
    options?: Record<string, any>;
  }) {
    const res = await apiClient.post<{ success: boolean; message: string; data: SocialPost }>('/v1/social/posts', data);
    return res.data;
  },

  async reschedulePost(id: number, scheduledAt: string) {
    const res = await apiClient.put<{ success: boolean; message: string; data: SocialPost }>(
      `/v1/social/posts/${id}/reschedule`,
      { scheduled_at: scheduledAt }
    );
    return res.data;
  },

  async publishNow(id: number) {
    const res = await apiClient.post<{ success: boolean; message: string; data: SocialPost }>(
      `/v1/social/posts/${id}/publish-now`
    );
    return res.data;
  },

  async deletePost(id: number) {
    const res = await apiClient.delete<{ success: boolean; message: string }>(`/v1/social/posts/${id}`);
    return res.data;
  },

  // Unified Inbox
  async getComments(params?: {
    platform?: SocialPlatform;
    account_id?: number;
    is_handled?: boolean | string;
    is_answered?: boolean | string;
    search?: string;
    page?: number;
    per_page?: number;
  }) {
    const res = await apiClient.get<{
      success: boolean;
      data: SocialComment[];
      meta: { current_page: number; last_page: number; per_page: number; total: number };
    }>('/v1/social/inbox', { params });
    return res.data;
  },

  async syncComments(accountId?: number) {
    const res = await apiClient.post<{
      success: boolean;
      message: string;
      data: { synced_count: number };
    }>('/v1/social/inbox/sync', { account_id: accountId });
    return res.data;
  },

  async replyToComment(id: number, message: string) {
    const res = await apiClient.post<{ success: boolean; message: string; data: SocialComment }>(
      `/v1/social/inbox/${id}/reply`,
      { message }
    );
    return res.data;
  },

  async toggleHandledComment(id: number) {
    const res = await apiClient.post<{ success: boolean; message: string; data: SocialComment }>(
      `/v1/social/inbox/${id}/toggle-handled`
    );
    return res.data;
  },

  // Analytics
  async getAnalytics(params?: {
    period?: '7d' | '30d' | '90d' | 'custom';
    platform?: SocialPlatform;
    account_id?: number;
    start_date?: string;
    end_date?: string;
    sync?: boolean;
  }) {
    const res = await apiClient.get<{ success: boolean; data: SocialAnalyticsSummary }>('/v1/social/analytics', { params });
    return res.data;
  },

  async syncAnalytics() {
    const res = await apiClient.post<{ success: boolean; message: string; data: any }>('/v1/social/analytics/sync');
    return res.data;
  },

  // AI Social Copilot
  async generateAiCaptions(data: {
    topic: string;
    platform?: 'all' | 'facebook' | 'instagram';
    tone?: string;
    goal?: string;
    language?: 'en' | 'ar' | 'ur' | 'es' | 'fr' | 'de' | 'pt' | 'hi' | 'it';
    include_emojis?: boolean;
    include_hashtags?: boolean;
    include_cta?: boolean;
  }) {
    const res = await apiClient.post<{
      success: boolean;
      message: string;
      data: {
        variations: Array<{
          type: string;
          hook: string;
          caption: string;
          first_comment?: string;
        }>;
        hashtags: string[];
      };
    }>('/v1/social/ai/generate-captions', data);
    return res.data;
  },

  async rewriteWithAi(data: {
    text: string;
    action: 'shorter' | 'punchier' | 'longer' | 'expand' | 'professional' | 'engaging' | 'cta' | 'stronger_cta' | 'fix_grammar' | 'rewrite' | 'emojis' | 'bullets' | 'translate';
    target_language?: string;
  }) {
    const res = await apiClient.post<{
      success: boolean;
      message: string;
      data: {
        improved_text: string;
        explanation: string;
      };
    }>('/v1/social/ai/rewrite', data);
    return res.data;
  },

  async suggestAiHashtags(data: { content: string; niche?: string; platform?: 'all' | 'facebook' | 'instagram' }) {
    const res = await apiClient.post<{
      success: boolean;
      data: {
        broad_reach: string[];
        niche_specific: string[];
        community_tags: string[];
        all_hashtags_string: string;
      };
    }>('/v1/social/ai/suggest-hashtags', data);
    return res.data;
  },

  async suggestAiReply(data: { comment: string; post_caption?: string; tone?: string }) {
    const res = await apiClient.post<{
      success: boolean;
      data: {
        suggestions: Array<{
          label: string;
          reply: string;
        }>;
      };
    }>('/v1/social/ai/suggest-reply', data);
    return res.data;
  },

  // ==========================================
  // Unified Social Inbox Methods
  // ==========================================

  async getConversations(params?: {
    view?: 'all' | 'unread' | 'assigned_me' | 'unassigned' | 'open' | 'pending' | 'resolved';
    platform?: 'facebook' | 'instagram';
    conversation_type?: 'direct_message' | 'comment';
    account_id?: number;
    search?: string;
    per_page?: number;
    page?: number;
  }) {
    const res = await apiClient.get<{
      success: boolean;
      data: SocialConversation[];
      meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
      };
    }>('/v1/social/inbox/conversations', { params });
    return res.data;
  },

  async getConversationDetails(id: number) {
    const res = await apiClient.get<{
      success: boolean;
      data: SocialConversation;
    }>(`/v1/social/inbox/conversations/${id}`);
    return res.data;
  },

  async syncDelta(params: {
    last_sync?: string;
    conversation_id?: number;
    since_message_id?: number;
  }) {
    const res = await apiClient.get<{
      success: boolean;
      data: {
        server_time: string;
        conversations: SocialConversation[];
        messages: SocialMessage[];
      };
    }>('/v1/social/inbox/sync-delta', { params });
    return res.data;
  },

  async syncInbox(accountId?: number) {
    const res = await apiClient.post<{
      success: boolean;
      message: string;
      data: { synced_count: number };
    }>('/v1/social/inbox/conversations/sync', { account_id: accountId });
    return res.data;
  },

  async sendInboxMessage(
    conversationId: number,
    data: {
      message?: string;
      attachment_url?: string;
      attachment_type?: 'image' | 'video' | 'audio' | 'file';
    }
  ) {
    const res = await apiClient.post<{
      success: boolean;
      message: string;
      data: SocialMessage;
    }>(`/v1/social/inbox/conversations/${conversationId}/messages`, data);
    return res.data;
  },

  async updateConversationStatus(id: number, status: 'open' | 'pending' | 'resolved') {
    const res = await apiClient.put<{
      success: boolean;
      message: string;
      data: SocialConversation;
    }>(`/v1/social/inbox/conversations/${id}/status`, { status });
    return res.data;
  },

  async updateConversationPriority(id: number, priority: 'urgent' | 'high' | 'normal' | 'low') {
    const res = await apiClient.put<{
      success: boolean;
      message: string;
      data: SocialConversation;
    }>(`/v1/social/inbox/conversations/${id}/priority`, { priority });
    return res.data;
  },

  async toggleConversationUnread(id: number, is_unread?: boolean) {
    const res = await apiClient.put<{
      success: boolean;
      message: string;
      data: SocialConversation;
    }>(`/v1/social/inbox/conversations/${id}/unread`, { is_unread });
    return res.data;
  },

  async assignConversation(id: number, data: { user_id: number | null; reason?: string }) {
    const res = await apiClient.put<{
      success: boolean;
      message: string;
      data: SocialConversation;
    }>(`/v1/social/inbox/conversations/${id}/assign`, data);
    return res.data;
  },

  async addConversationNote(id: number, content: string) {
    const res = await apiClient.post<{
      success: boolean;
      message: string;
      data: SocialConversationNote;
    }>(`/v1/social/inbox/conversations/${id}/notes`, { content });
    return res.data;
  },

  async deleteConversationNote(noteId: number) {
    const res = await apiClient.delete<{
      success: boolean;
      message: string;
    }>(`/v1/social/inbox/notes/${noteId}`);
    return res.data;
  },

  async addConversationTag(id: number, tag: string, color?: string) {
    const res = await apiClient.post<{
      success: boolean;
      data: SocialConversationTag;
    }>(`/v1/social/inbox/conversations/${id}/tags`, { tag, color });
    return res.data;
  },

  async removeConversationTag(id: number, tag: string) {
    const res = await apiClient.delete<{
      success: boolean;
      message: string;
    }>(`/v1/social/inbox/conversations/${id}/tags`, { data: { tag } });
    return res.data;
  },

  async linkConversationContact(id: number, contactId: number) {
    const res = await apiClient.post<{
      success: boolean;
      message: string;
      data: SocialConversation;
    }>(`/v1/social/inbox/conversations/${id}/link-contact`, { contact_id: contactId });
    return res.data;
  },

  async createConversationContact(
    id: number,
    data: { name?: string; email?: string; phone?: string; company?: string }
  ) {
    const res = await apiClient.post<{
      success: boolean;
      message: string;
      data: any;
    }>(`/v1/social/inbox/conversations/${id}/create-contact`, data);
    return res.data;
  },

  async getAssignableUsers() {
    const res = await apiClient.get<{
      success: boolean;
      data: AssignableUser[];
    }>('/v1/social/inbox/assignable-users');
    return res.data;
  },

  async getQuickReplies() {
    const res = await apiClient.get<{
      success: boolean;
      data: QuickReply[];
    }>('/v1/social/inbox/quick-replies');
    return res.data;
  },

  async searchContacts(query: string) {
    const res = await apiClient.get<{
      contacts: Array<{
        id: number;
        name: string;
        phone: string;
        email: string | null;
        company: string | null;
      }>;
    }>('/contacts', { params: { search: query, per_page: 8 } });
    return res.data;
  },
};

