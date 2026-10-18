import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { useBrandingStore } from '../../store/brandingStore';
import { useI18n } from '../../i18n';
import { cn } from '../../lib/utils';

// ==========================================
// KNOWLEDGE BASE - Bilingual Q&A Pairs
// ==========================================
interface QAPair {
  keywords: string[];
  answerEn: string;
  answerAr: string;
  followUpEn?: string;
  followUpAr?: string;
}

const knowledgeBase: QAPair[] = [
  {
    keywords: ['price', 'pricing', 'cost', 'plan', 'plans', 'subscription', 'fee', 'how much', 'package', 'سعر', 'اسعار', 'أسعار', 'باقات', 'تكلفة', 'اشتراك'],
    answerEn: 'We offer three flexible plans:\n\n• **Starter** — Free, up to 1,000 contacts\n• **Business** — $49/mo, up to 10,000 contacts with AI & automation\n• **Enterprise** — Custom pricing with unlimited contacts & dedicated support\n\nAll plans include WhatsApp API integration and CRM access.',
    answerAr: 'نقدم ثلاث باقات مرنة:\n\n• **البداية (Starter)** — مجانية، حتى 1,000 جهة اتصال\n• **الأعمال (Business)** — 49 دولار/شهريًا، حتى 10,000 جهة اتصال مع الذكاء الاصطناعي والأتمتة\n• **المؤسسات (Enterprise)** — أسعار مخصصة مع جهات اتصال غير محدودة ودعم مخصص\n\nتشمل جميع الباقات الربط مع واجهة واتساب الرسمية ونظام إدارة علاقات العملاء.',
    followUpEn: 'Would you like to start a free trial or speak to our sales team?',
    followUpAr: 'هل ترغب في بدء تجربة مجانية أو التحدث مع فريق المبيعات؟'
  },
  {
    keywords: ['whatsapp', 'api', 'meta', 'connect', 'integration', 'integrate', 'واتساب', 'واتس', 'ربط', 'تكامل', 'ميتا'],
    answerEn: 'We connect directly to Meta\'s official WhatsApp Business Cloud API. You simply provide your access token and phone number ID — we handle the rest. This ensures 100% security, zero server maintenance, and reliable message delivery.',
    answerAr: 'نتصل مباشرة بواجهة برمجة تطبيقات السحابة الرسمية لـ WhatsApp Business من Meta. ما عليك سوى إدخال رمز الوصول ومعرف رقم الهاتف — ونحن نتولى الباقي. يضمن ذلك أمانًا بنسبة 100%، وبدون صيانة للخوادم، وتسليمًا موثوقًا للرسائل.',
    followUpEn: 'Need help setting up your WhatsApp Business API? Book a demo with our team!',
    followUpAr: 'هل تحتاج إلى مساعدة في إعداد WhatsApp Business API؟ احجز عرضًا توضيحيًا مع فريقنا!'
  },
  {
    keywords: ['demo', 'book', 'meeting', 'call', 'schedule', 'consultation', 'عرض', 'احجز', 'موعد', 'استشارة', 'مكالمة'],
    answerEn: 'We\'d love to give you a personalized demo! You can book a live demo session with our team where we\'ll walk you through all platform features, answer your questions, and help you get started.',
    answerAr: 'يسعدنا أن نقدم لك عرضًا توضيحيًا مخصصًا! يمكنك حجز جلسة عرض مباشر مع فريقنا حيث سنشرح لك جميع ميزات المنصة، ونجيب على أسئلتك، ونساعدك على البدء.',
    followUpEn: 'Visit our Contact page to schedule your free demo session.',
    followUpAr: 'تفضل بزيارة صفحة "تواصل معنا" لجدولة جلسة العرض المجانية الخاصة بك.'
  },
  {
    keywords: ['feature', 'features', 'what can', 'capabilities', 'offer', 'service', 'services', 'ميزات', 'خدمات', 'ماذا تقدم', 'خصائص'],
    answerEn: 'ThrobTech is a complete customer communication platform:\n\n• 📣 WhatsApp Marketing Campaigns\n• 🤖 AI-Powered Auto-Replies\n• 📅 Appointment Booking Automation\n• 💬 Omnichannel Inbox (WhatsApp, Instagram, FB, Email)\n• 📊 CRM & Lead Management\n• 🔗 Click-to-WhatsApp Ads Integration\n• 📱 Social Media Planner\n• 📄 Landing Page & Form Builder',
    answerAr: 'تعد ThrobTech منصة متكاملة للتواصل مع العملاء:\n\n• 📣 حملات واتساب التسويقية الموجهة\n• 🤖 ردود تلقائية ذكية بالذكاء الاصطناعي\n• 📅 أتمتة حجز المواعيد والخدمات\n• 💬 صندوق وارد متعدد القنوات (واتساب، إنستغرام، فيسبوك، البريد)\n• 📊 إدارة علاقات العملاء وتتبع المبيعات\n• 🔗 ربط إعلانات النقر إلى واتساب\n• 📱 جدول ومخطط منشورات التواصل الاجتماعي\n• 📄 منشئ صفحات الهبوط والنماذج التفاعلية',
  },
  {
    keywords: ['ai', 'artificial', 'intelligence', 'chatbot', 'bot', 'automated', 'auto reply', 'auto-reply', 'copilot', 'ذكاء', 'اصطناعي', 'روبوت', 'مساعد', 'رد تلقائي'],
    answerEn: 'Our AI Copilot provides intelligent automated responses 24/7. It can:\n\n• Answer customer inquiries instantly\n• Detect customer intent and route conversations\n• Draft personalized replies for agent approval\n• Handle appointment booking flows automatically\n• Respond to Google Reviews\n\nAll powered by advanced AI models integrated into your WhatsApp Business account.',
    answerAr: 'يوفر مساعد الذكاء الاصطناعي ردودًا ذكية ومؤتمتة على مدار الساعة طوال أيام الأسبوع:\n\n• الرد الفوري على استفسارات العملاء\n• اكتشاف نية العميل وتوجيه المحادثة للفريق المختص\n• صياغة ردود مخصصة لاعتماد الموظف\n• معالجة مسار حجز المواعيد تلقائيًا\n• الرد على تقييمات Google\n\nوكل ذلك مدعوم بنماذج ذكاء اصطناعي متقدمة مدمجة في حساب WhatsApp Business الخاص بك.',
  },
  {
    keywords: ['appointment', 'booking', 'book appointment', 'schedule', 'calendar', 'clinic', 'doctor', 'salon', 'حجز', 'مواعيد', 'عيادة', 'طبيب', 'صالون', 'جدولة'],
    answerEn: 'Our Appointment Booking Automation is perfect for clinics, salons, and service businesses. It automatically:\n\n• Greets customers on WhatsApp\n• Shows available services\n• Collects required information\n• Presents available time slots\n• Confirms the booking\n• Sends reminders\n\nNo staff involvement needed — fully automated!',
    answerAr: 'أتمتة حجز المواعيد مثالية للعيادات والمراكز والمحلات الخدمية. تقوم تلقائيًا بـ:\n\n• الترحيب بالعملاء على واتساب\n• عرض الخدمات والأسعار المتاحة\n• جمع البيانات المطلوبة للحجز\n• عرض الأوقات الشاغرة\n• تأكيد الحجز وإرسال التذكيرات\n\nدون الحاجة لتدخل يدوي من الموظفين — مؤتمت بالكامل!',
  },
  {
    keywords: ['crm', 'lead', 'leads', 'contact', 'contacts', 'customer', 'database', 'manage', 'عملاء', 'بيانات', 'إدارة', 'جهات اتصال'],
    answerEn: 'Our built-in CRM automatically captures and organizes your customer data:\n\n• Auto-import leads from WhatsApp, Facebook, Instagram & TikTok\n• Visual deal pipeline with drag-and-drop stages\n• Contact profiles with full conversation history\n• Custom tags, segments, and filters\n• Export capabilities for reporting\n• Real-time sync across all channels',
    answerAr: 'نظام إدارة علاقات العملاء (CRM) المدمج يجمع وينظم بيانات عملائك تلقائيًا:\n\n• استيراد العملاء المحتملين تلقائيًا من واتساب وفيسبوك وإنستغرام وتيك توك\n• لوحة مبيعات بصرية ومراحل صفقات تفاعلية\n• ملفات شاملة لجهات الاتصال مع سجل المحادثات الكامل\n• وسوم وشرائح مخصصة وفلاتر دقيقة\n• إمكانية التصدير والتقارير المتقدمة\n• مزامنة فورية عبر كافة القنوات',
  },
  {
    keywords: ['campaign', 'broadcast', 'bulk', 'mass', 'marketing', 'send', 'message', 'حملة', 'حملات', 'إرسال جماعي', 'برودكاست', 'رسائل جماعية'],
    answerEn: 'Launch targeted WhatsApp marketing campaigns with ease:\n\n• Send personalized broadcasts to segmented audiences\n• Schedule campaigns in advance\n• Track delivery, read rates, and conversions in real-time\n• Use interactive message templates with buttons\n• Automate birthday greetings and follow-ups\n• Retarget existing customer databases via CSV/Excel upload',
    answerAr: 'أطلق حملات تسويقية مستهدفة عبر واتساب بكل سهولة:\n\n• إرسال رسائل جماعية مخصصة لشرائح جمهور محددة\n• جدولة الحملات مسبقًا في أوقات الذروة\n• تتبع نسب التسليم والقراءة والتحويلات لحظيًا\n• قوالب تفاعلية تحتوي على أزرار وقوائم سريعة\n• تهاني تلقائية ومتابعات ذكية بعد البيع\n• إعادة استهداف قواعد بيانات العملاء عبر ملفات Excel وCSV',
  },
  {
    keywords: ['support', 'help', 'issue', 'problem', 'trouble', 'bug', 'error', 'not working', 'مساعدة', 'دعم', 'مشكلة', 'خطأ', 'خدمة العملاء'],
    answerEn: 'Our support team is here to help! Here\'s how to reach us:\n\n• 💬 Live chat support (you\'re using it now!)\n• 📧 Email: admin@throbtech.com\n• 📞 Priority phone support for Business & Enterprise plans\n• 📚 Knowledge base & documentation\n\nBusiness and Enterprise plans include 24/7 priority support with dedicated account managers.',
    answerAr: 'فريق الدعم لدينا جاهز لمساعدتك دائمًا! إليك طرق التواصل معنا:\n\n• 💬 الدردشة المباشرة (تستخدمها الآن!)\n• 📧 البريد الإلكتروني: admin@throbtech.com\n• 📞 دعم هاتفي ذو أولوية لباقات الأعمال والمؤسسات\n• 📚 مركز المساعدة والتوثيق التقني\n\nتشمل باقات الأعمال والمؤسسات دعمًا على مدار الساعة طوال أيام الأسبوع مع مديري حسابات مخصصين.',
  },
  {
    keywords: ['trial', 'free', 'try', 'test', 'start', 'sign up', 'signup', 'register', 'get started', 'تجربة', 'مجاني', 'تسجيل', 'ابدأ'],
    answerEn: 'You can get started with ThrobTech absolutely free! Our Starter plan includes:\n\n• Up to 1,000 contacts\n• Basic analytics\n• 5 automation workflows\n• WhatsApp API connection\n• Standard support\n\nNo credit card required. Sign up and start automating in minutes!',
    answerAr: 'يمكنك البدء مع ThrobTech مجانًا تمامًا! تتضمن باقة البداية لدينا:\n\n• حتى 1,000 جهة اتصال\n• تحليلات وتقارير أساسية\n• 5 مسارات أتمتة ذكية\n• ربط واجهة WhatsApp API الرسمية\n• دعم فني معتمد\n\nلا تتطلب بطاقة ائتمان. سجّل وابدأ الأتمتة خلال دقائق!',
  },
  {
    keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'greetings', 'assalam', 'salam', 'مرحبا', 'مرحب', 'سلام', 'اهلا', 'أهلا', 'صباح الخير', 'مساء الخير', 'السلام عليكم'],
    answerEn: 'Hello! 👋 Welcome to ThrobTech. I\'m here to help you learn about our WhatsApp automation and CRM platform. Feel free to ask me anything about our features, pricing, or how we can help your business!',
    answerAr: 'أهلاً بك! 👋 مرحبًا بك في ThrobTech. أنا هنا لمساعدتك في التعرف على منصتنا لأتمتة واتساب وإدارة علاقات العملاء. لا تتردد في سؤالي عن ميزاتنا أو أسعارنا أو كيف يمكننا مساعدة نمو أعمالك!',
  },
  {
    keywords: ['thank', 'thanks', 'appreciate', 'awesome', 'great', 'perfect', 'good', 'شكرا', 'شكراً', 'يعطيك العافية', 'تسلم', 'ممتاز'],
    answerEn: 'You\'re welcome! 😊 I\'m glad I could help. If you have any more questions, feel free to ask. You can also book a live demo to see the platform in action!',
    answerAr: 'على الرحب والسعة! 😊 يسعدني دائمًا تقديم المساعدة. إذا كان لديك أي استفسار آخر، تفضل بسؤالي في أي وقت. يمكنك أيضًا حجز عرض توضيحي مباشر لتجربة المنصة بنفسك!',
  },
];

// ==========================================
// RESPONSE ENGINE
// ==========================================
function findBestResponse(query: string, isArabic: boolean): string {
  const lowerQuery = query.toLowerCase().trim();

  let bestMatch: QAPair | null = null;
  let bestScore = 0;

  for (const qa of knowledgeBase) {
    let score = 0;
    for (const keyword of qa.keywords) {
      if (lowerQuery.includes(keyword.toLowerCase())) {
        score += keyword.length;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = qa;
    }
  }

  if (bestMatch && bestScore > 0) {
    if (isArabic) {
      let response = bestMatch.answerAr;
      if (bestMatch.followUpAr) {
        response += '\n\n' + bestMatch.followUpAr;
      }
      return response;
    } else {
      let response = bestMatch.answerEn;
      if (bestMatch.followUpEn) {
        response += '\n\n' + bestMatch.followUpEn;
      }
      return response;
    }
  }

  if (isArabic) {
    return 'شكرًا لرسالتك! يمكنني مساعدتك بمعلومات حول **الأسعار**، و**الميزات**، و**أتمتة واتساب**، و**حجز المواعيد**، و**نظام إدارة العملاء (CRM)**، و**الردود بالذكاء الاصطناعي**، والمزيد.\n\nيمكنك أيضًا السؤال حول الحصول على **تجربة مجانية** أو **حجز عرض توضيحي**.\n\nولأي استفسارات خاصة، فريقنا مستعد دائمًا لمساعدتك — زر صفحة "تواصل معنا" أو اكتب سؤالك أعلاه!';
  }

  return 'Thanks for your message! I can help you with information about our **pricing**, **features**, **WhatsApp automation**, **appointment booking**, **CRM**, **AI replies**, and more.\n\nYou can also ask about getting a **free trial** or **booking a demo**.\n\nFor specific inquiries, our team is ready to help — visit our Contact page or type your question above!';
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function ChatbotWidget() {
  const { websiteName } = useBrandingStore();
  const { locale, isRtl, t } = useI18n();
  const isArabic = locale === 'ar-SA';
  const botName = isArabic ? (websiteName ? `${websiteName} للذكاء الاصطناعي` : 'مساعد الذكاء الاصطناعي') : (websiteName ? `${websiteName} AI` : 'ThrobTech AI');

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize welcome message once
  useEffect(() => {
    const welcomeText = isArabic
      ? `أهلاً بك! 👋 أنا مساعد ${websiteName || 'ThrobTech'}. كيف يمكنني مساعدتك اليوم؟\n\nيمكنك سؤالي عن ميزاتنا، أو الأسعار، أو أتمتة واتساب، أو أي استفسار آخر!`
      : `Hi there! 👋 I'm the ${websiteName || 'ThrobTech'} assistant. How can I help you today?\n\nYou can ask me about our features, pricing, WhatsApp automation, or anything else!`;

    setMessages([
      {
        id: 'welcome',
        text: welcomeText,
        sender: 'bot',
        timestamp: new Date()
      }
    ]);
  }, [isArabic, websiteName]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
      setHasUnread(false);
    }
  }, [isOpen]);

  const quickActions = isArabic
    ? [
        'ما هي الميزات التي تقدمونها؟',
        'عرض خطط الأسعار',
        'كيف تعمل أتمتة واتساب؟',
        'حجز عرض توضيحي',
      ]
    : [
        'What features do you offer?',
        'Show me pricing plans',
        'How does WhatsApp automation work?',
        'Book a demo',
      ];

  const sendMessage = useCallback((text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: text.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    const delay = 500 + Math.random() * 500;
    setTimeout(() => {
      const response = findBestResponse(text, isArabic);
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        text: response,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);

      if (!isOpen) {
        setHasUnread(true);
      }
    }, delay);
  }, [isOpen, isArabic]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleQuickAction = (actionText: string) => {
    sendMessage(actionText);
  };

  const formatMessage = (text: string) => {
    return text.split('\n').map((line, i) => {
      let formatted: React.ReactNode = line;
      if (line.includes('**')) {
        const parts = line.split(/\*\*(.*?)\*\*/g);
        formatted = parts.map((part, j) =>
          j % 2 === 1 ? <strong key={j} className="font-bold text-slate-900">{part}</strong> : part
        );
      }
      return (
        <React.Fragment key={i}>
          {formatted}
          {i < text.split('\n').length - 1 && <br />}
        </React.Fragment>
      );
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <div className={cn("fixed bottom-6 z-50", isRtl ? "left-6" : "right-6")}>
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            "relative w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all cursor-pointer",
            isOpen
              ? "bg-slate-800 text-white shadow-slate-900/30"
              : "bg-gradient-to-tr from-[#12263A] via-[#166534] to-[#22C55E] text-white shadow-[#166534]/40 hover:shadow-[#166534]/60"
          )}
          aria-label={isOpen ? (isArabic ? 'إغلاق الدردشة' : 'Close chat') : (isArabic ? 'فتح الدردشة' : 'Open chat')}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                <X size={22} />
              </motion.div>
            ) : (
              <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                <MessageCircle size={24} />
              </motion.div>
            )}
          </AnimatePresence>

          {hasUnread && !isOpen && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse" />
          )}
        </motion.button>
      </div>

      {/* Chat Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={cn(
              "fixed bottom-24 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[560px] max-h-[calc(100vh-8rem)] bg-white rounded-3xl shadow-2xl border border-slate-200/80 flex flex-col overflow-hidden text-start",
              isRtl ? "left-6" : "right-6"
            )}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#12263A] to-[#166534] p-4 text-white flex items-center justify-between shrink-0 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                    <Sparkles size={18} className="text-[#22C55E]" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#22C55E] rounded-full border-2 border-[#12263A]" />
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-tight">{botName}</h3>
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-300 font-medium">
                    <span className="w-1.5 h-1.5 bg-[#22C55E] rounded-full animate-pulse" />
                    <span>{isArabic ? 'نشط الآن' : 'Always Active'}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Minimize chat"
              >
                <ChevronDown size={18} />
              </button>
            </div>

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15 }}
                  className={cn("flex", msg.sender === 'user' ? "justify-end" : "justify-start")}
                >
                  <div className="max-w-[85%]">
                    {msg.sender === 'bot' && (
                      <div className="flex items-center gap-1.5 mb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        <span>{botName}</span>
                      </div>
                    )}
                    <div
                      className={cn(
                        "px-4 py-3 text-[12.5px] leading-relaxed font-medium shadow-sm",
                        msg.sender === 'user'
                          ? "bg-gradient-to-r from-[#12263A] to-[#166534] text-white rounded-2xl"
                          : "bg-white border border-slate-200/80 text-slate-700 rounded-2xl"
                      )}
                    >
                      {msg.sender === 'bot' ? formatMessage(msg.text) : msg.text}
                    </div>
                    <span className={cn("text-[9px] font-semibold text-slate-400 mt-1 block", msg.sender === 'user' ? "text-end" : "text-start")}>
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
                  <div className="bg-white border border-slate-200/80 rounded-2xl px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            {messages.length <= 2 && !isTyping && (
              <div className="px-4 pb-2 flex flex-wrap gap-1.5 shrink-0 bg-white">
                {quickActions.map((action) => (
                  <button
                    key={action}
                    type="button"
                    onClick={() => handleQuickAction(action)}
                    className="px-3 py-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full hover:bg-emerald-100 transition-all cursor-pointer whitespace-nowrap"
                  >
                    {action}
                  </button>
                ))}
              </div>
            )}

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="px-4 py-3 border-t border-slate-100 bg-white shrink-0">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={isArabic ? 'اكتب رسالتك هنا...' : 'Type your message...'}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-[13px] font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 focus:bg-white transition-all"
                  disabled={isTyping}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="w-10 h-10 bg-gradient-to-br from-[#12263A] to-[#166534] text-white rounded-xl flex items-center justify-center hover:shadow-lg hover:shadow-[#166534]/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer active:scale-95 shrink-0"
                  aria-label={isArabic ? 'إرسال الرسالة' : 'Send message'}
                >
                  <Send size={16} className={isRtl ? "rotate-180" : ""} />
                </button>
              </div>
              <p className="text-[9px] text-slate-400 font-semibold text-center mt-2 uppercase tracking-wider">
                {isArabic ? `مشغّل بواسطة ${websiteName || 'ThrobTech'} • ردود فورية` : `Powered by ${websiteName || 'ThrobTech'} • Instant Responses`}
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
