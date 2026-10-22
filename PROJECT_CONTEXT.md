# Synodix: Project Context & Working Memory

**Last Updated:** 2026-10-22 01:30:00 UTC  
**Version:** 2.8.0  
**Stack:** Python 3.12 (FastAPI, Swiss Ephemeris 2.10, Skyfield DE421) + TypeScript / React 19 / Vite / Tailwind CSS v4 / Capacitor 8 (iOS & Android)  
**Workspace:** `/Volumes/Study/Projects/Astrology` (symlinked as `/Volumes/Study/Astrology`)  
**Git Remote:** `https://github.com/manvenpratap/Synodix.git`  

---

## 1. Current Status & Milestone
- **Active Phase**: In-App Pure TypeScript Engine & 100% Offline Standalone Sideloading (Completed)
- **In-App Pure TypeScript Astrometric Engine**:
  - Full local calculation module at `frontend/src/engine/` using `astronomy-engine` (NASA JPL VSOP87 & ELP2000 algorithms).
  - Pure client-side calculations for all 9 traditions (Western, Jyotisha, BaZi, Zi Wei, Maya, Tibetan, Persian, Egyptian, Māori) and 3-cluster consensus matrix.
  - Zero-server dependency: custom birth charts calculate in-memory in under 20ms without any backend network connection.
  - Pre-computed Titan Vault: complete 100 historical titan profiles bundled in `frontend/src/data/bundledTitans.json` for 0ms instant offline lookup.
  - Sideload Artifacts: updated `Synodix-debug.apk` (6.6MB) and `frontend/ios/App/App.xcodeproj` fully self-contained.
- **Workflow Health**: 100% CLEAN (Verified via `./pipeline.sh doctor`)
- **Test Invariants**: 12/12 regression suites passing via `./pipeline.sh test --summary` (including offline simulation suite `test_05_inapp_offline_engine.py`)
- **Mobile-First Ergonomics (`mobile-design`)**:
  - Touch target compliance: all primary interactive elements, hamburger buttons, and bottom tab navigation meet or exceed $\ge 44\times 44\text{px}$ (iOS HIG) and $\ge 48\times 48\text{dp}$ (Android Material).
  - Safe-area insets: full support for notch, Dynamic Island, and gesture bars via `env(safe-area-inset-top)` and `env(safe-area-inset-bottom)`.
  - Microinteraction refinements: elimination of 300ms double-tap delay and tap gray flashes via `touch-action: manipulation` and `-webkit-tap-highlight-color: transparent`.
  - Viewport bounds: zero horizontal overflow verified on standard mobile viewports ($390\times 844$).
- **Solar Day Light Theme**:
  - High-contrast alabaster (`#f8fafc`) and crisp pure-white surface palette with slate borders (`#e2e8f0`).
  - Calibrated spectral telemetry accents adhering to WCAG 2.2 AA contrast standards on light backgrounds (Sky-700, Emerald-700, Amber-700, Rose-700, Purple-700).
  - SVG visualizer dynamic adaptation: automatic remapping of fills, strokes, and text for North Indian Kundali, 360° aspect wheels, Wu Xing pentagrams, and 9-domain radar matrices.
  - Persistent theme toggle with `localStorage` memory and OS system `prefers-color-scheme` auto-detection.
  - Multi-location accessibility: header bar, desktop sidebar footer, and mobile drawer.
- **Workflow Health**: 100% CLEAN (Verified via `./pipeline.sh doctor`)
- **Test Invariants**: 11/11 regression suites passing via `./pipeline.sh test --summary` (including mobile viewport suite `test_04_mobile_viewport.py`)
- **Active Daemons**:
  - Backend API: `http://127.0.0.1:8000` (FastAPI daemon)
  - Frontend Observatory: `http://127.0.0.1:5173` (Vite HMR dev server)

---

## 2. Implemented Traditions & Engines
- [x] **Vedic (Jyotisha)**: Diamond Kundali visualizer, 27 Nakshatras, Vimshottari Mahadasha & Antardasha, Shadbala dignities, Gandanta zones, Graha Yuddha planetary war, Graha Drishti, Classical Yogas, Parashari Ashtakavarga (337 bindus), 7 Jaimini Chara Karakas.
- [x] **Western / Hellenistic**: 360° circular aspect wheel, major/minor aspects, antiscia/contra-antiscia, mutual receptions, essential dignities, annual profections, active transits engine.
- [x] **BaZi (Four Pillars)**: Wu Xing pentagram visualizer, 10 Heavenly Stems, 12 Earthly Branches, 10 Gods, Na Yin elements, 6 Clashes, 6 Harmonies, 3 Harmonies, 3 Punishments, Shen Sha symbolic stars, Yong Shen Useful God engine, Liu Nian annual pillar.
- [x] **Zi Wei Dou Shu**: 4x4 classical courtyard grid, 12 Palaces, 14 Major Stars with Radiance ratings (庙/旺/得/利/平/陷), Auspicious & Malefic auxiliary stars, Four Transformations (Si Hua), Da Xian decadal periods.
- [x] **Maya Calendar**: Dual Tzolkin (260-day) & Haab (365-day) interlocking gear wheels, Long Count arithmetic, Trezena sacred day sign.
- [x] **Tibetan Elemental**: 3x3 Lo Shu Mewa magic square, Parkha trigrams, elemental vitality dynamics (Sog, Lu, Wang, Lung).
- [x] **Persian / Medieval Arabic**: Almuten stacked bar meters, Dorothean triplicity lords, 7 planetary hours, Arabic Parts (Fortune, Spirit), 75-year Firdaria timeline.
- [x] **Egyptian Astronomy**: 36-decan star clock (Bakhtiu, Khentu), Sothic Sirius rising calendar, Nile inundation season alignment.
- [x] **Māori Maramataka**: 30-phase oceanic lunar dial, tapu/noa energy matrix, tide & night predictions (Whiro to Mutu).

---

## 3. Mathematical Verification & Simulation
- [x] **Dual-Engine Ephemeris Validation**: Real-time cross-validation between Swiss Ephemeris 2.10 and Skyfield JPL DE421; $\Delta\lambda < 0.01^\circ$ tolerance.
- [x] **Rodden-Rated Benchmark Dataset**: 100 verified historical titans indexed with AA/A birth certificate records.
- [x] **Global Consensus Matrix**: Cross-cultural synthesis across evaluated life domains with divergence rates ($\bar{d} \approx 31.8\%$, $\sigma \approx 0.04$).
- [x] **WCAG 2.2 AA & Motion Preferences**: System-level support for `@media (prefers-reduced-motion: reduce)` and contrast accessibility.
- [x] **Archify 5-Diagram Suite**: Compiled standalone HTML interactive diagrams (`architecture`, `workflow`, `sequence`, `dataflow`, `lifecycle`).
- [x] **Authoritative Wiki Suite**: 11 markdown documentation files in `wiki/` with vector Mermaid charts.

---

## 4. Autonomous Workflow & Pipeline Commands
- `./pipeline.sh doctor`: Diagnostic invariant verification across stack, git hygiene, test runner, and context docs.
- `./pipeline.sh heal`: Automated self-healing for distribution drift, missing test harness, or git exclusions.
- `./pipeline.sh test --summary`: Low-token compact test verification (95%+ token reduction).
- `./pipeline.sh test --smoke`: Fast critical-path smoke tests (health & sample catalog).
- `./pipeline.sh ship "<message>"`: Automated verified release gate.
