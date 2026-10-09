
import React, { useEffect } from 'react';

const Faq = () => {
    
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
        <h1 className="breadcumb-title text-anime-style-3">FAQ</h1>
        <ul className="breadcumb-menu wow fadeInUp">
          <li><a href="/home-ai-startup">Home</a></li>
          <li>FAQ</li>
        </ul>
      </div>
    </div>
  </div>{/*==============================
Faq Area
============================== */}
  <div className="faq-area position-relative overflow-hidden space" id="faq-sec">
    <div className="container">
      <div className="row gy-4 justify-content-between">
        <div className="col-xl-4">
          <div className="title-area mb-40">
            <span className="sub-title style3 text-anime-style-2">[ FAQ ]</span>
            <h2 className="sec-title text-anime-style-3">
              We’re Here To Answer All Your Questions
            </h2>
          </div>
          <div className="btn-group wow fadeInUp">
            <a href="/contact" className="th-btn">
              Contact Us
              <span className="icon">
                <img src="assets/img/icon/arrow-right.svg" alt />
              </span>
            </a>
          </div>
        </div>
        <div className="col-xl-7">
          <div className="faq-area2 me-xxl-5 pe-xxl-5">
            <div className="accordion-area accordion" id="faqAccordion">
              <div className="accordion-card  wow fadeInUp" data-wow-delay=".1s">
                <h3 className="accordion-header" id="heading-1">
                  <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-1" aria-expanded="false" aria-controls="collapse-1">
                    What are the plans? </button>
                </h3>
                <div id="collapse-1" className="accordion-collapse collapse " aria-labelledby="heading-1" data-bs-parent="#faqAccordion" role="region">
                  <div className="accordion-body">
                    <p className="faq-text">
                      For the most precise and current pricing details, we encourage
                      you to contact our amicable sales representatives.
                    </p>
                  </div>
                </div>
              </div>
              <div className="accordion-card active wow fadeInUp" data-wow-delay=".3s">
                <h3 className="accordion-header" id="heading-2">
                  <button className="accordion-button " type="button" data-bs-toggle="collapse" data-bs-target="#collapse-2" aria-expanded="true" aria-controls="collapse-2">
                    What features are included? </button>
                </h3>
                <div id="collapse-2" className="accordion-collapse collapse show" aria-labelledby="heading-2" data-bs-parent="#faqAccordion" role="region">
                  <div className="accordion-body">
                    <p className="faq-text">
                      For the most precise and current pricing details, we encourage
                      you to contact our amicable sales representatives.
                    </p>
                  </div>
                </div>
              </div>
              <div className="accordion-card  wow fadeInUp" data-wow-delay=".5s">
                <h3 className="accordion-header" id="heading-3">
                  <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-3" aria-expanded="false" aria-controls="collapse-3">
                    How does the first plan work? </button>
                </h3>
                <div id="collapse-3" className="accordion-collapse collapse " aria-labelledby="heading-3" data-bs-parent="#faqAccordion" role="region">
                  <div className="accordion-body">
                    <p className="faq-text">
                      For the most precise and current pricing details, we encourage
                      you to contact our amicable sales representatives.
                    </p>
                  </div>
                </div>
              </div>
              <div className="accordion-card  wow fadeInUp" data-wow-delay=".7s">
                <h3 className="accordion-header" id="heading-4">
                  <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-4" aria-expanded="false" aria-controls="collapse-4">
                    Can I cancel plans? </button>
                </h3>
                <div id="collapse-4" className="accordion-collapse collapse " aria-labelledby="heading-4" data-bs-parent="#faqAccordion" role="region">
                  <div className="accordion-body">
                    <p className="faq-text">
                      For the most precise and current pricing details, we encourage
                      you to contact our amicable sales representatives.
                    </p>
                  </div>
                </div>
              </div>
              <div className="accordion-card  wow fadeInUp" data-wow-delay=".8s">
                <h3 className="accordion-header" id="heading-5">
                  <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-5" aria-expanded="false" aria-controls="collapse-5">
                    Are there any special offers? </button>
                </h3>
                <div id="collapse-5" className="accordion-collapse collapse " aria-labelledby="heading-5" data-bs-parent="#faqAccordion" role="region">
                  <div className="accordion-body">
                    <p className="faq-text">
                      For the most precise and current pricing details, we encourage
                      you to contact our amicable sales representatives.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="faq-question wow fadeInUp" data-wow-delay=".9s">
              <h3 className="box-title">Still have questions?</h3>
              <p className="box-text2">
                Can’t find the answer you’re looking for? Please chat to our friendly team
              </p>
              <a href="mailto:help@aior.ai">help@aior.ai</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>{/*==============================
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
                    <option value="Bridal Makeup">Bridal Makeup</option>
                    <option value="Beard Treatments">Beard Treatments</option>
                    <option value="Hair Coloring">Hair Coloring</option>
                    <option value="Aromatherapy">Aromatherapy </option>
                  </select>
                </div>
                <div className="form-group col-12">
                  <textarea name="message" id="message" cols={30} rows={3} className="form-control" placeholder="Your Message" defaultValue={""} />
                </div>
                <div className="form-btn col-12">
                  <p className="box-text">By sending this form I confirm that I have read and accept the&nbsp;Privacy Policy</p>
                  <button className="th-btn">Send Message <span className="icon"><img src="assets/img/icon/arrow-right.svg" alt /></span></button>
                </div>
              </div>
              <p className="form-messages mb-0 mt-3" />
            </form>
          </div>
          <div className="col-xl-4">
            <div className="contact-review">
              <div className="box-profile">
                <div className="box-author">
                  <img src="assets/img/normal/author.png" alt="Avater" />
                </div>
                <div className="box-quote"><img src="assets/img/icon/quote3.svg" alt /></div>
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
  </section>
  <div className="position-relative space  overflow-hidden">
    <div className="marquee-content positive-relative overflow-hidden">
      <div className="marquee">
        <div className="marquee-group style6">
          <div className="item "><span>Empowering Every Industry By Trusworthy AIu</span></div>
          <div className="item"><span>Empowering Every Industry By Trusworthy AIus</span></div>
          <div className="item "><span>Empowering Every Industry By Trusworthy AIu</span></div>
          <div className="item"><span>Empowering Every Industry By Trusworthy AIu</span></div>
          <div className="item "><span>Empowering Every Industry By Trusworthy AIu</span></div>
          <div className="item"><span>Empowering Every Industry By Trusworthy AIus</span></div>
          <div className="item "><span>Empowering Every Industry By Trusworthy AIu</span></div>
          <div className="item"><span>Empowering Every Industry By Trusworthy AIu</span></div>
        </div>
        <div aria-hidden="true" className="marquee-group style6">
          <div className="item "><span>Empowering Every Industry By Trusworthy AIu</span></div>
          <div className="item"><span>Empowering Every Industry By Trusworthy AIus</span></div>
          <div className="item "><span>Empowering Every Industry By Trusworthy AIu</span></div>
          <div className="item"><span>Empowering Every Industry By Trusworthy AIu</span></div>
          <div className="item "><span>Empowering Every Industry By Trusworthy AIu</span></div>
          <div className="item"><span>Empowering Every Industry By Trusworthy AIus</span></div>
          <div className="item "><span>Empowering Every Industry By Trusworthy AIu</span></div>
          <div className="item"><span>Empowering Every Industry By Trusworthy AIu</span></div>
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

export default Faq;
    