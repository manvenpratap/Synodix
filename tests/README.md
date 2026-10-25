# Synodix Test Suite & Verification Harness

Autonomous regression and integration tests for the Synodix Astrometric Triangulation Engine.

## Running Tests

Execute via the minimal-token pipeline runner:

```bash
# Run all tests with compact 1-line token-efficient output
./pipeline.sh test --summary

# Run fast critical-path smoke tests only
./pipeline.sh test --smoke
```

## Test Modules

- `test_api_integration.py`: End-to-end integration tests for FastAPI endpoints (`/api/health`, `/api/sample-charts`, `/api/compute-chart`).
- `test_engine_suite.py`: Bridges the classical astrological calculation suites (`test_six_culture_pipeline`) and 10/100 personality benchmark datasets.
- `test_03_theme_toggle.py`: Validates Solar Day Light Theme and Deep Space Dark Theme toggling, localStorage persistence, and multi-screen visual integrity with zero console errors.
- `test_04_mobile_viewport.py`: Validates mobile viewport rendering (390x844), touch target dimensions (>= 44x44px), safe-area insets, mobile drawer and bottom navigation ergonomics, and zero horizontal scroll.
- `test_05_inapp_offline_engine.py`: Validates 100% offline standalone execution with simulated aborted network requests, instant bundled titan loading, and in-app pure TypeScript chart computation.
- `test_06_cultural_themes.py`: Validates authentic cultural immersion banners, palettes, and display presentation switchers across all 9 astrological traditions (Jyotisha, BaZi, Western, Zi Wei, Maya, Tibetan, Persian, Egyptian, Maramataka) with zero console errors.
- `test_07_geocoding_intelligence.py`: Validates real-time city auto-suggest dropdown, automatic geodetic latitude & longitude resolution, keyboard navigation, and manual coordinate override with zero console errors.
- `test_08_independent_input_experience.py`: Validates clean independent Custom Manual Input experience, complete isolation from 100 sample records, mode switching, and Titan data transfer with zero console errors.
- `test_09_dossier_inferences.py`: Validates Corroboration Dossier substantive inferences profile, explicit Subject vs Birthplace separation, Core Archetype spotlight, 5 civilizational foundation pillars, 3-column analytical triad, and mobile layout integrity.
- `test_10_impeccable_quality_audit.py`: Validates comprehensive typography floors (>=11px UI, >=12px narrative), zero tiny-text/undersized-ui-text anti-patterns across all 5 epistemic screens and 9 traditions, and zero critical console errors.
- `conftest.py`: Playwright & browser fixtures for local UI and headless browser regression checks.
- `helpers.py`: Bounding-box collision detection, viewport overflow assertions, and local screenshot catalog.

---
**Total Active Test Modules:** 10
