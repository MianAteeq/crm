import React, { useEffect, useState } from 'react';
import Navbar from '../../components/public/Navbar';
import Footer from '../../components/public/Footer';
import { Testimonials, FAQ, FinalCTA } from '../../components/public/LandingSections';
import { 
  FileText, 
  Play, 
  HelpCircle, 
  ArrowRight, 
  TrendingUp, 
  ShieldCheck, 
  Code2, 
  Search, 
  BookOpen, 
  Sparkles,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { useI18n } from '../../i18n';
import { cn } from '../../lib/utils';

export default function ResourcesPage() {
  const { isRtl, language } = useI18n();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'developers' | 'tutorials' | 'compliance' | 'success'>('all');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const categories = [
    { id: 'all', label: isRtl ? 'جميع المصادر' : 'All Resources' },
    { id: 'developers', label: isRtl ? 'للمطورين والـ API' : 'Developers & API' },
    { id: 'tutorials', label: isRtl ? 'الشروحات والأدلة' : 'Guides & Tutorials' },
    { id: 'compliance', label: isRtl ? 'الامتثال وسياسات Meta' : 'Compliance & Policies' },
    { id: 'success', label: isRtl ? 'دراسات الحالة والنجاح' : 'Case Studies' },
  ];

  const resources = [
    { 
      id: 'api-docs',
      category: 'developers',
      icon: Code2, 
      tag: isRtl ? 'واجهة البرمجة' : 'REST API',
      badgeColor: 'bg-emerald-50 text-[#166534] border-[#22C55E]/30',
      title: isRtl ? 'توثيق واجهة البرمجة (API Documentation)' : 'API Documentation & SDKs', 
      desc: isRtl 
        ? 'تعرف على معلمات الأكواد، ومخططات حمولات الـ Webhook، ونماذج التكوين التقنية للربط المباشر مع منصة Talkinexx.' 
        : 'Explore API endpoints, webhook schemas, and payload examples to integrate Talkinexx directly with your tech stack.', 
      link: isRtl ? 'قراءة التوثيق التقني' : 'Read API Docs',
      href: '/features'
    },
    { 
      id: 'video-guides',
      category: 'tutorials',
      icon: Play, 
      tag: isRtl ? 'فيديو تعليمي' : 'Video Guides',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      title: isRtl ? 'دليل الفيديو والإعداد خطوة بخطوة' : 'Video Onboarding Guides', 
      desc: isRtl 
        ? 'شاهد مقاطع فيديو توضيحية لربط أرقام الهواتف الرسمية وبناء مسارات المحادثة الآلية وحملات واتساب التسويقية.' 
        : 'Watch step-by-step video tutorials on verifying WhatsApp numbers, building automation funnels, and launching campaigns.', 
      link: isRtl ? 'مشاهدة الفيديوهات' : 'Watch Videos',
      href: '/services/whatsapp-campaigns'
    },
    { 
      id: 'knowledge-base',
      category: 'tutorials',
      icon: HelpCircle, 
      tag: isRtl ? 'قاعدة المعرفة' : 'Knowledge Base',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      title: isRtl ? 'قاعدة المعرفة واستكشاف الأخطاء' : 'Knowledge Base & Troubleshooting', 
      desc: isRtl 
        ? 'إرشادات سريعة لحل المشكلات، وإعداد الحسابات، وفحوصات الامتثال، وضمان سرعة وصول الرسائل إلى عملائك.' 
        : 'Find quick troubleshooting guidelines, account setups, deliverability tips, and tier upgrade requirements.', 
      link: isRtl ? 'تصفح قاعدة المعرفة' : 'Browse Articles',
      href: '/contact'
    },
    { 
      id: 'case-studies',
      category: 'success',
      icon: TrendingUp, 
      tag: isRtl ? 'قصص نجاح' : 'Case Studies',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      title: isRtl ? 'قصص نجاح العملاء ودراسات الحالة' : 'Customer Success Stories', 
      desc: isRtl 
        ? 'اكتشف كيف حققت الشركات والمتاجر الرائدة نمواً بأكثر من 40% في معدل التحويل والمبيعات باستخدام واتساب CRM.' 
        : 'Discover how leading e-commerce and retail brands scaled customer engagement and boosted sales by 40%+.', 
      link: isRtl ? 'استعراض قصص النجاح' : 'Explore Case Studies',
      href: '/solutions'
    },
    { 
      id: 'compliance-meta',
      category: 'compliance',
      icon: ShieldCheck, 
      tag: isRtl ? 'سياسات Meta' : 'Meta Compliance',
      badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
      title: isRtl ? 'دليل اعتماد قوالب Meta وتصنيف الجودة' : 'Meta Template Approval & Quality Guide', 
      desc: isRtl 
        ? 'أفضل الممارسات لضمان اعتماد قوالب الرسائل التسويقية والخدمية فوراً والحفاظ على تقييم رقمك باللون الأخضر (High Quality).' 
        : 'Best practices, variable formatting rules, and guidelines to avoid rejections and maintain high phone number quality ratings.', 
      link: isRtl ? 'دليل القوالب والامتثال' : 'View Compliance Guide',
      href: '/templates'
    },
    { 
      id: 'best-practices',
      category: 'tutorials',
      icon: BookOpen, 
      tag: isRtl ? 'أفضل الممارسات' : 'Best Practices',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
      title: isRtl ? 'دليل التسويق التفاعلي عبر المحادثات' : 'Conversational Marketing Playbook', 
      desc: isRtl 
        ? 'كتيب شامل يشرح كيفية صياغة رسائل واتساب جذابة، وأوقات الإرسال المثلى، وكيفية تقسيم الجمهور لزيادة التفاعل.' 
        : 'Comprehensive playbook detailing high-converting copy strategies, optimal broadcast timing, and audience segmentation.', 
      link: isRtl ? 'تحميل الكتيب التوجيهي' : 'Read the Playbook',
      href: '/features'
    }
  ];

  const filteredResources = resources.filter(res => {
    const matchesCategory = selectedCategory === 'all' || res.category === selectedCategory;
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch = !term || 
      res.title.toLowerCase().includes(term) || 
      res.desc.toLowerCase().includes(term) ||
      res.tag.toLowerCase().includes(term);
    return matchesCategory && matchesSearch;
  });

  return (
    <div 
      className={cn(
        "bg-white text-slate-900 min-h-screen selection:bg-[#166534]/20 selection:text-[#166534] overflow-x-hidden font-sans",
        isRtl && "text-right"
      )}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <Navbar />
      <main>
        {/* Header Hero */}
        <section className="pt-48 pb-32 px-6 bg-[#12263A] text-white text-center relative overflow-hidden">
          {/* Background Tech Mesh & Gradients */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#166534]/25 rounded-full blur-[120px] pointer-events-none z-0 mix-blend-screen" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#22C55E]/15 rounded-full blur-[120px] pointer-events-none z-0 mix-blend-screen" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.1),transparent_70%)] pointer-events-none z-0" />

          <div className="max-w-4xl mx-auto space-y-6 relative z-10">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black text-[#F0FDF4] uppercase tracking-[0.2em] bg-[#166534]/30 px-3.5 py-1.5 rounded-full border border-[#22C55E]/30">
              <Sparkles size={11} className="text-[#22C55E]" />
              {isRtl ? 'الأدلة والدروس التعليمية' : 'Guides & Tutorials'}
            </span>
            <h1 className="font-display font-[800] text-3xl sm:text-5xl md:text-6xl tracking-tight text-white leading-tight">
              {isRtl ? 'المصادر ودراسات الحالة' : 'Resources & Knowledge Center'}
            </h1>
            <p className="font-sans font-normal text-stone-300 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
              {isRtl 
                ? 'كل ما تحتاجه لربط واجهة واتساب للأعمال (WhatsApp Business API)، وبناء حملات تسويقية متقدمة، وأتمتة مسارات العمل وتنمية أعمالك.' 
                : 'Everything you need to connect WhatsApp Business API, build complex marketing campaigns, configure automation workflows, and scale your business.'}
            </p>

            {/* Quick In-page Search Box */}
            <div className="pt-4 max-w-xl mx-auto">
              <div className="relative">
                <Search size={18} className={cn("absolute top-1/2 -translate-y-1/2 text-slate-400", isRtl ? "right-4" : "left-4")} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={isRtl ? 'ابحث في المصادر، التوثيق، أدلة الاستخدام...' : 'Search guides, API parameters, case studies...'}
                  className={cn(
                    "w-full h-12 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl text-xs sm:text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[#22C55E]/20 focus:border-[#22C55E] focus:bg-white/15 transition-all",
                    isRtl ? "pr-12 pl-4 text-right" : "pl-12 pr-4 text-left"
                  )}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Resources card grids & filters */}
        <section className="py-20 px-6 bg-[#F8FAFC]">
          <div className="max-w-7xl mx-auto space-y-10">
            
            {/* Category Filter Chips */}
            <div className={cn("flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar", isRtl ? "justify-start" : "justify-start")}>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id as any)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border",
                    selectedCategory === cat.id
                      ? "bg-[#166534] text-white border-[#166534] shadow-xs"
                      : "bg-white text-[#64748B] border-[#E2E8F0] hover:text-[#12263A] hover:bg-[#F1F5F9]"
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Results Grid */}
            {filteredResources.length === 0 ? (
              <div className="text-center py-16 px-6 bg-white border border-[#E2E8F0] rounded-3xl max-w-md mx-auto space-y-3">
                <Search size={28} className="text-[#64748B] mx-auto opacity-50" />
                <h3 className="text-base font-bold text-[#12263A]">
                  {isRtl ? 'لا توجد نتائج مطابقة' : 'No matching resources'}
                </h3>
                <p className="text-xs text-[#64748B]">
                  {isRtl ? 'جرب البحث بكلمات أخرى أو أعد تعيين الفلاتر.' : 'Try adjusting your search terms or reset the filters.'}
                </p>
                <button
                  onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}
                  className="text-xs font-bold text-[#166534] hover:underline cursor-pointer"
                >
                  {isRtl ? 'إعادة ضبط الفلاتر' : 'Reset filters'}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources.map((res) => (
                  <div 
                    key={res.id} 
                    className="p-7 bg-white border border-[#E2E8F0] hover:border-[#22C55E]/40 hover:shadow-lg transition-all rounded-3xl flex flex-col justify-between group"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="w-12 h-12 bg-[#F0FDF4] border border-[#22C55E]/30 text-[#166534] rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <res.icon size={22} strokeWidth={2.2} />
                        </div>
                        <span className={cn("px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border", res.badgeColor)}>
                          {res.tag}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-[#12263A] tracking-tight group-hover:text-[#166534] transition-colors leading-snug">
                        {res.title}
                      </h3>
                      <p className="text-[#64748B] font-normal text-xs leading-relaxed">
                        {res.desc}
                      </p>
                    </div>

                    <div className="pt-5 mt-6 border-t border-[#E2E8F0]">
                      <a 
                        href={res.href} 
                        className="text-xs font-bold text-[#166534] hover:text-[#14532d] transition-colors inline-flex items-center gap-1.5 uppercase tracking-wider group-hover:gap-2 duration-200"
                      >
                        <span>{res.link}</span>
                        <ArrowRight size={13} className={cn("transition-transform", isRtl && "rotate-180")} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quick Developer Callout Banner */}
            <div className="p-8 sm:p-10 bg-[#12263A] rounded-3xl text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
              <div className="absolute right-0 top-0 w-96 h-96 bg-[#166534]/20 rounded-full blur-[100px] pointer-events-none" />
              <div className="space-y-2 text-center md:text-start relative z-10">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#22C55E] bg-[#166534]/30 px-3 py-1 rounded-full border border-[#22C55E]/30 inline-block">
                  {isRtl ? 'دعم فني واستشارات متخصصة' : 'Need Technical Assistance?'}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                  {isRtl ? 'هل تحتاج إلى مساعدة في ربط واجهة واتساب للشركات؟' : 'Need help connecting your WhatsApp Business API?'}
                </h3>
                <p className="text-xs sm:text-sm text-stone-300 max-w-xl">
                  {isRtl 
                    ? 'فريق المهندسين والدعم الفني لدينا متاح لمساعدتك في استخراج التوكنات، وربط الـ Webhooks، وضمان اعتماد علامتك التجارية.' 
                    : 'Our engineering and integration specialists are available 24/7 to guide you through webhook setup, token generation, and Meta business verification.'}
                </p>
              </div>
              <a
                href="/contact"
                className="px-6 py-3 bg-[#166534] hover:bg-[#14532d] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-xs flex items-center gap-2 shrink-0 cursor-pointer relative z-10"
              >
                <span>{isRtl ? 'تحدث مع خبير تقني' : 'Talk to a Specialist'}</span>
                <ArrowRight size={14} className={cn(isRtl && "rotate-180")} />
              </a>
            </div>

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
