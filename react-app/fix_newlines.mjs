import fs from 'fs';

const filePath = 'c:/laragon/www/Talkinexx/react-app/src/pages/HomeAiChatbot.jsx';
let content = fs.readFileSync(filePath, 'utf-8');

// Replace all literal "\n" with actual newlines
content = content.replace(/\\n/g, '\n');

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Fixed newlines properly!');
