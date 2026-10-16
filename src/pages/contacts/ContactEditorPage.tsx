import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  User, Phone, Mail, Tag, Briefcase, MapPin, Calendar, Globe, 
  ArrowLeft, Loader2, Save, Layers, Plus, Check, X, Sparkles, Building2 
} from 'lucide-react';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import { Contact, Tag as TagType, Category } from '../../types';
import { crmApi } from '../../services/crmApi';
import { FormSkeleton } from '../../components/ui/Skeleton';

const CONTACT_TYPES = [
  'General',
  'Owner',
  'Founder',
  'CEO',
  'Director',
  'Manager',
  'Marketing',
  'Sales',
  'Reception',
  'Other'
];

const SUGGESTED_CATEGORIES = [
  'Dental Clinics',
  'Aesthetic Clinics',
  'Real Estate',
  'Car Dealerships',
  'Software Agencies',
  'Restaurants',
  'Hotels'
];

export default function ContactEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [tags, setTags] = useState<TagType[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<(string | number)[]>([]);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [creatingCategoryLoading, setCreatingCategoryLoading] = useState(false);

  const [formData, setFormData] = useState<Partial<Contact>>({
    name: '',
    phone: '',
    email: '',
    tags: [],
    category_ids: [],
    contact_type: 'General',
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
        const [tagsData, categoriesData] = await Promise.all([
          crmApi.getTags({ headers: { 'X-Skip-Loader': 'true' } }).catch(() => []),
          crmApi.getCategories().catch(() => [])
        ]);
        setTags(tagsData);
        setCategories(categoriesData);

        if (id) {
          const contactData = await crmApi.getContact(id, {
            headers: { 'X-Skip-Loader': 'true' }
          });
          setFormData({
            ...contactData,
            contact_type: contactData.contact_type || 'General'
          });

          // Extract category associations
          const catIds: (string | number)[] = [];
          if (Array.isArray(contactData.categories) && contactData.categories.length > 0) {
            contactData.categories.forEach((c: any) => {
              if (c && c.id) catIds.push(c.id);
            });
          } else if (Array.isArray(contactData.category_ids) && contactData.category_ids.length > 0) {
            catIds.push(...contactData.category_ids);
          } else if (contactData.category_id) {
            catIds.push(contactData.category_id);
          }
          setSelectedCategoryIds(catIds);
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
      const payload: Partial<Contact> = {
        ...formData,
        status: formData.status || 'active',
        tags: formData.tags || [],
        contact_type: formData.contact_type || 'General',
        category_ids: selectedCategoryIds,
        category_id: selectedCategoryIds.length > 0 ? selectedCategoryIds[0] : undefined,
      };

      if (id) {
        await crmApi.updateContact(id, payload);
      } else {
        await crmApi.createContact(payload);
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

  const toggleCategory = (catId: string | number) => {
    setSelectedCategoryIds(prev => {
      const exists = prev.some(id => String(id) === String(catId));
      if (exists) {
        return prev.filter(id => String(id) !== String(catId));
      } else {
        return [...prev, catId];
      }
    });
  };

  const handleCreateCategory = async (nameToCreate?: string) => {
    const catName = (nameToCreate || newCategoryName).trim();
    if (!catName) return;

    // Check if category with this name already exists in categories list
    const existing = categories.find(c => c.name.toLowerCase() === catName.toLowerCase());
    if (existing) {
      if (!selectedCategoryIds.some(id => String(id) === String(existing.id))) {
        setSelectedCategoryIds(prev => [...prev, existing.id]);
      }
      setNewCategoryName('');
      setIsCreatingCategory(false);
      return;
    }

    setCreatingCategoryLoading(true);
    try {
      const newCat = await crmApi.createCategory({
        name: catName,
        status: 'active'
      });
      if (newCat && newCat.id) {
        setCategories(prev => {
          const exists = prev.some(c => String(c.id) === String(newCat.id) || c.name.toLowerCase() === catName.toLowerCase());
          return exists ? prev : [...prev, newCat];
        });
        setSelectedCategoryIds(prev => [...prev, newCat.id]);
        setNewCategoryName('');
        setIsCreatingCategory(false);
      }
    } catch (err) {
      console.error('Failed to create category on backend, adding local category', err);
      const fallbackCat: Category = {
        id: `custom_${Date.now()}`,
        name: catName,
        slug: catName.toLowerCase().replace(/\s+/g, '-'),
        status: 'active'
      };
      setCategories(prev => [...prev, fallbackCat]);
      setSelectedCategoryIds(prev => [...prev, fallbackCat.id]);
      setNewCategoryName('');
      setIsCreatingCategory(false);
    } finally {
      setCreatingCategoryLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-200/50 animate-pulse" />
            <div className="space-y-2">
              <div className="h-6 w-40 bg-slate-200/50 rounded-md animate-pulse" />
              <div className="h-3.5 w-60 bg-slate-200/50 rounded-md animate-pulse" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-12">
          <FormSkeleton />
          <FormSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            type="button"
            onClick={() => navigate('/contacts')}
            className="w-10 h-10 rounded-xl bg-white border border-slate-200 hover:bg-[#F0FDF4] hover:border-[#bbf7d0] text-slate-500 hover:text-[#166534] flex items-center justify-center transition-all shadow-xs active:scale-90 cursor-pointer"
            title="Back to contacts"
          >
            <ArrowLeft size={18} />
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
          className="h-10 px-5 bg-[#166534] hover:bg-[#14532d] text-white rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm hover:shadow-[#166534]/15 active:scale-95 flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={18} />}
          <span>{id ? 'Save Changes' : 'Create Contact'}</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-12">
        {/* Left Column: Core Identity & Professional Context */}
        <div className="space-y-6">
          {/* Identity & Contact Details */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 space-y-8 shadow-sm">
            <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
               <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                  <User size={20} />
               </div>
               <div>
                 <span className="text-xs font-bold uppercase tracking-widest text-slate-900 block">Identity & Contact</span>
                 <p className="text-[11px] text-slate-500 font-medium">Primary contact information and communication channels</p>
               </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                <input 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Muhammad Ahmad"
                  className={`w-full bg-slate-50 border ${errors.name ? 'border-red-500 bg-red-50/30' : 'border-slate-200'} rounded-xl p-4 text-sm font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-[#166534] focus:ring-2 focus:ring-[#166534]/15 focus:ring-4 focus:ring-slate-900/5 transition-all`}
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
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="ahmad@company.com"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 pl-11 text-sm font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-[#166534] focus:ring-2 focus:ring-[#166534]/15 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Status</label>
                <select
                  value={formData.status || 'active'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-[#166534] focus:ring-2 focus:ring-[#166534]/15 transition-all"
                >
                  <option value="active">Active</option>
                  <option value="lead">Lead</option>
                  <option value="customer">Customer</option>
                  <option value="unsubscribed">Unsubscribed</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
          </div>

          {/* Professional Context */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 space-y-8 shadow-sm">
            <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
               <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                  <Briefcase size={20} />
               </div>
               <div>
                 <span className="text-xs font-bold uppercase tracking-widest text-slate-900 block">Professional Context</span>
                 <p className="text-[11px] text-slate-500 font-medium">Business entity, role hierarchy and position</p>
               </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Company / Business Name</label>
                  <div className="relative">
                    <Building2 size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Tech Solutions Ltd"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 pl-11 text-sm font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-[#166534] focus:ring-2 focus:ring-[#166534]/15 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Job Title</label>
                  <input 
                    value={formData.job_title}
                    onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                    placeholder="Managing Director"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-[#166534] focus:ring-2 focus:ring-[#166534]/15 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Contact Role / Type</label>
                <select
                  value={formData.contact_type || 'General'}
                  onChange={(e) => setFormData({ ...formData, contact_type: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-[#166534] focus:ring-2 focus:ring-[#166534]/15 transition-all"
                >
                  {CONTACT_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-400 font-medium ml-1">
                  Categorizes whether this contact is an Executive (Owner/CEO), Operations, Reception or General staff.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Categories, Tags & Extended Info */}
        <div className="space-y-6">
          {/* Category Selection Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-50 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#F0FDF4] text-[#166534] flex items-center justify-center font-bold">
                  <Layers size={20} />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-900 block">Select Category</span>
                  <p className="text-[11px] text-slate-500 font-medium">Industry categorization for email campaigns & directory targeting</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsCreatingCategory(!isCreatingCategory)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 bg-white hover:bg-[#F0FDF4] hover:border-[#bbf7d0] text-[#57534E] hover:text-[#166534] transition-all cursor-pointer shadow-xs active:scale-95"
              >
                {isCreatingCategory ? <X size={14} /> : <Plus size={14} />}
                <span>{isCreatingCategory ? 'Cancel' : 'New Category'}</span>
              </button>
            </div>

            {/* Inline Add Category Input */}
            {isCreatingCategory && (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                  Add New Industry Category
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleCreateCategory();
                      }
                    }}
                    placeholder="e.g. Dental Clinics, Real Estate..."
                    className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#166534] focus:ring-2 focus:ring-[#166534]/15"
                  />
                  <button
                    type="button"
                    disabled={creatingCategoryLoading || !newCategoryName.trim()}
                    onClick={() => handleCreateCategory()}
                    className="px-4 py-2 bg-[#166534] hover:bg-[#14532d] text-white rounded-lg text-xs font-semibold disabled:opacity-50 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                  >
                    {creatingCategoryLoading ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
                    <span>Add</span>
                  </button>
                </div>
              </div>
            )}

            {/* Selected Categories Indicator */}
            {selectedCategoryIds.length > 0 && (
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                  Selected Categories ({selectedCategoryIds.length})
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedCategoryIds.map(catId => {
                    const found = categories.find(c => String(c.id) === String(catId));
                    const name = found ? found.name : `Category #${catId}`;
                    return (
                      <span
                        key={catId}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F0FDF4] border border-[#bbf7d0] text-[#166534] rounded-lg text-xs font-bold shadow-sm"
                      >
                        <Check size={12} className="text-[#166534]" />
                        <span>{name}</span>
                        <button
                          type="button"
                          onClick={() => toggleCategory(catId)}
                          className="hover:text-red-500 transition-colors ml-0.5"
                          title="Remove category"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Existing Categories Badges */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                Available Categories
              </span>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => {
                  const isSelected = selectedCategoryIds.some(id => String(id) === String(category.id));
                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => toggleCategory(category.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                        isSelected
                          ? 'bg-[#166534] text-white border-[#166534] shadow-xs'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-[#bbf7d0] hover:text-[#166534] hover:bg-[#F0FDF4]'
                      }`}
                    >
                      {isSelected && <Check size={13} className="text-white" />}
                      <span>{category.name}</span>
                    </button>
                  );
                })}

                {categories.length === 0 && (
                  <p className="text-xs text-slate-400 italic py-1">No custom categories created yet.</p>
                )}
              </div>
            </div>

            {/* Quick Suggestion Chips */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <Sparkles size={12} className="text-amber-500" />
                <span>Suggested Industry Categories</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTED_CATEGORIES.map(sug => {
                  const existing = categories.find(c => c.name.toLowerCase() === sug.toLowerCase());
                  const isSelected = existing && selectedCategoryIds.some(id => String(id) === String(existing.id));
                  return (
                    <button
                      key={sug}
                      type="button"
                      onClick={() => handleCreateCategory(sug)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all border ${
                        isSelected
                          ? 'bg-[#166534] text-white border-[#166534] shadow-sm'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-[#166534] hover:text-[#166534] hover:bg-[#F0FDF4]/50'
                      }`}
                    >
                      {isSelected ? `✓ ${sug}` : `+ ${sug}`}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Tags & Labels */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 space-y-6 shadow-sm">
            <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
               <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                  <Tag size={20} />
               </div>
               <div>
                 <span className="text-xs font-bold uppercase tracking-widest text-slate-900 block">Tags & Labels</span>
                 <p className="text-[11px] text-slate-500 font-medium">Quick organizational tags for filtering and segmentation</p>
               </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {tags.map(tag => {
                const isSelected = formData.tags?.includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    className={`px-3 py-2 rounded-lg text-[11px] font-bold uppercase tracking-tight border transition-all ${
                      isSelected 
                        ? 'bg-[#166534] text-white border-[#166534] shadow-xs' 
                        : 'bg-white text-slate-500 border-slate-200 hover:border-[#bbf7d0] hover:text-[#166534] hover:bg-[#F0FDF4]'
                    }`}
                  >
                    {tag.name}
                  </button>
                );
              })}
              {tags.length === 0 && (
                <p className="text-xs text-slate-400 italic">No tags available.</p>
              )}
            </div>
          </div>

          {/* Extended Information */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 space-y-6 shadow-sm">
            <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
               <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                  <MapPin size={20} />
               </div>
               <div>
                 <span className="text-xs font-bold uppercase tracking-widest text-slate-900 block">Extended Information</span>
                 <p className="text-[11px] text-slate-500 font-medium">Location, online presence and internal notes</p>
               </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Address</label>
                <input 
                  value={formData.address || ''}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="123 Street, City, Country"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-[#166534] focus:ring-2 focus:ring-[#166534]/15 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Birthday</label>
                  <div className="relative">
                    <Calendar size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="date"
                      value={formData.birthday || ''}
                      onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 pl-11 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-[#166534] focus:ring-2 focus:ring-[#166534]/15 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Website</label>
                  <div className="relative">
                    <Globe size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      value={formData.website || ''}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      placeholder="https://example.com"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 pl-11 text-sm font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-[#166534] focus:ring-2 focus:ring-[#166534]/15 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Internal Notes</label>
                <textarea 
                  rows={4}
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Add internal context, preferences, or audit details..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-[#166534] focus:ring-2 focus:ring-[#166534]/15 transition-all resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions Bar */}
        <div className="col-span-1 md:col-span-2 flex items-center justify-end gap-3 pt-6 border-t border-slate-200">
          <button
            type="button"
            onClick={() => navigate('/contacts')}
            className="h-10 px-5 rounded-xl border border-slate-200 bg-white hover:bg-[#F0FDF4] hover:border-[#bbf7d0] text-xs sm:text-sm font-semibold text-[#57534E] hover:text-[#166534] transition-all shadow-xs active:scale-95 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="h-10 px-6 bg-[#166534] hover:bg-[#14532d] text-white rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm hover:shadow-[#166534]/15 active:scale-95 flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={18} />}
            <span>{id ? 'Save Changes' : 'Create Contact'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
