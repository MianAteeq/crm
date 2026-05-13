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
    if (!currentTemplate.name) {
      setError('Please provide a template name.');
      return;
    }

    if (!currentTemplate.body.text) {
      setError('Please provide message body text.');
      return;
    }

    if (['IMAGE', 'VIDEO', 'DOCUMENT'].includes(currentTemplate.header.type) && !currentTemplate.header.mediaHandle) {
      setError(`Please upload a ${currentTemplate.header.type.toLowerCase()} for the header.`);
      return;
    }

    const varMatches = currentTemplate.body.text.match(/\{\{\d+\}\}/g) || [];
    const varIndices = Array.from(new Set(varMatches.map(m => parseInt(m.match(/\d+/)?.[0] || '1') - 1)));
    
    for (const index of varIndices) {
      if (currentTemplate.body.variables[index] === undefined || currentTemplate.body.variables[index] === '') {
        setError(`Please provide a sample value for variable {{${index + 1}}}.`);
        return;
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
        media_handle: currentTemplate.header.mediaHandle
      };

      console.log('Publishing template to backend:', apiPayload);
      const result = await whatsappApi.createTemplate(apiPayload);
      console.log('Template creation success:', result);
      
      // Success
      resetTemplate();
      navigate('/templates', { state: { message: 'Template created successfully!' } });
    } catch (err: any) {
      console.error('Publish failed details:', err);
      setError(err.message || 'Failed to publish template. Please check the information and try again.');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-bg-base overflow-hidden">
      {/* SaaS Top Header */}
      <div className="px-6 py-4 z-50 bg-bg-base shrink-0">
        <header className="h-16 border border-slate-200 bg-white rounded-2xl flex items-center justify-between px-6 shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => { resetTemplate(); navigate('/templates'); }}
              className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all font-medium text-sm"
            >
              <ChevronLeft size={18} />
              <span>Templates</span>
            </button>
            <div className="h-4 w-px bg-slate-200" />
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h1 className="text-[15px] font-bold text-slate-900 leading-none">
                  {currentTemplate.name || 'Untitled Template'}
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-100 uppercase tracking-wider">Draft</span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">Last edited Feb 24, 2024</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={handleSave}
              disabled={isSaving || isPublishing}
              className="flex items-center gap-2 px-4 h-9 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all border border-slate-200 disabled:opacity-50"
            >
              {isSaving ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Save size={16} />}
              {isSaving ? 'Saved' : 'Save as Draft'}
            </button>
            <button 
              onClick={handlePublish}
              disabled={isPublishing || isSaving}
              className="flex items-center gap-2 px-5 h-9 text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-all shadow-sm shadow-blue-200 disabled:opacity-50"
            >
              {isPublishing ? <Loader2 size={16} className="animate-spin" /> : <Rocket size={16} />}
              {isPublishing ? 'Publishing...' : 'Publish Template'}
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
                 <h2 className="text-xl font-bold tracking-tight">Template Builder</h2>
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
