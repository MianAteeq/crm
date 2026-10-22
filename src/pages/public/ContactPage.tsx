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
        <section className="pt-48 pb-36 px-6 bg-[#12263A] text-white text-center relative overflow-hidden">
          {/* Background Tech Mesh & Gradients */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#166534]/25 rounded-full blur-[120px] pointer-events-none z-0 mix-blend-screen" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#22C55E]/15 rounded-full blur-[120px] pointer-events-none z-0 mix-blend-screen" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.1),transparent_70%)] pointer-events-none z-0" />

          <div className="max-w-4xl mx-auto space-y-6 relative z-10">
            <span className="text-[10px] font-black text-[#F0FDF4] uppercase tracking-[0.2em] bg-[#166534]/30 px-3.5 py-1.5 rounded-full border border-[#22C55E]/30">Talk to Support</span>
            <h1 className="font-display font-[800] text-4xl md:text-6xl tracking-tight text-white">Contact Sales & Support Team</h1>
            <p className="font-sans font-normal text-stone-300 text-sm md:text-base max-w-xl mx-auto leading-relaxed">Book a live configuration sandbox run or contact technical support for custom API deployments.</p>
          </div>
        </section>

        {/* Contact panel layout */}
        <section className="py-24 md:py-32 px-6 relative bg-[#FAFAF9]">
          {/* Subtle background decoration */}
          <div className="absolute inset-0 bg-[radial-gradient(#166534_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none" />

          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 relative z-10 items-center">

            {/* Left Column: Support Cards */}
            <div className="lg:col-span-5 space-y-10 text-left">
              <div>
                <span className="text-[11px] font-bold text-[#166534] uppercase tracking-widest bg-[#F0FDF4] px-4 py-2 rounded-full inline-flex items-center gap-2 mb-6 shadow-sm border border-[#22C55E]/30">
                  <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
                  Office Channels
                </span>
                <h2 className="text-4xl md:text-5xl font-extrabold text-[#12263A] tracking-tight leading-[1.1]">
                  Let's build something <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#12263A] via-[#166534] to-[#22C55E]">great together.</span>
                </h2>
                <p className="text-stone-600 font-medium text-base mt-5 leading-relaxed">
                  Our support desk is online 24/7. Reach out via email, phone, or live WhatsApp to resolve account setup issues and configure your automations.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <a href="mailto:support@talkinexx.com" className="group flex items-center gap-5 p-5 rounded-2xl border border-stone-200/90 bg-white hover:border-[#22C55E]/50 transition-all duration-300 hover:shadow-xl hover:shadow-black/5 hover:-translate-y-0.5 cursor-pointer">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 bg-[#0a1826] text-[#86efac] group-hover:bg-[#166534] group-hover:text-white transition-all duration-300 shadow-sm">
                    <Mail size={24} strokeWidth={2} />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold block mb-1">Email Outreach</span>
                    <span className="text-[15px] font-extrabold text-[#12263A] transition-colors group-hover:text-[#166534]">support@talkinexx.com</span>
                  </div>
                </a>

                <a href="https://wa.me/+923314547089" target="_blank" rel="noreferrer" className="group flex items-center gap-5 p-5 rounded-2xl border border-stone-200/90 bg-white hover:border-[#22C55E]/50 transition-all duration-300 hover:shadow-xl hover:shadow-[#22C55E]/10 hover:-translate-y-0.5 cursor-pointer">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 bg-[#F0FDF4] text-[#166534] border border-[#22C55E]/30 group-hover:bg-[#22C55E] group-hover:text-white transition-all duration-300 shadow-sm">
                    <MessageCircle size={24} strokeWidth={2} />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold block mb-1">WhatsApp Live Chat</span>
                    <span className="text-[15px] font-extrabold text-[#12263A] transition-colors group-hover:text-[#166534]">+92 331 4547089</span>
                  </div>
                </a>

                <div className="flex items-center gap-5 p-5 rounded-2xl border border-stone-200/90 bg-white shadow-sm">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 bg-[#0a1826]/5 text-[#12263A] border border-stone-200">
                    <ShieldCheck size={24} strokeWidth={2} className="text-[#166534]" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold block mb-1">SLA Guarantee</span>
                    <span className="text-[15px] font-extrabold text-[#12263A]">99.9% Server Uptime</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Contact form */}
            <div className="lg:col-span-7 relative group">
              {/* Form background glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#12263A] via-[#166534] to-[#22C55E] rounded-[3rem] blur-xl opacity-20 group-hover:opacity-30 transition duration-700 pointer-events-none" />

              <form onSubmit={handleSubmit} className="relative p-8 md:p-12 bg-white ring-1 ring-black/5 shadow-2xl rounded-[2.5rem] space-y-8">
                <div>
                  <h3 className="text-2xl font-extrabold text-[#12263A] tracking-tight">Drop us a line</h3>
                  <p className="text-stone-500 text-sm mt-2 font-medium">Fill out the form below and we'll get back to you shortly.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2.5 text-left">
                    <label className="text-[11px] font-bold text-[#12263A] uppercase tracking-wider block">Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. John Doe"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full h-12 px-4 bg-stone-50/50 border border-stone-200 rounded-xl text-sm font-medium text-[#12263A] focus:outline-none focus:ring-2 focus:ring-[#22C55E]/30 focus:border-[#22C55E] focus:bg-white transition-all placeholder:text-stone-400 shadow-sm"
                    />
                  </div>
                  <div className="space-y-2.5 text-left">
                    <label className="text-[11px] font-bold text-[#12263A] uppercase tracking-wider block">Work Email</label>
                    <input
                      type="email"
                      placeholder="name@company.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full h-12 px-4 bg-stone-50/50 border border-stone-200 rounded-xl text-sm font-medium text-[#12263A] focus:outline-none focus:ring-2 focus:ring-[#22C55E]/30 focus:border-[#22C55E] focus:bg-white transition-all placeholder:text-stone-400 shadow-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2.5 text-left">
                  <label className="text-[11px] font-bold text-[#12263A] uppercase tracking-wider block">Company Name (Optional)</label>
                  <input
                    type="text"
                    placeholder="Talkinexx LLC"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    className="w-full h-12 px-4 bg-stone-50/50 border border-stone-200 rounded-xl text-sm font-medium text-[#12263A] focus:outline-none focus:ring-2 focus:ring-[#22C55E]/30 focus:border-[#22C55E] focus:bg-white transition-all placeholder:text-stone-400 shadow-sm"
                  />
                </div>

                <div className="space-y-2.5 text-left">
                  <label className="text-[11px] font-bold text-[#12263A] uppercase tracking-wider block">Your Message</label>
                  <textarea
                    rows={4}
                    placeholder="Describe your outreach campaign details or request support help..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full p-4 bg-stone-50/50 border border-stone-200 rounded-2xl text-sm font-medium text-[#12263A] focus:outline-none focus:ring-2 focus:ring-[#22C55E]/30 focus:border-[#22C55E] focus:bg-white transition-all resize-none leading-relaxed placeholder:text-stone-400 shadow-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 bg-gradient-to-r from-[#12263A] via-[#166534] to-[#22C55E] hover:from-[#0a1826] hover:via-[#14532d] hover:to-[#16a34a] text-white font-bold rounded-xl transition-all active:scale-95 text-sm uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-lg shadow-[#12263A]/25"
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
