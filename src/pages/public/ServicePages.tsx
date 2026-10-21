import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import Navbar from '../../components/public/Navbar';
import Footer from '../../components/public/Footer';
import { 
  Send, Database, Clock, Globe, Users, Sparkles, FileText, BarChart3, 
  CheckCircle2, ArrowRight, ArrowLeft, Play, Calendar, Zap, MessageSquare
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import { useI18n } from '../../i18n';

interface ServicePageProps {
  title: string;
  subtitle: string;
  category: string;
  description: string;
  color: string;
  bullets: string[];
  mockup: React.ReactNode;
}

function ServicePageLayout({ title, subtitle, category, description, color, bullets, mockup }: ServicePageProps) {
  const { t, isRtl } = useI18n();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={cn("bg-slate-50 text-slate-900 min-h-screen selection:bg-indigo-500/20 selection:text-indigo-900 overflow-x-hidden font-sans", isRtl && "font-arabic")}>
      <Navbar />
      
      <main>
        {/* Service Hero Header */}
        <section className="pt-48 pb-36 px-6 bg-[#12263A] text-white text-center relative overflow-hidden">
          {/* Background Tech Mesh & Gradients */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#166534]/25 rounded-full blur-[120px] pointer-events-none z-0 mix-blend-screen" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#22C55E]/15 rounded-full blur-[120px] pointer-events-none z-0 mix-blend-screen" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.1),transparent_70%)] pointer-events-none z-0" />
          
          <div className="max-w-4xl mx-auto space-y-6 relative z-10 flex flex-col items-center justify-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center gap-4"
            >
              <NavLink to="/features" className="inline-flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-white uppercase tracking-[0.2em] transition-colors mb-2">
                <ArrowLeft size={14} className={cn("transition-transform", isRtl && "rotate-180")} /> {t('services.shared.back', 'Back to Services')}
              </NavLink>
              <span className="text-[10px] font-black text-[#F0FDF4] uppercase tracking-[0.2em] bg-[#166534]/30 px-3.5 py-1.5 rounded-full border border-[#22C55E]/30">
                {category}
              </span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-display font-[800] text-4xl md:text-6xl tracking-tight text-white"
            >
              {title}
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="font-sans font-normal text-stone-300 text-sm md:text-base max-w-2xl mx-auto leading-relaxed"
            >
              {subtitle}
            </motion.p>
          </div>
        </section>

        {/* Detailed Showcase Grid */}
        <section className="py-24 px-6 max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
            
            {/* Left/Right Content column */}
            <motion.div 
              initial={{ opacity: 0, x: isRtl ? 30 : -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className={cn("lg:col-span-5 space-y-10", isRtl ? "text-right" : "text-left")}
            >
              <div className="space-y-4">
                <h2 className="font-display font-[800] text-[32px] md:text-[40px] tracking-[-1px] text-slate-900 leading-[1.2]">
                  {t('services.shared.benefits_heading', 'Why High-Growth Teams Use This Tool')}
                </h2>
                <p className="text-slate-500 text-[17px] leading-[1.7] font-medium">
                  {description}
                </p>
              </div>

              {/* Bullet checklist cards */}
              <div className="space-y-4">
                {bullets.map((b, idx) => {
                  const parts = b.split(':');
                  const header = parts[0];
                  const body = parts.slice(1).join(':').trim();
                  return (
                    <motion.div 
                      key={idx} 
                      whileHover={{ scale: 1.02, x: isRtl ? -5 : 5 }}
                      className={cn(
                        "p-6 bg-white border border-slate-200/80 rounded-2xl flex items-start gap-5 hover:border-indigo-400 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300",
                        isRtl && "text-right flex-row-reverse"
                      )}
                    >
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 shadow-inner mt-1">
                        <CheckCircle2 size={20} strokeWidth={2.5} />
                      </div>
                      <div className="flex-1">
                        <span className="block text-[15px] font-bold text-slate-900 mb-1">{header}</span>
                        {body && <span className="block text-[13px] text-slate-500 leading-relaxed font-medium">{body}</span>}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Visual mockup column */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, type: "spring", bounce: 0.4 }}
              className="lg:col-span-7 flex items-center justify-center w-full h-full"
            >
              <div className="relative w-full max-w-lg mx-auto flex items-center justify-center">
                {/* Glowing backdrop for the mockup */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#12263A]/40 to-[#166534]/40 blur-2xl transform rotate-3 rounded-[3rem] -m-2" />
                <div className="relative transform hover:-translate-y-2 hover:scale-[1.02] transition-all duration-500 w-full">
                  {mockup}
                </div>
              </div>
            </motion.div>

          </div>
        </section>

        {/* Reusable CTA Block */}
        <section className="py-32 px-6 relative overflow-hidden mt-12">
          <div className="absolute inset-0 bg-slate-900" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.25),transparent_60%)]" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
          
          <div className="max-w-4xl mx-auto text-center space-y-10 relative z-10">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display font-[800] text-[40px] md:text-[56px] tracking-[-1.5px] leading-[1.1] text-white"
            >
              {t('services.shared.cta_title', 'Ready to automate your workflow?')}
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-sans font-medium text-slate-300 max-w-2xl mx-auto text-[18px] md:text-[20px]"
            >
              {t('services.shared.cta_description', 'Set up your account in minutes and connect your WhatsApp Business API configurations.')}
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-4"
            >
              <NavLink to="/signup" className="btn-premium-gradient !text-[13px] !px-10 !py-4 w-full sm:w-auto text-center !tracking-[0.2em] flex items-center justify-center gap-2">
                {t('services.shared.cta_trial', 'Start Free Trial')} <ArrowRight size={18} className={cn("transition-transform", isRtl && "rotate-180")} />
              </NavLink>
              <NavLink to="/contact" className="px-10 py-4 bg-white/10 border border-white/20 text-white font-sans font-black text-[13px] uppercase tracking-[0.2em] rounded-2xl hover:bg-white/20 transition-all shadow-sm backdrop-blur-md w-full sm:w-auto text-center flex items-center justify-center gap-2">
                {t('services.shared.cta_demo', 'Schedule Live Demo')}
              </NavLink>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

// 1. WhatsApp Campaigns Page
export function WhatsAppCampaignsPage() {
  const { t, isRtl } = useI18n();

  return (
    <ServicePageLayout
      title={t('services.whatsapp_campaigns.title', 'Targeted WhatsApp Campaigns')}
      subtitle={t('services.whatsapp_campaigns.description', 'Launch high-delivery WhatsApp broadcast campaigns targeted directly to your segmented customer database.')}
      category={t('services.whatsapp_campaigns.eyebrow', 'WhatsApp Marketing')}
      color="bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
      description={t('services.whatsapp_campaigns.benefits_description', 'Connect directly with customers where they are active. Unlike email broadcasts that average 15-20% open rates, WhatsApp campaigns regularly yield 98%+ open rates and up to 45% click-through metrics, driving immediate appointment bookings and repeat transactions.')}
      bullets={[
        `${t('services.whatsapp_campaigns.segmentation.title', 'Database Segmentation')}: ${t('services.whatsapp_campaigns.segmentation.description', 'Send unique marketing offers to specific contact tags like \'Inactive Patients\' or \'Premium Members\'.')}`,
        `${t('services.whatsapp_campaigns.quick_reply.title', 'Interactive Quick-Reply Headers')}: ${t('services.whatsapp_campaigns.quick_reply.description', 'Give leads single-tap buttons inside the WhatsApp bubble to schedule meetings instantly.')}`,
        `${t('services.whatsapp_campaigns.delivery.title', 'Live Delivery Metrics')}: ${t('services.whatsapp_campaigns.delivery.description', 'Track exact Sent, Delivered, and Read logs in real-time, matching your conversion targets.')}`
      ]}
      mockup={
        <div className={cn("w-full max-w-lg bg-slate-900 border border-white/10 rounded-3xl p-6 space-y-6 shadow-xl", isRtl ? "text-right" : "text-left")}>
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <span className="text-xs font-bold text-slate-400 uppercase">
              {t('services.whatsapp_campaigns.demo.heading', 'Campaign Setup: Offers Broadcast')}
            </span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold uppercase">
              {t('services.whatsapp_campaigns.demo.ready', 'Ready')}
            </span>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-slate-950/60 border border-white/5 rounded-2xl space-y-2">
              <span className="text-[10px] text-indigo-400 font-bold block uppercase">
                {t('services.whatsapp_campaigns.demo.template_label', 'Message Template')}
              </span>
              <p className="text-xs text-slate-200 font-medium">
                {t('services.whatsapp_campaigns.demo.template', 'Hello {{name}}! We hope you have a productive week! Book your Filler touch-up this weekend and get 15% off.')}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 font-mono">
              <div className="p-3 bg-slate-950 border border-white/5 rounded-xl text-center">
                <span className="text-[8px] text-slate-500 block">
                  {t('services.whatsapp_campaigns.demo.sent', 'Sent')}
                </span>
                <span className="text-sm font-bold text-white">1,240</span>
              </div>
              <div className="p-3 bg-slate-950 border border-white/5 rounded-xl text-center">
                <span className="text-[8px] text-slate-500 block">
                  {t('services.whatsapp_campaigns.demo.delivered', 'Delivered')}
                </span>
                <span className="text-sm font-bold text-emerald-400">99.8%</span>
              </div>
              <div className="p-3 bg-slate-950 border border-white/5 rounded-xl text-center">
                <span className="text-[8px] text-slate-500 block">
                  {t('services.whatsapp_campaigns.demo.conversion', 'Conversion')}
                </span>
                <span className="text-sm font-bold text-indigo-400">24.5%</span>
              </div>
            </div>
          </div>
        </div>
      }
    />
  );
}

// 2. Data Upload & Retargeting Page
export function RetargetingPage() {
  const { t, isRtl } = useI18n();

  return (
    <ServicePageLayout
      title={t('services.retargeting.title', 'Data Upload & Retargeting')}
      subtitle={t('services.retargeting.description', 'Import your customer contact records via Excel or CSV to configure automated retargeting flows.')}
      category={t('services.retargeting.eyebrow', 'CRM Database')}
      color="bg-blue-500/10 text-blue-400 border-blue-500/20"
      description={t('services.retargeting.benefits_description', 'Stop leaving cash on the table. Re-engage leads who previously inquired but haven\'t booked. Our list upload sync allows you to segment users dynamically, deploy targeted WhatsApp reminder campaigns, and enhance customer loyalty.')}
      bullets={[
        `${t('services.retargeting.imports.title', 'Excel & CSV Imports')}: ${t('services.retargeting.imports.description', 'Clean and sync thousands of contact list database records in seconds with automatic column validation.')}`,
        `${t('services.retargeting.campaigns.title', 'Retargeting Campaigns')}: ${t('services.retargeting.campaigns.description', 'Target specific historic contact pools with personalized reactivation vouchers.')}`,
        `${t('services.retargeting.sync.title', 'Automatic Syncing')}: ${t('services.retargeting.sync.description', 'Assign custom labels (e.g. Lead, Customer, Follow-up) to organize your client pipeline workspace.')}`
      ]}
      mockup={
        <div className={cn("w-full max-w-lg bg-slate-900 border border-white/10 rounded-3xl p-6 space-y-6 shadow-xl", isRtl ? "text-right" : "text-left")}>
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <span className="text-xs font-bold text-slate-400 uppercase">
              {t('services.retargeting.demo.heading', 'Database Importer')}
            </span>
            <span className="text-[10px] text-indigo-400 font-bold uppercase">
              {t('services.retargeting.demo.sync_status', 'Sync Active')}
            </span>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-slate-950/60 border border-white/10 border-dashed rounded-2xl flex flex-col items-center justify-center py-6">
              <span className="text-2xl mb-2">📊</span>
              <span className="text-xs font-bold text-white">active_clients_june.xlsx</span>
              <span className="text-[9px] text-slate-500 mt-1">
                {t('services.retargeting.demo.result', '4,821 Contacts detected • Column mapping successful')}
              </span>
            </div>
            <div className="p-3.5 bg-slate-950/40 border border-white/5 rounded-xl flex justify-between items-center">
              <div>
                <span className="text-[10px] font-bold text-white block">
                  {t('services.retargeting.demo.segment_created', 'Segment Created')}
                </span>
                <span className="text-[9px] text-slate-500">
                  {t('services.retargeting.demo.tag', 'Tag: Inactive_Leads_Retargeting')}
                </span>
              </div>
              <span className="text-[9px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded">
                {t('services.retargeting.demo.retarget_ready', 'Retarget Ready')}
              </span>
            </div>
          </div>
        </div>
      }
    />
  );
}

// 3. Automated Messaging Page
export function AutomationPage() {
  const { t, isRtl } = useI18n();

  return (
    <ServicePageLayout
      title={t('services.automation.title', 'Automated Messaging')}
      subtitle={t('services.automation.description', 'Set up recurring birthday greetings, post-visit reminders, and service follow-up triggers.')}
      category={t('services.automation.eyebrow', 'Automation Engines')}
      color="bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
      description={t('services.automation.benefits_description', 'Deliver the perfect message at the perfect time without lifting a finger. Automatically send personalized birthday wishes with unique discounts, or trigger reminders (like filler touch-ups or subscription renewals) exactly when your client is ready to purchase again.')}
      bullets={[
        `${t('services.automation.birthday.title', 'Birthday Wish Triggers')}: ${t('services.automation.birthday.description', 'Hook into contact birthdays to auto-deliver personalized greetings and coupon codes.')}`,
        `${t('services.automation.recall.title', 'Service Recall Alerts')}: ${t('services.automation.recall.description', 'Configure custom offsets (e.g. 6 months post-treatment) to prompt touch-up bookings.')}`,
        `${t('services.automation.friction.title', 'Zero Human Friction')}: ${t('services.automation.friction.description', 'Allow the automation workflow engine to progress deals from \'Contacted\' to \'Retargeted\' instantly.')}`
      ]}
      mockup={
        <div className={cn("w-full max-w-lg bg-slate-900 border border-white/10 rounded-3xl p-6 space-y-6 shadow-xl", isRtl ? "text-right" : "text-left")}>
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <span className="text-xs font-bold text-slate-400 uppercase">
              {t('services.automation.demo.heading', 'Recall Flow: Touch-up Reminder')}
            </span>
            <span className="text-[10px] text-emerald-400 font-bold uppercase flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" /> {t('services.automation.demo.running', 'Running')}
            </span>
          </div>
          <div className="space-y-3 font-sans">
            <div className="p-3 bg-slate-950/60 border border-white/5 rounded-xl flex items-center gap-3">
              <div className="w-6 h-6 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 text-xs font-bold shrink-0">1</div>
              <div>
                <span className="text-[10px] text-slate-300 block font-bold">
                  {t('services.automation.demo.trigger', 'Trigger Event: Service Completed')}
                </span>
                <span className="text-[9px] text-slate-500 block">
                  {t('services.automation.demo.trigger_description', 'Customer completes [Filler Injection] treatment')}
                </span>
              </div>
            </div>
            <div className="p-3 bg-slate-950/60 border border-white/5 rounded-xl flex items-center gap-3">
              <div className="w-6 h-6 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 text-xs font-bold shrink-0">2</div>
              <div>
                <span className="text-[10px] text-slate-300 block font-bold">
                  {t('services.automation.demo.delay', 'Delay Timer: 180 Days')}
                </span>
                <span className="text-[9px] text-slate-500 block">
                  {t('services.automation.demo.delay_description', 'System waits exactly 6 months post-treatment')}
                </span>
              </div>
            </div>
            <div className="p-3 bg-indigo-600/10 border border-indigo-500/20 rounded-xl flex items-center gap-3">
              <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">3</div>
              <div>
                <span className="text-[10px] text-white block font-bold">
                  {t('services.automation.demo.action', 'Action Event: Send WhatsApp Recall')}
                </span>
                <span className="text-[9px] text-indigo-300 block">
                  {t('services.automation.demo.message', '"Hey Ahmed, time for your Filler touch-up!"')}
                </span>
              </div>
            </div>
          </div>
        </div>
      }
    />
  );
}

// 4. Social Media Planner Page
export function SocialMediaPage() {
  const { t, isRtl } = useI18n();

  return (
    <ServicePageLayout
      title={t('services.social_media.title', 'Social Media Planner')}
      subtitle={t('services.social_media.description', 'Plan, schedule, and publish posts to Facebook, Instagram, TikTok, and Google Business Profiles from a single view.')}
      category={t('services.social_media.eyebrow', 'Social Channels')}
      color="bg-purple-500/10 text-purple-400 border-purple-500/20"
      description={t('services.social_media.benefits_description', 'Maintain a highly professional brand presence across all social media pages. Drag and drop posts, automate publishing schedules, review inbound page comments, and measure content engagement benchmarks without switching tabs.')}
      bullets={[
        `${t('services.social_media.scheduler.title', 'Multi-Platform Scheduler')}: ${t('services.social_media.scheduler.description', 'Push content to FB, Instagram, TikTok, and Snapchat simultaneously.')}`,
        `${t('services.social_media.calendar.title', 'Interactive Planner Calendar')}: ${t('services.social_media.calendar.description', 'Reschedule draft posts instantly using a simple calendar builder view.')}`,
        `${t('services.social_media.comments.title', 'Inbound Comments Monitor')}: ${t('services.social_media.comments.description', 'Connect your profiles to respond to post comments and queries from a unified feed.')}`
      ]}
      mockup={
        <div className={cn("w-full max-w-lg bg-slate-900 border border-white/10 rounded-3xl p-6 space-y-6 shadow-xl", isRtl ? "text-right" : "text-left")}>
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <span className="text-xs font-bold text-slate-400 uppercase">
              {t('services.social_media.demo.heading', 'Publishing Calendar Mock')}
            </span>
            <span className="text-[10px] text-purple-400 font-bold uppercase">
              {t('services.social_media.demo.status', 'Planner Active')}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-slate-950 border border-white/5 rounded-xl space-y-2">
              <span className="text-[8px] font-bold text-slate-500 block uppercase">MON, JUN 29</span>
              <div className="w-full h-12 bg-slate-900 rounded-lg flex items-center justify-center text-lg">📸</div>
              <span className="text-[8.5px] font-bold text-emerald-400 block uppercase">
                {t('services.social_media.demo.published', 'Published (IG)')}
              </span>
            </div>
            <div className="p-3 bg-slate-950 border border-white/5 rounded-xl space-y-2">
              <span className="text-[8px] font-bold text-slate-500 block uppercase">TUE, JUN 30</span>
              <div className="w-full h-12 bg-slate-900 rounded-lg flex items-center justify-center text-lg">🎥</div>
              <span className="text-[8.5px] font-bold text-indigo-400 block uppercase">
                {t('services.social_media.demo.scheduled', 'Scheduled (TikTok)')}
              </span>
            </div>
            <div className="p-3 bg-slate-950 border border-indigo-500/30 rounded-xl space-y-2 relative overflow-hidden">
              <span className="text-[8px] font-bold text-slate-500 block uppercase">WED, JUL 01</span>
              <div className="w-full h-12 bg-indigo-950/40 rounded-lg flex items-center justify-center text-lg border border-indigo-500/10">📝</div>
              <span className="text-[8.5px] font-bold text-purple-400 block uppercase">
                {t('services.social_media.demo.draft', 'Draft (FB)')}
              </span>
            </div>
          </div>
        </div>
      }
    />
  );
}

// 5. Lead Form CRM Integration Page
export function LeadFormsPage() {
  const { t, isRtl } = useI18n();

  return (
    <ServicePageLayout
      title={t('services.lead_forms.title', 'Lead Form CRM Integration')}
      subtitle={t('services.lead_forms.description', 'Connect Facebook, Instagram, TikTok, and Snapchat lead ads directly to your customer pipeline.')}
      category={t('services.lead_forms.eyebrow', 'Lead Acquisition')}
      color="bg-rose-500/10 text-rose-400 border-rose-500/20"
      description={t('services.lead_forms.benefits_description', 'Stop losing leads to slow response times. The moment a user submits a lead form on Facebook, Instagram, TikTok, or Snapchat, the data is pushed directly to your CRM. Trigger immediate automated WhatsApp welcomes to connect within seconds.')}
      bullets={[
        `${t('services.lead_forms.webhook.title', 'Instant Lead Webhook Sync')}: ${t('services.lead_forms.webhook.description', 'Sync leads from ad campaigns to your database with zero delays.')}`,
        `${t('services.lead_forms.assignment.title', 'Automatic Representative Assignment')}: ${t('services.lead_forms.assignment.description', 'Distribute leads instantly to designated account managers.')}`,
        `${t('services.lead_forms.reporting.title', 'Unified Ad Reporting')}: ${t('services.lead_forms.reporting.description', 'View cost per lead, conversion rate, and pipeline value metrics from one dashboard.')}`
      ]}
      mockup={
        <div className={cn("w-full max-w-lg bg-slate-900 border border-white/10 rounded-3xl p-6 space-y-6 shadow-xl", isRtl ? "text-right" : "text-left")}>
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <span className="text-xs font-bold text-slate-400 uppercase">
              {t('services.lead_forms.demo.heading', 'Incoming Lead Logger')}
            </span>
            <span className="text-[10px] text-rose-400 font-bold uppercase flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-ping" /> {t('services.lead_forms.demo.status', 'Sync Live')}
            </span>
          </div>
          <div className="space-y-3 font-mono">
            <div className="p-3 bg-slate-950 border border-white/5 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[9.5px] font-bold text-white block">Ahmad Khan</span>
                <span className="text-[8px] text-slate-500 block">📞 +923001234567 • Facebook Ad Form</span>
              </div>
              <span className="text-[8px] bg-rose-500/10 text-rose-400 border-rose-500/20 px-2 py-0.5 rounded">
                {t('services.lead_forms.demo.welcomed', 'Welcomed via WA')}
              </span>
            </div>
            <div className="p-3 bg-slate-950 border border-white/5 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[9.5px] font-bold text-white block">Sarah Miller</span>
                <span className="text-[8px] text-slate-500 block">📞 +923129876543 • Instagram Form</span>
              </div>
              <span className="text-[8px] bg-amber-500/10 text-amber-400 border-amber-500/20 px-2 py-0.5 rounded">
                {t('services.lead_forms.demo.assigned', 'Assigned to Sales')}
              </span>
            </div>
          </div>
        </div>
      }
    />
  );
}

// 6. AI-Powered Automated Response Page
export function AIResponsesPage() {
  const { t, isRtl } = useI18n();

  return (
    <ServicePageLayout
      title={t('services.ai_responses.title', 'AI-Powered Response Engine')}
      subtitle={t('services.ai_responses.description', 'Engage contacts 24/7 and drafts contextual replies automatically based on your CRM knowledge base.')}
      category={t('services.ai_responses.eyebrow', 'Artificial Intelligence')}
      color="bg-amber-500/10 text-amber-400 border-amber-500/20"
      description={t('services.ai_responses.benefits_description', 'Scale your customer support without adding heads. Deploy AI copilot agents trained on your business profiles, service listings, and FAQs. Draft responses to common customer questions instantly, schedule bookings, and auto-reply to Google Business reviews to boost SEO.')}
      bullets={[
        `${t('services.ai_responses.contextual.title', 'Contextual AI Auto-Replies')}: ${t('services.ai_responses.contextual.description', 'Analyze conversation history to draft natural replies on WhatsApp.')}`,
        `${t('services.ai_responses.appointments.title', 'Interactive Appointment Scheduler')}: ${t('services.ai_responses.appointments.description', 'AI interacts with client schedules to secure slot reservations.')}`,
        `${t('services.ai_responses.reviews.title', 'Google Review Auto-Reply')}: ${t('services.ai_responses.reviews.description', 'Instantly replies to Google Business reviews with relevant keywords to improve local search rank.')}`
      ]}
      mockup={
        <div className={cn("w-full max-w-lg bg-slate-900 border border-white/10 rounded-3xl p-6 space-y-6 shadow-xl", isRtl ? "text-right" : "text-left")}>
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <span className="text-xs font-bold text-slate-400 uppercase">
              {t('services.ai_responses.demo.draft_label', 'AI Copilot Draft')}
            </span>
            <span className="text-[10px] text-amber-400 font-bold uppercase">
              {t('services.ai_responses.demo.confidence', 'Confidence Score: 98%')}
            </span>
          </div>
          <div className="space-y-3 font-sans">
            <div className="p-3 bg-slate-950/60 border border-white/5 rounded-xl">
              <span className="text-[7.5px] font-bold text-slate-500 block uppercase">
                {t('services.ai_responses.demo.query_label', 'CUSTOMER QUERY')}
              </span>
              <p className="text-[11.5px] text-slate-200 mt-1">
                {t('services.ai_responses.demo.query', '"How much do your services cost, and can I book for 3:00 PM?"')}
              </p>
            </div>
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl relative">
              <span className="text-[7.5px] font-bold text-amber-400 block uppercase">
                {t('services.ai_responses.demo.suggested_reply_label', '✨ SUGGESTED AUTO-REPLY')}
              </span>
              <p className="text-[11.5px] text-slate-200 mt-1">
                {t('services.ai_responses.demo.reply', '"Hi Ahmed! Our entry pricing starts at $49. I have confirmed your slot reservation for today at 3:00 PM."')}
              </p>
            </div>
          </div>
        </div>
      }
    />
  );
}

// 7. Page & Form Builder Page
export function PageBuilderPage() {
  const { t, isRtl } = useI18n();

  return (
    <ServicePageLayout
      title={t('services.page_builder.title', 'Page & Form Builder')}
      subtitle={t('services.page_builder.description', 'Design responsive landing pages, lead capture surveys, and micro-portals with a simple visual editor.')}
      category={t('services.page_builder.eyebrow', 'Lead Generation')}
      color="bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
      description={t('services.page_builder.benefits_description', 'Stop paying for separate web page builders. Launch mobile-responsive landing pages, customer intake surveys, and promotion pages in minutes. Fully linked to your CRM to ensure every form submit updates user profiles instantly.')}
      bullets={[
        `${t('services.page_builder.drag_drop.title', 'Visual Drag-and-Drop Editor')}: ${t('services.page_builder.drag_drop.description', 'Design high-converting micro-websites with no coding requirements.')}`,
        `${t('services.page_builder.surveys.title', 'Interactive CRM Surveys')}: ${t('services.page_builder.surveys.description', 'Embed custom review questions that feed responses directly into client logs.')}`,
        `${t('services.page_builder.speed.title', 'Optimized Web Speed')}: ${t('services.page_builder.speed.description', 'Lightweight pages built to rank higher and load instantly on mobile layouts.')}`
      ]}
      mockup={
        <div className={cn("w-full max-w-lg bg-slate-900 border border-white/10 rounded-3xl p-6 space-y-6 shadow-xl", isRtl ? "text-right" : "text-left")}>
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <span className="text-xs font-bold text-slate-400 uppercase">
              {t('services.page_builder.demo.heading', 'Micro Page Editor Preview')}
            </span>
            <span className="text-[10px] text-cyan-400 font-bold uppercase">
              {t('services.page_builder.demo.status', 'Builder Active')}
            </span>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-slate-950/60 border border-white/5 rounded-2xl space-y-3">
              <div className="border border-white/10 p-2.5 rounded-lg text-center bg-slate-900 text-[10px] font-bold text-slate-400 border-dashed">
                {t('services.page_builder.demo.drag_header', '[Drag Component: Hero Header]')}
              </div>
              <div className="border border-indigo-500/30 p-2.5 rounded-lg text-center bg-indigo-950/20 text-[10px] font-bold text-indigo-400">
                {t('services.page_builder.demo.form_field', 'Form Field: Phone Number (Required)')}
              </div>
              <div className="border border-white/10 p-2.5 rounded-lg text-center bg-slate-900 text-[10px] font-bold text-slate-400 border-dashed">
                {t('services.page_builder.demo.drag_submit', '[Drag Component: Submit Button]')}
              </div>
            </div>
          </div>
        </div>
      }
    />
  );
}

// 8. Media Storage & Advanced Reporting Page
export function MediaStoragePage() {
  const { t, isRtl } = useI18n();

  return (
    <ServicePageLayout
      title={t('services.media_storage.title', 'Media Storage & Advanced Reporting')}
      subtitle={t('services.media_storage.description', 'Securely store asset folders and track campaign analytics parameters from a unified manager.')}
      category={t('services.media_storage.eyebrow', 'Reporting & Storage')}
      color="bg-violet-500/10 text-violet-400 border-violet-500/20"
      description={t('services.media_storage.benefits_description', 'Make strategic, data-backed decisions. Keep all your promotional flyers, video templates, and logo assets stored securely. Connect tracking parameters to examine exactly which campaigns generate transactions and evaluate account representative speed.')}
      bullets={[
        `${t('services.media_storage.drive.title', 'Unified Assets Drive')}: ${t('services.media_storage.drive.description', 'Upload, categorize, and send media assets within your chat threads.')}`,
        `${t('services.media_storage.reports.title', 'Campaign Performance Reports')}: ${t('services.media_storage.reports.description', 'Drill down into delivery stats, clicks, conversions, and ROI metrics.')}`,
        `${t('services.media_storage.logs.title', 'Team Performance Logs')}: ${t('services.media_storage.logs.description', 'Track average response times and issue resolution rates across managers.')}`
      ]}
      mockup={
        <div className={cn("w-full max-w-lg bg-slate-900 border border-white/10 rounded-3xl p-6 space-y-6 shadow-xl font-sans", isRtl ? "text-right" : "text-left")}>
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <span className="text-xs font-bold text-slate-400 uppercase">
              {t('services.media_storage.demo.heading', 'Assets Drive & Analytics')}
            </span>
            <span className="text-[10px] text-violet-400 font-bold uppercase">
              {t('services.media_storage.demo.status', 'Folder View')}
            </span>
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3 text-[10px] font-bold">
              <div className="p-3 bg-slate-950 border border-white/5 rounded-xl flex items-center gap-2">
                <span>📁</span>
                <div>
                  <span className="block text-white">Campaign_Media</span>
                  <span className="block text-[8px] text-slate-500 font-normal">14 files • 240 MB</span>
                </div>
              </div>
              <div className="p-3 bg-slate-950 border border-white/5 rounded-xl flex items-center gap-2">
                <span>📁</span>
                <div>
                  <span className="block text-white">Ad_Creatives</span>
                  <span className="block text-[8px] text-slate-500 font-normal">8 files • 1.2 GB</span>
                </div>
              </div>
            </div>
            <div className="p-3.5 bg-indigo-600/10 border border-indigo-500/20 rounded-xl flex justify-between items-center text-xs font-bold">
              <span className="text-white">{t('services.media_storage.demo.utilization', 'Workspace Storage Utilized')}</span>
              <span className="text-indigo-400">1.44 GB / 10 GB (14.4%)</span>
            </div>
          </div>
        </div>
      }
    />
  );
}

// 9. WhatsApp Analytics Page
export function WhatsAppAnalyticsPage() {
  const { t, isRtl } = useI18n();

  return (
    <ServicePageLayout
      title={t('services.analytics.title', 'WhatsApp Analytics')}
      subtitle={t('services.analytics.description', 'Track message delivery, open rates, engagement metrics, and campaign ROI in real-time.')}
      category={t('services.analytics.eyebrow', 'Analytics & Reporting')}
      color="bg-sky-500/10 text-sky-400 border-sky-500/20"
      description={t('services.analytics.benefits_description', 'Gain deep insights into your messaging performance. Understand how your audience interacts with your campaigns through comprehensive analytics. Monitor delivery statuses, read receipts, and click-through rates to optimize your communication strategy.')}
      bullets={[
        `${t('services.analytics.delivery.title', 'Real-Time Delivery Tracking')}: ${t('services.analytics.delivery.description', 'Monitor exactly how many messages are sent, delivered, and read instantly.')}`,
        `${t('services.analytics.engagement.title', 'Engagement Metrics')}: ${t('services.analytics.engagement.description', 'Analyze click-through rates on interactive buttons and links to gauge audience interest.')}`,
        `${t('services.analytics.roi.title', 'Comprehensive ROI Reporting')}: ${t('services.analytics.roi.description', 'Connect your campaign costs to generated leads and conversions to measure true ROI.')}`
      ]}
      mockup={
        <div className={cn("w-full max-w-lg bg-slate-900 border border-white/10 rounded-3xl p-6 space-y-6 shadow-xl", isRtl ? "text-right" : "text-left")}>
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <span className="text-xs font-bold text-slate-400 uppercase">
              {t('services.analytics.demo.heading', 'Analytics Dashboard')}
            </span>
            <span className="text-[10px] bg-sky-500/20 text-sky-400 border-sky-500/30 px-2 py-0.5 rounded-full font-bold uppercase">
              {t('services.analytics.demo.live', 'Live')}
            </span>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 font-mono">
              <div className="p-4 bg-slate-950 border border-white/5 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-500 block">
                  {t('services.analytics.demo.messages_sent', 'Total Messages Sent')}
                </span>
                <span className="text-xl font-bold text-white">45,280</span>
                <span className="text-[9px] text-emerald-400 block">
                  {t('services.analytics.demo.messages_change', '↑ 12% vs last month')}
                </span>
              </div>
              <div className="p-4 bg-slate-950 border border-white/5 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-500 block">
                  {t('services.analytics.demo.open_rate', 'Average Open Rate')}
                </span>
                <span className="text-xl font-bold text-sky-400">98.5%</span>
                <span className="text-[9px] text-emerald-400 block">
                  {t('services.analytics.demo.open_rate_change', '↑ 2.1% vs last month')}
                </span>
              </div>
            </div>
            <div className="p-4 bg-slate-950 border border-white/5 rounded-xl space-y-3">
               <span className="text-[10px] font-bold text-slate-400 uppercase block">
                 {t('services.analytics.demo.delivery_funnel', 'Delivery Funnel')}
               </span>
               <div className="space-y-2">
                 <div>
                   <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                     <span>{t('services.whatsapp_campaigns.demo.sent', 'Sent')}</span>
                     <span>100%</span>
                   </div>
                   <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                     <div className="h-full bg-slate-400 w-full" />
                   </div>
                 </div>
                 <div>
                   <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                     <span>{t('services.whatsapp_campaigns.demo.delivered', 'Delivered')}</span>
                     <span>99.2%</span>
                   </div>
                   <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                     <div className="h-full bg-indigo-400 w-[99.2%]" />
                   </div>
                 </div>
                 <div>
                   <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                     <span>{t('services.analytics.demo.read', 'Read')}</span>
                     <span>98.5%</span>
                   </div>
                   <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                     <div className="h-full bg-sky-400 w-[98.5%]" />
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      }
    />
  );
}
