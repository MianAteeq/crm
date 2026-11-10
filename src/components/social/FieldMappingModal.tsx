import React, { useState } from 'react';
import {
  X,
  Check,
  ArrowRight,
  Sparkles,
  Settings,
  Tag,
  ShieldAlert,
  Save,
  HelpCircle,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { MetaLeadForm, FormQuestion } from '../../types/metaLeadAds';
import { metaLeadAdsApi } from '../../services/metaLeadAdsApi';
import { toast } from '../ui/Toast';

interface FieldMappingModalProps {
  form: MetaLeadForm;
  onClose: () => void;
  onSaved: (updatedForm: MetaLeadForm) => void;
}

const CRM_CONTACT_FIELDS = [
  { value: '', label: '-- Do Not Map (Ignore) --' },
  { value: 'name', label: 'Full Name (Contact Name)' },
  { value: 'first_name', label: 'First Name' },
  { value: 'last_name', label: 'Last Name' },
  { value: 'email', label: 'Email Address' },
  { value: 'phone', label: 'Phone / WhatsApp Number' },
  { value: 'company', label: 'Company / Organization' },
  { value: 'job_title', label: 'Job Title / Position' },
  { value: 'address', label: 'City / Street Address' },
  { value: 'notes', label: 'Append to Notes / Description' },
];

export function FieldMappingModal({ form, onClose, onSaved }: FieldMappingModalProps) {
  const [saving, setSaving] = useState(false);
  const [mapping, setMapping] = useState<Record<string, string>>(() => {
    return form.crm_mapping || {};
  });
  const [duplicateStrategy, setDuplicateStrategy] = useState<'update' | 'create_always' | 'skip'>(() => {
    return form.rules?.duplicate_strategy || 'update';
  });
  const [tagInput, setTagInput] = useState('');
  const [autoTags, setAutoTags] = useState<string[]>(() => {
    return form.rules?.auto_tags || ['Facebook Lead', 'Lead Ads'];
  });
  const [autoSync, setAutoSync] = useState(form.auto_sync ?? true);

  const questions: FormQuestion[] = form.questions || [];

  const handleFieldChange = (questionKey: string, crmField: string) => {
    setMapping((prev) => ({
      ...prev,
      [questionKey]: crmField,
    }));
  };

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !autoTags.includes(trimmed)) {
      setAutoTags([...autoTags, trimmed]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setAutoTags(autoTags.filter((t) => t !== tagToRemove));
  };

  const handleAutoSuggest = () => {
    const newMapping: Record<string, string> = { ...mapping };
    questions.forEach((q) => {
      const key = q.key.toLowerCase();
      const label = (q.label || '').toLowerCase();

      if (key.includes('full_name') || label.includes('full name') || key === 'name') {
        newMapping[q.key] = 'name';
      } else if (key.includes('first_name') || label.includes('first name')) {
        newMapping[q.key] = 'first_name';
      } else if (key.includes('last_name') || label.includes('last name')) {
        newMapping[q.key] = 'last_name';
      } else if (key.includes('email') || label.includes('email')) {
        newMapping[q.key] = 'email';
      } else if (key.includes('phone') || label.includes('phone') || label.includes('mobile')) {
        newMapping[q.key] = 'phone';
      } else if (key.includes('company') || label.includes('company')) {
        newMapping[q.key] = 'company';
      } else if (key.includes('job') || label.includes('job') || key.includes('title')) {
        newMapping[q.key] = 'job_title';
      } else if (key.includes('city') || key.includes('address') || label.includes('city')) {
        newMapping[q.key] = 'address';
      }
    });

    setMapping(newMapping);
    toast.success('AI field mapping suggestions applied!');
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await metaLeadAdsApi.updateForm(form.id, {
        crm_mapping: mapping,
        auto_sync: autoSync,
        rules: {
          ...form.rules,
          duplicate_strategy: duplicateStrategy,
          auto_tags: autoTags,
        },
      });

      if (res.success && res.data) {
        toast.success(`Mapping saved for "${form.name}"!`);
        onSaved(res.data);
        onClose();
      }
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Failed to save field mapping.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#166534]" />
              <h3 className="text-base font-bold text-slate-900">CRM Field Mapping & Integration Rules</h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Form: <strong className="text-slate-800">{form.name}</strong> (ID: {form.form_id}) • {form.social_account?.name || 'Page'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          {/* Action Bar */}
          <div className="flex items-center justify-between bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3.5">
            <div className="flex items-center gap-2.5">
              <Sparkles size={18} className="text-[#166534]" />
              <div>
                <p className="text-xs font-bold text-[#166534]">Automatic Field Detection</p>
                <p className="text-[11px] text-emerald-800">
                  Quickly pair standard fields (Full Name, Email, Phone, Company) using smart detection.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleAutoSuggest}
              className="px-3 py-1.5 bg-[#166534] hover:bg-[#14532d] text-white text-xs font-semibold rounded-lg shadow-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Sparkles size={13} />
              Auto-Map Fields
            </button>
          </div>

          {/* Field Mapping Grid */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Layers size={14} className="text-slate-400" />
              Meta Lead Form Questions ({questions.length})
            </h4>

            {questions.length === 0 ? (
              <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <HelpCircle size={24} className="mx-auto text-slate-300 mb-1.5" />
                <p className="text-xs font-medium text-slate-600">No custom questions detected from Meta API.</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Standard fields (name, email, phone) will be automatically extracted.</p>
              </div>
            ) : (
              <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
                <div className="bg-slate-50/80 px-4 py-2.5 grid grid-cols-12 gap-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <div className="col-span-6">Meta Form Question</div>
                  <div className="col-span-1 text-center"></div>
                  <div className="col-span-5">Target CRM Contact Field</div>
                </div>

                {questions.map((q) => {
                  const currentMapped = mapping[q.key] || '';
                  return (
                    <div key={q.key} className="px-4 py-3 grid grid-cols-12 gap-3 items-center hover:bg-slate-50/50 transition-colors">
                      <div className="col-span-6 min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate" title={q.label || q.key}>
                          {q.label || q.key}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <code className="text-[10px] text-slate-400 font-mono bg-slate-100 px-1.5 py-0.5 rounded truncate max-w-[150px]">
                            {q.key}
                          </code>
                          <span className="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
                            {q.type || 'TEXT'}
                          </span>
                        </div>
                      </div>

                      <div className="col-span-1 flex justify-center text-slate-300">
                        <ArrowRight size={14} />
                      </div>

                      <div className="col-span-5">
                        <select
                          value={currentMapped}
                          onChange={(e) => handleFieldChange(q.key, e.target.value)}
                          className={`w-full text-xs rounded-lg border px-3 py-1.5 focus:outline-none transition-colors ${
                            currentMapped
                              ? 'border-[#166534] bg-emerald-50/30 text-emerald-900 font-semibold'
                              : 'border-slate-200 text-slate-500'
                          }`}
                        >
                          {CRM_CONTACT_FIELDS.map((cf) => (
                            <option key={cf.value} value={cf.value}>
                              {cf.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Integration & Duplicate Rules */}
          <div className="border-t border-slate-200 pt-5 space-y-4">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Settings size={14} className="text-slate-400" />
              Lead Ingestion & Deduplication Rules
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Duplicate Strategy */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Duplicate Matching Strategy (Phone / Email)
                </label>
                <select
                  value={duplicateStrategy}
                  onChange={(e) => setDuplicateStrategy(e.target.value as any)}
                  className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 bg-white text-slate-800 focus:outline-none focus:border-[#166534]"
                >
                  <option value="update">Update existing Contact with latest lead info (Recommended)</option>
                  <option value="create_always">Always create a new Contact record</option>
                  <option value="skip">Skip & log duplicate (do not overwrite existing Contact)</option>
                </select>
                <p className="text-[11px] text-slate-400 mt-1">
                  Detects duplicates matching existing CRM phone numbers or normalized emails.
                </p>
              </div>

              {/* Real-Time Sync Toggle */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Webhook Synchronization Status
                </label>
                <div className="flex items-center gap-3 pt-1">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoSync}
                      onChange={(e) => setAutoSync(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#166534]"></div>
                  </label>
                  <span className="text-xs font-medium text-slate-700">
                    {autoSync ? 'Real-Time Auto Sync Active' : 'Synchronization Paused'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  When paused, incoming webhooks are saved into the log but do not create CRM contacts.
                </p>
              </div>
            </div>

            {/* Auto Tags */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Tag size={13} className="text-[#166534]" />
                Auto-Applied CRM Contact Tags
              </label>
              <div className="flex flex-wrap items-center gap-1.5 p-2 bg-slate-50 border border-slate-200 rounded-xl min-h-[42px]">
                {autoTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 bg-white border border-slate-200 text-slate-700 text-xs px-2.5 py-1 rounded-lg font-medium shadow-2xs"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-slate-400 hover:text-rose-500 cursor-pointer ml-0.5"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
                <div className="flex items-center gap-1 flex-1 min-w-[120px]">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    placeholder="Add tag and press Enter..."
                    className="w-full text-xs bg-transparent border-none focus:outline-none text-slate-700 placeholder:text-slate-400 px-1 py-0.5"
                  />
                  {tagInput.trim() && (
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="px-2 py-0.5 bg-[#166534] text-white text-[11px] font-bold rounded hover:bg-[#14532d] shrink-0"
                    >
                      Add
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={handleSave}
            className="px-5 py-2 bg-[#166534] hover:bg-[#14532d] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={14} />
                Save Integration Rules
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

