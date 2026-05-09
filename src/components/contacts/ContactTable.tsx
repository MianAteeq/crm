import React from 'react';
import { MoreVertical, Phone, Mail, ShieldCheck, ShieldAlert, Ban, Users } from 'lucide-react';
import { Contact, Tag as TagType } from '../../types';
import TagBadge from './TagBadge';
import { motion, AnimatePresence } from 'motion/react';

interface ContactTableProps {
  contacts: Contact[];
  availableTags: TagType[];
  selectedIds: string[];
  onSelect: (id: string) => void;
  onSelectAll: () => void;
  onView: (contact: Contact) => void;
}

export default function ContactTable({ contacts = [], availableTags = [], selectedIds, onSelect, onSelectAll, onView }: ContactTableProps) {
  const allSelected = (contacts || []).length > 0 && selectedIds.length === (contacts || []).length;

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto overflow-y-hidden custom-scrollbar">
        <table className="w-full text-left border-collapse table-fixed">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <th className="p-4 w-[5%] text-center">
                <button 
                  onClick={onSelectAll}
                  className={`w-4 h-4 rounded border transition-all flex items-center justify-center mx-auto ${
                    allSelected ? 'bg-slate-900 border-slate-900' : 'border-slate-300 bg-white'
                  }`}
                >
                  {allSelected && <div className="w-1.5 h-1.5 bg-white rounded-sm" />}
                </button>
              </th>
              <th className="p-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest w-[30%]">Contact Info</th>
              <th className="p-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center w-[20%]">Last Message</th>
              <th className="p-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center w-[15%]">Tags</th>
              <th className="p-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center w-[10%]">Joined</th>
              <th className="p-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center w-[10%]">Status</th>
              <th className="p-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right w-[10%]"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            <AnimatePresence mode="popLayout">
              {(!contacts || contacts.length === 0) ? (
                <tr>
                   <td colSpan={5} className="p-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                         <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 border border-slate-100 shadow-inner">
                            <Users size={24} />
                         </div>
                         <h3 className="text-sm font-bold text-slate-900">No matching contacts</h3>
                         <p className="text-xs text-slate-500">Refine your search or add a new contact to your list.</p>
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
                    className={`group hover:bg-slate-50/50 transition-colors cursor-pointer ${
                      selectedIds.includes(contact.id) ? 'bg-slate-50' : ''
                    }`}
                    onClick={() => onView(contact)}
                  >
                    <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <button 
                         onClick={() => onSelect(contact.id)}
                         className={`w-4 h-4 rounded border transition-all flex items-center justify-center mx-auto ${
                           selectedIds.includes(contact.id) ? 'bg-slate-900 border-slate-900' : 'border-slate-300 bg-white group-hover:border-slate-400'
                         }`}
                      >
                         {selectedIds.includes(contact.id) && <div className="w-1.5 h-1.5 bg-white rounded-sm" />}
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3 overflow-hidden">
                         <div className="w-9 h-9 rounded-lg bg-slate-100 flex-shrink-0 flex items-center justify-center text-xs font-bold text-slate-500 border border-slate-200">
                            {(contact.name || "").charAt(0)}
                         </div>
                         <div className="min-w-0">
                            <h4 className="text-sm font-bold text-slate-900 truncate tracking-tight">{contact.name}</h4>
                            <div className="flex items-center gap-2 mt-0.5 overflow-hidden">
                               <span className="text-[10px] text-slate-500 font-medium whitespace-nowrap">
                                  {contact.phone}
                               </span>
                               {contact.email && (
                                 <>
                                   <div className="w-1 h-1 rounded-full bg-slate-300" />
                                   <span className="text-[10px] text-slate-400 font-medium truncate">
                                      {contact.email}
                                   </span>
                                 </>
                               )}
                            </div>
                         </div>
                      </div>
                    </td>
                    <td className="p-4">
                       <div className="flex flex-col justify-center max-w-[150px] mx-auto overflow-hidden">
                          <p className="text-[11px] text-slate-500 truncate font-medium italic">
                            {contact.last_message || "No messages yet"}
                          </p>
                       </div>
                    </td>
                    <td className="p-4">
                       <div className="flex flex-wrap justify-center gap-1 max-w-[180px] mx-auto">
                          {(contact.tags || []).slice(0, 2).map((tag, idx) => (
                            <TagBadge key={typeof tag === 'object' ? (tag as any).id || idx : tag} tag={tag} availableTags={availableTags} />
                          ))}
                          {(contact.tags || []).length > 2 && (
                            <span className="text-[9px] font-bold text-slate-400 px-1">+ {contact.tags.length - 2}</span>
                          )}
                       </div>
                    </td>
                    <td className="p-4 text-center">
                       <span className="text-[10px] font-bold text-slate-500 uppercase">
                          {contact.created_at ? new Date(contact.created_at).toLocaleDateString() : 'N/A'}
                       </span>
                    </td>
                    <td className="p-4">
                       <div className="flex justify-center">
                          {contact.status === 'active' && (
                            <div className="px-2 py-0.5 bg-green-50 text-green-700 rounded-full text-[9px] font-bold border border-green-100">
                               Active
                            </div>
                          )}
                          {contact.status === 'archived' && (
                            <div className="px-2 py-0.5 bg-slate-50 text-slate-500 rounded-full text-[9px] font-bold border border-slate-200">
                               Inactive
                            </div>
                          )}
                          {contact.status === 'unsubscribed' && (
                            <div className="px-2 py-0.5 bg-red-50 text-red-700 rounded-full text-[9px] font-bold border border-red-100">
                               Blocked
                            </div>
                          )}
                       </div>
                    </td>
                    <td className="p-4 text-right">
                       <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              onView(contact); // Open drawer
                            }}
                            className="p-1.5 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-all opacity-0 group-hover:opacity-100"
                          >
                             <Users size={16} />
                          </button>
                       </div>
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
