import React from 'react';
import {
  ExternalLink,
  Phone,
  FileText,
  Video,
  MoreVertical,
  ArrowLeft,
  CheckCheck,
  Copy,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';
import { WhatsAppTemplate } from '../../../types/whatsapp';
import { motion } from 'motion/react';
import { cn } from '../../../lib/utils';

interface WhatsAppPreviewProps {
  template: WhatsAppTemplate;
  recipientName?: string;
  phone?: string;
}

export default function WhatsAppPreview({ template, recipientName, phone }: WhatsAppPreviewProps) {
  const { header, body, footer, buttons } = template;

  return (
    <div className="w-full max-w-[360px] mx-auto overflow-hidden rounded-[1.75rem] shadow-xl border border-slate-300/80 bg-[#efeae2] relative flex flex-col transition-all">
      {/* 1. WhatsApp Top Chat Header */}
      <div className="bg-[#008069] text-white px-3 py-2.5 flex items-center justify-between z-20 shadow-xs select-none">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex items-center gap-1.5 cursor-pointer">
            <ArrowLeft size={16} className="text-white/90" />
            <div className="w-8 h-8 rounded-full bg-white/20 border border-white/30 flex items-center justify-center shrink-0 text-white font-bold text-xs relative">
              <span>{recipientName ? recipientName.charAt(0).toUpperCase() : 'B'}</span>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border border-[#008069] rounded-full flex items-center justify-center">
                <ShieldCheck size={8} className="text-[#008069]" />
              </span>
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold truncate leading-tight text-white">
              {recipientName || template.name || 'Verified Business'}
            </p>
            <p className="text-[10px] text-white/80 leading-none truncate mt-0.5">
              {phone ? phone : 'Official Business Account'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-white/90 shrink-0">
          <Video size={16} className="cursor-pointer hover:text-white" />
          <Phone size={15} className="cursor-pointer hover:text-white" />
          <MoreVertical size={16} className="cursor-pointer hover:text-white" />
        </div>
      </div>

      {/* 2. Chat Canvas with Authentic Doodle Wallpaper */}
      <div className="relative z-10 flex-1 p-3.5 pt-4 pb-5 flex flex-col justify-start items-center min-h-[360px]">
        {/* Subtle WhatsApp Wallpaper Overlay */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat bg-[length:360px_360px] z-0" />

        {/* Date Pill */}
        <div className="relative z-10 mb-3 select-none">
          <span className="px-2.5 py-0.5 bg-white/80 backdrop-blur-xs text-[10px] font-semibold text-slate-600 rounded-md shadow-2xs uppercase tracking-wider">
            Today
          </span>
        </div>

        {/* Message Bubble Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 140 }}
          className="relative w-full max-w-[320px] z-10"
        >
          <div className="relative bg-white rounded-xl rounded-tl-xs shadow-[0_1px_2px_rgba(0,0,0,0.12)] p-2.5 pb-1.5 border border-black/[0.04] w-full">
            {/* Triangular Tip */}
            <div className="absolute top-0 -left-[6px] w-0 h-0 border-t-[8px] border-t-white border-l-[8px] border-l-transparent" />

            {/* Header Media */}
            {header.type !== 'NONE' && (
              <div className="mb-2 -mx-1 -mt-1 rounded-lg overflow-hidden border border-black/5 bg-slate-50">
                {header.type === 'TEXT' && header.text && (
                  <div className="p-2.5 font-bold text-sm text-slate-900 leading-tight bg-slate-50/80">
                    {header.text.split(/(\{\{1\}\})/).map((part, i) => {
                      if (part === '{{1}}') {
                        return (
                          <span key={i} className="text-[#00a884] font-bold">
                            {header.variables?.[0] || part}
                          </span>
                        );
                      }
                      return part;
                    })}
                  </div>
                )}

                {header.type === 'IMAGE' && (
                  <div className="aspect-[16/9] w-full flex items-center justify-center relative bg-slate-100">
                    {header.mediaUrl ? (
                      <img
                        src={header.mediaUrl}
                        alt="Media Header"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-1.5 text-slate-400 p-4">
                        <ExternalLink size={24} strokeWidth={1.5} />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Image Header</span>
                      </div>
                    )}
                  </div>
                )}

                {header.type === 'DOCUMENT' && (
                  <div className="p-2.5 flex items-center gap-3 bg-slate-50">
                    <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100">
                      <FileText size={20} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold truncate text-slate-900 leading-tight">
                        {header.fileName || header.mediaHandle?.split('/').pop() || 'document.pdf'}
                      </p>
                      <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
                        PDF Document
                      </p>
                    </div>
                  </div>
                )}

                {header.type === 'VIDEO' && (
                  <div className="aspect-[16/9] w-full flex items-center justify-center relative bg-slate-900 text-white">
                    <Video size={28} className="text-white/80" />
                    <span className="absolute bottom-2 left-2 text-[10px] font-bold bg-black/60 px-1.5 py-0.5 rounded text-white">
                      Video Header
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Body Text */}
            <div className="space-y-1 relative px-0.5">
              <p className="text-[13px] leading-[1.45] text-slate-800 whitespace-pre-wrap break-words font-normal">
                {body.text
                  ? body.text.split(/(\{\{\d+\}\})/).map((part, i) => {
                      const match = part.match(/\{\{(\d+)\}\}/);
                      if (match) {
                        const index = parseInt(match[1]) - 1;
                        return (
                          <span key={i} className="text-[#00a884] font-semibold bg-emerald-50 px-1 rounded">
                            {body.variables[index] || part}
                          </span>
                        );
                      }
                      return part;
                    })
                  : 'Your template body preview will appear here.'}
              </p>

              {/* Footer text */}
              {footer?.text && (
                <p className="text-[11px] text-slate-400 mt-1.5 pt-1 leading-snug border-t border-slate-100">
                  {footer.text}
                </p>
              )}

              {/* Timestamp & Read Status */}
              <div className="flex items-center justify-end gap-1 select-none pt-1">
                <span className="text-[10px] text-slate-400 font-medium">12:34 PM</span>
                <CheckCheck size={14} className="text-[#53bdeb]" />
              </div>
            </div>

            {/* Native WhatsApp Action Buttons */}
            {buttons && buttons.length > 0 && (
              <div className="mt-2 -mx-2.5 -mb-1.5 border-t border-slate-100 divide-y divide-slate-100">
                {buttons.map((btn) => (
                  <button
                    key={btn.id}
                    type="button"
                    className="w-full py-2.5 text-xs font-bold text-[#00a884] bg-transparent hover:bg-slate-50/70 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {btn.type === 'URL' && <ExternalLink size={13} />}
                    {btn.type === 'CALL' && <Phone size={13} />}
                    {btn.type === 'COPY_CODE' && <Copy size={13} />}
                    {btn.type === 'QUICK_REPLY' && <MessageSquare size={13} />}
                    <span>{btn.text || 'Action Button'}</span>
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
