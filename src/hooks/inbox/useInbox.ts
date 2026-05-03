import { useState, useEffect, useCallback } from 'react';
import { Conversation, Message } from '../../types';
import { mockConversations } from '../../data/mockMessages';

export function useInbox() {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(mockConversations[0]?.id || null);
  const [isTyping, setIsTyping] = useState(false);

  const activeConversation = conversations.find(c => c.id === activeConversationId);

  const sendMessage = useCallback((content: string, type: Message['type'] = 'text') => {
    if (!activeConversationId) return;

    const newMessage: Message = {
      id: `m_${Date.now()}`,
      sender: 'user',
      type,
      content,
      timestamp: new Date().toISOString(),
      status: 'sending'
    };

    setConversations(prev => prev.map(c => {
      if (c.id === activeConversationId) {
        return {
          ...c,
          messages: [...c.messages, newMessage],
          lastMessage: newMessage
        };
      }
      return c;
    }));

    // Simulate status updates
    setTimeout(() => {
      updateMessageStatus(activeConversationId, newMessage.id, 'sent');
      setTimeout(() => {
        updateMessageStatus(activeConversationId, newMessage.id, 'delivered');
        setTimeout(() => {
          updateMessageStatus(activeConversationId, newMessage.id, 'read');
          
          // Simulate reply after reading
          simulateReply(activeConversationId);
        }, 1500);
      }, 1000);
    }, 500);
  }, [activeConversationId]);

  const updateMessageStatus = (convId: string, msgId: string, status: Message['status']) => {
    setConversations(prev => prev.map(c => {
      if (c.id === convId) {
        return {
          ...c,
          messages: c.messages.map(m => m.id === msgId ? { ...m, status } : m),
          lastMessage: c.lastMessage.id === msgId ? { ...c.lastMessage, status } : c.lastMessage
        };
      }
      return c;
    }));
  };

  const simulateReply = (convId: string) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const reply: Message = {
        id: `r_${Date.now()}`,
        sender: 'contact',
        type: 'text',
        content: 'Thanks for the quick response! I will check and get back to you.',
        timestamp: new Date().toISOString(),
        status: 'read'
      };

      setConversations(prev => prev.map(c => {
        if (c.id === convId) {
          return {
            ...c,
            messages: [...c.messages, reply],
            lastMessage: reply,
            unreadCount: activeConversationId === convId ? 0 : c.unreadCount + 1
          };
        }
        return c;
      }));
    }, 3000);
  };

  const selectConversation = (id: string) => {
    setActiveConversationId(id);
    setConversations(prev => prev.map(c => 
      c.id === id ? { ...c, unreadCount: 0 } : c
    ));
  };

  return {
    conversations,
    activeConversation,
    selectConversation,
    sendMessage,
    isTyping
  };
}
