import fs from 'fs';
let content = fs.readFileSync('src/pages/HomeAiChatbot.jsx', 'utf-8');

const replacement = `            <div className="row g-4 justify-content-center">
              {/* Card 1 */}
              <div className="col-lg-4 col-md-6">
                <div style={{ display: 'flex', alignItems: 'stretch', backgroundColor: '#fff', borderRadius: '24px', padding: '12px', height: '100%', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.05)', position: 'relative' }}>
                  <div style={{ flex: '0 0 45%', position: 'relative' }}>
                    <img src="assets/img/service/service_chatbot_1.jpg" alt="Tailored Solutions" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px' }} />
                  </div>
                  <div style={{ flex: '1', padding: '12px 12px 40px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ marginBottom: '16px' }}>
                      <img src="assets/img/icon/service_2_1.svg" alt="Icon" style={{ width: '40px', height: '40px' }} />
                    </div>
                    <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#000', marginBottom: '8px', lineHeight: '1.2' }}>Tailored Solutions</h3>
                    <p style={{ fontSize: '12px', color: '#57534E', lineHeight: '1.6', margin: 0 }}>From converting up to 44% of chats into sales and cutting support costs, to gaining actionable insights.</p>
                  </div>
                  <a href="/case-studies" style={{ position: 'absolute', bottom: '16px', right: '16px', width: '36px', height: '36px', backgroundColor: '#F3F4F6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', transition: 'all 0.3s ease' }}>
                    <i className="fa-solid fa-chevron-right" style={{ fontSize: '12px' }}></i>
                  </a>
                </div>
              </div>

              {/* Card 2 */}
              <div className="col-lg-4 col-md-6">
                <div style={{ display: 'flex', alignItems: 'stretch', backgroundColor: '#fff', borderRadius: '24px', padding: '12px', height: '100%', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.05)', position: 'relative' }}>
                  <div style={{ flex: '0 0 45%', position: 'relative' }}>
                    <img src="assets/img/service/service_chatbot_2.jpg" alt="Affordable Pricing" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px' }} />
                  </div>
                  <div style={{ flex: '1', padding: '12px 12px 40px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ marginBottom: '16px' }}>
                      <img src="assets/img/icon/service_2_2.svg" alt="Icon" style={{ width: '40px', height: '40px' }} />
                    </div>
                    <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#000', marginBottom: '8px', lineHeight: '1.2' }}>Affordable Pricing</h3>
                    <p style={{ fontSize: '12px', color: '#57534E', lineHeight: '1.6', margin: 0 }}>From converting up to 44% of chats into sales and cutting support costs, to gaining actionable insights.</p>
                  </div>
                  <a href="/case-studies" style={{ position: 'absolute', bottom: '16px', right: '16px', width: '36px', height: '36px', backgroundColor: '#F3F4F6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', transition: 'all 0.3s ease' }}>
                    <i className="fa-solid fa-chevron-right" style={{ fontSize: '12px' }}></i>
                  </a>
                </div>
              </div>

              {/* Card 3 */}
              <div className="col-lg-4 col-md-6">
                <div style={{ display: 'flex', alignItems: 'stretch', backgroundColor: '#fff', borderRadius: '24px', padding: '12px', height: '100%', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.05)', position: 'relative' }}>
                  <div style={{ flex: '0 0 45%', position: 'relative' }}>
                    <img src="assets/img/service/service_chatbot_3.jpg" alt="Customer Support" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px' }} />
                  </div>
                  <div style={{ flex: '1', padding: '12px 12px 40px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ marginBottom: '16px' }}>
                      <img src="assets/img/icon/service_2_3.svg" alt="Icon" style={{ width: '40px', height: '40px' }} />
                    </div>
                    <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#000', marginBottom: '8px', lineHeight: '1.2' }}>Customer Support</h3>
                    <p style={{ fontSize: '12px', color: '#57534E', lineHeight: '1.6', margin: 0 }}>From converting up to 44% of chats into sales and cutting support costs, to gaining actionable insights.</p>
                  </div>
                  <a href="/case-studies" style={{ position: 'absolute', bottom: '16px', right: '16px', width: '36px', height: '36px', backgroundColor: '#F3F4F6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', transition: 'all 0.3s ease' }}>
                    <i className="fa-solid fa-chevron-right" style={{ fontSize: '12px' }}></i>
                  </a>
                </div>
              </div>
            </div>`;

const lines = content.split('\n');
let startIndex = -1;
let endIndex = -1;

for(let i=0; i<lines.length; i++) {
  if (lines[i].includes('<div className="row g-4 justify-content-center">') && startIndex === -1) {
    if (lines[i+1] && lines[i+1].includes('<div className="col-lg-4 col-md-6">')) {
      startIndex = i;
    }
  }
  if (startIndex !== -1 && i > startIndex + 10 && lines[i].includes('</section>')) {
    endIndex = i - 4; // safely replace grid container
    break;
  }
}

if (startIndex !== -1 && endIndex !== -1) {
  lines.splice(startIndex, endIndex - startIndex + 1, replacement);
  fs.writeFileSync('src/pages/HomeAiChatbot.jsx', lines.join('\n'));
  console.log('Successfully updated grid layout to match inset images!');
} else {
  console.log('Indices not found:', startIndex, endIndex);
}
