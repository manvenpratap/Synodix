"""
test_03_theme_toggle.py — Regression suite verifying Solar Day Light Theme & Deep Space Dark Theme
Validates:
- Persistent theme toggle between dark and light modes
- LocalStorage state persistence across page reloads
- Multi-screen rendering integrity in light mode
- Zero critical console errors
"""

import os
from pathlib import Path
from playwright.sync_api import sync_playwright
from tests.helpers import check_no_horizontal_overflow

MAC_CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"


def _launch_browser(pw):
    if os.path.exists(MAC_CHROME):
        return pw.chromium.launch(headless=True, executable_path=MAC_CHROME)
    return pw.chromium.launch(headless=True)


def test_theme_toggle_persistence():
    with sync_playwright() as pw:
        browser = _launch_browser(pw)
        page = browser.new_page(viewport={"width": 1280, "height": 800})
        console_errors = []
        page.on("console", lambda m: console_errors.append(m.text) if m.type == "error" else None)
        page.on("pageerror", lambda e: console_errors.append(f"PAGE ERROR: {e}"))

        page.goto("http://127.0.0.1:5173", wait_until="domcontentloaded")
        page.wait_for_timeout(300)

        # 1. Check toggle button exists
        toggle_btn = page.locator("header button[data-tooltip*='Theme']").first
        assert toggle_btn.is_visible()

        # 2. Toggle to light mode explicitly
        page.evaluate("""() => {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('synodix_theme', 'light');
        }""")
        page.reload(wait_until="domcontentloaded")
        page.wait_for_timeout(300)

        theme_attr = page.evaluate("() => document.documentElement.getAttribute('data-theme')")
        assert theme_attr == "light"
        assert page.evaluate("() => localStorage.getItem('synodix_theme')") == "light"

        # 3. Verify horizontal layout integrity
        assert check_no_horizontal_overflow(page)

        # 4. Toggle back to dark mode
        dark_toggle = page.locator("header button[data-tooltip*='Deep Space']").first
        if dark_toggle.is_visible():
            dark_toggle.click()
            page.wait_for_timeout(300)
            assert page.evaluate("() => document.documentElement.getAttribute('data-theme')") == "dark"

        browser.close()
        critical = [e for e in console_errors if "favicon" not in e.lower()]
        assert len(critical) == 0, f"Console errors: {critical}"


def test_light_theme_screens_render_cleanly():
    with sync_playwright() as pw:
        browser = _launch_browser(pw)
        page = browser.new_page(viewport={"width": 1280, "height": 800})
        console_errors = []
        page.on("console", lambda m: console_errors.append(m.text) if m.type == "error" else None)
        page.on("pageerror", lambda e: console_errors.append(f"PAGE ERROR: {e}"))

        page.goto("http://127.0.0.1:5173", wait_until="domcontentloaded")
        page.evaluate("""() => {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('synodix_theme', 'light');
        }""")
        page.reload(wait_until="domcontentloaded")
        page.wait_for_timeout(300)

        for selector in [
            "button:has-text('Workbench & Vault')",
            "button:has-text('Synthesis Matrix')",
            "button:has-text('Corroboration Dossier')",
            "button:has-text('Cultural Traditions')",
        ]:
            btn = page.locator(selector).first
            if btn.is_visible():
                btn.click()
                page.wait_for_timeout(200)

        browser.close()
        critical = [e for e in console_errors if "favicon" not in e.lower()]
        assert len(critical) == 0, f"Console errors: {critical}"
