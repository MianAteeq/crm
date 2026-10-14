
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomeAiChatbot from './pages/HomeAiChatbot';
import Pricing from './pages/Pricing';
import WhatsappCampaigns from './pages/WhatsappCampaigns';
import AutomatedMessaging from './pages/AutomatedMessaging';
import WhatsAppAiCopilot from './pages/WhatsAppAiCopilot';
import ContactListRetargeting from './pages/ContactListRetargeting';
import WhatsAppAnalytics from './pages/WhatsAppAnalytics';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import SEO from './components/SEO';

function App() {
  return (
    <Router>
      <SEO />
      <Routes>
        {/* Core Pages */}
        <Route path="/" element={<HomeAiChatbot />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Services & Automation Solutions */}
        <Route path="/whatsapp-campaigns" element={<WhatsappCampaigns />} />
        <Route path="/automated-messaging" element={<AutomatedMessaging />} />
        <Route path="/whatsapp-ai-copilot" element={<WhatsAppAiCopilot />} />
        <Route path="/contact-list-retargeting" element={<ContactListRetargeting />} />
        <Route path="/whatsapp-analytics" element={<WhatsAppAnalytics />} />

        {/* Legal & Compliance */}
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/terms-and-conditions" element={<Terms />} />

        {/* Fallback Catch-All */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
  