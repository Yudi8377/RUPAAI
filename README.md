# RUPAAI

**Your Look. Your Style. Your AI.**

RUPAAI is a camera-first virtual beauty, grooming, fashion, and lifestyle platform designed for affordable devices. The first experience uses a standard webcam; depth cameras such as Kinect are optional adapters, never a requirement for customers.

## Product modules

- **Rupa Beauty** — virtual makeup and beauty looks.
- **Rupa Grooming** — hairstyle, beard, and barbershop consultation.
- **Rupa Fashion** — virtual outfit exploration and fitting.
- **Rupa 3D** — optional depth-sensor and multi-camera experiments.

## Technical direction

- React + TypeScript + Vite for the browser experience.
- Browser-native camera access and client-side vision where practical.
- Pluggable camera providers: standard webcam first; optional depth sensor integration through a local bridge where required.
- Neon PostgreSQL for future persistence, with development branch migrations before production changes.
- Keep the first release low-cost; generative AI and server-side processing are optional enhancements, not prerequisites for the basic experience.

## Privacy principles

- Camera permission is requested only after the user initiates the experience.
- The initial camera preview is processed locally in the browser.
- No camera frames are uploaded by the starter application.
- Future image-generation or cloud-processing features must use explicit consent and clear retention controls.

## Development

```bash
npm install
npm run dev
npm run typecheck
npm run build
```

## Status

Initial project foundation. Live camera access and interface scaffolding are the first milestone; AI rendering, authentication, persistence, and commercial billing require separate implementation and verification.