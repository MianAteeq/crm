import React from 'react';
import Navbar from '../../components/public/Navbar';
import { Hero, Features, Pricing } from '../../components/public/LandingSections';
import { MessageSquare, Twitter, Github, Linkedin } from 'lucide-react';
import { motion } from 'motion/react';

export default function LandingPage() {
  return (
    <div className="bg-white text-slate-900 min-h-screen selection:bg-brand/20 selection:text-brand-dark">
      <Navbar />
      
      <main>
        <Hero />
        <Features />
        
        {/* How it works simple section */}
        <section id="how-it-works" className="py-32 px-6 bg-slate-50">
           <div className="max-w-7xl mx-auto">
              <div className="text-center mb-20">
                 <h2 className="text-4xl font-bold text-slate-900 tracking-tight mb-4">Seamless Onboarding</h2>
                 <p className="text-slate-500 font-medium max-w-xl mx-auto">Start sending messages in minutes with our streamlined setup process.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                 {[
                   { step: '01', title: 'Connect API', desc: 'Plug in your Meta WhatsApp Cloud token.' },
                   { step: '02', title: 'Load Contacts', desc: 'Sync from CRM or upload CSV files.' },
                   { step: '03', title: 'Pick Template', desc: 'Use verified templates for scale.' },
                   { step: '04', title: 'Launch', desc: 'Watch your engagement skyrocket.' }
                 ].map((s) => (
                   <div key={s.step} className="text-center group">
                      <div className="w-16 h-16 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-xl font-bold text-slate-900 shadow-sm group-hover:border-brand transition-all mx-auto mb-6">
                         {s.step}
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">{s.title}</h3>
                      <p className="text-slate-500 text-sm font-medium leading-relaxed">{s.desc}</p>
                   </div>
                 ))}
              </div>
           </div>
        </section>
        
        <Pricing />
      </main>

      <footer className="py-20 px-6 border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center">
                  <MessageSquare size={20} strokeWidth={2.5} />
                </div>
                <span className="text-xl font-bold text-slate-900 tracking-tight">throbtech</span>
              </div>
              <p className="text-sm font-medium text-slate-500 leading-relaxed">
                The enterprise-grade WhatsApp marketing engine for teams who value speed, automation, and real-time engagement.
              </p>
            </div>
            
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-6">Product</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-sm font-medium text-slate-500 hover:text-brand transition-colors">Inbox Hub</a></li>
                <li><a href="#" className="text-sm font-medium text-slate-500 hover:text-brand transition-colors">Campaign Engine</a></li>
                <li><a href="#" className="text-sm font-medium text-slate-500 hover:text-brand transition-colors">API Keys</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-6">Company</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-sm font-medium text-slate-500 hover:text-brand transition-colors">About Us</a></li>
                <li><a href="#" className="text-sm font-medium text-slate-500 hover:text-brand transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-sm font-medium text-slate-500 hover:text-brand transition-colors">Terms of Service</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-6">Social</h4>
              <div className="flex gap-3">
                <a href="#" className="w-9 h-9 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center text-slate-400 hover:text-brand hover:border-brand transition-all">
                  <Twitter size={16} />
                </a>
                <a href="#" className="w-9 h-9 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center text-slate-400 hover:text-brand hover:border-brand transition-all">
                  <Github size={16} />
                </a>
                <a href="#" className="w-9 h-9 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center text-slate-400 hover:text-brand hover:border-brand transition-all">
                  <Linkedin size={16} />
                </a>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs font-medium text-slate-400">© 2024 throbtech Technologies Inc. Built for Meta Graph API.</p>
            <div className="flex gap-6">
               <span className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">Secure by Design</span>
               <span className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">SLA Guarantee</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
