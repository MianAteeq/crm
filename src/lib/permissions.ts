import type { User } from "../types";

export function can(user: User | null, permission: string): boolean {
  return (
    !!user &&
    (user.role === "superadmin" || !!user.permissions?.includes(permission))
  );
}

export function pagePermission(path: string): string | null {
  if (path.startsWith("/settings/users")) return "users.view";
  if (path.startsWith("/dashboard")) return "dashboard.view";
  if (path.startsWith("/contacts/add") || path.startsWith("/contacts/edit"))
    return "contacts.manage";
  if (path.startsWith("/contacts")) return "contacts.view";
  if (path.startsWith("/inbox")) return "inbox.view";
  if (path.startsWith("/email-campaigns/create"))
    return "email_campaigns.manage";
  if (path.startsWith("/email-campaigns/ai-agent"))
    return "email_campaigns.manage";
  if (path.startsWith("/email-campaigns")) return "email_campaigns.view";
  if (path.startsWith("/email-templates")) return "email_templates.view";
  if (path.startsWith("/settings/email")) return "email_settings.view";
  if (path.startsWith("/campaigns/create")) return "campaigns.manage";
  if (path.startsWith("/campaigns")) return "campaigns.view";
  if (path.startsWith("/templates/builder")) return "templates.manage";
  if (path.startsWith("/templates")) return "templates.view";
  if (path.startsWith("/settings/whatsapp") || path.startsWith("/whatsapp"))
    return "whatsapp.view";
  if (path.startsWith("/scraper")) return "scraper.view";
  if (path.startsWith("/automation/workflows/builder"))
    return "automation.manage";
  if (path.startsWith("/automation")) return "automation.view";
  return null;
}
