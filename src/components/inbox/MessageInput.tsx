import React, { useState, useRef, useEffect } from 'react';
import { 
  Smile, 
  Paperclip, 
  Send, 
  X, 
  FileText, 
  Layout, 
  Search, 
  Loader2, 
  ChevronRight, 
  MessageSquare,
  Sparkles,
  Check,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import EmojiPicker, { Theme } from 'emoji-picker-react';
import { Conversation } from '../../types';
import { WhatsAppTemplate } from '../../types/whatsapp';
import { whatsappApi } from '../../services/whatsappApi';
import SendTemplateModal from '../whatsapp/modals/SendTemplateModal';
import { cn } from '../../lib/utils';

interface AttachedFile {
  id: string;
  file: File;
  progress: number;
  type: 'image' | 'file';
  thumbnailUrl?: string;
}

interface MessageInputProps {
  onSend: (content: string, type: 'text' | 'image' | 'file', file?: File) => void;
  disabled?: boolean;
  recipientPhone?: string;
  recipientName?: string;
  conversation: Conversation;
}

const QUICK_ACTIONS = [
  { id: 'greeting', label: 'Greeting 👋', text: 'Hello! How can we help you today?' },
  { id: 'followup', label: 'Follow Up 📅', text: 'Hi! Just following up on our last conversation. Let us know if you have any questions!' },
  { id: 'quote', label: 'Quote 💰', text: 'Please find our customized quote for your services attached below.' },
  { id: 'invoice', label: 'Invoice 🧾', text: 'Here is the invoice link for your recent order. Thank you for your business!' },
  { id: 'meeting', label: 'Meeting 🤝', text: 'Would you like to schedule a quick sync? Let us know your availability.' },
  { id: 'order', label: 'Order Update 📦', text: 'Good news! Your order is packed and will be dispatched shortly.' },
  { id: 'thanks', label: 'Thank You ❤️', text: 'Thank you for choosing us! We appreciate your support.' },
];

export default function MessageInput({ onSend, disabled, recipientPhone, recipientName, conversation }: MessageInputProps) {
  const [text, setText] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);

  // Check if the 24-hour support window is open
  const lastIncomingMessage = (conversation.messages || [])
    .filter((m: any) => m.sender === 'contact')
    .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

  const isWindowActive = (() => {
    if (!lastIncomingMessage) return false;
    const lastIncomingTime = new Date(lastIncomingMessage.timestamp).getTime();
    const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;
    return lastIncomingTime > twentyFourHoursAgo;
  })();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);
  const [showAiDropdown, setShowAiDropdown] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  const [templates, setTemplates] = useState<WhatsAppTemplate[]>([]);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);
  const [templateSearch, setTemplateSearch] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<WhatsAppTemplate | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const composerRef = useRef<HTMLDivElement>(null);

  const resetTextareaHeight = () => {
    if (textareaRef.current) textareaRef.current.style.height = '56px';
  };

  useEffect(() => {
    if (showTemplatePicker && templates.length === 0) {
      const fetchTemplates = async () => {
        setIsLoadingTemplates(true);
        try {
          const data = await whatsappApi.fetchTemplates();
          setTemplates(data.filter(t => t.status === 'APPROVED'));
        } catch (err) {
          console.error('Failed to fetch templates:', err);
        } finally {
          setIsLoadingTemplates(false);
        }
      };
      fetchTemplates();
    }
  }, [showTemplatePicker]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (disabled || isSending || isAiLoading) return;

    if (!text.trim() && attachedFiles.length === 0) return;

    setIsSending(true);
    setSendSuccess(false);

    try {
      if (text.trim() && attachedFiles.length === 0) {
        await onSend(text, 'text');
      } else {
        if (text.trim()) {
          await onSend(text, 'text');
        }
        for (const item of attachedFiles) {
          await onSend(item.file.name, item.type, item.file);
        }
      }

      setSendSuccess(true);
      setTimeout(() => setSendSuccess(false), 1550);

      // Reset Form
      setText('');
      setAttachedFiles([]);
      resetTextareaHeight();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const onEmojiClick = (emojiData: any) => {
    setText(prev => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  // Drag & Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files) as File[];
    if (files.length > 0) {
      addFiles(files);
    }
  };

  const triggerUploadProgress = (fileId: string) => {
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      setAttachedFiles(prev => prev.map(item => {
        if (item.id === fileId) {
          return { ...item, progress: Math.min(currentProgress, 100) };
        }
        return item;
      }));
      if (currentProgress >= 100) {
        clearInterval(interval);
      }
    }, 80);
  };

  const addFiles = (files: File[]) => {
    const newAttachments = files.map(file => {
      const id = `file_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
      const isImg = file.type.startsWith('image/');
      const item: AttachedFile = {
        id,
        file,
        progress: 0,
        type: isImg ? 'image' : 'file',
        thumbnailUrl: isImg ? URL.createObjectURL(file) : undefined
      };
      triggerUploadProgress(id);
      return item;
    });
    setAttachedFiles(prev => [...prev, ...newAttachments]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? (Array.from(e.target.files) as File[]) : [];
    if (files.length > 0) {
      addFiles(files);
    }
    if (e.target) e.target.value = '';
  };

  const removeFile = (id: string) => {
    setAttachedFiles(prev => prev.filter(item => item.id !== id));
  };

  // Quick Action Chip handler
  const handleQuickAction = (actionText: string) => {
    setText(prev => {
      const space = prev ? (prev.endsWith(' ') ? '' : ' ') : '';
      return prev + space + actionText;
    });
  };

  // AI assistant options
  const handleAiAction = (action: string) => {
    if (!text.trim()) return;
    setIsAiLoading(true);
    
    setTimeout(() => {
      let resultText = text;
      switch (action) {
        case 'improve':
          resultText = text.replace(/\bhey\b|\bhi\b/gi, 'Hello').replace(/\bgonna\b/gi, 'going to').replace(/\bwanna\b/gi, 'would like to') + '\n\nPlease let me know if you have any questions.';
          break;
        case 'professional':
          resultText = `Dear ${recipientName || 'Client'},\n\nI am writing to follow up on our discussion. ${text}\n\nBest regards,\nCustomer Support Team`;
          break;
        case 'shorten':
          resultText = text.split('.').slice(0, 2).join('.') + (text.includes('.') ? '.' : '');
          break;
        case 'expand':
          resultText = `${text}\n\nOur goal is to ensure you have a seamless experience. Please review the details above and feel free to reach out if you need further clarification.`;
          break;
        case 'translate_es':
          resultText = `Hola ${recipientName || 'Cliente'},\n\nEspero que se encuentre bien. ${text} (Traducido al español)`;
          break;
        case 'translate_en':
          resultText = `Hello,\n\nI hope you are doing well. ${text}`;
          break;
        case 'grammar':
          resultText = text.charAt(0).toUpperCase() + text.slice(1);
          break;
        case 'friendly':
          resultText = `Hi there! 😊 ${text} Hope you have an awesome day! ✨`;
          break;
        case 'urgent':
          resultText = `⚠️ IMPORTANT UPDATE: ${text} Please let us know as soon as possible. Thank you!`;
          break;
      }
      setText(resultText);
      setIsAiLoading(false);
      setShowAiDropdown(false);
    }, 900);
  };

  return (
    <div 
      ref={composerRef}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 relative select-none"
    >
      <div className="max-w-5xl mx-auto space-y-3.5">
        
        {/* Quick action chips */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5 items-center">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider shrink-0 mr-1.5">Quick Actions:</span>
          {QUICK_ACTIONS.map(chip => (
            <button
              key={chip.id}
              type="button"
              onClick={() => handleQuickAction(chip.text)}
              className="px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700/80 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm shrink-0 cursor-pointer active:scale-95"
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Floating Composer Box */}
        <div className={cn(
          "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-[20px] shadow-sm shadow-slate-100/40 dark:shadow-none p-4 relative group focus-within:shadow-md focus-within:border-indigo-350 dark:focus-within:border-indigo-800/80 transition-all duration-300",
          isDragging && "border-dashed border-indigo-400 dark:border-indigo-500 bg-indigo-50/10 dark:bg-indigo-950/5"
        )}>
          {/* Locked Overlay when window is expired */}
          {!isWindowActive && (
            <div className="absolute inset-0 bg-slate-50/95 dark:bg-slate-900/95 rounded-[20px] z-10 flex flex-col items-center justify-center p-6 text-center gap-3">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                <AlertCircle size={18} className="text-amber-500" />
                <span className="text-sm font-bold">24-Hour Customer Support Window Closed</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md leading-relaxed font-semibold">
                You cannot send custom messages because the customer has not replied in the last 24 hours. You can only send approved templates to re-engage them.
              </p>
              <button
                type="button"
                onClick={() => setShowTemplatePicker(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#12263A] to-[#166534] hover:shadow-lg rounded-xl text-xs font-bold text-white transition-all active:scale-95 shadow-sm cursor-pointer"
              >
                <Layout size={13} /> Select & Send Template
              </button>
            </div>
          )}
          {/* Drag Overlay Alert */}
          <AnimatePresence>
            {isDragging && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-white/90 dark:bg-slate-800/90 rounded-[20px] z-30 flex items-center justify-center border-2 border-dashed border-[#166534] m-1"
              >
                <div className="flex flex-col items-center gap-2 text-[#166534]">
                  <Paperclip size={24} className="animate-bounce" />
                  <span className="text-sm font-bold tracking-wide">Drop files here to attach</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Schedulers, Modals, Pickers inside absolute container */}
          <AnimatePresence>
            {selectedTemplate && (
              <SendTemplateModal 
                template={selectedTemplate}
                initialPhone={recipientPhone}
                recipientName={recipientName}
                onClose={() => {
                  setSelectedTemplate(null);
                }}
                onSuccess={() => {
                  setSelectedTemplate(null);
                  setShowTemplatePicker(false);
                }}
              />
            )}

            {showTemplatePicker && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="absolute bottom-[calc(100%+12px)] left-4 w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[22px] shadow-xl z-20 flex flex-col max-h-[400px] overflow-hidden"
              >
                <div className="p-4 border-b border-slate-100 dark:border-slate-700/80 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/30">
                  <div className="flex items-center gap-2">
                    <Layout size={15} className="text-[#166534]" />
                    <span className="text-[10px] font-black text-slate-800 dark:text-white uppercase tracking-widest">Select Template</span>
                  </div>
                  <button 
                    onClick={() => setShowTemplatePicker(false)}
                    className="text-slate-400 hover:text-slate-650 dark:hover:text-slate-200"
                  >
                    <X size={15} />
                  </button>
                </div>
                
                <div className="p-2.5 border-b border-slate-100 dark:border-slate-700/80">
                  <div className="relative">
                    <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-350" />
                    <input 
                      type="text"
                      value={templateSearch}
                      onChange={(e) => setTemplateSearch(e.target.value)}
                      placeholder="Search templates..."
                      className="w-full h-9 pl-9 pr-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all"
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-2 custom-scrollbar space-y-1">
                  {isLoadingTemplates ? (
                    <div className="flex flex-col items-center justify-center p-12 gap-2">
                      <Loader2 size={20} className="text-slate-300 animate-spin" />
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Loading...</span>
                    </div>
                  ) : templates.length === 0 ? (
                    <div className="p-8 text-center">
                      <p className="text-xs font-bold text-slate-400">No templates found</p>
                    </div>
                  ) : (
                    templates
                      .filter(t => t.name.toLowerCase().includes(templateSearch.toLowerCase()))
                      .map(t => (
                        <button
                          key={t.id}
                          onClick={() => setSelectedTemplate(t)}
                          className="w-full p-2.5 flex items-center justify-between group hover:bg-slate-50 dark:hover:bg-slate-900/60 rounded-xl transition-all text-left border border-transparent"
                        >
                          <div className="flex items-center gap-2.5 overflow-hidden">
                            <div className="w-7.5 h-7.5 bg-slate-100 dark:bg-slate-900 rounded-lg flex items-center justify-center text-slate-400 shrink-0">
                              <MessageSquare size={14} />
                            </div>
                            <div className="min-w-0">
                              <p className="text-[11px] font-bold text-slate-900 dark:text-white truncate">{t.name}</p>
                              <p className="text-[8.5px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-0.5">{t.category}</p>
                            </div>
                          </div>
                          <ChevronRight size={13} className="text-slate-300 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-all group-hover:translate-x-0.5" />
                        </button>
                      ))
                  )}
                </div>
              </motion.div>
            )}

            {showEmojiPicker && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute bottom-[calc(100%+12px)] left-4 z-25"
              >
                <div className="relative shadow-2xl rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
                  <EmojiPicker 
                    onEmojiClick={onEmojiClick}
                    theme={Theme.LIGHT}
                    width={290}
                    height={380}
                    lazyLoadEmojis={true}
                  />
                </div>
              </motion.div>
            )}

            {showAiDropdown && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 5 }}
                className="absolute bottom-[calc(100%+12px)] left-24 w-56 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl z-20 overflow-hidden py-1.5"
              >
                <div className="px-3.5 py-1.5 border-b border-slate-100 dark:border-slate-700/80 mb-1">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">AI Co-Pilot Actions</span>
                </div>
                {[
                  { action: 'improve', label: 'Improve Writing ✨' },
                  { action: 'professional', label: 'Rewrite Professionally 👔' },
                  { action: 'grammar', label: 'Fix Grammar ✍️' },
                  { action: 'shorten', label: 'Make Shorter 🔍' },
                  { action: 'expand', label: 'Make Longer 📝' },
                  { action: 'friendly', label: 'Tone: Friendly 😊' },
                  { action: 'urgent', label: 'Tone: Urgent 🚨' },
                  { action: 'translate_es', label: 'Translate to Spanish 🇪🇸' },
                  { action: 'translate_en', label: 'Translate to English 🇬🇧' },
                ].map(item => (
                  <button
                    key={item.action}
                    type="button"
                    onClick={() => handleAiAction(item.action)}
                    className="w-full px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-355 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900/60 text-left transition-colors flex items-center justify-between"
                  >
                    <span>{item.label}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Files / Attachments Area */}
          <AnimatePresence>
            {attachedFiles.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-wrap gap-2.5 mb-3.5 border-b border-slate-100 dark:border-slate-700/80 pb-3"
              >
                {attachedFiles.map((file) => (
                  <motion.div
                    key={file.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="w-48 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700 rounded-xl p-2 flex items-center gap-2.5 relative group shadow-sm hover:shadow transition-shadow"
                  >
                    <div className="w-10 h-10 rounded-lg bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-750 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                      {file.type === 'image' && file.thumbnailUrl ? (
                        <img src={file.thumbnailUrl} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <FileText className="text-slate-400" size={16} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 pr-4">
                      <p className="text-[10px] font-bold text-slate-800 dark:text-slate-200 truncate">{file.file.name}</p>
                      {file.progress < 100 ? (
                        <div className="space-y-1 mt-1">
                          <div className="h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full bg-[#166534] rounded-full transition-all duration-150" style={{ width: `${file.progress}%` }} />
                          </div>
                          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{file.progress}% Uploading</span>
                        </div>
                      ) : (
                        <span className="text-[8px] font-bold text-[#166534] uppercase tracking-wider mt-0.5 block">Ready</span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(file.id)}
                      className="absolute top-1 right-1 p-1 bg-white dark:bg-slate-800 rounded-full border border-slate-100 dark:border-slate-700 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <X size={10} strokeWidth={3} />
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Form Fields */}
          <form onSubmit={handleSubmit} className="flex items-end gap-3.5">
            {/* Input Wrapper */}
            <div className="flex-1 relative">
              {isAiLoading && (
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-10">
                  <Loader2 size={16} className="animate-spin text-[#166534]" />
                  <span className="text-[10px] font-bold text-slate-450 uppercase tracking-widest ml-2">AI polishing rewrite...</span>
                </div>
              )}
              <textarea
                ref={textareaRef}
                rows={1}
                value={text}
                disabled={disabled || isAiLoading}
                onChange={(e) => {
                  setText(e.target.value);
                  const el = e.target;
                  el.style.height = 'auto';
                  el.style.height = `${Math.min(el.scrollHeight, 180)}px`;
                }}
                onKeyDown={handleKeyDown}
                placeholder={isAiLoading ? "" : "Type your message..."}
                className={cn(
                  "w-full bg-slate-50/50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-750/70 rounded-[14px] py-3.5 px-4.5 text-sm font-semibold leading-relaxed text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-[#166534]/15 focus:border-[#166534] transition-all resize-none max-h-44 overflow-y-auto block scrollbar-hide select-text",
                  isAiLoading && "pl-48 opacity-40 select-none pointer-events-none"
                )}
                style={{ height: '56px' }}
              />
            </div>

            {/* Submit / Send button */}
            <button 
              type="submit"
              disabled={(!text.trim() && attachedFiles.length === 0) || disabled || isSending || isAiLoading}
              className={cn(
                "w-12 h-12 bg-gradient-to-r from-[#12263A] to-[#166534] hover:shadow-lg hover:shadow-[#166534]/20 text-white rounded-xl flex items-center justify-center transition-all shrink-0 active:scale-95 cursor-pointer disabled:opacity-40 disabled:pointer-events-none disabled:shadow-none mb-1 shadow-sm",
                sendSuccess && "from-emerald-500 to-emerald-600 shadow-emerald-500/15"
              )}
            >
              {isSending ? (
                <Loader2 size={18} className="animate-spin text-white" />
              ) : sendSuccess ? (
                <Check size={18} strokeWidth={3} className="text-white" />
              ) : (
                <Send size={18} strokeWidth={2.5} className="text-white" />
              )}
            </button>
          </form>

          {/* Bottom Toolbar & Indicators */}
          <div className="mt-4.5 pt-3.5 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-4">
            {/* Toolbar Buttons */}
            <div className="flex items-center gap-1 -ml-1">
              {/* Emoji Button */}
              <button 
                type="button" 
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className={cn(
                  "p-2.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900 border border-transparent transition-all cursor-pointer relative",
                  showEmojiPicker && "bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700"
                )}
                title="Add Emoji"
              >
                <Smile size={18} />
              </button>

              {/* Attach File Button */}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                multiple
              />
              <button 
                type="button" 
                onClick={() => fileInputRef.current?.click()}
                className="p-2.5 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900 rounded-full border border-transparent transition-all cursor-pointer"
                title="Attach File"
              >
                <Paperclip size={18} />
              </button>

              {/* AI assistant dropdown toggle */}
              <button 
                type="button" 
                onClick={() => setShowAiDropdown(!showAiDropdown)}
                className={cn(
                  "p-2.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900 border border-transparent transition-all cursor-pointer relative",
                  showAiDropdown && "bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700"
                )}
                title="AI Co-pilot Assistant"
              >
                <Sparkles size={18} />
              </button>

              {/* Send Template Button */}
              <button 
                type="button" 
                onClick={() => setShowTemplatePicker(!showTemplatePicker)}
                className={cn(
                  "p-2.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900 border border-transparent transition-all cursor-pointer relative",
                  showTemplatePicker && "bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700"
                )}
                title="Send Message Template"
              >
                <Layout size={18} />
              </button>
            </div>

            {/* Connection Status & Instructions Indicators */}
            <div className="flex items-center gap-4 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              <span className="hidden sm:inline text-right leading-relaxed select-none">
                ↵ Enter to Send <br /> Shift + Enter for New Line
              </span>
              <div 
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-slate-500 dark:text-slate-400 select-none group relative cursor-help"
                title="API node is operational. Sync status is active."
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span>WhatsApp Live</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
