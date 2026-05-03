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
      className={`p-5 flex items-center gap-4 cursor-pointer transition-all relative border-l-4 ${
        isActive 
          ? 'bg-brand/5 border-brand' 
          : 'border-transparent hover:bg-bg-surface2/50'
      }`}
    >
      <div className="relative shrink-0">
        <div className={`w-12 h-12 rounded-2xl bg-bg-surface3 border border-border flex items-center justify-center text-text-muted overflow-hidden ${isActive ? 'border-brand/30' : ''}`}>
          {conversation.contact.avatar ? (
            <img src={conversation.contact.avatar} alt={conversation.contact.name} className="w-full h-full object-cover" />
          ) : (
            <User size={24} />
          )}
        </div>
        {conversation.isOnline && (
          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-bg-surface" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <h4 className={`text-[11px] font-black uppercase tracking-tight truncate ${isActive ? 'text-brand' : 'text-white'}`}>
            {conversation.contact.name}
          </h4>
          <span className="text-[9px] font-black uppercase tracking-widest text-text-muted">
            {new Date(lastMsg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 min-w-0">
            {!isIncoming && <MessageStatusIcon status={lastMsg.status} size={10} />}
            <p className="text-[10px] font-medium text-text-muted truncate">
              {lastMsg.type === 'template' ? 'Template Message' : lastMsg.content}
            </p>
          </div>
          {conversation.unreadCount > 0 && (
            <span className="bg-brand text-black text-[8px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
              {conversation.unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationItem;
