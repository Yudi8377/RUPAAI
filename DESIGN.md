---
version: alpha
name: "RUPAAI"
description: "Camera-first hair discovery and luxury salon visualization for everyday devices."
colors:
  primary: "#11110F"
  background: "#181815"
  surface: "#20201B"
  text: "#F4F0E8"
  muted: "#AAA69B"
  accent: "#C9AA76"
  border: "rgba(240,232,213,0.13)"
typography:
  sans:
    fontFamily: "'DM Sans', sans-serif"
  mono:
    fontFamily: "ui-monospace, monospace"
rounded:
  DEFAULT: "0.25rem"
  sm: "0.125rem"
  md: "0.25rem"
  lg: "0.5rem"
spacing:
  section-gap: "3rem"
  page-max: "80rem"
components:
  button: {}
  card: {}
  dialog: {}
---
# RUPAAI Design System

## Overview

### Creative North Star
A contemporary independent hair atelier: editorial portraiture, dark salon interiors, warm metallic details, and calm, deliberate controls. The design should feel considered and premium without implying that a mock preview is a photorealistic AI result.

### Product context and register
- **Audience and primary job:** Consumers exploring hairstyles and hair colors, and salons offering higher-touch consultations.
- **Target market(s) and evidence:** Affordable consumer access and salon/business workflows are the intended product direction.
- **Locale(s) and language policy:** Indonesian interface copy with common English hair-fashion terms where they are natural product vocabulary.
- **Usage scene:** Laptop or desktop webcam first, responsive mobile browsing, optional USB camera.
- **Register:** Consumer discovery plus professional salon entry point.
- **Memorable signature:** Warm champagne-gold accents on charcoal with editorial serif headlines.
- **Restraint:** Camera controls, privacy information, and product limitations must remain obvious.
- **Anti-references:** Neon cyberpunk, generic purple AI gradients, excessive glass effects, and fake AI progress states.
- **Token ownership/runtime mapping:** This file documents the initial visual system; CSS variables in src/styles.css are the runtime source for the current starter.

## Colors
Charcoal surfaces support low-distraction camera viewing. Champagne gold marks selected choices and premium services. Text and controls maintain contrast against their surfaces. Camera permission, errors, and selection state must be visible.

## Typography
DM Sans handles controls and explanatory copy. Playfair Display supplies editorial display headings. Georgia/system fallbacks keep the page usable if remote fonts fail.

## Layout
The responsive experience starts with a camera-led hero and two-column simulator on wide screens, collapsing to one column on small screens. Camera preview keeps a stable frame; no mandatory camera or depth hardware beyond a supported webcam.

## Elevation & Depth
Use subtle borders and restrained shadow. The live preview is the visual focus; do not add glass blur that reduces clarity.

## Shapes
Mostly squared editorial surfaces with small radii; circular camera and swatch indicators are semantic.

## Components
Buttons expose focus-visible states. Tabs expose aria-selected. Hair and color choices use button semantics and selected state. The camera status and errors are announced in text. The studio dialog uses dialog semantics and an explicit close action.

## Motion
Short transitions are used only for hover feedback. Reduced-motion preferences disable transitions and smooth scrolling.

## Content and data visualization
Copy distinguishes camera preview, catalog selection, and future AI visualization. No photorealistic try-on or AI generation claim is made until the model and renderer are integrated.

## Do's and Don'ts
- **Do:** Ask permission only after a user action.
- **Do:** Keep the initial camera stream in-browser and stop tracks when camera is disabled or the page unmounts.
- **Don't:** Upload camera frames silently.
- **Don't:** label catalog selection as finished AI hair rendering.
