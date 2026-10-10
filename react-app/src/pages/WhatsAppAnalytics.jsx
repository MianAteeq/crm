import React, { useEffect } from 'react';
import Layout from '../components/Layout';

const WhatsAppAnalytics = () => {

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

        {/*[if lte IE 9]>
    	<p class="browserupgrade">You are using an <strong>outdated</strong> browser. Please <a href="https://browsehappy.com/">upgrade your browser</a> to improve your experience and security.</p>
  <![endif]*/}
        {/*********************************
   		Code Start From Here 
	******************************** */}
        {/*==============================
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
      <span className="badge mb-4" style={{ backgroundColor: 'rgba(34,197,94,0.1)', color: '#166534', padding: '8px 16px', borderRadius: '30px', letterSpacing: '2px', fontSize: '12px', border: '1px solid rgba(34,197,94,0.2)', textTransform: 'uppercase', display: 'inline-block', animation: 'floatBob 4s ease-in-out infinite' }}>FEATURES / ANALYTICS</span>
      <h1 className="mb-4" style={{ color: '#12263A', fontSize: '4rem', fontWeight: '800', letterSpacing: '-1px' }}>WhatsApp Analytics</h1>
      <p className="mx-auto" style={{ color: '#57534E', maxWidth: '650px', fontSize: '1.25rem', lineHeight: '1.6' }}>
        Track message delivery, open rates, and ROI.
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
  <section className="content-section position-relative overflow-hidden" style={{ backgroundColor: '#FAFAF9', padding: '120px 0' }}>
    {/* Abstract Brush Paints (Theme colored blobs) */}
    <div className="position-absolute" style={{ top: '10%', left: '-10%', width: '500px', height: '500px', background: '#22C55E', filter: 'blur(150px)', opacity: 0.15, borderRadius: '50%', pointerEvents: 'none' }}></div>
    <div className="position-absolute" style={{ bottom: '-10%', right: '-5%', width: '600px', height: '600px', background: '#166534', filter: 'blur(200px)', opacity: 0.1, borderRadius: '50%', pointerEvents: 'none' }}></div>
    <div className="position-absolute" style={{ top: '40%', left: '40%', width: '400px', height: '400px', background: '#F0FDF4', filter: 'blur(100px)', opacity: 0.6, borderRadius: '50%', pointerEvents: 'none' }}></div>

    <div className="container position-relative z-1">
      <div className="row align-items-center gy-5">
        
        {/* Left Column: Text & Features */}
        <div className="col-lg-5 pe-lg-5">
          <div style={{ display: 'inline-block', padding: '6px 16px', background: '#F0FDF4', color: '#166534', borderRadius: '30px', fontWeight: '800', fontSize: '11px', letterSpacing: '1px', marginBottom: '20px', border: '1px solid rgba(34,197,94,0.2)' }}>GROWTH TOOLS</div>
          <h2 className="mb-4" style={{ color: '#12263A', fontWeight: '800', fontSize: '2.75rem', lineHeight: '1.2' }}>Why High-Growth Teams Use This Tool</h2>
          <p className="mb-5" style={{ color: '#57534E', fontSize: '1.1rem', lineHeight: '1.7' }}>
            Gain deep insights into your messaging performance. Understand how your audience interacts with your campaigns through comprehensive analytics. Monitor delivery statuses, read receipts, and click-through rates to optimize your communication strategy.
          </p>

          <div className="d-flex flex-column gap-4">
            {/* Feature 1 */}
            <div className="d-flex align-items-start gap-3">
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fff', color: '#22C55E', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 10px 20px rgba(34,197,94,0.1)' }}>
                <i className="fal fa-eye fs-5"></i>
              </div>
              <div>
                <h4 style={{ color: '#12263A', fontSize: '1.15rem', fontWeight: '800', marginBottom: '6px' }}>Real-Time Delivery Tracking</h4>
                <p className="mb-0" style={{ color: '#57534E', fontSize: '0.95rem', lineHeight: '1.6' }}>Monitor exactly how many messages are sent, delivered, and read instantly.</p>
              </div>
            </div>
            
            {/* Feature 2 */}
            <div className="d-flex align-items-start gap-3">
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fff', color: '#22C55E', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 10px 20px rgba(34,197,94,0.1)' }}>
                <i className="fal fa-chart-pie fs-5"></i>
              </div>
              <div>
                <h4 style={{ color: '#12263A', fontSize: '1.15rem', fontWeight: '800', marginBottom: '6px' }}>Engagement Metrics</h4>
                <p className="mb-0" style={{ color: '#57534E', fontSize: '0.95rem', lineHeight: '1.6' }}>Analyze click-through rates on interactive buttons and links to gauge audience interest.</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="d-flex align-items-start gap-3">
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fff', color: '#22C55E', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 10px 20px rgba(34,197,94,0.1)' }}>
                <i className="fal fa-chart-line fs-5"></i>
              </div>
              <div>
                <h4 style={{ color: '#12263A', fontSize: '1.15rem', fontWeight: '800', marginBottom: '6px' }}>Comprehensive ROI Reporting</h4>
                <p className="mb-0" style={{ color: '#57534E', fontSize: '0.95rem', lineHeight: '1.6' }}>Connect your campaign costs to generated leads and conversions to measure true ROI.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Analytics Dashboard Visualization */}
        <div className="col-lg-7">
          <div className="p-4 p-md-5 rounded-4 position-relative mt-5 mt-lg-0" style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 30px 60px -15px rgba(0,0,0,0.05)' }}>
            
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4 pb-3" style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
              <div className="d-flex align-items-center gap-3">
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#22C55E', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 5px 15px rgba(34,197,94,0.2)' }}>
                  <i className="fas fa-chart-line fs-6"></i>
                </div>
                <div>
                  <h5 className="mb-1" style={{ color: '#12263A', fontSize: '1rem', fontWeight: '800', letterSpacing: '0.5px' }}>ANALYTICS DASHBOARD</h5>
                </div>
              </div>
              <div className="d-flex align-items-center gap-2" style={{ background: '#fff', padding: '6px 14px', borderRadius: '30px', border: '1px solid rgba(34,197,94,0.3)' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22C55E', animation: 'pulseGlow 2s infinite' }}></div>
                <span className="d-none d-sm-inline" style={{ color: '#166534', fontSize: '0.75rem', fontWeight: '800', letterSpacing: '0.5px' }}>LIVE</span>
              </div>
            </div>

            {/* Top Stats Cards */}
            <div className="row g-3 mb-4">
              <div className="col-6">
                <div className="p-4 rounded-3 text-center" style={{ background: '#FAFAF9', border: '1px solid #E2E8F0' }}>
                   <div style={{ color: '#57534E', fontSize: '0.85rem', fontWeight: '700', marginBottom: '8px' }}>Total Messages Sent</div>
                   <div style={{ color: '#12263A', fontSize: '1.75rem', fontWeight: '800', marginBottom: '4px', letterSpacing: '-0.5px' }}>45,280</div>
                   <div style={{ color: '#16A34A', fontSize: '0.75rem', fontWeight: '600' }}><i className="fas fa-arrow-up"></i> 12% vs last month</div>
                </div>
              </div>
              <div className="col-6">
                <div className="p-4 rounded-3 text-center" style={{ background: '#FAFAF9', border: '1px solid #E2E8F0' }}>
                   <div style={{ color: '#57534E', fontSize: '0.85rem', fontWeight: '700', marginBottom: '8px' }}>Average Open Rate</div>
                   <div style={{ color: '#12263A', fontSize: '1.75rem', fontWeight: '800', marginBottom: '4px', letterSpacing: '-0.5px' }}>98.5%</div>
                   <div style={{ color: '#16A34A', fontSize: '0.75rem', fontWeight: '600' }}><i className="fas fa-arrow-up"></i> 2.1% vs last month</div>
                </div>
              </div>
            </div>

            {/* Delivery Funnel */}
            <div className="p-4 rounded-3" style={{ background: '#FAFAF9', border: '1px solid #E2E8F0' }}>
               <div style={{ color: '#12263A', fontSize: '0.85rem', fontWeight: '800', marginBottom: '16px' }}>DELIVERY FUNNEL</div>
               
               {/* Progress 1 */}
               <div className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                     <span style={{ color: '#57534E', fontSize: '0.8rem', fontWeight: '600' }}>Sent</span>
                     <span style={{ color: '#12263A', fontSize: '0.8rem', fontWeight: '700' }}>100%</span>
                  </div>
                  <div className="progress" style={{ height: '6px', background: '#E2E8F0' }}>
                     <div className="progress-bar" role="progressbar" style={{ width: '100%', background: '#9CA3AF', borderRadius: '10px' }}></div>
                  </div>
               </div>

               {/* Progress 2 */}
               <div className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                     <span style={{ color: '#57534E', fontSize: '0.8rem', fontWeight: '600' }}>Delivered</span>
                     <span style={{ color: '#12263A', fontSize: '0.8rem', fontWeight: '700' }}>99.2%</span>
                  </div>
                  <div className="progress" style={{ height: '6px', background: '#E2E8F0' }}>
                     <div className="progress-bar" role="progressbar" style={{ width: '99.2%', background: '#6366F1', borderRadius: '10px' }}></div>
                  </div>
               </div>

               {/* Progress 3 */}
               <div>
                  <div className="d-flex justify-content-between mb-1">
                     <span style={{ color: '#57534E', fontSize: '0.8rem', fontWeight: '600' }}>Read</span>
                     <span style={{ color: '#12263A', fontSize: '0.8rem', fontWeight: '700' }}>98.5%</span>
                  </div>
                  <div className="progress" style={{ height: '6px', background: '#E2E8F0' }}>
                     <div className="progress-bar" role="progressbar" style={{ width: '98.5%', background: '#0EA5E9', borderRadius: '10px' }}></div>
                  </div>
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

export default WhatsAppAnalytics;
