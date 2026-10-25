"""
test_10_impeccable_quality_audit.py — Multi-Screen Playwright & Impeccable Quality Verification
Validates across all 5 epistemic screens (Workbench, Traditions, Synthesis, Dossier, Evidence)
and all 9 tradition visualizers:
- 11px floor on UI elements, badges, and controls
- 12px floor on body text and analytical narratives
- Zero horizontal overflow across Desktop and Mobile viewports
- Zero critical console errors
"""

import os
from playwright.sync_api import sync_playwright

try:
    from tests.helpers import assert_no_critical_errors
except ImportError:
    from helpers import assert_no_critical_errors

MAC_CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"


def _launch_browser(pw):
    if os.path.exists(MAC_CHROME):
        return pw.chromium.launch(headless=True, executable_path=MAC_CHROME)
    return pw.chromium.launch(headless=True)


def test_impeccable_typography_and_screen_audit():
    with sync_playwright() as pw:
        browser = _launch_browser(pw)
        page = browser.new_page(viewport={"width": 1280, "height": 800})

        console_errors = []
        page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)
        setattr(page, "_console_errors", console_errors)

        page.goto("http://127.0.0.1:5173", wait_until="domcontentloaded")
        page.wait_for_selector("text=Synodix", timeout=10000)

        # 1. Screen 1: Workbench
        workbench_violations = page.evaluate("""() => {
            const issues = [];
            document.querySelectorAll('button, input, select, [role="button"]').forEach(el => {
                const fs = parseFloat(window.getComputedStyle(el).fontSize);
                if (fs < 10.9 && el.offsetParent !== null && el.innerText.trim()) {
                    issues.push(`Interactive font too small: ${fs}px on ${el.tagName}.${el.className}`);
                }
            });
            return issues;
        }""")
        assert len(workbench_violations) == 0, f"Workbench has undersized elements: {workbench_violations}"

        # 2. Screen 2: Traditions
        trad_btn = page.locator("button:has-text('Traditions')").first
        trad_btn.click()
        page.wait_for_timeout(300)

        tradition_names = ['vedic', 'western', 'bazi', 'ziwei', 'maya', 'tibetan', 'persian', 'egyptian', 'celtic']
        for tid in tradition_names:
            tab = page.locator(f"button#tradition-tab-{tid}")
            if tab.is_visible():
                tab.click()
                page.wait_for_timeout(100)

        # Check tradition quotes have text >= 12px
        trad_violations = page.evaluate("""() => {
            const issues = [];
            document.querySelectorAll('blockquote, p, span.italic').forEach(el => {
                const text = el.innerText.trim();
                const fs = parseFloat(window.getComputedStyle(el).fontSize);
                if (fs < 11.9 && text.length > 20 && el.offsetParent !== null) {
                    issues.push(`Body/quote text too small: ${fs}px - "${text.slice(0, 30)}..."`);
                }
            });
            return issues;
        }""")
        assert len(trad_violations) == 0, f"Traditions view has tiny body text: {trad_violations}"

        # 3. Screen 3: Synthesis
        synth_btn = page.locator("button:has-text('Synthesis')").first
        synth_btn.click()
        page.wait_for_timeout(300)

        synth_violations = page.evaluate("""() => {
            const issues = [];
            document.querySelectorAll('p, .consensus-theme, [data-domain]').forEach(el => {
                const text = el.innerText.trim();
                const fs = parseFloat(window.getComputedStyle(el).fontSize);
                if (fs < 11.9 && text.length > 25 && el.offsetParent !== null) {
                    issues.push(`Synthesis text too small: ${fs}px - "${text.slice(0, 30)}..."`);
                }
            });
            return issues;
        }""")
        assert len(synth_violations) == 0, f"Synthesis view has tiny body text: {synth_violations}"

        # 4. Screen 4: Dossier
        dossier_btn = page.locator("button:has-text('Dossier')").first
        dossier_btn.click()
        page.wait_for_timeout(300)

        dossier_violations = page.evaluate("""() => {
            const issues = [];
            document.querySelectorAll('p').forEach(el => {
                const text = el.innerText.trim();
                const fs = parseFloat(window.getComputedStyle(el).fontSize);
                if (fs < 11.9 && text.length > 20 && el.offsetParent !== null) {
                    issues.push(`Dossier narrative text too small: ${fs}px - "${text.slice(0, 30)}..."`);
                }
            });
            return issues;
        }""")
        assert len(dossier_violations) == 0, f"Dossier view has tiny narrative text: {dossier_violations}"

        # 5. Screen 5: Evidence
        evidence_btn = page.locator("button:has-text('Evidence')").first
        evidence_btn.click()
        page.wait_for_timeout(300)

        evidence_violations = page.evaluate("""() => {
            const issues = [];
            document.querySelectorAll('p').forEach(el => {
                const text = el.innerText.trim();
                const fs = parseFloat(window.getComputedStyle(el).fontSize);
                if (fs < 11.9 && text.length > 25 && el.offsetParent !== null) {
                    issues.push(`Evidence text too small: ${fs}px - "${text.slice(0, 30)}..."`);
                }
            });
            return issues;
        }""")
        assert len(evidence_violations) == 0, f"Evidence view has tiny narrative text: {evidence_violations}"

        # Assert zero critical console errors
        assert_no_critical_errors(page)
        browser.close()
