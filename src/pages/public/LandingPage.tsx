import React from 'react';
import Navbar from '../../components/public/Navbar';
import { Hero, Features, Pricing } from '../../components/public/LandingSections';
import { MessageSquare, Twitter, Github, Linkedin } from 'lucide-react';
import { motion } from 'motion/react';

export default function LandingPage() {
  return (
    <div className="bg-bg-surface text-white min-h-screen selection:bg-brand selection:text-black">
      <Navbar />
      
      <main>
        <Hero />
        <Features />
        
        {/* How it works simple section */}
        <section id="how-it-works" className="py-40 px-6">
           <div className="max-w-7xl mx-auto">
              <div className="text-center mb-24">
                 <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-4 leading-none">Seamless Onboarding</h2>
                 <p className="text-text-muted text-[10px] font-black uppercase tracking-[0.3em]">Start sending messages in minutes</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                 {[
                   { step: '01', title: 'Connect API', desc: 'Plug in your Meta WhatsApp Cloud token.' },
                   { step: '02', title: 'Load Contacts', desc: 'Sync from CRM or upload CSV files.' },
                   { step: '03', title: 'Pick Template', desc: 'Use verified templates for scale.' },
                   { step: '04', title: 'Launch', desc: 'Watch your engagement skyrocket.' }
                 ].map((s, i) => (
                   <div key={s.step} className="text-center group">
                      <div className="w-20 h-20 bg-bg-surface3 border border-border rounded-[2rem] flex items-center justify-center text-4xl font-black text-white/5 group-hover:text-brand/20 group-hover:border-brand/40 transition-all mx-auto mb-8 relative">
                         <span className="relative z-10 text-white/20 group-hover:text-brand">{s.step}</span>
                         <div className="absolute inset-2 bg-brand/5 border border-brand/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-3">{s.title}</h3>
                      <p className="text-text-muted text-[10px] font-bold uppercase tracking-tight leading-relaxed">{s.desc}</p>
                   </div>
                 ))}
              </div>
           </div>
        </section>

        <Pricing />
      </main>

      <footer className="py-20 px-6 border-t border-border bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-8">
                <div className="w-10 h-10 bg-brand text-black rounded-xl flex items-center justify-center">
                  <MessageSquare size={24} strokeWidth={3} />
                </div>
                <span className="text-2xl font-black text-white uppercase tracking-tighter">throbtech</span>
              </div>
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] leading-relaxed">
                The enterprise-grade WhatsApp marketing engine for teams who value speed, automation, and real-time engagement.
              </p>
            </div>
            
            <div>
              <h4 className="text-[10px] font-black text-brand uppercase tracking-[0.3em] mb-8">Product</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-[10px] font-black text-white uppercase tracking-widest hover:text-brand transition-colors">Inbox</a></li>
                <li><a href="#" className="text-[10px] font-black text-white uppercase tracking-widest hover:text-brand transition-colors">Campaigns</a></li>
                <li><a href="#" className="text-[10px] font-black text-white uppercase tracking-widest hover:text-brand transition-colors">API Integration</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-black text-brand uppercase tracking-[0.3em] mb-8">Company</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-[10px] font-black text-white uppercase tracking-widest hover:text-brand transition-colors">About</a></li>
                <li><a href="#" className="text-[10px] font-black text-white uppercase tracking-widest hover:text-brand transition-colors">Privacy</a></li>
                <li><a href="#" className="text-[10px] font-black text-white uppercase tracking-widest hover:text-brand transition-colors">Terms</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-black text-brand uppercase tracking-[0.3em] mb-8">Social</h4>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-bg-surface3 border border-border rounded-xl flex items-center justify-center text-text-muted hover:text-brand hover:border-brand/40 transition-all">
                  <Twitter size={18} />
                </a>
                <a href="#" className="w-10 h-10 bg-bg-surface3 border border-border rounded-xl flex items-center justify-center text-text-muted hover:text-brand hover:border-brand/40 transition-all">
                  <Github size={18} />
                </a>
                <a href="#" className="w-10 h-10 bg-bg-surface3 border border-border rounded-xl flex items-center justify-center text-text-muted hover:text-brand hover:border-brand/40 transition-all">
                  <Linkedin size={18} />
                </a>
              </div>
            </div>
          </div>

          <div className="pt-10 border-t border-border flex flex-col md:flex-row items-center justify-between gap-6 opacity-30">
            <p className="text-[9px] font-black uppercase tracking-widest">© 2024 throbtech Technologies Inc. Built for Meta Graph API.</p>
            <p className="text-[9px] font-black uppercase tracking-widest">Made with ⚡ by throbtech Team</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
