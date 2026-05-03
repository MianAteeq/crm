import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import CampaignsPage from './pages/campaigns/CampaignsPage';
import CampaignBuilderPage from './pages/campaigns/CampaignBuilderPage';
import CampaignDetailPage from './pages/campaigns/CampaignDetailPage';
import InboxPage from './pages/inbox/InboxPage';
import Contacts from './pages/Contacts';
import TemplatesPage from './pages/templates/TemplatesPage';
import CreateTemplatePage from './pages/templates/CreateTemplatePage';
import WhatsAppSettingsPage from './pages/settings/WhatsAppSettingsPage';

// Auth Pages
import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import OnboardingPage from './pages/auth/OnboardingPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { useAuthStore } from './store/authStore';

function AppRoutes() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Onboarding */}
      <Route path="/onboarding" element={
        <ProtectedRoute>
          <OnboardingPage />
        </ProtectedRoute>
      } />

      {/* Protected Dashboard Routes */}
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
        <Route path="templates" element={<TemplatesPage />} />
        <Route path="templates/create" element={<CreateTemplatePage />} />
        <Route path="settings/whatsapp" element={<WhatsAppSettingsPage />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}
