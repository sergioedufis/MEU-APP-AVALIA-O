import fs from 'fs';

let content = fs.readFileSync('App.tsx', 'utf8');
content = content.replace(/className="w-full bg-dark\/50 border border-white\/10 rounded-xl px-3 py-2 text-white font-bold mt-1 focus:border-neon focus:ring-1 focus:ring-neon outline-none transition-all text-sm pr-8"/g, 'className="w-full bg-dark/50 border border-white/10 rounded-2xl px-4 py-3 text-white font-bold mt-1 focus:border-neon focus:ring-1 focus:ring-neon outline-none transition-all text-lg pr-10"');
fs.writeFileSync('App.tsx', content);
console.log('Done');
