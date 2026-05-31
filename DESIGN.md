# Rixora — AI Resume Generator
## Design Specification Document
**Version:** 2.0 | **Theme:** Dark SaaS Premium | **Last Updated:** May 2026

---

## 1. Design Philosophy

> **"Premium dark SaaS — feels like Notion meets Linear meets a career OS."**

- **Tone:** Refined maximalism. Dense but never cluttered. Every pixel earns its place.
- **Differentiation:** ATS score badges on every template card make value immediately legible. The three-panel layout (sidebar / template picker / live preview) mirrors professional tools like Figma — users feel in control.
- **Key Memory:** The glowing purple accent (`#6C47FF`) against near-black surfaces creates instant brand recognition.

---

## 2. Color System

```css
/* Core palette — hardcoded for dark-only UI */
--bg-base:        #0A0A0F;   /* Page background */
--bg-surface:     #0C0C18;   /* Sidebar, preview panel */
--bg-elevated:    #0F0F1A;   /* Cards, nav items on hover */
--bg-card:        #141420;   /* Template thumbnail backgrounds */

/* Borders */
--border-default: #1E1E2E;   /* All card/panel borders */
--border-accent:  #3A1A6E;   /* Purple-tinted borders (upgrade box, selected) */

/* Brand */
--brand-purple:   #6C47FF;   /* Primary CTA, active states, ATS bar */
--brand-purple-lt:#A78BFA;   /* Secondary purple, nav active text, icons */
--brand-purple-dk:#1E1030;   /* Active nav item background */

/* Text hierarchy */
--text-primary:   #F0F0FF;   /* Page titles, template names */
--text-secondary: #C0C0E0;   /* Card names, body text */
--text-muted:     #7070A0;   /* Descriptions, secondary labels */
--text-faint:     #4A4A6A;   /* Sidebar section labels, breadcrumbs */

/* Semantic */
--ats-high-text:  #4ADE80;   /* 90%+ ATS score text */
--ats-high-bg:    #0A200A;   /* 90%+ ATS score background */
--ats-high-border:#1A5A1A;   /* 90%+ ATS score border */
--ats-med-text:   #FBBF24;   /* 85-89% ATS score */
--ats-med-bg:     #1A1800;
--ats-med-border: #3A3000;
```

---

## 3. Typography

```css
font-family: 'DM Sans', sans-serif;
/* Import: https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap */

/* Scale */
--text-page-title:   22px / 800 / letter-spacing: -0.5px  → Page headings
--text-section-title: 14px / 700                          → "Choose a Template"
--text-card-name:    12.5px / 700                         → Template card names
--text-body:         12px / 400                           → Descriptions, labels
--text-small:        11px / 500                           → Badges, pills, tabs
--text-tiny:         10px / 600 / uppercase / ls: 0.08em  → Sidebar section labels
--text-micro:        9px / 700                            → ATS badges, crowns
```

---

## 4. Layout Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│  TOPBAR (52px) — Logo | Breadcrumb | Upgrade | Dark toggle | Avatar  │
├──────────────┬──────────────────────────────┬───────────────────────┤
│              │                              │                       │
│   SIDEBAR    │      MAIN CONTENT            │   PREVIEW PANEL       │
│   200px      │      flex: 1                 │   300px               │
│              │                              │                       │
│  - Nav items │  - Page header               │  - Template name      │
│  - Section   │  - Feature pills             │  - ATS score badge    │
│    labels    │  - Filter tabs               │  - Live resume doc    │
│  - Upgrade   │  - Template grid (2-col)     │  - Use Template btn   │
│    box       │                              │  - AI Assistant box   │
│  - User      │                              │  - Stats row (3-col)  │
│              │                              │                       │
└──────────────┴──────────────────────────────┴───────────────────────┘

Grid: display: grid; grid-template-columns: 200px 1fr 300px;
Height: calc(100vh - 52px)
```

---

## 5. Component Specifications

### 5.1 Topbar
```
height: 52px
background: #0F0F1A
border-bottom: 1px solid #1E1E2E
padding: 0 20px

Logo:
  - Icon: 28×28px, background #6C47FF, border-radius 7px
  - Text: "PATH" (white) + "WISE" (#6C47FF), 15px/700
  - Sub: "AI CAREER · STUDY HUB", 9px/400, #4A4A6A

Right side:
  - Breadcrumb button (ghost style)
  - Upgrade to Pro button (filled #6C47FF)
  - Dark mode toggle icon
  - Bell icon
  - Avatar: 30×30, rounded, #2A1A5E bg, #6C47FF border 1.5px
```

### 5.2 Sidebar
```
width: 200px
background: #0C0C18
border-right: 1px solid #1E1E2E
padding: 16px 0

Section labels:
  font-size: 10px, uppercase, letter-spacing: 0.08em
  color: #4A4A6A, padding: 0 20px, margin-bottom: 6px

Nav items:
  padding: 8px 10px (within 12px side padding container)
  border-radius: 8px
  gap: 9px (icon + text)
  icon: 15px, width: 16px (fixed for alignment)
  default: color #7070A0
  hover: background #1A1A2E, color #C0C0E0
  active: background #1E1030, color #A78BFA

Upgrade Box:
  margin: 12px
  background: #1A1030
  border: 1px solid #3A1A6E
  border-radius: 10px
  padding: 12px
  Title: #A78BFA, 12px/700
  Feature items: #7070A0, 10.5px, check icon in #6C47FF
  CTA button: full-width, #6C47FF bg, white text, 11.5px/700

User row (bottom):
  border-top: 1px solid #1E1E2E
  padding: 12px 20px
  Avatar 28×28 + name (11.5px/600 #C0C0E0) + plan (9.5px #4A4A6A)
```

### 5.3 Template Card
```
background: #0F0F1A
border: 1px solid #1E1E2E   (default)
border: 2px solid #6C47FF   (selected)
border-radius: 12px
cursor: pointer
transition: border-color 0.2s, transform 0.2s

Hover: border-color #3A2A6E, transform: translateY(-2px)

Thumbnail area:
  height: 100px
  background: #141420
  position: relative
  overflow: hidden
  Contains: miniature resume preview (see Resume Mini spec)

ATS Badge (top-left of thumbnail):
  background: #0A200A, border: 1px solid #1A5A1A
  border-radius: 5px, padding: 2px 7px
  font-size: 9px/800, color: #4ADE80

Crown Badge (top-right of thumbnail, PRO templates only):
  background: #1A1030, border: 1px solid #3A1A6E
  border-radius: 5px, padding: 2px 6px
  icon: ti-crown at 10px, color #F59E0B
  text: "PRO", 9px/700, color #A78BFA

Info area:
  padding: 10px 12px
  Name row: 12.5px/700 #D0D0F0 + inline ATS pill
  Description: 10.5px #5A5A7A

ATS Pill colors:
  90%+: bg #0A200A, color #4ADE80, border #1A4A1A
  85-89%: bg #1A1800, color #FBBF24, border #3A3000
```

### 5.4 Template Filter Tabs
```
Container: display: flex, gap: 4px

Tab:
  padding: 5px 12px
  border-radius: 6px
  border: 1px solid #1E1E2E
  background: transparent
  color: #6060A0
  font-size: 11px/500
  transition: all 0.15s

Active tab:
  background: #1E1030
  color: #A78BFA
  border-color: #3A1A6E

Sort button:
  display: flex, align-items: center, gap: 5px
  padding: 5px 10px
  background: #0F0F1A
  border: 1px solid #1E1E2E
  border-radius: 6px
  font-size: 11px, color: #6060A0
```

### 5.5 Feature Pills
```
display: flex, gap: 10px, flex-wrap: wrap

Each pill:
  display: flex, align-items: center, gap: 7px
  padding: 8px 14px
  background: #0F0F1A
  border: 1px solid #1E1E2E
  border-radius: 10px
  font-size: 11.5px, color: #8080A8
  icon: 14px, color: #6C47FF

  Inner:
    strong (label): 11.5px/600, color: #C0C0E0
    span (sub): 10px, color: #7070A0
```

### 5.6 Preview Panel
```
width: 300px
background: #0C0C18
border-left: 1px solid #1E1E2E
display: flex, flex-direction: column

Header (52px):
  padding: 12px 16px
  border-bottom: 1px solid #1E1E2E
  Left: template name (13px/700) + Premium badge
  Right: ATS score badge (green)

  Premium badge: bg #1A1030, border #3A1A6E, 9px/700, color #A78BFA
  ATS badge: bg #0A200A, border #1A5A1A, 11px/800, color #4ADE80

Body (flex: 1, overflow-y: auto):
  padding: 14px
  gap: 12px between sections

Resume Doc Preview:
  background: #FFFFFF (white paper)
  border-radius: 8px
  padding: 16px
  Contains actual resume content at reduced scale

Use Template Button:
  width: 100%
  background: #6C47FF
  color: white
  border: none
  padding: 10px
  border-radius: 8px
  font-size: 12.5px/700

AI Assistant Box:
  background: #0F0F1A
  border: 1px solid #1E1E2E
  border-radius: 10px
  padding: 12px
  Generate button: full-width, #6C47FF

Stats Row (3-col):
  Each stat: bg #0F0F1A, border #1E1E2E, border-radius 8px, padding 8px 10px
  Value: 14px/800
  Label: 9px, color #5A5A7A
```

---

## 6. Resume Miniature Preview Specs

These are the tiny resume thumbnails shown inside template cards.

### Classic Single-Column (Apex Pro, Zenith):
```
width: 56px
background: white
border-radius: 3px
padding: 5px

Header bar: full-width, height 8px, bg #0A0A2E
Lines: height 2px, bg #E0E0E8, margin 2px 0
Short lines: same but width 70%
Section markers: height 3px, bg #6C47FF, width 40%, margin 4px 0 2px
```

### Two-Column (Vertex Pro):
```
grid-template-columns: 1fr 1.4fr, gap 3px
Left col (sidebar): bg #F0F0F8, padding 3px, contains colored accent bars + lines
Right col (body): header bar + content lines
```

### Accent-Header (Momentum):
```
border-top: 4px solid #6C47FF
Header: full-width colored bar at top
Content below with section dividers
```

---

## 7. Responsive Behavior

```
Desktop (1280px+):   Full 3-panel layout as spec'd
Laptop (1024-1279px): Sidebar collapses to icon-only (48px)
Tablet (768-1023px):  Sidebar hidden (hamburger), preview panel hidden (tab switcher)
Mobile (<768px):      Single view with bottom nav, template picker as full-screen sheet
```

---

## 8. Animation & Interaction

```css
/* Template card hover */
.tcard { transition: border-color 0.2s ease, transform 0.2s ease; }
.tcard:hover { transform: translateY(-2px); }

/* Template card selection */
.tcard.selected { border: 2px solid #6C47FF; }

/* Nav item hover */
.nav-item { transition: background 0.15s ease, color 0.15s ease; }

/* Use Template button */
.use-btn { transition: background 0.15s ease; }
.use-btn:hover { background: #7C57FF; }

/* Filter tab transitions */
.ftab { transition: all 0.15s ease; }

/* Page entry (Framer Motion) */
initial: { opacity: 0, y: 20 }
animate: { opacity: 1, y: 0 }
transition: { duration: 0.3, ease: 'easeOut' }
```

---

## 9. ATS Score System

```
97-100%: Elite    → #4ADE80 green  → "Elite ATS"
92-96%:  High     → #4ADE80 green  → "High ATS"
85-91%:  Good     → #FBBF24 amber  → "Good ATS"
75-84%:  Average  → #FB923C orange → "Average ATS"
<75%:    Low      → #F87171 red    → "Needs Work"

Badge format: "{score}% ATS Match"
Shown on: template thumbnail (top-left), template card info row, preview panel header, stats row
```

---

## 10. Template Library

| Name | ATS | Type | Tier | Best For |
|------|-----|------|------|---------|
| Apex Pro | 97% | 2-column | Premium | General professional |
| Vertex Pro | 95% | Sidebar | Premium | Product/design roles |
| Momentum | 94% | Accent header | Free | Creative professionals |
| Zenith | 92% | Minimal single | Free | Any industry |
| Ascend | 91% | Dark header | Premium | Tech / engineering |
| Elite | 90% | Accent sidebar | Premium | Senior roles |
| Impact | 89% | Bold header | Free | Sales / marketing |
| Horizon | 88% | Clean modern | Premium | Finance / consulting |

---

## 11. States

### Empty State (no resume created yet):
```
Center panel shows: dashed border box with upload icon
Text: "Start by choosing a template above, or import your existing resume"
Two CTAs: "Choose Template" (primary) + "Import Resume" (ghost)
```

### Loading State (AI generating):
```
Skeleton overlays the preview doc area
Animated shimmer lines where text will appear
Status text cycles: "Analyzing profile..." → "Crafting content..." → "Almost ready..."
Purple progress bar at top of preview panel
```

### Success State (resume generated):
```
Green checkmark toast: "Resume generated successfully"
Preview panel shows completed resume
"Download PDF" button becomes primary CTA
ATS score animates from 0 to final value (count-up animation)
```

