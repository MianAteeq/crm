import React from 'react';

const Layout = ({ children }) => {
  return (
    <>
      <div className="mouseCursor cursor-outer" />
      <div className="mouseCursor cursor-inner" />
      {/*==============================
    Mobile Menu
  ============================== */}
        <div className="th-menu-wrapper">
          <div className="th-menu-area text-center">
            <button className="th-menu-toggle"><i className="fal fa-times" /></button>
            <div className="mobile-logo">
              <a href="/home-ai-startup"><img src="assets/img/logo.svg" alt="Aior " /></a>
            </div>
            <div className="th-mobile-menu">
              <ul>
                <li className="menu-item-has-children">
                  <a href="/home-ai-startup">Home</a>
                  <ul className="sub-menu">
                    <li><a href="/home-ai-startup">Home Ai Startup</a></li>
                    <li><a href="/home-ai-chatbot">Home Ai Chatbot</a></li>
                    <li><a href="/home-ai-image-generate">Home Ai Image Generate</a></li>
                    <li><a href="/home-ai-writer-tool">Home AI Writer Tool</a></li>
                    <li><a href="/home-business-intelligence">Home Business Intelligence</a></li>
                    <li><a href="/home-ai-agent">home-ai-agent</a></li>
                    <li><a href="/home-productivity-tools">Home productivity tools</a></li>
                    <li><a href="/home-ai-chatbot-tool">Home AI chatbot tool</a></li>
                    <li><a href="/home-cloud-based-saas">Home cloud Based Saas</a></li>
                    <li><a href="/home-saas-product-showcase">Home Saas product Showcase</a></li>
                    <li><a href="/home-finance-crypto-service">Home finance crypto service</a> </li>
                  </ul>
                </li>
                <li><a href="/about">About Us</a></li>
                <li><a href="/features">Features</a></li>
                <li className="menu-item-has-children">
                  <a href="#">Case Studies</a>
                  <ul className="sub-menu">
                    <li><a href="/case-studies">Case Studies</a></li>
                    <li><a href="/case-studies-2">Case Studies style 2</a></li>
                    <li><a href="/case-studies-details">Case Studies Details</a></li>
                  </ul>
                </li>
                <li className="menu-item-has-children">
                  <a href="#">Pages</a>
                  <ul className="sub-menu">
                    <li><a href="/cases">cases</a></li>
                    <li><a href="/integrations">Integrations</a></li>
                    <li><a href="/team">Team</a></li>
                    <li><a href="/team-details">Team Details</a></li>
                    <li><a href="/faq">FAQ</a></li>
                    <li><a href="/testimonial">Testimonial</a></li>
                    <li><a href="/pricing">Price Table</a></li>
                    <li><a href="/contact">Contact Us</a></li>
                    <li><a href="/error">Error Page</a></li>
                  </ul>
                </li>
                <li className="menu-item-has-children">
                  <a href="#">Blog</a>
                  <ul className="sub-menu">
                    <li><a href="/blog">Blog</a></li>
                    <li><a href="/blog-details">Blog Details</a></li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>{/*==============================
	Header Area
==============================*/}
        <style>{`
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
        `}</style>
        <header className="th-header header-layout2 header-absolute">
          <div className="sticky-wrapper">
            {/* Main Menu Area */}
            <div className="menu-area">
              <div className="container th-container">
                <div className="row align-items-center justify-content-between">
                  <div className="col-auto">
                    <div className="header-logo">
                      <a href="/"><img src="assets/img/logo.png" alt="Talkinexx" style={{ width: '180px', height: 'auto' }} /></a>
                    </div>
                  </div>
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
                              <a href="/#" className="mega-menu-item">
                                <div className="icon-box"><i className="fal fa-sparkles"></i></div>
                                <div className="text-box">
                                  <h4>WhatsApp AI Copilot</h4>
                                  <p>Automate chat answers &amp; resolve queries 24/7.</p>
                                </div>
                              </a>
                            </li>
                            <li>
                              <a href="/#" className="mega-menu-item">
                                <div className="icon-box"><i className="fal fa-database"></i></div>
                                <div className="text-box">
                                  <h4>Contact List Retargeting</h4>
                                  <p>Boost bookings and conversions via WhatsApp.</p>
                                </div>
                              </a>
                            </li>
                            <li>
                              <a href="/#" className="mega-menu-item">
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
                    <div className="header-button">
                      <button type="button" className="th-menu-toggle d-inline-block d-lg-none"><i className="far fa-bars" /></button>
                    </div>
                  </div>
                  <div className="col-auto d-none d-lg-block">
                    <div className="header-button d-flex align-items-center gap-3">
                      <a href="/login" className="th-btn2 style2">Login <img src="assets/img/icon/user.svg" alt /></a>
                      <a href="/signup" className="th-btn2">Start Free Trial</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
      <main>
        {children}
      </main>
      {/*==============================
	Footer Area
==============================*/}
        <footer className="footer-wrapper footer-layout2" data-bg-src="assets/img/bg/footer_bg_2.png">
          <div className="container">
            <div className="widget-area">
              <div className="footer-top ">
                <div className="row gx-40 gy-4 justify-content-center justify-content-lg-between">
                  <div className="col-lg-5 col-xl-4">
                    <div className="footer-logo"><a href="/"><img src="assets/img/logo-2.png" alt="Talkinexx Logo" /></a></div>
                  </div>
                  <div className="col-lg-auto col-xl-auto">
                    <div>
                      <h2 className="box-title text-white">Try Talkinexx Today Free</h2>
                      <div className="btn-group justify-content-center justify-content-lg-start">
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
              <div className="col-md-6 col-xl-3">
                <div className="widget footer-widget">
                  <h3 className="widget_title" style={{ textTransform: 'uppercase', letterSpacing: '1px' }}>Talkinexx</h3>
                  <div className="th-widget-about">
                    <p className="about-text" style={{ fontSize: '14px', lineHeight: '1.7' }}>The enterprise-grade WhatsApp automation platform for teams who value speed, efficiency, and real-time customer engagement.</p>
                    <div className="th-social">
                      <a href="https://www.twitter.com/"><i className="fab fa-twitter" /></a>
                      <a href="https://github.com/"><i className="fab fa-github" /></a>
                      <a href="https://www.linkedin.com/"><i className="fab fa-linkedin-in" /></a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-xl-auto">
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
              <div className="col-md-6 col-xl-auto">
                <div className="widget widget_nav_menu footer-widget">
                  <h3 className="widget_title" style={{ textTransform: 'uppercase', letterSpacing: '1px', fontSize: '13px', color: '#8892A0' }}>Services</h3>
                  <div className="menu-all-pages-container">
                    <ul className="menu">
                      <li><a href="/whatsapp-campaigns">WhatsApp Campaigns</a></li>
                      <li><a href="/automated-messaging">Automated Messaging</a></li>
                      <li><a href="/whatsapp-ai-copilot">AI Auto Response</a></li>
                      <li><a href="/login">WhatsApp Flow Builder</a></li>
                      <li><a href="/#">Shared Team Inbox</a></li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-xl-auto">
                <div className="widget widget_nav_menu footer-widget">
                  <h3 className="widget_title" style={{ textTransform: 'uppercase', letterSpacing: '1px', fontSize: '13px', color: '#8892A0' }}>Trust &amp; Legal</h3>
                  <div className="menu-all-pages-container">
                    <ul className="menu">
                      <li><a href="/#">Privacy Policy</a></li>
                      <li><a href="/#">Terms &amp; Conditions</a></li>
                      <li><a href="/#">SLA Guarantee</a></li>
                      <li><a href="/#">Secure by Design</a></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="container">
            <div className="copyright-wrap">
              <div className="row gy-2 align-items-center justify-content-between">
                <div className="col-auto">
                  <p className="copyright-text mb-0" style={{ color: '#8892A0' }}>&copy; 2026 Talkinexx. Built for Meta Graph API.</p>
                </div>
                <div className="col-auto">
                  <div className="d-flex" style={{ gap: '30px' }}>
                    <a href="/#" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold', color: '#fff' }}>Secure by Design</a>
                    <a href="/#" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold', color: '#fff' }}>SLA Guarantee</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
        {/*********************************
			Code End  Here 
	******************************** */}
        {/* Scroll To Top */}
        <div className="scroll-top">
          <svg className="progress-circle svg-content" width="100%" height="100%" viewBox="-1 -1 102 102">
            <path d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98" style={{ transition: 'stroke-dashoffset 10ms linear 0s', strokeDasharray: '307.919, 307.919', strokeDashoffset: '307.919' }}>
            </path>
          </svg>
        </div>
    </>
  );
};

export default Layout;
