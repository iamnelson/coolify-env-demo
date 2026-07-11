# Claude Code instructions

Read and follow [`AGENTS.md`](AGENTS.md) before making changes. It is the
canonical repository policy; this file only adds Claude Code-specific routing.

When work involves GitHub Actions, Docker, Coolify, runtime configuration,
dependencies, response security headers, SAST, DAST, or opening a PR, read and
apply [`.agents/skills/secure-delivery/SKILL.md`](.agents/skills/secure-delivery/SKILL.md).

Keep all production-facing actions opt-in. In particular, do not deploy, merge,
run security scans against the public production URL, reveal secrets, or modify
repository settings unless the user has clearly authorized that exact action.

Never edit `main` directly: create a branch, make a Conventional Commit that
passes commitlint, and open a draft PR before handing off the change.

Before handing off code, run `npm run lint` and `npm run build` when applicable,
then state what was run and what could not be validated.
