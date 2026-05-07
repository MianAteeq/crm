import { Contact, Tag } from '../types';
export type { Contact, Tag };

export interface CampaignActivity {
  id: string;
  name: string;
  status: 'delivered' | 'read' | 'failed' | 'sent';
  timestamp: string;
}

export interface Segment {
  id: string;
  name: string;
  count: number;
  filters: any;
}

export const contacts: Contact[] = [
  {
    id: '1',
    name: 'Ahmad Hassan',
    phone: '+92 300 1234567',
    email: 'ahmad.h@example.com',
    tags: ['1', '2'], // VIP, Eid Promo
    lastSeen: '2 hours ago',
    createdAt: '2024-01-15',
    status: 'active',
    notes: 'Prefers evening appointments.',
    company: 'Tech Solutions PK',
    job_title: 'Senior Dev',
    address: 'Gulberg III, Lahore',
    birthday: '1990-05-15'
  },
  {
    id: '2',
    name: 'Sara Khan',
    phone: '+92 321 7654321',
    email: 'sara.k@example.com',
    tags: ['3'], // New Customer
    lastSeen: 'Yesterday',
    createdAt: '2024-02-10',
    status: 'active',
    notes: 'Interested in winter collection.',
    company: 'Fashion Hub',
    job_title: 'Store Manager',
    address: 'DHA Phase 5, Karachi'
  },
  {
    id: '3',
    name: 'Zainab Ali',
    phone: '+92 333 9988776',
    email: 'zainab.a@example.com',
    tags: ['6', '5'], // Inactive, Complaint
    lastSeen: '2 weeks ago',
    createdAt: '2023-11-20',
    status: 'archived',
    notes: 'Last order had shipping delays.'
  },
  {
    id: '4',
    name: 'Omar Farooq',
    phone: '+92 345 5566778',
    email: 'omar.f@example.com',
    tags: ['4'], // Wholesale
    lastSeen: '5 mins ago',
    createdAt: '2024-03-01',
    status: 'active',
  },
  {
    id: '5',
    name: 'Fatima Zahra',
    phone: '+92 312 4433221',
    email: 'fatima.z@example.com',
    tags: ['1'], // VIP
    lastSeen: '3 days ago',
    createdAt: '2024-01-05',
    status: 'active',
  }
];

export const availableTags = ['VIP', 'Eid Promo', 'New Customer', 'Wholesale', 'Complaint', 'Inactive'];

export const segments: Segment[] = [
  { id: 's1', name: 'Top Spenders', count: 42, filters: {} },
  { id: 's2', name: 'Abandoned Cart', count: 128, filters: {} },
  { id: 's3', name: 'Karachi VIPs', count: 18, filters: {} }
];
