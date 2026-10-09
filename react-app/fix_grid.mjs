import fs from 'fs';
let content = fs.readFileSync('src/pages/HomeAiChatbot.jsx', 'utf-8');

const replacement = `            <div className="row g-4 justify-content-center">
              <div className="col-lg-4 col-md-6">
                <div className="service-box wow fadeInUp" data-wow-delay=".1s">
                  <div className="box-wrapp">
                    <div className="box-img"><img src="assets/img/service/service_1_1.jpg" alt="" /></div>
                    <div className="box-content">
                      <div className="box-icon">
                        <img src="assets/img/icon/service_2_1.svg" alt="Icon" />
                      </div>
                      <h3 className="box-title"><a href="/case-studies-details">Tailored Solutions</a></h3>
                      <p className="box-text">From converting up to 44% of chats into sales and cutting support costs, to gaining
                        actionable insights for new strategies, brands in any industry.</p>
                      <a href="/case-studies" className="icon-btn"><span className="icon"><img src="assets/img/icon/arrow-right.svg" alt="" /></span></a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="service-box wow fadeInUp" data-wow-delay=".3s">
                  <div className="box-wrapp">
                    <div className="box-img"><img src="assets/img/service/service_1_2.jpg" alt="" /></div>
                    <div className="box-content">
                      <div className="box-icon">
                        <img src="assets/img/icon/service_2_2.svg" alt="Icon" />
                      </div>
                      <h3 className="box-title"><a href="/case-studies-details">Affordable Pricing</a></h3>
                      <p className="box-text">From converting up to 44% of chats into sales and cutting support costs, to gaining
                        actionable insights for new strategies, brands in any industry.</p>
                      <a href="/case-studies" className="icon-btn"><span className="icon"><img src="assets/img/icon/arrow-right.svg" alt="" /></span></a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="service-box wow fadeInUp" data-wow-delay=".5s">
                  <div className="box-wrapp">
                    <div className="box-img"><img src="assets/img/service/service_1_3.jpg" alt="" /></div>
                    <div className="box-content">
                      <div className="box-icon">
                        <img src="assets/img/icon/service_2_3.svg" alt="Icon" />
                      </div>
                      <h3 className="box-title"><a href="/case-studies-details">Customer Support</a></h3>
                      <p className="box-text">From converting up to 44% of chats into sales and cutting support costs, to gaining
                        actionable insights for new strategies, brands in any industry.</p>
                      <a href="/case-studies" className="icon-btn"><span className="icon"><img src="assets/img/icon/arrow-right.svg" alt="" /></span></a>
                    </div>
                  </div>
                </div>
              </div>
            </div>`;

const lines = content.split('\n');
let startIndex = -1;
let endIndex = -1;

for(let i=0; i<lines.length; i++) {
  if (lines[i].includes('className="swiper th-slider has-shadow serviceSlider"')) {
    startIndex = i;
  }
  if (startIndex !== -1 && lines[i].includes('data-slider-next="#serviceSlider"')) {
    endIndex = i + 2;
    break;
  }
}

if (startIndex !== -1 && endIndex !== -1) {
  lines.splice(startIndex, endIndex - startIndex + 1, replacement);
  fs.writeFileSync('src/pages/HomeAiChatbot.jsx', lines.join('\n'));
  console.log('Successfully replaced grid layout!');
} else {
  console.log('Indices not found:', startIndex, endIndex);
}
