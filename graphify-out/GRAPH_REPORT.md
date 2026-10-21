# Graph Report - Astrology  (2026-10-21)

## Corpus Check
- 57 files · ~713,949 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 496 nodes · 579 edges · 42 communities (40 shown, 2 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 34 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `6812c1d8`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]

## God Nodes (most connected - your core abstractions)
1. `compute_chart_endpoint()` - 15 edges
2. `compute_jyotisha_chart()` - 15 edges
3. `test_six_culture_pipeline()` - 15 edges
4. `Synodix: Astrometric Triangulation Engine & Observatory` - 13 edges
5. `Synodix: Product Specification` - 12 edges
6. `🏛️ Comprehensive Breakdown of the 9 Traditions` - 10 edges
7. `getSavedProfiles()` - 9 edges
8. `Design System` - 9 edges
9. `Mathematical Evidence & Empirical Validation of Astrological Modeling` - 9 edges
10. `build_synthesis()` - 8 edges

## Surprising Connections (you probably didn't know these)
- `test_deterministic_chart_computation()` --calls--> `BirthInputRequest`  [INFERRED]
  tests/test_api_integration.py → backend/app/main.py
- `test_suite_classical_astrological_engines()` --calls--> `test_six_culture_pipeline()`  [INFERRED]
  tests/test_engine_suite.py → backend/tests/test_engine.py
- `test_api_health_endpoint()` --calls--> `health_check()`  [INFERRED]
  tests/test_api_integration.py → backend/app/main.py
- `test_api_sample_charts_list()` --calls--> `get_sample_charts()`  [INFERRED]
  tests/test_api_integration.py → backend/app/main.py
- `test_deterministic_chart_computation()` --calls--> `compute_chart_endpoint()`  [INFERRED]
  tests/test_api_integration.py → backend/app/main.py

## Communities (42 total, 2 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.07
Nodes (40): BirthDataForm(), CATEGORIES, FEATURED_IDS, Props, DomainConsensusRadar(), InputAuditCard(), Props, MathematicalEvidenceCard() (+32 more)

### Community 1 - "Community 1"
Cohesion: 0.11
Nodes (26): check_classical_yogas(), check_gandanta(), compute_graha_drishti(), compute_graha_yuddha(), compute_jyotisha_chart(), compute_vimshottari_dasha(), get_dashamsha_sign(), get_dignity() (+18 more)

### Community 2 - "Community 2"
Cohesion: 0.08
Nodes (26): 1. Dual-Engine Astrometric Parity ($< 0.01^\circ$), 1. Run the Backend Automated Test Suite, 2. Nine Authentic World Astrological Traditions, 2. Start the Full-Stack Application (Single Command), 3. Cross-Tradition Triangulation & Consensus Matrix, 3. Decoupled Development Mode (Hot Reloading), 4. Ten Interactive SVG Observatory Wheels, API Endpoints (+18 more)

### Community 3 - "Community 3"
Cohesion: 0.08
Nodes (24): 1. `pyswisseph` Compilation Failure, 1. Repository Setup, 2. Environment Initialization, 2. Skyfield JPL Kernel Download Timeout, 3. Frontend CORS Errors, 3. Launch Development Daemons, Build & Run via Docker Compose, code:bash (# Clone the repository) (+16 more)

### Community 4 - "Community 4"
Cohesion: 0.12
Nodes (21): AlmutenBarProps, AlmutenDignityBarChart(), BaZiElementPentagram(), BaZiPentagramProps, EgyptianClockProps, EgyptianDecanStarClock(), MaramatakaDialProps, MaramatakaLunarDial() (+13 more)

### Community 5 - "Community 5"
Cohesion: 0.09
Nodes (22): 1. Executive Summary & The Definitive Verdict, 2.1 Statistical Test Scorecard, 2. Hypothesis Testing: Titans vs. Monte Carlo Controls, 3.1 The "Orbital Mechanics Trap" (Budhaditya Yoga), 3.2 The "Short Ascension" Celestial Geometry (Pisces Ascendants), 3.3 The Dusthana Lord Probability (Viparita Raja Yoga), 3. The Astronomical De-Biasing Analysis: Exposing Popular Myths, 4. Where the Genuine Mathematical Evidence Resides (+14 more)

### Community 6 - "Community 6"
Cohesion: 0.1
Nodes (19): 1. Astronomical Coordinate Form, 2. Cross-Cultural Corroboration Matrix, 3. Dual-Engine Verification Checklist, 4. Mathematical Evidence Dossier, Colors, Components, Design System, Do's (+11 more)

### Community 7 - "Community 7"
Cohesion: 0.12
Nodes (16): Brand & Style, Breakpoints & Reflow, Buttons & Epistemic Action Controls, Colors, Components, Consensus & Divergence Radial Meters, Elevation & Depth, Ephemeris Coordinate Tables with Uncertainty Bands (+8 more)

### Community 8 - "Community 8"
Cohesion: 0.12
Nodes (16): Brand & Style, Breakpoints & Reflow, Buttons & Epistemic Action Controls, Colors, Components, Consensus & Divergence Radial Meters, Elevation & Depth, Ephemeris Coordinate Tables with Uncertainty Bands (+8 more)

### Community 9 - "Community 9"
Cohesion: 0.14
Nodes (15): assert_no_critical_errors(), catalog_screenshots(), check_element_overlaps(), check_no_horizontal_overflow(), get_bounding_boxes(), helpers.py — Universal Playwright Visual Regression & UI Testing Engine Local ma, Saves a full viewport screenshot to the local machine directory.     Never uploa, Generates a zero-cloud local HTML gallery of all captured screenshots for local (+7 more)

### Community 10 - "Community 10"
Cohesion: 0.14
Nodes (10): BirthInputRequest, get_sample_charts(), health_check(), FastAPI application for Synodix Triangulation Engine. Exposes endpoints for inpu, BaseModel, Integration and regression tests for Synodix Triangulation Engine. Uses standard, Verify health endpoint returns healthy status and engine metadata., Verify sample charts can be retrieved and contain required fields. (+2 more)

### Community 11 - "Community 11"
Cohesion: 0.13
Nodes (14): 1. Western Tropical Astrology (`western.py`), 2. Jyotisha / Vedic Sidereal Astrology (`jyotisha.py`), 3. BaZi / Chinese Four Pillars of Destiny (`bazi.py`), 4. Zi Wei Dou Shu / Purple Star Astrology (`ziwei.py`), 5. Maya Calendar / Mesoamerican Count (`maya.py`), 6. Tibetan Phugpa Astrology (`tibetan.py`), 7. Hellenistic & Medieval Persian Astrology (`persian.py`), 8. Ancient Egyptian Decanic Astrology (`egyptian.py`) (+6 more)

### Community 12 - "Community 12"
Cohesion: 0.13
Nodes (14): 1. `POST /api/compute-chart`, 2. `GET /api/ephemeris-test`, 3. `GET /health`, code:mermaid (sequenceDiagram), code:json ({), code:json ({), code:json ({), 📡 Endpoints (+6 more)

### Community 13 - "Community 13"
Cohesion: 0.14
Nodes (13): 1. Swiss Ephemeris 2.10 (`pyswisseph`), 1. The 1.0° Boundary Orb, 1. Universal Time (UTC) and Delta-T ($\Delta T$), 2. Equation of Time ($EOT$), 2. Skyfield & NASA JPL DE421 Kernel, 2. Temporal Drift Sweeps ($\pm 15$ Minutes), 3. Local Sidereal Time ($LST$), Astrometric Dual-Engine (+5 more)

### Community 14 - "Community 14"
Cohesion: 0.15
Nodes (12): Accessibility & Inclusion, Brand Commitments, Capabilities and Constraints, Evidence on Hand, Operating Context, Platform, Positioning, Stack (+4 more)

### Community 15 - "Community 15"
Cohesion: 0.35
Nodes (10): angular_diff(), compute_antiscia(), compute_aspect_list(), compute_aspects(), compute_essential_dignity(), compute_mutual_receptions(), compute_western_chart(), get_bound_ruler() (+2 more)

### Community 16 - "Community 16"
Cohesion: 0.18
Nodes (10): 1. Client Observatory (`frontend/`), 2. Edge Gateway & Normalization (`backend/app/main.py`), 3. Astrometric Core (`backend/app/ephemeris.py`), 4. Nine Cultural Tradition Sub-Engines (`backend/app/traditions/`), 5. Synthesis & Consensus Matrix (`backend/app/synthesis/`), code:mermaid (graph TD), 🏛️ Interactive Diagram & Spec, 🔒 Layer Responsibilities & Boundaries (+2 more)

### Community 17 - "Community 17"
Cohesion: 0.18
Nodes (10): code:mermaid (flowchart LR), Data Pipelines & Ingestion Flow, 🌊 Interactive Dataflow Diagram & Spec, Stage 0: Telemetry Sources, Stage 1: Ingestion & Boundary Audit, Stage 2: Dual Astrometric Evaluation, Stage 3: Tradition Engines & Synthesis, Stage 4: Reactive Observatory Consumption (+2 more)

### Community 18 - "Community 18"
Cohesion: 0.22
Nodes (8): Regression suite bridge connecting classical astrological calculation engines an, Execute complete 6-tradition & 9-tradition deterministic calculation checks., Verify 10 and 100 historical personalities simulation benchmarks., test_suite_classical_astrological_engines(), test_suite_simulations_and_personalities(), Test suite validating the 10-personality simulation results against core biograp, test_100_personalities_dataset_integrity(), test_simulation_dataset_integrity()

### Community 19 - "Community 19"
Cohesion: 0.2
Nodes (9): 1. Hot Path States, 2. Invariant & Boundary Gates, 3. Sensitivity & Recovery Loop, 4. Terminal Exits, code:mermaid (stateDiagram-v2), 🧬 Interactive Lifecycle Diagram & Spec, 📋 State Definitions & Transition Criteria, State Lifecycle & Verification Machine (+1 more)

### Community 20 - "Community 20"
Cohesion: 0.2
Nodes (9): 1. Voting Weights, 2. Prominence Score Calculation, 3. Polarity Vector, code:mermaid (graph TD), Consensus Matrix & Triangulation Mathematics, 🗳️ The 3-Cluster Voting Algorithm, 🧭 The 9 Universal Life Domains, ⚡ The Divergence Metric ($\bar{d} \approx 31.8\%$) (+1 more)

### Community 21 - "Community 21"
Cohesion: 0.22
Nodes (6): build_verification_report(), Verification report generator and invariant auditor. Follows Step 5 of Six-Cultu, Standalone assert-based test suite verifying all 6 traditions, dual-engine ephem, test_six_culture_pipeline(), compute_tibetan_chart(), Tibetan Elemental Astrology (Jungtsi / འབྱུང་རྩིས) calculation module. Computes

### Community 22 - "Community 22"
Cohesion: 0.22
Nodes (8): 📂 Archify Interactive Diagram Artifacts, code:block1 (Frontend:), code:mermaid (graph TD), 📊 Core Architecture Overview, 🏛️ Core Principles, Synodix • Astrometric Triangulation Engine Wiki, 🛠️ Technology Stack, 🧭 Wiki Catalogue & Navigation

### Community 23 - "Community 23"
Cohesion: 0.43
Nodes (7): build_synthesis(), compute_temperament_axes(), evaluate_jyotisha_domain(), evaluate_sinic_domain(), evaluate_western_domain(), Cross-cultural synthesis without double-counting. Implements Step 7 and Step 8 o, synthesize_domain_grade()

### Community 24 - "Community 24"
Cohesion: 0.25
Nodes (7): 1. Mandatory Context Reading, 2. Minimal Tokens Protocol (MANDATORY), 3. Persistent Context Maintenance, 4. Regression Test Suite Rules, 5. UI Tooltips & Accessibility Invariants, 6. Packaging & Release Ship Rule, Project Agent Governance & Pipeline Rules

### Community 25 - "Community 25"
Cohesion: 0.38
Nodes (6): compute_ziwei_chart(), get_bureau(), get_ziwei_branch(), Zi Wei Dou Shu (Purple Star Astrology) deterministic calculation module. Compute, Calculates Five Elements Bureau (2..6), Finds Earthly Branch of Zi Wei star from Bureau and Lunar Day

### Community 26 - "Community 26"
Cohesion: 0.43
Nodes (6): compute_persian_chart(), get_decan_ruler(), get_sign_and_degree(), get_term_ruler(), Persian and Medieval Arabic Astrology (Ilm al-Nujūm / علم النجوم) calculation mo, Computes complete Persian/Arabic horoscopic calculations from astronomical basel

### Community 27 - "Community 27"
Cohesion: 0.43
Nodes (6): analyze_branch_interactions(), compute_bazi_chart(), compute_shen_sha(), get_ten_god(), BaZi (Four Pillars of Destiny) deterministic calculation module. Uses lunar_pyth, Calculates Ten God relationship of target_stem with respect to day_master

### Community 28 - "Community 28"
Cohesion: 0.33
Nodes (5): blank_page(), page_with_data(), conftest.py — Universal Playwright Test Suite Fixtures Provides shared, isolated, Launches headless Chromium, navigates to target local app,     and captures cons, Launches headless Chromium for testing uninitialized or first-run empty states.

### Community 29 - "Community 29"
Cohesion: 0.47
Nodes (5): compute_astronomical_base(), deg_to_sign_degree(), get_skyfield_objects(), Dual-engine astronomical calculation and independent verification module. Uses S, Convert longitude (0..360) to (sign_name, degree_in_sign, sign_index_0_based)

### Community 30 - "Community 30"
Cohesion: 0.33
Nodes (5): compute_chart_endpoint(), Verify end-to-end multi-cultural calculation pipeline with Steve Jobs birth data, test_deterministic_chart_computation(), compute_mayan_chart(), Maya Calendar deterministic calculation and round-trip verification module. Uses

### Community 31 - "Community 31"
Cohesion: 0.4
Nodes (5): calculate_solar_hours(), compute_egyptian_chart(), Ancient Egyptian Astronomy and Decanic Astrology (Hermetic & Temple Traditions)., Computes Egyptian Decanic & Chronocrator Horoscopy., Computes local temporal planetary hours (12 unequal day hours / 12 unequal night

### Community 32 - "Community 32"
Cohesion: 0.33
Nodes (5): 1. Current Status & Milestone, 2. Implemented Traditions & Engines, 3. Mathematical Verification & Simulation, 4. Autonomous Workflow & Pipeline Commands, Synodix: Project Context & Working Memory

### Community 33 - "Community 33"
Cohesion: 0.4
Nodes (4): code:json ({), Expanding the Oxlint configuration, React Compiler, React + TypeScript + Vite

### Community 34 - "Community 34"
Cohesion: 0.4
Nodes (4): code:bash (# Run all tests with compact 1-line token-efficient output), Running Tests, Synodix Test Suite & Verification Harness, Test Modules

### Community 35 - "Community 35"
Cohesion: 0.5
Nodes (3): responseToCache, STATIC_ASSETS, url

### Community 36 - "Community 36"
Cohesion: 0.5
Nodes (3): audit_input_endpoint(), normalize_birth_input(), Time normalization, boundary proximity audit, and time-uncertainty ensemble gene

### Community 37 - "Community 37"
Cohesion: 0.5
Nodes (3): compute_maramataka_chart(), Polynesian & Māori Maramataka (Oceanic Lunar Phase Calendar & Star Navigation)., Computes Polynesian Maramataka Lunar Phase Archetype.

## Knowledge Gaps
- **251 isolated node(s):** `config`, `STATIC_ASSETS`, `url`, `responseToCache`, `FALLBACK_PRESETS` (+246 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `compute_chart_endpoint()` connect `Community 30` to `Community 1`, `Community 36`, `Community 37`, `Community 10`, `Community 15`, `Community 21`, `Community 23`, `Community 25`, `Community 26`, `Community 27`, `Community 29`, `Community 31`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Why does `test_six_culture_pipeline()` connect `Community 21` to `Community 1`, `Community 36`, `Community 37`, `Community 15`, `Community 18`, `Community 23`, `Community 25`, `Community 26`, `Community 27`, `Community 29`, `Community 30`, `Community 31`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **Why does `compute_jyotisha_chart()` connect `Community 1` to `Community 21`, `Community 30`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **Are the 14 inferred relationships involving `compute_chart_endpoint()` (e.g. with `test_deterministic_chart_computation()` and `normalize_birth_input()`) actually correct?**
  _`compute_chart_endpoint()` has 14 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `compute_jyotisha_chart()` (e.g. with `compute_chart_endpoint()` and `test_six_culture_pipeline()`) actually correct?**
  _`compute_jyotisha_chart()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 14 inferred relationships involving `test_six_culture_pipeline()` (e.g. with `test_suite_classical_astrological_engines()` and `normalize_birth_input()`) actually correct?**
  _`test_six_culture_pipeline()` has 14 INFERRED edges - model-reasoned connections that need verification._
- **What connects `config`, `STATIC_ASSETS`, `url` to the rest of the system?**
  _251 weakly-connected nodes found - possible documentation gaps or missing edges._