---
name: secure-delivery
description: Safely change, validate, and publish this repository's application, Docker, deployment, dependency, security-header, SAST, DAST, and GitHub Actions configuration. Use when work touches app delivery, Coolify, environment variables, workflows, Docker, CodeQL, OWASP ZAP, dependencies, security controls, branches, commits, or pull requests.
---

# Secure Delivery

Use this procedure before changing delivery or security-sensitive parts of the
repository. Follow `AGENTS.md` as the source of truth when this skill and the
repository instructions differ.

## Assess scope

1. Inspect `git status`, the target files, and current workflow configuration.
2. Identify whether the change can expose secrets, reach production, widen
   permissions, bypass a security control, or alter a release path.
3. Stop and ask for direction before an external production action, destructive
   action, secret rotation, repository-setting change, or merge.

## Implement safely

1. Preserve the non-root Docker runtime, `/api/health`, standalone output, and
   existing response security headers unless replacing them deliberately.
2. Keep GitHub Actions permissions minimal. Use explicit timeouts and cleanup
   temporary containers, networks, and artifacts.
3. Keep DAST isolated: build the current commit, start it on a private Docker
   network, scan only that target, and upload reports even on failure.
4. Treat a CodeQL or ZAP exception as a security decision. Keep it narrowly
   scoped, explain it in the PR, and prefer a real remediation.
5. Never place real credentials in source, logs, shell output, workflow YAML,
   or documentation.

## Validate and hand off

1. Run `npm run lint` and `npm run build` for application or configuration
   changes.
2. State any unavailable validation, such as a missing Docker engine, without
   substituting a scan of production.
3. Update README documentation when operations or security behaviour changes.
4. Create a `codex/` branch before editing, make a Conventional Commit that
   passes commitlint, and publish every change through a draft PR to `main`.
5. Complete the PR template and never merge without explicit user approval.
