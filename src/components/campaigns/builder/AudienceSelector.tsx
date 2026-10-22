import React, { useState, useEffect } from 'react';
import { Users, Filter, MousePointer2, CheckCircle2, Search, Tag as TagIcon, Check, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { segments as mockSegments } from '../../../data/contactsMock';
import { cn } from '../../../lib/utils';
import { crmApi } from '../../../services/crmApi';
import { Tag, Contact } from '../../../types';
import { useI18n } from '../../../i18n';

interface AudienceSelectorProps {
  value: { 
    type: 'all' | 'segment' | 'manual'; 
    segmentId?: string;
    tagIds?: number[];
    contactIds?: number[];
  };
  onChange: (value: { 
    type: 'all' | 'segment' | 'manual'; 
    segmentId?: string;
    tagIds?: number[];
    contactIds?: number[];
  }) => void;
}

export default function AudienceSelector({ value, onChange }: AudienceSelectorProps) {
  const { isRtl } = useI18n();

  const [tags, setTags] = useState<Tag[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tagSearch, setTagSearch] = useState('');
  const [contactSearch, setContactSearch] = useState('');

  // Fetch Tags and Contacts in background for precise audience selection
  useEffect(() => {
    const loadSelectionData = async () => {
      setIsLoading(true);
      try {
        const [loadedTags, loadedContacts] = await Promise.all([
          crmApi.getTags(),
          crmApi.getContacts()
        ]);
        setTags(loadedTags || []);
        setContacts(loadedContacts || []);
      } catch (error) {
        console.error('Failed to load audience selector entities', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadSelectionData();
  }, []);

  const options = [
    { 
      id: 'all', 
      label: isRtl ? 'جميع جهات الاتصال' : 'All Contacts', 
      description: isRtl ? 'استهداف كافة جهات الاتصال في قاعدة بياناتك' : 'Target every contact in your database', 
      icon: Users 
    },
    { 
      id: 'segment', 
      label: isRtl ? 'تصنيفات الوسوم' : 'Tag Segments', 
      description: isRtl ? 'تصفية حسب وسم أو أكثر من وسوم واتساب' : 'Filter by one or more WhatsApp labels', 
      icon: Filter 
    },
    { 
      id: 'manual', 
      label: isRtl ? 'تحديد يدوي' : 'Manual Selection', 
      description: isRtl ? 'اختيار جهات اتصال محددة بشكل فردي' : 'Pick individual contacts one by one', 
      icon: MousePointer2 
    },
  ];

  // Helper to toggle a tag ID (integer representation)
  const toggleTagSelection = (tagId: string) => {
    const numericId = parseInt(tagId, 10);
    if (isNaN(numericId)) return;
    
    const currentTagIds = value.tagIds || [];
    const newTagIds = currentTagIds.includes(numericId)
      ? currentTagIds.filter(id => id !== numericId)
      : [...currentTagIds, numericId];
      
    onChange({ 
      ...value, 
      tagIds: newTagIds 
    });
  };

  // Helper to toggle a contact ID (integer representation)
  const toggleContactSelection = (contactId: string) => {
    const numericId = parseInt(contactId, 10);
    if (isNaN(numericId)) return;

    const currentContactIds = value.contactIds || [];
    const newContactIds = currentContactIds.includes(numericId)
      ? currentContactIds.filter(id => id !== numericId)
      : [...currentContactIds, numericId];

    onChange({ 
      ...value, 
      contactIds: newContactIds 
    });
  };

  const filteredTags = tags.filter(tag => 
    tag.name.toLowerCase().includes(tagSearch.toLowerCase())
  );

  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(contactSearch.toLowerCase()) ||
    contact.phone.includes(contactSearch) ||
    (contact.email && contact.email.toLowerCase().includes(contactSearch.toLowerCase()))
  );

  return (
    <div className="space-y-8" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {options.map((opt) => {
          const isSelected = value.type === opt.id;
          return (
            <motion.button
              key={opt.id}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onChange({ 
                type: opt.id as any,
                segmentId: opt.id === 'segment' ? value.segmentId : undefined,
                tagIds: opt.id === 'segment' ? (value.tagIds || []) : [],
                contactIds: opt.id === 'manual' ? (value.contactIds || []) : []
              })}
              className={cn(
                "p-8 rounded-2xl border-2 text-start transition-all relative overflow-hidden group shadow-sm cursor-pointer",
                isSelected 
                  ? 'bg-white border-[#166534] shadow-md ring-1 ring-emerald-50' 
                  : 'bg-white border-slate-100 text-slate-900 hover:border-slate-200'
              )}
            >
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-all",
                isSelected ? 'bg-[#F0FDF4] text-[#166534]' : 'bg-slate-50 text-slate-400 group-hover:bg-slate-100'
              )}>
                <opt.icon size={24} className="stroke-[2.2px]" />
              </div>
              <h3 className={cn(
                "text-sm font-black tracking-tight mb-2 uppercase tracking-wide font-display",
                isSelected ? 'text-[#166534]' : 'text-slate-900'
              )}>{opt.label}</h3>
              <p className="text-[10px] font-medium leading-relaxed text-slate-400">{opt.description}</p>
              
              {isSelected && (
                <div className={`absolute top-4 ${isRtl ? 'left-4' : 'right-4'}`}>
                  <div className="w-5 h-5 rounded-full bg-[#166534] flex items-center justify-center shadow-sm">
                     <CheckCircle2 size={12} className="text-white" />
                  </div>
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {/* Render Checkable Tag Segment view when segment is selected */}
        {value.type === 'segment' && (
          <motion.div 
            initial={{ opacity: 0, height: 0, y: 10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: 10 }}
            className="p-8 bg-slate-50/50 border border-slate-200/80 rounded-3xl space-y-6 overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {isRtl ? 'تحديد وسوم الاستهداف' : 'Select Target Tags'}
                </h4>
                <p className="text-[10.5px] text-slate-400 font-medium mt-1">
                  {isRtl 
                    ? 'ستستهدف هذه الحملة جميع جهات الاتصال التي تحمل أي وسم من الوسوم المحددة.' 
                    : 'This campaign will target contacts with any of the selected labels.'}
                </p>
              </div>
              
              <div className="relative max-w-xs w-full">
                <Search size={14} className={`absolute top-1/2 -translate-y-1/2 text-slate-400 ${isRtl ? 'right-3' : 'left-3'}`} />
                <input 
                  type="text"
                  placeholder={isRtl ? 'تصفية الوسوم...' : 'Filter tags...'}
                  value={tagSearch}
                  onChange={(e) => setTagSearch(e.target.value)}
                  className={`w-full bg-white border border-slate-200 rounded-xl py-1.5 text-xs font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#166534] shadow-sm transition-all ${
                    isRtl ? 'pr-9 pl-4' : 'pl-9 pr-4'
                  }`}
                />
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-6 text-slate-400 gap-2">
                <Loader2 size={16} className="animate-spin text-[#166534]" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  {isRtl ? 'جارٍ تحميل الوسوم المتاحة...' : 'Loading available tags...'}
                </span>
              </div>
            ) : filteredTags.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {filteredTags.map(tag => {
                  const numericId = parseInt(tag.id, 10);
                  const isChecked = (value.tagIds || []).includes(numericId);
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => toggleTagSelection(tag.id)}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer shadow-sm",
                        isChecked
                          ? "bg-[#166534] border-[#166534] text-white shadow-md shadow-[#166534]/15"
                          : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
                      )}
                    >
                      <TagIcon size={12} className={cn("stroke-[2.5px]", isChecked ? "text-white" : "text-slate-400")} />
                      <span>{tag.name}</span>
                      {isChecked && <Check size={12} className="stroke-[3px]" />}
                      <span className={cn(
                        "text-[9px] px-1.5 py-0.5 rounded-md font-mono",
                        isChecked ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                      )}>
                        ID: {tag.id}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6 text-slate-400 text-xs font-medium">
                {isRtl ? `لم يتم العثور على وسوم تطابق "${tagSearch}"` : `No tags found matching "${tagSearch}"`}
              </div>
            )}
            
            {/* Selected info block */}
            <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">
                {isRtl ? 'إجمالي الوسوم المختارة' : 'Selected Tag Vector'}
              </span>
              <span className="text-xs font-black text-[#166534] bg-[#F0FDF4] border border-[#bbf7d0] px-3 py-1 rounded-lg">
                {(value.tagIds || []).length} {isRtl ? 'وسم نشط' : 'Tags Active'}
              </span>
            </div>
          </motion.div>
        )}

        {/* Render Searchable Checkbox Contact List view when manual is selected */}
        {value.type === 'manual' && (
          <motion.div 
            initial={{ opacity: 0, height: 0, y: 10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: 10 }}
            className="p-8 bg-slate-50/50 border border-slate-200/80 rounded-3xl space-y-6 overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {isRtl ? 'تحديد المستلمين فردياً' : 'Select Individual Recipients'}
                </h4>
                <p className="text-[10.5px] text-slate-400 font-medium mt-1">
                  {isRtl ? 'حدد بالضبط جهات الاتصال التي ستصلها هذه الرسالة.' : 'Directly curate of which primary contacts receive this broadcast stream.'}
                </p>
              </div>
              
              <div className="relative max-w-xs w-full">
                <Search size={14} className={`absolute top-1/2 -translate-y-1/2 text-slate-400 ${isRtl ? 'right-3' : 'left-3'}`} />
                <input 
                  type="text"
                  placeholder={isRtl ? 'بحث بالاسم أو الهاتف أو البريد...' : 'Search name, phone or email...'}
                  value={contactSearch}
                  onChange={(e) => setContactSearch(e.target.value)}
                  className={`w-full bg-white border border-slate-200 rounded-xl py-1.5 text-xs font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#166534] shadow-sm transition-all ${
                    isRtl ? 'pr-9 pl-4' : 'pl-9 pr-4'
                  }`}
                />
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-6 text-slate-400 gap-2">
                <Loader2 size={16} className="animate-spin text-[#166534]" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  {isRtl ? 'جارٍ تحميل المستلمين...' : 'Loading recipients...'}
                </span>
              </div>
            ) : filteredContacts.length > 0 ? (
              <div className="border border-slate-200 bg-white rounded-2xl overflow-hidden max-h-60 overflow-y-auto shadow-sm custom-scrollbar">
                <table className={`w-full border-collapse ${isRtl ? 'text-right' : 'text-left'}`}>
                  <thead>
                    <tr className="bg-slate-50/60 border-b border-slate-100 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      <th className="px-6 py-3 w-10 text-center">{isRtl ? 'تحديد' : 'Select'}</th>
                      <th className="px-6 py-3">{isRtl ? 'الاسم' : 'Name'}</th>
                      <th className="px-6 py-3">{isRtl ? 'رقم واتساب' : 'WhatsApp Phone'}</th>
                      <th className="px-6 py-3">{isRtl ? 'الوسوم' : 'Tag References'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredContacts.map(contact => {
                      const numericId = parseInt(contact.id, 10);
                      const isChecked = (value.contactIds || []).includes(numericId);
                      return (
                        <tr 
                          key={contact.id}
                          onClick={() => toggleContactSelection(contact.id)}
                          className={cn(
                            "hover:bg-slate-50/50 cursor-pointer text-xs font-bold text-slate-800 transition-colors",
                            isChecked && "bg-emerald-500/[0.03]"
                          )}
                        >
                          <td className="px-6 py-4.5 text-center" onClick={(e) => e.stopPropagation()}>
                            <input 
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleContactSelection(contact.id)}
                              className="w-4.5 h-4.5 text-[#166534] border-slate-300 rounded focus:ring-[#166534] cursor-pointer"
                            />
                          </td>
                          <td className="px-6 py-4.5">
                            <div className="font-bold text-slate-900 leading-none">{contact.name}</div>
                            {contact.email && <div className="text-[10px] text-slate-400 font-medium mt-1">{contact.email}</div>}
                          </td>
                          <td className="px-6 py-4.5 font-mono text-slate-600" dir="ltr">{contact.phone}</td>
                          <td className="px-6 py-4.5">
                            <div className="flex flex-wrap gap-1.5">
                              {contact.tags.map(tId => {
                                const matchedTag = tags.find(tg => tg.id === String(tId));
                                return (
                                  <span 
                                    key={tId}
                                    className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-slate-100 border border-slate-200/50 text-slate-500"
                                  >
                                    {matchedTag?.name || `Tag ${tId}`}
                                  </span>
                                );
                              })}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-6 text-slate-400 text-xs font-medium bg-white rounded-2xl border border-slate-200">
                {isRtl ? `لم يتم العثور على جهات اتصال تطابق "${contactSearch}"` : `No active contacts found matching "${contactSearch}"`}
              </div>
            )}

            <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">
                {isRtl ? 'المحددون يدوياً' : 'Individual Selections'}
              </span>
              <span className="text-xs font-black text-[#166534] bg-[#F0FDF4] border border-[#bbf7d0] px-3 py-1 rounded-lg">
                {(value.contactIds || []).length} {isRtl ? 'جهات اتصال محددة' : 'Contacts Active'}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-8 bg-slate-900 rounded-[2rem] flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white shrink-0">
            <Users size={28} className="stroke-[1.8px]" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
              {isRtl ? 'حجم الجمهور المستهدف' : 'Impact Radius'}
            </p>
            <div className="flex items-baseline gap-2">
               <h3 className="text-4xl font-black text-white tracking-tight">
                 {value.type === 'segment' 
                   ? (value.tagIds || []).length.toString()
                   : value.type === 'manual' 
                     ? (value.contactIds || []).length.toString()
                     : contacts.length.toLocaleString()}
               </h3>
               <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                 {value.type === 'segment' 
                   ? (isRtl ? 'وسم تم اختياره' : 'Tags Selected') 
                   : value.type === 'manual' 
                     ? (isRtl ? 'جهة اتصال محددة' : 'Contacts Picked') 
                     : (isRtl ? 'مستلم' : 'Recipients')}
               </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
