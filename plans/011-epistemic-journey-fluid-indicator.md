# 011 — Epistemic Journey Fluid Active Indicator & Progress Bar Transition

- **Status**: COMPLETED
- **Commit**: c8879c6
- **Severity**: LOW
- **Category**: Missed opportunity / Physicality
- **Estimated scope**: 1 file (`frontend/src/App.tsx`)

## Problem

In `frontend/src/App.tsx` (lines 880–939):
1. **Journey Button Pill**: As the user moves between Tractates I, II, III, and IV, the active indicator styling abruptly snaps from button to button without spatial continuity.
2. **Ambient Progress Conduit**: The progress conduit bar at line 929 has `className="h-full ... motion-safe:transition-opacity motion-reduce:transition-none"`. Because `transition-opacity` is specified instead of `transition-[width]`, changing `style={{ width: ... }}` instantly jumps the conduit width rather than gliding smoothly across tractates.

## Target

1. Use Framer Motion's `layoutId="active-journey-indicator"` on an absolute background element within the active button so the highlight pill slides smoothly between tractates with spring physics (`stiffness: 380, damping: 32`).
2. Update the progress conduit to `motion-safe:transition-[width] motion-safe:duration-300 motion-safe:ease-out` so the width bar glides forward/backward.
3. For users with `prefers-reduced-motion: reduce`, disable `layoutId` animation and snap instantaneously.

## Repo conventions to follow

- `framer-motion` is already imported in `App.tsx`.
- Retain all accessibility attributes (`aria-current="step"`, `data-tooltip`, `aria-label`).
- Keep relative positioning and button text z-index so text remains legible above the sliding pill.

## Steps

1. In `frontend/src/App.tsx`:
   - Inside the `JOURNEY_STEPS.map(...)` button, ensure `relative` is on the button container.
   - When `isActive && !shouldReduceMotion`, render `<motion.span layoutId="active-journey-pill" className="absolute inset-0 bg-amber-950 border border-amber-600 rounded-md sm:rounded-lg ring-1 ring-amber-500/50 -z-0" transition={{ type: "spring", stiffness: 380, damping: 30 }} />`.
   - Update conduit class from `motion-safe:transition-opacity` to `motion-safe:transition-[width] motion-safe:duration-300 motion-safe:ease-out`.

## Boundaries

- Do not change navigation handler `navigateTo(s.id)` or URL hash syncing.
- Ensure buttons remain accessible and click targets are unchanged.
