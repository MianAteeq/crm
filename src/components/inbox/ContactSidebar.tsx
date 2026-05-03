import React from 'react';
import { 
  User, Phone, MapPin, Tag, Plus, Edit2, 
  ExternalLink, MessageSquare, History, Terminal 
} from 'lucide-react';
import { Conversation } from '../../types';

interface ContactSidebarProps {
  conversation: Conversation;
}

export default function ContactSidebar({ conversation }: ContactSidebarProps) {
  const { contact } = conversation;
  
  return (
    <div className="w-[340px] flex flex-col h-full bg-bg-surface border-l border-border overflow-y-auto custom-scrollbar">
      {/* Contact Profile */}
      <div className="p-8 text-center border-b border-border">
         <div className="w-24 h-24 rounded-[2.5rem] bg-bg-surface3 border border-border flex items-center justify-center text-text-muted mx-auto mb-6 relative group overflow-hidden">
            {contact.avatar ? (
              <img src={contact.avatar} alt={contact.name} className="w-full h-full object-cover" />
            ) : (
              <User size={48} />
            )}
            <div className="absolute inset-0 bg-brand/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
               <Edit2 size={24} className="text-black" />
            </div>
         </div>
         <h3 className="text-2xl font-black text-white uppercase tracking-tighter">{contact.name}</h3>
         <p className="text-[10px] font-black text-brand uppercase tracking-widest mt-1">{contact.phone}</p>
         
         <div className="flex items-center justify-center gap-2 mt-6">
            <button className="flex-1 px-4 py-3 bg-bg-surface3 border border-border rounded-xl text-[9px] font-black uppercase text-white hover:border-brand/40 transition-all flex items-center justify-center gap-2">
               <Edit2 size={12} /> Edit
            </button>
            <button className="p-3 bg-bg-surface3 border border-border rounded-xl text-text-muted hover:text-brand transition-all">
               <ExternalLink size={14} />
            </button>
         </div>
      </div>

      {/* Tags */}
      <div className="p-8 border-b border-border space-y-4">
         <div className="flex items-center justify-between">
            <h4 className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] flex items-center gap-2">
               <Tag size={12} className="text-brand" /> Tags
            </h4>
            <button className="text-brand hover:brightness-125 transition-all">
               <Plus size={14} strokeWidth={3} />
            </button>
         </div>
         <div className="flex flex-wrap gap-2">
            {contact.tags.map(tag => (
              <span key={tag} className="px-3 py-1.5 bg-brand/10 border border-brand/20 text-brand text-[9px] font-black uppercase tracking-widest rounded-lg">
                {tag}
              </span>
            ))}
         </div>
      </div>

      {/* Details */}
      <div className="p-8 border-b border-border space-y-6">
         <h4 className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Contact Information</h4>
         
         <div className="space-y-4">
            <div className="flex items-start gap-4">
               <div className="w-8 h-8 rounded-lg bg-bg-surface3 flex items-center justify-center text-text-muted shrink-0">
                  <Phone size={14} />
               </div>
               <div>
                  <p className="text-[9px] font-black text-text-muted uppercase tracking-widest mb-0.5">Phone</p>
                  <p className="text-xs font-bold text-white leading-none">{contact.phone}</p>
               </div>
            </div>
            <div className="flex items-start gap-4">
               <div className="w-8 h-8 rounded-lg bg-bg-surface3 flex items-center justify-center text-text-muted shrink-0">
                  <MapPin size={14} />
               </div>
               <div>
                  <p className="text-[9px] font-black text-text-muted uppercase tracking-widest mb-0.5">Timezone</p>
                  <p className="text-xs font-bold text-white leading-none">Pakistan (GMT+5)</p>
               </div>
            </div>
            <div className="flex items-start gap-4">
               <div className="w-8 h-8 rounded-lg bg-bg-surface3 flex items-center justify-center text-text-muted shrink-0">
                  <History size={14} />
               </div>
               <div>
                  <p className="text-[9px] font-black text-text-muted uppercase tracking-widest mb-0.5">First Seen</p>
                  <p className="text-xs font-bold text-white leading-none">Oct 12, 2023</p>
               </div>
            </div>
         </div>
      </div>

      {/* CRM Actions */}
      <div className="p-8 space-y-4">
         <h4 className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Quick CRM Actions</h4>
         <button className="w-full p-4 bg-bg-surface3 border border-border rounded-[1.25rem] text-left hover:border-brand/40 transition-all group">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-lg bg-bg-surface flex items-center justify-center text-text-muted group-hover:text-brand transition-colors">
                  <Terminal size={14} />
               </div>
               <span className="text-[10px] font-black text-white uppercase tracking-widest">Assign Agent</span>
            </div>
         </button>
         <button className="w-full p-4 bg-bg-surface3 border border-border rounded-[1.25rem] text-left hover:border-brand/40 transition-all group">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-lg bg-bg-surface flex items-center justify-center text-text-muted group-hover:text-brand transition-colors">
                  <MessageSquare size={14} />
               </div>
               <span className="text-[10px] font-black text-white uppercase tracking-widest">Send Campaign</span>
            </div>
         </button>
      </div>
    </div>
  );
}
