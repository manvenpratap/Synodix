"""
Dual-engine astronomical calculation and independent verification module.
Uses Swiss Ephemeris (pyswisseph) as primary engine and Skyfield (JPL DE421) as independent validator.
Supports configurable house systems (Placidus, Whole Sign, Regiomontanus, Koch, Equal, Campanus),
minor bodies & asteroids (Chiron, Lilith, Ceres, Pallas, Juno, Vesta),
and 17 Major Royal and Behenian Fixed Stars.
Follows Step 4A and Step 5 of Synodix Verified Chart specification.
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

# Minor bodies and asteroids
MINOR_BODY_IDS = {
    "Chiron": (swe.CHIRON, "centaur"),
    "Lilith_Mean": (swe.MEAN_APOG, "lunar_apogee"),
    "Lilith_True": (swe.OSCU_APOG, "lunar_apogee"),
    "Ceres": (swe.AST_OFFSET + 1, "asteroid"),
    "Pallas": (swe.AST_OFFSET + 2, "asteroid"),
    "Juno": (swe.AST_OFFSET + 3, "asteroid"),
    "Vesta": (swe.AST_OFFSET + 4, "asteroid"),
}

# 17 Major Royal and Behenian Fixed Stars
FIXED_STARS_CATALOG = [
    ("Sirius", "Alpha Canis Majoris", "Spiritual illumination, prominent leadership, supreme vitality"),
    ("Canopus", "Alpha Carinae", "Navigation, cosmic wisdom, pathfinding"),
    ("Arcturus", "Alpha Boötis", "Guardian of the bear, righteous leadership, wealth through exploration"),
    ("Vega", "Alpha Lyrae", "Artistic refinement, musical genius, charismatic authority"),
    ("Capella", "Alpha Aurigae", "Civic honor, martial agility, love of learning"),
    ("Rigel", "Beta Orionis", "Inventor mind, educational and technological prowess"),
    ("Procyon", "Alpha Canis Minoris", "Rapid ascent, sudden activity, resourcefulness"),
    ("Betelgeuse", "Alpha Orionis", "Martial success, brilliance, lightning fame"),
    ("Aldebaran", "Alpha Tauri (Royal Star)", "Archangel Michael, integrity, military and commercial greatness"),
    ("Spica", "Alpha Virginis", "Unmerited grace, artistic brilliance, scholarly honors"),
    ("Antares", "Alpha Scorpii (Royal Star)", "Archangel Uriel, strategic intensity, relentless courage"),
    ("Fomalhaut", "Alpha Piscis Austrini (Royal Star)", "Archangel Gabriel, mystical vision, visionary synthesis"),
    ("Deneb", "Alpha Cygni", "Sharp intellect, scientific acumen, transcendent flight"),
    ("Regulus", "Alpha Leonis (Royal Star)", "Archangel Raphael, kingly nobility, supreme public acclaim"),
    ("Algol", "Beta Persei", "Gorgon head, intense chthonic power, crisis transmutation"),
    ("Altair", "Alpha Aquilae", "Indomitable boldness, swift execution, soaring ambition"),
    ("Alcyone", "Eta Tauri (Central Pleiad)", "Mystic sight, collective unconscious memory, profound feeling"),
]

# House systems mapping
HOUSE_SYSTEMS = {
    "P": ("Placidus", b'P'),
    "PLACIDUS": ("Placidus", b'P'),
    "W": ("Whole Sign", b'W'),
    "WHOLE_SIGN": ("Whole Sign", b'W'),
    "WHOLESIGN": ("Whole Sign", b'W'),
    "R": ("Regiomontanus", b'R'),
    "REGIOMONTANUS": ("Regiomontanus", b'R'),
    "K": ("Koch", b'K'),
    "KOCH": ("Koch", b'K'),
    "E": ("Equal", b'E'),
    "EQUAL": ("Equal", b'E'),
    "C": ("Campanus", b'C'),
    "CAMPANUS": ("Campanus", b'C'),
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
        bsp_path = "de421.bsp"
        if not os.path.exists(bsp_path):
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
    has_birth_time: bool = True,
    house_system: str = "Placidus"
) -> Dict[str, Any]:
    # Configure Swiss Ephemeris data path
    ephe_path = os.path.join(os.path.dirname(__file__), "..", "..", "ephe")
    if os.path.exists(ephe_path):
        swe.set_ephe_path(ephe_path)
    else:
        swe.set_ephe_path("")
    
    # 1. Angles and Cusps (Swiss Ephemeris)
    hsys_key = house_system.strip().upper() if house_system else "PLACIDUS"
    hsys_name, hsys_code = HOUSE_SYSTEMS.get(hsys_key, ("Placidus", b'P'))

    asc_deg = 0.0
    mc_deg = 0.0
    vertex_deg = 0.0
    eq_asc_deg = 0.0
    houses_cusps = []
    houses_whole_sign = []
    
    if has_birth_time:
        # Selected house system (default Placidus)
        cusps, ascmc = swe.houses(jd_ut, latitude, longitude, hsys_code)
        asc_deg = ascmc[0] % 360.0
        mc_deg = ascmc[1] % 360.0
        vertex_deg = ascmc[3] % 360.0
        eq_asc_deg = ascmc[4] % 360.0
        houses_cusps = [c % 360.0 for c in cusps]

        # Whole-sign houses for traditions requiring whole sign (Vedic/Hellenistic)
        cusps_ws, _ = swe.houses(jd_ut, latitude, longitude, b'W')
        houses_whole_sign = [c % 360.0 for c in cusps_ws]
    else:
        # Default zeroed when time unavailable
        asc_deg = 0.0
        mc_deg = 0.0
        houses_cusps = [i * 30.0 for i in range(12)]
        houses_whole_sign = [i * 30.0 for i in range(12)]

    houses_tropical = houses_cusps

    # 2. Lahiri Ayanamsha for Sidereal positions
    swe.set_sid_mode(swe.SIDM_LAHIRI)
    ayanamsha_deg = swe.get_ayanamsa_ut(jd_ut)

    # Sidereal Ascendant and MC
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
            "degree_in_sign": deg_t,
            "category": "planet"
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
            "degree_in_sign": deg_s,
            "category": "planet"
        }

    # 4. Lunar Nodes: True Node (Rahu) and Ketu = Rahu + 180°
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
        "degree_in_sign": r_deg_t,
        "category": "lunar_node"
    }
    planets_tropical["Ketu"] = {
        "longitude": ketu_lon_trop,
        "latitude": 0.0,
        "distance_au": 0.0,
        "speed": res_node_trop[3],
        "is_retrograde": True,
        "sign": k_sign_t,
        "sign_index": k_idx_t,
        "degree_in_sign": k_deg_t,
        "category": "lunar_node"
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
        "degree_in_sign": r_deg_s,
        "category": "lunar_node"
    }
    planets_sidereal["Ketu"] = {
        "longitude": ketu_lon_sid,
        "latitude": 0.0,
        "distance_au": 0.0,
        "speed": res_node_trop[3],
        "is_retrograde": True,
        "sign": k_sign_s,
        "sign_index": k_idx_s,
        "degree_in_sign": k_deg_s,
        "category": "lunar_node"
    }

    # 5. Minor Bodies & Asteroids (Chiron, Lilith, Ceres, Pallas, Juno, Vesta)
    minor_bodies_tropical = {}
    minor_bodies_sidereal = {}
    for mb_name, (mb_id, mb_category) in MINOR_BODY_IDS.items():
        try:
            res_t, _ = swe.calc_ut(jd_ut, mb_id, swe.FLG_SWIEPH | swe.FLG_SPEED)
            lon_t = res_t[0] % 360.0
            sign_t, deg_t, s_idx_t = deg_to_sign_degree(lon_t)
            minor_bodies_tropical[mb_name] = {
                "name": mb_name,
                "category": mb_category,
                "longitude": lon_t,
                "latitude": res_t[1],
                "distance_au": res_t[2],
                "speed": res_t[3],
                "is_retrograde": res_t[3] < 0,
                "sign": sign_t,
                "sign_index": s_idx_t,
                "degree_in_sign": deg_t
            }

            res_s, _ = swe.calc_ut(jd_ut, mb_id, swe.FLG_SWIEPH | swe.FLG_SIDEREAL | swe.FLG_SPEED)
            lon_s = res_s[0] % 360.0
            sign_s, deg_s, s_idx_s = deg_to_sign_degree(lon_s)
            minor_bodies_sidereal[mb_name] = {
                "name": mb_name,
                "category": mb_category,
                "longitude": lon_s,
                "latitude": res_s[1],
                "distance_au": res_s[2],
                "speed": res_s[3],
                "is_retrograde": res_s[3] < 0,
                "sign": sign_s,
                "sign_index": s_idx_s,
                "degree_in_sign": deg_s
            }
        except Exception:
            pass

    # 6. Major Royal and Behenian Fixed Stars
    fixed_stars = []
    fixed_star_conjunctions = []
    
    check_targets = {
        "Sun": planets_tropical.get("Sun", {}).get("longitude"),
        "Moon": planets_tropical.get("Moon", {}).get("longitude"),
        "Ascendant": asc_deg if has_birth_time else None,
        "Midheaven": mc_deg if has_birth_time else None,
        "Mercury": planets_tropical.get("Mercury", {}).get("longitude"),
        "Venus": planets_tropical.get("Venus", {}).get("longitude"),
        "Mars": planets_tropical.get("Mars", {}).get("longitude"),
        "Jupiter": planets_tropical.get("Jupiter", {}).get("longitude"),
        "Saturn": planets_tropical.get("Saturn", {}).get("longitude"),
    }

    for s_name, s_nom, s_theme in FIXED_STARS_CATALOG:
        try:
            star_res = swe.fixstar_ut(s_name, jd_ut)[0]
            s_lon_t = star_res[0] % 360.0
            s_sign_t, s_deg_t, s_idx_t = deg_to_sign_degree(s_lon_t)
            s_lon_s = (s_lon_t - ayanamsha_deg) % 360.0
            s_sign_s, s_deg_s, s_idx_s = deg_to_sign_degree(s_lon_s)

            star_record = {
                "name": s_name,
                "nomenclature": s_nom,
                "theme": s_theme,
                "longitude_tropical": round(s_lon_t, 4),
                "sign_tropical": s_sign_t,
                "degree_tropical": round(s_deg_t, 2),
                "longitude_sidereal": round(s_lon_s, 4),
                "sign_sidereal": s_sign_s,
                "degree_sidereal": round(s_deg_s, 2),
            }
            fixed_stars.append(star_record)

            for target_name, target_lon in check_targets.items():
                if target_lon is None:
                    continue
                diff = abs(target_lon - s_lon_t)
                if diff > 180.0:
                    diff = 360.0 - diff
                if diff <= 1.5:  # 1.5° conjunction orb
                    fixed_star_conjunctions.append({
                        "star": s_name,
                        "planet_or_angle": target_name,
                        "separation_deg": round(diff, 3),
                        "orb_type": "Tight Conjunction (<1.5°)",
                        "interpretation": f"{target_name} conjunct {s_name} ({s_nom}): {s_theme}"
                    })
        except Exception:
            pass

    # 7. Independent Validator: Skyfield (JPL DE421)
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

    # 8. Boundary Distances (Ascendant and Cusps)
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
        "house_system": hsys_name,
        "angles": {
            "tropical": {
                "ascendant": asc_deg,
                "ascendant_sign": asc_sign_t,
                "ascendant_degree": asc_deg_in_sign,
                "mc": mc_deg,
                "vertex": vertex_deg,
                "equatorial_ascendant": eq_asc_deg,
            },
            "sidereal": {
                "ascendant": asc_sidereal,
                "ascendant_sign": asc_sign_s,
                "ascendant_degree": asc_sid_deg_in_sign,
                "mc": mc_sidereal,
                "vertex": (vertex_deg - ayanamsha_deg) % 360.0 if has_birth_time else 0.0,
            }
        },
        "houses_cusps": houses_cusps,
        "houses_whole_sign": houses_whole_sign,
        "houses_tropical": houses_tropical,
        "planets_tropical": planets_tropical,
        "planets_sidereal": planets_sidereal,
        "minor_bodies_tropical": minor_bodies_tropical,
        "minor_bodies_sidereal": minor_bodies_sidereal,
        "fixed_stars": fixed_stars,
        "fixed_star_conjunctions": fixed_star_conjunctions,
        "boundary_distances": {
            "tropical_asc_to_cusp_deg": round(dist_to_asc_cusp, 4),
            "sidereal_asc_to_cusp_deg": round(dist_to_sid_asc_cusp, 4),
            "sidereal_asc_to_navamsha_cusp_deg": round(dist_to_navamsha_cusp, 4),
            "is_asc_boundary_sensitive": dist_to_asc_cusp < 1.0 or dist_to_navamsha_cusp < 0.2,
        },
        "verification_diffs": verification_diffs,
        "has_validator_alert": has_validator_alert,
    }
