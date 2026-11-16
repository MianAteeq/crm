import type { LucideIcon } from 'lucide-react';
import {
  BarChart3,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CircleDollarSign,
  Columns3,
  Compass,
  FileBarChart,
  FileText,
  FolderKanban,
  FormInput,
  Globe2,
  HardDrive,
  Inbox,
  Instagram,
  LayoutDashboard,
  Layers3,
  ListTodo,
  Mail,
  Megaphone,
  MessageSquare,
  PanelsTopLeft,
  Send,
  Settings2,
  Share2,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Users,
  Workflow,
} from 'lucide-react';

export interface SidebarNavigationItem {
  id: string;
  label: string;
  icon: LucideIcon;
  route?: string;
  children?: SidebarNavigationItem[];
  requiredPermissions?: string[];
  requiredRoles?: string[];
  feature?: string;
  badge?: string | number;
}

export interface SidebarNavigationSection {
  id: string;
  label: string;
  items: SidebarNavigationItem[];
}

type Translate = (key: string, params?: any, fallback?: string) => string;

export const buildSidebarNavigation = (t: Translate): SidebarNavigationSection[] => [
  {
    id: 'main',
    label: t('app.dashboard.main_eb814b', undefined, 'Main'),
    items: [
      {
        id: 'dashboard',
        label: t('app.dashboard.dashboard_67b696', undefined, 'Dashboard'),
        icon: LayoutDashboard,
        route: '/dashboard',
      },
      {
        id: 'conversations',
        label: t('app.dashboard.conversations_1d432f', undefined, 'Conversations'),
        icon: MessageSquare,
        route: '/inbox',
      },
    ],
  },
  {
    id: 'crm-sales',
    label: 'CRM & Sales',
    items: [
      { id: 'sales-overview', label: 'Sales Overview', icon: CircleDollarSign, route: '/sales' },
      { id: 'contacts', label: t('app.dashboard.contacts_b45064', undefined, 'Contacts'), icon: Users, route: '/contacts' },
      { id: 'companies', label: 'Companies', icon: Building2, route: '/sales/companies' },
      { id: 'opportunities', label: 'Opportunities', icon: Columns3, route: '/sales/opportunities' },
      { id: 'tasks', label: 'Tasks & Follow-up', icon: ListTodo, route: '/sales/tasks' },
      { id: 'appointments', label: 'Appointments', icon: CalendarDays, route: '/sales/appointments' },
    ],
  },
  {
    id: 'marketing',
    label: 'Marketing',
    items: [
      {
        id: 'campaigns',
        label: 'Campaigns',
        icon: Megaphone,
        route: '/email-campaigns',
        children: [
          { id: 'email-campaigns', label: 'Email Campaigns', icon: Mail, route: '/email-campaigns' },
          { id: 'whatsapp-campaigns', label: 'WhatsApp Campaigns', icon: Send, route: '/campaigns' },
        ],
      },
      {
        id: 'email-marketing',
        label: 'Email Marketing',
        icon: Mail,
        route: '/email-templates',
        children: [
          { id: 'email-templates', label: 'Email Templates', icon: FileText, route: '/email-templates' },
          { id: 'sending-domains', label: 'Sending Domains', icon: Globe2, route: '/settings/email' },
        ],
      },
      {
        id: 'whatsapp-marketing',
        label: 'WhatsApp Marketing',
        icon: Smartphone,
        route: '/templates',
        children: [
          { id: 'whatsapp-templates', label: 'WhatsApp Templates', icon: FileText, route: '/templates' },
          { id: 'whatsapp-numbers', label: 'WhatsApp Numbers', icon: Smartphone, route: '/whatsapp/connect' },
          { id: 'whatsapp-billing', label: 'Billing & Payments', icon: CircleDollarSign, route: '/whatsapp/billing' },
          { id: 'whatsapp-settings', label: 'WhatsApp Settings', icon: Settings2, route: '/settings/whatsapp' },
        ],
      },
      {
        id: 'social-media',
        label: 'Social Media',
        icon: Share2,
        route: '/social-planner',
        children: [
          { id: 'social-overview', label: 'Overview', icon: PanelsTopLeft, route: '/social-planner' },
          { id: 'social-accounts', label: 'Social Accounts', icon: Instagram, route: '/social-planner/accounts' },
          { id: 'create-post', label: 'Create Post', icon: Send, route: '/social-planner/create' },
          { id: 'social-inbox', label: 'Social Inbox', icon: Inbox, route: '/social-planner/inbox' },
          { id: 'lead-ads', label: 'Lead Ads (FB & IG)', icon: FormInput, route: '/social-planner/lead-ads' },
        ],
      },
      {
        id: 'ai-marketing-agent',
        label: t('app.dashboard.ai_marketing_agent_d02ae6', undefined, 'AI Marketing Agent'),
        icon: Sparkles,
        route: '/email-campaigns/ai-agent',
      },
      {
        id: 'automation',
        label: t('app.dashboard.workflows_automation_daecf7', undefined, 'Workflows & Automation'),
        icon: Workflow,
        route: '/automation',
      },
    ],
  },
  {
    id: 'growth-content',
    label: 'Growth & Content',
    items: [
      {
        id: 'business-scraper',
        label: t('app.dashboard.business_scraper_198a88', undefined, 'Business Scraper'),
        icon: Compass,
        route: '/scraper',
      },
      {
        id: 'page-form-builder',
        label: t('app.dashboard.page_builder_title', undefined, 'Page & Form Builder'),
        icon: Layers3,
        route: '/page-builder',
        children: [
          { id: 'builder-overview', label: 'Overview', icon: PanelsTopLeft, route: '/page-builder' },
          { id: 'landing-pages', label: 'Landing Pages', icon: FolderKanban, route: '/page-builder/pages' },
          { id: 'forms-surveys', label: 'Forms & Surveys', icon: FormInput, route: '/page-builder/forms' },
          { id: 'submissions', label: 'Submissions', icon: Inbox, route: '/page-builder/submissions' },
        ],
      },
      { id: 'content-calendar', label: 'Content Calendar', icon: CalendarDays, route: '/social-planner/calendar' },
      { id: 'media-storage', label: 'Media Storage', icon: HardDrive, route: '/media-library' },
    ],
  },
  {
    id: 'insights',
    label: 'Insights',
    items: [
      { id: 'analytics', label: 'Analytics', icon: BarChart3, route: '/social-planner/analytics' },
      { id: 'advanced-reporting', label: 'Advanced Reporting', icon: FileBarChart, route: '/reporting' },
    ],
  },
  {
    id: 'administration',
    label: 'Administration',
    items: [
      { id: 'crm-configuration', label: 'CRM Configuration', icon: Settings2, route: '/sales/configuration' },
      {
        id: 'business-profile',
        label: t('app.dashboard.business_profile', undefined, 'Business Profile'),
        icon: BriefcaseBusiness,
        route: '/settings/business-profile',
      },
      { id: 'team-roles-audit', label: 'Team, Roles & Audit', icon: ShieldCheck, route: '/settings/governance' },
      {
        id: 'admin-panel',
        label: 'Admin Panel',
        icon: LayoutDashboard,
        route: '/admin',
        requiredRoles: ['superadmin'],
      },
    ],
  },
];

const exactRoutes = new Set([
  '/sales',
  '/social-planner',
  '/page-builder',
]);

export function isNavigationRouteActive(pathname: string, route?: string): boolean {
  if (!route) return false;
  if (route === '/reporting' && pathname.startsWith('/analytics/advanced')) return true;
  if (route === '/email-campaigns') {
    return pathname.startsWith('/email-campaigns')
      && !pathname.startsWith('/email-campaigns/ai-agent');
  }
  if (exactRoutes.has(route)) return pathname === route;
  return pathname === route || pathname.startsWith(`${route}/`);
}

export function itemContainsActiveRoute(item: SidebarNavigationItem, pathname: string): boolean {
  return isNavigationRouteActive(pathname, item.route)
    || Boolean(item.children?.some((child) => isNavigationRouteActive(pathname, child.route)));
}

