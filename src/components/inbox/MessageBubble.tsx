import React from 'react';
import { Message } from '../../types';
import MessageStatusIcon from './MessageStatusIcon';
import { motion } from 'motion/react';
import { FileText, Download, Image as ImageIcon } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.sender === 'user';

  const renderContent = () => {
    switch (message.type) {
      case 'template':
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-brand/80">
              <span className="px-1.5 py-0.5 rounded border border-brand/20 bg-brand/5">Template Message</span>
            </div>
            <p className="text-sm font-medium leading-relaxed">{message.content}</p>
          </div>
        );
      case 'image':
        return (
          <div className="space-y-2">
            <div className="aspect-square bg-black/20 rounded-xl overflow-hidden border border-white/10 group relative">
               <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Download size={24} className="text-white" />
               </div>
               <ImageIcon className="absolute inset-0 m-auto text-white/20" size={40} />
            </div>
            <p className="text-xs font-medium">{message.content}</p>
          </div>
        );
      case 'file':
        return (
          <div className="flex items-center gap-3 p-3 bg-black/10 rounded-xl border border-white/5 group hover:border-white/20 transition-all cursor-pointer">
             <div className="w-10 h-10 rounded-lg bg-bg-surface flex items-center justify-center text-text-muted group-hover:text-brand">
                <FileText size={20} />
             </div>
             <div className="flex-1 overflow-hidden">
                <p className="text-[10px] font-black uppercase tracking-tight text-white truncate">{message.content}</p>
                <p className="text-[9px] font-medium text-text-muted uppercase">2.4 MB • PDF Document</p>
             </div>
          </div>
        );
      default:
        return <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">{message.content}</p>;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex w-full mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`max-w-[70%] group relative px-5 py-4 rounded-[1.5rem] transition-all shadow-xl ${
        isUser 
          ? 'bg-brand text-black rounded-tr-[0.25rem] shadow-brand/10' 
          : 'bg-bg-surface border border-border text-white rounded-tl-[0.25rem] shadow-black/20'
      }`}>
        {renderContent()}

        <div className={`flex items-center gap-2 mt-2 justify-end ${isUser ? 'text-black/60' : 'text-text-muted'}`}>
          <span className="text-[9px] font-black uppercase tracking-widest leading-none">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          {isUser && <MessageStatusIcon status={message.status} size={12} />}
        </div>

        {/* Action icons on hover */}
        <div className={`absolute top-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ${
          isUser ? 'right-full mr-2 flex-row-reverse' : 'left-full ml-2'
        }`}>
           <button className="w-8 h-8 rounded-full bg-bg-surface border border-border flex items-center justify-center text-text-muted hover:text-white transition-colors">
              <Download size={14} />
           </button>
        </div>
      </div>
    </motion.div>
  );
}
