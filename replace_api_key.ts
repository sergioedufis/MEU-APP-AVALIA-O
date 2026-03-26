import fs from 'fs';

const filePath = './services/geminiService.ts';
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(/const apiKey = process\.env\.GEMINI_API_KEY;\s*if \(!apiKey\) {\s*return "Erro: Chave da API do Gemini não configurada\.";\s*}/g, `const apiKey = process.env.GEMINI_API_KEY || (import.meta as any).env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      return "Erro: Chave da API do Gemini não configurada. Adicione a variável VITE_GEMINI_API_KEY no painel da Vercel e faça um novo Deploy.";
    }`);

fs.writeFileSync(filePath, content);
console.log('Done');
