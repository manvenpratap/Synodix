"""
test_12_monte_carlo_500_rankings.py — Regression suite for 500 Titans Monte Carlo Benchmark & Tradition Rankings
Validates:
- Backend /api/sample-charts-500 endpoint delivers 500 certified historical titans (100% Rodden AA/A)
- Backend /api/mathematical-evidence returns dynamic 500 titans / 2,500 controls stats
- Tradition accuracy ranking deduction (#1 BaZi 64.6/100, #2 Jyotisha 60.9/100)
- Frontend MathematicalEvidenceCard rendering:
  - 500 Records / 2,500 Controls scorecard
  - Tab 2 (Tradition Accuracy Ranking) leaderboard and matrix
  - 4 Documented historical case studies (Churchill, Einstein, Ali, Jobs)
  - Zero critical console errors and zero horizontal layout overflow
"""

import os
import json
import urllib.request
from playwright.sync_api import sync_playwright

try:
    from tests.helpers import check_no_horizontal_overflow
except ImportError:
    from helpers import check_no_horizontal_overflow

MAC_CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
API_BASE = "http://127.0.0.1:8000"
FRONTEND_BASE = "http://127.0.0.1:5173"


def _http_get_json(url):
    req = urllib.request.Request(url, headers={"User-Agent": "SynodixTest/1.0"})
    with urllib.request.urlopen(req, timeout=10) as resp:
        assert resp.status == 200, f"Expected 200 from {url}, got {resp.status}"
        return json.loads(resp.read().decode("utf-8"))


def _launch_browser(pw):
    if os.path.exists(MAC_CHROME):
        return pw.chromium.launch(headless=True, executable_path=MAC_CHROME)
    return pw.chromium.launch(headless=True)


def test_api_500_titans_and_mathematical_evidence():
    """Verify backend endpoints for 500 titans and mathematical evidence dataset integrity."""
    # 1. Test /api/sample-charts-500
    titans_500 = _http_get_json(f"{API_BASE}/api/sample-charts-500")
    assert len(titans_500) == 500, f"Expected 500 titans, got {len(titans_500)}"

    # Verify 100% Rodden AA/A rating
    for t in titans_500:
        rating = t.get("rodden_rating")
        assert rating in ["AA", "A"], f"Titan {t.get('name')} must have Rodden AA or A rating, got {rating}"

    # 2. Test /api/sample-charts?cohort=500 parameter support
    titans_param = _http_get_json(f"{API_BASE}/api/sample-charts?cohort=500")
    assert len(titans_param) == 500

    # 3. Test /api/mathematical-evidence
    evidence = _http_get_json(f"{API_BASE}/api/mathematical-evidence")
    assert "stats" in evidence
    stats = evidence["stats"]

    assert stats.get("cohort_titans") == 500
    assert stats.get("cohort_controls") == 2500

    # Verify tradition rankings structure
    rankings = stats.get("tradition_rankings", [])
    assert len(rankings) == 6, f"Expected 6 tradition rankings, got {len(rankings)}"

    # Winner #1 BaZi, #2 Jyotisha
    assert "BaZi" in rankings[0]["tradition"]
    assert rankings[0]["composite_historical_accuracy_score"] >= 64.0
    assert "Jyotisha" in rankings[1]["tradition"]
    assert rankings[1]["composite_historical_accuracy_score"] >= 60.0

    # Scientific synthesis deduction
    synth = stats.get("scientific_synthesis", {})
    assert "BaZi" in synth.get("most_accurate_prediction_science", "")


def test_ui_mathematical_evidence_rankings_and_case_studies():
    """Verify frontend UI rendering for 500 titans benchmark, tradition rankings, and case studies."""
    with sync_playwright() as pw:
        browser = _launch_browser(pw)
        page = browser.new_page(viewport={"width": 1280, "height": 900})
        console_errors = []
        page.on("console", lambda m: console_errors.append(m.text) if m.type == "error" else None)
        page.on("pageerror", lambda e: console_errors.append(f"PAGE ERROR: {e}"))

        page.goto(FRONTEND_BASE, wait_until="domcontentloaded")
        page.wait_for_timeout(400)

        # 1. Navigate to Feature Guide / Evidence
        guide_btn = page.locator("button[data-tooltip*='feature explainer']").first
        if not guide_btn.is_visible():
            guide_btn = page.locator("button:has-text('Feature Guide')").first
        assert guide_btn.is_visible(), "Feature Guide button must be accessible"
        guide_btn.click()
        page.wait_for_timeout(400)

        # 2. Switch to Mathematical Evidence section
        evidence_tab_btn = page.locator("button[role='tab']:has-text('Mathematical Evidence')").first
        assert evidence_tab_btn.is_visible(), "Mathematical Evidence section tab must be visible"
        evidence_tab_btn.click()
        page.wait_for_timeout(400)

        # 3. Assert 500 Records / 2,500 Controls badges in KPI scorecard
        cohort_badge = page.locator("text='500 Records'").first
        assert cohort_badge.is_visible(), "500 Records Titan Cohort badge must be visible"
        control_badge = page.locator("text='2,500 Controls'").first
        assert control_badge.is_visible(), "2,500 Controls Baseline badge must be visible"

        # 4. Navigate to Tab 2: Tradition Accuracy Ranking
        rankings_tab = page.locator("button:has-text('2. Tradition Accuracy Ranking')").first
        assert rankings_tab.is_visible(), "Tab '2. Tradition Accuracy Ranking' must be visible"
        rankings_tab.click()
        page.wait_for_timeout(400)

        # 5. Verify Winner Hero Banner (#1 BaZi and #2 Jyotisha)
        bazi_winner = page.locator("text='#1 BaZi (Four Pillars)'").first
        assert bazi_winner.is_visible(), "#1 BaZi winner banner must be rendered"
        jyotisha_winner = page.locator("text='#2 Jyotisha (Vedic Sidereal)'").first
        assert jyotisha_winner.is_visible(), "#2 Jyotisha runner-up banner must be rendered"

        # 6. Verify 6-Tradition Leaderboard contains all systems
        traditions = [
            "BaZi (Four Pillars of Destiny)",
            "Jyotisha (Vedic Sidereal)",
            "Zi Wei Dou Shu (Purple Star Astrology)",
            "Mayan Tzolk'in (Mesoamerican Count)",
            "Western / Hellenistic (Tropical)",
            "Tibetan Phugpa (Elemental Lunisolar)"
        ]
        for trad in traditions:
            assert page.locator(f"text='{trad}' >> visible=true").first.is_visible(), f"Tradition '{trad}' must be visible in leaderboard"

        # 7. Verify Historical Case Studies
        case_studies = ["Winston Churchill", "Albert Einstein", "Muhammad Ali", "Steve Jobs"]
        for figure in case_studies:
            assert page.locator(f"text='{figure}'").first.is_visible(), f"Case study '{figure}' must be rendered"

        # 8. Check layout overflow and critical console errors
        assert check_no_horizontal_overflow(page), "Page must have zero horizontal overflow"
        critical_errors = [e for e in console_errors if "favicon" not in e and "404" not in e]
        assert len(critical_errors) == 0, f"Critical console errors detected: {critical_errors}"

        browser.close()
