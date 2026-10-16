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
      gradient: 'from-[#12263A] to-[#166534]',
      lightBg: 'bg-[#F0FDF4]',
      border: 'border-[#25D366]/20',
      iconColor: 'text-[#166534]'
    },
    {
      id: 'sent',
      label: 'Messages Sent Today',
      value: stats?.messagesSentToday || 0,
      trend: stats?.messagesTrend,
      icon: Send,
      gradient: 'from-[#25D366] to-[#166534]',
      lightBg: 'bg-[#F0FDF4]',
      border: 'border-[#25D366]/20',
      iconColor: 'text-[#25D366]'
    },
    {
      id: 'received',
      label: 'Messages Received Today',
      value: stats?.messagesReceivedToday || 0,
      icon: Inbox,
      gradient: 'from-blue-600 to-indigo-600',
      lightBg: 'bg-[#EFF6FF]',
      border: 'border-[#BFDBFE]',
      iconColor: 'text-[#1D4ED8]'
    },
    {
      id: 'active',
      label: 'Active Chats',
      value: stats?.activeChats || 0,
      icon: Activity,
      gradient: 'from-amber-500 to-amber-600',
      lightBg: 'bg-amber-50',
      border: 'border-amber-200',
      iconColor: 'text-amber-600'
    }
  ];

  const getTrendIcon = (trend?: 'up' | 'down' | 'neutral') => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-[#25D366]" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-[#64748B]" />;
  };

  const getTrendColor = (trend?: 'up' | 'down' | 'neutral') => {
    if (trend === 'up') return 'text-[#166534]';
    if (trend === 'down') return 'text-red-600';
    return 'text-[#64748B]';
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] p-6 animate-pulse"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-slate-100 rounded-xl" />
              <div className="w-16 h-6 bg-slate-100 rounded" />
            </div>
            <div className="w-24 h-8 bg-slate-100 rounded mb-2" />
            <div className="w-32 h-4 bg-slate-100 rounded" />
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
            transition={{ delay: index * 0.08 }}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105 border shadow-xs',
                  widget.lightBg,
                  widget.border
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
                  className="text-3xl font-bold text-[#12263A] font-mono tracking-tight"
                >
                  {widget.value.toLocaleString()}
                </motion.div>
              </div>

              {/* Label */}
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-[#64748B]">
                  {widget.label}
                </p>
                {widget.trend && (
                  <span className={cn('text-xs font-bold', getTrendColor(widget.trend))}>
                    {widget.trend === 'up' ? '+5.2%' : widget.trend === 'down' ? '-2.1%' : '0%'}
                  </span>
                )}
              </div>

              {/* Progress Bar (for conversations only) */}
              {widget.id === 'conversations' && stats && (
                <div className="mt-4 pt-4 border-t border-[#E2E8F0]">
                  <div className="flex items-center justify-between text-xs text-[#64748B] mb-2 font-medium">
                    <span>Capacity</span>
                    <span className="font-semibold text-[#12263A]">{capacityPct}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${capacityPct}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="h-full rounded-full bg-[#25D366]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Hover Bottom Accent */}
            <div className="h-0.5 bg-[#25D366] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.div>
        );
      })}
    </div>
  );
}
