# Motion & Animation Improvement Plans

This directory contains verified, self-contained plans generated in accordance with the `/improve-animations` protocol modeled on Emil Kowalski's design engineering philosophy.

Base Commit: `c8879c6`

## Inventory of Plans

| # | Plan Slug | Category | Severity | Scope | Status |
|---|---|---|---|---|---|
| **001** | [carousel-center-backdrop-blur](./001-carousel-center-backdrop-blur.md) | Performance | HIGH | `TraditionVerticalCarousel.tsx` | COMPLETED |
| **002** | [carousel-targeted-transitions](./002-carousel-targeted-transitions.md) | Performance | MEDIUM | `TraditionVerticalCarousel.tsx` | COMPLETED |
| **003** | [reduced-motion-framer-motion](./003-reduced-motion-framer-motion.md) | Accessibility | MEDIUM | `App.tsx`, `BirthDataForm.tsx` | COMPLETED |
| **004** | [theme-toggle-snappy-duration](./004-theme-toggle-snappy-duration.md) | Easing & duration | LOW | `App.tsx` | COMPLETED |
| **005** | [carousel-discrete-zindex](./005-carousel-discrete-zindex.md) | Interruptibility | MEDIUM | `TraditionVerticalCarousel.tsx` | COMPLETED |
| **006** | [svg-instrument-entrance-timing](./006-svg-instrument-entrance-timing.md) | Easing & duration | LOW | `index.css` | COMPLETED |
| **007** | [centralized-motion-tokens](./007-centralized-motion-tokens.md) | Cohesion & tokens | LOW | `index.css` | COMPLETED |
| **008** | [standardized-button-active-scale](./008-standardized-button-active-scale.md) | Physicality & origin | LOW | `App.tsx`, `TraditionVerticalCarousel.tsx`, `BirthDataForm.tsx` | COMPLETED |
| **009** | [city-dropdown-scale-entrance](./009-city-dropdown-scale-entrance.md) | Missed opportunity | LOW | `BirthDataForm.tsx` | COMPLETED |
| **010** | [explainer-modal-exit-transition](./010-explainer-modal-exit-transition.md) | Missed opportunity | LOW | `FeatureExplainerModal.tsx` | COMPLETED |
| **011** | [epistemic-journey-fluid-indicator](./011-epistemic-journey-fluid-indicator.md) | Missed opportunity | LOW | `App.tsx` | COMPLETED |

## Execution Summary

All 11 plans have been executed across the codebase:
1. **Tokens & CSS Foundations**:
   - `index.css`: Injected semantic motion tokens (`--ease-out-expo`, `--ease-out-quint`, `--duration-fast: 160ms`, `--duration-relaxed: 320ms`).
   - SVG instrument line-drawing (`kundaliDraw`) tightened from 650ms to 320ms; `eclipseSpin` tightened from 450ms to 160ms. Added reduced-motion resets.
2. **Carousel Performance & Physics**:
   - `TraditionVerticalCarousel.tsx`: Replaced 9 simultaneous `backdrop-blur-xl` shaders with center-only `backdrop-blur-md`; stacked cards use solid `bg-stone-950/92`.
   - Targeted indicator dots to `transition-[width,background-color]` and sidebar buttons to `transition-[background-color,color,transform]`.
   - Decoupled `zIndex` from spring interpolation into discrete inline `style={{ zIndex }}`.
3. **Accessibility & Framer Motion**:
   - `App.tsx` and `BirthDataForm.tsx`: Wired `useReducedMotion()` into positional offsets (`y: shouldReduceMotion ? 0 : 4`), eliminating jarring kinetic displacements for users with reduced motion preferences.
   - Snapped theme toggle rotation duration from 500ms to 160ms ease-out.
   - Standardized `:active` press scale feedback to `motion-safe:active:scale-[0.97]` and `motion-reduce:active:scale-100`.
4. **Missed Opportunities**:
   - `BirthDataForm.tsx`: Transformed city dropdown popover with `AnimatePresence` scale-fade entrance originating from the input box.
   - `FeatureExplainerModal.tsx`: Wrapped explainer modal in `AnimatePresence` with 150ms smooth exit transition.
   - `App.tsx`: Added Framer Motion `layoutId="active-journey-indicator"` spring for fluid gliding between tractates, and smoothed ambient progress conduit to `motion-safe:transition-[width]`.
