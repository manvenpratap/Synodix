"""
Integration and regression tests for Synodix Triangulation Engine.
Uses standard library urllib / direct app imports for zero-dependency reliability.
"""

import json
import urllib.request
import urllib.error
import pytest

from backend.app.main import BirthInputRequest, health_check, get_sample_charts, compute_chart_endpoint


@pytest.mark.smoke
def test_api_health_endpoint():
    """Verify health endpoint returns healthy status and engine metadata."""
    try:
        req = urllib.request.urlopen("http://127.0.0.1:8000/api/health", timeout=3)
        data = json.loads(req.read().decode())
    except (urllib.error.URLError, ConnectionError):
        # Fallback to direct app function call
        data = health_check()

    assert data.get("status") == "healthy"
    assert "primary_astronomy" in data
    assert "independent_validator" in data
    assert data.get("total_sample_profiles", 0) >= 10


@pytest.mark.smoke
def test_api_sample_charts_list():
    """Verify sample charts can be retrieved and contain required fields."""
    try:
        req = urllib.request.urlopen("http://127.0.0.1:8000/api/sample-charts", timeout=3)
        charts = json.loads(req.read().decode())
    except (urllib.error.URLError, ConnectionError):
        charts = get_sample_charts()

    assert isinstance(charts, list)
    assert len(charts) >= 10
    first = charts[0]
    assert "id" in first
    assert "name" in first
    assert "birth_date" in first
    assert "birth_time" in first


def test_deterministic_chart_computation():
    """Verify end-to-end multi-cultural calculation pipeline with Steve Jobs birth data."""
    payload = {
        "birth_date": "1955-02-24",
        "birth_time": "19:15",
        "latitude": 37.7749,
        "longitude": -122.4194,
        "time_certainty": "exact",
        "city_name": "San Francisco",
        "country_name": "USA",
        "gender": "male"
    }
    
    try:
        data_bytes = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(
            "http://127.0.0.1:8000/api/compute-chart",
            data=data_bytes,
            headers={"Content-Type": "application/json"}
        )
        resp = urllib.request.urlopen(req, timeout=10)
        res = json.loads(resp.read().decode())
    except (urllib.error.URLError, ConnectionError):
        birth_req = BirthInputRequest(**payload)
        res = compute_chart_endpoint(birth_req)

    # Invariants
    assert "birth_input_audit" in res
    assert "uncertainty_classification" in res
    assert "astronomical_base" in res
    assert "traditions" in res
    assert "verification_report" in res
    assert "synthesis" in res

    # Traditions count
    traditions = res["traditions"]
    assert "jyotisha" in traditions
    assert "western" in traditions
    assert "bazi" in traditions
    assert "ziwei" in traditions
    assert "mayan" in traditions
    assert "tibetan" in traditions

    # Dual-engine verification check
    verif = res["verification_report"]
    assert verif.get("overall_verification_status") in ("PASS", "ACCEPTABLE")
