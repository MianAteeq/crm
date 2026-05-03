import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, ChevronRight, CheckCircle2, ChevronLeft,
  Settings, Users, Layout, Database, Calendar, Rocket
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import AudienceSelector from '../../components/campaigns/builder/AudienceSelector';
import TemplateSelector from '../../components/campaigns/builder/TemplateSelector';
import VariableMapper from '../../components/campaigns/builder/VariableMapper';
import SchedulePicker from '../../components/campaigns/builder/SchedulePicker';
import ComplianceChecklist from '../../components/campaigns/builder/ComplianceChecklist';

type Step = 1 | 2 | 3 | 4 | 5 | 6;

export default function CampaignBuilderPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  
  // Builder State
  const [campaignData, setCampaignData] = useState({
    name: '',
    type: 'Broadcast' as 'Broadcast' | 'Automation',
    description: '',
    audience: { type: 'all' as any, segmentId: '' },
    templateId: '',
    variableMapping: {} as Record<string, string>,
    scheduleMethod: 'now' as 'now' | 'scheduled',
    scheduledDate: '',
    scheduledTime: '',
  });

  const steps = [
    { id: 1, label: 'Setup', icon: Settings },
    { id: 2, label: 'Audience', icon: Users },
    { id: 3, label: 'Template', icon: Layout },
    { id: 4, label: 'Mapping', icon: Database },
    { id: 5, label: 'Schedule', icon: Calendar },
    { id: 6, label: 'Confirm', icon: Rocket },
  ];

  const handleNext = () => {
    if (currentStep < 6) setCurrentStep((prev) => (prev + 1) as Step);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((prev) => (prev - 1) as Step);
    else navigate('/campaigns');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">
                  Name your campaign
                </label>
                <input 
                  value={campaignData.name}
                  onChange={(e) => setCampaignData({ ...campaignData, name: e.target.value })}
                  placeholder="Ex: Summer Sale 2024"
                  className="w-full bg-bg-surface3 border border-border rounded-2xl p-5 text-sm font-bold text-white focus:outline-none focus:border-brand/40 transition-all shadow-inner"
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">
                  Campaign Type
                </label>
                <div className="grid grid-cols-2 gap-4">
                   {(['Broadcast', 'Automation'] as const).map(type => (
                     <button
                        key={type}
                        onClick={() => setCampaignData({ ...campaignData, type })}
                        className={`p-4 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                          campaignData.type === type 
                            ? 'bg-brand border-brand text-black' 
                            : 'bg-bg-surface3 border-border text-text-muted hover:border-brand/30 hover:text-white'
                        }`}
                     >
                        {type}
                     </button>
                   ))}
                </div>
              </div>

              <div className="md:col-span-2 space-y-4">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">
                  Description (Optional)
                </label>
                <textarea 
                  value={campaignData.description}
                  onChange={(e) => setCampaignData({ ...campaignData, description: e.target.value })}
                  placeholder="Internal notes about this campaign goal..."
                  className="w-full bg-bg-surface3 border border-border rounded-2xl p-5 text-sm font-bold text-white focus:outline-none focus:border-brand/40 transition-all h-32 resize-none"
                />
              </div>
            </div>
          </div>
        );
      case 2:
        return <AudienceSelector value={campaignData.audience} onChange={(a) => setCampaignData({ ...campaignData, audience: a })} />;
      case 3:
        return <TemplateSelector value={campaignData.templateId} onChange={(t) => setCampaignData({ ...campaignData, templateId: t })} />;
      case 4:
        return <VariableMapper templateId={campaignData.templateId} mapping={campaignData.variableMapping} onChange={(m) => setCampaignData({ ...campaignData, variableMapping: m })} />;
      case 5:
        return (
          <SchedulePicker 
            method={campaignData.scheduleMethod}
            onMethodChange={(m) => setCampaignData({ ...campaignData, scheduleMethod: m })}
            date={campaignData.scheduledDate}
            onDateChange={(d) => setCampaignData({ ...campaignData, scheduledDate: d })}
            time={campaignData.scheduledTime}
            onTimeChange={(t) => setCampaignData({ ...campaignData, scheduledTime: t })}
          />
        );
      case 6:
        return (
          <div className="space-y-10">
            <div className="p-10 bg-emerald-500/5 border border-emerald-500/20 rounded-[2.5rem] flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 mb-6">
                <CheckCircle2 size={40} />
              </div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tight">Ready for Launch</h3>
              <p className="text-text-muted mt-2 font-medium max-w-[400px]">
                Please review the summary below. Once confirmed, your campaign will be processed according to your schedule.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <ComplianceChecklist campaignData={campaignData} />

               <div className="space-y-8">
                  <div className="p-8 bg-bg-surface border border-border rounded-[2rem] space-y-4">
                     <h4 className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] border-b border-border pb-2">Campaign Overview</h4>
                     <div className="grid grid-cols-2 gap-4 py-2">
                        <div>
                           <p className="text-[9px] font-black uppercase text-text-muted opacity-60">Status</p>
                           <p className="text-xs font-black text-white uppercase mt-1">Pending Confirmation</p>
                        </div>
                        <div>
                           <p className="text-[9px] font-black uppercase text-text-muted opacity-60">Type</p>
                           <p className="text-xs font-black text-white uppercase mt-1">{campaignData.type}</p>
                        </div>
                     </div>
                  </div>

                  <div className="p-8 bg-bg-surface border border-border rounded-[2rem] space-y-4">
                     <h4 className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] border-b border-border pb-2">Delivery Details</h4>
                     <div className="grid grid-cols-2 gap-4 py-2">
                        <div>
                           <p className="text-[9px] font-black uppercase text-text-muted opacity-60">Recipient Group</p>
                           <p className="text-xs font-black text-white uppercase mt-1">{campaignData.audience.type === 'all' ? 'Entire Database' : 'Target Segment'}</p>
                        </div>
                        <div>
                           <p className="text-[9px] font-black uppercase text-text-muted opacity-60">Schedule</p>
                           <p className="text-xs font-black text-white uppercase mt-1">
                             {campaignData.scheduleMethod === 'now' ? 'Immediate' : `${campaignData.scheduledDate} @ ${campaignData.scheduledTime}`}
                           </p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Top Nav */}
      <div className="flex items-center justify-between mb-12">
        <button 
          onClick={handleBack}
          className="flex items-center gap-3 text-text-muted hover:text-white transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-bg-surface border border-border flex items-center justify-center group-hover:border-brand transition-all">
             <ChevronLeft size={20} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest">Quit Builder</span>
        </button>

        <div className="flex items-center gap-4">
           {steps.map((s) => (
             <React.Fragment key={s.id}>
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all duration-500 ${
                    currentStep === s.id ? 'bg-brand border-brand text-black shadow-lg shadow-brand/20' : 
                    currentStep > s.id ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' :
                    'bg-bg-surface3 border-border text-text-muted'
                  }`}>
                    {currentStep > s.id ? <CheckCircle2 size={18} /> : <s.icon size={18} />}
                  </div>
                </div>
                {s.id < 6 && <div className={`w-8 h-px ${currentStep > s.id ? 'bg-emerald-500/30' : 'bg-border'}`} />}
             </React.Fragment>
           ))}
        </div>

        <div className="w-[120px]" /> {/* Spacer */}
      </div>

      <div className="max-w-6xl mx-auto">
         <div className="mb-12">
            <p className="text-[10px] font-black text-brand uppercase tracking-[0.2em]">Step {currentStep} of 6</p>
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter mt-2">{steps[currentStep-1].label}</h2>
         </div>

         <AnimatePresence mode="wait">
            <motion.div
               key={currentStep}
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               className="min-h-[500px]"
            >
               {renderStep()}
            </motion.div>
         </AnimatePresence>

         <div className="mt-16 flex items-center justify-between pt-10 border-t border-border">
            <button
               onClick={handleBack}
               className="flex items-center gap-3 px-8 py-5 rounded-[2rem] border border-border text-[11px] font-black uppercase tracking-widest text-text-muted hover:text-white transition-all active:scale-95"
            >
               <ChevronLeft size={18} /> Back
            </button>
            <button
               onClick={handleNext}
               className="bg-brand hover:brightness-110 text-black px-12 py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-[11px] transition-all flex items-center gap-3 shadow-[0_10px_40px_rgba(var(--brand-rgb),0.2)] active:scale-95 group relative overflow-hidden"
            >
               <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
               {currentStep === 6 ? 'Confirm & Launch' : 'Continue'}
               <ChevronRight size={18} strokeWidth={3} />
            </button>
         </div>
      </div>
    </div>
  );
}
