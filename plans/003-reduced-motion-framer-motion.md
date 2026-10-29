# 003 — Honor Reduced Motion Preference in Framer Motion Components

- **Status**: COMPLETED
- **Commit**: c8879c6
- **Severity**: HIGH
- **Category**: Accessibility
- **Estimated scope**: 2 files (`frontend/src/App.tsx`, `frontend/src/components/BirthDataForm.tsx`)

## Problem

While `frontend/src/index.css` includes `@media (prefers-reduced-motion: reduce)` rules for CSS keyframes, Framer Motion components in `App.tsx` and `BirthDataForm.tsx` do not consume `useReducedMotion()`. When a user enables reduced motion at the OS/browser level, screen transitions still run `y: 4` translations, Titan profile cards run `y: 10` translations, and experience tabs run layout spring animations across the screen.

```tsx
/* frontend/src/App.tsx:951 — current */
<motion.div
  key={currentScreen}
  initial={{ opacity: 0, y: 4 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
>

/* frontend/src/components/BirthDataForm.tsx:467, 493 — current */
<motion.div
  layoutId="active-experience-pill"
  className="absolute inset-0 bg-amber-950/80 border border-amber-700/80 rounded-md shadow-xs pointer-events-none"
  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
/>

/* frontend/src/components/BirthDataForm.tsx:1315 — current */
<motion.div
  key={selectedTitan.id}
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
```

## Target

Import `useReducedMotion` from `framer-motion` in `App.tsx` and `BirthDataForm.tsx`. When reduced motion is preferred:
- Retain gentle opacity crossfades (`opacity: 1`), but set `y: 0` (zero positional translation).
- Disable layout springs on the mode tab (`layoutId={shouldReduceMotion ? undefined : "active-experience-pill"}`).

```tsx
/* target in App.tsx */
const shouldReduceMotion = useReducedMotion();

<motion.div
  key={currentScreen}
  initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 4 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
>

/* target in BirthDataForm.tsx */
const shouldReduceMotion = useReducedMotion();

<motion.div
  layoutId={shouldReduceMotion ? undefined : "active-experience-pill"}
  className="absolute inset-0 bg-amber-950/80 border border-amber-700/80 rounded-md shadow-xs pointer-events-none"
  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
/>

<motion.div
  key={selectedTitan.id}
  initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
```

## Repo conventions to follow

- Framer Motion is imported as `import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';`.
- Retain existing transition duration (`0.15` and `0.22`).

## Steps

1. Open `frontend/src/App.tsx`.
   - Add `useReducedMotion` to the `framer-motion` import at line 2.
   - Inside `AppContent()`, declare `const shouldReduceMotion = useReducedMotion();`.
   - In the Subject Dossier switcher (`line 419`), update `initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 4 }}` and `exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -4 }}`.
   - In the main screen transition (`line 953`), update `initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 4 }}`.
2. Open `frontend/src/components/BirthDataForm.tsx`.
   - Add `useReducedMotion` to the `framer-motion` import at line 2.
   - Inside `BirthDataForm`, declare `const shouldReduceMotion = useReducedMotion();`.
   - Update lines 468 and 494: `layoutId={shouldReduceMotion ? undefined : 'active-experience-pill'}`.
   - Update line 1317: `initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}`.

## Boundaries

- Do NOT remove opacity crossfades — reduced motion means no disorienting spatial movement, not zero visual feedback.
- Do NOT touch other components.

## Verification

- **Mechanical**: Run `npm run build` in `frontend/` and `./pipeline.sh test --summary`.
- **Feel check**:
  - In Chrome DevTools > Rendering tab > Emulate CSS media feature `prefers-reduced-motion: reduce`.
  - Navigate between screens (Input -> Traditions -> Synthesis). Confirm screens crossfade smoothly without shifting vertically.
  - Switch between "Custom Input" and "Titans (100)". Confirm the tab background changes instantly without flying across the bar.
- **Done when**: With reduced motion enabled, no positional translations (`y !== 0`) occur during screen or profile switches.
