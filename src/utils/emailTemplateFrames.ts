// Shared Email Template Frames & Themes for Campaign Builders and AI Marketing Agent

export interface EmailFrame {
  id: string;
  name: string;
  nameAr?: string;
  badge: string;
  badgeAr?: string;
  accentBg: string;
  accentBorder: string;
  description: string;
  descriptionAr?: string;
  category?: string;
  defaultSubject: string;
  defaultSubjectAr?: string;
  defaultBody: string;
  defaultBodyAr?: string;
  renderHeader: (fromName: string, isRtl?: boolean) => string;
  renderFooter: (fromName: string, isRtl?: boolean) => string;
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
    accentBg: 'bg-indigo-600',
    accentBorder: 'border-indigo-500',
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

export function assembleFullEmailHtml(
  frame: EmailFrame, 
  userBodyHtml: string, 
  fromName: string,
  isRtl: boolean = false
): string {
  const dir = isRtl ? 'rtl' : 'ltr';
  const align = isRtl ? 'right' : 'left';
  return `
<table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 30px 15px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; direction: ${dir};">
  <tr>
    <td align="center">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); direction: ${dir};">
        <tr>
          <td>
            ${frame.renderHeader(fromName, isRtl)}
          </td>
        </tr>
        <tr>
          <td style="padding: 36px 32px; color: #334155; font-size: 15px; line-height: 1.6; text-align: ${align}; direction: ${dir};">
            ${userBodyHtml}
          </td>
        </tr>
        <tr>
          <td>
            ${frame.renderFooter(fromName, isRtl)}
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`.trim();
}

// -------------------------------------------------------------
// AI Marketing Agent Template Themes & Helpers
// -------------------------------------------------------------

export interface EmailTemplateTheme {
  id: string;
  name: string;
  badge: string;
  primaryColor: string;
  accentBg: string;
  headerBg: string;
  headerTextColor: string;
  buttonBg: string;
  buttonTextColor: string;
  description: string;
}

export const EMAIL_TEMPLATE_THEMES: EmailTemplateTheme[] = [
  {
    id: 'executive',
    name: 'Modern Executive',
    badge: 'Navy & Blue',
    primaryColor: '#2563eb',
    accentBg: '#0f172a',
    headerBg: '#0f172a',
    headerTextColor: '#ffffff',
    buttonBg: '#2563eb',
    buttonTextColor: '#ffffff',
    description: 'Crisp executive letterhead with dark navy header, verified business badge, and polished typography.'
  },
  {
    id: 'saas',
    name: 'Tech & SaaS',
    badge: 'Indigo Gradient',
    primaryColor: '#4f46e5',
    accentBg: '#4f46e5',
    headerBg: 'linear-gradient(135deg, #4338ca 0%, #6366f1 100%)',
    headerTextColor: '#ffffff',
    buttonBg: '#4f46e5',
    buttonTextColor: '#ffffff',
    description: 'High-converting SaaS product aesthetic with subtle gradients and modern pill call-to-action.'
  },
  {
    id: 'minimal',
    name: 'Clean Minimalist',
    badge: 'Monochrome',
    primaryColor: '#0f172a',
    accentBg: '#f8fafc',
    headerBg: '#ffffff',
    headerTextColor: '#0f172a',
    buttonBg: '#0f172a',
    buttonTextColor: '#ffffff',
    description: 'Distraction-free editorial layout focusing purely on concise copy and direct value proposition.'
  },
  {
    id: 'emerald',
    name: 'Emerald Growth',
    badge: 'Forest & Gold',
    primaryColor: '#059669',
    accentBg: '#064e3b',
    headerBg: '#064e3b',
    headerTextColor: '#ffffff',
    buttonBg: '#059669',
    buttonTextColor: '#ffffff',
    description: 'Trust-building growth layout with deep emerald accents and credibility badges.'
  }
];

/**
 * Clean and normalize raw email body paragraphs so they don't contain duplicate outer frames
 */
export function extractBodyContent(rawHtml: string): string {
  if (!rawHtml) return '';
  
  // If the rawHtml is already wrapped in our frame, extract the inner content container
  if (rawHtml.includes('<!-- EMAIL_BODY_START -->') && rawHtml.includes('<!-- EMAIL_BODY_END -->')) {
    const match = rawHtml.match(/<!-- EMAIL_BODY_START -->([\s\S]*?)<!-- EMAIL_BODY_END -->/);
    if (match && match[1]) {
      return match[1].trim();
    }
  }

  // Remove existing outer html/body tags if present
  let cleaned = rawHtml
    .replace(/<!DOCTYPE html>/gi, '')
    .replace(/<html[^>]*>([\s\S]*?)<\/html>/gi, '$1')
    .replace(/<body[^>]*>([\s\S]*?)<\/body>/gi, '$1')
    .replace(/<head>[\s\S]*?<\/head>/gi, '')
    .trim();

  return cleaned;
}

export function renderThemeHeader(themeId: string = 'executive', companyName: string = 'Our Company'): string {
  if (themeId === 'executive') {
    return `
      <div style="background-color: #0f172a; padding: 28px 36px; border-bottom: 3px solid #3b82f6; border-radius: 12px 12px 0 0;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
          <tr>
            <td>
              <span style="color: #ffffff; font-size: 18px; font-weight: 800; letter-spacing: -0.3px; text-transform: uppercase; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">${companyName}</span>
              <span style="display: block; color: #94a3b8; font-size: 12px; margin-top: 3px; font-weight: 500; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">Executive Advisory & Solutions</span>
            </td>
            <td align="right">
              <span style="display: inline-block; background-color: rgba(59, 130, 246, 0.2); color: #60a5fa; font-size: 11px; font-weight: 700; padding: 5px 14px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">Verified Outreach</span>
            </td>
          </tr>
        </table>
      </div>`;
  } else if (themeId === 'saas') {
    return `
      <div style="background: linear-gradient(135deg, #4338ca 0%, #6366f1 100%); padding: 30px 36px; border-radius: 12px 12px 0 0; text-align: left;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
          <tr>
            <td>
              <div style="display: inline-block; background: rgba(255,255,255,0.15); padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; color: #ffffff; text-transform: uppercase; margin-bottom: 8px;">
                Platform Solutions
              </div>
              <h2 style="margin: 0; color: #ffffff; font-size: 20px; font-weight: 800; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">${companyName}</h2>
            </td>
            <td align="right">
              <span style="color: rgba(255,255,255,0.85); font-size: 12px; font-weight: 600;">Personal Invitation</span>
            </td>
          </tr>
        </table>
      </div>`;
  } else if (themeId === 'emerald') {
    return `
      <div style="background-color: #064e3b; padding: 28px 36px; border-bottom: 3px solid #10b981; border-radius: 12px 12px 0 0;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
          <tr>
            <td>
              <span style="color: #ffffff; font-size: 18px; font-weight: 800; text-transform: uppercase; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">${companyName}</span>
              <span style="display: block; color: #a7f3d0; font-size: 12px; margin-top: 3px; font-weight: 500;">Growth & Automation Advisory</span>
            </td>
            <td align="right">
              <span style="display: inline-block; background-color: rgba(16, 185, 129, 0.25); color: #6ee7b7; font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 20px; text-transform: uppercase;">Direct Line</span>
            </td>
          </tr>
        </table>
      </div>`;
  } else {
    // Minimalist
    return `
      <div style="background-color: #ffffff; padding: 24px 36px 16px 36px; border-bottom: 2px solid #e2e8f0; border-radius: 12px 12px 0 0;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
          <tr>
            <td>
              <span style="color: #0f172a; font-size: 16px; font-weight: 800; letter-spacing: -0.3px; text-transform: uppercase; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">${companyName}</span>
            </td>
            <td align="right">
              <span style="color: #64748b; font-size: 12px; font-weight: 500;">Private Briefing</span>
            </td>
          </tr>
        </table>
      </div>`;
  }
}

export function renderThemeFooter(
  themeId: string = 'executive',
  companyName: string = 'Our Company',
  fromName: string = 'Marketing Team',
  unsubscribeUrl: string = '#unsubscribe'
): string {
  return `
    <div style="background-color: #f8fafc; padding: 24px 36px; border-top: 1px solid #e2e8f0; border-radius: 0 0 12px 12px; text-align: center; color: #94a3b8; font-size: 11px; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <p style="margin: 0 0 6px 0; color: #64748b; font-size: 12px;">You received this email because you are connected with <strong>${fromName}</strong> regarding <strong>{{business_name}}</strong>.</p>
      <p style="margin: 0 0 10px 0;">Sent by ${companyName} &bull; All rights reserved &bull; Verified Delivery</p>
      <p style="margin: 0;"><a href="${unsubscribeUrl}" style="color: #64748b; text-decoration: underline; font-weight: 600;">Unsubscribe from marketing emails</a></p>
    </div>`;
}

/**
 * Wrap email body with a complete, responsive email template
 */
export function wrapEmailWithTemplate(
  bodyHtml: string,
  themeId: string = 'executive',
  options: {
    fromName: string;
    companyName: string;
    ctaText?: string;
    ctaUrl?: string;
    unsubscribeUrl?: string;
  }
): string {
  const fromName = options.fromName || 'Marketing Team';
  const companyName = options.companyName || 'Our Company';
  const unsubscribeUrl = options.unsubscribeUrl || '#test-unsubscribe';
  const content = extractBodyContent(bodyHtml);

  const headerHtml = renderThemeHeader(themeId, companyName);
  const footerHtml = renderThemeFooter(themeId, companyName, fromName, unsubscribeUrl);

  return `
<div style="background-color: #f1f5f9; padding: 30px 15px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 18px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0; overflow: hidden;">
    ${headerHtml}
    
    <!-- EMAIL_BODY_START -->
    <div style="padding: 36px 36px; color: #1e293b; font-size: 14px; line-height: 1.7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      ${content}
    </div>
    <!-- EMAIL_BODY_END -->
    
    ${footerHtml}
  </div>
</div>`.trim();
}

/**
 * Replace merge tags with sample data for live visual rendering
 */
export function renderPreviewVariables(
  html: string,
  sampleContact?: {
    first_name?: string;
    last_name?: string;
    name?: string;
    business_name?: string;
    company?: string;
    job_title?: string;
    city?: string;
    email?: string;
  }
): string {
  const contact = sampleContact || {
    first_name: 'Sarah',
    name: 'Sarah Sterling',
    last_name: 'Sterling',
    business_name: 'Sterling Realty Partners',
    company: 'Sterling Realty Partners',
    job_title: 'Managing Broker',
    city: 'Lahore',
    email: 'sarah@sterlingrealty.pk',
  };

  return html
    .replace(/\{\{\s*name\s*(?:\|\s*(?:default:\s*)?["'][^"']*["'])?\s*\}\}/gi, contact.name || contact.first_name || 'Sarah')
    .replace(/\{\{\s*first_name\s*(?:\|\s*(?:default:\s*)?["'][^"']*["'])?\s*\}\}/gi, contact.first_name || 'Sarah')
    .replace(/\{\{\s*last_name\s*\}\}/gi, contact.last_name || 'Sterling')
    .replace(/\{\{\s*business_name\s*(?:\|\s*(?:default:\s*)?["'][^"']*["'])?\s*\}\}/gi, contact.business_name || 'Sterling Realty Partners')
    .replace(/\{\{\s*company\s*\}\}/gi, contact.company || 'Sterling Realty Partners')
    .replace(/\{\{\s*job_title\s*\}\}/gi, contact.job_title || 'Managing Broker')
    .replace(/\{\{\s*city\s*\}\}/gi, contact.city || 'Lahore')
    .replace(/\{\{\s*email\s*\}\}/gi, contact.email || 'sarah@sterlingrealty.pk')
    .replace(/\{\{\s*unsubscribe_url\s*\}\}/gi, '#unsubscribe');
}
