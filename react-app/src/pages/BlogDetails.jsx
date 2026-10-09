
import React, { useEffect } from 'react';

const BlogDetails = () => {
    
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
        <h1 className="breadcumb-title text-anime-style-3">Optimize Robots.txt to guide search engines and promote growth.</h1>
        <ul className="breadcumb-menu wow fadeInUp">
          <li><a href="/home-ai-startup">Home</a></li>
          <li>Blog Details</li>
        </ul>
      </div>
    </div>
  </div>{/*==============================
  Blog Area
    ==============================*/}
  <section className="th-blog-wrapper blog-details overflow-hidden space-top space-extra-bottom">
    <div className="container">
      <div className="row">
        <div className="col-12">
          <div className="blog-wrapp">
            <div className="blog-content">
              <p className="blog-desc mb-60">The robots.txt file is one of the simplest yet most important tools
                in
                technical SEO. Done right, it helps search engines crawl your website efficiently, prevents
                crawl budget waste, and protects sensitive or irrelevant sections from being accessed by
                bots.
                Done wrong, it can block critical content, waste link value, or even deindex your entire
                site.
              </p>
              <div className="blog-meta">
                <a className href="/blog">AI Model</a>
                <a className href="/blog">Business</a>
                <a className href="/blog">Chatbot</a>
              </div>
            </div>
            <div className="right-text">
              <div className="blog-meta">
                <a className href="/blog">6 min read</a>
              </div>
              <div className="box-profile">
                <div className="box-author"><img src="assets/img/blog/author.jpg" alt="Avater" /></div>
                <div className="box-info">
                  <h2 className="h3 box-title">Michel Doe</h2>
                  <span className="box-desig">Team Leader of ADE</span>
                </div>
              </div>
            </div>
          </div>
          <div className="global-img th-radius mt-60 mb-60">
            <img data-animate="true" src="assets/img/blog/blog-s-1-1.jpg" alt />
          </div>
        </div>
      </div>
      <div className="row gx-40">
        <div className="col-xxl-8 col-lg-7">
          <div className="th-blog blog-single">
            <div className="blog-content">
              <div className="blog-meta">
                <a className="author" href="/blog"><i className="fa-solid fa-user" />by
                  Aior </a>
                <a href="/blog"><i className="fa-solid fa-comments" />(0) Comments</a>
              </div>
              <h2 className=" h3 blog-title">What is robots.txt?</h2>
              <p className="blog-desc">The robots.txt file is one of the simplest yet most important tools in
                technical SEO. Done right, it helps search engines crawl your website efficiently, prevents
                crawl budget waste, and protects sensitive or irrelevant sections from being accessed by
                bots. Done wrong, it can block critical content, waste link value, or even deindex your
                entire site. Robots.txt is a plain text file located at the root of your domain It gives
                instructions to search engine crawlers about which parts of your site they can or cannot
                crawl.
                It is part of the Robots Exclusion Protocol — a voluntary standard that major search engines
                like Google, Bing, and Yandex follow.</p>
              <p className="blog-desc">&nbsp;Important:&nbsp;Robots.txt controls crawling, not indexing. A page blocked in
                robots.txt can still be indexed if linked from other sites or included in your sitemap.</p>
              <blockquote>
                <p>Your robots.txt file should do just enough to guide search engines without
                  overcomplicating things. Blocking too much can accidentally hide important pages from
                  Google and hurt your rankings.</p>
                <cite>Michel Clarck</cite>
              </blockquote>
              <div className="row mt-60">
                <div className="col-md-auto mb-4">
                  <div className="global-img th-radius">
                    <img className="th-anim-img" data-animate="true" src="assets/img/blog/blog_inner_1.jpg" alt />
                  </div>
                </div>
                <div className="col-md-auto mb-4">
                  <div className="global-img th-radius">
                    <img data-animate="true" src="assets/img/blog/blog_inner_2.jpg" alt />
                  </div>
                </div>
              </div>
              <h3 className="h4">Why is robots.txt important for SEO?</h3>
              <ul className="p-0">
                <li>01. Crawl budget management:&nbsp;Search engines have limited time and resources to crawl
                  your site. Blocking nonessential URLs helps prioritize key content.</li>
                <li>02. Duplicate URL control:&nbsp;Prevents bots from crawling parameter URLs, internal
                  searches, or paginated duplicates.</li>
                <li>03. Cleaner index:&nbsp;Prevents unnecessary URLs from cluttering search results.</li>
                <li>04. Improved performance:&nbsp;Reduces server load by limiting bot access to resource-heavy
                  or irrelevant sections.</li>
              </ul>
              <h4>Best Practices for Robots.txt SEO</h4>
              <ul className="p-0">
                <li className="text-title fw-medium">1. Keep it simple and focused</li>
                <li className="text-body fw-normal">Your robots.txt file should do just enough to guide search engines without
                  overcomplicating things. Blocking too much can accidentally hide important pages from
                  Google and hurt your rankings. Focus only on what truly needs to be restricted for
                  better crawl efficiency.</li>
                <li className="text-title fw-medium">2. Do not block CSS or JavaScript</li>
                <li className="text-body fw-normal">Google needs to see your website the way users do. If you block CSS or JavaScript
                  files, Googlebot cannot fully understand your layout or features. That can hurt how your
                  site is ranked, especially when it comes to mobile friendliness or Core Web
                  Vitals.</li>
                <li className="text-title fw-medium">3. Use noindex, not robots.txt, to keep pages out of search
                  results.</li>
                <li className="text-body fw-normal">If you want to stop a page from showing up in search, blocking it in robots.txt won’t
                  do the job. Search engines might still index it if they find links to it. The right way
                  is to let the page be crawled and add a noindex meta tag or HTTP header.</li>
                <li className="text-title fw-medium">4. Always add your sitemap</li>
                <li className="text-body fw-normal">Point search engines to your sitemap right in your robots.txt file. This helps them
                  discover the pages you actually want indexed.</li>
              </ul>
              <h5 className="h4">Conslusion</h5>
              <p className="mt-10 mb-0 blog-desc">A well-configured robots.txt file improves crawl efficiency,
                protects sensitive sections, and supports SEO strategy. But it should always be part of a
                broader technical SEO plan — combined with noindex tags, canonicals, sitemaps, and internal
                linking. </p>
            </div>
          </div>
          <div className="th-comments-wrap ">
            <h2 className="blog-inner-title h4 fw-semibold"><i className="fa-solid fa-comments" />Comments (3)</h2>
            <ul className="comment-list">
              <li className="th-comment-item">
                <div className="th-post-comment">
                  <div className="comment-avater">
                    <img src="assets/img/blog/comment-author-1.jpg" alt="Comment Author" />
                  </div>
                  <div className="comment-content">
                    <h3 className="name">Adam Jhon</h3>
                    <span className="commented-on">25 Apr, 2025 08:56pm</span>
                    <p className="text">Through this blog, we aim to inspire readers to embrace healthcare as a lifelong priority and to advocate for quality medical care</p>
                    <div className="reply_and_edit">
                      <a href="/blog-details" className="reply-btn"><i className="fas fa-reply" />Reply</a>
                    </div>
                  </div>
                </div>
                <ul className="children">
                  <li className="th-comment-item">
                    <div className="th-post-comment">
                      <div className="comment-avater">
                        <img src="assets/img/blog/comment-author-2.jpg" alt="Comment Author" />
                      </div>
                      <div className="comment-content">
                        <h3 className="name">Jhon Abraham</h3>
                        <span className="commented-on">26 Apr, 2025 08:56pm</span>
                        <p className="text">Healthcare News and Trends: We provide updates on the latest developments and trends in the medical sector.</p>
                        <div className="reply_and_edit">
                          <a href="/blog-details" className="reply-btn"><i className="fas fa-reply" />Reply</a>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </li>
            </ul>
          </div> {/* Comment end */} {/* Comment Form */}
          <div className="th-comment-form ">
            <div className="form-title mb-25">
              <h3 className="blog-inner-title h4"><i className="fa-solid fa-reply" />Leave a Reply</h3>
              <p className="blog-text">Your email address will not be published. Required fields are marked</p>
            </div>
            <div className="row">
              <div className="col-md-6 form-group">
                <input type="text" placeholder="Full Name:" className="form-control" />
                <i className="fal fa-user" />
              </div>
              <div className="col-md-6 form-group">
                <input type="text" placeholder="Email:" className="form-control" />
                <i className="fal fa-envelope" />
              </div>
              <div className="col-12 form-group">
                <input type="text" placeholder="Website" className="form-control" />
                <i className="fal fa-globe" />
              </div>
              <div className="col-12 form-group">
                <textarea placeholder="Write a Comment*" className="form-control" defaultValue={""} />
                <i className="fa-regular fa-pencil" />
              </div>
              <div className="col-12 form-group">
                <input type="checkbox" id="html" />
                <label htmlFor="html">Save my name, email, and website in this browser for the next time I comment.</label>
              </div>
              <div className="col-12 form-group mb-0">
                <button className="th-btn">Submit Now <span className="icon"><img src="assets/img/icon/arrow-right.svg" alt /></span></button>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xxl-4 col-lg-5">
          <aside className="sidebar-area style2">
            <div className="widget widget_search  ">
              <form className="search-form">
                <input type="text" placeholder="Enter Keyword" />
                <button type="submit"><i className="far fa-search" /></button>
              </form>
            </div>
            <div className="widget  ">
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
            <div className="widget widget_categories  ">
              <h3 className="widget_title style2">Categories</h3>
              <ul>
                <li>
                  <a href="/blog">AI and Privacyness</a>
                </li>
                <li>
                  <a href="/blog">AI Applications</a>
                </li>
                <li>
                  <a href="/blog">AI Development</a>
                </li>
                <li>
                  <a href="/blog">AI Ethics</a>
                </li>
                <li>
                  <a href="/blog">Deep Learning</a>
                </li>
                <li>
                  <a href="/blog">Explainable AI</a>
                </li>
                <li>
                  <a href="/blog">Introduction to AI</a>
                </li>
                <li>
                  <a href="/blog">Machine Learning</a>
                </li>
              </ul>
            </div>
            <div className="widget widget_tag_cloud   ">
              <h3 className="widget_title style2">Tags</h3>
              <div className="tagcloud">
                <a href="/blog">Banner</a>
                <a href="/blog">DIgital</a>
                <a href="/blog">Logo</a>
                <a href="/blog">Supply</a>
                <a href="/blog">Technology</a>
                <a href="/blog">Branding</a>
              </div>
            </div>
            <div className="widget widget_download  ">
              <div className="donwload-media-wrap">
                <div className="download-media">
                  <a href="/about" className="download-media_btn"><img src="assets/img/icon/file.svg" alt /></a>
                  <span className="download-media_title">DOWNLOAD PDF FILEs</span>
                </div>
              </div>
            </div>
          </aside>
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

export default BlogDetails;
    