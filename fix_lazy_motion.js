const fs = require('fs');
const files = [
  'app/(main)/dashboard/_components/dashboard-view.jsx',
  'app/page.jsx',
  'components/loaders/AILoader.jsx',
  'app/(main)/ai-cover-letter/_components/cover-letter-generator.jsx',
  'app/(main)/interview/_components/quiz.jsx',
  'components/hero.jsx',
  'app/(main)/interview/_components/quiz-result.jsx',
  'components/loaders/RouteTransitionLoader.jsx',
  'app/(main)/ai-cover-letter/_components/cover-letter-list.jsx',
  'components/loaders/GlobalLoader.jsx'
];
files.forEach(f => {
  if (fs.existsSync(f)) {
    let c = fs.readFileSync(f, 'utf8');
    let newC = c.replace(/import\s*\{([^}]*)\bmotion\b([^}]*)\}\s*from\s*["']framer-motion["']/g, (match, p1, p2) => 'import {' + p1 + 'm' + p2 + '} from "framer-motion"');
    newC = newC.replace(/<motion\./g, '<m.');
    newC = newC.replace(/<\/motion\./g, '</m.');
    if (newC !== c) {
      fs.writeFileSync(f, newC);
      console.log('Fixed use-lazy-motion in ' + f);
    }
  }
});
