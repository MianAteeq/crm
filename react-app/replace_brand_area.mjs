import fs from 'fs';

const filePath = 'c:/laragon/www/Talkinexx/react-app/src/pages/HomeAiChatbot.jsx';
let content = fs.readFileSync(filePath, 'utf-8');

const startMarker = '{/*==============================\nBrand Area  \n==============================*/}';
const endMarker = '{/*==============================\nAbout Area  \n==============================*/}';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
  const newBrandArea = `{/*==============================
Brand Area  
==============================*/}
        <div className="overflow-hidden space-top overflow-hidden">
          <div className="container">
            <div className="row">
              <div className="title-area text-center">
                <h2 className="h5 fw-medium text-anime-style-2 mb-5" style={{ color: 'var(--title-color)' }}>Trusted by fast-growing SaaS & retail teams globally</h2>
              </div>
            </div>
            
            <style>
              {\`
                .brand-logo-row {
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  flex-wrap: wrap;
                  gap: 4rem;
                  padding: 2rem 0;
                }
                .brand-logo-row svg {
                  height: 28px;
                  opacity: 0.5;
                  transition: all 0.3s ease;
                  fill: var(--title-color);
                  color: var(--title-color);
                  cursor: pointer;
                }
                .brand-logo-row svg:hover {
                  opacity: 1;
                }
              \`}
            </style>

            <div className="brand-logo-row">
              <svg viewBox="0 0 80 34" xmlns="http://www.w3.org/2000/svg"><path d="M41.4 12.3c0-3.3 2.5-4.4 6.7-4.4 3.7 0 7.3.9 10.3 2.5V3.1C55.4 1.7 51.5 1 47.9 1 34.6 1 27.6 8.1 27.6 19c0 9.8 6.7 14.1 16.5 14.1 4 0 7.8-.7 10.7-2.1v-7.3c-2.9 1.5-6.3 2.1-9.4 2.1-5.1 0-7-2-7-6.8h23.2v-1.7H41.4zm0-5c0-1.8 1.2-2.8 3.3-2.8 2.2 0 3.3 1 3.3 2.8H41.4zM24.8 9.5c0-.8-.7-1.4-1.5-1.4h-5.5V1h-9.3v7.1H3c-.8 0-1.4.6-1.4 1.4v6.8c0 .8.6 1.4 1.4 1.4h5.5v15.7h9.3V17.7h5.5c.8 0 1.4-.6 1.4-1.4V9.5z"></path></svg>
              <svg viewBox="0 0 100 24" xmlns="http://www.w3.org/2000/svg"><text x="0" y="18" className="font-sans font-black tracking-wider text-lg" style={{fontSize: '1.25rem', fontWeight: 900}}>LINEAR</text></svg>
              <svg viewBox="0 0 100 28" xmlns="http://www.w3.org/2000/svg"><text x="0" y="20" className="font-sans font-black tracking-wider text-lg" style={{fontSize: '1.25rem', fontWeight: 900}}>HUBSPOT</text></svg>
              <svg viewBox="0 0 116 26" xmlns="http://www.w3.org/2000/svg" style={{ height: '24px' }}><path d="M12.2 2L24.4 23H0L12.2 2z"></path><text x="32" y="20" className="font-sans font-black tracking-wider text-base" style={{fontSize: '1.1rem', fontWeight: 900}}>VERCEL</text></svg>
              <svg viewBox="0 0 100 24" xmlns="http://www.w3.org/2000/svg"><text x="0" y="18" className="font-sans font-black tracking-wider text-lg" style={{fontSize: '1.25rem', fontWeight: 900}}>NOTION</text></svg>
            </div>
          </div>
        </div>`;

  const newContent = content.substring(0, startIndex) + newBrandArea + content.substring(endIndex);
  fs.writeFileSync(filePath, newContent, 'utf-8');
  console.log('Brand Area successfully replaced!');
} else {
  console.log('Could not find markers for Brand Area!');
}
