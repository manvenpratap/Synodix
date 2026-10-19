"""
Verification report generator and invariant auditor.
Follows Step 5 of Six-Culture Verified Chart specification.
"""

from typing import Dict, Any, List

def build_verification_report(
    astro_base: Dict[str, Any],
    jyotisha_chart: Dict[str, Any],
    bazi_chart: Dict[str, Any],
    western_chart: Dict[str, Any],
    ziwei_chart: Dict[str, Any],
    mayan_chart: Dict[str, Any],
    tibetan_chart: Dict[str, Any],
    time_audit: Dict[str, Any]
) -> Dict[str, Any]:
    invariants = []
    
    # Invariant 1: Rahu-Ketu separation
    rahu_lon = astro_base["planets_sidereal"]["Rahu"]["longitude"]
    ketu_lon = astro_base["planets_sidereal"]["Ketu"]["longitude"]
    diff_rk = abs(rahu_lon - ketu_lon)
    if diff_rk > 180: diff_rk = 360 - diff_rk
    rk_passes = abs(diff_rk - 180.0) < 0.001
    invariants.append({
        "system": "Jyotisha / Astronomical Base",
        "description": "Rahu–Ketu nodal separation equals 180.0°",
        "expected": "180.0°",
        "actual": f"{diff_rk:.4f}°",
        "status": "PASS" if rk_passes else "FAIL"
    })

    # Invariant 2: Vimshottari full-cycle years
    v_years = jyotisha_chart["invariants"]["vimshottari_full_cycle_years"]
    v_passes = (v_years == 120)
    invariants.append({
        "system": "Jyotisha",
        "description": "Vimshottari Dasha full-cycle lord years total exactly 120",
        "expected": 120,
        "actual": v_years,
        "status": "PASS" if v_passes else "FAIL"
    })

    # Invariant 3: Zi Wei 12 unique palaces
    zw_valid = ziwei_chart["invariants"]["is_valid_12_palaces"]
    invariants.append({
        "system": "Zi Wei Dou Shu",
        "description": "Zi Wei chart contains exactly 12 unique Earthly Branch palaces",
        "expected": "12 unique palaces",
        "actual": f"{ziwei_chart['invariants']['unique_palaces_count']} palaces",
        "status": "PASS" if zw_valid else "FAIL"
    })

    # Invariant 4: Maya calendar round-trip exactness
    maya_rt = mayan_chart["round_trip_verification"]["passes_invariant"]
    invariants.append({
        "system": "Maya Calendar",
        "description": "Long Count round-trip to source Gregorian civil date is exact",
        "expected": mayan_chart["round_trip_verification"]["source_date"],
        "actual": mayan_chart["round_trip_verification"]["recovered_date"],
        "status": "PASS" if maya_rt else "FAIL"
    })

    # Invariant 5: Dual-engine astronomical verification (Swiss Ephemeris vs Skyfield JPL DE421)
    diffs = astro_base["verification_diffs"]
    max_diff = max((d.get("difference_deg", 0.0) for d in diffs if "difference_deg" in d), default=0.0)
    has_alert = astro_base["has_validator_alert"]
    invariants.append({
        "system": "Astronomical Ephemeris",
        "description": "Swiss Ephemeris vs Skyfield JPL DE421 planetary difference within 0.01° threshold",
        "expected": "<= 0.0100°",
        "actual": f"Max diff = {max_diff:.6f}° ({max_diff * 3600.0:.2f} arcsec)",
        "status": "PASS" if (not has_alert and max_diff <= 0.01) else "ALERT"
    })

    # Confidence grading
    overall_confidence = "HIGH"
    if has_alert or not all(inv["status"] == "PASS" for inv in invariants):
        overall_confidence = "LOW"
    elif time_audit.get("boundary_audit", {}).get("is_asc_boundary_sensitive", False):
        overall_confidence = "MEDIUM"

    all_pass = all(inv["status"] == "PASS" for inv in invariants)

    return {
        "overall_verification_status": "PASS" if all_pass else "ALERT",
        "overall_confidence": overall_confidence,
        "dual_engine_diffs": diffs,
        "max_planetary_difference_deg": round(max_diff, 6),
        "invariants": invariants,
        "time_boundary_sensitivity": {
            "ascendant_near_cusp": astro_base["boundary_distances"]["is_asc_boundary_sensitive"],
            "asc_cusp_distance_deg": astro_base["boundary_distances"]["tropical_asc_to_cusp_deg"],
            "bazi_two_hour_boundary_mins": time_audit.get("boundary_audit", {}).get("bazi_two_hour_boundary_distance_mins", 0),
        }
    }
