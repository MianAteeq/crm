import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Search, FileText, Edit3, Trash2, Copy, Eye, Send, 
  X, Check, RefreshCw, Sparkles, Folder, Lock, Bold, Italic, 
  Underline, List, ListOrdered, MousePointerClick, Smartphone, 
  Monitor, Layout, Tag, ShieldCheck, CheckCheck, ExternalLink,
  AlignLeft, AlignCenter, AlignRight, AlignJustify
} from 'lucide-react';
import { emailCampaignApi } from '../../services/emailCampaignApi';
import { EmailTemplate } from '../../types/emailCampaign';
import { toast } from '../../components/ui/Toast';
import { PROFESSIONAL_FRAMES, EmailFrame, assembleFullEmailHtml } from '../../utils/emailTemplateFrames';

const CATEGORIES = ['All', 'Sales', 'Introduction', 'Follow-up', 'Appointment', 'Newsletter', 'General'];

export default function EmailTemplatesPage() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  // CTA Button Modal State
  const [isButtonModalOpen, setIsButtonModalOpen] = useState(false);
  const [buttonText, setButtonText] = useState('Schedule a 10-Minute Call');
  const [buttonUrl, setButtonUrl] = useState('https://calendly.com');
  const [buttonColor, setButtonColor] = useState('#2563eb');
  const [buttonAlign, setButtonAlign] = useState<'left' | 'center'>('left');
  const lastSavedRangeRef = useRef<Range | null>(null);

  const saveVisualEditorSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      if (visualEditorRef.current && visualEditorRef.current.contains(range.commonAncestorContainer)) {
        lastSavedRangeRef.current = range.cloneRange();
        return;
      }
    }
    lastSavedRangeRef.current = null;
  };

  // Form fields
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('Sales');
  const [selectedFrameId, setSelectedFrameId] = useState<string>('executive');
  const activeFrame = PROFESSIONAL_FRAMES.find(f => f.id === selectedFrameId) || PROFESSIONAL_FRAMES[0];

  // User ONLY edits this body message! Header & Footer are locked/managed automatically!
  const [userBodyMessage, setUserBodyMessage] = useState(activeFrame.defaultBody);
  const [textBody, setTextBody] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const visualEditorRef = useRef<HTMLDivElement>(null);

  const fetchTemplates = async () => {
    setIsLoading(true);
    try {
      const res = await emailCampaignApi.getTemplates({
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        search: search || undefined,
      });
      setTemplates(res.data || []);
    } catch (err) {
      toast.error('Failed to load email templates');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, [selectedCategory]);

  // Sync Visual Editor HTML when modal opens
  useEffect(() => {
    if (isModalOpen && visualEditorRef.current) {
      if (visualEditorRef.current.innerHTML !== userBodyMessage) {
        visualEditorRef.current.innerHTML = userBodyMessage;
      }
    }
  }, [isModalOpen, selectedFrameId]);

  const openCreateModal = (defaultFrameId = 'executive') => {
    const frame = PROFESSIONAL_FRAMES.find(f => f.id === defaultFrameId) || PROFESSIONAL_FRAMES[0];
    setEditingTemplate(null);
    setSelectedFrameId(frame.id);
    setName(frame.name + ' Template');
    setSubject(frame.defaultSubject);
    setCategory(frame.category);
    setUserBodyMessage(frame.defaultBody);
    setTextBody('');
    setIsModalOpen(true);
  };

  const openEditModal = (t: EmailTemplate) => {
    setEditingTemplate(t);
    setName(t.name);
    setSubject(t.subject);
    setCategory(t.category);

    // Try to detect frame from name or HTML, or default to executive
    const matchedFrame = PROFESSIONAL_FRAMES.find(f => 
      t.name.toLowerCase().includes(f.name.toLowerCase()) || 
      (t.html_body && t.html_body.includes(f.accentBorder))
    ) || PROFESSIONAL_FRAMES[0];
    
    setSelectedFrameId(matchedFrame.id);

    // Extract body content if inside table, otherwise use html_body
    const bodyMatch = t.html_body.match(/<!-- EDITABLE BODY TEXT -->[\s\S]*?<td[^>]*>([\s\S]*?)<\/td>/i) ||
                      t.html_body.match(/<!-- BODY \(USER'S MESSAGE ONLY\) -->[\s\S]*?<td[^>]*>([\s\S]*?)<\/td>/i);
    const bodyContent = bodyMatch ? bodyMatch[1].trim() : t.html_body;
    
    setUserBodyMessage(bodyContent);
    setTextBody(t.text_body || '');
    setIsModalOpen(true);
  };

  const handleSelectFrame = (frameId: string) => {
    const found = PROFESSIONAL_FRAMES.find(f => f.id === frameId);
    if (!found) return;
    setSelectedFrameId(frameId);
    if (!editingTemplate) {
      setName(found.name + ' Template');
      setSubject(found.defaultSubject);
      setCategory(found.category);
      setUserBodyMessage(found.defaultBody);
      if (visualEditorRef.current) {
        visualEditorRef.current.innerHTML = found.defaultBody;
      }
    }
  };

  const applyVisualFormat = (command: string, value: string | undefined = undefined) => {
    if (visualEditorRef.current) {
      visualEditorRef.current.focus();

      if (
        (command === 'insertUnorderedList' || command === 'insertOrderedList') &&
        (!visualEditorRef.current.innerHTML || visualEditorRef.current.innerHTML.trim() === '' || visualEditorRef.current.innerHTML.trim() === '<br>')
      ) {
        const tag = command === 'insertUnorderedList' ? 'ul' : 'ol';
        visualEditorRef.current.innerHTML = `<${tag}><li>List item</li></${tag}>`;
        setUserBodyMessage(visualEditorRef.current.innerHTML);
        return;
      }

      document.execCommand(command, false, value);
      setUserBodyMessage(visualEditorRef.current.innerHTML);
    }
  };

  // Open CTA Button Modal
  const handleOpenButtonModal = () => {
    saveVisualEditorSelection();
    setIsButtonModalOpen(true);
  };

  const handleInsertButtonSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const label = buttonText.trim() || 'Click Here';
    const url = buttonUrl.trim() || 'https://';
    const color = buttonColor || '#2563eb';
    const align = buttonAlign || 'left';

    // Bulletproof Cross-Client HTML Email Button (Gmail, Outlook, Apple Mail)
    const buttonHtml = `&nbsp;<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin: 16px ${align === 'center' ? 'auto' : '0'}; border-collapse: separate; display: inline-table;"><tr><td align="center" bgcolor="${color}" style="border-radius: 8px; background-color: ${color};"><a href="${url}" target="_blank" style="font-size: 14px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-weight: bold; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 8px; display: inline-block; mso-padding-alt: 0; border: 1px solid ${color};">${label} &rarr;</a></td></tr></table>&nbsp;`;

    if (visualEditorRef.current) {
      visualEditorRef.current.focus();
      const sel = window.getSelection();
      let inserted = false;
      if (lastSavedRangeRef.current && sel) {
        try {
          sel.removeAllRanges();
          sel.addRange(lastSavedRangeRef.current);
          document.execCommand('insertHTML', false, buttonHtml);
          inserted = true;
        } catch (err) {
          // fallback
        }
      }
      if (!inserted) {
        visualEditorRef.current.innerHTML += `<p><br/>${buttonHtml}<br/></p>`;
      }
      setUserBodyMessage(visualEditorRef.current.innerHTML);
      toast.success('CTA Button inserted into message body');
    }
    setIsButtonModalOpen(false);
  };

  const insertTagIntoBody = (tag: string) => {
    if (visualEditorRef.current) {
      visualEditorRef.current.focus();
      document.execCommand('insertText', false, ' ' + tag + ' ');
      setUserBodyMessage(visualEditorRef.current.innerHTML);
      toast.success(`Inserted ${tag}`);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !subject || !userBodyMessage) {
      toast.error('Please fill in Template Name, Subject, and Message Body.');
      return;
    }

    // Assemble complete professional responsive HTML
    const fullHtml = assembleFullEmailHtml(activeFrame, userBodyMessage, '{{from_name}}');

    setIsSaving(true);
    try {
      if (editingTemplate) {
        await emailCampaignApi.updateTemplate(editingTemplate.id, {
          name,
          subject,
          category,
          html_body: fullHtml,
          text_body: textBody || undefined,
        });
        toast.success('Template updated successfully');
      } else {
        await emailCampaignApi.createTemplate({
          name,
          subject,
          category,
          html_body: fullHtml,
          text_body: textBody || undefined,
        });
        toast.success('Template created successfully');
      }
      setIsModalOpen(false);
      fetchTemplates();
    } catch (err) {
      toast.error('Failed to save template');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDuplicate = async (id: number) => {
    try {
      await emailCampaignApi.duplicateTemplate(id);
      toast.success('Template duplicated');
      fetchTemplates();
    } catch (err) {
      toast.error('Failed to duplicate template');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this template?')) return;
    try {
      await emailCampaignApi.deleteTemplate(id);
      toast.success('Template deleted');
      setTemplates(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      toast.error('Failed to delete template');
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/20">
              <FileText size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Email Templates</h1>
              <p className="text-xs text-slate-500">
                Professional, brand-ready email templates with locked headers & footers. Edit message body freely.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => openCreateModal()}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/20"
        >
          <Plus size={16} />
          Create New Template
        </button>
      </div>

      {/* Quick Frame Starter Cards */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-50 via-indigo-50/40 to-slate-50 border border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
            <Layout size={14} className="text-indigo-600" />
            Start with a Professional Framed Layout:
          </span>
          <span className="text-[11px] text-slate-400">Header & Footer included automatically</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {PROFESSIONAL_FRAMES.map((frame) => (
            <button
              key={frame.id}
              onClick={() => openCreateModal(frame.id)}
              className="p-3 bg-white rounded-xl border border-slate-200 hover:border-indigo-500 hover:shadow-sm text-left transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className={`w-3 h-3 rounded-full ${frame.accentBg}`} />
                <span className="text-[9px] font-bold text-indigo-600 group-hover:underline">+ Use</span>
              </div>
              <p className="font-bold text-xs text-slate-900 mt-2">{frame.name}</p>
              <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{frame.badge}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchTemplates()}
            placeholder="Search templates..."
            className="w-full pl-10 pr-4 py-2 text-xs font-medium rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>
      </div>

      {/* Template Grid */}
      {isLoading ? (
        <div className="p-16 flex flex-col items-center justify-center gap-3 text-slate-400 bg-white rounded-2xl border border-slate-200">
          <RefreshCw size={24} className="animate-spin text-indigo-600" />
          <p className="text-xs font-semibold uppercase tracking-wider">Loading templates...</p>
        </div>
      ) : templates.length === 0 ? (
        <div className="p-16 text-center space-y-4 bg-white rounded-2xl border border-slate-200">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <FileText size={28} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">No email templates found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Create your first reusable professional template for outbound sales, clinics, introductions, or follow-ups.
            </p>
          </div>
          <button
            onClick={() => openCreateModal()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/20"
          >
            <Plus size={14} />
            Create First Template
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div
              key={template.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between overflow-hidden group"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-100">
                    {template.category}
                  </span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setPreviewTemplate(template)}
                      title="Preview"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-50 transition-colors"
                    >
                      <Eye size={15} />
                    </button>
                    <button
                      onClick={() => openEditModal(template)}
                      title="Edit"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      onClick={() => handleDuplicate(template.id)}
                      title="Duplicate"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                    >
                      <Copy size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(template.id)}
                      title="Delete"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">{template.name}</h3>
                  <p className="text-xs text-indigo-600 font-medium mt-1 truncate">
                    Subject: {template.subject}
                  </p>
                </div>

                {/* MINIATURE VISUAL CARD PREVIEW */}
                <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 space-y-2 text-xs overflow-hidden">
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 border-b border-slate-200/60 pb-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Responsive Email Template</span>
                  </div>
                  <div 
                    className="text-[11px] text-slate-600 line-clamp-3 leading-relaxed"
                    dangerouslySetInnerHTML={{ 
                      __html: template.html_body
                        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
                        .replace(/<[^>]*>?/gm, ' ')
                        .replace(/\s+/g, ' ')
                        .trim()
                        .slice(0, 150) + '...'
                    }}
                  />
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-4 border-t border-slate-100 bg-slate-50/40 flex items-center justify-between">
                <button
                  onClick={() => setPreviewTemplate(template)}
                  className="text-xs font-bold text-slate-600 hover:text-slate-900"
                >
                  Quick Preview
                </button>
                <button
                  onClick={() => navigate(`/email-campaigns/create?templateId=${template.id}`)}
                  className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700"
                >
                  Use in Campaign
                  <Send size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE / EDIT TEMPLATE MODAL (HEADER + BODY + FOOTER) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Layout size={18} className="text-indigo-600" />
                  {editingTemplate ? 'Edit Email Template' : 'Create Framed Email Template'}
                </h3>
                <p className="text-xs text-slate-500">
                  Header and Footer stay locked and branded. Type your message body in the center canvas.
                </p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="w-8 h-8 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-all"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSave} className="p-6 space-y-5 overflow-y-auto flex-1">
              
              {/* Template Style Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Choose Template Style Frame
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {PROFESSIONAL_FRAMES.map((frame) => {
                    const isSelected = frame.id === selectedFrameId;
                    return (
                      <button
                        key={frame.id}
                        type="button"
                        onClick={() => handleSelectFrame(frame.id)}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          isSelected 
                            ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-600/10' 
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <span className={`inline-block w-2.5 h-2.5 rounded-full ${frame.accentBg} mb-1`} />
                        <p className="font-bold text-[11px] text-slate-900 truncate">{frame.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">{frame.badge}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Template Name & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Template Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Modern Executive Outreach"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500/20"
                  >
                    {CATEGORIES.filter(c => c !== 'All').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Subject */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase">Default Subject *</label>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500">
                    <span className="font-semibold">Insert:</span>
                    {[
                      { label: 'Name', tag: '{{first_name | default: "there"}}' },
                      { label: 'Business Name', tag: '{{business_name}}' },
                    ].map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSubject(prev => `${prev} ${item.tag}`.trim())}
                        className="px-2 py-0.5 rounded bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 font-medium transition-colors"
                      >
                        + {item.label}
                      </button>
                    ))}
                  </div>
                </div>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Quick question regarding {{business_name}}"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 font-medium text-slate-900 focus:ring-2 focus:ring-indigo-500/20"
                  required
                />
              </div>

              {/* Visual Body Formatting Toolbar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Message Body (Only type here) *
                  </label>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500">
                    <span className="font-semibold">Insert Tag:</span>
                    {[
                      { label: 'Name', tag: '{{first_name | default: "there"}}' },
                      { label: 'Business Name', tag: '{{business_name}}' },
                    ].map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => insertTagIntoBody(item.tag)}
                        className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
                      >
                        + {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => applyVisualFormat('bold')}
                      className="p-1.5 rounded-lg hover:bg-white text-slate-700 font-bold"
                      title="Bold"
                    >
                      <Bold size={15} />
                    </button>
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => applyVisualFormat('italic')}
                      className="p-1.5 rounded-lg hover:bg-white text-slate-700"
                      title="Italic"
                    >
                      <Italic size={15} />
                    </button>
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => applyVisualFormat('underline')}
                      className="p-1.5 rounded-lg hover:bg-white text-slate-700"
                      title="Underline"
                    >
                      <Underline size={15} />
                    </button>
                    <div className="h-4 w-px bg-slate-300 mx-1" />
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => applyVisualFormat('insertUnorderedList')}
                      className="p-1.5 rounded-lg hover:bg-white text-slate-700"
                      title="Bullet List"
                    >
                      <List size={15} />
                    </button>
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => applyVisualFormat('insertOrderedList')}
                      className="p-1.5 rounded-lg hover:bg-white text-slate-700"
                      title="Numbered List"
                    >
                      <ListOrdered size={15} />
                    </button>
                    <div className="h-4 w-px bg-slate-300 mx-1" />

                    {/* Content Alignment Buttons */}
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => applyVisualFormat('justifyLeft')}
                      className="p-1.5 rounded-lg hover:bg-white text-slate-700"
                      title="Align Left"
                    >
                      <AlignLeft size={15} />
                    </button>
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => applyVisualFormat('justifyCenter')}
                      className="p-1.5 rounded-lg hover:bg-white text-slate-700"
                      title="Align Center"
                    >
                      <AlignCenter size={15} />
                    </button>
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => applyVisualFormat('justifyRight')}
                      className="p-1.5 rounded-lg hover:bg-white text-slate-700"
                      title="Align Right"
                    >
                      <AlignRight size={15} />
                    </button>
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => applyVisualFormat('justifyFull')}
                      className="p-1.5 rounded-lg hover:bg-white text-slate-700"
                      title="Justify"
                    >
                      <AlignJustify size={15} />
                    </button>

                    <div className="h-4 w-px bg-slate-300 mx-1" />
                    <button
                      type="button"
                      onMouseDown={() => saveVisualEditorSelection()}
                      onClick={handleOpenButtonModal}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-indigo-500 text-xs font-bold text-slate-700 transition-all hover:bg-slate-50"
                    >
                      <MousePointerClick size={13} className="text-indigo-600" />
                      <span>+ Add Button</span>
                    </button>
                  </div>
                </div>

                {/* TEMPLATE VISUAL PREVIEW CONTAINER WITH LOCKED HEADER & FOOTER */}
                <div className="p-4 rounded-2xl bg-slate-100 flex justify-center">
                  <div className="w-full max-w-xl bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    
                    {/* Locked Header */}
                    <div className="relative group select-none">
                      <div dangerouslySetInnerHTML={{ __html: activeFrame.renderHeader('{{from_name}}') }} />
                      <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-0.5 rounded text-[9px] font-bold flex items-center gap-1">
                        <Lock size={9} />
                        Locked Header
                      </div>
                    </div>

                    {/* Editable Body Area */}
                    <div className="p-6 bg-white">
                      <div
                        ref={visualEditorRef}
                        contentEditable
                        onInput={() => {
                          if (visualEditorRef.current) {
                            setUserBodyMessage(visualEditorRef.current.innerHTML);
                          }
                        }}
                        className="email-canvas-body min-h-[220px] text-slate-800 text-sm leading-relaxed focus:outline-none"
                      />
                    </div>

                    {/* Locked Footer */}
                    <div className="relative group select-none">
                      <div dangerouslySetInnerHTML={{ __html: activeFrame.renderFooter('{{from_name}}') }} />
                      <div className="absolute bottom-2 right-2 bg-slate-200 text-slate-600 px-2 py-0.5 rounded text-[9px] font-bold flex items-center gap-1">
                        <Lock size={9} />
                        Locked Footer
                      </div>
                    </div>

                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 text-xs font-bold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-md shadow-indigo-600/20"
                >
                  {isSaving ? 'Saving...' : 'Save Template'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QUICK PREVIEW MODAL */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-base font-bold text-slate-900">{previewTemplate.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">Subject: {previewTemplate.subject}</p>
              </div>

              <div className="flex items-center gap-2">
                {/* Device Switcher */}
                <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('desktop')}
                    className={`p-1.5 rounded-lg text-xs font-bold ${previewDevice === 'desktop' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}
                  >
                    <Monitor size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('mobile')}
                    className={`p-1.5 rounded-lg text-xs font-bold ${previewDevice === 'mobile' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}
                  >
                    <Smartphone size={14} />
                  </button>
                </div>
                <button 
                  onClick={() => setPreviewTemplate(null)} 
                  className="w-8 h-8 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Preview Canvas */}
            <div className="p-6 bg-slate-100 overflow-y-auto flex-1 flex justify-center items-center min-h-[360px]">
              <div className={`transition-all duration-300 bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden ${
                previewDevice === 'desktop' ? 'w-full max-w-xl' : 'w-[360px] max-w-full'
              }`}>
                <div 
                  className="prose prose-sm max-w-none text-xs leading-relaxed"
                  dangerouslySetInnerHTML={{ 
                    __html: previewTemplate.html_body
                      .replace(/\{\{\s*first_name[^}]*\}\}/g, 'Farhan')
                      .replace(/\{\{\s*business_name[^}]*\}\}/g, 'Apex Dental Studio')
                      .replace(/\{\{\s*city[^}]*\}\}/g, 'Lahore')
                      .replace(/\{\{\s*from_name[^}]*\}\}/g, 'Ali Khan')
                      .replace(/\{\{\s*unsubscribe_url[^}]*\}\}/g, '#')
                  }} 
                />
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <button
                onClick={() => setPreviewTemplate(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const id = previewTemplate.id;
                  setPreviewTemplate(null);
                  navigate(`/email-campaigns/create?templateId=${id}`);
                }}
                className="flex items-center gap-2 px-5 py-2 text-xs font-bold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-md shadow-indigo-600/20"
              >
                Use in Campaign
                <Send size={13} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CTA BUTTON MODAL */}
      {isButtonModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full flex flex-col overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-50/70 via-blue-50/50 to-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30">
                  <MousePointerClick size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    Insert Call-to-Action Button
                  </h3>
                  <p className="text-xs text-slate-500">Bulletproof email button compatible with Gmail, Outlook & Apple Mail</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setIsButtonModalOpen(false)}
                className="w-8 h-8 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-all"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleInsertButtonSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Button Text *
                </label>
                <input
                  type="text"
                  required
                  value={buttonText}
                  onChange={(e) => setButtonText(e.target.value)}
                  placeholder="e.g. Schedule a 10-Minute Call"
                  className="w-full px-3.5 py-2.5 text-xs font-medium rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase py-0.5">Presets:</span>
                  {[
                    'Schedule a 10-Minute Call',
                    'Book Free Consultation',
                    'Claim Special Offer',
                    'Visit Website',
                    'View Portfolio'
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setButtonText(preset)}
                      className="px-2 py-0.5 text-[10px] rounded-md bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 font-medium transition-all"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Button Destination Link (URL) *
                </label>
                <div className="relative">
                  <ExternalLink size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="url"
                    required
                    value={buttonUrl}
                    onChange={(e) => setButtonUrl(e.target.value)}
                    placeholder="https://calendly.com/your-name/meeting"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs font-medium rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Button Color
                  </label>
                  <div className="flex items-center gap-2">
                    {[
                      { name: 'Blue', color: '#2563eb' },
                      { name: 'Indigo', color: '#4f46e5' },
                      { name: 'Green', color: '#059669' },
                      { name: 'Dark', color: '#0f172a' },
                      { name: 'Purple', color: '#7c3aed' },
                      { name: 'Rose', color: '#e11d48' },
                    ].map((col) => (
                      <button
                        key={col.color}
                        type="button"
                        onClick={() => setButtonColor(col.color)}
                        className={`w-7 h-7 rounded-full border-2 transition-transform ${
                          buttonColor === col.color ? 'scale-115 border-slate-900 shadow-sm' : 'border-white hover:scale-105'
                        }`}
                        style={{ backgroundColor: col.color }}
                        title={col.name}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Alignment
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setButtonAlign('left')}
                      className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold border transition-all ${
                        buttonAlign === 'left'
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      Left
                    </button>
                    <button
                      type="button"
                      onClick={() => setButtonAlign('center')}
                      className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold border transition-all ${
                        buttonAlign === 'center'
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      Center
                    </button>
                  </div>
                </div>
              </div>

              {/* Live Button Preview */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Preview in Email:
                </span>
                <div style={{ textAlign: buttonAlign }}>
                  <span
                    style={{
                      display: 'inline-block',
                      backgroundColor: buttonColor,
                      color: '#ffffff',
                      padding: '10px 24px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 'bold',
                      fontFamily: 'sans-serif'
                    }}
                  >
                    {buttonText || 'Button Text'} &rarr;
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsButtonModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1.5"
                >
                  <Plus size={14} />
                  <span>Insert Button</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
