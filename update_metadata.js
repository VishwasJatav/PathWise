const fs = require('fs');

const meta = {
  'app/(main)/resume/page.jsx': `export const metadata = {
  title: 'AI Resume Builder — Rixora',
  description: 'Create ATS-optimized resumes with AI assistance. Choose from premium templates and generate content instantly.',
};`,
  'app/(main)/interview/mock/page.jsx': `export const metadata = {
  title: 'Mock Interview — Rixora',
  description: 'Practice with AI-powered mock interviews tailored to your industry and role.',
};`,
  'app/(main)/dashboard/page.jsx': `export const metadata = {
  title: 'Dashboard — Rixora',
  description: 'Your personalized career insights and industry trends dashboard.',
};`,
  'app/(main)/ai-cover-letter/page.jsx': `export const metadata = {
  title: 'AI Cover Letter — Rixora',
  description: 'Generate compelling, personalized cover letters with AI in seconds.',
};`,
  'app/(main)/ai-cover-letter/[id]/page.jsx': `export const metadata = {
  title: 'Cover Letter — Rixora',
  description: 'View and edit your generated cover letter.',
};`,
  'app/(main)/ai-cover-letter/new/page.jsx': `export const metadata = {
  title: 'New Cover Letter — Rixora',
  description: 'Generate a new cover letter for a specific job posting.',
};`,
  'app/(main)/onboarding/page.jsx': `export const metadata = {
  title: 'Onboarding — Rixora',
  description: 'Complete your profile to get personalized career insights.',
};`,
  'app/(main)/interview/page.jsx': `export const metadata = {
  title: 'Interview Prep — Rixora',
  description: 'Prepare for your interviews with AI-generated questions and feedback.',
};`
};

Object.entries(meta).forEach(([file, metadataText]) => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    // Remove the previously added metadata
    content = content.replace(/export const metadata = \{[^}]*\};\n?/g, '');
    
    // Add the new metadata at the top, after imports or 'use server' if present.
    // It's easier to just add it below the imports or at the top
    const lines = content.split('\n');
    let insertIdx = 0;
    while(insertIdx < lines.length && (lines[insertIdx].startsWith('import') || lines[insertIdx].trim() === '' || lines[insertIdx].includes('"use server"') || lines[insertIdx].includes("'use server'"))) {
      insertIdx++;
    }
    lines.splice(insertIdx, 0, '\n' + metadataText + '\n');
    fs.writeFileSync(file, lines.join('\n'));
    console.log('Updated ' + file);
  }
});
