import fs from 'fs';
let content = fs.readFileSync('src/pages/HomeAiChatbot.jsx', 'utf-8');

const replacement = `            <div className="row g-4 justify-content-center">
              {/* Card 1 */}
              <div className="col-lg-4 col-md-6">
                <div style={{ display: 'flex', backgroundColor: '#fff', borderRadius: '32px', overflow: 'hidden', height: '100%', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.05)', position: 'relative' }}>
                  <div style={{ flex: '0 0 45%', position: 'relative' }}>
                    <img src="assets/img/service/service_1_1.jpg" alt="Tailored Solutions" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ flex: '1', padding: '30px 20px 60px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ marginBottom: '16px' }}>
                      <img src="assets/img/icon/service_2_1.svg" alt="Icon" style={{ width: '40px', height: '40px' }} />
                    </div>
                    <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#000', marginBottom: '12px' }}>Tailored Solutions</h3>
                    <p style={{ fontSize: '13px', color: '#57534E', lineHeight: '1.6', margin: 0 }}>From converting up to 44% of chats into sales and cutting support costs, to gaining actionable insights for new strategies, brands in any industry.</p>
                  </div>
                  <a href="/case-studies" style={{ position: 'absolute', bottom: '15px', right: '15px', width: '36px', height: '36px', backgroundColor: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', color: '#000' }}>
                    <i className="fa-solid fa-chevron-right" style={{ fontSize: '12px' }}></i>
                  </a>
                </div>
              </div>

              {/* Card 2 */}
              <div className="col-lg-4 col-md-6">
                <div style={{ display: 'flex', backgroundColor: '#fff', borderRadius: '32px', overflow: 'hidden', height: '100%', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.05)', position: 'relative' }}>
                  <div style={{ flex: '0 0 45%', position: 'relative' }}>
                    <img src="assets/img/service/service_1_2.jpg" alt="Affordable Pricing" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ flex: '1', padding: '30px 20px 60px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ marginBottom: '16px' }}>
                      <img src="assets/img/icon/service_2_2.svg" alt="Icon" style={{ width: '40px', height: '40px' }} />
                    </div>
                    <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#000', marginBottom: '12px' }}>Affordable Pricing</h3>
                    <p style={{ fontSize: '13px', color: '#57534E', lineHeight: '1.6', margin: 0 }}>From converting up to 44% of chats into sales and cutting support costs, to gaining actionable insights for new strategies, brands in any industry.</p>
                  </div>
                  <a href="/case-studies" style={{ position: 'absolute', bottom: '15px', right: '15px', width: '36px', height: '36px', backgroundColor: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', color: '#000' }}>
                    <i className="fa-solid fa-chevron-right" style={{ fontSize: '12px' }}></i>
                  </a>
                </div>
              </div>

              {/* Card 3 */}
              <div className="col-lg-4 col-md-6">
                <div style={{ display: 'flex', backgroundColor: '#fff', borderRadius: '32px', overflow: 'hidden', height: '100%', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.05)', position: 'relative' }}>
                  <div style={{ flex: '0 0 45%', position: 'relative' }}>
                    <img src="assets/img/service/service_1_3.jpg" alt="Customer Support" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ flex: '1', padding: '30px 20px 60px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ marginBottom: '16px' }}>
                      <img src="assets/img/icon/service_2_3.svg" alt="Icon" style={{ width: '40px', height: '40px' }} />
                    </div>
                    <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#000', marginBottom: '12px' }}>Customer Support</h3>
                    <p style={{ fontSize: '13px', color: '#57534E', lineHeight: '1.6', margin: 0 }}>From converting up to 44% of chats into sales and cutting support costs, to gaining actionable insights for new strategies, brands in any industry.</p>
                  </div>
                  <a href="/case-studies" style={{ position: 'absolute', bottom: '15px', right: '15px', width: '36px', height: '36px', backgroundColor: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', color: '#000' }}>
                    <i className="fa-solid fa-chevron-right" style={{ fontSize: '12px' }}></i>
                  </a>
                </div>
              </div>
            </div>`;

const lines = content.split('\n');
let startIndex = -1;
let endIndex = -1;

for(let i=0; i<lines.length; i++) {
  if (lines[i].includes('<div className="row g-4 justify-content-center">') && startIndex === -1 && lines[i+1] && lines[i+1].includes('<div className="col-lg-4 col-md-6">')) {
    startIndex = i;
  }
  // The block ends 3 divs after the 3rd card. Let's match precisely
  if (startIndex !== -1 && i > startIndex + 10 && lines[i].includes('</div>') && lines[i+1].includes('</section>')) {
    endIndex = i - 1; 
    break;
  }
}

if (startIndex !== -1 && endIndex !== -1) {
  // Let's verify we don't accidentally cut into process area
  lines.splice(startIndex, endIndex - startIndex + 1, replacement);
  fs.writeFileSync('src/pages/HomeAiChatbot.jsx', lines.join('\n'));
  console.log('Successfully updated case studies cards!');
} else {
  console.log('Indices not found:', startIndex, endIndex);
}
