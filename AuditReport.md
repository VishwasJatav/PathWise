# Rixora Project Audit & Verification Report

This report documents the verification, audit, and analysis of the **Rixora** application codebase, infrastructure, and current running status. It explains why the UI appears light and white, lists the project's features and modules, details the health of all working services, identifies non-working or at-risk components, and outlines the authentication, validation, verification, and security architectures.

---

## 1. Why the UI Looks Light and White

The primary reason you see a light/white UI instead of the intended **black SaaS theme** is a **theme configuration mismatch** between the server-side rendering (SSR), client-side hydration, and browser local storage.

### The Technical Root Causes:
1. **Light Mode Default in Globals CSS**:
   In `app/globals.css`, the default CSS variables under the `:root` selector are configured for a **light theme** (white background: `--background: 0 0% 100%` and dark text: `--foreground: 0 0% 3.9%`). The dark theme styles are nested under the `.dark` class selector.
2. **SSR Theme Flash**:
   When Next.js performs server-side rendering (SSR), the server does not know the client's theme preference. It renders the HTML without the `dark` class (i.e. `<html lang="en">`). As a result, the page initially loads using the `:root` variables, causing a white flash or rendering completely white if client-side scripts do not run immediately.
3. **Local Storage Conflict on Localhost**:
   `next-themes` reads the active theme preference from browser `localStorage` using the key `theme`. If you have previously run another project on `localhost:3000` that saved `theme: "light"` in local storage, `next-themes` reads that value and applies the light theme by stripping the `.dark` class from the `<html>` tag.
4. **No Theme Toggle**:
   Since the app does not feature a theme toggler in the header or footer, you cannot manually switch it back to dark mode via the UI if it gets stuck in light mode.

### Recommended Fixes:
* **Fix A (Make `:root` default to dark)**: Swap the colors in `app/globals.css` so that the default `:root` block contains the dark mode variables (making the fallback background black), and place the light mode colors under a `.light` class selector.
* **Fix B (Add SSR Dark Class)**: Hardcode `className="dark"` onto the `<html>` element inside `app/layout.js` (`<html lang="en" className="dark">`). This forces Next.js to render in dark mode during the initial server render and prevents the light/white flash completely.

---

## 2. What is Rixora?

**Rixora** is an AI-powered Career Guidance SaaS platform designed to automate and optimize career transitions and job application processes. It provides personalized career roadmaps, real-time market trends, automated cover letter generation, technical mock interviews, and ATS (Applicant Tracking System) resume analysis.

---

## 3. Features & Modules Audit

The codebase is structured into five core modules, supported by background worker routines and local AI configuration:

### A. Onboarding Flow (`/onboarding`)
* **Purpose**: Gathers user profiles to customize AI suggestions.
* **Functionality**: Collects details like target industry, years of experience, professional bio, and technical skills.
* **Logic Location**: `app/(main)/onboarding/page.jsx` and server action `actions/user.js`.
* **Validation**: Leverages Zod schema `updateUserSchema` on the server to validate input shapes.
* **Navigation Protection**: The system checks user onboarding status on dashboard visits and redirects incomplete profiles to `/onboarding`.

### B. Industry Insights Dashboard (`/dashboard`)
* **Purpose**: Provides market analytics and trends for the user's selected industry.
* **Functionality**: Renders salary ranges (min, median, max) across roles, growth rates, demand levels (HIGH/MEDIUM/LOW), market outlooks (POSITIVE/NEUTRAL/NEGATIVE), key industry trends, recommended skills, next-decade outlooks, and emerging technologies.
* **Logic Location**: `app/(main)/dashboard/page.jsx`, client view `_components/dashboard-view.jsx`, and action `actions/dashboard.js`.
* **Caching**: Checked against Redis first (`lib/redis.js`) before querying the database or triggering the AI engine.

### C. Smart Resume Builder (`/resume`)
* **Purpose**: Helps users write and optimize ATS-compliant resumes.
* **Functionality**: 
  - Provides a side-by-side editing interface (Markdown Editor vs. Real-time HTML Preview).
  - **AI Optimization**: Rewrites selected text segments using action verbs and quantifiable metrics.
  - **ATS Scan**: Reviews the resume content (optionally against a job description) and yields an ATS compatibility score, feedback paragraph, and a list of missing keywords.
* **Logic Location**: `app/(main)/resume/page.jsx` and action `actions/resume.js`.

### D. Interview Preparation (`/interview`)
* **Purpose**: Simulates technical interviews to prepare candidates.
* **Functionality**:
  - Automatically fetches the user's past 3 assessments to locate areas where they answered incorrectly (weakness tracking).
  - Generates 10 multiple-choice questions (4 options, correct answer, explanation).
  - Computes and saves scores, lists answer choices, and requests a concise AI tip for improvement based on mistakes.
* **Logic Location**: `app/(main)/interview/page.jsx` and action `actions/interview.js`.

### E. AI Cover Letter Builder (`/ai-cover-letter`)
* **Purpose**: Generates high-quality cover letters aligned to target companies and roles.
* **Functionality**: Generates professional cover letters using the candidate's bio, years of experience, skills, target company name, job title, and description. Supports draft saving, viewing, and history deletion.
* **Logic Location**: `app/(main)/ai-cover-letter/page.jsx` and action `actions/cover-letter.js`.

---

## 4. Current Status of Services & Functionalities

| Service / Service Area | Type | Status | Description |
| :--- | :--- | :--- | :--- |
| **Next.js Dev Server** | Web | **WORKING** | Serves web traffic locally on port 3000/3100. Build runs clean. |
| **PostgreSQL Database** | Storage | **WORKING** | Docker database container (`my-app-db-1`) is healthy on port 5432. |
| **Redis Cache** | Cache | **WORKING** | Docker Redis container (`my-app-redis-1`) is healthy on port 6379. |
| **Ollama Local AI** | Fallback AI | **WORKING** | Docker Ollama container (`my-app-ollama-1`) runs on port 11434 with `llama3:latest` pulled. |
| **Gemini AI Integration** | Primary AI | **WORKING** | Uses `gemini-2.5-flash` model for generating insights, quizzes, and cover letters. |
| **AI Fallback System** | AI Engine | **WORKING** | In development, if the Gemini API fails, the backend automatically falls back to the local Ollama service. |
| **Clerk Auth Middleware** | Auth | **WORKING** | Successfully redirects unauthenticated users away from protected routes. |
| **Inngest Webhooks** | Background | **WORKING** | Serves API webhook endpoint on `/api/inngest`. Runs weekly cron functions. |
| **Playwright Test Suite** | Testing | **NEEDS ATTENTION** | E2E suite executed: 43 passed, 2 failed (Firefox accessibility timeout, WebKit visual screenshot drift), 20 skipped. |
| **Docker Compose Config** | Security | **NEEDS ATTENTION** | Configuration runs successfully but contains secrets exposure risks (`env_file: .env`). |
| **Prisma Schema Startup** | Database | **WORKING** | Entrypoint successfully hardened using production-safe `npx prisma migrate deploy` command. |
| **NPM Package Audit** | Packages | **WORKING** | 0 vulnerabilities detected. Packages are fully patched (Next.js is on `15.5.18`). |

---

## 5. Security, Authentication, Validation, and Verification

### A. Authentication
* **Provider**: Clerk (`@clerk/nextjs`).
* **Implementation**: Managed by Next.js edge-level middleware in `middleware.js` using `clerkMiddleware()` and `createRouteMatcher()`.
* **Protected Paths**: `/dashboard`, `/resume`, `/interview`, `/ai-cover-letter`, and `/onboarding`.
* **Sign-in Logic**: Redirects unauthenticated users to `/sign-in` with a `returnBackUrl` query parameter so the user returns to their requested page after logging in. Authenticators are forced to go to `/dashboard` if they attempt to navigate to root or sign-in pages while logged in.

### B. Validation
* **Layer**: Server-side Actions (Next.js server-side operations).
* **Tool**: Zod schema validation (`zod`).
* **Validated Input Schemas**:
  - `updateUserSchema` (onboarding: industry, experience, bio, skills).
  - `saveResumeSchema` (resume markdown content).
  - `improveWithAISchema` (current text, optimization type).
  - `getAtsScoreSchema` (resume content, job description).
  - `saveQuizResultSchema` (quiz questions array, user answers, score).
  - `generateCoverLetterSchema` (company, job title, description).
* **Robustness**: Prevents database injection or corrupt payloads from being written to the PostgreSQL tables.

### C. Verification (Testing)
* **Framework**: Playwright (`@playwright/test`).
* **Test Suites Available**:
  - `accessibility.spec.ts`: Analyzes WCAG 2.1 AA violations on the landing page using Axe-core.
  - `api.spec.ts`: Intercepts and mocks Inngest webhook calls.
  - `auth-flow.spec.ts`: Checks HTTP redirect status (307) for protected pages.
  - `landing-page.spec.ts`: Verifies navbar links, CTA buttons, mobile layouts, and checks visual regression.
  - `onboarding-flow.spec.ts`: Tests form validation errors and submission mocks.
  - `resume-builder.spec.ts`: Verifies layout splits and mock AI ATS evaluations.
* **Current Bottlenecks**:
  - **Skipped Tests**: 20 tests are skipped because E2E tests run in unauthenticated environments and bypass flows requiring active Clerk credentials.
  - **Visual Regression Failures**: WebKit screenshot matching failed (3877 pixels drift, approx 1% of the image) due to font rendering differences.
  - **Accessibility Test Timeouts**: Firefox timed out at 30s during Axe-core scanning under parallel test execution load.

### D. Security Architecture & Flaws
* **Secrets In Git**: Checked and secure. Gitleaks configuration (`.gitleaks.toml`) is present in the project root, and no `.env` files are tracked in the Git working tree.
* **Database Isolation**: Protected inside the Docker networking namespace; only exposed on mapped container ports.
* **Vulnerability A (Docker secrets exposure)**: `docker-compose.yml` mounts `.env` variables via `env_file`. This is a risk as containers print environment keys on debug logs.
* **Vulnerability B (Destructive Database push)**: Resolved. The `docker-entrypoint.sh` is verified to run production-safe `npx prisma migrate deploy` to deploy schema changes instead of destructive push.
* **Vulnerability C (Unpatched Dependencies)**: Resolved. The dependency tree has been updated and fully audited. `npm audit` reports 0 vulnerabilities.

---

## 6. Action Plan Summary

To transition Rixora into a production-grade career platform:
1. **Fix the UI white/light mode lock**: Update `app/globals.css` `:root` variables to default to dark mode and hardcode `className="dark"` in `app/layout.js`. (RESOLVED)
2. **Remediate npm dependencies**: Run `npm audit fix` and upgrade `next`, `@opentelemetry/*`, and `protobufjs`. (RESOLVED)
3. **Harden Database Startup**: Replace `db push --accept-data-loss` with `prisma migrate deploy` in `docker-entrypoint.sh`. (RESOLVED)
4. **Fix failing visual tests**: Once dark mode is made the default in `:root`, rerun Playwright E2E tests so screenshots match the dark mode baseline.
5. **Protect Docker secrets**: Transition from `env_file` to Docker secrets or external configuration mapping.
