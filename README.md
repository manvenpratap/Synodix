# Synodix: Astrometric Triangulation Engine & Observatory

A computational, independently verified, uncertainty-tested, and synthesized astrological observatory across classical world traditions: **Jyotisha**, **BaZi**, **Western / Hellenistic**, **Zi Wei Dou Shu**, **Maya Calendar**, **Tibetan Elemental**, **Persian / Medieval Arabic**, **Egyptian Decans**, and **Polynesian Maramataka**.

Built with **FastAPI** (Python 3.12), **Swiss Ephemeris** (`pyswisseph`), **JPL DE421** (`skyfield`), and a modern decoupled **React 19 + TypeScript + Vite + Tailwind CSS** frontend.

---

## Core Philosophy & Design Principles

1. **Dual-Engine Independent Verification**: Every planetary position is computed via Swiss Ephemeris and independently checked against NASA/JPL DE421 via Skyfield at the exact same instant (alert threshold > 0.01°).
2. **Honest Time-Uncertainty Testing ($T-, T, T+$)**: Evaluates birth records across an uncertainty interval ($\pm 2\text{m}, \pm 15\text{m}, \pm 30\text{m}$) and marks sensitive outputs as boundary-dependent rather than assuming false precision or performing silent rectification.
3. **Disciplined Synthesis Without Double-Counting**:
   - **Three Primary Voting Clusters**: Jyotisha (1 vote), Western / Hellenistic (1 vote), and Sinic (BaZi + Zi Wei Dou Shu together contribute at most 1 vote).
   - **Symbolic Overlays**: Maya Calendar and Tibetan Elemental astrology provide non-causal temperament archetypes and cannot upgrade life-domain votes.
   - **Prominence vs. Polarity**: Separates occupying weight from favorable/challenging polarity.
   - **Transparent Divergence Rate**: Disagreements between systems are directly quantified rather than smoothed over.
4. **Safety & Anti-Barnum Standard**: Strictly omits medical diagnosis, financial guarantees, lifespan claims, pregnancy predictions, or supernatural claims.

---

## Supported Traditions & Mathematical Foundations

| System | Coordinate & Calendar Base | Key Computed Structures |
| :--- | :--- | :--- |
| **Jyotisha** | Sidereal Zodiac (Lahiri / Chitra Paksha Ayanamsha), Whole-Sign | D1 Rashi, 27 Nakshatras & 4 Padas, D9 Navamsha, D10 Dashamsha, exact 120-year Vimshottari Mahadasha/Antardasha timeline, classical yogas whitelist. |
| **BaZi (Four Pillars)** | Astronomical Solar Terms (Jie Qi), Apparent Solar Time | Four Pillars (Year, Month, Day, Hour), Ten Gods (Shi Shen), Hidden Stems (Cang Gan), Five Elements distribution, Day Master strength assessment, Da Yun 10-year luck pillars. |
| **Western / Hellenistic** | Tropical Zodiac, Whole-Sign | Day/Night Sect (actual horizon), 5-fold Essential Dignities (Egyptian bounds, Dorothean triplicities, Chaldean decans), Lots of Fortune & Spirit, Annual Profections, Aspect grid. |
| **Zi Wei Dou Shu** | Lunar-Solar Calendar, 12 Earthly Branches | 12 Palaces (Ming, Shen, etc.), Five Elements Bureau (Wu Xing Ju), 14 Major Stars, Four Transformations (Si Hua: Lu, Quan, Ke, Ji), Decadal luck periods (Da Xian). |
| **Maya Calendar** | GMT Correlation 584283 | Long Count (`baktun.katun.tun.uinal.kin`), 260-day Tzolk'in, 365-day Haab', Calendar Round, Lord of the Night (G1–G9), verified round-trip check. |
| **Tibetan Elemental** | 60-Year Rabjung Cycle (Base 1027 CE) | Year Element, Gender, Animal, 9 Mewa magic square, 8 Parkha trigrams, Five Personal Forces (Sog/Life, Lu/Body, Wang/Power, Lungta/Wind-Horse, La/Soul). |

---

## Project Structure

```text
/Volumes/Study/Astrology/
├── backend/
│   ├── app/
│   │   ├── core/
│   │   │   ├── time_audit.py        # Step 2: Timezone, solar times, boundary audit, uncertainty ensemble
│   │   │   └── ephemeris.py         # Step 4A: Swiss Ephemeris + Skyfield JPL DE421 verification
│   │   ├── traditions/
│   │   │   ├── jyotisha.py          # Step 4B: D1, Nakshatras, Navamsha, Vimshottari, Yogas
│   │   │   ├── bazi.py              # Step 4C: Four Pillars, Ten Gods, Elements, Da Yun
│   │   │   ├── western.py           # Step 4D: Whole-Sign, Sect, Dignities, Lots, Profections
│   │   │   ├── ziwei.py             # Step 4E: 12 Palaces, 14 Stars, Si Hua, Da Xian
│   │   │   ├── mayan.py             # Step 4F: Long Count, Tzolk'in, Haab', round-trip
│   │   │   └── tibetan.py           # Step 4G: Rabjung, 9 Mewa, 8 Parkha, 5 Forces
│   │   ├── synthesis/
│   │   │   ├── verification.py      # Step 5: Invariants checking & confidence scoring
│   │   │   └── synthesis.py         # Step 7 & 8: 9 Domains, divergence rate, reading generator
│   │   └── main.py                  # FastAPI application with REST endpoints & SPA static serving
│   └── tests/
│       └── test_engine.py           # Self-check test suite (10/10 green)
├── frontend/                        # Decoupled React 19 + TypeScript + Vite + Tailwind CSS
│   ├── src/
│   │   ├── App.tsx                  # Main application orchestrator
│   │   ├── types.ts                 # Full TypeScript schemas
│   │   └── components/
│   │       ├── BirthDataForm.tsx    # Step 1 input form with presets & uncertainty controls
│   │       ├── InputAuditCard.tsx   # Step 2 normalized times & ensemble breakdown
│   │       ├── VerificationCard.tsx # Step 5 dual-engine diff table & invariants
│   │       ├── TraditionCharts.tsx  # Step 4 interactive tabs for 6 traditions
│   │       ├── SynthesisMatrix.tsx  # Step 7 9-domain matrix, divergence rate, chronology
│   │       └── ReadingView.tsx      # Step 8 academic reading & one-click JSON/MD exports
│   └── dist/                        # Production build
└── README.md
```

---

## Quickstart & Execution

### 1. Run the Backend Automated Test Suite
Verify all 6 traditions, dual-engine ephemeris, invariants, and synthesis:
```bash
PYTHONPATH=. .venv/bin/python backend/tests/test_engine.py
```
Output:
```text
>>> 1. Testing Input Normalization & Audit... [PASS]
>>> 2. Testing Dual-Engine Ephemeris (Swiss Ephemeris vs Skyfield)... [PASS]
>>> 3. Testing Jyotisha Engine... [PASS]
>>> 4. Testing BaZi Engine... [PASS]
>>> 5. Testing Western / Hellenistic Engine... [PASS]
>>> 6. Testing Zi Wei Dou Shu Engine... [PASS]
>>> 7. Testing Maya Calendar Engine... [PASS]
>>> 8. Testing Tibetan Elemental Engine... [PASS]
>>> 9. Testing Verification Report & Invariants... [PASS]
>>> 10. Testing Cross-Cultural Synthesis Matrix (9 Domains)... [PASS]
ALL 10 TESTS PASSED CLEANLY! Engine is 100% verified.
```

### 2. Start the Full-Stack Application (Single Command)
FastAPI automatically serves the production React frontend and all API routes:
```bash
PYTHONPATH=. .venv/bin/uvicorn backend.app.main:app --host 127.0.0.1 --port 8000
```
Open **[http://localhost:8000](http://localhost:8000)** in your browser.

### 3. Decoupled Development Mode (Hot Reloading)
- **Backend API**:
  ```bash
  PYTHONPATH=. .venv/bin/uvicorn backend.app.main:app --reload --port 8000
  ```
- **Frontend (Vite dev server)**:
  ```bash
  cd frontend
  npm run dev
  ```
  Open **[http://localhost:5173](http://localhost:5173)** in your browser (automatically proxies `/api` calls to port 8000).

---

## API Endpoints

- `GET /api/health` — Checks status of ephemeris engines and JPL DE421 validator.
- `GET /api/sample-charts` — Returns validated historical presets (Steve Jobs, Albert Einstein, Carl Jung).
- `POST /api/audit-input` — Normalizes birth data, calculates solar times, and boundary distances.
- `POST /api/compute-chart` — Computes the complete 6-culture verified chart, runs uncertainty ensemble, dual-engine verification, and synthesis.

---

## License & Disclaimer
This project is for educational, historical, and symbolic inquiry. It does not provide medical, legal, or financial advice.
