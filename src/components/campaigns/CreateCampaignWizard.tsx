import { useState } from 'react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Target, 
  Bell, 
  RefreshCw, 
  Zap, 
  Upload, 
  Check, 
  Smartphone,
  AlertTriangle,
  Rocket,
  Plus,
  Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';

interface WizardProps {
  onClose: () => void;
}

const STEPS = ['Campaign Info', 'Message Template', 'Audience', 'Review & Launch'];

const CAMPAIGN_TYPES = [
  { id: 'promo', label: 'Promotional Offer', icon: Target, desc: 'Drive sales with discounts' },
  { id: 'remind', label: 'Reminder', icon: Bell, desc: 'Notify about events' },
  { id: 'follow', label: 'Follow-up', icon: RefreshCw, desc: 'Nurture existing leads' },
  { id: 'new', label: 'New Service', icon: Zap, desc: 'Announce new features' },
];

const TEMPLATES = [
  { id: 't1', name: 'Welcome Message', text: 'Hi {{first_name}}! Welcome to {{service_name}}. We are excited to have you!', type: 'Text' },
  { id: 't2', name: 'Flash Sale (Image)', text: 'Don\'t miss out! 50% OFF everything today. Check it out: https://acme.com', type: 'Text + Image' },
  { id: 't3', name: 'Webinar Invite', text: 'Hey {{first_name}}, join us on {{date}} for an exclusive deep dive!', type: 'Text + CTA' },
];

export default function CreateCampaignWizard({ onClose }: WizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    type: 'promo',
    audience: 'All Contacts',
    scheduleType: 'now',
    templateId: 't1',
    message: ''
  });

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const selectedTemplate = TEMPLATES.find(t => t.id === formData.templateId);

  return (
    <div className="fixed inset-0 z-[60] bg-[#050505]/95 backdrop-blur-3xl flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-5xl bg-[#0A0A0A] border border-white/5 rounded-[2rem] overflow-hidden flex flex-col max-h-[92vh] shadow-2xl"
      >
        {/* Header */}
        <div className="px-10 py-8 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
          <div>
            <h2 className="text-2xl font-serif font-light text-white italic">Create New Campaign</h2>
            <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold mt-2">Configuration Wizard • Step {currentStep} of 4</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-slate-500 transition-all hover:rotate-90">
            <X size={20} />
          </button>
        </div>

        {/* Progress Navigation */}
        <div className="px-10 py-4 bg-[#0F0F0F] flex gap-3 border-b border-white/5">
          {STEPS.map((step, i) => (
            <div key={i} className="flex-1 space-y-3">
              <div className={cn(
                "h-0.5 rounded-full transition-all duration-700",
                currentStep > i ? "bg-brand" : "bg-white/10"
              )} />
              <div className="flex items-center gap-2">
                <span className={cn(
                  "text-[9px] font-bold uppercase tracking-widest transition-colors",
                  currentStep === i + 1 ? "text-white" : "text-slate-600"
                )}>
                  0{i + 1}
                </span>
                <span className={cn(
                  "text-[9px] font-bold uppercase tracking-widest transition-colors hidden md:block",
                  currentStep === i + 1 ? "text-brand" : "text-slate-600"
                )}>
                  {step}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="space-y-10 max-w-3xl mx-auto"
              >
                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Campaign Identity</label>
                  <input 
                    type="text" 
                    placeholder="Enter campaign title..."
                    className="w-full bg-[#050505] border border-white/5 rounded-xl p-5 text-lg font-serif italic text-white placeholder:text-slate-800 focus:outline-none focus:border-brand/40 transition-all"
                  />
                </div>

                <div className="space-y-5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Strategic Focus</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {CAMPAIGN_TYPES.map((type) => (
                      <button 
                        key={type.id}
                        onClick={() => setFormData({ ...formData, type: type.id })}
                        className={cn(
                          "p-6 rounded-2xl border text-left cursor-pointer transition-all flex items-center gap-5 group",
                          formData.type === type.id ? "bg-white/5 border-brand/40 shadow-[0_0_20px_rgba(37,211,102,0.05)]" : "bg-[#0F0F0F] border-white/5 hover:border-white/20"
                        )}
                      >
                        <div className={cn(
                          "w-14 h-14 rounded-2xl flex items-center justify-center transition-all",
                          formData.type === type.id ? "bg-brand text-black scale-110" : "bg-white/5 text-slate-500"
                        )}>
                          <type.icon size={24} strokeWidth={1.5} />
                        </div>
                        <div className="flex-1">
                          <p className={cn("text-sm font-semibold transition-colors uppercase tracking-widest", formData.type === type.id ? "text-white" : "text-slate-400")}>{type.label}</p>
                          <p className="text-[11px] text-slate-600 mt-0.5">{type.desc}</p>
                        </div>
                        {formData.type === type.id && (
                          <div className="w-5 h-5 rounded-full bg-brand flex items-center justify-center animate-in fade-in zoom-in">
                            <Check size={12} className="text-black" strokeWidth={3} />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Segment Selection</label>
                    <div className="relative">
                      <select className="w-full bg-[#050505] border border-white/5 rounded-xl p-4 text-sm text-slate-300 focus:outline-none appearance-none cursor-pointer hover:border-white/20 transition-all">
                        <option>Curated: All Contacts</option>
                        <option>Exclusive: VIP Clients</option>
                        <option>Segment: Active Users</option>
                        <option>Pool: Re-engagement</option>
                      </select>
                      <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-slate-600 pointer-events-none" size={16} />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Execution Timing</label>
                    <div className="flex bg-[#050505] p-1.5 rounded-2xl border border-white/5">
                      {['now', 'later'].map((mode) => (
                        <button 
                          key={mode}
                          onClick={() => setFormData({ ...formData, scheduleType: mode })}
                          className={cn(
                            "flex-1 py-3 text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl transition-all", 
                            formData.scheduleType === mode ? "bg-white text-black shadow-lg" : "text-slate-600 hover:text-slate-400"
                          )}
                        >
                          {mode === 'now' ? 'Immediate' : 'Scheduled'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-12"
              >
                <div className="lg:col-span-7 space-y-10">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Structural Templates</label>
                      <button className="text-[10px] font-bold text-brand uppercase tracking-widest hover:underline flex items-center gap-2">
                        <Plus size={14} /> NEW TEMPLATE
                      </button>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      {TEMPLATES.map(t => (
                        <button 
                          key={t.id}
                          onClick={() => setFormData({ ...formData, templateId: t.id })}
                          className={cn(
                            "p-5 rounded-2xl border text-left transition-all group",
                            formData.templateId === t.id ? "bg-white/5 border-brand/40" : "bg-[#0F0F0F] border-white/5 hover:border-white/20"
                          )}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className={cn("text-sm font-semibold tracking-wide", formData.templateId === t.id ? "text-white" : "text-slate-300")}>{t.name}</h4>
                            <span className="text-[9px] font-bold uppercase text-slate-500 bg-white/5 px-2 py-1 rounded tracking-widest border border-white/5">{t.type}</span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed group-hover:text-slate-500 transition-colors uppercase tracking-tight overflow-hidden text-ellipsis whitespace-nowrap">{t.text}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Dynamic Variables</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {['first_name', 'service_name', 'date', 'order_id'].map(v => (
                        <button key={v} className="px-4 py-3 bg-[#050505] border border-white/5 rounded-xl text-[10px] text-slate-500 hover:text-brand hover:border-brand/40 transition-all font-mono uppercase tracking-widest">
                          {`{${v}}`}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 flex flex-col">
                  <div className="sticky top-0">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-6 block text-center">Mobile Context Preview</label>
                    <div className="bg-[#050505] rounded-[3rem] border border-white/5 p-4 shadow-2xl relative">
                      <div className="bg-[#0A0A0A] rounded-[2.5rem] border border-white/10 aspect-[9/18] flex flex-col overflow-hidden relative">
                         {/* Phone Status Bar */}
                         <div className="h-10 px-8 flex items-center justify-between">
                           <span className="text-[10px] font-bold text-slate-500 tracking-tighter">9:41</span>
                           <div className="flex gap-1.5 items-center">
                             <div className="w-4 h-2 rounded-sm bg-slate-700" />
                           </div>
                         </div>
                         
                         {/* Chat Content */}
                         <div className="flex-1 p-6 space-y-4 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] bg-opacity-20 translate-z-0">
                           <div className="flex items-center justify-center mb-6">
                             <span className="text-[9px] font-bold text-slate-600 bg-white/5 px-3 py-1 rounded-full uppercase tracking-widest">Today</span>
                           </div>

                           <motion.div 
                             initial={{ scale: 0.9, opacity: 0 }}
                             animate={{ scale: 1, opacity: 1 }}
                             className="bg-[#054D44] text-white p-4 rounded-2xl rounded-tl-none relative shadow-2xl mr-4"
                           >
                              <div className="absolute -left-1.5 top-0 w-4 h-4 bg-[#054D44]" style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }} />
                              <p className="text-[13px] leading-relaxed font-medium">
                                {selectedTemplate?.text.split(/(\{\{[^}]+\}\})/).map((part, i) => (
                                  part.startsWith('{{') ? <span key={i} className="text-[#25D366] font-bold underline decoration-[#25D366]/20 underline-offset-4">{part}</span> : part
                                ))}
                              </p>
                              <div className="flex items-center justify-end gap-1 mt-2 opacity-40">
                                <span className="text-[9px] font-bold">12:30</span>
                                <div className="flex scale-75">
                                   <Check size={12} className="-mr-1.5" />
                                   <Check size={12} className="text-[#34B7F1]" />
                                </div>
                              </div>
                           </motion.div>
                         </div>

                         {/* Input Bar Placeholder */}
                         <div className="h-16 px-6 border-t border-white/5 bg-white/[0.02] flex items-center gap-3">
                           <div className="flex-1 h-8 rounded-full bg-white/5" />
                           <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center">
                             <Send size={14} className="text-black" />
                           </div>
                         </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="space-y-12 max-w-4xl mx-auto"
              >
                <div className="border border-white/5 border-dashed rounded-[3rem] p-16 flex flex-col items-center justify-center text-center space-y-6 hover:border-brand/30 transition-all bg-[#0F0F0F]/50 group cursor-pointer">
                  <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center text-slate-500 group-hover:bg-brand/10 group-hover:text-brand transition-all duration-500 group-hover:scale-110">
                    <Upload size={36} strokeWidth={1} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif italic text-white">Import Audience</h3>
                    <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">Standardize your data outreach by uploading a CSV or XLSX dataset with prioritized columns.</p>
                  </div>
                  <button className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-white hover:bg-white hover:text-black transition-all">
                    Browse File System
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between px-2">
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Record Preview (Head 3)</h4>
                    <span className="text-[10px] font-bold text-brand uppercase tracking-widest bg-brand/5 px-3 py-1 rounded-full">Validated Status</span>
                  </div>
                  <div className="bg-[#0F0F0F] rounded-3xl overflow-hidden border border-white/5">
                    <table className="w-full text-left">
                      <thead className="bg-white/5 text-[9px] uppercase font-bold text-slate-500 tracking-widest border-b border-white/5">
                        <tr>
                          <th className="px-8 py-5">Full Name</th>
                          <th className="px-8 py-5">Phone Identifier</th>
                          <th className="px-8 py-5">Tagging</th>
                        </tr>
                      </thead>
                      <tbody className="text-xs divide-y divide-white/5 text-slate-400">
                        {[
                          { name: 'Alex Johnson', phone: '+1 234 567 8901', seg: 'Premium' },
                          { name: 'Sarah Miller', phone: '+1 345 678 9012', seg: 'Lead' },
                          { name: 'Michael Chen', phone: '+1 456 789 0123', seg: 'Beta' },
                        ].map((row, i) => (
                          <tr key={i} className="hover:bg-white/[0.01] transition-colors">
                            <td className="px-8 py-5 font-serif italic text-slate-300">{row.name}</td>
                            <td className="px-8 py-5 font-mono opacity-60 tracking-tighter">{row.phone}</td>
                            <td className="px-8 py-5">
                              <span className="px-2 py-0.5 bg-white/5 rounded border border-white/5 font-bold uppercase text-[9px] tracking-tight">{row.seg}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="p-8 bg-brand/[0.03] border border-brand/20 rounded-[2.5rem] flex items-center justify-between group overflow-hidden relative">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-48 h-48 bg-brand/5 blur-3xl rounded-full" />
                  <div className="flex items-center gap-6 relative">
                    <div className="w-16 h-16 bg-brand rounded-2xl flex items-center justify-center text-black shadow-[0_0_30px_rgba(37,211,102,0.2)]">
                      <Smartphone size={28} />
                    </div>
                    <div>
                      <p className="text-lg font-serif italic text-white leading-none">Net Outreach Reach</p>
                      <p className="text-xs text-slate-500 mt-2 font-medium">Filtered and validated for region-specific encoding.</p>
                    </div>
                  </div>
                  <div className="text-right relative">
                    <p className="text-5xl font-light text-brand tracking-tighter">3,240</p>
                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.3em] mt-1 mr-1">Qualified Contacts</p>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div 
                key="step4"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-12"
              >
                <div className="lg:col-span-7 space-y-8">
                  <div className="bg-[#0F0F0F] rounded-[2.5rem] border border-white/5 p-10 space-y-10">
                    <div className="grid grid-cols-2 gap-y-10 gap-x-12">
                      <div>
                        <p className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.2em] mb-2">Campaign Label</p>
                        <h4 className="text-xl font-serif italic text-white">Summer Solstice VIP Reach</h4>
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.2em] mb-2">Launch Window</p>
                        <h4 className="text-xl font-serif italic text-white flex items-center gap-2">
                          <Check size={18} className="text-brand" strokeWidth={3} />
                          Instant Send
                        </h4>
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.2em] mb-2">Effective Audience</p>
                        <h4 className="text-xl font-serif italic text-white">3,240 Identified</h4>
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.2em] mb-2">Classification</p>
                        <h4 className="text-xl font-serif italic text-[#34B7F1]">Promotional Flow</h4>
                      </div>
                    </div>

                    <div className="pt-10 border-t border-white/5 space-y-4">
                      <p className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.2em]">Final Creative Copy</p>
                      <div className="bg-[#050505] p-6 rounded-2xl border border-white/5 text-sm text-slate-500 leading-relaxed italic relative">
                        <div className="absolute left-0 top-0 w-1 h-full bg-brand opacity-20" />
                        "Hi {"{{first_name}}"}! We're inviting you to nuestro exclusive Summer Launch event. Claim your priority pass before they're gone: https://zappify.io/pass"
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-5 p-6 bg-amber-400/[0.02] border border-amber-400/20 rounded-3xl">
                    <div className="p-3 bg-amber-400/10 rounded-2xl text-amber-500">
                      <AlertTriangle size={20} />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-amber-500 uppercase tracking-widest mb-1 mt-1">Infrastructure Notice</p>
                      <p className="text-xs text-amber-400/60 leading-relaxed font-medium italic">High volume detected. Ensure your Meta WABA tier allows for {'>'}1,000 daily messages to avoid truncation.</p>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 space-y-6">
                  <div className="bg-white p-10 rounded-[3rem] space-y-8 flex flex-col justify-between relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-slate-100/50 blur-[50px] rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div>
                      <h3 className="text-black font-serif text-3xl font-light italic leading-tight">Authorize & Launch</h3>
                      <p className="text-slate-500 text-[11px] font-bold uppercase tracking-[0.15em] mt-3 leading-relaxed">By launching, you agree to per-message delivery billing and terms.</p>
                    </div>
                    
                    <div className="space-y-4 pt-4 border-t border-slate-100">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">Resource Allocation</span>
                        <span className="text-black font-bold">100% Guaranteed</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">Estimated Credits</span>
                        <span className="text-black font-bold">3,240 units</span>
                      </div>
                      <div className="pt-4 mt-2 border-t border-slate-50 border-dashed flex items-center justify-between text-2xl font-serif italic">
                        <span className="text-slate-400">Total Charge</span>
                        <span className="text-black font-bold">$145.20</span>
                      </div>
                    </div>

                    <button className="w-full bg-black text-white py-5 rounded-3xl font-bold uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl relative z-10">
                      <Rocket size={18} />
                      Verify & Execute
                    </button>
                  </div>
                  
                  <button className="w-full bg-white/5 border border-white/5 py-4 rounded-3xl text-slate-500 text-[10px] font-bold uppercase tracking-widest hover:text-white hover:bg-white/10 transition-all">
                    Save Internal Draft
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-10 py-8 border-t border-white/5 flex items-center justify-between bg-white/[0.01]">
          <button 
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-white disabled:opacity-30 transition-all"
          >
            <ChevronLeft size={16} />
            Back Partition
          </button>
          
          {currentStep < 4 ? (
            <button 
              onClick={nextStep}
              className="px-10 py-3 bg-white text-black text-[11px] font-bold uppercase tracking-[0.2em] rounded-xl transition-all hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] active:scale-95 flex items-center gap-3"
            >
              Next Strategy
              <ChevronRight size={16} />
            </button>
          ) : (
            <div className="w-24 h-5" />
          )}
        </div>
      </motion.div>
    </div>
  );
}
