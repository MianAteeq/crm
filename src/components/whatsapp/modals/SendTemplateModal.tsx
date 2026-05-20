import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Send, 
  User, 
  Phone, 
  AlertCircle, 
  Loader2, 
  CheckCircle,
  ChevronRight,
  Info,
  Search,
  MessageSquare,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../../lib/utils';
import { WhatsAppTemplate } from '../../../types/whatsapp';
import { Contact } from '../../../types';
import { whatsappApi } from '../../../services/whatsappApi';
import { crmApi } from '../../../services/crmApi';
import WhatsAppPreview from '../preview/WhatsAppPreview';

interface SendTemplateModalProps {
  template: WhatsAppTemplate;
  onClose: () => void;
  onSuccess?: () => void;
  initialPhone?: string;
  recipientName?: string;
}

export default function SendTemplateModal({ template, onClose, onSuccess, initialPhone, recipientName: initialRecipientName }: SendTemplateModalProps) {
  const [phone, setPhone] = useState(initialPhone || '');
  const [recipientName, setRecipientName] = useState(initialRecipientName || '');
  const [headerVariables, setHeaderVariables] = useState<string[]>([]);
  const [bodyVariables, setBodyVariables] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Contact Picker State
  const [showContactPicker, setShowContactPicker] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoadingContacts, setIsLoadingContacts] = useState(false);
  const [contactSearch, setContactSearch] = useState('');
  const contactPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize variables based on template
    if (template.header.variables) {
      setHeaderVariables(new Array(template.header.variables.length).fill(''));
    }
    if (template.body.variables) {
      setBodyVariables(new Array(template.body.variables.length).fill(''));
    }
  }, [template]);

  useEffect(() => {
    if (showContactPicker && contacts.length === 0) {
      fetchContacts();
    }
  }, [showContactPicker]);

  const fetchContacts = async (search: string = '') => {
    setIsLoadingContacts(true);
    try {
      const data = await crmApi.getContacts({ search });
      setContacts(data);
    } catch (err) {
      console.error('Failed to fetch contacts:', err);
    } finally {
      setIsLoadingContacts(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (showContactPicker) {
        fetchContacts(contactSearch);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [contactSearch]);

  const handleSend = async () => {
    if (!phone) {
      setError('Phone number is required');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const components: any[] = [];
      const parameters: string[] = [...headerVariables, ...bodyVariables];

      if (headerVariables.length > 0) {
        components.push({
          type: 'header',
          parameters: headerVariables.map(v => ({ type: 'text', text: v }))
        });
      }

      if (bodyVariables.length > 0) {
        components.push({
          type: 'body',
          parameters: bodyVariables.map(v => ({ type: 'text', text: v }))
        });
      }

      await whatsappApi.sendTemplate(template.id, phone, components, parameters);
      setSuccess(true);
      if (onSuccess) onSuccess();
      setTimeout(onClose, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to send template');
    } finally {
      setIsLoading(false);
    }
  };

  const selectContact = (contact: Contact) => {
    setPhone(contact.phone);
    setRecipientName(contact.name);
    setShowContactPicker(false);
  };

  // Create a preview version of the template with filled variables
  const previewTemplate: WhatsAppTemplate = {
    ...template,
    header: {
      ...template.header,
      text: template.header.text ? replaceVariables(template.header.text, headerVariables) : template.header.text
    },
    body: {
      ...template.body,
      text: replaceVariables(template.body.text, bodyVariables)
    }
  };

  function replaceVariables(text: string, values: string[]) {
    let result = text;
    values.forEach((val, idx) => {
      const placeholder = `{{${idx + 1}}}`;
      result = result.replace(placeholder, val || placeholder);
    });
    return result;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-[40px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] w-full max-w-5xl h-full max-h-[800px] overflow-hidden flex flex-col lg:flex-row relative border border-slate-100"
      >
        {/* Left Side: Configuration */}
        <div className="flex flex-col w-full lg:w-[450px] border-r border-slate-100 bg-white p-10 shrink-0">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
               <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                  <Send size={20} />
               </div>
               <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none">Send Template</h3>
                  <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Manual Trigger</p>
               </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-8 pr-2 custom-scrollbar">
            {/* Recipient */}
            {!initialPhone && (
              <div className="space-y-4 relative">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Phone size={14} className="text-slate-900" />
                    Recipient Phone
                  </label>
                  <button 
                    onClick={() => setShowContactPicker(!showContactPicker)}
                    className={cn(
                      "text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all",
                      showContactPicker ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                    )}
                  >
                    <Users size={12} />
                    Select Contact
                  </button>
                </div>
                
                <div className="relative">
                  <input 
                    type="text"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (recipientName) setRecipientName('');
                    }}
                    placeholder="+92 300 1234567"
                    className="w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-100 transition-all placeholder:text-slate-300"
                  />
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                </div>

                {recipientName && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-xl">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <p className="text-[10px] font-black text-emerald-900 uppercase tracking-widest">Selected: {recipientName}</p>
                    <button 
                      onClick={() => {
                        setPhone('');
                        setRecipientName('');
                      }}
                      className="ml-auto text-emerald-600 hover:text-emerald-900"
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}

                {/* Contact Picker Dropdown */}
                <AnimatePresence>
                  {showContactPicker && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-[2rem] shadow-2xl z-50 overflow-hidden flex flex-col max-h-[300px]"
                    >
                      <div className="p-3 border-b border-slate-100 bg-slate-50/50">
                        <div className="relative">
                          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
                          <input 
                            type="text"
                            value={contactSearch}
                            onChange={(e) => setContactSearch(e.target.value)}
                            placeholder="Search contacts..."
                            className="w-full h-10 pl-9 pr-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                            autoFocus
                          />
                        </div>
                      </div>
                      <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
                        {isLoadingContacts ? (
                          <div className="flex flex-col items-center justify-center p-8 gap-2">
                            <Loader2 size={20} className="animate-spin text-slate-200" />
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Searching...</span>
                          </div>
                        ) : contacts.length === 0 ? (
                          <div className="p-8 text-center">
                            <p className="text-xs font-bold text-slate-400 font-mono">No contacts found</p>
                          </div>
                        ) : (
                          contacts.map((contact) => (
                            <button
                              key={contact.id}
                              onClick={() => selectContact(contact)}
                              className="w-full p-3 flex items-center gap-3 hover:bg-slate-50 rounded-2xl transition-all group text-left"
                            >
                              <div className="w-9 h-9 bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-slate-900 group-hover:border-slate-300 transition-all">
                                <User size={16} />
                              </div>
                              <div className="min-w-0">
                                <p className="text-[11px] font-black text-slate-900 truncate">{contact.name}</p>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{contact.phone}</p>
                              </div>
                              <ChevronRight size={14} className="ml-auto text-slate-200 group-hover:text-slate-900 transition-all" />
                            </button>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {initialPhone && (
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Sending To</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400">
                    <User size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{recipientName || 'Contact'}</p>
                    <p className="text-xs font-medium text-slate-500">{initialPhone}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Template Variables */}
            {(headerVariables.length > 0 || bodyVariables.length > 0) && (
              <div className="space-y-6 pt-6 border-t border-slate-100">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Info size={14} className="text-slate-900" />
                  Fill Variables
                </label>

                {/* Header Variables */}
                {headerVariables.length > 0 && (
                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] opacity-50">Header Variables</p>
                    {headerVariables.map((val, idx) => (
                      <div key={`h-var-${idx}`} className="group">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[10px] font-black bg-slate-900 text-white px-2 py-0.5 rounded-md">{'{{'}{idx + 1}{'}}'}</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase">{template.header.variables?.[idx] || 'Param'}</span>
                        </div>
                        <input 
                          type="text"
                          value={val}
                          onChange={(e) => {
                            const newVars = [...headerVariables];
                            newVars[idx] = e.target.value;
                            setHeaderVariables(newVars);
                          }}
                          placeholder={`Enter value for ${template.header.variables?.[idx] || 'header'}`}
                          className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100 transition-all shadow-sm"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Body Variables */}
                {bodyVariables.length > 0 && (
                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] opacity-50">Body Variables</p>
                    {bodyVariables.map((val, idx) => (
                      <div key={`b-var-${idx}`} className="group">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[10px] font-black bg-slate-900 text-white px-2 py-0.5 rounded-md">{'{{'}{idx + 1}{'}}'}</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase">{template.body.variables[idx] || 'Param'}</span>
                        </div>
                        <input 
                          type="text"
                          value={val}
                          onChange={(e) => {
                            const newVars = [...bodyVariables];
                            newVars[idx] = e.target.value;
                            setBodyVariables(newVars);
                          }}
                          placeholder={`Enter value for ${template.body.variables[idx] || 'body'}`}
                          className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100 transition-all shadow-sm"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {error && (
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3">
                <AlertCircle size={18} className="text-rose-500 shrink-0 mt-0.5" />
                <p className="text-xs font-bold text-rose-900 leading-tight">{error}</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="mt-auto pt-10 flex gap-3 shrink-0">
            <button 
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 py-4 bg-slate-100 text-slate-400 hover:text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95"
            >
              Cancel
            </button>
            <button 
              onClick={handleSend}
              disabled={isLoading || success}
              className={cn(
                "flex-[2] flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95",
                success 
                  ? "bg-emerald-500 text-white" 
                  : "bg-slate-900 text-white shadow-xl shadow-slate-900/10 hover:bg-slate-800"
              )}
            >
              {isLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : success ? (
                <>
                  <CheckCircle size={16} />
                  Sent!
                </>
              ) : (
                <>
                  <Send size={16} />
                  Send Now
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Side: Preview */}
        <div className="flex-1 flex flex-col h-full bg-[#f8fafc] overflow-hidden relative">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
          
          <div className="px-8 py-6 flex items-center justify-between shrink-0 z-20">
            <div className="flex items-center gap-4">
               <div className="px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm">
                  <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest leading-none">Live Preview</span>
               </div>
            </div>
            <button 
              onClick={onClose}
              className="w-12 h-12 flex items-center justify-center bg-white shadow-sm border border-slate-200 text-slate-400 hover:text-slate-900 rounded-2xl transition-all active:scale-90"
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="flex-1 flex items-center justify-center overflow-y-auto p-8 relative z-10">
            <div className="scale-[0.8] lg:scale-[0.9] xl:scale-100 transition-all duration-300">
               <WhatsAppPreview template={previewTemplate} />
            </div>
          </div>

          <div className="p-6 shrink-0 lg:hidden bg-white border-t border-slate-100">
             <button 
               onClick={handleSend}
               disabled={isLoading || success}
               className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95"
             >
               {isLoading ? 'Sending...' : success ? 'Sent!' : 'Send Now'}
             </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
