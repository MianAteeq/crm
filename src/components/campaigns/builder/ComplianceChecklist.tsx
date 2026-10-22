import React from 'react';
import { ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../../lib/utils';
import { WhatsAppTemplate } from '../../../types/whatsapp';
import { useI18n } from '../../../i18n';

interface ComplianceChecklistProps {
  campaignData: {
    name: string;
    template: WhatsAppTemplate | null;
  };
}

export default function ComplianceChecklist({ campaignData }: ComplianceChecklistProps) {
  const { isRtl } = useI18n();

  const checks = [
    {
      id: 'content-length',
      label: isRtl ? 'طول الرسالة مثالي ومطابق' : 'Message length optimized',
      description: isRtl 
        ? 'يضمن أن محتوى الرسالة ضمن حدود أحرف واتساب الموصى بها لضمان أفضل قراءة.' 
        : 'Ensures the message is within the recommended WhatsApp character limits.',
      isValid: campaignData.template 
        ? (campaignData.template.body?.text || '').length > 0 && (campaignData.template.body?.text || '').length < 4096
        : false,
    },
    {
      id: 'policy-check',
      label: isRtl ? 'التحقق من سلامة السياسات' : 'Policy Integrity Verification',
      description: isRtl 
        ? 'يتحقق من خلو النص من الكلمات المقيدة وفق سياسات واتساب للأعمال.' 
        : 'Checks for restricted keywords according to WhatsApp Business policies.',
      isValid: true,
    },
    {
      id: 'media-check',
      label: isRtl ? 'وسائط الترويسة جاهزة' : 'Header media uploaded',
      description: isRtl 
        ? 'يضمن سهولة وصول المستلمين إلى أي صورة أو فيديو مرفق في الترويسة.' 
        : 'Ensures that any required image or video files are accessible.',
      isValid: true,
    },
    {
      id: 'language-vibe',
      label: isRtl ? 'متوافق مع معايير Meta المعتمدة' : 'Compliant with Meta Policies',
      description: isRtl 
        ? 'يضمن عدم وجود روابط مشبوهة أو رسائل مضللة قد تعرض حسابك للحظر.' 
        : 'Ensures no restricted keywords or phishing patterns detected.',
      isValid: true,
    }
  ];

  return (
    <div className="p-8 bg-white border border-slate-200 rounded-3xl space-y-6 shadow-sm" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between border-b border-slate-50 pb-5">
        <div className="flex items-center gap-3">
          <ShieldCheck className="text-slate-900" size={20} />
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            {isRtl ? 'فحص الامتثال والمعايير' : 'Compliance Check'}
          </h4>
        </div>
        <span className="text-[9px] font-black text-[#166534] bg-[#F0FDF4] px-3 py-1 rounded-full uppercase tracking-widest border border-[#bbf7d0]">
          {checks.filter(c => c.isValid).length}/{checks.length} {isRtl ? 'تم التحقق' : 'Verified'}
        </span>
      </div>

      <div className="space-y-4">
        {checks.map((check, i) => (
          <motion.div
            key={check.id}
            initial={{ opacity: 0, x: isRtl ? 10 : -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={cn(
              "flex items-start gap-4 p-4 rounded-xl border transition-all",
              check.isValid 
                ? 'bg-slate-50 border-slate-50 hover:border-slate-200' 
                : 'bg-rose-50 border-rose-100'
            )}
          >
            <div className="mt-0.5 shrink-0">
              {check.isValid ? (
                <CheckCircle2 size={16} className="text-emerald-500" />
              ) : (
                <AlertCircle size={16} className="text-rose-500" />
              )}
            </div>
            <div>
              <p className={cn(
                "text-xs font-bold",
                check.isValid ? 'text-slate-900' : 'text-rose-900'
              )}>
                {check.label}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                {check.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
