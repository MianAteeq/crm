import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

// Auth Pages
import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import OnboardingPage from './pages/auth/OnboardingPage';
import ProtectedRoute from './components/auth/ProtectedRoute';

// New Enhanced Pages
import WhatsAppConnectPage from './pages/whatsapp/WhatsAppConnectPage';
import InboxPageEnhanced from './pages/inbox/InboxPageEnhanced';

// Toast Notifications
import { ToastContainer } from './components/ui/Toast';

// Admin Pages & Layout
import AdminLayout from './components/layout/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminTenants from './pages/admin/AdminTenants';
import AdminUsers from './pages/admin/AdminUsers';
import AdminPlans from './pages/admin/AdminPlans';
import AdminSettings from './pages/admin/AdminSettings';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

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
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
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
          <Route path="contacts" element={<Contacts />} />
          <Route path="contacts/add" element={<ContactEditorPage />} />
          <Route path="contacts/edit/:id" element={<ContactEditorPage />} />
          <Route path="templates" element={<TemplatesPage />} />
          <Route path="templates/builder" element={<TemplateBuilderPage />} />
          <Route path="settings/whatsapp" element={<WhatsAppSettingsPage />} />
          <Route path="whatsapp/connect" element={<WhatsAppConnectPage />} />
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
          <Route path="plans" element={<AdminPlans />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
    <ToastContainer />
    </QueryClientProvider>
  );
}
