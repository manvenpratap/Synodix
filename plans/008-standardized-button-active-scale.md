# 008 — Standardize Button Active Press Feedback and Reduced Motion

- **Status**: COMPLETED
- **Commit**: c8879c6
- **Severity**: LOW
- **Category**: Physicality & origin / Accessibility
- **Estimated scope**: 3 files (`frontend/src/App.tsx`, `frontend/src/components/TraditionVerticalCarousel.tsx`, `frontend/src/components/BirthDataForm.tsx`)

## Problem

Buttons across the app exhibit inconsistent `:active` feedback:
1. `App.tsx`: Navigation journey items use `active:scale-95 duration-150` with only `transition-colors`, causing abrupt instantaneous transform snapping on touch down. Bottom navigation uses `active:scale-[0.94]`.
2. Primary actions in `TraditionVerticalCarousel.tsx` and `BirthDataForm.tsx` use `active:scale-[0.98]` or lack `motion-safe:` prefixes, triggering transform scaling even when `prefers-reduced-motion: reduce` is active.
3. Lack of targeted `transition-[background-color,border-color,transform]` means the scale snap is un-eased.

## Target

Standardize button press feedback:
- Use consistent `motion-safe:active:scale-[0.97]` for primary buttons.
- Pair with `transition-[background-color,border-color,transform] duration-150 ease-out` (or utility `.btn-press`).
- Honor reduced motion with `motion-reduce:active:scale-100`.

## Repo conventions to follow

- Existing `.btn-press` in `index.css` provides:
  ```css
  .btn-press {
    transition: transform 120ms cubic-bezier(0.23, 1, 0.32, 1);
  }
  .btn-press:active {
    transform: scale(0.97);
  }
  @media (prefers-reduced-motion: reduce) {
    .btn-press:active {
      transform: none;
    }
  }
  ```
- Use `.btn-press` or uniform `motion-safe:active:scale-[0.97] motion-reduce:active:scale-100 transition-[background-color,border-color,transform]` for tactile tactile response without layout jitter.

## Steps

1. Inspect buttons in `App.tsx` (journey buttons, bottom nav items).
2. Ensure `transition-[background-color,border-color,transform]` and `motion-safe:active:scale-[0.97]` are applied.
3. Inspect `TraditionVerticalCarousel.tsx` common button ("Inspect Full Telemetry & Tables"): add `motion-safe:active:scale-[0.97] motion-reduce:active:scale-100`.

## Boundaries

- Do not change button layouts, heights (`min-h-[44px]`), padding, or click handlers.
