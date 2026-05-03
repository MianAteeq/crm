import React from 'react';
import { Phone, Mail, MoreVertical, Zap, Clock, ShieldCheck, ShieldAlert, Ban } from 'lucide-react';
import { Contact } from '../../data/contactsMock';
import TagBadge from './TagBadge';
import { motion } from 'motion/react';

interface ContactCardProps {
  key?: React.Key;
  contact: Contact;
  selected: boolean;
  onSelect: (id: string) => void;
  onView: (contact: any) => void;
}

export default function ContactCard({ contact, selected, onSelect, onView }: ContactCardProps) {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      className={`relative p-6 bg-bg-surface2/30 border border-border rounded-[2rem] group cursor-pointer transition-all ${
        selected ? 'ring-2 ring-brand border-brand/50 bg-brand/5' : 'hover:bg-bg-surface2/50 hover:border-brand/30'
      }`}
      onClick={() => onView(contact)}
    >
      <div className="absolute top-4 right-4" onClick={(e) => e.stopPropagation()}>
        <button 
          onClick={() => onSelect(contact.id)}
          className={`w-6 h-6 rounded-lg border-2 transition-all flex items-center justify-center ${
            selected ? 'bg-brand border-brand' : 'border-border bg-bg-surface hover:border-brand/40'
          }`}
        >
          {selected && <div className="w-2 h-2 bg-white rounded-sm" />}
        </button>
      </div>

      <div className="flex flex-col items-center text-center space-y-4">
        <div className="w-20 h-20 rounded-[2rem] bg-bg-surface3 border-2 border-border flex items-center justify-center text-2xl font-black text-brand shadow-inner group-hover:scale-110 transition-transform">
          {contact.name.charAt(0)}
        </div>

        <div className="space-y-1">
          <h4 className="text-base font-black text-white uppercase tracking-tight">{contact.name}</h4>
          <p className="text-[10px] text-text-muted font-bold flex items-center justify-center gap-2">
            <Phone size={10} className="text-brand" /> {contact.phone}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-1.5">
          {contact.tags.slice(0, 3).map(tag => (
            <TagBadge key={tag} tag={tag} />
          ))}
          {contact.tags.length > 3 && (
             <span className="text-[8px] font-black text-text-muted uppercase">+ {contact.tags.length - 3}</span>
          )}
        </div>

        <div className="w-full pt-4 border-t border-border/50 grid grid-cols-2 gap-4">
           <div className="text-center">
              <p className="text-[8px] font-black text-text-muted uppercase tracking-widest">Campaigns</p>
              <div className="flex items-center justify-center gap-1 mt-1 font-black text-xs text-white">
                 <Zap size={10} className="text-amber-500" />
                 {contact.totalCampaigns}
              </div>
           </div>
           <div className="text-center">
              <p className="text-[8px] font-black text-text-muted uppercase tracking-widest">Status</p>
              <div className="mt-1 flex justify-center">
                 {contact.status === 'active' && <ShieldCheck size={14} className="text-emerald-500" />}
                 {contact.status === 'inactive' && <ShieldAlert size={14} className="text-rose-500" />}
                 {contact.status === 'blocked' && <Ban size={14} className="text-text-muted" />}
              </div>
           </div>
        </div>

        <div className="flex items-center gap-2 text-[9px] font-bold text-text-muted uppercase tracking-widest">
           <Clock size={10} />
           {contact.lastContacted}
        </div>
      </div>
    </motion.div>
  );
}
