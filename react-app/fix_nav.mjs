import fs from 'fs';

const filePath = 'c:/laragon/www/Talkinexx/react-app/src/pages/HomeAiChatbot.jsx';
let content = fs.readFileSync(filePath, 'utf-8');

const navStart = content.indexOf('<nav className="main-menu style2 d-none d-lg-inline-block">');
const navEnd = content.indexOf('</nav>', navStart) + '</nav>'.length;

if (navStart !== -1 && navEnd !== -1) {
  const newNav = `<nav className="main-menu style2 d-none d-lg-inline-block">
                <ul>
                  <li className="menu-item-has-children">
                    <a href="/">Home</a>
                    <ul className="sub-menu">
                      <li><a href="/home-1">Home 1</a></li>
                      <li><a href="/">Home Ai Chatbot</a></li>
                    </ul>
                  </li>
                  <li><a href="#features-sec">Benefits</a></li>
                  <li><a href="#how-it-works">How it works</a></li>
                  <li><a href="/testimonial">Testimonials</a></li>
                  <li><a href="/faq">FAQ</a></li>
                  <li><a href="/pricing">Pricing</a></li>
                </ul>
              </nav>`;
              
  content = content.substring(0, navStart) + newNav + content.substring(navEnd);
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log("Nav replaced successfully.");
} else {
  console.log("Nav not found!");
}
