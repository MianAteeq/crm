import React from 'react';
import { ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface ComplianceChecklistProps {
  campaignData: {
    name: string;
    templateId: string;
    variableMapping: Record<string, string>;
  };
}

export default function ComplianceChecklist({ campaignData }: ComplianceChecklistProps) {
  // Mock validation logic for the demo
  const checks = [
    {
      id: 'name-convention',
      label: 'Template name follows convention',
      description: 'Must contain only lowercase letters, numbers, and underscores.',
      isValid: /^[a-z0-9_]+$/.test(campaignData.templateId || 'campaign_template_default'),
    },
    {
      id: 'sample-values',
      label: 'Body has sample values',
      description: 'All variables in the template must have mapping or samples.',
      isValid: Object.keys(campaignData.variableMapping).length > 0 || true, // Simplified for mock
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
    <div className="p-8 bg-bg-surface border border-border rounded-[2rem] space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <ShieldCheck className="text-brand" size={20} />
          <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Meta Policy Compliance</h4>
        </div>
        <span className="text-[9px] font-black text-brand bg-brand/10 px-3 py-1 rounded-full uppercase tracking-widest">
          {checks.filter(c => c.isValid).length}/{checks.length} Passed
        </span>
      </div>

      <div className="space-y-4">
        {checks.map((check, i) => (
          <motion.div 
            key={check.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`flex items-start gap-4 p-4 rounded-2xl border transition-all ${
              check.isValid ? 'bg-bg-surface3/30 border-border/50' : 'bg-rose-500/5 border-rose-500/20'
            }`}
          >
            <div className={`mt-0.5 ${check.isValid ? 'text-brand' : 'text-rose-500'}`}>
              {check.isValid ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            </div>
            <div>
              <p className={`text-[11px] font-black uppercase tracking-tight ${check.isValid ? 'text-white' : 'text-rose-500'}`}>
                {check.label}
              </p>
              <p className="text-[9px] font-medium text-text-muted uppercase tracking-tight mt-1 leading-relaxed">
                {check.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
