import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
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
import ProtectedRoute from './components/auth/ProtectedRoute';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="inbox" element={<InboxPage />} />
          <Route path="campaigns" element={<CampaignsPage />} />
          <Route path="campaigns/create" element={<CampaignBuilderPage />} />
          <Route path="campaigns/:id" element={<CampaignDetailPage />} />
          <Route path="contacts" element={<Contacts />} />
          <Route path="contacts/add" element={<ContactEditorPage />} />
          <Route path="contacts/edit/:id" element={<ContactEditorPage />} />
          <Route path="templates" element={<TemplatesPage />} />
          <Route path="templates/builder" element={<TemplateBuilderPage />} />
          <Route path="settings/whatsapp" element={<WhatsAppSettingsPage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
    </QueryClientProvider>
  );
}
