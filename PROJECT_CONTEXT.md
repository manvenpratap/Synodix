# Synodix: Project Context & Working Memory

**Last Updated:** 2026-10-23 06:49:47
**Version:** 2.18.0  
**Stack:** Python 3.12 (FastAPI, Swiss Ephemeris 2.10, Skyfield DE421) + TypeScript / React 19 / Vite / Tailwind CSS v4 / Framer Motion / Capacitor 8 (iOS & Android)  
**Workspace:** `/Volumes/Study/Projects/Astrology` (symlinked as `/Volumes/Study/Astrology`)  
**Git Remote:** `https://github.com/manvenpratap/Synodix.git`  

---

## 1. Current Status & Milestone
- **Active Phase**: Impeccable Motion System: 27 World-Class Animations (Completed)
- **Impeccable Motion System Architecture (27 Opportunities Implemented)**:
  - **Pillar I (Astrometric Ingestion & Workbench)**: Calculation laser scan sweep across button surface (`.animate-laser-scan`), geodetic GPS radar pulse (`.animate-radar-pulse`), sliding spring pill for segmented mode switcher (`layoutId="active-experience-pill"`), and FLIP card reflow for 100 Titans gallery with smooth biographical dossier ingress.
  - **Pillar II (Spatial Continuity & HUD Navigation)**: Mobile journey stepper pulse and energy bead propagation, shared-element subject plate crossfade flip on subject switch, solar eclipse rotation on theme toggle, and optical reticle corner lock-in (`.reticle-corner-*`).
  - **Pillar III (9 Deterministic Cultural Visualizers)**: Parashari Diamond Kundali geometric line draw (`.animate-kundali-draw`), BaZi Wu Xing generating cycle dash flow (`.animate-cycle-flow`) and overcoming cycle beams (`.animate-beam-pulse`), Western 360° aspect wheel ray highlighting, Zi Wei 4x4 courtyard palace hover elevation and imperial plum breathing aura (`.animate-aura-breathe`), and Maya interlocking gear rotation (`.animate-gear-sync`, `.animate-gear-reverse`).
  - **Pillar IV (Cross-Cultural Synthesis & Consensus)**: 9-domain consensus radar polygon reveal (`.animate-radar-reveal`), dynamic divergence gauge bar fluid fill, and fluid height disclosure accordions.
  - **Pillar V (Empirical Verification & Evidence)**: Invariant card hover micro-elevation, max delta checkmark indicator, and Monte Carlo KPI scorecard elevation.
  - **Pillar VI (Tactile Feedback & Micro-Interactions)**: Feature explainer modal aperture reveal and backdrop bloom, one-click export clipboard checkmark morph with emerald glow.
  - **Accessibility Invariant**: 100% compliant with `prefers-reduced-motion: reduce`.
  - **Workflow Health**: 100% CLEAN (Verified via `./pipeline.sh doctor`)
  - **Test Invariants**: 16/16 regression suites passing via `./pipeline.sh test --summary` (39.34s)
- **Mobile Epistemological Journey Navigation & Decluttering**:
  - **Epistemological Guided Journey**: Introduced a 5-step interactive mobile journey stepper (`1. Input` ➔ `2. Traditions` ➔ `3. Synthesis` ➔ `4. Dossier` ➔ `5. Evidence`) positioned directly below the fixed header on mobile devices. Features status indicators (active step cyan glow, completed steps emerald badge) and one-tap step navigation.
  - **Forward / Backward Flow CTAs**: Placed thumb-friendly navigation action bars at the bottom of each view (`← Back to Workbench` | `Explore Cross-Cultural Synthesis Matrix →`, `← View Traditions` | `Read Full Corroboration Dossier →`, `← Synthesis Matrix` | `View Mathematical Evidence Whitepaper →`, `← Corroboration Dossier` | `Return to Workbench ↺`), converting 5 disparate tabs into a natural, progressive scientific narrative.
  - **Decluttered Mobile Layouts Without Feature or Data Loss**:
    - `InputAuditCard`: Added mobile collapsible disclosure saving >500px of vertical space on Workbench while preserving 100% of astronomical time and boundary invariants.
    - `TraditionCharts`: Streamlined mobile headers by hiding verbose academic descriptions on `<sm` viewports so the visual instruments (Kundali, wheel, pentagram, steles) and controls are immediately visible.
    - `SynthesisMatrix`: Added quick "Expand All / Collapse All Domains" toggle for rapid mobile scanning without losing any detailed tradition corroboration data.
    - `ReadingView`: Streamlined header text to bring the generated reading document directly into view.
    - Header Active Subject Chip: Added mobile active subject pill next to the title for instantaneous context and one-tap return to profile switching.
  - **City Autocomplete Fast-Path**: Instant 0ms local offline gazetteer matching for known global cities before network fallback, and resilient Enter-key suggestion selection.
  - **Workflow Health**: 100% CLEAN (Verified via `./pipeline.sh doctor`)
  - **Test Invariants**: 16/16 regression suites passing via `./pipeline.sh test --summary` (37.26s)
- **Unique App Design Overhaul (Spatial Observatory & Machined Doppelrand)**:
  - **Spatial Observatory Atmosphere**: Transformed flat black backdrops into a deep astronomical observatory canvas (`.celestial-observatory-canvas`) featuring subtle coordinate grid dots, celestial radial telemetry auras, and calibrated parchment in Solar Day light mode.
  - **Machined Doppelrand Enclosures**: Replaced generic web boxes with precision double-bezel hardware enclosures (`.machined-bezel` + `.machined-core`), featuring milled hairline bezels, optical corner reticles (`⌜` / `⌝` / `⌞` / `⌟`), and concentric radii across all core cards.
  - **Kinetic Astrolabe Logo**: Elevated the nonagon geometric armilla mark with a continuous, slow orbital ring animation (`.animate-orbital-spin`) and illuminated planetary nucleus.
  - **Engraved Subject Dossier**: Integrated a tactile subject plate with live divergence gauge bar displaying real-time cross-cultural consensus telemetry.
  - **Jewel-Toned Civilizational Array (9)**: Upgraded canonical tradition badges with signature cultural glyphs and jewel accents (Vedic Saffron, Aegean Lapis, Imperial Cinnabar, Forbidden Plum, Mesoamerican Jade, Himalayan Maroon, Isfahan Turquoise, Pharaonic Gold, Pacific Pounamu).
  - **Floating Mission-Control HUD Header**: Elevated top navigation into a detached glass capsule with real-time celestial telemetry pills and illuminated optical divider.
  - **Framer Motion View Transitions**: Added silky `<AnimatePresence mode="wait">` screen transitions (`ease: [0.16, 1, 0.3, 1]`) providing physical weight and zero layout shifts.
  - **Full Dual-Theme Discipline**: 100% synchronized for both Deep Space Dark Mode and Solar Day Alabaster Light Mode.
- **Website Builder Stack Integration**:
  - **UI/UX Pro Max**: Initialized and configured via `uipro init --ai claude`, providing 50+ styles, 161 palettes, and 57 font pairings to eliminate generic AI designs.
  - **Framer Motion**: Integrated `framer-motion` into `frontend/package.json` for high-performance layout transitions, gesture physics, and page animation cascades.
  - **21st.dev Magic**: Verified configured MCP server in `~/.claude.json` with direct access to 100+ production-grade React components.
- **Mobile Design & Platform Ergonomics Achievements**:
  - Eliminated viewport expansion and horizontal overflow across narrow mobile form factors (iPhone SE $375\times 667$, iPhone 14/15 $390\times 844$, Pixel 7 $412\times 915$). All 5 core navigation screens (Workbench, Traditions, Synthesis, Dossier, Evidence) verified at 0px overflow.
  - Resolved top header crowding on mobile viewports (<640px): converted Feature Guide and Theme switcher into compact icon buttons and hid redundant "Study" link (accessible directly at the bottom thumb zone).
  - Mode Switcher responsive typography: "Custom Manual Input" / "Historical Titans (100)" adapt cleanly on mobile without clipping or forcing horizontal scroll.
  - Enhanced Touch Target Standards: upgraded inputs, selects, mode switchers, quick action toolbars, and close buttons across `BirthDataForm`, `TraditionCharts`, `ReadingView`, `SynthesisMatrix`, and `MathematicalEvidenceCard` to meet or exceed $\ge 44\times 44\text{px}$ (iOS HIG) and $\ge 48\times 48\text{dp}$ (Android Material).
  - iOS Safari Auto-Zoom Prevention: enforced `16px !important` minimum font-size rule on all mobile inputs (`input`, `select`, `textarea`) below 640px.
  - Fixed-Navbar & Sticky-Header Inset Protection: configured `scroll-padding-top: calc(4.5rem + env(safe-area-inset-top, 0px))` and `scroll-padding-bottom: calc(5.5rem + env(safe-area-inset-bottom, 0px))` to prevent elements from scrolling underneath fixed navigation.
  - Touch scrolling inertia: added `-webkit-overflow-scrolling: touch` and `overscroll-x-contain` across tablists and data matrices.
  - Expanded Playwright Mobile Regression Suite (`test_04_mobile_viewport.py`) validating multi-screen navigation, mode switcher heights, form input tap targets, explainer modal close targets, and zero critical console errors.
  - Distribution Packaging: compiled native Android APK (`dist/mobile/astrology-android-debug.apk`, 6.9MB) and iOS Simulator bundle (`dist/mobile/astrology-ios-simulator.zip`, 3.8MB).
- **Workflow Health**: 100% CLEAN (Verified via `./pipeline.sh doctor`)
- **Test Invariants**: 16/16 regression suites passing via `./pipeline.sh test --summary` (47.47s)
- **Design System & Interaction Standards**:
  - Full adherence to UI/UX Pro Max and Frontend Design criteria (WCAG AAA/AA, zero AI slop, cohesive astrometric observatory aesthetic).
  - Synchronized all 14 background and border classes in `index.css` for flawless Solar Day light mode rendering with zero dark-border leaks.
  - Elevated muted typography in light mode (`.text-slate-500` to `#475569`, achieving 7.0:1 contrast ratio).
  - Focus ring & keyboard navigation: enforced `focus-visible:ring-2 focus-visible:ring-cyan-400` across all action buttons, header navigation, modals, and segmented controls.
  - Interactive affordance: guaranteed `cursor-pointer` on every interactive trigger.
  - Mobile touch ergonomics: expanded touch targets to $\ge 44\times 44\text{px}$ / $\ge 36\text{px}$ across filter pills, view toggles, and modal action triggers.
  - Code hygiene: 0 oxlint warnings/errors across all 27 files, 0 detector findings in `impeccable detect`.
- **Workflow Health**: 100% CLEAN (Verified via `./pipeline.sh doctor`)
- **Test Invariants**: 16/16 regression suites passing via `./pipeline.sh test --summary` (32.11s)
- **Clean Independent Custom Input Architecture**:
  - Eliminated visual interference between custom chart calibration and the 100 historical titan sample records in [BirthDataForm.tsx](file:///Volumes/Study/Astrology/frontend/src/components/BirthDataForm.tsx).
  - Segmented Experience Switcher:
    - **Custom Manual Input**: A clean, distraction-free astrometric workbench dedicated entirely to personal, client, and custom natal records. The 100 celebrity cards, category pills, and titan search bar are completely hidden. Features custom subject naming, instant reset, personal vault quick-loader, time uncertainty calibrator, geocoding intelligence, and GPS detection.
    - **Historical Titans Archive (100)**: A dedicated benchmark browser organizing 100 Rodden AA/A verified historical records across 7 categories with real-time search. Selected titans feature a full biographical dossier with one-click "Calculate Titan Chart" and "Customize in Manual Input" (which transfers the titan's coordinates and temporal bounds into the clean custom workbench to edit without visual interference).
  - New Playwright regression suite `tests/test_08_independent_input_experience.py` validating complete visual isolation, mode switching, custom subject calculation, titan data transfer, zero horizontal overflow, and zero console errors.
- **Workflow Health**: 100% CLEAN (Verified via `./pipeline.sh doctor`)
- **Test Invariants**: 16/16 regression suites passing via `./pipeline.sh test --summary` (31.43s)
- **City Auto-Suggest & Coordinate Intelligence**:
  - Implemented real-time city auto-suggest dropdown and geodetic coordinate resolution in [BirthDataForm.tsx](file:///Volumes/Study/Astrology/frontend/src/components/BirthDataForm.tsx).
  - Curated offline gazetteer of global cities, capitals, and historical titan birthplaces in [worldCities.ts](file:///Volumes/Study/Astrology/frontend/src/data/worldCities.ts) with prefix and substring indexing.
  - Hybrid client geocoding engine in [geocoding.ts](file:///Volumes/Study/Astrology/frontend/src/utils/geocoding.ts) providing 0ms instant local resolution with resilient online OpenStreetMap/Photon fallback.
  - One-click HTML5 GPS device geolocation detection with automatic precision coordinate binding.
  - Status telemetry badges: `Auto-Geocoded` (emerald), `GPS Active` (cyan), `Manual` (amber) with keyboard navigation (`ArrowDown`, `ArrowUp`, `Enter`, `Escape`) and outside-click dismissal.
  - Backend `/api/geocode?q={query}` endpoint in [backend/app/main.py](file:///Volumes/Study/Astrology/backend/app/main.py) for synchronized client/server resolution.
  - Playwright regression suite `tests/test_07_geocoding_intelligence.py` validating dropdown rendering, auto-fill coordinates, keyboard selection, manual overrides, and zero critical console errors.
- **In-App Astrometric Feature Explainers**:
  - Over 50 comprehensive domain-accurate feature explainers integrated across all 9 cultural traditions, Synthesis Matrix, Reading View, and Evidence cards.
  - Interactive `ExplainerTrigger` dialogs providing historical lineage, astronomical mechanics, and mathematical interpretation guidelines on demand.
  - Header responsiveness fix: tuned live telemetry pills to `2xl:flex` eliminating horizontal overflow at 1280px viewports across all tradition views.
- **Workflow Health**: 100% CLEAN (Verified via `./pipeline.sh doctor`)
- **Test Invariants**: 15/15 regression suites passing via `./pipeline.sh test --summary` (30.6s)
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
