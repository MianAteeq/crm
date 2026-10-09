import fs from 'fs';

const filePath = 'c:/laragon/www/Talkinexx/react-app/index.html';
let content = fs.readFileSync(filePath, 'utf-8');

// The block to remove (from previous injection)
const oldStyleStart = content.indexOf('<style>\n      /* Override any hardcoded purple colors');
const oldStyleEnd = content.indexOf('</style>', oldStyleStart) + '</style>'.length;

let cleanContent = content;
if (oldStyleStart !== -1 && oldStyleEnd !== -1) {
    cleanContent = content.substring(0, oldStyleStart) + content.substring(oldStyleEnd);
}

// New professional style
const newStyle = `
    <style>
      /* Professional Preloader Overrides */
      .preloader-bg {
          background-color: #12263A !important;
      }
      
      /* Scale down the wrapper so TALKINEXX fits properly */
      .loader-wrapper {
          font-size: 32px !important;
          scale: 1 !important;
          letter-spacing: 4px !important;
          font-weight: 800 !important;
          color: #FAFAF9 !important;
      }

      /* Clean, elegant text animation */
      .loader-letter {
          display: inline-block !important;
          opacity: 0 !important;
          animation: float-glow 2.5s infinite ease-in-out !important;
          color: #FAFAF9 !important;
          -webkit-text-stroke: 0 !important;
          text-shadow: none !important;
      }
      
      /* Staggered animation delays for 9 letters */
      .loader-letter:nth-child(1) { animation-delay: 0.1s !important; }
      .loader-letter:nth-child(2) { animation-delay: 0.2s !important; }
      .loader-letter:nth-child(3) { animation-delay: 0.3s !important; }
      .loader-letter:nth-child(4) { animation-delay: 0.4s !important; }
      .loader-letter:nth-child(5) { animation-delay: 0.5s !important; }
      .loader-letter:nth-child(6) { animation-delay: 0.6s !important; }
      .loader-letter:nth-child(7) { animation-delay: 0.7s !important; }
      .loader-letter:nth-child(8) { animation-delay: 0.8s !important; }
      .loader-letter:nth-child(9) { animation-delay: 0.9s !important; }

      @keyframes float-glow {
          0%, 100% {
              opacity: 0;
              transform: translateY(8px);
              text-shadow: none;
              color: #FAFAF9;
          }
          50% {
              opacity: 1;
              transform: translateY(0);
              color: #22C55E;
              text-shadow: 0px 0px 12px rgba(34, 197, 94, 0.8);
          }
      }

      /* White and Green combination for the glowing background strips */
      .loader::after {
          background-image: 
            radial-gradient(circle at 50% 50%, #22C55E 0%, transparent 50%), 
            radial-gradient(circle at 45% 45%, #FAFAF9 0%, transparent 45%), 
            radial-gradient(circle at 55% 55%, #166534 0%, transparent 45%), 
            radial-gradient(circle at 45% 55%, #FAFAF9 0%, transparent 45%), 
            radial-gradient(circle at 55% 45%, #22C55E 0%, transparent 45%) !important;
      }
    </style>
`;

cleanContent = cleanContent.replace('</head>', newStyle + '\n  </head>');

fs.writeFileSync(filePath, cleanContent, 'utf-8');
console.log('Successfully applied professional preloader styling!');
