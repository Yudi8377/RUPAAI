# RUPAAI

**Your Look. Your Style. Your AI.**

RUPAAI is a camera-first hair discovery and virtual beauty, grooming, fashion, and lifestyle platform designed for affordable devices. The first experience uses a standard webcam; depth cameras such as Kinect are optional adapters, never a requirement for customers.

## Current experience

- **AI Hair Style Simulator** — haircut and hair-color discovery interface with webcam preview.
- **Luxury Hair Studio** — premium salon positioning and consultation workflow entry point.
- **Camera-first** — permission is requested only after the user chooses to activate the camera.
- **Local frame export** — download a still preview from the active webcam.
- **Privacy-minded** — the starter app does not upload camera frames.

> Product honesty: the current milestone provides a live camera preview and selectable style catalog. Photorealistic AI hair segmentation, recoloring, and hairstyle compositing are not integrated yet; the UI states this clearly rather than presenting mock overlays as completed AI.

## Product roadmap

- Rupa Beauty — virtual makeup and beauty looks.
- Rupa Grooming — hairstyle, beard, and barbershop consultation.
- Rupa Fashion — virtual outfit exploration and fitting.
- Rupa 3D — optional depth-sensor and multi-camera experiments.

## Technical direction

- React + TypeScript + Vite.
- Browser-native camera access and client-side vision where practical.
- Webcam-first provider architecture; optional depth sensor integration through a local bridge where required.
- Neon PostgreSQL for future persistence, with development branch migrations before production changes.
- Low-cost by default: expensive generative AI and server-side processing are optional enhancements, not prerequisites for basic camera access.

## Privacy principles

- Camera permission is requested only after the user initiates the experience.
- The initial camera preview and still-frame export remain in the browser.
- The camera stream is stopped when the user turns off the camera or leaves the page.
- Future cloud generation or processing must require explicit consent and clear retention controls.

## Development

```bash
npm install
npm run dev
npm run typecheck
npm run build
```

## Status

Initial camera-first product foundation. AI rendering, authentication, persistence, salon accounts, billing, and commercial deployment require separate implementation and verification. See [the roadmap](docs/ROADMAP.md).
