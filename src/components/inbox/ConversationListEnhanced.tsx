import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, Pin, Archive, MoreVertical, Circle, Clock } from 'lucide-react';
import { Conversation } from '../../types';
import { cn } from '../../lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface ConversationListEnhancedProps {
  conversations: Conversation[];
  selectedId?: string;
  onSelect: (conversation: Conversation) => void;
  onPin?: (id: string) => void;
  onArchive?: (id: string) => void;
  isLoading?: boolean;
}

export function ConversationListEnhanced({
  conversations,
  selectedId,
  onSelect,
  onPin,
  onArchive,
  isLoading = false
}: ConversationListEnhancedProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'unread' | 'active'>('all');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conv.contact.phone.includes(searchQuery);

    if (filterStatus === 'unread') return matchesSearch && conv.unreadCount > 0;
    if (filterStatus === 'active') return matchesSearch && conv.isOnline;
    return matchesSearch;
  }).sort((a, b) => {
    // Sort pinned first
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;

    // Then by last message time
    return new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime();
  });

  if (isLoading) {
    return (
      <div className="flex flex-col h-full bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
        </div>
        <div className="flex-1 overflow-y-auto">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="p-4 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 animate-pulse" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2 animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Messages
          </h2>
          <button className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <Filter className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#22C55E]/30 focus:border-[#166534] focus:border-transparent"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2">
          {(['all', 'unread', 'active'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setFilterStatus(filter)}
              className={cn(
                'px-3 py-1.5 text-xs font-medium rounded-lg transition-colors',
                filterStatus === filter
                  ? 'bg-[#166534] text-white'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              )}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {filteredConversations.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-full p-8 text-center"
            >
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                No conversations found
              </p>
            </motion.div>
          ) : (
            filteredConversations.map((conv, index) => (
              <motion.div
                key={conv.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onSelect(conv)}
                className={cn(
                  'relative p-4 border-b border-slate-200 dark:border-slate-700 cursor-pointer transition-colors group',
                  selectedId === conv.id
                    ? 'bg-[#F0FDF4] dark:bg-[#F0FDF4] border-l-4 border-l-[#166534]'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-900 border-l-4 border-l-transparent'
                )}
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#12263A] to-[#166534] rounded-full flex items-center justify-center text-white font-semibold">
                      {conv.contact.name.charAt(0).toUpperCase()}
                    </div>
                    {conv.isOnline && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-800 rounded-full" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        {conv.isPinned && (
                          <Pin className="w-3.5 h-3.5 text-slate-400 fill-slate-400" />
                        )}
                        <h3 className="font-semibold text-slate-900 dark:text-white text-sm truncate">
                          {conv.contact.name}
                        </h3>
                      </div>
                      <span className="text-xs text-slate-500 dark:text-slate-400 flex-shrink-0 ml-2">
                        {formatDistanceToNow(new Date(conv.lastMessage.timestamp), { addSuffix: false })}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <p className={cn(
                        'text-sm truncate flex-1',
                        conv.unreadCount > 0
                          ? 'text-slate-900 dark:text-white font-medium'
                          : 'text-slate-500 dark:text-slate-400'
                      )}>
                        {conv.lastMessage.sender === 'user' && '✓ '}
                        {conv.lastMessage.content}
                      </p>
                      {conv.unreadCount > 0 && (
                        <span className="flex-shrink-0 w-5 h-5 bg-[#166534] text-white text-xs font-semibold rounded-full flex items-center justify-center">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>

                    {/* Assigned Agent */}
                    {conv.assignedAgent && (
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <Circle className="w-2 h-2 text-blue-500 fill-blue-500" />
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {conv.assignedAgent}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions Menu */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMenu(activeMenu === conv.id ? null : conv.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                  >
                    <MoreVertical className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {activeMenu === conv.id && (
                    <div className="absolute right-4 top-14 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-10 py-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onPin?.(conv.id);
                          setActiveMenu(null);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 flex items-center gap-2"
                      >
                        <Pin className="w-4 h-4" />
                        {conv.isPinned ? 'Unpin' : 'Pin'} Conversation
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onArchive?.(conv.id);
                          setActiveMenu(null);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 flex items-center gap-2"
                      >
                        <Archive className="w-4 h-4" />
                        Archive
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
