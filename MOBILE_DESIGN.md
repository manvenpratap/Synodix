# Synodix Mobile Design System

**Version:** 2.40.0  
**Philosophy:** Touch-first • Platform-respectful • Battery-conscious • 100% Offline-capable  
**Core Law:** Mobile is not a small desktop. Think touch ergonomics and hardware constraints first.

---

## 1. Mobile Feasibility & Risk Index (MFRI)

```
MFRI = (Platform Clarity + Accessibility Readiness) 
       − (Interaction Complexity + Performance Risk + Offline Dependence)
```

| Dimension | Rating (1–5) | Justification |
| :--- | :--- | :--- |
| **Platform Clarity** | **5** | iOS & Android explicitly targeted via Capacitor 8 native targets. |
| **Accessibility Readiness** | **5** | All touch targets $\ge 44\times 44\text{px}$, WCAG 2.2 AA compliant, screen-reader labels. |
| **Interaction Complexity** | **2** | Clean 5-tab bottom navigation, swipeable carousels, zero gesture collisions. |
| **Performance Risk** | **2** | React 19 + Vite bundle (596ms build), 60fps GPU transforms, zero unmemoized lists. |
| **Offline Dependence** | **1** | 100% offline-capable via bundled pure TS ephemeris engine. |

$$\text{MFRI} = (5 + 5) - (2 + 2 + 1) = 10 - 5 = \mathbf{+5} \quad (\text{Safe / Low Risk})$$

---

## 2. Touch Psychology & Fitts' Law Architecture

### Target Dimension Hierarchy
- **Primary CTAs** (e.g. `Calculate All 9 Traditions`): $\ge 48\text{px}$ height (`min-h-[48px]`), full thumb-width.
- **Navigation & Tab Targets**: $\ge 48\text{px}$ height (`min-h-[48px]`), centered in the lower 20% natural thumb reach zone.
- **Secondary Filters & Chips**: $\ge 44\times 44\text{px}$ touch targets (`min-h-[44px]`).
- **Hemisphere & Stepper Toggles**: $\ge 44\times 44\text{px}$ bounding box.

### One-Handed Thumb Zones
```
┌─────────────────────────────────────┐
│ 🔴 HARD TO REACH (Top 25%)          │  ← Brand header, status indicators
├─────────────────────────────────────┤
│ 🟡 COMFORTABLE REACH (Middle 50%)   │  ← Astrological instruments, data tables
├─────────────────────────────────────┤
│ 🟢 NATURAL THUMB ARC (Bottom 25%)   │  ← Bottom Nav, Primary Action CTA, Journey Stepper
└─────────────────────────────────────┘
```

---

## 3. Physical Feedback & Haptics Engine (`triggerHaptic`)

Calibrated physical vibration patterns via `frontend/src/utils/haptics.ts`:

| Pattern | Duration / Pulse | Usage |
| :--- | :--- | :--- |
| `selection` / `light` | `8ms` | Bottom navigation tab switches, layout mode toggles, tradition quick pills |
| `medium` | `20ms` | Primary CTA press (`Calculate All 9 Traditions`, `Swap Partners`) |
| `success` | `[12ms, 35ms, 18ms]` | Vault profile save confirmation, local chart generation complete |
| `warning` / `error` | `[25ms, 40ms, 25ms, 40ms, 25ms]` | Boundary proximity alerts, validation failure |

---

## 4. Platform Respect & Safe Area Insets

### iOS (Human Interface Guidelines)
- **Top Notch & Dynamic Island**: `padding-top: env(safe-area-inset-top, 0px)`.
- **Home Indicator**: `padding-bottom: max(0.75rem, env(safe-area-inset-bottom, 0px))`.
- **Input Zoom Immunity**: `font-size: 16px !important` on `<input>`, `<select>`, `<textarea>` for `@media (max-width: 639px)` prevents iOS Safari auto-zoom disorientation.
- **Frosted Acrylic Material**: `backdrop-filter: blur(24px) saturate(180%)`.

### Android (Material 3)
- **Edge-to-Edge Navigation**: Nav bar transparent overlay with reactive elevation shadows.
- **Ripple & Touch Manipulation**: `touch-action: manipulation` eliminates 300ms tap delay.
- **System Back Handling**: Hardware back button integration via Capacitor back button listener.

---

## 5. Automated Verification & Regression Suite

Continuous verification via Playwright under [`tests/test_04_mobile_viewport.py`](tests/test_04_mobile_viewport.py):
- **Narrow Viewport**: iPhone SE (`375x667`)
- **Standard Viewport**: iPhone 14 (`390x844`)
- **Invariants Enforced**:
  - $\text{Horizontal Overflow} \equiv 0\text{px}$ across all 8 screens.
  - All interactive targets $\ge 44\times 44\text{px}$.
  - Zero critical console errors.
