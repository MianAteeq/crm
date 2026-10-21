import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Users, Mail, Eye, Calendar, ArrowLeft, ArrowRight, Check, Send, 
  Sparkles, Filter, AlertCircle, CheckCircle2, ShieldCheck, RefreshCw, 
  Layers, Code, FileText, ChevronRight, HelpCircle, X, Bot, Wand2,
  Bold, Italic, Underline, Heading2, List, ListOrdered, Link2, 
  MousePointerClick, Minus, Smartphone, Monitor, Copy, Plus, Search, 
  AlertTriangle, Tag, Sliders, Smile, Type, Split, ExternalLink,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Info, CheckCheck, Undo2, ArrowUpRight, MessageSquare, Briefcase, MapPin, Building,
  Lock, Palette, Layout, Globe
} from 'lucide-react';
import { emailCampaignApi } from '../../services/emailCampaignApi';
import { crmApi } from '../../services/crmApi';
import { AudienceFilter, AudienceEstimate, EmailTemplate, EmailSendingDomain } from '../../types/emailCampaign';
import { toast } from '../../components/ui/Toast';
import { useI18n } from '../../i18n';
import { cn } from '../../lib/utils';

type Step = 'audience' | 'email' | 'personalization' | 'preview_test' | 'schedule_send';

export interface SampleContact {
  id: number | string;
  name: string;
  first_name?: string;
  last_name?: string;
  company?: string;
  email: string;
  phone?: string;
  website?: string;
  city?: string;
  industry?: string;
  lead_quality_grade?: string;
  lead_score?: number;
  source?: string;
  source_details?: {
    city?: string;
    category?: string;
  };
}

const DEFAULT_SAMPLE_CONTACTS: SampleContact[] = [
  {
    id: 'sample-1',
    name: 'Dr. Farhan Ahmed',
    first_name: 'Farhan',
    last_name: 'Ahmed',
    company: 'Apex Dental Studio',
    email: 'dr.farhan@apexdental.pk',
    phone: '+92 300 1234567',
    website: 'https://apexdental.pk',
    city: 'Lahore',
    industry: 'Dental Healthcare',
    lead_quality_grade: 'A',
    lead_score: 95,
    source: 'Business Scraper',
    source_details: { city: 'Lahore', category: 'Dental Clinic' },
  },
  {
    id: 'sample-2',
    name: 'Ayesha Noor',
    first_name: 'Ayesha',
    last_name: 'Noor',
    company: 'Prime Horizon Real Estate',
    email: 'ayesha.noor@primehorizon.pk',
    phone: '+92 321 9876543',
    website: 'https://primehorizon.pk',
    city: 'Karachi',
    industry: 'Real Estate & Properties',
    lead_quality_grade: 'B',
    lead_score: 82,
    source: 'CRM',
    source_details: { city: 'Karachi', category: 'Real Estate' },
  },
  {
    id: 'sample-3',
    name: 'Bilal Siddiqui',
    first_name: 'Bilal',
    last_name: 'Siddiqui',
    company: 'Nexus Software Labs',
    email: 'bilal@nexuslabs.co',
    phone: '+92 333 5551234',
    website: 'https://nexuslabs.co',
    city: 'Islamabad',
    industry: 'Software & Technology',
    lead_quality_grade: 'A',
    lead_score: 91,
    source: 'Business Scraper',
    source_details: { city: 'Islamabad', category: 'IT Solutions' },
  },
  {
    id: 'sample-missing',
    name: '', // Edge-case: Contact with missing name & company
    first_name: '',
    last_name: '',
    company: '',
    email: 'contact@client-enterprise.com',
    phone: '',
    website: '',
    city: '',
    industry: '',
    lead_quality_grade: 'C',
    lead_score: 48,
    source: 'CRM',
  },
];

// 5 PROFESSIONAL TEMPLATE FRAMES (FIXED HEADER & FOOTER - USER ONLY CHANGES BODY)
export interface EmailFrame {
  id: string;
  name: string;
  badge: string;
  accentBg: string;
  accentBorder: string;
  description: string;
  defaultSubject: string;
  defaultBody: string;
  renderHeader: (fromName: string) => string;
  renderFooter: (fromName: string) => string;
}

export const PROFESSIONAL_FRAMES: EmailFrame[] = [
  {
    id: 'executive',
    name: 'Modern Executive',
    badge: 'Navy & Slate',
    accentBg: 'bg-slate-900',
    accentBorder: 'border-blue-600',
    description: 'Clean executive letterhead with dark navy header and verified business badge.',
    defaultSubject: 'Partnership inquiry for {{business_name}}',
    defaultBody: `<p style="margin: 0 0 16px 0;">Hi {{first_name | default: "there"}},</p>
<p style="margin: 0 0 16px 0;">I noticed <strong>{{business_name}}</strong> and was really impressed by your reputation and market presence.</p>
<p style="margin: 0 0 16px 0;">We recently helped companies similar to yours increase their qualified inquiries and streamline client scheduling. I wanted to share a few specific ideas tailored for your team.</p>
<p style="margin: 20px 0;"><a href="https://calendly.com" target="_blank" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-family: sans-serif; font-size: 14px;">Schedule a 10-Minute Call &rarr;</a></p>
<p style="margin: 0 0 16px 0;">Would you be open to a brief 10-minute chat this week?</p>
<p style="margin: 0; line-height: 1.5;">Best regards,<br><strong style="color: #0f172a;">{{from_name}}</strong><br><span style="font-size: 13px; color: #64748b;">Growth & Strategy</span></p>`,
    renderHeader: (fromName) => `
<div style="background-color: #0f172a; padding: 24px 32px; border-bottom: 3px solid #3b82f6; border-radius: 12px 12px 0 0;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td>
        <span style="color: #ffffff; font-size: 18px; font-weight: 800; letter-spacing: -0.5px; text-transform: uppercase;">${fromName || 'Your Business'}</span>
        <span style="display: block; color: #94a3b8; font-size: 12px; margin-top: 3px; font-weight: 500;">Executive Business Advisory</span>
      </td>
      <td align="right">
        <span style="display: inline-block; background-color: rgba(59, 130, 246, 0.2); color: #60a5fa; font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px;">Verified Partner</span>
      </td>
    </tr>
  </table>
</div>`,
    renderFooter: (fromName) => `
<div style="background-color: #f8fafc; padding: 24px 32px; border-top: 1px solid #e2e8f0; border-radius: 0 0 12px 12px; text-align: center; color: #94a3b8; font-size: 11px; line-height: 1.5;">
  <p style="margin: 0 0 6px 0; color: #64748b;">You received this business email regarding <strong>{{business_name}}</strong>.</p>
  <p style="margin: 0 0 10px 0;">Sent by ${fromName || 'our team'} &bull; Direct Outreach &bull; All rights reserved.</p>
  <p style="margin: 0;"><a href="{{unsubscribe_url}}" style="color: #64748b; text-decoration: underline; font-weight: 600;">Unsubscribe from future emails</a></p>
</div>`
  },
  {
    id: 'saas_indigo',
    name: 'Tech & SaaS',
    badge: 'Indigo Gradient',
    accentBg: 'bg-[#166534]',
    accentBorder: 'border-[#166534]',
    description: 'Vibrant indigo header tailored for modern software, agencies, and automation companies.',
    defaultSubject: 'Quick idea for {{business_name}}',
    defaultBody: `<p style="margin: 0 0 16px 0;">Hi {{first_name | default: "there"}},</p>
<p style="margin: 0 0 16px 0;">We recently developed an automated outreach and CRM pipeline system specifically designed for modern businesses like <strong>{{business_name}}</strong>.</p>
<div style="background-color: #f5f3ff; border-left: 4px solid #7c3aed; border-radius: 8px; padding: 16px; margin: 20px 0;">
  <strong style="color: #5b21b6; font-size: 14px;">Why this matters for {{business_name}}:</strong>
  <p style="margin: 6px 0 0 0; color: #4c1d95; font-size: 13px;">Teams using this framework have seen a 35% reduction in manual data entry and a 2x increase in qualified lead bookings.</p>
</div>
<p style="margin: 20px 0;"><a href="https://" target="_blank" style="display: inline-block; background-color: #4f46e5; color: #ffffff; padding: 12px 26px; border-radius: 8px; text-decoration: none; font-weight: bold; font-family: sans-serif; font-size: 14px;">Explore 10-Min Demo &rarr;</a></p>
<p style="margin: 0 0 16px 0;">Let me know if you would like me to send over a 2-minute overview video.</p>
<p style="margin: 0; line-height: 1.5;">Best regards,<br><strong style="color: #1e1b4b;">{{from_name}}</strong></p>`,
    renderHeader: (fromName) => `
<div style="background: linear-gradient(135deg, #4338ca 0%, #6366f1 100%); padding: 28px 32px; border-radius: 12px 12px 0 0;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td>
        <span style="color: #ffffff; font-size: 19px; font-weight: 800; letter-spacing: -0.5px;">${fromName || 'Intelligent Solutions'}</span>
        <span style="display: block; color: #c7d2fe; font-size: 12px; margin-top: 2px;">Software Automation & Acceleration</span>
      </td>
      <td align="right">
        <span style="background-color: rgba(255,255,255,0.2); color: #ffffff; font-size: 11px; font-weight: 700; padding: 5px 12px; border-radius: 20px;">SaaS Platform</span>
      </td>
    </tr>
  </table>
</div>`,
    renderFooter: (fromName) => `
<div style="background-color: #faf5ff; padding: 22px 32px; border-top: 1px solid #ede9fe; border-radius: 0 0 12px 12px; text-align: center; color: #a78bfa; font-size: 11px;">
  <p style="margin: 0 0 6px 0; color: #6b21a8;">Delivered by ${fromName || 'our platform'} &bull; Certified Outreach Engine</p>
  <p style="margin: 0;"><a href="{{unsubscribe_url}}" style="color: #7c3aed; text-decoration: underline;">Unsubscribe</a></p>
</div>`
  },
  {
    id: 'healthcare_teal',
    name: 'Clinic & Healthcare',
    badge: 'Teal & Emerald',
    accentBg: 'bg-teal-700',
    accentBorder: 'border-teal-500',
    description: 'Calm, trust-inspiring teal header ideal for clinics, dental practices, doctors, and healthcare.',
    defaultSubject: 'Patient booking consultation for {{business_name}}',
    defaultBody: `<p style="margin: 0 0 16px 0;">Dear {{first_name | default: "Doctor"}},</p>
<p style="margin: 0 0 16px 0;">We noticed <strong>{{business_name}}</strong> and understand the importance of patient satisfaction and minimizing appointment no-shows.</p>
<p style="margin: 0 0 16px 0;">Our dedicated WhatsApp reminder and patient portal software helps healthcare providers cut missed appointments by up to 40% while saving hours of staff time.</p>
<p style="margin: 20px 0;"><a href="https://" target="_blank" style="display: inline-block; background-color: #0d9488; color: #ffffff; padding: 12px 26px; border-radius: 8px; text-decoration: none; font-weight: bold; font-family: sans-serif; font-size: 14px;">Request Free Clinic Demonstration &rarr;</a></p>
<p style="margin: 0 0 16px 0;">Would you be available for a short 10-minute online walkthrough this week?</p>
<p style="margin: 0; line-height: 1.5;">Warm regards,<br><strong style="color: #115e59;">{{from_name}}</strong><br><span style="font-size: 13px; color: #64748b;">Practice Advisor</span></p>`,
    renderHeader: (fromName) => `
<div style="background-color: #0f766e; padding: 24px 32px; border-bottom: 3px solid #14b8a6; border-radius: 12px 12px 0 0;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td>
        <span style="color: #ffffff; font-size: 18px; font-weight: 800; letter-spacing: -0.3px;">${fromName || 'Practice Care'}</span>
        <span style="display: block; color: #99f6e4; font-size: 12px; margin-top: 2px;">Healthcare & Medical Solutions</span>
      </td>
      <td align="right">
        <span style="background-color: rgba(20, 184, 166, 0.25); color: #ffffff; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 20px;">Health Partner</span>
      </td>
    </tr>
  </table>
</div>`,
    renderFooter: (fromName) => `
<div style="background-color: #f0fdfa; padding: 22px 32px; border-top: 1px solid #ccfbf1; border-radius: 0 0 12px 12px; text-align: center; color: #0f766e; font-size: 11px;">
  <p style="margin: 0 0 6px 0;">Confidential healthcare outreach for {{business_name}} &bull; Sent by ${fromName || 'Practice Care'}</p>
  <p style="margin: 0;"><a href="{{unsubscribe_url}}" style="color: #0d9488; text-decoration: underline;">Unsubscribe from medical outreach</a></p>
</div>`
  },
  {
    id: 'followup_minimal',
    name: 'Clean Minimal',
    badge: 'Light Border',
    accentBg: 'bg-blue-600',
    accentBorder: 'border-blue-400',
    description: 'Clean border with a slim top accent bar. Perfect for short, high-response follow-ups.',
    defaultSubject: 'Following up regarding {{business_name}}',
    defaultBody: `<p style="margin: 0 0 16px 0;">Hi {{first_name | default: "there"}},</p>
<p style="margin: 0 0 16px 0;">I wanted to follow up quickly on my note from last week regarding {{business_name}}.</p>
<p style="margin: 0 0 16px 0;">I know how busy you are, so I will keep this brief: are you open to a 5-minute chat to see if our growth solutions would be relevant for {{business_name}}?</p>
<p style="margin: 20px 0;"><a href="https://calendly.com" target="_blank" style="display: inline-block; background-color: #1e293b; color: #ffffff; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: bold; font-family: sans-serif; font-size: 13px;">Pick a 5-Minute Time &rarr;</a></p>
<p style="margin: 0; line-height: 1.5;">Best regards,<br><strong>{{from_name}}</strong></p>`,
    renderHeader: () => `
<div style="height: 4px; background-color: #3b82f6; border-radius: 12px 12px 0 0;"></div>`,
    renderFooter: () => `
<div style="padding: 18px 28px; background-color: #f8fafc; border-top: 1px solid #f1f5f9; border-radius: 0 0 12px 12px; text-align: center; color: #94a3b8; font-size: 11px;">
  <p style="margin: 0;">If you'd rather not hear from us again, you can <a href="{{unsubscribe_url}}" style="color: #64748b; text-decoration: underline;">unsubscribe here</a>.</p>
</div>`
  },
  {
    id: 'direct_note',
    name: 'Personal Direct Note',
    badge: 'Borderless',
    accentBg: 'bg-slate-700',
    accentBorder: 'border-slate-400',
    description: 'Looks and feels like a natural 1-on-1 personal email sent directly from your email client.',
    defaultSubject: 'Quick question for {{first_name | default: "there"}}',
    defaultBody: `<p style="margin: 0 0 16px 0;">Hi {{first_name | default: "there"}},</p>
<p style="margin: 0 0 16px 0;">Are you still looking to expand client acquisition for {{business_name}}?</p>
<p style="margin: 0 0 16px 0;">We have a few proven playbooks that worked well for similar businesses. Would love to share them with you.</p>
<p style="margin: 0 0 16px 0;">Let me know if you have 5 minutes this week.</p>
<p style="margin: 0; line-height: 1.5;">Best,<br><strong>{{from_name}}</strong></p>`,
    renderHeader: () => `
<div style="padding: 16px 24px; border-bottom: 1px solid #f1f5f9; font-size: 11px; color: #94a3b8; border-radius: 12px 12px 0 0;">
  Personal Note &bull; Direct Message
</div>`,
    renderFooter: () => `
<div style="padding: 16px 24px; border-top: 1px solid #f1f5f9; font-size: 11px; color: #94a3b8; border-radius: 0 0 12px 12px; text-align: center;">
  <a href="{{unsubscribe_url}}" style="color: #94a3b8; text-decoration: underline;">Unsubscribe</a>
</div>`
  }
];

// Assembles complete responsive email table combining Header + User's Body + Footer
export function assembleFullEmailHtml(
  frame: EmailFrame, 
  userBodyHtml: string, 
  fromName: string
): string {
  return `
<table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 30px 15px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <tr>
    <td align="center">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
        <tr>
          <td>
            ${frame.renderHeader(fromName)}
          </td>
        </tr>
        <tr>
          <td style="padding: 36px 32px; color: #334155; font-size: 15px; line-height: 1.6;">
            ${userBodyHtml}
          </td>
        </tr>
        <tr>
          <td>
            ${frame.renderFooter(fromName)}
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`.trim();
}

export function extractContactVariables(contact?: SampleContact): Record<string, string> {
  if (!contact) {
    return {
      first_name: '',
      last_name: '',
      name: '',
      business_name: '',
      company_name: '',
      company: '',
      email: '',
      phone: '',
      website: '',
      city: '',
      industry: '',
      unsubscribe_url: '#unsubscribe-demo',
    };
  }

  const rawName = (contact.name || '').trim();
  const cleanedName = rawName.replace(/^(dr\.|dr|mr\.|mr|mrs\.|mrs|ms\.|ms|prof\.|engr\.)\s+/i, '');
  const nameParts = cleanedName.split(/\s+/).filter(Boolean);
  const firstName = contact.first_name || nameParts[0] || '';
  const lastName = contact.last_name || (nameParts.length > 1 ? nameParts.slice(1).join(' ') : '');

  const company = (contact.company || '').trim();
  const businessName = company || rawName;

  let city = contact.city || '';
  if (!city && contact.source_details?.city) {
    city = String(contact.source_details.city).trim();
  }

  let industry = contact.industry || '';
  if (!industry && contact.source_details?.category) {
    industry = String(contact.source_details.category);
  }

  return {
    first_name: firstName,
    last_name: lastName,
    name: rawName,
    business_name: businessName,
    company_name: company || businessName,
    company: company || businessName,
    email: (contact.email || '').trim(),
    phone: (contact.phone || '').trim(),
    website: (contact.website || '').trim(),
    city: city,
    industry: industry,
    unsubscribe_url: '#unsubscribe-demo',
  };
}

export function renderPersonalizedText(template: string, variables: Record<string, string>, highlight = false): string {
  if (!template) return '';
  return template.replace(/\{\{\s*([a-zA-Z0-9_\-\.]+)(?:\s*\|\s*(?:default:\s*)?["']([^"']*)["'])?\s*\}\}/gi, (match, fieldKey, fallback) => {
    const key = fieldKey.toLowerCase().trim();
    const val = variables[key];
    let resolved = '';
    let isFallback = false;

    if (val !== undefined && val.trim() !== '') {
      resolved = val;
    } else if (fallback !== undefined) {
      resolved = fallback;
      isFallback = true;
    } else {
      if (['first_name', 'name'].includes(key)) {
        resolved = 'there';
      } else if (['business_name', 'company_name', 'company'].includes(key)) {
        resolved = 'your business';
      } else {
        resolved = '';
      }
      isFallback = true;
    }

    if (highlight && resolved) {
      return `<mark style="background-color: ${isFallback ? '#fef3c7' : '#e0e7ff'}; color: ${isFallback ? '#92400e' : '#3730a3'}; padding: 1px 5px; border-radius: 4px; font-weight: 600; text-decoration: none;">${resolved}</mark>`;
    }
    return resolved;
  });
}

export interface DetectedTag {
  raw: string;
  field: string;
  customFallback?: string;
  effectiveFallback: string;
  sampleValue: string;
  resolvedValue: string;
  isFallback: boolean;
  status: 'resolved' | 'using_fallback' | 'empty';
}

export function parseMergeTags(
  subjectText: string, 
  bodyText: string, 
  contactVariables: Record<string, string>
): DetectedTag[] {
  const tagRegex = /\{\{\s*([a-zA-Z0-9_\-\.]+)(?:\s*\|\s*(?:default:\s*)?["']([^"']*)["'])?\s*\}\}/gi;
  const foundMap = new Map<string, { raw: string; field: string; customFallback?: string }>();
  let match: RegExpExecArray | null;

  while ((match = tagRegex.exec(subjectText)) !== null) {
    const raw = match[0];
    const field = match[1].toLowerCase().trim();
    foundMap.set(`${field}::${match[2] || ''}`, { raw, field, customFallback: match[2] });
  }

  tagRegex.lastIndex = 0;
  while ((match = tagRegex.exec(bodyText)) !== null) {
    const raw = match[0];
    const field = match[1].toLowerCase().trim();
    foundMap.set(`${field}::${match[2] || ''}`, { raw, field, customFallback: match[2] });
  }

  const result: DetectedTag[] = [];
  foundMap.forEach(item => {
    const rawVal = contactVariables[item.field] || '';
    let resolved = '';
    let isFallback = false;
    let effectiveFallback = item.customFallback || '';

    if (!effectiveFallback) {
      if (['first_name', 'name'].includes(item.field)) {
        effectiveFallback = 'there';
      } else if (['business_name', 'company_name', 'company'].includes(item.field)) {
        effectiveFallback = 'your business';
      }
    }

    if (rawVal.trim() !== '') {
      resolved = rawVal;
      isFallback = false;
    } else if (item.customFallback !== undefined) {
      resolved = item.customFallback;
      isFallback = true;
    } else if (effectiveFallback) {
      resolved = effectiveFallback;
      isFallback = true;
    }

    let status: 'resolved' | 'using_fallback' | 'empty' = 'resolved';
    if (!rawVal.trim()) {
      status = resolved ? 'using_fallback' : 'empty';
    }

    result.push({
      raw: item.raw,
      field: item.field,
      customFallback: item.customFallback,
      effectiveFallback,
      sampleValue: rawVal,
      resolvedValue: resolved,
      isFallback,
      status,
    });
  });

  return result;
}

export default function EmailCampaignBuilderPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t, isRtl, locale } = useI18n();
  const [currentStep, setCurrentStep] = useState<Step>('audience');

  const STEPS: { id: Step; label: string; icon: any }[] = useMemo(() => [
    { id: 'audience', label: isRtl ? 'الجمهور والتصفيات' : 'Audience & Filters', icon: Users },
    { id: 'email', label: isRtl ? 'صياغة الرسالة' : 'Compose Message', icon: Mail },
    { id: 'personalization', label: isRtl ? 'معاينة التخصيص' : 'Personalization Preview', icon: Sparkles },
    { id: 'preview_test', label: isRtl ? 'المراجعة والاختبار' : 'Review & Test', icon: Eye },
    { id: 'schedule_send', label: isRtl ? 'إطلاق الحملة' : 'Launch Campaign', icon: Calendar },
  ], [isRtl]);

  // Input Refs for cursor-based insertion
  const subjectInputRef = useRef<HTMLInputElement>(null);
  const visualBodyEditorRef = useRef<HTMLDivElement>(null);

  // Form State
  const [name, setName] = useState('');
  const [fromName, setFromName] = useState('');
  const [fromEmail, setFromEmail] = useState('');
  const [replyTo, setReplyTo] = useState('');
  
  // Selected Professional Template Frame
  const [selectedFrameId, setSelectedFrameId] = useState<string>('executive');
  const activeFrame = PROFESSIONAL_FRAMES.find(f => f.id === selectedFrameId) || PROFESSIONAL_FRAMES[0];

  const [subject, setSubject] = useState(activeFrame.defaultSubject);
  // User ONLY edits this body message! Header & Footer are locked/managed automatically!
  const [userBodyMessage, setUserBodyMessage] = useState(activeFrame.defaultBody);
  const [textBody, setTextBody] = useState('');

  // Audience Filter State
  const [audienceType, setAudienceType] = useState<'all' | 'filtered'>('all');
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [emailHistoryFilter, setEmailHistoryFilter] = useState<'all' | 'never_sent' | 'previously_sent' | 'delivered' | 'bounced'>('never_sent');
  const [sourceFilter, setSourceFilter] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [selectedGrades, setSelectedGrades] = useState<string[]>(['A', 'B']);
  const [minLeadScore, setMinLeadScore] = useState<number>(0);
  const [websiteAvailable, setWebsiteAvailable] = useState<boolean>(false);

  // Estimate state
  const [isEstimating, setIsEstimating] = useState(false);
  const [estimate, setEstimate] = useState<AudienceEstimate | null>(null);

  // Personalization Simulator & Inspector State
  const [selectedSampleIndex, setSelectedSampleIndex] = useState<number>(0);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [highlightVariables, setHighlightVariables] = useState<boolean>(true);

  // Test email state
  const [testEmailAddress, setTestEmailAddress] = useState('');
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testSentSuccess, setTestSentSuccess] = useState(false);

  // Schedule state
  const [sendOption, setSendOption] = useState<'now' | 'schedule'>('now');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');

  // DeepSeek AI State
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [aiPurpose, setAiPurpose] = useState('Cold Outreach');
  const [aiTone, setAiTone] = useState('Professional and Persuasive');
  const [aiTargetAudience, setAiTargetAudience] = useState('');
  const [aiCta, setAiCta] = useState('Schedule a 10-minute discovery call');
  const [aiApiKeyOverride, setAiApiKeyOverride] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiGeneratedResult, setAiGeneratedResult] = useState<{ subject: string; html_body: string; text_body?: string } | null>(null);
  const [hasConfiguredDeepseekKey, setHasConfiguredDeepseekKey] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);

  // CTA Button Modal State
  const [isButtonModalOpen, setIsButtonModalOpen] = useState(false);
  const [buttonText, setButtonText] = useState('Schedule a 10-Minute Call');
  const [buttonUrl, setButtonUrl] = useState('https://calendly.com');
  const [buttonColor, setButtonColor] = useState('#2563eb');
  const [buttonAlign, setButtonAlign] = useState<'left' | 'center'>('left');
  const lastSavedRangeRef = useRef<Range | null>(null);

  const saveVisualEditorSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      if (visualBodyEditorRef.current && visualBodyEditorRef.current.contains(range.commonAncestorContainer)) {
        lastSavedRangeRef.current = range.cloneRange();
        return;
      }
    }
    lastSavedRangeRef.current = null;
  };

  // Sending Domains State (Requirement 7 & 14)
  const [sendingDomains, setSendingDomains] = useState<EmailSendingDomain[]>([]);
  const [selectedDomainId, setSelectedDomainId] = useState<number | null>(null);
  const [isLoadingDomains, setIsLoadingDomains] = useState(true);

  const verifiedDomains = useMemo(() => {
    return sendingDomains.filter(d => d.status === 'verified');
  }, [sendingDomains]);

  const unverifiedDomains = useMemo(() => {
    return sendingDomains.filter(d => d.status !== 'verified');
  }, [sendingDomains]);

  // Load email settings, sending domains & template if passed in URL
  useEffect(() => {
    emailCampaignApi.getSettings().then((res) => {
      if (res.data) {
        if (!fromName) setFromName(res.data.from_name || 'Marketing Team');
        if (!fromEmail) setFromEmail(res.data.from_email || '');
        if (!replyTo) setReplyTo(res.data.reply_to || '');
        if (res.data.has_deepseek_api_key) setHasConfiguredDeepseekKey(true);
      }
    }).catch(() => {});

    // Fetch CRM categories
    crmApi.getCategories().then(setCategories).catch(() => {});

    // Fetch verified sending domains
    emailCampaignApi.getSendingDomains().then((domRes) => {
      if (domRes.data) {
        setSendingDomains(domRes.data);
        const verified = domRes.data.filter(d => d.status === 'verified');
        if (verified.length > 0) {
          setSelectedDomainId(verified[0].id);
          if (!fromEmail) {
            setFromEmail(`outreach@${verified[0].domain}`);
          }
        }
      }
    }).catch(() => {}).finally(() => {
      setIsLoadingDomains(false);
    });

    // Check if templateId was provided in query param
    const templateIdParam = searchParams.get('templateId');
    if (templateIdParam) {
      emailCampaignApi.getTemplates().then((tmplRes) => {
        const found = tmplRes.data?.find(t => t.id === Number(templateIdParam));
        if (found) {
          setName(`${found.name} Campaign`);
          setSubject(found.subject);
          
          const matchedFrame = PROFESSIONAL_FRAMES.find(f => 
            found.name.toLowerCase().includes(f.name.toLowerCase())
          );
          if (matchedFrame) {
            setSelectedFrameId(matchedFrame.id);
          }

          const bodyMatch = found.html_body.match(/<!-- EDITABLE BODY TEXT -->[\s\S]*?<td[^>]*>([\s\S]*?)<\/td>/i) ||
                            found.html_body.match(/<!-- BODY \(USER'S MESSAGE ONLY\) -->[\s\S]*?<td[^>]*>([\s\S]*?)<\/td>/i);
          const body = bodyMatch ? bodyMatch[1].trim() : found.html_body;
          setUserBodyMessage(body);
          if (visualBodyEditorRef.current) {
            visualBodyEditorRef.current.innerHTML = body;
          }
          if (found.text_body) setTextBody(found.text_body);
          toast.success(`Loaded template "${found.name}"`);
        }
      }).catch(() => {});
    }
  }, []);

  // Sync Visual Body Editor HTML when entering Step 2
  useEffect(() => {
    if (currentStep === 'email' && visualBodyEditorRef.current) {
      if (visualBodyEditorRef.current.innerHTML !== userBodyMessage) {
        visualBodyEditorRef.current.innerHTML = userBodyMessage;
      }
    }
  }, [currentStep, selectedFrameId]);

  // Recalculate audience estimation when filters change
  const currentFilters: AudienceFilter = {
    audience_type: audienceType,
    category_id: selectedCategoryId ? Number(selectedCategoryId) : undefined,
    email_history: emailHistoryFilter !== 'all' ? emailHistoryFilter : undefined,
    source: sourceFilter || undefined,
    industry: industryFilter || undefined,
    location: locationFilter || undefined,
    lead_quality_grades: audienceType === 'filtered' ? selectedGrades : undefined,
    min_lead_score: audienceType === 'filtered' && minLeadScore > 0 ? minLeadScore : undefined,
    website_available: audienceType === 'filtered' && websiteAvailable ? true : undefined,
  };

  const runAudienceEstimate = async () => {
    setIsEstimating(true);
    try {
      const res = await emailCampaignApi.estimateAudience(currentFilters);
      setEstimate(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsEstimating(false);
    }
  };

  useEffect(() => {
    runAudienceEstimate();
  }, [
    audienceType, 
    selectedCategoryId, 
    emailHistoryFilter, 
    sourceFilter, 
    industryFilter, 
    locationFilter, 
    selectedGrades, 
    minLeadScore, 
    websiteAvailable
  ]);

  // Sample contacts list
  const sampleContactsList: SampleContact[] = useMemo(() => {
    if (estimate?.sample_eligible && estimate.sample_eligible.length > 0) {
      const mappedApiContacts: SampleContact[] = estimate.sample_eligible.map((item: any) => ({
        id: item.id,
        name: item.name || '',
        first_name: item.first_name,
        last_name: item.last_name,
        company: item.company || item.business_name,
        email: item.email || '',
        phone: item.phone,
        website: item.website,
        city: item.city || item.source_details?.city,
        industry: item.job_title || item.source_details?.category,
        lead_quality_grade: item.lead_quality_grade,
        lead_score: item.lead_score,
        source: item.source,
        source_details: item.source_details,
      }));
      return [...mappedApiContacts, DEFAULT_SAMPLE_CONTACTS[3]];
    }
    return DEFAULT_SAMPLE_CONTACTS;
  }, [estimate]);

  const activeContact: SampleContact = sampleContactsList[selectedSampleIndex] || sampleContactsList[0] || DEFAULT_SAMPLE_CONTACTS[0];
  const activeVariables = useMemo(() => extractContactVariables(activeContact), [activeContact]);
  
  // Full assembled email (Header + User Body + Footer)
  const fullAssembledEmailHtml = useMemo(() => {
    return assembleFullEmailHtml(activeFrame, userBodyMessage, fromName);
  }, [activeFrame, userBodyMessage, fromName]);

  const detectedMergeTags = useMemo(() => {
    return parseMergeTags(subject, fullAssembledEmailHtml, activeVariables);
  }, [subject, fullAssembledEmailHtml, activeVariables]);

  // Handle switching template frames (Preserves user body message!)
  const handleSelectFrame = (frameId: string) => {
    const found = PROFESSIONAL_FRAMES.find(f => f.id === frameId);
    if (!found) return;
    setSelectedFrameId(frameId);
    setSubject(found.defaultSubject);
    // Note: We keep the user's existing body message if they typed one, or load the template's default body
    if (!userBodyMessage.trim() || userBodyMessage === activeFrame.defaultBody) {
      setUserBodyMessage(found.defaultBody);
      if (visualBodyEditorRef.current) {
        visualBodyEditorRef.current.innerHTML = found.defaultBody;
      }
    }
    toast.success(isRtl ? `تم التبديل إلى قالب "${found.name}"` : `Switched to "${found.name}" Template Frame`);
  };

  // 1-Click Visual formatting
  const applyVisualFormat = (command: string, value: string | undefined = undefined) => {
    if (visualBodyEditorRef.current) {
      visualBodyEditorRef.current.focus();

      if (
        (command === 'insertUnorderedList' || command === 'insertOrderedList') &&
        (!visualBodyEditorRef.current.innerHTML || visualBodyEditorRef.current.innerHTML.trim() === '' || visualBodyEditorRef.current.innerHTML.trim() === '<br>')
      ) {
        const tag = command === 'insertUnorderedList' ? 'ul' : 'ol';
        visualBodyEditorRef.current.innerHTML = `<${tag}><li>List item</li></${tag}>`;
        setUserBodyMessage(visualBodyEditorRef.current.innerHTML);
        return;
      }

      document.execCommand(command, false, value);
      setUserBodyMessage(visualBodyEditorRef.current.innerHTML);
    }
  };

  // Open CTA Button Modal
  const handleOpenButtonModal = () => {
    saveVisualEditorSelection();
    setIsButtonModalOpen(true);
  };

  const handleInsertButtonSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const label = buttonText.trim() || (isRtl ? 'اضغط هنا' : 'Click Here');
    const url = buttonUrl.trim() || 'https://';
    const color = buttonColor || '#2563eb';
    const align = buttonAlign || 'left';
    const arrow = isRtl ? '&larr;' : '&rarr;';

    // Bulletproof Cross-Client HTML Email Button (Gmail, Outlook, Apple Mail)
    const buttonHtml = `&nbsp;<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin: 16px ${align === 'center' ? 'auto' : '0'}; border-collapse: separate; display: inline-table;"><tr><td align="center" bgcolor="${color}" style="border-radius: 8px; background-color: ${color};"><a href="${url}" target="_blank" style="font-size: 14px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-weight: bold; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 8px; display: inline-block; mso-padding-alt: 0; border: 1px solid ${color};">${label} ${arrow}</a></td></tr></table>&nbsp;`;

    if (visualBodyEditorRef.current) {
      visualBodyEditorRef.current.focus();
      const sel = window.getSelection();
      let inserted = false;
      if (lastSavedRangeRef.current && sel) {
        try {
          sel.removeAllRanges();
          sel.addRange(lastSavedRangeRef.current);
          document.execCommand('insertHTML', false, buttonHtml);
          inserted = true;
        } catch (err) {
          // fallback
        }
      }
      if (!inserted) {
        visualBodyEditorRef.current.innerHTML += `<p><br/>${buttonHtml}<br/></p>`;
      }
      setUserBodyMessage(visualBodyEditorRef.current.innerHTML);
      toast.success(isRtl ? 'تم إدراج زر الإجراء في نص الرسالة بنجاح' : 'CTA Button inserted into message body');
    }
    setIsButtonModalOpen(false);
  };

  // 1-Click insert tag into body
  const insertTagIntoBody = (tag: string) => {
    if (visualBodyEditorRef.current) {
      visualBodyEditorRef.current.focus();
      document.execCommand('insertText', false, ' ' + tag + ' ');
      setUserBodyMessage(visualBodyEditorRef.current.innerHTML);
      toast.success(isRtl ? `تم إدراج الوسم ${tag}` : `Inserted ${tag}`);
    }
  };

  // Cursor-aware insertion into Subject
  const insertTagIntoSubject = (tag: string) => {
    const input = subjectInputRef.current;
    if (!input) {
      setSubject(prev => prev + ' ' + tag);
      toast.success(isRtl ? `تمت إضافة ${tag} إلى الموضوع` : `Added ${tag} to Subject`);
      return;
    }
    const start = input.selectionStart ?? subject.length;
    const end = input.selectionEnd ?? subject.length;
    const prefix = start > 0 && subject[start - 1] !== ' ' ? ' ' : '';
    const suffix = end < subject.length && subject[end] !== ' ' ? ' ' : '';
    const newSubject = subject.substring(0, start) + prefix + tag + suffix + subject.substring(end);
    setSubject(newSubject);
    setTimeout(() => {
      input.focus();
      const newPos = start + prefix.length + tag.length + suffix.length;
      input.setSelectionRange(newPos, newPos);
    }, 20);
    toast.success(isRtl ? `تم إدراج الوسم ${tag}` : `Inserted ${tag}`);
  };

  // Send test email
  const handleSendTest = async () => {
    if (!testEmailAddress) {
      toast.error(isRtl ? 'يرجى إدخال بريد إلكتروني تجريبي.' : 'Please enter a test recipient email.');
      return;
    }
    if (!subject) {
      toast.error(isRtl ? 'يرجى كتابة عنوان الموضوع أولاً.' : 'Please enter a subject line first.');
      return;
    }
    setIsSendingTest(true);
    try {
      await emailCampaignApi.sendTestEmail({
        test_email: testEmailAddress,
        from_name: fromName,
        from_email: fromEmail,
        reply_to: replyTo || undefined,
        subject,
        html_body: fullAssembledEmailHtml,
        text_body: textBody || undefined,
      });
      setTestSentSuccess(true);
      toast.success(isRtl ? `تم إرسال البريد التجريبي إلى ${testEmailAddress}` : `Test email dispatched to ${testEmailAddress}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || (isRtl ? 'فشل إرسال البريد التجريبي' : 'Failed to send test email'));
    } finally {
      setIsSendingTest(false);
    }
  };

  // Launch campaign
  const handleLaunchCampaign = async (asDraft = false) => {
    if (!name.trim()) {
      toast.error(isRtl ? 'اسم الحملة مطلوب.' : 'Campaign Name is required.');
      setCurrentStep('audience');
      return;
    }
    if (!fromEmail.trim()) {
      toast.error(isRtl ? 'البريد الإلكتروني للمرسل مطلوب.' : 'From Email is required.');
      setCurrentStep('email');
      return;
    }
    if (!subject.trim()) {
      toast.error(isRtl ? 'عنوان الموضوع مطلوب.' : 'Subject is required.');
      setCurrentStep('email');
      return;
    }
    if (!userBodyMessage.trim()) {
      toast.error(isRtl ? 'نص الرسالة مطلوب.' : 'Message body is required.');
      setCurrentStep('email');
      return;
    }

    if (!asDraft && (!estimate || estimate.eligible_count === 0)) {
      toast.error(isRtl ? 'لا توجد جهات اتصال مؤهلة تطابق معايير الجمهور المحددة.' : 'There are no eligible recipients matching your audience criteria.');
      setCurrentStep('audience');
      return;
    }

    if (!asDraft && verifiedDomains.length === 0) {
      toast.error(isRtl ? 'قبل إرسال رسائل البريد الإلكتروني، يجب عليك إثبات ملكية نطاق إرسال.' : 'Before you can send emails, you must verify a sending domain.');
      navigate('/settings/email?tab=domains');
      return;
    }

    setIsLaunching(true);
    try {
      let scheduledAt: string | undefined = undefined;
      if (!asDraft && sendOption === 'schedule' && scheduledDate && scheduledTime) {
        scheduledAt = `${scheduledDate} ${scheduledTime}:00`;
      }

      const payload = {
        name,
        subject,
        from_name: fromName,
        from_email: fromEmail,
        reply_to: replyTo || undefined,
        sending_domain_id: selectedDomainId || undefined,
        html_body: fullAssembledEmailHtml,
        text_body: textBody || undefined,
        audience_filter: currentFilters,
        scheduled_at: scheduledAt,
        launch_now: !asDraft && sendOption === 'now',
      };

      await emailCampaignApi.createCampaign(payload);
      toast.success(
        asDraft 
          ? (isRtl ? 'تم حفظ الحملة كمسودة' : 'Campaign saved as draft')
          : (sendOption === 'now' 
              ? (isRtl ? 'تم إطلاق الحملة بنجاح!' : 'Campaign launched successfully!') 
              : (isRtl ? 'تمت جدولة الحملة بنجاح!' : 'Campaign scheduled!'))
      );
      navigate('/email-campaigns');
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || (isRtl ? 'فشلت معالجة الحملة' : 'Failed to process campaign'));
    } finally {
      setIsLaunching(false);
    }
  };

  // DeepSeek AI Generation
  const handleGenerateWithAi = async () => {
    if (!aiTopic.trim()) {
      toast.error(isRtl ? 'يرجى كتابة موضوع الرسالة أولاً.' : 'Please enter what this email is about.');
      return;
    }
    setIsGeneratingAi(true);
    try {
      const res = await emailCampaignApi.generateAiEmail({
        topic: aiTopic,
        purpose: aiPurpose,
        tone: aiTone,
        target_audience: aiTargetAudience || (industryFilter ? `${industryFilter} in ${locationFilter || 'our target area'}` : 'Prospective business clients'),
        call_to_action: aiCta,
        api_key: aiApiKeyOverride || undefined,
      });
      setAiGeneratedResult(res.data);
      toast.success(isRtl ? 'تمت صياغة مسودة البريد بالذكاء الاصطناعي!' : 'AI drafted your email body!');
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || err.message || (isRtl ? 'فشل التوليد بالذكاء الاصطناعي' : 'AI Generation failed');
      toast.error(errorMsg);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const applyAiGeneratedEmail = () => {
    if (!aiGeneratedResult) return;
    setSubject(aiGeneratedResult.subject);
    setUserBodyMessage(aiGeneratedResult.html_body);
    if (visualBodyEditorRef.current) {
      visualBodyEditorRef.current.innerHTML = aiGeneratedResult.html_body;
    }
    if (aiGeneratedResult.text_body) {
      setTextBody(aiGeneratedResult.text_body);
    }
    setIsAiModalOpen(false);
    toast.success(isRtl ? 'تم تطبيق مسودة الذكاء الاصطناعي على رسالتك!' : 'AI draft applied to your body message!');
  };

  // Helper for step progression
  const currentStepIdx = STEPS.findIndex(s => s.id === currentStep);
  const nextStep = () => {
    if (currentStepIdx < STEPS.length - 1) {
      setCurrentStep(STEPS[currentStepIdx + 1].id);
    }
  };
  const prevStep = () => {
    if (currentStepIdx > 0) {
      setCurrentStep(STEPS[currentStepIdx - 1].id);
    }
  };

  return (
    <div className={cn("p-6 lg:p-8 max-w-6xl mx-auto space-y-8 pb-24", isRtl && "font-arabic")}>
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/email-campaigns')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
        >
          {isRtl ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
          {isRtl ? 'العودة إلى الحملات' : 'Back to Campaigns'}
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleLaunchCampaign(true)}
            disabled={isLaunching}
            className="h-10 px-4.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-semibold text-[#57534E] hover:text-[#166534] hover:bg-[#F0FDF4] hover:border-[#bbf7d0] transition-all shadow-xs active:scale-95 cursor-pointer disabled:opacity-50"
          >
            {isRtl ? 'حفظ كمسودة' : 'Save as Draft'}
          </button>
        </div>
      </div>

      {/* Requirement 15: Warning banner when no verified domain exists */}
      {!isLoadingDomains && verifiedDomains.length === 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <AlertTriangle size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-900">
                {isRtl ? 'قبل أن تتمكن من إرسال رسائل البريد، يجب عليك توثيق نطاق الإرسال.' : 'Before you can send emails, you must verify a sending domain.'}
              </p>
              <p className="text-[11px] text-amber-700">
                {isRtl ? 'أضف نطاقك وقم بتهيئة سجلات DNS لتفويض إرسال الحملات.' : 'Add your domain and configure DNS records to authorize campaigns.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate('/settings/email?tab=domains')}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold whitespace-nowrap transition-all shadow-sm"
          >
            {isRtl ? 'إضافة نطاق إرسال ←' : 'Add Sending Domain →'}
          </button>
        </div>
      )}

      {/* Step Navigator */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between overflow-x-auto no-scrollbar gap-2">
          {STEPS.map((step, idx) => {
            const isActive = step.id === currentStep;
            const isCompleted = idx < currentStepIdx;

            return (
              <button
                key={step.id}
                onClick={() => setCurrentStep(step.id)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
                  isActive 
                    ? 'bg-[#166534] text-white shadow-md shadow-[#166534]/20' 
                    : isCompleted 
                    ? 'bg-slate-50 text-slate-900 hover:bg-slate-100' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                  isActive ? 'bg-white/20 text-white' : isCompleted ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'
                }`}>
                  {isCompleted ? <Check size={14} /> : idx + 1}
                </div>
                <span className="text-xs font-bold tracking-tight">{step.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP 1: AUDIENCE & FILTERS */}
      {currentStep === 'audience' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              {isRtl ? 'إعداد الحملة وهوية المرسل' : 'Campaign Setup & Sender Identity'}
            </h2>

            {/* Campaign Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                {isRtl ? 'اسم الحملة *' : 'Campaign Name *'}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={isRtl ? 'مثال: حملة أكتوبر، متابعة عيادات الأسنان' : 'e.g. October Outreach, Q4 Dental Clinics Follow-up'}
                className={cn(
                  "w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#22C55E]/20 focus:border-[#166534] font-medium text-slate-900",
                  isRtl && "text-right"
                )}
              />
            </div>

            {/* Verified Sending Domain & Sender Identity (Requirement 7 & 14) */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck size={16} className="text-emerald-600" />
                  {isRtl ? 'هوية المرسل والنطاق الموثق' : 'Verified Sender Identity & Domain'}
                </h3>

                <button
                  type="button"
                  onClick={() => navigate('/settings/email?tab=domains')}
                  className="text-[11px] font-bold text-[#166534] hover:text-[#12263A] flex items-center gap-1"
                >
                  {isRtl ? 'إدارة النطاقات ←' : 'Manage Domains →'}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Sending Domain dropdown */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    {isRtl ? 'نطاق الإرسال الموثق *' : 'Verified Sending Domain *'}
                  </label>
                  {verifiedDomains.length === 0 ? (
                    <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                      {isRtl ? 'لا يوجد نطاق موثق. ' : 'No verified domain. '}
                      <button type="button" onClick={() => navigate('/settings/email?tab=domains')} className="underline">
                        {isRtl ? 'أضف وثّق النطاق' : 'Add & verify'}
                      </button>
                    </div>
                  ) : (
                    <select
                      value={selectedDomainId || ''}
                      onChange={(e) => {
                        const id = Number(e.target.value);
                        setSelectedDomainId(id);
                        const dom = verifiedDomains.find(d => d.id === id);
                        if (dom) {
                          const username = fromEmail.split('@')[0] || 'outreach';
                          setFromEmail(`${username}@${dom.domain}`);
                        }
                      }}
                      className={cn("w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-mono", isRtl && "text-right")}
                    >
                      {verifiedDomains.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.domain} ({isRtl ? 'موثق' : 'Verified'})
                        </option>
                      ))}
                    </select>
                  )}

                  {unverifiedDomains.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap items-center gap-1 text-[10px] text-slate-400">
                      <span>{isRtl ? 'قيد الانتظار:' : 'Pending:'}</span>
                      {unverifiedDomains.map(u => (
                        <span key={u.id} className="text-amber-700 font-mono">
                          {u.domain} ({u.status})
                        </span>
                      ))}
                      <button 
                        type="button" 
                        onClick={() => navigate('/settings/email?tab=domains')}
                        className="text-[#166534] underline font-semibold ml-1"
                      >
                        {isRtl ? 'تصحيح التوثيق' : 'Fix Verification'}
                      </button>
                    </div>
                  )}
                </div>

                {/* From Name */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    {isRtl ? 'اسم المرسل *' : 'From Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={fromName}
                    onChange={(e) => setFromName(e.target.value)}
                    placeholder={isRtl ? 'مثال: تسويق المنشأة' : 'e.g. Acme Marketing'}
                    className={cn("w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white", isRtl && "text-right")}
                  />
                </div>

                {/* From Email */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    {isRtl ? 'بريد المرسل *' : 'From Email *'}
                  </label>
                  <input
                    type="email"
                    required
                    value={fromEmail}
                    onChange={(e) => setFromEmail(e.target.value)}
                    placeholder="e.g. outreach@yourdomain.com"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-mono"
                    dir="ltr"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    {isRtl ? 'يجب أن يطابق نطاق الإرسال الموثق الخاص بك.' : 'Must match your verified sending domain.'}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                {isRtl ? 'نطاق الجمهور' : 'Audience Scope'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setAudienceType('all')}
                  className={`p-4 rounded-xl border transition-all ${isRtl ? 'text-right' : 'text-left'} ${
                    audienceType === 'all' 
                      ? 'border-[#166534] bg-[#F0FDF4]/30 ring-2 ring-indigo-600/10' 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <p className="font-bold text-slate-900 text-sm">
                    {isRtl ? 'جميع جهات اتصال النظام' : 'All CRM Contacts'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {isRtl ? 'الإرسال لجميع جهات الاتصال في النظام التي تمتلك عناوين بريد إلكتروني صالحة.' : 'Send to all contacts in your CRM with valid email addresses.'}
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setAudienceType('filtered')}
                  className={`p-4 rounded-xl border transition-all ${isRtl ? 'text-right' : 'text-left'} ${
                    audienceType === 'filtered' 
                      ? 'border-[#166534] bg-[#F0FDF4]/30 ring-2 ring-indigo-600/10' 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <p className="font-bold text-slate-900 text-sm">
                    {isRtl ? 'جمهور مخصص ومصنف' : 'Filtered / Segmented Audience'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {isRtl ? 'التصفية حسب عملاء أداة السحب، أو المجال، أو المدينة، أو تقييم الجودة.' : 'Filter by Scraper leads, Industry, City/Location, Quality Grade, or Score.'}
                  </p>
                </button>
              </div>
            </div>

            {audienceType === 'filtered' && (
              <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-4">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                  <Filter size={14} className="text-[#166534]" />
                  {isRtl ? 'تصفيات الجمهور (عملاء أداة السحب وجهات الاتصال)' : 'Audience Filters (Scraper & CRM Leads)'}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Category Dropdown (Requirement 17) */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      {isRtl ? 'تصنيف النظام' : 'CRM Category'}
                    </label>
                    <select
                      value={selectedCategoryId}
                      onChange={(e) => setSelectedCategoryId(e.target.value)}
                      className={cn("w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white", isRtl && "text-right")}
                    >
                      <option value="">{isRtl ? 'جميع التصنيفات' : 'All Categories'}</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Email History Filter (Requirement 14 & 17) */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      {isRtl ? 'سجل البريد الإلكتروني' : 'Email History'}
                    </label>
                    <select
                      value={emailHistoryFilter}
                      onChange={(e) => setEmailHistoryFilter(e.target.value as any)}
                      className={cn("w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-semibold text-slate-900", isRtl && "text-right")}
                    >
                      <option value="never_sent">{isRtl ? 'لم يتم الإرسال له من قبل (عملاء جدد)' : 'Never Sent (Cold Outreach)'}</option>
                      <option value="all">{isRtl ? 'جميع جهات الاتصال (بغض النظر عن السجل السابق)' : 'All Contacts (Regardless of prior emails)'}</option>
                      <option value="previously_sent">{isRtl ? 'أُرسل لهم سابقاً' : 'Previously Sent'}</option>
                      <option value="delivered">{isRtl ? 'تم التسليم لهم سابقاً' : 'Delivered Before'}</option>
                      <option value="bounced">{isRtl ? 'ارتد بريدهم سابقاً' : 'Bounced Before'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      {isRtl ? 'المصدر' : 'Source'}
                    </label>
                    <select
                      value={sourceFilter}
                      onChange={(e) => setSourceFilter(e.target.value)}
                      className={cn("w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white", isRtl && "text-right")}
                    >
                      <option value="">{isRtl ? 'جميع المصادر' : 'All Sources'}</option>
                      <option value="Business Scraper">{isRtl ? 'أداة سحب الأنشطة التجارية' : 'Business Scraper'}</option>
                      <option value="CRM">{isRtl ? 'نظام CRM اليدوي' : 'Manual CRM'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      {isRtl ? 'الكلمة المفتاحية للمجال' : 'Industry Keyword'}
                    </label>
                    <input
                      type="text"
                      value={industryFilter}
                      onChange={(e) => setIndustryFilter(e.target.value)}
                      placeholder={isRtl ? 'مثال: أسنان، عقارات، عيادات' : 'e.g. Dental, Real Estate, Clinic'}
                      className={cn("w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white", isRtl && "text-right")}
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      {isRtl ? 'المدينة / الموقع' : 'City / Location'}
                    </label>
                    <input
                      type="text"
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                      placeholder={isRtl ? 'مثال: الرياض، جدة، الدمام' : 'e.g. Lahore, Karachi, Islamabad'}
                      className={cn("w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white", isRtl && "text-right")}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-2">
                      {isRtl ? 'درجات جودة العميل' : 'Lead Quality Grades'}
                    </label>
                    <div className="flex gap-2">
                      {['A', 'B', 'C', 'D'].map((grade) => {
                        const isSelected = selectedGrades.includes(grade);
                        return (
                          <button
                            key={grade}
                            type="button"
                            onClick={() => {
                              setSelectedGrades(prev => 
                                isSelected ? prev.filter(g => g !== grade) : [...prev, grade]
                              );
                            }}
                            className={`w-10 h-9 rounded-xl font-bold text-xs border transition-all ${
                              isSelected 
                                ? 'bg-[#166534] text-white border-[#166534]' 
                                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            {grade}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-2">
                      {isRtl ? 'المتطلبات' : 'Requirements'}
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                      <input
                        type="checkbox"
                        checked={websiteAvailable}
                        onChange={(e) => setWebsiteAvailable(e.target.checked)}
                        className="rounded border-slate-300 text-[#166534] focus:ring-[#22C55E]"
                      />
                      {isRtl ? 'فقط من يمتلك موقعاً إلكترونياً' : 'Website Available Only'}
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Pre-Flight Audience summary */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                  {isRtl ? 'حصر قابلية تسليم الجمهور' : 'Audience Deliverability Count'}
                </h3>
                <p className="text-xs text-slate-500">
                  {isRtl ? 'يستبعد البريد غير الصالح، والملغين لاشتراكهم، وسجلات الحظر' : 'Excludes invalid emails, unsubscribes, and global suppression records'}
                </p>
              </div>
              <button
                type="button"
                onClick={runAudienceEstimate}
                disabled={isEstimating}
                className="flex items-center gap-1.5 text-xs font-bold text-[#166534] hover:text-[#14532d]"
              >
                <RefreshCw size={12} className={isEstimating ? 'animate-spin' : ''} />
                {isRtl ? 'تحديث العدد' : 'Refresh Count'}
              </button>
            </div>

            {estimate ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                      {isRtl ? 'جاهز للإرسال' : 'Ready to Send'}
                    </span>
                    <CheckCircle2 size={18} className="text-emerald-600" />
                  </div>
                  <p className="text-3xl font-extrabold text-emerald-700 mt-2">
                    {estimate.eligible_count.toLocaleString(isRtl ? 'ar-SA' : 'en-US')}
                  </p>
                  <p className="text-[11px] text-emerald-600 font-medium mt-1">
                    {isRtl ? 'مستلم ببريد إلكتروني صالح' : 'Valid email recipients'}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-800 uppercase tracking-wider">
                      {isRtl ? 'مستبعد بالتصفية' : 'Filtered Out'}
                    </span>
                    <ShieldCheck size={18} className="text-rose-600" />
                  </div>
                  <p className="text-3xl font-extrabold text-rose-700 mt-2">
                    {estimate.excluded_count.toLocaleString(isRtl ? 'ar-SA' : 'en-US')}
                  </p>
                  <div className="mt-2 text-[11px] text-rose-700 grid grid-cols-2 gap-x-3 gap-y-0.5">
                    <span>{isRtl ? 'بريد مفقود: ' : 'Missing email: '}<b>{estimate.reasons?.missing_email || 0}</b></span>
                    <span>{isRtl ? 'صيغة غير صحيحة: ' : 'Invalid syntax: '}<b>{estimate.reasons?.invalid_syntax || 0}</b></span>
                    <span>{isRtl ? 'إلغاء اشتراك: ' : 'Unsubscribed: '}<b>{estimate.reasons?.unsubscribed || 0}</b></span>
                    <span>{isRtl ? 'محظور / مستبعد: ' : 'Suppressed: '}<b>{estimate.reasons?.suppressed || 0}</b></span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-slate-400">
                {isRtl ? 'جارٍ تقييم الجمهور...' : 'Evaluating audience...'}
              </div>
            )}
          </div>
        </div>
      )}

      {/* STEP 2: COMPOSE MESSAGE (HEADER + ONLY BODY CHANGES + FOOTER) */}
      {currentStep === 'email' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            
            {/* 1. PROFESSIONAL TEMPLATE FRAME SELECTOR */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                    <Layout size={16} className="text-[#166534]" />
                    {isRtl ? 'اختر نمط القالب الاحترافي' : 'Select Professional Template Style'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isRtl ? 'الترويسة والتذييل منسقان ومحميان بهويتك، وما عليك سوى كتابة وتنسيق نص الرسالة!' : 'Header & Footer stay styled and branded. You only type and edit the message body!'}
                  </p>
                </div>
              </div>

              {/* Template Style Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {PROFESSIONAL_FRAMES.map((frame) => {
                  const isSelected = frame.id === selectedFrameId;
                  return (
                    <button
                      key={frame.id}
                      type="button"
                      onClick={() => handleSelectFrame(frame.id)}
                      className={`p-3.5 rounded-xl border transition-all ${isRtl ? 'text-right' : 'text-left'} ${
                        isSelected 
                          ? 'border-[#166534] bg-[#F0FDF4]/40 ring-2 ring-indigo-600/10 shadow-xs' 
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`w-3 h-3 rounded-full ${frame.accentBg}`} />
                        <span className="text-[10px] font-bold text-slate-400 uppercase">{frame.badge}</span>
                      </div>
                      <p className="font-bold text-xs text-slate-900 mt-2">{frame.name}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-2">{frame.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sender Info Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  {isRtl ? 'اسم المرسل *' : 'Your Name (Sender) *'}
                </label>
                <input
                  type="text"
                  value={fromName}
                  onChange={(e) => setFromName(e.target.value)}
                  placeholder={isRtl ? 'مثال: محمد السعيد' : 'e.g. Ali Khan'}
                  className={cn("w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white", isRtl && "text-right")}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  {isRtl ? 'بريد المرسل *' : 'Sender Email *'}
                </label>
                <input
                  type="email"
                  value={fromEmail}
                  onChange={(e) => setFromEmail(e.target.value)}
                  placeholder="e.g. sales@company.com"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-mono"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  {isRtl ? 'عنوان الرد (اختياري)' : 'Reply-To (Optional)'}
                </label>
                <input
                  type="email"
                  value={replyTo}
                  onChange={(e) => setReplyTo(e.target.value)}
                  placeholder="e.g. support@company.com"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-mono"
                  dir="ltr"
                />
              </div>
            </div>

            {/* SUBJECT LINE SECTION */}
            <div className="space-y-2 p-4 rounded-2xl bg-slate-50/80 border border-slate-200">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                {isRtl ? 'عنوان / موضوع البريد الإلكتروني *' : 'Email Subject Line *'}
              </label>

              <input
                ref={subjectInputRef}
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={isRtl ? 'مثال: استفسار سريع لـ {{first_name}} بخصوص {{business_name}}' : 'e.g. Quick question for {{first_name}} regarding {{business_name}}'}
                className={cn("w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-white font-medium text-slate-900", isRtl && "text-right")}
              />

              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className={cn("text-[11px] font-bold text-slate-500 flex items-center gap-1", isRtl ? "ml-1" : "mr-1")}>
                  <Plus size={12} className="text-[#166534]" /> {isRtl ? 'إدراج في الموضوع:' : 'Insert in Subject:'}
                </span>
                {[
                  { label: isRtl ? '+ الاسم' : '+ Name', tag: '{{first_name | default: "there"}}' },
                  { label: isRtl ? '+ اسم المنشأة' : '+ Business Name', tag: '{{business_name}}' },
                ].map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => insertTagIntoSubject(p.tag)}
                    className="px-2.5 py-0.5 rounded-lg bg-white border border-slate-200 hover:border-[#166534] text-[11px] font-semibold text-slate-700 shadow-2xs"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* DEEPSEEK AI BUTTON */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-purple-50/70 border border-purple-200">
              <div className="flex items-center gap-2.5">
                <Sparkles size={18} className="text-purple-600" />
                <span className="text-xs font-bold text-purple-950">
                  {isRtl ? 'تحتاج إلى أفكار ملهمة؟ دع الذكاء الاصطناعي يصيغ نص الرسالة لك.' : 'Need inspiration? Let AI write the message body for you.'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsAiModalOpen(true)}
                className="px-4 py-1.5 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 shadow-sm transition-all"
              >
                {isRtl ? 'كتابة بالذكاء الاصطناعي' : 'Write with AI'}
              </button>
            </div>

            {/* EMAIL TEMPLATE VISUAL COMPOSER (HEADER -> ONLY BODY EDITABLE -> FOOTER) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  {isRtl ? 'مساحة تصميم الرسالة' : 'Email Message Canvas'}
                </span>
                <span className="text-[11px] text-slate-400">
                  {isRtl ? 'الترويسة والتذييل محميان ومنسقان • اكتب فقط في مساحة النص البيضاء' : 'Header and Footer are locked and styled • Type only in the white body area'}
                </span>
              </div>

              {/* Formatting Toolbar */}
              <div className="p-2 rounded-xl bg-slate-100 border border-slate-200 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => applyVisualFormat('bold')}
                    className="p-1.5 rounded-lg hover:bg-white text-slate-700 border border-transparent hover:border-slate-200 font-bold"
                    title={isRtl ? 'عريض' : 'Bold'}
                  >
                    <Bold size={15} />
                  </button>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => applyVisualFormat('italic')}
                    className="p-1.5 rounded-lg hover:bg-white text-slate-700 border border-transparent hover:border-slate-200"
                    title={isRtl ? 'مائل' : 'Italic'}
                  >
                    <Italic size={15} />
                  </button>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => applyVisualFormat('underline')}
                    className="p-1.5 rounded-lg hover:bg-white text-slate-700 border border-transparent hover:border-slate-200"
                    title={isRtl ? 'تسطير' : 'Underline'}
                  >
                    <Underline size={15} />
                  </button>
                  <div className="h-4 w-px bg-slate-300 mx-1" />
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => applyVisualFormat('insertUnorderedList')}
                    className="p-1.5 rounded-lg hover:bg-white text-slate-700 border border-transparent hover:border-slate-200"
                    title={isRtl ? 'قائمة نقطية' : 'Bullet List'}
                  >
                    <List size={15} />
                  </button>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => applyVisualFormat('insertOrderedList')}
                    className="p-1.5 rounded-lg hover:bg-white text-slate-700 border border-transparent hover:border-slate-200"
                    title={isRtl ? 'قائمة رقمية' : 'Numbered List'}
                  >
                    <ListOrdered size={15} />
                  </button>
                  <div className="h-4 w-px bg-slate-300 mx-1" />
                  
                  {/* Content Alignment Buttons */}
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => applyVisualFormat('justifyLeft')}
                    className="p-1.5 rounded-lg hover:bg-white text-slate-700 border border-transparent hover:border-slate-200"
                    title={isRtl ? 'محاذاة لليسار' : 'Align Left'}
                  >
                    <AlignLeft size={15} />
                  </button>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => applyVisualFormat('justifyCenter')}
                    className="p-1.5 rounded-lg hover:bg-white text-slate-700 border border-transparent hover:border-slate-200"
                    title={isRtl ? 'محاذاة للوسط' : 'Align Center'}
                  >
                    <AlignCenter size={15} />
                  </button>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => applyVisualFormat('justifyRight')}
                    className="p-1.5 rounded-lg hover:bg-white text-slate-700 border border-transparent hover:border-slate-200"
                    title={isRtl ? 'محاذاة لليمين' : 'Align Right'}
                  >
                    <AlignRight size={15} />
                  </button>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => applyVisualFormat('justifyFull')}
                    className="p-1.5 rounded-lg hover:bg-white text-slate-700 border border-transparent hover:border-slate-200"
                    title={isRtl ? 'ضبط المحاذاة' : 'Justify'}
                  >
                    <AlignJustify size={15} />
                  </button>

                  <div className="h-4 w-px bg-slate-300 mx-1" />
                  
                  {/* Insert CTA button */}
                  <button
                    type="button"
                    onMouseDown={() => saveVisualEditorSelection()}
                    onClick={handleOpenButtonModal}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-slate-200 hover:border-[#166534] text-xs font-bold text-slate-700 shadow-2xs transition-all hover:bg-slate-50"
                  >
                    <MousePointerClick size={14} className="text-[#166534]" />
                    <span>{isRtl ? '+ إضافة زر إجراء' : '+ Add Button'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-1 text-[11px] text-slate-500">
                  <span className="font-semibold">{isRtl ? 'إدراج وسم:' : 'Insert Tag:'}</span>
                  {[
                    { label: isRtl ? 'الاسم' : 'Name', tag: '{{first_name | default: "there"}}' },
                    { label: isRtl ? 'اسم المنشأة' : 'Business Name', tag: '{{business_name}}' },
                  ].map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => insertTagIntoBody(item.tag)}
                      className="px-2 py-0.5 rounded bg-white border border-slate-200 hover:border-[#166534] font-medium text-[#14532d]"
                    >
                      + {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* VISUAL EMAIL CANVAS CONTAINER */}
              <div className="p-6 rounded-2xl bg-slate-100 flex justify-center">
                <div className="w-full max-w-2xl bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
                  
                  {/* 1. LOCKED PROFESSIONAL HEADER */}
                  <div className="relative group select-none">
                    <div 
                      dangerouslySetInnerHTML={{ __html: activeFrame.renderHeader(fromName) }} 
                    />
                    <div className={cn(
                      "absolute top-2 bg-black/60 backdrop-blur-xs text-white px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1",
                      isRtl ? "left-2" : "right-2"
                    )}>
                      <Lock size={10} />
                      {isRtl ? 'ترويسة معتمدة' : 'Header Frame'}
                    </div>
                  </div>

                  {/* 2. EDITABLE BODY (THE ONLY PART THE USER CHANGES!) */}
                  <div className="p-6 sm:p-8 bg-white relative">
                    <div className="mb-2 flex items-center justify-between text-[11px] text-[#14532d] font-bold bg-[#F0FDF4]/80 px-3 py-1 rounded-lg border border-[#bbf7d0] select-none">
                      <span className="flex items-center gap-1.5">
                        <Type size={13} />
                        {isRtl ? 'محتوى رسالتك (انقر بالأسفل للكتابة بحرية)' : 'Your Message Body (Click below to edit freely)'}
                      </span>
                      <span className="text-[#22C55E] font-normal">
                        {isRtl ? 'تنسيق تلقائي متوافق مع Gmail وOutlook' : 'Auto-formats for Gmail & Outlook'}
                      </span>
                    </div>

                    <div
                      ref={visualBodyEditorRef}
                      contentEditable
                      onInput={() => {
                        if (visualBodyEditorRef.current) {
                          setUserBodyMessage(visualBodyEditorRef.current.innerHTML);
                        }
                      }}
                      className={cn(
                        "email-canvas-body min-h-[280px] text-slate-800 text-sm leading-relaxed focus:outline-none py-2",
                        isRtl && "text-right font-arabic"
                      )}
                      style={{ minHeight: '260px' }}
                      dir={isRtl ? "rtl" : "ltr"}
                    />
                  </div>

                  {/* 3. LOCKED PROFESSIONAL COMPLIANCE FOOTER */}
                  <div className="relative group select-none">
                    <div 
                      dangerouslySetInnerHTML={{ __html: activeFrame.renderFooter(fromName) }} 
                    />
                    <div className={cn(
                      "absolute bottom-2 bg-slate-200 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1",
                      isRtl ? "left-2" : "right-2"
                    )}>
                      <Lock size={10} />
                      {isRtl ? 'تذييل الامتثال' : 'Compliance Footer'}
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* STEP 3: PERSONALIZATION & LIVE PREVIEW */}
      {currentStep === 'personalization' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <Sparkles size={20} className="text-[#166534]" />
                  {isRtl ? 'محاكي التخصيص' : 'Personalization Simulator'}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isRtl 
                    ? 'تحقق من مظهر بريدك الكامل (الترويسة + النص المخصص + التذييل) لجهات الاتصال الحقيقية في قائمتك.'
                    : 'Check how your assembled email (Header + Personalized Body + Footer) looks for real contacts in your list.'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
                  <CheckCheck size={14} className="text-emerald-600" />
                  {isRtl ? `${detectedMergeTags.length} حقول مخصصة` : `${detectedMergeTags.length} Personalized Fields`}
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-[#F0FDF4] border border-[#bbf7d0] text-[#12263A] text-xs font-bold flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-[#166534]" />
                  {activeFrame.name} {isRtl ? 'قالب نشط' : 'Frame Active'}
                </span>
              </div>
            </div>

            {/* Recipient Picker */}
            <div className="space-y-2 p-5 rounded-2xl bg-gradient-to-r from-slate-50 via-[#F0FDF4]/50 to-slate-50 border border-slate-200">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <Users size={14} className="text-[#166534]" />
                {isRtl ? 'اختر مستلماً للاختبار:' : 'Select a Recipient to Test:'}
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
                {sampleContactsList.map((contact, idx) => {
                  const isSelected = selectedSampleIndex === idx;
                  const isEdgeCase = contact.id === 'sample-missing';
                  return (
                    <button
                      key={contact.id || idx}
                      type="button"
                      onClick={() => setSelectedSampleIndex(idx)}
                      className={`p-3 rounded-xl border transition-all ${isRtl ? 'text-right' : 'text-left'} ${
                        isSelected 
                          ? 'border-[#166534] bg-white ring-2 ring-indigo-600/10 shadow-sm' 
                          : 'border-slate-200 bg-white/70 hover:border-slate-300 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {contact.name || (isEdgeCase 
                            ? (isRtl ? '⚠️ اختبار بيانات غير مكتملة' : '⚠️ Incomplete Info Test') 
                            : (isRtl ? 'جهة اتصال بدون اسم' : 'Unnamed Contact'))}
                        </span>
                        {contact.lead_quality_grade && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-[#dcfce7] text-[#14532d]">
                            {isRtl ? `درجة ${contact.lead_quality_grade}` : `Grade ${contact.lead_quality_grade}`}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 truncate">
                        {contact.company || (isRtl ? '(بدون اسم منشأة)' : '(No Business Name)')}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-400">
                        <span className="truncate" dir="ltr">{contact.email}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* LIVE DEVICE SIMULATOR */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Eye size={14} className="text-[#166534]" />
                    {isRtl ? 'كيف يرى المستلم رسالتك:' : 'How Your Recipient Sees It:'}
                  </span>
                  
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-600 select-none">
                    <input
                      type="checkbox"
                      checked={highlightVariables}
                      onChange={(e) => setHighlightVariables(e.target.checked)}
                      className="rounded border-slate-300 text-[#166534] focus:ring-[#22C55E]"
                    />
                    {isRtl ? 'تمييز الكلمات المخصصة' : 'Highlight Personalized Words'}
                  </label>
                </div>

                <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('desktop')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      previewDevice === 'desktop' ? 'bg-[#166534] text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Monitor size={13} />
                    {isRtl ? 'معاينة سطح المكتب' : 'Desktop View'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('mobile')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      previewDevice === 'mobile' ? 'bg-[#166534] text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Smartphone size={13} />
                    {isRtl ? 'معاينة الجوال (375 بكسل)' : 'Mobile (375px)'}
                  </button>
                </div>
              </div>

              {/* SIMULATOR CANVAS */}
              <div className="p-6 rounded-2xl bg-slate-100 flex justify-center items-center min-h-[380px]">
                <div className={`transition-all duration-300 bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden flex flex-col ${
                  previewDevice === 'desktop' ? 'w-full max-w-2xl' : 'w-[375px] max-w-full'
                }`}>
                  {/* Email Header */}
                  <div className={cn("p-4 bg-slate-50 border-b border-slate-100 space-y-2 text-xs", isRtl && "text-right")}>
                    <div className="space-y-1">
                      <div className="flex items-baseline gap-2">
                        <span className="text-slate-400 font-medium w-14">{isRtl ? 'من:' : 'From:'}</span>
                        <span className="font-semibold text-slate-800">{fromName} &lt;{fromEmail || 'you@domain.com'}&gt;</span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-slate-400 font-medium w-14">{isRtl ? 'إلى:' : 'To:'}</span>
                        <span className="font-semibold text-slate-800" dir="ltr">{activeContact.email}</span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-slate-400 font-medium w-14">{isRtl ? 'الموضوع:' : 'Subject:'}</span>
                        <span 
                          className="font-bold text-slate-900"
                          dangerouslySetInnerHTML={{ 
                            __html: renderPersonalizedText(subject, activeVariables, highlightVariables) 
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Rendered Full Email Body Canvas */}
                  <div 
                    className={cn(
                      "p-6 flex-1 overflow-y-auto prose prose-sm max-w-none text-slate-800 text-xs leading-relaxed",
                      isRtl && "text-right"
                    )}
                    dangerouslySetInnerHTML={{ 
                      __html: renderPersonalizedText(fullAssembledEmailHtml, activeVariables, highlightVariables) 
                    }} 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: REVIEW & TEST */}
      {currentStep === 'preview_test' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              <div className="p-4 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  {isRtl ? `المعاينة النهائية للبريد (${activeFrame.name})` : `Final Email Preview (${activeFrame.name})`}
                </span>
                <span className="text-xs text-slate-500">
                  {isRtl ? 'المستلم: ' : 'Recipient: '}<strong>{activeContact.name || activeContact.email}</strong>
                </span>
              </div>

              <div className="p-6 space-y-4 flex-1">
                <div className={cn("p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1", isRtl && "text-right")}>
                  <div><span className="text-slate-400 font-medium">{isRtl ? 'من:' : 'From:'}</span> <span className="font-bold text-slate-800">{fromName} &lt;{fromEmail}&gt;</span></div>
                  <div><span className="text-slate-400 font-medium">{isRtl ? 'إلى:' : 'To:'}</span> <span className="font-bold text-slate-800" dir="ltr">{activeContact.email}</span></div>
                  <div>
                    <span className="text-slate-400 font-medium">{isRtl ? 'الموضوع:' : 'Subject:'}</span>{' '}
                    <span className="font-bold text-slate-900">
                      {renderPersonalizedText(subject, activeVariables, false)}
                    </span>
                  </div>
                </div>

                <div 
                  className={cn(
                    "prose prose-sm max-w-none p-4 rounded-xl border border-slate-100 bg-white min-h-[260px]",
                    isRtl && "text-right"
                  )}
                  dangerouslySetInnerHTML={{ 
                    __html: renderPersonalizedText(fullAssembledEmailHtml, activeVariables, false) 
                  }} 
                />
              </div>
            </div>

            {/* Send Live Test Email */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 h-fit">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Send size={16} className="text-[#166534]" />
                {isRtl ? 'إرسال بريد تجريبي حي' : 'Send a Live Test Email'}
              </h3>
              <p className="text-xs text-slate-500">
                {isRtl 
                  ? 'أرسل نسخة تجريبية إلى صندوق بريدك لمعاينتها بدقة قبل الإطلاق.'
                  : 'Send a test copy to your inbox to check how it looks before launching.'}
              </p>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  {isRtl ? 'عنوان بريدك الإلكتروني' : 'Your Email Address'}
                </label>
                <input
                  type="email"
                  value={testEmailAddress}
                  onChange={(e) => setTestEmailAddress(e.target.value)}
                  placeholder="you@example.com"
                  className={cn("w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#22C55E]/20", isRtl && "text-right")}
                  dir="ltr"
                />
              </div>

              <button
                type="button"
                onClick={handleSendTest}
                disabled={isSendingTest}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                {isSendingTest ? <RefreshCw size={14} className="animate-spin" /> : <Send size={14} />}
                {isRtl ? 'إرسال بريد تجريبي' : 'Send Test Email'}
              </button>

              {testSentSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  <span>{isRtl ? 'تم إرسال البريد التجريبي بنجاح!' : 'Test email sent successfully!'}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* STEP 5: LAUNCH */}
      {currentStep === 'schedule_send' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              {isRtl ? 'مراجعة وإطلاق الحملة' : 'Review & Launch Campaign'}
            </h2>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 font-semibold uppercase">{isRtl ? 'الحملة:' : 'Campaign:'}</span>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">{name || (isRtl ? '(حملة بدون عنوان)' : '(Untitled Campaign)')}</p>
                </div>

                <div>
                  <span className="text-slate-400 font-semibold uppercase">{isRtl ? 'قالب التنسيق:' : 'Template Frame:'}</span>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">{activeFrame.name} ({activeFrame.badge})</p>
                </div>

                <div>
                  <span className="text-slate-400 font-semibold uppercase">{isRtl ? 'المرسل:' : 'From:'}</span>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">{fromName} &lt;{fromEmail}&gt;</p>
                </div>

                <div>
                  <span className="text-slate-400 font-semibold uppercase">{isRtl ? 'الموضوع:' : 'Subject:'}</span>
                  <p className="font-bold text-slate-900 text-sm mt-0.5 truncate">{subject}</p>
                </div>
              </div>

              {estimate && (
                <div className="pt-3 border-t border-slate-200 flex items-center gap-6 text-xs font-bold">
                  <span className="text-emerald-700">
                    {isRtl ? 'المستلمون الجاهزون: ' : 'Recipients Ready: '}{estimate.eligible_count.toLocaleString(isRtl ? 'ar-SA' : 'en-US')}
                  </span>
                  <span className="text-rose-600">
                    {isRtl ? 'المستبعدون: ' : 'Excluded: '}{estimate.excluded_count.toLocaleString(isRtl ? 'ar-SA' : 'en-US')}
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                {isRtl ? 'خيارات الإرسال' : 'Send Options'}
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setSendOption('now')}
                  className={`p-4 rounded-xl border transition-all ${isRtl ? 'text-right' : 'text-left'} ${
                    sendOption === 'now' 
                      ? 'border-[#166534] bg-[#F0FDF4]/30 ring-2 ring-indigo-600/10' 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <p className="font-bold text-slate-900 text-sm">{isRtl ? 'الإرسال الآن' : 'Send Now'}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {isRtl ? 'بدء التسليم الفوري في الخلفية.' : 'Start delivery immediately in the background.'}
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setSendOption('schedule')}
                  className={`p-4 rounded-xl border transition-all ${isRtl ? 'text-right' : 'text-left'} ${
                    sendOption === 'schedule' 
                      ? 'border-[#166534] bg-[#F0FDF4]/30 ring-2 ring-indigo-600/10' 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <p className="font-bold text-slate-900 text-sm">{isRtl ? 'الجدولة لوقت لاحق' : 'Schedule for Later'}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {isRtl ? 'تحديد تاريخ ووقت محددين.' : 'Choose a specific date and time.'}
                  </p>
                </button>
              </div>
            </div>

            {sendOption === 'schedule' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    {isRtl ? 'التاريخ *' : 'Date *'}
                  </label>
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    {isRtl ? 'الوقت *' : 'Time *'}
                  </label>
                  <input
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={prevStep}
          disabled={currentStepIdx === 0}
          className={`flex items-center gap-2 h-10 px-5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-semibold text-slate-700 hover:bg-[#F0FDF4] hover:text-[#166534] hover:border-[#bbf7d0] transition-all shadow-xs active:scale-95 cursor-pointer ${
            currentStepIdx === 0 ? 'opacity-40 cursor-not-allowed' : ''
          }`}
        >
          {isRtl ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
          {isRtl ? 'السابق' : 'Back'}
        </button>

        {currentStepIdx < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={nextStep}
            className="flex items-center gap-2 h-10 px-6 rounded-xl bg-[#166534] text-white text-xs sm:text-sm font-semibold hover:bg-[#14532d] transition-all shadow-sm hover:shadow-[#166534]/15 active:scale-95 cursor-pointer"
          >
            {isRtl ? 'المتابعة' : 'Continue'}
            {isRtl ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => handleLaunchCampaign(false)}
            disabled={isLaunching}
            className="flex items-center gap-2 h-10 px-8 rounded-xl bg-[#166534] text-white text-xs sm:text-sm font-semibold hover:bg-[#14532d] transition-all shadow-sm hover:shadow-[#166534]/15 active:scale-95 cursor-pointer disabled:opacity-50"
          >
            {isLaunching ? (
              <RefreshCw size={16} className="animate-spin" />
            ) : sendOption === 'now' ? (
              <Send size={16} />
            ) : (
              <Calendar size={16} />
            )}
            {sendOption === 'now' 
              ? (isRtl ? 'إطلاق الحملة الآن' : 'Launch Campaign Now') 
              : (isRtl ? 'جدولة الحملة' : 'Schedule Campaign')}
          </button>
        )}
      </div>

      {/* DEEPSEEK AI MODAL */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden ${isRtl ? 'font-arabic text-right' : 'text-left'}`} dir={isRtl ? 'rtl' : 'ltr'}>
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-[#F0FDF4] via-[#FAFAF9] to-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-lg shadow-purple-600/30 shrink-0">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    {isRtl ? 'كاتب البريد بالذكاء الاصطناعي' : 'AI Email Writer'}
                    <span className="px-2 py-0.5 rounded-full text-[9px] bg-purple-100 text-purple-700 font-extrabold uppercase">
                      {isRtl ? 'محرك الذكاء الاصطناعي' : 'AI Engine'}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isRtl ? 'صف ما تريد قوله، وسيتولى الذكاء الاصطناعي صياغة محتوى الرسالة' : 'Describe what you want to say, AI writes your message body'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsAiModalOpen(false)}
                className="w-8 h-8 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-all"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto flex-1">

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {isRtl ? 'عن ماذا تدور هذه الرسالة؟ *' : 'What is this email about? *'}
                </label>
                <textarea
                  rows={3}
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  placeholder={isRtl 
                    ? 'مثال: التواصل مع العيادات الطبية لعرض برنامج تنظيم المواعيد وتقليل التخلف عن الحضور بنسبة 40%.'
                    : 'e.g. Outreach to clinics offering our booking software to reduce missed appointments by 40%.'}
                  className="w-full p-3.5 text-xs rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {isRtl ? 'الهدف / الغرض' : 'Goal / Purpose'}
                  </label>
                  <select
                    value={aiPurpose}
                    onChange={(e) => setAiPurpose(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Cold Outreach">{isRtl ? 'تواصل مع عملاء جدد (Cold Outreach)' : 'Cold Outreach'}</option>
                    <option value="Follow-up">{isRtl ? 'متابعة وتذكير (Follow-up)' : 'Follow-up'}</option>
                    <option value="Product Promotion">{isRtl ? 'عرض ترويجي خاص (Special Offer)' : 'Special Offer'}</option>
                    <option value="Appointment Request">{isRtl ? 'طلب اجتماع أو موعد (Meeting Request)' : 'Meeting Request'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {isRtl ? 'نبرة الخطاب' : 'Tone'}
                  </label>
                  <select
                    value={aiTone}
                    onChange={(e) => setAiTone(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Professional and Persuasive">{isRtl ? 'مهني ومقنع' : 'Professional & Persuasive'}</option>
                    <option value="Warm and Friendly">{isRtl ? 'ودود ودافئ' : 'Warm & Friendly'}</option>
                    <option value="Short and Direct">{isRtl ? 'موجز ومباشر' : 'Short & Direct'}</option>
                  </select>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGenerateWithAi}
                disabled={isGeneratingAi}
                className="w-full py-3 px-5 rounded-2xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20 disabled:opacity-50"
              >
                {isGeneratingAi ? (
                  <>
                    <RefreshCw size={15} className="animate-spin" />
                    {isRtl ? 'جارٍ صياغة الرسالة بواسطة الذكاء الاصطناعي...' : 'AI is writing your email...'}
                  </>
                ) : (
                  <>
                    <Sparkles size={15} />
                    {isRtl ? 'توليد الرسالة بالذكاء الاصطناعي' : 'Generate Message with AI'}
                  </>
                )}
              </button>

              {aiGeneratedResult && (
                <div className="p-5 rounded-2xl border border-purple-200 bg-purple-50/30 space-y-3">
                  <div className="p-3 bg-white rounded-xl border border-purple-100 text-xs flex items-center gap-2">
                    <span className="text-slate-400 font-semibold">{isRtl ? 'الموضوع: ' : 'Subject: '}</span>
                    <span className="font-bold text-slate-900">{aiGeneratedResult.subject}</span>
                  </div>

                  <div 
                    className="prose prose-sm max-w-none p-4 rounded-xl border border-purple-100 bg-white text-xs text-slate-700 max-h-56 overflow-y-auto"
                    dangerouslySetInnerHTML={{ __html: aiGeneratedResult.html_body }}
                  />

                  <div className={`flex items-center ${isRtl ? 'justify-start' : 'justify-end'} gap-3 pt-2`}>
                    <button
                      type="button"
                      onClick={applyAiGeneratedEmail}
                      className="px-6 py-2.5 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 shadow-md shadow-purple-600/20 flex items-center gap-2"
                    >
                      <Check size={14} />
                      {isRtl ? 'إدراج في نص الرسالة' : 'Insert into Message Body'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CTA BUTTON MODAL */}
      {isButtonModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full flex flex-col overflow-hidden ${isRtl ? 'font-arabic text-right' : 'text-left'}`} dir={isRtl ? 'rtl' : 'ltr'}>
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-[#F0FDF4] via-[#FAFAF9] to-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#166534] text-white flex items-center justify-center shadow-lg shadow-[#166534]/20 shrink-0">
                  <MousePointerClick size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    {isRtl ? 'إدراج زر دعوة لاتخاذ إجراء' : 'Insert Call-to-Action Button'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isRtl ? 'زر بريدي متوافق تماماً مع Gmail وOutlook وApple Mail' : 'Bulletproof email button compatible with Gmail, Outlook & Apple Mail'}
                  </p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setIsButtonModalOpen(false)}
                className="w-8 h-8 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-all"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleInsertButtonSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {isRtl ? 'نص الزر *' : 'Button Text *'}
                </label>
                <input
                  type="text"
                  required
                  value={buttonText}
                  onChange={(e) => setButtonText(e.target.value)}
                  placeholder={isRtl ? 'مثال: حجز مكالمة 10 دقائق' : 'e.g. Schedule a 10-Minute Call'}
                  className="w-full px-3.5 py-2.5 text-xs font-medium rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#22C55E]/20 focus:border-[#166534]"
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase py-0.5">
                    {isRtl ? 'نماذج جاهزة:' : 'Presets:'}
                  </span>
                  {(isRtl ? [
                    'حجز مكالمة 10 دقائق',
                    'طلب استشارة مجانية',
                    'الاستفادة من العرض الخاص',
                    'زيارة الموقع الإلكتروني',
                    'عرض سابقة الأعمال'
                  ] : [
                    'Schedule a 10-Minute Call',
                    'Book Free Consultation',
                    'Claim Special Offer',
                    'Visit Website',
                    'View Portfolio'
                  ]).map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setButtonText(preset)}
                      className="px-2 py-0.5 text-[10px] rounded-md bg-slate-100 hover:bg-[#F0FDF4] hover:text-[#166534] text-slate-600 font-medium transition-all"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {isRtl ? 'رابط وجهة الزر (URL) *' : 'Button Destination Link (URL) *'}
                </label>
                <div className="relative">
                  <ExternalLink size={14} className={`absolute ${isRtl ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2 text-slate-400`} />
                  <input
                    type="url"
                    required
                    value={buttonUrl}
                    onChange={(e) => setButtonUrl(e.target.value)}
                    placeholder="https://calendly.com/your-name/meeting"
                    dir="ltr"
                    className={`w-full ${isRtl ? 'pr-10 pl-3.5 text-right' : 'pl-10 pr-3.5 text-left'} py-2.5 text-xs font-medium rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#22C55E]/20 focus:border-[#166534]`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {isRtl ? 'لون الزر' : 'Button Color'}
                  </label>
                  <div className="flex items-center gap-2">
                    {[
                      { name: 'Blue', nameAr: 'أزرق', color: '#2563eb' },
                      { name: 'Indigo', nameAr: 'نيلي', color: '#4f46e5' },
                      { name: 'Green', nameAr: 'أخضر', color: '#059669' },
                      { name: 'Dark', nameAr: 'داكن', color: '#0f172a' },
                      { name: 'Purple', nameAr: 'بنفسجي', color: '#7c3aed' },
                      { name: 'Rose', nameAr: 'وردي', color: '#e11d48' },
                    ].map((col) => (
                      <button
                        key={col.color}
                        type="button"
                        onClick={() => setButtonColor(col.color)}
                        className={`w-7 h-7 rounded-full border-2 transition-transform ${
                          buttonColor === col.color ? 'scale-115 border-slate-900 shadow-sm' : 'border-white hover:scale-105'
                        }`}
                        style={{ backgroundColor: col.color }}
                        title={isRtl ? col.nameAr : col.name}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {isRtl ? 'المحاذاة' : 'Alignment'}
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setButtonAlign('left')}
                      className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold border transition-all ${
                        buttonAlign === 'left'
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {isRtl ? 'البداية' : 'Left'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setButtonAlign('center')}
                      className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold border transition-all ${
                        buttonAlign === 'center'
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {isRtl ? 'توسيط' : 'Center'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Live Button Preview */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  {isRtl ? 'معاينة في البريد:' : 'Preview in Email:'}
                </span>
                <div style={{ textAlign: buttonAlign }}>
                  <span
                    style={{
                      display: 'inline-block',
                      backgroundColor: buttonColor,
                      color: '#ffffff',
                      padding: '10px 24px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 'bold',
                      fontFamily: isRtl ? 'Cairo, sans-serif' : 'sans-serif'
                    }}
                  >
                    {buttonText || (isRtl ? 'نص الزر' : 'Button Text')} {isRtl ? '←' : '→'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsButtonModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-all"
                >
                  {isRtl ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#166534] text-white text-xs font-bold hover:bg-[#14532d] transition-all shadow-md shadow-[#166534]/20 flex items-center gap-1.5"
                >
                  <Plus size={14} />
                  <span>{isRtl ? 'إدراج الزر' : 'Insert Button'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
