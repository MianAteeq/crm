import React from 'react';
import { useInbox } from '../../hooks/inbox/useInbox';
import ConversationList from '../../components/inbox/ConversationList';
import ChatWindow from '../../components/inbox/ChatWindow';
import { MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function InboxPage() {
  const { 
    conversations, 
    activeConversation, 
    selectConversation, 
    sendMessage, 
    isTyping,
    isLoading,
    isAutoReplyEnabled,
    toggleAutoReply
  } = useInbox();

  return (
    <div className="h-[calc(100vh-80px)] -m-6 overflow-hidden flex bg-white border border-slate-200 rounded-xl shadow-sm relative">
      {isLoading && conversations.length === 0 && (
        <div className="absolute inset-0 z-50 bg-white/60 backdrop-blur-sm flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
            <p className="text-sm font-bold text-slate-900 uppercase tracking-widest">Loading Chats...</p>
          </div>
        </div>
      )}
      
      {/* List Panel — full width on mobile, hidden there once a chat is open */}
      <div className={`${activeConversation ? 'hidden md:block' : 'block'} w-full md:w-[350px] lg:w-[400px] shrink-0 h-full border-r border-slate-100`}>
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
                onBack={() => selectConversation(null)}
                isAutoReplyEnabled={isAutoReplyEnabled}
                onToggleAutoReply={toggleAutoReply}
              />
            </div>
          </motion.div>
        ) : (
          <div className="hidden md:flex flex-1 flex-col items-center justify-center text-center p-20 bg-slate-50/50">
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
