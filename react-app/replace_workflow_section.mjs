import fs from 'fs';

const filePath = 'c:/laragon/www/Talkinexx/react-app/src/pages/HomeAiChatbot.jsx';
const lines = fs.readFileSync(filePath, 'utf-8').split('\n');

const startIndex = 252; // 'About Area  '
const endIndex = 300;   // '          </div>' just before Service Area start

const newSection = `{/*==============================
WhatsApp Workflow Area  
==============================*/}
        <section className="space position-relative overflow-hidden" style={{ backgroundColor: '#0B1120', padding: '120px 0' }} id="whatsapp-workflow">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8 col-xl-6 text-center">
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '50px', backgroundColor: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.2)', color: '#22C55E', fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '24px' }}>
                  <i className="fa-solid fa-bolt"></i> 100% AUTOMATED WORKFLOW
                </div>
                <h2 style={{ color: '#fff', fontSize: '42px', fontWeight: '700', lineHeight: '1.2', marginBottom: '20px' }}>Turn WhatsApp Into Your Best Employee</h2>
                <p style={{ color: '#94a3b8', fontSize: '18px', lineHeight: '1.6', marginBottom: '60px' }}>Deploy AI on your WhatsApp Business number to automate response generation, support workflows, and pipeline progression 24/7.</p>
              </div>
            </div>
            
            <div className="row position-relative g-4 justify-content-center">
              {/* Connecting Line */}
              <div style={{ position: 'absolute', top: '48px', left: '15px', right: '15px', height: '1px', backgroundColor: '#334155', zIndex: 0 }} className="d-none d-lg-block"></div>
              
              {/* Cards */}
              {[
                { icon: 'fa-comment-alt', title: 'Inbound Message', text: 'Customer texts your WhatsApp number or scans a QR code.' },
                { icon: 'fa-bolt', title: 'AI Context Engine', text: 'Instantly analyzes context, language, and purchasing intent.' },
                { icon: 'fa-paper-plane', title: 'Interactive Reply', text: 'Fires back personalized replies with WhatsApp buttons & lists.' },
                { icon: 'fa-calendar-alt', title: 'In-Chat Booking', text: 'Customer books a meeting slot directly within the chat window.' },
                { icon: 'fa-database', title: 'CRM Sync', text: 'Automatically logs the lead, tags intent, and updates your CRM.' },
                { icon: 'fa-user-headset', title: 'Smart Handoff', text: 'Routes complex or high-value chats to human agents seamlessly.' }
              ].map((card, idx) => (
                <div className="col-12 col-md-6 col-lg-2" key={idx} style={{ zIndex: 1 }}>
                  <div style={{ backgroundColor: '#151C2C', border: '1px solid #1e293b', borderRadius: '16px', padding: '24px 16px', height: '100%', textAlign: 'center', transition: 'all 0.3s ease', cursor: 'pointer' }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#22C55E'; e.currentTarget.style.transform = 'translateY(-5px)'; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#1e293b'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                    <div style={{ width: '48px', height: '48px', margin: '0 auto 20px auto', borderRadius: '12px', backgroundColor: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22C55E', fontSize: '20px', position: 'relative' }}>
                      <i className={\`fa-regular \${card.icon}\`}></i>
                      <span style={{ position: 'absolute', top: '-4px', right: '-4px', width: '10px', height: '10px', backgroundColor: '#22C55E', borderRadius: '50%', boxShadow: '0 0 8px #22C55E' }}></span>
                    </div>
                    <h4 style={{ color: '#f8fafc', fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>{card.title}</h4>
                    <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: '1.5', margin: 0 }}>{card.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>`;

lines.splice(startIndex, endIndex - startIndex, newSection);

fs.writeFileSync(filePath, lines.join('\\n'), 'utf-8');
console.log('Successfully replaced About section with WhatsApp Workflow section!');
