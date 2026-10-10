import React, { useEffect } from 'react';
import Layout from '../components/Layout';

const AutomatedMessaging = () => {

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

{/*======== Automated Messaging Page Content ========*/}
<div className="automated-messaging-page">
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
      <span className="badge mb-4" style={{ backgroundColor: 'rgba(34,197,94,0.1)', color: '#166534', padding: '8px 16px', borderRadius: '30px', letterSpacing: '2px', fontSize: '12px', border: '1px solid rgba(34,197,94,0.2)', textTransform: 'uppercase', display: 'inline-block', animation: 'floatBob 4s ease-in-out infinite' }}>FEATURES / AUTOMATED MESSAGING</span>
      <h1 className="mb-4" style={{ color: '#12263A', fontSize: '4rem', fontWeight: '800', letterSpacing: '-1px' }}>Automated Messaging</h1>
      <p className="mx-auto" style={{ color: '#57534E', maxWidth: '650px', fontSize: '1.25rem', lineHeight: '1.6' }}>
        Set up recurring birthday greetings, auto-visit reminders, and custom follow-up triggers.
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
          <div style={{ display: 'inline-block', padding: '6px 16px', background: '#F0FDF4', color: '#166534', borderRadius: '30px', fontWeight: '800', fontSize: '11px', letterSpacing: '1px', marginBottom: '20px', border: '1px solid rgba(34,197,94,0.2)' }}>AUTOMATION TOOLS</div>
          <h2 className="mb-4" style={{ color: '#12263A', fontWeight: '800', fontSize: '2.75rem', lineHeight: '1.2' }}>Why High-Growth Teams Use This Tool</h2>
          <p className="mb-5" style={{ color: '#57534E', fontSize: '1.1rem', lineHeight: '1.7' }}>
            Deliver the perfect message at the perfect time without lifting a finger. Automatically send personalized birthday wishes with unique discounts, or trigger reminders (like filler touch-ups or subscription renewals) exactly when your client is ready to purchase again.
          </p>

          <div className="d-flex flex-column gap-4">
            {/* Feature 1 */}
            <div className="d-flex align-items-start gap-3">
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fff', color: '#22C55E', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 10px 20px rgba(34,197,94,0.1)' }}>
                <i className="fal fa-check-circle fs-5"></i>
              </div>
              <div>
                <h4 style={{ color: '#12263A', fontSize: '1.15rem', fontWeight: '800', marginBottom: '6px' }}>Birthday Wish Triggers</h4>
                <p className="mb-0" style={{ color: '#57534E', fontSize: '0.95rem', lineHeight: '1.6' }}>Hook into contact birthdays to auto-deliver personalized greetings and coupon codes.</p>
              </div>
            </div>
            
            {/* Feature 2 */}
            <div className="d-flex align-items-start gap-3">
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fff', color: '#22C55E', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 10px 20px rgba(34,197,94,0.1)' }}>
                <i className="fal fa-shield-check fs-5"></i>
              </div>
              <div>
                <h4 style={{ color: '#12263A', fontSize: '1.15rem', fontWeight: '800', marginBottom: '6px' }}>Service Recall Alerts</h4>
                <p className="mb-0" style={{ color: '#57534E', fontSize: '0.95rem', lineHeight: '1.6' }}>Configure custom offsets (e.g. 6 months post-treatment) to prompt touch-up bookings.</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="d-flex align-items-start gap-3">
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fff', color: '#22C55E', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 10px 20px rgba(34,197,94,0.1)' }}>
                <i className="fal fa-sync fs-5"></i>
              </div>
              <div>
                <h4 style={{ color: '#12263A', fontSize: '1.15rem', fontWeight: '800', marginBottom: '6px' }}>Zero Human Friction</h4>
                <p className="mb-0" style={{ color: '#57534E', fontSize: '0.95rem', lineHeight: '1.6' }}>Allow the automation workflow engine to progress deals from 'Contacted' to 'Retargeted' instantly.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Workflow UI */}
        <div className="col-lg-7">
          <div className="p-4 p-md-5 rounded-4 position-relative mt-5 mt-lg-0" style={{ background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.5)', boxShadow: '0 30px 60px -15px rgba(0,0,0,0.05), 0 0 40px rgba(34,197,94,0.1)' }}>
            
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-5 pb-3" style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
              <div className="d-flex align-items-center gap-3">
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#22C55E', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 5px 15px rgba(34,197,94,0.3)' }}>
                  <i className="fas fa-project-diagram fs-6"></i>
                </div>
                <div>
                  <h5 className="mb-1" style={{ color: '#12263A', fontSize: '1rem', fontWeight: '800', letterSpacing: '0.5px' }}>RECALL FLOW</h5>
                  <span style={{ color: '#57534E', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Touch-Up Reminder</span>
                </div>
              </div>
              <div className="d-flex align-items-center gap-2" style={{ background: '#F0FDF4', padding: '6px 12px', borderRadius: '30px', border: '1px solid rgba(34,197,94,0.2)' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22C55E', animation: 'pulseGlow 2s infinite' }}></div>
                <span className="d-none d-sm-inline" style={{ color: '#166534', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '1px' }}>ACTIVE</span>
              </div>
            </div>

            {/* Workflow Steps */}
            <div className="d-flex flex-column gap-3 position-relative">
              {/* Connecting line */}
              <div className="position-absolute d-none d-md-block" style={{ top: '30px', left: '20px', width: '2px', height: 'calc(100% - 60px)', background: 'linear-gradient(to bottom, #E2E8F0, #22C55E)' }}></div>

              {/* Step 1 */}
              <div className="step-item d-flex align-items-center gap-4 p-4 position-relative z-1" style={{ background: '#fff', borderRadius: '20px', border: '1px solid #E2E8F0', boxShadow: '0 5px 15px rgba(0,0,0,0.02)' }}>
                <div className="step-number" style={{ width: '40px', height: '40px', minWidth: '40px', borderRadius: '12px', background: '#F8FAFC', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', border: '1px solid #E2E8F0' }}>1</div>
                <div>
                  <h4 style={{ color: '#12263A', fontSize: '1.15rem', fontWeight: '800', marginBottom: '4px' }}>Trigger: Service Completed</h4>
                  <p className="mb-0" style={{ color: '#57534E', fontSize: '0.95rem' }}>Customer completes [Filler Injection] treatment</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="step-item d-flex align-items-center gap-4 p-4 position-relative z-1" style={{ background: '#fff', borderRadius: '20px', border: '1px solid #E2E8F0', boxShadow: '0 5px 15px rgba(0,0,0,0.02)' }}>
                <div className="step-number" style={{ width: '40px', height: '40px', minWidth: '40px', borderRadius: '12px', background: '#F8FAFC', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', border: '1px solid #E2E8F0' }}>2</div>
                <div>
                  <h4 style={{ color: '#12263A', fontSize: '1.15rem', fontWeight: '800', marginBottom: '4px' }}>Delay Timer: 180 Days</h4>
                  <p className="mb-0" style={{ color: '#57534E', fontSize: '0.95rem' }}>System waits exactly 6 months post-treatment</p>
                </div>
              </div>

              {/* Step 3 (Highlighted) */}
              <div className="step-item d-flex align-items-center gap-4 p-4 position-relative z-1" style={{ background: '#F0FDF4', borderRadius: '20px', border: '1px solid rgba(34,197,94,0.3)', boxShadow: '0 15px 35px rgba(34,197,94,0.1)' }}>
                <div className="step-number" style={{ width: '40px', height: '40px', minWidth: '40px', borderRadius: '12px', background: '#22C55E', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', boxShadow: '0 5px 15px rgba(34,197,94,0.3)' }}>3</div>
                <div>
                  <h4 style={{ color: '#166534', fontSize: '1.15rem', fontWeight: '800', marginBottom: '4px' }}>Action: Send WhatsApp Recall</h4>
                  <p className="mb-0" style={{ color: '#15803D', fontSize: '0.95rem', fontWeight: '500' }}>"Hey Ahmed, time for your Filler touch-up!"</p>
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

      <h2 className="mb-4" style={{ color: '#12263A', fontSize: '3rem', fontWeight: '800', letterSpacing: '-1px' }}>Ready to automate your workflow?</h2>
      <p className="mx-auto mb-5" style={{ color: '#57534E', maxWidth: '600px', fontSize: '1.15rem' }}>
        Set up your account in minutes and connect your WhatsApp Business API configurations.
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

export default AutomatedMessaging;
