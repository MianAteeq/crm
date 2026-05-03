import React from 'react';
import { MoreVertical, Phone, Mail, Clock, ShieldCheck, ShieldAlert, Zap, Ban } from 'lucide-react';
import { Contact } from '../../data/contactsMock';
import TagBadge from './TagBadge';
import { motion, AnimatePresence } from 'motion/react';

interface ContactTableProps {
  contacts: Contact[];
  selectedIds: string[];
  onSelect: (id: string) => void;
  onSelectAll: () => void;
  onView: (contact: Contact) => void;
}

export default function ContactTable({ contacts, selectedIds, onSelect, onSelectAll, onView }: ContactTableProps) {
  const allSelected = contacts.length > 0 && selectedIds.length === contacts.length;

  return (
    <div className="bg-bg-surface/30 border border-border rounded-3xl overflow-hidden backdrop-blur-xl">
      <div className="overflow-x-auto overflow-y-hidden custom-scrollbar">
        <table className="w-full text-left border-collapse table-fixed">
          <thead>
            <tr className="border-b border-border bg-bg-surface2/30">
              <th className="p-5 w-14">
                <button 
                  onClick={onSelectAll}
                  className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${
                    allSelected ? 'bg-brand border-brand' : 'border-border bg-bg-surface'
                  }`}
                >
                  {allSelected && <div className="w-2 h-2 bg-white rounded-sm" />}
                </button>
              </th>
              <th className="p-5 text-[10px] font-black text-text-muted uppercase tracking-widest w-[250px]">Contact Info</th>
              <th className="p-5 text-[10px] font-black text-text-muted uppercase tracking-widest text-center w-[200px]">Tags</th>
              <th className="p-5 text-[10px] font-black text-text-muted uppercase tracking-widest w-[140px]">Last Activity</th>
              <th className="p-5 text-[10px] font-black text-text-muted uppercase tracking-widest text-center w-[120px]">Campaigns</th>
              <th className="p-5 text-[10px] font-black text-text-muted uppercase tracking-widest text-center w-[120px]">Status</th>
              <th className="p-5 text-[10px] font-black text-text-muted uppercase tracking-widest text-right w-[80px]">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            <AnimatePresence mode="popLayout">
              {contacts.length === 0 ? (
                <tr>
                   <td colSpan={7} className="p-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                         <div className="w-16 h-16 rounded-full bg-bg-surface2 flex items-center justify-center text-text-muted">
                            <Phone size={32} />
                         </div>
                         <h3 className="text-sm font-bold text-white">No contacts found</h3>
                         <p className="text-xs text-text-muted">Try adjusting your filters or search query.</p>
                      </div>
                   </td>
                </tr>
              ) : (
                contacts.map((contact) => (
                  <motion.tr 
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key={contact.id} 
                    className={`group hover:bg-white/[0.02] transition-colors cursor-pointer ${
                      selectedIds.includes(contact.id) ? 'bg-brand/5' : ''
                    }`}
                    onClick={() => onView(contact)}
                  >
                    <td className="p-5" onClick={(e) => e.stopPropagation()}>
                      <button 
                         onClick={() => onSelect(contact.id)}
                         className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${
                           selectedIds.includes(contact.id) ? 'bg-brand border-brand' : 'border-border bg-bg-surface'
                         }`}
                      >
                         {selectedIds.includes(contact.id) && <div className="w-2 h-2 bg-white rounded-sm" />}
                      </button>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-3 overflow-hidden">
                         <div className="w-10 h-10 rounded-2xl bg-bg-surface3 border border-border flex flex-shrink-0 items-center justify-center text-xs font-black text-brand group-hover:scale-105 transition-transform">
                            {contact.name.charAt(0)}
                         </div>
                         <div className="min-w-0">
                            <h4 className="text-sm font-bold text-white truncate">{contact.name}</h4>
                            <div className="flex items-center gap-3 mt-1 overflow-hidden">
                               <span className="text-[10px] text-text-muted flex items-center gap-1 flex-shrink-0">
                                  <Phone size={10} className="text-brand" /> {contact.phone}
                               </span>
                               {contact.email && (
                                 <span className="text-[10px] text-text-muted flex items-center gap-1 truncate">
                                    <Mail size={10} /> {contact.email}
                                 </span>
                               )}
                            </div>
                         </div>
                      </div>
                    </td>
                    <td className="p-5">
                       <div className="flex flex-wrap justify-center gap-1.5 max-w-[200px] mx-auto">
                          {contact.tags.slice(0, 2).map(tag => (
                            <TagBadge key={tag} tag={tag} />
                          ))}
                          {contact.tags.length > 2 && (
                            <span className="text-[8px] font-black text-text-muted uppercase">+ {contact.tags.length - 2} more</span>
                          )}
                       </div>
                    </td>
                    <td className="p-5">
                       <div className="flex items-center gap-2 text-[10px] font-bold text-text-muted whitespace-nowrap">
                          <Clock size={12} className="text-brand" />
                          {contact.lastContacted}
                       </div>
                    </td>
                    <td className="p-5 text-center">
                       <div className="flex items-center justify-center gap-2 px-3 py-1 bg-bg-surface border border-border rounded-xl text-[10px] font-black text-white">
                          <Zap size={10} className="text-amber-500" />
                          {contact.totalCampaigns}
                       </div>
                    </td>
                    <td className="p-5">
                       <div className="flex justify-center">
                          {contact.status === 'active' && (
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-500/20">
                               <ShieldCheck size={10} /> Active
                            </div>
                          )}
                          {contact.status === 'inactive' && (
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-rose-500/10 text-rose-500 rounded-full text-[9px] font-black uppercase tracking-widest border border-rose-500/20">
                               <ShieldAlert size={10} /> Inactive
                            </div>
                          )}
                          {contact.status === 'blocked' && (
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-zinc-800 text-zinc-400 rounded-full text-[9px] font-black uppercase tracking-widest border border-zinc-700">
                               <Ban size={10} /> Blocked
                            </div>
                          )}
                       </div>
                    </td>
                    <td className="p-5 text-right">
                       <button className="p-2 text-text-muted hover:text-white hover:bg-bg-surface border border-transparent hover:border-border rounded-xl transition-all">
                          <MoreVertical size={16} />
                       </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}
