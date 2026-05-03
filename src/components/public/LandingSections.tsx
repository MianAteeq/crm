import React from 'react';
import { motion } from 'motion/react';
import { Shield, Zap, TrendingUp, Users, MessageSquare, Layout, Activity, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  { icon: MessageSquare, title: "Smart Inbox", desc: "One powerful interface for all your customer conversations with multi-agent support." },
  { icon: Layout, title: "Campaign Builder", desc: "Create and schedule high-engagement WhatsApp campaigns with visual builder." },
  { icon: Shield, title: "Meta API Secure", desc: "Fully compliant with WhatsApp Cloud API rules. Secure and enterprise-grade." },
  { icon: Zap, title: "Instant Automation", desc: "Automate replies, sequences, and workflow triggers without a single line of code." },
  { icon: Users, title: "Team Collaboration", desc: "Assign conversations, add internal notes, and track team performance metrics." },
  { icon: Activity, title: "Real-time Analytics", desc: "Detailed insights into delivery, open rates, and conversion metrics." }
];

const pricing = [
  { name: "Starter", price: "$29", desc: "Perfect for small businesses", features: ["1,000 Contacts", "Standard API", "Single Agent", "Basic Templates"] },
  { name: "Pro", price: "$99", desc: "Most popular for growth", features: ["10,000 Contacts", "Priority API", "Unlimited Agents", "Dynamic Variables", "API Access"], recommended: true },
  { name: "Enterprise", price: "Custom", desc: "For large scale operations", features: ["Unlimited Contacts", "Dedicated Support", "Custom Integration", "SLA Guarantee", "White Label"] }
];

export const Hero = () => (
  <section className="pt-40 pb-20 px-6 relative overflow-hidden">
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-brand/5 blur-[120px] rounded-full -z-10" />
    
    <div className="max-w-7xl mx-auto text-center">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-2 px-6 py-2 bg-brand/10 border border-brand/20 rounded-full text-[10px] font-black text-brand uppercase tracking-[0.2em] mb-10"
      >
        <Rocket size={14} /> WhatsApp Cloud API v18.0 Powered
      </motion.div>

      <motion.h1 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter leading-[0.9] mb-10"
      >
        Automate your <br />
        <span className="text-brand">WhatsApp Scale</span>
      </motion.h1>

      <motion.p 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-xl md:text-2xl font-medium text-text-muted max-w-2xl mx-auto mb-16 uppercase tracking-tight"
      >
        Send targeted campaigns, manage customer inquiries, and automate your entire sales funnel on the world's most popular messaging app.
      </motion.p>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col md:flex-row items-center justify-center gap-6"
      >
        <Link to="/signup" className="w-full md:w-auto px-12 py-6 bg-brand text-black text-xs font-black uppercase tracking-widest rounded-2xl hover:brightness-110 transition-all shadow-[0_20px_50px_rgba(40,_255,_191,_0.3)]">
          Get Started For Free
        </Link>
        <button className="w-full md:w-auto px-12 py-6 bg-bg-surface3 border border-border text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:border-brand/40 transition-all">
          Book a 1:1 Demo
        </button>
      </motion.div>

      {/* Dashboard Preview */}
      <motion.div 
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="mt-32 relative mx-auto max-w-5xl group"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-brand/50 to-blue-500/50 rounded-[3rem] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-1000" />
        <div className="relative bg-bg-surface border border-white/10 rounded-[2.5rem] p-4 shadow-2xl overflow-hidden aspect-video">
           <div className="w-full h-full bg-black/40 rounded-2xl border border-white/5 flex items-center justify-center">
              <div className="text-center opacity-40 group-hover:opacity-80 transition-opacity">
                 <Activity size={80} className="text-brand mx-auto mb-4 animate-pulse" />
                 <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Live Dashboard Preview</p>
              </div>
           </div>
        </div>
      </motion.div>
    </div>
  </section>
);

export const Features = () => (
  <section id="features" className="py-40 px-6 bg-black/20">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-24">
        <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-4 leading-none">Built for Scale</h2>
        <p className="text-text-muted text-[10px] font-black uppercase tracking-[0.3em]">Advanced Features • Seamless Integration</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((f, i) => (
          <motion.div 
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="p-10 bg-bg-surface border border-border rounded-[2.5rem] hover:border-brand/40 transition-all group"
          >
            <div className="w-16 h-16 bg-bg-surface3 border border-border rounded-2xl flex items-center justify-center text-text-muted group-hover:text-brand group-hover:border-brand/20 transition-all mb-8">
              <f.icon size={32} />
            </div>
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">{f.title}</h3>
            <p className="text-text-muted text-sm font-medium leading-relaxed uppercase tracking-tight">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export const Pricing = () => (
  <section id="pricing" className="py-40 px-6">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-24">
        <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-4 leading-none">Simple, Transparent Pricing</h2>
        <p className="text-text-muted text-[10px] font-black uppercase tracking-[0.3em]">No hidden fees • Cancel anytime</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {pricing.map((p, i) => (
          <motion.div 
            key={p.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={`p-12 rounded-[3rem] border flex flex-col relative ${
              p.recommended 
                ? 'bg-brand/5 border-brand shadow-[0_0_50px_rgba(40,_255,_191,_0.05)] pt-20' 
                : 'bg-bg-surface border-border'
            }`}
          >
            {p.recommended && (
              <div className="absolute top-8 left-1/2 -translate-x-1/2 px-6 py-2 bg-brand text-black text-[9px] font-black uppercase tracking-widest rounded-full">
                Most Popular
              </div>
            )}
            <h3 className="text-[12px] font-black text-text-muted uppercase tracking-[0.3em] mb-4">{p.name}</h3>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-5xl font-black text-white tracking-tighter">{p.price}</span>
              {p.name !== 'Enterprise' && <span className="text-text-muted font-bold uppercase tracking-tight text-sm">/month</span>}
            </div>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-10">{p.desc}</p>
            
            <div className="space-y-4 mb-12 flex-1">
              {p.features.map(f => (
                <div key={f} className="flex items-center gap-3 text-[11px] font-bold text-white/80 uppercase">
                  <TrendingUp size={14} className="text-brand" /> {f}
                </div>
              ))}
            </div>

            <Link to="/signup" className={`w-full py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center transition-all ${
              p.recommended ? 'bg-brand text-black hover:brightness-110' : 'bg-bg-surface3 text-white border border-border hover:border-brand/40'
            }`}>
              {p.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
