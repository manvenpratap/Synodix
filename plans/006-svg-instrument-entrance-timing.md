# 006 — Calibrate SVG Instrument Entrance Timing to Under 350ms

- **Status**: COMPLETED
- **Commit**: c8879c6
- **Severity**: MEDIUM
- **Category**: Easing & Duration
- **Estimated scope**: 1 file (`frontend/src/index.css`)

## Problem

In `frontend/src/index.css`, two custom visualizer keyframe animations have excessive durations:
- `@keyframes kundaliDraw`: `650ms` (line 1372)
- `@keyframes eclipseSpin`: `450ms` (line 1358)

Per Emil Kowalski's animation playbook, UI animations should stay under 300ms. An animation taking 650ms on tab switch makes the screen feel sluggish and delays the perception of analytical data readiness.

```css
/* frontend/src/index.css:1357 — current */
.animate-eclipse-spin {
  animation: eclipseSpin 450ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* frontend/src/index.css:1370 — current */
.animate-kundali-draw {
  stroke-dasharray: 400;
  animation: kundaliDraw 650ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
```

## Target

Tighten durations and introduce strong ease-out curve (`cubic-bezier(0.23, 1, 0.32, 1)`):
- `.animate-kundali-draw`: `320ms`
- `.animate-eclipse-spin`: `260ms`

```css
/* target */
.animate-eclipse-spin {
  animation: eclipseSpin 260ms cubic-bezier(0.23, 1, 0.32, 1) forwards;
}

.animate-kundali-draw {
  stroke-dasharray: 400;
  animation: kundaliDraw 320ms cubic-bezier(0.23, 1, 0.32, 1) forwards;
}
```

## Repo conventions to follow

- Visualizer animation helper classes in `index.css` use `forwards` fill mode.
- Cubic-bezier curves are standard CSS functions.

## Steps

1. Open `frontend/src/index.css`.
2. Locate line 1357: change `450ms` to `260ms` and update curve to `cubic-bezier(0.23, 1, 0.32, 1)`.
3. Locate line 1370: change `650ms` to `320ms` and update curve to `cubic-bezier(0.23, 1, 0.32, 1)`.

## Boundaries

- Do NOT change `@keyframes` percentage definitions or `stroke-dasharray` values.
- Do NOT touch other CSS rules.

## Verification

- **Mechanical**: Run `npm run build` in `frontend/` and `./pipeline.sh test --summary`.
- **Feel check**:
  - Navigate to Traditions screen > Jyotisha.
  - Observe the Parashari Diamond Kundali line draw. It should complete crisply in ~300ms without dragging out.
- **Done when**: `.animate-kundali-draw` specifies `320ms` and `.animate-eclipse-spin` specifies `260ms`.
