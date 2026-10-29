# 007 — Centralize Motion Tokens and Easing Variables

- **Status**: COMPLETED
- **Commit**: c8879c6
- **Severity**: LOW
- **Category**: Cohesion & tokens
- **Estimated scope**: 1 file (`frontend/src/index.css`)

## Problem

Throughout `frontend/src/index.css`, transitions and keyframes use fragmented inline bezier curves (e.g. `cubic-bezier(0.4, 0, 0.2, 1)`, `cubic-bezier(0.16, 1, 0.3, 1)`, `ease-out`, and `ease-in-out`) and disparate durations (500ms, 650ms, 300ms, 150ms). There are no centralized design tokens for motion easing and duration scales under `:root`, making timing coordination across components inconsistent and hard to tune globally.

## Target

Define standard semantic motion tokens in `:root` inside `frontend/src/index.css`:
- `--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);`
- `--ease-out-quint: cubic-bezier(0.23, 1, 0.32, 1);`
- `--ease-in-out-quint: cubic-bezier(0.83, 0, 0.17, 1);`
- `--duration-instant: 100ms;`
- `--duration-fast: 160ms;`
- `--duration-normal: 240ms;`
- `--duration-relaxed: 320ms;`

Wire these CSS variables into the custom animation classes (`.animate-in-card`, `.chart-instrument-draw`, `.telemetry-badge-pulse`) so motion adheres to a unified cadence.

## Repo conventions to follow

- `frontend/src/index.css` is the single source of truth for global CSS variables (`:root { ... }`), color themes, and custom animations.
- Tailwind CSS v4 `@theme` block or `:root` declaration holds shared variables.

## Steps

1. Open `frontend/src/index.css`.
2. Locate the `:root` block at lines 1–60.
3. Add the `--ease-out-expo`, `--ease-out-quint`, `--ease-in-out-quint`, `--duration-instant`, `--duration-fast`, `--duration-normal`, and `--duration-relaxed` tokens.
4. Reference `--ease-out-expo` and `--duration-fast` in `.animate-in-card` and other utility keyframes.

## Boundaries

- Do not alter existing color variables, glassmorphic styles, or print media queries.
- Ensure all token names use standard CSS custom property syntax.
