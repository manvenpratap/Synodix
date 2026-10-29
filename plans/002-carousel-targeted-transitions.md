# 002 — Replace transition-all on Carousel Indicators and Buttons with Targeted GPU Transitions

- **Status**: COMPLETED
- **Commit**: c8879c6
- **Severity**: HIGH
- **Category**: Performance
- **Estimated scope**: 1 file (`frontend/src/components/TraditionVerticalCarousel.tsx`)

## Problem

In `TraditionVerticalCarousel.tsx`, the 9-dot indicator bar and the desktop vertical navigation rail buttons use Tailwind's `transition-all`. Per Emil Kowalski's animation guidelines, `transition: all` animates unintended layout and box model properties (e.g. width, margin, padding, border-color, shadow) off-GPU, triggering continuous style recalculation and layout passes during card changes.

```tsx
/* frontend/src/components/TraditionVerticalCarousel.tsx:484 — current */
className={`h-1.5 rounded-full transition-all duration-200 cursor-pointer ${
  isActive ? 'w-5 bg-amber-400' : 'w-1.5 bg-stone-700 hover:bg-stone-500'
}`}

/* frontend/src/components/TraditionVerticalCarousel.tsx:538 — current */
className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs transition-all motion-safe:transition-transform motion-reduce:transition-none duration-150 cursor-pointer ${
```

## Target

Replace `transition-all` with targeted, composite-efficient transitions:
- On mobile indicator dots: `transition-[width,background-color] duration-200 ease-out`
- On sidebar navigation buttons: `transition-[background-color,border-color,color,transform] duration-150 ease-out`

```tsx
/* target: line 484 */
className={`h-1.5 rounded-full transition-[width,background-color] duration-200 ease-out cursor-pointer ${
  isActive ? 'w-5 bg-amber-400' : 'w-1.5 bg-stone-700 hover:bg-stone-500'
}`}

/* target: line 538 */
className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs transition-[background-color,border-color,color,transform] duration-150 ease-out cursor-pointer ${
```

## Repo conventions to follow

- Transitions use standard Tailwind `duration-150` or `duration-200`.
- Motion reduction is preserved where applicable with `motion-reduce:transition-none`.

## Steps

1. Open `frontend/src/components/TraditionVerticalCarousel.tsx`.
2. Locate line 484: replace `transition-all duration-200` with `transition-[width,background-color] duration-200 ease-out`.
3. Locate line 538: replace `transition-all motion-safe:transition-transform motion-reduce:transition-none duration-150` with `transition-[background-color,border-color,color,transform] duration-150 ease-out motion-reduce:transition-none`.

## Boundaries

- Do NOT change the dot layout, dimensions (`w-5` vs `w-1.5`), or click event listeners.
- Do NOT touch other components.

## Verification

- **Mechanical**: Run `./pipeline.sh test --summary` and verify zero errors.
- **Feel check**:
  - Click through tradition dots 1 through 9.
  - Confirm the active pill smoothly elongates to `w-5` and background transitions to amber with zero layout jitter.
- **Done when**: `grep -rn "transition-all" frontend/src/components/TraditionVerticalCarousel.tsx` returns 0 results.
