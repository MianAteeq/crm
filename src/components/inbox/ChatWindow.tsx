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
    <div className="flex flex-col h-full bg-bg-surface2 relative overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-border bg-bg-surface/80 backdrop-blur-xl flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
           <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-bg-surface3 border border-border flex items-center justify-center text-text-muted overflow-hidden">
                 {conversation.contact.avatar ? (
                   <img src={conversation.contact.avatar} alt={conversation.contact.name} className="w-full h-full object-cover" />
                 ) : (
                   <User size={24} />
                 )}
              </div>
              {conversation.isOnline && (
                 <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-bg-surface" />
              )}
           </div>
           <div>
              <h3 className="text-lg font-black text-white uppercase tracking-tight leading-none mb-1">{conversation.contact.name}</h3>
              <div className="flex items-center gap-2">
                 <span className={`text-[9px] font-black uppercase tracking-widest ${conversation.isOnline ? 'text-emerald-500' : 'text-text-muted'}`}>
                    {conversation.isOnline ? 'Online now' : `Last seen ${new Date(conversation.contact.lastSeen).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                 </span>
              </div>
           </div>
        </div>

        <div className="flex items-center gap-2">
           <button className="hidden md:flex items-center gap-2 px-4 py-2 bg-bg-surface3 border border-border rounded-xl text-[9px] font-black uppercase tracking-widest text-text-muted hover:text-white transition-all">
              <Tag size={12} /> Add Tag
           </button>
           <button className="p-3 text-text-muted hover:text-white bg-bg-surface3 border border-border rounded-xl transition-all">
              <MoreVertical size={16} />
           </button>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-8 space-y-2 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed opacity-90"
      >
        <div className="flex justify-center mb-8">
           <span className="px-4 py-1.5 bg-bg-surface3/50 backdrop-blur-md border border-border rounded-full text-[9px] font-black text-text-muted uppercase tracking-[0.2em]">
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
