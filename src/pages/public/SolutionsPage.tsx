import React, { useEffect } from 'react';
import Navbar from '../../components/public/Navbar';
import Footer from '../../components/public/Footer';
import { OmnichannelInbox, AIWorkflow, CRMDashboardPreview, FinalCTA } from '../../components/public/LandingSections';

export default function SolutionsPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-white text-slate-900 min-h-screen selection:bg-brand/20 selection:text-brand-dark overflow-x-hidden">
      <Navbar />
      <main>
        {/* Header decoration */}
        <section className="pt-48 pb-36 px-6 bg-slate-950 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.15),transparent_60%)] pointer-events-none" />
          <div className="max-w-4xl mx-auto space-y-6 relative z-10">
            <span className="text-[10px] font-black text-purple-400 uppercase tracking-[0.2em] bg-purple-500/10 px-3.5 py-1.5 rounded-full border border-purple-500/20">SaaS Use Cases</span>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">Custom Business Automation Solutions</h1>
            <p className="text-slate-450 font-medium text-sm md:text-base max-w-xl mx-auto leading-relaxed">Centralize your social planner calendars, capture lead forms from FB/IG/TikTok/Snapchat, build WhatsApp broadcast funnels, and deploy AI auto-responses.</p>
          </div>
        </section>

        <OmnichannelInbox />
        <AIWorkflow />
        <CRMDashboardPreview />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
