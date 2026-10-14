import React, { useState } from 'react';
import Layout from '../components/Layout';

const Contact = () => {
    // FAQ state management
    const [activeFaq, setActiveFaq] = useState(0);

    const faqs = [
        {
            question: "How do I connect my WhatsApp number to the AI automation platform?",
            answer: "We use Meta's official WhatsApp Business Cloud API. You simply verify your business and link your phone number ID. It's 100% secure, fully compliant, and ensures maximum message delivery rates."
        },
        {
            question: "Can the AI copilot handle customer support and bookings simultaneously?",
            answer: "Yes, the AI is trained to understand context and intent. It can seamlessly transition from answering support queries to guiding users through a complete booking flow, capturing all necessary data along the way."
        },
        {
            question: "Is there a limit to how many WhatsApp broadcast messages I can send?",
            answer: "Your limit depends on your Meta Trust Tier. New numbers start at 250 conversations per 24 hours, but can scale up to 100,000+ as your quality rating improves. Our system manages these limits automatically."
        },
        {
            question: "Can I integrate my existing CRM with your WhatsApp automation?",
            answer: "Absolutely. We offer native integrations for Salesforce, HubSpot, and Zoho, plus robust webhooks and a REST API for connecting any custom backend systems."
        },
        {
            question: "Will my WhatsApp account get banned for using automation?",
            answer: "No, as long as you follow Meta's Commerce Policies. Because we use the official Cloud API, your account is fully compliant. Avoid sending spam and ensure you have user opt-ins."
        }
    ];

    return (
        <Layout>
            <style>{`
                @media (max-width: 575px) {
                    .form-card {
                        padding: 28px 18px !important;
                    }
                    .contact-hero {
                        padding: 100px 0 50px 0 !important;
                    }
                }
            `}</style>
            {/* Top Contact Section */}
            <section className="contact-hero space" style={{ background: '#FAFAF9', padding: '120px 0 80px 0' }}>
                <div className="container">
                    <div className="row justify-content-between align-items-center gy-5">
                        
                        {/* Left Side: Text and Contact Info */}
                        <div className="col-lg-5">
                            <div className="mb-5">
                                <span className="d-inline-block fw-bold" style={{ background: '#F0FDF4', color: '#166534', padding: '6px 16px', borderRadius: '30px', fontSize: '11px', letterSpacing: '1px', border: '1px solid rgba(34,197,94,0.2)', marginBottom: '20px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>We're Available</span>
                                <h1 className="sec-title mb-4" style={{ color: '#12263A', fontWeight: '800', fontSize: 'clamp(2rem, 5vw, 3.5rem)', letterSpacing: '-1.5px', lineHeight: '1.1' }}>
                                    Let's build something <span style={{ color: '#22C55E' }}>great together.</span>
                                </h1>
                                <p style={{ color: '#57534E', fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '40px' }}>
                                    Our support desk is online 24/7. Reach out via email, phone, or live WhatsApp to resolve account setup issues and configure your automations.
                                </p>
                            </div>

                            <div className="contact-info-list d-flex flex-column gap-3">
                                {/* Card 1 */}
                                <div className="d-flex align-items-center p-3" style={{ background: '#fff', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                                    <div className="icon-wrapper d-flex align-items-center justify-content-center me-3" style={{ width: '50px', height: '50px', background: '#F0FDF4', borderRadius: '12px', color: '#22C55E', fontSize: '20px' }}>
                                        <i className="fa-regular fa-envelope"></i>
                                    </div>
                                    <div>
                                        <p className="text-uppercase mb-1" style={{ fontSize: '10px', fontWeight: '700', color: '#64748B', letterSpacing: '1px' }}>Email (24/7 Online)</p>
                                        <h4 className="mb-0" style={{ fontSize: '1.05rem', fontWeight: '700', color: '#12263A' }}>support@talkinexx.com</h4>
                                    </div>
                                </div>
                                {/* Card 2 */}
                                <div className="d-flex align-items-center p-3" style={{ background: '#fff', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                                    <div className="icon-wrapper d-flex align-items-center justify-content-center me-3" style={{ width: '50px', height: '50px', background: '#F0FDF4', borderRadius: '12px', color: '#22C55E', fontSize: '22px' }}>
                                        <i className="fa-brands fa-whatsapp"></i>
                                    </div>
                                    <div>
                                        <p className="text-uppercase mb-1" style={{ fontSize: '10px', fontWeight: '700', color: '#64748B', letterSpacing: '1px' }}>WhatsApp Live Chat</p>
                                        <h4 className="mb-0" style={{ fontSize: '1.05rem', fontWeight: '700', color: '#12263A' }}>+1 (800) 555-0288</h4>
                                    </div>
                                </div>
                                {/* Card 3 */}
                                <div className="d-flex align-items-center p-3" style={{ background: '#fff', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                                    <div className="icon-wrapper d-flex align-items-center justify-content-center me-3" style={{ width: '50px', height: '50px', background: '#F0FDF4', borderRadius: '12px', color: '#22C55E', fontSize: '20px' }}>
                                        <i className="fal fa-shield-check"></i>
                                    </div>
                                    <div>
                                        <p className="text-uppercase mb-1" style={{ fontSize: '10px', fontWeight: '700', color: '#64748B', letterSpacing: '1px' }}>SLA Guarantee</p>
                                        <h4 className="mb-0" style={{ fontSize: '1.05rem', fontWeight: '700', color: '#12263A' }}>99.9% Server Uptime</h4>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Contact Form */}
                        <div className="col-lg-6">
                            <div className="form-card" style={{ background: '#fff', padding: '50px', borderRadius: '24px', boxShadow: '0 20px 40px rgba(18, 38, 58, 0.08)' }}>
                                <h3 className="mb-2" style={{ color: '#12263A', fontWeight: '800', fontSize: '1.8rem' }}>Drop us a line</h3>
                                <p className="mb-4" style={{ color: '#57534E', fontSize: '0.95rem' }}>Fill out the form below and we'll get back to you shortly.</p>
                                
                                <form>
                                    <div className="row gy-3">
                                        <div className="col-md-6">
                                            <label className="text-uppercase" style={{ fontSize: '10px', fontWeight: '700', color: '#64748B', letterSpacing: '1px', marginBottom: '8px' }}>Full Name</label>
                                            <input type="text" className="form-control shadow-none" placeholder="e.g. John Doe" style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '14px 16px', fontSize: '0.95rem' }} />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="text-uppercase" style={{ fontSize: '10px', fontWeight: '700', color: '#64748B', letterSpacing: '1px', marginBottom: '8px' }}>Work Email</label>
                                            <input type="email" className="form-control shadow-none" placeholder="name@company.com" style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '14px 16px', fontSize: '0.95rem' }} />
                                        </div>
                                        <div className="col-12">
                                            <label className="text-uppercase" style={{ fontSize: '10px', fontWeight: '700', color: '#64748B', letterSpacing: '1px', marginBottom: '8px' }}>Company Name (Optional)</label>
                                            <input type="text" className="form-control shadow-none" placeholder="ThinkTech LLC" style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '14px 16px', fontSize: '0.95rem' }} />
                                        </div>
                                        <div className="col-12">
                                            <label className="text-uppercase" style={{ fontSize: '10px', fontWeight: '700', color: '#64748B', letterSpacing: '1px', marginBottom: '8px' }}>Your Message</label>
                                            <textarea className="form-control shadow-none" rows="4" placeholder="Describe your outreach campaign details or request support help..." style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '14px 16px', fontSize: '0.95rem' }}></textarea>
                                        </div>
                                        <div className="col-12 mt-4">
                                            <button type="button" className="w-100 d-inline-flex align-items-center justify-content-center text-decoration-none" style={{ background: '#22C55E', color: '#fff', border: 'none', borderRadius: '12px', padding: '18px 40px', fontWeight: '800', transition: 'all 0.3s ease', boxShadow: 'none', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.9rem' }} onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; }} onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}>
                                                SEND MESSAGE <i className="fas fa-arrow-right ms-2" />
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Bottom FAQ Section */}
            <section className="faq-section space" style={{ background: '#fff', padding: '100px 0' }}>
                <div className="container">
                    <div className="row justify-content-between">
                        
                        {/* Left Side: FAQ Text and Support Card */}
                        <div className="col-lg-4 mb-5 mb-lg-0">
                            <span className="d-inline-block fw-bold" style={{ background: '#F0FDF4', color: '#166534', padding: '6px 16px', borderRadius: '30px', fontSize: '11px', letterSpacing: '1px', border: '1px solid rgba(34,197,94,0.2)', marginBottom: '20px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>SUPPORT CENTER</span>
                            <h2 className="sec-title mb-4" style={{ color: '#12263A', fontWeight: '800', fontSize: '2.5rem', letterSpacing: '-1px', lineHeight: '1.2' }}>
                                Got questions about <br/><span style={{ color: '#22C55E' }}>WhatsApp AI?</span>
                            </h2>
                            <p style={{ color: '#57534E', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '40px' }}>
                                Everything you need to know about setting up your WhatsApp Business API, automation limits, compliance, and CRM integrations.
                            </p>

                            <div className="support-card p-4" style={{ border: '1px solid #E2E8F0', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                                <div className="d-flex align-items-start gap-3">
                                    <div className="icon-wrapper d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '40px', height: '40px', background: '#F0FDF4', borderRadius: '50%', color: '#22C55E', fontSize: '18px' }}>
                                        <i className="fa-regular fa-comment-dots"></i>
                                    </div>
                                    <div>
                                        <h4 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#12263A', marginBottom: '8px' }}>Still have questions?</h4>
                                        <p style={{ fontSize: '0.9rem', color: '#64748B', lineHeight: '1.5', marginBottom: '15px' }}>Our WhatsApp automation experts are ready to help you build the perfect workflow.</p>
                                        <a href="/contact" style={{ color: '#22C55E', fontWeight: '700', fontSize: '0.9rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>Chat with our team <i className="fa-solid fa-arrow-right-long" style={{ fontSize: '12px' }}></i></a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Accordion */}
                        <div className="col-lg-7">
                            <div className="faq-accordion d-flex flex-column gap-3">
                                {faqs.map((faq, index) => {
                                    const isActive = activeFaq === index;
                                    return (
                                        <div key={index} className="faq-item" style={{ border: isActive ? '2px solid #22C55E' : '1px solid #E2E8F0', borderRadius: '12px', background: '#fff', overflow: 'hidden', transition: 'all 0.3s ease', boxShadow: isActive ? '0 10px 20px rgba(34,197,94,0.05)' : 'none' }}>
                                            <button 
                                                className="faq-button w-100 text-start d-flex justify-content-between align-items-center p-4 bg-transparent border-0" 
                                                onClick={() => setActiveFaq(isActive ? null : index)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <span style={{ fontSize: '1.05rem', fontWeight: '700', color: '#12263A', paddingRight: '20px' }}>{faq.question}</span>
                                                <div className="icon d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '28px', height: '28px', borderRadius: '50%', background: isActive ? '#22C55E' : '#F1F5F9', color: isActive ? '#fff' : '#64748B', transition: 'all 0.3s ease' }}>
                                                    <i className={`fa-solid ${isActive ? 'fa-minus' : 'fa-plus'}`} style={{ fontSize: '12px' }}></i>
                                                </div>
                                            </button>
                                            <div className="faq-answer" style={{ maxHeight: isActive ? '500px' : '0', overflow: 'hidden', transition: 'max-height 0.3s ease' }}>
                                                <div className="p-4 pt-0" style={{ color: '#57534E', fontSize: '0.95rem', lineHeight: '1.6' }}>
                                                    {faq.answer}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default Contact;