import React from 'react';
import { Phone, Mail, MoreVertical, Zap, Clock, ShieldCheck, ShieldAlert, Ban } from 'lucide-react';
import { Contact, Tag as TagType } from '../../types';
import TagBadge from './TagBadge';
import { motion } from 'motion/react';
import { formatSafeDate } from '../../lib/utils';

interface ContactCardProps {
  key?: React.Key;
  contact: Contact;
  availableTags: TagType[];
  selected: boolean;
  onSelect: (id: string) => void;
  onView: (contact: any) => void;
}

export default function ContactCard({ contact, availableTags, selected, onSelect, onView }: ContactCardProps) {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative p-5 bg-white border rounded-xl group cursor-pointer transition-all shadow-sm overflow-hidden ${
        selected ? 'border-slate-900 ring-1 ring-slate-900' : 'border-slate-200 hover:border-slate-400'
      }`}
      onClick={() => onView(contact)}
    >
      <div className="absolute top-4 right-4" onClick={(e) => e.stopPropagation()}>
        <button 
          onClick={() => onSelect(contact.id)}
          className={`w-4 h-4 rounded border transition-all flex items-center justify-center ${
            selected ? 'bg-slate-900 border-slate-900' : 'border-slate-300 bg-white hover:border-slate-400'
          }`}
        >
          {selected && <div className="w-1.5 h-1.5 bg-white rounded-sm" />}
        </button>
      </div>

      <div className="flex flex-col items-center text-center space-y-4">
        <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center text-xl font-bold text-slate-500 border border-slate-200 shadow-inner group-hover:scale-105 transition-transform">
          {(contact.name || "").charAt(0)}
        </div>

        <div className="space-y-1">
          <h4 className="text-base font-bold text-slate-900 tracking-tight">{contact.name}</h4>
          <p className="text-[11px] text-slate-500 font-medium">
            {contact.phone}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-1.5">
          {(contact.tags || []).slice(0, 3).map((tag, idx) => (
            <TagBadge key={typeof tag === 'object' ? (tag as any).id || idx : tag} tag={tag} availableTags={availableTags} />
          ))}
          {(contact.tags || []).length > 3 && (
             <span className="text-[10px] font-bold text-slate-400 uppercase">+ {(contact.tags || []).length - 3}</span>
          )}
        </div>

        <div className="w-full space-y-1">
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-left">Last Message</p>
           <p className="text-[11px] text-slate-600 font-medium line-clamp-2 text-left italic bg-slate-50 p-2 rounded-lg border border-slate-100">
             {contact.last_message || "No messages yet"}
           </p>
        </div>

        <div className="w-full pt-4 border-t border-slate-100 grid grid-cols-2 gap-4">
           <div className="text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Joined</p>
              <div className="flex items-center justify-center gap-1 mt-2 text-[10px] font-bold text-slate-900 uppercase">
                 {formatSafeDate(contact.created_at || contact.createdAt)}
              </div>
           </div>
           <div className="text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</p>
              <div className="mt-2 flex justify-center">
                 {contact.status === 'active' && <div className="w-2 h-2 rounded-full bg-green-500 ring-4 ring-green-500/10" />}
                 {contact.status === 'archived' && <div className="w-2 h-2 rounded-full bg-slate-300 ring-4 ring-slate-300/10" />}
                 {contact.status === 'unsubscribed' && <div className="w-2 h-2 rounded-full bg-red-500 ring-4 ring-red-500/10" />}
              </div>
           </div>
        </div>

        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
           <Clock size={12} className="text-slate-300" />
           {contact.lastSeen || contact.lastContacted}
        </div>
      </div>
    </motion.div>
  );
}
