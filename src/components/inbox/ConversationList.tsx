import React from 'react';
import { Search, Filter, Mail, Star, Users, CheckCircle2 } from 'lucide-react';
import { Conversation } from '../../types';
import ConversationItem from './ConversationItem';

interface ConversationListProps {
  conversations: Conversation[];
  activeId?: string;
  onSelect: (id: string) => void;
}

export default function ConversationList({ conversations, activeId, onSelect }: ConversationListProps) {
  const [search, setSearch] = React.useState('');
  const [filter, setFilter] = React.useState<'all' | 'unread' | 'assigned'>('all');

  const filtered = conversations.filter(c => {
    const matchesSearch = c.contact.name.toLowerCase().includes(search.toLowerCase()) || 
                         c.contact.phone.includes(search);
    const matchesFilter = filter === 'all' || (filter === 'unread' && c.unreadCount > 0);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex flex-col h-full bg-white border-r border-slate-100">
      {/* Search & Filter Header */}
      <div className="p-4 space-y-4 border-b border-slate-100">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">Messages</h2>
        
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand transition-colors" size={14} />
          <input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search chats..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 pl-10 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-100 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {[
            { id: 'all', label: 'All', icon: Mail },
            { id: 'unread', label: 'Unread', icon: Star },
            { id: 'assigned', label: 'Assigned', icon: CheckCircle2 },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as any)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all whitespace-nowrap ${
                filter === f.id 
                  ? 'bg-slate-900 border-slate-900 text-white shadow-sm' 
                  : 'bg-white border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <f.icon size={11} /> {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {filtered.map(c => (
          <ConversationItem 
            key={c.id} 
            conversation={c} 
            isActive={activeId === c.id}
            onClick={() => onSelect(c.id)}
          />
        ))}

        {filtered.length === 0 && (
          <div className="p-10 text-center opacity-40">
            <Mail size={40} className="text-text-muted mx-auto mb-4" />
            <p className="text-[10px] font-black uppercase tracking-widest">No conversations found</p>
          </div>
        )}
      </div>
    </div>
  );
}
