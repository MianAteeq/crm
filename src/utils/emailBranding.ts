export interface EmailBrandSettings {
  company_name: string;
  company_full_name: string;
  logo_url: string;
  website_url: string;
  contact_label: string;
  phone: string;
  email: string;
  department: string;
  address: string;
  navigation: { label: string; url: string }[];
  socials: { linkedin: string; facebook: string; instagram: string; x: string };
}

export interface EmailTemplateEditorData {
  frame_id: string;
  body_html: string;
  brand: EmailBrandSettings;
}

export const DEFAULT_EMAIL_BRAND: EmailBrandSettings = {
  company_name: 'Andlyl',
  company_full_name: 'Andlyl Corp',
  logo_url: '',
  website_url: 'https://www.andlyl.com',
  contact_label: 'Talk to us',
  phone: '+1 718 395 3598',
  email: 'hello@andlyl.com',
  department: 'Operations Department',
  address: '19904 Hillside Ave, Hollis, NY 11423, USA',
  navigation: [
    { label: 'Company', url: 'https://www.andlyl.com/company' },
    { label: 'Services', url: 'https://www.andlyl.com/services' },
    { label: 'Projects', url: 'https://www.andlyl.com/projects' },
    { label: 'Contact', url: 'https://www.andlyl.com/contact' },
  ],
  socials: {
    linkedin: 'https://www.linkedin.com',
    facebook: 'https://www.facebook.com',
    instagram: 'https://www.instagram.com',
    x: 'https://x.com',
  },
};

export function emailBrandSettings(
  value?: Partial<EmailBrandSettings> | null,
): EmailBrandSettings {
  const brand = {
    ...DEFAULT_EMAIL_BRAND,
    ...value,
    navigation: (value?.navigation || DEFAULT_EMAIL_BRAND.navigation).map(
      (link) => ({ label: link.label || '', url: link.url || '' }),
    ),
    socials: { ...DEFAULT_EMAIL_BRAND.socials, ...value?.socials },
  };
  for (const key of Object.keys(DEFAULT_EMAIL_BRAND)) {
    if (
      key !== 'navigation' &&
      key !== 'socials' &&
      typeof brand[key] !== 'string'
    )
      brand[key] = '';
  }
  for (const key of Object.keys(brand.socials))
    brand.socials[key] = brand.socials[key] || '';
  return brand;
}

export function escapeEmailText(value: string): string {
  return String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[
        char
      ]!,
  );
}

export function safeEmailUrl(value: string): string {
  try {
    const parsed = new URL(value);
    return ['https:', 'http:'].includes(parsed.protocol)
      ? escapeEmailText(parsed.href)
      : '';
  } catch {
    return '';
  }
}

export function corporateEmailHeader(settings?: EmailBrandSettings): string {
  const brand = emailBrandSettings(settings);
  const company = escapeEmailText(brand.company_name);
  const website = safeEmailUrl(brand.website_url);
  const logo = safeEmailUrl(brand.logo_url);
  const phone = escapeEmailText(brand.phone);
  const phoneHref = brand.phone.replace(/[^+\d]/g, '');
  const email = escapeEmailText(brand.email);
  const logoHtml = logo
    ? `<img src="${logo}" width="130" alt="${company}" style="display:block;width:130px;max-width:100%;height:auto;border:0;" />`
    : `<span style="font-family:Arial,Helvetica,sans-serif;font-size:30px;font-weight:800;letter-spacing:-1px;color:#111111;">${company}</span>`;
  const links = brand.navigation.filter(
    (link) => link.label.trim() && safeEmailUrl(link.url),
  );
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;background-color:#ffffff;">
<tr><td style="padding:26px 32px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
<td valign="middle" style="width:50%;">${website ? `<a href="${website}" style="text-decoration:none;">${logoHtml}</a>` : logoHtml}</td>
<td align="right" valign="middle" style="font-family:Arial,Helvetica,sans-serif;text-align:right;">
<p style="margin:0 0 4px;font-size:10px;line-height:14px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;color:#777777;">${escapeEmailText(brand.contact_label)}</p>
${phone ? `<p style="margin:0;font-size:13px;line-height:19px;font-weight:bold;"><a href="tel:${phoneHref}" style="text-decoration:none;color:#111111;">${phone}</a></p>` : ''}
${email ? `<p style="margin:0;font-size:12px;line-height:18px;"><a href="mailto:${encodeURIComponent(brand.email)}" style="text-decoration:none;color:#111111;">${email}</a></p>` : ''}
</td></tr></table></td></tr>
${links.length ? `<tr><td bgcolor="#000000" align="center" style="background-color:#000000;border-bottom:3px solid #ccff00;padding:13px 8px;text-align:center;">${links.map((link, index) => `<a href="${safeEmailUrl(link.url)}" style="display:inline-block;padding:3px 10px;font-family:Arial,Helvetica,sans-serif;font-size:10px;line-height:16px;font-weight:bold;letter-spacing:0.5px;text-transform:uppercase;text-decoration:none;color:${index === links.length - 1 ? '#ccff00' : '#ffffff'};">${escapeEmailText(link.label)}</a>`).join('')}</td></tr>` : '<tr><td bgcolor="#ccff00" height="3" style="height:3px;font-size:0;line-height:0;">&nbsp;</td></tr>'}
</table>`;
}

export function corporateEmailFooter(settings?: EmailBrandSettings): string {
  const brand = emailBrandSettings(settings);
  const website = safeEmailUrl(brand.website_url);
  const phoneHref = brand.phone.replace(/[^+\d]/g, '');
  const socialLabels: Record<keyof EmailBrandSettings['socials'], string> = {
    linkedin: 'in',
    facebook: 'f',
    instagram: 'IG',
    x: 'X',
  };
  const socials = (
    Object.keys(socialLabels) as (keyof typeof socialLabels)[]
  ).filter((key) => safeEmailUrl(brand.socials[key]));
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;font-family:Arial,Helvetica,sans-serif;">
<tr><td style="padding:0 32px 30px;background-color:#ffffff;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-top:1px solid #dddddd;padding-top:22px;">
${brand.department ? `<p style="margin:0 0 4px;font-size:13px;line-height:19px;font-weight:bold;color:#111111;">${escapeEmailText(brand.department)}</p>` : ''}
<p style="margin:0 0 3px;font-size:12px;line-height:18px;color:#666666;">${escapeEmailText(brand.company_full_name)}</p>
${brand.phone ? `<p style="margin:0 0 3px;font-size:12px;line-height:18px;"><a href="tel:${phoneHref}" style="color:#666666;text-decoration:none;">${escapeEmailText(brand.phone)}</a></p>` : ''}
${brand.email ? `<p style="margin:0;font-size:12px;line-height:18px;"><a href="mailto:${encodeURIComponent(brand.email)}" style="color:#666666;text-decoration:none;">${escapeEmailText(brand.email)}</a></p>` : ''}
</td></tr></table></td></tr>
<tr><td bgcolor="#000000" style="background-color:#000000;padding:28px 32px;color:#ffffff;">
${
  socials.length
    ? `<p style="margin:0 0 14px;color:#ccff00;font-size:11px;line-height:16px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;">Follow ${escapeEmailText(brand.company_name)}</p>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px;"><tr>${socials.map((key) => `<td style="padding-right:8px;"><a href="${safeEmailUrl(brand.socials[key])}" aria-label="${key}" title="${key}" style="display:inline-block;width:28px;height:28px;line-height:28px;text-align:center;border-radius:50%;background-color:#ccff00;color:#000000;font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:bold;text-decoration:none;">${socialLabels[key]}</a></td>`).join('')}</tr></table>`
    : ''
}
<p style="margin:0 0 5px;color:#ccff00;font-size:12px;line-height:18px;font-weight:bold;">${escapeEmailText(brand.company_full_name)}</p>
<p style="margin:0 0 6px;color:#dddddd;font-size:12px;line-height:19px;">${escapeEmailText(brand.address).replace(/\r?\n/g, '<br />')}</p>
${website ? `<p style="margin:0 0 16px;font-size:12px;line-height:18px;"><a href="${website}" style="color:#ffffff;text-decoration:underline;">${escapeEmailText(brand.website_url.replace(/^https?:\/\//, '').replace(/\/$/, ''))}</a></p>` : ''}
<p style="margin:16px 0 0;font-size:10px;line-height:16px;color:#aaaaaa;"><a href="{{unsubscribe_url}}" style="color:#aaaaaa;text-decoration:underline;">Unsubscribe from these emails</a></p>
</td></tr></table>`;
}

// Markers preserve nested tables and CTA buttons when templates are reopened.
export function extractEmailBody(html: string): string {
  const marked = html.match(
    /<!-- CRM:BODY:START -->([\s\S]*?)<!-- CRM:BODY:END -->/,
  );
  if (marked) return marked[1].trim();
  if (typeof DOMParser !== 'undefined') {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const body =
      doc.querySelector('td.body-content-pad') ||
      doc.querySelector<HTMLTableElement>('table[style*="max-width: 600px"]')
        ?.rows[1]?.cells[0];
    if (body) return body.innerHTML.trim();
  }
  return html;
}

export function emailPlainText(html: string): string {
  if (typeof DOMParser === 'undefined') {
    return html
      .replace(/<!--[^]*?-->/g, '')
      .replace(/<\/(p|h[1-6]|li|tr)>|<br\s*\/?>/gi, '\n')
      .replace(/<[^>]*>/g, '')
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      .trim();
  }
  const doc = new DOMParser().parseFromString(html, 'text/html');
  doc.querySelectorAll('style,script').forEach((node) => node.remove());
  doc.querySelectorAll('br').forEach((node) => node.replaceWith('\n'));
  doc
    .querySelectorAll('p,h1,h2,h3,h4,li,tr')
    .forEach((node) => node.append('\n'));
  return (doc.body.textContent || '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    .trim();
}
