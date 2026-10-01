import React, { useEffect } from 'react';
import Navbar from '../../components/public/Navbar';
import Footer from '../../components/public/Footer';
import { OmnichannelInbox, FinalCTA } from '../../components/public/LandingSections';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export default function IntegrationsPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const integrations = [
    { name: 'Meta Cloud API', type: 'Official WhatsApp Engine', desc: 'Secure connection directly to Meta servers with zero local hosting requirements.' },
    { name: 'HubSpot CRM', type: 'Two-way Profile Syncing', desc: 'Instantly push active WhatsApp conversation logs to HubSpot contact lists.' },
    { name: 'Salesforce Connect', type: 'Pipeline Progression Sync', desc: 'Map sales deals and contacts to CRM pipeline stages dynamically.' },
    { name: 'Zapier App', type: 'Multi-system Automation', desc: 'Trigger text messaging workflows based on 5000+ external apps.' },
    { name: 'Shopify Store', type: 'Abandoned Cart recovery', desc: 'Retrieve checkouts and trigger automated follow-ups via WhatsApp.' },
    { name: 'Slack Alerts', type: 'Agent Notification Center', desc: 'Ping support groups when high-priority WhatsApp queries arrive.' }
  ];

  return (
    <div className="bg-white text-slate-900 min-h-screen selection:bg-brand/20 selection:text-brand-dark overflow-x-hidden">
      <Navbar />
      <main>
        {/* Header decoration */}
        <section className="pt-48 pb-36 px-6 bg-slate-950 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.15),transparent_60%)] pointer-events-none" />
          <div className="max-w-4xl mx-auto space-y-6 relative z-10">
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] bg-indigo-500/10 px-3.5 py-1.5 rounded-full border border-indigo-500/20">Extensible Ecosystem</span>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">Connected Integrations</h1>
            <p className="text-slate-450 font-medium text-sm md:text-base max-w-xl mx-auto leading-relaxed">Map lead capture tools, import contact spreadsheets, or build external trigger actions using our robust webhook suite.</p>
          </div>
        </section>

        <OmnichannelInbox />

        {/* Custom Integration grid */}
        <section className="py-32 px-6 bg-slate-50/50">
          <div className="max-w-7xl mx-auto space-y-16">
            <div className="text-center max-w-xl mx-auto space-y-4">
              <span className="text-[10px] font-black text-indigo-650 uppercase tracking-[0.2em] bg-indigo-50 px-3.5 py-1.5 rounded-full border border-indigo-100/50">Developer Suite</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Supported Platforms & Channels</h2>
              <p className="text-slate-500 font-medium text-sm">Throb syncs customer profiles and deals directly with your sales pipeline without code.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {integrations.map((int) => (
                <div key={int.name} className="p-8 bg-white border border-slate-150 rounded-3xl hover:border-slate-350 transition-colors flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-indigo-650 uppercase tracking-wider bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full">{int.type}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-905 tracking-tight">{int.name}</h3>
                    <p className="text-slate-500 font-medium text-xs leading-relaxed">{int.desc}</p>
                  </div>
                  <div className="pt-6 mt-6 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400 font-bold">
                    <span>Integration status: Verified API</span>
                    <a href="#contact" className="text-indigo-655 hover:underline flex items-center gap-1">Docs <ArrowRight size={10} /></a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
