import React from 'react';
import { Send, ExternalLink, Phone, FileText } from 'lucide-react';
import { WhatsAppTemplate } from '../../../types/whatsapp';
import { motion } from 'motion/react';
import { cn } from '../../../lib/utils';

interface WhatsAppPreviewProps {
  template: WhatsAppTemplate;
}

export default function WhatsAppPreview({ template }: WhatsAppPreviewProps) {
  const { header, body, footer, buttons } = template;

  return (
    <div className="w-full max-w-[440px] mx-auto overflow-hidden rounded-[2rem] shadow-2xl border border-slate-200 bg-[#efeae2] relative min-h-[320px] flex flex-col">
      {/* WhatsApp Wallpaper Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat bg-[length:400px_400px] z-0" />
      
      {/* Content Area */}
      <div className="relative z-10 flex-1 p-8 flex flex-col justify-center items-center">
        {/* Message Bubble Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 120 }}
          className="relative w-full max-w-[340px] flex flex-col gap-0.5"
        >
          <div className="relative bg-white rounded-2xl rounded-tl-none shadow-[0_2px_4px_rgba(0,0,0,0.1)] px-4 pt-2.5 pb-2 border-black/[0.02] border w-full">
            {/* Triangular Tip */}
            <div className="absolute top-0 -left-[8px] w-0 h-0 border-t-[12px] border-t-white border-l-[10px] border-l-transparent" />
            
            {/* Header Media */}
            {header.type !== 'NONE' && (
              <div className="mb-3 -mx-2.5 -mt-1 rounded-xl overflow-hidden border border-black/5 bg-slate-50">
                {header.type === 'TEXT' && header.text && (
                  <div className="p-3.5 font-bold text-[16px] text-slate-900 leading-tight bg-slate-50/50">{header.text}</div>
                )}
                {header.type === 'IMAGE' && (
                  <div className="aspect-[16/9] w-full flex items-center justify-center relative">
                    <img 
                      src={header.mediaUrl || "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&fit=crop"} 
                      alt="Media" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                )}
                {header.type === 'DOCUMENT' && (
                  <div className="p-3.5 flex items-center gap-3.5 bg-slate-50/50">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                      <FileText size={26} />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-sm font-bold truncate text-slate-900 leading-tight">{header.fileName || 'catalog_spring.pdf'}</p>
                      <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1">1.4 MB • PDF</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Body Content */}
            <div className="space-y-1 relative pr-2 pb-1">
               <p className="text-[17px] leading-[1.45] text-slate-800 whitespace-pre-wrap break-words font-normal">
                  {body.text || "Preview your message body here..."}
               </p>
               {footer?.text && (
                 <p className="text-[13px] text-slate-400 mt-2 pt-2 border-t border-black/5 leading-snug">
                   {footer.text}
                 </p>
               )}
               <div className="flex items-center justify-end select-none mt-2">
                  <span className="text-[11px] text-slate-400 font-medium uppercase tracking-tighter">12:34 PM</span>
               </div>
            </div>

            {/* Buttons (Native Style) */}
            {buttons.length > 0 && (
              <div className="mt-2.5 -mx-4 -mb-2 border-t border-black/5 divide-y divide-black/5">
                {buttons.map((btn) => (
                  <button 
                    key={btn.id}
                    className={cn(
                      "w-full py-4 text-[15px] font-bold text-[#00a884] bg-transparent transition-all active:bg-black/5 flex items-center justify-center gap-2.5",
                    )}
                  >
                    {btn.type === 'URL' && <ExternalLink size={18} />}
                    {btn.type === 'CALL' && <Phone size={18} />}
                    {btn.text || "Action Button"}
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
