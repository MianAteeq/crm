
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';

const Pricing = () => {
    const [billingCycle, setBillingCycle] = useState('monthly');
    
    return (
        <Layout>
  {/*[if lte IE 9]>
    	<p class="browserupgrade">You are using an <strong>outdated</strong> browser. Please <a href="https://browsehappy.com/">upgrade your browser</a> to improve your experience and security.</p>
  <![endif]*/}
  {/*********************************
   		Code Start From Here 
	******************************** */}
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
  `}</style>

  {/* Hero Section */}
  <section className="hero-section text-center position-relative pt-150 pb-100" style={{ background: '#FAFAF9', overflow: 'hidden', padding: '180px 0 120px 0' }}>
    <div className="container position-relative" style={{ zIndex: 3 }}>
      <span className="badge mb-4" style={{ backgroundColor: 'rgba(34,197,94,0.1)', color: '#166534', padding: '8px 16px', borderRadius: '30px', letterSpacing: '2px', fontSize: '12px', border: '1px solid rgba(34,197,94,0.2)', textTransform: 'uppercase', display: 'inline-block', animation: 'floatBob 4s ease-in-out infinite' }}>PRICING & PLANS</span>
      <h1 className="mb-4" style={{ color: '#12263A', fontSize: 'clamp(2.1rem, 5.5vw, 4rem)', fontWeight: '800', letterSpacing: '-1px' }}>Flexible WhatsApp Cloud API Pricing</h1>
      <p className="mx-auto" style={{ color: '#57534E', maxWidth: '650px', fontSize: '1.25rem', lineHeight: '1.6' }}>
        No hidden fees, no complex setup. Connect your WhatsApp Business number &amp; start sending automated campaigns instantly.
      </p>
    </div>
    
    {/* Floating Decorative Elements */}
    <div className="position-absolute hero-floating-badge d-none d-lg-block" style={{ top: '20%', left: '10%', zIndex: 2, animation: 'floatBob 5s ease-in-out infinite', opacity: 0.7 }}>
      <div style={{ width: '60px', height: '60px', background: '#fff', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 30px rgba(34,197,94,0.2)' }}>
        <i className="fab fa-whatsapp" style={{ fontSize: '30px', color: '#22C55E' }}></i>
      </div>
    </div>
    <div className="position-absolute hero-floating-badge d-none d-lg-block" style={{ top: '30%', right: '12%', zIndex: 2, animation: 'floatBob 7s ease-in-out infinite reverse', opacity: 0.7 }}>
      <div style={{ width: '50px', height: '50px', background: '#12263A', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 30px rgba(18,38,58,0.2)' }}>
        <i className="fal fa-chart-line" style={{ fontSize: '20px', color: '#22C55E' }}></i>
      </div>
    </div>
    <div className="position-absolute hero-floating-badge d-none d-lg-block" style={{ bottom: '15%', left: '20%', zIndex: 2, animation: 'spinSlow 15s linear infinite', opacity: 0.1 }}>
      <svg width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" stroke="#22C55E" strokeWidth="2" fill="none" strokeDasharray="10 5" /></svg>
    </div>

    {/* Theme Colored Background Blobs */}
    <div className="position-absolute" style={{ top: '-10%', left: '-5%', width: '600px', height: '600px', background: '#22C55E', filter: 'blur(160px)', zIndex: 1, opacity: 0.35, borderRadius: '50%' }}></div>
    <div className="position-absolute" style={{ bottom: '-15%', right: '-10%', width: '700px', height: '700px', background: '#166534', filter: 'blur(180px)', zIndex: 1, opacity: 0.25, borderRadius: '50%' }}></div>
    <div className="position-absolute" style={{ top: '25%', right: '20%', width: '450px', height: '450px', background: '#F0FDF4', filter: 'blur(120px)', zIndex: 1, opacity: 0.8, borderRadius: '50%' }}></div>
    <div className="position-absolute" style={{ bottom: '15%', left: '30%', width: '500px', height: '500px', background: '#22C55E', filter: 'blur(150px)', zIndex: 1, opacity: 0.2, borderRadius: '50%' }}></div>
    <div className="position-absolute" style={{ top: '40%', left: '15%', width: '400px', height: '400px', background: '#166534', filter: 'blur(140px)', zIndex: 1, opacity: 0.15, borderRadius: '50%' }}></div>
  </section>{/*==============================
Price Area  
==============================*/}
  <section className="position-relative space overflow-hidden">
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
      @media (max-width: 575px) {
        .price-card {
          padding: 28px 18px !important;
        }
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
  <div className="shape-mockup d-none d-xxl-block movingX" data-top="20%" data-right="10%"><img src="assets/img/shape/element-4.png" alt="" /></div>
  </section>
  {/*==============================
Cta Area  
==============================*/}
  <div className="overflow-hidden" style={{ padding: '80px 0' }}>
    <div className="container">
      <div className="cta-area2 space rounded-4 position-relative overflow-hidden" style={{ backgroundColor: '#12263A', boxShadow: '0 20px 40px rgba(18, 38, 58, 0.15)', backgroundImage: "linear-gradient(rgba(18, 38, 58, 0.90), rgba(22, 101, 52, 0.85)), url('assets/img/bg/cta_premium_bg.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
        
        {/* Decorative Blobs */}
        <div style={{ position: 'absolute', top: '-50%', left: '-10%', width: '400px', height: '400px', background: '#22C55E', filter: 'blur(120px)', opacity: '0.3', borderRadius: '50%', pointerEvents: 'none' }}></div>
        <div style={{ position: 'absolute', bottom: '-50%', right: '-10%', width: '400px', height: '400px', background: '#22C55E', filter: 'blur(120px)', opacity: '0.2', borderRadius: '50%', pointerEvents: 'none' }}></div>

        <div className="row justify-content-center align-items-center position-relative z-1">
          <div className="col-lg-10">
            <div className="title-area text-center mb-5">
              <h2 className="sec-title text-white" style={{ fontWeight: '800', fontSize: '3rem', letterSpacing: '-1px' }}>Ready to Transform Your Business?</h2>
              <p className="box-text text-white-50 mt-3 mx-auto" style={{ fontSize: '1.2rem', maxWidth: '600px' }}>Join thousands of companies already using our AI platform to drive innovation and growth.</p>
            </div>
            <div className="btn-group justify-content-center gap-3 mb-4 d-flex flex-wrap">
              <a href="/contact" className="d-inline-flex align-items-center justify-content-center text-decoration-none" style={{ background: '#22C55E', color: '#fff', border: 'none', borderRadius: '50px', padding: '16px 40px', fontWeight: '800', boxShadow: 'none', transition: 'all 0.3s ease' }} onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; }} onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}>Start Free Trial <i className="fas fa-arrow-right ms-2" /></a>
              <a href="/contact" className="d-inline-flex align-items-center justify-content-center text-decoration-none" style={{ background: 'transparent', color: '#fff', border: '2px solid rgba(255,255,255,0.3)', borderRadius: '50px', padding: '14px 40px', fontWeight: '800', transition: 'all 0.3s ease' }} onMouseOver={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#12263A'; }} onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#fff'; }}>Schedule Demo <i className="fas fa-arrow-right ms-2" /></a>
            </div>
            <ul className="cta-list d-flex justify-content-center flex-wrap gap-4 list-unstyled mb-0 text-white" style={{ fontSize: '0.95rem' }}>
              <li className="d-flex align-items-center gap-2"><i className="fas fa-check-circle" style={{ color: '#22C55E' }} /> No credit card required</li>
              <li className="d-flex align-items-center gap-2"><i className="fas fa-check-circle" style={{ color: '#22C55E' }} /> 14-day free trial</li>
              <li className="d-flex align-items-center gap-2"><i className="fas fa-check-circle" style={{ color: '#22C55E' }} /> Cancel anytime</li>
              <li className="d-flex align-items-center gap-2"><i className="fas fa-check-circle" style={{ color: '#22C55E' }} /> 24/7 support</li>
            </ul>
          </div>
        </div>
        <div className="shape-mockup moving d-none d-xxl-block" data-top="15%" data-left="5%">
          <div style={{ width: '80px', height: '80px', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 15px 30px rgba(0,0,0,0.2)' }}>
            <i className="fal fa-robot" style={{ fontSize: '35px', color: '#22C55E' }}></i>
          </div>
        </div>
        <div className="shape-mockup movingX d-none d-xl-block" data-bottom="10%" data-right="5%">
          <div style={{ width: '70px', height: '70px', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 15px 30px rgba(0,0,0,0.2)' }}>
            <i className="fab fa-whatsapp" style={{ fontSize: '32px', color: '#22C55E' }}></i>
          </div>
        </div>
      </div>
    </div>
  </div>
{/*==============================
Contact Area  
==============================*/}
  <section className="contact-sec space overflow-hidden" data-bg-src="assets/img/bg/contact_bg_1.jpg" id="contact-sec">
    <div className="container th-container4">
      <div className="contact-area">
        <div className="row gy-40 gx-100 align-items-end">
          <div className="col-xl-8">
            <form action="mail.php" method="POST" className="contact-form ajax-contact">
              <h3 className="title">Ready to Discuss your Project with us?</h3>
              <div className="row">
                <div className="form-group col-md-6">
                  <input type="text" className="form-control" name="name" id="name" placeholder="Full Name" />
                </div>
                <div className="form-group col-md-6">
                  <input type="email" className="form-control" name="email" id="email" placeholder="Email" />
                </div>
                <div className="form-group col-md-6">
                  <input type="tel" className="form-control" name="number" id="number" placeholder="Phone Number" />
                </div>
                <div className="form-group col-md-6">
                  <select name="subject" id="subject" className="form-select nice-select">
                    <option value disabled selected hidden>Select Service</option>
                    <option value="WhatsApp API">WhatsApp API</option>
                    <option value="AI Chatbots">AI Chatbots</option>
                    <option value="CRM Integration">CRM Integration</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group col-12">
                  <textarea name="message" id="message" cols={30} rows={3} className="form-control" placeholder="Your Message" defaultValue={""} />
                </div>
                <div className="form-btn col-12">
                  <p className="box-text">By sending this form I confirm that I have read and accept the&nbsp;Privacy Policy</p>
                  <button className="d-inline-flex align-items-center justify-content-center text-decoration-none" style={{ background: '#22C55E', color: '#fff', border: 'none', borderRadius: '50px', padding: '16px 40px', fontWeight: '800', transition: 'all 0.3s ease', boxShadow: 'none' }} onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; }} onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}>Send Message <i className="fas fa-arrow-right ms-2" /></button>
                </div>
              </div>
              <p className="form-messages mb-0 mt-3" />
            </form>
          </div>
          <div className="col-xl-4">
            <div className="contact-review">
              <div className="box-profile">
                <div className="box-author">
                  <img src="assets/img/testimonial/mark_robinson.jpg" alt="Avater" style={{ width: '82px', height: '82px', objectFit: 'cover', borderRadius: '50%' }} />
                </div>
                <div className="box-quote"><i className="fas fa-quote-right" style={{ color: '#22C55E', fontSize: '45px' }}></i></div>
              </div>
              <p className="box-text">"Talkinexx completely transformed our customer support. The AI auto-replies save us hours every day!"</p>
              <div className="box-info">
                <h3 className="box-title">Mark Robinson</h3>
                <span className="box-desig">Founder, TechScale</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
{/*==============================
	Footer Area
==============================*/}
  
  {/*********************************
			Code End  Here 
	******************************** */}
  
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
</Layout>
    );
};

export default Pricing;
    