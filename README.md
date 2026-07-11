# 🚢 coolify-env-demo

> **Change it in GitHub. Watch it land in production. No SSH. No dashboard drift.**
> A live, working proof that GitHub can own runtime configuration all the way
> from Actions variables and secrets to a container running on Coolify.

[![Build and deploy](https://github.com/iamnelson/coolify-env-demo/actions/workflows/deploy.yml/badge.svg)](https://github.com/iamnelson/coolify-env-demo/actions/workflows/deploy.yml)
[![Live](https://img.shields.io/badge/live-coolify--env--demo.nelsoncarv.work-22c55e?style=flat-square)](https://coolify-env-demo.nelsoncarv.work)
![Next.js](https://img.shields.io/badge/Next.js-App%20Router-000000?style=flat-square&logo=next.js&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-multi--stage-2496ED?style=flat-square&logo=docker&logoColor=white)
![Coolify](https://img.shields.io/badge/deployment-Coolify-6B16ED?style=flat-square)
![GitHub Actions](https://img.shields.io/badge/CI%2FCD-self--hosted%20runner-2088FF?style=flat-square&logo=githubactions&logoColor=white)
![Cloudflare](https://img.shields.io/badge/edge-Cloudflare-F38020?style=flat-square&logo=cloudflare&logoColor=white)

This is a deliberately small application with one serious job: prove, end to
end, that a value changed in GitHub reaches the live server environment and is
read at request time — without a human editing production by hand.

**See the proof running now:** [coolify-env-demo.nelsoncarv.work](https://coolify-env-demo.nelsoncarv.work)

## 🎯 Why this exists

- **Configuration drift is easy to create and hard to see.** A value in GitHub
  and a value in a deployment dashboard can quietly become two different
  truths. Here, GitHub is the source of truth and Coolify is only the runtime.
- **“The deploy succeeded” is not the same as “the value reached the app.”**
  This page reads the current environment on every request, so the final result
  is visible and testable from the browser.
- **Secrets need proof without disclosure.** The application shows only a
  masked preview of the deployed secret, confirming that it arrived while never
  rendering the raw value.
- **Self-hosted delivery should still feel like a platform.** One push builds
  an immutable image, publishes it to GHCR, synchronizes runtime configuration,
  and asks Coolify to redeploy it.

## 💡 The idea

GitHub owns the desired state. A self-hosted Actions runner turns the commit into
an image, sends the environment values to Coolify through its API, and triggers
the deployment. The Next.js server reads those values only when a request
arrives.

- 📝 **Change** `APP_MESSAGE` in GitHub Actions variables.
- 🏗️ **Build** a multi-stage, non-root Next.js container.
- 📦 **Publish** immutable `latest` and commit-SHA tags to GHCR.
- 🔄 **Synchronize** variables and secrets through the Coolify API.
- 🚀 **Redeploy** the application without touching the server.
- 👀 **Verify** the new message and deployment timestamp in the live app.

```mermaid
flowchart LR
    subgraph github [GitHub]
        G[(main)]
        V[Actions variables<br/>and secrets]
        A[Self-hosted<br/>Actions runner]
        R[(GHCR)]
        G -->|push| A
        V -->|runtime config| A
        A -->|build and push| R
    end

    subgraph platform [Self-hosted platform]
        C[Coolify API]
        N[Next.js container]
        T[Traefik]
        C -->|inject env and deploy| N
        N --> T
    end

    A -->|sync env and trigger| C
    R -->|pull image| C
    T -->|HTTPS via Cloudflare| L((Live app))
```

There is no second configuration source to reconcile. GitHub declares it;
Coolify runs it.

## 🧪 What is actually proven

| Claim | Live evidence |
|---|---|
| Environment values are runtime configuration | `app/page.tsx` is a dynamic server component and reads `process.env` on every request |
| The secret reaches the container without being exposed | The UI renders only a masked preview of `APP_SECRET_HINT` |
| Every deployment is identifiable | `BUILD_TIME` is generated during the workflow and displayed by the running application |
| GitHub drives production | The workflow builds, pushes, calls Coolify's environment API, and triggers the redeploy |
| The container is ready for real hosting | It runs as a non-root user and exposes a dedicated `/api/health` endpoint |
| Server-side actions reach the runtime | The **Write server log** button emits a timestamped entry in the application logs |

## 🚀 Prove it end to end

1. Open the repository's **Settings → Secrets and variables → Actions**.
2. Change the `APP_MESSAGE` variable.
3. Re-run [Build and deploy](https://github.com/iamnelson/coolify-env-demo/actions/workflows/deploy.yml), or push a commit to `main`.
4. Open the [live application](https://coolify-env-demo.nelsoncarv.work).
5. Confirm the new message, the new deployment timestamp, and the masked secret.

That closes the loop from declared configuration to observable production
state.

## 💻 Run it locally

```bash
git clone https://github.com/iamnelson/coolify-env-demo.git
cd coolify-env-demo
cp .env.example .env.local
npm install
npm run dev
```

Open [localhost:3000](http://localhost:3000). The health endpoint is available
at [localhost:3000/api/health](http://localhost:3000/api/health).

## 🔐 Deployment contract

The workflow expects these repository values:

| Name | Type | Purpose |
|---|---|---|
| `GHCR_IMAGE` | Variable | Full GHCR image name |
| `COOLIFY_URL` | Variable | Base URL of the Coolify instance |
| `COOLIFY_APP_UUID` | Variable | Target application identifier |
| `APP_MESSAGE` | Variable | Public demo message shown by the app |
| `COOLIFY_API_TOKEN` | Secret | Authenticates calls to the Coolify API |
| `APP_SECRET_HINT` | Secret | Demonstrates masked runtime secret delivery |

`BUILD_TIME` is created automatically during the workflow. The deployment
publishes both `latest` and the full commit SHA, keeping the running artifact
traceable to Git.

## 🗂️ What is here

- 🌐 `app/` — the dynamic Next.js page, server action, and health endpoint.
- 🐳 `Dockerfile` — a multi-stage standalone build with a non-root runtime.
- ⚙️ `.github/workflows/deploy.yml` — build, GHCR publish, environment sync,
  and Coolify redeploy in one pipeline.
- 🧰 `.env.example` — the complete local configuration contract, with no real
  credentials.

## 🧯 What broke along the way

This is a small demo, but it records real platform failures rather than hiding
them:

- A GHCR organization policy blocked the first public package path.
- A missing `curl` binary caused Coolify's container healthcheck to fail.
- The fixes live in the commit history, alongside the working deployment.

That history is part of the proof: the project was operated, debugged, and
recovered — not only diagrammed.

## ✨ Built with

- **[Claude Code](https://claude.com/claude-code)** — deployment orchestration,
  Coolify API wiring, and production debugging.
- **Codex** — initial Next.js, Docker, and repository scaffolding.
- **[Coolify](https://coolify.io)** — the self-hosted platform under test.

## 📖 References

- [Next.js: deploying with Docker](https://nextjs.org/docs/app/getting-started/deploying#docker)
- [Next.js: environment variables](https://nextjs.org/docs/app/guides/environment-variables)
- [Docker multi-stage builds](https://docs.docker.com/build/building/multi-stage/)
- [GitHub Actions variables](https://docs.github.com/en/actions/learn-github-actions/variables)
- [GitHub Actions secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [GitHub-hosted and self-hosted runners](https://docs.github.com/en/actions/hosting-your-own-runners)
- [GitHub Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
- [Coolify documentation](https://coolify.io/docs)
- [Cloudflare DNS documentation](https://developers.cloudflare.com/dns/)
