---
name: Six-Culture Verified Astrology Design System
description: Scientific mission-control interface for multi-civilizational planetary ephemeris and epistemological verification.
colors:
  bg-space: "#080a0f"
  surface-card: "#0d1118"
  surface-subtle: "#121721"
  surface-overlay: "#182232"
  border-subtle: "#1b2331"
  border-accent: "#0e7490"
  text-primary: "#f1f5f9"
  text-secondary: "#cbd5e1"
  text-muted: "#94a3b8"
  accent-cyan: "#38bdf8"
  accent-emerald: "#34d399"
  accent-amber: "#fbbf24"
  accent-rose: "#fb7185"
  accent-purple: "#c084fc"
typography:
  display:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "clamp(1.5rem, 3vw, 2.25rem)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  mono-telemetry:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.02em"
  body:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
rounded:
  sm: "4px"
  md: "6px"
  lg: "8px"
  xl: "12px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "14px"
  lg: "20px"
  xl: "28px"
components:
  button-primary:
    backgroundColor: "{colors.border-accent}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  button-surface:
    backgroundColor: "{colors.surface-subtle}"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.md}"
    padding: "6px 12px"
  card-telemetry:
    backgroundColor: "{colors.surface-card}"
    rounded: "{rounded.lg}"
    padding: "16px"
---

# Design System

## Overview

The Six-Culture Astrology interface is built on the metaphor of an **Astronomical Mission Control / Comparative Epistemological Observatory**. It rejects mystical pastels, glowing celestial orbs, and generic AI horoscope aesthetics in favor of high-density telemetry, mathematical invariant proofs, and editorial rigor.

## Colors

### Primary Palette (Obsidian Space & Structural Metals)
- **Background Base (`#080a0f`)**: Absolute deep space void serving as the dark substrate for all calculations.
- **Card Surface (`#0d1118`)**: Primary panel background with 1px structural borders.
- **Card Subtle Surface (`#121721`)**: Secondary nested containers and interactive pill backgrounds.
- **Surface Overlay (`#182232`)**: Active state highlights, selected tabs, and interactive focus states.
- **Structural Border (`#1b2331`)**: 1px crisp separation grid ensuring strict visual rhythm.

### Semantic Spectral Accents (Functional Meaning)
- **Cyan (`#38bdf8` / `border-cyan-700`)**: Telemetry verification, modern ephemeris, SwissEph/Skyfield engine status.
- **Emerald (`#34d399` / `bg-emerald-950`)**: Mathematical invariants passed, strong cross-cultural consensus, positive dignities.
- **Amber (`#fbbf24` / `bg-amber-950`)**: Solar/traditional calculations, boundary sensitivities ($<1.5^\circ$), moderate agreement.
- **Rose (`#fb7185` / `bg-rose-950`)**: Cross-cultural divergence, planetary combustion, graha yuddha (planetary war), error states.
- **Purple (`#c084fc` / `bg-purple-950`)**: Esoteric harmonics (Maya Tzolk'in, Tibetan Rabjung).

## Typography

### Font Stacks & Roles
- **Data & Telemetry (`ui-monospace, monospace`)**: Used for all coordinates, angles, arcseconds, Julian Day indices, aspect orbs, and invariant proofs. Always paired with `.tabular-nums` for static numeral width.
- **Interface & Synthesis (`ui-sans-serif, system-ui, sans-serif`)**: Used for domain titles, consensus narratives, and form labels.
- **Editorial Whitepaper**: Generous line height (1.6) and comfortable reading width (max-w-4xl, 65–75ch) for monograph reading.

## Layout

### Multi-Device Responsive Architecture
- **Desktop (>1024px)**: Full multi-column telemetry dashboards with side-by-side verification dossiers and horizontal category filters.
- **Tablet (768px - 1023px)**: Responsive 2-column grids with sticky section subnav and collapsible inspector panels.
- **Mobile (<768px)**: Single-column stacked vertical slice; frozen left column (`sticky left-0`) on wide tables; touch targets expanded to $\ge 36-44$px; swipeable category pill bars.

## Elevation & Depth

- **Zero Pseudo-Depth**: Flat, crisp 1px structural borders (`border-[#1b2331]`) over blurry offset shadows.
- **Subtle Layering**: Elevation is communicated through luminance hierarchy: `#080a0f` (lowest) &rarr; `#0d1118` (middle) &rarr; `#121721` (top interactive).

## Shapes

- Radii are strictly restrained: `rounded-md` (6px) for small controls and input fields, `rounded-lg` (8px) for cards and modals, `rounded-xl` (12px) for root document views.
- No extreme pill buttons for complex content; rectangular discipline with soft corner softening.

## Components

### 1. Astronomical Coordinate Form
- Compact input fields with integrated unit labels, step-precision bounds (`0.0001` for coordinates), and HTML5 geodetic range locks (`-90` to `90`, `-180` to `180`).
- Touch-compliant category pills ($\ge 36$px height) with Lucide SVGs.

### 2. Cross-Cultural Corroboration Matrix
- Accordion cards with semantic `<button>` wrappers, `aria-expanded` state, tri-cluster polarity badges (`J:Pos`, `W:Cha`, `S:Pos`), and consensus grade badges.

### 3. Dual-Engine Verification Checklist
- Real-time invariant proof table displaying computed values against theoretical lemmas (Rahu-Ketu $180.00^\circ$, Vimshottari 120-year sum, 12 unique Zi Wei branches, Maya round-trip).

### 4. Mathematical Evidence Dossier
- Multi-modal whitepaper view supporting tabbed exploration, complete academic monograph layout, and verbatim raw markdown export with 1-click clipboard copy.

## Do's and Don'ts

### Do's
- Always format astronomical degrees to 2 or 4 decimal places with `.tabular-nums`.
- Always expose uncertainty envelopes ($T\pm 15$m) instead of inventing false birth seconds.
- Maintain high contrast ($>7:1$) for secondary text on dark surfaces using `text-slate-400` / `text-slate-300`.
- Preserve sticky left columns (`sticky left-0 bg-[#0d1118]`) on multi-column planetary tables on mobile.

### Don'ts
- Never use cartoonish emojis or mystical pastel gradients.
- Never use interactive `<div>` tags without semantic keyboard (`Enter`/`Space`) and ARIA roles.
- Never hardcode rogue dark hex colors outside the established `#080a0f`, `#0d1118`, `#121721`, `#182232` system.
- Never hide cross-cultural divergence: disagreements are first-class epistemological data.
