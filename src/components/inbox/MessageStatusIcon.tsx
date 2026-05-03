import React from 'react';
import { Check, CheckCheck, Clock, AlertCircle } from 'lucide-react';
import { Message } from '../../types';

interface MessageStatusIconProps {
  status: Message['status'];
  size?: number;
}

export default function MessageStatusIcon({ status, size = 14 }: MessageStatusIconProps) {
  switch (status) {
    case 'sending':
      return <Clock size={size} className="text-text-muted opacity-50" />;
    case 'sent':
      return <Check size={size} className="text-text-muted" />;
    case 'delivered':
      return <CheckCheck size={size} className="text-text-muted" />;
    case 'read':
      return <CheckCheck size={size} className="text-blue-500" />;
    case 'failed':
      return <AlertCircle size={size} className="text-rose-500" />;
    default:
      return null;
  }
}
