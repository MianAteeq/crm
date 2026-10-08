import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useBrandingStore } from './store/brandingStore';
import { Layout } from './components/layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import CampaignsPage from './pages/campaigns/CampaignsPage';
import CampaignBuilderPage from './pages/campaigns/CampaignBuilderPage';
import CampaignDetailPage from './pages/campaigns/CampaignDetailPage';
import InboxPage from './pages/inbox/InboxPage';
import Contacts from './pages/Contacts';
import ContactEditorPage from './pages/contacts/ContactEditorPage';
import TemplatesPage from './pages/whatsapp/TemplatesPage';
import TemplateBuilderPage from './pages/whatsapp/TemplateBuilderPage';
import WhatsAppSettingsPage from './pages/settings/WhatsAppSettingsPage';
import BusinessScraperPage from './pages/scraper/BusinessScraperPage';
import EmailCampaignsPage from './pages/campaigns/EmailCampaignsPage';
import EmailCampaignBuilderPage from './pages/campaigns/EmailCampaignBuilderPage';
import EmailCampaignReportPage from './pages/campaigns/EmailCampaignReportPage';
import EmailTemplatesPage from './pages/campaigns/EmailTemplatesPage';
import EmailSettingsPage from './pages/settings/EmailSettingsPage';
import AiMarketingAgentPage from './pages/campaigns/AiMarketingAgentPage';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import FeaturesPage from './pages/public/FeaturesPage';
import SolutionsPage from './pages/public/SolutionsPage';
import PricingPage from './pages/public/PricingPage';
import IntegrationsPage from './pages/public/IntegrationsPage';
import ResourcesPage from './pages/public/ResourcesPage';
import ContactPage from './pages/public/ContactPage';
import { 
  WhatsAppCampaignsPage, RetargetingPage, AutomationPage, SocialMediaPage, 
  LeadFormsPage, AIResponsesPage, PageBuilderPage, MediaStoragePage,
  WhatsAppAnalyticsPage
} from './pages/public/ServicePages';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import OnboardingPage from './pages/auth/OnboardingPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { PrivacyPage, TermsPage } from './pages/public/LegalPages';

// New Enhanced Pages
import WhatsAppConnectPage from './pages/whatsapp/WhatsAppConnectPage';
import InboxPageEnhanced from './pages/inbox/InboxPageEnhanced';

// Toast Notifications
import { ToastContainer } from './components/ui/Toast';

// Chatbot Widget
import ChatbotWidget from './components/public/ChatbotWidget';

// Admin Pages & Layout
import AdminLayout from './components/layout/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminTenants from './pages/admin/AdminTenants';
import AdminUsers from './pages/admin/AdminUsers';
import AdminPlans from './pages/admin/AdminPlans';
import AdminSettings from './pages/admin/AdminSettings';
import AdminSendingDomains from './pages/admin/AdminSendingDomains';

// Automation Pages & Layout
import AutomationLayout from './pages/automation/AutomationLayout';
import AutomationDashboard from './pages/automation/AutomationDashboard';
import WorkflowsPage from './pages/automation/WorkflowsPage';
import ExecutionsPage from './pages/automation/ExecutionsPage';
import WorkflowBuilderPage from './pages/automation/WorkflowBuilderPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Show chatbot only on public-facing pages
function PublicChatbot() {
  const { pathname } = useLocation();
  const isPublicPage = !pathname.startsWith('/dashboard') && 
                       !pathname.startsWith('/inbox') && 
                       !pathname.startsWith('/campaigns') && 
                       !pathname.startsWith('/contacts') && 
                       !pathname.startsWith('/templates') && 
                       !pathname.startsWith('/settings') && 
                       !pathname.startsWith('/whatsapp') && 
                       !pathname.startsWith('/automation') && 
                       !pathname.startsWith('/scraper') && 
                       !pathname.startsWith('/admin') && 
                       !pathname.startsWith('/onboarding');
  if (!isPublicPage) return null;
  return <ChatbotWidget />;
}

export default function App() {
  const loadBranding = useBrandingStore((state) => state.loadBranding);

  useEffect(() => {
    loadBranding();
  }, [loadBranding]);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/services" element={<FeaturesPage />} />
        <Route path="/solutions" element={<SolutionsPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/integrations" element={<IntegrationsPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/services/whatsapp-campaigns" element={<WhatsAppCampaignsPage />} />
        <Route path="/services/retargeting" element={<RetargetingPage />} />
        <Route path="/services/crm" element={<RetargetingPage />} />
        <Route path="/services/automation" element={<AutomationPage />} />
        <Route path="/services/social-media" element={<SocialMediaPage />} />
        <Route path="/services/lead-forms" element={<LeadFormsPage />} />
        <Route path="/services/ai-responses" element={<AIResponsesPage />} />
        <Route path="/services/page-builder" element={<PageBuilderPage />} />
        <Route path="/services/media-storage" element={<MediaStoragePage />} />
        <Route path="/services/analytics" element={<WhatsAppAnalyticsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/onboarding" element={
          <ProtectedRoute>
            <OnboardingPage />
          </ProtectedRoute>
        } />
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="inbox" element={<InboxPage />} />
          <Route path="inbox-enhanced" element={<InboxPageEnhanced />} />
          <Route path="campaigns" element={<CampaignsPage />} />
          <Route path="campaigns/create" element={<CampaignBuilderPage />} />
          <Route path="campaigns/:id" element={<CampaignDetailPage />} />

          {/* Email Campaign Routes */}
          <Route path="email-campaigns/ai-agent" element={<AiMarketingAgentPage />} />
          <Route path="email-campaigns" element={<EmailCampaignsPage />} />
          <Route path="email-campaigns/create" element={<EmailCampaignBuilderPage />} />
          <Route path="email-campaigns/:id/report" element={<EmailCampaignReportPage />} />
          <Route path="email-templates" element={<EmailTemplatesPage />} />
          <Route path="settings/email" element={<EmailSettingsPage />} />

          <Route path="contacts" element={<Contacts />} />
          <Route path="contacts/add" element={<ContactEditorPage />} />
          <Route path="contacts/edit/:id" element={<ContactEditorPage />} />
          <Route path="scraper" element={<BusinessScraperPage />} />
          <Route path="templates" element={<TemplatesPage />} />
          <Route path="templates/builder" element={<TemplateBuilderPage />} />
          <Route path="settings/whatsapp" element={<WhatsAppSettingsPage />} />
          <Route path="whatsapp/connect" element={<WhatsAppConnectPage />} />

          {/* Automation Routes */}
          <Route path="automation" element={<AutomationLayout />}>
            <Route index element={<AutomationDashboard />} />
            <Route path="workflows" element={<WorkflowsPage />} />
            <Route path="executions" element={<ExecutionsPage />} />
          </Route>
          <Route path="automation/workflows/builder/:id" element={<WorkflowBuilderPage />} />
          <Route path="automation/workflows/builder" element={<WorkflowBuilderPage />} />

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="tenants" element={<AdminTenants />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="sending-domains" element={<AdminSendingDomains />} />
          <Route path="plans" element={<AdminPlans />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <PublicChatbot />
    </Router>
    <ToastContainer />
    </QueryClientProvider>
  );
}
