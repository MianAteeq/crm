import React, { useState, useRef } from 'react';
import { Smile, Paperclip, Send, X, Image as ImageIcon, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import EmojiPicker, { Theme } from 'emoji-picker-react';

interface MessageInputProps {
  onSend: (content: string, type: 'text' | 'image' | 'file', file?: File) => void;
  disabled?: boolean;
}

export default function MessageInput({ onSend, disabled }: MessageInputProps) {
  const [text, setText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
