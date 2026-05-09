import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  MessageSquare, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  TrendingUp,
  ExternalLink,
  ChevronRight,
  Eye,
  Settings,
  Grid,
  List
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TemplateAnalytics from '../../components/whatsapp/dashboard/TemplateAnalytics';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { WhatsAppTemplate } from '../../types/whatsapp';

const mockTemplates: WhatsAppTemplate[] = [
  {
    id: 't1',
    name: 'summer_promo_flash_sale',
    category: 'MARKETING',
    status: 'APPROVED',
    language: 'en_US',
    updatedAt: '2024-05-20T10:00:00Z',
    header: { type: 'IMAGE' },
    body: { text: "Flash Sale! Get 20% off with code FLASH20", variables: [] },
    buttons: [{ id: 'b1', type: 'URL', text: 'Shop Now' }]
  },
  {
    id: 't2',
    name: 'order_update_shipped',
    category: 'UTILITY',
    status: 'PENDING',
    language: 'en_US',
    updatedAt: '2024-05-21T12:30:00Z',
    header: { type: 'TEXT', text: 'Order Shipped' },
    body: { text: "Your order {{1}} has been shipped!", variables: ['order_id'] },
    buttons: []
  },
  {
    id: 't3',
    name: 'service_alert_update',
    category: 'UTILITY',
    status: 'APPROVED',
    language: 'en_US',
    updatedAt: '2024-05-22T09:15:00Z',
    header: { type: 'NONE' },
    body: { text: "System maintenance is complete. Thank you for your patience.", variables: [] },
    buttons: [{ id: 'b2', type: 'URL', text: 'View Status', url: 'https://status.example.com' }]
  }
];

export default function TemplatesPage() {
  const navigate = useNavigate();
  const [view, setView] = useState<'grid' | 'list'>('list');
  const [activeTab, setActiveTab] = useState<'all' | 'analytics'>('all');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="shrink-0 bg-white border-b border-slate-200 px-10 py-10">
        <div className="max-w-[1600px] mx-auto flex items-end justify-between">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">WhatsApp Templates</h1>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.3em]">Marketing & Automation Control</p>
          </div>
          
          <div className="flex items-center gap-4">
             <button className="p-4 bg-slate-100 text-slate-400 hover:text-slate-900 rounded-3xl transition-all border border-transparent hover:border-slate-200"><Settings size={20} /></button>
             <button 
               onClick={() => navigate('/templates/builder')}
               className="bg-slate-900 hover:bg-slate-800 text-white px-10 py-5 rounded-3xl font-black uppercase tracking-widest text-xs transition-all flex items-center gap-4 shadow-2xl shadow-slate-900/20 active:scale-95 group"
             >
               <Plus size={20} strokeWidth={3} className="group-hover:rotate-90 transition-transform" />
               Create Template
             </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-[1600px] mx-auto mt-12 flex items-center gap-12">
           {[
             { id: 'all', label: 'All Templates' },
             { id: 'analytics', label: 'Performance Insight' },
             { id: 'categories', label: 'By Category' },
             { id: 'rules', label: 'Policy Center' },
           ].map(tab => (
             <button 
               key={tab.id}
               onClick={() => setActiveTab(tab.id as any)}
               className={cn(
                 "relative py-2 text-sm font-black uppercase tracking-widest transition-all",
                 activeTab === tab.id ? "text-slate-900" : "text-slate-400 hover:text-slate-600"
               )}
             >
               {tab.label}
               {activeTab === tab.id && (
                 <motion.div layoutId="activeTab" className="absolute -bottom-2 left-0 right-0 h-1 bg-slate-900 rounded-full" />
               )}
             </button>
           ))}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1600px] mx-auto w-full px-10 py-12">
        <AnimatePresence mode="wait">
          {activeTab === 'analytics' ? (
            <motion.div 
              key="analytics"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
               <TemplateAnalytics />
            </motion.div>
          ) : (
            <motion.div 
              key="list"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
               {/* Controls Bar */}
               <div className="flex items-center justify-between">
                  <div className="flex gap-4">
                     <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                          type="text" 
                          placeholder="Search templates..."
                          className="pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl w-80 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-100 transition-all" 
                        />
                     </div>
                     <button className="flex items-center gap-3 px-6 py-3.5 bg-white border border-slate-200 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all">
                        <Filter size={18} />
                        Filter
                     </button>
                  </div>

                  <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200">
                     <button 
                       onClick={() => setView('list')}
                       className={cn("p-2 rounded-xl transition-all", view === 'list' ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:text-slate-600")}
                     ><List size={18} /></button>
                     <button 
                       onClick={() => setView('grid')}
                       className={cn("p-2 rounded-xl transition-all", view === 'grid' ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:text-slate-600")}
                     ><Grid size={18} /></button>
                  </div>
               </div>

               {/* Table / List View */}
               <div className="bg-white rounded-[3rem] border border-slate-200 overflow-hidden shadow-xl shadow-slate-200/20">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Template Identity</th>
                        <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Category</th>
                        <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                        <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Open Rate</th>
                        <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Last Updated</th>
                        <th className="px-10 py-6 text-right"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockTemplates.map((template, i) => (
                        <tr key={template.id} className="hover:bg-slate-50 transition-colors group">
                          <td className="px-10 py-6">
                             <div className="flex items-center gap-4">
                                <div className={cn(
                                  "w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110",
                                  template.category === 'MARKETING' ? "bg-emerald-50 text-emerald-600" : 
                                  template.category === 'UTILITY' ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"
                                )}>
                                   <MessageSquare size={20} />
                                </div>
                                <div>
                                   <p className="text-sm font-black text-slate-900 font-mono tracking-tight">{template.name}</p>
                                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">EN • {template.header.type}</p>
                                </div>
                             </div>
                          </td>
                          <td className="px-6 py-6">
                             <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[9px] font-black uppercase tracking-widest">
                                {template.category}
                             </span>
                          </td>
                          <td className="px-6 py-6">
                             <div className="flex items-center gap-2">
                                {template.status === 'APPROVED' ? (
                                  <div className="flex items-center gap-1.5 text-emerald-600 font-black text-[10px] uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                                     <CheckCircle size={14} />
                                     Approved
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-1.5 text-amber-600 font-black text-[10px] uppercase tracking-wider bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
                                     <Clock size={14} />
                                     Pending
                                  </div>
                                )}
                             </div>
                          </td>
                          <td className="px-6 py-6">
                             <div className="flex items-center gap-6">
                                <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden w-24">
                                   <motion.div 
                                     initial={{ width: 0 }}
                                     animate={{ width: template.status === 'APPROVED' ? '82%' : '0%' }}
                                     transition={{ delay: 0.5 + i * 0.1, duration: 1 }}
                                     className="bg-slate-900 h-full rounded-full" 
                                   />
                                </div>
                                <span className="text-[11px] font-black text-slate-900">{template.status === 'APPROVED' ? '82%' : '--'}</span>
                             </div>
                          </td>
                          <td className="px-6 py-6">
                             <p className="text-xs font-bold text-slate-400">May 24, 2024</p>
                             <p className="text-[10px] font-bold text-slate-300">10:42 AM</p>
                          </td>
                          <td className="px-10 py-6 text-right">
                             <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-3 text-slate-400 hover:text-slate-900 border border-transparent hover:border-slate-200 hover:bg-white rounded-2xl transition-all shadow-sm"><Eye size={18} /></button>
                                <button className="p-3 text-slate-400 hover:text-slate-900 border border-transparent hover:border-slate-200 hover:bg-white rounded-2xl transition-all shadow-sm"><ExternalLink size={18} /></button>
                                <button className="p-3 text-slate-400 hover:text-slate-900 rounded-2xl transition-all"><MoreVertical size={18} /></button>
                             </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
