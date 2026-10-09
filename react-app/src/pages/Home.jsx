
import React, { useEffect } from 'react';

const Home = () => {
    
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
    Sidemenu
============================== */}
  <div className="sidemenu-wrapper ">
    <div className="sidemenu-content">
      <button className="closeButton sideMenuCls"><i className="far fa-times" /></button>
      <div className="widget footer-widget mb-0">
        <div className="th-widget-about">
          <div className="about-logo">
            <a href="/"><img src="assets/img/logo.svg" alt="Aior " /></a>
          </div>
          <p className="about-text">Aior is a Canada-based startup design agency specializing in modern, user-centric digital experiences.
            We help brands grow through strategic design, branding, and creative innovation.</p>
          <div className="th-social mb-40">
            <a href="https://www.facebook.com/"><i className="fab fa-facebook-f" /></a>
            <a href="https://www.twitter.com/"><i className="fab fa-twitter" /></a>
            <a href="https://www.youtube.com/"><i className="fa-brands fa-instagram" /></a>
            <a href="https://www.linkedin.com/"><i className="fab fa-linkedin-in" /></a>
            <a href="https://www.youtube.com/"><i className="fab fa-youtube" /></a>
          </div>
        </div>
      </div>
      <div className="widget footer-widget">
        <h3 className="widget_title">Recent Posts</h3>
        <div className="recent-post-wrap">
          <div className="recent-post">
            <div className="media-img">
              <a href="/blog-details"><img src="assets/img/blog/recent-post-1-1.jpg" alt="Blog Image" /></a>
            </div>
            <div className="media-body">
              <div className="recent-post-meta">
                <a href="/blog"><i className="fa-sharp fa-solid fa-calendar-days" />january 02,
                  2026</a>
              </div>
              <h4 className="post-title"><a className="text-inherit" href="/blog-details">Developing AI systems that scale efficiently as data.</a></h4>
            </div>
          </div>
          <div className="recent-post">
            <div className="media-img">
              <a href="/blog-details"><img src="assets/img/blog/recent-post-1-2.jpg" alt="Blog Image" /></a>
            </div>
            <div className="media-body">
              <div className="recent-post-meta">
                <a href="/blog"><i className="fa-sharp fa-solid fa-calendar-days" />january 25,
                  2026</a>
              </div>
              <h4 className="post-title"><a className="text-inherit" href="/blog-details">Addressing issues related to AI fairness, transparency</a></h4>
            </div>
          </div>
          <div className="recent-post">
            <div className="media-img">
              <a href="/blog-details"><img src="assets/img/blog/recent-post-1-3.jpg" alt="Blog Image" /></a>
            </div>
            <div className="media-body">
              <div className="recent-post-meta">
                <a href="/blog"><i className="fa-sharp fa-solid fa-calendar-days" />26 january,
                  2026</a>
              </div>
              <h4 className="post-title"><a className="text-inherit" href="/blog-details">AI chatbot integration refers to embedding.</a></h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
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
  <header className="th-header header-layout1 style2">
    <div className="container th-container">
      <div className="menu-area">
        <div className="sticky-wrapper">
          {/* Main Menu Area */}
          <div className="container">
            <div className="row align-items-center justify-content-between">
              <div className="col-auto">
                <div className="header-logo">
                  <a href="/home-ai-startup"><img src="assets/img/logo.svg" alt="Aior " /></a>
                </div>
              </div>
              <div className="col-auto">
                <nav className="main-menu style2 d-none d-xl-inline-block">
                  <ul>
                    <li className="menu-item-has-children">
                      <a href="/home-ai-startup">Home</a>
                      <ul className="mega-menu mega-menu-content allow-natural-scroll">
                        <li>
                          <div className="container">
                            <div className="row gy-4">
                              <div className="col-lg-4">
                                <div className="mega-menu-box">
                                  <div className="mega-menu-img">
                                    <img src="assets/img/pages/home-ai-startup.jpg" alt="Home One" />
                                    <div className="btn-wrap">
                                      <a href="/home-ai-startup" className="th-btn">Multipage</a>
                                      <a href="/home-ai-startup-op" className="th-btn">Onepage</a>
                                    </div>
                                  </div>
                                  <h2 className="mega-menu-title"><a href="/home-ai-startup">01. Home Ai Startup</a>
                                  </h2>
                                </div>
                              </div>
                              <div className="col-lg-4">
                                <div className="mega-menu-box">
                                  <div className="mega-menu-img">
                                    <img src="assets/img/pages/home-ai-chatbot.jpg" alt="Home Two" />
                                    <div className="btn-wrap">
                                      <a href="/home-ai-chatbot" className="th-btn">Multipage</a>
                                      <a href="/home-ai-chatbot-op" className="th-btn">Onepage</a>
                                    </div>
                                  </div>
                                  <h2 className="mega-menu-title"><a href="/home-ai-chatbot">02. Home Ai Chatbot</a></h2>
                                </div>
                              </div>
                              <div className="col-lg-4">
                                <div className="mega-menu-box">
                                  <div className="mega-menu-img">
                                    <img src="assets/img/pages/home-ai-image-generate.jpg" alt="Home Three" />
                                    <div className="btn-wrap">
                                      <a href="/home-ai-image-generate" className="th-btn">Multipage</a>
                                      <a href="/home-ai-image-generate-op" className="th-btn">Onepage</a>
                                    </div>
                                  </div>
                                  <h2 className="mega-menu-title"><a href="/home-ai-image-generate">03. Home Ai Image
                                      Generate</a>
                                  </h2>
                                </div>
                              </div>
                              <div className="col-lg-4">
                                <div className="mega-menu-box">
                                  <div className="mega-menu-img">
                                    <img src="assets/img/pages/home-ai-writer-tool.jpg" alt="Home Three" />
                                    <div className="btn-wrap">
                                      <a href="/home-ai-writer-tool" className="th-btn">Multipage</a>
                                      <a href="/home-ai-writer-tool-op" className="th-btn">Onepage</a>
                                    </div>
                                  </div>
                                  <h2 className="mega-menu-title"><a href="/home-ai-writer-tool">04. Home AI Writer
                                      Tool</a>
                                  </h2>
                                </div>
                              </div>
                              <div className="col-lg-4">
                                <div className="mega-menu-box">
                                  <div className="mega-menu-img">
                                    <img src="assets/img/pages/home-business-intelligence.jpg" alt="Home Three" />
                                    <div className="btn-wrap">
                                      <a href="/home-business-intelligence" className="th-btn">Multipage</a>
                                      <a href="/home-business-intelligence-op" className="th-btn">Onepage</a>
                                    </div>
                                  </div>
                                  <h2 className="mega-menu-title"><a href="/home-business-intelligence">05. Home Business
                                      Intelligence</a>
                                  </h2>
                                </div>
                              </div>
                              <div className="col-lg-4">
                                <div className="mega-menu-box">
                                  <div className="mega-menu-img">
                                    <img src="assets/img/pages/home-ai-agent.jpg" alt="Home Three" />
                                    <div className="btn-wrap">
                                      <a href="/home-ai-agent" className="th-btn">Multipage</a>
                                      <a href="/home-ai-agent-op" className="th-btn">Onepage</a>
                                    </div>
                                  </div>
                                  <h2 className="mega-menu-title"><a href="/home-ai-agent">06. Home Ai Agent</a>
                                  </h2>
                                </div>
                              </div>
                              <div className="col-lg-4">
                                <div className="mega-menu-box">
                                  <div className="mega-menu-img">
                                    <img src="assets/img/pages/home-productivity-tools.jpg" alt="Home Three" />
                                    <div className="btn-wrap">
                                      <a href="/home-productivity-tools" className="th-btn">Multipage</a>
                                      <a href="/home-productivity-tools-op" className="th-btn">Onepage</a>
                                    </div>
                                  </div>
                                  <h2 className="mega-menu-title"><a href="/home-productivity-tools">07. Home productivity
                                      tools</a>
                                  </h2>
                                </div>
                              </div>
                              <div className="col-lg-4">
                                <div className="mega-menu-box">
                                  <div className="mega-menu-img">
                                    <img src="assets/img/pages/home-ai-chatbot-tool.jpg" alt="Home Three" />
                                    <div className="btn-wrap">
                                      <a href="/home-ai-chatbot-tool" className="th-btn">Multipage</a>
                                      <a href="/home-ai-chatbot-tool-op" className="th-btn">Onepage</a>
                                    </div>
                                  </div>
                                  <h2 className="mega-menu-title"><a href="/home-ai-chatbot-tool">08. Home AI chatbot
                                      tool</a>
                                  </h2>
                                </div>
                              </div>
                              <div className="col-lg-4">
                                <div className="mega-menu-box">
                                  <div className="mega-menu-img">
                                    <img src="assets/img/pages/home-cloud-based-saas.jpg" alt="Home Three" />
                                    <div className="btn-wrap">
                                      <a href="/home-cloud-based-saas" className="th-btn">Multipage</a>
                                      <a href="/home-cloud-based-saas-op" className="th-btn">Onepage</a>
                                    </div>
                                  </div>
                                  <h2 className="mega-menu-title"><a href="/home-cloud-based-saas">09. Home cloud Based
                                      Saas</a>
                                  </h2>
                                </div>
                              </div>
                              <div className="col-lg-4">
                                <div className="mega-menu-box">
                                  <div className="mega-menu-img">
                                    <img src="assets/img/pages/home-saas-product-showcase.jpg" alt="Home Three" />
                                    <div className="btn-wrap">
                                      <a href="/home-saas-product-showcase" className="th-btn">Multipage</a>
                                      <a href="/home-saas-product-showcase-op" className="th-btn">Onepage</a>
                                    </div>
                                  </div>
                                  <h2 className="mega-menu-title"><a href="/home-saas-product-showcase">10 Home Saas
                                      product Showcase</a>
                                  </h2>
                                </div>
                              </div>
                              <div className="col-lg-4">
                                <div className="mega-menu-box">
                                  <div className="mega-menu-img">
                                    <img src="assets/img/pages/home-finance-crypto-service.jpg" alt="Home Three" />
                                    <div className="btn-wrap">
                                      <a href="/home-finance-crypto-service" className="th-btn">Multipage</a>
                                      <a href="/home-finance-crypto-service-op" className="th-btn">Onepage</a>
                                    </div>
                                  </div>
                                  <h2 className="mega-menu-title"><a href="/home-finance-crypto-service">11 Home finance crypto service</a>
                                  </h2>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
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
                </nav>
              </div>
              <div className="col-auto">
                <div className="header-button">
                  <a href="/contact" className="th-btn">Contact Us <span className="icon"><img src="assets/img/icon/arrow-right.svg" alt /></span></a>
                  <a href="#" className="icon-btn sideMenuToggler d-none d-md-block"><img src="assets/img/icon/grid.svg" alt /></a>
                  <button type="button" className="th-menu-toggle d-inline-block d-xl-none"><i className="far fa-bars" /></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>{/*==============================
Hero Area
==============================*/}
  <div className="th-hero-wrapper hero-1" id="hero">
    <div className="container-fluid p-0 pe-lg-4 ps-lg-4">
      <div className="row gy-4">
        <div className="col-xl-6">
          <div className="hero-style1" data-bg-src="assets/img/hero/hero_bg_1.jpg">
            <span className="sub-title text-anime-style-2">Next-Generation AI Technology</span>
            <h1 className="hero-title text-anime-style-3">Transform Your Business With AI</h1>
            <p className="hero-text wow fadeInUp" data-wow-delay=".4s">We help businesses unlock new opportunities
              with AI-driven solutions for
              automation, insights, and growth.</p>
            <div className=" wow fadeInUp" data-wow-delay=".6s">
              <a href="/about" className="th-btn">Discover More <span className="icon"><img src="assets/img/icon/arrow-right.svg" alt /></span></a>
            </div>
            <div className="discount-wrapp scroll-down">
              <a href="#about-sec" className="spin">
                <div className="logo-img"> <img src="assets/img/logo-icon.svg" alt /></div>
              </a>
              <div className="discount-tag">
                <span className="discount-anime">SCROLL DOWN FOR MOR *** SCROLL DOWN FOR MORE *** SCROLL DOWN**
                </span>
              </div>
            </div>
          </div>
          <div className="row gy-4 justify-content-center">
            <div className="col-sm-6 col-md-4">
              <div className="hero-card bounce__anim" data-bg-src="assets/img/normal/counter_bg_1.jpg">
                <div className="media-body">
                  <h2 className="box-number"><span className="counter-number">500</span>K+</h2>
                  <p className="box-text">Active Users</p>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-md-4">
              <div className="hero-card bounce__anim" data-bg-src="assets/img/normal/counter_bg_2.jpg">
                <div className="media-body">
                  <h2 className="box-number"><span className="counter-number">99.9</span>%</h2>
                  <p className="box-text">Uptime SLA</p>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-md-4">
              <div className="hero-card bounce__anim" data-bg-src="assets/img/normal/counter_bg_3.jpg">
                <div className="media-body">
                  <h2 className="box-number"><span className="counter-number">2.5</span>B+</h2>
                  <p className="box-text">Predictions Made</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-6">
          <div className="hero-video">
            <video autoPlay loop muted>
              <source src="assets/img/bg/aior.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </div>
    </div>
  </div>
  {/*======== / Hero Section ========*/}{/*==============================
About Area  
==============================*/}
  <div className="about-area overflow-hidden space" id="about-sec">
    <div className="container">
      <div className="row gy-4">
        <div className="col-lg-8 mb-30 mb-xl-0">
          <div className="title-area pe-xl-5">
            <span className="sub-title text-anime-style-2">About Us</span>
            <h2 className="sec-title text-anime-style-3"> <span>AI solutions</span> <span className="title">crafted for everyone!</span></h2>
          </div>
        </div>
      </div>
      <div className="row gy-4">
        <div className="col-lg-5 col-xxl-5">
          <div className="img-box1">
            <div className="img1 image scale">
              <img src="assets/img/normal/about_1_1.jpg" alt="About" />
            </div>
          </div>
        </div>
        <div className="col-lg-7 col-xxl-6">
          <div className="ps-xxl-5">
            <p className="pe-xl-5 me-xl-5 mb-35 wow fadeInUp" data-wow-delay=".4s">In today's fast-paced tech
              environment, incorporating AI is
              essential. It changes
              how businesses and customers connect, offering key insights for adapting to market trends. AI
              involves creating computer systems that can do things that usually need human intelligence.</p>
            <div className="checklist list-two-column about-checklist wow fadeInUp" data-wow-delay=".6s">
              <ul>
                <li className="wow fadeInUp" data-wow-delay=".1s">Proven Expertise </li>
                <li className="wow fadeInUp" data-wow-delay=".2s">Proven Expertise</li>
                <li className="wow fadeInUp" data-wow-delay=".3s">Client-Centric Approach</li>
                <li className="wow fadeInUp" data-wow-delay=".4s">Client-Centric Approach</li>
                <li className="wow fadeInUp" data-wow-delay=".5s">Cutting-Edge Technology</li>
                <li className="wow fadeInUp" data-wow-delay=".5s">Cutting-Edge Technology</li>
              </ul>
            </div>
            <div className="btn-group mt-45 wow fadeInUp" data-wow-delay=".8s">
              <a href="/about" className="th-btn">Learn More <span className="icon"><img src="assets/img/icon/arrow-right.svg" alt /></span></a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="shape-mockup jumpAni d-none d-xxl-block" data-top="25%" data-right="0%"><img src="assets/img/shape/element-1.png" alt /></div>
  </div>{/*==============================
Service Area  
==============================*/}
  <section className="service-area position-relative overflow-hidden space" id="features-sec">
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-lg-6">
          <div className="title-area text-center">
            <span className="sub-title style2 text-anime-style-2">Our Features</span>
            <h2 className="sec-title text-anime-style-3">Powerful AI Features</h2>
          </div>
        </div>
      </div>
      <div className="row gy-4 justify-content-center">
        <div className="col-md-6 col-xl-4">
          <div className="service-card">
            <div className="box-icon">
              <img src="assets/img/icon/service_1_1.svg" alt="icon" />
            </div>
            <div className="box-content">
              <h3 className="box-title"><a href="/features">Advanced Neural Networks</a></h3>
              <p className="box-text">State-of-the-art deep learning models trained on billions of data points for unmatched accuracy.</p>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-xl-4">
          <div className="service-card">
            <div className="box-icon">
              <img src="assets/img/icon/service_1_2.svg" alt="icon" />
            </div>
            <div className="box-content">
              <h3 className="box-title"><a href="/features">Lightning Fast Processing</a></h3>
              <p className="box-text">Real-time inference with sub-millisecond latency powered by optimized GPU acceleration.</p>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-xl-4">
          <div className="service-card">
            <div className="box-icon">
              <img src="assets/img/icon/service_1_3.svg" alt="icon" />
            </div>
            <div className="box-content">
              <h3 className="box-title"><a href="/features">Enterprise Security</a></h3>
              <p className="box-text">Bank-grade encryption and compliance with SOC 2, GDPR, and HIPAA standards.</p>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-xl-4">
          <div className="service-card">
            <div className="box-icon">
              <img src="assets/img/icon/service_1_4.svg" alt="icon" />
            </div>
            <div className="box-content">
              <h3 className="box-title"><a href="/features">Predictive Analytics</a></h3>
              <p className="box-text">Forecast trends and outcomes with AI-powered predictive models and insights.</p>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-xl-4">
          <div className="service-card">
            <div className="box-icon">
              <img src="assets/img/icon/service_1_5.svg" alt="icon" />
            </div>
            <div className="box-content">
              <h3 className="box-title"><a href="/features">AutoML Capabilities</a></h3>
              <p className="box-text">Automated model training and optimization without requiring data science expertise.</p>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-xl-4">
          <div className="service-card">
            <div className="box-icon">
              <img src="assets/img/icon/service_1_1.svg" alt="icon" />
            </div>
            <div className="box-content">
              <h3 className="box-title"><a href="/features">Actionable Insights</a></h3>
              <p className="box-text">Transform complex data into clear visualizations and actionable business intelligence.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>{/*==============================
Process Area  
==============================*/}
  <section className="process-area th-panel-pin-area position-relative  space" data-overlay="black2" data-opacity={6} data-bg-src="assets/img/bg/process_bg_1.jpg">
    <div className="container">
      <div className="title-area text-center pe-xl-5 ps-xl-5">
        <span className="sub-title text-anime-style-2 style2">Works Process</span>
        <h2 className="sec-title text-white text-anime-style-3">How it Works</h2>
      </div>
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="process-wrapper">
            <div className="process-item th-panel-pin mb-50" data-end="bottom 107%">
              <div className="box-wrapp">
                <span className="box-num"><span className="number">01</span> STEP</span>
                <div className="box-content">
                  <h3 className="box-title">Problem Framing</h3>
                  <p className="box-text">Seamlessly integrate with your existing data sources through our
                    APIs or upload directly.</p>
                  <div className="checklist">
                    <ul>
                      <li>Proven Expertise</li>
                      <li>Client-Centric Approach</li>
                      <li>Cutting-Edge Technology</li>
                      <li>Innovative Solutions</li>
                      <li>User-Centric Design</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="box-img">
                <img src="assets/img/process/process_1_1.jpg" alt />
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-8">
          <div className="process-wrapper">
            <div className="process-item th-panel-pin mb-50" data-end="bottom 107%">
              <div className="box-wrapp">
                <span className="box-num"><span className="number">02</span> STEP</span>
                <div className="box-content">
                  <h3 className="box-title">Data Intelligence</h3>
                  <p className="box-text">Seamlessly integrate with your existing data sources through our
                    APIs or upload directly.</p>
                  <div className="checklist">
                    <ul>
                      <li>Data readiness score</li>
                      <li>Risk &amp; bias map</li>
                      <li>Build vs. buy recommendation</li>
                      <li>Innovative Solutions</li>
                      <li>User-Centric Design</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="box-img">
                <img src="assets/img/process/process_1_2.jpg" alt />
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-8">
          <div className="process-wrapper">
            <div className="process-item th-panel-pin mb-50" data-end="bottom 107%">
              <div className="box-wrapp">
                <span className="box-num"><span className="number">03</span> STEP</span>
                <div className="box-content">
                  <h3 className="box-title">Model Strategy</h3>
                  <p className="box-text">Seamlessly integrate with your existing data sources through our
                    APIs or upload directly.</p>
                  <div className="checklist">
                    <ul>
                      <li>Accuracy vs. latency tradeoffs</li>
                      <li>Cost at scale</li>
                      <li>Interpretability &amp; control</li>
                      <li>Innovative Solutions</li>
                      <li>User-Centric Design</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="box-img">
                <img src="assets/img/process/process_1_3.jpg" alt />
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-8">
          <div className="process-wrapper">
            <div className="process-item th-panel-pin mb-50" data-end="bottom 107%">
              <div className="box-wrapp">
                <span className="box-num"><span className="number">04</span> STEP</span>
                <div className="box-content">
                  <h3 className="box-title">Human-in-the-Loop</h3>
                  <p className="box-text">Seamlessly integrate with your existing data sources through our
                    APIs or upload directly.</p>
                  <div className="checklist">
                    <ul>
                      <li>Accuracy vs. latency tradeoffs</li>
                      <li>Cost at scale</li>
                      <li>Cutting-Edge Technology</li>
                      <li>Innovative Solutions</li>
                      <li>User-Centric Design</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="box-img">
                <img src="assets/img/process/process_1_4.jpg" alt />
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-8">
          <div className="process-wrapper">
            <div className="process-item th-panel-pin mb-50" data-end="bottom 107%">
              <div className="box-wrapp">
                <span className="box-num"><span className="number">05</span> STEP</span>
                <div className="box-content">
                  <h3 className="box-title">Production</h3>
                  <p className="box-text">Seamlessly integrate with your existing data sources through our
                    APIs or upload directly.</p>
                  <div className="checklist">
                    <ul>
                      <li>Model monitoring &amp; alerts</li>
                      <li>Version control &amp; rollback</li>
                      <li>Compliance &amp; explainability layers</li>
                      <li>Innovative Solutions</li>
                      <li>User-Centric Design</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="box-img">
                <img src="assets/img/process/process_1_5.jpg" alt />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>{/*==============================
Project Area  
==============================*/}
  <section className="project-area position-relative overflow-hidden space" id="case-studies-sec">
    <div className="container">
      <div className="title-area text-center">
        <span className="sub-title style2 text-anime-style-2">Proven Use Cases</span>
        <h2 className="sec-title style2 text-anime-style-3">Recent Case Studies</h2>
      </div>
      <div className="row gy-4 justify-content-center">
        <div className="col-lg-6">
          <div className="project-card">
            <div className="box-img global-img">
              <img src="assets/img/project/project_1_1.jpg" alt />
            </div>
            <div className="box-content">
              <span className="box-sub">Service</span>
              <h3 className="box-title"><a href="/case-studies-details">Customer Support</a></h3>
              <p className="box-text">Deliver high-quality customer service with a portfolio of generative and predictive applications tailored to your business needs.</p>
              <span className="discount">60% reduction in response time</span>
              <a href="/case-studies-details" className="icon-btn"><span className="icon"><img src="assets/img/icon/arrow-right.svg" alt /></span></a>
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="project-card">
            <div className="box-img global-img">
              <img src="assets/img/project/project_1_2.jpg" alt />
            </div>
            <div className="box-content">
              <span className="box-sub">Healthcare</span>
              <h3 className="box-title"><a href="/case-studies-details">Telemedicine</a></h3>
              <p className="box-text">Intelligent chatbots, sentiment analysis, and automated ticket routing.</p>
              <span className="discount">35% increase in conversion</span>
              <a href="/case-studies-details" className="icon-btn"><span className="icon"><img src="assets/img/icon/arrow-right.svg" alt /></span></a>
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="project-card">
            <div className="box-img global-img">
              <img src="assets/img/project/project_1_3.jpg" alt />
            </div>
            <div className="box-content">
              <span className="box-sub">Education</span>
              <h3 className="box-title"><a href="/case-studies-details">Online Learning</a></h3>
              <p className="box-text">Deliver high-quality customer service with a portfolio of generative and predictive applications tailored to your business needs.</p>
              <span className="discount">60% reduction in response time</span>
              <a href="/case-studies-details" className="icon-btn"><span className="icon"><img src="assets/img/icon/arrow-right.svg" alt /></span></a>
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="project-card">
            <div className="box-img global-img">
              <img src="assets/img/project/project_1_4.jpg" alt />
            </div>
            <div className="box-content">
              <span className="box-sub">Retail</span>
              <h3 className="box-title"><a href="/case-studies-details">e-Commerce</a></h3>
              <p className="box-text">Intelligent chatbots, sentiment analysis, and automated ticket routing.</p>
              <span className="discount">35% increase in conversion</span>
              <a href="/case-studies-details" className="icon-btn"><span className="icon"><img src="assets/img/icon/arrow-right.svg" alt /></span></a>
            </div>
          </div>
        </div>
      </div>
      <div className="text-center mt-80"><a href="/case-studies" className="th-btn">Explore All <span className="icon"><img src="assets/img/icon/arrow-right.svg" alt /></span></a></div>
    </div>
  </section>{/*==============================
Counter Area  
==============================*/}
  <div className=" overflow-hidden">
    <div className="container">
      <div className="title-area text-center">
        <h2 className="sec-title style2 text-anime-style-3">Trusted by Industry Leaders</h2>
        <p className="wow fadeInUp" data-wow-delay=".3s">Join thousands of companies transforming their business with AI</p>
      </div>
      <div className="counter-area bounce_animation">
        <div className="counter-card_wrapp">
          <div className="counter-card bounce__anim">
            <div className="media-body">
              <h3 className="box-number"><span className="counter-number">10</span>M+</h3>
              <p className="box-text">API Calls Daily</p>
            </div>
          </div>
        </div>
        <div className="counter-card_wrapp">
          <div className="counter-card bounce__anim">
            <div className="media-body">
              <h3 className="box-number"><span className="counter-number">150</span>+</h3>
              <p className="box-text">Countries Served</p>
            </div>
          </div>
        </div>
        <div className="counter-card_wrapp">
          <div className="counter-card bounce__anim">
            <div className="media-body">
              <h3 className="box-number"><span className="counter-number">4.9</span>/5</h3>
              <p className="box-text">Customer Rating</p>
            </div>
          </div>
        </div>
        <div className="counter-card_wrapp">
          <div className="counter-card bounce__anim">
            <div className="media-body">
              <h3 className="box-number"><span className="counter-number">24</span>/7</h3>
              <p className="box-text">Expert Support</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div className="overflow-hidden space-top  overflow-hidden">
    <div className="marquee-wrap2 bg-theme2 pt-40 pb-40">
      <div className="container-fluid p-0">
        <div className="swiper th-slider marquee-slider2" data-slider-options="{&quot;loop&quot;: true,&quot;breakpoints&quot;:{&quot;0&quot;:{&quot;slidesPerView&quot;:&quot;auto&quot;}},&quot;autoplay&quot;:{&quot;delay&quot;:0,&quot;disableOnInteraction&quot;:false},&quot;speed&quot;:20000,&quot;spaceBetween&quot;:30}">
          <div className="swiper-wrapper">
            <div className="swiper-slide">
              <div className="marquee-card">
                <a target="_blank" href="#">
                  Artificial Intelligence in Shaping the Future of
                  Technology. / &nbsp;Artificial Intelligence in Shaping the
                  Future of Technology. </a>
              </div>
            </div>
            <div className="swiper-slide">
              <div className="marquee-card">
                <a target="_blank" href="#">
                  Artificial Intelligence in Shaping the Future of
                  Technology. / &nbsp;Artificial Intelligence in Shaping the
                  Future of Technology. </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div dir="rtl" className="marquee-wrap3 bg-theme pt-40 pb-40">
      <div className="container-fluid p-0">
        <div className="swiper th-slider marquee-slider2" data-slider-options="{&quot;loop&quot;: true,&quot;breakpoints&quot;:{&quot;0&quot;:{&quot;slidesPerView&quot;:&quot;auto&quot;}},&quot;autoplay&quot;:{&quot;delay&quot;:0,&quot;disableOnInteraction&quot;:false},&quot;noSwiping&quot;:&quot;false&quot;,&quot;speed&quot;:10000,&quot;spaceBetween&quot;:30}">
          <div className="swiper-wrapper">
            <div className="swiper-slide">
              <div className="marquee-card style2 text-white">
                <a target="_blank" href="#">
                  Artificial Intelligence in Shaping the Future of
                  Technology. / &nbsp;Artificial Intelligence in Shaping the
                  Future of Technology. </a>
              </div>
            </div>
            <div className="swiper-slide">
              <div className="marquee-card style2 text-white">
                <a target="_blank" href="#">
                  AI Algorithms </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>{/*==============================
About Area  
==============================*/}
  <div className="position-relative space  overflow-hidden">
    <div className="container">
      <div className="row gy-4 gx-0 justify-content-end flex-row-reverse">
        <div className="col-lg-10 col-xl-8">
          <div className="ps-xl-5 ms-xxl-5">
            <div className="about-wrapper">
              <div className="title-area">
                <span className="sub-title text-anime-style-2">Features / Benefits</span>
                <h2 className="sec-title text-anime-style-3">AI solutions <span className="d-block">crafted for
                    everyone!</span></h2>
              </div>
              <div className="about-wrapp">
                <div>
                  <div className="checklist style2 wow fadeInUp" data-wow-delay=".6s">
                    <ul>
                      <li className="wow fadeInUp" data-wow-delay=".1s">Proven Expertise</li>
                      <li className="wow fadeInUp" data-wow-delay=".2s">Client-Centric Approach</li>
                      <li className="wow fadeInUp" data-wow-delay=".3s">Cutting-Edge Technology</li>
                      <li className="wow fadeInUp" data-wow-delay=".4s">Innovative Solutions</li>
                      <li className="wow fadeInUp" data-wow-delay=".5s">User-Centric Design</li>
                      <li className="wow fadeInUp" data-wow-delay=".5s">Seamless Integration</li>
                    </ul>
                  </div>
                  <div className="btn-group mt-60 wow fadeInUp" data-wow-delay=".8s">
                    <a href="/contact" className="th-btn">Learn More <span className="icon"><img src="assets/img/icon/arrow-right.svg" alt /></span></a>
                  </div>
                </div>
                <div>
                  <div className="feature-img2 global-img">
                    <img src="assets/img/normal/feature_1_2.jpg" alt />
                  </div>
                </div>
              </div>
              <div className="discount-wrapp">
                <a href="https://www.youtube.com/watch?v=_sI_Ps7JSEk" className="play-btn popup-video">
                  <i className="fa-solid fa-play" /></a>
                <div className="discount-tag">
                  <span className="discount-anime">View All Demo ** View All Demo ** View All Demo ** View All Demo**</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-5 col-xl-4">
          <div className="feature-img global-img">
            <div className="box-img"><img src="assets/img/normal/feature_1_1.jpg" alt /></div>
          </div>
        </div>
      </div>
    </div>
  </div>{/*==============================
Download Area 1 
==============================*/}
  <section className="download-area overflow-hidden space-top">
    <div className="container">
      <div className="row gy-4 justify-content-center align-items-center">
        <div className="col-xl-10">
          <div className="title-area mb-80 text-center">
            <span className="sub-title text-white text-anime-style-2">Integration</span>
            <h2 className="sec-title text-white text-anime-style-3">AI Agents Integration </h2>
          </div>
          <div className="download-img-wrapp">
            <div className="download-image style1">
              <img src="assets/img/normal/social-img4.png" alt />
            </div>
            <div className="download-image stylw2">
              <img src="assets/img/normal/social-img3.png" alt />
            </div>
            <div className="download-image style3">
              <img src="assets/img/normal/social-img2.png" alt />
            </div>
            <div className="download-image">
              <img src="assets/img/normal/social-img.png" alt />
            </div>
          </div>
          <div className="position-relative z-index-3 mt-60 text-center mb-80">
            <a href="/contact" className="th-btn">Contact Us <span className="icon"><img src="assets/img/icon/arrow-right.svg" alt /></span></a>
          </div>
        </div>
      </div>
      <div className="row gy-4 mt-lg-50">
        <div className="col-md-6 col-xl-3">
          <div className="integration-card">
            <div className="box-content">
              <div className="box-icon">
                <img src="assets/img/icon/icon-1.png" alt />
              </div>
              <h3 className="box-title">Microsoft Team</h3>
            </div>
            <p className="box-text">Use the context from your contact like
              bio.title, location, and notes-in complex
              ChatGPT queries and workflows.</p>
          </div>
        </div>
        <div className="col-md-6 col-xl-3">
          <div className="integration-card">
            <div className="box-content">
              <div className="box-icon">
                <img src="assets/img/icon/icon-2.png" alt />
              </div>
              <h3 className="box-title">ChatGPT</h3>
            </div>
            <p className="box-text">Use the context from your contact like bio title, location, and notes-in complex
              ChatGPT queries and workflows.</p>
          </div>
        </div>
        <div className="col-md-6 col-xl-3">
          <div className="integration-card">
            <div className="box-content">
              <div className="box-icon">
                <img src="assets/img/icon/icon-3.png" alt />
              </div>
              <h3 className="box-title">Ziper</h3>
            </div>
            <p className="box-text">Use the context from your contact like
              bio title, location, and notes-in complex ChatGPT queries and workflows.</p>
          </div>
        </div>
        <div className="col-md-6 col-xl-3">
          <div className="integration-card">
            <div className="box-content">
              <div className="box-icon">
                <img src="assets/img/icon/icon-4.png" alt />
              </div>
              <h3 className="box-title">Loom</h3>
            </div>
            <p className="box-text">Use the context from your contact like
              bio.title, location, and notes-in complex
              ChatGPT queries and workflows.</p>
          </div>
        </div>
      </div>
    </div>
  </section>{/*==============================
Price Area  
==============================*/}
  <section className="overflow-hidden space">
    <div className="container">
      <div className="title-area text-center">
        <span className="sub-title text-anime-style-2">Pricing Plan</span>
        <h2 className="sec-title text-anime-style-3">The People Powering Progress</h2>
      </div>
      <div className="row gy-4 justify-content-center">
        <div className="col-xl-4 col-xxl-3 col-md-6">
          <div className="price-box th-ani  wow fadeInUp" data-wow-delay=".2s">
            <div className="box-wrapp">
              <div className="box-icon"><img src="assets/img/icon/star.svg" alt /></div>
              <div className="box-content">
                <h3 className="box-title">Starter</h3>
                <p className="box-text">The most premium plan</p>
              </div>
            </div>
            <h4 className="box-price"><span className="dollar">$</span>99.99<span className="duration">/month</span></h4>
            <div className="box-content">
              <div className="available-list">
                <h4 className="subtitle">What included?</h4>
                <ul>
                  <li>1 Robentix Core Unit</li>
                  <li>Limited AI Task Library</li>
                  <li>Self-Service Deployment</li>
                  <li>Basic Dashboard Access</li>
                </ul>
              </div>
              <a href="/contact" className="th-btn black-border fw-btn">Choose the plan <span className="icon"><img src="assets/img/icon/arrow-right.svg" alt /></span></a>
            </div>
          </div>
        </div>
        <div className="col-xl-4 col-xxl-3 col-md-6">
          <div className="price-box th-ani  wow fadeInUp" data-wow-delay=".4s">
            <div className="box-wrapp">
              <div className="box-icon"><img src="assets/img/icon/star.svg" alt /></div>
              <div className="box-content">
                <h3 className="box-title">Beginner</h3>
                <p className="box-text">Affordable family coverage</p>
              </div>
            </div>
            <h4 className="box-price"><span className="dollar">$</span>189.99<span className="duration">/month</span></h4>
            <div className="box-content">
              <div className="available-list">
                <h4 className="subtitle">What included?</h4>
                <ul>
                  <li>5 Chiropractic Adjustment</li>
                  <li>Limited AI Task Library</li>
                  <li>Follow-Up Recommendations</li>
                  <li>Basic Dashboard Access</li>
                </ul>
              </div>
              <a href="/contact" className="th-btn black-border fw-btn">Choose the plan <span className="icon"><img src="assets/img/icon/arrow-right.svg" alt /></span></a>
            </div>
          </div>
        </div>
        <div className="col-xl-4 col-xxl-3 col-md-6">
          <div className="price-box th-ani active wow fadeInUp" data-wow-delay=".6s">
            <div className="box-wrapp">
              <div className="box-icon"><img src="assets/img/icon/star.svg" alt /></div>
              <div className="box-content">
                <h3 className="box-title">Professional</h3>
                <p className="box-text">Focus on preventive care</p>
              </div>
            </div>
            <h4 className="box-price"><span className="dollar">$</span>299.99<span className="duration">/month</span></h4>
            <div className="box-content">
              <div className="available-list">
                <h4 className="subtitle">What included?</h4>
                <ul>
                  <li>15 Chiropractic Adjustment</li>
                  <li>Limited AI Task Library</li>
                  <li>Follow-Up Recommendations</li>
                  <li>Basic Dashboard Access</li>
                </ul>
              </div>
              <a href="/contact" className="th-btn black-border fw-btn">Choose the plan <span className="icon"><img src="assets/img/icon/arrow-right.svg" alt /></span></a>
            </div>
          </div>
        </div>
        <div className="col-xl-4 col-xxl-3 col-md-6">
          <div className="price-box th-ani  wow fadeInUp" data-wow-delay=".8s">
            <div className="box-wrapp">
              <div className="box-icon"><img src="assets/img/icon/star.svg" alt /></div>
              <div className="box-content">
                <h3 className="box-title">Enterprise</h3>
                <p className="box-text">Unlimited Members</p>
              </div>
            </div>
            <h4 className="box-price"><span className="dollar">$</span>499.99<span className="duration">/month</span></h4>
            <div className="box-content">
              <div className="available-list">
                <h4 className="subtitle">What included?</h4>
                <ul>
                  <li>15 Chiropractic Adjustment</li>
                  <li>Limited AI Task Library</li>
                  <li>Follow-Up Recommendations</li>
                  <li>Basic Dashboard Access</li>
                </ul>
              </div>
              <a href="/contact" className="th-btn black-border fw-btn">Choose the plan <span className="icon"><img src="assets/img/icon/arrow-right.svg" alt /></span></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>{/*==============================
Testimonial Area  
==============================*/}
  <section className="position-relative overflow-hidden " id="testi-sec">
    <div className="container">
      <div className="row justify-content-lg-between justify-content-center align-items-center">
        <div className="col-lg-6">
          <div className="title-area text-center text-lg-start">
            <span className="sub-title text-anime-style-2">Testimonials</span>
            <h2 className="sec-title text-anime-style-3">See What Our Happy Customers Say</h2>
          </div>
        </div>
        <div className="col-auto">
          <div className="sec-btn">
            <a href="/testimonial" className="th-btn">Learn More <span className="icon"><img src="assets/img/icon/arrow-right.svg" alt /></span></a>
          </div>
        </div>
      </div>
      <div className="slider-wrap">
        <div className="swiper th-slider testiSlide1 has-shadow" id="testiSlide1" data-slider-options="{&quot;loop&quot;:false,&quot;mousewheel&quot;: {&quot;enabled&quot;: true,&quot;sensitivity&quot;: 4, &quot;releaseOnEdges&quot;:true},&quot;breakpoints&quot;: {&quot;0&quot;:{&quot;slidesPerView&quot;: 1},&quot;576&quot;: {&quot;slidesPerView&quot;: 1},&quot;768&quot;: {&quot;slidesPerView&quot;: 2},&quot;992&quot;: {&quot;slidesPerView&quot;: 2},&quot;1200&quot;: {&quot;slidesPerView&quot;: 3}}}">
          <div className="swiper-wrapper">
            <div className="swiper-slide">
              <div className="testi-card">
                <div className="box-wrapp">
                  <span className="rating"><i className="fa-sharp fa-solid fa-star-sharp" /><i className="fa-sharp fa-solid fa-star-sharp" /><i className="fa-sharp fa-solid fa-star-sharp" /><i className="fa-sharp fa-solid fa-star-sharp" /><i className="fa-sharp fa-solid fa-star-sharp" /></span>
                  <div className="box-quote"><img src="assets/img/icon/quote.svg" alt /></div>
                </div>
                <p className="box-text">The collaborative approach they took was refreshing and effective</p>
                <div className="box-wrapp">
                  <div className="box-profile">
                    <div className="box-author">
                      <img src="assets/img/testimonial/testi_1_1.png" alt="Avater" />
                    </div>
                    <div className="box-info">
                      <h3 className="box-title">Jems Colin</h3>
                      <span className="box-desig">CTO, Ailitic</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="swiper-slide">
              <div className="testi-card">
                <div className="box-wrapp">
                  <span className="rating"><i className="fa-sharp fa-solid fa-star-sharp" /><i className="fa-sharp fa-solid fa-star-sharp" /><i className="fa-sharp fa-solid fa-star-sharp" /><i className="fa-sharp fa-solid fa-star-sharp" /><i className="fa-sharp fa-solid fa-star-sharp" /></span>
                  <div className="box-quote"><img src="assets/img/icon/quote.svg" alt /></div>
                </div>
                <p className="box-text">The innovative strategies they implemented greatly improved our workflow.</p>
                <div className="box-wrapp">
                  <div className="box-profile">
                    <div className="box-author">
                      <img src="assets/img/testimonial/testi_1_2.png" alt="Avater" />
                    </div>
                    <div className="box-info">
                      <h3 className="box-title">Sara Lin</h3>
                      <span className="box-desig">Product Manager, Innovatech</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="swiper-slide">
              <div className="testi-card">
                <div className="box-wrapp">
                  <span className="rating"><i className="fa-sharp fa-solid fa-star-sharp" /><i className="fa-sharp fa-solid fa-star-sharp" /><i className="fa-sharp fa-solid fa-star-sharp" /><i className="fa-sharp fa-solid fa-star-sharp" /><i className="fa-sharp fa-solid fa-star-sharp" /></span>
                  <div className="box-quote"><img src="assets/img/icon/quote.svg" alt /></div>
                </div>
                <p className="box-text">The innovative strategies they implemented greatly improved our workflow.</p>
                <div className="box-wrapp">
                  <div className="box-profile">
                    <div className="box-author">
                      <img src="assets/img/testimonial/testi_1_3.png" alt="Avater" />
                    </div>
                    <div className="box-info">
                      <h3 className="box-title">Mark Rivas</h3>
                      <span className="box-desig">Lead Developer, TechScribe</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="swiper-slide">
              <div className="testi-card">
                <div className="box-wrapp">
                  <span className="rating"><i className="fa-sharp fa-solid fa-star-sharp" /><i className="fa-sharp fa-solid fa-star-sharp" /><i className="fa-sharp fa-solid fa-star-sharp" /><i className="fa-sharp fa-solid fa-star-sharp" /><i className="fa-sharp fa-solid fa-star-sharp" /></span>
                  <div className="box-quote"><img src="assets/img/icon/quote.svg" alt /></div>
                </div>
                <p className="box-text">The collaborative approach they took was refreshing and effective</p>
                <div className="box-wrapp">
                  <div className="box-profile">
                    <div className="box-author">
                      <img src="assets/img/testimonial/testi_1_1.png" alt="Avater" />
                    </div>
                    <div className="box-info">
                      <h3 className="box-title">Jems Colin</h3>
                      <span className="box-desig">CTO, Ailitic</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="swiper-slide">
              <div className="testi-card">
                <div className="box-wrapp">
                  <span className="rating"><i className="fa-sharp fa-solid fa-star-sharp" /><i className="fa-sharp fa-solid fa-star-sharp" /><i className="fa-sharp fa-solid fa-star-sharp" /><i className="fa-sharp fa-solid fa-star-sharp" /><i className="fa-sharp fa-solid fa-star-sharp" /></span>
                  <div className="box-quote"><img src="assets/img/icon/quote.svg" alt /></div>
                </div>
                <p className="box-text">The innovative strategies they implemented greatly improved our workflow.</p>
                <div className="box-wrapp">
                  <div className="box-profile">
                    <div className="box-author">
                      <img src="assets/img/testimonial/testi_1_2.png" alt="Avater" />
                    </div>
                    <div className="box-info">
                      <h3 className="box-title">Sara Lin</h3>
                      <span className="box-desig">Product Manager, Innovatech</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>{/*==============================
Cta Area  
==============================*/}
  <div className="space overflow-hidden">
    <div className="container">
      <div className="cta-area2 space" data-bg-src="assets/img/bg/cta_bg_1.jpg">
        <div className="row justify-content-center align-items-center">
          <div className="col-lg-10">
            <div className="title-area text-center">
              <h2 className="sec-title text-white text-anime-style-2">Ready to Transform Your Business?</h2>
              <span className="box-text text-anime-style-3">Join thousands of companies already using our AI platform to drive
                innovation and growth.</span>
            </div>
            <div className="btn-group justify-content-center">
              <a href="/contact" className="th-btn">Start Free Trial <span className="icon"><img src="assets/img/icon/arrow-right.svg" alt /></span></a>
              <a href="/contact" className="th-btn th-border">Schedule Demo <img src="assets/img/icon/arrow-right.svg" alt /></a>
            </div>
            <ul className="cta-list">
              <li><i className="fa-light fa-check" />No credit card required</li>
              <li><i className="fa-light fa-check" />14-day free trial</li>
              <li><i className="fa-light fa-check" />Cancel anytime</li>
              <li><i className="fa-light fa-check" />24/7 support</li>
            </ul>
          </div>
        </div>
        <div className="shape-mockup movingX d-none d-lg-block" data-bottom="0%" data-right="0%"><img src="assets/img/shape/element-2.png" alt />
        </div>
      </div>
    </div>
  </div>{/*==============================
Blog Area  
==============================*/}
  <section className="overflow-hidden space bg-smoke2 overflow-hidden" id="blog-sec">
    <div className="container">
      <div className="row">
        <div className="col-lg-12 col-xxl-9">
          <div className="row justify-content-lg-between justify-content-center align-items-center">
            <div className="col-lg-8 col-xxl-6">
              <div className="title-area text-center text-lg-start">
                <span className="sub-title text-anime-style-2">News &amp; Blog</span>
                <h2 className="sec-title text-anime-style-3">Recent our recent articles</h2>
              </div>
            </div>
            <div className="col-auto">
              <div className="sec-btn">
                <a href="/blog" className="th-btn">BROWSE ALL <span className="icon"><img src="assets/img/icon/arrow-right.svg" alt /></span></a>
              </div>
            </div>
          </div>
          <div className="slider-area">
            <div className="swiper th-slider blogSlider1 has-shadow" id="blogSlider1" data-slider-options="{&quot;loop&quot;:false,&quot;mousewheel&quot;: {&quot;enabled&quot;: true,&quot;sensitivity&quot;: 4, &quot;releaseOnEdges&quot;:true},&quot;breakpoints&quot;:{&quot;0&quot;:{&quot;slidesPerView&quot;:1},&quot;576&quot;:{&quot;slidesPerView&quot;:&quot;1&quot;},&quot;768&quot;:{&quot;slidesPerView&quot;:&quot;1&quot;},&quot;992&quot;:{&quot;slidesPerView&quot;:&quot;2&quot;},&quot;1200&quot;:{&quot;slidesPerView&quot;:&quot;4&quot;}}}">
              <div className="swiper-wrapper">
                <div className="swiper-slide">
                  <div className="blog-card">
                    <div className="box-img global-img">
                      <img src="assets/img/blog/blog_1_1.jpg" alt="blog image" />
                    </div>
                    <div className="box-content">
                      <span className="cat">Remote work</span>
                      <h3 className="box-title"><a href="/blog-details">Building and Leading a Talented Design Team for Success</a></h3>
                    </div>
                    <div className="blog-meta">
                      <a href="/blog">15 Jan, 2025</a>
                      <a href="/blog">2 Comments</a>
                    </div>
                  </div>
                </div>
                <div className="swiper-slide">
                  <div className="blog-card">
                    <div className="box-img global-img">
                      <img src="assets/img/blog/blog_1_2.jpg" alt="blog image" />
                    </div>
                    <div className="box-content">
                      <span className="cat">Hybrid Collaboration</span>
                      <h3 className="box-title"><a href="/blog-details">Maximizing Productivity in a Flexible Work Environment</a></h3>
                    </div>
                    <div className="blog-meta">
                      <a href="/blog">19 Jan, 2025</a>
                      <a href="/blog">3 Comments</a>
                    </div>
                  </div>
                </div>
                <div className="swiper-slide">
                  <div className="blog-card">
                    <div className="box-img global-img">
                      <img src="assets/img/blog/blog_1_3.jpg" alt="blog image" />
                    </div>
                    <div className="box-content">
                      <span className="cat">User-Centered Design</span>
                      <h3 className="box-title"><a href="/blog-details">Strategies to Enhance User Engagement and Satisfaction</a></h3>
                    </div>
                    <div className="blog-meta">
                      <a href="/blog">20 Jan, 2025</a>
                      <a href="/blog">2 Comments</a>
                    </div>
                  </div>
                </div>
                <div className="swiper-slide">
                  <div className="blog-card">
                    <div className="box-img global-img">
                      <img src="assets/img/blog/blog_1_4.jpg" alt="blog image" />
                    </div>
                    <div className="box-content">
                      <span className="cat">Design Systems</span>
                      <h3 className="box-title"><a href="/blog-details">Creating Cohesive Experiences Across Platforms</a></h3>
                    </div>
                    <div className="blog-meta">
                      <a href="/blog">22 Jan, 2025</a>
                      <a href="/blog">4 Comments</a>
                    </div>
                  </div>
                </div>
                <div className="swiper-slide">
                  <div className="blog-card">
                    <div className="box-img global-img">
                      <img src="assets/img/blog/blog_1_1.jpg" alt="blog image" />
                    </div>
                    <div className="box-content">
                      <span className="cat">Remote work</span>
                      <h3 className="box-title"><a href="/blog-details">Building and Leading a Talented Design Team for Success</a></h3>
                    </div>
                    <div className="blog-meta">
                      <a href="/blog">25 Jan, 2025</a>
                      <a href="/blog">2 Comments</a>
                    </div>
                  </div>
                </div>
                <div className="swiper-slide">
                  <div className="blog-card">
                    <div className="box-img global-img">
                      <img src="assets/img/blog/blog_1_2.jpg" alt="blog image" />
                    </div>
                    <div className="box-content">
                      <span className="cat">Hybrid Collaboration</span>
                      <h3 className="box-title"><a href="/blog-details">Maximizing Productivity in a Flexible Work Environment</a></h3>
                    </div>
                    <div className="blog-meta">
                      <a href="/blog">29 Jan, 2025</a>
                      <a href="/blog">3 Comments</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xxl-3">
          <div className="blog-image">
            <img src="assets/img/blog/blog-image.jpg" alt />
          </div>
        </div>
      </div>
    </div>
  </section>{/*==============================
	Footer Area
==============================*/}
  <footer className="footer-wrapper footer-layout1 style2" data-bg-src="assets/img/bg/footer_bg_1_1.jpg">
    <div className="widget-area">
      <div className="container">
        <div className="footer-top">
          <h2 className="box-title text-white">Start Your AI Journey With Our Experts</h2>
          <div className>
            <form className="newsletter-form"><input className="form-control" type="email" placeholder="Enter your email to stay inform" required /> <button type="submit" className="th-btn">Start Free Trial <span className="icon"><img src="assets/img/icon/arrow-right.svg" alt /></span></button></form>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row gy-4 justify-content-between">
          <div className="col-md-6 col-xl-3 col-xxl-2">
            <div className="widget footer-widget mb-0">
              <div className="th-widget-about">
                <div className="about-logo">
                  <a href="/"><img src="assets/img/logo-white.svg" alt="Aior " /></a>
                </div>
                <p className="about-text">Aior is a startup design agency based in Canada</p>
                <div className="th-social">
                  <a href="https://www.facebook.com/"><i className="fab fa-facebook-f" /></a>
                  <a href="https://www.twitter.com/"><i className="fab fa-twitter" /></a>
                  <a href="https://www.youtube.com/"><i className="fa-brands fa-instagram" /></a>
                  <a href="https://www.linkedin.com/"><i className="fab fa-linkedin-in" /></a>
                  <a href="https://www.youtube.com/"><i className="fab fa-youtube" /></a>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-xl-auto">
            <div className="widget widget_nav_menu footer-line footer-widget">
              <h3 className="widget_title">Product</h3>
              <div className="menu-all-pages-container">
                <ul className="menu">
                  <li><a href="#">Features</a></li>
                  <li><a href="/contact">Benefites</a></li>
                  <li><a href="/contact">Integrations</a></li>
                  <li><a href="/contact">Pricing</a></li>
                  <li><a href="/contact">Changelog</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-xl-auto">
            <div className="widget widget_nav_menu  footer-line footer-widget">
              <h3 className="widget_title">Service</h3>
              <div className="menu-all-pages-container">
                <ul className="menu">
                  <li><a href="/contact">24/7 Support</a></li>
                  <li><a href="/contact">Enhanced User Experience</a></li>
                  <li><a href="/contact">API Access</a></li>
                  <li><a href="/contact">Monthly Subscription</a></li>
                  <li><a href="/contact">Version History</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-xl-auto">
            <div className="widget widget_nav_menu footer-widget">
              <h3 className="widget_title">About Tool</h3>
              <div className="menu-all-pages-container">
                <ul className="menu">
                  <li><a href="/contact">Customizable</a></li>
                  <li><a href="/contact">Increased Efficiency</a></li>
                  <li><a href="/contact">Third-party Apps</a></li>
                  <li><a href="/contact">One-time Purchase</a></li>
                  <li><a href="/contact">Update Log</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="container">
      <div className="copyright-wrap">
        <div className="row gy-2 align-items-center justify-content-between">
          <div className="col-xl-6">
            <p className="copyright-text"><i className="fal fa-copyright" /> Copyright <a href="https://themeforest.net/user/themehour">Aior </a> 2026 . All Rights Reserved.</p>
          </div>
          <div className="col-xl-6 text-center text-xl-end">
            <div className="footer-links">
              <ul>
                <li><a href="/about">Privacy Policy</a></li>
                <li><a href="/about">Terms of Services</a></li>
                <li><a href="/about">Cookis Policy</a></li>
              </ul>
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
      <path d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98" style={{transition: 'stroke-dashoffset 10ms linear 0s', strokeDasharray: '307.919, 307.919', strokeDashoffset: '307.919'}}>
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

export default Home;
    