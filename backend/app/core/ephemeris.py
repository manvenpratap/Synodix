"""
Dual-engine astronomical calculation and independent verification module.
Uses Swiss Ephemeris (pyswisseph) as primary engine and Skyfield (JPL DE421) as independent validator.
Follows Step 4A and Step 5 of Six-Culture Verified Chart specification.
"""

from typing import Dict, Any, List, Tuple
import os
import math
import swisseph as swe
from skyfield.api import load
from skyfield.framelib import ecliptic_frame

# Planet mappings
PLANET_IDS = {
    "Sun": swe.SUN,
    "Moon": swe.MOON,
    "Mercury": swe.MERCURY,
    "Venus": swe.VENUS,
    "Mars": swe.MARS,
    "Jupiter": swe.JUPITER,
    "Saturn": swe.SATURN,
    "Uranus": swe.URANUS,
    "Neptune": swe.NEPTUNE,
    "Pluto": swe.PLUTO,
}

SKYFIELD_TARGETS = {
    "Sun": "sun",
    "Moon": "moon",
    "Mercury": "mercury",
    "Venus": "venus",
    "Mars": "mars",
    "Jupiter": "jupiter barycenter",
    "Saturn": "saturn barycenter",
    "Uranus": "uranus barycenter",
    "Neptune": "neptune barycenter",
    "Pluto": "pluto barycenter",
}

# Cache Skyfield ephemeris and timescale
_ts = None
_eph = None

def get_skyfield_objects():
    global _ts, _eph
    if _ts is None or _eph is None:
        _ts = load.timescale()
        # Look for de421.bsp in current dir or download path
        bsp_path = "de421.bsp"
        if not os.path.exists(bsp_path):
            # check root or study dir
            alt_path = os.path.join(os.path.dirname(__file__), "..", "..", "..", "de421.bsp")
            if os.path.exists(alt_path):
                bsp_path = alt_path
        _eph = load(bsp_path)
    return _ts, _eph

ZODIAC_SIGNS = [
    "Aries", "Taurus", "Gemini", "Cancer",
    "Leo", "Virgo", "Libra", "Scorpio",
    "Sagittarius", "Capricorn", "Aquarius", "Pisces"
]

def deg_to_sign_degree(lon: float) -> Tuple[str, float, int]:
    """Convert longitude (0..360) to (sign_name, degree_in_sign, sign_index_0_based)"""
    lon = lon % 360.0
    sign_idx = int(lon // 30)
    deg_in_sign = lon % 30.0
    return ZODIAC_SIGNS[sign_idx], deg_in_sign, sign_idx

def compute_astronomical_base(
    jd_ut: float,
    latitude: float,
    longitude: float,
    has_birth_time: bool = True
) -> Dict[str, Any]:
    swe.set_ephe_path("")
    
    # 1. Angles and Cusps (Swiss Ephemeris)
    # Whole sign system 'W', or Placidus 'P'
    asc_deg = 0.0
    mc_deg = 0.0
    houses_tropical = []
    
    if has_birth_time:
        # Whole sign houses
        cusps, ascmc = swe.houses(jd_ut, latitude, longitude, b'W')
        asc_deg = ascmc[0] % 360.0
        mc_deg = ascmc[1] % 360.0
        houses_tropical = [c % 360.0 for c in cusps]
    else:
        # Default zeroed when time unavailable
        asc_deg = 0.0
        mc_deg = 0.0
        houses_tropical = [i * 30.0 for i in range(12)]

    # 2. Lahiri Ayanamsha for Sidereal positions
    swe.set_sid_mode(swe.SIDM_LAHIRI)
    ayanamsha_deg = swe.get_ayanamsa_ut(jd_ut)

    # Sidereal Ascendant
    asc_sidereal = (asc_deg - ayanamsha_deg) % 360.0
    mc_sidereal = (mc_deg - ayanamsha_deg) % 360.0

    # 3. Calculate Planets in Tropical & Sidereal via Swiss Ephemeris
    planets_tropical = {}
    planets_sidereal = {}
    
    for name, pid in PLANET_IDS.items():
        # Tropical
        res_trop, _ = swe.calc_ut(jd_ut, pid, swe.FLG_SWIEPH | swe.FLG_SPEED)
        lon_trop = res_trop[0] % 360.0
        lat_trop = res_trop[1]
        dist_trop = res_trop[2]
        speed_trop = res_trop[3]
        
        sign_t, deg_t, s_idx_t = deg_to_sign_degree(lon_trop)
        planets_tropical[name] = {
            "longitude": lon_trop,
            "latitude": lat_trop,
            "distance_au": dist_trop,
            "speed": speed_trop,
            "is_retrograde": speed_trop < 0,
            "sign": sign_t,
            "sign_index": s_idx_t,
            "degree_in_sign": deg_t
        }

        # Sidereal
        res_sid, _ = swe.calc_ut(jd_ut, pid, swe.FLG_SWIEPH | swe.FLG_SIDEREAL | swe.FLG_SPEED)
        lon_sid = res_sid[0] % 360.0
        lat_sid = res_sid[1]
        dist_sid = res_sid[2]
        speed_sid = res_sid[3]
        
        sign_s, deg_s, s_idx_s = deg_to_sign_degree(lon_sid)
        planets_sidereal[name] = {
            "longitude": lon_sid,
            "latitude": lat_sid,
            "distance_au": dist_sid,
            "speed": speed_sid,
            "is_retrograde": speed_sid < 0,
            "sign": sign_s,
            "sign_index": s_idx_s,
            "degree_in_sign": deg_s
        }

    # 4. Lunar Nodes: True Node (Rahu) and Ketu = Rahu + 180°
    # Tropical Nodes
    res_node_trop, _ = swe.calc_ut(jd_ut, swe.TRUE_NODE, swe.FLG_SWIEPH | swe.FLG_SPEED)
    rahu_lon_trop = res_node_trop[0] % 360.0
    ketu_lon_trop = (rahu_lon_trop + 180.0) % 360.0
    r_sign_t, r_deg_t, r_idx_t = deg_to_sign_degree(rahu_lon_trop)
    k_sign_t, k_deg_t, k_idx_t = deg_to_sign_degree(ketu_lon_trop)
    
    planets_tropical["Rahu"] = {
        "longitude": rahu_lon_trop,
        "latitude": 0.0,
        "distance_au": 0.0,
        "speed": res_node_trop[3],
        "is_retrograde": True,
        "sign": r_sign_t,
        "sign_index": r_idx_t,
        "degree_in_sign": r_deg_t
    }
    planets_tropical["Ketu"] = {
        "longitude": ketu_lon_trop,
        "latitude": 0.0,
        "distance_au": 0.0,
        "speed": res_node_trop[3],
        "is_retrograde": True,
        "sign": k_sign_t,
        "sign_index": k_idx_t,
        "degree_in_sign": k_deg_t
    }

    # Sidereal Nodes
    rahu_lon_sid = (rahu_lon_trop - ayanamsha_deg) % 360.0
    ketu_lon_sid = (ketu_lon_trop - ayanamsha_deg) % 360.0
    r_sign_s, r_deg_s, r_idx_s = deg_to_sign_degree(rahu_lon_sid)
    k_sign_s, k_deg_s, k_idx_s = deg_to_sign_degree(ketu_lon_sid)

    planets_sidereal["Rahu"] = {
        "longitude": rahu_lon_sid,
        "latitude": 0.0,
        "distance_au": 0.0,
        "speed": res_node_trop[3],
        "is_retrograde": True,
        "sign": r_sign_s,
        "sign_index": r_idx_s,
        "degree_in_sign": r_deg_s
    }
    planets_sidereal["Ketu"] = {
        "longitude": ketu_lon_sid,
        "latitude": 0.0,
        "distance_au": 0.0,
        "speed": res_node_trop[3],
        "is_retrograde": True,
        "sign": k_sign_s,
        "sign_index": k_idx_s,
        "degree_in_sign": k_deg_s
    }

    # 5. Independent Validator: Skyfield (JPL DE421)
    # Compare planetary longitudes
    verification_diffs = []
    has_validator_alert = False
    
    try:
        ts, eph = get_skyfield_objects()
        earth = eph['earth']
        t = ts.ut1_jd(jd_ut)
        
        for name, target_key in SKYFIELD_TARGETS.items():
            swe_val = planets_tropical[name]["longitude"]
            target = eph[target_key]
            apparent = earth.at(t).observe(target).apparent()
            _, lon_sky, _ = apparent.frame_latlon(ecliptic_frame)
            sky_val = lon_sky.degrees % 360.0
            
            diff = abs(sky_val - swe_val)
            if diff > 180.0:
                diff = 360.0 - diff
                
            status = "pass"
            if diff > 0.01:
                status = "alert"
                has_validator_alert = True
                
            verification_diffs.append({
                "body": name,
                "primary_engine": "Swiss Ephemeris (pyswisseph)",
                "primary_value_deg": round(swe_val, 6),
                "validator": "Skyfield (JPL DE421)",
                "validator_value_deg": round(sky_val, 6),
                "difference_deg": round(diff, 6),
                "difference_arcsec": round(diff * 3600.0, 2),
                "tolerance_deg": 0.01,
                "status": status,
                "confidence": "high" if status == "pass" else "low"
            })
    except Exception as e:
        verification_diffs.append({
            "error": f"Skyfield validator encounter: {str(e)}",
            "status": "unavailable"
        })

    # 6. Boundary Distances (Ascendant and Cusps)
    asc_sign_t, asc_deg_in_sign, asc_idx_t = deg_to_sign_degree(asc_deg)
    dist_to_asc_cusp = min(asc_deg_in_sign, 30.0 - asc_deg_in_sign)
    
    # Sidereal Ascendant cusp distance
    asc_sign_s, asc_sid_deg_in_sign, asc_idx_s = deg_to_sign_degree(asc_sidereal)
    dist_to_sid_asc_cusp = min(asc_sid_deg_in_sign, 30.0 - asc_sid_deg_in_sign)

    # Navamsha span is 3°20' (3.333333°)
    deg_in_navamsha = asc_sid_deg_in_sign % (30.0 / 9.0)
    dist_to_navamsha_cusp = min(deg_in_navamsha, (30.0 / 9.0) - deg_in_navamsha)

    return {
        "jd_ut": jd_ut,
        "ayanamsha": {
            "name": "Lahiri (Chitra Paksha)",
            "degrees": ayanamsha_deg
        },
        "angles": {
            "tropical": {
                "ascendant": asc_deg,
                "ascendant_sign": asc_sign_t,
                "ascendant_degree": asc_deg_in_sign,
                "mc": mc_deg,
            },
            "sidereal": {
                "ascendant": asc_sidereal,
                "ascendant_sign": asc_sign_s,
                "ascendant_degree": asc_sid_deg_in_sign,
                "mc": mc_sidereal,
            }
        },
        "houses_tropical": houses_tropical,
        "planets_tropical": planets_tropical,
        "planets_sidereal": planets_sidereal,
        "boundary_distances": {
            "tropical_asc_to_cusp_deg": round(dist_to_asc_cusp, 4),
            "sidereal_asc_to_cusp_deg": round(dist_to_sid_asc_cusp, 4),
            "sidereal_asc_to_navamsha_cusp_deg": round(dist_to_navamsha_cusp, 4),
            "is_asc_boundary_sensitive": dist_to_asc_cusp < 1.0 or dist_to_navamsha_cusp < 0.2,
        },
        "verification_diffs": verification_diffs,
        "has_validator_alert": has_validator_alert,
    }
