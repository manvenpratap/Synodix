# Synodix: Project Context & Working Memory

**Last Updated:** 2026-10-22 08:11:47
**Version:** 2.9.0  
**Stack:** Python 3.12 (FastAPI, Swiss Ephemeris 2.10, Skyfield DE421) + TypeScript / React 19 / Vite / Tailwind CSS v4 / Capacitor 8 (iOS & Android)  
**Workspace:** `/Volumes/Study/Projects/Astrology` (symlinked as `/Volumes/Study/Astrology`)  
**Git Remote:** `https://github.com/manvenpratap/Synodix.git`  

---

## 1. Current Status & Milestone
- **Active Phase**: Culturally Authentic Display Presentation Theming (Completed)
- **Cultural Theming & Instrument Presentation Across 9 Traditions**:
  - Implemented 9 distinct cultural design systems with bespoke palettes, gradients, and structural tokens in `TraditionCharts.tsx`:
    - **Jyotisha**: Sacred Saffron & Vedic Brass (`🕉️`, *यथा पिण्डे तथा ब्रह्माण्डे*, Maharishi Parashara lineage).
    - **BaZi**: Imperial Cinnabar & Jade (`☯️`, *天地陰陽，五行生剋*, Master Xu Ziping lineage).
    - **Western**: Aegean Lapis & Bronze (`🏛️`, *Sicut superius, sic inferius*, Ptolemy Tetrabiblos lineage).
    - **Persian**: Isfahan Turquoise & Gold (`🕌`, Abu Ma'shar & Al-Qabisi Baghdad House of Wisdom).
    - **Egyptian**: Pharaonic Gold & Nile Basalt (`𓋹`, Dendera Zodiac & Senenmut Decans).
    - **Zi Wei**: Forbidden City Imperial Plum & Amethyst (`👑`, *紫微至尊，儀錄百神*, Chen Tuan Mount Hua lineage).
    - **Maya**: Mesoamerican Jadeite & Obsidian (`☀️`, Classic Maya Copán/Palenque, GMT Correlation 584283).
    - **Tibetan**: Himalayan Yak Maroon & Saffron Robe (`☸️`, Phugpa Lhundrup Gyatso, Lo Shu Mewa).
    - **Maramataka**: Pacific Ocean Deep Indigo & Pounamu Green (`🌊`, *Nā te pō i hua mai te ao*, Tohunga Kōkōrangi).
  - Cultural Immersion Header Banner: native calligraphy, lineage records, cosmological mottos, and custom presentation toggles.
  - Universal Display Presentation Switcher: `Comprehensive` (instrument + telemetry), `Visual Instrument` (focused instrument astrolabe), `Telemetry Tables` (tabular breakdown).
  - Culturally Framed Visual Instruments: custom title bars and theme-accented borders enclosing all 9 astronomical visualizers.
  - New Playwright Regression Suite: `tests/test_06_cultural_themes.py` verifying tab navigation, display presentation modes, screenshot captures, and zero critical console errors.
- **Workflow Health**: 100% CLEAN (Verified via `./pipeline.sh doctor`)
- **Test Invariants**: 13/13 regression suites passing via `./pipeline.sh test --summary` (25.08s)
- **Frontend Polish & Interaction Standards (`/impeccable polish`)**:
  - Global `Escape` key event listener added to [App.tsx](file:///Volumes/Study/Astrology/frontend/src/App.tsx) for instant dismiss of mobile sidebar navigation and API server modals without mouse/touch dependency.
  - Action button touch targets: elevated quick actions across [MathematicalEvidenceCard.tsx](file:///Volumes/Study/Astrology/frontend/src/components/MathematicalEvidenceCard.tsx) and [ReadingView.tsx](file:///Volumes/Study/Astrology/frontend/src/components/ReadingView.tsx) to $\ge 38\text{px} - 44\text{px}$ with visible focus rings (`focus-visible:ring-cyan-400`).
  - Search clear affordance in [BirthDataForm.tsx](file:///Volumes/Study/Astrology/frontend/src/components/BirthDataForm.tsx) upgraded to $44\times 44\text{px}$ minimum touch target.
  - Empty chart state action button in [App.tsx](file:///Volumes/Study/Astrology/frontend/src/App.tsx) elevated with full focus visible states and $44\text{px}$ height.
  - Zero linter issues: 0 warnings and 0 errors across all 22 source modules verified via `oxlint`.
  - Full mobile distribution artifacts (`dist/`, `Synodix-debug.apk`) synchronized.
- **Workflow Health**: 100% CLEAN (Verified via `./pipeline.sh doctor`)
- **Test Invariants**: 12/12 regression suites passing via `./pipeline.sh test --summary` (10.15s)
- **In-App Pure TypeScript Astrometric Engine**:
  - Remediated all findings from `/impeccable audit` across 5 technical dimensions.
  - WCAG 2.2 AA Contrast: global dark-mode text elevation rule in `index.css` elevating muted text to `#94a3b8` ($\ge 4.5:1$ contrast ratio).
  - Keyboard & ARIA semantics: full keyboard navigation (`role="button"`, `tabIndex={0}`, `onKeyDown` Enter/Space, `aria-pressed`) across preset galleries and interactive domain disclosures.
  - Touch target compliance: all category chips, action triggers, and submit buttons elevated to minimum $\ge 44\times 44\text{px}$.
  - Mobile table usability: frozen first columns (`sticky left-0 bg-[#0d1118] z-10`) added to planetary and verification tables for seamless horizontal scrolling on narrow viewports.
  - React 19 clean mount: eliminated cascading `set-state-in-effect` re-render triggers; 0 oxlint warnings/errors across all 22 source modules.
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
