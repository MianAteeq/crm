import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';

const Privacy = () => {
  const [activeSection, setActiveSection] = useState('intro');

  useEffect(() => {
    document.title = 'Privacy Policy | Talkinexx - WhatsApp CRM & Automation';
    window.scrollTo(0, 0);

    const handleScroll = () => {
      const sections = ['intro', 'collect', 'use', 'retention', 'third-party', 'changes', 'contact'];
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'intro', num: '1', title: 'Introduction' },
    { id: 'collect', num: '2', title: 'Information We Collect' },
    { id: 'use', num: '3', title: 'How We Use Your Information' },
    { id: 'retention', num: '4', title: 'Data Retention & Security' },
    { id: 'third-party', num: '5', title: 'Third-Party Service Integrations' },
    { id: 'changes', num: '6', title: 'Changes to This Policy' },
    { id: 'contact', num: '7', title: 'Contact Information' },
  ];

  return (
    <Layout>
      <style>{`
        @keyframes floatBob {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        @keyframes spinSlow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .privacy-nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 18px;
          border-radius: 12px;
          color: #57534E;
          font-weight: 600;
          font-size: 14px;
          text-decoration: none;
          transition: all 0.25s ease;
          border-left: 3px solid transparent;
        }
        .privacy-nav-link:hover {
          color: #12263A;
          background: rgba(34, 197, 94, 0.08);
          transform: translateX(4px);
        }
        .privacy-nav-link.active {
          color: #166534;
          background: #F0FDF4;
          border-left-color: #22C55E;
          font-weight: 700;
        }
        .privacy-nav-num {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #E2E8F0;
          color: #12263A;
          font-size: 12px;
          font-weight: 700;
          transition: all 0.25s ease;
        }
        .privacy-nav-link.active .privacy-nav-num {
          background: #22C55E;
          color: #FFFFFF;
        }
        .policy-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 20px;
          padding: 40px;
          margin-bottom: 32px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 20px -2px rgba(18, 38, 58, 0.04);
        }
        .policy-card:hover {
          box-shadow: 0 16px 36px -4px rgba(18, 38, 58, 0.08);
          border-color: rgba(34, 197, 94, 0.35);
        }
        @media (max-width: 991px) {
          .legal-nav-container {
            position: static !important;
            padding: 16px !important;
            margin-bottom: 24px;
            border-radius: 16px !important;
          }
          .legal-nav-list {
            flex-direction: row !important;
            overflow-x: auto !important;
            white-space: nowrap !important;
            gap: 8px !important;
            padding-bottom: 6px;
            -webkit-overflow-scrolling: touch;
          }
          .legal-nav-list::-webkit-scrollbar {
            height: 4px;
          }
          .legal-nav-list::-webkit-scrollbar-thumb {
            background: #22C55E;
            border-radius: 4px;
          }
          .privacy-nav-link {
            padding: 8px 14px !important;
            font-size: 13px !important;
            flex-shrink: 0 !important;
            border-left: none !important;
            border-bottom: 2px solid transparent !important;
            border-radius: 20px !important;
          }
          .privacy-nav-link.active {
            border-bottom-color: #22C55E !important;
          }
          .policy-card {
            padding: 24px 18px !important;
            border-radius: 16px !important;
          }
        }
        .policy-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
          padding-bottom: 20px;
          border-bottom: 1px solid #F1F5F9;
        }
        .policy-badge {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          background: #F0FDF4;
          color: #22C55E;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          font-weight: 800;
          flex-shrink: 0;
          border: 1px solid rgba(34, 197, 94, 0.2);
        }
        .policy-title {
          font-size: 1.6rem;
          font-weight: 800;
          color: #12263A;
          margin: 0;
          letter-spacing: -0.5px;
        }
        .policy-text {
          color: #57534E;
          font-size: 1.08rem;
          line-height: 1.75;
          margin-bottom: 16px;
        }
        .data-grid-item {
          background: #FAFAF9;
          border: 1px solid #E2E8F0;
          border-radius: 14px;
          padding: 22px;
          transition: all 0.3s ease;
          height: 100%;
        }
        .data-grid-item:hover {
          background: #F0FDF4;
          border-color: #22C55E;
          transform: translateY(-3px);
          box-shadow: 0 10px 25px -5px rgba(34, 197, 94, 0.12);
        }
        .use-item {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 16px 20px;
          background: #FAFAF9;
          border-radius: 12px;
          border-left: 4px solid #22C55E;
          margin-bottom: 14px;
          transition: all 0.25s ease;
        }
        .use-item:hover {
          background: #F0FDF4;
          transform: translateX(4px);
        }
        .security-badge-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 30px;
          background: #F0FDF4;
          color: #166534;
          font-size: 13px;
          font-weight: 700;
          border: 1px solid rgba(34, 197, 94, 0.25);
        }
      `}</style>

      {/* Hero Section Matching the Pricing Design Scheme */}
      <section
        className="hero-section text-center position-relative"
        style={{
          background: '#FAFAF9',
          overflow: 'hidden',
          padding: '180px 0 110px 0',
        }}
      >
        <div className="container position-relative" style={{ zIndex: 3 }}>
          <span
            className="badge mb-4"
            style={{
              backgroundColor: 'rgba(34,197,94,0.1)',
              color: '#166534',
              padding: '8px 20px',
              borderRadius: '30px',
              letterSpacing: '2px',
              fontSize: '12px',
              border: '1px solid rgba(34,197,94,0.2)',
              textTransform: 'uppercase',
              display: 'inline-block',
              animation: 'floatBob 4s ease-in-out infinite',
              fontWeight: '700',
            }}
          >
            TRUST &amp; COMPLIANCE
          </span>
          <h1
            className="mb-4"
            style={{
              color: '#12263A',
              fontSize: 'clamp(2.1rem, 5.5vw, 4rem)',
              fontWeight: '800',
              letterSpacing: '-1.5px',
              lineHeight: 1.15,
            }}
          >
            Privacy Policy
          </h1>
          <p
            className="mx-auto"
            style={{
              color: '#57534E',
              maxWidth: '740px',
              fontSize: '1.2rem',
              lineHeight: '1.65',
            }}
          >
            We value your privacy and are committed to protecting your personal data across our WhatsApp CRM services, marketing tools, landing page builders, and database connections.
          </p>

          <div className="d-flex justify-content-center align-items-center gap-3 mt-4 flex-wrap">
            <span className="security-badge-pill">
              <i className="fa-solid fa-shield-check" style={{ color: '#22C55E' }}></i>
              TLS 1.3 In-Transit Encryption
            </span>
            <span className="security-badge-pill">
              <i className="fab fa-whatsapp" style={{ color: '#22C55E' }}></i>
              Meta Cloud API Compliant
            </span>
            <span className="security-badge-pill">
              <i className="fa-solid fa-lock" style={{ color: '#22C55E' }}></i>
              Restricted Data Access
            </span>
          </div>
        </div>

        {/* Floating Decorative Elements */}
        <div
          className="position-absolute hero-floating-badge d-none d-lg-block"
          style={{
            top: '20%',
            left: '10%',
            zIndex: 2,
            animation: 'floatBob 5s ease-in-out infinite',
            opacity: 0.85,
          }}
        >
          <div
            style={{
              width: '60px',
              height: '60px',
              background: '#fff',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 30px rgba(34,197,94,0.25)',
              border: '1px solid #E2E8F0',
            }}
          >
            <i className="fab fa-whatsapp" style={{ fontSize: '30px', color: '#22C55E' }}></i>
          </div>
        </div>

        <div
          className="position-absolute hero-floating-badge d-none d-lg-block"
          style={{
            top: '28%',
            right: '12%',
            zIndex: 2,
            animation: 'floatBob 7s ease-in-out infinite reverse',
            opacity: 0.85,
          }}
        >
          <div
            style={{
              width: '54px',
              height: '54px',
              background: '#12263A',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 12px 30px rgba(18,38,58,0.25)',
            }}
          >
            <i className="fal fa-chart-line" style={{ fontSize: '22px', color: '#22C55E' }}></i>
          </div>
        </div>

        <div
          className="position-absolute hero-floating-badge d-none d-lg-block"
          style={{
            bottom: '12%',
            left: '18%',
            zIndex: 2,
            animation: 'spinSlow 16s linear infinite',
            opacity: 0.15,
          }}
        >
          <svg width="100" height="100" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" stroke="#22C55E" strokeWidth="2" fill="none" strokeDasharray="10 5" />
          </svg>
        </div>

        {/* Theme Colored Background Blobs */}
        <div
          className="position-absolute"
          style={{
            top: '-10%',
            left: '-5%',
            width: '600px',
            height: '600px',
            background: '#22C55E',
            filter: 'blur(160px)',
            zIndex: 1,
            opacity: 0.35,
            borderRadius: '50%',
          }}
        ></div>
        <div
          className="position-absolute"
          style={{
            bottom: '-15%',
            right: '-10%',
            width: '700px',
            height: '700px',
            background: '#166534',
            filter: 'blur(180px)',
            zIndex: 1,
            opacity: 0.25,
            borderRadius: '50%',
          }}
        ></div>
        <div
          className="position-absolute"
          style={{
            top: '25%',
            right: '20%',
            width: '450px',
            height: '450px',
            background: '#F0FDF4',
            filter: 'blur(120px)',
            zIndex: 1,
            opacity: 0.8,
            borderRadius: '50%',
          }}
        ></div>
        <div
          className="position-absolute"
          style={{
            bottom: '15%',
            left: '30%',
            width: '500px',
            height: '500px',
            background: '#22C55E',
            filter: 'blur(150px)',
            zIndex: 1,
            opacity: 0.2,
            borderRadius: '50%',
          }}
        ></div>
        <div
          className="position-absolute"
          style={{
            top: '40%',
            left: '15%',
            width: '400px',
            height: '400px',
            background: '#166534',
            filter: 'blur(140px)',
            zIndex: 1,
            opacity: 0.15,
            borderRadius: '50%',
          }}
        ></div>
      </section>

      {/* Main Content Area */}
      <section className="position-relative" style={{ background: '#FFFFFF', padding: '90px 0 110px 0' }}>
        <div className="container">
          <div className="row g-5">
            {/* Left Sticky Navigation Column */}
            <div className="col-lg-4 col-xl-3">
              <div
                className="legal-nav-container"
                style={{
                  position: 'sticky',
                  top: '120px',
                  background: '#FFFFFF',
                  borderRadius: '20px',
                  border: '1px solid #E2E8F0',
                  padding: '24px 18px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
                }}
              >
                <div className="px-2 mb-3 d-none d-lg-block">
                  <span
                    style={{
                      fontSize: '11px',
                      textTransform: 'uppercase',
                      letterSpacing: '1.5px',
                      color: '#94A3B8',
                      fontWeight: '800',
                    }}
                  >
                    Quick Navigation
                  </span>
                  <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#12263A', margin: '4px 0 0 0' }}>
                    Policy Sections
                  </h4>
                </div>

                <nav className="legal-nav-list d-flex flex-column gap-1">
                  {navItems.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className={`privacy-nav-link ${activeSection === item.id ? 'active' : ''}`}
                    >
                      <span className="privacy-nav-num">{item.num}</span>
                      <span>{item.title}</span>
                    </a>
                  ))}
                </nav>

                <hr className="d-none d-lg-block" style={{ borderColor: '#E2E8F0', margin: '24px 0' }} />

                {/* Direct Contact Box in Sidebar */}
                <div
                  className="d-none d-lg-block"
                  style={{
                    background: '#F0FDF4',
                    borderRadius: '14px',
                    padding: '20px',
                    border: '1px solid rgba(34, 197, 94, 0.25)',
                  }}
                >
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <i className="fa-solid fa-envelope" style={{ color: '#22C55E' }}></i>
                    <span style={{ fontSize: '13px', fontWeight: '800', color: '#12263A' }}>
                      Privacy Inquiries
                    </span>
                  </div>
                  <p style={{ fontSize: '13px', color: '#57534E', lineHeight: '1.5', margin: '0 0 12px 0' }}>
                    Have a specific question about data retention or compliance?
                  </p>
                  <a
                    href="mailto:support@talkinexx.com"
                    style={{
                      fontSize: '13px',
                      fontWeight: '700',
                      color: '#166534',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    support@talkinexx.com &rarr;
                  </a>
                </div>
              </div>
            </div>

            {/* Right Detailed Content Column */}
            <div className="col-lg-8 col-xl-9">
              {/* 1. Introduction */}
              <div id="intro" className="policy-card">
                <div className="policy-header">
                  <div className="policy-badge">1</div>
                  <div>
                    <h2 className="policy-title">Introduction</h2>
                    <span style={{ fontSize: '13px', color: '#94A3B8', fontWeight: '600' }}>
                      Scope &amp; Overview
                    </span>
                  </div>
                </div>
                <p className="policy-text">
                  We value your privacy and are committed to protecting your personal data. This Privacy Policy explains how our platform collects, uses, discloses, and safeguards your information when you use our WhatsApp CRM services, marketing tools, landing page builders, and CRM database connections. Please read this policy carefully.
                </p>
                <div
                  style={{
                    background: '#F8FAFC',
                    borderLeft: '4px solid #22C55E',
                    padding: '16px 20px',
                    borderRadius: '0 12px 12px 0',
                    marginTop: '20px',
                  }}
                >
                  <p style={{ margin: 0, fontSize: '14px', color: '#334155', lineHeight: '1.6' }}>
                    <strong>Key Commitment:</strong> Talkinexx acts as a trusted data processor and platform provider for your customer communications. We never monetize or sell your business contacts or customer messaging records to advertising platforms.
                  </p>
                </div>
              </div>

              {/* 2. Information We Collect */}
              <div id="collect" className="policy-card">
                <div className="policy-header">
                  <div className="policy-badge">2</div>
                  <div>
                    <h2 className="policy-title">Information We Collect</h2>
                    <span style={{ fontSize: '13px', color: '#94A3B8', fontWeight: '600' }}>
                      Data Categories &amp; Collection Methods
                    </span>
                  </div>
                </div>
                <p className="policy-text">
                  We collect information that you directly provide to us, as well as metadata generated automatically when using our integrations. This includes:
                </p>

                <div className="row g-3 mt-1">
                  <div className="col-md-6">
                    <div className="data-grid-item">
                      <div className="d-flex align-items-center gap-3 mb-2">
                        <div
                          style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '10px',
                            background: '#F0FDF4',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#22C55E',
                            fontSize: '16px',
                          }}
                        >
                          <i className="fal fa-user-circle"></i>
                        </div>
                        <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#12263A', margin: 0 }}>
                          Account Data
                        </h4>
                      </div>
                      <p style={{ fontSize: '14px', color: '#57534E', margin: 0, lineHeight: '1.6' }}>
                        Name, professional email address, company profile information, and secure password configurations.
                      </p>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="data-grid-item">
                      <div className="d-flex align-items-center gap-3 mb-2">
                        <div
                          style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '10px',
                            background: '#F0FDF4',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#22C55E',
                            fontSize: '16px',
                          }}
                        >
                          <i className="fal fa-key"></i>
                        </div>
                        <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#12263A', margin: 0 }}>
                          Integration Settings
                        </h4>
                      </div>
                      <p style={{ fontSize: '14px', color: '#57534E', margin: 0, lineHeight: '1.6' }}>
                        Meta developer credentials, WhatsApp Business API endpoints, API keys, and configurations for incoming webhook integrations.
                      </p>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="data-grid-item">
                      <div className="d-flex align-items-center gap-3 mb-2">
                        <div
                          style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '10px',
                            background: '#F0FDF4',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#22C55E',
                            fontSize: '16px',
                          }}
                        >
                          <i className="fal fa-database"></i>
                        </div>
                        <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#12263A', margin: 0 }}>
                          Customer Database Syncs
                        </h4>
                      </div>
                      <p style={{ fontSize: '14px', color: '#57534E', margin: 0, lineHeight: '1.6' }}>
                        Form inputs, phone number data logs, pipeline stage properties, and marketing campaigns content schedules.
                      </p>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="data-grid-item">
                      <div className="d-flex align-items-center gap-3 mb-2">
                        <div
                          style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '10px',
                            background: '#F0FDF4',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#22C55E',
                            fontSize: '16px',
                          }}
                        >
                          <i className="fal fa-analytics"></i>
                        </div>
                        <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#12263A', margin: 0 }}>
                          Usage Data
                        </h4>
                      </div>
                      <p style={{ fontSize: '14px', color: '#57534E', margin: 0, lineHeight: '1.6' }}>
                        Technical logs, IP addresses, browser specifications, and timestamp metrics related to your interactions with our dashboards.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. How We Use Your Information */}
              <div id="use" className="policy-card">
                <div className="policy-header">
                  <div className="policy-badge">3</div>
                  <div>
                    <h2 className="policy-title">How We Use Your Information</h2>
                    <span style={{ fontSize: '13px', color: '#94A3B8', fontWeight: '600' }}>
                      Operational Purposes &amp; Processing
                    </span>
                  </div>
                </div>
                <p className="policy-text">
                  We utilize the collected datasets to operate, scale, and secure our communications network:
                </p>

                <div className="mt-4">
                  <div className="use-item">
                    <i className="fa-regular fa-circle-check" style={{ color: '#22C55E', fontSize: '20px', marginTop: '2px', flexShrink: 0 }}></i>
                    <div>
                      <strong style={{ color: '#12263A', fontSize: '15px' }}>WhatsApp Broadcast &amp; Automation Delivery:</strong>
                      <p style={{ margin: '4px 0 0 0', color: '#57534E', fontSize: '14px', lineHeight: '1.6' }}>
                        To dispatch, log, and render WhatsApp broadcasts and automated messaging responses.
                      </p>
                    </div>
                  </div>

                  <div className="use-item">
                    <i className="fa-regular fa-circle-check" style={{ color: '#22C55E', fontSize: '20px', marginTop: '2px', flexShrink: 0 }}></i>
                    <div>
                      <strong style={{ color: '#12263A', fontSize: '15px' }}>Lead &amp; Pipeline Synchronization:</strong>
                      <p style={{ margin: '4px 0 0 0', color: '#57534E', fontSize: '14px', lineHeight: '1.6' }}>
                        To synchronize customer pipeline data securely between linked form integrations and lead databases.
                      </p>
                    </div>
                  </div>

                  <div className="use-item">
                    <i className="fa-regular fa-circle-check" style={{ color: '#22C55E', fontSize: '20px', marginTop: '2px', flexShrink: 0 }}></i>
                    <div>
                      <strong style={{ color: '#12263A', fontSize: '15px' }}>System Diagnostics &amp; Fraud Prevention:</strong>
                      <p style={{ margin: '4px 0 0 0', color: '#57534E', fontSize: '14px', lineHeight: '1.6' }}>
                        To diagnose system logs, optimize backend storage, and prevent fraudulent messaging distributions.
                      </p>
                    </div>
                  </div>

                  <div className="use-item">
                    <i className="fa-regular fa-circle-check" style={{ color: '#22C55E', fontSize: '20px', marginTop: '2px', flexShrink: 0 }}></i>
                    <div>
                      <strong style={{ color: '#12263A', fontSize: '15px' }}>Billing &amp; Quota Monitoring:</strong>
                      <p style={{ margin: '4px 0 0 0', color: '#57534E', fontSize: '14px', lineHeight: '1.6' }}>
                        To process billing transactions and provide real-time updates regarding usage limit metrics.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Data Retention & Security */}
              <div id="retention" className="policy-card">
                <div className="policy-header">
                  <div className="policy-badge">4</div>
                  <div>
                    <h2 className="policy-title">Data Retention &amp; Security</h2>
                    <span style={{ fontSize: '13px', color: '#94A3B8', fontWeight: '600' }}>
                      Encryption, Storage &amp; User Control
                    </span>
                  </div>
                </div>
                <p className="policy-text">
                  All data payloads are stored using secure cloud data architectures and encrypted both in transit (using TLS 1.3 protocols) and at rest. We store database indexes only as long as your account tier remains active. You may export or securely delete your campaign conversation records directly from your administration dashboard settings at any time.
                </p>

                <div className="row g-3 mt-3">
                  <div className="col-md-4">
                    <div
                      style={{
                        background: '#F0FDF4',
                        border: '1px solid rgba(34,197,94,0.3)',
                        borderRadius: '14px',
                        padding: '20px',
                        textAlign: 'center',
                      }}
                    >
                      <i className="fa-solid fa-lock-keyhole mb-2" style={{ fontSize: '26px', color: '#22C55E' }}></i>
                      <h5 style={{ fontSize: '15px', fontWeight: '800', color: '#12263A', marginBottom: '6px' }}>TLS 1.3 Protocol</h5>
                      <p style={{ fontSize: '13px', color: '#57534E', margin: 0 }}>End-to-end payload protection in transit.</p>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div
                      style={{
                        background: '#F8FAFC',
                        border: '1px solid #E2E8F0',
                        borderRadius: '14px',
                        padding: '20px',
                        textAlign: 'center',
                      }}
                    >
                      <i className="fa-solid fa-cloud-arrow-down mb-2" style={{ fontSize: '26px', color: '#12263A' }}></i>
                      <h5 style={{ fontSize: '15px', fontWeight: '800', color: '#12263A', marginBottom: '6px' }}>Data Portability</h5>
                      <p style={{ fontSize: '13px', color: '#57534E', margin: 0 }}>Export campaign and contact logs anytime.</p>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div
                      style={{
                        background: '#F8FAFC',
                        border: '1px solid #E2E8F0',
                        borderRadius: '14px',
                        padding: '20px',
                        textAlign: 'center',
                      }}
                    >
                      <i className="fa-solid fa-trash-can-check mb-2" style={{ fontSize: '26px', color: '#DC2626' }}></i>
                      <h5 style={{ fontSize: '15px', fontWeight: '800', color: '#12263A', marginBottom: '6px' }}>Immediate Purge</h5>
                      <p style={{ fontSize: '13px', color: '#57534E', margin: 0 }}>Permanent data erasure on account closure.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 5. Third-Party Service Integrations */}
              <div id="third-party" className="policy-card">
                <div className="policy-header">
                  <div className="policy-badge">5</div>
                  <div>
                    <h2 className="policy-title">Third-Party Service Integrations</h2>
                    <span style={{ fontSize: '13px', color: '#94A3B8', fontWeight: '600' }}>
                      Authorized API Partners &amp; Zero-Trading Guarantee
                    </span>
                  </div>
                </div>
                <p className="policy-text">
                  Our platform relies on authorized integrations with WhatsApp Business APIs (Meta Platforms, Inc.), Google Cloud Services, and external payment processors. Data exchanged with these services is governed by their respective developer integration terms. We do not sell or trade user databases to external advertising aggregators.
                </p>

                <div
                  className="d-flex align-items-center justify-content-between p-3 flex-wrap gap-3 mt-4"
                  style={{ background: '#FAFAF9', borderRadius: '14px', border: '1px solid #E2E8F0' }}
                >
                  <div className="d-flex align-items-center gap-3">
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        background: '#22C55E',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '22px',
                      }}
                    >
                      <i className="fab fa-whatsapp"></i>
                    </div>
                    <div>
                      <h5 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: '#12263A' }}>
                        Meta Official Cloud API
                      </h5>
                      <span style={{ fontSize: '13px', color: '#64748B' }}>Verified WhatsApp Business Platform</span>
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-3">
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        background: '#12263A',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px',
                      }}
                    >
                      <i className="fab fa-google"></i>
                    </div>
                    <div>
                      <h5 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: '#12263A' }}>
                        Google Cloud Infrastructure
                      </h5>
                      <span style={{ fontSize: '13px', color: '#64748B' }}>Encrypted storage &amp; high availability</span>
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-3">
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        background: '#0F172A',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '18px',
                      }}
                    >
                      <i className="fal fa-credit-card"></i>
                    </div>
                    <div>
                      <h5 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: '#12263A' }}>
                        PCI-DSS Compliant Billing
                      </h5>
                      <span style={{ fontSize: '13px', color: '#64748B' }}>Secure tokenized transactions</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 6. Changes to This Policy */}
              <div id="changes" className="policy-card">
                <div className="policy-header">
                  <div className="policy-badge">6</div>
                  <div>
                    <h2 className="policy-title">Changes to This Policy</h2>
                    <span style={{ fontSize: '13px', color: '#94A3B8', fontWeight: '600' }}>
                      Revisions &amp; Notifications
                    </span>
                  </div>
                </div>
                <p className="policy-text">
                  We reserve the right to revise this Privacy Policy periodically. Significant changes will be broadcasted to your registered workspace administrator email or displayed via service alerts. Continued utilization of our CRM tools indicates consent to updated guidelines.
                </p>
                <div
                  style={{
                    background: '#F0FDF4',
                    border: '1px solid rgba(34, 197, 94, 0.25)',
                    borderRadius: '12px',
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <i className="fal fa-bell" style={{ fontSize: '20px', color: '#22C55E' }}></i>
                  <span style={{ fontSize: '14px', color: '#166534', fontWeight: '600' }}>
                    Active workspace admins will always receive at least 14 days prior notice before major policy updates take effect.
                  </span>
                </div>
              </div>

              {/* 7. Contact Information */}
              <div id="contact" className="policy-card" style={{ borderColor: 'rgba(34, 197, 94, 0.35)' }}>
                <div className="policy-header">
                  <div className="policy-badge" style={{ background: '#22C55E', color: '#FFFFFF' }}>7</div>
                  <div>
                    <h2 className="policy-title">Contact Information</h2>
                    <span style={{ fontSize: '13px', color: '#94A3B8', fontWeight: '600' }}>
                      Data Protection Officer &amp; Support Inquiries
                    </span>
                  </div>
                </div>
                <p className="policy-text">
                  For questions regarding data processing policies, deletion requests, or integration security compliance details, please submit an inquiry to our support center at{' '}
                  <a
                    href="mailto:support@talkinexx.com"
                    style={{ color: '#22C55E', fontWeight: '700', textDecoration: 'none' }}
                  >
                    support@talkinexx.com
                  </a>.
                </p>

                <div
                  className="mt-4 p-4"
                  style={{
                    background: 'linear-gradient(135deg, #12263A 0%, #0d1a29 100%)',
                    borderRadius: '16px',
                    color: '#FFFFFF',
                  }}
                >
                  <div className="row align-items-center gy-3">
                    <div className="col-md-8">
                      <span
                        style={{
                          color: '#22C55E',
                          fontSize: '12px',
                          textTransform: 'uppercase',
                          letterSpacing: '1.5px',
                          fontWeight: '800',
                        }}
                      >
                        Talkinexx Privacy Desk
                      </span>
                      <h4 style={{ color: '#FFFFFF', fontSize: '1.4rem', fontWeight: '800', margin: '6px 0 8px 0' }}>
                        Need an immediate data export or compliance NDA?
                      </h4>
                      <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '14px', margin: 0 }}>
                        Our compliance team responds within 24 business hours to all formal inquiries.
                      </p>
                    </div>
                    <div className="col-md-4 text-md-end">
                      <a
                        href="mailto:support@talkinexx.com"
                        className="th-btn2"
                        style={{
                          backgroundColor: '#22C55E',
                          color: '#FFFFFF',
                          padding: '14px 28px',
                          borderRadius: '50px',
                          fontWeight: '700',
                          textDecoration: 'none',
                          display: 'inline-block',
                          boxShadow: 'none',
                        }}
                      >
                        Email Support
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Privacy;
