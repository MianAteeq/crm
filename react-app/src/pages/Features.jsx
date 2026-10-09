
import React, { useEffect } from 'react';

const Features = () => {
    
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
  <header className="th-header header-layout1">
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
    Breadcumb
============================== */}
  <div className="breadcumb-wrapper " data-bg-src="assets/img/bg/breadcumb-bg.jpg">
    <div className="container">
      <div className="breadcumb-content">
        <h1 className="breadcumb-title text-anime-style-3">Features &amp; Benefits</h1>
        <ul className="breadcumb-menu wow fadeInUp">
          <li><a href="/home-ai-startup">Home</a></li>
          <li>Features &amp; Benefits</li>
        </ul>
      </div>
    </div>
  </div>
  {/*==============================
Service Area  
==============================*/}
  <section className="position-relative overflow-hidden space overflow-hidden">
    <div className="container">
      <div className="row gy-4 justify-content-center">
        {/* Single Item */}
        <div className="col-md-6 col-xl-4">
          <div className="service-box2">
            <div className="box-icon">
              <img src="assets/img/icon/service_3_1.svg" alt="icon" />
            </div>
            <div className="box-content">
              <h2 className="box-title"><a href="/contact">Work from home stipend</a></h2>
              <p className="box-text">Need some new equipment to make your space sparkle? We give each employee a stipend to set up.</p>
              <a href="/contact" className="th-btn th-border">View Details <span className="icon"><img src="assets/img/icon/arrow-right.svg" alt /></span></a>
            </div>
          </div>
        </div>
        {/* Single Item */}
        <div className="col-md-6 col-xl-4">
          <div className="service-box2">
            <div className="box-icon">
              <img src="assets/img/icon/service_3_2.svg" alt="icon" />
            </div>
            <div className="box-content">
              <h2 className="box-title"><a href="/contact">Work from anywhere</a></h2>
              <p className="box-text">We trust each other to complete our work regardless of where we are. We also have an office.</p>
              <a href="/contact" className="th-btn th-border">View Details <span className="icon"><img src="assets/img/icon/arrow-right.svg" alt /></span></a>
            </div>
          </div>
        </div>
        {/* Single Item */}
        <div className="col-md-6 col-xl-4">
          <div className="service-box2">
            <div className="box-icon">
              <img src="assets/img/icon/service_3_3.svg" alt="icon" />
            </div>
            <div className="box-content">
              <h2 className="box-title"><a href="/contact">flexible Investing</a></h2>
              <p className="box-text">Unplugging from work is essential. We offer flexible PTO and encourage you actually to use it!</p>
              <a href="/contact" className="th-btn th-border">View Details <span className="icon"><img src="assets/img/icon/arrow-right.svg" alt /></span></a>
            </div>
          </div>
        </div>
        {/* Single Item */}
        <div className="col-md-6 col-xl-4">
          <div className="service-box2">
            <div className="box-icon">
              <img src="assets/img/icon/service_3_4.svg" alt="icon" />
            </div>
            <div className="box-content">
              <h2 className="box-title"><a href="/contact">Health Insurance</a></h2>
              <p className="box-text">For anyone to start building their real estate portfolio, no matter the size of your wallet.</p>
              <a href="/contact" className="th-btn th-border">View Details <span className="icon"><img src="assets/img/icon/arrow-right.svg" alt /></span></a>
            </div>
          </div>
        </div>
        {/* Single Item */}
        <div className="col-md-6 col-xl-4">
          <div className="service-box2">
            <div className="box-icon">
              <img src="assets/img/icon/service_3_5.svg" alt="icon" />
            </div>
            <div className="box-content">
              <h2 className="box-title"><a href="/contact">Competitive Salaries</a></h2>
              <p className="box-text">We pay fairly and competitively for early-stage companies.</p>
              <a href="/contact" className="th-btn th-border">View Details <span className="icon"><img src="assets/img/icon/arrow-right.svg" alt /></span></a>
            </div>
          </div>
        </div>
        {/* Single Item */}
        <div className="col-md-6 col-xl-4">
          <div className="service-box2">
            <div className="box-icon">
              <img src="assets/img/icon/service_3_1.svg" alt="icon" />
            </div>
            <div className="box-content">
              <h2 className="box-title"><a href="/contact">paid parental leave</a></h2>
              <p className="box-text">Grasping the cost of acquiring customers and the price of rendering the service.</p>
              <a href="/contact" className="th-btn th-border">View Details <span className="icon"><img src="assets/img/icon/arrow-right.svg" alt /></span></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <div className="marquee-area2 position-relative" data-bg-src="assets/img/bg/marquee_bg_1.jpg">
    <div className="marquee-content positive-relative overflow-hidden">
      <div className="marquee">
        <div className="marquee-group style2">
          <div className="item "><span>Cloud application development</span></div>
          <div className="item"><span>Security Testing Services</span></div>
          <div className="item "><span>DevOps</span></div>
          <div className="item"><span>Data Analytics</span></div>
          <div className="item "><span>Cloud application development</span></div>
          <div className="item"><span>Security Testing Services</span></div>
          <div className="item "><span>DevOps</span></div>
          <div className="item"><span>Data Analytics</span></div>
        </div>
        <div aria-hidden="true" className="marquee-group style2">
          <div className="item "><span>Cloud application development</span></div>
          <div className="item"><span>Security Testing Services</span></div>
          <div className="item "><span>DevOps</span></div>
          <div className="item"><span>Data Analytics</span></div>
          <div className="item "><span>Cloud application development</span></div>
          <div className="item"><span>Security Testing Services</span></div>
          <div className="item "><span>DevOps</span></div>
          <div className="item"><span>Data Analytics</span></div>
        </div>
      </div>
    </div>
  </div>{/*==============================
Service Area  
==============================*/}
  <section className="position-relative overflow-hidden space overflow-hidden" id="service-sec">
    <div className="container th-container5">
      <div className="row justify-content-between">
        <div className="col-lg-8 col-xxl-6">
          <div className="title-area pe-xl-5 me-xl-5">
            <span className="sub-title style3 text-anime-style-2">[ Our Services ]</span>
            <h2 className="sec-title h3 text-anime-style-3">Uniting Technology, Business Innovation,
              and Stellar Experience</h2>
          </div>
        </div>
        <div className="col-lg-4 col-xxl-4">
          <p className="mb-40">IT solutions that improve organizational capabilities for high-paced product development,
            faster delivery of applications and services are still essential for every company to gain a
            competitive edge. </p>
          <a href="/contact" className="th-btn">Explore More <span className="icon"><img src="assets/img/icon/arrow-right.svg" alt /></span></a>
        </div>
      </div>
      <div className="service-list-area style2">
        <div className="service-list style2 hover-item item-active">
          <div className="service-wrapp">
            <div className="service-img">
              <img src="assets/img/service/ser_1_1.jpg" alt />
            </div>
          </div>
          <div className="service-list-content">
            <div className="service-wrapp">
              <span className="number">01.</span>
              <h3 className="box-title">Cloud Solutions</h3>
            </div>
          </div>
        </div>
        <div className="service-list style2 hover-item">
          <div className="service-wrapp">
            <div className="service-img">
              <img src="assets/img/service/ser_1_2.jpg" alt />
            </div>
          </div>
          <div className="service-list-content">
            <div className="service-wrapp">
              <span className="number">02.</span>
              <h3 className="box-title">Configuration management</h3>
            </div>
          </div>
        </div>
        <div className="service-list style2 hover-item">
          <div className="service-wrapp">
            <div className="service-img">
              <img src="assets/img/service/ser_1_3.jpg" alt />
            </div>
          </div>
          <div className="service-list-content">
            <div className="service-wrapp">
              <span className="number">03</span>
              <h3 className="box-title">Business Process Automation</h3>
            </div>
          </div>
        </div>
        <div className="service-list style2 hover-item">
          <div className="service-wrapp">
            <div className="service-img">
              <img src="assets/img/service/ser_1_4.jpg" alt />
            </div>
          </div>
          <div className="service-list-content">
            <div className="service-wrapp">
              <span className="number">04</span>
              <h3 className="box-title">Big Data &amp; Data Analytics</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>{/*==============================
award Area  
==============================*/}
  <section className="award-area overflow-hidden space overflow-hidden" data-bg-src="assets/img/bg/dots_bg_1.png">
    <div className="title-area text-center">
      <span className="sub-title style3 text-anime-style-2">[ Awards ]</span>
      <h2 className="sec-title style2 text-anime-style-3">Awards Recognition</h2>
    </div>
    <div className="container">
      <div className="award-wrapp">
        <div className="award-item">
          <h3 className="box-title"><span className="number">1.</span>Awards Jury</h3>
          <div className="box-content">
            <span className="year">2009</span>
            <div className="box-img"> <img src="assets/img/icon/awards.png" alt /></div>
          </div>
        </div>
        <div className="award-item">
          <h3 className="box-title"><span className="number">2.</span>Studio of the year</h3>
          <div className="box-content">
            <span className="year">2010</span>
            <div className="box-img"> <img src="assets/img/icon/awards.png" alt /></div>
          </div>
        </div>
        <div className="award-item">
          <h3 className="box-title"><span className="number">3.</span>D&amp;AD Awards</h3>
          <div className="box-content">
            <span className="year">2011</span>
            <div className="box-img"> <img src="assets/img/icon/awards.png" alt /></div>
          </div>
        </div>
        <div className="award-item">
          <h3 className="box-title"><span className="number">4.</span>Best Innovation</h3>
          <div className="box-content">
            <span className="year">2012</span>
            <div className="box-img"> <img src="assets/img/icon/awards.png" alt /></div>
          </div>
        </div>
      </div>
    </div>
    <div className="shape-mockup jumpAni d-none d-lg-block" data-top="20%" data-left="5%"><img src="assets/img/shape/element-5.png" alt /></div>
  </section>{/*==============================
Testimonial Area  
==============================*/}
  <section className="testi-area overflow-hidden position-relative space" id="testi-sec">
    <div className="container th-container5">
      <div className="slider-area space-bottom">
        <div className="swiper th-slider" id="brandSlider2" data-slider-options="{&quot;breakpoints&quot;:{&quot;0&quot;:{&quot;slidesPerView&quot;:2},&quot;476&quot;:{&quot;slidesPerView&quot;:&quot;3&quot;},&quot;768&quot;:{&quot;slidesPerView&quot;:&quot;3&quot;},&quot;992&quot;:{&quot;slidesPerView&quot;:&quot;3&quot;},&quot;1200&quot;:{&quot;slidesPerView&quot;:&quot;4&quot;},&quot;1400&quot;:{&quot;slidesPerView&quot;:&quot;6&quot;}}}">
          <div className="swiper-wrapper">
            <div className="swiper-slide">
              <div className="brand-item">
                <a href>
                  <img src="assets/img/brand/brand_2_1.svg" alt="Brand Logo" />
                </a>
              </div>
            </div>
            <div className="swiper-slide">
              <div className="brand-item">
                <a href>
                  <img src="assets/img/brand/brand_2_2.svg" alt="Brand Logo" />
                </a>
              </div>
            </div>
            <div className="swiper-slide">
              <div className="brand-item">
                <a href>
                  <img src="assets/img/brand/brand_2_3.svg" alt="Brand Logo" />
                </a>
              </div>
            </div>
            <div className="swiper-slide">
              <div className="brand-item">
                <a href>
                  <img src="assets/img/brand/brand_2_4.svg" alt="Brand Logo" />
                </a>
              </div>
            </div>
            <div className="swiper-slide">
              <div className="brand-item">
                <a href>
                  <img src="assets/img/brand/brand_2_5.svg" alt="Brand Logo" />
                </a>
              </div>
            </div>
            <div className="swiper-slide">
              <div className="brand-item">
                <a href>
                  <img src="assets/img/brand/brand_2_6.svg" alt="Brand Logo" />
                </a>
              </div>
            </div>
            <div className="swiper-slide">
              <div className="brand-item">
                <a href>
                  <img src="assets/img/brand/brand_2_1.svg" alt="Brand Logo" />
                </a>
              </div>
            </div>
            <div className="swiper-slide">
              <div className="brand-item">
                <a href>
                  <img src="assets/img/brand/brand_2_2.svg" alt="Brand Logo" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row justify-content-between align-items-center">
        <div className="col-lg-7 col-xl-5">
          <div className="title-area text-center text-lg-start">
            <span className="sub-title style3 text-anime-style-2">[ Testimonials ]</span>
            <h2 className="sec-title h3 text-anime-style-3">What Our Clients Say</h2>
          </div>
        </div>
        <div className="col-auto">
          <div className="sec-btn">
            <div className="icon-box d-none d-lg-flex">
              <button data-slider-prev="#testiSlide5" className="slider-arrow style2 default slider-prev"><i className="fa-light fa-arrow-left" /></button>
              <button data-slider-next="#testiSlide5" className="slider-arrow style2 default slider-next"><i className="fa-light fa-arrow-right" /></button>
            </div>
          </div>
        </div>
      </div>
      <div className="slider-wrap">
        <div className="swiper th-slider  has-shadow" id="testiSlide5" data-slider-options="{&quot;paginationType&quot;: &quot;progressbar&quot;,&quot;loop&quot;:false,&quot;mousewheel&quot;: {&quot;enabled&quot;: true,&quot;sensitivity&quot;: 4,&quot;releaseOnEdges&quot;:true},&quot;breakpoints&quot;: {&quot;0&quot;:{&quot;slidesPerView&quot;: 1},&quot;576&quot;: {&quot;slidesPerView&quot;: 1},&quot;768&quot;: {&quot;slidesPerView&quot;: 2},&quot;1200&quot;: {&quot;slidesPerView&quot;: 3}}}">
          <div className="swiper-wrapper">
            <div className="swiper-slide">
              <div className="testi-box2">
                <div className="testi-overlay" data-bg-src="assets/img/testimonial/testi-shape2.png" />
                <div className="box-profile">
                  <div className="box-author">
                    <img src="assets/img/testimonial/testi_2_1.png" alt="Avater" />
                  </div>
                  <div className="box-quote"><img src="assets/img/icon/quote4.svg" alt /></div>
                </div>
                <p className="box-text">The collaborative approach they took was refreshing and effective</p>
                <div className="box-info">
                  <h3 className="box-title">Jems Colin</h3>
                  <span className="box-desig">CTO, Ailitic</span>
                </div>
              </div>
            </div>
            <div className="swiper-slide">
              <div className="testi-box2">
                <div className="testi-overlay" data-bg-src="assets/img/testimonial/testi-shape2.png" />
                <div className="box-profile">
                  <div className="box-author">
                    <img src="assets/img/testimonial/testi_2_2.png" alt="Avater" />
                  </div>
                  <div className="box-quote"><img src="assets/img/icon/quote4.svg" alt /></div>
                </div>
                <p className="box-text">The collaborative approach they took was refreshing and effective</p>
                <div className="box-info">
                  <h3 className="box-title">John Peter</h3>
                  <span className="box-desig">Product Manager, Innovatech</span>
                </div>
              </div>
            </div>
            <div className="swiper-slide">
              <div className="testi-box2">
                <div className="testi-overlay" data-bg-src="assets/img/testimonial/testi-shape2.png" />
                <div className="box-profile">
                  <div className="box-author">
                    <img src="assets/img/testimonial/testi_2_3.png" alt="Avater" />
                  </div>
                  <div className="box-quote"><img src="assets/img/icon/quote4.svg" alt /></div>
                </div>
                <p className="box-text">The collaborative approach they took was refreshing and effective</p>
                <div className="box-info">
                  <h3 className="box-title">Mark Rivas</h3>
                  <span className="box-desig">Lead Developer, TechScribe</span>
                </div>
              </div>
            </div>
            <div className="swiper-slide">
              <div className="testi-box2">
                <div className="testi-overlay" data-bg-src="assets/img/testimonial/testi-shape2.png" />
                <div className="box-profile">
                  <div className="box-author">
                    <img src="assets/img/testimonial/testi_2_1.png" alt="Avater" />
                  </div>
                  <div className="box-quote"><img src="assets/img/icon/quote4.svg" alt /></div>
                </div>
                <p className="box-text">The collaborative approach they took was refreshing and effective</p>
                <div className="box-info">
                  <h3 className="box-title">Jems Colin</h3>
                  <span className="box-desig">CTO, Ailitic</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>{/*==============================
Blog Area  
==============================*/}
  <section className="overflow-hidden space" id="blog-sec">
    <div className="container">
      <div className="title-area text-center">
        <span className="sub-title style3 text-anime-style-2">[ Technology Exploration ]</span>
        <h2 className="sec-title h3 text-anime-style-3">Research Insights &amp; Updates</h2>
      </div>
      <div className="slider-area">
        <div className="swiper th-slider has-shadow" id="blogSlider2" data-slider-options="{&quot;loop&quot;:false,&quot;mousewheel&quot;: {&quot;enabled&quot;: true,&quot;sensitivity&quot;: 4, &quot;releaseOnEdges&quot;:true},&quot;breakpoints&quot;:{&quot;0&quot;:{&quot;slidesPerView&quot;:1},&quot;576&quot;:{&quot;slidesPerView&quot;:&quot;1&quot;},&quot;768&quot;:{&quot;slidesPerView&quot;:&quot;1&quot;},&quot;992&quot;:{&quot;slidesPerView&quot;:&quot;2&quot;},&quot;1200&quot;:{&quot;slidesPerView&quot;:&quot;3&quot;}}}">
          <div className="swiper-wrapper">
            <div className="swiper-slide">
              <div className="blog-card style2 wow fadeInUp">
                <div className="box-img global-img">
                  <img src="assets/img/blog/blog_2_1.jpg" alt="blog image" />
                </div>
                <div className="box-content">
                  <div className="blog-meta">
                    <a href="/blog"> Jan 20, 2025</a>
                  </div>
                  <h3 className="box-title"><a href="/blog-details">Latest AR enhances customer engagement daily</a></h3>
                </div>
              </div>
            </div>
            <div className="swiper-slide">
              <div className="blog-card style2 wow fadeInUp">
                <div className="box-img global-img">
                  <img src="assets/img/blog/blog_2_2.jpg" alt="blog image" />
                </div>
                <div className="box-content">
                  <div className="blog-meta">
                    <a href="/blog"> Jan 22, 2025</a>
                  </div>
                  <h3 className="box-title"><a href="/blog-details">Transforming legal document review by aI</a></h3>
                </div>
              </div>
            </div>
            <div className="swiper-slide">
              <div className="blog-card style2 wow fadeInUp">
                <div className="box-img global-img">
                  <img src="assets/img/blog/blog_2_3.jpg" alt="blog image" />
                </div>
                <div className="box-content">
                  <div className="blog-meta">
                    <a href="/blog"> Jan 23, 2025</a>
                  </div>
                  <h3 className="box-title"><a href="/blog-details">Open-Source LLMs: The Future of AI technology</a></h3>
                </div>
              </div>
            </div>
            <div className="swiper-slide">
              <div className="blog-card style2 wow fadeInUp">
                <div className="box-img global-img">
                  <img src="assets/img/blog/blog_2_1.jpg" alt="blog image" />
                </div>
                <div className="box-content">
                  <div className="blog-meta">
                    <a href="/blog"> Jan 25, 2025</a>
                  </div>
                  <h3 className="box-title"><a href="/blog-details">Latest AR enhances customer engagement daily</a></h3>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="icon-box mt-60 d-flex justify-content-center">
          <button data-slider-prev="#blogSlider2" className="slider-arrow default slider-prev"><img src="assets/img/icon/arrow-left2.svg" alt /></button>
          <button data-slider-next="#blogSlider2" className="slider-arrow default slider-next"><img src="assets/img/icon/arrow-right2.svg" alt /></button>
        </div>
      </div>
    </div>
  </section>{/*==============================
	Footer Area
==============================*/}
  <footer className="footer-wrapper footer-layout1" data-bg-src="assets/img/bg/footer_bg_1.jpg">
    <div className="widget-area">
      <div className="container th-container5">
        <div className="footer-top">
          <h2 className="box-title text-white">Start Your AI Journey With Our Experts</h2>
          <div className>
            <form className="newsletter-form"><input className="form-control" type="email" placeholder="Enter your email to stay inform" required /> <button type="submit" className="th-btn">Start Free Trial <span className="icon"><img src="assets/img/icon/arrow-right.svg" alt /></span></button></form>
          </div>
        </div>
      </div>
      <div className="container th-container5">
        <div className="row gy-4 justify-content-between">
          <div className="col-md-6 col-xl-3">
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
    <div className="container th-container5">
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

export default Features;
    