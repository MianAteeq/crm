import React, { useState, useEffect } from 'react';
import { 
  X, Phone, Mail, MessageSquare, Edit3, Trash2, Calendar, Globe, Clock, 
  Copy, Check, Zap, ArrowUpRight, Inbox, Building, Briefcase, MapPin, 
  Search, ShieldAlert, CheckCircle2, AlertTriangle, ExternalLink, Star 
} from 'lucide-react';
import { Contact, Tag as TagType, ContactScraperHistoryItem } from '../../types';
import TagBadge from './TagBadge';
import { motion, AnimatePresence } from 'motion/react';
import { formatSafeDate } from '../../lib/utils';
import { emailCampaignApi } from '../../services/emailCampaignApi';
import { crmApi } from '../../services/crmApi';
import { ContactEmailActivity } from '../../types/emailCampaign';
import { useI18n } from '../../i18n';
import { cn } from '../../lib/utils';

interface ContactDrawerProps {
  contact: Contact | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (contact: Contact) => void;
  onDelete: (id: string | number) => void;
  availableTags: TagType[];
}

type Tab = 'profile' | 'business' | 'email_activity' | 'scraper_history' | 'campaigns' | 'notes';

export default function ContactDrawer({ 
  contact, 
  isOpen, 
  onClose, 
  onEdit, 
  onDelete, 
  availableTags 
}: ContactDrawerProps) {
  const { t, isRtl } = useI18n();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [emailActivities, setEmailActivities] = useState<ContactEmailActivity[]>([]);
  const [scraperHistory, setScraperHistory] = useState<ContactScraperHistoryItem[]>([]);
  const [isScraperLoading, setIsScraperLoading] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);

  useEffect(() => {
    if (contact?.id) {
      setIsEmailLoading(true);
      emailCampaignApi.getContactEmailActivities(contact.id)
        .then(res => setEmailActivities(res.data || []))
        .catch(() => setEmailActivities([]))
        .finally(() => setIsEmailLoading(false));

      setIsScraperLoading(true);
      crmApi.getContactScraperHistory(contact.id)
        .then(res => setScraperHistory(res.data || []))
        .catch(() => setScraperHistory([]))
        .finally(() => setIsScraperLoading(false));
    } else {
      setEmailActivities([]);
      setScraperHistory([]);
    }
  }, [contact?.id]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!contact) return null;

  const business = contact.business;
  const businessName = contact.business_name || contact.company || business?.business_name;
  const contactType = contact.contact_type || 'General';

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
            initial={{ x: isRtl ? '-100%' : '100%' }}
            animate={{ x: 0 }}
            exit={{ x: isRtl ? '-100%' : '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className={cn(
              "fixed top-0 w-full max-w-xl h-full bg-white z-[101] flex flex-col shadow-2xl",
              isRtl ? "left-0 border-r border-slate-200" : "right-0 border-l border-slate-200"
            )}
          >
            {/* Header */}
            <div className="p-6 border-b border-stone-200 flex items-center justify-between bg-[#FAFAF9]">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#12263A] border border-[#166534]/30 flex items-center justify-center text-xl font-bold text-white shadow-sm shrink-0">
                  {(contact.name || 'C').charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-[#12263A] tracking-tight">{contact.name || (isRtl ? 'جهة اتصال غير مسمّاة' : 'Unnamed Contact')}</h2>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F0FDF4] text-[#166534] border border-[#22C55E]/30">
                      {contactType}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    {businessName && (
                      <span className="text-xs text-[#57534E] font-semibold flex items-center gap-1">
                        <Building size={12} className="text-stone-400" />
                        {businessName}
                      </span>
                    )}
                    {contact.categories && contact.categories.length > 0 && (
                      <span className="text-xs text-[#166534] font-medium">
                        • {contact.categories.map(c => c.name).join(', ')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button 
                  onClick={() => onEdit(contact)} 
                  className="w-8.5 h-8.5 rounded-xl border border-slate-200 bg-white hover:bg-[#F0FDF4] hover:border-[#bbf7d0] text-stone-500 hover:text-[#166534] transition-all flex items-center justify-center cursor-pointer shadow-xs active:scale-90"
                  title={isRtl ? 'تعديل جهة الاتصال' : 'Edit Contact'}
                >
                  <Edit3 size={15} />
                </button>
                <button 
                  onClick={onClose} 
                  className="w-8.5 h-8.5 rounded-xl border border-slate-200 bg-white hover:bg-[#F0FDF4] hover:border-[#bbf7d0] text-stone-500 hover:text-[#166534] transition-all flex items-center justify-center cursor-pointer shadow-xs active:scale-90"
                  title={isRtl ? 'إغلاق' : 'Close'}
                >
                  <X size={17} />
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-stone-200 bg-white px-6 overflow-x-auto no-scrollbar gap-6">
              {[
                { key: 'profile', label: isRtl ? 'الملف الشخصي' : 'Profile' },
                { key: 'business', label: isRtl ? 'المنشأة' : 'Business' },
                { key: 'email_activity', label: isRtl ? `سجل البريد (${emailActivities.length})` : `Email History (${emailActivities.length})` },
                { key: 'scraper_history', label: isRtl ? `مصدر الاستخراج (${scraperHistory.length})` : `Scraper Provenance (${scraperHistory.length})` },
                { key: 'campaigns', label: 'WhatsApp' },
                { key: 'notes', label: isRtl ? 'ملاحظات' : 'Notes' },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key as Tab)}
                  className={`py-3.5 text-xs font-bold transition-all whitespace-nowrap relative cursor-pointer ${
                    activeTab === key ? 'text-[#166534]' : 'text-[#57534E]/60 hover:text-[#12263A]'
                  }`}
                >
                  <span>{label}</span>
                  {activeTab === key && (
                    <motion.div layoutId="activeTabDrawer" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#166534] rounded-t-full" />
                  )}
                </button>
              ))}
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
              {/* PROFILE TAB */}
              {activeTab === 'profile' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { icon: Phone, label: 'Phone Number', value: contact.phone, action: () => copyToClipboard(contact.phone) },
                      { icon: Mail, label: 'Email Address', value: contact.email || 'Not provided', action: contact.email ? () => copyToClipboard(contact.email) : undefined },
                      { icon: Briefcase, label: 'Job Title / Role', value: contact.job_title || contactType },
                      { icon: Building, label: 'Associated Business', value: businessName || 'None' },
                      { icon: MapPin, label: 'Address', value: contact.address || business?.address || 'Not provided' },
                      { icon: Calendar, label: 'Birthday', value: contact.birthday || 'Not provided' },
                      { icon: Globe, label: 'Website', value: contact.website || business?.website || 'Not provided', isLink: !!(contact.website || business?.website) }
                    ].map((item, i) => (
                      <div key={i} className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between group hover:bg-slate-100/60 transition-colors">
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 shadow-xs flex-shrink-0">
                            <item.icon size={16} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{item.label}</p>
                            {item.isLink ? (
                              <a href={item.value} target="_blank" rel="noreferrer" className="text-xs font-bold text-[#166534] hover:underline mt-0.5 flex items-center gap-1 truncate">
                                <span>{item.value}</span>
                                <ExternalLink size={12} />
                              </a>
                            ) : (
                              <p className="text-xs font-bold text-slate-800 mt-0.5 truncate">{item.value}</p>
                            )}
                          </div>
                        </div>
                        {item.action && (
                          <button 
                            onClick={item.action} 
                            className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-slate-900 transition-all opacity-0 group-hover:opacity-100 shadow-xs"
                            title="Copy"
                          >
                            {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Lifecycle Card */}
                  <div className="p-5 bg-slate-900 rounded-2xl text-white shadow-sm flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Discovery Timeline</p>
                      <p className="text-xs font-medium text-slate-300 mt-1">
                        First Discovered: <strong className="text-white">{contact.first_discovered_at ? formatSafeDate(contact.first_discovered_at) : formatSafeDate(contact.created_at)}</strong>
                      </p>
                      <p className="text-xs font-medium text-slate-300 mt-0.5">
                        Last Enriched: <strong className="text-white">{contact.last_enriched_at ? formatSafeDate(contact.last_enriched_at) : formatSafeDate(contact.updated_at)}</strong>
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Source</span>
                      <p className="text-xs font-bold text-emerald-400 mt-1">{contact.source || 'Scraper'}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* BUSINESS TAB */}
              {activeTab === 'business' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  {business || businessName ? (
                    <div className="space-y-4">
                      <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Business Name</span>
                            <h3 className="text-base font-bold text-slate-900 mt-0.5">{businessName}</h3>
                          </div>
                          {business?.rating && (
                            <div className="flex items-center gap-1 px-2 py-1 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-xs font-bold">
                              <Star size={13} className="text-amber-500 fill-amber-500" />
                              <span>{business.rating}</span>
                              {business.review_count && <span className="text-slate-400 text-[10px]">({business.review_count})</span>}
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
                          <div className="p-3 bg-slate-50 rounded-xl">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Phone</span>
                            <p className="font-semibold text-slate-800 mt-0.5">{business?.phone || contact.phone || 'N/A'}</p>
                          </div>
                          <div className="p-3 bg-slate-50 rounded-xl">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">City / Country</span>
                            <p className="font-semibold text-slate-800 mt-0.5">{business?.city || 'N/A'} {business?.country ? `, ${business.country}` : ''}</p>
                          </div>
                        </div>

                        {business?.website && (
                          <div className="mt-3 p-3 bg-slate-50 rounded-xl">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Website</span>
                            <a href={business.website} target="_blank" rel="noreferrer" className="text-[#166534] font-semibold block hover:underline truncate mt-0.5">
                              {business.website}
                            </a>
                          </div>
                        )}

                        {business?.address && (
                          <div className="mt-3 p-3 bg-slate-50 rounded-xl">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Physical Address</span>
                            <p className="text-slate-700 font-medium mt-0.5">{business.address}</p>
                          </div>
                        )}

                        {business?.google_place_id && (
                          <div className="mt-3 p-3 bg-slate-50 rounded-xl">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Google Place ID</span>
                            <p className="font-mono text-[11px] text-slate-600 truncate mt-0.5">{business.google_place_id}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="p-12 border-2 border-dashed border-slate-200 rounded-2xl text-center flex flex-col items-center gap-3">
                      <Building className="text-slate-300" size={32} />
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">No linked business details</p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* EMAIL ACTIVITY TAB */}
              {activeTab === 'email_activity' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                      Global Email Campaign History ({emailActivities.length})
                    </h3>
                    <Mail size={16} className="text-[#166534]" />
                  </div>

                  {isEmailLoading ? (
                    <div className="p-8 text-center text-xs text-slate-400">Loading email campaign history...</div>
                  ) : emailActivities.length > 0 ? (
                    <div className="space-y-3">
                      {emailActivities.map((act) => {
                        const status = (act.status || 'pending').toLowerCase();
                        return (
                          <div 
                            key={act.id} 
                            className="p-4 bg-white border border-slate-200 rounded-xl flex flex-col gap-2 hover:border-slate-300 transition-all shadow-xs"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-900">{act.campaign_name}</span>
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize border ${
                                status === 'delivered' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                status === 'sent' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                status === 'bounced' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                status === 'failed' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                                status === 'unsubscribed' ? 'bg-red-50 text-red-700 border-red-200' :
                                'bg-slate-50 text-slate-600 border-slate-200'
                              }`}>
                                {status}
                              </span>
                            </div>

                            <p className="text-xs text-slate-500 font-medium truncate">Subject: {act.subject || 'Campaign Email'}</p>

                            {/* Bounce details if present */}
                            {act.bounce_reason && (
                              <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-[11px] flex items-start gap-2">
                                <AlertTriangle size={14} className="text-amber-600 flex-shrink-0 mt-0.5" />
                                <div>
                                  <p className="font-bold">Bounce Notice:</p>
                                  <p className="text-[10px] mt-0.5">{act.bounce_reason}</p>
                                </div>
                              </div>
                            )}

                            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                              <div className="flex items-center gap-1.5">
                                <Clock size={11} />
                                <span>{act.date || act.sent_at || 'Pending'}</span>
                              </div>
                              {act.provider_message_id && (
                                <span className="font-mono text-[9px] text-slate-400 truncate max-w-[150px]">
                                  ID: {act.provider_message_id}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-12 border-2 border-dashed border-slate-200 rounded-2xl text-center flex flex-col items-center gap-3">
                      <Mail className="text-slate-300" size={32} />
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Never Sent Any Email</p>
                      <p className="text-xs text-slate-400 max-w-xs">This contact has no email campaigns dispatched to them yet.</p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* SCRAPER HISTORY TAB */}
              {activeTab === 'scraper_history' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                      Discovery Provenance ({scraperHistory.length})
                    </h3>
                    <Search size={16} className="text-[#166534]" />
                  </div>

                  {isScraperLoading ? (
                    <div className="p-8 text-center text-xs text-slate-400">Loading discovery history...</div>
                  ) : scraperHistory.length > 0 ? (
                    <div className="space-y-3">
                      {scraperHistory.map((sh) => (
                        <div key={sh.id} className="p-4 bg-white border border-slate-200 rounded-xl flex flex-col gap-1.5 shadow-xs">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-slate-900">{sh.search_query || 'Direct Search'}</h4>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F0FDF4] text-[#166534] border border-[#bbf7d0]">
                              {sh.category_name || 'General'}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 font-medium">
                            Location: {sh.location || 'Global'} • Source: {sh.discovery_source || 'Google Maps / Deep Discovery'}
                          </p>
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-1">
                            <Clock size={11} />
                            <span>Discovered: {sh.discovered_at ? formatSafeDate(sh.discovered_at) : 'N/A'}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-12 border-2 border-dashed border-slate-200 rounded-2xl text-center flex flex-col items-center gap-3">
                      <Search className="text-slate-300" size={32} />
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">No scraper provenance records</p>
                      <p className="text-xs text-slate-400">This contact was created manually or imported directly.</p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* WHATSAPP CAMPAIGNS TAB */}
              {activeTab === 'campaigns' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">WhatsApp Enrollment ({contact.campaigns?.length || 0})</h3>
                    <Zap size={14} className="text-amber-500" />
                  </div>
                  {contact.campaigns && contact.campaigns.length > 0 ? (
                    <div className="space-y-2">
                      {contact.campaigns.map((camp) => (
                        <div key={camp.id} className="p-4 bg-white border border-slate-200 rounded-xl flex items-center justify-between hover:border-slate-300 transition-all shadow-xs">
                          <div>
                            <p className="text-sm font-bold text-slate-900">{camp.name}</p>
                            <p className="text-[10px] text-slate-400 uppercase mt-1">{camp.timestamp}</p>
                          </div>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200 capitalize">
                            {camp.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-12 border-2 border-dashed border-slate-200 rounded-2xl text-center flex flex-col items-center gap-3">
                      <Inbox className="text-slate-300" size={32} />
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">No WhatsApp Campaign Activity</p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* NOTES TAB */}
              {activeTab === 'notes' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl min-h-[160px]">
                    <p className="text-xs leading-relaxed text-slate-600 font-medium">
                      {contact.notes || 'No internal notes on file.'}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Tags Section (Always visible) */}
              <div className="pt-6 border-t border-slate-200 space-y-3">
                <h3 className="text-[10px] font-bold text-slate-900 uppercase tracking-wider">Tags & Segments</h3>
                <div className="flex flex-wrap gap-1.5">
                  {(contact.tags || []).map((tag, idx) => (
                    <TagBadge key={typeof tag === 'object' ? (tag as any).id || idx : tag} tag={tag} availableTags={availableTags} className="!text-[10px] py-1 px-3" />
                  ))}
                  {(!contact.tags || contact.tags.length === 0) && (
                    <span className="text-xs text-slate-400 italic">No tags assigned</span>
                  )}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-slate-200 bg-slate-50/70 grid grid-cols-2 gap-4">
              <button 
                onClick={() => onDelete(contact.id)}
                className="h-10 flex items-center justify-center gap-2 px-4 bg-white border border-rose-200 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:border-rose-300 transition-all shadow-xs active:scale-95 cursor-pointer"
              >
                <Trash2 size={15} /> Delete Contact
              </button>
              <button 
                onClick={() => onEdit(contact)}
                className="h-10 flex items-center justify-center gap-2 px-4 bg-[#166534] hover:bg-[#14532d] text-white rounded-xl text-xs font-semibold transition-all shadow-sm hover:shadow-[#166534]/15 active:scale-95 cursor-pointer"
              >
                <Edit3 size={15} /> Edit Details
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
