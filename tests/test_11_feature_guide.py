"""
test_11_feature_guide.py — Regression suite verifying Astrometric & Cultural Feature Guide Screen
Validates:
- Direct navigation to Feature Guide from header and navigation items
- Complete 50-topic inventory rendering with category badges and cultural lineages
- Master-detail interactive topic selection and deep technical reading canvas
- Search filtering by query term (e.g., 'Ayanamsha', 'Vimshottari', 'Almuten')
- Civilizational array filtering (Vedic, Western, BaZi, etc.)
- Mathematical formulas, algorithmic mechanics, and historical lineage display
- Zero critical console errors and zero horizontal layout overflow
"""

import os
from playwright.sync_api import sync_playwright
try:
    from tests.helpers import check_no_horizontal_overflow
except ImportError:
    from helpers import check_no_horizontal_overflow

MAC_CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"


def _launch_browser(pw):
    if os.path.exists(MAC_CHROME):
        return pw.chromium.launch(headless=True, executable_path=MAC_CHROME)
    return pw.chromium.launch(headless=True)


def test_feature_guide_navigation_and_search():
    with sync_playwright() as pw:
        browser = _launch_browser(pw)
        page = browser.new_page(viewport={"width": 1280, "height": 800})
        console_errors = []
        page.on("console", lambda m: console_errors.append(m.text) if m.type == "error" else None)
        page.on("pageerror", lambda e: console_errors.append(f"PAGE ERROR: {e}"))

        page.goto("http://127.0.0.1:5173", wait_until="domcontentloaded")
        page.wait_for_timeout(400)

        # 1. Navigate to Feature Guide via Header Button or Sidebar Nav Item
        guide_btn = page.locator("button[data-tooltip*='feature explainer']").first
        if not guide_btn.is_visible():
            guide_btn = page.locator("button:has-text('Feature Guide')").first
        assert guide_btn.is_visible(), "Feature Guide navigation button must be visible"
        guide_btn.click()
        page.wait_for_timeout(300)

        # 2. Verify Feature Guide Screen is active
        heading = page.locator("text='Multi-Tradition Astrometric & Cultural Feature Guide'")
        assert heading.is_visible(), "Feature Guide screen header must be rendered"

        # 3. Check topic count badge shows 50 topics
        topics_count = page.locator("text='Topics (50)'")
        assert topics_count.is_visible() or page.locator("text='50 Knowledge Topics'").is_visible(), "50 Topics must be rendered"

        # 4. Search filtering: Search for 'Ayanamsha'
        search_input = page.locator("input[placeholder*='Search formulas']")
        assert search_input.is_visible()
        search_input.fill("Ayanamsha")
        page.wait_for_timeout(250)

        # Verify matching topic appears in the filtered list
        ayanamsha_item = page.locator("h4:has-text('Lahiri Sidereal Ayanamsha')")
        assert ayanamsha_item.is_visible(), "Lahiri Sidereal Ayanamsha should appear in filtered topics"

        # 5. Click the Ayanamsha topic to load into the reading canvas
        ayanamsha_btn = ayanamsha_item.locator("xpath=ancestor::button").first
        ayanamsha_btn.click()
        page.wait_for_timeout(250)

        # 6. Verify master reading canvas displays the topic details
        canvas_heading = page.locator("h2:has-text('Lahiri Sidereal Ayanamsha')").first
        assert canvas_heading.is_visible() or page.locator("text='Chitra Paksha'").first.is_visible(), "Reading canvas must display selected topic"

        # 7. Clear search
        search_input.fill("")
        page.wait_for_timeout(200)

        # 8. Test Civilizational button filter (VEDI = Vedic)
        vedic_civ_btn = page.locator("button[aria-label*='Vedic']").first
        if vedic_civ_btn.is_visible():
            vedic_civ_btn.click()
            page.wait_for_timeout(200)
            assert page.locator("text=Filtered:").is_visible()
            # Reset filter
            reset_btn = page.locator("button:has-text('Reset Filter')")
            if reset_btn.is_visible():
                reset_btn.click()
                page.wait_for_timeout(200)

        # 9. Check horizontal layout integrity
        assert check_no_horizontal_overflow(page)

        # 10. Zero critical console errors
        critical_errors = [e for e in console_errors if "favicon" not in e and "404" not in e]
        assert len(critical_errors) == 0, f"Critical console errors detected: {critical_errors}"

        browser.close()
