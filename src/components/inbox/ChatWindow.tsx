import React, { useEffect, useRef } from 'react';
import { MoreVertical, User, Phone, Tag, Trash2, Archive, CheckCircle2 } from 'lucide-react';
import { Conversation, Message } from '../../types';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';
import { motion, AnimatePresence } from 'motion/react';

interface ChatWindowProps {
  conversation: Conversation;
  onSendMessage: (content: string, type?: Message['type']) => void;
  isTyping?: boolean;
}

export default function ChatWindow({ conversation, onSendMessage, isTyping }: ChatWindowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [conversation.messages, isTyping]);

  return (
    <div className="flex flex-col h-full bg-slate-50 relative overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 bg-white flex items-center justify-between z-10 shadow-sm">
        <div className="flex items-center gap-4">
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
                    {conversation.isOnline ? 'Online now' : `Last seen ${new Date(conversation.contact.lastSeen).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                 </span>
              </div>
           </div>
        </div>

        <div className="flex items-center gap-2">
           <button className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-500 hover:text-slate-900 transition-all">
              <Tag size={12} /> Add Tag
           </button>
           <button className="p-2 text-slate-400 hover:text-slate-900 transition-all">
              <MoreVertical size={18} />
           </button>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-2 custom-scrollbar bg-white shadow-inner"
      >
        <div className="flex justify-center mb-8">
           <span className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Today, May 3rd
           </span>
        </div>

        {conversation.messages.map((msg, i) => {
          const prevMsg = conversation.messages[i-1];
          const isNewGroup = !prevMsg || prevMsg.sender !== msg.sender;
          
          return (
            <div key={msg.id} className={isNewGroup ? 'pt-4' : 'pt-1'}>
               <MessageBubble message={msg} />
            </div>
          );
        })}

        <AnimatePresence>
          {isTyping && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="pt-4">
              <TypingIndicator />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input */}
      <MessageInput onSend={onSendMessage} />
    </div>
  );
}
