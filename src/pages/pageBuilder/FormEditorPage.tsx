import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Settings,
  Database,
  Sliders,
  Type,
  Mail,
  Phone,
  Hash,
  List,
  CheckSquare,
  CircleDot,
  AlignLeft,
  Calendar,
  Star,
  HelpCircle,
  Eye,
  Tag,
  GitBranch,
  X,
  Code2,
} from 'lucide-react';
import { pageBuilderApi } from '../../services/pageBuilderApi';
import {
  BuilderForm,
  FormField,
  FormStep,
  FormType,
  FieldType,
  ConditionalRule,
  CrmMapping,
  FormSettings,
} from '../../types/pageBuilder';
import { toast } from '../../components/ui/Toast';

const AVAILABLE_FIELDS: Array<{
  type: FieldType;
  label: string;
  icon: any;
  category: 'standard' | 'choices' | 'survey';
}> = [
  { type: 'text', label: 'Single Line Text', icon: Type, category: 'standard' },
  { type: 'email', label: 'Email Address', icon: Mail, category: 'standard' },
  { type: 'phone', label: 'Phone Number', icon: Phone, category: 'standard' },
  { type: 'number', label: 'Number', icon: Hash, category: 'standard' },
  { type: 'textarea', label: 'Multi-line Textarea', icon: AlignLeft, category: 'standard' },
  { type: 'date', label: 'Date Picker', icon: Calendar, category: 'standard' },
  { type: 'dropdown', label: 'Dropdown Menu', icon: List, category: 'choices' },
  { type: 'radio', label: 'Radio Choices', icon: CircleDot, category: 'choices' },
  { type: 'checkbox', label: 'Checkboxes', icon: CheckSquare, category: 'choices' },
  { type: 'rating', label: 'Star Rating (1-5)', icon: Star, category: 'survey' },
  { type: 'yes_no', label: 'Yes / No Question', icon: HelpCircle, category: 'survey' },
];

const CRM_CONTACT_FIELDS = [
  { key: 'name', label: 'Full Name' },
  { key: 'email', label: 'Email Address' },
  { key: 'phone', label: 'Phone Number' },
  { key: 'company', label: 'Company Name' },
  { key: 'job_title', label: 'Job Title' },
  { key: 'notes', label: 'Contact Notes' },
];

export default function FormEditorPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  // Form State
  const [title, setTitle] = useState('New Lead Capture Form');
  const [slug, setSlug] = useState('form-' + Math.floor(Math.random() * 10000));
  const [formType, setFormType] = useState<FormType>('lead_form');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');

  // Schema: Steps & Fields
  const [isMultiStep, setIsMultiStep] = useState(false);
  const [steps, setSteps] = useState<FormStep[]>([
    {
      id: 'step-1',
      title: 'Contact Information',
      description: 'Please provide your details',
      fields: [
        { id: 'f-1', name: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe', required: true, width: 'full' },
        { id: 'f-2', name: 'email', label: 'Email Address', type: 'email', placeholder: 'john@example.com', required: true, width: 'half' },
        { id: 'f-3', name: 'phone', label: 'Phone Number', type: 'phone', placeholder: '+1 (555) 000-0000', required: false, width: 'half' },
        { id: 'f-4', name: 'message', label: 'How can we help you?', type: 'textarea', placeholder: 'Tell us about your project...', required: false, width: 'full' },
      ],
    },
  ]);
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  // Settings
  const [settings, setSettings] = useState<FormSettings>({
    submit_button_text: 'Submit Information',
    thank_you_message: 'Thank you for your submission! Our team will contact you shortly.',
    redirect_url: '',
  });

  // CRM Mapping
  const [crmMapping, setCrmMapping] = useState<CrmMapping>({
    field_mappings: {
      name: 'name',
      email: 'email',
      phone: 'phone',
    },
    auto_tags: ['website-lead'],
    duplicate_strategy: 'update',
  });
  const [tagsInput, setTagsInput] = useState('website-lead');

  // UI state
  const [activeTab, setActiveTab] = useState<'builder' | 'settings' | 'crm'>('builder');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  // Conditional Logic Modal
  const [conditionalField, setConditionalField] = useState<FormField | null>(null);

  // Load existing form
  useEffect(() => {
    if (!id) return;

    const fetchForm = async () => {
      try {
        setLoading(true);
        const res = await pageBuilderApi.getForm(Number(id));
        if (res.success && res.data) {
          const f = res.data;
          setTitle(f.title);
          setSlug(f.slug);
          setFormType(f.form_type);
          setStatus(f.status === 'published' ? 'published' : 'draft');
          if (f.schema) {
            setIsMultiStep(Boolean(f.schema.is_multi_step));
            setSteps(f.schema.steps || []);
          }
          if (f.settings) setSettings(f.settings);
          if (f.crm_mapping) {
            setCrmMapping(f.crm_mapping);
            setTagsInput((f.crm_mapping.auto_tags || []).join(', '));
          }
        }
      } catch (err) {
        toast.error('Failed to load form');
        navigate('/page-builder/forms');
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [id, navigate]);

  // Current active step fields
  const currentStep = steps[activeStepIndex] || steps[0];

  // Add field to active step
  const handleAddField = (type: FieldType) => {
    const fieldId = `field-${Date.now()}`;
    const fieldName = `${type}_${Math.floor(Math.random() * 1000)}`;

    let defaultOptions: string[] | undefined = undefined;
    if (['dropdown', 'radio', 'checkbox'].includes(type)) {
      defaultOptions = ['Option 1', 'Option 2', 'Option 3'];
    }

    const newField: FormField = {
      id: fieldId,
      name: fieldName,
      label: type === 'rating' ? 'Rate your experience' : type === 'yes_no' ? 'Are you satisfied with our service?' : `Your ${type}`,
      type,
      placeholder: `Enter ${type}...`,
      required: type === 'email' || type === 'text',
      width: 'full',
      options: defaultOptions,
      max_stars: type === 'rating' ? 5 : undefined,
    };

    const updatedSteps = [...steps];
    updatedSteps[activeStepIndex] = {
      ...currentStep,
      fields: [...(currentStep.fields || []), newField],
    };
    setSteps(updatedSteps);
    toast.success(`Added ${newField.label}`);
  };

  const handleUpdateField = (fieldId: string, updates: Partial<FormField>) => {
    const updatedSteps = [...steps];
    updatedSteps[activeStepIndex] = {
      ...currentStep,
      fields: currentStep.fields.map((f) => (f.id === fieldId ? { ...f, ...updates } : f)),
    };
    setSteps(updatedSteps);
  };

  const handleDeleteField = (fieldId: string) => {
    const updatedSteps = [...steps];
    updatedSteps[activeStepIndex] = {
      ...currentStep,
      fields: currentStep.fields.filter((f) => f.id !== fieldId),
    };
    setSteps(updatedSteps);
  };

  const handleMoveField = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === currentStep.fields.length - 1) return;

    const nextIndex = direction === 'up' ? index - 1 : index + 1;
    const updatedFields = [...currentStep.fields];
    const [moved] = updatedFields.splice(index, 1);
    updatedFields.splice(nextIndex, 0, moved);

    const updatedSteps = [...steps];
    updatedSteps[activeStepIndex] = {
      ...currentStep,
      fields: updatedFields,
    };
    setSteps(updatedSteps);
  };

  // Step Management
  const handleAddStep = () => {
    const newStep: FormStep = {
      id: `step-${Date.now()}`,
      title: `Step ${steps.length + 1}`,
      fields: [],
    };
    setSteps([...steps, newStep]);
    setIsMultiStep(true);
    setActiveStepIndex(steps.length);
  };

  const handleDeleteStep = (stepIdx: number) => {
    if (steps.length <= 1) {
      toast.error('Form must have at least one step');
      return;
    }
    const updated = steps.filter((_, i) => i !== stepIdx);
    setSteps(updated);
    setActiveStepIndex(Math.max(0, stepIdx - 1));
  };

  // Save / Publish
  const handleSave = async (publishToggle = false) => {
    if (!title.trim()) {
      toast.error('Please enter a form title');
      return;
    }

    try {
      setSaving(true);
      const nextStatus = publishToggle ? (status === 'published' ? 'draft' : 'published') : status;

      // Parse tags
      const autoTags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const payload: Partial<BuilderForm> = {
        title,
        slug,
        form_type: formType,
        status: nextStatus,
        schema: {
          is_multi_step: isMultiStep,
          steps,
        },
        settings,
        crm_mapping: {
          ...crmMapping,
          auto_tags: autoTags,
        },
      };

      let res;
      if (isEditing) {
        res = await pageBuilderApi.updateForm(Number(id), payload);
      } else {
        res = await pageBuilderApi.createForm(payload);
      }

      if (res.success && res.data) {
        setStatus(res.data.status === 'published' ? 'published' : 'draft');
        toast.success(
          publishToggle
            ? `Form ${res.data.status === 'published' ? 'published' : 'unpublished'} successfully!`
            : 'Form saved successfully!'
        );
        if (!isEditing) {
          navigate(`/page-builder/forms/edit/${res.data.id}`, { replace: true });
        }
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save form');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-100">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 py-2.5 shadow-xs flex items-center justify-between gap-4">
        {/* Left: Back & Title */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/page-builder/forms')}
            className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-sm font-bold text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-[#166534] focus:outline-none px-1 py-0.5"
            />
            <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono pl-1">
              <span>/f/{slug}</span>
              <span
                className={`px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase ${
                  status === 'published'
                    ? 'bg-emerald-50 text-[#166534] border border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}
              >
                {status}
              </span>
            </div>
          </div>
        </div>

        {/* Center: Mode Tabs */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTab('builder')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'builder' ? 'bg-white text-[#166534] shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sliders size={13} />
            <span>Form Fields</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'settings' ? 'bg-white text-[#166534] shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Settings size={13} />
            <span>Settings</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('crm')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'crm' ? 'bg-white text-[#166534] shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Database size={13} />
            <span>CRM Sync & Tags</span>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Public Preview */}
          <a
            href={`/f/${slug}`}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5"
          >
            <ExternalLink size={13} />
            <span className="hidden sm:inline">Preview</span>
          </a>

          {/* Save Draft */}
          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave(false)}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-[#166534] border border-[#166534]/40 rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Save size={14} />
            <span>{saving ? 'Saving...' : 'Save Draft'}</span>
          </button>

          {/* Publish / Unpublish */}
          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave(true)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50 ${
              status === 'published'
                ? 'bg-amber-600 hover:bg-amber-700 text-white'
                : 'bg-[#166534] hover:bg-[#14532d] text-white'
            }`}
          >
            {status === 'published' ? <XCircle size={14} /> : <CheckCircle2 size={14} />}
            <span>{status === 'published' ? 'Unpublish' : 'Publish Form'}</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 p-4 sm:p-6 max-w-6xl w-full mx-auto">
        {/* TAB 1: FORM BUILDER CANVAS */}
        {activeTab === 'builder' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Left Palette: Field Types (4 cols) */}
            <div className="md:col-span-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">Field Palette</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Click any field to add it to the active step.</p>
              </div>

              {/* Standard Inputs */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Standard Inputs</span>
                <div className="grid grid-cols-2 gap-1.5">
                  {AVAILABLE_FIELDS.filter((f) => f.category === 'standard').map((f) => {
                    const Icon = f.icon;
                    return (
                      <button
                        key={f.type}
                        type="button"
                        onClick={() => handleAddField(f.type)}
                        className="p-2 text-left bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 flex items-center gap-2 transition-all cursor-pointer group"
                      >
                        <Icon size={14} className="text-slate-400 group-hover:text-[#166534]" />
                        <span className="truncate">{f.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Multiple Choice */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Choice Fields</span>
                <div className="grid grid-cols-2 gap-1.5">
                  {AVAILABLE_FIELDS.filter((f) => f.category === 'choices').map((f) => {
                    const Icon = f.icon;
                    return (
                      <button
                        key={f.type}
                        type="button"
                        onClick={() => handleAddField(f.type)}
                        className="p-2 text-left bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 flex items-center gap-2 transition-all cursor-pointer group"
                      >
                        <Icon size={14} className="text-slate-400 group-hover:text-[#166534]" />
                        <span className="truncate">{f.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Survey & Ratings */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider">Survey & Ratings</span>
                <div className="grid grid-cols-1 gap-1.5">
                  {AVAILABLE_FIELDS.filter((f) => f.category === 'survey').map((f) => {
                    const Icon = f.icon;
                    return (
                      <button
                        key={f.type}
                        type="button"
                        onClick={() => handleAddField(f.type)}
                        className="p-2 text-left bg-purple-50/60 hover:bg-purple-100/70 border border-purple-200 rounded-xl text-xs font-medium text-purple-900 flex items-center gap-2 transition-all cursor-pointer group"
                      >
                        <Icon size={14} className="text-purple-600" />
                        <span>{f.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right: Steps & Fields Canvas (8 cols) */}
            <div className="md:col-span-8 space-y-4">
              {/* Step Navigation Bar */}
              <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-3 overflow-x-auto">
                <div className="flex items-center gap-2">
                  {steps.map((st, sIdx) => (
                    <div
                      key={st.id}
                      onClick={() => setActiveStepIndex(sIdx)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                        activeStepIndex === sIdx
                          ? 'bg-[#166534] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <span>{st.title || `Step ${sIdx + 1}`}</span>
                      {steps.length > 1 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteStep(sIdx);
                          }}
                          className="hover:text-rose-200"
                        >
                          <X size={12} />
                        </button>
                      )}
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={handleAddStep}
                    className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-dashed border-slate-300 rounded-xl text-xs font-bold text-slate-600 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus size={13} />
                    <span>Add Step</span>
                  </button>
                </div>
              </div>

              {/* Fields List Canvas */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">{currentStep.title}</h3>
                    <p className="text-[11px] text-slate-400">
                      {currentStep.fields?.length || 0} fields in this step
                    </p>
                  </div>
                </div>

                {currentStep.fields && currentStep.fields.length > 0 ? (
                  <div className="space-y-3">
                    {currentStep.fields.map((field, fIdx) => {
                      const isFirst = fIdx === 0;
                      const isLast = fIdx === currentStep.fields.length - 1;

                      return (
                        <div
                          key={field.id}
                          className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-emerald-300 transition-all space-y-3 shadow-2xs"
                        >
                          {/* Field Top Row: Label & Actions */}
                          <div className="flex items-center justify-between gap-2">
                            <input
                              type="text"
                              value={field.label}
                              onChange={(e) => handleUpdateField(field.id, { label: e.target.value })}
                              className="text-xs font-bold text-slate-800 bg-white border border-slate-200 rounded-lg px-2 py-1 flex-1 max-w-sm focus:outline-none focus:ring-1 focus:ring-[#166534]"
                              placeholder="Field Label..."
                            />

                            <div className="flex items-center gap-1.5 text-xs">
                              {/* Required toggle */}
                              <label className="flex items-center gap-1 text-[11px] text-slate-600 cursor-pointer font-medium">
                                <input
                                  type="checkbox"
                                  checked={field.required}
                                  onChange={(e) => handleUpdateField(field.id, { required: e.target.checked })}
                                  className="rounded text-[#166534] focus:ring-[#166534]"
                                />
                                <span>Required</span>
                              </label>

                              {/* Width toggle */}
                              <select
                                value={field.width || 'full'}
                                onChange={(e) => handleUpdateField(field.id, { width: e.target.value as any })}
                                className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-[11px] text-slate-600 font-medium"
                              >
                                <option value="full">Full Width</option>
                                <option value="half">Half Width</option>
                              </select>

                              {/* Move Up/Down */}
                              <button
                                type="button"
                                disabled={isFirst}
                                onClick={() => handleMoveField(fIdx, 'up')}
                                className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                              >
                                <ChevronUp size={14} />
                              </button>
                              <button
                                type="button"
                                disabled={isLast}
                                onClick={() => handleMoveField(fIdx, 'down')}
                                className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                              >
                                <ChevronDown size={14} />
                              </button>

                              {/* Delete */}
                              <button
                                type="button"
                                onClick={() => handleDeleteField(field.id)}
                                className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>

                          {/* Placeholder / Option Settings */}
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-[10px] font-mono text-slate-400 uppercase">Input Name:</span>
                            <input
                              type="text"
                              value={field.name}
                              onChange={(e) =>
                                handleUpdateField(field.id, {
                                  name: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''),
                                })
                              }
                              className="px-2 py-0.5 font-mono text-[11px] bg-white border border-slate-200 rounded text-slate-600 focus:outline-none"
                            />

                            {/* Dropdown / Choice Options */}
                            {field.options && (
                              <div className="flex-1 flex items-center gap-1.5 pl-2">
                                <span className="text-[10px] text-slate-400">Options:</span>
                                <input
                                  type="text"
                                  value={field.options.join(', ')}
                                  onChange={(e) =>
                                    handleUpdateField(field.id, {
                                      options: e.target.value.split(',').map((o) => o.trim()),
                                    })
                                  }
                                  placeholder="Option 1, Option 2, Option 3..."
                                  className="flex-1 px-2 py-0.5 text-[11px] bg-white border border-slate-200 rounded text-slate-600"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-8 text-center text-slate-400 space-y-2 border-2 border-dashed border-slate-200 rounded-xl">
                    <Type size={24} className="mx-auto text-slate-300" />
                    <p className="text-xs font-semibold text-slate-600">No fields added to this step</p>
                    <p className="text-[11px]">Click any field in the left palette to add it.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs max-w-2xl mx-auto space-y-5 text-xs">
            <h3 className="text-sm font-bold text-slate-800 pb-3 border-b border-slate-100">
              Form Behavior & Submission Settings
            </h3>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Submit Button Text</label>
              <input
                type="text"
                value={settings.submit_button_text}
                onChange={(e) => setSettings({ ...settings, submit_button_text: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#166534]"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Thank You Message</label>
              <textarea
                rows={3}
                value={settings.thank_you_message}
                onChange={(e) => setSettings({ ...settings, thank_you_message: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#166534]"
              />
              <p className="text-[11px] text-slate-400 mt-0.5">Displayed to user upon successful submission.</p>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Redirect URL (Optional)</label>
              <input
                type="url"
                placeholder="https://yourwebsite.com/thank-you"
                value={settings.redirect_url || ''}
                onChange={(e) => setSettings({ ...settings, redirect_url: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#166534]"
              />
              <p className="text-[11px] text-slate-400 mt-0.5">
                If specified, visitor will automatically be redirected to this URL after submitting.
              </p>
            </div>
          </div>
        )}

        {/* TAB 3: CRM LEAD SYNC & AUTO-TAGS */}
        {activeTab === 'crm' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs max-w-2xl mx-auto space-y-6 text-xs">
            <div>
              <h3 className="text-sm font-bold text-slate-800">CRM Lead Sync & Auto-Tagging</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Configure how submissions map directly into CRM Contacts.
              </p>
            </div>

            {/* Field Mapping */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <h4 className="font-bold text-slate-700">Contact Field Mapping</h4>
              <p className="text-[11px] text-slate-400">Map form inputs to standard CRM Contact columns.</p>

              <div className="space-y-2">
                {CRM_CONTACT_FIELDS.map((cf) => {
                  const currentMappedField = Object.keys(crmMapping.field_mappings || {}).find(
                    (k) => crmMapping.field_mappings[k] === cf.key
                  );

                  return (
                    <div key={cf.key} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="font-bold text-slate-700">{cf.label}</span>
                      <select
                        value={currentMappedField || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          const updated = { ...crmMapping.field_mappings };
                          // Remove old mapping for this CRM column
                          Object.keys(updated).forEach((k) => {
                            if (updated[k] === cf.key) delete updated[k];
                          });
                          if (val) updated[val] = cf.key;
                          setCrmMapping({ ...crmMapping, field_mappings: updated });
                        }}
                        className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-700"
                      >
                        <option value="">-- Not Mapped --</option>
                        {steps
                          .flatMap((s) => s.fields)
                          .map((f) => (
                            <option key={f.id} value={f.name}>
                              {f.label} ({f.name})
                            </option>
                          ))}
                      </select>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Auto Tags */}
            <div className="space-y-2 pt-3 border-t border-slate-100">
              <label className="font-bold text-slate-700 block">Auto-Assign Tags to Created Contacts</label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="website-lead, marketing-inquiry, q4-campaign"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-[#166534]"
              />
              <p className="text-[11px] text-slate-400">
                Comma-separated tags automatically attached to contacts created or updated by this form.
              </p>
            </div>

            {/* Duplicate Strategy */}
            <div className="space-y-2 pt-3 border-t border-slate-100">
              <label className="font-bold text-slate-700 block">Duplicate Contact Handling Strategy</label>
              <select
                value={crmMapping.duplicate_strategy}
                onChange={(e) =>
                  setCrmMapping({ ...crmMapping, duplicate_strategy: e.target.value as any })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-semibold focus:outline-none"
              >
                <option value="update">Update existing contact if email or phone matches (Recommended)</option>
                <option value="create_always">Always create a new contact record</option>
                <option value="skip">Skip contact creation if duplicate is detected</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

