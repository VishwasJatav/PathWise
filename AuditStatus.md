# Audit Status Report

## Project
- **Project name:** Rixora
- **Workspace:** `D:\Rixora\my-app`
- **Audit date:** 2026-05-23
- **Audit scope:** End-to-end runtime validation, Docker validation, regression testing, dependency audit, git review, and secrets/config exposure review.

## Safety and Compliance
- The project contains a mandatory safety policy in [RULES.md](RULES.md).
- I followed the rule to **not modify** `.env` files or other sensitive files during the audit.
- I also restricted all verification to the Rixora workspace and Docker containers.

## Audit Summary
The application is **running successfully in local development and Docker**, but the audit uncovered several important issues that should be addressed before treating the project as production-ready.

### Overall status
- **Runtime:** PASS
- **Docker stack:** PASS
- **Homepage cache behavior:** PASS (no-store)
- **Git secret tracking:** PASS (no tracked `.env` files found)
- **Deep regression tests:** FAIL
- **Dependency vulnerability scan:** FAIL
- **Security hardening:** NEEDS ATTENTION

## Verification Evidence

### 1. Local runtime verification
- Command run: `npm run build`
- Evidence: build completed successfully with exit code `0`.
- Additional runtime verification:
  - `Invoke-WebRequest -Uri http://localhost:3000 -Method Head -UseBasicParsing`
  - Response: `200 OK`
  - Cache-Control: `private, no-cache, no-store, max-age=0, must-revalidate`

### 2. Docker verification
- Command run: `docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'`
- Evidence:
  - `my-app-app-1` is running on `0.0.0.0:3000->3000/tcp`
  - `my-app-db-1` is healthy on `0.0.0.0:5432->5432/tcp`
  - `my-app-redis-1` is healthy on `0.0.0.0:6379->6379/tcp`
  - `my-app-ollama-1` is running on `0.0.0.0:11434->11434/tcp`
- Additional service checks:
  - `docker exec my-app-redis-1 redis-cli ping` → `PONG`
  - `docker exec my-app-db-1 pg_isready -U rixora` → `accepting connections`
  - `Invoke-WebRequest -Uri http://127.0.0.1:11434/api/tags -UseBasicParsing` → returned `llama3:latest`

### 3. Auth behavior verification
- Manual request check:
  - `Invoke-WebRequest -Uri http://localhost:3000/resume -UseBasicParsing -MaximumRedirection 0`
  - Evidence: `307` redirect and `Location: http://localhost:3000/sign-in?redirect_url=http%3A%2F%2F0.0.0.0%3A3000%2Fresume`
- Conclusion: protected routes are currently redirecting unauthenticated users as expected.

### 4. Git review
- Command run: `git status --short`
- Evidence: working tree contains local modifications and untracked files, but **no tracked `.env` files**.
- Command run: `git log --oneline -10`
- Evidence: recent commits include security and build hardening changes.

### 5. Dependency audit
- Command run: `npm audit --audit-level=moderate`
- Evidence: **21 vulnerabilities** detected.
- Notable findings:
  - High severity in `@opentelemetry/auto-instrumentations-node`
  - High severity in `@opentelemetry/exporter-prometheus`
  - High severity in `js-cookie`
  - High severity in `next`
  - High severity in `protobufjs`
  - Moderate severity in `brace-expansion`
  - Moderate severity in `postcss`

### 6. Playwright regression suite
- Command run: `npx playwright test --reporter=line`
- Evidence: **39 passed, 10 failed, 16 skipped**

## Findings

### A. Security issues
1. **Secrets exposure risk in Docker Compose**
   - [docker-compose.yml](docker-compose.yml) uses `env_file: .env` and also injects explicit environment variables, including `DATABASE_URL` and `REDIS_URL`.
   - This creates a risk that `docker compose config` or container logs may print secrets or sensitive configuration values.
   - The audit confirmed this is a real concern because Compose configuration output can expose environment values.

2. **Destructive Prisma startup command**
   - [docker-entrypoint.sh](docker-entrypoint.sh) runs:
     - `npx prisma db push --accept-data-loss --skip-generate`
   - This is destructive and should not be used in production or production-like environments.
   - It can overwrite schema state unexpectedly and is not safe for a hardened deployment workflow.

3. **Dependency vulnerabilities**
   - The project has **21 npm audit findings**, including several high severity warnings.
   - The most urgent remediation area is the `next` runtime vulnerabilities and the OpenTelemetry/protobuf chain.

4. **Potential build artifact exposure**
   - The application uses Next.js standalone output. The audit observed build artifacts in local `.next` output and noted that generated files can persist environment values locally.
   - No env file was modified during the audit, but this is still a review item for hardening.

### B. Compatibility / maintainability issues
1. **Prisma datasource configuration warning risk**
   - [prisma/schema.prisma](prisma/schema.prisma) uses the legacy `url = env("DATABASE_URL")` syntax.
   - This was flagged as a compatibility risk during audit review and should be validated against the installed Prisma version.

2. **Legacy / mixed dependency state**
   - The git history shows repeated Prisma and dependency downgrades/upgrades.
   - This increases the risk of inconsistent package resolution and hidden build/runtime edge cases.

### C. Functional / regression issues
1. **Landing page E2E failures**
   - A number of tests failed because branding/logo assertions did not match the rendered DOM.
   - Visual regression checks also failed due to screenshot drift.

2. **Auth flow tests failed**
   - The auth tests expected `/sign-in` in the URL, but the runtime behavior in the test environment did not consistently match that expectation.

3. **Onboarding flow failures**
   - The onboarding tests could not find expected form elements and timed out when interacting with the industry selector.

4. **Resume builder failures**
   - Resume builder tests failed to find expected UI text and lacked the screenshot baseline required for one visual assertion.

## What is working
- Local development build succeeds.
- The app serves over HTTP and returns `200 OK`.
- Docker containers are healthy and reachable.
- Protected routes redirect unauthenticated users.
- Homepage is explicitly configured as `no-store`, so it is not cached.
- No tracked env files were found in git.

## What needs attention
1. Remove or reduce secret exposure in Docker runtime configuration.
2. Replace destructive database startup behavior in Docker.
3. Remediate npm audit findings.
4. Fix regression tests for landing page, auth, onboarding, and resume builder flows.
5. Validate Prisma schema compatibility with the installed Prisma version.
6. Review local build artifact handling to reduce the chance of environment leaking into generated files.

## Recommended next actions
1. **Security hardening**
   - Move Docker secrets out of `env_file` and inline environment entries.
   - Use Docker secrets or a dedicated secret management strategy.
   - Change startup behavior to avoid `db push --accept-data-loss` in production-like deployments.

2. **Dependency remediation**
   - Run `npm audit fix` or targeted upgrades for `next`, `@opentelemetry/*`, and `protobufjs`.

3. **Regression test repair**
   - Rework brittle selectors and visual assertions in the Playwright suite.
   - Add stable waiting conditions for onboarding and resume builder interactions.

4. **Prisma validation**
   - Verify the current Prisma schema and generated client are compatible with the installed Prisma version.
   - Update schema syntax if required.

## Final Assessment
The project is **operational**, but it is **not yet audit-clean**. The largest concerns are:
- **security exposure risk in Docker configuration**,
- **high-severity dependency vulnerabilities**, and
- **failing regression tests**.

No sensitive files were modified during this audit.
