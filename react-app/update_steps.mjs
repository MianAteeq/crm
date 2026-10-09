import fs from 'fs';
let content = fs.readFileSync('src/pages/HomeAiChatbot.jsx', 'utf-8');

const replacement = `              <div className="col-lg-7">
                <div className="title-area text-center pe-xl-5 ps-xl-5">
                  <span className="sub-title style3 text-anime-style-2">[ How it works ]</span>
                  <h2 className="sec-title h3 text-anime-style-3">Your AI Assistant in 6 Easy Steps</h2>
                  <p className="fs-18 wow fadeInUp">From first touchpoint to final handoff — see exactly how our intelligent chatbot automates your customer journey seamlessly.
                  </p>
                </div>
              </div>
            </div>
            <hr className="process-line" />
            <div className="row gy-4 justify-content-center">
              {/* Step 1 */}
              <div className="col-md-6 col-xl-4 process-card_wrapp">
                <div className="process-card wow fadeInLeft" data-wow-delay=".2s">
                  <span className="number">01</span>
                  <div className="box-content">
                    <h2 className="box-title">Inbound Message</h2>
                    <p className="box-text">Customer texts your WhatsApp number or scans a QR code.</p>
                  </div>
                  <a href="#" className="icon-btn"><span className="icon"><img src="assets/img/icon/arrow-right.svg" alt="" /></span></a>
                </div>
              </div>
              {/* Step 2 */}
              <div className="col-md-6 col-xl-4 process-card_wrapp">
                <div className="process-card wow fadeInUp" data-wow-delay=".3s">
                  <span className="number">02</span>
                  <div className="box-content">
                    <h2 className="box-title">AI Context Engine</h2>
                    <p className="box-text">Instantly analyzes context, language, and purchasing intent.</p>
                  </div>
                  <a href="#" className="icon-btn"><span className="icon"><img src="assets/img/icon/arrow-right.svg" alt="" /></span></a>
                </div>
              </div>
              {/* Step 3 */}
              <div className="col-md-6 col-xl-4 process-card_wrapp">
                <div className="process-card wow fadeInRight" data-wow-delay=".4s">
                  <span className="number">03</span>
                  <div className="box-content">
                    <h2 className="box-title">Interactive Reply</h2>
                    <p className="box-text">Fires back personalized replies with WhatsApp buttons & lists.</p>
                  </div>
                  <a href="#" className="icon-btn"><span className="icon"><img src="assets/img/icon/arrow-right.svg" alt="" /></span></a>
                </div>
              </div>
              {/* Step 4 */}
              <div className="col-md-6 col-xl-4 process-card_wrapp">
                <div className="process-card wow fadeInLeft" data-wow-delay=".5s">
                  <span className="number">04</span>
                  <div className="box-content">
                    <h2 className="box-title">In-Chat Booking</h2>
                    <p className="box-text">Customer books a meeting slot directly within the chat window.</p>
                  </div>
                  <a href="#" className="icon-btn"><span className="icon"><img src="assets/img/icon/arrow-right.svg" alt="" /></span></a>
                </div>
              </div>
              {/* Step 5 */}
              <div className="col-md-6 col-xl-4 process-card_wrapp">
                <div className="process-card wow fadeInUp" data-wow-delay=".6s">
                  <span className="number">05</span>
                  <div className="box-content">
                    <h2 className="box-title">CRM Sync</h2>
                    <p className="box-text">Automatically logs the lead, tags intent, and updates your CRM.</p>
                  </div>
                  <a href="#" className="icon-btn"><span className="icon"><img src="assets/img/icon/arrow-right.svg" alt="" /></span></a>
                </div>
              </div>
              {/* Step 6 */}
              <div className="col-md-6 col-xl-4 process-card_wrapp">
                <div className="process-card wow fadeInRight" data-wow-delay=".7s">
                  <span className="number">06</span>
                  <div className="box-content">
                    <h2 className="box-title">Smart Handoff</h2>
                    <p className="box-text">Routes complex or high-value chats to human agents seamlessly.</p>
                  </div>
                  <a href="#" className="icon-btn"><span className="icon"><img src="assets/img/icon/arrow-right.svg" alt="" /></span></a>
                </div>
              </div>
            </div>
            <hr className="process-line" />
          </div>`;

const lines = content.split('\n');
let startIndex = -1;
let endIndex = -1;

for(let i=0; i<lines.length; i++) {
  if (lines[i].includes('<div className="col-lg-7">') && lines[i+1] && lines[i+1].includes('title-area text-center') && lines[i+2].includes('[ How it works ]')) {
    startIndex = i;
  }
  if (startIndex !== -1 && i > startIndex + 10 && lines[i].includes('<hr className="process-line" />') && lines[i+1].includes('</div>') && lines[i+2].includes('</section>')) {
    endIndex = i + 1; // replace up to the closing container div before section
    break;
  }
}

if (startIndex !== -1 && endIndex !== -1) {
  lines.splice(startIndex, endIndex - startIndex + 1, replacement);
  fs.writeFileSync('src/pages/HomeAiChatbot.jsx', lines.join('\n'));
  console.log('Successfully updated the process section to 6 steps!');
} else {
  console.log('Indices not found:', startIndex, endIndex);
}
