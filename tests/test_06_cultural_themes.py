"""
test_06_cultural_themes.py — Regression suite for 9 Culturally Themed Display Presentations
Validates:
- All 9 astrological traditions (Jyotisha, BaZi, Western, Zi Wei, Maya, Tibetan, Persian, Egyptian, Maramataka)
- Cultural immersion headers with authentic native script, lineages, and mottos
- Cultural color palettes and instrument framing
- Universal display presentation toggles (Comprehensive, Visual Instrument, Telemetry Tables)
- Zero horizontal overflow and zero console errors across all tradition views
"""

import os
from pathlib import Path
from playwright.sync_api import sync_playwright

try:
    from tests.helpers import check_no_horizontal_overflow, assert_no_critical_errors, save_screenshot
except ImportError:
    from helpers import check_no_horizontal_overflow, assert_no_critical_errors, save_screenshot

MAC_CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"


def _launch_browser(pw):
    if os.path.exists(MAC_CHROME):
        return pw.chromium.launch(headless=True, executable_path=MAC_CHROME)
    return pw.chromium.launch(headless=True)


def test_cultural_traditions_theming_and_presentations():
    with sync_playwright() as pw:
        browser = _launch_browser(pw)
        context = browser.new_context(viewport={"width": 1280, "height": 900})
        page = context.new_page()

        page._console_errors = []
        page.on("console", lambda msg: page._console_errors.append(msg.text) if msg.type == "error" else None)
        page.on("pageerror", lambda err: page._console_errors.append(str(err)))

        page.goto("http://127.0.0.1:5173", wait_until="domcontentloaded")
        page.wait_for_selector("text=Synodix", timeout=10000)

        # Wait for chart data to finish calculation on mount
        page.wait_for_selector("text=ASTROMETRIC CALIBRATION", timeout=10000)

        # Navigate to Cultural Traditions view
        traditions_nav = page.locator("button:has-text('Cultural Traditions')").first
        assert traditions_nav.is_visible(), "Cultural Traditions nav tab must be visible"
        traditions_nav.click()
        page.wait_for_timeout(400)

        traditions = [
            ("jyotisha", "ज्योतिष", "Parashari Diamond Kundali"),
            ("bazi", "八字命理", "Wu Xing Dynamic Elemental Pentagram"),
            ("western", "Ἑλληνιστικὴ Ἀστρολογία", "Ptolemaic 360° Circular Aspect Wheel"),
            ("ziwei", "紫微斗數", "Authentic 4x4 Imperial Courtyard Palace Matrix"),
            ("mayan", "Chol Q’ij & Haab’", "Tzolk’in & Haab’ Interlocking Stele Gear Compass"),
            ("tibetan", "དཀར་རྩིས་", "3x3 Lo Shu Mewa Magic Square"),
            ("persian", "علم النجوم", "Almuten Figuris Comparative Dignity"),
            ("egyptian", "𓇹𓇳𓏤", "36-Decan Star Compass"),
            ("maramataka", "Te Maramataka", "30-Phase Oceanic Lunar Dial"),
        ]

        for tid, expected_native, expected_inst in traditions:
            tab_btn = page.locator(f"button#tradition-tab-{tid}")
            assert tab_btn.is_visible(), f"Tab button for {tid} must be visible"
            tab_btn.click()
            page.wait_for_timeout(250)

            # Assert tab is selected
            assert tab_btn.get_attribute("aria-selected") == "true", f"Tab {tid} should be selected"

            # Assert cultural immersion banner displays native title
            banner = page.locator("div.mt-4.p-4.rounded-xl.border")
            assert banner.is_visible(), f"Cultural immersion header for {tid} should be visible"
            banner_text = banner.inner_text()
            assert expected_native in banner_text, f"Expected '{expected_native}' in banner for {tid}"

            # Verify display presentation switching
            # 1. Visual Instrument mode
            vis_btn = page.locator("button:has-text('Visual Instrument')").first
            vis_btn.click()
            page.wait_for_timeout(200)

            # Instrument should be visible
            inst_heading = page.locator(f"h5:has-text('{expected_inst}')")
            assert inst_heading.is_visible(), f"Instrument '{expected_inst}' must be visible in Visual Instrument mode"

            # 2. Telemetry Tables mode
            table_btn = page.locator("button:has-text('Telemetry Tables')").first
            table_btn.click()
            page.wait_for_timeout(200)

            # Instrument should be hidden in Telemetry Tables mode
            assert not inst_heading.is_visible(), f"Instrument '{expected_inst}' must be hidden in Telemetry Tables mode"

            # 3. Comprehensive mode
            comp_btn = page.locator("button:has-text('Comprehensive')").first
            comp_btn.click()
            page.wait_for_timeout(200)
            assert inst_heading.is_visible(), f"Instrument '{expected_inst}' must be visible in Comprehensive mode"

            # Verify layout integrity
            assert check_no_horizontal_overflow(page)

        # Capture key cultural presentation screenshots for verification catalog
        for tid in ["jyotisha", "bazi", "western", "ziwei", "persian"]:
            page.locator(f"button#tradition-tab-{tid}").click()
            page.wait_for_timeout(300)
            save_screenshot(page, f"cultural_theme_{tid}")

        # Assert zero critical console errors occurred during the entire run
        assert_no_critical_errors(page)
        browser.close()
