import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Phone, Mail, Tag, Briefcase, MapPin, Calendar, Globe, ArrowLeft, Loader2, Save } from 'lucide-react';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import { Contact, Tag as TagType } from '../../types';
import { crmApi } from '../../services/crmApi';

export default function ContactEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [tags, setTags] = useState<TagType[]>([]);
  const [formData, setFormData] = useState<Partial<Contact>>({
    name: '',
    phone: '',
    email: '',
    tags: [],
    notes: '',
    status: 'active',
    company: '',
    job_title: '',
    address: '',
    birthday: '',
    website: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const tagsData = await crmApi.getTags();
        setTags(tagsData);

        if (id) {
          const contactData = await crmApi.getContact(id);
          setFormData(contactData);
        }
      } catch (error) {
        console.error('Failed to fetch data', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'Full name is required';
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!isValidPhoneNumber(formData.phone)) {
      newErrors.phone = 'Please enter a valid international phone number';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSaving(true);
    try {
      if (id) {
        await crmApi.updateContact(id, formData);
      } else {
        await crmApi.createContact({
          ...formData,
          status: formData.status || 'active',
          tags: formData.tags || []
        });
      }
      navigate('/contacts');
    } catch (error) {
      console.error('Failed to save contact', error);
      alert('Error saving contact. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleTag = (tagId: string) => {
    const currentTags = formData.tags || [];
    if (currentTags.includes(tagId)) {
      setFormData({ ...formData, tags: currentTags.filter(t => t !== tagId) });
    } else {
      setFormData({ ...formData, tags: [...currentTags, tagId] });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400">
        <Loader2 size={32} className="animate-spin mb-4" />
        <p className="text-sm font-bold uppercase tracking-widest">Loading Details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/contacts')}
            className="p-2 lg:p-3 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-slate-900 hover:border-slate-400 transition-all shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {id ? 'Edit Contact' : 'Add New Contact'}
            </h1>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-0.5">
              Audience CRM & Directory
            </p>
          </div>
        </div>

        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 disabled:bg-slate-400 transition-all shadow-lg shadow-slate-900/10"
        >
          {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={18} />}
          <span>{id ? 'Save Changes' : 'Create Contact'}</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-12">
        {/* Left Column: Core Identity */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 space-y-8 shadow-sm">
            <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
               <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                  <User size={20} />
               </div>
               <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Identity & Contact</span>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                <input 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Muhammad Ahmad"
                  className={`w-full bg-slate-50 border ${errors.name ? 'border-red-500 bg-red-50/30' : 'border-slate-200'} rounded-xl p-4 text-sm font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all`}
                />
                {errors.name && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Phone Number</label>
                  <PhoneInput
                    international
                    defaultCountry="PK"
                    value={formData.phone}
                    onChange={(val) => setFormData({ ...formData, phone: val || '' })}
                    className={errors.phone ? 'phone-input-error' : ''}
                    placeholder="Enter phone number"
                  />
                  {errors.phone && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.phone}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Email</label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="ahmad@company.com"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 pl-11 text-sm font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 space-y-8 shadow-sm">
            <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
               <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                  <Briefcase size={20} />
               </div>
               <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Professional Context</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Company</label>
                <input 
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Tech Solutions"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Job Title</label>
                <input 
                  value={formData.job_title}
                  onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                  placeholder="Manager"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900 transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Labels & Extras */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 space-y-8 shadow-sm">
            <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
               <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                  <Tag size={20} />
               </div>
               <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Tags & Categorization</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  className={`px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-tight border transition-all ${
                    formData.tags?.includes(tag.id) 
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md shadow-slate-900/10' 
                      : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'
                  }`}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 space-y-8 shadow-sm">
            <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
               <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                  <MapPin size={20} />
               </div>
               <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Extended Information</span>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Address</label>
                <input 
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="123 Street, City, Country"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Birthday</label>
                  <div className="relative">
                    <Calendar size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="date"
                      value={formData.birthday}
                      onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 pl-11 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Website</label>
                  <div className="relative">
                    <Globe size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      placeholder="https://example.com"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 pl-11 text-sm font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Internal Notes</label>
                <textarea 
                  rows={4}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Add internal context or preferences..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900 transition-all resize-none"
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
