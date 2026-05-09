import React, { useState } from 'react';
import { X, Phone, Mail, MessageSquare, Edit3, Trash2, Calendar, Globe, Clock, Copy, Check, Zap, ArrowUpRight, Inbox, Filter, Building, Briefcase, MapPin } from 'lucide-react';
import { Contact, Tag as TagType } from '../../types';
import TagBadge from './TagBadge';
import { motion, AnimatePresence } from 'motion/react';
import { formatSafeDate } from '../../lib/utils';

interface ContactDrawerProps {
  contact: Contact | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (contact: Contact) => void;
  onDelete: (id: string) => void;
  availableTags: TagType[];
}

type Tab = 'profile' | 'activity' | 'campaigns' | 'notes';

export default function ContactDrawer({ contact, isOpen, onClose, onEdit, onDelete, availableTags }: ContactDrawerProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('profile');

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!contact) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
            <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 w-full max-w-lg h-full bg-white border-l border-slate-200 z-[101] flex flex-col shadow-[0_0_50px_-12px_rgba(0,0,0,0.3)] shadow-slate-900/20"
          >
            {/* Header */}
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
               <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-2xl font-bold text-slate-400 shadow-sm">
                    {(contact.name || "").charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">{contact.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                       <span className="text-xs text-slate-500 font-bold tracking-tight">{contact.job_title || 'Business Professional'}</span>
                       {contact.company && (
                         <>
                           <div className="w-1 h-1 rounded-full bg-slate-300" />
                           <span className="text-xs text-slate-400 font-bold tracking-tight">{contact.company}</span>
                         </>
                       )}
                    </div>
                  </div>
               </div>
               <div className="flex items-center gap-2">
                  <button onClick={() => onEdit(contact)} className="p-2.5 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all">
                     <Edit3 size={18} />
                  </button>
                  <button onClick={onClose} className="p-2.5 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all">
                     <X size={20} />
                  </button>
               </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-100 bg-white px-8 overflow-x-auto no-scrollbar gap-8">
               {(['profile', 'activity', 'campaigns', 'notes'] as Tab[]).map((tab) => (
                 <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-4 text-xs font-bold transition-all whitespace-nowrap relative ${
                      activeTab === tab ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'
                    }`}
                 >
                    <span className="capitalize">{tab}</span>
                    {activeTab === tab && (
                      <motion.div layoutId="activeTabDrawer" className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 rounded-t-full" />
                    )}
                 </button>
               ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-8">
               {activeTab === 'profile' && (
                 <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                    {/* Basic Info Grid */}
                    <div className="grid grid-cols-1 gap-4">
                       {[
                          { icon: Phone, label: 'Phone Number', value: contact.phone, action: () => copyToClipboard(contact.phone) },
                          { icon: Mail, label: 'Email Address', value: contact.email || 'Not provided', action: contact.email ? () => copyToClipboard(contact.email) : undefined },
                          { icon: Building, label: 'Company', value: contact.company || 'Not provided' },
                          { icon: Briefcase, label: 'Job Title', value: contact.job_title || 'Not provided' },
                          { icon: MapPin, label: 'Address', value: contact.address || 'Not provided' },
                          { icon: Calendar, label: 'Birthday', value: contact.birthday || 'Not provided' },
                          { icon: Globe, label: 'Website', value: contact.website || 'Not provided', isLink: !!contact.website }
                       ].map((item, i) => (
                          <div key={i} className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between group hover:bg-slate-100/50 transition-colors">
                             <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 shadow-sm">
                                   <item.icon size={18} />
                                </div>
                                <div>
                                   <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 leading-none">{item.label}</p>
                                   {item.isLink ? (
                                     <a href={item.value} target="_blank" rel="noreferrer" className="text-sm font-bold text-slate-900 hover:underline mt-1 block tracking-tight">{item.value}</a>
                                   ) : (
                                     <p className="text-sm font-bold text-slate-900 mt-1 tracking-tight">{item.value}</p>
                                   )}
                                </div>
                             </div>
                             {item.action && (
                                <button 
                                  onClick={item.action} 
                                  className="p-2 rounded-lg bg-white border border-slate-100 text-slate-400 hover:text-slate-900 hover:border-slate-200 transition-all opacity-0 group-hover:opacity-100 shadow-sm"
                                >
                                   {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                                </button>
                             )}
                          </div>
                       ))}
                    </div>

                    <div className="p-6 bg-slate-900 rounded-2xl shadow-xl shadow-slate-900/10">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white">
                             <Clock size={20} />
                          </div>
                          <div>
                             <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 leading-none">Contact Lifecycle</p>
                             <p className="text-sm font-bold text-white mt-1.5 tracking-tight">Joined on {formatSafeDate(contact.createdAt || contact.addedDate || contact.created_at)}</p>
                          </div>
                       </div>
                    </div>
                 </motion.div>
               )}

               {activeTab === 'activity' && (
                 <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                    {/* Activity Timeline */}
                    <div className="space-y-6 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-100">
                       {[
                          { icon: MessageSquare, label: 'Incoming WhatsApp Message', desc: '"I want to upgrade my plan"', date: '2 hours ago', color: 'text-slate-900' },
                          { icon: Inbox, label: 'Promotional Campaign Sent', desc: 'Summer Flash Sale', date: 'Yesterday', color: 'text-emerald-500' },
                          { icon: Filter, label: 'Added to Segment', desc: 'Top Spenders', date: '3 days ago', color: 'text-blue-500' },
                          { icon: Globe, label: 'Automation Triggered', desc: 'Welcome Journey #1', date: '4 days ago', color: 'text-amber-500' }
                       ].map((item, i) => (
                          <div key={i} className="flex gap-6 relative">
                             <div className={`w-9 h-9 rounded-xl bg-white border border-slate-100 flex items-center justify-center ${item.color} z-10 shadow-sm`}>
                                <item.icon size={16} />
                             </div>
                             <div className="py-1">
                                <p className="text-sm font-bold text-slate-900 leading-none tracking-tight">{item.label}</p>
                                <p className="text-xs text-slate-500 font-medium mt-2 leading-relaxed">{item.desc}</p>
                                <div className="flex items-center gap-2 mt-2.5">
                                   <Clock size={12} className="text-slate-300" />
                                   <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">{item.date}</span>
                                </div>
                             </div>
                          </div>
                       ))}
                    </div>
                 </motion.div>
               )}

               {activeTab === 'campaigns' && (
                 <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                       <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Enrollment History ({contact.campaigns?.length || 0})</h3>
                       <Zap size={14} className="text-amber-500" />
                    </div>
                    {contact.campaigns && contact.campaigns.length > 0 ? (
                      <div className="space-y-2">
                        {contact.campaigns.map((camp) => (
                           <div key={camp.id} className="p-4 bg-white border border-slate-100 rounded-xl flex items-center justify-between group hover:border-slate-200 transition-all hover:shadow-sm">
                              <div>
                                 <p className="text-sm font-bold text-slate-900 tracking-tight">{camp.name}</p>
                                 <p className="text-[10px] text-slate-400 font-bold uppercase mt-1.5 tracking-tight">{camp.timestamp}</p>
                              </div>
                              <div className="flex items-center gap-3">
                                 <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold border ${
                                   camp.status === 'read' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-50 border-slate-200 text-slate-500'
                                 }`}>
                                    <span className="capitalize">{camp.status}</span>
                                 </span>
                                 <ArrowUpRight size={14} className="text-slate-300 group-hover:text-slate-900 transition-colors" />
                              </div>
                           </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-12 border-2 border-dashed border-slate-100 rounded-2xl text-center flex flex-col items-center gap-3">
                         <Inbox className="text-slate-200" size={32} />
                         <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No enrollment data</p>
                      </div>
                    )}
                 </motion.div>
               )}

               {activeTab === 'notes' && (
                 <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    <div className="flex items-center justify-between">
                       <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Internal Notes</h3>
                       <button className="text-[10px] font-bold uppercase text-slate-900 hover:underline">Edit Note</button>
                    </div>
                    <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl min-h-[200px]">
                       <p className="text-sm leading-relaxed text-slate-600 font-medium">
                          {contact.notes || 'Start typing internal notes for support team...'}
                       </p>
                    </div>
                 </motion.div>
               )}

               {/* Tags Section (Always visible bottom) */}
               <div className="pt-8 border-t border-slate-100 space-y-4">
                  <h3 className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">Tags & Labels</h3>
                  <div className="flex flex-wrap gap-2">
                     {(contact.tags || []).map((tag, idx) => (
                       <TagBadge key={typeof tag === 'object' ? (tag as any).id || idx : tag} tag={tag} availableTags={availableTags} className="!text-[10px] py-1 px-3" />
                     ))}
                     <button className="p-1 w-6 h-6 rounded-lg border border-dashed border-slate-200 text-slate-400 hover:border-slate-400 hover:text-slate-600 transition-all flex items-center justify-center">
                        <ArrowUpRight size={12} />
                     </button>
                  </div>
               </div>
            </div>

            {/* Footer Actions */}
            <div className="p-8 border-t border-slate-100 bg-slate-50/50 grid grid-cols-2 gap-4">
               <button 
                  onClick={() => onDelete(contact.id)}
                  className="flex items-center justify-center gap-2 px-4 py-4 bg-white border border-slate-200 rounded-xl text-[11px] font-bold uppercase tracking-widest text-red-500 hover:bg-red-50 hover:border-red-100 transition-all shadow-sm"
               >
                  <Trash2 size={16} /> Delete
               </button>
               <button 
                className="flex items-center justify-center gap-2 px-4 py-4 bg-slate-900 text-white rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10"
               >
                  <MessageSquare size={16} /> Reply Now
               </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
