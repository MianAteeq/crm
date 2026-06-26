import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Conversation, Message } from '../../types';
import { crmApi } from '../../services/crmApi';
import { AuthService } from '../../services/authService';
import { useRealtime } from '../useRealtime';

export function useInbox() {
  const [searchParams] = useSearchParams();
  const selectParam = searchParams.get('select') || searchParams.get('id');

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  const safeConversations = Array.isArray(conversations) ? conversations : [];
  const activeConversation = safeConversations.find(c => String(c.id) === String(activeConversationId));
  const isAutoReplyEnabled = activeConversation?.is_auto_reply_active !== false;

  const toggleAutoReply = useCallback(async () => {
    if (!activeConversationId) return;

    const conv = conversations.find(c => String(c.id) === String(activeConversationId));
    if (!conv) return;

    const nextState = !conv.is_auto_reply_active;

    // Optimistically update
    setConversations(prev => prev.map(c => 
      String(c.id) === String(activeConversationId) ? { ...c, is_auto_reply_active: nextState } : c
    ));

    try {
      await crmApi.toggleConversationAutoReply(activeConversationId, nextState);
    } catch (err) {
      console.error('Failed to toggle auto reply:', err);
      // Revert on error
      setConversations(prev => prev.map(c => 
        String(c.id) === String(activeConversationId) ? { ...c, is_auto_reply_active: !nextState } : c
      ));
    }
  }, [activeConversationId, conversations]);

  // Deep-linking: Automatically select conversation if query parameter matches
  useEffect(() => {
    if (selectParam && conversations.length > 0) {
      const exists = conversations.some(c => String(c.id) === String(selectParam));
      if (exists) {
        setActiveConversationId(String(selectParam));
      }
    }
  }, [selectParam, conversations]);

  const fetchConversations = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      const data = await crmApi.getConversations();
      setConversations(data);
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    } finally {
      if (!silent) setIsLoading(false);
    }
  }, []);

  const fetchMessages = useCallback(async (id: string, silent = false) => {
    try {
      const data = await crmApi.getConversationMessages(id);
      setMessages(data);
      
      // Mark as read locally or via API if needed
      setConversations(prev => prev.map(c => 
        c.id === id ? { ...c, unreadCount: 0 } : c
      ));
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  }, []);

  // Realtime Integration for Laravel Reverb
  // Backend: Channel('tenant.' . $tenantId)
  // Event: .message.received
  const tenantId = AuthService.getTenantId() || '1';
  
  useRealtime({
    channel: `tenant.${tenantId}`,
    event: '.message.received', // Dot prefix for explicit event name
    isPrivate: false,           // Backend uses Channel, not PrivateChannel
    enabled: true,
    onEvent: (data) => {
      console.log('[Realtime] 📥 Incoming Broadcast Payload:', data);
      
      const messageData = data.message || data.payload || data;
      if (!messageData) {
        console.warn('[Realtime] No message data found in payload');
        return;
      }
      
      // Robust ID extraction
      const incomingConvIdRaw = messageData.conversation_id || messageData.chat_id || data.conversation_id || data.chat_id;
      const incomingConvId = incomingConvIdRaw ? String(incomingConvIdRaw) : null;
      
      console.log(`[Realtime] 📲 Event: message.received, Incoming ID: ${incomingConvId}, Active ID: ${activeConversationId}`);

      // 1. Always re-fetch conversations (keeps counts and ordering synced)
      fetchConversations(true);

      // 2. Refresh messages if it's a match, OR as a fallback if we have an active chat
      // Some payloads might not include the conversation/chat ID explicitly
      if (activeConversationId && (!incomingConvId || String(incomingConvId) === String(activeConversationId))) {
        console.log('[Realtime] 🎯 Refreshing messages for active conversation...');
        // Small delay to ensure DB transaction is finished on server
        setTimeout(() => {
          fetchMessages(activeConversationId, true);
        }, 500);
      }
      
      // 3. Optimistic local updates for immediate UI feedback
      const isFromMe = messageData.from_me === true || messageData.direction === 'outbound' || messageData.user_id === 10;
      
      const newMessage: Message = {
        id: String(messageData.id || `rt_${Date.now()}`),
        sender: isFromMe ? 'user' : 'contact',
        type: messageData.type || 'text',
        content: messageData.body || messageData.message || messageData.content || 'New message',
        timestamp: messageData.created_at || new Date().toISOString(),
        status: 'read',
        mediaUrl: messageData.media_url || messageData.url,
        fileName: messageData.file_name || messageData.filename
      };

      // Update messages list if active (extra safety check)
      if (incomingConvId && String(incomingConvId) === String(activeConversationId)) {
        setMessages(prev => {
          if (prev.some(m => String(m.id) === String(newMessage.id))) return prev;
          return [...prev, newMessage];
        });
      }

      // Update conversations list summary
      setConversations(prev => {
        const targetId = incomingConvId || activeConversationId;
        if (!targetId) return prev;
        
        const index = prev.findIndex(c => String(c.id) === String(targetId));
        if (index === -1) return prev;

        const newConversations = [...prev];
        const updatedConv = {
          ...newConversations[index],
          lastMessage: newMessage,
          unreadCount: (activeConversationId !== targetId && !isFromMe) 
            ? (newConversations[index].unreadCount + 1) 
            : newConversations[index].unreadCount
        };

        newConversations.splice(index, 1);
        return [updatedConv, ...newConversations];
      });
    }
  });

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  useEffect(() => {
    if (activeConversationId) {
      setMessages([]); // Clear messages immediately when switching
      fetchMessages(activeConversationId);
    } else {
      setMessages([]);
    }
  }, [activeConversationId, fetchMessages]);

  // Create a combined active conversation with fetched messages
  const activeConversationWithMessages = activeConversation ? {
    ...activeConversation,
    messages: messages
  } : null;

  const sendMessage = useCallback(async (content: string, type: 'text' | 'image' | 'file' = 'text', file?: File) => {
    if (!activeConversationId) return;

    // Optimistic update
    const tempMessage: Message = {
      id: `temp_${Date.now()}`,
      sender: 'user',
      type: type,
      content,
      timestamp: new Date().toISOString(),
      status: 'sending',
      mediaUrl: file ? URL.createObjectURL(file) : undefined,
      fileName: file?.name
    };

    setMessages(prev => [...prev, tempMessage]);

    try {
      let sentMessage: Message;
      if (file) {
        sentMessage = await crmApi.sendMedia(activeConversationId, file);
      } else {
        sentMessage = await crmApi.sendMessage(activeConversationId, content);
      }
      
      // Update with real message from server
      setMessages(prev => prev.map(m => m.id === tempMessage.id ? sentMessage : m));
      
      // Update conversation last message
      setConversations(prev => prev.map(c => {
        if (c.id === activeConversationId) {
          return {
            ...c,
            lastMessage: sentMessage
          };
        }
        return c;
      }));

      // Trigger automatic reply simulation if enabled
      if (isAutoReplyEnabled && type === 'text') {
        const conversationIdToReply = activeConversationId;
        setTimeout(async () => {
          setIsTyping(true);
          try {
            // Typing effect duration
            await new Promise(resolve => setTimeout(resolve, 1500));
            await crmApi.simulateIncomingMessage(conversationIdToReply, content);
          } catch (err) {
            console.error('Failed to get simulated incoming response:', err);
          } finally {
            setIsTyping(false);
          }
        }, 800);
      }

    } catch (error) {
      console.error('Failed to send message:', error);
      setMessages(prev => prev.map(m => 
        m.id === tempMessage.id ? { ...m, status: 'failed' } : m
      ));
    }
  }, [activeConversationId, isAutoReplyEnabled]);

  const selectConversation = (id: string | null) => {
    setActiveConversationId(id);
    if (!id) return;

    // Mark as read if there are unread messages
    const conv = conversations.find(c => c.id === id);
    if (conv && conv.unreadCount > 0) {
      crmApi.markAsRead(id).catch(err => {
        console.warn('Failed to mark as read:', err);
      });
      
      // Update locally immediately
      setConversations(prev => prev.map(c => 
        c.id === id ? { ...c, unreadCount: 0 } : c
      ));
    }
  };

  return {
    conversations: safeConversations,
    activeConversation: activeConversationWithMessages,
    selectConversation,
    sendMessage,
    isTyping,
    isLoading,
    isAutoReplyEnabled,
    toggleAutoReply,
    refreshManual: fetchConversations
  };
}
