const fs = require('fs');
const path = require('path');

const updates = {
  'app/page.jsx': {
    title: "'Rixora — AI Career & Study Hub'",
    description: "'Rise through knowledge. AI-powered career coaching, resume building, mock interviews, cover letters, and study hub.'"
  },
  'app/(main)/resume/page.jsx': {
    title: "'AI Resume Builder | Rixora'"
  },
  'app/(main)/interview/page.jsx': {
    title: "'Mock Interview Prep | Rixora'"
  },
  'app/(main)/ai-cover-letter/page.jsx': {
    title: "'AI Cover Letter | Rixora'"
  },
  'app/(main)/dashboard/page.jsx': {
    title: "'Dashboard | Rixora'"
  },
  'app/(main)/api-usage/page.jsx': {
    title: "'API Usage | Rixora'"
  }
};

for (const [file, meta] of Object.entries(updates)) {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    
    if (meta.title) {
      content = content.replace(/title:\s*['"][^'"]+['"]/g, `title: ${meta.title}`);
    }
    if (meta.description) {
      content = content.replace(/description:\s*['"][^'"]+['"]/g, `description: ${meta.description}`);
    }
    
    fs.writeFileSync(fullPath, content);
    console.log(`Updated metadata in ${file}`);
  }
}
