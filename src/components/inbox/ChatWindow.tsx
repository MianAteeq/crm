import React, { useEffect, useRef } from 'react';
import { User, ArrowLeft, Bot } from 'lucide-react';
import { Conversation, Message } from '../../types';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';
import { motion, AnimatePresence } from 'motion/react';
import { formatSafeTime, formatDynamicDate, formatDateDivider } from '../../lib/utils';

interface ChatWindowProps {
  conversation: Conversation;
  onSendMessage: (content: string, type: any, file?: File) => void;
  isTyping?: boolean;
  onBack?: () => void;
  isAutoReplyEnabled?: boolean;
  onToggleAutoReply?: () => void;
  isMessagesLoading?: boolean;
}

export default function ChatWindow({ 
  conversation, 
  onSendMessage, 
  isTyping, 
  onBack,
  isAutoReplyEnabled,
  onToggleAutoReply,
  isMessagesLoading = false
}: ChatWindowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [conversation.messages, isTyping]);

  // Group messages by date
  const groupedMessages = (conversation.messages || []).reduce((acc: { [key: string]: Message[] }, msg) => {
    if (!msg) return acc;
    const dateKey = formatDateDivider(msg.timestamp);
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(msg);
    return acc;
  }, {});

  const dateKeys = Object.keys(groupedMessages);

  return (
    <div className="flex flex-col h-full bg-slate-50 relative overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 bg-white flex items-center justify-between z-10 shadow-sm">
        <div className="flex items-center gap-3">
           {onBack && (
             <button
               onClick={onBack}
               className="md:hidden p-2 -ml-1 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
               aria-label="Back to conversations"
             >
               <ArrowLeft size={20} />
             </button>
           )}
           <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 overflow-hidden">
                 {conversation.contact.avatar ? (
                   <img src={conversation.contact.avatar} alt={conversation.contact.name} className="w-full h-full object-cover" />
                 ) : (
                   <User size={20} />
                 )}
              </div>
              {conversation.isOnline && (
                 <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
              )}
           </div>
           <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight leading-none mb-1">{conversation.contact.name}</h3>
              <div className="flex items-center gap-2">
                 <span className={`text-[10px] font-bold ${conversation.isOnline ? 'text-green-500' : 'text-slate-400'}`}>
                    {conversation.isOnline ? 'Online now' : `Last seen ${formatDynamicDate(conversation.contact.lastSeen)}`}
                 </span>
              </div>
           </div>
        </div>

        <div className="flex items-center gap-2">
           {onToggleAutoReply && (
               <button
                 onClick={onToggleAutoReply}
                 className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs border cursor-pointer active:scale-95 ${
                   isAutoReplyEnabled 
                     ? 'bg-[#F0FDF4] border-[#bbf7d0] text-[#166534]' 
                     : 'bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-700'
                 }`}
                 title="Toggle Auto-Reply Simulator"
             >
               <Bot size={14} className={isAutoReplyEnabled ? 'animate-pulse text-indigo-500' : 'text-slate-400'} />
               <span>Auto-Reply: {isAutoReplyEnabled ? 'ON' : 'OFF'}</span>
             </button>
           )}
        </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-2 custom-scrollbar bg-white shadow-inner"
      >
        {isMessagesLoading ? (
          <div className="space-y-6 animate-pulse py-4">
            {/* Incoming message skeleton */}
            <div className="flex items-start gap-3 max-w-[70%]">
              <div className="w-8 h-8 rounded-full bg-slate-100 shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="h-9 bg-slate-100 rounded-2xl w-48" />
              </div>
            </div>
            {/* Outgoing message skeleton */}
            <div className="flex items-start justify-end gap-3 max-w-[70%] ml-auto">
              <div className="space-y-2 flex-1 items-end flex flex-col">
                <div className="h-9 bg-indigo-50 rounded-2xl w-56" />
              </div>
            </div>
            {/* Incoming message skeleton */}
            <div className="flex items-start gap-3 max-w-[70%]">
              <div className="w-8 h-8 rounded-full bg-slate-100 shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="h-9 bg-slate-100 rounded-2xl w-36" />
              </div>
            </div>
          </div>
        ) : (
          <>
            {dateKeys.map((dateKey) => (
          <React.Fragment key={dateKey}>
            <div className="flex justify-center my-8">
               <span className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  {dateKey}
               </span>
            </div>

            {groupedMessages[dateKey].map((msg, i) => {
              const messages = groupedMessages[dateKey];
              const prevMsg = messages[i-1];
              const isNewGroup = !prevMsg || prevMsg.sender !== msg.sender;
              
              return (
                <div key={msg.id} className={isNewGroup ? 'pt-4' : 'pt-1'}>
                   <MessageBubble message={msg} />
                </div>
              );
            })}
          </React.Fragment>
        ))}
        </>
        )}

        <AnimatePresence>
          {isTyping && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="pt-4">
              <TypingIndicator />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input */}
      <MessageInput 
        onSend={onSendMessage} 
        recipientPhone={conversation.contact.phone}
        recipientName={conversation.contact.name}
        conversation={conversation}
      />
    </div>
  );
}
