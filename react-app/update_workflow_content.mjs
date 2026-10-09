import fs from 'fs';

const filePath = 'c:/laragon/www/Talkinexx/react-app/src/pages/HomeAiChatbot.jsx';
let content = fs.readFileSync(filePath, 'utf-8');

// We need to replace the section with id="whatsapp-workflow"
const startMarker = '<section className="space position-relative overflow-hidden" style={{ backgroundColor: \\'#0B1120\\', padding: \\'120px 0\\' }} id="whatsapp-workflow">';
const endMarker = '        </section>{/*=============================='; // Because we replaced the closing tags correctly earlier

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
  const newSection = `<section className="space position-relative overflow-hidden" style={{ backgroundColor: '#0B1120', padding: '120px 0' }} id="whatsapp-workflow">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8 col-xl-8 text-center">
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '50px', backgroundColor: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.2)', color: '#22C55E', fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '24px' }}>
                  [ Key Features ]
                </div>
                <h2 style={{ color: '#fff', fontSize: '42px', fontWeight: '700', lineHeight: '1.2', marginBottom: '60px' }}>An AI chatbot bot trained to answer questions about EmbedAI.</h2>
              </div>
            </div>
            
            <div className="row position-relative g-4 justify-content-center">
              {/* Connecting Line */}
              <div style={{ position: 'absolute', top: '48px', left: '15px', right: '15px', height: '1px', backgroundColor: '#334155', zIndex: 0 }} className="d-none d-lg-block"></div>
              
              {/* Cards */}
              {[
                { icon: 'fa-chart-line-down', fallbackIcon: 'fa-chart-line', title: 'Reduce Operational Costs', text: 'Automate routine customer questions and cut help-desk workload by up to 40%.' },
                { icon: 'fa-rocket', fallbackIcon: 'fa-rocket', title: 'Boost Conversation Rates', text: 'Qualify visitors in real time and guide hot leads straight to checkout or a meeting.' },
                { icon: 'fa-clock', fallbackIcon: 'fa-clock', title: 'Save Hours Daily', text: 'Auto-answer FAQs, capture leads, schedule calls—free your team for high-value work.' }
              ].map((card, idx) => (
                <div className="col-12 col-md-6 col-lg-4" key={idx} style={{ zIndex: 1 }}>
                  <div style={{ backgroundColor: '#151C2C', border: '1px solid #1e293b', borderRadius: '16px', padding: '32px 24px', height: '100%', textAlign: 'center', transition: 'all 0.3s ease', cursor: 'pointer' }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#22C55E'; e.currentTarget.style.transform = 'translateY(-5px)'; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#1e293b'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                    <div style={{ width: '64px', height: '64px', margin: '0 auto 24px auto', borderRadius: '16px', backgroundColor: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22C55E', fontSize: '28px', position: 'relative' }}>
                      <i className={\`fa-regular \${card.fallbackIcon}\`}></i>
                      <span style={{ position: 'absolute', top: '-4px', right: '-4px', width: '12px', height: '12px', backgroundColor: '#22C55E', borderRadius: '50%', boxShadow: '0 0 10px #22C55E' }}></span>
                    </div>
                    <h4 style={{ color: '#f8fafc', fontSize: '22px', fontWeight: '600', marginBottom: '16px' }}>{card.title}</h4>
                    <p style={{ color: '#94a3b8', fontSize: '15px', lineHeight: '1.6', margin: 0 }}>{card.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
\n`;

  const newContent = content.substring(0, startIndex) + newSection + content.substring(endIndex);
  fs.writeFileSync(filePath, newContent, 'utf-8');
  console.log('Successfully updated the section with the correct content and 3-column layout!');
} else {
  console.log('Could not find markers to replace the section.');
}
