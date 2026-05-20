import React from 'react';
import { 
  Type, 
  Image as ImageIcon, 
  Video, 
  FileText, 
  Hash, 
  Sparkles, 
  Plus, 
  Trash2, 
  ExternalLink, 
  Phone, 
  Tag, 
  Smile,
  AlertCircle,
  Bold,
  Italic,
  Strikethrough,
  Code,
  Info,
  X,
  FileIcon,
  ChevronDown,
  Loader2,
  Check
} from 'lucide-react';
import { useTemplateStore } from '../../../store/useTemplateStore';
import { HeaderType, ButtonType, TemplateCategory } from '../../../types/whatsapp';
import { whatsappApi } from '../../../services/whatsappApi';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../../lib/utils';
import { GoogleGenAI } from "@google/genai";

export default function TemplateEditor() {
  const { 
    currentTemplate, 
    setTemplateName, 
    setCategory, 
    setLanguage,
    setHeaderType, 
    setHeaderText,
    setHeaderMedia,
    setHeaderMediaHandle,
    setHeaderFileName,
    setHeaderVariable,
    setBodyText,
    setFooterText,
    setBodyVariable,
    addButton,
    updateButton,
    removeButton
  } = useTemplateStore();

  const categories: { id: TemplateCategory; label: string; desc: string }[] = [
    { id: 'MARKETING', label: 'Marketing', desc: 'Promotions, offers, and brand awareness.' },
    { id: 'UTILITY', label: 'Utility', desc: 'Alerts, updates, and transactional info.' },
  ];

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'en_US', name: 'English (US)' },
    { code: 'en_GB', name: 'English (UK)' },
    { code: 'es', name: 'Spanish' },
    { code: 'es_ES', name: 'Spanish (Spain)' },
    { code: 'pt_BR', name: 'Portuguese (Brazil)' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'hi', name: 'Hindi' },
    { code: 'id', name: 'Indonesian' },
    { code: 'ar', name: 'Arabic' },
    { code: 'zh_CN', name: 'Chinese (Simplified)' },
    { code: 'ja', name: 'Japanese' },
    { code: 'tr', name: 'Turkish' },
    { code: 'ru', name: 'Russian' },
  ];

  const headerTypes: { id: HeaderType; label: string; icon: any }[] = [
    { id: 'NONE', label: 'None', icon: Hash },
    { id: 'TEXT', label: 'Text', icon: Type },
    { id: 'IMAGE', label: 'Image', icon: ImageIcon },
    { id: 'DOCUMENT', label: 'Doc', icon: FileText },
  ];

  const handleNameChange = (val: string) => {
    // lowercase and no spaces
    const cleanName = val.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
    setTemplateName(cleanName);
  };

  const addVariable = () => {
    const textarea = document.getElementById('body-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = currentTemplate.body.text;

    // Use current variable count to determine next index
    const varMatches = text.match(/\{\{\d+\}\}/g) || [];
    const nextIndex = varMatches.length + 1;
    const variable = `{{${nextIndex}}}`;

    const newText = text.substring(0, start) + variable + text.substring(end);
    setBodyText(newText);

    // Refocus and set cursor
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + variable.length, start + variable.length);
    }, 0);
  };

  const applyFormatting = (prefix: string, suffix: string = prefix) => {
    const textarea = document.getElementById('body-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = currentTemplate.body.text;
    const selectedText = text.substring(start, end);

    const formattedText = prefix + selectedText + suffix;
    const newText = text.substring(0, start) + formattedText + text.substring(end);
    setBodyText(newText);

    // Refocus and maintain selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  const addEmoji = (emoji: string) => {
    const textarea = document.getElementById('body-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = currentTemplate.body.text;

    const newText = text.substring(0, start) + emoji + text.substring(end);
    setBodyText(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + emoji.length, start + emoji.length);
    }, 0);
  };

  const commonEmojis = ['😊', '👋', '🎉', '💡', '⚠️', '✅', '🚀', '🎁', '📅', '💬'];
  const [showEmojiPicker, setShowEmojiPicker] = React.useState(false);
  const [uploadError, setUploadError] = React.useState<string | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [isRewriting, setIsRewriting] = React.useState(false);
  const [showAIOptions, setShowAIOptions] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const tones = [
    { id: 'professional', label: 'Professional', icon: '👔' },
    { id: 'friendly', label: 'Friendly', icon: '🤝' },
    { id: 'urgent', label: 'Urgent', icon: '🚨' },
    { id: 'creative', label: 'Creative', icon: '🎨' },
  ];

  const handleAIRewrite = async (tone: string) => {
    if (!currentTemplate.body.text.trim()) return;
    
    setIsRewriting(true);
    setShowAIOptions(false);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Rewrite the following WhatsApp message template body in a ${tone} tone. 
        
        STRICT RULES:
        1. Keep all variables like {{1}}, {{2}}, etc. exactly as they are in their original positions if possible, or naturally integrated.
        2. The message must be concise and professional for WhatsApp.
        3. Only return the rewritten text. NO explanations, NO quotes, NO titles.
        4. Preserve the core meaning of the original message.
        
        Current message:
        "${currentTemplate.body.text}"`,
      });
      
      if (response.text) {
        setBodyText(response.text.trim().replace(/^"|"$/g, ''));
      }
    } catch (error) {
      console.error("AI Rewrite failed:", error);
    } finally {
      setIsRewriting(false);
    }
  };

  const validateFile = (file: File) => {
    const type = currentTemplate.header.type;
    const maxSize = type === 'IMAGE' ? 5 * 1024 * 1024 : 
                    100 * 1024 * 1024; // Document

    if (file.size > maxSize) {
      return `File is too large. Max size for ${type.toLowerCase()} is ${maxSize / (1024 * 1024)}MB`;
    }

    if (type === 'IMAGE' && !file.type.startsWith('image/')) return 'Invalid image file';
    if (type === 'DOCUMENT' && file.type !== 'application/pdf') return 'Only PDF documents are supported';

    return null;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const error = validateFile(file);
    if (error) {
      setUploadError(error);
      return;
    }

    setUploadError(null);
    setIsUploading(true);

    try {
      // 1. Upload to server to get media_handle
      const response = await whatsappApi.uploadMedia(file);
      console.log('TemplateEditor: Media upload response processing:', response);
      
      // Prioritize header_handle as requested by the user, then fallback to others
      const media_handle = 
        response.header_handle ||
        response.media_handle || 
        (response as any).id ||
        (response as any).response?.h || // From user sample JSON
        (response as any).data?.media_handle || 
        (response as any).data?.id ||
        (response as any).data || 
        (typeof response === 'string' ? response : null);
      
      if (!media_handle || typeof media_handle !== 'string') {
         console.error('Failed to find media_handle in response:', response);
         throw new Error('Server did not return a valid media handle. Please check your file and try again.');
      }
      
      setHeaderMediaHandle(media_handle);

      const media_path = 
        response.media_path || 
        (response as any).data?.media_path || 
        (response as any).response?.media_path;

      const media_type = 
        response.media_type || 
        (response as any).data?.media_type || 
        (response as any).response?.media_type ||
        (currentTemplate.header.type);

      const media_url = 
        response.media_url || 
        (response as any).data?.media_url || 
        (response as any).response?.media_url;

      // 2. Create local URL for preview if media_url is not returned
      const previewUrl = media_url || URL.createObjectURL(file);
      if (currentTemplate.header.type === 'DOCUMENT') {
        setHeaderMedia(previewUrl, file.name, media_path, media_type);
      } else {
        setHeaderMedia(previewUrl, undefined, media_path, media_type);
      }
    } catch (err: any) {
      console.error('Media upload failed:', err);
      setUploadError(err.message || 'Failed to upload media. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6 pb-24">
      {/* 1. Meta Information */}
      <section className="premium-card p-8 space-y-6 bg-white border border-slate-200/80 rounded-2xl shadow-premium hover:shadow-floating transition-all duration-300">
        <div className="flex items-center gap-4 pb-5 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 shadow-sm">
            <Tag size={20} />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900 tracking-tight font-display">General Information</h2>
            <p className="text-[11px] text-slate-400 font-medium">Define your WhatsApp template name, category and primary language</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1">
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1">
              Template Name
              <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input 
                type="text" 
                value={currentTemplate.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="summer_promo_2024"
                className={cn(
                  "input-premium font-mono text-xs pr-10",
                  !currentTemplate.name && "border-amber-300 bg-amber-50/10 focus:ring-amber-500/10 focus:border-amber-500"
                )}
              />
              {!currentTemplate.name && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-500 animate-pulse" title="Required">
                  <AlertCircle size={14} />
                </div>
              )}
            </div>
            <p className="text-[9.5px] text-slate-400 mt-1 uppercase tracking-tight font-bold">Unique, lowercase, numbers & underscores only.</p>
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1">
              Category
              <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select 
                value={currentTemplate.category}
                onChange={(e) => setCategory(e.target.value as TemplateCategory)}
                className="input-premium appearance-none cursor-pointer pr-10 text-xs font-bold"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.label}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 bg-white pl-1">
                 <ChevronDown size={14} />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1">
              Language
              <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select 
                value={currentTemplate.language}
                onChange={(e) => setLanguage(e.target.value)}
                className="input-premium appearance-none cursor-pointer pr-10 text-xs font-bold"
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>{lang.name}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 bg-white pl-1">
                 <ChevronDown size={14} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Header Content */}
      <section className="premium-card p-8 space-y-6 bg-white border border-slate-200/80 rounded-2xl shadow-premium hover:shadow-floating transition-all duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 shadow-sm">
              <ImageIcon size={20} />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 tracking-tight font-display">Header Content</h2>
              <p className="text-[11px] text-slate-400 font-medium font-sans">Add visual elements or plain text to the top of your layout</p>
            </div>
          </div>
          <div className="flex bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200 shrink-0 self-start sm:self-center">
            {headerTypes.map(type => (
              <button
                key={type.id}
                onClick={() => setHeaderType(type.id)}
                className={cn(
                  "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-200 flex items-center gap-2",
                  currentTemplate.header.type === type.id 
                    ? "bg-white text-indigo-600 shadow-sm ring-1 ring-slate-100" 
                    : "text-slate-500 hover:text-slate-800"
                )}
              >
                <type.icon size={12} className={cn("stroke-[2.5px]", currentTemplate.header.type === type.id ? "text-indigo-600" : "text-slate-400")} />
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {currentTemplate.header.type === 'TEXT' && (
          <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1">
                Header Text
                <span className="text-red-500">*</span>
              </label>
              <button 
                onClick={() => {
                  const current = currentTemplate.header.text || '';
                  if (!current.includes('{{1}}')) {
                    setHeaderText(current + ' {{1}}');
                  }
                }}
                disabled={currentTemplate.header.text?.includes('{{1}}')}
                className="text-[10px] font-black text-indigo-600 hover:text-indigo-700 disabled:opacity-50 disabled:pointer-events-none flex items-center gap-1.5 transition-colors uppercase tracking-widest"
              >
                <Plus size={12} className="stroke-[3px]" />
                Add Variable
              </button>
            </div>
            <div className="relative">
              <input 
                type="text" 
                value={currentTemplate.header.text}
                onChange={(e) => setHeaderText(e.target.value)}
                placeholder="Important Update"
                maxLength={60}
                className={cn(
                  "input-premium pr-16",
                  (!currentTemplate.header.text || currentTemplate.header.text.trim() === '') && "border-amber-300 bg-amber-50/10 focus:ring-amber-500/10 focus:border-amber-500"
                )}
              />
              {(!currentTemplate.header.text || currentTemplate.header.text.trim() === '') && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-500" title="Required">
                  <AlertCircle size={14} />
                </div>
              )}
            </div>
            <div className="flex justify-end pr-1">
              <span className={cn(
                "text-[9.5px] font-bold",
                (currentTemplate.header.text?.length || 0) > 55 ? "text-red-500" : "text-slate-400"
              )}>{(currentTemplate.header.text?.length || 0)} / 60</span>
            </div>
          </div>
        )}

        {['IMAGE', 'DOCUMENT'].includes(currentTemplate.header.type) && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
            {currentTemplate.header.type === 'DOCUMENT' && (
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Document File Name</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={currentTemplate.header.fileName || ''}
                    onChange={(e) => setHeaderFileName(e.target.value)}
                    placeholder="business_proposal.pdf"
                    className="input-premium text-xs"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <FileText size={16} />
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 font-medium">The filename that will be shown directly to the recipient.</p>
              </div>
            )}

            {currentTemplate.header.mediaUrl ? (
              <div className="relative group rounded-2xl overflow-hidden border border-slate-200/85 bg-slate-50/50 p-4 transition-all hover:bg-slate-50">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center overflow-hidden shrink-0">
                    {currentTemplate.header.type === 'IMAGE' && (
                      <img src={currentTemplate.header.mediaUrl} alt="Preview" className="w-full h-full object-cover" />
                    )}
                    {currentTemplate.header.type === 'DOCUMENT' && (
                      <FileIcon size={24} className="text-indigo-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-slate-900 truncate">
                      {currentTemplate.header.fileName || 'Uploaded Media Asset'}
                    </p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black mt-1 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-ping"></span>
                      {currentTemplate.header.type} PREVIEW ACTIVE
                    </p>
                  </div>
                  <button 
                    onClick={() => { setHeaderMedia(''); setHeaderMediaHandle(''); }}
                    className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    title="Remove media"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                
                {/* Visual indicator bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-60" />
              </div>
            ) : (
              <div 
                onClick={triggerFileUpload}
                className={cn(
                  "border-2 border-dashed rounded-2xl p-8 flex flex-col items-center text-center space-y-4 transition-all cursor-pointer group",
                  uploadError ? "border-red-400 bg-red-50/10" : "border-slate-200 hover:border-indigo-500/50 hover:bg-indigo-500/[0.02]"
                )}
              >
                <input 
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept={
                    currentTemplate.header.type === 'IMAGE' ? "image/*" :
                    ".pdf"
                  }
                  onChange={handleFileChange}
                />
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-sm",
                  uploadError ? "bg-red-100 text-red-600 animate-bounce" : "bg-slate-50 text-indigo-500 ring-1 ring-slate-100 group-hover:bg-white group-hover:shadow-md"
                )}>
                  {isUploading ? (
                    <Loader2 size={24} className="animate-spin text-indigo-600" />
                  ) : (
                    <>
                      {currentTemplate.header.type === 'IMAGE' && <ImageIcon size={24} />}
                      {currentTemplate.header.type === 'DOCUMENT' && <FileText size={24} />}
                    </>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-black text-slate-800 uppercase tracking-wide">
                    {isUploading ? "Uploading media file..." : (uploadError ? "Invalid file type or size" : "Click to select or drag file here")}
                  </p>
                  <p className={cn(
                    "text-[11px] font-medium block",
                    uploadError ? "text-red-500" : "text-slate-400"
                  )}>
                    {isUploading ? "Please wait while we generate a secure WhatsApp media handle" : (
                      uploadError || (
                        currentTemplate.header.type === 'IMAGE' ? 'JPG, PNG, or WEBP (Standard high-res, Max 5MB)' : 
                        'PDF Business Document (Max 100MB)'
                      )
                    )}
                  </p>
                </div>
                {!uploadError && !isUploading && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); triggerFileUpload(); }}
                    className="btn-premium-secondary py-2 px-5 text-[10px] uppercase tracking-widest shadow-sm rounded-xl cursor-pointer"
                  >
                    Select file
                  </button>
                )}
                {uploadError && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); setUploadError(null); }}
                    className="text-[10px] font-black text-slate-500 hover:text-slate-900 flex items-center gap-1.5 uppercase tracking-widest"
                  >
                    <X size={14} className="stroke-[3px]" />
                    Try again
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </section>

      {/* 3. Message Body Content */}
      <section className="premium-card p-8 space-y-6 bg-white border border-slate-200/80 rounded-2xl shadow-premium hover:shadow-floating transition-all duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600 shadow-sm">
              <Type size={20} />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 tracking-tight font-display">Message Body</h2>
              <p className="text-[11px] text-slate-400 font-medium font-sans">Draft the primary message content, insert variable values, and apply rich formatting</p>
            </div>
          </div>
          <div className="relative shrink-0 self-start sm:self-center">
            <button 
              onClick={() => setShowAIOptions(!showAIOptions)}
              disabled={isRewriting || !currentTemplate.body.text.trim()}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm group cursor-pointer",
                isRewriting 
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-500/10 to-indigo-500/10 text-indigo-600 hover:from-purple-500/15 hover:to-indigo-500/15 border border-indigo-100"
              )}
            >
              {isRewriting ? (
                <Loader2 size={12} className="animate-spin text-indigo-600" />
              ) : (
                <Sparkles size={12} className="group-hover:rotate-12 transition-transform text-indigo-600 stroke-[2.5px]" />
              )}
              {isRewriting ? 'Rewriting...' : 'AI Assist'}
            </button>

            <AnimatePresence>
              {showAIOptions && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowAIOptions(false)} 
                  />
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-floating z-50 overflow-hidden"
                  >
                    <div className="p-3 border-b border-slate-100 bg-slate-50/50">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Convert tone</p>
                    </div>
                    <div className="p-1.5 space-y-1">
                      {tones.map((tone) => (
                        <button
                          key={tone.id}
                          onClick={() => handleAIRewrite(tone.id)}
                          className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 rounded-xl transition-all group cursor-pointer"
                        >
                          <span className="text-sm group-hover:scale-110 transition-transform">{tone.icon}</span>
                          <span className="flex-1 text-left">{tone.label}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="space-y-3">
          <div className="relative group border border-slate-200 rounded-2xl bg-white focus-within:ring-4 focus-within:ring-indigo-500/5 focus-within:border-indigo-500 transition-all overflow-hidden shadow-sm">
            <textarea 
              id="body-textarea"
              value={currentTemplate.body.text}
              onChange={(e) => setBodyText(e.target.value)}
              placeholder="Hello {{1}}, your order #{{2}} of {{3}} is confirmed and on its way! 🚀"
              maxLength={1024}
              className={cn(
                "w-full min-h-[160px] p-5 text-sm font-medium leading-relaxed bg-white border-0 focus:outline-none focus:ring-0 transition-all resize-none outline-none",
                (!currentTemplate.body.text || currentTemplate.body.text.trim() === '') && "bg-amber-50/[0.02]"
              )}
            />
            
            {/* Embedded Toolbar at the bottom of the editor */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-3 text-slate-400 relative">
                <div className="relative">
                  <button 
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className={cn("p-1.5 hover:text-slate-800 hover:bg-slate-200/50 rounded-lg transition-all cursor-pointer", showEmojiPicker && "text-slate-800 bg-slate-200/50")}
                    title="Insert Emoji"
                  >
                    <Smile size={18} className="stroke-[2.2px]" />
                  </button>
                  {showEmojiPicker && (
                    <div className="absolute bottom-full left-0 mb-2 p-2 bg-white border border-slate-200/90 rounded-2xl shadow-floating z-50 flex gap-1.5 animate-in fade-in slide-in-from-bottom-2 duration-200">
                      {commonEmojis.map(emoji => (
                        <button 
                          key={emoji} 
                          onClick={() => { addEmoji(emoji); setShowEmojiPicker(false); }}
                          className="p-1.5 text-base hover:bg-slate-100 rounded-xl transition-all cursor-pointer h-9 w-9 flex items-center justify-center hover:scale-110"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="h-4 w-px bg-slate-200" />
                
                <button 
                  onClick={() => applyFormatting('*')} 
                  className="p-1.5 hover:text-slate-800 hover:bg-slate-200/50 rounded-lg transition-all cursor-pointer"
                  title="Bold (*bold*)"
                >
                  <Bold size={16} className="stroke-[2.2px]" />
                </button>
                <button 
                  onClick={() => applyFormatting('_')} 
                  className="p-1.5 hover:text-slate-800 hover:bg-slate-200/50 rounded-lg transition-all cursor-pointer"
                  title="Italic (_italic_)"
                >
                  <Italic size={16} className="stroke-[2.2px]" />
                </button>
                <button 
                  onClick={() => applyFormatting('~')} 
                  className="p-1.5 hover:text-slate-800 hover:bg-slate-200/50 rounded-lg transition-all cursor-pointer"
                  title="Strikethrough (~strike~)"
                >
                  <Strikethrough size={16} className="stroke-[2.2px]" />
                </button>
                <button 
                  onClick={() => applyFormatting('```')} 
                  className="p-1.5 hover:text-slate-800 hover:bg-slate-200/50 rounded-lg transition-all cursor-pointer"
                  title="Monospace (```code```)"
                >
                  <Code size={16} className="stroke-[2.2px]" />
                </button>
                
                <div className="h-4 w-px bg-slate-200" />
                
                <button 
                  onClick={addVariable}
                  className="flex items-center gap-1.5 text-slate-600 hover:text-indigo-600 transition-all px-2.5 py-1 rounded-xl hover:bg-indigo-50/50 cursor-pointer"
                  title="Insert a custom parameter placeholder"
                >
                  <Plus size={14} strokeWidth={3} className="text-slate-400 group-hover:text-indigo-600" />
                  <span className="text-[11px] font-black uppercase tracking-wider">Add variable</span>
                </button>
              </div>
              
              <div className="text-[10px] font-bold text-slate-400 font-mono tracking-wider">
                {currentTemplate.body.text.length} / 1024
              </div>
            </div>
          </div>
        </div>

        {/* Variable samples section */}
        <div className="pt-6 border-t border-slate-100 space-y-6">
           {currentTemplate.header.type === 'TEXT' && currentTemplate.header.text?.includes('{{1}}') && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                 <div className="space-y-1">
                    <h3 className="text-sm font-black text-slate-850 font-display">Header Parameter</h3>
                    <p className="text-[11px] text-slate-400 font-medium">
                       Enter sample text to verify your header variable placeholder
                    </p>
                 </div>
                 <div className="space-y-3">
                    <div className="space-y-2">
                       <div className="relative">
                          <div className="flex items-center gap-2 mb-2">
                             <div className="px-2 py-0.5 bg-indigo-50 border border-indigo-100 rounded-lg text-[10px] font-black text-indigo-600 font-mono tracking-widest">
                                {'{{1}}'}
                             </div>
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">Header sample value</span>
                          </div>
                          <div className="relative">
                             <input 
                                type="text"
                                value={currentTemplate.header.variables?.[0] || ''}
                                onChange={(e) => setHeaderVariable(0, e.target.value)}
                                placeholder="e.g. Acme Corp"
                                className="input-premium h-11"
                             />
                             {!(currentTemplate.header.variables?.[0]) && (
                                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-amber-500 animate-pulse">
                                   <AlertCircle size={16} />
                                </div>
                             )}
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           )}

           {currentTemplate.body.text.includes('{{') && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                 <div className="space-y-1">
                    <h3 className="text-sm font-black text-slate-850 font-display">Body Parameter Samples</h3>
                    <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                       Meta requires example content for all variables to ensure policy guidelines aren't bypassed. Do not insert actual private data.
                    </p>
                 </div>

                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Array.from(new Set(currentTemplate.body.text.match(/\{\{(\d+)\}\}/g) || [])).sort((a, b) => {
                       const numA = parseInt(a.match(/\d+/)?.[0] || '0');
                       const numB = parseInt(b.match(/\d+/)?.[0] || '0');
                       return numA - numB;
                    }).map((variable) => {
                       const index = parseInt(variable.match(/\d+/)?.[0] || '1') - 1;
                       return (
                          <div key={variable} className="p-4 bg-white rounded-xl border border-slate-100 space-y-2.5 shadow-sm">
                             <div className="relative">
                                <div className="flex items-center gap-2 mb-2">
                                   <div className="px-2 py-0.5 bg-indigo-50 border border-indigo-100 rounded-lg text-[9px] font-black text-indigo-600 font-mono tracking-widest">
                                      {variable}
                                   </div>
                                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">Body parameter</span>
                                </div>
                                <div className="relative">
                                   <input 
                                      type="text"
                                      value={currentTemplate.body.variables[index] || ''}
                                      onChange={(e) => setBodyVariable(index, e.target.value)}
                                      placeholder={`Enter content for ${variable}`}
                                      className="input-premium py-2 text-xs"
                                   />
                                   {!currentTemplate.body.variables[index] && (
                                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-500 animate-pulse">
                                         <AlertCircle size={14} />
                                      </div>
                                   )}
                                </div>
                             </div>
                             {!currentTemplate.body.variables[index] && (
                                <button 
                                  onClick={() => setBodyVariable(index, "Sample Text")}
                                  className="text-[9.5px] font-black text-indigo-600 hover:text-indigo-850 uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer"
                                >
                                   <Plus size={10} className="stroke-[3.5px]" /> Auto-fill sample
                                </button>
                             )}
                          </div>
                       );
                    })}
                 </div>
              </div>
           )}

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-5">
              <div className="space-y-2">
                 <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Footer text <span className="font-medium normal-case opacity-60 ml-1">(Optional)</span></label>
                 <input 
                   type="text" 
                   value={currentTemplate.footer?.text || ''}
                   onChange={(e) => setFooterText(e.target.value)}
                   placeholder="Reply STOP to opt out"
                   className="input-premium text-xs"
                 />
              </div>
              <div className="flex items-end pb-1">
                 <div className="flex items-start gap-3 text-[11px] font-medium text-amber-700 bg-amber-500/[0.04] p-3 rounded-2xl border border-amber-500/10">
                    <AlertCircle size={15} className="shrink-0 mt-0.5 text-amber-500" />
                    <span>Max 60 characters. Standard opt-out footers lower user spam reports and protect your template delivery quality.</span>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* 4. Interactive Components */}
      <section className="premium-card p-8 space-y-6 bg-white border border-slate-200/80 rounded-2xl shadow-premium hover:shadow-floating transition-all duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 shadow-sm animate-pulse-slow">
              <ExternalLink size={20} />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 tracking-tight font-display">Call to Actions</h2>
              <p className="text-[11px] text-slate-400 font-medium font-sans">Configure high-conversion buttons (up to 3 total) to drive instant action</p>
            </div>
          </div>
          <div className="flex gap-2.5">
             <button 
               disabled={currentTemplate.buttons.length >= 3}
               onClick={() => addButton({ type: 'URL', text: 'Visit Website', url: 'https://' })}
               className="btn-premium-secondary py-2 px-4 text-[10px] uppercase tracking-widest gap-2 rounded-xl cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
             >
               <Plus size={12} className="stroke-[3px]" />
               Add Link
             </button>
             <button 
               disabled={currentTemplate.buttons.length >= 3}
               onClick={() => addButton({ type: 'CALL', text: 'Call Support', phoneNumber: '' })}
               className="btn-premium-secondary py-2 px-4 text-[10px] uppercase tracking-widest gap-2 rounded-xl cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
             >
               <Phone size={12} className="stroke-[2.5px]" />
               Add Phone
             </button>
          </div>
        </div>

        <div className="space-y-4">
          {currentTemplate.buttons.map((btn, index) => (
            <motion.div 
              key={btn.id}
              initial={{ opacity: 0, scale: 0.98, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="p-5 bg-slate-50/50 border border-slate-250/50 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-4 group hover:border-slate-350 hover:bg-white transition-all duration-300 shadow-premium/5 hover:relative hover:z-10"
            >
              <div className="w-11 h-11 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-colors shrink-0">
                {btn.type === 'URL' ? <ExternalLink size={18} /> : <Phone size={18} />}
              </div>
              
              <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Button Title</span>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={btn.text}
                      onChange={(e) => updateButton(btn.id, { text: e.target.value })}
                      placeholder="e.g. Visit Shop"
                      className={cn(
                        "input-premium py-2 text-xs font-bold",
                        !btn.text && "border-red-300 bg-red-50/10 focus:ring-red-500/10 focus:border-red-500"
                      )}
                    />
                    {!btn.text && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 animate-pulse">
                        <AlertCircle size={14} />
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">{btn.type === 'URL' ? 'Target URL Link' : 'Target Phone Number'}</span>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={btn.type === 'URL' ? btn.url : btn.phoneNumber}
                      onChange={(e) => updateButton(btn.id, btn.type === 'URL' ? { url: e.target.value } : { phoneNumber: e.target.value })}
                      placeholder={btn.type === 'URL' ? "e.g. https://google.com" : "e.g. 15551234567"}
                      className={cn(
                        "input-premium py-2 text-xs font-medium",
                        ((btn.type === 'URL' && (!btn.url || btn.url.length < 10)) || (btn.type === 'CALL' && (!btn.phoneNumber || btn.phoneNumber.length < 5))) && "border-amber-300 bg-amber-50/10 focus:ring-amber-500/10 focus:border-amber-500 text-amber-700"
                      )}
                    />
                    {((btn.type === 'URL' && (!btn.url || btn.url.length < 10)) || (btn.type === 'CALL' && (!btn.phoneNumber || btn.phoneNumber.length < 5))) && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-500">
                        <AlertCircle size={14} />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <button 
                onClick={() => removeButton(btn.id)}
                className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all self-end sm:self-center cursor-pointer"
                title="Remove Button"
              >
                <Trash2 size={16} />
              </button>
            </motion.div>
          ))}
          
          {currentTemplate.buttons.length === 0 && (
            <div className="text-center py-10 border-2 border-dashed border-slate-200 bg-slate-50/50 rounded-2xl flex flex-col items-center justify-center space-y-2">
               <ExternalLink size={24} className="text-slate-300 stroke-[1.5px]" />
               <div>
                 <p className="text-xs font-black text-slate-500 uppercase tracking-widest">No Buttons Pre-Configured</p>
                 <p className="text-[10.5px] text-slate-400 mt-1 font-medium max-w-xs mx-auto">Add Visit Website urls or Call Support buttons to dramatically elevate template interaction ratios.</p>
               </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
