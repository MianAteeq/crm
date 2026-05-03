import React, { useState } from 'react';
import { X, User, Phone, Mail, Tag, StickyNote, Smartphone, Building, Briefcase, MapPin, Calendar, Globe } from 'lucide-react';
import { Contact } from '../../data/contactsMock';
import { motion, AnimatePresence } from 'motion/react';

interface ContactFormProps {
  contact?: Partial<Contact>;
  isOpen: boolean;
  onClose: () => void;
  onSave: (contact: Partial<Contact>) => void;
  tags: string[];
}

export default function ContactForm({ contact, isOpen, onClose, onSave, tags }: ContactFormProps) {
  const [formData, setFormData] = useState<Partial<Contact>>(contact || {
    name: '',
    phone: '',
    email: '',
    tags: [],
    notes: '',
    status: 'active',
    company: '',
    jobTitle: '',
    address: '',
    birthday: '',
    website: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'Full name is required';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    else if (!/^\+?[1-9]\d{1,14}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Invalid phone format (Ex: +92 300 1234567)';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
      onClose();
    }
  };

  const toggleTag = (tag: string) => {
    const currentTags = formData.tags || [];
    if (currentTags.includes(tag)) {
      setFormData({ ...formData, tags: currentTags.filter(t => t !== tag) });
    } else {
      setFormData({ ...formData, tags: [...currentTags, tag] });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[1001]"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl bg-bg-surface border border-border z-[1002] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="p-8 border-b border-border bg-bg-surface2/30 flex-shrink-0">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     <div className="w-14 h-14 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand">
                        <User size={28} />
                     </div>
                     <div>
                        <h2 className="text-xl font-black text-white uppercase tracking-tight">{contact?.id ? 'Edit Contact' : 'Add New Contact'}</h2>
                        <p className="text-[10px] text-text-muted font-black uppercase tracking-widest mt-1">throbtech Hub Directory</p>
                     </div>
                  </div>
                  <button onClick={onClose} type="button" className="p-3 rounded-2xl bg-bg-surface3 border border-border text-text-muted hover:text-white transition-all">
                     <X size={20} />
                  </button>
               </div>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
               {/* Identity Section */}
               <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-border pb-2 opacity-50">
                     <User size={14} />
                     <span className="text-[10px] font-black uppercase tracking-widest">Personal Info</span>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                     <div className="space-y-2 col-span-2">
                        <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1 flex items-center gap-2">
                           Full Name
                        </label>
                        <input 
                           value={formData.name}
                           onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                           placeholder="Ex: Muhammad Ahmad"
                           className={`w-full bg-bg-surface3 border ${errors.name ? 'border-rose-500' : 'border-border'} rounded-2xl p-4 text-xs font-bold text-white focus:outline-none focus:border-brand/40 transition-all shadow-inner`}
                        />
                        {errors.name && <p className="text-[10px] text-rose-500 font-bold ml-1">{errors.name}</p>}
                     </div>

                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1 flex items-center gap-2">
                           <Smartphone size={12} className="text-brand" /> Phone Number
                        </label>
                        <input 
                           value={formData.phone}
                           onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                           placeholder="+92 300 1234567"
                           className={`w-full bg-bg-surface3 border ${errors.phone ? 'border-rose-500' : 'border-border'} rounded-2xl p-4 text-xs font-bold text-white focus:outline-none focus:border-brand/40 transition-all shadow-inner`}
                        />
                        {errors.phone && <p className="text-[10px] text-rose-500 font-bold ml-1">{errors.phone}</p>}
                     </div>

                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1 flex items-center gap-2">
                           <Mail size={12} className="text-brand" /> Email
                        </label>
                        <input 
                           value={formData.email}
                           onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                           placeholder="ahmad@company.com"
                           className="w-full bg-bg-surface3 border border-border rounded-2xl p-4 text-xs font-bold text-white focus:outline-none focus:border-brand/40 transition-all shadow-inner"
                        />
                     </div>
                  </div>
               </div>

               {/* Professional Section */}
               <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-border pb-2 opacity-50">
                     <Briefcase size={14} />
                     <span className="text-[10px] font-black uppercase tracking-widest">Professional Info</span>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1 flex items-center gap-2">
                           <Building size={12} className="text-brand" /> Company
                        </label>
                        <input 
                           value={formData.company}
                           onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                           placeholder="Tech Solutions"
                           className="w-full bg-bg-surface3 border border-border rounded-2xl p-4 text-xs font-bold text-white focus:outline-none focus:border-brand/40 transition-all shadow-inner"
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1 flex items-center gap-2">
                           <Briefcase size={12} className="text-brand" /> Job Title
                        </label>
                        <input 
                           value={formData.jobTitle}
                           onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                           placeholder="Manager"
                           className="w-full bg-bg-surface3 border border-border rounded-2xl p-4 text-xs font-bold text-white focus:outline-none focus:border-brand/40 transition-all shadow-inner"
                        />
                     </div>
                  </div>
               </div>

               {/* Location & Personal */}
               <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-border pb-2 opacity-50">
                     <MapPin size={14} />
                     <span className="text-[10px] font-black uppercase tracking-widest">Location & Extras</span>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                     <div className="space-y-2 col-span-2">
                        <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1 flex items-center gap-2">
                           <MapPin size={12} className="text-brand" /> Address
                        </label>
                        <input 
                           value={formData.address}
                           onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                           placeholder="123 Street, City, Country"
                           className="w-full bg-bg-surface3 border border-border rounded-2xl p-4 text-xs font-bold text-white focus:outline-none focus:border-brand/40 transition-all shadow-inner"
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1 flex items-center gap-2">
                           <Calendar size={12} className="text-brand" /> Birthday
                        </label>
                        <input 
                           type="date"
                           value={formData.birthday}
                           onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                           className="w-full bg-bg-surface3 border border-border rounded-2xl p-4 text-[11px] font-bold text-white focus:outline-none focus:border-brand/40 transition-all shadow-inner"
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1 flex items-center gap-2">
                           <Globe size={12} className="text-brand" /> Website
                        </label>
                        <input 
                           value={formData.website}
                           onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                           placeholder="https://example.com"
                           className="w-full bg-bg-surface3 border border-border rounded-2xl p-4 text-xs font-bold text-white focus:outline-none focus:border-brand/40 transition-all shadow-inner"
                        />
                     </div>
                  </div>
               </div>

               <div className="space-y-3 pt-4">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1 flex items-center gap-2">
                     <Tag size={12} className="text-brand" /> Assign Tags
                  </label>
                  <div className="flex flex-wrap gap-2 p-1">
                     {tags.map(tag => (
                       <button
                         key={tag}
                         type="button"
                         onClick={() => toggleTag(tag)}
                         className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                           formData.tags?.includes(tag) 
                             ? 'bg-brand text-white border-brand' 
                             : 'bg-bg-surface3 text-text-muted border-border hover:border-brand/40'
                         }`}
                       >
                         {tag}
                       </button>
                     ))}
                  </div>
               </div>

               <div className="space-y-2 pt-4">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1 flex items-center gap-2">
                     <StickyNote size={12} className="text-brand" /> Private Notes
                  </label>
                  <textarea 
                     rows={3}
                     value={formData.notes}
                     onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                     placeholder="Add context or preferences..."
                     className="w-full bg-bg-surface3 border border-border rounded-2xl p-4 text-xs font-bold text-white focus:outline-none focus:border-brand/40 transition-all resize-none shadow-inner"
                  />
               </div>

               <div className="pt-6 flex gap-4 sticky bottom-0 bg-bg-surface mt-auto py-4 border-t border-border">
                  <button 
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-4 bg-bg-surface3 border border-border rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-4 bg-brand text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:brightness-110 shadow-lg shadow-brand/20 transition-all"
                  >
                    {contact?.id ? 'Update Profile' : 'Create Contact'}
                  </button>
               </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
