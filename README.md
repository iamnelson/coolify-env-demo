# coolify-env-demo

**A live, working proof that config lives in GitHub — not in the deployment target.**

[![Build and deploy](https://github.com/iamnelson/coolify-env-demo/actions/workflows/deploy.yml/badge.svg)](https://github.com/iamnelson/coolify-env-demo/actions/workflows/deploy.yml)
![Next.js](https://img.shields.io/badge/Next.js-App%20Router-black?logo=next.js)
![Docker](https://img.shields.io/badge/Docker-multi--stage-2496ED?logo=docker&logoColor=white)
![Coolify](https://img.shields.io/badge/Coolify-self--hosted%20PaaS-6c4cf5)
![Self-hosted runner](https://img.shields.io/badge/CI-self--hosted%20runner-2b2b2b?logo=githubactions&logoColor=white)

**Live app:** https://coolify-env-demo.nelsoncarv.work

---

## The problem this solves

Every team eventually asks: *"if I change a value in GitHub, does it actually reach production — and can I prove it without SSH-ing into a box?"*

This repo is a minimal, disposable answer. One push updates a GitHub Actions **Variable** and **Secret**, and within a couple of minutes the *exact same values* are readable — server-side only — on a container running behind Coolify, Traefik, and Cloudflare. No dashboards to trust blindly, no "should be updated" — the page renders the live value on every request.

## Architecture

```mermaid
flowchart LR
    A[GitHub Actions\nVariables & Secrets] -->|workflow run| B[Self-hosted runner\nlabel: docker-build]
    B -->|docker build & push| C[(GHCR\nghcr.io/iamnelson/coolify-env-demo)]
    B -->|PATCH /envs/bulk\nPOST /deploy| D[Coolify API]
    D --> E[Coolify\npulls image + injects env]
    E --> F[Next.js container\nreads process.env at request time]
    F -->|HTTPS via Cloudflare| G((coolify-env-demo.nelsoncarv.work))
```

**No shared secret store, no manual dashboard edits.** GitHub Actions is the single source of truth; Coolify is just the runtime.

## What's actually being proven

| Claim | How it's verified |
|---|---|
| Env vars are read server-side, not baked into the client bundle | `app/page.tsx` is a server component with `export const dynamic = "force-dynamic"` — values are resolved per-request, never inlined at build time |
| Secrets stay secret | The page renders a masked preview (`Toda...ay`) of `APP_SECRET_HINT`, never the raw value — same principle you'd want for API keys in a real app |
| GitHub is the deploy trigger, not a human clicking around | `git push` → self-hosted Actions runner (`docker-build` label) → build, push to GHCR, sync vars to Coolify, trigger redeploy — zero manual steps |
| The loop is closed | Change `APP_MESSAGE` in **Settings → Secrets and variables → Actions**, re-run the workflow, refresh the page — new value, new `BUILD_TIME` |

## Stack

- **Next.js (App Router, TypeScript)** — server component, standalone output build
- **Docker** — multi-stage build, non-root runtime user, `~150MB` final image
- **GitHub Actions** — self-hosted runner (`docker-build` label), builds and pushes to GHCR
- **Coolify** — deployment target, Traefik reverse proxy, Cloudflare in front

## Try it yourself

```sh
npm install
npm run dev
```

Copy `.env.example` → `.env.local` first. Healthcheck lives at `/api/health`.

## Prove it end-to-end

1. Go to **Settings → Secrets and variables → Actions** on this repo
2. Edit the `APP_MESSAGE` variable
3. Re-run the [latest workflow run](https://github.com/iamnelson/coolify-env-demo/actions/workflows/deploy.yml) (or push a commit)
4. Refresh https://coolify-env-demo.nelsoncarv.work — new message, new `BUILD_TIME`, same masked secret
