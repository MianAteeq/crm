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
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto overflow-y-hidden custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60">
              <th className="p-4 w-12 text-center">
                <button 
                  onClick={onSelectAll}
                  className={`w-4 h-4 rounded border transition-all flex items-center justify-center mx-auto ${
                    allSelected ? 'bg-slate-900 border-slate-900' : 'border-slate-300 bg-white hover:border-slate-400'
                  }`}
                  aria-label="Select all"
                >
                  {allSelected && <div className="w-1.5 h-1.5 bg-white rounded-sm" />}
                </button>
              </th>
              <th className="p-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Contact & Type</th>
              <th className="p-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Business</th>
              <th className="p-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Category</th>
              <th className="p-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">Email Status</th>
              <th className="p-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Last Campaign</th>
              <th className="p-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">Lead Score</th>
              <th className="p-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right pr-6">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <AnimatePresence mode="popLayout">
              {(!contacts || contacts.length === 0) ? (
                <tr>
                  <td colSpan={8} className="p-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-200 shadow-inner">
                        <Building size={22} />
                      </div>
                      <h3 className="text-sm font-bold text-slate-900">No matching contacts</h3>
                      <p className="text-xs text-slate-500 max-w-sm">Try refining your category, email status, or campaign filter to see results.</p>
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
                      className={`group hover:bg-slate-50/60 transition-colors cursor-pointer ${
                        isSelected ? 'bg-slate-50/90' : ''
                      }`}
                      onClick={() => onView(contact)}
                    >
                      {/* Checkbox */}
                      <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <button 
                          onClick={() => onSelect(String(contact.id))}
                          className={`w-4 h-4 rounded border transition-all flex items-center justify-center mx-auto ${
                            isSelected ? 'bg-slate-900 border-slate-900' : 'border-slate-300 bg-white group-hover:border-slate-400'
                          }`}
                          aria-label={`Select ${contact.name}`}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-sm" />}
                        </button>
                      </td>

                      {/* Contact Info & Contact Type */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-slate-100 flex-shrink-0 flex items-center justify-center text-xs font-bold text-slate-600 border border-slate-200 shadow-xs">
                            {(contact.name || 'C').charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0 max-w-[220px]">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-slate-900 truncate tracking-tight">{contact.name || 'Unnamed Contact'}</h4>
                              <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-slate-100 text-slate-600 border border-slate-200">
                                {contactType}
                              </span>
                            </div>
                            <div className="flex flex-col gap-0.5 mt-1">
                              {contact.email && (
                                <div className="flex items-center gap-1.5 text-xs text-slate-500 truncate">
                                  <Mail size={12} className="text-slate-400 flex-shrink-0" />
                                  <span className="truncate">{contact.email}</span>
                                </div>
                              )}
                              {contact.phone && (
                                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                                  <Phone size={11} className="text-slate-400 flex-shrink-0" />
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
                              <p className="text-xs font-bold text-slate-900 truncate tracking-tight">{businessName}</p>
                              {contact.business?.city && (
                                <p className="text-[11px] text-slate-400 truncate mt-0.5">
                                  {contact.business.city}{contact.business.country ? `, ${contact.business.country}` : ''}
                                </p>
                              )}
                            </>
                          ) : (
                            <span className="text-xs text-slate-400 italic">No business linked</span>
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
                                className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100 whitespace-nowrap"
                              >
                                {cat.name}
                              </span>
                            ))
                          ) : primaryCategory ? (
                            <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                              {primaryCategory}
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-400 italic">Uncategorized</span>
                          )}
                          {contact.categories && contact.categories.length > 2 && (
                            <span className="text-[10px] text-slate-400 font-bold px-1 self-center">
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
                              <p className="text-xs font-semibold text-slate-900 truncate">{contact.last_campaign}</p>
                              <p className="text-[10px] text-slate-400 mt-0.5">{contact.last_email || 'Recent'}</p>
                            </>
                          ) : (
                            <span className="text-[11px] text-slate-400 italic">Never emailed</span>
                          )}
                        </div>
                      </td>

                      {/* Lead Score */}
                      <td className="p-4 text-center">
                        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-xs font-black">
                          <Sparkles size={11} className="text-amber-500" />
                          <span>{leadScore}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right pr-6" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button 
                            onClick={() => onView(contact)}
                            className="p-1.5 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-all cursor-pointer"
                            title="View Contact & Email History"
                          >
                            <Eye size={16} />
                          </button>
                          {onDelete && (
                            <button 
                              onClick={() => onDelete(contact.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-all cursor-pointer"
                              title="Delete Contact"
                            >
                              <Trash2 size={16} />
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
