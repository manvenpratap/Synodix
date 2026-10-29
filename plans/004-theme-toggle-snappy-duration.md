# 004 — Tighten Theme Toggle Animation Duration to Snappy 160ms

- **Status**: COMPLETED
- **Commit**: c8879c6
- **Severity**: MEDIUM
- **Category**: Easing & Duration
- **Estimated scope**: 1 file (`frontend/src/App.tsx`)

## Problem

In `frontend/src/App.tsx`, the Sun/Moon theme toggle button uses a 500ms duration for icon rotation:

```tsx
/* frontend/src/App.tsx:808 — current */
<div className="transition-transform duration-500 ease-out group-hover:rotate-45 group-active:scale-90">
  {theme === 'dark' ? (
    <Sun className="w-4 h-4 text-amber-400 shrink-0" />
  ) : (
    <Moon className="w-4 h-4 text-amber-300 shrink-0" />
  )}
</div>
```

Per Emil Kowalski's animation playbook, UI button press feedback must stay between 100–160ms. A 500ms duration on a header button feels laggy and unresponsive when toggling or hovering.

## Target

Reduce the duration to `160ms` with a strong ease-out curve (`cubic-bezier(0.23, 1, 0.32, 1)` or Tailwind `duration-150 ease-out`). Subtly scale to `scale-95` on active press.

```tsx
/* target */
<div className="transition-transform duration-150 ease-out group-hover:rotate-45 group-active:scale-95">
  {theme === 'dark' ? (
    <Sun className="w-4 h-4 text-amber-400 shrink-0" />
  ) : (
    <Moon className="w-4 h-4 text-amber-300 shrink-0" />
  )}
</div>
```

## Repo conventions to follow

- Header buttons use standard Tailwind transitions (`transition-transform`, `duration-150`, `ease-out`).

## Steps

1. Open `frontend/src/App.tsx`.
2. Locate line 808: replace `duration-500` with `duration-150`.
3. Replace `group-active:scale-90` with `group-active:scale-95`.

## Boundaries

- Do NOT change the theme switching logic, localStorage persistence, or icon elements.

## Verification

- **Mechanical**: Run `./pipeline.sh test --summary` and confirm 26/26 tests pass.
- **Feel check**:
  - Click the theme toggle button in the top right header.
  - Confirm the Sun/Moon icon snaps cleanly into position without lingering or floating.
- **Done when**: `duration-500` is removed from `App.tsx` and the rotation completes in under 160ms.
