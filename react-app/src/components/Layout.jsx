import React, { useState, useEffect } from 'react';
import SEO from './SEO';

const Layout = ({ children, seo }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <SEO customSeo={seo} />
      <div className="mouseCursor cursor-outer" />
      <div className="mouseCursor cursor-inner" />

      {/*==============================
        Mobile Drawer Overlay & Menu
      ============================== */}
      <div
        className={`th-menu-wrapper ${isMobileMenuOpen ? 'th-body-visible' : ''}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) closeMobileMenu();
        }}
        aria-hidden={!isMobileMenuOpen}
      >
        <div className="th-menu-area">
          <div className="drawer-header d-flex align-items-center justify-content-between pb-3 mb-3 border-bottom">
            <a href="/" onClick={closeMobileMenu} className="d-inline-block">
              <img src="/assets/img/logo.png" alt="Talkinexx Logo" style={{ width: '145px', height: 'auto' }} />
            </a>
            <button
              type="button"
              className="drawer-close-btn"
              onClick={closeMobileMenu}
              aria-label="Close menu"
            >
              <i className="fal fa-times" />
            </button>
          </div>

          <div className="th-mobile-menu">
            <ul className="mobile-nav-list list-unstyled m-0 p-0">
              <li>
                <a href="/" onClick={closeMobileMenu} className="mobile-nav-link">
                  <i className="fal fa-home me-2 text-theme" /> Home
                </a>
              </li>

              {/* Services Accordion */}
              <li className="mobile-menu-has-children">
                <div
                  className="mobile-nav-accordion-header d-flex justify-content-between align-items-center"
                  onClick={() => setIsServicesOpen(!isServicesOpen)}
                >
                  <span className="mobile-nav-link p-0">
                    <i className="fal fa-layer-group me-2 text-theme" /> Services
                  </span>
                  <button
                    type="button"
                    className="accordion-toggle-btn"
                    aria-label="Toggle Services submenu"
                  >
                    <i className={`far fa-chevron-${isServicesOpen ? 'up' : 'down'}`} />
                  </button>
                </div>

                {isServicesOpen && (
                  <ul className="mobile-sub-menu list-unstyled ps-3 mt-2 mb-2 border-start border-2 border-success">
                    <li>
                      <a href="/whatsapp-campaigns" onClick={closeMobileMenu}>
                        <i className="fal fa-paper-plane me-2 text-theme" /> Targeted Campaigns
                      </a>
                    </li>
                    <li>
                      <a href="/automated-messaging" onClick={closeMobileMenu}>
                        <i className="fal fa-clock me-2 text-theme" /> Automated Messaging
                      </a>
                    </li>
                    <li>
                      <a href="/whatsapp-ai-copilot" onClick={closeMobileMenu}>
                        <i className="fal fa-robot me-2 text-theme" /> WhatsApp AI Copilot
                      </a>
                    </li>
                    <li>
                      <a href="/contact-list-retargeting" onClick={closeMobileMenu}>
                        <i className="fal fa-database me-2 text-theme" /> List Retargeting
                      </a>
                    </li>
                    <li>
                      <a href="/whatsapp-analytics" onClick={closeMobileMenu}>
                        <i className="fal fa-chart-bar me-2 text-theme" /> WhatsApp Analytics
                      </a>
                    </li>
                  </ul>
                )}
              </li>

              <li>
                <a href="/pricing" onClick={closeMobileMenu} className="mobile-nav-link">
                  <i className="fal fa-tags me-2 text-theme" /> Pricing
                </a>
              </li>
              <li>
                <a href="/contact" onClick={closeMobileMenu} className="mobile-nav-link">
                  <i className="fal fa-envelope me-2 text-theme" /> Contact
                </a>
              </li>
              <li>
                <a href="/privacy" onClick={closeMobileMenu} className="mobile-nav-link">
                  <i className="fal fa-shield-check me-2 text-theme" /> Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" onClick={closeMobileMenu} className="mobile-nav-link">
                  <i className="fal fa-file-contract me-2 text-theme" /> Terms &amp; Conditions
                </a>
              </li>
            </ul>
          </div>

          {/* Drawer Footer Actions */}
          <div className="drawer-footer mt-auto pt-4 border-top">
            <div className="d-flex flex-column gap-2 mb-3">
              <a
                href="/login"
                className="drawer-action-btn secondary-btn"
                onClick={closeMobileMenu}
              >
                <i className="far fa-user me-2" /> Login
              </a>
              <a
                href="/signup"
                className="drawer-action-btn primary-btn"
                onClick={closeMobileMenu}
              >
                Start Free Trial &rarr;
              </a>
            </div>
            <p className="text-muted text-center m-0" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
              Meta Verified Partner &bull; support@talkinexx.com
            </p>
          </div>
        </div>
      </div>

      {/*==============================
        Global Responsive Styles
      ============================== */}
      <style>{`
        /* Universal Responsive & Overflow Prevention */
        html, body {
          overflow-x: hidden !important;
          max-width: 100vw !important;
          width: 100% !important;
          position: relative;
        }
        *, *::before, *::after {
          box-sizing: border-box;
        }
        img, video, iframe {
          max-width: 100%;
          height: auto;
        }

        /* Hero Typography Responsiveness across all pages */
        .hero-section h1, .hero-title {
          font-size: clamp(2rem, 5.5vw, 4rem) !important;
          line-height: 1.15 !important;
          word-break: break-word !important;
        }
        .hero-section p, .hero-text {
          font-size: clamp(1rem, 2.5vw, 1.25rem) !important;
          line-height: 1.6 !important;
        }

        /* Prevent Hero Floating Badges from overlapping text on tablets & mobile */
        @media (max-width: 991px) {
          .hero-section {
            padding: 130px 0 60px 0 !important;
          }
          .hero-floating-badge,
          .hero-section .position-absolute[style*="top: 20%"],
          .hero-section .position-absolute[style*="top: 25%"],
          .hero-section .position-absolute[style*="top: 28%"],
          .hero-section .position-absolute[style*="top: 30%"],
          .hero-section .position-absolute[style*="bottom: 12%"],
          .hero-section .position-absolute[style*="bottom: 15%"] {
            display: none !important;
          }
        }

        /* Header Responsive Adjustments */
        .header-logo img {
          max-width: 175px;
          height: auto;
          transition: max-width 0.3s ease;
        }
        @media (max-width: 575px) {
          .header-logo img {
            max-width: 135px !important;
          }
        }

        /* Hamburger button modern styling */
        .talkinexx-menu-toggle {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          color: #12263A;
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 4px 12px rgba(0,0,0,0.04);
        }
        .talkinexx-menu-toggle:hover {
          background: #12263A;
          color: #FFFFFF;
          border-color: #12263A;
        }

        /* Mobile Drawer Layout */
        .th-menu-wrapper {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          bottom: 0 !important;
          right: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          background: rgba(18, 38, 58, 0.65) !important;
          backdrop-filter: blur(4px) !important;
          -webkit-backdrop-filter: blur(4px) !important;
          z-index: 999999 !important;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.3s ease, visibility 0.3s ease !important;
        }
        .th-menu-wrapper.th-body-visible {
          opacity: 1 !important;
          visibility: visible !important;
        }
        .th-menu-wrapper .th-menu-area {
          width: 86% !important;
          max-width: 320px !important;
          height: 100% !important;
          background: #FFFFFF !important;
          box-shadow: 6px 0 25px rgba(0, 0, 0, 0.15) !important;
          position: absolute !important;
          left: -100% !important;
          top: 0 !important;
          bottom: 0 !important;
          transition: left 0.35s cubic-bezier(0.16, 1, 0.3, 1) !important;
          display: flex !important;
          flex-direction: column !important;
          padding: 24px 20px !important;
          overflow-y: auto !important;
          z-index: 1000000 !important;
          border-right: 3px solid #22C55E !important;
        }
        .th-menu-wrapper.th-body-visible .th-menu-area {
          left: 0 !important;
        }
        .drawer-close-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1px solid #E2E8F0;
          background: #FAFAF9;
          color: #12263A;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .drawer-close-btn:hover {
          background: #12263A;
          color: #FFFFFF;
          border-color: #12263A;
        }
        .mobile-nav-link {
          display: block;
          padding: 12px 14px;
          font-size: 15px;
          font-weight: 700;
          color: #12263A;
          text-decoration: none;
          border-radius: 8px;
          transition: all 0.2s ease;
        }
        .mobile-nav-link:hover {
          background: #F0FDF4;
          color: #166534;
        }
        .mobile-nav-accordion-header {
          padding: 12px 14px;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        .mobile-nav-accordion-header:hover {
          background: #F0FDF4;
        }
        .accordion-toggle-btn {
          background: transparent;
          border: none;
          color: #12263A;
          font-size: 13px;
          cursor: pointer;
          padding: 4px;
        }
        .mobile-sub-menu li a {
          display: block;
          padding: 8px 12px;
          font-size: 13.5px;
          font-weight: 600;
          color: #57534E;
          text-decoration: none;
          border-radius: 6px;
          transition: all 0.2s ease;
        }
        .mobile-sub-menu li a:hover {
          color: #166534;
          background: #F0FDF4;
          transform: translateX(4px);
        }
        .drawer-action-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 14px 24px;
          border-radius: 50px;
          font-weight: 700;
          font-size: 14px;
          text-decoration: none;
          transition: all 0.25s ease;
          box-shadow: none !important;
        }
        .drawer-action-btn.primary-btn {
          background: #22C55E;
          color: #FFFFFF;
        }
        .drawer-action-btn.primary-btn:hover {
          transform: translateY(-2px);
          color: #FFFFFF;
        }
        .drawer-action-btn.secondary-btn {
          background: #FFFFFF;
          color: #12263A;
          border: 1px solid #E2E8F0;
        }
        .drawer-action-btn.secondary-btn:hover {
          background: #12263A;
          color: #FFFFFF;
          border-color: #12263A;
        }

        /* Desktop Mega Menu */
        .custom-mega-menu {
          width: 360px !important;
          padding: 8px 8px 0 8px !important;
          border-radius: 12px !important;
          box-shadow: 0 16px 40px rgba(34,197,94,0.25) !important;
          background: #22C55E !important;
          border: 2px solid #16a34a !important;
          transform-origin: top center;
        }
        .custom-mega-menu li {
          margin: 0 !important;
          display: block !important;
        }
        .custom-mega-menu li::before, .custom-mega-menu li::after,
        .custom-mega-menu a::before, .custom-mega-menu a::after {
          display: none !important;
        }
        .custom-mega-menu .mega-menu-item {
          display: flex !important;
          align-items: flex-start !important;
          gap: 16px !important;
          padding: 14px 16px !important;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
          border-bottom: none !important;
          border-radius: 8px !important;
          margin-bottom: 2px !important;
          background: transparent !important;
          position: relative;
          overflow: hidden;
          z-index: 1;
        }
        .custom-mega-menu .mega-menu-item::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: #12263A;
          border-radius: 8px;
          z-index: -1;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          display: block !important;
        }
        .custom-mega-menu .mega-menu-item:hover::before {
          transform: scaleX(1);
        }
        .custom-mega-menu .mega-menu-item:hover {
          transform: translateX(4px);
        }
        .custom-mega-menu .mega-menu-item .icon-box {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #22C55E;
          font-size: 20px;
          flex-shrink: 0;
          background: #12263A;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .custom-mega-menu .mega-menu-item:hover .icon-box {
          background: #22C55E;
          color: #12263A;
          transform: scale(1.15) rotate(-5deg);
        }
        .custom-mega-menu .mega-menu-item .text-box {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
        }
        .custom-mega-menu .mega-menu-item .text-box h4 {
          font-size: 15px !important;
          font-weight: 800 !important;
          color: #12263A !important;
          margin-bottom: 2px !important;
          line-height: 1.3 !important;
          padding: 0 !important;
          text-transform: none !important;
          transition: color 0.3s ease !important;
        }
        .custom-mega-menu .mega-menu-item .text-box p {
          font-size: 13px !important;
          color: rgba(18,38,58,0.85) !important;
          margin: 0 !important;
          line-height: 1.4 !important;
          text-transform: none !important;
          white-space: normal !important;
          font-weight: 500;
          transition: color 0.3s ease !important;
        }
        .custom-mega-menu .mega-menu-item:hover .text-box h4 {
          color: #fff !important;
        }
        .custom-mega-menu .mega-menu-item:hover .text-box p {
          color: rgba(255,255,255,0.8) !important;
        }
        .custom-mega-menu .mega-menu-footer {
          display: flex !important;
          justify-content: space-between !important;
          align-items: center !important;
          padding: 16px 20px !important;
          background: #16a34a !important;
          border-top: 1px solid #15803d !important;
          border-radius: 0 0 10px 10px !important;
          margin: 8px -8px 0 -8px !important;
        }
        .custom-mega-menu .mega-menu-footer span {
          font-size: 13px;
          color: #12263A;
          font-weight: 600;
          text-transform: none !important;
        }
        .custom-mega-menu .mega-menu-footer .footer-link {
          padding: 0 !important;
          font-size: 13px !important;
          font-weight: 800 !important;
          color: #12263A !important;
          background: transparent !important;
          display: inline-flex !important;
          align-items: center;
          border-bottom: none !important;
          text-transform: none !important;
          transition: all 0.3s ease !important;
        }
        .custom-mega-menu .mega-menu-footer .footer-link:hover {
          color: #fff !important;
          transform: translateX(4px);
        }

        /* Strict Button Guidelines from GEMINI.md: NO GLOW, fully rounded */
        .th-btn, .th-btn2, button, a.th-btn, a.th-btn2, input[type="submit"] {
          box-shadow: none !important;
        }
        .th-btn:hover, .th-btn2:hover, button:hover, a.th-btn:hover, a.th-btn2:hover, input[type="submit"]:hover {
          box-shadow: none !important;
        }

        /* Footer Responsive Formatting */
        @media (max-width: 767px) {
          .footer-wrapper .footer-top .btn-group {
            flex-direction: column;
            width: 100%;
            gap: 12px;
          }
          .footer-wrapper .footer-top .btn-group a {
            width: 100%;
            text-align: center;
            justify-content: center;
          }
          .copyright-wrap .row {
            text-align: center;
            justify-content: center;
          }
          .copyright-wrap .d-flex {
            justify-content: center;
            flex-wrap: wrap;
            gap: 16px !important;
          }
        }
      `}</style>

      {/*==============================
        Header Area
      ==============================*/}
      <header className="th-header header-layout2 header-absolute">
        <div className="sticky-wrapper">
          <div className="menu-area">
            <div className="container th-container">
              <div className="row align-items-center justify-content-between">
                {/* Logo */}
                <div className="col-auto">
                  <div className="header-logo">
                    <a href="/">
                      <img src="/assets/img/logo.png" alt="Talkinexx Logo" />
                    </a>
                  </div>
                </div>

                {/* Desktop Navigation */}
                <div className="col-auto">
                  <nav className="main-menu style2 d-none d-lg-inline-block">
                    <ul>
                      <li className="menu-item-has-children">
                        <a href="/#">Services</a>
                        <ul className="sub-menu custom-mega-menu">
                          <li>
                            <a href="/whatsapp-campaigns" className="mega-menu-item">
                              <div className="icon-box"><i className="fal fa-paper-plane"></i></div>
                              <div className="text-box">
                                <h4>Targeted WhatsApp Campaigns</h4>
                                <p>Personalized broadcasts with real-time tracking.</p>
                              </div>
                            </a>
                          </li>
                          <li>
                            <a href="/automated-messaging" className="mega-menu-item">
                              <div className="icon-box"><i className="fal fa-clock"></i></div>
                              <div className="text-box">
                                <h4>Automated WhatsApp Messaging</h4>
                                <p>Birthday greetings &amp; automated follow-ups.</p>
                              </div>
                            </a>
                          </li>
                          <li>
                            <a href="/whatsapp-ai-copilot" className="mega-menu-item">
                              <div className="icon-box"><i className="fal fa-sparkles"></i></div>
                              <div className="text-box">
                                <h4>WhatsApp AI Copilot</h4>
                                <p>Automate chat answers &amp; resolve queries 24/7.</p>
                              </div>
                            </a>
                          </li>
                          <li>
                            <a href="/contact-list-retargeting" className="mega-menu-item">
                              <div className="icon-box"><i className="fal fa-database"></i></div>
                              <div className="text-box">
                                <h4>Contact List Retargeting</h4>
                                <p>Boost bookings and conversions via WhatsApp.</p>
                              </div>
                            </a>
                          </li>
                          <li>
                            <a href="/whatsapp-analytics" className="mega-menu-item">
                              <div className="icon-box"><i className="fal fa-chart-bar"></i></div>
                              <div className="text-box">
                                <h4>WhatsApp Analytics</h4>
                                <p>Track message delivery, open rates, and ROI.</p>
                              </div>
                            </a>
                          </li>
                          <li className="mega-menu-footer">
                            <span>Need a custom solution?</span>
                            <a href="/pricing" className="footer-link">View Pricing &rarr;</a>
                          </li>
                        </ul>
                      </li>
                      <li><a href="/pricing">Pricing</a></li>
                      <li><a href="/contact">Contact</a></li>
                    </ul>
                  </nav>

                  {/* Tablet/Mobile Hamburger Button */}
                  <div className="d-inline-flex d-lg-none align-items-center gap-2">
                    <a
                      href="/signup"
                      className="d-none d-sm-inline-flex align-items-center text-white"
                      style={{
                        background: '#22C55E',
                        padding: '8px 18px',
                        borderRadius: '30px',
                        fontSize: '12px',
                        fontWeight: '700',
                        textDecoration: 'none',
                        transition: 'all 0.25s ease',
                      }}
                    >
                      Free Trial
                    </a>
                    <button
                      type="button"
                      className="talkinexx-menu-toggle"
                      onClick={() => setIsMobileMenuOpen(true)}
                      aria-label="Open navigation menu"
                    >
                      <i className="far fa-bars" />
                    </button>
                  </div>
                </div>

                {/* Desktop Action Buttons */}
                <div className="col-auto d-none d-lg-block">
                  <div className="header-button d-flex align-items-center gap-3">
                    <a href="/login" className="th-btn2 style2">
                      Login <img src="/assets/img/icon/user.svg" alt="" />
                    </a>
                    <a href="/signup" className="th-btn2">
                      Start Free Trial
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Viewport */}
      <main>
        {children}
      </main>

      {/*==============================
        Footer Area
      ==============================*/}
      <footer className="footer-wrapper footer-layout2" data-bg-src="/assets/img/bg/footer_bg_2.png">
        <div className="container">
          <div className="widget-area">
            <div className="footer-top">
              <div className="row gx-40 gy-4 justify-content-center justify-content-lg-between align-items-center">
                <div className="col-lg-5 col-xl-4 text-center text-lg-start">
                  <div className="footer-logo">
                    <a href="/">
                      <img src="/assets/img/logo-2.png" alt="Talkinexx Logo" />
                    </a>
                  </div>
                </div>
                <div className="col-lg-auto col-xl-auto text-center text-lg-start">
                  <div>
                    <h2 className="box-title text-white mb-3">Try Talkinexx Today Free</h2>
                    <div className="btn-group justify-content-center justify-content-lg-start flex-wrap gap-2">
                      <a href="/signup" className="th-btn2">Start Free Trial</a>
                      <a href="/contact" className="th-btn2 style3">Book a Demo</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row gy-4 justify-content-between">
            {/* Brand Column */}
            <div className="col-md-6 col-xl-3">
              <div className="widget footer-widget">
                <h3 className="widget_title" style={{ textTransform: 'uppercase', letterSpacing: '1px' }}>Talkinexx</h3>
                <div className="th-widget-about">
                  <p className="about-text" style={{ fontSize: '14px', lineHeight: '1.7' }}>
                    The enterprise-grade WhatsApp automation platform for teams who value speed, efficiency, and real-time customer engagement.
                  </p>
                  {/* Social media links hidden for future use */}
                  {/*
                  <div className="th-social">
                    <a href="https://www.twitter.com/" aria-label="Twitter"><i className="fab fa-twitter" /></a>
                    <a href="https://github.com/" aria-label="GitHub"><i className="fab fa-github" /></a>
                    <a href="https://www.linkedin.com/" aria-label="LinkedIn"><i className="fab fa-linkedin-in" /></a>
                  </div>
                  */}
                </div>
              </div>
            </div>

            {/* Company Column */}
            <div className="col-6 col-md-6 col-xl-auto">
              <div className="widget widget_nav_menu footer-widget">
                <h3 className="widget_title" style={{ textTransform: 'uppercase', letterSpacing: '1px', fontSize: '13px', color: '#8892A0' }}>Company</h3>
                <div className="menu-all-pages-container">
                  <ul className="menu">
                    <li><a href="/">Home Page</a></li>
                    <li><a href="/pricing">Pricing Plans</a></li>
                    <li><a href="/contact">Contact Sales</a></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Services Column */}
            <div className="col-6 col-md-6 col-xl-auto">
              <div className="widget widget_nav_menu footer-widget">
                <h3 className="widget_title" style={{ textTransform: 'uppercase', letterSpacing: '1px', fontSize: '13px', color: '#8892A0' }}>Services</h3>
                <div className="menu-all-pages-container">
                  <ul className="menu">
                    <li><a href="/whatsapp-campaigns">WhatsApp Campaigns</a></li>
                    <li><a href="/automated-messaging">Automated Messaging</a></li>
                    <li><a href="/whatsapp-ai-copilot">AI Auto Response</a></li>
                    <li><a href="/login">WhatsApp Flow Builder</a></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Trust & Legal Column */}
            <div className="col-md-6 col-xl-auto">
              <div className="widget widget_nav_menu footer-widget">
                <h3 className="widget_title" style={{ textTransform: 'uppercase', letterSpacing: '1px', fontSize: '13px', color: '#8892A0' }}>Trust &amp; Legal</h3>
                <div className="menu-all-pages-container">
                  <ul className="menu">
                    <li><a href="/privacy">Privacy Policy</a></li>
                    <li><a href="/terms">Terms &amp; Conditions</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright & Badges */}
        <div className="container">
          <div className="copyright-wrap">
            <div className="row gy-2 align-items-center justify-content-between">
              <div className="col-auto">
                <p className="copyright-text mb-0" style={{ color: '#8892A0' }}>
                  &copy; 2026 Talkinexx. Built for Meta Graph API.
                </p>
              </div>
              <div className="col-auto">
                <div className="d-flex align-items-center" style={{ gap: '24px' }}>
                  <span style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold', color: '#8892A0', cursor: 'default' }}>
                    Secure by Design
                  </span>
                  <span style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold', color: '#8892A0', cursor: 'default' }}>
                    SLA Guarantee
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll To Top */}
      <div className="scroll-top">
        <svg className="progress-circle svg-content" width="100%" height="100%" viewBox="-1 -1 102 102">
          <path
            d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98"
            style={{ transition: 'stroke-dashoffset 10ms linear 0s', strokeDasharray: '307.919, 307.919', strokeDashoffset: '307.919' }}
          />
        </svg>
      </div>
    </>
  );
};

export default Layout;
