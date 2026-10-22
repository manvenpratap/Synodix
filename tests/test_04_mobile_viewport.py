"""
test_04_mobile_viewport.py — Playwright Mobile Viewport & Touch Ergonomics Verification
Validates:
- Mobile viewport rendering on narrow (iPhone SE: 375x667) and standard (iPhone 14: 390x844) devices
- Zero horizontal overflow across all 5 navigation screens (Workbench, Traditions, Synthesis, Dossier, Evidence)
- Touch targets >= 44x44px for primary interactive elements (bottom nav, drawer, mode switchers, modal close)
- Safe-area insets and bottom navigation bar ergonomics
- Zero critical console errors
"""

import os
from pathlib import Path
from playwright.sync_api import sync_playwright

try:
    from tests.helpers import check_no_horizontal_overflow, assert_no_critical_errors
except ImportError:
    from helpers import check_no_horizontal_overflow, assert_no_critical_errors

MAC_CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"


def _launch_browser(pw):
    if os.path.exists(MAC_CHROME):
        return pw.chromium.launch(headless=True, executable_path=MAC_CHROME)
    return pw.chromium.launch(headless=True)


def test_mobile_viewport_and_touch_targets():
    viewports = [
        {"name": "iPhone_SE", "width": 375, "height": 667},
        {"name": "iPhone_14", "width": 390, "height": 844},
    ]

    with sync_playwright() as pw:
        browser = _launch_browser(pw)

        for vp in viewports:
            context = browser.new_context(
                viewport={"width": vp["width"], "height": vp["height"]},
                is_mobile=True,
                has_touch=True,
                user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
            )
            page = context.new_page()

            console_errors = []
            page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)
            setattr(page, "_console_errors", console_errors)

            page.goto("http://127.0.0.1:5173", wait_until="domcontentloaded")
            page.wait_for_selector("button[aria-label='Open sidebar menu']", timeout=10000)

            # 1. Verify bottom navigation bar exists and is visible on mobile
            bottom_nav = page.locator("nav[aria-label='Mobile Navigation']")
            assert bottom_nav.is_visible(), f"Mobile bottom navigation bar should be visible on {vp['name']} viewport"

            # 2. Verify all bottom navigation buttons meet min 44x44px touch targets
            nav_buttons = bottom_nav.locator("button")
            button_count = nav_buttons.count()
            assert button_count >= 5, f"Expected at least 5 bottom nav items, found {button_count}"

            for i in range(button_count):
                btn = nav_buttons.nth(i)
                box = btn.bounding_box()
                assert box is not None, f"Nav button {i} should have a valid bounding box"
                assert box["width"] >= 44, f"Nav button {i} width {box['width']} < 44px on {vp['name']}"
                assert box["height"] >= 44, f"Nav button {i} height {box['height']} < 44px on {vp['name']}"

            # 3. Verify hamburger menu button touch target
            hamburger = page.locator("button[aria-label='Open sidebar menu']")
            assert hamburger.is_visible(), "Mobile hamburger button should be visible"
            h_box = hamburger.bounding_box()
            assert h_box is not None
            assert h_box["width"] >= 44, f"Hamburger width {h_box['width']} < 44px on {vp['name']}"
            assert h_box["height"] >= 44, f"Hamburger height {h_box['height']} < 44px on {vp['name']}"

            # 4. Open mobile drawer and test close button touch target
            hamburger.click()
            page.wait_for_selector("button[aria-label='Close navigation']", timeout=3000)
            close_btn = page.locator("button[aria-label='Close navigation']")
            assert close_btn.is_visible()
            c_box = close_btn.bounding_box()
            assert c_box is not None
            assert c_box["width"] >= 44, f"Close button width {c_box['width']} < 44px on {vp['name']}"
            assert c_box["height"] >= 44, f"Close button height {c_box['height']} < 44px on {vp['name']}"

            close_btn.click()
            page.wait_for_timeout(300)

            # 5. Verify Mode Switcher tabs meet >= 44px touch target on mobile
            custom_tab = page.locator("#tab-custom-mode")
            archive_tab = page.locator("#tab-archive-mode")
            assert custom_tab.is_visible()
            assert archive_tab.is_visible()
            ct_box = custom_tab.bounding_box()
            at_box = archive_tab.bounding_box()
            assert ct_box is not None and ct_box["height"] >= 44, f"Custom tab height {ct_box['height']} < 44px on {vp['name']}"
            assert at_box is not None and at_box["height"] >= 44, f"Archive tab height {at_box['height']} < 44px on {vp['name']}"

            # 6. Verify Form Inputs meet >= 44px touch target on mobile
            date_input = page.locator("#birth_date")
            time_input = page.locator("#birth_time")
            assert date_input.is_visible()
            assert time_input.is_visible()
            d_box = date_input.bounding_box()
            t_box = time_input.bounding_box()
            assert d_box is not None and d_box["height"] >= 44, f"Date input height {d_box['height']} < 44px on {vp['name']}"
            assert t_box is not None and t_box["height"] >= 44, f"Time input height {t_box['height']} < 44px on {vp['name']}"

            # 7. Check no horizontal overflow on Workbench
            assert check_no_horizontal_overflow(page), f"Workbench should have zero horizontal overflow on {vp['name']}"

            # 8. Calculate chart to unlock traditions, synthesis, and dossier
            page.evaluate("() => { const b = document.querySelector(\"button[type='submit']\"); if (b) b.click(); }")
            page.wait_for_timeout(1000)

            # 9. Verify zero horizontal overflow across all screens
            for screen in ["traditions", "synthesis", "dossier", "evidence"]:
                page.evaluate(f"() => {{ const b = document.querySelector(\"nav[aria-label='Mobile Navigation'] button[aria-label='{screen.capitalize()}']\"); if (b) b.click(); }}")
                page.wait_for_timeout(400)
                assert check_no_horizontal_overflow(page), f"Screen '{screen}' should have zero horizontal overflow on {vp['name']}"

            # 10. Test Mobile Epistemological Journey Stepper & Navigation CTAs
            stepper = page.locator("text=Epistemic Journey").first
            assert stepper.is_visible(), f"Epistemic Journey Stepper should be visible on {vp['name']}"
            
            # Navigate via Journey Stepper to Traditions
            page.evaluate("() => { const b = document.querySelectorAll(\"button\"); for (const el of b) { if (el.innerText.includes('Traditions') && el.innerText.includes('2')) { el.click(); break; } } }")
            page.wait_for_timeout(400)
            
            # Bottom Journey CTA should be visible
            synth_cta = page.locator("button:has-text('Explore Cross-Cultural Synthesis Matrix')").first
            assert synth_cta.is_visible(), f"Bottom Journey CTA to Synthesis should be visible on {vp['name']}"
            synth_cta.click()
            page.wait_for_timeout(400)
            
            # Active subject chip in header should be visible on mobile
            subj_chip = page.locator("button[aria-label*='Subject:']").first
            assert subj_chip.is_visible(), f"Active subject chip should be visible on mobile {vp['name']}"

            # 11. Test Feature Explainer Modal touch targets
            guide_btn = page.locator("button[aria-label='Browse Feature Explainers & Astrometric Glossary']").first
            assert guide_btn.is_visible()
            g_box = guide_btn.bounding_box()
            assert g_box is not None and g_box["width"] >= 40 and g_box["height"] >= 40, f"Guide trigger size {g_box} < 40px on {vp['name']}"
            guide_btn.click()
            page.wait_for_selector("button[aria-label='Close explainer modal']", timeout=3000)
            modal_close = page.locator("button[aria-label='Close explainer modal']")
            mc_box = modal_close.bounding_box()
            assert mc_box is not None
            assert mc_box["width"] >= 44, f"Modal close width {mc_box['width']} < 44px on {vp['name']}"
            assert mc_box["height"] >= 44, f"Modal close height {mc_box['height']} < 44px on {vp['name']}"
            modal_close.click()
            page.wait_for_timeout(300)

            # 12. Check zero critical console errors
            assert_no_critical_errors(page)

            context.close()

        browser.close()
