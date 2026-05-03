import React from 'react';
import { useInbox } from '../../hooks/inbox/useInbox';
import ConversationList from '../../components/inbox/ConversationList';
import ChatWindow from '../../components/inbox/ChatWindow';
import ContactSidebar from '../../components/inbox/ContactSidebar';
import { MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function InboxPage() {
  const { 
    conversations, 
    activeConversation, 
    selectConversation, 
    sendMessage, 
    isTyping 
  } = useInbox();

  return (
    <div className="h-[calc(100vh-80px)] -m-10 overflow-hidden flex bg-bg-surface border border-border rounded-none lg:rounded-[3rem] shadow-2xl">
      {/* List Panel */}
      <div className="w-full md:w-[350px] lg:w-[400px] shrink-0 h-full">
        <ConversationList 
          conversations={conversations} 
          activeId={activeConversation?.id} 
          onSelect={selectConversation} 
        />
      </div>

      {/* Chat & Sidebar Wrapper */}
      <AnimatePresence mode="wait">
        {activeConversation ? (
          <motion.div 
            key={activeConversation.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex overflow-hidden h-full"
          >
            {/* Middle Chat Panel */}
            <div className="flex-1 min-w-0 h-full">
              <ChatWindow 
                conversation={activeConversation} 
                onSendMessage={sendMessage}
                isTyping={isTyping}
              />
            </div>

            {/* Right CRM Panel */}
            <div className="hidden xl:block h-full shrink-0">
               <ContactSidebar conversation={activeConversation} />
            </div>
          </motion.div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-20 bg-bg-surface2/30">
             <div className="w-32 h-32 rounded-[3rem] bg-bg-surface3 border border-border flex items-center justify-center text-text-muted mb-8 shadow-inner">
                <MessageCircle size={64} />
             </div>
             <h2 className="text-3xl font-black text-white uppercase tracking-tighter">No Conversation Selected</h2>
             <p className="text-text-muted mt-4 font-medium max-w-[320px] leading-relaxed">
                Connect with your customers in real-time. Pick a conversation from the left to start chatting.
             </p>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
