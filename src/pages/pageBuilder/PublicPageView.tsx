import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import {
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Star,
  ExternalLink,
  Send,
  Check,
  Eye,
  Edit,
  Building2,
  Play,
  X,
  ChevronDown,
  ChevronUp,
  Clock,
} from 'lucide-react';
import { pageBuilderApi } from '../../services/pageBuilderApi';
import { BuilderPage, PageSection } from '../../types/pageBuilder';

export default function PublicPageView() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const isPreviewParam = searchParams.get('preview') === 'true';

  const [page, setPage] = useState<BuilderPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Interactivity State
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(null);
  const [activeVideoModalUrl, setActiveVideoModalUrl] = useState<string | null>(null);

  // Live Countdown State
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 6,
    hours: 18,
    minutes: 42,
    seconds: 15,
  });

  // Embedded form state
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchPage = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await pageBuilderApi.getPublicPage(slug, true);
        if (res.success && res.data) {
          setPage(res.data);
          if (res.data.seo_settings?.meta_title || res.data.title) {
            document.title = res.data.seo_settings?.meta_title || res.data.title;
          }

          // Custom script injection for published pages
          if (res.data.seo_settings?.custom_head_code) {
            try {
              const headDiv = document.createElement('div');
              headDiv.innerHTML = res.data.seo_settings.custom_head_code;
              Array.from(headDiv.querySelectorAll('script')).forEach((oldScript) => {
                const newScript = document.createElement('script');
                Array.from(oldScript.attributes).forEach((attr) => newScript.setAttribute(attr.name, attr.value));
                newScript.appendChild(document.createTextNode(oldScript.innerHTML));
                document.head.appendChild(newScript);
              });
            } catch (e) {
              console.warn('Custom head script evaluation error:', e);
            }
          }
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Page not found or is currently unpublished.');
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [slug]);

  // Live Countdown Ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleFormSubmit = async (e: React.FormEvent, formSlug?: string) => {
    e.preventDefault();
    if (!formSlug && !slug) return;

    try {
      setIsSubmitting(true);
      setSubmitError(null);
      const targetSlug = formSlug || slug;
      const res = await pageBuilderApi.submitPublicForm(targetSlug, formData);

      if (res.success) {
        setSubmitSuccess(res.data?.thank_you_message || 'Thank you! Your information has been received.');
        if (res.data?.redirect_url) {
          setTimeout(() => {
            window.location.href = res.data.redirect_url!;
          }, 1500);
        }
      }
    } catch (err: any) {
      setSubmitError(err.response?.data?.message || 'Failed to submit form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-2">
          <RefreshCw size={28} className="animate-spin text-[#166534] mx-auto" />
          <p className="text-xs font-bold text-slate-600">Loading landing page...</p>
        </div>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-slate-200 shadow-md text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <AlertTriangle size={24} />
          </div>
          <h2 className="text-base font-bold text-slate-800">Page Not Available</h2>
          <p className="text-xs text-slate-500">{error || 'This page could not be found or is not published yet.'}</p>
          <a
            href="/page-builder/pages"
            className="inline-block mt-2 px-4 py-2 bg-[#166534] hover:bg-[#14532d] text-white rounded-xl text-xs font-bold transition-all"
          >
            Go to Landing Pages
          </a>
        </div>
      </div>
    );
  }

  const primaryColor = page.theme?.primary_color || '#166534';
  const isDraft = page.status !== 'published';

  return (
    <div
      className="min-h-screen font-sans text-slate-800 bg-white selection:bg-emerald-100 selection:text-emerald-900"
      style={{ fontFamily: page.theme?.font_family || 'inherit' }}
    >
      {/* Draft Preview Notification Banner */}
      {isDraft && (
        <div className="sticky top-0 z-50 bg-amber-500 text-white px-4 py-2 text-xs font-semibold flex flex-col sm:flex-row items-center justify-between gap-2 shadow-md">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-black/25 text-[10px] uppercase font-black tracking-wide">
              Draft Preview Mode
            </span>
            <span>This page is currently unpublished. Click "Publish Page" in the editor to make it visible to public visitors.</span>
          </div>
          <a
            href={`/page-builder/pages/edit/${page.id}`}
            className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-800 rounded-lg text-xs font-bold transition-colors shadow-2xs shrink-0 flex items-center gap-1.5"
          >
            <Edit size={12} />
            <span>Edit in Studio</span>
          </a>
        </div>
      )}

      {/* Render all sections */}
      {page.sections?.map((sec: PageSection) => {
        if (!sec.visible) return null;

        return (
          <section
            key={sec.id}
            id={sec.type}
            className={`w-full ${sec.settings?.padding_top || 'py-16'} ${sec.settings?.padding_bottom || 'py-16'}`}
            style={{ backgroundColor: sec.settings?.bg_color || '#FFFFFF' }}
          >
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
              {/* HERO (Split or Center) */}
              {sec.type === 'hero' && (
                <div
                  className={
                    sec.content.layout === 'split'
                      ? 'grid grid-cols-1 md:grid-cols-12 gap-8 items-center'
                      : 'text-center max-w-3xl mx-auto space-y-4'
                  }
                >
                  <div className={sec.content.layout === 'split' ? 'md:col-span-7 space-y-4' : 'space-y-4'}>
                    {sec.content.badge && (
                      <span className="inline-block px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-emerald-50 text-[#166534] border border-emerald-200">
                        {sec.content.badge}
                      </span>
                    )}
                    <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                      {sec.content.title}
                    </h1>
                    <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                      {sec.content.subtitle}
                    </p>
                    <div
                      className={`flex flex-wrap items-center gap-3 pt-3 ${
                        sec.content.layout === 'center' ? 'justify-center' : 'justify-start'
                      }`}
                    >
                      {sec.content.cta_text && (
                        <a
                          href={sec.content.cta_url || '#contact'}
                          className="px-6 py-3 rounded-xl font-bold text-white text-sm shadow-md hover:opacity-90 transition-all inline-block"
                          style={{ backgroundColor: primaryColor }}
                        >
                          {sec.content.cta_text}
                        </a>
                      )}
                      {sec.content.secondary_cta_text && (
                        <a
                          href={sec.content.secondary_cta_url || '#features'}
                          className="px-6 py-3 rounded-xl font-bold text-slate-700 bg-white border border-slate-200 text-sm shadow-2xs hover:bg-slate-50 transition-all inline-block"
                        >
                          {sec.content.secondary_cta_text}
                        </a>
                      )}
                    </div>
                  </div>

                  {sec.content.layout === 'split' && (
                    <div className="md:col-span-5 flex justify-center">
                      <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200/90 bg-slate-900 w-full max-w-md">
                        <img
                          src={sec.content.image_url || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80'}
                          alt={sec.content.title}
                          className="w-full h-auto object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* LOGO CLOUD */}
              {sec.type === 'logo_cloud' && (
                <div className="text-center max-w-4xl mx-auto space-y-4">
                  <p className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
                    {sec.content.title}
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-8 pt-2 opacity-75">
                    {sec.content.logos?.map((logo: any, i: number) => (
                      <div key={i} className="flex items-center gap-2 text-slate-700 font-bold text-sm">
                        <Building2 size={18} className="text-slate-400" />
                        <span>{logo.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STATS */}
              {sec.type === 'stats' && (
                <div className="max-w-4xl mx-auto space-y-8 text-center text-white">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-black">{sec.content.title}</h2>
                    {sec.content.subtitle && <p className="text-xs sm:text-sm text-slate-300 mt-1">{sec.content.subtitle}</p>}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {sec.content.items?.map((item: any, i: number) => (
                      <div key={i} className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                        <p className="text-3xl sm:text-4xl font-black text-emerald-400">{item.value}</p>
                        <p className="text-xs sm:text-sm text-slate-300 mt-1 font-medium">{item.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* FEATURES */}
              {sec.type === 'features' && (
                <div className="space-y-10">
                  <div className="text-center max-w-xl mx-auto">
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900">{sec.content.title}</h2>
                    {sec.content.subtitle && (
                      <p className="text-sm text-slate-500 mt-1">{sec.content.subtitle}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {sec.content.items?.map((item: any, i: number) => (
                      <div key={i} className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2.5">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm text-white"
                          style={{ backgroundColor: primaryColor }}
                        >
                          {i + 1}
                        </div>
                        <h3 className="font-bold text-slate-800 text-base">{item.title}</h3>
                        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SERVICES */}
              {sec.type === 'services' && (
                <div className="space-y-10">
                  <div className="text-center max-w-xl mx-auto">
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900">{sec.content.title}</h2>
                    {sec.content.subtitle && <p className="text-sm text-slate-500 mt-1">{sec.content.subtitle}</p>}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {sec.content.items?.map((item: any, i: number) => (
                      <div key={i} className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
                        <h3 className="font-bold text-slate-800 text-lg">{item.title}</h3>
                        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* VIDEO SHOWCASE */}
              {sec.type === 'video_showcase' && (
                <div className="space-y-6 max-w-3xl mx-auto text-center text-white">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-black">{sec.content.title}</h2>
                    {sec.content.subtitle && <p className="text-xs sm:text-sm text-slate-300 mt-1">{sec.content.subtitle}</p>}
                  </div>
                  <div
                    onClick={() => setActiveVideoModalUrl(sec.content.video_url || 'https://www.youtube.com/embed/dQw4w9WgXcQ')}
                    className="relative rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-slate-900 aspect-video flex items-center justify-center group cursor-pointer"
                  >
                    <img
                      src={sec.content.thumbnail_url || 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1000&auto=format&fit=crop&q=80'}
                      alt="Video"
                      className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-300"
                    />
                    <div
                      className="relative z-10 w-16 h-16 rounded-full text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"
                      style={{ backgroundColor: primaryColor }}
                    >
                      <Play size={26} className="ml-1" />
                    </div>
                  </div>
                </div>
              )}

              {/* TESTIMONIALS */}
              {sec.type === 'testimonials' && (
                <div className="space-y-8 max-w-4xl mx-auto">
                  <h2 className="text-2xl sm:text-3xl font-black text-center text-slate-900">{sec.content.title}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {sec.content.items?.map((item: any, i: number) => (
                      <div key={i} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                        <div className="flex items-center gap-1 text-amber-400">
                          {[...Array(5)].map((_, s) => (
                            <Star key={s} size={14} fill="currentColor" />
                          ))}
                        </div>
                        <p className="text-sm italic text-slate-700 leading-relaxed">"{item.quote}"</p>
                        <div>
                          <p className="text-xs font-bold text-slate-900">{item.author}</p>
                          <p className="text-[11px] text-slate-400">{item.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PRICING with Billing Switch */}
              {sec.type === 'pricing' && (
                <div className="space-y-8 max-w-5xl mx-auto">
                  <div className="text-center max-w-xl mx-auto space-y-3">
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900">{sec.content.title}</h2>
                    {sec.content.subtitle && <p className="text-sm text-slate-500">{sec.content.subtitle}</p>}

                    {/* Monthly vs Annual Toggle */}
                    <div className="inline-flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-2xs">
                      <button
                        type="button"
                        onClick={() => setBillingPeriod('monthly')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          billingPeriod === 'monthly' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                        }`}
                      >
                        Monthly Billing
                      </button>
                      <button
                        type="button"
                        onClick={() => setBillingPeriod('annual')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                          billingPeriod === 'annual' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                        }`}
                      >
                        <span>Annual Billing</span>
                        <span className="px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-emerald-100 text-[#166534]">
                          SAVE 20%
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {sec.content.items?.map((plan: any, i: number) => {
                      const basePrice = parseInt(plan.price.replace(/[^0-9]/g, '')) || 49;
                      const displayPrice = billingPeriod === 'annual' ? Math.round(basePrice * 0.8) : basePrice;

                      return (
                        <div
                          key={i}
                          className={`p-6 rounded-2xl border space-y-4 ${
                            plan.popular
                              ? 'bg-emerald-50/40 border-[#166534] shadow-md ring-1 ring-[#166534]'
                              : 'bg-white border-slate-200 shadow-2xs'
                          }`}
                        >
                          {plan.popular && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-[#166534] text-white">
                              MOST POPULAR
                            </span>
                          )}
                          <div>
                            <h3 className="font-bold text-slate-800 text-base">{plan.name}</h3>
                            <p className="text-3xl font-black text-slate-900 mt-1">
                              ${displayPrice}
                              <span className="text-xs text-slate-500 font-normal">/month</span>
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5">{plan.desc}</p>
                          </div>
                          <ul className="space-y-2 text-xs text-slate-600">
                            {plan.features?.map((f: string, j: number) => (
                              <li key={j} className="flex items-center gap-1.5">
                                <Check size={14} className="text-[#166534]" />
                                <span>{f}</span>
                              </li>
                            ))}
                          </ul>
                          <a
                            href="#contact"
                            className={`block w-full py-2.5 rounded-xl text-xs font-bold text-center transition-all shadow-xs ${
                              plan.popular
                                ? 'bg-[#166534] text-white hover:bg-[#14532d]'
                                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            {plan.cta_text || `Choose ${plan.name}`}
                          </a>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* COUNTDOWN */}
              {sec.type === 'countdown' && (
                <div className="max-w-2xl mx-auto text-center text-white space-y-4">
                  <p className="text-xs font-extrabold uppercase tracking-widest text-emerald-200">
                    {sec.content.label}
                  </p>
                  <div className="grid grid-cols-4 gap-3 max-w-sm mx-auto">
                    {[
                      { val: timeLeft.days, unit: 'Days' },
                      { val: timeLeft.hours, unit: 'Hours' },
                      { val: timeLeft.minutes, unit: 'Mins' },
                      { val: timeLeft.seconds, unit: 'Secs' },
                    ].map((box, i) => (
                      <div key={i} className="p-3 rounded-xl bg-black/30 backdrop-blur-xs border border-white/20">
                        <span className="text-2xl font-black block font-mono">
                          {String(box.val).padStart(2, '0')}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-slate-300 block">{box.unit}</span>
                      </div>
                    ))}
                  </div>
                  {sec.content.cta_text && (
                    <div className="pt-2">
                      <a
                        href={sec.content.cta_url || '#contact'}
                        className="px-6 py-2.5 rounded-xl font-bold text-slate-900 bg-white hover:bg-slate-100 text-xs shadow-md transition-all inline-block"
                      >
                        {sec.content.cta_text}
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* FAQ with Interactive Accordion */}
              {sec.type === 'faq' && (
                <div className="max-w-2xl mx-auto space-y-4">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900">{sec.content.title}</h2>
                    {sec.content.subtitle && <p className="text-sm text-slate-500 mt-1">{sec.content.subtitle}</p>}
                  </div>
                  <div className="space-y-3">
                    {sec.content.items?.map((faqItem: any, i: number) => {
                      const isExpanded = activeFaqIndex === i;

                      return (
                        <div
                          key={i}
                          className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs transition-all"
                        >
                          <button
                            type="button"
                            onClick={() => setActiveFaqIndex(isExpanded ? null : i)}
                            className="w-full p-4 text-left flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-50 transition-colors"
                          >
                            <span className="text-sm font-bold text-slate-800">{faqItem.q}</span>
                            {isExpanded ? (
                              <ChevronUp size={16} className="text-[#166534] shrink-0" />
                            ) : (
                              <ChevronDown size={16} className="text-slate-400 shrink-0" />
                            )}
                          </button>
                          {isExpanded && (
                            <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                              {faqItem.a}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* CTA BANNER */}
              {sec.type === 'cta_banner' && (
                <div className="max-w-3xl mx-auto text-center text-white space-y-4">
                  <h2 className="text-3xl sm:text-4xl font-black tracking-tight">{sec.content.title}</h2>
                  <p className="text-sm text-emerald-100 max-w-xl mx-auto leading-relaxed">{sec.content.subtitle}</p>
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <a
                      href={sec.content.cta_url || '#contact'}
                      className="px-6 py-3 rounded-xl font-bold text-slate-900 bg-white hover:bg-slate-100 text-xs sm:text-sm shadow-md transition-all inline-block"
                    >
                      {sec.content.cta_text}
                    </a>
                    {sec.content.secondary_cta_text && (
                      <a
                        href={sec.content.secondary_cta_url || '#features'}
                        className="px-6 py-3 rounded-xl font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 text-xs sm:text-sm transition-all inline-block"
                      >
                        {sec.content.secondary_cta_text}
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* CONTACT FORM with Instant CRM Lead Sync */}
              {sec.type === 'contact_form' && (
                <div id="contact" className="max-w-xl mx-auto text-center space-y-6">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900">{sec.content.title}</h2>
                    {sec.content.subtitle && <p className="text-sm text-slate-500 mt-1">{sec.content.subtitle}</p>}
                  </div>

                  <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-md text-left space-y-4">
                    {submitSuccess ? (
                      <div className="p-6 text-center space-y-3">
                        <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#166534] flex items-center justify-center mx-auto">
                          <CheckCircle2 size={24} />
                        </div>
                        <h3 className="text-base font-bold text-slate-800">Inquiry Received</h3>
                        <p className="text-xs text-slate-500 leading-relaxed">{submitSuccess}</p>
                      </div>
                    ) : (
                      <form onSubmit={(e) => handleFormSubmit(e)} className="space-y-4 text-xs">
                        {submitError && (
                          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                            {submitError}
                          </div>
                        )}

                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Your Full Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Jane Doe"
                            value={formData.name || ''}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#166534]"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="font-bold text-slate-700 block mb-1">Email Address *</label>
                            <input
                              type="email"
                              required
                              placeholder="jane@example.com"
                              value={formData.email || ''}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#166534]"
                            />
                          </div>

                          <div>
                            <label className="font-bold text-slate-700 block mb-1">Phone Number</label>
                            <input
                              type="tel"
                              placeholder="+1 (555) 000-0000"
                              value={formData.phone || ''}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#166534]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="font-bold text-slate-700 block mb-1">How can we help you?</label>
                          <textarea
                            rows={3}
                            placeholder="Tell us about your project or inquiry..."
                            value={formData.message || ''}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#166534]"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full py-3 rounded-xl font-bold text-white text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                          style={{ backgroundColor: primaryColor }}
                        >
                          {isSubmitting ? (
                            <>
                              <RefreshCw size={14} className="animate-spin text-white" />
                              <span>Submitting...</span>
                            </>
                          ) : (
                            <>
                              <Send size={14} />
                              <span>{sec.content.submit_button_text || 'Submit Inquiry'}</span>
                            </>
                          )}
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              )}

              {/* FOOTER */}
              {sec.type === 'footer' && (
                <div className="text-center text-slate-400 text-xs space-y-3">
                  <p>{sec.content.copyright}</p>
                  <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
                    {sec.content.links?.map((link: string, i: number) => (
                      <span key={i} className="hover:text-slate-200 transition-colors cursor-pointer">
                        {link}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        );
      })}

      {/* Video Modal Popup */}
      {activeVideoModalUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative max-w-3xl w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/20">
            <button
              type="button"
              onClick={() => setActiveVideoModalUrl(null)}
              className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 cursor-pointer"
            >
              <X size={18} />
            </button>
            <iframe
              src={
                activeVideoModalUrl.includes('youtube.com') || activeVideoModalUrl.includes('youtu.be')
                  ? activeVideoModalUrl.replace('watch?v=', 'embed/')
                  : activeVideoModalUrl
              }
              title="Video Demo"
              className="w-full h-full border-0"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
}
