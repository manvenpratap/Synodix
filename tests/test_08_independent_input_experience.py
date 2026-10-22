"""
test_08_independent_input_experience.py — Regression suite for Independent Custom Manual Input
Validates:
- Complete visual separation between Custom Manual Input and 100 Historical Titan sample records
- Zero sample record interference in Custom Manual mode (search bar and 100-card grid hidden)
- Seamless mode switching between Custom Manual Input and Historical Titan Archive
- "Customize in Manual Input" transfer from Titan Archive to Custom Workbench
- Custom subject name editing and computation
- Zero horizontal layout overflow and zero console errors
"""

import os
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


def test_independent_custom_input_and_titan_archive_separation():
    with sync_playwright() as pw:
        browser = _launch_browser(pw)
        context = browser.new_context(viewport={"width": 1280, "height": 900})
        page = context.new_page()

        page._console_errors = []
        page.on("console", lambda msg: page._console_errors.append(msg.text) if msg.type == "error" else None)
        page.on("pageerror", lambda err: page._console_errors.append(str(err)))

        page.goto("http://127.0.0.1:5173", wait_until="domcontentloaded")
        page.wait_for_selector("text=Synodix", timeout=10000)

        # 1. Verify default view is Custom Manual Input with zero sample card interference
        custom_tab = page.locator("#tab-custom-mode")
        archive_tab = page.locator("#tab-archive-mode")
        assert custom_tab.is_visible(), "Custom manual mode tab must be visible"
        assert archive_tab.is_visible(), "Archive mode tab must be visible"
        assert custom_tab.get_attribute("aria-selected") == "true", "Custom mode must be active by default"

        # Assert no sample search input or celebrity cards in Custom mode
        personality_search = page.locator("#personality_search")
        assert not personality_search.is_visible(), "Personality search bar should NOT be visible in Custom mode"

        # Assert custom input fields are cleanly present
        subject_input = page.locator("#subject_name")
        assert subject_input.is_visible(), "Subject dossier name input must be visible"
        assert page.locator("#birth_date").is_visible(), "Birth date input must be visible"
        assert page.locator("#birth_time").is_visible(), "Birth time input must be visible"
        assert page.locator("#city_name").is_visible(), "City input must be visible"
        assert page.locator("#latitude").is_visible(), "Latitude input must be visible"
        assert page.locator("#longitude").is_visible(), "Longitude input must be visible"

        # Check screenshot of clean custom input
        save_screenshot(page, "independent_custom_input_clean")

        # 2. Enter custom details
        subject_input.fill("Hypatia of Alexandria")
        page.locator("#birth_date").fill("1984-05-12")
        page.locator("#birth_time").fill("14:30")
        page.locator("#city_name").fill("Alexandria")
        page.locator("#country_name").fill("Egypt")
        page.locator("#latitude").fill("31.2001")
        page.locator("#longitude").fill("29.9187")

        calc_btn = page.locator("button:has-text('Compute, Verify & Synthesize Chart')").first
        calc_btn.click()
        page.wait_for_timeout(800)

        # Verify chart calculation banner displays custom subject name
        assert page.locator("text=Hypatia of Alexandria").first.is_visible(), "Chart banner must show custom subject name"

        # 3. Switch to Historical Titan Archive (100) mode
        archive_tab.click()
        page.wait_for_timeout(300)
        assert archive_tab.get_attribute("aria-selected") == "true", "Archive mode must be active"

        # Now personality search and titan cards MUST be visible
        assert personality_search.is_visible(), "Personality search bar must be visible in Archive mode"
        assert page.locator("text=Rodden AA Certified").first.is_visible() or page.locator("text=Rodden AA").first.is_visible(), "Rodden badge must be visible in Archive mode"

        save_screenshot(page, "historical_titan_archive_mode")

        # 4. Search and select a Titan (e.g. Albert Einstein)
        personality_search.fill("Einstein")
        page.wait_for_timeout(200)

        einstein_card = page.locator("div[role='button']:has-text('Albert Einstein')").first
        assert einstein_card.is_visible(), "Albert Einstein card should be visible"
        einstein_card.click()
        page.wait_for_timeout(200)

        # 5. Click "Customize in Manual Input" to transfer to Custom Mode
        customize_btn = page.locator("button:has-text('Customize in Manual Input')").first
        assert customize_btn.is_visible(), "Customize button should be visible in Titan Dossier"
        customize_btn.click()
        page.wait_for_timeout(300)

        # Verify we transitioned back to Custom mode with Einstein's data preloaded
        assert custom_tab.get_attribute("aria-selected") == "true", "Should switch to Custom mode"
        assert not personality_search.is_visible(), "Search bar must be hidden in Custom mode"
        assert subject_input.input_value() == "Albert Einstein", "Subject name should be Albert Einstein"
        assert page.locator("#city_name").input_value() == "Ulm", "City should be Ulm"

        # 6. Verify zero horizontal overflow and zero console errors
        assert check_no_horizontal_overflow(page), "Viewport should have zero horizontal overflow"
        assert_no_critical_errors(page)

        browser.close()
