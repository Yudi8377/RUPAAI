# RUPAAI

**Your Look. Your Style. Your AI.**

RUPAAI is a camera-first hair discovery and virtual beauty, grooming, fashion, and lifestyle platform designed for affordable devices. The first experience uses a standard webcam; depth cameras such as Kinect are optional adapters, never a requirement for customers.

## Current experience

- **AI Hair Style Simulator** — webcam preview with local MediaPipe hair segmentation and live hair-color recoloring; haircut choices remain a reference catalog until realistic hairstyle compositing is integrated.
- **Luxury Hair Studio** — premium salon positioning and consultation workflow entry point.
- **Camera-first** — permission is requested only after the user chooses to activate the camera.
- **Local frame export** — download a still preview from the active webcam.
- **Privacy-minded** — the starter app does not upload camera frames.

> Product honesty: live hair segmentation and color recoloring run in the browser using MediaPipe's hair segmentation model. The model and WebAssembly runtime are downloaded from public CDNs on first use; camera frames are processed locally and are not uploaded by this feature. Haircut selection is still a reference catalog: photorealistic hairstyle replacement, face-aware fitting, and salon account workflows are not integrated yet.

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
- Camera preview, hair segmentation, recoloring, and still-frame export run in the browser. The AI model/runtime are downloaded from public hosting providers; camera frames are not sent to those providers.
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

Camera-first foundation with a local hair-segmentation/recoloring prototype. The GitHub Actions quality workflow checks TypeScript and production builds; a green run must still be confirmed before release. Photorealistic haircut replacement, authentication, persistence, salon accounts, billing, and commercial deployment require further implementation and verification. See [the roadmap](docs/ROADMAP.md).
