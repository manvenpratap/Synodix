# 001 — Restrict Heavy Backdrop Blur to Active Center Carousel Card

- **Status**: COMPLETED
- **Commit**: c8879c6
- **Severity**: HIGH
- **Category**: Performance
- **Estimated scope**: 1 file (`frontend/src/components/TraditionVerticalCarousel.tsx`)

## Problem

In `TraditionVerticalCarousel.tsx`, all 9 rendered carousel cards in the 3D card deck unconditionally declare `backdrop-blur-xl` (`backdrop-filter: blur(24px)`). When rotating 3D cards (`rotateX`, `yOffset`, `scale`) during interactive touch drag and spring transitions, 9 simultaneous 24px backdrop blurs are composited on the GPU. On mobile WebViews and lower-powered devices, stacking 9 heavy blur shaders induces frame drops and jittery gesture tracking.

```tsx
/* frontend/src/components/TraditionVerticalCarousel.tsx:618 — current */
className={`absolute w-full rounded-2xl border p-4 sm:p-5 shadow-2xl backdrop-blur-xl transition-shadow ${
  isCenter
    ? `${theme.containerBg} ${theme.containerBorder} shadow-2xl cursor-grab active:cursor-grabbing ring-1 ring-amber-500/30 touch-pan-y`
    : 'bg-stone-950/85 border-stone-800 cursor-pointer hover:border-amber-500/40'
}`}
```

## Target

Apply moderate `backdrop-blur-md` (12px) strictly to the center active card (`isCenter`). For stacked background cards (`!isCenter`), eliminate `backdrop-filter` completely and use solid translucent `bg-stone-950/92`. This eliminates 8 simultaneous multi-pass blur shaders during 3D card flips.

```tsx
/* target */
className={`absolute w-full rounded-2xl border p-4 sm:p-5 shadow-2xl transition-shadow ${
  isCenter
    ? `${theme.containerBg} ${theme.containerBorder} backdrop-blur-md shadow-2xl cursor-grab active:cursor-grabbing ring-1 ring-amber-500/30 touch-pan-y`
    : 'bg-stone-950/92 border-stone-800 cursor-pointer hover:border-amber-500/40'
}`}
```

## Repo conventions to follow

- Visualizer cards in `TraditionVerticalCarousel.tsx` differentiate active center state via `isCenter`.
- Container background styling is supplied by `theme.containerBg` and `theme.containerBorder`.

## Steps

1. Open `frontend/src/components/TraditionVerticalCarousel.tsx`.
2. Locate line 618: remove `backdrop-blur-xl` from the outer static class string.
3. In the `isCenter ?` branch, add `backdrop-blur-md`.
4. In the `: 'bg-stone-950/85 ...'` branch, replace with `'bg-stone-950/92 border-stone-800 cursor-pointer hover:border-amber-500/40'`.

## Boundaries

- Do NOT alter card sizing, drag constraints, spring configurations, or markup hierarchy.
- Do NOT touch other components.

## Verification

- **Mechanical**: Run `./pipeline.sh test --summary` and confirm 26/26 tests pass.
- **Feel check**:
  - Run the mobile app or browser at 390px mobile viewport.
  - Perform rapid horizontal swipe gestures between cards 1 through 9.
  - In Chrome DevTools Rendering tab, turn on "FPS Meter" and "Paint Flashing". Verify 60fps gesture tracking with zero GPU stutter during card flips.
- **Done when**: Only the active center card renders `backdrop-blur-md`; stacked cards render with solid `bg-stone-950/92` with 0 dropped frames.
