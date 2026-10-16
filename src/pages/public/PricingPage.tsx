import React, { useEffect } from 'react';
import Navbar from '../../components/public/Navbar';
import Footer from '../../components/public/Footer';
import { Pricing, FAQ, FinalCTA } from '../../components/public/LandingSections';

export default function PricingPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-white text-slate-900 min-h-screen selection:bg-brand/20 selection:text-brand-dark overflow-x-hidden">
      <Navbar />
      <main>
        <section className="pt-48 pb-36 px-6 bg-[#12263A] text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.15),transparent_60%)] pointer-events-none" />
          <div className="max-w-4xl mx-auto space-y-6 relative z-10">
            <span className="text-[10px] font-black text-[#22C55E] uppercase tracking-[0.2em] bg-[#166534]/20 px-3.5 py-1.5 rounded-full border border-[#22C55E]/30">Simple & Transparent</span>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">Flexible Plans for Every Scale</h1>
            <p className="text-slate-300 font-medium text-sm md:text-base max-w-xl mx-auto leading-relaxed">No hidden fees, no complex setups. Connect your phone number ID and start sending campaigns instantly.</p>
          </div>
        </section>

        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
