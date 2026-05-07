import React from 'react';
import { Message } from '../../types';
import MessageStatusIcon from './MessageStatusIcon';
import { motion } from 'motion/react';
import { FileText, Download, Image as ImageIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

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
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider">
              <span className={cn(
                "px-2 py-0.5 rounded border",
                isUser ? "border-white/20 bg-white/5 text-white" : "border-slate-200 bg-slate-50 text-slate-900"
              )}>Template Message</span>
            </div>
            <p className="text-sm font-medium leading-relaxed">{message.content}</p>
          </div>
        );
      case 'image':
        return (
          <div className="space-y-2">
            <div className="aspect-square bg-slate-100 rounded-xl overflow-hidden border border-slate-200 group relative">
               <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Download size={20} className="text-white" />
               </div>
               <ImageIcon className="absolute inset-0 m-auto text-slate-300" size={32} />
            </div>
            <p className={cn("text-[11px] font-medium opacity-80", isUser ? "text-white/80" : "text-slate-500")}>{message.content}</p>
          </div>
        );
      case 'file':
        return (
          <div className={cn(
            "flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer group",
            isUser ? "bg-white/10 border-white/10 hover:bg-white/20" : "bg-slate-50 border-slate-100 hover:border-slate-200"
          )}>
             <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center text-slate-400 group-hover:text-slate-900 shadow-sm transition-colors">
                <FileText size={18} />
             </div>
             <div className="flex-1 overflow-hidden">
                <p className={cn("text-[11px] font-bold truncate", isUser ? "text-white" : "text-slate-900")}>{message.content}</p>
                <p className={cn("text-[9px] font-medium uppercase", isUser ? "text-white/60" : "text-slate-400")}>2.4 MB • PDF Document</p>
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
      className={`flex w-full mb-2 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`max-w-[75%] group relative px-4 py-3 rounded-2xl transition-all ${
        isUser 
          ? 'bg-slate-900 text-white rounded-tr-none shadow-lg shadow-slate-900/10' 
          : 'bg-white border border-slate-200 text-slate-900 rounded-tl-none shadow-sm'
      }`}>
        {renderContent()}

        <div className={`flex items-center gap-2 mt-1.5 justify-end ${isUser ? 'text-white/60' : 'text-slate-400'}`}>
          <span className="text-[10px] font-medium leading-none">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          {isUser && <MessageStatusIcon status={message.status} size={11} />}
        </div>

        {/* Action icons on hover */}
        <div className={`absolute top-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ${
          isUser ? 'right-full mr-2 flex-row-reverse' : 'left-full ml-2'
        }`}>
           <button className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors shadow-sm">
              <Download size={12} />
           </button>
        </div>
      </div>
    </motion.div>
  );
}
