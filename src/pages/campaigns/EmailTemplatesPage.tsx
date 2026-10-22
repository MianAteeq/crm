import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Search, FileText, Edit3, Trash2, Copy, Eye, Send, 
  X, Check, RefreshCw, Sparkles, Folder, Lock, Bold, Italic, 
  Underline, List, ListOrdered, MousePointerClick, Smartphone, 
  Monitor, Layout, Tag, ShieldCheck, CheckCheck, ExternalLink,
  AlignLeft, AlignCenter, AlignRight, AlignJustify, Globe
} from 'lucide-react';
import { emailCampaignApi } from '../../services/emailCampaignApi';
import { EmailTemplate } from '../../types/emailCampaign';
import { toast } from '../../components/ui/Toast';
import { PROFESSIONAL_FRAMES, EmailFrame, assembleFullEmailHtml } from '../../utils/emailTemplateFrames';
import { useI18n } from '../../i18n';
import { LanguageSwitcher } from '../../components/common/LanguageSwitcher';

const CATEGORIES = ['All', 'Sales', 'Introduction', 'Follow-up', 'Appointment', 'Newsletter', 'General'];

const CATEGORY_LOCALIZATION: Record<string, { en: string; ar: string }> = {
  'All': { en: 'All', ar: 'الكل' },
  'Sales': { en: 'Sales', ar: 'المبيعات' },
  'Introduction': { en: 'Introduction', ar: 'التعريف والتقديم' },
  'Follow-up': { en: 'Follow-up', ar: 'المتابعة' },
  'Appointment': { en: 'Appointment', ar: 'المواعيد' },
  'Newsletter': { en: 'Newsletter', ar: 'النشرات الإخبارية' },
  'General': { en: 'General', ar: 'عام' },
};

export default function EmailTemplatesPage() {
  const navigate = useNavigate();
  const { isRtl, locale } = useI18n();

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
  const [buttonText, setButtonText] = useState(isRtl ? 'حجز مكالمة لمدة 10 دقائق' : 'Schedule a 10-Minute Call');
  const [buttonUrl, setButtonUrl] = useState('https://calendly.com');
  const [buttonColor, setButtonColor] = useState('#2563eb');
  const [buttonAlign, setButtonAlign] = useState<'left' | 'center' | 'right'>(isRtl ? 'right' : 'left');
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
  const [userBodyMessage, setUserBodyMessage] = useState(isRtl ? (activeFrame.defaultBodyAr || activeFrame.defaultBody) : activeFrame.defaultBody);
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
      toast.error(isRtl ? 'فشل تحميل قوالب البريد الإلكتروني' : 'Failed to load email templates');
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

    const initialName = isRtl 
      ? `قالب ${frame.nameAr || frame.name}` 
      : `${frame.name} Template`;
    const initialSubject = isRtl 
      ? (frame.defaultSubjectAr || frame.defaultSubject) 
      : frame.defaultSubject;
    const initialBody = isRtl 
      ? (frame.defaultBodyAr || frame.defaultBody) 
      : frame.defaultBody;

    setName(initialName);
    setSubject(initialSubject);
    setCategory(frame.category || 'Sales');
    setUserBodyMessage(initialBody);
    setTextBody('');
    setButtonAlign(isRtl ? 'right' : 'left');
    setButtonText(isRtl ? 'حجز مكالمة لمدة 10 دقائق' : 'Schedule a 10-Minute Call');
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
      (f.nameAr && t.name.includes(f.nameAr)) ||
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
      const newName = isRtl 
        ? `قالب ${found.nameAr || found.name}` 
        : `${found.name} Template`;
      const newSubject = isRtl 
        ? (found.defaultSubjectAr || found.defaultSubject) 
        : found.defaultSubject;
      const newBody = isRtl 
        ? (found.defaultBodyAr || found.defaultBody) 
        : found.defaultBody;

      setName(newName);
      setSubject(newSubject);
      setCategory(found.category || 'Sales');
      setUserBodyMessage(newBody);
      if (visualEditorRef.current) {
        visualEditorRef.current.innerHTML = newBody;
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
        const defaultItem = isRtl ? 'عنصر في القائمة' : 'List item';
        visualEditorRef.current.innerHTML = `<${tag}><li>${defaultItem}</li></${tag}>`;
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
    const label = buttonText.trim() || (isRtl ? 'انقر هنا' : 'Click Here');
    const url = buttonUrl.trim() || 'https://';
    const color = buttonColor || '#2563eb';
    const align = buttonAlign || (isRtl ? 'right' : 'left');

    const marginValue = align === 'center' ? '16px auto' : align === 'right' ? '16px 0 16px auto' : '16px auto 16px 0';
    const arrow = isRtl ? '&larr;' : '&rarr;';

    // Bulletproof Cross-Client HTML Email Button (Gmail, Outlook, Apple Mail)
    const buttonHtml = `&nbsp;<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin: ${marginValue}; border-collapse: separate; display: inline-table; direction: ${isRtl ? 'rtl' : 'ltr'};"><tr><td align="center" bgcolor="${color}" style="border-radius: 8px; background-color: ${color};"><a href="${url}" target="_blank" style="font-size: 14px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-weight: bold; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 8px; display: inline-block; mso-padding-alt: 0; border: 1px solid ${color};">${label} ${arrow}</a></td></tr></table>&nbsp;`;

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
      toast.success(isRtl ? 'تم إدراج زر الإجراء داخل نص الرسالة' : 'CTA Button inserted into message body');
    }
    setIsButtonModalOpen(false);
  };

  const insertTagIntoBody = (tag: string) => {
    if (visualEditorRef.current) {
      visualEditorRef.current.focus();
      document.execCommand('insertText', false, ' ' + tag + ' ');
      setUserBodyMessage(visualEditorRef.current.innerHTML);
      toast.success(isRtl ? `تم إدراج المتغير ${tag}` : `Inserted ${tag}`);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !subject || !userBodyMessage) {
      toast.error(isRtl ? 'يرجى ملء اسم القالب والموضوع ونص الرسالة.' : 'Please fill in Template Name, Subject, and Message Body.');
      return;
    }

    // Assemble complete professional responsive HTML
    const fullHtml = assembleFullEmailHtml(activeFrame, userBodyMessage, '{{from_name}}', isRtl);

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
        toast.success(isRtl ? 'تم تحديث القالب بنجاح' : 'Template updated successfully');
      } else {
        await emailCampaignApi.createTemplate({
          name,
          subject,
          category,
          html_body: fullHtml,
          text_body: textBody || undefined,
        });
        toast.success(isRtl ? 'تم إنشاء القالب بنجاح' : 'Template created successfully');
      }
      setIsModalOpen(false);
      fetchTemplates();
    } catch (err) {
      toast.error(isRtl ? 'فشل حفظ القالب' : 'Failed to save template');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDuplicate = async (id: number) => {
    try {
      await emailCampaignApi.duplicateTemplate(id);
      toast.success(isRtl ? 'تم نسخ القالب بنجاح' : 'Template duplicated');
      fetchTemplates();
    } catch (err) {
      toast.error(isRtl ? 'فشل تكرار القالب' : 'Failed to duplicate template');
    }
  };

  const handleDelete = async (id: number) => {
    const confirmMessage = isRtl 
      ? 'هل أنت متأكد من رغبتك في حذف هذا القالب؟' 
      : 'Are you sure you want to delete this template?';
    if (!window.confirm(confirmMessage)) return;
    try {
      await emailCampaignApi.deleteTemplate(id);
      toast.success(isRtl ? 'تم حذف القالب' : 'Template deleted');
      setTemplates(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      toast.error(isRtl ? 'فشل حذف القالب' : 'Failed to delete template');
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#166534] text-white flex items-center justify-center shadow-lg shadow-[#166534]/20 shrink-0">
            <FileText size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {isRtl ? 'قوالب البريد الإلكتروني' : 'Email Templates'}
            </h1>
            <p className="text-xs text-slate-500">
              {isRtl 
                ? 'قوالب بريد إلكتروني احترافية جاهزة مع ترويسة وتذييل مثبتين. يمكنك تعديل محتوى الرسالة بحرية.' 
                : 'Professional, brand-ready email templates with locked headers & footers. Edit message body freely.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <LanguageSwitcher variant="dropdown" />
          <button
            onClick={() => openCreateModal()}
            className="h-10 px-5 rounded-xl bg-[#166534] hover:bg-[#14532d] text-white text-xs sm:text-sm font-semibold transition-all shadow-sm hover:shadow-[#166534]/15 active:scale-95 flex items-center gap-2 cursor-pointer"
          >
            <Plus size={16} />
            <span>{isRtl ? 'إنشاء قالب جديد' : 'Create New Template'}</span>
          </button>
        </div>
      </div>

      {/* Quick Frame Starter Cards */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-50 via-emerald-50/30 to-slate-50 border border-slate-200 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
            <Layout size={14} className="text-[#166534]" />
            {isRtl ? 'ابدأ بتخطيط احترافي مؤطر:' : 'Start with a Professional Framed Layout:'}
          </span>
          <span className="text-[11px] text-slate-400">
            {isRtl ? 'الترويسة والتذييل مضمّنان ومحميان تلقائياً' : 'Header & Footer included automatically'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {PROFESSIONAL_FRAMES.map((frame) => (
            <button
              key={frame.id}
              onClick={() => openCreateModal(frame.id)}
              className="p-3 bg-white rounded-xl border border-slate-200 hover:border-[#166534] hover:shadow-sm text-start transition-all group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className={`w-3 h-3 rounded-full ${frame.accentBg}`} />
                <span className="text-[9px] font-bold text-[#166534] group-hover:underline">
                  {isRtl ? '+ استخدام' : '+ Use'}
                </span>
              </div>
              <p className="font-bold text-xs text-slate-900 mt-2">
                {isRtl ? (frame.nameAr || frame.name) : frame.name}
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">
                {isRtl ? (frame.badgeAr || frame.badge) : frame.badge}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {CATEGORIES.map((cat) => {
            const locName = isRtl ? (CATEGORY_LOCALIZATION[cat]?.ar || cat) : (CATEGORY_LOCALIZATION[cat]?.en || cat);
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#166534] text-white shadow-xs'
                    : 'text-[#57534E] hover:text-[#12263A] hover:bg-[#F0FDF4]'
                }`}
              >
                {locName}
              </button>
            );
          })}
        </div>

        <div className="relative w-full md:w-72">
          <Search size={16} className={`absolute top-1/2 -translate-y-1/2 text-slate-400 ${isRtl ? 'right-3.5' : 'left-3.5'}`} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchTemplates()}
            placeholder={isRtl ? 'البحث في القوالب بالاسم أو الموضوع...' : 'Search templates...'}
            className={`w-full py-2 text-xs font-medium rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#22C55E]/20 focus:border-[#166534] transition-all ${
              isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'
            }`}
          />
        </div>
      </div>

      {/* Template Grid */}
      {isLoading ? (
        <div className="p-16 flex flex-col items-center justify-center gap-3 text-slate-400 bg-white rounded-2xl border border-slate-200">
          <RefreshCw size={24} className="animate-spin text-[#166534]" />
          <p className="text-xs font-semibold uppercase tracking-wider">
            {isRtl ? 'جارٍ تحميل القوالب...' : 'Loading templates...'}
          </p>
        </div>
      ) : templates.length === 0 ? (
        <div className="p-16 text-center space-y-4 bg-white rounded-2xl border border-slate-200">
          <div className="w-16 h-16 rounded-2xl bg-[#F0FDF4] text-[#166534] flex items-center justify-center mx-auto">
            <FileText size={28} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {isRtl ? 'لم يتم العثور على قوالب بريد إلكتروني' : 'No email templates found'}
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {isRtl 
                ? 'أنشئ أول قالب احترافي قابل لإعادة الاستخدام للمبيعات الخارجية، العيادات، التعريف أو المتابعة.' 
                : 'Create your first reusable professional template for outbound sales, clinics, introductions, or follow-ups.'}
            </p>
          </div>
          <button
            onClick={() => openCreateModal()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#166534] text-white text-xs font-semibold hover:bg-[#14532d] transition-all shadow-md shadow-[#166534]/20 cursor-pointer"
          >
            <Plus size={14} />
            <span>{isRtl ? 'إنشاء القالب الأول' : 'Create First Template'}</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => {
            const catLabel = isRtl ? (CATEGORY_LOCALIZATION[template.category]?.ar || template.category) : template.category;
            return (
              <div
                key={template.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between overflow-hidden group"
              >
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#F0FDF4] text-[#14532d] border border-[#bbf7d0]">
                      {catLabel}
                    </span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setPreviewTemplate(template)}
                        title={isRtl ? 'معاينة' : 'Preview'}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-[#166534] hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        onClick={() => openEditModal(template)}
                        title={isRtl ? 'تعديل' : 'Edit'}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        onClick={() => handleDuplicate(template.id)}
                        title={isRtl ? 'نسخ' : 'Duplicate'}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        <Copy size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(template.id)}
                        title={isRtl ? 'حذف' : 'Delete'}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 tracking-tight">{template.name}</h3>
                    <p className="text-xs text-[#166534] font-medium mt-1 truncate">
                      {isRtl ? 'الموضوع: ' : 'Subject: '}{template.subject}
                    </p>
                  </div>

                  {/* MINIATURE VISUAL CARD PREVIEW */}
                  <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 space-y-2 text-xs overflow-hidden">
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 border-b border-slate-200/60 pb-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>{isRtl ? 'قالب بريد إلكتروني متجاوب' : 'Responsive Email Template'}</span>
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
                    className="text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    {isRtl ? 'معاينة سريعة' : 'Quick Preview'}
                  </button>
                  <button
                    onClick={() => navigate(`/email-campaigns/create?templateId=${template.id}`)}
                    className="flex items-center gap-1.5 text-xs font-bold text-[#166534] hover:text-[#14532d] cursor-pointer"
                  >
                    <span>{isRtl ? 'استخدام في حملة' : 'Use in Campaign'}</span>
                    <Send size={12} className={isRtl ? 'rotate-180' : ''} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE / EDIT TEMPLATE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" dir={isRtl ? 'rtl' : 'ltr'}>
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Layout size={18} className="text-[#166534]" />
                  {editingTemplate 
                    ? (isRtl ? 'تعديل قالب البريد الإلكتروني' : 'Edit Email Template') 
                    : (isRtl ? 'إنشاء قالب بريد مؤطر' : 'Create Framed Email Template')}
                </h3>
                <p className="text-xs text-slate-500">
                  {isRtl 
                    ? 'تظل الترويسة والتذييل مقفلين بالهوية الرسمية. اكتب نص رسالتك في مساحة العمل المركزية.' 
                    : 'Header and Footer stay locked and branded. Type your message body in the center canvas.'}
                </p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="w-8 h-8 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-all cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSave} className="p-6 space-y-5 overflow-y-auto flex-1">
              
              {/* Template Style Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  {isRtl ? 'اختر إطار نمط القالب' : 'Choose Template Style Frame'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {PROFESSIONAL_FRAMES.map((frame) => {
                    const isSelected = frame.id === selectedFrameId;
                    return (
                      <button
                        key={frame.id}
                        type="button"
                        onClick={() => handleSelectFrame(frame.id)}
                        className={`p-2.5 rounded-xl border text-start transition-all cursor-pointer ${
                          isSelected 
                            ? 'border-[#166534] bg-[#F0FDF4]/50 ring-2 ring-emerald-600/10' 
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <span className={`inline-block w-2.5 h-2.5 rounded-full ${frame.accentBg} mb-1`} />
                        <p className="font-bold text-[11px] text-slate-900 truncate">
                          {isRtl ? (frame.nameAr || frame.name) : frame.name}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate">
                          {isRtl ? (frame.badgeAr || frame.badge) : frame.badge}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Template Name & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    {isRtl ? 'اسم القالب *' : 'Template Name *'}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={isRtl ? 'مثال: رسالة تواصل تنفيذية حديثة' : 'e.g. Modern Executive Outreach'}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#22C55E]/20"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    {isRtl ? 'التصنيف *' : 'Category *'}
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-[#22C55E]/20"
                  >
                    {CATEGORIES.filter(c => c !== 'All').map(cat => (
                      <option key={cat} value={cat}>
                        {isRtl ? (CATEGORY_LOCALIZATION[cat]?.ar || cat) : (CATEGORY_LOCALIZATION[cat]?.en || cat)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Subject */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase">
                    {isRtl ? 'الموضوع الافتراضي *' : 'Default Subject *'}
                  </label>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500">
                    <span className="font-semibold">{isRtl ? 'إدراج متغير:' : 'Insert:'}</span>
                    {[
                      { label: isRtl ? 'الاسم' : 'Name', tag: '{{first_name | default: "there"}}' },
                      { label: isRtl ? 'اسم المنشأة' : 'Business Name', tag: '{{business_name}}' },
                    ].map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSubject(prev => `${prev} ${item.tag}`.trim())}
                        className="px-2 py-0.5 rounded bg-slate-100 hover:bg-[#F0FDF4] hover:text-[#166534] text-slate-700 font-medium transition-colors cursor-pointer"
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
                  placeholder={isRtl ? 'مثال: استفسار سريع بخصوص {{business_name}}' : 'e.g. Quick question regarding {{business_name}}'}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 font-medium text-slate-900 focus:ring-2 focus:ring-[#22C55E]/20"
                  required
                />
              </div>

              {/* Visual Body Formatting Toolbar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    {isRtl ? 'نص الرسالة (حرر الرسالة هنا فقط) *' : 'Message Body (Only type here) *'}
                  </label>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500">
                    <span className="font-semibold">{isRtl ? 'إدراج متغير:' : 'Insert Tag:'}</span>
                    {[
                      { label: isRtl ? 'الاسم' : 'Name', tag: '{{first_name | default: "there"}}' },
                      { label: isRtl ? 'اسم المنشأة' : 'Business Name', tag: '{{business_name}}' },
                    ].map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => insertTagIntoBody(item.tag)}
                        className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium cursor-pointer"
                      >
                        + {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-1 flex-wrap">
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => applyVisualFormat('bold')}
                      className="p-1.5 rounded-lg hover:bg-white text-slate-700 font-bold cursor-pointer"
                      title={isRtl ? 'غامق' : 'Bold'}
                    >
                      <Bold size={15} />
                    </button>
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => applyVisualFormat('italic')}
                      className="p-1.5 rounded-lg hover:bg-white text-slate-700 cursor-pointer"
                      title={isRtl ? 'مائل' : 'Italic'}
                    >
                      <Italic size={15} />
                    </button>
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => applyVisualFormat('underline')}
                      className="p-1.5 rounded-lg hover:bg-white text-slate-700 cursor-pointer"
                      title={isRtl ? 'تسطير' : 'Underline'}
                    >
                      <Underline size={15} />
                    </button>
                    <div className="h-4 w-px bg-slate-300 mx-1" />
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => applyVisualFormat('insertUnorderedList')}
                      className="p-1.5 rounded-lg hover:bg-white text-slate-700 cursor-pointer"
                      title={isRtl ? 'قائمة نقطية' : 'Bullet List'}
                    >
                      <List size={15} />
                    </button>
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => applyVisualFormat('insertOrderedList')}
                      className="p-1.5 rounded-lg hover:bg-white text-slate-700 cursor-pointer"
                      title={isRtl ? 'قائمة مرقمة' : 'Numbered List'}
                    >
                      <ListOrdered size={15} />
                    </button>
                    <div className="h-4 w-px bg-slate-300 mx-1" />

                    {/* Content Alignment Buttons */}
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => applyVisualFormat('justifyLeft')}
                      className="p-1.5 rounded-lg hover:bg-white text-slate-700 cursor-pointer"
                      title={isRtl ? 'محاذاة لليسار' : 'Align Left'}
                    >
                      <AlignLeft size={15} />
                    </button>
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => applyVisualFormat('justifyCenter')}
                      className="p-1.5 rounded-lg hover:bg-white text-slate-700 cursor-pointer"
                      title={isRtl ? 'محاذاة للوسط' : 'Align Center'}
                    >
                      <AlignCenter size={15} />
                    </button>
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => applyVisualFormat('justifyRight')}
                      className="p-1.5 rounded-lg hover:bg-white text-slate-700 cursor-pointer"
                      title={isRtl ? 'محاذاة لليمين' : 'Align Right'}
                    >
                      <AlignRight size={15} />
                    </button>
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => applyVisualFormat('justifyFull')}
                      className="p-1.5 rounded-lg hover:bg-white text-slate-700 cursor-pointer"
                      title={isRtl ? 'محاذاة كاملة' : 'Justify'}
                    >
                      <AlignJustify size={15} />
                    </button>

                    <div className="h-4 w-px bg-slate-300 mx-1" />
                    <button
                      type="button"
                      onMouseDown={() => saveVisualEditorSelection()}
                      onClick={handleOpenButtonModal}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-[#166534] text-xs font-bold text-slate-700 transition-all hover:bg-slate-50 cursor-pointer"
                    >
                      <MousePointerClick size={13} className="text-[#166534]" />
                      <span>{isRtl ? '+ إضافة زر' : '+ Add Button'}</span>
                    </button>
                  </div>
                </div>

                {/* TEMPLATE VISUAL PREVIEW CONTAINER WITH LOCKED HEADER & FOOTER */}
                <div className="p-4 rounded-2xl bg-slate-100 flex justify-center">
                  <div className="w-full max-w-xl bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden" dir={isRtl ? 'rtl' : 'ltr'}>
                    
                    {/* Locked Header */}
                    <div className="relative group select-none">
                      <div dangerouslySetInnerHTML={{ __html: activeFrame.renderHeader('{{from_name}}', isRtl) }} />
                      <div className={`absolute top-2 ${isRtl ? 'left-2' : 'right-2'} bg-black/60 text-white px-2 py-0.5 rounded text-[9px] font-bold flex items-center gap-1`}>
                        <Lock size={9} />
                        <span>{isRtl ? 'ترويسة مقفلة' : 'Locked Header'}</span>
                      </div>
                    </div>

                    {/* Editable Body Area */}
                    <div className="p-6 bg-white" dir={isRtl ? 'rtl' : 'ltr'} style={{ textAlign: isRtl ? 'right' : 'left' }}>
                      <div
                        ref={visualEditorRef}
                        contentEditable
                        dir={isRtl ? 'rtl' : 'ltr'}
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
                      <div dangerouslySetInnerHTML={{ __html: activeFrame.renderFooter('{{from_name}}', isRtl) }} />
                      <div className={`absolute bottom-2 ${isRtl ? 'left-2' : 'right-2'} bg-slate-200 text-slate-600 px-2 py-0.5 rounded text-[9px] font-bold flex items-center gap-1`}>
                        <Lock size={9} />
                        <span>{isRtl ? 'تذييل مقفل' : 'Locked Footer'}</span>
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
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  {isRtl ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 text-xs font-bold bg-[#166534] text-white rounded-xl hover:bg-[#14532d] shadow-md shadow-[#166534]/20 cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? (isRtl ? 'جارٍ الحفظ...' : 'Saving...') : (isRtl ? 'حفظ القالب' : 'Save Template')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QUICK PREVIEW MODAL */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" dir={isRtl ? 'rtl' : 'ltr'}>
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-base font-bold text-slate-900">{previewTemplate.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isRtl ? 'الموضوع: ' : 'Subject: '}{previewTemplate.subject}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {/* Device Switcher */}
                <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('desktop')}
                    className={`p-1.5 rounded-lg text-xs font-bold cursor-pointer ${previewDevice === 'desktop' ? 'bg-[#166534] text-white' : 'text-slate-500'}`}
                    title={isRtl ? 'سطح المكتب' : 'Desktop'}
                  >
                    <Monitor size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('mobile')}
                    className={`p-1.5 rounded-lg text-xs font-bold cursor-pointer ${previewDevice === 'mobile' ? 'bg-[#166534] text-white' : 'text-slate-500'}`}
                    title={isRtl ? 'الهاتف' : 'Mobile'}
                  >
                    <Smartphone size={14} />
                  </button>
                </div>
                <button 
                  onClick={() => setPreviewTemplate(null)} 
                  className="w-8 h-8 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center cursor-pointer"
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
                      .replace(/\{\{\s*first_name[^}]*\}\}/g, isRtl ? 'فهد' : 'Farhan')
                      .replace(/\{\{\s*business_name[^}]*\}\}/g, isRtl ? 'مستشفى النخبة' : 'Apex Dental Studio')
                      .replace(/\{\{\s*city[^}]*\}\}/g, isRtl ? 'الرياض' : 'Riyadh')
                      .replace(/\{\{\s*from_name[^}]*\}\}/g, isRtl ? 'عبدالله الخالدي' : 'Ali Khan')
                      .replace(/\{\{\s*unsubscribe_url[^}]*\}\}/g, '#')
                  }} 
                />
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <button
                onClick={() => setPreviewTemplate(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                {isRtl ? 'إغلاق' : 'Close'}
              </button>
              <button
                onClick={() => {
                  const id = previewTemplate.id;
                  setPreviewTemplate(null);
                  navigate(`/email-campaigns/create?templateId=${id}`);
                }}
                className="flex items-center gap-2 px-5 py-2 text-xs font-bold bg-[#166534] text-white rounded-xl hover:bg-[#14532d] shadow-md shadow-[#166534]/20 cursor-pointer"
              >
                <span>{isRtl ? 'استخدام في حملة' : 'Use in Campaign'}</span>
                <Send size={13} className={isRtl ? 'rotate-180' : ''} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CTA BUTTON MODAL */}
      {isButtonModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" dir={isRtl ? 'rtl' : 'ltr'}>
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full flex flex-col overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-[#F0FDF4] via-[#FAFAF9] to-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#166534] text-white flex items-center justify-center shadow-lg shadow-[#166534]/20 shrink-0">
                  <MousePointerClick size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    {isRtl ? 'إدراج زر دعوة لاتخاذ إجراء (CTA)' : 'Insert Call-to-Action Button'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isRtl 
                      ? 'زر متوافق مع كافة برامج البريد مثل Gmail و Outlook و Apple Mail' 
                      : 'Bulletproof email button compatible with Gmail, Outlook & Apple Mail'}
                  </p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setIsButtonModalOpen(false)}
                className="w-8 h-8 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-all cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleInsertButtonSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {isRtl ? 'نص الزر *' : 'Button Text *'}
                </label>
                <input
                  type="text"
                  required
                  value={buttonText}
                  onChange={(e) => setButtonText(e.target.value)}
                  placeholder={isRtl ? 'مثال: حجز مكالمة لمدة 10 دقائق' : 'e.g. Schedule a 10-Minute Call'}
                  className="w-full px-3.5 py-2.5 text-xs font-medium rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#22C55E]/20 focus:border-[#166534]"
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase py-0.5">
                    {isRtl ? 'نماذج جاهزة:' : 'Presets:'}
                  </span>
                  {(isRtl ? [
                    'حجز مكالمة لمدة 10 دقائق',
                    'حجز استشارة مجانية',
                    'الحصول على العرض الخاص',
                    'زيارة الموقع الإلكتروني',
                    'مشاهدة سابقة الأعمال'
                  ] : [
                    'Schedule a 10-Minute Call',
                    'Book Free Consultation',
                    'Claim Special Offer',
                    'Visit Website',
                    'View Portfolio'
                  ]).map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setButtonText(preset)}
                      className="px-2 py-0.5 text-[10px] rounded-md bg-slate-100 hover:bg-[#F0FDF4] hover:text-[#166534] text-slate-600 font-medium transition-all cursor-pointer"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {isRtl ? 'رابط الوجهة (URL) *' : 'Button Destination Link (URL) *'}
                </label>
                <div className="relative">
                  <ExternalLink size={14} className={`absolute top-1/2 -translate-y-1/2 text-slate-400 ${isRtl ? 'right-3.5' : 'left-3.5'}`} />
                  <input
                    type="url"
                    required
                    value={buttonUrl}
                    onChange={(e) => setButtonUrl(e.target.value)}
                    placeholder="https://calendly.com/your-name/meeting"
                    className={`w-full py-2.5 text-xs font-medium rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#22C55E]/20 focus:border-[#166534] ${
                      isRtl ? 'pr-10 pl-3.5' : 'pl-10 pr-3.5'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {isRtl ? 'لون الزر' : 'Button Color'}
                  </label>
                  <div className="flex items-center gap-2">
                    {[
                      { name: isRtl ? 'أزرق' : 'Blue', color: '#2563eb' },
                      { name: isRtl ? 'نيلي' : 'Indigo', color: '#4f46e5' },
                      { name: isRtl ? 'أخضر' : 'Green', color: '#059669' },
                      { name: isRtl ? 'داكن' : 'Dark', color: '#0f172a' },
                      { name: isRtl ? 'بنفسجي' : 'Purple', color: '#7c3aed' },
                      { name: isRtl ? 'وردي' : 'Rose', color: '#e11d48' },
                    ].map((col) => (
                      <button
                        key={col.color}
                        type="button"
                        onClick={() => setButtonColor(col.color)}
                        className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${
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
                    {isRtl ? 'المحاذاة' : 'Alignment'}
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setButtonAlign('left')}
                      className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                        buttonAlign === 'left'
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {isRtl ? 'يسار' : 'Left'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setButtonAlign('center')}
                      className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                        buttonAlign === 'center'
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {isRtl ? 'وسط' : 'Center'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setButtonAlign('right')}
                      className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                        buttonAlign === 'right'
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {isRtl ? 'يمين' : 'Right'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Live Button Preview */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  {isRtl ? 'معاينة في البريد الإلكتروني:' : 'Preview in Email:'}
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
                      fontFamily: 'sans-serif',
                      direction: isRtl ? 'rtl' : 'ltr'
                    }}
                  >
                    {buttonText || (isRtl ? 'نص الزر' : 'Button Text')} {isRtl ? '&larr;' : '&rarr;'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsButtonModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
                >
                  {isRtl ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#166534] text-white text-xs font-bold hover:bg-[#14532d] transition-all shadow-md shadow-[#166534]/20 flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus size={14} />
                  <span>{isRtl ? 'إدراج الزر' : 'Insert Button'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
