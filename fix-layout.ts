import fs from 'fs';

const filePath = './App.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

// Replace header flex containers
content = content.replace(/className="flex justify-between items-end"/g, 'className="flex flex-col xl:flex-row justify-between xl:items-end gap-8"');
content = content.replace(/className="flex justify-between items-end border-b border-white\/5 pb-16"/g, 'className="flex flex-col xl:flex-row justify-between xl:items-end gap-8 border-b border-white/5 pb-16"');

// Replace text-7xl
content = content.replace(/className="text-7xl /g, 'className="text-5xl md:text-6xl lg:text-7xl break-words ');

// Replace tracking-[0.6em]
content = content.replace(/tracking-\[0\.6em\]/g, 'tracking-widest md:tracking-[0.6em]');

// Also fix some specific ones that might have been missed
content = content.replace(/<div><h1 className="text-5xl md:text-6xl lg:text-7xl break-words font-display/g, '<div className="w-full overflow-hidden"><h1 className="text-5xl md:text-6xl lg:text-7xl break-words font-display');
content = content.replace(/<div>\n\s*<h1 className="text-5xl md:text-6xl lg:text-7xl break-words font-display/g, '<div className="w-full overflow-hidden">\n                  <h1 className="text-5xl md:text-6xl lg:text-7xl break-words font-display');

fs.writeFileSync(filePath, content);
console.log('Done replacing');
