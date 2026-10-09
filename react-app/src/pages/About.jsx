
import React, { useEffect } from 'react';

const About = () => {
    
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
        <h1 className="breadcumb-title text-anime-style-3">About Us</h1>
        <ul className="breadcumb-menu wow fadeInUp">
          <li><a href="/home-ai-startup">Home</a></li>
          <li>About Us</li>
        </ul>
      </div>
    </div>
  </div>{/*==============================
About Area  
==============================*/}
  <div className="overflow-hidden overflow-hidden space-top" id="about-sec">
    <div className="container th-container5">
      <div className="row gy-4">
        <div className="col-xl-8 mb-30 mb-xl-0">
          <div className="title-area mb-30">
            <span className="sub-title style3 text-anime-style-2">[ Our Story ]</span>
            <h2 className="sec-title style2 text-anime-style-3">Aior AI Startup is <span className="d-block">Empowering
                Every Industry <span className="d-block">by Trusworthy</span></span></h2>
          </div>
          <ul className="nav about-tab" id="aboutTab" role="tablist">
            <li className="nav-item" role="presentation">
              <a className="nav-link active" id="mission-tab" data-bs-toggle="tab" href="#mission" role="tab" aria-controls="mission" aria-selected="false">Mission</a>
            </li>
            <li className="nav-item" role="presentation">
              <a className="nav-link" id="vision-tab" data-bs-toggle="tab" href="#vision" role="tab" aria-controls="vision" aria-selected="false">Vision</a>
            </li>
          </ul>
          <div className="tab-content" id="aboutTabContent">
            <div className="tab-pane fade show active" id="mission" role="tabpanel" aria-labelledby="mission-tab">
              <p className="about-text">Aior Inspire Platform is a full-stack AI platform for enterprise. From GPU
                cloud
                management, job scheduling, model training, inference, to agent building, its one-stop
                toolchain empowers industries to develop and deploy their own AI models, unleashing
                signiﬁcant potential for businesses to adopt AI. </p>
            </div>
            <div className="tab-pane fade" id="vision" role="tabpanel" aria-labelledby="vision-tab">
              <p className="about-text">Our vision is to empower enterprises worldwide with a unified AI ecosystem
                that
                simplifies innovation, accelerates deployment, and democratizes artificial intelligence.
                Through an end-to-end full-stack AI platform, Aior Inspire aims to enable businesses to
                seamlessly build, scale, and deploy intelligent solutions—driving sustainable growth,
                operational excellence, and a smarter future powered by AI.</p>
            </div>
          </div>
          <div className="btn-group mt-50">
            <a href="/about" className="th-btn">Learn More <span className="icon"><img src="assets/img/icon/arrow-right.svg" alt /></span></a>
          </div>
          <div className="img-box2">
            <div className="img1">
              <img src="assets/img/normal/about_2_1.jpg" alt="About" />
              <div className="th-experience wow fadeInUp" data-wow-delay=".4s">
                <div className="th-experience_content">
                  <h2 className="experience-year"><span className="counter-number">65</span>+</h2>
                  <p className="experience-text">Successful Projects</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-4">
          <div className>
            <div className="img-box3">
              <div className="img1 image scale">
                <img src="assets/img/normal/about_1_2.jpg" alt="About" />
              </div>
              <div className="img2">
                <img src="assets/img/normal/about_1_1.png" alt="About" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="shape-mockup d-none d-lg-block spin" data-top="30%" data-right="40%"><img src="assets/img/shape/circle-1.png" alt /></div>
  </div>{/*==============================
history Area  
==============================*/}
  <section className="space overflow-hidden position-relative space-top">
    <div className="container th-container5">
      <div className="title-area text-center">
        <span className="sub-title style3 text-anime-style-2">[ Timeline ]</span>
        <h2 className="sec-title style2 text-anime-style-3">Highlights Over The Years</h2>
      </div>
      <div className="row gy-4 flex-row-reverse">
        <div className="col-xl-2">
          <ul className="nav timing-tab" id="historyTab" role="tablist">
            <li className="nav-item" role="presentation">
              <a className="nav-link active" id="year1-tab" data-bs-toggle="tab" href="#year1" role="tab" aria-controls="year1" aria-selected="false">2009</a>
            </li>
            <li className="nav-item" role="presentation">
              <a className="nav-link" id="year2-tab" data-bs-toggle="tab" href="#year2" role="tab" aria-controls="year2" aria-selected="false">2012</a>
            </li>
            <li className="nav-item" role="presentation">
              <a className="nav-link" id="year3-tab" data-bs-toggle="tab" href="#year3" role="tab" aria-controls="year3" aria-selected="false">2014</a>
            </li>
            <li className="nav-item" role="presentation">
              <a className="nav-link" id="year4-tab" data-bs-toggle="tab" href="#year4" role="tab" aria-controls="year4" aria-selected="false">2016</a>
            </li>
            <li className="nav-item" role="presentation">
              <a className="nav-link" id="year5-tab" data-bs-toggle="tab" href="#year5" role="tab" aria-controls="year5" aria-selected="false">2018</a>
            </li>
            <li className="nav-item" role="presentation">
              <a className="nav-link" id="year6-tab" data-bs-toggle="tab" href="#year6" role="tab" aria-controls="year6" aria-selected="false">2022</a>
            </li>
            <li className="nav-item" role="presentation">
              <a className="nav-link" id="year7-tab" data-bs-toggle="tab" href="#year7" role="tab" aria-controls="year7" aria-selected="false">2024</a>
            </li>
            <li className="nav-item" role="presentation">
              <a className="nav-link" id="year8-tab" data-bs-toggle="tab" href="#year8" role="tab" aria-controls="year8" aria-selected="false">2026</a>
            </li>
          </ul>
        </div>
        <div className="col-xl-10">
          <div className="tab-content" id="historyTabContent">
            <div className="tab-pane fade show active" id="year1" role="tabpanel" aria-labelledby="year1-tab">
              <div className="history-list-area">
                <div className="history-list-wrap active">
                  <div className="history-list" data-bg-src="assets/img/normal/history_1_1.jpg">
                    <span className="icon-btn"><i className="fa-sharp fa-regular fa-plus" /></span>
                  </div>
                </div>
                <div className="history-list-wrap">
                  <div className="history-list" data-bg-src="assets/img/normal/history_1_2.jpg">
                    <span className="icon-btn"><i className="fa-sharp fa-regular fa-plus" /></span>
                  </div>
                </div>
                <div className="history-list-wrap">
                  <div className="history-list" data-bg-src="assets/img/normal/history_1_3.jpg">
                    <span className="icon-btn"><i className="fa-sharp fa-regular fa-plus" /></span>
                  </div>
                </div>
                <div className="history-list-wrap">
                  <div className="history-list" data-bg-src="assets/img/normal/history_1_4.jpg">
                    <span className="icon-btn"><i className="fa-sharp fa-regular fa-plus" /></span>
                  </div>
                </div>
                <div className="history-list-wrap">
                  <div className="history-list" data-bg-src="assets/img/normal/history_1_5.jpg">
                    <span className="icon-btn"><i className="fa-sharp fa-regular fa-plus" /></span>
                  </div>
                </div>
              </div>
            </div>
            <div className="tab-pane fade" id="year2" role="tabpanel" aria-labelledby="year2-tab">
              <div className="history-list-area">
                <div className="history-list-wrap active">
                  <div className="history-list" data-bg-src="assets/img/normal/history_1_1.jpg">
                    <span className="icon-btn"><i className="fa-sharp fa-regular fa-plus" /></span>
                  </div>
                </div>
                <div className="history-list-wrap">
                  <div className="history-list" data-bg-src="assets/img/normal/history_1_2.jpg">
                    <span className="icon-btn"><i className="fa-sharp fa-regular fa-plus" /></span>
                  </div>
                </div>
                <div className="history-list-wrap">
                  <div className="history-list" data-bg-src="assets/img/normal/history_1_3.jpg">
                    <span className="icon-btn"><i className="fa-sharp fa-regular fa-plus" /></span>
                  </div>
                </div>
                <div className="history-list-wrap">
                  <div className="history-list" data-bg-src="assets/img/normal/history_1_4.jpg">
                    <span className="icon-btn"><i className="fa-sharp fa-regular fa-plus" /></span>
                  </div>
                </div>
                <div className="history-list-wrap">
                  <div className="history-list" data-bg-src="assets/img/normal/history_1_5.jpg">
                    <span className="icon-btn"><i className="fa-sharp fa-regular fa-plus" /></span>
                  </div>
                </div>
              </div>
            </div>
            <div className="tab-pane fade" id="year3" role="tabpanel" aria-labelledby="year3-tab">
              <div className="history-list-area">
                <div className="history-list-wrap active">
                  <div className="history-list" data-bg-src="assets/img/normal/history_1_1.jpg">
                    <span className="icon-btn"><i className="fa-sharp fa-regular fa-plus" /></span>
                  </div>
                </div>
                <div className="history-list-wrap">
                  <div className="history-list" data-bg-src="assets/img/normal/history_1_2.jpg">
                    <span className="icon-btn"><i className="fa-sharp fa-regular fa-plus" /></span>
                  </div>
                </div>
                <div className="history-list-wrap">
                  <div className="history-list" data-bg-src="assets/img/normal/history_1_3.jpg">
                    <span className="icon-btn"><i className="fa-sharp fa-regular fa-plus" /></span>
                  </div>
                </div>
                <div className="history-list-wrap">
                  <div className="history-list" data-bg-src="assets/img/normal/history_1_4.jpg">
                    <span className="icon-btn"><i className="fa-sharp fa-regular fa-plus" /></span>
                  </div>
                </div>
                <div className="history-list-wrap">
                  <div className="history-list" data-bg-src="assets/img/normal/history_1_5.jpg">
                    <span className="icon-btn"><i className="fa-sharp fa-regular fa-plus" /></span>
                  </div>
                </div>
              </div>
            </div>
            <div className="tab-pane fade" id="year4" role="tabpanel" aria-labelledby="year4-tab">
              <div className="history-list-area">
                <div className="history-list-wrap active">
                  <div className="history-list" data-bg-src="assets/img/normal/history_1_1.jpg">
                    <span className="icon-btn"><i className="fa-sharp fa-regular fa-plus" /></span>
                  </div>
                </div>
                <div className="history-list-wrap">
                  <div className="history-list" data-bg-src="assets/img/normal/history_1_2.jpg">
                    <span className="icon-btn"><i className="fa-sharp fa-regular fa-plus" /></span>
                  </div>
                </div>
                <div className="history-list-wrap">
                  <div className="history-list" data-bg-src="assets/img/normal/history_1_3.jpg">
                    <span className="icon-btn"><i className="fa-sharp fa-regular fa-plus" /></span>
                  </div>
                </div>
                <div className="history-list-wrap">
                  <div className="history-list" data-bg-src="assets/img/normal/history_1_4.jpg">
                    <span className="icon-btn"><i className="fa-sharp fa-regular fa-plus" /></span>
                  </div>
                </div>
                <div className="history-list-wrap">
                  <div className="history-list" data-bg-src="assets/img/normal/history_1_5.jpg">
                    <span className="icon-btn"><i className="fa-sharp fa-regular fa-plus" /></span>
                  </div>
                </div>
              </div>
            </div>
            <div className="tab-pane fade" id="year5" role="tabpanel" aria-labelledby="year5-tab">
              <div className="history-list-area">
                <div className="history-list-wrap active">
                  <div className="history-list" data-bg-src="assets/img/normal/history_1_1.jpg">
                    <span className="icon-btn"><i className="fa-sharp fa-regular fa-plus" /></span>
                  </div>
                </div>
                <div className="history-list-wrap">
                  <div className="history-list" data-bg-src="assets/img/normal/history_1_2.jpg">
                    <span className="icon-btn"><i className="fa-sharp fa-regular fa-plus" /></span>
                  </div>
                </div>
                <div className="history-list-wrap">
                  <div className="history-list" data-bg-src="assets/img/normal/history_1_3.jpg">
                    <span className="icon-btn"><i className="fa-sharp fa-regular fa-plus" /></span>
                  </div>
                </div>
                <div className="history-list-wrap">
                  <div className="history-list" data-bg-src="assets/img/normal/history_1_4.jpg">
                    <span className="icon-btn"><i className="fa-sharp fa-regular fa-plus" /></span>
                  </div>
                </div>
                <div className="history-list-wrap">
                  <div className="history-list" data-bg-src="assets/img/normal/history_1_5.jpg">
                    <span className="icon-btn"><i className="fa-sharp fa-regular fa-plus" /></span>
                  </div>
                </div>
              </div>
            </div>
            <div className="tab-pane fade" id="year6" role="tabpanel" aria-labelledby="year6-tab">
              <div className="history-list-area">
                <div className="history-list-wrap active">
                  <div className="history-list" data-bg-src="assets/img/normal/history_1_1.jpg">
                    <span className="icon-btn"><i className="fa-sharp fa-regular fa-plus" /></span>
                  </div>
                </div>
                <div className="history-list-wrap">
                  <div className="history-list" data-bg-src="assets/img/normal/history_1_2.jpg">
                    <span className="icon-btn"><i className="fa-sharp fa-regular fa-plus" /></span>
                  </div>
                </div>
                <div className="history-list-wrap">
                  <div className="history-list" data-bg-src="assets/img/normal/history_1_3.jpg">
                    <span className="icon-btn"><i className="fa-sharp fa-regular fa-plus" /></span>
                  </div>
                </div>
                <div className="history-list-wrap">
                  <div className="history-list" data-bg-src="assets/img/normal/history_1_4.jpg">
                    <span className="icon-btn"><i className="fa-sharp fa-regular fa-plus" /></span>
                  </div>
                </div>
                <div className="history-list-wrap">
                  <div className="history-list" data-bg-src="assets/img/normal/history_1_5.jpg">
                    <span className="icon-btn"><i className="fa-sharp fa-regular fa-plus" /></span>
                  </div>
                </div>
              </div>
            </div>
            <div className="tab-pane fade" id="year7" role="tabpanel" aria-labelledby="year7-tab">
              <div className="history-list-area">
                <div className="history-list-wrap active">
                  <div className="history-list" data-bg-src="assets/img/normal/history_1_1.jpg">
                    <span className="icon-btn"><i className="fa-sharp fa-regular fa-plus" /></span>
                  </div>
                </div>
                <div className="history-list-wrap">
                  <div className="history-list" data-bg-src="assets/img/normal/history_1_2.jpg">
                    <span className="icon-btn"><i className="fa-sharp fa-regular fa-plus" /></span>
                  </div>
                </div>
                <div className="history-list-wrap">
                  <div className="history-list" data-bg-src="assets/img/normal/history_1_3.jpg">
                    <span className="icon-btn"><i className="fa-sharp fa-regular fa-plus" /></span>
                  </div>
                </div>
                <div className="history-list-wrap">
                  <div className="history-list" data-bg-src="assets/img/normal/history_1_4.jpg">
                    <span className="icon-btn"><i className="fa-sharp fa-regular fa-plus" /></span>
                  </div>
                </div>
                <div className="history-list-wrap">
                  <div className="history-list" data-bg-src="assets/img/normal/history_1_5.jpg">
                    <span className="icon-btn"><i className="fa-sharp fa-regular fa-plus" /></span>
                  </div>
                </div>
              </div>
            </div>
            <div className="tab-pane fade" id="year8" role="tabpanel" aria-labelledby="year8-tab">
              <div className="history-list-area">
                <div className="history-list-wrap active">
                  <div className="history-list" data-bg-src="assets/img/normal/history_1_1.jpg">
                    <span className="icon-btn"><i className="fa-sharp fa-regular fa-plus" /></span>
                  </div>
                </div>
                <div className="history-list-wrap">
                  <div className="history-list" data-bg-src="assets/img/normal/history_1_2.jpg">
                    <span className="icon-btn"><i className="fa-sharp fa-regular fa-plus" /></span>
                  </div>
                </div>
                <div className="history-list-wrap">
                  <div className="history-list" data-bg-src="assets/img/normal/history_1_3.jpg">
                    <span className="icon-btn"><i className="fa-sharp fa-regular fa-plus" /></span>
                  </div>
                </div>
                <div className="history-list-wrap">
                  <div className="history-list" data-bg-src="assets/img/normal/history_1_4.jpg">
                    <span className="icon-btn"><i className="fa-sharp fa-regular fa-plus" /></span>
                  </div>
                </div>
                <div className="history-list-wrap">
                  <div className="history-list" data-bg-src="assets/img/normal/history_1_5.jpg">
                    <span className="icon-btn"><i className="fa-sharp fa-regular fa-plus" /></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="shape-mockup d-none d-xl-block movingX" data-top="20%" data-left="5%"><img src="assets/img/shape/element-6.png" alt /></div>
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
choose Area  
==============================*/}
  <div className="choose-area position-relative overflow-hidden space-top">
    <div className="container th-container5">
      <div className="row gy-4 justify-content-center">
        <div className="col-lg-6">
          <div className="choose-img-box">
            <div className="img1">
              <img src="assets/img/normal/choose-img-1.jpg" alt />
            </div>
            <div className="title-area mb-0">
              <span className="sub-title style3 text-white text-anime-style-2">[ Why Choose Us ]</span>
              <h2 className="sec-title h3 mb-0 text-white text-anime-style-3">The Optimal Blend of Tech, Products, Expertise, and Capital</h2>
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="choose-wrapper">
            <div className="choose-item">
              <div className="choose-content">
                <span className="box-subtitle">Trustworthy</span>
                <h3 className="box-number"><span className="counter-number">109</span>%</h3>
                <p className="box-text">Higher Than GPT 4 Turbo in Proofwriter</p>
              </div>
            </div>
            <div className="choose-item">
              <div className="choose-content">
                <span className="box-subtitle">Accrurate</span>
                <h3 className="box-number">No.0 <span className="counter-number">1</span></h3>
                <p className="box-text">Ranking in Aior Benchmark</p>
              </div>
            </div>
            <div className="choose-item">
              <div className="choose-content">
                <span className="box-subtitle">Scalable</span>
                <h3 className="box-number"><span className="counter-number">109</span>%</h3>
                <p className="box-text">From and efficient 5B to Powerful 185B</p>
              </div>
            </div>
            <div className="choose-item">
              <div className="choose-content">
                <span className="box-subtitle">Reliable</span>
                <h3 className="box-number"><span className="counter-number">99.9</span>%</h3>
                <p className="box-text">SLA Availability</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>{/*==============================
Team Area  
==============================*/}
  <section className="team-sec space-top overflow-hidden">
    <div className="container z-index-common">
      <div className="row justify-content-center">
        <div className="col-xl-9">
          <div className="title-area text-center pe-xl-5 ps-xl-5">
            <span className="sub-title style3 text-anime-style-2">[ Team Members ]</span>
            <h2 className="sec-title style2 text-anime-style-3">Meet the Innovators Behind Aior's AI and Robotics Team</h2>
          </div>
        </div>
      </div>
      <div className="row gy-3">
        {/* Single Item */}
        <div className="col-md-6 col-xl-4">
          <div className="th-team team-card">
            <div className="box-img">
              <img src="assets/img/team/team_1_1.png" alt="Team" />
              <div className="box-shape"><img src="assets/img/team/team-shape.png" alt /></div>
            </div>
            <div className="box-content">
              <div>
                <h3 className="box-title"><a href="/team-details">Jems Olive</a></h3>
                <span className="team-desig">Manager</span>
              </div>
              <div className="th-social">
                <a target="_blank" href="https://facebook.com/"><i className="fab fa-facebook-f" /></a>
                <a target="_blank" href="https://twitter.com/"><i className="fab fa-twitter" /></a>
                <a target="_blank" href="https://instagram.com/"><i className="fab fa-instagram" /></a>
                <a target="_blank" href="https://linkedin.com/"><i className="fab fa-linkedin-in" /></a>
              </div>
            </div>
          </div>
        </div>
        {/* Single Item */}
        <div className="col-md-6 col-xl-4">
          <div className="th-team team-card">
            <div className="box-img">
              <img src="assets/img/team/team_1_2.png" alt="Team" />
              <div className="box-shape"><img src="assets/img/team/team-shape.png" alt /></div>
            </div>
            <div className="box-content">
              <div>
                <h3 className="box-title"><a href="/team-details">Anya Smith</a></h3>
                <span className="team-desig">Designer</span>
              </div>
              <div className="th-social">
                <a target="_blank" href="https://facebook.com/"><i className="fab fa-facebook-f" /></a>
                <a target="_blank" href="https://twitter.com/"><i className="fab fa-twitter" /></a>
                <a target="_blank" href="https://instagram.com/"><i className="fab fa-instagram" /></a>
                <a target="_blank" href="https://linkedin.com/"><i className="fab fa-linkedin-in" /></a>
              </div>
            </div>
          </div>
        </div>
        {/* Single Item */}
        <div className="col-md-6 col-xl-4">
          <div className="th-team team-card">
            <div className="box-img">
              <img src="assets/img/team/team_1_3.png" alt="Team" />
              <div className="box-shape"><img src="assets/img/team/team-shape.png" alt /></div>
            </div>
            <div className="box-content">
              <div>
                <h3 className="box-title"><a href="/team-details">Carlos Johnson</a></h3>
                <span className="team-desig">Developer</span>
              </div>
              <div className="th-social">
                <a target="_blank" href="https://facebook.com/"><i className="fab fa-facebook-f" /></a>
                <a target="_blank" href="https://twitter.com/"><i className="fab fa-twitter" /></a>
                <a target="_blank" href="https://instagram.com/"><i className="fab fa-instagram" /></a>
                <a target="_blank" href="https://linkedin.com/"><i className="fab fa-linkedin-in" /></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>{/*==============================
Testimonial Area  
==============================*/}
  <section className="overflow-hidden space" id="testi-sec">
    <div className="container">
      <div className="title-area text-center">
        <span className="sub-title style3 text-anime-style-2">[ Testimonials ]</span>
        <h2 className="sec-title h3 text-anime-style-3">What Our Clients Are Sayings</h2>
      </div>
      <div className="testiSlide">
        <div className="row gy-4 align-items-end">
          <div className="col-xl-6">
            <div className="swiper th-slider testiSlide4" id="testiSlide4" data-slider-options="{&quot;effect&quot;:&quot;fade&quot;,&quot;paginationType&quot;:&quot;fraction&quot;,&quot;spaceBetween&quot;:0,&quot;thumbs&quot;:{&quot;swiper&quot;:&quot;.testi-grid2-thumb&quot;},&quot;breakpoints&quot;:{&quot;0&quot;:{&quot;autoHeight&quot;:true},&quot;576&quot;:{&quot;autoHeight&quot;:false}}}">
              <div className="swiper-wrapper">
                <div className="swiper-slide">
                  <div className="testi-item_img">
                    <img src="assets/img/testimonial/single-image-1.jpg" alt />
                  </div>
                </div>
                <div className="swiper-slide">
                  <div className="testi-item_img">
                    <img src="assets/img/testimonial/single-image-2.jpg" alt />
                  </div>
                </div>
              </div>
              <div className="slider-controller">
                <div className="slider-pagination" data-slider-id="#testiSlide3" />
              </div>
              <div className="icon-box">
                <button data-slider-prev="#testiSlide4" className="slider-arrow style2 default slider-prev"><i className="fa-light fa-arrow-left" /></button>
                <button data-slider-next="#testiSlide4" className="slider-arrow style2 default slider-next"><i className="fa-light fa-arrow-right" /></button>
              </div>
              <div className="testi-wrapp">
                <div className="discount-wrapp">
                  <div className="box-quote"><img src="assets/img/icon/quote4.svg" alt /></div>
                  <div className="discount-tag">
                    <span className="discount-anime">TRUSTED BY AIOR’S CLIENT * TRUSTED BY AIOR’S CLIENT * TRUSTED**</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-6">
            <div className="swiper th-slider testi-grid2-thumb" data-slider-options="{&quot;effect&quot;:&quot;slide&quot;,&quot;slidesPerView&quot;:&quot;3&quot;,&quot;spaceBetween&quot;:32,&quot;breakpoints&quot;:{&quot;0&quot;:{&quot;slidesPerView&quot;:1}}}" data-slider-tab="#testiSlide4">
              <div className="swiper-wrapper">
                <div className="swiper-slide">
                  <div className="testi-item">
                    <div className="box-content">
                      <p className="box-text">“Aior's AI delivers unmatched precision and speed. After trying various cybersecurity solutions, we found none that compare. Their automated responses thwarted a significant data breach, and the compliance”</p>
                      <div className="box-profile">
                        <div className="box-author">
                          <img src="assets/img/testimonial/testi_3_1.png" alt="Avater" />
                        </div>
                        <div className="box-info">
                          <h2 className="box-title">Jems Colin</h2>
                          <span className="box-desig">CTO, Ailitic</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="swiper-slide">
                  <div className="testi-item">
                    <div className="box-content">
                      <p className="box-text">“Aior's AI delivers unmatched precision and speed. After trying various cybersecurity solutions, we found none that compare. Their automated responses thwarted a significant data breach, and the compliance”</p>
                      <div className="box-profile">
                        <div className="box-author">
                          <img src="assets/img/testimonial/testi_3_2.png" alt="Avater" />
                        </div>
                        <div className="box-info">
                          <h2 className="box-title">John Peter</h2>
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
      </div>
    </div>
    <div className="shape-mockup d-none d-lg-block movingX" data-top="10%" data-right="10%"><img src="assets/img/shape/element-3.png" alt /></div>
  </section>{/*==============================
Gallery Area  
==============================*/}
  <div className="overflow-hidden space-bottom">
    <div className="container">
      <div className="title-area text-center">
        <span className="sub-title style3 text-anime-style-2">[ Join Us ]</span>
        <h2 className="sec-title h3 text-anime-style-3">Discover Your Impact</h2>
      </div>
    </div>
    <div className>
      <div className="container-fluid p-0">
        <div className="swiper th-slider gallery-slider2" data-slider-options="{&quot;breakpoints&quot;:{&quot;0&quot;:{&quot;slidesPerView&quot;:&quot;2&quot;},&quot;992&quot;:{&quot;slidesPerView&quot;:&quot;4&quot;}},&quot;autoplay&quot;:{&quot;delay&quot;:0,&quot;disableOnInteraction&quot;:false},&quot;noSwiping&quot;:&quot;false&quot;,&quot;speed&quot;:10000,&quot;spaceBetween&quot;:24}">
          <div className="swiper-wrapper">
            <div className="swiper-slide">
              <div className="gallery-box">
                <div className="box-img global-img">
                  <img src="assets/img/gallery/gallery_2_1.jpg" alt="gallery image" />
                  <a href="assets/img/gallery/gallery_2_1.jpg" className="icon-btn th-popup-image"><i className="far fa-plus" /></a>
                </div>
              </div>
            </div>
            <div className="swiper-slide">
              <div className="gallery-box">
                <div className="box-img global-img">
                  <img src="assets/img/gallery/gallery_2_2.jpg" alt="gallery image" />
                  <a href="assets/img/gallery/gallery_2_2.jpg" className="icon-btn th-popup-image"><i className="far fa-plus" /></a>
                </div>
              </div>
            </div>
            <div className="swiper-slide">
              <div className="gallery-box">
                <div className="box-img global-img">
                  <img src="assets/img/gallery/gallery_2_3.jpg" alt="gallery image" />
                  <a href="assets/img/gallery/gallery_2_3.jpg" className="icon-btn th-popup-image"><i className="far fa-plus" /></a>
                </div>
              </div>
            </div>
            <div className="swiper-slide">
              <div className="gallery-box">
                <div className="box-img global-img">
                  <img src="assets/img/gallery/gallery_2_4.jpg" alt="gallery image" />
                  <a href="assets/img/gallery/gallery_2_4.jpg" className="icon-btn th-popup-image"><i className="far fa-plus" /></a>
                </div>
              </div>
            </div>
            <div className="swiper-slide">
              <div className="gallery-box">
                <div className="box-img global-img">
                  <img src="assets/img/gallery/gallery_2_5.jpg" alt="gallery image" />
                  <a href="assets/img/gallery/gallery_2_5.jpg" className="icon-btn th-popup-image"><i className="far fa-plus" /></a>
                </div>
              </div>
            </div>
            <div className="swiper-slide">
              <div className="gallery-box">
                <div className="box-img global-img">
                  <img src="assets/img/gallery/gallery_2_6.jpg" alt="gallery image" />
                  <a href="assets/img/gallery/gallery_2_6.jpg" className="icon-btn th-popup-image"><i className="far fa-plus" /></a>
                </div>
              </div>
            </div>
            <div className="swiper-slide">
              <div className="gallery-box">
                <div className="box-img global-img">
                  <img src="assets/img/gallery/gallery_2_3.jpg" alt="gallery image" />
                  <a href="assets/img/gallery/gallery_2_3.jpg" className="icon-btn th-popup-image"><i className="far fa-plus" /></a>
                </div>
              </div>
            </div>
            <div className="swiper-slide">
              <div className="gallery-box">
                <div className="box-img global-img">
                  <img src="assets/img/gallery/gallery_2_4.jpg" alt="gallery image" />
                  <a href="assets/img/gallery/gallery_2_4.jpg" className="icon-btn th-popup-image"><i className="far fa-plus" /></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>{/*==============================
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

export default About;
    