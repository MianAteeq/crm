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
    <div className="h-[calc(100vh-80px)] -m-6 overflow-hidden flex bg-white border border-slate-200 rounded-xl shadow-sm">
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
          <div className="flex-1 flex flex-col items-center justify-center text-center p-20 bg-slate-50/50">
             <div className="w-20 h-20 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 mb-6 shadow-sm">
                <MessageCircle size={32} />
             </div>
             <h2 className="text-2xl font-bold text-slate-900 tracking-tight">No Conversation Selected</h2>
             <p className="text-slate-500 mt-2 font-medium max-w-[320px] leading-relaxed text-sm">
                Connect with your customers in real-time. Pick a conversation from the left to start chatting.
             </p>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
