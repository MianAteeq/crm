import React, { useState } from 'react';
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
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTemplateStore } from '../../store/useTemplateStore';
import TemplateEditor from '../../components/whatsapp/builder/TemplateEditor';
import WhatsAppPreview from '../../components/whatsapp/preview/WhatsAppPreview';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

export default function TemplateBuilderPage() {
  const navigate = useNavigate();
  const { currentTemplate, resetTemplate } = useTemplateStore();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 800);
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
              className="flex items-center gap-2 px-4 h-9 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all border border-slate-200"
            >
              {isSaving ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Save size={16} />}
              {isSaving ? 'Saved' : 'Save as Draft'}
            </button>
            <button className="flex items-center gap-2 px-5 h-9 text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-all shadow-sm shadow-blue-200">
              <Rocket size={16} />
              Publish Template
            </button>
          </div>
        </header>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Builder Form */}
        <main className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/50">
           <div className="max-w-3xl mx-auto px-8 py-10">
              <div className="flex items-center gap-2 mb-8 animate-in fade-in slide-in-from-left-4">
                 <div className="w-1.5 h-6 bg-slate-900 rounded-full" />
                 <h2 className="text-xl font-bold tracking-tight">Template Builder</h2>
              </div>
              <TemplateEditor />
           </div>
        </main>

        {/* Right Side: Preview (Clean Card Style) */}
        <aside className="w-[480px] bg-[#F8FAFC] border-l border-border flex flex-col shrink-0 relative overflow-hidden">
           {/* Centered Preview Area */}
           <div className="flex-1 overflow-y-auto p-12 flex flex-col items-center justify-center min-h-0 custom-scrollbar">
              <WhatsAppPreview template={currentTemplate} />
           </div>
        </aside>
      </div>
    </div>
  );
}
