"""
test_09_dossier_inferences.py — Validates Dossier Inferences Profile & Subject Separation
Checks:
1. Disentanglement of Subject (Name) vs Birthplace (City, Country) in Document Metadata and Dossier.
2. Section 2 presence: Synthesized Astrological Inferences & Personality Profile.
3. Rendering of Core Archetype title and multi-paragraph narrative synthesis.
4. Rendering of Civilizational Foundation Pillars (Vedic, Western, BaZi, Zi Wei, Persian Almuten).
5. Rendering of Cognitive, Vocational, and Relational/Karmic analytical triads.
6. Zero critical console errors and zero horizontal overflow.
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


def test_dossier_inferences_and_subject_separation():
    with sync_playwright() as pw:
        browser = _launch_browser(pw)
        context = browser.new_context(viewport={"width": 1280, "height": 850})
        page = context.new_page()

        console_errors = []
        page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)

        page.goto("http://127.0.0.1:5173", wait_until="domcontentloaded")
        page.wait_for_selector("button[type='submit']", timeout=10000)

        # 1. Compute chart to generate full data
        page.evaluate("() => { const b = document.querySelector(\"button[type='submit']\"); if (b) b.click(); }")
        page.wait_for_timeout(1000)

        # 2. Navigate to Corroboration Dossier screen
        dossier_nav = page.locator("button:has-text('Corroboration Dossier'), button:has-text('4. Dossier'), button:has-text('Dossier')").first
        dossier_nav.click()
        page.wait_for_selector("text=Audited Epistemological Document", timeout=8000)

        # 3. Verify Subject is distinguished from Birthplace in Document Metadata Badges
        subject_badge = page.locator("div:has-text('SUBJECT')").first
        assert "Steve Jobs" in subject_badge.inner_text(), f"Expected 'Steve Jobs' in subject badge, got: {subject_badge.inner_text()}"
        
        # Birthplace badge should have 'San Francisco'
        birthplace_badge = page.locator("div:has-text('BIRTHPLACE')").first
        assert "San Francisco" in birthplace_badge.inner_text(), f"Expected 'San Francisco' in birthplace badge, got: {birthplace_badge.inner_text()}"

        # 4. Verify Section 1 (Input Dossier) displays both Subject and Birthplace clearly
        assert page.locator("text=1. Astronomical & Geodetic Input Dossier").is_visible()
        input_dossier_box = page.locator("div:has-text('Subject & Civil Coordinates')").first
        assert "Steve Jobs" in input_dossier_box.inner_text()
        assert "San Francisco" in input_dossier_box.inner_text()

        # 5. Verify Section 2 (Synthesized Astrological Inferences & Personality Profile)
        assert page.locator("text=2. Synthesized Astrological Inferences & Personality Profile").is_visible()
        assert page.locator("text=9-System Deductive Profile").is_visible()

        # 6. Verify Core Archetype Spotlight
        assert page.locator("text=Primary Civilizational Archetype").is_visible()
        archetype_heading = page.locator("h4:has-text('Archetype'), h4:has-text('The ')").first
        assert archetype_heading.is_visible()
        print(f"    [PASS] Core Archetype verified: {archetype_heading.inner_text()}")

        # 7. Verify 5 Civilizational Anchors
        assert page.locator("text=Vedic Jyotisha").first.is_visible()
        assert page.locator("text=Hellenistic Western").first.is_visible()
        assert page.locator("text=BaZi Four Pillars").first.is_visible()
        assert page.locator("text=Zi Wei Dou Shu").first.is_visible()
        assert page.locator("text=Persian Almuten").first.is_visible()

        # 8. Verify 3-Column Analytical Triad
        assert page.locator("text=Cognitive Architecture").is_visible()
        assert page.locator("text=Vocation & Executive Drive").is_visible()
        assert page.locator("text=Relational & Karmic Blueprint").is_visible()

        # 9. Verify Active Timing Chapter banner
        assert page.locator("text=Current Timing Chapter:").is_visible()
        assert page.locator("text=Quad-Cycle Synchronized").is_visible()

        # 10. Verify Section 3 (Cross-Cultural Corroboration Matrix) exists
        assert page.locator("text=3. Cross-Cultural Corroboration Matrix (Life Domains)").is_visible()

        # 11. Check no critical console errors or horizontal overflow
        assert check_no_horizontal_overflow(page)
        critical_errors = [e for e in console_errors if "favicon" not in e and "Manifest" not in e]
        assert len(critical_errors) == 0, f"Critical console errors detected: {critical_errors}"

        browser.close()


def test_dossier_inferences_mobile_viewport():
    with sync_playwright() as pw:
        browser = _launch_browser(pw)
        # Mobile viewport: 390x844 (iPhone 14/15)
        context = browser.new_context(viewport={"width": 390, "height": 844})
        page = context.new_page()

        console_errors = []
        page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)

        page.goto("http://127.0.0.1:5173", wait_until="domcontentloaded")
        page.wait_for_selector("button[aria-label='Open sidebar menu']", timeout=10000)

        # Compute chart on mobile
        page.evaluate("() => { const b = document.querySelector(\"button[type='submit']\"); if (b) b.click(); }")
        page.wait_for_timeout(1000)

        # Step to Dossier via mobile navigation button
        page.evaluate("() => { const b = document.querySelector(\"nav[aria-label='Mobile Navigation'] button[aria-label='Dossier']\"); if (b) b.click(); }")
        page.wait_for_selector("text=Audited Epistemological Document", timeout=8000)

        # Check no horizontal scroll on mobile viewport in Dossier view
        assert check_no_horizontal_overflow(page), "Dossier should have zero horizontal overflow on mobile"

        # Check Subject and Inferences section exist on mobile
        subject_badge = page.locator("div:has-text('SUBJECT')").first
        assert "Steve Jobs" in subject_badge.inner_text(), f"Expected Steve Jobs in mobile subject badge, got: {subject_badge.inner_text()}"
        assert page.locator("text=2. Synthesized Astrological Inferences & Personality Profile").is_visible()

        critical_errors = [e for e in console_errors if "favicon" not in e and "Manifest" not in e]
        assert len(critical_errors) == 0, f"Critical console errors detected: {critical_errors}"

        browser.close()
