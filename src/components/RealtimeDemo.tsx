import React, { useState } from 'react';
import { useRealtime } from '../hooks/useRealtime';
import { Wifi, WifiOff, MessageCircle, Send } from 'lucide-react';

export default function RealtimeDemo() {
  const [messages, setMessages] = useState<any[]>([]);
  const [channelId, setChannelId] = useState('1');

  // Using the new realtime hook
  const { isConnected, error } = useRealtime({
    channel: `chat.${channelId}`,
    event: 'MessageSent',
    isPrivate: true, // Requires valid auth token
    onEvent: (data) => {
      setMessages((prev) => [...prev, {
        id: data.id || Date.now(),
        text: data.message,
        sender: data.sender_id === 10 ? 'You' : 'Contact',
        time: data.created_at || new Date().toLocaleTimeString()
      }]);
    }
  });

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Realtime Messaging</h2>
          <p className="text-sm text-slate-500">Connected to Reverb</p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
          isConnected ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
        }`}>
          {isConnected ? (
            <><Wifi size={14} /> Connected</>
          ) : (
            <><WifiOff size={14} /> Disconnected</>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-rose-50 border border-rose-100 text-rose-600 text-xs rounded-lg">
          Error: {error}
        </div>
      )}

      <div className="mb-4">
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          Channel Selection
        </label>
        <div className="flex gap-2">
          {['1', '2', '3'].map((id) => (
            <button
              key={id}
              onClick={() => setChannelId(id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                channelId === id 
                  ? 'bg-slate-900 text-white' 
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              Chat {id}
            </button>
          ))}
        </div>
      </div>

      <div className="h-64 mb-4 bg-slate-50 rounded-2xl border border-slate-100 overflow-y-auto p-4 flex flex-col gap-3">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2">
            <MessageCircle size={32} strokeWidth={1.5} />
            <p className="text-sm">Waiting for realtime events on channel `chat.{channelId}`...</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div 
              key={msg.id}
              className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                msg.sender === 'You' 
                  ? 'self-end bg-slate-900 text-white rounded-tr-none' 
                  : 'self-start bg-white text-slate-700 border border-slate-200 rounded-tl-none shadow-sm'
              }`}
            >
              <div className="font-bold text-[10px] uppercase opacity-50 mb-1">{msg.sender}</div>
              {msg.text}
              <div className="text-[9px] mt-1 opacity-50 text-right">{msg.time}</div>
            </div>
          ))
        )}
      </div>

      <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl">
        <h3 className="text-xs font-bold text-blue-700 mb-1">How to test:</h3>
        <p className="text-[11px] text-blue-600 leading-relaxed">
          Trigger a <b>MessageSent</b> event on your Laravel backend to the <b>chat.{channelId}</b> channel. 
          The message will appear here instantly without refreshing.
        </p>
      </div>
    </div>
  );
}
