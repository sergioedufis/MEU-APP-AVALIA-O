import fs from 'fs';

let content = fs.readFileSync('App.tsx', 'utf8');
content = content.replace(/<input type="number"/g, '<input type="number" step="any"');
fs.writeFileSync('App.tsx', content);
console.log('Done');
