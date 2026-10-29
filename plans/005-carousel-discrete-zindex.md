# 005 — Decouple Discrete zIndex from Continuous Spring Tween in Carousel

- **Status**: COMPLETED
- **Commit**: c8879c6
- **Severity**: MEDIUM
- **Category**: Interruptibility
- **Estimated scope**: 1 file (`frontend/src/components/TraditionVerticalCarousel.tsx`)

## Problem

In `TraditionVerticalCarousel.tsx`, the card deck's integer `zIndex` is passed directly into Framer Motion's `animate={{ y: yOffset, scale, opacity, rotateX, zIndex }}` driven by a continuous physics spring (`transition={{ type: 'spring', stiffness: 380, damping: 32 }}`). Because spring physics interpolate fractional values over time, rapid swipes or gesture handoffs cause intermediate z-indices to misalign, causing cards in the background stack to momentarily clip through the foreground active card during velocity reversal.

```tsx
/* frontend/src/components/TraditionVerticalCarousel.tsx:605 — current */
animate={{
  y: yOffset,
  scale,
  opacity,
  rotateX,
  zIndex,
}}
transition={{
  type: 'spring',
  stiffness: 380,
  damping: 32,
  mass: 0.85,
}}
style={{
  transformOrigin: 'center center',
}}
```

## Target

Remove `zIndex` from Framer Motion's spring `animate` payload, and declare it directly on the container's inline `style={{ zIndex, transformOrigin: 'center center' }}`. This guarantees discrete stacking order at all times regardless of spring oscillation.

```tsx
/* target */
animate={{
  y: yOffset,
  scale,
  opacity,
  rotateX,
}}
transition={{
  type: 'spring',
  stiffness: 380,
  damping: 32,
  mass: 0.85,
}}
style={{
  zIndex,
  transformOrigin: 'center center',
}}
```

## Repo conventions to follow

- Other cards and modal layers declare static zIndex on `style` or via Tailwind `z-*` utilities.

## Steps

1. Open `frontend/src/components/TraditionVerticalCarousel.tsx`.
2. Locate line 605: remove `zIndex` from `animate={{ ... }}`.
3. Locate line 623: add `zIndex` into `style={{ zIndex, transformOrigin: 'center center' }}`.

## Boundaries

- Do NOT alter `yOffset`, `scale`, `opacity`, or `rotateX`.
- Do NOT touch swipe gesture handlers (`onDragEnd`, `onTouchEnd`).

## Verification

- **Mechanical**: Run `./pipeline.sh test --summary` and confirm 26/26 tests pass.
- **Feel check**:
  - In a touch emulator or mobile browser, initiate a drag and release it midway, reversing direction rapidly.
  - Verify that background cards never pop in front of the active card during the spring settling phase.
- **Done when**: `zIndex` is absent from `animate={{ ... }}` and declared explicitly in `style={{ zIndex }}`.
