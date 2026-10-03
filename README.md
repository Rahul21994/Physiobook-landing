# Goswami Rehab Physio Site

This repository is a one-time curated snapshot of the Goswami Rehab physiotherapy website and the workspace packages it needs. It is not connected to Replit source control and does not automatically sync future workspace changes.

## Important: automatic IndexNow polling is not active

This snapshot includes the public-release poller and IndexNow sender source, but the scheduled GitHub Actions workflow is not included. The GitHub connection used to initialize this repository could not write files under `.github/workflows`, so this repository will not automatically poll the live site or submit IndexNow URLs.

The existing sender can be run manually from the workspace root after a successful site build:

    pnpm --filter @workspace/physio-site run notify:indexnow

The manual command uses the local built sitemap as its expected snapshot. No site deployment or live IndexNow request was made while initializing this repository.

## Snapshot policy

This is a curated one-time snapshot, not an automatic source-control link. Future workspace changes must be reviewed and copied manually.
