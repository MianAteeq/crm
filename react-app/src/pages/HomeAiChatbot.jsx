
import React, { useEffect } from 'react';

const HomeAiChatbot = () => {

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
Hero Area
==============================*/}
        <div className="th-hero-wrapper hero-2" id="hero" data-bg-src="assets/img/bg/hero_bg_2.jpg">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-xl-6">
                <div className="hero-style2">
                  <h1 className="hero-title">Automate <span className="text-theme">Conversations</span> with Intelligent AI
                  </h1>
                  <p className="hero-text">Boost engagement, automate support, and scale your business with our AI-powered
                    chatbot
                    tool.</p>
                  <div className="btn-group justify-content-xl-start justify-content-center">
                    <a href="/contact" className="th-btn2">Build Your Chatbot</a>
                    <a href="/contact" className="th-btn2 style2">Book a Demo</a>
                  </div>
                  <div className="client-box mb-sm-0 mb-3 justify-content-xl-start justify-content-center">
                    <div className="client-thumb-group">
                      <div className="thumb"><img src="assets/img/shape/client-1-1.png" alt="avater" />
                      </div>
                      <div className="thumb"><img src="assets/img/shape/client-1-2.png" alt="avater" />
                      </div>
                      <div className="thumb"><img src="assets/img/shape/client-1-3.png" alt="avater" />
                      </div>
                    </div>
                    <div className="client-wrapp">
                      <div className="client-review">
                        <i className="fa-sharp fa-solid fa-star" /><i className="fa-sharp fa-solid fa-star" /><i className="fa-sharp fa-solid fa-star" /><i className="fa-sharp fa-solid fa-star" /><i className="fa-sharp fa-solid fa-star" />
                        <span className="rating">4.9/5</span>
                      </div>
                      <span className="rating">AI Performance Rating</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-6">
                <div className="hero-image2" style={{ position: 'relative' }}>
                  {/* Faded green brush wavy stroke effect */}
                  <svg style={{ position: 'absolute', top: '10%', left: '-20%', width: '140%', height: '100%', zIndex: 0, pointerEvents: 'none', filter: 'blur(50px)' }} viewBox="0 0 800 600" preserveAspectRatio="none">
                    <path d="M -100,600 C 300,500 400,200 900,100" fill="none" stroke="#22C55E" strokeWidth="140" strokeLinecap="round" opacity="0.4" />
                  </svg>

                  <img src="assets/img/hero/hero-img.png" alt style={{ position: 'relative', zIndex: 1 }} />
                  <div className="hero-bottom-text jump" style={{ zIndex: 2 }}><img src="assets/img/shape/avatar.svg" alt /><span className="title">How
                    can I help you?</span></div>
                  <div className="hero-bottom-text style2 jump-reverse" style={{ zIndex: 2 }}><span className="title">Can you please help me to
                    extract the file</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*======== / Hero Section ========*/}{/*==============================
Brand Area  
==============================*/}
        <div className="overflow-hidden space-top overflow-hidden">
          <div className="container">
            <div className="row">
              <div className="text-center" style={{ marginBottom: '1rem' }}>
                <p className="fw-bold mb-0 text-uppercase" style={{ color: 'var(--body-color)', fontSize: '16px', letterSpacing: '0.25em' }}>Trusted by fast-growing SaaS & retail teams globally</p>
              </div>
            </div>

            <style>
              {`
                .marquee-container {
                  width: 100vw;
                  overflow: hidden;
                  position: relative;
                  left: 50%;
                  right: 50%;
                  margin-left: -50vw;
                  margin-right: -50vw;
                  display: flex;
                  padding: 1.5rem 0 2rem 0;
                }
                .brand-logo-row {
                  display: flex;
                  align-items: center;
                  gap: 6rem;
                  padding-right: 6rem;
                  animation: marquee 20s linear infinite;
                  min-width: max-content;
                }
                .marquee-container:hover .brand-logo-row {
                  animation-play-state: paused;
                }
                .brand-logo-row svg {
                  height: 28px;
                  opacity: 0.5;
                  transition: all 0.3s ease;
                  fill: var(--title-color);
                  color: var(--title-color);
                  cursor: pointer;
                }
                .brand-logo-row svg:hover {
                  opacity: 1;
                }
                @keyframes marquee {
                  0% { transform: translateX(0); }
                  100% { transform: translateX(-100%); }
                }
              `}
            </style>
          </div>

          <div className="marquee-container">
            <div className="brand-logo-row">
              <svg viewBox="0 0 80 34" xmlns="http://www.w3.org/2000/svg"><path d="M41.4 12.3c0-3.3 2.5-4.4 6.7-4.4 3.7 0 7.3.9 10.3 2.5V3.1C55.4 1.7 51.5 1 47.9 1 34.6 1 27.6 8.1 27.6 19c0 9.8 6.7 14.1 16.5 14.1 4 0 7.8-.7 10.7-2.1v-7.3c-2.9 1.5-6.3 2.1-9.4 2.1-5.1 0-7-2-7-6.8h23.2v-1.7H41.4zm0-5c0-1.8 1.2-2.8 3.3-2.8 2.2 0 3.3 1 3.3 2.8H41.4zM24.8 9.5c0-.8-.7-1.4-1.5-1.4h-5.5V1h-9.3v7.1H3c-.8 0-1.4.6-1.4 1.4v6.8c0 .8.6 1.4 1.4 1.4h5.5v15.7h9.3V17.7h5.5c.8 0 1.4-.6 1.4-1.4V9.5z"></path></svg>
              <svg viewBox="0 0 100 24" xmlns="http://www.w3.org/2000/svg"><text x="0" y="18" className="font-sans font-black tracking-wider text-lg" style={{ fontSize: '1.25rem', fontWeight: 900 }}>LINEAR</text></svg>
              <svg viewBox="0 0 100 28" xmlns="http://www.w3.org/2000/svg"><text x="0" y="20" className="font-sans font-black tracking-wider text-lg" style={{ fontSize: '1.25rem', fontWeight: 900 }}>HUBSPOT</text></svg>
              <svg viewBox="0 0 116 26" xmlns="http://www.w3.org/2000/svg" style={{ height: '24px' }}><path d="M12.2 2L24.4 23H0L12.2 2z"></path><text x="32" y="20" className="font-sans font-black tracking-wider text-base" style={{ fontSize: '1.1rem', fontWeight: 900 }}>VERCEL</text></svg>
              <svg viewBox="0 0 100 24" xmlns="http://www.w3.org/2000/svg"><text x="0" y="18" className="font-sans font-black tracking-wider text-lg" style={{ fontSize: '1.25rem', fontWeight: 900 }}>NOTION</text></svg>
            </div>

            {/* Duplicated for infinite seamless scrolling */}
            <div className="brand-logo-row" aria-hidden="true">
              <svg viewBox="0 0 80 34" xmlns="http://www.w3.org/2000/svg"><path d="M41.4 12.3c0-3.3 2.5-4.4 6.7-4.4 3.7 0 7.3.9 10.3 2.5V3.1C55.4 1.7 51.5 1 47.9 1 34.6 1 27.6 8.1 27.6 19c0 9.8 6.7 14.1 16.5 14.1 4 0 7.8-.7 10.7-2.1v-7.3c-2.9 1.5-6.3 2.1-9.4 2.1-5.1 0-7-2-7-6.8h23.2v-1.7H41.4zm0-5c0-1.8 1.2-2.8 3.3-2.8 2.2 0 3.3 1 3.3 2.8H41.4zM24.8 9.5c0-.8-.7-1.4-1.5-1.4h-5.5V1h-9.3v7.1H3c-.8 0-1.4.6-1.4 1.4v6.8c0 .8.6 1.4 1.4 1.4h5.5v15.7h9.3V17.7h5.5c.8 0 1.4-.6 1.4-1.4V9.5z"></path></svg>
              <svg viewBox="0 0 100 24" xmlns="http://www.w3.org/2000/svg"><text x="0" y="18" className="font-sans font-black tracking-wider text-lg" style={{ fontSize: '1.25rem', fontWeight: 900 }}>LINEAR</text></svg>
              <svg viewBox="0 0 100 28" xmlns="http://www.w3.org/2000/svg"><text x="0" y="20" className="font-sans font-black tracking-wider text-lg" style={{ fontSize: '1.25rem', fontWeight: 900 }}>HUBSPOT</text></svg>
              <svg viewBox="0 0 116 26" xmlns="http://www.w3.org/2000/svg" style={{ height: '24px' }}><path d="M12.2 2L24.4 23H0L12.2 2z"></path><text x="32" y="20" className="font-sans font-black tracking-wider text-base" style={{ fontSize: '1.1rem', fontWeight: 900 }}>VERCEL</text></svg>
              <svg viewBox="0 0 100 24" xmlns="http://www.w3.org/2000/svg"><text x="0" y="18" className="font-sans font-black tracking-wider text-lg" style={{ fontSize: '1.25rem', fontWeight: 900 }}>NOTION</text></svg>
            </div>

            <div className="brand-logo-row" aria-hidden="true">
              <svg viewBox="0 0 80 34" xmlns="http://www.w3.org/2000/svg"><path d="M41.4 12.3c0-3.3 2.5-4.4 6.7-4.4 3.7 0 7.3.9 10.3 2.5V3.1C55.4 1.7 51.5 1 47.9 1 34.6 1 27.6 8.1 27.6 19c0 9.8 6.7 14.1 16.5 14.1 4 0 7.8-.7 10.7-2.1v-7.3c-2.9 1.5-6.3 2.1-9.4 2.1-5.1 0-7-2-7-6.8h23.2v-1.7H41.4zm0-5c0-1.8 1.2-2.8 3.3-2.8 2.2 0 3.3 1 3.3 2.8H41.4zM24.8 9.5c0-.8-.7-1.4-1.5-1.4h-5.5V1h-9.3v7.1H3c-.8 0-1.4.6-1.4 1.4v6.8c0 .8.6 1.4 1.4 1.4h5.5v15.7h9.3V17.7h5.5c.8 0 1.4-.6 1.4-1.4V9.5z"></path></svg>
              <svg viewBox="0 0 100 24" xmlns="http://www.w3.org/2000/svg"><text x="0" y="18" className="font-sans font-black tracking-wider text-lg" style={{ fontSize: '1.25rem', fontWeight: 900 }}>LINEAR</text></svg>
              <svg viewBox="0 0 100 28" xmlns="http://www.w3.org/2000/svg"><text x="0" y="20" className="font-sans font-black tracking-wider text-lg" style={{ fontSize: '1.25rem', fontWeight: 900 }}>HUBSPOT</text></svg>
              <svg viewBox="0 0 116 26" xmlns="http://www.w3.org/2000/svg" style={{ height: '24px' }}><path d="M12.2 2L24.4 23H0L12.2 2z"></path><text x="32" y="20" className="font-sans font-black tracking-wider text-base" style={{ fontSize: '1.1rem', fontWeight: 900 }}>VERCEL</text></svg>
              <svg viewBox="0 0 100 24" xmlns="http://www.w3.org/2000/svg"><text x="0" y="18" className="font-sans font-black tracking-wider text-lg" style={{ fontSize: '1.25rem', fontWeight: 900 }}>NOTION</text></svg>
            </div>
          </div>
        </div>

        {/*==============================
        Key Features Area  
        ==============================*/}
        <section className="space position-relative overflow-hidden" style={{ backgroundColor: '#FAFAF9', padding: '120px 0' }} id="key-features">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8 col-xl-8 text-center">
                <div style={{ display: 'inline-block', color: '#57534E', fontSize: '14px', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px' }}>
                  [ Key Features ]
                </div>
                <h2 style={{ color: '#12263A', fontSize: '42px', fontWeight: '800', lineHeight: '1.2', marginBottom: '80px', marginX: 'auto', maxWidth: '800px' }}>
                  An AI chatbot bot trained to answer questions about EmbedAI.
                </h2>
              </div>
            </div>

            <div className="row g-4 justify-content-center">

              {/* Card 1 */}
              <div className="col-12 col-md-6 col-lg-4">
                <div style={{ backgroundColor: '#ffffff', border: '1px solid #f9fafb', borderRadius: '24px', padding: '40px 24px', height: '100%', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ color: '#000', fontSize: '24px', fontWeight: '800', marginBottom: '16px', textAlign: 'center' }}>Reduce Operational Costs</h3>
                  <p style={{ color: '#57534E', fontSize: '15px', lineHeight: '1.6', textAlign: 'center', marginBottom: '32px' }}>Automate routine customer questions and cut help-desk workload by up to 40%.</p>

                  <div style={{ backgroundColor: '#F3F4F6', borderRadius: '16px', width: '100%', paddingBottom: '80%', position: 'relative', marginTop: 'auto', overflow: 'hidden' }}>

                    {/* SVG Dotted Lines */}
                    <svg viewBox="0 0 300 240" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                      <defs>
                        <marker id="arrow1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                          <path d="M 0 0 L 10 5 L 0 10 z" fill="#cbd5e1" />
                        </marker>
                      </defs>
                      <path d="M 140 55 C 150 55 150 45 160 45" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4 4" fill="none" />
                      <path d="M 140 55 C 150 55 150 75 160 75" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4 4" fill="none" />
                      <path d="M 230 75 C 260 75 260 145 180 145 L 80 145" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4 4" fill="none" markerEnd="url(#arrow1)" />
                      <path d="M 60 145 C 20 145 20 205 60 205 L 70 205" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4 4" fill="none" markerEnd="url(#arrow1)" />
                    </svg>

                    {/* Elements */}
                    <div style={{ position: 'absolute', top: '40px', left: '15px', backgroundColor: '#000', color: '#fff', padding: '8px 16px', borderRadius: '24px', fontSize: '11px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <i className="fa-solid fa-message-lines" style={{ fontSize: '12px' }}></i> Customer Queries
                    </div>

                    <div style={{ position: 'absolute', top: '35px', left: '190px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '6px 10px', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.03)' }}>
                        <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="fa-solid fa-user" style={{ fontSize: '10px', color: '#fff' }}></i></div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <div style={{ width: '40px', height: '4px', backgroundColor: '#e2e8f0', borderRadius: '2px' }}></div>
                          <div style={{ width: '20px', height: '4px', backgroundColor: '#e2e8f0', borderRadius: '2px' }}></div>
                        </div>
                        <i className="fa-solid fa-message" style={{ color: '#cbd5e1', fontSize: '10px', marginLeft: '4px' }}></i>
                      </div>
                      <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '6px 10px', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.03)' }}>
                        <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="fa-solid fa-user" style={{ fontSize: '10px', color: '#fff' }}></i></div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <div style={{ width: '40px', height: '4px', backgroundColor: '#e2e8f0', borderRadius: '2px' }}></div>
                          <div style={{ width: '20px', height: '4px', backgroundColor: '#e2e8f0', borderRadius: '2px' }}></div>
                        </div>
                        <i className="fa-solid fa-message" style={{ color: '#cbd5e1', fontSize: '10px', marginLeft: '4px' }}></i>
                      </div>
                    </div>

                    <div style={{ position: 'absolute', top: '140px', left: '30px', backgroundColor: '#fff', border: '1px solid #c4b5fd', borderRadius: '30px', padding: '6px 16px 6px 6px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}>
                      <div style={{ backgroundColor: '#000', color: '#fff', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="fa-solid fa-robot" style={{ fontSize: '14px' }}></i>
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: '800', color: '#000' }}>Automated Bot Response</span>
                    </div>

                    <div style={{ position: 'absolute', top: '210px', left: '45px', backgroundColor: '#c7d2fe', borderRadius: '12px', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '24px', fontWeight: '900', color: '#000', lineHeight: '1' }}>40%</span>
                      <span style={{ fontSize: '10px', fontWeight: '700', color: '#000', lineHeight: '1.2' }}>Cut Help-desk<br />Workload</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="col-12 col-md-6 col-lg-4">
                <div style={{ backgroundColor: '#ffffff', border: '1px solid #f9fafb', borderRadius: '24px', padding: '40px 24px', height: '100%', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ color: '#000', fontSize: '24px', fontWeight: '800', marginBottom: '16px', textAlign: 'center' }}>Boost Conversation Rates</h3>
                  <p style={{ color: '#57534E', fontSize: '15px', lineHeight: '1.6', textAlign: 'center', marginBottom: '32px' }}>Qualify visitors in real time and guide hot leads straight to checkout or a meeting.</p>

                  <div style={{ backgroundColor: '#F3F4F6', borderRadius: '16px', width: '100%', paddingBottom: '80%', position: 'relative', marginTop: 'auto', overflow: 'hidden' }}>

                    <svg viewBox="0 0 300 240" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                      <defs>
                        <marker id="arrow2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                          <path d="M 0 0 L 10 5 L 0 10 z" fill="#cbd5e1" />
                        </marker>
                      </defs>
                      <path d="M 140 55 C 150 55 150 45 160 45" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4 4" fill="none" />
                      <path d="M 140 55 C 150 55 150 75 160 75" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4 4" fill="none" />
                      <path d="M 230 75 C 260 75 260 145 180 145 L 80 145" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4 4" fill="none" markerEnd="url(#arrow2)" />
                      <path d="M 130 145 C 90 145 90 205 130 205 L 140 205" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4 4" fill="none" markerEnd="url(#arrow2)" />
                    </svg>

                    <div style={{ position: 'absolute', top: '35px', left: '35px', backgroundColor: '#000', color: '#fff', padding: '8px 12px', borderRadius: '24px', fontSize: '10px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <i className="fa-solid fa-fire" style={{ fontSize: '14px', color: '#f97316' }}></i>
                      <span style={{ lineHeight: '1.2' }}>Qualify Visitors<br />Hot Leads</span>
                    </div>

                    <div style={{ position: 'absolute', top: '35px', left: '190px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '6px 10px', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.03)' }}>
                        <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="fa-solid fa-user" style={{ fontSize: '10px', color: '#fff' }}></i></div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <div style={{ width: '40px', height: '4px', backgroundColor: '#e2e8f0', borderRadius: '2px' }}></div>
                          <div style={{ width: '20px', height: '4px', backgroundColor: '#e2e8f0', borderRadius: '2px' }}></div>
                        </div>
                        <i className="fa-solid fa-message" style={{ color: '#cbd5e1', fontSize: '10px', marginLeft: '4px' }}></i>
                      </div>
                      <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '6px 10px', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.03)' }}>
                        <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="fa-solid fa-user" style={{ fontSize: '10px', color: '#fff' }}></i></div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <div style={{ width: '40px', height: '4px', backgroundColor: '#e2e8f0', borderRadius: '2px' }}></div>
                          <div style={{ width: '20px', height: '4px', backgroundColor: '#e2e8f0', borderRadius: '2px' }}></div>
                        </div>
                        <i className="fa-solid fa-message" style={{ color: '#cbd5e1', fontSize: '10px', marginLeft: '4px' }}></i>
                      </div>
                    </div>

                    <div style={{ position: 'absolute', top: '145px', left: '25px', backgroundColor: '#fff', border: '1px solid #fecdd3', borderRadius: '30px', padding: '6px 16px 6px 6px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}>
                      <div style={{ backgroundColor: '#000', color: '#fff', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="fa-solid fa-compass" style={{ fontSize: '14px' }}></i>
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: '800', color: '#000' }}>Real Time Guide</span>
                    </div>

                    <div style={{ position: 'absolute', top: '220px', left: '150px', backgroundColor: '#fbcfe8', borderRadius: '12px', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <span style={{ fontSize: '10px', fontWeight: '700', color: '#000', lineHeight: '1.2' }}>Straight Boost<br />Conversion Rates</span>
                      <i className="fa-solid fa-rocket" style={{ fontSize: '20px', color: '#be185d' }}></i>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3 */}
              <div className="col-12 col-md-6 col-lg-4">
                <div style={{ backgroundColor: '#ffffff', border: '1px solid #f9fafb', borderRadius: '24px', padding: '40px 24px', height: '100%', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ color: '#000', fontSize: '24px', fontWeight: '800', marginBottom: '16px', textAlign: 'center' }}>Save Hours Daily</h3>
                  <p style={{ color: '#57534E', fontSize: '15px', lineHeight: '1.6', textAlign: 'center', marginBottom: '32px' }}>Auto-answer FAQs, capture leads, schedule calls—free your team for high-value work.</p>

                  <div style={{ backgroundColor: '#F3F4F6', borderRadius: '16px', width: '100%', paddingBottom: '80%', position: 'relative', marginTop: 'auto', overflow: 'hidden' }}>

                    <svg viewBox="0 0 300 240" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                      <defs>
                        <marker id="arrow3" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                          <path d="M 0 0 L 10 5 L 0 10 z" fill="#cbd5e1" />
                        </marker>
                      </defs>
                      <path d="M 140 55 C 150 55 150 45 160 45" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4 4" fill="none" />
                      <path d="M 140 55 C 150 55 150 75 160 75" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4 4" fill="none" />
                      <path d="M 230 75 C 260 75 260 145 180 145 L 80 145" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4 4" fill="none" markerEnd="url(#arrow3)" />
                      <path d="M 100 145 C 60 145 60 205 100 205 L 110 205" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4 4" fill="none" markerEnd="url(#arrow3)" />
                    </svg>

                    <div style={{ position: 'absolute', top: '40px', left: '20px', backgroundColor: '#000', color: '#fff', padding: '8px 16px', borderRadius: '24px', fontSize: '11px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <i className="fa-solid fa-message-lines" style={{ fontSize: '12px' }}></i> Auto-answer
                    </div>

                    <div style={{ position: 'absolute', top: '35px', left: '185px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '6px 10px', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.03)' }}>
                        <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="fa-solid fa-user" style={{ fontSize: '10px', color: '#fff' }}></i></div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <div style={{ width: '40px', height: '4px', backgroundColor: '#e2e8f0', borderRadius: '2px' }}></div>
                          <div style={{ width: '20px', height: '4px', backgroundColor: '#e2e8f0', borderRadius: '2px' }}></div>
                        </div>
                        <i className="fa-solid fa-message" style={{ color: '#cbd5e1', fontSize: '10px', marginLeft: '4px' }}></i>
                      </div>
                      <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '6px 10px', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.03)' }}>
                        <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="fa-solid fa-user" style={{ fontSize: '10px', color: '#fff' }}></i></div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <div style={{ width: '40px', height: '4px', backgroundColor: '#e2e8f0', borderRadius: '2px' }}></div>
                          <div style={{ width: '20px', height: '4px', backgroundColor: '#e2e8f0', borderRadius: '2px' }}></div>
                        </div>
                        <i className="fa-solid fa-message" style={{ color: '#cbd5e1', fontSize: '10px', marginLeft: '4px' }}></i>
                      </div>
                    </div>

                    <div style={{ position: 'absolute', top: '145px', left: '30px', backgroundColor: '#fff', border: '1px solid #fed7aa', borderRadius: '30px', padding: '6px 16px 6px 6px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}>
                      <div style={{ backgroundColor: '#000', color: '#fff', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="fa-solid fa-phone" style={{ fontSize: '14px', transform: 'scaleX(-1)' }}></i>
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: '800', color: '#000' }}>Schedule Calls</span>
                    </div>

                    <div style={{ position: 'absolute', top: '215px', left: '115px', backgroundColor: '#dcfce7', borderRadius: '12px', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ backgroundColor: '#15803d', color: '#fff', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="fa-solid fa-clock" style={{ fontSize: '12px' }}></i>
                      </div>
                      <span style={{ fontSize: '10px', fontWeight: '500', color: '#000', lineHeight: '1.3' }}><strong style={{ display: 'block', fontSize: '11px', fontWeight: '800' }}>Save Hours Daily</strong>Free team for high-value work</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        <section className="positive-relative overflow-hidden space" id="case-studies-sec" data-bg-src="assets/img/bg/service_bg_1.jpg">
          <div className="container">
            <div className="row justify-content-lg-between justify-content-center align-items-center">
              <div className="col-lg-6">
                <div className="title-area text-center text-lg-start">
                  <span className="sub-title style3 text-anime-style-2">[ Case Study ]</span>
                  <h2 className="sec-title text-anime-style-3">Success Stories</h2>
                  <p className="wow fadeInUp fs-18">From converting up to 44% of chats into sales and cutting support
                    costs, to
                    gaining actionable insights for new strategies, brands in any industry can thrive with Aiorchat.
                  </p>
                </div>
              </div>
              <div className="col-auto">
                <div className="btn-group mb-0 mb-md-5">
                  <a href="/case-studies" className="th-btn2">All Success Stories</a>
                </div>
              </div>
            </div>
            <div className="cards-marquee-wrapper">
              <style dangerouslySetInnerHTML={{
                __html: `
                .cards-marquee-wrapper {
                  overflow: hidden;
                  width: 100%;
                  position: relative;
                  padding: 20px 0;
                }
                .cards-marquee-track {
                  display: flex;
                  gap: 24px;
                  width: max-content;
                  animation: slideCards 60s linear infinite;
                }
                .cards-marquee-track:hover {
                  animation-play-state: paused;
                }
                .cards-marquee-card {
                  width: 400px;
                }
                @keyframes slideCards {
                  0% { transform: translateX(0); }
                  100% { transform: translateX(calc(-50% - 12px)); }
                }
                @media (max-width: 768px) {
                  .cards-marquee-card {
                    width: 320px;
                  }
                }
              `}} />
              <div className="cards-marquee-track">
                {/* First Set */}
                <div className="cards-marquee-card" style={{ display: 'flex', alignItems: 'stretch', backgroundColor: '#fff', borderRadius: '24px', padding: '12px', height: '220px', boxShadow: '0 8px 30px rgba(0,0,0,0.04)', border: '1px solid #F3F4F6', position: 'relative' }}>
                  <div style={{ flex: '0 0 45%', position: 'relative' }}>
                    <img src="assets/img/service/service_chatbot_1.jpg" alt="Tailored Solutions" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px' }} />
                  </div>
                  <div style={{ flex: '1', padding: '12px 12px 40px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ marginBottom: '16px' }}>
                      <img src="assets/img/icon/service_2_1.svg" alt="Icon" style={{ width: '40px', height: '40px' }} />
                    </div>
                    <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#000', marginBottom: '8px', lineHeight: '1.2' }}>Tailored Solutions</h3>
                    <p style={{ fontSize: '12px', color: '#57534E', lineHeight: '1.6', margin: 0 }}>From converting up to 44% of chats into sales and cutting support costs, to gaining actionable insights.</p>
                  </div>
                  <a href="/case-studies" style={{ position: 'absolute', bottom: '16px', right: '16px', width: '36px', height: '36px', backgroundColor: '#F3F4F6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', transition: 'all 0.3s ease' }}>
                    <i className="fa-solid fa-chevron-right" style={{ fontSize: '12px' }}></i>
                  </a>
                </div>
                <div className="cards-marquee-card" style={{ display: 'flex', alignItems: 'stretch', backgroundColor: '#fff', borderRadius: '24px', padding: '12px', height: '220px', boxShadow: '0 8px 30px rgba(0,0,0,0.04)', border: '1px solid #F3F4F6', position: 'relative' }}>
                  <div style={{ flex: '0 0 45%', position: 'relative' }}>
                    <img src="assets/img/service/service_chatbot_2.jpg" alt="Affordable Pricing" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px' }} />
                  </div>
                  <div style={{ flex: '1', padding: '12px 12px 40px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ marginBottom: '16px' }}>
                      <img src="assets/img/icon/service_2_2.svg" alt="Icon" style={{ width: '40px', height: '40px' }} />
                    </div>
                    <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#000', marginBottom: '8px', lineHeight: '1.2' }}>Affordable Pricing</h3>
                    <p style={{ fontSize: '12px', color: '#57534E', lineHeight: '1.6', margin: 0 }}>From converting up to 44% of chats into sales and cutting support costs, to gaining actionable insights.</p>
                  </div>
                  <a href="/case-studies" style={{ position: 'absolute', bottom: '16px', right: '16px', width: '36px', height: '36px', backgroundColor: '#F3F4F6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', transition: 'all 0.3s ease' }}>
                    <i className="fa-solid fa-chevron-right" style={{ fontSize: '12px' }}></i>
                  </a>
                </div>
                <div className="cards-marquee-card" style={{ display: 'flex', alignItems: 'stretch', backgroundColor: '#fff', borderRadius: '24px', padding: '12px', height: '220px', boxShadow: '0 8px 30px rgba(0,0,0,0.04)', border: '1px solid #F3F4F6', position: 'relative' }}>
                  <div style={{ flex: '0 0 45%', position: 'relative' }}>
                    <img src="assets/img/service/service_chatbot_3.jpg" alt="Customer Support" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px' }} />
                  </div>
                  <div style={{ flex: '1', padding: '12px 12px 40px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ marginBottom: '16px' }}>
                      <img src="assets/img/icon/service_2_3.svg" alt="Icon" style={{ width: '40px', height: '40px' }} />
                    </div>
                    <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#000', marginBottom: '8px', lineHeight: '1.2' }}>Customer Support</h3>
                    <p style={{ fontSize: '12px', color: '#57534E', lineHeight: '1.6', margin: 0 }}>From converting up to 44% of chats into sales and cutting support costs, to gaining actionable insights.</p>
                  </div>
                  <a href="/case-studies" style={{ position: 'absolute', bottom: '16px', right: '16px', width: '36px', height: '36px', backgroundColor: '#F3F4F6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', transition: 'all 0.3s ease' }}>
                    <i className="fa-solid fa-chevron-right" style={{ fontSize: '12px' }}></i>
                  </a>
                </div>
                {/* Second Set for seamless loop */}
                <div className="cards-marquee-card" style={{ display: 'flex', alignItems: 'stretch', backgroundColor: '#fff', borderRadius: '24px', padding: '12px', height: '220px', boxShadow: '0 8px 30px rgba(0,0,0,0.04)', border: '1px solid #F3F4F6', position: 'relative' }}>
                  <div style={{ flex: '0 0 45%', position: 'relative' }}>
                    <img src="assets/img/service/service_chatbot_1.jpg" alt="Tailored Solutions" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px' }} />
                  </div>
                  <div style={{ flex: '1', padding: '12px 12px 40px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ marginBottom: '16px' }}>
                      <img src="assets/img/icon/service_2_1.svg" alt="Icon" style={{ width: '40px', height: '40px' }} />
                    </div>
                    <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#000', marginBottom: '8px', lineHeight: '1.2' }}>Tailored Solutions</h3>
                    <p style={{ fontSize: '12px', color: '#57534E', lineHeight: '1.6', margin: 0 }}>From converting up to 44% of chats into sales and cutting support costs, to gaining actionable insights.</p>
                  </div>
                  <a href="/case-studies" style={{ position: 'absolute', bottom: '16px', right: '16px', width: '36px', height: '36px', backgroundColor: '#F3F4F6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', transition: 'all 0.3s ease' }}>
                    <i className="fa-solid fa-chevron-right" style={{ fontSize: '12px' }}></i>
                  </a>
                </div>
                <div className="cards-marquee-card" style={{ display: 'flex', alignItems: 'stretch', backgroundColor: '#fff', borderRadius: '24px', padding: '12px', height: '220px', boxShadow: '0 8px 30px rgba(0,0,0,0.04)', border: '1px solid #F3F4F6', position: 'relative' }}>
                  <div style={{ flex: '0 0 45%', position: 'relative' }}>
                    <img src="assets/img/service/service_chatbot_2.jpg" alt="Affordable Pricing" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px' }} />
                  </div>
                  <div style={{ flex: '1', padding: '12px 12px 40px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ marginBottom: '16px' }}>
                      <img src="assets/img/icon/service_2_2.svg" alt="Icon" style={{ width: '40px', height: '40px' }} />
                    </div>
                    <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#000', marginBottom: '8px', lineHeight: '1.2' }}>Affordable Pricing</h3>
                    <p style={{ fontSize: '12px', color: '#57534E', lineHeight: '1.6', margin: 0 }}>From converting up to 44% of chats into sales and cutting support costs, to gaining actionable insights.</p>
                  </div>
                  <a href="/case-studies" style={{ position: 'absolute', bottom: '16px', right: '16px', width: '36px', height: '36px', backgroundColor: '#F3F4F6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', transition: 'all 0.3s ease' }}>
                    <i className="fa-solid fa-chevron-right" style={{ fontSize: '12px' }}></i>
                  </a>
                </div>
                <div className="cards-marquee-card" style={{ display: 'flex', alignItems: 'stretch', backgroundColor: '#fff', borderRadius: '24px', padding: '12px', height: '220px', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.05)', position: 'relative' }}>
                  <div style={{ flex: '0 0 45%', position: 'relative' }}>
                    <img src="assets/img/service/service_chatbot_3.jpg" alt="Customer Support" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px' }} />
                  </div>
                  <div style={{ flex: '1', padding: '12px 12px 40px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ marginBottom: '16px' }}>
                      <img src="assets/img/icon/service_2_3.svg" alt="Icon" style={{ width: '40px', height: '40px' }} />
                    </div>
                    <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#000', marginBottom: '8px', lineHeight: '1.2' }}>Customer Support</h3>
                    <p style={{ fontSize: '12px', color: '#57534E', lineHeight: '1.6', margin: 0 }}>From converting up to 44% of chats into sales and cutting support costs, to gaining actionable insights.</p>
                  </div>
                  <a href="/case-studies" style={{ position: 'absolute', bottom: '16px', right: '16px', width: '36px', height: '36px', backgroundColor: '#F3F4F6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', transition: 'all 0.3s ease' }}>
                    <i className="fa-solid fa-chevron-right" style={{ fontSize: '12px' }}></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>{/*==============================
Process Area  
==============================*/}
        <section className="space overflow-hidden position-relative space-top">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-7">
                <div className="title-area text-center pe-xl-5 ps-xl-5">
                  <span className="sub-title style3 text-anime-style-2">[ How it works ]</span>
                  <h2 className="sec-title h3 text-anime-style-3">Your AI Assistant in 6 Easy Steps</h2>
                  <p className="fs-18 wow fadeInUp">From first touchpoint to final handoff — see exactly how our intelligent chatbot automates your customer journey seamlessly.
                  </p>
                </div>
              </div>
            </div>
            <hr className="process-line" />
            <div className="row gy-4 justify-content-center">
              {/* Step 1 */}
              <div className="col-md-6 col-xl-4 process-card_wrapp">
                <div className="process-card wow fadeInLeft" data-wow-delay=".2s">
                  <span className="number">01</span>
                  <div className="box-content">
                    <h2 className="box-title">Inbound Message</h2>
                    <p className="box-text">Customer texts your WhatsApp number or scans a QR code.</p>
                  </div>
                  <a href="#" className="icon-btn"><span className="icon"><img src="assets/img/icon/arrow-right.svg" alt="" /></span></a>
                </div>
              </div>
              {/* Step 2 */}
              <div className="col-md-6 col-xl-4 process-card_wrapp">
                <div className="process-card wow fadeInUp" data-wow-delay=".3s">
                  <span className="number">02</span>
                  <div className="box-content">
                    <h2 className="box-title">AI Context Engine</h2>
                    <p className="box-text">Instantly analyzes context, language, and purchasing intent.</p>
                  </div>
                  <a href="#" className="icon-btn"><span className="icon"><img src="assets/img/icon/arrow-right.svg" alt="" /></span></a>
                </div>
              </div>
              {/* Step 3 */}
              <div className="col-md-6 col-xl-4 process-card_wrapp">
                <div className="process-card wow fadeInRight" data-wow-delay=".4s">
                  <span className="number">03</span>
                  <div className="box-content">
                    <h2 className="box-title">Interactive Reply</h2>
                    <p className="box-text">Fires back personalized replies with WhatsApp buttons & lists.</p>
                  </div>
                  <a href="#" className="icon-btn"><span className="icon"><img src="assets/img/icon/arrow-right.svg" alt="" /></span></a>
                </div>
              </div>
              {/* Step 4 */}
              <div className="col-md-6 col-xl-4 process-card_wrapp">
                <div className="process-card wow fadeInLeft" data-wow-delay=".5s">
                  <span className="number">04</span>
                  <div className="box-content">
                    <h2 className="box-title">In-Chat Booking</h2>
                    <p className="box-text">Customer books a meeting slot directly within the chat window.</p>
                  </div>
                  <a href="#" className="icon-btn"><span className="icon"><img src="assets/img/icon/arrow-right.svg" alt="" /></span></a>
                </div>
              </div>
              {/* Step 5 */}
              <div className="col-md-6 col-xl-4 process-card_wrapp">
                <div className="process-card wow fadeInUp" data-wow-delay=".6s">
                  <span className="number">05</span>
                  <div className="box-content">
                    <h2 className="box-title">CRM Sync</h2>
                    <p className="box-text">Automatically logs the lead, tags intent, and updates your CRM.</p>
                  </div>
                  <a href="#" className="icon-btn"><span className="icon"><img src="assets/img/icon/arrow-right.svg" alt="" /></span></a>
                </div>
              </div>
              {/* Step 6 */}
              <div className="col-md-6 col-xl-4 process-card_wrapp">
                <div className="process-card wow fadeInRight" data-wow-delay=".7s">
                  <span className="number">06</span>
                  <div className="box-content">
                    <h2 className="box-title">Smart Handoff</h2>
                    <p className="box-text">Routes complex or high-value chats to human agents seamlessly.</p>
                  </div>
                  <a href="#" className="icon-btn"><span className="icon"><img src="assets/img/icon/arrow-right.svg" alt="" /></span></a>
                </div>
              </div>
            </div>
            <hr className="process-line" />
          </div>
        </section>{/*==============================
Cta Area  
==============================*/}
        <div className="space-extra-top space-bottom">
          <div className="container">
            <style>
              {`
                .animated-bg-shape {
                  position: absolute;
                  border-radius: 50%;
                  filter: blur(60px);
                  opacity: 0.6;
                  animation: float 10s infinite ease-in-out;
                  z-index: 0;
                }
                .shape-1 {
                  width: 300px; height: 300px;
                  background: rgb(34, 197, 94);
                  top: -50px; right: -50px;
                  animation-delay: 0s;
                }
                .shape-2 {
                  width: 400px; height: 400px;
                  background: rgb(22, 101, 52);
                  bottom: -100px; left: 20%;
                  animation-delay: -3s;
                }
                .shape-3 {
                  width: 250px; height: 250px;
                  background: rgb(240, 253, 244);
                  top: 40%; right: 30%;
                  animation-delay: -6s;
                }
                @keyframes float {
                  0%, 100% { transform: translateY(0) scale(1); }
                  50% { transform: translateY(-30px) scale(1.1); }
                }
                .robot-img-popout {
                  position: relative;
                  z-index: 5;
                  max-width: 650px;
                  width: 650px;
                  left: -50px;
                  bottom: -37px; /* Feet resting inside the box */
                }
                @media (max-width: 991px) {
                  .robot-img-popout {
                    max-width: 100%;
                    width: auto;
                    left: 0;
                    bottom: 0px;
                  }
                }
                .cta-premium-btn {
                  background: linear-gradient(135deg, #22C55E 0%, #16a34a 100%);
                  color: #fff !important;
                  border-radius: 50px;
                  display: inline-flex;
                  align-items: center;
                  gap: 12px;
                  padding: 14px 20px 14px 36px;
                  font-size: 16px;
                  font-weight: 700;
                  border: none;
                  transition: all 0.3s ease;
                  text-decoration: none;
                }
                .cta-premium-btn:hover {
                  transform: scale(1.02) translateY(-2px);
                }
                .cta-premium-btn .btn-icon {
                  background: rgba(255, 255, 255, 0.2);
                  border-radius: 50%;
                  width: 36px;
                  height: 36px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  transition: transform 0.3s ease;
                  font-size: 14px;
                }
                .cta-premium-btn:hover .btn-icon {
                  transform: translateX(4px);
                  background: rgba(255, 255, 255, 0.3);
                }
              `}
            </style>
            <div className="cta-area3" style={{
              background: 'linear-gradient(135deg, rgb(18, 38, 58) 0%, rgb(22, 101, 52) 100%)',
              borderRadius: '32px',
              position: 'relative',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              marginTop: '100px',
              marginBottom: '80px'
            }}>

              {/* Animated Background Elements */}
              <div className="animated-bg-shape shape-1"></div>
              <div className="animated-bg-shape shape-2"></div>
              <div className="animated-bg-shape shape-3"></div>

              <div className="row justify-content-end align-items-center" style={{ minHeight: '420px', position: 'relative', zIndex: 3 }}>

                {/* Robot Image */}
                <div className="col-lg-5 position-absolute" style={{ left: 0, bottom: 0, zIndex: 5 }}>
                  <img src="assets/img/normal/cta_robot_new.png" alt="AI Robot" className="robot-img-popout" />
                </div>

                {/* Text Content */}
                <div className="col-lg-7 col-xl-7" style={{ padding: '80px 40px 80px 0', zIndex: 10 }}>
                  <div className="title-area mb-4">
                    <span className="badge mb-3 px-3 py-2 rounded-pill" style={{ fontSize: '13px', letterSpacing: '1px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>
                      <i className="fa-solid fa-bolt text-warning me-2"></i> POWERED BY ADVANCED AI
                    </span>
                    <h2 className="sec-title text-white mb-3" style={{ fontWeight: 800, fontSize: '48px', lineHeight: 1.2 }}>
                      Generate <span style={{ color: '#22C55E' }}>AI Chatbots</span><br />in a Few Clicks
                    </h2>
                    <p className="box-text text-white" style={{ fontSize: '18px', opacity: 0.8, lineHeight: 1.6, maxWidth: '90%' }}>
                      Instantly transform your customer engagement. Get started for free in minutes—no credit card required, no coding needed.
                    </p>
                  </div>
                  <div className="btn-group justify-content-start mt-2">
                    <a href="/contact" className="cta-premium-btn">
                      Start Free Trial
                      <span className="btn-icon">
                        <i className="fa-solid fa-arrow-right"></i>
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*==============================
Testimonial Area  
==============================*/}
        <section className="overflow-hidden position-relative space-bottom overflow-hidden" id="testi-sec">
          <div className="container">
            <div className="row justify-content-center align-items-center">
              <div className="col-lg-7 col-xxl-6">
                <div className="title-area text-center">
                  <span className="sub-title style3 text-anime-style-2">[ Testimonials ]</span>
                  <h2 className="sec-title h3 text-anime-style-3">What our Clients say About Talkinexx</h2>
                </div>
              </div>
            </div>
            <div className="slider-wrap">
              <div className="swiper th-slider has-shadow" id="testiSlide2">
                <div className="swiper-wrapper">
                  <div className="swiper-slide">
                    <div className="testi-box" data-bg-src="assets/img/testimonial/testi-shape.png">
                      <div className="box-wrapp">
                        <div className="box-profile">
                          <div className="box-author">
                            <img src="assets/img/testimonial/sarah_jenkins.jpg" alt="Sarah Jenkins" />
                          </div>
                          <div className="box-quote"><img src="assets/img/icon/quote2.svg" alt /></div>
                        </div>
                        <span className="rating"><i className="fa-sharp fa-solid fa-star-sharp" /><i className="fa-sharp fa-solid fa-star-sharp" /><i className="fa-sharp fa-solid fa-star-sharp" /><i className="fa-sharp fa-solid fa-star-sharp" /><i className="fa-sharp fa-solid fa-star-sharp" /></span>
                      </div>
                      <p className="box-text">"Talkinexx completely transformed our support flow. We were drowning in tickets, but now the AI handles 80% of routine inquiries instantly. Response time went from hours to seconds!"</p>
                      <div className="box-info">
                        <h3 className="box-title">Sarah Jenkins</h3>
                        <span className="box-desig">Customer Success Manager</span>
                      </div>
                      <div className="shape"><img src="assets/img/shape/testi-element.png" alt /></div>
                    </div>
                  </div>
                  <div className="swiper-slide">
                    <div className="testi-box" data-bg-src="assets/img/testimonial/testi-shape.png">
                      <div className="box-wrapp">
                        <div className="box-profile">
                          <div className="box-author">
                            <img src="assets/img/testimonial/mark_robinson.jpg" alt="Mark Robinson" />
                          </div>
                          <div className="box-quote"><img src="assets/img/icon/quote2.svg" alt /></div>
                        </div>
                        <span className="rating"><i className="fa-sharp fa-solid fa-star-sharp" /><i className="fa-sharp fa-solid fa-star-sharp" /><i className="fa-sharp fa-solid fa-star-sharp" /><i className="fa-sharp fa-solid fa-star-sharp" /><i className="fa-sharp fa-solid fa-star-sharp" /></span>
                      </div>
                      <p className="box-text">"Setting up the chatbot was incredibly intuitive. It seamlessly integrated with our store and started capturing leads on day one. It's like having a top-tier sales rep working 24/7."</p>
                      <div className="box-info">
                        <h3 className="box-title">Marcus Chen</h3>
                        <span className="box-desig">E-Commerce Director</span>
                      </div>
                      <div className="shape"><img src="assets/img/shape/testi-element.png" alt /></div>
                    </div>
                  </div>
                  <div className="swiper-slide">
                    <div className="testi-box" data-bg-src="assets/img/testimonial/testi-shape.png">
                      <div className="box-wrapp">
                        <div className="box-profile">
                          <div className="box-author">
                            <img src="assets/img/testimonial/elena_rodriguez.jpg" alt="Elena Rodriguez" />
                          </div>
                          <div className="box-quote"><img src="assets/img/icon/quote2.svg" alt /></div>
                        </div>
                        <span className="rating"><i className="fa-sharp fa-solid fa-star-sharp" /><i className="fa-sharp fa-solid fa-star-sharp" /><i className="fa-sharp fa-solid fa-star-sharp" /><i className="fa-sharp fa-solid fa-star-sharp" /><i className="fa-sharp fa-solid fa-star-sharp" /></span>
                      </div>
                      <p className="box-text">"The natural language processing is uncanny. Our customers actually think they're talking to a human! It's saved us thousands in support costs while boosting satisfaction."</p>
                      <div className="box-info">
                        <h3 className="box-title">Elena Rodriguez</h3>
                        <span className="box-desig">Founder & CEO</span>
                      </div>
                      <div className="shape"><img src="assets/img/shape/testi-element.png" alt /></div>
                    </div>
                  </div>
                  <div className="swiper-slide">
                    <div className="testi-box" data-bg-src="assets/img/testimonial/testi-shape.png">
                      <div className="box-wrapp">
                        <div className="box-profile">
                          <div className="box-author">
                            <img src="assets/img/testimonial/david_park.jpg" alt="David Park" />
                          </div>
                          <div className="box-quote"><img src="assets/img/icon/quote2.svg" alt="quote" /></div>
                        </div>
                        <span className="rating"><i className="fa-sharp fa-solid fa-star-sharp" /><i className="fa-sharp fa-solid fa-star-sharp" /><i className="fa-sharp fa-solid fa-star-sharp" /><i className="fa-sharp fa-solid fa-star-sharp" /><i className="fa-sharp fa-solid fa-star-sharp" /></span>
                      </div>
                      <p className="box-text">"We tried other chatbot builders, but they were too rigid. Talkinexx's AI learns from our internal docs perfectly and always gives accurate answers. Absolute game-changer for our SaaS."</p>
                      <div className="box-info">
                        <h3 className="box-title">David Park</h3>
                        <span className="box-desig">Head of Operations</span>
                      </div>
                      <div className="shape"><img src="assets/img/shape/testi-element.png" alt="shape" /></div>
                    </div>
                  </div>

                  <div className="swiper-slide">
                    <div className="testi-box" data-bg-src="assets/img/testimonial/testi-shape.png">
                      <div className="box-wrapp">
                        <div className="box-profile">
                          <div className="box-author">
                            <img src="assets/img/testimonial/lisa_vance.jpg" alt="Lisa Vance" />
                          </div>
                          <div className="box-quote"><img src="assets/img/icon/quote2.svg" alt="quote" /></div>
                        </div>
                        <span className="rating"><i className="fa-sharp fa-solid fa-star-sharp" /><i className="fa-sharp fa-solid fa-star-sharp" /><i className="fa-sharp fa-solid fa-star-sharp" /><i className="fa-sharp fa-solid fa-star-sharp" /><i className="fa-sharp fa-solid fa-star-sharp" /></span>
                      </div>
                      <p className="box-text">"Within a week of deploying, our website conversion rate jumped by 30%. The bot gently guides visitors to exactly what they need without being intrusive. Best investment we've made."</p>
                      <div className="box-info">
                        <h3 className="box-title">Lisa Vance</h3>
                        <span className="box-desig">Marketing Director</span>
                      </div>
                      <div className="shape"><img src="assets/img/shape/testi-element.png" alt="shape" /></div>
                    </div>
                  </div>

                  <div className="swiper-slide">
                    <div className="testi-box" data-bg-src="assets/img/testimonial/testi-shape.png">
                      <div className="box-wrapp">
                        <div className="box-profile">
                          <div className="box-author">
                            <img src="assets/img/testimonial/james_thorne.jpg" alt="James Thorne" />
                          </div>
                          <div className="box-quote"><img src="assets/img/icon/quote2.svg" alt="quote" /></div>
                        </div>
                        <span className="rating"><i className="fa-sharp fa-solid fa-star-sharp" /><i className="fa-sharp fa-solid fa-star-sharp" /><i className="fa-sharp fa-solid fa-star-sharp" /><i className="fa-sharp fa-solid fa-star-sharp" /><i className="fa-sharp fa-solid fa-star-sharp" /></span>
                      </div>
                      <p className="box-text">"I was skeptical about AI, but Talkinexx feels incredibly human. Our clients love the instant 24/7 support, and it has freed up my team to focus on high-value calls. Stunning platform."</p>
                      <div className="box-info">
                        <h3 className="box-title">James Thorne</h3>
                        <span className="box-desig">Agency Owner</span>
                      </div>
                      <div className="shape"><img src="assets/img/shape/testi-element.png" alt="shape" /></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/*==============================
Price Area  
==============================*/}
        <section className="position-relative space-bottom overflow-hidden">
          <style>{`
            .pricing-outline-btn {
              background: #F9FAFB !important;
              color: #000000 !important;
              border: 1px solid #E5E7EB !important;
              border-radius: 8px !important;
              padding: 14px !important;
              transition: all 0.4s ease !important;
            }
            .pricing-outline-btn:hover {
              background: #000000 !important;
              color: #FFFFFF !important;
              border-color: #000000 !important;
            }
            .price-card .available-list li::after {
              display: none !important;
            }
          `}</style>
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8 col-xxl-8">
                <div className="title-area text-center">
                  <span className="sub-title style3 text-anime-style-2" style={{ textTransform: 'uppercase', letterSpacing: '1px', backgroundColor: '#F0F4FF', color: '#456FF8', padding: '5px 15px', borderRadius: '30px', fontSize: '12px', fontWeight: 'bold' }}>PRICING PLANS</span>
                  <h2 className="sec-title h1 text-anime-style-3 mt-3 mb-4" style={{ fontWeight: '700', color: '#12263A' }}>Scale your WhatsApp<br />operations</h2>
                  <p className="mt-3 text-secondary fs-16 mx-auto" style={{ maxWidth: '650px' }}>Choose a plan that fits your business scale. Unlock unlimited contacts, advanced AI auto-replies, and seamless CRM integrations.</p>
                </div>
              </div>
            </div>
            <div className="row justify-content-center mb-5">
              <div className="col-auto">
                <div className="sec-btn d-flex align-items-center">
                  <div className="pricing-tabs">
                    <div className="switch-area">
                      <label className="toggler toggler--is-active ms-0 fw-bold" id="filt-monthly">MONTHLY BILLING</label>
                      <div className="toggle">
                        <input type="checkbox" id="switcher" className="check" />
                        <b className="b switch" />
                      </div>
                      <label className="toggler fw-bold" id="filt-yearly">YEARLY BILLING</label>
                    </div>
                  </div>
                  <span className="badge ms-3" style={{ backgroundColor: '#E8F0FE', color: '#456FF8', borderRadius: '4px', padding: '6px 10px', fontSize: '11px', letterSpacing: '0.5px' }}>SAVE 20%</span>
                </div>
              </div>
            </div>
            <div id="monthly" className="wrapper-full">
              <div className="row gy-4 justify-content-center align-items-center">

                {/* Starter Plan */}
                <div className="col-xl-4 col-md-6 price-card_wrapp">
                  <div className="price-card th-ani" style={{ borderRadius: '24px', padding: '40px', border: '1px solid #EBEBEB' }}>
                    <span className="offer-tag" />
                    <div className="box-content text-start">
                      <h3 className="box-title" style={{ fontSize: '14px', letterSpacing: '2px', color: '#4B5563', textTransform: 'uppercase', marginBottom: '10px' }}>STARTER</h3>
                      <p className="subtitle text-secondary mb-4" style={{ fontSize: '14px' }}>Perfect for small businesses starting out.</p>
                      <h4 className="box-price d-flex align-items-end mb-4">
                        <span className="dollar text-dark fw-bold" style={{ fontSize: '48px', lineHeight: '1' }}>$0</span>
                        <span className="duration text-secondary ms-1" style={{ fontSize: '14px', paddingBottom: '8px' }}>/mo</span>
                      </h4>
                    </div>
                    <div className="available-list text-start mb-5">
                      <ul className="list-unstyled" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <li className="d-flex align-items-center"><i className="fa-regular fa-circle-check me-3" style={{ color: '#22C55E', fontSize: '18px' }}></i> <span style={{ fontSize: '14px', color: '#374151' }}>1 WhatsApp Number</span></li>
                        <li className="d-flex align-items-center"><i className="fa-regular fa-circle-check me-3" style={{ color: '#22C55E', fontSize: '18px' }}></i> <span style={{ fontSize: '14px', color: '#374151' }}>100 AI Auto-Replies / mo</span></li>
                        <li className="d-flex align-items-center"><i className="fa-regular fa-circle-check me-3" style={{ color: '#22C55E', fontSize: '18px' }}></i> <span style={{ fontSize: '14px', color: '#374151' }}>Basic WhatsApp Broadcasts</span></li>
                        <li className="d-flex align-items-center"><i className="fa-regular fa-circle-check me-3" style={{ color: '#22C55E', fontSize: '18px' }}></i> <span style={{ fontSize: '14px', color: '#374151' }}>Standard Team Inbox</span></li>
                      </ul>
                    </div>
                    <div className="btn-group w-100">
                      <a href="/contact" className="th-btn2 fw-btn w-100 text-center pricing-outline-btn">GET STARTED</a>
                    </div>
                  </div>
                </div>

                {/* Business Plan */}
                <div className="col-xl-4 col-md-6 price-card_wrapp">
                  <div className="price-card th-ani active" style={{ borderRadius: '24px', padding: '40px', border: '2px solid #22C55E', position: 'relative', boxShadow: '0 20px 40px rgba(69, 111, 248, 0.08)' }}>
                    <span className="offer-tag" style={{ position: 'absolute', top: '25px', right: '25px', background: '#F0F4FF', color: '#22C55E', padding: '4px 12px', borderRadius: '30px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}> <i className="fa-solid fa-star me-1"></i> MOST POPULAR</span>
                    <div className="box-content text-start mt-2">
                      <h3 className="box-title" style={{ fontSize: '14px', letterSpacing: '2px', color: '#22C55E', textTransform: 'uppercase', marginBottom: '10px' }}>BUSINESS</h3>
                      <p className="subtitle text-secondary mb-4" style={{ fontSize: '14px' }}>For high-growth teams scaling their reach.</p>
                      <h4 className="box-price d-flex align-items-end mb-4">
                        <span className="dollar text-dark fw-bold" style={{ fontSize: '48px', lineHeight: '1' }}>$49</span>
                        <span className="duration text-secondary ms-1" style={{ fontSize: '14px', paddingBottom: '8px' }}>/mo</span>
                      </h4>
                    </div>
                    <div className="available-list text-start mb-5">
                      <ul className="list-unstyled" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <li className="d-flex align-items-center"><i className="fa-regular fa-circle-check me-3" style={{ color: '#22C55E', fontSize: '18px' }}></i> <span style={{ fontSize: '14px', color: '#374151' }}>Official WhatsApp API</span></li>
                        <li className="d-flex align-items-center"><i className="fa-regular fa-circle-check me-3" style={{ color: '#22C55E', fontSize: '18px' }}></i> <span style={{ fontSize: '14px', color: '#374151' }}>Unlimited AI Copilot Replies</span></li>
                        <li className="d-flex align-items-center"><i className="fa-regular fa-circle-check me-3" style={{ color: '#22C55E', fontSize: '18px' }}></i> <span style={{ fontSize: '14px', color: '#374151' }}>Advanced Sequence Flows</span></li>
                        <li className="d-flex align-items-center"><i className="fa-regular fa-circle-check me-3" style={{ color: '#22C55E', fontSize: '18px' }}></i> <span style={{ fontSize: '14px', color: '#374151' }}>Full CRM & Store Sync</span></li>
                      </ul>
                    </div>
                    <div className="btn-group w-100">
                      <a href="/contact" className="th-btn2 fw-btn w-100 text-center text-white" style={{ background: '#22C55E', borderRadius: '8px', padding: '14px', border: 'none' }}>GET STARTED</a>
                    </div>
                  </div>
                </div>

                {/* Enterprise Plan */}
                <div className="col-xl-4 col-md-6 price-card_wrapp">
                  <div className="price-card th-ani" style={{ borderRadius: '24px', padding: '40px', border: '1px solid #EBEBEB' }}>
                    <span className="offer-tag" />
                    <div className="box-content text-start">
                      <h3 className="box-title" style={{ fontSize: '14px', letterSpacing: '2px', color: '#4B5563', textTransform: 'uppercase', marginBottom: '10px' }}>ENTERPRISE</h3>
                      <p className="subtitle text-secondary mb-4" style={{ fontSize: '14px' }}>Custom workflows and dedicated support.</p>
                      <h4 className="box-price d-flex align-items-end mb-4">
                        <span className="dollar text-dark fw-bold" style={{ fontSize: '48px', lineHeight: '1' }}>Custom</span>
                      </h4>
                    </div>
                    <div className="available-list text-start mb-5" style={{ marginTop: '25px' }}>
                      <ul className="list-unstyled" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <li className="d-flex align-items-center"><i className="fa-regular fa-circle-check me-3" style={{ color: '#22C55E', fontSize: '18px' }}></i> <span style={{ fontSize: '14px', color: '#374151' }}>Unlimited WhatsApp Numbers</span></li>
                        <li className="d-flex align-items-center"><i className="fa-regular fa-circle-check me-3" style={{ color: '#22C55E', fontSize: '18px' }}></i> <span style={{ fontSize: '14px', color: '#374151' }}>Meta Green Tick Assistance</span></li>
                        <li className="d-flex align-items-center"><i className="fa-regular fa-circle-check me-3" style={{ color: '#22C55E', fontSize: '18px' }}></i> <span style={{ fontSize: '14px', color: '#374151' }}>Custom Interactive Flows</span></li>
                        <li className="d-flex align-items-center"><i className="fa-regular fa-circle-check me-3" style={{ color: '#22C55E', fontSize: '18px' }}></i> <span style={{ fontSize: '14px', color: '#374151' }}>Dedicated Success Manager</span></li>
                      </ul>
                    </div>
                    <div className="btn-group w-100">
                      <a href="/contact" className="th-btn2 fw-btn w-100 text-center pricing-outline-btn">GET STARTED</a>
                    </div>
                  </div>
                </div>

              </div>
            </div>
            <div id="yearly" className="wrapper-full hide">
              <div className="row gy-4 justify-content-center align-items-center">

                {/* Starter Plan */}
                <div className="col-xl-4 col-md-6 price-card_wrapp">
                  <div className="price-card th-ani" style={{ borderRadius: '24px', padding: '40px', border: '1px solid #EBEBEB' }}>
                    <span className="offer-tag" />
                    <div className="box-content text-start">
                      <h3 className="box-title" style={{ fontSize: '14px', letterSpacing: '2px', color: '#4B5563', textTransform: 'uppercase', marginBottom: '10px' }}>STARTER</h3>
                      <p className="subtitle text-secondary mb-4" style={{ fontSize: '14px' }}>Perfect for small businesses starting out.</p>
                      <h4 className="box-price d-flex align-items-end mb-4">
                        <span className="dollar text-dark fw-bold" style={{ fontSize: '48px', lineHeight: '1' }}>$0</span>
                        <span className="duration text-secondary ms-1" style={{ fontSize: '14px', paddingBottom: '8px' }}>/mo</span>
                      </h4>
                    </div>
                    <div className="available-list text-start mb-5">
                      <ul className="list-unstyled" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <li className="d-flex align-items-center"><i className="fa-regular fa-circle-check me-3" style={{ color: '#456FF8', fontSize: '18px' }}></i> <span style={{ fontSize: '14px', color: '#374151' }}>1 WhatsApp Number</span></li>
                        <li className="d-flex align-items-center"><i className="fa-regular fa-circle-check me-3" style={{ color: '#456FF8', fontSize: '18px' }}></i> <span style={{ fontSize: '14px', color: '#374151' }}>100 AI Auto-Replies / mo</span></li>
                        <li className="d-flex align-items-center"><i className="fa-regular fa-circle-check me-3" style={{ color: '#456FF8', fontSize: '18px' }}></i> <span style={{ fontSize: '14px', color: '#374151' }}>Basic WhatsApp Broadcasts</span></li>
                        <li className="d-flex align-items-center"><i className="fa-regular fa-circle-check me-3" style={{ color: '#456FF8', fontSize: '18px' }}></i> <span style={{ fontSize: '14px', color: '#374151' }}>Standard Team Inbox</span></li>
                      </ul>
                    </div>
                    <div className="btn-group w-100">
                      <a href="/contact" className="th-btn2 fw-btn w-100 text-center pricing-outline-btn">GET STARTED</a>
                    </div>
                  </div>
                </div>

                {/* Business Plan */}
                <div className="col-xl-4 col-md-6 price-card_wrapp">
                  <div className="price-card th-ani active" style={{ borderRadius: '24px', padding: '40px', border: '2px solid #456FF8', position: 'relative', boxShadow: '0 20px 40px rgba(69, 111, 248, 0.08)' }}>
                    <span className="offer-tag" style={{ position: 'absolute', top: '25px', right: '25px', background: '#F0F4FF', color: '#456FF8', padding: '4px 12px', borderRadius: '30px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}> <i className="fa-solid fa-star me-1"></i> MOST POPULAR</span>
                    <div className="box-content text-start mt-2">
                      <h3 className="box-title" style={{ fontSize: '14px', letterSpacing: '2px', color: '#456FF8', textTransform: 'uppercase', marginBottom: '10px' }}>BUSINESS</h3>
                      <p className="subtitle text-secondary mb-4" style={{ fontSize: '14px' }}>For high-growth teams scaling their reach.</p>
                      <h4 className="box-price d-flex align-items-end mb-4">
                        <span className="dollar text-dark fw-bold" style={{ fontSize: '48px', lineHeight: '1' }}>$39</span>
                        <span className="duration text-secondary ms-1" style={{ fontSize: '14px', paddingBottom: '8px' }}>/mo <br /><small>(billed annually)</small></span>
                      </h4>
                    </div>
                    <div className="available-list text-start mb-5">
                      <ul className="list-unstyled" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <li className="d-flex align-items-center"><i className="fa-regular fa-circle-check me-3" style={{ color: '#456FF8', fontSize: '18px' }}></i> <span style={{ fontSize: '14px', color: '#374151' }}>Official WhatsApp API</span></li>
                        <li className="d-flex align-items-center"><i className="fa-regular fa-circle-check me-3" style={{ color: '#456FF8', fontSize: '18px' }}></i> <span style={{ fontSize: '14px', color: '#374151' }}>Unlimited AI Copilot Replies</span></li>
                        <li className="d-flex align-items-center"><i className="fa-regular fa-circle-check me-3" style={{ color: '#456FF8', fontSize: '18px' }}></i> <span style={{ fontSize: '14px', color: '#374151' }}>Advanced Sequence Flows</span></li>
                        <li className="d-flex align-items-center"><i className="fa-regular fa-circle-check me-3" style={{ color: '#456FF8', fontSize: '18px' }}></i> <span style={{ fontSize: '14px', color: '#374151' }}>Full CRM & Store Sync</span></li>
                      </ul>
                    </div>
                    <div className="btn-group w-100">
                      <a href="/contact" className="th-btn2 fw-btn w-100 text-center text-white" style={{ background: '#456FF8', borderRadius: '8px', padding: '14px', border: 'none' }}>GET STARTED</a>
                    </div>
                  </div>
                </div>

                {/* Enterprise Plan */}
                <div className="col-xl-4 col-md-6 price-card_wrapp">
                  <div className="price-card th-ani" style={{ borderRadius: '24px', padding: '40px', border: '1px solid #EBEBEB' }}>
                    <span className="offer-tag" />
                    <div className="box-content text-start">
                      <h3 className="box-title" style={{ fontSize: '14px', letterSpacing: '2px', color: '#4B5563', textTransform: 'uppercase', marginBottom: '10px' }}>ENTERPRISE</h3>
                      <p className="subtitle text-secondary mb-4" style={{ fontSize: '14px' }}>Custom workflows and dedicated support.</p>
                      <h4 className="box-price d-flex align-items-end mb-4">
                        <span className="dollar text-dark fw-bold" style={{ fontSize: '48px', lineHeight: '1' }}>Custom</span>
                      </h4>
                    </div>
                    <div className="available-list text-start mb-5" style={{ marginTop: '25px' }}>
                      <ul className="list-unstyled" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <li className="d-flex align-items-center"><i className="fa-regular fa-circle-check me-3" style={{ color: '#456FF8', fontSize: '18px' }}></i> <span style={{ fontSize: '14px', color: '#374151' }}>Unlimited WhatsApp Numbers</span></li>
                        <li className="d-flex align-items-center"><i className="fa-regular fa-circle-check me-3" style={{ color: '#456FF8', fontSize: '18px' }}></i> <span style={{ fontSize: '14px', color: '#374151' }}>Meta Green Tick Assistance</span></li>
                        <li className="d-flex align-items-center"><i className="fa-regular fa-circle-check me-3" style={{ color: '#456FF8', fontSize: '18px' }}></i> <span style={{ fontSize: '14px', color: '#374151' }}>Custom Interactive Flows</span></li>
                        <li className="d-flex align-items-center"><i className="fa-regular fa-circle-check me-3" style={{ color: '#456FF8', fontSize: '18px' }}></i> <span style={{ fontSize: '14px', color: '#374151' }}>Dedicated Success Manager</span></li>
                      </ul>
                    </div>
                    <div className="btn-group w-100">
                      <a href="/contact" className="th-btn2 fw-btn w-100 text-center pricing-outline-btn">GET STARTED</a>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>
        {/*==============================
Faq Area
==============================*/}
        <div className="overflow-hidden  space overflow-hidden" id="faq-sec" data-bg-src="assets/img/bg/faq_bg_1.jpg">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-xl-8">
                <div className="title-area mb-40 text-center">
                  <span className="sub-title style3">[ Support Center ]</span>
                  <h2 className="sec-title h3">Got questions about WhatsApp AI?</h2>
                  <p className="mt-3 box-text">Everything you need to know about setting up your WhatsApp Business API, automation limits, compliance, and CRM integrations.</p>
                </div>
              </div>
            </div>
            <div className="row gy-4 justify-content-center">
              <div className="col-xl-4 col-md-6">
                <div className="faq-card" style={{ height: '100%' }}>
                  <h3 className="box-title" style={{ fontSize: '18px' }}>01. How do I connect my WhatsApp number to the AI automation platform?</h3>
                  <div className="box-content">
                    <p className="box-text">We use Meta's official WhatsApp Business Cloud API. You simply verify your business and link your phone number ID. It's 100% secure, fully compliant, and ensures maximum message delivery rates.</p>
                  </div>
                </div>
              </div>
              <div className="col-xl-4 col-md-6">
                <div className="faq-card" style={{ height: '100%' }}>
                  <h3 className="box-title" style={{ fontSize: '18px' }}>02. Can the AI copilot handle customer support and bookings simultaneously?</h3>
                  <div className="box-content">
                    <p className="box-text">Yes! Our AI is trained to understand context. It can answer FAQs, route complex queries to your human agents, and instantly trigger WhatsApp booking flows right inside the chat.</p>
                  </div>
                </div>
              </div>
              <div className="col-xl-4 col-md-6">
                <div className="faq-card" style={{ height: '100%' }}>
                  <h3 className="box-title" style={{ fontSize: '18px' }}>03. Is there a limit to how many WhatsApp broadcast messages I can send?</h3>
                  <div className="box-content">
                    <p className="box-text">Broadcast limits are determined by your Meta API tier (starting at 1,000 to 100K+ messages/day). Our platform seamlessly supports high-volume broadcasts for your marketing campaigns without throttling.</p>
                  </div>
                </div>
              </div>
              <div className="col-xl-4 col-md-6">
                <div className="faq-card" style={{ height: '100%' }}>
                  <h3 className="box-title" style={{ fontSize: '18px' }}>04. Can I integrate my existing CRM with your WhatsApp automation?</h3>
                  <div className="box-content">
                    <p className="box-text">Absolutely. We offer native integrations for HubSpot, Salesforce, and custom webhooks. Whenever a lead interacts with your WhatsApp bot, their profile and chat history automatically sync to your CRM.</p>
                  </div>
                </div>
              </div>
              <div className="col-xl-4 col-md-6">
                <div className="faq-card" style={{ height: '100%' }}>
                  <h3 className="box-title" style={{ fontSize: '18px' }}>05. Will my WhatsApp account get banned for using automation?</h3>
                  <div className="box-content">
                    <p className="box-text">No. Because we use the official Meta Cloud API, you are fully compliant with WhatsApp's terms of service. You will not risk being banned, unlike unofficial web scraping tools.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Support Box */}
            <div className="row justify-content-center mt-5">
              <div className="col-xl-8">
                <div className="d-flex align-items-center p-4" style={{ backgroundColor: '#fff', border: '1px solid #EBEBEB', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                  <div className="icon-box me-4 d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#DCFCE7', color: '#22C55E', fontSize: '24px' }}>
                    <i className="fa-regular fa-comments"></i>
                  </div>
                  <div>
                    <h4 className="mb-2" style={{ fontSize: '20px', fontWeight: '700', color: '#12263A' }}>Still have questions?</h4>
                    <p className="mb-3 text-secondary" style={{ fontSize: '15px' }}>Our WhatsApp automation experts are ready to help you build the perfect workflow.</p>
                    <a href="/contact" className="th-btn2 style2 extra-padding text-white" style={{ background: '#22C55E', border: 'none', padding: '10px 25px', fontSize: '14px' }}>Chat with our team <i className="fa-solid fa-arrow-right ms-2"></i></a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>{/*==============================
Blog Area  
==============================*/}
        <section className="space overflow-hidden">
          <div className="container">
            <div className="row align-items-center gy-5">
              <div className="col-xl-6">
                <div className="pe-xl-5 text-center text-xl-start">
                  <img src="assets/img/normal/whatsapp_dashboard_white.jpg" alt="WhatsApp Automation Dashboard" className="img-fluid" />
                </div>
              </div>
              <div className="col-xl-6">
                <div className="title-area mb-0">
                  <span className="sub-title style3" style={{ backgroundColor: '#DCFCE7', color: '#22C55E', padding: '6px 16px', borderRadius: '30px', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '12px', fontWeight: '700' }}>WHATSAPP AUTOMATION</span>
                  <h2 className="sec-title mt-3" style={{ color: '#12263A', fontWeight: '800', fontSize: '48px', lineHeight: '1.2' }}>Scale your business on WhatsApp</h2>
                  <p className="sec-text mt-4 text-secondary" style={{ fontSize: '18px', lineHeight: '1.7' }}>
                    Stop manually replying to repetitive queries. Automate responses, route conversations to the right team, and send targeted broadcast campaigns on the world's most popular messaging app.
                  </p>
                  <div className="d-flex flex-wrap mt-5" style={{ gap: '50px' }}>
                    <div>
                      <h3 className="mb-1" style={{ fontSize: '40px', fontWeight: '800', color: '#12263A' }}>98%</h3>
                      <p className="text-secondary mb-0" style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700' }}>Message Open Rate</p>
                    </div>
                    <div>
                      <h3 className="mb-1" style={{ fontSize: '40px', fontWeight: '800', color: '#12263A' }}>24/7</h3>
                      <p className="text-secondary mb-0" style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700' }}>Automated Support</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>{/*==============================
	Footer Area
==============================*/}
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

export default HomeAiChatbot;
