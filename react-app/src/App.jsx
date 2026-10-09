
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Typography from './pages/Typography';
import Testimonial from './pages/Testimonial';
import Team from './pages/Team';
import TeamDetails from './pages/TeamDetails';
import Pricing from './pages/Pricing';
import Integrations from './pages/Integrations';
import Home from './pages/Home';
import HomeAiChatbot from './pages/HomeAiChatbot';
import Features from './pages/Features';
import Faq from './pages/Faq';
import Error from './pages/Error';
import Contact from './pages/Contact';
import Cases from './pages/Cases';
import CaseStudies from './pages/CaseStudies';
import CaseStudiesDetails from './pages/CaseStudiesDetails';
import CaseStudies2 from './pages/CaseStudies2';
import Blog from './pages/Blog';
import BlogDetails from './pages/BlogDetails';
import About from './pages/About';
import WhatsappCampaigns from './pages/WhatsappCampaigns';
import AutomatedMessaging from './pages/AutomatedMessaging';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/typography" element={<Typography />} />
        <Route path="/testimonial" element={<Testimonial />} />
        <Route path="/team" element={<Team />} />
        <Route path="/team-details" element={<TeamDetails />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/integrations" element={<Integrations />} />
        <Route path="/home-1" element={<Home />} />
        <Route path="/" element={<HomeAiChatbot />} />
        <Route path="/whatsapp-campaigns" element={<WhatsappCampaigns />} />
        <Route path="/automated-messaging" element={<AutomatedMessaging />} />
        <Route path="/features" element={<Features />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/error" element={<Error />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cases" element={<Cases />} />
        <Route path="/case-studies" element={<CaseStudies />} />
        <Route path="/case-studies-details" element={<CaseStudiesDetails />} />
        <Route path="/case-studies-2" element={<CaseStudies2 />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog-details" element={<BlogDetails />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;
  