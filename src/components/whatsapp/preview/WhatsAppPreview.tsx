import React from 'react';
import { Smartphone, Check, CheckCheck, Smile, Paperclip, Send, Camera, Mic, Info, ExternalLink, Phone, FileText } from 'lucide-react';
import { WhatsAppTemplate } from '../../../types/whatsapp';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../../lib/utils';

interface WhatsAppPreviewProps {
  template: WhatsAppTemplate;
}

export default function WhatsAppPreview({ template }: WhatsAppPreviewProps) {
  const { header, body, footer, buttons } = template;

  return (
    <div className="w-full max-w-[400px] bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden flex flex-col shrink-0">
      {/* Card Header matching image */}
      <div className="px-6 py-4 border-b border-slate-100 bg-white">
        <h3 className="text-[17px] font-bold text-slate-800">Template preview</h3>
        <div className="flex gap-2 mt-2">
          <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold text-slate-500 uppercase tracking-wider">{template.category}</span>
          <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold text-slate-500 uppercase tracking-wider">{template.language}</span>
        </div>
      </div>

      {/* Chat Area with Pattern */}
      <div className="relative aspect-[4/5] w-full bg-[#E5DDD5] p-6 overflow-hidden flex flex-col">
        {/* Real Wallpaper Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.08] pointer-events-none bg-[url('https://api.whatsapp.com/img/bg-chat-tile-light_62fcac960533adca3969a473f8e559f7.png')] bg-repeat bg-[length:360px_360px] z-0" />
        
        {/* Message Bubble Container */}
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative z-10 max-w-[90%] self-start flex flex-col gap-0.5"
        >
          <div className="relative bg-white rounded-xl rounded-tl-none shadow-[0_1px_0.5px_rgba(0,0,0,0.13)] px-4 pt-3 pb-1 border-white border">
            {/* Triangular Tip */}
            <div className="absolute top-0 -left-[7px] w-0 h-0 border-t-[8px] border-t-white border-l-[8px] border-l-transparent" />
            
            {/* Header Media */}
            {header.type !== 'NONE' && (
              <div className="mb-2 -mx-1 -mt-1 rounded-lg overflow-hidden border border-black/[0.03]">
                {header.type === 'TEXT' && header.text && (
                  <div className="p-3 font-bold text-[14px] text-slate-800 leading-tight bg-slate-50">{header.text}</div>
                )}
                {header.type === 'IMAGE' && header.mediaUrl && (
                  <div className="aspect-video w-full bg-slate-200 flex items-center justify-center relative">
                    <img src={header.mediaUrl} alt="Media" className="w-full h-full object-cover" />
                  </div>
                )}
                {header.type === 'VIDEO' && header.mediaUrl && (
                  <div className="aspect-video w-full bg-slate-200 flex items-center justify-center relative">
                    <video src={header.mediaUrl} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center border border-white/40">
                        <Send size={16} className="text-white ml-0.5" />
                      </div>
                    </div>
                  </div>
                )}
                {header.type === 'DOCUMENT' && (
                  <div className="p-3 flex items-center gap-3 bg-slate-50">
                    <div className="w-10 h-10 rounded-lg bg-[#deebff] flex items-center justify-center text-[#2684ff]"><FileText size={20} /></div>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-xs font-bold truncate text-slate-700">{header.fileName || 'document.pdf'}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">PDF • 1.2 MB</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Body Content */}
            <div className="space-y-4">
               <p className="text-[15px] leading-[1.4] text-[#111b21] whitespace-pre-wrap break-words font-normal">
                  {body.text || "Type something to see preview..."}
               </p>
               {footer?.text && <p className="text-[12px] text-[#667781] mt-1">{footer.text}</p>}
               <div className="flex items-center justify-end select-none pb-0.5">
                  <span className="text-[11px] text-[#667781] font-normal leading-none opacity-80">12:24</span>
               </div>
            </div>

            {/* Buttons (Native Style) */}
            {buttons.length > 0 && (
              <div className="mt-2 -mx-4 -mb-1 border-t border-black/[0.05]">
                {buttons.map((btn, i) => (
                  <button 
                    key={btn.id}
                    className={cn(
                      "w-full py-3 text-[14px] font-medium text-[#008069] bg-white transition-all active:bg-slate-50 flex items-center justify-center gap-2",
                      i > 0 && "border-t border-black/[0.05]"
                    )}
                  >
                    {btn.type === 'URL' && <ExternalLink size={14} />}
                    {btn.type === 'CALL' && <Phone size={14} />}
                    {btn.text || "Action"}
                  </button>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
