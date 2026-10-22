import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Globe } from 'lucide-react';
import SendingDomainsTab from './SendingDomainsTab';
import { useI18n } from '../../i18n';
import { LanguageSwitcher } from '../../components/common/LanguageSwitcher';

export default function EmailSettingsPage() {
  const navigate = useNavigate();
  const { isRtl } = useI18n();

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-6 pb-20" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#166534] text-white flex items-center justify-center shadow-lg shadow-[#166534]/20 shrink-0">
            <Globe size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {isRtl ? 'نطاقات إرسال البريد الإلكتروني' : 'Email Sending Domains'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              {isRtl 
                ? 'تحقق من نطاقات الإرسال المعتمدة وأدرها لحسابك لضمان وصول الرسائل إلى صندوق الوارد' 
                : 'Verify and manage authorized email sending domains for your account'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          <LanguageSwitcher variant="dropdown" />
          <button
            onClick={() => navigate('/email-campaigns')}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 border border-slate-200 px-3.5 py-2 rounded-xl bg-white shadow-sm hover:bg-slate-50 transition-colors cursor-pointer"
          >
            {isRtl ? <ArrowRight size={14} /> : <ArrowLeft size={14} />}
            <span>{isRtl ? 'حملات البريد' : 'Campaigns'}</span>
          </button>
        </div>
      </div>

      {/* Sending Domains Interface */}
      <SendingDomainsTab />
    </div>
  );
}
