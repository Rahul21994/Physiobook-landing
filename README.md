# Goswami Rehab Physio Site

This repository is a one-time curated snapshot of the Goswami Rehab physiotherapy website and the workspace packages it needs. It is not connected to Replit source control and does not automatically sync future workspace changes.

## Published-release IndexNow workflow

The scheduled GitHub Actions workflow polls the public site every five minutes. It only runs the existing IndexNow sender after the public build manifest and sitemap agree on the exact URL-and-`lastmod` fingerprint in two consecutive checks. The sender still verifies the live public key file and rechecks the sitemap before submitting. Missing or mismatched public data, build failures, and rejected submissions do not send URLs or mark a build as processed.

The workflow does not deploy the site, build it, install project dependencies, or require repository secrets. Replit publication remains a separate, user-initiated action. The build manifest is published by the site build after its checks pass.

## Manual sender

From the workspace root, after building the site:

```sh
pnpm --filter @workspace/physio-site run notify:indexnow
```

The manual command uses the local built sitemap as its expected snapshot. The scheduled workflow uses a frozen manifest captured from the public site.

## Runtime

The workflow uses Node.js 24 and pnpm 10.26.1. It invokes the sender without installing dependencies because the sender uses Node.js built-ins.
