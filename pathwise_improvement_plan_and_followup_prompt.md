# Rixora Improvement Plan

## Project Overview
Rixora is an AI-powered Career Guidance SaaS platform built using:

- Next.js
- React
- TailwindCSS
- ShadCN UI
- Prisma
- PostgreSQL
- Clerk Authentication
- Gemini / Ollama AI
- Docker
- Vercel
- Playwright E2E Testing

The audit confirms that the platform is operational and architecturally strong, but several important improvements are required before production-grade deployment.

---

# Current Audit Summary

## Working Correctly

### Runtime
- Next.js build succeeds successfully.
- Application serves correctly on localhost.
- Protected routes redirect correctly.
- Homepage cache behavior is configured properly.

### Docker Infrastructure
- PostgreSQL container healthy.
- Redis container healthy.
- Ollama container running correctly.
- App container operational.

### Security Positives
- No tracked `.env` files found in Git.
- Authentication middleware working.
- Docker services isolated correctly.

### Testing
- Playwright integration successfully configured.
- E2E test suite operational.
- Accessibility scanning integrated.
- Visual regression infrastructure partially configured.

---

# Critical Problems Found During Audit

## 1. Dependency Vulnerabilities (CRITICAL)

### Current Status
- 21 npm audit vulnerabilities detected.
- Several HIGH severity findings.

### Affected Packages
- next
- js-cookie
- protobufjs
- @opentelemetry/*
- postcss

### Risks
- XSS vulnerabilities
- runtime exploits
- dependency-chain attacks
- SSR vulnerabilities

### Required Actions
1. Run:

```bash
npm audit
```

2. Apply automatic safe fixes:

```bash
npm audit fix
```

3. Upgrade critical packages manually.

4. Re-test the entire application after upgrades.

---

# 2. Dangerous Prisma Startup Command (CRITICAL)

## Current Problem
The Docker startup process currently runs:

```bash
npx prisma db push --accept-data-loss --skip-generate
```

This is dangerous for production environments.

## Risks
- schema corruption
- accidental data loss
- unsafe database overwrites
- production instability

## Required Fix
Replace current behavior with:

```bash
npx prisma migrate deploy
```

Implement proper Prisma migration workflows.

---

# 3. Docker Secret Exposure Risk (HIGH)

## Current Problem
Docker Compose currently injects secrets using:

```yaml
env_file: .env
```

This may expose environment variables through:
- docker compose config
- logs
- container inspection

## Required Fixes
- Move secrets to Docker secrets or runtime injection.
- Avoid printing sensitive env values.
- Reduce inline secret exposure.
- Validate production-safe container configuration.

---

# 4. Regression Test Failures (HIGH)

## Current Test Status
- Passed: 39
- Failed: 10
- Skipped: 16

## Main Failures
### Landing Page
- branding selector mismatches
- visual snapshot drift

### Authentication
- inconsistent redirect behavior

### Onboarding
- dropdown instability
- missing selectors
- timeout issues

### Resume Builder
- UI rendering mismatch
- missing visual baselines
- unstable layout behavior

## Required Actions
- stabilize selectors
- use data-testid attributes
- improve wait conditions
- repair visual snapshots
- improve responsive behavior

---

# 5. Resume Builder Stabilization (HIGH)

## Problems
- nested UI rendering
- scaling issues
- overflow problems
- fullscreen modal issues
- inconsistent preview synchronization

## Required Improvements
### UI Architecture
- Full-width SaaS editor layout
- Real-time preview synchronization
- Proper fullscreen preview
- Improved responsive behavior

### Features
- ATS optimized templates
- AI-assisted editing
- drag-and-drop sections
- autosave
- PDF export optimization

### UX Improvements
- glassmorphism UI
- premium loaders
- modern animations
- improved template switching

---

# 6. AI Infrastructure Hardening (HIGH)

## Current Problems
- AI parsing instability
- fallback risks
- malformed JSON handling

## Required Improvements
### Multi-Provider AI Architecture
Primary:
- Gemini 1.5 Flash / Gemini 2.0 Flash

Fallback:
- Groq Llama3

Backup:
- Ollama local model

### Required Features
- safe JSON parsing
- schema-controlled AI responses
- retry logic
- timeout handling
- graceful fallbacks

---

# 7. Accessibility Improvements (MEDIUM)

## Problems
- insufficient color contrast
- missing aria-labels
- accessibility violations

## Required Fixes
- improve dark mode contrast
- add aria labels to icons/buttons
- improve keyboard navigation
- maintain WCAG AA compliance

---

# 8. CI/CD & Deployment Improvements

## Required Features
### GitHub Actions
Add:

```txt
.github/workflows/e2e.yml
```

### Pipeline Features
- build verification
- Playwright execution
- Docker testing
- screenshot uploads on failure
- visual regression validation

---

# 9. Performance Optimization

## Frontend
- optimize hydration
- reduce bundle size
- optimize animations
- reduce layout shifts

## Backend
- optimize Prisma queries
- improve API latency
- optimize AI requests
- improve caching

## Resume Builder
- improve live rendering performance
- optimize PDF export

---

# 10. Monitoring & Observability

## Add
- Sentry
- request tracing
- structured logging
- API timing metrics
- frontend error tracking

---

# Phase-Wise Execution Plan

# PHASE 1 — Critical Security
Priority: CRITICAL

Tasks:
1. Remove dangerous Prisma startup command.
2. Fix npm audit vulnerabilities.
3. Harden Docker secret handling.
4. Validate environment isolation.

---

# PHASE 2 — Core Stability
Priority: HIGH

Tasks:
1. Fix onboarding flow.
2. Stabilize Resume Builder.
3. Repair Playwright failures.
4. Improve selector stability.

---

# PHASE 3 — AI Reliability
Priority: HIGH

Tasks:
1. Implement AI fallback architecture.
2. Add safe JSON parsing.
3. Add schema validation.
4. Add timeout handling.

---

# PHASE 4 — UI/UX Modernization
Priority: MEDIUM

Tasks:
1. Improve loaders.
2. Add glassmorphism UI.
3. Improve animations.
4. Improve responsive layouts.
5. Improve accessibility.

---

# PHASE 5 — CI/CD & Production Readiness
Priority: MEDIUM

Tasks:
1. GitHub Actions integration.
2. Visual regression automation.
3. Production deployment validation.
4. Monitoring integration.

---

# Final Goal

Transform Rixora from:

AI SaaS MVP

into:

Production-grade scalable AI Career Platform.

The final platform should be:
- secure
- scalable
- Docker hardened
- CI/CD automated
- AI resilient
- visually stable
- accessible
- production ready

---

# FOLLOW-UP MASTER PROMPT FOR ANTIGRAVITY

You are a Senior Full-Stack Software Architect, Security Engineer, AI Systems Engineer, DevOps Engineer, and UI/UX Architect.

Your task is to deeply analyze the Rixora AI Career SaaS platform and implement the improvements listed in the Improvement Plan document.

The platform is already operational but requires production hardening, security remediation, AI stabilization, regression repair, and UI modernization.

Strictly follow these rules:

1. Do NOT modify `.env` or sensitive files without explicit permission.
2. Do NOT touch Windows system files or unrelated directories.
3. Restrict all operations to the Rixora project workspace.
4. Do NOT deploy automatically.
5. Do NOT push commits automatically.
6. Maintain Docker compatibility.
7. Preserve the existing black SaaS UI theme.

--------------------------------------------------

# PRIMARY OBJECTIVES

1. Fix all critical security issues.
2. Stabilize the Resume Builder.
3. Repair failing Playwright tests.
4. Improve Docker hardening.
5. Implement AI fallback architecture.
6. Upgrade the UI into a premium SaaS experience.
7. Improve performance and reliability.
8. Prepare the system for production deployment.

--------------------------------------------------

# IMPLEMENTATION REQUIREMENTS

## Security
- Remove destructive Prisma startup commands.
- Remediate npm vulnerabilities.
- Improve Docker secret handling.
- Add stronger schema validation.
- Add API rate limiting.

## Testing
- Fix failing Playwright tests.
- Stabilize onboarding tests.
- Repair Resume Builder E2E flows.
- Improve visual regression stability.

## Resume Builder
- Implement real-time preview.
- Improve fullscreen preview.
- Add ATS resume templates.
- Improve PDF export.
- Fix scaling and overflow issues.
- Improve responsive layout.

## AI Infrastructure
- Add Gemini + Groq + Ollama fallback system.
- Add safe JSON parsing.
- Add retry logic.
- Add timeout handling.
- Add schema-controlled AI output.

## UI Modernization
- Improve loaders.
- Add premium animations.
- Add glassmorphism effects.
- Improve buttons.
- Improve onboarding UX.
- Improve dashboard polish.

## Performance
- Optimize rendering.
- Improve API performance.
- Reduce bundle size.
- Optimize animations.
- Improve caching.

## CI/CD
- Add GitHub Actions.
- Add automated Playwright execution.
- Add screenshot/video uploads.
- Validate Docker startup automatically.

--------------------------------------------------

# EXECUTION STRATEGY

1. Analyze current architecture deeply.
2. Create implementation roadmap.
3. Fix critical security issues first.
4. Repair regression failures.
5. Stabilize Resume Builder.
6. Improve AI reliability.
7. Modernize UI.
8. Run full testing after every major phase.
9. Generate final verification report.

--------------------------------------------------

# FINAL GOAL

Transform Rixora into a production-grade AI SaaS platform with:

- stable infrastructure
- secure deployment
- premium UI/UX
- AI resilience
- reliable testing
- scalable architecture
- professional SaaS quality

Do not patch issues temporarily.
Implement clean, maintainable, production-ready solutions.

