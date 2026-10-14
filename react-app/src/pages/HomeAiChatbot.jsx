
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';

const HomeAiChatbot = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');

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
    <Layout>
      <div>
        {/*==============================
Hero Area
==============================*/}

        <div className="th-hero-wrapper hero-2" id="hero" data-bg-src="assets/img/bg/hero_bg_2.jpg">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-xl-6">
                <div className="hero-style2">
                  <h1 className="hero-title">Automate <span className="text-theme">WhatsApp Conversations</span> with Intelligent AI
                  </h1>
                  <p className="hero-text">Boost customer engagement, automate 24/7 support, and scale your business with official WhatsApp Cloud API and intelligent AI chatbots.</p>
                  <div className="btn-group justify-content-xl-start justify-content-center">
                    <a href="/contact" className="th-btn2">Build Your Chatbot</a>
                    <a href="/contact" className="th-btn2 style2">Book a Demo</a>
                  </div>
                  <div className="client-box mb-sm-0 mb-3 justify-content-xl-start justify-content-center">
                    <div className="client-thumb-group">
                      <div className="thumb"><img src="assets/img/shape/client-1-1.png" alt="Satisfied Talkinexx Client" />
                      </div>
                      <div className="thumb"><img src="assets/img/shape/client-1-2.png" alt="Happy Enterprise Customer" />
                      </div>
                      <div className="thumb"><img src="assets/img/shape/client-1-3.png" alt="Business Automation User" />
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

                  <img src="assets/img/hero/hero-img.png" alt="Talkinexx WhatsApp Cloud Automation Platform Dashboard" style={{ position: 'relative', zIndex: 1 }} />
                  <div className="hero-bottom-text jump" style={{ zIndex: 2 }}><img src="assets/img/shape/avatar.svg" alt="AI Virtual Assistant" /><span className="title">How
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
                    gaining actionable insights for new strategies, brands in any industry can thrive with Talkinexx WhatsApp Automation.
                  </p>
                </div>
              </div>
              <div className="col-auto">
                <div className="btn-group mb-0 mb-md-5">
                  <a href="/contact" className="th-btn2">Book a Demo</a>
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
                  height: 220px;
                  overflow: hidden;
                  box-sizing: border-box;
                }
                .cards-marquee-card .card-icon-img {
                  width: 26px !important;
                  height: 26px !important;
                  object-fit: contain;
                  display: block;
                }
                .cards-marquee-card .card-icon-wrap {
                  margin-bottom: 8px;
                  display: flex;
                  align-items: center;
                }
                @keyframes slideCards {
                  0% { transform: translateX(0); }
                  100% { transform: translateX(calc(-50% - 12px)); }
                }
                @media (max-width: 768px) {
                  .cards-marquee-card {
                    width: 320px !important;
                    height: 215px !important;
                    padding: 10px !important;
                  }
                  .cards-marquee-card .card-img-col {
                    flex: 0 0 40% !important;
                  }
                  .cards-marquee-card .card-content-col {
                    padding: 8px 8px 30px 12px !important;
                    justify-content: flex-start !important;
                  }
                  .cards-marquee-card .card-icon-wrap {
                    margin-bottom: 4px !important;
                  }
                  .cards-marquee-card .card-icon-img {
                    width: 20px !important;
                    height: 20px !important;
                  }
                  .cards-marquee-card .card-title {
                    font-size: 15px !important;
                    margin-bottom: 4px !important;
                    line-height: 1.2 !important;
                  }
                  .cards-marquee-card .card-desc {
                    font-size: 11px !important;
                    line-height: 1.4 !important;
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                  }
                  .cards-marquee-card .card-arrow-btn {
                    width: 30px !important;
                    height: 30px !important;
                    bottom: 10px !important;
                    right: 10px !important;
                  }
                }
              `}} />
              <div className="cards-marquee-track">
                {/* First Set */}
                <div className="cards-marquee-card" style={{ display: 'flex', alignItems: 'stretch', backgroundColor: '#fff', borderRadius: '24px', padding: '12px', height: '220px', boxShadow: '0 8px 30px rgba(0,0,0,0.04)', border: '1px solid #F3F4F6', position: 'relative', overflow: 'hidden' }}>
                  <div className="card-img-col" style={{ flex: '0 0 45%', position: 'relative' }}>
                    <img src="assets/img/service/service_chatbot_1.jpg" alt="Tailored Solutions" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px' }} />
                  </div>
                  <div className="card-content-col" style={{ flex: '1', padding: '12px 12px 36px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div className="card-icon-wrap">
                      <img src="assets/img/icon/service_2_1.svg" alt="Icon" className="card-icon-img" />
                    </div>
                    <h3 className="card-title" style={{ fontSize: '18px', fontWeight: '800', color: '#000', marginBottom: '8px', lineHeight: '1.2' }}>Tailored Solutions</h3>
                    <p className="card-desc" style={{ fontSize: '12px', color: '#57534E', lineHeight: '1.6', margin: 0 }}>From converting up to 44% of chats into sales and cutting support costs, to gaining actionable insights.</p>
                  </div>
                  <a href="/case-studies" className="card-arrow-btn" style={{ position: 'absolute', bottom: '16px', right: '16px', width: '36px', height: '36px', backgroundColor: '#F3F4F6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', transition: 'all 0.3s ease' }}>
                    <i className="fa-solid fa-chevron-right" style={{ fontSize: '12px' }}></i>
                  </a>
                </div>
                <div className="cards-marquee-card" style={{ display: 'flex', alignItems: 'stretch', backgroundColor: '#fff', borderRadius: '24px', padding: '12px', height: '220px', boxShadow: '0 8px 30px rgba(0,0,0,0.04)', border: '1px solid #F3F4F6', position: 'relative', overflow: 'hidden' }}>
                  <div className="card-img-col" style={{ flex: '0 0 45%', position: 'relative' }}>
                    <img src="assets/img/service/service_chatbot_2.jpg" alt="Affordable Pricing" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px' }} />
                  </div>
                  <div className="card-content-col" style={{ flex: '1', padding: '12px 12px 36px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div className="card-icon-wrap">
                      <img src="assets/img/icon/service_2_2.svg" alt="Icon" className="card-icon-img" />
                    </div>
                    <h3 className="card-title" style={{ fontSize: '18px', fontWeight: '800', color: '#000', marginBottom: '8px', lineHeight: '1.2' }}>Affordable Pricing</h3>
                    <p className="card-desc" style={{ fontSize: '12px', color: '#57534E', lineHeight: '1.6', margin: 0 }}>From converting up to 44% of chats into sales and cutting support costs, to gaining actionable insights.</p>
                  </div>
                  <a href="/case-studies" className="card-arrow-btn" style={{ position: 'absolute', bottom: '16px', right: '16px', width: '36px', height: '36px', backgroundColor: '#F3F4F6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', transition: 'all 0.3s ease' }}>
                    <i className="fa-solid fa-chevron-right" style={{ fontSize: '12px' }}></i>
                  </a>
                </div>
                <div className="cards-marquee-card" style={{ display: 'flex', alignItems: 'stretch', backgroundColor: '#fff', borderRadius: '24px', padding: '12px', height: '220px', boxShadow: '0 8px 30px rgba(0,0,0,0.04)', border: '1px solid #F3F4F6', position: 'relative', overflow: 'hidden' }}>
                  <div className="card-img-col" style={{ flex: '0 0 45%', position: 'relative' }}>
                    <img src="assets/img/service/service_chatbot_3.jpg" alt="Customer Support" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px' }} />
                  </div>
                  <div className="card-content-col" style={{ flex: '1', padding: '12px 12px 36px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div className="card-icon-wrap">
                      <img src="assets/img/icon/service_2_3.svg" alt="Icon" className="card-icon-img" />
                    </div>
                    <h3 className="card-title" style={{ fontSize: '18px', fontWeight: '800', color: '#000', marginBottom: '8px', lineHeight: '1.2' }}>Customer Support</h3>
                    <p className="card-desc" style={{ fontSize: '12px', color: '#57534E', lineHeight: '1.6', margin: 0 }}>From converting up to 44% of chats into sales and cutting support costs, to gaining actionable insights.</p>
                  </div>
                  <a href="/case-studies" className="card-arrow-btn" style={{ position: 'absolute', bottom: '16px', right: '16px', width: '36px', height: '36px', backgroundColor: '#F3F4F6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', transition: 'all 0.3s ease' }}>
                    <i className="fa-solid fa-chevron-right" style={{ fontSize: '12px' }}></i>
                  </a>
                </div>
                {/* Second Set for seamless loop */}
                <div className="cards-marquee-card" style={{ display: 'flex', alignItems: 'stretch', backgroundColor: '#fff', borderRadius: '24px', padding: '12px', height: '220px', boxShadow: '0 8px 30px rgba(0,0,0,0.04)', border: '1px solid #F3F4F6', position: 'relative', overflow: 'hidden' }}>
                  <div className="card-img-col" style={{ flex: '0 0 45%', position: 'relative' }}>
                    <img src="assets/img/service/service_chatbot_1.jpg" alt="Tailored Solutions" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px' }} />
                  </div>
                  <div className="card-content-col" style={{ flex: '1', padding: '12px 12px 36px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div className="card-icon-wrap">
                      <img src="assets/img/icon/service_2_1.svg" alt="Icon" className="card-icon-img" />
                    </div>
                    <h3 className="card-title" style={{ fontSize: '18px', fontWeight: '800', color: '#000', marginBottom: '8px', lineHeight: '1.2' }}>Tailored Solutions</h3>
                    <p className="card-desc" style={{ fontSize: '12px', color: '#57534E', lineHeight: '1.6', margin: 0 }}>From converting up to 44% of chats into sales and cutting support costs, to gaining actionable insights.</p>
                  </div>
                  <a href="/case-studies" className="card-arrow-btn" style={{ position: 'absolute', bottom: '16px', right: '16px', width: '36px', height: '36px', backgroundColor: '#F3F4F6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', transition: 'all 0.3s ease' }}>
                    <i className="fa-solid fa-chevron-right" style={{ fontSize: '12px' }}></i>
                  </a>
                </div>
                <div className="cards-marquee-card" style={{ display: 'flex', alignItems: 'stretch', backgroundColor: '#fff', borderRadius: '24px', padding: '12px', height: '220px', boxShadow: '0 8px 30px rgba(0,0,0,0.04)', border: '1px solid #F3F4F6', position: 'relative', overflow: 'hidden' }}>
                  <div className="card-img-col" style={{ flex: '0 0 45%', position: 'relative' }}>
                    <img src="assets/img/service/service_chatbot_2.jpg" alt="Affordable Pricing" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px' }} />
                  </div>
                  <div className="card-content-col" style={{ flex: '1', padding: '12px 12px 36px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div className="card-icon-wrap">
                      <img src="assets/img/icon/service_2_2.svg" alt="Icon" className="card-icon-img" />
                    </div>
                    <h3 className="card-title" style={{ fontSize: '18px', fontWeight: '800', color: '#000', marginBottom: '8px', lineHeight: '1.2' }}>Affordable Pricing</h3>
                    <p className="card-desc" style={{ fontSize: '12px', color: '#57534E', lineHeight: '1.6', margin: 0 }}>From converting up to 44% of chats into sales and cutting support costs, to gaining actionable insights.</p>
                  </div>
                  <a href="/case-studies" className="card-arrow-btn" style={{ position: 'absolute', bottom: '16px', right: '16px', width: '36px', height: '36px', backgroundColor: '#F3F4F6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', transition: 'all 0.3s ease' }}>
                    <i className="fa-solid fa-chevron-right" style={{ fontSize: '12px' }}></i>
                  </a>
                </div>
                <div className="cards-marquee-card" style={{ display: 'flex', alignItems: 'stretch', backgroundColor: '#fff', borderRadius: '24px', padding: '12px', height: '220px', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.05)', position: 'relative', overflow: 'hidden' }}>
                  <div className="card-img-col" style={{ flex: '0 0 45%', position: 'relative' }}>
                    <img src="assets/img/service/service_chatbot_3.jpg" alt="Customer Support" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px' }} />
                  </div>
                  <div className="card-content-col" style={{ flex: '1', padding: '12px 12px 36px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div className="card-icon-wrap">
                      <img src="assets/img/icon/service_2_3.svg" alt="Icon" className="card-icon-img" />
                    </div>
                    <h3 className="card-title" style={{ fontSize: '18px', fontWeight: '800', color: '#000', marginBottom: '8px', lineHeight: '1.2' }}>Customer Support</h3>
                    <p className="card-desc" style={{ fontSize: '12px', color: '#57534E', lineHeight: '1.6', margin: 0 }}>From converting up to 44% of chats into sales and cutting support costs, to gaining actionable insights.</p>
                  </div>
                  <a href="/case-studies" className="card-arrow-btn" style={{ position: 'absolute', bottom: '16px', right: '16px', width: '36px', height: '36px', backgroundColor: '#F3F4F6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', transition: 'all 0.3s ease' }}>
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
                /* CTA Robot and Responsive Styles */
                .cta-area3-custom {
                  background: linear-gradient(135deg, rgb(18, 38, 58) 0%, rgb(22, 101, 52) 100%);
                  border-radius: 32px;
                  position: relative;
                  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                  margin-top: 100px;
                  margin-bottom: 80px;
                  overflow: visible;
                }
                .cta-row-custom {
                  min-height: 420px;
                  position: relative;
                  z-index: 3;
                }
                .cta-robot-col {
                  position: absolute;
                  left: 0;
                  bottom: 0;
                  width: 45%;
                  z-index: 5;
                  display: flex;
                  align-items: flex-end;
                  justify-content: flex-start;
                }
                .robot-img-popout {
                  position: relative;
                  z-index: 5;
                  max-width: 650px;
                  width: 650px;
                  left: -50px;
                  bottom: -37px;
                  display: block;
                }
                .cta-content-col {
                  padding: 80px 40px 80px 0;
                  z-index: 10;
                }
                .cta-title-text {
                  font-weight: 800;
                  font-size: 48px;
                  line-height: 1.2;
                }
                .cta-desc-text {
                  font-size: 18px;
                  opacity: 0.85;
                  line-height: 1.6;
                  max-width: 90%;
                }
                .cta-btn-wrapper {
                  display: flex;
                  justify-content: flex-start;
                  margin-top: 8px;
                }

                @media (max-width: 991px) {
                  .cta-area3-custom {
                    margin-top: 50px !important;
                    margin-bottom: 50px !important;
                    padding: 44px 20px 0 20px !important;
                    border-radius: 24px !important;
                    overflow: hidden !important;
                    text-align: center !important;
                  }
                  .cta-row-custom {
                    min-height: auto !important;
                    display: flex !important;
                    flex-direction: column !important;
                    align-items: center !important;
                  }
                  .cta-content-col {
                    padding: 0 !important;
                    width: 100% !important;
                    text-align: center !important;
                  }
                  .cta-title-text {
                    font-size: clamp(26px, 6vw, 36px) !important;
                  }
                  .cta-desc-text {
                    font-size: 15px !important;
                    max-width: 100% !important;
                    margin: 0 auto 20px auto !important;
                  }
                  .cta-btn-wrapper {
                    justify-content: center !important;
                    width: 100% !important;
                  }
                  .cta-robot-col {
                    position: relative !important;
                    left: auto !important;
                    bottom: 0 !important;
                    width: 100% !important;
                    display: flex !important;
                    justify-content: center !important;
                    align-items: flex-end !important;
                    margin-top: 25px !important;
                    z-index: 5;
                  }
                  .robot-img-popout {
                    position: relative !important;
                    left: 0 !important;
                    bottom: -15px !important;
                    max-width: 250px !important;
                    width: 70% !important;
                    margin: 0 auto !important;
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
                  box-shadow: none !important;
                  transition: all 0.3s ease;
                  text-decoration: none;
                }
                .cta-premium-btn:hover {
                  transform: scale(1.02) translateY(-2px);
                  box-shadow: none !important;
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
            <div className="cta-area3 cta-area3-custom">

              {/* Animated Background Elements */}
              <div className="animated-bg-shape shape-1"></div>
              <div className="animated-bg-shape shape-2"></div>
              <div className="animated-bg-shape shape-3"></div>

              <div className="row justify-content-end align-items-center cta-row-custom">

                {/* Text Content: First in mobile flow, right column on desktop */}
                <div className="col-lg-7 col-xl-7 cta-content-col">
                  <div className="title-area mb-4">
                    <span className="badge mb-3 px-3 py-2 rounded-pill" style={{ fontSize: '13px', letterSpacing: '1px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>
                      <i className="fa-solid fa-bolt text-warning me-2"></i> POWERED BY ADVANCED AI
                    </span>
                    <h2 className="sec-title text-white mb-3 cta-title-text">
                      Generate <span style={{ color: '#22C55E' }}>AI Chatbots</span><br />in a Few Clicks
                    </h2>
                    <p className="box-text text-white cta-desc-text">
                      Instantly transform your customer engagement. Get started for free in minutes—no credit card required, no coding needed.
                    </p>
                  </div>
                  <div className="cta-btn-wrapper">
                    <a href="/contact" className="cta-premium-btn">
                      Start Free Trial
                      <span className="btn-icon">
                        <i className="fa-solid fa-arrow-right"></i>
                      </span>
                    </a>
                  </div>
                </div>

                {/* Robot Image: Absolute on desktop left, bottom centered on mobile */}
                <div className="col-lg-5 cta-robot-col">
                  <img src="assets/img/normal/cta_robot_new.png" alt="AI Robot" className="robot-img-popout" />
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
                          <div className="box-quote"><img src="assets/img/icon/quote2.svg" alt="" /></div>
                        </div>
                        <span className="rating"><i className="fa-sharp fa-solid fa-star-sharp" /><i className="fa-sharp fa-solid fa-star-sharp" /><i className="fa-sharp fa-solid fa-star-sharp" /><i className="fa-sharp fa-solid fa-star-sharp" /><i className="fa-sharp fa-solid fa-star-sharp" /></span>
                      </div>
                      <p className="box-text">"Talkinexx completely transformed our support flow. We were drowning in tickets, but now the AI handles 80% of routine inquiries instantly. Response time went from hours to seconds!"</p>
                      <div className="box-info">
                        <h3 className="box-title">Sarah Jenkins</h3>
                        <span className="box-desig">Customer Success Manager</span>
                      </div>
                      <div className="shape"><img src="assets/img/shape/testi-element.png" alt="" /></div>
                    </div>
                  </div>
                  <div className="swiper-slide">
                    <div className="testi-box" data-bg-src="assets/img/testimonial/testi-shape.png">
                      <div className="box-wrapp">
                        <div className="box-profile">
                          <div className="box-author">
                            <img src="assets/img/testimonial/mark_robinson.jpg" alt="Mark Robinson" />
                          </div>
                          <div className="box-quote"><img src="assets/img/icon/quote2.svg" alt="" /></div>
                        </div>
                        <span className="rating"><i className="fa-sharp fa-solid fa-star-sharp" /><i className="fa-sharp fa-solid fa-star-sharp" /><i className="fa-sharp fa-solid fa-star-sharp" /><i className="fa-sharp fa-solid fa-star-sharp" /><i className="fa-sharp fa-solid fa-star-sharp" /></span>
                      </div>
                      <p className="box-text">"Setting up the chatbot was incredibly intuitive. It seamlessly integrated with our store and started capturing leads on day one. It's like having a top-tier sales rep working 24/7."</p>
                      <div className="box-info">
                        <h3 className="box-title">Marcus Chen</h3>
                        <span className="box-desig">E-Commerce Director</span>
                      </div>
                      <div className="shape"><img src="assets/img/shape/testi-element.png" alt="" /></div>
                    </div>
                  </div>
                  <div className="swiper-slide">
                    <div className="testi-box" data-bg-src="assets/img/testimonial/testi-shape.png">
                      <div className="box-wrapp">
                        <div className="box-profile">
                          <div className="box-author">
                            <img src="assets/img/testimonial/elena_rodriguez.jpg" alt="Elena Rodriguez" />
                          </div>
                          <div className="box-quote"><img src="assets/img/icon/quote2.svg" alt="" /></div>
                        </div>
                        <span className="rating"><i className="fa-sharp fa-solid fa-star-sharp" /><i className="fa-sharp fa-solid fa-star-sharp" /><i className="fa-sharp fa-solid fa-star-sharp" /><i className="fa-sharp fa-solid fa-star-sharp" /><i className="fa-sharp fa-solid fa-star-sharp" /></span>
                      </div>
                      <p className="box-text">"The natural language processing is uncanny. Our customers actually think they're talking to a human! It's saved us thousands in support costs while boosting satisfaction."</p>
                      <div className="box-info">
                        <h3 className="box-title">Elena Rodriguez</h3>
                        <span className="box-desig">Founder & CEO</span>
                      </div>
                      <div className="shape"><img src="assets/img/shape/testi-element.png" alt="" /></div>
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

            /* Responsive Pricing Switcher Styles */
            .pricing-tabs-container {
              display: inline-flex;
              align-items: center;
              justify-content: center;
              flex-wrap: nowrap;
            }
            .pricing-tabs .switch-area {
              display: inline-flex;
              align-items: center;
              background: #EDF5F3;
              border-radius: 50px;
              padding: 4px;
              position: relative;
              gap: 4px;
            }
            .pricing-tabs .toggler {
              white-space: nowrap !important;
              cursor: pointer;
              border-radius: 50px !important;
              font-weight: 700 !important;
              font-size: 14px !important;
              line-height: 1 !important;
              padding: 12px 24px !important;
              margin-bottom: 0 !important;
              transition: all 0.25s ease !important;
              background: transparent !important;
              color: #12263A !important;
              border: none !important;
              box-shadow: none !important;
              user-select: none;
            }
            .pricing-tabs .toggler:hover {
              color: #22C55E !important;
            }
            .pricing-tabs .toggler.toggler--is-active {
              background: #22C55E !important;
              color: #ffffff !important;
              box-shadow: none !important;
            }
            .pricing-save-badge {
              background-color: #E8F0FE;
              color: #456FF8;
              border-radius: 6px;
              padding: 7px 12px;
              font-size: 11px;
              font-weight: 700;
              letter-spacing: 0.5px;
              white-space: nowrap !important;
              display: inline-flex;
              align-items: center;
            }

            @media (max-width: 575px) {
              .pricing-tabs .switch-area {
                padding: 3px;
                gap: 2px;
              }
              .pricing-tabs .toggler {
                font-size: 12px !important;
                padding: 8px 14px !important;
              }
              .pricing-save-badge {
                padding: 6px 8px !important;
                font-size: 10px !important;
              }
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
                <div className="pricing-tabs-container d-flex align-items-center justify-content-center">
                  <div className="pricing-tabs">
                    <div className="switch-area">
                      <button
                        type="button"
                        className={`toggler ${billingCycle === 'monthly' ? 'toggler--is-active' : ''} ms-0 fw-bold`}
                        id="filt-monthly"
                        onClick={() => setBillingCycle('monthly')}
                      >
                        MONTHLY<span className="d-none d-sm-inline"> BILLING</span>
                      </button>
                      <button
                        type="button"
                        className={`toggler ${billingCycle === 'yearly' ? 'toggler--is-active' : ''} fw-bold`}
                        id="filt-yearly"
                        onClick={() => setBillingCycle('yearly')}
                      >
                        YEARLY<span className="d-none d-sm-inline"> BILLING</span>
                      </button>
                    </div>
                  </div>
                  <span className="pricing-save-badge ms-2 ms-sm-3">SAVE 20%</span>
                </div>
              </div>
            </div>
            <div id="monthly" className={`wrapper-full ${billingCycle === 'yearly' ? 'hide' : ''}`}>
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
            <div id="yearly" className={`wrapper-full ${billingCycle === 'monthly' ? 'hide' : ''}`}>
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
        </section>
      </div>
    </Layout>
  );
};

export default HomeAiChatbot;


