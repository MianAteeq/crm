import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  ArrowRight, 
  Send, 
  Type, 
  FileText, 
  Plus, 
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Variable,
  Wand2,
  Save
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Template } from '@/src/data/templates';
import { cn } from '@/src/lib/utils';
import PhonePreview from '@/src/components/templates/PhonePreview';

export default function CreateTemplatePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const initialTemplateState = (() => {
    const defaultData = {
      name: '',
      displayName: '',
      category: 'Marketing' as const,
      language: 'en',
      status: 'draft' as const,
      header: { type: 'none' as const, text: '', mediaUrl: '' },
      body: { text: '', variables: [] },
      footer: { text: '' },
      buttons: { type: 'none' as const, quickReplies: [], cta: [] }
    };

    const stateTemplate = location.state?.template || {};
    
    return {
      ...defaultData,
      ...stateTemplate,
      header: { ...defaultData.header, ...(stateTemplate.header || {}) },
      body: { ...defaultData.body, ...(stateTemplate.body || {}) },
      buttons: { ...defaultData.buttons, ...(stateTemplate.buttons || {}) },
      footer: { ...defaultData.footer, ...(stateTemplate.footer || {}) },
    } as Template;
  })();

  const [formData, setFormData] = useState<Template>(initialTemplateState);

  const steps = [
    { id: 1, title: 'Basics', icon: Type },
    { id: 2, title: 'Blueprint', icon: FileText },
    { id: 3, title: 'Engagement', icon: Plus },
    { id: 4, title: 'Validate', icon: Smartphone }
  ];

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
    }, 2000);
  };

  const updateBody = (text: string) => {
    // Basic variable regex detection
    const variableMatches = text.match(/{{([0-9a-zA-Z_]+)}}/g) || [];
    const uniqueVars = Array.from(new Set(variableMatches));
    const variables = uniqueVars.map(v => ({
      label: v.replace(/[{}]/g, ''),
      sample: ''
    }));
    setFormData({ ...formData, body: { ...formData.body!, text, variables } });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col text-slate-900 pb-32">
      {/* Top Banner */}
      <header className="h-[80px] bg-white border-b border-slate-100 px-8 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-6">
           <button 
             onClick={() => navigate('/templates')}
             className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-slate-900 transition-all hover:bg-slate-50"
           >
             <ChevronLeft size={20} />
           </button>
           <div className="space-y-0.5">
             <h1 className="text-xl font-bold text-slate-900 tracking-tight">Forge Workspace</h1>
             <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-900 animate-pulse" />
                Live Drafting Engine
             </div>
           </div>
        </div>

        <div className="flex items-center gap-4">
           <button className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-all shadow-sm">
              <Save size={14} />
              Save Progress
           </button>
           <div className="h-6 w-px bg-slate-200 mx-2" />
           <div className="flex gap-2">
              {steps.map(s => (
                <div 
                  key={s.id}
                  className={cn(
                    "w-3 h-3 rounded-full border-2 transition-all duration-500",
                    s.id === currentStep ? "bg-slate-900 border-slate-900 scale-125 shadow-lg shadow-slate-900/10" : 
                    s.id < currentStep ? "bg-emerald-500 border-emerald-500" : "bg-transparent border-slate-200"
                  )}
                />
              ))}
           </div>
        </div>
      </header>

      {/* Main Form Content */}
      <main className="max-w-7xl mx-auto w-full flex-1 pt-12 px-8 flex gap-12">
        {/* Left: Input Form */}
        <div className="flex-1 space-y-12 max-w-2xl">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.section 
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-10"
              >
                <div className="space-y-2">
                   <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Standard Identity</h2>
                   <p className="text-sm text-slate-500 font-medium">Meta uses these details to categorize your template in the WABA dashboard.</p>
                </div>
                
                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Template Identifier (System Name)</label>
                    <input 
                      placeholder="e.g. order_confirmation_v1"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_') })}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm font-bold text-slate-900 focus:outline-none focus:border-slate-900 focus:bg-white transition-all shadow-inner group"
                    />
                    <p className="text-[10px] text-slate-400 font-medium ml-2">Only lowercase letters, numbers, and underscores allowed.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Category</label>
                      <select 
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-xs font-bold text-slate-900 appearance-none cursor-pointer focus:outline-none focus:border-slate-900 focus:bg-white"
                      >
                        <option value="Marketing">Marketing</option>
                        <option value="Utility">Utility</option>
                        <option value="Authentication">Authentication</option>
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Primary Language</label>
                      <select 
                        value={formData.language}
                        onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-xs font-bold text-slate-900 appearance-none cursor-pointer focus:outline-none focus:border-slate-900 focus:bg-white"
                      >
                        <option value="en">English (US)</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="ar">Arabic</option>
                      </select>
                    </div>
                  </div>
                </div>
              </motion.section>
            )}

            {currentStep === 2 && (
              <motion.section 
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-12"
              >
                <div className="space-y-2">
                   <h2 className="text-2xl font-bold text-slate-900 tracking-tight">The Blueprint Builder</h2>
                   <p className="text-sm text-slate-500 font-medium">Compose the core content of your message using Meta's templating syntax.</p>
                </div>

                {/* Header Config */}
                <div className="space-y-6">
                   <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                      <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rich Header Content</h3>
                      <div className="flex bg-slate-50 border border-slate-100 rounded-xl p-1">
                         {['none', 'text', 'image'].map(type => (
                            <button 
                               key={type}
                               onClick={() => setFormData({ ...formData, header: { ...formData.header!, type: type as any } })}
                               className={cn(
                                 "px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all",
                                 formData.header?.type === type ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
                               )}
                            >
                               {type}
                            </button>
                         ))}
                      </div>
                   </div>
                   {formData.header?.type === 'text' && (
                      <input 
                        placeholder="Define header text..."
                        value={formData.header.text}
                        onChange={(e) => setFormData({ ...formData, header: { ...formData.header!, text: e.target.value } })}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-xs font-bold text-slate-900 focus:outline-none focus:border-slate-900 focus:bg-white"
                      />
                   )}
                   {formData.header?.type === 'image' && (
                      <div className="p-12 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center gap-4 bg-slate-50 group hover:bg-slate-100 transition-all cursor-pointer">
                         <div className="w-16 h-16 rounded-[2rem] bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-slate-900 group-hover:scale-110 transition-all shadow-sm">
                            <Plus size={32} />
                         </div>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Direct Media URL Required</p>
                      </div>
                   )}
                </div>

                {/* Body Content */}
                <div className="space-y-6">
                   <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-4">Core Body Content</h3>
                   <div className="relative">
                      <textarea 
                        rows={8}
                        value={formData.body?.text}
                        onChange={(e) => updateBody(e.target.value)}
                        placeholder="Hi {{1}}, thank you for your order #{{2}}..."
                        className="w-full bg-slate-50 border border-slate-100 rounded-[2.5rem] p-8 text-sm font-medium leading-relaxed text-slate-900 focus:outline-none focus:border-slate-900 focus:bg-white transition-all placeholder:text-slate-300 resize-none shadow-inner"
                      />
                      <div className="absolute top-6 right-8">
                         <Wand2 size={24} className="text-slate-300 hover:text-slate-900 cursor-pointer transition-colors" />
                      </div>
                   </div>

                   {/* Variable Mapping */}
                   {formData.body?.variables && formData.body.variables.length > 0 && (
                      <div className="space-y-4 pt-4">
                         <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                           <Variable size={12} className="text-slate-900" />
                           Map Variable Samples
                         </h4>
                         <div className="grid grid-cols-2 gap-4">
                            {formData.body.variables.map((v, i) => (
                               <div key={i} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-2">
                                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Sample value for {"{{" + v.label + "}}"}</span>
                                  <input 
                                    placeholder="Ex: John"
                                    value={v.sample}
                                    onChange={(e) => {
                                      const newVars = [...formData.body!.variables];
                                      newVars[i].sample = e.target.value;
                                      setFormData({ ...formData, body: { ...formData.body!, variables: newVars } });
                                    }}
                                    className="w-full bg-transparent border-none text-[11px] font-bold text-slate-900 focus:outline-none placeholder:text-slate-300"
                                  />
                               </div>
                            ))}
                         </div>
                      </div>
                   )}
                </div>
              </motion.section>
            )}

            {currentStep === 3 && (
              <motion.section 
                key="step3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-12"
              >
                <div className="space-y-2">
                   <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Active Engagement</h2>
                   <p className="text-sm text-slate-500 font-medium">Add interactive endpoints to increase template conversion performance.</p>
                </div>

                <div className="p-12 border-2 border-dashed border-slate-200 rounded-[3rem] text-center space-y-6 bg-slate-50 shadow-inner">
                   <div className="w-20 h-20 bg-white rounded-[2.5rem] border border-slate-100 flex items-center justify-center text-slate-300 mx-auto shadow-sm">
                      <Plus size={32} />
                   </div>
                   <div className="space-y-2">
                      <p className="text-sm font-bold text-slate-900 uppercase tracking-widest">Configure Call-to-Action</p>
                      <p className="text-xs text-slate-400 font-medium max-w-xs mx-auto">Add up to 2 CTA buttons (URL/Phone) or 3 Quick Reply buttons.</p>
                   </div>
                   <button className="px-8 py-4 bg-slate-900 border border-slate-900 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] text-white hover:bg-slate-800 transition-all shadow-lg active:scale-95 shadow-slate-900/10">
                      Add Interaction Layer
                   </button>
                </div>
              </motion.section>
            )}

            {currentStep === 4 && (
              <motion.section 
                key="step4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-12"
              >
                <div className="space-y-2">
                   <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Final Validation</h2>
                   <p className="text-sm text-slate-500 font-medium">Review your blueprint against Meta messaging guidelines before submission.</p>
                </div>

                <div className="space-y-6 bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
                   <div className="flex items-start gap-4">
                      <div className="p-2 bg-emerald-50 rounded-xl text-emerald-500 shrink-0">
                         <CheckCircle2 size={24} />
                      </div>
                      <div className="space-y-1">
                         <h4 className="text-sm font-bold text-slate-900 tracking-tight uppercase">Structure Validated</h4>
                         <p className="text-[11px] text-slate-500 font-medium leading-relaxed">All required fields are present. Variables have sample data attached. Unicode character compliance verified.</p>
                      </div>
                   </div>

                   <div className="flex items-start gap-4 p-6 bg-amber-50 border border-amber-100 rounded-2xl">
                      <div className="p-2 bg-white rounded-xl text-amber-500 shrink-0 shadow-sm border border-amber-100">
                         <AlertCircle size={24} />
                      </div>
                      <div className="space-y-1">
                         <h4 className="text-sm font-bold text-amber-600 tracking-tight uppercase">Manual Review Likely</h4>
                         <p className="text-[11px] text-amber-600/70 font-medium leading-relaxed">Due to the "Marketing" category, this template may undergo manual inspection which takes 2-24 hours.</p>
                      </div>
                   </div>
                </div>

                <div className="pt-6">
                   <button 
                     onClick={handleSubmit}
                     disabled={isSubmitting}
                     className={cn(
                       "w-full py-5 rounded-[2rem] text-[11px] font-bold uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 relative overflow-hidden",
                       isSubmitting ? "bg-slate-100 text-slate-400 cursor-wait" : "bg-slate-900 text-white shadow-xl shadow-slate-900/10 hover:bg-slate-800 active:scale-95"
                     )}
                   >
                     {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
                          Broadcasting to Meta...
                        </>
                     ) : (
                        <>
                           Submit For Approval
                           <Send size={18} strokeWidth={3} />
                        </>
                     )}
                   </button>
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Preview Engine */}
        <div className="w-[400px] shrink-0 sticky top-[120px] h-fit">
           <div className="flex flex-col items-center gap-8">
              <div className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-full text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 shadow-sm">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                 High-Fidelity Preview Engine
              </div>
              <div className="scale-110 origin-top">
                 <PhonePreview template={formData as any} />
              </div>
           </div>
        </div>
      </main>

      {/* Persistence Controls */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-100 p-8 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Forge Workspace v2.0 // WABA Engine :: STABLE</p>
           <div className="flex items-center gap-4">
              <button 
                onClick={handlePrev}
                disabled={currentStep === 1}
                className="px-8 py-4 rounded-2xl bg-white border border-slate-200 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                Previous Stage
              </button>
              {currentStep < 4 ? (
                <button 
                  onClick={handleNext}
                  className="px-10 py-4 rounded-2xl bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2 active:scale-95 shadow-xl shadow-slate-900/10"
                >
                  Next Stage
                  <ArrowRight size={14} strokeWidth={3} />
                </button>
              ) : (
                <button 
                  onClick={handleSubmit}
                  className="px-10 py-4 rounded-2xl bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-slate-900/10 hover:bg-slate-800 transition-all flex items-center gap-2 active:scale-95"
                >
                  Finalize & Sync
                  <Send size={14} strokeWidth={3} />
                </button>
              )}
           </div>
        </div>
      </footer>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="relative bg-white border border-slate-100 rounded-[3rem] p-12 max-w-lg w-full text-center space-y-8 shadow-2xl"
            >
              <div className="w-24 h-24 bg-emerald-50 rounded-[2.5rem] border border-emerald-100 flex items-center justify-center text-emerald-500 mx-auto shadow-sm">
                <CheckCircle2 size={48} strokeWidth={1.5} />
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight uppercase">Mission Success</h2>
                <p className="text-sm font-medium text-slate-500 leading-relaxed">
                  Your blueprint has been broadcasted to Meta for validation. You will receive an encrypted notification once the review is complete.
                </p>
              </div>
              <button 
                onClick={() => navigate('/templates')}
                className="w-full py-5 bg-slate-900 text-white rounded-2xl text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-900/10"
              >
                Return to Bridge
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
