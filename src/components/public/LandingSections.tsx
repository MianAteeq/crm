import { 
  MessageSquare, 
  Layout, 
  Users, 
  BarChart3, 
  Zap, 
  ShieldCheck, 
  Layers,
  Send
} from 'lucide-react';
import { motion } from 'motion/react';
import { NavLink } from 'react-router-dom';
import { cn } from '../../lib/utils';

export function Hero() {
  return (
    <section className="relative pt-48 pb-32 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto text-center relative z-10">
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-full mb-10"
        >
           <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
           <span className="text-xs font-bold text-slate-600 tracking-tight">API v2.4 Platform Now Live</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-6xl md:text-8xl font-black text-slate-900 tracking-tight mb-8 leading-[0.9] lowercase"
        >
          Scale your reach.<br />
          Automate <span className="text-brand italic">meaningfully.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto text-slate-500 font-medium text-lg md:text-xl mb-12 leading-relaxed"
        >
          The next-generation WhatsApp marketing engine for high-performance teams. 
          Unify your inbox, launch massive campaigns, and build deep customer relationships at scale.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <NavLink
            to="/register"
            className="w-full sm:w-auto px-10 py-5 bg-slate-900 text-white font-bold rounded-2xl transition-all hover:bg-slate-800 active:scale-95 shadow-lg shadow-slate-200 text-sm"
          >
            Start Campaign Free
          </NavLink>
          <button className="w-full sm:w-auto px-10 py-5 bg-white border border-slate-200 text-slate-600 font-bold rounded-2xl transition-all hover:bg-slate-50 active:scale-95 text-sm">
            Book a Demo
          </button>
        </motion.div>
      </div>

      {/* Decorative Blob */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] -z-10 pointer-events-none opacity-40">
         <div className="absolute top-[-100px] left-[-200px] w-96 h-96 bg-brand/20 rounded-full blur-[120px]" />
         <div className="absolute top-[100px] right-[-200px] w-96 h-96 bg-blue-100 rounded-full blur-[120px]" />
      </div>
    </section>
  );
}

const features = [
  { icon: MessageSquare, title: 'Unified Inbox', desc: 'Manage all your customer conversations in one powerful enterprise-grade interface. Seamlessly across teams.' },
  { icon: Send, title: 'Mass Broadcast', desc: 'Launch massive campaigns to thousands of contacts with a single click. High delivery rates guaranteed.' },
  { icon: Users, title: 'CRM Integration', desc: 'Sync your existing customer data from Salesforce, HubSpot, or Shopify instantly. Keep your source of truth.' },
  { icon: BarChart3, title: 'Deep Analytics', desc: 'Track reach, delivery rates, and conversion metrics with pixel-perfect accuracy. Real-time reporting engine.' },
  { icon: Zap, title: 'Automation', desc: 'Build zero-code automation flows that handle everything from support to sales. Reduce your operational load.' },
  { icon: ShieldCheck, title: 'Meta Verified', desc: 'Built on the official Meta Graph API ensuring 100% compliance and stability for your brand assets.' },
];

export function Features() {
  return (
    <section id="features" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
           <span className="text-[10px] font-bold text-brand uppercase tracking-[0.3em] bg-brand/5 px-4 py-1.5 rounded-full border border-brand/10">Capabilities</span>
           <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mt-6 leading-tight">Built for the high-end <br className="hidden md:block"/> marketing era</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-10 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:shadow-slate-100 transition-all group"
            >
              <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-brand group-hover:bg-brand/5 group-hover:border-brand/20 transition-all mb-8">
                <f.icon size={26} strokeWidth={2} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">{f.title}</h3>
              <p className="text-slate-500 font-medium text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Pricing() {
  return (
    <section id="pricing" className="py-32 px-6">
       <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
             <h2 className="text-4xl font-bold text-slate-900 tracking-tight mb-4">Scalable Pricing</h2>
             <p className="text-slate-500 font-medium">Simple plans for high-growth automated teams.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {[
               { name: 'Starter', price: '$0', features: ['1,000 Contacts', 'Basic Analytics', 'Standard Support', '5 Automation Flows'], highlighted: false },
               { name: 'Professional', price: '$49', features: ['10,000 Contacts', 'Advanced Flows', 'Priority 24/7 Support', 'CRM Integration'], highlighted: true },
               { name: 'Enterprise', price: 'Custom', features: ['Unlimited Contacts', 'Meta Verification', 'Dedicated Manager', 'API Access'], highlighted: false }
             ].map((plan) => (
               <div key={plan.name} className={cn(
                 "p-12 rounded-[3.5rem] border flex flex-col transition-all",
                 plan.highlighted ? "bg-slate-900 text-white border-slate-900 shadow-2xl scale-105 z-10" : "bg-white border-slate-200 text-slate-900"
               )}>
                  <h3 className={cn("text-xs font-bold uppercase tracking-[0.3em] mb-4", plan.highlighted ? "text-brand" : "text-slate-400")}>{plan.name}</h3>
                  <div className="flex items-baseline gap-2 mb-10">
                     <span className="text-5xl font-black tracking-tight">{plan.price}</span>
                     {plan.price !== 'Custom' && <span className={cn("text-xs font-medium uppercase", plan.highlighted ? "text-slate-400" : "text-slate-400")}>/mo</span>}
                  </div>
                  <ul className="space-y-4 mb-12 flex-1">
                     {plan.features.map(f => (
                       <li key={f} className="flex items-center gap-3 text-sm font-medium opacity-80">
                          <div className={cn("w-1.5 h-1.5 rounded-full", plan.highlighted ? "bg-brand" : "bg-slate-900")} />
                          {f}
                       </li>
                     ))}
                  </ul>
                  <button className={cn(
                    "w-full py-5 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all active:scale-95",
                    plan.highlighted 
                      ? "bg-brand text-black hover:bg-white hover:text-black" 
                      : "bg-slate-900 text-white hover:bg-slate-800"
                  )}>
                    Get Started
                  </button>
               </div>
             ))}
          </div>
       </div>
    </section>
  );
}
