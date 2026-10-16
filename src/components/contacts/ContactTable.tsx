import React from 'react';
import { Phone, Mail, Building, Tag as TagIcon, Sparkles, Trash2, Eye, ExternalLink } from 'lucide-react';
import { Contact, Tag as TagType } from '../../types';
import TagBadge from './TagBadge';
import { motion, AnimatePresence } from 'motion/react';

interface ContactTableProps {
  contacts: Contact[];
  availableTags?: TagType[];
  selectedIds: string[];
  onSelect: (id: string) => void;
  onSelectAll: () => void;
  onView: (contact: Contact) => void;
  onDelete?: (id: string | number) => void;
}

export default function ContactTable({ 
  contacts = [], 
  availableTags = [], 
  selectedIds, 
  onSelect, 
  onSelectAll, 
  onView, 
  onDelete 
}: ContactTableProps) {
  const allSelected = (contacts || []).length > 0 && selectedIds.length === (contacts || []).length;

  const getEmailStatusBadge = (status?: string) => {
    const s = (status || 'Never Sent').toLowerCase();
    if (s === 'delivered') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Delivered
        </span>
      );
    }
    if (s === 'sent') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          Sent
        </span>
      );
    }
    if (s === 'bounced') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          Bounced
        </span>
      );
    }
    if (s === 'failed') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
          Failed
        </span>
      );
    }
    if (s === 'unsubscribed') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
          Unsubscribed
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
        Never Sent
      </span>
    );
  };

  return (
    <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto overflow-y-hidden custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="border-b border-stone-200 bg-[#FAFAF9]">
              <th className="p-4 w-12 text-center">
                <button 
                  onClick={onSelectAll}
                  className={`w-4 h-4 rounded border transition-all flex items-center justify-center mx-auto ${
                    allSelected ? 'bg-[#12263A] border-[#12263A]' : 'border-stone-300 bg-white hover:border-[#166534]'
                  }`}
                  aria-label="Select all"
                >
                  {allSelected && <div className="w-1.5 h-1.5 bg-white rounded-sm" />}
                </button>
              </th>
              <th className="p-4 text-[11px] font-bold text-[#57534E] uppercase tracking-wider">Contact & Type</th>
              <th className="p-4 text-[11px] font-bold text-[#57534E] uppercase tracking-wider">Business</th>
              <th className="p-4 text-[11px] font-bold text-[#57534E] uppercase tracking-wider">Category</th>
              <th className="p-4 text-[11px] font-bold text-[#57534E] uppercase tracking-wider text-center">Email Status</th>
              <th className="p-4 text-[11px] font-bold text-[#57534E] uppercase tracking-wider">Last Campaign</th>
              <th className="p-4 text-[11px] font-bold text-[#57534E] uppercase tracking-wider text-center">Lead Score</th>
              <th className="p-4 text-[11px] font-bold text-[#57534E] uppercase tracking-wider text-right pr-6">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            <AnimatePresence mode="popLayout">
              {(!contacts || contacts.length === 0) ? (
                <tr>
                  <td colSpan={8} className="p-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[#FAFAF9] flex items-center justify-center text-stone-400 border border-stone-200 shadow-inner">
                        <Building size={22} />
                      </div>
                      <h3 className="text-sm font-bold text-[#12263A]">No matching contacts</h3>
                      <p className="text-xs text-[#57534E] max-w-sm">Try refining your category, email status, or campaign filter to see results.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                contacts.map((contact) => {
                  const isSelected = selectedIds.includes(String(contact.id));
                  const businessName = contact.business_name || contact.company || contact.business?.business_name;
                  const primaryCategory = contact.category_name || (contact.categories && contact.categories[0]?.name);
                  const contactType = contact.contact_type || 'General';
                  const leadScore = typeof contact.lead_score === 'number' ? contact.lead_score : 0;

                  return (
                    <motion.tr 
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      key={contact.id} 
                      className={`group hover:bg-[#F0FDF4]/50 transition-colors cursor-pointer ${
                        isSelected ? 'bg-[#F0FDF4]/80' : ''
                      }`}
                      onClick={() => onView(contact)}
                    >
                      {/* Checkbox */}
                      <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <button 
                          onClick={() => onSelect(String(contact.id))}
                          className={`w-4 h-4 rounded border transition-all flex items-center justify-center mx-auto ${
                            isSelected ? 'bg-[#12263A] border-[#12263A]' : 'border-stone-300 bg-white group-hover:border-[#166534]'
                          }`}
                          aria-label={`Select ${contact.name}`}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-sm" />}
                        </button>
                      </td>

                      {/* Contact Info & Contact Type */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-[#F0FDF4] flex-shrink-0 flex items-center justify-center text-xs font-bold text-[#166534] border border-[#22C55E]/30 shadow-xs">
                            {(contact.name || 'C').charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0 max-w-[220px]">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-[#12263A] truncate tracking-tight">{contact.name || 'Unnamed Contact'}</h4>
                              <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-stone-100 text-[#57534E] border border-stone-200">
                                {contactType}
                              </span>
                            </div>
                            <div className="flex flex-col gap-0.5 mt-1">
                              {contact.email && (
                                <div className="flex items-center gap-1.5 text-xs text-[#57534E] truncate">
                                  <Mail size={12} className="text-stone-400 flex-shrink-0" />
                                  <span className="truncate">{contact.email}</span>
                                </div>
                              )}
                              {contact.phone && (
                                <div className="flex items-center gap-1.5 text-xs text-stone-500 font-mono">
                                  <Phone size={11} className="text-stone-400 flex-shrink-0" />
                                  <span>{contact.phone}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Business */}
                      <td className="p-4">
                        <div className="min-w-0 max-w-[190px]">
                          {businessName ? (
                            <>
                              <p className="text-xs font-bold text-[#12263A] truncate tracking-tight">{businessName}</p>
                              {contact.business?.city && (
                                <p className="text-[11px] text-[#57534E] truncate mt-0.5">
                                  {contact.business.city}{contact.business.country ? `, ${contact.business.country}` : ''}
                                </p>
                              )}
                            </>
                          ) : (
                            <span className="text-xs text-stone-400 italic">No business linked</span>
                          )}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1 max-w-[160px]">
                          {contact.categories && contact.categories.length > 0 ? (
                            contact.categories.slice(0, 2).map((cat) => (
                              <span 
                                key={cat.id} 
                                className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-[#F0FDF4] text-[#166534] border border-[#22C55E]/30 whitespace-nowrap"
                              >
                                {cat.name}
                              </span>
                            ))
                          ) : primaryCategory ? (
                            <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-[#F0FDF4] text-[#166534] border border-[#22C55E]/30">
                              {primaryCategory}
                            </span>
                          ) : (
                            <span className="text-[11px] text-stone-400 italic">Uncategorized</span>
                          )}
                          {contact.categories && contact.categories.length > 2 && (
                            <span className="text-[10px] text-stone-400 font-bold px-1 self-center">
                              +{contact.categories.length - 2}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Email Status */}
                      <td className="p-4 text-center">
                        <div className="inline-flex flex-col items-center gap-1">
                          {getEmailStatusBadge(contact.email_status || contact.delivery_status)}
                        </div>
                      </td>

                      {/* Last Campaign / Activity */}
                      <td className="p-4">
                        <div className="min-w-0 max-w-[180px]">
                          {contact.last_campaign ? (
                            <>
                              <p className="text-xs font-semibold text-[#12263A] truncate">{contact.last_campaign}</p>
                              <p className="text-[10px] text-[#57534E] mt-0.5">{contact.last_email || 'Recent'}</p>
                            </>
                          ) : (
                            <span className="text-[11px] text-stone-400 italic">Never emailed</span>
                          )}
                        </div>
                      </td>

                      {/* Lead Score */}
                      <td className="p-4 text-center">
                        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#F0FDF4] text-[#166534] border border-[#22C55E]/30 text-xs font-black">
                          <Sparkles size={11} className="text-[#22C55E]" />
                          <span>{leadScore}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right pr-6" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button 
                            onClick={() => onView(contact)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-[#166534] bg-white hover:bg-[#F0FDF4] border border-slate-200 hover:border-[#bbf7d0] transition-all cursor-pointer active:scale-90 shadow-xs"
                            title="View Contact & Email History"
                          >
                            <Eye size={15} />
                          </button>
                          {onDelete && (
                            <button 
                              onClick={() => onDelete(contact.id)}
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-rose-500 hover:text-white bg-rose-50/60 hover:bg-rose-600 border border-rose-100 hover:border-rose-600 transition-all cursor-pointer active:scale-90 shadow-xs"
                              title="Delete Contact"
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}
