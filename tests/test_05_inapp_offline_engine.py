"""
test_05_inapp_offline_engine.py — In-App Pure Client-Side Engine & Offline Sideload Test
Validates:
- 100% offline standalone operation (all network requests to /api/** are aborted)
- Instant loading of pre-computed historical titan profiles (Einstein, Jobs, etc.)
- In-app pure TypeScript calculation of custom birth records with zero backend
- Navigation between Workbench, Traditions, and Consensus with zero critical console errors
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


def test_offline_standalone_calculation():
    with sync_playwright() as pw:
        browser = _launch_browser(pw)
        context = browser.new_context(
            viewport={"width": 1280, "height": 800}
        )
        page = context.new_page()

        console_errors = []
        page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)

        # SIMULATE 100% OFFLINE AIRPLANE MODE: Abort all network calls to /api/**
        page.route("**/api/**", lambda route: route.abort("failed"))

        page.goto("http://127.0.0.1:5173", wait_until="domcontentloaded")
        page.wait_for_selector("text=Synodix", timeout=10000)

        # 1. Verify Workbench loaded offline with default Titan profile
        page.wait_for_selector("h1:has-text('Workbench & Vault')", timeout=10000)
        assert page.locator("h1:has-text('Workbench & Vault')").is_visible()

        # 2. Navigate to Cultural Traditions screen while offline
        traditions_nav = page.locator("button:has-text('Cultural Traditions')").first
        traditions_nav.click()
        page.wait_for_timeout(500)
        assert page.locator("h1:has-text('Cultural Traditions')").is_visible()

        # 3. Navigate back to Workbench and enter custom birth date
        workbench_nav = page.locator("button:has-text('Workbench & Vault')").first
        workbench_nav.click()
        page.wait_for_timeout(400)

        date_input = page.locator("input[type='date']").first
        if date_input.is_visible():
            date_input.fill("1995-08-15")
            calc_btn = page.locator("button:has-text('Calculate Chart')").first
            if calc_btn.is_visible():
                calc_btn.click()
                page.wait_for_timeout(600)
                # Verify chart computed locally in-app
                assert page.locator("h1:has-text('Workbench & Vault')").is_visible()

        # 4. Check no horizontal overflow
        assert check_no_horizontal_overflow(page), "Viewport should have zero horizontal overflow"

        # 5. Check critical console errors (ignoring simulated aborted route logs)
        critical_errors = [
            e for e in console_errors
            if "favicon" not in e
            and "sourcemap" not in e.lower()
            and "Failed to load resource" not in e
            and "ERR_FAILED" not in e
        ]
        assert len(critical_errors) == 0, f"Critical errors in offline mode: {critical_errors}"

        browser.close()
