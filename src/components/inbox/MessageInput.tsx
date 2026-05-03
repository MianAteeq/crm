import React, { useState, useRef } from 'react';
import { Smile, Paperclip, Send, Layout, X, Image as ImageIcon, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { templates as mockTemplates } from '../../data/templates';
import EmojiPicker, { Theme } from 'emoji-picker-react';

interface MessageInputProps {
  onSend: (content: string, type: 'text' | 'template' | 'image' | 'file') => void;
  disabled?: boolean;
}

export default function MessageInput({ onSend, disabled }: MessageInputProps) {
  const [text, setText] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!text.trim() || disabled) return;
    onSend(text, 'text');
    setText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSendTemplate = (templateId: string) => {
    const template = mockTemplates.find(t => t.id === templateId);
    if (template) {
      onSend(template.body.text, 'template');
    }
    setShowTemplates(false);
  };

  const onEmojiClick = (emojiData: any) => {
    setText(prev => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const type = file.type.startsWith('image/') ? 'image' : 'file';
    onSend(file.name, type);
    
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="p-6 bg-bg-surface border-t border-border relative">
      <AnimatePresence>
        {showTemplates && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full left-6 right-6 mb-4 p-6 bg-bg-surface border border-border rounded-[2rem] shadow-2xl z-20"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[10px] font-black text-brand uppercase tracking-[0.2em]">WhatsApp Templates</h3>
              <button onClick={() => setShowTemplates(false)} className="text-text-muted hover:text-white">
                <X size={16} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
               {mockTemplates.filter(t => t.status === 'approved').map(t => (
                 <button
                   key={t.id}
                   onClick={() => handleSendTemplate(t.id)}
                   className="p-4 bg-bg-surface3 border border-border rounded-xl text-left hover:border-brand/40 transition-all group"
                 >
                   <p className="text-[9px] font-black text-brand uppercase tracking-widest mb-1">{t.category}</p>
                   <p className="text-[11px] font-bold text-white uppercase truncate">{t.displayName}</p>
                 </button>
               ))}
            </div>
          </motion.div>
        )}

        {showEmojiPicker && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute bottom-full left-6 mb-4 z-20"
          >
            <div className="relative shadow-2xl rounded-2xl overflow-hidden border border-border">
              <EmojiPicker 
                onEmojiClick={onEmojiClick}
                theme={Theme.DARK}
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
              setShowTemplates(false);
            }}
            className={`p-3 rounded-xl transition-all ${
              showEmojiPicker ? 'bg-brand text-black' : 'text-text-muted hover:text-white hover:bg-bg-surface3'
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
             className="p-3 text-text-muted hover:text-white hover:bg-bg-surface3 rounded-xl transition-all"
             title="Attach File"
          >
            <Paperclip size={20} />
          </button>
          <button 
             type="button" 
             onClick={() => {
               setShowTemplates(!showTemplates);
               setShowEmojiPicker(false);
             }}
             className={`p-3 rounded-xl transition-all ${
               showTemplates ? 'bg-brand text-black' : 'text-text-muted hover:text-white hover:bg-bg-surface3'
             }`}
             title="Use Template"
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
            className="w-full bg-bg-surface3 border border-border rounded-2xl p-4 text-sm font-medium text-white focus:outline-none focus:border-brand/40 transition-all resize-none max-h-40 overflow-y-auto"
            style={{ minHeight: '52px' }}
          />
        </div>

        <button 
          type="submit"
          disabled={!text.trim() || disabled}
          className="p-4 bg-brand text-black rounded-2xl hover:brightness-110 disabled:opacity-50 disabled:grayscale transition-all shadow-lg shadow-brand/20 mb-1"
        >
          <Send size={20} strokeWidth={3} />
        </button>
      </form>
      
      <div className="mt-4 flex items-center justify-between text-[8px] font-black text-text-muted uppercase tracking-widest px-1">
         <span>Shift + Enter for new line</span>
         <span className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> WhatsApp Connected
         </span>
      </div>
    </div>
  );
}
