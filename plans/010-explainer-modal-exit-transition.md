# 010 — Feature Explainer Modal Fluid Exit Transition via AnimatePresence

- **Status**: COMPLETED
- **Commit**: c8879c6
- **Severity**: LOW
- **Category**: Missed opportunity / Physicality
- **Estimated scope**: 1 file (`frontend/src/components/FeatureExplainerModal.tsx`)

## Problem

In `frontend/src/components/FeatureExplainerModal.tsx`, when `closeExplainer()` is called (either via clicking the backdrop, pressing `Escape`, or clicking the `<X>` button), the component immediately triggers `if (!activeExplainer && !isGlossaryOpen) return null;`.
While the entrance has `motion-safe:animate-screen-enter`, dismissal instantaneously unmounts the modal and backdrop with zero exit transition. This creates an unpolished visual cliff when closing.

## Target

Wrap the modal backdrop and dialog panel with `AnimatePresence` and Framer Motion `motion.div`:
- Backdrop: `initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}`
- Modal Card: `initial={{ opacity: 0, scale: 0.96, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 8 }} transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}`
- When `useReducedMotion()` is true, omit scale and y translation, transitioning opacity only.

## Repo conventions to follow

- Framer Motion is already a core dependency.
- Retain all accessibility props (`role="dialog"`, `aria-modal="true"`, `aria-labelledby="explainer-modal-title"`).
- Retain click stopping on the inner dialog card (`onClick={(e) => e.stopPropagation()}`).

## Steps

1. Import `motion`, `AnimatePresence`, and `useReducedMotion` from `'framer-motion'`.
2. Wrap the conditional render in `<AnimatePresence>`.
3. Render `<motion.div role="dialog"...>` for the backdrop with exit fade.
4. Render `<motion.div className="bg-stone-950..."` for the dialog panel with exit fade/scale.

## Boundaries

- Do not alter explainer content, search logic, or category filters.
- Maintain existing z-index `z-[70]`.
