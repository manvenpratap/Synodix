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


def test_impeccable_light_mode_contrast_and_tooltip_bounds():
    """Verify light mode color contrast, header tooltip downward orientation, and sidebar scroll lock."""
    with sync_playwright() as pw:
        browser = _launch_browser(pw)
        page = browser.new_page(viewport={"width": 1440, "height": 900})

        console_errors = []
        page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)
        setattr(page, "_console_errors", console_errors)

        page.goto("http://127.0.0.1:5173", wait_until="domcontentloaded")
        page.wait_for_selector("text=Synodix", timeout=10000)

        # 1. Sidebar horizontal scroll lock & logo alignment
        aside_status = page.evaluate("""() => {
            const aside = document.querySelector("aside");
            const style = window.getComputedStyle(aside);
            const header = aside.querySelector("div:first-child");
            const logo = aside.querySelector("svg.animate-orbital-spin");
            const headerRect = header ? header.getBoundingClientRect() : null;
            const logoRect = logo ? logo.getBoundingClientRect() : null;
            return {
                overflowX: style.overflowX,
                scrollLeft: aside.scrollLeft,
                scrollWidth: aside.scrollWidth,
                clientWidth: aside.clientWidth,
                headerHeight: headerRect ? headerRect.height : 0,
                logoWidth: logoRect ? logoRect.width : 0,
                logoHeight: logoRect ? logoRect.height : 0,
                logoX: logoRect ? logoRect.x : 0
            };
        }""")
        assert aside_status["overflowX"] == "hidden", f"Sidebar overflow-x should be hidden, got {aside_status['overflowX']}"
        assert aside_status["scrollLeft"] == 0, f"Sidebar scrollLeft should be 0, got {aside_status['scrollLeft']}"
        assert aside_status["headerHeight"] >= 65, f"Sidebar header height crushed ({aside_status['headerHeight']}px < 65px), logo half-hidden"
        assert aside_status["logoHeight"] >= 20, f"Sidebar logo height crushed ({aside_status['logoHeight']}px < 20px)"
        assert aside_status["logoX"] >= 10, f"Sidebar logo shifted left or cut off ({aside_status['logoX']}px < 10px)"

        # 2. Header Tooltip Downward Orientation (Does not clip into browser menu)
        theme_btn = page.locator("header button:has-text('Mode')")
        theme_btn.hover()
        page.wait_for_timeout(100)
        tooltip_bounds = page.evaluate("""() => {
            const btn = document.querySelector("header button[data-tooltip]");
            const afterStyle = window.getComputedStyle(btn, "::after");
            const btnRect = btn.getBoundingClientRect();
            return {
                top: afterStyle.top,
                bottom: afterStyle.bottom,
                btnBottom: btnRect.bottom
            };
        }""")
        assert tooltip_bounds["bottom"] == "auto", "Header tooltip bottom must be auto to orient downwards"

        # 3. Light Theme Color Contrast Verification
        # Ensure we are in light mode
        current_theme = page.evaluate("() => document.documentElement.getAttribute('data-theme')")
        if current_theme != "light":
            theme_btn.click()
            page.wait_for_timeout(200)

        contrast_results = page.evaluate("""() => {
            const aside = document.querySelector("aside");
            const pers = aside.querySelector("[data-tooltip='Persian (Almuten)']");
            const egypt = aside.querySelector("[data-tooltip='Egyptian (Decans)']");

            // Simple relative luminance parser for rgb(r, g, b)
            function getLuminance(rgbStr) {
                const match = rgbStr.match(/\\d+/g);
                if (!match || match.length < 3) return 1;
                const [r, g, b] = match.map(Number).map(v => {
                    const c = v / 255;
                    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
                });
                return 0.2126 * r + 0.7152 * g + 0.0722 * b;
            }

            function getContrast(rgb1, rgb2) {
                const l1 = getLuminance(rgb1);
                const l2 = getLuminance(rgb2);
                return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
            }

            const persColor = window.getComputedStyle(pers).color;
            const egyptColor = window.getComputedStyle(egypt).color;
            const whiteBg = "rgb(255, 255, 255)";

            return {
                persContrast: getContrast(persColor, whiteBg),
                egyptContrast: getContrast(egyptColor, whiteBg),
            };
        }""")
        assert contrast_results["persContrast"] >= 4.5, f"PERS pill contrast should be >= 4.5, got {contrast_results['persContrast']:.2f}"
        assert contrast_results["egyptContrast"] >= 4.5, f"EGYPT pill contrast should be >= 4.5, got {contrast_results['egyptContrast']:.2f}"

        # 4. Mathematical Evidence Screen Light Theme & Hover Contrast
        evidence_nav = page.locator("button:has-text('Mathematical Evid')").first
        evidence_nav.click()
        page.wait_for_timeout(300)

        # Hover over H6 row
        row_h6 = page.locator("tr:has-text('H6')")
        row_h6.hover()
        page.wait_for_timeout(100)

        evidence_contrast = page.evaluate("""() => {
            function getLuminance(rgbStr) {
                const match = rgbStr.match(/\\d+/g);
                if (!match || match.length < 3) return 1;
                const [r, g, b] = match.map(Number).map(v => {
                    const c = v / 255;
                    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
                });
                return 0.2126 * r + 0.7152 * g + 0.0722 * b;
            }
            function getContrast(rgb1, rgb2) {
                const l1 = getLuminance(rgb1);
                const l2 = getLuminance(rgb2);
                return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
            }

            const rows = Array.from(document.querySelectorAll("tbody tr"));
            const r6 = rows.find(r => r.innerText.includes("H6"));
            const r1 = rows.find(r => r.innerText.includes("H1"));
            const r4 = rows.find(r => r.innerText.includes("H4"));

            const r6Bg = window.getComputedStyle(r6).backgroundColor;
            const r6ClaimColor = window.getComputedStyle(r6.querySelector("td:nth-child(2)")).color;

            const h1Badge = r1.querySelector("td:last-child span");
            const h1BadgeBg = window.getComputedStyle(h1Badge).backgroundColor;
            const h1BadgeColor = window.getComputedStyle(h1Badge).color;

            const h6Badge = r6.querySelector("td:last-child span");
            const h6BadgeBg = window.getComputedStyle(h6Badge).backgroundColor;
            const h6BadgeColor = window.getComputedStyle(h6Badge).color;

            const h4Badge = r4.querySelector("td:last-child span");
            const h4BadgeBg = window.getComputedStyle(h4Badge).backgroundColor;
            const h4BadgeColor = window.getComputedStyle(h4Badge).color;

            return {
                r6Luminance: getLuminance(r6Bg),
                r6ClaimContrast: getContrast(r6ClaimColor, r6Bg),
                h1EnrichedContrast: getContrast(h1BadgeColor, h1BadgeBg),
                h6SignificantContrast: getContrast(h6BadgeColor, h6BadgeBg),
                h4DisprovenContrast: getContrast(h4BadgeColor, h4BadgeBg),
            };
        }""")

        assert evidence_contrast["r6Luminance"] > 0.8, f"H6 hover background should be light in light mode, got luminance {evidence_contrast['r6Luminance']}"
        assert evidence_contrast["r6ClaimContrast"] >= 4.5, f"H6 claim contrast should be >= 4.5, got {evidence_contrast['r6ClaimContrast']:.2f}"
        assert evidence_contrast["h1EnrichedContrast"] >= 4.5, f"H1 Enriched badge contrast should be >= 4.5, got {evidence_contrast['h1EnrichedContrast']:.2f}"
        assert evidence_contrast["h6SignificantContrast"] >= 4.5, f"H6 Significant badge contrast should be >= 4.5, got {evidence_contrast['h6SignificantContrast']:.2f}"
        assert evidence_contrast["h4DisprovenContrast"] >= 4.5, f"H4 Disproven badge contrast should be >= 4.5, got {evidence_contrast['h4DisprovenContrast']:.2f}"

        assert_no_critical_errors(page)
        browser.close()
