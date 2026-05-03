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

export interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
  tags: string[];
  lastContacted: string;
  status: 'active' | 'inactive' | 'blocked';
  notes?: string;
  avatar?: string;
  campaigns: CampaignActivity[];
  totalCampaigns: number;
  addedDate: string;
  company?: string;
  jobTitle?: string;
  address?: string;
  birthday?: string;
  website?: string;
}

export const contacts: Contact[] = [
  {
    id: '1',
    name: 'Ahmad Hassan',
    phone: '+92 300 1234567',
    email: 'ahmad.h@example.com',
    tags: ['VIP', 'Eid Promo'],
    lastContacted: '2 hours ago',
    addedDate: '2024-01-15',
    status: 'active',
    totalCampaigns: 12,
    campaigns: [
      { id: 'c1', name: 'Eid Greetings 2024', status: 'read', timestamp: '2 hours ago' },
      { id: 'c2', name: 'Winter Clearance', status: 'delivered', timestamp: '3 days ago' }
    ],
    notes: 'Prefers evening appointments.',
    company: 'Tech Solutions PK',
    jobTitle: 'Senior Dev',
    address: 'Gulberg III, Lahore',
    birthday: '1990-05-15'
  },
  {
    id: '2',
    name: 'Sara Khan',
    phone: '+92 321 7654321',
    email: 'sara.k@example.com',
    tags: ['New Customer'],
    lastContacted: 'Yesterday',
    addedDate: '2024-02-10',
    status: 'active',
    totalCampaigns: 4,
    campaigns: [
      { id: 'c3', name: 'Welcome Series', status: 'read', timestamp: 'Yesterday' }
    ],
    notes: 'Interested in winter collection.',
    company: 'Fashion Hub',
    jobTitle: 'Store Manager',
    address: 'DHA Phase 5, Karachi'
  },
  {
    id: '3',
    name: 'Zainab Ali',
    phone: '+92 333 9988776',
    email: 'zainab.a@example.com',
    tags: ['Inactive', 'Complaint'],
    lastContacted: '2 weeks ago',
    addedDate: '2023-11-20',
    status: 'inactive',
    totalCampaigns: 8,
    campaigns: [],
    notes: 'Last order had shipping delays.'
  },
  {
    id: '4',
    name: 'Omar Farooq',
    phone: '+92 345 5566778',
    email: 'omar.f@example.com',
    tags: ['Wholesale'],
    lastContacted: '5 mins ago',
    addedDate: '2024-03-01',
    status: 'active',
    totalCampaigns: 25,
    campaigns: []
  },
  {
    id: '5',
    name: 'Fatima Zahra',
    phone: '+92 312 4433221',
    email: 'fatima.z@example.com',
    tags: ['VIP'],
    lastContacted: '3 days ago',
    addedDate: '2024-01-05',
    status: 'active',
    totalCampaigns: 15,
    campaigns: []
  }
];

export const availableTags = ['VIP', 'Eid Promo', 'New Customer', 'Wholesale', 'Complaint', 'Inactive'];

export const segments: Segment[] = [
  { id: 's1', name: 'Top Spenders', count: 42, filters: {} },
  { id: 's2', name: 'Abandoned Cart', count: 128, filters: {} },
  { id: 's3', name: 'Karachi VIPs', count: 18, filters: {} }
];
