import React, { useEffect } from 'react';
import Navbar from '../../components/public/Navbar';
import Footer from '../../components/public/Footer';
import { Testimonials, FAQ, FinalCTA } from '../../components/public/LandingSections';
import { FileText, Play, HelpCircle, ArrowRight } from 'lucide-react';

export default function ResourcesPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const resources = [
    { icon: FileText, title: 'API Documentation', desc: 'Read code parameters, webhook payload schemas, and configuration models.', link: 'Read Docs' },
    { icon: Play, title: 'Video Onboarding Guides', desc: 'Watch step-by-step video guides to link phone number IDs and build flows.', link: 'Watch Videos' },
    { icon: HelpCircle, title: 'Knowledge base & SLA', desc: 'Find quick troubleshooting guidelines, account setups, and compliance checks.', link: 'Search Knowledge' }
  ];

  return (
    <div className="bg-white text-slate-900 min-h-screen selection:bg-brand/20 selection:text-brand-dark overflow-x-hidden">
      <Navbar />
      <main>
        {/* Header decoration */}
        <section className="pt-48 pb-36 px-6 bg-[#12263A] text-white text-center relative overflow-hidden">
          {/* Background Tech Mesh & Gradients */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#166534]/25 rounded-full blur-[120px] pointer-events-none z-0 mix-blend-screen" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#22C55E]/15 rounded-full blur-[120px] pointer-events-none z-0 mix-blend-screen" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.1),transparent_70%)] pointer-events-none z-0" />

          <div className="max-w-4xl mx-auto space-y-6 relative z-10">
            <span className="text-[10px] font-black text-[#F0FDF4] uppercase tracking-[0.2em] bg-[#166534]/30 px-3.5 py-1.5 rounded-full border border-[#22C55E]/30">Guides & Tutorials</span>
            <h1 className="font-display font-[800] text-4xl md:text-6xl tracking-tight text-white">Resources & Case Studies</h1>
            <p className="font-sans font-normal text-stone-300 text-sm md:text-base max-w-xl mx-auto leading-relaxed">Everything you need to connect WhatsApp Business API, build complex marketing campaigns, and configure automation workflows.</p>
          </div>
        </section>

        {/* Resources card grids */}
        <section className="py-32 px-6 bg-slate-50/50">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {resources.map((res) => (
              <div key={res.title} className="p-8 bg-white border border-slate-150 rounded-3xl hover:border-slate-350 transition-colors flex flex-col justify-between">
                <div className="space-y-6">
                  <div className="w-12 h-12 bg-indigo-50 border border-indigo-100/50 text-indigo-650 rounded-2xl flex items-center justify-center">
                    <res.icon size={22} strokeWidth={2.5} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-905 tracking-tight">{res.title}</h3>
                  <p className="text-slate-500 font-medium text-xs leading-relaxed">{res.desc}</p>
                </div>
                <div className="pt-6 mt-6 border-t border-slate-100">
                  <a href="#contact" className="text-xs font-bold text-indigo-655 hover:text-indigo-750 transition-colors flex items-center gap-1 uppercase tracking-wider leading-none">
                    {res.link} <ArrowRight size={12} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        <Testimonials />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
