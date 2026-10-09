import React, { useEffect } from 'react';

const WhatsappCampaigns = () => {

  useEffect(() => {
    // Explicitly initialize the slider when the component mounts
    // to bypass the template's buggy main.js parser
    const initSlider = () => {
      if (window.Swiper && document.getElementById('testiSlide2')) {
        new window.Swiper('#testiSlide2', {
          loop: true,
          autoplay: {
            delay: 3000,
            disableOnInteraction: false
          },
          mousewheel: {
            enabled: true,
            sensitivity: 4,
            releaseOnEdges: true
          },
          breakpoints: {
            0: { slidesPerView: 1 },
            576: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1200: { slidesPerView: 3 }
          }
        });
      } else {
        // Retry in case Swiper hasn't loaded yet
        setTimeout(initSlider, 300);
      }
    };
    initSlider();
  }, []);

  return (
    <>
      <div>

        {/*[if lte IE 9]>
    	<p class="browserupgrade">You are using an <strong>outdated</strong> browser. Please <a href="https://browsehappy.com/">upgrade your browser</a> to improve your experience and security.</p>
  <![endif]*/}
        {/*********************************
   		Code Start From Here 
	******************************** */}
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
                      <a href="/home-ai-chatbot"><img src="assets/img/logo.png" alt="Aior " style={{ width: '180px', height: 'auto' }} /></a>
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
                  <div className="col-auto d-none d-xl-block">
                    <div className="header-button">
                      <a href="/contact" className="th-btn2 style2">Login <img src="assets/img/icon/user.svg" alt /></a>
                      <a href="/contact" className="th-btn2 d-none d-xxl-block">Start Free Trial</a>
                      <button type="button" className="th-menu-toggle d-inline-block d-xl-none"><i className="far fa-bars" /></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>{/*==============================
{/*======== Whatsapp Campaigns Page Content ========*/}
<div className="whatsapp-campaigns-page">
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
    .hover-feature-card:hover {
      transform: translateY(-8px) !important;
      border-color: #22C55E !important;
      box-shadow: 0 20px 40px rgba(34,197,94,0.1) !important;
    }
    .hover-feature-card:hover .feature-icon-box {
      background: #22C55E !important;
      color: #fff !important;
      transform: scale(1.1) rotate(-5deg);
    }
    .floating-dashboard {
      animation: floatBob 6s ease-in-out infinite;
    }
    .glow-bg {
      position: absolute;
      width: 100%;
      height: 100%;
      background: radial-gradient(circle, rgba(34,197,94,0.15) 0%, transparent 70%);
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: -1;
      filter: blur(40px);
    }
  `}</style>
  {/* Hero Section */}
  <section className="hero-section text-center position-relative pt-150 pb-100" style={{ background: '#FAFAF9', overflow: 'hidden', padding: '180px 0 120px 0' }}>
    <div className="container position-relative" style={{ zIndex: 3 }}>
      <span className="badge mb-4" style={{ backgroundColor: 'rgba(34,197,94,0.1)', color: '#166534', padding: '8px 16px', borderRadius: '30px', letterSpacing: '2px', fontSize: '12px', border: '1px solid rgba(34,197,94,0.2)', textTransform: 'uppercase', display: 'inline-block', animation: 'floatBob 4s ease-in-out infinite' }}>FEATURES / WHATSAPP CAMPAIGNS</span>
      <h1 className="mb-4" style={{ color: '#12263A', fontSize: '4rem', fontWeight: '800', letterSpacing: '-1px' }}>Targeted WhatsApp Campaigns</h1>
      <p className="mx-auto" style={{ color: '#57534E', maxWidth: '650px', fontSize: '1.25rem', lineHeight: '1.6' }}>
        Launch high-delivery WhatsApp broadcast campaigns targeted directly to your segmented customer database.
      </p>
    </div>
    
    {/* Floating Decorative Elements */}
    <div className="position-absolute" style={{ top: '20%', left: '10%', zIndex: 2, animation: 'floatBob 5s ease-in-out infinite', opacity: 0.7 }}>
      <div style={{ width: '60px', height: '60px', background: '#fff', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 30px rgba(34,197,94,0.2)' }}>
        <i className="fab fa-whatsapp" style={{ fontSize: '30px', color: '#22C55E' }}></i>
      </div>
    </div>
    <div className="position-absolute" style={{ top: '30%', right: '12%', zIndex: 2, animation: 'floatBob 7s ease-in-out infinite reverse', opacity: 0.7 }}>
      <div style={{ width: '50px', height: '50px', background: '#12263A', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 30px rgba(18,38,58,0.2)' }}>
        <i className="fal fa-chart-line" style={{ fontSize: '20px', color: '#22C55E' }}></i>
      </div>
    </div>
    <div className="position-absolute" style={{ bottom: '15%', left: '20%', zIndex: 2, animation: 'spinSlow 15s linear infinite', opacity: 0.1 }}>
      <svg width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" stroke="#22C55E" strokeWidth="2" fill="none" strokeDasharray="10 5" /></svg>
    </div>

    {/* Theme Colored Background Blobs */}
    <div className="position-absolute" style={{ top: '-10%', left: '-5%', width: '600px', height: '600px', background: '#22C55E', filter: 'blur(160px)', zIndex: 1, opacity: 0.35, borderRadius: '50%' }}></div>
    <div className="position-absolute" style={{ bottom: '-15%', right: '-10%', width: '700px', height: '700px', background: '#166534', filter: 'blur(180px)', zIndex: 1, opacity: 0.25, borderRadius: '50%' }}></div>
    <div className="position-absolute" style={{ top: '25%', right: '20%', width: '450px', height: '450px', background: '#F0FDF4', filter: 'blur(120px)', zIndex: 1, opacity: 0.8, borderRadius: '50%' }}></div>
    <div className="position-absolute" style={{ bottom: '15%', left: '30%', width: '500px', height: '500px', background: '#22C55E', filter: 'blur(150px)', zIndex: 1, opacity: 0.2, borderRadius: '50%' }}></div>
    <div className="position-absolute" style={{ top: '40%', left: '15%', width: '400px', height: '400px', background: '#166534', filter: 'blur(140px)', zIndex: 1, opacity: 0.15, borderRadius: '50%' }}></div>
  </section>

  {/* Main Content Section */}
  <section className="content-section" style={{ backgroundColor: '#fff', padding: '80px 0' }}>
    <div className="container">
      {/* Section Header */}
      <div className="row justify-content-center text-center mb-4">
        <div className="col-lg-8">
          <div style={{ display: 'inline-block', padding: '6px 16px', background: '#F0FDF4', color: '#166534', borderRadius: '30px', fontWeight: '800', fontSize: '11px', letterSpacing: '1px', marginBottom: '20px' }}>GROWTH TOOLS</div>
          <h2 className="mb-4" style={{ color: '#12263A', fontWeight: '800', fontSize: '2.75rem', lineHeight: '1.2' }}>Why High-Growth Teams Use This Tool</h2>
          <p className="mb-0 mx-auto" style={{ color: '#57534E', fontSize: '1.1rem', lineHeight: '1.7', maxWidth: '700px' }}>
            Connect directly with customers where they are active. Unlike email broadcasts that average 15-20% open rates, WhatsApp campaigns regularly yield 90%+ open rates and up to 40% click-through metrics, driving immediate appointment bookings and repeat transactions.
          </p>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="row gy-4 mb-5">
        <div className="col-lg-4">
          <div className="feature-item p-4 rounded-4" style={{ background: '#FAFAF9', border: '1px solid #E7E5E4', transition: 'transform 0.3s ease', minHeight: '250px' }}>
            <div className="feature-icon-box mb-4" style={{ width: '56px', height: '56px', borderRadius: '12px', background: '#F0FDF4', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="fal fa-bullseye-arrow fs-4"></i>
            </div>
            <h4 style={{ color: '#12263A', fontSize: '1.2rem', fontWeight: '800', marginBottom: '12px' }}>Database Segmentation</h4>
            <p className="mb-0" style={{ color: '#57534E', fontSize: '0.95rem', lineHeight: '1.6' }}>Send unique marketing offers to specific audience tags like "Inactive Patients" or "Premium Members".</p>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="feature-item p-4 rounded-4" style={{ background: '#FAFAF9', border: '1px solid #E7E5E4', transition: 'transform 0.3s ease', minHeight: '250px' }}>
            <div className="feature-icon-box mb-4" style={{ width: '56px', height: '56px', borderRadius: '12px', background: '#F0FDF4', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="fal fa-hand-pointer fs-4"></i>
            </div>
            <h4 style={{ color: '#12263A', fontSize: '1.2rem', fontWeight: '800', marginBottom: '12px' }}>Interactive Quick-Reply</h4>
            <p className="mb-0" style={{ color: '#57534E', fontSize: '0.95rem', lineHeight: '1.6' }}>One-touch single-tap buttons inside the WhatsApp bubble to schedule meetings instantly.</p>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="feature-item p-4 rounded-4" style={{ background: '#FAFAF9', border: '1px solid #E7E5E4', transition: 'transform 0.3s ease', minHeight: '250px' }}>
            <div className="feature-icon-box mb-4" style={{ width: '56px', height: '56px', borderRadius: '12px', background: '#F0FDF4', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="fal fa-chart-line fs-4"></i>
            </div>
            <h4 style={{ color: '#12263A', fontSize: '1.2rem', fontWeight: '800', marginBottom: '12px' }}>Live Delivery Metrics</h4>
            <p className="mb-0" style={{ color: '#57534E', fontSize: '0.95rem', lineHeight: '1.6' }}>Track exact Sent, Delivered, and Read logs in real-time, validating your campaign targets.</p>
          </div>
        </div>
      </div>

      {/* Dashboard Image */}
      <div className="row justify-content-center">
        <div className="col-12 text-center position-relative">
          <img src="assets/img/normal/whatsapp_dashboard_wide.jpg" alt="Campaign Dashboard" className="img-fluid rounded-4 w-100" style={{ border: '1px solid #E7E5E4', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)' }} />
          
          {/* Floating Badge (no glow) */}
          <div className="position-absolute" style={{ bottom: '-15px', right: '5%', zIndex: 3 }}>
            <div style={{ background: '#fff', padding: '10px 20px', borderRadius: '10px', boxShadow: '0 10px 30px -5px rgba(0,0,0,0.1)', border: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#F0FDF4', color: '#22C55E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fas fa-arrow-up" style={{ fontSize: '12px' }}></i>
              </div>
              <div style={{ textAlign: 'left' }}>
                <h5 style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: '#12263A' }}>99.4%</h5>
                <span style={{ fontSize: '11px', color: '#57534E', fontWeight: '600' }}>Delivery Rate</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  {/* CTA Section */}
  <section className="cta-section text-center position-relative" style={{ backgroundColor: '#F0FDF4', borderTop: '1px solid rgba(22, 101, 52, 0.1)', padding: '100px 0' }}>
    <div className="container position-relative" style={{ zIndex: 2 }}>
      <div className="mb-4 d-inline-block" style={{ background: '#fff', padding: '16px', borderRadius: '50%', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', border: '1px solid rgba(22, 101, 52, 0.1)' }}>
        <i className="fal fa-rocket" style={{ color: '#22C55E', fontSize: '32px' }}></i>
      </div>

      <h2 className="mb-4" style={{ color: '#12263A', fontSize: '3rem', fontWeight: '800', letterSpacing: '-1px' }}>Ready to supercharge your workflow?</h2>
      <p className="mx-auto mb-5" style={{ color: '#57534E', maxWidth: '600px', fontSize: '1.15rem' }}>
        Set up your account in minutes and seamlessly connect your WhatsApp Business API configurations.
      </p>
      
      <div className="d-flex justify-content-center gap-4 flex-wrap">
        <a href="/contact" className="th-btn2" style={{ background: '#22C55E', color: '#fff', border: 'none', padding: '16px 40px', fontWeight: '800', borderRadius: '50px', transition: 'all 0.3s ease' }}
           onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 10px 20px rgba(34,197,94,0.2)'; }}
           onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
           START FREE TRIAL <i className="fal fa-arrow-right ms-2"></i>
        </a>
        <a href="/contact" className="th-btn2" style={{ background: '#fff', color: '#12263A', border: '1px solid #E2E8F0', padding: '16px 40px', fontWeight: '700', borderRadius: '50px', transition: 'all 0.3s ease' }}
           onMouseOver={(e) => { e.currentTarget.style.borderColor = '#12263A'; e.currentTarget.style.backgroundColor = '#12263A'; e.currentTarget.style.color = '#fff'; }}
           onMouseOut={(e) => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.color = '#12263A'; }}>
           SCHEDULE LIVE DEMO
        </a>
      </div>
    </div>
  </section>
</div>
        <footer className="footer-wrapper footer-layout2" data-bg-src="assets/img/bg/footer_bg_2.png">
          <div className="container">
            <div className="widget-area">
              <div className="footer-top ">
                <div className="row gx-40 gy-4 justify-content-center justify-content-lg-between">
                  <div className="col-lg-5 col-xl-4">
                    <div className="footer-logo"><img src="assets/img/logo-2.png" alt="Talkinexx Logo" /></div>
                  </div>
                  <div className="col-lg-6 col-xl-5">
                    <div className="ps-xl-5">
                      <h2 className="box-title text-white">Try Talkinexx Today Free</h2>
                      <div className="btn-group justify-content-center justify-content-lg-start">
                        <a href="/contact" className="th-btn2">Start Free Trial</a>
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
                      <li><a href="/#">WhatsApp Campaigns</a></li>
                      <li><a href="/#">Automated Messaging</a></li>
                      <li><a href="/#">AI Auto Response</a></li>
                      <li><a href="/#">WhatsApp Flow Builder</a></li>
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
        {/*==============================
    All Js File
============================== */}
        {/* Jquery */}
        {/* Swiper Slider */}
        {/* Bootstrap */}
        {/* Magnific Popup */}
        {/* Counter Up */}
        {/* Circle Progress */}
        {/* Range Slider */}
        {/* Imagesloadedr */}
        {/* isotope */}
        {/* Nice-select */}
        {/* wow */}
        {/* gsap area start */}
        {/* gsap area end */}
        {/* Lenis Js */}
        {/* Main Js File */}
      </div>

    </>
  );
};

export default WhatsappCampaigns;
