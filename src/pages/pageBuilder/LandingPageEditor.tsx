import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Globe,
  Eye,
  Settings,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Copy,
  Smartphone,
  Tablet,
  Monitor,
  Layout,
  Sparkles,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Code2,
  Sliders,
  Type,
  Image as ImageIcon,
  Check,
  X,
  Palette,
  Undo2,
  Redo2,
  Layers,
  Component,
  Activity,
  DollarSign,
  HelpCircle,
  Star,
  Film,
  Clock,
  Send,
  Building2,
  Link,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Play,
  RotateCcw,
  ArrowUp,
  ArrowDown,
  GripVertical,
  PlusCircle,
  MinusCircle,
  MessageSquare,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { pageBuilderApi } from '../../services/pageBuilderApi';
import {
  BuilderPage,
  PageSection,
  PageTheme,
  PageSeoSettings,
  BuilderForm,
  SectionType,
} from '../../types/pageBuilder';
import { toast } from '../../components/ui/Toast';
import { MediaPickerModal } from '../../components/media/MediaPickerModal';
import { TemplateModal } from '../../components/pageBuilder/TemplateModal';
import { SeoTrackingModal } from '../../components/pageBuilder/SeoTrackingModal';
import { ThemePaletteModal, THEME_PALETTES } from '../../components/pageBuilder/ThemePaletteModal';

// Section Block Templates
const DEFAULT_SECTION_PRESETS: Record<string, Partial<PageSection>> = {
  hero_split: {
    type: 'hero',
    name: 'Hero (Split Mockup)',
    visible: true,
    content: {
      layout: 'split',
      badge: '⚡ NEXT-GEN AUTOMATION',
      title: 'Scale Your Pipeline With Autonomous Intelligence',
      subtitle: 'Eliminate manual data entry, streamline client messaging on WhatsApp and Meta, and convert visitors into qualified sales opportunities.',
      cta_text: 'Get Started Today',
      cta_url: '#contact',
      secondary_cta_text: 'View Live Demo',
      secondary_cta_url: '#features',
      image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1000&auto=format&fit=crop&q=80',
    },
    settings: {
      bg_type: 'solid',
      bg_color: '#F8FAFC',
      padding_top: 'py-20',
      padding_bottom: 'py-20',
      text_align: 'left',
    },
  },
  hero_center: {
    type: 'hero',
    name: 'Hero (Centered)',
    visible: true,
    content: {
      layout: 'center',
      badge: '🚀 NEW CAPABILITIES RELEASED',
      title: 'Empower Your Business With Intelligent CRM Workflows',
      subtitle: 'Streamline lead acquisition, coordinate team messaging, and automate client engagement with enterprise reliability.',
      cta_text: 'Start Free Trial',
      cta_url: '#contact',
      secondary_cta_text: 'Learn More',
      secondary_cta_url: '#about',
    },
    settings: {
      bg_type: 'solid',
      bg_color: '#FFFFFF',
      padding_top: 'py-20',
      padding_bottom: 'py-20',
      text_align: 'center',
    },
  },
  logo_cloud: {
    type: 'logo_cloud',
    name: 'Logo Cloud / Social Proof',
    visible: true,
    content: {
      title: 'TRUSTED BY REVENUE TEAMS AT INNOVATIVE COMPANIES',
      logos: [
        { name: 'Acme Corp', icon: 'Building2' },
        { name: 'Starlight Media', icon: 'Sparkles' },
        { name: 'Global Logistics', icon: 'Globe' },
        { name: 'Apex Analytics', icon: 'Activity' },
        { name: 'Nova Systems', icon: 'Cpu' },
      ],
    },
    settings: {
      bg_type: 'solid',
      bg_color: '#FFFFFF',
      padding_top: 'py-10',
      padding_bottom: 'py-10',
      text_align: 'center',
    },
  },
  stats: {
    type: 'stats',
    name: 'KPI & Stats Counters',
    visible: true,
    content: {
      title: 'Proven Enterprise Performance',
      subtitle: 'Real metrics achieved by active teams utilizing our automation engine.',
      items: [
        { value: '99.98%', label: 'System Uptime SLA' },
        { value: '4.8x', label: 'Faster Lead Response' },
        { value: '1.2M+', label: 'Messages Delivered' },
        { value: '42%', label: 'Average Conversion Lift' },
      ],
    },
    settings: {
      bg_type: 'solid',
      bg_color: '#0F172A',
      padding_top: 'py-16',
      padding_bottom: 'py-16',
      text_align: 'center',
    },
  },
  features: {
    type: 'features',
    name: 'Features Grid (3-Col)',
    visible: true,
    content: {
      title: 'Everything You Need To Grow',
      subtitle: 'Comprehensive tools engineered for conversion and workflow efficiency.',
      items: [
        { title: 'Omnichannel Social Inbox', desc: 'Sync conversations across WhatsApp Cloud, Instagram Direct, and Facebook Messenger in one view.' },
        { title: 'Automated Workflows', desc: 'Trigger auto-responses, follow-ups, and lead routing notifications without writing code.' },
        { title: 'Lead Capture & Sync', desc: 'Every landing page form maps directly to your central CRM contact database with smart tags.' },
        { title: 'Meta Tracking Pixel', desc: 'Inject Meta Pixel and Google Tag Manager seamlessly for accurate conversion attribution.' },
        { title: 'Multi-Tenant Security', desc: 'Strict data partitioning and tenant isolation ensuring enterprise compliance.' },
        { title: 'Real-Time Webhooks', desc: 'Push submissions and lead updates to your external systems with zero latency.' },
      ],
    },
    settings: {
      bg_type: 'solid',
      bg_color: '#F8FAFC',
      padding_top: 'py-16',
      padding_bottom: 'py-16',
      text_align: 'center',
    },
  },
  services: {
    type: 'services',
    name: 'Core Services Cards',
    visible: true,
    content: {
      title: 'Our Specialized Solutions',
      subtitle: 'Tailored systems built to accelerate your commercial goals.',
      items: [
        { title: 'Full-Funnel Lead Acquisition', desc: 'High-performing landing pages engineered to convert visitors into qualified buyers.' },
        { title: 'CRM & Marketing Automation', desc: 'Drip campaigns and automated nurturing sequences across WhatsApp, Email, and SMS.' },
        { title: 'Operational Consulting', desc: 'Architecture reviews and CRM data modeling to eliminate operational friction.' },
      ],
    },
    settings: {
      bg_type: 'solid',
      bg_color: '#FFFFFF',
      padding_top: 'py-16',
      padding_bottom: 'py-16',
      text_align: 'center',
    },
  },
  video_showcase: {
    type: 'video_showcase',
    name: 'Video Demo Showcase',
    visible: true,
    content: {
      title: 'See How The Platform Works In 2 Minutes',
      subtitle: 'A quick visual walkthrough of our real-time social inbox and landing page builder.',
      video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      thumbnail_url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1000&auto=format&fit=crop&q=80',
    },
    settings: {
      bg_type: 'solid',
      bg_color: '#0F172A',
      padding_top: 'py-16',
      padding_bottom: 'py-16',
      text_align: 'center',
    },
  },
  testimonials: {
    type: 'testimonials',
    name: 'Testimonials Grid',
    visible: true,
    content: {
      title: 'Trusted By Growth Leaders',
      items: [
        {
          quote: 'This platform transformed our lead capture speed and unified our customer support inbox in under 48 hours.',
          author: 'Sarah Jenkins',
          role: 'VP of Growth, Horizon Media',
        },
        {
          quote: 'The direct CRM contact sync eliminated all manual lead import work for our entire sales organization.',
          author: 'Michael Torres',
          role: 'CEO, Apex Digital Systems',
        },
      ],
    },
    settings: {
      bg_type: 'solid',
      bg_color: '#F8FAFC',
      padding_top: 'py-16',
      padding_bottom: 'py-16',
      text_align: 'center',
    },
  },
  pricing: {
    type: 'pricing',
    name: 'Pricing Plans',
    visible: true,
    content: {
      title: 'Simple, Transparent Investment',
      subtitle: 'Choose the plan that fits your business phase.',
      billing_period: 'monthly',
      items: [
        {
          name: 'Starter',
          price: '$49',
          period: '/mo',
          desc: 'Essential capabilities for early-stage teams.',
          features: ['Up to 5 Landing Pages', '2,500 CRM Contacts', 'Standard Email Support'],
          cta_text: 'Get Started Starter',
        },
        {
          name: 'Growth',
          price: '$99',
          period: '/mo',
          desc: 'Best for rapidly scaling organizations.',
          popular: true,
          features: ['Unlimited Pages & Forms', '25,000 Contacts', 'Full Social Inbox', 'Priority Support'],
          cta_text: 'Start Free 14-Day Trial',
        },
        {
          name: 'Enterprise',
          price: '$249',
          period: '/mo',
          desc: 'Dedicated setup and high volume SLA.',
          features: ['Unlimited Everything', 'Custom CNAME Domains', 'Dedicated Strategist', '99.98% SLA'],
          cta_text: 'Contact Enterprise',
        },
      ],
    },
    settings: {
      bg_type: 'solid',
      bg_color: '#FFFFFF',
      padding_top: 'py-16',
      padding_bottom: 'py-16',
      text_align: 'center',
    },
  },
  faq: {
    type: 'faq',
    name: 'FAQ Accordion',
    visible: true,
    content: {
      title: 'Frequently Asked Questions',
      subtitle: 'Quick answers to common questions about our platform.',
      items: [
        {
          q: 'How does direct CRM lead sync work?',
          a: 'When visitors submit forms, their contact data is instantly parsed, deduplicated, and mapped to your central CRM database.',
        },
        {
          q: 'Can I connect custom tracking scripts?',
          a: 'Yes. Use the SEO & Tracking panel to inject Meta Pixel, Google Tag Manager, and custom analytics snippets.',
        },
        {
          q: 'Are all landing pages mobile-responsive?',
          a: 'Yes. Every section is built on modern flex and CSS grid containers that adapt smoothly to mobile, tablet, and desktop.',
        },
      ],
    },
    settings: {
      bg_type: 'solid',
      bg_color: '#F8FAFC',
      padding_top: 'py-16',
      padding_bottom: 'py-16',
      text_align: 'left',
    },
  },
  cta_banner: {
    type: 'cta_banner',
    name: 'High-Impact CTA Banner',
    visible: true,
    content: {
      title: 'Ready To Supercharge Your Lead Generation?',
      subtitle: 'Join innovative revenue teams streamlining client acquisition today.',
      cta_text: 'Claim Your Free Account',
      cta_url: '#contact',
      secondary_cta_text: 'Talk to Sales',
      secondary_cta_url: '#contact',
    },
    settings: {
      bg_type: 'solid',
      bg_color: '#166534',
      padding_top: 'py-16',
      padding_bottom: 'py-16',
      text_align: 'center',
    },
  },
  contact_form: {
    type: 'contact_form',
    name: 'CRM Lead Form Embed',
    visible: true,
    content: {
      title: 'Connect With Our Team',
      subtitle: 'Fill out the form below and an account specialist will follow up shortly.',
      form_id: null,
      submit_button_text: 'Submit Inquiry',
    },
    settings: {
      bg_type: 'solid',
      bg_color: '#F8FAFC',
      padding_top: 'py-16',
      padding_bottom: 'py-16',
      text_align: 'center',
    },
  },
  footer: {
    type: 'footer',
    name: 'Footer',
    visible: true,
    content: {
      copyright: '© 2026 CRM Automation. All rights reserved.',
      links: ['Privacy Policy', 'Terms of Service', 'Security', 'Support'],
    },
    settings: {
      bg_type: 'solid',
      bg_color: '#0F172A',
      padding_top: 'py-10',
      padding_bottom: 'py-10',
      text_align: 'center',
    },
  },
};

export default function LandingPageEditor() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  // Page Model State
  const [title, setTitle] = useState('New Landing Page');
  const [slug, setSlug] = useState('page-' + Math.floor(Math.random() * 100000));
  const [category, setCategory] = useState('landing_page');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [sections, setSections] = useState<PageSection[]>([]);
  const [theme, setTheme] = useState<PageTheme>({
    primary_color: '#166534',
    secondary_color: '#12263A',
    background_color: '#FFFFFF',
    text_color: '#0F172A',
    font_family: 'Inter, sans-serif',
    container_width: '1200px',
    border_radius: '12px',
    palette_id: 'emerald',
  });
  const [seo, setSeo] = useState<PageSeoSettings>({
    meta_title: '',
    meta_description: '',
  });

  // History Stack for Undo / Redo
  const [history, setHistory] = useState<PageSection[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // UI Studio State
  const [leftTab, setLeftTab] = useState<'layers' | 'blocks'>('layers');
  const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [mediaPickerType, setMediaPickerType] = useState<'image' | 'video'>('image');
  const [inspectorTab, setInspectorTab] = useState<'content' | 'style'>('content');
  const [availableForms, setAvailableForms] = useState<BuilderForm[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Modals
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isSeoModalOpen, setIsSeoModalOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

  // Fetch available forms
  useEffect(() => {
    pageBuilderApi.getForms().then((res) => {
      if (res.success && res.data) {
        setAvailableForms(res.data);
      }
    });
  }, []);

  // Push to history helper
  const pushHistory = useCallback((newSections: PageSection[]) => {
    setHistory((prev) => {
      const sliced = prev.slice(0, historyIndex + 1);
      return [...sliced, newSections];
    });
    setHistoryIndex((prev) => prev + 1);
  }, [historyIndex]);

  // Load existing or initialize starter sections
  useEffect(() => {
    if (!id) {
      const initial: PageSection[] = [
        { id: 'sec-1', ...DEFAULT_SECTION_PRESETS.hero_split } as PageSection,
        { id: 'sec-2', ...DEFAULT_SECTION_PRESETS.logo_cloud } as PageSection,
        { id: 'sec-3', ...DEFAULT_SECTION_PRESETS.features } as PageSection,
        { id: 'sec-4', ...DEFAULT_SECTION_PRESETS.pricing } as PageSection,
        { id: 'sec-5', ...DEFAULT_SECTION_PRESETS.contact_form } as PageSection,
        { id: 'sec-6', ...DEFAULT_SECTION_PRESETS.footer } as PageSection,
      ];
      setSections(initial);
      setHistory([initial]);
      setHistoryIndex(0);
      setSelectedSectionId(initial[0].id);
      return;
    }

    const fetchPage = async () => {
      try {
        setLoading(true);
        const res = await pageBuilderApi.getPage(Number(id));
        if (res.success && res.data) {
          const p = res.data;
          setTitle(p.title);
          setSlug(p.slug);
          setCategory(p.category || 'landing_page');
          setStatus(p.status === 'published' ? 'published' : 'draft');
          const loadedSections = p.sections || [];
          setSections(loadedSections);
          setHistory([loadedSections]);
          setHistoryIndex(0);
          if (loadedSections.length > 0) {
            setSelectedSectionId(loadedSections[0].id);
          }
          if (p.theme) setTheme(p.theme);
          if (p.seo_settings) setSeo(p.seo_settings);
        }
      } catch (err) {
        toast.error('Failed to load landing page');
        navigate('/page-builder/pages');
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [id, navigate]);

  // Undo / Redo
  const handleUndo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setSections(prev);
      toast.info('Undo');
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setSections(next);
      toast.info('Redo');
    }
  };

  // Keyboard Shortcuts (Ctrl+S, Ctrl+Z, Ctrl+Y)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave(false);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }
      if (((e.ctrlKey || e.metaKey) && e.key === 'y') || ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z')) {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [title, slug, category, status, sections, theme, seo, historyIndex, history]);

  // Save / Publish
  const handleSave = async (publishToggle = false) => {
    if (!title.trim()) {
      toast.error('Please enter a page title');
      return;
    }

    try {
      setSaving(true);
      const nextStatus = publishToggle ? (status === 'published' ? 'draft' : 'published') : status;

      const payload: Partial<BuilderPage> = {
        title,
        slug,
        category,
        status: nextStatus,
        sections,
        theme,
        seo_settings: seo,
      };

      let res;
      if (isEditing) {
        res = await pageBuilderApi.updatePage(Number(id), payload);
      } else {
        res = await pageBuilderApi.createPage(payload);
      }

      if (res.success && res.data) {
        setStatus(res.data.status === 'published' ? 'published' : 'draft');
        toast.success(
          publishToggle
            ? `Page ${res.data.status === 'published' ? 'published' : 'unpublished'} successfully!`
            : 'Page saved successfully!'
        );
        if (!isEditing) {
          navigate(`/page-builder/pages/edit/${res.data.id}`, { replace: true });
        }
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save page');
    } finally {
      setSaving(false);
    }
  };

  // Section Manipulation
  const addSection = (presetKey: string) => {
    const template = DEFAULT_SECTION_PRESETS[presetKey];
    if (!template) return;

    const newSec: PageSection = {
      id: `sec-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      ...template,
    } as PageSection;

    // If adding a hero, place it at top
    let updated: PageSection[];
    if (newSec.type === 'hero' && sections.length > 0) {
      updated = [newSec, ...sections];
    } else {
      updated = [...sections, newSec];
    }

    setSections(updated);
    pushHistory(updated);
    setSelectedSectionId(newSec.id);
    setLeftTab('layers');
    toast.success(`Added ${newSec.name}`);

    setTimeout(() => {
      document.getElementById(newSec.id)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const duplicateSection = (sec: PageSection, index: number) => {
    const cloned: PageSection = {
      ...sec,
      id: `sec-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: `${sec.name} (Copy)`,
      content: JSON.parse(JSON.stringify(sec.content || {})),
      settings: JSON.parse(JSON.stringify(sec.settings || {})),
    };
    const updated = [...sections];
    updated.splice(index + 1, 0, cloned);
    setSections(updated);
    pushHistory(updated);
    setSelectedSectionId(cloned.id);
    toast.success(`Duplicated ${sec.name}`);
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === sections.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...sections];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    setSections(updated);
    pushHistory(updated);
  };

  const moveHeroToTop = () => {
    const hIdx = sections.findIndex((s) => s.type === 'hero');
    if (hIdx <= 0) return;

    const updated = [...sections];
    const [hero] = updated.splice(hIdx, 1);
    updated.unshift(hero);
    setSections(updated);
    pushHistory(updated);
    setSelectedSectionId(hero.id);
    toast.success('Hero section moved to top of the page');
    setTimeout(() => {
      document.getElementById(hero.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const deleteSection = (index: number) => {
    const deletedId = sections[index]?.id;
    const updated = sections.filter((_, i) => i !== index);
    setSections(updated);
    pushHistory(updated);
    if (selectedSectionId === deletedId) {
      setSelectedSectionId(updated.length > 0 ? updated[0].id : null);
    }
    toast.info('Section removed');
  };

  // Content Updaters
  const updateSectionContent = (id: string, key: string, value: any) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, content: { ...s.content, [key]: value } } : s))
    );
  };

  const updateSectionSettings = (id: string, key: string, value: any) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, settings: { ...s.settings, [key]: value } } : s))
    );
  };

  // Structured Array Item Updaters (for items, logos, links, etc.)
  const updateSectionItem = (sectionId: string, listKey: string, index: number, field: string, value: any) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.id !== sectionId) return s;
        const currentList = Array.isArray(s.content[listKey]) ? [...s.content[listKey]] : [];
        if (index >= 0 && index < currentList.length) {
          currentList[index] = { ...currentList[index], [field]: value };
        }
        return { ...s, content: { ...s.content, [listKey]: currentList } };
      })
    );
  };

  const addSectionItem = (sectionId: string, listKey: string, defaultItem: any) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.id !== sectionId) return s;
        const currentList = Array.isArray(s.content[listKey]) ? [...s.content[listKey]] : [];
        currentList.push(defaultItem);
        return { ...s, content: { ...s.content, [listKey]: currentList } };
      })
    );
    toast.success('Item added');
  };

  const removeSectionItem = (sectionId: string, listKey: string, index: number) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.id !== sectionId) return s;
        const currentList = Array.isArray(s.content[listKey]) ? [...s.content[listKey]] : [];
        currentList.splice(index, 1);
        return { ...s, content: { ...s.content, [listKey]: currentList } };
      })
    );
    toast.info('Item removed');
  };

  const updateSectionArrayValue = (sectionId: string, listKey: string, index: number, value: any) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.id !== sectionId) return s;
        const currentList = Array.isArray(s.content[listKey]) ? [...s.content[listKey]] : [];
        currentList[index] = value;
        return { ...s, content: { ...s.content, [listKey]: currentList } };
      })
    );
  };

  const addSectionArrayValue = (sectionId: string, listKey: string, defaultValue: any) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.id !== sectionId) return s;
        const currentList = Array.isArray(s.content[listKey]) ? [...s.content[listKey]] : [];
        currentList.push(defaultValue);
        return { ...s, content: { ...s.content, [listKey]: currentList } };
      })
    );
  };

  const removeSectionArrayValue = (sectionId: string, listKey: string, index: number) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.id !== sectionId) return s;
        const currentList = Array.isArray(s.content[listKey]) ? [...s.content[listKey]] : [];
        currentList.splice(index, 1);
        return { ...s, content: { ...s.content, [listKey]: currentList } };
      })
    );
  };

  // Pricing Plan Bullet Features Updaters
  const updatePricingFeature = (sectionId: string, planIndex: number, featureIndex: number, value: string) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.id !== sectionId) return s;
        const plans = Array.isArray(s.content.items) ? [...s.content.items] : [];
        if (planIndex >= 0 && planIndex < plans.length) {
          const plan = { ...plans[planIndex] };
          const features = Array.isArray(plan.features) ? [...plan.features] : [];
          features[featureIndex] = value;
          plan.features = features;
          plans[planIndex] = plan;
        }
        return { ...s, content: { ...s.content, items: plans } };
      })
    );
  };

  const addPricingFeature = (sectionId: string, planIndex: number, defaultFeature: string) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.id !== sectionId) return s;
        const plans = Array.isArray(s.content.items) ? [...s.content.items] : [];
        if (planIndex >= 0 && planIndex < plans.length) {
          const plan = { ...plans[planIndex] };
          const features = Array.isArray(plan.features) ? [...plan.features] : [];
          features.push(defaultFeature);
          plan.features = features;
          plans[planIndex] = plan;
        }
        return { ...s, content: { ...s.content, items: plans } };
      })
    );
  };

  const removePricingFeature = (sectionId: string, planIndex: number, featureIndex: number) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.id !== sectionId) return s;
        const plans = Array.isArray(s.content.items) ? [...s.content.items] : [];
        if (planIndex >= 0 && planIndex < plans.length) {
          const plan = { ...plans[planIndex] };
          const features = Array.isArray(plan.features) ? [...plan.features] : [];
          features.splice(featureIndex, 1);
          plan.features = features;
          plans[planIndex] = plan;
        }
        return { ...s, content: { ...s.content, items: plans } };
      })
    );
  };

  // Selected Section
  const selectedSection = sections.find((s) => s.id === selectedSectionId);
  const selectedSectionIndex = sections.findIndex((s) => s.id === selectedSectionId);

  // Check if Hero is misplaced (not at index 0)
  const heroIndex = sections.findIndex((s) => s.type === 'hero');
  const hasMisplacedHero = heroIndex > 0;

  // Canvas Viewport Width
  const viewportWidthClass =
    deviceView === 'desktop'
      ? 'w-full max-w-5xl'
      : deviceView === 'tablet'
        ? 'w-[768px] max-w-full'
        : 'w-[375px] max-w-full';

  return (
    <div className="fixed inset-0 z-[999] w-screen h-screen flex flex-col bg-slate-100 overflow-hidden select-none font-sans text-slate-800">
      {/* ================= 1. TOP DOCKED STUDIO HEADER (Fixed at top, never cut off) ================= */}
      <header className="h-14 bg-white border-b border-slate-200 px-4 flex items-center justify-between gap-3 z-30 shadow-xs shrink-0">
        {/* Left: Back & Title */}
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            type="button"
            onClick={() => navigate('/page-builder/pages')}
            className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
            title="Back to Landing Pages"
          >
            <ArrowLeft size={18} />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Page Title"
                className="text-xs font-bold text-slate-900 bg-transparent hover:bg-slate-50 focus:bg-white border border-transparent hover:border-slate-300 focus:border-[#166534] rounded px-1.5 py-0.5 focus:outline-none max-w-[200px] sm:max-w-[260px] truncate"
              />
              <span
                className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase shrink-0 ${status === 'published'
                  ? 'bg-emerald-50 text-[#166534] border border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}
              >
                {status}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono pl-1">
              <span>/p/{slug}</span>
            </div>
          </div>
        </div>

        {/* Center: Device Viewport Switcher & History */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Undo / Redo */}
          <div className="hidden sm:flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              type="button"
              disabled={historyIndex <= 0}
              onClick={handleUndo}
              className="p-1.5 text-slate-600 hover:text-slate-900 rounded disabled:opacity-30 cursor-pointer"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 size={13} />
            </button>
            <button
              type="button"
              disabled={historyIndex >= history.length - 1}
              onClick={handleRedo}
              className="p-1.5 text-slate-600 hover:text-slate-900 rounded disabled:opacity-30 cursor-pointer"
              title="Redo (Ctrl+Y)"
            >
              <Redo2 size={13} />
            </button>
          </div>

          {/* Viewport switcher */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 shadow-2xs">
            <button
              type="button"
              onClick={() => setDeviceView('desktop')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${deviceView === 'desktop' ? 'bg-white text-[#166534] shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              title="Desktop (100%)"
            >
              <Monitor size={14} />
            </button>
            <button
              type="button"
              onClick={() => setDeviceView('tablet')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${deviceView === 'tablet' ? 'bg-white text-[#166534] shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              title="Tablet (768px)"
            >
              <Tablet size={14} />
            </button>
            <button
              type="button"
              onClick={() => setDeviceView('mobile')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${deviceView === 'mobile' ? 'bg-white text-[#166534] shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              title="Mobile (375px)"
            >
              <Smartphone size={14} />
            </button>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Turnkey Templates */}
          <button
            type="button"
            onClick={() => setIsTemplateModalOpen(true)}
            className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl shadow-2xs flex items-center gap-1.5 cursor-pointer"
            title="Browse Turnkey Page Templates"
          >
            <Sparkles size={13} className="text-amber-500" />
            <span className="hidden md:inline">Templates</span>
          </button>

          {/* Theme Palette */}
          <button
            type="button"
            onClick={() => setIsThemeModalOpen(true)}
            className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl shadow-2xs flex items-center gap-1.5 cursor-pointer"
            title="Global Design & Palettes"
          >
            <Palette size={13} className="text-[#166534]" />
            <span className="hidden md:inline">Theme</span>
          </button>

          {/* SEO & Tracking */}
          <button
            type="button"
            onClick={() => setIsSeoModalOpen(true)}
            className="p-1.5 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl shadow-2xs cursor-pointer"
            title="SEO & Custom Tracking Scripts"
          >
            <Settings size={15} />
          </button>

          {/* Preview Public Page */}
          <a
            href={`/p/${slug}?preview=true`}
            target="_blank"
            rel="noreferrer"
            className="px-2.5 sm:px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold shadow-2xs flex items-center gap-1.5"
            title="Open Live Preview in new tab"
          >
            <ExternalLink size={13} />
            <span className="hidden sm:inline">Preview</span>
          </a>

          {/* Save Draft */}
          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave(false)}
            className="px-3 sm:px-3.5 py-1.5 bg-white hover:bg-slate-50 text-[#166534] border border-[#166534]/40 rounded-xl text-xs font-bold shadow-2xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="Save Draft (Ctrl+S)"
          >
            <Save size={13} />
            <span className="hidden sm:inline">{saving ? 'Saving...' : 'Save Draft'}</span>
          </button>

          {/* Publish / Unpublish Toggle */}
          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave(true)}
            className={`px-3.5 sm:px-4 py-1.5 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-all ${status === 'published'
              ? 'bg-amber-600 hover:bg-amber-700 text-white'
              : 'bg-[#166534] hover:bg-[#14532d] text-white'
              }`}
          >
            {status === 'published' ? <XCircle size={14} /> : <CheckCircle2 size={14} />}
            <span>{status === 'published' ? 'Unpublish' : 'Publish'}</span>
          </button>
        </div>
      </header>

      {/* ================= 2. THREE-COLUMN STUDIO WORKSPACE ================= */}
      <div className="flex-1 flex overflow-hidden">
        {/* ================= COLUMN 1: LEFT LAYERS & BLOCKS PANEL (280px) ================= */}
        <aside className="w-72 bg-white border-r border-slate-200 flex flex-col shrink-0 z-20 shadow-2xs">
          {/* Sub-tab switcher */}
          <div className="p-2 border-b border-slate-100 flex items-center gap-1 bg-slate-50">
            <button
              type="button"
              onClick={() => setLeftTab('layers')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${leftTab === 'layers'
                ? 'bg-white text-[#166534] shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
                }`}
            >
              <Layers size={13} />
              <span>Outline ({sections.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setLeftTab('blocks')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${leftTab === 'blocks'
                ? 'bg-white text-[#166534] shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
                }`}
            >
              <Plus size={13} />
              <span>Add Block</span>
            </button>
          </div>

          {/* TAB A: LAYERS / OUTLINE */}
          {leftTab === 'layers' && (
            <div className="flex-1 overflow-y-auto p-3 space-y-1.5 custom-scrollbar">
              {/* Alert if Hero is misplaced */}
              {hasMisplacedHero && (
                <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl mb-2 text-amber-800 text-[11px] flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-bold">Hero is at Step {heroIndex + 1}</p>
                    <p className="text-[10px] text-amber-600 truncate">Should appear at top of page</p>
                  </div>
                  <button
                    type="button"
                    onClick={moveHeroToTop}
                    className="px-2 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[10px] font-bold shrink-0 transition-colors cursor-pointer"
                  >
                    Move to Top
                  </button>
                </div>
              )}

              {sections.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs space-y-2">
                  <Layout size={24} className="mx-auto text-slate-300" />
                  <p>Your page canvas is empty.</p>
                  <button
                    type="button"
                    onClick={() => setLeftTab('blocks')}
                    className="px-3 py-1 bg-[#166534] text-white rounded-lg text-xs font-bold cursor-pointer"
                  >
                    Add a Block
                  </button>
                </div>
              ) : (
                sections.map((sec, idx) => {
                  const isSelected = selectedSectionId === sec.id;
                  const isFirst = idx === 0;
                  const isLast = idx === sections.length - 1;

                  return (
                    <div
                      key={sec.id}
                      onClick={() => {
                        setSelectedSectionId(sec.id);
                        document.getElementById(sec.id)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }}
                      className={`group p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${isSelected
                        ? 'border-[#166534] bg-emerald-50/60 shadow-2xs ring-1 ring-[#166534]'
                        : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                        }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 text-xs font-bold ${isSelected ? 'bg-[#166534] text-white' : 'bg-slate-100 text-slate-600'
                            }`}
                        >
                          {idx + 1}
                        </div>
                        <div className="min-w-0">
                          <p
                            className={`text-xs font-bold truncate ${isSelected ? 'text-[#166534]' : 'text-slate-800'
                              }`}
                          >
                            {sec.name}
                          </p>
                          <span className="text-[10px] text-slate-400 font-mono capitalize block truncate">
                            {sec.type}
                          </span>
                        </div>
                      </div>

                      {/* Layer Order Actions */}
                      <div className="flex items-center gap-0.5">
                        <button
                          type="button"
                          disabled={isFirst}
                          onClick={(e) => {
                            e.stopPropagation();
                            moveSection(idx, 'up');
                          }}
                          className="p-1 hover:bg-[#166534] hover:text-white rounded text-slate-600 disabled:opacity-20 cursor-pointer transition-colors"
                          title="Move Up (↑)"
                        >
                          <ChevronUp size={14} />
                        </button>
                        <button
                          type="button"
                          disabled={isLast}
                          onClick={(e) => {
                            e.stopPropagation();
                            moveSection(idx, 'down');
                          }}
                          className="p-1 hover:bg-[#166534] hover:text-white rounded text-slate-600 disabled:opacity-20 cursor-pointer transition-colors"
                          title="Move Down (↓)"
                        >
                          <ChevronDown size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            duplicateSection(sec, idx);
                          }}
                          className="p-1 hover:bg-slate-200 rounded text-slate-500 cursor-pointer transition-colors"
                          title="Duplicate"
                        >
                          <Copy size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteSection(idx);
                          }}
                          className="p-1 hover:bg-rose-100 text-rose-500 rounded cursor-pointer transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* TAB B: ADD BLOCK PRESETS */}
          {leftTab === 'blocks' && (
            <div className="flex-1 overflow-y-auto p-3 space-y-4 text-xs custom-scrollbar">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Headers & Heroes
                </span>
                <div className="space-y-1.5">
                  <button
                    type="button"
                    onClick={() => addSection('hero_split')}
                    className="w-full p-2.5 bg-slate-50 hover:bg-emerald-50/60 hover:border-emerald-300 border border-slate-200 rounded-xl text-left transition-all cursor-pointer group"
                  >
                    <span className="font-bold text-slate-800 group-hover:text-[#166534] block text-xs">
                      Hero (Split Mockup)
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Headline left + product mockup image right
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => addSection('hero_center')}
                    className="w-full p-2.5 bg-slate-50 hover:bg-emerald-50/60 hover:border-emerald-300 border border-slate-200 rounded-xl text-left transition-all cursor-pointer group"
                  >
                    <span className="font-bold text-slate-800 group-hover:text-[#166534] block text-xs">
                      Hero (Centered Minimal)
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Clean centered headline with dual action buttons
                    </span>
                  </button>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Social Proof & Trust
                </span>
                <div className="space-y-1.5">
                  <button
                    type="button"
                    onClick={() => addSection('logo_cloud')}
                    className="w-full p-2.5 bg-slate-50 hover:bg-emerald-50/60 hover:border-emerald-300 border border-slate-200 rounded-xl text-left transition-all cursor-pointer group"
                  >
                    <span className="font-bold text-slate-800 group-hover:text-[#166534] block text-xs">
                      Logo Cloud / Client Bar
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Row of client company logos and trust badges
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => addSection('stats')}
                    className="w-full p-2.5 bg-slate-50 hover:bg-emerald-50/60 hover:border-emerald-300 border border-slate-200 rounded-xl text-left transition-all cursor-pointer group"
                  >
                    <span className="font-bold text-slate-800 group-hover:text-[#166534] block text-xs">
                      KPI & Stats Counters
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      4 metric boxes (Uptime, Users, Lift, Speed)
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => addSection('testimonials')}
                    className="w-full p-2.5 bg-slate-50 hover:bg-emerald-50/60 hover:border-emerald-300 border border-slate-200 rounded-xl text-left transition-all cursor-pointer group"
                  >
                    <span className="font-bold text-slate-800 group-hover:text-[#166534] block text-xs">
                      Testimonials Cards
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Client endorsement cards with roles & avatars
                    </span>
                  </button>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Features & Showcase
                </span>
                <div className="space-y-1.5">
                  <button
                    type="button"
                    onClick={() => addSection('features')}
                    className="w-full p-2.5 bg-slate-50 hover:bg-emerald-50/60 hover:border-emerald-300 border border-slate-200 rounded-xl text-left transition-all cursor-pointer group"
                  >
                    <span className="font-bold text-slate-800 group-hover:text-[#166534] block text-xs">
                      Features Grid (6 Items)
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      3-column grid highlighting key product advantages
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => addSection('services')}
                    className="w-full p-2.5 bg-slate-50 hover:bg-emerald-50/60 hover:border-emerald-300 border border-slate-200 rounded-xl text-left transition-all cursor-pointer group"
                  >
                    <span className="font-bold text-slate-800 group-hover:text-[#166534] block text-xs">
                      Core Services Cards
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      3 full-service offering cards with bullet details
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => addSection('video_showcase')}
                    className="w-full p-2.5 bg-slate-50 hover:bg-emerald-50/60 hover:border-emerald-300 border border-slate-200 rounded-xl text-left transition-all cursor-pointer group"
                  >
                    <span className="font-bold text-slate-800 group-hover:text-[#166534] block text-xs">
                      Video Demo Showcase
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Embed video player modal with custom poster
                    </span>
                  </button>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Conversion & Pricing
                </span>
                <div className="space-y-1.5">
                  <button
                    type="button"
                    onClick={() => addSection('pricing')}
                    className="w-full p-2.5 bg-slate-50 hover:bg-emerald-50/60 hover:border-emerald-300 border border-slate-200 rounded-xl text-left transition-all cursor-pointer group"
                  >
                    <span className="font-bold text-slate-800 group-hover:text-[#166534] block text-xs">
                      Tiered Pricing Table
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Starter, Growth, and Enterprise comparison cards
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => addSection('faq')}
                    className="w-full p-2.5 bg-slate-50 hover:bg-emerald-50/60 hover:border-emerald-300 border border-slate-200 rounded-xl text-left transition-all cursor-pointer group"
                  >
                    <span className="font-bold text-slate-800 group-hover:text-[#166534] block text-xs">
                      FAQ Accordion
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Expandable questions to address objections
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => addSection('cta_banner')}
                    className="w-full p-2.5 bg-slate-50 hover:bg-emerald-50/60 hover:border-emerald-300 border border-slate-200 rounded-xl text-left transition-all cursor-pointer group"
                  >
                    <span className="font-bold text-slate-800 group-hover:text-[#166534] block text-xs">
                      High-Impact CTA Banner
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Full-width colored banner with dual buttons
                    </span>
                  </button>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Forms & Footers
                </span>
                <div className="space-y-1.5">
                  <button
                    type="button"
                    onClick={() => addSection('contact_form')}
                    className="w-full p-2.5 bg-slate-50 hover:bg-emerald-50/60 hover:border-emerald-300 border border-slate-200 rounded-xl text-left transition-all cursor-pointer group"
                  >
                    <span className="font-bold text-slate-800 group-hover:text-[#166534] block text-xs">
                      CRM Lead Form Embed
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Embed any CRM form with instant contact sync
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => addSection('footer')}
                    className="w-full p-2.5 bg-slate-50 hover:bg-emerald-50/60 hover:border-emerald-300 border border-slate-200 rounded-xl text-left transition-all cursor-pointer group"
                  >
                    <span className="font-bold text-slate-800 group-hover:text-[#166534] block text-xs">
                      Footer
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Copyright notice and legal navigation links
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </aside>

        {/* ================= COLUMN 2: CENTER LIVE INTERACTIVE CANVAS ================= */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 flex flex-col items-center bg-slate-200/60 custom-scrollbar">
          <div
            className={`${viewportWidthClass} transition-all duration-300 bg-white rounded-2xl shadow-xl border border-slate-300/80 overflow-hidden min-h-[700px] flex flex-col`}
            style={{ fontFamily: theme.font_family || 'inherit' }}
          >
            {sections.map((sec, idx) => {
              const isSelected = selectedSectionId === sec.id;
              const isFirst = idx === 0;
              const isLast = idx === sections.length - 1;

              if (!sec.visible) return null;

              return (
                <div
                  key={sec.id}
                  id={sec.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSectionId(sec.id);
                  }}
                  className={`relative group transition-all ${isSelected
                    ? 'ring-2 ring-[#166534] ring-inset shadow-md z-10'
                    : 'hover:ring-1 hover:ring-emerald-400/60 hover:ring-inset'
                    }`}
                  style={{
                    backgroundColor: sec.settings?.bg_color || '#FFFFFF',
                  }}
                >
                  {/* Floating Action Badge & Toolbar */}
                  <div
                    className={`absolute top-2 right-2 z-20 flex items-center gap-1 bg-white/95 backdrop-blur-xs p-1 rounded-xl shadow-md border border-slate-200 transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                      }`}
                  >
                    <span className="px-2 font-extrabold text-[#166534] text-[10px] uppercase tracking-wider">
                      {idx + 1}. {sec.name}
                    </span>
                    <button
                      type="button"
                      disabled={isFirst}
                      onClick={(e) => {
                        e.stopPropagation();
                        moveSection(idx, 'up');
                      }}
                      className="p-1 hover:bg-[#166534] hover:text-white rounded text-slate-600 disabled:opacity-20 cursor-pointer transition-colors"
                      title="Move Up (↑)"
                    >
                      <ChevronUp size={13} />
                    </button>
                    <button
                      type="button"
                      disabled={isLast}
                      onClick={(e) => {
                        e.stopPropagation();
                        moveSection(idx, 'down');
                      }}
                      className="p-1 hover:bg-[#166534] hover:text-white rounded text-slate-600 disabled:opacity-20 cursor-pointer transition-colors"
                      title="Move Down (↓)"
                    >
                      <ChevronDown size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        duplicateSection(sec, idx);
                      }}
                      className="p-1 hover:bg-slate-100 rounded text-slate-600 cursor-pointer transition-colors"
                      title="Duplicate"
                    >
                      <Copy size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSection(idx);
                      }}
                      className="p-1 hover:bg-rose-50 text-rose-600 rounded cursor-pointer transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>

                  {/* Section Content Renderers (All text editable with contentEditable) */}
                  <div
                    className={`p-6 sm:p-12 ${sec.settings?.padding_top || 'py-16'} ${sec.settings?.padding_bottom || 'py-16'
                      }`}
                  >
                    {/* HERO: Split or Center */}
                    {sec.type === 'hero' && (
                      <div
                        className={
                          sec.content.layout === 'split'
                            ? 'grid grid-cols-1 md:grid-cols-12 gap-8 items-center max-w-5xl mx-auto'
                            : 'text-center max-w-3xl mx-auto space-y-4'
                        }
                      >
                        <div className={sec.content.layout === 'split' ? 'md:col-span-7 space-y-4' : 'space-y-4'}>
                          {sec.content.badge && (
                            <span
                              contentEditable
                              suppressContentEditableWarning
                              onFocus={() => setSelectedSectionId(sec.id)}
                              onBlur={(e) => updateSectionContent(sec.id, 'badge', e.currentTarget.innerText)}
                              className="inline-block px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-emerald-50 text-[#166534] border border-emerald-200 focus:outline-none focus:ring-1 focus:ring-emerald-400 cursor-text"
                            >
                              {sec.content.badge}
                            </span>
                          )}
                          <h1
                            contentEditable
                            suppressContentEditableWarning
                            onFocus={() => setSelectedSectionId(sec.id)}
                            onBlur={(e) => updateSectionContent(sec.id, 'title', e.currentTarget.innerText)}
                            className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight focus:outline-none focus:ring-1 focus:ring-emerald-400 rounded cursor-text"
                          >
                            {sec.content.title}
                          </h1>
                          <p
                            contentEditable
                            suppressContentEditableWarning
                            onFocus={() => setSelectedSectionId(sec.id)}
                            onBlur={(e) => updateSectionContent(sec.id, 'subtitle', e.currentTarget.innerText)}
                            className="text-sm sm:text-base text-slate-600 leading-relaxed focus:outline-none focus:ring-1 focus:ring-emerald-400 rounded cursor-text"
                          >
                            {sec.content.subtitle}
                          </p>
                          <div
                            className={`flex flex-wrap items-center gap-3 pt-3 ${sec.content.layout === 'center' ? 'justify-center' : 'justify-start'
                              }`}
                          >
                            <span
                              contentEditable
                              suppressContentEditableWarning
                              onFocus={() => setSelectedSectionId(sec.id)}
                              onBlur={(e) => updateSectionContent(sec.id, 'cta_text', e.currentTarget.innerText)}
                              className="px-6 py-2.5 rounded-xl font-bold text-white text-xs shadow-md transition-all cursor-text inline-block focus:outline-none focus:ring-2 focus:ring-emerald-300"
                              style={{ backgroundColor: theme.primary_color }}
                            >
                              {sec.content.cta_text || 'Get Started'}
                            </span>
                            {sec.content.secondary_cta_text && (
                              <span
                                contentEditable
                                suppressContentEditableWarning
                                onFocus={() => setSelectedSectionId(sec.id)}
                                onBlur={(e) => updateSectionContent(sec.id, 'secondary_cta_text', e.currentTarget.innerText)}
                                className="px-5 py-2.5 rounded-xl font-bold text-slate-700 bg-white border border-slate-200 text-xs shadow-2xs hover:bg-slate-50 transition-all cursor-text inline-block focus:outline-none focus:ring-1 focus:ring-emerald-400"
                              >
                                {sec.content.secondary_cta_text}
                              </span>
                            )}
                          </div>
                        </div>

                        {sec.content.layout === 'split' && (
                          <div className="md:col-span-5 flex justify-center">
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200/90 bg-slate-900 w-full max-w-sm">
                              <img
                                src={sec.content.image_url || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80'}
                                alt="Hero Mockup"
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
                        <p
                          contentEditable
                          suppressContentEditableWarning
                          onFocus={() => setSelectedSectionId(sec.id)}
                          onBlur={(e) => updateSectionContent(sec.id, 'title', e.currentTarget.innerText)}
                          className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-400 rounded cursor-text"
                        >
                          {sec.content.title}
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-6 pt-2">
                          {sec.content.logos?.map((logo: any, i: number) => (
                            <div
                              key={i}
                              className="flex items-center gap-2 text-slate-700 font-bold text-sm bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/70"
                            >
                              <Building2 size={16} className="text-slate-400" />
                              <span
                                contentEditable
                                suppressContentEditableWarning
                                onFocus={() => setSelectedSectionId(sec.id)}
                                onBlur={(e) => updateSectionItem(sec.id, 'logos', i, 'name', e.currentTarget.innerText)}
                                className="focus:outline-none focus:ring-1 focus:ring-emerald-400 rounded cursor-text"
                              >
                                {logo.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* STATS */}
                    {sec.type === 'stats' && (
                      <div className="max-w-4xl mx-auto space-y-8 text-center text-white">
                        <div>
                          <h2
                            contentEditable
                            suppressContentEditableWarning
                            onFocus={() => setSelectedSectionId(sec.id)}
                            onBlur={(e) => updateSectionContent(sec.id, 'title', e.currentTarget.innerText)}
                            className="text-xl sm:text-2xl font-black focus:outline-none focus:ring-1 focus:ring-emerald-400 rounded cursor-text"
                          >
                            {sec.content.title}
                          </h2>
                          {sec.content.subtitle && (
                            <p
                              contentEditable
                              suppressContentEditableWarning
                              onFocus={() => setSelectedSectionId(sec.id)}
                              onBlur={(e) => updateSectionContent(sec.id, 'subtitle', e.currentTarget.innerText)}
                              className="text-xs text-slate-300 mt-1 focus:outline-none focus:ring-1 focus:ring-emerald-400 rounded cursor-text"
                            >
                              {sec.content.subtitle}
                            </p>
                          )}
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          {sec.content.items?.map((item: any, i: number) => (
                            <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs space-y-1">
                              <p
                                contentEditable
                                suppressContentEditableWarning
                                onFocus={() => setSelectedSectionId(sec.id)}
                                onBlur={(e) => updateSectionItem(sec.id, 'items', i, 'value', e.currentTarget.innerText)}
                                className="text-2xl sm:text-3xl font-black text-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400 rounded cursor-text"
                              >
                                {item.value}
                              </p>
                              <p
                                contentEditable
                                suppressContentEditableWarning
                                onFocus={() => setSelectedSectionId(sec.id)}
                                onBlur={(e) => updateSectionItem(sec.id, 'items', i, 'label', e.currentTarget.innerText)}
                                className="text-xs text-slate-300 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-400 rounded cursor-text"
                              >
                                {item.label}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* FEATURES */}
                    {sec.type === 'features' && (
                      <div className="space-y-8 max-w-5xl mx-auto">
                        <div className="text-center max-w-xl mx-auto">
                          <h2
                            contentEditable
                            suppressContentEditableWarning
                            onFocus={() => setSelectedSectionId(sec.id)}
                            onBlur={(e) => updateSectionContent(sec.id, 'title', e.currentTarget.innerText)}
                            className="text-xl sm:text-2xl font-black text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-400 rounded cursor-text"
                          >
                            {sec.content.title}
                          </h2>
                          {sec.content.subtitle && (
                            <p
                              contentEditable
                              suppressContentEditableWarning
                              onFocus={() => setSelectedSectionId(sec.id)}
                              onBlur={(e) => updateSectionContent(sec.id, 'subtitle', e.currentTarget.innerText)}
                              className="text-xs sm:text-sm text-slate-500 mt-1 focus:outline-none focus:ring-1 focus:ring-emerald-400 rounded cursor-text"
                            >
                              {sec.content.subtitle}
                            </p>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                          {sec.content.items?.map((item: any, i: number) => (
                            <div
                              key={i}
                              className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2 hover:border-[#166534]/50 transition-colors"
                            >
                              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#166534] flex items-center justify-center font-bold text-sm">
                                {i + 1}
                              </div>
                              <h3
                                contentEditable
                                suppressContentEditableWarning
                                onFocus={() => setSelectedSectionId(sec.id)}
                                onBlur={(e) => updateSectionItem(sec.id, 'items', i, 'title', e.currentTarget.innerText)}
                                className="font-bold text-slate-800 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-400 rounded cursor-text"
                              >
                                {item.title}
                              </h3>
                              <p
                                contentEditable
                                suppressContentEditableWarning
                                onFocus={() => setSelectedSectionId(sec.id)}
                                onBlur={(e) => updateSectionItem(sec.id, 'items', i, 'desc', e.currentTarget.innerText)}
                                className="text-xs text-slate-500 leading-relaxed focus:outline-none focus:ring-1 focus:ring-emerald-400 rounded cursor-text"
                              >
                                {item.desc}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* SERVICES */}
                    {sec.type === 'services' && (
                      <div className="space-y-8 max-w-5xl mx-auto">
                        <div className="text-center max-w-xl mx-auto">
                          <h2
                            contentEditable
                            suppressContentEditableWarning
                            onFocus={() => setSelectedSectionId(sec.id)}
                            onBlur={(e) => updateSectionContent(sec.id, 'title', e.currentTarget.innerText)}
                            className="text-xl sm:text-2xl font-black text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-400 rounded cursor-text"
                          >
                            {sec.content.title}
                          </h2>
                          {sec.content.subtitle && (
                            <p
                              contentEditable
                              suppressContentEditableWarning
                              onFocus={() => setSelectedSectionId(sec.id)}
                              onBlur={(e) => updateSectionContent(sec.id, 'subtitle', e.currentTarget.innerText)}
                              className="text-xs text-slate-500 mt-1 focus:outline-none focus:ring-1 focus:ring-emerald-400 rounded cursor-text"
                            >
                              {sec.content.subtitle}
                            </p>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                          {sec.content.items?.map((item: any, i: number) => (
                            <div key={i} className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
                              <h3
                                contentEditable
                                suppressContentEditableWarning
                                onFocus={() => setSelectedSectionId(sec.id)}
                                onBlur={(e) => updateSectionItem(sec.id, 'items', i, 'title', e.currentTarget.innerText)}
                                className="font-bold text-slate-800 text-base focus:outline-none focus:ring-1 focus:ring-emerald-400 rounded cursor-text"
                              >
                                {item.title}
                              </h3>
                              <p
                                contentEditable
                                suppressContentEditableWarning
                                onFocus={() => setSelectedSectionId(sec.id)}
                                onBlur={(e) => updateSectionItem(sec.id, 'items', i, 'desc', e.currentTarget.innerText)}
                                className="text-xs text-slate-500 leading-relaxed focus:outline-none focus:ring-1 focus:ring-emerald-400 rounded cursor-text"
                              >
                                {item.desc}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* VIDEO SHOWCASE */}
                    {sec.type === 'video_showcase' && (
                      <div className="space-y-6 max-w-3xl mx-auto text-center text-white">
                        <div>
                          <h2
                            contentEditable
                            suppressContentEditableWarning
                            onFocus={() => setSelectedSectionId(sec.id)}
                            onBlur={(e) => updateSectionContent(sec.id, 'title', e.currentTarget.innerText)}
                            className="text-xl sm:text-2xl font-black focus:outline-none focus:ring-1 focus:ring-emerald-400 rounded cursor-text"
                          >
                            {sec.content.title}
                          </h2>
                          {sec.content.subtitle && (
                            <p
                              contentEditable
                              suppressContentEditableWarning
                              onFocus={() => setSelectedSectionId(sec.id)}
                              onBlur={(e) => updateSectionContent(sec.id, 'subtitle', e.currentTarget.innerText)}
                              className="text-xs text-slate-300 mt-1 focus:outline-none focus:ring-1 focus:ring-emerald-400 rounded cursor-text"
                            >
                              {sec.content.subtitle}
                            </p>
                          )}
                        </div>
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/20 aspect-video flex items-center justify-center bg-slate-800">
                          <img
                            src={sec.content.thumbnail_url || 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1000&auto=format&fit=crop&q=80'}
                            alt="Video Thumbnail"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-white/90 text-[#166534] flex items-center justify-center shadow-lg hover:scale-105 transition-transform cursor-pointer">
                              <Play size={28} className="ml-1" />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TESTIMONIALS */}
                    {sec.type === 'testimonials' && (
                      <div className="space-y-8 max-w-4xl mx-auto">
                        <div className="text-center">
                          <h2
                            contentEditable
                            suppressContentEditableWarning
                            onFocus={() => setSelectedSectionId(sec.id)}
                            onBlur={(e) => updateSectionContent(sec.id, 'title', e.currentTarget.innerText)}
                            className="text-xl sm:text-2xl font-black text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-400 rounded cursor-text"
                          >
                            {sec.content.title}
                          </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {sec.content.items?.map((t: any, i: number) => (
                            <div key={i} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
                              <div className="flex items-center gap-1 text-amber-400">
                                {[...Array(5)].map((_, s) => (
                                  <Star key={s} size={14} fill="currentColor" />
                                ))}
                              </div>
                              <p
                                contentEditable
                                suppressContentEditableWarning
                                onFocus={() => setSelectedSectionId(sec.id)}
                                onBlur={(e) => updateSectionItem(sec.id, 'items', i, 'quote', e.currentTarget.innerText)}
                                className="text-xs sm:text-sm text-slate-700 italic focus:outline-none focus:ring-1 focus:ring-emerald-400 rounded cursor-text"
                              >
                                "{t.quote}"
                              </p>
                              <div>
                                <p
                                  contentEditable
                                  suppressContentEditableWarning
                                  onFocus={() => setSelectedSectionId(sec.id)}
                                  onBlur={(e) => updateSectionItem(sec.id, 'items', i, 'author', e.currentTarget.innerText)}
                                  className="font-bold text-slate-900 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-400 rounded cursor-text"
                                >
                                  {t.author}
                                </p>
                                <p
                                  contentEditable
                                  suppressContentEditableWarning
                                  onFocus={() => setSelectedSectionId(sec.id)}
                                  onBlur={(e) => updateSectionItem(sec.id, 'items', i, 'role', e.currentTarget.innerText)}
                                  className="text-[11px] text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-400 rounded cursor-text"
                                >
                                  {t.role}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* PRICING */}
                    {sec.type === 'pricing' && (
                      <div className="space-y-8 max-w-5xl mx-auto">
                        <div className="text-center max-w-xl mx-auto">
                          <h2
                            contentEditable
                            suppressContentEditableWarning
                            onFocus={() => setSelectedSectionId(sec.id)}
                            onBlur={(e) => updateSectionContent(sec.id, 'title', e.currentTarget.innerText)}
                            className="text-xl sm:text-2xl font-black text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-400 rounded cursor-text"
                          >
                            {sec.content.title}
                          </h2>
                          {sec.content.subtitle && (
                            <p
                              contentEditable
                              suppressContentEditableWarning
                              onFocus={() => setSelectedSectionId(sec.id)}
                              onBlur={(e) => updateSectionContent(sec.id, 'subtitle', e.currentTarget.innerText)}
                              className="text-xs text-slate-500 mt-1 focus:outline-none focus:ring-1 focus:ring-emerald-400 rounded cursor-text"
                            >
                              {sec.content.subtitle}
                            </p>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {sec.content.items?.map((p: any, i: number) => (
                            <div
                              key={i}
                              className={`p-6 rounded-2xl flex flex-col justify-between transition-all ${p.popular
                                ? 'bg-[#12263A] text-white shadow-xl scale-102 border-2 border-[#166534]'
                                : 'bg-white text-slate-800 border border-slate-200 shadow-xs'
                                }`}
                            >
                              <div className="space-y-4">
                                {p.popular && (
                                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                    Most Popular
                                  </span>
                                )}
                                <div>
                                  <h3
                                    contentEditable
                                    suppressContentEditableWarning
                                    onFocus={() => setSelectedSectionId(sec.id)}
                                    onBlur={(e) => updateSectionItem(sec.id, 'items', i, 'name', e.currentTarget.innerText)}
                                    className="font-black text-lg focus:outline-none focus:ring-1 focus:ring-emerald-400 rounded cursor-text"
                                  >
                                    {p.name}
                                  </h3>
                                  <p
                                    contentEditable
                                    suppressContentEditableWarning
                                    onFocus={() => setSelectedSectionId(sec.id)}
                                    onBlur={(e) => updateSectionItem(sec.id, 'items', i, 'desc', e.currentTarget.innerText)}
                                    className="text-[11px] opacity-70 mt-0.5 focus:outline-none focus:ring-1 focus:ring-emerald-400 rounded cursor-text"
                                  >
                                    {p.desc}
                                  </p>
                                </div>
                                <div className="flex items-baseline gap-1">
                                  <span
                                    contentEditable
                                    suppressContentEditableWarning
                                    onFocus={() => setSelectedSectionId(sec.id)}
                                    onBlur={(e) => updateSectionItem(sec.id, 'items', i, 'price', e.currentTarget.innerText)}
                                    className="text-3xl font-black focus:outline-none focus:ring-1 focus:ring-emerald-400 rounded cursor-text"
                                  >
                                    {p.price}
                                  </span>
                                  <span
                                    contentEditable
                                    suppressContentEditableWarning
                                    onFocus={() => setSelectedSectionId(sec.id)}
                                    onBlur={(e) => updateSectionItem(sec.id, 'items', i, 'period', e.currentTarget.innerText)}
                                    className="text-xs opacity-70 focus:outline-none focus:ring-1 focus:ring-emerald-400 rounded cursor-text"
                                  >
                                    {p.period}
                                  </span>
                                </div>
                                <ul className="space-y-2 text-xs pt-2">
                                  {p.features?.map((f: string, fi: number) => (
                                    <li key={fi} className="flex items-center gap-2">
                                      <Check size={14} className={p.popular ? 'text-emerald-400 shrink-0' : 'text-[#166534] shrink-0'} />
                                      <span
                                        contentEditable
                                        suppressContentEditableWarning
                                        onFocus={() => setSelectedSectionId(sec.id)}
                                        onBlur={(e) => updatePricingFeature(sec.id, i, fi, e.currentTarget.innerText)}
                                        className="focus:outline-none focus:ring-1 focus:ring-emerald-400 rounded cursor-text"
                                      >
                                        {f}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <span
                                contentEditable
                                suppressContentEditableWarning
                                onFocus={() => setSelectedSectionId(sec.id)}
                                onBlur={(e) => updateSectionItem(sec.id, 'items', i, 'cta_text', e.currentTarget.innerText)}
                                className={`w-full mt-6 py-2.5 rounded-xl text-xs font-bold transition-all text-center block cursor-text focus:outline-none focus:ring-2 focus:ring-emerald-300 ${p.popular
                                  ? 'bg-[#166534] text-white shadow-md'
                                  : 'bg-slate-100 text-slate-800'
                                  }`}
                              >
                                {p.cta_text || 'Select Plan'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* FAQ */}
                    {sec.type === 'faq' && (
                      <div className="space-y-6 max-w-3xl mx-auto">
                        <div className="text-center">
                          <h2
                            contentEditable
                            suppressContentEditableWarning
                            onFocus={() => setSelectedSectionId(sec.id)}
                            onBlur={(e) => updateSectionContent(sec.id, 'title', e.currentTarget.innerText)}
                            className="text-xl sm:text-2xl font-black text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-400 rounded cursor-text"
                          >
                            {sec.content.title}
                          </h2>
                          {sec.content.subtitle && (
                            <p
                              contentEditable
                              suppressContentEditableWarning
                              onFocus={() => setSelectedSectionId(sec.id)}
                              onBlur={(e) => updateSectionContent(sec.id, 'subtitle', e.currentTarget.innerText)}
                              className="text-xs text-slate-500 mt-1 focus:outline-none focus:ring-1 focus:ring-emerald-400 rounded cursor-text"
                            >
                              {sec.content.subtitle}
                            </p>
                          )}
                        </div>
                        <div className="space-y-3">
                          {sec.content.items?.map((item: any, i: number) => (
                            <div key={i} className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1.5">
                              <h3 className="font-bold text-slate-800 text-xs sm:text-sm flex items-center justify-between">
                                <span
                                  contentEditable
                                  suppressContentEditableWarning
                                  onFocus={() => setSelectedSectionId(sec.id)}
                                  onBlur={(e) => updateSectionItem(sec.id, 'items', i, 'q', e.currentTarget.innerText)}
                                  className="focus:outline-none focus:ring-1 focus:ring-emerald-400 rounded cursor-text flex-1 pr-2"
                                >
                                  {item.q}
                                </span>
                                <ChevronDown size={14} className="text-slate-400 shrink-0" />
                              </h3>
                              <p
                                contentEditable
                                suppressContentEditableWarning
                                onFocus={() => setSelectedSectionId(sec.id)}
                                onBlur={(e) => updateSectionItem(sec.id, 'items', i, 'a', e.currentTarget.innerText)}
                                className="text-xs text-slate-500 leading-relaxed focus:outline-none focus:ring-1 focus:ring-emerald-400 rounded cursor-text"
                              >
                                {item.a}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* CTA BANNER */}
                    {sec.type === 'cta_banner' && (
                      <div className="text-center max-w-2xl mx-auto space-y-4 text-white">
                        <h2
                          contentEditable
                          suppressContentEditableWarning
                          onFocus={() => setSelectedSectionId(sec.id)}
                          onBlur={(e) => updateSectionContent(sec.id, 'title', e.currentTarget.innerText)}
                          className="text-2xl sm:text-3xl font-black focus:outline-none focus:ring-1 focus:ring-emerald-400 rounded cursor-text"
                        >
                          {sec.content.title}
                        </h2>
                        <p
                          contentEditable
                          suppressContentEditableWarning
                          onFocus={() => setSelectedSectionId(sec.id)}
                          onBlur={(e) => updateSectionContent(sec.id, 'subtitle', e.currentTarget.innerText)}
                          className="text-xs sm:text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-400 rounded cursor-text"
                        >
                          {sec.content.subtitle}
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                          <span
                            contentEditable
                            suppressContentEditableWarning
                            onFocus={() => setSelectedSectionId(sec.id)}
                            onBlur={(e) => updateSectionContent(sec.id, 'cta_text', e.currentTarget.innerText)}
                            className="px-6 py-2.5 bg-white text-[#166534] rounded-xl text-xs font-bold shadow-md hover:bg-slate-100 transition-all cursor-text inline-block focus:outline-none focus:ring-2 focus:ring-emerald-300"
                          >
                            {sec.content.cta_text || 'Get Started Now'}
                          </span>
                          {sec.content.secondary_cta_text && (
                            <span
                              contentEditable
                              suppressContentEditableWarning
                              onFocus={() => setSelectedSectionId(sec.id)}
                              onBlur={(e) => updateSectionContent(sec.id, 'secondary_cta_text', e.currentTarget.innerText)}
                              className="px-5 py-2.5 bg-transparent border border-white/60 text-white rounded-xl text-xs font-bold hover:bg-white/10 transition-all cursor-text inline-block focus:outline-none focus:ring-1 focus:ring-emerald-300"
                            >
                              {sec.content.secondary_cta_text}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* CONTACT FORM */}
                    {sec.type === 'contact_form' && (
                      <div className="max-w-xl mx-auto space-y-6">
                        <div className="text-center">
                          <h2
                            contentEditable
                            suppressContentEditableWarning
                            onFocus={() => setSelectedSectionId(sec.id)}
                            onBlur={(e) => updateSectionContent(sec.id, 'title', e.currentTarget.innerText)}
                            className="text-xl sm:text-2xl font-black text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-400 rounded cursor-text"
                          >
                            {sec.content.title}
                          </h2>
                          {sec.content.subtitle && (
                            <p
                              contentEditable
                              suppressContentEditableWarning
                              onFocus={() => setSelectedSectionId(sec.id)}
                              onBlur={(e) => updateSectionContent(sec.id, 'subtitle', e.currentTarget.innerText)}
                              className="text-xs text-slate-500 mt-1 focus:outline-none focus:ring-1 focus:ring-emerald-400 rounded cursor-text"
                            >
                              {sec.content.subtitle}
                            </p>
                          )}
                        </div>
                        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-700">Full Name</label>
                            <input
                              type="text"
                              disabled
                              placeholder="John Doe"
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-700">Email Address</label>
                            <input
                              type="email"
                              disabled
                              placeholder="john@example.com"
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-700">Phone (WhatsApp)</label>
                            <input
                              type="tel"
                              disabled
                              placeholder="+1 555-0199"
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                            />
                          </div>
                          <div className="pt-2 text-center">
                            <span
                              contentEditable
                              suppressContentEditableWarning
                              onFocus={() => setSelectedSectionId(sec.id)}
                              onBlur={(e) => updateSectionContent(sec.id, 'submit_button_text', e.currentTarget.innerText)}
                              className="w-full py-2.5 rounded-xl font-bold text-white text-xs shadow-md transition-all cursor-text block focus:outline-none focus:ring-2 focus:ring-emerald-300"
                              style={{ backgroundColor: theme.primary_color }}
                            >
                              {sec.content.submit_button_text || 'Submit Inquiry'}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* FOOTER */}
                    {sec.type === 'footer' && (
                      <div className="text-center text-slate-400 text-xs space-y-2">
                        <p
                          contentEditable
                          suppressContentEditableWarning
                          onFocus={() => setSelectedSectionId(sec.id)}
                          onBlur={(e) => updateSectionContent(sec.id, 'copyright', e.currentTarget.innerText)}
                          className="focus:outline-none focus:ring-1 focus:ring-emerald-400 rounded cursor-text"
                        >
                          {sec.content.copyright}
                        </p>
                        <div className="flex items-center justify-center gap-4 text-[11px]">
                          {sec.content.links?.map((link: string, i: number) => (
                            <span
                              key={i}
                              contentEditable
                              suppressContentEditableWarning
                              onFocus={() => setSelectedSectionId(sec.id)}
                              onBlur={(e) => updateSectionArrayValue(sec.id, 'links', i, e.currentTarget.innerText)}
                              className="hover:text-slate-200 transition-colors cursor-text focus:outline-none focus:ring-1 focus:ring-emerald-400 rounded px-1"
                            >
                              {link}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Bottom Add Section Pill */}
            <div className="p-6 text-center bg-slate-50 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setLeftTab('blocks')}
                className="px-5 py-2.5 bg-white hover:bg-slate-50 text-[#166534] border border-emerald-300 rounded-xl text-xs font-bold transition-all shadow-xs inline-flex items-center gap-2 cursor-pointer"
              >
                <Plus size={16} />
                <span>Add Section Block</span>
              </button>
            </div>
          </div>
        </main>

        {/* ================= COLUMN 3: RIGHT CONTEXTUAL PROPERTIES INSPECTOR (320px) ================= */}
        <aside className="w-80 bg-white border-l border-slate-200 flex flex-col shrink-0 z-20 shadow-2xs">
          {selectedSection ? (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Header */}
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div>
                  <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Sliders size={14} className="text-[#166534]" />
                    <span>{selectedSection.name}</span>
                  </h3>
                  <span className="text-[10px] text-slate-400 capitalize block">
                    Position {selectedSectionIndex + 1} of {sections.length} • {selectedSection.type}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={selectedSectionIndex === 0}
                    onClick={() => moveSection(selectedSectionIndex, 'up')}
                    className="p-1 hover:bg-[#166534] hover:text-white rounded text-slate-600 disabled:opacity-20 cursor-pointer transition-colors"
                    title="Move Up (↑)"
                  >
                    <ChevronUp size={14} />
                  </button>
                  <button
                    type="button"
                    disabled={selectedSectionIndex === sections.length - 1}
                    onClick={() => moveSection(selectedSectionIndex, 'down')}
                    className="p-1 hover:bg-[#166534] hover:text-white rounded text-slate-600 disabled:opacity-20 cursor-pointer transition-colors"
                    title="Move Down (↓)"
                  >
                    <ChevronDown size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedSectionId(null)}
                    className="p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer ml-1"
                    title="Close Inspector (Show Page Settings)"
                  >
                    <X size={15} />
                  </button>
                </div>
              </div>

              {/* Inspector Tabs */}
              <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setInspectorTab('content')}
                  className={`flex-1 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${inspectorTab === 'content'
                    ? 'bg-white text-[#166534] shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                    }`}
                >
                  Content
                </button>
                <button
                  type="button"
                  onClick={() => setInspectorTab('style')}
                  className={`flex-1 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${inspectorTab === 'style'
                    ? 'bg-white text-[#166534] shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                    }`}
                >
                  Design & Style
                </button>
              </div>

              {/* Inspector Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs custom-scrollbar">
                {/* TAB 1: CONTENT CONTROLS */}
                {inspectorTab === 'content' && (
                  <div className="space-y-4">
                    {/* Badge */}
                    {selectedSection.content.badge !== undefined && (
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Badge Text</label>
                        <input
                          type="text"
                          value={selectedSection.content.badge || ''}
                          onChange={(e) => updateSectionContent(selectedSection.id, 'badge', e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#166534]"
                        />
                      </div>
                    )}

                    {/* Title */}
                    {selectedSection.content.title !== undefined && (
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Heading Title</label>
                        <textarea
                          rows={2}
                          value={selectedSection.content.title || ''}
                          onChange={(e) => updateSectionContent(selectedSection.id, 'title', e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#166534]"
                        />
                      </div>
                    )}

                    {/* Subtitle / Description */}
                    {selectedSection.content.subtitle !== undefined && (
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Subtitle / Body Text</label>
                        <textarea
                          rows={3}
                          value={selectedSection.content.subtitle || ''}
                          onChange={(e) => updateSectionContent(selectedSection.id, 'subtitle', e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#166534]"
                        />
                      </div>
                    )}

                    {/* Image URL (Hero & Showcase) */}
                    {selectedSection.content.image_url !== undefined && (
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="font-bold text-slate-700 block">Mockup / Banner Image URL</label>
                          <button
                            type="button"
                            onClick={() => {
                              setMediaPickerType('image');
                              setIsMediaPickerOpen(true);
                            }}
                            className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                          >
                            <ImageIcon size={12} />
                            Choose from Media Library
                          </button>
                        </div>
                        <input
                          type="text"
                          value={selectedSection.content.image_url || ''}
                          onChange={(e) => updateSectionContent(selectedSection.id, 'image_url', e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#166534]"
                        />
                      </div>
                    )}

                    {/* Video URL (Video Showcase) */}
                    {selectedSection.type === 'video_showcase' && (
                      <>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="font-bold text-slate-700 block">Video Stream URL</label>
                            <button
                              type="button"
                              onClick={() => {
                                setMediaPickerType('video');
                                setIsMediaPickerOpen(true);
                              }}
                              className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                            >
                              <Film size={12} />
                              Choose from Media Library
                            </button>
                          </div>
                          <input
                            type="text"
                            value={selectedSection.content.video_url || ''}
                            onChange={(e) => updateSectionContent(selectedSection.id, 'video_url', e.target.value)}
                            placeholder="https://..."
                            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Video Poster / Thumbnail</label>
                          <input
                            type="text"
                            value={selectedSection.content.thumbnail_url || ''}
                            onChange={(e) => updateSectionContent(selectedSection.id, 'thumbnail_url', e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                          />
                        </div>
                      </>
                    )}

                    {/* CTA Button 1 */}
                    {selectedSection.content.cta_text !== undefined && (
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                        <span className="font-bold text-slate-700 block text-[11px]">Primary Button</span>
                        <div>
                          <label className="text-[10px] text-slate-500 block mb-0.5">Button Label</label>
                          <input
                            type="text"
                            value={selectedSection.content.cta_text || ''}
                            onChange={(e) => updateSectionContent(selectedSection.id, 'cta_text', e.target.value)}
                            className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-slate-800"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500 block mb-0.5">Target Link / Anchor</label>
                          <input
                            type="text"
                            value={selectedSection.content.cta_url || ''}
                            onChange={(e) => updateSectionContent(selectedSection.id, 'cta_url', e.target.value)}
                            placeholder="#contact"
                            className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-slate-800 font-mono text-[11px]"
                          />
                        </div>
                      </div>
                    )}

                    {/* CTA Button 2 */}
                    {selectedSection.content.secondary_cta_text !== undefined && (
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                        <span className="font-bold text-slate-700 block text-[11px]">Secondary Button</span>
                        <div>
                          <label className="text-[10px] text-slate-500 block mb-0.5">Button Label</label>
                          <input
                            type="text"
                            value={selectedSection.content.secondary_cta_text || ''}
                            onChange={(e) => updateSectionContent(selectedSection.id, 'secondary_cta_text', e.target.value)}
                            className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-slate-800"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500 block mb-0.5">Target Link</label>
                          <input
                            type="text"
                            value={selectedSection.content.secondary_cta_url || ''}
                            onChange={(e) => updateSectionContent(selectedSection.id, 'secondary_cta_url', e.target.value)}
                            placeholder="#features"
                            className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-slate-800 font-mono text-[11px]"
                          />
                        </div>
                      </div>
                    )}

                    {/* LOGO CLOUD: Logos List Editor */}
                    {selectedSection.type === 'logo_cloud' && (
                      <div className="space-y-2.5 pt-2 border-t border-slate-200">
                        <div className="flex items-center justify-between">
                          <label className="font-bold text-slate-700">Company Logos ({selectedSection.content.logos?.length || 0})</label>
                          <button
                            type="button"
                            onClick={() => addSectionItem(selectedSection.id, 'logos', { name: 'New Partner', icon: 'Building2' })}
                            className="text-[10px] font-bold text-[#166534] hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <Plus size={12} />
                            <span>Add Logo</span>
                          </button>
                        </div>
                        <div className="space-y-2">
                          {selectedSection.content.logos?.map((logo: any, li: number) => (
                            <div key={li} className="flex items-center gap-1.5 p-2 bg-slate-50 border border-slate-200 rounded-lg">
                              <Building2 size={14} className="text-slate-400 shrink-0" />
                              <input
                                type="text"
                                value={logo.name || ''}
                                onChange={(e) => updateSectionItem(selectedSection.id, 'logos', li, 'name', e.target.value)}
                                className="flex-1 px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-800"
                                placeholder="Company Name"
                              />
                              <button
                                type="button"
                                onClick={() => removeSectionItem(selectedSection.id, 'logos', li)}
                                className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                                title="Remove Logo"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* STATS: Metric Counters List Editor */}
                    {selectedSection.type === 'stats' && (
                      <div className="space-y-2.5 pt-2 border-t border-slate-200">
                        <div className="flex items-center justify-between">
                          <label className="font-bold text-slate-700">Metric Counters ({selectedSection.content.items?.length || 0})</label>
                          <button
                            type="button"
                            onClick={() => addSectionItem(selectedSection.id, 'items', { value: '100%', label: 'Metric Label' })}
                            className="text-[10px] font-bold text-[#166534] hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <Plus size={12} />
                            <span>Add Metric</span>
                          </button>
                        </div>
                        <div className="space-y-2">
                          {selectedSection.content.items?.map((item: any, si: number) => (
                            <div key={si} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-[11px] text-slate-600">Metric #{si + 1}</span>
                                <button
                                  type="button"
                                  onClick={() => removeSectionItem(selectedSection.id, 'items', si)}
                                  className="text-slate-400 hover:text-rose-600 p-0.5"
                                  title="Delete Metric"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                              <input
                                type="text"
                                value={item.value || ''}
                                onChange={(e) => updateSectionItem(selectedSection.id, 'items', si, 'value', e.target.value)}
                                placeholder="Value (e.g. 99.98%)"
                                className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-800 font-bold"
                              />
                              <input
                                type="text"
                                value={item.label || ''}
                                onChange={(e) => updateSectionItem(selectedSection.id, 'items', si, 'label', e.target.value)}
                                placeholder="Label (e.g. Uptime SLA)"
                                className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-800"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* FEATURES / SERVICES: Cards List Editor */}
                    {(selectedSection.type === 'features' || selectedSection.type === 'services') && (
                      <div className="space-y-2.5 pt-2 border-t border-slate-200">
                        <div className="flex items-center justify-between">
                          <label className="font-bold text-slate-700">Cards / Items ({selectedSection.content.items?.length || 0})</label>
                          <button
                            type="button"
                            onClick={() => addSectionItem(selectedSection.id, 'items', { title: 'New Advantage', desc: 'Detailed description of this feature or capability.' })}
                            className="text-[10px] font-bold text-[#166534] hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <Plus size={12} />
                            <span>Add Card</span>
                          </button>
                        </div>
                        <div className="space-y-2">
                          {selectedSection.content.items?.map((item: any, fi: number) => (
                            <div key={fi} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-[11px] text-slate-600">Card #{fi + 1}</span>
                                <button
                                  type="button"
                                  onClick={() => removeSectionItem(selectedSection.id, 'items', fi)}
                                  className="text-slate-400 hover:text-rose-600 p-0.5"
                                  title="Delete Card"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                              <input
                                type="text"
                                value={item.title || ''}
                                onChange={(e) => updateSectionItem(selectedSection.id, 'items', fi, 'title', e.target.value)}
                                placeholder="Title"
                                className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-800 font-bold"
                              />
                              <textarea
                                rows={2}
                                value={item.desc || ''}
                                onChange={(e) => updateSectionItem(selectedSection.id, 'items', fi, 'desc', e.target.value)}
                                placeholder="Description"
                                className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-800"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* TESTIMONIALS: Testimonial Cards Editor */}
                    {selectedSection.type === 'testimonials' && (
                      <div className="space-y-2.5 pt-2 border-t border-slate-200">
                        <div className="flex items-center justify-between">
                          <label className="font-bold text-slate-700">Testimonials ({selectedSection.content.items?.length || 0})</label>
                          <button
                            type="button"
                            onClick={() => addSectionItem(selectedSection.id, 'items', { quote: 'This service exceeded our expectations.', author: 'Client Name', role: 'Executive' })}
                            className="text-[10px] font-bold text-[#166534] hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <Plus size={12} />
                            <span>Add Review</span>
                          </button>
                        </div>
                        <div className="space-y-2.5">
                          {selectedSection.content.items?.map((item: any, ti: number) => (
                            <div key={ti} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-[11px] text-slate-600">Review #{ti + 1}</span>
                                <button
                                  type="button"
                                  onClick={() => removeSectionItem(selectedSection.id, 'items', ti)}
                                  className="text-slate-400 hover:text-rose-600 p-0.5"
                                  title="Delete Review"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                              <textarea
                                rows={2}
                                value={item.quote || ''}
                                onChange={(e) => updateSectionItem(selectedSection.id, 'items', ti, 'quote', e.target.value)}
                                placeholder="Customer endorsement..."
                                className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-800"
                              />
                              <div className="grid grid-cols-2 gap-1.5">
                                <input
                                  type="text"
                                  value={item.author || ''}
                                  onChange={(e) => updateSectionItem(selectedSection.id, 'items', ti, 'author', e.target.value)}
                                  placeholder="Author Name"
                                  className="px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-800"
                                />
                                <input
                                  type="text"
                                  value={item.role || ''}
                                  onChange={(e) => updateSectionItem(selectedSection.id, 'items', ti, 'role', e.target.value)}
                                  placeholder="Role / Company"
                                  className="px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-800"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* PRICING: Tier Plans Editor */}
                    {selectedSection.type === 'pricing' && (
                      <div className="space-y-3 pt-2 border-t border-slate-200">
                        <div className="flex items-center justify-between">
                          <label className="font-bold text-slate-700">Pricing Plans ({selectedSection.content.items?.length || 0})</label>
                          <button
                            type="button"
                            onClick={() =>
                              addSectionItem(selectedSection.id, 'items', {
                                name: 'Pro Tier',
                                price: '$129',
                                period: '/mo',
                                desc: 'For growing businesses.',
                                features: ['Feature 1', 'Feature 2', 'Feature 3'],
                                cta_text: 'Get Started',
                              })
                            }
                            className="text-[10px] font-bold text-[#166534] hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <Plus size={12} />
                            <span>Add Tier</span>
                          </button>
                        </div>
                        <div className="space-y-3">
                          {selectedSection.content.items?.map((plan: any, pi: number) => (
                            <div key={pi} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-xs text-slate-800">Plan #{pi + 1} ({plan.name})</span>
                                <button
                                  type="button"
                                  onClick={() => removeSectionItem(selectedSection.id, 'items', pi)}
                                  className="text-slate-400 hover:text-rose-600 p-0.5"
                                  title="Delete Plan"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                              <div className="grid grid-cols-2 gap-1.5">
                                <div>
                                  <label className="text-[10px] text-slate-500">Plan Name</label>
                                  <input
                                    type="text"
                                    value={plan.name || ''}
                                    onChange={(e) => updateSectionItem(selectedSection.id, 'items', pi, 'name', e.target.value)}
                                    className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-800 font-bold"
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] text-slate-500">Price</label>
                                  <input
                                    type="text"
                                    value={plan.price || ''}
                                    onChange={(e) => updateSectionItem(selectedSection.id, 'items', pi, 'price', e.target.value)}
                                    className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-800 font-bold"
                                  />
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-1.5">
                                <div>
                                  <label className="text-[10px] text-slate-500">Period</label>
                                  <input
                                    type="text"
                                    value={plan.period || ''}
                                    onChange={(e) => updateSectionItem(selectedSection.id, 'items', pi, 'period', e.target.value)}
                                    placeholder="/mo"
                                    className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-800"
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] text-slate-500">Button Label</label>
                                  <input
                                    type="text"
                                    value={plan.cta_text || ''}
                                    onChange={(e) => updateSectionItem(selectedSection.id, 'items', pi, 'cta_text', e.target.value)}
                                    className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-800"
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="text-[10px] text-slate-500">Description</label>
                                <input
                                  type="text"
                                  value={plan.desc || ''}
                                  onChange={(e) => updateSectionItem(selectedSection.id, 'items', pi, 'desc', e.target.value)}
                                  className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-800"
                                />
                              </div>
                              <div className="pt-1 flex items-center justify-between">
                                <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-slate-700 font-semibold">
                                  <input
                                    type="checkbox"
                                    checked={Boolean(plan.popular)}
                                    onChange={(e) => updateSectionItem(selectedSection.id, 'items', pi, 'popular', e.target.checked)}
                                    className="rounded text-[#166534]"
                                  />
                                  <span>Highlight as Popular</span>
                                </label>
                              </div>
                              {/* Bullets List */}
                              <div className="pt-2 border-t border-slate-200/80 space-y-1.5">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-bold text-slate-600">Feature Bullets</span>
                                  <button
                                    type="button"
                                    onClick={() => addPricingFeature(selectedSection.id, pi, 'New Feature')}
                                    className="text-[10px] text-[#166534] font-bold hover:underline"
                                  >
                                    + Add Feature
                                  </button>
                                </div>
                                {plan.features?.map((feat: string, fi: number) => (
                                  <div key={fi} className="flex items-center gap-1">
                                    <input
                                      type="text"
                                      value={feat}
                                      onChange={(e) => updatePricingFeature(selectedSection.id, pi, fi, e.target.value)}
                                      className="flex-1 px-2 py-0.5 bg-white border border-slate-200 rounded text-xs"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => removePricingFeature(selectedSection.id, pi, fi)}
                                      className="p-1 text-slate-400 hover:text-rose-600"
                                    >
                                      <Trash2 size={12} />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* FAQ: Questions List Editor */}
                    {selectedSection.type === 'faq' && (
                      <div className="space-y-2.5 pt-2 border-t border-slate-200">
                        <div className="flex items-center justify-between">
                          <label className="font-bold text-slate-700">FAQ Questions ({selectedSection.content.items?.length || 0})</label>
                          <button
                            type="button"
                            onClick={() => addSectionItem(selectedSection.id, 'items', { q: 'Frequently asked question?', a: 'Detailed answer resolving the question.' })}
                            className="text-[10px] font-bold text-[#166534] hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <Plus size={12} />
                            <span>Add Question</span>
                          </button>
                        </div>
                        <div className="space-y-2.5">
                          {selectedSection.content.items?.map((faqItem: any, qi: number) => (
                            <div key={qi} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-[11px] text-slate-600">Question #{qi + 1}</span>
                                <button
                                  type="button"
                                  onClick={() => removeSectionItem(selectedSection.id, 'items', qi)}
                                  className="text-slate-400 hover:text-rose-600 p-0.5"
                                  title="Delete Question"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                              <input
                                type="text"
                                value={faqItem.q || ''}
                                onChange={(e) => updateSectionItem(selectedSection.id, 'items', qi, 'q', e.target.value)}
                                placeholder="Question"
                                className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-800 font-bold"
                              />
                              <textarea
                                rows={2}
                                value={faqItem.a || ''}
                                onChange={(e) => updateSectionItem(selectedSection.id, 'items', qi, 'a', e.target.value)}
                                placeholder="Answer"
                                className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-800"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* CONTACT FORM: Connected Form Picker */}
                    {selectedSection.type === 'contact_form' && (
                      <div className="space-y-3 pt-2 border-t border-slate-200">
                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Submit Button Text</label>
                          <input
                            type="text"
                            value={selectedSection.content.submit_button_text || ''}
                            onChange={(e) => updateSectionContent(selectedSection.id, 'submit_button_text', e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Connected CRM Form</label>
                          <select
                            value={selectedSection.content.form_id || ''}
                            onChange={(e) => updateSectionContent(selectedSection.id, 'form_id', e.target.value ? Number(e.target.value) : null)}
                            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                          >
                            <option value="">Default Contact Form</option>
                            {availableForms.map((f) => (
                              <option key={f.id} value={f.id}>
                                {f.name} ({f.category})
                              </option>
                            ))}
                          </select>
                          <p className="text-[10px] text-slate-400 mt-1">
                            Submissions will map directly into your CRM contacts and trigger automations.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* FOOTER: Links & Copyright Editor */}
                    {selectedSection.type === 'footer' && (
                      <div className="space-y-3 pt-2 border-t border-slate-200">
                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Copyright Notice</label>
                          <input
                            type="text"
                            value={selectedSection.content.copyright || ''}
                            onChange={(e) => updateSectionContent(selectedSection.id, 'copyright', e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="font-bold text-slate-700">Footer Links</label>
                            <button
                              type="button"
                              onClick={() => addSectionArrayValue(selectedSection.id, 'links', 'New Link')}
                              className="text-[10px] font-bold text-[#166534] hover:underline"
                            >
                              + Add Link
                            </button>
                          </div>
                          {selectedSection.content.links?.map((link: string, li: number) => (
                            <div key={li} className="flex items-center gap-1.5">
                              <input
                                type="text"
                                value={link}
                                onChange={(e) => updateSectionArrayValue(selectedSection.id, 'links', li, e.target.value)}
                                className="flex-1 px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-800"
                              />
                              <button
                                type="button"
                                onClick={() => removeSectionArrayValue(selectedSection.id, 'links', li)}
                                className="p-1 text-slate-400 hover:text-rose-600"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 2: STYLE CONTROLS */}
                {inspectorTab === 'style' && (
                  <div className="space-y-4">
                    {/* Background Color */}
                    <div>
                      <label className="font-bold text-slate-700 block mb-1.5">Background Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={selectedSection.settings?.bg_color || '#FFFFFF'}
                          onChange={(e) => updateSectionSettings(selectedSection.id, 'bg_color', e.target.value)}
                          className="w-8 h-8 rounded border border-slate-300 cursor-pointer p-0.5"
                        />
                        <input
                          type="text"
                          value={selectedSection.settings?.bg_color || '#FFFFFF'}
                          onChange={(e) => updateSectionSettings(selectedSection.id, 'bg_color', e.target.value)}
                          className="w-24 px-2 py-1 font-mono text-xs bg-slate-50 border border-slate-200 rounded"
                        />
                      </div>
                      <div className="flex gap-1.5 mt-2">
                        {['#FFFFFF', '#F8FAFC', '#F1F5F9', '#0F172A', '#166534', '#1E293B', '#FDF2F8'].map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => updateSectionSettings(selectedSection.id, 'bg_color', c)}
                            className="w-6 h-6 rounded-md border border-slate-300 shadow-2xs cursor-pointer hover:scale-110 transition-transform"
                            style={{ backgroundColor: c }}
                            title={c}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Spacing / Padding */}
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Vertical Padding</label>
                      <select
                        value={selectedSection.settings?.padding_top || 'py-16'}
                        onChange={(e) => {
                          updateSectionSettings(selectedSection.id, 'padding_top', e.target.value);
                          updateSectionSettings(selectedSection.id, 'padding_bottom', e.target.value);
                        }}
                        className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                      >
                        <option value="py-8">Compact (32px)</option>
                        <option value="py-12">Normal (48px)</option>
                        <option value="py-16">Comfortable (64px)</option>
                        <option value="py-20">Spacious (80px)</option>
                        <option value="py-24">Extra Large (96px)</option>
                      </select>
                    </div>

                    {/* Section Visibility */}
                    <div className="pt-2 border-t border-slate-200">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedSection.visible !== false}
                          onChange={(e) => {
                            setSections((prev) =>
                              prev.map((s) => (s.id === selectedSection.id ? { ...s, visible: e.target.checked } : s))
                            );
                          }}
                          className="rounded text-[#166534] focus:ring-[#166534]"
                        />
                        <span className="font-bold text-slate-700">Section Visible on Page</span>
                      </label>
                    </div>

                    {/* Delete Section */}
                    <div className="pt-4 border-t border-slate-200">
                      <button
                        type="button"
                        onClick={() => deleteSection(selectedSectionIndex)}
                        className="w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Trash2 size={14} />
                        <span>Delete Section</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* DEFAULT: PAGE PROPERTIES INSPECTOR */
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs custom-scrollbar">
              <div className="pb-3 border-b border-slate-100">
                <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Sliders size={14} className="text-[#166534]" />
                  <span>Page Properties</span>
                </h3>
                <p className="text-[10px] text-slate-400">Click any canvas section or select from the list below to edit its content.</p>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Page Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Custom URL Slug</label>
                <div className="flex items-center gap-1 font-mono bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
                  <span className="text-slate-400">/p/</span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ''))}
                    className="flex-1 bg-transparent focus:outline-none text-slate-800"
                  />
                </div>
              </div>

              {/* Sections Quick Selector */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <span className="font-bold text-slate-700 block text-[11px]">Page Sections ({sections.length})</span>
                <div className="space-y-1">
                  {sections.map((s, i) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        setSelectedSectionId(s.id);
                        document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }}
                      className="w-full text-left px-2 py-1.5 bg-white hover:bg-emerald-50 hover:text-[#166534] border border-slate-200 rounded-lg text-xs font-semibold flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <span className="truncate">{i + 1}. {s.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono capitalize">{s.type}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Theme Preview */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700">Theme Palette</span>
                  <button
                    type="button"
                    onClick={() => setIsThemeModalOpen(true)}
                    className="text-[11px] font-bold text-[#166534] hover:underline cursor-pointer"
                  >
                    Change
                  </button>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-md shadow-2xs border border-black/10" style={{ backgroundColor: theme.primary_color }} />
                  <div className="w-5 h-5 rounded-md shadow-2xs border border-black/10" style={{ backgroundColor: theme.secondary_color }} />
                  <div className="w-5 h-5 rounded-md shadow-2xs border border-black/10" style={{ backgroundColor: theme.background_color }} />
                  <span className="text-[11px] text-slate-500 font-medium ml-1">{theme.font_family?.split(',')[0]}</span>
                </div>
              </div>

              {/* SEO Summary */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700">SEO & Tracking</span>
                  <button
                    type="button"
                    onClick={() => setIsSeoModalOpen(true)}
                    className="text-[11px] font-bold text-[#166534] hover:underline cursor-pointer"
                  >
                    Configure
                  </button>
                </div>
                <p className="text-[11px] text-slate-500">
                  {seo.custom_head_code ? 'Custom tracking scripts configured.' : 'No custom tracking scripts configured.'}
                </p>
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* ================= 3. MODALS ================= */}
      <TemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onApplyTemplate={(template) => {
          setSections(template.sections);
          setTheme(template.theme);
          setTitle(template.title);
          pushHistory(template.sections);
          if (template.sections.length > 0) {
            setSelectedSectionId(template.sections[0].id);
          }
        }}
      />

      <SeoTrackingModal
        isOpen={isSeoModalOpen}
        onClose={() => setIsSeoModalOpen(false)}
        seo={seo}
        slug={slug}
        onSave={(updatedSeo, updatedSlug) => {
          setSeo(updatedSeo);
          setSlug(updatedSlug);
        }}
      />

      <ThemePaletteModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        theme={theme}
        onSaveTheme={(updatedTheme) => setTheme(updatedTheme)}
      />

      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        allowedTypes={mediaPickerType}
        title={`Select ${mediaPickerType === 'image' ? 'Image' : 'Video'} for Page Section`}
        onSelect={(asset) => {
          if (selectedSection) {
            if (mediaPickerType === 'image') {
              updateSectionContent(selectedSection.id, 'image_url', asset.url);
            } else {
              updateSectionContent(selectedSection.id, 'video_url', asset.url);
            }
          }
        }}
      />
    </div>
  );
}
