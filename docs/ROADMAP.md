# RUPAAI roadmap

## Milestone 1 — Camera-first starter
- [x] Responsive Indonesian landing and simulator interface
- [x] User-initiated webcam access, mirrored preview, explicit stop control
- [x] Download a still camera frame locally
- [x] Haircut/color catalog selection and session-only favorite
- [x] Privacy copy and honest disclosure of current limitations
- [x] Luxury Hair Studio positioning for salons
- [x] Integrate MediaPipe hair segmentation and live hair-color recoloring in the browser
- [x] Add GPU-to-CPU fallback and visible model loading/error states
- [x] Add automated TypeScript/production-build workflow
- [x] Confirm a passing remote workflow (GitHub Actions run #10, commit `029b767`)
- [ ] Run browser/device tests before release

## Milestone 2 — Real hair visualization
- Add face landmarks and head-pose estimation for hairstyle alignment.
- Build a rendering pipeline that anchors hairstyle assets to facial geometry and head pose.
- Improve the current prototype with lighting-preserving color compositing, feathered masks, and occlusion handling.
- Integrate photorealistic haircut replacement; the current catalog does not alter haircut geometry.
- Establish a curated hairstyle asset pack with documented commercial licenses.
- Evaluate browser performance on entry-level laptops and mobile devices.
- Test across skin tones, hair textures, lighting conditions, glasses, and head poses.

## Milestone 3 — Optional depth adapters
- Keep webcam as the default camera provider.
- Define a camera provider interface and a local bridge for devices whose SDKs cannot run in a browser.
- Investigate Kinect v2 / Xbox 360 driver, operating-system, SDK, and commercial-license compatibility before implementation.
- Never require a depth sensor for the consumer experience.

## Milestone 4 — Luxury Hair Studio
- Salon profiles and stylist consultation workflow.
- Customer consent and exportable style reference.
- Salon catalog, customer history, and optional subscription management.
- Role-based access and data retention controls before storing customer photos.

## Milestone 5 — Commercial readiness
- Add tests, accessibility checks, privacy/security review, deployment workflow, error monitoring, and billing only after the product flows are verified.
- Add backend integrations through server-side environment variables; never expose database credentials in client bundles.
- Neon development branch is provisioned for future schema work. No production tables or schema have been changed by this starter.
