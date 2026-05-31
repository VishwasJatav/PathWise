# Rixora Resume Builder — File Structure
## Complete Implementation Guide

---

## Directory Structure

```
app/
└── (main)/
    └── resume/
        ├── page.jsx                          ← Entry: shows template picker OR editor
        ├── layout.js                         ← Wraps with page transition
        ├── _components/
        │   ├── ResumePageShell.jsx           ← 3-panel layout wrapper
        │   ├── TemplatePicker/
        │   │   ├── TemplatePicker.jsx        ← Main template selection view
        │   │   ├── TemplateGrid.jsx          ← 2-col grid of cards
        │   │   ├── TemplateCard.jsx          ← Individual card with ATS badge
        │   │   ├── TemplateMini.jsx          ← Miniature resume thumbnail SVG
        │   │   ├── FilterTabs.jsx            ← All / Professional / Creative / etc.
        │   │   ├── FeaturePills.jsx          ← ATS Optimized / AI Powered / Industry
        │   │   └── templates.data.js         ← Template definitions array
        │   ├── PreviewPanel/
        │   │   ├── PreviewPanel.jsx          ← Right 300px panel
        │   │   ├── ResumeDocPreview.jsx      ← White paper resume preview
        │   │   ├── ATSScoreBadge.jsx         ← Animated score badge
        │   │   ├── AIAssistantBox.jsx        ← "Generate with AI" box
        │   │   └── StatsRow.jsx              ← ATS / AI / Live preview stats
        │   └── ResumeEditor/
        │       ├── ResumeEditor.jsx          ← Full editor (after template selected)
        │       ├── EditorPanel.jsx           ← Left 45% form panel
        │       ├── EditorSections/
        │       │   ├── PersonalInfoSection.jsx
        │       │   ├── SummarySection.jsx
        │       │   ├── ExperienceSection.jsx
        │       │   ├── EducationSection.jsx
        │       │   ├── SkillsSection.jsx
        │       │   └── CertificationsSection.jsx
        │       ├── LivePreviewPanel.jsx      ← Right 55% live preview
        │       ├── TemplateRenderer/
        │       │   ├── ApexProTemplate.jsx
        │       │   ├── VertexProTemplate.jsx
        │       │   ├── MomentumTemplate.jsx
        │       │   ├── ZenithTemplate.jsx
        │       │   └── index.js              ← Template registry
        │       └── EditorToolbar.jsx         ← Save / Export PDF / Template switch
```

---

## Key File Contents

### `templates.data.js`
```js
export const TEMPLATES = [
  {
    id: 'apex-pro',
    name: 'Apex Pro',
    ats: 97,
    tier: 'premium',      // 'free' | 'premium'
    category: ['all', 'professional', 'modern'],
    description: 'Modern 2-column ATS friendly template',
    bestFor: 'General professional',
    layout: 'two-column',
    accentColor: '#6C47FF',
  },
  {
    id: 'vertex-pro',
    name: 'Vertex Pro',
    ats: 95,
    tier: 'premium',
    category: ['all', 'professional'],
    description: 'Clean and modern professional template',
    bestFor: 'Product / design roles',
    layout: 'sidebar',
    accentColor: '#6C47FF',
  },
  {
    id: 'momentum',
    name: 'Momentum',
    ats: 94,
    tier: 'free',
    category: ['all', 'creative', 'modern'],
    description: 'Creative yet professional layout',
    bestFor: 'Creative professionals',
    layout: 'accent-header',
    accentColor: '#6C47FF',
  },
  {
    id: 'zenith',
    name: 'Zenith',
    ats: 92,
    tier: 'free',
    category: ['all', 'professional'],
    description: 'Minimal and elegant single column',
    bestFor: 'Any industry',
    layout: 'single-column',
    accentColor: '#333333',
  },
  {
    id: 'ascend',
    name: 'Ascend',
    ats: 91,
    tier: 'premium',
    category: ['all', 'tech'],
    description: 'Perfect for tech and developer roles',
    bestFor: 'Engineering / tech',
    layout: 'dark-header',
    accentColor: '#A78BFA',
  },
  {
    id: 'elite',
    name: 'Elite',
    ats: 90,
    tier: 'premium',
    category: ['all', 'professional'],
    description: 'Professional design for senior level roles',
    bestFor: 'Senior / executive',
    layout: 'accent-sidebar',
    accentColor: '#4ADE80',
  },
  {
    id: 'impact',
    name: 'Impact',
    ats: 89,
    tier: 'free',
    category: ['all', 'creative'],
    description: 'Bold design for maximum impact',
    bestFor: 'Sales / marketing',
    layout: 'bold-header',
    accentColor: '#F87171',
  },
];
```

### `TemplateCard.jsx`
```jsx
'use client';
import { Crown } from 'lucide-react';
import { TemplateMini } from './TemplateMini';
import { cn } from '@/lib/utils';

export function TemplateCard({ template, isSelected, onSelect }) {
  const atsColor = template.ats >= 92
    ? 'text-green-400 bg-green-950 border-green-900'
    : 'text-amber-400 bg-amber-950 border-amber-900';

  return (
    <div
      data-testid={`template-card-${template.id}`}
      onClick={() => onSelect(template)}
      className={cn(
        'bg-[#0F0F1A] rounded-xl overflow-hidden cursor-pointer transition-all duration-200',
        'border hover:-translate-y-0.5',
        isSelected
          ? 'border-[#6C47FF] border-2'
          : 'border-[#1E1E2E] hover:border-[#3A2A6E]'
      )}
    >
      {/* Thumbnail */}
      <div className="h-[100px] bg-[#141420] relative flex items-center justify-center overflow-hidden">
        <span className={cn(
          'absolute top-2 left-2 text-[9px] font-black px-1.5 py-0.5 rounded border',
          atsColor
        )}>
          {template.ats}% ATS
        </span>
        {template.tier === 'premium' && (
          <span className="absolute top-2 right-2 bg-[#1A1030] border border-[#3A1A6E] rounded px-1.5 py-0.5 flex items-center gap-1 text-[9px] font-bold text-[#A78BFA]">
            <Crown size={8} className="text-amber-400" />
            PRO
          </span>
        )}
        <TemplateMini layout={template.layout} accentColor={template.accentColor} />
      </div>

      {/* Info */}
      <div className="px-3 py-2.5">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-[12.5px] font-bold text-[#D0D0F0]">{template.name}</span>
          <span className={cn('text-[9.5px] font-bold px-1.5 py-0.5 rounded border', atsColor)}>
            {template.ats}% ATS
          </span>
        </div>
        <p className="text-[10.5px] text-[#5A5A7A]">{template.description}</p>
      </div>
    </div>
  );
}
```

### `PreviewPanel.jsx`
```jsx
'use client';
import { Crown, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import { ResumeDocPreview } from './ResumeDocPreview';
import { AIAssistantBox } from './AIAssistantBox';
import { StatsRow } from './StatsRow';
import { useRouter } from 'next/navigation';

export function PreviewPanel({ template, onUseTemplate }) {
  const router = useRouter();

  if (!template) return (
    <div className="flex items-center justify-center h-full text-[#4A4A6A] text-sm">
      Select a template to preview
    </div>
  );

  const atsColor = template.ats >= 92 ? 'text-green-400' : 'text-amber-400';

  return (
    <div className="flex flex-col h-full bg-[#0C0C18] border-l border-[#1E1E2E]">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#1E1E2E] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-bold text-[#D0D0F0]">{template.name}</span>
          {template.tier === 'premium' && (
            <span className="bg-[#1A1030] border border-[#3A1A6E] rounded px-2 py-0.5 text-[9px] font-bold text-[#A78BFA] flex items-center gap-1">
              <Crown size={8} className="text-amber-400" /> Premium
            </span>
          )}
        </div>
        <span className="bg-[#0A200A] border border-[#1A5A1A] rounded px-2.5 py-1 text-[11px] font-black text-green-400 flex items-center gap-1.5">
          <ShieldCheck size={11} />
          {template.ats}% ATS
        </span>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto p-3.5 flex flex-col gap-3">
        <ResumeDocPreview template={template} />

        <button
          data-testid="use-template-btn"
          onClick={() => onUseTemplate(template)}
          className="w-full bg-[#6C47FF] hover:bg-[#7C57FF] text-white font-bold text-[12.5px] py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <ArrowRight size={14} />
          Use This Template
        </button>

        <AIAssistantBox template={template} />
        <StatsRow ats={template.ats} />
      </div>
    </div>
  );
}
```

### `page.jsx` — Route logic
```jsx
'use client';
import { useState } from 'react';
import { TemplatePicker } from './_components/TemplatePicker/TemplatePicker';
import { ResumeEditor } from './_components/ResumeEditor/ResumeEditor';

export default function ResumePage() {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [mode, setMode] = useState('pick'); // 'pick' | 'edit'

  const handleUseTemplate = (template) => {
    setSelectedTemplate(template);
    setMode('edit');
  };

  const handleBackToPicker = () => {
    setMode('pick');
  };

  if (mode === 'edit' && selectedTemplate) {
    return (
      <ResumeEditor
        template={selectedTemplate}
        onBack={handleBackToPicker}
      />
    );
  }

  return (
    <TemplatePicker onUseTemplate={handleUseTemplate} />
  );
}
```

---

## Antigravity Implementation Prompt

```
In the Rixora project at D:\Rixora\my-app, completely rebuild the Resume Builder page.

Reference design: The new Resume Builder has two modes:
  MODE 1 — Template Picker (shown first)
  MODE 2 — Resume Editor (shown after template selected)

━━━ MODE 1: TEMPLATE PICKER ━━━

Layout: 3-panel (200px sidebar | flex-1 main | 300px preview)

SIDEBAR:
- Dark background #0C0C18, border-right #1E1E2E
- Navigation items: Dashboard, AI Resume Builder (active), AI Cover Letter,
  AI Job Tracker, AI Interview Prep, AI Career Coach, Skill Assessment,
  Learning Hub, Salary Insights, Job Matcher, Career Roadmap
- Active state: background #1E1030, text #A78BFA
- Upgrade box at bottom: bg #1A1030, border #3A1A6E, purple CTA button
- User profile row pinned to bottom

MAIN PANEL:
- Page title: "AI Resume Generator ✦" (22px/800, letter-spacing -0.5px)
- Subtitle: "Create a professional, ATS-friendly resume with the power of AI."
- Top-right buttons: "Import Resume" (ghost) + "+ Create New Resume" (#6C47FF)
- Feature pills row: ATS Optimized | AI-Powered Content | Industry Specific
- Section: "Choose a Template"
- Filter tabs: All | Professional | Creative | Modern | Academic | Tech
- Sort dropdown: "Premium First"
- Template grid: 2-column, 8 cards + "More Templates" card (dashed border)

TEMPLATE CARDS (each):
- Background #0F0F1A, border #1E1E2E, border-radius 12px
- Thumbnail (100px height): miniature resume preview + ATS badge (top-left, green) + Crown PRO badge (top-right, premium templates)
- Info area: template name + ATS % pill + short description
- Selected state: 2px solid #6C47FF border
- Hover: translateY(-2px)

Templates to create with their ATS scores:
  Apex Pro (97% - Premium), Vertex Pro (95% - Premium),
  Momentum (94% - Free), Zenith (92% - Free),
  Ascend (91% - Premium), Elite (90% - Premium),
  Impact (89% - Free), + More Templates placeholder

PREVIEW PANEL (right 300px):
- Shows selected template name + Premium badge + ATS score badge
- White paper resume preview (actual content, scaled down)
- "Use This Template" button (#6C47FF, full-width)
- AI Assistant box with "Generate with AI" button
- Stats row: ATS Score | AI Content Suggestions | Live Preview

━━━ MODE 2: RESUME EDITOR ━━━

Layout: Left 45% editor | Right 55% live preview

EDITOR PANEL:
- Top toolbar: back button | template name | "Not Saved Yet" indicator | Template switcher dropdown | "Export PDF" button
- Collapsible sections: Personal Info, Professional Summary, Work Experience, Education, Skills, Certifications
- Each section has an AI "Improve" button that calls Gemini to enhance that section
- All form changes update the live preview with 300ms debounce

LIVE PREVIEW PANEL:
- Renders the actual resume template with real user data
- Zoom controls: - | 75% | + | FIT button
- Fullscreen expand button (top-right)
- A4 proportioned white paper (210×297mm ratio)
- Scales to fit within the panel using CSS transform: scale()

BEHAVIOR:
- Selecting a template card highlights it and updates the preview panel
- "Use This Template" → transitions to MODE 2 editor
- Back button in editor → returns to MODE 1 picker (preserves selected template)
- Template data stored in React state (no page reload)

COLOR TOKENS (apply throughout):
  --bg-base: #0A0A0F
  --bg-surface: #0C0C18
  --bg-elevated: #0F0F1A
  --bg-card: #141420
  --border: #1E1E2E
  --border-purple: #3A1A6E
  --brand: #6C47FF
  --brand-light: #A78BFA
  --brand-dark: #1E1030
  --text-primary: #F0F0FF
  --text-secondary: #C0C0E0
  --text-muted: #7070A0
  --text-faint: #4A4A6A
  --ats-green: #4ADE80
  --ats-green-bg: #0A200A

Font: DM Sans (import from Google Fonts)
Icons: Lucide React (already installed)
Components: ShadCN UI (already installed)

Do NOT change the global app layout, header, or any other page.
Only create/modify files under app/(main)/resume/.
```

---

## Playwright Test IDs Reference

Add these `data-testid` attributes for stable E2E tests:

```
data-testid="template-picker"           ← TemplatePicker wrapper
data-testid="template-card-{id}"        ← Each template card (e.g. template-card-apex-pro)
data-testid="template-filter-{name}"    ← Filter tabs (template-filter-all, etc.)
data-testid="preview-panel"             ← Right preview panel
data-testid="preview-template-name"     ← Template name in preview
data-testid="preview-ats-score"         ← ATS score badge
data-testid="use-template-btn"          ← "Use This Template" button
data-testid="generate-ai-btn"           ← "Generate with AI" button
data-testid="resume-editor"             ← Editor mode wrapper
data-testid="editor-panel"              ← Left editor panel
data-testid="live-preview"              ← Right preview panel in editor
data-testid="export-pdf-btn"            ← Export PDF button
data-testid="back-to-picker-btn"        ← Back button in editor
data-testid="autosave-indicator"        ← "Not Saved Yet" / "Saved" indicator
```
