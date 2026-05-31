# RULES.md — Rixora Project Audit Safety Rules

> **Version**: 1.0  
> **Created**: 2026-05-23  
> **Purpose**: Mandatory safety and operational rules for all audits, testing, and modifications of the Rixora project.

---

## 1. Read-Only Audit Rule

All audit operations are **read-only by default** unless explicit written permission is provided by the project owner.

### DO NOT modify, overwrite, rotate, regenerate, or delete:
- `.env` files (`.env`, `.env.local`, `.env.production`, etc.)
- Secret keys or API keys
- Authentication credentials
- Database credentials or connection strings
- Production configuration files
- Deployment configuration files
- Docker secrets
- CI/CD secrets or workflow tokens
- Any sensitive infrastructure files

### DO NOT:
- Commit changes automatically to git
- Push code to GitHub or any remote
- Deploy changes automatically to Vercel or any platform
- Update package versions without explicit approval
- Modify `package.json` or `package-lock.json` without approval
- Modify Prisma schema or run migrations without approval

### DO:
- Only **suggest** fixes and improvements
- Report findings in audit reports
- Wait for explicit owner approval before any modification

---

## 2. System Safety Boundaries

### DO NOT access or modify:
- Windows system files
- C: drive system folders (e.g., `C:\Windows`, `C:\Program Files`, `C:\Users\<user>\AppData`)
- Operating system configuration files
- Windows Registry
- Unrelated applications or services
- Personal user files outside the Rixora project directory (`D:\Rixora`)

### RESTRICT all operations to:
- The Rixora project workspace: `D:\Rixora\` and its subdirectories
- Rixora Docker containers (when applicable)

---

## 3. Security-First Auditing

- Treat **all secrets** as highly sensitive material
- **Never** print, log, or display full secret values in output or reports
- If secrets are detected in source code, git history, or configurations:
  - **Mask** them (e.g., `sk-****...****`)
  - **Report** the exposure risk safely
  - **Recommend** mitigation steps
- **Never** exfiltrate, copy, or expose credentials outside the audit report
- Use redacted/masked values in all documentation

---

## 4. Safe Testing Rules

- Perform only **safe, local, non-destructive testing**
- **No** destructive testing (data deletion, database drops, etc.)
- **No** denial-of-service testing or behavior
- **No** privilege escalation attempts
- **No** malicious payload generation
- **No** external exploitation or penetration testing
- **No** network scanning of external services
- **No** unauthorized API calls to production services
- Test only in local/development environments

---

## 5. Docker Safety Rules

- **Do NOT** modify host system from within containers
- **Do NOT** mount sensitive host directories into containers
- **Do NOT** run containers with `--privileged` flag in testing
- **Do NOT** expose container ports to public networks during testing
- Inspect and verify container configurations in read-only mode
- Only start/stop containers for verification purposes

---

## 6. File Modification Approval Process

Before modifying any of the following files, **explicit owner approval is required**:

| File/Category | Approval Required |
|---|---|
| `.env`, `.env.local`, `.env.production` | ✅ Always |
| `package.json` / `package-lock.json` | ✅ Always |
| `prisma/schema.prisma` | ✅ Always |
| `docker-compose.yml` / `Dockerfile` | ✅ Always |
| `next.config.mjs` | ✅ Always |
| `middleware.js` | ✅ Always |
| CI/CD workflows (`.github/workflows/`) | ✅ Always |
| `vercel.json` | ✅ Always |
| Source code fixes | ✅ Ask first |
| New test files | ⚠️ Preferred |
| Documentation updates | ℹ️ Informational |

---

## 7. Reporting Standards

- All findings must include:
  - **Severity**: Critical / High / Medium / Low
  - **Description**: Clear explanation of the issue
  - **Impact**: What could happen if exploited
  - **Location**: File path and line number(s)
  - **Recommendation**: Specific fix or mitigation
- Secrets must be **masked** in all reports
- Reports should be saved within the project audit directory

---

## 8. Compliance

- All future audits of this project **must** read and follow this `RULES.md`
- Any changes to these rules require owner approval
- These rules apply to all automated tools, agents, and scripts operating on this project

---

*These rules ensure safe, non-destructive, and policy-compliant auditing of the Rixora project.*
