import React, { useEffect } from 'react';
import Navbar from '../../components/public/Navbar';
import Footer from '../../components/public/Footer';
import { useI18n } from '../../i18n';
import { cn } from '../../lib/utils';
import { ShieldCheck, FileText, Scale } from 'lucide-react';

// Reusable scroll behavior helper
function useScrollToTop() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
}

export function PrivacyPage() {
  useScrollToTop();
  const { t, isRtl } = useI18n();

  return (
    <div 
      className={cn(
        "bg-white text-slate-900 min-h-screen selection:bg-[#166534]/20 selection:text-[#166534] font-sans overflow-x-hidden",
        isRtl && "text-right"
      )}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <Navbar />

      <main>
        {/* Hero Header */}
        <section className="pt-48 pb-36 px-6 bg-[#12263A] text-white text-center relative overflow-hidden">
          {/* Background Tech Mesh & Gradients */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#166534]/25 rounded-full blur-[120px] pointer-events-none z-0 mix-blend-screen" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#22C55E]/15 rounded-full blur-[120px] pointer-events-none z-0 mix-blend-screen" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.1),transparent_70%)] pointer-events-none z-0" />

          <div className="max-w-4xl mx-auto space-y-6 relative z-10">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black text-[#F0FDF4] uppercase tracking-[0.2em] bg-[#166534]/30 px-3.5 py-1.5 rounded-full border border-[#22C55E]/30">
              <ShieldCheck size={11} className="text-[#22C55E]" />
              {t('legal.privacy.eyebrow', 'Trust & Transparency')}
            </span>
            <h1 className="font-display font-[800] text-4xl md:text-6xl tracking-tight text-white leading-tight">
              {t('legal.privacy.title', 'Privacy Policy')}
            </h1>
            <p className="font-sans font-normal text-stone-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed tracking-wider">
              {t('legal.updated', 'Last updated: June 30, 2026')}
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-20 px-6 max-w-4xl mx-auto">
          <div className="space-y-12">
            
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                {t('legal.privacy.introduction.heading', '1. Introduction')}
              </h2>
              <p className="text-slate-600 text-sm leading-[1.9]">
                {t('legal.privacy.introduction.body')}
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                {t('legal.privacy.collection.heading', '2. Information We Collect')}
              </h2>
              <p className="text-slate-600 text-sm leading-[1.9] mb-2">
                {t('legal.privacy.collection.introduction')}
              </p>
              <ul className={cn("list-disc text-slate-600 text-sm space-y-2.5", isRtl ? "pr-5 pl-0" : "pl-5 pr-0")}>
                <li>{t('legal.privacy.collection.account_data')}</li>
                <li>{t('legal.privacy.collection.integration_settings')}</li>
                <li>{t('legal.privacy.collection.database_syncs')}</li>
                <li>{t('legal.privacy.collection.usage_data')}</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                {t('legal.privacy.use.heading', '3. How We Use Your Information')}
              </h2>
              <p className="text-slate-600 text-sm leading-[1.9] mb-2">
                {t('legal.privacy.use.introduction')}
              </p>
              <ul className={cn("list-disc text-slate-600 text-sm space-y-2.5", isRtl ? "pr-5 pl-0" : "pl-5 pr-0")}>
                <li>{t('legal.privacy.use.messaging')}</li>
                <li>{t('legal.privacy.use.sync')}</li>
                <li>{t('legal.privacy.use.diagnostics')}</li>
                <li>{t('legal.privacy.use.billing')}</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                {t('legal.privacy.security.heading', '4. Data Retention & Security')}
              </h2>
              <p className="text-slate-600 text-sm leading-[1.9]">
                {t('legal.privacy.security.body')}
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                {t('legal.privacy.third_parties.heading', '5. Third-Party Service Integrations')}
              </h2>
              <p className="text-slate-600 text-sm leading-[1.9]">
                {t('legal.privacy.third_parties.body')}
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                {t('legal.privacy.changes.heading', '6. Changes to This Policy')}
              </h2>
              <p className="text-slate-600 text-sm leading-[1.9]">
                {t('legal.privacy.changes.body')}
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                {t('legal.privacy.contact.heading', '7. Contact Information')}
              </h2>
              <p className="text-slate-600 text-sm leading-[1.9]">
                {t('legal.privacy.contact.body')}
              </p>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export function TermsPage() {
  useScrollToTop();
  const { t, isRtl } = useI18n();

  return (
    <div 
      className={cn(
        "bg-white text-slate-900 min-h-screen selection:bg-[#166534]/20 selection:text-[#166534] font-sans overflow-x-hidden",
        isRtl && "text-right"
      )}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <Navbar />

      <main>
        {/* Hero Header */}
        <section className="pt-48 pb-36 px-6 bg-[#12263A] text-white text-center relative overflow-hidden">
          {/* Background Tech Mesh & Gradients */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#166534]/25 rounded-full blur-[120px] pointer-events-none z-0 mix-blend-screen" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#22C55E]/15 rounded-full blur-[120px] pointer-events-none z-0 mix-blend-screen" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.1),transparent_70%)] pointer-events-none z-0" />

          <div className="max-w-4xl mx-auto space-y-6 relative z-10">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black text-[#F0FDF4] uppercase tracking-[0.2em] bg-[#166534]/30 px-3.5 py-1.5 rounded-full border border-[#22C55E]/30">
              <Scale size={11} className="text-[#22C55E]" />
              {t('legal.terms.eyebrow', 'User Agreement')}
            </span>
            <h1 className="font-display font-[800] text-4xl md:text-6xl tracking-tight text-white leading-tight">
              {t('legal.terms.title', 'Terms & Conditions')}
            </h1>
            <p className="font-sans font-normal text-stone-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed tracking-wider">
              {t('legal.updated', 'Last updated: June 30, 2026')}
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-20 px-6 max-w-4xl mx-auto">
          <div className="space-y-12">

            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                {t('legal.terms.agreement.heading', '1. Agreement to Terms')}
              </h2>
              <p className="text-slate-600 text-sm leading-[1.9]">
                {t('legal.terms.agreement.body')}
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                {t('legal.terms.scope.heading', '2. Scope of Service')}
              </h2>
              <p className="text-slate-600 text-sm leading-[1.9]">
                {t('legal.terms.scope.body')}
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                {t('legal.terms.responsibilities.heading', '3. User Responsibilities & Acceptable Use')}
              </h2>
              <p className="text-slate-600 text-sm leading-[1.9] mb-2">
                {t('legal.terms.responsibilities.introduction')}
              </p>
              <ul className={cn("list-disc text-slate-600 text-sm space-y-2.5", isRtl ? "pr-5 pl-0" : "pl-5 pr-0")}>
                <li>{t('legal.terms.responsibilities.opt_in')}</li>
                <li>{t('legal.terms.responsibilities.spam')}</li>
                <li>{t('legal.terms.responsibilities.data')}</li>
                <li>{t('legal.terms.responsibilities.credentials')}</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                {t('legal.terms.billing.heading', '4. Fees, Plans, & Billing')}
              </h2>
              <p className="text-slate-600 text-sm leading-[1.9]">
                {t('legal.terms.billing.body')}
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                {t('legal.terms.ip.heading', '5. Intellectual Property')}
              </h2>
              <p className="text-slate-600 text-sm leading-[1.9]">
                {t('legal.terms.ip.body')}
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                {t('legal.terms.liability.heading', '6. Limitation of Liability')}
              </h2>
              <p className="text-slate-600 text-sm leading-[1.9]">
                {t('legal.terms.liability.body')}
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                {t('legal.terms.termination.heading', '7. Account Termination')}
              </h2>
              <p className="text-slate-600 text-sm leading-[1.9]">
                {t('legal.terms.termination.body')}
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                {t('legal.terms.disputes.heading', '8. Legal Disputes')}
              </h2>
              <p className="text-slate-600 text-sm leading-[1.9]">
                {t('legal.terms.disputes.body')}
              </p>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
