import React from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface OnboardingProgressProps {
  currentStep: number;
}

const steps = [
  { id: 1, title: 'Connect Account', description: 'Link Meta Business App' },
  { id: 2, title: 'Verify Number', description: 'WhatsApp phone validation' },
  { id: 3, title: 'Live Messaging', description: 'Start sending campaigns' },
];

export default function OnboardingProgress({ currentStep }: OnboardingProgressProps) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-8 bg-white rounded-3xl border border-slate-100 shadow-sm mb-8">
      {steps.map((step, idx) => {
        const isCompleted = currentStep > step.id;
        const isActive = currentStep === step.id;
        
        return (
          <React.Fragment key={step.id}>
            <div className="flex items-center gap-4 flex-1">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500",
                isCompleted ? "bg-emerald-500 text-white" : isActive ? "bg-slate-900 text-white scale-110 shadow-lg shadow-slate-900/20" : "bg-slate-50 text-slate-400 border border-slate-100"
              )}>
                {isCompleted ? <Check size={18} strokeWidth={3} /> : step.id}
              </div>
              <div>
                <h4 className={cn(
                  "text-sm font-bold tracking-tight",
                  isActive ? "text-slate-900" : "text-slate-400"
                )}>{step.title}</h4>
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{step.description}</p>
              </div>
            </div>
            {idx < steps.length - 1 && (
              <div className="hidden md:block mx-4">
                <ArrowRight size={16} className="text-slate-200" />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
