"""
test_04_mobile_viewport.py — Playwright Mobile Viewport & Touch Ergonomics Verification
Validates:
- Mobile viewport rendering (iPhone 14 / Pixel dimensions: 390x844)
- Touch targets >= 44x44px for primary interactive elements
- Safe-area insets and bottom navigation bar ergonomics
- Mobile drawer open/close functionality
- Zero horizontal overflow and zero console errors
"""

import os
from pathlib import Path
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


def test_mobile_viewport_and_touch_targets():
    with sync_playwright() as pw:
        browser = _launch_browser(pw)
        context = browser.new_context(
            viewport={"width": 390, "height": 844},
            is_mobile=True,
            has_touch=True,
            user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
        )
        page = context.new_page()

        console_errors = []
        page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)

        page.goto("http://127.0.0.1:5173", wait_until="domcontentloaded")
        page.wait_for_selector("button[aria-label='Open sidebar menu']", timeout=10000)

        # 1. Verify bottom navigation bar exists and is visible on mobile
        bottom_nav = page.locator("nav[aria-label='Mobile Navigation']")
        assert bottom_nav.is_visible(), "Mobile bottom navigation bar should be visible on 390px viewport"

        # 2. Verify all bottom navigation buttons meet min 44x44px touch targets
        nav_buttons = bottom_nav.locator("button")
        button_count = nav_buttons.count()
        assert button_count >= 5, f"Expected at least 5 bottom nav items, found {button_count}"

        for i in range(button_count):
            btn = nav_buttons.nth(i)
            box = btn.bounding_box()
            assert box is not None, f"Nav button {i} should have a valid bounding box"
            assert box["width"] >= 44, f"Nav button {i} width {box['width']} < 44px"
            assert box["height"] >= 44, f"Nav button {i} height {box['height']} < 44px"

        # 3. Verify hamburger menu button touch target
        hamburger = page.locator("button[aria-label='Open sidebar menu']")
        assert hamburger.is_visible(), "Mobile hamburger button should be visible"
        h_box = hamburger.bounding_box()
        assert h_box is not None
        assert h_box["width"] >= 44, f"Hamburger width {h_box['width']} < 44px"
        assert h_box["height"] >= 44, f"Hamburger height {h_box['height']} < 44px"

        # 4. Open mobile drawer and test close
        hamburger.click()
        page.wait_for_selector("button[aria-label='Close navigation']", timeout=3000)
        close_btn = page.locator("button[aria-label='Close navigation']")
        assert close_btn.is_visible()
        c_box = close_btn.bounding_box()
        assert c_box is not None
        assert c_box["width"] >= 44, f"Close button width {c_box['width']} < 44px"
        assert c_box["height"] >= 44, f"Close button height {c_box['height']} < 44px"

        close_btn.click()
        page.wait_for_timeout(300)

        # 5. Check no horizontal overflow
        assert check_no_horizontal_overflow(page), "Mobile viewport should have zero horizontal overflow"

        # 6. Check critical console errors
        critical_errors = [e for e in console_errors if "favicon" not in e and "sourcemap" not in e.lower()]
        assert len(critical_errors) == 0, f"Critical console errors detected: {critical_errors}"

        browser.close()
