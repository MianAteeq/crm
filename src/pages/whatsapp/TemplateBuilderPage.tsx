import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
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

export default function TemplateBuilderPage() {
  const navigate = useNavigate();
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
              navigate('/templates', { state: { error: 'Templates with Pending status cannot be edited.' } });
              return;
            }
            // Need to handle formatting if API returns components instead of flattened structure
            // For now, assume it matches or handles it in setTemplate
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
  }, [templateId, navigate, setTemplate, resetTemplate]);

  const handleSave = () => {
    if (!currentTemplate.name) {
      setError('Please provide a template name to save a draft.');
      return;
    }
    setError(null);
    setIsSaving(true);
    
    // Simulate server save for draft
    setTimeout(() => {
      setIsSaving(false);
      // In a real app, we might call an API like crmApi.saveDraft(currentTemplate)
      console.log('Draft saved locally:', currentTemplate);
    }, 1200);
  };

  const handlePublish = async () => {
    // 1. Basic Template Info
    if (!currentTemplate.name || currentTemplate.name.trim().length < 3) {
      setError('Template name is required and should be at least 3 characters.');
      return;
    }

    if (!/^[a-z0-9_]+$/.test(currentTemplate.name)) {
      setError('Template name can only contain lowercase letters, numbers, and underscores.');
      return;
    }

    if (!currentTemplate.category) {
      setError('Please select a template category.');
      return;
    }

    if (!currentTemplate.language) {
      setError('Please select a template language.');
      return;
    }

    // 2. Header Validation
    if (currentTemplate.header.type === 'TEXT') {
      if (!currentTemplate.header.text || currentTemplate.header.text.trim().length === 0) {
        setError('Please provide text for the header.');
        return;
      }
      if (currentTemplate.header.text.length > 60) {
        setError('Header text must be 60 characters or less.');
        return;
      }
    } else if (['IMAGE', 'DOCUMENT'].includes(currentTemplate.header.type)) {
      if (!currentTemplate.header.mediaHandle) {
        setError(`Please upload a ${currentTemplate.header.type.toLowerCase()} for the header.`);
        return;
      }
    }

    // 3. Body Validation
    if (!currentTemplate.body.text || currentTemplate.body.text.trim().length === 0) {
      setError('Please provide message body text.');
      return;
    }

    if (currentTemplate.body.text.length > 1024) {
      setError('Message body cannot exceed 1024 characters.');
      return;
    }

    const varMatches = currentTemplate.body.text.match(/\{\{\d+\}\}/g) || [];
    const varIndices = Array.from(new Set(varMatches.map(m => parseInt(m.match(/\d+/)?.[0] || '1') - 1)));
    
    for (const index of varIndices) {
      if (currentTemplate.body.variables[index] === undefined || currentTemplate.body.variables[index].trim() === '') {
        setError(` Please provide a sample value for variable {{${index + 1}}}. This is required for WhatsApp approval.`);
        return;
      }
    }

    // 4. Footer Validation
    if (currentTemplate.footer?.text && currentTemplate.footer.text.length > 60) {
      setError('Footer text must be 60 characters or less.');
      return;
    }

    // 5. Buttons Validation
    if (currentTemplate.buttons.length > 0) {
      for (const btn of currentTemplate.buttons) {
        if (!btn.text || btn.text.trim().length === 0) {
          setError('Each button must have a label.');
          return;
        }
        if (btn.text.length > 25) {
          setError(`Button label "${btn.text}" is too long (max 25 chars).`);
          return;
        }
        
        if (btn.type === 'URL') {
          if (!btn.url || btn.url.trim().length < 5) {
            setError(`Please provide a valid URL for button "${btn.text}".`);
            return;
          }
          if (!btn.url.startsWith('http')) {
            setError(`URL for button "${btn.text}" must start with http:// or https://`);
            return;
          }
        } else if (btn.type === 'CALL') {
          if (!btn.phoneNumber || btn.phoneNumber.trim().length < 5) {
            setError(`Please provide a valid phone number for button "${btn.text}".`);
            return;
          }
           if (!/^\+?[0-9]+$/.test(btn.phoneNumber.replace(/\s/g, ''))) {
            setError(`Phone number for button "${btn.text}" should only contain numbers and optionally start with +.`);
            return;
          }
        }
      }
    }

    setIsPublishing(true);
    setError(null);

    try {
      // Build components array - standard for Meta and most WhatsApp CRM providers
      const components: any[] = [];

      // 1. Header Component
      if (currentTemplate.header.type !== 'NONE') {
        const header: any = {
          type: 'HEADER',
          format: currentTemplate.header.type
        };

        if (currentTemplate.header.type === 'TEXT') {
          header.text = currentTemplate.header.text;
          if (currentTemplate.header.text.includes('{{1}}') && currentTemplate.header.variables?.[0]) {
            header.example = {
              header_text: [currentTemplate.header.variables[0]]
            };
          }
        } else {
          // Media header
          header.example = {
            header_handle: [currentTemplate.header.mediaHandle]
          };
        }
        components.push(header);
      }

      // 2. Body Component
      const body: any = {
        type: 'BODY',
        text: currentTemplate.body.text
      };

      if (varIndices.length > 0) {
        // Collect variables in order of their occurrence in the text
        const samples = varIndices.map(idx => currentTemplate.body.variables[idx]);
        body.example = {
          body_text: [samples]
        };
      }
      components.push(body);

      // 3. Footer Component
      if (currentTemplate.footer?.text) {
        components.push({
          type: 'FOOTER',
          text: currentTemplate.footer.text
        });
      }

      // 4. Buttons Component
      if (currentTemplate.buttons.length > 0) {
        components.push({
          type: 'BUTTONS',
          buttons: currentTemplate.buttons.map(b => {
            const button: any = {
              type: b.type === 'CALL' ? 'PHONE_NUMBER' : (b.type === 'URL' ? 'URL' : b.type),
              text: b.text,
            };
            if (b.type === 'URL') button.url = b.url;
            if (b.type === 'CALL') button.phone_number = b.phoneNumber;
            return button;
          })
        });
      }

      const apiPayload = {
        name: currentTemplate.name.toLowerCase().trim().replace(/\s+/g, '_'),
        category: currentTemplate.category,
        language: currentTemplate.language,
        components: components,
        // Fallback fields for simpler backends
        body: currentTemplate.body.text,
        media_handle: currentTemplate.header.mediaHandle,
        media_path: currentTemplate.header.mediaPath,
        media_type: currentTemplate.header.mediaType,
        media_url: currentTemplate.header.mediaUrl
      };

      console.log('Publishing template to backend:', apiPayload);
      
      let result;
      if (templateId && templateId !== 'new') {
        result = await whatsappApi.updateTemplate(templateId, apiPayload);
        console.log('Template update success:', result);
      } else {
        result = await whatsappApi.createTemplate(apiPayload);
        console.log('Template creation success:', result);
      }
      
      // Success
      resetTemplate();
      navigate('/templates', { 
        state: { 
          message: templateId && templateId !== 'new' 
            ? 'Template updated successfully!' 
            : 'Template created successfully!' 
        } 
      });
    } catch (err: any) {
      console.error('Publish failed details:', err);
      setError(err.message || 'Failed to publish template. Please check the information and try again.');
    } finally {
      setIsPublishing(false);
    }
  };

  const isEditing = templateId && templateId !== 'new';

  return (
    <div className="flex flex-col h-screen bg-bg-base overflow-hidden">
      {/* SaaS Top Header */}
      <div className="px-6 py-4 z-50 bg-[#fcfcfd] shrink-0">
        <header className="h-16 border border-slate-200/90 bg-white rounded-2xl flex items-center justify-between px-6 shadow-premium">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => { resetTemplate(); navigate('/templates'); }}
              className="flex items-center gap-2 px-3.5 py-2 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all font-black text-xs uppercase tracking-widest cursor-pointer"
            >
              <ChevronLeft size={16} className="stroke-[2.5px]" />
              <span>Back</span>
            </button>
            <div className="h-4 w-px bg-slate-200" />
            <div className="flex flex-col">
              <div className="flex items-center gap-2.5">
                <h1 className="text-sm font-black text-slate-950 leading-none tracking-tight font-display">
                  {currentTemplate.name || (isEditing ? 'Loading Template...' : 'New Template')}
                </h1>
                <span className={cn(
                  "px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                  isEditing 
                    ? "bg-amber-500/10 text-amber-700 border-amber-200/60" 
                    : "bg-[#F0FDF4] text-[#166534] border-[#bbf7d0]"
                )}>
                  {isEditing ? 'Editing' : 'Draft'}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">
                {isEditing ? `Template ID: ${templateId}` : 'WhatsApp Native Form Format'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!isEditing && (
              <button 
                onClick={handleSave}
                disabled={isSaving || isPublishing}
                className="relative px-5 h-10 rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-[0.98] border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 hover:shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSaving ? <CheckCircle2 size={14} className="text-emerald-500 stroke-[3px]" /> : <Save size={14} className="stroke-[2.5px]" />}
                {isSaving ? 'Saved' : 'Save as Draft'}
              </button>
            )}
            <button 
              onClick={handlePublish}
              disabled={isPublishing || isSaving}
              className={cn(
                "relative px-6 h-10 rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-[0.98] text-white flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50",
                isEditing
                  ? "bg-slate-900 hover:bg-slate-800 shadow-slate-900/10"
                  : "bg-gradient-to-r from-[#12263A] to-[#166534] hover:shadow-lg hover:shadow-[#166534]/20"
              )}
            >
              {isPublishing ? <Loader2 size={14} className="animate-spin text-white" /> : (isEditing ? <CheckCircle2 size={14} className="stroke-[3px]" /> : <Rocket size={14} className="stroke-[2.5px]" />)}
              {isPublishing ? 'Updating...' : (isEditing ? 'Update Template' : 'Publish Template')}
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
                    className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 shadow-sm"
                  >
                    <AlertCircle size={20} />
                    <p className="text-sm font-medium">{error}</p>
                    <button onClick={() => setError(null)} className="ml-auto p-1 hover:bg-red-100 rounded-lg">
                      <Trash2 size={16} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-center gap-2 mb-8 animate-in fade-in slide-in-from-left-4">
                 <div className="w-1.5 h-6 bg-slate-900 rounded-full" />
                 <h2 className="text-xl font-bold tracking-tight">
                   {isEditing ? 'Edit Template' : 'Template Builder'}
                 </h2>
              </div>
              <TemplateEditor />
           </div>
        </main>

        {/* Right Side: Preview (Clean Card Style) */}
        <aside className="w-[480px] bg-slate-50 border-l border-slate-200 flex flex-col shrink-0 relative overflow-hidden">
           <div className="p-8 border-b border-slate-200 bg-white shadow-sm z-10 shrink-0">
              <div className="flex items-center justify-between">
                 <div>
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-[0.2em] mb-1">Message Preview</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Real-time Visualization</p>
                 </div>
              </div>
           </div>

           {/* Centered Preview Area */}
           <div className="flex-1 overflow-y-auto p-10 flex flex-col items-center min-h-0 custom-scrollbar bg-slate-50 relative">
              <div className="w-full h-full flex flex-col items-center justify-center py-12">
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
