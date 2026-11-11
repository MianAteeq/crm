import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  MessageSquare,
  Facebook,
  Instagram,
  RefreshCw,
  Send,
  CheckCircle2,
  Clock,
  Filter,
  Search,
  Check,
  User,
  Users,
  Loader2,
  AlertCircle,
  ExternalLink,
  Sparkles,
  Paperclip,
  Smile,
  Tag as TagIcon,
  Plus,
  Trash2,
  X,
  ChevronDown,
  ChevronUp,
  CheckCheck,
  Phone,
  Mail,
  Building,
  MoreVertical,
  MessageCircle,
  ArrowLeft,
  Eye,
  ShieldCheck,
  Flag,
  FileText,
  Inbox as InboxIcon,
  UserPlus,
  Link2,
  ArrowDown,
  Wifi,
  WifiOff,
  ChevronRight,
  PanelRightClose,
  PanelRightOpen,
  Info,
} from 'lucide-react';
import { socialPlannerApi } from '../../services/socialPlannerApi';
import {
  SocialConversation,
  SocialMessage,
  SocialConversationStatus,
  SocialConversationPriority,
  AssignableUser,
  QuickReply,
} from '../../types/socialPlanner';
import { toast } from '../../components/ui/Toast';
import { getEcho } from '../../lib/echo';
import { AuthService } from '../../services/authService';

export default function SocialInboxPage() {
  const tenantId = AuthService.getTenantId();

  // Primary State
  const [conversations, setConversations] = useState<SocialConversation[]>([]);
  const [selectedConvId, setSelectedConvId] = useState<number | null>(null);
  const [activeConversation, setActiveConversation] = useState<SocialConversation | null>(null);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [syncing, setSyncing] = useState(false);

  // Real-Time & Connection State
  const [wsStatus, setWsStatus] = useState<'connected' | 'reconnecting' | 'disconnected'>('disconnected');
  const [hasNewMessagesBelow, setHasNewMessagesBelow] = useState(false);
  const lastSyncTimestampRef = useRef<string>(new Date().toISOString());

  // Filter & Search State
  const [activeTab, setActiveTab] = useState<'all' | 'direct_message' | 'comment'>('all');
  const [filterView, setFilterView] = useState<'all' | 'unread' | 'assigned_me' | 'unassigned' | 'open' | 'pending' | 'resolved'>('all');
  const [filterPlatform, setFilterPlatform] = useState<'all' | 'facebook' | 'instagram'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Team & Quick Replies
  const [assignableUsers, setAssignableUsers] = useState<AssignableUser[]>([]);
  const [quickReplies, setQuickReplies] = useState<QuickReply[]>([]);
  const [showQuickReplies, setShowQuickReplies] = useState(false);

  // Composer State
  const [messageText, setMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [selectedAttachmentUrl, setSelectedAttachmentUrl] = useState<string | null>(null);
  const [selectedAttachmentType, setSelectedAttachmentType] = useState<'image' | 'video' | 'file'>('image');
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Refs for scrolling & file input
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesScrollRef = useRef<HTMLDivElement>(null);
  const isNearBottomRef = useRef(true);

  // Right Panel State & Collapsible Sections
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    profile: false,
    contact: false,
    team: false,
    tags: false,
    notes: false,
    info: true,
  });

  const [newNoteText, setNewNoteText] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newTagText, setNewTagText] = useState('');
  const [isAddingTag, setIsAddingTag] = useState(false);

  // Contact Link / Create Modal
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactModalTab, setContactModalTab] = useState<'create' | 'link'>('create');
  const [contactSearchQuery, setContactSearchQuery] = useState('');
  const [searchedContacts, setSearchedContacts] = useState<any[]>([]);
  const [searchingContacts, setSearchingContacts] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
  });
  const [savingContact, setSavingContact] = useState(false);

  // AI Reply State
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<Array<{ label: string; reply: string }>>([]);

  const commonEmojis = ['👋', '👍', '😊', '🙏', '❤️', '🔥', '🎉', '💡', '✅', '✨'];

  // Toggle individual accordion sections in right column
  const toggleSection = (section: string) => {
    setCollapsedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // --------------------------------------------------------------------------
  // 1. Initial Metadata Loading
  // --------------------------------------------------------------------------
  useEffect(() => {
    const loadMetadata = async () => {
      try {
        const [usersRes, repliesRes] = await Promise.all([
          socialPlannerApi.getAssignableUsers(),
          socialPlannerApi.getQuickReplies(),
        ]);
        if (usersRes.success && usersRes.data) {
          setAssignableUsers(usersRes.data);
        }
        if (repliesRes.success && repliesRes.data) {
          setQuickReplies(repliesRes.data);
        }
      } catch (err) {
        console.error('Failed to load inbox metadata:', err);
      }
    };
    loadMetadata();
  }, []);

  // --------------------------------------------------------------------------
  // 2. Fetch Conversations List
  // --------------------------------------------------------------------------
  const fetchConversations = async (keepSelection = true) => {
    setLoadingList(true);
    try {
      const params: any = {
        view: filterView,
        per_page: 50,
      };
      if (activeTab !== 'all') params.conversation_type = activeTab;
      if (filterPlatform !== 'all') params.platform = filterPlatform;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const res = await socialPlannerApi.getConversations(params);
      if (res.success && res.data) {
        setConversations(res.data);
        if (res.data.length > 0) {
          if (!keepSelection || !selectedConvId || !res.data.find((c) => c.id === selectedConvId)) {
            setSelectedConvId(res.data[0].id);
          }
        } else {
          setSelectedConvId(null);
          setActiveConversation(null);
        }
      }
    } catch (err) {
      console.error('Failed to load conversations:', err);
      toast.error('Failed to load conversations');
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchConversations(false);
  }, [activeTab, filterView, filterPlatform]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchConversations(false);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // --------------------------------------------------------------------------
  // 3. Load Active Conversation Details
  // --------------------------------------------------------------------------
  const loadConversationDetails = async (id: number) => {
    setLoadingDetails(true);
    setSendError(null);
    try {
      const res = await socialPlannerApi.getConversationDetails(id);
      if (res.success && res.data) {
        setActiveConversation(res.data);
        setContactForm({
          name: res.data.participant_name || '',
          phone: '',
          email: '',
          company: '',
        });
        // Clear unread badge in list
        setConversations((prev) =>
          prev.map((c) => (c.id === id ? { ...c, is_unread: false, unread_count: 0 } : c))
        );
        // Reset scroll position to bottom on conversation change
        setTimeout(() => {
          scrollToBottom(false);
        }, 80);
      }
    } catch (err) {
      console.error('Failed to load conversation details:', err);
      toast.error('Failed to load conversation details');
    } finally {
      setLoadingDetails(false);
    }
  };

  useEffect(() => {
    if (selectedConvId) {
      loadConversationDetails(selectedConvId);
    }
  }, [selectedConvId]);

  // --------------------------------------------------------------------------
  // 4. Scroll Tracking & Auto-Scroll
  // --------------------------------------------------------------------------
  const scrollToBottom = (smooth = true) => {
    if (messagesScrollRef.current) {
      messagesScrollRef.current.scrollTo({
        top: messagesScrollRef.current.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto',
      });
      setHasNewMessagesBelow(false);
      isNearBottomRef.current = true;
    }
  };

  const handleMessagesScroll = () => {
    if (!messagesScrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = messagesScrollRef.current;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    const isNear = distanceFromBottom < 120;
    isNearBottomRef.current = isNear;
    if (isNear && hasNewMessagesBelow) {
      setHasNewMessagesBelow(false);
    }
  };

  // --------------------------------------------------------------------------
  // 5. Ingestion of New Messages (From WebSocket or Delta Polling)
  // --------------------------------------------------------------------------
  const handleIncomingMessage = useCallback(
    (convData: Partial<SocialConversation>, newMsg: SocialMessage) => {
      // 1. Update or move conversation in Left List
      setConversations((prev) => {
        const existingIdx = prev.findIndex((c) => c.id === newMsg.social_conversation_id);
        const updatedConv: SocialConversation =
          existingIdx >= 0
            ? {
                ...prev[existingIdx],
                ...convData,
                last_message_at: newMsg.sent_at,
                last_message_preview: newMsg.message_text || '[Media Attachment]',
                last_message_sender: newMsg.sender_type,
                is_unread:
                  newMsg.sender_type === 'customer' && selectedConvId !== newMsg.social_conversation_id
                    ? true
                    : prev[existingIdx].is_unread,
                unread_count:
                  newMsg.sender_type === 'customer' && selectedConvId !== newMsg.social_conversation_id
                    ? (prev[existingIdx].unread_count || 0) + 1
                    : 0,
              }
            : ({
                id: newMsg.social_conversation_id,
                tenant_id: Number(tenantId),
                social_account_id: newMsg.social_account_id,
                platform: convData.platform || 'facebook',
                conversation_type: convData.conversation_type || 'direct_message',
                participant_id: newMsg.sender_id,
                participant_name: newMsg.sender_name || 'Customer',
                status: 'open',
                priority: 'normal',
                is_unread: true,
                unread_count: 1,
                last_message_at: newMsg.sent_at,
                last_message_preview: newMsg.message_text || '[Media Attachment]',
                last_message_sender: newMsg.sender_type,
                created_at: newMsg.sent_at,
                updated_at: newMsg.sent_at,
                ...convData,
              } as SocialConversation);

        // Check activeTab and filterPlatform filters
        const convType = updatedConv.conversation_type || 'direct_message';
        const convPlatform = updatedConv.platform || 'facebook';
        const matchesTab = activeTab === 'all' || convType === activeTab;
        const matchesPlatform = filterPlatform === 'all' || convPlatform === filterPlatform;

        if (!matchesTab || !matchesPlatform) {
          return prev.filter((c) => c.id !== newMsg.social_conversation_id);
        }

        // Remove from current position and prepend to top (sorted by latest activity)
        const filtered = prev.filter((c) => c.id !== newMsg.social_conversation_id);
        return [updatedConv, ...filtered];
      });

      // 2. If it belongs to currently active conversation, append message
      if (selectedConvId === newMsg.social_conversation_id) {
        setActiveConversation((prev) => {
          if (!prev) return null;
          const exists = prev.messages?.some(
            (m) => m.id === newMsg.id || (m.platform_message_id && m.platform_message_id === newMsg.platform_message_id)
          );
          if (exists) return prev;

          return {
            ...prev,
            last_message_at: newMsg.sent_at,
            last_message_preview: newMsg.message_text || '[Media Attachment]',
            last_message_sender: newMsg.sender_type,
            messages: [...(prev.messages || []), newMsg],
          };
        });

        // Smart scroll behavior
        if (isNearBottomRef.current) {
          setTimeout(() => scrollToBottom(true), 60);
        } else {
          setHasNewMessagesBelow(true);
        }
      } else if (!selectedConvId) {
        setSelectedConvId(newMsg.social_conversation_id);
      }
    },
    [selectedConvId, tenantId, activeTab, filterPlatform]
  );

  // --------------------------------------------------------------------------
  // 6. Real-Time WebSocket Connection (Laravel Echo + Reverb)
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (!tenantId) return;

    const echo = getEcho();
    if (!echo) {
      setWsStatus('disconnected');
      return;
    }

    const channelName = `social-inbox.${tenantId}`;
    const fallbackTenantChannel = `tenant.${tenantId}`;

    console.log(`[SocialInbox] 🔌 Connecting to WebSocket channel: ${channelName}`);

    // Monitor WebSocket connection lifecycle
    const conn = echo.connector?.pusher?.connection;
    if (conn) {
      setWsStatus(conn.state === 'connected' ? 'connected' : 'connecting');

      const onStateChange = (states: any) => {
        console.log(`[SocialInbox] 📡 Reverb connection state: ${states.current}`);
        if (states.current === 'connected') {
          setWsStatus('connected');
        } else if (states.current === 'connecting' || states.current === 'unavailable') {
          setWsStatus('reconnecting');
        } else {
          setWsStatus('disconnected');
        }
      };

      conn.bind('state_change', onStateChange);
    }

    // Subscribe to private channel
    const privateChannel = echo.private(channelName);
    privateChannel.listen('.social.message.received', (data: any) => {
      console.log('[SocialInbox] 📥 Live message event received via private channel:', data);
      if (data?.message) {
        handleIncomingMessage(data.conversation || {}, data.message);
      }
    });

    // Also subscribe to tenant public channel as fallback
    const tenantChannel = echo.channel(fallbackTenantChannel);
    tenantChannel.listen('.social.message.received', (data: any) => {
      console.log('[SocialInbox] 📥 Live message event received via tenant channel:', data);
      if (data?.message) {
        handleIncomingMessage(data.conversation || {}, data.message);
      }
    });

    return () => {
      console.log(`[SocialInbox] 🧹 Cleaning up WebSocket channels`);
      try {
        privateChannel.stopListening('.social.message.received');
        tenantChannel.stopListening('.social.message.received');
        echo.leave(channelName);
        echo.leave(fallbackTenantChannel);
      } catch (e) {}
    };
  }, [tenantId, handleIncomingMessage]);

  // --------------------------------------------------------------------------
  // 7. Fallback Delta Synchronization (Polls only new events, auto-paused when hidden)
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (!tenantId) return;

    const runDeltaSync = async () => {
      // Pause delta polling if document is hidden to conserve bandwidth and CPU
      if (document.hidden) return;

      try {
        const latestMsgId =
          activeConversation?.messages && activeConversation.messages.length > 0
            ? activeConversation.messages[activeConversation.messages.length - 1].id
            : undefined;

        const res = await socialPlannerApi.syncDelta({
          last_sync: lastSyncTimestampRef.current,
          conversation_id: selectedConvId || undefined,
          since_message_id: latestMsgId,
        });

        if (res.success && res.data) {
          lastSyncTimestampRef.current = res.data.server_time || new Date().toISOString();

          // 1. Process new messages for active conversation
          if (res.data.messages && res.data.messages.length > 0) {
            res.data.messages.forEach((msg) => {
              handleIncomingMessage({}, msg);
            });
          }

          // 2. Process conversation updates
          if (res.data.conversations && res.data.conversations.length > 0) {
            setConversations((prev) => {
              const updatedMap = new Map(res.data.conversations.map((c) => [c.id, c]));
              const merged = prev.map((c) => (updatedMap.has(c.id) ? { ...c, ...updatedMap.get(c.id) } : c));
              // Add any brand new conversations not previously in list
              res.data.conversations.forEach((c) => {
                if (!merged.some((existing) => existing.id === c.id)) {
                  merged.unshift(c);
                }
              });
              // Sort by latest message timestamp descending
              return merged.sort(
                (a, b) => new Date(b.last_message_at || 0).getTime() - new Date(a.last_message_at || 0).getTime()
              );
            });
          }
        }
      } catch (err) {
        // Delta sync silent fallback
      }
    };

    // Run delta sync every 3.5 seconds
    const interval = setInterval(runDeltaSync, 3500);
    return () => clearInterval(interval);
  }, [tenantId, selectedConvId, activeConversation?.messages, handleIncomingMessage]);

  // --------------------------------------------------------------------------
  // 8. Manual Sync Trigger with Meta
  // --------------------------------------------------------------------------
  const handleManualSync = async () => {
    setSyncing(true);
    try {
      const res = await socialPlannerApi.syncInbox();
      if (res.success) {
        toast.success(res.message || 'Synced conversations successfully!');
        await fetchConversations(true);
        if (selectedConvId) {
          await loadConversationDetails(selectedConvId);
        }
      }
    } catch (err: any) {
      console.error('Failed to sync inbox:', err);
      toast.error(err.response?.data?.message || 'Failed to sync conversations with Meta.');
    } finally {
      setSyncing(false);
    }
  };

  // --------------------------------------------------------------------------
  // 9. Send Outbound Message
  // --------------------------------------------------------------------------
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if ((!messageText.trim() && !selectedAttachmentUrl) || !selectedConvId || isSending) return;

    setIsSending(true);
    setSendError(null);

    const pendingText = messageText.trim();
    const pendingAttachment = selectedAttachmentUrl;
    const pendingType = selectedAttachmentType;

    try {
      const res = await socialPlannerApi.sendInboxMessage(selectedConvId, {
        message: pendingText || undefined,
        attachment_url: pendingAttachment || undefined,
        attachment_type: pendingType,
      });

      if (res.success && res.data) {
        setMessageText('');
        setSelectedAttachmentUrl(null);
        setShowEmojiPicker(false);
        setShowQuickReplies(false);

        // Append to active conversation immediately
        if (activeConversation) {
          setActiveConversation({
            ...activeConversation,
            last_message_at: res.data.sent_at,
            last_message_preview: res.data.message_text || '[Media Attachment]',
            last_message_sender: 'agent',
            messages: [...(activeConversation.messages || []), res.data],
          });
        }

        // Update preview in list & move to top
        setConversations((prev) => {
          const current = prev.find((c) => c.id === selectedConvId);
          if (!current) return prev;
          const updated = {
            ...current,
            last_message_at: res.data.sent_at,
            last_message_preview: res.data.message_text || '[Media Attachment]',
            last_message_sender: 'agent',
          };
          return [updated, ...prev.filter((c) => c.id !== selectedConvId)];
        });

        setTimeout(() => scrollToBottom(true), 50);
      }
    } catch (err: any) {
      console.error('Failed to send message:', err);
      const errMsg = err.response?.data?.message || err.message || 'Failed to send message. Verify Meta permissions.';
      setSendError(errMsg);
      toast.error(errMsg);
    } finally {
      setIsSending(false);
    }
  };

  // --------------------------------------------------------------------------
  // 10. Attachment Upload
  // --------------------------------------------------------------------------
  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingMedia(true);
    try {
      const res = await socialPlannerApi.uploadMedia(file);
      if (res.success && res.data?.url) {
        setSelectedAttachmentUrl(res.data.url);
        setSelectedAttachmentType(file.type.startsWith('video') ? 'video' : 'image');
        toast.success('Media attachment uploaded');
      }
    } catch (err: any) {
      console.error('Attachment upload failed:', err);
      toast.error('Failed to upload media attachment');
    } finally {
      setIsUploadingMedia(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // --------------------------------------------------------------------------
  // 11. Conversation Management (Status, Priority, Unread, Assignment)
  // --------------------------------------------------------------------------
  const handleUpdateStatus = async (status: SocialConversationStatus) => {
    if (!selectedConvId) return;
    try {
      const res = await socialPlannerApi.updateConversationStatus(selectedConvId, status);
      if (res.success) {
        toast.success(`Status updated to ${status}`);
        setActiveConversation((prev) => (prev ? { ...prev, status } : null));
        setConversations((prev) => prev.map((c) => (c.id === selectedConvId ? { ...c, status } : c)));
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleUpdatePriority = async (priority: SocialConversationPriority) => {
    if (!selectedConvId) return;
    try {
      const res = await socialPlannerApi.updateConversationPriority(selectedConvId, priority);
      if (res.success) {
        toast.success(`Priority set to ${priority}`);
        setActiveConversation((prev) => (prev ? { ...prev, priority } : null));
        setConversations((prev) => prev.map((c) => (c.id === selectedConvId ? { ...c, priority } : c)));
      }
    } catch (err: any) {
      toast.error('Failed to update priority');
    }
  };

  const handleToggleUnread = async () => {
    if (!selectedConvId || !activeConversation) return;
    const newUnread = !activeConversation.is_unread;
    try {
      const res = await socialPlannerApi.toggleConversationUnread(selectedConvId, newUnread);
      if (res.success) {
        toast.success(newUnread ? 'Marked as unread' : 'Marked as read');
        setActiveConversation((prev) => (prev ? { ...prev, is_unread: newUnread } : null));
        setConversations((prev) =>
          prev.map((c) => (c.id === selectedConvId ? { ...c, is_unread: newUnread, unread_count: newUnread ? 1 : 0 } : c))
        );
      }
    } catch (err: any) {
      toast.error('Failed to update unread state');
    }
  };

  const handleAssignUser = async (userId: number | null) => {
    if (!selectedConvId) return;
    try {
      const res = await socialPlannerApi.assignConversation(selectedConvId, { user_id: userId });
      if (res.success) {
        const assignedUser = assignableUsers.find((u) => u.id === userId) || null;
        toast.success(assignedUser ? `Assigned to ${assignedUser.name}` : 'Conversation unassigned');
        setActiveConversation((prev) => (prev ? { ...prev, assignee: assignedUser } : null));
        setConversations((prev) =>
          prev.map((c) => (c.id === selectedConvId ? { ...c, assignee: assignedUser, assigned_to_user_id: userId } : c))
        );
      }
    } catch (err: any) {
      toast.error('Failed to assign user');
    }
  };

  // --------------------------------------------------------------------------
  // 12. Notes & Tags Management
  // --------------------------------------------------------------------------
  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConvId || !newNoteText.trim() || isAddingNote) return;

    setIsAddingNote(true);
    try {
      const res = await socialPlannerApi.addConversationNote(selectedConvId, newNoteText.trim());
      if (res.success && res.data) {
        toast.success('Internal note added');
        setNewNoteText('');
        setActiveConversation((prev) =>
          prev ? { ...prev, notes: [res.data, ...(prev.notes || [])] } : null
        );
      }
    } catch (err: any) {
      toast.error('Failed to add note');
    } finally {
      setIsAddingNote(false);
    }
  };

  const handleDeleteNote = async (noteId: number) => {
    try {
      const res = await socialPlannerApi.deleteConversationNote(noteId);
      if (res.success) {
        toast.success('Note removed');
        setActiveConversation((prev) =>
          prev ? { ...prev, notes: (prev.notes || []).filter((n) => n.id !== noteId) } : null
        );
      }
    } catch (err: any) {
      toast.error('Failed to delete note');
    }
  };

  const handleAddTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConvId || !newTagText.trim() || isAddingTag) return;

    setIsAddingTag(true);
    try {
      const res = await socialPlannerApi.addConversationTag(selectedConvId, newTagText.trim());
      if (res.success && res.data) {
        setNewTagText('');
        setActiveConversation((prev) =>
          prev ? { ...prev, tags: [...(prev.tags || []), res.data] } : null
        );
        setConversations((prev) =>
          prev.map((c) => (c.id === selectedConvId ? { ...c, tags: [...(c.tags || []), res.data] } : c))
        );
      }
    } catch (err: any) {
      toast.error('Failed to add tag');
    } finally {
      setIsAddingTag(false);
    }
  };

  const handleRemoveTag = async (tag: string) => {
    if (!selectedConvId) return;
    try {
      const res = await socialPlannerApi.removeConversationTag(selectedConvId, tag);
      if (res.success) {
        setActiveConversation((prev) =>
          prev ? { ...prev, tags: (prev.tags || []).filter((t) => t.tag !== tag) } : null
        );
        setConversations((prev) =>
          prev.map((c) =>
            c.id === selectedConvId ? { ...c, tags: (c.tags || []).filter((t) => t.tag !== tag) } : c
          )
        );
      }
    } catch (err: any) {
      toast.error('Failed to remove tag');
    }
  };

  // --------------------------------------------------------------------------
  // 13. CRM Contact Link & Create
  // --------------------------------------------------------------------------
  const searchContacts = async (q: string) => {
    if (!q.trim()) {
      setSearchedContacts([]);
      return;
    }
    setSearchingContacts(true);
    try {
      const res = await socialPlannerApi.searchContacts(q.trim());
      if (res.contacts) {
        setSearchedContacts(res.contacts);
      }
    } catch (err) {
      console.error('Failed to search contacts:', err);
    } finally {
      setSearchingContacts(false);
    }
  };

  const handleLinkContact = async (contactId: number) => {
    if (!selectedConvId) return;
    try {
      const res = await socialPlannerApi.linkConversationContact(selectedConvId, contactId);
      if (res.success) {
        toast.success('Contact linked successfully');
        setIsContactModalOpen(false);
        setActiveConversation((prev) => (prev ? { ...prev, contact: res.data.contact } : null));
        setConversations((prev) =>
          prev.map((c) => (c.id === selectedConvId ? { ...c, contact: res.data.contact } : c))
        );
      }
    } catch (err: any) {
      toast.error('Failed to link contact');
    }
  };

  const handleCreateContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConvId || savingContact) return;

    setSavingContact(true);
    try {
      const res = await socialPlannerApi.createConversationContact(selectedConvId, contactForm);
      if (res.success && res.data) {
        toast.success('CRM Contact created and linked');
        setIsContactModalOpen(false);
        setActiveConversation((prev) => (prev ? { ...prev, contact: res.data } : null));
        setConversations((prev) =>
          prev.map((c) => (c.id === selectedConvId ? { ...c, contact: res.data } : c))
        );
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create contact');
    } finally {
      setSavingContact(false);
    }
  };

  // --------------------------------------------------------------------------
  // 14. AI Suggest Reply
  // --------------------------------------------------------------------------
  const handleSuggestAiReply = async () => {
    if (!activeConversation) return;
    const lastCustomerMsg =
      activeConversation.messages?.filter((m) => m.sender_type === 'customer').pop()?.message_text ||
      activeConversation.last_message_preview ||
      '';

    if (!lastCustomerMsg) {
      toast.error('No customer message found to generate suggestions.');
      return;
    }

    setIsGeneratingAi(true);
    try {
      const res = await socialPlannerApi.suggestAiReply({
        comment: lastCustomerMsg,
        tone: 'professional, warm, and helpful',
      });
      if (res.success && res.data?.suggestions) {
        setAiSuggestions(res.data.suggestions);
        toast.success('Generated 3 AI response options');
      }
    } catch (err) {
      toast.error('Failed to generate AI response');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // --------------------------------------------------------------------------
  // 15. Helper Renderers (Formatting, Dates, Badges)
  // --------------------------------------------------------------------------
  const formatTimestamp = (dateStr?: string | null) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const formatMessageTime = (dateStr?: string | null) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getDateSeparatorLabel = (dateStr: string) => {
    const d = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (d.toDateString() === today.toDateString()) return 'Today';
    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getPriorityBadge = (priority: SocialConversationPriority) => {
    switch (priority) {
      case 'urgent':
        return <span className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-semibold rounded bg-rose-50 text-rose-700 border border-rose-200">Urgent</span>;
      case 'high':
        return <span className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-semibold rounded bg-amber-50 text-amber-700 border border-amber-200">High</span>;
      case 'normal':
        return <span className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium rounded bg-slate-100 text-slate-600">Normal</span>;
      case 'low':
        return <span className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium rounded bg-slate-50 text-slate-400">Low</span>;
    }
  };

  const getStatusBadge = (status: SocialConversationStatus) => {
    switch (status) {
      case 'open':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-full bg-emerald-50 text-[#166534] border border-emerald-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            <span>Open</span>
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-full bg-amber-50 text-amber-700 border border-amber-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span>Pending</span>
          </span>
        );
      case 'resolved':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-full bg-slate-100 text-slate-600 border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            <span>Resolved</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-3 max-w-[1720px] mx-auto pb-3 overflow-x-hidden">
      {/* ========================================================================= */}
      {/* TOP HEADER: Clean Talkinexx Workspace Header */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200/90 rounded-2xl px-5 py-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#166534]/10 border border-[#166534]/20 flex items-center justify-center text-[#166534] shrink-0">
            <InboxIcon size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Unified Social Inbox
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                Meta Omnichannel
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Direct messages & post comments from Facebook Pages and Instagram Accounts
            </p>
          </div>
        </div>

        {/* Real-time Status Badge & Sync Action */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Connection Status Pill */}
          <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold border ${
              wsStatus === 'connected'
                ? 'bg-emerald-50 border-emerald-200/80 text-[#166534]'
                : wsStatus === 'reconnecting'
                ? 'bg-amber-50 border-amber-200/80 text-amber-700'
                : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
            title="Real-time WebSocket & Delta Sync Engine"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                wsStatus === 'connected'
                  ? 'bg-emerald-500'
                  : wsStatus === 'reconnecting'
                  ? 'bg-amber-500 animate-pulse'
                  : 'bg-slate-400'
              }`}
            />
            <span className="text-[11px]">
              {wsStatus === 'connected'
                ? 'Realtime Active'
                : wsStatus === 'reconnecting'
                ? 'Reconnecting...'
                : 'Auto-Sync Active'}
            </span>
          </div>

          <button
            type="button"
            onClick={handleManualSync}
            disabled={syncing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 rounded-xl font-semibold text-xs shadow-2xs transition-all cursor-pointer active:scale-95 disabled:opacity-60"
          >
            <RefreshCw size={12} className={syncing ? 'animate-spin text-[#166534]' : 'text-slate-500'} />
            <span>{syncing ? 'Syncing...' : 'Sync Meta'}</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MAIN 3-COLUMN INBOX WORKSPACE */}
      {/* 30% List / 45% Conversation / 25% Details */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden h-[calc(100vh-175px)] min-h-[580px] flex">
        {/* ========================================================================= */}
        {/* COLUMN 1: CONVERSATIONS LIST (30% on desktop, full on mobile if not selected) */}
        {/* ========================================================================= */}
        <div
          className={`${
            selectedConvId ? 'hidden md:flex' : 'flex'
          } w-full md:w-[320px] lg:w-[350px] xl:w-[380px] border-r border-slate-200 flex-col bg-slate-50/60 shrink-0`}
        >
          {/* Header Controls */}
          <div className="p-3 border-b border-slate-200/80 space-y-2 bg-white shrink-0">
            {/* Conversation Type Switcher */}
            <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-semibold gap-1">
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`flex-1 py-1 rounded-lg transition-all text-center cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('direct_message')}
                className={`flex-1 py-1 rounded-lg transition-all text-center flex items-center justify-center gap-1 cursor-pointer ${
                  activeTab === 'direct_message'
                    ? 'bg-white text-[#166534] shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <MessageSquare size={12} />
                <span>Direct</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('comment')}
                className={`flex-1 py-1 rounded-lg transition-all text-center flex items-center justify-center gap-1 cursor-pointer ${
                  activeTab === 'comment'
                    ? 'bg-white text-purple-700 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <MessageCircle size={12} />
                <span>Comments</span>
              </button>
            </div>

            {/* Search Input with Clear Button */}
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-7 py-1.5 text-xs bg-slate-50 border border-slate-200/90 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#166534]/15 focus:border-[#166534] transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded"
                >
                  <X size={11} />
                </button>
              )}
            </div>

            {/* Filter Selectors */}
            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
              <select
                value={filterView}
                onChange={(e) => setFilterView(e.target.value as any)}
                className="text-xs bg-slate-50 border border-slate-200/90 rounded-xl px-2 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#166534]/15 cursor-pointer font-medium"
              >
                <option value="all">All Status</option>
                <option value="unread">Unread Only</option>
                <option value="assigned_me">Assigned to Me</option>
                <option value="unassigned">Unassigned</option>
                <option value="open">Open</option>
                <option value="pending">Pending</option>
                <option value="resolved">Resolved</option>
              </select>

              <select
                value={filterPlatform}
                onChange={(e) => setFilterPlatform(e.target.value as any)}
                className="text-xs bg-slate-50 border border-slate-200/90 rounded-xl px-2 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#166534]/15 cursor-pointer font-medium"
              >
                <option value="all">All Platforms</option>
                <option value="facebook">Facebook Only</option>
                <option value="instagram">Instagram Only</option>
              </select>
            </div>
          </div>

          {/* Conversation Cards Scroll Area */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {loadingList ? (
              <div className="p-8 flex flex-col items-center justify-center text-slate-400 gap-2">
                <Loader2 size={18} className="animate-spin text-[#166534]" />
                <span className="text-xs font-medium">Loading conversations...</span>
              </div>
            ) : conversations.length === 0 ? (
              <div className="p-6 text-center text-slate-400 space-y-2">
                <MessageSquare size={26} className="mx-auto text-slate-300" />
                <p className="text-xs font-bold text-slate-700">No conversations found</p>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  New Facebook Messenger and Instagram Direct messages will appear here in real-time.
                </p>
              </div>
            ) : (
              conversations.map((conv) => {
                const isSelected = conv.id === selectedConvId;
                return (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedConvId(conv.id)}
                    className={`p-3 cursor-pointer transition-all relative flex items-start gap-2.5 border-l-[3px] ${
                      isSelected
                        ? 'bg-emerald-50/60 border-l-[#166534] shadow-2xs'
                        : conv.is_unread
                        ? 'bg-slate-50/50 border-l-[#166534] hover:bg-slate-100/60'
                        : 'bg-white border-l-transparent hover:bg-slate-50/70'
                    }`}
                  >
                    {/* Avatar with Platform Badge */}
                    <div className="relative shrink-0 mt-0.5">
                      {conv.participant_avatar_url ? (
                        <img
                          src={conv.participant_avatar_url}
                          alt={conv.participant_name}
                          className="w-9 h-9 rounded-full object-cover border border-slate-200"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs uppercase">
                          {conv.participant_name?.substring(0, 2) || 'CU'}
                        </div>
                      )}
                      <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center bg-white shadow-2xs border border-white">
                        {conv.platform === 'facebook' ? (
                          <Facebook size={9} className="text-[#1877F2] fill-[#1877F2]" />
                        ) : (
                          <Instagram size={9} className="text-[#E4405F]" />
                        )}
                      </span>
                    </div>

                    {/* Middle Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4
                          className={`text-xs truncate ${
                            conv.is_unread ? 'font-bold text-slate-900' : 'font-medium text-slate-800'
                          }`}
                        >
                          {conv.participant_name}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-mono shrink-0">
                          {formatTimestamp(conv.last_message_at)}
                        </span>
                      </div>

                      {conv.participant_username && (
                        <p className="text-[10px] text-slate-400 truncate">@{conv.participant_username}</p>
                      )}

                      {/* Last Message Preview */}
                      <p
                        className={`text-xs mt-0.5 truncate ${
                          conv.is_unread ? 'font-semibold text-slate-900' : 'text-slate-500'
                        }`}
                      >
                        {conv.last_message_sender === 'agent' && (
                          <span className="text-slate-400 font-normal">You: </span>
                        )}
                        {conv.last_message_preview ||
                          (conv.conversation_type === 'comment' ? 'Comment on post' : 'No message yet')}
                      </p>

                      {/* Card Badges */}
                      <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                        {getStatusBadge(conv.status)}
                        {conv.priority !== 'normal' && getPriorityBadge(conv.priority)}
                        {conv.assignee && (
                          <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md flex items-center gap-0.5 font-medium">
                            <User size={8} />
                            <span className="truncate max-w-[70px]">{conv.assignee.name}</span>
                          </span>
                        )}
                        {conv.conversation_type === 'comment' && (
                          <span className="text-[9px] bg-purple-50 text-purple-700 border border-purple-200/60 px-1.5 py-0.5 rounded-md font-semibold">
                            Comment
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Prominent Unread Indicator Dot */}
                    {conv.is_unread && (
                      <span className="w-2 h-2 rounded-full bg-[#166534] ring-2 ring-emerald-200 shrink-0 mt-1.5" />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* COLUMN 2: CONVERSATION WINDOW & COMPOSER (45% on desktop, full on mobile) */}
        {/* ========================================================================= */}
        <div
          className={`${
            !selectedConvId ? 'hidden md:flex' : 'flex'
          } flex-1 flex-col bg-white min-w-0 border-r border-slate-200 relative`}
        >
          {activeConversation ? (
            <>
              {/* Conversation Top Header */}
              <div className="px-4 py-2.5 border-b border-slate-200 flex items-center justify-between gap-3 bg-white shrink-0">
                <div className="flex items-center gap-2.5 min-w-0">
                  {/* Mobile Back Button */}
                  <button
                    type="button"
                    onClick={() => setSelectedConvId(null)}
                    className="md:hidden p-1.5 rounded-lg hover:bg-slate-100 text-slate-600"
                    title="Back to conversation list"
                  >
                    <ArrowLeft size={16} />
                  </button>

                  <div className="relative shrink-0">
                    {activeConversation.participant_avatar_url ? (
                      <img
                        src={activeConversation.participant_avatar_url}
                        alt={activeConversation.participant_name}
                        className="w-9 h-9 rounded-full object-cover border border-slate-200"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs uppercase">
                        {activeConversation.participant_name?.substring(0, 2) || 'CU'}
                      </div>
                    )}
                    <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center bg-white shadow-2xs">
                      {activeConversation.platform === 'facebook' ? (
                        <Facebook size={9} className="text-[#1877F2] fill-[#1877F2]" />
                      ) : (
                        <Instagram size={9} className="text-[#E4405F]" />
                      )}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="text-xs font-bold text-slate-800 truncate">
                        {activeConversation.participant_name}
                      </h2>
                      {activeConversation.contact && (
                        <span className="px-1.5 py-0.2 rounded-full bg-emerald-50 text-[#166534] text-[9px] font-bold border border-emerald-200">
                          CRM Linked
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                      <span>Via {activeConversation.account?.name || activeConversation.platform}</span>
                      {activeConversation.participant_username && (
                        <span>• @{activeConversation.participant_username}</span>
                      )}
                      <span>•</span>
                      {getStatusBadge(activeConversation.status)}
                    </div>
                  </div>
                </div>

                {/* Header Action Controls */}
                <div className="flex items-center gap-2 shrink-0">
                  {/* Status Dropdown */}
                  <select
                    value={activeConversation.status}
                    onChange={(e) => handleUpdateStatus(e.target.value as any)}
                    className="text-xs bg-slate-50 border border-slate-200/90 rounded-xl px-2.5 py-1 font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#166534]/15 cursor-pointer"
                  >
                    <option value="open">Open</option>
                    <option value="pending">Pending</option>
                    <option value="resolved">Resolved</option>
                  </select>

                  {/* Priority Dropdown */}
                  <select
                    value={activeConversation.priority}
                    onChange={(e) => handleUpdatePriority(e.target.value as any)}
                    className="hidden sm:block text-xs bg-slate-50 border border-slate-200/90 rounded-xl px-2.5 py-1 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#166534]/15 cursor-pointer"
                  >
                    <option value="normal">Normal Priority</option>
                    <option value="urgent">Urgent</option>
                    <option value="high">High Priority</option>
                    <option value="low">Low Priority</option>
                  </select>

                  {/* Toggle Read/Unread */}
                  <button
                    type="button"
                    onClick={handleToggleUnread}
                    className="p-1.5 rounded-xl border border-slate-200/90 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all cursor-pointer shadow-2xs"
                    title={activeConversation.is_unread ? 'Mark as Read' : 'Mark as Unread'}
                  >
                    <Mail size={13} className={activeConversation.is_unread ? 'text-[#166534]' : ''} />
                  </button>

                  {/* Toggle Right Details Panel */}
                  <button
                    type="button"
                    onClick={() => setShowRightPanel(!showRightPanel)}
                    className={`p-1.5 rounded-xl border transition-all cursor-pointer shadow-2xs ${
                      showRightPanel
                        ? 'bg-slate-100 text-slate-900 border-slate-300'
                        : 'bg-white text-slate-600 border-slate-200/90 hover:bg-slate-50'
                    }`}
                    title={showRightPanel ? 'Hide Details' : 'Show Details'}
                  >
                    {showRightPanel ? <PanelRightClose size={13} /> : <PanelRightOpen size={13} />}
                  </button>
                </div>
              </div>

              {/* Original Post Context Banner (For Comments) */}
              {activeConversation.conversation_type === 'comment' && activeConversation.post_reference_id && (
                <div className="px-4 py-2 bg-purple-50/70 border-b border-purple-100 flex items-center justify-between text-xs text-purple-900 shrink-0">
                  <div className="flex items-center gap-1.5">
                    <MessageCircle size={13} className="text-purple-600 shrink-0" />
                    <span className="text-[11px]">
                      Post: <span className="font-mono font-semibold">{activeConversation.post_reference_id}</span>
                    </span>
                  </div>
                  {activeConversation.post_reference_url && (
                    <a
                      href={activeConversation.post_reference_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-700 hover:underline"
                    >
                      <span>View Live Post</span>
                      <ExternalLink size={11} />
                    </a>
                  )}
                </div>
              )}

              {/* Messages Container with Dedicated Scroll Area */}
              <div
                ref={messagesScrollRef}
                onScroll={handleMessagesScroll}
                className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/40 relative"
              >
                {loadingDetails ? (
                  <div className="flex items-center justify-center h-full text-slate-400 gap-2">
                    <Loader2 size={18} className="animate-spin text-[#166534]" />
                    <span className="text-xs">Loading conversation thread...</span>
                  </div>
                ) : activeConversation.messages && activeConversation.messages.length > 0 ? (
                  activeConversation.messages.map((msg, idx) => {
                    const isAgent = msg.sender_type === 'agent';
                    const prevMsg = activeConversation.messages?.[idx - 1];
                    const showDateSeparator =
                      !prevMsg ||
                      new Date(msg.sent_at).toDateString() !== new Date(prevMsg.sent_at).toDateString();

                    return (
                      <React.Fragment key={msg.id || idx}>
                        {/* Day / Date Separator */}
                        {showDateSeparator && (
                          <div className="flex items-center justify-center my-3">
                            <span className="px-3 py-0.5 rounded-full bg-slate-200/70 text-slate-600 text-[10px] font-semibold tracking-wide">
                              {getDateSeparatorLabel(msg.sent_at)}
                            </span>
                          </div>
                        )}

                        {/* Message Bubble Row */}
                        <div
                          className={`flex gap-2.5 max-w-[85%] sm:max-w-[75%] ${
                            isAgent ? 'ml-auto flex-row-reverse' : 'mr-auto'
                          }`}
                        >
                          {/* Avatar */}
                          {isAgent ? (
                            <div className="w-7 h-7 rounded-full bg-[#166534] text-white flex items-center justify-center font-bold text-[11px] shrink-0 shadow-2xs mt-0.5">
                              {msg.sender_name?.substring(0, 1) || 'A'}
                            </div>
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                              {activeConversation.participant_name?.substring(0, 1) || 'C'}
                            </div>
                          )}

                          {/* Bubble Content */}
                          <div className="space-y-1">
                            <div
                              className={`rounded-2xl px-3.5 py-2 text-xs shadow-2xs ${
                                isAgent
                                  ? 'bg-[#166534] text-white rounded-tr-none'
                                  : 'bg-white border border-slate-200/90 text-slate-800 rounded-tl-none'
                              }`}
                            >
                              {/* Message Text */}
                              {msg.message_text && (
                                <p className="whitespace-pre-wrap leading-relaxed select-text break-words">
                                  {msg.message_text}
                                </p>
                              )}

                              {/* Attachments */}
                              {msg.attachments && msg.attachments.length > 0 && (
                                <div className="mt-1.5 space-y-1">
                                  {msg.attachments.map((att) => (
                                    <div key={att.id} className="rounded-lg overflow-hidden border border-black/10">
                                      {att.attachment_type === 'image' ? (
                                        <a href={att.url} target="_blank" rel="noopener noreferrer">
                                          <img
                                            src={att.url}
                                            alt="Attachment"
                                            className="max-h-52 max-w-xs rounded-lg object-contain hover:opacity-95"
                                          />
                                        </a>
                                      ) : att.attachment_type === 'video' ? (
                                        <video src={att.url} controls className="max-h-52 max-w-xs rounded-lg" />
                                      ) : (
                                        <a
                                          href={att.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="p-2 bg-black/10 rounded flex items-center gap-2 hover:underline text-[11px]"
                                        >
                                          <Paperclip size={12} />
                                          <span>{att.file_name || 'File Attachment'}</span>
                                        </a>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Meta & Delivery Status */}
                            <div
                              className={`flex items-center gap-1.5 text-[9px] text-slate-400 ${
                                isAgent ? 'justify-end' : 'justify-start'
                              }`}
                            >
                              <span>{msg.sender_name || (isAgent ? 'Agent' : 'Customer')}</span>
                              <span>•</span>
                              <span className="font-mono">{formatMessageTime(msg.sent_at)}</span>
                              {isAgent && (
                                <span>
                                  {msg.status === 'read' ? (
                                    <CheckCheck size={11} className="text-emerald-500" title="Read by customer" />
                                  ) : (
                                    <Check size={11} className="text-slate-400" title="Sent / Delivered" />
                                  )}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })
                ) : (
                  <div className="text-center py-12 text-slate-400 text-xs">
                    No message history yet for this conversation.
                  </div>
                )}
              </div>

              {/* Floating "New Messages" Jump Button */}
              {hasNewMessagesBelow && (
                <button
                  type="button"
                  onClick={() => scrollToBottom(true)}
                  className="absolute bottom-28 right-6 z-20 px-3 py-1.5 bg-[#166534] hover:bg-[#14532d] text-white rounded-full shadow-md hover:shadow-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all border border-white/20"
                >
                  <ArrowDown size={13} />
                  <span>New Messages</span>
                </button>
              )}

              {/* AI Copilot Suggestions Row */}
              {aiSuggestions.length > 0 && (
                <div className="p-2.5 bg-emerald-50/80 border-t border-emerald-100 space-y-1.5 shrink-0">
                  <div className="flex items-center justify-between text-xs font-bold text-[#166534]">
                    <span className="flex items-center gap-1">
                      <Sparkles size={12} />
                      <span>AI Suggested Responses:</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setAiSuggestions([])}
                      className="text-slate-400 hover:text-slate-600 text-[10px]"
                    >
                      Dismiss
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                    {aiSuggestions.map((s, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setMessageText(s.reply);
                          setAiSuggestions([]);
                        }}
                        className="text-left p-2 bg-white border border-emerald-200 rounded-lg text-xs text-slate-700 hover:border-[#166534] hover:shadow-2xs transition-all cursor-pointer"
                      >
                        <span className="font-bold text-[9px] text-[#166534] uppercase block">{s.label}</span>
                        <p className="line-clamp-2 mt-0.5 text-[11px]">{s.reply}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Message Composer (Fixed at bottom) */}
              <div className="p-3 border-t border-slate-200 bg-white space-y-2 shrink-0">
                {/* Send Error Notice */}
                {sendError && (
                  <div className="p-2 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center justify-between">
                    <span className="text-[11px]">{sendError}</span>
                    <button
                      type="button"
                      onClick={() => setSendError(null)}
                      className="text-rose-500 hover:text-rose-800"
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}

                {/* Selected Attachment Preview */}
                {selectedAttachmentUrl && (
                  <div className="flex items-center gap-2 p-1.5 bg-slate-50 border border-slate-200 rounded-lg max-w-xs">
                    <img src={selectedAttachmentUrl} alt="Preview" className="w-8 h-8 object-cover rounded" />
                    <div className="flex-1 min-w-0 text-xs">
                      <span className="font-semibold block truncate">Attachment Ready</span>
                      <span className="text-[9px] text-slate-400 uppercase">{selectedAttachmentType}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedAttachmentUrl(null)}
                      className="p-1 text-slate-400 hover:text-rose-500"
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}

                {/* Composer Toolbar */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    {/* Saved Replies */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowQuickReplies(!showQuickReplies)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100/80 hover:bg-slate-200/80 text-slate-700 rounded-lg font-medium text-[11px] transition-all cursor-pointer"
                      >
                        <FileText size={11} className="text-slate-500" />
                        <span>Saved Replies</span>
                        <ChevronDown size={10} className="text-slate-400" />
                      </button>

                      {showQuickReplies && (
                        <div className="absolute bottom-full left-0 mb-2 w-72 bg-white rounded-xl shadow-lg border border-slate-200 p-2 z-30 space-y-1">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-0.5">
                            Saved Templates
                          </p>
                          {quickReplies.map((qr, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                setMessageText(qr.text);
                                setShowQuickReplies(false);
                              }}
                              className="w-full text-left p-1.5 rounded-lg hover:bg-emerald-50 text-xs text-slate-700 hover:text-[#166534] transition-all"
                            >
                              <span className="font-bold block text-[11px]">{qr.title}</span>
                              <span className="text-[10px] text-slate-500 truncate block">{qr.text}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* AI Copilot */}
                    <button
                      type="button"
                      onClick={handleSuggestAiReply}
                      disabled={isGeneratingAi}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200/60 rounded-lg font-semibold text-[11px] transition-all cursor-pointer disabled:opacity-60"
                    >
                      <Sparkles size={11} className={isGeneratingAi ? 'animate-spin' : ''} />
                      <span>{isGeneratingAi ? 'Drafting...' : 'AI Copilot'}</span>
                    </button>

                    {/* File Attachment Upload */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,video/mp4"
                      onChange={handleMediaUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploadingMedia}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100/80 hover:bg-slate-200/80 text-slate-700 rounded-lg font-medium text-[11px] transition-all cursor-pointer disabled:opacity-60"
                    >
                      <Paperclip size={11} className={isUploadingMedia ? 'animate-spin text-slate-500' : 'text-slate-500'} />
                      <span>{isUploadingMedia ? 'Uploading...' : 'Attach'}</span>
                    </button>

                    {/* Emoji Picker */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-all cursor-pointer"
                        title="Add emoji"
                      >
                        <Smile size={14} />
                      </button>

                      {showEmojiPicker && (
                        <div className="absolute bottom-full left-0 mb-2 bg-white rounded-xl shadow-lg border border-slate-200 p-2 z-30 flex items-center gap-1">
                          {commonEmojis.map((emoji) => (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() => {
                                setMessageText((prev) => prev + emoji);
                                setShowEmojiPicker(false);
                              }}
                              className="text-sm hover:scale-125 transition-transform p-0.5 cursor-pointer"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Character Counter */}
                  <div className="text-[10px] text-slate-400 font-mono">
                    {messageText.length} / {activeConversation.platform === 'instagram' ? 1000 : 2000}
                  </div>
                </div>

                {/* Textarea & Send Button */}
                <form onSubmit={handleSendMessage} className="flex items-end gap-2">
                  <textarea
                    rows={2}
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder={`Type a message to ${activeConversation.participant_name}... (Enter to send, Shift+Enter for newline)`}
                    className="flex-1 p-2.5 text-xs bg-slate-50 border border-slate-200/90 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#166534]/15 focus:border-[#166534] transition-all"
                  />

                  <button
                    type="submit"
                    disabled={(!messageText.trim() && !selectedAttachmentUrl) || isSending}
                    className="p-2.5 rounded-xl bg-[#166534] hover:bg-[#14532d] text-white transition-all cursor-pointer disabled:opacity-40 shadow-2xs active:scale-95 flex items-center justify-center shrink-0"
                    title="Send message (Enter)"
                  >
                    {isSending ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 space-y-2">
              <InboxIcon size={40} className="text-slate-300" />
              <h3 className="text-xs font-bold text-slate-700">Select a Conversation</h3>
              <p className="text-[11px] text-slate-400 max-w-xs text-center">
                Select any Facebook Messenger thread, Instagram Direct conversation, or post comment from the left list.
              </p>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* COLUMN 3: CUSTOMER DETAILS (25% on desktop, collapsible) */}
        {/* ========================================================================= */}
        {showRightPanel && activeConversation && (
          <div className="w-full md:w-[280px] lg:w-[310px] xl:w-[330px] bg-slate-50/50 overflow-y-auto p-3 space-y-3 shrink-0 divide-y divide-slate-200/60">
            {/* 1. Customer Profile Section */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => toggleSection('profile')}
                className="w-full flex items-center justify-between text-xs font-bold text-slate-700 hover:text-slate-900"
              >
                <span>Customer Profile</span>
                {collapsedSections.profile ? <ChevronDown size={13} /> : <ChevronUp size={13} />}
              </button>

              {!collapsedSections.profile && (
                <div className="bg-white rounded-xl p-3 border border-slate-200/80 shadow-2xs text-center space-y-1.5">
                  <div className="relative inline-block">
                    {activeConversation.participant_avatar_url ? (
                      <img
                        src={activeConversation.participant_avatar_url}
                        alt={activeConversation.participant_name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-slate-100 mx-auto"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs mx-auto uppercase">
                        {activeConversation.participant_name?.substring(0, 2) || 'CU'}
                      </div>
                    )}
                    <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full flex items-center justify-center bg-white shadow-2xs">
                      {activeConversation.platform === 'facebook' ? (
                        <Facebook size={10} className="text-[#1877F2] fill-[#1877F2]" />
                      ) : (
                        <Instagram size={10} className="text-[#E4405F]" />
                      )}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-slate-800">{activeConversation.participant_name}</h3>
                    {activeConversation.participant_username && (
                      <p className="text-[10px] text-slate-400">@{activeConversation.participant_username}</p>
                    )}
                    <span className="inline-block mt-0.5 text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-mono">
                      ID: {activeConversation.participant_id}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* 2. CRM Contact Section */}
            <div className="space-y-2 pt-2.5">
              <button
                type="button"
                onClick={() => toggleSection('contact')}
                className="w-full flex items-center justify-between text-xs font-bold text-slate-700 hover:text-slate-900"
              >
                <span>CRM Contact</span>
                {collapsedSections.contact ? <ChevronDown size={13} /> : <ChevronUp size={13} />}
              </button>

              {!collapsedSections.contact && (
                <div className="bg-white rounded-xl p-3 border border-slate-200/80 shadow-2xs space-y-2">
                  {activeConversation.contact ? (
                    <div className="p-2 bg-emerald-50/70 border border-emerald-200/80 rounded-lg space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800">{activeConversation.contact.name}</span>
                        <CheckCircle2 size={12} className="text-[#166534]" />
                      </div>
                      {activeConversation.contact.email && (
                        <p className="text-[10px] text-slate-600 flex items-center gap-1">
                          <Mail size={10} className="text-slate-400 shrink-0" />
                          <span className="truncate">{activeConversation.contact.email}</span>
                        </p>
                      )}
                      {activeConversation.contact.phone && (
                        <p className="text-[10px] text-slate-600 flex items-center gap-1">
                          <Phone size={10} className="text-slate-400 shrink-0" />
                          <span>{activeConversation.contact.phone}</span>
                        </p>
                      )}
                      {activeConversation.contact.company && (
                        <p className="text-[10px] text-slate-600 flex items-center gap-1">
                          <Building size={10} className="text-slate-400 shrink-0" />
                          <span>{activeConversation.contact.company}</span>
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="text-center p-2.5 bg-slate-50 rounded-lg text-slate-400 text-xs space-y-1">
                      <UserPlus size={16} className="mx-auto text-slate-300" />
                      <p className="text-[10px]">No CRM contact associated yet.</p>
                      <button
                        type="button"
                        onClick={() => setIsContactModalOpen(true)}
                        className="mt-1 text-xs font-bold text-[#166534] hover:underline"
                      >
                        Link or Create Contact
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 3. Team Assignment */}
            <div className="space-y-2 pt-2.5">
              <button
                type="button"
                onClick={() => toggleSection('team')}
                className="w-full flex items-center justify-between text-xs font-bold text-slate-700 hover:text-slate-900"
              >
                <span>Assigned Agent</span>
                {collapsedSections.team ? <ChevronDown size={13} /> : <ChevronUp size={13} />}
              </button>

              {!collapsedSections.team && (
                <div className="bg-white rounded-xl p-2.5 border border-slate-200/80 shadow-2xs">
                  <select
                    value={activeConversation.assigned_to_user_id || ''}
                    onChange={(e) => handleAssignUser(e.target.value ? parseInt(e.target.value, 10) : null)}
                    className="w-full text-xs bg-slate-50 border border-slate-200/90 rounded-xl p-2 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#166534]/15 cursor-pointer"
                  >
                    <option value="">Unassigned</option>
                    {assignableUsers.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.role || 'Member'})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* 4. Tags & Categories */}
            <div className="space-y-2 pt-2.5">
              <button
                type="button"
                onClick={() => toggleSection('tags')}
                className="w-full flex items-center justify-between text-xs font-bold text-slate-700 hover:text-slate-900"
              >
                <span>Tags & Labels</span>
                {collapsedSections.tags ? <ChevronDown size={13} /> : <ChevronUp size={13} />}
              </button>

              {!collapsedSections.tags && (
                <div className="bg-white rounded-xl p-2.5 border border-slate-200/80 shadow-2xs space-y-2">
                  <div className="flex flex-wrap gap-1">
                    {activeConversation.tags && activeConversation.tags.length > 0 ? (
                      activeConversation.tags.map((t) => (
                        <span
                          key={t.id}
                          className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-[#166534] border border-emerald-200"
                        >
                          <span>{t.tag}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(t.tag)}
                            className="hover:text-rose-600 cursor-pointer"
                          >
                            <X size={9} />
                          </button>
                        </span>
                      ))
                    ) : (
                      <span className="text-[10px] text-slate-400">No tags applied.</span>
                    )}
                  </div>

                  <form onSubmit={handleAddTag} className="flex gap-1.5 pt-1">
                    <input
                      type="text"
                      placeholder="Add tag..."
                      value={newTagText}
                      onChange={(e) => setNewTagText(e.target.value)}
                      className="flex-1 px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200/90 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#166534]/15"
                    />
                    <button
                      type="submit"
                      disabled={!newTagText.trim() || isAddingTag}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all disabled:opacity-40 cursor-pointer"
                    >
                      Add
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* 5. Internal Team Notes */}
            <div className="space-y-2 pt-2.5">
              <button
                type="button"
                onClick={() => toggleSection('notes')}
                className="w-full flex items-center justify-between text-xs font-bold text-slate-700 hover:text-slate-900"
              >
                <span>Internal Notes</span>
                {collapsedSections.notes ? <ChevronDown size={13} /> : <ChevronUp size={13} />}
              </button>

              {!collapsedSections.notes && (
                <div className="bg-white rounded-xl p-2.5 border border-slate-200/80 shadow-2xs space-y-2">
                  <form onSubmit={handleAddNote} className="space-y-1.5">
                    <textarea
                      rows={2}
                      placeholder="Add internal note..."
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      className="w-full p-2 text-xs bg-slate-50 border border-slate-200/90 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#166534]/15"
                    />
                    <button
                      type="submit"
                      disabled={!newNoteText.trim() || isAddingNote}
                      className="w-full py-1.5 rounded-xl bg-[#166534] hover:bg-[#14532d] text-white text-xs font-semibold transition-all disabled:opacity-40 shadow-2xs cursor-pointer active:scale-95"
                    >
                      {isAddingNote ? 'Saving...' : 'Save Note'}
                    </button>
                  </form>

                  <div className="space-y-1.5 max-h-40 overflow-y-auto pt-1">
                    {activeConversation.notes && activeConversation.notes.length > 0 ? (
                      activeConversation.notes.map((n) => (
                        <div
                          key={n.id}
                          className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-0.5 group"
                        >
                          <div className="flex items-center justify-between text-[9px] text-slate-400">
                            <span className="font-semibold text-slate-700">{n.user?.name || 'Agent'}</span>
                            <div className="flex items-center gap-1">
                              <span>{formatTimestamp(n.created_at)}</span>
                              <button
                                type="button"
                                onClick={() => handleDeleteNote(n.id)}
                                className="opacity-0 group-hover:opacity-100 hover:text-rose-500"
                                title="Delete note"
                              >
                                <Trash2 size={10} />
                              </button>
                            </div>
                          </div>
                          <p className="text-slate-600 whitespace-pre-wrap text-[11px]">{n.content}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-[10px] text-slate-400 text-center py-1">No notes yet.</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 6. Conversation Information */}
            <div className="space-y-2 pt-2.5">
              <button
                type="button"
                onClick={() => toggleSection('info')}
                className="w-full flex items-center justify-between text-xs font-bold text-slate-700 hover:text-slate-900"
              >
                <span>Conversation Info</span>
                {collapsedSections.info ? <ChevronDown size={13} /> : <ChevronUp size={13} />}
              </button>

              {!collapsedSections.info && (
                <div className="bg-white rounded-xl p-2.5 border border-slate-200/80 shadow-2xs space-y-1.5 text-[11px] text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Platform:</span>
                    <span className="font-semibold capitalize">{activeConversation.platform}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Type:</span>
                    <span className="font-semibold">
                      {activeConversation.conversation_type === 'comment' ? 'Post Comment' : 'Direct Message'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Created:</span>
                    <span className="font-mono">{formatTimestamp(activeConversation.created_at)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Last Active:</span>
                    <span className="font-mono">{formatTimestamp(activeConversation.last_message_at)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODAL: LINK OR CREATE CRM CONTACT */}
      {/* ========================================================================= */}
      {isContactModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[200]">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200/90 animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/70">
              <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#166534]/10 text-[#166534] flex items-center justify-center">
                  <Users size={13} />
                </div>
                <span>CRM Contact Association</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsContactModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            <div className="flex border-b border-slate-200 text-xs font-semibold bg-slate-50/40">
              <button
                type="button"
                onClick={() => setContactModalTab('create')}
                className={`flex-1 py-2.5 text-center transition-all cursor-pointer ${
                  contactModalTab === 'create'
                    ? 'border-b-2 border-b-[#166534] text-[#166534] bg-white font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Create New Contact
              </button>
              <button
                type="button"
                onClick={() => setContactModalTab('link')}
                className={`flex-1 py-2.5 text-center transition-all cursor-pointer ${
                  contactModalTab === 'link'
                    ? 'border-b-2 border-b-[#166534] text-[#166534] bg-white font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Link Existing Contact
              </button>
            </div>

            <div className="p-4">
              {contactModalTab === 'create' ? (
                <form onSubmit={handleCreateContact} className="space-y-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah Jenkins"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200/90 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#166534]/15 focus:border-[#166534] transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">Phone Number</label>
                    <input
                      type="text"
                      placeholder="+1 234 567 8900"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200/90 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#166534]/15 focus:border-[#166534] transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="customer@example.com"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200/90 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#166534]/15 focus:border-[#166534] transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">Company (Optional)</label>
                    <input
                      type="text"
                      placeholder="Company Name"
                      value={contactForm.company}
                      onChange={(e) => setContactForm({ ...contactForm, company: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200/90 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#166534]/15 focus:border-[#166534] transition-all"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsContactModalOpen(false)}
                      className="px-3.5 py-1.5 rounded-xl border border-slate-200/90 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={savingContact}
                      className="px-4 py-1.5 rounded-xl bg-[#166534] hover:bg-[#14532d] text-white text-xs font-semibold transition-all disabled:opacity-50 shadow-2xs active:scale-95 cursor-pointer flex items-center gap-1.5"
                    >
                      {savingContact && <Loader2 size={12} className="animate-spin" />}
                      <span>{savingContact ? 'Creating...' : 'Create & Link'}</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-3">
                  <div className="relative">
                    <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search contacts by name or phone..."
                      value={contactSearchQuery}
                      onChange={(e) => {
                        setContactSearchQuery(e.target.value);
                        searchContacts(e.target.value);
                      }}
                      className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200/90 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#166534]/15 focus:border-[#166534] transition-all"
                    />
                  </div>

                  <div className="max-h-52 overflow-y-auto divide-y divide-slate-100 border border-slate-200/90 rounded-xl">
                    {searchingContacts ? (
                      <div className="p-4 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                        <Loader2 size={13} className="animate-spin text-[#166534]" />
                        <span>Searching contacts...</span>
                      </div>
                    ) : searchedContacts.length > 0 ? (
                      searchedContacts.map((c) => (
                        <div
                          key={c.id}
                          onClick={() => handleLinkContact(c.id)}
                          className="p-2.5 hover:bg-emerald-50/70 cursor-pointer flex items-center justify-between text-xs transition-colors"
                        >
                          <div>
                            <span className="font-semibold text-slate-800 block">{c.name}</span>
                            <span className="text-[10px] text-slate-400">
                              {c.phone} {c.email ? `• ${c.email}` : ''}
                            </span>
                          </div>
                          <div className="w-6 h-6 rounded-lg bg-emerald-100/60 text-[#166534] flex items-center justify-center">
                            <Link2 size={12} />
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-xs text-slate-400">
                        {contactSearchQuery.trim() ? 'No contacts found.' : 'Type to search CRM contacts.'}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
