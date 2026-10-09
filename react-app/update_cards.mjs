import fs from 'fs';
let content = fs.readFileSync('src/pages/HomeAiChatbot.jsx', 'utf-8');

// Replace the image paths
content = content.replace(/"assets\/img\/service\/service_1_1\.jpg"/g, '"assets/img/service/service_chatbot_1.jpg"');
content = content.replace(/"assets\/img\/service\/service_1_2\.jpg"/g, '"assets/img/service/service_chatbot_2.jpg"');
content = content.replace(/"assets\/img\/service\/service_1_3\.jpg"/g, '"assets/img/service/service_chatbot_3.jpg"');

// Fix the padding and flex basis to give text more room
content = content.replace(/flex: '0 0 45%'/g, "flex: '0 0 40%'");
content = content.replace(/padding: '30px 20px 60px 20px'/g, "padding: '24px 16px 50px 16px'");

fs.writeFileSync('src/pages/HomeAiChatbot.jsx', content);
console.log('Successfully updated images and layout padding!');
