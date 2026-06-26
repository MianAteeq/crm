import React from 'react';
import { ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../../lib/utils';

import { WhatsAppTemplate } from '../../../types/whatsapp';

interface ComplianceChecklistProps {
  campaignData: {
    name: string;
    template: WhatsAppTemplate | null;
  };
}

export default function ComplianceChecklist({ campaignData }: ComplianceChecklistProps) {
  // Mock validation logic for the demo
  const checks = [
    {
      id: 'content-length',
      label: 'Message length optimized',
      description: 'Ensures the message is within the recommended WhatsApp character limits.',
      isValid: campaignData.template 
        ? (campaignData.template.body?.text || '').length > 0 && (campaignData.template.body?.text || '').length < 4096
        : false,
    },
    {
      id: 'policy-check',
      label: 'Policy Integrity Verification',
      description: 'Checks for restricted keywords according to WhatsApp Business policies.',
      isValid: true, // Simplified for mock
    },
    {
      id: 'media-check',
      label: 'Header media uploaded',
      description: 'Ensures that any required image or video files are accessible.',
      isValid: true, // Simplified for mock
    },
    {
      id: 'language-vibe',
      label: 'Compliant with Meta Policies',
      description: 'Ensures no restricted keywords or phishing patterns detected.',
      isValid: true,
    }
  ];

  return (
    <div className="p-8 bg-white border border-slate-200 rounded-3xl space-y-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-50 pb-5">
        <div className="flex items-center gap-3">
          <ShieldCheck className="text-slate-900" size={20} />
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Compliance Check</h4>
        </div>
        <span className="text-[9px] font-black text-brand bg-brand/5 px-3 py-1 rounded-full uppercase tracking-widest border border-brand/10">
          {checks.filter(c => c.isValid).length}/{checks.length} Verified
        </span>
      </div>

      <div className="space-y-4">
        {checks.map((check, i) => (
          <motion.div
            key={check.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={cn(
              "flex items-start gap-4 p-4 rounded-xl border transition-all",
              check.isValid 
                ? 'bg-slate-50 border-slate-50 hover:border-slate-200' 
                : 'bg-rose-50 border-rose-100'
            )}
           >
            <div className={cn(
               "mt-0.5",
               check.isValid ? 'text-emerald-500' : 'text-rose-500'
            )}>
              {check.isValid ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            </div>
            <div>
              <p className={cn(
                "text-[10px] font-bold uppercase tracking-wide",
                check.isValid ? 'text-slate-900' : 'text-rose-600'
              )}>
                {check.label}
              </p>
              <p className="text-[9px] font-medium text-slate-500 mt-1 leading-relaxed">
                {check.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
