import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageCircle,
  X,
  Send,
  Bot,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useBrandingStore } from '../../store/brandingStore';

// ==========================================
// KNOWLEDGE BASE - Predefined Q&A Pairs
// ==========================================
interface QAPair {
  keywords: string[];
  answer: string;
  followUp?: string;
}

const knowledgeBase: QAPair[] = [
  {
    keywords: ['price', 'pricing', 'cost', 'plan', 'plans', 'subscription', 'fee', 'how much', 'package'],
    answer: 'We offer three flexible plans:\n\n• **Starter** — Free, up to 1,000 contacts\n• **Business** — $49/mo, up to 10,000 contacts with AI & automation\n• **Enterprise** — Custom pricing with unlimited contacts & dedicated support\n\nAll plans include WhatsApp API integration and CRM access.',
    followUp: 'Would you like to start a free trial or speak to our sales team?'
  },
  {
    keywords: ['whatsapp', 'api', 'meta', 'connect', 'integration', 'integrate'],
    answer: 'We connect directly to Meta\'s official WhatsApp Business Cloud API. You simply provide your access token and phone number ID — we handle the rest. This ensures 100% security, zero server maintenance, and reliable message delivery.',
    followUp: 'Need help setting up your WhatsApp Business API? Book a demo with our team!'
  },
  {
    keywords: ['demo', 'book', 'meeting', 'call', 'schedule', 'consultation'],
    answer: 'We\'d love to give you a personalized demo! You can book a live demo session with our team where we\'ll walk you through all platform features, answer your questions, and help you get started.',
    followUp: 'Visit our Contact page to schedule your free demo session.'
  },
  {
    keywords: ['feature', 'features', 'what can', 'capabilities', 'offer', 'service', 'services'],
    answer: 'Throbtech is a complete customer communication platform:\n\n• 📣 WhatsApp Marketing Campaigns\n• 🤖 AI-Powered Auto-Replies\n• 📅 Appointment Booking Automation\n• 💬 Omnichannel Inbox (WhatsApp, Instagram, FB, Email)\n• 📊 CRM & Lead Management\n• 🔗 Click-to-WhatsApp Ads Integration\n• 📱 Social Media Planner\n• 📄 Landing Page & Form Builder',
  },
  {
    keywords: ['ai', 'artificial', 'intelligence', 'chatbot', 'bot', 'automated', 'auto reply', 'auto-reply', 'copilot'],
    answer: 'Our AI Copilot provides intelligent automated responses 24/7. It can:\n\n• Answer customer inquiries instantly\n• Detect customer intent and route conversations\n• Draft personalized replies for agent approval\n• Handle appointment booking flows automatically\n• Respond to Google Reviews\n\nAll powered by advanced AI models integrated into your WhatsApp Business account.',
  },
  {
    keywords: ['appointment', 'booking', 'book appointment', 'schedule', 'calendar', 'clinic', 'doctor', 'salon'],
    answer: 'Our Appointment Booking Automation is perfect for clinics, salons, and service businesses. It automatically:\n\n• Greets customers on WhatsApp\n• Shows available services\n• Collects required information\n• Presents available time slots\n• Confirms the booking\n• Sends reminders\n\nNo staff involvement needed — fully automated!',
  },
  {
    keywords: ['crm', 'lead', 'leads', 'contact', 'contacts', 'customer', 'database', 'manage'],
    answer: 'Our built-in CRM automatically captures and organizes your customer data:\n\n• Auto-import leads from WhatsApp, Facebook, Instagram & TikTok\n• Visual deal pipeline with drag-and-drop stages\n• Contact profiles with full conversation history\n• Custom tags, segments, and filters\n• Export capabilities for reporting\n• Real-time sync across all channels',
  },
  {
    keywords: ['campaign', 'broadcast', 'bulk', 'mass', 'marketing', 'send', 'message'],
    answer: 'Launch targeted WhatsApp marketing campaigns with ease:\n\n• Send personalized broadcasts to segmented audiences\n• Schedule campaigns in advance\n• Track delivery, read rates, and conversions in real-time\n• Use interactive message templates with buttons\n• Automate birthday greetings and follow-ups\n• Retarget existing customer databases via CSV/Excel upload',
  },
  {
    keywords: ['ads', 'advertising', 'click to whatsapp', 'click-to-whatsapp', 'facebook ads', 'tiktok', 'instagram ads', 'snapchat', 'google ads'],
    answer: 'Our Click-to-WhatsApp Ads integration works with all major platforms:\n\n• TikTok Ads\n• Facebook & Instagram Ads\n• Snapchat Ads\n• Google Ads\n\nWhen customers click your ad, they land directly in a WhatsApp conversation instead of a generic landing page — resulting in 3x higher conversion rates!',
  },
  {
    keywords: ['support', 'help', 'issue', 'problem', 'trouble', 'bug', 'error', 'not working'],
    answer: 'Our support team is here to help! Here\'s how to reach us:\n\n• 💬 Live chat support (you\'re using it now!)\n• 📧 Email: support@throbtech.com\n• 📞 Priority phone support for Business & Enterprise plans\n• 📚 Knowledge base & documentation\n\nBusiness and Enterprise plans include 24/7 priority support with dedicated account managers.',
  },
  {
    keywords: ['trial', 'free', 'try', 'test', 'start', 'sign up', 'signup', 'register', 'get started'],
    answer: 'You can get started with Throbtech absolutely free! Our Starter plan includes:\n\n• Up to 1,000 contacts\n• Basic analytics\n• 5 automation workflows\n• WhatsApp API connection\n• Standard support\n\nNo credit card required. Sign up and start automating in minutes!',
  },
  {
    keywords: ['security', 'secure', 'gdpr', 'hipaa', 'privacy', 'data', 'protection', 'safe'],
    answer: 'Security is our top priority:\n\n• 🔒 End-to-end encryption for all messages\n• ✅ GDPR compliant data handling\n• ✅ HIPAA-ready for healthcare businesses\n• 🛡️ Official Meta WhatsApp API (no third-party risk)\n• 📊 99.99% SLA uptime guarantee\n• 🔐 Role-based access controls\n• 💾 Regular encrypted backups',
  },
  {
    keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'greetings', 'assalam', 'salam'],
    answer: 'Hello! 👋 Welcome to Throbtech. I\'m here to help you learn about our WhatsApp automation and CRM platform. Feel free to ask me anything about our features, pricing, or how we can help your business!',
  },
  {
    keywords: ['thank', 'thanks', 'appreciate', 'awesome', 'great', 'perfect', 'good'],
    answer: 'You\'re welcome! 😊 I\'m glad I could help. If you have any more questions, feel free to ask. You can also book a live demo to see the platform in action!',
  },
  {
    keywords: ['social media', 'instagram', 'facebook', 'planner', 'schedule post', 'content'],
    answer: 'Our Social Media Planner lets you manage all your platforms from one dashboard:\n\n• Schedule and publish content across channels\n• Monitor comments and engagement\n• Track performance metrics\n• Cross-channel content calendar\n• Unified analytics dashboard\n\nConnect Instagram, Facebook, and more — no more switching between apps!',
  },
  {
    keywords: ['inbox', 'omnichannel', 'unified', 'channel', 'conversation', 'chat'],
    answer: 'Our Omnichannel Inbox unifies all customer conversations in one place:\n\n• 💬 WhatsApp Business\n• 📸 Instagram DMs\n• 👥 Facebook Messenger\n• ✉️ Email\n• 📱 SMS\n• 🌐 Website Live Chat\n\nYour team can respond to all channels from a single dashboard with AI-suggested replies and automated routing.',
  },
];

// ==========================================
// RESPONSE ENGINE
// ==========================================
function findBestResponse(query: string): string {
  const lowerQuery = query.toLowerCase().trim();

  // Score each QA pair by keyword match count
  let bestMatch: QAPair | null = null;
  let bestScore = 0;

  for (const qa of knowledgeBase) {
    let score = 0;
    for (const keyword of qa.keywords) {
      if (lowerQuery.includes(keyword.toLowerCase())) {
        score += keyword.length; // Longer keyword matches score higher
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = qa;
    }
  }

  if (bestMatch && bestScore > 0) {
    let response = bestMatch.answer;
    if (bestMatch.followUp) {
      response += '\n\n' + bestMatch.followUp;
    }
    return response;
  }

  // Default fallback response
  return 'Thanks for your message! I can help you with information about our **pricing**, **features**, **WhatsApp automation**, **appointment booking**, **CRM**, **AI replies**, and more.\n\nYou can also ask about getting a **free trial** or **booking a demo**.\n\nFor specific inquiries, our team is ready to help — visit our Contact page or type your question above!';
}

// ==========================================
// MESSAGE TYPES
// ==========================================
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

// ==========================================
// QUICK ACTION BUTTONS
// ==========================================
const quickActions = [
  'What features do you offer?',
  'Show me pricing plans',
  'How does WhatsApp automation work?',
  'Book a demo',
];

// ==========================================
// CHATBOT WIDGET COMPONENT
// ==========================================
export default function ChatbotWidget() {
  const { websiteName, websiteLogo } = useBrandingStore();
  const botName = websiteName || 'Throbtech AI';

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      text: `Hi there! 👋 I'm the ${botName} assistant. How can I help you today?\n\nYou can ask me about our features, pricing, WhatsApp automation, or anything else!`,
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom when messages change
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
      setHasUnread(false);
    }
  }, [isOpen]);

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

    // Simulate AI "thinking" delay (600-1200ms)
    const delay = 600 + Math.random() * 600;
    setTimeout(() => {
      const response = findBestResponse(text);
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
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleQuickAction = (text: string) => {
    sendMessage(text);
  };

  // Format bot message text with basic markdown-like rendering
  const formatMessage = (text: string) => {
    return text.split('\n').map((line, i) => {
      // Bold text
      const formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      
      if (line.trim() === '') return <br key={i} />;
      if (line.startsWith('• ')) {
        return (
          <div key={i} className="flex items-start gap-1.5 ml-1">
            <span className="text-indigo-400 mt-0.5 shrink-0">•</span>
            <span dangerouslySetInnerHTML={{ __html: formatted.slice(2) }} />
          </div>
        );
      }
      return <p key={i} dangerouslySetInnerHTML={{ __html: formatted }} />;
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* ========== FLOATING TRIGGER BUTTON ========== */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 text-white rounded-full shadow-xl shadow-indigo-500/25 flex items-center justify-center hover:scale-110 hover:shadow-2xl hover:shadow-indigo-500/30 transition-all duration-300 cursor-pointer group"
            aria-label="Open chat"
          >
            <MessageCircle size={22} className="group-hover:scale-110 transition-transform" />
            
            {/* Unread Badge */}
            {hasUnread && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-sm"
              >
                1
              </motion.span>
            )}

            {/* Pulse Ring */}
            <span className="absolute inset-0 rounded-full bg-indigo-500/20 animate-ping pointer-events-none" style={{ animationDuration: '3s' }} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ========== CHAT PANEL ========== */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[560px] max-h-[calc(100vh-3rem)] bg-white border border-slate-200 rounded-[1.75rem] shadow-2xl shadow-slate-900/10 flex flex-col overflow-hidden"
          >
            {/* ---- HEADER ---- */}
            <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 px-5 py-4 text-white shrink-0">
              {/* Background pattern */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none rounded-t-[1.75rem]" />
              
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-white/15 backdrop-blur-sm border border-white/20 rounded-xl flex items-center justify-center overflow-hidden">
                    {websiteLogo ? (
                      <img src={websiteLogo} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                      <Bot size={18} className="text-white" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-[14px] tracking-tight leading-tight">{botName}</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[10px] font-semibold text-indigo-200 uppercase tracking-wider">Online Now</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Close chat"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* ---- MESSAGES AREA ---- */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 custom-scrollbar bg-slate-50/30">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] ${msg.sender === 'user' ? 'order-1' : 'order-1'}`}>
                    {/* Bot avatar */}
                    {msg.sender === 'bot' && (
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <div className="w-5 h-5 bg-indigo-100 border border-indigo-200/50 rounded-md flex items-center justify-center">
                          <Sparkles size={10} className="text-indigo-600" />
                        </div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">AI Assistant</span>
                      </div>
                    )}

                    {/* Message Bubble */}
                    <div
                      className={`px-4 py-3 text-[12.5px] leading-relaxed font-medium ${
                        msg.sender === 'user'
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl rounded-tr-md shadow-sm'
                          : 'bg-white border border-slate-200/80 text-slate-700 rounded-2xl rounded-tl-md shadow-sm'
                      }`}
                    >
                      {msg.sender === 'bot' ? formatMessage(msg.text) : msg.text}
                    </div>

                    {/* Timestamp */}
                    <span className={`text-[9px] font-semibold text-slate-400 mt-1 block ${msg.sender === 'user' ? 'text-right pr-1' : 'pl-1'}`}>
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <div className="w-5 h-5 bg-indigo-100 border border-indigo-200/50 rounded-md flex items-center justify-center">
                      <Sparkles size={10} className="text-indigo-600" />
                    </div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">AI Assistant</span>
                  </div>
                </motion.div>
              )}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-white border border-slate-200/80 rounded-2xl rounded-tl-md px-4 py-3 shadow-sm">
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

            {/* ---- QUICK ACTIONS (show only when few messages) ---- */}
            {messages.length <= 2 && !isTyping && (
              <div className="px-4 pb-2 flex flex-wrap gap-1.5 shrink-0">
                {quickActions.map((action) => (
                  <button
                    key={action}
                    onClick={() => handleQuickAction(action)}
                    className="px-3 py-1.5 text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100/50 rounded-full hover:bg-indigo-100 hover:border-indigo-200 transition-all cursor-pointer whitespace-nowrap"
                  >
                    {action}
                  </button>
                ))}
              </div>
            )}

            {/* ---- INPUT AREA ---- */}
            <form onSubmit={handleSubmit} className="px-4 py-3 border-t border-slate-100 bg-white shrink-0">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-[13px] font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 focus:bg-white transition-all"
                  disabled={isTyping}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-xl flex items-center justify-center hover:shadow-lg hover:shadow-indigo-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer active:scale-95 shrink-0"
                  aria-label="Send message"
                >
                  <Send size={16} />
                </button>
              </div>
              <p className="text-[9px] text-slate-400 font-semibold text-center mt-2 uppercase tracking-wider">
                Powered by {botName} • Instant Responses
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
