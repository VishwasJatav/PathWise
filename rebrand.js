const fs = require('fs');
const path = require('path');

const replacements = [
  { search: /PathWise AI/g, replace: 'Rixora AI' },
  { search: /PathWise/g, replace: 'Rixora' },
  { search: /pathwise/g, replace: 'rixora' },
  { search: /PATHWISE/g, replace: 'RIXORA' },
  { search: /Path Wise/g, replace: 'Rixora' },
  { search: /Pathwise/g, replace: 'Rixora' },
  { search: /AI Career Architect/g, replace: 'AI Career & Study Hub' },
  { search: /AI CAREER ARCHITECT/g, replace: 'AI CAREER · STUDY HUB' },
  { search: /Your AI Career Coach/g, replace: 'Rise Through Knowledge' }
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fullPath.includes('node_modules') || fullPath.includes('.next') || fullPath.includes('.git') || fullPath.includes('package-lock.json') || fullPath.includes('rebrand.js')) {
      continue;
    }
    
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else {
      if (!fullPath.match(/\.(js|jsx|ts|tsx|md|json|yml|txt|css|html)$/i)) continue;
      try {
        let content = fs.readFileSync(fullPath, 'utf8');
        let modified = false;
        
        for (const { search, replace } of replacements) {
          if (content.match(search)) {
            content = content.replace(search, replace);
            modified = true;
          }
        }
        
        if (modified) {
          fs.writeFileSync(fullPath, content);
          console.log(`Updated ${fullPath}`);
        }
      } catch (e) {
        console.error(`Error processing ${fullPath}:`, e);
      }
    }
  }
}

processDirectory('.');
console.log('Rebrand complete.');
