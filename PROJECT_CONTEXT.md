# Synodix: Project Context & Working Memory

**Last Updated:** 2026-10-21 00:48:00 UTC  
**Version:** 2.2.0  
**Stack:** Python 3.12 (FastAPI, Swiss Ephemeris 2.10, Skyfield DE421) + TypeScript / React 19 / Vite / Tailwind CSS v4  
**Workspace:** `/Volumes/Study/Projects/Astrology` (symlinked as `/Volumes/Study/Astrology`)  
**Git Remote:** `https://github.com/manvenpratap/Synodix.git`  

---

## 1. Current Status & Milestone
- **Active Phase**: Synodix Astrometric Triangulation Engine & Observatory
- **Decoupled Architecture**: All fixed culture and domain counts removed across UI, headers, and metadata, allowing dynamic expansion to any number of traditions or life domains.
- **Workflow Health**: 100% CLEAN (Verified via `./pipeline.sh doctor`)
- **Test Invariants**: 8/8 regression suites passing in ~0.5s via `./pipeline.sh test --summary`
- **Active Daemons**:
  - Backend API: `http://127.0.0.1:8000` (FastAPI daemon)
  - Frontend Observatory: `http://127.0.0.1:5173` (Vite HMR dev server)

---

## 2. Implemented Traditions & Engines
- [x] **Vedic (Jyotisha)**: Diamond Kundali visualizer, 27 Nakshatras, Vimshottari Mahadasha, Shadbala dignities, Gandanta zones, Graha Yuddha planetary war, Graha Drishti, Classical Yogas (Raja, Dhana, Ruchaka, Sasa, Budhaditya).
- [x] **Western / Hellenistic**: 360° circular aspect wheel, major/minor aspects, antiscia/contra-antiscia, mutual receptions, essential dignities, annual profections.
- [x] **BaZi (Four Pillars)**: Wu Xing pentagram visualizer, 10 Heavenly Stems, 12 Earthly Branches, 10 Gods, Na Yin elements, 6 Clashes, 6 Harmonies, 3 Harmonies, 3 Punishments, Shen Sha symbolic stars.
- [x] **Zi Wei Dou Shu**: 4x4 classical courtyard grid, 12 Palaces, 14 Major Stars, Auspicious & Malefic auxiliary stars, Four Transformations (Si Hua).
- [x] **Maya Calendar**: Dual Tzolkin (260-day) & Haab (365-day) interlocking gear wheels, Long Count arithmetic, Trezena sacred day sign.
- [x] **Tibetan Elemental**: 3x3 Lo Shu Mewa magic square, Parkha trigrams, elemental vitality dynamics (Sog, Lu, Wang, Lung).
- [x] **Persian / Medieval Arabic**: Almuten stacked bar meters, Dorothean triplicity lords, 7 planetary hours, Arabic Parts (Fortune, Spirit).
- [x] **Egyptian Astronomy**: 36-decan star clock (Bakhtiu, Khentu), Sothic Sirius rising calendar, Nile inundation season alignment.
- [x] **Māori Maramataka**: 30-phase oceanic lunar dial, tapu/noa energy matrix, tide & night predictions (Whiro to Mutu).

---

## 3. Mathematical Verification & Simulation
- [x] **Dual-Engine Ephemeris Validation**: Real-time cross-validation between Swiss Ephemeris (Moshier/DE431) and Skyfield JPL DE421; $\Delta\lambda < 0.01^\circ$ tolerance.
- [x] **Rodden-Rated Benchmark Dataset**: 100 verified historical titans indexed with AA/A birth certificate records.
- [x] **Global Consensus Matrix**: Cross-cultural synthesis across evaluated life domains with divergence rates ($\bar{d} \approx 31.8\%$, $\sigma \approx 0.04$).
- [x] **WCAG 2.2 AA & Motion Preferences**: System-level support for `@media (prefers-reduced-motion: reduce)` and contrast accessibility.

---

## 4. Autonomous Workflow & Pipeline Commands
- `./pipeline.sh doctor`: Diagnostic invariant verification across stack, git hygiene, test runner, and context docs.
- `./pipeline.sh heal`: Automated self-healing for distribution drift, missing test harness, or git exclusions.
- `./pipeline.sh test --summary`: Low-token compact test verification (95%+ token reduction).
- `./pipeline.sh test --smoke`: Fast critical-path smoke tests (health & sample catalog).
