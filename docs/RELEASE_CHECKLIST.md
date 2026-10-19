# RUPAAI release-readiness checklist

Use this checklist before calling any RUPAAI build a public beta or commercial release. A successful CI build is necessary, but it does not prove that camera permissions, segmentation quality, browser compatibility, privacy disclosures, or production hosting work for real users.

## Automated checks

- [ ] Latest commit on the release candidate has a successful GitHub Actions quality workflow.
- [ ] TypeScript check and Vite production build pass.
- [ ] The built application is served from the intended production URL and asset paths load without 404s.
- [ ] Browser console has no uncaught runtime errors during the smoke test.

## Camera and vision smoke tests

- [ ] Camera permission is requested only after the user activates the camera.
- [ ] Denying permission shows a useful Indonesian error and leaves the page usable.
- [ ] No-camera / unsupported-browser path explains the HTTPS or localhost requirement.
- [ ] Starting and stopping the camera repeatedly does not leave the camera indicator on.
- [ ] Leaving or refreshing the page releases the camera stream.
- [ ] MediaPipe model/runtime load successfully on a clean browser profile with network access.
- [ ] GPU initialization failure falls back to CPU; a total model/network failure is communicated clearly.
- [ ] Color switching updates the live preview without restarting the camera/model.
- [ ] Hair mask edges and color appearance are reviewed in daylight, indoor light, dark/light hair, curly/straight hair, glasses, and varied head poses.
- [ ] Exported PNG orientation and color appearance match the preview closely enough for the stated prototype purpose.

## Privacy, accessibility, and product honesty

- [ ] Confirm in browser developer tools that camera frames are not sent to an application backend or analytics endpoint.
- [ ] Verify the privacy disclosure accurately explains that MediaPipe runtime/model assets load from public CDNs.
- [ ] All interactive controls are keyboard reachable and have visible focus.
- [ ] Test layout at 320px mobile width, common phone widths, tablet, and desktop.
- [ ] Haircut cards are clearly described as catalog references; do not advertise them as photorealistic haircut replacement until implemented.
- [ ] Review all external model/assets and any added visual assets for commercial license and supply-chain suitability.

## Commercial release blockers

- [ ] Confirm the actual production hosting provider, URL, HTTPS, domain, and rollback procedure.
- [ ] Add automated browser tests and a repeatable smoke-test script.
- [ ] Complete security and dependency review, including pinned/controlled model assets where practical.
- [ ] Decide whether salon accounts, consent, photo retention, customer history, and billing are in scope; do not collect/store customer photos before controls and policies exist.
- [ ] Complete cross-device testing on physical devices, including at least one lower-powered mobile device.
- [ ] Publish support/contact, terms, privacy notice, and a clear beta/limitations statement before charging customers.

## Current known status

- The camera-first prototype has a passing TypeScript/production-build workflow.
- Hair segmentation and color recoloring run in the browser; camera frames are not uploaded by this feature.
- Hair-color compositing has feathered mask edges and uses a color blend for live preview and PNG export.
- Photorealistic haircut geometry, face-aware hairstyle fitting, salon accounts, persistence, billing, and verified commercial deployment are not yet confirmed.
- Physical browser/device validation remains outstanding. Do not mark this checklist complete based on CI alone.
