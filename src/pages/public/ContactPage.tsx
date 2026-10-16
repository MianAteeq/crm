import React, { useEffect, useState } from 'react';
import Navbar from '../../components/public/Navbar';
import Footer from '../../components/public/Footer';
import { FAQ } from '../../components/public/LandingSections';
import { Mail, MessageCircle, Phone, ArrowRight, ShieldCheck } from 'lucide-react';
import { toast } from '../../components/ui/Toast';

export default function ContactPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Required Fields', 'Please complete the form before submitting.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Form Received', 'Our support representatives will follow up within 2 hours.');
      setForm({ name: '', email: '', company: '', message: '' });
    }, 1000);
  };

  return (
    <div className="bg-white text-slate-900 min-h-screen selection:bg-brand/20 selection:text-brand-dark overflow-x-hidden">
      <Navbar />
      <main>
        {/* Header decoration */}
        <section className="pt-48 pb-36 px-6 bg-slate-950 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.15),transparent_60%)] pointer-events-none" />
          <div className="max-w-4xl mx-auto space-y-6 relative z-10">
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] bg-indigo-500/10 px-3.5 py-1.5 rounded-full border border-indigo-500/20">Talk to Support</span>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">Contact Sales & Support Team</h1>
            <p className="text-slate-450 font-medium text-sm md:text-base max-w-xl mx-auto leading-relaxed">Book a live configuration sandbox run or contact technical support for custom API deployments.</p>
          </div>
        </section>

        {/* Contact panel layout */}
        <section className="py-32 px-6 relative">
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-indigo-50/40 -skew-x-12 transform origin-top-right pointer-events-none" />
          
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 relative z-10 items-center">
            
            {/* Left Column: Support Cards */}
            <div className="lg:col-span-5 space-y-10 text-left">
              <div>
                <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-4 py-2 rounded-full inline-block mb-6 shadow-sm border border-indigo-100/50">Office Channels</span>
                <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
                  Let's build something <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#12263A] to-[#166534]">great together.</span>
                </h2>
                <p className="text-slate-500 font-medium text-base mt-5 leading-relaxed">
                  Our support desk is online 24/7. Reach out via email, phone, or live WhatsApp to resolve account setup issues and configure your automations.
                </p>
              </div>
              
              <div className="space-y-4 pt-2">
                <a href="mailto:support@talkinexx.com" className="group flex items-center gap-5 p-5 rounded-2xl border border-slate-200/60 bg-white/60 backdrop-blur-sm hover:bg-white hover:border-indigo-200 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-900/5 cursor-pointer">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                    <Mail size={24} strokeWidth={2} />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block mb-1">Email Outreach</span>
                    <span className="text-[15px] font-extrabold text-slate-800 transition-colors">support@talkinexx.com</span>
                  </div>
                </a>

                <a href="https://wa.me/15559855298" target="_blank" rel="noreferrer" className="group flex items-center gap-5 p-5 rounded-2xl border border-slate-200/60 bg-white/60 backdrop-blur-sm hover:bg-white hover:border-emerald-200 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-900/5 cursor-pointer">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 bg-emerald-50 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                    <MessageCircle size={24} strokeWidth={2} />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block mb-1">WhatsApp Live Chat</span>
                    <span className="text-[15px] font-extrabold text-slate-800 transition-colors">+1 (555) 985-5298</span>
                  </div>
                </a>

                <div className="flex items-center gap-5 p-5 rounded-2xl border border-slate-200/60 bg-white/60 backdrop-blur-sm">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 bg-purple-50 text-purple-600">
                    <ShieldCheck size={24} strokeWidth={2} />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block mb-1">SLA Guarantee</span>
                    <span className="text-[15px] font-extrabold text-slate-800">99.9% Server Uptime</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Contact form */}
            <div className="lg:col-span-7 relative group">
              {/* Form background glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#12263A] via-[#166534] to-[#22C55E] rounded-[3rem] blur-xl opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              
              <form onSubmit={handleSubmit} className="relative p-8 md:p-12 bg-white/90 backdrop-blur-xl ring-1 ring-slate-900/5 shadow-2xl rounded-[2.5rem] space-y-8">
                <div>
                  <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Drop us a line</h3>
                  <p className="text-slate-500 text-sm mt-2 font-medium">Fill out the form below and we'll get back to you shortly.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2.5 text-left">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">Full Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. John Doe" 
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full h-12 px-4 bg-white border border-slate-200/80 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 shadow-sm"
                    />
                  </div>
                  <div className="space-y-2.5 text-left">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">Work Email</label>
                    <input 
                      type="email" 
                      placeholder="name@company.com" 
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full h-12 px-4 bg-white border border-slate-200/80 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 shadow-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2.5 text-left">
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">Company Name (Optional)</label>
                  <input 
                    type="text" 
                    placeholder="Talkinexx LLC" 
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    className="w-full h-12 px-4 bg-white border border-slate-200/80 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 shadow-sm"
                  />
                </div>

                <div className="space-y-2.5 text-left">
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">Your Message</label>
                  <textarea 
                    rows={4}
                    placeholder="Describe your outreach campaign details or request support help..." 
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full p-4 bg-white border border-slate-200/80 rounded-2xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none leading-relaxed placeholder:text-slate-400 shadow-sm"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full h-14 bg-gradient-to-r from-[#12263A] to-[#166534] hover:from-[#0a1826] hover:to-[#14532d] text-white font-bold rounded-xl transition-all active:scale-95 text-sm uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-lg shadow-[#12263A]/25"
                >
                  {loading ? 'Submitting Form...' : 'Send Message'} <ArrowRight size={16} />
                </button>
              </form>
            </div>

          </div>
        </section>

        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
