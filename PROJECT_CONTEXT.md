# Synodix: Project Context & Working Memory

**Last Updated:** 2026-10-21 01:45:00 UTC  
**Version:** 2.4.0  
**Stack:** Python 3.12 (FastAPI, Swiss Ephemeris 2.10, Skyfield DE421) + TypeScript / React 19 / Vite / Tailwind CSS v4  
**Workspace:** `/Volumes/Study/Projects/Astrology` (symlinked as `/Volumes/Study/Astrology`)  
**Git Remote:** `https://github.com/manvenpratap/Synodix.git`  

---

## 1. Current Status & Milestone
- **Active Phase**: Three-Tier Astrological Calculation Engine & Unified Chronocrator Timeline (Completed)
- **Tier 1 (Astrometric Core)**:
  - Six selectable house systems: Placidus (`P`), Whole Sign (`W`), Regiomontanus (`R`), Koch (`K`), Equal (`E`), Campanus (`C`).
  - Minor celestial bodies & asteroids: Chiron, Mean Lilith, True Lilith, Ceres, Pallas, Juno, Vesta in both Tropical and Sidereal zodiacs.
  - 17 Royal and Behenian Fixed Stars (Sirius, Canopus, Arcturus, Vega, Capella, Rigel, Procyon, Betelgeuse, Aldebaran, Spica, Antares, Fomalhaut, Deneb, Regulus, Algol, Altair, Alcyone) with tight conjunction detection ($<1.5^\circ$).
- **Tier 2 (Tradition Depth)**:
  - **Jyotisha**: Parashari Ashtakavarga (Sarvashtakavarga 337-bindu invariant grid + Bhinnashtakavarga for 7 grahas) and 7 Jaimini Chara Karakas (AK, AmK, BK, MK, PK, GK, DK).
  - **BaZi**: Yong Shen (Useful God & Element Recommendation engine) and Liu Nian (Annual Pillar interactions, clashes, harmonies, and Ten Gods relations).
  - **Zi Wei Dou Shu**: Canonical 14 Major Star Radiance/Brightness ratings (庙 Miao, 旺 Wang, 得 De, 利 Li, 平 Ping, 陷 Xian) across 12 earthly branches.
  - **Western**: Real-time Active Transits Engine calculating current transiting celestial positions against natal chart with applying/separating orbs.
- **Tier 3 (Unified Predictive Chronocrator Timeline)**:
  - Dynamically resolved multi-tradition chronocrator timeline unifying active Vimshottari Mahadasha/Antardasha, active BaZi Da Yun luck pillar + Liu Nian annual pillar, Western Annual Profections + active transits, Zi Wei decadal palace, and Persian Firdaria master of period.
  - Multi-system convergent domain analysis identifying corroborated life inflection points.
- **Workflow Health**: 100% CLEAN (Verified via `./pipeline.sh doctor`)
- **Test Invariants**: 8/8 regression suites passing in ~0.6s via `./pipeline.sh test --summary`
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
