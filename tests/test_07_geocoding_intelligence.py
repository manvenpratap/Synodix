"""
test_07_geocoding_intelligence.py — Regression suite for City Auto-Suggest & Coordinate Intelligence
Validates:
- Real-time city search & suggestion dropdown in BirthDataForm
- Automatic geodetic resolution of decimal latitude and longitude
- Instant offline gazetteer matching and online fallback resilience
- Keyboard navigation (ArrowDown / Enter) for auto-suggest selection
- Manual coordinate override preservation
- Zero horizontal overflow and zero critical console errors
"""

import os
import json
import urllib.request
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


def test_backend_geocode_endpoint():
    """Verify backend API geocoding endpoint returns structured cities and coordinates."""
    url = "http://127.0.0.1:8000/api/geocode?q=London"
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req, timeout=5) as response:
        assert response.status == 200, f"Expected 200 from geocode endpoint, got {response.status}"
        data = json.loads(response.read().decode("utf-8"))
    assert isinstance(data, list), "Expected list of results"
    assert len(data) > 0, "Expected at least 1 match for London"
    london = next((item for item in data if item["city"] == "London"), None)
    assert london is not None, "London record must be present"
    assert abs(london["latitude"] - 51.5074) < 0.1, "London latitude should match standard"
    assert abs(london["longitude"] - (-0.1278)) < 0.1, "London longitude should match standard"


def test_backend_reverse_geocode_and_ip_endpoints():
    """Verify backend API reverse geocoding and IP location endpoints."""
    # 1. Reverse geocode endpoint
    rev_url = "http://127.0.0.1:8000/api/reverse-geocode?lat=28.4595&lon=77.0266"
    req = urllib.request.Request(rev_url)
    with urllib.request.urlopen(req, timeout=5) as response:
        assert response.status == 200
        data = json.loads(response.read().decode("utf-8"))
        assert "Gurugram" in data.get("city", "") or "Gurgaon" in data.get("city", "") or "Delhi" in data.get("city", "")
        assert data.get("country") == "India"

    # 2. IP location endpoint
    ip_url = "http://127.0.0.1:8000/api/ip-location"
    req = urllib.request.Request(ip_url)
    with urllib.request.urlopen(req, timeout=5) as response:
        assert response.status == 200
        data = json.loads(response.read().decode("utf-8"))
        assert "latitude" in data and "longitude" in data
        assert "city" in data and "country" in data


def test_ui_city_autosuggest_and_coordinate_resolution():
    """Verify frontend UI city auto-suggest and automatic lat/lon resolution."""
    with sync_playwright() as pw:
        browser = _launch_browser(pw)
        context = browser.new_context(viewport={"width": 1280, "height": 900})
        page = context.new_page()

        page._console_errors = []
        page.on("console", lambda msg: page._console_errors.append(msg.text) if msg.type == "error" else None)
        page.on("pageerror", lambda err: page._console_errors.append(str(err)))

        page.goto("http://127.0.0.1:5173", wait_until="domcontentloaded")
        page.wait_for_selector("text=Synodix", timeout=10000)
        page.wait_for_selector("text=ASTROMETRIC CALIBRATION", timeout=10000)

        # Ensure workbench is active
        city_input = page.locator("input#city_name")
        assert city_input.is_visible(), "City input must be visible on workbench"

        # 1. Type "Toky" to trigger auto-suggest
        city_input.fill("")
        city_input.press_sequentially("Toky", delay=50)
        page.wait_for_timeout(300)

        # Verify suggestion dropdown appears
        dropdown = page.locator("div[role='listbox']")
        assert dropdown.is_visible(), "City suggestion dropdown listbox should appear"

        # Verify Tokyo option is visible in suggestions
        tokyo_opt = page.locator("div[role='option']:has-text('Tokyo')").first
        assert tokyo_opt.is_visible(), "Tokyo option should appear in suggestions"

        # Click Tokyo option
        tokyo_opt.click()
        page.wait_for_timeout(200)

        # Verify city & country were populated
        assert city_input.input_value() == "Tokyo", "City input must be updated to Tokyo"
        country_input = page.locator("input#country_name")
        assert country_input.input_value() == "Japan", "Country input must be updated to Japan"

        # Verify latitude and longitude were automatically populated
        lat_input = page.locator("input#latitude")
        lon_input = page.locator("input#longitude")
        lat_val = float(lat_input.input_value())
        lon_val = float(lon_input.input_value())

        assert abs(lat_val - 35.6762) < 0.01, f"Latitude {lat_val} should match Tokyo (~35.6762)"
        assert abs(lon_val - 139.6503) < 0.01, f"Longitude {lon_val} should match Tokyo (~139.6503)"

        # Verify Auto-Geocoded badge appears
        assert page.locator("text=Auto-Geocoded").is_visible(), "Auto-Geocoded indicator should be visible"

        # 2. Test another city with keyboard navigation (e.g. Paris)
        city_input.fill("")
        city_input.press_sequentially("Pari", delay=50)
        page.wait_for_timeout(300)
        assert dropdown.is_visible(), "Suggestions should appear for Pari"

        # Press ArrowDown then Enter
        city_input.press("ArrowDown")
        page.wait_for_timeout(100)
        city_input.press("Enter")
        page.wait_for_timeout(200)

        assert city_input.input_value() == "Paris", "City should be Paris after keyboard select"
        assert country_input.input_value() == "France", "Country should be France"
        lat_paris = float(lat_input.input_value())
        assert abs(lat_paris - 48.8566) < 0.01, f"Paris latitude {lat_paris} should be ~48.8566"

        # 3. Test manual override
        lat_input.fill("48.1234")
        page.wait_for_timeout(100)
        assert page.get_by_text("Manual", exact=True).is_visible(), "Manual badge should appear when user edits coordinates"

        # Verify calculate button executes with resolved coordinates
        calc_btn = page.locator("button:has-text('Compute, Verify & Synthesize Chart')").first
        calc_btn.click()
        page.wait_for_timeout(800)

        # Assert no layout overflow
        assert check_no_horizontal_overflow(page), "No horizontal overflow after geocoding selection"

        # Assert zero critical console errors
        assert_no_critical_errors(page)
        save_screenshot(page, "geocoding_intelligence_verified")
        browser.close()


def test_ui_detect_gps_populates_coordinates_city_and_country():
    """Verify that clicking Detect GPS populates coordinates, city, and country."""
    with sync_playwright() as pw:
        browser = _launch_browser(pw)
        # Grant geolocation permission and mock geolocation (San Francisco: 37.7749, -122.4194)
        context = browser.new_context(
            viewport={"width": 1280, "height": 900},
            permissions=["geolocation"],
            geolocation={"latitude": 37.7749, "longitude": -122.4194},
        )
        page = context.new_page()

        page._console_errors = []
        page.on("console", lambda msg: page._console_errors.append(msg.text) if msg.type == "error" else None)
        page.on("pageerror", lambda err: page._console_errors.append(str(err)))

        page.goto("http://127.0.0.1:5173", wait_until="domcontentloaded")
        page.wait_for_selector("text=Synodix", timeout=10000)

        city_input = page.locator("input#city_name")
        country_input = page.locator("input#country_name")
        lat_input = page.locator("input#latitude")
        lon_input = page.locator("input#longitude")

        # Clear inputs to prove GPS populates them
        city_input.fill("")
        country_input.fill("")
        lat_input.fill("0")
        lon_input.fill("0")

        # Click "Detect GPS" button
        gps_btn = page.locator("button[aria-label='Detect GPS coordinates']")
        assert gps_btn.is_visible(), "Detect GPS button must be visible"
        gps_btn.click()

        # Wait for GPS detection and reverse geocoding to complete
        page.wait_for_function("() => document.querySelector('input#latitude') && document.querySelector('input#latitude').value !== '0'", timeout=6000)

        # Assert coordinates are populated
        lat_val = float(lat_input.input_value())
        lon_val = float(lon_input.input_value())
        assert abs(lat_val - 37.7749) < 0.01, f"Latitude {lat_val} should match 37.7749"
        assert abs(lon_val - (-122.4194)) < 0.01, f"Longitude {lon_val} should match -122.4194"

        # Assert city and country are populated
        city_val = city_input.input_value()
        country_val = country_input.input_value()
        assert city_val != "", "City must be populated by Detect GPS"
        assert country_val != "", "Country must be populated by Detect GPS"
        assert "San Francisco" in city_val or "Francisco" in city_val, f"Expected San Francisco, got {city_val}"
        assert "United States" in country_val or "USA" in country_val, f"Expected United States/USA, got {country_val}"

        # Assert zero critical console errors
        assert_no_critical_errors(page)
        save_screenshot(page, "detect_gps_city_country_verified")
        browser.close()


def test_ui_detect_gps_updates_existing_preset_values():
    """Verify that clicking Detect GPS replaces existing preset values with new coordinates and city/country."""
    with sync_playwright() as pw:
        browser = _launch_browser(pw)
        # Mock geolocation to Tokyo (35.6762, 139.6503)
        context = browser.new_context(
            viewport={"width": 1280, "height": 900},
            permissions=["geolocation"],
            geolocation={"latitude": 35.6762, "longitude": 139.6503},
        )
        page = context.new_page()

        page._console_errors = []
        page.on("console", lambda msg: page._console_errors.append(msg.text) if msg.type == "error" else None)
        page.on("pageerror", lambda err: page._console_errors.append(str(err)))

        page.goto("http://127.0.0.1:5173", wait_until="domcontentloaded")
        page.wait_for_selector("text=Synodix", timeout=10000)

        city_input = page.locator("input#city_name")
        country_input = page.locator("input#country_name")
        lat_input = page.locator("input#latitude")
        lon_input = page.locator("input#longitude")

        # Keep initial default preset (San Francisco, US)
        assert city_input.input_value() == "San Francisco"

        # Click Detect GPS
        gps_btn = page.locator("button[aria-label='Detect GPS coordinates']")
        gps_btn.click()
        page.wait_for_function("() => document.querySelector('input#city_name') && document.querySelector('input#city_name').value !== 'San Francisco'", timeout=6000)

        # Assert city and country were updated from San Francisco to Tokyo / Suginami / Japan
        city_val = city_input.input_value()
        country_val = country_input.input_value()
        assert "Tokyo" in city_val or "Suginami" in city_val or "Japan" in country_val, f"City should update, got {city_val}"
        assert "Japan" in country_val, f"Country should update to Japan, got {country_val}"
        assert abs(float(lat_input.input_value()) - 35.6762) < 0.05
        assert abs(float(lon_input.input_value()) - 139.6503) < 0.05

        assert_no_critical_errors(page)
        browser.close()


def test_ui_detect_gps_fallback_when_geolocation_denied():
    """Verify that when HTML5 Geolocation is denied/unavailable on desktop, Detect GPS gracefully falls back to IP location."""
    with sync_playwright() as pw:
        browser = _launch_browser(pw)
        # Context without geolocation permission (denied/unsupported)
        context = browser.new_context(
            viewport={"width": 1280, "height": 900},
            permissions=[],
        )
        page = context.new_page()

        page._console_errors = []
        page.on("console", lambda msg: page._console_errors.append(msg.text) if msg.type == "error" else None)
        page.on("pageerror", lambda err: page._console_errors.append(str(err)))

        page.goto("http://127.0.0.1:5173", wait_until="domcontentloaded")
        page.wait_for_selector("text=Synodix", timeout=10000)

        city_input = page.locator("input#city_name")
        country_input = page.locator("input#country_name")
        lat_input = page.locator("input#latitude")
        lon_input = page.locator("input#longitude")

        # Clear to test fallback population
        city_input.fill("")
        country_input.fill("")
        lat_input.fill("0")
        lon_input.fill("0")

        # Click Detect GPS
        gps_btn = page.locator("button[aria-label='Detect GPS coordinates']")
        gps_btn.click()

        # Wait for IP location fallback
        page.wait_for_timeout(1500)

        # Verify coordinates and city/country were populated via fallback
        assert lat_input.input_value() != "0", "Latitude should be populated by IP fallback"
        assert lon_input.input_value() != "0", "Longitude should be populated by IP fallback"
        assert city_input.input_value() != "", "City should be populated by IP fallback"
        assert country_input.input_value() != "", "Country should be populated by IP fallback"

        assert_no_critical_errors(page)
        browser.close()


def test_ui_city_selector_finds_jamshedpur_and_gurugram():
    """Verify that city selector reliably discovers Jamshedpur and Gurugram, populating coordinates and India."""
    with sync_playwright() as pw:
        browser = _launch_browser(pw)
        context = browser.new_context(viewport={"width": 1280, "height": 900})
        page = context.new_page()

        page._console_errors = []
        page.on("console", lambda msg: page._console_errors.append(msg.text) if msg.type == "error" else None)
        page.on("pageerror", lambda err: page._console_errors.append(str(err)))

        page.goto("http://127.0.0.1:5173", wait_until="domcontentloaded")
        page.wait_for_selector("text=Synodix", timeout=10000)

        city_input = page.locator("input#city_name")
        country_input = page.locator("input#country_name")
        lat_input = page.locator("input#latitude")
        lon_input = page.locator("input#longitude")

        # 1. Test searching "Jamshed"
        city_input.click()
        city_input.fill("")
        page.wait_for_timeout(200)
        city_input.press_sequentially("Jamshed", delay=50)
        page.wait_for_timeout(400)

        dropdown = page.locator("div[role='listbox']")
        dropdown.wait_for(state="visible", timeout=8000)
        assert dropdown.is_visible(), "Dropdown listbox should be visible for Jamshed"

        jamshedpur_opt = page.locator("div[role='option']:has-text('Jamshedpur')").first
        jamshedpur_opt.wait_for(state="visible", timeout=8000)
        assert jamshedpur_opt.is_visible(), "Jamshedpur option must be present in suggestion dropdown"
        jamshedpur_opt.click()
        page.wait_for_timeout(300)

        assert city_input.input_value() == "Jamshedpur"
        assert country_input.input_value() == "India"
        assert abs(float(lat_input.input_value()) - 22.8015) < 0.1
        assert abs(float(lon_input.input_value()) - 86.2030) < 0.1

        # 2. Test searching "Guru"
        city_input.click()
        city_input.fill("")
        page.wait_for_timeout(300)
        city_input.press_sequentially("Guru", delay=50)
        page.wait_for_timeout(400)
        dropdown.wait_for(state="visible", timeout=8000)
        assert dropdown.is_visible(), "Dropdown listbox should be visible for Guru"
        gurugram_opt = page.locator("div[role='option']:has-text('Gurugram')").first
        gurugram_opt.wait_for(state="visible", timeout=8000)
        assert gurugram_opt.is_visible(), "Gurugram option must be present in suggestion dropdown"
        gurugram_opt.click()
        page.wait_for_timeout(300)

        assert city_input.input_value() == "Gurugram"
        assert country_input.input_value() == "India"
        assert abs(float(lat_input.input_value()) - 28.4595) < 0.1
        assert abs(float(lon_input.input_value()) - 77.0266) < 0.1

        # 3. Test typing and blur auto-resolution
        city_input.click()
        city_input.fill("")
        country_input.fill("United States") # simulate stale country from preset
        lat_input.fill("0")
        lon_input.fill("0")
        city_input.click()
        city_input.press_sequentially("Jamshedpur", delay=50)
        page.wait_for_timeout(500)
        # Blur the input by dispatching blur and clicking birth_date input
        city_input.evaluate("el => el.blur()")
        page.locator("input#birth_date").click()
        page.wait_for_function("() => document.querySelector('input#country_name')?.value === 'India'", timeout=15000)

        # Country should automatically resolve to India and lat/lon updated
        assert country_input.input_value() == "India", f"Country should auto-resolve to India on blur, got {country_input.input_value()}"
        assert abs(float(lat_input.input_value()) - 22.8015) < 0.1
        assert abs(float(lon_input.input_value()) - 86.2030) < 0.1

        assert_no_critical_errors(page)
        browser.close()

