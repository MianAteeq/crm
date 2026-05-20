import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Phone, MapPin, Tag, Plus, Edit2, 
  ExternalLink, History 
} from 'lucide-react';
import { Conversation } from '../../types';

interface ContactSidebarProps {
  conversation: Conversation;
}

export default function ContactSidebar({ conversation }: ContactSidebarProps) {
  const { contact } = conversation;
  const navigate = useNavigate();
  
  return (
    <div className="w-[340px] flex flex-col h-full bg-white border-l border-slate-200 overflow-y-auto custom-scrollbar shadow-sm">
      {/* Contact Profile */}
      <div className="p-8 text-center border-b border-slate-50">
         <div 
           onClick={() => navigate(`/contacts/edit/${contact.id}`)}
           className="w-24 h-24 rounded-3xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 mx-auto mb-6 relative group overflow-hidden shadow-inner cursor-pointer"
         >
            {contact.avatar ? (
              <img src={contact.avatar} alt={contact.name} className="w-full h-full object-cover" />
            ) : (
              <User size={48} />
            )}
            <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
               <Edit2 size={24} className="text-white" />
            </div>
         </div>
         <h3 className="text-xl font-bold text-slate-900 tracking-tight">{contact.name}</h3>
         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{contact.phone}</p>
         
         <div className="flex items-center justify-center gap-2 mt-6">
            <button 
              onClick={() => navigate(`/contacts/edit/${contact.id}`)}
              className="flex-1 px-4 py-3 bg-slate-900 text-white rounded-xl text-[9px] font-bold uppercase tracking-widest shadow-lg shadow-slate-900/10 hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
            >
               <Edit2 size={12} /> Edit Profile
            </button>
            <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-all">
               <ExternalLink size={14} />
            </button>
         </div>
      </div>

      {/* Tags */}
      <div className="p-8 border-b border-slate-50 space-y-4">
         <div className="flex items-center justify-between">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
               <Tag size={12} className="text-slate-900" /> Lead Tags
            </h4>
            <button className="text-slate-900 hover:scale-110 transition-all">
               <Plus size={14} strokeWidth={3} />
            </button>
         </div>
         <div className="flex flex-wrap gap-2">
            {(contact.tags || []).map(tag => (
              <span key={tag} className="px-3 py-1.5 bg-slate-100 border border-slate-100 text-slate-600 text-[9px] font-bold uppercase tracking-widest rounded-lg">
                {tag}
              </span>
            ))}
         </div>
      </div>

      {/* Details */}
      <div className="p-8 border-b border-slate-50 space-y-6">
         <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contact Information</h4>
         
         <div className="space-y-5">
            <div className="flex items-start gap-4">
               <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 shrink-0 border border-slate-100">
                  <Phone size={14} />
               </div>
               <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Phone</p>
                  <p className="text-sm font-bold text-slate-900 leading-none">{contact.phone}</p>
               </div>
            </div>
            <div className="flex items-start gap-4">
               <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 shrink-0 border border-slate-100">
                  <MapPin size={14} />
               </div>
               <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Timezone</p>
                  <p className="text-sm font-bold text-slate-900 leading-none">Pakistan (GMT+5)</p>
               </div>
            </div>
             <div className="flex items-start gap-4">
               <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 shrink-0 border border-slate-100">
                  <History size={14} />
               </div>
               <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">First Seen</p>
                  <p className="text-sm font-bold text-slate-900 leading-none">
                    {contact.created_at ? new Date(contact.created_at).toLocaleDateString() : 'N/A'}
                  </p>
               </div>
            </div>
         </div>
      </div>

     </div>
  );
}
