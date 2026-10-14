import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';

const Terms = () => {
  const [activeSection, setActiveSection] = useState('agreement');

  useEffect(() => {
    document.title = 'Terms & Conditions | Talkinexx - WhatsApp CRM & Automation';
    window.scrollTo(0, 0);

    const handleScroll = () => {
      const sections = [
        'agreement',
        'scope',
        'responsibilities',
        'billing',
        'ip',
        'liability',
        'termination',
        'disputes',
      ];
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
    { id: 'agreement', num: '1', title: 'Agreement to Terms' },
    { id: 'scope', num: '2', title: 'Scope of Service' },
    { id: 'responsibilities', num: '3', title: 'User Responsibilities' },
    { id: 'billing', num: '4', title: 'Fees, Plans, & Billing' },
    { id: 'ip', num: '5', title: 'Intellectual Property' },
    { id: 'liability', num: '6', title: 'Limitation of Liability' },
    { id: 'termination', num: '7', title: 'Account Termination' },
    { id: 'disputes', num: '8', title: 'Legal Disputes' },
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
        .terms-nav-link {
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
        .terms-nav-link:hover {
          color: #12263A;
          background: rgba(34, 197, 94, 0.08);
          transform: translateX(4px);
        }
        .terms-nav-link.active {
          color: #166534;
          background: #F0FDF4;
          border-left-color: #22C55E;
          font-weight: 700;
        }
        .terms-nav-num {
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
        .terms-nav-link.active .terms-nav-num {
          background: #22C55E;
          color: #FFFFFF;
        }
        .terms-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 20px;
          padding: 40px;
          margin-bottom: 32px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 20px -2px rgba(18, 38, 58, 0.04);
        }
        .terms-card:hover {
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
          .terms-nav-link {
            padding: 8px 14px !important;
            font-size: 13px !important;
            flex-shrink: 0 !important;
            border-left: none !important;
            border-bottom: 2px solid transparent !important;
            border-radius: 20px !important;
          }
          .terms-nav-link.active {
            border-bottom-color: #22C55E !important;
          }
          .terms-card {
            padding: 24px 18px !important;
            border-radius: 16px !important;
          }
        }
        .terms-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
          padding-bottom: 20px;
          border-bottom: 1px solid #F1F5F9;
        }
        .terms-badge {
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
        .terms-title {
          font-size: 1.6rem;
          font-weight: 800;
          color: #12263A;
          margin: 0;
          letter-spacing: -0.5px;
        }
        .terms-text {
          color: #57534E;
          font-size: 1.08rem;
          line-height: 1.75;
          margin-bottom: 16px;
        }
        .responsibility-item {
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
        .responsibility-item:hover {
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

      {/* Hero Section Matching the Pricing/Privacy Design Scheme */}
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
            TERMS OF SERVICE
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
            Terms &amp; Conditions
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
            Please read these terms and conditions carefully before utilizing the Talkinexx WhatsApp CRM services, marketing automation tools, and API integrations.
          </p>

          <div className="d-flex justify-content-center align-items-center gap-3 mt-4 flex-wrap">
            <span className="security-badge-pill">
              <i className="fab fa-whatsapp" style={{ color: '#22C55E' }}></i>
              Meta Commerce Compliant
            </span>
            <span className="security-badge-pill">
              <i className="fa-solid fa-file-contract" style={{ color: '#22C55E' }}></i>
              Transparent Licensing
            </span>
            <span className="security-badge-pill">
              <i className="fa-solid fa-shield-halved" style={{ color: '#22C55E' }}></i>
              Enterprise SLA Guarantee
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
            <i className="fal fa-balance-scale" style={{ fontSize: '22px', color: '#22C55E' }}></i>
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
                    Terms Sections
                  </h4>
                </div>

                <nav className="legal-nav-list d-flex flex-column gap-1">
                  {navItems.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className={`terms-nav-link ${activeSection === item.id ? 'active' : ''}`}
                    >
                      <span className="terms-nav-num">{item.num}</span>
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
                    <i className="fa-solid fa-scale-balanced" style={{ color: '#22C55E' }}></i>
                    <span style={{ fontSize: '13px', fontWeight: '800', color: '#12263A' }}>
                      Legal Counsel
                    </span>
                  </div>
                  <p style={{ fontSize: '13px', color: '#57534E', lineHeight: '1.5', margin: '0 0 12px 0' }}>
                    Need a custom Enterprise SLA, Master Services Agreement, or Data Processing Addendum?
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
              {/* 1. Agreement to Terms */}
              <div id="agreement" className="terms-card">
                <div className="terms-header">
                  <div className="terms-badge">1</div>
                  <div>
                    <h2 className="terms-title">Agreement to Terms</h2>
                    <span style={{ fontSize: '13px', color: '#94A3B8', fontWeight: '600' }}>
                      Binding Agreement &amp; Authorized Representation
                    </span>
                  </div>
                </div>
                <p className="terms-text">
                  By registering a business profile, initiating a trial tier, or accessing the Talkinexx messaging CRM portal, you agree to be bound by these Terms and Conditions. If you represent a company, you warrant that you possess the official authority to accept this agreement on behalf of the legal entity.
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
                    <strong>Note:</strong> If you do not have such legal authority, or if you do not agree with any portion of these terms, you must not access or utilize the Talkinexx platform or its associated APIs.
                  </p>
                </div>
              </div>

              {/* 2. Scope of Service */}
              <div id="scope" className="terms-card">
                <div className="terms-header">
                  <div className="terms-badge">2</div>
                  <div>
                    <h2 className="terms-title">Scope of Service</h2>
                    <span style={{ fontSize: '13px', color: '#94A3B8', fontWeight: '600' }}>
                      SaaS Modules, Continuous Delivery &amp; Availability
                    </span>
                  </div>
                </div>
                <p className="terms-text">
                  We supply cloud-based SaaS integrations connecting lead forms, social media post planning schedules, customized landing page elements, CRM workspace pipelines, and API integrations with the WhatsApp Business Platform. The services are provided "as available." We deploy updates regularly to improve performance, structure, and security.
                </p>

                <div className="row g-3 mt-2">
                  <div className="col-md-6">
                    <div
                      style={{
                        background: '#FAFAF9',
                        borderRadius: '14px',
                        border: '1px solid #E2E8F0',
                        padding: '20px',
                      }}
                    >
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <i className="fab fa-whatsapp" style={{ color: '#22C55E', fontSize: '20px' }}></i>
                        <h5 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: '#12263A' }}>
                          WhatsApp Cloud API
                        </h5>
                      </div>
                      <p style={{ margin: 0, fontSize: '13px', color: '#57534E', lineHeight: '1.6' }}>
                        Official Meta Graph API gateway for broadcast campaigns, chatbots, and customer conversations.
                      </p>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div
                      style={{
                        background: '#FAFAF9',
                        borderRadius: '14px',
                        border: '1px solid #E2E8F0',
                        padding: '20px',
                      }}
                    >
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <i className="fal fa-layer-group" style={{ color: '#22C55E', fontSize: '20px' }}></i>
                        <h5 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: '#12263A' }}>
                          CRM &amp; Lead Workspaces
                        </h5>
                      </div>
                      <p style={{ margin: 0, fontSize: '13px', color: '#57534E', lineHeight: '1.6' }}>
                        Lead capture forms, custom landing pages, retargeting modules, and real-time contact pipelines.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. User Responsibilities & Acceptable Use */}
              <div id="responsibilities" className="terms-card">
                <div className="terms-header">
                  <div className="terms-badge">3</div>
                  <div>
                    <h2 className="terms-title">User Responsibilities &amp; Acceptable Use</h2>
                    <span style={{ fontSize: '13px', color: '#94A3B8', fontWeight: '600' }}>
                      Compliance Warranties &amp; Spam Prohibition
                    </span>
                  </div>
                </div>
                <p className="terms-text">
                  As a client administrator, you represent and warrant that:
                </p>

                <div className="mt-3">
                  <div className="responsibility-item">
                    <i className="fa-regular fa-circle-check" style={{ color: '#22C55E', fontSize: '20px', marginTop: '2px', flexShrink: 0 }}></i>
                    <div>
                      <strong style={{ color: '#12263A', fontSize: '15px' }}>WhatsApp Commerce &amp; Opt-In Policies:</strong>
                      <p style={{ margin: '4px 0 0 0', color: '#57534E', fontSize: '14px', lineHeight: '1.6' }}>
                        You will comply with WhatsApp Commerce and Business Policies regarding verified customer opt-ins.
                      </p>
                    </div>
                  </div>

                  <div className="responsibility-item">
                    <i className="fa-regular fa-circle-check" style={{ color: '#22C55E', fontSize: '20px', marginTop: '2px', flexShrink: 0 }}></i>
                    <div>
                      <strong style={{ color: '#12263A', fontSize: '15px' }}>Prohibition of Spam &amp; Fraud:</strong>
                      <p style={{ margin: '4px 0 0 0', color: '#57534E', fontSize: '14px', lineHeight: '1.6' }}>
                        You will not distribute unsolicited spam broadcasts or fraudulent messaging sequences.
                      </p>
                    </div>
                  </div>

                  <div className="responsibility-item">
                    <i className="fa-regular fa-circle-check" style={{ color: '#22C55E', fontSize: '20px', marginTop: '2px', flexShrink: 0 }}></i>
                    <div>
                      <strong style={{ color: '#12263A', fontSize: '15px' }}>Data Accuracy &amp; Integrity:</strong>
                      <p style={{ margin: '4px 0 0 0', color: '#57534E', fontSize: '14px', lineHeight: '1.6' }}>
                        You remain solely responsible for the authenticity of the information stored inside your linked CRM databases.
                      </p>
                    </div>
                  </div>

                  <div className="responsibility-item">
                    <i className="fa-regular fa-circle-check" style={{ color: '#22C55E', fontSize: '20px', marginTop: '2px', flexShrink: 0 }}></i>
                    <div>
                      <strong style={{ color: '#12263A', fontSize: '15px' }}>Credential &amp; Team Account Security:</strong>
                      <p style={{ margin: '4px 0 0 0', color: '#57534E', fontSize: '14px', lineHeight: '1.6' }}>
                        You will protect access credentials and take responsibility for all activities occurring under your team members' accounts.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Fees, Plans, & Billing */}
              <div id="billing" className="terms-card">
                <div className="terms-header">
                  <div className="terms-badge">4</div>
                  <div>
                    <h2 className="terms-title">Fees, Plans, &amp; Billing</h2>
                    <span style={{ fontSize: '13px', color: '#94A3B8', fontWeight: '600' }}>
                      Subscription Intervals, Meta API Charges &amp; Overdue Accounts
                    </span>
                  </div>
                </div>
                <p className="terms-text">
                  Subscription fees are charged at the beginning of each billing interval based on your selected package limits. Meta WhatsApp API usage fees are invoiced separately or calculated based on your Meta account balance. Payment defaults or failure to settle overdue billing notices within 14 business days may result in campaign execution limits or total temporary workspace suspensions.
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
                      <i className="fa-solid fa-calendar-check mb-2" style={{ fontSize: '26px', color: '#22C55E' }}></i>
                      <h5 style={{ fontSize: '15px', fontWeight: '800', color: '#12263A', marginBottom: '6px' }}>In-Advance Billing</h5>
                      <p style={{ fontSize: '13px', color: '#57534E', margin: 0 }}>Subscriptions billed at interval start.</p>
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
                      <i className="fab fa-whatsapp mb-2" style={{ fontSize: '26px', color: '#12263A' }}></i>
                      <h5 style={{ fontSize: '15px', fontWeight: '800', color: '#12263A', marginBottom: '6px' }}>Meta Conversation Fees</h5>
                      <p style={{ fontSize: '13px', color: '#57534E', margin: 0 }}>Invoiced separately per Meta rate card.</p>
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
                      <i className="fa-solid fa-clock-rotate-left mb-2" style={{ fontSize: '26px', color: '#DC2626' }}></i>
                      <h5 style={{ fontSize: '15px', fontWeight: '800', color: '#12263A', marginBottom: '6px' }}>14-Day Grace Window</h5>
                      <p style={{ fontSize: '13px', color: '#57534E', margin: 0 }}>Grace period before account restriction.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 5. Intellectual Property */}
              <div id="ip" className="terms-card">
                <div className="terms-header">
                  <div className="terms-badge">5</div>
                  <div>
                    <h2 className="terms-title">Intellectual Property</h2>
                    <span style={{ fontSize: '13px', color: '#94A3B8', fontWeight: '600' }}>
                      Proprietary Software, Logos &amp; Limited License
                    </span>
                  </div>
                </div>
                <p className="terms-text">
                  All assets, code structures, interface widgets, system logos, and landing page designs are the exclusive intellectual property of Talkinexx. You receive a limited, non-assignable license to run the SaaS tools for internal corporate communications. You may not reverse-engineer, mirror, or repackage dashboard components without prior written consent.
                </p>
                <div
                  style={{
                    background: '#F8FAFC',
                    borderLeft: '4px solid #12263A',
                    padding: '16px 20px',
                    borderRadius: '0 12px 12px 0',
                    marginTop: '20px',
                  }}
                >
                  <p style={{ margin: 0, fontSize: '14px', color: '#334155', lineHeight: '1.6' }}>
                    <strong>License Grant:</strong> Your active plan grants a revocable, non-exclusive license solely for legitimate business communications via your authorized Talkinexx workspace.
                  </p>
                </div>
              </div>

              {/* 6. Limitation of Liability */}
              <div id="liability" className="terms-card">
                <div className="terms-header">
                  <div className="terms-badge">6</div>
                  <div>
                    <h2 className="terms-title">Limitation of Liability</h2>
                    <span style={{ fontSize: '13px', color: '#94A3B8', fontWeight: '600' }}>
                      Risk Allocation &amp; Total Financial Cap
                    </span>
                  </div>
                </div>
                <p className="terms-text">
                  In no event shall Talkinexx be liable for database sync failures, third-party webhook blockages, WhatsApp phone number suspensions by Meta, loss of profits, or data leaks resulting from unsecure admin API key disclosures. Our total liability is restricted to the total amount paid by you during the three months preceding the liability claim.
                </p>

                <div
                  className="mt-4 p-3"
                  style={{
                    background: 'rgba(239, 68, 68, 0.06)',
                    border: '1px solid rgba(239, 68, 68, 0.25)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                  }}
                >
                  <i className="fa-solid fa-triangle-exclamation" style={{ fontSize: '22px', color: '#DC2626' }}></i>
                  <span style={{ fontSize: '14px', color: '#991B1B', fontWeight: '600', lineHeight: '1.5' }}>
                    <strong>Liability Cap:</strong> Maximum cumulative financial remedy under any claim is strictly capped at the cumulative software fees paid by your organization over the preceding 3-month window.
                  </span>
                </div>
              </div>

              {/* 7. Account Termination */}
              <div id="termination" className="terms-card">
                <div className="terms-header">
                  <div className="terms-badge">7</div>
                  <div>
                    <h2 className="terms-title">Account Termination</h2>
                    <span style={{ fontSize: '13px', color: '#94A3B8', fontWeight: '600' }}>
                      Self-Serve Cancellation &amp; Non-Compliance Revocation
                    </span>
                  </div>
                </div>
                <p className="terms-text">
                  You can cancel your subscription plan at any time via your account billing administration module. We retain the authority to terminate accounts immediately if customer usage triggers repeated spam violations or breaches WhatsApp developer guidelines.
                </p>

                <div className="row g-3 mt-2">
                  <div className="col-md-6">
                    <div
                      style={{
                        background: '#FAFAF9',
                        borderRadius: '14px',
                        border: '1px solid #E2E8F0',
                        padding: '18px',
                      }}
                    >
                      <h5 style={{ fontSize: '15px', fontWeight: '800', color: '#12263A', marginBottom: '6px' }}>
                        <i className="fa-solid fa-user-xmark me-2" style={{ color: '#22C55E' }}></i>
                        Self-Serve Cancellation
                      </h5>
                      <p style={{ margin: 0, fontSize: '13px', color: '#57534E', lineHeight: '1.5' }}>
                        Cancel anytime with one click directly inside your billing dashboard without lock-in penalties.
                      </p>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div
                      style={{
                        background: '#FAFAF9',
                        borderRadius: '14px',
                        border: '1px solid #E2E8F0',
                        padding: '18px',
                      }}
                    >
                      <h5 style={{ fontSize: '15px', fontWeight: '800', color: '#12263A', marginBottom: '6px' }}>
                        <i className="fa-solid fa-ban me-2" style={{ color: '#DC2626' }}></i>
                        Zero Spam Tolerance
                      </h5>
                      <p style={{ margin: 0, fontSize: '13px', color: '#57534E', lineHeight: '1.5' }}>
                        Accounts executing unauthorized spam or violating Meta Cloud policies are subject to instant closure.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 8. Legal Disputes */}
              <div id="disputes" className="terms-card" style={{ borderColor: 'rgba(34, 197, 94, 0.35)' }}>
                <div className="terms-header">
                  <div className="terms-badge" style={{ background: '#22C55E', color: '#FFFFFF' }}>8</div>
                  <div>
                    <h2 className="terms-title">Legal Disputes</h2>
                    <span style={{ fontSize: '13px', color: '#94A3B8', fontWeight: '600' }}>
                      Governing Law &amp; Judicial Jurisdiction
                    </span>
                  </div>
                </div>
                <p className="terms-text">
                  These terms are governed by the local jurisdiction's corporate statutes. Any litigation arising out of these conditions shall be adjudicated exclusively within competent regional commercial courts.
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
                        Talkinexx Legal Team
                      </span>
                      <h4 style={{ color: '#FFFFFF', fontSize: '1.4rem', fontWeight: '800', margin: '6px 0 8px 0' }}>
                        Questions regarding our Terms of Service?
                      </h4>
                      <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '14px', margin: 0 }}>
                        Submit your legal questions, enterprise contracting inquiries, or partnership terms directly to our team.
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
                        Contact Legal
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

export default Terms;
