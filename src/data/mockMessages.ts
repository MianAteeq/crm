import { Conversation, Message } from '../types';

export const mockConversations: Conversation[] = [
  {
    id: 'conv_1',
    contact: {
      id: 'c1',
      name: 'Muhammad Ahmad',
      phone: '+92 300 1234567',
      status: 'active',
      tags: ['Premium', 'Loyalty'],
      lastSeen: '2024-05-03T09:00:00Z'
    },
    isOnline: true,
    unreadCount: 3,
    messages: [
      { id: 'm1', sender: 'contact', type: 'text', content: 'Hello, I have a question about my order.', timestamp: '2024-05-03T08:30:00Z', status: 'read' },
      { id: 'm2', sender: 'user', type: 'text', content: 'Sure Ahmad! How can I help you today?', timestamp: '2024-05-03T08:32:00Z', status: 'read' },
      { id: 'm3', sender: 'contact', type: 'text', content: 'Actually, I wanted to change the shipping address.', timestamp: '2024-05-03T08:45:00Z', status: 'read' },
      { id: 'm4', sender: 'contact', type: 'text', content: 'Is it too late for that?', timestamp: '2024-05-03T08:45:10Z', status: 'read' }
    ],
    lastMessage: { id: 'm4', sender: 'contact', type: 'text', content: 'Is it too late for that?', timestamp: '2024-05-03T08:45:10Z', status: 'read' }
  },
  {
    id: 'conv_2',
    contact: {
      id: 'c2',
      name: 'Zainab Bibi',
      phone: '+92 312 9876543',
      status: 'active',
      tags: ['New Lead'],
      lastSeen: '2024-05-03T07:15:00Z'
    },
    isOnline: false,
    unreadCount: 0,
    messages: [
      { id: 'm5', sender: 'user', type: 'template', content: 'Hi Zainab! Thanks for joining us. Check out our new collection.', timestamp: '2024-05-03T07:00:00Z', status: 'read' },
      { id: 'm6', sender: 'contact', type: 'text', content: 'Thank you! The collection looks great.', timestamp: '2024-05-03T07:10:00Z', status: 'read' }
    ],
    lastMessage: { id: 'm6', sender: 'contact', type: 'text', content: 'Thank you! The collection looks great.', timestamp: '2024-05-03T07:10:00Z', status: 'read' }
  },
  {
    id: 'conv_3',
    contact: {
      id: 'c3',
      name: 'Ali Khan',
      phone: '+92 321 4567890',
      status: 'active',
      tags: ['Urgent'],
      lastSeen: '2024-05-02T22:00:00Z'
    },
    isOnline: false,
    unreadCount: 0,
    messages: [
      { id: 'm7', sender: 'contact', type: 'text', content: 'Why was my order canceled?', timestamp: '2024-05-02T21:45:00Z', status: 'read' },
      { id: 'm8', sender: 'user', type: 'text', content: 'Hi Ali, we are looking into this for you.', timestamp: '2024-05-02T21:55:00Z', status: 'delivered' }
    ],
    lastMessage: { id: 'm8', sender: 'user', type: 'text', content: 'Hi Ali, we are looking into this for you.', timestamp: '2024-05-02T21:55:00Z', status: 'delivered' }
  }
];
