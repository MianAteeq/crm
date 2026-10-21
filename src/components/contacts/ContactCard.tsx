import React from 'react';
import { Phone, Mail, MoreVertical, Zap, Clock, ShieldCheck, ShieldAlert, Ban } from 'lucide-react';
import { Contact, Tag as TagType } from '../../types';
import TagBadge from './TagBadge';
import { motion } from 'motion/react';
import { formatSafeDate } from '../../lib/utils';
import { useI18n } from '../../i18n';
import { cn } from '../../lib/utils';

interface ContactCardProps {
  key?: React.Key;
  contact: Contact;
  availableTags: TagType[];
  selected: boolean;
  onSelect: (id: string) => void;
  onView: (contact: any) => void;
}

export default function ContactCard({ contact, availableTags, selected, onSelect, onView }: ContactCardProps) {
  const { t, isRtl } = useI18n();

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative p-5 bg-white border rounded-xl group cursor-pointer transition-all shadow-sm overflow-hidden ${
        selected ? 'border-[#166534] ring-2 ring-[#22C55E]/30' : 'border-stone-200 hover:border-stone-300'
      }`}
      onClick={() => onView(contact)}
    >
      <div className={cn("absolute top-4", isRtl ? "left-4" : "right-4")} onClick={(e) => e.stopPropagation()}>
        <button 
          onClick={() => onSelect(contact.id)}
          className={`w-4 h-4 rounded border transition-all flex items-center justify-center cursor-pointer ${
            selected ? 'bg-[#166534] border-[#166534]' : 'border-stone-300 bg-white hover:border-[#166534]'
          }`}
          aria-label={t('app.contacts.select_all_1fc9a3', 'Select')}
        >
          {selected && <div className="w-1.5 h-1.5 bg-white rounded-sm" />}
        </button>
      </div>

      <div className="flex flex-col items-center text-center space-y-4">
        <div className="w-16 h-16 rounded-xl bg-stone-100 flex items-center justify-center text-xl font-bold text-[#57534E] border border-stone-200 shadow-inner group-hover:scale-105 transition-transform">
          {(contact.name || "").charAt(0).toUpperCase()}
        </div>

        <div className="space-y-1">
          <h4 className="text-base font-bold text-[#12263A] tracking-tight">{contact.name}</h4>
          <p className="text-[11px] text-[#57534E] font-medium" dir="ltr">
            {contact.phone}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-1.5">
          {(contact.tags || []).slice(0, 3).map((tag, idx) => (
            <TagBadge key={typeof tag === 'object' ? (tag as any).id || idx : tag} tag={tag} availableTags={availableTags} />
          ))}
          {(contact.tags || []).length > 3 && (
             <span className="text-[10px] font-bold text-stone-400 uppercase">+ {(contact.tags || []).length - 3}</span>
          )}
        </div>

        <div className="w-full space-y-1">
           <p className={cn("text-[10px] font-bold text-stone-400 uppercase tracking-widest", isRtl ? "text-right" : "text-left")}>
             {isRtl ? 'آخر رسالة' : 'Last Message'}
           </p>
           <p className={cn("text-[11px] text-stone-600 font-medium line-clamp-2 italic bg-[#FAFAF9] p-2 rounded-lg border border-stone-200", isRtl ? "text-right" : "text-left")}>
             {contact.last_message || (isRtl ? 'لا توجد رسائل بعد' : 'No messages yet')}
           </p>
        </div>

        <div className="w-full pt-4 border-t border-stone-100 grid grid-cols-2 gap-4">
           <div className="text-center">
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                {isRtl ? 'تاريخ الانضمام' : 'Joined'}
              </p>
              <div className="flex items-center justify-center gap-1 mt-2 text-[10px] font-bold text-[#12263A] uppercase">
                 {formatSafeDate(contact.created_at || contact.createdAt)}
              </div>
           </div>
           <div className="text-center">
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                {isRtl ? 'الحالة' : 'Status'}
              </p>
              <div className="mt-2 flex justify-center">
                 {contact.status === 'active' && <div className="w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-500/10" />}
                 {contact.status === 'archived' && <div className="w-2 h-2 rounded-full bg-stone-300 ring-4 ring-stone-300/10" />}
                 {contact.status === 'unsubscribed' && <div className="w-2 h-2 rounded-full bg-red-500 ring-4 ring-red-500/10" />}
              </div>
           </div>
        </div>

        <div className="flex items-center gap-2 text-[10px] font-bold text-stone-400 uppercase tracking-widest">
           <Clock size={12} className="text-stone-300" />
           <span>{contact.lastSeen || contact.lastContacted || (isRtl ? 'غير متوفر' : 'N/A')}</span>
        </div>
      </div>
    </motion.div>
  );
}
