# 009 — City Auto-Suggestions Dropdown Scale-Fade Entrance & Exit

- **Status**: COMPLETED
- **Commit**: c8879c6
- **Severity**: LOW
- **Category**: Missed opportunity
- **Estimated scope**: 1 file (`frontend/src/components/BirthDataForm.tsx`)

## Problem

In `frontend/src/components/BirthDataForm.tsx` (lines 876–920), the city suggestion popover (`role="listbox"`) snaps into and out of existence instantaneously when typing or clearing a query:
```tsx
{isCitySuggestionsOpen && citySuggestions.length > 0 && (
  <div
    role="listbox"
    aria-label="City suggestions"
    className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-stone-900 border border-stone-800 rounded-lg shadow-lg overflow-hidden max-h-64 overflow-y-auto divide-y divide-stone-800 font-sans overscroll-contain"
  >
```
Without a subtle scale-fade entrance originating from the input box, the dropdown feels un-anchored and jarring compared to the rest of the application's physical motion design.

## Target

Wrap the suggestions list in `AnimatePresence` using `motion.div`:
- `initial={{ opacity: 0, y: -4, scale: 0.98 }}`
- `animate={{ opacity: 1, y: 0, scale: 1 }}`
- `exit={{ opacity: 0, y: -4, scale: 0.98 }}`
- `transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}`
- When `prefers-reduced-motion` is active (via `useReducedMotion()`), bypass scale/y offsets and only perform instant or fast opacity transition.

## Repo conventions to follow

- `framer-motion` is already imported and utilized in `BirthDataForm.tsx` (e.g. `motion`, `AnimatePresence`).
- Keep `role="listbox"`, `aria-label="City suggestions"`, `data-testid`, and all keyboard navigation (`onKeyDown`) intact for accessibility tests.

## Steps

1. In `frontend/src/components/BirthDataForm.tsx`: ensure `motion` and `AnimatePresence` are imported from `'framer-motion'`.
2. Wrap `{isCitySuggestionsOpen && citySuggestions.length > 0 && ...}` in `<AnimatePresence>`.
3. Replace the outer `<div role="listbox"...>` with `<motion.div role="listbox"...>` with the target animation properties.
4. Ensure `useReducedMotion()` disables the transform offset.

## Boundaries

- Do not alter suggestion selection logic, index highlight, or geocoding APIs.
- Preserve all ARIA attributes and focus management.
