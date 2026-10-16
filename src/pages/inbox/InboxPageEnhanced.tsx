import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Info } from 'lucide-react';
import { ConversationListEnhanced } from '../../components/inbox/ConversationListEnhanced';
import ChatWindow from '../../components/inbox/ChatWindow';
import { ContactDetailsPanel } from '../../components/inbox/ContactDetailsPanel';
import { Conversation, Contact } from '../../types';
import { crmApi } from '../../services/crmApi';
import { useInbox } from '../../hooks/inbox/useInbox';

export default function InboxPageEnhanced() {
  const {
    conversations,
    activeConversation: selectedConversation,
    selectConversation,
    sendMessage,
    isTyping,
    isLoading,
    isAutoReplyEnabled,
    toggleAutoReply
  } = useInbox();

  const [showContactDetails, setShowContactDetails] = useState(false);
  const [localConversations, setLocalConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    setLocalConversations(conversations);
  }, [conversations]);

  const handlePinConversation = (id: string) => {
    setLocalConversations(prev =>
      prev.map(conv =>
        conv.id === id ? { ...conv, isPinned: !conv.isPinned } : conv
      )
    );
  };

  const handleArchiveConversation = (id: string) => {
    setLocalConversations(prev =>
      prev.filter(conv => conv.id !== id)
    );
  };

  const handleUpdateContact = async (contactId: string, data: Partial<Contact>) => {
    try {
      await crmApi.updateContact(contactId, data);

      // Update local state
      setLocalConversations(prev =>
        prev.map(conv =>
          conv.contact.id === contactId
            ? { ...conv, contact: { ...conv.contact, ...data } }
            : conv
        )
      );
    } catch (error) {
      console.error('Failed to update contact:', error);
    }
  };

  const handleAssignAgent = async (contactId: string, agentId: string) => {
    // Update conversation with assigned agent
    setLocalConversations(prev =>
      prev.map(conv =>
        conv.contact.id === contactId
          ? { ...conv, assignedAgent: agentId }
          : conv
      )
    );
  };

  // Mock available agents - replace with actual API call
  const availableAgents = [
    { id: '1', name: 'Sarah Johnson' },
    { id: '2', name: 'Michael Chen' },
    { id: '3', name: 'Emily Rodriguez' }
  ];

  return (
    <div className="h-[calc(100vh-4rem)] flex bg-slate-50 dark:bg-slate-900">
      {/* Left Sidebar - Conversations List */}
      <div className="w-80 lg:w-96 flex-shrink-0">
        <ConversationListEnhanced
          conversations={localConversations}
          selectedId={selectedConversation?.id}
          onSelect={(conv) => selectConversation(conv.id)}
          onPin={handlePinConversation}
          onArchive={handleArchiveConversation}
          isLoading={isLoading}
        />
      </div>

      {/* Center - Chat Window */}
      <div className="flex-1 flex flex-col relative">
        {selectedConversation ? (
          <>
            <ChatWindow
              conversation={selectedConversation}
              onSendMessage={sendMessage}
              isTyping={isTyping}
              isAutoReplyEnabled={isAutoReplyEnabled}
              onToggleAutoReply={toggleAutoReply}
            />
            {/* Toggle Contact Details Button */}
            <button
              onClick={() => setShowContactDetails(!showContactDetails)}
              className="absolute top-4 right-4 w-10 h-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm z-10"
            >
              <Info className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </button>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-white dark:bg-slate-800">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-md px-6"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-[#12263A] to-[#166534] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-[#12263A]/20">
                <Info className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">
                Select a Conversation
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Choose a conversation from the list to start messaging your customers.
                All your WhatsApp conversations are synced in real-time.
              </p>

              <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <span className="font-medium">💡 Pro Tip:</span> Use the search bar to quickly find specific conversations by name or phone number.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </div>

      {/* Right Sidebar - Contact Details */}
      <AnimatePresence>
        {showContactDetails && selectedConversation && (
          <ContactDetailsPanel
            contact={selectedConversation.contact}
            onClose={() => setShowContactDetails(false)}
            onUpdateContact={handleUpdateContact}
            onAssignAgent={handleAssignAgent}
            availableAgents={availableAgents}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
