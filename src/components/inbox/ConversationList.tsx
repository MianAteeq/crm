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
    <div className="flex flex-col h-full bg-bg-surface border-r border-border">
      {/* Search & Filter Header */}
      <div className="p-6 space-y-4 border-b border-border bg-bg-surface/50 backdrop-blur-xl">
        <h2 className="text-xl font-black text-white uppercase tracking-tighter">Messages</h2>
        
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-brand transition-colors" size={14} />
          <input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search chats..."
            className="w-full bg-bg-surface3 border border-border rounded-xl p-3 pl-10 text-xs font-bold text-white focus:outline-none focus:border-brand/40 transition-all shadow-inner"
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
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all whitespace-nowrap ${
                filter === f.id 
                  ? 'bg-brand border-brand text-black shadow-lg shadow-brand/10' 
                  : 'bg-bg-surface3 border-border text-text-muted hover:text-white hover:border-brand/30'
              }`}
            >
              <f.icon size={12} /> {f.label}
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
