import fs from 'fs';

const filePath = 'c:/laragon/www/Talkinexx/react-app/index.html';
let content = fs.readFileSync(filePath, 'utf-8');

// Replace the A I O R letters with T A L K I N E X X
const oldLoaderText = `<span class="loader-letter">A</span>
          <span class="loader-letter">I</span>
          <span class="loader-letter">O</span>
          <span class="loader-letter">R</span>`;
          
const newLoaderText = `<span class="loader-letter">T</span>
          <span class="loader-letter">A</span>
          <span class="loader-letter">L</span>
          <span class="loader-letter">K</span>
          <span class="loader-letter">I</span>
          <span class="loader-letter">N</span>
          <span class="loader-letter">E</span>
          <span class="loader-letter">X</span>
          <span class="loader-letter">X</span>`;

content = content.replace(oldLoaderText, newLoaderText);

// Inject a style block into the <head> to override any hardcoded purple colors for the preloader
const styleInjection = `
    <style>
      /* Override any hardcoded purple colors (#7B5DFF) in the preloader to green (#22C55E) */
      .loader-letter {
          text-shadow: 0px 0px 10px rgba(34, 197, 94, 0.5) !important;
          -webkit-text-stroke: 1px #22C55E !important;
          color: #FAFAF9 !important;
      }
      .loader-letter.animating, 
      .loader-letter:hover {
          color: #22C55E !important;
      }
      .preloader-bg {
          background-color: #12263A !important;
      }
      .loader {
          border-color: #22C55E !important;
          border-top-color: transparent !important;
      }
      
      /* Glowing lines effect */
      .loader-wrapper:before,
      .loader-wrapper:after,
      #preloader:before,
      #preloader:after {
         background: linear-gradient(to bottom, transparent, #22C55E, transparent) !important;
      }
    </style>
  </head>`;
  
content = content.replace('</head>', styleInjection);

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Successfully updated preloader text and injected green color overrides!');
