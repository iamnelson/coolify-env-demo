# Agent operating guide

## Mission and boundaries

Maintain this small Next.js application and its GitHub-to-Coolify delivery
pipeline without exposing credentials, weakening security controls, or making
unapproved production changes. Prefer small, reviewable changes.

This file is the canonical instruction set for every coding agent. Read it
before editing files. `CLAUDE.md` is an adapter for Claude Code and must remain
consistent with this file.

## Repository map

- `app/` — Next.js App Router application and health endpoint.
- `next.config.ts` — standalone output and response security headers.
- `Dockerfile` — production image; it must keep the non-root runtime user.
- `.github/workflows/deploy.yml` — publishes the image and deploys through the
  Coolify API. Treat it as production infrastructure.
- `.github/workflows/sast.yml` — CodeQL static analysis.
- `.github/workflows/dast.yml` and `.zap/rules.tsv` — isolated OWASP ZAP scan
  and its failure policy.
- `.agents/skills/secure-delivery/` — reusable secure delivery procedure.

## Non-negotiable safety rules

1. Never print, commit, copy into documentation, or echo environment secrets,
   access tokens, GitHub tokens, Coolify API tokens, or real `.env*` files.
   Only `.env.example` is intentionally tracked.
2. Never deploy, trigger a production redeploy, rotate credentials, change
   GitHub repository settings, merge a PR, or delete remote data without clear
   user authorization in the current request.
3. Do not scan the public production URL with DAST. The repository DAST scan
   must keep targeting the temporary container on its private Docker network.
4. Preserve the container's non-root user, multi-stage build, health endpoint,
   and security headers unless the requested change explicitly requires a
   reviewed replacement.
5. Do not silence SAST/DAST findings merely to make CI green. A new exception
   needs a written reason, the narrowest possible scope, and a follow-up fix
   when applicable.
6. Treat workflow files, Dockerfiles, dependency lockfiles, and authentication
   or environment-variable changes as security-sensitive. Explain their impact
   in the PR.

## Working procedure

1. Inspect `git status` and the relevant files before editing. Preserve changes
   that are not part of the request.
2. Make the smallest viable change. Use existing patterns and avoid unrelated
   formatting churn.
3. Run `npm run lint` and `npm run build` after application, configuration, or
   dependency changes. Report any validation that could not run and why.
4. For CI changes, review the workflow trigger, permissions, secrets exposure,
   timeout, cleanup path, and artifact retention before handoff.
5. Update `README.md` when user-facing operation, configuration, deployment,
   or security behaviour changes.

## Mandatory Git and review rules

- Never make changes directly on `main`. Create a `codex/<short-description>`
  branch before the first edit, unless the user specifies another branch name.
- Stage only files that belong to the requested change. Do not amend, force
  push, reset hard, or discard unrelated changes without explicit permission.
- Use a Conventional Commit message accepted by commitlint, for example
  `ci: add security scan`. Do not bypass a commit hook.
- Every change must be published through a pull request targeting `main`.
  Open it as a draft by default; do not merge it unless the user explicitly
  asks after the required checks have passed.
- Use `.github/pull_request_template.md` and include validation results and any
  security exceptions.

## Security-specific guidance

- Use the `secure-delivery` skill for changes to workflows, Docker, deployment,
  runtime configuration, dependencies, SAST, DAST, headers, or PR publication.
- Keep GitHub Actions permissions at the least privilege required.
- Pin actions to a supported major version already used by the repository;
  document any new third-party action or container image.
- Keep the DAST reports as workflow artifacts, even when the scan fails.
- Prefer fixing headers or application behaviour over ignoring a ZAP rule.

## Commands

```bash
npm run lint
npm run build
```

Docker-based checks require a running Docker engine. Do not substitute a
production scan when Docker is unavailable.
