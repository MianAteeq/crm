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
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 text-sm font-bold text-slate-900 focus:outline-none focus:border-slate-900 transition-all shadow-inner"
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                  Campaign Type
                </label>
                <div className="grid grid-cols-2 gap-4">
                   {(['Broadcast', 'Automation'] as const).map(type => (
                     <button
                        key={type}
                        onClick={() => setCampaignData({ ...campaignData, type })}
                        className={`p-4 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                          campaignData.type === type 
                            ? 'bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-900/10' 
                            : 'bg-white border-slate-200 text-slate-400 hover:border-slate-400 hover:text-slate-900 shadow-sm'
                        }`}
                     >
                        {type}
                     </button>
                   ))}
                </div>
              </div>

              <div className="md:col-span-2 space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                  Description (Optional)
                </label>
                <textarea 
                  value={campaignData.description}
                  onChange={(e) => setCampaignData({ ...campaignData, description: e.target.value })}
                  placeholder="Internal notes about this campaign goal..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 text-sm font-bold text-slate-900 focus:outline-none focus:border-slate-900 transition-all h-32 resize-none shadow-inner"
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
            <div className="p-10 bg-emerald-50 border border-emerald-100 rounded-[2.5rem] flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-emerald-500 mb-6 shadow-sm">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">Ready for Launch</h3>
              <p className="text-slate-500 mt-2 font-medium max-w-[400px] text-xs">
                Please review the summary below. Once confirmed, your campaign will be processed according to your schedule.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <ComplianceChecklist campaignData={campaignData} />

               <div className="space-y-8">
                  <div className="p-8 bg-white border border-slate-200 rounded-[2rem] space-y-4 shadow-sm">
                     <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50 pb-3">Campaign Overview</h4>
                     <div className="grid grid-cols-2 gap-4 py-2">
                        <div>
                           <p className="text-[9px] font-bold uppercase text-slate-400">Status</p>
                           <p className="text-xs font-bold text-slate-900 mt-1 uppercase">Pending Confirmation</p>
                        </div>
                        <div>
                           <p className="text-[9px] font-bold uppercase text-slate-400">Type</p>
                           <p className="text-xs font-bold text-slate-900 mt-1 uppercase">{campaignData.type}</p>
                        </div>
                     </div>
                  </div>

                  <div className="p-8 bg-white border border-slate-200 rounded-[2rem] space-y-4 shadow-sm">
                     <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50 pb-3">Delivery Details</h4>
                     <div className="grid grid-cols-2 gap-4 py-2">
                        <div>
                           <p className="text-[9px] font-bold uppercase text-slate-400">Recipient Group</p>
                           <p className="text-xs font-bold text-slate-900 mt-1 uppercase">{campaignData.audience.type === 'all' ? 'Entire Database' : 'Target Segment'}</p>
                        </div>
                        <div>
                           <p className="text-[9px] font-bold uppercase text-slate-400">Schedule</p>
                           <p className="text-xs font-bold text-slate-900 mt-1 uppercase">
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
    <div className="min-h-screen pb-20 bg-slate-50/30">
      {/* Top Nav */}
      <div className="flex items-center justify-between mb-12">
        <button 
          onClick={handleBack}
          className="flex items-center gap-3 text-slate-400 hover:text-slate-900 transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center group-hover:bg-slate-100 transition-all shadow-sm">
             <ChevronLeft size={20} />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest">Quit Builder</span>
        </button>

        <div className="flex items-center gap-4">
           {steps.map((s) => (
             <React.Fragment key={s.id}>
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all duration-500 shadow-sm ${
                    currentStep === s.id ? 'bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-900/10' : 
                    currentStep > s.id ? 'bg-emerald-50 border-emerald-100 text-emerald-500' :
                    'bg-white border-slate-200 text-slate-300'
                  }`}>
                    {currentStep > s.id ? <CheckCircle2 size={18} /> : <s.icon size={18} />}
                  </div>
                </div>
                {s.id < 6 && <div className={`w-8 h-px ${currentStep > s.id ? 'bg-emerald-200' : 'bg-slate-200'}`} />}
             </React.Fragment>
           ))}
        </div>

        <div className="w-[120px]" /> {/* Spacer */}
      </div>

      <div className="max-w-6xl mx-auto px-6">
         <div className="mb-12">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Step {currentStep} of 6</p>
            <h2 className="text-4xl font-bold text-slate-900 tracking-tight mt-2">{steps[currentStep-1].label}</h2>
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

         <div className="mt-16 flex items-center justify-between pt-10 border-t border-slate-200">
            <button
               onClick={handleBack}
               className="flex items-center gap-2.5 px-8 py-4 rounded-xl border border-slate-200 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all active:scale-95 bg-white shadow-sm"
            >
               <ChevronLeft size={16} /> Back
            </button>
            <button
               onClick={handleNext}
               className="bg-slate-900 hover:bg-slate-800 text-white px-10 py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-all flex items-center gap-2.5 shadow-lg shadow-slate-900/10 active:scale-95 group relative overflow-hidden"
            >
               {currentStep === 6 ? 'Confirm & Launch' : 'Continue'}
               <ChevronRight size={16} strokeWidth={2.5} />
            </button>
         </div>
      </div>
    </div>
  );
}
