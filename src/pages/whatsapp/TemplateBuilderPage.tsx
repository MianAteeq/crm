import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight,
  Save, 
  Send, 
  Sparkles, 
  Laptop, 
  Smartphone, 
  Tablet, 
  History, 
  Settings2,
  Trash2,
  CheckCircle2,
  Eye,
  Rocket,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTemplateStore } from '../../store/useTemplateStore';
import TemplateEditor from '../../components/whatsapp/builder/TemplateEditor';
import WhatsAppPreview from '../../components/whatsapp/preview/WhatsAppPreview';
import { whatsappApi } from '../../services/whatsappApi';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { useI18n } from '../../i18n';
import { LanguageSwitcher } from '../../components/common/LanguageSwitcher';

export default function TemplateBuilderPage() {
  const navigate = useNavigate();
  const { isRtl } = useI18n();
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get('id');
  const { currentTemplate, resetTemplate, setTemplate } = useTemplateStore();
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (templateId && templateId !== 'new') {
      const loadTemplate = async () => {
        try {
          const templates = await whatsappApi.fetchTemplates();
          const template = templates.find(t => t.id === templateId);
          if (template) {
            if (template.status === 'PENDING') {
              navigate('/templates', { 
                state: { 
                  error: isRtl ? 'لا يمكن تعديل القوالب التي لا تزال قيد المراجعة لدى Meta.' : 'Templates with Pending status cannot be edited.' 
                } 
              });
              return;
            }
            setTemplate(template);
          }
        } catch (err) {
          console.error('Failed to load template:', err);
        }
      };
      loadTemplate();
    } else {
      resetTemplate();
    }
  }, [templateId, navigate, setTemplate, resetTemplate, isRtl]);

  const handleSave = () => {
    if (!currentTemplate.name) {
      setError(isRtl ? 'يرجى إدخال اسم القالب لحفظ المسودة.' : 'Please provide a template name to save a draft.');
      return;
    }
    setError(null);
    setIsSaving(true);
    
    setTimeout(() => {
      setIsSaving(false);
      console.log('Draft saved locally:', currentTemplate);
    }, 1200);
  };

  const handlePublish = async () => {
    if (!currentTemplate.name || currentTemplate.name.trim().length < 3) {
      setError(isRtl ? 'اسم القالب مطلوب ويجب ألا يقل عن 3 أحرف.' : 'Template name is required and should be at least 3 characters.');
      return;
    }

    if (!/^[a-z0-9_]+$/.test(currentTemplate.name)) {
      setError(isRtl ? 'يمكن للاسم أن يحتوي فقط على أحرف إنجليزية صغيرة، وأرقام، وشرطة سفلية (_).' : 'Template name can only contain lowercase letters, numbers, and underscores.');
      return;
    }

    if (!currentTemplate.category) {
      setError(isRtl ? 'يرجى اختيار تصنيف القالب.' : 'Please select a template category.');
      return;
    }

    if (!currentTemplate.language) {
      setError(isRtl ? 'يرجى اختيار لغة القالب.' : 'Please select a template language.');
      return;
    }

    if (currentTemplate.header.type === 'TEXT') {
      if (!currentTemplate.header.text || currentTemplate.header.text.trim().length === 0) {
        setError(isRtl ? 'يرجى كتابة نص ترويسة القالب.' : 'Please provide text for the header.');
        return;
      }
      if (currentTemplate.header.text.length > 60) {
        setError(isRtl ? 'يجب ألا يتجاوز نص الترويسة 60 حرفاً.' : 'Header text must be 60 characters or less.');
        return;
      }
    } else if (['IMAGE', 'DOCUMENT'].includes(currentTemplate.header.type)) {
      if (!currentTemplate.header.mediaHandle) {
        setError(isRtl ? 'يرجى رفع الوسائط للترويسة.' : `Please upload a ${currentTemplate.header.type.toLowerCase()} for the header.`);
        return;
      }
    }

    if (!currentTemplate.body.text || currentTemplate.body.text.trim().length === 0) {
      setError(isRtl ? 'يرجى كتابة نص محتوى الرسالة.' : 'Please provide message body text.');
      return;
    }

    if (currentTemplate.body.text.length > 1024) {
      setError(isRtl ? 'يجب ألا يتجاوز نص الرسالة 1024 حرفاً.' : 'Message body cannot exceed 1024 characters.');
      return;
    }

    const varMatches = currentTemplate.body.text.match(/\{\{\d+\}\}/g) || [];
    const varIndices = Array.from(new Set(varMatches.map(m => parseInt(m.match(/\d+/)?.[0] || '1') - 1)));
    
    for (const index of varIndices) {
      if (currentTemplate.body.variables[index] === undefined || currentTemplate.body.variables[index].trim() === '') {
        setError(isRtl 
          ? `يرجى تقديم عينة قيمة للمتغير {{${index + 1}}}، هذا المتطلب إلزامي لاعتماد القالب من ميتا.` 
          : `Please provide a sample value for variable {{${index + 1}}}. This is required for WhatsApp approval.`);
        return;
      }
    }

    if (currentTemplate.footer?.text && currentTemplate.footer.text.length > 60) {
      setError(isRtl ? 'يجب ألا يتجاوز نص التذييل 60 حرفاً.' : 'Footer text must be 60 characters or less.');
      return;
    }

    setError(null);
    setIsPublishing(true);

    try {
      const components: any[] = [];

      if (currentTemplate.header.type !== 'NONE') {
        const headerComponent: any = {
          type: 'HEADER',
          format: currentTemplate.header.type
        };

        if (currentTemplate.header.type === 'TEXT') {
          headerComponent.text = currentTemplate.header.text;
          if (currentTemplate.header.variables && currentTemplate.header.variables.length > 0) {
            headerComponent.example = {
              header_text: currentTemplate.header.variables
            };
          }
        } else if (['IMAGE', 'DOCUMENT', 'VIDEO'].includes(currentTemplate.header.type)) {
          if (currentTemplate.header.mediaHandle) {
            headerComponent.example = {
              header_handle: [currentTemplate.header.mediaHandle]
            };
          }
        }
        components.push(headerComponent);
      }

      const bodyComponent: any = {
        type: 'BODY',
        text: currentTemplate.body.text
      };

      if (currentTemplate.body.variables && currentTemplate.body.variables.length > 0) {
        bodyComponent.example = {
          body_text: [currentTemplate.body.variables]
        };
      }
      components.push(bodyComponent);

      if (currentTemplate.footer?.text && currentTemplate.footer.text.trim().length > 0) {
        components.push({
          type: 'FOOTER',
          text: currentTemplate.footer.text
        });
      }

      if (currentTemplate.buttons && currentTemplate.buttons.length > 0) {
        components.push({
          type: 'BUTTONS',
          buttons: currentTemplate.buttons.map(b => {
            if (b.type === 'QUICK_REPLY') {
              return { type: 'QUICK_REPLY', text: b.text };
            }
            if (b.type === 'URL') {
              return { type: 'URL', text: b.text, url: b.url };
            }
            if (b.type === 'PHONE_NUMBER') {
              return { type: 'PHONE_NUMBER', text: b.text, phone_number: b.phoneNumber };
            }
            return b;
          })
        });
      }

      const payload = {
        name: currentTemplate.name,
        category: currentTemplate.category,
        language: currentTemplate.language || 'en_US',
        components
      };

      if (isEditing) {
        await whatsappApi.updateTemplate(templateId as string, payload);
      } else {
        await whatsappApi.createTemplate(payload);
      }

      resetTemplate();
      navigate('/templates', { 
        state: { 
          message: isRtl 
            ? (isEditing ? 'تم تحديث القالب بنجاح!' : 'تم إنشاء القالب وإرساله للاعتماد بنجاح!') 
            : (isEditing ? 'Template updated successfully!' : 'Template created successfully!') 
        } 
      });
    } catch (err: any) {
      console.error('Publish failed details:', err);
      setError(err.message || (isRtl ? 'فشل نشر القالب. يرجى مراجعة البيانات والمحاولة مجدداً.' : 'Failed to publish template. Please check the information and try again.'));
    } finally {
      setIsPublishing(false);
    }
  };

  const isEditing = templateId && templateId !== 'new';

  return (
    <div className={cn("flex flex-col h-screen bg-bg-base overflow-hidden font-sans", isRtl && "text-right")} dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Top Header */}
      <div className="px-6 py-4 z-50 bg-[#fcfcfd] shrink-0 border-b border-slate-200">
        <header className="h-16 bg-white rounded-2xl flex items-center justify-between px-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => { resetTemplate(); navigate('/templates'); }}
              className="flex items-center gap-2 px-3.5 py-2 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all font-black text-xs uppercase tracking-wider cursor-pointer"
            >
              {isRtl ? <ChevronRight size={16} className="stroke-[2.5px]" /> : <ChevronLeft size={16} className="stroke-[2.5px]" />}
              <span>{isRtl ? 'رجوع' : 'Back'}</span>
            </button>
            <div className="h-4 w-px bg-slate-200" />
            <div className="flex flex-col">
              <div className="flex items-center gap-2.5">
                <h1 className="text-sm font-black text-slate-950 leading-none tracking-tight">
                  {currentTemplate.name || (isEditing ? (isRtl ? 'جارٍ التحميل...' : 'Loading Template...') : (isRtl ? 'قالب جديد' : 'New Template'))}
                </h1>
                <span className={cn(
                  "px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border",
                  isEditing 
                    ? "bg-amber-500/10 text-amber-700 border-amber-200/60" 
                    : "bg-emerald-50 text-emerald-700 border-emerald-200"
                )}>
                  {isEditing ? (isRtl ? 'تعديل' : 'Editing') : (isRtl ? 'مسودة' : 'Draft')}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">
                {isEditing ? `ID: ${templateId}` : (isRtl ? 'تنسيق قوالب واتساب السحابية الرسمية' : 'WhatsApp Cloud API Format')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSwitcher variant="dropdown" />
            {!isEditing && (
              <button 
                onClick={handleSave}
                disabled={isSaving || isPublishing}
                className="px-4 h-10 rounded-xl text-xs font-black uppercase tracking-wider transition-all active:scale-[0.98] border border-slate-200 bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSaving ? <CheckCircle2 size={14} className="text-emerald-500 stroke-[3px]" /> : <Save size={14} className="stroke-[2.5px]" />}
                {isSaving ? (isRtl ? 'تم الحفظ' : 'Saved') : (isRtl ? 'حفظ كمسودة' : 'Save Draft')}
              </button>
            )}
            <button 
              onClick={handlePublish}
              disabled={isPublishing || isSaving}
              className={cn(
                "px-5 h-10 rounded-xl text-xs font-black uppercase tracking-wider transition-all active:scale-[0.98] text-white flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-50",
                isEditing
                  ? "bg-slate-900 hover:bg-slate-800"
                  : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20"
              )}
            >
              {isPublishing ? <Loader2 size={14} className="animate-spin text-white" /> : (isEditing ? <CheckCircle2 size={14} className="stroke-[3px]" /> : <Rocket size={14} className="stroke-[2.5px]" />)}
              {isPublishing 
                ? (isRtl ? 'جارٍ النشر...' : 'Updating...') 
                : (isEditing ? (isRtl ? 'تحديث القالب' : 'Update Template') : (isRtl ? 'نشر واعتماد القالب' : 'Publish Template'))}
            </button>
          </div>
        </header>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Builder Form */}
        <main className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/50">
           <div className="max-w-3xl mx-auto px-8 py-10">
              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 shadow-sm"
                  >
                    <AlertCircle size={20} className="shrink-0" />
                    <p className="text-sm font-medium">{error}</p>
                    <button onClick={() => setError(null)} className={cn("p-1 hover:bg-red-100 rounded-lg", isRtl ? "mr-auto" : "ml-auto")}>
                      <Trash2 size={16} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-center gap-2 mb-8 animate-in fade-in">
                 <div className="w-1.5 h-6 bg-slate-900 rounded-full" />
                 <h2 className="text-xl font-bold tracking-tight">
                   {isEditing ? (isRtl ? 'تعديل بيانات القالب' : 'Edit Template') : (isRtl ? 'محرر بناء القالب' : 'Template Builder')}
                 </h2>
              </div>
              <TemplateEditor />
           </div>
        </main>

        {/* Right Side: Preview */}
        <aside className={cn(
          "w-[480px] bg-slate-50 flex flex-col shrink-0 relative overflow-hidden",
          isRtl ? "border-r border-slate-200" : "border-l border-slate-200"
        )}>
           <div className="p-6 border-b border-slate-200 bg-white shadow-sm z-10 shrink-0">
              <div className="flex items-center justify-between">
                 <div>
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-1">
                      {isRtl ? 'المعاينة الحية للرسالة' : 'Message Preview'}
                    </h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {isRtl ? 'محاكاة حية فورية' : 'Real-time Visualization'}
                    </p>
                 </div>
              </div>
           </div>

           {/* Centered Preview Area */}
           <div className="flex-1 overflow-y-auto p-8 flex flex-col items-center min-h-0 custom-scrollbar bg-slate-50 relative">
              <div className="w-full h-full flex flex-col items-center justify-center py-6">
                 <div className="w-full transform scale-[0.95] xl:scale-100 transition-all duration-300">
                    <WhatsAppPreview template={currentTemplate} />
                 </div>
              </div>
           </div>
        </aside>
      </div>
    </div>
  );
}
