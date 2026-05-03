import React, { useState } from 'react';
import { X, Phone, Mail, MessageSquare, Edit3, Trash2, Calendar, Globe, Clock, Copy, Check, Zap, ArrowUpRight, Inbox, Filter, Building, Briefcase, MapPin } from 'lucide-react';
import { Contact } from '../../data/contactsMock';
import TagBadge from './TagBadge';
import { motion, AnimatePresence } from 'motion/react';

interface ContactDrawerProps {
  contact: Contact | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (contact: Contact) => void;
  onDelete: (id: string) => void;
}

type Tab = 'profile' | 'activity' | 'campaigns' | 'notes';

export default function ContactDrawer({ contact, isOpen, onClose, onEdit, onDelete }: ContactDrawerProps) {
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
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 w-full max-w-lg h-full bg-bg-surface border-l border-border z-[101] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-8 border-b border-border flex items-center justify-between bg-bg-surface2/20">
               <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-3xl bg-bg-surface3 border-2 border-border flex items-center justify-center text-2xl font-black text-brand shadow-inner">
                    {contact.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white uppercase tracking-tight">{contact.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                       <span className="text-[10px] text-text-muted font-black uppercase tracking-widest leading-none">{contact.jobTitle || 'Contact'}</span>
                       {contact.company && (
                         <>
                           <div className="w-1 h-1 rounded-full bg-border" />
                           <span className="text-[10px] text-text-muted font-black uppercase tracking-widest leading-none">{contact.company}</span>
                         </>
                       )}
                    </div>
                  </div>
               </div>
               <div className="flex items-center gap-2">
                  <button onClick={() => onEdit(contact)} className="p-2.5 rounded-xl bg-bg-surface3 border border-border text-text-muted hover:text-white transition-all">
                     <Edit3 size={18} />
                  </button>
                  <button onClick={onClose} className="p-2.5 rounded-xl bg-bg-surface3 border border-border text-text-muted hover:text-white transition-all">
                     <X size={20} />
                  </button>
               </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-border bg-bg-surface px-6 overflow-x-auto no-scrollbar">
               {(['profile', 'activity', 'campaigns', 'notes'] as Tab[]).map((tab) => (
                 <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-4 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all whitespace-nowrap ${
                      activeTab === tab ? 'border-brand text-brand' : 'border-transparent text-text-muted hover:text-white'
                    }`}
                 >
                    {tab}
                 </button>
               ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-8">
               {activeTab === 'profile' && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                    {/* Basic Info Grid */}
                    <div className="grid grid-cols-1 gap-4">
                       {[
                          { icon: Phone, label: 'Phone Number', value: contact.phone, action: () => copyToClipboard(contact.phone) },
                          { icon: Mail, label: 'Email Address', value: contact.email || 'Not provided', action: contact.email ? () => copyToClipboard(contact.email) : undefined },
                          { icon: Building, label: 'Company', value: contact.company || 'Not provided' },
                          { icon: Briefcase, label: 'Job Title', value: contact.jobTitle || 'Not provided' },
                          { icon: MapPin, label: 'Address', value: contact.address || 'Not provided' },
                          { icon: Calendar, label: 'Birthday', value: contact.birthday || 'Not provided' },
                          { icon: Globe, label: 'Website', value: contact.website || 'Not provided', isLink: !!contact.website }
                       ].map((item, i) => (
                          <div key={i} className="p-4 bg-bg-surface3 border border-border rounded-2xl flex items-center justify-between group">
                             <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-bg-surface border border-border flex items-center justify-center text-brand">
                                   <item.icon size={18} />
                                </div>
                                <div>
                                   <p className="text-[9px] font-black uppercase tracking-widest text-text-muted">{item.label}</p>
                                   {item.isLink ? (
                                     <a href={item.value} target="_blank" rel="noreferrer" className="text-xs font-bold text-brand hover:underline mt-0.5 block">{item.value}</a>
                                   ) : (
                                     <p className="text-xs font-bold text-white mt-0.5">{item.value}</p>
                                   )}
                                </div>
                             </div>
                             {item.action && (
                                <button 
                                  onClick={item.action} 
                                  className="p-2 rounded-lg bg-bg-surface border border-border text-text-muted hover:text-white transition-all opacity-0 group-hover:opacity-100"
                                >
                                   {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                                </button>
                             )}
                          </div>
                       ))}
                    </div>

                    <div className="p-6 bg-brand/5 border border-brand/20 rounded-3xl">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-brand/10 flex items-center justify-center text-brand">
                             <Clock size={20} />
                          </div>
                          <div>
                             <p className="text-[10px] font-black uppercase tracking-widest text-brand">Contact Lifecycle</p>
                             <p className="text-xs font-bold text-white mt-1">Joined throbtech on {new Date(contact.addedDate).toLocaleDateString()}</p>
                          </div>
                       </div>
                    </div>
                 </motion.div>
               )}

               {activeTab === 'activity' && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                    {/* Activity Timeline */}
                    <div className="space-y-6 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-[2px] before:bg-border">
                       {[
                          { icon: MessageSquare, label: 'Incoming WhatsApp Message', desc: '"I want to upgrade my plan"', date: '2 hours ago', color: 'text-brand' },
                          { icon: Inbox, label: 'Promotional Campaign Sent', desc: 'Summer Flash Sale', date: 'Yesterday', color: 'text-emerald-500' },
                          { icon: Filter, label: 'Added to Segment', desc: 'Top Spenders', date: '3 days ago', color: 'text-blue-500' },
                          { icon: Globe, label: 'Automation Triggered', desc: 'Welcome Journey #1', date: '4 days ago', color: 'text-amber-500' }
                       ].map((item, i) => (
                          <div key={i} className="flex gap-6 relative">
                             <div className={`w-9 h-9 rounded-xl bg-bg-surface3 border border-border flex items-center justify-center ${item.color} z-10 shadow-sm`}>
                                <item.icon size={16} />
                             </div>
                             <div className="py-1">
                                <p className="text-xs font-bold text-white leading-none">{item.label}</p>
                                <p className="text-[10px] text-text-muted font-medium mt-1.5">{item.desc}</p>
                                <div className="flex items-center gap-2 mt-2">
                                   <Clock size={10} className="text-text-muted" />
                                   <span className="text-[9px] text-text-muted font-black uppercase tracking-widest">{item.date}</span>
                                </div>
                             </div>
                          </div>
                       ))}
                    </div>
                 </motion.div>
               )}

               {activeTab === 'campaigns' && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                       <h3 className="text-[10px] font-black text-text-muted uppercase tracking-widest">Enrollment History ({contact.campaigns.length})</h3>
                       <Zap size={14} className="text-amber-500" />
                    </div>
                    {contact.campaigns.length > 0 ? (
                      <div className="space-y-3">
                        {contact.campaigns.map((camp) => (
                           <div key={camp.id} className="p-4 bg-bg-surface3 border border-border rounded-2xl flex items-center justify-between group hover:border-brand/40 transition-all">
                              <div>
                                 <p className="text-xs font-bold text-white">{camp.name}</p>
                                 <p className="text-[9px] text-text-muted font-black uppercase tracking-widest mt-1">{camp.timestamp}</p>
                              </div>
                              <div className="flex items-center gap-3">
                                 <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest border ${
                                   camp.status === 'read' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-bg-surface border-border text-text-muted'
                                 }`}>
                                    {camp.status}
                                 </span>
                                 <ArrowUpRight size={14} className="text-text-muted group-hover:text-brand transition-colors" />
                              </div>
                           </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-12 border-2 border-dashed border-border rounded-3xl text-center flex flex-col items-center gap-2">
                         <Inbox className="text-text-muted opacity-20" size={32} />
                         <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">No campaign data available</p>
                      </div>
                    )}
                 </motion.div>
               )}

               {activeTab === 'notes' && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <div className="flex items-center justify-between">
                       <h3 className="text-[10px] font-black text-text-muted uppercase tracking-widest">Internal Notes</h3>
                       <button className="text-[10px] font-black uppercase text-brand">Edit Note</button>
                    </div>
                    <div className="p-6 bg-bg-surface3 border border-border rounded-[2rem] min-h-[200px]">
                       <p className="text-xs leading-relaxed text-text-muted font-medium italic">
                          {contact.notes || 'Start typing internal notes for support team...'}
                       </p>
                    </div>
                 </motion.div>
               )}

               {/* Tags Section (Always visible bottom) */}
               <div className="pt-8 border-t border-border space-y-4">
                  <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Contact Labels</h3>
                  <div className="flex flex-wrap gap-2">
                     {contact.tags.map(tag => (
                       <TagBadge key={tag} tag={tag} className="!text-[10px] py-1 px-3" />
                     ))}
                     <button className="p-1.5 rounded-lg border border-dashed border-border text-text-muted hover:border-brand hover:text-brand transition-all">
                        <ArrowUpRight size={14} />
                     </button>
                  </div>
               </div>
            </div>

            {/* Footer Actions */}
            <div className="p-8 border-t border-border bg-bg-surface2/40 grid grid-cols-2 gap-4">
               <button 
                  onClick={() => onDelete(contact.id)}
                  className="flex items-center justify-center gap-2 px-4 py-4 bg-bg-surface3 border border-border rounded-2xl text-[10px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-500/10 transition-all"
               >
                  <Trash2 size={16} /> Delete
               </button>
               <button 
                className="flex items-center justify-center gap-3 px-4 py-4 bg-brand text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:brightness-110 shadow-lg shadow-brand/20 transition-all border border-brand"
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
