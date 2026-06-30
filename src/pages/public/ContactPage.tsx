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
    <div className="bg-white text-slate-900 min-h-screen selection:bg-brand/20 selection:text-brand-dark overflow-x-hidden pt-24">
      <Navbar />
      <main>
        {/* Header decoration */}
        <section className="py-20 px-6 bg-slate-950 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.15),transparent_60%)] pointer-events-none" />
          <div className="max-w-4xl mx-auto space-y-6 relative z-10">
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] bg-indigo-500/10 px-3.5 py-1.5 rounded-full border border-indigo-500/20">Talk to Support</span>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">Contact Sales & Support Team</h1>
            <p className="text-slate-450 font-medium text-sm md:text-base max-w-xl mx-auto leading-relaxed">Book a live configuration sandbox run or contact technical support for custom API deployments.</p>
          </div>
        </section>

        {/* Contact panel layout */}
        <section className="py-32 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* Left Column: Support Cards */}
            <div className="lg:col-span-5 space-y-8 text-left">
              <span className="text-[10px] font-black text-indigo-655 uppercase tracking-[0.2em] bg-indigo-50 px-3.5 py-1.5 rounded-full border border-indigo-100/50">Office channels</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">Get connected instantly</h2>
              <p className="text-slate-500 font-medium text-sm leading-relaxed">Our support desk is online 24/7. Reach out via email, phone, or live WhatsApp to resolve account setup issues.</p>
              
              <div className="space-y-4 pt-4">
                <div className="p-5 bg-slate-50 border border-slate-150 rounded-2xl flex items-center gap-4">
                  <div className="w-10 h-10 bg-indigo-50 border border-indigo-100 text-indigo-650 rounded-xl flex items-center justify-center shrink-0">
                    <Mail size={18} strokeWidth={2.5} />
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-slate-450 font-bold block mb-1">Email Outreach</span>
                    <a href="mailto:support@throbtech.com" className="text-sm font-extrabold text-slate-900 hover:underline">support@throbtech.com</a>
                  </div>
                </div>

                <div className="p-5 bg-slate-50 border border-slate-155 rounded-2xl flex items-center gap-4">
                  <div className="w-10 h-10 bg-emerald-50 border border-emerald-100 text-emerald-500 rounded-xl flex items-center justify-center shrink-0">
                    <MessageCircle size={18} strokeWidth={2.5} />
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-slate-455 font-bold block mb-1">WhatsApp Live Chat</span>
                    <a href="https://wa.me/15559855298" target="_blank" rel="noreferrer" className="text-sm font-extrabold text-slate-905 hover:underline">+1 (555) 985-5298</a>
                  </div>
                </div>

                <div className="p-5 bg-slate-50 border border-slate-155 rounded-2xl flex items-center gap-4">
                  <div className="w-10 h-10 bg-indigo-50 border border-indigo-100 text-indigo-650 rounded-xl flex items-center justify-center shrink-0">
                    <ShieldCheck size={18} strokeWidth={2.5} />
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-slate-455 font-bold block mb-1">SLA Guarantee</span>
                    <span className="text-sm font-extrabold text-slate-905 block">99.9% Server Uptime</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Contact form */}
            <div className="lg:col-span-7">
              <form onSubmit={handleSubmit} className="p-8 md:p-12 bg-white border border-slate-200 shadow-xl rounded-[2.5rem] space-y-6">
                <h3 className="text-lg font-extrabold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-4">Submit Query Form</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 text-left">
                    <label className="text-[10px] font-black text-slate-450 uppercase tracking-widest block">Full Name</label>
                    <input 
                      type="text" 
                      placeholder="A Ahmad" 
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:bg-white focus:border-indigo-600 transition-colors"
                    />
                  </div>
                  <div className="space-y-2 text-left">
                    <label className="text-[10px] font-black text-slate-450 uppercase tracking-widest block">Work Email</label>
                    <input 
                      type="email" 
                      placeholder="name@company.com" 
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:bg-white focus:border-indigo-600 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-black text-slate-450 uppercase tracking-widest block">Company Name (Optional)</label>
                  <input 
                    type="text" 
                    placeholder="ThrobTech LLC" 
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:bg-white focus:border-indigo-600 transition-colors"
                  />
                </div>

                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-black text-slate-450 uppercase tracking-widest block">Your Message</label>
                  <textarea 
                    rows={4}
                    placeholder="Describe your outreach campaign details or request support help..." 
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:bg-white focus:border-indigo-600 transition-colors resize-none leading-relaxed"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-2xl transition-all active:scale-95 text-xs uppercase tracking-widest flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Submitting Form...' : 'Send Message'} <ArrowRight size={14} />
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
