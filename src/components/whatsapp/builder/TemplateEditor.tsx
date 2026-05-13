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

      // 2. Create local URL for preview
      const objectUrl = URL.createObjectURL(file);
      if (currentTemplate.header.type === 'DOCUMENT') {
        setHeaderMedia(objectUrl, file.name);
      } else {
        setHeaderMedia(objectUrl);
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
      <section className="glass-card p-6 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-border-subtle">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600">
            <Tag size={18} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">General Information</h2>
            <p className="text-[10px] text-text-muted font-medium">Basic template identification and categorization</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1">
            <label className="label-base">Template Name</label>
            <input 
              type="text" 
              value={currentTemplate.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="summer_promo_2024"
              className="input-base font-mono text-xs"
            />
            <p className="text-[9px] text-text-muted mt-1">Unique, lowercase, no spaces.</p>
          </div>

          <div className="space-y-1">
            <label className="label-base">Category</label>
            <div className="relative">
              <select 
                value={currentTemplate.category}
                onChange={(e) => setCategory(e.target.value as TemplateCategory)}
                className="input-base appearance-none cursor-pointer pr-10"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.label}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
                 <ChevronDown size={14} />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="label-base">Language</label>
            <div className="relative">
              <select 
                value={currentTemplate.language}
                onChange={(e) => setLanguage(e.target.value)}
                className="input-base appearance-none cursor-pointer pr-10"
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>{lang.name}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
                 <ChevronDown size={14} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Header Content */}
      <section className="glass-card p-6 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-border-subtle">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600">
              <ImageIcon size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Header Content</h2>
              <p className="text-[10px] text-text-muted font-medium">Add a visual or text to the top of your message</p>
            </div>
          </div>
          <div className="flex bg-bg-muted p-1 rounded-xl border border-border">
            {headerTypes.map(type => (
              <button
                key={type.id}
                onClick={() => setHeaderType(type.id)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-2",
                  currentTemplate.header.type === type.id 
                    ? "bg-white text-blue-600 shadow-subtle border border-border" 
                    : "text-text-muted hover:text-text-secondary"
                )}
              >
                <type.icon size={12} />
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {currentTemplate.header.type === 'TEXT' && (
          <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2">
            <label className="label-base">Header Text</label>
            <input 
              type="text" 
              value={currentTemplate.header.text}
              onChange={(e) => setHeaderText(e.target.value)}
              placeholder="Important Update"
              maxLength={60}
              className="input-base"
            />
            <div className="flex justify-end pr-1">
              <span className={cn(
                "text-[9px] font-bold",
                (currentTemplate.header.text?.length || 0) > 55 ? "text-danger" : "text-text-muted"
              )}>{(currentTemplate.header.text?.length || 0)} / 60</span>
            </div>
          </div>
        )}

        {['IMAGE', 'DOCUMENT'].includes(currentTemplate.header.type) && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
            {currentTemplate.header.type === 'DOCUMENT' && (
              <div className="space-y-1.5">
                <label className="label-base">File Name</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={currentTemplate.header.fileName || ''}
                    onChange={(e) => setHeaderFileName(e.target.value)}
                    placeholder="business_proposal.pdf"
                    className="input-base text-xs"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
                    <FileText size={14} />
                  </div>
                </div>
                <p className="text-[9px] text-text-muted">The name that will be visible to recipients.</p>
              </div>
            )}

            {currentTemplate.header.mediaUrl ? (
              <div className="relative group rounded-xl overflow-hidden border border-border bg-slate-50">
                <div className="p-4 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg bg-white border border-border shadow-sm flex items-center justify-center overflow-hidden shrink-0">
                    {currentTemplate.header.type === 'IMAGE' && (
                      <img src={currentTemplate.header.mediaUrl} alt="Preview" className="w-full h-full object-cover" />
                    )}
                    {currentTemplate.header.type === 'DOCUMENT' && (
                      <FileIcon size={24} className="text-blue-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {currentTemplate.header.fileName || 'Uploaded Media'}
                    </p>
                    <p className="text-[10px] text-text-muted uppercase tracking-tight font-medium mt-0.5">
                      {currentTemplate.header.type} PREVIEW ACTIVE
                    </p>
                  </div>
                  <button 
                    onClick={() => { setHeaderMedia(''); setHeaderMediaHandle(''); }}
                    className="p-2 text-text-muted hover:text-danger hover:bg-danger/5 rounded-lg transition-all"
                    title="Remove media"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                
                {/* Visual indicator for video/doc types since they might not show a clear image preview */}
                {currentTemplate.header.type !== 'IMAGE' && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500/20" />
                )}
              </div>
            ) : (
              <div 
                onClick={triggerFileUpload}
                className={cn(
                  "border-2 border-dashed rounded-xl p-8 flex flex-col items-center text-center space-y-4 transition-all cursor-pointer group",
                  uploadError ? "border-danger bg-danger/5" : "border-border hover:border-blue-500/50 hover:bg-blue-50/10"
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
                  "w-12 h-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-110",
                  uploadError ? "bg-danger/10 text-danger" : "bg-blue-50 text-blue-500"
                )}>
                  {isUploading ? (
                    <Loader2 size={24} className="animate-spin text-blue-500" />
                  ) : (
                    <>
                      {currentTemplate.header.type === 'IMAGE' && <ImageIcon size={24} />}
                      {currentTemplate.header.type === 'DOCUMENT' && <FileText size={24} />}
                    </>
                  )}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">
                    {isUploading ? "Uploading media..." : (uploadError ? "Invalid file" : "Click to upload or drag and drop")}
                  </p>
                  <p className={cn(
                    "text-xs mt-1",
                    uploadError ? "text-danger font-medium" : "text-text-muted"
                  )}>
                    {isUploading ? "Please wait while we process your file" : (
                      uploadError || (
                        currentTemplate.header.type === 'IMAGE' ? 'JPG, PNG or WEBP (Max 5MB)' : 
                        'PDF (Max 100MB)'
                      )
                    )}
                  </p>
                </div>
                {!uploadError && !isUploading && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); triggerFileUpload(); }}
                    className="btn-premium-secondary py-2 px-6 text-[11px] uppercase tracking-widest shadow-sm"
                  >
                    Choose file
                  </button>
                )}
                {uploadError && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); setUploadError(null); }}
                    className="text-[11px] font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
                  >
                    <X size={14} />
                    Try again
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </section>

      {/* 3. Message Body Content */}
      <section className="glass-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-800">Body</h2>
          <div className="relative">
            <button 
              onClick={() => setShowAIOptions(!showAIOptions)}
              disabled={isRewriting || !currentTemplate.body.text.trim()}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all shadow-sm group",
                isRewriting 
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                  : "bg-purple-500/10 text-purple-600 hover:bg-purple-500/20"
              )}
            >
              {isRewriting ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Sparkles size={14} className="group-hover:rotate-12 transition-transform" />
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
                    className="absolute right-0 top-full mt-2 w-48 bg-white border border-border rounded-xl shadow-xl z-50 overflow-hidden"
                  >
                    <div className="p-2 border-b border-border bg-slate-50">
                      <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider px-2">Select tone</p>
                    </div>
                    <div className="p-1">
                      {tones.map((tone) => (
                        <button
                          key={tone.id}
                          onClick={() => handleAIRewrite(tone.id)}
                          className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors group"
                        >
                          <span className="text-base">{tone.icon}</span>
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

        <div className="relative group">
          <div className="absolute top-3 right-4 text-[13px] font-medium text-text-muted pointer-events-none z-10">
             {currentTemplate.body.text.length}/1024
          </div>
          <textarea 
            id="body-textarea"
            value={currentTemplate.body.text}
            onChange={(e) => setBodyText(e.target.value)}
            placeholder="Hi {{1}}, your order #{{2}} is confirmed!"
            className="w-full min-h-[160px] bg-white border border-border rounded-lg p-5 text-[15px] font-normal leading-relaxed focus:outline-none focus:ring-1 focus:ring-slate-300 focus:border-slate-300 transition-all resize-none shadow-sm"
          />
        </div>
        
        <div className="flex items-center justify-between pt-1">
           <div className="flex items-center gap-5 text-slate-500 relative">
              <div className="relative">
                <button 
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className={cn("hover:text-slate-900 transition-colors", showEmojiPicker && "text-slate-900")}
                >
                  <Smile size={20} />
                </button>
                {showEmojiPicker && (
                  <div className="absolute bottom-full left-0 mb-2 p-2 bg-white border border-border rounded-xl shadow-xl z-50 flex gap-1 animate-in fade-in slide-in-from-bottom-2">
                    {commonEmojis.map(emoji => (
                      <button 
                        key={emoji} 
                        onClick={() => { addEmoji(emoji); setShowEmojiPicker(false); }}
                        className="p-1 hover:bg-slate-50 rounded transition-colors"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button onClick={() => applyFormatting('*')} className="hover:text-slate-900 transition-colors"><Bold size={20} /></button>
              <button onClick={() => applyFormatting('_')} className="hover:text-slate-900 transition-colors"><Italic size={20} /></button>
              <button onClick={() => applyFormatting('~')} className="hover:text-slate-900 transition-colors"><Strikethrough size={20} /></button>
              <button onClick={() => applyFormatting('```')} className="hover:text-slate-900 transition-colors"><Code size={20} /></button>
              
              <div className="h-4 w-px bg-slate-200 mx-1" />
              
              <button 
                 onClick={addVariable}
                 className="flex items-center gap-2 text-slate-700 hover:text-slate-900 transition-all group px-2 py-1 rounded-md hover:bg-slate-50"
              >
                 <Plus size={18} strokeWidth={2.5} className="text-slate-400 group-hover:text-slate-900" />
                 <span className="text-[14px] font-bold">Add variable</span>
              </button>
           </div>
           
           <button className="text-slate-400 hover:text-slate-900 transition-colors">
              <Info size={18} />
           </button>
        </div>

        {/* Variable samples section */}
        <div className="pt-6 mt-4 border-t border-border-subtle space-y-6">
           {currentTemplate.body.text.includes('{{') && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                 <div className="space-y-2">
                    <h3 className="text-[15px] font-bold text-slate-800">Variable samples</h3>
                    <p className="text-[13px] text-slate-600 leading-relaxed">
                       Include samples of all variables in your message to help Meta review your template. Remember not to include any customer information to protect your customer's privacy.
                    </p>
                 </div>

                 <div className="space-y-4">
                    <h4 className="text-[14px] font-bold text-slate-800">Body</h4>
                    
                    {Array.from(new Set(currentTemplate.body.text.match(/\{\{(\d+)\}\}/g) || [])).sort((a, b) => {
                       const numA = parseInt(a.match(/\d+/)?.[0] || '0');
                       const numB = parseInt(b.match(/\d+/)?.[0] || '0');
                       return numA - numB;
                    }).map((variable) => {
                       const index = parseInt(variable.match(/\d+/)?.[0] || '1') - 1;
                       return (
                          <div key={variable} className="space-y-2">
                             <div className="relative">
                                <div className="flex items-center gap-2 mb-1.5">
                                   <div className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-[11px] font-bold text-slate-600 font-mono">
                                      {variable}
                                   </div>
                                </div>
                                <div className="relative">
                                   <input 
                                      type="text"
                                      value={currentTemplate.body.variables[index] || ''}
                                      onChange={(e) => setBodyVariable(index, e.target.value)}
                                      placeholder={`Enter content for ${variable}`}
                                      className="w-full h-11 px-4 border border-slate-200 rounded-lg text-[14px] focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-200 placeholder:text-slate-400 bg-white shadow-sm transition-all"
                                   />
                                   {!currentTemplate.body.variables[index] && (
                                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-danger">
                                         <AlertCircle size={18} />
                                      </div>
                                   )}
                                </div>
                             </div>
                             {!currentTemplate.body.variables[index] && (
                                <button className="text-[12px] font-medium text-danger hover:underline">
                                   Add sample text
                                </button>
                             )}
                          </div>
                       );
                    })}
                 </div>
              </div>
           )}

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                 <label className="label-base">Footer <span className="font-normal normal-case opacity-60 ml-1">(Optional)</span></label>
                 <input 
                   type="text" 
                   value={currentTemplate.footer?.text || ''}
                   onChange={(e) => setFooterText(e.target.value)}
                   placeholder="Reply STOP to unsubscribe"
                   className="input-base text-xs h-10"
                 />
              </div>
              <div className="flex items-end pb-1">
                 <div className="flex items-center gap-2 text-[10px] font-medium text-amber-600 bg-amber-50/50 px-3 py-1.5 rounded-lg border border-amber-100/50">
                    <AlertCircle size={14} className="shrink-0" />
                    Max 60 chars. Opt-out recommended for lower bounce rates.
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* 4. Interactive Components */}
      <section className="glass-card p-6 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-border-subtle">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600">
              <ExternalLink size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Call to Actions</h2>
              <p className="text-[10px] text-text-muted font-medium">Add up to 3 interactive buttons to your template</p>
            </div>
          </div>
          <div className="flex gap-2">
             <button 
               disabled={currentTemplate.buttons.length >= 3}
               onClick={() => addButton({ type: 'URL', text: 'Visit Website', url: 'https://' })}
               className="btn-premium-secondary py-1.5 px-3 text-[10px] uppercase tracking-widest gap-1.5"
             >
               <Plus size={14} />
               Add Link
             </button>
             <button 
               disabled={currentTemplate.buttons.length >= 3}
               onClick={() => addButton({ type: 'CALL', text: 'Call Support', phoneNumber: '' })}
               className="btn-premium-secondary py-1.5 px-3 text-[10px] uppercase tracking-widest gap-1.5"
             >
               <Phone size={14} />
               Add Phone
             </button>
          </div>
        </div>

        <div className="space-y-3">
          {currentTemplate.buttons.map((btn, index) => (
            <motion.div 
              key={btn.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-bg-muted border border-border rounded-xl flex items-center gap-4 group hover:border-slate-300 transition-colors"
            >
              <div className="w-9 h-9 bg-white rounded-lg shadow-subtle border border-border flex items-center justify-center text-text-muted group-hover:text-slate-900">
                {btn.type === 'URL' ? <ExternalLink size={16} /> : <Phone size={16} />}
              </div>
              
              <div className="flex-1 grid grid-cols-2 gap-4">
                <input 
                  type="text" 
                  value={btn.text}
                  onChange={(e) => updateButton(btn.id, { text: e.target.value })}
                  placeholder="Button label"
                  className="bg-transparent border-none p-0 text-xs font-bold text-slate-900 focus:ring-0 placeholder:text-text-muted"
                />
                <input 
                  type="text" 
                  value={btn.type === 'URL' ? btn.url : btn.phoneNumber}
                  onChange={(e) => updateButton(btn.id, btn.type === 'URL' ? { url: e.target.value } : { phoneNumber: e.target.value })}
                  placeholder={btn.type === 'URL' ? "Destination URL" : "Phone number"}
                  className="bg-transparent border-none p-0 text-xs font-medium text-text-secondary focus:ring-0 placeholder:text-text-muted"
                />
              </div>

              <button 
                onClick={() => removeButton(btn.id)}
                className="p-2 text-text-muted hover:text-danger transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={16} />
              </button>
            </motion.div>
          ))}
          
          {currentTemplate.buttons.length === 0 && (
            <div className="text-center py-6 border-2 border-dashed border-border-subtle rounded-xl">
               <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">No buttons configured</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
