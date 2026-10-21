# Synodix: Product Specification

<!-- impeccable:product-schema 1 -->

## Platform

adaptive

## Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React
- **Backend Core**: Python 3.12+, FastAPI, Uvicorn
- **Ephemeris Engines**: Swiss Ephemeris 2.10 (`pyswisseph`), Skyfield 1.55 (NASA JPL DE421 ephemeris)
- **Cultural Calendar Engines**: `lunar_python` (BaZi & Zi Wei), `convertdate` (Maya Long Count / Tzolk'in / Haab'), Custom Tibetan Phugpa element engine
- **Multi-Device Target**: Progressive Web App (PWA) + Capacitor iOS & Android wrapper + Desktop Web

## Users

- **Primary User**: Serious astrology researchers, intellectual skeptics, tech-literate seekers, and cross-cultural enthusiasts who demand mathematical proof, astronomical accuracy, and multi-system validation over generic horoscopes.
- **Secondary User**: Individuals wanting a single, unified source of truth across both Eastern and Western traditions without consulting separate disparate calculators.
- **Operating Situation**: Mobile quick lookup on the go; tablet split-view comparative analysis; desktop deep research and export to markdown/JSON/print dossiers.

## Synodix: Product Specification Purpose

To provide the world's first mathematically audited, deterministic, multi-civilizational astrological intelligence engine. The product triangulates six historically isolated traditions (Jyotisha, BaZi, Western Hellenistic, Zi Wei Dou Shu, Maya, and Tibetan) against NASA JPL planetary ephemerides and empirical Monte Carlo controls, replacing fatalistic fortune-telling with rigorous archetypal synthesis and transparent uncertainty boundaries.

## Positioning

"The First Mathematically Audited Astrological Intelligence Engine in History."
Unlike Co-Star, The Pattern, or Sanctuary—which offer single-culture deterministic horoscopes, hide birth-time uncertainty, and rely on confirmation bias—this engine calculates real dual-engine celestial mechanics, tests against 1,000 Monte Carlo controls, openly displays a 31.8% divergence rate where traditions disagree, and models time uncertainty with a transparent T±15m ensemble.

## Operating Context

- Inputting birth dates, times, and geodetic coordinates with millisecond precision.
- Reviewing true astronomical solar time (`LMST` & `LAST`), equation of time, and boundary sensitivities.
- Cross-referencing 9 life domains across Jyotisha, Western, and Sinic clusters.
- Reading and exporting comprehensive corroborated dossiers (.md, .json, print-ready PDF).
- Validating planetary placements against NASA JPL DE421 ephemerides with $\Delta \le 0.003^\circ$ accuracy.

## Capabilities and Constraints

- **Confirmed Functionality**: Full 6-tradition calculation pipeline, dual-engine ephemeris validation, 100 historical titans database (100% Rodden AA/A), 9-domain consensus synthesis, 4-system chronology synchronization, 6-axis temperament radar, empirical Monte Carlo evidence whitepaper.
- **Technical Constraints**: Ephemeris requires C-extensions (`pyswisseph`) and high-precision JPL DE421 binary files; native mobile execution requires lightweight client-server API or Pyodide compilation.
- **Durable Product Principles**: Zero silent rectification, non-fatalistic archetypal modeling, radical divergence transparency.

## Brand Commitments

- **Tone & Voice**: Academic mission control, scholarly gravitas, Bloomberg terminal for planetary dynamics.
- **Visual Identity**: Deep obsidian observatory dark surfaces (`#080a0f`, `#0d1118`), spectral telemetry accents (Cyan for verification, Emerald for consensus/invariants, Amber for solar/traditional, Rose for divergence/combustion).
- **Iconography**: Surgical, uniform stroke Lucide SVGs (no cartoonish emojis).

## Evidence on Hand

- Verified dataset of 100 historical titans with Rodden AA/A certified records (`backend/app/data/personalities_100.json`).
- Empirical Monte Carlo baseline of 1,000 synthetic random births (`backend/app/data/mathematical_evidence_stats.json`).
- Published research report on statistical non-randomness and debiasing (`backend/app/data/mathematical_evidence_astrology_report.md`).
- Deterministic test suites passing at 100% (`backend/tests/test_engine.py`, `backend/tests/test_simulation_personalities.py`).

## Synodix: Product Specification Principles

1. **Radical Mathematical Honesty**: Never fake precision; display uncertainty envelopes (T±15m) and divergence rates (31.8%) openly.
2. **Deterministic Dual Verification**: Every planetary coordinate must match NASA JPL DE421 within $\le 0.01^\circ$.
3. **Triangulation Over Dogma**: No single system is treated as infallible; human experience is modeled through the consensus of isolated civilizational cosmologies.
4. **Privacy & Local Ownership**: The user's birth data belongs to them; zero tracking, zero advertising monetization, client-first data residency.
5. **Efficiency & Low Overhead (Ponytail)**: Native browser capabilities, offline-first storage, standard web protocols, and zero unnecessary bloat.

## Accessibility & Inclusion

- Adherence to WCAG 2.2 AA standards across all viewports.
- Minimum touch targets of $\ge 36-44$px for all touch surfaces.
- High-contrast text ($>7:1$) on dark backgrounds.
- Full keyboard navigability and semantic ARIA landmarks across all interactive dossiers and accordions.
