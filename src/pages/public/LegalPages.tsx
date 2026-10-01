import React, { useEffect } from 'react';
import Navbar from '../../components/public/Navbar';
import Footer from '../../components/public/Footer';

// Reusable scroll behavior helper
function useScrollToTop() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
}

export function PrivacyPage() {
  useScrollToTop();

  return (
    <div className="bg-white text-slate-900 min-h-screen selection:bg-indigo-500/20 selection:text-indigo-900 font-sans overflow-x-hidden">
      <Navbar />

      <main>
        {/* Hero Header */}
        <section className="pt-48 pb-36 px-6 bg-slate-950 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.15),transparent_60%)] pointer-events-none" />
          <div className="max-w-4xl mx-auto space-y-6 relative z-10">
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] bg-indigo-500/10 px-3.5 py-1.5 rounded-full border border-indigo-500/20">
              Trust & Transparency
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-slate-450 font-medium text-sm md:text-base max-w-xl mx-auto leading-relaxed uppercase tracking-widest">
              Last updated: June 30, 2026
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-20 px-6 max-w-4xl mx-auto">
          <div className="space-y-12 text-left">
            
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">1. Introduction</h2>
              <p className="text-slate-500 text-sm leading-[1.8]">
                We value your privacy and are committed to protecting your personal data. This Privacy Policy explains how our platform collects, uses, discloses, and safeguards your information when you use our WhatsApp CRM services, marketing tools, landing page builders, and CRM database connections. Please read this policy carefully.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">2. Information We Collect</h2>
              <p className="text-slate-500 text-sm leading-[1.8] mb-2">
                We collect information that you directly provide to us, as well as metadata generated automatically when using our integrations. This includes:
              </p>
              <ul className="list-disc pl-5 text-slate-500 text-sm space-y-2.5">
                <li><strong>Account Data:</strong> Name, professional email address, company profile information, and secure password configurations.</li>
                <li><strong>Integration Settings:</strong> Meta developer credentials, WhatsApp Business API endpoints, API keys, and configurations for incoming webhook integrations.</li>
                <li><strong>Customer Database Syncs:</strong> Form inputs, phone number data logs, pipeline stage properties, and marketing campaigns content schedules.</li>
                <li><strong>Usage Data:</strong> Technical logs, IP addresses, browser specifications, and timestamp metrics related to your interactions with our dashboards.</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">3. How We Use Your Information</h2>
              <p className="text-slate-500 text-sm leading-[1.8] mb-2">
                We utilize the collected datasets to operate, scale, and secure our communications network:
              </p>
              <ul className="list-disc pl-5 text-slate-500 text-sm space-y-2.5">
                <li>To dispatch, log, and render WhatsApp broadcasts and automated messaging responses.</li>
                <li>To synchronize customer pipeline data securely between linked form integrations and lead databases.</li>
                <li>To diagnose system logs, optimize backend storage, and prevent fraudulent messaging distributions.</li>
                <li>To process billing transactions and provide real-time updates regarding usage limit metrics.</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">4. Data Retention & Security</h2>
              <p className="text-slate-500 text-sm leading-[1.8]">
                All data payloads are stored using secure cloud data architectures and encrypted both in transit (using TLS 1.3 protocols) and at rest. We store database indexes only as long as your account tier remains active. You may export or securely delete your campaign conversation records directly from your administration dashboard settings at any time.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">5. Third-Party Service Integrations</h2>
              <p className="text-slate-500 text-sm leading-[1.8]">
                Our platform relies on authorized integrations with WhatsApp Business APIs (Meta Platforms, Inc.), Google Cloud Services, and external payment processors. Data exchanged with these services is governed by their respective developer integration terms. We do not sell or trade user databases to external advertising aggregators.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">6. Changes to This Policy</h2>
              <p className="text-slate-500 text-sm leading-[1.8]">
                We reserve the right to revise this Privacy Policy periodically. Significant changes will be broadcasted to your registered workspace administrator email or displayed via service alerts. Continued utilization of our CRM tools indicates consent to updated guidelines.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">7. Contact Information</h2>
              <p className="text-slate-500 text-sm leading-[1.8]">
                For questions regarding data processing policies, deletion requests, or integration security compliance details, please submit an inquiry to our support center at <a href="mailto:support@throbtech.com" className="text-indigo-650 font-bold hover:underline">support@throbtech.com</a>.
              </p>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export function TermsPage() {
  useScrollToTop();

  return (
    <div className="bg-white text-slate-900 min-h-screen selection:bg-indigo-500/20 selection:text-indigo-900 font-sans overflow-x-hidden">
      <Navbar />

      <main>
        {/* Hero Header */}
        <section className="pt-48 pb-36 px-6 bg-slate-950 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.15),transparent_60%)] pointer-events-none" />
          <div className="max-w-4xl mx-auto space-y-6 relative z-10">
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] bg-indigo-500/10 px-3.5 py-1.5 rounded-full border border-indigo-500/20">
              User Agreement
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
              Terms & Conditions
            </h1>
            <p className="text-slate-450 font-medium text-sm md:text-base max-w-xl mx-auto leading-relaxed uppercase tracking-widest">
              Last updated: June 30, 2026
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-20 px-6 max-w-4xl mx-auto">
          <div className="space-y-12 text-left">

            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">1. Agreement to Terms</h2>
              <p className="text-slate-500 text-sm leading-[1.8]">
                By registering a business profile, initiating a trial tier, or accessing the messaging CRM portal, you agree to be bound by these Terms and Conditions. If you represent a company, you warrant that you possess the official authority to accept this agreement on behalf of the legal entity.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">2. Scope of Service</h2>
              <p className="text-slate-500 text-sm leading-[1.8]">
                We supply cloud-based SaaS integrations connecting lead forms, social media post planning schedules, customized landing page elements, CRM workspace pipelines, and API integrations with the WhatsApp Business Platform. The services are provided "as available." We deploy updates regularly to improve performance, structure, and security.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">3. User Responsibilities & Acceptable Use</h2>
              <p className="text-slate-500 text-sm leading-[1.8] mb-2">
                As a client administrator, you represent and warrant that:
              </p>
              <ul className="list-disc pl-5 text-slate-500 text-sm space-y-2.5">
                <li>You will compile with WhatsApp Commerce and Business Policies regarding customer opt-ins.</li>
                <li>You will not distribute unsolicited spam broadcasts or fraudulent messaging sequences.</li>
                <li>You remain solely responsible for the authenticity of the information stored inside your linked CRM databases.</li>
                <li>You will protect access credentials and take responsibility for activities occurring under your team members' accounts.</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">4. Fees, Plans, & Billing</h2>
              <p className="text-slate-500 text-sm leading-[1.8]">
                Subscription fees are charged at the beginning of each billing interval based on your selected package limits. Meta WhatsApp API usage fees are invoiced separately or calculated based on your Meta account balance. Payment defaults or failure to settle overdue billing notices within 14 business days may result in campaign execution limits or total temporary workspace suspensions.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">5. Intellectual Property</h2>
              <p className="text-slate-500 text-sm leading-[1.8]">
                All assets, code structures, interface widgets, system logos, and landing page designs are the exclusive intellectual property of our company. You receive a limited, non-assignable license to run the SaaS tools for internal corporate communications. You may not reverse-engineer, mirror, or repackage dashboard components without prior written consent.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">6. Limitation of Liability</h2>
              <p className="text-slate-500 text-sm leading-[1.8]">
                In no event shall our corporation be liable for database sync failures, third-party webhook blockages, WhatsApp phone number suspensions by Meta, loss of profits, or data leaks resulting from unsecure admin API key disclosures. Our total liability is restricted to the total amount paid by you during the three months preceding the liability claim.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">7. Account Termination</h2>
              <p className="text-slate-500 text-sm leading-[1.8]">
                You can cancel your subscription plan at any time via your account billing administration module. We retain the authority to terminate accounts immediately if customer usage triggers repeated spam violations or breaches WhatsApp developer guidelines.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">8. Legal Disputes</h2>
              <p className="text-slate-500 text-sm leading-[1.8]">
                These terms are governed by the local jurisdiction's corporate statutes. Any litigation arising out of these conditions shall be adjudicated exclusively within competent regional commercial courts.
              </p>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
