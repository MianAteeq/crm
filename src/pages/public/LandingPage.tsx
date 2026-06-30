import React, { useEffect } from 'react';
import Navbar from '../../components/public/Navbar';
import Footer from '../../components/public/Footer';
import { 
  Hero, 
  TrustedBy,
  OmnichannelInbox,
  AIWorkflow,
  CRMDashboardPreview,
  Testimonials,
  FinalCTA
} from '../../components/public/LandingSections';

export default function LandingPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-white text-slate-900 min-h-screen selection:bg-brand/20 selection:text-brand-dark overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <TrustedBy />
        <OmnichannelInbox />
        <AIWorkflow />
        <CRMDashboardPreview />
        <Testimonials />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
