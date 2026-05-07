import React from 'react';
import { Conversation } from '../../types';
import { User, CheckCheck, Clock } from 'lucide-react';
import MessageStatusIcon from './MessageStatusIcon';

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
}

const ConversationItem: React.FC<ConversationItemProps> = ({ conversation, isActive, onClick }) => {
  const lastMsg = conversation.lastMessage;
  const isIncoming = lastMsg.sender === 'contact';
  
  return (
    <div 
      onClick={onClick}
      className={`p-4 flex items-center gap-3 cursor-pointer transition-all relative ${
        isActive 
          ? 'bg-slate-50 border-r-2 border-slate-900' 
          : 'hover:bg-slate-50/50'
      }`}
    >
      <div className="relative shrink-0">
        <div className={`w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 overflow-hidden ${isActive ? 'border-slate-300' : ''}`}>
          {conversation.contact.avatar ? (
            <img src={conversation.contact.avatar} alt={conversation.contact.name} className="w-full h-full object-cover" />
          ) : (
            <User size={18} />
          )}
        </div>
        {conversation.isOnline && (
          <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <h4 className={`text-xs font-bold truncate ${isActive ? 'text-slate-900' : 'text-slate-900'}`}>
            {conversation.contact.name}
          </h4>
          <span className="text-[10px] font-medium text-slate-400">
            {new Date(lastMsg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 min-w-0">
            {!isIncoming && <MessageStatusIcon status={lastMsg.status} size={10} />}
            <p className="text-[11px] font-medium text-slate-500 truncate">
              {lastMsg.type === 'template' ? 'Template Message' : lastMsg.content}
            </p>
          </div>
          {conversation.unreadCount > 0 && (
            <span className="bg-slate-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
              {conversation.unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationItem;
