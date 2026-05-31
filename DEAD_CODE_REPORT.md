# Rixora Dead Code Report

## Overview
A significant portion of the codebase is orphaned, unused, or misconfigured. `knip` and `depcheck` identified multiple unused files, unresolved imports, and unused dependencies.

## Unused Files (55 Total)
The following files are not imported anywhere in the entry points of the application and can likely be deleted:
* `actions/api-usage.js`
* `actions/cover-letter.js`
* `actions/dashboard.js`
* `actions/interview.js`
* `actions/resume.js`
* `actions/user.js`
* `app/(main)/resume/_components/resume-builder.jsx`
* `app/lib/helper.js`
* `app/lib/schema.js`
* `app/page.module.css`
* `components/header-user-sync.jsx`
* `components/header.jsx`
* `components/hero.jsx`
* `components/loaders/AILoader.jsx`
* `components/loaders/ButtonLoader.jsx`
* `components/loaders/GlobalLoader.jsx`
* `components/loaders/RouteTransitionLoader.jsx`
* `components/providers/client-logger-provider.jsx`
* `components/providers/loading-provider.jsx`
* `components/theme-provider.jsx`
* *34+ other UI components and data files...*

**Why it's a problem:** Unused files increase repository size, slow down IDE indexing, and confuse developers about what is actually running in production.
**Severity:** Low (Mainly impacts developer experience)
**Fix Recommendation:** 
1. Review the list of 55 files output by `npx knip`.
2. Delete them sequentially after confirming they aren't dynamically imported.
**Performance Gain:** Faster linting, smaller repository size, cleaner project tree.

## Unused Dependencies
The following dependencies are declared in `package.json` but not used in the code:
* `@google/generative-ai`
* `@prisma/client`
* `@radix-ui/react-accordion`
* `@radix-ui/react-alert-dialog`
* `@radix-ui/react-dialog`
* `chart.js`
* `react-chartjs-2`
* `dotenv`
* `ioredis`
* `next-themes`
* *and 12 others...*

**Why it's a problem:** Bloats `node_modules`, increases `npm install` time, and increases the attack surface for supply chain vulnerabilities.
**Severity:** Medium
**Fix Recommendation:** Run the following command:
```bash
npm uninstall @google/generative-ai @prisma/client @radix-ui/react-accordion @radix-ui/react-alert-dialog @radix-ui/react-dialog chart.js react-chartjs-2 dotenv ioredis next-themes tailwind-merge class-variance-authority clsx cmdk
npm uninstall -D autoprefixer eslint-config-next postcss tw-animate-css
```
*(Note: Verify if `@prisma/client` or `dotenv` are used in external scripts before deleting)*
**Performance Gain:** Significantly faster CI/CD pipelines and smaller Docker images.

## Unresolved Imports (108 Total)
`knip` flagged 108 instances of unresolved imports. For example, `app/(main)/ai-cover-letter/_components/cover-letter-generator.jsx` fails to resolve `@/components/ui/button`.

**Why it's a problem:** Either the import aliases (`@/`) are misconfigured in `jsconfig.json`, or the files were moved/deleted.
**Severity:** High
**Fix Recommendation:** Fix `jsconfig.json` path aliases or correct the import paths in the respective components.
