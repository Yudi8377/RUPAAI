# RUPAAI deployment guide

## Current public deployment

- Public URL: https://rupaai.vercel.app
- Hosting: Vercel static deployment
- Application source of record: GitHub repository `Yudi8377/RUPAAI`
- Deployment model: uploaded source snapshot, not yet linked to GitHub for automatic deployments
- Latest verified Vercel deployment: `dpl_58JdQeBkKMJtxQjp1XmQ4g2UKdXA` (state `READY`)
- Source commit used for that deployment: `e4170ebaac9eadf8edeb41a6100f662213ed839a`
- Important: Vercel's API reports `READY`, but direct external browser verification has not succeeded in this workspace; verify the public URL and model download from a normal browser before treating the release as validated.

The Vercel deployment was created from the app source files in the private GitHub repository. Do not make the repository public just to enable deployment. To enable automatic deployments, connect the private repository to the intended Vercel account/project using the account's Git integration, then verify a push to `main` creates a production deployment.

## Build and validation

Run these commands before release:

```sh
npm install
npm run typecheck
npm run build
npx playwright test
```

The GitHub Actions quality workflow checks TypeScript and the Vite production build. The Chromium smoke workflow checks page rendering and the denied-camera-permission flow. Neither workflow proves real-device camera operation or visual segmentation quality.

## Hosting configuration

`vercel.json` sets baseline browser security headers and long-lived immutable caching for Vite-generated assets. Review headers whenever adding external scripts, APIs, embedded content, or new browser capabilities. The current MediaPipe runtime and model are loaded from public CDNs; do not add a restrictive Content Security Policy until the complete runtime path has been tested in real browsers.

## Before charging customers

- Verify the public URL from an external browser and test HTTPS, JavaScript assets, fonts, and MediaPipe model downloads.
- Test camera grant, camera denial, no camera, repeated start/stop, track disconnection, and page exit on desktop and mobile devices.
- Confirm camera frames remain local in browser network inspection.
- Publish and review the privacy notice (`/privacy.html`) and terms (`/terms.html`); add a verified support contact and clear statement that the current product is a hair-color preview prototype.
- Decide and implement consent, account management, salon workflows, customer data retention, payment/subscription handling, support and incident response if these are part of the commercial offer.
- Do not market the haircut catalog as realistic haircut replacement: selected haircut cards currently serve as reference inspiration and do not change haircut geometry.
- Review CDN/model provenance, license terms, dependency updates, accessibility, and lower-powered device performance.
- Confirm rollback procedure and verify the production build after each deployment.

## Operational caution

A successful Vercel deployment means the hosting build completed; it is not a certification of commercial readiness. Keep the public offer aligned with the features actually implemented and tested.
