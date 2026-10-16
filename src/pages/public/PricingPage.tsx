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
          {/* Background Tech Mesh & Gradients */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#166534]/25 rounded-full blur-[120px] pointer-events-none z-0 mix-blend-screen" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#22C55E]/15 rounded-full blur-[120px] pointer-events-none z-0 mix-blend-screen" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.1),transparent_70%)] pointer-events-none z-0" />

          <div className="max-w-4xl mx-auto space-y-6 relative z-10">
            <span className="text-[10px] font-black text-[#F0FDF4] uppercase tracking-[0.2em] bg-[#166534]/30 px-3.5 py-1.5 rounded-full border border-[#22C55E]/30">Simple & Transparent</span>
            <h1 className="font-display font-[800] text-4xl md:text-6xl tracking-tight text-white">Flexible Plans for Every Scale</h1>
            <p className="font-sans font-normal text-stone-300 text-sm md:text-base max-w-xl mx-auto leading-relaxed">No hidden fees, no complex setups. Connect your phone number ID and start sending campaigns instantly.</p>
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
