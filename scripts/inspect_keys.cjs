const fs = require('fs');
const path = require('path');

const mainEn = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/i18n/locales/main/en.json'), 'utf8'));
const mainAr = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/i18n/locales/main/ar-SA.json'), 'utf8'));

Object.keys(mainEn).filter(k => k.startsWith('auth.')).forEach(k => {
  console.log(`${k} => EN: ${mainEn[k]} | AR: ${mainAr[k]}`);
});
