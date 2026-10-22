import React, { useEffect } from 'react';
import Navbar from '../../components/public/Navbar';
import Footer from '../../components/public/Footer';
import {
  Hero,
  TrustedBy,
  OmnichannelInbox,
  AIWorkflow,
  WhatsAppAutomation,
  CRMDashboardPreview,
  Testimonials,
  FinalCTA
} from '../../components/public/LandingSections';

export default function LandingPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen selection:bg-[#166534] selection:text-[#F0FDF4] overflow-x-hidden relative bg-[#0a1826]">
      <Navbar />
      <main>
        <Hero />
        <TrustedBy />
        <OmnichannelInbox />
        <AIWorkflow />
        <WhatsAppAutomation />
        <CRMDashboardPreview />
        <Testimonials />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
