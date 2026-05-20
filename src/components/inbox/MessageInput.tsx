import React, { useState, useRef, useEffect } from 'react';
import { Smile, Paperclip, Send, X, Image as ImageIcon, FileText, Layout, Search, Loader2, ChevronRight, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import EmojiPicker, { Theme } from 'emoji-picker-react';
import { WhatsAppTemplate } from '../../types/whatsapp';
import { whatsappApi } from '../../services/whatsappApi';
import SendTemplateModal from '../whatsapp/modals/SendTemplateModal';
import { cn } from '../../lib/utils';

interface MessageInputProps {
  onSend: (content: string, type: 'text' | 'image' | 'file', file?: File) => void;
  disabled?: boolean;
  recipientPhone?: string;
  recipientName?: string;
}

export default function MessageInput({ onSend, disabled, recipientPhone, recipientName }: MessageInputProps) {
  const [text, setText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>([]);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);
  const [templateSearch, setTemplateSearch] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<WhatsAppTemplate | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (disabled) return;

    if (selectedFile) {
      const type = selectedFile.type.startsWith('image/') ? 'image' : 'file';
      onSend(text || selectedFile.name, type, selectedFile);
      setSelectedFile(null);
      setText('');
      return;
    }

    if (!text.trim()) return;
    onSend(text, 'text');
    setText('');
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
  };

  return (
    <div className="p-6 bg-white border-t border-slate-200 relative">
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
            className="absolute bottom-full left-6 mb-4 w-80 bg-white border border-slate-200 rounded-[2rem] shadow-2xl z-20 flex flex-col max-h-[450px] overflow-hidden"
          >
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Layout size={16} className="text-blue-500" />
                <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Select Template</span>
              </div>
              <button 
                onClick={() => setShowTemplatePicker(false)}
                className="text-slate-400 hover:text-slate-900"
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="p-3 border-b border-slate-100">
               <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
                  <input 
                    type="text"
                    value={templateSearch}
                    onChange={(e) => setTemplateSearch(e.target.value)}
                    placeholder="Search templates..."
                    className="w-full h-10 pl-9 pr-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-100 transition-all"
                  />
               </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 custom-scrollbar space-y-1">
              {isLoadingTemplates ? (
                <div className="flex flex-col items-center justify-center p-12 gap-3">
                  <Loader2 size={24} className="text-slate-200 animate-spin" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Loading...</span>
                </div>
              ) : templates.length === 0 ? (
                <div className="p-8 text-center" id="no-templates-found">
                  <p className="text-xs font-bold text-slate-400">No templates found</p>
                </div>
              ) : (
                templates
                  .filter(t => t.name.toLowerCase().includes(templateSearch.toLowerCase()))
                  .map(t => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTemplate(t)}
                      className="w-full p-3 flex items-center justify-between group hover:bg-slate-50 rounded-2xl transition-all border border-transparent hover:border-slate-100"
                    >
                      <div className="flex items-center gap-3 overflow-hidden text-left">
                        <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 shrink-0">
                          <MessageSquare size={16} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[11px] font-black text-slate-900 truncate">{t.name}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-0.5">{t.category}</p>
                        </div>
                      </div>
                      <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-900 transition-all group-hover:translate-x-0.5" />
                    </button>
                  ))
              )}
            </div>
          </motion.div>
        )}

        {selectedFile && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full left-6 right-6 mb-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl shadow-xl z-20 flex items-center gap-4"
          >
            <div className="w-16 h-16 rounded-xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0">
              {selectedFile.type.startsWith('image/') ? (
                <img src={URL.createObjectURL(selectedFile)} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <FileText className="text-slate-400" size={24} />
              )}
            </div>
            <div className="flex-1 min-w-0">
               <p className="text-[11px] font-bold text-slate-900 truncate">{selectedFile.name}</p>
               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                 {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • {selectedFile.type || 'Unknown Type'}
               </p>
            </div>
            <button 
              type="button"
              onClick={removeSelectedFile}
              className="p-2 text-slate-400 hover:text-red-500 transition-colors"
            >
              <X size={20} />
            </button>
          </motion.div>
        )}
        {showEmojiPicker && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute bottom-full left-6 mb-4 z-20"
          >
            <div className="relative shadow-2xl rounded-2xl overflow-hidden border border-slate-200">
              <EmojiPicker 
                onEmojiClick={onEmojiClick}
                theme={Theme.LIGHT}
                width={300}
                height={400}
                lazyLoadEmojis={true}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="flex items-end gap-3">
        <div className="flex gap-1 mb-1">
          <button 
            type="button" 
            onClick={() => {
              setShowEmojiPicker(!showEmojiPicker);
            }}
            className={`p-3 rounded-xl transition-all ${
              showEmojiPicker ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'
            }`}
            title="Add Emoji"
          >
            <Smile size={20} />
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
          />
          <button 
             type="button" 
             onClick={() => fileInputRef.current?.click()}
             className="p-3 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all"
             title="Attach File"
          >
            <Paperclip size={20} />
          </button>
          <button 
             type="button" 
             onClick={() => setShowTemplatePicker(!showTemplatePicker)}
             className={cn(
               "p-3 rounded-xl transition-all",
               showTemplatePicker ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:text-slate-900 hover:bg-slate-50"
             )}
             title="Send Template"
          >
            <Layout size={20} />
          </button>
        </div>

        <div className="flex-1 relative">
          <textarea 
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 transition-all resize-none max-h-40 overflow-y-auto shadow-inner"
            style={{ minHeight: '52px' }}
          />
        </div>

        <button 
          type="submit"
          disabled={(!text.trim() && !selectedFile) || disabled}
          className="p-4 bg-slate-900 text-white rounded-xl hover:bg-slate-800 disabled:opacity-50 disabled:grayscale transition-all shadow-lg shadow-slate-900/10 mb-1"
        >
          <Send size={20} strokeWidth={2.5} />
        </button>
      </form>
      
      <div className="mt-4 flex items-center justify-between text-[8px] font-bold text-slate-400 uppercase tracking-widest px-1">
         <span>Shift + Enter for new line</span>
         <span className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> WhatsApp Status: Connected
         </span>
      </div>
    </div>
  );
}
