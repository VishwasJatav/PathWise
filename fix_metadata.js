const fs = require('fs'); 
const files = { 
  'app/(main)/ai-cover-letter/page.jsx': 'AI Cover Letter', 
  'app/page.jsx': 'Rixora', 
  'app/(main)/interview/mock/page.jsx': 'Mock Interview', 
  'app/(main)/resume/page.jsx': 'Resume Builder', 
  'app/(main)/ai-cover-letter/[id]/page.jsx': 'Cover Letter', 
  'app/(main)/ai-cover-letter/new/page.jsx': 'New Cover Letter', 
  'app/(main)/onboarding/page.jsx': 'Onboarding', 
  'app/(main)/interview/page.jsx': 'Interview Prep' 
}; 

Object.entries(files).forEach(([f, t]) => { 
  if (fs.existsSync(f)) { 
    let content = fs.readFileSync(f, 'utf8'); 
    if (!content.includes('export const metadata')) { 
      content += '\n\nexport const metadata = { title: "' + t + '" };\n'; 
      fs.writeFileSync(f, content); 
      console.log('Added metadata to ' + f); 
    } 
  } 
});
