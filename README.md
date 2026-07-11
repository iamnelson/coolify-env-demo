# Coolify environment demo

This minimal Next.js App Router application demonstrates server-side environment variables reaching a running Docker container. The page reads `APP_MESSAGE`, `APP_SECRET_HINT`, and `BUILD_TIME` from `process.env` at request time. It displays only a masked preview of the secret value and never exposes environment values through client-side code.

The intended deployment flow is:

1. GitHub Actions reads configuration from GitHub Actions Variables and Secrets.
2. The workflow sends those values through the Coolify API as deployment environment variables.
3. Coolify deploys the Docker image with those variables in the running container.
4. The Next.js server reads them from `process.env` for each request.

The GitHub Actions workflow and all Coolify/API configuration are deliberately out of scope and owned separately. This repository does not include a workflow file and does not configure Coolify.

## Local use

Copy `.env.example` to `.env.local`, replace only with safe local demo values, then run:

```sh
npm install
npm run dev
```

The healthcheck endpoint is available at `/api/health` and returns `{ "status": "ok" }`.
