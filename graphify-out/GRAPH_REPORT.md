# Graph Report - Astrology  (2026-10-22)

## Corpus Check
- 93 files · ~1,466,498 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2862 nodes · 12169 edges · 105 communities (99 shown, 6 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 37 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `25e3d5d1`
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
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 50|Community 50]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 53|Community 53]]
- [[_COMMUNITY_Community 54|Community 54]]
- [[_COMMUNITY_Community 55|Community 55]]
- [[_COMMUNITY_Community 56|Community 56]]
- [[_COMMUNITY_Community 57|Community 57]]
- [[_COMMUNITY_Community 58|Community 58]]
- [[_COMMUNITY_Community 59|Community 59]]
- [[_COMMUNITY_Community 60|Community 60]]
- [[_COMMUNITY_Community 61|Community 61]]
- [[_COMMUNITY_Community 62|Community 62]]
- [[_COMMUNITY_Community 63|Community 63]]
- [[_COMMUNITY_Community 64|Community 64]]
- [[_COMMUNITY_Community 65|Community 65]]
- [[_COMMUNITY_Community 66|Community 66]]
- [[_COMMUNITY_Community 67|Community 67]]
- [[_COMMUNITY_Community 68|Community 68]]
- [[_COMMUNITY_Community 69|Community 69]]
- [[_COMMUNITY_Community 70|Community 70]]
- [[_COMMUNITY_Community 71|Community 71]]
- [[_COMMUNITY_Community 72|Community 72]]
- [[_COMMUNITY_Community 73|Community 73]]
- [[_COMMUNITY_Community 74|Community 74]]
- [[_COMMUNITY_Community 75|Community 75]]
- [[_COMMUNITY_Community 76|Community 76]]
- [[_COMMUNITY_Community 77|Community 77]]
- [[_COMMUNITY_Community 78|Community 78]]
- [[_COMMUNITY_Community 79|Community 79]]
- [[_COMMUNITY_Community 80|Community 80]]
- [[_COMMUNITY_Community 81|Community 81]]
- [[_COMMUNITY_Community 82|Community 82]]
- [[_COMMUNITY_Community 83|Community 83]]
- [[_COMMUNITY_Community 84|Community 84]]
- [[_COMMUNITY_Community 85|Community 85]]
- [[_COMMUNITY_Community 86|Community 86]]

## God Nodes (most connected - your core abstractions)
1. `i()` - 74 edges
2. `i()` - 74 edges
3. `i()` - 74 edges
4. `i()` - 67 edges
5. `i()` - 67 edges
6. `ml()` - 54 edges
7. `ml()` - 54 edges
8. `ml()` - 54 edges
9. `hl()` - 52 edges
10. `hl()` - 52 edges

## Surprising Connections (you probably didn't know these)
- `test_suite_classical_astrological_engines()` --calls--> `test_six_culture_pipeline()`  [INFERRED]
  tests/test_engine_suite.py → backend/tests/test_engine.py
- `test_api_health_endpoint()` --calls--> `health_check()`  [INFERRED]
  tests/test_api_integration.py → backend/app/main.py
- `test_api_sample_charts_list()` --calls--> `get_sample_charts()`  [INFERRED]
  tests/test_api_integration.py → backend/app/main.py
- `test_deterministic_chart_computation()` --calls--> `BirthInputRequest`  [INFERRED]
  tests/test_api_integration.py → backend/app/main.py
- `test_deterministic_chart_computation()` --calls--> `compute_chart_endpoint()`  [INFERRED]
  tests/test_api_integration.py → backend/app/main.py

## Communities (105 total, 6 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.04
Nodes (152): [a,o], addListener(), addWindowListener(), af(), ah(), Ar(), At(), Bd() (+144 more)

### Community 1 - "Community 1"
Cohesion: 0.05
Nodes (113): [a,o], addListener(), addWindowListener(), ah(), ap(), b(), bh(), Bn() (+105 more)

### Community 2 - "Community 2"
Cohesion: 0.07
Nodes (94): a(), Acceleration(), add(), AddDays(), ah(), Ai(), an(), ap() (+86 more)

### Community 3 - "Community 3"
Cohesion: 0.04
Nodes (90): [a,o], addListener(), addWindowListener(), b(), Bp(), bs(), Ce(), ch() (+82 more)

### Community 4 - "Community 4"
Cohesion: 0.07
Nodes (87): ac(), al(), ao(), as(), bc(), bo(), Ca(), cc() (+79 more)

### Community 5 - "Community 5"
Cohesion: 0.05
Nodes (85): _(), [a,o], af(), an(), b(), Bi(), bn(), cc() (+77 more)

### Community 6 - "Community 6"
Cohesion: 0.07
Nodes (84): [a,o], Acceleration(), add(), AddDays(), Ai(), an(), Ar(), Bn() (+76 more)

### Community 7 - "Community 7"
Cohesion: 0.07
Nodes (82): ac(), al(), ao(), bc(), bi(), bo(), Ca(), cc() (+74 more)

### Community 8 - "Community 8"
Cohesion: 0.07
Nodes (80): ac(), al(), as(), bo(), Ca(), cc(), co(), da() (+72 more)

### Community 9 - "Community 9"
Cohesion: 0.07
Nodes (73): a(), ao(), b(), bc(), bs(), C(), cm(), cs() (+65 more)

### Community 10 - "Community 10"
Cohesion: 0.07
Nodes (68): Acceleration(), add(), Ai(), an(), Ar(), br(), ci(), constructor() (+60 more)

### Community 11 - "Community 11"
Cohesion: 0.08
Nodes (66): ah(), ap(), bh(), Bp(), bt(), cf(), ch(), ci() (+58 more)

### Community 12 - "Community 12"
Cohesion: 0.05
Nodes (62): addListener(), addWindowListener(), ah(), ap(), Bp(), Ce(), ch(), clearAllCookies() (+54 more)

### Community 13 - "Community 13"
Cohesion: 0.09
Nodes (63): aa(), ba(), Bc(), Bi(), bo(), co(), d(), Da() (+55 more)

### Community 14 - "Community 14"
Cohesion: 0.08
Nodes (63): al(), ao(), au(), bl(), bu(), Du(), Ea(), ei() (+55 more)

### Community 15 - "Community 15"
Cohesion: 0.09
Nodes (52): af(), Bd(), bh(), cf(), Ct(), df(), dt(), ef() (+44 more)

### Community 16 - "Community 16"
Cohesion: 0.09
Nodes (48): af(), Bd(), cf(), cm(), Ct(), df(), dt(), Fd() (+40 more)

### Community 17 - "Community 17"
Cohesion: 0.1
Nodes (45): ae(), ba(), bl(), C(), D(), ee(), ef(), F() (+37 more)

### Community 18 - "Community 18"
Cohesion: 0.09
Nodes (44): ae(), as(), b(), bs(), ds(), ec(), Es(), fs() (+36 more)

### Community 19 - "Community 19"
Cohesion: 0.12
Nodes (43): _(), am(), bm(), bt(), delete(), dm(), fm(), fp() (+35 more)

### Community 20 - "Community 20"
Cohesion: 0.1
Nodes (43): a(), ae(), as(), bs(), c(), ce(), cm(), ds() (+35 more)

### Community 21 - "Community 21"
Cohesion: 0.11
Nodes (42): AddDays(), ae(), au(), ba(), bl(), delete(), ep(), FromTerrestrialTime() (+34 more)

### Community 22 - "Community 22"
Cohesion: 0.1
Nodes (42): _(), an(), bn(), ca(), cl(), cn(), dn(), en() (+34 more)

### Community 23 - "Community 23"
Cohesion: 0.14
Nodes (41): ao(), au(), bu(), Di(), dl(), Du(), el(), eu() (+33 more)

### Community 24 - "Community 24"
Cohesion: 0.1
Nodes (40): ac(), Bd(), Co(), d(), dc(), ef(), eo(), fc() (+32 more)

### Community 25 - "Community 25"
Cohesion: 0.15
Nodes (38): _(), am(), bm(), bt(), dm(), fm(), fp(), get() (+30 more)

### Community 26 - "Community 26"
Cohesion: 0.15
Nodes (36): bu(), cl(), Cp(), Cu(), eo(), eu(), gm(), gu() (+28 more)

### Community 27 - "Community 27"
Cohesion: 0.07
Nodes (35): 1. Android Sideloading (APK), 1. `pyswisseph` Compilation Failure, 1. Repository Setup, 2. Environment Initialization, 2. iOS Sideloading, 2. Skyfield JPL Kernel Download Timeout, 3. Connecting Mobile to Backend, 3. Frontend CORS Errors (+27 more)

### Community 28 - "Community 28"
Cohesion: 0.12
Nodes (36): af(), Bd(), cf(), cm(), Ct(), df(), dt(), ef() (+28 more)

### Community 29 - "Community 29"
Cohesion: 0.16
Nodes (35): am(), bm(), dm(), dn(), em(), en(), fm(), fp() (+27 more)

### Community 30 - "Community 30"
Cohesion: 0.18
Nodes (34): a(), am(), bm(), bt(), dm(), fm(), fp(), get() (+26 more)

### Community 31 - "Community 31"
Cohesion: 0.09
Nodes (32): check_classical_yogas(), check_gandanta(), compute_ashtakavarga(), compute_chara_karakas(), compute_graha_drishti(), compute_graha_yuddha(), compute_jyotisha_chart(), compute_vimshottari_dasha() (+24 more)

### Community 32 - "Community 32"
Cohesion: 0.14
Nodes (33): Aa(), Bc(), ca(), cs(), ec(), fl(), Hi(), hl() (+25 more)

### Community 33 - "Community 33"
Cohesion: 0.12
Nodes (29): AstronomicalBase, computeAstronomicalBase(), computeTimeAudit(), PlanetPosition, ZODIAC_SIGNS, calculateChartLocally(), computeSynthesis(), BRANCHES (+21 more)

### Community 34 - "Community 34"
Cohesion: 0.13
Nodes (32): _(), a(), C(), D(), E(), ee(), F(), fh() (+24 more)

### Community 35 - "Community 35"
Cohesion: 0.2
Nodes (30): am(), bm(), bt(), dm(), fm(), fp(), get(), hm() (+22 more)

### Community 36 - "Community 36"
Cohesion: 0.08
Nodes (25): assert_no_critical_errors(), catalog_screenshots(), check_element_overlaps(), check_no_horizontal_overflow(), get_bounding_boxes(), helpers.py — Universal Playwright Visual Regression & UI Testing Engine Local ma, Saves a full viewport screenshot to the local machine directory.     Never uploa, Generates a zero-cloud local HTML gallery of all captured screenshots for local (+17 more)

### Community 37 - "Community 37"
Cohesion: 0.13
Nodes (29): as(), bs(), cs(), ds(), es(), fs(), gs(), hs() (+21 more)

### Community 38 - "Community 38"
Cohesion: 0.15
Nodes (29): al(), bl(), Bo(), Da(), fe(), Fo(), gc(), go() (+21 more)

### Community 39 - "Community 39"
Cohesion: 0.2
Nodes (28): bu(), cl(), Cu(), eo(), eu(), gm(), hu(), jl() (+20 more)

### Community 40 - "Community 40"
Cohesion: 0.08
Nodes (26): 1. Dual-Engine Astrometric Parity ($< 0.01^\circ$), 1. Run the Backend Automated Test Suite, 2. Nine Authentic World Astrological Traditions, 2. Start the Full-Stack Application (Single Command), 3. Cross-Tradition Triangulation & Consensus Matrix, 3. Decoupled Development Mode (Hot Reloading), 4. Ten Interactive SVG Observatory Wheels, API Endpoints (+18 more)

### Community 41 - "Community 41"
Cohesion: 0.12
Nodes (17): InputAuditCard(), Props, MathematicalEvidenceCard(), Props, Props, ReadingView(), getBundledTitanChart(), EVIDENCE_STATS (+9 more)

### Community 42 - "Community 42"
Cohesion: 0.15
Nodes (26): au(), bi(), delete(), Di(), Fu(), Gi(), gl(), gu() (+18 more)

### Community 43 - "Community 43"
Cohesion: 0.19
Nodes (26): bu(), cl(), Cp(), Cu(), eu(), hh(), hu(), ku() (+18 more)

### Community 44 - "Community 44"
Cohesion: 0.09
Nodes (25): 1. `POST /api/compute-chart`, 2. `GET /api/ephemeris-test`, 2. `GET /api/health`, 2. `POST /api/audit-input`, 3. `GET /api/health`, 3. `GET /health`, 4. `GET /api/sample-charts`, 5. `GET /api/mathematical-evidence` (+17 more)

### Community 45 - "Community 45"
Cohesion: 0.09
Nodes (23): 1. Client Observatory (`frontend/`), 🏛️ 1. System Architecture, 2. Edge Gateway & Normalization (`backend/app/main.py`), 🔄 2. Multi-Tradition Calculation Workflow, ⚡ 3. Astrometric Computation & Verification Sequence, 3. Astrometric Core (`backend/app/ephemeris.py`), 🌊 4. Invariant Data Flow Pipeline, 4. Nine Cultural Tradition Sub-Engines (`backend/app/traditions/`) (+15 more)

### Community 46 - "Community 46"
Cohesion: 0.12
Nodes (21): AlmutenBarProps, AlmutenDignityBarChart(), BaZiElementPentagram(), BaZiPentagramProps, EgyptianClockProps, EgyptianDecanStarClock(), MaramatakaDialProps, MaramatakaLunarDial() (+13 more)

### Community 47 - "Community 47"
Cohesion: 0.09
Nodes (22): 1. Executive Summary & The Definitive Verdict, 2.1 Statistical Test Scorecard, 2. Hypothesis Testing: Titans vs. Monte Carlo Controls, 3.1 The "Orbital Mechanics Trap" (Budhaditya Yoga), 3.2 The "Short Ascension" Celestial Geometry (Pisces Ascendants), 3.3 The Dusthana Lord Probability (Viparita Raja Yoga), 3. The Astronomical De-Biasing Analysis: Exposing Popular Myths, 4. Where the Genuine Mathematical Evidence Resides (+14 more)

### Community 48 - "Community 48"
Cohesion: 0.11
Nodes (16): audit_input_endpoint(), BirthInputRequest, compute_chart_endpoint(), get_sample_charts(), health_check(), FastAPI application for Synodix Triangulation Engine. Exposes endpoints for inpu, BaseModel, normalize_birth_input() (+8 more)

### Community 49 - "Community 49"
Cohesion: 0.14
Nodes (21): ac(), ap(), c(), ce(), cm(), dp(), g(), h() (+13 more)

### Community 50 - "Community 50"
Cohesion: 0.1
Nodes (19): 1. Astronomical Coordinate Form, 2. Cross-Cultural Corroboration Matrix, 3. Dual-Engine Verification Checklist, 4. Mathematical Evidence Dossier, Colors, Components, Design System, Do's (+11 more)

### Community 51 - "Community 51"
Cohesion: 0.24
Nodes (20): ba(), cl(), Ea(), ep(), ga(), gl(), ha(), ie() (+12 more)

### Community 52 - "Community 52"
Cohesion: 0.23
Nodes (19): ae(), ba(), bl(), dh(), ep(), hl(), jo(), ma() (+11 more)

### Community 53 - "Community 53"
Cohesion: 0.12
Nodes (17): code:mermaid (flowchart LR), Data Pipelines & Ingestion Flow, 🔄 Detailed Pipeline Stages, 🌊 Interactive Dataflow Diagram & Spec, 🌊 Invariant Data Flow Pipeline, Stage 0: Telemetry Ingest & Validation, Stage 0: Telemetry Sources, Stage 1: Ingestion & Boundary Audit (+9 more)

### Community 54 - "Community 54"
Cohesion: 0.2
Nodes (17): au(), bi(), em(), Fu(), Gi(), Hi(), iu(), kl() (+9 more)

### Community 55 - "Community 55"
Cohesion: 0.16
Nodes (13): DomainConsensusRadar(), Props, SynthesisMatrix(), Props, VerificationCard(), Chronology, DomainEvaluation, DomainSynthesis (+5 more)

### Community 56 - "Community 56"
Cohesion: 0.12
Nodes (16): 1. Western Tropical Astrology (`western.py`), 2. Jyotisha / Vedic Sidereal Astrology (`jyotisha.py`), 3. BaZi / Chinese Four Pillars of Destiny (`bazi.py`), 4. Zi Wei Dou Shu / Purple Star Astrology (`ziwei.py`), 5. Maya Calendar / Mesoamerican Count (`maya.py`), 6. Tibetan Phugpa Astrology (`tibetan.py`), 7. Hellenistic & Medieval Persian Astrology (`persian.py`), 8. Ancient Egyptian Decanic Astrology (`egyptian.py`) (+8 more)

### Community 57 - "Community 57"
Cohesion: 0.12
Nodes (16): Brand & Style, Breakpoints & Reflow, Buttons & Epistemic Action Controls, Colors, Components, Consensus & Divergence Radial Meters, Elevation & Depth, Ephemeris Coordinate Tables with Uncertainty Bands (+8 more)

### Community 58 - "Community 58"
Cohesion: 0.12
Nodes (16): Brand & Style, Breakpoints & Reflow, Buttons & Epistemic Action Controls, Colors, Components, Consensus & Divergence Radial Meters, Elevation & Depth, Ephemeris Coordinate Tables with Uncertainty Bands (+8 more)

### Community 59 - "Community 59"
Cohesion: 0.23
Nodes (14): BirthDataForm(), CATEGORIES, FEATURED_IDS, Props, Preset, deleteProfile(), exportVaultAsJSON(), getPrimaryProfile() (+6 more)

### Community 60 - "Community 60"
Cohesion: 0.12
Nodes (11): build_verification_report(), Verification report generator and invariant auditor. Follows Step 5 of Six-Cultu, Standalone assert-based test suite verifying all 6 traditions, dual-engine ephem, test_six_culture_pipeline(), compute_maramataka_chart(), Polynesian & Māori Maramataka (Oceanic Lunar Phase Calendar & Star Navigation)., Computes Polynesian Maramataka Lunar Phase Archetype., compute_mayan_chart() (+3 more)

### Community 61 - "Community 61"
Cohesion: 0.14
Nodes (5): AppDelegate, SceneDelegate, UIApplicationDelegate, UIResponder, UIWindowSceneDelegate

### Community 62 - "Community 62"
Cohesion: 0.14
Nodes (13): 1. Swiss Ephemeris 2.10 (`pyswisseph`), 1. The 1.0° Boundary Orb, 1. Universal Time (UTC) and Delta-T ($\Delta T$), 2. Equation of Time ($EOT$), 2. Skyfield & NASA JPL DE421 Kernel, 2. Temporal Drift Sweeps ($\pm 15$ Minutes), 3. Local Sidereal Time ($LST$), Astrometric Dual-Engine (+5 more)

### Community 63 - "Community 63"
Cohesion: 0.28
Nodes (12): angular_diff(), compute_active_transits(), compute_antiscia(), compute_aspect_list(), compute_aspects(), compute_essential_dignity(), compute_mutual_receptions(), compute_western_chart() (+4 more)

### Community 64 - "Community 64"
Cohesion: 0.15
Nodes (12): Accessibility & Inclusion, Brand Commitments, Capabilities and Constraints, Evidence on Hand, Operating Context, Platform, Positioning, Stack (+4 more)

### Community 65 - "Community 65"
Cohesion: 0.26
Nodes (11): analyze_branch_interactions(), compute_bazi_chart(), compute_liu_nian(), compute_shen_sha(), compute_yong_shen(), get_ten_god(), BaZi (Four Pillars of Destiny) deterministic calculation module. Uses lunar_pyth, Calculates Ten God relationship of target_stem with respect to day_master (+3 more)

### Community 66 - "Community 66"
Cohesion: 0.18
Nodes (11): 1. Hot Path States, 2. Invariant & Boundary Gates, 3. Sensitivity & Recovery Loop, 4. Terminal Exits, ⏱️ Astrometric Calculation & Invariant State Lifecycle, code:mermaid (stateDiagram-v2), 🧬 Interactive Lifecycle Diagram & Spec, Lifecycle State Machine Transitions (+3 more)

### Community 67 - "Community 67"
Cohesion: 0.24
Nodes (10): compute_ziwei_chart(), get_bureau(), get_star_radiance(), get_ziwei_branch(), Zi Wei Dou Shu (Purple Star Astrology) deterministic calculation module. Compute, Calculates Five Elements Bureau (2..6), Finds Earthly Branch of Zi Wei star from Bureau and Lunar Day, Returns brightness tier: 庙 (Miao), 旺 (Wang), 得 (De), 利 (Li), 平 (Ping), 陷 (Xian) (+2 more)

### Community 68 - "Community 68"
Cohesion: 0.22
Nodes (8): Regression suite bridge connecting classical astrological calculation engines an, Execute complete 6-tradition & 9-tradition deterministic calculation checks., Verify 10 and 100 historical personalities simulation benchmarks., test_suite_classical_astrological_engines(), test_suite_simulations_and_personalities(), Test suite validating the 10-personality simulation results against core biograp, test_100_personalities_dataset_integrity(), test_simulation_dataset_integrity()

### Community 69 - "Community 69"
Cohesion: 0.33
Nodes (9): build_synthesis(), compute_chronocrator_timeline(), compute_temperament_axes(), evaluate_jyotisha_domain(), evaluate_sinic_domain(), evaluate_western_domain(), Cross-cultural synthesis without double-counting. Implements Step 7 and Step 8 o, Unifies multi-tradition predictive chronocrators into an aligned timeline for a (+1 more)

### Community 70 - "Community 70"
Cohesion: 0.2
Nodes (9): 📂 Archify Interactive Diagram Artifacts, code:block1 (Frontend:), code:mermaid (graph TD), 🏛️ Comprehensive Architecture & Embedded Diagrams, 📊 Core Architecture Overview, 🏛️ Core Principles, Synodix • Astrometric Triangulation Engine Wiki, 🛠️ Technology Stack (+1 more)

### Community 71 - "Community 71"
Cohesion: 0.2
Nodes (9): 1. Voting Weights, 2. Prominence Score Calculation, 3. Polarity Vector, code:mermaid (graph TD), Consensus Matrix & Triangulation Mathematics, 🗳️ The 3-Cluster Voting Algorithm, 🧭 The 9 Universal Life Domains, ⚡ The Divergence Metric ($\bar{d} \approx 31.8\%$) (+1 more)

### Community 72 - "Community 72"
Cohesion: 0.28
Nodes (8): blank_page(), _get_launch_args(), page_with_data(), conftest.py — Universal Playwright Test Suite Fixtures Provides shared, isolated, Launches headless Chromium, navigates to target local app,     and captures cons, Launches headless Chromium, navigates to target local app,     and captures cons, Launches headless Chromium for testing uninitialized or first-run empty states., Launches headless Chromium for testing uninitialized or first-run empty states.

### Community 73 - "Community 73"
Cohesion: 0.25
Nodes (7): 1. Mandatory Context Reading, 2. Minimal Tokens Protocol (MANDATORY), 3. Persistent Context Maintenance, 4. Regression Test Suite Rules, 5. UI Tooltips & Accessibility Invariants, 6. Packaging & Release Ship Rule, Project Agent Governance & Pipeline Rules

### Community 74 - "Community 74"
Cohesion: 0.38
Nodes (6): compute_astronomical_base(), deg_to_sign_degree(), get_skyfield_objects(), Dual-engine astronomical calculation and independent verification module. Uses S, Convert longitude (0..360) to (sign_name, degree_in_sign, sign_index_0_based), Convert longitude (0..360) to (sign_name, degree_in_sign, sign_index_0_based)

### Community 75 - "Community 75"
Cohesion: 0.43
Nodes (6): compute_persian_chart(), get_decan_ruler(), get_sign_and_degree(), get_term_ruler(), Persian and Medieval Arabic Astrology (Ilm al-Nujūm / علم النجوم) calculation mo, Computes complete Persian/Arabic horoscopic calculations from astronomical basel

### Community 76 - "Community 76"
Cohesion: 0.6
Nodes (3): responseToCache, STATIC_ASSETS, url

### Community 77 - "Community 77"
Cohesion: 0.4
Nodes (5): calculate_solar_hours(), compute_egyptian_chart(), Ancient Egyptian Astronomy and Decanic Astrology (Hermetic & Temple Traditions)., Computes Egyptian Decanic & Chronocrator Horoscopy., Computes local temporal planetary hours (12 unequal day hours / 12 unequal night

### Community 78 - "Community 78"
Cohesion: 0.33
Nodes (5): 1. Current Status & Milestone, 2. Implemented Traditions & Engines, 3. Mathematical Verification & Simulation, 4. Autonomous Workflow & Pipeline Commands, Synodix: Project Context & Working Memory

### Community 79 - "Community 79"
Cohesion: 0.4
Nodes (4): code:json ({), Expanding the Oxlint configuration, React Compiler, React + TypeScript + Vite

### Community 80 - "Community 80"
Cohesion: 0.4
Nodes (4): code:bash (# Run all tests with compact 1-line token-efficient output), Running Tests, Synodix Test Suite & Verification Harness, Test Modules

## Knowledge Gaps
- **296 isolated node(s):** `config`, `FALLBACK_PRESETS`, `AppScreen`, `NavItem`, `NAV_ITEMS` (+291 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `compute_chart_endpoint()` connect `Community 48` to `Community 65`, `Community 67`, `Community 69`, `Community 74`, `Community 75`, `Community 77`, `Community 60`, `Community 31`, `Community 63`?**
  _High betweenness centrality (0.001) - this node is a cross-community bridge._
- **Why does `test_six_culture_pipeline()` connect `Community 60` to `Community 65`, `Community 67`, `Community 68`, `Community 69`, `Community 74`, `Community 75`, `Community 77`, `Community 48`, `Community 63`, `Community 31`?**
  _High betweenness centrality (0.001) - this node is a cross-community bridge._
- **Why does `compute_jyotisha_chart()` connect `Community 31` to `Community 48`, `Community 60`?**
  _High betweenness centrality (0.001) - this node is a cross-community bridge._
- **What connects `config`, `FALLBACK_PRESETS`, `AppScreen` to the rest of the system?**
  _296 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.04 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.07 - nodes in this community are weakly interconnected._