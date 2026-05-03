import { 
  Check, 
  ChevronLeft, 
  Video, 
  Phone, 
  MoreVertical, 
  Paperclip, 
  Smile, 
  Mic,
  ArrowRight,
  ExternalLink,
  FileText
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Template } from '@/src/data/templates';
import { motion } from 'motion/react';

interface PhonePreviewProps {
  template: Template;
}

export default function PhonePreview({ template }: PhonePreviewProps) {
  if (!template) return null;

  // Replace variables in text for preview
  const previewBody = (template.body?.text || "").split(/({{[0-9]+}})/).map((part, i) => {
    const match = part.match(/{{([0-9]+)}}/);
    if (match) {
      const index = parseInt(match[1]) - 1;
      const sample = template.body?.variables?.[index]?.sample || match[1];
      return <span key={i} className="px-1 py-0.5 bg-brand/10 text-brand rounded font-bold underline decoration-brand/30">{sample}</span>;
    }
    return part;
  });

  const headerType = template.header?.type || 'none';
  const buttonType = template.buttons?.type || 'none';

  return (
    <div className="w-[320px] aspect-[9/19] bg-zinc-900 rounded-[3rem] border-[8px] border-zinc-800 shadow-2xl relative overflow-hidden flex flex-col">
      {/* Notch / Dynamic Island */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-zinc-800 rounded-b-2xl z-50 flex items-center justify-center">
         <div className="w-10 h-1 bg-zinc-700/50 rounded-full" />
      </div>

      {/* WhatsApp Header */}
      <header className="pt-8 pb-3 px-4 bg-[#075e54] text-white flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <ChevronLeft size={18} />
          <div className="w-8 h-8 rounded-full bg-zinc-200/20 flex items-center justify-center overflow-hidden">
             <div className="w-full h-full bg-zinc-400/50" />
          </div>
          <div>
            <h4 className="text-[10px] font-bold leading-none">throbtech Support</h4>
            <span className="text-[8px] opacity-70">online</span>
          </div>
        </div>
        <div className="flex items-center gap-3 opacity-80">
          <Video size={14} />
          <Phone size={14} />
          <MoreVertical size={14} />
        </div>
      </header>

      {/* Chat Background */}
      <div className="flex-1 bg-[#efe7de] relative p-3 overflow-y-auto custom-scrollbar">
         {/* System Date Badge */}
         <div className="flex justify-center mb-4">
            <span className="px-2 py-0.5 bg-white/70 backdrop-blur-sm rounded-md text-[8px] font-bold text-zinc-400 uppercase tracking-widest shadow-sm">Today</span>
         </div>

         {/* Message Bubble */}
         <motion.div 
           initial={{ opacity: 0, scale: 0.95, y: 10 }}
           animate={{ opacity: 1, scale: 1, y: 0 }}
           key={template.id}
           className="max-w-[90%] bg-white rounded-xl rounded-tl-none shadow-sm relative overflow-hidden"
         >
           {/* Header Image/Video Placeholder */}
           {['image', 'video', 'document'].includes(headerType) && (
              <div className="aspect-video bg-zinc-100 flex flex-col items-center justify-center p-4 border-b border-zinc-100">
                {headerType === 'image' && <div className="w-full h-full bg-zinc-200 rounded-lg animate-pulse" />}
                {headerType === 'video' && <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center"><div className="w-0 h-0 border-t-8 border-t-transparent border-l-[12px] border-l-white border-b-8 border-b-transparent ml-1" /></div>}
                {headerType === 'document' && <div className="w-10 h-10 border-2 border-zinc-300 rounded flex items-center justify-center"><FileText size={16} /></div>}
              </div>
           )}

           <div className="p-2.5 space-y-1">
              {headerType === 'text' && template.header?.text && (
                 <p className="text-[10px] font-black text-black leading-tight border-b border-zinc-50 pb-1.5 mb-1.5">{template.header.text}</p>
              )}
              
              <div className="text-[10px] text-zinc-800 leading-normal whitespace-pre-wrap">
                 {previewBody}
              </div>

              {template.footer?.text && (
                 <p className="text-[8px] text-zinc-400 font-medium leading-tight mt-1">{template.footer.text}</p>
              )}

              <div className="flex items-center justify-end gap-1 mt-0.5">
                 <span className="text-[7px] text-zinc-400">10:42 PM</span>
                 <Check size={8} className="text-blue-500" />
                 <Check size={8} className="text-blue-500 -ml-1" />
              </div>
           </div>

           {/* Buttons Area */}
           {buttonType !== 'none' && (
             <div className="border-t border-zinc-100 divide-y divide-zinc-100">
                {buttonType === 'quick_reply' && template.buttons?.quickReplies?.map((btn, i) => (
                  <div key={i} className="py-2 flex items-center justify-center gap-1.5 text-blue-500 text-[10px] font-bold hover:bg-zinc-50 transition-colors">
                     {btn.text}
                  </div>
                ))}
                
                {(buttonType === 'cta' || buttonType === 'mixed') && template.buttons?.cta?.map((btn, i) => (
                  <div key={i} className="py-2 flex items-center justify-center gap-1.5 text-blue-500 text-[10px] font-bold hover:bg-zinc-50 transition-colors">
                     {btn.type === 'url' && <ExternalLink size={10} />}
                     {btn.type === 'phone' && <Phone size={10} />}
                     {btn.label}
                  </div>
                ))}
             </div>
           )}
         </motion.div>
      </div>

      {/* Input Placeholder */}
      <footer className="p-2.5 bg-[#f0f2f5] flex items-center gap-2">
         <div className="h-9 flex-1 bg-white rounded-full flex items-center px-4 gap-3 text-zinc-300">
            <Smile size={18} />
            <span className="text-xs">Message</span>
            <div className="flex-1" />
            <Paperclip size={18} />
         </div>
         <div className="w-9 h-9 rounded-full bg-[#128c7e] flex items-center justify-center text-white">
            <Mic size={18} />
         </div>
      </footer>

      {/* Home Indicator */}
      <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-24 h-1 bg-zinc-300 rounded-full" />
    </div>
  );
}
