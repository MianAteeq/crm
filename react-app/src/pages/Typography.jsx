
import React, { useEffect } from 'react';

const Typography = () => {
    
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
  <div className="space ">
    <div className="h1 text-center mt-4">Colors</div>
    <div className="container mb-5">
      <div className="row">
        <div className="col-xl-2">
          <div className="p-4 text-white text-center" style={{backgroundColor: 'var(--theme-color)'}}>Theme Color</div>
        </div>
        <div className="col-xl-2">
          <div className="p-4 text-white text-center" style={{backgroundColor: 'var(--theme-color)'}}>Theme Color 2</div>
        </div>
        <div className="col-xl-2">
          <div className="p-4 text-white text-center" style={{backgroundColor: 'var(--title-color)'}}>Title Color</div>
        </div>
        <div className="col-xl-2">
          <div className="p-4 text-white text-center" style={{backgroundColor: 'var(--body-color)'}}>Body Color</div>
        </div>
        <div className="col-xl-2">
          <div className="p-4 text-white text-center" style={{backgroundColor: 'var(--gray-color)'}}>Gray Color</div>
        </div>
        <div className="col-xl-2">
          <div className="p-4 text-white text-center" style={{backgroundColor: 'var(--smoke-color)'}}>Smoke Color</div>
        </div>
      </div>
    </div>
    <div className="h1 text-center mt-4">Container</div>
    <div className="container mb-5">
      <div className="bg-dark py-2">
        <div className="h1 text-center text-white">row</div>
        <div className="row">
          <div className="col-4 ">
            <div className="py-5 bg-secondary text-white text-center">column</div>
          </div>
          <div className="col-4 ">
            <div className="py-5 bg-secondary text-white text-center">column</div>
          </div>
          <div className="col-4 ">
            <div className="py-5 bg-secondary text-white text-center">column</div>
          </div>
        </div>
      </div>
    </div>
    <div className="container">
      <h1>Lorem ipsum dolor sit amet</h1>
      <h2>Lorem ipsum dolor sit amet</h2>
      <h3>Lorem ipsum dolor sit amet</h3>
      <h4>Lorem ipsum dolor sit amet</h4>
      <h5>Lorem ipsum dolor sit amet</h5>
      <h6>Lorem ipsum dolor sit amet</h6>
      <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Minus labore, expedita numquam similique odio tempora quo aperiam ipsa quibusdam laboriosam mollitia suscipit! Ullam ipsa maiores magnam soluta adipisci praesentium esse similique quae molestias? Nostrum pariatur voluptatibus veritatis soluta nesciunt quo praesentium. Dolorem vitae deleniti doloremque facere, eaque harum aspernatur dolore hic minus veniam sit expedita sapiente maiores accusantium quo repellendus obcaecati exercitationem labore fugiat! Qui eveniet earum esse delectus quis aspernatur? Vel, voluptatem dolorem possimus ea qui facere. Sapiente cumque id animi veritatis similique quidem consequatur, incidunt natus quis. Recusandae dolorem minus, obcaecati esse ipsam architecto et eius voluptatem ducimus.</p>
      <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Minus labore, expedita numquam similique odio tempora quo aperiam ipsa quibusdam laboriosam mollitia suscipit! Ullam ipsa maiores magnam soluta adipisci praesentium esse similique quae molestias? Nostrum pariatur voluptatibus veritatis soluta nesciunt quo praesentium. Dolorem vitae deleniti doloremque facere, eaque harum aspernatur dolore hic minus veniam sit expedita sapiente maiores accusantium quo repellendus obcaecati exercitationem labore fugiat! Qui eveniet earum esse delectus quis aspernatur? Vel, voluptatem dolorem possimus ea qui facere. Sapiente cumque id animi veritatis similique quidem consequatur, incidunt natus quis. Recusandae dolorem minus, obcaecati esse ipsam architecto et eius voluptatem ducimus.</p>
      <h2>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem, aspernatur, eius fugit modi veniam inventore sequi necessitatibus laborum deserunt debitis porro veritatis fugiat ipsa commodi est atque ab quasi! Tempora, eaque facilis id molestias libero hic dolore quos, vitae blanditiis veritatis iure rem. Voluptate nostrum quasi nam error nobis est.</h2>
      <h4>table style</h4>
      <table>
        <thead>
          <tr>
            <th><a href="#">This is a link</a></th>
            <th>Table Title</th>
            <th>Table Title</th>
            <th>Table Title</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>Table title</th>
            <td><a href="#">This is a link</a></td>
            <td>Table Data</td>
            <td>Table Data</td>
          </tr>
          <tr>
            <th>Table title</th>
            <td>Table Data</td>
            <td>Table Data</td>
            <td>Table Data</td>
          </tr>
          <tr>
            <th>Table title</th>
            <td>Table Data</td>
            <td>Table Data</td>
            <td>Table Data</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td>table footer data</td>
            <td>table footer data</td>
            <td>table footer data</td>
            <td>table footer data</td>
          </tr>
        </tfoot>
      </table>
      <h4>blockquote style</h4>
      <blockquote>
        <p>Stay hungry. Stay foolish.</p>
      </blockquote>
      <h4>Nested links</h4>
      <h3><a href="#">This is a link in title</a></h3>
      <h1><a href="#" className="text-inherit">Inherit link in title</a></h1>
      <h2><a href="#" className="text-reset">reset link in title</a></h2>
      <p><a href="#">link in paragraph</a></p>
      <h4>List styles</h4>
      <ul>
        <li>List item one
          <ul>
            <li>List item one
              <ul>
                <li>List item one</li>
                <li>List item two</li>
                <li>List item three</li>
                <li>List item four</li>
              </ul>
            </li>
            <li>List item two</li>
            <li>List item three
              <ol>
                <li>List item two</li>
                <li>List item three</li>
                <li>List item four</li>
              </ol>
            </li>
            <li>List item four</li>
          </ul>
        </li>
        <li>List item two</li>
        <li>List item three</li>
        <li>List item four</li>
      </ul>
      <ol>
        <li>List item one
          <ol reversed="reversed">
            <li>List item one -reversed attribute</li>
            <li>List item two</li>
            <li>List item three</li>
            <li>List item four</li>
          </ol>
        </li>
        <li>List item two</li>
        <li>List item three</li>
        <li>List item four</li>
      </ol>
      <ol>
        <li>List item one
          <ul>
            <li>List item one</li>
            <li>List item two</li>
            <li>List item three</li>
            <li>List item four</li>
          </ul>
        </li>
        <li>List item two</li>
      </ol>
      <h4>Input Styles</h4>
      <div className="row">
        <div className="form-group col-lg-6 has-label">
          <label htmlFor="text">Company name (optional)*</label>
          <input type="text" id="text" placeholder="Enter Your Name" />
        </div>
        <div className="form-group col-lg-6 has-label">
          <label htmlFor="text2">Company name (optional)*</label>
          <input type="text" id="text2" placeholder="Enter Your Name" />
          <i className="fal fa-user" />
        </div>
        <div className="form-group col-lg-6">
          <input type="text" placeholder="Enter Your Name" />
          <i className="fal fa-user" />
        </div>
        <div className="form-group col-lg-6">
          <input type="text" placeholder="Enter Your Name" />
          <i className="fal fa-user" />
        </div>
        <div className="form-group col-12">
          <select name="name" id="name">
            <option value selected disabled hidden>Select Subject</option>
            <option value>Option 1</option>
            <option value>Option 2</option>
            <option value>Option 3</option>
            <option value>Option 4</option>
          </select>
        </div>
        <div className="form-group col-12">
          <textarea name="textARea" id="textARea" cols={30} rows={10} placeholder="Write you message" defaultValue={""} />
          <i className="far fa-pencil" />
        </div>
        <div className="form-group col-12">
          <input type="checkbox" id="checkbox" name="checkbox" />
          <label htmlFor="checkbox">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Id, similique?</label>
        </div>
        <div className="form-group col-12">
          <div>
            <input type="radio" id="html" name="fav_language" defaultValue="HTML" />
            <label htmlFor="html">HTML</label>
          </div>
          <div>
            <input type="radio" id="css" name="fav_language" defaultValue="CSS" />
            <label htmlFor="css">CSS</label>
          </div>
          <div>
            <input type="radio" id="javascript" name="fav_language" defaultValue="JavaScript" /><label htmlFor="javascript">JavaScript</label>
          </div>
        </div>
      </div>
      <h4>Buttons Style</h4>
      <div className="p-5 mb-4 bg-light">
        <div className="row align-items-center gy-3 gx-3">
          <div className="col-auto"><a href="#" className="th-btn">Appointment</a></div>
          <div className="col-auto"><a href="#" className="th-btn">Appointment<i className="fal fa-arrow-right" /></a></div>
          <div className="col-auto"><a href="#" className="th-btn style2"><span className="btn-icon"><i className="far fa-plus" /></span><span className="btn-text">Register Now</span></a></div>
        </div>
      </div>
      <h4>Icon Button Style</h4>
      <div className="p-5 mb-4 bg-light">
        <div className="row align-items-center gy-3 gx-3">
          <div className="col-auto"><a href="#" className="icon-btn"><i className="fal fa-arrow-right" /></a></div>
          <div className="col-auto"><a href="#" className="icon-btn style2"><i className="fal fa-arrow-right" /></a></div>
          <div className="col-auto"><a href="#" className="icon-btn style3"><i className="fal fa-arrow-right" /></a></div>
          <div className="col-auto"><a href="#" className="icon-btn style1 btn-md"><i className="far fa-chevron-right" /></a></div>
          <div className="col-auto"><a href="#" className="icon-btn style2 btn-md"><i className="far fa-chevron-right" /></a></div>
          <div className="col-auto"><a href="#" className="icon-btn style3 btn-md"><i className="far fa-chevron-right" /></a></div>
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

export default Typography;
    