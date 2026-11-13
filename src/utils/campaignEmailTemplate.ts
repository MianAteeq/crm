import type { EmailTemplate } from '../types/emailCampaign';
import { PROFESSIONAL_FRAMES } from './emailTemplateFrames';
import { emailBrandSettings, extractEmailBody } from './emailBranding';

export function campaignEmailTemplate(template: EmailTemplate) {
  const htmlFrame = template.html_body.match(
    /data-email-frame=["']([^"']+)["']/,
  )?.[1];
  const frame =
    PROFESSIONAL_FRAMES.find(
      (item) => item.id === (template.editor_data?.frame_id || htmlFrame),
    ) ||
    PROFESSIONAL_FRAMES.find((item) =>
      template.name.toLowerCase().includes(item.name.toLowerCase()),
    );
  return {
    frameId: frame?.id || null,
    bodyHtml: frame
      ? (template.editor_data?.body_html ??
        extractEmailBody(template.html_body))
      : template.html_body,
    brand: emailBrandSettings(template.editor_data?.brand),
    // Imported HTML without a known frame must retain its own layout and styles.
    customHtml: !frame,
  };
}
