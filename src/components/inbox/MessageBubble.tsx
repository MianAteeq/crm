import React from 'react';
import { Message } from '../../types';
import MessageStatusIcon from './MessageStatusIcon';
import { motion } from 'motion/react';
import { FileText, Download, Image as ImageIcon } from 'lucide-react';
import { cn, formatDynamicDate } from '../../lib/utils';

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  if (!message) return null;
  const isUser = message.sender === 'user';

  const renderContent = () => {
    switch (message.type) {
      case 'image':
        return (
          <div className="space-y-2">
            <div className="max-w-[300px] bg-slate-100 rounded-xl overflow-hidden border border-slate-200 group relative">
               <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  {message.mediaUrl && (
                    <a href={message.mediaUrl} download={message.fileName || 'image.jpg'} target="_blank" rel="noreferrer" className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-all">
                      <Download size={20} />
                    </a>
                  )}
               </div>
               {message.mediaUrl ? (
                 <img src={message.mediaUrl} alt={message.content} className="w-full h-auto block" />
               ) : (
                 <div className="aspect-square flex items-center justify-center">
                    <ImageIcon className="text-slate-300" size={32} />
                 </div>
               )}
            </div>
            {message.content && <p className={cn("text-[11px] font-medium opacity-80", isUser ? "text-white/80" : "text-slate-500")}>{message.content}</p>}
          </div>
        );
      case 'video':
        return (
          <div className="space-y-2">
            <div className="max-w-[300px] bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
               {message.mediaUrl ? (
                 <video src={message.mediaUrl} controls className="w-full h-auto block" />
               ) : (
                 <div className="aspect-video flex items-center justify-center">
                    <ImageIcon className="text-slate-300" size={32} />
                 </div>
               )}
            </div>
            {message.content && <p className={cn("text-[11px] font-medium opacity-80", isUser ? "text-white/80" : "text-slate-500")}>{message.content}</p>}
          </div>
        );
      case 'file':
      case 'audio':
        return (
          <div className={cn(
            "flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer group",
            isUser ? "bg-white/10 border-white/10 hover:bg-white/20" : "bg-slate-50 border-slate-100 hover:border-slate-200"
          )}>
             <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center text-slate-400 group-hover:text-slate-900 shadow-sm transition-colors">
                <FileText size={18} />
             </div>
             <div className="flex-1 overflow-hidden">
                <p className={cn("text-[11px] font-bold truncate", isUser ? "text-white" : "text-slate-900")}>{message.fileName || message.content}</p>
                <p className={cn("text-[9px] font-medium uppercase", isUser ? "text-white/60" : "text-slate-400")}>
                  {message.type === 'audio' ? 'Audio File' : 'Document'}
                </p>
             </div>
             {message.mediaUrl && (
               <a href={message.mediaUrl} download={message.fileName || 'file'} target="_blank" rel="noreferrer" className="p-1.5 text-slate-400 hover:text-slate-900 transition-colors">
                 <Download size={14} />
               </a>
             )}
          </div>
        );
      default:
        return (
          <p className={cn(
            "text-sm font-medium leading-relaxed whitespace-pre-wrap",
            !message.content && "italic opacity-50"
          )}>
            {message.content || 'No content'}
          </p>
        );
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
            {formatDynamicDate(message.timestamp)}
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
