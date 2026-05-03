import { Campaign, CampaignLog, CampaignRecipient } from '../types';

export const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Eid Al-Adha Greetings 2024',
    type: 'Broadcast',
    audienceSize: 1250,
    sent: 1250,
    delivered: 1245,
    read: 1102,
    failed: 5,
    status: 'Completed',
    scheduledAt: '2024-06-15T09:00:00Z',
    templateId: '1',
    variableMapping: { '1': 'name' },
    createdAt: '2024-06-10T14:30:00Z'
  },
  {
    id: '2',
    name: 'Winter Collection Drop',
    type: 'Broadcast',
    audienceSize: 5000,
    sent: 0,
    delivered: 0,
    read: 0,
    failed: 0,
    status: 'Scheduled',
    scheduledAt: '2024-12-01T10:00:00Z',
    templateId: '1',
    variableMapping: { '1': 'name' },
    createdAt: '2024-11-20T11:00:00Z'
  },
  {
    id: '3',
    name: 'Appointment Reminder Bot',
    type: 'Automation',
    audienceSize: 842,
    sent: 842,
    delivered: 840,
    read: 790,
    failed: 2,
    status: 'Running',
    scheduledAt: '2024-05-01T00:00:00Z',
    templateId: '2',
    variableMapping: { '1': 'name', '2': 'date', '3': 'time' },
    createdAt: '2024-04-25T15:00:00Z'
  },
  {
    id: '4',
    name: 'Flash Sale Alert',
    type: 'Broadcast',
    audienceSize: 200,
    sent: 0,
    delivered: 0,
    read: 0,
    failed: 0,
    status: 'Draft',
    scheduledAt: '',
    templateId: '1',
    variableMapping: {},
    createdAt: '2024-05-03T08:00:00Z'
  }
];

export const mockLogs: CampaignLog[] = [
  { id: 'l1', campaignId: '1', timestamp: '2024-06-15T09:00:01Z', level: 'info', message: 'Campaign started.' },
  { id: 'l2', campaignId: '1', timestamp: '2024-06-15T09:05:00Z', level: 'info', message: '500 messages sent successfully.' },
  { id: 'l3', campaignId: '1', timestamp: '2024-06-15T09:12:00Z', level: 'warning', message: 'Throttling applied due to Meta rate limits.' },
  { id: 'l4', campaignId: '1', timestamp: '2024-06-15T09:15:22Z', level: 'error', message: 'Failed to deliver to +923001234567: User phone number not on WhatsApp.' },
  { id: 'l5', campaignId: '1', timestamp: '2024-06-15T09:20:00Z', level: 'info', message: 'Campaign completed successfully.' }
];

export const mockRecipients: CampaignRecipient[] = [
  { id: 'r1', campaignId: '1', contactId: '1', contactName: 'Muhammad Ahmad', status: 'read', timestamp: '2024-06-15T09:02:00Z' },
  { id: 'r2', campaignId: '1', contactId: '2', contactName: 'Zainab Bibi', status: 'delivered', timestamp: '2024-06-15T09:05:00Z' },
  { id: 'r3', campaignId: '1', contactId: '3', contactName: 'Ali Khan', status: 'failed', error: 'Invalid Number', timestamp: '2024-06-15T09:10:00Z' }
];
