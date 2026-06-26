import { motion } from 'motion/react';
import { MessageSquare, Send, Inbox, Activity, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { WhatsAppDashboardStats } from '../../../types';
import { cn } from '../../../lib/utils';

interface WhatsAppDashboardWidgetsProps {
  stats: WhatsAppDashboardStats | null;
  isLoading?: boolean;
}

export function WhatsAppDashboardWidgets({ stats, isLoading = false }: WhatsAppDashboardWidgetsProps) {
  const getLimitValue = (tier?: string) => {
    if (!tier) return 250;
    const cleanTier = tier.toUpperCase();
    if (cleanTier.includes('UNLIMITED')) return 100000;
    if (cleanTier.includes('100K')) return 100000;
    if (cleanTier.includes('10K')) return 10000;
    if (cleanTier.includes('2K') || cleanTier.includes('2000')) return 2000;
    if (cleanTier.includes('1K') || cleanTier.includes('1000')) return 1000;
    return 250;
  };

  const limitValue = getLimitValue(stats?.messagingLimitTier);
  const capacityPct = stats ? Math.min(Math.round((stats.totalConversations / limitValue) * 100), 100) : 0;

  const widgets = [
    {
      id: 'conversations',
      label: 'Total Conversations',
      value: stats?.totalConversations || 0,
      trend: stats?.conversationsTrend,
      icon: MessageSquare,
      gradient: 'from-blue-500 to-blue-600',
      lightBg: 'bg-blue-50 dark:bg-blue-900/20',
      darkBorder: 'border-blue-200 dark:border-blue-800',
      iconColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      id: 'sent',
      label: 'Messages Sent Today',
      value: stats?.messagesSentToday || 0,
      trend: stats?.messagesTrend,
      icon: Send,
      gradient: 'from-emerald-500 to-emerald-600',
      lightBg: 'bg-emerald-50 dark:bg-emerald-900/20',
      darkBorder: 'border-emerald-200 dark:border-emerald-800',
      iconColor: 'text-emerald-600 dark:text-emerald-400'
    },
    {
      id: 'received',
      label: 'Messages Received Today',
      value: stats?.messagesReceivedToday || 0,
      icon: Inbox,
      gradient: 'from-purple-500 to-purple-600',
      lightBg: 'bg-purple-50 dark:bg-purple-900/20',
      darkBorder: 'border-purple-200 dark:border-purple-800',
      iconColor: 'text-purple-600 dark:text-purple-400'
    },
    {
      id: 'active',
      label: 'Active Chats',
      value: stats?.activeChats || 0,
      icon: Activity,
      gradient: 'from-amber-500 to-amber-600',
      lightBg: 'bg-amber-50 dark:bg-amber-900/20',
      darkBorder: 'border-amber-200 dark:border-amber-800',
      iconColor: 'text-amber-600 dark:text-amber-400'
    }
  ];

  const getTrendIcon = (trend?: 'up' | 'down' | 'neutral') => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-emerald-500" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-slate-400" />;
  };

  const getTrendColor = (trend?: 'up' | 'down' | 'neutral') => {
    if (trend === 'up') return 'text-emerald-600 dark:text-emerald-400';
    if (trend === 'down') return 'text-red-600 dark:text-red-400';
    return 'text-slate-500 dark:text-slate-400';
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 animate-pulse"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-xl" />
              <div className="w-16 h-6 bg-slate-200 dark:bg-slate-700 rounded" />
            </div>
            <div className="w-24 h-8 bg-slate-200 dark:bg-slate-700 rounded mb-2" />
            <div className="w-32 h-4 bg-slate-200 dark:bg-slate-700 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      {widgets.map((widget, index) => {
        const Icon = widget.icon;
        return (
          <motion.div
            key={widget.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110',
                  widget.lightBg,
                  'border',
                  widget.darkBorder
                )}>
                  <Icon className={cn('w-6 h-6', widget.iconColor)} />
                </div>
                {widget.trend && (
                  <div className="flex items-center gap-1">
                    {getTrendIcon(widget.trend)}
                  </div>
                )}
              </div>

              {/* Value */}
              <div className="mb-2">
                <motion.div
                  key={widget.value}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-3xl font-bold text-slate-900 dark:text-white font-mono"
                >
                  {widget.value.toLocaleString()}
                </motion.div>
              </div>

              {/* Label */}
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  {widget.label}
                </p>
                {widget.trend && (
                  <span className={cn('text-xs font-medium', getTrendColor(widget.trend))}>
                    {widget.trend === 'up' ? '+5.2%' : widget.trend === 'down' ? '-2.1%' : '0%'}
                  </span>
                )}
              </div>

              {/* Progress Bar (for conversations only) */}
              {widget.id === 'conversations' && stats && (
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
                    <span>Capacity</span>
                    <span>{capacityPct}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${capacityPct}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className={cn('h-full rounded-full bg-gradient-to-r', widget.gradient)}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Hover Effect Border */}
            <div className={cn(
              'h-1 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300',
              widget.gradient
            )} />
          </motion.div>
        );
      })}
    </div>
  );
}
